---
layout: ballerina-getting-started-left-nav-pages-swanlake
title: Introduction
description: Try out the extensive collection of Ballerina by Example (BBE) below to grasp the features and concepts of Ballerina.
keywords: ballerina, example, programming language, bbe
permalink: /learn/by-example/introduction/
active: introduction
intro: Try out the extensive collection of Ballerina by Example (BBE) below to grasp the features and concepts of Ballerina.
redirect_from:
  - /learn/by-example/introduction
---
<div class="row cBallerina-io-Gray-row">
        <div class="container cBallerinaBySampleContainer">
            <div class="FullCode">
                <div class="highlight"><pre><span class="kn">import</span> <span class="nx">ballerina</span><span class="o">/</span><span class="nx">io</span><span class="p">;</span>

<span class="nx">public</span> <span class="kd">function</span> <span class="nx">main</span><span class="p">()</span> <span class="p">{</span>
    <span class="nx">io</span><span class="p">:</span><span class="nb">println</span><span class="p">(</span><span class="s">&quot;Hello, World!&quot;</span><span class="p">);</span>
<span class="p">}</span>
</pre></div>

</div>

<div class="col-xs-12 col-sm-12 col-md-12">
<table class="cTopInfoContainer cTopControlsContainer">
<tr>
<td class="cLeftTD">
<h2>Learn By Examples</h2>
<p>Try out the extensive collection of examples below to grasp the features and concepts of Ballerina.</p> <br/>
<blockquote><p>For a complete reference of examples, see <a href="/learn/by-example/">Reference By Examples.</a></p></blockquote>                                       
<h3>Language Concepts</h3>
<ul>
<li><strong><a href="/learn/by-example/hello-world">Hello World:</a></strong> A simple Ballerina Hello World program.</li>
<li><strong><a href="/learn/by-example/programs-and-modules">Basics:</a></strong> The fundamentals of the language.</li>
<li><strong><a href="/learn/by-example/consuming-services">Network Interaction:</a></strong> Using Ballerina to communicate over the network.</li>
<li><strong><a href="/learn/by-example/decimal-type">Working With Data:</a></strong> Data wrangling in Ballerina.</li>
<li><strong><a href="/learn/by-example/named-workers">Concurrency:</a></strong> Using Ballerina for parallel and concurrent programming.</li>
<li><strong><a href="/learn/by-example/transaction-statement">Transactions:</a></strong> Writing transaction-aware programs in Ballerina.</li>
<li><strong><a href="/learn/by-example/lock-statement">Concurrency Safety:</a></strong> Writing Ballerina programs that guarantee concurrency safety.</li>
<li><strong><a href="/learn/by-example/testerina-assertions">Testing:</a></strong> Writing tests for your Ballerina code.</li>
</ul>   

<style>
  .cBallerina-io-Nav .nav > li.cVersionItem {
      display: block !important;
   }
</style>
<!-- <h3>Working Over the Network</h3>
<ul>
<li><strong><a href="/learn/by-example/http-absolute-path-and-path">REST API:</a></strong> The behaviour of the HTTP listeners and services.</li>
<li><strong><a href="/learn/by-example/http-client-endpoint">REST Client:</a></strong> The behaviour of the HTTP clients.</li>
<li><strong><a href="/learn/by-example/http-service-ssl-tls">REST API Security:</a></strong> The security aspects of the REST API clients and services.</li>
<li><strong><a href="/learn/by-example/http-redirects">REST API Advanced:</a></strong> The advanced functionality of the HTTP package.</li>
<li><strong><a href="/learn/by-example/http-1-1-to-2-0-protocol-switch">HTTP2</a></strong> The version upgrade and specific functionality.</li>
<li><strong><a href="/learn/by-example/http-circuit-breaker">Resiliency:</a></strong> The resiliency aspect of the HTTP clients.</li>
<li><strong><a href="/learn/by-example/graphql-hello-world">GraphQL:</a></strong> The behaviour of the GraphQL listeners and services.</li>
<li><strong><a href="/learn/by-example/graphql-service-ssl-tls">GraphQL Security:</a></strong> The security aspects of the GraphQL listeners and services.</li>
<li><strong><a href="/learn/by-example/websocket-text-client">WebSockets:</a></strong> The behaviour of the WebSocket listener and clients.</li>
<li><strong><a href="/learn/by-example/websub-webhook-sample">WebSub:</a></strong> The behavior of the WebSub Subscribers.</li>
<li><strong><a href="/learn/by-example/dynamic-listener">Listeners:</a></strong> The behaviour of the listeners.</li>
<li><strong><a href="/learn/by-example/grpc-simple">gRPC:</a></strong> The behaviour of the gRPC listeners, services, and clients.</li>
<li><strong><a href="/learn/by-example/nats-basic-pub-sub">NATS:</a></strong> The behaviour of the NATS listener and clients.</li>
<li><strong><a href="/learn/by-example/nats-streaming-pub-sub">STAN:</a></strong> The behaviour of the STAN listener and clients.</li>
<li><strong><a href="/learn/by-example/kafka-producer">Kafka:</a></strong> The behaviour of the Kafka listener and clients. </li>
<li><strong><a href="/learn/by-example/rabbitmq-producer">RabbitMQ:</a></strong> The behaviour of the RabbitMQ listener and clients. </li>
<li><strong><a href="/learn/by-example/tcp-client">TCP:</a></strong> The behaviour of the TCP listener and clients.</li>
<li><strong><a href="/learn/by-example/udp-client">UDP:</a></strong> The behaviour of the UDP listener and clients.</li>
<li><strong><a href="/learn/by-example/send-email">Email:</a></strong> The behaviour of the SMTP, POP3, and IMAP listeners and clients.</li>
<li><strong><a href="/learn/by-example/mysql-query-operation">MySQL:</a></strong> The behaviour of the MySQL DB connector.</li>
<li><strong><a href="/learn/by-example/jdbc-query-operation">JDBC:</a></strong> The behaviour of the JDBC DB connector.</li>
</ul>                          
<h3>Common Libraries</h3>
<ul>
<li><strong><a href="/learn/by-example/io-bytes">IO:</a></strong> Input/output operations using streaming and non-streaming APIs.</li>
<li><strong><a href="/learn/by-example/security-crypto">Security:</a></strong> The cryptography and JWT utilities.</li>
<li><strong><a href="/learn/by-example/url-encode-decode">URL:</a></strong> The utilities for URL encoding/decoding.</li>
<li><strong><a href="/learn/by-example/time-utc">Time:</a></strong> UTC and localized time generation and conversions.</li>
<li><strong><a href="/learn/by-example/cache-basics">Cache:</a></strong> The in-memory cache functionalities.</li>
<li><strong><a href="/learn/by-example/logging">Log:</a></strong> Log information when running applications.</li>
<li><strong><a href="/learn/by-example/filepaths">File:</a></strong> The file, path, and directory operations and behaviour of the directory listener.</li>
<li><strong><a href="/learn/by-example/random-numbers">Random:</a></strong> Generate pseudo-random numbers.</li>
<li><strong><a href="/learn/by-example/task-frequency-job-execution">Task:</a></strong> Schedule jobs either once or periodically, and manage those jobs.</li>
<li><strong><a href="/learn/by-example/uuid-generation">UUID:</a></strong> Generate and inspect UUIDs (Universally Unique Identifier).</li>
<li><strong><a href="/learn/by-example/xslt-transformation">XSLT:</a></strong> Transform a given XML content to another XML/HTML/plain text.</li>
<li><strong><a href="/learn/by-example/regular-expressions">Regex:</a></strong> Manipulate the string by using Regex.</li>
<li><strong><a href="/learn/by-example/environment-variables">OS:</a></strong> Retrieve information about the environment variables of the Operating System.</li>
<li><strong><a href="/learn/by-example/xml-json-conversion">XML Data:</a></strong> The conversion between JSON and XML.</li>
</ul> -->

<!-- <h3>Deployment</h3>
<ul>
<li><strong><a href="/learn/by-example/c2c-deployment">Code to Cloud:</a></strong> Generate the Kubernetes YAML files, the Dockerfile, and Docker image for Ballerina Programs.</li>
<li><strong><a href="/learn/by-example/azure-functions-deployment">Function as a Service:</a></strong> Create Ballerina functions to run on AWS Lambda or Azure FaaS.</li>
</ul>
<h3>Observability</h3>
<ul>
<li><strong><a href="/learn/by-example/tracing">Tracing:</a></strong> The usage of traces using the built-in observability features.</li>
<li><strong><a href="/learn/by-example/counter-metrics">Metrics:</a></strong> The usage of metrics using the built-in observability features.</li> 
</ul>-->