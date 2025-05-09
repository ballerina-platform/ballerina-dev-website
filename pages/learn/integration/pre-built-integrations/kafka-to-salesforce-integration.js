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
import { getSingletonHighlighter } from "shiki";
import LightBoxImage from "../../../../components/common/lightbox/LightBoxImage";




export async function getStaticProps() {
  const highlighter = await getSingletonHighlighter();
  await highlighter.loadTheme('github-light');
  await highlighter.loadLanguage('ballerina');
  const content = `
import ballerinax/kafka;
import ballerinax/salesforce as sf;

configurable string salesforceAccessToken = ?;
configurable string salesforceBaseUrl = ?;
configurable string salesforcePriceBookId = ?;

public type ProductPrice readonly & record {|
    string name;
    float unitPrice;
|};

public type ProductPriceUpdate readonly & record {|
    float UnitPrice;
|};

listener kafka:Listener orderListener = new (kafka:DEFAULT_URL, {
    groupId: "order-group-id",
    topics: "product_price_updates"
});

final sf:Client sfdcClient = check new ({
    baseUrl: salesforceBaseUrl,
    auth: {
        token: salesforceAccessToken
    }
});

service on orderListener {
    isolated remote function onConsumerRecord(ProductPrice[] prices) returns error? {
        foreach ProductPrice {name, unitPrice} in prices {
            stream<record {}, error?> retrievedStream = check sfdcClient->query(
                string \`SELECT Id FROM PricebookEntry 
                    WHERE Pricebook2Id = '\${salesforcePriceBookId}' AND 
                    Name = '\${name}'\`);
            record {}[] retrieved = check from record {} entry in retrievedStream
                select entry;
            anydata pricebookEntryId = retrieved[0]["Id"];
            if pricebookEntryId is string {
                ProductPriceUpdate updatedPrice = {UnitPrice: unitPrice};
                check sfdcClient->update("PricebookEntry", pricebookEntryId, updatedPrice);
            }
        }
    }
}
`;
  var samples = { code: highlighter.codeToHtml(content.replaceAll('```', '').trim(), { lang: 'ballerina', theme: 'github-light' }) };

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
          content="Update price book in Salesforce for each new message in Kafka"
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Kafka to Salesforce integration - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Kafka to Salesforce integration - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Update price book in Salesforce for each new message in Kafka"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Kafka to Salesforce integration - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Update price book in Salesforce for each new message in Kafka"
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Kafka to Salesforce integration - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Update price book in Salesforce for each new message in Kafka"
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Update price book in Salesforce for each new message in Kafka"
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
                <h1>Kafka to Salesforce integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>In enterprises, business data like inventory levels, order statuses, or product prices change
                      constantly, and multiple entities require access to these updates. Utilizing messaging systems
                      like Kafka enables the real-time consumption of this information by multiple parties. Keeping
                      Salesforce updated with frequently changing information such as current pricing is vital for the
                      sales staff. Ballerina&apos;s connectors and streaming capabilities facilitate this integration,
                      allowing seamless connections between Salesforce and streaming data sources. It ensures that
                      transformed and filtered data is constantly pushed to Salesforce, keeping all relevant information
                      current and accessible.</p>

                    <p>The example below demonstrates how to update Salesforce price books in real-time
                      based on the prices published to a Kafka topic.</p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center mdContent">

                    <img src={`${prefix}/images/pre-built/flow_diagrams/kafka-to-salesforce-integration.png`} alt="Sequence Diagram" />

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
                        <a href="https://github.com/ballerina-guides/integration-samples/tree/main/kafka_salesforce_integration" target="_blank" rel="noreferrer" passHref title="Open on GitHub" style={{marginTop:"-5px"}}>
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
                  {/*<Tab eventKey="diagram" title="Diagram">*/}

                  {/*  <Col xs={12} lg={6} className="text-center">*/}
                  {/*    <LightBoxImage*/}
                  {/*      thumbnail={`${prefix}/images/pre-built/sample2-thumb.png`}*/}
                  {/*      diagram={`${prefix}/images/gmail-diagram.png`} />*/}

                  {/*  </Col>*/}

                  {/*</Tab>*/}
                </Tabs>

              </Container>
            </Col>
          </Row>

        </Col>


      </Layout>
    </>
  );
}
