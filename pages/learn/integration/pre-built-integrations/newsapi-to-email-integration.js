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



// import LightGallery from 'lightgallery/react';

// // // import styles
// // import 'lightgallery/css/lightgallery.css';
// // import 'lightgallery/css/lg-zoom.css';
// // import 'lightgallery/css/lg-thumbnail.css';

// // // If you want you can use SCSS instead of css
// // import 'lightgallery/scss/lightgallery.scss';
// // import 'lightgallery/scss/lg-zoom.scss';

// // // import plugins if you need
// import lgThumbnail from 'lightgallery/plugins/thumbnail';
// import lgZoom from 'lightgallery/plugins/zoom';
import LightBoxImage from "../../../../components/common/lightbox/LightBoxImage";




export async function getStaticProps() {
  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const content = `
import ballerina/email;
import ballerina/log;
import ballerinax/newsapi;

// News API configuration
configurable newsapi:ApiKeysConfig apiKeyConfig = ?;

// Email client configuration parameters
configurable string smtpPassword = ?;
configurable string smtpUsername = ?;
configurable string smtpHost = ?;

// Email configuration parameters
configurable string fromAddress = ?;
configurable string emailAddress = ?;

public function main() returns error? {
    newsapi:Client newsapi = check new (apiKeyConfig, {}, "https://newsapi.org/v2");
    email:SmtpClient smtpClient = check new (smtpHost, smtpUsername, smtpPassword);
    newsapi:WSNewsTopHeadlineResponse topHeadlines = check newsapi->listTopHeadlines(sources = "bbc-news", page = 1);
    newsapi:WSNewsArticle[]? articles = topHeadlines?.articles;
    if articles is () || articles.length() == 0 {
        log:printInfo("No news found");
        return;
    }
    string mailBody = "BBC top news are,\\n";
    foreach newsapi:WSNewsArticle article in articles {
        string? title = article?.title;
        if title is string {
            mailBody = mailBody + string \`\${title}\${"\n"}\`;
        }
    }
    email:Message email = {
        to: emailAddress,
        'from: fromAddress,
        subject: "BBC Headlines",
        body: mailBody
    };
    check smtpClient->sendMessage(email);
    log:printInfo("Email sent successfully!");
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

  // const onInit = () => {
  //   console.log('lightGallery has been initialized');
  // };

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
        <title>NewsAPI to Email Integration</title>

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
                <h1>NewsAPI to Email Integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>Integrating news headlines directly into Gmail through NewsAPI and email integration
                      carries significant advantages in today's fast-paced information landscape. By seamlessly
                      delivering relevant and timely news updates within the familiar interface of Gmail, users
                      can effortlessly stay informed without the need to toggle between multiple platforms. This
                      integration not only enhances user convenience but also fosters efficient time management,
                      as individuals can access important headlines while managing their emails</p>

                    <p>The code sample below illustrates how to integrate newsAPI to recieve an email containing BBC headlines.
                    </p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center">

                    {/* Use when there is an image from README */}

                     <img src={`${prefix}/images/pre-built/flow_diagrams/newsapi-to-email-integration.png`} alt="Position Ballerina" style={{ width: "-webkit-fill-available" }} />

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
                        thumbnail={`${prefix}/images/pre-built/sequence-diagrams/newsapi-to-email-integration_cropped.png`}
                        diagram={`${prefix}/images/pre-built/sequence-diagrams/newsapi-to-email-integration.png`} />

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
