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
import Intro from "../../../components/ai/intro/Intro";
import Code from "../../../components/ai/code/Code";
import {transformerCopyButton} from "../../../utils/copy-button-transformer";


import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getSingletonHighlighter } from "shiki";

const SECTIONS_DIR = path.join("components", "ai", "code", "ai-bbe", "sections");
// NN-slug.md, where the slug never contains "--" (that marks a tab file).
const SECTION_FILE = /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const TAB_LANGS = ["ballerina", "toml", "json", "shell", "http"];

const toLink = (item) => ({
  label: item && item.label ? String(item.label) : "",
  url: item && item.url ? String(item.url) : "",
});

export async function getStaticProps() {
  const highlighter = await getSingletonHighlighter();
  await highlighter.loadTheme("github-light");
  for (const lang of TAB_LANGS) {
    await highlighter.loadLanguage(lang);
  }

  const highlight = (content, lang) =>
    highlighter.codeToHtml(content.replaceAll("```", "").trim(), {
      lang: TAB_LANGS.includes(lang) ? lang : "text",
      theme: "github-light",
      transformers: [transformerCopyButton()],
    });

  // Only top-level NN-slug.md files are sections; tab files (NN-slug--key.md)
  // and any subdirectories are ignored here.
  const sectionFiles = fs
    .readdirSync(SECTIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && SECTION_FILE.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  const sections = sectionFiles.map((file) => {
    const base = file.replace(/\.md$/, "");
    const { data } = matter(fs.readFileSync(path.join(SECTIONS_DIR, file), "utf-8"));
    const tabs = (data.tabs || []).map((tab) => {
      const tabFile = path.join(SECTIONS_DIR, `${base}--${tab.key}.md`);
      const { data: tabData, content } = matter(fs.readFileSync(tabFile, "utf-8"));
      return {
        key: String(tab.key),
        title: tab.title ? String(tab.title) : String(tab.key),
        lang: tabData.lang ? String(tabData.lang) : "text",
        code: highlight(content, tabData.lang),
      };
    });
    return {
      id: data.id ? String(data.id) : base.replace(/^\d{2}-/, ""),
      title: data.title ? String(data.title) : "",
      description: data.description ? String(data.description) : "",
      details: data.details ? String(data.details) : "",
      guide: toLink(data.guide),
      samples: (data.samples || []).map(toLink).filter((s) => s.url !== ""),
      tabs,
    };
  });

  return {
    props: {
      sections,
    },
  };
}


export default function Integrations({ sections }) {

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
          content="Connect models and agents to the APIs, data, and workflows your business runs on. Ballerina brings typed integration code together with AI libraries, helping you build applications that retrieve knowledge, use tools, coordinate approvals, and handle failures."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, AI integration, LLM, RAG, AI agents, MCP, human approval, durable workflows, agent evaluation, observability"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Ballerina for AI - The Ballerina programming language</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina for AI - The Ballerina programming language" />
        <meta
          property="og:description"
          content="Connect models and agents to the APIs, data, and workflows your business runs on. Ballerina brings typed integration code together with AI libraries, helping you build applications that retrieve knowledge, use tools, coordinate approvals, and handle failures."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ai-sm-banner.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina for AI - The Ballerina programming language" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ai-sm-banner.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Connect models and agents to the APIs, data, and workflows your business runs on. Ballerina brings typed integration code together with AI libraries, helping you build applications that retrieve knowledge, use tools, coordinate approvals, and handle failures."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina for AI - The Ballerina programming language" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Connect models and agents to the APIs, data, and workflows your business runs on. Ballerina brings typed integration code together with AI libraries, helping you build applications that retrieve knowledge, use tools, coordinate approvals, and handle failures."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ai-sm-banner.png"
        />
        <meta
          property="twitter:text:description"
          content="Connect models and agents to the APIs, data, and workflows your business runs on. Ballerina brings typed integration code together with AI libraries, helping you build applications that retrieve knowledge, use tools, coordinate approvals, and handle failures."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ai-sm-banner.png"
        />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow integration">
            <Col xs={12}>
              <Container>
                <h1>Ballerina for AI</h1>
              </Container>

            </Col>
          </Row>

          <Row className="pageContentRow integration">
            <Intro />
          </Row>
          <Code sections={sections} getLink={getLink} />
        </Col>
      </Layout>
    </>
  );
}
