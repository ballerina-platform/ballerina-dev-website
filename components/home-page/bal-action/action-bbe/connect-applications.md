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

final http:Client github = check new ("https://api.github.com/repos");
final sheets:Client gsheets = check new ({auth: {token: sheetsAccessToken}});
final map<string> headers = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": "token " + githubPAT
};

public function main() returns error? {
    PR[] prs = check github->/[repository]/pulls(headers);

    _ = check gsheets->appendValue(spreadSheetId, ["Issue", "Title", "State", "Created At", "Updated At"],
                {sheetName: sheetName});

    foreach var {url, title, state, created_at, updated_at} in prs {
        _ = check gsheets->appendValue(spreadSheetId, [url, title, state, created_at, updated_at],
                    {sheetName: sheetName});
    }
}
