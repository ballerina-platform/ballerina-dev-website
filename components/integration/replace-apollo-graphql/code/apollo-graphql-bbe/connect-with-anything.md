---
title: 'Connect with anything'
description: 'Access thousands of connectors for HTTP APIs (OpenAPI), event APIs (AsyncAPI), GraphQL services, legacy systems, and data stores, allowing seamless data transfer to and from any system, anywhere.'
url: 'https://github.com/ballerina-platform/module-ballerina-graphql/tree/graphql-demo/examples/downscaled-github-issue-tracker'
---
```ballerina
import ballerina/graphql;
import ballerina/http;

configurable string authToken = ?;
configurable string owner = "";

service /graphql on new graphql:Listener(9090) {
    final http:Client githubRestClient;

    function init() returns error? {
        self.githubRestClient = check new ("https://api.github.com", {auth: {token: authToken}});
    }

    resource function get user() returns User|error {
        User user = check self.githubRestClient->/user;
        return user;
    }

    resource function get repositories() returns Repository[]|error {
        Repository[] repositories = check self.githubRestClient->/users/[owner]/repos;
        return repositories;
    }

    resource function get repository(string repositoryName) returns Repository|error {
        Repository repository = check self.githubRestClient->/repos/[owner]/[repositoryName];
        return repository;
    }

    remote function createRepository(CreateRepositoryInput createRepoInput) returns Repository|error {
        Repository repository = check self.githubRestClient->/user/repos.post(createRepoInput);
        return repository;
    }

    remote function createIssue(CreateIssueInput createIssueInput, string repositoryName) returns Issue|error {
        Issue issue = check self.githubRestClient->/repos/[owner]/[repositoryName]/issues.post(createIssueInput);
        check produceIssue(issue, repositoryName);
        return issue;
    }

    resource function subscribe issues(string repositoryName) returns stream<Issue>|error {
        IssueStream issueStreamGenerator = check new (repositoryName);
        return new (issueStreamGenerator);
    }
}
```
