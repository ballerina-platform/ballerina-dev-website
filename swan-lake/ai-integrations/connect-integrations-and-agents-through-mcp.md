---
layout: ballerina-connect-integrations-and-agents-through-mcp-left-nav-pages-swanlake
title: Connect integrations and agents through MCP
description: Expose enterprise capabilities as MCP tools and consume external MCP tools from Ballerina agents.
keywords: ballerina, AI, agent, MCP, model context protocol, MCP server, MCP tools, tool filtering, integration
permalink: /learn/connect-integrations-and-agents-through-mcp/
active: connect-integrations-and-agents-through-mcp
intro: This guide shows how to publish enterprise operations as tools on a Model Context Protocol (MCP) server and how to use those tools from a Ballerina AI agent. You build two packages, an MCP server and an agent service, and handle the failures that occur between them.
---

## The scenario

An online store runs its catalog and order management systems as internal services. Several AI clients need to use them: a customer-facing chat agent, back-office assistants, and developer tools such as MCP-enabled IDEs. Instead of writing a separate integration for each client, the store publishes the operations once, as tools on an MCP server.

The requirements are:

- Expose product search, order status lookup, return requests, and refunds as MCP tools with typed inputs and clear descriptions.
- Never return customer contact data through the tools.
- Let the customer-facing agent use only the tools it needs. It may search products, look up orders, and submit returns, but must not issue refunds.
- Keep the agent service running when the MCP server or the model is unavailable, and tell callers which kind of failure occurred.
- Test the tools and the agent wiring without a real model key.

## How it works

[MCP](https://modelcontextprotocol.io) is an open protocol that lets AI clients discover and call tools on a server. The client asks the server for its tool list, which contains each tool's name, description, and input JSON schema. It then calls a tool by name with JSON arguments.

In Ballerina, the [`ballerina/mcp`](https://central.ballerina.io/ballerina/mcp/latest) module provides the server side: each `remote` function of an MCP service becomes a tool. The [`ballerina/ai`](https://central.ballerina.io/ballerina/ai/latest) module provides the client side: an `ai:McpToolKit` connects to an MCP server and gives its tools to an `ai:Agent`.

```
 POST /support/chat                                  MCP (Streamable HTTP)
        │                                            tools/list, tools/call
        ▼                                                     │
┌──────────────────────────────┐                ┌─────────────▼───────────────┐
│ customer_care_agent (:8080)  │                │ customer_care_mcp_server    │
│  1. validate the request     │                │ (:9090/mcp)                 │
│  2. ai:Agent                 │  permitted     │  searchProducts             │
│     └─ ai:McpToolKit ────────┼──────────────► │  getOrderStatus             │
│        (3 of 4 tools)        │  tools only    │  submitReturnRequest        │
│  3. map errors to HTTP       │                │  issueRefund (not given to  │
└──────────────┬───────────────┘                │   the customer agent)       │
               │                                └─────────────┬───────────────┘
               ▼                                              ▼
        ┌─────────────┐                          catalog and order systems
        │ LLM (OpenAI)│                          (in-memory in this guide)
        └─────────────┘
```

1. The MCP server publishes four tools. Their names, descriptions, and input schemas are generated from the `remote` function signatures and their documentation.
2. On the first chat request, the agent service connects to the MCP server, lists its tools, and keeps only the permitted ones. If the server cannot be reached, the request fails with `503 Service Unavailable` and the next request tries again.
3. The agent sends the user's message and the permitted tool schemas to the model. When the model asks for a tool, the toolkit calls it on the MCP server and returns the result to the model, until the model produces a reply.
4. Errors from the model and the agent are mapped to HTTP status codes without exposing internal details.

>**Tip:** If only your own agent uses a tool and no other client needs it, a local function tool is simpler than an MCP server. See [Agent with local tools](/learn/by-example/ai-agent-local-tools/) and [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/). Use MCP when the same tools must be shared by several agents or clients, or when you want a separate, governed boundary in front of an enterprise system.

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.13.0 (Swan Lake Update 13) or later. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.13.0
    ```

2. Access to an LLM that supports tool calling. This guide uses OpenAI and requires an OpenAI API key. To use a different provider, see [Use a different model provider](/learn/build-an-agent-that-uses-enterprise-systems/#use-a-different-model-provider). The MCP server does not need a model.

3. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

4. A command terminal.

5. Optionally, <a href="https://nodejs.org/" target="_blank">Node.js</a>, to inspect the MCP server with the MCP Inspector.

## Create the packages

The MCP server and the agent run as separate processes, so create a package for each. In the terminal, execute the commands below.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new customer_care_mcp_server
$ bal new customer_care_agent
```

This creates the directories below.

```
.
├── customer_care_agent
│   ├── Ballerina.toml
│   └── main.bal
└── customer_care_mcp_server
    ├── Ballerina.toml
    └── main.bal
```

>**Tip:** Remove the automatically-created `main.bal` files. The server uses a `store.bal` and a `service.bal` file, and the agent uses a `service.bal` file.

## Build the MCP server

### Model the enterprise operations

The MCP server wraps the store's catalog and order systems. In this guide, they are represented by in-memory data in `store.bal`, together with one function per operation. In a real integration, these functions call the systems of record through their connectors or APIs. Keeping the operations in plain functions, separate from the MCP service, lets you test them directly.

Define the records that the tools return. The service sends tool results to the client as JSON, so return only the fields the client needs. `OrderStatus` is a separate record from the stored `Order`, so that the customer's email address never leaves the server.

```ballerina
# The order details that are shared with clients. Customer contact data is left out.
type OrderStatus record {|
    # Order ID, such as `ORD-1001`
    string orderId;
    # Current state of the order
    OrderState state;
    # SKUs of the items in the order
    string[] skus;
    # Date on which the order was placed (YYYY-MM-DD)
    string placedOn;
    # Date on which the order was delivered (YYYY-MM-DD), if it has been delivered
    string? deliveredOn;
|};
```

Some outcomes are not successes but are expected, such as an unknown order ID or a return request for an order that has not been delivered. Return them as values, not errors, so that the client receives a clear explanation that the model can pass on to the user.

```ballerina
# An expected business outcome that is not a success, such as an unknown order.
# Tools return this as a value so that the agent can explain the outcome to the user.
type ToolMessage record {|
    # Machine-readable outcome
    "NOT_FOUND"|"INVALID_INPUT"|"NOT_ALLOWED" outcome;
    # Human-readable explanation
    string message;
|};
```

Each operation validates its input and enforces its business rules on the server, regardless of what the tool description tells the model. For example, a return request is accepted only for a delivered order, and only once per order.

```ballerina
# Creates a return request for a delivered order. Only one return request is allowed per order.
#
# + orderId - The order ID
# + reason - The reason for the return
# + return - The return request, or a `ToolMessage` if the request is not allowed
isolated function createReturnRequest(string orderId, string reason) returns ReturnRequest|ToolMessage {
    OrderStatus|ToolMessage status = findOrderStatus(orderId);
    if status is ToolMessage {
        return status;
    }
    if status.state != "DELIVERED" {
        return {
            outcome: "NOT_ALLOWED",
            message: string `Order ${orderId} is ${status.state}. Only delivered orders can be returned.`
        };
    }
    string trimmedReason = reason.trim();
    if trimmedReason.length() == 0 || trimmedReason.length() > MAX_REASON_LENGTH {
        return {
            outcome: "INVALID_INPUT",
            message: string `The reason must have between 1 and ${MAX_REASON_LENGTH} characters`
        };
    }
    lock {
        ReturnRequest? existing = returnRequests[orderId];
        if existing is ReturnRequest {
            return {
                outcome: "NOT_ALLOWED",
                message: string `Return request ${existing.returnId} already exists for order ${orderId}`
            };
        }
        ReturnRequest request = {
            returnId: string `RET-${returnRequests.length() + 1}`,
            orderId,
            reason: trimmedReason,
            createdAt: time:utcToString(time:utcNow())
        };
        returnRequests[orderId] = request;
        return request.cloneReadOnly();
    }
}
```

See [the complete `store.bal` file](#the-complete-storebal-file) for the remaining operations.

### Define the MCP service

Create an MCP listener and attach an MCP service to it. Each `remote` function of the service becomes a tool. The tool name is the function name, the tool description is the function documentation, and the input schema is generated from the parameter types and their `+ parameter` documentation. Parameters must be subtypes of `anydata`, and return types must be subtypes of `anydata|error`.

```ballerina
import ballerina/log;
import ballerina/mcp;

configurable int port = 9090;

listener mcp:StreamableHttpListener mcpListener = new (port);

@mcp:StreamableHttpServiceConfig {
    info: {name: "customer-care-tools", version: "1.0.0"},
    sessionMode: mcp:STATELESS
}
service mcp:StreamableHttpService /mcp on mcpListener {
    // ...
}
```

The service uses the Streamable HTTP transport of MCP, so the server endpoint is `http://localhost:9090/mcp`. The `@mcp:StreamableHttpServiceConfig` annotation sets the server name and version that are sent to clients when they connect.

`sessionMode: mcp:STATELESS` makes every request independent. The tools in this guide do not keep state between calls, so the server does not need sessions, and clients keep working after the server restarts. Use `mcp:STATEFUL` only if your tools need per-client state, which they can access through an optional `mcp:Session` first parameter.

>**Tip:** To serve MCP and other HTTP services on the same port, pass an existing `http:Listener` to the `mcp:StreamableHttpListener` instead of a port number.

### Write the tool descriptions

The model decides which tool to call, and with which arguments, based only on the descriptions and the input schema. Write the description of each tool so that it says what the tool does and when to use it, and describe the expected format of each parameter.

```ballerina
    # Submit a return request for a delivered order. Only call this after the customer
    # has confirmed that they want to return the order and has given a reason.
    #
    # + orderId - Order ID in the format ORD-NNNN (for example ORD-1001)
    # + reason - The reason for the return in the customer's words
    # + return - The created return request, or an explanation if the return is not allowed
    remote function submitReturnRequest(string orderId, string reason) returns ReturnRequest|ToolMessage {
        log:printInfo("Tool called", tool = "submitReturnRequest", orderId = orderId);
        return createReturnRequest(orderId, reason);
    }
```

The generated tool definition looks like this:

```json
{
  "name": "submitReturnRequest",
  "description": "Submit a return request for a delivered order. Only call this after the customer has confirmed that they want to return the order and has given a reason. ",
  "inputSchema": {
    "type": "object",
    "required": ["orderId", "reason"],
    "properties": {
      "reason": {"type": "string", "description": "The reason for the return in the customer's words"},
      "orderId": {"type": "string", "description": "Order ID in the format ORD-NNNN (for example ORD-1001)"}
    }
  }
}
```

>**Note:** A description such as "only call this after the customer has confirmed" guides the model, but does not enforce anything. Always enforce rules, such as the order state, in the tool implementation.

To override the generated description or input schema of a tool, for example to add an `enum` or a range for a parameter, use the `@mcp:Tool` annotation. If the set of tools is only known at runtime, implement an `mcp:AdvancedService` with `onListTools` and `onCallTool` methods instead. See [MCP advanced service](/learn/by-example/mcp-service-advanced/).

### Handle tool failures

A tool call can fail in three ways. Handle each one differently.

| Failure | What the client receives | How to handle it |
|---|---|---|
| Expected business outcome, such as an unknown order | A normal tool result, such as `{"outcome":"NOT_FOUND","message":"No order found with ID ORD-9999"}` | Return a `ToolMessage` value, as shown above. The model can explain it to the user. |
| Arguments that do not match the input schema | A tool result with `isError: true` and a message such as `missing required argument 'orderId'` | Handled by the MCP listener before your function runs. Keep parameter descriptions precise so that the model sends valid arguments. |
| Unexpected failure, such as a database outage | A tool result with `isError: true` | Return an `error` from the tool. The listener logs the error. Do not rely on its message reaching the client, and do not put internal details in it. |

### Test the tools

Because the operations are plain functions, you can test them without an MCP client. You can also test the MCP service itself, because `bal test` starts the services of the package before running the tests.

Create a `tests/store_test.bal` file in the `customer_care_mcp_server` package to test the business rules.

```ballerina
import ballerina/test;

@test:Config
function testSearchFindsProductsByName() {
    Product[]|ToolMessage result = findProducts("Headphones");
    if result is ToolMessage {
        test:assertFail(result.message);
    }
    test:assertEquals(result.map(product => product.sku), ["HP-100", "HP-200"]);
}

@test:Config
function testShortSearchTextIsRejected() {
    Product[]|ToolMessage result = findProducts(" h ");
    test:assertTrue(result is ToolMessage && result.outcome == "INVALID_INPUT");
}

@test:Config
function testOrderStatusLeavesOutCustomerEmail() {
    OrderStatus|ToolMessage result = findOrderStatus("ORD-1002");
    if result is ToolMessage {
        test:assertFail(result.message);
    }
    test:assertEquals(result.state, "SHIPPED");
    test:assertFalse(result.toJson().toJsonString().includes("@example.com"));
}

@test:Config
function testUnknownAndMalformedOrderIds() {
    OrderStatus|ToolMessage unknown = findOrderStatus("ORD-9999");
    test:assertTrue(unknown is ToolMessage && unknown.outcome == "NOT_FOUND");
    OrderStatus|ToolMessage malformed = findOrderStatus("1001");
    test:assertTrue(malformed is ToolMessage && malformed.outcome == "INVALID_INPUT");
}

@test:Config
function testReturnRequestRules() {
    ReturnRequest|ToolMessage notDelivered = createReturnRequest("ORD-1002", "Changed my mind");
    test:assertTrue(notDelivered is ToolMessage && notDelivered.outcome == "NOT_ALLOWED");

    ReturnRequest|ToolMessage noReason = createReturnRequest("ORD-1001", "  ");
    test:assertTrue(noReason is ToolMessage && noReason.outcome == "INVALID_INPUT");

    ReturnRequest|ToolMessage created = createReturnRequest("ORD-1001", "Arrived damaged");
    if created is ToolMessage {
        test:assertFail(created.message);
    }
    test:assertEquals(created.orderId, "ORD-1001");

    ReturnRequest|ToolMessage duplicate = createReturnRequest("ORD-1001", "Arrived damaged");
    test:assertTrue(duplicate is ToolMessage && duplicate.outcome == "NOT_ALLOWED");
}

@test:Config
function testRefundAmountIsOrderTotal() {
    Refund|ToolMessage refund = createRefund("ORD-1002");
    test:assertEquals(refund, {orderId: "ORD-1002", amount: 59.49d});
}
```

Create a `tests/mcp_test.bal` file that connects to the running service with an `mcp:StreamableHttpClient`, lists the tools, and calls one of them over MCP.

```ballerina
import ballerina/mcp;
import ballerina/test;

@test:Config
function testServerAdvertisesTools() returns error? {
    mcp:StreamableHttpClient mcpClient = check new (string `http://localhost:${port}/mcp`);
    check mcpClient->initialize({name: "test-client", version: "1.0.0"});

    mcp:ListToolsResult tools = check mcpClient->listTools();
    string[] names = from mcp:ToolDefinition tool in tools.tools
        order by tool.name
        select tool.name;
    test:assertEquals(names, ["getOrderStatus", "issueRefund", "searchProducts", "submitReturnRequest"]);

    mcp:CallToolResult result = check mcpClient->callTool({
        name: "getOrderStatus",
        arguments: {"orderId": "ORD-1003"}
    });
    mcp:ContentBlock content = result.content[0];
    test:assertTrue(content is mcp:TextContent && content.text.includes("PROCESSING"));
    check mcpClient->close();
}
```

Add a `tests/Config.toml` file so that the tests use a different port from a server that you may already be running.

```toml
port = 9191
```

Run the tests from the `customer_care_mcp_server` directory.

```
$ bal test
```

```
Running Tests

	customer_care_mcp_server
		[pass] testOrderStatusLeavesOutCustomerEmail
		[pass] testRefundAmountIsOrderTotal
		[pass] testReturnRequestRules
		[pass] testSearchFindsProductsByName
		[pass] testServerAdvertisesTools
		[pass] testShortSearchTextIsRejected
		[pass] testUnknownAndMalformedOrderIds

		7 passing
		0 failing
		0 skipped
```

### Run and inspect the server

Execute the command below from the `customer_care_mcp_server` directory.

```
$ bal run
```

```
Compiling source
        <org>/customer_care_mcp_server:0.1.0

Running executable
```

MCP messages are JSON-RPC requests that are sent with `POST` to the server endpoint. Clients must accept both `application/json` and `text/event-stream`. List the tools with `curl`.

```
$ curl -X POST http://localhost:9090/mcp \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

The response contains the four tools and their input schemas. Call a tool with a `tools/call` request.

```
$ curl -X POST http://localhost:9090/mcp \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"getOrderStatus","arguments":{"orderId":"ORD-1002"}}}'
```

```
{"jsonrpc":"2.0", "id":2, "result":{"content":[{"type":"text", "text":"{\"orderId\":\"ORD-1002\",\"state\":\"SHIPPED\",\"skus\":[\"SP-300\",\"CB-400\"],\"placedOn\":\"2026-10-05\",\"deliveredOn\":null}"}]}}
```

To browse and call the tools interactively, use the <a href="https://modelcontextprotocol.io/docs/tools/inspector" target="_blank">MCP Inspector</a>, which requires Node.js.

```
$ npx @modelcontextprotocol/inspector
```

In the Inspector, select **Streamable HTTP** as the transport type, enter `http://localhost:9090/mcp` as the URL, and connect. Then list the tools and run them with test arguments. Any other MCP client, such as an MCP-enabled IDE or desktop assistant, connects with the same URL.

>**Info: Requires tooling.** WSO2 Integrator and the Ballerina VS Code extension can also create an MCP service visually (**Add Artifact** > **MCP Service**) and call its tools with the **Try It** option in the MCP service editor. The generated code uses the same `ballerina/mcp` APIs as this guide.

## Build the agent

### Configure the agent service

The agent service needs the OpenAI API key and the URL of the MCP server. Declare them as [configurable variables](/learn/configure-a-sample-ballerina-service/), so that each environment can provide its own values. `mcpTimeout` is the time, in seconds, that the toolkit waits for each MCP request.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable string mcpServerUrl = "http://localhost:9090/mcp";
configurable decimal mcpTimeout = 30;
configurable int port = 8080;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);
```

Create a `Config.toml` file in the `customer_care_agent` directory.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
mcpServerUrl = "http://localhost:9090/mcp"
```

>**Note:** Do not commit `Config.toml` files that contain secrets. In deployed environments, provide the values through environment variables or a secret store instead. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

### Connect to the MCP server with a filtered toolkit

Create an `ai:McpToolKit` with the server URL and the list of tools that the agent may use. The toolkit connects to the server, lists its tools, and keeps only the permitted ones. If you pass `()` instead of a list, the agent gets every tool the server advertises, including tools added to the server later.

```ballerina
// The MCP server tools that this agent may use. `issueRefund` is a back-office
// tool, so it is not given to the customer-facing agent.
final string[] & readonly permittedTools = ["searchProducts", "getOrderStatus", "submitReturnRequest"];

# Connects to the MCP server and loads only the permitted tools.
#
# + serverUrl - The URL of the MCP server endpoint
# + return - The toolkit, or an error if the server cannot be reached or initialized
isolated function createMcpToolKit(string serverUrl) returns ai:McpToolKit|ai:Error {
    return new (serverUrl, permittedTools, {name: "customer-care-agent", version: "1.0.0"}, timeout = mcpTimeout);
}
```

Filtering the tools has the following benefits:

- **Security**: The customer-facing agent cannot call `issueRefund`, even if a user asks it to.
- **Accuracy**: The model chooses more reliably among fewer tools.
- **Cost**: The schema of every tool is sent to the model with every request, so fewer tools mean smaller prompts.

The third argument identifies the client to the server. The toolkit also accepts HTTP client settings, such as `timeout`, `retryConfig`, `secureSocket`, and `auth`, as named arguments.

### Create the agent

Create the agent with a system prompt, the model provider, and the toolkit. The `tools` array can mix MCP toolkits, local function tools, and other toolkits, and the model sees one combined list of tools.

The toolkit connects to the MCP server when it is created. If it were created at module level, the agent service could not start while the MCP server is down. Instead, create the agent on first use and keep it in an `isolated` variable. If the MCP server cannot be reached, `getAgent` returns the error, and the next request tries again.

```ballerina
// Created on first use, so that the service starts even if the MCP server is not up yet.
isolated ai:Agent? customerCareAgent = ();

# Returns the agent, creating it and connecting to the MCP server on first use.
# If the MCP server cannot be reached, the error is returned and the next call tries again.
#
# + return - The agent, or an error if the MCP server cannot be reached
isolated function getAgent() returns ai:Agent|ai:Error {
    lock {
        ai:Agent? existing = customerCareAgent;
        if existing is ai:Agent {
            return existing;
        }
        ai:McpToolKit toolKit = check createMcpToolKit(mcpServerUrl);
        ai:Agent agent = check new (
            systemPrompt = {
                role: "Customer Care Agent",
                instructions: string `You help customers of an online store with product availability,
                    order status, and returns. Always use the tools to look up products and orders
                    instead of guessing. If a tool returns an outcome such as NOT_FOUND or NOT_ALLOWED,
                    explain it to the customer in plain words. Before you submit a return request,
                    confirm the order ID and the reason with the customer. Include order IDs and return
                    IDs in your replies. Keep replies short.`
            },
            model = model,
            tools = [toolKit],
            maxIter = 10
        );
        customerCareAgent = agent;
        return agent;
    }
}
```

`maxIter` limits the number of reasoning steps in one run, which bounds the number of model and tool calls for a single request.

>**Note:** The toolkit reads the tool list once, when it is created. If tools are added to or changed on the server, restart the agent service to pick them up.

### Expose the agent over HTTP

Add an HTTP service with a `POST` resource. The session ID identifies the conversation, so the agent keeps the history of each customer's conversation separately. Validate the request before using the agent, so that invalid requests do not cost a model call.

```ballerina
type ChatRequest record {|
    string sessionId;
    string message;
|};

type ChatResponse record {|
    string reply;
|};

service /support on new http:Listener(port) {
    resource function post chat(ChatRequest request)
            returns ChatResponse|http:BadRequest|http:BadGateway|http:ServiceUnavailable {
        string? invalid = validateChatRequest(request);
        if invalid is string {
            return <http:BadRequest>{body: invalid};
        }

        ai:Agent|ai:Error agent = getAgent();
        if agent is ai:Error {
            log:printError("Cannot connect to the MCP server", agent, serverUrl = mcpServerUrl);
            return <http:ServiceUnavailable>{body: "Customer care is temporarily unavailable. Try again later."};
        }

        string|ai:Error reply = agent.run(request.message, request.sessionId);
        if reply is ai:Error {
            log:printError("Agent run failed", reply, sessionId = request.sessionId);
            return toErrorResponse(reply);
        }
        return {reply};
    }
}
```

```ballerina
# Validates a chat request before it is sent to the agent.
#
# + request - The chat request
# + return - An error message if the request is invalid, or `()` otherwise
isolated function validateChatRequest(ChatRequest request) returns string? {
    if !re `[A-Za-z0-9_-]{1,64}`.isFullMatch(request.sessionId) {
        return "sessionId must have 1 to 64 letters, digits, '-', or '_'";
    }
    string message = request.message.trim();
    if message.length() == 0 || message.length() > MAX_MESSAGE_LENGTH {
        return string `message must have between 1 and ${MAX_MESSAGE_LENGTH} characters`;
    }
    return ();
}
```

### Handle failures

Failures can occur at several points between the caller, the agent, the model, and the MCP server.

| Failure | Where it surfaces | Response |
|---|---|---|
| Invalid request | `validateChatRequest` | `400 Bad Request` |
| MCP server unreachable when the agent is created | `getAgent` returns an `ai:Error` | `503 Service Unavailable`; the next request retries |
| MCP server unreachable or tool error during a run | The tool result | Returned to the model as the tool's result, so that it can retry or tell the user it could not complete the action |
| Model unreachable or rejects the request | `agent.run` returns an `ai:Error` | `503 Service Unavailable` |
| Agent reaches `maxIter` | `ai:MaxIterationExceededError` | `502 Bad Gateway` |
| Any other agent error | `ai:Error` | `502 Bad Gateway` |

When a run fails, the agent returns an `ai:Error` whose `steps` detail holds the result or error of each step. To tell whether the model could not be reached, look for an `ai:LlmConnectionError` among the steps. The details are logged for operators, but not returned to the caller.

```ballerina
# Maps an agent error to an HTTP response without exposing internal details.
#
# + err - The error returned by the agent
# + return - `503 Service Unavailable` if the model cannot be reached, `502 Bad Gateway` otherwise
isolated function toErrorResponse(ai:Error err) returns http:BadGateway|http:ServiceUnavailable {
    if isModelUnreachable(err) {
        return <http:ServiceUnavailable>{body: "Customer care is temporarily unavailable. Try again later."};
    }
    if err is ai:MaxIterationExceededError {
        return <http:BadGateway>{body: "The request could not be completed. Try a more specific question."};
    }
    return <http:BadGateway>{body: "The request could not be completed."};
}

# Checks whether an agent error was caused by a failure to connect to the model.
# The agent reports a failed run as an `ai:Error` whose `steps` detail holds the error of each step.
#
# + err - The error returned by the agent
# + return - `true` if the model could not be reached
isolated function isModelUnreachable(ai:Error err) returns boolean {
    if err is ai:LlmConnectionError {
        return true;
    }
    anydata|readonly steps = err.detail()["steps"];
    if steps is readonly & (any|error)[] {
        foreach any|error step in steps {
            if step is ai:LlmConnectionError {
                return true;
            }
        }
    }
    return false;
}
```

>**Note:** An invalid or expired API key is also reported as an `ai:LlmConnectionError`. Check the logs to tell it apart from a network failure.

### Test the agent package

The agent's model calls cannot be tested deterministically, but its wiring can. Create a `tests/mock_mcp_server.bal` file in the `customer_care_agent` package with an MCP service that has the same tool names as the real server. `bal test` starts it before running the tests.

```ballerina
import ballerina/mcp;

// A stand-in for the customer care MCP server, with the same tool names.
service mcp:StreamableHttpService /mcp on new mcp:StreamableHttpListener(9292) {
    remote function searchProducts(string query) returns json => [];
    remote function getOrderStatus(string orderId) returns json => {};
    remote function submitReturnRequest(string orderId, string reason) returns json => {};
    remote function issueRefund(string orderId) returns json => {};
}
```

Create a `tests/agent_test.bal` file. The tests check that the toolkit loads only the permitted tools from the mock server, that an unreachable MCP server results in an error and a `503` response, and that requests and errors are mapped as expected. None of them call the model.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/test;

@test:Config
function testOnlyPermittedToolsAreLoaded() returns error? {
    ai:McpToolKit toolKit = check createMcpToolKit("http://localhost:9292/mcp");
    string[] names = from ai:ToolConfig tool in toolKit.getTools()
        order by tool.name
        select tool.name;
    test:assertEquals(names, ["getOrderStatus", "searchProducts", "submitReturnRequest"]);
}

@test:Config
function testUnreachableMcpServerReturnsError() {
    ai:McpToolKit|ai:Error toolKit = createMcpToolKit("http://localhost:9393/mcp");
    test:assertTrue(toolKit is ai:Error);
}

@test:Config
function testChatReturns503WhenMcpServerIsDown() returns error? {
    http:Client supportClient = check new (string `http://localhost:${port}/support`);
    http:Response response = check supportClient->post("/chat", {sessionId: "s-1", message: "Where is ORD-1002?"});
    test:assertEquals(response.statusCode, 503);
}

@test:Config
function testInvalidChatRequestsAreRejected() {
    test:assertTrue(validateChatRequest({sessionId: "s-1", message: "Hi"}) is ());
    test:assertTrue(validateChatRequest({sessionId: "", message: "Hi"}) is string);
    test:assertTrue(validateChatRequest({sessionId: "s 1", message: "Hi"}) is string);
    test:assertTrue(validateChatRequest({sessionId: "s-1", message: "   "}) is string);
}

@test:Config
function testAgentErrorsMapToHttpStatus() {
    test:assertTrue(toErrorResponse(error ai:LlmConnectionError("timeout")) is http:ServiceUnavailable);
    ai:Error failedRun = error ai:Error("Unable to obtain valid answer from the agent",
        steps = [error ai:LlmConnectionError("Error while connecting to the model")]);
    test:assertTrue(toErrorResponse(failedRun) is http:ServiceUnavailable);
    test:assertTrue(toErrorResponse(error ai:MaxIterationExceededError("limit", steps = [])) is http:BadGateway);
    test:assertTrue(toErrorResponse(error ai:Error("other")) is http:BadGateway);
}
```

The module-level model provider is initialized when the tests run, so add a `tests/Config.toml` file with a placeholder key. `mcpServerUrl` points to a port where nothing listens, to simulate an MCP server that is down.

```toml
openAiApiKey = "test-key"
# Nothing listens on this port, so the agent cannot connect to an MCP server.
mcpServerUrl = "http://localhost:9393/mcp"
port = 9595
```

Run the tests from the `customer_care_agent` directory.

```
$ bal test
```

```
Running Tests

	customer_care_agent
		[pass] testAgentErrorsMapToHttpStatus
		[pass] testChatReturns503WhenMcpServerIsDown
		[pass] testInvalidChatRequestsAreRejected
		[pass] testOnlyPermittedToolsAreLoaded
		[pass] testUnreachableMcpServerReturnsError

		5 passing
		0 failing
		0 skipped
```

The `testChatReturns503WhenMcpServerIsDown` test logs a `Cannot connect to the MCP server` error. This is expected.

## Secure the MCP endpoint

The server in this guide accepts requests from any client that can reach it. Before you expose MCP tools beyond your machine, require authentication. The `httpConfig` field of `@mcp:StreamableHttpServiceConfig` accepts the same settings as `@http:ServiceConfig`, including `auth`. For example, to accept only JWTs issued by your identity provider with the `customer_care` scope, change the service annotation as follows.

```ballerina
configurable string tokenIssuer = ?;
configurable string jwksUrl = ?;

@mcp:StreamableHttpServiceConfig {
    info: {name: "customer-care-tools", version: "1.0.0"},
    sessionMode: mcp:STATELESS,
    httpConfig: {
        auth: [
            {
                jwtValidatorConfig: {
                    issuer: tokenIssuer,
                    audience: "customer-care-tools",
                    signatureConfig: {jwksConfig: {url: jwksUrl}}
                },
                scopes: ["customer_care"]
            }
        ]
    }
}
```

Requests without a valid token are rejected with `401 Unauthorized`. On the agent side, pass the client credentials to the toolkit with the `auth` argument. The toolkit obtains a token from the token endpoint and sends it with each MCP request.

```ballerina
configurable string tokenUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

isolated function createMcpToolKit(string serverUrl) returns ai:McpToolKit|ai:Error {
    return new (serverUrl, permittedTools, {name: "customer-care-agent", version: "1.0.0"},
        timeout = mcpTimeout,
        auth = {tokenUrl, clientId, clientSecret, scopes: ["customer_care"]}
    );
}
```

For the other supported authentication methods, see [HTTP service - JWT authentication](/learn/by-example/http-service-jwt-authentication/), [HTTP service - OAuth2](/learn/by-example/http-service-oauth2/), [HTTP client - OAuth2 client credentials grant type](/learn/by-example/http-client-oauth2-client-credentials-grant-type/), and [HTTP client - Bearer token authentication](/learn/by-example/http-client-bearer-token-authentication/).

Also consider the following:

- **Least privilege**: Give each agent only the tools it needs, with the `permittedTools` list, and give each client its own credentials and scopes.
- **Data exposure**: Tool results are sent to the model provider as part of the prompt. Return only the fields the client needs, as `OrderStatus` does.
- **Transport security**: Configure TLS on the listener with the `secureSocket` field of the `mcp:StreamableHttpListener` configuration.
- **Audit**: Log tool calls on the server, as the tools in this guide do, without logging sensitive arguments.

For more on securing and observing AI integrations, see [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/).

## The complete sample code

### The complete `store.bal` file

The `customer_care_mcp_server/store.bal` file:

```ballerina
import ballerina/time;

# A product in the catalog.
type Product record {|
    # Stock keeping unit (SKU) that identifies the product
    string sku;
    # Display name of the product
    string name;
    # Unit price in USD
    decimal price;
    # Number of units available to ship
    int unitsInStock;
|};

# Order lifecycle states.
type OrderState "PROCESSING"|"SHIPPED"|"DELIVERED"|"CANCELLED";

# An order as stored in the order management system.
type Order record {|
    # Order ID
    string orderId;
    # Email address of the customer
    string customerEmail;
    # Current state of the order
    OrderState state;
    # SKUs of the items in the order
    string[] skus;
    # Date on which the order was placed (YYYY-MM-DD)
    string placedOn;
    # Date on which the order was delivered (YYYY-MM-DD)
    string? deliveredOn;
|};

# The order details that are shared with clients. Customer contact data is left out.
type OrderStatus record {|
    # Order ID, such as `ORD-1001`
    string orderId;
    # Current state of the order
    OrderState state;
    # SKUs of the items in the order
    string[] skus;
    # Date on which the order was placed (YYYY-MM-DD)
    string placedOn;
    # Date on which the order was delivered (YYYY-MM-DD), if it has been delivered
    string? deliveredOn;
|};

# A return request created for a delivered order.
type ReturnRequest record {|
    # Return request ID, such as `RET-1`
    string returnId;
    # Order ID that the return is for
    string orderId;
    # Reason given by the customer
    string reason;
    # Date and time at which the request was created (RFC 3339)
    string createdAt;
|};

# A refund issued for an order.
type Refund record {|
    # Order ID that the refund is for
    string orderId;
    # Refunded amount in USD
    decimal amount;
|};

# An expected business outcome that is not a success, such as an unknown order.
# Tools return this as a value so that the agent can explain the outcome to the user.
type ToolMessage record {|
    # Machine-readable outcome
    "NOT_FOUND"|"INVALID_INPUT"|"NOT_ALLOWED" outcome;
    # Human-readable explanation
    string message;
|};

const MAX_SEARCH_RESULTS = 5;
const MAX_REASON_LENGTH = 500;

final readonly & Product[] products = [
    {sku: "HP-100", name: "Wireless headphones", price: 79.99, unitsInStock: 12},
    {sku: "HP-200", name: "Noise-cancelling wireless headphones", price: 199.00, unitsInStock: 0},
    {sku: "SP-300", name: "Portable Bluetooth speaker", price: 49.50, unitsInStock: 30},
    {sku: "CB-400", name: "USB-C charging cable", price: 9.99, unitsInStock: 250}
];

final readonly & map<Order> orders = {
    "ORD-1001": {orderId: "ORD-1001", customerEmail: "ann@example.com", state: "DELIVERED",
        skus: ["HP-100"], placedOn: "2026-09-20", deliveredOn: "2026-09-24"},
    "ORD-1002": {orderId: "ORD-1002", customerEmail: "raj@example.com", state: "SHIPPED",
        skus: ["SP-300", "CB-400"], placedOn: "2026-10-05", deliveredOn: ()},
    "ORD-1003": {orderId: "ORD-1003", customerEmail: "li@example.com", state: "PROCESSING",
        skus: ["CB-400"], placedOn: "2026-10-09", deliveredOn: ()}
};

isolated map<ReturnRequest> returnRequests = {};

# Searches the catalog for products whose name contains the given text.
#
# + query - Text to search for
# + return - Matching products, or a `ToolMessage` if the query is invalid
isolated function findProducts(string query) returns Product[]|ToolMessage {
    string term = query.trim().toLowerAscii();
    if term.length() < 2 {
        return {outcome: "INVALID_INPUT", message: "The search text must have at least 2 characters"};
    }
    Product[] matches = from Product product in products
        where product.name.toLowerAscii().includes(term)
        limit MAX_SEARCH_RESULTS
        select product;
    return matches;
}

# Returns the status of an order without customer contact data.
#
# + orderId - The order ID
# + return - The order status, or a `ToolMessage` if the order ID is invalid or unknown
isolated function findOrderStatus(string orderId) returns OrderStatus|ToolMessage {
    ToolMessage? invalid = validateOrderId(orderId);
    if invalid is ToolMessage {
        return invalid;
    }
    Order? 'order = orders[orderId];
    if 'order is () {
        return {outcome: "NOT_FOUND", message: string `No order found with ID ${orderId}`};
    }
    return {
        orderId: 'order.orderId,
        state: 'order.state,
        skus: 'order.skus,
        placedOn: 'order.placedOn,
        deliveredOn: 'order.deliveredOn
    };
}

# Creates a return request for a delivered order. Only one return request is allowed per order.
#
# + orderId - The order ID
# + reason - The reason for the return
# + return - The return request, or a `ToolMessage` if the request is not allowed
isolated function createReturnRequest(string orderId, string reason) returns ReturnRequest|ToolMessage {
    OrderStatus|ToolMessage status = findOrderStatus(orderId);
    if status is ToolMessage {
        return status;
    }
    if status.state != "DELIVERED" {
        return {
            outcome: "NOT_ALLOWED",
            message: string `Order ${orderId} is ${status.state}. Only delivered orders can be returned.`
        };
    }
    string trimmedReason = reason.trim();
    if trimmedReason.length() == 0 || trimmedReason.length() > MAX_REASON_LENGTH {
        return {
            outcome: "INVALID_INPUT",
            message: string `The reason must have between 1 and ${MAX_REASON_LENGTH} characters`
        };
    }
    lock {
        ReturnRequest? existing = returnRequests[orderId];
        if existing is ReturnRequest {
            return {
                outcome: "NOT_ALLOWED",
                message: string `Return request ${existing.returnId} already exists for order ${orderId}`
            };
        }
        ReturnRequest request = {
            returnId: string `RET-${returnRequests.length() + 1}`,
            orderId,
            reason: trimmedReason,
            createdAt: time:utcToString(time:utcNow())
        };
        returnRequests[orderId] = request;
        return request.cloneReadOnly();
    }
}

# Issues a full refund for an order. This is a back-office operation.
#
# + orderId - The order ID
# + return - The refund, or a `ToolMessage` if the order ID is invalid or unknown
isolated function createRefund(string orderId) returns Refund|ToolMessage {
    ToolMessage? invalid = validateOrderId(orderId);
    if invalid is ToolMessage {
        return invalid;
    }
    Order? 'order = orders[orderId];
    if 'order is () {
        return {outcome: "NOT_FOUND", message: string `No order found with ID ${orderId}`};
    }
    decimal amount = 0;
    foreach string sku in 'order.skus {
        foreach Product product in products {
            if product.sku == sku {
                amount += product.price;
            }
        }
    }
    return {orderId, amount};
}

isolated function validateOrderId(string orderId) returns ToolMessage? {
    if !re `ORD-[0-9]{4}`.isFullMatch(orderId) {
        return {outcome: "INVALID_INPUT", message: "Order IDs have the format ORD-NNNN, such as ORD-1001"};
    }
    return ();
}
```

### The complete MCP `service.bal` file

The `customer_care_mcp_server/service.bal` file:

```ballerina
import ballerina/log;
import ballerina/mcp;

configurable int port = 9090;

listener mcp:StreamableHttpListener mcpListener = new (port);

@mcp:StreamableHttpServiceConfig {
    info: {name: "customer-care-tools", version: "1.0.0"},
    sessionMode: mcp:STATELESS
}
service mcp:StreamableHttpService /mcp on mcpListener {

    # Search the product catalog by product name and return the price and the number of units in stock.
    # Use this to answer questions about product availability or price.
    #
    # + query - Part of the product name to search for (at least 2 characters)
    # + return - Up to 5 matching products, or an explanation if the query is invalid
    remote function searchProducts(string query) returns Product[]|ToolMessage {
        log:printInfo("Tool called", tool = "searchProducts", query = query);
        return findProducts(query);
    }

    # Get the current status of an order. Use this when a customer asks where an order is.
    #
    # + orderId - Order ID in the format ORD-NNNN (for example ORD-1001)
    # + return - The order status, or an explanation if the order is not found
    remote function getOrderStatus(string orderId) returns OrderStatus|ToolMessage {
        log:printInfo("Tool called", tool = "getOrderStatus", orderId = orderId);
        return findOrderStatus(orderId);
    }

    # Submit a return request for a delivered order. Only call this after the customer
    # has confirmed that they want to return the order and has given a reason.
    #
    # + orderId - Order ID in the format ORD-NNNN (for example ORD-1001)
    # + reason - The reason for the return in the customer's words
    # + return - The created return request, or an explanation if the return is not allowed
    remote function submitReturnRequest(string orderId, string reason) returns ReturnRequest|ToolMessage {
        log:printInfo("Tool called", tool = "submitReturnRequest", orderId = orderId);
        return createReturnRequest(orderId, reason);
    }

    # Issue a full refund for an order. For back-office staff only.
    #
    # + orderId - Order ID in the format ORD-NNNN (for example ORD-1001)
    # + return - The issued refund, or an explanation if the order is not found
    remote function issueRefund(string orderId) returns Refund|ToolMessage {
        log:printInfo("Tool called", tool = "issueRefund", orderId = orderId);
        return createRefund(orderId);
    }
}
```

### The complete agent `service.bal` file

The `customer_care_agent/service.bal` file:

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable string mcpServerUrl = "http://localhost:9090/mcp";
configurable decimal mcpTimeout = 30;
configurable int port = 8080;

const MAX_MESSAGE_LENGTH = 2000;

// The MCP server tools that this agent may use. `issueRefund` is a back-office
// tool, so it is not given to the customer-facing agent.
final string[] & readonly permittedTools = ["searchProducts", "getOrderStatus", "submitReturnRequest"];

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

// Created on first use, so that the service starts even if the MCP server is not up yet.
isolated ai:Agent? customerCareAgent = ();

type ChatRequest record {|
    string sessionId;
    string message;
|};

type ChatResponse record {|
    string reply;
|};

service /support on new http:Listener(port) {
    resource function post chat(ChatRequest request)
            returns ChatResponse|http:BadRequest|http:BadGateway|http:ServiceUnavailable {
        string? invalid = validateChatRequest(request);
        if invalid is string {
            return <http:BadRequest>{body: invalid};
        }

        ai:Agent|ai:Error agent = getAgent();
        if agent is ai:Error {
            log:printError("Cannot connect to the MCP server", agent, serverUrl = mcpServerUrl);
            return <http:ServiceUnavailable>{body: "Customer care is temporarily unavailable. Try again later."};
        }

        string|ai:Error reply = agent.run(request.message, request.sessionId);
        if reply is ai:Error {
            log:printError("Agent run failed", reply, sessionId = request.sessionId);
            return toErrorResponse(reply);
        }
        return {reply};
    }
}

# Returns the agent, creating it and connecting to the MCP server on first use.
# If the MCP server cannot be reached, the error is returned and the next call tries again.
#
# + return - The agent, or an error if the MCP server cannot be reached
isolated function getAgent() returns ai:Agent|ai:Error {
    lock {
        ai:Agent? existing = customerCareAgent;
        if existing is ai:Agent {
            return existing;
        }
        ai:McpToolKit toolKit = check createMcpToolKit(mcpServerUrl);
        ai:Agent agent = check new (
            systemPrompt = {
                role: "Customer Care Agent",
                instructions: string `You help customers of an online store with product availability,
                    order status, and returns. Always use the tools to look up products and orders
                    instead of guessing. If a tool returns an outcome such as NOT_FOUND or NOT_ALLOWED,
                    explain it to the customer in plain words. Before you submit a return request,
                    confirm the order ID and the reason with the customer. Include order IDs and return
                    IDs in your replies. Keep replies short.`
            },
            model = model,
            tools = [toolKit],
            maxIter = 10
        );
        customerCareAgent = agent;
        return agent;
    }
}

# Connects to the MCP server and loads only the permitted tools.
#
# + serverUrl - The URL of the MCP server endpoint
# + return - The toolkit, or an error if the server cannot be reached or initialized
isolated function createMcpToolKit(string serverUrl) returns ai:McpToolKit|ai:Error {
    return new (serverUrl, permittedTools, {name: "customer-care-agent", version: "1.0.0"}, timeout = mcpTimeout);
}

# Validates a chat request before it is sent to the agent.
#
# + request - The chat request
# + return - An error message if the request is invalid, or `()` otherwise
isolated function validateChatRequest(ChatRequest request) returns string? {
    if !re `[A-Za-z0-9_-]{1,64}`.isFullMatch(request.sessionId) {
        return "sessionId must have 1 to 64 letters, digits, '-', or '_'";
    }
    string message = request.message.trim();
    if message.length() == 0 || message.length() > MAX_MESSAGE_LENGTH {
        return string `message must have between 1 and ${MAX_MESSAGE_LENGTH} characters`;
    }
    return ();
}

# Maps an agent error to an HTTP response without exposing internal details.
#
# + err - The error returned by the agent
# + return - `503 Service Unavailable` if the model cannot be reached, `502 Bad Gateway` otherwise
isolated function toErrorResponse(ai:Error err) returns http:BadGateway|http:ServiceUnavailable {
    if isModelUnreachable(err) {
        return <http:ServiceUnavailable>{body: "Customer care is temporarily unavailable. Try again later."};
    }
    if err is ai:MaxIterationExceededError {
        return <http:BadGateway>{body: "The request could not be completed. Try a more specific question."};
    }
    return <http:BadGateway>{body: "The request could not be completed."};
}

# Checks whether an agent error was caused by a failure to connect to the model.
# The agent reports a failed run as an `ai:Error` whose `steps` detail holds the error of each step.
#
# + err - The error returned by the agent
# + return - `true` if the model could not be reached
isolated function isModelUnreachable(ai:Error err) returns boolean {
    if err is ai:LlmConnectionError {
        return true;
    }
    anydata|readonly steps = err.detail()["steps"];
    if steps is readonly & (any|error)[] {
        foreach any|error step in steps {
            if step is ai:LlmConnectionError {
                return true;
            }
        }
    }
    return false;
}
```

## Run the integration

1. Start the MCP server. Execute the command below from the `customer_care_mcp_server` directory.

    ```
    $ bal run
    ```

2. In a second terminal, start the agent service from the `customer_care_agent` directory.

    ```
    $ bal run
    ```

    ```
    Compiling source
            <org>/customer_care_agent:0.1.0

    Running executable
    ```

## Try the integration

Send a chat message to the agent. Because the replies are generated by an LLM, your results will differ. The responses below are illustrative.

```
$ curl -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "cust-42", "message": "Do you have wireless headphones in stock?"}'
{"reply":"Yes. The Wireless headphones (HP-100) are in stock at $79.99. The Noise-cancelling wireless headphones (HP-200) are currently out of stock."}
```

Continue the conversation with the same session ID.

```
$ curl -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "cust-42", "message": "I want to return ORD-1001. It arrived damaged."}'
{"reply":"To confirm: you want to return order ORD-1001 because it arrived damaged. Shall I submit the return request?"}
```

The MCP server logs each tool call, so you can see which tools the agent used in the first terminal.

Ask the agent to issue a refund. `issueRefund` is not in the permitted tools, so the agent cannot call it and does not see it in its tool list.

Verify the failure handling. Send a request with an invalid session ID. It is rejected without calling the model.

```
$ curl -i -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "cust 42", "message": "Hi"}'
HTTP/1.1 400 Bad Request
...
sessionId must have 1 to 64 letters, digits, '-', or '_'
```

Then stop both services, start only the agent service, and send a chat message. Because the agent cannot connect to the MCP server, the service responds with `503 Service Unavailable`. Start the MCP server and send the message again. The agent connects and handles the request without a restart.

```
$ curl -i -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "cust-42", "message": "Where is my order ORD-1002?"}'
HTTP/1.1 503 Service Unavailable
...
Customer care is temporarily unavailable. Try again later.
```

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/)
- [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/)
- [Evaluate agent behavior](/learn/evaluate-agent-behavior/)
- [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/)
- [MCP service](/learn/by-example/mcp-service/) — Ballerina by Example
- [MCP advanced service](/learn/by-example/mcp-service-advanced/) — Ballerina by Example
- [Agent with MCP integration](/learn/by-example/ai-agent-mcp-integration/) — Ballerina by Example
- [Agent with local tools](/learn/by-example/ai-agent-local-tools/) — Ballerina by Example
- [`ballerina/mcp` module](https://lib.ballerina.io/ballerina/mcp/latest/) — API documentation
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
- [Model Context Protocol specification](https://modelcontextprotocol.io)
