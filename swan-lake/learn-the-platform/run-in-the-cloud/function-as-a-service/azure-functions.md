---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Azure Functions
description: Learn how to write and deploy Azure Functions using ballerina
keywords: ballerina, programming language, serverless, cloud, azure, functions, cloud native
permalink: /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/
active: azure-functions
intro: The Azure Functions extension provides the functionality to expose a Ballerina function as a serverless function in the Azure Functions platform.
---

## Prerequisites
* Install the latest Ballerina [distribution](https://ballerina.io/downloads/).
* Install the <a href="https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest" target="_blank">Azure CLI</a>.
* Install and configure [Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Clinux%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools)
* Login to the Azure CLI by executing the `az login` command.
* Create an <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal" target="_blank">Azure Function app</a> with the given resource group with following requirements.

>**Note:** Make sure to remember the function application name and storage account name as they will be required in the code samples.
   - Runtime stack - `Java 11`
   - Hosting operating system - `Windows` (By default, Linux is not supported in Azure for custom handlers at the moment.)

## Triggers and bindings

An Azure Function consists of a trigger and optional bindings. A trigger defines how a function is invoked. A binding is an approach in which you can declaratively connect other resources to the function. There are *input* and *output* bindings. An input binding is a source of data into the function. An output binding allows outputting data from the function to an external resource. For more information, go to <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings" target="_blank">Azure Functions triggers and bindings concepts</a>.

The following Azure Functions triggers and bindings are currently supported in Ballerina:
- HTTP <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#HttpTrigger" target="_blank">trigger</a> and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#HttpOutput" target="_blank">ouput</a> binding
- Queue <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#QueueTrigger" target="_blank">trigger</a> and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#QueueOutput" target="_blank">ouput</a> binding
- Blob <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobTrigger" target="_blank">trigger</a>, <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobInput" target="_blank">input</a> binding, and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#BlobOutput" target="_blank">output</a> binding
- Twilio SMS <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#TwilioSmsOutput" target="_blank">output</a> binding
- CosmosDB <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBTrigger" target="_blank">trigger</a>, <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBInput" target="_blank">input</a> binding, and <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#CosmosDBOutput" target="_blank">output</a> binding
- Timer <a href="https://lib.ballerina.io/ballerinax/azure_functions/latest#TimerTrigger" target="_blank">trigger</a>

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

### Build the function

The Azure Functions functionality is implemented as a compiler extension. Thus, artifact generation happens automatically when you build a Ballerina module. Let's see how this works by building the above code. 

```
$ bal build --cloud="azure_functions"
Compiling source
        wso2/azure_functions_deployment:0.1.0

Generating executable
        @azure_functions:Function: get-hello

        Execute the command below to deploy the function locally.
        func start --script-root target/azure_functions --java

        Execute the command below to deploy Ballerina Azure Functions.
        func azure functionapp publish <function_app_name> --script-root target/azure_functions 

        target/bin/azure_functions_deployment.jar
```

### Deploy the function

The created function app name should be provided to the placeholders shown in the above-generated usage instructions from the compiler. 

A sample execution to deploy the functions to Azure Functions is shown below. 

```bash
$ func azure functionapp publish <function_app_name> --script-root target/azure_functions 
Getting site publishing info...
Creating archive for current directory...
Uploading 28.64 MB [##############################################################################]
Upload completed successfully.
Deployment completed successfully.
Syncing triggers...
Functions in bal-learn-1:
    get-hello - [httpTrigger]
        Invoke url: https://bal-learn-1.azurewebsites.net/hello
```

### Invoke the function

The deployed Azure Function can be tested by invoking it using an HTTP client such as cURL:

```
$ curl https://<function_app_name>.azurewebsites.net/hello\?name\=Jack
Hello, Jack!
```
