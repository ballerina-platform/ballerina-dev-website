import ballerina/http;
import ballerinax/googleapis.sheets;

configurable string githubPAT = ?;
configurable string repository = "ballerina-platform/ballerina-lang";
configurable string sheetsAccessToken = ?;
configurable string spreadSheetId = ?;
configurable string sheetName = "pull-requests";

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
    PR[] prs = check github->/[repository]/pulls(headers);

    sheets:Client gsheets = check new ({auth: {token: sheetsAccessToken}});
    _ = check gsheets->appendValue(spreadSheetId, ["Issue", "Title", "State", "Created At", "Updated At"],
                {sheetName: sheetName});

    foreach var {url, title, state, created_at, updated_at} in prs {
        _ = check gsheets->appendValue(spreadSheetId, [url, title, state, created_at, updated_at],
                    {sheetName: sheetName});
    }
}
