---
layout: ballerina-human-in-the-loop-agents-left-nav-pages-swanlake
title: Human-in-the-loop agents
description: Learn how to require human approval before an AI agent in Ballerina calls sensitive tools, how to resume paused runs, and how to expose approvals over a chat service.
keywords: ballerina, AI, agent, human in the loop, approval, tool approval, resume
permalink: /learn/human-in-the-loop-agents/
active: human-in-the-loop-agents
intro: This guide explains how to gate sensitive tool calls behind human approval, how a paused run is resumed, and how approvals work with persistent memory and chat services.
---

## Why human-in-the-loop

Some tool calls have consequences that should not be left to the LLM alone, such as issuing refunds, sending messages to customers, or deleting data. Human-in-the-loop approval lets an agent propose such a call, pause, and continue only after a person approves or rejects it.

## Mark a tool as requiring approval

Set the `requiresApproval` field of the `@ai:AgentTool` annotation. The value can be `true` to always require approval, or an `isolated` function with the same parameters as the tool that returns `boolean`, to decide per call from the proposed arguments (e.g., only refunds above a threshold).

```ballerina
import ballerina/ai;

# Issues a refund for an order. This action is irreversible.
# + orderId - The order ID
# + amount - The amount to refund
@ai:AgentTool {requiresApproval: true}
isolated function issueRefund(string orderId, decimal amount) returns string|error {
    // ...
}
```

## Handle the pause and resume the run

When the agent proposes a call to a gated tool, `run` returns an `ai:ApprovalRequiredError`. Its detail carries one `ai:ApprovalRequest` per pending call with the request ID, the tool name, and the proposed arguments. If the LLM proposed several gated calls in the same turn, all of them are listed.

To continue, call `run` again with an `ai:Resume` value instead of a query, using the same session ID. The `decisions` map associates each request ID with an `ai:HumanDecision`: `ai:APPROVE`, or `ai:REJECT` with an optional reason that is shown to the agent. The agent executes the approved calls, learns about the rejected ones, and continues to produce the final response. A partial map is allowed; the undecided requests stay pending and a new `ai:ApprovalRequiredError` lists them.

```ballerina
import ballerina/io;

public function main() returns error? {
    string sessionId = "customer-7";
    string|ai:Error result = supportAgent.run("Please refund my order ORD-1001 in full.", sessionId);

    if result is ai:ApprovalRequiredError {
        map<ai:HumanDecision> decisions = {};
        foreach ai:ApprovalRequest request in result.detail().requests {
            io:println(string `Approval required to call '${request.toolName}' with arguments ${
                    request.arguments.toJsonString()}`);
            string answer = io:readln("Approve? (y/n): ");
            decisions[request.id] = answer.toLowerAscii() == "y" ?
                    {outcome: ai:APPROVE} :
                    {outcome: ai:REJECT, reason: "Rejected by the support supervisor"};
        }
        ai:Resume resume = {decisions: decisions.cloneReadOnly()};
        string response = check supportAgent.run(resume, sessionId);
        io:println("Agent: ", response);
    } else {
        io:println("Agent: ", check result);
    }
}
```

See the [Human-in-the-loop tool approval](/learn/by-example/ai-agent-human-in-the-loop/) example.

## Persist the paused state

When a run pauses, the agent saves a checkpoint: the conversation so far and the tool calls that are waiting for a decision. The checkpoint is stored in the agent's memory store, and `run` reads it back when it receives an `ai:Resume` for the same session.

Where the checkpoint lives decides how long the pause can last.

- With the default in-memory store, the checkpoint exists only in the running process. The decision must arrive before the program stops.
- With a persistent store, the checkpoint is written to the database, so the run can be resumed after a restart or by a different instance of the program. This is what an approval that takes minutes, hours, or a manual review step needs.

To make pauses durable, configure the agent with a persistent short-term memory store. The example below uses SQLite via the [`ballerinax/ai.sqlite`](https://central.ballerina.io/ballerinax/ai.sqlite/latest) module; [`ballerinax/ai.memory.postgresql`](https://central.ballerina.io/ballerinax/ai.memory.postgresql/latest) and the other stores work the same way. The checkpoint table must exist before an agent with approval-gated tools runs; the module documentation gives its schema.

```ballerina
import ballerinax/ai.sqlite;

// The store keeps both the conversation history and the pause checkpoints.
final sqlite:ShortTermMemoryStore store = check new ({url: "jdbc:sqlite:./support_agent.db"});

final ai:Agent supportAgent = check new ({
    systemPrompt: {
        role: "Customer Support Agent",
        instructions: "You help customers with their orders and issue refunds when asked."
    },
    model: check ai:getDefaultModelProvider(),
    tools: [getOrder, issueRefund],
    memory: check new ai:ShortTermMemory(store)
});
```

Two errors tell you that a resume did not match a pause: `ai:ApprovalNotFoundError` when the session has nothing pending, and `ai:UnknownApprovalIdError` when a decision names a request ID that is not pending. See [Persist agent memory](/learn/persist-agent-memory/) for the memory stores.

## Approvals over a chat service

When the agent is exposed as a chat service on an `ai:Listener`, the pause and the decision travel over HTTP.

1. A client sends a message to the `chat` resource.
2. If the agent pauses, the resource returns the `ai:ApprovalRequiredError` as is. The listener converts it into an HTTP 403 response whose body lists the pending `ai:ApprovalRequest` values, so the resource needs no error handling of its own.
3. The client shows the requests to a person, collects the decisions, and posts them to the `decision` resource as an `ai:DecisionMessage` (the session ID plus the decisions keyed by request ID).
4. The `decision` resource resumes the run with an `ai:Resume` built from those decisions and returns the final answer.

Add the `decision` resource next to the `chat` resource.

```ballerina
import ballerina/http;

service /support on new ai:Listener(8080) {
    resource function post chat(@http:Payload ai:ChatReqMessage request) returns ai:ChatRespMessage|error {
        // A paused run returns an `ai:ApprovalRequiredError`, which becomes an HTTP 403 response
        // listing the pending approval requests.
        string response = check supportAgent.run(request.message, request.sessionId);
        return {message: response};
    }

    resource function post decision(@http:Payload ai:DecisionMessage request) returns ai:ChatRespMessage|error {
        // Resume the paused run of the session with the human's decisions.
        ai:Resume resume = {decisions: request.decisions};
        string response = check supportAgent.run(resume, request.sessionId);
        return {message: response};
    }
}
```

On the client side, `ai:ChatClient` provides matching `chat` and `decision` operations. A paused run surfaces as an `http:ClientRequestError` (HTTP 403) whose body carries the pending requests.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/io;

public function main() returns error? {
    ai:ChatClient chatClient = check new ("http://localhost:8080/support");
    string sessionId = "customer-7";

    ai:ChatRespMessage|error response = chatClient->/chat.post({
        sessionId,
        message: "Please refund order ORD-1001 in full."
    });

    if response is http:ClientRequestError {
        // The run paused. Read the pending requests and collect the decisions.
        record {|ai:ApprovalRequest[] requests;|} pending = check response.detail().body.cloneWithType();
        map<ai:HumanDecision> decisions = {};
        foreach ai:ApprovalRequest request in pending.requests {
            io:println(string `Approve '${request.toolName}' with ${request.arguments.toJsonString()}?`);
            decisions[request.id] = {outcome: ai:APPROVE};
        }
        // Submit the decisions. The service resumes the run and returns the final answer.
        response = chatClient->/decision.post({sessionId, decisions: decisions.cloneReadOnly()});
    }
    io:println((check response).message);
}
```

See the [Chat agents](/learn/by-example/chat-agents/) and [Chat client](/learn/by-example/ai-chat-client/) examples for the chat service and client basics.

## Learn more

- [Build an AI agent](/learn/build-an-ai-agent/)
- [Persist agent memory](/learn/persist-agent-memory/)
- [Human-in-the-loop tool approval](/learn/by-example/ai-agent-human-in-the-loop/) example
- [`ballerina/ai` module](https://central.ballerina.io/ballerina/ai/latest)
