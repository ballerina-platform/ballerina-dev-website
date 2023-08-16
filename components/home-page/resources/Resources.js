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

export default function Resources(props) {

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
            <Col sm={12} className='sectionTitle'>
              <h2 id="ballerina-mentions" className='section'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-link-45deg mdButton pe-2"
                  viewBox="0 0 16 16"
                  onClick={(e) => props.getLink(e.target, 'ballerina-mentions')}
                >
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                </svg>
                Ballerina mentions
              </h2>
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
