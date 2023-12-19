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
import ballerina/log;
import ballerinax/googleapis.people as gPeople;
import ballerinax/hubspot.crm.contact as hubspotContact;

configurable string gPeopleAccessToken = ?;
configurable string hubspotAccessToken = ?;

final gPeople:FieldMask[] personFields = [gPeople:NAME, gPeople:EMAIL_ADDRESS];
public function main() returns error? {
    gPeople:Client gPeople = check new ({auth: {token: gPeopleAccessToken}});
    hubspotContact:Client hubspot = check new ({auth: {token: hubspotAccessToken}});
    hubspotContact:CollectionResponseSimplePublicObjectWithAssociationsForwardPaging hubspotResponse 
        = check hubspot->getPage();

    foreach hubspotContact:SimplePublicObjectWithAssociations hubspotContact in hubspotResponse.results {
        map<anydata> contactProperties = hubspotContact.properties;
        gPeople:EmailAddress emailAddress = {};
        gPeople:Name name = {};
        gPeople:Person googleContact = {};
    
        anydata emailInHubspot = contactProperties["email"];
        if emailInHubspot is string {
            emailAddress.value = emailInHubspot;
            googleContact.emailAddresses = [emailAddress];
        }

        anydata firstnameInHubspot = contactProperties["firstname"];
        if firstnameInHubspot is string {
            name.givenName = firstnameInHubspot;
        }

        anydata lastnameInHubspot = contactProperties["lastname"];
        if lastnameInHubspot is string {
            name.familyName = lastnameInHubspot;
        }

        if name?.givenName is string || name?.familyName is string {
            googleContact.names = [name];
        }
        
        gPeople:PersonResponse|error createdContact = gPeople->createContact(googleContact, personFields);
        if createdContact is error {
            log:printError(string \`Failed to add contact \${hubspotContact.id} to Google Contacts!\`, createdContact);
            continue;
        }
        log:printInfo(string \`Contact \${hubspotContact.id} added to Google Contacts successfully!\`);
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
          content="Sync HubSpot Contacts with Google Contacts"
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>HubSpot contacts to Google Contacts integration - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="HubSpot contacts to Google Contacts integration - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Sync HubSpot Contacts with Google Contacts"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="HubSpot contacts to Google Contacts integration - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Sync HubSpot Contacts with Google Contacts"
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="HubSpot contacts to Google Contacts integration - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Sync HubSpot Contacts with Google Contacts"
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-swan-lake-pre-built-integrations-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Sync HubSpot Contacts with Google Contacts"
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
                <h1>HubSpot contacts to Google Contacts integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>Synchronizing contact storages across platforms like smartphones, emails, and social networks
                      ensures seamless organization and communication. By keeping contacts updated and consistent,
                      synchronization saves time and prevents errors, enabling quick and reliable interactions with
                      friends, colleagues, and clients.</p>

                    <p>The example below demonstrates how to sync HubSpot and Google Contacts using Ballerina integration features.
                    </p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center mdContent">

                    <img src={`${prefix}/images/pre-built/flow_diagrams/hubspot-contacts-to-google-contacts-integration.png`} alt="Flow Diagram" />

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
                        <a href="https://github.com/ballerina-guides/integration-samples/tree/main/hubspot-contacts-to-google-contacts" target="_blank" rel="noreferrer" passHref title="Open on GitHub" style={{marginTop:"-5px"}}>
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
                      <img src={`${prefix}/images/pre-built/sequence-diagrams/hubspot-contacts-to-google-contacts-integration.png`} alt="Sequence Diagram" />

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
