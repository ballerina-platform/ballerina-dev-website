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
import { BsCheck } from 'react-icons/bs';

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';

export default function Intro({ repo }) {
  return (
    <Col sm={12}>
      <Container>
        <Row className={styles.introRow}>
          {/* LEFT: embedded, runnable HTTP client example */}
          <Col xs={{ span: 12, order: 2 }} lg={{ span: 6, order: 1 }} className={styles.tryCol}>
            <div className={styles.playgroundBox}>
              <div className={styles.playgroundBar}>
                <span className={styles.playgroundTitle}>
                  <i className="bi bi-play-circle" />&nbsp;Try it &mdash; HTTP client
                </span>
                <a className={styles.openFull}
                  href="https://play.ballerina.io/tmp/examples/02-http-client.bal"
                  target="_blank" rel="noreferrer" title="Open in the Ballerina Playground">
                  Open in Playground <i className="bi bi-box-arrow-up-right" />
                </a>
              </div>
              <iframe
                className={styles.playgroundFrame}
                src="https://play.ballerina.io/tmp/examples/02-http-client.bal"
                title="Ballerina Nutcracker playground - HTTP client example"
                loading="lazy"
              />
            </div>
            <p className={styles.tryHintLine}>
              Edit the code and hit <strong>Run</strong> &mdash; it executes right in your browser via WebAssembly.
            </p>
          </Col>

          {/* RIGHT: messaging + CTAs */}
          <Col xs={{ span: 12, order: 1 }} lg={{ span: 6, order: 2 }} className={styles.description}>
            <span className={styles.eyebrow}>Ballerina Nutcracker</span>
            <h1>A native Ballerina,<br />reimagined</h1>
            <p className={styles.tagline}>
              A ground-up, native interpreter for the Ballerina language, written in Go
              &mdash; built for fast startup, a small footprint, and instant execution as a
              lightweight alternative to the JVM-based Swan Lake distribution.
            </p>

            <p className={styles.desItem}><BsCheck className={styles.check} /><span>Native single-binary interpreter &mdash; no JVM required</span></p>
            <p className={styles.desItem}><BsCheck className={styles.check} /><span>Runs in the browser via WebAssembly &mdash; try it with zero install</span></p>

            <div className={styles.heroCtas}>
              <a className={`${styles.introButton} ${styles.tryButton}`} href="#latest-release">
                <i className="bi bi-download" />&nbsp;Download
              </a>
              <a className={`${styles.introButton} ${styles.ghostButton}`}
                target="_blank" rel="noreferrer" href={`https://github.com/${repo}`}>
                <i className="bi bi-github" />&nbsp;GitHub
              </a>
            </div>

            <p className={styles.experimental}>
              <i className="bi bi-cone-striped" />&nbsp;Experimental project. <a href={`${prefix}/downloads/`} className={styles.introLinks}>Ballerina Swan Lake</a> remains the production distribution.
            </p>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
