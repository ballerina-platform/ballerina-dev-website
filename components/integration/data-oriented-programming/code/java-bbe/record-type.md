---
title: 'Model data as data'
description: Data-oriented programming encourages us to represent data in its pure form. Ballerina and Java provide records, a language construct that simplifies this pure data representation. While Java has recently enhanced its capabilities to support this approach, Ballerina has been fundamentally architected to facilitate data-oriented programming from its inception.
url: https://github.com/ballerina-guides/integration-samples/tree/main/model-data-as-data-for-dop
--- 
```
import ballerina/io;

enum UserType {
    ADMIN,
    GUEST,
    MEMBER
};

type User record {|
    int id;
    string name;
    UserType userType = GUEST;
|};

public function main() {
    User user = {id: 1, name: "John Doe"};
    io:println(string `User '${user.name}' with id '${user.id}' as '${user.userType}' created successfully`);
}
```