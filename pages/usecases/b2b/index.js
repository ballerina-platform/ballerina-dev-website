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

import Layout from "../../../layouts/LayoutUseCase";
import Intro from "../../../components/b2b/intro/Intro";
import Code from "../../../components/b2b/code/Code";
import { prefix } from '../../../utils/prefix';

import fs from "fs";
import matter from "gray-matter";
import { getHighlighter } from "shiki";

var traverseFolder = function (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {
    var filex = dir + "/" + file;
    results.push(filex);
  });
  return results;
};

export async function getStaticProps() {
  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const files = traverseFolder("components/b2b/code/b2b-bbe");
  var samples = {};

  files.forEach(function (item, index) {
    const filename = fs.readFileSync(item, "utf-8");
    const sampleName = item.replace('components/b2b/code/b2b-bbe/', '').replace('.md', '');
    const { data: frontmatter, content } = matter(filename);
    samples[sampleName] = {
      frontmatter: {
        title: frontmatter.title,
        description: frontmatter.description,
        url: frontmatter.url ? frontmatter.url : '',
        image: frontmatter.image ? frontmatter.image : '',
      },
      code: (content != '') ? highlighter.codeToHtml(content.replaceAll('```', '').trim(), { lang: 'ballerina' }) : ''
    };
  });

  return {
    props: {
      samples,
    },
  };
}


export default function Integrations({ samples }) {

  const getLink = (element, id) => {
    if (element.tagName.toLowerCase() === "path")
      element = element.parentElement;

    const elementNodeList = document.querySelectorAll(`#${id}`);
    const elementArray = Array.prototype.slice.call(elementNodeList);
    const count = elementArray.indexOf(element.parentElement);

    if (count === 0) {
      location.hash = `#${id}`;
    } else {
      location.hash = `#${id}-${count}`;
    }

    navigator.clipboard.writeText(window.location.href);
    element.parentElement.scrollIntoView();
  };

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Ballerina is the only language with native support for B2B integrations. "
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Ballerina for B2B integrations - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina for B2B integrations - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Ballerina is the only language with native support for B2B integrations. "
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-use-cases-b2b-integration-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina for B2B integrations - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-use-cases-b2b-integration-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Ballerina is the only language with native support for B2B integrations. "
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina for B2B integrations - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Ballerina is the only language with native support for B2B integrations. "
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-use-cases-b2b-integration-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Ballerina is the only language with native support for B2B integrations. "
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-use-cases-b2b-integration-sm-banner.png"
        />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow integration">
            <Col xs={12}>
              <Container>
                <h1>Ballerina for B2B integrations</h1>
              </Container>

            </Col>
          </Row>

          <Row className="pageContentRow integration">
            <Intro />
          </Row>
          <Code samples={samples} getLink={getLink} />
        </Col>
      </Layout>
    </>
  );
}
