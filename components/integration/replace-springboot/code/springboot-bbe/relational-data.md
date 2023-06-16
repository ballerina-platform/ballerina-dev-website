---
title: "Relational data access made simple"
description: "Relational databases and REST are natural companions, as both involve data/resource manipulation using CRUD principles.<br/><br/> With its tailored data access layer for relational databases, Ballerina provides a seamless developer experience, making it the natural choice for REST API development with relational data stores."
url: "https://ballerina.io/learn/bal-persist-overview"
---

```
service /social\-media on new http:Listener(9090) {
    final mysql:Client socialMediaDb;

    public function init() returns error? {
        self.socialMediaDb = check new (
            host = host, port = port, user = database_user, password = database_password);
    }

    resource function post users(@http:Payload User newUser)
        returns http:Created|http:InternalServerError {
        
        sql:ExecutionResult|sql:Error execResult = self.socialMediaDb->execute(`
                INSERT INTO social_media_database.user_details(id, birth_date, name)
                VALUES (${newUser.id}, ${newUser.birthDate}, ${newUser.name});`);

        // ...
    }
}

```