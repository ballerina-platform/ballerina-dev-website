---
title: "Configurations for consistent, safe, and reliable app development"
description: "Effective configuration management is vital for agile application development.<br/><br/> Ballerina offers out-of-the-box support for configurability, empowering developers to customize and optimize their applications for diverse deployment scenarios.<br/><br/> Its comprehensive features enable seamless adaptation, collaboration, and consistent behavior, making it an ideal choice for API development."
url: "https://ballerina.io/learn/configure-ballerina-programs/configure-a-sample-ballerina-service"
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