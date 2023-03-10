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
import Image from 'next-image-export-optimizer';

import styles from './UseCases.module.css';

export default function UseCases(props) {

    return (
        <>
            <Col xs={12}>
                <Container>
                    <Row>
                        <Col xs={12} md={12}>
                            <h2 id="solve-any-automation-challenge" className='section'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="currentColor"
                                    className="bi bi-link-45deg mdButton pe-2"
                                    viewBox="0 0 16 16"
                                    onClick={(e) => props.getLink(e.target, 'solve-any-automation-challenge')}
                                >
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                </svg>
                                Solve any automation challenge
                            </h2>
                        </Col>
                    </Row>

                    <Row className='pageContentRow integration'>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                            <div>
                                <h3>Trigger-based Automations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina can be used to create custom trigger-based automations by integrating with various platforms and services using native connectors or custom code.</p>

                                </div>
                                </div>
                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Automation: GitHub to Google Sheets</p>
                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://zapier.com/apps/gmail/integrations/google-forms/11008/send-email-via-gmail-for-new-google-forms-submissions" className={styles.cDownload}>
                                        Send email via Gmail for new Google Forms submissions
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Multi-step automations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina's sequence diagrams and message-passing syntax make it easy to create multi-step automation workflows that involve data transformation, filtering, or formatting.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Event Integration: Google Calendar to Trello Card</p>

                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://blog.trello.com/multi-step-zaps-with-zapier-and-trello" className={styles.cDownload}>
                                    When you’re creating your next MailChimp campaign you can set up a Multi-Step Zap that automatically creates a card for this campaign on your email marketing Trello board. This Trello card creation subsequently creates an automated message in your Email Marketing Slack channel that notifies everyone on your team in real time.
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Schedule-based automations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina provides built-in support for scheduling tasks, allowing developers to create custom automation workflows that are triggered at specific times.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Integration as an API</p>
                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://zapier.com/apps/schedule/integrations/slack/1523/get-weekly-reminders-in-slack" className={styles.cDownload}>
                                        Send weekly reminders in Slack
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Webhook automations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina can be used to create custom webhook automations by creating custom connectors or using native connectors to integrate with external services.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Integration as an API</p>
                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://zapier.com/apps/gmail/integrations/webhook/16625/create-google-sheets-rows-and-send-emails-in-gmail-with-new-caught-webhooks" className={styles.cDownload}>
                                        Create Google Sheets rows and send emails in Gmail with new caught webhooks in Salesforce
                                    </a>
                                </div>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </Col>
        </>
    );
}