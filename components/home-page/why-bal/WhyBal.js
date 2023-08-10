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
              <Image src={`${prefix}/images/home-page/icons/cloud-native.svg`} width={100} height={100} alt="cloud-native" />
              <h3>Native integration DNA</h3>
              <p>Ballerina is not just another programming language; it’s a language born for integration. With constructs designed for network communication and data manipulation, Ballerina speaks the language of integration natively.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/cloud-native/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/flexible-typing.svg`} width={100} height={100} alt="flexible-typing" />
              <h3>Built-in Support for Diverse Transports and Data Formats</h3>
              <p>Diverse integration landscapes require flexibility. Ballerina inherently understands and supports a wide range of transports from HTTP, and gRPC, to WebSockets and data formats like JSON, XML, and CSV, enabling truly seamless integration without external libraries.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/flexibly-typed/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/data-transformation.svg`} width={100} height={100} alt="data-transformation" />
              <h3>Seamless Connectivity with Rich Ecosystem</h3>
              <p>Why reinvent the wheel? Ballerina boasts a rich ecosystem of connectors, allowing you to integrate with countless databases, cloud services, and enterprise applications out of the box.</p>
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
              <Image src={`${prefix}/images/home-page/icons/graphical.svg`} width={100} height={100} alt="graphical" />
              <h3>Robust Error Handling for Integration Scenarios</h3>
              <p>Ballerina recognizes that network-bound integration can be unpredictable. Its resilient error handling ensures your applications remain robust, even when faced with unexpected integration challenges.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/graphical/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/concurrent.svg`} width={90} height={100} alt="concurrent" />
              <h3>End-to-End Type Safety</h3>
              <p>Ballerina's strong type system minimizes runtime surprises. From data mapping to network-bound communications, type safety ensures reliability in your integrations.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/concurrent/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/reliable-maintainable.svg`} width={80} height={100} alt="reliable-maintainable" />
              <h3>Graphical and Code Views with Ballerina VSCode extension</h3>
              <p>Visualize as you code. The Ballerina Composer lets developers switch between graphical and source views, making complex integration logic more intuitive and accessible.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/reliable-maintainable/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className={styles.whyBallerinaRow}>
          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/cloud-native.svg`} width={100} height={100} alt="cloud-native" />
              <h3>Maintainable Code for Ever-evolving Enterprises</h3>
              <p>Integration solutions should stand the test of time. Ballerina emphasizes clarity and simplicity, ensuring that enterprise integrations are not just written once but are easily read, updated, and maintained by teams across the lifecycle.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/cloud-native/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>


          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/flexible-typing.svg`} width={100} height={100} alt="flexible-typing" />
              <h3>Open Source and Community-Driven</h3>
              <p>Being open source, Ballerina empowers a vast community of developers and experts. This means continuous improvements, a plethora of resources, and a supportive network for all your integration endeavors.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/flexibly-typed/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>

          <Col sm={12} md={4}>
            <div className={styles.whyBallerinaBox}>
              <Image src={`${prefix}/images/home-page/icons/data-transformation.svg`} width={100} height={100} alt="data-transformation" />
              <h3>Lightweight and Performant Runtime with GraalVM Native Image Support</h3>
              <p>Enterprise integration demands speed and efficiency. Ballerina’s compatibility with GraalVM native images ensures rapid startup times, reduced resource consumption, and optimal performance, even in large-scale, resource-intensive scenarios.</p>
              <ul className={styles.inlineLinkList}>
                <li className={styles.greenLinkArrow} style={linkStyle}>
                  <Link href={`/why-ballerina/data-oriented/`}>More info</Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
