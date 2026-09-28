import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/http;
import ballerina/io;
import ballerina/time;
import ballerina/uuid;

type Task record {|
    string id;
    string description;
    time:Date dueBy?;
    boolean completed = false;
|};

type NewTask record {|
    string description;
    time:Date dueBy?;
|};

// The tools that the toolkit provides.
public enum TaskTool {
    LIST_TASKS = "listTasks",
    ADD_TASK = "addTask",
    COMPLETE_TASK = "completeTask"
}

// A toolkit for a task management REST API. The toolkit owns the HTTP client, so the API
// credentials never reach the LLM, and its \`init\` parameters decide which tools the agent gets.
public isolated class TaskManagerToolkit {
    *ai:BaseToolKit;

    private final http:Client taskApi;
    private final readonly & ai:ToolConfig[] tools;

    # Initializes the toolkit.
    # + serviceUrl - The URL of the task management API
    # + auth - The bearer token configuration used to authenticate with the API
    # + permittedTools - The tools to give the agent, or \`()\` to give all the tools
    # + readOnly - Whether to give the agent only the tools that do not change the tasks
    # + return - An error if the initialization fails
    public isolated function init(string serviceUrl, http:BearerTokenConfig auth,
            TaskTool[]? permittedTools = (), boolean readOnly = false) returns error? {
        self.taskApi = check new (serviceUrl, {auth});
        // The \`ai:getToolConfigs\` function generates the tool configurations for the specified
        // tools, which the toolkit then filters based on its configuration. The names of the
        // tools are the names of the methods, which are the values of \`TaskTool\`.
        ai:ToolConfig[] allTools = ai:getToolConfigs([self.listTasks, self.addTask, self.completeTask]);
        self.tools = from ai:ToolConfig tool in allTools
            let TaskTool toolName = check tool.name.ensureType()
            where (permittedTools is () || permittedTools.indexOf(toolName) != ())
                && (!readOnly || toolName == LIST_TASKS)
            select tool.cloneReadOnly();
    }

    // The \`getTools\` method returns the tools provided by this toolkit.
    public isolated function getTools() returns ai:ToolConfig[] => self.tools;

    # Lists all the tasks.
    # + return - The tasks, or an error if the request fails
    @ai:AgentTool
    isolated function listTasks() returns Task[]|error {
        return self.taskApi->/tasks;
    }

    # Adds a new task.
    # + description - The description of the task
    # + dueBy - The date by which the task should be completed
    # + return - The added task, or an error if the request fails
    @ai:AgentTool
    isolated function addTask(string description, time:Date? dueBy = ()) returns Task|error {
        NewTask newTask = dueBy is () ? {description} : {description, dueBy};
        return self.taskApi->/tasks.post(newTask);
    }

    # Marks a task as completed.
    # + id - The ID of the task
    # + return - The completed task, or an error if the request fails
    @ai:AgentTool
    isolated function completeTask(string id) returns Task|error {
        return self.taskApi->/tasks/[id]/complete.post({});
    }
}

@ai:AgentTool
isolated function getCurrentDate() returns time:Date {
    time:Civil {year, month, day} = time:utcToCivil(time:utcNow());
    return {year, month, day};
}

configurable string taskApiToken = "task-api-token";

public function main() returns error? {
    // Start a mock task management API on port 9095 so that the example is self-contained.
    http:Listener taskApiListener = check new (9095);
    check taskApiListener.attach(createTaskApi(taskApiToken), "api");
    check taskApiListener.'start();

    // Include the toolkit in the tools of the agent. This agent can list and add tasks,
    // but it does not get the tool that completes tasks.
    TaskManagerToolkit taskManager = check new ("http://localhost:9095/api", {token: taskApiToken},
        permittedTools = [LIST_TASKS, ADD_TASK]);
    io:println("Task tools: ", from ai:ToolConfig tool in taskManager.getTools() select tool.name);

    ai:Agent taskAssistantAgent = check new ({
        systemPrompt: {
            role: "Task Assistant",
            instructions: string \`You are a helpful assistant for
                managing a to-do list. You can manage tasks and
                help a user plan their schedule. Use the current
                date to resolve dates such as today or the 30th.\`
        },
        tools: [taskManager, getCurrentDate],
        // Use the default model provider (with configuration added
        // via a Ballerina VS Code command).
        model: check ai:getDefaultModelProvider()
    });

    while true {
        string userInput = io:readln("User (or 'exit' to quit): ");
        if userInput == "exit" {
            break;
        }
        // Pass the user input to the agent and get a response.
        string response = check taskAssistantAgent.run(userInput);
        io:println("Agent: ", response);
    }
    check taskApiListener.gracefulStop();
}

// Creates the mock task management API, which requires a bearer token.
function createTaskApi(string token) returns http:Service {
    return isolated service object {
        private final map<Task> tasks = {};

        resource function get tasks(@http:Header string authorization) returns Task[]|http:Unauthorized {
            if authorization != "Bearer " + token {
                return http:UNAUTHORIZED;
            }
            lock {
                return self.tasks.toArray().clone();
            }
        }

        resource function post tasks(@http:Header string authorization, @http:Payload NewTask newTask)
                returns Task|http:Unauthorized {
            if authorization != "Bearer " + token {
                return http:UNAUTHORIZED;
            }
            Task task = {id: uuid:createRandomUuid(), ...newTask};
            lock {
                self.tasks[task.id] = task.clone();
            }
            return task;
        }

        resource function post tasks/[string id]/complete(@http:Header string authorization)
                returns Task|http:Unauthorized|http:NotFound {
            if authorization != "Bearer " + token {
                return http:UNAUTHORIZED;
            }
            lock {
                Task? task = self.tasks[id];
                if task is () {
                    return http:NOT_FOUND;
                }
                task.completed = true;
                return task.clone();
            }
        }
    };
}
`,
];

export function AiAgentToolKit({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>AI agents with tool kits</h1>

      <p>
        Ballerina enables developers to easily create intelligent AI agents
        powered by large language models (LLMs) and integrated with tools,
        including local tools, MCP tools, and external APIs. These AI agents can
        automate complex workflows, interact with users through natural
        language, and seamlessly connect with internal and external systems.
      </p>

      <p>
        This example demonstrates how to create an AI agent that can manage a
        to-do list by using a toolkit that encapsulates a set of related tools
        for a task management REST API. Toolkits allow for better encapsulation
        and reusability compared to using standalone functions, especially when
        building complex agents with multiple related capabilities.
      </p>

      <p>
        A toolkit is a class that includes the <code>ai:BaseToolKit</code> type
        and returns its tools from the <code>getTools</code> method. Since the
        class defines its own <code>init</code> method, it controls how the
        tools are created. In this example, the toolkit takes the URL and the
        bearer token configuration of the API and keeps the HTTP client to
        itself, so the credentials never reach the LLM. The{" "}
        <code>permittedTools</code> parameter selects the tools that the agent
        gets, and the <code>readOnly</code> parameter leaves out the tools that
        change the tasks. The agent in this example can list and add tasks, but
        it does not get the tool that completes tasks.
      </p>

      <blockquote>
        <p>
          Note: The example starts a mock task management API on port 9095, so
          that it is self-contained.
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/v2201.13.6/examples/ai-agent-tool-kit",
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
              <span>{`\$ bal run ai_agent_tool_kit.bal`}</span>
              <span>{`warning: [ballerina/http] HTTPS is recommended but using HTTP`}</span>
              <span>{`Task tools: ["listTasks","addTask"]`}</span>
              <span>{`User (or 'exit' to quit): I have to pay my WiFi bill today and meet Jane for tea at 4pm on the 30th.`}</span>
              <span>{`Agent: I have added the tasks to your to-do list:`}</span>
              <span>{`
`}</span>
              <span>{`1. **Pay WiFi bill** - Due today.`}</span>
              <span>{`2. **Meet Jane for tea** - Scheduled for 4 PM on the 30th.`}</span>
              <span>{`
`}</span>
              <span>{`Let me know if you need any further assistance!`}</span>
              <span>{`User (or 'exit' to quit): What do I have on my plate today?`}</span>
              <span>{`Agent: You have the following task on your plate today:`}</span>
              <span>{`
`}</span>
              <span>{`1. **Pay WiFi bill** - Due today.`}</span>
              <span>{`
`}</span>
              <span>{`The meeting with Jane for tea is scheduled for the 30th, so it's not due today. Let me know if you need anything else!`}</span>
              <span>{`User (or 'exit' to quit): exit`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-local-tools">
              The Agent with local tools example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-mcp-integration">
              The Agent with MCP integration example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-mcp-integration-advanced">
              The Agent with advanced MCP integration example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-external-endpoint-integration">
              The Agent with external endpoint integration example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.anthropic/latest">
              The <code>ballerinax/ai.anthropic</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.azure/latest">
              The <code>ballerinax/ai.azure</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.openai/latest">
              The <code>ballerinax/ai.openai</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.ollama/latest">
              The <code>ballerinax/ai.ollama</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.deepseek/latest">
              The <code>ballerinax/ai.deepseek</code> module
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://central.ballerina.io/ballerinax/ai.mistral/latest">
              The <code>ballerinax/ai.mistral</code> module
            </a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Agent evaluation"
            href="/learn/by-example/ai-agent-evaluation/"
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
                  Agent evaluation
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Agent with typed input and output"
            href="/learn/by-example/ai-agent-typed-input-output/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Agent with typed input and output
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
