import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;
import ballerina/time;

type ReturnEligibility record {|
    boolean eligible;
    string reason;
|};

# Gets the status of an order.
# + orderId - The ID of the order
# + return - The status of the order
@ai:AgentTool
isolated function getOrderStatus(string orderId) returns string =>
    orderId == "ORD-1001" ? "Delivered on 2026-09-20" : "Not found";

# Gets the category of the product in an order.
# + orderId - The ID of the order
# + return - The product category
@ai:AgentTool
isolated function getProductCategory(string orderId) returns string =>
    orderId == "ORD-1001" ? "electronics" : "unknown";

# Counts the days between two dates.
# + fromDate - The start date in the \`YYYY-MM-DD\` format
# + toDate - The end date in the \`YYYY-MM-DD\` format
# + return - The number of days from the start date to the end date
@ai:AgentTool
isolated function daysBetween(string fromDate, string toDate) returns int|error {
    time:Utc 'from = check time:utcFromString(fromDate + "T00:00:00Z");
    time:Utc to = check time:utcFromString(toDate + "T00:00:00Z");
    return <int>(time:utcDiffSeconds(to, 'from) / 86400);
}

final ai:ModelProvider model = check ai:getDefaultModelProvider();

// A specialist agent that looks up orders. It is configured with \`memory: ()\`, so it is
// stateless and keeps no conversation history between delegations.
final ai:Agent orderAgent = check new ({
    systemPrompt: {
        role: "Order Specialist",
        instructions: "You look up the status and the product category of orders using the tools."
    },
    model,
    tools: [getOrderStatus, getProductCategory],
    memory: ()
});

// A specialist agent defined as an agent definition: a class that includes the
// \`ai:FixedTypedAgent\` type. A definition can be shared, for example by publishing it in a
// library package, and every agent created from it can be attached as a tool of another agent.
isolated class ReturnsPolicyAgent {
    *ai:FixedTypedAgent;

    private final ai:Agent agent;

    function init(ai:ModelProvider model) returns error? {
        self.agent = check new (
            systemPrompt = {
                role: "Returns Policy Specialist",
                instructions: string \`You decide whether an item can be returned. Electronics can be
                    returned within 14 days of delivery, and other items within 30 days. Use the tool
                    to count the days since the delivery.\`
            },
            model = model,
            tools = [daysBetween],
            memory = ()
        );
    }

    // The fixed return type of the definition binds the response to a structured type.
    public isolated function run(string|ai:Prompt query, string sessionId = "sessionId",
            ai:Context context = new) returns ReturnEligibility|ai:Error =>
        self.agent.run(query, sessionId, context);

    public isolated function trace(string|ai:Prompt query, string sessionId = "sessionId",
            ai:Context context = new) returns ai:Trace|ai:Error =>
        self.agent.run(query, sessionId, context);
}

final ReturnsPolicyAgent returnsPolicyAgent = check new (model);

// An agent becomes a tool of another agent through a function that runs it. The calling agent
// decides when to call the tool and composes the query, so the description says when to use
// it and what the query must include, since the sub-agent cannot see the conversation.

# Delegates questions about the status or the product category of an order to the order
# specialist. Include the order ID in the query.
# + query - A self-contained request for the order specialist
# + return - The response from the order specialist
@ai:AgentTool
isolated function orderAgentTool(string query) returns string|error {
    io:println("[Delegating to the order specialist] ", query);
    return orderAgent.run(query);
}

# Delegates the decision of whether an item can be returned to the returns policy specialist.
# Call it only after the order specialist has provided the product category and the delivery
# date, and include them and today's date in the query.
# + query - A self-contained request for the returns policy specialist
# + return - Whether the item can be returned, and the reason
@ai:AgentTool
isolated function returnsPolicyAgentTool(string query) returns ReturnEligibility|error {
    io:println("[Delegating to the returns policy specialist] ", query);
    // An agent created from a definition is attached as a tool in the same way. Its structured
    // result needs no further interpretation by the calling agent.
    return returnsPolicyAgent.run(query);
}

// The orchestrator owns the conversation, delegates the subtasks to the specialists, and
// composes the final answer.
final ai:Agent supportAgent = check new ({
    systemPrompt: {
        role: "Customer Support Agent",
        instructions: string \`You help customers with their orders. Never assume order details:
            get them from the order specialist first. Delegate return decisions to the returns
            policy specialist with the details you got, then answer the customer briefly.
            Today is 2026-09-28.\`
    },
    model,
    tools: [orderAgentTool, returnsPolicyAgentTool]
});

public function main() returns error? {
    string response = check supportAgent.run("Can I still return my order ORD-1001?");
    io:println("Agent: ", response);
}
`,
];

export function AiAgentAsTool({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Agent as a tool</h1>

      <p>
        A multi-agent system splits a task across several cooperating agents,
        each with its own instructions, tools, model, and optionally its own
        memory. In the orchestrator pattern, one agent owns the request,
        delegates subtasks to specialist agents, and composes their results into
        the final answer. A specialist is attached to the orchestrator as a
        tool: a function annotated with <code>@ai:AgentTool</code> that runs the
        specialist with the query composed by the orchestrator and returns its
        response.
      </p>

      <p>
        The orchestrator decides when to call the tool from its description, so
        write the description around the situations that should trigger a
        hand-off. The specialist does not see the conversation of the
        orchestrator, so the description also states what the query must
        include. The return type of the tool binds the response of the
        specialist, and a structured type gives the orchestrator a result that
        needs no further interpretation. A specialist configured with{" "}
        <code>memory: ()</code> is stateless, so it keeps no history between
        delegations.
      </p>

      <p>
        A specialist can be an <code>ai:Agent</code> created inline, or an agent
        created from an agent definition, a class that includes the{" "}
        <code>ai:FixedTypedAgent</code> type. A definition can be shared, for
        example by publishing it in a library package, so a specialist built
        once can be attached as a tool of agents in other integrations and
        projects. It is attached in the same way, and the fixed return type of
        the definition gives the calling agent a structured result.
      </p>

      <p>
        This example demonstrates a customer support agent that delegates order
        lookups to an inline order specialist, and return decisions to a returns
        policy specialist created from an agent definition.
      </p>

      <blockquote>
        <p>
          Note: Each delegation is a full agent run, so it adds latency and
          token usage, and each agent enforces its own maximum number of
          iterations. Delegate only the subtasks that need their own reasoning,
          and use a tool for a single action.
        </p>
      </blockquote>

      <blockquote>
        <p>
          Note: This example uses the default model provider implementation. To
          generate the necessary configuration, open up the VS Code command
          palette (<code>Ctrl</code> + <code>Shift</code> + <code>P</code> or{" "}
          <code>command</code> + <code>shift</code> + <code>P</code>), and run
          the <code>Configure default WSO2 Model Provider</code> command to add
          your configuration to the <code>Config.toml</code> file. If not
          already logged in, log in to the Ballerina Copilot when prompted.
          Alternatively, to use your own keys, use the relevant{" "}
          <code>ballerinax/ai.&lt;provider&gt;</code> model provider
          implementation.
        </p>
      </blockquote>

      <p>
        For more information on the underlying module, see the{" "}
        <a href="https://lib.ballerina.io/ballerina/ai/latest/">
          <code>ballerina/ai</code> module
        </a>
        .
      </p>

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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/ai-agent-as-tool",
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
              className="bg-transparent border-0 m-0 p-2 "
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
              className="bg-transparent border-0 m-0 p-2 "
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
              <span>{`\$ bal run ai_agent_as_tool.bal`}</span>
              <span>{`[Delegating to the order specialist] Can you provide the product category and delivery date for order ID ORD-1001?`}</span>
              <span>{`[Delegating to the returns policy specialist] Can the customer return an electronics item delivered on September 20, 2026, as of today, September 28, 2026?`}</span>
              <span>{`Agent: Yes, you can still return your order ORD-1001, as it was delivered within the return window. If you need further assistance with the return process, feel free to ask!`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-definitions/">
              The Agent definitions example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-local-tools/">
              The Agent with local tools example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-typed-input-output/">
              The Agent with typed input and output example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-tool-context/">
              The Passing context to agent tools example
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Agent tool loading strategy"
            href="/learn/by-example/ai-agent-tool-loading-strategy/"
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
                  Agent tool loading strategy
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link title="MCP service" href="/learn/by-example/mcp-service/">
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  MCP service
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
