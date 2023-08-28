import ballerina/http;
import ballerina/io;
import ballerina/file;

configurable string path = ?;
configurable int case = ?;

service / on new http:Listener(80) {

  resource function default [string... parm](http:Request req) returns anydata|error {
    string host = check req.getHeader("host");
    string fileName = string `${path}/case-${pad2(case)}-${host}`;
    if check file:test(fileName + ".json", file:EXISTS) {
      return io:fileReadJson(fileName + ".json");
    }
    return io:fileReadXml(fileName + ".xml");   
  }
}

function pad2(int i) returns string {
    string s = i.toString();
    if i < 10 {
        return "0" + s;
    }
    return s;
}

