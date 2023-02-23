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
import { Row, Col } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import { prefix } from '../../../utils/prefix';
import styles from './Code.module.css';

export default function UseCases(props) {

    const samples = props.samples;



    const networkData = samples['network-data'];
    // const workingWithData = samples['working-with-data'];
    // const restfulApi = samples['restful-api'];
    // const grpcCode1 = samples['grpc-api'];
    // const grpcCode2 = samples['grpc-api-proto'];
    // const graphqlApi = samples['graphql-api'];
    // const kafkaConsumer = samples['kafka-consumer-producer'];
    // const workingWithDataBases = samples['working-with-databases'];

    return (
        <>
            {/* <Row className="pageContentRow integration">
                <Col xs={12} md={12}>
                    <h2 id="edit-debug-run-in-vscode" className='section'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-link-45deg mdButton pe-2"
                            viewBox="0 0 16 16"
                            onClick={(e) => props.getLink(e.target, 'edit-debug-run-in-vscode')}
                        >
                            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        Edit, Debug, Run in VSCode
                    </h2>
                </Col>
            </Row> */}

<Row className='pageContentRow integration'>
                <Col xs={12} md={3} lg={3} className={styles.box}>
                    <div className={styles.wrapper}>
                    <h3 id="edit-debug-run-in-vscode" className='section'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-link-45deg mdButton pe-2"
                            viewBox="0 0 16 16"
                            onClick={(e) => props.getLink(e.target, 'edit-debug-run-in-vscode')}
                        >
                            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        Edit, Debug, Run in VSCode
                    </h3>
                        <p>Tired of disjointed toolchains disrupting your workflow? Take control of your integration development with Ballerina. Realize your ideas in VSCode, use your favorite tools, and store them in Git.</p>
                        <div className={styles.dVersion}>
                            <a href={`${prefix}/#/`} className={styles.cDownload}>
                                <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                View code on GitHub
                            </a>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={9} lg={9} className={styles.box}>
                    <div className={styles.codeSnippet}>
                        <div className="highlight" dangerouslySetInnerHTML={{ __html: networkData }} />
                    </div>
                </Col>
            </Row>

            <Row className='pageContentRow integration'>
                <Col xs={12} md={3} lg={3} className={styles.box}>
                    <div className={styles.wrapper}>
                        <h3>Network Data == Program Data</h3>
                        <p>Data coming over the wire is seamlessly mapped to domain types without explicit data binding in Ballerina. Works with a wide range of data formats such as JSON, XML, and EDI.</p>
                        <div className={styles.dVersion}>
                            <a href={`${prefix}/#/`} className={styles.cDownload}>
                                <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                View code on GitHub
                            </a>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={9} lg={9} className={styles.box}>
                    <div className={styles.codeSnippet}>
                        <div className="highlight" dangerouslySetInnerHTML={{ __html: networkData }} />
                    </div>
                </Col>
            </Row>

            <Row className='pageContentRow integration'>
                <Col xs={12} md={3} lg={3} className={styles.box}>
                    <div className={styles.wrapper}>
                        <h3>Network Resiliency</h3>
                        <p>Use built-in network resiliency features to ensure reliable communication between services, including circuit breaker, failover, timeout, and retries. Ensure your critical integration flows continue to function even in the face of network disruptions or service failures.</p>
                        <div className={styles.dVersion}>
                            <a href={`${prefix}/#/`} className={styles.cDownload}>
                                <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                View code on GitHub
                            </a>
                        </div>
                    </div>
                </Col>
                <Col xs={12} md={9} lg={9} className={styles.box}>
                    <div className={styles.codeSnippet}>
                        <div className="highlight" dangerouslySetInnerHTML={{ __html: networkData }} />
                    </div>
                </Col>
            </Row>

            <Row className='pageContentRow integration'>
                <Col xs={12} md={3} lg={3} className={styles.box}>
                    <div className={styles.wrapper}>
                        <h3>GitHub Copilot, Your Pair Programmer</h3>
                        <p>GitHub Copilot knows Ballerina. Why do all the work? Let Copilot do at least half of it.</p>
                        {/* <div className={styles.dVersion}>
                        <a href={`${prefix}/#/`} className={styles.cDownload}>
                            <img src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                            View code on GitHub
                        </a>
                    </div> */}
                    </div>
                </Col>
                <Col xs={12} md={9} lg={9} className={styles.box}>
                    {/* <div className={styles.codeSnippet}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: kafkaConsumer }} />
                    </div> */}
                    <Image src={`${prefix}/images/github-copilot.jpeg`} width={1360} height={580} alt="Github copilot" />
                </Col>
            </Row>
        </>
    );
}
