const playground = document.getElementsByClassName("bi-play-circle");
const github_edit = document.getElementsByClassName("bi-github");

const clipboard_code = document.querySelectorAll(".code-btn.bi-clipboard");
const clipboard_output = document.querySelectorAll(".output-btn.bi-clipboard");

const check_code = document.querySelectorAll(".code-btn.bi-check");
const check_output = document.querySelectorAll(".output-btn.bi-check");

const code_blocks = document.getElementsByClassName("code-container");
const output_blocks = document.getElementsByClassName("output-container");

const activeHREF = document
  .getElementsByClassName("active")[1]
  .getAttribute("href");

const regexURL = /\/by-example\/(?<url>(?:\w|-)+).html/gm;
const regexOut = /(?:\n|^)\$\s+(?<exec_command>.*)(?:\n?)/;

const url = regexURL.exec(activeHREF).groups.url;

for (let i = 0; i < code_blocks.length; i++) {
  clipboard_code[i].addEventListener("click", () => {
    navigator.clipboard.writeText(code_blocks[i].innerText);

    const button2_code = clipboard_code[i].parentElement;
    const button3_code = check_code[i].parentElement;

    button2_code.style.display = "none";
    button3_code.style.display = "flex";

    setTimeout(() => {
      button2_code.style.display = "flex";
      button3_code.style.display = "none";
    }, 3000);
  });

  github_edit[i].addEventListener("click", () => {
    window.open(
      `https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/${url}`,
      "_blank"
    );
  });

  if (playground.length !== 0) {
    playground[i].addEventListener("click", () => {
      const playgroundLink =
        playground[i].parentElement.getAttribute("playgroundLink");
      window.open(playgroundLink, "_blank");
    });
  }
}

for (let j = 0; j < output_blocks.length; j++) {
  clipboard_output[j].addEventListener("click", () => {
    const match = regexOut.exec(output_blocks[j].innerText);
    navigator.clipboard.writeText(
      match == null ? "" : match.groups.exec_command
    );

    const button2_output = clipboard_output[j].parentElement;
    const button3_output = check_output[j].parentElement;

    button2_output.style.display = "none";
    button3_output.style.display = "flex";
    button3_output.style.marginLeft = "auto";

    setTimeout(() => {
      button2_output.style.display = "flex";
      button3_output.style.display = "none";
      button3_output.style.marginLeft = "0";
    }, 3000);
  });
}
