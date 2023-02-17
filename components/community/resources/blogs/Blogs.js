/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import styles from './Blogs.module.css';

export default function Blogs() {

    return (
        <>
            <Row>
                <Col sm={12} md={5} lg={5} className={styles.fBlogs}>
                    <h2 className="removeTopMargin">Featured blog posts</h2>

                    <div className={styles.blogInfo}>
                        <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/understanding-ballerina-websocket-service-4babb128f9a5"><h4>Ballerina WebSocket Service — The Anatomy </h4></a>
                        <p> By Bhashinee Nirmali</p>
                        <p> 24 May 2022</p>
                    </div>

                    <div className={styles.blogInfo}>
                        <a target="_blank" rel="noreferrer" href="https://betterprogramming.pub/intuitive-rest-apis-and-json-handling-with-ballerina-a-detailed-walkthrough-c5c7c48aa0de"><h4>Intuitive REST APIs and JSON Handling With Ballerina Programming Language</h4></a>
                        <p> By Dakshitha Ratnayake</p>
                        <p> 5 May 2022</p>
                    </div>

                    <div className={`${styles.blogInfo} ${styles.last}`}>
                        <a target="_blank" rel="noreferrer" href="https://blog.jclark.com/2022/05/why-ballerina-is-language.html"><h4>Why Ballerina is a language </h4></a>
                        <p> By James Clark</p>
                        <p> 4 May 2022</p>
                    </div>
                </Col>

                <Col sm={12} md={7} lg={7} className={styles.blogs}>
                    <h2 className="removeTopMargin">Blog posts</h2>
                    <div className={styles.blogWrapper}>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/understanding-ballerina-websocket-service-4babb128f9a5"><h4>Ballerina WebSocket Service — The Anatomy</h4></a>
                            <p> By Bhashinee Nirmali</p>
                            <p> 24 May 2022</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://betterprogramming.pub/intuitive-rest-apis-and-json-handling-with-ballerina-a-detailed-walkthrough-c5c7c48aa0de"><h4>Intuitive REST APIs and JSON Handling with Ballerina Programming Language</h4></a>
                            <p> By Dakshitha Ratnayake</p>
                            <p> 5 May 2022</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://blog.jclark.com/2022/05/why-ballerina-is-language.html"><h4>Why Ballerina is a Language</h4></a>
                            <p> By James Clark</p>
                            <p> 4 May 2022</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/practical-guide-for-the-language-server-protocol-3091a122b750"><h4>A Practical Guide for Language Server Protocol</h4></a>
                            <p> By Malintha Ranasinghe</p>
                            <p> 11 Dec 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/real-time-stock-data-updates-with-websockets-using-ballerina-7ecb2d4dcfa9"><h4>Real-Time Stock Data Updates with WebSockets Using Ballerina</h4></a>
                            <p> By Anupama Pathirage</p>
                            <p> 27 Nov 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/event-driven-apis-with-webhook-and-websub-83b0834f08f3"><h4>Event-Driven APIs with Webhook and WebSub</h4></a>
                            <p> By Anupama Pathirage</p>
                            <p> 8 Nov 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/@kaneeldias/connecting-to-and-using-googles-cloud-sql-with-ballerina-13e2d6594686"><h4>Connecting to and Using Google’s Cloud SQL with Ballerina </h4></a>
                            <p> By Kaneel Dias</p>
                            <p> 21 Oct 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/immutability-in-ballerina-part-i-e6c607ced627"><h4>Immutability in Ballerina — Part I </h4></a>
                            <p> By Maryam Ziyad</p>
                            <p> 26 Sep 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/geekculture/uncovering-interesting-2020-olympics-stats-with-ballerina-language-integrated-queries-7d5d0995b112"><h4>Uncovering Interesting 2020 Olympics Stats with Ballerina Language-integrated Queries</h4></a>
                            <p> By Imesha Sudasingha</p>
                            <p> 17 Sep 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/overview-of-manipulating-data-in-ballerina-with-different-apis-paypal-api-and-randomuser-me-720828919fab"><h4>Overview of Manipulating Data in Ballerina with Different APIs </h4></a>
                            <p> By Dulaj Dilshan</p>
                            <p> 7 Sep 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/introduction-to-openapi-with-ballerina-5b3212bd71a8"><h4>Introduction to OpenAPI with Ballerina</h4></a>
                            <p> By Anupama Pathirage</p>
                            <p> 4 Sep 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/introduction-to-grpc-on-ballerina-7819d98c4e2b"><h4>Introduction to gRPC on Ballerina </h4></a>
                            <p> By Anupama Pathirage</p>
                            <p> 28 Aug 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/get-started-with-service-testing-using-ballerina-test-framework-18e3b907a33"><h4>Get started with Service Testing Using Ballerina Test Framework</h4></a>
                            <p> By Fathima Dilhasha</p>
                            <p> 17 Aug 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/unit-test-ballerina-integration-with-mock-backends-ffff790edb9f"><h4>Unit Test Ballerina Integration with Mock Backends</h4></a>
                            <p> By Aquib Zulfikar</p>
                            <p> 17 Aug 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/microservices-security-with-ballerina-e9d430f05373"><h4>Microservices Security with Ballerina</h4></a>
                            <p> By Chanaka Lakmal</p>
                            <p> 3 Aug 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/go-real-time-with-ballerina-websockets-58c40ac11d6"><h4>Go Real-Time with Ballerina WebSockets</h4></a>
                            <p> By Bhashinee Nirmali</p>
                            <p> 28 July 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/make-your-own-ballerina-client-connector-using-ballerina-openapi-tool-3b375d89882"><h4>Make your Own Ballerina Client Connector Using the Ballerina OpenAPI Tool</h4></a>
                            <p> By Sumudu Nissanka</p>
                            <p> 23 July 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/rest-is-history-lets-do-graphql-with-ballerina-dce7510b61e8"><h4>REST is History, Let’s Do GraphQL (with Ballerina)</h4></a>
                            <p> By Thisaru Guruge</p>
                            <p> 29 June 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/single-liner-payload-read-85a16e3265fc"><h4>Single Liner Payload Read…</h4></a>
                            <p> By Chamil Elladeniya</p>
                            <p> 6 June 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/ballerina-integration-programming-language-5d8e1b52e582"><h4>Ballerina: Integration Programming Language</h4></a>
                            <p> By Ayesh Almeida</p>
                            <p> 9 May 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/how-ballerina-addresses-your-code-first-and-design-first-api-approaches-3b9b0086fda9"><h4>How Ballerina OpenAPI Tool Addresses your Code-First and Design-First API Approaches</h4></a>
                            <p> By Sumudu Nissanka</p>
                            <p> 4 April 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://praveennadarajah.medium.com/a-practical-guide-to-ballerina-remote-debugging-b3f8e2f9309"><h4>A Practical Guide to Ballerina Remote Debugging</h4></a>
                            <p> By Praveen Nadarajah</p>
                            <p> 31 March 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/ballerina-shell-repl-implementation-overview-ee7e909da20c"><h4>Ballerina Shell REPL — Implementation Overview</h4></a>
                            <p> By Sunera Avinash</p>
                            <p> 1 March 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/ballerina-concurrency-model-and-non-blocking-i-o-14c6bed595f4"><h4>Ballerina Concurrency Model and Non-Blocking I/O</h4></a>
                            <p> By Anjana Fernando</p>
                            <p> 23 Feb 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/graphql-made-easy-with-ballerina-5ca04d9536d0"><h4>Introduction to GraphQL with Ballerina</h4></a>
                            <p> By Anjana Fernando</p>
                            <p> 10 Feb 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/http-deep-dive-with-ballerina-services-7a6e69af2fbb"><h4>HTTP Deep-Dive with Ballerina: Services</h4></a>
                            <p> By Anjana Fernando</p>
                            <p> 29 Jan 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/ballerina-working-with-json-part-i-json-to-record-conversion-1e810b0a30f0"><h4>[Ballerina] Working with JSON — JSON to Record Conversion</h4></a>
                            <p> By Maryam Ziyad</p>
                            <p> 27 Jan 2021</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/super-cool-feature-for-your-ballerina-service-from-ballerina-openapi-tool-ac2cce9cedfb"><h4>Super Cool Feature for your Ballerina Service from Ballerina OpenAPI Tool</h4></a>
                            <p> By Sumudu Nissanka</p>
                            <p> 7 Nov 2020</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/practical-serverless-long-running-workflows-with-human-interactions-using-step-functions-and-dd6fbcb42f29"><h4>Practical Serverless: Long-Running Workflows with Human Interactions Using Step Functions and Ballerina</h4></a>
                            <p> By Anjana Fernando</p>
                            <p> 28 Sep 2020</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/practical-serverless-integrating-amazon-s3-and-rekognition-with-ballerina-f338cdf6015c"><h4>Practical Serverless: Integrating Amazon S3 and Rekognition with Ballerina</h4></a>
                            <p> By Anjana Fernando</p>
                            <p> 31 Aug 2020</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/practical-serverless-a-scalable-ocr-solution-in-10-minutes-af9f88c6b008"><h4>Practical Serverless: A Scalable OCR Solution in 10 Minutes</h4></a>
                            <p> By Anjana Fernando</p>
                            <p> 3 Aug 2020</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/introduction-to-azure-functions-in-ballerina-ffc774eae034"><h4>Introduction to Azure Functions in Ballerina</h4></a>
                            <p> By Anjana Fernando</p>
                            <p> 23 July 2020</p>
                        </div>

                        <div className={styles.blogInfo}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/redesigning-of-ballerina-cache-a2cf59b0fee1"><h4>Redesigning of Ballerina Cache</h4></a>
                            <p> By Chanaka Lakmal</p>
                            <p> 27 June 2020</p>
                        </div>

                        <div className={`${styles.blogInfo} ${styles.last}`}>
                            <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/authenticate-a-shopify-app-using-oauth-the-ballerina-way-f827ab99f576"><h4>Authenticate a Shopify App Using OAuth — The Ballerina Way</h4></a>
                            <p> By Thisaru Guruge</p>
                            <p> 3 June 2020</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </>

    );
}
