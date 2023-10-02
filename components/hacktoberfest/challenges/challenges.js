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

import styles from './Challenges.module.css';

export default function Intro(props) {

    return (
        <>
        <Col xs={12}>
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
              <p className={styles.introText2}>We have prepared several categories of open issues that are ideal for first-time developers and low-code/no-code contributors. They fall into the following categories:</p>
            </div>
          </Row>

          <Row>
              <Col xs={12} md={6} lg={6} className={styles.boxCol}>
                  <div className={styles.cardWrapper}>
                    <div>
                      <h3>Code contributions</h3>
                      <div className={styles.cardDescription}>
                          <p className={styles.content}>If you&apos;re up for a coding challenge. Take on tasks labeled with <code className="highlighter-rouge language-plaintext">Hacktoberfest<span aria-hidden="true" className="line-numbers-rows"><span></span></span></code> from our <a className={styles.titleLink} target='_blank' rel='noreferrer' href="https://github.com/orgs/ballerina-platform/projects/362/views/1">Ballerina Hacktoberfest 2023 project</a>.</p>
                          <p className={styles.content}>Refer to the <a className={styles.titleLink} target='_blank' rel='noreferrer' href='https://github.com/ballerina-platform/ballerina-release/blob/master/CONTRIBUTING.md'>contributing guide</a> to get started, and leave a comment on the issue when you start working on it.</p>
                      </div>
                    </div>
                  </div>
              </Col>
              <Col xs={12} md={6} lg={6} className={styles.boxCol}>
                  <div className={styles.cardWrapper}>
                    <div>
                      <h3>Low/No Code contributions</h3>
                      <div className={styles.cardDescription}>
                          <p className={styles.content}>
                            Are you a content creator? Do you love sharing your knowledge and helping others learn? This is your chance to shine! 
                          </p>
                          <p className={styles.content}>
                          Create informative and engaging videos(tutorials, introductory or comparison videos) or written content (articles/blogs) about Ballerina.
                          </p>
                          <p className={styles.content}>
                          Whether you&apos;re a seasoned expert or just getting started, your insights can make a difference in someone else&apos;s journey. Plus, you&apos;ll be helping more developers adopt Ballerina.
                          </p>
                      </div>
                    </div>
                  </div>
              </Col>
            </Row>

            <Row>
              <p className={styles.introText2}>Join the <a className={styles.titleLink} target='_blank' rel='noreferrer' href='https://discord.gg/ballerinalang'>Ballerina Discord</a> server to connect with the Ballerina community.</p>
            </Row>

            </Container>
            </Col>
        </>
    );
}
