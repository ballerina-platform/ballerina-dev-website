/**
 * Copyright (c) 2024, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
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

export async function fetchContributors(owner, repo) {
  if (repo !== "") {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
    if (!response.ok) {
      throw new Error('Failed to fetch contributors');
    }
    return response.json();
  } else {

    const response = await fetch(`https://api.github.com/orgs/${owner}/repos`);
    const repos = await response.json();

    let contributors = [];

    for (const repo of repos) {
      const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/contributors`);
      const repoContributors = await contributorsResponse.json();
      repoContributors.forEach(contributor => {
        contributors.push(contributor);
      });
    }


    const uniqueContributors = contributors.filter((obj, index, self) =>
      index === self.findIndex((t) => (
        t.id === obj.id && t.name === obj.name
      ))
    );


    return uniqueContributors;

  }
}
