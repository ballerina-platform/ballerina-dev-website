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
import ballerinax/googleapis.gmail as gmail;
import ballerina/mime;
import ballerinax/salesforce as sfdc;
import ballerina/lang.runtime;
import ballerinax/openai.chat as openAI;

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

final string label = "Lead";

public function main() returns error? {
    while true {
        Email[] emails = check getEmails(label);

        Lead[] leads = [];
        from Email email in emails
        do {
            Lead|error lead = generateLead(email.'from, email.subject, email.body);
            if lead is Lead {
                leads.push(lead);
            }
        };

        check addLeadsToSalesforce(leads);

        runtime:sleep(600);
    }
}

function getEmails(string label) returns Email[]|error {
    gmail:Client gmailClient = check new ({auth: {token: gmailAccessToken}});

    string[] labelIdsToMatch = check getLabelIds(gmailClient, [label]);
    if (labelIdsToMatch.length() == 0) {
        error e = error("Unable to find any labels to match.");
        return e;
    }

    gmail:MailThread[] matchingMailThreads = check getMatchingMailThreads(gmailClient, labelIdsToMatch);
    removeLabels(gmailClient, matchingMailThreads, labelIdsToMatch);

    gmail:Message[] matchingEmails = getMatchingEmails(gmailClient, matchingMailThreads);

    Email[] emails = [];
    from gmail:Message message in matchingEmails
    do {
        Email|error email = parseEmail(message);
        if email is Email {
            emails.push(email);
        }    
    };
    
    return emails;
}

function getLabelIds(gmail:Client gmailClient, string[] labelsToMatch) returns string[]|error {
    gmail:LabelList labelList = check gmailClient->listLabels("me");

    return from gmail:Label label in labelList.labels
        where labelsToMatch.indexOf(label.name) != ()
        select label.id;
}

function getMatchingMailThreads(gmail:Client gmailClient, string[] labelIdsToMatch) returns gmail:MailThread[]|error {
    gmail:MsgSearchFilter searchFilter = {
        includeSpamTrash: false,
        labelIds: labelIdsToMatch
    };

    stream<gmail:MailThread, error?>|error mailThreadStream = gmailClient->listThreads(filter = searchFilter);
    if mailThreadStream is error {
        return mailThreadStream;
    }

    return check from gmail:MailThread mailThread in mailThreadStream
        select mailThread;
}

function removeLabels(gmail:Client gmailClient, gmail:MailThread[] mailThreads, string[] labelIds) {
    from gmail:MailThread mailThread in mailThreads
    do {
        gmail:MailThread|error removeLabelResponse = gmailClient->modifyThread(mailThread.id, [], labelIds);
        if removeLabelResponse is error {
            log:printError("An error occured in removing the labels from the thread.", removeLabelResponse, removeLabelResponse.stackTrace(), threadId = mailThread.id, labelIds = labelIds);
        }
    };
}

function getMatchingEmails(gmail:Client gmailClient, gmail:MailThread[] mailThreads) returns gmail:Message[] {
    gmail:Message[] messages = [];
    _ = from gmail:MailThread mailThread in mailThreads
        do {
            gmail:MailThread|error response = gmailClient->readThread(mailThread.id);
            if response is error {
                log:printError("An error occured while reading the email.", response, response.stackTrace(), threadId = mailThread.id);
            } else {
                messages.push((<gmail:Message[]>response.messages)[0]);
            }
        };

    return messages;
}

function parseEmail(gmail:Message message) returns Email|error {
    string 'from = <string>message.headerFrom;
    string subject = <string>message.headerSubject;
    string body = <string>(check mime:base64Decode(<string>(<gmail:MessageBodyPart>message.emailBodyInText).data));

    return {
        'from: 'from,
        subject: subject,
        body: body
    };
}

function generateLead(string 'from, string subject, string body) returns Lead|error {
    openAI:Client openAIClient = check new ({
        auth: {token: openAIKey}
    });

    openAI:CreateChatCompletionRequest request = {
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
                    designation__c: string // Not mandator. Use N/A if unable to find
                }

            Here is the email:    
            {
                from: \${'from},
                subject: \${subject},
                body: \${body}
            }
        \`
            }
        ]
    };

    openAI:CreateChatCompletionResponse response = check openAIClient->/chat/completions.post(request);

    Lead result = check (<string>response.choices[0].message?.content).fromJsonStringWithType(Lead);
    return result;
}

function addLeadsToSalesforce(Lead[] leads) returns error? {
    sfdc:Client sfdcClient = check new ({
        baseUrl: salesforceBaseUrl,
        auth: {token: salesforceAccessToken}
    });

    from Lead lead in leads
    do {
        sfdc:CreationResponse|error createResponse = check sfdcClient->create("EmailLead__c", lead);
        if createResponse is error {
            log:printError("An error occured while creating a Lead object on salesforce.", createResponse, createResponse.stackTrace(), lead = lead);
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
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>GMail to Salesforce Integration</title>

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
                <h1>GMail to Salesforce Integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>Salesforce is used by many organizations to centralize customer information,
                      aiming to enhance customer service, streamline sales, enable collaboration and obtain sales analytics.
                      However, managing customer interactions can be complex, involving various touch points and business units.
                      Therefore, integrating Salesforce with all related entities and automating the exchange of customer
                      information is essential to fully leverage its capabilities.</p>

                    <p>Ballerina, being a language specifically designed for integrations, can facilitate the integration of
                      Salesforce with all relevant systems and support any complex Salesforce integration use case.
                    </p>

                  </Col>
                  <Col xs={12} lg={6}>
                    <img src={`${prefix}/images/test-sahan/1.png`} alt="Position Ballerina" style={{ width: "-webkit-fill-available" }} />
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
