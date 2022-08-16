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

const shell = require("shelljs");

shell.cd(".github/scripts/bbe");
shell.exec("npm i");
shell.echo("-e", "\n");
shell.cd("../../..");
shell.exec(
  "git clone https://github.com/ballerina-platform/ballerina-distribution.git"
);
shell.echo("-e", "\n");
shell.cp("-r", "ballerina-distribution/examples", ".");
shell.rm("-rf", "swan-lake/by-example/*");
shell.cp("examples/index.json", "swan-lake/by-example/all-bbes.json");
shell.exec(
  "node .github/scripts/bbe/convertMarkdown.js examples swan-lake/by-example"
);
shell.echo("-e", "\n");
shell.exec("npx prettier -w swan-lake/by-example");
shell.echo("-e", "\n");
shell.exec("node .github/scripts/bbe/generateNav.js examples _data");
shell.rm("-rf", [
  "ballerina-distribution",
  "examples",
  ".github/scripts/bbe/node_modules",
  ".github/scripts/bbe/package-lock.json",
]);
