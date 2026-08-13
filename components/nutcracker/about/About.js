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
import { Row, Col, Container } from 'react-bootstrap';

import styles from './About.module.css';

export default function About() {
  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12}>
            <h2 className={styles.heading}>What is Ballerina Nutcracker?</h2>
          </Col>
        </Row>

        {/* Nutcracker is introduced on its own terms — no Swan Lake comparison. */}
        <Row className={styles.introText}>
          <Col xs={12} lg={10}>
            <p>
              <strong>Ballerina Nutcracker</strong> is a native interpreter for the Ballerina
              language, written from the ground up in <strong>Go</strong>. It runs Ballerina
              programs directly as a self-contained native binary &mdash; without a Java Virtual
              Machine &mdash; making it lightweight and fast to start.
            </p>
            <p>
              The goal is to explore a runtime that is small enough to embed anywhere and quick
              enough for command-line tools, scripting, edge, and serverless workloads, while
              staying faithful to Ballerina&rsquo;s semantics. It is developed openly and released
              incrementally as it grows its coverage of the language and standard library.
            </p>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
