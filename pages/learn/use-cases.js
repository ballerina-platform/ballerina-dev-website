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

import React from 'react';
import { Row, Col } from 'react-bootstrap';

import Layout from '../../layouts/LayoutLearn';

export default function Learn() {

  return (
    <Layout>
      <Col sm={12}>

        <Row className="pageHeader pageContentRow">
          <Col xs={12}>
            <h1>Use cases</h1>
          </Col>
        </Row>

        <Row className="pageContentRow">
          <Col xs={12} lg={6}>
            <div className='useRow'>
              <h2>HTTP</h2>
              <p><a href="#">Snowpeak Rest API</a></p>
            </div>

            <div className='useRow'>
              <h2>Websocket</h2>
              <p><a href="#">Chat application</a></p>
              <p><a href="#">Taxi management service</a></p>
            </div>

            <div className='useRow'>
              <h2>gRPC</h2>
              <p><a href="#">Route guide</a></p>
              <p><a href="#">Async streaming</a></p>
              <p><a href="#">Online boutique</a></p>
              <p><a href="#">Program analyzer</a></p>
            </div>
          </Col>

          <Col xs={12} lg={6}>
            <div className='useRow'>
              <h2>GraphQL</h2>
              <p><a href="#">Strawers GraphQL API</a></p>
              <p><a href="#">Snowtooth: A fake ski resort</a></p>
            </div>

            <div className='useRow'>
              <h2>Email</h2>
              <p><a href="#">Gmail SMTP client</a></p>
            </div>

            <div className='useRow'>
              <h2>TCP</h2>
              <p><a href="#">Echo Server</a></p>
            </div>

          </Col>
        </Row>

      </Col>
    </Layout>

  );
}
