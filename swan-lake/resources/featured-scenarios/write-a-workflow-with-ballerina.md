---
layout: ballerina-write-a-workflow-guide-left-nav-pages-swanlake
title: Write a workflow with Ballerina
permalink: /learn/write-a-workflow-with-ballerina/
description: This guide helps you write your first durable workflow with Ballerina using the workflow module.
keywords: ballerina, programming language, workflow, durable execution, activities, temporal
active: write-a-workflow-with-ballerina
intro: This guide helps you write your first durable workflow with Ballerina using the workflow module.
---

Some business processes cannot complete in a single request. An insurance claim, for example, is verified first and paid later — and the process must survive restarts, failures, and long waits in between. The [`ballerina/workflow`](https://central.ballerina.io/ballerina/workflow/latest) module lets you write such long-running processes as plain Ballerina functions and executes them **durably**: the progress of the process is recorded step by step, so a crashed or redeployed program picks up exactly where it left off instead of starting over.

In this guide, you will write a simple claim processing workflow with two steps: verify the claim and pay the approved amount.

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.13.4 (Swan Lake)](/downloads/) or greater
2. A text editor
    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. A command terminal

## Understand the implementation

A workflow is made of two kinds of functions.

- **Activities** are the steps that interact with the outside world — calling services, updating databases, sending notifications. An activity can fail and can be retried safely.
- The **workflow function** orchestrates the activities. It contains only the coordination logic: which step runs next, and what to do with each result.

The workflow engine records the result of every completed activity. If the program stops midway — a crash, a redeployment, or a long wait — the engine replays the workflow function and reuses the recorded results, so completed activities are never executed twice. This is what makes the workflow *durable*.

The claim processing workflow in this guide has two activities:

1. `verifyClaim` — checks the claim against the policy.
2. `makePayment` — pays the approved amount.

## Create the package

Use the `bal new` command to create a new package.

```shell
bal new workflow_claim_processing
```

This creates a directory named `workflow_claim_processing` with a sample `main.bal` file. Replace its content as you follow the sections below.

## Define the claim record

The workflow takes an insurance claim as its input. Define it as a record:

```ballerina
import ballerina/io;
import ballerina/workflow;

type Claim record {|
    string claimId;
    string policyNo;
    decimal amount;
|};
```

Workflow inputs and outputs must be `anydata` — plain data such as records, strings, and numbers — because the engine stores them durably between steps.

## Write the activities

An activity is an ordinary function annotated with `@workflow:Activity`:

```ballerina
@workflow:Activity
function verifyClaim(Claim claim) returns boolean|error {
    io:println(string `Verifying claim ${claim.claimId} against policy ${claim.policyNo}`);
    return claim.amount <= 1000.0d;
}

@workflow:Activity
function makePayment(string claimId, decimal amount) returns string|error {
    io:println(string `Paying ${amount} for claim ${claimId}`);
    return string `PAY-${claimId}`;
}
```

In a real application, `verifyClaim` would call a policy service and `makePayment` would call a payment gateway. Here, they just print a message and return a value so the example is easy to run.

## Write the workflow function

The workflow function is annotated with `@workflow:Workflow` and receives a `workflow:Context` as its first parameter, followed by the input:

```ballerina
@workflow:Workflow
function claimProcessingWorkflow(workflow:Context ctx, Claim claim) returns string|error {
    boolean verified = check ctx->callActivity(verifyClaim, {"claim": claim});
    if !verified {
        return string `Claim ${claim.claimId} was rejected during verification.`;
    }
    string paymentRef = check ctx->callActivity(makePayment, {"claimId": claim.claimId, "amount": claim.amount});
    return string `Claim ${claim.claimId} approved. Payment reference: ${paymentRef}`;
}
```

A few things to note:

- Activities are invoked through `ctx->callActivity(...)` — never called directly. The context is how the engine records each step. The compiler enforces this and reports an error if you call an activity function directly.
- The arguments are passed as a map keyed by the activity's parameter names (for example, `{"claimId": ..., "amount": ...}` for `makePayment(string claimId, decimal amount)`).
- The workflow function itself must stay **deterministic** — all the real work (I/O, external calls, current time, random values) belongs in activities. This is what allows the engine to replay the function safely after a failure.

## Start the workflow

A workflow is started with `workflow:run`, which returns a unique ID for the new workflow instance. Use `workflow:getWorkflowResult` to wait for the result:

```ballerina
public function main() returns error? {
    string workflowId = check workflow:run(claimProcessingWorkflow,
            {claimId: "CLM-001", policyNo: "POL-1234", amount: 750.0d});
    io:println("Workflow started with ID: " + workflowId);

    // Blocks until the workflow completes or the timeout (in seconds) is reached.
    anydata result = check workflow:getWorkflowResult(workflowId, 60);
    io:println("Result: " + result.toString());
}
```

Note that `workflow:run` only *starts* the workflow — it returns the ID immediately, while the workflow runs in the background. `workflow:getWorkflowResult` then **blocks** until the workflow completes, or returns an error if it does not complete within the given timeout (in seconds). Waiting like this is convenient in a short demo, but workflows often run for hours or days — a real application should return the workflow ID to the caller and check the status later instead of blocking. The follow-up guides listed at the end show this pattern with an HTTP service.

## Configure the engine and run

The workflow module supports several execution modes. The simplest one for development is the in-memory engine, which needs no external server. Create a `Config.toml` file in the package directory:

```toml
[ballerina.workflow]
mode = "IN_MEMORY"
```

Now, run the package:

```shell
$ bal run
Workflow started with ID: 019ff622-bbf6-7180-baf7-0d113009196a
Verifying claim CLM-001 against policy POL-1234
Paying 750.0 for claim CLM-001
Result: Claim CLM-001 approved. Payment reference: PAY-CLM-001
```

The two activities ran in order, and the workflow returned its result.

## Make it durable

The in-memory engine is great for development, but the workflow state lives inside the program — if the program stops, the state is lost. For production-grade durability, the module runs on top of a <a href="https://temporal.io" target="_blank">Temporal</a> server, which persists every step of every workflow instance.

To try it locally, install the <a href="https://docs.temporal.io/cli" target="_blank">Temporal CLI</a> and start a development server:

```shell
temporal server start-dev
```

Then, change the mode in `Config.toml`, and give the integration its own task queue — every integration sharing a Temporal server must use a unique task queue so workers do not pick up each other's workflows:

```toml
[ballerina.workflow]
mode = "LOCAL"
taskQueue = "CLAIM_PROCESSING_QUEUE"
```

Run the program again with `bal run`. The behavior is the same, but now every step is recorded in the Temporal server, and you can watch the workflow execute in the Temporal Web UI at <a href="http://localhost:8233" target="_blank">http://localhost:8233</a>.

Durability shows when things go wrong: if the program stops while a workflow instance is in progress, the engine resumes that instance from its last recorded step as soon as a worker is running again — no work is repeated or lost. Resuming is always automatic; restarting the program is never how you resume a workflow.

>**Info:** Starting a workflow from `main()` keeps this demo small, but it is demo-only wiring: `workflow:run` starts a *new* workflow instance on every call, and since `main()` runs on each program start, restarting the demo leaves both the resumed instance and a new one running. In a real deployment, the program is a long-running service — its workers stay registered with the engine, and `workflow:run` is called from external triggers such as HTTP requests, as in the follow-up guides.

## Learn more

The complete source code of this example is available in the <a href="https://github.com/ballerina-guides/integration-samples/tree/main/workflow-claim-processing" target="_blank">integration samples</a> repository.

To continue exploring workflows:

- [Write a workflow with a human task](/learn/write-a-workflow-with-a-human-task/) — pause a workflow for a human decision.
- [Handle errors and replay failed activities in workflows](/learn/handle-errors-and-replay-failed-activities-in-workflows/) — automatic retries and manual replay.
- <a href="https://central.ballerina.io/ballerina/workflow/latest" target="_blank">The `ballerina/workflow` module on Ballerina Central</a>
