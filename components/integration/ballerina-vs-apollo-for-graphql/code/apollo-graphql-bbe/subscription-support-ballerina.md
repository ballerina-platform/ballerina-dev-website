---
title: "Ballerina"
---

```ballerina
import ballerina/graphql;
import ballerina/uuid;

service on new graphql:Listener(9090) {
    resource function get greeting() returns string {
        return "Welcome";
    }

    remote function publishMessage(NewPost newPost) returns string|error {
        check publishPost(postData);
        return new (postData);
    }

    resource function subscribe messages() returns stream<Post, error?>|error {
        string id = uuid:createType1AsString();
        PostStreamGenerator postStreamGenerator = check new (id);
        stream<Post, error?> postStream = new (postStreamGenerator);
        return postStream;
    }
}
```
