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

import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';


export default function Intro() {

  return (

    <Col sm={12}>
      <Container>

        <Row className={styles.introBottomRow}>
          <Col xs={12} sm={12} md={12} lg={6} className={`${styles.description} ${styles.introText}`}>
            <h1>Hacktoberfest 2024</h1>

            <p className={styles.desItem} style={{ fontSize: "25px", lineHeight: "normal" }}>
              <span>We&apos;re thrilled to have you on board for Hacktoberfest and have some fantastic opportunities lined up for you. See the many ways you can support the open source community and contribute to Ballerina.</span>
            </p>
          </Col>

          <Col xs={12} sm={12} md={12} lg={1} className={`${styles.description} ${styles.introText}`}>
            &nbsp;
          </Col>


          <Col xs={12} sm={12} md={12} lg={5} className={`${styles.description} ${styles.iconBlock}`}>
            <img src={`${prefix}/images/hacktoberfest/vertical_beige.svg`} alt="Hacktoberfest" title="Hacktoberfest" height={250} />
            <img src={`${prefix}/img/body-bg.svg`} alt="divider" title="divider" height={250} />
            <img src={`${prefix}/images/hacktoberfest/ballerina-icon-teal.svg`} alt="Hacktoberfest" title="Ballerina" height={250} />
          </Col>

        </Row>


      </Container>
    </Col>

  );
}
