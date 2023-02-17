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
import { Row, Col } from 'react-bootstrap';

import styles from './Platform.module.css';
import { prefix } from '../../../utils/prefix';

export default function Platform(props) {

  return (
    <>
      <Row className="pageContentRow learnRow llanding">
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
      </Row>


      <Row className="pageContentRow llanding">
        <Col xs={12} lg={4} className={styles.contentCol}>
          <div className={styles.pGroup}>
            <h3>Source code &amp; dependencies</h3>

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

          <div className={styles.pGroup}>
            <h3>Test, debug, and document the code</h3>

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
                  Debug Ballerina Programs
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
          <div className={styles.pGroup}>
            <h3>Run in the cloud</h3>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/run-in-the-cloud/code-to-cloud/code-to-cloud-deployment`} className={styles.titleLink}>
                  Code to cloud
                </a>
              </p>
              <p className={styles.description}>Generating cloud deployment artifacts.</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/run-in-the-cloud/function-as-a-service/aws-lambda/`} className={styles.titleLink}>
                  Functions as a service
                </a>
              </p>
              <p className={styles.description}>AWS Lambda and Azure functions.</p>
            </div>
          </div>


        </Col>
        <Col xs={12} lg={4} className={styles.contentCol}>

          <div className={styles.pGroup}>
            <h3>Configure and observe</h3>

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
          <div className={styles.pGroup}>
            <h3>Java interoperability</h3>

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

          <div className={styles.pGroup}>
            <h3>Native support</h3>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/build-a-native-executable`} className={styles.titleLink}>
                  [Experimental] Build a native executable
                </a>
              </p>
              <p className={styles.description}>Building a GraalVM native executable from Ballerina.</p>
            </div>
          </div>
          <div className={styles.pGroup}>
            <h3>Ballerina Central</h3>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/publish-packages-to-ballerina-central`} className={styles.titleLink}>
                  Publish packages to Ballerina Central
                </a>
              </p>
              <p className={styles.description}>Details of publishing your library package to Ballerina Central.</p>
            </div>
          </div>

          
        </Col>
        <Col xs={12} lg={4} className={styles.contentCol}>
          <div className={styles.pGroup}>
            <h3>Ballerina tooling</h3>

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
                <a href={`${prefix}/learn/graphql-client-tool`} className={styles.titleLink}>
                  GraphQL client tool
                </a>
              </p>
              <p className={styles.description}>Details of the Ballerina GraphQL client tool.</p>
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



        </Col>
        
      </Row>
    </>
  );
}
