/**
 * Copyright (c) 2024, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import styles from './GetInvolved.module.css';

export default function GetInvolved(props) {

    return (
        <Col xs={12}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 id='get-involved' className='section'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'get-involved')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            Get involved
                        </h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12}>
                        <p>If you&apos;re interested in collaborating with us on any of these programs or have ideas beyond what&apos;s listed, feel free to contact the team.</p>
                    </Col>
                </Row>

                <Row style={{ alignItems: "center" }}>
                    <Col sm={12} md={6} lg={3}>
                        <a href="mailto:contact@ballerina.io">
                            <button type="button" className={styles.sendEmail}>contact@ballerina.io</button>
                        </a>

                    </Col>

                    <Col sm={12} md={6} lg={3}>

                        <a href={`https://discord.gg/ballerinalang`}
                            className={styles.discord}>
                            Join our Discord server
                        </a>

                    </Col>
                </Row>

            </Container>
        </Col>
    );
}
