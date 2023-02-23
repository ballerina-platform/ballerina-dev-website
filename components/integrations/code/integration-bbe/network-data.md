---
description: Data coming over the wire is seamlessly mapped to domain types without explicit data binding in Ballerina. Works with a wide range of data formats such as JSON, XML, and EDI.
url: 'https://github.com/orgs/ballerina-platform/'
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
    PR[] prs = check github->/["octocat/Hello-World"]/pulls(headers);
    io:println(prs);
}
```