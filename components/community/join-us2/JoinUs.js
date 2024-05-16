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
import { Row, Col, Container, Card } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import styles from './JoinUs.module.css';
import { prefix } from '../../../utils/prefix';

export default function JoinUs(props) {

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='join-us' className={`${styles.discord} section`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'join-us')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Join us
            </h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <p>
              Our community includes experienced Ballerina engineers and experts from some of the world&apos;s leading companies. Use this space to find answers to your questions, get support, or learn from others who use Ballerina.
            </p>
          </Col>

        </Row>

        <Row>

          <Col xs={12} sm={12} md={6}>
            <div className={`card mb-3 ${styles.borderless}`}>
              <Row className="g-0">
                <Col md={4} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <img src={`${prefix}/images/sm-icons/Discord_logo.svg`} className="img-fluid rounded-start" alt="Discord" />
                </Col>
                <Col md={8}>
                  <div className="card-body">
                    <a href="https://discord.gg/ballerinalang" target="_blank" rel="noreferrer" title="Discord" className={styles.btnStyle}>
                      <Card.Text className='text-center mt-3 mb-3'>
                        Join our server
                      </Card.Text>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>


            <div className={`card mb-3 ${styles.borderless}`}>
              <Row className="g-0">
                <Col md={4} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <img src={`${prefix}/images/sm-icons/Stack_Overflow_logo.svg`} className="img-fluid rounded-start" alt="Stackoverflow" />
                </Col>
                <Col md={8}>
                  <div className="card-body">
                    <a href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" title="Stackoverflow" className={styles.btnStyle}>
                      <Card.Text className='text-center mt-3 mb-3'>
                        Ask, answer, and learn
                      </Card.Text>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>

            <div className={`card mb-3 ${styles.borderless}`}>
              <Row className="g-0">
                <Col md={4} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <img src={`${prefix}/images/sm-icons/github-black.svg`} className={`img-fluid rounded-start ${styles.centerLogo}`} alt="GitHub" />
                </Col>
                <Col md={8}>
                  <div className="card-body">
                    <a href="https://github.com/ballerina-platform" target="_blank" rel="noreferrer" title="GitHub" className={styles.btnStyle}>
                      <Card.Text className='text-center mt-3 mb-3'>
                        Collaborate on GitHub
                      </Card.Text>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>

            <div className={`card mb-3 ${styles.borderless}`}>
              <Row className="g-0">
                <Col md={4} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <img src={`${prefix}/images/sm-icons/twitter-x-black.png`} className={`img-fluid rounded-start ${styles.centerLogo}`} alt="X" />
                </Col>
                <Col md={8}>
                  <div className="card-body">
                    <a href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer" title="X" className={styles.btnStyle}>
                      <Card.Text className='text-center mt-3 mb-3'>
                        Follow us
                      </Card.Text>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col xs={12} sm={12} md={6}>
            <div className={`card mb-3 ${styles.borderless}`}>
              <Row className="g-0">
                <Col md={4} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <img src={`${prefix}/images/sm-icons/LI-Logo.png`} className={`img-fluid rounded-start`} alt="LinkedIn" />
                </Col>
                <Col md={8}>
                  <div className="card-body">
                    <a href="https://www.linkedin.com/showcase/ballerinalang/" target="_blank" rel="noreferrer" title="LinkedIn" className={styles.btnStyle}>
                      <Card.Text className='text-center mt-3 mb-3'>
                        Connect with us
                      </Card.Text>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>

            <div className={`card mb-3 ${styles.borderless}`}>
              <Row className="g-0">
                <Col md={4} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <img src={`${prefix}/images/sm-icons/yt_logo_rgb_light.png`} className={`img-fluid rounded-start`} alt="YouTube" />
                </Col>
                <Col md={8}>
                  <div className="card-body">
                    <a href="https://www.youtube.com/c/Ballerinalang?reload=9" target="_blank" rel="noreferrer" title="YouTube" className={styles.btnStyle}>
                      <Card.Text className='text-center mt-3 mb-3'>
                        Subscribe to our channel
                      </Card.Text>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>

            <div className={`card mb-3 ${styles.borderless}`}>
              <Row className="g-0">
                <Col md={4} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <img src={`${prefix}/images/sm-icons/logo--mSwarm.svg`} className={`img-fluid rounded-start ${styles.centerLogo}`} alt="Meetup" />
                </Col>
                <Col md={8}>
                  <div className="card-body">
                    <a href="https://www.meetup.com/ballerinalang-community/" target="_blank" rel="noreferrer" title="Meetup" className={styles.btnStyle}>
                      <Card.Text className='text-center mt-3 mb-3'>
                        Join our Meetup group
                      </Card.Text>
                    </a>
                  </div>
                </Col>
              </Row>
            </div>

          </Col>

        </Row>
      </Container>
    </Col>
  );
}
