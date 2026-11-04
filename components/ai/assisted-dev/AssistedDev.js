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
import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap';

import { prefix } from '../../../utils/prefix';
import { SectionHeading, ResourceLink, Markdown } from '../code/Code';
import styles from '../code/Code.module.css';


function TabContent({ tab }) {
    if (tab.src) {
        return (
            <div className={styles.codeSnippet}>
                <img
                    src={`${prefix}${tab.src}`}
                    alt={tab.alt}
                    width={tab.width || undefined}
                    height={tab.height || undefined}
                    loading="lazy"
                    className={styles.screenshot}
                />
            </div>
        );
    }
    return (
        <div className={styles.codeSnippet}>
            <div className="highlight" dangerouslySetInnerHTML={{ __html: tab.code }} />
        </div>
    );
}

export default function AssistedDev({ sections, getLink }) {
    return (
        <>
            {sections.map((section, index) => (
                <Row key={section.id} className={`pageContentRow integration code${index % 2 === 0 ? ' odd' : ''}`}>
                    <Col xs={12}>
                        <Container>
                            <Row>
                                <Col xs={12} className={styles.box}>
                                    <SectionHeading id={section.id} title={section.title} getLink={getLink} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={5} lg={5} className={styles.box}>
                                    <div className={styles.wrapper}>
                                        <Markdown>{section.description}</Markdown>
                                        {section.details ?
                                            <div className={styles.details}>
                                                <Markdown>{section.details}</Markdown>
                                            </div>
                                            : null}
                                        {section.links.map((link) => (
                                            <ResourceLink key={link.url} label={link.label} url={link.url} action={link.action || undefined} />
                                        ))}
                                    </div>
                                </Col>
                                <Col xs={12} md={7} lg={7} className={styles.box}>
                                    <Tabs
                                        defaultActiveKey={section.tabs.length > 0 ? section.tabs[0].key : undefined}
                                        id={`${section.id}-tabs`}
                                        className="mb-3 codeTabs"
                                    >
                                        {section.tabs.map((tab) => (
                                            <Tab eventKey={tab.key} title={tab.title} key={tab.key}>
                                                <TabContent tab={tab} />
                                            </Tab>
                                        ))}
                                    </Tabs>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            ))}

            {/* back to runtime AI integrations */}
            <Row className={`pageContentRow integration code${sections.length % 2 === 0 ? ' odd' : ''}`}>
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <SectionHeading id="ai-in-your-integrations" title="Related: AI in your integrations" getLink={getLink} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={8} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <p>
                                        To call models, ground answers in enterprise data, build agents, expose MCP tools,
                                        add approvals and durable workflows, and evaluate and trace AI behavior at run time,
                                        see Ballerina for AI.
                                    </p>
                                    <ResourceLink url="/use-cases/ai/" action="Explore Ballerina for AI" />
                                    <ResourceLink url="/use-cases/ai/#natural-expressions" action="Compare with runtime natural expressions" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </>
    );
}
