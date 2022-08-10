---
layout: ballerina-deploying-ballerina-on-kubernetes-left-nav-pages-swanlake
title: Deploy Ballerina on Kubernetes
description: Let’s dockerize your Ballerina service and deploy it into Kubernetes.
keywords: ballerina, programming language, cloud, kubernetes, docker, cloud-native
permalink: /learn/deploy-ballerina-on-kubernetes/
active: deploy-ballerina-on-kubernetes
intro: This guide walks you through the steps of writing a simple Ballerina service, dockerizing the application, and deploy it in Kubernetes.
redirect_from:
    - /learn/deploying-ballerina-on-kubernetes
    - /learn/deploying-ballerina-on-kubernetes/
    - /learn/deploy-ballerina-on-kubernetes
    - /learn/getting-started/deploying-ballerina-on-kubernetes/
    - /learn/getting-started/deploying-ballerina-on-kubernetes
---

Code to Cloud is a compiler extension, which is packed with Ballerina. It eases generating the artifacts required for the cloud from your Ballerina code. Currently, you could generate Docker and Kubernetes artifacts from the Ballerina code. This process encourages you to write cloud-ready code from day one without any additional effort. 

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2202.0.0 (Swan Lake)](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/) or greater
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina).
3. A command terminal
4. [Docker](https://www.docker.com/) installed and configured in your machine
5. A [Docker Hub](https://hub.docker.com/) account
6. [Kubectl](https://kubernetes.io/docs/tasks/tools/) installed and configured in a [Kubernetes cluster](https://minikube.sigs.k8s.io/docs/start/)

## Create the Ballerina package

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic in it. In the terminal, execute the command below to create the Ballerina package for the API implementation.

> **Info:** For more information on Ballerina packages, see [Organizing Ballerina code](/learn/organizing-ballerina-code/).

```bash
$ bal new greeter
```

You view the output below.


```bash
Created new package 'greeter' at greeter.
```

This creates a directory named `covid19` with the default module along with a sample code for the service as shown below. 

```bash
.
greeter/
├── Ballerina.toml
└── main.bal
```

## Create the Ballerina service

To write a Ballerina program that returns a `Hello, World!` string upon invoking the resource, replace the `main.bal` content with the code below.

```ballerina
import ballerina/http;

listener http:Listener httpListener = new (8080);
service / on httpListener {
    resource function get greeting() returns string { 
        return "Hello, World!"; 
    }
}
```

## Update the `Ballerina.toml` file

To enable the code to cloud functionality in the Ballerina package, add the `cloud="k8s"` property below to the `build-options` in the `Ballerina.toml` file.

```toml
[build-options]
cloud = "k8s"
```

## Create the `Cloud.toml` file

Create a file named `Cloud.toml` in the package directory and add the content below. 

>**Info:** Make sure to replace the value of the repository field with your Docker hub repository name.

```toml
[container.image]
repository="wso2inc" # Docker hub repository name.
name="greeter" # container name
tag="latest"
```

## Build the package

Execute the code below to build the Ballerina package.

```ballerina
$ bal build
```

You view the output below.

```bash
Compiling source
        example/greeter:0.1.0

Generating executable

Generating artifacts...

        @kubernetes:Service                      - complete 1/1
        @kubernetes:Deployment                   - complete 1/1
        @kubernetes:HPA                          - complete 1/1
        @kubernetes:Docker                       - complete 2/2 

        Execute the below command to deploy the Kubernetes artifacts: 
        kubectl apply -f /home/example/greeter/target/kubernetes/greeter

        Execute the below command to access service via NodePort: 
        kubectl expose deployment greeter-deployment --type=NodePort --name=greeter-svc-local
```

>**Info:** This generates the cloud artifacts inside the `target/` directory.

## Deploy the package on Docker

Execute the command below to push the created Docker image into Docker Hub.

**Info:** Replace `wso2inc` with your repository name.

```bash
$ docker push wso2inc/greeter:latest
```

You view the output below.

```bash
The push refers to repository [docker.io/wso2inc/greeter]
latest: digest: sha256:c1acf5165848d70c347a970d6b5c32f63669cdbb0d4c1daca2c91cfbe32f61b2 size: 13718
```

## Deploy the package on Kubernetes

Execute the command below to deploy the Ballerina application into the Kubernetes cluster.

```bash
$ kubectl apply -f /home/example/greeter/target/kubernetes/greeter
```
You view the output below.

```ballerina
service/greeter-svc created
deployment.apps/greeter-deployment created
horizontalpodautoscaler.autoscaling/greeter-hpa created
```

## Learn more

For in-depth information about executing these deployed applications and the supported customizations in code to cloud, see [Code to Cloud deployment](/learn/run-ballerina-programs-in-the-cloud/code-to-cloud-deployment/).
 