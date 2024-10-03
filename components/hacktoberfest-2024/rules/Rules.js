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

import styles from './Rules.module.css';

export default function Rules(props) {
  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="rules" className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#20b6b0"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'rules')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Rules
            </h2>
          </Col>
        </Row>
        <Row>
          <div>
            <div className={styles.cardDescription}>
              <div className={styles.content}>
                <ul className={styles.customUL}>
                  <li className={styles.customLi}><h5>For Code and connector contributions:</h5>
                    <ul>
                      <li><b>Explore and pick issues:</b> Refer to the Hacktoberfest <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://github.com/orgs/ballerina-platform/projects/376">project board</a> and select an issue to work on.</li>
                      <li><b>Reserve your issue:</b> Once you start working on an issue, leave a comment stating that you&apos;re working on it to reserve it for yourself.</li>
                      <li><b>Submit your work:</b> When your work is ready, submit a pull request (PR). Address any review comments if needed and get your PR merged.</li>
                      <li><b>Submit the form:</b> After your PR is merged, fill out the <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://forms.gle/517ebK579YwmPfRY6">form</a> with the PR details and other relevant information.</li>
                    </ul>
                  </li>
                  <li className={styles.customLi}><h5>For Low-code/No-code contributions:</h5>
                    <ul>
                      <li><b>Create content:</b> We accept any type of written or video content, such as tutorials, comparisons, introductory articles, and more.</li>
                      <li><b>Share your work:</b> Publish your content and submit the URLs via the <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://forms.gle/517ebK579YwmPfRY6">form</a>.</li>
                    </ul>
                  </li>
                  <li className={styles.customLi}><h5>Extra contributions:</h5>
                    <ul>
                      <li><b>Bug reporting credits:</b> Earn 5 extra credits for reporting valid bugs, subject to the panel&apos;s review and approval.</li>
                      <li><b>Ambassador tasks:</b> Complete tasks from the <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://ballerina.io/community/ambassadors/">Ballerina Ambassador Program</a> to earn credits, with final points decided by the panel.</li>
                    </ul>
                  </li>

                  <li className={styles.customLi}><h5>Important details:</h5>
                    <ul>
                      <li><b>Submission deadline:</b> The deadline to submit the <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://forms.gle/517ebK579YwmPfRY6">form</a> is October 31, 2024, at 11:59 PM PST.</li>
                      <li><b>Ask questions on Stack Overflow:</b> Need any technical help? Raise all your questions in <a href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" className={styles.titleLink} title="Stack Overflow">Stack Overflow</a>.</li>
                      <li><b>Stay updated on Discord:</b> All announcements will be held on Discord. Join our <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://discord.gg/ballerinalang">Discord</a> to stay updated on important information.</li>
                      <li><b>Contributor recognition:</b> Extra credits may be granted for exceptional contributions.</li>
                      <li><b>Final decisions:</b> All decisions made by the Ballerina Hacktoberfest panel are final, conclusive, and binding.</li>
                    </ul>
                  </li>

                </ul>
              </div>
              <p className={styles.content}>By participating in this competition, you agree to our <a target='_blank' rel='noreferrer' className={styles.titleLink} href="/hacktoberfest/Hacktoberfest_2024-Terms_and_Conditions.pdf">terms & conditions</a>.</p>
            </div>
          </div>
        </Row>
      </Container>
    </Col>
  );
}
