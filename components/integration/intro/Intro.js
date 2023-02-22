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

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';

export default function Intro() {

    return (
        <>
            <Row className='pageContentRow integration'>
                <Col xs={12} lg={6} className={styles.introText}>
                    <div>
                        <p className={styles.introText1}>Probably the best language in the world
                            for writing all your integrations.
                        </p>

                        <p className={styles.introText2}>Integration is development. Why make life harder for developers to write integrations
                            by giving them simple <br />drag-n-drop tools or limited DSLs?
                        </p>
                    </div>
                </Col>
                <Col xs={12} lg={6} className={styles.introImg}>
                    <img src='/images/maxresdefault.jpg' alt='Integration' width="100%" />
                </Col>
            </Row>

            <Row className='pageContentRow integration'>
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
            </Row>
        </>
    );
}
