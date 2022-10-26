---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Azure Functions
description: Learn how to write and deploy Azure Functions using ballerina
keywords: ballerina, programming language, serverless, cloud, azure, functions, cloud native
permalink: /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/
active: azure-functions
intro: The Azure Functions extension provides the functionality to expose a Ballerina function as a serverless function in the Azure Functions platform.
redirect_from:
  - /learn/deployment/azure-functions
  - /swan-lake/learn/deployment/azure-functions/
  - /swan-lake/learn/deployment/azure-functions
  - /learn/deployment/azure-functions/
  - /learn/deployment/azure-functions
  - /learn/user-guide/deployment/azure-functions
  - /learn/user-guide/deployment/azure-functions/
  - /learn/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions
  - /learn/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/
  - /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions
  - /learn/guides/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/
  - /learn/guides/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions
---

## Prerequisites
* Install the latest Ballerina distribution.
* Install the <a href="https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest" target="_blank">Azure CLI</a>.
* Login to the Azure CLI by executing the `az login` command.
* Create an <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal" target="_blank">Azure Function app</a> with the given resource group with following requirements.

>**Note:** Make sure to remember the function application name and storage account name as they will be required in the code samples.
   - Runtime stack - `Java 11`
   - Hosting operating system - `Windows` (By default, Linux is not supported in Azure for custom handlers at the moment.)

## Triggers and bindings

An Azure Function consists of a trigger and optional bindings. A trigger defines how a function is invoked. A binding is an approach in which you can declaratively connect other resources to the function. There are *input* and *output* bindings. An input binding is a source of data into the function. An output binding allows outputting data from the function to an external resource. For more information, go to <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings" target="_blank">Azure Functions triggers and bindings concepts</a>.

The following Azure Functions triggers and bindings are currently supported in Ballerina:
- HTTP <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#HttpTrigger" target="_blank">trigger</a> and <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#HttpOutput" target="_blank">ouput</a> binding
- Queue <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#QueueTrigger" target="_blank">trigger</a> and <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#QueueOutput" target="_blank">ouput</a> binding
- Blob <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#BlobTrigger" target="_blank">trigger</a>, <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#BlobInput" target="_blank">input</a> binding, and <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#BlobOutput" target="_blank">output</a> binding
- Twilio SMS <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#TwilioSmsOutput" target="_blank">output</a> binding
- CosmosDB <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#CosmosDBTrigger" target="_blank">trigger</a>, <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#CosmosDBInput" target="_blank">input</a> binding, and <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#CosmosDBOutput" target="_blank">output</a> binding
- Timer <a href="https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#TimerTrigger" target="_blank">trigger</a>

## Write the function

The following Ballerina code gives an example of using an HTTP trigger to invoke the function, and an HTTP output binding to respond to the caller with a message based on the query parameter sent from the request. 

Create a Ballerina package.
```
$ bal new azure_functions_deployment
```
Replace the contents of the generated BAL file with the following content.

```ballerina
import ballerinax/azure_functions as af;

service / on new af:HttpListener() {
    resource function get hello(string name) returns string {
        return "Hello, " + name + "!";
    }
}

```
In Ballerina, `triggers` are represented by `listeners`. When the `af:HttpListener` gets attached to the service, it implies that the function is an HTTP Trigger. The resource function behaves exactly the same as a service written from `ballerina/http`. It supports `http:Payload, http:Header` annotations for parameters. Input binding annotations can be used to annotate parameters to make use of external services in Azure. If no annotations are specified for a parameter, it is identified as a query parameter.

Output bindings are defined in the return type definition. For services with the `HttpListener` attachment, `HttpOutput` is the default output binding. You can override the default behavior by specifying them explicitly in the return type. For example, see [HTTP Trigger -> Queue Output](#http-trigger---queue-output).

In the code sample shown above, it has an empty service path and resource path named `hello`. The accessor is `get`. It expects a request with a query parameter for the field `name`. The required artifact generation and data binding will be handled by the `ballerinax/azure_functions` package automatically.

### Build the function

The Azure Functions functionality is implemented as a compiler extension. Thus, artifact generation happens automatically when you build a Ballerina module. Let's see how this works by building the above code. 

```
$ bal build
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

## More samples

This section uses different types of triggers and bindings to build Azure functions to integrate with different Azure services using concepts explained in the above sections.

### HTTP Trigger -> queue output

The following Ballerina code gives an example of using an HTTP trigger to invoke the function and a queue output binding to write an entry to a queue.

First, create a queue to hold the outputs of the function by accessing the storage account that was created alongside the function app in the prerequisites. Select **Queues** in the sidebar in the storage accounts. Click the **Add queue** button, and enter the same value as the value of the `queueName` property in the below `QueueOutput` annotation.

```ballerina
import ballerina/http;
import ballerinax/azure_functions as af;

public type Person record {
    string name;
    int age;
};

service / on new af:HttpListener() {
    resource function post queue(@http:Payload Person person) returns @af:QueueOutput {queueName: "people"} string {
        return person.name + " is " + person.age.toString() + " years old.";
    }
}
```

Execute the `bal build` command on the package directory to build the package. Then, execute the `func azure functionapp publish <function_app_name> --script-root target/azure_functions ` command shown in the Ballerina build output to deploy it.

Now, the deployed Azure Function can be tested by invoking it using an HTTP client such as cURL. 

```bash
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"Jack","age":21}' \   
  https://<function_app_name>.azurewebsites.net/queue
```

Refresh the queue page in the portal and view the added entry.

### Cosmos DB trigger -> queue output

The following Ballerina code gives an example of using a Cosmos DB trigger to invoke the function and a queue output binding to write an entry to a queue.

Before writing and deploying the code, create a Cosmos DB and a queue to make use of those services later.
1. You can reuse the queue you created in the above <a href="/learn/run-in-the-cloud/function-as-a-service/azure-functions/#http-trigger---queue-output" target="_blank">`HTTP trigger` -> `Queue output`</a> sample.
2. Create an <a href="https://portal.azure.com/#create/Microsoft.DocumentDB" target="_blank">Azure Cosmos DB account</a> and select Cosmos DB Core.
3. Once the database is created, go to the **Data Explorer**, and select **Create Container**.
4. Enter `db1` as Database ID and `c1` as the collection ID, and click **Ok**.

**Note:** If you want to change these values, make sure to change them in the code as well.
5. Go to the **Keys** tab of the Cosmos DB page.
6. Copy the value of the `PRIMARY CONNECTION STRING`.
7. Click the **Configuration** tab on the Function app page.
8. Select **New Application Setting**, and paste the data you copied above as the value. For the key, use the value of the `connectionStringSetting` key and save.

Example application setting is as follows.
```
Name - `CosmosDBConnection`
Value - `AccountEndpoint=https://db-cosmos.documents.azure.com:443/;AccountKey=12345asda;`
```

Now, as all the infrastructure required are up and running and configured, start building and deploying the Azure function.

```ballerina
import ballerina/log;
import ballerinax/azure_functions as af;

public type DBEntry record {
    string id;
    string name;
};

@af:CosmosDBTrigger {connectionStringSetting: "CosmosDBConnection", databaseName: "db1", collectionName: "c1"}
listener af:CosmosDBListener cosmosEp = new ();

service "cosmos" on cosmosEp {
    remote function onUpdated(DBEntry[] entries) returns @af:QueueOutput {queueName: "people"} string {
        string name = entries[0].name;
        log:printInfo(entries.toJsonString());
        return "Hello, " + name;
    }
}

```

Execute the `bal build` command on the package directory to build the package. Then, execute the `func azure functionapp publish <function_app_name> --script-root target/azure_functions ` command shown in the Ballerina build output to deploy it.

Once the function is deployed, add an item to the collection.
1. Navigate to the collection created in the **Data Explorer**.
2. Click **New Item** to add a new item to the collection.
3. Go to the queue page and observe the added new entry.

**Info:** Additionally, for debugging purposes, view the logs under the **Logs stream** in the function app.

>**Note:** For a full sample with all the supported Azure Functions triggers and bindings in Ballerina, see the [Azure Functions deployment example](/learn/by-example/azure-functions-deployment).

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
