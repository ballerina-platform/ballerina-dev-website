import { getHighlighter, setCDN } from "shiki";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const extractOutput = (text) => {
  const regex = /(?:\n|^)\$\s+(?<exec_command>.*)(?:\n?)/;
  const match = regex.exec(text);

  return match === null ? "" : match.groups.exec_command;
};

const shikiTokenizer = async (code, lang) => {
  let output;

  try {
    const highlighter = await getHighlighter({
      theme: "github-light",
      langs: [lang],
    });
    output = highlighter.codeToHtml(code, { lang: lang });
  } catch (e) {
    console.log(e);
  }

  return output;
};

export { copyToClipboard, extractOutput, shikiTokenizer };
