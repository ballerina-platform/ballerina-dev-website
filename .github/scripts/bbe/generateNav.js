/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
