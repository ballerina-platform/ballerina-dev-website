---
title: "Ballerina"
description: null
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