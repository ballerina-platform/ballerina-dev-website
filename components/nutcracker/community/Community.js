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

import styles from './Community.module.css';

export default function Community({ repo }) {
  const base = `https://github.com/${repo}/discussions`;

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className={styles.header}>
            <span className={styles.eyebrow}>Community</span>
            <h2>Join the conversation</h2>
            <p className={styles.lead}>
              Nutcracker is a young, fast-moving project built in the open &mdash; and this is the
              best time to help steer it. We run everything on <strong>GitHub Discussions</strong>:
              design decisions, questions, and early feedback all happen there. Jump in, say hello,
              and help shape the roadmap.
            </p>
          </Col>
        </Row>

        <Row>
          <Col sm={12} className={styles.ctaRow}>
            <a className={styles.primaryBtn}
              href={`${base}/new/choose`}
              target="_blank" rel="noreferrer">
              <i className="bi bi-chat-dots" />&nbsp;Start a discussion
            </a>
            <a className={styles.secondaryBtn}
              href={base}
              target="_blank" rel="noreferrer">
              Browse all discussions <i className="bi bi-box-arrow-up-right" />
            </a>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
