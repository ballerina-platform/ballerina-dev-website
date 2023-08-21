/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import Image from 'next-image-export-optimizer';
import Link from 'next/link';

import { prefix } from '../../../utils/prefix';
import styles from './WhyBal.module.css';

export default function WhyBal(props) {

  let imagePath = prefix + '/images/toc-bg.svg';

  const linkStyle = {
    backgroundImage: 'url(' + imagePath + ')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left center'
  };

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="why-ballerina" className='section'>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'why-ballerina')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Why Ballerina
            </h2>
          </Col>
        </Row>
        <Row className={styles.whyBallerinaRow}>
          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/cloud-native.svg`} width={126} height={100} alt="cloud-native" />
              <h3>Cloud native</h3>
              <p>Network primitives in the language make it simpler to write services and run them in the cloud.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/cloud-native/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/flexible-typing.svg`} width={151} height={100} alt="flexible-typing" />
              <h3>Flexibly typed</h3>
              <p>Structural types with support for openness are used both for static typing within a program and for
                describing service interfaces.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/flexibly-typed/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/data-transformation.svg`} width={142} height={100} alt="data-transformation" />
              <h3>Data oriented</h3>
              <p>Type-safe, declarative processing of JSON, XML, and tabular data with language-integrated queries.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/data-oriented/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>



        <Row className={styles.whyBallerinaRow}>
          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/graphical.svg`} width={135} height={100} alt="graphical" />
              <h3>Graphical</h3>
              <p>Programs have both a textual syntax and an equivalent graphical form based on sequence diagrams.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/graphical/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/concurrent.svg`} width={108} height={100} alt="concurrent" />
              <h3>Concurrent</h3>
              <p>Easy and efficient  concurrency with sequence diagrams and language-managed threads without the complexity of asynchronous functions.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/concurrent/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/reliable-maintainable.svg`} width={100} height={100} alt="reliable-maintainable" />
              <h3>Reliable, maintainable</h3>
              <p>Explicit error handling, static types, and concurrency safety, combined with a  familiar, readable syntax make programs reliable and maintainable.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/reliable-maintainable/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}