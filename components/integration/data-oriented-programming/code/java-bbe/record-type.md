---
title: 'Model data as data'
description: Data-oriented programming promotes the idea of representing data in its purest form. Ballerina's records simplify this approach, enabling concise and effective data representation.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/model-data-as-data/ballerina/main.bal
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
    io:println(string `User '${user.name}' with id '${user.id}' as '${user.userType
                        }' created successfully`);
}
```