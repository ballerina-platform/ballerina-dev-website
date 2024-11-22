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
import { Row, Col, Container, Table, Card } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import { FaCode } from "react-icons/fa6";
import { MdOutlineArticle } from "react-icons/md";
import { FaConnectdevelop } from "react-icons/fa";

import styles from './Contribute.module.css';
import { prefix } from '../../../utils/prefix';


export default function Contribute(props) {

    const swags = ["Bag", "Bottles", "Earbuds", "Hat", "Hoodie", "Long-M", "Shirt", "Tote", "Tumbler"];

    return (
        <Col xs={12}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 id='contribute-and-get-rewarded' className='section'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'contribute-and-get-rewarded')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            Contribute and get rewarded
                        </h2>
                    </Col>
                </Row>





                <Row className={`${styles.category} ${styles.mbBorder}`}>
                    <div className={`${styles.customSeparator} ${styles.customPadding}`}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={4} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.title}`} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <FaCode style={{ fontSize: "44px", marginRight: "20px" }} />
                                    <p style={{ marginBottom: 0 }}>Code contributions</p>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Easy
                                    </div>
                                    <div className={styles.points}>
                                        +20 points
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Medium
                                    </div>
                                    <div className={styles.points}>
                                        +30 points
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Hard
                                    </div>
                                    <div className={styles.points}>
                                        +45 points
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <a className={styles.issues} href="https://github.com/orgs/ballerina-platform/projects/376/views/1" target="_blank" rel="noreferrer" title='View issues'>View issues</a>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Row>



                <Row className={`${styles.category} ${styles.mbBorder}`}>
                    <div className={`${styles.customSeparator} ${styles.customPadding}`}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={4} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.title}`} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <MdOutlineArticle style={{ fontSize: "44px", marginRight: "20px" }} />
                                    <p style={{ marginBottom: 0 }}>No/Low Code contributions</p>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={4} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Blog/article
                                    </div>
                                    <div className={styles.points}>
                                        +20 points
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={4} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Video tutorial
                                    </div>
                                    <div className={styles.points}>
                                        +40 points
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Row>


                <Row className={styles.category}>
                    <div className={`${styles.customPadding}`}>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={4} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.title}`} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <FaConnectdevelop style={{ fontSize: "44px", marginRight: "20px" }} />
                                    <p style={{ marginBottom: 0 }}>Connector projects</p>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Easy
                                    </div>
                                    <div className={styles.points}>
                                        +60 points
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Medium
                                    </div>
                                    <div className={styles.points}>
                                        +80 points
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <div>
                                        Hard
                                    </div>
                                    <div className={styles.points}>
                                        +100 points
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={12} md={12} lg={2} className={styles.boxCol}>
                                <div className={`${styles.detailBlocks} ${styles.subCat}`}>
                                    <a className={styles.issues} href="/hacktoberfest/connector-contributor-guide" target="_blank" rel="noreferrer" title='Read the guide' style={{ marginBottom: "10px" }}>Read the guide</a>
                                    <a className={styles.issues} href="https://github.com/orgs/ballerina-platform/projects/376/views/5" target="_blank" rel="noreferrer" title='View projects'>View projects</a>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Row>






                <Row style={{ marginTop: "60px", background: "#20b6b0", padding: "30px 20px" }}>

                    <Col xs={12} md={6} lg={4} className={styles.boxCol} style={{ border: "none" }}>
                        <div className={styles.cardWrapper}>
                            <div>
                                <div className={styles.cardDescription}>
                                    <div className={styles.content}>
                                        <p className={styles.msgCredits}>Redeem points to purchase exclusive Ballerina-branded items from the swag store</p>
                                    <a href="#">Claim your swag credits</a>
                                    <p>*<a href="#">Terms and conditions</a> apply</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} md={6} lg={8} style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>

                        <Row xs={1} sm={2} md={2} lg={5} className="g-4 align-items-stretch">
                            {swags.map((_, idx) => (
                                <Col key={idx} style={{ height: "fit-content", display: "flex" }}>
                                    <Card className={`${styles.cutomCard} flex-grow-1`}>
                                        <Card.Img variant="top" src={`/images/hacktoberfest/swags-2024/${_}.jpeg`} />
                                    </Card>
                                </Col>
                            ))}

                            <Col style={{ display: "flex" }}>
                                <a href="https://store.covver.io/wso2/collections/ballerina-swag-store" target="_blank" rel="noreferrer" className={styles.storeLink}>
                                    <Card className={`${styles.cutomCard} flex-grow-1`}>
                                        <Card.Body className={`${styles.store} d-flex flex-column`}>
                                            <p className={styles.msg}>Visit store</p>
                                            <img
                                                src="/images/arrow-right-white.svg"
                                                alt="swags"
                                                className={`${styles.swag} flex-grow-1`}
                                            />
                                        </Card.Body>
                                    </Card>
                                </a>
                            </Col>

                        </Row>

                    </Col>
                </Row>







            </Container>
        </Col>
    );
}
