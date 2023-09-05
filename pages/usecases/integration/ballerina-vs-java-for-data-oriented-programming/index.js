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

import Layout from "../../../../layouts/LayoutUseCase";
import Intro from "../../../../components/integration/ballerina-vs-java-for-data-oriented-programming/intro/Intro";
import Code from "../../../../components/integration/ballerina-vs-java-for-data-oriented-programming/code/Code";

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
  const files = traverseFolder("components/integration/ballerina-vs-java-for-data-oriented-programming/code/java-bbe");
  var samples = {};

  files.forEach(function (item, index) {
    const filename = fs.readFileSync(item, "utf-8");
    const sampleName = item.replace('components/integration/ballerina-vs-java-for-data-oriented-programming/code/java-bbe/', '').replace('.md', '');
    const { data: frontmatter, content } = matter(filename);
    const regex = /```(\w+)([\s\S]*?)```/g;
    let match = [];
    let lang = 'ballerina';
    while (match = regex.exec(content)) {
      let code = match[2];
      const firstLine = code.split('/n')[0];
      const indent = firstLine.length - firstLine.trimStart().length;
      // const key = code.trim().split(/\r?\n/).map(row => row.trim()).join('\n');
      // code = code.split(/\r?\n/).map(row => row.substring(indent - 1)).join('\n');
      lang = (match[1]).toLowerCase();

      // codes.set(key.hashCode(), highlighter.codeToHtml(code.trim(), { lang: supportedLangs.includes(lang) ? lang : '' }));
  }
    samples[sampleName] = {
      frontmatter: {
        title: frontmatter.title? frontmatter.title : '',
        description: frontmatter.description? frontmatter.description : '',
        url: frontmatter.url ? frontmatter.url : '',
        image: frontmatter.image ? frontmatter.image : '',
      },
      content: content,
      code: (content != '') ? highlighter.codeToHtml(content.replaceAll('```'+lang, '').replaceAll('```', '').trim(), { lang: lang }) : ''
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
          content="Write code with integration-friendly abstractions."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Data-oriented programming with Ballerina: a comparative analysis</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Enhance data oriented programming with Ballerina - The smarter choice over Java" />
        <meta
          property="og:description"
          content="Write code with integration-friendly abstractions."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/usecases/integration/java/java-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/usecases/integration/java/java-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Write code with integration-friendly abstractions."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Write code with integration-friendly abstractions."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/usecases/integration/java/java-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Write code with integration-friendly abstractions."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/usecases/integration/java/java-banner.png"
        />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow integration">
            <Col xs={12}>
              <Container>
                <h1>Data-oriented programming with Ballerina:  <br/>A comparative analysis</h1>
              </Container>

            </Col>
          </Row>

          <Row className="pageContentRow integration">
            <Intro />
          </Row>
          <Code samples={samples} getLink={getLink} />
          {/* </Row> */}
        </Col>
      </Layout>
    </>
  );
}
