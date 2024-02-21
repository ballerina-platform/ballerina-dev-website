/**
 * Copyright (c) 2024, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import { Row, Col, Container, Card } from 'react-bootstrap';

import { prefix } from '../../../utils/prefix';

import styles from './Outline.module.css';

export default function Outline(props) {

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='program-outline' className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'program-outline')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Program outline
            </h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <p>Leveraging our extensive expertise in areas like compiler design, integration, microservices, AI, and more, we offer a wide range of programs at no cost to universities or educational institutions.</p>

            <p>Some of these programs include:</p>
          </Col>
        </Row>

        <Row>
          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/chevron-right.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Guest lectures and talks</h3>

                    <p className="card-text">Engaging sessions on essential topics like microservices, application integration protocols, cloud-native application development, application security, and data-oriented programming.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/chevron-right.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Workshops and training sessions</h3>

                    <p className="card-text">Hands-on workshops for in-depth knowledge and practical skills in key areas relevant to technologies used in the industry.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>


          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/chevron-right.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Hackathons and coding challenges</h3>

                    <p className="card-text">Exciting coding events that foster creativity, innovation, and teamwork with prizes and swag for winning teams (sponsored by WSO2).</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/chevron-right.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Research collaborations</h3>

                    <p className="card-text">Partner for research collaborations to explore new tech applications offering students the opportunity to engage in high-impact research projects.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/chevron-right.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Open source projects</h3>

                    <p className="card-text">Opportunity to contribute to open-source projects written in Ballerina. This can be an excellent way for students to gain practical experience, understand community-driven development, and collaborate with developers worldwide.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/chevron-right.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Industry projects</h3>

                    <p className="card-text">Partner for real-world digital transformation projects to providing students with opportunities to explore, experience and develop skills relevant to industrial practices.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>


        </Row>


        <Row style={{ marginTop: "20px" }}>
          <Col sm={12}>

            <p>
              Want to find out more? Then reach out to our team at <a className={styles.mailLink} href="mailto:contact@ballerina.io">contact@ballerina.io</a>
            </p>

          </Col>
        </Row>

      </Container>
    </Col>
  );
}
