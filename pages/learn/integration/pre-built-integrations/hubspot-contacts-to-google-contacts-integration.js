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

import LightGallery from 'lightgallery/react';

// // import styles
// import 'lightgallery/css/lightgallery.css';
// import 'lightgallery/css/lg-zoom.css';
// import 'lightgallery/css/lg-thumbnail.css';

// // If you want you can use SCSS instead of css
// import 'lightgallery/scss/lightgallery.scss';
// import 'lightgallery/scss/lg-zoom.scss';

// // import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

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
    gPeople:Client gPeopleClient = check new ({auth: {token: gPeopleAccessToken}});
    hubspotContact:Client hubspotClient = check new ({auth: {token: hubspotAccessToken}});
    hubspotContact:CollectionResponseSimplePublicObjectWithAssociationsForwardPaging hubspotResponse = check hubspotClient->getPage();

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
        
        gPeople:PersonResponse|error createdContact = gPeopleClient->createContact(googleContact, personFields);
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

  const onInit = () => {
    console.log('lightGallery has been initialized');
  };

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
        <title>Hubspot Contacts to Google Contacts Integration</title>

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
                <h1>Hubspot Contacts to Google Contacts Integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>The importance of synchronizing different types of contact storages lies in the seamless organization, 
                      accessibility, and effective communication it facilitates. In our interconnected world, contacts are 
                      spread across various platforms such as smartphones, email accounts, social networks, and professional databases. 
                      Synchronization ensures that contact details remain consistent and updated across all these sources, saving time 
                      and preventing discrepancies. This harmonization simplifies communication, as users can easily access the right 
                      information when needed. Whether it's connecting with friends, colleagues, or clients, synchronized contact storages 
                      foster efficient and reliable interaction</p>

                    <p>The code sample below illustrates how to sync Hubspot and Google Contacts using Ballerina integration.
                    </p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center">
                    {/* <img src={`${prefix}/images/slide_diagram-new-v6-final.png`} alt="Position Ballerina" style={{ width: "-webkit-fill-available" }} /> */}

                    <LightGallery
                onInit={onInit}
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
            >
                <a href={`${prefix}/images/pre-built/sequence-diagrams/hubspot-contacts-to-google-contacts-integration.png`}>
                    <img alt="img1" src={`${prefix}/images/pre-built/sequence-diagrams/hubspot-contacts-to-google-contacts-integration_cropped.png`} height={300}/>
                </a>

            </LightGallery>
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
