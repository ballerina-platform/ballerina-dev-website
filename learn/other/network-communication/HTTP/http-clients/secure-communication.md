---
layout: ballerina-left-nav-pages-swanlake
title: Secure communication
description: The HTTP client supports numerous secure communication features such as Transport Level Security (TLS) and mutual authentication. 
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-clients/secure-communication/
active: secure-communication
intro: The HTTP client supports numerous secure communication features such as Transport Level Security (TLS) and mutual authentication.   
redirect_from:
  - /learn/network-communication/http/http-clients/secure-communication
  - /swan-lake/learn/network-communication/http/http-clients/secure-communication/
  - /swan-lake/learn/network-communication/http/http-clients/secure-communication
  - /learn/network-communication/http/http-clients/secure-communication/
  - /learn/network-communication/http/http-clients/secure-communication
  - /learn/user-guide/network-communication/http/http-clients/secure-communication
  - /learn/network-communication/http/secure-communication/
  - /learn/network-communication/http/secure-communication
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

## Configuring secure communication

The TLS features are used with the HTTP client by using the `https` protocol in the endpoint URL. Optionally, you can provide the information on the truststore or server public certificate location to use for validating the server certificates received when creating an HTTP connection over TLS. This is provided using the `secureSocket` property in the [HTTP client configuration](https://docs.central.ballerina.io/ballerina/http/latest/records/ClientConfiguration) instance when creating the [`http:Client`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client).

### Communicating with an HTTPS endpoint

The `https_client_demo.bal` example below shows a scenario of communicating with an HTTPS endpoint.

**https_client_demo.bal**
```ballerina
import ballerina/http;
import ballerina/io;
 
public function main() returns error? {
    http:Client clientEp = check new ("https://httpbin.org");
    http:Response resp = check clientEp->get("/get");
    io:println("Payload: ", check resp.getJsonPayload());
}
```

Execute the `bal run https_client_demo.bal` command and the output will be as follows:

```bash
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

### Communicating with an HTTPS endpoint configured with public certificate

The `https_client_cert_demo.bal` example below shows how a public certificate can be used for the client when communicating with an HTTPS endpoint.

**https_client_cert_demo.bal**
```ballerina
import ballerina/http;
import ballerina/io;
 
public function main() returns error? {
    http:Client clientEp = check new("https://httpbin.org",
        secureSocket = {
            cert: "/path/to/public.crt"
        }
    );
    http:Response resp = check clientEp->get("/get");
    io:println("Payload: ", check resp.getTextPayload());
}
```

Execute the `bal run https_client_cert_demo.bal` command and the output will be as follows.

```bash
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

### Communicating with an HTTPS endpoint configured with TrustStore

The `https_client_truststore_demo.bal` example below shows how a truststore can be used for the client when communicating with an HTTPS endpoint.

**https_client_truststore_demo.bal**
```ballerina
import ballerina/http;
import ballerina/io;
 
public function main() returns error? {
    http:Client clientEp = check new("https://httpbin.org",
        secureSocket = {
            cert: {
                path: "/path/to/truststore.p12",
                password: "password"
            }
        }
    );
    http:Response resp = check clientEp->get("/get");
    io:println("Payload: ", check resp.getTextPayload());
}
```

Execute the `bal run https_client_truststore_demo.bal` command and the output will be as follows.

```bash
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

## Mutual TLS

In [Communicating with an HTTPS Endpoint](#communicating-with-an-https-endpoint), the server is authenticated using the certificate provided to the client, and the secure communication is started based on this information. In the Mutual TLS (mTLS) scenario, the client gets the chance to authenticate itself with the remote server as well. 

This is done by additionally providing a keystore or public cert and private key of the client. This is done via the `key` property of `secureSocket` property in the [HTTP client configuration]((/learn/api-docs/ballerina/#/ballerina/http/latest/records/ClientConfiguration). The keystore will also contain your private key and the certificates that will be used in the authentication done by the remote server. 

The `mutual_tls_demo.bal` example below shows an HTTP client configured for mutual authentication. 

**mutual_tls_demo.bal**
```ballerina
import ballerina/io;
import ballerina/http;
 
public function main() returns error? {
    http:Client clientEp = check new("https://httpbin.org",
        secureSocket = {
            cert: "/path/to/public.crt",
            key: {
                certFile: "/path/to/public.crt",
                keyFile: "path/to/private.key"
            }
        }
    );
    http:Response resp = check clientEp->get("/get");
    io:println("Payload: ", resp.getTextPayload());
}
```

For more information on Ballerina’s authentication/authorization features, see the [Authentication & Authorization](/learn/user-guide/security/authentication-and-authorization/).

## What's next?

For other use cases of HTTP clients, see the topics below.
- [Multipart Message Handling](/learn/network-communication/http/multipart-message-handling)
- [Data Binding](/learn/network-communication/http/data-binding)
- [Data Streaming](/learn/network-communication/http/data-streaming)
- [Communication Resiliency](/learn/network-communication/http/communication-resiliency)
