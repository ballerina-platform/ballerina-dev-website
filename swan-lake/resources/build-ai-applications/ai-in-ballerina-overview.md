---
layout: ballerina-ai-in-ballerina-overview-left-nav-pages-swanlake
title: AI in Ballerina overview
description: Learn how the Ballerina AI library and related modules fit together to build LLM-powered applications, agents, RAG workflows, and MCP servers.
keywords: ballerina, AI, LLM, agent, RAG, MCP, natural expressions, model provider
permalink: /learn/ai-in-ballerina-overview/
active: ai-in-ballerina-overview
intro: This guide gives an overview of the building blocks Ballerina provides for AI applications and maps each of them to the module that provides it.
---

## The building blocks

Most AI applications need a few things: call a model, let an assistant act on a user's behalf, answer questions from your own documents, connect your services to AI assistants, and check the results. Ballerina provides a building block for each, so you can start with a single LLM call and grow from there.

| Building block | What it does | Reference links |
|---|---|---|
| Model providers | A unified interface to call large language models (LLMs) for chat and structured generation | [Configure model and embedding providers](/learn/configure-model-and-embedding-providers/), [Direct LLM calls](/learn/by-example/direct-llm-calls/), [`ballerina/ai`](https://central.ballerina.io/ballerina/ai/latest) |
| Agents and memory | Autonomous reasoning-action loops that use tools, memory, and a system prompt to complete tasks, with conversation history kept per session in memory or persisted in a database | [Build an AI agent](/learn/build-an-ai-agent/), [Persist agent memory](/learn/persist-agent-memory/), [Agent with local tools](/learn/by-example/ai-agent-local-tools/), [Agent with persistent memory](/learn/by-example/ai-agent-persistent-memory/) |
| Retrieval-augmented generation (RAG) | Load, chunk, embed, and index documents, and retrieve relevant context for a query | [Build a RAG application](/learn/build-a-rag-application/), [Retrieve from an in-memory vector store](/learn/by-example/rag-in-memory-vector-store-retrieval/) |
| Model Context Protocol (MCP) | Expose tools to AI clients as an MCP server and consume tools from MCP servers | [Expose and consume MCP servers](/learn/expose-and-consume-mcp-servers/), [MCP service](/learn/by-example/mcp-service/), [MCP client](/learn/by-example/mcp-client/), [`ballerina/mcp`](https://central.ballerina.io/ballerina/mcp/latest) |
| Observability and evaluation | Inspect agent execution traces, publish traces, and evaluate agent quality with tests | [Observe and evaluate agents](/learn/observe-and-evaluate-agents/), [Agent execution trace](/learn/by-example/ai-agent-execution-trace/), [Agent evaluation](/learn/by-example/ai-agent-evaluation/), [`ballerina/ai.eval`](https://central.ballerina.io/ballerina/ai.eval/latest) |
| Natural expressions and natural functions | Language-level syntax to call an LLM with a natural language prompt and bind the response to a Ballerina type | [Natural programming](/learn/natural-programming/), [Natural expressions](/learn/by-example/natural-expressions/), [Natural functions](/learn/by-example/natural-functions/) |

## How the pieces fit together

### Model providers

All LLM access goes through the `ai:ModelProvider` abstraction. `ai:getDefaultModelProvider()` returns the WSO2-hosted provider, and the `ballerinax/ai.<provider>` modules (OpenAI, Azure OpenAI, Anthropic, Ollama, and others) provide implementations for your own accounts; switching providers changes only the initialization. A provider exposes `generate`, which converts the expected Ballerina type to a JSON schema, sends it with the prompt, and binds the response to that type, and `chat`, which takes the message history and optional tool definitions and returns the assistant message, including any tool calls.

### RAG ingestion

Ingestion turns documents into searchable vectors through the `ai:VectorKnowledgeBase`. Documents are loaded with an `ai:DataLoader` (files via `ai:TextDataLoader`, or sources such as SharePoint), split into chunks by an `ai:Chunker` (selected automatically from the document type, or configured explicitly), embedded in a batch by an `ai:EmbeddingProvider`, and written as `ai:VectorEntry` values to an `ai:VectorStore` (in-memory, pgvector, Pinecone, Milvus, or Weaviate). Each chunk keeps its metadata, such as the file name and custom fields, for later filtering.

### RAG retrieval

Retrieval embeds the query with the same `ai:EmbeddingProvider`, runs a similarity search on the `ai:VectorStore` with a result limit and optional `ai:MetadataFilters`, and returns the matching chunks as `ai:QueryMatch` values with similarity scores. `ai:augmentUserQuery` injects the chunks into the prompt as context before the `chat` call, so the model answers from your data. Any retrieval backend can be plugged in by implementing `ai:KnowledgeBase`.

### AI agents

An `ai:Agent` runs a reasoning-action loop over a model provider: each iteration sends the conversation and the tool schemas to the LLM, executes the returned tool calls, appends the results as function messages, and repeats until the LLM answers or the iteration limit is reached. Tools are `isolated` functions annotated with `@ai:AgentTool` (the input schema is derived from the parameter types and documentation), `ai:BaseToolKit` implementations, `ai:McpToolKit` instances, or a knowledge base wrapped in a tool. Conversation state is held in an `ai:Memory` keyed by session ID; `ai:ShortTermMemory` bounds it by message count with trimming or model-assisted summarization on overflow, and `ai:ShortTermMemoryStore` implementations persist it in SQLite, PostgreSQL, Redis, or SQL Server. Tools flagged with `requiresApproval` suspend the loop with an `ai:ApprovalRequiredError`, checkpoint the run, and resume on an `ai:Resume`. Agents are published over HTTP through `ai:Listener` and `ai:ChatService`, with `ai:ChatClient` as the typed client.

### MCP

The `ballerina/mcp` module implements both sides of the Model Context Protocol over the Streamable HTTP transport. Remote methods of an `mcp:StreamableHttpService` attached to an `mcp:StreamableHttpListener` are published as tools with schemas generated from the signatures and documentation, `mcp:StreamableHttpAdvancedService` gives manual control over tool listing and invocation, and the service is secured with the standard HTTP listener and authentication configuration. `mcp:StreamableHttpClient` consumes tools from any MCP server, and `ai:McpToolKit` makes them available to an agent.

### Observability and evaluation

Requesting `ai:Trace` as the result type of `run` returns the full execution record: every iteration's message history, tool calls, outputs, and timings. The `ballerinax/amp` module exports these as OpenTelemetry spans to the WSO2 AI Agent Management Platform. The `ballerina/ai.eval` module turns quality checks into `ballerina/test` cases, with rule-based templates (tool trajectory, content coverage, iteration and latency budgets) and LLM-as-a-judge templates (helpfulness, groundedness, safety, and others) that run against recorded evaluation sets or ad-hoc queries.

### Natural programming

Natural expressions (`natural (model) { ... }`) are the language-level counterpart of `generate`: the prompt is written in natural language with `${...}` interpolations, the JSON schema of the expected type is generated at compile time by `ballerina/ai.np`, and the LLM response is validated and bound to that type at runtime. A natural function is a function whose body is a natural expression, so the typed signature is the contract and the logic is delegated to the LLM. Both are experimental and require the `--experimental` flag.

## Where to go next

- [Configure model and embedding providers](/learn/configure-model-and-embedding-providers/) to choose an LLM and an embedding model.
- [Build an AI agent](/learn/build-an-ai-agent/) to create an agent with tools and a chat interface.
- [Persist agent memory](/learn/persist-agent-memory/) to keep conversation history across restarts.
- [Build a RAG application](/learn/build-a-rag-application/) to ground responses in your documents.
- [Expose and consume MCP servers](/learn/expose-and-consume-mcp-servers/) to integrate with the MCP ecosystem.
- [Human-in-the-loop agents](/learn/human-in-the-loop-agents/) to require approval before sensitive tool calls.
- [Observe and evaluate agents](/learn/observe-and-evaluate-agents/) to inspect traces and test agent quality.
- [Natural programming](/learn/natural-programming/) to use natural expressions and natural functions.
- [Work with Large Language Models (LLMs) using natural expressions](/learn/work-with-llms-using-natural-expressions/) for a step-by-step tutorial.
- The Generative AI section of [Ballerina by Example](/learn/by-example/) for runnable examples of every building block.
