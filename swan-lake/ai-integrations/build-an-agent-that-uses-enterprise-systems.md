---
layout: ballerina-build-an-agent-that-uses-enterprise-systems-left-nav-pages-swanlake
title: Build an agent that uses enterprise systems
description: Connect an agent to APIs and connectors using typed tools, configure conversation memory, and handle tool failures.
keywords: ballerina, AI, agent, AI agent, tools, function calling, LLM, memory, HTTP, integration
permalink: /learn/build-an-agent-that-uses-enterprise-systems/
active: build-an-agent-that-uses-enterprise-systems
intro: This guide shows how to build an AI agent that answers questions and takes actions by calling existing enterprise APIs. You define typed tools over an HTTP API, give the agent per-session conversation memory, limit how long it can run, decide which tool failures the model sees and which ones fail the request, and test the tools without calling a model.
---

## The scenario

An online store wants a support assistant that customers can chat with about their orders. The store already has an order management API and a shipment tracking API. The assistant must use those APIs as the source of truth instead of answering from the model's own knowledge.

The requirements are:

- Answer questions about an order's status, items, and delivery by looking up the order and its shipment.
- Cancel an order when the customer asks, but only after the customer confirms, and only if the order has not shipped.
- Remember earlier messages in the same conversation, so that the customer does not have to repeat the order ID.
- Reject malformed input before it reaches a backend system.
- Explain business errors (an unknown order, an order that cannot be cancelled) to the customer, but report an outage of the order system to the caller as an error instead of a chat reply.

## How it works

An agent is a loop around a model. In each iteration, the model receives the conversation and the descriptions of the available tools, and either asks for one or more tool calls or returns the final answer. The agent runs the requested tools, adds their results to the conversation, and calls the model again.

```
POST /support/chat {sessionId, message}
        │
        ▼
┌──────────────────────────────┐            ┌─────────────────────┐
│ HTTP service (:8080)         │            │   LLM (OpenAI)      │
│ 1. validate the request      │            └──────────▲──────────┘
│ 2. agent.run(message,        │                       │ prompt + tool schemas,
│              sessionId, ctx) │──────► ai:Agent ◄─────┘ tool calls
│ 3. map the outcome to HTTP   │          │    │
└──────────────────────────────┘          │    └── ai:ShortTermMemory (history per sessionId)
                                          │
                       ┌──────────────────┼────────────────────────┐
                       ▼                  ▼                        ▼
                  getOrder           cancelOrder              getShipment
               (function tool)     (function tool)      (HTTP service toolkit)
                       │                  │                        │
                       └──────────────────┴───────────┬────────────┘
                                                      ▼
                                   Order and shipment APIs (:9090, mocked)
```

1. The service validates the request and calls the agent with the message, the session ID, and a new `ai:Context`.
2. The agent loads the session's history from memory and calls the model with the system prompt, the history, and the tool schemas.
3. When the model requests a tool call, the agent runs the tool. Function tools validate their input and call the backend through an `http:Client`. The shipment tool is generated from an HTTP resource description by `ai:HttpServiceToolKit`.
4. A tool's return value, including an `error`, is sent back to the model as the tool result. If the backend is unreachable, the tool also records this in the `ai:Context`.
5. The loop ends when the model returns an answer, or fails when it reaches the iteration limit. The service maps the outcome, and any outage recorded in the context, to an HTTP response.

The order and shipment APIs are mocked by a service in the same package, so the sample runs without external systems. In a real deployment, replace the mock with the URL of your API, or replace the `http:Client` with the connector for your system.

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.13.0 (Swan Lake Update 13) or later. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.13.0
    ```

2. Access to an LLM that supports tool calling. This guide uses OpenAI and requires an OpenAI API key. To use a different provider, see [Use a different model provider](#use-a-different-model-provider).

3. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

4. A command terminal.

## Create the package

Ballerina uses packages to group code. In the terminal, execute the command below to create a package for the integration.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new order_support_agent
```

Remove the automatically-created `main.bal` file. By the end of this guide, the package contains the files below.

```
.
├── order_support_agent
│   ├── Ballerina.toml
│   ├── Config.toml
│   ├── agent.bal
│   ├── backend.bal
│   ├── service.bal
│   ├── tools.bal
│   ├── types.bal
│   └── tests
│       ├── Config.toml
│       └── tools_test.bal
```

| File | Contents |
|------|----------|
| `types.bal` | The records exchanged with the backend APIs. |
| `backend.bal` | A mock of the order and shipment APIs. |
| `tools.bal` | The tools that the agent uses to call the APIs. |
| `agent.bal` | The model provider, the memory, and the agent. |
| `service.bal` | The HTTP service that exposes the agent. |

## Configure the model provider

An agent needs an `ai:ModelProvider` value for a model that supports tool calling. Model providers for different LLM services are available as `ballerinax/ai.<provider>` packages, such as [`ballerinax/ai.openai`](https://central.ballerina.io/ballerinax/ai.openai/latest), [`ballerinax/ai.anthropic`](https://central.ballerina.io/ballerinax/ai.anthropic/latest), and [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest).

Declare the API key as a [configurable variable](/learn/configure-a-sample-ballerina-service/) and create the model provider at the module level, so that it is initialized once and shared by all requests. Add the following to `agent.bal`.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);
```

Create a `Config.toml` file in the package root and add the key.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
```

The package declares other configurable variables, all with defaults. Override them in the same file when needed.

| Variable | Default | Purpose |
|----------|---------|---------|
| `orderApiUrl` | `"http://localhost:9090/api"` | Base URL of the order and shipment APIs. |
| `memorySize` | `20` | Maximum number of messages kept per session. |
| `maxIterations` | `5` | Maximum number of model calls per request. |
| `servicePort` | `8080` | Port of the chat service. |
| `backendPort` | `9090` | Port of the mock backend. |

>**Note:** Do not commit `Config.toml` files that contain secrets. In deployed environments, provide the value through an environment variable or a secret store instead. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

### Use a different model provider

The agent depends only on the `ai:ModelProvider` type, so you can switch providers by changing only the import and the initialization. Choose a model that supports tool calling.

The `ballerina/ai` module also provides a default model provider, which lets you try out the agent without your own LLM keys.

```ballerina
final ai:ModelProvider defaultModel = check ai:getDefaultModelProvider();
```

>**Info: Requires tooling.** The configuration for the default model provider is generated by a command in the Ballerina VS Code extension (also available in WSO2 Integrator). Log in to WSO2 Copilot, open the VS Code command palette (`Ctrl + Shift + P` or `command + shift + P`) with the project open, and run `Configure default WSO2 Model Provider`. This adds the required configuration to the `Config.toml` file. The default model provider is subject to rate limits and other usage constraints, so use your own provider for production workloads.

## Implement the integration

### Define the domain types

Define [closed records](/learn/by-example/controlling-openness/) for the data that the backend APIs return. The tools return these types, and the model receives the values as JSON. Add them to `types.bal`.

```ballerina
# The status of an order.
enum OrderStatus {
    PENDING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}

# An item in an order.
type OrderItem record {|
    # The stock-keeping unit of the product
    string sku;
    # The product name
    string name;
    # The number of units ordered
    int quantity;
|};

# An order in the order management system.
type Order record {|
    # The order ID, in the format ORD-1234
    string orderId;
    # The current status of the order
    OrderStatus status;
    # The items in the order
    OrderItem[] items;
    # The order total in USD
    decimal total;
    # The tracking number of the shipment, if the order has shipped
    string trackingNumber?;
|};

# A shipment tracked by the logistics system.
type Shipment record {|
    # The tracking number
    string trackingNumber;
    # The carrier delivering the shipment
    string carrier;
    # The latest shipment status
    string status;
    # The estimated delivery date, in YYYY-MM-DD format
    string estimatedDelivery;
|};

# The payload of a cancellation request.
type CancellationRequest record {|
    # The reason given by the customer
    string reason;
|};

# The error payload returned by the backend APIs.
type ErrorBody record {|
    # A description of the error
    string message;
|};
```

### Add the mock backend

The mock service in `backend.bal` stands in for the order management and shipment tracking systems. It keeps the orders in an [isolated variable](/learn/by-example/isolated-variables/) and returns `404 Not Found` for unknown IDs and `409 Conflict` when an order cannot be cancelled. Each error response has an `ErrorBody` payload. See [the complete code](#the-complete-code) for the file.

### Wrap the API as typed tools

A tool is an `isolated` function annotated with `@ai:AgentTool`. The agent generates the tool's JSON schema from the function's name, parameter types, and documentation, and sends it to the model. The model uses the documentation to decide when to call the tool and what arguments to pass, so describe what the tool does, when to use it, and the format of each parameter.

Create an [HTTP client](/learn/by-example/http-client-data-binding/) for the API, and add a tool that calls it in `tools.bal`. The client binds the response payload directly to `Order`.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;

configurable string orderApiUrl = "http://localhost:9090/api";

const BACKEND_UNAVAILABLE = "backendUnavailable";
const MAX_REASON_LENGTH = 200;

final http:Client orderApi = check new (orderApiUrl, timeout = 10);

# Retrieves an order, including its status, items, total, and tracking number.
#
# + ctx - The agent context, used to report backend outages to the caller
# + orderId - The order ID, in the format ORD-1234
# + return - The order, or an error that describes why it could not be retrieved
@ai:AgentTool
isolated function getOrder(ai:Context ctx, string orderId) returns Order|error {
    check validateOrderId(orderId);
    Order|http:ClientError 'order = orderApi->/orders/[orderId];
    if 'order is http:ClientError {
        return toToolError(ctx, 'order);
    }
    return 'order;
}
```

A tool can declare an `ai:Context` parameter as its first parameter. It is not part of the schema that the model sees. The agent passes the context value given to `run`, which lets the service share request data with the tools and lets the tools report back to the service.

The same pattern applies to [connectors](https://central.ballerina.io/). Call the connector's remote or resource method inside the function and return a typed value, as shown in [Agent with external endpoint integration](/learn/by-example/ai-agent-external-endpoint-integration/). Expose only the operations that the agent needs, instead of every operation of the connector.

>**Tip:** Return only the fields that the model needs. Every field in a tool result is sent to the model provider and counts toward the model's context window.

### Validate tool input

The model chooses tool arguments from the conversation, so treat them as untrusted input. The generated schema enforces the parameter types, but not formats or business rules. Check those in the tool before calling the backend, and return an `error` that tells the model how to correct the call.

```ballerina
# Validates an order ID before it is sent to the backend.
#
# + orderId - The order ID provided by the model
# + return - An error if the order ID is not in the format ORD-1234
isolated function validateOrderId(string orderId) returns error? {
    if !re `ORD-[0-9]{4}`.isFullMatch(orderId) {
        return error(string `'${orderId}' is not a valid order ID. Order IDs have the format ORD-1234.`);
    }
}
```

Add a tool for the state-changing operation. It validates the order ID and the reason, and the documentation tells the model to call it only after the customer has confirmed.

```ballerina
# Cancels an order. Only orders in the PENDING status can be cancelled.
# Call this only after the customer has explicitly confirmed the cancellation.
#
# + ctx - The agent context, used to report backend outages to the caller
# + orderId - The order ID, in the format ORD-1234
# + reason - The reason for the cancellation, as stated by the customer
# + return - The updated order, or an error that describes why it could not be cancelled
@ai:AgentTool
isolated function cancelOrder(ai:Context ctx, string orderId, string reason) returns Order|error {
    check validateOrderId(orderId);
    string trimmedReason = reason.trim();
    if trimmedReason.length() == 0 || trimmedReason.length() > MAX_REASON_LENGTH {
        return error(string `The reason must contain 1 to ${MAX_REASON_LENGTH} characters.`);
    }
    Order|http:ClientError 'order = orderApi->/orders/[orderId]/cancel.post({reason: trimmedReason});
    if 'order is http:ClientError {
        return toToolError(ctx, 'order);
    }
    return 'order;
}
```

>**Note:** The system prompt and the tool documentation guide the model, but they do not enforce anything. Rules that must always hold, such as "only pending orders can be cancelled", belong in the backend or in the tool code. To require a person to approve a tool call before it runs, see [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/).

### Expose an API through the HTTP service toolkit

For a read-only endpoint whose raw response the model can use as it is, you can describe the HTTP resource instead of writing a function. `ai:HttpServiceToolKit` creates one tool per `ai:HttpTool` and calls the service when the model uses the tool.

```ballerina
// Exposes the read-only shipment tracking API as a tool, without writing a function for it.
final ai:HttpServiceToolKit shipmentToolKit = check new (orderApiUrl, [
    {
        name: "getShipment",
        description: "Retrieves the carrier, status, and estimated delivery date of a shipment. " +
            "Use the trackingNumber field of the order.",
        method: ai:GET,
        path: "/shipments/{trackingNumber}",
        parameters: {
            trackingNumber: {
                location: ai:PATH,
                description: "The tracking number, in the format TRK-12345",
                schema: {'type: ai:STRING, pattern: "^TRK-[0-9]{5}$"}
            }
        }
    }
]);
```

The toolkit returns the status code, path, headers, and body of the response to the model, including for `4xx` and `5xx` responses. If the service cannot be reached, the model receives an error, and the outage is not recorded in the `ai:Context`. Use function tools when you need typed results, input validation, or control over how errors are reported, as with `getOrder` and `cancelOrder`. To group related function tools that share state, implement `ai:BaseToolKit`. See [Agent with tool kits](/learn/by-example/ai-agent-tool-kit/).

>**Tip:** If the API has an OpenAPI definition, consider generating a client with the `bal openapi` command and wrapping its operations as function tools. To share tools between several agents and applications, expose them through an MCP server. See [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/).

### Define the agent

Create the agent in `agent.bal` with a system prompt, the model, the tools, the memory, and an iteration limit.

```ballerina
configurable int maxIterations = 5;

final ai:Agent orderSupportAgent = check new (
    systemPrompt = {
        role: "Order Support Assistant",
        instructions: string `You help customers of an online store with questions about their orders.

            Rules:
            - Use the tools to look up orders and shipments. Never guess an order status,
              a tracking number, or a delivery date.
            - If the customer does not give an order ID, ask for it.
            - Before cancelling an order, describe the order and ask the customer to confirm.
              Call cancelOrder only after the customer confirms.
            - If a tool returns an error, explain the problem to the customer in plain language.
            - Do not answer questions that are not about orders or shipments.
            - Keep answers short.`
    },
    model = model,
    tools = [getOrder, cancelOrder, shipmentToolKit],
    memory = memory,
    maxIter = maxIterations
);
```

- `systemPrompt` has a `role` and `instructions`. State what the agent is for, which tools to rely on, what to do before an irreversible action, and what is out of scope.
- `tools` accepts function tools, toolkits, and `ai:ToolConfig` values in the same array.
- `maxIter` is the maximum number of reasoning-action cycles in one `run` call. One cycle is one model call plus the tool calls that it requests. By default, it is the number of tools or 10, whichever is greater. A low limit bounds the cost and latency of a request and stops a model that keeps calling tools without converging. When the limit is reached, `run` returns an `ai:MaxIterationExceededError`.

The agent also accepts `executeToolCallsInParallel` (default `true`), which controls whether multiple tool calls from one model response run concurrently, and `verbose` (default `false`), which logs each iteration.

For a smaller example that runs from the command line, see [Agent with local tools](/learn/by-example/ai-agent-local-tools/).

### Configure conversation memory

The memory stores the messages of each session, keyed by the session ID passed to `run`. On each call, the agent sends the stored history to the model together with the new message, and then stores the new messages.

Create a short-term memory backed by an in-memory store that keeps up to `memorySize` messages per session. When the limit is reached, the oldest messages are removed.

```ballerina
configurable int memorySize = 20;

// Keeps the most recent messages of each session in memory.
final ai:ShortTermMemory memory = check new (check new ai:InMemoryShortTermMemoryStore(memorySize));
```

The `ballerina/ai` module and related packages provide the following options.

| Option | Behavior |
|--------|----------|
| No `memory` field | The agent creates an `ai:ShortTermMemory` with an in-memory store that holds 10 messages per session. |
| `ai:ShortTermMemory` with `ai:InMemoryShortTermMemoryStore` | Holds the given number of messages per session in memory. History is lost when the service restarts and is not shared between replicas. |
| `ai:ShortTermMemory` with a model-assisted overflow configuration | Summarizes older messages with a model instead of removing them, when the store is full. |
| `ai:ShortTermMemory` with a database-backed store | Keeps history across restarts and replicas. For example, [`ballerinax/ai.memory.mssql`](https://central.ballerina.io/ballerinax/ai.memory.mssql/latest) provides a store backed by Microsoft SQL Server. |
| A class that implements `ai:Memory` | Stores history in any other system, through the `get`, `update`, and `delete` methods. |
| `memory = ()` | The agent is stateless. Each `run` call starts without history. |

To summarize instead of trimming, pass a `ai:ModelAssistedOverflowHandlerConfiguration` as the second argument.

```ballerina
// Summarizes older messages with the model instead of dropping them.
final ai:ShortTermMemory summarizingMemory = check new (
    check new ai:InMemoryShortTermMemoryStore(memorySize),
    {model: model}
);
```

>**Note:** Use a session ID that the caller cannot use to read someone else's conversation, such as an ID bound to the authenticated user. Calls to `run` with the same session ID must not run concurrently, because the memory update is not thread-safe for a single session.

### Expose the agent over HTTP

Add an HTTP service in `service.bal`. The request and response use the `ai:ChatReqMessage` (`sessionId` and `message`) and `ai:ChatRespMessage` (`message`) types from the `ballerina/ai` module. The return type lists each outcome of the request.

```ballerina
service /support on new http:Listener(servicePort) {
    resource function post chat(ai:ChatReqMessage request)
            returns ai:ChatRespMessage|http:BadRequest|http:ServiceUnavailable|http:InternalServerError {
        string? validationError = validateChatRequest(request);
        if validationError is string {
            return <http:BadRequest>{body: validationError};
        }

        // A new context per request. Tools use it to report backend outages.
        ai:Context ctx = new;
        string|ai:Error answer = orderSupportAgent.run(request.message, request.sessionId, ctx);
        // ...
    }
}
```

`run` binds the agent's final answer to the expected type, here `string`. The request is validated first, so that empty or oversized messages are rejected without a model call.

The `ballerina/ai` module also provides `ai:Listener`, which accepts the same `ai:ChatReqMessage` payload. Use it when the chat resource returns only `ai:ChatRespMessage|error`, as in the [Chat agents](/learn/by-example/chat-agents/) example.

```ballerina
service /chat on new ai:Listener(8081) {
    resource function post chat(@http:Payload ai:ChatReqMessage request) returns ai:ChatRespMessage|error {
        string answer = check orderSupportAgent.run(request.message, request.sessionId);
        return {message: answer};
    }
}
```

This guide uses `http:Listener` so that the resource can return a distinct status code for each failure.

## Handle failures

An agent can fail in more places than a single model call. Decide for each failure whether the model must see it, so that it can recover or explain it, or whether the request must fail.

| Failure | Where it is handled | Result |
|---------|---------------------|--------|
| Empty session ID or message, or a message that is too long | `validateChatRequest` in the service | `400 Bad Request`, without a model call |
| Invalid tool argument, such as a malformed order ID | The tool returns an `error` | The model receives the error message and can correct the call or ask the customer |
| Business error from the backend (`4xx`), such as an unknown order | `toToolError` returns an `error` with the backend's message | The model explains the problem to the customer |
| Backend unreachable or `5xx` | `toToolError` records the outage in the `ai:Context` | `503 Service Unavailable`, regardless of the model's answer |
| Model provider unreachable, or the provider rejects the request, such as an invalid API key | `run` returns an `ai:Error` with an `ai:LlmConnectionError` in its `steps` detail | `503 Service Unavailable` |
| Iteration limit reached | `run` returns `ai:MaxIterationExceededError` | `500 Internal Server Error` |
| Any other agent error, such as a memory error | `run` returns another `ai:Error` | `500 Internal Server Error` |

### Return business errors to the model

When a tool returns an `error`, the agent does not stop. It sends the error to the model as the tool result, and the model continues the conversation. If the tool panics or the arguments do not match the tool's parameter types, the agent also reports a tool execution failure to the model. This means a tool error never fails `run` by itself.

Use this for errors that the customer can act on. The `toToolError` function converts a `4xx` response into an error that carries the backend's message, which is short and safe to show to the customer. It does not pass status codes, URLs, or stack traces to the model.

### Fail the request on an outage

An outage is different: the model cannot fix it, and a chat reply such as "please try again later" hides it from the caller and from monitoring. For any error other than a `4xx` response, `toToolError` logs the error, records `backendUnavailable` in the context, and returns a short error that tells the model not to retry.

```ballerina
# Converts a backend error into an error message for the model.
# Client errors (4xx) describe a problem that the model can explain to the customer.
# Any other failure means the backend is unavailable; it is recorded in the context
# so that the service can fail the request instead of relying on the model's answer.
#
# + ctx - The agent context
# + err - The error returned by the HTTP client
# + return - The error to return to the model
isolated function toToolError(ai:Context ctx, http:ClientError err) returns error {
    if err is http:ClientRequestError {
        ErrorBody|error body = err.detail().body.ensureType();
        return error(body is ErrorBody ? body.message : "The request was rejected by the order system.");
    }
    log:printError("Order API call failed", err);
    ctx.set(BACKEND_UNAVAILABLE, true);
    return error("The order system is unavailable. Do not retry.");
}
```

After `run` returns, the service checks the context before it uses the answer, and then maps the errors that `run` can return.

```ballerina
if ctx.hasKey(BACKEND_UNAVAILABLE) {
    return <http:ServiceUnavailable>{body: "The order system is temporarily unavailable"};
}
if answer is ai:Error && isModelUnreachable(answer) {
    log:printError("Model provider is unreachable", answer);
    return <http:ServiceUnavailable>{body: "The assistant is temporarily unavailable"};
}
if answer is ai:MaxIterationExceededError {
    log:printWarn("Agent exceeded the iteration limit", sessionId = request.sessionId);
    return <http:InternalServerError>{body: "The assistant could not complete the request"};
}
if answer is ai:Error {
    log:printError("Agent run failed", answer, sessionId = request.sessionId);
    return <http:InternalServerError>{body: "The assistant could not complete the request"};
}
return {message: answer};
```

When the model cannot be reached, `run` does not return the `ai:LlmConnectionError` directly. The agent reports a failed run as an `ai:Error` whose `steps` detail holds the result or error of each step, so the `isModelUnreachable` function looks for an `ai:LlmConnectionError` among the steps.

```ballerina
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

>**Note:** The OpenAI model provider also reports an HTTP error response from the API, such as `401 Unauthorized` for an invalid or expired API key, as an `ai:LlmConnectionError` during an agent run. Check the logs to tell it apart from a network failure.

>**Tip:** Set a timeout on every client that a tool uses, as `orderApi` does with `timeout = 10`. A tool call that hangs holds the request open for the full model loop. For other client resiliency options, see [HTTP timeout](/learn/by-example/http-timeout/), [HTTP retry](/learn/by-example/http-retry/), and [HTTP circuit breaker](/learn/by-example/http-circuit-breaker/).

## The complete code

### `types.bal`

```ballerina
# The status of an order.
enum OrderStatus {
    PENDING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}

# An item in an order.
type OrderItem record {|
    # The stock-keeping unit of the product
    string sku;
    # The product name
    string name;
    # The number of units ordered
    int quantity;
|};

# An order in the order management system.
type Order record {|
    # The order ID, in the format ORD-1234
    string orderId;
    # The current status of the order
    OrderStatus status;
    # The items in the order
    OrderItem[] items;
    # The order total in USD
    decimal total;
    # The tracking number of the shipment, if the order has shipped
    string trackingNumber?;
|};

# A shipment tracked by the logistics system.
type Shipment record {|
    # The tracking number
    string trackingNumber;
    # The carrier delivering the shipment
    string carrier;
    # The latest shipment status
    string status;
    # The estimated delivery date, in YYYY-MM-DD format
    string estimatedDelivery;
|};

# The payload of a cancellation request.
type CancellationRequest record {|
    # The reason given by the customer
    string reason;
|};

# The error payload returned by the backend APIs.
type ErrorBody record {|
    # A description of the error
    string message;
|};
```

### `backend.bal`

```ballerina
import ballerina/http;

configurable int backendPort = 9090;

// In-memory data for the mock order and shipment APIs.
isolated map<Order> orders = {
    "ORD-1001": {
        orderId: "ORD-1001",
        status: SHIPPED,
        items: [{sku: "KB-201", name: "Mechanical keyboard", quantity: 1}],
        total: 89.99,
        trackingNumber: "TRK-55501"
    },
    "ORD-1002": {
        orderId: "ORD-1002",
        status: PENDING,
        items: [{sku: "MS-110", name: "Wireless mouse", quantity: 2}],
        total: 49.98
    }
};

final readonly & map<Shipment> shipments = {
    "TRK-55501": {
        trackingNumber: "TRK-55501",
        carrier: "FastShip",
        status: "In transit",
        estimatedDelivery: "2026-10-15"
    }
};

// A mock of the order management and logistics APIs that the agent uses.
// In a real deployment, these are existing enterprise systems.
service /api on new http:Listener(backendPort) {
    resource function get orders/[string orderId]() returns Order|http:NotFound {
        lock {
            Order? 'order = orders[orderId];
            if 'order is () {
                return <http:NotFound>{body: <ErrorBody>{message: string `Order ${orderId} not found`}};
            }
            return 'order.clone();
        }
    }

    resource function post orders/[string orderId]/cancel(CancellationRequest request)
            returns Order|http:NotFound|http:Conflict {
        lock {
            Order? 'order = orders[orderId];
            if 'order is () {
                return <http:NotFound>{body: <ErrorBody>{message: string `Order ${orderId} not found`}};
            }
            if 'order.status != PENDING {
                return <http:Conflict>{
                    body: <ErrorBody>{message: string `Order ${orderId} is ${'order.status} and cannot be cancelled`}
                };
            }
            'order.status = CANCELLED;
            return 'order.clone();
        }
    }

    resource function get shipments/[string trackingNumber]() returns Shipment|http:NotFound {
        Shipment? shipment = shipments[trackingNumber];
        if shipment is () {
            return <http:NotFound>{body: <ErrorBody>{message: string `Shipment ${trackingNumber} not found`}};
        }
        return shipment;
    }
}
```

### `tools.bal`

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;

configurable string orderApiUrl = "http://localhost:9090/api";

const BACKEND_UNAVAILABLE = "backendUnavailable";
const MAX_REASON_LENGTH = 200;

final http:Client orderApi = check new (orderApiUrl, timeout = 10);

# Retrieves an order, including its status, items, total, and tracking number.
#
# + ctx - The agent context, used to report backend outages to the caller
# + orderId - The order ID, in the format ORD-1234
# + return - The order, or an error that describes why it could not be retrieved
@ai:AgentTool
isolated function getOrder(ai:Context ctx, string orderId) returns Order|error {
    check validateOrderId(orderId);
    Order|http:ClientError 'order = orderApi->/orders/[orderId];
    if 'order is http:ClientError {
        return toToolError(ctx, 'order);
    }
    return 'order;
}

# Cancels an order. Only orders in the PENDING status can be cancelled.
# Call this only after the customer has explicitly confirmed the cancellation.
#
# + ctx - The agent context, used to report backend outages to the caller
# + orderId - The order ID, in the format ORD-1234
# + reason - The reason for the cancellation, as stated by the customer
# + return - The updated order, or an error that describes why it could not be cancelled
@ai:AgentTool
isolated function cancelOrder(ai:Context ctx, string orderId, string reason) returns Order|error {
    check validateOrderId(orderId);
    string trimmedReason = reason.trim();
    if trimmedReason.length() == 0 || trimmedReason.length() > MAX_REASON_LENGTH {
        return error(string `The reason must contain 1 to ${MAX_REASON_LENGTH} characters.`);
    }
    Order|http:ClientError 'order = orderApi->/orders/[orderId]/cancel.post({reason: trimmedReason});
    if 'order is http:ClientError {
        return toToolError(ctx, 'order);
    }
    return 'order;
}

// Exposes the read-only shipment tracking API as a tool, without writing a function for it.
final ai:HttpServiceToolKit shipmentToolKit = check new (orderApiUrl, [
    {
        name: "getShipment",
        description: "Retrieves the carrier, status, and estimated delivery date of a shipment. " +
            "Use the trackingNumber field of the order.",
        method: ai:GET,
        path: "/shipments/{trackingNumber}",
        parameters: {
            trackingNumber: {
                location: ai:PATH,
                description: "The tracking number, in the format TRK-12345",
                schema: {'type: ai:STRING, pattern: "^TRK-[0-9]{5}$"}
            }
        }
    }
]);

# Validates an order ID before it is sent to the backend.
#
# + orderId - The order ID provided by the model
# + return - An error if the order ID is not in the format ORD-1234
isolated function validateOrderId(string orderId) returns error? {
    if !re `ORD-[0-9]{4}`.isFullMatch(orderId) {
        return error(string `'${orderId}' is not a valid order ID. Order IDs have the format ORD-1234.`);
    }
}

# Converts a backend error into an error message for the model.
# Client errors (4xx) describe a problem that the model can explain to the customer.
# Any other failure means the backend is unavailable; it is recorded in the context
# so that the service can fail the request instead of relying on the model's answer.
#
# + ctx - The agent context
# + err - The error returned by the HTTP client
# + return - The error to return to the model
isolated function toToolError(ai:Context ctx, http:ClientError err) returns error {
    if err is http:ClientRequestError {
        ErrorBody|error body = err.detail().body.ensureType();
        return error(body is ErrorBody ? body.message : "The request was rejected by the order system.");
    }
    log:printError("Order API call failed", err);
    ctx.set(BACKEND_UNAVAILABLE, true);
    return error("The order system is unavailable. Do not retry.");
}
```

### `agent.bal`

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable int memorySize = 20;
configurable int maxIterations = 5;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

// Keeps the most recent messages of each session in memory.
final ai:ShortTermMemory memory = check new (check new ai:InMemoryShortTermMemoryStore(memorySize));

final ai:Agent orderSupportAgent = check new (
    systemPrompt = {
        role: "Order Support Assistant",
        instructions: string `You help customers of an online store with questions about their orders.

            Rules:
            - Use the tools to look up orders and shipments. Never guess an order status,
              a tracking number, or a delivery date.
            - If the customer does not give an order ID, ask for it.
            - Before cancelling an order, describe the order and ask the customer to confirm.
              Call cancelOrder only after the customer confirms.
            - If a tool returns an error, explain the problem to the customer in plain language.
            - Do not answer questions that are not about orders or shipments.
            - Keep answers short.`
    },
    model = model,
    tools = [getOrder, cancelOrder, shipmentToolKit],
    memory = memory,
    maxIter = maxIterations
);
```

### `service.bal`

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;

configurable int servicePort = 8080;

const MAX_MESSAGE_LENGTH = 2000;

service /support on new http:Listener(servicePort) {
    resource function post chat(ai:ChatReqMessage request)
            returns ai:ChatRespMessage|http:BadRequest|http:ServiceUnavailable|http:InternalServerError {
        string? validationError = validateChatRequest(request);
        if validationError is string {
            return <http:BadRequest>{body: validationError};
        }

        // A new context per request. Tools use it to report backend outages.
        ai:Context ctx = new;
        string|ai:Error answer = orderSupportAgent.run(request.message, request.sessionId, ctx);

        if ctx.hasKey(BACKEND_UNAVAILABLE) {
            return <http:ServiceUnavailable>{body: "The order system is temporarily unavailable"};
        }
        if answer is ai:Error && isModelUnreachable(answer) {
            log:printError("Model provider is unreachable", answer);
            return <http:ServiceUnavailable>{body: "The assistant is temporarily unavailable"};
        }
        if answer is ai:MaxIterationExceededError {
            log:printWarn("Agent exceeded the iteration limit", sessionId = request.sessionId);
            return <http:InternalServerError>{body: "The assistant could not complete the request"};
        }
        if answer is ai:Error {
            log:printError("Agent run failed", answer, sessionId = request.sessionId);
            return <http:InternalServerError>{body: "The assistant could not complete the request"};
        }
        return {message: answer};
    }
}

# Validates a chat request before it is passed to the agent.
#
# + request - The chat request
# + return - A description of the problem, or `()` if the request is valid
isolated function validateChatRequest(ai:ChatReqMessage request) returns string? {
    if request.sessionId.trim().length() == 0 {
        return "sessionId must not be empty";
    }
    string message = request.message.trim();
    if message.length() == 0 {
        return "message must not be empty";
    }
    if message.length() > MAX_MESSAGE_LENGTH {
        return string `message must not exceed ${MAX_MESSAGE_LENGTH} characters`;
    }
    return;
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

## Test the tools

Model responses vary between calls, so test the parts of the agent that do not depend on the model: the tools, the input validation, and the error mapping. Each tool is a function, so you can call it directly from a test, with a new `ai:Context`. The mock backend service in the package starts when the tests run, so the tools call it over HTTP.

Create a `tests/tools_test.bal` file.

> **Info:** For more information, see [Test Ballerina code](/learn/test-ballerina-code/test-a-simple-function/).

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/test;

@test:Config
function testGetOrderReturnsOrder() returns error? {
    Order 'order = check getOrder(new ai:Context(), "ORD-1001");
    test:assertEquals('order.status, SHIPPED);
    test:assertEquals('order.trackingNumber, "TRK-55501");
}

@test:Config
function testUnknownOrderIsReturnedToModel() {
    ai:Context ctx = new;
    Order|error result = getOrder(ctx, "ORD-9999");
    test:assertTrue(result is error);
    test:assertEquals((<error>result).message(), "Order ORD-9999 not found");
    // A missing order is a business error, not an outage.
    test:assertFalse(ctx.hasKey(BACKEND_UNAVAILABLE));
}

@test:Config
function testInvalidOrderIdIsRejected() {
    Order|error result = getOrder(new ai:Context(), "1001");
    test:assertTrue(result is error);
    test:assertEquals((<error>result).message(),
            "'1001' is not a valid order ID. Order IDs have the format ORD-1234.");
}

@test:Config
function testShippedOrderCannotBeCancelled() {
    Order|error result = cancelOrder(new ai:Context(), "ORD-1001", "Changed my mind");
    test:assertTrue(result is error);
    test:assertEquals((<error>result).message(), "Order ORD-1001 is SHIPPED and cannot be cancelled");
}

@test:Config
function testEmptyReasonIsRejected() {
    Order|error result = cancelOrder(new ai:Context(), "ORD-1002", "   ");
    test:assertTrue(result is error);
}

@test:Config {
    dependsOn: [testEmptyReasonIsRejected]
}
function testPendingOrderIsCancelled() returns error? {
    Order 'order = check cancelOrder(new ai:Context(), "ORD-1002", "Ordered by mistake");
    test:assertEquals('order.status, CANCELLED);
}

@test:Config
function testConnectionFailureMarksBackendUnavailable() {
    ai:Context ctx = new;
    error result = toToolError(ctx, error http:ClientConnectorError("Connection refused"));
    test:assertEquals(result.message(), "The order system is unavailable. Do not retry.");
    test:assertTrue(ctx.hasKey(BACKEND_UNAVAILABLE));
}

@test:Config
function testShipmentToolIsRegistered() {
    ai:ToolConfig[] tools = shipmentToolKit.getTools();
    test:assertEquals(tools.length(), 1);
    test:assertEquals(tools[0].name, "getShipment");
}

@test:Config
function testChatRequestValidation() {
    test:assertEquals(validateChatRequest({sessionId: "", message: "Hi"}), "sessionId must not be empty");
    test:assertEquals(validateChatRequest({sessionId: "s1", message: " "}), "message must not be empty");
    test:assertEquals(validateChatRequest({sessionId: "s1", message: "Where is ORD-1001?"}), ());
}

@test:Config
function testModelConnectionFailureIsDetected() {
    test:assertTrue(isModelUnreachable(error ai:LlmConnectionError("timeout")));
    ai:Error failedRun = error ai:Error("Unable to obtain valid answer from the agent",
        steps = [error ai:LlmConnectionError("Error while connecting to the model")]);
    test:assertTrue(isModelUnreachable(failedRun));
    test:assertFalse(isModelUnreachable(error ai:Error("Unable to obtain valid answer from the agent", steps = [])));
    test:assertFalse(isModelUnreachable(error ai:MaxIterationExceededError("limit", steps = [])));
}
```

The module-level model provider and agent are initialized when the tests run, so add a `tests/Config.toml` file with a placeholder key. The tests do not call the model.

```toml
openAiApiKey = "test-key"
```

Run the tests.

```
$ bal test
```

The connection-failure test logs an `Order API call failed` error, which is expected. The test results are shown below.

```
Running Tests

	order_support_agent
		[pass] testChatRequestValidation
		[pass] testConnectionFailureMarksBackendUnavailable
		[pass] testEmptyReasonIsRejected
		[pass] testPendingOrderIsCancelled
		[pass] testGetOrderReturnsOrder
		[pass] testInvalidOrderIdIsRejected
		[pass] testModelConnectionFailureIsDetected
		[pass] testShipmentToolIsRegistered
		[pass] testShippedOrderCannotBeCancelled
		[pass] testUnknownOrderIsReturnedToModel


		10 passing
		0 failing
		0 skipped
```

To check how the agent behaves with a real model, such as whether it calls the right tool and asks for confirmation before cancelling, see [Evaluate agent behavior](/learn/evaluate-agent-behavior/).

## Run the integration

Execute the command below to run the package. It starts the mock backend on port `9090` and the chat service on port `8080`.

```
$ bal run
```

You view the output below.

```
Compiling source
        <org>/order_support_agent:0.1.0

Running executable
```

## Try the integration

Send a message with a session ID. Because the responses are generated by an LLM, the replies below are illustrative and your results will differ.

```
$ curl -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "customer-42", "message": "Where is my order ORD-1001?"}'
{"message":"Your order ORD-1001 (1 x Mechanical keyboard) has shipped with FastShip. It is in transit and is expected to arrive on 2026-10-15."}
```

To answer, the agent calls `getOrder` and then `getShipment` with the order's tracking number.

Send a follow-up message in the same session without the order ID. The agent uses the conversation memory to resolve it.

```
$ curl -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "customer-42", "message": "Can I still cancel it?"}'
{"message":"Order ORD-1001 has already shipped, so it can't be cancelled."}
```

Ask to cancel the pending order `ORD-1002`. The agent describes the order and asks for confirmation before it calls `cancelOrder`.

```
$ curl -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "customer-7", "message": "Please cancel ORD-1002, I ordered it by mistake."}'
{"message":"Order ORD-1002 contains 2 x Wireless mouse for a total of $49.98. Do you want me to cancel it?"}
```

Verify the failure handling by sending an empty session ID. The request is rejected without calling the model.

```
$ curl -i -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "", "message": "Where is my order?"}'
HTTP/1.1 400 Bad Request
...
sessionId must not be empty
```

To see the outage handling, start the package with the order API pointed to a port where nothing is listening, and ask about an order. When the model calls `getOrder`, the call fails to connect, and the service returns `503 Service Unavailable`.

```
$ bal run -- -CorderApiUrl=http://localhost:9999/api
```

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/)
- [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/)
- [Evaluate agent behavior](/learn/evaluate-agent-behavior/)
- [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/)
- [Agent with local tools](/learn/by-example/ai-agent-local-tools/) — Ballerina by Example
- [Agent with external endpoint integration](/learn/by-example/ai-agent-external-endpoint-integration/) — Ballerina by Example
- [Agent with tool kits](/learn/by-example/ai-agent-tool-kit/) — Ballerina by Example
- [Chat agents](/learn/by-example/chat-agents/) — Ballerina by Example
- [Agent with MCP integration](/learn/by-example/ai-agent-mcp-integration/) — Ballerina by Example
- [HTTP client data binding](/learn/by-example/http-client-data-binding/) — Ballerina by Example
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
