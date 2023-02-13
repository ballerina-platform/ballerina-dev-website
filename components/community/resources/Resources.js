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
import { Row, Col, Card, Container } from 'react-bootstrap';

import styles from './Resources.module.css';
import { prefix } from '../../../utils/prefix';

export default function Resources() {

    const [hoverBtn, setHoverBtn] = React.useState(false);

    let linkArrowPath = prefix + '/images/toc-bg.svg';
    let linkArrowHoverPath = prefix + '/images/toc-bg-hover.svg';

    const linkArrow = {
        background: 'url(' + linkArrowPath + ') no-repeat scroll right center',
        paddingRight: '25px'
    }

    const linkArrowHover = {
        background: 'url(' + linkArrowHoverPath + ') no-repeat scroll right center',
        paddingRight: '25px'
    }

    return (
        <Col xs={12}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 id='resources'>Resources</h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12} md={6} lg={6}>
                        <p>
                            We have curated a list of articles, blogs, and videos that were created by the members of the Ballerina community. These resources cover aspects of the Ballerina language, platform, tools, and use cases with implementation details.
                        </p>
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                        <p className={styles.linkWrap}
                            onMouseEnter={() => {
                                setHoverBtn(true);
                            }}
                            onMouseLeave={() => {
                                setHoverBtn(false);
                            }}
                            style={
                                (hoverBtn ? linkArrowHover : linkArrow)
                            }>
                            <a href={`${prefix}/community/resources`} rel="noreferrer" target="_blank" className={styles.viewAll}>View all resources </a>
                        </p>
                    </Col>
                </Row>



                <Row className={styles.resourceRow}>
                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                <Card.Title className={styles.cardTitle}>Articles</Card.Title>
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://thenewstack.io/how-mosip-uses-ballerina-websubhub-for-event-driven-integration/">
                                        <h4 className="card-title" >How MOSIP Uses Ballerina WebSubHub for Event-Driven Integration</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By Dakshitha Ratnayake </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                <Card.Title className={styles.cardTitle}>Blog posts</Card.Title>
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://blog.jclark.com/2022/05/why-ballerina-is-language.html">
                                        <h4 className="card-title" >Why Ballerina is a language</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By James Clark </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                <Card.Title className={styles.cardTitle}>Videos & podcasts</Card.Title>
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://youtu.be/Pal5QZJyloY">
                                        <h4>Simplifying Cloud Native Application Development with Ballerina</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By Eric Newcomer and Darryl Taft </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}
