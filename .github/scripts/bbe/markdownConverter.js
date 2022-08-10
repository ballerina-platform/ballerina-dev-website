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

// imports
const md = require("markdown-it")();
const container = require("markdown-it-container");
const fs = require("fs");
const axios = require("axios");
const os = require("os");

// OS
const platform = os.platform();

// converts kebab case to pascal case
const kebabCaseToPascalCase = (convertable) => {
  const splitted = convertable
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1));
  return splitted.join("");
};

// escape paragraph characters
const escapeParagraphCharacters = (content) => {
  let output = "";
  for (let i = 0; i < content.length; i++) {
    if (content[i] === "{") {
      output += "&#123;";
    } else if (content[i] === "}") {
      output += "&#125;";
    } else {
      output += content[i];
    }
  }
  return output;
};

// escape quote characters
const escapeCharacterAdder = (content, type) => {
  let output = "",
    codeContent = "",
    tempContent = "",
    open = false,
    fencedCodeCount = 0;

  for (let i = 0; i < content.length; i++) {
    switch (content[i]) {
      case "`":
        if (
          fencedCodeCount > 0 ||
          (i < content.length - 2 &&
            content[i + 1] === "`" &&
            content[i + 2] === "`")
        ) {
          tempContent = "\\`";
          fencedCodeCount += 1;

          if (fencedCodeCount === 3) {
            fencedCodeCount = 0;
          }
        } else {
          switch (type) {
            case "code":
              tempContent = "\\`";
              break;
            case "out":
              if (open) {
                open = false;
              } else {
                open = true;
              }
              break;
          }
        }
        break;
      case "$":
        tempContent = "\\$";
        break;
      case "\\":
        tempContent = "\\\\";
        break;
      default:
        tempContent = content[i];
        break;
    }

    if (i === content.length - 1 && open) {
      output += codeContent;
    } else if (open) {
      codeContent += tempContent;
    } else if (codeContent !== "") {
      output += `\`}<code>{\`${codeContent}\`}</code>{\``;
      codeContent = "";
    } else if (!open) {
      output += tempContent;
      tempContent = "";
    }
  }

  return output;
};

// extract code content
const extractCode = (relPath, line) => {
  const m = line.trim().match(/code\s+(.+\w)/);
  try {
    const codeContent = fs.readFileSync(`${relPath}/${m[1]}`, "utf-8");
    return { fileName: m[1], codeContent };
  } catch ({ message }) {
    console.log(message);
  }
};

// sleeper
const sleep = (timeout) => {
  const start = Date.now();
  let end = null;
  do {
    end = Date.now();
  } while (end < start + timeout);
};

// render code snippet
const codeSnippetGenerator = (code, marginLeftMultiplier, lang) => {
  let output = `<pre style={{ marginLeft: "${
    marginLeftMultiplier * 8
  }px" }} className="p-3 rounded ${lang}"><code>${code}</code></pre>`;

  return output;
};

// playground link generator
const generatePlaygroundLink = async (content, description, fileName) => {
  const data = {
    content,
    description,
    fileName,
  };

  try {
    sleep(1000);
    const result = await axios({
      url: "https://play.ballerina.io/gists",
      method: "POST",
      data,
    });

    playgroundLink = `https://play.ballerina.io/?gist=${result.data.id}&file=${fileName}`;
  } catch (error) {
    console.log(error.response.data);
  }
  return playgroundLink;
};

// edit on github link generator
const generateEditOnGithubLink = (exampleDir) => {
  // Github base URL
  const metaString = fs.readFileSync(`${exampleDir}/meta.json`, "utf-8");
  const metaJson = JSON.parse(metaString);
  const editOnGithubBaseUrl = metaJson["githubBallerinaByExampleBaseURL"];

  // release tag
  const metadataString = fs.readFileSync(
    "_data/swanlake-latest/metadata.json",
    "utf-8"
  );
  const metadataJson = JSON.parse(metadataString);
  const releaseTag = metadataJson["version"];

  return `${editOnGithubBaseUrl}v${releaseTag}/examples`;
};

// markdown-it containers

// ballerina code jsx generator
md.use(container, "code", {
  validate: function (params) {
    return params.trim().match(/code\s+(.+\w)/);
  },
  render: function (tokens, idx, options, env, self) {
    if (tokens[idx].nesting === 1) {
      return `<Row className="bbeCode mx-0 py-0 rounded" style={{ marginLeft: "${
        env.marginLeftMultiplier * 8
      }px" }}>
  <Col className="d-flex align-items-start" sm={12}>
    ${
      env.playgroundLink != undefined
        ? `<button
        className="bg-transparent border-0 m-0 p-2 ms-auto"
        onClick={() => {
          window.open(
            "${env.playgroundLink}",
            "_blank"
          );
        }}
        target="_blank"
        aria-label="Open in Ballerina Playground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000"
          className="bi bi-play-circle"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
        </svg>
      </button>`
        : ""
    }
    <button
      className="bg-transparent border-0 m-0 p-2${
        env.playgroundLink != undefined ? "" : " ms-auto"
      }"
      onClick={() => {
        window.open("${env.editOnGithubLink}", "_blank");
      }}
      aria-label="Edit on Github"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#000"
        className="bi bi-github"
        viewBox="0 0 16 16"
      >
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    </button>
    {codeClick${env.codeCount} ? (
      <button className="bg-transparent border-0 m-0 p-2" disabled aria-label="Copy to Clipboard Check">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#45FF00"
          className="bi bi-check"
          viewBox="0 0 16 16"
        >
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
        </svg>
      </button>
    ) : (
      <button
        className="bg-transparent border-0 m-0 p-2"
        onClick={() => {
          updateCodeClick${env.codeCount}(true);
          copyToClipboard(codeSnippetData[${env.codeCount - 1}]);
          setTimeout(() => {
            updateCodeClick${env.codeCount}(false);
          }, 3000);
        }}
        aria-label="Copy to Clipboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000"
          className="bi bi-clipboard"
          viewBox="0 0 16 16"
        >
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
      </button>
    )}
  </Col>
  <Col sm={12}>
    {codeSnippets[${env.codeCount - 1}] != undefined && (
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(codeSnippets[${env.codeCount - 1}]),
        }}
      />
    )}
  </Col>
</Row>`;
    } else {
      return "";
    }
  },
});

// ballerina output jsx generator
md.use(container, "out", {
  validate: function (params) {
    return params.trim().match(/out\s+(.+\w)/);
  },
  render: function (tokens, idx, options, env, self) {
    const m = tokens[idx].info.trim().match(/out\s+(.+\w)/);

    if (tokens[idx].nesting === 1) {
      let filePath = `${env.relPath}/${m[1]}`;
      let outputRead = fs.readFileSync(filePath, "utf-8").trim();
      let outputSplitted = outputRead.split("\n");
      let output =
        `<Row className="bbeOutput mx-0 py-0 rounded" style={{ marginLeft: "${
          env.marginLeftMultiplier * 8
        }px" }}>
  <Col sm={12} className="d-flex align-items-start">
    {outputClick${env.outputCount} ? (
      <button
        className="bg-transparent border-0 m-0 p-2 ms-auto"
        aria-label="Copy to Clipboard Check"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#00FF19"
          className="output-btn bi bi-check"
          viewBox="0 0 16 16"
        >
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
        </svg>
      </button>
    ) : (
      <button
        className="bg-transparent border-0 m-0 p-2 ms-auto"
        onClick={() => {
          updateOutputClick${env.outputCount}(true);
          const extractedText = extractOutput(ref${
            env.outputCount
          }.current.innerText);
          copyToClipboard(extractedText);
          setTimeout(() => {
            updateOutputClick${env.outputCount}(false);
          }, 3000);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#EEEEEE"
          className="output-btn bi bi-clipboard"
          viewBox="0 0 16 16"
          aria-label="Copy to Clipboard"
        >
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
      </button>
    )}
  </Col>
  <Col sm={12}>
    <pre ref={ref${env.outputCount}}>
      <code className="d-flex flex-column">`.trim();
      outputSplitted.forEach((line) => {
        line = `{\`${escapeCharacterAdder(line, "out")}\`}`;
        output += `<span>${line}</span>\n`;
      });
      output += `</code></pre>
          </Col>
        </Row>`;

      return output;
    } else {
      return "";
    }
  },
});

// generate nav template
const generateNavContent = (bbeName, jsonContent) => {
  let prevCategory = "";
  let chapterNav = "";
  let categoryNav = "";
  let mainNav = "";
  let bbeTitle = "";

  let prevBBE = {};
  let nextBBE = {};

  let bbeFound = false;
  let expand = false;

  // iterating through the chapters
  jsonContent.forEach((chapter) => {
    let categoryName = chapter.category;

    // if category names change
    if (prevCategory.toLowerCase() !== categoryName.toLowerCase()) {
      if (chapterNav !== "") {
        mainNav += `${categoryNav}
<ol>
  ${chapterNav}
</ol>`;

        chapterNav = "";
      }

      categoryNav = `<li class="part-title">
  <div>${categoryName}</div>
  <a class="toggle-category"><div>❱</div></a>
</li>`;

      prevCategory = categoryName;
    }

    // details of the chapter
    let title = chapter.title;
    let bbeSamples = chapter.samples;
    let bbeNav = "";

    // iterating through bbes
    bbeSamples.forEach((bbe) => {
      let name = bbe["name"];
      let url = bbe["url"];

      if (url === bbeName) {
        bbeNav +=
          "\n" +
          `
<li class="chapter-item bal-nav-item expanded">
  <a
    href="/learn/by-example/${url}.html"
    class="active bal-active"
  >${name}</a>
</li>`.trim();

        categoryNav = `<li class="part-title expanded">
<div>${categoryName}</div>
<a class="toggle-category"><div>❱</div></a>
</li>`;

        bbeFound = true;
        expand = true;
        bbeTitle = name;
      } else {
        if (!bbeFound) prevBBE = { url, name };
        else if (bbeFound && Object.keys(nextBBE).length == 0)
          nextBBE = { url, name };

        bbeNav +=
          "\n" +
          `
<li class="chapter-item bal-nav-item">
  <a
    href="/learn/by-example/${url}.html"
  >${name}</a>
</li>`.trim();
      }
    });

    if (expand) {
      chapterNav +=
        "\n" +
        `
<li class="chapter-item bal-nav-item expanded">
  <div>${title}</div>
  <a class="toggle"><div>❱</div></a>
</li>
<li>
  <ol class="section">
    ${bbeNav}
  </ol>
</li>`.trim();

      expand = false;
    } else {
      chapterNav +=
        "\n" +
        `
<li class="chapter-item bal-nav-item">
  <div>${title}</div>
  <a class="toggle"><div>❱</div></a>
</li>
<li>
  <ol class="section">
    ${bbeNav}
  </ol>
</li>`.trim();
    }
  });

  mainNav += `${categoryNav}
<ol>
  ${chapterNav}
</ol>`;

  let navContent = `
  <nav id="sidebar" class="sidebar" aria-label="Table of contents">
    <div class="sidebar-scrollbox">
      <ol class="chapter">
        <li class="chapter-item bal-nav-item affix"></li>
        ${mainNav}
      </ol>
    </div>
  </nav>`.trim();

  return { bbeTitle, navContent, prevBBE, nextBBE };
};

// update the jsx file content
const generateContent = (
  bbeName,
  jsonContent,
  description,
  keywords,
  codeSection,
  codeCount,
  codeContentArray,
  outputCount,
  outputDir
) => {
  // navigation
  const { bbeTitle, navContent, prevBBE, nextBBE } = generateNavContent(
    bbeName,
    jsonContent
  );

  // liquid
  const liquid = {
    title: bbeTitle,
    description: description == null ? "" : description,
    keywords:
      keywords == null
        ? []
        : keywords
            .split(",")
            .filter((k) => k !== "")
            .map((k) => k.trim()),
    permalink: `/learn/by-example/${bbeName}`,
    active: bbeName,
    redirect_from: [
      `/swan-lake/learn/by-example/${bbeName}`,
      `/swan-lake/learn/by-example/${bbeName}.html`,
    ],
  };

  // buttons
  const prevButton =
    Object.keys(prevBBE).length != 0
      ? `<Col sm={6}>
      <Link
        title="${prevBBE.name}"
        href="/learn/by-example/${prevBBE.url}"
      >
        <div className="btnContainer d-flex align-items-center me-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#3ad1ca"
            className={\`\${
              btnHover[0] ? "btnArrowHover" : "btnArrow"
            } bi bi-arrow-right\`}
            viewBox="0 0 16 16"
            onMouseEnter={() => updateBtnHover([true, false])}
            onMouseOut={() => updateBtnHover([false, false])}
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
          <div className="d-flex flex-column ms-4">
            <span className="btnPrev">Previous</span>
            <span
              className={btnHover[0] ? "btnTitleHover" : "btnTitle"}
              onMouseEnter={() => updateBtnHover([true, false])}
              onMouseOut={() => updateBtnHover([false, false])}
            >
              ${prevBBE.name}
            </span>
          </div>
        </div>
      </Link>
    </Col>`
      : "";

  const nextButton =
    Object.keys(nextBBE).length != 0
      ? `<Col${
          Object.keys(prevBBE).length == 0 ? ` className="ms-auto"` : ""
        } sm={6}>
      <Link
        title="${nextBBE.name}"
        href="/learn/by-example/${nextBBE.url}"
      >
        <div className="btnContainer d-flex align-items-center ms-auto">
          <div className="d-flex flex-column me-4">
            <span className="btnNext">Next</span>
            <span
              className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
              onMouseEnter={() => updateBtnHover([false, true])}
              onMouseOut={() => updateBtnHover([false, false])}
            >
              ${nextBBE.name}
            </span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="#3ad1ca"
            className={\`\${
              btnHover[1] ? "btnArrowHover" : "btnArrow"
            } bi bi-arrow-right\`}
            viewBox="0 0 16 16"
            onMouseEnter={() => updateBtnHover([false, true])}
            onMouseOut={() => updateBtnHover([false, false])}
          >
            <path
              fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
          </svg>
        </div>
      </Link>
    </Col>`
      : "";

  // click states
  let codeClicks = "";
  let outputClicks = "";

  for (let i = 0; i < codeCount; i++) {
    codeClicks += `const [codeClick${i + 1}, updateCodeClick${
      i + 1
    }] = useState(false);\n`;
  }

  for (let i = 0; i < outputCount; i++) {
    outputClicks += `const [outputClick${i + 1}, updateOutputClick${
      i + 1
    }] = useState(false);\nconst ref${i + 1} = createRef()\n`;
  }

  codeClicks = codeClicks.trim();
  outputClicks = outputClicks.trim();

  // outputFormat
  output = `import React, { useState, useEffect, createRef } from "react";
import { setCDN } from "shiki";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import {
  copyToClipboard,
  extractOutput,
  shikiTokenizer,
} from "../../../utils/bbe";
import Link from "next/link";

setCDN("https://unpkg.com/shiki/");

const codeSnippetData = [${codeContentArray.join(",")}]

export default function ${kebabCaseToPascalCase(bbeName)}() {
  ${codeClicks}

  ${outputClicks}

  const [codeSnippets, updateSnippets] = useState([]);
  const [btnHover, updateBtnHover] = useState([false, false]);

  useEffect(() => {
    async function loadCode() {
      for (let snippet of codeSnippetData) {
        const output = await shikiTokenizer(snippet, "ballerina");
        updateSnippets((prevSnippets) => [...prevSnippets, output]);
      }
    }
    loadCode();
  }, []);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      ${codeSection}

      <Row className="mt-auto mb-5">
        ${prevButton}
        ${nextButton}
      </Row> 
    </Container>
  )
}`.trim();

  fs.mkdirSync(`${outputDir}/${bbeName}`);
  fs.writeFileSync(
    `${outputDir}/${bbeName}/liquid.json`,
    JSON.stringify(liquid)
  );
  fs.writeFileSync(`${outputDir}/${bbeName}/nav.html`, navContent);
  fs.writeFileSync(`${outputDir}/${bbeName}/content.jsx`, output);
};

// generate index.jsx content
const generateIndex = (bbeUrls) => {
  const importsArray = bbeUrls.map(
    (url) => `import ${kebabCaseToPascalCase(url)} from "./${url}/content.jsx";`
  );
  const objArray = bbeUrls.map((url) => kebabCaseToPascalCase(url));

  const output = `${importsArray.join("\n")}

const BBEs = {${objArray.join(",")}}

export default BBEs;`;

  // save file
  fs.writeFileSync(`${outputDir}/index.jsx`, output);
};

// generate files for the bbes
const generate = async (examplesDir, outputDir) => {
  try {
    const startTime = Date.now();

    // index.jsx file content
    const indexArray = [];

    // line extract regex
    const lineReg = /(\s*)(:::.*:::)/;

    // metadata extract regex
    const metaReg =
      platform.indexOf("win") !== -1
        ? /description:\s*(?<description>.+)\r\nkeywords:\s*(?<keywords>.+)/
        : /description:\s*(?<description>.+)\nkeywords:\s*(?<keywords>.+)/;

    // edit on github base url
    const editOnGithubBaseUrl = generateEditOnGithubLink(examplesDir);

    // index.json file
    const indexContent = fs.readFileSync(`${examplesDir}/index.json`, "utf-8");
    const jsonContent = JSON.parse(indexContent);

    // iterate through categories
    for (const chapter of jsonContent) {
      let title = chapter["title"];
      console.log(`Processing BBE Category : ${title}`);
      let bbes = chapter["samples"];

      // iterate through bbes
      for (const bbe of bbes) {
        let name = bbe["name"],
          url = bbe["url"],
          relPath = `${examplesDir}/${url}`,
          editOnGithubLink = `${editOnGithubBaseUrl}/${url}`;

        indexArray.push(url);

        let files = fs.readdirSync(relPath),
          description,
          keywords,
          codeSection,
          playground = true,
          codeCount = 0,
          outputCount = 0,
          codeContentArray = [];

        console.log(`\tProcessing BBE : ${name}`);

        if (
          bbe.hasOwnProperty("disablePlayground") &&
          bbe["disablePlayground"] === true
        ) {
          playground = false;
        }

        // iterate through files of a bbe
        for (const file of files) {
          const fileRelPath = `${examplesDir}/${url}/${file}`;

          if (fs.statSync(fileRelPath).isFile()) {
            // metatags file
            if (file.includes("metatags")) {
              const match = metaReg.exec(
                fs.readFileSync(fileRelPath, "utf-8").trim()
              );
              description = match.groups.description;
              keywords = match.groups.keywords;

              // markdown file
            } else if (file.includes(".md")) {
              let content = fs.readFileSync(fileRelPath, "utf-8").trim(),
                contentArray = content.split("\n"),
                updatedArray = [],
                codeSnippetRegex = /(\s*)```(\w+)/,
                codeSnippetFound = false,
                codeSnippetMarginLeftMultiplier = 0,
                codeSnippetLang,
                codeSnippetArray = [],
                listRegex = /^(\s*)(\d|-)(?:\.?)+\s*(.*)/;

              for (const line of contentArray) {
                let convertedLine;

                if (!codeSnippetFound) {
                  // ballerina content
                  if (line.includes("::: code")) {
                    let playgroundLink;
                    let m = line.match(lineReg);
                    codeCount++;

                    let { fileName, codeContent } = extractCode(relPath, m[2]);

                    if (playground) {
                      playgroundLink = await generatePlaygroundLink(
                        codeContent,
                        relPath,
                        fileName
                      );
                    }

                    convertedLine = md.render(m[2], {
                      codeCount,
                      marginLeftMultiplier: m[1].length,
                      playgroundLink,
                      editOnGithubLink,
                    });

                    codeContentArray.push(
                      `\`${escapeCharacterAdder(codeContent, "code")}\``
                    );

                    // ballerina output
                  } else if (line.includes("::: out")) {
                    let m = line.match(lineReg);
                    outputCount++;

                    convertedLine = md.render(m[2], {
                      outputCount,
                      relPath,
                      marginLeftMultiplier: m[1].length,
                    });
                  } else if (line.includes("```")) {
                    codeSnippetFound = true;
                    let match = line.match(codeSnippetRegex);
                    codeSnippetMarginLeftMultiplier = match[1].length;
                    codeSnippetLang = match[2];
                  } else if (listRegex.test(line)) {
                    let match = line.match(listRegex);
                    let listContent = md.render(match[3]);
                    convertedLine = `<ul style={{ marginLeft: "${
                      match[1].length * 8
                    }px" }}>
                    <li>
                        <span>${
                          match[2] === "-" ? `&#8226;&nbsp;` : `${match[2]}.`
                        }</span>
                        <span>${listContent.slice(
                          3,
                          listContent.length - 5
                        )}</span>
                    </li>
                </ul>`;
                  } else {
                    convertedLine = escapeParagraphCharacters(md.render(line));
                  }
                } else {
                  if (line.includes("```")) {
                    codeSnippetFound = false;
                    convertedLine = codeSnippetGenerator(
                      codeSnippetArray.join("\n"),
                      codeSnippetMarginLeftMultiplier,
                      codeSnippetLang
                    );
                  } else {
                    codeSnippetArray.push(
                      line.slice(codeSnippetMarginLeftMultiplier)
                    );
                  }
                }

                if (!codeSnippetFound) {
                  updatedArray.push(convertedLine);
                }
              }

              codeSection = updatedArray.join("\n");
            }
          }
        }

        generateContent(
          url,
          jsonContent,
          description,
          keywords,
          codeSection,
          codeCount,
          codeContentArray,
          outputCount,
          outputDir
        );
      }
    }

    // create index.jsx file
    generateIndex(indexArray);

    const executionTime = Date.now() - startTime;
    console.log("\nBBE generation completed");
    console.log(`Executed in ${executionTime / 1000}s`);
  } catch ({ message }) {
    console.log(message);
  }
};

const cmdArguments = process.argv;
const examplesDir = cmdArguments[2] ? cmdArguments[2] : "examples";
const outputDir = cmdArguments[3] ? cmdArguments[3] : "swan-lake/by-example";

generate(examplesDir, outputDir);
