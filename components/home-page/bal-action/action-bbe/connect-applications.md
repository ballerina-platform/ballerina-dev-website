import ballerina/http;
import ballerina/io;

configurable string githubToken = ?;
configurable string sheetsAccessToken = ?;
configurable string spreadsheetId = ?;
configurable string sheetName = "pull-requests";
configurable string githubOwner = "ballerina-platform";
configurable string githubRepo = "ballerina-lang";

type PullRequest record {|
    int number;
    string title;
    string state;
    string html_url;
    string created_at;
|};

public function main() returns error? {
    http:Client github = check new ("https://api.github.com/repos");
    map<string> headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + githubToken,
        "User-Agent": "ballerina-integration-samples"
    };
    PullRequest[] pulls = check github->/[githubOwner]/[githubRepo]/pulls(headers);
    http:Client sheets = check new ("https://sheets.googleapis.com");
    foreach PullRequest pull in pulls {
        http:Request append = new;
        append.setHeader("Authorization", "Bearer " + sheetsAccessToken);
        append.setJsonPayload({values: [[pull.number.toString(),
            pull.title, pull.state, pull.html_url, pull.created_at]]});
        string path = "/v4/spreadsheets/" + spreadsheetId +
            "/values/" + sheetName + "!A:E:append?valueInputOption=RAW";
        http:Response response = check sheets->post(path, append);
        if response.statusCode >= 300 {
            return error("Google Sheets append failed");
        }
        io:println("Appended pull request #", pull.number);
    }
}
