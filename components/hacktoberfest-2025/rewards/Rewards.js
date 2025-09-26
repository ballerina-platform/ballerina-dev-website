/**
 * Copyright (c) 2025, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
  
  const rewards = [
    {
      title: "Amazon vouchers equivalent to the points you earn. Each point is equal to US$1.",
      image: "/images/Graphics_amazon-voucher.svg"
    },
    {
      title: "A goodie pack with exclusive Ballerina-branded swag.",
      image: "/images/Graphics_goodie-pack.svg"
    },
    {
      title: "Free vouchers for WSO2 Practitioner and Developer certifications.",
      image: "/images/Graphics_certification-vouchers.svg"
    },
    {
      title: "US$1,000 worth of credits for WSO2 cloud products — Choreo, Asgardeo, Devant, and Bijira.",
      image: "/images/Graphics_wso2-credits.svg"
    }
  ];

  return (
    <Col sm={12}>
      <Container className={styles.rewardsContainer}>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="what-do-i-get" className='section'>
              What do I get?
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#20b6b0"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'what-do-i-get')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
            </h2>
          </Col>
        </Row>

        <Row>
          <Col xs={12} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <div className={styles.cardDescription}>
                  <div className={styles.content}>
                    <p className={styles.msg}>The contributors who make the most significant contributions to Ballerina during Hacktoberfest will be rewarded with the following prizes:</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row xs={1} md={4} className="g-4">
      {rewards.map((reward, idx) => (
        <Col key={idx}>
          <Card className={styles.rewardCard}>
            <Card.Img variant="top" src={reward.image} />
            <Card.Body>
              {/* <Card.Title>Card title</Card.Title> */}
              <Card.Text>
                {reward.title}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

      </Container>
    </Col>
  );
}
