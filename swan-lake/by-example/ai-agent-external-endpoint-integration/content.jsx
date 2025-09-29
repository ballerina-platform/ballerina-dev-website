import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `import ballerina/ai;
import ballerina/io;
import ballerinax/googleapis.calendar;
import ballerinax/googleapis.gmail;

// Configuration for external endpoints.
configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshUrl = ?;

configurable string userEmail = ?;

// Create clients for Gmail and Calendar APIs.
final gmail:Client gmailClient = check new ({
    auth: {refreshToken: refreshToken, clientId, clientSecret, refreshUrl}
});

final calendar:Client calendarClient = check new (config = {
    auth: {clientId, clientSecret, refreshToken: refreshToken, refreshUrl}
});

// Define tools for the agent to interact with Gmail and Calendar APIs.
@ai:AgentTool
isolated function readUnreadEmails() returns gmail:Message[]|error {
    gmail:ListMessagesResponse messageList =
        check gmailClient->/users/me/messages(q = "label:INBOX is:unread");
    gmail:Message[]? messages = messageList.messages;

    if messages is () {
        return [];
    }

    gmail:Message[] completeMessages = from gmail:Message message in messages
        select check gmailClient->/users/me/messages/[message.id](format = "full");
    return completeMessages;
}

@ai:AgentTool
isolated function sendEmail(string[] to, string subject, string body) 
        returns gmail:Message|error {
    return gmailClient->/users/me/messages/send.post({to, subject, bodyInText: body});
}

@ai:AgentTool
isolated function getCalendarEvents() 
        returns stream<calendar:Event, error?>|error {
    return calendarClient->getEvents(userEmail);
}

@ai:AgentTool
isolated function createCalendarEvent(calendar:InputEvent event) 
        returns calendar:Event|error {
    return calendarClient->createEvent(userEmail, event);
}

final ai:Agent personalAssistantAgent = check new (
    systemPrompt = {
        role: "Personal Assistant",
        instructions: string \`You are an intelligent personal AI assistant 
            designed to help users stay organized and efficient. You have 
            access to the user's email and calendar through secure API 
            integrations.
            
            Your tasks may require reading and summarizing unread emails,
            sending emails on behalf of the user, helping schedule meetings, 
            and managing calendar events.

            When interacting with the user, always adhere to the following:
            - Respond in a natural and professional tone.
            - Always confirm before making changes to the user's calendar or 
                sending emails.
            - Provide concise summaries when retrieving information unless the 
                user requests details.
            - Prioritize clarity, efficiency, and user convenience in all tasks.\`
    },
    // Use the default model provider (with configuration added via a 
    // Ballerina VS Code command).
    model = check ai:getDefaultModelProvider(),
    // Specify the tools the agent can use.
    tools = [readUnreadEmails, sendEmail, getCalendarEvents, createCalendarEvent]
);

public function main() returns error? {
    while true {
        string userInput = io:readln("User (or 'exit' to quit): ");
        if userInput == "exit" {
            break;
        }
        // Pass the user input to the agent and get a response.
        string response = check personalAssistantAgent.run(userInput);
        io:println("Agent: ", response);
    }
}
`,
];

export function AiAgentExternalEndpointIntegration({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);

  const [outputClick1, updateOutputClick1] = useState(false);
  const ref1 = createRef();

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>AI agents with external endpoints as tools</h1>

      <p>
        Ballerina enables developers to easily create intelligent AI agents
        powered by large language models (LLMs) and integrated with tools,
        including local tools, MCP tools, and external APIs. These AI agents can
        automate complex workflows, interact with users through natural
        language, and seamlessly connect with internal and external systems.
      </p>

      <p>
        This example demonstrates how to create an AI agent that can access
        Gmail and Google Calendar by integrating with Google APIs as external
        endpoints. The agent functions as a personal assistant that can read
        emails, send emails, view calendar events, and create new calendar
        entries.
      </p>

      <blockquote>
        <p>
          Note: This example uses the default model provider implementation. Log
          in to the Ballerina Copilot, open up the VS Code command palette (
          <code>Ctrl</code> + <code>Shift</code> + <code>P</code> or{" "}
          <code>command</code> + <code>shift</code> + <code>P</code>), and run
          the <code>Configure default WSO2 Model Provider</code> command to add
          your keys to the <code>Config.toml</code> file. Alternatively, to use
          your own keys, use the relevant{" "}
          <code>ballerinax/ai.&lt;provider&gt;</code> model provider
          implementation.
        </p>
      </blockquote>

      <blockquote>
        <p>
          Note: Follow the{" "}
          <a href="https://central.ballerina.io/ballerinax/googleapis.gmail/latest#setup-guide">
            connector setup guide
          </a>{" "}
          to obtain the connector configuration.
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
              <span>{`\$ bal run ai_agent_external_endpoint_integration.bal`}</span>
              <span>{`User (or 'exit' to quit): Do I have any meetings today?`}</span>
              <span>{`Agent: You have one meeting scheduled for today:`}</span>
              <span>{`
`}</span>
              <span>{`- **Event:** Sync up on the monthly meet up`}</span>
              <span>{`- **Time:** 3:30 PM to 4:30 PM (Asia/Colombo timezone)`}</span>
              <span>{`
`}</span>
              <span>{`If you need any further assistance regarding this meeting, just let me know!`}</span>
              <span>{`User (or 'exit' to quit): Can you check my mail to see if I've missed any meeting requests?`}</span>
              <span>{`Agent: You have an unread email regarding a meeting request:`}</span>
              <span>{`
`}</span>
              <span>{`- **From:** Emma (<email-address>)`}</span>
              <span>{`- **Subject:** Catch up`}</span>
              <span>{`- **Message:** Emma wants to discuss Ballerina's Gen AI app building capabilities with you. She is available at 4 PM today (September 27th) or on Monday (September 29th) at 10 AM.`}</span>
              <span>{`
`}</span>
              <span>{`Would you like to respond to Emma and confirm a time?`}</span>
              <span>{`User (or 'exit' to quit): Yes, please schedule the meeting. The time is okay with me, but can you check my calendar to see if I have any appointments already?`}</span>
              <span>{`Agent: You have a meeting scheduled today from 3:30 PM to 4:30 PM. Since Emma's proposed time for the meeting is at 4 PM today, it would overlap with your existing appointment.`}</span>
              <span>{`
`}</span>
              <span>{`Would you prefer to schedule the meeting with Emma for Monday, September 29th at 10 AM instead?`}</span>
              <span>{`User (or 'exit' to quit): Yes, please`}</span>
              <span>{`Agent: The meeting with Emma has been successfully scheduled for Monday, September 29th from 10:00 AM to 11:00 AM. `}</span>
              <span>{`
`}</span>
              <span>{`You can view the event [here](<event-link>).`}</span>
              <span>{`
`}</span>
              <span>{`If there's anything else you need, feel free to ask!`}</span>
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
            title="Natural expressions"
            href="/learn/by-example/natural-expressions/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Natural expressions
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
