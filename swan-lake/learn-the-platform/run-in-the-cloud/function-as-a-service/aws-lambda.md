---
layout: ballerina-cloud-left-nav-pages-swanlake
title: AWS Lambda
description: Learn how to write and deploy AWS Lambda functions using Ballerina.
keywords: ballerina, programming language, serverless, cloud, aws, lambda, cloud native
permalink: /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/aws-lambda/
active: aws-lambda
intro: The AWS Lambda extension provides the functionality to expose a Ballerina function as an AWS Lambda function.
---

## Supported triggers
An AWS Lambda function can be triggered by various AWS services. You can find the list of supported notification types below.

- Direct Invocation
- Simple Queue Service <a href="https://aws.amazon.com/sqs/" target="_blank">SQS</a>
- Simple Storage Service <a href="https://aws.amazon.com/s3/" target="_blank">S3</a>
- <a href="https://aws.amazon.com/dynamodb/" target="_blank">DynamoDB</a>
- Simple Email Service <a href="https://aws.amazon.com/ses//" target="_blank">SES</a>
- <a href="https://aws.amazon.com/api-gateway/" target="_blank">API Gateway</a>

## Set up the prerequisites

Set up the prerequisites below to work with AWS Lambda functions using Ballerina.

### Set up Ballerina

Install the [latest Ballerina distribution](https://ballerina.io/downloads/).

### Set up AWS 

Install the <a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" target="_blank">AWS CLI</a>.

### Set up an AWS account

Follow the steps below to set up an AWS account.

1. [Create an AWS account](https://aws.amazon.com/getting-started/guides/setup-environment/module-one/).

    >**Info:** For detailed instrucitons on creating an AWS account, see []().

2. [Sign in to the AWS account](https://docs.aws.amazon.com/SetUp/latest/UserGuide/setup-prereqs-instructions.html) you created.

    >**Info:** For detailed instrucitons on creating an AWS account, see []().

### Create a user

Follow the steps below to create a new user in your AWS account.

1. [Create a new AWS user and set the permissions](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-create). 

    >**Info:** Enter the username, enable programmatic access, and make sure the user has the `AWSLambda_FullAccess` or higher permissions. For detailed instrucitons on creating an AWS account, see []().

2. [Obtain the access keys](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-get).

3. Configure the <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html" target="_blank">AWS CLI</a> using the access key and secret generated in the user creation.

    >**Info:** For detailed instrucitons on creating an AWS account, see [](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-configure.title).

### Create a role

Follow the steps below to create a new role in your AWS account.

1. [Create the role and set the permissions](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html#roles-creatingrole-user-console).

    >**Info:** The role should have the `AWSLambdaBasicExecutionRole` or higher permissions. For detailed instrucitons on creating an AWS account, see []().

2. Access the newly created role in the AWS Console, and copy the role ARN to use when the Lambda function is being deployed.

## Write the function

The following Ballerina code gives an example of how to expose a simple echo function in AWS Lambda. 

```ballerina
import ballerina/log;
import ballerinax/awslambda;

@awslambda:Function
public function echo(awslambda:Context ctx, json input) returns json {
    log:printInfo(input.toJsonString());
    return input;
}
```

Functions annotated as `@awslambda:Function` should always have the first parameter with the <a href="https://lib.ballerina.io/ballerinax/awslambda/latest#Context" target="_blank">`awslambda:Context`</a>object, which contains the information and operations related to the current function execution in AWS Lambda such as the request ID and the remaining execution time. 

The second parameter with the `json` value contains the input request data. This input value format will vary depending on the source, which invoked the function (e.g., an AWS S3 bucket update event). The return type of the function is `json`. When the function is triggered by the event, the function body executes and it simply logs the input JSON and returns the JSON.

## Build the function

The AWS Lambda functionality is implemented as a compiler extension. Thus, artifact generation happens automatically when you build a Ballerina module using the `bal build` command.

## Deploy the function

Ballerina's AWS Lambda functionality is implemented as a custom AWS Lambda layer. This information is provided when the function is created. The compiler generates the `aws-ballerina-lambda-functions.zip` file, which encapsulates all the AWS Lambda functions that are generated. This ZIP file can be used with the AWS web console or the <a href="https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-configure-cli.html" target="_blank">AWS CLI</a> to deploy the functions. 

**Info:** When you are deploying, make sure to replace the `$FREGION`, `$FUNCTION_NAME` and `$LAMBDA_ROLE_ARN` placeholders with the corresponding values you obtained when [setting up the prerequisites](#set-up-the-prerequisites).

>**Info:**  For the supported parameters, go to the <a href="https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html" target="_blank">`create-function` documentation</a>. You might need to change parameters such as the `MemorySize` and `Timeout` depending on your application and connection speed. 

## Invoke the function

The deployed AWS Lambda function can be tested by invoking it directly using the CLI. 

>**Info:** To check the logs of the execution, navigate the AWS Lambda function in the portal, and then click on the **Monitor** tab and the **Logs** button.

## Learn more

>**Note:** In a more practical scenario, the AWS Lambda functions will be used by associating them to an external event source such as Amazon DynamoDB or Amazon SQS. For more information on this, go to <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html" target="_blank">AWS Lambda event source mapping documentation</a>.

For examples on using AWS Lambda functions, see the below.

- [Hello world](/learn/by-example/aws-lambda-hello-world/)
- [Context execution](/learn/by-example/aws-lambda-context-execution/)
- [S3 trigger](/learn/by-example/aws-lambda-s3-trigger/)
- [DynamoDB trigger](/learn/by-example/aws-lambda-dynamodb-trigger/)

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
