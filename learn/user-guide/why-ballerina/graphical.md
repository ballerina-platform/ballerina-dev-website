---
layout: ballerina-left-nav-pages-swanlake
title: Graphical
description: See why the support for a graphical model lays the foundation for designing the syntax and semantics of the Ballerina programming language.
keywords: ballerina, programming lanaguage, sequence diagram, graphical, diagram editor, why ballerina
permalink: /learn/user-guide/why-ballerina/graphical/
active: graphical
intro: See why the support for a graphical model lays the foundation for designing the syntax and semantics of the Ballerina programming language.
redirect_from:
  - /why/sequence-diagrams-for-programming/
  - /why/sequence-diagrams-for-programming
  - /learn/user-guide/why-ballerina/sequence-diagrams-for-programming
  - /learn/user-guide/why-ballerina/sequence-diagrams-for-programming/
  - /learn/user-guide/why-ballerina/graphical
---

In today’s cloud-era,technologies that can model distributed systems in a more developer-friendly way are required. This means that for a single use case, you need to model a flow that shows how multiple actors interact with each other, how concurrent execution flows, and what remote endpoints are involved. Sequence diagrams are known to be the best way to visually describe this.

That is why it is the foundation for designing the syntax and semantics of the Ballerina language. Ballerina provides the flexibility of a general-purpose language while having features to model solutions based on higher-level abstractions.

> ***"[With Ballerina] you can get sequence diagrams automatically. When things start to get complicated and you need to understand and socialize with the rest of your team what it is that you're building, these diagrams become very helpful." -- Christian Posta, field CTO, solo.io***

## Sequence Diagrams in Ballerina

In Ballerina, there is a bidirectional mapping between the textual representation of code in the Ballerina syntax and the visual representation as a sequence diagram.

<img src="/img/why-pages/sequence-diagrams-for-programming-1.png" alt="Sequence Diagrams in Ballerina">

In Ballerina services, the entry point is the service resource function. The actor who invokes the service resource is shown as the `caller`. The default participant is the resource function itself showing the operations in its lifeline. From the resource function, further function calls are shown in its lifeline and their internal operations are expanded and merged to the same sequence diagram to show their operations as well.

## Get Started

The Ballerina VSCode plugin can generate a sequence diagram dynamically from the source code. To start generating a sequence diagram from your Ballerina code, download the [VSCode plugin and launch the graphical editor](/learn/tooling-guide/visual-studio-code-extension/installing-the-vs-code-extension/).

## Client Objects and Remote Methods

Ballerina has special network client objects such as HTTP clients and database connections that have their own lifeline to represent its functionality and the messages that it can receive. The messages sent to or the invocations done on these network clients are called remote methods (i.e.,a special method inside a client object that represents a call through the network). Remote calls are distinguished from normal method calls by using the arrow `->` notation.

The following code shows an HTTP client that is used to do GET and POST requests to a remote endpoint.

```ballerina
public function execute(http:Client lkSvc, http:Client rpSvc) {
  var res1 = lkSvc->get("/query");
  boolean report = true;
  http:Request req = new;
  if report {
      var res2 = rpSvc->post("/report", req);
  }
}
```

The HTTP clients represented by the `lookupService` and `reportService` variables are of the `http:Client` type, which represents the remote HTTP endpoints. The following diagram shows the generated sequence diagram for the above remote method calls.

<img src="/img/why-pages/sequence-diagrams-for-programming-2.png" alt="Ballerina sequence diagram for HTTP client remote method call">

In the above diargam, the HTTP clients have become participants of the sequence diagram with its own lifeline in which you visualize the messages sent and received to represent the network calls. In a similar manner, a database client is used to model a remote database server in order to interact using its remote methods to carry out the database operations.

```ballerina
public function lookupAccountTx(jdbc:Client db, boolean clearTx) 
                                returns @tainted error? {
   var result = db->query("SELECT * FROM AccountTx", Account);
   if clearTx {
       _ = check db->execute("DELETE FROM AccountTx");
   }
}
```

The following diagram shows how the database operations are also automatically mapped to a sequence diagram similar to the HTTP client operations.

<img src="/img/why-pages/sequence-diagrams-for-programming-3.png" alt="Ballerina database operations mapped in a sequence diagram">

In the HTTP service resource called `withdrawMoney` as shown in the code below, the caller is the name of the first parameter of this method, which also happens to be a client object that represents the caller of our service resource.

```ballerina
resource function withdrawMoney(http:Caller caller, http:Request request,
                                string id, decimal val) 
                                returns @tainted error?
```

The caller instance of type `http:Caller` can be used by the resource author to communicate back with the caller by invoking its remote methods. This model allows you to easily implement messaging patterns like bi-directional communication. There can be multiple interactions with the caller rather than just returning the result at the end of the resource method definition.
The line below shows how we responded to the client using the caller instance.

```ballerina
var result = check caller->respond("Fail: no funds");
```

The diagram below shows how the HTTP resource definition is visualized and how its interactions in the resource are shown.

<img src="/img/why-pages/sequence-diagrams-for-programming-4.png" alt="Ballerina sequence diagram of HTTP resource definition" width="700">

The result of the above diagram represents the response retrieved back from the caller in which for example, if there was an error communicated back to the caller, you can perform further actions in the resource method rather than ignoring it. This pattern encourages a more robust approach to handling errors.
           

<style>
.nav > li.cVersionItem {
    display: none !important;
}
.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}
</style>
