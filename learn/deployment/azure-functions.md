---
layout: ballerina-left-nav-pages
title: Azure Functions
description: See how the Ballerina deployment in Azure Functions works
keywords: ballerina, programming language, serverless, cloud, Azure, Functions
permalink: /learn/deployment/azure-functions/
active: azure
redirect_from:
  - /learn/deployment/azure-functions
---

# Azure Functions

The Azure Functions extension provides the functionality to expose a Ballerina function as a serverless function in the Azure Functions platform. This is done by importing the `ballerinax/azure.functions` module and simply annotating the Ballerina function with the `functions:Function` annotation. 

An Azure Function consists of a trigger and optional bindings. A trigger defines how a function is invoked. A binding is an approach in which you can declaratively connect other resources to the function. There are *input* and *output* bindings. An input binding is a source of data into the function. An output binding allows to output data from the function out to an external resource. For more information, go to [Azure Functions triggers and bindings concepts](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings).

The following Azure Functions triggers and bindings are currently supported in Ballerina:
- HTTP [trigger](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#HTTPTrigger) and [output](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#HTTPOutput) binding
- Queue [trigger](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#QueueTrigger) and [output](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#QueueOutput) binding
- Blob [trigger](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#BlobTrigger), [input](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#BlobInput) binding, and [output](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#BlobOutput) binding
- Twilio SMS [output](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#TwilioSmsOutput) binding
- CosmosDB [trigger](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#CosmosDBTrigger), [input](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#CosmosDBInput) binding, and [output](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#CosmosDBOutput) binding
- Timer [trigger](http://ballerina.io/learn/api-docs/ballerina/azure.functions/annotations.html#TimerTrigger)

The following Ballerina code gives an example of using an HTTP trigger to invoke the function, a queue output binding to write an entry to a queue, and also an HTTP output binding to respond back to the caller with a message. 

```ballerina
import ballerinax/azure.functions as af;

@af:Function
public function fromHttpToQueue(af:Context ctx, 
                                @af:HTTPTrigger { authLevel: "anonymous" } af:HTTPRequest req, 
                                @af:QueueOutput { queueName: "queue1" } af:StringOutputBinding msg) 
                                returns @af:HTTPOutput af:HTTPBinding {
    msg.value = req.body;
    return { statusCode: 200, payload: "Request: " + req.toString() };
}
```

The first parameter with the [Context](https://ballerina.io/learn/api-docs/ballerina/azure.functions/objects/Context.html) object contains the information and operations related to the current function execution in Azure Functions such as the execution metadata and logging actions to be used by the function. This parameter is optional and can exist at any position in the parameter list of the function. The second parameter with the `HTTPTrigger` annotation signals that this function is going to have an HTTP trigger and that its details should be stored in the given `HTTPRequest` value. Then, you also declare that you will be having a queue output binding by the usage of the `QueueOutput` annotation with a string result by defining a `StringOutputBinding` parameter. Also, you declare an HTTP output binding by annotating the `HTTPBinding` return type  with the `HTTPOutput` annotation. This HTTP output binding can also be given by defining as a parameter as well with the same annotation. In this manner, you can mix and match any combination of triggers and  input/output bindings with or without the execution context object when defining an Azure Function. 

The Azure Functions functionality is implemented as a compiler extension. Thus, the artifact generation happens automatically when you build a Ballerina module. Let's see how this works by building the above code. 

```bash
$ ballerina build functions.bal 
Compiling source
	functions.bal

Generating executables
	functions.jar
	@azure.functions:Function: fromHttpToQueue

	Run the following command to deploy Ballerina Azure Functions:
	az functionapp deployment source config-zip -g <resource_group> -n <function_app_name> --src azure-functions.zip
```

In order to deploy a Ballerina function in Azure Functions, the following prerequisites must be met.

* Create an Azure [Function App](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal) with the given resource group with the following requirements:
   - Runtime stack - `Java`
   - Hosting operating system - `Windows` (default; Linux is not supported in Azure for custom handlers at the moment)
* Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

The created resource group and the function app name should be provided to the placeholders shown in the above-generated usage instructions from the compiler. 

A custom [`host.json`](https://docs.microsoft.com/en-us/azure/azure-functions/functions-host-json) file for the Azure Functions deployment can be optionally provided by placing a `host.json` file in the current working directory in which the Ballerina build is done. The required `host.json` properties are provided/overridden by the values derived from the source code by the compiler extension. 

A sample execution to deploy the functions to Azure Functions is shown below. 

```bash
$ az functionapp deployment source config-zip -g functions1777 -n functions1777 --src azure-functions.zip 
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
  "log_url": "https://functions1777.scm.azurewebsites.net/api/deployments/latest/log",
  "message": "Created via a push deployment",
  "progress": "",
  "provisioningState": null,
  "received_time": "2020-07-15T07:32:21.9780071Z",
  "site_name": "functions1777",
  "start_time": "2020-07-15T07:32:23.2044517Z",
  "status": 4,
  "status_text": "",
  "url": "https://functions1777.scm.azurewebsites.net/api/deployments/latest"
}
```

The deployed Azure Function can be tested by invoking it using an HTTP client such as CURL:

```bash
$ curl -d "Hello!" https://functions1777.azurewebsites.net/api/fromHttpToQueue 
Request: url=https://functions1777.azurewebsites.net/api/fromHttpToQueue method=POST query= headers=Accept=*/* Connection=Keep-Alive Content-Length=6 Content-Type=application/x-www-form-urlencoded Host=functions1777.azurewebsites.net Max-Forwards=9 User-Agent=curl/7.64.0 X-WAWS-Unencoded-URL=/api/fromHttpToQueue CLIENT-IP=10.0.128.31:47794 X-ARR-LOG-ID=c905b483-af19-4cf2-9ce0-0741e5998a98 X-SITE-DEPLOYMENT-ID=functions1777 WAS-DEFAULT-HOSTNAME=functions1777.azurewebsites.net X-Original-URL=/api/fromHttpToQueue X-Forwarded-For=45.30.94.9:47450 X-ARR-SSL=2048|256|C=US, S=Washington, L=Redmond, O=Microsoft Corporation, OU=Microsoft IT, CN=Microsoft IT TLS CA 5|CN=*.azurewebsites.net X-Forwarded-Proto=https X-AppService-Proto=https X-Forwarded-TlsVersion=1.2 DISGUISED-HOST=functions1777.azurewebsites.net params= identities=[{"AuthenticationType":null,"IsAuthenticated":false,"Actor":null,"BootstrapContext":null,"Claims":[],"Label":null,"Name":null,"NameClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name","RoleClaimType":"http://schemas.microsoft.com/ws/2008/06/identity/claims/role"}] body=Hello!
```

For a full sample with all the supported Azure Functions triggers and bindings in Ballerina, see [Azure Functions Deployment Example](https://github.com/ballerina-platform/module-ballerinax-azure.functions/blob/master/azurefunctions-extension-examples/examples/azure-functions-deployment/azure_functions_deployment.bal).
