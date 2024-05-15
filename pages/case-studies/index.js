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

import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Head from "next/head";

import Layout from "../../layouts/LayoutUseCase";
import UseCases from "../../components/common/use-cases/UseCases";


import fs from "fs";
import matter from "gray-matter";

export async function getStaticProps() {

  const files = fs.readdirSync('case-studies');

  const caseStudies = files.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`case-studies/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      caseStudies
    },
  };
}


export default function CaseStudies({ caseStudies }) {

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Discover how Ballerina enhances cloud-native development with real-world examples and applications across various industries."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Ballerina case studies - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina case studies - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Discover how Ballerina enhances cloud-native development with real-world examples and applications across various industries."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina case studies - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Discover how Ballerina enhances cloud-native development with real-world examples and applications across various industries."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina case studies - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Discover how Ballerina enhances cloud-native development with real-world examples and applications across various industries."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="twitter:text:description"
          content="Discover how Ballerina enhances cloud-native development with real-world examples and applications across various industries."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow integration">
            <Col xs={12}>
              <Container>
                <h1>Case studies</h1>
              </Container>

            </Col>
          </Row>

          <Row className="pageContentRow integration">
            <UseCases propsData={caseStudies} />
          </Row>

        </Col>
      </Layout>
    </>
  );
}
