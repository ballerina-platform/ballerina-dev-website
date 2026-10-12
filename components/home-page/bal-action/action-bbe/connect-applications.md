import ballerinax/github;
import ballerinax/googleapis.sheets;

configurable string githubPAT = ?;
configurable string githubOwner = "ballerina-platform";
configurable string githubRepo = "ballerina-lang";
configurable string sheetsAccessToken = ?;
configurable string spreadSheetId = ?;
configurable string sheetName = "pull-requests";

public function main() returns error? {
    github:Client githubClient = check new ({auth: {token: githubPAT}});
    stream<github:PullRequest, github:Error?> prs =
        check githubClient->getPullRequests(githubOwner, githubRepo, github:PULL_REQUEST_OPEN);

    sheets:Client gsheets = check new ({auth: {token: sheetsAccessToken}});
    _ = check gsheets->appendValue(spreadSheetId,
        ["URL", "Title", "State", "Created At", "Updated At"], {sheetName});

    check from github:PullRequest pr in prs
        do {
            _ = check gsheets->appendValue(spreadSheetId,
                [pr.url ?: "", pr.title ?: "", pr.state ?: "",
                 pr.createdAt ?: "", pr.updatedAt ?: ""], {sheetName});
        };
}
