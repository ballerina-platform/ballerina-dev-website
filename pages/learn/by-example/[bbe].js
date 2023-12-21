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

import fs from "fs";
import { load } from "js-yaml";
import React, { useState, useEffect } from "react";
import { Container, Col, Button, Offcanvas } from "react-bootstrap";
import BBEs from "../../../swan-lake/by-example";
import Head from "next/head";
import Layout from "../../../layouts/LayoutDocs";
import LeftNavYaml from "../../../components/common/left-nav/LeftNavYaml";
import Link from "next/link";
import { getHighlighter } from "shiki";

export async function getStaticPaths() {
  const bbes = fs.readdirSync("swan-lake/by-example");
  const paths = [];

  bbes.forEach((bbeDir) => {
    const relDir = `swan-lake/by-example/${bbeDir}`;
    if (fs.statSync(relDir).isDirectory()) {
      paths.push({
        params: {
          bbe: bbeDir,
        },
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { bbe } }) {
  const frontmatterString = fs.readFileSync(
    `swan-lake/by-example/${bbe}/liquid.json`
  );
  const navContentString = fs.readFileSync(
    "_data/ballerina-by-example-nav.yml",
    "utf-8"
  );
  const navContent = load(navContentString);
  const frontmatter = JSON.parse(frontmatterString);

  const highlighter = await getHighlighter({
    theme: 'github-light'
  });

  const splitUrl = bbe
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1));
  const bbeComponentName = splitUrl.join("");
  const codeSnippetData = (BBEs[`${bbeComponentName}CodeSnippetData`]);
  const codes = [];
  for (let snippet of codeSnippetData) {
    codes.push(highlighter.codeToHtml(snippet, { lang: 'ballerina' }));
  }

  return {
    props: {
      frontmatter,
      navContent,
      bbe,
      codes
    },
  };
}

export default function BBEPage({ frontmatter, navContent, bbe, codes }) {
  const [bbeComponent, updateBBE] = useState(null);

  // Show mobile left nav
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (bbe != undefined) {
      // update component
      const splitUrl = bbe
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1));
      const bbeComponentName = splitUrl.join("");
      const BBE = BBEs[bbeComponentName];
      updateBBE(<BBE codeSnippets={codes} />);
    }
  }, [bbe]);

  return (
    <>
      <Head>
        <meta name="description" content={frontmatter.description} />
        <meta name="keywords" content={frontmatter.keywords} />

        <title>{`${frontmatter.title} - The Ballerina programming language`}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={`${frontmatter.title} - The Ballerina programming language`}
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-learn-ballerina-by-example-page-sm-banner.png"
        />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content={`${frontmatter.title} - The Ballerina programming language`} />
        <meta property="og:description" content={frontmatter.description} />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-learn-ballerina-by-example-page-sm-banner.png"
        />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content={`${frontmatter.title} - The Ballerina programming language`} />
        <meta
          property="twitter:description"
          content={frontmatter.description}
        />
        <meta
          property="twitter:text:description"
          content={frontmatter.description}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-learn-ballerina-by-example-page-sm-banner.png"
        />
      </Head>

      <Layout>
        <Col sm={3} xxl={2} className="leftNav d-none d-sm-block">
          <Link href="/learn/by-example" passHref>
            <div className="backToExample my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#3ad1ca"
                className="bi bi-box-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
                />
                <path
                  fillRule="evenodd"
                  d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
                />
              </svg>
              <p className="m-0 p-0">Back to Examples</p>
            </div>
          </Link>
          <LeftNavYaml navContent={navContent} bbe={bbe} />
        </Col>
        <Col xs={12} className="d-block d-sm-none">
          <Button className="learnMob" onClick={handleShow}>
            Learn
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
              <LeftNavYaml navContent={navContent} bbe={bbe} />
            </Offcanvas.Body>
          </Offcanvas>
        </Col>
        <Col xs={12} sm={9} xxl={10} className="mdContent">
          <Container className="h-100">
            {bbeComponent != null && bbeComponent}
          </Container>
        </Col>
      </Layout>
    </>
  );
}
