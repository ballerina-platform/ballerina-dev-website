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
import Link from 'next/link';

import styles from './WhyBal.module.css';

const features = [
  {
    slug: 'cloud-native', title: 'Cloud native',
    text: 'Services, listeners, clients, and resources are first-class language constructs, not library afterthoughts.'
  },
  {
    slug: 'ai-built-in', title: 'AI built in',
    text: 'Model providers, agents, MCP clients and services, and retrieval are part of the standard library, with the same types and error handling as the rest of your code.'
  },
  {
    slug: 'graphical', title: 'Graphical',
    text: 'Code and diagrams are two views of one source, so editing either updates the other.'
  },
  {
    slug: 'data-oriented', title: 'Data oriented',
    text: 'JSON and XML are native types. Query expressions turn one message format into another in a few lines.'
  },
  {
    slug: 'flexibly-typed', title: 'Flexibly typed',
    text: 'Types describe data by its shape. The compiler checks how you use it, and incoming data is validated when it binds to a type.'
  },
  {
    slug: 'concurrent', title: 'Concurrent and durable',
    text: 'Workers without asynchronous functions, plus durable workflows and agents that keep state across crashes and restarts.'
  }
];

export default function WhyBal(props) {

  return (
    <Col sm={12}>
      <Container>
        <Row className={styles.header}>
          <Col xs={12}>
            <p className={styles.eyebrow}>Why Ballerina</p>
            <h2 id="why-ballerina" className={`section ${styles.heading}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'why-ballerina')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Integration concepts, built into the language.
            </h2>
          </Col>
        </Row>
        <div className={styles.featureGrid}>
          {features.map(f => (
            <div className={styles.featureCard} key={f.slug}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <Link href={`/why-ballerina/${f.slug}/`} passHref>
                <a className={styles.moreLink}>More info <span aria-hidden="true">→</span></a>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </Col>
  );
}