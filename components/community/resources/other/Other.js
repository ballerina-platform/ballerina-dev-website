import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './Other.module.css';

export default function Other() {

    return (
        <>
            <Row>
                <Col sm={12} md={12} lg={12} className={styles.other}>
                    <h2 className="removeTopMargin">Other resources</h2>

                    <div className={styles.otherInfo}>
                        <a target="_blank" rel="noreferrer" href="https://ballerina.io/learn/references/language-introduction/Ballerina%20_Swan_Lake_Presentation_Deck_V2.0.pdf">
                            <h4>Language introduction slides </h4>
                        </a>
                        <p>A high-level overview of the Ballerina language</p>
                    </div>

                    <div className={`${styles.otherInfo} ${styles.last}`}>
                        <a target="_blank" rel="noreferrer" href="https://ballerina.io/community/slides/ballerina-type-system.pdf">
                            <h4>Ballerina type system slides</h4>
                        </a>
                        <p>An introduction to the type system of the Ballerina language</p>
                        <p> 1 June 2021</p>
                    </div>

                </Col>
            </Row>
        </>

    );
}
