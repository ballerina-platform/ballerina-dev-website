/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import matter from "gray-matter";
import React from "react";
import { Container, Col, Button, Offcanvas } from "react-bootstrap";
import Image from "next-image-export-optimizer";
import Head from "next/head";
import Link from "next/link";

import Layout from "../../../layouts/LayoutDocs";
import LeftNav from "../../../components/common/left-nav/LeftNav";
import MainContent from "../../../components/common/main-content/MainContent";
import PrevNext from "../../../components/common/prev-next/PrevNext";
import { prefix } from "../../../utils/prefix";
import LearnToc from "../../../utils/vs-code-ext.json";
import Toc from "../../../components/common/pg-toc/Toc";

export async function getStaticProps() {
  const fileName = fs.readFileSync(`swan-lake/vs-code-extension/troubleshoot.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  const id = "troubleshoot";

  return {
    props: {
      frontmatter,
      content,
      id,
    },
  };
}

export default function PostPage({ frontmatter, content, id }) {

  // Show mobile left nav
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Show page toc
  const [showToc, setShowToc] = React.useState(false);

  const handleToc = (data) => {
    setShowToc(data)
  }

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
          property="og:description"
          content={frontmatter.description}
        ></meta>
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-vs-code-ext-sm-banner.png"
        />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content={`${frontmatter.title} - The Ballerina programming language`} />
        <meta property="og:description" content={frontmatter.description} />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-vs-code-ext-sm-banner.png"
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
          content="https://ballerina.io/images/ballerina-vs-code-ext-sm-banner.png"
        />
      </Head>
      <Layout>
        <Col sm={3} xxl={2} className="leftNav d-none d-sm-block">
          <Link href="/learn/vs-code-extension/" passHref>
            <div className="backToLanding">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#3ad1ca"
                className="bi bi-box-arrow-left ms-0"
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
              <p className="m-0 p-0">Back to VS Code home</p>
            </div>
          </Link>
          <LeftNav
            launcher="learn"
            id={id}
            mainDir="troubleshoot"
            Toc={LearnToc}
          />
        </Col>
        <Col xs={12} className="d-block d-sm-none">
          <Button className="learnMob" onClick={handleShow}>
            Learn
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
              <Link href="/learn/vs-code-extension/" passHref>
                <div className="backToLanding">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="#3ad1ca"
                    className="bi bi-box-arrow-left ms-0"
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
                  <p className="m-0 p-0">Back to VS Code home</p>
                </div>
              </Link>
              <LeftNav
                launcher="vs-code"
                id={id}
                mainDir="troubleshoot"
                Toc={LearnToc}
                sub={id}
              />
            </Offcanvas.Body>
          </Offcanvas>
        </Col>
        <Col xs={12} sm={7} xxl={7} className="mdContent">
          <Container>
            <div className="topRow">
              <Col xs={11}>
                <h1>{frontmatter.title}</h1>
              </Col>
              <Col xs={1} className="gitIcon">
                <a
                  href={`${process.env.gitHubPath}swan-lake/vs-code-extension/troubleshoot.md`}
                  target="_blank"
                  rel="noreferrer"
                  title="Edit in GitHub"
                >
                  <Image
                    src={`${prefix}/images/sm-icons/github.svg`}
                    height={20}
                    width={20}
                    alt="Edit in GitHub"
                  />
                </a>
              </Col>
            </div>

            <p className="intro">{frontmatter.intro}</p>

            <MainContent
              content={content}
              handleToc={handleToc} />

            <PrevNext
              launcher="learn"
              id={id}
              mainDir="troubleshoot"
              Toc={LearnToc}
            />

          </Container>
        </Col>
        <Col sm={2} xxl={3} className="pageToc d-none d-sm-block">
          {showToc ? (
            <>
              <h6>On this page</h6>
              <Toc source={content} />
            </>
          ) : null}
        </Col>
      </Layout>
    </>
  );
}
