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
import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import { prefix } from '../../../utils/prefix';
import styles from './BalAction.module.css';

export default function BalAction(props) {
  const [key, setKey] = React.useState('consuming-services');
  const samples = props.samples;

  React.useEffect(() => {
    let hash = global.location.hash;
    if (hash !== '') {
      hash = hash.replace('#', '');
      if (hash === "consuming-services" || hash === "working-with-data"
        || hash === "restful-api" || hash === "grpc-api" || hash === "graphql-api"
        || hash === "kafka-consumer-producer" || hash === "working-with-databases") {
        setKey(hash);
        const element = document.getElementById("ballerina-in-action");
        element.scrollIntoView();
      }
    }
  }, []);

  const consumingServices = samples['consuming-services'];
  const workingWithData = samples['working-with-data'];
  const restfulApi = samples['restful-api'];
  const grpcCode1 = samples['grpc-api'];
  const grpcCode2 = samples['grpc-api-proto'];
  const graphqlApi = samples['graphql-api'];
  const kafkaConsumer = samples['kafka-consumer-producer'];
  const workingWithDataBases = samples['working-with-databases'];

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="ballerina-in-action" className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'ballerina-in-action')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Ballerina in action
            </h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className={styles.balActionTabs}
            >

              <Tab eventKey="consuming-services" title="Consuming services">
                <Row>
                  <Col lg={7} md={12} sm={12} className={styles.col1} id="column1" >
                    <div className={styles.focusPane}>
                      <div className={styles.codeActionIcons}>
                        <a href="https://github.com/ballerina-guides/ballerina-in-action-samples/tree/main/consuming_services" target="_blank" rel="noreferrer" passHref title="Open on GitHub">
                          <Image src={`${prefix}/images/github-grey.svg`} width={18} height={18} alt="GitHub" />
                        </a>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: consumingServices }} />
                    </div>
                  </Col>
                  <Col lg={5} md={12} sm={12} className={styles.col2} id="column2" >
                    <div className={styles.focusPane}>
                      <Image src={`${prefix}/images/consuming-services-diagram.svg`} width={433} height={655} alt="consuming-services-diagram" />
                    </div>
                  </Col>
                </Row>
              </Tab>


              <Tab eventKey="working-with-data" title="Working with data">
                <Row>
                  <Col lg={7} md={12} sm={12} className={styles.col1}>
                    <div className={styles.focusPane}>
                      <div className={styles.codeActionIcons}>
                        <a href="https://github.com/ballerina-guides/ballerina-in-action-samples/tree/main/working_with_data" target="_blank" rel="noreferrer" passHref title="Open on GitHub">
                          <Image src={`${prefix}/images/github-grey.svg`} width={18} height={18} alt="GitHub" />
                        </a>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: workingWithData }} />
                    </div>
                  </Col>
                  <Col lg={5} md={12} sm={12} className={styles.col2}>
                    <div className={styles.focusPane}>
                      <Image src={`${prefix}/images/working-with-data-diagram.svg`} width={433} height={456} alt="working-with-data-diagram" />
                      <a target="_blank" href="https://play.ballerina.io/?gist=30a51792b6b4d46c2cbdfdd424fb3b45&file=play.bal" rel="noreferrer">
                        <button className={styles.playgroundButton} id="simple11" > Try in Playground</button>
                      </a>
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="restful-api" title="RESTful API">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className={styles.codeActionIcons}>
                        <a href="https://github.com/ballerina-guides/ballerina-in-action-samples/tree/main/restful_api" target="_blank" rel="noreferrer" passHref title="Open on GitHub">
                          <Image src={`${prefix}/images/github-grey.svg`} width={18} height={18} alt="GitHub" />
                        </a>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: restfulApi }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="grpc-api" title="gRPC API">
                <Row>
                  <Col lg={7} md={12} sm={7} className={styles.col1}>
                    <div className={styles.focusPane}>
                      <div className={styles.codeActionIcons}>
                        <a href="https://github.com/ballerina-guides/ballerina-in-action-samples/tree/main/grpc_api" target="_blank" rel="noreferrer" passHref title="Open on GitHub">
                          <Image src={`${prefix}/images/github-grey.svg`} width={18} height={18} alt="GitHub" />
                        </a>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: grpcCode1 }} />
                    </div>
                  </Col>
                  <Col lg={5} md={12} sm={12} id="grpc-api-proto" className={styles.col2}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: grpcCode2 }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="graphql-api" title="GraphQL API">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className={styles.codeActionIcons}>
                        <a href="https://github.com/ballerina-guides/ballerina-in-action-samples/tree/main/graphql_api" target="_blank" rel="noreferrer" passHref title="Open on GitHub">
                          <Image src={`${prefix}/images/github-grey.svg`} width={18} height={18} alt="GitHub" />
                        </a>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: graphqlApi }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="kafka-consumer-producer" title="Kafka consumer/producer">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className={styles.codeActionIcons}>
                        <a href="https://github.com/ballerina-guides/ballerina-in-action-samples/tree/main/kafka_consumer_producer" target="_blank" rel="noreferrer" passHref title="Open on GitHub">
                          <Image src={`${prefix}/images/github-grey.svg`} width={18} height={18} alt="GitHub" />
                        </a>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: kafkaConsumer }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="working-with-databases" title="Working with databases">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className={styles.codeActionIcons}>
                        <a href="https://github.com/ballerina-guides/ballerina-in-action-samples/tree/main/working_with_databases" target="_blank" rel="noreferrer" passHref title="Open on GitHub">
                          <Image src={`${prefix}/images/github-grey.svg`} width={18} height={18} alt="GitHub" />
                        </a>
                      </div>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: workingWithDataBases }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

            </Tabs>

          </Col>
        </Row>
      </Container>
    </Col>
  );
}
