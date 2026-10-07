// Mirrors the heading id generation in MainContent.js and Toc.js
const toHeadingId = (text) =>
  text
    .replace(/`/g, "")
    .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
    .toLowerCase()
    .replace(/ /g, "-");

const toRuleAnchor = (ruleId) => ruleId.toLowerCase().replace(/[/:]/g, "-");

// Maps each rule heading's id to a title-independent anchor derived from its Rule ID (e.g. ballerina/os:2 -> ballerina-os-2)
const getRuleAnchors = (content) => {
  const anchors = {};
  const seenHeadings = [];
  let currentHeadingId = null;
  let inCodeBlock = false;

  content.split("\n").forEach((line) => {
    if (/^\s*```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      return;
    }
    if (inCodeBlock) return;

    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      const id = toHeadingId(heading[1].trim());
      const count = seenHeadings.filter((seen) => seen === id).length;
      seenHeadings.push(id);
      currentHeadingId = count === 0 ? id : `${id}-${count}`;
      return;
    }

    const ruleId = line.match(/^\|\s*\*\*Rule ID\*\*\s*\|\s*([^|\s]+)\s*\|/);
    if (ruleId && currentHeadingId) {
      anchors[currentHeadingId] = toRuleAnchor(ruleId[1]);
    }
  });

  return anchors;
};

export { getRuleAnchors };
