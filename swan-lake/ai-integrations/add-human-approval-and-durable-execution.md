---
layout: ballerina-add-human-approval-and-durable-execution-left-nav-pages-swanlake
title: Add human approval and durable execution
description: Coordinate approvals and long-running agent workflows, including pause and resume, retries, recovery, and external side effects.
keywords: ballerina, AI, agent, human in the loop, approval, durable execution, workflow, retry, idempotency, temporal
permalink: /learn/add-human-approval-and-durable-execution/
active: add-human-approval-and-durable-execution
intro: This guide shows how to let an AI agent propose an action with a real-world side effect, such as a refund, and have a person approve it before it runs. The agent runs as a durable workflow, so it can wait for the decision for as long as it takes, retry failed steps, and resume after a restart without repeating completed work.
---

## The scenario

An online store wants an AI assistant to handle refund requests that arrive at the support desk. The assistant reads the customer's message, looks up the order, and decides how much to refund. Money must never move without a person's approval.

The requirements are:

- A support lead approves every refund before the payment gateway is called. The lead can approve the proposed amount, change it, or reject the refund.
- A request can wait for approval for hours or days. The wait must survive restarts and redeployments of the integration.
- Business rules, such as "only delivered orders can be refunded", are enforced in code, not left to the model.
- A failed payment gateway call does not lose the request. Payments operations decide whether to run it again.
- A refund is paid at most once per order, even if a step is retried or a request is submitted twice.

>**Info:** This guide builds on the general workflow tutorials in Resources: [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/), [Write a workflow with a human task](/learn/write-a-workflow-with-a-human-task/), and [Handle errors and replay failed activities in workflows](/learn/handle-errors-and-replay-failed-activities-in-workflows/). Read them first if you are new to workflows, activities, and human tasks. This guide applies the same ideas to an agent.

## How it works

The [`ballerina/workflow`](https://central.ballerina.io/ballerina/workflow/latest) module provides `workflow:DurableAgent`, an AI agent that runs as a durable workflow. Each model call and each tool call runs as a workflow *activity*, and the engine records the result of every completed activity. If the program stops, the engine replays the agent from its recorded history instead of calling the model or the tools again.

The agent's tools are ordinary `@workflow:Activity` functions. You attach policies to each one:

- An **approval policy** creates a review task before the activity runs. The agent suspends durably until a person decides.
- A **retry policy** says what happens when the activity fails: retry automatically, or create a review task for a person.

```
POST /refunds                                                 Support lead / payments ops
     │                                                                    │
     ▼                                                                    ▼
┌─────────────────┐  runWithId(ticketId)  ┌────────────────────────────────────────────┐
│  HTTP service   │──────────────────────►│  refundAgent (workflow:DurableAgent)       │
│  :8080/refunds  │◄──────────────────────│                                            │
└─────────────────┘  getResult(ticketId)  │   llmChat ──► OpenAI                       │
                                          │   getOrder           (no approval)         │
┌─────────────────┐  review tasks         │   issueRefund ─► [approval: SUPPORT_LEAD]  │
│ Management API  │◄─────────────────────►│        │           [on failure: PAYMENTS_OPS]
│ :8234/workflow  │  proceed / reject     │        ▼                                   │
└─────────────────┘                       │   payment gateway (idempotency key)        │
                                          │   notifyCustomer     (automatic retries)   │
                                          └───────────────────┬────────────────────────┘
                                                              │ recorded history
                                                              ▼
                                               Workflow engine (in-memory or Temporal)
```

1. The HTTP service starts an agent run. The ticket ID is the run's instance ID, so submitting the same ticket twice does not start a second run.
2. The agent calls the model and looks up the order with `getOrder`.
3. When the model proposes a call to `issueRefund`, the engine creates a review task for the `SUPPORT_LEAD` role and suspends the agent. No thread is held while it waits.
4. A support lead completes the review through the management API. If they approve, `issueRefund` runs, with the amount they edited if they changed it. If they reject, the agent receives the reason as the tool result and explains that no refund was issued.
5. `issueRefund` checks the refund policy in code and calls the payment gateway with an idempotency key. If the gateway call fails, a second review task asks payments operations to run it again or give up.
6. The agent notifies the customer and finishes. The HTTP service returns the agent's final answer.

### Choose an approval mechanism

Ballerina has two ways to put a person in front of an agent's tool call.

| | `workflow:DurableAgent` with an `approvalPolicy` | `ai:Agent` with `requiresApproval` |
|---|---|---|
| Module | `ballerina/workflow` | `ballerina/ai` |
| Where the paused state lives | The workflow engine. With Temporal, it survives restarts. | The agent's memory store. The default store is in memory, so a pause is lost on restart. |
| How a person decides | The workflow management API (review tasks), filtered by role | Your own code: `run` returns an `ai:ApprovalRequiredError`, and you call `run` again with an `ai:Resume` |
| Retries and failure reviews | Per-activity retry policies | Your own code |
| Best for | Long waits, side effects that must not be lost or repeated | Interactive chat where the reviewer answers within the same session |

This guide uses `workflow:DurableAgent`. The second option is described in [Approve tool calls in an interactive agent](#approve-tool-calls-in-an-interactive-agent).

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.14.0 (Swan Lake Update 14) or later. The `ballerina/workflow` 1.0.0 and `ballerina/ai` 1.16.0 modules that this guide uses require it. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.14.0
    ```

2. Access to an LLM that supports tool calling. This guide uses OpenAI and requires an OpenAI API key. To use a different provider, see [Use a different model provider](/learn/build-an-agent-that-uses-enterprise-systems/#use-a-different-model-provider).

3. The <a href="https://docs.temporal.io/cli" target="_blank">Temporal CLI</a>, to run the agent against a durable engine. You can try the guide without it by using the in-memory engine, which does not survive a restart.

4. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

5. A command terminal.

## Create the package

Ballerina uses packages to group code. In the terminal, execute the command below to create a package for the integration.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new refund_approval_agent
```

Delete the generated `main.bal` file. You add the following files as you follow the guide.

```
.
├── refund_approval_agent
│   ├── Ballerina.toml
│   ├── Config.toml
│   ├── activities.bal
│   ├── agent.bal
│   ├── service.bal
│   ├── types.bal
│   └── tests
│       ├── Config.toml
│       └── refund_test.bal
```

## Configure the model provider

The durable agent needs an `ai:ModelProvider` value. Declare the API key as a [configurable variable](/learn/by-example/configurable-variables/) and create the model provider at the module level in a file named `agent.bal`.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);
```

Create a `Config.toml` file in the package root. It holds the API key, selects the workflow engine, and enables the workflow management API that reviewers use.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"

[ballerina.workflow]
mode = "IN_MEMORY"

[ballerina.workflow.management.rest]
enableManagementApi = true
enableBasicAuth = false
```

- `mode = "IN_MEMORY"` runs a lightweight engine inside the program. It needs no server, but workflow state is lost when the program stops. [Make the agent durable](#make-the-agent-durable) switches to Temporal.
- `enableManagementApi = true` serves the management API at `http://localhost:8234/workflow/`.

>**Note:** `enableBasicAuth = false` leaves the management API unauthenticated. Use it only on your own machine. See [Secure the management API](#secure-the-management-api). Do not commit `Config.toml` files that contain secrets. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

## Implement the integration

### Define the types

Create a `types.bal` file. `RefundRequest` is the input of the HTTP resource and of the agent. Its [constraint annotations](/learn/by-example/constraint-validations/) are checked by the HTTP listener when the payload is bound, so an invalid request is rejected with `400 Bad Request` before the agent starts. See [HTTP service payload constraint validation](/learn/by-example/http-service-payload-constraint-validation/).

```ballerina
import ballerina/constraint;

# A refund request submitted by the support desk.
type RefundRequest record {|
    # Support ticket that the request belongs to
    @constraint:String {pattern: re `TKT-[0-9]+`}
    string ticketId;
    # Order that the customer wants a refund for
    @constraint:String {pattern: re `ORD-[0-9]+`}
    string orderId;
    # The customer's message, as written
    @constraint:String {minLength: 1, maxLength: 2000}
    string customerMessage;
|};
```

`RefundResult` is what the `issueRefund` tool returns to the agent, and `RefundStatus` is what the HTTP service returns to the support desk. The complete file, including the `Order` type, is in [The complete code](#the-complete-code).

### Write the tools as activities

Create an `activities.bal` file. Each tool is an `@workflow:Activity` function. The engine records each completed call, so a completed refund is never run again when the agent is replayed.

In this guide, the order system and the payment gateway are simulated in memory so that the sample runs without other services. Replace them with real clients, such as [`http:Client`](/learn/by-example/http-client-send-request-receive-response/), in your integration.

```ballerina
# Refunds an amount to the customer's original payment method. Check the order with
# `getOrder` first. At most one refund is issued per order.
#
# + orderId - The order to refund
# + amount - The amount to refund, in the order currency
# + reason - A short reason for the refund, recorded with the payment
# + return - The refund result, or an error if the payment gateway call failed
@workflow:Activity
isolated function issueRefund(string orderId, decimal amount, string reason) returns RefundResult|error {
    Order? 'order = orders[orderId];
    if 'order is () {
        return {status: "REJECTED", orderId, amount, message: string `Order ${orderId} not found`};
    }
    string? violation = checkRefundPolicy('order, amount);
    if violation is string {
        // A policy violation is a business outcome, not a failure: return it as a value
        // so that it is not retried.
        return {status: "REJECTED", orderId, amount, message: violation};
    }
    GatewayRequest gatewayResult = check submitRefund(refundKey(orderId), orderId, amount, reason);
    string refundId = gatewayResult.refundId ?: "";
    if gatewayResult.duplicate {
        return {status: "ISSUED", orderId, amount, refundId,
            message: "A refund was already issued for this order; no new payment was made"};
    }
    return {status: "ISSUED", orderId, amount, refundId, message: "Refund issued"};
}
```

Two decisions in this function matter for an agent:

- **The policy is enforced in the tool, not in the prompt.** The approver sees the amount that the model proposed, but `checkRefundPolicy` still runs after approval, because a reviewer can approve or edit a value that breaks a rule. The model cannot talk its way past it.
- **Business rejections are values, errors are failures.** A refund that the policy blocks is returned as `status: "REJECTED"`, which the agent reads and explains. Only a failed gateway call returns an `error`, which triggers the retry policy that you declare in the next step. If a policy violation were an `error`, it would be retried and sent to payments operations for review, although no retry can fix it.

The policy check is a plain function, so you can test it without a model or an engine.

```ballerina
# Checks a proposed refund against the refund policy.
#
# + 'order - The order to refund
# + amount - The proposed refund amount
# + return - A description of the violated rule, or `()` if the refund is allowed
isolated function checkRefundPolicy(Order 'order, decimal amount) returns string? {
    if 'order.status != "DELIVERED" {
        return string `Order ${'order.orderId} is ${'order.status}; only delivered orders can be refunded`;
    }
    if amount <= 0d {
        return "Refund amount must be greater than zero";
    }
    decimal refundable = 'order.total * maxRefundRatio - 'order.refunded;
    if amount > refundable {
        return string `Refund amount ${amount} exceeds the refundable amount ${refundable}`;
    }
    return ();
}
```

### Make the side effect idempotent

The engine never repeats a *completed* activity. However, an activity can run more than once in other cases: a person can ask for a failed call to run again, and if the process stops after the gateway accepted a payment but before the result was recorded, the call runs again on recovery. The model can also propose the same refund twice. The external side effect must therefore be safe to repeat.

The usual way is an idempotency key that the target system honors. Derive it from business data that identifies the operation, not from a random value or the current time, so that every repetition sends the same key.

```ballerina
# Derives the idempotency key for a refund. The key depends only on the order, so a
# retried or replayed call, or a second refund attempt for the same order, cannot
# create a second payment.
#
# + orderId - The order to refund
# + return - The idempotency key
isolated function refundKey(string orderId) returns string => string `refund-${orderId}`;
```

The simulated gateway, `submitRefund`, returns the original refund when it receives a key that it already accepted, and marks the response as a duplicate. `issueRefund` reports this to the agent so that the agent does not claim that a new payment was made. Most payment providers support an idempotency key on their refund APIs. Check your provider's documentation for the header or field to use.

### Declare the durable agent

Add the agent to `agent.bal`. A `workflow:DurableAgent` must be a module-level `final` variable initialized with `new ({...})`. The workflow compiler plugin registers the agent and its activities from this declaration, and the variable name (`refundAgent`) becomes the agent's identity.

```ballerina
final workflow:DurableAgent refundAgent = check new ({
    systemPrompt: {
        role: "Refund assistant",
        instructions: string `You handle refund requests from customers of an online store.
            Look up the order with getOrder before you decide anything.
            If the request is reasonable, call issueRefund once with the amount to refund and a short reason.
            If issueRefund returns status REJECTED, or a reviewer rejects the call, do not try again;
            explain why the refund was not issued.
            After a refund is issued, call notifyCustomer with a short, polite message.
            Never promise a refund to the customer before issueRefund returns status ISSUED.`
    },
    model: model,
    inputType: RefundRequest,
    activities: [
        {
            activity: getOrder,
            description: "Returns an order, including its status, total, and the amount already refunded."
        },
        {
            activity: issueRefund,
            description: "Refunds an amount to the customer's original payment method. " +
                "Returns status ISSUED with a refund ID, or status REJECTED with the reason.",
            // Every refund waits for a support lead before the payment is made.
            approvalPolicy: {
                userRoles: "SUPPORT_LEAD",
                title: "Approve refund",
                description: "The refund assistant proposes a refund. Approve, edit the amount, or reject."
            },
            // If the payment gateway call fails, payments operations decide whether to rerun it.
            retryPolicy: {userRoles: "PAYMENTS_OPS"}
        },
        {
            activity: notifyCustomer,
            description: "Sends a short message to the customer.",
            retryPolicy: {maxRetries: 5, retryDelay: 2}
        }
    ],
    maxIter: 8
});
```

- `inputType` declares the shape of the structured input of a run. The compiler checks the value that you pass to `run` or `runWithId` against it, and the agent receives the input as part of the user message.
- `approvalPolicy` takes a review task definition. `userRoles` names who may decide. You can also use `users`, `excludedUsers`, `excludedRoles`, and `administratorRoles`, and give the task a `title` and a `description`.
- `retryPolicy` on `issueRefund` is a review task definition: when the activity returns an error, a review task is created for `PAYMENTS_OPS` and the agent suspends until someone decides.
- `retryPolicy` on `notifyCustomer` is an automatic retry policy: up to 5 retries, the first after 2 seconds, with the delay doubling each time (the default `retryBackoff` is `2.0`).
- `maxIter` limits the number of model calls in a run, so that a confused model cannot loop forever.

>**Note:** Set `description` for each activity. The description tells the model what the tool does. In the module versions used for this guide, a bare activity was advertised to the model with only a generic description ("Tool getOrder") instead of its documentation comment.

>**Note:** Write each field as `name: value` (for example, `model: model`). In the module versions used for this guide, the shorthand field `model,` compiled, but the agent failed at run time with an error stating that no agent name is bound to the object.

>**Tip:** Do not interpolate data into the `systemPrompt` that must not be sent to the model provider. The run input (`RefundRequest`) and every tool result are also sent to the model.

### Expose the agent through an HTTP service

Create a `service.bal` file. The `POST` resource starts a run and returns immediately. The `GET` resource reports the run's state without waiting, because a run can wait for a person for days.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/workflow;
import ballerina/workflow.management.rest as _;

service /refunds on new http:Listener(8080) {

    # Starts a refund agent run for a ticket and returns without waiting for the result.
    #
    # + request - The refund request
    # + return - The instance ID of the run, or an error status
    resource function post .(RefundRequest request)
            returns http:Accepted|http:Conflict|http:InternalServerError {
        // The ticket ID is the instance ID: a retried submit joins the running instance
        // instead of starting a second one, and a closed ticket is not processed again.
        string|error instanceId = refundAgent.runWithId(request.ticketId, request.customerMessage, request,
                ifRunning = workflow:USE_EXISTING, ifClosed = workflow:REJECT_DUPLICATE);
        if instanceId is workflow:InstanceAlreadyExistsError {
            return <http:Conflict>{body: string `Ticket ${request.ticketId} was already processed`};
        }
        if instanceId is error {
            log:printError("Failed to start the refund agent", instanceId);
            return <http:InternalServerError>{body: "Could not start the refund request"};
        }
        return <http:Accepted>{body: <RefundStatus>{instanceId, status: "IN_PROGRESS"}};
    }

    // ...
}
```

`runWithId` starts the agent under an instance ID that you choose. Using a business key as the ID makes the submission itself idempotent:

- `ifRunning = workflow:USE_EXISTING` returns the ID of the running instance if the support desk retries the request, without delivering the new input.
- `ifClosed = workflow:REJECT_DUPLICATE` refuses a new run for a ticket whose run has finished, and `runWithId` returns a `workflow:InstanceAlreadyExistsError`. The engine keeps closed instances only for a limited retention period, so keep a permanent guard in your own data (here, the payment gateway's idempotency key).

The `GET` resource reads the result with `getResult`, which does not block.

```ballerina
    resource function get [string instanceId]() returns RefundStatus|http:Accepted|http:NotFound {
        string|error summary = refundAgent.getResult(instanceId);
        if summary is workflow:WorkflowInProgressError {
            // Still working, or waiting for a person to decide.
            return <http:Accepted>{body: <RefundStatus>{instanceId, status: "IN_PROGRESS"}};
        }
        if summary is workflow:InstanceNotFoundError {
            return <http:NotFound>{body: <RefundStatus>{instanceId, status: "NOT_FOUND"}};
        }
        if summary is error {
            log:printError("Refund agent run did not complete", summary, instanceId = instanceId);
            return {instanceId, status: "FAILED"};
        }
        return {instanceId, status: "COMPLETED", summary};
    }
```

The import `ballerina/workflow.management.rest as _` includes the management API module. It starts the API only when `enableManagementApi = true` is set in `Config.toml`.

>**Note:** The final answer of this agent is free text. `workflow:DurableAgentConfig` also has a `resultType` field that asks the model for a typed final result. In the module versions used for this guide, a record type passed only as `resultType` failed at run time with `Runtime schema generation is not yet supported for type`, so this guide returns text. Treat the payment gateway, not the agent's answer, as the record of whether money moved.

## Handle failures

Each kind of failure is handled at the level where it can be fixed.

| Failure | What happens | Where it is configured |
|---|---|---|
| Invalid request | The HTTP listener rejects it with `400 Bad Request`. No run starts. | Constraint annotations on `RefundRequest` |
| The same ticket is submitted twice | The second submit joins the running instance, or gets `409 Conflict` after the run has closed. | `runWithId` policies |
| The model call fails (for example, a timeout or a `5xx` response) | The model call is an activity. It is retried according to the module-wide default retry policy. | `activityRetryMaximumAttempts` and related keys under `[ballerina.workflow]` |
| The refund breaks a policy rule | `issueRefund` returns `status: "REJECTED"`. The agent explains it. No retry. | `checkRefundPolicy` |
| The reviewer rejects the refund | `issueRefund` does not run. The agent receives the rejection and the reviewer's feedback as the tool result, and is told not to retry. | `approvalPolicy` |
| The reviewer changes the amount | `issueRefund` runs with the edited arguments. | `approvalPolicy` (`proceed-with-input`) |
| The payment gateway call fails | A review task is created for `PAYMENTS_OPS`. The agent waits until they run it again, run it with corrected input, or reject it. On rejection, the agent receives the error and the feedback as the tool result. | `retryPolicy: {userRoles: "PAYMENTS_OPS"}` |
| The notification fails | It is retried automatically up to 5 times. | `retryPolicy: {maxRetries: 5, retryDelay: 2}` |
| The program stops | With a durable engine, the run resumes from its last recorded step when the program is running again. | `mode` under `[ballerina.workflow]` |

To retry failed model calls, set the default activity retry policy in `Config.toml`. It applies to every activity that does not declare its own `retryPolicy`, including `getOrder`.

```toml
[ballerina.workflow]
mode = "IN_MEMORY"
activityRetryMaximumAttempts = 3
```

`activityRetryMaximumAttempts` counts the first attempt, so `3` means up to two retries. `activityRetryInitialInterval`, `activityRetryBackoffCoefficient`, and `activityRetryMaximumInterval` control the delay between attempts.

>**Note:** The workflow module also has a `RetryBeforeReview` policy, which retries automatically and creates a review task only after the last retry fails (for example, `{maxRetries: 3, userRoles: "PAYMENTS_OPS"}`). For a durable agent's activity in the module versions used for this guide, the review task was created after the first failed attempt, without automatic retries. This guide therefore uses a review-only policy for `issueRefund`, so that the behavior matches the configuration. For a workflow function that calls activities through `ctx->callActivity`, see [Handle errors and replay failed activities in workflows](/learn/handle-errors-and-replay-failed-activities-in-workflows/).

## Make the agent durable

The in-memory engine is useful for development, but a run that waits for approval is lost when the program stops. For production, run the agent on a <a href="https://temporal.io" target="_blank">Temporal</a> server, which records every step of every run.

Start a local Temporal development server in a separate terminal.

```
$ temporal server start-dev
```

Change the `[ballerina.workflow]` section of `Config.toml`. Every integration that shares a Temporal server must use its own task queue.

```toml
[ballerina.workflow]
mode = "LOCAL"
taskQueue = "REFUND_APPROVAL_QUEUE"
```

With a durable engine:

- **Pause and resume.** A run that waits on a review task is a durable suspend. It holds no thread, and the decision can arrive days later.
- **Recovery.** If the program stops, the engine resumes each run from its last recorded step as soon as a worker for the task queue is running again. Completed model calls and tool calls are not repeated; their recorded results are reused. You do not restart a run by hand.
- **Visibility.** Every model call, tool call, and review decision is part of the run's history. You can inspect it in the Temporal Web UI at <a href="http://localhost:8233" target="_blank">http://localhost:8233</a> or through the management API (`GET /workflow/workflows/{workflowId}/history`).

To connect to a self-hosted or cloud Temporal deployment, set `mode` to `SELF_HOSTED` or `CLOUD` and set `url`, `namespace`, and the authentication keys (`authApiKey`, or `authMtlsCert` and `authMtlsKey`). See the <a href="https://central.ballerina.io/ballerina/workflow/latest" target="_blank">`ballerina/workflow` module documentation</a>.

>**Note:** Activity arguments and results, including the customer's message and each model response, are stored in the workflow history and are written to the integration's log at the `INFO` level. Do not pass secrets as activity arguments, and apply your retention and access policies to the workflow engine and the logs.

## Secure the management API

Reviewers decide through the management API. Requests carry the caller's identity in the `x-user-id` and `x-user-roles` headers. The role list is used to filter tasks: a request that names no role that a task is routed to does not see that task, and the decision is recorded against `x-user-id`.

The workflow module does not authenticate a caller from these headers. In production, enable TLS and at least one authentication scheme in the `[ballerina.workflow.management.rest]` section, and let your gateway or backend set the identity from the logged-in user. For example, with basic authentication:

```toml
[ballerina.workflow.management.rest]
enableManagementApi = true
enableBasicAuth = true
enableTls = true
certFile = "/etc/certs/tls.crt"
keyFile = "/etc/certs/tls.key"

[[ballerina.auth.users]]
username = "support-portal"
password = "<strong-password>"
scopes = ["admin"]
```

The module also supports JWT (`enableJwtAuth`, `jwksUrl`), OAuth2 token introspection (`enableOAuth`, `oauth2IntrospectionUrl`), and API keys (`enableApiKey`, `apiKeyValue`). With JWT or OAuth2, the caller's identity is read from the token claims instead of the headers. See [Write a workflow with a human task](/learn/write-a-workflow-with-a-human-task/) for more about the management API and a sample task inbox UI.

## Approve tool calls in an interactive agent

If the reviewer is the person who is chatting with the agent, and the pause does not need to survive a restart, you can gate a tool of an `ai:Agent` directly. Set `requiresApproval` in the `@ai:AgentTool` annotation to `true`, or to an `isolated` function with the same parameters as the tool that decides per call.

```ballerina
# Refunds an amount for an order.
#
# + orderId - The order to refund
# + amount - The amount to refund
# + return - The refund ID, or an error
@ai:AgentTool {
    description: "Refunds an amount for an order and returns the refund ID.",
    requiresApproval: needsApproval
}
isolated function issueRefund(string orderId, decimal amount) returns string|error {
    return string `RF-${orderId}`;
}

# Decides whether a proposed refund needs a person's approval. It has the same parameters as
# the tool it gates.
#
# + orderId - The proposed order ID
# + amount - The proposed amount
# + return - `true` if the call must wait for approval
isolated function needsApproval(string orderId, decimal amount) returns boolean => amount > 50d;

final ai:Agent supportAgent = check new (
    systemPrompt = {role: "Support assistant", instructions: "Help customers with refunds for their orders."},
    model = model,
    tools = [issueRefund]
);
```

When the model proposes a gated call, `run` returns an `ai:ApprovalRequiredError` whose detail lists the pending `ai:ApprovalRequest` values. To continue, call `run` again on the same session with an `ai:Resume` that holds a decision for each request ID.

```ballerina
# Runs one turn of the conversation, or resumes a paused one.
#
# + input - The customer's message, or the reviewer's decisions on a paused turn
# + sessionId - The conversation ID
# + return - The agent's answer, the tool calls waiting for approval, or an error
function converse(string|ai:Resume input, string sessionId) returns string|ai:ApprovalRequest[]|error {
    string|ai:Error answer = supportAgent.run(input, sessionId);
    if answer is ai:ApprovalRequiredError {
        // The run is paused. Show the proposed calls to a reviewer.
        return answer.detail().requests;
    }
    return answer;
}

# Builds the input that resumes a paused turn with a reviewer's decision.
#
# + request - The approval request the reviewer decided on
# + approved - Whether the reviewer approved the call
# + reason - Why the call was rejected, shown to the agent
# + return - The resume input for `converse`
function decision(ai:ApprovalRequest request, boolean approved, string reason = "") returns ai:Resume {
    ai:HumanDecision & readonly humanDecision = approved ? {outcome: ai:APPROVE} : {outcome: ai:REJECT, reason};
    return {decisions: {[request.id]: humanDecision}};
}
```

- A decision is `APPROVE` or `REJECT`. This mechanism does not let the reviewer edit the arguments.
- While a session has a pending approval, starting a new turn on it returns the same `ai:ApprovalRequiredError` again instead of starting a new turn.
- The pending approval is stored in the agent's memory. The default memory keeps it in process, so it is lost on restart. To keep it, pass an `ai:ShortTermMemory` backed by an `ai:ShortTermMemoryStore` implementation that persists to a database.

>**Note:** In the module versions used for this guide, the `@ai:AgentTool` annotation failed to compile when it set `requiresApproval` without also setting `description`. Set both, as shown above.

For more about tools, see [Agent with local tools](/learn/by-example/ai-agent-local-tools/), [Chat agents](/learn/by-example/chat-agents/), and [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/).

## The complete code

### `types.bal`

```ballerina
import ballerina/constraint;

# A refund request submitted by the support desk.
type RefundRequest record {|
    # Support ticket that the request belongs to
    @constraint:String {pattern: re `TKT-[0-9]+`}
    string ticketId;
    # Order that the customer wants a refund for
    @constraint:String {pattern: re `ORD-[0-9]+`}
    string orderId;
    # The customer's message, as written
    @constraint:String {minLength: 1, maxLength: 2000}
    string customerMessage;
|};

# An order, as returned by the order system.
type Order record {|
    # The order ID
    string orderId;
    # The customer who placed the order
    string customerId;
    # The fulfillment status of the order
    "DELIVERED"|"SHIPPED"|"CANCELLED" status;
    # The order total
    decimal total;
    # The amount already refunded for the order
    decimal refunded;
|};

# The outcome of a call to the `issueRefund` activity.
type RefundResult record {|
    # `ISSUED` if the payment gateway accepted the refund, `REJECTED` if the refund policy blocked it
    "ISSUED"|"REJECTED" status;
    # The order the refund is for
    string orderId;
    # The requested amount
    decimal amount;
    # Payment gateway reference, present when the refund was issued
    string refundId?;
    # A human-readable explanation of the result
    string message;
|};

# The status of a refund request, as returned to the support desk.
type RefundStatus record {|
    # The instance ID of the refund agent run (the ticket ID)
    string instanceId;
    # Where the run is
    "IN_PROGRESS"|"COMPLETED"|"FAILED"|"NOT_FOUND" status;
    # The agent's final answer, once the run has completed
    string summary?;
|};
```

### `activities.bal`

```ballerina
import ballerina/log;
import ballerina/workflow;

# Maximum share of an order total that can be refunded through this flow.
configurable decimal maxRefundRatio = 1.0;
# Number of times the simulated payment gateway fails before it accepts a refund.
# Set it to a positive value to try out the failure review.
configurable int gatewayFailuresBeforeSuccess = 0;

// Simulated order system.
final readonly & map<Order> orders = {
    "ORD-1001": {orderId: "ORD-1001", customerId: "CUS-42", status: "DELIVERED", total: 120.00d, refunded: 0d},
    "ORD-1002": {orderId: "ORD-1002", customerId: "CUS-42", status: "SHIPPED", total: 64.50d, refunded: 0d},
    "ORD-1003": {orderId: "ORD-1003", customerId: "CUS-77", status: "DELIVERED", total: 300.00d, refunded: 300.00d}
};

// Simulated payment gateway state, keyed by idempotency key.
type GatewayRequest record {|
    # Number of requests received with the key
    int attempts;
    # The refund ID, once the refund is accepted
    string? refundId;
    # Whether the last request repeated an accepted one
    boolean duplicate = false;
|};

isolated map<GatewayRequest> gatewayRequests = {};

# Returns an order, including its status, total, and the amount already refunded.
#
# + orderId - The order ID, in the form `ORD-<number>`
# + return - The order, or an error if no such order exists
@workflow:Activity
isolated function getOrder(string orderId) returns Order|error {
    Order? 'order = orders[orderId];
    if 'order is () {
        return error(string `Order ${orderId} not found`);
    }
    return 'order;
}

# Refunds an amount to the customer's original payment method. Check the order with
# `getOrder` first. At most one refund is issued per order.
#
# + orderId - The order to refund
# + amount - The amount to refund, in the order currency
# + reason - A short reason for the refund, recorded with the payment
# + return - The refund result, or an error if the payment gateway call failed
@workflow:Activity
isolated function issueRefund(string orderId, decimal amount, string reason) returns RefundResult|error {
    Order? 'order = orders[orderId];
    if 'order is () {
        return {status: "REJECTED", orderId, amount, message: string `Order ${orderId} not found`};
    }
    string? violation = checkRefundPolicy('order, amount);
    if violation is string {
        // A policy violation is a business outcome, not a failure: return it as a value
        // so that it is not retried.
        return {status: "REJECTED", orderId, amount, message: violation};
    }
    GatewayRequest gatewayResult = check submitRefund(refundKey(orderId), orderId, amount, reason);
    string refundId = gatewayResult.refundId ?: "";
    if gatewayResult.duplicate {
        return {status: "ISSUED", orderId, amount, refundId,
            message: "A refund was already issued for this order; no new payment was made"};
    }
    return {status: "ISSUED", orderId, amount, refundId, message: "Refund issued"};
}

# Sends a message to a customer.
#
# + customerId - The customer to notify
# + message - The message text
# + return - An error if the message could not be sent
@workflow:Activity
isolated function notifyCustomer(string customerId, string message) returns error? {
    log:printInfo("Customer notified", customerId = customerId, text = message);
}

# Checks a proposed refund against the refund policy.
#
# + 'order - The order to refund
# + amount - The proposed refund amount
# + return - A description of the violated rule, or `()` if the refund is allowed
isolated function checkRefundPolicy(Order 'order, decimal amount) returns string? {
    if 'order.status != "DELIVERED" {
        return string `Order ${'order.orderId} is ${'order.status}; only delivered orders can be refunded`;
    }
    if amount <= 0d {
        return "Refund amount must be greater than zero";
    }
    decimal refundable = 'order.total * maxRefundRatio - 'order.refunded;
    if amount > refundable {
        return string `Refund amount ${amount} exceeds the refundable amount ${refundable}`;
    }
    return ();
}

# Derives the idempotency key for a refund. The key depends only on the order, so a
# retried or replayed call, or a second refund attempt for the same order, cannot
# create a second payment.
#
# + orderId - The order to refund
# + return - The idempotency key
isolated function refundKey(string orderId) returns string => string `refund-${orderId}`;

# Simulates a payment gateway that honors idempotency keys: a request with a key that
# was already accepted returns the original refund ID instead of paying again.
#
# + idempotencyKey - Key that identifies the refund
# + orderId - The order to refund
# + amount - The amount to refund
# + reason - The reason for the refund
# + return - The state of the request, or an error if the gateway is unavailable
isolated function submitRefund(string idempotencyKey, string orderId, decimal amount, string reason)
        returns GatewayRequest|error {
    lock {
        GatewayRequest request = gatewayRequests[idempotencyKey] ?: {attempts: 0, refundId: ()};
        if request.refundId is string {
            log:printInfo("Duplicate refund request ignored", idempotencyKey = idempotencyKey);
            request.duplicate = true;
            return request.clone();
        }
        request.attempts += 1;
        gatewayRequests[idempotencyKey] = request;
        if request.attempts <= gatewayFailuresBeforeSuccess {
            return error(string `Payment gateway unavailable (attempt ${request.attempts})`);
        }
        string refundId = string `RF-${orderId}`;
        request.refundId = refundId;
        log:printInfo("Refund accepted by payment gateway", refundId = refundId, amount = amount,
                reason = reason);
        return request.clone();
    }
}
```

### `agent.bal`

```ballerina
import ballerina/ai;
import ballerina/workflow;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

final workflow:DurableAgent refundAgent = check new ({
    systemPrompt: {
        role: "Refund assistant",
        instructions: string `You handle refund requests from customers of an online store.
            Look up the order with getOrder before you decide anything.
            If the request is reasonable, call issueRefund once with the amount to refund and a short reason.
            If issueRefund returns status REJECTED, or a reviewer rejects the call, do not try again;
            explain why the refund was not issued.
            After a refund is issued, call notifyCustomer with a short, polite message.
            Never promise a refund to the customer before issueRefund returns status ISSUED.`
    },
    model: model,
    inputType: RefundRequest,
    activities: [
        {
            activity: getOrder,
            description: "Returns an order, including its status, total, and the amount already refunded."
        },
        {
            activity: issueRefund,
            description: "Refunds an amount to the customer's original payment method. " +
                "Returns status ISSUED with a refund ID, or status REJECTED with the reason.",
            // Every refund waits for a support lead before the payment is made.
            approvalPolicy: {
                userRoles: "SUPPORT_LEAD",
                title: "Approve refund",
                description: "The refund assistant proposes a refund. Approve, edit the amount, or reject."
            },
            // If the payment gateway call fails, payments operations decide whether to rerun it.
            retryPolicy: {userRoles: "PAYMENTS_OPS"}
        },
        {
            activity: notifyCustomer,
            description: "Sends a short message to the customer.",
            retryPolicy: {maxRetries: 5, retryDelay: 2}
        }
    ],
    maxIter: 8
});
```

### `service.bal`

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/workflow;
import ballerina/workflow.management.rest as _;

service /refunds on new http:Listener(8080) {

    # Starts a refund agent run for a ticket and returns without waiting for the result.
    #
    # + request - The refund request
    # + return - The instance ID of the run, or an error status
    resource function post .(RefundRequest request)
            returns http:Accepted|http:Conflict|http:InternalServerError {
        // The ticket ID is the instance ID: a retried submit joins the running instance
        // instead of starting a second one, and a closed ticket is not processed again.
        string|error instanceId = refundAgent.runWithId(request.ticketId, request.customerMessage, request,
                ifRunning = workflow:USE_EXISTING, ifClosed = workflow:REJECT_DUPLICATE);
        if instanceId is workflow:InstanceAlreadyExistsError {
            return <http:Conflict>{body: string `Ticket ${request.ticketId} was already processed`};
        }
        if instanceId is error {
            log:printError("Failed to start the refund agent", instanceId);
            return <http:InternalServerError>{body: "Could not start the refund request"};
        }
        return <http:Accepted>{body: <RefundStatus>{instanceId, status: "IN_PROGRESS"}};
    }

    # Returns the outcome of a run, or its status while it is still in progress.
    #
    # + instanceId - The instance ID returned when the request was submitted
    # + return - The refund outcome, or a status
    resource function get [string instanceId]() returns RefundStatus|http:Accepted|http:NotFound {
        string|error summary = refundAgent.getResult(instanceId);
        if summary is workflow:WorkflowInProgressError {
            // Still working, or waiting for a person to decide.
            return <http:Accepted>{body: <RefundStatus>{instanceId, status: "IN_PROGRESS"}};
        }
        if summary is workflow:InstanceNotFoundError {
            return <http:NotFound>{body: <RefundStatus>{instanceId, status: "NOT_FOUND"}};
        }
        if summary is error {
            log:printError("Refund agent run did not complete", summary, instanceId = instanceId);
            return {instanceId, status: "FAILED"};
        }
        return {instanceId, status: "COMPLETED", summary};
    }
}
```

### `Config.toml`

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"

[ballerina.workflow]
mode = "IN_MEMORY"

[ballerina.workflow.management.rest]
enableManagementApi = true
enableBasicAuth = false
```

## Test the deterministic logic

Model responses vary between calls, so test the parts of the integration that must always behave the same way: the refund policy and the idempotency of the payment call. Create a `tests/refund_test.bal` file.

> **Info:** For more information, see [Test Ballerina code](/learn/test-ballerina-code/test-a-simple-function/).

```ballerina
import ballerina/test;

final Order delivered = {orderId: "ORD-1", customerId: "CUS-1", status: "DELIVERED", total: 100d, refunded: 30d};

@test:Config
function testRefundWithinLimitIsAllowed() {
    test:assertEquals(checkRefundPolicy(delivered, 70d), ());
}

@test:Config
function testRefundAboveRefundableAmountIsRejected() {
    test:assertTrue(checkRefundPolicy(delivered, 70.01d) is string);
}

@test:Config
function testNonPositiveAmountIsRejected() {
    test:assertTrue(checkRefundPolicy(delivered, 0d) is string);
}

@test:Config
function testUndeliveredOrderIsRejected() {
    Order shipped = {orderId: "ORD-2", customerId: "CUS-1", status: "SHIPPED", total: 100d, refunded: 0d};
    test:assertTrue(checkRefundPolicy(shipped, 10d) is string);
}

@test:Config
function testIdempotencyKeyDependsOnlyOnOrder() {
    test:assertEquals(refundKey("ORD-1001"), refundKey("ORD-1001"));
    test:assertNotEquals(refundKey("ORD-1001"), refundKey("ORD-1002"));
}

@test:Config
function testRepeatedRefundDoesNotPayTwice() returns error? {
    GatewayRequest first = check submitRefund("refund-ORD-9", "ORD-9", 10d, "test");
    GatewayRequest second = check submitRefund("refund-ORD-9", "ORD-9", 10d, "test");
    test:assertFalse(first.duplicate);
    test:assertTrue(second.duplicate);
    test:assertEquals(second.refundId, first.refundId);
}
```

The module-level model provider and the workflow engine are initialized when the tests run, so add a `tests/Config.toml` file with a placeholder key and the in-memory engine. The tests do not call the model.

```toml
openAiApiKey = "test-key"

[ballerina.workflow]
mode = "IN_MEMORY"
```

Run the tests.

```
$ bal test
```

```
Running Tests

	refund_approval_agent
		[pass] testIdempotencyKeyDependsOnlyOnOrder
		[pass] testNonPositiveAmountIsRejected
		[pass] testRefundAboveRefundableAmountIsRejected
		[pass] testRefundWithinLimitIsAllowed
		[pass] testRepeatedRefundDoesNotPayTwice
		[pass] testUndeliveredOrderIsRejected

		6 passing
		0 failing
		0 skipped
```

>**Tip:** Keep the rules that you want to unit-test, such as `checkRefundPolicy`, in plain functions that the activities call. To test how the agent behaves end to end, see [Evaluate agent behavior](/learn/evaluate-agent-behavior/).

## Run the integration

Execute the command below to run the integration.

```
$ bal run
```

The output includes a line that confirms that the management API is running.

```
Compiling source
        <org>/refund_approval_agent:0.1.0

Running executable

time=... level=INFO module=ballerina/workflow.management.rest message="Workflow management REST API enabled on http://localhost:8234/workflow (auth: none — the API is open to anyone who can reach the port)"
```

## Try the integration

The responses below are illustrative. Generated IDs, timestamps, and everything that the model decides, such as the proposed amount and the final summary, will differ in your run.

1. Submit a refund request.

    ```
    $ curl -X POST http://localhost:8080/refunds \
           -H 'Content-Type: application/json' \
           -d '{"ticketId": "TKT-5001", "orderId": "ORD-1001", "customerMessage": "My headphones from order ORD-1001 arrived with a broken ear cup. I would like 40 USD back."}'
    {"instanceId":"TKT-5001", "status":"IN_PROGRESS"}
    ```

2. Check the request. The agent has looked up the order, proposed a refund, and is waiting for approval.

    ```
    $ curl http://localhost:8080/refunds/TKT-5001
    {"instanceId":"TKT-5001", "status":"IN_PROGRESS"}
    ```

3. List the pending approvals as a support lead. The `x-user-roles` header must name the role that the task is routed to.

    ```
    $ curl 'http://localhost:8234/workflow/review-activities?status=PENDING' -H 'x-user-roles: SUPPORT_LEAD'
    {"items":[{"activityName":"refundAgent.issueRefund", "trigger":"PRE_RUN", "kind":"REVIEW_ACTIVITY", "taskId":"df81a0d7-1ca7-3ac1-a093-a4a18b30bc6b", "title":"Approve refund", "parentWorkflowId":"TKT-5001", "status":"PENDING", "userRoles":["SUPPORT_LEAD"], ...}], "nextPageToken":null, "hasMore":false}
    ```

    `trigger` is `PRE_RUN` for an approval and `ON_FAILURE` for a failed activity.

4. See what the agent proposes. `taskInput` holds the arguments of the proposed call, and `formSchema` describes them for a UI.

    ```
    $ curl http://localhost:8234/workflow/review-activities/<taskId> -H 'x-user-roles: SUPPORT_LEAD'
    {"activityName":"refundAgent.issueRefund", "trigger":"PRE_RUN", "errorMessage":"", "taskInput":{"reason":"Item arrived damaged", "amount":40.0, "orderId":"ORD-1001"}, ...}
    ```

5. Decide. Use one of the following requests.

    - Approve the proposed call.

        ```
        $ curl -X POST http://localhost:8234/workflow/review-activities/<taskId>/proceed \
               -H 'x-user-id: maya' -H 'x-user-roles: SUPPORT_LEAD'
        ```

    - Approve it with a different amount.

        ```
        $ curl -X POST http://localhost:8234/workflow/review-activities/<taskId>/proceed-with-input \
               -H 'Content-Type: application/json' -H 'x-user-id: maya' -H 'x-user-roles: SUPPORT_LEAD' \
               -d '{"input": {"orderId": "ORD-1001", "amount": 35.0, "reason": "Damaged ear cup"}}'
        {"success":true, "decision":"proceed-with-input", "completedBy":"maya", "completedAt":"..."}
        ```

    - Reject it, with feedback that the agent receives.

        ```
        $ curl -X POST http://localhost:8234/workflow/review-activities/<taskId>/reject \
               -H 'Content-Type: application/json' -H 'x-user-id: maya' -H 'x-user-roles: SUPPORT_LEAD' \
               -d '{"feedback": "Duplicate of TKT-4999"}'
        ```

6. Check the request again. After the refund and the notification, the run completes with the agent's final answer.

    ```
    $ curl http://localhost:8080/refunds/TKT-5001
    {"instanceId":"TKT-5001", "status":"COMPLETED", "summary":"I issued a refund of 35.00 for order ORD-1001 (refund ID RF-ORD-1001) and notified the customer."}
    ```

    The integration log shows the payment and the notification.

    ```
    time=... level=INFO module=<org>/refund_approval_agent message="Refund accepted by payment gateway" refundId="RF-ORD-1001" amount=35.0 reason="Damaged ear cup"
    time=... level=INFO module=<org>/refund_approval_agent message="Customer notified" customerId="CUS-42" text="..."
    ```

7. Submit the same ticket again. The run has closed, so the request is refused.

    ```
    $ curl -i -X POST http://localhost:8080/refunds \
           -H 'Content-Type: application/json' \
           -d '{"ticketId": "TKT-5001", "orderId": "ORD-1001", "customerMessage": "Any update?"}'
    HTTP/1.1 409 Conflict
    ...
    Ticket TKT-5001 was already processed
    ```

### Try a payment failure

Stop the integration, add `gatewayFailuresBeforeSuccess = 1` to `Config.toml`, and run it again. Submit a new ticket and approve the refund. The first gateway call fails, and a review task is created for payments operations instead of the run failing.

```
$ curl 'http://localhost:8234/workflow/review-activities?status=PENDING' -H 'x-user-roles: PAYMENTS_OPS'
{"items":[{"activityName":"refundAgent.issueRefund", "trigger":"ON_FAILURE", "title":"Review failed activity: issueRefund", "description":"Activity 'refundAgent.issueRefund' failed with: Payment gateway unavailable (attempt 1). Proceed to rerun it with the original input, proceed with edited input, or reject to surface the failure to the workflow.", ...}], ...}
```

Run the activity again with its original input. The simulated gateway accepts the second attempt, and the agent continues.

```
$ curl -X POST http://localhost:8234/workflow/review-activities/<taskId>/proceed \
       -H 'x-user-id: omar' -H 'x-user-roles: PAYMENTS_OPS'
```

Rejecting the review instead (`POST /workflow/review-activities/<taskId>/reject` with a `feedback` field) returns the error and the reviewer's feedback to the agent as the tool result, and the agent reports that no refund was issued.

### Try recovery after a restart

With `mode = "LOCAL"` and a running Temporal server, submit a ticket and stop the integration (`Ctrl + C`) while the refund is waiting for approval. Start it again with `bal run`. The run is still listed under the pending reviews, and approving it continues the agent from where it stopped. The model is not called again for the steps that had already completed.

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/)
- [Evaluate agent behavior](/learn/evaluate-agent-behavior/)
- [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/)
- [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/) — workflows, activities, and durable execution
- [Write a workflow with a human task](/learn/write-a-workflow-with-a-human-task/) — human tasks, the management API, and a task inbox UI
- [Handle errors and replay failed activities in workflows](/learn/handle-errors-and-replay-failed-activities-in-workflows/) — automatic retries and manual replay
- [Agent with local tools](/learn/by-example/ai-agent-local-tools/) — Ballerina by Example
- [Chat agents](/learn/by-example/chat-agents/) — Ballerina by Example
- [HTTP service payload constraint validation](/learn/by-example/http-service-payload-constraint-validation/) — Ballerina by Example
- [`ballerina/workflow` module](https://lib.ballerina.io/ballerina/workflow/latest/) — API documentation
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
