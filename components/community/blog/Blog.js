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

import styles from './Blog.module.css';
import { prefix } from '../../../utils/prefix';

export default function Blog(props) {

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
                        <h2 id='resources' className='section'>
                        <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'resources')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            Blog
                            </h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12} md={6} lg={6}>
                        <p>
                            Checkout the Ballerina official blog.
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
                            <a href={`https://blog.ballerina.io/`} rel="noreferrer" target="_blank" className={styles.viewAll}>View all blogs </a>
                        </p>
                    </Col>
                </Row>



                <Row className={styles.resourceRow}>
                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                {/* <Card.Title className={styles.cardTitle}>Articles</Card.Title> */}
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://blog.ballerina.io/posts/2023-07-14-announcing-ballerina-2201.7.0-swan-lake-update-7">
                                        <h4 className="card-title" >Announcing Ballerina 2201.7.0 (Swan Lake Update 7)</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By Ballerina team </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                {/* <Card.Title className={styles.cardTitle}>Blog posts</Card.Title> */}
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://blog.ballerina.io/posts/2023-06-06-announcing-ballerina-2201.6.0-swan-lake-update-6">
                                        <h4 className="card-title" >Announcing Ballerina 2201.6.0 (Swan Lake Update 6)</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By Ballerina team </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                {/* <Card.Title className={styles.cardTitle}>Videos & podcasts</Card.Title> */}
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://blog.ballerina.io/posts/2023-04-15-announcing-ballerina-2201.5.0-swan-lake-update-5">
                                        <h4>Announcing Ballerina 2201.5.0 (Swan Lake Update 5)</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By Ballerina team </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}
