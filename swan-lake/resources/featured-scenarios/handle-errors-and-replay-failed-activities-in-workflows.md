---
layout: ballerina-workflow-error-handling-guide-left-nav-pages-swanlake
title: Handle errors and replay failed activities in workflows
permalink: /learn/handle-errors-and-replay-failed-activities-in-workflows/
description: This guide explains how activity failures are handled in Ballerina workflows using automatic retries and manual replay of failed activities.
keywords: ballerina, programming language, workflow, error handling, retry, replay, store and forward, durable execution
active: handle-errors-and-replay-failed-activities-in-workflows
intro: This guide explains how activity failures are handled in Ballerina workflows using automatic retries and manual replay of failed activities.
---

Failures are normal in integrations: a service is briefly down, a network call times out, or the input itself is wrong. What matters is what happens next. Because a [`ballerina/workflow`](https://central.ballerina.io/ballerina/workflow/latest) workflow records the result of every completed activity durably, a failure never throws away the work already done — the workflow can retry just the failed step, automatically or after a human fixes the problem.

In this guide, you will write a claim payout workflow whose activities recover from failures in two ways:

- **Automatic retries** — for transient failures, such as an unavailable service.
- **Manual replay** — for failures that need a human to look at them, such as bad input data.

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.13.4 (Swan Lake)](/downloads/) or greater
2. A text editor
    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. The <a href="https://docs.temporal.io/cli" target="_blank">Temporal CLI</a> to run a local workflow engine
4. A command terminal

>**Info:** This guide assumes you know the basics of workflows and activities. If you are new to them, start with [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/).

## Understand the implementation

The claim payout workflow runs three activities in sequence:

1. `convertCurrency` — converts the payout to the local currency. It calls a (simulated) flaky exchange-rate service, so it uses an **automatic retry policy**.
2. `depositPayout` — transfers the money. A malformed account number makes it fail in a way no retry can fix, so it uses a **manual review policy**: the workflow suspends until an operator retries it, corrects its input, or rejects it.
3. `notifyCustomer` — informs the customer once the deposit succeeds.

## How activity errors behave by default

By default, an activity is attempted once, and its error comes back to the workflow as an ordinary Ballerina error value. You handle it like any other error — propagate it with `check`, or handle it locally and take a fallback path:

```ballerina
string|error result = ctx->callActivity(sendEmail, {"to": email, "message": message});
if result is error {
    // Fallback: try another channel instead of failing the workflow.
    result = check ctx->callActivity(sendSms, {"phone": phone, "message": message});
}
```

If the error propagates out of the workflow function, the workflow instance is marked as failed. Everything beyond that default — retrying, backing off, waiting for a human — is declared per activity with the `retryPolicy` argument of `callActivity`.

## Retry transient failures automatically

Transient failures usually go away if you try again a little later. Declare an automatic retry policy on the activity call:

```ballerina
decimal localAmount = check ctx->callActivity(convertCurrency,
        {"claimId": request.claimId, "amount": request.amount, "currency": request.currency},
        retryPolicy = {maxRetries: 3, retryDelay: 2.0, retryBackoff: 2.0});
```

This retries the failed activity up to 3 times, waiting 2 seconds before the first retry and doubling the delay each time (2s, 4s, 8s). Only the activity is re-executed — the workflow itself, and every activity that already completed, are untouched. If all retries fail, the final error reaches the workflow as a normal error value.

The activity in this guide simulates a flaky service that, for each claim, fails twice and succeeds on the third attempt:

```ballerina
map<int> convertAttempts = {};

@workflow:Activity
function convertCurrency(string claimId, decimal amount, string currency) returns decimal|error {
    int attempts = (convertAttempts[claimId] ?: 0) + 1;
    convertAttempts[claimId] = attempts;
    if attempts < 3 {
        return error(string `Exchange rate service is unavailable (attempt ${attempts})`);
    }
    io:println(string `Converted ${amount} ${currency} on attempt ${attempts}`);
    return currency == "USD" ? amount * 300.0d : amount;
}
```

## Suspend for manual review and replay

Some failures cannot be fixed by retrying — a payment to a malformed account number fails every time. For those, give `retryPolicy` a **role name** instead of a retry configuration:

```ballerina
string depositRef = check ctx->callActivity(depositPayout,
        {"accountNo": request.accountNo, "amount": localAmount},
        retryPolicy = "OPS");
```

Now, when `depositPayout` fails, the workflow does not fail. Instead, the engine creates a **review task** for users with the `OPS` role, and the workflow durably suspends — for as long as it takes. The operator sees the error message and the exact input the activity was called with, and makes one of three decisions:

- **Proceed** — re-run the activity with the original input (the failure was environmental).
- **Proceed with input** — re-run the activity with corrected input (the data was wrong).
- **Reject** — give up; the failure is delivered to the workflow as an error.

The decisions are made through the workflow **management API**. Enable it in `Config.toml` (and import `ballerina/workflow.management` in the code):

```toml
# Workflow engine — runs against a local Temporal development server.
# Each integration needs its own task queue so samples sharing the same
# Temporal server do not conflict.
[ballerina.workflow]
mode = "LOCAL"
taskQueue = "CLAIM_PAYOUT_QUEUE"

# Management API — exposed at http://localhost:8234/workflow/
[ballerina.workflow.management]
enableManagementApi = true
port = 8234
enableBasicAuth = false
```

>**Caution:** `enableBasicAuth = false` leaves the management API unauthenticated and is for **local development only**. See [Write a workflow with a human task](/learn/write-a-workflow-with-a-human-task/) for securing the management API in production.

The relevant endpoints under `http://localhost:8234/workflow/` are:

- `GET /review-activities?status=PENDING` — list failed activities waiting for review.
- `GET /review-activities/{taskId}` — details: the error message, the activity input, and a form schema.
- `POST /review-activities/{taskId}/proceed` — retry with the original input.
- `POST /review-activities/{taskId}/proceed-with-input` — retry with a corrected input, e.g. `{"input": {"accountNo": "ACC-12345", "amount": 225000.0}}`.
- `POST /review-activities/{taskId}/reject` — fail the activity; the workflow sees the error.

Like human tasks, review requests carry the caller's identity in the `x-user-id` and `x-user-roles` headers. The role given to `retryPolicy` — `OPS` here — is used to *filter* the review tasks: an operations dashboard queries with `x-user-roles: OPS` and sees only the failures routed to that role, and the decision is recorded against the `x-user-id`. The workflow module itself does not authenticate or authorize these callers — it trusts the headers and expects authentication to be handled outside the module, for example by a gateway or backend that sets them from the logged-in user.

## Every activity is a store-and-forward stage

A classic way to build reliable message flows is **store and forward**: persist the incoming message first, then forward it to the target system, retrying until it succeeds. The message store guarantees nothing is lost while the target is down.

A durable workflow gives you the same guarantee — but at **every step**, not just at the front door. Each `callActivity` is a store-and-forward stage of its own:

- The activity's input is derived from durably **stored** state, and its result is durably **stored** on success — that is the "store."
- The retry policy — automatic, or manual through a review task — keeps re-attempting delivery to the target system — that is the "forward."

So instead of one message store feeding one forwarder, the payout workflow above is effectively three store-and-forward stages chained together: convert, deposit, notify. When `depositPayout` fails, the already-completed `convertCurrency` result stays safely stored and is never recomputed; when the operator replays the deposit, the pipeline continues from exactly that point and `notifyCustomer` runs next. You get a reliable, replayable, multi-stage pipeline by writing a plain Ballerina function — no message stores, queues, or forwarding services to assemble and operate yourself, and the full pipeline state is visible in one place per claim.

## Try it out

The complete example, including an HTTP service to submit payouts, is in the <a href="https://github.com/ballerina-guides/integration-samples/tree/main/workflow-error-handling" target="_blank">integration samples</a> repository. Clone it and start a local Temporal development server in one terminal:

```
$ temporal server start-dev
```

Run the Ballerina service in another terminal:

```
$ cd workflow-error-handling/ballerina
$ bal run
```

Submit a payout with a **bad account number** (a valid one starts with `ACC-`):

```
$ curl -X POST http://localhost:8080/payouts \
       -H 'Content-Type: application/json' \
       -d '{"claimId": "CLM-001", "accountNo": "12345", "amount": 750.0, "currency": "USD"}'
```

Watch the service logs: `convertCurrency` fails twice and recovers on the third automatic retry. Then `depositPayout` fails, and the workflow suspends for review:

```
$ curl 'http://localhost:8234/workflow/review-activities?status=PENDING' -H 'x-user-roles: OPS'
```

Replay it with the corrected account number, using the `taskId` from the listing:

```
$ curl -X POST 'http://localhost:8234/workflow/review-activities/<taskId>/proceed-with-input' \
       -H 'Content-Type: application/json' -H 'x-user-id: olivia' -H 'x-user-roles: OPS' \
       -d '{"input": {"accountNo": "ACC-12345", "amount": 225000.0}}'
```

The deposit succeeds with the corrected input, the customer is notified, and the workflow completes:

```
$ curl http://localhost:8080/payouts/<workflowId>
{"workflowId":"...", "status":"COMPLETED", "result":"Claim CLM-001 paid. Deposit reference: DEP-ACC-12345"}
```

The samples repository also includes a minimal single-page React dashboard shared by all the workflow samples — <a href="https://github.com/ballerina-guides/integration-samples/tree/main/workflow-dashboard" target="_blank">`workflow-dashboard`</a>. Run it with this integration's task queue and open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>:

```
$ cd ../workflow-dashboard
$ npm install
$ VITE_TASK_QUEUE=CLAIM_PAYOUT_QUEUE npm run dev
```

Its **Workflows** tab lists the workflow instances, and the detail view shows the workflow input and every activity with its input, output, started time, and status — including the failed `depositPayout` attempt, the review decision, and the replayed attempt. The **Failed Activities** tab lists the pending reviews with their error messages, lets you edit the activity input, and posts the replay decision. Items from other integrations sharing the same Temporal server are hidden by default; the **Show inactive integrations** filter lists them grayed out with the reason (their integration is not active) and their actions disabled.

## Learn more

To continue exploring workflows:

- [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/) — the basics of workflows and activities.
- [Write a workflow with a human task](/learn/write-a-workflow-with-a-human-task/) — pause a workflow for a human decision.
- <a href="https://central.ballerina.io/ballerina/workflow/latest" target="_blank">The `ballerina/workflow` module on Ballerina Central</a>
