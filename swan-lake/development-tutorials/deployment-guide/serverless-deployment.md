---
layout: ballerina-cloud-left-nav-pages-swanlake
title: Serverless deployment
description: Serverless architecture allows developers to focus on writing application logic without worrying about managing servers or infrastructure. AWS Lambda automatically handles provisioning, scaling, and maintaining resources, letting you concentrate solely on your code. Following are the  Ballerina functions in a serverless environment, 
keywords: ballerina, programming language, services, cloud, kubernetes, docker
active: ballerina-deployment-guideLines
intro: Serverless architecture allows developers to focus on writing application logic without worrying about managing servers or infrastructure. AWS Lambda automatically handles provisioning, scaling, and maintaining resources, letting you concentrate solely on your code. Following are the  Ballerina functions in a serverless environment, 
---

- [AWS Lambda](#aws-lambda)
- [Azure Functions](#azure-functions)

## AWS Lambda

The AWS Lambda extension provides the functionality to write AWS Lambda-compatible packages by exposing a Ballerina function as an AWS Lambda function.

> **Info:** Ballerina functions can be deployed in [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) by annotating a Ballerina function with `@awslambda:Function` adhering to the following function signature: <br/>`function (awslambda:Context, json|EventType) returns json|error`

### Supported triggers

An AWS Lambda function can be triggered by various AWS services. You can find the list of supported notification types below.

- <a href="https://aws.amazon.com/lambda/" target="_blank">Direct invocation</a>
- <a href="https://aws.amazon.com/sqs/" target="_blank">Simple Queue Service (SQS)</a>
- <a href="https://aws.amazon.com/s3/" target="_blank">Simple Storage Service (S3)</a>
- <a href="https://aws.amazon.com/dynamodb/" target="_blank">DynamoDB</a>
- <a href="https://aws.amazon.com/ses/" target="_blank">Simple Email Service (SES)</a>
- <a href="https://aws.amazon.com/api-gateway/" target="_blank">API Gateway</a>

Follow the instructions in the sections below to deploy a Ballerina function in AWS Lambda.

### Set up the AWS account

Follow the steps below to set up an AWS account and the AWS CLI.

1. Install the <a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" target="_blank">AWS CLI</a>.

2. [Create](https://docs.aws.amazon.com/SetUp/latest/UserGuide/setup-AWSsignup.html) an AWS account and [sign in](https://docs.aws.amazon.com/SetUp/latest/UserGuide/setup-rootuser.html) to it.

### Create a user

Follow the steps below to create a new user in your AWS account.

1. Create a <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console" target="_blank">new AWS user</a>.

   >**Note:** Enter a username and enable access to the AWS Management Console.

2. <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console" target="_blank">Set the permissions</a> to the created user.

   >**Note:** Enable `AWSLambda_FullAccess` or higher permissions.

3. Obtain the <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-get" target="_blank">access keys</a>.

4. Configure the <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-configure.title" target="_blank">AWS CLI</a> for the user by providing the access key and secret generated in the user creation.

### Create a role

Follow the steps below to create a new role in your AWS account.

1. Create a <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html" target="_blank">new role</a>.

2. <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html#roles-creatingrole-user-console" target="_blank">Set the permissions</a> to the created role.

   >**Info:** Enable `AWSLambda_FullAccess` or higher permissions.

3. Access the newly created role in the AWS Console, and copy the role ARN to use when the Lambda function is being deployed.

### Create the function

You can write AWS Lambda functions that use different triggers based on your use case.

Functions annotated as `@awslambda:Function` should always have the first parameter with the <a href="https://central.ballerina.io/ballerinax/awslambda/latest#Context" target="_blank">`awslambda:Context`</a>object, which contains the information and operations related to the current function execution in AWS Lambda such as the request ID and the remaining execution time.

The second parameter with the `json` value contains the input request data. This input value format will vary depending on the source, which invoked the function (e.g., an AWS S3 bucket update event). The return type of the function is `json`. When the function is triggered by the event, the function body executes and it simply logs the input JSON and returns the JSON.

>**Info:** For examples of creating AWS Lambda functions, see [Examples](#examples).

### Build the function

The AWS Lambda functionality is implemented as a compiler extension. Therefore, artifact generation happens automatically when you build a Ballerina module by executing the command below.

```
$ bal build --cloud="aws_lambda"
```

>***Tip** You can append the `--graalvm` flag to the above build command to build the native executable. This executable will have a much smaller memory footprint and faster startup time. For more information, see [Build the executable in a container](/learn/build-the-executable-in-a-container/).

### Deploy the function

The AWS Lambda functionality in Ballerina is implemented as a custom AWS Lambda layer. This information is provided when the function is created. The compiler generates the `aws-ballerina-lambda-functions.zip` file, which encapsulates all the AWS Lambda functions that are generated. This ZIP file can be used with the AWS web console or the <a href="https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-configure-cli.html" target="_blank">AWS CLI</a> to deploy the functions.

To deploy the function, execute the command, which you get in the CLI output logs after you [build the function](#build-the-function). For examples, see [Examples](#examples).

>**Note:** When you are deploying, make sure to replace the `$FUNCTION_NAME`, `$LAMBDA_ROLE_ARN`, and `$REGION_ID` placeholders with the corresponding values you obtained when [setting up the prerequisites](#set-up-the-prerequisites).

>**Info:** For the supported parameters, go to the <a href="https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html" target="_blank">`create-function` documentation</a>. You might need to change parameters such as the `MemorySize` and `Timeout` depending on your application and connection speed.

### CI/CD deployment with AWS Lambda

This [Ballerina GitHub](https://github.com/ballerina-platform/ballerina-action) action workflow automates the continuous integration and continuous deployment (CI/CD) process for a Ballerina project. 
It is triggered by every push to the repository and automatically builds the project.

```yaml
name: Ballerina CI/CD with AWS Lambda

on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the Repository
      - name: Checkout
        uses: actions/checkout@v2

      # Step 2: Build the Ballerina Project
      - name: Ballerina Build
        uses: ballerina-platform/ballerina-action@master
        with:
          args: build --cloud=aws_lambda

      # Step 3: Package the Function for AWS Lambda
      - name: Package for AWS Lambda
        run: |
          mkdir lambda
          cp target/bin/your_project_name.jar lambda/
          cd lambda
          zip function.zip your_project_name.jar

      # Step 4: Configure AWS Credentials
        # AWS credentials are automatically picked up from GitHub Secrets

      # Step 5: Deploy to AWS Lambda
      - name: Deploy to AWS Lambda
        uses: appleboy/lambda-action@master
        with:
          aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws_region: ${{ secrets.AWS_REGION }}
          function_name: your_lambda_function_name
          handler_name: your_project_name.handler
          runtime: java11
          zip_file: lambda/function.zip
          role: ${{ secrets.AWS_LAMBDA_ROLE_ARN }}
          timeout: 30
          memory_size: 512

      # Optional: Test the Lambda Function
      - name: Invoke Lambda Function
        run: |
          aws lambda invoke --function-name your_lambda_function_name --payload '{}' response.json
          cat response.json
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
```
- **Step 01:** The push event can initiate a build and deployment process
- **Step 02:** This command tells Ballerina to compile the project specifically for AWS Lambda. It optimizes the output for Lambda’s serverless runtime requirements.
- **Step 03:** Package the compiled Ballerina application into a ZIP file suitable for AWS Lambda deployment.
- **Step 04:** Ensures that the workflow has the necessary credentials to interact with AWS services.
- **Step 05:** Deploy the packaged Ballerina function to AWS Lambda by uploading the ZIP file.
- **Step 06:** Test the deployed Lambda function by invoking it and outputting the response to confirm that the function works as expected.

### Examples

In a more practical scenario, the AWS Lambda functions will be used by associating them with an external event source such as Amazon DynamoDB or Amazon SQS. For more information on this, go to <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html" target="_blank">AWS Lambda event source mapping documentation</a>.

For examples of the usage of AWS Lambda functions, see [AWS Lambda](/learn/by-example/#aws-lambda).

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>


## Azure Functions

The Azure Functions extension provides the functionality to expose a Ballerina function as a serverless function in the Azure Functions platform.

>**Info:** [Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview?pivots=programming-language-csharp) can be written in Ballerina using the listeners and services provided by the Azure Functions package.

### Supported triggers and bindings

An Azure Function consists of a trigger and optional bindings. A trigger defines how a function is invoked. A binding is an approach in which you can declaratively connect other resources to the function.

There are *input* and *output* bindings. An input binding is a source of data that flows into the function. An output binding allows outputting data from the function to an external resource. For more information, go to <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings" target="_blank">Azure Functions triggers and bindings concepts</a>.

The following Azure Functions triggers and bindings are currently supported in Ballerina.

|                                                 Supported triggers                                                |                                              Supported output bindings                                              |                                             Supported input bindings                                            |
|:-----------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------:|
|     <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#HttpTrigger" target="_blank">HTTP</a>     |       <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#HttpOutput" target="_blank">HTTP</a>      |                                                        -                                                        |
|    <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#QueueTrigger" target="_blank">Queue</a>    |      <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#QueueOutput" target="_blank">Queue</a>     |                                                        -                                                        |
|     <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#BlobTrigger" target="_blank">Blob</a>     |       <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#BlobOutput" target="_blank">Blob</a>      |     <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#BlobInput" target="_blank">Blob</a>     |
|                                                         -                                                         | <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#TwilioSmsOutput" target="_blank">Twilio SMS</a> |                                                        -                                                        |
| <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#CosmosDBTrigger" target="_blank">Cosmos DB</a> |   <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#CosmosDBOutput" target="_blank">Cosmos DB</a>  | <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#CosmosDBInput" target="_blank">Cosmos DB</a> |
|    <a href="https://central.ballerina.io/ballerinax/azure_functions/latest#TimerTrigger" target="_blank">Timer</a>    |                                                          -                                                          |                                                        -                                                        |

Follow the instructions in the sections below to deploy a Ballerina function in Azure Functions.

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

   - Runtime stack - `Java 21`
   - Hosting operating system - `Windows` (Currently, Linux is not supported in Azure by default for custom handlers.)

### Create the function

You can write Azure functions that use different triggers to invoke the function, and output bindings to generate the response based on your use case.

>**Info:** For examples of creating Azure functions, see [Examples](#examples).

### Build the function

The Azure Functions functionality is implemented as a compiler extension. Therefore, artifact generation happens automatically when you build a Ballerina module by executing the command below.

```
$ bal build --cloud="azure_functions"
```

### Deploy the function

To deploy the function, execute the command, which you get in the CLI output logs after you [build the function](#build-the-function). For examples, see [Examples](#examples).

>**Note:** When you are deploying, make sure to replace the `<function_app_name>` placeholder with the app name of the [created function](#create-the-function).


### Azure Functions as a native executable

You can use Azure Functions in the [native approach of Ballerina](/learn/build-the-executable-in-a-container/).

#### Set up the prerequisites

Follow the steps below to set up the prerequisites, which are specifically required to follow the native approach.

1. Set up the [general prerequisites](#set-up-azure-functions).
2. Install and configure [Docker](https://www.docker.com/) in your machine.
3. Install and configure [GraalVM](https://www.graalvm.org/) in your machine.

#### Create the app

Create an <a href="https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal" target="_blank">Azure Function app</a> with the given resource group with the following requirements.
- Runtime stack - `Java 21`
- Hosting operating system - `Linux` (As of now, Ballerina Azure functions native support is only available for Linux.)

#### Create the function

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

### CI/CD with Azure Function

This GitHub Action workflow automates the continuous integration and continuous deployment (CI/CD) process for a Ballerina project.
It is triggered by every push to the repository and automatically builds the project.

```yaml
name: Ballerina CI/CD with Azure Functions

on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the Repository
      - name: Checkout
        uses: actions/checkout@v2

      # Step 2: Build the Ballerina Application
      - name: Build Ballerina Application
        run: bal build

      # Step 3: Set up Azure Functions Core Tools
      - name: Set up Azure Functions Core Tools
        uses: philippelemaire/install-azure-functions-core-tools@v1

      # Step 4: Deploy to Azure Functions
      - name: Azure Functions Action
        uses: Azure/functions-action@v1
        with:
          app-name: 'your-function-app-name'
          package: './'
        env:
          AZURE_FUNCTIONAPP_PUBLISH_PROFILE: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}

      # Optional: Test the Azure Function
      - name: Invoke Azure Function
        run: |
          curl https://your-function-app-name.azurewebsites.net/api/your-function-name
```
- **Step 01:** The push event can initiate a build and deployment process
- **Step 02:** This step compiles the Ballerina application to generate an executable JAR file. The `bal build` command compiles the code and packages it, making it ready for deployment.
- **Step 03:** Install the Azure Functions Core Tools, which are necessary for deploying and testing Azure Functions in this GitHub Actions environment.
- **Step 04:** Deploy the built Ballerina application to an Azure Function App. This step uploads the packaged function to Azure and configures it for serverless execution.

### Examples

For examples of the usage of Azure Functions, see [Azure Functions](/learn/by-example/#azure-functions).