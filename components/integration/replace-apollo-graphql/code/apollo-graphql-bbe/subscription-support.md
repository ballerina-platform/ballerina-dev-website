---
title: "Out-of-the-box subscription support - No additional libraries"
description: "Ballerina offers seamless support for GraphQL subscriptions out-of-the-box, eliminating the need for additional libraries like with Apollo. With Ballerina, you can effortlessly integrate systems like Apache Kafka into your GraphQL subscriptions, enhancing real-time data streaming capabilities. This simplifies development, reduces dependencies, and provides a comprehensive solution for building robust GraphQL subscription-based applications."
url: "https://github.com/ballerina-platform/module-ballerina-graphql/tree/master/examples/news_alerts"
---

```
import ballerina/graphql;
import ballerina/log;
import ballerina/uuid;
import ballerinax/kafka;

service on new graphql:Listener(9090) {
    final kafka:Producer messagePublisher;

    function init() returns error? {
        self.messagePublisher = check new (kafka:DEFAULT_URL);
    }

    resource function get greeting() returns string {
        return "Hello!";
    }

    remote function publishMessage(string message) returns string|error {
        check self.messagePublisher->send({topic: "messages", key: uuid:createType1AsString(), value: message});
        return message;
    }

    resource function subscribe messages() returns stream<string>|error {
        MessageStreamGenerator messageStreamGenerator = check new ();
        stream<string> messageStream = new (messageStreamGenerator);
        return messageStream;
    }
}

class MessageStreamGenerator {
    final kafka:Consumer messageConsumer;

    function init() returns error? {
        kafka:ConsumerConfiguration consumerConfiguration = {
            groupId: "message-consumer",
            offsetReset: "earliest",
            topics: "messages",
            maxPollRecords: 1
        };
        self.messageConsumer = check new (kafka:DEFAULT_URL, consumerConfiguration);
    }

    public isolated function next() returns record {|string value;|}? {
        string[]|error messages = self.messageConsumer->pollPayload(1000);
        if messages is error {
            log:printError("Error occurred while polling messages", messages);
            return;
        }
        return {value: messages[0]};
    }
}
```