import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './Intro.module.css';
import { prefix } from '../../../utils/prefix';

export default function Intro() {

    return (
        <>
            <Row className="pageContentRow justify-content-md-center">
                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/install-ballerina/set-up-ballerina`} className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.primary}`}>
                            <p className={styles.title}>Install Ballerina</p>
                            <p className={styles.description}>Set up the Ballerina development environment</p>
                        </div>
                    </a>
                </Col>

                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/get-started-with-ballerina`}className={`${styles.cardLink} ${styles.primary}`}>
                        <div className={`${styles.cardContent} ${styles.primary}`}>
                            <p className={styles.title}>Get started with Ballerina</p>
                            <p className={styles.description}>Write your first Ballerina program and create your first Ballerina package</p>
                        </div>
                    </a>
                </Col>
            </Row>

            <Row className="pageContentRow justify-content-md-center">
                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/by-example/`} className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.secondary}`}>
                            <p className={styles.title}>Ballerina by Example</p>
                            <p className={styles.description}>A series of guided examples to learn the language</p>
                        </div>
                    </a>
                </Col>

                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href="https://lib.ballerina.io/" className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.secondary}`}>
                            <p className={styles.title}>Ballerina API Docs</p>
                            <p className={styles.description}>Library API documentation</p>
                        </div>
                    </a>
                </Col>

                <Col xs={12} lg={4} className={styles.introCard}>
                    <a href={`${prefix}/learn/platform-specifications`} className={styles.cardLink}>
                        <div className={`${styles.cardContent} ${styles.secondary}`}>
                            <p className={styles.title}>Ballerina Specifications</p>
                            <p className={styles.description}>Language, library &amp; platform specs</p>
                        </div>
                    </a>
                </Col>
            </Row>
        </>
    );
}
