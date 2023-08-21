---
title: 'Passing around events has never been easier'
description: Producing and consuming events from message brokers and then exposing them to others using WebHook, WebSocket, GraphQL, gRPC, etc., is just a piece of cake using Ballerina. You focus on the business logic and let Ballerina focus on the network logic.
url: 'https://ballerina.io/learn/by-example/kafka-service-consume-message/'
---
```
public type Order readonly & record {
    int orderId;
    string productName;
    decimal price;
    boolean isValid;
};

listener kafka:Listener orderListener = new (kafka:DEFAULT_URL, {
    groupId: "order-group-id",
    topics: "order-topic"
});

service on orderListener {

    remote function onConsumerRecord(Order[] orders) returns error? {
        // The set of orders received by the service are processed one by one.
        check from Order 'order in orders
            where 'order.isValid
            do {
                log:printInfo(string `Received valid order for ${'order.productName}`);
            };
    }
}
```