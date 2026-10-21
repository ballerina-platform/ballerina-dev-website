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
import { prefix } from '../../../utils/prefix';
import styles from './Integration.module.css';

const CAPABILITIES = ['Services & listeners', 'Clients & resources', 'JSON & XML', 'Types & queries'];

// The parts of the agent stack that are built with Ballerina, resting on the model.
const LAYERS = [
    {
        name: 'Surface', role: 'Meets users', blocks: [
            { title: 'Interface', sub: 'Chat, voice, messaging triggers, webhooks, HTTP' },
        ],
    },
    {
        name: 'Action', role: 'Does things safely', cols: 'three', blocks: [
            { title: 'Agent ID', sub: 'Identity and permissions' },
            { title: 'Human approval', sub: 'Pause for review before acting' },
            { title: 'Observe & eval', sub: 'Traces and evaluations' },
        ],
    },
    {
        name: 'Reach', role: 'Connects & remembers', cols: 'three', blocks: [
            { title: 'Tools & skills', sub: 'MCP, tools, connectors' },
            { title: 'Agent-to-agent', sub: 'A2A' },
            { title: 'Memory', sub: 'Short- and long-term' },
        ],
    },
    {
        name: 'Control', role: 'Drives the loop', blocks: [
            { title: 'Orchestration loop', sub: 'The reason-and-act cycle that turns a model into an agent' },
        ],
    },
];

// The two ways integration has traditionally been built, and where each falls short.
const GAP = {
    products: {
        title: 'Integration products & platforms',
        items: ['ESB, EAI, BPM', 'iPaaS and low-code builders'],
        verdict: 'Not code-first',
    },
    languages: {
        title: 'General-purpose languages & frameworks',
        items: [
            ['Java', 'Spring Boot, Quarkus'],
            ['Node.js', 'Express, NestJS'],
            ['Python', 'Flask, FastAPI'],
        ],
        verdict: 'Wrong abstractions',
    },
};

function IntegrationGap() {
    return (
        <figure className={styles.gap}>
            <figcaption className={styles.gapLead}>
                <p className={styles.diagramTitle}>Ballerina fills the integration gap</p>
                <p className={styles.gapText}>
                    Integration products connect systems but keep the logic in configuration, outside the code.
                    General-purpose languages are flexible but leave network calls, data mapping, and failure handling to libraries.
                </p>
            </figcaption>
            <div className={styles.gapGrid}>
                <div className={styles.gapSide}>
                    <p className={styles.gapTitle}>{GAP.products.title}</p>
                    <ul className={styles.gapItems}>
                        {GAP.products.items.map((i) => <li key={i}>{i}</li>)}
                    </ul>
                    <p className={styles.gapVerdict}>{GAP.products.verdict}</p>
                </div>
                <div className={styles.gapCenter}>
                    <img className={styles.gapLogo} src={`${prefix}/images/ballerina-logo-white.svg`} alt="Ballerina" />
                    <p className={styles.gapClaim}>The programming language for integration and agentic AI</p>
                    <p className={styles.gapCenterText}>Services, clients, and data are part of the language, and agents are built with the same constructs.</p>
                </div>
                <div className={styles.gapSide}>
                    <p className={styles.gapTitle}>{GAP.languages.title}</p>
                    <dl className={styles.gapLangs}>
                        {GAP.languages.items.map(([lang, frameworks]) => (
                            <React.Fragment key={lang}>
                                <dt>{lang}</dt>
                                <dd>{frameworks}</dd>
                            </React.Fragment>
                        ))}
                    </dl>
                    <p className={styles.gapVerdict}>{GAP.languages.verdict}</p>
                </div>
            </div>
        </figure>
    );
}

function Block({ title, sub }) {
    return (
        <li className={styles.block}>
            <span className={styles.blockTitle}>{title}</span>
            <span className={styles.blockSub}>{sub}</span>
        </li>
    );
}

function AgentStack() {
    return (
        <div className={styles.stack}>
            {LAYERS.map((layer) => (
                <div key={layer.name} className={styles.layer}>
                    <div className={styles.layerLabel}>
                        <span className={styles.layerName}>{layer.name}</span>
                        <span className={styles.layerRole}>{layer.role}</span>
                    </div>
                    <ul className={`${styles.blocks} ${layer.cols ? styles[layer.cols] : ''}`}>
                        {layer.blocks.map((b) => <Block key={b.title} {...b} />)}
                    </ul>
                </div>
            ))}
            <div className={styles.model}>The model</div>
        </div>
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
                        <p className={styles.diagramTitle}>Building blocks of agentic integration</p>
                        <AgentStack />
                        <figcaption className={styles.caption}>
                            Ballerina is the integration layer of the agent stack: how agents meet users, reach tools and data, remember, and run the reason-and-act loop.
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

                    <p className={styles.introText2}>Integration has long been built in one of two ways: with integration products that sit outside the code, or with general-purpose languages that were not designed for it.</p>

                    <p className={styles.introText2}>Ballerina fills that gap. It is a programming language designed for integration, so agents get the same first-class services, listeners, clients, and resources, with structural types and explicit error handling, as every other integration.</p>

                    <ul className={styles.chips}>
                        {CAPABILITIES.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <IntegrationGap />
                </Col>
            </Row>

            </Container>
            </Col>
        </>
    );
}
