---
title: 'Connect with anything'
description: 'Access thousands of connectors for HTTP APIs (OpenAPI), event APIs (AsyncAPI), GraphQL services, legacy systems, and data stores, allowing seamless data transfer to and from any system, anywhere.'
---
```ballerina
configurable string token = ?;

service /graphql on new graphql:Listener(9090) {
    final github:Client githubClient;

    function init() returns error? {
        self.githubClient = check new ({auth: {token}});
    }

    resource function get repositories() returns Repository[]|error {
        stream<Repository, github:Error?> repositories = 
            check self.githubClient->getRepositories();
        return from github:Repository repository in repositories
            select repository;
    }

    remote function createIssue(CreateIssueInput createIssueInput, 
            string owner, string repositoryName) returns github:Issue|error {
        Issue issue = 
            check self.githubClient->createIssue(createIssueInput, owner, repositoryName);
        check produceIssue(issue, repositoryName);
        return issue;
    }

    resource function subscribe issues(string repositoryName) returns stream<Issue>|error {
        IssueStream issueStreamGenerator = check new (repositoryName);
        return new (issueStreamGenerator);
    }
}
```
