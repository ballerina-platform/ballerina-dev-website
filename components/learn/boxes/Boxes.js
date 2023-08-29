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
      <Row className="pageContentRow llanding" >
        <Col xs={12}>
          <Container>
            <Row>
              <Col xs={12} md={4} lg={4} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Get started with integration</h3>
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
                          <a href={`${prefix}/learn2/#`} className={styles.titleLink}>
                            Enterprise Integration Patterns (EIP)
                          </a>
                        </p>
                        <p className={styles.description}>Learn how common EIPs can be implemented using Ballerina.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/pre-built-integrations/`} className={styles.titleLink}>
                            Pre-built integrations
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
                    <h3>Integration tools</h3>
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
                          <a href={`${prefix}/learn/strand-dump-tool`} className={styles.titleLink}>
                            Strand dump tool
                          </a>
                        </p>
                        <p className={styles.description}>Dump and inspect the currently available strands of a Ballerina program.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/health-tool`} className={styles.titleLink}>
                            Health tool (FHIR/HL7)
                          </a>
                        </p>
                        <p className={styles.description}>FHIR/HL7 profile to client and stub generation tool of Ballerina.</p>
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
                        <p className={styles.description}>Refer to the Ballerina library (API) documentation.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/ballerina-specifications`} className={styles.titleLink}>
                            Ballerina specifications
                          </a>
                        </p>
                        <p className={styles.description}>Refer to the language, library, and platform specifications.</p>
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
                        <p className={styles.description}>References related to Ballerina packages.</p>
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
                        <p className={styles.description}>Data stores for managing data persistence.</p>
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
                        <p className={styles.description}>Generate cloud deployment artifacts.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/run-in-the-cloud/azure-functions/`} className={styles.titleLink}>
                            Azure Function
                          </a>
                        </p>
                        <p className={styles.description}>Expose Ballerina functions as serverless functions in the Azure Functions platform.</p>
                      </div>

                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/run-in-the-cloud/aws-lambda/`} className={styles.titleLink}>
                            AWS Lambda
                          </a>
                        </p>
                        <p className={styles.description}>Write AWS Lambda-compatible packages.</p>
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
                          <a href={`${prefix}/learn/configure-a-sample-ballerina-service`} className={styles.titleLink}>
                            Configure a sample Ballerina service
                          </a>
                        </p>
                        <p className={styles.description}>Configure values at runtime through configurable module-level variables.</p>
                      </div>
                    </div>

                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/provide-values-to-configurable-variables`} className={styles.titleLink}>
                          Provide values to configurable variables
                          </a>
                        </p>
                        <p className={styles.description}>Provide configurable values through configuration files, command-line arguments, and environment variables.</p>
                      </div>
                    </div>

                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/configure-values`} className={styles.titleLink}>
                            Configure values
                          </a>
                        </p>
                        <p className={styles.description}>Advanced use cases of configuring values using configurable variables.</p>
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
                        <p className={styles.description}>Call existing Java code from Ballerina.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/java-interoperability-guide/java-interoperability`} className={styles.titleLink}>
                            Java interoperability guide
                          </a>
                        </p>
                        <p className={styles.description}>Instructions on the supported Java interoperability features.</p>
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
                        <p className={styles.description}>Build and pack the GraalVM executable in a container.</p>
                      </div>
                      <div className={styles.content}>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/build-the-executable-locally`} className={styles.titleLink}>
                            Build the GraalVM executable locally
                          </a>
                        </p>
                        <p className={styles.description}>Build the GraalVM executable locally from Ballerina.</p>
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
                        <p className={styles.description}>Provide and consume services using Ballerina. </p>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/distinctive-language-features/data`} className={styles.titleLink}>
                            Data
                          </a>
                        </p>
                        <p className={styles.description}>Work with data using Ballerina.</p>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/distinctive-language-features/concurrency`} className={styles.titleLink}>
                            Concurrency
                          </a>
                        </p>
                        <p className={styles.description}>How concurrency and transactions are handled in Ballerina.</p>
                        <p className={styles.title}>
                          <a href={`${prefix}/learn/distinctive-language-features/advanced-general-purpose-language-features`} className={styles.titleLink}>
                            Advanced general-purpose language features
                          </a>
                        </p>
                        <p className={styles.description}>Advanced features, which are additional options for the language.</p>
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