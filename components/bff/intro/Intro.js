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

                        <p className={styles.introText2}>Web apps and mobile apps are the face of digital organizations. Therefore, back-ends powering these apps need to be highly secure, scalable, and responsive. In addition, such back-ends need to aggregate data from multiple services, transform data as necessary, and transmit those to front-ends over required protocols.
                        </p>

                        <p className={styles.introText3}>Ballerina&apos;s support for various protocols, availability of connectors, built-in security features, and advanced data transformation capabilities make it the ideal choice for developing back-ends for modern front-ends. 
                        </p>

                        <p className={styles.dVersion}>
                        <a href={`${prefix}/downloads/`}
                            className={styles.cDownload}>
                            Download Ballerina
                        </a>
                    </p>
                    </div>
                </Col>
                <Col xs={12} lg={7} className={`${styles.introImg} ${styles.ipaas}`}>
                    <img src={`${prefix}/images/bff-intro.png`} alt="BFF" className={styles.doNotFill} width='90%' />
                </Col>
            </Row>
            </Container>
            </Col>
        </>
    );
}
