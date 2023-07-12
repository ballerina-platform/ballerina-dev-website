---
layout: ballerina-cloud-left-nav-pages-swanlake
title: AWS Lambda
description: AWS Lambda is an event driven, serverless computing platform. The AWS Lambda extension provides the functionality to write AWS Lambda-compatible packages by exposing a Ballerina function as an AWS Lambda function.
keywords: ballerina, programming language, serverless, cloud, aws, lambda, cloud native
permalink: /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/aws-lambda/
active: aws-lambda
intro: AWS Lambda is an event driven, serverless computing platform. The AWS Lambda extension provides the functionality to write AWS Lambda-compatible packages by exposing a Ballerina function as an AWS Lambda function.
---

The AWS Lambda extension provides the functionality to expose a Ballerina function as an AWS Lambda function. Ballerina functions can be deployed in AWS Lambda by annotating a Ballerina function with `@awslambda:Function`. 

> **Note:** An AWS Lambda function always adheres to the following function signature: 
`function (awslambda:Context, json|EventType) returns json|error`

## Supported triggers

An AWS Lambda function can be triggered by various AWS services. You can find the list of supported notification types below.

- Direct Invocation
- Simple Queue Service <a href="https://aws.amazon.com/sqs/" target="_blank">SQS</a>
- Simple Storage Service <a href="https://aws.amazon.com/s3/" target="_blank">S3</a>
- <a href="https://aws.amazon.com/dynamodb/" target="_blank">DynamoDB</a>
- Simple Email Service <a href="https://aws.amazon.com/ses//" target="_blank">SES</a>
- <a href="https://aws.amazon.com/api-gateway/" target="_blank">API Gateway</a>

## Set up AWS

Follow the steps below to set an AWS account and the AWS CLI.

1. Install the <a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" target="_blank">AWS CLI</a>.

2. [Create](https://docs.aws.amazon.com/SetUp/latest/UserGuide/setup-AWSsignup.html) an AWS account and [sign in](https://docs.aws.amazon.com/SetUp/latest/UserGuide/setup-rootuser.html) to it.

## Create a user

Follow the steps below to create a new user in your AWS account.

1. Create a <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console" target="_blank">new AWS user</a>.

    >**Info:** Enter a username and enable access to the AWS Management Console.

2. <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console" target="_blank">Set the permissions</a> to the created user.

    >**Info:** Enable `AWSLambda_FullAccess` or higher permissions. 

3. Obtain the <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-get" target="_blank">access keys</a>.

4. Configure the <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-configure.title" target="_blank">AWS CLI</a> for the user by providing the access key and secret generated in the user creation.

## Create a role

Follow the steps below to create a new role in your AWS account.

1. Create a <a href="" target="_blank">new role</a>.

2. <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html#roles-creatingrole-user-console" target="_blank">Set the permissions</a> to the created role.

    >**Info:** Enable `AWSLambda_FullAccess` or higher permissions. 

3. Access the newly created role in the AWS Console, and copy the role ARN to use when the Lambda function is being deployed.

## Create the function

You can write AWS Lambda functions that use different triggers based on your use case. 

Functions annotated as `@awslambda:Function` should always have the first parameter with the <a href="https://lib.ballerina.io/ballerinax/awslambda/latest#Context" target="_blank">`awslambda:Context`</a>object, which contains the information and operations related to the current function execution in AWS Lambda such as the request ID and the remaining execution time. 

The second parameter with the `json` value contains the input request data. This input value format will vary depending on the source, which invoked the function (e.g., an AWS S3 bucket update event). The return type of the function is `json`. When the function is triggered by the event, the function body executes and it simply logs the input JSON and returns the JSON.

>**Info:** For examples, see [Learn more](#learn-more).

## Build the function

The AWS Lambda functionality is implemented as a compiler extension. Therefore, the artifact generation happens automatically when you build a Ballerina module by executing the command below.

```
$ bal build
```

## Deploy the function

The AWS Lambda functionality in Ballerina is implemented as a custom AWS Lambda layer. This information is provided when the function is created. The compiler generates the `aws-ballerina-lambda-functions.zip` file, which encapsulates all the AWS Lambda functions that are generated. This ZIP file can be used with the AWS web console or the <a href="https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-configure-cli.html" target="_blank">AWS CLI</a> to deploy the functions. 

To deploy the function, execute the command, which you get in the CLI output logs after you [build the function](#build-the-function). For examples, see [Learn more](#learn-more).

>**Info:** When you are deploying, make sure to replace the `$FUNCTION_NAME`, `$LAMBDA_ROLE_ARN`, and `$REGION_ID` placeholders with the corresponding values you obtained when [setting up the prerequisites](#set-up-the-prerequisites).

>**Tip:**  For the supported parameters, go to the <a href="https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html" target="_blank">`create-function` documentation</a>. You might need to change parameters such as the `MemorySize` and `Timeout` depending on your application and connection speed. 

## Examples

In a more practical scenario, the AWS Lambda functions will be used by associating them to an external event source such as Amazon DynamoDB or Amazon SQS. For more information on this, go to <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html" target="_blank">AWS Lambda event source mapping documentation</a>.

For examples of the usage of AWS Lambda functions, see the below.

- [Hello world](/learn/by-example/aws-lambda-hello-world/)
- [Context execution](/learn/by-example/aws-lambda-context-execution/)
- [S3 trigger](/learn/by-example/aws-lambda-s3-trigger/)
- [DynamoDB trigger](/learn/by-example/aws-lambda-dynamodb-trigger/)

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
