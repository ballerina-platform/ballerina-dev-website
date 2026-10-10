---
layout: ballerina-left-nav-release-notes
title: 2201.14.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.14.0/
active: 2201.14.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.14.0
    - /downloads/swan-lake-release-notes/2201.14.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.14.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 14 (2201.14.0)

<em> Swan Lake Update 14 (2201.14.0) is the fourteenth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em>

## Update Ballerina

Update your current Ballerina installation directly to 2201.14.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Runtime updates

### Improvements

#### Java 25 support

The jBallerina runtime is now upgraded to support Java 25 LTS, the latest long-term support release of the Java SE platform, and the Ballerina distribution now ships with a Java 25 runtime.

## Ballerina library updates

### New features

#### Durable workflows with the `workflow` package

The `ballerina/workflow` package is now generally available with a stable `1.0.0` version. It lets you write long-running business processes as ordinary Ballerina functions and execute them durably. The workflow engine checkpoints every step and replays the recorded history to recover from failures, so a crashed or redeployed program resumes from where it left off instead of starting over.

- `@workflow:Workflow` - A durable function that orchestrates a business process. It must contain only orchestration logic, such as control flow, calling activities, and waiting for people or external data.
- `@workflow:Activity` - A function that performs a single non-deterministic operation, such as an API call, a database query, or sending an email. Once an activity completes, its result is recorded and is never re-executed during replay.

The example below fulfills an order after a manager approves it. The `ctx->awaitHumanTask` call creates a task in the task inbox for the `MANAGER` role and durably pauses the workflow until a person submits a decision.

```ballerina
import ballerina/workflow;

type OrderRequest record {|
    string orderId;
    string item;
    decimal amount;
|};

type ApprovalDecision record {|
    boolean approved;
    string? reason;
|};

@workflow:Activity
function fulfillOrder(string orderId, string item) returns string|error {
    // Call the fulfillment system.
    return "FULFILLED-" + orderId;
}

@workflow:Workflow
function processOrder(workflow:Context ctx, OrderRequest request) returns string|error {
    if request.amount > 500d {
        // Creates a task in the inbox and durably pauses until a manager decides.
        ApprovalDecision decision = check ctx->awaitHumanTask("approveOrder",
                {orderId: request.orderId, amount: request.amount.toString()},
                userRoles = "MANAGER", title = string `Approve order ${request.orderId}`);
        if !decision.approved {
            return "REJECTED: " + (decision.reason ?: "no reason given");
        }
    }
    return check ctx->callActivity(fulfillOrder, {"orderId": request.orderId, "item": request.item});
}
```

Start a workflow instance from any entry point, such as an HTTP service, a scheduled job, a message consumer, or the `main` function. Pending tasks are listed and completed through the `ballerina/workflow.management` submodule or its HTTP management API, so the approval is authorized against the task's roles rather than delivered as raw data.

```ballerina
string workflowId = check workflow:run(processOrder, {orderId: "ORD-001", item: "laptop", amount: 1200});

management:HumanTaskGroup[] tasks = check management:listPendingHumanTasks(workflowId);
check workflow:completeHumanTask(tasks[0].taskIds[0], {approved: true, reason: ()});
```

Key features include:

- Human-in-the-loop tasks with `ctx->awaitHumanTask`, including role-based assignment, timeouts, and typed results.
- Reviewing failed activities as tasks, so a person can retry, retry with edited input, or fail the step, and automatic retries for transient failures. Both are configured through the `retryPolicy` of `ctx->callActivity`, and the `approvalPolicy` gates an activity behind an approval before it runs.
- Waiting for external events, such as payment confirmations, with `future`-typed event parameters and `workflow:sendData`, and waiting for several events at once with `ctx->await`, including wait-for-all, first-wins, quorum (N of M), and deadline-based waits.
- Composing workflows with child workflows via `ctx->runChildWorkflow` and `ctx->waitForChildWorkflow`.
- Handling activity errors as plain Ballerina values to retry, fall back, or compensate.
- Running in the `IN_MEMORY` mode for local development without a server, and connecting to a Temporal server in production. The default `LOCAL` mode expects a development server at `localhost:7233`.

  ```toml
  [ballerina.workflow]
  mode = "SELF_HOSTED"
  url = "temporal.mycompany.com:7233"
  namespace = "default"
  taskQueue = "my-task-queue"
  ```

For more information, see the [Get Started](https://github.com/ballerina-platform/module-ballerina-workflow/blob/v1.0.0/docs/get-started.md) and [Key Concepts](https://github.com/ballerina-platform/module-ballerina-workflow/blob/v1.0.0/docs/key-concepts.md) guides, and the [examples](https://github.com/ballerina-platform/module-ballerina-workflow/tree/v1.0.0/examples).

#### Stable releases

The following packages are now generally available with stable `1.0.0` versions.

- `ballerina/otel` - Publish traces and metrics to any OTLP-compatible backend over `grpc` or `http/protobuf`.

  ```ballerina
  import ballerina/otel as _;
  ```

  ```toml
  [ballerina.observe]
  tracingEnabled = true
  tracingProvider = "otel"

  [ballerina.otel]
  tracesEndpoint = "http://localhost:4317"
  ```

- `ballerina/data.yaml` - Parse YAML into Ballerina types and serialize Ballerina values to YAML. This replaces the `ballerina/yaml` package, which is no longer packed with the distribution.
- `ballerina/data.csv` - Parse CSV data into Ballerina types and serialize Ballerina values to CSV.

#### `http` package

- Added SOCKS4 and SOCKS5 proxy support to the HTTP client via the new optional `protocol` field in `http:ProxyConfig`.

  ```ballerina
  http:Client httpClient = check new ("https://api.example.com",
      proxy = {host: "localhost", port: 1080, protocol: http:SOCKS5}
  );
  ```

- Added the `http2MaxActiveStreams` listener configuration to limit the maximum number of concurrent HTTP/2 streams per connection. The default value is `100`.

  ```ballerina
  listener http:Listener httpListener = new (9090, http2MaxActiveStreams = 200);
  ```

- Deprecated the `proxy` field of `http:ClientHttp1Settings`. Use the `proxy` field of `http:ClientConfiguration`, which applies to all HTTP versions.

### Improvements

#### Netty 4.2 support

Netty 4.1 reaches its [end of life on July 1, 2027](https://netty.io/news/2026/09/09/4-1-EOL-announcement.html), after which no further releases, including security fixes, will be made for the 4.1 series. Therefore, the `http`, `grpc`, `websocket`, `tcp`, and `udp` packages are now upgraded to Netty 4.2 (4.2.18.Final). All packages under the `ballerina` and `ballerinax` organizations that depend on Netty have also been migrated.

## Backward-incompatible changes

### Runtime changes

The switch to Java 25 may have an impact on Ballerina interoperability usage if there are incompatible changes. For more details, refer to the [Java 25 release notes](https://www.oracle.com/java/technologies/javase/25-relnote-issues.html).

### Ballerina library changes

- The `ballerina/yaml` package is removed from the distribution. Migrate to the `ballerina/data.yaml` package.

  ```ballerina
  import ballerina/data.yaml;

  Book book = check yaml:parseString(yamlContent);
  string yamlString = check yaml:toYamlString(book);
  ```

- Ballerina library packages now depend on Netty 4.2. Packages from other organizations that bundle Netty 4.1 will conflict with Netty 4.2 at runtime and may fail with unexpected errors. Such packages must be migrated to Netty 4.2 and released for Swan Lake Update 14.
- Host name verification is now enabled by default for `tcp` clients. To disable it, set `verifyHostName: false` in `tcp:ClientSecureSocket`.

## Bug fixes

To view all the bug fixes related to the compiler, runtime, and developer tools, see the [GitHub milestone for Swan Lake Update 14 (2201.14.0) for Ballerina platform](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue%20state%3Aclosed%20milestone%3A2201.14.0%20label%3AType%2FBug).

To view all the bug fixes related to the Ballerina library, see the [GitHub milestone for Swan Lake Update 14 (2201.14.0) for Ballerina Library](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.14.0%22+label%3AType%2FBug).
