---
layout: ballerina-cloud-left-nav-pages-swanlake
title: AWS Lambda
description: Learn how to write and deploy AWS Lambda functions using ballerina
keywords: ballerina, programming language, serverless, cloud, AWS, Lambda, Cloud Native
permalink: /learn/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/aws-lambda/
active: aws-lambda
intro: The AWS Lambda extension provides the functionality to expose a Ballerina function as an AWS Lambda function.
redirect_from:
  - /learn/deployment/aws-lambda
  - /swan-lake/learn/deployment/aws-lambda/
  - /swan-lake/learn/deployment/aws-lambda
  - /learn/deployment/aws-lambda/
  - /learn/deployment/aws-lambda
  - /learn/user-guide/deployment/aws-lambda
  - /learn/user-guide/deployment/aws-lambda/
  - /learn/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/aws-lambda
  - /learn/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/
  - /learn/running-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina
---

## Prerequisites
* Ballerina latest distrubution
* Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* Go to [users](https://console.aws.amazon.com/iam/home?#/users) and click add user.
* Enter username, enable progamatic access and make sure the user has AWSLambda_FullAccess or higher permissions.
* Configure AWS CLI (https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) using the acess key and secret generated in the user creation.
* Go to [roles] (https://console.aws.amazon.com/iamv2/home#/roles ) and create role that has AWSLambdaBasicExecutionRole or higher permission.
* Go to the newly created role and copy the role arn to use when lambda function is being deployed.

## Supported Triggers
AWS lambda function can be triggered by various AWS services. You can find the list of supported notification types below.
- Direct invocation
- Simple Queue Service [SQS] (https://aws.amazon.com/sqs/)
- Simple Storage Service [S3] (https://aws.amazon.com/s3/)
- [DynamoDB] (https://aws.amazon.com/dynamodb/)
- Simple Email Service [SES] (https://aws.amazon.com/ses/)
- [API Gateway] (https://aws.amazon.com/api-gateway/)

## Writing a Function

The following Ballerina code gives an example on how to expose a simlpe echo function in AWS Lambda. 

```ballerina
import ballerina/log;
import ballerinax/awslambda;

@awslambda:Function
public function echo(awslambda:Context ctx, json input) returns json {
   log:printInfo(input.toJsonString());
   return input;
}
```

Functions annoted as @awslambda:Function should always have the first parameter with the [awslambda:Context](https://lib.ballerina.io/ballerinax/awslambda/latest/classes/Context) object contains the information and operations related to the current function execution in AWS Lambda such as the request ID and the remaining execution time. 

The second parameter with the `json` value contains the input request data. This input value format will vary depending on the source, which invoked the function (e.g., an AWS S3 bucket update event). The return type of the function is `json`. When the function is triggered by the event, the function body executes and it simply logs the input json and returns the json.

## Building the Function

The AWS Lambda functionality is implemented as a compiler extension. Thus, the artifact generation happens automatically when you build a Ballerina module. 

Execute the command below to build the above code. 

```bash
$ bal build functions.bal 
Compiling source
	functions.bal

Generating executables
	functions.jar
	@awslambda:Function: echo

        Run the following command to deploy each Ballerina AWS Lambda function:
        aws lambda create-function --function-name $FUNCTION_NAME --zip-file fileb:///aws-ballerina-lambda-functions.zip --handler functions.$FUNCTION_NAME --runtime provided --role $LAMBDA_ROLE_ARN --layers arn:aws:lambda:$REGION_ID:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10

        Run the following command to re-deploy an updated Ballerina AWS Lambda function:
        aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://aws-ballerina-lambda-functions.zip
        functions.jar
```

## Deploying the Function

Ballerina's AWS Lambda functionality is implemented as a custom AWS Lambda layer. As shown in the above instructions output, this information is provided when the function is created. The compiler generates the `aws-ballerina-lambda-functions.zip` file, which encapsulates all the AWS Lambda functions that are generated. This ZIP file can be used with the AWS web console, or the [AWS CLI](https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-configure-cli.html) to deploy the functions. When you are deploying, make sure to replace the $LAMBDA_ROLE_ARN placeholder wit the role arn you copied in prerequisites.

Execute the command below to deploy the echo function as an AWS Lambda is shown below. 

>**Info:** Please visit [create-function documentation] (https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html) to see supported parameters. You might need to change parameters such as memory-size and timeout depending your application and connection speed. 

```bash
$ aws lambda create-function --function-name echo --zip-file fileb://aws-ballerina-lambda-functions.zip --handler functions.echo --runtime provided --role arn:aws:iam::908363916138:role/lambda-role --layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6

{
    "FunctionName": "echo",
    "FunctionArn": "arn:aws:lambda:us-west-1:908363916138:functions:echo",
    "Runtime": "provided",
    "Role": "arn:aws:iam::908363916138:role/lambda-role",
    "Handler": "functions.echo",
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
            "Arn": "arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6",
            "CodeSize": 697
        }
    ]
}
```

## Invoking the Function

Execute the command below to test the deployed AWS Lambda function by invoking it directly using the CLI. 

>**Info:** The payload should be a valid JSON object.

```bash
$ echo '{"MESSAGE":"HELLO"}' > input.json
$ aws lambda invoke --function-name echo --payload fileb://input.json echo-response.txt
{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}
```

Execute the command below to view the response in the `echo-response.txt` file.

```bash
$ cat echo-response.txt

{"MESSAGE":"HELLO"}
```

If you want to check the logs of the execusion, you have to go to `echo` lambda function in the portal then click on Monitor tab and Logs button.

## More Samples

### S3 Trigger
In this sample we will be creating a function that will be executed for each object creation in AWS S3.

```ballerina
import ballerinax/awslambda;

@awslambda:Function
public function notifyS3(awslambda:Context ctx, 
                         awslambda:S3Event event) returns json {
                            io:println (event.Records[0].s3.'object.key);
    return event.Records[0].s3.'object.key;
}
```

Now you can build and deploy the function as we did in previous sample.
In order for us to invoke this function, we need to create a s3 bucket in AWS.
1. Go to [AWS S3 Page](https://s3.console.aws.amazon.com/s3/) in the portal and create a bucket
2. Click on the created bucket and go to Properties tab and click on Create event notification under Event notifications section.
3. Enable `All object create events under` event types. Select Lambda function as the destination and choose the notifyS3 lambda function from the dropdown.

Now we can click on `Upload` to upload a object to the s3 bucket and view the lambda logs via cloudwatch to see the object name.

### DynamoDB Trigger
In this sample we will be created a function that will be executed for each entry added to a database in the DynamoDB.

```ballerina
import ballerinax/awslambda;

@awslambda:Function
public function notifyDynamoDB(awslambda:Context ctx, 
                               awslambda:DynamoDBEvent event) returns json {
                                  io:println (event.Records[0].dynamodb.Keys.toString());
    return event.Records[0].dynamodb.Keys.toString();
}
```
Now you can build and deploy the function as we did in previous sample.
In order for us to invoke this function, we need to create a dynamodb table first.
1. Go to [roles] (https://console.aws.amazon.com/iamv2/home#/roles ) and add AWSLambdaDynamoDBExecutionRole to the created role in the prerequisites.
2. Go to [DynamoDB](https://us-west-1.console.aws.amazon.com/dynamodbv2) 
3. Click on Create Table and enter the table name, partition key and create the table. If you already have a table you can skip this step.
4. Click on the dynamodb table and go exports and streams tab.
5. Click on enable DynamoDB stream details and select Key attributes only for the event type.
6. Once its enabled, Click on Create a trigger, select the `notifyDynamoDB` from the dropdown and create trigger.

Now we can add an entry to dynamodb table to invoke our lambda function. We can go to [Items](https://us-west-1.console.aws.amazon.com/dynamodbv2) in dynamodb, select the table and click Create item. Once the item is entered in to the table you can go to the lambda function and check logs via cloudwatch to see the object identifier in the logs.

## What's Next?

In a more practical scenario, the AWS Lambda functions will be used by associating them to an external event source such as Amazon DynamoDB or Amazon SQS. For more information on this, go to [AWS Lambda event source mapping documentation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html).

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
