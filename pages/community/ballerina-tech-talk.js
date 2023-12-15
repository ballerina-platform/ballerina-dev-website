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
import { Row, Col, Modal, Container } from 'react-bootstrap';
import Head from 'next/head';


import Layout from '../../layouts/LayoutCommunity';
import PastTechTalks from '../../components/community/tech-talk/past-tech-talks/PastTechTalks';


export default function TechTalk() {


  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Head>

        <meta name="description" content="In the regular Tech Talk, the Ballerina team will discuss different technical topics surrounding the world of Ballerina." />

        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        <title>Ballerina tech talk - The Ballerina programming language</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina tech talk - The Ballerina programming language" />
        <meta property="og:description" content="In the regular Tech Talk, the Ballerina team will discuss different technical topics surrounding the world of Ballerina." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina tech talk - The Ballerina programming language" />
        <meta property="og:description" content="In the regular Tech Talk, the Ballerina team will discuss different technical topics surrounding the world of Ballerina." />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content="Ballerina tech talk - The Ballerina programming language" />
        <meta property="twitter:description" content="In the regular Tech Talk, the Ballerina team will discuss different technical topics surrounding the world of Ballerina." />
        <meta property="twitter:text:description" content="In the regular Tech Talk, the Ballerina team will discuss different technical topics surrounding the world of Ballerina." />


      </Head>
      <Layout>
        <Col sm={12}>
          <Container>
            <Row className="pageHeader pageContentRow communityRow">
              <Col xs={12}>
                <h1>Ballerina tech talk</h1>
              </Col>
            </Row>

            <Row className="pageContentRow communityRow">
              <Col xs={12} md={6}>
                <p>
                  If you&apos;re looking to meet other Ballerina users and language specialists, this is the place for you. We&apos;re excited to bring a regular Tech Talk, where our team will discuss different technical topics surrounding the world of Ballerina.
                </p>
                <p>
                  If you would like to suggest a topic for our next talk or give feedback on tech talks,  <a id="techTalkFormButton" className="formLink" onClick={handleShow}>please fill this form</a>.
                </p>
              </Col>
            </Row>

            <Row className="pageContentRow">
              <Col xs={12}>
                <h2>Past Tech Talks</h2>
              </Col>
            </Row>

            <Row className="pageContentRow">
              <Col xs={12}>
                <PastTechTalks />
              </Col>
            </Row>

            <Modal show={show} onHide={handleClose} id="techTalkForm" className="customModal">
              <Modal.Header closeButton>
                <Modal.Title>Suggest topics or give feedback</Modal.Title>
              </Modal.Header>
              <Modal.Body className="customModalBody">
                <iframe src="https://resources.wso2.com/l/142131/2022-01-05/b3x767" frameBorder="0" className="formEmbedded" />
              </Modal.Body>
            </Modal>


          </Container>

        </Col>
      </Layout>
    </>
  );
}
