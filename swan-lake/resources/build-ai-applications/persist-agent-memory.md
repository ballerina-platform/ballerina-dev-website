---
layout: ballerina-persist-agent-memory-left-nav-pages-swanlake
title: Persist agent memory
description: Learn how AI agents in Ballerina keep conversation history per session, how to persist it in SQLite, PostgreSQL, Redis, or SQL Server, and how to handle memory overflow.
keywords: ballerina, AI, agent, memory, short-term memory, persistence, SQLite, PostgreSQL, Redis, overflow
permalink: /learn/persist-agent-memory/
active: persist-agent-memory
intro: This guide explains how agent memory works, how to persist it so conversations survive restarts, and how to control what happens when the memory is full.
---

## How agent memory works

An agent keeps the conversation history of each session in its memory (`ai:Memory`), keyed by the session ID passed to the `run` method. Before each LLM call, the agent loads the history of the session and, after the call, stores the new user, assistant, and tool messages. This is what allows follow-up questions to refer to earlier messages, and what keeps the conversations of different users separate.

By default, an agent uses `ai:ShortTermMemory` backed by an `ai:InMemoryShortTermMemoryStore` with a fixed capacity per session. To create a stateless agent, set the `memory` field of the agent configuration to `()`.

## Configure the memory capacity

Create the memory explicitly to control the number of messages retained per session, and pass it to the agent.

```ballerina
import ballerina/ai;

final ai:Memory memory = check new ai:ShortTermMemory(check new ai:InMemoryShortTermMemoryStore(20));

final ai:Agent travelAgent = check new ({
    systemPrompt: {
        role: "Travel Assistant",
        instructions: "You help users plan trips. Remember the details the user shares."
    },
    model: check ai:getDefaultModelProvider(),
    memory
});
```

The memory instance can also be used directly to inspect or clear the history of a session.

```ballerina
ai:ChatMessage[] messages = check memory.get("user-1");
check memory.delete("user-1");
```

See the [Agent with in-memory short-term memory](/learn/by-example/ai-agent-memory/) example.

## Persist the memory

The in-memory store is lost when the program stops and cannot be shared by several instances of the agent. To persist the history, use a persistent `ai:ShortTermMemoryStore` implementation with the `ai:ShortTermMemory`. The persistent stores also keep the checkpoints of runs paused for human approval (see [Human-in-the-loop agents](/learn/human-in-the-loop-agents/)), provided the checkpoint table is created beforehand as described in the module documentation.

| Module | Store |
|---|---|
| [`ballerinax/ai.sqlite`](https://central.ballerina.io/ballerinax/ai.sqlite/latest) | SQLite, in-process, no external service required |
| [`ballerinax/ai.memory.postgresql`](https://central.ballerina.io/ballerinax/ai.memory.postgresql/latest) | PostgreSQL |
| [`ballerinax/ai.memory.redis`](https://central.ballerina.io/ballerinax/ai.memory.redis/latest) | Redis |
| [`ballerinax/ai.memory.mssql`](https://central.ballerina.io/ballerinax/ai.memory.mssql/latest) | Microsoft SQL Server |
| [`ballerinax/ai.aws.dynamodb`](https://central.ballerina.io/ballerinax/ai.aws.dynamodb/latest) | Amazon DynamoDB |

### SQLite

SQLite runs in-process via a bundled JDBC driver, so it is the simplest option for local development and single-instance deployments. The chat messages table is created automatically if it does not exist; the checkpoint table used for human-in-the-loop approvals must be created beforehand (see the module documentation for the schema).

```ballerina
import ballerina/ai;
import ballerinax/ai.sqlite;

final sqlite:ShortTermMemoryStore store = check new ({url: "jdbc:sqlite:./agent_memory.db"},
        maxMessagesPerKey = 30);
final ai:Memory memory = check new ai:ShortTermMemory(store);
```

Use `jdbc:sqlite::memory:` as the URL for an in-process database that is not written to disk.

### PostgreSQL

```ballerina
import ballerina/ai;
import ballerinax/ai.memory.postgresql;

configurable string dbPassword = ?;

final postgresql:ShortTermMemoryStore store = check new ({
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: dbPassword,
    database: "agent_memory"
}, maxMessagesPerKey = 20);
final ai:Memory memory = check new ai:ShortTermMemory(store);
```

The store constructor also accepts an existing `postgresql:Client`. The Redis, SQL Server, and DynamoDB stores follow the same pattern; see their module documentation for the connection configuration.

With a persistent store, a program that is restarted continues the conversation where it left off, as demonstrated in the [Agent with persistent memory](/learn/by-example/ai-agent-persistent-memory/) example.

## Handle memory overflow

When a session reaches the capacity of the store, the overflow handler decides what happens to the oldest messages. Two strategies are available.

- **Trim** (`ai:TrimOverflowHandlerConfiguration`, the default): removes the oldest messages. The `trimCount` field controls how many messages are removed at a time.
- **Model-assisted** (`ai:ModelAssistedOverflowHandlerConfiguration`): uses an LLM to summarize the older messages into a single message, so important context is retained in condensed form. An optional custom summarization prompt can be provided.

```ballerina
final ai:ShortTermMemory trimmingMemory = check new (check new ai:InMemoryShortTermMemoryStore(6),
        <ai:TrimOverflowHandlerConfiguration>{trimCount: 2});

final ai:ShortTermMemory summarizingMemory = check new (check new ai:InMemoryShortTermMemoryStore(6),
        <ai:ModelAssistedOverflowHandlerConfiguration>{model: check ai:getDefaultModelProvider()});
```

See the [Memory overflow handling](/learn/by-example/ai-agent-memory-overflow-handling/) example.

## Implement a custom memory

For other backends, implement the `ai:ShortTermMemoryStore` object type (message and checkpoint operations) and use it with `ai:ShortTermMemory`, or implement the `ai:Memory` object type directly (`get`, `update`, and `delete`).

## Learn more

- [Build an AI agent](/learn/build-an-ai-agent/)
- [Agent with in-memory short-term memory](/learn/by-example/ai-agent-memory/), [Agent with persistent memory](/learn/by-example/ai-agent-persistent-memory/), and [Memory overflow handling](/learn/by-example/ai-agent-memory-overflow-handling/) examples
- [`ballerina/ai` module](https://central.ballerina.io/ballerina/ai/latest)
