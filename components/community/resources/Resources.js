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
import Image from 'next-image-export-optimizer';
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
                            Resources
                        </h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12}>
                        <p>
                            We have curated a list of articles, blogs, and videos created by the members of the Ballerina community. These resources cover aspects of the Ballerina language, platform, tools, and use cases with implementation details.
                        </p>
                    </Col>

                    {/* <Col sm={12} md={6} lg={6}>
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
                    </Col> */}
                </Row>


                <Row className={styles.resourceRow}>
                    <Col sm={6} md={6} lg={3} className='gy-4'>
                        <a href='https://youtube.com/playlist?list=PL7JOecNWBb0JAdYWqeGmD35MjE0KTjHXU&si=zIc_Kha48qV4aEvM' 
                            className={styles.resourceCardLink}
                            title="Tech Talks">
                            {/* <Card className={styles.cardBox}>
                                <Card.Body className={styles.cardBody}>
                                    <div className={styles.cardImg}>
                                        <Image src={prefix + '/images/sm-icons/youtube-updated-white.svg'} alt="Tech Talks" width={90} height={90} />
                                    </div>
                                    <Card.Text className={styles.cardText}>
                                        <h5 className="card-text"> Tech talks </h5>
                                    </Card.Text>
                                    <img src="/images/ballerina-generic-social-media-image-2023.png" width="100%"/>
                                </Card.Body>
                            </Card> */}

                            <img src="/images/community/ballerina-community-tech-talks.png" width="100%" alt="Tech Talks"/>
                        </a>
                    </Col>

                    <Col sm={6} md={6} lg={3} className='gy-4'>
                        <a href='https://lms.wso2.com/collections/ballerina' 
                            className={styles.resourceCardLink}
                            title="Training">
                            {/* <Card className={styles.cardBox}>
                                <Card.Body className={styles.cardBody}>
                                    <div className={styles.cardImg}>
                                        <Image src={prefix + '/images/sm-icons/stackoverflow-white.svg'} alt="Articles on Stack overflow " width={90} height={90} />
                                    </div>
                                    <Card.Text className={styles.cardText}>
                                        <h5 className="card-text"> Trainings </h5>
                                    </Card.Text>
                                </Card.Body>
                            </Card> */}
                            <img src="/images/community/ballerina-community-training.png" width="100%" alt="Training"/>
                        </a>
                    </Col>

                    <Col sm={6} md={6} lg={3} className='gy-4'>
                        <a href='https://medium.com/ballerina-techblog' className={styles.resourceCardLink} title="Medium Tech Blog">
                            {/* <Card className={styles.cardBox}>
                                <Card.Body className={styles.cardBody}>
                                    <div className={styles.cardImg}>
                                        <Image src={prefix + '/images/sm-icons/medium-white.png'} alt="Blogs on Medium" width={90} height={90} />
                                    </div>
                                    <Card.Text className={styles.cardText}>
                                        <h5 className="card-text"> Articles on Medium </h5>
                                    </Card.Text>
                                </Card.Body>
                            </Card> */}
                            <img src="/images/community/ballerina-community-medium.png" width="100%" alt="Medium Tech Blog"/>
                        </a>
                    </Col>

                    <Col sm={6} md={6} lg={3} className='gy-4'>
                        <a href='https://blog.ballerina.io/' className={styles.resourceCardLink} title="Ballerina Blog">
                            {/* <Card className={styles.cardBox}>
                                <Card.Body className={styles.cardBody}>
                                    <div className={styles.cardImg}>
                                        <Image src={prefix + '/images/sm-icons/stackoverflow-white.svg'} alt="Articles on Stack overflow " width={90} height={90} />
                                    </div>
                                    <Card.Text className={styles.cardText}>
                                        <h5 className="card-text"> Blog </h5>
                                    </Card.Text>
                                </Card.Body>
                            </Card> */}
                            <img src="/images/community/ballerina-community-blog.png" width="100%" alt="Ballerina Blog"/>
                        </a>
                    </Col>
                </Row>

            </Container>
        </Col>
    );
}
