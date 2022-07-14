import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './UseCases.module.css';
import { prefix } from '../../../utils/prefix';

export default function UseCases() {

  return (
    <>

      <Row className="pageContentRow learnRow">
        <Col xs={12} md={12}>
          <h2>Featured use cases</h2>
        </Col>
      </Row>

      <Row className="pageContentRow">
        <Col xs={12} lg={4}>
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/write-a-restful-api-with-ballerina/`} className={styles.linkText}>Write RESTful API</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(HTTP API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/write-a-grpc-service-with-ballerina/`} className={styles.linkText}>Write gRPC service</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(gRPC API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
        </Col>

        <Col xs={12} lg={4}>
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/write-a-graphql-api-with-ballerina/`} className={styles.linkText}>Write GraphQL API</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(GraphQL API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/work-with-data-using-queries-in-ballerina/`} className={styles.linkText}>Working with data using queries</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
        </Col>

        <Col xs={12} lg={4}>
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/build-a-data-service-in-ballerina/`} className={styles.linkText}>Work with databases</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(SQL API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
        
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/deploy-ballerina-on-kubernetes/`} className={styles.linkText}>Deploy on Kubernetes</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Cloud API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
          </Col>

          {/* <p>See more for standard library and other <a href={`${prefix}/learn/language-basics/`} className={styles.linkText}>use cases</a></p>
        </Col> */}
      </Row>

      <Row className="pageContentRow">
        <Col xs={12}>
        <p>See more for standard library and other <a href={`${prefix}/learn/use-cases/`} className={styles.linkText}>use cases</a></p>
        </Col>
      </Row>
    </>
  );
}
