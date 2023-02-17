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

import styles from './Intro.module.css';
import { prefix } from '../../../utils/prefix';

export default function Intro() {

    return (
        <>
            <Row className=" justify-content-md-center llanding">
                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/install-ballerina/set-up-ballerina`} className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.primary}`}>
                            <p className={styles.title}>Install Ballerina</p>
                            <p className={styles.description}>Set up the Ballerina development environment</p>
                        </div>
                    </a>
                </Col>

                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/get-started-with-ballerina`} className={`${styles.cardLink} ${styles.primary}`}>
                        <div className={`${styles.cardContent} ${styles.primary}`}>
                            <p className={styles.title}>Get started with Ballerina</p>
                            <p className={styles.description}>Write your first Ballerina program and create your first Ballerina package</p>
                        </div>
                    </a>
                </Col>
            </Row>

            <Row className="cardBottomExtraMargin justify-content-md-center llanding">
                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/by-example/`} className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.secondary}`}>
                            <p className={styles.title}>Ballerina by Example</p>
                            <p className={styles.description}>A series of guided examples to learn the language</p>
                        </div>
                    </a>
                </Col>

                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href="https://lib.ballerina.io/" className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.secondary}`}>
                            <p className={styles.title}>Ballerina API Docs</p>
                            <p className={styles.description}>Library API documentation</p>
                        </div>
                    </a>
                </Col>

                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/ballerina-specifications`} className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.secondary}`}>
                            <p className={styles.title}>Ballerina specifications</p>
                            <p className={styles.description}>Language, library, and platform specifications</p>
                        </div>
                    </a>
                </Col>
            </Row>
        </>
    );
}
