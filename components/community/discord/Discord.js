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

import styles from './Discord.module.css';
import { prefix } from '../../../utils/prefix';

export default function Discord() {

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='ballerina-discord-community' className={styles.discord}>Ballerina Discord community</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={6}>
            <p>
              Our 1000+ Discord community includes experienced Ballerina engineers and experts from some of the world&apos;s top companies. Use this space to find answers to your questions, get support or learn how others are using Ballerina.
            </p>
            
            <p className={styles.member}>
              Join the <a href="https://discord.gg/ballerinalang" target="_blank" rel="noreferrer" passHref>Discord community</a>
            </p>
          </Col>


          <Col sm={12} md={6} lg={6}>
            <Row className={styles.slackCount}>
              <Col sm={12} md={6} lg={6}>
                <p className={styles.slackNum}>1000+</p>
                <p className={styles.slackFoot}>Discord members</p>
              </Col>
              <Col sm={12} md={6} lg={6} className="discordImage">
                <Image src={`${prefix}/images/discord-community.svg`} width={132} height={92} alt="Slack Community" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
