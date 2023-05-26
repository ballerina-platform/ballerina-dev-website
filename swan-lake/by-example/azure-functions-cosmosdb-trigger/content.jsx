import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/log;
import ballerinax/azure_functions as af;

public type DBEntry record {
    string id;
    string name;
};

@af:CosmosDBTrigger {connectionStringSetting: "CosmosDBConnection", databaseName: "db1", collectionName: "c1"}
listener af:CosmosDBListener cosmosEp = new ();

service "cosmos" on cosmosEp {
    remote function onUpdate(DBEntry[] entries) returns @af:QueueOutput {queueName: "people"} string {
        string name = entries[0].name;
        log:printInfo(entries.toJsonString());
        return "Hello, " + name;
    }
}`,
];

export function AzureFunctionsCosmosdbTrigger({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Azure Functions Cosmos DB trigger</h1>

      <p>
        This example demonstrates using a Cosmos DB trigger to invoke an AWS
        Lambda function and a queue output binding to write an entry to a queue.
      </p>

      <p>
        For more information, see the{" "}
        <a href="https://ballerina.io/learn/run-in-the-cloud/function-as-a-service/azure-functions/">
          Azure Functions deployment guide
        </a>
        .
      </p>

      <h2>Set up the prerequisites</h2>

      <p>
        Follow the steps below to create a Cosmos DB and a queue to make use of
        those services later in this example.
      </p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>1.</span>
          <span>
            Set up the{" "}
            <a href="https://ballerina.io/learn/run-in-the-cloud/function-as-a-service/azure-functions/#set-up-the-prerequisites">
              general prerequisites
            </a>
            .
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>2.</span>
          <span>
            Create the queue in the{" "}
            <a href="/learn/by-example/azure-functions/http-trigger/">
              HTTP trigger
            </a>{" "}
            example to resue it in this one.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>3.</span>
          <span>
            Create an{" "}
            <a href="https://portal.azure.com/#create/Microsoft.DocumentDB">
              Azure Cosmos DB account
            </a>{" "}
            and select <strong>Cosmos DB Core</strong>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>4.</span>
          <span>
            Once the database is created, go to the{" "}
            <strong>Data Explorer</strong>, and select{" "}
            <strong>Create Container</strong>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>5.</span>
          <span>
            Enter <code>db1</code> as the Database ID, <code>c1</code> as the
            collection ID, and click <strong>Ok</strong>.
          </span>
        </li>
      </ul>
      <blockquote>
        <p>
          <strong>Note:</strong> If you want to change these values, change them
          in the code as well.
        </p>
      </blockquote>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>6.</span>
          <span>
            Go to the <strong>Keys</strong> tab of the Cosmos DB page.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>7.</span>
          <span>
            Copy the value of the <code>PRIMARY CONNECTION STRING</code>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>8.</span>
          <span>
            Click the <strong>Configuration</strong> tab on the function app
            page.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>9.</span>
          <span>
            Select <strong>New Application Setting</strong>, and paste the data
            you copied above as the value.
          </span>
        </li>
      </ul>
      <blockquote>
        <p>
          <strong>Tip:</strong> For the key, use the value of the{" "}
          <code>connectionStringSetting</code> key and save.
        </p>
      </blockquote>

      <p>Example application settings are as follows.</p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            Name - <code>CosmosDBConnection</code>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            Value -{" "}
            <code>
              AccountEndpoint=https://db-cosmos.documents.azure.com:443/;AccountKey=12345asda;
            </code>
          </span>
        </li>
      </ul>

      <p>
        Now, as all the infrastructure required are up and running and
        configured, start building and deploying the Azure function.
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
              <span>{`\$ bal new azure-functions-cosmosdb-trigger`}</span>
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

      <h2>Build the function</h2>

      <p>
        Execute the command below to generate the Azure Functions artifacts.
      </p>

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
              <span>{`\$ bal build --cloud="azure_functions"`}</span>
              <span>{`Compiling source`}</span>
              <span>{`        wso2/azure-functions-cosmosdb-trigger:0.1.0`}</span>
              <span>{`
`}</span>
              <span>{`Generating executable`}</span>
              <span>{`        @azure_functions:Function: timer, get-hello`}</span>
              <span>{`
`}</span>
              <span>{`        Execute the command below to deploy the function locally.`}</span>
              <span>{`        func start --script-root target/azure_functions --java`}</span>
              <span>{`
`}</span>
              <span>{`        Execute the command below to deploy Ballerina Azure Functions.`}</span>
              <span>{`        func azure functionapp publish <function_app_name> --script-root target/azure_functions `}</span>
              <span>{`
`}</span>
              <span>{`        target/bin/azure_functions_deployment.jar`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Deploy the function</h2>

      <p>
        Execute the Azure CLI command given by the compiler to create and
        publish the functions by replacing the sample app name given in the
        command with your respective Azure{" "}
        <code>&lt;function_app_name&gt;</code>.
      </p>

      <blockquote>
        <p>
          <strong>Tip:</strong> For instructions on getting the values, see{" "}
          <a href="https://ballerina.io/learn/run-in-the-cloud/function-as-a-service/azure-functions/#set-up-the-prerequisites">
            Set up the prerequisites
          </a>
          .
        </p>
      </blockquote>

      <h2>Invoke the function</h2>

      <p>Once the function is deployed, add an item to the collection.</p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>1.</span>
          <span>
            Navigate to the collection created in the{" "}
            <strong>Data Explorer</strong>.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>2.</span>
          <span>
            Click <strong>New Item</strong> to add a new item to the collection.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>3.</span>
          <span>Go to the queue page and observe the added new entry.</span>
        </li>
      </ul>

      <blockquote>
        <p>
          <strong>Info:</strong> Additionally, for debugging purposes, view the
          logs under the <strong>Logs stream</strong> in the function app.
        </p>
      </blockquote>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="HTTP trigger"
            href="/learn/by-example/azure-functions-http-trigger"
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
                  HTTP trigger
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link title="Distributed tracing" href="/learn/by-example/tracing">
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Distributed tracing
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
