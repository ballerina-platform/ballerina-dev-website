import React, { useState, createRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";
import { copyToClipboard, extractOutput } from "../../../utils/bbe";
import Link from "next/link";

export const codeSnippetData = [
  `---
spec_version: "0.4.0"
name: "Standup Assistant"
description: "A Telegram assistant that reads your GitHub activity and Google Calendar, and books time on your calendar."
version: "0.1.0"
max_iterations: 20
model:
  provider: "anthropic"
  name: "claude-sonnet-5"
  authentication:
    type: "api-key"
    api_key: "\${env:ANTHROPIC_API_KEY}"
interfaces:
  - type: platformchat
    platform: telegram
    mode: polling
    prompt: |
      Telegram message from \${http:payload.message.from.first_name} (chat \${http:payload.message.chat.id}):
      \${http:payload.message.text}

      Use the send_message tool to reply in the same chat.
    platform_config:
      bot_token: "\${env:TELEGRAM_BOT_TOKEN}"
    polling:
      interval: 1
      timeout: 30
skills:
  - type: "local"
    path: "./skills"
tools:
  mcp:
    - name: "telegram"
      transport:
        type: "stdio"
        command: "uv"
        args:
          - "run"
          - "--directory"
          - "\${env:TELEGRAM_MCP_DIR}"
          - "server.py"
        env:
          TELEGRAM_BOT_TOKEN: "\${env:TELEGRAM_BOT_TOKEN}"
    - name: "github"
      transport:
        type: "http"
        url: "https://api.githubcopilot.com/mcp/"
        authentication:
          type: "bearer"
          token: "\${env:GITHUB_TOKEN}"
      tool_filter:
        allow:
          - "get_me"
          - "search_pull_requests"
          - "pull_request_read"
    - name: "calendar"
      transport:
        type: "stdio"
        command: "npx"
        args:
          - "-y"
          - "@cocal/google-calendar-mcp@2.6.3"
        env:
          GOOGLE_OAUTH_CREDENTIALS: "\${env:GOOGLE_OAUTH_CREDENTIALS}"
      tool_filter:
        allow:
          - "get-current-time"
          - "list-events"
          - "create-event"
---

# Role

You are a personal work assistant reachable over Telegram. You have live access to the user's GitHub activity and Google Calendar, and you can create calendar events for them.

# Instructions

- Reply to every message with the send_message tool, in the same chat, as short plain text that reads well on a phone.
- Use live data only. Never invent pull requests, meetings or times. If a tool fails, say which one.
- For a standup update, load the standup-update skill. For anything that reads or changes the calendar, load the calendar-scheduling skill.
- Only create calendar events when explicitly asked. Never edit or delete existing events.
`,
  `FROM ghcr.io/wso2/afm-langchain-interpreter:latest

# Bake the agent definition and its skills into the image, so that a running container
# carries no configuration of its own and every deployment is identical. Skill paths in the
# definition resolve against the location of the definition, which is \`/app\` here.
COPY standup_assistant.afm /app/agent.afm
COPY skills /app/skills

# Credentials are never baked in. They arrive as environment variables at run time, named
# by the \`\${env:...}\` references in the agent definition.
CMD ["run", "/app/agent.afm"]
`,
];

export function AiAgentFromAfm({ codeSnippets }) {
  const [codeClick1, updateCodeClick1] = useState(false);
  const [codeClick2, updateCodeClick2] = useState(false);

  const [btnHover, updateBtnHover] = useState([false, false]);

  return (
    <Container className="bbeBody d-flex flex-column h-100">
      <h1>Deploy an agent from an AFM file</h1>

      <p>
        <a href="/learn/agent-flavored-markdown/">
          Agent-Flavored Markdown (AFM)
        </a>{" "}
        defines an agent in a Markdown file rather than in code. A YAML front
        matter block holds the configuration, and the body holds the{" "}
        <code># Role</code> and <code># Instructions</code> sections that
        describe the agent in natural language. An interpreter reads the file
        and builds the agent from it, so deploying an agent means shipping a
        definition and an interpreter, with no application code to write or
        compile.
      </p>

      <p>
        The agent below is a standup assistant reachable over Telegram. It reads
        the user’s GitHub activity and Google Calendar through three MCP
        servers, and it loads two skills that hold the longer procedures for
        composing a standup update and for booking time.
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
        The definition here uses the <code>.afm</code> extension. The
        specification accepts <code>.afm</code> and <code>.afm.md</code>{" "}
        equally, so the same file can carry either.
      </p>

      <p>
        The front matter names everything the runtime needs. The{" "}
        <code>model</code> section selects Claude and reads its key from the
        environment. The <code>interfaces</code> section makes the agent a
        Telegram bot that polls for new messages, and builds each user prompt
        from the incoming event with <code>http:payload</code> references. The{" "}
        <code>tools.mcp</code> section connects three MCP servers, two launched
        over stdio and one reached over HTTP, and <code>tool_filter</code>{" "}
        narrows the GitHub server to the three tools this agent should be able
        to call. No credential appears in the file itself; every one of them is
        an <code>env:</code> variable reference resolved when the agent loads.
      </p>

      <h2>Add the skills</h2>

      <p>
        The <code>skills</code> field points at a directory next to the
        definition. Each skill is a subdirectory holding a <code>SKILL.md</code>{" "}
        file whose front matter carries a <code>name</code> and a{" "}
        <code>description</code>. The interpreter reads only those two fields up
        front and loads the body when the agent decides the skill applies, which
        keeps the system prompt small.
      </p>

      <pre style={{ marginLeft: "0px" }} className="p-3 rounded markdown">
        <code>
          --- name: standup-update description: Compose a daily standup update
          from the user's recent GitHub pull request activity. --- # Standup
          update Build the update from live GitHub data only. 1. Call `get_me`
          to resolve the current GitHub user. ...
        </code>
      </pre>

      <h2>Build the image</h2>

      <p>
        Bake the definition and the skills into an image built on the
        interpreter. The image already provides <code>uv</code> and{" "}
        <code>npx</code>, so the stdio MCP servers can be launched from inside
        the container.
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

      <pre style={{ marginLeft: "0px" }} className="p-3 rounded bash">
        <code>
          --- name: standup-update description: Compose a daily standup update
          from the user's recent GitHub pull request activity. --- # Standup
          update Build the update from live GitHub data only. 1. Call `get_me`
          to resolve the current GitHub user. ... docker build -t
          standup-assistant:0.1.0 .
        </code>
      </pre>

      <p>
        Validate the definition before shipping it. This parses the file,
        resolves the skills, and prints the interfaces and MCP servers it found,
        without contacting the model.
      </p>

      <pre style={{ marginLeft: "0px" }} className="p-3 rounded bash">
        <code>
          --- name: standup-update description: Compose a daily standup update
          from the user's recent GitHub pull request activity. --- # Standup
          update Build the update from live GitHub data only. 1. Call `get_me`
          to resolve the current GitHub user. ... docker build -t
          standup-assistant:0.1.0 . docker run --rm --entrypoint afm
          standup-assistant:0.1.0 validate /app/agent.afm
        </code>
      </pre>

      <h2>Run it</h2>

      <p>
        Pass the credentials at run time, named by the <code>env:</code>{" "}
        variable references in the definition. This agent needs{" "}
        <code>ANTHROPIC_API_KEY</code>, <code>TELEGRAM_BOT_TOKEN</code>,{" "}
        <code>GITHUB_TOKEN</code>, and <code>GOOGLE_OAUTH_CREDENTIALS</code>,
        and <code>TELEGRAM_MCP_DIR</code> pointing at the Telegram MCP server.
      </p>

      <pre style={{ marginLeft: "0px" }} className="p-3 rounded bash">
        <code>
          --- name: standup-update description: Compose a daily standup update
          from the user's recent GitHub pull request activity. --- # Standup
          update Build the update from live GitHub data only. 1. Call `get_me`
          to resolve the current GitHub user. ... docker build -t
          standup-assistant:0.1.0 . docker run --rm --entrypoint afm
          standup-assistant:0.1.0 validate /app/agent.afm docker run -d --name
          standup-assistant --restart unless-stopped \ -e ANTHROPIC_API_KEY -e
          TELEGRAM_BOT_TOKEN -e GITHUB_TOKEN -e GOOGLE_OAUTH_CREDENTIALS \ -e
          TELEGRAM_MCP_DIR=/app/telegram-mcp \ -v
          /opt/telegram-mcp:/app/telegram-mcp:ro \ standup-assistant:0.1.0
        </code>
      </pre>

      <p>
        A few things follow from this particular definition. The agent polls
        Telegram rather than receiving webhooks, so it needs outbound network
        access but no published port and no inbound route. One replica should
        run at a time, because a second one would poll the same chat and answer
        twice. The calendar server is fetched by <code>npx</code> on each start,
        so vendor it into the image for a deployment that must not depend on a
        package registry being reachable. Secrets belong in whatever secret
        store the platform provides rather than in the image or in a compose
        file, and rotating one means restarting the container, since those
        references resolve when the agent loads.
      </p>

      <blockquote>
        <p>
          Note: <code>platformchat</code>, the interface type this agent uses,
          is defined in version 0.4.0 of the specification but is not yet
          implemented by either reference interpreter, both of which accept only{" "}
          <code>consolechat</code>, <code>webchat</code>, and{" "}
          <code>webhook</code>. Validating this definition against the published
          image today reports:{" "}
          <code>
            Input tag 'platformchat' found using 'type' does not match any of
            the expected tags: 'consolechat', 'webchat', 'webhook'
          </code>
          . Changing <code>interfaces</code> to <code>- type: webchat</code>{" "}
          runs the same agent, with the same tools and skills, as a web chat
          service on port 8085.
        </p>
      </blockquote>

      <p>
        For more information on the format, see the{" "}
        <a href="https://wso2.github.io/agent-flavored-markdown/specification/">
          AFM specification
        </a>
        .
      </p>

      <h2>Related links</h2>

      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="/learn/agent-flavored-markdown/">The AFM guide</a>
          </span>
        </li>
      </ul>
      <ul style={{ marginLeft: "0px" }} class="relatedLinks">
        <li>
          <span>&#8226;&nbsp;</span>
          <span>
            <a href="https://wso2.github.io/agent-flavored-markdown/specification/">
              The AFM specification
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
            title="Agent with MCP integration"
            href="/learn/by-example/ai-agent-mcp-integration/"
          >
            <div className="btnContainer d-flex align-items-center ms-auto">
              <div className="d-flex flex-column me-4">
                <span className="btnNext">Next</span>
                <span
                  className={btnHover[1] ? "btnTitleHover" : "btnTitle"}
                  onMouseEnter={() => updateBtnHover([false, true])}
                  onMouseOut={() => updateBtnHover([false, false])}
                >
                  Agent with MCP integration
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
