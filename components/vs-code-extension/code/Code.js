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
import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import { prefix } from '../../../utils/prefix';
import styles from './Code.module.css';

export default function UseCases(props) {

    const samples = props.samples;

    const architectureView = samples['design-the-application'];

    return (
        <>

                        {/* Architecture View */}
                        <Row className="pageContentRow integration code odd">
                <Col xs={12}>
                    <Container>
                        <Row>
                            <Col xs={12} className={styles.box}>
                                <h2 id='design-the-application' className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, 'design-the-application')}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {architectureView.frontmatter.title}
                                </h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={5} lg={5} className={styles.box}>
                                <div className={styles.wrapper}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{architectureView.frontmatter.description}</ReactMarkdown>
                                    <div className={styles.dVersion}>
                                         {/* <span>Sample 1: Summarize text using OpenAI</span>  */}
                                        <a href='https://wso2.com/ballerina/vscode/docs/design-the-application/' className={styles.cDownload} target="_blank" rel="noreferrer">
                                             {/* <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />  */}
                                            
                                            <Image src={`${prefix}/images/docs-grey.svg`} width={20} height={20} alt="Design your project" />
                                            Design the application
                                        </a>
                                        <a href='https://github.com/ballerina-guides/gcp-microservices-demo' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div>
{/* 
 

                                    <div className={styles.dVersion}>
                                        <span>Sample 3: Tweet on upcoming and recently released movies using Azure OpenAI</span>
                                        <a href='https://github.com/ballerina-guides/ai-samples/blob/main/tweet_on_upcoming_and_recently_released_movies_using_azure_openai/main.bal' className={styles.cDownload} target="_blank" rel="noreferrer">
                                            <Image src={`${prefix}/images/github-grey.svg`} width={20} height={20} alt="View code on GitHub" />
                                            View code on GitHub
                                        </a>
                                    </div> */}
                                </div>
                            </Col>
                            <Col xs={12} md={7} lg={7} className={styles.box}>
                                <div id="code-tab">
                                    <Tabs defaultActiveKey="architectureView1" id="code" className="mb-3 codeTabs">
                                        <Tab eventKey="architectureView1" title="Level 1">
                                            <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/architecture-view-level1.png`}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="architectureView2" title="Level 2">
                                        <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/architecture-view-level2.png`}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="architectureView3" title="Type Diagram">
                                        <div className={styles.codeSnippet}>
                                                <img src={`${prefix}/images/type-diagram.png`}/>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>





        </>
    );
}
