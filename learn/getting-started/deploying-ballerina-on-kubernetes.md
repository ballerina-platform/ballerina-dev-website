```
layout: deploying-ballerina-on-kubernetes-left-nav-pages
title: Deploying your service on Kubernetes
description: Let’s dockerize deploy your ballerina service and deploy into kubernetes.
keywords: ballerina, programming language, cloud, kubernetes, docker, cloud-native
permalink: /learn/deploying-ballerina-on-kubernetes
active: deploying-ballerina-on-kubernetes
intro: Let’s dockerize deploy your ballerina service and deploy into kubernetes.
---
```

In this section we will be write a simple ballerina service and the we will dockerize the application and deploy it in kuberentes.

## Prerequisites

To complete this tutorial, you need:

- A Ballerina installation. Follow the steps in [Installing Ballerina](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/).
- Docker installed and configured in your machine.
- `kubectl` installed and configured to a Kubernetes cluster.


## Code to Cloud

Code to cloud is a compiler extension which is packed with ballerina which makes it easier to generate artifacts required for the cloud from the user's ballerina code. Currently, You could generate docker and kubernetes artifacts from the ballerina code. This process encourages users to write cloud ready code from the day one without any additional effort. 

## Write the ballerina service

Let’s write a Ballerina program that returns “Hello, World!” string from upon invoking the resource. Use the `bal new` command to create a new Ballerina project. 

```
$ bal new greeter
```

This command creates a new directory called `greeter`. Let’s move into this directory to see what’s in there. 

```
greeter/
├── Ballerina.toml
└── main.bal
```

You can replace the `main.bal` content with the following code.

```
import ballerina/http;
listener http:Listener httpListener = new (8080);
service / on httpListener {
    resource function get greeting() returns string { 
        return "Hello, World!"; 
    }
}
```


In order to enable the code to cloud functionality in the ballerina project, you need to add `cloud="k8s"` to the build-options in Ballerina.toml


***Ballerina.toml***

```toml
[build-options]
cloud = "k8s"
```

Now when we build the ballerina project cloud artifacts should be generated inside the target/ directory.

```
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

Execute the commands displayed from the compiler above to deploy the ballerina application into the kubernetes cluster.

```
$ kubectl apply -f /home/example/greeter/target/kubernetes/greeter
service/greeter-svc created
deployment.apps/greeter-deployment created
horizontalpodautoscaler.autoscaling/greeter-hpa created
```

## Next steps

You can visit the [Code to cloud Deployment guide](/learn/running-ballerina-programs-in-the-cloud/code-to-cloud-deployment.html) for in depth information about executing these deployed applications and the supported customizations in code to cloud.