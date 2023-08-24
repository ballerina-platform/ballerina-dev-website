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
      
      {/* <Row className="pageContentRow llanding" >
        <Col xs={12}>
          <Container> */}
            <Row>
              <Col xs={12}>

                <Card className={`${styles.card} mb-3`}>
                  <Row className="g-0 align-items-center">
                    <Col md={2} className='text-center'>
                      <Card.Img src={`${prefix}/images/pre-built/${href}.png`} className={styles.icon} alt={`${props.name} icon`} height={200} width={100} />
                    </Col>
                    <Col md={10}>
                      <Card.Body>
                        <a href={href} className={styles.cardLink}>
                          <h5 className="card-title">{props.name}</h5>
                        </a>
                        <p className="card-text">{props.description}</p>
                        <p className={`${styles.tagWrapper} card-text text-body-secondary`} style={{display:"flex", flexWrap:"wrap"}}>
                          {props.tags.map((tag) => (<Badge className={styles.tag} key={tag}>{tag}</Badge>))}
                        </p>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>

              </Col>
            </Row>
          {/* </Container>
        </Col>
      </Row> */}

    </>
  );
}