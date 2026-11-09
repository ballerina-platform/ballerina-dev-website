import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;
import ballerina/mcp;

// A custom MCP toolkit for the weather MCP server. Unlike \`ai:McpToolKit\`, which forwards every
// call as it is, each permitted MCP tool is dispatched through a method of this class, so the
// class decides how each call is made.
isolated class WeatherToolKit {
    *ai:McpBaseToolKit;
    private final mcp:StreamableHttpClient mcpClient;
    private final readonly & ai:ToolConfig[] tools;
    private final int maxForecastDays;

    public isolated function init(string serverUrl, int maxForecastDays = 3,
            mcp:Implementation info = {name: "Weather Assistant", version: "1.0.0"},
            *mcp:StreamableHttpClientTransportConfig config) returns ai:Error? {
        self.maxForecastDays = maxForecastDays;
        // Map each MCP tool that the agent can use to the method that dispatches it.
        // Tools of the server that are not in this map are not given to the agent.
        final map<ai:FunctionTool> permittedTools = {
            "getCurrentWeather": self.getCurrentWeather,
            "getWeatherForecast": self.getWeatherForecast
        };
        do {
            // The client configuration, such as authentication, timeouts, and retries,
            // is passed on to the MCP client.
            self.mcpClient = check new (serverUrl, config);
            // Initialize the MCP session, list the tools of the server, and create the tool
            // configurations of the permitted tools with the schemas from the server.
            self.tools = check ai:getPermittedMcpToolConfigs(self.mcpClient, info, permittedTools)
                .cloneReadOnly();
        } on fail error e {
            return error("Failed to initialize the MCP toolkit", e);
        }
    }

    public isolated function getTools() returns ai:ToolConfig[] => self.tools;

    // The \`params\` parameter carries the tool name and the arguments chosen by the LLM.
    @ai:AgentTool
    public isolated function getCurrentWeather(mcp:CallToolParams params)
            returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }

    @ai:AgentTool
    public isolated function getWeatherForecast(mcp:CallToolParams params)
            returns mcp:CallToolResult|error {
        // Adjust the arguments chosen by the LLM before the call is forwarded to the server.
        record {} arguments = {...params.arguments ?: {}};
        anydata days = arguments["days"];
        if days is int && days > self.maxForecastDays {
            io:println(string \`[WeatherToolKit] Limiting the forecast from \${days} to \${
                self.maxForecastDays} days\`);
            arguments["days"] = self.maxForecastDays;
        }
        return self.mcpClient->callTool({name: params.name, arguments});
    }
}

// Connect to the MCP server from the MCP service example.
final WeatherToolKit weatherToolKit = check new ("http://localhost:9090/mcp", maxForecastDays = 3);

final ai:Agent weatherAgent = check new (
    systemPrompt = {
        role: "Weather-aware AI Assistant",
        instructions: string \`You are a smart AI assistant that can assist
            a user based on accurate and timely weather information.
            If a tool returns less data than the user asked for, say so.\`
    },
    tools = [weatherToolKit],
    // Use the default model provider (with configuration added
    // via a Ballerina VS Code command).
    model = check ai:getDefaultModelProvider()
);

public function main() returns error? {
    string response = check weatherAgent.run(
        "What is the weather in Colombo now, and what is the forecast for the next 5 days?");
    io:println("Agent: ", response);
}
`,
];

export function AiAgentMcpIntegrationAdvanced({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>AI agents with advanced MCP integration</h1>

      <p>
        The <code>ai:McpToolKit</code> toolkit forwards each tool call to the
        MCP server unchanged. When you need more control over these calls,
        define a custom MCP toolkit: a class that includes the{" "}
        <code>ai:McpBaseToolKit</code> type and uses an{" "}
        <code>mcp:StreamableHttpClient</code> client. The{" "}
        <code>ai:getPermittedMcpToolConfigs</code> function maps each MCP tool
        to a method of the class annotated with <code>@ai:AgentTool</code>. Each
        method receives the call as an <code>mcp:CallToolParams</code> value, so
        it can change the call before forwarding it to the server.
      </p>

      <p>
        This example limits the number of forecast days that the agent can
        request from a weather MCP server.
      </p>

      <blockquote>
        <p>
          Note:
          <br />• Start the MCP server from the{" "}
          <a href="/learn/by-example/mcp-service/">MCP service</a> example
          before running this example.
          <br />• This example uses the default model provider implementation.
          To generate the necessary configuration, open up the VS Code command
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
                "https://github.com/ballerina-platform/ballerina-distribution/tree/master/examples/ai-agent-mcp-integration-advanced",
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
              <span>{`\$ bal run ai_agent_mcp_integration_advanced.bal`}</span>
              <span>{`[WeatherToolKit] Limiting the forecast from 5 to 3 days`}</span>
              <span>{`Agent: The current weather in Colombo is as follows:`}</span>
              <span>{`- **Temperature**: 17.0°C`}</span>
              <span>{`- **Humidity**: 40%`}</span>
              <span>{`- **Pressure**: 1017 hPa`}</span>
              <span>{`- **Condition**: Sunny`}</span>
              <span>{`
`}</span>
              <span>{`For the next 5 days, the weather forecast is as follows:`}</span>
              <span>{`
`}</span>
              <span>{`1. **September 29, 2026**`}</span>
              <span>{`   - High: 21°C`}</span>
              <span>{`   - Low: 11°C`}</span>
              <span>{`   - Condition: Rainy`}</span>
              <span>{`   - Precipitation Chance: 44%`}</span>
              <span>{`   - Wind Speed: 7 km/h`}</span>
              <span>{`
`}</span>
              <span>{`2. **September 30, 2026**`}</span>
              <span>{`   - High: 21°C`}</span>
              <span>{`   - Low: 13°C`}</span>
              <span>{`   - Condition: Cloudy`}</span>
              <span>{`   - Precipitation Chance: 31%`}</span>
              <span>{`   - Wind Speed: 9 km/h`}</span>
              <span>{`
`}</span>
              <span>{`3. **October 1, 2026**`}</span>
              <span>{`   - High: 24°C`}</span>
              <span>{`   - Low: 11°C`}</span>
              <span>{`   - Condition: Cloudy`}</span>
              <span>{`   - Precipitation Chance: 21%`}</span>
              <span>{`   - Wind Speed: 18 km/h`}</span>
              <span>{`
`}</span>
              <span>{`Please note that the forecast only includes data for 3 days instead of the requested 5 days.`}</span>
            </code>
          </pre>
        </Col>
      </Row>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-mcp-integration/">
              The Agent with MCP integration example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/ai-agent-mcp-context/">
              The Passing context to MCP tools example
            </a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/mcp-service/">The MCP service example</a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/by-example/mcp-client/">The MCP client example</a>
          </span>
        </li>
      </ul>
      <span style={{ marginBottom: "20px" }}></span>

      <Row className="mt-auto mb-5">
        <Col sm={6}>
          <Link
            title="Agent with MCP integration"
            href="/learn/by-example/ai-agent-mcp-integration/"
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
                  Agent with MCP integration
                </span>
              </div>
            </div>
          </Link>
        </Col>
        <Col sm={6}>
          <Link
            title="Passing context to MCP tools"
            href="/learn/by-example/ai-agent-mcp-context/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Passing context to MCP tools
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
