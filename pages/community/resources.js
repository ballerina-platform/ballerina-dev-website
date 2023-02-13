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
import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import Head from 'next/head';


import Layout from '../../layouts/LayoutCommunity';
import Articles from '../../components/community/resources/articles/Articles';
import Blogs from '../../components/community/resources/blogs/Blogs';
import Videos from '../../components/community/resources/videos/Videos';
import Other from '../../components/community/resources/other/Other';


export default function Resources() {

  return (
    <>
      <Head>

        <meta name="description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        <meta name="keywords" content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language" />

        <title>Resources</title>


        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina - Resources" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina" />
        <meta property="og:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />

        {/* <!--TWITTER--> */}
        <meta property="twitter:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />
        <meta property="twitter:text:description" content="A programming language for the cloud that makes it easier to use, combine, and create network services." />


      </Head>
      <Layout>
        <Col sm={12}>
          <Container>
            <Row className="pageHeader pageContentRow communityRow">
              <Col xs={12}>
                <h1>Resources</h1>
              </Col>
            </Row>

            <Row className="pageContentRow communityRow">
              <Col xs={12} md={6}>
                <p>
                  We have an extensive list of community-maintained articles, blogs, and videos to get you up to speed with Ballerina.
                </p>
                <p>
                  This list is curated to recognize the efforts made by our community and encourage anyone to contribute towards Ballerina content.
                </p>
              </Col>
            </Row>

            <Tabs defaultActiveKey="Articles" id="events" className="mb-3 eventsTabs">
              <Tab eventKey="Articles" title="Articles">
                <Articles />
              </Tab>
              <Tab eventKey="Blog" title="Blog posts">
                <Blogs />
              </Tab>
              <Tab eventKey="Video" title="Videos & podcasts">
                <Videos />
              </Tab>
              <Tab eventKey="Other" title="Other resources">
                <Other />
              </Tab>
            </Tabs>

          </Container>
        </Col>
      </Layout>
    </>
  );
}
