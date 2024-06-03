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
import { Container, Row, Stack, Col } from 'react-bootstrap';
import Link from 'next/link';

import styles from './Footer.module.css';

export default function Footer() {

  return (
    <Stack gap={0} className={styles.stack}>
      <Container className={styles.footer}>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Row>
              <Col xs={12} sm={12} md={12} lg={6}>
                <div className={styles.socialMedia}>
                  <div className={styles.smIcons}>
                    <ul>
                      <li>
                        <a className={styles.footerLinkSM} href="https://github.com/ballerina-platform" target="_blank" rel="noreferrer" title="GitHub">
                          <i className="bi bi-github"></i>
                        </a>
                      </li>
                      <li>
                        <a className={styles.footerLinkSM} href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer" title="X">
                          <i className="bi bi-twitter-x"></i>
                        </a>
                      </li>
                      <li>
                        <a className={styles.footerLinkSM} href="https://discord.gg/ballerinalang" target="_blank" rel="noreferrer" title="Discord">
                          <i className="bi bi-discord"></i>
                        </a>
                      </li>
                      <li>
                        <a className={styles.footerLinkSM} href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" title="Stackoverflow">
                          <i className="bi bi-stack-overflow"></i>
                        </a>
                      </li>
                      <li>
                        <a className={styles.footerLinkSM} href="https://www.youtube.com/c/Ballerinalang" target="_blank" rel="noreferrer" title="YouTube">
                          <i className="bi bi-youtube"></i>
                        </a>
                      </li>
                      <li>
                        <a className={styles.footerLinkSM} href="https://www.linkedin.com/showcase/ballerinalang/" target="_blank" rel="noreferrer" title="LinkedIn">
                          <i className="bi bi-linkedin"></i>
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>



                <div className={styles.footerLinks}>
                  <ul>
                    <li><Link className="footerLink" href={`/downloads`}>DOWNLOAD</Link></li>
                    <li><a className="footerLink" target='_blank' rel="noreferrer" href="https://github.com/ballerina-platform/ballerina-lang/issues/new/choose">REPORT ISSUES</a></li>
                  </ul>
                </div>

              </Col>
              <Col xs={12} sm={12} md={12} lg={6}>
                <div className={styles.subscription}>
                  <div className={styles.subscribe}>
                    <Link className={styles.subscribeBtn} href={`/community/#subscribe-to-our-newsletter`}>Subscribe to our newsletter</Link>
                  </div>
                  <div className={styles.subscribe}>
                    <a className={styles.subRss} href="https://blog.ballerina.io/feed.xml" target="_blank" rel="noreferrer">Subscribe via RSS</a>
                  </div>
                </div>

              </Col>
            </Row>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6} className={styles.inspire}>
            <p>In the creation of Ballerina, we were inspired by many technologies. Thank you to all that have come before us (and forgive us if we missed one): Java, Go, C, C++, D, Rust, Haskell, Kotlin, Dart, TypeScript, JavaScript, Python, Perl, Flow, Swift, Elm, RelaxNG, NPM, Crates, Maven, Gradle, Kubernetes, Docker, Envoy, Markdown, GitHub, and WSO2.</p>
          </Col>
        </Row>

        <Row className={styles.policyLinks}>
          <Col xs={12} sm={2}>
            <span className="footerLink">© 2023 WSO2 LLC</span>
          </Col>
          <Col xs={12} sm={10}>
            <ul>
              <li><a className="footerLink" target='_blank' rel="noreferrer" href="https://github.com/ballerina-lang/ballerina/blob/master/LICENSE">CODE LICENSE</a></li>
              <li><Link className="footerLink" href={`/license-of-site`}>SITE LICENSE</Link></li>
              <li><Link className="footerLink" href={`/terms-of-service`}>TERMS OF SERVICE</Link></li>
              <li><Link className="footerLink" href={`/privacy-policy`}>PRIVACY POLICY</Link></li>
              <li><Link className="footerLink" href={`/cookie-policy`}>COOKIE POLICY</Link></li>
              <li><Link className="footerLink" href={`/security-policy`}>SECURITY POLICY</Link></li>
              <li><Link className="footerLink" href={`/trademark-usage-policy/`}>TRADEMARK USAGE POLICY</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Stack>
  );
}