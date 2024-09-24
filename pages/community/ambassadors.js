/**
 * Copyright (c) 2024, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Head from 'next/head';

import Layout from '../../layouts/LayoutCommunity';
import What from '../../components/ambassadors/what/What';
import Perks from '../../components/ambassadors/perks/Perks';
import Meet from '../../components/ambassadors/meet/Meet';


export default function Ambassadors() {

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
        <title>Ballerina ambassador program - The Ballerina programming language</title>
        <meta name="description" content="Join the Ballerina Student Ambassador Program to lead your community, access exclusive resources, and showcase your programming skills." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language, student engagement program, ambassadors" />

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina ambassador program - The Ballerina programming language" />
        <meta property="og:description" content="Join the Ballerina Student Ambassador Program to lead your community, access exclusive resources, and showcase your programming skills." />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-project-mentorship-sm-banner.png"
        />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina ambassador program - The Ballerina programming language" />
        <meta property="og:description" content="Join the Ballerina Student Ambassador Program to lead your community, access exclusive resources, and showcase your programming skills." />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-project-mentorship-sm-banner.png"
        />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content="Ballerina ambassador program - The Ballerina programming language" />
        <meta property="twitter:description" content="Join the Ballerina Student Ambassador Program to lead your community, access exclusive resources, and showcase your programming skills." />
        <meta property="twitter:text:description" content="Join the Ballerina Student Ambassador Program to lead your community, access exclusive resources, and showcase your programming skills." />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-project-mentorship-sm-banner.png"
        />
      </Head>
      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow communityRow communityIntro" style={{ paddingBottom: "4rem" }}>
            <Col xs={12}>
              <Container>
                <Row>
                  <img src="/images/mesh-1-row-cropped.svg" className="background-image" alt="Background" />
                  <Col xs={12} md={12} lg={7}>
                    <h1>Ballerina ambassador program</h1>
                    <p style={{ fontSize: "22px", fontWeight: "400", color: "#20b6b0", marginTop: "40px" }}>
                      The Ballerina Ambassador Program aims to cultivate a network of enthusiastic and talented developers who are passionate about programming, cloud-native development, and microservices architecture. These ambassadors will act as representatives of the Ballerina within their academic/developer communities, promoting it, fostering engagement, and building a vibrant, supportive community of developers.
                    </p>

                    <a href="#" className="applyNow">
                    Apply now
                    </a>
                  </Col>
                  <Col xs={12} md={12} lg={5} className='introImg'>
                    <img src="/images/ambassadors/banner1.png" alt="Project mentorship" />
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow communityRow slackRow">
            <What getLink={getLink} />
          </Row>

          <Row className="pageContentRow communityRow">
            <Perks getLink={getLink} />
          </Row>

          <Row className="pageContentRow communityRow slackRow">
            <Meet getLink={getLink} />
          </Row>

        </Col>
      </Layout>
    </>
  );
}

