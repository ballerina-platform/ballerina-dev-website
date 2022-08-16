import ballerina/io;
import ballerinax/github;
import ballerina/http;
import ballerina/lang.runtime;
import ballerina/os;
import ballerina/regex;

configurable string githubAccessToken = os:getEnv("GITHUB_TOKEN");

type Data record {
    int total_count;
    Issue[] items;
};

type Issue record {
    string html_url;
    string title;
    string created_at;
    int comments;
    User user;
    Label[] labels;
};

type Label record {
    string name;
};

type User record {
    string login;
    string html_url;
};

public function main() returns error? {

    github:Client githubClient = check new ({
        auth: {
            token: githubAccessToken
        }
    });

    int totalRepos = 0;
    string[] repos = [];

    stream<github:Repository, github:Error?> repoStream = check githubClient->getRepositories("ballerina-platform", true);
    check from github:Repository repo in repoStream
        do {
            string name = repo?.name;
            repos.push(name);
            totalRepos += 1;
        };

    int repoCount = 0;

    string repoData = "";

    foreach string repository in repos {

        repoCount += 1;
        if repoCount % 9 == 0 { //Due to github  rate limit
            io:println("Sleeping at repo count:", repoCount);
            runtime:sleep(65);
        }

        http:Client githubIssues = check new ("https://api.github.com/search/issues");
        Data data = check githubIssues->get(string `?q=label:Type/Proposal+repo:ballerina-platform/${repository}+is:open`);
        int issueCount = data.total_count;
        if issueCount == 0 {
            continue;
        }

        string issueList = "";
        foreach var issue in data.items {
            issueList += "|";
            issueList += string `[${issue.title}](${issue.html_url})|`;
            issueList += string `[${issue.user.login}](${issue.user.html_url})|`;
            issueList += string `${issue.comments}|`;
            issueList += string `${issue.created_at.substring(0, 10)}|`;

            string new_status = "N/A";
            foreach var label in issue.labels {
                string status = string `${label.name}`;
                if status.startsWith("Status") {
                    new_status = regex:replaceFirst(string `${label.name}`, "Status/", "");
                    break;
                }
            }
            issueList += new_status + "|";
            issueList = issueList + "\n";
        }
        repoData += string `## [${repository}](https://github.com/ballerina-platform/${repository})`;
        repoData += "\n\n|Proposal|Author|Comments|Created date|Status| \n|---|----|----|----|---| \n" + string `${issueList}` + "\n";
        io:println("Repo Count:", repoCount);
    }

    string fileContent = "--- \nlayout: ballerina-inner-page \ntitle: Active proposals \ndescription: This is a collection of active proposals for Ballerina by the Ballerina community. \nintro: The active proposals list for the Ballerina GitHub repositories. \nkeywords: ballerina, community, ballerina community \npermalink: /community/active-proposals \n--- \n" + repoData;
    io:println(fileContent);
    check io:fileWriteString("./community/proposals/active-proposals.md", fileContent);
}
