---
layout: ballerina-inner-page
title: From Code to Cloud
permalink: /why/from-code-to-cloud/
---

# From Code to Cloud

In the past, developers simply wrote their program, built it and ran it. Today, developers also need to think of the various deployment options such as Docker, Kubernetes, serverless environments and service meshes. But this deployment process is not part of the programming experience for developers. They have to write code in a certain way to work well in a given execution environment, and removing this from the programming problem isn’t good.

Ballerina specializes in moving from code to cloud while providing a unique developer experience. Its compiler can be extended to read annotations defined in the source code and generate artifacts to deploy your code into different clouds. These artifacts can be Dockerfiles, Docker images, Kubernetes YAML files or serverless functions.

## From Code to Docker

Agility is a key benefit of microservices-based application development and Docker plays a major role. <a href="https://www.docker.com/">Docker</a> helps to package applications and their dependencies in a binary image that can run in various locations, whether on-premises, in a public cloud, or in a private cloud. To create optimized Docker images, developers need to follow <a href="https://docs.docker.com/develop/develop-images/dockerfile_best-practices/">best practices</a> when creating a Dockerfile. This includes choosing a suitable image base, bundling all dependencies, copying the application binary and setting the execution command with proper permissions.

Ballerina supports generating Docker images and Dockerfiles based on annotations. The Ballerina compiler can do this out of the application code. 

### Get Started

The code snippet below shows how to bundle, package, and run a Ballerina hello service as a Docker container, all while following best practices.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/docker;
 
@docker:Expose {}
listener http:Listener helloWorldEP = new(9090);
@docker:Config {
   name: "helloworld"
}
service hello on helloWorldEP {
 
resource function sayHello(http:Caller caller,
http:Request request) {
      var result = caller->respond("Hello World!");
      if (result is error) {
          log:printError("Error in responding ", err = result);
      }
  }
}
```

Adding the `@docker:Config {}` annotation to a service generates the Dockerfile and a Docker image and adding the `@docker:Expose {}` annotation to the `listener` object exposes the endpoint port by allowing incoming traffic to the container. 

<a href="https://ballerina.io/v1-2/learn/by-example/docker-deployment.html">Docker Deployment Ballerina By Example (BBE) &gt;</a>

## From Code to Kubernetes

<a href="https://kubernetes.io/">Kubernetes</a> is the preferred platform for running applications with multiple microservices in production. It can be used for automating deployment and scaling, and management of containerized applications. Kubernetes defines a set of unique building blocks that need to be defined as YAML files and deployed into the Kubernetes cluster.

However, in many cases, creating these YAML files is out of a developer’s comfort zone. The Ballerina compiler can create these YAML files while compiling the source code, so you don’t have to! The code below shows the annotations you need to use to do this:

### Get Started

The following code snippet shows how Ballerina annotations can generate YAML files to deploy your code to Kubernetes.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/kubernetes;
 
@kubernetes:Service {
   serviceType: "NodePort"
}
listener http:Listener helloWorldEP = new(9090);
 
@kubernetes:Deployment {
   name: "helloworld"
}
service hello on helloWorldEP {
 
resource function sayHello(http:Caller caller,
http:Request request) {
      var result = caller->respond("Hello World!");
      if (result is error) {
          log:printError("Error in responding ", err = result);
      }
  }
}
```

Adding the `@kubernetes:Deployment{}` annotation to the Ballerina service will generate the Kubernetes Deployment YAML that is required to deploy our hello application into Kubernetes. Adding the `@kubernetes:Service{}` annotation will generate the Kubernetes Service YAML. In this scenario, we have set `serviceType` as `NodePort` to access the hello service via the nodeIP:Port. 

<a href="https://ballerina.io/v1-2/learn/by-example/kubernetes-deployment.html">Kubernetes Deployment BBE &gt;</a>

If you are an OpenShift user follow the example below to deploy your application.

<a href="https://ballerina.io/v1-2/learn/by-example/openshift-deployment.html">OpenShift Deployment BBE &gt;</a>

## From Code to Istio

Although microservice architecture increases agility, it comes with its own complexities. The Service Mesh is a modern software architecture that helps reduce the complexities that Docker and Kubernetes don’t. <a href="https://istio.io">Istio</a> is a leading open source service mesh which focuses on service discovery, load balancing, failure recovery, metrics, monitoring, A/B testing, canary rollouts, rate limiting, access control, and end-to-end authentication.

By adding two annotations, Ballerina can generate YAML files to deploy in Istio.

### Get Started

The code snippet below shows how Ballerina helps deploy your code in Istio.

```ballerina
@istio:Gateway {}
@istio:VirtualService {}
@kubernetes:Service {
   serviceType: "NodePort"
}

listener http:Listener helloWorldEP = new(9090);
```

<a href="https://github.com/ballerinax/kubernetes/blob/master/samples/sample16">Istio Gateway and Virtual Service Generation &gt;</a>

## From Code to Knative

Serverless platforms like <a href="https://knative.dev/">Knative</a> enable developers to focus on writing code without having to worry about the “boring but difficult” parts of building, deploying and managing their applications. A key functionality of Knative is the ability to scale automatically from zero replicas and size workloads based on demand.

While compiling the source code, Ballerina can generate the artifacts necessary for deploying to Knative by simply annotating the code.

### Get Started

The code snippet below shows the annotations needed in Ballerina to deploy your code to Knative.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/knative;
 
@knative:Service {
   name: "helloworld"
}
listener http:Listener helloWorldEP = new(9090);
 
service hello on helloWorldEP {
 
resource function sayHello(http:Caller caller,
http:Request request) {
      var result = caller->respond("Hello World!");
      if (result is error) {
          log:printError("Error in responding ", err = result);
      }
  }
}
```

<a href="https://ballerina.io/v1-2/learn/by-example/knative-deployment.html">Knative Deployment BBE &gt;</a>

## From Code to AWS Lambda

<a href="https://aws.amazon.com/lambda/">AWS Lambda</a> is an event-driven, serverless computing platform. Ballerina functions can be deployed in AWS Lambda by annotating a Ballerina function with `@awslambda:Function`, which should have the function signature `function (awslambda:Context, json) returns json|error`.
 
<a href="https://ballerina.io/v1-2/learn/by-example/awslambda-deployment.html">AWS Lambda Deployment BBE &gt;</a>

## CI/CD with GitHub Actions

In a microservice architecture, continuous integration and continuous delivery (CI/CD) is critical in creating an agile environment for incorporating incremental changes to your system. There are different technologies that provide this CI / CD functionality and very recently GitHub has introduced <a href="https://github.com/features/actions">GitHub Actions</a>, which is now available for general usage. GitHub Actions provides a convenient mechanism for implementing CI/CD pipelines using their workflows concept, right from our GitHub repositories.

With <a href="https://github.com/marketplace/actions/ballerina-action">Ballerina GitHub Actions</a> we can create a Ballerina development environment with built-in CI/CD. The following article has a comprehensive guideline:
* <a href="https://dzone.com/articles/effective-microservices-cicd-with-github-actions-a">Effective Microservices CI/CD With GitHub Actions and Ballerina</a>

## Support for SaaS Connectors

We have discussed how Ballerina supports different technologies to automate cloud deployments. To obtain the full strength of the cloud, applications should be able to integrate with Software-as-a-Service (SaaS) provided by different cloud vendors. 

Ballerina provides a simple workflow to connect and integrate with these SaaS services. For example, the following code snippet shows how to initialize and send out a tweet with the Twitter SaaS service:

```ballerina
import ballerina/config;
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
```

Ballerina has many out-of-the-box SaaS connectors, which you can find in <a href="https://central.ballerina.io/">Ballerina Central</a>.

### User Quote
“We were attracted by Ballerina’s cloud native features, such as the automatic generation of Docker, Kubernetes, and Helm artifacts, as well as its small footprint and faster boot times. It is also capable of running as a Lambda function (serverless) in AWS. Together, these capabilities have enabled us to easily run microservices in containers at scale and integrate with CI/CD tools with less effort,” stated Sri Harsha Pulleti, integration architect and senior manager, Motorola.

<style>
.nav > li.cVersionItem {
    display: none !important;
}
</style>
