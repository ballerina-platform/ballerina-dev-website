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
import ballerina/log;
import ballerinax/github;
import wso2/choreo.sendemail as email;

configurable string githubAccessToken = ?;
configurable string repositoryName = ?;
configurable string repositoryOwner = ?;

configurable string recipientAddress = ?;

public function main() returns error? {
    github:Client githubClient = check new ({auth: {token: githubAccessToken}});
    stream<github:User,github:Error?> collaborators = check githubClient->getCollaborators(repositoryOwner, repositoryName);
    log:printInfo("Started compiling the report");
    string assigneeSummary = "";
    
    check collaborators.forEach(function (github:User user ){
        string query = "repo:" + repositoryOwner + "/" + repositoryName + " is:issue assignee:" + user.login;
        github:SearchResult|github:Error issuesForAssignee = githubClient-> search(query, github:SEARCH_TYPE_ISSUE, 1);
        if issuesForAssignee is github:SearchResult {
            string userName = user?.name ?: "Unknown Name";
            assigneeSummary += string \`\${userName} : \${issuesForAssignee.issueCount} \${"\\n"}\`;
        } else {
            log:printError("Error while searching issues of an assignee.",'error = issuesForAssignee);
        }
    });
  
    string query1 = "repo:" + repositoryOwner + "/" + repositoryName + " is:issue is:open";
    github:SearchResult|github:Error openIssues = githubClient-> search(query1, github:SEARCH_TYPE_ISSUE, 1);
    if openIssues is github:Error {
        log:printError("Error while searching open issues.", 'error = openIssues);
    }
    int totalOpenIssueCount = openIssues is github:SearchResult? openIssues.issueCount : 0;

    string query2 = "repo:" + repositoryOwner + "/" + repositoryName + " is:issue is:closed";
    github:SearchResult|github:Error closedIssues = githubClient-> search(query2, github:SEARCH_TYPE_ISSUE, 1);
    if closedIssues is github:Error {
        log:printError("Error while searching closed issues.", 'error = closedIssues);
    }
    int totalClosedIssueCount = closedIssues is github:SearchResult? closedIssues.issueCount :0;

    string issueSummary = string \`ISSUE SUMMARY REPORT\${"\\n\\n"}Repository Name: \${repositoryName}
        \${"\\n"}Total Issues Open: \${totalOpenIssueCount} \${"\\n"}Total Issues Closed: \${totalClosedIssueCount}
        \${"\\n\\n"}Issue Count by Assignee: \${"\\n"}\${assigneeSummary} \${"\\n"}\`;
    email:Client emailClient = check new ();
    string sendEmailResponse = check emailClient->sendEmail(recipientAddress, "Git Issue Summary", issueSummary);
    log:printInfo("Email sent successfully \\n " + sendEmailResponse);
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
          <title>GitHub to Email Integration</title>

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
                  <h1>GitHub to Email Integration</h1>
                </Container>
              </Col>


            </Row>

            <Row className="pageContentRow llanding">

              <Col xs={12}>
                <Container>
                  <Row>
                    <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                      <p>Fetching GitHub issue summaries directly to email through seamless integration holds significant value
                        for streamlined project management and efficient collaboration.
                        By receiving summarized updates on GitHub issues directly in their email inboxes, team members can stay
                        informed about the project's progress without the need to constantly visit the GitHub platform.
                        This integration not only simplifies communication but also ensures that crucial issue updates are never missed,
                        enhancing responsiveness and facilitating prompt issue resolution</p>

                      <p>The code sample below illustrates how to get GitHub issues summary as a email using ballerina integration.
                      </p>

                    </Col>
                    <Col xs={12} lg={6} className="text-center">

                      {/* Use when there is an image from README */}

                       <img src={`${prefix}/images/pre-built/flow_diagrams/github-to-gmail-integration.png`} alt="Position Ballerina" style={{ width: "-webkit-fill-available" }} />

                      {/* Use when there is no image from README and to show the diagram */}

                      {/*<LightBoxImage*/}
                      {/*    thumbnail={`${prefix}/images/pre-built/sample2-thumb.png`}*/}
                      {/*    diagram={`${prefix}/images/gmail-diagram.png`} />*/}



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
                            thumbnail={`${prefix}/images/pre-built/sequence-diagrams/github-to-email-integration_cropped.png`}
                            diagram={`${prefix}/images/pre-built/sequence-diagrams/github-to-email-integration.png`} />

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
