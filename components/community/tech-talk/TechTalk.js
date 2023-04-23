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
import { Row, Col, Modal, Container } from 'react-bootstrap';

import styles from './TechTalk.module.css';
import { prefix } from '../../../utils/prefix';

export default function TechTalk() {

  const [hoverBtn, setHoverBtn] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let linkArrowPath = prefix + '/images/toc-bg.svg';
  let linkArrowHoverPath = prefix + '/images/toc-bg-hover.svg';

  const linkArrow = {
    background: 'url(' + linkArrowPath + ') no-repeat scroll right center',
    paddingRight: '25px'
  }

  const linkArrowHover = {
    background: 'url(' + linkArrowHoverPath + ') no-repeat scroll right center',
    paddingRight: '25px'
  }

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='monthly-tech-talk'>Ballerina Tech Talk</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={6}>
            <p>
              We host a public tech talk, where our engineers discuss different technical topics, show you how Ballerina can be leveraged to implement related use cases, present upcoming features, and answer all your questions live.
            </p>
          </Col>

          <Col sm={12} md={6} lg={6}>
            <p className={styles.linkWrap}
              onMouseEnter={() => {
                setHoverBtn(true);
              }}
              onMouseLeave={() => {
                setHoverBtn(false);
              }}
              style={
                (hoverBtn ? linkArrowHover : linkArrow)
              }>
              <a href={`${prefix}/community/ballerina-tech-talk`} rel="noreferrer" target="_blank" className={styles.viewAll}>View all Tech Talks </a>
            </p>
          </Col>
        </Row>

      </Container>
    </Col>
  );
}
