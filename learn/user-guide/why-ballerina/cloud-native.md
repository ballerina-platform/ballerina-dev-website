---
layout: ballerina-left-nav-pages-swanlake
title: Cloud Native
description: See how the Ballerina programming language has built-in cloud support, which helps developers deploy to cloud platforms like Docker and Kubernetes.
keywords: ballerina, programming language, cloud, kubernetes, docker
permalink: /learn/user-guide/why-ballerina/cloud-native/
active: cloud-native
intro: See how the Ballerina programming language has built-in cloud support, which helps developers deploy to cloud platforms like Docker and Kubernetes.
redirct_from:
  - /why/from-code-to-cloud/
  - /why/from-code-to-cloud
  - /learn/user-guide/why-ballerina/from-code-to-cloud
  - /learn/user-guide/why-ballerina/from-code-to-cloud/
---

In a microservice architecture, smaller services are developed, deployed, and scaled individually. These disaggregated services communicate with each other over the network forcing developers to deal with the [Fallacies of Distributed Computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing) as a part of their application logic.
For decades, programming languages have treated networks simply as I/O sources. Ballerina language introduces language constructs that seamlessly map to network programming concepts such as services and network resources. The sections below demonstrate a few of these language constructs and how they help to develop distributed services.

## Network-Friendly Type System

Ballerina's type system is specifically focused on aiding the development of networked and distributed applications. Ballerina is a `null` safe language with builtin support for popular wire formats `JSON` and `XML`, and seamless conversions between  `JSON` and `user-defined` types.

### Get Started

The sample below demonstrates a few simple usages of `json` and `xml` types.

```ballerina
public function main() returns error? {
    string name = "Katie Melua";

    // XML literal.
    xml album = xml 
    `<Album>
        <name>Piece By Piece</name>
        <artist>${name}</artist>
        <song>Spider's Web</song>
        <song>Nine Million Bicycles</song>
    </Album>`;
    io:println("XML Value: ", album);

    // Extract the list of song names from the XML value using a query expression.
    string[] songs = from var song in album/<song> select song.data();
    io:println("Extracted song names: ", songs);

    // JSON literal.
    json jAlbum = {
        "name": (album/<name>).data(),
        "artist": name,
        songs
    };
    io:println("JSON value: ", jAlbum);

    json artistName = check jAlbum.artist;
    io:println("Album artist: ", artistName);
}
```

The Ballerina source file is compiled and executed in the following manner.

```bash
bal run xml_json_sample.bal
```

Output:
```bash
Compiling source
        xml_json_sample.bal

Running executable.

<Album>
        <name>Piece By Piece</name>
        <artist>Katie Melua</artist>
        <song>Spider's Web</song>
        <song>Nine Million Bicycles</song>
    </Album>
Extracted song names: ["Spider's Web","Nine Million Bicycles"]
JSON value: {"name":"Piece By Piece","artist":"Katie Melua","songs":["Spider's Web","Nine Million Bicycles"]}
Album artist: Katie Melua
```

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

- [HTTP](/learn/by-example/https-listener.html)
- [HTTP 2.0](/learn/by-example/http-1-1-to-2-0-protocol-switch.html)
- [gRPC](/learn/by-example/proto-to-ballerina.html)
- [NATS](/learn/by-example/nats-basic-client.html)

## Async Network Protocol

In the request-response paradigm, network communication is done by blocking calls. However, blocking an OS thread to perform a network interaction is very expensive. That’s why many other languages supported async I/O and with that, you have to implement complicated logic to handle asynchronous events using techniques such as callbacks and promises.
On the other hand, Ballerina’s request-response protocols are implicitly non-blocking and will take care of asynchronous invocations.

### Get Started

The code snippet below shows a call to a simple HTTP GET request endpoint.

```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    http:Client clientEP = check new ("http://www.mocky.io");
    string payload = check clientEP->get("/v2/5ae082123200006b00510c3d/", targetType = string);
    io:println(payload);
}
```

Although the above `get` operation is seemingly a blocking operation, internally, it does an asynchronous execution using the non-blocking I/O, where the current execution thread is released to the Ballerina runtime scheduler to be used by other Ballerina strands. After the I/O operation is done, the program execution automatically resumes from where it was suspended. This pattern gives you a much more convenient programming model than handling the non-blocking I/O manually while providing maximum performance efficiency.

## Client Objects

Client objects allow Ballerina developer to communicate with a remote process which follow a certain protocol. The remote methods of the client object correspond to distinct network messages defined by the protocol for the role played by the client object.

### Get Started

The sample below illustrates sending out a tweet by invoking tweet remote method in the twitter client object.

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

## Code to Cloud

Although in the past, you simply wrote their program, built it, and ran it, today, you also need to think of various deployment options such as Docker, Kubernetes, serverless environments, and service meshes. However, this deployment process is not part of the programming experience. You have to write code in a certain way to work well in a given execution environment and removing this from the programming problem isn’t good.

Ballerina specializes in moving from code to cloud while providing a unique developer experience. The Ballerina compiler can be extended to read the source code and generate artifacts to deploy your code into different clouds. These artifacts can be Dockerfiles, Docker images, Kubernetes YAML files, or serverless functions.


### From Code to Kubernetes
Kubernetes is the preferred platform for running applications with multiple microservices in production. It can be used for automating deployment and scaling, and the management of containerized applications. Kubernetes defines a set of unique building blocks that need to be defined as YAML files and deployed into the Kubernetes cluster.

However, in many cases, creating these YAML files could be out of your comfort zone, and thereby, the Ballerina compiler can create these YAML files while compiling the source code. The code below shows the build option you need to use to do this.

The following code snippet shows how the Ballerina compiler can generate YAML files to deploy your code to Kubernetes.

```ballerina
import ballerina/http;

service /hello on new http:Listener(9090) {
    resource function get sayHello() returns string
            returns error? {
        check caller->respond("Hello, World!");
    }
}
```

Building the source with `bal build --cloud=k8s` will generate the Kubernetes YAML files and Docker image that is required to deploy the `hello` application into Kubernetes.

Building the source with `bal build --cloud=docker` will generate the Docker image and Dockerfile.

### From Code to AWS Lambda
AWS Lambda is an event-driven, serverless computing platform. Ballerina functions can be deployed in AWS Lambda by annotating a Ballerina function with `@awslambda:Function`, which should have the `function (awslambda:Context, json) returns json|error` function signature.

The sample below illustrates a simple echo function with AWS Lambda annotations. 

```ballerina
import ballerinax/awslambda;

// The `@awslambda:Function` annotation marks a function to
// generate an AWS Lambda function
@awslambda:Function
public function echo(awslambda:Context ctx, json input) returns json {
   return input;
}
```

### From Code to Azure Functions
Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Ballerina functions can be deployed in Azure by annotating a Ballerina function with `@azure_functions:Function`.

```ballerina
import ballerina/uuid;
import ballerinax/azure_functions as af;

// HTTP request/response with no authentication
@af:Function
public function hello(@af:HTTPTrigger { authLevel: "anonymous" } string payload) 
                      returns @af:HTTPOutput string|error {
    return "Hello, " + payload + "!";
}
```

### CI/CD with GitHub Actions
In a microservice architecture, continuous integration and continuous delivery (CI/CD) is critical in creating an agile environment for incorporating incremental changes to your system. There are different technologies that provide this CI/CD functionality and very recently GitHub has introduced GitHub Actions, which are now available for general usage. GitHub Actions provide a convenient mechanism for implementing CI/CD pipelines using their workflow concept right from your GitHub repositories.

With (Ballerina GitHub Actions)[https://github.com/marketplace/actions/ballerina-action], it is much easier to create a Ballerina development environment with built-in CI/CD. 

<style>
.nav > li.cVersionItem {
    display: none !important;
}
.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}
</style>
