import path from 'path';
import fs from 'fs';
import { getHighlighter } from "shiki";
import { load } from "js-yaml";


export async function readPattern(pattern) {
  const baseDirectory = path.resolve("pages/learn/enterprise-integration-patterns/enterprise-integration-patterns");
  const ymlPath = path.join(baseDirectory, pattern, pattern + ".yml");
  if (!fs.existsSync(ymlPath)) {
    return readPatternContent({}, pattern, [pattern + ".bal"]);
  }
  const yml = fs.readFileSync(ymlPath, "utf-8");
  var loadedProps = load(yml) || {};
  return readPatternContent(loadedProps, pattern, loadedProps.files || [pattern + ".bal"]);
}

 async function readPatternContent(loadedProps, pattern, files) {
  const name = pattern.replace(/-.|^./g, x => " " + x.slice(-1).toUpperCase());
  const baseDirectory = path.resolve("pages/learn/enterprise-integration-patterns/enterprise-integration-patterns");
  loadedProps.content = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(baseDirectory, pattern, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const [header, main] = split(content);
    const headerCode = await highlight(header);
    const mainCode = await highlight(main);
    loadedProps.content.push({ headerCode, mainCode, raw: content, name: file });
  }
  loadedProps.name = loadedProps.name ?? name;
  return { props: loadedProps };
}

const regex = /\n(service|function|public function)/g;

function split(content){
    const i = content.search(regex);
    if(i < 80) {
        return ["", content];
    }
    return [content.slice(0, i), content.slice(i)];
}

const highlighterPromise = getHighlighter({ theme: 'github-light' });

async function highlight(src){
  if (!src) {
    return "";
  }
  return (await highlighterPromise).codeToHtml(src, { lang: 'ballerina' });
}
