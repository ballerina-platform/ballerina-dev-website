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

1. [Ballerina 2201.14.0 (Swan Lake Update 14)](/downloads/) or greater
2. A text editor
    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. The <a href="https://docs.temporal.io/cli" target="_blank">Temporal CLI</a> to run a local workflow engine
4. A command terminal

## Understand the implementation

The claim approval workflow has three steps:

1. `verifyClaim` — an activity that checks the claim.
2. `approveClaim` — a **human task**; the workflow waits until a user with the `MANAGER` role approves or rejects the claim. The task also names a `CLAIMS_ADMIN` administrator role, which can reassign it or change its deadline if it gets stuck.
3. `makePayment` — an activity that pays the approved amount.

A human task needs two more pieces around it:

- An **HTTP service** so that claims can be submitted to start the workflow.
- A way for the manager to **see and complete** pending tasks. The workflow module ships an HTTP **management API** for exactly this — your task inbox UI (or any other tool) talks to it. In this guide, a minimal single-page React app lists the pending approvals and posts the decision.

## Create the package

Use the `bal new` command to create a new package.

```
$ bal new workflow_human_task
```

## Define the data types

The workflow takes a claim as input. The manager's decision is also typed — the record you expect from the human task defines the form a UI should render and is validated when the task is completed:

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/workflow;
import ballerina/workflow.management;
// Serves the management REST API; the service starts on import.
import ballerina/workflow.management.rest as _;

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

The human task sits between the two activities. Use `ctx->awaitHumanTask(...)` with a task name, the input that tells the approver what they are deciding on, and a definition of who may decide it:

```ballerina
@workflow:Workflow
function claimApprovalWorkflow(workflow:Context ctx, Claim claim) returns string|error {
    boolean verified = check ctx->callActivity(verifyClaim, {"claim": claim});
    if !verified {
        return string `Claim ${claim.claimId} was rejected during verification.`;
    }
    ApprovalDecision decision = check ctx->awaitHumanTask("approveClaim",
            {claimId: claim.claimId, policyNo: claim.policyNo, amount: claim.amount},
            userRoles = "MANAGER",
            administratorRoles = "CLAIMS_ADMIN",
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

### Who may decide, and who may administer

The arguments after the task input describe the task's **audience** — the people allowed to answer it — and its **administrators**:

| Field | Meaning |
|---|---|
| `userRoles` | Role(s) allowed to decide the task. Write `userRoles = ()` when only `users` may. |
| `users` | User ID(s) allowed to decide it, whatever their roles. |
| `excludedRoles` / `excludedUsers` | Subtracted from the audience — for example, to keep a claim's submitter from approving it. |
| `administratorRoles` / `administratorUsers` | Who administers the task: they see it, and may reassign it, move or clear its deadline, fail it, or complete it themselves. |

Each of these takes a single string or an array. At least one of `userRoles` and `users` must name somebody: the engine refuses to create a task that nobody could answer, failing the call with `Human task '<name>' must name 'userRoles' or 'users'` rather than leaving the workflow waiting forever. Write `userRoles = ()` only when `users` names the deciders instead.

An administrator is the escape hatch for a task that is stuck: the only manager on the audience left the company, or the deadline needs pushing out. A completion made by an administrator is recorded as one — the task's `completedAs` reads `"administrator"` instead of `"audience"` — so the audit trail always says in what capacity a person acted.

>**Note:** The same audience and administrator fields describe both kinds of decision in the module — a human task, and the review raised by a failing activity. Learn one shape and it applies to both.

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

Ballerina does not ship a task inbox application — instead, the workflow module exposes a **management API** over HTTP, and you point any UI or tool at it. The HTTP service lives in its own submodule: importing `ballerina/workflow.management.rest` (already done above) starts it, and `ballerina/workflow.management` is the in-process API the service resource used earlier. Enable the service in `Config.toml`:

```toml
# Workflow engine — runs against a local Temporal development server.
# Each integration needs its own task queue so samples sharing the same
# Temporal server do not conflict.
[ballerina.workflow]
mode = "LOCAL"
taskQueue = "CLAIM_APPROVAL_QUEUE"

# Management API — exposed at http://localhost:8234/workflow/
[ballerina.workflow.management.rest]
enableManagementApi = true
port = 8234
enableBasicAuth = false
```

The `taskQueue` names the queue this integration's worker serves. Every integration sharing a Temporal server must use a unique task queue — otherwise workers pick up each other's workflows and fail.

This serves the API at `http://localhost:8234/workflow/`. The endpoints used for human tasks are:

- `GET /workflow/human-tasks?status=PENDING` — list pending tasks.
- `GET /workflow/human-tasks/{taskId}` — task details, including the task input (`taskInput`) and the form schema.
- `POST /workflow/human-tasks/{taskId}/complete` — complete a task with a body such as `{"result": {"approved": true, "comment": "..."}}`.
- `POST /workflow/human-tasks/{taskId}/reassign` — administrators only: hand the task to a different audience, e.g. `{"userRoles": ["SENIOR_MANAGER"]}`.
- `POST /workflow/human-tasks/{taskId}/deadline` — administrators only: set the deadline to `{"timeoutMillis": 7200000}`, or `null` to clear it.

Every task record answers two questions for the calling identity, so a UI can render the right controls without duplicating the rules: `canComplete` (may this caller decide it?) and `canAdminister` (may they administer it?). A completed task also reports `completedBy`, `completedAt`, and `completedAs` — `"audience"` or `"administrator"`.

Requests carry the caller's identity in two headers: `x-user-id` and `x-user-roles`. The task's audience decides what that identity may see and do: a manager's inbox queries with `x-user-roles: MANAGER` and sees only the tasks whose audience includes that role, and the completion is recorded against the `x-user-id`. A caller who is neither in the audience nor an administrator is refused — the task is not listed, and fetching it by ID returns an authorization error even if the caller can see the parent workflow. The workflow module itself does not authenticate or authorize these callers — it trusts the headers and expects authentication to be handled outside the module. In a real deployment, your identity provider authenticates the user, and your backend or gateway sets the identity headers from the logged-in user.

>**Caution:** `enableBasicAuth = false` leaves the management API unauthenticated and is for **local development only** — never expose an unauthenticated management API. In production, enable TLS and one of basic, JWT, OAuth2, or API-key authentication. For example, with basic authentication, callers must present credentials from the configured user store:

```toml
[ballerina.workflow.management.rest]
enableManagementApi = true
enableBasicAuth = true

[[ballerina.auth.users]]
username = "admin"
password = "<strong-password>"
scopes = ["admin"]
```

## Try it out

Start a local Temporal development server in one terminal:

```
$ temporal server start-dev
```

Run the package in another terminal:

```
$ bal run
```

Submit a claim:

```
$ curl -X POST http://localhost:8080/claims \
       -H 'Content-Type: application/json' \
       -d '{"claimId": "CLM-100", "policyNo": "POL-9876", "amount": 750.0}'
{"claimId":"CLM-100", "workflowId":"019ff629-dbc0-7ed1-a35e-2f91c5811782", "status":"PENDING_APPROVAL"}
```

The workflow verifies the claim and pauses at the human task. Checking the status now shows the workflow is still running (durably waiting for the manager):

```
$ curl http://localhost:8080/claims/<workflowId>
{"workflowId":"...", "status":"RUNNING"}
```

List the pending tasks as a manager:

```
$ curl 'http://localhost:8234/workflow/human-tasks?status=PENDING' -H 'x-user-roles: MANAGER'
```

### Administer the task

The task named `CLAIMS_ADMIN` as its administrator. A caller in that role sees the task with `canAdminister: true`, and can move its deadline or hand it to somebody else:

```
$ curl -X POST 'http://localhost:8234/workflow/human-tasks/<taskId>/deadline' \
       -H 'Content-Type: application/json' \
       -H 'x-user-id: root' -H 'x-user-roles: CLAIMS_ADMIN' \
       -d '{"timeoutMillis": 7200000}'
{"success":true, "action":"extendDeadline", "administeredBy":"root", "administeredAt":"..."}

$ curl -X POST 'http://localhost:8234/workflow/human-tasks/<taskId>/reassign' \
       -H 'Content-Type: application/json' \
       -H 'x-user-id: root' -H 'x-user-roles: CLAIMS_ADMIN' \
       -d '{"userRoles": ["SENIOR_MANAGER"]}'
{"success":true, "action":"reassign", "administeredBy":"root", "administeredAt":"..."}
```

The reassignment takes effect at once: the task's audience is now `SENIOR_MANAGER`, and the original manager is refused.

```
$ curl 'http://localhost:8234/workflow/human-tasks/<taskId>' -H 'x-user-roles: MANAGER'
{"error":{"message":"Unauthorized: caller is not allowed to access this task"}}
```

Every administrative act travels with the task's own history, so the audit trail records who reassigned it and when.

### Complete the task

The task now belongs to `SENIOR_MANAGER`, so complete it as somebody in that role. The submitted result is validated against `ApprovalDecision` before the workflow sees it:

```
$ curl -X POST 'http://localhost:8234/workflow/human-tasks/<taskId>/complete' \
       -H 'Content-Type: application/json' \
       -H 'x-user-id: bob' -H 'x-user-roles: SENIOR_MANAGER' \
       -d '{"result": {"approved": true, "comment": "Verified with policy holder"}}'
{"success":true, "completedBy":"bob", "completedAt":"..."}
```

Fetching the task now reports `"completedAs": "audience"` — bob decided it as a member of the audience, not as an administrator. (Had you skipped the reassignment, `alice` with `x-user-roles: MANAGER` would have completed it just the same.)

The workflow resumes immediately and pays the claim:

```
$ curl http://localhost:8080/claims/<workflowId>
{"workflowId":"...", "status":"COMPLETED", "result":"Claim CLM-100 approved. Payment reference: PAY-CLM-100"}
```

## Add a simple dashboard UI

Anything that can call the management API can be a task inbox or a monitoring dashboard. The integration samples repository includes a minimal single-page React dashboard — <a href="https://github.com/ballerina-guides/integration-samples/tree/main/workflow-dashboard" target="_blank">`workflow-dashboard`</a> — shared by all the workflow samples, with three tabs backed by the endpoints you used above:

- **Workflows** — lists the workflow instances (`GET /workflow/workflows`); opening one shows the workflow input and every activity with its input, output, started time, and status (`GET .../history` and `GET .../activity-tree`).
- **Human Tasks** — the pending approvals, with Approve/Reject posting to the `complete` endpoint. Each card shows the task's audience and administrators; the Approve/Reject buttons follow `canComplete`, and an **Administer** panel — reassign, set deadline — appears only when the caller's `canAdminister` is true.
- **Failed Activities** — failed activities waiting for review (covered in the [error-handling guide](/learn/handle-errors-and-replay-failed-activities-in-workflows/)).

Listings are namespace-wide, so workflows and tasks from *other* integrations sharing the same Temporal server show up too. The dashboard hides those by default — an item counts as active only if it belongs to this integration's task queue and its workflow type has an active worker (checked through `GET /workflow/definitions`). Ticking **Show inactive integrations** lists them grayed out, labeled with the reason, and with their actions disabled.

Clone the samples repository and start the dashboard with this integration's task queue:

```
$ git clone https://github.com/ballerina-guides/integration-samples.git
$ cd integration-samples/workflow-dashboard
$ npm install
$ VITE_TASK_QUEUE=CLAIM_APPROVAL_QUEUE npm run dev
```

Open <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>, submit a claim, watch it progress in the **Workflows** tab, and approve it under **Human Tasks**. The dashboard sends a fixed identity (`x-user-id: admin` with the `MANAGER`, `OPS`, `CLAIMS_ADMIN` and `OPS_LEAD` roles) so that both the audience and the administrator controls are visible; edit `HEADERS` in `src/App.jsx` to see the task as somebody else.

## Learn more

The complete source code of this example is available in the <a href="https://github.com/ballerina-guides/integration-samples/tree/main/workflow-human-task" target="_blank">integration samples</a> repository.

To continue exploring workflows:

- [Write a workflow with Ballerina](/learn/write-a-workflow-with-ballerina/) — the basics of workflows and activities.
- [Handle errors and replay failed activities in workflows](/learn/handle-errors-and-replay-failed-activities-in-workflows/) — automatic retries and manual replay.
- <a href="https://central.ballerina.io/ballerina/workflow/latest" target="_blank">The `ballerina/workflow` module on Ballerina Central</a>