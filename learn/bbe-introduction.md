---
layout: ballerina-example-page
title: Introduction
description: Try out the extensive collection of Ballerina by Example (BBE) below to grasp the features and concepts of Ballerina.
keywords: ballerina, example, programming language, bbe
permalink: /learn/by-example/introduction/
active: setting-up-ballerina
intro: Try out the extensive collection of Ballerina by Example (BBE) below to grasp the features and concepts of Ballerina.
redirect_from:
  - /learn/by-example/introduction
  - /learn/by-example/
  - /learn/by-example
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
<h2>Ballerina By Example</h2>
<p>Try out the extensive collection of Ballerina by Examples (BBEs) below to grasp the features and concepts of Ballerina.</p>                                          
<h3>Language Concepts</h3>
<ul>
<li><strong><a href="/learn/by-example/hello-world">Hello World:</a></strong> A simple Ballerina Hello World program.</li>
<li><strong>Basics:</strong> The fundamentals of the language.</li>
<li><strong>Working With Data:</strong> Data wrangling in Ballerina.</li>
<li><strong>Network Interaction:</strong> Using Ballerina to communicate over the network.</li>
<li><strong>Concurrency:</strong> Using Ballerina for parallel and concurrent programming.</li>
<li><strong>Transactions:</strong> Writing transaction-aware programs in Ballerina.</li>
<li><strong>Concurrency Safety:</strong> Writing Ballerina programs that guarantee concurrency safety.</li>
<li><strong>Testing:</strong> Writing tests for your Ballerina code.</li>
</ul>            
<h3>Working Over the Network</h3>
<ul>
<li><strong>REST API:</strong> The behaviour of the HTTP listeners and services.</li>
<li><strong>REST Client:</strong> The behaviour of the HTTP clients.</li>
<li><strong>REST API Security:</strong> The security aspects of the REST API clients and services.</li>
<li><strong>REST API Advanced:</strong> The advanced functionality of the HTTP package.</li>
<li><strong>HTTP2</strong> The version upgrade and specific functionality.</li>
<li><strong>Resiliency:</strong> The resiliency aspect of the HTTP clients.</li>
<li><strong>GraphQL</strong> The behaviour of the GraphQL listeners and services.</li>
<li><strong>GraphQL Security:</strong> The security aspects of the GraphQL listeners and services.</li>
<li><strong>WebSockets</strong> The behaviour of the WebSocket listener and clients.</li>
<li><strong>WebSub</strong> The behavior of the WebSub Subscribers.</li>
<li><strong>Listeners:</strong> The behaviour of the listeners.</li>
<li><strong>gRPC:</strong> The behaviour of the gRPC listeners, services, and clients.</li>
<li><strong>NATS:</strong> The behaviour of the NATS listener and clients.</li>
<li><strong>STAN:</strong> The behaviour of the STAN listener and clients.</li>
<li><strong>Kafka:</strong> The behaviour of the Kafka listener and clients. </li>
<li><strong>RabbitMQ:</strong> The behaviour of the RabbitMQ listener and clients. </li>
<li><strong>TCP:</strong> The behaviour of the TCP listener and clients.</li>
<li><strong>UDP:</strong> The behaviour of the UDP listener and clients.</li>
<li><strong>Email:</strong> The behaviour of the SMTP, POP3, and IMAP listeners and clients.</li>
<li><strong>MySQL:</strong> The behaviour of the MySQL DB connector.</li>
<li><strong>JDBC:</strong> The behaviour of the JDBC DB connector.</li>
</ul>                          
<h3>Common Libraries</h3>
<ul>
<li><strong>IO:</strong> Input/output operations using streaming and non-streaming APIs.</li>
<li><strong>Security:</strong> The cryptography and JWT utilities.</li>
<li><strong>URL:</strong> The utilities for URL encoding/decoding.</li>
<li><strong>Time:</strong> UTC and localized time generation and conversions.</li>
<li><strong>Cache:</strong> The in-memory cache functionalities.</li>
<li><strong>Log:</strong> Log information when running applications.</li>
<li><strong>File:</strong> The file, path, and directory operations and behaviour of the directory listener.</li>
<li><strong>Random:</strong> Generate pseudo-random numbers.</li>
<li><strong>Task:</strong> Schedule jobs either once or periodically, and manage those jobs.</li>
<li><strong>UUID:</strong> Generate and inspect UUIDs (Universally Unique Identifier).</li>
<li><strong>XSLT:</strong> Transform a given XML content to another XML/HTML/plain text.</li>
<li><strong>Regex:</strong> Manipulate the string by using Regex.</li>
<li><strong>OS:</strong> Retrieve information about the environment variables of the Operating System.</li>
<li><strong>XML Data:</strong> The conversion between JSON and XML.</li>
</ul>

<h3>Deployment</h3>
<ul>
<li><strong>Code to Cloud:</strong> Generate the Kubernetes YAML files, the Dockerfile, and Docker image for Ballerina Programs.</li>
<li><strong>Function as a Service:</strong> Create Ballerina functions to run on AWS Lambda or Azure FaaS.</li>
</ul>
<h3>Observability</h3>
<ul>
<li><strong>Tracing:</strong> The usage of traces using the built-in observability features.</li>
<li><strong>Metrics:</strong> The usage of metrics using the built-in observability features.</li>
</ul>