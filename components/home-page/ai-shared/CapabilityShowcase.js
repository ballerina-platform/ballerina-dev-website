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

import { highlightLine } from './highlight';
import shared from './section.module.css';
import styles from './CapabilityShowcase.module.css';

// A list of capabilities beside code excerpts. Selecting a capability shows its excerpts.
// `reverse` puts the excerpts on the left and the text on the right on desktop.
export default function CapabilityShowcase({ id, eyebrow, heading, lead, capabilities, reverse, getLink }) {
  const [active, setActive] = React.useState(0);
  const example = capabilities[active];
  const exampleId = `${id}-example`;

  return (
    <Col xs={12}>
      <Container>
        <Row className={shared.section}>
          <Col
            xs={{ span: 12, order: 1 }}
            lg={{ span: 5, order: reverse ? 2 : 1 }}
            className={`${shared.text} ${reverse ? styles.textEnd : styles.textStart}`}
          >
            <p className={shared.eyebrow}>{eyebrow}</p>
            <h2 id={id} className={`section ${shared.heading}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => getLink(e.target, id)}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              {heading}
            </h2>

            <p className={shared.lead}>{lead}</p>

            <ul className={shared.rows}>
              {capabilities.map((c, i) => (
                <li key={c.title} className={i === active ? shared.itemOn : undefined}>
                  <button
                    type="button"
                    className={shared.item}
                    aria-pressed={i === active}
                    aria-controls={exampleId}
                    onClick={() => setActive(i)}
                  >
                    <span className={shared.itemTitle}>{c.title}</span>
                    <span className={shared.itemText}>{c.description}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Col>

          <Col
            xs={{ span: 12, order: 2 }}
            lg={{ span: 7, order: reverse ? 1 : 2 }}
            id={exampleId}
            aria-live="polite"
            className={`${shared.example} ${styles.exampleCol}`}
          >
            {example.excerpts.map((x) => (
              <figure key={x.label} className={`${shared.panel} ${styles.excerpt}`}>
                <figcaption className={shared.panelLabel}>
                  <strong>{x.label}</strong>
                  <em className={styles.note}>{x.note}</em>
                </figcaption>
                <pre className={shared.code}>
                  <code>
                    {x.code.split('\n').map((line, i) => (
                      <React.Fragment key={i}>{highlightLine(line)}{'\n'}</React.Fragment>
                    ))}
                  </code>
                </pre>
              </figure>
            ))}
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
