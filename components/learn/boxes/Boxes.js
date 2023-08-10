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
      <Container>
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
          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Integration examples</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration example 1
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration example 2
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration example 3
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration example 4
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration example 5
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Integration tutorials</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration tutorial 1
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration tutorial 2
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration tutorial 3
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration tutorial 4
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Integration tutorial 5
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
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
        </Row>

        <Row className="pageContentRow llanding" >
          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Supported data formats</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
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
          </Col>

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Building and running</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Quick run: via VSCode
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                        Bal command
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Organizing source code &amp; dependencies</h3>
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
                    <p className={styles.description}>Details of declaring and managing dependencies and using the local repository.</p>
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
        </Row>

        <Row className="pageContentRow llanding" >
          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Testing, debugging and documenting</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/test-ballerina-code/test-a-simple-function`} className={styles.titleLink}>
                        Test Ballerina code
                      </a>
                    </p>
                    <p className={styles.description}>Details of writing automated tests using the built-in test framework.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/debug-ballerina-programs`} className={styles.titleLink}>
                        Debug Ballerina programs
                      </a>
                    </p>
                    <p className={styles.description}>Details of tooling support for troubleshooting Ballerina applications.</p>
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

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Persistently storing data</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/bal-persist-overview`} className={styles.titleLink}>
                        Overview
                      </a>
                    </p>
                    <p className={styles.description}>Details on how to simplify data persistence with <code>bal persist</code>.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/persist-model`} className={styles.titleLink}>
                        Data model
                      </a>
                    </p>
                    <p className={styles.description}>Details on how to model and define data structures for efficient data persistence.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/persist-cli-tool`} className={styles.titleLink}>
                        CLI tool
                      </a>
                    </p>
                    <p className={styles.description}>Details on how to use the tool for generating client code and types for the data model.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/persist-client-api`} className={styles.titleLink}>
                        Type-safe client API
                      </a>
                    </p>
                    <p className={styles.description}>Details on generated client, types, and their usages for managing data persistence.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/supported-data-stores`} className={styles.titleLink}>
                        Supported data stores
                      </a>
                    </p>
                    <p className={styles.description}>Details on the data stores supported for managing data persistence.</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Running in the cloud</h3>
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
                      <a href={`${prefix}/learn/run-in-the-cloud/function-as-a-service/azure-functions/`} className={styles.titleLink}>
                        Azure Function
                      </a>
                    </p>
                    <p className={styles.description}>Details of Azure Function.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/run-in-the-cloud/function-as-a-service/aws-lambda/`} className={styles.titleLink}>
                        AWS Lambda
                      </a>
                    </p>
                    <p className={styles.description}>Details of AWS Lambda.</p>
                  </div>

                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="pageContentRow llanding" >
          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Configure and observe</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/configure-ballerina-programs/configure-a-sample-ballerina-service`} className={styles.titleLink}>
                        Configure Ballerina programs
                      </a>
                    </p>
                    <p className={styles.description}>The language support for configurability.</p>
                  </div>

                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/observe-ballerina-programs`} className={styles.titleLink}>
                        Observe Ballerina programs</a>
                    </p>
                    <p className={styles.description}>Basics of the observability functionalities that are provided for Ballerina programs.</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Java interoperability</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/call-java-code-from-ballerina`} className={styles.titleLink}>
                        Call Java code from Ballerina
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
                <h3>Building native binaries with GraalVM</h3>
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
        </Row>

        <Row className="pageContentRow llanding" >
          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Code reuse with Ballerina Central</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`${prefix}/learn/publish-packages-to-ballerina-central`} className={styles.titleLink}>
                        Publish packages to Ballerina Central
                      </a>
                    </p>
                    <p className={styles.description}>Details of publishing your library package to Ballerina Central.</p>
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
                <a target='_blank' rel="noreferrer" href="https://wso2.com/ballerina/vscode/docs/" className={styles.titleLink}>
                  Visual Studio Code extension</a>
              </p>
              <p className={styles.description}>Details of the Ballerina Visual Studio Code extension.</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/ballerina-shell`} className={styles.titleLink}>
                  Ballerina Shell
                </a>
              </p>
              <p className={styles.description}>Details of the Read-Evaluate-Print Loop (REPL) for Ballerina.</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/openapi-tool`} className={styles.titleLink}>
                  OpenAPI tool</a>
              </p>
              <p className={styles.description}>Details of the Ballerina OpenAPI tool.</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/graphql-tool`} className={styles.titleLink}>
                  GraphQL tool
                </a>
              </p>
              <p className={styles.description}>Details of the Ballerina GraphQL tool.</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/asyncapi-tool`} className={styles.titleLink}>
                  AsyncAPI tool
                </a>
              </p>
              <p className={styles.description}>Details of the Ballerina AsyncAPI tool.</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/strand-dump-tool`} className={styles.titleLink}>
                  Strand dump tool
                </a>
              </p>
              <p className={styles.description}>Details of the Ballerina strand dump tool.</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/cli-documentation/cli-commands`} className={styles.titleLink}>
                  CLI documentation
                </a>
              </p>
              <p className={styles.description}>Details of the CLI commands of the bal tool.</p>
            </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>API Docs</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                      <a href={`https://central.ballerina.io/`} className={styles.titleLink}>
                        Central
                      </a>
                    </p>
                    <p className={styles.description}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                  </div>

                </div>
              </div>
            </div>
          </Col>
        </Row>


        
      </Container>

    </>
  );
}
