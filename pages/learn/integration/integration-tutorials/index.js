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
        <title>Integration tutorials</title>

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
        <meta property="og:title" content="Ballerina: Integration tutorials" />
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
                <h1>Integration tutorials</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12} md={12}>
              <Container>
                <p>
                  Step-by-step guides on how you can develop your integration scenarios in Ballerina.
                </p>
              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding">
            <Col xs={12} md={12}>
              <Container>
                <Row>
                  {/* Left Column */}
                  <SampleList
                    name="Sending a message to a service"
                    description="Use an HTTP client in a service to send a message to another service"
                    tags={["HTTP Client", "HTTP Service", "REST API", "Data Binding", "Integration"]}
                    icon={false}
                  />

                  <SampleList
                    name="Content-based message routing"
                    description="Route requests based on message content"
                    tags={["Content-based Routing", "HTTP Client", "HTTP Service", "REST API", "Data Binding", "Integration"]}
                    icon={false}
                  />

                  <SampleList
                    name="Service orchestration"
                    description="Integrate several services and expose them as a single service"
                    tags={["Service Orchestration", "HTTP Client", "HTTP Service", "REST API", "Data Binding", "Integration"]}
                    icon={false}
                  />

                  <SampleList
                    name="Transforming message formats"
                    description="Transform messages from one format to another"
                    tags={["Data Mapper", "Data Transformation", "HTTP Client", "HTTP Service", "REST API", "Data Binding", "Integration"]}
                    icon={false}
                  />

                  <SampleList
                    name="Sending emails from a service"
                    description="Use the SMTP protocol to send emails from a service"
                    tags={["Email", "SMTP Client", "HTTP Client", "HTTP Service", "REST API", "Integration"]}
                    icon={false}
                  />

                  {/* <SampleList
                    name="File processing"
                    description="File processing"
                    tags={["File Processing", "Persistence", "Integration"]}
                    icon={false}
                  /> */}


                </Row>
              </Container>
            </Col>
          </Row>

        </Col>


      </Layout>
    </>
  );
}
