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
import { BsDiagram3, BsRobot } from 'react-icons/bs';

import { prefix } from '../../../utils/prefix';
import shared from '../ai-shared/section.module.css';
import styles from './GetStarted.module.css';

const GUIDES = [
  {
    icon: BsDiagram3,
    title: 'Build your first integration',
    description: 'Install Ballerina, then write and run a REST API.',
    href: `${prefix}/learn/get-started/`,
  },
  {
    icon: BsRobot,
    title: 'Build a hello world AI agent',
    description: 'Build a math tutor agent with tools and chat with it over HTTP.',
    href: `${prefix}/learn/build-your-first-agent/`,
  },
];

export default function GetStarted() {
  return (
    <Col xs={12}>
      <Container>
        <Row className={`${shared.section} ${styles.band}`}>
          <Col xs={12} lg={5} className={`${shared.text} ${styles.textCol}`}>
            <p className={shared.eyebrow}>Get started</p>
            <h2 className={`${shared.heading} ${styles.heading}`}>Start building with Ballerina.</h2>
            <p className={`${shared.lead} ${styles.lead}`}>Whether you’re connecting enterprise systems or building AI agents, get started with practical examples and step-by-step guides.</p>
          </Col>
          <Col xs={12} lg={7}>
            <ul className={styles.guides}>
              {GUIDES.map(({ icon: Icon, title, description, href }) => (
                <li key={title}>
                  <a className={styles.guide} href={href}>
                    <span className={styles.guideIcon} aria-hidden="true"><Icon /></span>
                    <span className={styles.guideTitle}>{title}</span>
                    <span className={styles.guideText}>{description}</span>
                    <span className={styles.guideLink}>
                      Start the guide <span className={styles.arrow} aria-hidden="true">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
