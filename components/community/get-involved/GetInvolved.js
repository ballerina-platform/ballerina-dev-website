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
import { Row, Col, Modal, Container } from 'react-bootstrap';

import styles from './GetInvolved.module.css';

export default function GetInvolved(props) {

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='get-involved' className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'get-involved')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Get involved
            </h2>
          </Col>
        </Row>

        <Row>
          {/* <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="report-issues"></span>
            <h4 id="report-issues-title">
              Report issues
            </h4>
            <p><a id="reportissues" target='_blank' rel="noreferrer" className={styles.getStartLinks} href="https://github.com/ballerina-platform/ballerina-lang/issues/new/choose">Report issues</a> in the respective GitHub repositories of the areas and components.</p>
          </Col> */}
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="contribute-to-the-source-code"></span>
            <h4 id="contribute-to-the-source-code-title">
              Contribute to the source code
            </h4>
            <p>Make Ballerina better by contributing to its source code. Read the <a className={styles.getStartLinks} target="_blank" rel="noreferrer" href="https://github.com/ballerina-platform/ballerina-lang/blob/master/CONTRIBUTING.md" >contribution guide</a> and  get started.</p>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="contribute-to-ballerina-central"></span>
            <h4 id="contribute-to-ballerina-central-title">
              Contribute to Ballerina Central
            </h4>
            <p>Let the whole community benefit from your work by <a className={styles.getStartLinks} target="_blank" rel="noreferrer" href="/learn/publish-packages-to-ballerina-central/" >
              creating and publishing</a> your module to <a className={styles.getStartLinks} target="_blank" rel="noreferrer" href="https://central.ballerina.io/" >Ballerina Central</a>. </p>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="host-a-ballerina-event"></span>
            <h4 id="host-a-ballerina-event-title">
              Host a Ballerina event
            </h4>
            <p>Want to talk about Ballerina at your local tech meetup? Reach us at <a className={styles.getStartLinks} href="mailto:contact@ballerina.io">contact@ballerina.io</a>.</p>
          </Col>
        </Row>

        {/* <Row>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="join-dev-google-group"></span>
            <h4 id="join-dev-google-group-title">
              Active proposals for Ballerina
            </h4>
            <p>Want to find out the active proposals proposed by the Ballerina community? Check out the <a className={styles.getStartLinks} rel="noreferrer" target="_blank" href="/community/active-proposals">active proposals list</a>.</p>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="host-a-ballerina-event"></span>
            <h4 id="host-a-ballerina-event-title">
              Host a Ballerina event
            </h4>
            <p>Want to talk about Ballerina at your local tech meetup? Reach us at <a className={styles.getStartLinks} href="mailto:contact@ballerina.io">contact@ballerina.io</a>.</p>
          </Col>

        </Row> */}

      </Container>
    </Col>
  );
}
