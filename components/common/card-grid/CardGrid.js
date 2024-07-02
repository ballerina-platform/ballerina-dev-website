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
import { Row, Col, Container, Card, Image, Badge } from 'react-bootstrap';
import Link from 'next/link';

import styles from './CardGrid.module.css';

export default function CardGrid(props) {

    const propsData = props.propsData;

    const getTechnologies = (technologies) => {
        const technologiesArray = technologies.split(', ');
        return (
            <p className={styles.technologies}>
                {
                    technologiesArray.map((technology, index) => (
                        <Badge as={"a"} className={styles.tag} key={technology} onClick={()=>props.handleSelectedTag(technology)}>{technology}</Badge>
                    ))
                }
            </p>
        )
    }

    return (
        <>
            <Col xs={12}>
                <Container>

                    {
                        (props.launcher == "project-mentorship") &&
                        <Row>
                            <Col xs={12}>
                                <h2 id={props.section.toLowerCase()} className='section'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="30"
                                        height="30"
                                        fill="currentColor"
                                        className="bi bi-link-45deg mdButton pe-2"
                                        viewBox="0 0 16 16"
                                        onClick={(e) => props.getLink(e.target, props.section.toLowerCase())}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {props.section}
                                </h2>
                            </Col>
                        </Row>
                    }

                    <Row xs={1} md={2} lg={props.launcher == "project-mentorship"? 4 : 3} className='g-4'>
                        {
                            (props.launcher == "usecases") &&
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
                        }

                        {
                            (props.launcher == "case-studies") &&
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

                        {
                            (props.launcher == "project-mentorship") &&
                            <>
                                {

                                    propsData.map((_, idx) => (
                                        <Link key={idx} href={`/case-studies/${_.slug}`} className={styles.wrapperLink}>
                                            <Col className={`${styles.useCaseCard} mt-4`}>

                                                <div className={styles.cardWrapper}>
                                                    <div>
                                                        <div className={styles.imageWrapper}>
                                                            <img src={_.icon} className={_.slug != 'fat-tuesday' ? styles.vLogo : styles.centerLogo} alt='Automate anything' />
                                                        </div>
                                                        <h3>{_.title}</h3>
                                                        <div className={styles.cardDescription}>
                                                            <p>{_.description}</p>

                                                        </div>
                                                    </div>

                                                    {/* <>
                                                        {
                                                            getTechnologies(_.technologies)
                                                        }
                                                    </> */}

                                                    <div className={styles.cardLinks}>
                                                        {
                                                            getTechnologies(_.technologies)
                                                        }
                                                        <p>Advisor: <a href={_.advisor.x} className={styles.cDownload}>
                                                            {_.advisor.name}
                                                        </a>
                                                        </p>

                                                        <p>Contributors:&nbsp;
                                                            {
                                                                _.contributors.map((contributor, index) => (
                                                                    <a href={contributor.html_url} className={styles.cDownload} style={{ marginRight: "5px" }}>
                                                                        <Image src={contributor.avatar_url} roundedCircle width={30} height={30} />
                                                                    </a>
                                                                ))
                                                            }
                                                        </p>

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