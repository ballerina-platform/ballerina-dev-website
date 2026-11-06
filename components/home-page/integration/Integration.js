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
import {
    BsArrowLeftRight, BsBuilding, BsClipboardCheck, BsClockHistory, BsDatabase, BsDiagram3,
    BsHourglassSplit, BsPeople, BsPlug, BsShare, BsShieldCheck, BsStars, BsTools,
} from 'react-icons/bs';

import ProblemFlow from '../ai-shared/ProblemFlow';
import { LLM_PROVIDERS } from '../ai-shared/LlmLogos';
import shared from '../ai-shared/section.module.css';
import flow from '../ai-shared/ProblemFlow.module.css';

// Each challenge lines up with the Ballerina capability that answers it.
const CHALLENGES = {
    title: 'The challenges',
    items: [
        { icon: BsTools, title: 'Tool discovery and access' },
        { icon: BsDatabase, title: 'Memory and context' },
        { icon: BsPeople, title: 'Agent-to-Agent collaboration' },
        { icon: BsClipboardCheck, title: 'Testing agent behavior' },
        { icon: BsShieldCheck, title: 'Safe, governed actions' },
        { icon: BsHourglassSplit, title: 'Durable, long-running agents' },
    ],
};

// The LLM sits outside Ballerina: any provider can drive the agent.
const LLM = {
    title: 'LLM',
    note: 'Bring any provider',
    providers: LLM_PROVIDERS,
};

const GROUPS = [
    {
        icon: BsStars,
        label: 'Agent capabilities',
        cols: 4,
        tiles: [
            { icon: BsTools, title: 'Use tools', sub: 'MCP clients and servers' },
            { icon: BsDatabase, title: 'Remember', sub: 'Memory and RAG' },
            { icon: BsPeople, title: 'Collaborate', sub: 'Agent-to-Agent (A2A)' },
            { icon: BsClipboardCheck, title: 'Evaluate', sub: 'Test and score agents' },
        ],
    },
    {
        label: 'Integration foundation',
        cols: 4,
        tiles: [
            { icon: BsPlug, title: 'Connect', sub: 'APIs and enterprise systems' },
            { icon: BsArrowLeftRight, title: 'Transform', sub: 'Any data format' },
            { icon: BsDiagram3, title: 'Orchestrate', sub: 'Workflows and events' },
            { icon: BsClockHistory, title: 'Run reliably', sub: 'Durable, long-running work' },
        ],
    },
];

const OUTCOMES = {
    title: 'What agents do',
    items: [
        { icon: BsBuilding, title: 'Act in enterprise systems', sub: 'CRM, ERP, ITSM, and more' },
        { icon: BsHourglassSplit, title: 'Run long-running tasks', sub: 'Pause, resume, and recover' },
        { icon: BsShare, title: 'Work with agents and tools', sub: 'Over MCP and A2A' },
    ],
};

export default function Integration(props) {
    return (
        <Col xs={12}>
            <Container>
                <Row className={shared.section}>
                    <Col xs={12} className={`${flow.layout} ${flow.reverse}`}>
                        <div className={`${shared.text} ${flow.textCol}`}>
                            <p className={shared.eyebrow}>Built for agents</p>
                            <h2 id="building-agents-is-an-integration-problem" className={`section ${shared.heading}`}>
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

                            <p className={`${shared.lead} ${flow.lead}`}>Agents need to reason, use tools, access enterprise data, and execute real-world actions reliably. That’s integration, and it’s at the heart of Ballerina.</p>
                        </div>

                        <div className={flow.diagramCol}>
                            <ProblemFlow
                                label="Agent-building challenges flow into Ballerina, driven by any LLM, which delivers real-world outcomes."
                                challenges={CHALLENGES}
                                llm={LLM}
                                groups={GROUPS}
                                outcomes={OUTCOMES}
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}
