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
import { Row, Col, Container } from 'react-bootstrap';

import styles from './Contact.module.css';

export default function Contact() {

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='contact-us'>Contact us</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={6}>
            <p>
              Got any questions? Want to get involved but not sure how? Need help with your first use case? Our team is here to support you. Email us today, and we will be in touch soon.
            </p>
            <a href="mailto:contact@ballerina.io">
              <button type="button" className={styles.sendEmail}>Email contact@ballerina.io</button>
            </a>
          </Col>

          <Col sm={12} md={6} lg={6}>
            &nbsp;
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
