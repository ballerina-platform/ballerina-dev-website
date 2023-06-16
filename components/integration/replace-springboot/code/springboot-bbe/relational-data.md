---
title: "Relational data access made simple"
description: "Relational databases and REST are natural companions, as both involve data/resource manipulation using CRUD principles.<br/><br/> With its tailored data access layer for relational databases, Ballerina provides a seamless developer experience, making it the natural choice for REST API development with relational data stores."
url: "https://ballerina.io/learn/bal-persist-overview"
---

```
service /social\-media on new http:Listener(9090) {
    // This client is a generated using Ballerina persist module
    final persistMysql:Client socialMediaDb;

    public function init() returns error? {
        // All MySQL client configurations are passed 
        // as configurations in the `Config.toml`
        self.socialMediaDb = check new ();
    }

    resource function post users(@http:Payload User newUser)
        returns http:Created|http:InternalServerError {
        
        int|persist:Error result = socialMediaDb->/users.post(newUser);

        // ...
    }
}

```