import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/io;
import ballerina/workflow;
// Serves the workflow management REST API, which lists and completes tasks.
import ballerina/workflow.management.rest as _;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

type Approval record {|
    boolean approved;
|};

# Issues a refund for an order.
# + orderId - The order ID
# + return - The refund status
@workflow:Activity
function issueRefund(string orderId) returns string|error {
    io:println("Issuing a refund for ", orderId);
    return "REFUNDED";
}

final workflow:DurableAgent refundAgent = check new ({
    systemPrompt: {
        role: "Refund assistant",
        instructions: string \`Get approval with the approveRefund tool first.
            Issue the refund only if it is approved.\`
    },
    model: check new openai:ModelProvider(openAiApiKey, openai:GPT_4O_MINI),
    activities: [issueRefund],
    // Human tasks also become tools. When the model calls one, the agent
    // pauses durably until a person completes the task.
    humanTasks: {
        approveRefund: {
            userRoles: "manager",
            resultType: Approval,
            title: "Approve the refund"
        }
    }
});

public function main() returns error? {
    string id = check refundAgent.run("Refund order ORD-001.");
    io:println("Agent started: ", id);

    // Wait until a manager completes the task and the agent finishes.
    string answer = check refundAgent.waitForResult(id);
    io:println(answer);
}
`,
  `openAiApiKey = "<OPENAI_API_KEY>"

# Runs the workflow engine inside the program, so no server is needed. The
# state lasts only while the program runs. To keep it across restarts, set
# \`mode\` to "LOCAL" and run a Temporal server.
[ballerina.workflow]
mode = "IN_MEMORY"

# The import serves the management REST API on port 8234. Authentication is
# off for this example, so any caller can set its roles with the
# \`x-user-roles\` header. Do not run it this way in production.
[ballerina.workflow.management.rest]
enableBasicAuth = false
`,
];

export function WorkflowDurableAgentHumanTask({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);
  const [codeClick2, updateCodeClick2] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();
  const [outputClick2, updateOutputClick2] = useState(false);
  const ref2 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Durable agent with human task</h1>

      <p>
        A durable agent can involve a person before it acts. Each entry in{" "}
        <code>humanTasks</code> becomes a tool. When the model calls it, the
        agent creates a human task and pauses durably, for hours or days if
        needed, until a person completes it. The model then continues with the
        result.
      </p>

      <p>
        In this example, a manager completes the task through the workflow
        management REST API. The program API (
        <code>workflow:completeHumanTask</code>) works the same way.
        Authentication is off for this example, so any caller can set its roles
        with the <code>x-user-roles</code> header. In production, enable JWT or
        OAuth2 authentication so that the roles come from a verified token.
      </p>

      <p>
        The model provider in this example is <code>ballerinax/ai.openai</code>.
        Set your OpenAI API key in the <code>Config.toml</code> file. To use
        another model, replace it with any <code>ai:ModelProvider</code>{" "}
        implementation, such as <code>ballerinax/ai.anthropic</code> or{" "}
        <code>ballerinax/ai.ollama</code>.
      </p>

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

      <p>
        Run the program as follows. The program waits after the agent starts.
      </p>

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
              <span>{`\$ bal run workflow_durable_agent_human_task.bal`}</span>
              <span>{`time=2026-10-14T15:16:51.217+05:30 level=INFO module=ballerina/workflow.management.rest message="Workflow management REST API enabled on http://localhost:8234/workflow (auth: none — the API is open to anyone who can reach the port)"`}</span>
              <span>{`Agent started: 01a139ce-b9a1-7d4f-b2e6-57f251822e14`}</span>
              <span>{`time=2026-10-14T09:46:55.223Z level=INFO module=ballerina/workflow message="This workflow server does not implement ListWorkflowExecutions; serving listings from the standard open/closed listings instead, with filtering and paging applied in the client."`}</span>
              <span>{`time=2026-10-14T15:16:55.405+05:30 level=INFO module=ballerina/workflow.observe message="human task decision accepted" taskKind="HUMAN_TASK" taskId="0b25cac9-5b5f-3c8b-9146-517eb67d61fb" taskName="refundAgent.approveRefund" parentWorkflowId="01a139ce-b9a1-7d4f-b2e6-57f251822e14" action="complete" outcome="accepted" userId="bob" userRoles=["manager"] identitySource="asserted" assignedRoles=["manager"] decidedAt="2026-10-14T09:46:55.405301Z" taskInput="{\\"orderId\\":\\"ORD-001\\"}" content="{\\"approved\\":true}"`}</span>
              <span>{`Issuing a refund for ORD-001`}</span>
              <span>{`The refund for order ORD-001 was approved and issued.`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <p>
        In a new terminal, list the pending task of the agent and complete it as
        a manager. Replace the IDs with the ones that you receive. The agent
        then issues the refund and answers.
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
              <span>{`\$ curl "http://localhost:8234/workflow/human-tasks?parentWorkflowId=01a139ce-b9a1-7d4f-b2e6-57f251822e14" -H "x-user-roles: manager"`}</span>
              <span>{`{"items":[{"kind":"HUMAN_TASK", "taskId":"0b25cac9-5b5f-3c8b-9146-517eb67d61fb", "taskName":"refundAgent.approveRefund", "title":"Approve the refund", "description":"Creates the human task 'approveRefund' and waits for a person to complete it. Pass any details relevant for the person as fields.", "namespace":"default", "taskQueue":"BALLERINA_WORKFLOW_TASK_QUEUE", "parentWorkflowId":"01a139ce-b9a1-7d4f-b2e6-57f251822e14", "parentWorkflowType":"refundAgent", "stepId":"task:approveRefund", "status":"PENDING", "startTime":"2026-10-14T09:46:52.179Z", "closeTime":null, "userRoles":["manager"], "users":[], "excludedUsers":[], "excludedRoles":[], "administratorRoles":[], "administratorUsers":[], "completedBy":null, "completedAt":null, "completedAs":null, "canComplete":true, "canAdminister":false}], "nextPageToken":null, "hasMore":false}`}</span>
              <span>{`
`}</span>
              <span>{`\$ curl -X POST http://localhost:8234/workflow/human-tasks/0b25cac9-5b5f-3c8b-9146-517eb67d61fb/complete -H "x-user-id: bob" -H "x-user-roles: manager" -H "Content-Type: application/json" -d '{"result": {"approved": true}}'`}</span>
              <span>{`{"success":true, "completedBy":"bob", "completedAt":"2026-10-14T09:46:55.408703Z"}`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/workflow-human-task">Human task</a>
          </span>
        </li>
      </ul>
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
            <a href="/learn/by-example/workflow-durable-agent">Durable agent</a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Durable agent"
            href="/learn/by-example/workflow-durable-agent/"
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
                  Durable agent
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Durable agent with data events"
            href="/learn/by-example/workflow-durable-agent-data-events/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Durable agent with data events
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
