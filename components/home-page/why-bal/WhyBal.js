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
import Image from 'next-image-export-optimizer';

import { prefix } from '../../../utils/prefix';

import styles from './WhyBal.module.css';

const T = '#3DBDB5';
const o = { stroke: T, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' };

const features = [
  {
    slug: 'cloud-native', title: 'Cloud native',
    text: 'Services, listeners, clients, and resources are first-class language constructs, not library afterthoughts.',
    icon: null,
    img: ['cloud-native', 126]
  },
  {
    slug: 'graphical', title: 'Graphical',
    text: 'Every program is also a sequence diagram. Both are views of one source, so editing either updates the other.',
    icon: null,
    img: ['graphical', 135]
  },
  {
    slug: 'data-oriented', title: 'Data oriented',
    text: 'JSON and XML are native types. Query expressions turn one message format into another in a few lines.',
    icon: null,
    img: ['data-transformation', 142]
  },
  {
    slug: 'flexibly-typed', title: 'Flexibly typed',
    text: 'Data binds to a type by its shape, and malformed data is caught at compile time.',
    icon: null,
    img: ['flexible-typing', 151]
  },
  {
    slug: 'concurrent', title: 'Concurrent and durable',
    text: 'Workers without asynchronous functions, plus durable workflows and agents that keep state across crashes and restarts.',
    icon: null,
    img: ['concurrent', 108]
  },
  {
    slug: 'ai-built-in', title: 'AI built in',
    text: 'Natural expressions return typed values from a model, checked by the compiler. Build agents and MCP servers.',
    icon: <>
      <rect {...o} x="16" y="16" width="40" height="40" rx="8" />
      <path {...o} d="M28 8v8M44 8v8M28 56v8M44 56v8M8 28h8M8 44h8M56 28h8M56 44h8" />
      <path d="M36 25l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill={T} />
    </>
  }
];

export default function WhyBal(props) {

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="why-ballerina" className='section'>
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
              Why Ballerina
            </h2>
          </Col>
        </Row>
        <div className={styles.featureGrid}>
          {features.map(f => (
            <div className={styles.featureCard} key={f.slug}>
              <div className={styles.iconBox}>
              {f.img
                ? <Image src={`${prefix}/images/home-page/icons/${f.img[0]}.svg`} width={f.img[1]} height={100} alt="" />
                : <svg className={styles.featureIcon} width="100" height="100" viewBox="0 0 72 72" fill="none" aria-hidden="true">{f.icon}</svg>}
              </div>
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