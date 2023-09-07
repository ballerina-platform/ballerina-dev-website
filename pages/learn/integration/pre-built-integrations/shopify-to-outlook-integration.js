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
import { Row, Col, Container, Tab, Tabs } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

import Layout from "../../../../layouts/LayoutLearn";
import { prefix } from '../../../../utils/prefix';
import { getHighlighter } from "shiki";
import LightBoxImage from "../../../../components/common/lightbox/LightBoxImage";




export async function getStaticProps() {
  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const content = `
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerinax/microsoft.onedrive;
import ballerinax/microsoft.outlook.mail;
import ballerinax/shopify.admin as shopify;

configurable string shopifyServiceUrl = ?;
configurable string xShopifyAccessToken = ?;

configurable string outlookAccessToken = ?;

configurable string oneDriveAccessToken = ?;
configurable string flyerFilePath = ?;

public function main() returns error? {
    shopify:Client shopify = check new ({xShopifyAccessToken: xShopifyAccessToken}, shopifyServiceUrl);
    mail:Client outlook = check new ({ auth: { token: outlookAccessToken }});
    onedrive:Client oneDrive = check new ({auth: { token: oneDriveAccessToken}});

    string dateOriginTime = time:utcToString(time:utcAddSeconds(time:utcNow(), -300.0));
    string currentTime = time:utcToString(time:utcNow());

    shopify:CustomerList customerList = check shopify->getCustomers(createdAtMin = dateOriginTime, createdAtMax = currentTime);
    shopify:Customer[] customers = customerList?.customers ?: [];
    mail:Recipient[] recepients = [];
    foreach shopify:Customer customer in customers {
        recepients.push({
            emailAddress: {
                address: customer?.email ?: "",
                name: customer?.first_name ?: ""
            }
        });
    }

    onedrive:File fileContents = check oneDrive->downloadFileByPath(flyerFilePath);
    byte[] byteContent = fileContents.content ?: [];

    if customers.length() > 0 {
        mail:FileAttachment attachment = {
            contentBytes: byteContent.toBase64(),
            contentType: "image/png",
            name: "flyer.png"
        };
        mail:MessageContent messageContent = {
            message: {
                subject: "Welcome to Our Store",
                importance: "normal",
                body: {
                    "contentType": "HTML",
                    "content": string \`<p> Hi There, <br/>
                        <h2> Welcome to Our Store </h2> <br/>
                        <strong> What happens next? <strong> <br/>
                        Keep an eye on your inbox as we’ll be sending you the best tips for [product/service]. <br/>
                        Want to get more out of Our Store? <br/> visit our store at Shopify </p>\` 
                },
                toRecipients: recepients,
                attachments: [attachment]
            },
            saveToSentItems: true
        };
        http:Response response = check outlook->sendMessage(messageContent);
        if response.statusCode == http:STATUS_ACCEPTED {
            log:printInfo(string \`Welcome emails sent successfully!\`);
        } else {
            return error("Failed to send the email from Outlook", statusCode = response.statusCode);
        }
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
        <title>Shopify to Outlook Integration</title>

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
                <h1>Shopify to Outlook Integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>Customer interactions hold immense significance in modern e-commerce. Seamless communication
                    through emails allows businesses to provide personalized support, timely updates, and relevant
                    recommendations to their customers. By integrating Shopify with email platforms, companies can
                    ensure that every customer interaction is both efficient and tailored to individual needs, enhancing
                    customer satisfaction. This integration also enables the automation of order confirmations, shipping
                    notifications, and even personalized product suggestions based on customer preferences and browsing
                    history. Such interactions not only strengthen customer relationships but also contribute to
                    increased sales and improved brand loyalty.</p>

                    <p>The code sample below illustrates how to integrate Shopify and Outlook to send
                      automatic welcome emails to new customers.</p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center">

                    {/* Use when there is an image from README */}

                     <img src={`${prefix}/images/pre-built/flow_diagrams/shopify-to-outlook-integration.png`} alt="Position Ballerina" style={{ width: "-webkit-fill-available" }} />

                    {/* Use when there is no image from README and to show the diagram */}

                    {/*<LightBoxImage*/}
                    {/*  thumbnail={`${prefix}/images/pre-built/sample2-thumb.png`}*/}
                    {/*  diagram={`${prefix}/images/gmail-diagram.png`} />*/}



                  </Col>
                </Row>

              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding" >
            <Col xs={12}>
              <Container>

                {/* Use the following section if there the diagram shown above */}

                {/* <div style={{
                      background: "#eeeeee", padding: "10px",
                      borderRadius: "5px",
                      marginTop: "20px",
                      backgroundColor: "#eeeeee !important"
                    }}>
                      <CopyToClipboard text={content}
                        onCopy={() => codeCopy()} style={{ float: "right" }}>
                        {
                          copied ? <FaCheck style={{ color: "20b6b0" }} title="Copied" /> : <FaRegCopy title="Copy" />
                        }
                      </CopyToClipboard>

                      <div className="highlight" dangerouslySetInnerHTML={{ __html: samples.code }} />
                    </div> */}


                {/* Use tabs if there the diagram is not shown above */}
                <Tabs className="mb-3 preBuilt">
                  <Tab eventKey="code" title="Code">
                    <div style={{
                      background: "#eeeeee", padding: "10px",
                      borderRadius: "5px",
                      marginTop: "20px",
                      backgroundColor: "#eeeeee !important"
                    }}>
                      <CopyToClipboard text={content}
                        onCopy={() => codeCopy()} style={{ float: "right" }}>
                        {
                          copied ? <FaCheck style={{ color: "20b6b0" }} title="Copied" /> : <FaRegCopy title="Copy" />
                        }
                      </CopyToClipboard>

                      <div className="highlight" dangerouslySetInnerHTML={{ __html: samples.code }} />
                    </div>
                  </Tab>
                  <Tab eventKey="diagram" title="Diagram">

                    <Col xs={12} lg={6} className="text-center">
                      <LightBoxImage
                        thumbnail={`${prefix}/images/pre-built/sequence-diagrams/shopify-to-outlook-integration_cropped.png`}
                        diagram={`${prefix}/images/pre-built/sequence-diagrams/shopify-to-outlook-integration.png`} />

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
