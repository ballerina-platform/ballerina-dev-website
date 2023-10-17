import ballerina/http;

type UserGroupCreateRequest record {|
    string name;
    string description;
    string team_id;
|};

type UserGroup record {
    *UserGroupCreateRequest;
    string id;
    boolean is_usergroup;
    string 'handle;
    boolean is_external;
    int date_create;
    string created_by;
    string user_count;
};

type UserGroupCreationResponse record {
    boolean ok;
    UserGroup usergroup?;
    string 'error?;
};

final http:Client slackClient = check new ("http://api.slack.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    isolated resource function post createUserGroup(UserGroupCreateRequest userGroup)
    returns UserGroupCreationResponse|error {
        return slackClient->/api/usergroups\.create.post(userGroup, mediaType = "x-www-form-urlencoded");
    }
}
