---
title: "Ballerina"
description: null
---

```
import ballerina/uuid;

type Customer record {|
    string id = uuid:createType1AsString();
    string name;
|};

public function main() {
    Customer customer = {name: "John Doe"};
    io:println(string `Customer '${customer.name}' with id '${customer.id}' created successfully`);
}
```