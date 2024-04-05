import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/io;
import ballerinax/aws.lambda;

@lambda:Function
public function dynamoDBTrigger(lambda:Context ctx,
        lambda:DynamoDBEvent event) returns json {
    io:println(event.Records[0].dynamodb.Keys.toString());
    return event.Records[0].dynamodb.Keys.toString();
}
`,
];

export function AwsLambdaDynamodbTrigger({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();
  const [outputClick3, updateOutputClick3] = useState(false);
  const ref3 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>AWS Lambda - DynamoDB trigger</h1>

      <p>
        This example creates a function, which will be executed for each entry
        added to a database in the{" "}
        <a href="https://aws.amazon.com/dynamodb/">DynamoDB</a>.
      </p>

      <p>
        For more information, see the{" "}
        <a href="https://ballerina.io/learn/aws-lambda/">
          AWS Lambda learn guide
        </a>
        .
      </p>

      <h2>Set up the prerequisites</h2>

      <p>
        For instructions, see{" "}
        <a href="https://ballerina.io/learn/aws-lambda/#set-up-the-prerequisites">
          Set up the prerequisites
        </a>
        .
      </p>

      <h2>Write the function</h2>

      <p>Follow the steps below to write the function.</p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>1.</span>
          <span>
            Execute the command below to create a new Ballerina package.
          </span>
        </li>
      </ul>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
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
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref1}>
            <code className="d-flex flex-column">
              <span>{`\$ bal new aws_lambda_dynamodb_trigger`}</span>
              <span>{`Created new package 'aws_lambda_dynamodb_trigger' at /Users/wso2/aws_lambda_dynamodb_trigger.`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>2.</span>
          <span>
            Replace the content of the generated Ballerina file with the content
            below.
          </span>
        </li>
      </ul>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          <button
            className="bg-transparent border-0 m-0 p-2 ms-auto"
            onClick={() => {
              window.open(
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.8.6/examples/aws-lambda-dynamodb-trigger",
                "_blank",
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
              <title>Edit on Github</title>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </button>
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2"
              disabled
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2"
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
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          {codeSnippets[0] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[0]),
              }}
            />
          )}
        </Col>
      </Row>

      <h2>Build the function</h2>

      <p>Execute the command below to generate the AWS Lambda artifacts.</p>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick2 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              onClick={() => {
                updateOutputClick2(true);
                const extractedText = extractOutput(ref2.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick2(false);
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
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref2}>
            <code className="d-flex flex-column">
              <span>{`\$ bal build`}</span>
              <span>{`Compiling source`}</span>
              <span>{`        wso2/aws_lambda_dynamodb_trigger:0.1.0`}</span>
              <span>{`
`}</span>
              <span>{`Generating executable`}</span>
              <span>{`        @awslambda:Function: dynamoDBTrigger`}</span>
              <span>{`
`}</span>
              <span>{`        Run the following command to deploy each Ballerina AWS Lambda function:`}</span>
              <span>{`        aws lambda create-function --function-name \$FUNCTION_NAME --zip-file fileb://<project-dir>/aws-lambda-s3-trigger/target/bin/aws-ballerina-lambda-functions.zip --handler aws-lambda-dynamodb-trigger.\$FUNCTION_NAME --runtime provided --role \$LAMBDA_ROLE_ARN --layers arn:aws:lambda:\$REGION_ID:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
              <span>{`
`}</span>
              <span>{`        Run the following command to re-deploy an updated Ballerina AWS Lambda function:`}</span>
              <span>{`        aws lambda update-function-code --function-name \$FUNCTION_NAME --zip-file fileb://aws-ballerina-lambda-functions.zip`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Deploy the function</h2>

      <p>
        Execute the AWS CLI command given by the compiler to create and publish
        the functions by replacing the respective AWS{" "}
        <code>$LAMBDA_ROLE_ARN</code>, <code>$REGION_ID</code>, and{" "}
        <code>$FUNCTION_NAME</code> values given in the command with your
        values.
      </p>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick3 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              aria-label="Copy to Clipboard Check"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#20b6b0"
                className="output-btn bi bi-check"
                viewBox="0 0 16 16"
              >
                <title>Copied</title>
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          ) : (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
              onClick={() => {
                updateOutputClick3(true);
                const extractedText = extractOutput(ref3.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick3(false);
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
                <title>Copy to Clipboard</title>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
              </svg>
            </button>
          )}
        </Col>
        <Col sm={12}>
          <pre ref={ref3}>
            <code className="d-flex flex-column">
              <span>{`\$ aws lambda create-function --function-name dynamoDBTrigger --zip-file fileb://aws-ballerina-lambda-functions.zip --handler aws-lambda-dynamodb-trigger.dynamoDBTrigger --runtime provided --role arn:aws:iam::908363916111:role/lambda-role--layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Invoke the function</h2>

      <p>
        Follow the instructions below to create a DynamoDB table for invoking
        this function.
      </p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>1.</span>
          <span>
            In the IAM Console, click the corresponding role in the list, and
            click <strong>Add permissions</strong>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>2.</span>
          <span>
            Select <strong>attach policies</strong> from the drop-down menu, and
            add the <strong>AWSLambdaDynamoDBExecutionRole</strong> to the role.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>3.</span>
          <span>
            Go to{" "}
            <a href="https://console.aws.amazon.com/dynamodbv2">DynamoDB</a>,
            and from the drop-down menu at the top RHS of the screen, select the{" "}
            <strong>AWS region</strong> in which you created the user and role.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>4.</span>
          <span>
            Click <strong>Create Table</strong>, enter a table name and a
            partition key, and create the table (if you already have a table
            created, you can skip this step).
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>5.</span>
          <span>
            Click on the DynamoDB table you created, and then click the{" "}
            <strong>Exports and streams</strong> tab.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>6.</span>
          <span>
            Click <strong>Turn on</strong> under{" "}
            <strong>DynamoDB stream details</strong>, select{" "}
            <strong>Key attributes only</strong> for the event type, and click{" "}
            <strong>Turn on stream</strong>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>7.</span>
          <span>
            Under the <strong>Trigger</strong> section, click{" "}
            <strong>Create trigger</strong>, select the{" "}
            <code>dynamoDBTrigger</code> from the drop-down, and click{" "}
            <strong>Create trigger</strong>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>8.</span>
          <span>
            Click <strong>Explore table items</strong>, and click{" "}
            <strong>Create items</strong> under the{" "}
            <strong>Items returned</strong> section.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>9.</span>
          <span>
            Enter a value under the <strong>Attributes</strong> section to add
            an entry to the DynamoDB table to invoke the Lambda function, and
            click <strong>Create item</strong>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>10.</span>
          <span>
            Click the <strong>Monitor</strong> tab of the Lambda function in the
            AWS Management Console, and click{" "}
            <strong>View CloudWatch logs</strong> to check the logs via
            CloudWatch.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>11.</span>
          <span>
            Under <strong>Log streams</strong> in CloudWatch, click on the
            topmost stream in the list and verify the object name in the logs.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>12.</span>
          <span>
            Go to the AWS Lambda function and check the logs via CloudWatch to
            see the object identifier in the logs.
          </span>
        </li>
      </ul>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="S3 trigger"
            href="/learn/by-example/aws-lambda-s3-trigger"
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
                  S3 trigger
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Hello world"
            href="/learn/by-example/azure-functions-hello-world"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Hello world
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#3ad1ca"
                className={`${
                  btnHover[1] ? "btnArrowHover" : "btnArrow"
                } bi bi-arrow-right`}
                viewBox="0 0 16 16"
                onMouseEnter={() => updateBtnHover([false, true])}
                onMouseOut={() => updateBtnHover([false, false])}
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </div>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
