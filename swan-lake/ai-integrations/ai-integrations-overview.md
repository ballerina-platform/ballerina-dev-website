---
layout: ballerina-ai-integrations-overview-left-nav-pages-swanlake
title: AI integrations overview
description: Understand when to use direct LLM calls, natural expressions, RAG, agents, MCP, and durable workflows in an integration.
keywords: ballerina, AI, LLM, large language model, agents, RAG, MCP, workflow, model provider, integration
permalink: /learn/ai-integrations-overview/
active: ai-integrations-overview
intro: This guide introduces the building blocks that Ballerina provides for adding AI to an integration, shows a short code example of each, and helps you choose the right one for a requirement. You also build a small HTTP service that classifies support tickets with a typed LLM call, so that you can verify your setup before you move on to the other guides in this section.
---

## The scenario

A retailer runs a customer-support platform. Support tickets arrive through a REST API, and the platform is connected to an order system, a policy document store, and a refund process that needs a manager's approval. The retailer wants to add AI to this platform in stages:

- Classify each incoming ticket by category and priority, and route it to the right queue.
- Answer policy questions using the retailer's own policy documents instead of the model's general knowledge.
- Let customers ask about their orders in a conversation, with the answers based on live order data.
- Make the order lookup available to other AI applications and agents.
- Issue refunds only after a person approves them, even if the integration restarts while it is waiting.

Each requirement maps to a different building block. This guide explains the building blocks and implements the first requirement, ticket classification, as a runnable service. The other guides in this section implement the rest.

## How it works

All AI building blocks in Ballerina are provided by the [`ballerina/ai`](https://lib.ballerina.io/ballerina/ai/latest/) module, with provider-specific implementations in `ballerinax/ai.<provider>` packages. Every building block depends on an `ai:ModelProvider` value, so you configure the model once and reuse it everywhere.

```
                         ┌──────────────────────────────┐
                         │  ai:ModelProvider            │
                         │  (OpenAI, Azure, Ollama ...) │
                         └──────────────┬───────────────┘
                                        │ used by
   ┌──────────────┬──────────────┬──────┴───────┬──────────────┬──────────────────┐
   ▼              ▼              ▼              ▼              ▼                  ▼
Direct LLM     Natural        RAG            Agent          MCP              Durable
call           expression     (knowledge     (tools +       (expose tools /  workflow
generate()     natural{...}   base + model)  memory)        use MCP tools)   (human approval)
   │              │              │              │              │                  │
   └──────────────┴──────────────┴──────┬───────┴──────────────┴──────────────────┘
                                        ▼
                    HTTP services, listeners, connectors, and data mapping
                    (the rest of your integration)
```

The following sections describe each building block. The snippets share the module-level `model` defined in [Model providers and configuration](#model-providers-and-configuration) and the `Triage` type defined in [Direct LLM calls](#direct-llm-calls).

### Model providers and configuration

An `ai:ModelProvider` is a client object with two remote methods: `chat`, which sends chat messages (and tool definitions, for agents), and `generate`, which sends a prompt and binds the response to a Ballerina type. Implementations for different LLM services are available as packages such as [`ballerinax/ai.openai`](https://central.ballerina.io/ballerinax/ai.openai/latest), [`ballerinax/ai.anthropic`](https://central.ballerina.io/ballerinax/ai.anthropic/latest), [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest), and [`ballerinax/ai.ollama`](https://central.ballerina.io/ballerinax/ai.ollama/latest).

Declare credentials as [configurable variables](/learn/configure-a-sample-ballerina-service/) and create the model provider at the module level, so that it is initialized once and shared.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O_MINI);
```

Provide the value in a `Config.toml` file.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
```

Because the rest of the code depends only on the `ai:ModelProvider` type, you can switch providers by changing the import and the initialization. Embedding providers (`ai:EmbeddingProvider`), which RAG uses, follow the same pattern.

### Direct LLM calls

A direct LLM call sends one prompt and binds the response to the expected type. You write the prompt as a raw template, and the JSON schema of the expected type is sent with it, so the prompt does not need to describe the output format. There is no loop, memory, or tool use.

```ballerina
type Triage record {|
    "billing"|"shipping"|"technical"|"account"|"other" category;
    "low"|"medium"|"high" priority;
    string summary;
|};

function classify(string ticketText) returns Triage|error {
    Triage triage = check model->generate(`Classify this support ticket: ${ticketText}`);
    return triage;
}
```

Use a direct call when one step of an integration needs a single, typed answer from a model, such as classification, extraction, summarization, or data mapping. See [Direct LLM calls](/learn/by-example/direct-llm-calls/) and [Add an LLM step to an integration](/learn/add-an-llm-step-to-an-integration/).

### Natural expressions

A natural expression has the same behavior as a direct call, but the prompt is written as the body of a `natural (model) { ... }` expression instead of as a raw template argument. The expected type is the type of the variable that the expression is assigned to.

```ballerina
function classifyNaturally(string ticketText) returns Triage|error {
    Triage|error triage = natural (model) {
        Classify this support ticket: ${ticketText}
    };
    return triage;
}
```

>**Note:** Natural expressions are an experimental feature. Pass the `--experimental` flag to `bal build`, `bal run`, and `bal test`.

See [Natural expressions](/learn/by-example/natural-expressions/) and [Use natural expressions in an integration](/learn/work-with-llms-using-natural-expressions/).

### Retrieval-augmented generation (RAG)

RAG grounds model responses in your own data. Documents are split into chunks by a chunker, converted into vectors by an embedding provider, and stored in a vector store. At query time, the most relevant chunks are retrieved and inserted into the prompt. An `ai:VectorKnowledgeBase` combines these parts behind `ingest` and `retrieve` methods.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

final ai:EmbeddingProvider embeddings =
        check new openai:EmbeddingProvider(openAiApiKey, openai:TEXT_EMBEDDING_3_SMALL);

final ai:VectorStore vectorStore = check new ai:InMemoryVectorStore();

final ai:KnowledgeBase policies =
        new ai:VectorKnowledgeBase(vectorStore, embeddings, new ai:MarkdownChunker());

function ingestPolicy(string path) returns error? {
    ai:DataLoader loader = check new ai:TextDataLoader(path);
    check policies.ingest(check loader.load());
}

function answerFromPolicies(string question) returns string|error {
    ai:QueryMatch[] matches = check policies.retrieve(question, 5);
    ai:Chunk[] context = from ai:QueryMatch m in matches select m.chunk;
    return model->generate(`Answer using only this context: ${context}

        Question: ${question}`);
}
```

The in-memory vector store is suitable for development. For production, use an external vector store such as [`ballerinax/ai.pgvector`](https://central.ballerina.io/ballerinax/ai.pgvector/latest), [`ballerinax/ai.pinecone`](https://central.ballerina.io/ballerinax/ai.pinecone/latest), [`ballerinax/ai.milvus`](https://central.ballerina.io/ballerinax/ai.milvus/latest), or [`ballerinax/ai.weaviate`](https://central.ballerina.io/ballerinax/ai.weaviate/latest). See [RAG with in-memory vector store](/learn/by-example/rag-with-in-memory-vector-store/) and [Ground responses with enterprise data](/learn/ground-responses-with-enterprise-data/).

### Agents with tools and memory

An agent uses the model in a loop. It reads the user's request, decides which tools to call, calls them, and continues until it can answer. Tools are Ballerina functions annotated with `@ai:AgentTool`; the tool name, description, and parameter schema are generated from the function signature and documentation. Memory keeps the conversation for each session ID, so the agent can handle follow-up questions.

```ballerina
import ballerina/ai;

# Returns the current status of an order.
#
# + orderId - The order identifier, such as "ORD-1042"
# + return - The order status
@ai:AgentTool
isolated function getOrderStatus(string orderId) returns string {
    return orderId == "ORD-1042" ? "SHIPPED" : "UNKNOWN";
}

final ai:Agent supportAgent = check new ({
    systemPrompt: {
        role: "Customer support assistant",
        instructions: "Answer questions about orders. Use the tools to look up order data."
    },
    model,
    tools: [getOrderStatus],
    memory: check new ai:ShortTermMemory()
});

function chat(string sessionId, string message) returns string|error {
    return supportAgent.run(message, sessionId);
}
```

If you omit `memory`, the agent uses an in-memory short-term memory by default. Use an agent only when the steps cannot be fixed in advance; if the integration always performs the same steps, call the model directly from those steps instead. See [Agent with local tools](/learn/by-example/ai-agent-local-tools/), [Agent with tool kits](/learn/by-example/ai-agent-tool-kit/), [Chat agents](/learn/by-example/chat-agents/), and [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/).

### MCP services and toolkits

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is a standard way to expose tools to AI applications. The [`ballerina/mcp`](https://lib.ballerina.io/ballerina/mcp/latest/) module lets you publish integration logic as an MCP server, where each remote method becomes a tool. An `ai:McpToolKit` connects an agent to the tools of any MCP server.

```ballerina
import ballerina/ai;
import ballerina/mcp;

listener mcp:StreamableHttpListener mcpListener = check new (9090);

service mcp:StreamableHttpService /mcp on mcpListener {
    # Returns the current status of an order.
    #
    # + orderId - The order identifier, such as "ORD-1042"
    # + return - The order status
    remote function getOrderStatus(string orderId) returns string {
        return orderId == "ORD-1042" ? "SHIPPED" : "UNKNOWN";
    }
}

function createMcpAgent() returns ai:Agent|error {
    ai:McpToolKit orderTools = check new ("http://localhost:9090/mcp");
    return new ai:Agent(
        systemPrompt = {role: "Order assistant", instructions: "Answer questions about orders."},
        model = model,
        tools = [orderTools]
    );
}
```

Use an MCP service when the same capability must be shared with several agents or with AI applications outside your integration. Use a toolkit when your agent needs tools that another team or vendor already publishes over MCP. See [MCP service](/learn/by-example/mcp-service/), [Agent with MCP integration](/learn/by-example/ai-agent-mcp-integration/), and [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/).

### Durable workflows with human approval

Some AI-assisted processes must wait for a person, for minutes or days, and must not lose their state if the process restarts. The [`ballerina/workflow`](https://central.ballerina.io/ballerina/workflow/latest) module runs a function annotated with `@workflow:Workflow` durably: each step is recorded, and the workflow resumes from the recorded history after a failure. Functions annotated with `@workflow:Activity` perform side effects, such as calling an API, and are called through `ctx->callActivity`. A workflow waits for external data, such as an approval, through a future in its events record, and the data is delivered with `workflow:sendData`.

```ballerina
import ballerina/workflow;

type RefundRequest record {|
    string orderId;
    decimal amount;
|};

type ApprovalDecision record {|
    string approverId;
    boolean approved;
|};

@workflow:Activity
function issueRefund(string orderId, decimal amount) returns string|error {
    return string `refund issued for ${orderId}`;
}

@workflow:Workflow
function processRefund(workflow:Context ctx, RefundRequest request,
        record {|future<ApprovalDecision> approval;|} events) returns string|error {
    ApprovalDecision decision = check wait events.approval;
    if !decision.approved {
        return "REJECTED";
    }
    return ctx->callActivity(issueRefund, {"orderId": request.orderId, "amount": request.amount});
}

function startRefund(RefundRequest request) returns string|error {
    return workflow:run(processRefund, request);
}

function approveRefund(string workflowId, string approverId) returns error? {
    check workflow:sendData(processRefund, workflowId, "approval", {approverId, approved: true});
}
```

For local development, run workflows in memory by adding the following to `Config.toml`. In production, connect the module to a Temporal server instead.

```toml
[ballerina.workflow]
mode = "IN_MEMORY"
```

>**Note:** The `ballerina/workflow` module requires Ballerina 2201.13.6 or later. Version 1.0.0 of the module, which adds the durable agent used in [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/), requires Ballerina 2201.14.0 or later.

See [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/).

## Choose an approach

Use the table below to map a requirement to a building block. Many integrations combine several of them; for example, an agent can use a knowledge base as a tool, and a workflow can call an agent from an activity.

| Requirement | Approach | Guide |
|---|---|---|
| One step needs a typed answer from a model (classify, extract, summarize, map) | Direct LLM call with `generate` | [Add an LLM step to an integration](/learn/add-an-llm-step-to-an-integration/) |
| Same as above, with the prompt written inline as natural language | Natural expression | [Use natural expressions in an integration](/learn/work-with-llms-using-natural-expressions/) |
| Answers must be based on your own documents or data | RAG with a knowledge base | [Ground responses with enterprise data](/learn/ground-responses-with-enterprise-data/) |
| The steps depend on the request, and the model must call your systems or hold a conversation | Agent with tools and memory | [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/) |
| Share integration logic with external AI applications, or use tools published by others | MCP service or `ai:McpToolKit` | [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/) |
| A person must approve an action, or the process must survive restarts while it waits | Durable workflow | [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/) |
| Check that an agent still behaves correctly after a change to prompts, tools, or models | Agent evaluation tests | [Evaluate agent behavior](/learn/evaluate-agent-behavior/) |
| Trace model and tool calls, and protect credentials and data | Observability and security | [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/) |

Start with the simplest approach that meets the requirement. A direct call is cheaper, faster, and easier to test than an agent, because its output depends on one prompt and you control every other step in code.

## Set up the prerequisites

To complete the runnable part of this guide, you need:

1. Ballerina 2201.13.0 (Swan Lake Update 13) or later. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.13.0
    ```

2. Access to an LLM. This guide uses OpenAI and requires an OpenAI API key. To use a different provider, see [Use a different model provider](/learn/add-an-llm-step-to-an-integration/#use-a-different-model-provider).

3. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

4. A command terminal.

The service in this guide does not use natural expressions, so it does not need the `--experimental` flag.

## Create the package

Ballerina uses packages to group code. In the terminal, execute the command below to create a package for the integration.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new ticket_triage_service
```

This creates a directory named `ticket_triage_service` with the files below.

```
.
├── ticket_triage_service
│   ├── Ballerina.toml
│   └── main.bal
```

>**Tip:** Rename the automatically-created `main.bal` file to `service.bal` and remove the generated content.

## Configure the model provider

Declare the API key as a configurable variable and create the model provider at the module level.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O_MINI);
```

Create a `Config.toml` file in the package root and add the key.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
```

>**Note:** Do not commit `Config.toml` files that contain secrets. In deployed environments, provide the value through an environment variable or a secret store instead. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

The `ballerina/ai` module also provides a default model provider, which lets you try out the integration without your own LLM keys.

```ballerina
final ai:ModelProvider model = check ai:getDefaultModelProvider();
```

>**Info: Requires tooling.** The configuration for the default model provider is generated by a command in the Ballerina VS Code extension (also available in WSO2 Integrator). Log in to WSO2 Copilot, open the VS Code command palette (`Ctrl + Shift + P` or `command + shift + P`) with the project open, and run `Configure default WSO2 Model Provider`. This adds the required configuration to the `Config.toml` file. The default model provider is subject to rate limits and other usage constraints, so use your own provider for production workloads.

## Implement the integration

The service accepts a ticket, asks the model to classify it, validates the classification, and routes the ticket to a queue with plain Ballerina logic.

```
POST /tickets/triage  {subject, body}
        │
        ▼
┌───────────────────────────────┐   prompt + JSON schema of Triage   ┌───────────┐
│  HTTP resource                │ ─────────────────────────────────► │    LLM    │
│  1. bind and validate payload │ ◄───────────────────────────────── │ (OpenAI)  │
│  2. model->generate()         │            JSON response           └───────────┘
│  3. validate the result       │
│  4. route with routeTo()      │
└───────────────────────────────┘
        │
        ▼
  TriageResult  |  400 Bad Request  |  502 Bad Gateway
```

### Define the types

Define a type for the request payload and a type for the model's answer. [Constraint annotations](/learn/by-example/constraint-validations/) on the `Ticket` record are checked by the HTTP listener when it binds the payload, so a request with an empty or oversized body is rejected with `400 Bad Request` before the model is called. See [HTTP service payload constraint validation](/learn/by-example/http-service-payload-constraint-validation/).

```ballerina
import ballerina/constraint;

const MAX_TICKET_LENGTH = 4000;

# A support ticket submitted by a customer.
type Ticket record {|
    # The ticket subject line
    @constraint:String {minLength: 1, maxLength: 200}
    string subject;
    # The full ticket text written by the customer
    @constraint:String {minLength: 1, maxLength: MAX_TICKET_LENGTH}
    string body;
|};
```

The `Triage` record is the expected type of the model call. Union types of string literals restrict `category` and `priority` to fixed values, and the field documentation is included in the JSON schema that is sent to the model.

```ballerina
# The classification of a support ticket.
type Triage record {|
    # The area of the business that the ticket is about
    "billing"|"shipping"|"technical"|"account"|"other" category;
    # How urgently the ticket needs attention
    "low"|"medium"|"high" priority;
    # A neutral, one-sentence summary of the customer's problem
    @constraint:String {minLength: 1, maxLength: 300}
    string summary;
|};

# The response returned to the caller.
type TriageResult record {|
    *Triage;
    # The support queue that the ticket is routed to
    string queue;
|};
```

### Call the model

Add an HTTP service with a `POST` resource. Call `generate` on the model provider with a raw template, and assign the result to a variable of type `Triage|error`. The expected type, `Triage`, is inferred from the variable.

```ballerina
import ballerina/http;

service /tickets on new http:Listener(8080) {
    resource function post triage(Ticket ticket)
            returns TriageResult|http:BadGateway {
        Triage|error triage = model->generate(`
            Classify the following customer support ticket.
            Choose the priority as high only if the customer cannot use
            the product or is losing money.

            Subject: ${ticket.subject}
            Ticket: ${ticket.body}`);
        // ...
    }
}
```

>**Note:** Interpolated values become part of the prompt. Do not interpolate data that must not be sent to the model provider, and treat ticket text as untrusted input.

### Handle failures

The call returns an `ai:Error` when the model call fails (for example, because the provider cannot be reached or rejects an invalid API key) or when the response cannot be bound to `Triage`. The error type for a particular failure depends on the model provider implementation. The OpenAI model provider reports HTTP errors and connection failures in a `generate` call as an `ai:Error` with the message `LLM call failed: ...`, not as an `ai:LlmConnectionError`, so the service cannot reliably tell an unreachable provider apart from other failures. Report every failure as `502 Bad Gateway`. Log the details, but do not return them to the caller. See [Handle failures](/learn/add-an-llm-step-to-an-integration/#handle-failures) in the LLM step guide.

```ballerina
import ballerina/log;

if triage is error {
    log:printError("Failed to classify the ticket", triage);
    return <http:BadGateway>{body: "Could not classify the ticket"};
}
```

### Validate and route the result

A response that matches the type can still violate the constraints, such as an empty summary. Validate it with `constraint:validate`, and then decide the queue in a separate function. Routing is a business rule, so it is written in code instead of being left to the model, and it can be tested without a model.

```ballerina
Triage|error validTriage = constraint:validate(triage);
if validTriage is error {
    log:printWarn("Model response failed validation", 'error = validTriage);
    return <http:BadGateway>{body: "Could not classify the ticket"};
}
return {...validTriage, queue: routeTo(validTriage)};
```

```ballerina
# Selects the support queue for a classified ticket.
#
# + triage - The validated classification of the ticket
# + return - The name of the queue that handles the ticket
isolated function routeTo(Triage triage) returns string {
    if triage.priority == "high" {
        return string `${triage.category}-urgent`;
    }
    if triage.category == "other" {
        return "general";
    }
    return triage.category;
}
```

## The complete `service.bal` file

```ballerina
import ballerina/ai;
import ballerina/constraint;
import ballerina/http;
import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O_MINI);

const MAX_TICKET_LENGTH = 4000;

# A support ticket submitted by a customer.
type Ticket record {|
    # The ticket subject line
    @constraint:String {minLength: 1, maxLength: 200}
    string subject;
    # The full ticket text written by the customer
    @constraint:String {minLength: 1, maxLength: MAX_TICKET_LENGTH}
    string body;
|};

# The classification of a support ticket.
type Triage record {|
    # The area of the business that the ticket is about
    "billing"|"shipping"|"technical"|"account"|"other" category;
    # How urgently the ticket needs attention
    "low"|"medium"|"high" priority;
    # A neutral, one-sentence summary of the customer's problem
    @constraint:String {minLength: 1, maxLength: 300}
    string summary;
|};

# The response returned to the caller.
type TriageResult record {|
    *Triage;
    # The support queue that the ticket is routed to
    string queue;
|};

service /tickets on new http:Listener(8080) {
    resource function post triage(Ticket ticket)
            returns TriageResult|http:BadGateway {
        Triage|error triage = model->generate(`
            Classify the following customer support ticket.
            Choose the priority as high only if the customer cannot use
            the product or is losing money.

            Subject: ${ticket.subject}
            Ticket: ${ticket.body}`);

        if triage is error {
            log:printError("Failed to classify the ticket", triage);
            return <http:BadGateway>{body: "Could not classify the ticket"};
        }

        Triage|error validTriage = constraint:validate(triage);
        if validTriage is error {
            log:printWarn("Model response failed validation", 'error = validTriage);
            return <http:BadGateway>{body: "Could not classify the ticket"};
        }
        return {...validTriage, queue: routeTo(validTriage)};
    }
}

# Selects the support queue for a classified ticket.
#
# + triage - The validated classification of the ticket
# + return - The name of the queue that handles the ticket
isolated function routeTo(Triage triage) returns string {
    if triage.priority == "high" {
        return string `${triage.category}-urgent`;
    }
    if triage.category == "other" {
        return "general";
    }
    return triage.category;
}
```

## Test the deterministic logic

Model responses vary between calls, so test the parts of the integration that do not depend on the model: the routing rules, the constraints, and the binding of a response to `Triage`. Create a `tests/triage_test.bal` file.

> **Info:** For more information, see [Test Ballerina code](/learn/test-ballerina-code/test-a-simple-function/).

```ballerina
import ballerina/constraint;
import ballerina/test;

@test:Config
function testHighPriorityGoesToUrgentQueue() {
    Triage triage = {category: "billing", priority: "high", summary: "Customer was charged twice."};
    test:assertEquals(routeTo(triage), "billing-urgent");
}

@test:Config
function testOtherCategoryGoesToGeneralQueue() {
    Triage triage = {category: "other", priority: "low", summary: "Customer asks about opening hours."};
    test:assertEquals(routeTo(triage), "general");
}

@test:Config
function testCategoryIsUsedAsQueue() {
    Triage triage = {category: "shipping", priority: "medium", summary: "Parcel is late."};
    test:assertEquals(routeTo(triage), "shipping");
}

@test:Config
function testEmptyTicketBodyIsRejected() {
    Ticket ticket = {subject: "Refund", body: ""};
    Ticket|error result = constraint:validate(ticket);
    test:assertTrue(result is error);
}

@test:Config
function testEmptySummaryIsRejected() {
    Triage triage = {category: "account", priority: "low", summary: ""};
    Triage|error result = constraint:validate(triage);
    test:assertTrue(result is error);
}

@test:Config
function testUnknownCategoryCannotBeBound() {
    json response = {category: "legal", priority: "low", summary: "Asks about terms."};
    test:assertTrue(response.cloneWithType(Triage) is error);
}
```

The module-level model provider is initialized when the tests run, so add a `tests/Config.toml` file with a placeholder key. The tests do not call the model.

```toml
openAiApiKey = "test-key"
```

Run the tests.

```
$ bal test
```

```
Running Tests

	ticket_triage_service
		[pass] testCategoryIsUsedAsQueue
		[pass] testEmptySummaryIsRejected
		[pass] testEmptyTicketBodyIsRejected
		[pass] testHighPriorityGoesToUrgentQueue
		[pass] testOtherCategoryGoesToGeneralQueue
		[pass] testUnknownCategoryCannotBeBound


		6 passing
		0 failing
		0 skipped
```

## Run the integration

Execute the command below to run the service.

```
$ bal run
```

You view the output below.

```
Compiling source
        ballerina_tutorials/ticket_triage_service:0.1.0

Running executable
```

## Try the integration

Send a ticket to the service. Because the classification is generated by an LLM, your results will differ. The response below is illustrative.

```
$ curl -X POST http://localhost:8080/tickets/triage \
    -H "Content-Type: application/json" \
    -d '{"subject": "Charged twice", "body": "I was charged twice for order ORD-1042 and need the second charge refunded."}'
{"category":"billing", "priority":"medium", "summary":"The customer was charged twice for order ORD-1042 and requests a refund of the duplicate charge.", "queue":"billing"}
```

If you receive a classified ticket, your Ballerina installation, model provider configuration, and API key are working, and you can continue with the other guides in this section.

Verify the failure handling:

- Send a ticket with an empty body. The payload fails the constraint check and is rejected without calling the model.

    ```
    $ curl -i -X POST http://localhost:8080/tickets/triage \
        -H "Content-Type: application/json" \
        -d '{"subject": "Refund", "body": ""}'
    HTTP/1.1 400 Bad Request
    ...
    {"timestamp":"...", "status":400, "reason":"Bad Request", "message":"payload validation failed: Validation failed for '$.body:minLength' constraint(s).", "path":"/tickets/triage", "method":"POST"}
    ```

- Stop the service, set `openAiApiKey` in `Config.toml` to an invalid value, and run the service again. The provider rejects the request, the service logs `Failed to classify the ticket` with the provider's `401` response, and the caller receives `502 Bad Gateway`.

    ```
    HTTP/1.1 502 Bad Gateway
    ...
    Could not classify the ticket
    ```

## Choose your next guide

Each guide in this section builds a complete integration around one building block.

- [Add an LLM step to an integration](/learn/add-an-llm-step-to-an-integration/) — Use a direct, typed LLM call as one step of a larger flow, with input preparation, validation, and fallbacks.
- [Use natural expressions in an integration](/learn/work-with-llms-using-natural-expressions/) — Write the prompt as a natural expression and bind the result to a validated type.
- [Ground responses with enterprise data](/learn/ground-responses-with-enterprise-data/) — Ingest documents into a knowledge base and answer questions from them with RAG.
- [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/) — Give an agent tools that call your systems, and expose it through a chat API with memory.
- [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/) — Publish integration logic as an MCP server and use MCP tools from an agent.
- [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/) — Pause a process for a human decision and resume it reliably with `ballerina/workflow`.
- [Evaluate agent behavior](/learn/evaluate-agent-behavior/) — Test that an agent calls the right tools and gives acceptable answers.
- [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/) — Trace model and tool calls, and protect credentials and sensitive data.

## Learn more

- [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/)
- [Write a workflow with a human task](/learn/write-a-workflow-with-a-human-task/)
- [Direct LLM calls](/learn/by-example/direct-llm-calls/) — Ballerina by Example
- [Direct LLM calls with history](/learn/by-example/direct-llm-calls-with-history/) — Ballerina by Example
- [Natural expressions](/learn/by-example/natural-expressions/) — Ballerina by Example
- [RAG with in-memory vector store](/learn/by-example/rag-with-in-memory-vector-store/) — Ballerina by Example
- [RAG ingestion with external vector store](/learn/by-example/rag-ingestion-with-external-vector-store/) — Ballerina by Example
- [Agent with local tools](/learn/by-example/ai-agent-local-tools/) — Ballerina by Example
- [Agent with external endpoint integration](/learn/by-example/ai-agent-external-endpoint-integration/) — Ballerina by Example
- [MCP service](/learn/by-example/mcp-service/) — Ballerina by Example
- [Agent with MCP integration](/learn/by-example/ai-agent-mcp-integration/) — Ballerina by Example
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
- [`ballerina/mcp` module](https://lib.ballerina.io/ballerina/mcp/latest/) — API documentation
- [`ballerina/workflow` module](https://lib.ballerina.io/ballerina/workflow/latest/) — API documentation
