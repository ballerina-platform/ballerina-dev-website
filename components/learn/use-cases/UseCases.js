/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import { Row, Col, Container } from 'react-bootstrap';

import styles from './UseCases.module.css';
import { prefix } from '../../../utils/prefix';

export default function UseCases(props) {

  return (
    <>
      <div className={styles.cLightGrayBlade}>
        <Container>
          <Row className="pageContentRow learnRowUsecase llanding">
            <Col xs={12} md={12}>
              <h2 id="featured-use-cases" className='section'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-link-45deg mdButton pe-2"
                  viewBox="0 0 16 16"
                  onClick={(e) => props.getLink(e.target, 'featured-use-cases')}
                >
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                </svg>
                Featured scenarios
              </h2>
            </Col>
          </Row>

          <Row className="llanding ">
            <Col xs={12} lg={4}>
              <a href={`${prefix}/learn/write-a-restful-api-with-ballerina/`} className={styles.cardLink}>
                <div className={styles.pGroup}>
                  <Row>
                    <Col xs={12} lg={8}>
                      <p className={styles.title}>Write a RESTful API with Ballerina</p>
                      <p className={styles.description}>Use Ballerina constructs to create RESTful APIs.</p>

                    </Col>
                    <Col xs={12} lg={4}>
                      <img src={`${prefix}/images/rest.svg`} alt="Position Ballerina" />
                    </Col>

                  </Row>

                </div>
              </a>
              <a href={`${prefix}/learn/write-a-grpc-service-with-ballerina/`} className={styles.cardLink}>
                <div className={styles.pGroup}>
                  <Row>
                    <Col xs={12} lg={8}>
                      <p className={styles.title}>Write a gRPC service with Ballerina</p>
                      <p className={styles.description}>Write and invoke a simple Ballerina gRPC service.</p>

                    </Col>
                    <Col xs={12} lg={4}>
                      <img src={`${prefix}/images/grpc.svg`} alt="Position Ballerina" />
                    </Col>

                  </Row>

                </div>
              </a>

              <a href={`${prefix}/learn/manage-data-persistence-with-bal-persist/`} className={styles.cardLink}>
                <div className={styles.pGroup}>
                  <Row>
                    <Col xs={12} lg={8}>
                      <p className={styles.title}>Manage data persistence with bal persist</p>
                      <p className={styles.description}>Use <code>bal persist</code> to simplify data persistence management.</p>
                    </Col>
                    <Col xs={12} lg={4}>
                      <img src={`${prefix}/images/data-persistent-icon.svg`} alt="Position Ballerina" />
                    </Col>

                  </Row>

                </div>
              </a>
            </Col>

            <Col xs={12} lg={4}>
              <a href={`${prefix}/learn/write-a-graphql-api-with-ballerina/`} className={styles.cardLink}>
                <div className={styles.pGroup}>
                  <Row>
                    <Col xs={12} lg={9}>
                      <p className={styles.title}>Write a GraphQL API with Ballerina</p>
                      <p className={styles.description}>Write and invoke a simple Ballerina GraphQL service.</p>

                    </Col>
                    <Col xs={12} lg={3}>
                      <img src={`${prefix}/images/GraphQL.svg`} className={styles.image1} alt="Position Ballerina" />
                    </Col>

                  </Row>

                </div>
              </a>
              <a href={`${prefix}/learn/work-with-data-using-queries-in-ballerina/`} className={styles.cardLink}>
                <div className={styles.pGroup}>
                  <Row>
                    <Col xs={12} lg={9}>
                      <p className={styles.title}>Work with data using queries in Ballerina</p>
                      <p className={styles.description}>Use query expressions to work with data.</p>

                    </Col>
                    <Col xs={12} lg={3}>
                      <img src={`${prefix}/images/quaries.svg`} className={styles.image1} alt="Position Ballerina" />
                    </Col>

                  </Row>

                </div>
              </a>
            </Col>

            <Col xs={12} lg={4}>
              <a href={`${prefix}/learn/build-a-data-service-in-ballerina/`} className={styles.cardLink}>
                <div className={styles.pGroup}>
                  <Row>
                    <Col xs={12} lg={8}>
                      <p className={styles.title}>Build a data service in Ballerina</p>
                      <p className={styles.description}>Use Ballerina constructs to work with data services.</p>

                    </Col>
                    <Col xs={12} lg={4}>
                      <img src={`${prefix}/images/data.svg`} className={styles.image2} alt="Position Ballerina" />
                    </Col>

                  </Row>

                </div>
              </a>
              <a href={`${prefix}/learn/deploy-ballerina-on-kubernetes/`} className={styles.cardLink}>
                <div className={styles.pGroup}>

                  <Row>
                    <Col xs={12} lg={8}>
                      <p className={styles.title}>Deploy Ballerina on Kubernetes</p>
                      <p className={styles.description}>Write, build, and deploy a Ballerina service on Kubernetes.</p>

                    </Col>
                    <Col xs={12} lg={4}>
                      <img src={`${prefix}/images/kubernates.svg`} className={styles.image2} alt="Position Ballerina" />
                    </Col>

                  </Row>

                </div>
              </a>
            </Col>

            {/* <p>See more for standard library and other <a href={`${prefix}/learn/language-basics/`} className={styles.title}>use cases</a></p>
        </Col> */}
          </Row>

          {/* <Row className="pageContentRow llanding">
        <Col xs={12}>
        <p>See more standard library and other <a href={`${prefix}/learn/use-cases/`} className={styles.title}>use cases</a></p>
        </Col>
      </Row> */}
        </Container>
      </div>

    </>
  );
}
