---
title: "Consuming REST endpoints as resources"
description: "Ballerina offers native support for network resources, including the ability to access REST endpoints as resources using the Ballerina HTTP client."
url: "https://ballerina.io/learn/bal-persist-overview"
---

```
public function main() returns error? {
    http:Client socialMediaClient = check new ("localhost:9090/social-media");
    User[] users = check socialMediaClient->/users;
    io:println("Retrieved all users: " + users.toJsonString());
    // ...
}
```