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
import { Row, Col, Container } from 'react-bootstrap';

import styles from './Rewards.module.css';

export default function Rewards(props) {
  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="rewards" className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'rewards')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Rewards
            </h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>
              All participants whose proposals are accepted in Round 1 are eligible for a Ballerina branded T-shirt and a sticker sheet.
            </p>
            <p>
              The winners of this hackathon will receive prizes as mentioned below.
            </p>
          </Col>

        </Row>
        <Row>
          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Cash prizes</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <ul>
                      <li className={styles.customLi}>1st prize: 500 USD</li>
                      <li className={styles.customLi}>2nd prize: 300 USD</li>
                      <li className={styles.customLi}>3rd prize: 200 USD</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Other prizes</h3>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.title}>
                    </p>
                    <p className={styles.content}>In addition, all winners will receive: </p>
                    <ul>
                      <li className={styles.customLi}>Free vouchers for WSO2 practitioner and developer certifications</li>
                      <li className={styles.customLi}><a className={styles.titleLink} href="https://wso2.com/choreo/" target='_blank' rel='noreferrer'>Choreo</a> credits (10 components free for 3 months + $1,000 infrastructure credits)</li>
                      <li className={styles.customLi}>A Ballerina T-shirt</li>
                      <li className={styles.customLi}>A Ballerina branded sticker pack</li>

                    </ul>

                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={4} lg={4} style={{ textAlign: "center", marginTop: "20px" }}>
            <img src="/images/swag.png" alt="Ubuntu" className={styles.swag} />
          </Col>

        </Row>

        <Row>
          <Col xs={12} style={{ marginTop: "30px" }}>
            <p>To participate, please submit this <a className={styles.titleLink} href="https://docs.google.com/forms/d/e/1FAIpQLSf_2lnv9wZwmopnUJSvj3U9uJ0EsCjoDmecJ-1NnjjoYkiqHw/viewform" target='_blank' rel='noreferrer'>form</a> before <b>Friday 27, September 2024, at 23:59 CAT</b>.</p>

            <p style={{ marginBottom: 0 }}>Join the <a className={styles.titleLink} href="https://discord.gg/ballerinalang" target='_blank' rel='noreferrer'>Ballerina Discord</a> server to connect with the Ballerina community.</p>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
