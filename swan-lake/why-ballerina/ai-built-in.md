---
layout: ballerina-why-ballerina-left-nav-pages-swanlake
title: AI built in
description: Natural expressions return typed values from a model, and the compiler checks the type. Build agents, and build and host MCP servers.
keywords: ballerina, programming language, ai built in, why ballerina
permalink: /why-ballerina/ai-built-in/
active: ai-built-in
intro: Natural expressions return typed values from a model, and the compiler checks the type. Build agents, and build and host MCP servers.
---

Calling a model usually means sending text and parsing text back. Ballerina's AI support is provided through AI libraries and a small amount of language support. You describe what you want in a natural expression, state the type you expect, and get a typed value. The compiler checks that type.

## Natural expressions return typed values

A natural expression sends a prompt to a model provider and binds the response to the declared return type. Interpolated values such as `${message}` are part of the prompt.

```ballerina
// TODO: verify syntax
import ballerina/ai;

type Category "BILLING"|"TECHNICAL"|"OTHER";

final ai:ModelProvider model = check ai:getDefaultModelProvider();

function classify(string message) returns Category|error =>
    natural (model) {
        Classify this support message: ${message}
    };
```

Because the expected type is part of the program, a response that does not fit it comes back as an `error` you handle, instead of an unchecked string flowing into later code. The declared type also tells a reader, or an AI agent writing the code, exactly what the model is expected to return.

## Agents and tools

An agent combines a model with tools. In Ballerina a tool is an ordinary typed function, so the set of things an agent can do is a list of functions you can read and review.

```ballerina
// TODO: verify syntax
import ballerina/ai;

@ai:AgentTool
function lookupOrder(string orderId) returns json|error {
    // Query the order service.
    return {id: orderId, status: "SHIPPED"};
}
```

[LINK: agent documentation]

## MCP servers and clients

The Model Context Protocol lets external AI applications discover and call tools. A Ballerina service can expose functions as MCP tools, and a Ballerina program can call tools hosted elsewhere.

```ballerina
// TODO: verify syntax
import ballerina/mcp;

listener mcp:Listener mcpListener = check new (9090);

service /mcp on mcpListener {
    remote function getProductStock(string productId) returns int|error {
        // Look up stock for the product.
        return 12;
    }
}
```

[LINK: MCP documentation]

## Durable agents

Long-running agents can run as durable workflows, so their state survives crashes, restarts, and deployments. See [Concurrent and durable](/why-ballerina/concurrent/).

## Related

- [Cloud native](/why-ballerina/cloud-native/)
- [Graphical](/why-ballerina/graphical/)
- [Data oriented](/why-ballerina/data-oriented/)
- [Flexibly typed](/why-ballerina/flexibly-typed/)
- [Concurrent and durable](/why-ballerina/concurrent/)

## Learn more

- [Ballerina by Example](https://ballerina.io/learn/by-example/)
- [Language specification](https://ballerina.io/spec/lang/) [LINK: confirm specification URL]
