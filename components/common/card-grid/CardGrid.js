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
import { Row, Col, Container, Card, Image, Badge } from 'react-bootstrap';
import Link from 'next/link';

import styles from './CardGrid.module.css';

const CardGrid = React.forwardRef((props, ref) => {
    const propsData = props.propsData;

    const getTechnologies = (tags) => {
        return (
            <p className={styles.technologies}>
                {tags.map((tag, index) => (
                    <Badge as="a" className={styles.tag} key={tag + index} onClick={() => props.handleSelectedTag(tag)}>{tag}</Badge>
                ))}
            </p>
        );
    };

    const getAdvisors = (advisors) => {
        if (!Array.isArray(advisors)) {
            return null;
        }
        return (
            <>
                {advisors.map((advisor, index) => (
                    <React.Fragment key={advisor.name + index}>
                        <a href={advisor.x}>{advisor.name}</a>
                        {index < advisors.length - 1 && <span>,&nbsp;</span>}
                    </React.Fragment>
                ))}
            </>
        );
    };

    const [limit, setLimit] = React.useState(8);
    const [showSMBtn, setShowSMBtn] = React.useState(true);
    const [showHideBtn, setShowHideBtn] = React.useState(false);

    const length = propsData.length;

    const showMoreVersions = () => {
        setLimit(length);
        setShowSMBtn(false);
        setShowHideBtn(true);
    };

    const hideMoreVersions = () => {
        setLimit(8);
        setShowSMBtn(true);
        setShowHideBtn(false);
    };

    React.useImperativeHandle(ref, () => ({
        showMoreVersions,
    }));

    const handleEmailClick = (event, projectName, advisorEmail) => {
        event.preventDefault(); // Prevent the default action
        const decodedEmail = atob(advisorEmail); // Decode the email
        const subject = `Request to join ${projectName} project`;
        const mailtoLink = `mailto:${decodedEmail},contact@ballerina.io?subject=${encodeURIComponent(subject)}`;
        window.location.href = mailtoLink;
    };

    return (
        <>
            <Col xs={12}>
                <Container>
                    {props.launcher === "project-mentorship" && (
                        <Row>
                            <Col xs={12}>
                                <h2 id={props.section.replace(/ /g, '-').toLowerCase()} className='section' style={{ marginBottom: "20px !important" }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        style={{ paddingRight: "0 !important", marginLeft: "-24px" }}
                                        className="bi bi-link-45deg mdButton"
                                        viewBox="0 0 17 17"
                                        onClick={(e) => props.getLink(e.target, props.section.replace(/ /g, '-').toLowerCase())}
                                    >
                                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                    </svg>
                                    {props.section}
                                </h2>
                            </Col>
                        </Row>
                    )}

                    {
                        props.launcher !== "project-mentorship" ?

                            <Row xs={1} md={2} lg={props.launcher === "project-mentorship" ? 1 : 3} className='g-4 d-flex'>
                                {props.launcher === "usecases" && (
                                    <>
                                        {propsData.map((_, idx) => (
                                            <Col key={idx} style={{ display: "flex", flexFlow: "row wrap" }}>
                                                <Link href={`/use-cases/${_.slug}`} className={styles.wrapperLink} passHref>
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
                                )}

                                {props.launcher === "case-studies" && (
                                    <>
                                        {propsData.map((_, idx) => (
                                            <Link key={idx} href={_.isExternal ? `${_.slug}` : `/case-studies/${_.slug}`} className={styles.wrapperLink} passHref>
                                                <Col className={`${styles.useCaseCard} mt-4`}>
                                                    <div className={styles.cardWrapper}>
                                                        <div>
                                                            <div className={styles.imageWrapper}>
                                                                <img src={_.frontmatter.logo} className={_.slug === 'fat-tuesday' ? styles.vLogo : styles.centerLogo} alt='Automate anything' />
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
                                )}
                            </Row>
                            :
                            <Row>
                                {props.launcher === "project-mentorship" && (
                                    <>
                                        {propsData.slice(0, limit).map((_, idx) => {
                                            return (
                                                <React.Fragment key={idx}>


                                                    <Col xl={{ span: 12 }} style={{ display: "flex", flexWrap: "row wrap" }} key={idx}>

                                                        <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
                                                            <Row className="g-0 align-items-center">

                                                                <Col xs={12} md={2} className='text-center'>
                                                                    {
                                                                        _.repo ?
                                                                            <a href={`https://github.com/${_.repo.org}/${_.repo.name}`} className={styles.iconLink}>
                                                                                <Card.Img src={_.icon} className={`${styles.icon} ps-2 pe-2`} alt={`${props.name} icon`} />
                                                                            </a>
                                                                            :
                                                                            <Card.Img src={_.icon} className={`${styles.icon} ps-2 pe-2`} alt={`${props.name} icon`} />

                                                                    }

                                                                </Col>
                                                                <Col xs={12} md={10}>
                                                                    <Card.Body>

                                                                        <h3 id={_.title.replace(/ /g, '-').toLowerCase()} className='section' style={{ scrollMarginTop: "65px" }}>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="22"
                                                                                height="22"
                                                                                fill="currentColor"
                                                                                className="bi bi-link-45deg mdButton"
                                                                                style={{ paddingRight: "0", marginLeft: "-18px", marginRight: "-4px" }}
                                                                                viewBox="0 0 18 18"
                                                                                onClick={(e) => props.getLink(e.target, _.title.replace(/ /g, '-').toLowerCase())}
                                                                            >
                                                                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                                                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                                                            </svg>
                                                                            {_.title}
                                                                        </h3>

                                                                        <p>{_.description} {props.section !== "Available projects" && <>&nbsp;<a href={`https://github.com/${_.repo.org}/${_.repo.name}`} className={styles.repoLink}>Learn more</a></>}</p>


                                                                        <div className={styles.cardLinks}>
                                                                            {getTechnologies(_.tags)}
                                                                            <p>Mentor(s): {getAdvisors(_.advisors)}</p>
                                                                            {props.section === "Available projects" ? (
                                                                                <a className={styles.eventRegistration} data-email={encodedEmail} href="#" onClick={(e) => handleEmailClick(e, _.title, encodedEmail)}>
                                                                                    Join the project
                                                                                </a>
                                                                            ) : (
                                                                                <p>Contributors:&nbsp;
                                                                                    {_.contributors.map((contributor, index) => (
                                                                                        <a href={contributor.html_url} className={styles.cDownload} style={{ marginRight: "5px" }} key={index}>
                                                                                            <Image src={contributor.avatar_url} roundedCircle width={30} height={30} />
                                                                                        </a>
                                                                                    ))}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </Card.Body>
                                                                </Col>
                                                            </Row>
                                                        </Card>

                                                    </Col>
                                                </React.Fragment>
                                            );
                                        })}

                                    </>
                                )}

                            </Row>
                    }
                    {props.launcher === "project-mentorship" && (
                        <Row className={length > 8 ? 'mt-5' : ''} style={{ paddingBottom: "24px" }}>
                            <Col>
                                {showSMBtn && length > 8 && (
                                    <div onClick={showMoreVersions} className={styles.seeMore}>
                                        + Show more...
                                    </div>
                                )}
                                {showHideBtn && length > 8 && (
                                    <div onClick={hideMoreVersions} className={styles.seeMore}>
                                        - Hide
                                    </div>
                                )}
                            </Col>
                        </Row>
                    )}
                </Container>
            </Col>
        </>
    );
});

CardGrid.displayName = "CardGrid";

export default CardGrid;
