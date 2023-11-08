import path from 'path';
import fs from 'fs';
import { getHighlighter } from "shiki";
import { load } from "js-yaml";

export async function readPattern(pattern) {
  const baseDirectory = path.resolve("pages/learn/enterprise-integration-patterns/enterprise-integration-patterns");
  const highlighter = await getHighlighter({ theme: 'github-light' });
  const ymlPath = path.join(baseDirectory, pattern, pattern + ".yml");
  const source = fs.readFileSync(path.join(baseDirectory, pattern, pattern + ".bal"), "utf-8");
  const [header, main] = split(source);
  const headerCode = header.length > 0 ? highlighter.codeToHtml(header, { lang: 'ballerina' }) : "";
  const mainCode = highlighter.codeToHtml(main, { lang: 'ballerina' });
  const name = pattern.replace(/-.|^./g, x => " " + x.slice(-1).toUpperCase());
  if (!fs.existsSync(ymlPath)) {
    return { props: { mainCode, headerCode, name } };
  }
  const yml = fs.readFileSync(ymlPath, "utf-8");
  var patternProps = load(yml) || {};
  patternProps.headerCode = headerCode;
  patternProps.mainCode = mainCode;
  patternProps.name = patternProps.name ?? name;
  patternProps.raw = source;
  return { props: patternProps };
}

function split(content){
    const regex = /\n(service|function|public function)/g;
    const i = content.search(regex);
    if(i < 80) {
        return ["", content];
    }
    return [content.slice(0, i), content.slice(i)];
}
