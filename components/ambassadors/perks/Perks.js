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
                  <Card.Img src={`${prefix}/images/ambassadors/exclusive-learning-opportunities.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title"> Exclusive learning opportunities</h3>

                    <p className="card-text">Get access to exclusive learning resources and mentorship.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3 ${styles.cutomCard}`}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/ambassadors/professional-development.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Professional development</h3>

                    <p className="card-text">Enhance your skills in public speaking, writing, and leading open-source projects.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>


          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3 ${styles.cutomCard}`}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/ambassadors/rewards-and-recognition.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Rewards and recognition</h3>

                    <p className="card-text">Earn recognition with certificates, badges, and more exclusive rewards.</p>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 6 }} className={styles.card}>
            <Card className={`mb-3 ${styles.cutomCard}`}>
              <Row className="g-0 align-items-center">
                <Col md={2} className='text-center'>
                  <Card.Img src={`${prefix}/images/ambassadors/community-influence.svg`} className={`${styles.icon} pt-3 pt-sm-0`} alt={`${props.name} icon`} height={100} width={100} />
                </Col>
                <Col md={10}>
                  <Card.Body>

                    <h3 className="card-title">Community Influence</h3>

                    <p className="card-text">Create content and organize events to inspire and engage your local developer community.</p>
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
