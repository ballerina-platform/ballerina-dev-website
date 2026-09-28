---
layout: ballerina-agent-flavored-markdown-left-nav-pages-swanlake
title: Agent-Flavored Markdown (AFM)
description: Define AI agents in a portable Markdown format and run them with Ballerina.
keywords: ballerina, ai, afm, agent-flavored markdown, agent definition, mcp, skills
permalink: /learn/agent-flavored-markdown/
active: agent-flavored-markdown
intro: Agent-Flavored Markdown (AFM) is a Markdown-based format for defining AI agents, so that an agent can be written once in text and reused across platforms.
---

## Understand AFM

Agent frameworks tend to mix the instructions given to the model with the technical configuration around them, which makes an agent definition hard to move between platforms. AFM separates the two. The natural language part of an agent lives in the Markdown body, and everything else lives in a YAML front matter block.

AFM is an open specification from WSO2. At the time of writing, the published specification is version 0.4.0, in draft status.

## The file format

An agent definition file uses the `.afm.md` or `.afm` extension, and has two parts: the front matter and the body.

```markdown
---
spec_version: "0.4.0"
name: "Math Tutor"
description: "An AI assistant that helps with math problems"
version: "1.0.0"
max_iterations: 10
---

# Role

You are an experienced math tutor who helps students with mathematics problems.

# Instructions

Explain each step of the solution in simple language, and keep the answer to three sentences.
```

The body must contain two headings. `# Role` defines the purpose and responsibilities of the agent, and typically forms the opening context of the system prompt. `# Instructions` holds the directives that shape its behaviour. Both are ordinary Markdown, so lists, links, code blocks, and nested subheadings can be used freely within them.

## Agent details

Every top-level front matter field is optional, though the nested structures described below have required members of their own. The details in this section identify the agent and describe where it came from.

| Field | Description |
| --- | --- |
| `spec_version` | The version of the AFM specification the file conforms to. |
| `name` | The display name of the agent. Defaults to the file name. |
| `description` | A summary of what the agent does. Defaults to the `# Role` section. |
| `version` | The semantic version of the agent definition. Defaults to `0.0.0`. |
| `author` / `authors` | An author, or a list of authors, each as `Name <Email>`. `authors` wins if both are given. |
| `provider` | The organization providing the agent, as a `name` and a `url`. |
| `icon_url` | A URL to an icon representing the agent. |
| `license` | The license the agent definition is released under. |

## Execution

The `max_iterations` field caps the number of iterations the agent may perform in a single run, which guards against runaway execution. Its default is left to the implementation.

## Model

The `model` field selects the model and how to authenticate to it. All of its fields are optional.

```yaml
model:
  name: "gpt-4o"
  provider: "openai"
  url: "https://api.openai.com/v1/chat/completions"
  authentication:
    type: "api-key"
    api_key: "${env:OPENAI_API_KEY}"
```

The `authentication` object takes a `type` naming the scheme, such as `bearer`, `basic`, `jwt`, or `oauth2`, plus whichever further fields that scheme needs. The specification leaves those extra fields to the implementation, and recommends supplying their values through variable substitution rather than writing secrets into the file.

## Tools

Tools reach an AFM agent through the Model Context Protocol, which is the only tool protocol the specification defines today. Each entry under `tools.mcp` names a server and describes how to reach it.

```yaml
tools:
  mcp:
    - name: "github_api"
      transport:
        type: "http"
        url: "https://api.githubcopilot.com/mcp/"
        authentication:
          type: "bearer"
          token: "${env:GITHUB_TOKEN}"
```

A transport is either `http`, which takes a `url` and optional `authentication`, or `stdio`, which takes a `command` with optional `args` and `env`. An optional `tool_filter` narrows what the server exposes: `allow` lists the tools to expose, `deny` removes tools from whatever remains, and `deny` is applied after `allow`.

To build the MCP servers that AFM agents connect to, see [Expose and consume MCP servers](/learn/expose-and-consume-mcp-servers/).

## Interfaces

The `interfaces` field lists how the agent is reached. An agent with no `interfaces` field is a console chat agent that takes one string and returns one string.

| Type | Description |
| --- | --- |
| `consolechat` | A command-line chat interface. This is the default. |
| `webchat` | A chat interface exposed over HTTP. |
| `platformchat` | A chat interface on a platform such as Slack, Google Chat, Telegram, or WhatsApp, in notification, request, or polling mode. |
| `webhook` | An agent invoked by an incoming HTTP call, optionally through a WebSub subscription. |

An interface may carry a `signature` describing its input and output as JSON Schema written in YAML. The HTTP-facing types also take an `exposure` object setting the HTTP path. Console chat has no such field, and `platformchat` in polling mode must not set one, because the runtime fetches events rather than receiving them. The `webhook` and `platformchat` types additionally take a `prompt` template that builds the user prompt from the incoming event. The specification does not define which HTTP methods an exposed endpoint accepts.

## Skills

The `skills` field points the agent at skill directories that follow the Agent Skills specification, where each skill is a directory holding a `SKILL.md` file.

```yaml
skills:
  - type: "local"
    path: "./my-skills"
```

A path may point at a single skill directory or at a parent holding several, and relative paths resolve against the location of the AFM file. Implementations are expected to load only the name and description of each skill up front, and to read the full instructions when a skill matches the task at hand.

## Variable substitution

Values in the front matter may reference variables with the `${...}` syntax, which keeps credentials out of the file. The `env:` prefix reads an environment variable and resolves when the agent is loaded. For `webhook` and `platformchat` agents, `http:payload` and `http:header` read the event at runtime, taking the incoming request for the inbound modes and the polling response for `platformchat` in polling mode. Header names are matched without regard to case.

These three prefixes are the only ones the specification defines. An implementation may add its own, so a definition using something like `${file:...}` is not portable.

## Running an AFM agent

AFM agents are run by an interpreter, which reads the file and builds the agent from it at run time. Two reference implementations are available. One is written in Ballerina and builds the agent on the `ballerina/ai` module, and the other is written in Python on LangChain.

```bash
docker pull ghcr.io/wso2/afm-ballerina-interpreter:latest
```

Mount the agent definition into the container and point the interpreter at it.

```bash
docker run -p 8085:8085 \
  -v ./support_agent.afm.md:/app/support_agent.afm.md \
  -e afmFilePath=/app/support_agent.afm.md \
  -e OPENAI_API_KEY=<YOUR-API-KEY> \
  ghcr.io/wso2/afm-ballerina-interpreter:latest
```

The interpreter itself reads only one environment variable, `WSO2_MODEL_PROVIDER_TOKEN`. Every other credential reaches it by variable substitution, so the variables to pass are the ones named by that file's own `${env:...}` references. Mount skill directories under `/app` as well, since relative `skills` paths resolve against the location of the agent definition.

The Ballerina interpreter supports OpenAI, Anthropic, and the WSO2 model provider. With the WSO2 provider the `model` field can be omitted entirely. Set `WSO2_MODEL_PROVIDER_TOKEN` to the `accessToken` value that the `Configure default WSO2 Model Provider` command in VS Code writes to the `Config.toml` file.

There is no AFM module to import in a Ballerina program, and no `bal` command that builds an agent from an AFM file. The interpreter is itself an ordinary Ballerina program, so the pattern is to run an interpreter rather than to import a library.

## What AFM does not cover yet

Several capabilities are named as future work rather than defined today. There is no multi-agent or sub-agent concept, and no agent-to-agent protocol. There is no memory abstraction; the specification notes the lack of standardization and lists memory among the things it intends to cover later. Tools are limited to MCP, so OpenAPI-described services and plain functions are not yet tool sources, and agent identity is not addressed. Skills load only from the local filesystem, with remote skills from URLs and registries still to come, as are further interface types such as scheduled execution and a plain REST API. For these capabilities in Ballerina today, see [Build an AI agent](/learn/build-an-ai-agent/), [Persist agent memory](/learn/persist-agent-memory/), and the [Agent as a tool](/learn/by-example/ai-agent-as-tool/) example.

## Learn more

To try out the samples, see:

- [Agent with local tools](/learn/by-example/ai-agent-local-tools/)
- [Agent with MCP integration](/learn/by-example/ai-agent-mcp-integration/)
