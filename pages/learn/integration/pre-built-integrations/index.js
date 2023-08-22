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

import Layout from "../../../../layouts/LayoutLearn";
import SampleList from "../../../../components/common/sample-list/SampleList";
import { prefix } from '../../../../utils/prefix';

export default function Learn() {

  const getLink = (element, id) => {
    if (element.tagName.toLowerCase() === "path")
      element = element.parentElement;

    const elementNodeList = document.querySelectorAll(`#${id}`);
    const elementArray = Array.prototype.slice.call(elementNodeList);
    const count = elementArray.indexOf(element.parentElement);

    if (count === 0) {
      location.hash = `#${id}`;
    } else {
      location.hash = `#${id}-${count}`;
    }

    navigator.clipboard.writeText(window.location.href);
    element.parentElement.scrollIntoView();
  };

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
        <title>Pre-built integrations</title>

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
        <meta property="og:title" content="Ballerina: Pre-built integrations" />
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
                <h1>Pre-built integrations</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12} md={12}>
              <Container>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding" >
            <Col xs={12}>
              <Container>
                {/* Repeat the SampleList component */}
                <SampleList name="Google Sheets to Salesforce Integration" description="Create a new contact in Salesforce for each new row is added to a Google Sheet"
                  tags={["Google Sheets", "Salesforce", "Integration", "CRM"]} />

                <SampleList name="Kafka to Salesforce Integration" description="Update pricebook in Salesforce for each new message in Kafka"
                  tags={["Kafka", "Salesforce", "Integration", "CRM"]} />

                <SampleList name="MySQL to Salesforce Integration" description="Create a new product in Salesforce for each new record is added to a MySQL table"
                  tags={["Salesforce", "Integration", "CRM", "MySQL"]} />

                <SampleList name="Salesforce to Twilio Integration" description="Send a SMS for each new lead in Salesforce"
                  tags={["Salesforce", "Integration", "CRM", "Twilio"]} />

                <SampleList name="GMail to Salesforce Integration" description="Create lead for each new marketing email in GMail"
                  tags={["Salesforce", "Integration", "CRM", "GMail"]} />

                <SampleList name="NewsAPI to Email Integration" description="Fetch BBC top headlines and send as email to recipient"
                  tags={["NewsAPI", "Integration", "Email"]} />

                <SampleList name="GitHub to Email Integration" description="Generate a GitHub issue summary report and email to a specified email address"
                  tags={["Github", "Integration", "Email"]} />
                
                <SampleList name="Shopify to Outlook Integration" description="Send Welcome Email using MS Outlook to New Shopify Customers"
                  tags={["Outlook", "Integration", "Shopify"]} />
                
                <SampleList name="Google Drive to OneDrive Integration" description="Sync Google Drive files to Microsoft OneDrive"
                  tags={["OneDrive", "Integration", "Google Drive"]} />

                <SampleList name="Hubspot contacts to Google Contacts Integration" description="Sync Hubspot Contacts with Google Contacts"
                  tags={["Hubspot", "Integration", "Google Contacts"]} />

              </Container>
            </Col>
          </Row>

        </Col>


      </Layout>
    </>
  );
}
