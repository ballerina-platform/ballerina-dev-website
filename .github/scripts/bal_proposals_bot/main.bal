import ballerina/io;
import ballerina/lang.runtime;
import ballerina/regex;
import ballerina/http;

type RepoData record {
    int total_count;
    Repo[] items;
};

type Repo record {
    string name;
};

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

type Label record{
    string name;
};

type User record {
    string login;
    string html_url;
};

public function main() returns error? {

    http:Client github = check new ("https://api.github.com/search/repositories");
    RepoData dataRepo = check github->get(string `?q=org:ballerina-platform`);
    int totalRepos = dataRepo.total_count;
    int defaultPageSize = 30;

    int numPages = totalRepos / defaultPageSize + 1;
    int repoCount = 0;

    string repoData = "";

    foreach int i in 0 ..< numPages {
        dataRepo = check github->get(string `?q=org:ballerina-platform&page=${i + 1}`);
        foreach var repo in dataRepo.items {

            repoCount += 1;
            if repoCount % 9 == 0 { //Due to github  rate limit
                io:println("Sleeping at repo count:", repoCount);
                runtime:sleep(65);
            }
            
            string repository = repo.name;
            http:Client githubIssues = check new ("https://api.github.com/search/issues");
            Data data = check githubIssues->get(string `?q=label:Type/Proposal+repo:ballerina-platform/${repository}+is:open`);
            int issueCount = data.total_count;
            if issueCount == 0 {
                continue;
            }
            
            string issueList = "";
            foreach var issue in data.items {
                issueList += "|";
                issueList += string `[${issue.title}](${issue.html_url}){:target=\"_blank\" rel=\"noopener\"}|`;
                issueList += string `[${issue.user.login}](${issue.user.html_url}){:target=\"_blank\" rel=\"noopener\"}|`;
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
            repoData += string `## [${repository}](https://github.com/ballerina-platform/${repository}){:target=\"_blank\" rel=\"noopener\"}`;
            repoData += "\n\n|Proposal|Author|Comments|Created date|Status| \n|---|----|----|----|---| \n" + string `${issueList}` + "\n";
            io:println("Repo Count:", repoCount);
        }
    }
    string fileContent = "--- \nlayout: ballerina-inner-page \ntitle: Active proposals \ndescription: This is a collection of active proposals for Ballerina by the Ballerina community. \nintro: The active proposal list for the Ballerina GitHub repositories. \nkeywords: ballerina, community, ballerina community \npermalink: /community/active-proposals \n--- \n" + repoData;
    io:println(fileContent);
    check io:fileWriteString("./community/proposals/active-proposals.md", fileContent);
}