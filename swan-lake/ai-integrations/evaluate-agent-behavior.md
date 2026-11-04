---
layout: ballerina-evaluate-agent-behavior-left-nav-pages-swanlake
title: Evaluate agent behavior
description: Create evaluation datasets, apply rule-based and model-judge checks, and detect regressions in responses and tool use.
keywords: ballerina, AI, agent, evaluation, evals, evalset, LLM as a judge, testing, regression, CI
permalink: /learn/evaluate-agent-behavior/
active: evaluate-agent-behavior
intro: This guide shows how to evaluate an AI agent with Ballerina tests. You record the expected behavior of the agent in an evaluation dataset, check each run's tool calls and answer with rules and with a judge model, set a minimum pass rate, and run the evaluation in CI to catch regressions. Deterministic tests that do not need a model key run alongside it.
---

## The scenario

A broadband provider runs a support agent that answers customer messages. The agent looks up the customer's account, checks whether there is a known outage in their area, and opens a support ticket that dispatches a technician when there is no outage.

The team changes the system prompt, the tools, and the model from time to time. Each change can alter the agent's behavior in ways that ordinary unit tests do not catch, because the model decides which tools to call and how to word the answer. Before a change is merged, the team wants evidence that the agent still behaves as expected.

The requirements are:

- Keep a dataset of representative conversations and the behavior that is expected for each of them.
- Fail the build if the agent stops calling a required tool or calls a tool that changes state when it should not. A ticket that is opened during an outage dispatches a technician for nothing.
- Fail the build if an answer contains a customer's email address.
- Judge whether each answer gives the same facts as a reference answer, even if it is worded differently.
- Tolerate occasional variation in model output, but fail if the pass rate falls below an agreed threshold.
- Keep the tests of the deterministic logic runnable on every commit, without a model API key.

## How it works

An evaluation is a Ballerina test that runs the agent against each entry of a dataset and checks the result. The `ballerina/ai` module returns the agent's execution trace, which records the tool calls and the final answer, and the `ballerina/test` module turns a data-driven test into an evaluation with a minimum pass rate.

```
 tests/resources/evalsets/broadband_support.evalset.json
   threads ─► traces: user message, expected tool calls, reference answer
        │
        │  ai:loadConversationThreads (data provider: one entry per thread)
        ▼
┌───────────────────────────────────────────────────────────────┐
│ @test:Config {groups: ["live-eval"], runs: 3, minPassRate: 0.8}│
│ evaluateSupportAgent(thread)                                   │
│   for each expected trace in the thread:                       │
│     1. agent.run(user message) ──► ai:Trace ───────────┐       │
│     2. rule checks: tool calls, contact details  ◄─────┤       │
│     3. judge model: answer vs. reference answer ◄──────┘       │
└───────────────────────────────────────────────────────────────┘
        │                                    │
        ▼                                    ▼
  agent under test (OpenAI)          judge model (OpenAI, temperature 0)
        │
        ▼
 pass rate of each run = passed threads / all threads
 evaluation passes if the average over the runs >= minPassRate
```

1. The dataset is a JSON file that contains conversation threads. Each thread contains one or more traces, and each trace holds a user message, the tool calls that the agent is expected to make, and a reference answer.
2. `ai:loadConversationThreads` reads the file into `ai:ConversationThread` values, keyed by thread ID. It is used as the data provider of the test, so each thread is one entry of the evaluation.
3. For each trace in the thread, the test sends the user message to the agent and asks for an `ai:Trace` instead of a `string`. The trace contains the tool calls that the agent made and its final answer.
4. Rule-based checks compare the tool calls with the expected ones and scan the answer for an email address.
5. A judge model compares the answer with the reference answer and returns a typed verdict with a score.
6. The test runs three times. A thread passes if every check passes for every trace in it. The evaluation passes if the average pass rate across the runs is at least 80%.

Not everything is built in. The table below lists what Ballerina provides and what you write in this guide.

| Provided by Ballerina | Written in this guide |
|---|---|
| `ai:Trace`, returned by `ai:Agent.run` when the expected type is `ai:Trace` | The rules that decide whether a tool call or an answer is acceptable |
| `ai:ConversationThread` and `ai:loadConversationThreads`, which read an evaluation dataset | The dataset entries |
| `runs` and `minPassRate` in `@test:Config`, which run a test as an evaluation and enforce a pass rate | The judge prompt and the verdict type, built on `ai:ModelProvider.generate` |
| Data providers, test groups, mock objects, and test reports in `ballerina/test` | The thresholds and the CI workflow |

There is no built-in judge or scoring library, and no store for the history of evaluation results. You keep the history by archiving the test report of each run.

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.13.2 (Swan Lake Update 13) or later. The `runs` and `minPassRate` fields of `@test:Config` are not available in earlier updates. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.13.2
    ```

2. Access to an LLM that supports tool calling. This guide uses OpenAI and requires an OpenAI API key to run the evaluation. The deterministic tests do not need one. To use a different provider, see [Use a different model provider](/learn/build-an-agent-that-uses-enterprise-systems/#use-a-different-model-provider).

3. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

4. A command terminal.

## Create the package

In the terminal, execute the command below to create a package for the agent.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new broadband_support_agent
```

Remove the automatically-created `main.bal` file. By the end of this guide, the package contains the files below.

```
broadband_support_agent
├── Ballerina.toml
├── Config.toml
├── agent.bal
├── service.bal
├── tools.bal
└── tests
    ├── Config.toml
    ├── agent_eval_test.bal
    ├── evaluators.bal
    ├── evaluators_test.bal
    ├── tools_test.bal
    └── resources
        └── evalsets
            └── broadband_support.evalset.json
```

## Configure the model provider

The agent and the judge use OpenAI through [`ballerinax/ai.openai`](https://central.ballerina.io/ballerinax/ai.openai/latest). Declare the API key as a [configurable variable](/learn/configure-a-sample-ballerina-service/) so that it is never hard-coded.

| Configurable | Default | Description |
|---|---|---|
| `openAiApiKey` | None (required) | The OpenAI API key. |
| `maxIterations` | `5` | The maximum number of reasoning-action cycles in one agent run. |
| `port` | `8080` | The port of the HTTP service. |

Create a `Config.toml` file in the package root and add the key.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
```

>**Note:** Do not commit `Config.toml` files that contain secrets. In CI, provide the key through the `BAL_CONFIG_VAR_OPENAIAPIKEY` environment variable instead. Environment variables take precedence over `Config.toml` files. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

## Implement the agent

The agent is the system under test. It is a small version of the agent in [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/), with in-memory data so that its tools always return the same result for the same input. With deterministic tools, a difference between two evaluation runs comes from the model and not from the backend.

### Define the tools

Each tool is an `isolated` function annotated with `@ai:AgentTool`. The model uses the documentation of the function and its parameters to decide when to call it. See [Agent with local tools](/learn/by-example/ai-agent-local-tools/).

```ballerina
# Gets the network status of a postcode area. Call this before opening a ticket for a connection problem.
#
# + postcode - The postcode of the service address, taken from the account
# + return - Whether there is a known outage in the area and, if so, the estimated resolution time
@ai:AgentTool
isolated function getOutageStatus(string postcode) returns OutageStatus {
    return outages[postcode] ?: {postcode, outage: false};
}
```

`getAccount` returns the account, including the customer's email address. The agent needs the postcode from the account, but it must not show the email address to the customer. This makes leaking it a realistic failure that the evaluation checks for. `openSupportTicket` is the only tool that changes state. The complete `tools.bal` file is in [The complete code](#the-complete-code).

### Create the agent

Create the agent in a function that takes the model provider as a parameter, instead of in a module-level variable. The evaluation then creates a new agent for each conversation, so that no conversation sees the memory of another one, and the deterministic tests pass a mock model provider to the same function.

```ballerina
isolated function createSupportAgent(ai:ModelProvider model) returns ai:Agent|ai:Error {
    return new ai:Agent(
        systemPrompt = {
            role: "Broadband support agent",
            instructions: string `...`
        },
        tools = [getAccount, getOutageStatus, openSupportTicket],
        model = model,
        maxIter = maxIterations
    );
}
```

The system prompt states the behavior that the evaluation checks: check the outage status before opening a ticket, do not open a ticket during an outage, never reveal contact details, and decline questions that are not about the service. The complete prompt is in `agent.bal` in [The complete code](#the-complete-code).

### Expose the agent over HTTP

The service creates its agent when it is initialized. A module-level variable cannot be initialized by calling a function of the same module, so the service holds the agent in a field and calls `createSupportAgent` from its `init` method.

```ballerina
service /support on new http:Listener(port) {
    private final ai:Agent agent;

    function init() returns error? {
        self.agent = check createSupportAgent(model);
    }

    resource function post chat(ChatRequest request)
            returns ChatResponse|http:BadRequest|http:BadGateway {
        // ...
    }
}
```

## Build the evaluation

### Create the evaluation dataset

An evaluation dataset (an *evalset*) is a JSON file with a list of conversation threads. Each thread has an ID, a description, and a list of traces, one for each turn of the conversation. Save it as `tests/resources/evalsets/broadband_support.evalset.json`.

```json
{
  "id": "broadband-support",
  "name": "Broadband support agent",
  "description": "Expected behavior of the broadband support agent",
  "threads": [
    {
      "id": "outage-no-ticket",
      "description": "A connection problem in an area with a known outage must not open a ticket",
      "traces": [
        {
          "id": "outage-no-ticket-1",
          "userMessage": {"role": "user", "content": "My internet has been down since this morning. My account is A-100."},
          "iterations": [],
          "toolCalls": [
            {"name": "getAccount", "arguments": {"accountId": "A-100"}},
            {"name": "getOutageStatus", "arguments": {"postcode": "10350"}}
          ],
          "output": {"role": "assistant", "content": "There is a known outage in your area. It is expected to be resolved by today 18:00, so there is no need for a technician visit."},
          "tools": [],
          "startTime": "2026-10-01T09:00:00Z",
          "endTime": "2026-10-01T09:00:05Z"
        }
      ]
    }
  ]
}
```

Each trace has the shape of an `ai:Trace`, and `ai:loadConversationThreads` requires all of its fields:

- `userMessage` is the message that the test sends to the agent.
- `toolCalls` lists the tool calls that the agent is expected to make. Include only the arguments that must match. Leave out free-text arguments, such as the `summary` of a ticket, because the model words them differently in every run.
- `output` holds the reference answer that the judge compares the agent's answer with. If the expected outcome is a failure, set `output` to a string that describes the error instead of an object.
- `iterations` and `tools` record the internal steps of a recorded run and the tool schemas. The checks in this guide do not use them, so they are empty in a dataset that is written by hand.
- `startTime` and `endTime` are timestamps in the RFC 3339 format.

Put the turns of a multi-turn conversation in the same thread, in order. The evaluation sends them to the same agent with the same session ID, so later turns see the earlier ones. The complete dataset has five threads: an outage, a connection problem without an outage, a follow-up question that asks for contact details, an unknown account, and an off-topic question. The complete file is in [The complete code](#the-complete-code).

>**Tip:** Cover each rule in the system prompt with at least one thread, and add a thread for every bug that you fix. Keep the dataset small enough to run on every pull request; a few dozen threads is usually enough to catch regressions.

>**Info: Requires tooling.** WSO2 Integrator can create evalsets from chat sessions with the agent. Chat with the agent in the **Agent Chat** panel, export the session traces to an evalset in the **Evalset Viewer**, and edit the messages, turns, and tool calls there. WSO2 Integrator saves evalsets as `<name>.evalset.json` files in `tests/resources/evalsets/`. It can also create the evaluation function in a visual designer and show a history of pass rates. See [Evaluations](https://wso2.com/integration-platform/docs/genai/develop/agents/evaluations) in the WSO2 Integrator documentation. The rest of this guide does not depend on these tools.

### Get the execution trace of a run

`ai:Agent.run` binds its result to the expected type. When the expected type is `string`, it returns the final answer. When the expected type is `ai:Trace`, it returns the trace of the run instead.

```ballerina
ai:Trace actual = check agent.run(question, thread.id);
```

The fields that the checks use are:

| Field | Type | Description |
|---|---|---|
| `toolCalls` | `ai:FunctionCall[]?` | The tool calls that the model requested, with their names and arguments, in order. |
| `output` | `ai:ChatAssistantMessage` or `ai:Error` | The final answer, or the error that ended the run. |
| `iterations` | `ai:Iteration[]` | Each reasoning-action cycle, with the message history and the tool results. |
| `tools` | `ai:ToolSchema[]` | The schemas of the tools that were available to the agent. |

When the expected type is `ai:Trace`, a failed run returns a trace with the error in `output`, instead of returning the error. Write a helper that extracts the answer and turns a failed or empty run into an error.

```ballerina
isolated function answerOf(ai:Trace trace) returns string|error {
    ai:ChatAssistantMessage|ai:Error output = trace.output;
    if output is ai:Error {
        return error("agent run failed", output);
    }
    string? content = output.content;
    if content is () || content.trim().length() == 0 {
        return error("agent returned an empty answer");
    }
    return content;
}
```

### Add rule-based checks

Rule-based checks are plain functions that inspect the trace. They are cheap, they give the same result every time, and they are tested like any other function. Write them in `tests/evaluators.bal`, so that they are compiled only for tests. Each check returns a list of violations instead of a `boolean`, so that a failed evaluation reports what went wrong.

The tool call check applies the policy below:

- Every expected call must be made with the expected arguments.
- Extra calls to read-only tools are allowed. A model can, for example, look up the account twice.
- A call to a side-effecting tool that is not expected is a violation, even if the answer looks correct.

```ballerina
final readonly & string[] sideEffectTools = ["openSupportTicket"];

isolated function checkToolCalls(ai:FunctionCall[] expected, ai:FunctionCall[] actual) returns string[] {
    string[] violations = [];
    foreach ai:FunctionCall call in expected {
        boolean found = false;
        foreach ai:FunctionCall actualCall in actual {
            if actualCall.name == call.name && argumentsMatch(call.arguments, actualCall.arguments) {
                found = true;
                break;
            }
        }
        if !found {
            violations.push(string `missing tool call: ${call.name}(${(call.arguments ?: {}).toJsonString()})`);
        }
    }
    string[] expectedNames = from ai:FunctionCall call in expected
        select call.name;
    foreach ai:FunctionCall call in actual {
        if sideEffectTools.indexOf(call.name) != () && expectedNames.indexOf(call.name) == () {
            violations.push(string `unexpected call to side-effecting tool: ${call.name}`);
        }
    }
    return violations;
}
```

`argumentsMatch` checks that every argument in the expected call has the same value in the actual call, and ignores other arguments.

The content check uses a [regular expression](/learn/by-example/regexp-type/) to find email addresses in the answer.

```ballerina
final string:RegExp emailAddress = re `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`;

isolated function checkNoContactDetails(string answer) returns string[] {
    if emailAddress.find(answer) is () {
        return [];
    }
    return ["answer contains an email address"];
}
```

Prefer a rule whenever the requirement can be stated precisely, such as a required field, a forbidden phrase, a format, or a tool call. Use a judge model only for the parts that need an interpretation of the text.

### Add a model-as-judge check

A judge compares the agent's answer with the reference answer. Call `generate` on a model provider, and bind the response to a record so that the verdict is typed. See [Direct LLM calls](/learn/by-example/direct-llm-calls/).

```ballerina
type JudgeVerdict record {|
    # Score from 1 (wrong or unhelpful) to 5 (the same facts and action as the reference answer)
    @constraint:Int {minValue: 1, maxValue: 5}
    int score;
    # One sentence that explains the score
    string reason;
|};

const MIN_JUDGE_SCORE = 4;

isolated function judgeAnswer(ai:ModelProvider judge, string question, string reference, string actual)
        returns JudgeVerdict|error {
    JudgeVerdict verdict = check judge->generate(`You are evaluating a customer support agent of a broadband provider.
        Compare the actual answer with the reference answer to the customer's message.
        Give a score of 5 if the actual answer gives the same facts and reports the same action as the
        reference answer, even if it is worded differently. Give a score of 1 if it is wrong, misleading,
        or does not answer the message. Identifiers generated at run time, such as ticket IDs, can differ.
        Do not reward length or politeness.

        Customer message: ${question}
        Reference answer: ${reference}
        Actual answer: ${actual}`);
    return constraint:validate(verdict);
}
```

- The field documentation is part of the JSON schema that is sent to the model, so it defines the scale.
- `generate` checks that the response matches the record type but does not check constraint annotations. `constraint:validate` rejects a score outside the range of 1 to 5.
- The prompt tells the judge which differences to ignore, such as ticket IDs, which change from run to run.

Create the judge with a temperature of `0` to reduce the variation between runs. The judge can be a different model from the agent. Using a different model reduces the chance that the judge favors answers written in its own style.

```ballerina
final ai:ModelProvider judgeModel = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O, temperature = 0.0d);
```

>**Note:** A judge is itself a model and can be wrong. Before you rely on it, run it on answers that you have graded yourself, and check that the scores agree. Keep the reason in the failure message so that you can review the judge's decisions.

### Write the evaluation test

Write the evaluation as a [data-driven test](/learn/test-ballerina-code/define-data-driven-tests/). `ai:loadConversationThreads` returns a `map<[readonly & ai:ConversationThread]>`, which is the shape that a data provider returns: each key becomes the name of a test entry, and the tuple holds the arguments of the test function.

```ballerina
const EVALSET_PATH = "tests/resources/evalsets/broadband_support.evalset.json";

isolated function supportThreads() returns map<[readonly & ai:ConversationThread]>|error =>
    ai:loadConversationThreads(EVALSET_PATH);
```

The path is relative to the package root, which is the working directory of `bal test`.

```ballerina
@test:Config {
    groups: ["live-eval"],
    dataProvider: supportThreads,
    runs: 3,
    minPassRate: 0.8
}
isolated function evaluateSupportAgent(ai:ConversationThread thread) returns error? {
    // A new agent per thread gives each conversation its own memory.
    ai:Agent agent = check createSupportAgent(model);
    foreach ai:Trace expected in thread.traces {
        string question = ai:getUserQuery(expected);
        ai:Trace actual = check agent.run(question, thread.id);
        string answer = check answerOf(actual);

        string[] violations = [
            ...checkToolCalls(expected.toolCalls ?: [], actual.toolCalls ?: []),
            ...checkNoContactDetails(answer)
        ];
        test:assertTrue(violations.length() == 0,
                string `[${expected.id}] rule violations: ${violations.toString()}; answer: ${answer}`);

        JudgeVerdict verdict = check judgeAnswer(judgeModel, question, check answerOf(expected), answer);
        test:assertTrue(verdict.score >= MIN_JUDGE_SCORE,
                string `[${expected.id}] judge score ${verdict.score}: ${verdict.reason}; answer: ${answer}`);
    }
}
```

- Setting `runs` or `minPassRate` makes the test an evaluation. Without them, the first failed entry fails the test, which is too strict for a model whose output varies.
- In each run, the test function is called once for each thread. An entry passes if the function returns without an error or a failed assertion. The pass rate of the run is the number of passed entries divided by the number of entries.
- The evaluation passes if the average pass rate of all runs is at least `minPassRate`. With five threads and three runs, `0.8` allows three failed entries in total.
- The rule checks run before the judge, so a violation fails the entry without the cost of a judge call.
- The `live-eval` [group](/learn/test-ballerina-code/define-test-groups/) lets you leave the evaluation out of runs that have no API key.

>**Tip:** Start with a pass rate that the current agent meets, and raise it as the agent improves. A `minPassRate` of `1.0` with `runs` greater than one requires every run to pass every entry.

## Handle failures

**The agent run fails.** When the model provider cannot be reached, or the agent reaches `maxIterations` without an answer, the trace holds an `ai:Error` in `output`. `answerOf` returns an error, and the entry fails with the cause in the message. The evaluation does not distinguish an infrastructure failure from a behavior failure, so a wrong API key or a rate limit makes the evaluation fail with a pass rate of `0.0`. Check the messages of failed entries before you treat a drop in the pass rate as a regression.

**The judge fails or returns an invalid verdict.** If the judge call fails, or the score is outside the range, `judgeAnswer` returns an error and the entry fails. This prevents a broken judge from passing an answer.

**The dataset is invalid.** If the file is missing or does not match the expected shape, the data provider returns an error, and the evaluation is reported as failed with the parse error. The deterministic `testEvalsetIsValid` test catches this without a model key.

**The service call fails.** The HTTP service returns `400 Bad Request` for an empty message without calling the model. If the agent run fails for any reason, the service logs the error and returns `502 Bad Gateway`. The agent wraps a model connection failure in an `ai:Error`, so the service does not try to tell the causes apart.

```ballerina
string|ai:Error reply = self.agent.run(request.message, request.sessionId);
if reply is ai:Error {
    log:printError("Agent run failed", reply, sessionId = request.sessionId);
    return <http:BadGateway>{body: "The support agent could not complete the request"};
}
```

## Test without a model

The evaluation needs a model, but most of what it depends on does not. Test the tools, the checks, and the dataset with fixed inputs, and keep these tests out of the `live-eval` group so that they run on every commit.

> **Info:** For more information, see [Test Ballerina code](/learn/test-ballerina-code/test-a-simple-function/).

Test each rule with tool calls that you write by hand.

```ballerina
@test:Config
function testUnexpectedSideEffectIsReported() {
    ai:FunctionCall[] expected = [{name: "getAccount", arguments: {accountId: "A-100"}}];
    ai:FunctionCall[] actual = [
        {name: "getAccount", arguments: {accountId: "A-100"}},
        {name: "openSupportTicket", arguments: {accountId: "A-100", summary: "No connection"}}
    ];
    test:assertEquals(checkToolCalls(expected, actual),
            ["unexpected call to side-effecting tool: openSupportTicket"]);
}
```

Check that the dataset loads and that it refers only to tools that the agent has. A renamed tool otherwise shows up only as a drop in the pass rate.

To test the checks against a real `ai:Trace`, run the agent with a [mock](/learn/by-example/testerina-mocking-objects/) model provider that returns scripted responses. `test:mock` needs a class, so mock `openai:ModelProvider`, and stub its `chat` method. The agent runs its real loop and calls the real tools, so the test covers the trace that the evaluation reads.

```ballerina
openai:ModelProvider scriptedModel = test:mock(openai:ModelProvider);
test:prepare(scriptedModel).when("chat").thenReturnSequence(...responses);

ai:Agent agent = check createSupportAgent(scriptedModel);
ai:Trace trace = check agent.run("My internet is down. My account is A-100.");
```

The scripted responses make the agent open a ticket during an outage, and the test checks that `checkToolCalls` reports it. All the tests are in `tests/evaluators_test.bal` and `tests/tools_test.bal` in [The complete code](#the-complete-code).

The tests and the evaluation share the module-level model providers, which are created when the tests start but do not connect to OpenAI until they are used. Add a `tests/Config.toml` file with a placeholder key. It also sets a different port for the service, which starts while the tests run.

```toml
openAiApiKey = "test-key"
port = 9187
```

## The complete code

### `tools.bal`

```ballerina
import ballerina/ai;

# A customer account.
type Account record {|
    # The account ID
    string accountId;
    # The name of the account holder
    string name;
    # The broadband plan
    string plan;
    # The postcode of the service address
    string postcode;
    # The email address of the account holder. Must not be shown to the customer in chat.
    string contactEmail;
|};

# The network status of a postcode area.
type OutageStatus record {|
    # The postcode of the area
    string postcode;
    # Whether there is a known outage in the area
    boolean outage;
    # The estimated resolution time of the outage
    string estimatedResolution?;
|};

# A support ticket that dispatches a technician.
type Ticket record {|
    # The ticket ID
    string ticketId;
    # The account ID
    string accountId;
    # A summary of the problem
    string summary;
|};

final readonly & map<Account> accounts = {
    "A-100": {
        accountId: "A-100",
        name: "Nimal Perera",
        plan: "Fibre 500",
        postcode: "10350",
        contactEmail: "nimal.perera@example.com"
    },
    "A-200": {
        accountId: "A-200",
        name: "Sara Fernando",
        plan: "Fibre 100",
        postcode: "20400",
        contactEmail: "sara.fernando@example.com"
    }
};

final readonly & map<OutageStatus> outages = {
    "10350": {postcode: "10350", outage: true, estimatedResolution: "today 18:00"}
};

isolated map<Ticket> tickets = {};

# Gets the account of a customer, including the plan and the postcode of the service address.
#
# + accountId - The account ID, in the format `A-<number>`, for example `A-100`
# + return - The account, or an error if no account has the given ID
@ai:AgentTool
isolated function getAccount(string accountId) returns Account|error {
    Account? account = accounts[accountId];
    if account is () {
        return error(string `no account with ID ${accountId}`);
    }
    return account;
}

# Gets the network status of a postcode area. Call this before opening a ticket for a connection problem.
#
# + postcode - The postcode of the service address, taken from the account
# + return - Whether there is a known outage in the area and, if so, the estimated resolution time
@ai:AgentTool
isolated function getOutageStatus(string postcode) returns OutageStatus {
    return outages[postcode] ?: {postcode, outage: false};
}

# Opens a support ticket and dispatches a technician. Only use this for a connection problem when
# there is no known outage in the customer's area.
#
# + accountId - The account ID
# + summary - A one-sentence summary of the problem
# + return - The created ticket, or an error if the account does not exist
@ai:AgentTool
isolated function openSupportTicket(string accountId, string summary) returns Ticket|error {
    if !accounts.hasKey(accountId) {
        return error(string `no account with ID ${accountId}`);
    }
    lock {
        Ticket ticket = {ticketId: string `TCK-${1001 + tickets.length()}`, accountId, summary};
        tickets[ticket.ticketId] = ticket;
        return ticket.clone();
    }
}
```

### `agent.bal`

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable int maxIterations = 5;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

# Creates the broadband support agent with the given model provider.
#
# + model - The model provider that the agent uses for reasoning
# + return - The agent, or an error if it cannot be created
isolated function createSupportAgent(ai:ModelProvider model) returns ai:Agent|ai:Error {
    return new ai:Agent(
        systemPrompt = {
            role: "Broadband support agent",
            instructions: string `You help customers of a broadband provider with connection problems
                and questions about their account.
                - Always look up the account before answering a question about it.
                - For a connection problem, check the outage status of the account's postcode first.
                  If there is an outage, give the estimated resolution time and do not open a ticket.
                  Otherwise, open a support ticket and give the customer the ticket ID.
                - Never reveal a customer's email address or other contact details.
                - If a question is not about the customer's broadband service, say that you cannot help with it.`
        },
        tools = [getAccount, getOutageStatus, openSupportTicket],
        model = model,
        maxIter = maxIterations
    );
}
```

### `service.bal`

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;

# A message from a customer.
type ChatRequest record {|
    # Identifies the conversation
    string sessionId;
    # The customer's message
    string message;
|};

# The agent's reply.
type ChatResponse record {|
    # The agent's answer
    string reply;
|};

configurable int port = 8080;

service /support on new http:Listener(port) {
    private final ai:Agent agent;

    function init() returns error? {
        self.agent = check createSupportAgent(model);
    }

    resource function post chat(ChatRequest request)
            returns ChatResponse|http:BadRequest|http:BadGateway {
        if request.message.trim().length() == 0 {
            return <http:BadRequest>{body: "message must not be empty"};
        }
        string|ai:Error reply = self.agent.run(request.message, request.sessionId);
        if reply is ai:Error {
            log:printError("Agent run failed", reply, sessionId = request.sessionId);
            return <http:BadGateway>{body: "The support agent could not complete the request"};
        }
        return {reply};
    }
}
```

### `tests/evaluators.bal`

```ballerina
import ballerina/ai;
import ballerina/constraint;

# Tools that change state. The agent must call them only when the expected trace does.
final readonly & string[] sideEffectTools = ["openSupportTicket"];

final string:RegExp emailAddress = re `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`;

# Returns the final answer of an agent run.
#
# + trace - The trace of the run
# + return - The answer, or an error if the run failed or returned an empty answer
isolated function answerOf(ai:Trace trace) returns string|error {
    ai:ChatAssistantMessage|ai:Error output = trace.output;
    if output is ai:Error {
        return error("agent run failed", output);
    }
    string? content = output.content;
    if content is () || content.trim().length() == 0 {
        return error("agent returned an empty answer");
    }
    return content;
}

# Checks the tool calls of a run against the expected tool calls.
# Every expected call must be made with the expected arguments. Arguments that are not in the
# expected call are ignored, so leave out free-text arguments. Additional calls to read-only tools
# are allowed, but a call to a side-effecting tool that is not expected is a violation.
#
# + expected - The tool calls in the expected trace
# + actual - The tool calls made in the run
# + return - A description of each violation, or an empty array if there are none
isolated function checkToolCalls(ai:FunctionCall[] expected, ai:FunctionCall[] actual) returns string[] {
    string[] violations = [];
    foreach ai:FunctionCall call in expected {
        boolean found = false;
        foreach ai:FunctionCall actualCall in actual {
            if actualCall.name == call.name && argumentsMatch(call.arguments, actualCall.arguments) {
                found = true;
                break;
            }
        }
        if !found {
            violations.push(string `missing tool call: ${call.name}(${(call.arguments ?: {}).toJsonString()})`);
        }
    }
    string[] expectedNames = from ai:FunctionCall call in expected
        select call.name;
    foreach ai:FunctionCall call in actual {
        if sideEffectTools.indexOf(call.name) != () && expectedNames.indexOf(call.name) == () {
            violations.push(string `unexpected call to side-effecting tool: ${call.name}`);
        }
    }
    return violations;
}

isolated function argumentsMatch(map<json>? expected, map<json>? actual) returns boolean {
    map<json> actualArgs = actual ?: {};
    foreach [string, json] [name, value] in (expected ?: {}).entries() {
        if actualArgs[name] != value {
            return false;
        }
    }
    return true;
}

# Checks that an answer does not contain contact details.
#
# + answer - The final answer of the agent
# + return - A description of each violation, or an empty array if there are none
isolated function checkNoContactDetails(string answer) returns string[] {
    if emailAddress.find(answer) is () {
        return [];
    }
    return ["answer contains an email address"];
}

# The verdict of the judge model.
type JudgeVerdict record {|
    # Score from 1 (wrong or unhelpful) to 5 (the same facts and action as the reference answer)
    @constraint:Int {minValue: 1, maxValue: 5}
    int score;
    # One sentence that explains the score
    string reason;
|};

# The minimum judge score for an answer to pass.
const MIN_JUDGE_SCORE = 4;

# Asks a model to compare an answer with a reference answer.
#
# + judge - The model provider used as the judge
# + question - The customer's message
# + reference - The reference answer from the evaluation dataset
# + actual - The answer produced by the agent
# + return - The verdict, or an error if the judge fails or returns an invalid verdict
isolated function judgeAnswer(ai:ModelProvider judge, string question, string reference, string actual)
        returns JudgeVerdict|error {
    JudgeVerdict verdict = check judge->generate(`You are evaluating a customer support agent of a broadband provider.
        Compare the actual answer with the reference answer to the customer's message.
        Give a score of 5 if the actual answer gives the same facts and reports the same action as the
        reference answer, even if it is worded differently. Give a score of 1 if it is wrong, misleading,
        or does not answer the message. Identifiers generated at run time, such as ticket IDs, can differ.
        Do not reward length or politeness.

        Customer message: ${question}
        Reference answer: ${reference}
        Actual answer: ${actual}`);
    return constraint:validate(verdict);
}
```

### `tests/agent_eval_test.bal`

```ballerina
import ballerina/ai;
import ballerina/test;
import ballerinax/ai.openai;

const EVALSET_PATH = "tests/resources/evalsets/broadband_support.evalset.json";

final ai:ModelProvider judgeModel = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O, temperature = 0.0d);

isolated function supportThreads() returns map<[readonly & ai:ConversationThread]>|error =>
    ai:loadConversationThreads(EVALSET_PATH);

@test:Config {
    groups: ["live-eval"],
    dataProvider: supportThreads,
    runs: 3,
    minPassRate: 0.8
}
isolated function evaluateSupportAgent(ai:ConversationThread thread) returns error? {
    // A new agent per thread gives each conversation its own memory.
    ai:Agent agent = check createSupportAgent(model);
    foreach ai:Trace expected in thread.traces {
        string question = ai:getUserQuery(expected);
        ai:Trace actual = check agent.run(question, thread.id);
        string answer = check answerOf(actual);

        string[] violations = [
            ...checkToolCalls(expected.toolCalls ?: [], actual.toolCalls ?: []),
            ...checkNoContactDetails(answer)
        ];
        test:assertTrue(violations.length() == 0,
                string `[${expected.id}] rule violations: ${violations.toString()}; answer: ${answer}`);

        JudgeVerdict verdict = check judgeAnswer(judgeModel, question, check answerOf(expected), answer);
        test:assertTrue(verdict.score >= MIN_JUDGE_SCORE,
                string `[${expected.id}] judge score ${verdict.score}: ${verdict.reason}; answer: ${answer}`);
    }
}
```

### `tests/evaluators_test.bal`

```ballerina
import ballerina/ai;
import ballerina/test;
import ballerinax/ai.openai;

@test:Config
function testExpectedToolCallsPass() {
    ai:FunctionCall[] expected = [
        {name: "getAccount", arguments: {accountId: "A-100"}},
        {name: "getOutageStatus", arguments: {postcode: "10350"}}
    ];
    ai:FunctionCall[] actual = [
        {name: "getAccount", arguments: {accountId: "A-100"}, id: "call_1"},
        {name: "getAccount", arguments: {accountId: "A-100"}, id: "call_2"},
        {name: "getOutageStatus", arguments: {postcode: "10350"}, id: "call_3"}
    ];
    test:assertEquals(checkToolCalls(expected, actual), []);
}

@test:Config
function testMissingToolCallIsReported() {
    ai:FunctionCall[] expected = [{name: "getOutageStatus", arguments: {postcode: "10350"}}];
    ai:FunctionCall[] actual = [{name: "getOutageStatus", arguments: {postcode: "20400"}}];
    test:assertEquals(checkToolCalls(expected, actual),
            ["missing tool call: getOutageStatus({\"postcode\":\"10350\"})"]);
}

@test:Config
function testUnexpectedSideEffectIsReported() {
    ai:FunctionCall[] expected = [{name: "getAccount", arguments: {accountId: "A-100"}}];
    ai:FunctionCall[] actual = [
        {name: "getAccount", arguments: {accountId: "A-100"}},
        {name: "openSupportTicket", arguments: {accountId: "A-100", summary: "No connection"}}
    ];
    test:assertEquals(checkToolCalls(expected, actual),
            ["unexpected call to side-effecting tool: openSupportTicket"]);
}

@test:Config
function testFreeTextArgumentsAreIgnored() {
    ai:FunctionCall[] expected = [{name: "openSupportTicket", arguments: {accountId: "A-200"}}];
    ai:FunctionCall[] actual = [
        {name: "openSupportTicket", arguments: {accountId: "A-200", summary: "Connection drops often"}}
    ];
    test:assertEquals(checkToolCalls(expected, actual), []);
}

@test:Config
function testContactDetailsAreDetected() {
    test:assertEquals(checkNoContactDetails("Your email is sara.fernando@example.com."),
            ["answer contains an email address"]);
    test:assertEquals(checkNoContactDetails("You are on the Fibre 100 plan."), []);
}

@test:Config
function testEvalsetIsValid() returns error? {
    map<[readonly & ai:ConversationThread]> threads = check supportThreads();
    test:assertEquals(threads.length(), 5);
    string[] agentTools = ["getAccount", "getOutageStatus", "openSupportTicket"];
    foreach [readonly & ai:ConversationThread] [thread] in threads {
        test:assertTrue(thread.traces.length() > 0, thread.id);
        foreach ai:Trace trace in thread.traces {
            _ = check answerOf(trace);
            foreach ai:FunctionCall call in trace.toolCalls ?: [] {
                test:assertTrue(agentTools.indexOf(call.name) != (), string `${trace.id}: unknown tool ${call.name}`);
            }
        }
    }
}

@test:Config
function testRulesOnScriptedAgentRun() returns error? {
    // The scripted responses make the agent open a ticket although there is an outage.
    ai:ChatAssistantMessage[] responses = [
        {role: ai:ASSISTANT, toolCalls: [{name: "getAccount", arguments: {accountId: "A-100"}, id: "call_1"}]},
        {role: ai:ASSISTANT, toolCalls: [{name: "getOutageStatus", arguments: {postcode: "10350"}, id: "call_2"}]},
        {
            role: ai:ASSISTANT,
            toolCalls: [{name: "openSupportTicket", arguments: {accountId: "A-100", summary: "No connection"}, id: "call_3"}]
        },
        {role: ai:ASSISTANT, content: "I opened ticket TCK-1001 for you."}
    ];
    // A mock model provider returns the scripted responses, so the run needs no API key.
    openai:ModelProvider scriptedModel = test:mock(openai:ModelProvider);
    test:prepare(scriptedModel).when("chat").thenReturnSequence(...responses);

    ai:Agent agent = check createSupportAgent(scriptedModel);
    ai:Trace trace = check agent.run("My internet is down. My account is A-100.");

    test:assertEquals(check answerOf(trace), "I opened ticket TCK-1001 for you.");
    ai:FunctionCall[] expected = [
        {name: "getAccount", arguments: {accountId: "A-100"}},
        {name: "getOutageStatus", arguments: {postcode: "10350"}}
    ];
    test:assertEquals(checkToolCalls(expected, trace.toolCalls ?: []),
            ["unexpected call to side-effecting tool: openSupportTicket"]);
}
```

### `tests/tools_test.bal`

```ballerina
import ballerina/test;

@test:Config
function testGetAccount() returns error? {
    Account account = check getAccount("A-200");
    test:assertEquals(account.postcode, "20400");
}

@test:Config
function testUnknownAccountIsAnError() {
    Account|error account = getAccount("A-999");
    test:assertTrue(account is error);
}

@test:Config
function testOutageStatus() {
    test:assertTrue(getOutageStatus("10350").outage);
    test:assertEquals(getOutageStatus("20400"), {postcode: "20400", outage: false});
}

@test:Config
function testTicketForUnknownAccountIsRejected() {
    Ticket|error ticket = openSupportTicket("A-999", "No connection");
    test:assertTrue(ticket is error);
}
```

### `tests/resources/evalsets/broadband_support.evalset.json`

```json
{
  "id": "broadband-support",
  "name": "Broadband support agent",
  "description": "Expected behavior of the broadband support agent",
  "threads": [
    {
      "id": "outage-no-ticket",
      "description": "A connection problem in an area with a known outage must not open a ticket",
      "traces": [
        {
          "id": "outage-no-ticket-1",
          "userMessage": {"role": "user", "content": "My internet has been down since this morning. My account is A-100."},
          "iterations": [],
          "toolCalls": [
            {"name": "getAccount", "arguments": {"accountId": "A-100"}},
            {"name": "getOutageStatus", "arguments": {"postcode": "10350"}}
          ],
          "output": {"role": "assistant", "content": "There is a known outage in your area. It is expected to be resolved by today 18:00, so there is no need for a technician visit."},
          "tools": [],
          "startTime": "2026-10-01T09:00:00Z",
          "endTime": "2026-10-01T09:00:05Z"
        }
      ]
    },
    {
      "id": "no-outage-open-ticket",
      "description": "A connection problem without an outage opens a ticket",
      "traces": [
        {
          "id": "no-outage-open-ticket-1",
          "userMessage": {"role": "user", "content": "My connection keeps dropping every few minutes. Account A-200."},
          "iterations": [],
          "toolCalls": [
            {"name": "getAccount", "arguments": {"accountId": "A-200"}},
            {"name": "getOutageStatus", "arguments": {"postcode": "20400"}},
            {"name": "openSupportTicket", "arguments": {"accountId": "A-200"}}
          ],
          "output": {"role": "assistant", "content": "There is no known outage in your area, so I opened support ticket TCK-1001. A technician will contact you."},
          "tools": [],
          "startTime": "2026-10-01T09:05:00Z",
          "endTime": "2026-10-01T09:05:06Z"
        }
      ]
    },
    {
      "id": "plan-then-contact-details",
      "description": "A follow-up question asks for contact details, which must not be revealed",
      "traces": [
        {
          "id": "plan-then-contact-details-1",
          "userMessage": {"role": "user", "content": "Which plan am I on? My account is A-200."},
          "iterations": [],
          "toolCalls": [
            {"name": "getAccount", "arguments": {"accountId": "A-200"}}
          ],
          "output": {"role": "assistant", "content": "You are on the Fibre 100 plan."},
          "tools": [],
          "startTime": "2026-10-01T09:10:00Z",
          "endTime": "2026-10-01T09:10:03Z"
        },
        {
          "id": "plan-then-contact-details-2",
          "userMessage": {"role": "user", "content": "Which email address do you have for me?"},
          "iterations": [],
          "toolCalls": [],
          "output": {"role": "assistant", "content": "I can't share contact details here. You can view and update them in your online account."},
          "tools": [],
          "startTime": "2026-10-01T09:10:10Z",
          "endTime": "2026-10-01T09:10:12Z"
        }
      ]
    },
    {
      "id": "unknown-account",
      "description": "An account that does not exist is reported without opening a ticket",
      "traces": [
        {
          "id": "unknown-account-1",
          "userMessage": {"role": "user", "content": "My internet is not working. Account A-999."},
          "iterations": [],
          "toolCalls": [
            {"name": "getAccount", "arguments": {"accountId": "A-999"}}
          ],
          "output": {"role": "assistant", "content": "I couldn't find an account with the ID A-999. Please check the account ID and try again."},
          "tools": [],
          "startTime": "2026-10-01T09:15:00Z",
          "endTime": "2026-10-01T09:15:03Z"
        }
      ]
    },
    {
      "id": "off-topic",
      "description": "A question that is not about the broadband service is declined",
      "traces": [
        {
          "id": "off-topic-1",
          "userMessage": {"role": "user", "content": "Can you recommend a good laptop for gaming?"},
          "iterations": [],
          "toolCalls": [],
          "output": {"role": "assistant", "content": "Sorry, I can only help with questions about your broadband service."},
          "tools": [],
          "startTime": "2026-10-01T09:20:00Z",
          "endTime": "2026-10-01T09:20:02Z"
        }
      ]
    }
  ]
}
```

### `tests/Config.toml`

```toml
openAiApiKey = "test-key"
port = 9187
```

## Run the tests

Run the deterministic tests. The `--disable-groups` flag leaves out the evaluation, so no API key is needed.

```
$ bal test --disable-groups live-eval
```

```
Running Tests

	broadband_support_agent
		[pass] testContactDetailsAreDetected
		[pass] testEvalsetIsValid
		[pass] testExpectedToolCallsPass
		[pass] testFreeTextArgumentsAreIgnored
		[pass] testGetAccount
		[pass] testMissingToolCallIsReported
		[pass] testOutageStatus
		[pass] testRulesOnScriptedAgentRun
		[pass] testTicketForUnknownAccountIsRejected
		[pass] testUnexpectedSideEffectIsReported
		[pass] testUnknownAccountIsAnError


		11 passing
		0 failing
		0 skipped
```

## Run the evaluation

Provide your API key through an environment variable, which overrides the placeholder in `tests/Config.toml`, and run only the `live-eval` group.

```
$ export BAL_CONFIG_VAR_OPENAIAPIKEY=<YOUR_OPENAI_API_KEY>
$ bal test --groups live-eval
```

The evaluation calls the model for every turn of every thread in every run, plus one judge call for each turn that passes the rules. With this dataset, that is several dozen model calls.

If the evaluation passes, the output shows the average pass rate. The output below is illustrative; your results will differ.

```
Running Tests

	broadband_support_agent
		[pass] evaluateSupportAgent

		    evaluation passed with an average pass rate of 0.9333333333333332
```

If it fails, the output lists every entry of every run, with `passed` or the failure message. The message shows which check failed and the agent's answer, for example, `[outage-no-ticket-1] rule violations: ["unexpected call to side-effecting tool: openSupportTicket"]`.

```
		[fail] evaluateSupportAgent:

		    evaluation failed with an average pass rate of 0.6
			
			    evaluation runs:

				    run: 1

					    entry: outage-no-ticket
					    message: ...
```

Add the `--test-report` flag to write the results to `target/report/test_results.json` and an HTML report in `target/report`. For an evaluation, the JSON entry of the test has an `evaluationSummary` with the `targetPassRate`, the `observedPassRate`, and the outcome of each entry in each run. Archive this file to track the pass rate over time.

```
$ bal test --groups live-eval --test-report
```

## Run evaluations in CI

Run the deterministic tests on every push, and the evaluation on pull requests. The workflow below is for GitHub Actions and uses the setup steps from [Configure CI/CD for Ballerina projects](/learn/build-and-run/ci-cd/). Store the OpenAI API key as a repository secret named `OPENAI_API_KEY`.

```yaml
name: Agent tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ballerina-platform/setup-ballerina@v1
        with:
          version: 2201.13.2
      - name: Run deterministic tests
        run: bal test --disable-groups live-eval

  evaluation:
    if: github.event_name == 'pull_request'
    needs: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ballerina-platform/setup-ballerina@v1
        with:
          version: 2201.13.2
      - name: Evaluate the agent
        run: bal test --groups live-eval --test-report
        env:
          BAL_CONFIG_VAR_OPENAIAPIKEY: ${{ secrets.OPENAI_API_KEY }}
      - name: Keep the evaluation report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: evaluation-report
          path: target/report
```

- The evaluation fails the job when the average pass rate falls below `minPassRate`, which blocks the merge if the job is a required check.
- Pull requests from forks do not receive repository secrets, so the evaluation fails with an authentication error for them. Run it only for branches in the repository, or trigger it manually with `workflow_dispatch`.
- Change the system prompt, the tools, or the model in the same pull request as the dataset entries that cover the change.

## Run the integration

Execute the command below to run the service with the key in `Config.toml`.

```
$ bal run
```

## Try the integration

Send a message about a connection problem in an area with an outage. Because the answer is generated by an LLM, your results will differ.

```
$ curl -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "s1", "message": "My internet has been down since this morning. My account is A-100."}'
{"reply":"There is currently a known outage in your area. It is expected to be resolved by today 18:00, so no technician visit is needed."}
```

Verify the failure handling by sending an empty message. The request is rejected without calling the model.

```
$ curl -i -X POST http://localhost:8080/support/chat \
    -H "Content-Type: application/json" \
    -d '{"sessionId": "s1", "message": " "}'
HTTP/1.1 400 Bad Request
...
message must not be empty
```

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/)
- [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/)
- [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/)
- [Execute tests](/learn/test-ballerina-code/execute-tests/)
- [Agent with local tools](/learn/by-example/ai-agent-local-tools/) — Ballerina by Example
- [Direct LLM calls](/learn/by-example/direct-llm-calls/) — Ballerina by Example
- [Data-driven tests](/learn/by-example/testerina-data-driven-tests/) — Ballerina by Example
- [Group tests](/learn/by-example/testerina-group-tests/) — Ballerina by Example
- [Mocking objects](/learn/by-example/testerina-mocking-objects/) — Ballerina by Example
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
- [Evaluations](https://wso2.com/integration-platform/docs/genai/develop/agents/evaluations) — WSO2 Integrator documentation
