---
layout: ballerina-cloud-left-nav-pages-swanlake
title: AWS Lambda
description: Learn how to write and deploy AWS Lambda functions using ballerina
keywords: ballerina, programming language, serverless, cloud, aws, lambda, cloud native
permalink: /learn/run-ballerina-programs-in-the-cloud/function-as-a-service-with-ballerina/aws-lambda/
active: aws-lambda
intro: The AWS Lambda extension provides the functionality to expose a Ballerina function as an AWS Lambda function.
---

## Prerequisites
* Install the latest Ballerina distribution.
* Install the <a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" target="_blank">AWS CLI</a>.
* Go to <a href="https://console.aws.amazon.com/iam/home?#/users" target="_blank">users</a>, and click **Add User**.
* Enter the username, enable programmatic access, and make sure the user has the `AWSLambda_FullAccess` or higher permissions.
* Configure the <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html" target="_blank">AWS CLI</a> using the access key and secret generated in the user creation.
* Go to <a href="https://console.aws.amazon.com/iamv2/home#/roles" target="_blank">roles</a>, and create a role that has the `AWSLambdaBasicExecutionRole` or higher permissions.
* Go to the newly created role, and copy the role ARN to use when the Lambda function is being deployed.

## Supported triggers
An AWS Lambda function can be triggered by various AWS services. You can find the list of supported notification types below.
- Direct Invocation
- Simple Queue Service <a href="https://aws.amazon.com/sqs/" target="_blank">SQS</a>
- Simple Storage Service <a href="https://aws.amazon.com/s3/" target="_blank">S3</a>
- <a href="https://aws.amazon.com/dynamodb/" target="_blank">DynamoDB</a>
- Simple Email Service <a href="https://aws.amazon.com/ses//" target="_blank">SES</a>
- <a href="https://aws.amazon.com/api-gateway/" target="_blank">API Gateway</a>

## Write the function

The following Ballerina code gives an example of how to expose a simple echo function in AWS Lambda. 

Create a Ballerina package.
```
$ bal new aws_lambda_deployment
```
Replace the contents of the generated `.bal` file with the following content.

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

The AWS Lambda functionality is implemented as a compiler extension. Thus, artifact generation happens automatically when you build a Ballerina module. 

Execute the command below to build the above code. 

```
$ bal build
Compiling source
	wso2/aws_lambda_deployment:0.1.0

Generating executables
	@awslambda:Function: echo

        Run the following command to deploy each Ballerina AWS Lambda function:
        aws lambda create-function --function-name $FUNCTION_NAME --zip-file fileb://<package_dir>/target/bin/aws-ballerina-lambda-functions.zip --handler aws_lambda_deployment.$FUNCTION_NAME --runtime provided --role $LAMBDA_ROLE_ARN --layers arn:aws:lambda:$REGION_ID:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10

        Run the following command to re-deploy an updated Ballerina AWS Lambda function:
        aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://<package_dir>/target/bin/aws-ballerina-lambda-functions.zip
        target/bin/aws_lambda_deployment.jar
```

## Deploy the function

Ballerina's AWS Lambda functionality is implemented as a custom AWS Lambda layer. As shown in the above instructions' output, this information is provided when the function is created. The compiler generates the `aws-ballerina-lambda-functions.zip` file, which encapsulates all the AWS Lambda functions that are generated. This ZIP file can be used with the AWS web console or the <a href="https://docs.aws.amazon.com/codedeploy/latest/userguide/getting-started-configure-cli.html" target="_blank">AWS CLI</a> to deploy the functions. 

**Info:** When you are deploying, make sure to replace the `$LAMBDA_ROLE_ARN` placeholder with the role ARN you copied in the prerequisites.

Execute the command below to deploy the echo function as an AWS Lambda as shown below. 

>**Info:**  For the supported parameters, go to the <a href="https://docs.aws.amazon.com/cli/latest/reference/lambda/create-function.html" target="_blank">`create-function` documentation</a>. You might need to change parameters such as the `MemorySize` and `Timeout` depending on your application and connection speed. 

```
$ aws lambda create-function --function-name echo --zip-file fileb://<package_dir>/target/bin/aws-ballerina-lambda-functions.zip --handler aws_lambda_deployment.echo --runtime provided --role arn:aws:iam::908363916138:role/lambda-role --layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6

{
    "FunctionName": "echo",
    "FunctionArn": "arn:aws:lambda:us-west-1:908363916138:aws_lambda_deployment:echo",
    "Runtime": "provided",
    "Role": "arn:aws:iam::908363916138:role/lambda-role",
    "Handler": "aws_lambda_deployment.echo",
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

## Invoke the function

Execute the command below to test the deployed AWS Lambda function by invoking it directly using the CLI. 

>**Info:** The payload should be a valid JSON object.

```
$ echo '{"MESSAGE":"HELLO"}' > input.json
$ aws lambda invoke --function-name echo --payload fileb://input.json echo-response.txt
{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}
```

Execute the command below to view the response in the `echo-response.txt` file.

```
$ cat echo-response.txt

{"MESSAGE":"HELLO"}
```

To check the logs of the execution, go to the `echo` lambda function in the portal, and then click on the **Monitor** tab and the **Logs** button.

## More samples

### S3 trigger
This sample creates a function, which will be executed for each object creation in AWS S3.

```ballerina
import ballerina/io;
import ballerinax/awslambda;

@awslambda:Function
public function notifyS3(awslambda:Context ctx,
        awslambda:S3Event event) returns json {
    io:println(event.Records[0].s3.'object.key);
    return event.Records[0].s3.'object.key;
}
```

Now, you can build and deploy the function as in the previous sample.
To invoke this function, create an S3 bucket in AWS.
1. Go to <a href="https://s3.console.aws.amazon.com/s3/" target="_blank">AWS S3</a> portal and create a bucket.
2. Click on the created bucket, go to the **Properties** tab, and click on the **Create event notification** under the **Event notifications** section.
3. Enable `All object create events` under event types. Select the Lambda function as the destination, and choose the `notifyS3` Lambda function from the dropdown.

Now, click **Upload** to upload an object to the S3 bucket, and view the Lambda logs via CloudWatch to see the object name.

### DynamoDB trigger
This sample creates a function, which will be executed for each entry added to a database in the DynamoDB.

```ballerina
import ballerina/io;
import ballerinax/awslambda;

@awslambda:Function
public function notifyDynamoDB(awslambda:Context ctx,
        awslambda:DynamoDBEvent event) returns json {
    io:println(event.Records[0].dynamodb.Keys.toString());
    return event.Records[0].dynamodb.Keys.toString();
}
```
Now, you can build and deploy the function as in the previous sample.
To invoke this function, create a DynamoDB table.
1. Go to <a href="https://console.aws.amazon.com/iamv2/home#/roles" target="_blank">**roles**</a>, and add `AWSLambdaDynamoDBExecutionRole` to the created role in the prerequisites.
2. Go to the <a href="https://us-west-1.console.aws.amazon.com/dynamodbv2" target="_blank">DynamoDB</a>.
3. Click **Create Table**, enter the table name, partition key, and create the table (If you already have a table created, you can skip this step).
4. Click on the DynamoDB table, and then click the **Exports and streams** tab.
5. Click **enable DynamoDB stream details**, and select the key attributes only for the event type.
6. Once it's enabled, click **Create a trigger**, select the `notifyDynamoDB` from the dropdown, and create a trigger.

Now, add an entry to the DynamoDB table to invoke the Lambda function. For this, go to <a href="https://us-west-1.console.aws.amazon.com/dynamodbv2" target="_blank">**Items**</a> in the DynamoDB, select the table, and click **Create item**. Once the item is entered into the table, go to the Lambda function, and check the logs via CloudWatch to see the object identifier in the logs.


>**Note:** In a more practical scenario, the AWS Lambda functions will be used by associating them to an external event source such as Amazon DynamoDB or Amazon SQS. For more information on this, go to <a href="https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html" target="_blank">AWS Lambda event source mapping documentation</a>.

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
