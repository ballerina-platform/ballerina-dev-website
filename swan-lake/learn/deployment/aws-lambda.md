---
layout: ballerina-left-nav-pages-swanlake
title: AWS Lambda
description: See how the Ballerina deployment in AWS Lambda works
keywords: ballerina, programming language, serverless, cloud, AWS, Lambda
permalink: /swan-lake/learn/deployment/aws-lambda/
active: aws-lambda
intro: The AWS Lambda extension provides the functionality to expose a Ballerina function as an AWS Lambda function.
redirect_from:
  - /swan-lake/learn/deployment/aws-lambda
---

Exposing a Ballerina function as an AWS Lambda function is done by importing the `ballerinax/awslambda` module and simply annotating the Ballerina function with the `awslambda:Function` annotation. Also, the Ballerina function must have the following signature: `function (awslambda:Context, json) returns json|error`. 

## Writing a Function

The following Ballerina code gives an example on how to expose a function in AWS Lambda, which generates a SHA256 hash from the given input. 

```ballerina
import ballerinax/awslambda;
import ballerina/crypto;

@awslambda:Function
public function hash(awslambda:Context ctx, json input) returns json|error {
    return crypto:hashSha256(input.toJsonString().toBytes()).toBase16();
}
```

The first parameter with the [awslambda:Context](/swan-lake/learn/api-docs/ballerina/awslambda/classes/Context.html) object contains the information and operations related to the current function execution in AWS Lambda such as the request ID and the remaining execution time. 

The second parameter with the `json` value contains the input request data. This input value format will vary depending on the source, which invoked the function e.g., an AWS S3 bucket update event. The return type of the function is `json|error`, which means in a successful scenario, the function can return a `json` value with the response or else in an error situation, the function will return an `error` value, which provides information on the error to the system.

## Building the Function

The AWS Lambda functionality is implemented as a compiler extension. Thus, the artifact generation happens automatically when you build a Ballerina module. Let's see how this works by building the above code. 

```bash
$ ballerina build functions.bal 
Compiling source
	functions.bal

Generating executables
	functions.jar
	@awslambda:Function: hash

	Run the following commands to deploy each Ballerina AWS Lambda function:
	aws lambda create-function --function-name <FUNCTION_NAME> --zip-file fileb://aws-ballerina-lambda-functions.zip --handler functions.<FUNCTION_NAME> --runtime provided --role <LAMBDA_ROLE_ARN> --timeout 10 --memory-size 1024
	aws lambda update-function-configuration --function-name <FUNCTION_NAME> --layers arn:aws:lambda:<REGION_ID>:134633749276:layer:ballerina-jre11:1

	Run the following command to re-deploy an updated Ballerina AWS Lambda function:
	aws lambda update-function-code --function-name <FUNCTION_NAME> --zip-file fileb://aws-ballerina-lambda-functions.zip
```

## Deploying the Function

Ballerina's AWS Lambda functionality is implemented as a custom AWS Lambda layer. As shown in the above instructions output, this information is provided when the function is created. The compiler generates the `aws-ballerina-lambda-functions.zip` file, which encapsulates all the AWS Lambda functions that are generated. This ZIP file can be used with the AWS web console, or the [AWS CLI](https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-configure-cli.html) to deploy the functions. An [AWS Lambda Role ](https://console.aws.amazon.com/iam/home?#/roles) for the user must be created with the `AWSLambdaBasicExecutionRole` permission in order to deploy the AWS Lambda functions. The created AWS Lambda Role ARN is required when deploying the functions through the CLI. 

A sample execution to deploy the hash function as an AWS Lambda is shown below. 

```bash
$ aws lambda create-function --function-name hash --zip-file fileb://aws-ballerina-lambda-functions.zip --handler functions.hash --runtime provided --role arn:aws:iam::908363916138:role/lambda-role --layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:1
{
    "FunctionName": "hash",
    "FunctionArn": "arn:aws:lambda:us-west-1:908363916138:function:hash",
    "Runtime": "provided",
    "Role": "arn:aws:iam::908363916138:role/lambda-role",
    "Handler": "functions.hash",
    "CodeSize": 22160569,
    "Description": "",
    "Timeout": 3,
    "MemorySize": 128,
    "LastModified": "2020-07-14T06:54:41.647+0000",
    "CodeSha256": "zXHpr2VC8Anauvox1dD8MichiH/55wKkY7RtaUe21dM=",
    "Version": "$LATEST",
    "TracingConfig": {
        "Mode": "PassThrough"
    },
    "RevisionId": "d5400f01-f3b8-478b-9269-73c44f4537aa",
    "Layers": [
        {
            "Arn": "arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:1",
            "CodeSize": 697
        }
    ]
}
```

## Invoking the Function

The deployed AWS Lambda function can be tested by invoking it directly using the CLI. 

```bash
$ aws lambda invoke --function-name hash --payload '{"x":5}' response.txt 
{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}

$ cat response.txt 
"dd9446a11b2021b753a5df48d11f339055375b59cd81d7559d36b652aaff849d"
```

## What's Next?

In a more practical scenario, the AWS Lambda functions will be used by associating them to an external event source such as Amazon DynamoDB or Amazon SQS. For more information on this, go to [AWS Lambda event source mapping documentation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html).
