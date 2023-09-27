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
import { Col, Row } from 'react-bootstrap';

import Layout from '../../layouts/LayoutHome';
import Intro from '../../components/hacktoberfest/intro/Intro';
import Challenges from '../../components/hacktoberfest/challenges/challenges';
import Rewards from '../../components/hacktoberfest/rewards/Rewards';
import styles from '../../styles/Home.module.css';

export default function Home({ }) {
  return (
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

      </Col>
    </Layout>
  );
}