import { getHighlighter, setCDN } from "shiki";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const removeEscapes = (content) => {
  return content.replace("\\", "");
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

export { copyToClipboard, removeEscapes, shikiTokenizer };
