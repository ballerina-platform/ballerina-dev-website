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
    //arrays:
    io:println("MASTER**********");
    http:Client github = check new ("https://api.github.com/search/repositories");
    RepoData data_repo = check github->get(string `?q=org:ballerina-platform`);
    int total_repos = data_repo.total_count;
    int default_page_size = 30;

    int num_pages = total_repos / default_page_size + 1;
    int repoCount = 0;
    io:println(total_repos);
    io:println(num_pages);

    string repoData = "";

    foreach int i in 1 ..< num_pages + 1 {
        io:println(i);
        data_repo = check github->get(string `?q=org:ballerina-platform&page=${i}`);
        foreach var repo in data_repo.items {
            //io:println(repo.name);
            repoCount += 1;
            string repository = repo.name;

            if (repoCount % 9 == 0) { //Due to github  rate limit
                break;
                io:println("Sleeping at repo count:", repoCount);
                runtime:sleep(65);
            }
            http:Client github_issues = check new ("https://api.github.com/search/issues");
            Data data = check github_issues->get(string `?q=label:Type/Proposal+repo:ballerina-platform/${repository}+is:open`);
            int issueCount = data.total_count;
            if (issueCount > 0) {
                string issuelist = "";
                foreach var issue in data.items {
                    issuelist = issuelist + "|";
                    issuelist = issuelist + "[" + string `${issue.title}` + "](" + string `${issue.html_url}` + "){:target=\"_blank\" rel=\"noopener\"}|";
                    issuelist = issuelist + "[" + string `${issue.user.login}` + "](" + string `${issue.user.html_url}` + "){:target=\"_blank\" rel=\"noopener\"}|";
                    issuelist = issuelist + string `${issue.comments}` + "|";
                    issuelist = issuelist + string `${issue.created_at.substring(0, 10)}` + "|";
                    
                    string new_status = "N/A";
                    foreach var label in issue.labels{
                        string status = string `${label.name}`;
                        if status.length() > 6 {
                            status = status.substring(0, 6);
                            if (status == "Status") {
                                new_status = regex:replaceFirst(string `${label.name}`, "Status/", "");
                            break;
                            }
                        }
                    }
                    issuelist = issuelist + new_status + "|";
                    issuelist = issuelist + "\n";
                }
                repoData = repoData + string `## [${repository}]` + string `(https://github.com/ballerina-platform/${repository})` + "\n\n|Proposal|Author|Comments|Created date|Status| \n|---|----|----|----|---| \n" + string `${issuelist}` + "\n";
            }
            io:println("Repo Count:", repoCount);
        }
        break;
    }
    string fileContent = "--- \nlayout: ballerina-inner-page \ntitle: Active proposals \ndescription: This is a collection of active proposals for Ballerina by the Ballerina community. \nkeywords: ballerina, community, ballerina community, newsletter \npermalink: /community/active-proposals \n--- \n" + repoData;
    io:println(fileContent);
    check io:fileWriteString("./community/proposals/active-proposals.md.md", fileContent);
}

