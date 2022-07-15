import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './Platform.module.css';
import { prefix } from '../../../utils/prefix';

export default function Platform() {

  return (
    <>
      <Row className="pageContentRow learnRow">
        <Col xs={12} md={12}>
          <h2>Learn the platform</h2>
        </Col>
      </Row>


      <Row className="pageContentRow">
        <Col xs={12} lg={4}>
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
            <h3>Test &amp; document the code</h3>

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
              <p className={styles.description}>Generate documentation for the code</p>
            </div>
          </div>


        </Col>
        <Col xs={12} lg={4}>
          <div className={styles.pGroup}>
            <h3>Run in the cloud</h3>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/run-in-the-cloud/code-to-cloud/code-to-cloud-deployment`} className={styles.titleLink}>
                  Code to cloud
                </a>
              </p>
              <p className={styles.description}>Generating cloud deployment artifacts</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/run-in-the-cloud/function-as-a-service/aws-lambda/`} className={styles.titleLink}>
                  Functions as a service
                </a>
              </p>
              <p className={styles.description}>AWS Lambda and Azure functions</p>
            </div>
          </div>


          <div className={styles.pGroup}>
            <h3>Configure &amp; observe</h3>

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
              <p className={styles.description}>Calling Java code from Ballerina</p>
            </div>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href={`${prefix}/learn/java-interoperability-guide/java-interoperability`} className={styles.titleLink}>
                  Java interoperability guide
                </a>
              </p>
              <p className={styles.description}>Instructions on the supoorted Java interoperability</p>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={4}>

          <div className={styles.pGroup}>
            <h3>Ballerina Tooling</h3>

            <div className={styles.content}>
              <p className={styles.title}>
                <a href="https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina" className={styles.titleLink}>
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
                <a href={`${prefix}/learn/cli-documentation/cli-commands`} className={styles.titleLink}>
                  CLI documentation
                </a>
              </p>
              <p className={styles.description}>Details of the CLI commands of the bal tool.</p>
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
      </Row>
    </>
  );
}
