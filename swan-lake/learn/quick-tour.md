---
layout: ballerina-inner-page
title: Ballerina Quick Tour
description: A quick tour of the Ballerina programming language, including writing, running and invoking an HTTP service and using a client to interact with a service.
keywords: ballerina, quick tour, programming language, http service
permalink: /learn/quick-tour/
active: quick-tour
redirect_from:
  - /learn/quick-tour
  - /v1-2/learn/quick-tour
  - /v1-2/learn/quick-tour/
---

# Quick Tour

Now, that you know a little bit of Ballerina, let's take it for a spin!

## Install Ballerina

1. [Download](https://ballerina.io/downloads) Ballerina based on the Operating System you are using. 
1. Follow the instructions given on the [Getting Started](/learn/getting-started) page to set it up. 
1. Follow the instructions given on the [Visual Studio Code Plugin](/learn/tools-ides/vscode-plugin) page or the [IntelliJ IDEA Plugin](/learn/tools-ides/intellij-plugin) page to set up your preferred editor for Ballerina.

## Write a Service, Run It, and Invoke It

Write a simple Hello World HTTP service in a file with the `.bal` extension.

```ballerina
import ballerina/http;
import ballerina/io;

# A service representing a network-accessible API
# bound to port `9090`.
service hello on new http:Listener(9090) {

    # A resource respresenting an invokable API method
    # accessible at `/hello/sayHello`.
    #
    # + caller - the client invoking this resource
    # + request - the inbound request
    resource function sayHello(http:Caller caller, http:Request request) {

        // Sends a response back to the caller.
        error? result = caller->respond("Hello Ballerina!");
        if (result is error) {
            io:println("Error in responding: ", result);
        }
    }
}
```

Now, you can run the service by running the following command.

```bash
$ ballerina run hello_world.bal
```

You get the following output.

```bash
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
```

This means your service is up and running. You can invoke the service using an HTTP client. In this case, we use cURL.

```bash
$ curl http://localhost:9090/hello/sayHello
```

> **Tip**: If you do not have cURL installed, you can download it from [https://curl.haxx.se/download.html](https://curl.haxx.se/download.html).

You get the following response.

```
Hello Ballerina!
```

Alternatively, you can use a Ballerina HTTP client to invoke the service.

## Use a Client to Interact with a Network Accessible Service

A Ballerina client is a component, which interacts with a network-accessible service. It aggregates one or more actions that can be executed on the network-accessible service and accepts configuration parameters related to the network-accessible service.

There are two kinds of clients in Ballerina, inbound (or ingress) and outbound (or egress) clients. An outbound client object can be used to send messages to a network service.

Having said that, let's see how you can use a Ballerina client to invoke the Hello World service.

First, you need to create the client with the relevant endpoint URL as follows. We will use a Ballerina program with a `main` function, which will perform the invocation.

> **Note**: returning `error?` allows you to use the `check` keyword to avoid handling errors explicitly. This is only done to keep the code simple. However, in real production code, you may have to handle those errors explicitly.

```ballerina
http:Client helloClient = new("http://localhost:9090/hello");
```

As the next step, add the below code to do a `GET` request to the Hello World service.

```ballerina
http:Response helloResp = check helloClient->get("/sayHello");
```

The remote call would return an `http:Response` if successful, or an `error` on failure. If successful, attempt retrieving the payload as a `string` and print the payload.

```ballerina
io:println(check helloResp.getTextPayload());
```

The complete source code should look similar to the following:

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client helloClient = new("http://localhost:9090/hello");
    http:Response helloResp = check helloClient->get("/sayHello");
    io:println(check helloResp.getTextPayload());
}
```

Make sure the service is up and running.

Now, you can run the `.bal` file containing the `main` function that invokes the service.

```bash
$ ballerina run hello_client.bal
```

This would produce the following output.

```bash
Hello Ballerina!
```

Similarly, you can use a Ballerina HTTP client to interact with any HTTP service.

Now, let's  look at a simple HTTP client that retrieves sunrise/sunset time details for Colombo.

Create a client with the relevant endpoint URL as follows.

```ballerina
http:Client sunriseApi = new("http://api.sunrise-sunset.org");
```

As the next step, add the below code to do a `GET` request to the sunrise-sunset backend.

```ballerina
http:Response sunriseResp = check sunriseApi->get("/json?lat=6.9349969&lng=79.8538463");
```

Now, add the below code snippet to retrieve the payload and print it.

```ballerina
json sunrisePayload = check sunriseResp.getJsonPayload();
io:println(sunrisePayload);
```

The complete source code should look similar to the following:

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client sunriseApi = new("http://api.sunrise-sunset.org");
    http:Response sunriseResp = check sunriseApi->get("/json?lat=6.9349969&lng=79.8538463");
    json sunrisePayload = check sunriseResp.getJsonPayload();
    io:println(sunrisePayload);
}
```

Now, you can invoke the service using this client by running the following command.

```bash
$ ballerina run sunrise_client.bal
```

This should print out the sunrise/sunset details.

## Follow the Repo

<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p> <p data-button="iGitWatchText">"Watch"</p></div>

Star [GitHub repo](https://github.com/ballerina-platform/ballerina-lang) and show appreciation to Ballerina maintainers for their work. Watch the repo to keep track of Ballerina issues.

## What's Next

Now, that you have taken Ballerina around for a quick tour, you can explore Ballerina more.

* Go through the [Ballerina by Examples](/learn/by-example) to learn Ballerina incrementally with commented examples that cover every nuance of the syntax.
