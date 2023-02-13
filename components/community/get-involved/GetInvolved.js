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

export default function GetInvolved() {

  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='get-involved'>Get involved</h2>
          </Col>
        </Row>

        <Row>
        <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="report-issues"></span>
            <h4 id="report-issues-title">
              Report issues
            </h4>
            <p><a id="reportissues" target='_blank' rel="noreferrer" className={styles.getStartLinks} href="https://github.com/ballerina-platform/ballerina-lang/issues/new/choose">Report issues</a> in the respective GitHub repositories of the areas and components.</p>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="contribute-to-the-source-code"></span>
            <h4 id="contribute-to-the-source-code-title">
              Contribute to the source code
            </h4>
            <p>Make Ballerina better by contributing to its source code. Read the <a className={styles.getStartLinks} target="_blank" rel="noreferrer" href="https://github.com/ballerina-platform/ballerina-lang/blob/master/CONTRIBUTING.md" >contribution guide</a> and  get started. Happy contributing!</p>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="contribute-to-ballerina-central"></span>
            <h4 id="contribute-to-ballerina-central-title">
              Contribute to Ballerina Central
            </h4>
            <p>Let the whole community benefit from your work by <a className={styles.getStartLinks} target="_blank" rel="noreferrer" href="/learn/publish-packages-to-ballerina-central/" >
              creating and publishing</a> your own module to <a className={styles.getStartLinks} target="_blank" rel="noreferrer" href="https://central.ballerina.io/" >Ballerina Central</a>. </p>
          </Col>
        </Row>


        <Row>
        <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="join-dev-google-group"></span>
            <h4 id="join-dev-google-group-title">
              Active proposals for Ballerina
            </h4>
            <p>Want to find out the active proposals proposed by the Ballerina community? Check out the <a className={styles.getStartLinks} rel="noreferrer" target="_blank" href="/community/active-proposals">active proposals list</a>.</p>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="submit-a-use-case"></span>
            <h4 id="submit-a-use-case-title">
              Submit a use case
            </h4>
            <p><a id="submitUseCase" className={styles.getStartLinks} onClick={handleShow}>Tell us</a> how you&apos;re using Ballerina in your project and be a part of our community stories. </p>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.card}>
            <span className="bookMarkOnPage" id="host-a-ballerina-event"></span>
            <h4 id="host-a-ballerina-event-title">
              Host a Ballerina event
            </h4>
            <p>Want to talk about Ballerina at your local tech meetup? Reach us at <a className={styles.getStartLinks} href="mailto:contact@ballerina.io">contact@ballerina.io</a>, and we will help you with any presentation content.</p>
          </Col>
          

          <Modal show={show} onHide={handleClose} id="submitUseCaseForm" className={styles.customModal}>
            <Modal.Header closeButton>
              <Modal.Title>Submit a use case</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.customModalBody}>
              <iframe src="https://resources.wso2.com/l/142131/2022-01-05/b3x743" frameBorder="0" className={styles.formEmbedded} />
            </Modal.Body>
          </Modal>
        </Row>
      </Container>
    </Col>
  );
}
