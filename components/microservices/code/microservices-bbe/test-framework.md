---
title: Harnessing Ballerina's test framework for success
description: Ballerina's test framework is a powerful asset for microservices development, ensuring top-notch quality and reliability. With support for unit, integration, and functional testing, developers can cover all critical aspects of their microservices. The framework seamlessly integrates with Ballerina, eliminating complexity and enabling easy execution within the development environment.
url: https://ballerina.io/learn/by-example/testerina-mocking-objects/
---
```
// Sends an email to the specified email addresses
// and returns an error if found.
function sendNotification(string[] emailIds) returns error? {
    email:Message msg = {
        'from: "builder@abc.com",
        subject: "Error Alert ...",
        to: emailIds,
        body: ""
    };
    return smtpClient -> sendMessage(msg);
}

@test:Config { }
function testSendNotification() {
    smtpClient = test:mock(email:SmtpClient);
    // Stubs the `send` method of the `mockSmtpClient` to do nothing.
    // This is used for functions with an optional or no return type.
    test:prepare(smtpClient).when("sendMessage").doNothing();
    string[] emailIds = ["user1@test.com", "user2@test.com"];
    error? err = sendNotification(emailIds);
    test:assertEquals(err, ());
}
```