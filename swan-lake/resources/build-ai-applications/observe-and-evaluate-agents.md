---
layout: ballerina-observe-and-evaluate-agents-left-nav-pages-swanlake
title: Observe and evaluate agents
description: Learn how to inspect the execution traces of AI agents in Ballerina, publish traces to the WSO2 AI Agent Management Platform, and evaluate agent quality with rule-based and LLM-as-a-judge tests.
keywords: ballerina, AI, agent, trace, observability, evaluation, LLM as a judge, testing, AMP
permalink: /learn/observe-and-evaluate-agents/
active: observe-and-evaluate-agents
intro: This guide explains how to see what an agent did during a run, how to publish traces for production observability, and how to verify agent quality with tests.
---

## Inspect execution traces

Use `ai:Trace` as the expected type of the `run` method to get the full execution trace instead of only the final answer. A trace captures:

- the user message,
- each reasoning-action cycle (`ai:Iteration`) with the message history at that point and the outputs produced: tool results (`ai:ChatFunctionMessage`), assistant messages, or errors,
- the tool calls requested by the LLM (`toolCalls`),
- the final output,
- the schemas of the tools available to the agent, and
- the start and end times.

The snippet below uses the `inventoryAgent` from the linked example.

```ballerina
import ballerina/ai;
import ballerina/io;

public function main() returns error? {
    ai:Trace trace = check inventoryAgent.run("Is product P-100 running low, and is more stock on the way?");

    io:println("Iterations: ", trace.iterations.length());
    foreach ai:Iteration iteration in trace.iterations {
        foreach ai:ChatAssistantMessage|ai:ChatFunctionMessage|ai:Error output in iteration.output {
            if output is ai:ChatFunctionMessage {
                io:println(string `Tool '${output.name}' returned: ${output.content ?: ""}`);
            } else if output is ai:ChatAssistantMessage {
                io:println("Assistant: ", output.content ?: "");
            }
        }
    }

    ai:FunctionCall[] toolCalls = trace.toolCalls ?: [];
    io:println("Tool calls: ", toolCalls.map(toolCall => toolCall.name));
}
```

See the [Agent execution trace](/learn/by-example/ai-agent-execution-trace/) example.

## Publish traces to the WSO2 AI Agent Management Platform

For production observability, the [`ballerinax/amp`](https://central.ballerina.io/ballerinax/amp/latest) module publishes agent traces to the WSO2 AI Agent Management Platform as OpenTelemetry spans over the OTLP HTTP endpoint. To enable it:

1. Import the module in your program.

    ```ballerina
    import ballerinax/amp as _;
    ```

2. Include observability when building, in the `Ballerina.toml` file.

    ```toml
    [build-options]
    observabilityIncluded=true
    ```

3. Enable tracing with the `amp` provider in the `Config.toml` file. The endpoint and the identifiers are optional.

    ```toml
    [ballerina.observe]
    tracingEnabled=true
    tracingProvider="amp"

    [ballerinax.amp]
    otelEndpoint="http://localhost:22893/otel"
    apiKey=""
    orgUid=""
    projectUid=""
    componentUid=""
    environmentUid=""
    ```

Every run of the agent then produces a trace in the platform.

The same spans can be published to any other supported tracing provider. For example, to publish them to [Jaeger](https://www.jaegertracing.io/), import the `ballerinax/jaeger` module (`import ballerinax/jaeger as _;`), include observability when building, and enable tracing with the `jaeger` provider in the `Config.toml` file. The `[ballerinax.jaeger]` section sets the host and the port of the OpenTelemetry (OTLP) gRPC endpoint of Jaeger.

```toml
[ballerina.observe]
tracingEnabled=true
tracingProvider="jaeger"

[ballerinax.jaeger]
agentHostname="localhost"
agentPort=4317
```

Each run of the agent then appears in the Jaeger UI as an `invoke_agent` span, with a `chat` span for each LLM call and an `execute_tool` span for each tool call. See the [Publish agent traces to Jaeger](/learn/by-example/ai-agent-tracing-jaeger/) example. For general Ballerina observability, including other tracing providers, see [Overview of Ballerina observability](/learn/overview-of-ballerina-observability/).

## Evaluate agents with tests

The behavior of an agent depends on the model, the system prompt, and the tools, and can regress as any of them changes. The [`ballerina/ai.eval`](https://central.ballerina.io/ballerina/ai.eval/latest) module provides evaluation templates that run the agent and report the outcome through the assertions of the `ballerina/test` module, so evaluations are ordinary Ballerina tests in the `tests` directory of a package.

Two families of templates are available.

| Family | Examples | How it scores |
|---|---|---|
| Rule-based | `assertIterationEfficiency`, `assertContentCoverage`, `assertContentSafety`, `assertLengthCompliance`, `assertLatencyPerformance`, `assertExactMatch`, `assertContainsMatch`, `evaluateToolTrajectory` | In code, without an LLM |
| LLM-as-a-judge | `evaluateHelpfulness`, `evaluateOutputAccuracy`, `evaluateRelevance`, `evaluateGroundedness`, `evaluateSafety`, `evaluateTone`, `evaluateInstructionFollowing`, `evaluateSemanticSimilarity` | A judge model returns a score and its reasoning; the evaluation passes when the score reaches the threshold (default `0.8`) |

Templates accept either a single query (`string`) or a recorded conversation thread (`ai:ConversationThread`) loaded from an evaluation set with `ai:loadConversationThreads`. Threads are required by templates that compare against a recorded response or tool trajectory. A verdict on the agent fails the test through an assertion, whereas a failure to run the evaluation (e.g., the judge could not be reached) is returned as an error, so a broken provider is not mistaken for poor agent quality.

The `convertCurrency` tool below is the one defined in the linked example.

```ballerina
import ballerina/ai;
import ballerina/ai.eval;
import ballerina/test;

final ai:ModelProvider model = check ai:getDefaultModelProvider();

final ai:Agent financeAgent = check new ({
    systemPrompt: {
        role: "Finance Assistant",
        instructions: "You answer currency questions using the tools. Be concise and state the converted amount."
    },
    model,
    tools: [convertCurrency]
});

@test:Config {}
function testIterationEfficiency() returns error? {
    check eval:assertIterationEfficiency(financeAgent, "Convert 100 USD to EUR.", maxIterations = 3);
}

@test:Config {}
function testContentCoverage() returns error? {
    check eval:assertContentCoverage(financeAgent, "Convert 100 USD to EUR.", ["92"]);
}

@test:Config {}
function testHelpfulness() returns error? {
    check eval:evaluateHelpfulness(financeAgent, "Convert 100 USD to EUR.",
            judgeModel = model, judgeScoreThreshold = 0.7);
}
```

Run the evaluations with `bal test`. Use a low temperature for the judge model so that scores stay stable across runs. To evaluate against a recorded evaluation set, use a data provider that loads the threads.

```ballerina
isolated function loadEvalSet() returns map<[ai:ConversationThread]>|error {
    return ai:loadConversationThreads("tests/resources/evalsets/finance.evalset.json");
}

@test:Config {dataProvider: loadEvalSet}
function testToolTrajectory(ai:ConversationThread thread) returns error? {
    check eval:evaluateToolTrajectory(financeAgent, thread, matchMode = eval:STRICT);
}
```

See the [Agent evaluation](/learn/by-example/ai-agent-evaluation/) example.

## Learn more

- [Build an AI agent](/learn/build-an-ai-agent/)
- [Test Ballerina code](/learn/test-ballerina-code/write-tests/)
- [`ballerina/ai.eval` module](https://central.ballerina.io/ballerina/ai.eval/latest)
- [`ballerinax/amp` module](https://central.ballerina.io/ballerinax/amp/latest)
- [`ballerinax/jaeger` module](https://central.ballerina.io/ballerinax/jaeger/latest)
- [Publish agent traces to Jaeger](/learn/by-example/ai-agent-tracing-jaeger/) example
