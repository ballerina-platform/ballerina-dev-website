---
layout: ballerina-why-ballerina-left-nav-pages-swanlake
title: Graphical
description: See why the support for a graphical model lays the foundation for designing the syntax and semantics of the Ballerina programming language.
keywords: ballerina, programming language, sequence diagram, graphical, diagram editor, why ballerina
permalink: /why-ballerina/graphical/
active: graphical
redirect_from:
  - /why/sequence-diagrams-for-programming/
  - /why/sequence-diagrams-for-programming
  - /learn/user-guide/why-ballerina/sequence-diagrams-for-programming
  - /learn/user-guide/why-ballerina/sequence-diagrams-for-programming/
  - /learn/user-guide/why-ballerina/graphical
  - /learn/user-guide/why-ballerina/graphical/
  - /learn/why-ballerina/graphical
  - /learn/why-ballerina/graphical/
  - /why-ballerina/graphical
---

In today’s cloud-era, you need technologies that can model distributed systems in a more developer-friendly way. This means that for a single use case you need to model a flow that shows how multiple actors interact with each other, how concurrent execution flows, and what remote endpoints are involved. Sequence diagrams are known to be the best way to visually describe this.

That’s why sequence diagrams are the foundation for designing the syntax and semantics of the Ballerina language. Ballerina provides the flexibility of a general-purpose language while having features to model and visualize solutions based on higher-level abstractions derived from sequence diagrams.


## Sequence Diagrams in Ballerina

Being based on sequence diagrams, Ballerina allows you to visualize a program written in Ballerina as a sequence diagram. The diagram will display the logic and network interaction of a function or a service resource. You can view and edit these diagrams using the Ballerina VSCode plugin.

<img src="/img/why-pages/sequence-diagrams-for-programming-1.png" alt="Ballerina sequence diagram"  style="width:100%; border: 1px solid #eee;">

One of the key benefits of the diagram is that it acts as a documentation of the code. It makes it far easier to comprehend the program than reading the source code. Even if you are not familiar with Ballerina code syntax it is easier to understand the diagram.

> ***"[With Ballerina] you can get sequence diagrams automatically. When things start to get complicated and you need to understand and socialize with the rest of your team what it is that you're building, these diagrams become very helpful." -- Christian Posta, field CTO, solo.io***


### Get Started

The [Ballerina Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) can generate a sequence diagram dynamically from the source code. To start generating a sequence diagram from your Ballerina code, [download](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina) the VSCode extension and launch the graphical viewer.


## Graphical Representation

### Functions

Functions in Ballerina are visualized as a sequence diagram. The diagram will have a lifeline with start and end which represent the default worker of the function. The worker lifeline will be displayed as a flow diagram to represent function logic.



<img src="/img/why-pages/sequence-diagrams-for-programming-2.png" alt="Ballerina sequence diagram of HTTP resource definition" style="width:100%; border: 1px solid #eee;">


### Client Objects and Remote Methods

Ballerina has special network client objects, like HTTP clients and database connections, that have their own lifeline to represent its functionality and the messages that it can receive. The messages sent to or the invocations are done on these network clients are called _remote methods_ — a special method inside a client object that represents a call through the network. Remote calls are distinguished from normal method calls by using the arrow “`->`” notation.

The following code shows an HTTP client that is used to do GET and POST requests to a remote endpoint:


```ballerina
function execute() returns error? {
    http:Client lookupService = check new (lookupUrl);
    http:Client reportService = check new (reportUrl);

    json result = check lookupService->get("/query");
    http:Response response = check reportService->post("/report", result);
}
```

The HTTP clients represented by `lookupService` and `reportService` variables are of type `http:Client`, which represents remote HTTP endpoints. The following diagram shows the generated sequence diagram for the above remote method calls.



<img src="/img/why-pages/sequence-diagrams-for-programming-3.png" alt="Ballerina sequence diagram of HTTP resource definition" style="width:100%; border: 1px solid #eee;">


You can see here how the HTTP clients have become participants of the sequence diagram with its own lifeline, where you visualize the messages sent and received to represent the network calls you do.

