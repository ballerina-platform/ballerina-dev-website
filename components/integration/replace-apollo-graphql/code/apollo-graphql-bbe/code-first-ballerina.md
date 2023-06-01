---
title: "Ballerina Code:"
description: null
---

```
import ballerina/graphql;

service on new graphql:Listener(9090) {
   resource function get profile() returns Profile {
       return {
           name: "John Doe",
           age: 30
       };
   }
}

type Profile record {|
   string name;
   int age;
|};
```