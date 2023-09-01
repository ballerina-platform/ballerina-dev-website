
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
import fs from "fs";
import path from 'path';
import React from "react";
import Link from "next/link";
import { Row, Container, Col, Badge, Table } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from "../../../layouts/LayoutLearn";
import { useRouter } from "next/router";
import { getHighlighter } from "shiki";
import styles from './Patterns.module.css';
import ReactMarkdown from 'react-markdown';
import { FaRegCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';

const baseDirectory = path.resolve("pages/learn/enterprise-integration-patterns/enterprise-integration-patterns");

export async function getStaticProps({ params }) {
  const highlighter = await getHighlighter({ theme: 'github-light' });
  const ymlPath = path.join(baseDirectory, params.pattern, params.pattern + ".yml");
  const content = fs.readFileSync(path.join(baseDirectory, params.pattern, params.pattern + ".bal"), "utf-8");
  const code = highlighter.codeToHtml(content, { lang: 'ballerina' });
  const name = params.pattern.replace(/-.|^./g, x => " " + x.slice(-1).toUpperCase());
  if (!fs.existsSync(ymlPath)) {
    return { props: { code, name, content } };
  }
  const yml = fs.readFileSync(ymlPath, "utf-8");
  var props = load(yml);
  props.code = code;
  props.name = props.name ?? name;
  props.content = content;
  return { props };
}

export async function getStaticPaths() {
  const files = fs.readdirSync(baseDirectory);
  var paths = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(baseDirectory, file);
    const stats = fs.statSync(filePath);
    const bal = path.join(filePath, file + ".bal");
    if (stats.isDirectory() && fs.existsSync(bal)) {
      paths.push({ params: { pattern: file } });
    }
  }
  return { paths, fallback: false, };
}

export default function Pattern(props) {
  const router = useRouter();

  const [copied, setCopied] = React.useState(false);

  const codeCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <Layout>
      <Col sm={12}>
        <Row className="pageContentRow llanding pb-0">

          <Col xs={12}>
            <Container>
              <Row>
                <Col xs={12} className="patternContent">
                  <Link href="/learn/enterprise-integration-patterns/" passHref>
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
                      <p className="m-0 p-0">Back to EIP</p>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>


        <Row className="pageHeader pageContentRow llanding">
          <Col xs={12}>
            <Container>
              <h1>{props.name}</h1>
            </Container>
          </Col>
        </Row>



        <Row className="pageContentRow llanding">

          <Col xs={12}>
            <Container>
              <Row>
                <Col xs={12} className="patternContent">
                  <table className={styles.table}>
                    {props.desc &&
                      <tr>
                        <td>Pattern</td>
                        <td>{props.desc} <a href={props.link} style={{ color: "#20b6b0" }}><FaExternalLinkAlt /></a></td>
                      </tr>
                    }
                    {props.helps &&
                      <tr>
                        <td>How Ballerina helps</td>
                        <td><ReactMarkdown children={props.helps}></ReactMarkdown></td>
                      </tr>
                    }
                  </table>
                  <div className={styles.tags}>
                    {props.tags && props.tags.map((tag) => (<Badge className={styles.tag} key={tag}>{tag}</Badge>))}
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>

        <Row className="pageContentRow llanding" >
          <Col xs={12}>
            <Container>

              <div style={{
                background: "#eeeeee", padding: "10px",
                borderRadius: "5px",
                marginTop: "20px",
                backgroundColor: "#eeeeee !important"
              }}>
                <CopyToClipboard text={props.content}
                  onCopy={() => codeCopy()} style={{ float: "right" }}>
                  {
                    copied ? <FaCheck style={{ color: "20b6b0" }} title="Copied" /> : <FaRegCopy title="Copy" />
                  }
                </CopyToClipboard>

                <div className="highlight" dangerouslySetInnerHTML={{ __html: props.code }} />
              </div>
            </Container>
          </Col>
        </Row>

      </Col>
    </Layout >
  );
}
