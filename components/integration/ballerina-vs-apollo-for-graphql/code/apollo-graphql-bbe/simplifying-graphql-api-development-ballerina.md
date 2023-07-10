---
title: "Ballerina code"
---

```ballerina
import ballerina/graphql;

service on new graphql:Listener(9090) {
    resource function get profile() returns Profile {
        return {
            name: "John Doe",
            age: 30,
            address: {street: "15 Yemen Road", city: "Yemen", country: "YM"}
        };
    }
}

type Profile record {|
    string name;
    int age;
    Address address;
|};

type Address record {|
    string street;
    string city;
    string country;
|};
```
