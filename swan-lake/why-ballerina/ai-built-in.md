---
layout: ballerina-why-ballerina-left-nav-pages-swanlake
title: AI built in
description: One API for any model, one API for retrieval, agents you can call from any integration, and MCP on the same service and client abstractions you already use. Natural functions return typed values the compiler checks.
keywords: ballerina, programming language, ai built in, llm, agents, mcp, rag, natural functions, why ballerina
permalink: /why-ballerina/ai-built-in/
active: ai-built-in
intro: One API for any model, one API for retrieval, agents you can call from any integration, and MCP on the same service and client abstractions you already use. Natural functions return typed values the compiler checks.
---

Most AI work in production is integration work. A model has to be called from a service, grounded in enterprise data, given access to business systems as tools, triggered by events and schedules, and tested before it ships. In many languages, each of these steps comes with its own SDK, its own data shapes, and its own glue code.

Ballerina approaches this the same way it approaches networking: with the right abstractions. The language provides services, clients, and types. The standard library builds on them to define a unified API for models, embeddings, data loaders, chunkers, vector stores, agents, and the Model Context Protocol (MCP). Each of these is an interface that providers implement, so the code you write against it stays the same when the provider changes.

## One API for any model

`ai:ModelProvider` is a common abstraction for large language models. OpenAI, Anthropic, Azure OpenAI, Mistral, Ollama, and other providers implement the same interface, so you call every model the same way. Switching providers is a change to the line that creates the provider, not to the code that uses it.

```ballerina
import ballerina/ai;
import ballerina/io;

// Use the default model provider (configured via a Ballerina VS Code command).
// Alternatively, use any provider, e.g., `new openai:ModelProvider(...)`.
final ai:ModelProvider model = check ai:getDefaultModelProvider();

type JokeResponse record {|
    string setup;
    string punchline;
|};

public function main(string subject) returns error? {
    // The response is bound to the expected type.
    JokeResponse joke = check model->generate(`Tell me a joke about ${subject}!`);
    io:println(joke.setup, " ", joke.punchline);
}
```

The prompt is a template, and the result is bound to the declared type. A response that does not fit the type comes back as an `error` you handle, not as an unchecked string flowing into later code.

## Natural functions

A natural expression lets you describe a task in plain language and state the type you expect back. Put one in the body of a function, and you get a natural function: an ordinary Ballerina function, with a typed signature, whose implementation is a prompt. Interpolated values such as `${message}` become part of the prompt.

```ballerina
import ballerina/ai;

final ai:ModelProvider model = check ai:getDefaultModelProvider();

# The category of a customer support message.
type Category "BILLING"|"TECHNICAL"|"OTHER";

function classify(string message) returns Category|error =>
    natural (model) {
        Classify this support message.
        Message: ${message}
    };
```

Callers see a normal function. The type in the signature tells the model what to produce, tells the runtime what to check, and tells a reader, or an AI agent writing the code, exactly what to expect. Use code where code is clearer and words where words are clearer, and combine the two in the same program.

Natural expressions are an experimental feature that requires Ballerina 2201.13.0 or later and the `--experimental` flag on `bal build`, `bal run`, and `bal test`.

## Retrieval-augmented generation with one API

Retrieval-augmented generation (RAG) grounds model responses in your own data. Ballerina defines a unified API for every stage of it: `ai:DataLoader` reads documents, `ai:Chunker` splits them, `ai:EmbeddingProvider` creates embeddings, and `ai:VectorStore` stores and searches them, with implementations for Pinecone, Weaviate, Milvus, pgvector, and an in-memory store. `ai:VectorKnowledgeBase` combines these into a knowledge base you ingest into and retrieve from.

```ballerina
import ballerina/ai;
import ballerinax/ai.pinecone;

configurable string pineconeServiceUrl = ?;
configurable string pineconeApiKey = ?;

// Swap Pinecone for another vector store, or `ai:InMemoryVectorStore`, without changing the rest.
final ai:VectorStore vectorStore = check new pinecone:VectorStore(pineconeServiceUrl, pineconeApiKey);
final ai:EmbeddingProvider embeddingProvider = check ai:getDefaultEmbeddingProvider();
final ai:KnowledgeBase knowledgeBase = new ai:VectorKnowledgeBase(vectorStore, embeddingProvider);

public function main() returns error? {
    // Load documents. Chunking is handled by the knowledge base,
    // or by an `ai:Chunker` such as `ai:MarkdownChunker` for finer control.
    ai:DataLoader loader = check new ai:TextDataLoader("./leave_policy.pdf");
    ai:Document|ai:Document[] documents = check loader.load();
    check knowledgeBase.ingest(documents);

    // Retrieve the most relevant chunks for a question.
    ai:QueryMatch[] matches = check knowledgeBase.retrieve("How many days of annual leave do I get?", 5);
}
```

Because each stage is an interface, you can change the vector database, the embedding model, or the chunking strategy independently. The ingestion pipeline and the query code stay the same.

## Agents you can call from anywhere

`ai:Agent` defines an agent: a system prompt, a model, a set of tools, and optional memory. A tool is an ordinary typed function annotated with `@ai:AgentTool`, so the set of things an agent can do is a list of functions you can read and review.

```ballerina
import ballerina/ai;
import ballerina/http;

final ai:ModelProvider model = check ai:getDefaultModelProvider();

# Retrieves an order, including its status, items, and tracking number.
#
# + orderId - The order ID, in the format ORD-1234
# + return - The order, or an error that describes why it could not be retrieved
@ai:AgentTool
isolated function getOrder(string orderId) returns json|error {
    // Call the order service.
    return {id: orderId, status: "SHIPPED"};
}

final ai:Agent orderAgent = check new (
    systemPrompt = {role: "Order Support Assistant", instructions: "Answer questions about orders. Use the tools; do not guess."},
    model = model,
    tools = [getOrder]
);

// Call the agent from an HTTP service...
service /support on new http:Listener(8080) {
    resource function post chat(ai:ChatReqMessage request) returns ai:ChatRespMessage|error {
        string answer = check orderAgent.run(request.message, request.sessionId);
        return {message: answer};
    }
}

// ...or from a scheduled job, or any other function.
public function main() returns error? {
    string report = check orderAgent.run("Summarize orders that are delayed by more than three days.");
}
```

An agent is a value, and `run` is a function call. This means you can invoke an agent wherever an integration does its work: inside an HTTP or GraphQL resource, when a Kafka or RabbitMQ message arrives, when a file lands on an FTP server, or in a scheduled job. The agent becomes one step in the integration, with the same error handling, types, and observability as every other step.

## MCP on services and clients

The Model Context Protocol lets AI applications discover and call tools. Ballerina already has high-level service and client abstractions, and the `ballerina/mcp` library builds directly on them. To expose an MCP server, write a service. Its remote methods become tools, and the tool descriptions and schemas are generated from the method signatures and documentation.

```ballerina
import ballerina/mcp;

listener mcp:Listener mcpListener = new (9090);

service mcp:Service /mcp on mcpListener {

    # Get the current status of an order.
    #
    # + orderId - Order ID in the format ORD-NNNN
    # + return - The order status
    remote function getOrderStatus(string orderId) returns OrderStatus|error {
        return findOrderStatus(orderId);
    }
}
```

To consume an MCP server, connect to it as a toolkit and give it to an agent. MCP toolkits, local function tools, and other toolkits can be mixed in the same agent, and you can limit which of the server's tools the agent sees.

```ballerina
ai:McpToolKit orderTools = check new ("http://localhost:9090/mcp",
    ["getOrderStatus", "submitReturnRequest"], {name: "customer-care-agent", version: "1.0.0"});

ai:Agent agent = check new (
    systemPrompt = {role: "Customer Care Agent", instructions: "Help customers with order status and returns."},
    model = model,
    tools = [orderTools]
);
```

An existing integration can become an MCP server, and an agent can use tools hosted anywhere, with the same constructs you use for any other service or client.

## Evaluation with the test framework

Agents need to be tested like any other code, but their output varies between runs. Ballerina evaluates agents with `ballerina/test`, the same framework you use for the rest of the integration. A data provider feeds recorded conversations into the agent, `runs` repeats each case, and `minPassRate` sets how often it must pass.

```ballerina
import ballerina/ai;
import ballerina/test;

isolated function orderThreads() returns map<[readonly & ai:ConversationThread]>|error =>
    ai:loadConversationThreads("tests/resources/evalsets/order_support.evalset.json");

@test:Config {dataProvider: orderThreads, runs: 3, minPassRate: 0.8}
isolated function evaluateOrderAgent(ai:ConversationThread thread) returns error? {
    ai:Agent agent = check createOrderAgent(model);
    foreach ai:Trace expected in thread.traces {
        ai:Trace actual = check agent.run(ai:getUserQuery(expected), thread.id);
        // Check the tool calls deterministically, and the answer with a model-based judge.
        test:assertTrue(checkToolCalls(expected.toolCalls ?: [], actual.toolCalls ?: []).length() == 0);
    }
}
```

Tool calls and their order can be checked in code, and answers can be scored by a model acting as a judge. Evaluations run with `bal test`, so they fit into the same CI pipeline as your other tests.

## Durable agents

Long-running agents can run as durable workflows, so their state survives crashes, restarts, and deployments. See [Concurrent and durable](/why-ballerina/concurrent/).

## Related

- [Cloud native](/why-ballerina/cloud-native/)
- [Graphical](/why-ballerina/graphical/)
- [Data oriented](/why-ballerina/data-oriented/)
- [Flexibly typed](/why-ballerina/flexibly-typed/)
- [Concurrent and durable](/why-ballerina/concurrent/)

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Add an LLM step to an integration](/learn/add-an-llm-step-to-an-integration/)
- [Work with LLMs using natural expressions](/learn/work-with-llms-using-natural-expressions/)
- [Ground responses with enterprise data](/learn/ground-responses-with-enterprise-data/)
- [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/)
- [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/)
- [Evaluate agent behavior](/learn/evaluate-agent-behavior/)
- [Ballerina by Example](https://ballerina.io/learn/by-example/)
