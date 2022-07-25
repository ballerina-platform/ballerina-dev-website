import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './Language.module.css';
import { prefix } from '../../../utils/prefix';

export default function Language() {

  return (
    <>
      <Row className="pageContentRow learnRow llanding">
        <Col xs={12} md={12}>
          <h2>Learn the language</h2>
        </Col>
      </Row>

      <Row className="pageContentRow llanding">
        <Col xs={12} lg={6}>
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/language-basics`} className={styles.linkText}>Language basics</a>
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/distinctive-language-features/network-interaction`} className={styles.linkText}>Network interaction</a>
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/distinctive-language-features/data`} className={styles.linkText}>Data</a>
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/distinctive-language-features/concurrency`} className={styles.linkText}>Concurrency</a>
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/distinctive-language-features/advanced-general-purpose-language-features`} className={styles.linkText}>Advanced general purpose language features</a>
          </div>


          {/* <div className={styles.langRow}>
          <a href={`${prefix}/learn/#`} className={styles.linkBtn}>Complete language guide slides</a>
          <a href="https://www.youtube.com/watch?list=PL7JOecNWBb0KX8RGAjF-oRknb_YIYN-dR&v=My_uqtHvXV8" className={styles.linkBtn}>Watch video</a>
          </div> */}
        </Col>

        <Col xs={12} lg={6} className={styles.btnCol}>
          <div className={styles.btnWrapper}>
          <a href={`${prefix}/learn/language-walkthrough`} className={styles.linkBtn}>Watch video</a>
          <a href={`${prefix}/learn/language-walkthrough`} className={styles.linkBtn}>Complete language guide slides</a>
          </div>
        </Col>
      </Row>
    </>
  );
}
