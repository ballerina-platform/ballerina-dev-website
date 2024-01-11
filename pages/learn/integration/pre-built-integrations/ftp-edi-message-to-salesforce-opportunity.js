/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Row, Col, Container, Tab, Tabs } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy, FaCheck, FaGithub } from 'react-icons/fa';

import Layout from "../../../../layouts/LayoutLearn";
import { prefix } from '../../../../utils/prefix';
import { getHighlighter } from "shiki";
import LightBoxImage from "../../../../components/common/lightbox/LightBoxImage";

export async function getStaticProps() {
  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const content = `
import ballerina/file;
import ballerina/ftp;
import ballerina/io;

import ballerinax/edifact.d03a.retail.mREQOTE;
import ballerinax/salesforce as sf;

configurable ftp:ClientConfiguration ftpConfig = ?;
configurable string ftpNewQuotesPath = ?;
configurable string ftpProcessedQuotesPath = ?;
configurable sf:ConnectionConfig salesforceConfig = ?;
configurable string salesforcePriceBookId = ?;

public function main() returns error? {
    sf:Client salesforce = check new (salesforceConfig);
    ftp:Client fileServer = check new ftp:Client(ftpConfig);

    // Get new quotes from the FTP new quotes directory, and iterate through them.
    ftp:FileInfo[] quoteList = check fileServer->list(ftpNewQuotesPath);
    foreach ftp:FileInfo quoteFile in quoteList {
        if !quoteFile.name.endsWith(".edi") {
            continue;
        }

        // Fetch the EDI file containing the quote from the FTP server.
        stream<byte[] & readonly, io:Error?> fileStream = check fileServer->get(quoteFile.path);
        string quoteText = check streamToString(fileStream);

        // Parse the EDI file and transform in to Ballerina record containing only the required data.
        mREQOTE:EDI_REQOTE_Request_for_quote_message quote = check mREQOTE:fromEdiString(quoteText);
        QuoteRequest quoteRequest = check transformQuoteRequest(quote);

        // Get the corresponding account Id and oppurtunity Id from Salesforce.
        // Create a new Opportunity if an Opportunity with the given name does not exist. 
        stream<Id, error?> accQuery = check salesforce->query(
            string \`SELECT Id FROM Account WHERE Name = '\${quoteRequest.accountName}'\`);
        record {|Id value;|}? account = check accQuery.next();
        check accQuery.close();
        if account is () {
            return error("Account not found. Account name: " + quoteRequest.accountName);
        }
        Opportunity opp = {
            Name: quoteRequest.oppName,
            AccountId: account.value.Id,
            Pricebook2Id: salesforcePriceBookId
        };
        string oppId = "";
        stream<Id, error?> oppQuery = check salesforce->query(
            string \`SELECT Id FROM Opportunity WHERE Name = '\${quoteRequest.oppName}'\`);
        record {|Id value;|}? existingOpp = check oppQuery.next();
        check oppQuery.close();
        if existingOpp is () {
            sf:CreationResponse oppResult = check salesforce->create("Opportunity", opp);
            oppId = oppResult.id;
        } else {
            oppId = existingOpp.value.Id;
        }

        // Create Opportunity line items for each item in the quote.
        foreach ItemData item in quoteRequest.itemData {
            stream<PriceBookEntry, error?> query = check salesforce->query(
              string \`SELECT UnitPrice FROM PricebookEntry WHERE Pricebook2Id = '01s6C000000UN4PQAW' AND Product2Id = '\${item.itemId}'\`);
            record {|PriceBookEntry value;|}? unionResult = check query.next();
            check query.close();
            if unionResult is () {
                return error(string \`Pricebook entry not found. Opportunity name: \${quoteRequest.oppName}, Item ID: \${item.itemId}\`);
            }
            OpportunityProduct oppProduct = {
                OpportunityId: oppId,
                Product2Id: item.itemId,
                Quantity: item.quantity,
                UnitPrice: unionResult.value.UnitPrice
            };
            _ = check salesforce->create("OpportunityLineItem", oppProduct);
        }

        // Move the processed quote to the processed quotes FTP directory.
        check fileServer->put(check file:joinPath(ftpProcessedQuotesPath, quoteFile.name), quoteText.toBytes());
        check fileServer->delete(quoteFile.path);
    }
}

function transformQuoteRequest(mREQOTE:EDI_REQOTE_Request_for_quote_message quote) returns QuoteRequest|error {
    QuoteRequest quoteRequest = {accountName: "", oppName: ""};
    mREQOTE:Segment_group_1_GType[] segmentGroup1 = quote.Segment_group_1;
    foreach mREQOTE:Segment_group_1_GType ref in segmentGroup1 {
        if ref.REFERENCE.REFERENCE.Reference_code_qualifier == "AES" {
            string? oppId = ref.REFERENCE.REFERENCE.Reference_identifier;
            if oppId is () {
                return error("Opportunity ID is not given");
            }
            quoteRequest.oppName = oppId;
        }
    }
    mREQOTE:Segment_group_11_GType[] segmentGroup11 = quote.Segment_group_11;
    foreach mREQOTE:Segment_group_11_GType party in segmentGroup11 {
        if party.NAME_AND_ADDRESS.Party_function_code_qualifier == "BY" {
            string? prospectId = party.NAME_AND_ADDRESS?.PARTY_IDENTIFICATION_DETAILS?.Party_identifier;
            if prospectId is () {
                return error("Prospect identifier not available in quote.");
            }
            quoteRequest.accountName = prospectId;
        }
    }
    mREQOTE:Segment_group_27_GType[] items = quote.Segment_group_27;
    foreach mREQOTE:Segment_group_27_GType item in items {
        string? itemId = item.LINE_ITEM.Line_item_identifier;
        if itemId is () {
            return error("Item ID is not given");
        }
        ItemData itemData = {itemId};
        mREQOTE:QUANTITY_Type[] quantities = item.QUANTITY;
        foreach mREQOTE:QUANTITY_Type quantity in quantities {
            if quantity.QUANTITY_DETAILS.Quantity_type_code_qualifier == "21" {
                int|error amount = int:fromString(quantity.QUANTITY_DETAILS.Quantity);
                if amount is error {
                    return error("Quantity must be a valid number.");
                }
                itemData.quantity = amount;
                break;
            }
        }
        quoteRequest.itemData.push(itemData);
    }
    return quoteRequest;
}

function streamToString(stream<byte[] & readonly, io:Error?> inStream) returns string|error {
    byte[] content = [];
    check inStream.forEach(function (byte[] & readonly chunk) {
        content.push(...chunk);
    });
    return string:fromBytes(content);
}
    
`;
  var samples = { code: highlighter.codeToHtml(content.replaceAll('```', '').trim(), { lang: 'ballerina' }) };

  return {
    props: {
      samples,
      content
    },
  };
}

export default function Learn({ samples, content }) {

  const [copied, setCopied] = React.useState(false);

  const codeCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }


  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Read EDI files from a given FTP location and create a Salesforce Opportunity"
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>FTP EDI message to Salesforce Opportunity - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="FTP EDI message to Salesforce Opportunity - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Read EDI files from a given FTP location and create a Salesforce Opportunity"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="FTP EDI message to Salesforce Opportunity - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Read EDI files from a given FTP location and create a Salesforce Opportunity"
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="FTP EDI message to Salesforce Opportunity - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Read EDI files from a given FTP location and create a Salesforce Opportunity"
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Read EDI files from a given FTP location and create a Salesforce Opportunity"
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
      </Head>

      <Layout>

        <Col sm={12}>

          <Row className="pageContentRow llanding pb-0">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} className="patternContent">
                    <Link href="/learn/pre-built-integrations/" passHref>
                      <div className="backToLanding">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="#3ad1ca"
                          className="bi bi-box-arrow-left ms-0"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                          />
                        </svg>
                        <p className="m-0 p-0">Back to pre-built integrations</p>
                      </div>
                    </Link>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>


          <Row className="pageHeader pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <h1>FTP EDI message to Salesforce Opportunity</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>Interactions between businesses, such as sending purchase orders and invoices, usually occur over
                      EDI-based B2B channels. On the other hand, sales and customer details related to such transactions
                      are maintained in Salesforce. Therefore, it&apos;s critical to bridge Salesforce with B2B channels in
                      order to automate the sales processes. For example, it is possible to update the status and
                      details of opportunities in Salesforce based on the exchange of EDI messages like `EDIFACT REQOTE`
                      (Request for quotation), `EDIFACT QUOTES` (Quotation response), `EDIFACT ORDERS` (Purchase order), etc.
                      Such integrations will eliminate the delays and inconsistencies in updating Salesforce and provide
                      up-to-date information for sales staff and decision makers.
                    </p>

                    <p>The code sample below reads `EDIFACT REQOTE` EDI files from a given FTP location and creates a Salesforce Opportunity.
                    </p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center mdContent">

                    <img src={`${prefix}/images/pre-built/flow_diagrams/ftp-edi-message-to-salesforce-opportunity.png`} alt="Flow Diagram" />

                  </Col>
                </Row>

              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding" >
            <Col xs={12}>
              <Container>

                {/* Use tabs if there the diagram is not shown above */}
                <Tabs className="mb-3 preBuilt">
                  <Tab eventKey="code" title="Code">
                    <div style={{
                      background: "#eeeeee", padding: "10px",
                      borderRadius: "5px",
                      marginTop: "20px",
                      backgroundColor: "#eeeeee !important"
                    }}>
                      <div style={{display: "flex", justifyContent: "end"}}>
                        <a href="https://github.com/ballerina-guides/integration-samples/tree/main/ftp-edi-message-to-salesforce-opportunity" target="_blank" rel="noreferrer" passHref title="Open on GitHub" style={{marginTop:"-5px"}}>
                          <FaGithub style ={{marginRight:"10px", color: "black"}}/>
                        </a>
                        <CopyToClipboard text={content}
                          onCopy={() => codeCopy()}>
                          {
                            copied ? <FaCheck style={{ color: "20b6b0" }} title="Copied" /> : <FaRegCopy title="Copy" />
                          }
                        </CopyToClipboard>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: samples.code }} />
                    </div>
                  </Tab>
                  <Tab eventKey="diagram" title="Diagram">

                    <Col xs={12} lg={6} className="text-center mdContent">
                      
                      <img src={`${prefix}/images/pre-built/sequence-diagrams/ftp-edi-message-to-salesforce-opportunity.png`} alt="Sequence Diagram" />

                    </Col>

                  </Tab>
                </Tabs>

              </Container>
            </Col>
          </Row>

        </Col>


      </Layout>
    </>
  );
}
