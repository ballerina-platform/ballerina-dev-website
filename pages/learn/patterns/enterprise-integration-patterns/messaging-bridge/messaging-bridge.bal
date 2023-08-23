import ballerina/graphql;
import ballerina/http;

type ProjectRequest record {|
    string projectName;
    string description;
    string customerName;
|};

type Project record {|
    *ProjectRequest;
    string projectID;
    Task[] tasks;
|};

type Task record {|
    string taskID;
    string description;
|};

final http:Client zoho = check new("http://zohoapis.com.balmock.io");

service /api/v1 on new graphql:Listener(8080) {

    resource function get project(string organizationID, string projectID) returns Project|error {
        return zoho->/books/v3/projects/[projectID].get(organization_id = organizationID);
    }

    remote function createProject(string organizationID, ProjectRequest projectRequest) returns Project|error {
        return zoho->/books/v3/projects.post(projectRequest, organization_id = organizationID);
    }
}
