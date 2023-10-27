---
title: 'Real-Time Frontend Data with WebSockets'
description: Modern web/mobile app users expect real-time updates. Ballerina allows real-time data to be streamed just by implementing a service. This comes with enterprise-ready security features like TLS, mutual TLS, and OAuth2, ensuring authenticated and authorized streaming data transfers.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_websocket'
---
```
public type Location record {|
    float latitude;
    float longitude;
|};

service /logistics on new websocket:Listener(9091) {
    resource function get .() returns websocket:Service {
        return new OrderService();
    }
}

distinct service class OrderService {
    *websocket:Service;

    remote function onMessage(websocket:Caller caller) returns error? {
        Location currentLocation = getCourierLocation();
        check caller->writeMessage(currentLocation);
    }
}
```