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
import Image from 'next-image-export-optimizer';

import styles from './UniversitySessions.module.css';
import { prefix } from '../../../utils/prefix';


export default function UniversitySessions(props) {

    const [hoverBtn, setHoverBtn] = React.useState(false);

    let linkArrowPath = prefix + '/images/toc-bg.svg';
    let linkArrowHoverPath = prefix + '/images/toc-bg-hover.svg';

    return (
        <Col xs={12}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 id='student-engagement-program' className='section'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'student-engagement-program')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            Student engagement program
                        </h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12} md={6} lg={6}>
                        <p>
                        If you are a university student, here is your chance to enhance your practical programming skills through workshops, hackathons, contributing to open-source projects, and more. This program is designed to offer real-world experiences and opportunities for growth in the tech industry.
                        </p>
                        <p className={styles.linkWrap}
                            onMouseEnter={() => {
                                setHoverBtn(true);
                            }}
                            onMouseLeave={() => {
                                setHoverBtn(false);
                            }}
                        >
                            <a href={`${prefix}/community/student-program`} className={styles.viewAll}>
                                Learn more <Image src={`${hoverBtn ? linkArrowHoverPath : linkArrowPath}`} width={20} height={20} alt="Left Arrow" />
                            </a>
                        </p >
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                        <img src={prefix + '/images/community/ballerina-student-engagement-program-banner.png'} alt='Student engagement program' style={{ width: "100%" }} />
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}
