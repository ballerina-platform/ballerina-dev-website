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

import styles from './Journey.module.css';

export default function Journey(props) {

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='journey-of-a-ballerina-ambassador' className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'journey-of-a-ballerina-ambassador')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Journey of a Ballerina Ambassador
            </h2>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md="auto" className={`text-center ${styles.stepsCol}`}>
            <div className={styles.stepWrap}>
              <h3>Duration</h3>
              <p>Runs for one calendar/academic year. Individuals can reapply to continue in the program.</p>
            </div>

            <img src="/images/down-arrow.svg" alt="Journey" className={styles.downArrow} />

            <div className={styles.stepWrap}>
              <h3>Application process</h3>
              <p>Individuals can submit an application detailing their interest in the program, relevant experience, and ideas for promoting Ballerina.<br />
                The Ballerina DevRel team will reach out to potential developers and invite them to join the program.</p>
            </div>

            <img src="/images/down-arrow.svg" alt="Journey" className={styles.downArrow} />

            <div className={styles.stepWrap}>
              <h3>Onboarding and training</h3>
              <p>Selected ambassadors will undergo an onboarding process, including an introduction to Ballerina and the ambassador program's goals and expectations.<br />
                Training sessions will be provided to equip ambassadors with the necessary skills and knowledge to succeed in their roles.</p>
            </div>

            <img src="/images/down-arrow.svg" alt="Journey" className={styles.downArrow} />

            <div className={styles.stepWrap}>
              <h3>Support and resources</h3>
              <p>Ambassadors will receive ongoing support from the Ballerina team, including access to resources, mentorship, and funding for events.<br />
                Regular check-ins and community meetings will be held to share experiences, challenges, and successes.</p>
            </div>

            <img src="/images/down-arrow.svg" alt="Journey" className={styles.downArrow} />

            <div className={styles.stepWrap}>
              <h3>Evaluation and recognition</h3>
              <p>Ambassadors' contributions will be regularly evaluated based on their engagement, event organization, content creation, and community impact.<br />
                Top performers will be recognized with awards, certificates, and additional benefits.</p>
            </div>

          </Col>

        </Row>

      </Container>
    </Col>
  );
}
