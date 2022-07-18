const fs = require("fs");
const yaml = require("js-yaml");

// command line arguments
const cmdArguments = process.argv;
const examplesDir = cmdArguments[2] ? cmdArguments[2] : "examples";
const dataDir = cmdArguments[3] ? cmdArguments[3] : "_data";

// sentence case converter
const sentenceCaseConverter = (str) => {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

try {
  // variables
  let indexJson = JSON.parse(
      fs.readFileSync(`${examplesDir}/index.json`, "utf-8")
    ),
    navObject = {
      title: "Ballerina By Example Navigation",
      url: "learn/by-example",
      sublinks: [],
    };

  // iterate through the BBEs
  let outerCategoryId = 0,
    innerCategoryId = 0,
    currentCategory = "",
    outerCategoryObject = {};
  for (let category of indexJson) {
    if (sentenceCaseConverter(category.category) !== currentCategory) {
      currentCategory = sentenceCaseConverter(category.category);

      if (Object.keys(outerCategoryObject).length !== 0)
        navObject.sublinks.push(outerCategoryObject);
      outerCategoryId++;
      innerCategoryId = 0;
      outerCategoryObject = {
        title: category.category,
        id: outerCategoryId,
        sublinks: [],
      };
    }

    innerCategoryId++;
    let innerCategoryObject = {
        title: category.title,
        id: innerCategoryId,
        sublinks: [],
      },
      bbeId = 0;
    for (let bbe of category.samples) {
      bbeId++;
      innerCategoryObject.sublinks.push({
        title: bbe.name,
        id: bbeId,
        url: bbe.url,
      });
    }
    outerCategoryObject.sublinks.push(innerCategoryObject);
  }
  navObject.sublinks.push(outerCategoryObject);
  console.log("BBE Navigation YAML Generated");
  fs.writeFileSync(
    `${dataDir}/ballerina-by-example-nav.yml`,
    yaml.dump(navObject)
  );
} catch ({ message }) {
  console.log(message);
}
