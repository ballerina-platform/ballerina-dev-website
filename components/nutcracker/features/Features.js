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

import styles from './Features.module.css';

const FEATURES = [
  {
    icon: 'bi-lightning-charge',
    title: 'Instant startup',
    body: 'A native binary with no JVM warm-up, so programs begin running the moment you invoke them.',
  },
  {
    icon: 'bi-box-seam',
    title: 'Small, single binary',
    body: 'Ships as a self-contained executable that is easy to drop into containers, CI, and edge environments.',
  },
  {
    icon: 'bi-cpu',
    title: 'Written in Go',
    body: 'A modern, memory-safe implementation with straightforward cross-compilation to every major platform.',
  },
  {
    icon: 'bi-code-square',
    title: 'Faithful language semantics',
    body: 'Interprets the Ballerina language directly, expanding its coverage of the type system subset by subset.',
  },
  {
    icon: 'bi-hdd-network',
    title: 'HTTP client & standard library',
    body: 'Growing standard library support, including the ballerina/http client for outbound HTTP/HTTPS calls.',
  },
  {
    icon: 'bi-globe',
    title: 'Open & incremental',
    body: 'Developed in the open with frequent tagged releases you can follow, try, and contribute to on GitHub.',
  },
];

export default function Features() {
  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12}>
            <h2 className={styles.heading}>Why Nutcracker</h2>
          </Col>
        </Row>

        <Row className={styles.cardRow}>
          {FEATURES.map((f) => (
            <Col xs={12} md={6} lg={4} className={styles.cardCol} key={f.title}>
              <div className={styles.card}>
                <i className={`bi ${f.icon} ${styles.icon}`} />
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </Col>
  );
}
