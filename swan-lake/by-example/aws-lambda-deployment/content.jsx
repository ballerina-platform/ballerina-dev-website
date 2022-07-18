import React, { useState, useEffect, createRef } from "react";
import { setCDN } from "shiki";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import {
  copyToClipboard,
  extractOutput,
  shikiTokenizer,
} from "../../../utils/bbe";
import Link from "next/link";

setCDN("https://unpkg.com/shiki/");

const codeSnippetData = [
  `import ballerinax/awslambda;
import ballerina/uuid;
import ballerina/io;

// The \`@awslambda:Function\` annotation marks a function to
// generate an AWS Lambda function
@awslambda:Function
public function echo(awslambda:Context ctx, json input) returns json {
   return input;
}

@awslambda:Function
public function uuid(awslambda:Context ctx, json input) returns json {
   return uuid:createType1AsString();
}

// The \`awslambda:Context\` object contains request execution
// context information
@awslambda:Function
public function ctxinfo(awslambda:Context ctx, json input) returns json|error {
   json result = { RequestID: ctx.getRequestId(),
                   DeadlineMS: ctx.getDeadlineMs(),
                   InvokedFunctionArn: ctx.getInvokedFunctionArn(),
                   TraceID: ctx.getTraceId(),
                   RemainingExecTime: ctx.getRemainingExecutionTime() };
   return result;
}

@awslambda:Function
public function notifySQS(awslambda:Context ctx, 
                          awslambda:SQSEvent event) returns json {
    return event.Records[0].body;
}

@awslambda:Function
public function notifyS3(awslambda:Context ctx, 
                         awslambda:S3Event event) returns json {
    return event.Records[0].s3.'object.key;
}

@awslambda:Function
public function notifyDynamoDB(awslambda:Context ctx, 
                               awslambda:DynamoDBEvent event) returns json {
    return event.Records[0].dynamodb.Keys.toString();
}

@awslambda:Function
public function notifySES(awslambda:Context ctx, 
                          awslambda:SESEvent event) returns json {
    return event.Records[0].ses.mail.commonHeaders.subject;
}

@awslambda:Function
public function apigwRequest(awslambda:Context ctx, 
                             awslambda:APIGatewayProxyRequest request) {
    io:println("Path: ", request.path);
}`,
];

export default function AwsLambdaDeployment() {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [codeSnippets, updateSnippets] = useState([]);
  const [btnHover, updateBtnHover] = useState([false, false]);

  useEffect(() => {
    async function loadCode() {
      for (let snippet of codeSnippetData) {
        const output = await shikiTokenizer(snippet, "ballerina");
        updateSnippets((prevSnippets) => [...prevSnippets, output]);
      }
    }
    loadCode();
  }, []);

  return (
    <Container className="d-flex flex-column h-100">
      <h1>AWS Lambda</h1>

      <p>AWS Lambda is an event driven, serverless computing platform.</p>

      <p>Ballerina functions can be deployed in AWS Lambda by annotating</p>

      <p>
        a Ballerina function with &quot;@awslambda:Function&quot;, which should
        have
      </p>

      <p>
        the function signature{" "}
        <code>
          function (awslambda:Context, json|EventType) returns json|error
        </code>
        .&lt;br/&gt;&lt;br/&gt;
      </p>

      <p>
        For more information, see the{" "}
        <a href="https://ballerina.io/learn/deployment/aws-lambda/">
          AWS Lambda Deployment Guide
        </a>
        .
      </p>

      <Row
        className="bbeCode mx-0 px-2 py-0 rounded"
        style={{ marginLeft: "0px" }}
      >
        <Col sm={10}>
          {codeSnippets[0] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[0]),
              }}
            />
          )}
        </Col>
        <Col className="d-flex align-items-start pt-2" sm={2}>
          <button
            className="btn rounded ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.1.1/examples/aws-lambda-deployment",
                "_blank"
              );
            }}
            aria-label="Edit on Github"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#000"
              className="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </button>
          {codeClick1 ? (
            <button
              className="btn rounded"
              disabled
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#45FF00"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="btn rounded"
              onClick={() => {
                updateCodeClick1(true);
                copyToClipboard(codeSnippetData[0]);
                setTimeout(() => {
                  updateCodeClick1(false);
                }, 3000);
              }}
              aria-label="Copy to Clipboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#000"
                className="bi bi-clipboard"
                viewBox="0 0 16 16"
              >
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
      </Row>

      <br />

      <Row className="bbeOutput mx-0 px-2 rounded">
        <Col className="my-2" sm={10}>
          <pre className="m-0" ref={ref1}>
            <code className="d-flex flex-column">
              <span>{`# Prerequisites: AWS CLI tools installation and configuration. Visit [AWS Lambda Deployment Guide](https://ballerina.io/learn/deployment/aws-lambda/) for detailed steps.`}</span>
              <span>{``}</span>
              <span>{`# Create a ballerina package and replace the contents of the generated bal file with the contents above.`}</span>
              <span>{`bal new aws_lambda_deployment`}</span>
              <span>{``}</span>
              <span>{`# Build the Ballerina program to generate the AWS Lambda functions`}</span>
              <span>{`\$ bal build`}</span>
              <span>{`Compiling source`}</span>
              <span>{`	wso2/aws_lambda_deployment:0.1.0`}</span>
              <span>{``}</span>
              <span>{`Generating executables`}</span>
              <span>{`	@awslambda:Function: echo, uuid, ctxinfo, notifySQS, notifyS3`}</span>
              <span>{``}</span>
              <span>{`	Run the following command to deploy each Ballerina AWS Lambda function:`}</span>
              <span>{`	aws lambda create-function --function-name \$FUNCTION_NAME --zip-file fileb://<project_dir>/target/bin/aws-ballerina-lambda-functions.zip --handler aws_lambda_deployment.\$FUNCTION_NAME --runtime provided --role \$LAMBDA_ROLE_ARN --layers arn:aws:lambda:\$REGION_ID:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
              <span>{``}</span>
              <span>{`	Run the following command to re-deploy an updated Ballerina AWS Lambda function:`}</span>
              <span>{`	aws lambda update-function-code --function-name \$FUNCTION_NAME --zip-file fileb://<project_dir>/target/bin/aws-ballerina-lambda-functions.zip`}</span>
              <span>{`    `}</span>
              <span>{`    target/bin/aws_lambda_deployment.jar`}</span>
              <span>{`# Execute the AWS CLI commands to create and publish the functions; and set your respective AWS \$LAMBDA_ROLE_ARN, \$REGION_ID, and \$FUNCTION_NAME values; following are some examples:-`}</span>
              <span>{`\$ aws lambda create-function --function-name echo --zip-file fileb://aws-ballerina-lambda-functions.zip --handler aws_lambda_deployment.echo --runtime provided --role arn:aws:iam::908363916111:role/lambda-role`}</span>
              <span>{` --layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
              <span>{`\$ aws lambda create-function --function-name uuid --zip-file fileb://aws-ballerina-lambda-functions.zip --handler aws_lambda_deployment.uuid --runtime provided --role arn:aws:iam::908363916111:role/lambda-role`}</span>
              <span>{` --layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
              <span>{`\$ aws lambda create-function --function-name ctxinfo --zip-file fileb://aws-ballerina-lambda-functions.zip --handler aws_lambda_deployment.ctxinfo --runtime provided --role arn:aws:iam::908363916111:role/lambda-role`}</span>
              <span>{` --layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
              <span>{``}</span>
              <span>{``}</span>
              <span>{`# Invoke the functions`}</span>
              <span>{`\$ echo '{"MESSAGE":"HELLO"}' > input.json`}</span>
              <span>{`\$ aws lambda invoke --function-name echo --payload fileb://input.json echo-response.txt`}</span>
              <span>{`{`}</span>
              <span>{`    "ExecutedVersion": "\$LATEST", `}</span>
              <span>{`    "StatusCode": 200`}</span>
              <span>{`}`}</span>
              <span>{`\$ cat echo-response.txt `}</span>
              <span>{`{"MESSAGE":"HELLO"}`}</span>
              <span>{``}</span>
              <span>{`\$ aws lambda invoke --function-name uuid uuid-response.txt`}</span>
              <span>{`{`}</span>
              <span>{`    "ExecutedVersion": "\$LATEST", `}</span>
              <span>{`    "StatusCode": 200`}</span>
              <span>{`}`}</span>
              <span>{`\$ cat uuid-response.txt `}</span>
              <span>{`"711cd328-1937-40cc-9078-c3628c6edb02"`}</span>
              <span>{``}</span>
              <span>{`\$ aws lambda invoke --function-name ctxinfo ctxinfo-response.txt`}</span>
              <span>{`{`}</span>
              <span>{`    "ExecutedVersion": "\$LATEST", `}</span>
              <span>{`    "StatusCode": 200`}</span>
              <span>{`}`}</span>
              <span>{`\$ cat ctxinfo-response.txt `}</span>
              <span>{`{"RequestID":"d55f7d06-f2ab-4b6e-8606-482607785a91", "DeadlineMS":1548069389978, "InvokedFunctionArn":"arn:aws:lambda:us-west-2:908363916138:function:ctxinfo", "TraceID":"Root=1-5c45aa03-f8aff4c9e24dc4fbf48f2990;Parent=17ad3b290def98fd;Sampled=0", "RemainingExecTime":9946}`}</span>
            </code>
          </pre>
        </Col>
        <Col sm={2} className="d-flex align-items-start">
          {outputClick1 ? (
            <button
              className="btn rounded ms-auto"
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#00FF19"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="btn rounded ms-auto"
              onClick={() => {
                updateOutputClick1(true);
                const extractedText = extractOutput(ref1.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick1(false);
                }, 3000);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#EEEEEE"
                className="output-btn bi bi-clipboard"
                viewBox="0 0 16 16"
                aria-label="Copy to Clipboard"
              >
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
      </Row>

      <br />

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Azure Functions"
            href="/learn/by-example/azure-functions-deployment"
          >
            <div className="btnContainer d-flex align-items-center me-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[0] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([true, false])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <div className="d-flex flex-column ms-4">
                <span className="btnPrev">Previous</span>
                <span
                  className={btnHover[0] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([true, false])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Azure Functions
                </span>
              </div>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
