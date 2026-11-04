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

import BuildingBlocks from '../integration/BuildingBlocks';
import shared from '../ai-shared/section.module.css';
import styles from './IntegrationGap.module.css';

// The building blocks every integration needs, all provided by Ballerina.
const LAYERS = [
    {
        name: 'Expose', role: 'Meets consumers', blocks: [
            { title: 'Services & APIs', sub: 'HTTP, GraphQL, gRPC, WebSocket, Kafka, and more' },
        ],
    },
    {
        name: 'Protect', role: 'Runs safely', blocks: [
            { title: 'Security', sub: 'OAuth2, JWT, mTLS' },
            { title: 'Resilience', sub: 'Typed errors, retries, failover' },
            { title: 'Observability', sub: 'Metrics, traces, logs' },
        ],
    },
    {
        name: 'Data', role: 'Understands payloads', blocks: [
            { title: 'Typed data', sub: 'JSON, XML, CSV, and EDI as types' },
            { title: 'Data mapping', sub: 'Transform and query in place' },
        ],
    },
    {
        name: 'Flow', role: 'Coordinates work', blocks: [
            { title: 'Concurrency', sub: 'Parallel calls and fan-out' },
            { title: 'Transactions', sub: 'All-or-nothing updates' },
            { title: 'Long-running work', sub: 'Waits and resumes' },
        ],
    },
    {
        name: 'Connect', role: 'Reaches systems', blocks: [
            { title: 'Connectors', sub: 'SaaS apps, databases, message queues, and legacy systems' },
        ],
    },
];

export default function IntegrationGap(props) {
    return (
        <Col xs={12}>
            <Container>
                <Row className={`${shared.section} ${styles.section}`}>
                    <Col xs={12} lg={6} className={`${shared.text} ${styles.textCol}`}>
                        <p className={shared.eyebrow}>Built for integration</p>
                        <h2 id="ballerina-solves-the-integration-problem" className={`section ${shared.heading}`}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'ballerina-solves-the-integration-problem')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            Ballerina solves the integration problem.
                        </h2>

                        <p className={shared.lead}>Integration brings a recurring set of hard problems. It speaks each system’s protocol: HTTP, GraphQL, gRPC, and more. It moves JSON, XML, CSV, EDI, and more from one system’s shape to another’s. It calls systems it does not control, over networks that could fail. It makes those calls concurrently and combines the results. And it must stay secure, observable, and consistent throughout.</p>

                        <p className={`${shared.lead} ${styles.answer}`}>Ballerina answers each of them in the language. Services and listeners speak the protocols, and connectors reach SaaS apps, databases, and legacy systems as typed clients. Network data binds straight to types. Errors are values the compiler makes you handle, with retries and transactions built in. Workers and strands run calls in parallel, and the compiler checks that shared data stays safe.</p>
                    </Col>

                    <Col xs={12} lg={6} className={styles.diagramCol}>
                        <BuildingBlocks
                            onGrey
                            title="Building blocks of an integration"
                            layers={LAYERS}
                            caption="Every block in the frame is part of the Ballerina language or its standard library."
                        />
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}
