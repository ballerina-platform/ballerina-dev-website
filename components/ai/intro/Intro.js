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

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';

export default function Intro() {

    return (
        <>
            <Col xs={12}>
                <Container>
                    <Row>
                        <Col xs={12} lg={5} className={styles.introText}>
                            <div>

                                <p className={styles.introText2}>
                                    AI is no longer just trained — it&apos;s integrated.
                                </p>

                                <p className={styles.introText3}>
                                Ballerina is purpose-built for integration, making it an ideal choice for bringing AI into your applications. With built-in abstractions designed for invoking your favourite large language models and other generative AI technologies, Ballerina simplifies and streamlines AI integration like never before.
                                </p>

                                <p className={styles.dVersion}>
                                    <a href={`${prefix}/downloads/`}
                                        className={styles.cDownload}>
                                        Download Ballerina
                                    </a>
                                </p>
                            </div>
                        </Col>
                        <Col xs={12} lg={7} className={styles.introImg}>
                            {/* <Image src='/images/maxresdefault.jpg' alt='Integration' width={1280} height={780} /> */}
                            <img src={`${prefix}/images/Vectors-05.png`} alt="AI" />
                        </Col>
                    </Row>

                    {/* <Row className='pageContentRow integration'>
                <Col xs={12}>
                    <div className={styles.introText3}>
                        <p>Just write the code using the only language with integration friendly abstractions</p>
                    </div>

                    <div className={styles.dVersion}>
                        <a href={`${prefix}/downloads/`}
                            className={styles.cDownload}>
                            Download Ballerina
                        </a>
                    </div>

                </Col>
            </Row> */}



                </Container>
            </Col>
        </>
    );
}
