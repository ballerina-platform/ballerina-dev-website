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

// The playground's examples are Ballerina packages, so these point at each
// package's main.bal. Keep in sync if the playground restructures its examples.
//
// `?sidebar=collapsed` (ballerina-nutcracker/playground#107) makes the playground
// render without its Examples sidebar. Only the embed uses it — the "Open in
// Playground" link deliberately omits it, since the file list is useful there.
const embedSrc = (url) => `${url}?sidebar=collapsed`;
//
// `height` sizes the embed to the sample: hello world is 6 lines, so the 600px
// the HTTP samples need would leave it three-quarters empty. Both HTTP samples
// share a height, so switching between them shifts nothing.
const SAMPLES = [
  {
    key: 'hello',
    label: 'Hello world',
    url: 'https://play.ballerina.io/tmp/examples/01-hello-world/main.bal',
    height: 420,
  },
  {
    key: 'client',
    label: 'HTTP client',
    url: 'https://play.ballerina.io/tmp/examples/02-http-client/main.bal',
    height: 600,
  },
  {
    key: 'service',
    label: 'HTTP service',
    url: 'https://play.ballerina.io/tmp/examples/03-http-service/main.bal',
    height: 600,
  },
];

export default function Intro({ repo }) {
  // Our own sample switcher, so the playground's Examples sidebar stays hidden.
  const [sample, setSample] = React.useState(SAMPLES[0]);

  // Every sample gets its own iframe, mounted up front and kept mounted, with
  // only the active one visible. Switching then never reboots the playground:
  // we can't drive its client-side router from here (cross-origin), and changing
  // an iframe's src is a full document navigation. The trade is that all three
  // playground instances boot during initial page load and stay resident.
  //
  // There is no loading overlay of our own. One used to be needed because the
  // frame was shifted left to crop the sidebar, which threw the playground's own
  // boot screen off-centre. The frame is full width now, so the playground's
  // loading state lands where it should — and the overlay it replaced was driven
  // by a fixed 1.8s timer that StrictMode's simulated unmount could clear before
  // it fired, leaving the spinner up forever.

  const selectSample = React.useCallback((next) => {
    if (next.key === sample.key) return;
    setSample(next);
  }, [sample.key]);

  return (
    <Col sm={12}>
      <Container>
        {/* Centered pitch */}
        <Row>
          <Col xs={12} className={styles.heroText}>
            <h1>Ballerina Nutcracker</h1>
            <p className={styles.subtitle}>
              Starts instantly, ships as one self-contained binary, and keeps the footprint small.
            </p>

            {/* Secondary actions — the live editor below is the primary CTA. */}
            <div className={styles.heroCtas}>
              <a className={styles.btnSecondary} href="#latest-release">
                <i className="bi bi-download" />&nbsp;Download
              </a>
              <a className={styles.btnSecondary}
                target="_blank" rel="noreferrer" href={`https://github.com/${repo}`}>
                <i className="bi bi-github" />&nbsp;View on GitHub
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
                  {/* Explicit spaces: JSX drops the whitespace around a newline,
                      so without these the text is literally "hitRunto execute" —
                      it only looked spaced because of the chip's margin. */}
                  Edit the code, then hit{' '}
                  <span className={styles.runChip}><i className="bi bi-play" />Run</span>{' '}
                  to execute it in your browser.
                </span>

                {/* Sample switcher — replaces the playground's own file list. */}
                <div className={styles.sampleSwitch} role="group" aria-label="Choose a sample">
                  {SAMPLES.map((s) => (
                    <button
                      type="button"
                      key={s.key}
                      className={`${styles.sampleBtn} ${s.key === sample.key ? styles.sampleBtnActive : ''}`}
                      aria-pressed={s.key === sample.key}
                      onClick={() => selectSample(s)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* The playground hides its own Examples sidebar via the query
                  param, so nothing here needs clipping. */}
              {/* Height comes through a custom property so the responsive
                  caps below can still clamp it. The clip follows the active
                  sample; each frame keeps its own so a hidden frame is never
                  resized (a resize would make its editor re-measure). */}
              <div className={styles.embedClip} style={{ '--frame-height': `${sample.height}px` }}>
                {SAMPLES.map((s) => {
                  const isActive = s.key === sample.key;
                  return (
                    /* Least-privilege sandbox: the playground needs scripts and
                       its own origin (web worker + WASM), and opens GitHub in a
                       new tab. Withholding allow-top-navigation keeps it from
                       navigating this page. */
                    <iframe
                      key={s.key}
                      className={`${styles.playgroundFrame} ${isActive ? '' : styles.frameHidden}`}
                      style={{ '--frame-height': `${s.height}px` }}
                      src={embedSrc(s.url)}
                      title={`Ballerina Nutcracker playground - ${s.label} example`}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
                      loading="lazy"
                      aria-hidden={isActive ? undefined : 'true'}
                    />
                  );
                })}
              </div>

              <div className={styles.windowFoot}>
                <span className={styles.footHint}>
                  Runs on WebAssembly &mdash; nothing to install.
                </span>
                <a className={styles.openPlaygroundBtn}
                  href={sample.url} target="_blank" rel="noreferrer">
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
