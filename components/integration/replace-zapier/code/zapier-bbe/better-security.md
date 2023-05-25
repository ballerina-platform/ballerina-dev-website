---
title: 'Better security'
description: 'Ballerina provides robust security features such as encryption, authentication, and authorization, which are essential for businesses dealing with sensitive data.'
url: 'https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/github-summary-via-secure-service'
---
```
import ballerina/http;

// Configurability enables users to modify the system behavior through
// external inputs in a secure way.
configurable string githubPAT = ?;
configurable string githubRepo = "ballerina-platform/ballerina-lang";
configurable string pulicCertPath = ?;
configurable string privateKeyPath = ?;

type PR record {
    string url;
    string title;
    string state;
};

type PRSummary record {|
    string url;
    string title;
|};

final http:Client github = check new ("https://api.github.com/repos");
final map<string> headers = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": "token " + githubPAT
};

//The http:Listener can be configured to communicate through 
//HTTPS by providing a certificate file and a private key file.
listener http:Listener securedEP = new (9090,
    secureSocket = {
        key: {
            certFile: pulicCertPath,
            keyFile: privateKeyPath
        }
    }
);

service / on securedEP {
    resource function get pr(string status) returns PRSummary[]|error {
        PR[] prs = check github->/[githubRepo]/pulls(headers);
        return from var {url, title, state} in prs
            where state == status
            select {url, title};
    }
}
```