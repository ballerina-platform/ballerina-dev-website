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
import { Row, Col, Container, Card } from 'react-bootstrap';
import Link from 'next/link';

import styles from './UseCases.module.css';

export default function UseCases(props) {

    const propsData = props.propsData;

    return (
        <>
            <Col xs={12}>
                <Container>

                    <Row xs={1} md={2} lg={3} className='g-4'>
                        {
                            props.launcher == "usecases" ?
                                <>
                                    {propsData.map((_, idx) => (
                                        <Col key={idx} style={{ display: "flex", flexFlow: "row wrap" }} >
                                            <Link href={`/use-cases/${_.slug}`} className={styles.wrapperLink}>
                                                <Card className={`${styles.useCaseCard} mt-4`}>
                                                    <div className={styles.cardImgWrapper}>
                                                        <Card.Img variant="top" src={_.frontmatter.logo} />
                                                    </div>
                                                    <Card.Body>
                                                        <Card.Title>{_.frontmatter.title}</Card.Title>
                                                        <Card.Text className={styles.cardDescription}>
                                                            {_.frontmatter.description}
                                                        </Card.Text>
                                                    </Card.Body>
                                                    <Card.Footer className={styles.footer}>
                                                        <div className={styles.cardLinks}>
                                                            <a href={`/use-cases/${_.slug}`} className={styles.cDownload}>
                                                                Learn more
                                                            </a>
                                                        </div>
                                                    </Card.Footer>
                                                </Card>
                                            </Link>
                                        </Col>
                                    ))}
                                </>
                                :
                                <>
                                    {
                                        propsData.map((_, idx) => (
                                            <Link key={idx} href={`/case-studies/${_.slug}`} className={styles.wrapperLink}>
                                                <Col className={`${styles.useCaseCard} mt-4`}>

                                                    <div className={styles.cardWrapper}>
                                                        <div>
                                                            <div className={styles.imageWrapper}>
                                                                <img src={_.frontmatter.logo} className={_.slug == 'fat-tuesday' ? styles.vLogo : styles.centerLogo} alt='Automate anything' />
                                                            </div>
                                                            <h3>{_.frontmatter.title}</h3>
                                                            <div className={styles.cardDescription}>
                                                                <p>{_.frontmatter.description}</p>

                                                            </div>
                                                        </div>

                                                        <div className={styles.cardLinks}>
                                                            <a href={`/case-studies/${_.slug}`} className={styles.cDownload}>
                                                                View case study
                                                            </a>
                                                        </div>
                                                    </div>

                                                </Col>
                                            </Link>
                                        ))}
                                </>
                        }

                    </Row>

                </Container>
            </Col>
        </>
    );
}