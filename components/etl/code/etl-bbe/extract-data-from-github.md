---
title: 'Unleash data from APIs'
description: "Ballerina offers a wide range of built-in connectors, including HTTP and GraphQL clients, making it easy to interact with APIs for efficient data extraction in your ETL pipeline."
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/extract-data-from-github/main.bal'
phase: 'Extractions'
---
```
const REPO_OWNER = "ballerina-platform";
const REPO_NAME = "ballerina-lang";

final github:Client githubClient = check new ({
    auth: {
        token: githubAccessToken
    }
});

public function main() returns error? {
    github:IssueFilters filters = {
        labels: ["Type/NewFeature", "Priority/High"],
        states: [github:ISSUE_OPEN]
    };
    stream<github:Issue, github:Error?> openFeatures
            = check githubClient->getIssues(REPO_OWNER, REPO_NAME, filters);
    check from var feature in openFeatures
        do {
            io:println(feature.title);
        };
}
```
