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
import styles from './Boxes.module.css';
import { prefix } from '../../../utils/prefix';
export default function Boxes(props) {
  return (
    <>
      {/* <Container> */}
      {/* <Row className="pageContentRow learnRow llanding">
        <Col xs={12} md={12}>
          <h2 id="learn-the-platform" className='section'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-link-45deg mdButton pe-2"
              viewBox="0 0 16 16"
              onClick={(e) => props.getLink(e.target, 'learn-the-platform')}
            >
              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
            </svg>
            Learn the platform
          </h2>
        </Col>
      </Row> */}
      {/* <Container className=" text-center">
  <Row className="gy-5 gx-5">
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
  </Row>
</Container> */}
      <Row className="pageContentRow llanding" >
        <Col xs={12}>
          <Container>
            <Row>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Pre-built integrations</h3>
                    <div className={styles.cardDescription}>
                    <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            Enterprise Integration Patterns (EIP)
                          </a>
                        </p>
                        <p className={styles.description}>Learn how common EIPs can be implemented using Ballerina.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            Integration examples
                          </a>
                        </p>
                        <p className={styles.description}>Explore and try out a series of guided integration examples.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            Integration tutorials
                          </a>
                        </p>
                        <p className={styles.description}>Explore and try out a series of guided integration tutorials.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/supported-network-protocols`} className={styles.titleLink}>
                            Supported network integration protocols
                          </a>
                        </p>
                        <p className={styles.description}>List of network integration protocols supported by Ballerina.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/supported-data-formats`} className={styles.titleLink}>
                            Supported data formats
                          </a>
                        </p>
                        <p className={styles.description}>List of data formats supported by Ballerina.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/supported-network-protocols`} className={styles.titleLink}>
                            Supported network integration protocols
                          </a>
                        </p>
                        <p className={styles.description}>List of network integration protocols supported by Ballerina.</p>
                      </div>

                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Integration technology tools</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/openapi-tool`} className={styles.titleLink}>
                            OpenAPI tool</a>
                        </p>
                        <p className={styles.description}>Generate a Ballerina service and client skeletons for an OpenAPI contract.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/graphql-tool`} className={styles.titleLink}>
                            GraphQL tool
                          </a>
                        </p>
                        <p className={styles.description}>Generate GraphQL client skeletons in Ballerina.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/asyncapi-tool`} className={styles.titleLink}>
                            AsyncAPI tool
                          </a>
                        </p>
                        <p className={styles.description}>Generate a Ballerina service and listener skeletons for an AsyncAPI contract.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/asyncapi-tool`} className={styles.titleLink}>
                            gRPC tool
                          </a>
                        </p>
                        <p className={styles.description}>Generate clients in Ballerina for gRPC services.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/health-tool`} className={styles.titleLink}>
                            Health tool (FHIR/HL7)
                          </a>
                        </p>
                        <p className={styles.description}>FHIR profile to client and stub generation tool of Ballerina.</p>
                      </div>


                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/edi-tool`} className={styles.titleLink}>
                            EDI tool 
                          </a>
                        </p>
                        <p className={styles.description}>The set of command line tools provided to work with EDI files in Ballerina.</p>
                      </div>

                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>References</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/get-started`} className={styles.titleLink}>
                            Get started
                          </a>
                        </p>
                        <p className={styles.description}>Install Ballerina, set it all up, and take it for a spin.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/by-example`} className={styles.titleLink}>
                            Ballerina by Example
                          </a>
                        </p>
                        <p className={styles.description}>Explore and try out a series of guided Ballerina examples.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`https://central.ballerina.io/`} className={styles.titleLink}>
                            Ballerina API Docs
                          </a>
                        </p>
                        <p className={styles.description}>Refer Ballerina library (API) documentation.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/ballerina-specifications`} className={styles.titleLink}>
                            Ballerina specifications
                          </a>
                        </p>
                        <p className={styles.description}>Refer language, library, and platform specifications.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a target='_blank' rel="noreferrer" href="https://wso2.com/ballerina/vscode/docs/" className={styles.titleLink}>
                            Visual Studio Code extension</a>
                        </p>
                        <p className={styles.description}>Features of the Ballerina Visual Studio Code extension.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {/* <Col xs={12} md={3} lg={3} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Supported network integration protocols</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            HTTP
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            gRPC
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            WebSockets
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            WebSub
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            GraphQL
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            TCP
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            FTP
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            SMTP
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            POP3
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            JMS
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            AMQP
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            AWS SQS
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={3} lg={3} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Supported data formats</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/integration/supported-data-formats`} className={styles.titleLink}>
                            JSON
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            XML
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            YAML
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            TOML
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            CSV
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            TSV
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            EDI
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            HL7
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            FHIR
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            ProtoBuf
                          </a>
                        </p>
                        <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col> */}
            </Row>
          </Container>
        </Col>
      </Row>
      <Row className="pageContentRow llanding" style={{ background: "#eeeeee" }}>
        <Col xs={12}>
          <Container>
            <Row>
              <Col xs={12}>
                <h2>Development tutorials</h2>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Build and run</h3>
                    <div className={styles.cardDescription}>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/build-and-run/cli-commands`} className={styles.titleLink}>
                            Bal command
                          </a>
                        </p>
                        <p className={styles.description}>CLI commands of the bal tool.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Organize source code and dependencies</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/organize-ballerina-code`} className={styles.titleLink}>
                            Organize Ballerina code
                          </a>
                        </p>
                        <p className={styles.description}>Basics of projects, packages, and modules.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/package-references`} className={styles.titleLink}>
                            Package references
                          </a>
                        </p>
                        <p className={styles.description}>References related to Ballerina Packages.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/manage-dependencies`} className={styles.titleLink}>
                            Manage dependencies
                          </a>
                        </p>
                        <p className={styles.description}>Declare and manage dependencies and use the local repository.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/style-guide/coding-conventions`} className={styles.titleLink}>
                            Style guide
                          </a>
                        </p>
                        <p className={styles.description}>Best practices to follow when formatting Ballerina code.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Test, debug, and document the code</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/test-ballerina-code/test-a-simple-function`} className={styles.titleLink}>
                            Test Ballerina code
                          </a>
                        </p>
                        <p className={styles.description}>Write automated tests using the built-in test framework.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/debug-ballerina-programs`} className={styles.titleLink}>
                            Debug Ballerina programs
                          </a>
                        </p>
                        <p className={styles.description}>Tooling support for troubleshooting Ballerina applications.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/strand-dump-tool`} className={styles.titleLink}>
                            Strand dump tool
                          </a>
                        </p>
                        <p className={styles.description}>Dump the status of currently running strands.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/generate-code-documentation`} className={styles.titleLink}>
                            Document Ballerina code
                          </a>
                        </p>
                        <p className={styles.description}>Generate documentation for the code.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Persistently store data</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/bal-persist-overview`} className={styles.titleLink}>
                            Overview
                          </a>
                        </p>
                        <p className={styles.description}>How to simplify data persistence with <code>bal persist</code>.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/persist-model`} className={styles.titleLink}>
                            Data model
                          </a>
                        </p>
                        <p className={styles.description}>How to model and define data structures for efficient data persistence.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/persist-cli-tool`} className={styles.titleLink}>
                            CLI tool
                          </a>
                        </p>
                        <p className={styles.description}>How to use the tool for generating client code and types for the data model.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/persist-client-api`} className={styles.titleLink}>
                            Type-safe client API
                          </a>
                        </p>
                        <p className={styles.description}>Generated client, types, and their usages for managing data persistence.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/supported-data-stores`} className={styles.titleLink}>
                            Supported data stores
                          </a>
                        </p>
                        <p className={styles.description}>Data stores supported for managing data persistence.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Run in the cloud</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/run-in-the-cloud/code-to-cloud-deployment`} className={styles.titleLink}>
                            Code to cloud deployment
                          </a>
                        </p>
                        <p className={styles.description}>Generating cloud deployment artifacts.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/run-in-the-cloud/azure-functions/`} className={styles.titleLink}>
                            Azure Function
                          </a>
                        </p>
                        <p className={styles.description}>Functionality to expose Ballerina functions as serverless functions in the Azure Functions platform.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/run-in-the-cloud/aws-lambda/`} className={styles.titleLink}>
                            AWS Lambda
                          </a>
                        </p>
                        <p className={styles.description}>Functionality to write AWS Lambda-compatible packages.</p>
                      </div>

                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Configurability</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/configure-ballerina-programs/configure-a-sample-ballerina-service`} className={styles.titleLink}>
                            Configure Ballerina programs
                          </a>
                        </p>
                        <p className={styles.description}>The language support for configurability.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Observability</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/observe-ballerina-programs`} className={styles.titleLink}>
                            Observe Ballerina programs</a>
                        </p>
                        <p className={styles.description}>Basics of the observability functionalities that are provided for Ballerina programs.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/observe-ballerina-programs`} className={styles.titleLink}>
                            Observe logs</a>
                        </p>
                        <p className={styles.description}>How Ballerina supports observing logs of external systems.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/observe-ballerina-programs`} className={styles.titleLink}>
                            Observe metrics</a>
                        </p>
                        <p className={styles.description}>How Ballerina supports observing metrics of external systems.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/observe-ballerina-programs`} className={styles.titleLink}>
                            Observe tracing</a>
                        </p>
                        <p className={styles.description}>How Ballerina supports observing tracing of external systems.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Java interoperability</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/call-java-code-from-ballerina`} className={styles.titleLink}>
                            How to call Java code from Ballerina.
                          </a>
                        </p>
                        <p className={styles.description}>Calling Java code from Ballerina.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/java-interoperability-guide/java-interoperability`} className={styles.titleLink}>
                            Java interoperability guide
                          </a>
                        </p>
                        <p className={styles.description}>Instructions on the supoorted Java interoperability.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Build native binaries with GraalVM</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/graalvm-executable-overview`} className={styles.titleLink}>
                            GraalVM executable overview
                          </a>
                        </p>
                        <p className={styles.description}>The overview of GraalVM and the native executable.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/build-the-executable-in-a-container`} className={styles.titleLink}>
                            Build the GraalVM executable in a container
                          </a>
                        </p>
                        <p className={styles.description}>Building and packing the GraalVM executable in a container.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/build-the-executable-locally`} className={styles.titleLink}>
                            Build the GraalVM executable locally
                          </a>
                        </p>
                        <p className={styles.description}>Building the GraalVM executable locally from Ballerina.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Reuse code with Ballerina Central</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/publish-packages-to-ballerina-central`} className={styles.titleLink}>
                            Publish packages to Ballerina Central
                          </a>
                        </p>
                        <p className={styles.description}>Publish your library package to Ballerina Central.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row className="pageContentRow llanding" >
        <Col xs={12}>
          <Container>
            <Row>
              <Col xs={12}>
                <h2>Resources</h2>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Featured scenarios</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/write-a-restful-api-with-ballerina/`} className={styles.titleLink}>
                            Write a RESTful API with Ballerina
                          </a>
                        </p>
                        <p className={styles.description}>Use Ballerina constructs to create RESTful APIs.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/write-a-grpc-service-with-ballerina/`} className={styles.titleLink}>
                            Write a gRPC service with Ballerina
                          </a>
                        </p>
                        <p className={styles.description}>Write and invoke a simple Ballerina gRPC service.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/manage-data-persistence-with-bal-persist/`} className={styles.titleLink}>
                            Manage data persistence with bal persist
                          </a>
                        </p>
                        <p className={styles.description}>Use <code>bal persist</code> to simplify data persistence management.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/write-a-graphql-api-with-ballerina/`} className={styles.titleLink}>
                            Write a GraphQL API with Ballerina
                          </a>
                        </p>
                        <p className={styles.description}>Write and invoke a simple Ballerina GraphQL service.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/work-with-data-using-queries-in-ballerina/`} className={styles.titleLink}>
                            Work with data using queries in Ballerina
                          </a>
                        </p>
                        <p className={styles.description}>Use query expressions to work with data.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/build-a-data-service-in-ballerina/`} className={styles.titleLink}>
                            Build a data service in Ballerina
                          </a>
                        </p>
                        <p className={styles.description}>Use Ballerina constructs to work with data services.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/deploy-ballerina-on-kubernetes/`} className={styles.titleLink}>
                            Deploy Ballerina on Kubernetes
                          </a>
                        </p>
                        <p className={styles.description}>Write, build, and deploy a Ballerina service on Kubernetes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={6} lg={6} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Learn the language</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/language-basics`} className={styles.titleLink}>
                          Language basics
                          </a>
                        </p>
                        <p className={styles.description}>Get started with basics that are common to all C-Family programming languages.</p>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/distinctive-language-features/network-interaction`} className={styles.titleLink}>
                          Network interaction
                          </a>
                        </p>
                        <p className={styles.description}>The features of the Ballerina programming language that are distinctive. </p>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/distinctive-language-features/data`} className={styles.titleLink}>
                            Data
                          </a>
                        </p>
                        <p className={styles.description}>Some of the plain data supported by Ballerina that we have not covered in the last part, specifically, tables and XML types.</p>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/distinctive-language-features/concurrency`} className={styles.titleLink}>
                          Concurrency
                          </a>
                        </p>
                        <p className={styles.description}>How concurrency and transactions are handled in Ballerina.</p>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/distinctive-language-features/advanced-general-purpose-language-features`} className={styles.titleLink}>
                          Advanced general purpose language features
                          </a>
                        </p>
                        <p className={styles.description}>Advanced features which are a mixed bag of additional options to the language.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      {/* </Container> */}

    </>
  );
}