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


export default function SubMenu() {

  return (
    <Col xs={12}>
      <Container fluid>
        <Row>
          <Col xs={12} className='communitySubRow'>
            <ul className="nav navbar-nav secondary-nav">
                 <li className="active"><a href="#subscribe-to-our-newsletter">Newsletter</a></li>
                 <li><a href="#events">Events</a></li>
                 <li><a href="#resources">Resources</a></li>
                 <li><a href="#ballerina-discord-community">Discord</a></li>
                 <li><a href="#monthly-tech-talk">Tech Talk</a></li>
                 <li><a href="#get-involved">Get involved</a></li>
                 <li><a href="#contact-us">Contact us</a></li>
               </ul>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
