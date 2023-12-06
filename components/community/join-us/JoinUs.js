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
            <h2 id='join-with-us' className={`${styles.discord} section`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'join-with-us')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Join with us
            </h2>
          </Col>
        </Row>

        <Row>

          <Col xs={12}>
            {/* <Row>
              <div className={styles.socialMedia}>
                <div className={styles.smIcons}>
                  <ul>
                    <li>
                      <a className={styles.footerLinkSM} href="https://discord.gg/ballerinalang" target="_blank" rel="noreferrer" title="Discord">
                        <Image src={`${prefix}/images/sm-icons/discord-color.svg`} width={70} height={60} alt="Discord" />
                      </a>
                    </li>
                    <li>
                      <a className={styles.footerLinkSM} href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" title="Stackoverflow">
                        <Image src={`${prefix}/images/sm-icons/stackoverflow-color.svg`} width={60} height={60} alt="Stackoverflow" />
                      </a>
                    </li>
                    <li>
                      <a className={styles.footerLinkSM} href="https://github.com/ballerina-platform" target="_blank" rel="noreferrer" title="GitHub">
                        <Image src={`${prefix}/images/sm-icons/github-black.svg`} width={70} height={70} alt="GitHub" />
                      </a>
                    </li>
                    <li>
                      <a className={styles.footerLinkSM} href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer" title="X">
                        <Image src={`${prefix}/images/sm-icons/twitter-x-black.png`} width={60} height={60} alt="X" />
                      </a>
                    </li>
                    <li>
                      <a className={styles.footerLinkSM} href="https://www.linkedin.com/showcase/ballerinalang/" target="_blank" rel="noreferrer" title="LinkedIn">
                        <Image src={`${prefix}/images/sm-icons/linkedin-color.svg`} width={70} height={70} alt="LinkedIn" />
                      </a>
                    </li>
                    <li>
                      <a className={styles.footerLinkSM} href="https://www.youtube.com/c/Ballerinalang?reload=9" target="_blank" rel="noreferrer" title="YouTube">
                        <Image src={`${prefix}/images/sm-icons/youtube-color.svg`} width={80} height={80} alt="YouTube" />
                      </a>
                    </li>
                    <li>
                      <a className={styles.footerLinkSM} href="https://www.meetup.com/ballerinalang-community/" target="_blank" rel="noreferrer" title="Meetup">
                        <Image src={`${prefix}/images/sm-icons/meetup-color.svg`} width={80} height={80} alt="Meetup" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Row> */}



            <Row xs={1} md={4} className="g-6">
              {/* {Array.from({ length: 4 }).map((_, idx) => ( */}
              <Col className={styles.cardCol}>
                <Card className={styles.joinCard}>
                  <div className={styles.imageWrap}>
                  <Card.Img variant="top" src={`${prefix}/images/sm-icons/Discord_logo.svg`} className={styles.centerWideLogo} alt='Discord' />
                  </div>
                  <Card.Body>
                    <Card.Text className='text-center mt-3'>
                      <a href="https://discord.gg/ballerinalang" className={styles.join} target="_blank" rel="noreferrer" title="Discord">
                        Join our community
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col className={styles.cardCol}>
                <Card className={styles.joinCard}>
                <div className={styles.imageWrap}>
                  <Card.Img variant="top" src={`${prefix}/images/sm-icons/Stack_Overflow_logo.svg`} className={styles.centerWideLogo} alt='Stackoverflow' />
                 </div>
                  <Card.Body>
                    <Card.Text className='text-center mt-3'>
                      <a href="https://stackoverflow.com/questions/tagged/ballerina" className={styles.join} target="_blank" rel="noreferrer" title="Stackoverflow">
                        Join our community
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col className={styles.cardCol}>
                <Card className={styles.joinCard}>
                <div className={styles.imageWrap}>
                  <Card.Img variant="top" src={`${prefix}/images/sm-icons/github-black.svg`} className={styles.centerLogo} alt='GitHub' />
                  </div>
                  <Card.Body>
                    <Card.Text className='text-center mt-3'>
                      <a href="https://github.com/ballerina-platform" className={styles.join} target="_blank" rel="noreferrer" title="GitHub">
                        Join our community
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col className={styles.cardCol}>
                <Card className={styles.joinCard}>
                <div className={styles.imageWrap}>
                  <Card.Img variant="top" src={`${prefix}/images/sm-icons/twitter-x-black.png`} className={styles.centerLogo} alt='X' />
                  </div>
                  <Card.Body>
                    <Card.Text className='text-center mt-3'>
                      <a href="https://twitter.com/ballerinalang" className={styles.join} target="_blank" rel="noreferrer" title="X">
                        Join our community
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* ))} */}
            </Row>

            <Row xs={1} md={4} className="g-6 justify-content-center mt-5">
              {/* {Array.from({ length: 3 }).map((_, idx) => ( */}
              <Col className={styles.cardCol}>
                <Card className={styles.joinCard}>
                <div className={styles.imageWrap}>
                  <Card.Img variant="top" src={`${prefix}/images/sm-icons/LI-Logo.png`} className={styles.centerExtraWideLogo} alt='LinkedIn' />
                  </div>
                  <Card.Body>
                    <Card.Text className='text-center mt-3'>
                      <a href="https://www.linkedin.com/showcase/ballerinalang/" className={styles.join} target="_blank" rel="noreferrer" title="LinkedIn">
                        Join our community
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col className={styles.cardCol}>
                <Card className={styles.joinCard}>
                <div className={styles.imageWrap}>
                  <Card.Img variant="top" src={`${prefix}/images/sm-icons/yt_logo_rgb_light.png`} className={styles.centerExtraWideLogo} alt='YouTube' />
                  </div>
                  <Card.Body>
                    <Card.Text className='text-center mt-3'>
                      <a href="https://www.youtube.com/c/Ballerinalang?reload=9" className={styles.join} target="_blank" rel="noreferrer" title="YouTube">
                        Join our community
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>

              <Col className={styles.cardCol}>
                <Card className={styles.joinCard}>
                  <div className={styles.imageWrap}>
                  <Card.Img variant="top" src={`${prefix}/images/sm-icons/meetup-color.svg`} className={styles.centerLogo} alt='Meetup' />
                  </div>
                  <Card.Body>
                    <Card.Text className='text-center mt-3'>
                      <a href="https://www.meetup.com/ballerinalang-community/" className={styles.join} target="_blank" rel="noreferrer" title="Meetup">
                        Join our community
                      </a>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {/* ))} */}
            </Row>

          </Col>
        </Row>
      </Container>
    </Col>
  );
}
