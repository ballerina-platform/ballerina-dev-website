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

import { prefix } from '../../../utils/prefix';
import CodeDiagramCard from './CodeDiagramCard';
import styles from './Intro.module.css';


export default function Intro() {

  return (

    <Col sm={12}>
      <Container>

        <Row className={styles.introBottomRow}>
          <Col xs={12} sm={12} md={12} lg={6} className={styles.description}>
            <p className={styles.eyebrow}>Open source · Apache 2.0</p>

            <h1>The programming language for integration and agentic AI</h1>

            <p className={styles.lead}>Integration and agentic applications face the same engineering challenges: unreliable networks, structured data, security, observability, and long-running work. Ballerina makes them first-class in the language, so you build both on the same foundations.</p>

            <div className={styles.btnRow}>
              <a className={`${styles.homeIntroButton} ${styles.primaryButton}`}
                target="_blank"
                href={`${prefix}/downloads/`}
                rel="noreferrer">
                Download <span aria-hidden="true">→</span>
              </a>
              <a className={styles.homeIntroButton}
                target="_blank"
                href={`${prefix}/learn/by-example/`}
                rel="noreferrer">
                See examples
              </a>
            </div>

            <p className={styles.origin}>Developed by <a href="https://wso2.com/" target='_blank' rel="noreferrer" className={styles.introLinks}>WSO2</a> since 2016. First released February 2022.</p>

            <div className={styles.socialMediaPanel} >
              <a className={styles.socialMediaIcons} href="https://github.com/ballerina-platform/ballerina-lang" target="_blank" rel="noreferrer" title="GitHub">
                <i className="bi bi-github"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer" title="X">
                <i className="bi bi-twitter-x"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://discord.gg/ballerinalang" target="_blank" rel="noreferrer" title="Discord">
                <i className="bi bi-discord"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" title="Stackoverflow">
                <i className="bi bi-stack-overflow"></i>
              </a>

              <a className={styles.socialMediaIcons} href="https://www.youtube.com/c/Ballerinalang" target="_blank" rel="noreferrer" title="YouTube">
                <i className="bi bi-youtube"></i>
              </a>

              {/* <a className={styles.socialMediaIcons} href="https://www.linkedin.com/company/79080790" target="_blank" rel="noreferrer"  title="LinkedIn">
                <Image src={`${prefix}/images/sm-icons/linkedin-white.svg`} width={25} height={25} alt="LinkedIn" />
              </a> */}
            </div>
          </Col>

          <Col xs={12} sm={12} md={12} lg={6} className={styles.cardCol}>
            <CodeDiagramCard />
          </Col>
        </Row>


      </Container>
    </Col>

  );
}
