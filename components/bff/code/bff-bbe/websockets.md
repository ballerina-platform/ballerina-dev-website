---
title: 'Expose real-time data to front-ends via webSockets'
description: Ballerina allows real-time data to be streamed just by implementing a service. This comes with enterprise-ready security features like TLS, mutual TLS, and OAuth2.
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/exposing-realtime-data-using-websockets'
---
```
service /logistics on new websocket:Listener(9091) {
    resource function get vehicles/[string vehicleId]() 
                            returns websocket:Service {
        return new LocationService(vehicleId);
    }
}

distinct service class LocationService {
    *websocket:Service;

    remote function onOpen(websocket:Caller caller) returns error? {
        // Create a new strand and allocate it to send the locations
        _ = start self.routeLocationFromServerToClient(caller, self.vehicleId);
        return;
    }

    function routeLocationFromServerToClient(
            websocket:Caller caller, string vehicleId) returns error? {
        while true {
            Location currentLocation = {
                latitude: check random:createIntInRange(668700, 1246700) * 1.0 
                                        / 10000.0,
                longitude: check random:createIntInRange(258400, 493800) * 1.0 
                                        / 10000.0
            };
            check caller->writeMessage(currentLocation);
            runtime:sleep(3);
        }
    }
}
```