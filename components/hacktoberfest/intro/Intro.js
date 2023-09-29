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
import { BsCheck } from 'react-icons/bs';

import { prefix } from '../../../utils/prefix';
import styles from './Intro.module.css';


export default function Intro() {

  const [hoverBtn, setHoverBtn] = React.useState(false);

  let imagePath = prefix + '/images/main-right-arrow-home.svg';
  let imagePathHover = prefix + '/images/main-right-arrow-home-hover.svg';

  const buttonStyle = {
    backgroundImage: 'url(' + imagePath + ')',
    backgroundSize: '60px 60px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
  };

  const buttonStyleHover = {
    backgroundImage: 'url(' + imagePathHover + ')',
    backgroundSize: '60px 60px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right center',
  };

  return (

    <Col sm={12}>
      <Container>
        
        <Row className={styles.introBottomRow}>
          <Col xs={12} sm={12} md={12} lg={8} className={styles.description}>
          <h1>Hacktoberfest 2023</h1>

          <p className={styles.desItem}><span>We&apos;re thrilled to have you on board for Hacktoberfest and have some fantastic opportunities lined up for you. See the many ways you can support the open source community and contribute to Ballerina.</span></p>
          </Col>
          <Col xs={12} sm={12} md={12} lg={4} className={styles.description}>
          <Col xs={12} lg={7} className={styles.introImg}>
                  <a href="https://hacktoberfest.com/" target='_blank' rel="noreferrer"><img src={`${prefix}/images/hacktoberfest/hacktoberfest-logo.png`} width={340} alt="Hacktoberfest" title="Ballerina Central" /></a>
                </Col>
          </Col>
        </Row>

       
      </Container>
    </Col>

  );
}
