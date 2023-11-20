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


import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import Link from 'next/link';
import timestamp from 'time-stamp';
import Head from 'next/head';


import Layout from '../../../../layouts/LayoutSpec';
import { prefix } from '../../../../utils/prefix';
import drafts from '../../../../_data/draft_spec.json';


export default function PostPage() {

  return (
    <>
      <Head>
        <title>Ballerina spec - draft build -  The Ballerina programming language</title>
        <meta property="og:title" content="Ballerina spec - draft build -  The Ballerina programming language" />
        <meta name="twitter:title" content="Ballerina spec - draft build -  The Ballerina programming language" />
      </Head>
      <Layout>
        <Col xs={12} className='mdContent langDraft'>
          <Container>
            <Row className='topRowSpec'>
              <Col xs={12}>
                <Link href='/' passHref className='specIcon'><Image src={`${prefix}/images/ballerina-logo.svg`} height={37} width={199} alt="Ballerina-logo" className='specIcon' /></Link>
              </Col>
            </Row>

            <Row>
              <h1>Ballerina spec - draft build</h1>

              <h3>Ballerina language specifications</h3>

            </Row>

            <Row>
              <ul>
              {drafts.map((item, index) => (
                <li className="specDrafts" key={index}><a href={`/spec/lang/draft/${item}/`}>{item}</a></li>
              ))}
              </ul>
            </Row>

            <Row className='draftTime'>
              <p>
                Last updated : {timestamp('YYYY/MM/DD-HH:mm:ss')}.
              </p>
            </Row>
          </Container>
        </Col>

      </Layout>
    </>
  );
}
