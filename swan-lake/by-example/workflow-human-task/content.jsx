import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/http;
import ballerina/io;
import ballerina/workflow;
import ballerina/workflow.management;

// The result type of the human task. The runtime validates the submitted
// result against it.
type Approval record {|
    boolean approved;
|};

@workflow:Activity
function placeOrder(string item) returns string|error {
    io:println("Placing an order for ", item);
    return "PLACED";
}

@workflow:Workflow
function orderWorkflow(workflow:Context ctx, string item) returns string|error {
    // Create a human task and pause durably until a person completes it.
    // Only a user with the \`manager\` role can complete this task.
    Approval approval = check ctx->awaitHumanTask("approveOrder", {item},
            userRoles = "manager", title = "Approve the order");
    if !approval.approved {
        return "REJECTED";
    }
    return ctx->callActivity(placeOrder, {item});
}

service /orders on new http:Listener(9090) {

    // Starts a workflow instance for the order and returns its ID.
    resource function post .(@http:Payload string item) returns string|error {
        return workflow:run(orderWorkflow, item);
    }

    // Lists the pending human tasks of a workflow instance.
    resource function get [string id]/tasks()
            returns management:HumanTaskGroup[]|error {
        return management:listPendingHumanTasks(id);
    }

    // Completes a task as a \`manager\`. The workflow resumes with the result.
    // This example passes the role directly. A real service passes the
    // roles of the authenticated caller.
    resource function post tasks/[string taskId](Approval approval)
            returns error? {
        check workflow:completeHumanTask(taskId, approval, ["manager"]);
    }
}
`,
  `# Runs the workflow engine inside the program, so no server is needed. The
# state lasts only while the program runs. To keep it across restarts, set
# \`mode\` to "LOCAL" and run a Temporal server.
[ballerina.workflow]
mode = "IN_MEMORY"
`,
];

export function WorkflowHumanTask({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);
  const [codeClick2, updateCodeClick2] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Human task</h1>

      <p>
        A human task pauses a workflow until a person makes a decision, such as
        approving an order. Call <code>ctx-&gt;awaitHumanTask</code> with a task
        name, the input to show to the person, and who can complete it. The
        workflow waits durably and resumes with the submitted result, which is
        checked against the result type.
      </p>

      <p>Applications interact with human tasks in one of two ways.</p>

      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <strong>Program API</strong>: Call{" "}
            <code>management:listPendingHumanTasks</code> and{" "}
            <code>workflow:completeHumanTask</code> from your own code, as this
            example does from an HTTP service.
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }}>
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <strong>REST API</strong>: Enable the built-in workflow management
            REST API. See the{" "}
            <a href="/learn/by-example/workflow-human-task-rest-api">
              Human task with REST API
            </a>{" "}
            example.
          </span>
        </li>
      </ul>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://lib.ballerina.io/ballerina/workflow/latest/">
          <code>ballerina/workflow</code> module
        </a>
        .
      </p>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          {codeClick1 ? (
            <button
              className="bg-transparent border-0 m-0 p-2  ms-auto"
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
              className="bg-transparent border-0 m-0 p-2  ms-auto"
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

      <p>
        To run this example, add the following <code>Config.toml</code> file
        next to the source file.
      </p>

      <Row
        className="bbeCode mx-0 py-0 rounded 
      "
        style={{ marginLeft: "0px" }}
      >
        <Col className="d-flex align-items-start" sm={12}>
          {codeClick2 ? (
            <button
              className="bg-transparent border-0 m-0 p-2  ms-auto"
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
              className="bg-transparent border-0 m-0 p-2  ms-auto"
              onClick={() => {
                updateCodeClick2(true);
                copyToClipboard(codeSnippetData[1]);
                setTimeout(() => {
                  updateCodeClick2(false);
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
          {codeSnippets[1] != undefined && (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(codeSnippets[1]),
              }}
            />
          )}
        </Col>
      </Row>

      <p>Run the service as follows.</p>

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
              <span>{`\$ bal run workflow_human_task.bal`}</span>
              <span>{`time=2026-10-14T15:11:10.268+05:30 level=INFO module=ballerina/workflow.observe message="human task decision accepted" taskKind="HUMAN_TASK" taskId="f91dd93b-1fd9-3591-bcfb-69fec474ed87" taskName="orderWorkflow.approveOrder" parentWorkflowId="01a139c9-7921-798e-bcdd-148e330630d4" action="complete" outcome="accepted" userId= userRoles=["manager"] identitySource="asserted" assignedRoles=["manager"] decidedAt="2026-10-14T09:41:10.267751Z" taskInput="{\\"item\\":\\"laptop\\"}" content="{\\"approved\\":true}"`}</span>
              <span>{`Placing an order for laptop`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>
        In a new terminal, start a workflow, list its pending task, and complete
        the task as a manager. Replace the IDs with the ones that you receive.
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
              <span>{`\$ curl -X POST http://localhost:9090/orders -H "Content-Type: text/plain" -d "laptop"`}</span>
              <span>{`01a139c9-7921-798e-bcdd-148e330630d4`}</span>
              <span>{`
`}</span>
              <span>{`\$ curl http://localhost:9090/orders/01a139c9-7921-798e-bcdd-148e330630d4/tasks`}</span>
              <span>{`[{"taskName":"orderWorkflow.approveOrder", "taskIds":["f91dd93b-1fd9-3591-bcfb-69fec474ed87"]}]`}</span>
              <span>{`
`}</span>
              <span>{`\$ curl -X POST http://localhost:9090/orders/tasks/f91dd93b-1fd9-3591-bcfb-69fec474ed87 -H "Content-Type: application/json" -d '{"approved": true}'`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/workflow-human-task-rest-api">
              Human task with REST API
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/workflow-data-events">Data events</a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/workflow-durable-agent-human-task">
              Durable agent with human task
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Durable sleep"
            href="/learn/by-example/workflow-durable-sleep/"
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
                  Durable sleep
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Human task with REST API"
            href="/learn/by-example/workflow-human-task-rest-api/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Human task with REST API
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
