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

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';

export default function Intro() {

    return (
        <>
        <Col xs={12}>
            <Container>
            <Row className='pageContentRow integration'>
                <Col xs={12} lg={5} className={styles.introText}>
                    <div>

                        <p className={styles.introText2}>Ballerina is the only language with native support for B2B integrations. It enables a seamless exchange of business data with partner networks using standard formats like X12, EDIFACT, or even custom EDI formats.
                        </p>

                        <p className={styles.introText3}>Ballerina&apos;s powerful EDI data mapping and processing capabilities facilitate interoperability among data formats and simplify the use of EDI data within business apps.
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
                    <img src={`${prefix}/images/edi-intro.png`} alt="Position Ballerina" />
                </Col>
            </Row>
            </Container>
            </Col>
        </>
    );
}
