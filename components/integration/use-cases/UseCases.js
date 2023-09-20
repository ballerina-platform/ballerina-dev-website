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
                            <h2 id="solve-any-integration-challenge" className='section'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="currentColor"
                                    className="bi bi-link-45deg mdButton pe-2"
                                    viewBox="0 0 16 16"
                                    onClick={(e) => props.getLink(e.target, 'solve-any-integration-challenge')}
                                >
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                </svg>
                                Solve any integration challenge
                            </h2>
                        </Col>
                    </Row>

                    <Row className='pageContentRow integration'>
                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                            <div>
                                <h3>Automate anything</h3>
                                <div className={styles.cardDescription}>
                                    <p>Automation is just code after all - write a main() and do whatever you want.</p>

                                    <p>Use the Ballerina library to connect to any system, speak any protocol, process any data, and run it anywhere (on a VM, in Kubernetes, or just as a script).</p>

                                    <p>Powerful data transformations that can be simultaneously programmed graphically and as code makes data integration a breeze.</p>

                                </div>
                                </div>
                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Automation: GitHub to Google Sheets</p>
                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/ballerina-guides/integration-samples/blob/main/github-pull-requests-to-gsheets/main.bal" className={styles.cDownload}>
                                        See sample automation: GitHub to Google Sheets
                                    </a>
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Event-driven integrations</h3>
                                <div className={styles.cardDescription}>
                                    <p>Events are core to the responsive enterprise. Ballerina makes it simple to consume or produce events.</p>

                                    <p>Subscribe to any kind of event source, including WebHooks, Kafka, GraphQL, gRPC, AMQP, email, or react to system events such as file upload and do whatever you want in a type-safe development model with subscription, data binding, and error handling is already taken care of for you.</p>

                                    <p>Be an event producer in any protocol you like.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Event Integration: Google Calendar to Trello Card</p>

                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/ballerina-guides/integration-samples/blob/main/gcalendar-new-event-to-trello-card/main.bal" className={styles.cDownload}>
                                        See sample event integration: Google Calendar to Trello Card
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Integrations as APIs</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina&apos;s service creation abstractions make it simple to take any integration and make it reusable as an API.</p>

                                    <p>Use Ballerina service types for HTTP services, WebSockets, GraphQL, gRPC, and more to take your integration code, parameterize it and make it a reusable integration.</p>

                                    <p>APIs are the new DLLs. Exposing your integrations as APIs is how your integrated capability adds new value to your business.</p>
                                </div>
                                </div>

                                {/* <div className={styles.sampleText}>
                                    <p>See Sample Integration as an API</p>
                                </div> */}

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/ballerina-guides/integration-samples/blob/main/azure-cosmosdb-data-as-rest-api/main.bal" className={styles.cDownload}>
                                        See sample integration as an API: Azure Cosmos DB data as a REST API
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