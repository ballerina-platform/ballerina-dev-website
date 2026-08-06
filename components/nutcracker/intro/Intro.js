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

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';

const PLAYGROUND_EXAMPLE = 'https://play.ballerina.io/tmp/examples/02-http-client.bal';

export default function Intro({ repo }) {
  // The playground is cropped to hide its Examples sidebar, which shifts the
  // frame left. Until the editor renders, the playground's own boot screen
  // centres on the shifted frame rather than on this box, so cover that period
  // with a loading state of our own that is centred correctly.
  const [booting, setBooting] = React.useState(true);

  const handleFrameLoad = React.useCallback(() => {
    // The document is up, but the WASM runtime still needs a moment to boot.
    const timer = setTimeout(() => setBooting(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Col sm={12}>
      <Container>
        {/* Centered pitch */}
        <Row>
          <Col xs={12} className={styles.heroText}>
            <h1>Ballerina, natively &mdash; a fast, self-contained platform</h1>
            <p className={styles.subtitle}>
              Starts instantly, ships as one self-contained binary, and keeps the footprint
              small &mdash; made for CLIs, functions, and short-lived cloud-native workloads.
            </p>

            {/* Secondary actions — the live editor below is the primary CTA. */}
            <div className={styles.heroCtas}>
              <a className={styles.btnSecondary} href="#latest-release">
                <i className="bi bi-download" />&nbsp;Download
              </a>
              <a className={styles.btnSecondary}
                target="_blank" rel="noreferrer" href={`https://github.com/${repo}`}>
                <i className="bi bi-github" />&nbsp;GitHub
              </a>
            </div>

            <p className={styles.experimental}>
              <i className="bi bi-cone-striped" />&nbsp;Experimental project. <a href={`${prefix}/downloads/`} className={styles.introLinks}>Ballerina Swan Lake</a> remains the production distribution.
            </p>
          </Col>
        </Row>

        {/* Full-width, window-framed playground */}
        <Row>
          <Col xs={12}>
            <div className={styles.playgroundWindow}>
              {/* Prominent instruction — sits above the editor, next to Run. */}
              <div className={styles.runBand}>
                <span className={styles.liveBadge}>
                  <span className={styles.liveDot} />Live editor
                </span>
                <span className={styles.runBandText}>
                  Edit the code, then hit
                  <span className={styles.runChip}><i className="bi bi-play" />Run</span>
                  to execute it in your browser.
                </span>
              </div>

              {/* The playground shows an Examples sidebar we don't want; clip it
                  off the left and shield its toggle so the crop stays stable. */}
              <div className={styles.embedClip}>
                <iframe
                  className={styles.playgroundFrame}
                  src={PLAYGROUND_EXAMPLE}
                  title="Ballerina Nutcracker playground - HTTP client example"
                  loading="lazy"
                  onLoad={handleFrameLoad}
                />
                <div className={styles.toggleShield} aria-hidden="true" />

                {booting &&
                  <div className={styles.booting}>
                    <span className={styles.spinner} aria-hidden="true" />
                    <span className={styles.bootingText}>Starting the live editor&hellip;</span>
                  </div>
                }
              </div>

              <div className={styles.windowFoot}>
                <span className={styles.footHint}>
                  Runs on WebAssembly &mdash; nothing to install.
                </span>
                <a className={styles.openPlaygroundBtn}
                  href={PLAYGROUND_EXAMPLE} target="_blank" rel="noreferrer">
                  Open in Playground <i className="bi bi-arrow-right" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
