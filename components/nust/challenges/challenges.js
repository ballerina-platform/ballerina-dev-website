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

import styles from './Challenges.module.css';

export default function Intro(props) {

  return (

    <Col xs={12} style={{ zIndex: 1 }}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="how-to-contribute" className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'how-to-contribute')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              How to contribute?
            </h2>
          </Col>
        </Row>
        <Row>
          <div>
            <p className={styles.introText2}>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSf_2lnv9wZwmopnUJSvj3U9uJ0EsCjoDmecJ-1NnjjoYkiqHw/viewform" target='_blank' rel='noreferrer'>Register your team</a> today to build an innovative solution using Ballerina and share it as a GitHub project.
              Highlight the impact of your work with a blog or social media post and unlock extra rewards!
            </p>
          </div>
        </Row>

        <Row>
          <Col xs={12} className={styles.boxCol}>
            <div className={`${styles.cardWrapper} ${styles.hBox}`}>
              <div>
                <div className={styles.cardDescription}>

                  <h3>Round 1: Proposal Submission and Acceptance</h3>


                  <p>Proposal submission deadline: <b>Friday, 27 September 2024 (23:59 CAT)</b>
                    <br />
                    Announcement of accepted proposals: <b>Thursday, 3 October 2024</b></p>


                  <h3>Round 2: Final Implementation and Demo Submission</h3>


                  <p>Participants must submit their final implementations using the Ballerina language, along with a 15-minute demo on <b>Monday, 7 October 2024</b></p>


                  <p style={{marginBottom:0}}>Winners will be announced on <b>Tuesday, 15 October 2024</b></p>

                </div>
              </div>
            </div>
          </Col>

        </Row>

        <Row>
          <Col xs={12} md={6} lg={6} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Guidelines for the proposals:</h3>
                <div className={styles.cardDescription}>
                  <ul>
                    <li className={styles.customLi}>Project proposals that demonstrate strong relevance to actual problems and align with the shared interests of the university or the country are better suited.</li>
                    <li className={styles.customLi}>WSO2, in collaboration with NUST members, will evaluate the proposals and communicate the acceptance to the participants.</li>
                    <li className={styles.customLi}>Once the idea is accepted, participants will be required to implement it.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={6} lg={6} className={styles.boxCol}>
            <div className={styles.cardWrapper}>
              <div>
                <h3>Example technical areas to focus on (but not limited to):</h3>
                <div className={styles.cardDescription}>
                  <ul>
                    <li className={styles.customLi}><b>API Integration Challenge:</b><br /> Participants can choose an existing APIs (e.g., weather data, social media, university LMS) and demonstrate how they can integrate it into a useful application using Ballerina.</li>
                    <li className={styles.customLi}><b>Microservices Orchestration:</b><br /> Participants can present scenarios where they need to orchestrate multiple microservices with Ballerina, showcasing its capabilities in a distributed system.</li>
                    <li className={styles.customLi}><b>Legacy System Integration:</b><br /> Participants can bring a legacy system and modernize and integrate it with newer technologies/applications to solve a real integration problem using Ballerina.</li>
                    <li className={styles.customLi}><b>Event-Driven Integration:</b><br /> Participants can propose a scenario of event-driven integration where they integrate different systems based on real-time events.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>
       </Container>
    </Col>

  );
}
