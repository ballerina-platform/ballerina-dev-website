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

import styles from './Other.module.css';

export default function Other() {

    return (
        <>
            <Row>
                <Col sm={12} md={12} lg={12} className={styles.other}>
                    <h2 className="removeTopMargin">Other resources</h2>

                    <div className={styles.otherInfo}>
                        <a target="_blank" rel="noreferrer" href="/community/slides/Ballerina_Language_Presentation-2021-03-08.pdf">
                            <h4>Language introduction slides </h4>
                        </a>
                        <p>A high-level overview of the Ballerina language</p>
                    </div>

                    <div className={`${styles.otherInfo} ${styles.last}`}>
                        <a target="_blank" rel="noreferrer" href="/community/slides/ballerina-type-system.pdf">
                            <h4>Ballerina type system slides</h4>
                        </a>
                        <p>An introduction to the type system of the Ballerina language</p>
                        <p> 1 June 2021</p>
                    </div>

                </Col>
            </Row>
        </>

    );
}
