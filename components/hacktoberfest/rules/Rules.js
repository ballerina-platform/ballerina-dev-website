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
                fill="currentColor"
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
                    <ol>
                      <li>For all code contributions,
                          <ol type="a">
                              <li>Refer to the Hacktoberfest <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://github.com/orgs/ballerina-platform/projects/362/views/1">project board</a> and pick issues to work on.</li>
                              <li>Once you start on the issue, leave a comment saying you are working on the issue. Then, that issue will be reserved for you.</li>
                              <li>Once ready, submit the PR, address the review comments if there are any, and get it merged.</li>
                              <li>If your PR is merged, submit the <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://forms.gle/EuekCiRMrpqmJE6K6">form</a> with the PR details and other information.</li>
                          </ol>
                      </li>
                      <li>For low-code/no-code contributions,
                          <ol type="a">
                              <li>Any type of written or video content is accepted. E.g., Tutorials, comparisons, introductory content, etc.</li>
                              <li>Publish your content and share the URLs via the <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://forms.gle/EuekCiRMrpqmJE6K6">form</a>.</li>
                          </ol>
                      </li>
                      <li>The deadline to submit the <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://forms.gle/EuekCiRMrpqmJE6K6">form</a> is October 31, 2023, 11:59 PM PST.</li>
                      <li>All the announcements and discussions will be done via Discord. Join our <a target='_blank' rel='noreferrer' className={styles.titleLink} href="https://discord.gg/ballerinalang">Discord</a> in order not to miss any important updates.</li>
                      <li>All decisions made by the Ballerina Hacktoberfest panel shall be deemed final, conclusive, and binding.</li>
                    </ol>
                    </div>
                    <p className={styles.content}>By participating in this competition, you agree to our  <a target='_blank' rel='noreferrer' className={styles.titleLink} href="/hacktoberfest/ballerina-hacktoberfest-2023-terms-and-onditions.pdf">Terms & Conditions</a>.</p>
                  </div>
                </div>
        </Row>
      </Container>
    </Col>
  );
}
