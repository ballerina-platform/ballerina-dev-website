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
            <p>Leveraging our expertise in areas like compiler design, integration, microservices, AI, and more, we offer a wide range of programs to educational institutions at no cost.</p>

            <p>Some of these programs include:</p>
          </Col>
        </Row>

        <Row>
          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/guest-lectures-and-talks.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Guest lectures and talks</h3>

                    <p className="card-text">Sessions covering microservices, integration, cloud-native development, data-oriented programming, and more.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/workshops-and-training-sessions.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
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
                  <Card.Img src={`${prefix}/images/hackathons-and-coding-challenges.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Hackathons and coding challenges</h3>

                    <p className="card-text">Coding events to promote teamwork and creativity with prizes for participants.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/research-collaborations.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Research collaborations</h3>

                    <p className="card-text">Research collaborations to explore innovative technology and work on impactful projects.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/open-source-projects.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Open source projects</h3>

                    <p className="card-text">Contribute to Ballerina&apos;s open-source projects for practical experience and global collaboration.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3`} style={{ width: "100%", justifyContent: "center" }}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/industry-projects.svg`} className={styles.icon} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Industry projects</h3>

                    <p className="card-text">Partner for real-world digital transformation projects to develop skills in industry practices.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>


        </Row>


        <Row style={{ marginTop: "20px" }}>
          <Col sm={12}>

            <p><a className={styles.learnMore} href='Collaborative-Learning-Initiatives-WSO2-Ballerina-and-Universities.pdf' target='_blank' rel="noreferrer">Learn more</a></p>

            <p>
              Want to find out more? Reach out to our team at <a className={styles.mailLink} href="mailto:contact@ballerina.io">contact@ballerina.io</a>
            </p>

          </Col>
        </Row>

      </Container>
    </Col>
  );
}
