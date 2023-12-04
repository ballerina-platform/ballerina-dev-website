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

import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Container, Col, Row } from 'react-bootstrap';
import remarkGfm from 'remark-gfm';
import Image from 'next-image-export-optimizer';
import rehypeRaw from 'rehype-raw';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../layouts/LayoutSpec';
import { prefix } from '../../utils/prefix';
import { highlight } from "../../utils/highlighter";

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

var traverseFolder = function (dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function (file) {

    var filex = dir + "/" + file;
    var stat = fs.statSync(filex);

    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      if (!file.match(/^_/)) {
        results = results.concat(traverseFolder(filex));
      }
    } else {
      /* Is a file */
      if (filex !== 'spec/spec.md') {
        filex = filex.replace(/spec\//g, "");
        results.push(filex);
      }
    }

  });
  return results;
};

export async function getStaticPaths() {
  // Retrieve all our slugs
  const files = traverseFolder("spec");
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace("\/spec.md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {

  // slug = slug.join("/");
  const fileName = fs.readFileSync(`spec/${slug}/spec.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);
  let codeSnippets = await highlight(content);

  return {
    props: {
      frontmatter,
      content,
      codeSnippets
    },
  };
}

export default function PostPage({ frontmatter, content, codeSnippets }) {
  const codes = codeSnippets ? new Map(JSON.parse(codeSnippets)) : new Map();

  // Add id attributes to headings
  const extractText = (value) => {
    if (typeof value === 'string') {
      return value
    } else {
      return value.props.children
    }
  }

  const genrateId = (children) => {
    const newArray = children.map(extractText);
    let newId = newArray.join('').replace(/[&\/\\#,+()!$~%.'":*?<>{}]/g, '').toLowerCase();
    newId = newId.replace(/ /g, '-');

    return newId;
  }

  const extractLibraryNameFromContent = () => {
    return content.split("\n")[0].substring(2);
  }

  return (
    <>
      <Head>
        <meta name="description" content={frontmatter.title || extractLibraryNameFromContent()} />
        <meta name="keywords" content={frontmatter.keywords} />

        <title>{`${frontmatter.title || extractLibraryNameFromContent()} - The Ballerina programming language`}</title>

        {/* <!--FB--> */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${frontmatter.title || extractLibraryNameFromContent()} - The Ballerina programming language`} />
        <meta property="og:description" content={frontmatter.title || extractLibraryNameFromContent()}></meta>

        {/* <!--LINKED IN  --> */}
        <meta property="og:description" content={frontmatter.title || extractLibraryNameFromContent()} />

        {/* <!--TWITTER--> */}
        <meta name="twitter:title" content={`${frontmatter.title || extractLibraryNameFromContent()} - The Ballerina programming language`} />
        <meta property="twitter:description" content={frontmatter.title || extractLibraryNameFromContent()} />
        <meta property="twitter:text:description" content={frontmatter.title || extractLibraryNameFromContent()} />



      </Head>
      <Layout>
        <Col xs={12} className='mdContent'>
          <Container>
            <Row className='topRowSpec'>
              <Col xs={12}>
                <Link href='/' passHref className='specIcon'><Image src={`${prefix}/images/ballerina-logo.svg`} height={37} width={199} alt="Ballerina-logo" className='specIcon' /></Link>
              </Col>
            </Row>

            <Row className='specContent'>
              <ReactMarkdown className='stdLib'
                components={{
                  h2: ({ node, children, ...props }) => <h2 id={genrateId(children)} {...props}>{children}</h2>,
                  h3: ({ node, children, ...props }) => <h3 id={genrateId(children)} {...props}>{children}</h3>,
                  h4: ({ node, children, ...props }) => <h4 id={genrateId(children)} {...props}>{children}</h4>,
                  h5: ({ node, children, ...props }) => <h5 id={genrateId(children)} {...props}>{children}</h5>,
                  h6: ({ node, children, ...props }) => <h6 id={genrateId(children)} {...props}>{children}</h6>,
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
                  }
                }}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content}
              </ReactMarkdown>

            </Row>
          </Container>
        </Col>

      </Layout>
    </>
  );
}
