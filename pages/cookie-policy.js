/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Col, Row } from "react-bootstrap";
import Image from "next-image-export-optimizer";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Head from "next/head";

import Layout from "../layouts/LayoutOther";
import { prefix } from "../utils/prefix";
import Toc from "../components/common/pg-toc/Toc";

export async function getStaticProps() {
  const fileName = fs.readFileSync(`policy/cookie-policy.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);

  return {
    props: {
      frontmatter,
      content,
    },
  };
}

export default function CookiePolicyPage({ frontmatter, content }) {
  // Add id attributes to headings
  const extractText = (value) => {
    if (typeof value === "string") {
      return value;
    } else {
      return value.props.children;
    }
  };

  const scanArray = (array) => {
    const newArray = array.map(extractText);
    let newId = newArray
      .join("")
      .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
      .toLowerCase();
    newId = newId.replace(/ /g, "-");
    return newId;
  };

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

        <title>{frontmatter.title}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta
          property="og:title"
          content={`Ballerina - ${frontmatter.title}`}
        />
        <meta
          property="og:description"
          content="A programming language for the cloud that makes it easier to use, combine, and create network services."
        />

        {/* <!--LINKED IN  --> */}
        <meta property="og:title" content="Ballerina" />

        {/* <!--TWITTER--> */}
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
        <Col xs={12} sm={10} className="policyContent">
          <Row className="topRow innerRow">
            <Col xs={11}>
              <h1>{frontmatter.title}</h1>
            </Col>
            <Col xs={1} className="gitIcon">
              <a
                href={`${process.env.gitHubPath}policy/cookie-policy.md`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={`${prefix}/images/github.svg`}
                  height={20}
                  width={20}
                  alt="Edit in github"
                />
              </a>
            </Col>
          </Row>

          <Row className="pageContentRow innerRow">
            <Col xs={12}>
              <ReactMarkdown
                components={{
                  h2({ node, inline, className, children, ...props }) {
                    let id = "";
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0]
                        .toString()
                        .toLowerCase()
                        .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
                        .replace(/ /g, "-");
                    } else {
                      id = scanArray(children);
                    }
                    return (
                      <h2 id={id} data-section={id} className="section">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-link-45deg mdButton pe-2"
                          viewBox="0 0 16 16"
                          onClick={(e) => getLink(e.target, id)}
                        >
                          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        {children}
                      </h2>
                    );
                  },
                  h3({ node, inline, className, children, ...props }) {
                    let id = "";
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0]
                        .toString()
                        .toLowerCase()
                        .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
                        .replace(/ /g, "-");
                    } else {
                      id = scanArray(children);
                    }
                    return (
                      <h3 id={id} data-section={id} className="section">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-link-45deg mdButton pe-2"
                          viewBox="0 0 16 16"
                          onClick={(e) => getLink(e.target, id)}
                        >
                          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        {children}
                      </h3>
                    );
                  },
                  h4({ node, inline, className, children, ...props }) {
                    let id = "";
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0]
                        .toString()
                        .toLowerCase()
                        .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
                        .replace(/ /g, "-");
                    } else {
                      id = scanArray(children);
                    }
                    return (
                      <h4 id={id} data-section={id} className="section">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-link-45deg mdButton pe-2"
                          viewBox="0 0 16 16"
                          onClick={(e) => getLink(e.target, id)}
                        >
                          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        {children}
                      </h4>
                    );
                  },
                  h5({ node, inline, className, children, ...props }) {
                    let id = "";
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0]
                        .toString()
                        .toLowerCase()
                        .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
                        .replace(/ /g, "-");
                    } else {
                      id = scanArray(children);
                    }
                    return (
                      <h5 id={id} data-section={id} className="section">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-link-45deg mdButton pe-2"
                          viewBox="0 0 16 16"
                          onClick={(e) => getLink(e.target, id)}
                        >
                          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        {children}
                      </h5>
                    );
                  },
                  h6({ node, inline, className, children, ...props }) {
                    let id = "";
                    setShowToc(true);
                    if (children.length === 1) {
                      id = children[0]
                        .toString()
                        .toLowerCase()
                        .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
                        .replace(/ /g, "-");
                    } else {
                      id = scanArray(children);
                    }
                    return (
                      <h6 id={id} data-section={id} className="section">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          className="bi bi-link-45deg mdButton pe-2"
                          viewBox="0 0 16 16"
                          onClick={(e) => getLink(e.target, id)}
                        >
                          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                        </svg>
                        {children}
                      </h6>
                    );
                  },
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return inline ?
                      <code className={className} {...props}>
                        {children}
                      </code>
                      : match ?
                        <div dangerouslySetInnerHTML={{ __html: HighlightSyntax(String(children).replace(/\n$/, ''), match[1].toLowerCase()) }} />
                        : <pre className='default'>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                  }
                }}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content}
              </ReactMarkdown>
            </Col>
          </Row>
        </Col>
        <Col sm={2} className="pageToc d-none d-sm-block">
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
