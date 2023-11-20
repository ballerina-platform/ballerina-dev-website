Prism.languages.ballerina = {
  comment: /\/\/[^\r\n]*/,
  string: {
    pattern: /("(?:[^\\"]|\\.)*(?:"|$)|(`(?:[^\\`])*(?:`)))/,
    greedy: true,
  },
  boolean: /\b(?:true|false)\b/,
  keyword: new RegExp(
    "\\b(?:" +
      "abstract|annotation|any|anydata|as|ascending|base16|base64|boolean|break|by|byte|check|checkpanic|class" +
      "|client|commit|configurable|conflict|const|continue|decimal|default|descending|distinct|do|else|enum|equals|error" +
      "|external|fail|false|field|final|float|flush|foreach|fork|from|function|future|handle|if|import" +
      "|in|int|is|isolated|join|json|key|let|limit|listener|lock|map|match|module|never" +
      "|new|null|object|on|order|outer|panic|parameter|private|public|readonly|record|remote|resource|retry" +
      "|return|returns|rollback|select|service|source|start|stream|string|table|transaction|transactional|trap|true|type" +
      "|typedesc|typeof|var|variable|version|wait|where|while|worker|xml|xmlns" +
      ")\\b"
  ),
  operator: /(?:!|%|\+|\-|~|=|=|!|<|>|&|\|)/,
  number: /\b0[xX][\da-f]+\b|\b\d+\.?\d*/,
};
