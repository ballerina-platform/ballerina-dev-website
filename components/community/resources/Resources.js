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
                                    <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/how-to-use-ballerina-local-repository">
                                        <h4 className="card-title" >How to use Ballerina Local Repository</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By Pramodya Mendis </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                <Card.Title className={styles.cardTitle}>Blog posts</Card.Title>
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://medium.com/ballerina-techblog/practical-guide-for-the-language-server-protocol-3091a122b750">
                                        <h4 className="card-title" >A Practical Guide for Language Server Protocol</h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By Malintha Ranasinghe </p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col sm={12} md={12} lg={4}>
                        <Card className={styles.cardBox}>
                            <Card.Body className={styles.cardBody}>
                                <Card.Title className={styles.cardTitle}>Videos & podcasts</Card.Title>
                                <Card.Text className={styles.cardText}>
                                    <a target="_blank" rel="noreferrer" href="https://www.infoq.com/podcasts/james-clark-ballerina-language-network-data-concurrency/?utm_source=twitter&utm_medium=link&utm_campaign=calendar">
                                        <h4>How Ballerina Handles Network Interaction, Data, and Concurrency </h4>
                                    </a>
                                </Card.Text>
                                <p className="card-text"> By James Clark and Charles Humble </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}
