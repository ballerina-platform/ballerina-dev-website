---
title: "REST API development has never been this easy"
---

```
type User record {|
    int id;
    @constraint:String {
        minLength: 2
    }
    string name;
    time:Date birthDate;
|};

service /social\-media on new http:Listener(9090) {

    resource function post users(@http:Payload User newUser)
        returns http:Created|http:InternalServerError {

            // ...
    }
}

```
