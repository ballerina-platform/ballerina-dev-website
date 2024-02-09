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
              Our community includes experienced Ballerina engineers and experts from some of the world's leading companies. Use this space to find answers to your questions, get support, or learn from others who use Ballerina.
            </p>
          </Col>

        </Row>

        <Row>

          <Col xs={12}>

            <Row xs={1} md={2} lg={4} className="g-6">

              <Col className={`${styles.cardCol} mt-5`}>
                <a href="https://discord.gg/ballerinalang" target="_blank" rel="noreferrer" title="Discord">
                  <Card className={styles.joinCard}>
                    <div className={styles.imageWrap}>
                      <Card.Img variant="top" src={`${prefix}/images/sm-icons/Discord_logo.svg`} className={styles.centerWideLogo} alt='Discord' />
                    </div>
                    <Card.Body>
                      <Card.Text className='text-center mt-3'>
                        <div className={styles.join} title="Discord">
                          Join our server
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>

              <Col className={`${styles.cardCol} mt-5`}>
                <a href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" title="Stackoverflow">
                  <Card className={styles.joinCard}>
                    <div className={styles.imageWrap}>
                      <Card.Img variant="top" src={`${prefix}/images/sm-icons/Stack_Overflow_logo.svg`} className={styles.centerWideLogo} alt='Stackoverflow' />
                    </div>
                    <Card.Body>
                      <Card.Text className='text-center mt-3'>
                        <div className={styles.join} title="Stackoverflow">
                          Get your questions answered
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>

              <Col className={`${styles.cardCol} mt-5`}>
                <a href="https://github.com/ballerina-platform" target="_blank" rel="noreferrer" title="GitHub">
                  <Card className={styles.joinCard}>
                    <div className={styles.imageWrap}>
                      <Card.Img variant="top" src={`${prefix}/images/sm-icons/github-black.svg`} className={styles.centerLogo} alt='GitHub' />
                    </div>
                    <Card.Body>
                      <Card.Text className='text-center mt-3'>
                        <div href="https://github.com/ballerina-platform" className={styles.join} title="GitHub">
                          Collaborate on GitHub
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>

              <Col className={`${styles.cardCol} mt-5`}>
                <a href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer" title="X">
                  <Card className={styles.joinCard}>
                    <div className={styles.imageWrap}>
                      <Card.Img variant="top" src={`${prefix}/images/sm-icons/twitter-x-black.png`} className={styles.centerLogo} alt='X' />
                    </div>
                    <Card.Body>
                      <Card.Text className='text-center mt-3'>
                        <div className={styles.join} title="X">
                          Follow us
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>

            </Row>

            <Row xs={1} md={2} lg={4} className="g-6 justify-content-center">
              <Col className={`${styles.cardCol} mt-5`}>
                <a href="https://www.linkedin.com/showcase/ballerinalang/" target="_blank" rel="noreferrer" title="LinkedIn">
                  <Card className={styles.joinCard}>
                    <div className={styles.imageWrap}>
                      <Card.Img variant="top" src={`${prefix}/images/sm-icons/LI-Logo.png`} className={styles.centerExtraWideLogo} alt='LinkedIn' />
                    </div>
                    <Card.Body>
                      <Card.Text className='text-center mt-3'>
                        <div className={styles.join} title="LinkedIn">
                          Connect with us
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>

              <Col className={`${styles.cardCol} mt-5`}>
                <a href="https://www.youtube.com/c/Ballerinalang?reload=9" target="_blank" rel="noreferrer" title="YouTube">
                  <Card className={styles.joinCard}>
                    <div className={styles.imageWrap}>
                      <Card.Img variant="top" src={`${prefix}/images/sm-icons/yt_logo_rgb_light.png`} className={styles.centerExtraWideLogo} alt='YouTube' />
                    </div>
                    <Card.Body>
                      <Card.Text className='text-center mt-3'>
                        <div className={styles.join} title="YouTube">
                          Subscribe to our channel
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>

              <Col className={`${styles.cardCol} mt-5`}>
                <a href="https://www.meetup.com/ballerinalang-community/" target="_blank" rel="noreferrer" title="Meetup">
                  <Card className={styles.joinCard}>
                    <div className={styles.imageWrap}>
                      <Card.Img variant="top" src={`${prefix}/images/sm-icons/logo--mSwarm.svg`} className={styles.centerLogo} style={{ width: "20%" }} alt='Meetup' />
                    </div>
                    <Card.Body>
                      <Card.Text className='text-center mt-3'>
                        <div className={styles.join} title="Meetup">
                          Join our Meetup group
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </a>
              </Col>
            </Row>

          </Col>
        </Row>
      </Container>
    </Col>
  );
}
