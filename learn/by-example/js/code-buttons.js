const playground = document.getElementsByClassName("bi-play-circle");
const github_edit = document.getElementsByClassName("bi-github");
const clipboard = document.getElementsByClassName("bi-clipboard");
const check = document.getElementsByClassName("bi-check");

const code_blocks = document.getElementsByClassName("code-container");
const activeHREF = document
  .getElementsByClassName("active")[1]
  .getAttribute("href");
const regexURL = /\/by-example\/(?<url>(?:\w|-)+).html/gm;

const url = regexURL.exec(activeHREF).groups.url;

for (let i = 0; i < code_blocks.length; i++) {
  clipboard[i].addEventListener("click", () => {
    navigator.clipboard.writeText(code_blocks[i].innerText);

    const button2 = clipboard[i].parentElement;
    const button3 = check[i].parentElement;

    button2.style.display = "none";
    button3.style.display = "flex";

    setTimeout(() => {
      button2.style.display = "flex";
      button3.style.display = "none";
    }, 3000);
  });

  github_edit[i].addEventListener("click", () => {
    window.open(
      `https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/${url}`,
      "_blank"
    );
  });

  playground[i].addEventListener("click", () => {
    const playgroundLink =
      playground[i].parentElement.getAttribute("playgroundLink");
    window.open(playgroundLink, "_blank");
  });
}
