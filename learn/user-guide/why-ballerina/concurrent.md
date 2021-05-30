---
layout: ballerina-left-nav-pages-swanlake
title: Concurrent
description: Concurrency in Ballerina is enabled by strands, which are lightweight threads. 
keywords: ballerina, ballerina platform, api documentation, testing, ide, ballerina central
permalink: /learn/user-guide/why-ballerina/concurrent/
active: concurrent
intro: Concurrency in Ballerina is enabled by strands, which are lightweight threads. 
redirct_from:
  - /learn/user-guide/why-ballerina/concurrent
---

A single operating system thread can contain multiple strands. A single strand is run at a time in a thread and the strands belonging to a single thread are cooperatively multitasked. Strands allow you to optimize the usage of CPU time and are beneficial in implementing non-blocking I/O operations.

A worker represents a single strand execution in a function. Concurrent operations in a function are defined by multiple workers as shown in the example below.

```ballerina
public function initSystem(http:Client lookupService,
                           http:Client reportService) {
   worker proc1 {
       // process something
       var res1 = lookupService->get("/query");
       int x = 0;
       foreach var i in 1...10 { x += i; }
       x -> proc2;
       x = <- proc2;
       http:Request req = new;
       var res2 = reportService->post("/report", req);
   }
   worker proc2 {
       // process other things
       int x = 1;
       int i = 1;
       while i < 10 { x *= i; }
       x = <- proc1;
       var res1 = lookupService->get("/query");
       // process more
       x -> proc1;
   }
}
```

The code in the above example is contacting a couple of network endpoints retrieving information and reporting the state at the end. The network operations are mixed in with some computational code that is required to do some calculations.

This concurrency execution is visualized in the generated sequence diagram below.

<img src="/img/why-pages/sequence-diagrams-for-programming-5.png" alt="Ballerina sequence diagram visualizing concurrency">

The workers have become participants in the sequence diagram alongside the HTTP clients. The workers’ activations occur concurrently and communication between them is done using message passing (via Ballerina’s `send (->)` and `receive (<-)` actions. The compiler also explicitly verifies that the `send` and `receive` actions are in a consistent state in order to avoid any deadlock scenarios in the runtime.

<style>
.nav > li.cVersionItem {
    display: none !important;
}
.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}
</style>
