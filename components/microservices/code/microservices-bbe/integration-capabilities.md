---
title: 'Powerful Integration Capabilities'
description: Unlocking the power of seamless integration, Ballerina shines with its exceptional capability to connect and interact with a vast array of external systems and services. With an extensive range of connectors at its disposal, Ballerina effortlessly integrates with databases, message brokers, web services, and more.
url: 'https://github.com/ballerina-platform/ballerina-distribution/blob/v2201.5.0/examples/kafka-service-consume-message/kafka_service_consume_message.bal'
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