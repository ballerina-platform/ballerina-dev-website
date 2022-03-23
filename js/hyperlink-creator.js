const sessions = document.getElementsByClassName("shell-session");
const hyperlink_type1 = /\[(?:\w|-| )+\]\((?:\w|:|\/|-| |.)+\)/g;
const hyperlink_type2 =
  /&lt;a href=(?:"|&quot;)(?:\w|:|\/|-| |.)+(?:"|&quot;)&gt;(?:\w|-| )+&lt;\/a&gt;/g;
const hyperlink_type1_extractor =
  /\[(?<content>(?:\w|-| )+)\]\((?<href_link>(?:\w|:|\/|-| |.)+)\)/gm;
const hyperlink_type2_extractor =
  /&lt;a href=(?:"|&quot;)(?<href_link>(?:\w|:|\/|-| |.)+)(?:"|&quot;)&gt;(?<content>(?:\w|-| )+)&lt;\/a&gt;/gm;

const hyperlink_generator = (links, type) => {
  let hyperlinks = [];
  let match = {};
  links.forEach((link) => {
    if (type === 1) {
      match = hyperlink_type1_extractor.exec(link);
    } else {
      match = hyperlink_type2_extractor.exec(link);
    }

    if (match) {
      hyperlinks.push(
        `<a href="${match.groups.href_link}">${match.groups.content}</a>`
      );
    }
  });

  return hyperlinks;
};

const hyperlink_finder = (output) => {
  let generated_links_type1 = [];
  let generated_links_type2 = [];
  let type = 1;
  if (hyperlink_type1.test(output)) {
    const links_type1 = output.match(hyperlink_type1);
    generated_links_type1 = hyperlink_generator(links_type1, type);
  } else if (hyperlink_type2.test(output)) {
    const links_type2 = output.match(hyperlink_type2);
    type = 2;
    generated_links_type2 = hyperlink_generator(links_type2, type);
  }

  let generated_links = [...generated_links_type1, ...generated_links_type2];

  return { links: generated_links, type: type };
};

for (let i = 0; i < sessions.length; i++) {
  const hyperlinks = hyperlink_finder(sessions[i].innerHTML);
  if (hyperlinks.links) {
    let splitted = [];
    if (hyperlinks.type === 1) {
      splitted = sessions[i].innerHTML.split(hyperlink_type1);
    } else {
      splitted = sessions[i].innerHTML.split(hyperlink_type2);
    }

    let updated_links = [];
    for (let j = 0; j < splitted.length; j++) {
      updated_links.push(splitted[j]);
      if (j !== splitted.length - 1) {
        updated_links.push(hyperlinks.links[j]);
      }
    }

    const output_string = updated_links.join("");
    document.getElementsByClassName("shell-session")[i].innerHTML =
      output_string;
  }
}
