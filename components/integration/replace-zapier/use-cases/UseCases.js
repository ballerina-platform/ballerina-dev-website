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
                                    <a target="_blank" rel="noreferrer" href="https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/gdrive-new-event-to-slack-message" className={styles.cDownload}>
                                        See Sample: GDrive events  to Slack
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Multi-step automations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina language capabilities make creating multi-step automation workflows that involve data transformation, filtering, or formatting easy.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Event Integration: Google Calendar to Trello Card</p>

                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/github-new-issue-assigned-to-trello-card-and-twilio-sms" className={styles.cDownload}>
                                        See Sample: GitHub to Trello and Twilio
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Schedule-based automations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina provides built-in support for scheduling tasks, allowing developers to create custom automation workflows triggered at specific times.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Integration as an API</p>
                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/daily-github-pr-summary-to-gmail" className={styles.cDownload}>
                                        See Sample: Daily GitHub summary to Gmail
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Search-based automations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina provides more control over the search process, allowing for greater customization and flexibility by writing custom code to search for specific data.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Integration as an API</p>
                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/search-weather-data-to-twilio-sms" className={styles.cDownload}>
                                        See Sample: Search weather data and send as SMS
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