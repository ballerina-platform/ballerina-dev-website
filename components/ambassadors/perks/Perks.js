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

import styles from './Perks.module.css';

export default function Perks(props) {

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='perks-of-becoming-an-ambassador' className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'perks-of-becoming-an-ambassador')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Perks of becoming an Ambassador
            </h2>
          </Col>
        </Row>

        <Row>
          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3 ${styles.cutomCard}`}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/guest-lectures-and-talks.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title"> Exclusive learning opportunities</h3>

                    <ul className={styles.customUl}>
                      <li className={styles.customLi}>Free vouchers for WSO2 certifications.</li>
                      <li className={styles.customLi}>One-on-one mentorship with seasoned Ballerina developers.</li>
                    </ul>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3 ${styles.cutomCard}`}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/workshops-and-training-sessions.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Professional development</h3>

                    <ul className={styles.customUl}>
                      <li className={styles.customLi}>Opportunity to enhance skills in public speaking, technical writing, and community management.</li>
                      <li className={styles.customLi}>Leadership opportunities in open-source projects within the Ballerina community.</li>
                    </ul>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>


          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3 ${styles.cutomCard}`}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/hackathons-and-coding-challenges.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Rewards and recognition</h3>

                    <ul className={styles.customUl}>
                      <li className={styles.customLi}>Recognition of the role as an ambassador with exclusive certificates and digital badges.</li>
                      <li className={styles.customLi}>Public acknowledgment on Ballerina Social Media and Community channels.</li>
                      <li className={styles.customLi}>Free <a className={styles.textLink} href="https://wso2.com/choreo/" target='_blank' rel='noreferrer'>Choreo</a> credits.</li>
                      <li className={styles.customLi}>Exclusive Ballerina and WSO2 branded swags.</li>
                    </ul>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3 ${styles.cutomCard}`}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/research-collaborations.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Community Influence</h3>

                    <ul className={styles.customUl}>
                      <li className={styles.customLi}>Opportunities to create and share content (blogs, tutorials, videos) about Ballerina, with the potential to be featured on official Ballerina channels.</li>
                      <li className={styles.customLi}>Support for organizing and hosting Ballerina-related events for their local communities/universities.</li>
                    </ul>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>



        </Row>

      </Container>
    </Col>
  );
}
