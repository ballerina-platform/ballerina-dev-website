import ballerina/websocket;

final map<websocket:Caller> connectionMap = {};

service /chat on new websocket:Listener(8080) {
    resource function get .() returns websocket:Service {
        return new ChatService();
    }
}

service class ChatService {
    *websocket:Service;

    remote function onOpen(websocket:Caller caller) returns error? {
        string newUserConnectionId = caller.getConnectionId();
        connectionMap[newUserConnectionId] = caller;
        string message = string `New user joined with connection id: ${newUserConnectionId}`;
        check broadcaseMessage(message, newUserConnectionId);
    }

    remote function onMessage(websocket:Caller caller, string chatMessage) returns error? {
        check broadcaseMessage(chatMessage, caller.getConnectionId());
    }

    remote function onClose(websocket:Caller caller) returns error? {
        _ = connectionMap.remove(caller.getConnectionId());
    }
}

function broadcaseMessage(string message, string senderConnectionId) returns error? {
    foreach var [connectionId, wsChannel] in connectionMap.entries() {
        if connectionId != senderConnectionId {
            check wsChannel->writeMessage(message);
        }
    }
}
