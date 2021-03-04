---
layout: ballerina-left-nav-pages-swanlake
title: Secure Communication
description: The HTTP listener can be configured to enable transport security to restrict to HTTPS clients for communication. 
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-services/secure-communication/
active: secure-communication
intro: The HTTP listener can be configured to enable transport security to restrict to HTTPS clients for communication. 
redirect_from:
  - /learn/network-communication/http/http-services/secure-communication
  - /swan-lake/learn/network-communication/http/http-services/secure-communication/
  - /swan-lake/learn/network-communication/http/http-services/secure-communication
  - /learn/network-communication/http/http-services/secure-communication/
  - /learn/network-communication/http/http-services/secure-communication/
---

## Configuring Secure Communication

This is done by providing an optional [`ListenerConfiguration`](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/records/ListenerConfiguration) instance when creating the [`http:Listener`](learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/listeners/Listener) client and providing the secure socket configurations. 

## Example

The example below shows how an HTTPS service is configured. 

```ballerina
import ballerina/http;
import ballerina/os;
 
http:ListenerConfiguration listenerConf = {
   secureSocket: {
       keyStore: {
           path: os:getEnv("BAL_HOME") +
                 "/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};
 
service / on new http:Listener(8443, listenerConf) {
    resource function get greeting() returns string {
        return "Hello!";
    }
}
```

## Execution

The execution of the service and its invocation is shown below.

```bash
$ export BAL_HOME=`bal home`

$ bal run demo.bal

[ballerina/http] started HTTP/WS listener 0.0.0.0:8080

$ curl -k https://localhost:8443/greeting
Hello!
```

## What's Next?

For other use cases of HTTP services, see the topics below.

- [Payload Data Binding](/learn/network-communication/http/http-services/payload-data-binding/)
- [Extended Request/Response Access](/learn/network-communication/http/http-services/extended-request-response-access/)
- [Multipart Message Handling](/learn/network-communication/http/http-services/multipart-message-handling/)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>