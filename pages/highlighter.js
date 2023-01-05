import { getHighlighter } from "shiki";

String.prototype.hashCode = function () {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

const highlight = async (content) => {
    const highlighter = await getHighlighter({
        theme: 'github-light'
    });
    let codes = new Map();
    const regex = /```(\w+)([\s\S]*?)```/g;
    let match = [];
    while (match = regex.exec(content)) {
        let code = match[2];
        const firstLine = code.split('/n')[0];
        const indent = firstLine.length - firstLine.trimStart().length;
        const key = code.trim().split(/\r?\n/).map(row => row.trim()).join('\n');
        code = code.split(/\r?\n/).map(row => row.substring(indent - 1)).join('\n');

        codes.set(key.hashCode(), highlighter.codeToHtml(code.trim(), { lang: match[1] }));
    }
    return JSON.stringify([...codes]);
}

export { highlight };
