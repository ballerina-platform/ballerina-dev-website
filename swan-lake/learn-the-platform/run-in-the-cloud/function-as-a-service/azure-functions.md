---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Azure Functions
description: Learn how to write and deploy Azure Functions using Ballerina.
keywords: ballerina, programming language, serverless, cloud, azure, functions, cloud-native
permalink: /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/
active: azure-functions
intro: The Azure Functions extension provides the functionality to expose a Ballerina function as a serverless function in the Azure Functions platform.
---

Azure Functions is an event-driven, serverless computing platform. Azure Functions can be written from Ballerina using the listeners and services provided by Azure Functions package. This example demonstrates using an HTTP trigger to invoke the function, and an HTTP output binding to respond to the caller with a message based on the query parameter sent from the request.

In Ballerina, `triggers` are represented by `listeners`. When the `af:HttpListener` gets attached to the service, it implies that the function is an HTTP Trigger. The resource method behaves the same as a service written from `ballerina/http`. It supports `http:Payload, http:Header` annotations for parameters. Input binding annotations can be used to annotate parameters to make use of external services in Azure. If no annotations are specified for a parameter, it is identified as a query parameter.

Output bindings are defined in the return type definition. For services with the `HttpListener` attachment, `HttpOutput` is the default output binding. You can override the default behavior by specifying them explicitly in the return type. For example, see [HTTP Ttrigger](/learn/by-example/azure-functions-http-trigger).

## Supported triggers and bindings

An Azure Function consists of a trigger and optional bindings. A trigger defines how a function is invoked. A binding is an approach in which you can declaratively connect other resources to the function. There are *input* and *output* bindings. An input binding is a source of data that flows into the function. An output binding allows outputting data from the function to an external resource. For more information, go to <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings" target="_blank">Azure Functions triggers and bindings concepts</a>.

The following Azure Functions triggers and bindings are currently supported in Ballerina:
- HTTP <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#HttpTrigger" target="_blank">trigger</a> and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#HttpOutput" target="_blank">ouput</a> binding
- Queue <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#QueueTrigger" target="_blank">trigger</a> and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#QueueOutput" target="_blank">ouput</a> binding
- Blob <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobTrigger" target="_blank">trigger</a>, <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobInput" target="_blank">input</a> binding, and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobOutput" target="_blank">output</a> binding
- Twilio SMS <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#TwilioSmsOutput" target="_blank">output</a> binding
- CosmosDB <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBTrigger" target="_blank">trigger</a>, <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBInput" target="_blank">input</a> binding, and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBOutput" target="_blank">output</a> binding
- Timer <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#TimerTrigger" target="_blank">trigger</a>

## Set up the prerequisites

Set up the prerequisites below to work with Azure Functions using Ballerina.

### Set up Ballerina

Install the [latest Ballerina distribution](https://ballerina.io/downloads/).

### Set up Azure Functions 

Follow the steps below to set up the Azure Functions.

1. Install the <a href="https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest" target="_blank">Azure CLI</a>.
2. Install and configure [Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools).

## Create the app

Follow the steps below to create the Azure function app.

1. Log in to the Azure CLI by executing the `az login` command on CLI.
2. Create an <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal" target="_blank">Azure Function app</a> with the given resource group with following requirements.
>**Note:** Make sure to remember the function application name and storage account name as they will be required in the code samples.
   - Runtime stack - `Java 11`
   - Hosting operating system - `Windows` (Currently, Linux is not supported in Azure by default for custom handlers.)

## Write the function

The following Ballerina code gives an example of using an HTTP trigger to invoke the function, and an HTTP output binding to respond to the caller with a message based on the query parameter sent from the request. 

```ballerina
import ballerinax/azure_functions as af;

service / on new af:HttpListener() {
    resource function get hello(string name) returns string {
        return "Hello, " + name + "!";
    }
}
```

## Build the function

The Azure Functions functionality is implemented as a compiler extension. Thus, artifact generation happens automatically when you build a Ballerina module. 

## Deploy the function

The created function app name should be provided to the placeholders shown in the above-generated usage instructions from the compiler. 

## Invoke the function

The deployed Azure Function can be tested by invoking it using an HTTP client such as cURL.

## Azure Functions native (experimental)

You can use Azure Functions in the native approach of Ballerina, which is currently an experimental feature.

>**Info:** For more information on the native approach, see [Build a native executable](/learn/build-a-native-executable/#pack-the-native-executable-in-a-container). 

### Set up the prerequisites for the native approach

Follow the steps below to set up the prerequisites that are specifically required to follow the native approach.

1. Set up the [general prerequisites](#set-up-the-prerequisites).
2. Log in to the Azure CLI by executing the `az login` command on CLI.
3. Install and configure [Docker](https://www.docker.com/) in your machine.
4. Install and configure [GraalVM](https://www.graalvm.org/) in your machine.

### Create an app for the native approach

Follow the steps below to create the Azure function app.

1. Log in to the Azure CLI by executing the `az login` command on CLI.
2. Create an <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal" target="_blank">Azure Function app</a> with the given resource group with following requirements.
   - Runtime stack - `Java 11`
   - Hosting operating system - `Linux` (As of now, Ballerina Azure functions native support is only available for Linux.)

### Build the function for the native approach

An Azure Functions package supports the two build options below.

>**Note:** Both build options for the non-native JVM-based approach will behave the same since the JVM is platform-independent.

- `cloud="azure_functions"` - Builds the native executable to be compatible with the Azure Functions cloud.
- `cloud="azure_functions_local"` - Builds the native executable to be compatible with your machine for development purposes.

You can use these build options along with the native build option (i.e., `--native`) while building the package as shown below. 

#### Build locally 

The example command below will build the package and run it locally.

>**Info:** This will use the GraalVM you installed on your machine to build the native image and make the generated executable compatible with your machine.

```bash
$ bal build --cloud="azure_functions_local" --native
```

#### Build for the cloud

The example command below will build the package for the Azure Functions cloud. 

>**Info:** This will perform the compilation inside the Docker image to make it compatible with the Azure Functions cloud environment.

```bash
$ bal build --cloud="azure_functions" --native
```

### Deploy the function for the native approach

You can either deploy the Azure Functions package locally or on the Azure Functions cloud. 

#### Deploy locally

The example command below will deploy the package locally.

```bash
$ func start --script-root target/azure_functions
```

#### Deploy on the cloud

The example command below will deploy the package on the Azure Functions cloud. 

```bash
$ func azure functionapp publish <function_app_name> --script-root target/azure_functions
```

## Learn more

For examples of using AWS Lambda functions, see the below.

- [Hello world](/learn/by-example/azure-functions-hello-world/)
- [Context execution](/learn/by-example/azure-functions-timer-trigger/)
- [S3 trigger](/learn/by-example/azure-functions-http-trigger/)
- [DynamoDB trigger](/learn/by-example/azure-functions-cosmosdb-trigger/)
