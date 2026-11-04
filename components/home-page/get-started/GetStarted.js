/**
 * Copyright (c) 2026, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import { Col, Container, Row } from 'react-bootstrap';

import { prefix } from '../../../utils/prefix';
import shared from '../ai-shared/section.module.css';
import styles from './GetStarted.module.css';

export default function GetStarted() {
  return (
    <Col xs={12}>
      <Container>
        <Row className={`${shared.section} ${styles.band}`}>
          <Col xs={12} md={8} className={shared.text}>
            <p className={shared.eyebrow}>Start with one agent</p>
            <h2 className={`${shared.heading} ${styles.heading}`}>Build your first agent.</h2>
            <p className={`${shared.lead} ${styles.lead}`}>Follow the guide to build an agent that calls real enterprise APIs, remembers the conversation, and recovers from tool failures, one step at a time.</p>
          </Col>
          <Col xs={12} md={4} className={styles.action}>
            <a className={styles.cta} href={`${prefix}/learn/build-an-agent-that-uses-enterprise-systems/`}>
              Start building <span aria-hidden="true">→</span>
            </a>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
