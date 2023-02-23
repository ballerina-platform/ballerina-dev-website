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
import styles from './Position.module.css';

export default function Position(props) {

    return (
        <>
            <Row className="pageContentRow integration">
                <Col xs={12} md={12}>
                    <h2 id="position-ballerina" className='section'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            className="bi bi-link-45deg mdButton pe-2"
                            viewBox="0 0 16 16"
                            onClick={(e) => props.getLink(e.target, 'position-ballerina')}
                        >
                            <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                            <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        Position Ballerina
                    </h2>
                </Col>
            </Row>
            <Row className='pageContentRow integration'>
                <Col xs={12} md={4} lg={4} className={styles.box}>
                    <div className={styles.wrapper}>
                        <div className={styles.introText1}>INTEGRATION <br />
                            PRODUCTS
                        </div>

                        <div className={styles.introText2}>
                            ESB, BPMN, EAI
                        </div>
                        <div className={styles.introText3}><span>NOT AGILE</span></div>
                    </div>
                </Col>
                <Col xs={12} md={4} lg={4} className={styles.boxGreen}>
                    <div>
                        <div className={`${styles.icon} ${styles.triangleLeft}`}></div>
                        <div className={styles.middle}>
                            {/* <Image src={`${prefix}/images/ballerina-logo-white.svg`} alt="Ballerina" width={660} height={120}/> */}
                            <p>The<br/>Integration<br/>Gap</p>
                        </div>
                        <div className={`${styles.icon} ${styles.triangleRight}`}></div>

                    </div>
                </Col>
                <Col xs={12} md={4} lg={4} className={styles.box}>
                    <div className={styles.wrapper}>
                        <div className={styles.introText1}>GENERAL PURPOSE <br />
                            PROGRAMMING LANGUAGES
                        </div>

                        <div className={styles.introText2}>
                            Java / Spring <br />
                            JavaScript / Node
                        </div>
                        <div className={styles.introText3}><span>NOT INTEGRATION SIMPLE</span></div>
                    </div>
                </Col>
            </Row>
        </>
    );
}
