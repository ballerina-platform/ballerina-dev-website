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
import matter from "gray-matter";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Container, Col, Button, Offcanvas } from "react-bootstrap";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next-image-export-optimizer";
import Head from "next/head";

import Layout from "../../../layouts/LayoutRN";
import LeftNav from "../../../components/common/left-nav/LeftNav";
import { prefix } from "../../../utils/prefix";
import RNToc from "../../../utils/rl.json";
import Toc from "../../../components/common/pg-toc/Toc";
import { highlight } from "../../../utils/highlighter";
import GenerateHeadingComponent from "../../../components/common/heading/RenderHeading";

String.prototype.hashCode = function () {
  var hash = 0,
      i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
      chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
  }
  return hash;
}

// import { Liquid } from 'liquidjs';

var traverseFolder = function (dir) {
  var results = [];
  var list = fs.readdirSync(dir);

  list.forEach(function (file) {
    var filex = dir + "/" + file;
    var stat = fs.statSync(filex);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(traverseFolder(filex));
    } else {
      /* Is a file */
      filex = filex
        .replace(/downloads\/swan-lake-release-notes\//g, "")
        .replace(/\/RELEASE_NOTE.md/g, "");
      results.push(filex);
    }
  });

  return results;
};

export async function getStaticPaths() {
  // Retrieve all our slugs
  const files = traverseFolder("downloads/swan-lake-release-notes");

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", "").split("/"),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const id = slug[slug.length - 1];
  slug = slug.join("/");

  const fileName = fs.readFileSync(
    `downloads/swan-lake-release-notes/${slug}/RELEASE_NOTE.md`,
    "utf-8"
  );
  const { data: frontmatter, content } = matter(fileName);
  let codeSnippets = await highlight(content);

  return {
    props: {
      frontmatter,
      content,
      id,
      codeSnippets
    },
  };
}

export default function PostPage({ frontmatter, content, id, codeSnippets }) {
  const codes = codeSnippets ? new Map(JSON.parse(codeSnippets)) : new Map();

  // Show mobile left nav
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Show page toc
  const [showToc, setShowToc] = React.useState(false);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="A programming language for the cloud that makes it easier to use, combine, and create network services."
        />
        <meta
          name="keywords"
          content="ballerinalang, integration, microservices, programming language, cloud native, ballerina language"
        />

        <title>{`${frontmatter.title} - The Ballerina programming language`}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={`${frontmatter.title} - The Ballerina programming language`}
        />
        <meta
          property="og:description"
          content="A programming language for the cloud that makes it easier to use, combine, and create network services."
        />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content={`${frontmatter.title} - The Ballerina programming language`} />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content={`${frontmatter.title} - The Ballerina programming language`} />
        <meta
          property="twitter:description"
          content="A programming language for the cloud that makes it easier to use, combine, and create network services."
        />
        <meta
          property="twitter:text:description"
          content="A programming language for the cloud that makes it easier to use, combine, and create network services."
        />
      </Head>
      <Layout>
        <Col sm={3} xxl={2} className="leftNav d-none d-sm-block">
          <LeftNav
            launcher="rn"
            id={id}
            mainDir="swan-lake-release-notes"
            Toc={RNToc}
          />
        </Col>
        <Col xs={12} className="d-block d-sm-none">
          <Button className="learnMob" onClick={handleShow}>
            Release notes
          </Button>
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
              <LeftNav
                launcher="rn"
                id={id}
                mainDir="swan-lake-release-notes"
                Toc={RNToc}
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
                  href={`${process.env.gitHubPath}downloads/swan-lake-release-notes/${id}/RELEASE_NOTE.md`}
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

            <ReactMarkdown
              components={{
                h1: GenerateHeadingComponent(1, setShowToc),
                h2: GenerateHeadingComponent(2, setShowToc),
                h3: GenerateHeadingComponent(3, setShowToc),
                h4: GenerateHeadingComponent(4, setShowToc),
                h5: GenerateHeadingComponent(5, setShowToc),
                h6: GenerateHeadingComponent(6, setShowToc),
                code({ node, inline, className, children, ...props }) {
                  const key = (children[0]).trim().split(/\r?\n/).map(row => row.trim()).join('\n');
                  const highlightedCode = codes.get(key.hashCode());
                  if (highlightedCode) {
                    return <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                  }
                  const match = /language-(\w+)/.exec(className || '')
                  return inline ?
                    <code className={className} {...props}>
                      {children}
                    </code>
                    : match ?
                      <div dangerouslySetInnerHTML={{ __html: String(children).replace(/\n$/, '') }} />
                      : <pre className='default'>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                },
                table({node, className, children, ...props}) { 
                  return <div className='mdTable'><table {...props}>{children}</table></div>
                }
              }}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
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