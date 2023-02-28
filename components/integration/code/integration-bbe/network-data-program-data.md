---
title: 'Network data == program data'
description: Processing data coming or going over the wire is a no-brainer with Ballerina. Seamlessly and selectively map network data into domain types for a range of formats, including JSON, EDI, and XML.
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/github-pull-requests-to-stdout/main.bal#L22'
---
```
configurable string githubPAT = ?;

type PR record {
    string url;
    string title;
    string state;
    string created_at;
    string updated_at;
};

public function main() returns error? {
    http:Client github = check new ("https://api.github.com/repos");
    map<string> headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": "token " + githubPAT
    };
    
    // Network data == program data
    PR[] prs = check github->/octocat/Hello\-World/pulls(headers);
    io:println(prs);
}
```