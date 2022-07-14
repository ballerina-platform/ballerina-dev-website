import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './New.module.css';
import { prefix } from '../../../utils/prefix';

export default function New() {

  return (
    <>

        <Row className="pageContentRow learnRow">
          <Col xs={12} md={12}>
            <h2>What&apos;s new</h2> 
          </Col>
        </Row>

        <Row className="pageContentRow">
          <Col xs={12} md={12}>
            <p className={styles.title}><a href="#" className={styles.linkText}>Ballerina Proposals</a></p>
            <p className={styles.description}>Read and contribute to open proposals</p>
          </Col>
        </Row>
    </>
  );
}
