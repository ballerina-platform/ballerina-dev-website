---
layout: ballerina-build-an-ai-agent-left-nav-pages-swanlake
title: Build an AI agent
description: Learn how to build an AI agent in Ballerina with a system prompt, a model provider, tools, tool kits, MCP tools, typed input and output, and a chat interface.
keywords: ballerina, AI, agent, LLM, tools, tool kit, MCP, chat agent
permalink: /learn/build-an-ai-agent/
active: build-an-ai-agent
intro: This guide walks through building an AI agent that uses tools to complete tasks, exposing it as a chat service, and calling it from a client.
---

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.13.0 (Swan Lake) or greater. Install [Ballerina](/downloads/).
2. A text editor
  >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the
  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. A model provider. This guide uses the default model provider; see [Configure model and embedding providers](/learn/configure-model-and-embedding-providers/) to use your own keys.

## Understand the implementation

An agent (`ai:Agent`) runs a reasoning-action loop. It sends the conversation and the definitions of its tools to the LLM, executes the tool calls the LLM returns, feeds the results back, and repeats until the LLM produces a final answer.

An agent is configured with the following.

- **System prompt** (`ai:SystemPrompt`): the role and instructions of the agent.
- **Model provider** (`ai:ModelProvider`): the LLM used for reasoning.
- **Tools**: Ballerina functions annotated with `@ai:AgentTool`, tool kits (`ai:BaseToolKit` implementations), and MCP tool kits (`ai:McpToolKit`).
- **Optional settings**: memory, the maximum number of iterations, and the tool loading strategy.

In this guide, you build a task assistant agent that manages a to-do list.

## Create the package

```
$ bal new task_assistant
```

## Define the tools

A tool is an `isolated` function annotated with `@ai:AgentTool`. The LLM sees the function name, the description from the documentation comment, and an input schema generated from the parameter types, and decides when to call it and with which arguments.

```ballerina
import ballerina/ai;
import ballerina/time;
import ballerina/uuid;

type Task record {|
    string description;
    time:Date dueBy?;
    boolean completed = false;
|};

isolated map<Task> tasks = {};

# Adds a task to the to-do list.
# + description - The task description
# + dueBy - The date the task is due by
@ai:AgentTool
isolated function addTask(string description, time:Date? dueBy) returns error? {
    lock {
        tasks[uuid:createRandomUuid()] = {description, dueBy: dueBy.clone()};
    }
}

# Lists all the tasks.
@ai:AgentTool
isolated function listTasks() returns Task[] {
    lock {
        return tasks.toArray().clone();
    }
}

# Gets the current date.
@ai:AgentTool
isolated function getCurrentDate() returns time:Date {
    time:Civil {year, month, day} = time:utcToCivil(time:utcNow());
    return {year, month, day};
}
```

Related tools can be grouped in a tool kit, which is an `isolated` class that includes the `ai:BaseToolKit` type and returns its tools from the `getTools` method using `ai:getToolConfigs`. Since the class defines its own `init` method, it can take parameters that control its tools, such as the client configuration of the API that the tools call, so that the credentials never reach the LLM, and the subset of the tools to give the agent. See the [Agent with tool kits](/learn/by-example/ai-agent-tool-kit/) example.

## Create the agent

```ballerina
final ai:Agent taskAssistantAgent = check new ({
    systemPrompt: {
        role: "Task Assistant",
        instructions: string `You are a helpful assistant for managing a to-do list.
            You can manage tasks and help a user plan their schedule.`
    },
    tools: [addTask, listTasks, getCurrentDate],
    model: check ai:getDefaultModelProvider()
});
```

Optional configuration includes `maxIter` (the maximum number of reasoning-action cycles, which defaults to at least 10), `memory` (see [Persist agent memory](/learn/persist-agent-memory/)), `toolLoadingStrategy` (see below), and `executeToolCallsInParallel`.

## Run the agent

Call the `run` method with the user's query and a session ID. Messages of the same session are kept in the agent's memory, so follow-up questions have the earlier context.

```ballerina
import ballerina/io;

public function main() returns error? {
    string sessionId = "user-1";
    string response = check taskAssistantAgent.run(
            "I have to pay my WiFi bill today and meet Jane for tea on the 28th.", sessionId);
    io:println(response);

    response = check taskAssistantAgent.run("What do I have on my plate today?", sessionId);
    io:println(response);
}
```

## Use typed input and output

The `run` method accepts any `anydata` value or a prompt template as the query, and it is dependently typed: the expected type of the result determines how the final response is bound. Use a record type to get a structured, validated result.

```ballerina
type TripRequest record {|
    string destination;
    int days;
    string[] interests;
|};

type DayPlan record {|
    int day;
    string title;
    string[] activities;
|};

type Itinerary record {|
    string destination;
    DayPlan[] days;
|};

TripRequest request = {destination: "Kyoto", days: 2, interests: ["temples", "food"]};
Itinerary itinerary = check plannerAgent.run(request);
```

Use `ai:Trace` as the expected type to get the full execution trace instead of the final answer. See the [Agent with typed input and output](/learn/by-example/ai-agent-typed-input-output/) and [Agent execution trace](/learn/by-example/ai-agent-execution-trace/) examples.

## Add tools from MCP servers

Tools exposed by an MCP server can be added to an agent with an `ai:McpToolKit`. All tools of the server are used unless a subset is specified.

```ballerina
final ai:McpToolKit weatherTools = check new ("http://localhost:9090/mcp");

final ai:Agent weatherAgent = check new ({
    systemPrompt: {role: "Weather Assistant", instructions: "Answer weather questions using the tools."},
    tools: [weatherTools],
    model: check ai:getDefaultModelProvider()
});
```

See [Expose and consume MCP servers](/learn/expose-and-consume-mcp-servers/) for details. For more control, such as changing the arguments of a call or forwarding values from the `ai:Context` to the server, define a [custom MCP tool kit](/learn/expose-and-consume-mcp-servers/#define-a-custom-mcp-tool-kit).

## Delegate to other agents

An agent can be attached to another agent as a tool, so that one agent delegates part of its work to a specialist agent with its own instructions, tools, and memory. Define a function annotated with `@ai:AgentTool` that runs the specialist with the query that the calling agent composes, and describe in its documentation when to delegate and what the query must include, since the specialist does not see the conversation. To reuse an agent in several places, define it once as a class that includes the `ai:FixedTypedAgent` type, with the parts that vary as `init` parameters. See the [Agent as a tool](/learn/by-example/ai-agent-as-tool/) and [Agent definitions](/learn/by-example/ai-agent-definitions/) examples.

## Control how tools are loaded

By default (`ai:NO_FILTER`), the schemas of all tools are sent to the LLM with every request. For agents with many tools, set `toolLoadingStrategy` to `ai:LLM_FILTER`, which first sends only the tool names and descriptions, lets the LLM select the relevant tools, and then loads only their schemas. See the [Agent tool loading strategy](/learn/by-example/ai-agent-tool-loading-strategy/) example.

```ballerina
final ai:Agent hrAgent = check new ({
    systemPrompt: {role: "HR Assistant", instructions: "You help employees with HR tasks."},
    model: check ai:getDefaultModelProvider(),
    tools: [getLeaveBalance, requestLeave, getPublicHolidays, getPayslip, getManager],
    toolLoadingStrategy: ai:LLM_FILTER
});
```

## Expose the agent as a chat service

Attach a service to an `ai:Listener` to expose the agent over HTTP. The service receives `ai:ChatReqMessage` values, which carry a session ID and a message, and returns `ai:ChatRespMessage` values.

```ballerina
import ballerina/http;

service /tasks on new ai:Listener(8080) {
    resource function post chat(@http:Payload ai:ChatReqMessage request)
            returns ai:ChatRespMessage|error {
        string response = check taskAssistantAgent.run(request.message, request.sessionId);
        return {message: response};
    }
}
```

In VS Code, use the `Try it` CodeLens above the service declaration to chat with the agent. From another Ballerina program, use the `ai:ChatClient` client.

```ballerina
ai:ChatClient chatClient = check new ("http://localhost:8080/tasks");
ai:ChatRespMessage response = check chatClient->/chat.post({
    sessionId: "user-1",
    message: "Add a task to renew my passport by the end of this month."
});
```

See the [Chat agents](/learn/by-example/chat-agents/) and [Chat client](/learn/by-example/ai-chat-client/) examples.

## Run the program

Configure the default model provider (see [Configure model and embedding providers](/learn/configure-model-and-embedding-providers/)) and run the program.

```
$ bal run
```

## Learn more

- [Agent with local tools](/learn/by-example/ai-agent-local-tools/), [Agent with tool kits](/learn/by-example/ai-agent-tool-kit/), and [Agent with external endpoint integration](/learn/by-example/ai-agent-external-endpoint-integration/) examples
- [Agent as a tool](/learn/by-example/ai-agent-as-tool/) and [Agent definitions](/learn/by-example/ai-agent-definitions/) examples
- [Persist agent memory](/learn/persist-agent-memory/)
- [Human-in-the-loop agents](/learn/human-in-the-loop-agents/)
- [Observe and evaluate agents](/learn/observe-and-evaluate-agents/)
- [`ballerina/ai` module](https://central.ballerina.io/ballerina/ai/latest)
