---
title: 'Unleash data from APIs'
description: "Ballerina offers a wide range of built-in connectors, 
including HTTP and GraphQL clients, 
making it easy to secinteract with APIs for efficient data extraction in your ETL pipeline.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/reviewSummary/main.bal'
phase: 'Extractions'
---
```
const REPO_OWNER = "ballerina-platform";
const REPO_NAME = "ballerina-lang";

// create a connection with github API using ballerina github client
final github:Client githubClient = check new ({
    auth: {
        token: githubPAT
    }
});

public function main() returns error? {
    github:IssueFilters filters = {
        labels: ["Type/NewFeature", "Priority/High"],
        states: [github:ISSUE_OPEN]
    };
    // retirive high priority new features using the github client
    stream<github:Issue, github:Error?> openHighPriorityFeatures = check githubClient->getIssues(REPO_OWNER, REPO_NAME, filters);
    check from var feature in openHighPriorityFeatures
        do {
            io:println(feature);
        };
}
```
