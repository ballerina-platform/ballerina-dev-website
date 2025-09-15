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
        <Row className={styles.logoRow}>
          <Col xs={5} align="right">
            <a href="https://hacktoberfest.com" target="_blank" rel="noreferrer" title='Hacktoberfest'>
              <img src={`${prefix}/images/hacktoberfest/hacktoberfest-2025.svg`} alt="Hacktoberfest" title="Hacktoberfest" height={120} className={styles.hackLogo}/>
            </a>
          </Col>
          <Col xs={2} justify="center" align="center">
            <img src={`${prefix}/img/body-bg1000.svg`} alt="divider" title="divider" width={2} height={120} className={styles.divider} />
          </Col>
          <Col xs={5}>
            <img src={`${prefix}/images/logo/ballerina_logo_white_m__svg.svg`} alt="Ballerina" title="Ballerina" height={60} className={styles.ballerinaLogo}/>
          </Col>
        </Row>

        <Row className={styles.title}>
          <Col sm={12} className='text-center'>
            <h1>Hacktoberfest 2025</h1>
          </Col>
        </Row>

        <Row className={styles.description}>
          <Col sm={12}>
            <p>
              <span>We&apos;re thrilled to have you on board for <a href="https://hacktoberfest.com" target="_blank" rel="noreferrer" className={styles.introLinks} title='Hacktoberfest'>Hacktoberfest</a> and have some fantastic opportunities lined up for you.
                See the many ways you can support the open source community and contribute to Ballerina.</span>
            </p>
          </Col>
        </Row>


      </Container>
    </Col>

  );
}
