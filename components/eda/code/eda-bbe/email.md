---
title: 'Automated responding to emails'
description: Ballerina simplifies real-time email handling by offering abstractions and connectors for seamless integration. It supports SMTP, IMAP, and POP3, and even enables integration with ChatGPT for advanced email automation workflows, adding sophistication to your communication processes.
url: 'https://ballerina.io/learn/by-example/receive-email-using-service/'
---
```
configurable string username = ?;
configurable string password = ?;

listener email:ImapListener emailListener = new ({
    host: "imap.email.com",
    username,
    password
});

service "observer" on emailListener {

    // When an email is successfully received, the `onMessage` method is called.
    remote function onMessage(email:Message email) {
        log:printInfo("Received an email", subject = email.subject, content = email?.body);
    }

    // When an error occurs during the email poll operations, the `onError` method is called.
    remote function onError(email:Error emailError) {
        log:printError(emailError.message(), stackTrace = emailError.stackTrace());
    }

    // When the listener is closed, the `onClose` method is called.
    remote function onClose(email:Error? closeError) {
        if closeError is email:Error {
            log:printInfo(closeError.message(), stackTrace = closeError.stackTrace());
        }
    }
}
```