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

// Passthrough (HTTP proxy) benchmark — 100 concurrent users, 10 KB payload,
// AWS m6a.xlarge (4 vCPU). Same test, same machine, across runtimes.
const RUNTIMES = [
  { name: 'Rust', startup: 0.013, memory: 19.6 },
  { name: 'Go', startup: 0.016, memory: 37.1 },
  { name: 'Nutcracker', startup: 0.023, memory: 41.5, nut: true },
  { name: 'Node.js', startup: 0.042, memory: 110.1 },
  { name: '.NET', startup: 0.223, memory: 136.7 },
  { name: 'Spring Boot', startup: 2.326, memory: 768.6 },
  { name: 'Swan Lake', startup: 4.883, memory: 729.4 },
];

const fmtSec = (s) => `${s < 1 ? s.toFixed(2) : s.toFixed(1)} s`;
const fmtMem = (m) => `${Math.round(m)} MB`;

const CARDS = [
  { icon: 'bi-lightning-charge', title: 'Startup time', sub: 'Time to serve the first request', key: 'startup', fmt: fmtSec },
  { icon: 'bi-hdd', title: 'Memory under load', sub: 'Peak memory while proxying', key: 'memory', fmt: fmtMem },
];

// The integration-first strengths of the Ballerina language that set Nutcracker
// apart from a general-purpose runtime like Go or Rust.
const INTEGRATION = [
  {
    icon: 'bi-diagram-3',
    title: 'Network-aware types',
    body: 'Services, clients, listeners, and resources are first-class in the language — not hand-wired glue code.',
  },
  {
    icon: 'bi-boxes',
    title: 'Batteries included',
    body: 'A standard library and the Ballerina Central connector ecosystem for common protocols and data formats.',
  },
  {
    icon: 'bi-diagram-2',
    title: 'Concurrency you can see',
    body: 'Built-in concurrency with safe primitives, visualized as sequence diagrams.',
  },
];

function MetricCard({ card }) {
  const rows = [...RUNTIMES].sort((a, b) => a[card.key] - b[card.key]);
  const max = Math.max(...rows.map((r) => r[card.key]));

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <i className={`bi ${card.icon} ${styles.icon}`} />
        <div>
          <h3>{card.title}</h3>
          <p className={styles.body}>{card.sub} &middot; lower is better</p>
        </div>
      </div>

      <div className={styles.bars}>
        {rows.map((r) => (
          <div className={`${styles.barRow} ${r.nut ? styles.barRowNut : ''}`} key={r.name}>
            <span className={styles.barLabel}>{r.name}</span>
            <div className={styles.barTrack}>
              <div
                className={`${styles.barFill} ${r.nut ? styles.barNut : styles.barSwan}`}
                style={{ width: `${Math.max(1.5, (r[card.key] / max) * 100)}%` }}
              />
            </div>
            <span className={styles.barVal}>{card.fmt(r[card.key])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12}>
            <h2 className={styles.heading}>Why Nutcracker</h2>
            <p className={styles.subheading}>
              In a passthrough (HTTP proxy) benchmark, Nutcracker lands in the
              instant-start, low-memory tier alongside Go and Rust &mdash; while the
              JVM runtimes trail on both startup and footprint.
            </p>
          </Col>
        </Row>

        <Row className={styles.cardRow}>
          {CARDS.map((card) => (
            <Col xs={12} md={6} className={styles.cardCol} key={card.key}>
              <MetricCard card={card} />
            </Col>
          ))}
        </Row>

        <Row>
          <Col sm={12}>
            <p className={styles.integrationLead}>
              On these numbers, Nutcracker keeps pace with general-purpose languages like Go and Rust
              &mdash; while running <strong>Ballerina, a language purpose-built for integration</strong>,
              so you also get what those runtimes leave to you:
            </p>
          </Col>
        </Row>

        <Row className={styles.intRow}>
          {INTEGRATION.map((f) => (
            <Col xs={12} md={4} className={styles.intCol} key={f.title}>
              <div className={styles.intCard}>
                <i className={`bi ${f.icon} ${styles.intIcon}`} />
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Col>
          ))}
        </Row>

        <Row>
          <Col sm={12}>
            <p className={styles.intCaveat}>
              Nutcracker brings these to a lightweight native runtime and expands its coverage each
              release &mdash; the HTTP client landed in v0.5.
            </p>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <p className={styles.caption}>
              Passthrough (HTTP proxy) &middot; 100 concurrent users &middot; 10&nbsp;KB payload &middot;
              AWS m6a.xlarge, 4&nbsp;vCPU. On raw throughput the compiled stacks (Rust, .NET, Go) lead,
              while Nutcracker tracks the JVM runtimes (~13k req/s). Preliminary figures &mdash; indicative, not final.
            </p>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
