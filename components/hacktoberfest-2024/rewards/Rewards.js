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

import styles from './Rewards.module.css';

export default function Rewards(props) {

  const swags = ["Bag", "Bottles", "Earbuds", "Hat", "Hoodie", "Long-M", "Shirt", "Tote", "Tumbler"];

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
                fill="#20b6b0"
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

          <Col xs={12} md={6} lg={4} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.msg}>The contributors who make the most significant contributions to Ballerina during Hacktoberfest will be rewarded with the following prizes:</p>
                    <ul>
                      <li className={styles.customLi}>Redeem your points to purchase exclusive Ballerina-branded items from the <a className={styles.titleLink} target="_blank" rel="noreferrer" href="https://store.covver.io/wso2/collections/ballerina-swag-store">swag store</a></li>
                      <li className={styles.customLi}>Free vouchers for WSO2 <a className={styles.titleLink} target="_blank" rel="noreferrer" href="https://wso2.com/training/certification/">practitioner and developer certifications</a></li>
                      <li className={styles.customLi}><a className={styles.titleLink} target="_blank" rel="noreferrer" href="https://wso2.com/choreo/">Choreo</a> credits (10 components for free for 3 months + $1,000 infrastructure credits)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} md={6} lg={8} style={{ textAlign: "center", marginTop: "20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <Row xs={1} sm={2} md={2} lg={5} className="g-4 align-items-stretch">
              {swags.map((_, idx) => (
                <Col key={idx} style={{ height: "fit-content", display: "flex" }}>
                  <Card className={`${styles.cutomCard} flex-grow-1`}>
                    <Card.Img variant="top" src={`/images/hacktoberfest/swags-2024/${_}.jpeg`} />
                  </Card>
                </Col>
              ))}

              <Col style={{ display: "flex" }}>
                <a href="https://store.covver.io/wso2/collections/ballerina-swag-store" target="_blank" rel="noreferrer" className={styles.storeLink}>
                  <Card className={`${styles.cutomCard} flex-grow-1`}>
                    <Card.Body className={`${styles.store} d-flex flex-column`}>
                      <p className={styles.msg}>Visit store</p>
                      <img
                        src="/images/arrow-right-white.svg"
                        alt="swags"
                        className={`${styles.swag} flex-grow-1`}
                      />
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
