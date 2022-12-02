# Specification: Ballerina Email Library

_Owners_: @Maninda @wggihan @shafreenAnfar   
_Reviewers_: @shafreenAnfar @Maninda   
_Created_: 2020/04/24   
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction

This is the specification for the Email standard library of [Ballerina language](https://ballerina.io/), which provides functionalities related to
sending/receiving emails via SMTP, POP3, and IMAP protocols.  

The Email library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag. 

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [SMTP, POP3 and IMAP Protocols](#2-smtp-pop3-and-imap-protocols)
3. [Client](#3-client)
    * 3.1. [SMTP Client](#31-smtp-client)
       * 3.1.1. [`init` function](#311-init-function)
       * 3.1.2. [`sendMessage` function](#312-sendmessage-function)
       * 3.1.3. [`send` function](#313-send-function)
    * 3.2. [POP3 Client](#32-pop3-client)
        * 3.2.1. [`init` function](#321-init-function)
        * 3.2.2. [`receiveMessage` function](#322-receivemessage-function)
        * 3.2.3. [`close` function](#323-close-function)
    * 3.3. [IMAP Client](#33-imap-client)
        * 3.3.1. [`init` function](#331-init-function)
        * 3.3.2. [`receiveMessage` function](#332-receivemessage-function)
        * 3.3.3. [`close` function](#333-close-function)
4. [Service](#4-service)
    * 4.1. [POP3 Listener](#41-pop3-listener)
    * 4.2. [IMAP Listener](#42-imap-listener)
    * 4.3. [POP3/IMAP Service](#43-pop3imap-service)
5. [Samples](#5-samples)
    * 5.1. [Clients](#51-clients)
        * 5.1.1. [SMTP Client](#511-smtp-client)
        * 5.1.2. [POP3 Client](#512-pop3-client)
        * 5.1.3. [IMAP Client](#513-imap-client)
    * 5.2. [Services](#52-services)
        * 5.2.1. [POP3 Service](#521-pop3-service)
        * 5.2.2. [IMAP Service](#522-imap-service)

## 1. Overview
This specification elaborates on Basic SMTP, POP3, IMAP4 clients and services/listeners.

## 2. SMTP, POP3 and IMAP Protocols
SMTP is an application layer protocol used for sending an email to a recipient across a network.
POP3 and IMAP are application layer protocols used for receiving emails from an email server across a network.

Ballerina Email library has the capability of sending and receiving email via SMTP, POP3 and IMAP protocols using both clients and services.

## 3. Client
Introduce three different clients, SMTP for sending emails and POP3/IMAP clients for receiving emails.

### 3.1 SMTP Client
Sends an email to with SMTP protocol.
Either this client can be used to send an email from a pre-defined `email:Message` record or directly sending the email by passing all the parameters as arguments.

#### 3.1.1 `init` function
If there are certificates to be added or in the case where the port number is different from `465` with SSL a configuration has to be passed.
Otherwise, only the host address, username, and the password has to be provided.

```ballerina
email:SmtpClient smtpClient = check new ("smtp.email.com", "sender@email.com" , "pass123");
```

#### 3.1.2 `sendMessage` function
The `email:Message` record has to be defined first as follows.
```ballerina
email:Message emailMessage = {
   to: ["receiver1@email.com", "receiver2@email.com"],
   cc: ["receiver3@email.com", "receiver4@email.com"],
   bcc: ["receiver5@email.com"],
   subject: "Sample Email Subject",
   body: "This is a sample email.",
   'from: "author@email.com",
   sender: "sender@email.com",
   replyTo: ["replyTo1@email.com", "replyTo2@email.com"]
};
```

Then the above record can be used to send using the SMTP client.
```ballerina
check smtpClient->sendMessage(emailMessage);
```

If `body`, `htmlBody`, and `attachments` are empty then the client will send `CRLF` token which denotes end-of-message according to [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322#section-3.5).

#### 3.1.3 `send` function
Instead of defining a record related to the email message the email can be sent directly.
This method can be in simple cases.
```ballerina
check smtpClient->send("receiver@email.com", "Sample Email Subject", "author@email.com", "This is a sample email.");
```

### 3.2 POP3 Client

#### 3.2.1 `init` function
If there are certificates to be added or in the case where the port number is different from `995` with SSL a configuration has to be passed.
Otherwise, only the host address, username, and the password has to be provided.

```ballerina
email:PopClient popClient = check new ("pop.email.com", "reader@email.com", "pass456");
```

#### 3.2.2 `receiveMessage` function
A `email:Message` record can to be received as follows.
```ballerina
email:Message? emailResponse = check popClient->receiveMessage();
```
This method will return a single email that was already received if any such email exists. Otherwise, returns a nil.
A `timeout` value can be passed as an argument to the function required to be blocked on the method invocation till an email is received.

#### 3.2.3 `close` function
Closes the email folder and the store from the POP3 server.
```ballerina
check popClient->close();
```

### 3.3 IMAP Client

#### 3.3.1 `init` function
If there are certificates to be added or in the case where the port number is different from `993` with SSL a configuration has to be passed.
Otherwise, only the host address, username, and the password has to be provided.

```ballerina
email:ImapClient imapClient = check new ("imap.email.com", "reader@email.com", "pass456");
```

#### 3.3.2 `receiveMessage` function
A `email:Message` record can to be received as follows.
```ballerina
email:Message? emailResponse = check imapClient->receiveMessage();
```
This method will return a single email that was already received if any such email exists. Otherwise, returns a nil.
A `timeout` value can be passed as an argument to the function required to be blocked on the method invocation till an email is received.

#### 3.3.3 `close` function
Closes the email folder and the store from the IMAP server.
```ballerina
check imapClient->close();
```

## 4. Service
A service can subscribe to a listener to read data from the POP3/IMAP server.

### 4.1 POP3 Listener
A POP3 listener is initialized by passing `email:PopListenerConfiguration` to the constructor of the `email:PopListener`.
```ballerina
email:PopListenerConfiguration popListenerConfiguration = {
    host: "pop.email.com",
    username: "reader@email.com",
    password: "pass456",
    pollingInterval: 2,
    port: 995
}
listener email:PopListener emailListener = check new (popListenerConfiguration);
```

### 4.2 IMAP Listener
A IMAP listener is initialized by passing `email:ImapListenerConfiguration` to the constructor of the `email:ImapListener`.
```ballerina
email:ImapListenerConfiguration imapListenerConfiguration = {
    host: "imap.email.com",
    username: "reader@email.com",
    password: "pass456",
    pollingInterval: 2,
    port: 993
}
listener email:ImapListener emailListener = check new (imapListenerConfiguration);
```
`pollingInterval` specifies the polling interval time period from number of seconds.

### 4.3 POP3/IMAP Service
Both POP3 and IMAP services can be defined as follows.
```ballerina
email:Service emailObserver = service object {

   remote function onMessage(email:Message emailMessage) {
      io:println("Email Body: ", emailMessage?.body);
   }

   remote function onError(email:Error emailError) {
      io:println("Error while polling for the emails: "
            + emailError.message());
   }

   remote function onClose(email:Error? closeError) {
   }

};
```
When a new email is received `onMessage` function get called with the received email given as the argument.
If an error occurred during the listening `onError` method get called.
When the listener is getting closed `onClose` method get called.

## 5 Samples

### 5.1 Clients

#### 5.1.1 SMTP Client
```ballerina
public function main() returns error? {
    email:SmtpClient smtpClient = check new ("smtp.email.com", "sender@email.com" , "pass123");
    email:Message email = {
        to: ["receiver1@email.com", "receiver2@email.com"],
        subject: "Sample Email",
        body: "This is a sample email.",
        'from: "author@email.com",
        replyTo: ["replyTo1@email.com", "replyTo2@email.com"]
    };
    check smtpClient->sendMessage(email);
}
```

#### 5.1.2 POP3 Client
```ballerina
public function main() returns error? {
    email:PopClient popClient = check new ("pop.email.com", "reader@email.com", "pass456");
    email:Message? emailResponse = check popClient->receiveMessage();
    if (emailResponse is email:Message) {
        io:println("POP client received an email.");
        io:println("Email Subject: ", emailResponse.subject);
        io:println("Email Body: ", emailResponse?.body);
    } else {
        io:println("There are no emails in the INBOX.");
    }
    check popClient->close();
}
```

#### 5.1.3 IMAP Client
```ballerina
public function main() returns error? {
    email:ImapClient imapClient = check new ("imap.email.com", "reader@email.com", "pass456");
    emailResponse = check imapClient->receiveMessage();
    if (emailResponse is email:Message) {
        io:println("IMAP client received an email.");
        io:println("Email Subject: ", emailResponse.subject);
        io:println("Email Body: ", emailResponse?.body);
    } else {
        io:println("There are no emails in the INBOX.");
    }
    check imapClient->close();
}
```

### 5.2 services

#### 5.2.1 POP3 Service
```ballerina
import ballerina/email;
import ballerina/io;

listener email:PopListener emailListener = check new ({
    host: "pop.email.com",
    username: "reader@email.com",
    password: "pass456",
    pollingInterval: 2,
    port: 995
});

service "emailObserver" on emailListener {

    remote function onMessage(email:Message emailMessage) {
        io:println("POP Listener received an email.");
        io:println("Email Subject: ", emailMessage.subject);
        io:println("Email Body: ", emailMessage?.body);
    }

    remote function onError(email:Error emailError) {
        io:println("Error while polling for the emails: " + emailError.message());
    }

    remote function onClose(email:Error? closeError) {
        io:println("Closed the listener.");
    }

}
```

#### 5.2.2 IMAP Service
```ballerina
import ballerina/email;
import ballerina/io;

listener email:ImapListener emailListener = check new ({
    host: "imap.email.com",
    username: "reader@email.com",
    password: "pass456",
    pollingInterval: 2,
    port: 993
});

service "emailObserver" on emailListener {

    remote function onMessage(email:Message emailMessage) {
        io:println("IMAP Listener received an email.");
        io:println("Email Subject: ", emailMessage.subject);
        io:println("Email Body: ", emailMessage?.body);
    }

    remote function onError(email:Error emailError) {
        io:println("Error while polling for the emails: " + emailError.message());
    }

    remote function onClose(email:Error? closeError) {
        io:println("Closed the listener.");
    }

}
```
