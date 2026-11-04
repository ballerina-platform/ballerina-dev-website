/**
 * Copyright (c) 2026, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import AssistedDev from "../../../../components/ai/assisted-dev/AssistedDev";
import introStyles from "../../../../components/ai/intro/Intro.module.css";
import { transformerCopyButton } from "../../../../utils/copy-button-transformer";
import { prefix } from "../../../../utils/prefix";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getSingletonHighlighter } from "shiki";

// Section order for this page. Each entry is a frontmatter file in SNIPPETS_DIR;
// code tabs are read from "<name>--<tab key>.md" in the same folder.
const SNIPPETS_DIR = path.join("components", "ai", "assisted-dev", "snippets");
const SECTION_NAMES = ["copilot", "requirements-to-code", "compile-time-code-generation"];

const DESCRIPTION =
  "Use AI while you develop Ballerina integrations: Copilot in the editor, requirements-to-code and drift detection, and experimental compile-time code generation.";

export async function getStaticProps() {
  const highlighter = await getSingletonHighlighter();
  await highlighter.loadTheme("github-light");
  await highlighter.loadLanguage("ballerina");

  const sections = SECTION_NAMES.map((name) => {
    const { data } = matter(fs.readFileSync(path.join(SNIPPETS_DIR, `${name}.md`), "utf-8"));
    const tabs = (data.tabs || []).map((tab) => {
      const result = {
        key: String(tab.key),
        title: tab.title ? String(tab.title) : String(tab.key),
        src: tab.src ? String(tab.src) : "",
        alt: tab.alt ? String(tab.alt) : "",
        width: tab.width ? Number(tab.width) : 0,
        height: tab.height ? Number(tab.height) : 0,
        code: "",
      };
      if (!result.src) {
        const { data: tabData, content } = matter(
          fs.readFileSync(path.join(SNIPPETS_DIR, `${name}--${tab.key}.md`), "utf-8")
        );
        result.code = highlighter.codeToHtml(content.replaceAll("```", "").trim(), {
          lang: tabData.lang === "ballerina" ? "ballerina" : "text",
          theme: "github-light",
          transformers: [transformerCopyButton()],
        });
      }
      return result;
    });
    return {
      id: String(data.id),
      title: data.title ? String(data.title) : "",
      description: data.description ? String(data.description) : "",
      details: data.details ? String(data.details) : "",
      links: (data.links || []).map((link) => ({
        label: link.label ? String(link.label) : "",
        url: String(link.url),
        action: link.action ? String(link.action) : "",
      })),
      tabs,
    };
  });

  return {
    props: {
      sections,
    },
  };
}

export default function AiAssistedDevelopment({ sections }) {
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

  const title = "AI-assisted development - The Ballerina programming language";

  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={DESCRIPTION} />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, AI-assisted development, copilot, natural programming, drift detection, compile-time code generation"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>{title}</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" itemProp="image" content="https://ballerina.io/images/ai-sm-banner.png" />

        {/* TWITTER */}
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content="https://ballerina.io/images/ai-sm-banner.png" />
        <meta property="twitter:text:description" content={DESCRIPTION} />
      </Head>

      <Layout>
        <Col sm={12}>
          <Row className="pageHeader pageContentRow integration">
            <Col xs={12}>
              <Container>
                <h1>AI-assisted development</h1>
              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow integration">
            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={5} className={introStyles.introText}>
                    <p className={introStyles.introText2}>AI in your editor. Ballerina in your build.</p>
                    <p className={introStyles.introText3}>
                      These tools help you write, map, test, and keep Ballerina integrations in line with their
                      requirements. They run while you develop, not inside the deployed integration. Review
                      generated code and suggestions as you would any other change. To add models and agents to
                      the integration itself, see <a href={`${prefix}/use-cases/ai/`}>Ballerina for AI</a>.
                    </p>
                  </Col>
                  <Col xs={12} lg={7} className={introStyles.introImg}>
                    <img
                      src={`${prefix}/images/ai-assisted-development-intro.png`}
                      alt="Ballerina logo surrounded by icons for code generation, AI chat, build-time generation, tests, and drift detection"
                    />
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>

          <AssistedDev sections={sections} getLink={getLink} />
        </Col>
      </Layout>
    </>
  );
}
