/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Row, Col } from 'react-bootstrap';

import styles from './UseCases.module.css';
import { prefix } from '../../../utils/prefix';

export default function UseCases() {

  return (
    <>

      <Row className="pageContentRow learnRow llanding">
        <Col xs={12} md={12}>
          <h2>Featured use cases</h2>
        </Col>
      </Row>

      <Row className="pageContentRow llanding">
        <Col xs={12} lg={4}>
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/write-a-restful-api-with-ballerina/`} className={styles.linkText}>Write a RESTful API with Ballerina</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(HTTP API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/write-a-grpc-service-with-ballerina/`} className={styles.linkText}>Write a gRPC service with Ballerina</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(gRPC API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
        </Col>

        <Col xs={12} lg={4}>
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/write-a-graphql-api-with-ballerina/`} className={styles.linkText}>Write a GraphQL API with Ballerina</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(GraphQL API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>

          <div className={styles.langRow}>
            <a href={`${prefix}/learn/work-with-data-using-queries-in-ballerina/`} className={styles.linkText}>Work with data using queries in Ballerina</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
        </Col>

        <Col xs={12} lg={4}>
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/build-a-data-service-in-ballerina/`} className={styles.linkText}>Build a data service in Ballerina</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(SQL API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
        
          <div className={styles.langRow}>
            <a href={`${prefix}/learn/deploy-ballerina-on-kubernetes/`} className={styles.linkText}>Deploy Ballerina on Kubernetes</a>
            {/* <div className={styles.linkRow}>
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Cloud API Docs)</a>&nbsp;&nbsp;
              <a href={`${prefix}/learn/language-basics/`} className={styles.linkSubText}>(Spec)</a>
            </div> */}
          </div>
          </Col>

          {/* <p>See more for standard library and other <a href={`${prefix}/learn/language-basics/`} className={styles.linkText}>use cases</a></p>
        </Col> */}
      </Row>

      {/* <Row className="pageContentRow llanding">
        <Col xs={12}>
        <p>See more standard library and other <a href={`${prefix}/learn/use-cases/`} className={styles.linkText}>use cases</a></p>
        </Col>
      </Row> */}
    </>
  );
}
