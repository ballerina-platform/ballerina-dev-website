---
layout: ballerina-layer-page
title: From Code to Cloud
description: See how the Ballerina programming language has built-in cloud support, which helps developers deploy to cloud platforms like Docker and Kubernetes.
keywords: ballerina, programming language, cloud, kubernetes, docker
permalink: /why-ballerina/from-code-to-cloud-old/
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
                               <h1>From Code to Cloud</h1>
                              <p>In the past, developers simply wrote their program, built it and ran it. Today, developers also need to think of the various deployment options such as Docker, Kubernetes, serverless environments and service meshes. But this deployment process is not part of the programming experience for developers. They have to write code in a certain way to work well in a given execution environment, and removing this from the programming problem isn’t good.</p>
                              <p>
                                 Ballerina specializes in moving from code to cloud while providing a unique developer experience. Its compiler can be extended to read annotations defined in the source code and generate artifacts to deploy your code into different clouds. These artifacts can be Dockerfiles, Docker images, Kubernetes YAML files or serverless functions.
                              </p>                              
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
                              <h2 id="client-objects-and-remote-methods">From Code to Kubernetes</h2>
                              <p><a href="https://kubernetes.io/">Kubernetes</a> is the preferred platform for running applications with multiple microservices in production. It can be used for automating deployment and scaling, and management of containerized applications. Kubernetes defines a set of unique building blocks that need to be defined as YAML files and deployed into the Kubernetes cluster.</p>
                              <p>However, in many cases, creating these YAML files is out of a developer’s comfort zone. The Ballerina compiler can create these YAML files while compiling the source code, so you don’t have to! The code below shows the build option you need to use to do this:</p>
                              <h3 id="get-started">Get Started</h3>
                              <p>The following code snippet shows how Ballerina compiler can generate YAML files to deploy your code to Kubernetes.</p>
                              <pre class="ballerina-pre-wrapper"><code class="language-ballerina cBasicCode hljs">
import ballerina/http;
service /hello on new http:Listener(9090) {
    resource function get sayHello() returns string? {
        return "Hello, World!";
    }
}
</code></pre>
                              <p>Building the source with <code class="highlighter-rouge cBasicCode">bal build --cloud=k8s</code> will generate the Kubernetes YAML files and Docker image that is required to deploy hello application into Kubernetes.</p>
                              <p>Building the source with <code class="highlighter-rouge cBasicCode">bal build --cloud=docker</code> will generate the Docker image and Dockerfile.</p>
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
<div class="row cBallerina-io-Gray-row  cContentRows">
   <div class="container">
      <div class="row">
         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cBallerina-io-Home-Middle-col">
            <div class="col-xs-12 col-sm-12" style="padding: 0;">
               <div class="cBlallerina-io-docs-content-container">
                  <div class="wy-nav-content">
                     <div class="rst-content">
                        <div role="main">
                           <div class="section">
                              <h2 id="async-network-protocol">From Code to AWS Lambda</h2>
                              <p><a href="https://aws.amazon.com/lambda/">AWS Lambda</a> is an event-driven, serverless computing platform. Ballerina functions can be deployed in AWS Lambda by annotating a Ballerina function with <code class="highlighter-rouge cBasicCode">@awslambda:Function</code>, which should have the function signature <code class="highlighter-rouge cBasicCode">function (awslambda:Context, json) returns json|error</code>.</p>
<ul class="cInlinelinklist">
                                 <li><a class="cGreenLinkArrow" href="/learn/by-example/aws-lambda-deployment.html">AWS Lambda Deployment BBE </a></li>
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
<div class="row cBallerina-io-Gray-row  cContentRows">
   <div class="container">
      <div class="row">
         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cBallerina-io-Home-Middle-col">
            <div class="col-xs-12 col-sm-12" style="padding: 0;">
               <div class="cBlallerina-io-docs-content-container">
                  <div class="wy-nav-content">
                     <div class="rst-content">
                        <div role="main">
                           <div class="section">
                              <h2 id="async-network-protocol">From Code to Azure Functions</h2>
                              <p><a href="https://aws.amazon.com/lambda/">Azure Functions</a> is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs. Ballerina functions can be deployed in Azure by annotating a Ballerina function with <code class="highlighter-rouge cBasicCode">@azure_functions:Function</code>.</p>
<ul class="cInlinelinklist">
                                 <li><a class="cGreenLinkArrow" href="/learn/by-example/azure-functions-deployment.html">Azure Functions Deployment BBE </a></li>
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
                              <h2 id="cicd-with-github-actions">CI/CD with GitHub Actions</h2>
                              <p>In a microservice architecture, continuous integration and continuous delivery (CI/CD) is critical in creating an agile environment for incorporating incremental changes to your system. There are different technologies that provide this CI / CD functionality and very recently GitHub has introduced <a href="https://github.com/features/actions">GitHub Actions</a>, which is now available for general usage. GitHub Actions provides a convenient mechanism for implementing CI/CD pipelines using their workflows concept, right from our GitHub repositories.</p>
                              <p>With <a href="https://github.com/marketplace/actions/ballerina-action">Ballerina GitHub Actions</a> we can create a Ballerina development environment with built-in CI/CD. The following article has a comprehensive guideline:</p>
                              <ul class="cInlinelinklist">
                                 <li><a class="cGreenLinkArrow" href="https://dzone.com/articles/effective-microservices-cicd-with-github-actions-a">Effective Microservices CI/CD With GitHub Actions and Ballerina</a></li>
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
<div class="row cBallerina-io-Gray-row  cContentRows">
<div class="container">
   <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 cBallerina-io-Home-Middle-col">
         <div class="col-xs-12 col-sm-12" style="padding: 0;">
            <div class="cBlallerina-io-docs-content-container">
               <div class="wy-nav-content">
                  <div class="rst-content">
                     <div role="main">
                        <div class="section">
                           <h2 id="support-for-saas-connectors">Support for SaaS Connectors</h2>
                           <p>We have discussed how Ballerina supports different technologies to automate cloud deployments. To obtain the full strength of the cloud, applications should be able to integrate with Software-as-a-Service (SaaS) provided by different cloud vendors.</p>
                           <p>Ballerina provides a simple workflow to connect and integrate with these SaaS services. For example, the following code snippet shows how to initialize and send out a tweet with the Twitter SaaS service:</p>
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
                           <p>Ballerina has many out-of-the-box SaaS connectors, which you can find in <a href="https://central.ballerina.io/">Ballerina Central</a>.</p>
                           <div class="cQUOTE">
                              <p>"We were attracted by Ballerina’s cloud native features, such as the automatic generation of Docker, Kubernetes, and Helm artifacts, as well as its small footprint and faster boot times. It is also capable of running as a Lambda function (serverless) in AWS. Together, these capabilities have enabled us to easily run microservices in containers at scale and integrate with CI/CD tools with less effort."</p>
                              <p class="cName">Harsha Pulleti, integration architect and senior manager, Motorola</p>
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
