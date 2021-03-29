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
  - /learn/user-guide/network-communication/http/http-services/secure-communication
---

## Configuring Secure Communication

This is done by providing the optional `secureSocket` property in the [HTTP Listener Configuration](/learn/api-docs/ballerina/#/ballerina/http/latest/http/records/ListenerConfiguration) instance when creating the [`http:Listener`](/learn/api-docs/ballerina/#/ballerina/http/latest/http/listeners/Listener).

## Example of HTTPS Endpoint configured Public Certificate and Private Key

The example below shows how an HTTPS service is configured with public certificate and private key.

```ballerina
import ballerina/http;
 
http:ListenerConfiguration conf = {
   secureSocket: {
       key: {
           certFile: "/path/to/public.crt"
           keyFile: "/path/to/private.key",
       }
   }
};
 
service / on new http:Listener(8443, conf) {
    resource function get greeting() returns string {
        return "Hello!";
    }
}
```

## Example of HTTPS Endpoint configured KeyStore

The example below shows how an HTTPS service is configured with KeyStore.

```ballerina
import ballerina/http;
 
http:ListenerConfiguration conf = {
   secureSocket: {
       key: {
           path: "/path/to/keystore.p12"
           password: "password",
       }
   }
};
 
service / on new http:Listener(8443, conf) {
    resource function get greeting() returns string {
        return "Hello!";
    }
}
```

For more information on Ballerina’s authentication/authorization features, see the [Authentication & Authorization](/learn/user-guide/security/authentication-and-authorization/).

## What's Next?

For other use cases of HTTP services, see the topics below.

- [Payload Data Binding](/learn/network-communication/http/http-services/payload-data-binding/)
- [Extended Request/Response Access](/learn/network-communication/http/http-services/extended-request-response-access/)
- [Multipart Message Handling](/learn/network-communication/http/http-services/multipart-message-handling/)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
