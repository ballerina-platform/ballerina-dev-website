import ballerina/file;
import ballerina/http;
import ballerina/io;

configurable string path = ?;
configurable int case = ?;

service / on new http:Listener(80) {

    resource function default [string... parm](http:Request req) returns anydata|error {
        string host = check req.getHeader("host");
        string fileName = string `${path}/case-${pad(case)}-${host}`;
        if check file:test(fileName + ".json", file:EXISTS) {
            return io:fileReadJson(fileName + ".json");
        }
        return io:fileReadXml(fileName + ".xml");
    }
}

function pad(int i) returns string {
    string s = i.toString();
    if i < 10 {
        return "0" + s;
    }
    return s;
}

