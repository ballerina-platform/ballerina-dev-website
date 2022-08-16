/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Row, Col } from 'react-bootstrap';

import styles from './UpcomingEvents.module.css';

export default function UpcomingEvents() {

  return (
    <>
      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Aug 23, 2022</p>	
          <p className={styles.eventDate}>Tue., 2.30 p.m. PDT</p>	
          <p className="eventLocation">Online</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.meetup.com/grpcio/events/287643293/" rel="noreferrer">	
            <p className="eventName">Meetup</p>	
          </a>
          <h5>Building a gRPC Application in Ballerina</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/dknkuruppu">Danesh Kuruppu</a>, Technical Lead, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.meetup.com/grpcio/events/287643293/" target="_blank" rel="noreferrer">Register</a>
        </Col>
      </Row>

      <Row className={styles.eventRows}>
        <Col sm={12} md={2} className={styles.eventDateContainer}>
          <p className={`${styles.eventDate} ${styles.eventDateNum}`}>Sep 7, 2022</p>	
          <p className={styles.eventDate}>Wed., 4.00 p.m. CDT</p>	
          <p className="eventLocation">Austin, TX</p>
        </Col>
        <Col sm={12} md={7} className={styles.eventDetail} id="eventDetails">
          <a target="_blank" href="https://www.developerweek.com/global/conference/cloud/" rel="noreferrer">	
            <p className="eventName">DeveloperWeek Cloud 2022</p>	
          </a>
          <h5>Ballerina: Programming Language Designed for Cloud-Native Applications</h5>		
          <a target="_blank" rel="noreferrer" href="https://twitter.com/sameerajayasoma">Sameera Jayasoma</a>, Senior Director, WSO2
        </Col>
        <Col sm={12} md={3} className={styles.eventURL}>
          <a className={styles.eventRegistration} href="https://www.developerweek.com/global/conference/cloud/schedule/" target="_blank" rel="noreferrer">More info</a>
        </Col>
      </Row>
    </>

  );
}
