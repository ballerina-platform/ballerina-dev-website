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
import { Row, Col, Container } from 'react-bootstrap';
import dynamic from 'next/dynamic';

export default function Events() {

  const UpcomingEvents = dynamic(() => import('../../common/upcoming-events/UpcomingEvents'), { ssr: false });

  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="events">Events</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <h3>Upcoming events</h3>
          </Col>
        </Row>

        <UpcomingEvents />
      </Container>
    </Col>

  );
}
