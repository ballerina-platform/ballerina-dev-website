---
layout: ballerina-left-nav-pages-swanlake
title: The Network in the Language
description: See how the Ballerina programming language makes networking concepts like client objects, services, resource functions, and listeners a part of the syntax.
keywords: ballerina, networking, microservices, programming language, distributed computing, services
permalink: /learn/user-guide/why-ballerina/the-network-in-the-language/
active: the-network-in-the-language
intro: See how the Ballerina programming language makes networking concepts like client objects, services, resource functions, and listeners a part of the syntax.
redirect_from:
  - /why/the-network-in-the-language/
  - /why/the-network-in-the-language
  - /learn/user-guide/why-ballerina/the-network-in-the-language
  - /learn/user-guide/why-ballerina
  - /learn/user-guide/why-ballerina/
  - /learn/why-ballerina/
  - /learn/why-ballerina
  - /why-ballerina/
  - /why-ballerina
---

In a microservice architecture, smaller services are built, deployed and scaled individually. These disaggregated services communicate with each other over the network forcing developers to deal with the <a href="https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing">Fallacies of Distributed Computing</a> as a part of their application logic.

For decades, programming languages have treated networks simply as I/O sources. Ballerina treats the network differently by making networking concepts like client objects, services, resource functions, and listeners a part of the syntax. So you can use the language-provided constructs to write network programs that just work.

## Services

Ballerina introduces service typing where services, which work in conjunction with a listener object, can have one or more resource methods in which the application logic is implemented. The listener object provides an interface between the network and the service. It receives network messages from a remote process according to the defined protocol and translates it into calls on the resource methods of the service that has been attached to the listener object.

### Get Started

Here’s a simple Hello World service to get you started:

```ballerina
import ballerina/http;

service / on new http:Listener(9090) {

    resource function get greeting() returns string {
        return "Hello World!";
    }

}
```

The Ballerina source file is compiled and executed in the following manner:

```bash
$ bal run hello.bal

Compiling source
        hello.bal

Running executable

[ballerina/http] started HTTP/WS listener 0.0.0.0:9090

$ curl http://localhost:9090/greeting
Hello, World!
```

Ballerina services come with built-in concurrency. Every request to a resource method is handled in a separate strand (Ballerina concurrency unit), which gives implicit concurrent behavior to a service.

Some protocols supported out-of-the-box include:

<ul class="cInlinelinklist">
<li><a class="cGreenLinkArrow" href="/learn/by-example/https-listener.html">HTTP</a></li>
<!--<li><a class="cGreenLinkArrow" href="/learn/by-example/http-to-websocket-upgrade.html">WebSocket Upgrade</a></li>-->
<li><a class="cGreenLinkArrow" href="/learn/by-example/http-1-1-to-2-0-protocol-switch.html">HTTP 2.0</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/grpc-unary-blocking.html">gRPC</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/nats-basic-client.html">NATS</a></li>
</ul>

## Async Network Protocol

In the request-response paradigm, network communication is done by blocking calls, but blocking a thread to a network call is very expensive. That’s why other languages supported async I/O and developers have to implement async/await by using callback-based code techniques.

On the other hand, Ballerina’s request-response protocols are implicitly non-blocking and will take care of asynchronous invocations.

### Get Started

The code snippet below shows a call to a simple HTTP GET request endpoint:

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client clientEP = check new ("http://www.mocky.io");
    string payload = check clientEP->get("/v2/5ae082123200006b00510c3d/", targetType = string);
    io:println(payload);
}
```

The above `get` operation is seemingly a blocking operation for the developer, but internally it does an asynchronous execution using non-blocking I/O, where the current execution thread is released to the operating system to be used by others. After the I/O operation is done, the program execution automatically resumes from where it was suspended. This pattern gives the developer a much more convenient programming model than handling non-blocking I/O manually while providing maximum performance efficiency.

## Client Objects

Client objects allow workers to send network messages that follow a certain protocol to a remote process. The remote methods of the client object correspond to distinct network messages defined by the protocol for the role played by the client object.

### Get Started

The following sample illustrates sending out a tweet by invoking tweet remote method in the twitter client object.

```ballerina
import ballerina/io;
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string accessToken = ?;
configurable string accessTokenSecret = ?;

// Twitter package defines this type of endpoint
// that incorporates the twitter API.
// We need to initialize it with OAuth data from apps.twitter.com.
// Instead of providing this confidential data in the code
// we read it from a configuration file.
twitter:Client twitterClient = new ({
    clientId: clientId,
    clientSecret: clientSecret,
    accessToken: accessToken,
    accessTokenSecret: accessTokenSecret,
    clientConfig: {}
});
public function main() returns error? {
    twitter:Status status = check twitterClient->tweet("Hello World!");
    io:println("Tweeted: ", <@untainted>status.id);
}
```
 
### Resiliency

<em>The network is unreliable.</em> That’s why network programs need to be written in a way that handles failures. In some cases, an automatic retry will help recover from failures while in others failover techniques will help deliver uninterrupted service. Techniques like circuit breakers also help to prevent catastrophic cascading failure across multiple programs.

Ballerina helps developers write resilient, robust programs with out-of-the-box support for techniques such as:

<ul class="cInlinelinklist">
<li><a class="cGreenLinkArrow" href="/learn/by-example/http-circuit-breaker.html">Circuit Breaker</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/http-load-balancer.html">Load Balancing</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/http-failover.html">Failover</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/http-retry.html">Retry</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/http-timeout.html">Timeout</a></li>
</ul>

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

Due to the inherent unreliability of networks, errors are an expected part of network programming. That’s why in Ballerina errors are explicitly checked rather than thrown as exceptions. It’s impossible to ignore errors by design because of Ballerina’s comprehensive error handling capabilities:

<ul class="cInlinelinklist">
<li><a class="cGreenLinkArrow" href="/learn/by-example/error-handling.html">Error Handling</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/check.html">Check</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/panic.html">Panic</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/checkpanic.html">Check Panic</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/trap.html">Trap</a></li>
<li><a class="cGreenLinkArrow" href="/learn/by-example/user-defined-error.html">User-defined Error Types</a></li>
</ul>

### Get Started

Below is a simple example of how you can explicitly check for errors:

```ballerina
twitter:Status|error result = twitterClient->tweet("Hello World!");
if result is error {
    io:println("Tweet failed: ", result);
} else {
    io:println("Tweeted: ", <@untainted>status.id);
}
```

The `tweet` remote method can return the expected `twitter:Status` value or an error due to network unreliability. Ballerina supports union types so the `status` variable can be either `twitter:Status` or `error` type. Also the Ballerina IDE tools support type guard where it guides developers to handle errors and values correctly in the if-else block.

## Network Data Safety

Distributed systems work by sharing data between different components. Network security plays a crucial role because all these communications happen over the network. Ballerina provides built-in libraries to implement transport-level security and <a href="/learn/by-example/crypto.html">cryptography</a> to protect data.

Identity and access management also plays a critical role in microservice-based applications. Ballerina supports out-of-the-box protection for services as well as clients by using Basic-auth, OAuth2 and JWT. The following BBEs show how to secure services and clients by enforcing authorization.

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

<em>Ballerina ensures security by default</em>. Its built-in <a href="/learn/by-example/taint-checking.html?utm_source=infoq&amp;utm_medium=article&amp;utm_campaign=network_in_the_language_article_infoq_feb20">taint analyzer</a> makes sure that malicious, untrusted data doesn’t propagate through the system. If untrusted data is passed to a security-sensitive parameter, a compiler error is generated. You can then redesign the program to erect a safe wall around the dangerous input.

## Observability by Default

Increasing the number of smaller services that communicate with each other means that debugging an issue will be harder. Enabling observability on these distributed services will require effort. Monitoring, logging, and distributed tracing are key methods that reveal the internal state of the system and provide observability.

Ballerina becomes fully observable by exposing itself via these three methods to various external systems. This helps with monitoring metrics such as request count and response time statistics, analyzing logs, and performing distributed tracing. For more information, follow this guide:

### Get Started

Below is a simple example of how you can explicitly check for errors:

<ul class="cInlinelinklist">
<li><a href="/learn/observing-ballerina-code">Observing Ballerina Code</a></li>
</ul>


<style>
.nav > li.cVersionItem {
    display: none !important;
}
.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}
</style>
