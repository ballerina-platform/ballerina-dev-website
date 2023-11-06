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
// import GetInvolved from '../../components/community/get-involved/GetInvolved';
import Contact from '../../components/community/contact/Contact';
import CommunityCarousel from '../../components/community/community-carousel/CommunityCarousel';

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

  return (
    <>
      <Head>
        <title>Community - The Ballerina programming language</title>
        <meta name="description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Community - The Ballerina programming language" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Community - The Ballerina programming language" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content="Community - The Ballerina programming language" />
        <meta property="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta property="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
      </Head>
      <Layout>
        <Col sm={12}>

          <Row className="pageHeader pageContentRow communityRow communityIntro">
            <Col xs={12}>
              <Container>
                <Row>
                  <img src="/images/ballerina-mesh-grey-cropped.svg" class="background-image" alt="Background" />
                  <Col xs={12} md={12} lg={6}>
                    <h1>Community</h1>
                    <p>Welcome to the Ballerina community! Use the below channels to ask questions, find answers, post feedback, and help establish Ballerina as a truly community-owned resource.</p>
                  </Col>
                  <Col xs={12} md={12} lg={6} style={{ paddingTop: "35px" }}>
                    <CommunityCarousel />
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
            <Newsletter getLink={getLink} />
          </Row>

          {/* <Row className="pageContentRow communityRow">
            <TechTalk getLink={getLink} />
          </Row> */}

          {/* <Row className="pageContentRow communityRow slackRow">
            <GetInvolved getLink={getLink} />
          </Row> */}

          {/* <Row className="pageContentRow communityRow">
            <Blog getLink={getLink} />
          </Row> */}

          <Row className="pageContentRow communityRow slackRow">
            <Contact getLink={getLink} />
          </Row>

        </Col>
      </Layout>
    </>
  );
}
