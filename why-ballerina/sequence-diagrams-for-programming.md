---
layout: ballerina-layer-page
title: Sequence Diagrams for Programming
description: See why the sequence diagram is the foundation for designing the syntax and semantics of the Ballerina programming language.
keywords: ballerina, programming lanaguage, sequence diagram, concurrency
permalink: /why-ballerina/sequence-diagrams-for-programming/
redirect_from:
  - /why/sequence-diagrams-for-programming/
  - /why/sequence-diagrams-for-programming
---
<div class="row cBallerina-io-Gray-row cContentRows">
   <div class="container">
      <div class="row">
         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cBallerina-io-Home-Middle-col">
            <div class="col-xs-12 col-sm-12" style="padding: 0;">
               <div class="cBlallerina-io-docs-content-container">
                  <div class="wy-nav-content">
                     <div class="rst-content">
                        <div role="main">
                           <div class="section">
                            <h1>Sequence Diagrams for Programming</h1>
                              <p>In today’s cloud-era, we need technologies that can model distributed systems in a more developer-friendly way. This means that for a single use case we need to model a flow that shows how multiple actors interact with each other, how concurrent execution flows, and what remote endpoints are involved. Sequence diagrams are known to be the best way to visually describe this.</p>
                              <p>That’s why it is the foundation for designing the syntax and semantics of the Ballerina language. Ballerina provides the flexibility of a general-purpose language while having features to model solutions based on higher-level abstractions.</p>
                              <h2 id="sequence-diagrams-in-ballerina">Sequence Diagrams in Ballerina</h2>
                              <p>In Ballerina, there is a bidirectional mapping between the textual representation of code in Ballerina syntax and the visual representation as a sequence diagram.</p>
                              <p><img src="/img/why-pages/sequence-diagrams-for-programming-1.png" alt="Sequence Diagrams for Programming"></p>
                              <p>In Ballerina services, the entry point is the service resource function. The actor who invokes the service resource is shown as the “caller”. The “Default” participant is the resource function itself, showing the operations in its lifeline. From the resource function, further function calls are shown in its lifeline and their internal operations are expanded and merged to the same sequence diagram to show their operations as well.</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>The Ballerina IDE plugin (for example, the <a href="https://ballerina.io/learn/vscode-plugin/">VSCode plugin</a>) can generate a sequence diagram dynamically from the source code. To start generating a sequence diagram from your Ballerina code, <a href="https://ballerina.io/learn/vscode-plugin/graphical-editor">download the VSCode plugin and launch the graphical editor</a>.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
<div class="row cBallerina-io-Gray-row cGray cContentRows">
   <div class="container">
      <div class="row">
         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cBallerina-io-Home-Middle-col">
            <div class="col-xs-12 col-sm-12" style="padding: 0;">
               <div class="cBlallerina-io-docs-content-container">
                  <div class="wy-nav-content">
                     <div class="rst-content">
                        <div role="main">
                           <div class="section">
                              <h2 id="client-objects-and-remote-methods">Client Objects and Remote Methods</h2>
                              <p>Ballerina has special network client objects, like HTTP clients and database connections, that have their own lifeline to represent its functionality and the messages that it can receive. The messages sent to or the invocations done on these network clients are called <em>remote methods</em> — a special method inside a client object that represents a call through the network. Remote calls are distinguished from normal method calls by using the arrow “<code class="highlighter-rouge cBasicCode">-&gt;</code>” notation.</p>
                              <p>The following code shows an HTTP client that is used to do GET and POST requests to a remote endpoint:</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">public function execute(http:Client lkSvc, http:Client rpSvc) {
  var res1 = lkSvc->get("/query");
  boolean report = true;
  http:Request req = new;
  if report {
      var res2 = rpSvc->post("/report", req);
  }
}
</code></pre>
                              <p>The HTTP clients represented by <code class="highlighter-rouge cBasicCode">lookupService</code> and <code class="highlighter-rouge cBasicCode">reportService</code> variables are of type <code class="highlighter-rouge cBasicCode">http:Client</code>, which represents remote HTTP endpoints. The following diagram shows the generated sequence diagram for the above remote method calls.</p>
 <div class="cInlineImage"> <img src="/img/why-pages/sequence-diagrams-for-programming-2.png" alt="Ballerina sequence diagram for HTTP client remote method call"></div>
                              <p>We can see here how the HTTP clients have become participants of the sequence diagram with its own lifeline, where we visualize the messages sent and received to represent the network calls we do.</p>
                              <p>In a similar manner, a database client is used to model a remote database server in order to interact using its remote methods to carry out database operations.</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">public function lookupAccountTx(jdbc:Client db, boolean clearTx) 
                                returns @tainted error? {
   var result = check db->select("SELECT * FROM AccountTx", Account);
   if clearTx {
       _ = check db->update("DELETE FROM AccountTx");
   }
}
</code></pre>
                              <p>The following diagram shows how the database operations are also automatically mapped to a sequence diagram similar to the HTTP client operations.</p>
                              <div class="cInlineImage"> <img src="/img/why-pages/sequence-diagrams-for-programming-3.png" alt="Ballerina database operations mapped in a sequence diagram"></div>
                              <p>Let’s look at an HTTP service resource called <code class="highlighter-rouge cBasicCode">withdrawMoney</code> as shown in the code below. The <code class="highlighter-rouge cBasicCode">caller</code> is the name of the first parameter of this method, which also happens to be a client object that represents the caller of our service resource.</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">resource function withdrawMoney(http:Caller caller, http:Request request,
                                string id, decimal val) 
                                returns @tainted error?
</code></pre>
                              <p>The <code class="highlighter-rouge cBasicCode">caller</code> instance of type <code class="highlighter-rouge cBasicCode">http:Caller</code> can be used by the resource author to communicate back with the caller by invoking its remote methods. This model allows you to easily implement messaging patterns like bi-directional communication. There can be multiple interactions with the caller rather than just returning the result at the end of the resource method definition.</p>
                              <p>The line below shows how we responded to the client using the caller instance.</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">var result = check caller->respond("Fail: no funds");
</code></pre>
                              <p>The following diagram shows how the HTTP resource definition is visualized, and how its interactions in the resource are shown.</p>
                              <div class="cInlineImage"> <img src="/img/why-pages/sequence-diagrams-for-programming-4.png" alt="Ballerina sequence diagram of HTTP resource definition" width="700"></div>
                              <p>The <code class="highlighter-rouge cBasicCode">result</code> here represents the response retrieved back from the caller, where for example, if there was an error communicated back to the caller, we can perform further actions in our resource method rather than ignoring it. This pattern encourages a more robust approach to handling errors.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
<div class="row cBallerina-io-Gray-row cContentRows">
   <div class="container">
      <div class="row">
         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cBallerina-io-Home-Middle-col">
            <div class="col-xs-12 col-sm-12" style="padding: 0;">
               <div class="cBlallerina-io-docs-content-container">
                  <div class="wy-nav-content">
                     <div class="rst-content">
                        <div role="main">
                           <div class="section">
                              <h2 id="concurrency">Concurrency</h2>
                              <p>Concurrency in Ballerina is enabled by <em>strands</em>, which are lightweight threads. A single operating system thread can contain multiple strands. A single strand is run at a time in a thread, and the strands belonging to a single thread are cooperatively multitasked. Strands allow us to optimize the usage of CPU time and is beneficial in implementing non-blocking I/O operations.</p>
                              <p>A worker represents a single strand execution in a function. Concurrent operations in a function are defined by multiple workers as shown in the example below.</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">public function initSystem(http:Client lookupService,
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
</code></pre>
                              <p>In the code, we are contacting a couple of network endpoints, retrieving information and reporting the state at the end. The network operations are mixed in with some computational code that is required to do some calculations.</p>
                              <p>This concurrency execution is visualized in the generated sequence diagram below:</p>
                              <div class="cInlineImage"> <img src="/img/why-pages/sequence-diagrams-for-programming-5.png" alt="Ballerina sequence diagram visualizing concurrency"></div>
                              <p>The workers have become participants in the sequence diagram alongside the HTTP clients. The workers’ activations occur concurrently and communication between them is done using message passing — Ballerina’s send (<code class="highlighter-rouge cBasicCode">-&gt;</code>) and receive (<code class="highlighter-rouge cBasicCode">&lt;-</code>) actions. The compiler also explicitly verifies that the send and receive actions are in a consistent state in order to avoid any deadlock scenarios in the runtime.</p>
                                <p>Ballerina has many out-of-the-box SaaS connectors, which you can find in <a href="https://central.ballerina.io/">Ballerina Central</a>.</p>
                           <div class="cQUOTE">
                              <p>"[With Ballerina] you can get sequence diagrams automatically. When things start to get complicated and you need to understand and socialize with the rest of your team what it is that you're building, these diagrams become very helpful,"</p>
                              <p class="cName">Christian Posta, field CTO, solo.io</p>
</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

<style>
.nav > li.cVersionItem {
    display: none !important;
}
.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}
</style>
