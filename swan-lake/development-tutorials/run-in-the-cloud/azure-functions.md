---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Azure Functions
description: The Azure Functions extension provides the functionality to expose a Ballerina function as a serverless function in the Azure Functions platform.
keywords: ballerina, programming language, serverless, cloud, azure, functions, cloud-native
permalink: /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/
active: azure-functions
intro: The Azure Functions extension provides the functionality to expose a Ballerina function as a serverless function in the Azure Functions platform.
---

>**Info:** [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview?pivots=programming-language-csharp) can be written in Ballerina using the listeners and services provided by the Azure Functions package. 

## Supported triggers and bindings

An Azure Function consists of a trigger and optional bindings. A trigger defines how a function is invoked. A binding is an approach in which you can declaratively connect other resources to the function. 

There are *input* and *output* bindings. An input binding is a source of data that flows into the function. An output binding allows outputting data from the function to an external resource. For more information, go to <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings" target="_blank">Azure Functions triggers and bindings concepts</a>.

The following Azure Functions triggers and bindings are currently supported in Ballerina.

|                                                 Supported triggers                                                |                                              Supported output bindings                                              |                                             Supported input bindings                                            |
|:-----------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------:|
|     <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#HttpTrigger" target="_blank">HTTP</a>     |       <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#HttpOutput" target="_blank">HTTP</a>      |                                                        -                                                        |
|    <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#QueueTrigger" target="_blank">Queue</a>    |      <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#QueueOutput" target="_blank">Queue</a>     |                                                        -                                                        |
|     <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobTrigger" target="_blank">Blob</a>     |       <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobOutput" target="_blank">Blob</a>      |     <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobInput" target="_blank">Blob</a>     |
|                                                         -                                                         | <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#TwilioSmsOutput" target="_blank">Twilio SMS</a> |                                                        -                                                        |
| <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBTrigger" target="_blank">Cosmos DB</a> |   <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBOutput" target="_blank">Cosmos DB</a>  | <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBInput" target="_blank">Cosmos DB</a> |
|    <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#TimerTrigger" target="_blank">Timer</a>    |                                                          -                                                          |                                                        -                                                        |

## Set up the prerequisites

Follow the instructions in the sections below to set up the prerequisites.

### Set up Azure Functions 

Follow the steps below to set up the Azure Functions.

1. Create an Azure subscription.
2. Install the <a href="https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest" target="_blank">Azure CLI</a>.
3. Install and configure the [Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools).

### Create the app

Follow the steps below to create the Azure function app.

>**Note:** Make sure to remember the function application name and storage account name as they will be required in the code samples.

1. Execute the `az login` command on the CLI to log in to the Azure CLI.
2. Create an <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal" target="_blank">Azure Function app</a> with the default option of creating a resource group automatically and the requirements below.

      - Runtime stack - `Java 17`
      - Hosting operating system - `Windows` (Currently, Linux is not supported in Azure by default for custom handlers.)

## Create the function

You can write Azure functions that use different triggers to invoke the function, and output bindings to generate the response based on your use case. 

>**Info:** For examples of creating Azure functions, see [Examples](#examples).

## Build the function

The Azure Functions functionality is implemented as a compiler extension. Therefore, artifact generation happens automatically when you build a Ballerina module by executing the command below. 

```
$ bal build --cloud="azure_functions"
```

## Deploy the function

To deploy the function, execute the command, which you get in the CLI output logs after you [build the function](#build-the-function). For examples, see [Examples](#examples).

>**Note:** When you are deploying, make sure to replace the `<function_app_name>` placeholder with the app name of the [created function](#create-the-function).


## Azure Functions as a native executable

You can use Azure Functions in the [native approach of Ballerina](/learn/build-the-executable-in-a-container/).

### Set up the prerequisites 

Follow the steps below to set up the prerequisites, which are specifically required to follow the native approach.

1. Set up the [general prerequisites](#set-up-the-prerequisites).
2. Install and configure [Docker](https://www.docker.com/) in your machine.
3. Install and configure [GraalVM](https://www.graalvm.org/) in your machine.

### Create the app 

Create an <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal" target="_blank">Azure Function app</a> with the given resource group with the following requirements.
   - Runtime stack - `Java 17`
   - Hosting operating system - `Linux` (As of now, Ballerina Azure functions native support is only available for Linux.)

### Create the function 

An Azure Functions package supports the two build options below.

>**Info:** Both build options for the non-native JVM-based approach will behave the same since the JVM is platform-independent.

- `cloud="azure_functions"` - Builds the native executable to be compatible with the Azure Functions cloud.
- `cloud="azure_functions_local"` - Builds the native executable to be compatible with your machine for development purposes.

You can use these build options along with the graalvm build option (`--graalvm`) while building the package, as shown below. 

#### Build locally 

The example command below will build the package and run it locally.

```
$ bal build --cloud="azure_functions_local" --graalvm
```

>**Info:** This will use the GraalVM you installed on your machine to build the native image and make the generated executable compatible with your machine.

#### Build for the cloud

The example command below will build the package for the Azure Functions cloud. 

```
$ bal build --cloud="azure_functions" --graalvm
```

>**Info:** This will perform the compilation inside the Docker image to make it compatible with the Azure Functions cloud environment.

### Deploy the function 

You can either deploy the Azure Functions package locally or on the Azure Functions cloud. 

#### Deploy locally

The example command below will deploy the package locally.

```
$ func start --script-root target/azure_functions
```

#### Deploy on the cloud

The example command below will deploy the package on the Azure Functions cloud. 

```
$ func azure functionapp publish <function_app_name> --script-root target/azure_functions
```

## Examples

For examples of the usage of Azure Functions, see [Azure Functions](/learn/by-example/#azure-functions).
