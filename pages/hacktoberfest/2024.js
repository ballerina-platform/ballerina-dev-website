/**
 * Copyright (c) 2025, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import { Col, Row } from 'react-bootstrap';

import Layout from '../../layouts/LayoutHacktoberfest1';
import Intro from '../../components/hacktoberfest-2024/intro/Intro';
import Challenges from '../../components/hacktoberfest-2024/challenges/challenges';
import Rewards from '../../components/hacktoberfest-2024/rewards/Rewards';
import Rules from '../../components/hacktoberfest-2024/rules/Rules';
import styles from '../../styles/Hacktoberfest.module.css';
import Head from 'next/head';

export default function Home({ }) {

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
          <meta
            name="description"
            content="Ballerina participates in Hacktoberfest 2024"
          />
          <meta
            name="keywords"
            content="ballerina, hacktoberfest, integration, hackathon"
          />
          <title>Ballerina - Hacktoberfest 2024 - The Ballerina programming language</title>

          {/* FB */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Ballerina - Hacktoberfest 2024 - The Ballerina programming language" />
          <meta
            property="og:description"
            content="Ballerina participates in Hacktoberfest 2024"
          />
          <meta
            property="og:image"
            itemProp="image"
            content="https://ballerina.io/images/hacktoberfest/hack-2024.png"
          />

          {/* LINKED IN */}
          <meta property="og:title" content="Ballerina - Hacktoberfest 2024 - The Ballerina programming language" />
          <meta
            property="og:image"
            content="https://ballerina.io/images/hacktoberfest/hack-2024.png"
          />
          <meta
            property="og:description"
            itemProp="image"
            content="Ballerina participates in Hacktoberfest 2024."
          />

          {/* TWITTER */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@ballerinalang" />
          <meta name="twitter:creator" content="@ballerinalang" />
          <meta name="twitter:title" content="Ballerina - Hacktoberfest 2024 - The Ballerina programming language" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:description"
            content="Ballerina participates in Hacktoberfest 2024"
          />
          <meta
            name="twitter:image"
            content="https://ballerina.io/images/hacktoberfest/hack-2024.png"
          />
          <meta
            property="twitter:text:description"
            content="Ballerina participates in Hacktoberfest 2024"
          />
          <meta
            property="twitter:image"
            content="https://ballerina.io/images/hacktoberfest/hack-2024.png"
          />

    </Head>
        <Layout>
          <Col sm={12}>

            <Row className={styles.hacktoberfestIntro2024}>
              <Intro />
            </Row>

            <Row className={styles.hacktoberfestChallenges2024}>
              <Challenges getLink={getLink}/>
            </Row>

            <Row className={styles.hacktoberfestRewards2024}>
              <Rewards getLink={getLink}/>
            </Row>

            <Row className={styles.hacktoberfestRules2024}>
              <Rules getLink={getLink}/>
            </Row>
          </Col>
        </Layout>
    </>
  );
}
