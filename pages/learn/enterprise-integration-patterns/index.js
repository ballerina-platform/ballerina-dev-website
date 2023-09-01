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

import { load } from "js-yaml";
import Head from "next/head";
import fs from "fs";
import path from 'path';
import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Layout from "../../../layouts/LayoutLearn";
import { useRouter } from "next/router";
import Pattern from "../../../components/learn/pattern/Pattern";

const baseDirectory = path.resolve("pages/learn/enterprise-integration-patterns/enterprise-integration-patterns");

export async function getStaticProps() {
  const files = fs.readdirSync(baseDirectory);
  var patterns = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(baseDirectory, file);
    const stats = fs.statSync(filePath);
    const bal = path.join(filePath, file + ".bal");
    if (stats.isDirectory() && fs.existsSync(bal)) {
      if (!fs.existsSync(path.resolve(""))) {

      }

      const ymlPath = path.join(baseDirectory, file, file + ".yml");
      const name = file.replace(/-.|^./g, x => " " + x.slice(-1).toUpperCase()).trim();
      if (!fs.existsSync(ymlPath)) {
        patterns.push({ name });
        continue;
      }
      const yml = fs.readFileSync(ymlPath, "utf-8");
      var pattern = load(yml);
      pattern.name = pattern.name ?? name;
      patterns.push(pattern);
    }
  }
  return { props: { patterns } };
}

export default function PatternList(props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Integrations Patterns</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina - Learn" />
        <meta
          property="og:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina: Pre-built integrations" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="twitter:text:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <h1>Enterprise Integrations Patterns</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12} md={12}>
              <Container>
                <p className="intro">
                  Ballerina usage patterns and best practices for implementing enterprise integrations. These patterns are based on the <a href="https://www.enterpriseintegrationpatterns.com">Enterprise Integration Patterns</a> book by Gregor Hohpe and Bobby Woolf. Each sample is a simplified version of a real-world integration scenario.
                </p>
              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding" >
            <Col xs={12}>
              <Container>
                    <Row>
                {
                  props.patterns.map((p) => (
                    <Pattern name={p.name} description={p.tagline ?? p.desc} tags={p.tags ?? []} key={p.name}/>
                  ))
                }
                    </Row>
              </Container>
            </Col>
          </Row>

        </Col>
        
      </Layout>

    </>
  );
}
