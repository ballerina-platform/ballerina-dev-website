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


export async function getStaticProps() {
  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const content = `
import ballerina/lang.runtime;
import ballerina/log;
import ballerina/mime;
import ballerinax/googleapis.gmail;
import ballerinax/openai.chat;
import ballerinax/salesforce as sf;

type Email record {|
    string 'from;
    string subject;
    string body;
|};

type Name record {|
    string firstName__c;
    string lastName__c;
|};

type Lead record {|
    *Name;
    string email__c;
    string phoneNumber__c;
    string company__c;
    string designation__c;
|};

configurable string gmailAccessToken = ?;
configurable string openAIKey = ?;
configurable string salesforceBaseUrl = ?;
configurable string salesforceAccessToken = ?;

const LABEL = "Lead";

final gmail:Client gmail = check new ({auth: {token: gmailAccessToken}});
final chat:Client openAiChat = check new ({auth: {token: openAIKey}});
final sf:Client salesforce = check new ({baseUrl: salesforceBaseUrl, auth: {token: salesforceAccessToken}});

public function main() returns error? {
    while true {
        Email[] emails = check getEmails(LABEL);
        Lead[] leads = from Email email in emails
                       let Lead? lead = generateLead(email)
                       where lead is Lead
                       select lead;
        addLeadsToSalesforce(leads);
        runtime:sleep(600);
    }
}

function getEmails(string label) returns Email[]|error {
    string[] labelIdsToMatch = check getLabelIds(gmail, [label]);
    if labelIdsToMatch.length() == 0 {
        return error("Unable to find any labels to match.");
    }

    gmail:MailThread[] matchingMailThreads = check getMatchingMailThreads(gmail, labelIdsToMatch);
    removeLabels(gmail, matchingMailThreads, labelIdsToMatch);
    gmail:Message[] matchingEmails = getMatchingEmails(gmail, matchingMailThreads);

    return from gmail:Message message in matchingEmails
           let Email|error email = parseEmail(message)
           where email is Email
           select email;
}

function getLabelIds(gmail:Client gmail, string[] labelsToMatch) returns string[]|error {
    gmail:LabelList labelList = check gmail->listLabels("me");
    return from gmail:Label {name, id} in labelList.labels
           where labelsToMatch.indexOf(name) != ()
           select id;
}

function getMatchingMailThreads(gmail:Client gmail, string[] labelIdsToMatch) returns gmail:MailThread[]|error {
    gmail:MsgSearchFilter searchFilter = {
        includeSpamTrash: false,
        labelIds: labelIdsToMatch
    };

    return from gmail:MailThread mailThread in check gmail->listThreads(filter = searchFilter)
           select mailThread;
}

function removeLabels(gmail:Client gmail, gmail:MailThread[] mailThreads, string[] labelIds) {
    foreach gmail:MailThread mailThread in mailThreads {
        gmail:MailThread|error removeLabelResponse = gmail->modifyThread(mailThread.id, [], labelIds);
        if removeLabelResponse is error {
            log:printError("An error occured in removing the labels from the thread.",
                removeLabelResponse, removeLabelResponse.stackTrace(), threadId = mailThread.id, labelIds = labelIds);
        }
    }
}

function getMatchingEmails(gmail:Client gmail, gmail:MailThread[] mailThreads) returns gmail:Message[] {
    gmail:Message[] messages = [];

    foreach gmail:MailThread mailThread in mailThreads {
        gmail:MailThread|error response = gmail->readThread(mailThread.id);
        if response is error {
            log:printError("An error occured while reading the email.", 
                response, response.stackTrace(), threadId = mailThread.id);
            continue;
        }

        if !(response.messages is gmail:Message[]) || (<gmail:Message[]>response.messages).length() < 1 {
            log:printError("Unable to find any messages in the thread.", threadId = mailThread.id);
            continue;
        }

        messages.push((<gmail:Message[]>response.messages)[0]);
    }

    return messages;
}

function parseEmail(gmail:Message message) returns Email|error {
    do {
        gmail:MessageBodyPart bodyPart = check message.emailBodyInText.ensureType(gmail:MessageBodyPart);
        string bodyPartText = check bodyPart.data.ensureType(string);
        string body = check mime:base64Decode(bodyPartText).ensureType(string);

        return {
            'from: check message.headerFrom.ensureType(string),
            subject: check message.headerSubject.ensureType(string),
            body: body
        };
    } on fail error e {
        log:printError("An error occured while parsing the email.", e, e.stackTrace(), message = message);
        return e;
    }
}

function generateLead(Email email) returns Lead? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: string \`
            Extract the following details in JSON from the email.
                {
                    firstName__c: string, // Mandatory
                    lastName__c: string, // Mandatory
                    email__c: string // Mandatory
                    phoneNumber__c: string, // With country code. Use N/A if unable to find
                    company__c: string, // Mandatory
                    designation__c: string // Not mandatory. Use N/A if unable to find
                }

            Here is the email:    
            {
                from: \${email.'from},
                subject: \${email.subject},
                body: \${email.body}
            }
        \`
            }
        ]
    };

    do {
        chat:CreateChatCompletionResponse response = check openAiChat->/chat/completions.post(request);
        if response.choices.length() < 1 {
            check error("Unable to find any choices in the response.");
        }
        string content = check response.choices[0].message?.content.ensureType(string);
        return check content.fromJsonStringWithType(Lead);
    } on fail error e {
        log:printError("An error occured while generating the lead.", e, e.stackTrace(), email = email);
        return;
    }
}

function addLeadsToSalesforce(Lead[] leads) {
    from Lead lead in leads
    do {
        sf:CreationResponse|error createResponse = salesforce->create("EmailLead__c", lead);
        if createResponse is error {
            log:printError("An error occured while creating a Lead object on salesforce.", 
                createResponse, createResponse.stackTrace(), lead = lead);
        } else {
            log:printInfo("Lead successfully created.", lead = lead);
        }
    };
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
          content="Create a lead for each new marketing email in Gmail"
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Gmail to Salesforce integration - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Gmail to Salesforce integration - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Create a lead for each new marketing email in Gmail"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Gmail to Salesforce integration - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Create a lead for each new marketing email in Gmail"
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Gmail to Salesforce integration - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Create a lead for each new marketing email in Gmail"
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Create a lead for each new marketing email in Gmail"
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
                <h1>Gmail to Salesforce integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>
                      In today&apos;s fast-paced business landscape, effective customer relationship management (CRM) has become a linchpin of success.
                      Salesforce, a leading CRM platform, empowers organizations to streamline their sales, marketing, and customer support efforts,
                      providing invaluable insights into customer interactions. However, to truly harness the full potential of Salesforce,
                      seamless integration with essential communication tools like email clients is imperative.</p>

                    <p>The example below demonstrates how to integrate Gmail and Salesforce to create new leads in Salesforce for each new marketing email.
                    </p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center mdContent">

                    <img src={`${prefix}/images/pre-built/flow_diagrams/gmail-to-salesforce-integration.png`} alt="Flow Diagram" />

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
                        <a href="https://github.com/ballerina-guides/integration-samples/tree/main/gmail-to-salesforce-lead" target="_blank" rel="noreferrer" passHref title="Open on GitHub" style={{marginTop:"-5px"}}>
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
                      <img src={`${prefix}/images/pre-built/sequence-diagrams/gmail-to-salesforce-integration.png`} alt="Sequence Diagram" />

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
