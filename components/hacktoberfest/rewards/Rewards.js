/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
          <p className={styles.title}>
          We will carefully evaluate all your contributions during Hacktoberfest, and you&apos;ll be rewarded accordingly. You will not only gain recognition for your work but also contribute to the growth and improvement of Ballerina.
          </p>
        </Row>
        <Row>
          <Col xs={12} md={6} lg={6} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Code contributions</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.content}>Any accepted PR fixing a Hacktoberfest Issue will receive; </p>
                        <ul>
                          <li>A $25 Amazon voucher</li>
                          <li>A Ballerina branded sticker pack</li>
                          <li>Free vouchers for WSO2 <a className={styles.titleLink} target="_blank" rel="noreferrer" href="https://wso2.com/training/certification/">practitioner and developer certifications</a></li>
                          <li><a className={styles.titleLink} target="_blank" rel="noreferrer" href="https://wso2.com/choreo/">Choreo</a> credits (10 components for free for 3 months + $1,000 infrastructure credits)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
          </Col>
          <Col xs={12} md={6} lg={6} className={styles.boxCol}>
                <div className={styles.cardWrapper}>
                  <div>
                    <h3>Low/No Code contributions</h3>
                    <div className={styles.cardDescription}>
                      <div className={styles.content}>
                        <p className={styles.title}>
                        </p>
                        <p className={styles.content}>The top 3 contributions will receive Amazon vouchers, valued at:</p>
                        <ul>
                          <li>1st Place : $300</li>
                          <li>2nd Place : $200</li>
                          <li>3rd Place : $100</li>
                        </ul>
                        <p>6 more winners will get Amazon vouchers valued at $50 USD.</p>
                        <p>Additionally, all of the above will receive:</p>
                        <ul>
                          <li>A Ballerina T-shirt</li>
                          <li>A Ballerina branded sticker pack</li>
                          <li>Free vouchers for WSO2 <a className={styles.titleLink} target="_blank" rel="noreferrer" href="https://wso2.com/training/certification/">practitioner and developer certifications</a></li>
                          <li><a className={styles.titleLink} target="_blank" rel="noreferrer" href="https://wso2.com/choreo/">Choreo</a> credits (10 components for free for 3 months + $1,000 infrastructure credits)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
          </Col>
        
        </Row>
      </Container>
    </Col>
  );
}
