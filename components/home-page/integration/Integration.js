/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import styles from './Integration.module.css';

const SOURCES = ['Applications', 'AI agents'];
const TARGETS = ['Business APIs', 'Enterprise data', 'Events & messages'];
const CAPABILITIES = ['Services & listeners', 'Clients & resources', 'JSON & XML', 'Types & queries'];

function Node({ x, y, w, h, label }) {
    return (
        <g>
            <rect className={styles.node} x={x} y={y} width={w} height={h} />
            <text className={styles.nodeLabel} x={x + w / 2} y={y + h / 2}>{label}</text>
        </g>
    );
}

function Hub({ x, y, w, h }) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    return (
        <g>
            <rect className={styles.hub} x={x} y={y} width={w} height={h} />
            <text className={styles.hubTitle} x={cx} y={cy - 14}>Ballerina</text>
            <text className={styles.hubSub} x={cx} y={cy + 9}>Connect · Transform</text>
            <text className={styles.hubSub} x={cx} y={cy + 24}>Coordinate · Expose</text>
        </g>
    );
}

function Arrow({ d, marker }) {
    return <path className={styles.link} d={d} markerEnd={`url(#${marker})`} />;
}

// Wide layout: sources on the left, Ballerina in the middle, targets on the right.
function WideDiagram() {
    const m = 'integrationArrowWide';
    return (
        <svg className={styles.wide} viewBox="0 0 400 210" role="img"
            aria-label="Applications and AI agents connect through Ballerina to business APIs, enterprise data, and events and messages.">
            <defs>
                <marker id={m} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path className={styles.arrowHead} d="M0 1 L9 5 L0 9" />
                </marker>
            </defs>
            <Node x={0} y={26} w={96} h={40} label={SOURCES[0]} />
            <Node x={0} y={144} w={96} h={40} label={SOURCES[1]} />
            <Arrow marker={m} d="M96 46 H111 V82 H125" />
            <Arrow marker={m} d="M96 164 H111 V128 H125" />

            <Hub x={126} y={55} w={124} h={100} />

            <Arrow marker={m} d="M250 80 H262 V27 H275" />
            <Arrow marker={m} d="M250 105 H275" />
            <Arrow marker={m} d="M250 130 H262 V183 H275" />
            <Node x={276} y={8} w={124} h={38} label={TARGETS[0]} />
            <Node x={276} y={86} w={124} h={38} label={TARGETS[1]} />
            <Node x={276} y={164} w={124} h={38} label={TARGETS[2]} />
        </svg>
    );
}

// Narrow layout: the same flow, top to bottom.
function NarrowDiagram() {
    const m = 'integrationArrowNarrow';
    return (
        <svg className={styles.narrow} viewBox="0 0 320 270" role="img"
            aria-label="Applications and AI agents connect through Ballerina to business APIs, enterprise data, and events and messages.">
            <defs>
                <marker id={m} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path className={styles.arrowHead} d="M0 1 L9 5 L0 9" />
                </marker>
            </defs>
            <Node x={20} y={0} w={130} h={38} label={SOURCES[0]} />
            <Node x={170} y={0} w={130} h={38} label={SOURCES[1]} />
            <Arrow marker={m} d="M85 38 V54 H130 V78" />
            <Arrow marker={m} d="M235 38 V54 H190 V78" />

            <Hub x={60} y={80} w={200} h={92} />

            <Arrow marker={m} d="M110 172 V190 H50 V212" />
            <Arrow marker={m} d="M160 172 V212" />
            <Arrow marker={m} d="M210 172 V190 H270 V212" />
            <Node x={0} y={214} w={100} h={46} label={TARGETS[0]} />
            <Node x={110} y={214} w={100} h={46} label={TARGETS[1]} />
            <Node x={220} y={214} w={100} h={46} label={TARGETS[2]} />
        </svg>
    );
}

export default function Intro(props) {

    return (
        <>
        <Col xs={12}>
            <Container>
            <Row className={styles.integrationRow}>
                <Col xs={{ span: 12, order: 2 }} lg={{ order: 1 }} className={styles.diagramCol}>
                    <figure className={styles.diagram}>
                        <p className={styles.diagramTitle}>The same foundations. New interactions.</p>
                        <WideDiagram />
                        <NarrowDiagram />
                        <figcaption className={styles.caption}>
                            The same integration foundations connect applications and AI agents to enterprise systems.
                        </figcaption>
                    </figure>
                </Col>
                <Col xs={{ span: 12, order: 1 }} lg={{ order: 2 }} className={`${styles.textCol} ${styles.introText}`}>
                    <p className={styles.eyebrow}>Integration is the foundation</p>
                    <h2 id="agentic-ai-is-an-integration-problem" className={`section ${styles.heading}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-link-45deg mdButton pe-2"
                            viewBox="0 0 16 16"
                            onClick={(e) => props.getLink(e.target, 'agentic-ai-is-an-integration-problem')}
                        >
                            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        Agentic AI is an integration problem.
                    </h2>

                    <p className={styles.introText2}>An agent that does real work spends much of its time calling systems it does not control and waiting on them. It retrieves data, invokes tools, and coordinates actions across systems. That is integration.</p>

                    <p className={styles.introText2}>Ballerina was designed for this from day one. Agents get the same first-class services, listeners, clients, and resources, with structural types and explicit error handling, as every other integration.</p>

                    <ul className={styles.chips}>
                        {CAPABILITIES.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                </Col>
            </Row>

            </Container>
            </Col>
        </>
    );
}
