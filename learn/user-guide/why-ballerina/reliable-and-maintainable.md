---
layout: ballerina-left-nav-pages-swanlake
title: Reliable and Maintainable
description: The sections below explain why Ballerina is reliable and maintainable.
keywords: ballerina, ballerina platform, api documentation, testing, ide, ballerina central
permalink: /learn/user-guide/why-ballerina/reliable-and-maintainable/
active: reliable-and-maintainable
intro: The sections below explain why Ballerina is reliable and maintainable. 
redirct_from:
  - /learn/user-guide/why-ballerina/reliable-and-maintainable
---

## Resiliency 

The network is unreliable. That’s why network programs need to be written in a way that handles failures. In some cases, an automatic retry will help recover from failures while in others, failover techniques will help to deliver uninterrupted service. Techniques like circuit breakers also help to prevent catastrophic cascading failure across multiple programs.

Ballerina helps you write resilient, robust programs with out-of-the-box support for techniques such as:

- [Circuit Breaker](/learn/by-example/http-circuit-breaker.html)
- [Load Balancing](/learn/by-example/http-load-balancer.html) 
- [Failover](/learn/by-example/http-failover.html)
- [Retry](/learn/by-example/http-retry.html)
- [Timeout](/learn/by-example/http-timeout.html)

### Get Started

The code snippet below shows how you can easily configure a circuit breaker to handle network-related errors in the Ballerina HTTP client object.

```ballerina
http:Client backendClientEP = check new("http://localhost:8080", {
       circuitBreaker: {
           rollingWindow: {
               timeWindowInMillis: 10000,
               bucketSizeInMillis: 2000,
               requestVolumeThreshold: 0
           },
           failureThreshold: 0.2,
           resetTimeInMillis: 10000,
           statusCodes: [400, 404, 500]
       },
       timeoutInMillis: 2000
   });
```

## Error Handling

Due to the inherent unreliability of networks, errors are an expected part of network programming.That’s why in Ballerina errors are explicitly checked rather than thrown as exceptions. It’s impossible to ignore errors by design because of Ballerina’s comprehensive error handling capabilities below.

- [Error Handling](/learn/by-example/error-handling.html)
- [Check](/learn/by-example/check.html)
- [Panic](/learn/by-example/panic.html)
- [Check Panic](/learn/by-example/checkpanic.html)
- [Trap](/learn/by-example/trap.html)
- [User-defined Error Types](/learn/by-example/user-defined-error.html)

### Get Started

The below is a simple example of how you can explicitly check for errors.

```ballerina
twitter:Status|error result = twitterClient->tweet("Hello World!");
if result is error {
    io:println("Tweet failed: ", result);
} else {
    io:println("Tweeted: ", <@untainted>status.id);
}
```

The `tweet` remote method can return the expected `twitter:Status` value or an error due to network unreliability. Ballerina supports union types so the status variable can be either `twitter:Status` or error type. Also the Ballerina IDE tools support type guard where it guides you to handle errors and values correctly in the `if-else` block.

## Network Data Safety

Distributed systems work by sharing data between different components. Network security plays a crucial role because all these communications happen over the network. Ballerina provides built-in libraries to implement transport-level security and [cryptography](/learn/by-example/crypto.html) to protect data.

Identity and access management also plays a critical role in microservice-based applications. Ballerina supports out-of-the-box protection for services as well as clients by using Basic-auth, OAuth2 and JWT. The BBEs below show how to secure services and clients by enforcing authorization.


<table class="docutils">
                                 <tbody>
                                    <tr>
                                       <td style="width:200px"><strong>Service</strong></td>
                                       <td style="width:200px"><strong>Client</strong></td>
                                    </tr>
                                    <tr>
                                       <td>
                                            <a href="/learn/by-example/http-service-with-basic-auth-file-user-store.html">Basic Auth - File User Store</a><br/>
                                            <a href="/learn/by-example/http-service-with-basic-auth-ldap-user-store.html">Basic Auth - LDAP User Store</a>
                                       </td>
                                       <td><a href="/learn/by-example/http-client-with-basic-auth.html">Basic Auth</a></td>
                                    </tr>
                                    <tr>
                                       <td><a href="/learn/by-example/http-service-with-jwt-auth.html">JWT Auth</a></td>
                                       <td>
                                            <a href="/learn/by-example/http-client-with-self-signed-jwt-auth.html">Self-Signed JWT Auth</a><br/>
                                            <a href="/learn/by-example/http-client-with-bearer-token-auth.html">Bearer Token Auth</a>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td><a href="/learn/by-example/http-service-with-oauth2.html">OAuth2</a></td>
                                       <td>
                                            <a href="/learn/by-example/http-client-with-oauth2-client-credentials-grant-type.html">OAuth2 - Client Credentials Grant Type</a><br/>
                                            <a href="/learn/by-example/http-client-with-oauth2-password-grant-type.html">OAuth2 - Password Grant Type</a><br/>
                                            <a href="/learn/by-example/http-client-with-oauth2-refresh-token-grant-type.html">OAuth2 - Refresh Token Grant Type</a>
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>

Ballerina ensures security by default. Its built-in [taint analyzer](/learn/by-example/taint-checking.html) makes sure that malicious, untrusted data doesn’t propagate through the system. If untrusted data is passed to a security-sensitive parameter, a compiler error is generated. You can then redesign the program to erect a safe wall around the dangerous input.

## Observability by Default

Increasing the number of smaller services that communicate with each other means that debugging an issue will be harder. Enabling observability on these distributed services will require effort. Monitoring, logging, and distributed tracing are key methods that reveal the internal state of the system and provide observability.

Ballerina becomes fully observable by exposing itself via these three methods to various external systems. This helps with monitoring metrics such as request count and response time statistics, analyzing logs, and performing distributed tracing. 

For more information on a simple example of how you can explicitly check for errors, see [Observing Ballerina Code](/learn/user-guide/observing-ballerina-code/).

<style>
.nav > li.cVersionItem {
    display: none !important;
}
.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}
</style>
