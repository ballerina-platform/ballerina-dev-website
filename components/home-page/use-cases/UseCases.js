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
import { FaNewspaper } from 'react-icons/fa';
import Image from 'next-image-export-optimizer';

import styles from './UseCases.module.css';

export default function UseCases(props) {

    return (
        <>
            <Col xs={12}>
                <Container>
                    <Row>
                        <Col sm={12} className='sectionTitle'>
                            <h2 id="ballerina-mentions" className='section'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="currentColor"
                                    className="bi bi-link-45deg mdButton pe-2"
                                    viewBox="0 0 16 16"
                                    onClick={(e) => props.getLink(e.target, 'ballerina-mentions')}
                                >
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                </svg>
                                Ballerina mentions
                            </h2>
                        </Col>
                    </Row>

                    <Row className='pageContentRow' style={{marginBottom:"25px"}}>
                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                    <div className={styles.cardDescription}>
                            
                                        <a href="https://levelup.gitconnected.com/10-lesser-known-programming-languages-revolutionizing-the-tech-industry-july-2023-edition-64f356d0df8d">10 lesser-known programming languages revolutionizing the tech industry (July 2023 edition)</a>

                                    </div>
                                </div>

                                <div className={styles.cardDate}>
                                    Jul 4, 2023
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                    <div className={styles.cardDescription}>
                                        <a href="https://www.cmarix.com/blog/best-microservices-frameworks/">Top microservices frameworks to build scalable applications</a>
                                    </div>
                                </div>

                                <div className={styles.cardDate}>
                                June 19, 2023
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                    <div className={styles.cardDescription}>
                                        <a href="https://www.codelivly.com/lesser-known-programming-languages-worth-exploring/">8 lesser-known programming languages worth exploring</a>
                                    </div>
                                </div>

                                <div className={styles.cardDate}>
                                June 12, 2023
                                </div>
                            </div>
                        </Col>
                        
                    </Row>



                    <Row className='pageContentRow' style={{marginBottom:"25px"}}>
                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                    <div className={styles.cardDescription}>
                            
                                        <a href="https://www.tatvasoft.com/blog/top-12-microservices-frameworks/">Top 12 microservices frameworks</a>

                                    </div>
                                </div>

                                <div className={styles.cardDate}>
                                April 25, 2023
                                </div>
                            </div>
                        </Col>

                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                    <div className={styles.cardDescription}>
                                        <a href="#">14 programming languages you&apos;ve probably never heard of</a>
                                    </div>
                                </div>

                                <div className={styles.cardDate}>
                                April 12, 2023
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={4} lg={4} className={styles.useCaseCard}>
                            <div className={styles.cardWrapper}>
                                <div>
                                    <div className={styles.cardDescription}>
                                        <a href="https://camunda.com/blog/2022/09/seven-best-programming-languages-for-microservices/">7 best programming languages for microservices</a>
                                    </div>
                                </div>

                                <div className={styles.cardDate}>
                                September 12, 2022
                                </div>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </Col>
        </>
    );
}