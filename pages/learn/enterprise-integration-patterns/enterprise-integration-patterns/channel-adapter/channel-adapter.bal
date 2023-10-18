import ballerina/io;
import ballerinax/jira;

configurable string username = "admin";
configurable string password = "admin";

final jira:ConnectionConfig jiraConfig = {
    auth: {
        username,
        password
    }
};

final jira:Client jiraAdapter = check new (jiraConfig, "http://wso2.jira.com.balmock.io");

public function main() returns error? {
    jira:Project result = check jiraAdapter->getProject("EI-Patterns-With-Ballerina");
    io:println(result.toString());
}
