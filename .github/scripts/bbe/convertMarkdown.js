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

// imports
const md = require("markdown-it")({ xhtmlOut: true });
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
  if (content === "") {
    return "\n";
  } else {
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
            tempContent = "\\`";
            break;
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
        output += `\`}{\`${codeContent}\`}{\``;
        codeContent = "";
      } else if (!open) {
        output += tempContent;
        tempContent = "";
      }
    }

    return output;
  }
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
  let output = `<pre style={{ marginLeft: "${marginLeftMultiplier * 8}px" }} 
    className="p-3 rounded ${lang}"><code>${code}</code></pre>`;

  return output;
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
      return `<Row className="bbeCode mx-0 py-0 rounded 
      ${env.isIndent ? 'indent' : ''}" 
      style={{ marginLeft: "${env.marginLeftMultiplier * 8}px" }}>
  <Col className="d-flex align-items-start" sm={12}>
    ${env.playgroundLink != undefined
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
      <svg width="16" height="16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>Open in Ballerina Visual Studio Code</title>
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M70.9119 99.3171C72.4869 99.9307 74.2828 99.8914 75.8725 99.1264L96.4608 89.2197C98.6242 88.1787 100 85.9892 100 83.5872V16.4133C100 14.0113 98.6243 11.8218 96.4609 10.7808L75.8725 0.873756C73.7862 -0.130129 71.3446 0.11576 69.5135 1.44695C69.252 1.63711 69.0028 1.84943 68.769 2.08341L29.3551 38.0415L12.1872 25.0096C10.589 23.7965 8.35363 23.8959 6.86933 25.2461L1.36303 30.2549C-0.452552 31.9064 -0.454633 34.7627 1.35853 36.417L16.2471 50.0001L1.35853 63.5832C-0.454633 65.2374 -0.452552 68.0938 1.36303 69.7453L6.86933 74.7541C8.35363 76.1043 10.589 76.2037 12.1872 74.9905L29.3551 61.9587L68.769 97.9167C69.3925 98.5406 70.1246 99.0104 70.9119 99.3171ZM75.0152 27.2989L45.1091 50.0001L75.0152 72.7012V27.2989Z" fill="white"></path>
        </mask>
        <g mask="url(#mask0)">
        <path d="M96.4614 10.7962L75.8569 0.875542C73.4719 -0.272773 70.6217 0.211611 68.75 2.08333L1.29858 63.5832C-0.515693 65.2373 -0.513607 68.0937 1.30308 69.7452L6.81272 74.754C8.29793 76.1042 10.5347 76.2036 12.1338 74.9905L93.3609 13.3699C96.086 11.3026 100 13.2462 100 16.6667V16.4275C100 14.0265 98.6246 11.8378 96.4614 10.7962Z" fill="#0065A9"></path>
        <g filter="url(#filter0_d)">
        <path d="M96.4614 89.2038L75.8569 99.1245C73.4719 100.273 70.6217 99.7884 68.75 97.9167L1.29858 36.4169C-0.515693 34.7627 -0.513607 31.9063 1.30308 30.2548L6.81272 25.246C8.29793 23.8958 10.5347 23.7964 12.1338 25.0095L93.3609 86.6301C96.086 88.6974 100 86.7538 100 83.3334V83.5726C100 85.9735 98.6246 88.1622 96.4614 89.2038Z" fill="#007ACC"></path>
        </g>
        <g filter="url(#filter1_d)">
        <path d="M75.8578 99.1263C73.4721 100.274 70.6219 99.7885 68.75 97.9166C71.0564 100.223 75 98.5895 75 95.3278V4.67213C75 1.41039 71.0564 -0.223106 68.75 2.08329C70.6219 0.211402 73.4721 -0.273666 75.8578 0.873633L96.4587 10.7807C98.6234 11.8217 100 14.0112 100 16.4132V83.5871C100 85.9891 98.6234 88.1786 96.4586 89.2196L75.8578 99.1263Z" fill="#1F9CF0"></path>
        </g>
        <g style="mix-blend-mode:overlay" opacity="0.25">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M70.8511 99.3171C72.4261 99.9306 74.2221 99.8913 75.8117 99.1264L96.4 89.2197C98.5634 88.1787 99.9392 85.9892 99.9392 83.5871V16.4133C99.9392 14.0112 98.5635 11.8217 96.4001 10.7807L75.8117 0.873695C73.7255 -0.13019 71.2838 0.115699 69.4527 1.44688C69.1912 1.63705 68.942 1.84937 68.7082 2.08335L29.2943 38.0414L12.1264 25.0096C10.5283 23.7964 8.29285 23.8959 6.80855 25.246L1.30225 30.2548C-0.513334 31.9064 -0.515415 34.7627 1.29775 36.4169L16.1863 50L1.29775 63.5832C-0.515415 65.2374 -0.513334 68.0937 1.30225 69.7452L6.80855 74.754C8.29285 76.1042 10.5283 76.2036 12.1264 74.9905L29.2943 61.9586L68.7082 97.9167C69.3317 98.5405 70.0638 99.0104 70.8511 99.3171ZM74.9544 27.2989L45.0483 50L74.9544 72.7012V27.2989Z" fill="url(#paint0_linear)"></path>
        </g>
        </g>
        <defs>
        <filter id="filter0_d" x="-8.39411" y="15.8291" width="116.727" height="92.2456" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
        <feOffset></feOffset>
        <feGaussianBlur stdDeviation="4.16667"></feGaussianBlur>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
        <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
        </filter>
        <filter id="filter1_d" x="60.4167" y="-8.07558" width="47.9167" height="116.151" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"></feColorMatrix>
        <feOffset></feOffset>
        <feGaussianBlur stdDeviation="4.16667"></feGaussianBlur>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
        <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend>
        </filter>
        <linearGradient id="paint0_linear" x1="49.9392" y1="0.257812" x2="49.9392" y2="99.7423" gradientUnits="userSpaceOnUse">
        <stop stop-color="white"></stop>
        <stop offset="1" stop-color="white" stop-opacity="0"></stop>
        </linearGradient>
        </defs>
      </svg>
      </button>`
        : ""
    } 
    ${(env.editOnGithubLink !== "") ? `
    <button
      className="bg-transparent border-0 m-0 p-2${env.playgroundLink != undefined ? "" : " ms-auto"}"
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
        <title>Edit on Github</title>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    </button>`
          : ""
    }
    {codeClick${env.codeCount} ? (
      <button className="bg-transparent border-0 m-0 p-2${env.editOnGithubLink !== "" ? "" : " ms-auto"}" 
        disabled aria-label="Copy to Clipboard Check">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#20b6b0"
          className="bi bi-check"
          viewBox="0 0 16 16"
        >
          <title>Copied</title>
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
        </svg>
      </button>
    ) : (
      <button
        className="bg-transparent border-0 m-0 p-2${env.editOnGithubLink === "" && env.playgroundLink === undefined  ? " ms-auto" : ""}"
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
          <title>Copy to Clipboard</title>
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
        `<Row className="bbeOutput mx-0 py-0 rounded ${env.isIndent ? 'indent' : ''}" 
          style={{ marginLeft: "${env.marginLeftMultiplier * 8}px" }}>
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
          fill="#20b6b0"
          className="output-btn bi bi-check"
          viewBox="0 0 16 16"
        >
          <title>Copied</title>
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
        </svg>
      </button>
    ) : (
      <button
        className="bg-transparent border-0 m-0 p-2 ms-auto"
        onClick={() => {
          updateOutputClick${env.outputCount}(true);
          const extractedText = extractOutput(ref${env.outputCount}.current.innerText);
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
          <title>Copy to Clipboard</title>
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

// find previous/next bbes
const findPrevNextBBEs = (bbeName, jsonContent) => {
  let bbeTitle = "",
    prevBBE = {},
    nextBBE = {},
    bbeFound = false,
    expand = false;

  // iterating through the chapters
  jsonContent.forEach((chapter) => {
    let bbeSamples = chapter.samples;

    // iterating through bbes
    bbeSamples.forEach((bbe) => {
      let name = bbe["name"],
        url = bbe["url"];

      if (url === bbeName) {
        bbeFound = true;
        expand = true;
        bbeTitle = name;
      } else {
        if (!bbeFound) prevBBE = { url, name };
        else if (bbeFound && Object.keys(nextBBE).length == 0)
          nextBBE = { url, name };
      }
    });
  });

  return { bbeTitle, prevBBE, nextBBE };
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
  const { bbeTitle, prevBBE, nextBBE } = findPrevNextBBEs(bbeName, jsonContent);

  // liquid
  const liquid = {
    title: bbeTitle,
    description,
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
      ? `<Col${Object.keys(prevBBE).length == 0 ? ` className="ms-auto"` : ""} sm={6}>
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
    codeClicks += `const [codeClick${i + 1}, updateCodeClick${i + 1}] = useState(false);\n`;
  }

  for (let i = 0; i < outputCount; i++) {
    outputClicks += `const [outputClick${i + 1}, updateOutputClick${i + 1}] = useState(false);\nconst ref${i + 1} = createRef()\n`;
  }

  codeClicks = codeClicks.trim();
  outputClicks = outputClicks.trim();

  // outputFormat
  output = `import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import {
  copyToClipboard,
  extractOutput,
} from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [${codeContentArray.join(",")}];

export function ${kebabCaseToPascalCase(bbeName)}({codeSnippets}) {
  ${codeClicks}

  ${outputClicks}

  const [btnHover, updateBtnHover] = useState([false, false]);

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
  fs.writeFileSync(`${outputDir}/${bbeName}/content.jsx`, output);
};

// generate index.jsx content
const generateIndex = (bbeUrls) => {
  const importsArray = bbeUrls.map(
    (url) => `import { ${kebabCaseToPascalCase(url)}, codeSnippetData as ${kebabCaseToPascalCase(url)}CodeSnippetData } from "./${url}/content.jsx";`
  );
  const objArray = bbeUrls.map((url) => `${kebabCaseToPascalCase(url)}, ${kebabCaseToPascalCase(url)}CodeSnippetData`);

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
          editOnGithubLink = "";

        // Check whether the BBE can be edited in github
        try {
          const response = await axios.get(`${editOnGithubBaseUrl}/${url}`);
          if (response.status === 200) {
            editOnGithubLink = `${editOnGithubBaseUrl}/${url}`;
          }
        } catch (err) {
          console.error(err)
        }

        indexArray.push(url);

        let files = fs.readdirSync(relPath),
          metatagsReg = /.metatags$/,
          metatagsFound = files.some((file) => metatagsReg.test(file)),
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
            if (metatagsFound && file.includes("metatags")) {
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
                listRegex = /^(\s*)(\d+|-)(?:\.?)+\s*(.*)/;
                relatedLinks = false;

              for (const line of contentArray) {
                let convertedLine;
                if (description === undefined && !metatagsFound) {
                  if (/^\w/.test(line)) description = line;
                }

                if (!codeSnippetFound) {
                  // ballerina content

                  let isIndent = false;

                  if (line.match(/^\s+::: code/) || line.match(/^\s+::: out/)) {
                    isIndent = true;
                  }

                  if (line.includes("## Related links")) {
                    relatedLinks = true;
                  }

                  if (line.includes("::: code")) {
                    let playgroundLink;
                    let m = line.match(lineReg);
                    codeCount++;

                    let { fileName, codeContent } = extractCode(relPath, m[2]);

                    if (playground) {
                      playgroundLink = `vscode://wso2.ballerina/open-file?repoFileUrl=${editOnGithubLink}/${file}`;
                    }

                    convertedLine = md.render(m[2], {
                      codeCount,
                      marginLeftMultiplier: m[1].length,
                      playgroundLink,
                      editOnGithubLink,
                      isIndent
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
                      isIndent
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
                        }px" 
                      }} ${
                        relatedLinks ? 'class="relatedLinks"' : ''
                      }>
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
              if(relatedLinks) {
                codeSection = codeSection + "<span style={{marginBottom:'20px'}}></span>";
              }
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
