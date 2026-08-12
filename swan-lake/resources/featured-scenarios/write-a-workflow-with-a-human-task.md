---
layout: ballerina-write-a-workflow-human-task-guide-left-nav-pages-swanlake
title: Write a workflow with a human task
permalink: /learn/write-a-workflow-with-a-human-task/
description: This guide helps you write a Ballerina workflow that pauses for a human decision using human tasks and the workflow management API.
keywords: ballerina, programming language, workflow, human task, approval, management api, durable execution
active: write-a-workflow-with-a-human-task
intro: This guide helps you write a Ballerina workflow that pauses for a human decision using human tasks and the workflow management API.
---

Many business processes need a person in the middle: a manager approves an expense, an operator confirms a shipment, a doctor signs off on a report. With the [`ballerina/workflow`](https://central.ballerina.io/ballerina/workflow/latest) module, such a step is a **human task** — the workflow durably pauses at that point, for hours or days if needed, and resumes as soon as a person completes the task.

In this guide, you will extend a claim processing workflow with a manager approval step between two automated activities, and complete the approval through the module's built-in **management API** from a small web UI.

>**Info:** This guide builds on the same scenario as [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/). Read that first if you are new to workflows and activities.

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.13.4 (Swan Lake)](/downloads/) or greater
2. A text editor
    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. The <a href="https://docs.temporal.io/cli" target="_blank">Temporal CLI</a> to run a local workflow engine
4. A command terminal

## Understand the implementation

The claim approval workflow has three steps:

1. `verifyClaim` — an activity that checks the claim.
2. `approveClaim` — a **human task**; the workflow waits until a user with the `MANAGER` role approves or rejects the claim.
3. `makePayment` — an activity that pays the approved amount.

A human task needs two more pieces around it:

- An **HTTP service** so that claims can be submitted to start the workflow.
- A way for the manager to **see and complete** pending tasks. The workflow module ships an HTTP **management API** for exactly this — your task inbox UI (or any other tool) talks to it. In this guide, a minimal single-page React app lists the pending approvals and posts the decision.

## Create the package

Use the `bal new` command to create a new package.

```shell
bal new workflow_human_task
```

## Define the data types

The workflow takes a claim as input. The manager's decision is also typed — the record you expect from the human task defines the form a UI should render and is validated when the task is completed:

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/workflow;
import ballerina/workflow.management;

type Claim record {|
    string claimId;
    string policyNo;
    decimal amount;
|};

type ApprovalDecision record {|
    boolean approved;
    string comment;
|};
```

## Write the workflow with a human task

The human task sits between the two activities. Use `ctx->awaitHumanTask(...)` with a task name, the role the task is routed to, and a payload that tells the approver what they are deciding on:

```ballerina
@workflow:Workflow
function claimApprovalWorkflow(workflow:Context ctx, Claim claim) returns string|error {
    boolean verified = check ctx->callActivity(verifyClaim, {"claim": claim});
    if !verified {
        return string `Claim ${claim.claimId} was rejected during verification.`;
    }
    ApprovalDecision decision = check ctx->awaitHumanTask("approveClaim", "MANAGER",
            payload = {claimId: claim.claimId, policyNo: claim.policyNo, amount: claim.amount},
            title = string `Approve claim ${claim.claimId}`,
            description = "Review the claim and approve or reject the payment.");
    if !decision.approved {
        return string `Claim ${claim.claimId} rejected by manager: ${decision.comment}`;
    }
    string paymentRef = check ctx->callActivity(makePayment, {"claimId": claim.claimId, "amount": claim.amount});
    return string `Claim ${claim.claimId} approved. Payment reference: ${paymentRef}`;
}

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

When the workflow reaches `awaitHumanTask`, it suspends durably — no thread is blocked, no resources are held, and the wait survives restarts. The typed result (`ApprovalDecision`) does double duty: the engine derives a JSON form schema from it for UIs, and validates the submitted result against it.

Note that `verifyClaim` applies the same automated rule as the [previous guide](/learn/write-a-workflow-with-ballerina/) — claims over 1,000 are rejected outright. What is new is that a verified claim no longer goes straight to payment: the manager decides.

>**Tip:** You can pass `timeout = {days: 3}` to `awaitHumanTask` to bound the wait. If nobody completes the task in time, the call returns a `workflow:HumanTaskTimeoutError` that the workflow can handle — for example, by escalating.

## Expose the workflow as a service

Add an HTTP service so claims can be submitted and their status checked:

```ballerina
service /claims on new http:Listener(8080) {

    resource function post .(Claim claim) returns json|error {
        string workflowId = check workflow:run(claimApprovalWorkflow, claim);
        return {claimId: claim.claimId, workflowId, status: "PENDING_APPROVAL"};
    }

    resource function get [string workflowId]() returns json|error {
        // Check the status first instead of blocking on the result:
        // getWorkflowResult waits until the workflow completes.
        management:WorkflowExecutionInfo info = check management:getWorkflowInfo(workflowId);
        if info.status != "COMPLETED" {
            return {workflowId, status: info.status};
        }
        anydata result = check workflow:getWorkflowResult(workflowId);
        return {workflowId, status: info.status, result: check result.cloneWithType(json)};
    }
}
```

The status resource deliberately does **not** call `workflow:getWorkflowResult` right away — that function blocks until the workflow completes, and a claim can wait on the manager for days. Instead, it checks the workflow status through `management:getWorkflowInfo` and fetches the result only once the workflow has completed, so the resource always responds immediately.

## Enable the management API

Ballerina does not ship a task inbox application — instead, the workflow module exposes a **management API** over HTTP, and you point any UI or tool at it. Importing `ballerina/workflow.management` (already done above) brings the API in; enable it in `Config.toml`:

```toml
# Workflow engine — runs against a local Temporal development server.
# Each integration needs its own task queue so samples sharing the same
# Temporal server do not conflict.
[ballerina.workflow]
mode = "LOCAL"
taskQueue = "CLAIM_APPROVAL_QUEUE"

# Management API — exposed at http://localhost:8234/workflow/
[ballerina.workflow.management]
enableManagementApi = true
port = 8234
enableBasicAuth = false
```

The `taskQueue` names the queue this integration's worker serves. Every integration sharing a Temporal server must use a unique task queue — otherwise workers pick up each other's workflows and fail.

This serves the API at `http://localhost:8234/workflow/`. The endpoints used for human tasks are:

- `GET /workflow/human-tasks?status=PENDING` — list pending tasks.
- `GET /workflow/human-tasks/{taskId}` — task details, including the payload and the form schema.
- `POST /workflow/human-tasks/{taskId}/complete` — complete a task with a body such as `{"result": {"approved": true, "comment": "..."}}`.

Requests carry the caller's identity in two headers: `x-user-id` and `x-user-roles`. The role given to `awaitHumanTask` — `MANAGER` in this guide — is used to *filter* tasks: a manager's inbox queries with `x-user-roles: MANAGER` and sees only the tasks routed to that role, and the completion is recorded against the `x-user-id`. The workflow module itself does not authenticate or authorize these callers — it trusts the headers and expects authentication to be handled outside the module. In a real deployment, your identity provider authenticates the user, and your backend or gateway sets the identity headers from the logged-in user.

>**Caution:** `enableBasicAuth = false` leaves the management API unauthenticated and is for **local development only** — never expose an unauthenticated management API. In production, enable TLS and one of basic, JWT, OAuth2, or API-key authentication. For example, with basic authentication, callers must present credentials from the configured user store:

```toml
[ballerina.workflow.management]
enableManagementApi = true
enableBasicAuth = true

[[ballerina.auth.users]]
username = "admin"
password = "<strong-password>"
scopes = ["admin"]
```

## Try it out

Start a local Temporal development server in one terminal:

```shell
temporal server start-dev
```

Run the package in another terminal:

```shell
bal run
```

Submit a claim:

```shell
$ curl -X POST http://localhost:8080/claims \
       -H 'Content-Type: application/json' \
       -d '{"claimId": "CLM-100", "policyNo": "POL-9876", "amount": 750.0}'
{"claimId":"CLM-100", "workflowId":"019ff629-dbc0-7ed1-a35e-2f91c5811782", "status":"PENDING_APPROVAL"}
```

The workflow verifies the claim and pauses at the human task. Checking the status now shows the workflow is still running (durably waiting for the manager):

```shell
$ curl http://localhost:8080/claims/<workflowId>
{"workflowId":"...", "status":"RUNNING"}
```

List the pending tasks as a manager:

```shell
curl 'http://localhost:8234/workflow/human-tasks?status=PENDING' -H 'x-user-roles: MANAGER'
```

Complete the task using the `taskId` from the listing:

```shell
$ curl -X POST 'http://localhost:8234/workflow/human-tasks/<taskId>/complete' \
       -H 'Content-Type: application/json' \
       -H 'x-user-id: alice' -H 'x-user-roles: MANAGER' \
       -d '{"result": {"approved": true, "comment": "Verified with policy holder"}}'
{"success":true, "completedBy":"alice", "completedAt":"..."}
```

The workflow resumes immediately and pays the claim:

```shell
$ curl http://localhost:8080/claims/<workflowId>
{"workflowId":"...", "status":"COMPLETED", "result":"Claim CLM-100 approved. Payment reference: PAY-CLM-100"}
```

## Add a simple dashboard UI

Anything that can call the management API can be a task inbox or a monitoring dashboard. The integration samples repository includes a minimal single-page React dashboard — <a href="https://github.com/ballerina-guides/integration-samples/tree/main/workflow-dashboard" target="_blank">`workflow-dashboard`</a> — shared by all the workflow samples, with three tabs backed by the endpoints you used above:

- **Workflows** — lists the workflow instances (`GET /workflow/workflows`); opening one shows the workflow input and every activity with its input, output, started time, and status (`GET .../history` and `GET .../activity-tree`).
- **Human Tasks** — the pending approvals, with Approve/Reject posting to the `complete` endpoint.
- **Failed Activities** — failed activities waiting for review (covered in the [error-handling guide](/learn/handle-errors-and-replay-failed-activities-in-workflows/)).

Listings are namespace-wide, so workflows and tasks from *other* integrations sharing the same Temporal server show up too. The dashboard hides those by default — an item counts as active only if it belongs to this integration's task queue and its workflow type has an active worker (checked through `GET /workflow/definitions`). Ticking **Show inactive integrations** lists them grayed out, labeled with the reason, and with their actions disabled.

Clone the samples repository and start the dashboard with this integration's task queue:

```shell
git clone https://github.com/ballerina-guides/integration-samples.git
cd integration-samples/workflow-dashboard
npm install
VITE_TASK_QUEUE=CLAIM_APPROVAL_QUEUE npm run dev
```

Open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>, submit a claim, watch it progress in the **Workflows** tab, and approve it under **Human Tasks**.

## Learn more

The complete source code of this example is available in the <a href="https://github.com/ballerina-guides/integration-samples/tree/main/workflow-human-task" target="_blank">integration samples</a> repository.

To continue exploring workflows:

- [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/) — the basics of workflows and activities.
- [Handle errors and replay failed activities in workflows](/learn/handle-errors-and-replay-failed-activities-in-workflows/) — automatic retries and manual replay.
- <a href="https://central.ballerina.io/ballerina/workflow/latest" target="_blank">The `ballerina/workflow` module on Ballerina Central</a>