---
layout: ballerina-inner-page
title: Quick Tour
description: A quick tour of the Ballerina programming language, including writing, running and invoking an HTTP service and using a client to interact with a service.
keywords: ballerina, quick tour, programming language, http service
permalink: /swan-lake/learn/quick-tour/
active: quick-tour
intro: Now, that you know a little bit of Ballerina, let's take it for a spin!
redirect_from:
  - /swan-lake/learn/quick-tour
---

## Installing Ballerina

1. [Download](/downloads) Ballerina based on the Operating System you are using. 
1. [Install](/swan-lake/learn/installing-ballerina) Ballerina. 
1. Set up [Visual Studio Code](/swan-lake/learn/tools-ides/vscode-plugin) for Ballerina.

## Creating a Service and Invoking It 

### Writing a 'hello' Service

Write a simple HTTP service as shown below in a file with the `.bal` extension (e.g., `hello_world.bal`).

```ballerina
import ballerina/http;
import ballerina/io;

# A service representing a network-accessible API
# bound to port `9090`.
service hello on new http:Listener(9090) {

    # A resource representing an invokable API method
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

### Running the 'hello' Service

Run the service by executing the command below.

```bash
$ ballerina run hello_world.bal
```

You get the following output.

```bash
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
```

This means your service is up and running. 

### Invoking the 'hello' Service Using cURL

Invoke the running service using an HTTP client. For example, execute the command below to use cURL.

```bash
$ curl http://localhost:9090/hello/sayHello
```

> **Tip**: If you do not have cURL installed, you can download it from [https://curl.haxx.se/download.html](https://curl.haxx.se/download.html).

You get the following response.

```
Hello Ballerina!
```

Alternatively, you can create a Ballerina HTTP client and use that to invoke the service as follows.

## Creating a Client to Invoke the 'hello' Service

A Ballerina client is a component, which interacts with a network-accessible service. It aggregates one or more actions that can be executed on the network-accessible service and accepts configuration parameters related to the network-accessible service.

There are two kinds of clients in Ballerina, inbound (or ingress) and outbound (or egress) clients. An outbound client object can be used to send messages to a network service.

### Creating the 'helloClient'

Follow the steps below to write an outbound Ballerina client to invoke the `hello` service.

1. Create the client ( a `hello_client.bal` file) as a Ballerina program with a `main` function and add the relevant endpoint URL to perform the invocation.   

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client helloClient = new("http://localhost:9090/hello");
}
```
2. Add the code to do a `GET` request to the `hello` service.

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client helloClient = new("http://localhost:9090/hello");
    http:Response helloResp = check helloClient->get("/sayHello");
}
```

The remote call would return an `http:Response` if successful, or an `error` on failure. 

> **Note**: Returning `error?` allows you to use the `check` keyword to avoid handling errors explicitly. This is only done to keep the code simple. However, in real production code, you may have to handle those errors explicitly.

3. Add the code to retrieve the payload as a `string` and print it if the response of the remote call was successful.

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client helloClient = new("http://localhost:9090/hello");
    http:Response helloResp = check helloClient->get("/sayHello");
    io:println(check helloResp.getTextPayload());
}
```

### Invoking the 'hello' Service Using the 'helloClient'

Make sure the `hello` service is [up and running](#running-the-ballerina-service) and execute the command below to run the `.bal` file containing the `main` function (of the client), which invokes the service.

```bash
$ ballerina run hello_client.bal
```

This would produce the following output.

```bash
Hello Ballerina!
```

### Creating a Client to Invoke a Service via Its API

Similarly, you can use a Ballerina HTTP client to interact with any HTTP service via its API.

## Creating the 'sunriseApi' Client

Follow the steps below to write a simple HTTP client that retrieves sunrise/sunset time details for Colombo.

1. Create a client (a `sunrise_client.bal` file) with the relevant endpoint URL as follows.

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client sunriseApi = new("http://api.sunrise-sunset.org");
}
```

2. Add the below code to perform a `GET` request to the sunrise-sunset backend.

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client sunriseApi = new("http://api.sunrise-sunset.org");
    http:Response sunriseResp = check sunriseApi->get("/json?lat=6.9349969&lng=79.8538463");
}
```

3. Add the code to retrieve the payload and print it.

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

### Invoking the Sunrise/Sunset Service Using the 'sunriseApi' Client

Execute the command below to invoke the service using this client.

```bash
$ ballerina run sunrise_client.bal
```

This should print out the sunrise/sunset details as follows.

## What's Next?

Now, that you have taken Ballerina around for a quick tour, you can explore Ballerina more.

* Go through the [Ballerina by Examples](/swan-lake/learn/by-example) to learn Ballerina incrementally with commented examples that cover every nuance of the syntax.
* Star the [Ballerina GitHub repo](https://github.com/ballerina-platform/ballerina-lang) and show appreciation to the Ballerina maintainers for their work. Also, watch the repo to keep track of Ballerina issues.
<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p><p data-button="iGitWatchText">"Watch"</p></div>
