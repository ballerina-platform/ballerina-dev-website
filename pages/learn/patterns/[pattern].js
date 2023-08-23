
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
import { Row, Container, Col, Badge } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from "../../../layouts/LayoutLearn";
import { useRouter } from "next/router";
import { getHighlighter } from "shiki";
import styles from './Patterns.module.css';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

const baseDirectory = path.resolve("pages/learn/patterns/enterprise-integration-patterns");

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
      <Col xl={{ offset: 1, span: 10 }} className="mdContent">
        <h1 className="mt-2 mb-4 pb-2">
          <abbr title="Enterprise Integration Pattern">EIP</abbr>: {props.name}
        </h1>
        <p className="mb-5">
          <table>
            {props.desc &&
              <tr>
                <td>Pattern</td>
                <td>{props.desc} <a href={props.link}>↗</a></td>
              </tr>
            }
            {props.helps &&
              <tr>
                <td>How Ballerina helps</td>
                <td>{props.helps}</td>
              </tr>
            }
          </table>

        </p>
        <div className={styles.tags}>
          {props.tags && props.tags.map((tag) => (<Badge className={styles.tag}>{tag}</Badge>))}
        </div>
        {/* <div className="highlight" dangerouslySetInnerHTML={{ __html: props.code }} /> */}

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
                    onCopy={() => codeCopy()} style={{float:"right"}}>
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
    </Layout>
  );
}
