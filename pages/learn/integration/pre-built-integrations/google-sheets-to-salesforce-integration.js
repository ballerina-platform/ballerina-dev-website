/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import { Row, Col, Container } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

import Layout from "../../../../layouts/LayoutLearn";
import { prefix } from '../../../../utils/prefix';
import { getHighlighter } from "shiki";

export async function getStaticProps() {
  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const content = `
import ballerina/log;
import ballerinax/googleapis.sheets;
import ballerinax/salesforce as sfdc;

public type Contact record {|
    string Id;
    string Email;
|};

const int HEADINGS_ROW = 1;

// Google sheets configuration parameters
configurable string spreadsheetId = ?;
configurable string worksheetName = ?;
configurable string duplicateWorksheetName = ?;
configurable string gSheetsAccessToken = ?;

// Salesforce configuration parameters
configurable string salesforceAccessToken = ?;
configurable string salesforceBaseUrl = ?;

sheets:Client sheetsClient = check new ({auth: {token: gSheetsAccessToken}});

sfdc:Client sfdcClient = check new ({
    baseUrl: salesforceBaseUrl,
    auth: {
        token: salesforceAccessToken
    }
});

public function main() returns error? {
    sheets:Range range = check sheetsClient->getRange(spreadsheetId, worksheetName, "A1:G");
    (int|string|decimal)[] headers = range.values[0];
    foreach (int|string|decimal)[] item in range.values.slice(HEADINGS_ROW) {
        int? indexOfEmail = headers.indexOf("Email");
        if indexOfEmail is () {
            return error("Email column not found");
        }
        stream<Contact, error?> retrievedStream = check sfdcClient->query(
            string \`SELECT Id, Email FROM Contact WHERE Email='\${item[indexOfEmail]}'\`);
        if retrievedStream.next() !is () {
            log:printInfo(string \`Contact already exists. Email : \${item[indexOfEmail]}\`);
            _ = check sheetsClient->appendValue(spreadsheetId, item, {sheetName: duplicateWorksheetName});
            continue;
        }
        record {} newContact = map from int index in 0 ..< headers.length()
            let int|string|decimal header = headers[index]
            select [header.toString(), item[index]];

        _ = check sfdcClient->create("Contact", newContact);
        log:printInfo(string \`Contact created successfully!. Email : \${item[indexOfEmail]}\`);
    }
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
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Google Sheets to Salesforce Integration</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina - Learn" />
        <meta
          property="og:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="twitter:text:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
      </Head>

      <Layout>

        <Col sm={12}>
          <Row className="pageHeader pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <h1>Google Sheets to Salesforce Integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>Office productivity tools like Google Sheets are vital for employees' daily tasks,
                       including capturing customer and sales data such as contact information and support issues. This data must 
                       be pumped into Salesforce to maintain up-to-date records, often requiring validation and cleansing due 
                       to the ad-hoc nature of entering data. Ballerina can streamline this process by fetching data from these tools, 
                       performing necessary data processing, and pushing updates to Salesforce, either periodically or by listening to changes.
                    </p>

                    <p>The following code sample demonstrates an integration scenario in which contact details added to the google sheets gets 
                      periodically synched with the Salesforce Contacts.
                    </p>

                  </Col>
                  <Col xs={12} lg={6}>
                    <img src={`${prefix}/images/google-sheets-to-salesforce-integration.png`} alt="Position Ballerina" style={{ width: "-webkit-fill-available" }} />
                  </Col>
                </Row>

              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding" >
            <Col xs={12}>
              <Container>

                <div style={{
                  background: "#eeeeee", padding: "10px",
                  borderRadius: "5px",
                  marginTop: "20px",
                  backgroundColor: "#eeeeee !important"
                }}>
                  <CopyToClipboard text={content}
                    onCopy={() => codeCopy()} style={{float:"right"}}>
                    {
                      copied ? <FaCheck style={{ color: "20b6b0" }} title="Copied" /> : <FaRegCopy title="Copy" />
                    }
                  </CopyToClipboard>

                  <div className="highlight" dangerouslySetInnerHTML={{ __html: samples.code }} />
                </div>
              </Container>
            </Col>
          </Row>

        </Col>


      </Layout>
    </>
  );
}
