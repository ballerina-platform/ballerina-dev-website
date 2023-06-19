---
title: "Ballerina"
---

```ballerina
import ballerina/graphql;
import xlibb/pubsub;

service on new graphql:Listener(9090) {
    private final pubsub:PubSub pubsub = new;
    resource function get greeting() returns string {
        return "Welcome";
    }

    remote function publishMessage(string message) returns string|error {
        check self.pubsub.publish("messages", message);
        return message;
    }

    resource function subscribe messages() returns stream<string, error?>|error {
        return self.pubsub.subscribe("messages");
    }
}
```
