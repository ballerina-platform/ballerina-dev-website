---
layout: ballerina-hello-world-left-nav-pages-swanlake
title: Writing Your First Ballerina Program
description: Let's create a simple Ballerina HTTP service and also an HTTP client to invoke it.
keywords: ballerina, quick tour, programming language, http service
permalink: /learn/hello-world/writing-your-first-ballerina-program/
active: writing-your-first-ballerina-program
intro: Let's create a simple Ballerina HTTP service and also an HTTP client to invoke it.
redirect_from:
 - /learn/user-guide/getting-started/writing-your-first-ballerina-program
 - /learn/user-guide/getting-started/writing-your-first-ballerina-program/
 - /learn/getting-started/hello-world/writing-your-first-ballerina-program
 - /learn/getting-started/hello-world/writing-your-first-ballerina-program/
 - /learn/hello-world/writing-your-first-ballerina-program
 - /learn/hello-world/
 - /learn/hello-world
---

A Ballerina application can have:

* a `main()` function will run as a terminating process. 
* a `service`, is hosted as a non-terminating process. 
  
Both of these are considered as entry points for program execution.

Let's create a simple Ballerina HTTP service and an HTTP client with a main function to invoke it.

## Writing a Simple Service

Let's write a simple HTTP service as shown below in a file with the `.bal` extension:

***hello_service.bal***
```ballerina
import ballerina/http;

# A service representing a network-accessible API
# bound to port `9090`.
service /hello on new http:Listener(9090) {

    # A resource representing an invokable API method
    # accessible at `/hello/sayHello`.
    #
    # + return - A string payload which eventually becomes 
    #            the payload of the response
    resource function get sayHello() returns string {
        return "Hello Ballerina!";
    }
}
```

Then, run the service:
```bash
$ bal run hello_service.bal
Compiling source
	hello_service.bal

Running executable
```
This confirms that the service is up and running. 

Alternatively, we can also first build and generate an executable JAR and then run it. Here, we also have the option to provide a name for the executable JAR.

Build the service:

```bash
$ bal build -o my_first_service.jar hello_service.bal
Compiling source
	hello_service.bal

Generating executable
	my_first_service.jar
```

Then, run it:
```bash
$ bal run my_first_service.jar
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
```

Now let's test the service simply using [cURL](https://curl.haxx.se/download.html):

```bash
$ curl http://localhost:9090/hello/sayHello
Hello Ballerina!
```

Next, let's create a Ballerina HTTP client and use that to invoke the service.

## Creating an HTTP Client to Invoke the Service

A Ballerina client is a component, which interacts with a network-accessible service. It aggregates one or more actions that can be executed on the network-accessible service and accepts configuration parameters related to the network-accessible service.

Let's create a Ballerina client with a `main` function to invoke the `hello` service:  

> **Note**: Returning `error?` from the `main` function allows you to use the `check` keyword to avoid handling errors explicitly. This is only done to keep the code simple. However, in real production code, you may have to handle those errors explicitly.

***hello_client.bal***
```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    // Add the relevant endpoint URL to perform the invocation.
    http:Client helloClient = check new("http://localhost:9090/hello");

    // Perform a `GET` request to the `hello` service. If successful, 
    // the remote call would return an `http:Response` or the payload 
    // (if the `targetType` defaultable parameter is configured).
    // Otherwise an `error` on failure.
    http:Response helloResp = check helloClient->get("/sayHello");

    // Retrieve the payload as a `string` and print it if the 
    // response of the remote call is successful.
    io:println(check helloResp.getTextPayload());
}
```

Then, run it:

> **Tip:** Make sure the `hello` service is [up and running](#writing-a-simple-service).

```bash
bal run hello_client.bal
Hello Ballerina!
```

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
