// imports
const md = require("markdown-it")();
const container = require("markdown-it-container");
const fs = require("fs");
const axios = require("axios");

// yaml character escapes
const yamlEscape = (text) => {
  text = text.replaceAll("&", "&amp;");
  text = text.replaceAll(":", "&#58;");

  return text;
};

// insert escape characters
const insertEscapes = (text) => {
  text = text.replaceAll("<", "&lt;");
  text = text.replaceAll(">", "&gt;");

  return text;
};

// sleeper
const sleep = (timeout) => {
  const start = Date.now();
  let end = null;
  do {
    end = Date.now();
  } while (end < start + timeout);
};

// playground link generator
const generatePlaygroundLink = async (line, exampleDir, description) => {
  let playgroundLink = null;
  let m = line.trim().match(/code\s+(.*\w)/);
  let m_fileName = m[1].match(/\w+\.\w+/);

  let content = fs.readFileSync(`${exampleDir}/${m[1]}`, "utf-8");
  let fileName = m_fileName[0];

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

// markdown-it containers
md.use(container, "code", {
  validate: function (params) {
    return params.trim().match(/code\s+(.+\w)/);
  },
  render: function (tokens, idx, options, env, self) {
    const m = tokens[idx].info.trim().match(/code\s+(.+\w)/);

    if (tokens[idx].nesting === 1) {
      let filePath = `${env.relPath}/${m[1]}`;
      let codeContent = fs.readFileSync(filePath, "utf-8").trim();
      codeContent = insertEscapes(codeContent);
      return `<pre style="margin-left: ${
        env.marginLeftMultiplier * 8
      }px;"><code id="code" class="code-container">${codeContent}</code>${
        env.playgroundLink != undefined
          ? `
  <button playgroundLink="${env.playgroundLink}">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-play-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
    </svg>
  </button>`
          : "\n"
      }
  <button>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-github" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  </button>
  <button>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="code-btn bi bi-clipboard" viewBox="0 0 16 16">
      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>
  </button>
  <button class="check-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#45FF00" class="code-btn bi bi-check" viewBox="0 0 16 16">
      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
    </svg>
  </button>
</pre>`.trim();
    } else {
      return "";
    }
  },
});

md.use(container, "out", {
  validate: function (params) {
    return params.trim().match(/out\s+(.*\w)/);
  },
  render: function (tokens, idx, options, env, self) {
    const m = tokens[idx].info.trim().match(/out\s+(.*\w)/);

    if (tokens[idx].nesting === 1) {
      let filePath = `${env.relPath}/${m[1]}`;
      let outputRead = fs.readFileSync(filePath, "utf-8").trim();
      let outputSplitted = outputRead.split("\n");
      let output = `<pre style="margin-left: ${
        env.marginLeftMultiplier * 8
      }px;" class="output-container"><code class="language-bash">`;
      outputSplitted.forEach((line) => {
        line = insertEscapes(line);
        output += `<span class="bal-output bal-execute">${line}</span>\n`;
      });
      output =
        output.trim() +
        `</code>
      
  <button>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#EEEEEE" class="output-btn bi bi-clipboard" viewBox="0 0 16 16">
      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>
  </button>
  <button class="check-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#00FF19" class="output-btn bi bi-check" viewBox="0 0 16 16">
      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
    </svg>
  </button>      
</pre>`;

      return output;
    } else {
      return "";
    }
  },
});

// render code snippet
const codeSnippetGenerator = (code, marginLeftMultiplier, lang) => {
  let output = `<pre style="margin-left: ${
    marginLeftMultiplier * 8
  }px;" class="code-snippet ${lang}"><code>${code}</code></pre>`;

  return output;
};

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

// update the HTML file content
const generateHTML = (
  bbeName,
  jsonContent,
  metatags,
  codeSection,
  outputDir
) => {
  // navigation
  const { bbeTitle, navContent, prevBBE, nextBBE } = generateNavContent(
    bbeName,
    jsonContent
  );

  // liquid
  const liquid = `
---
layout: ballerina-example-page-old
title: ${yamlEscape(bbeTitle)}
${metatags}
permalink: /learn/by-example/${bbeName}
active: ${bbeName}
redirect_from:
    - /swan-lake/learn/by-example/${bbeName}
    - /swan-lake/learn/by-example/${bbeName}.html
---
    `.trim();

  // buttons
  const prevButton =
    Object.keys(prevBBE).length != 0
      ? `<a
  title="${prevBBE.name}"
  href="/learn/by-example/${prevBBE.url}.html"
  class="prev-button"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="#3ad1ca"
    class="bi bi-arrow-left"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
    />
  </svg>
  <div class="button-title">
    <span>Previous</span>
    <div>${prevBBE.name}</div>
  </div>
</a>`
      : "";

  const nextButton =
    Object.keys(nextBBE).length != 0
      ? `<a
  title="${nextBBE.name}"
  href="/learn/by-example/${nextBBE.url}.html"
  class="next-button"
>
  <div class="button-title">
    <span>Next</span>
    <div>${nextBBE.name}</div>
  </div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="#3ad1ca"
    class="bi bi-arrow-right"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
    />
  </svg>
</a>`
      : "";

  // outputFormat
  output = `
${liquid}
<div class="bbe-container">
  ${navContent}
  <main class="bal-container">
    ${codeSection}
    <br />
    <div class="button-container">
      ${prevButton}
      ${nextButton}
    </div>
  </main>  
</div>`.trim();
  fs.writeFileSync(`${outputDir}/${bbeName}.html`, output);
};

// generate HTML files for the bbes
const generate = async (examplesDir, outputDir) => {
  try {
    const startTime = Date.now();

    // index.json file
    const indexContent = fs.readFileSync(`${examplesDir}/index.json`, "utf-8");
    const jsonContent = JSON.parse(indexContent);

    for (const chapter of jsonContent) {
      let title = chapter["title"];
      console.log(`Processing BBE Category : ${title}`);
      let bbes = chapter["samples"];

      for (const bbe of bbes) {
        let name = bbe["name"];
        console.log(`\tProcessing BBE : ${name}`);
        let url = bbe["url"];
        let relPath = `${examplesDir}/${url}`;
        let files = fs.readdirSync(relPath);
        let metatags = "";
        let codeSection = "";
        let playground = true;

        if (bbe["disablePlayground"] && bbe["disablePlayground"] === true) {
          playground = false;
        }

        for (const file of files) {
          const fileRelPath = `${examplesDir}/${url}/${file}`;

          if (fs.statSync(fileRelPath).isFile()) {
            if (file.includes("metatags")) {
              metatags = fs.readFileSync(fileRelPath, "utf-8").trim();
            } else if (file.includes(".md")) {
              let content = fs.readFileSync(fileRelPath, "utf-8").trim();
              let contentArray = content.split("\n");
              let updatedArray = [];

              let codeSnippetRegex = /(\s*)```(\w+)/;
              let codeSnippetFound = false;
              let codeSnippetMarginLeftMultiplier = 0;
              let codeSnippetLang;
              let codeSnippetArray = [];

              let listRegex = /^(\s*)(\d|-)(?:\.?)+\s*(.*)/;

              for (const line of contentArray) {
                let convertedLine;

                if (!codeSnippetFound) {
                  if (line.includes("::: code")) {
                    let playgroundLink;

                    if (playground) {
                      playgroundLink = await generatePlaygroundLink(
                        line,
                        relPath,
                        url
                      );
                    }

                    let match = line.match(/(\s*)(:::.*:::)/);

                    convertedLine = md.render(match[2], {
                      marginLeftMultiplier: match[1].length,
                      playgroundLink,
                      relPath,
                    });
                  } else if (line.includes("::: out")) {
                    let match = line.match(/(\s*)(:::.*:::)/);

                    convertedLine = md.render(match[2], {
                      marginLeftMultiplier: match[1].length,
                      relPath,
                    });
                  } else if (line.includes("```")) {
                    codeSnippetFound = true;
                    let match = line.match(codeSnippetRegex);
                    codeSnippetMarginLeftMultiplier = match[1].length;
                    codeSnippetLang = match[2];
                  } else if (listRegex.test(line)) {
                    let match = line.match(listRegex);
                    let listContent = md.render(match[3]);
                    convertedLine = `<ul style="margin-left: ${
                      match[1].length * 8
                    }px;">
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
                    convertedLine = md.render(line);
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

        generateHTML(url, jsonContent, metatags, codeSection, outputDir);
      }
    }

    const executionTime = Date.now() - startTime;
    console.log("\nHTML generation completed");
    console.log(`Executed in ${executionTime / 1000}s`);
  } catch ({ message }) {
    console.log(message);
  }
};

const cmdArguments = process.argv;
const examplesDir = cmdArguments[2] ? cmdArguments[2] : "./examples";
const outputDir = cmdArguments[3] ? cmdArguments[3] : "./learn/by-example";

generate(examplesDir, outputDir);
