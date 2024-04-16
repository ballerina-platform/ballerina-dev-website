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

import { prefix } from '../../../utils/prefix';
import styles from './Users.module.css';

export default function Users(props) {
  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="users" className='section'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => props.getLink(e.target, 'users')}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              Who uses Ballerina?
            </h2>
          </Col>
        </Row>

        <Row>
          <Col sm={18} md={12} className={styles.logo}>
              <a href={`${prefix}/case-studies/wso2`}><img src={`${prefix}/images/home-page/user-logos/wso2.svg`} width={280} alt="WSO2" title="WSO2" /></a>
              <a href="https://choreo.dev/" target='_blank' rel="noreferrer"><img src={`${prefix}/images/home-page/user-logos/choreo.svg`} width={280} alt="Choreo" title="Choreo" /></a>
              <a href={`${prefix}/case-studies/fat-tuesday`}><img src={`${prefix}/images/home-page/user-logos/fat-tuesday.svg`}  width={150} alt="Fat Tuesday" title="Fat Tuesday" /></a>
              <a href={`${prefix}/case-studies/mosip`}><img src={`${prefix}/images/home-page/user-logos/mosip.png`}  width={280} alt="MOSIP" title="MOSIP" /></a>
              <a href={`${prefix}/case-studies/qhana`}><img src={`${prefix}/images/home-page/user-logos/qhana.png`}  width={200} alt="QHAna - The Quantum Humanities Analysis Tool" title="QHAna - The Quantum Humanities Analysis Tool" /></a>

          </Col>
        </Row>
        <Row>
          <Col sm={18} md={12} className={styles.logo}>
              <a href={`${prefix}/case-studies/ballerina-central`}><img src={`${prefix}/images/home-page/user-logos/ballerina-central.svg`} width={340} alt="Ballerina Central" title="Ballerina Central" /></a>
              <a href={`${prefix}/case-studies/redcross-elixir`}><img src={`${prefix}/images/home-page/user-logos/redcross-elixir.png`} width={280} alt="Redcross Elixir" title="Redcross Elixir" /></a>
              <a href={`${prefix}/case-studies/raapid-ai`}><img src={`${prefix}/images/home-page/user-logos/raapid-ai.png`} width={320} alt="RAAPID" title="RAAPID" /></a>
          </Col>
        </Row>
        <Row>
          <Col sm={18} md={12} className={styles.logo}>
              <a href="https://techventuras.com/" target='_blank' rel="noreferrer"><img src={`${prefix}/images/home-page/user-logos/tech-venturas.png`} width={300} alt="Tech Venturas" title="Tech Venturas" /></a>
              <a href={`${prefix}/case-studies/avinya-foundation`}><img src={`${prefix}/images/home-page/user-logos/avinya-foundation.webp`}  width={280} alt="Avinya Foundation" title="Avinya Foundation" /></a>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
