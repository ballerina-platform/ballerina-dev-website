---
layout: ballerina-left-nav-pages-swanlake
title: Data Oriented
description: See how the Ballerina programming language makes networking concepts like client objects, services, resource functions, and listeners a part of the syntax.
keywords: ballerina, networking, microservices, programming language, distributed computing, services
permalink: /learn/user-guide/why-ballerina/data-oriented/
active: data-oriented
intro: See how the Ballerina programming language makes networking concepts like client objects, services, resource functions, and listeners a part of the syntax.
redirect_from:
---

In a microservice architecture, smaller services are built, deployed and scaled individually. These disaggregated services communicate with each other over the network forcing developers to deal with the [Fallacies of Distributed Computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing) as a part of their application logic.
For decades, programming languages have treated networks simply as I/O sources. Ballerina treats the network differently by making networking concepts like client objects, services, resource functions, and listeners a part of the syntax. So you can use the language-provided constructs to write network programs that just work.

## Services

Ballerina introduces service typing where services, which work in conjunction with a listener object, can have one or more resource methods in which the application logic is implemented. The listener object provides an interface between the network and the service. It receives network messages from a remote process according to the defined protocol and translates it into calls on the resource methods of the service that has been attached to the listener object.

### Get Started

The below is a simple Hello World service to get you started.

```ballerina
import ballerina/http;

service / on new http:Listener(9090) {

    resource function get greeting() returns string {
        return "Hello World!";
    }

}
```

The Ballerina source file is compiled and executed in the following manner.

```bash
bal run hello.bal
```

You view the output below.

```bash
Compiling source
        hello.bal

Running executable

[ballerina/http] started HTTP/WS listener 0.0.0.0:9090

$ curl http://localhost:9090/greeting
Hello, World!
```

Ballerina services come with built-in concurrency. Every request to a resource method is handled in a separate strand (Ballerina concurrency unit), which gives implicit concurrent behavior to a service.

Some protocols supported out-of-the-box include the below.

- [HTTP](https://ballerina.io/learn/by-example/https-listener.html)
- [HTTP 2.0](https://ballerina.io/learn/by-example/http-1-1-to-2-0-protocol-switch.html)
- [gRPC](https://ballerina.io/learn/by-example/proto-to-ballerina.html)
- [NATS](https://ballerina.io/learn/by-example/nats-basic-client.html)

## Async Network Protocol

In the request-response paradigm, network communication is done by blocking calls. However, blocking a thread to a network call is very expensive. That’s why other languages supported async I/O and you have to implement async/await by using callback-based code techniques.
On the other hand, Ballerina’s request-response protocols are implicitly non-blocking and will take care of asynchronous invocations.

### Get Started

The code snippet below shows a call to a simple HTTP GET request endpoint.




<style>
.nav > li.cVersionItem {
    display: none !important;
}
.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}
</style>
