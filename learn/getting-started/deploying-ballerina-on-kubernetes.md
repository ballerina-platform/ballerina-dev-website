---
layout: ballerina-deploying-ballerina-on-kubernetes-left-nav-pages-swanlake
title: Deploying Ballerina on Kubernetes
description: Let’s dockerize deploy your ballerina service and deploy it into kubernetes.
keywords: ballerina, programming language, cloud, kubernetes, docker, cloud-native
permalink: /learn/deploying-ballerina-on-kubernetes/
active: deploying-ballerina-on-kubernetes
intro: Let’s dockerize deploy your ballerina service and deploy it into Kubernetes.
redirect_from:
- /learn/deploying-ballerina-on-kubernetes
---

In this section, you will be writing a simple Ballerina service and then, you will dockerize the application and deploy it in Kubernetes.

## Setting up the Prerequisites

To complete this tutorial, you need:

1. A command terminal
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina).
3. A [Ballerina installation](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/)
4. [Docker](https://www.docker.com/) installed and configured in your machine
5. A [Docker Hub](https://hub.docker.com/) account
6. [Kubectl](https://kubernetes.io/docs/tasks/tools/) installed and configured in a [Kubernetes cluster](https://minikube.sigs.k8s.io/docs/start/)

## Code to Cloud

Code to Cloud is a compiler extension, which is packed with Ballerina, which makes it easier to generate artifacts required for the cloud from your Ballerina code. Currently, you could generate Docker and Kubernetes artifacts from the Ballerina code. This process encourages you to write cloud-ready code from day one without any additional effort. 

## Writing the Ballerina Service

Let’s write a Ballerina program that returns a `Hello, World!` string upon invoking the resource. Execute the `bal new` command to create a new Ballerina project. 

```bash
$ bal new greeter
```

This command creates a new directory called `greeter`. Let’s move into this directory to see what’s in there. 

```
greeter/
├── Ballerina.toml
└── main.bal
```

You can replace the `main.bal` content with the following code.

```ballerina
import ballerina/http;

listener http:Listener httpListener = new (8080);
service / on httpListener {
    resource function get greeting() returns string { 
        return "Hello, World!"; 
    }
}
```

To enable the code to cloud functionality in the Ballerina project, you need to add the `cloud="k8s"` property to the `build-options` in the `Ballerina.toml` file.

***Ballerina.toml***

```toml
[build-options]
cloud = "k8s"
```

5. Create a file named `Cloud.toml` in the package directory and add the content below. Make sure to replace the value of the repository field with your Docker hub repository name.

***Cloud.toml***

```toml
[container.image]
repository="wso2inc" # Docker hub repository name.
name="greeter" # container name
tag="latest"
```

Now, when we build the Ballerina project, the cloud artifacts should be generated inside the `target/` directory.

```bash
$ bal build
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

Let's push the created docker image into docker hub now. You should replace the wso2inc name with your repository name.

```bash
$ docker push wso2inc/greeter:latest
The push refers to repository [docker.io/wso2inc/greeter]
latest: digest: sha256:c1acf5165848d70c347a970d6b5c32f63669cdbb0d4c1daca2c91cfbe32f61b2 size: 13718
```

Execute the commands displayed from the compiler above to deploy the Ballerina application into the Kubernetes cluster.

```bash
$ kubectl apply -f /home/example/greeter/target/kubernetes/greeter
service/greeter-svc created
deployment.apps/greeter-deployment created
horizontalpodautoscaler.autoscaling/greeter-hpa created
```

**Info:** For in-depth information about executing these deployed applications and the supported customizations in code to cloud, see [Code to cloud Deployment](/learn/running-ballerina-programs-in-the-cloud/code-to-cloud-deployment/).