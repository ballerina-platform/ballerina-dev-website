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

import * as React from 'react';
import Head from 'next/head';
import { Col, Row } from 'react-bootstrap';

import Layout from '../../layouts/LayoutHome';
import Intro from '../../components/hacktoberfest/intro/Intro';
import Challenges from '../../components/hacktoberfest/challenges/challenges';
import Rewards from '../../components/hacktoberfest/rewards/Rewards';
import Rules from '../../components/hacktoberfest/rules/Rules';
import styles from '../../styles/Home.module.css';

export default function Home({ }) {
  return (
    <>
      <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            name="description"
            content="Ballerina participates Hacktoberfest 2023."
          />
          <meta name="author" content="WSO2 LLC" />
          <meta
            name="keywords"
            content="ballerina, hackoberfest, integration"
          />
          <link rel="shortcut icon" href="/img/favicon.ico" />
          <title>Ballerina - Hacktoberfest 2023</title>

          {/* FB */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Ballerina - Learn" />
          <meta
            property="og:description"
            content="Ballerina participates Hacktoberfest 2023."
          />
          <meta
            property="og:image"
            itemProp="image"
            content="https://ballerina.io/images/hacktoberfest/hacktoberfest-logo.png"
          />

          {/* LINKED IN */}
          <meta property="og:title" content="Ballerina - Hacktoberfest 2023" />
          <meta
            property="og:image"
            content="https://ballerina.io/images/hacktoberfest/hacktoberfest-logo.png"
          />
          <meta
            property="og:description"
            itemProp="image"
            content="Ballerina participates Hacktoberfest 2023."
          />

          {/* TWITTER */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@ballerinalang" />
          <meta name="twitter:creator" content="@ballerinalang" />
          <meta name="twitter:title" content="Ballerina" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:description"
            content="Ballerina participates Hacktoberfest 2023."
          />
          <meta
            name="twitter:image"
            content="https://ballerina.io/images/hacktoberfest/hacktoberfest-logo.png"
          />
          <meta
            property="twitter:text:description"
            content="Ballerina participates Hacktoberfest 2023."
          />
          <meta
            property="twitter:image"
            content="https://ballerina.io/images/hacktoberfest/hacktoberfest-logo.png"
          />
        </Head>
        <Layout>
          <Col sm={12}>

            <Row className={styles.homeIntro}>
              <Intro />
            </Row>

            <Row className={styles.homeIntegration}>
              <Challenges />
            </Row>

            <Row className={styles.homeUsers}>
              <Rewards />
            </Row>

            <Row className={styles.homeIntegration}>
              <Rules />
            </Row>
          </Col>
        </Layout>
    </>
  );
}