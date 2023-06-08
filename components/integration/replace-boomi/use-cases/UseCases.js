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
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                            <div>
                                <h3>Application integration</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina offers an extensive array of connectors and triggers, enabling effortless interaction with various cloud applications and platforms.</p>

                                </div>
                                </div>

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/Dilhasha/ballerina-integration-samples/tree/master/salesforce_mailchimp" className={styles.cDownload}>
                                        See Sample: Salesforce new lead to MailChimp
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Data integration</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina encompasses robust tools for efficient data transformation, filtering, and manipulation, enabling seamless data integration.</p>
                                </div>
                                </div>

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/Dilhasha/ballerina-integration-samples/tree/master/edi_retail" className={styles.cDownload}>
                                        See Sample: EDI transformation in retail company
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>API integration</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina provides a powerful and intuitive framework for creating, testing, and launching APIs leveraging the concept of services.</p>
                                </div>
                                </div>

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/Dilhasha/ballerina-integration-samples/tree/master/online_book_store" className={styles.cDownload}>
                                        See Sample: Online book store API to expose inventory data
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={3} lg={3} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                <h3>Workflow integration</h3>
                                <div className={styles.cardDescription}>
                                    <p>Ballerina supports workflow integrations by interfacing with a multitude of platforms and services, employing native triggers, connectors, or custom code.</p>
                                </div>
                                </div>

                                <div className={styles.cardLinks}>
                                    <a target="_blank" rel="noreferrer" href="https://github.com/Dilhasha/ballerina-integration-samples/tree/master/shopify_to_slack" className={styles.cDownload}>
                                        See Sample: Shopify new customers to Slack
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
