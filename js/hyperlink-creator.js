const sessions = document.getElementsByClassName("shell-session");
const hyperlink = /\[(?:\w|-| )+\]\((?:\w|:|\/|-| |.)+\)/g;

const hyperlink_generator = (links) => {
  let hyperlinks = [];
  links.forEach((link) => {
    let content = "";
    let href_link = "";

    let readingContent = false;
    let readingLink = false;

    for (let i = 0; i < link.length; i++) {
      if (link[i] === "[") {
        readingContent = true;
      } else if (link[i] === "]") {
        readingContent = false;
      } else if (link[i] === "(") {
        readingLink = true;
      } else if (link[i] === ")") {
        readingLink = false;
      } else if (readingContent) {
        content += link[i];
      } else if (readingLink) {
        href_link += link[i];
      }
    }

    hyperlinks.push(`<a href="${href_link}">${content}</a>`);
  });

  return hyperlinks;
};

const hyperlink_finder = (output) => {
  let generated_links = [];
  if (hyperlink.test(output)) {
    const links = output.match(hyperlink);
    generated_links = hyperlink_generator(links);
  }

  return generated_links;
};

for (let i = 0; i < sessions.length; i++) {
  const hyperlinks = hyperlink_finder(sessions[i].innerHTML);
  if (hyperlinks) {
    const splitted = sessions[i].innerHTML.split(hyperlink);
    let updated_links = [];
    for (let j = 0; j < splitted.length; j++) {
      updated_links.push(splitted[j]);
      if (j !== splitted.length - 1) {
        updated_links.push(hyperlinks[j]);
      }
    }

    const output_string = updated_links.join("");
    document.getElementsByClassName("shell-session")[i].innerHTML =
      output_string;
  }
}
