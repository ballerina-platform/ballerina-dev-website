---
title: 'WebSocket, TCP socket for the web'
description: WebSocket is an excellent choice for message transmission particularly on the web. With Ballerina, you have not only the capability to utilize a WebSocket as it is but also the flexibility to develop custom subprotocols that align with your organization's specific requirements.
url: 'https://github.com/ballerina-platform/module-ballerina-websocket/tree/main/examples/taxi-service-management'
---
```
// This service is for drivers to register and send locations.
service /taxi on taxiMgtListener {
    resource isolated function get [string name]() 
                        returns websocket:Service|websocket:UpgradeError {
        return new DriverService(name);
    }
}

isolated service class DriverService {
    *websocket:Service;

    final string driverName;

    public isolated function init(string username) {
        self.driverName = username;
    }

    remote isolated function onOpen(websocket:Caller caller) returns websocket:Error? {
        string welcomeMsg = 
                "Hi " + self.driverName + "! Your location will be shared with the riders";
        check caller->writeMessage(welcomeMsg);
        
        broadcast("Driver " + self.driverName + " ready for a ride");
    }

    // 'onMessage' remote function will receive the location updates from drivers.
    remote function onMessage(websocket:Caller caller, string location) returns websocket:Error? {
        worker broadcast returns error? {
            // Broadcast the live locations to registered riders.
            string locationUpdateMsg = self.driverName + " updated the location " + location;
            broadcast(locationUpdateMsg);
        }
    }

    remote isolated function onClose(websocket:Caller caller, int statusCode, string reason) {
        io:println(self.driverName + " got disconnected");
    }
}
```