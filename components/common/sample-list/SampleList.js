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
import { Row, Col, Container, Card, Badge } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import styles from './SampleList.module.css';
import { prefix } from '../../../utils/prefix';


export default function SampleList(props) {
  const href = props.name.replace(/\s+/g, '-').toLowerCase();
  return (
    <>
      {/* <Container> */}
      {/* <Row className="pageContentRow learnRow llanding">
        <Col xs={12} md={12}>
          <h2 id="learn-the-platform" className='section'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              className="bi bi-link-45deg mdButton pe-2"
              viewBox="0 0 16 16"
              onClick={(e) => props.getLink(e.target, 'learn-the-platform')}
            >
              <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
            </svg>
            Learn the platform
          </h2>
        </Col>
      </Row> */}
      {/* <Container className=" text-center">
  <Row className="gy-5 gx-5">
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
    <Col xs={6} style={{border:"1px solid #000000"}}>
      <div className="p-3">Custom column padding</div>
    </Col>
  </Row>
</Container> */}
      <Row className="pageContentRow llanding" >
        <Col xs={12}>
          <Container>
            <Row>
              <Col xs={12}>


                {/* <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="/images/home-page/icons/cloud-native.svg" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        Go somewhere
      </Card.Body>
    </Card> */}

                <Card className="mb-3">
                  <Row className="g-0 align-items-center">
                    <Col md={2} className='text-center'>
                      <Card.Img src="/images/home-page/icons/cloud-native.svg" className="rounded-start" alt="..." height={100} width={100} />
                    </Col>
                    <Col md={10}>
                      <Card.Body>
                        <a href={href}>
                          <h5 className="card-title">{props.name}</h5>
                        </a>
                        <p className="card-text">{props.description}</p>
                        <p className="card-text text-body-secondary" gap={2}>
                          {props.tags.map((tag) => (<Badge className={styles.tag}>{tag}</Badge>))}
                        </p>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>

              </Col>
            </Row>
          </Container>
        </Col>
      </Row>



      {/* </Container> */}

    </>
  );
}