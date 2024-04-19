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

import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Head from 'next/head';

import Layout from '../../layouts/LayoutCommunity';
import Newsletter from '../../components/community/newsletter/Newsletter';
import Events from '../../components/community/events/Events';
import Resources from '../../components/community/resources/Resources';
import JoinUs from '../../components/community/join-us/JoinUs';
import Contact from '../../components/community/contact/Contact';
import CommunityCarousel from '../../components/common/image-carousel/ImageCarousel';
import UniversitySessions from '../../components/community/university-sessions/UniversitySessions';

export default function Community() {

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

  const images = [
    '/images/community/2.jpg',
    '/images/community/5.jpg',
    '/images/community/6.jpg',
    '/images/community/7.jpg',
    '/images/community/9.png',
    '/images/community/10.png',
    '/images/community/11.png',
    '/images/community/12.png'
  ];

  return (
    <>
      <Head>
        <title>Community - The Ballerina programming language</title>
        <meta name="description" content="Join the Ballerina community and use the below channels to ask questions, find answers, post feedback, and help establish Ballerina as a truly community-owned resource." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Community - The Ballerina programming language" />
        <meta property="og:description" content="Join the Ballerina community and use the below channels to ask questions, find answers, post feedback, and help establish Ballerina as a truly community-owned resource." />
        <meta property="og:image" content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png" />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Community - The Ballerina programming language" />
        <meta property="og:description" content="Join the Ballerina community and use the below channels to ask questions, find answers, post feedback, and help establish Ballerina as a truly community-owned resource." />
        <meta property="og:image" content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png" />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content="Community - The Ballerina programming language" />
        <meta property="twitter:description" content="Join the Ballerina community and use the below channels to ask questions, find answers, post feedback, and help establish Ballerina as a truly community-owned resource." />
        <meta property="twitter:text:description" content="Join the Ballerina community and use the below channels to ask questions, find answers, share feedback, and help establish Ballerina as a truly community-owned resource." />
        <meta name="twitter:image" content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png" />
        <meta property="twitter:image" content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png" />
        
      </Head>
      <Layout>
        <Col sm={12}>

          <Row className="pageHeader pageContentRow communityRow communityIntro">
            <Col xs={12}>
              <Container>
                <Row>
                  <img src="/images/ballerina-mesh-grey-cropped.svg" className="background-image" alt="Background" />
                  <Col xs={12} md={12} lg={6}>
                    <h1>Community</h1>
                    <p style={{ fontSize: "24px", fontWeight: "400", color: "#20b6b0", marginTop: "40px" }}>Welcome to the Ballerina community! Use the below channels to ask questions, find answers, post feedback, and help establish Ballerina as a truly community-owned resource.</p>
                    <a href="#join-us" className="join">
                    Join our community
                    </a>
                  </Col> 
                  <Col xs={12} md={12} lg={6} style={{ paddingTop: "35px" }}>
                    <CommunityCarousel images={images}/>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow communityRow slackRow">
            <Events getLink={getLink} />
          </Row>

          <Row className="pageContentRow communityRow">
            <JoinUs getLink={getLink} />
          </Row>

          <Row className="pageContentRow communityRow slackRow">
            <Resources getLink={getLink} />
          </Row>

          <Row className="pageContentRow communityRow">
            <Newsletter getLink={getLink} showLink={true}/>
          </Row>

          <Row className="pageContentRow communityRow slackRow">
            <UniversitySessions getLink={getLink} />
          </Row>

          <Row className="pageContentRow communityRow">
            <Contact getLink={getLink} />
          </Row>

        </Col>
      </Layout>
    </>
  );
}
