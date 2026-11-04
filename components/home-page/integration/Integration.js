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
import BuildingBlocks from './BuildingBlocks';
import styles from './Integration.module.css';

// The building blocks of an agent, all provided by Ballerina.
const LAYERS = [
    {
        name: 'Surface', role: 'Meets users', blocks: [
            { title: 'Interface', sub: 'Chat, voice, messaging triggers, webhooks, HTTP' },
        ],
    },
    {
        name: 'Action', role: 'Does things safely', blocks: [
            { title: 'Agent ID', sub: 'Identity and permissions' },
            { title: 'Human approval', sub: 'Pause for review before acting' },
            { title: 'Observe & eval', sub: 'Traces and evaluations' },
        ],
    },
    {
        name: 'Reach', role: 'Connects & remembers', blocks: [
            { title: 'Tools & skills', sub: 'MCP, tools, connectors' },
            { title: 'Agent-to-Agent', sub: 'A2A' },
            { title: 'Memory', sub: 'Short- and long-term' },
        ],
    },
    {
        name: 'Control', role: 'Drives the loop', blocks: [
            { title: 'Orchestration loop', sub: 'The reason-and-act cycle that turns a model into an agent, durable when it must be' },
        ],
    },
];

// The model sits outside Ballerina: any provider can drive the agent.
const BASE = {
    label: 'Model-agnostic',
    items: [{ title: 'LLM', sub: 'OpenAI, Anthropic, Azure OpenAI, Mistral, DeepSeek, Ollama, and more' }],
};

export default function Integration(props) {

    return (
        <>
        <Col xs={12}>
            <Container>
            <Row className={styles.integrationRow}>
                <Col xs={{ span: 12, order: 2 }} lg={{ order: 1 }} className={styles.diagramCol}>
                    <BuildingBlocks
                        title="Building blocks of an agent"
                        layers={LAYERS}
                        base={BASE}
                        caption="Every block in the frame is part of Ballerina: how agents meet users, act safely, reach tools and data, remember, and run the reason-and-act loop. The LLM is your choice, and switching providers leaves the rest of the agent unchanged."
                    />
                </Col>
                <Col xs={{ span: 12, order: 1 }} lg={{ order: 2 }} className={`${styles.textCol} ${styles.introText}`}>
                    <p className={styles.eyebrow}>Built for agents</p>
                    <h2 id="building-agents-is-an-integration-problem" className={`section ${styles.heading}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-link-45deg mdButton pe-2"
                            viewBox="0 0 16 16"
                            onClick={(e) => props.getLink(e.target, 'building-agents-is-an-integration-problem')}
                        >
                            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        Building agents is an integration problem.
                    </h2>

                    <p className={styles.introText2}>A model decides what an agent does next. Everything around that decision follows the principles of integration, under new names. Integrations speak HTTP and GraphQL; agents speak MCP and A2A. Connectors become tools, and stored state becomes memory. Service security becomes agent identity and permissions. Observability extends to evaluations that score what the agent decided. And long-running workflows become the orchestration loop, which can pause for human approval and resume days later.</p>

                    <p className={styles.introText2}>Because the principles map, Ballerina extends the answers it already has instead of starting over. Agents use the same services, clients, types, and error handling as integrations.</p>
                </Col>
            </Row>


            </Container>
            </Col>
        </>
    );
}
