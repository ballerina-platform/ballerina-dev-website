
const whitespaceRegEx = /\s*\n\s*/g;
const trimWhitespace = (input) => input.replaceAll(whitespaceRegEx, "").trim();


function transformerCopyButton(options = {
    feedbackDuration: 3000
}) {
    return {
        name: "copy-button-transformer",
        code(node) {
            node.children.unshift({
                type: "element",
                tagName: "button",
                properties: {
                    type: "button",
                    title: "Copy code",
                    "aria-label": "Copy code",
                    data: this.source,
                    class: "rehype-pretty-copy",
                    onclick: trimWhitespace(
                        `
            navigator.clipboard.writeText(this.attributes.data.value);
            this.classList.add('rehype-pretty-copied');
            window.setTimeout(() => this.classList.remove('rehype-pretty-copied'), ${options.feedbackDuration});
          `
                    )
                },
                children: [
                    {
                        type: "element",
                        tagName: "span",
                        properties: { class: "ready" },
                        children: []
                    },
                    {
                        type: "element",
                        tagName: "span",
                        properties: { class: "success" },
                        children: []
                    }
                ]
            });
            node.children.push({
                type: "element",
                tagName: "style",
                properties: {},
                children: [
                    {
                        type: "text",
                        value: copyButtonStyle({
                            copyIcon: options.copyIcon,
                            successIcon: options.successIcon,
                            visibility: options.visibility
                        })
                    }
                ]
            });
        }
    };
}
function copyButtonStyle({
                             copyIcon = "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 448 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg' style='float: right;'%3E%3Ctitle%3ECopy%3C/title%3E%3Cpath d='M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z'%3E%3C/path%3E%3C/svg%3E",
                             successIcon = "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3ECopied%3C/title%3E%3Cpath d='M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z'%3E%3C/path%3E%3C/svg%3E"} = {}) {
    let copyButtonStyle2 = (
        `
    :root {
      --copy-icon: url("${copyIcon}");
      --success-icon: url("${successIcon}");
    }
    pre:has(code) {
      position: relative;
    }
    pre button.rehype-pretty-copy {
      background-color: transparent;
      border: none;
      right: 1px;
      padding: 0;
      width: 16px;
      height: 16px;
      display: flex;
      margin-top: -20px;
      margin-right: 8px;
      position: absolute;
      backdrop-filter: blur(3px);
      & span {
        width: 100%;
        aspect-ratio: 1 / 1;
      }
      & .ready {
        background-image: var(--copy-icon);
      }
      & .success {
        display: none; background-image: var(--success-icon);
      }
    }
    &.rehype-pretty-copied { 
      & .success { 
        display: block;
      } & .ready {
        display: none;
      }
    }
    pre button.rehype-pretty-copy.rehype-pretty-copied {
      opacity: 1;
      & .ready { display: none; }
      & .success { display: block; }
    }
`
    );
    return trimWhitespace(copyButtonStyle2);
}

export { transformerCopyButton };