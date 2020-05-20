---
layout: ballerina-layer-page
title: The Network in the Language
description: See how the Ballerina programming language makes networking concepts like client objects, services, resource functions, and listeners a part of the syntax.
keywords: ballerina, networking, microservices, programming language, distributed computing, services
permalink: /why-ballerina/the-network-in-the-language/
redirect_from:
  - /why/the-network-in-the-language/
  - /why/the-network-in-the-language
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
                             <h1 id="the-network-in-the-language">The Network in the Language</h1>
                              <p>In a microservice architecture, smaller services are built, deployed and scaled individually. These disaggregated services communicate with each other over the network forcing developers to deal with the <a href="https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing">Fallacies of Distributed Computing</a> as a part of their application logic.</p>
                              <p>For decades, programming languages have treated networks simply as I/O sources. Ballerina treats the network differently by making networking concepts like client objects, services, resource functions, and listeners a part of the syntax. So you can use the language-provided constructs to write network programs that just work.</p>
                              <h2 id="services">Services</h2>
                              <p>Ballerina introduces service typing where services, which work in conjunction with a listener object, can have one or more resource methods in which the application logic is implemented. The listener object provides an interface between the network and the service. It receives network messages from a remote process according to the defined protocol and translates it into calls on the resource methods of the service that has been attached to the listener object.</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>Here’s a simple Hello World service to get you started:</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">import ballerina/http;
import ballerina/log; 
listener http:Listener helloWorldEP = new(9090);
 
service hello on helloWorldEP {
   resource function sayHello(http:Caller caller, http:Request request) {
       var result = caller->respond("Hello World!");
       if (result is error) {
           log:printError("Error in responding ", err = result);
       }
   }
}
</code></pre>
                              <p>The Ballerina source file can compile into an executable jar:</p>
                              <pre class="highlight"><code class="cBasicCode hljs">$ ballerina build hello.bal
Compiling source
    hello.bal
Generating executables
    Hello.jar
$ java -jar hello.jar
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
$ curl http://localhost:9090/hello/sayHello
Hello, World!
</code></pre>
                              <p>Ballerina services come with built-in concurrency. Every request to a resource method is handled in a separate strand (Ballerina concurrent unit), which gives implicit concurrent behavior to a service.</p>
                              <p>Some protocols supported out-of-the-box include:</p>
                              <ul class="cInlinelinklist">
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/https-listener.html">HTTPS</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/http-to-websocket-upgrade.html">WebSocket Upgrade</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/http-1.1-to-2.0-protocol-switch.html">HTTP 2.0</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/grpc-unary-blocking.html">gRPC</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/nats-basic-client.html">NATS</a></li>
                              </ul>
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
                              <h2 id="async-network-protocol">Async Network Protocol</h2>
                              <p>In the request-response paradigm, network communication is done by blocking calls, but blocking a thread to a network call is very expensive. That’s why other languages supported async I/O and developers have to implement async/await by using callback-based code techniques.</p>
                              <p>On the other hand, Ballerina’s request-response protocols are implicitly non-blocking and will take care of asynchronous invocation.</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>The code snippet below shows a call to a simple HTTP GET request endpoint:</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">import ballerina/http;
import ballerina/io;
 
http:Client clientEndpoint = new("http://postman-echo.com");
 
public function main() {
   var response = clientEndpoint->get("/get?test=123");
   if (response is http:Response) {
       // logic for handle response
   } else {
       io:println("Error when calling the backend: ", response.reason());
   }
}
                              </code></pre>
                              <p>The above “get” operation is seemingly a blocking operation for the developer, but internally it does an asynchronous execution using non-blocking I/O, where the current execution thread is released to the operating system to be used by others. After the I/O operation is done, the program execution automatically resumes from where it was suspended. This pattern gives the developer a much more convenient programming model than handling non-blocking I/O manually while providing maximum performance efficiency. </p>
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
                              <h2 id="services">Client Objects</h2>
                              <p>Client objects allow workers to send network messages that follow a certain protocol to a remote process. The remote methods of the client object correspond to distinct network messages defined by the protocol for the role played by the client object.</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>The following sample illustrates sending out a tweet by invoking tweet remote method in the twitter client object.</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">import ballerina/config;
import ballerina/log;
import wso2/twitter;
// Twitter package defines this type of endpoint
// that incorporates the twitter API.
// We need to initialize it with OAuth data from apps.twitter.com.
// Instead of providing this confidential data in the code
// we read it from a toml file.
twitter:Client twitterClient = new ({
   clientId: config:getAsString("clientId"),
   clientSecret: config:getAsString("clientSecret"),
   accessToken: config:getAsString("accessToken"),
   accessTokenSecret: config:getAsString("accessTokenSecret"),
   clientConfig: {}
});
public function main() {
   twitter:Status|error status = twitterClient->tweet("Hello World!");
   if (status is error) {
       log:printError("Tweet Failed", status);
   } else {
       log:printInfo("Tweeted: " + <@untainted>status.id.toString());
   }
}
 </code></pre>
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
                              <h2 id="async-network-protocol">Sequence Diagrams</h2>
                              <p>The syntax and semantics of Ballerina’s abstractions for concurrency and network interaction were designed to closely correspond to sequence diagrams. This provides a visual model that shows how the program interacts using network messages.</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>The sequence diagram below is generated from a sample Salesforce integration microservice.</p>
                              <img src="/img/why-pages/the-network-in-the-language-1.png" alt="Salesforce integration microservice Ballerina sequence diagram">
                              <p>To start generating a sequence diagram from your Ballerina code, download the <a href="https://ballerina.io/learn/vscode-plugin/graphical-editor">VSCode plugin and launch the graphical editor</a>.</p>
                              <div class="cQUOTE">
                                 <p>"[With Ballerina] you can get sequence diagrams automatically. When things start to get complicated and you need to understand and socialize with the rest of your team what it is that you're building, these diagrams become very helpful," stated.</p>
                                 <p class="cName">Christian Posta, field CTO, solo.io.</p>
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
                              <h2 id="services">Resiliency</h2>
                              <p><i>The network is unreliable</i>. That’s why network programs need to be written in a way that handles failures. In some cases, an automatic retry will help recover from failures while in others failover techniques will help deliver uninterrupted service. Techniques like circuit breakers also help to prevent catastrophic cascading failure across multiple programs.</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>Ballerina helps developers write resilient, robust programs with out-of-the-box support for techniques such as:</p>
                              <ul class="cInlinelinklist">
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/http-circuit-breaker.html">Circuit Breaker</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/http-load-balancer.html">Load Balancing</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/http-failover.html">Failover</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/http-retry.html">Retry</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/http-timeout.html">Timeout</a></li>
                              </ul>
                              <h3 id="get-started">Get Started</h3>
                              <p>The code snippet below shows how you can easily configure a circuit breaker to handle network-related errors in the Ballerina HTTP client object.</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">http:Client backendClientEP = new("http://localhost:8080", {
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
 </code></pre>
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
                              <h2 id="async-network-protocol">Error Handling</h2>
                              <p>Due to the inherent unreliability of networks, errors are an expected part of network programming. That’s why in Ballerina errors are explicitly checked rather than thrown as exceptions. It’s impossible to ignore errors by design because of Ballerina’s comprehensive error handling capabilities:</p>
                              <ul class="cInlinelinklist">
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/error-handling.html">Error Handling</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/check.html">Check</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/panic.html">Panic</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/checkpanic.html">Check Panic</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/trap.html">Trap</a></li>
                                 <li><a class="cGreenLinkArrow" href="https://ballerina.io/learn/by-example/user-defined-error.html">User-defined Error Types</a></li>
                              </ul>
                              <h3 id="get-started">Get Started</h3>
                              <p>Below is a simple example of how you can explicitly check for errors:</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">twitter:Status|error status = twitterClient->tweet("Hello World!");
   if (status is error) {
       log:printError("Tweet Failed", status);
   } else {
       log:printInfo("Tweeted: " + <@untainted>status.id.toString());
   }

</code></pre>
                              <p>The <code class="highlighter-rouge cBasicCode">tweet</code> remote method can return the expected <code class="highlighter-rouge cBasicCode">twitter:Status</code> value or an error due to network unreliability. Ballerina supports union types so the <code class="highlighter-rouge cBasicCode">status</code> variable can be either <code class="highlighter-rouge cBasicCode">twitter:Status</code> or <code class="highlighter-rouge cBasicCode">error</code> type. Also the Ballerina IDE tools support type guard where it guides developers to handle errors and values correctly in the if-else block.</p>
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
                              <h2 id="services">Network Data Safety</h2>
                              <p>Distributed systems work by sharing data between different components. Network security plays a crucial role because all these communications happen over the network. Ballerina provides built-in libraries to <a href="https://ballerina.io/learn/by-example/crypto.html">implement transport-level security and cryptography to protect data</a>.</p>
                              <p>Identity and access management also plays a critical role in microservice-based applications. Ballerina supports out-of-the-box protection for services as well as clients by using basic-auth, OAuth and JWT. The following BBEs show how to secure services and clients by enforcing authorization.</p>
                              <table class="docutils">
                                 <tbody>
                                    <tr>
                                       <td style="width:200px"><strong>Service</strong></td>
                                       <td style="width:200px"><strong>Client</strong></td>
                                    </tr>
                                    <tr>
                                       <td><a href="https://ballerina.io/learn/by-example/secured-service-with-basic-auth.html">Basic Auth</a></td>
                                       <td><a href="https://ballerina.io/learn/by-example/secured-client-with-basic-auth.html">Basic Auth</a></td>
                                    </tr>
                                    <tr>
                                       <td><a href="https://ballerina.io/learn/by-example/secured-service-with-jwt-auth.html">JWT</a></td>
                                       <td><a href="https://ballerina.io/learn/by-example/secured-client-with-jwt-auth.html">JWT</a></td>
                                    </tr>
                                    <tr>
                                       <td><a href="https://ballerina.io/learn/by-example/secured-service-with-oauth2.html">OAuth2</a></td>
                                       <td><a href="https://ballerina.io/learn/by-example/secured-client-with-oauth2.html">OAuth2</a></td>
                                    </tr>
                                 </tbody>
                              </table>
                              <p><em>Ballerina ensures security by default</em>. Its built-in <a href="https://ballerina.io/learn/by-example/taint-checking.html?utm_source=infoq&amp;utm_medium=article&amp;utm_campaign=network_in_the_language_article_infoq_feb20">taint analyzer</a> makes sure that malicious, untrusted data doesn’t propagate through the system. If untrusted data is passed to a security-sensitive parameter, a compiler error is generated. You can then redesign the program to erect a safe wall around the dangerous input.</p>
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
                              <h2 id="async-network-protocol">Observability by Default</h2>
                              <p>Increasing the number of smaller services that communicate with each other means that debugging an issue will be harder. Enabling observability on these distributed services will require effort. Monitoring, logging, and distributed tracing are key methods that reveal the internal state of the system and provide observability.</p>
                              <p>Ballerina becomes fully observable by exposing itself via these three methods to various external systems. This helps with monitoring metrics such as request count and response time statistics, analyzing logs, and performing distributed tracing. For more information, follow this guide:</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>Below is a simple example of how you can explicitly check for errors:</p>
                              <ul class="cInlinelinklist">
                                 <li><a href="https://ballerina.io/learn/how-to-observe-ballerina-code">How to Observe Ballerina Services</a></li>
                              </ul>
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
