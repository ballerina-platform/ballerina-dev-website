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
import { Row, Col, Container, Card } from 'react-bootstrap';

import { prefix } from '../../../utils/prefix';
import styles from './Articles.module.css';

export default function Articles(props) {

  return (
    <>
      <Col xs={12}>
        <Container>
          <Row>
            <Col sm={12} className='sectionTitle'>
              <h2 id="ballerina-in-the-news" className='section'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-link-45deg mdButton pe-2"
                  viewBox="0 0 16 16"
                  onClick={(e) => props.getLink(e.target, 'ballerina-in-the-news')}
                >
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                </svg>
                Ballerina in the news
              </h2>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Blog posts</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://bestcodinglanguage.com/for-cloud-computing/">
                      <h4 className="card-title" >Best Programming Languages For Cloud Computing</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Awais Yaseen</span> in Best coding language</p>
                    <p className={styles.date}>Sep 15, 2023</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Blog posts</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://www.hyperlinkinfosystem.com/blog/popular-microservices-frameworks">
                      <h4 className="card-title" >10 Most Popular Microservices Framework</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Harnil Oza</span> in Hyperlink InfoSystem</p>
                    <p className={styles.date}>Sep 14, 2023</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Blog posts</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://levelup.gitconnected.com/10-lesser-known-programming-languages-revolutionizing-the-tech-industry-july-2023-edition-64f356d0df8d">
                      <h4 className="card-title" >10 lesser-known programming languages revolutionizing the tech industry</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Arslan Mirza</span> in Level Up Coding</p>
                    <p className={styles.date}>Jul 4, 2023</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Blog posts</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://www.cmarix.com/blog/best-microservices-frameworks/">
                      <h4 className="card-title" >Top microservices frameworks to build scalable applications</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Parth Patel</span> in Cmarix</p>
                    <p className={styles.date}>June 19, 2023</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>


          </Row>


          <Row>
            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Article</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://www.codelivly.com/lesser-known-programming-languages-worth-exploring/">
                      <h4>8 lesser-known programming languages worth exploring</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Rocky Sah</span> in Codelivly</p>
                    <p className={styles.date}>June 13, 2023</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Blog posts</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://www.tatvasoft.com/blog/top-12-microservices-frameworks/">
                      <h4 className="card-title" >Top 12 microservices frameworks</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Vishal Shah</span> in Tatvasoft</p>
                    <p className={styles.date}>Apr 25, 2023</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Article</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://levelup.gitconnected.com/14-mind-blowing-programming-languages-youve-probably-never-heard-of-b96550980661">
                      <h4 className="card-title" >14 programming languages you&apos;ve probably never heard of</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Clement Brian</span> in Level Up Coding</p>
                    <p className={styles.date}>Apr 12, 2023</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={12} md={12} lg={3} styles={styles.newsCard}>
              <Card className={styles.cardBox}>
                <Card.Body className={styles.cardBody}>
                  {/* <Card.Title className={styles.cardTitle}>Article</Card.Title> */}
                  <Card.Text className={styles.cardText}>
                    <a target="_blank" rel="noreferrer" href="https://camunda.com/blog/2022/09/seven-best-programming-languages-for-microservices/">
                      <h4>7 best programming languages for microservices</h4>
                    </a>
                  </Card.Text>
                  <div>
                    <p className={styles.author}> By <span>Josh Wulf</span> in Camunda</p>
                    <p className={styles.date}>September 29, 2022</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>


        </Container>
      </Col>
    </>
  );
}