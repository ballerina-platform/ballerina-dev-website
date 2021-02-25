---
layout: ballerina-left-nav-pages-swanlake
title: Secure Communication
description: TBallerina’s HTTP client supports numerous secure communication features such as Transport Level Security (TLS) and mutual authentication. 
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/network-communication/http/http-clients/secure-communication/
active: secure-communication
intro: Ballerina’s HTTP client supports numerous secure communication features such as Transport Level Security (TLS) and mutual authentication.   
redirect_from:
  - /learn/network-communication/http/http-clients/secure-communication
  - /swan-lake/learn/network-communication/http/http-clients/secure-communication/
  - /swan-lake/learn/network-communication/http/http-clients/secure-communication
---

## TLS

The TLS features are used with the HTTP client by using the `https` protocol in the endpoint URL. Optionally, you can provide the information on the trust store location to use for validating the server certificates received when creating an HTTP connection over TLS. This is provided using the `secureSocket` property in the [HTTP client configuration](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/records/ClientConfiguration). 

### Communicating with an HTTPS Endpoint

The `tls_demo.bal` example below shows a scenario of communicating with an HTTPS endpoint. 

**tls_demo.bal**
```ballerina
import ballerina/io;
import ballerina/http;
import ballerina/config;
 
public function main() returns @tainted error? {
   http:Client clientEp = new ("https://httpbin.org");
   http:Response resp = <http:Response> check clientEp->get("/get");
   io:println("Payload: ", resp.getJsonPayload());
}
```

Execute the `bal run tls_demo.bal --b7a.home=<BALLERINA_HOME_PATH>` command and the output will be as follows.

```bash
Payload: {"args":{},"headers":{"Host":"httpbin.org","User-Agent":"ballerina","X-Amzn-Trace-Id":"Root=1-5fd3bed7-6b8c04e179f3e1022231d67a"},"origin":"45.30.94.9","url":"https://httpbin.org/get"}
```

### Providing a Custom Trust Store Configuration

The `tls_custom_demo.bal` example below shows how a custom trust store configuration can be created and provided to the client.

**tls_custom_demo.bal**
```ballerina
import ballerina/io;
import ballerina/http;
import ballerina/config;
 
public function main() returns @tainted error? {
   http:ClientConfiguration clientEpConfig = {
       secureSocket: {
           trustStore: {
               path: config:getAsString("b7a.home") +
                   "/bre/security/ballerinaTruststore.p12",
               password: "ballerina"
           }
       }
   };
   http:Client clientEp = new ("https://httpbin.org", clientEpConfig);
   http:Response resp = <http:Response> check clientEp->get("/get");
   io:println("Payload: ", resp.getTextPayload());
}
```

Execute the `bal run tls_custom_demo.bal --b7a.home=BALLERINA_HOME_PATH>` command and the output will be as follows.

```bash
Compiling source
    	tls_custom_demo.bal.bal

Running executable

Payload: {
  "args": {},
  "headers": {
	"Host": "httpbin.org",
	"User-Agent": "ballerina",
	"X-Amzn-Trace-Id": "Root=1-5fd3c1dc-0f5b5c3809c89dca2044ef70"
  },
  "origin": "45.30.94.9",
  "url": "https://httpbin.org/get"
}
```

## Mutual Authentication

In [Communicating with an HTTPS Endpoint](#communicating-with-an-https-endpoint), the server is authenticated using the certificate provided to the client, and the secure communication is started based on this information. In the mutual SSL scenario, the client gets the chance to authenticate itself with the remote server as well. 

This is done by additionally providing a key store. This is done via the `secureSocket.keyStore` property in the [HTTP client configuration](/learn/api-docs/ballerina/#/ballerina/http/1.0.6/http/records/ClientConfiguration). It will contain your private key and the certificates that will be used used in the authentication done by the remote server. 

The `mutual_authentication_demo.bal` example below shows an HTTP client configured for mutual authentication. 

**mutual_authentication_demo.bal**
```ballerina
import ballerina/io;
import ballerina/http;
import ballerina/config;
 
public function main() returns @tainted error? {
   http:ClientConfiguration clientEpConfig = {
       secureSocket: {
           trustStore: {
               path: config:getAsString("b7a.home") +
                   "/bre/security/ballerinaTruststore.p12",
               password: "ballerina"
           },
           keyStore: {
               path: config:getAsString("b7a.home") +
                       "/bre/security/ballerinaKeystore.p12",
               password: "ballerina"
           }
       }
   };
   http:Client clientEp = new ("https://httpbin.org", clientEpConfig);
   http:Response resp = <http:Response> check clientEp->get("/get");
   io:println("Payload: ", resp.getTextPayload());
}
```

For more information on Ballerina’s authentication/authorization features, see the [auth module](/learn/api-docs/ballerina/#/ballerina/auth/1.0.6).

## What's Next?

For other use cases of HTTP clients, see the topics below.
- [Multipart Message Handling](/learn/network-communication/http/multipart-message-handling)
- [Data Binding](/learn/network-communication/http/data-binding)
- [Data Streaming](/learn/network-communication/http/data-streaming)
- [Communication Resiliency](/learn/network-communication/http/communication-resiliency)