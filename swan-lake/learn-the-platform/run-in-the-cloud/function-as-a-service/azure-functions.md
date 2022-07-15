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
* Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).
* Login to the Azure CLI by executing the `az login` command.
* Create an [Azure Function app](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal) with the given resource group with following requirements.

>**Note:** Make sure to remember the function application name and storage account name as they will be required in the code samples.
   - Runtime stack - `Java 11`
   - Hosting operating system - `Windows` (By default, Linux is not supported in Azure for custom handlers at the moment.)

## Triggers and bindings

An Azure Function consists of a trigger and optional bindings. A trigger defines how a function is invoked. A binding is an approach in which you can declaratively connect other resources to the function. There are *input* and *output* bindings. An input binding is a source of data into the function. An output binding allows outputting data from the function to an external resource. For more information, go to [Azure Functions triggers and bindings concepts](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings).

The following Azure Functions triggers and bindings are currently supported in Ballerina:
- HTTP [trigger](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#HTTPTrigger) and [output](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#HTTPOutput) binding
- Queue [trigger](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#QueueTrigger) and [output](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#QueueOutput) binding
- Blob [trigger](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#BlobTrigger), [input](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#BlobInput) binding, and [output](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#BlobOutput) binding
- Twilio SMS [output](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#TwilioSmsOutput) binding
- CosmosDB [trigger](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#CosmosDBTrigger), [input](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#CosmosDBInput) binding, and [output](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#CosmosDBOutput) binding
- Timer [trigger](https://docs.central.ballerina.io/ballerinax/azure_functions/latest/annotations#TimerTrigger)

## Write the function

The following Ballerina code gives an example of using an HTTP trigger to invoke the function, and an HTTP output binding to respond to the caller with a message. 

Create a Ballerina package.
```bash
$ bal new azure_functions_deployment
```
Replace the contents of the generated BAL file with the following content.

```ballerina
import ballerinax/azure_functions as af;

@af:Function
public function hello(@af:HTTPTrigger { authLevel: "anonymous" }
                      string payload)
                      returns @af:HTTPOutput string|error {
    return "Hello, " + payload + "!";
}
```
The first parameter with the [Context](https://lib.ballerina.io/ballerinax/azure_functions/latest/classes/Context) object contains the information and operations related to the current function execution in Azure Functions such as the execution metadata and logging actions to be used by the function. This parameter is optional and can exist at any position in the function's parameter list.

The second parameter with the `HTTPTrigger` annotation signals that this function is going to have an HTTP trigger and that its details should be stored in the given `HTTPRequest` value. Then, you declare an HTTP output binding by annotating the `HTTPBinding` return type with the `HTTPOutput` annotation.

This HTTP output binding can also be defined as a parameter with the same annotation. In this manner, you can mix and match any combination of triggers and input/output bindings with or without the execution context object when defining an Azure Function. You can find an example in the [HTTP Trigger -> Queue Output](/learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/#http-trigger---queue-output) output example.

### Build the function

The Azure Functions functionality is implemented as a compiler extension. Thus, artifact generation happens automatically when you build a Ballerina module. Let's see how this works by building the above code. 

```bash
$ bal build
Compiling source
	wso2/azure_functions_deployment:0.1.0

Generating executables
	@azure.functions:Function: hello

	Run the following command to deploy Ballerina Azure Functions:
	az functionapp deployment source config-zip -g <resource_group> -n <function_app_name> --src <package_dir>/target/bin/azure-functions.zip
```

>**Note:** A custom [`host.json`](https://docs.microsoft.com/en-us/azure/azure-functions/functions-host-json) file for the Azure Functions deployment can be provided optionally by placing a `host.json` file in the current working directory in which the Ballerina build is done. The required `host.json` properties are provided/overridden by the values derived from the source code by the compiler extension. 


### Deploy the function

The created resource group and the function app name should be provided to the placeholders shown in the above-generated usage instructions from the compiler. 

A sample execution to deploy the functions to Azure Functions is shown below. 

```bash
$ az functionapp deployment source config-zip -g <function_app_name> -n <function_app_name> --src <package_dir>/target/bin/azure-functions.zip
Getting scm site credentials for zip deployment
Starting zip deployment. This operation can take a while to complete ...
Deployment endpoint responded with status code 202
{
  "active": false,
  "author": "N/A",
  "author_email": "N/A",
  "complete": true,
  "deployer": "ZipDeploy",
  "end_time": "2020-07-15T07:32:35.5311903Z",
  "id": "e56a20038b864c5c8432aa7d1c26bfbd",
  "is_readonly": true,
  "is_temp": false,
  "last_success_end_time": "2020-07-15T07:32:35.5311903Z",
  "log_url": "https://<function_app_name>.scm.azurewebsites.net/api/deployments/latest/log",
  "message": "Created via a push deployment",
  "progress": "",
  "provisioningState": null,
  "received_time": "2020-07-15T07:32:21.9780071Z",
  "site_name": "<function_app_name>",
  "start_time": "2020-07-15T07:32:23.2044517Z",
  "status": 4,
  "status_text": "",
  "url": "https://<function_app_name>.scm.azurewebsites.net/api/deployments/latest"
}
```

### Invoke the function

The deployed Azure Function can be tested by invoking it using an HTTP client such as cURL:

```bash
$ curl -d "Hello!" https://<function_app_name>.azurewebsites.net/api/hello 
Hello, Hello!%
```

## More samples

This section uses different types of triggers and bindings to build Azure functions to integrate with different Azure services using concepts explained in the above sections.

### HTTP Trigger -> queue output

The following Ballerina code gives an example of using an HTTP trigger to invoke the function, a queue output binding to write an entry to a queue, and also an HTTP output binding to respond to the caller with a message. 

First, create a queue to hold the outputs of the function by accessing the storage account that was created alongside the function app in the prerequisites. Select **Queues** in the sidebar in the storage accounts. Click the **Add queue** button, and enter the same value as the value of the `queueName` property in the below `QueueOutput` annotation.

```ballerina
import ballerinax/azure_functions as af;

@af:Function
public function fromHttpToQueue(af:Context ctx, 
                                @af:HTTPTrigger { authLevel: "anonymous" } af:HTTPRequest req, 
                                @af:QueueOutput { queueName: "queue1" } af:StringOutputBinding msg) 
                                returns @af:HTTPOutput af:HTTPBinding {
    msg.value = req.body;
    return { statusCode: 200, payload: "Request: " + req.toString() };
}
```

Build the package by executing the `bal build` command on the package directory, and then, deploy it using the `az cli` command shown in the Ballerina build output as in the previous section.

Now, the deployed Azure Function can be tested by invoking it using an HTTP client such as cURL. 

```bash
$ curl -d "Hello!" https://<function_app_name>.azurewebsites.net/api/fromHttpToQueue 
Request: url=https://<function_app_name>.azurewebsites.net/api/fromHttpToQueue method=POST query= headers=Accept=*/* Connection=Keep-Alive Content-Length=6 Content-Type=application/x-www-form-urlencoded Host=<function_app_name>.azurewebsites.net Max-Forwards=9 User-Agent=curl/7.64.0 X-WAWS-Unencoded-URL=/api/fromHttpToQueue CLIENT-IP=10.0.128.31:47794 X-ARR-LOG-ID=c905b483-af19-4cf2-9ce0-0741e5998a98 X-SITE-DEPLOYMENT-ID=<function_app_name> WAS-DEFAULT-HOSTNAME=<function_app_name>.azurewebsites.net X-Original-URL=/api/fromHttpToQueue X-Forwarded-For=45.30.94.9:47450 X-ARR-SSL=2048|256|C=US, S=Washington, L=Redmond, O=Microsoft Corporation, OU=Microsoft IT, CN=Microsoft IT TLS CA 5|CN=*.azurewebsites.net X-Forwarded-Proto=https X-AppService-Proto=https X-Forwarded-TlsVersion=1.2 DISGUISED-HOST=<function_app_name>.azurewebsites.net params= identities=[{"AuthenticationType":null,"IsAuthenticated":false,"Actor":null,"BootstrapContext":null,"Claims":[],"Label":null,"Name":null,"NameClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name","RoleClaimType":"http://schemas.microsoft.com/ws/2008/06/identity/claims/role"}] body=Hello!
```

Refresh the queue page in the portal and view the added entry.

### Cosmos DB trigger -> queue output

The following Ballerina code gives an example of using a Cosmos DB trigger to invoke the function and a queue output binding to write an entry to a queue.

Before writing and deploying the code, create a Cosmos DB and a queue to make use of those services later.
1. You can reuse the queue you created in the above [HTTP trigger -> Queue output](/learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/azure-functions/#http-trigger---queue-output) sample.
2. Create an [Azure Cosmos DB account](https://portal.azure.com/#create/Microsoft.DocumentDB) and select Cosmos DB Core.
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

@af:Function
public function cosmosDBToQueue2(@af:CosmosDBTrigger { 
        connectionStringSetting: "CosmosDBConnection", databaseName: "db1", 
        collectionName: "c1" } json req,
        @af:QueueOutput { queueName: "queue2" } af:StringOutputBinding outMsg) returns error?{
    json[] entryList = <json[]> req;
    string name = check entryList[0].name;
    log:printInfo(name);
    outMsg.value = name;
}
```

Build the package by executing the `bal build` command on the package directory, and then deploy it using the `az cli` command shown in the Ballerina build output as in the previous section.

Once the function is deployed, You need to add an item to the collection.
1. Go to the created collection in the **Data Explorer**.
2. Click **New Item** to add a new item to the collection.
3. Go to the queue page and observe the added new entry.

**Info:** Additionally, for debugging purposes, view the logs under the **Logs stream** in the function app.

>**Note:** For a full sample with all the supported Azure Functions triggers and bindings in Ballerina, see the [Azure Functions deployment example](/learn/by-example/azure-functions-deployment.html).

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
