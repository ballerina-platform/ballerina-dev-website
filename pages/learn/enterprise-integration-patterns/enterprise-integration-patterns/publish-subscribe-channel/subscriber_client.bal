import ballerina/io;
import ballerina/websocket;

public function main() returns error? {
    websocket:Client wsClient = check new ("ws://localhost:8081/ws/IndVsAus");

    while true {
        anydata msg = check wsClient->readMessage();
        io:println(msg);
    }
}
