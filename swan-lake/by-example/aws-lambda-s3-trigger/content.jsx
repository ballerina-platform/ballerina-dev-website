import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/io;
import ballerinax/awslambda;

// The \`@awslambda:Function\` annotation marks a function to generate an AWS Lambda function.

@awslambda:Function
public function notifyS3(awslambda:Context ctx,
        awslambda:S3Event event) returns json {
    io:println(event.Records[0].s3.'object.key);
    return event.Records[0].s3.'object.key;
}`,
];

export function AwsLambdaS3Trigger({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();
  const [outputClick3, updateOutputClick3] = useState(false);
  const ref3 = createRef();
  const [outputClick4, updateOutputClick4] = useState(false);
  const ref4 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>AWS Lambda S3 trigger</h1>

      <p>
        AWS Lambda is an event driven, serverless computing platform. Ballerina
        functions can be deployed in AWS Lambda by annotating a Ballerina
        function with <code>@awslambda:Function</code>, which should have the{" "}
        <code>
          function (awslambda:Context, json|EventType) returns json|error
        </code>{" "}
        function signature. For more information, see the{" "}
        <a href="/learn/run-in-the-cloud/function-as-a-service/aws-lambda/">
          AWS Lambda learn guide
        </a>
        .
      </p>

      <h2>Set up the prerequisites</h2>

      <p>
        For instructions, see{" "}
        <a href="/learn/run-in-the-cloud/function-as-a-service/aws-lambda/#set-up-the-prerequisites">
          Set up the prerequisites
        </a>
        .
      </p>

      <h2>Create a Ballerina package</h2>

      <p>Execute the command below to create a new Ballerina package.</p>

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
              <span>{`\$ bal new aws-lambda-s3-trigger`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Replace the code</h2>

      <p>
        Replace the content of the generated Ballerina file with the content
        below.
      </p>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2 ms-auto"
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
              className="bg-transparent border-0 m-0 p-2 ms-auto"
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

      <h2>Build the Ballerina program</h2>

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
              <span>{`        wso2/aws-lambda-s3-trigger:0.1.0`}</span>
              <span>{`
`}</span>
              <span>{`Generating executable`}</span>
              <span>{`        @awslambda:Function: notifys3`}</span>
              <span>{`
`}</span>
              <span>{`        Run the following command to deploy each Ballerina AWS Lambda function:`}</span>
              <span>{`        aws lambda create-function --function-name \$FUNCTION_NAME --zip-file fileb://<project-dir>/aws-lambda-s3-trigger/target/bin/aws-ballerina-lambda-functions.zip --handler aws-lambda-s3-trigger.\$FUNCTION_NAME --runtime provided --role \$LAMBDA_ROLE_ARN --layers arn:aws:lambda:\$REGION_ID:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
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
        Execute the AWS CLI commands to create and publish the functions by
        setting your respective AWS <code>$LAMBDA_ROLE_ARN</code>,{" "}
        <code>$REGION_ID</code>, and <code>$FUNCTION_NAME</code> values.
      </p>

      <pre>
        <code>
          &gt;**Tip:** For instructions on getting the value for
          the`$LAMBDA_ROLE_ARN`, see [AWS Lambda
          deployment](/learn/run-in-the-cloud/function-as-a-service/aws-lambda/).
        </code>
      </pre>

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
              <span>{`\$ aws lambda create-function --function-name notifys3 --zip-file fileb://aws-ballerina-lambda-functions.zip --handler aws-lambda-s3-trigger.notifys3 --runtime provided --role arn:aws:iam::908363916111:role/lambda-role--layers arn:aws:lambda:us-west-1:134633749276:layer:ballerina-jre11:6 --memory-size 512 --timeout 10`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Invoke the function</h2>

      <p>To invoke this function, create an S3 bucket in AWS.</p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>1.</span>
          <span>
            Go to &lt;a href=&quot;https://s3.console.aws.amazon.com/s3/&quot;
            target=&quot;_blank&quot;&gt;AWS S3&lt;/a&gt; portal and create a
            bucket.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>2.</span>
          <span>
            Click on the created bucket, go to the <strong>Properties</strong>{" "}
            tab, and click on the <strong>Create event notification</strong>{" "}
            under the <strong>Event notifications</strong> section.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>3.</span>
          <span>
            Enable <code>All object create events</code> under event types.
            Select the Lambda function as the destination, and choose the{" "}
            <code>notifyS3</code> Lambda function from the dropdown.
          </span>
        </li>
      </ul>

      <p>
        Now, click <strong>Upload</strong> to upload an object to the S3 bucket,
        and view the Lambda logs via CloudWatch to see the object name.
      </p>

      <Row
        className="bbeOutput mx-0 py-0 rounded "
        style={{ marginLeft: "0px" }}
      >
        <Col sm={12} className="d-flex align-items-start">
          {outputClick4 ? (
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
                updateOutputClick4(true);
                const extractedText = extractOutput(ref4.current.innerText);
                copyToClipboard(extractedText);
                setTimeout(() => {
                  updateOutputClick4(false);
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
          <pre ref={ref4}>
            <code className="d-flex flex-column">
              <span>{`\$ echo '{"MESSAGE":"HELLO"}' > input.json`}</span>
              <span>{`\$ aws lambda invoke --function-name notifys3 --payload fileb://input.json echo-response.txt`}</span>
              <span>{`{`}</span>
              <span>{`"ExecutedVersion": "\$LATEST",`}</span>
              <span>{`"StatusCode": 200`}</span>
              <span>{`}`}</span>
              <span>{`\$ cat echo-response.txt`}</span>
              <span>{`{"MESSAGE":"HELLO"}`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Execution context"
            href="/learn/by-example/aws-lambda-execution-context"
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
                  Execution context
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="DynamoDB trigger"
            href="/learn/by-example/aws-lambda-dynamodb-trigger"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  DynamoDB trigger
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
