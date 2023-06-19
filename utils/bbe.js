const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const extractOutput = (text) => {
  const regex = /(?:\n|^)\$\s+(?<exec_command>.*)(?:\n?)/;
  const match = regex.exec(text);

  return match === null ? "" : match.groups.exec_command;
};

export { copyToClipboard, extractOutput };
