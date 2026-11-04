# Specification: Ballerina SMB Library

_Owners_: @Nuvindu @niveathika \
_Reviewers_: @Nuvindu \
_Created_: 2026/08/10 \
_Updated_: 2026/09/07 \
_Edition_: Swan Lake

## Introduction

This is the specification for the SMB library of the [Ballerina language](https://ballerina.io/). The library reads and writes files on a remote SMB share, and watches a directory on one for files arriving and leaving.

This specification may change in future versions. Released versions can be found under the matching GitHub tag.

If you have feedback or suggestions, start a discussion with a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). The specification and the implementation can then be updated together.

The implementation that matches this specification is released with the distribution. Anything the library does differently from this document is a bug.

## Contents

1. [Overview](#1-overview)
2. [Security](#2-security)
   * 2.1 [Authentication](#21-authentication)
     * 2.1.1 [NTLMv2 Authentication](#211-ntlmv2-authentication)
     * 2.1.2 [Kerberos Authentication](#212-kerberos-authentication)
     * 2.1.3 [Anonymous Authentication](#213-anonymous-authentication)
   * 2.2 [Message Signing and Encryption](#22-message-signing-and-encryption)
   * 2.3 [Dialect Negotiation](#23-dialect-negotiation)
3. [Client](#3-client)
   * 3.1 [Initializing the Client](#31-initializing-the-client)
   * 3.2 [Writing Files](#32-writing-files)
   * 3.3 [Reading Files](#33-reading-files)
   * 3.4 [Data Binding](#34-data-binding)
   * 3.5 [File Management](#35-file-management)
4. [Listener](#4-listener)
   * 4.1 [Initializing the Listener](#41-initializing-the-listener)
   * 4.2 [Service](#42-service)
   * 4.3 [Content Handlers](#43-content-handlers)
   * 4.4 [Handler Selection](#44-handler-selection)
   * 4.5 [File Filtering](#45-file-filtering)
   * 4.6 [Post-Processing Actions](#46-post-processing-actions)
   * 4.7 [Error Handling](#47-error-handling)
5. [Caller](#5-caller)
6. [Errors](#6-errors)
7. [Observability](#7-observability)
   * 7.1 [Metrics](#71-metrics)
     * 7.1.1 [Gauges](#711-gauges)
     * 7.1.2 [Counters](#712-counters)
     * 7.1.3 [Querying Metrics](#713-querying-metrics)
   * 7.2 [Tags](#72-tags)
     * 7.2.1 [Identity Tags](#721-identity-tags)
     * 7.2.2 [Action Tags](#722-action-tags)
     * 7.2.3 [Outcome Tags](#723-outcome-tags)
     * 7.2.4 [File-Scoped Tags](#724-file-scoped-tags)
   * 7.3 [File Lifecycle](#73-file-lifecycle)
     * 7.3.1 [Stage 1: Found](#731-stage-1-found)
     * 7.3.2 [Stage 2: Dispatched](#732-stage-2-dispatched)
     * 7.3.3 [Stage 3: Handled](#733-stage-3-handled)
     * 7.3.4 [Stage 4: Cleaned Up](#734-stage-4-cleaned-up)
   * 7.4 [Tracing](#74-tracing)

## 1. Overview

The library has three parts.

| Part | What it does |
| --- | --- |
| `smb:Client` | Performs file system operations on an SMB share |
| `smb:Listener` | Polls a directory on an SMB share and triggers on file changes |
| `smb:Caller` | Provides SMB share access to an `smb:Service` handler for file operations |

A connection is bound to a single named share. Every path the library takes or returns is relative to that share, and uses `/` as the separator on every server platform.

Dialects SMB 2.0.2 through 3.1.1 are supported. SMB 1.0 is not.

## 2. Security

### 2.1 Authentication

The `auth` field of the client and listener configuration says who connects.

```ballerina
public type AuthConfiguration record {|
    Credentials credentials?;
    KerberosConfig kerberosConfig?;
|};
```

When both are present, Kerberos is used. When neither is provided, the connection uses anonymous authentication.

#### 2.1.1 NTLMv2 Authentication

`credentials` is an NTLMv2 identity. `domain` defaults to `WORKGROUP`.

```ballerina
public type Credentials record {|
    string username;
    string password;
    string domain = "WORKGROUP";
|};
```

#### 2.1.2 Kerberos Authentication

`kerberosConfig` is a Kerberos identity. `principal` takes the `user@REALM` form. Without a `keytab`, the ticket is obtained with the password from `credentials`. `configFile` points at a `krb5.conf` describing the realm.

```ballerina
public type KerberosConfig record {|
    string principal;
    string keytab?;
    string configFile?;
|};
```

#### 2.1.3 Anonymous Authentication

**An anonymous connection works only with the SMB 2 dialects.** The default `dialects` list starts at SMB 3.1.1, so an anonymous connection must narrow the list itself. It is rejected otherwise.

```ballerina
smb:Client smbClient = check new ({
    host: "smb.example.com",
    share: "public",
    dialects: [smb:SMB_2_1, smb:SMB_2_0_2]
});
```

Signing and encryption are turned off for an anonymous connection, whatever the configuration says.

### 2.2 Message Signing and Encryption

`signRequired` makes every message of the session signed, and fails the connection when the server will not sign. `encryptData` encrypts the session payload, and needs a dialect of 3.0 or above. Both default to `false`, and both apply to a connection opened by the `smb:Client`.

### 2.3 Dialect Negotiation

`dialects` lists the acceptable dialects, best first. The default holds all five, so the highest dialect both sides support is the one negotiated. A shorter list refuses anything outside it.

```ballerina
public enum Dialect {
    SMB_3_1_1,
    SMB_3_0_2,
    SMB_3_0,
    SMB_2_1,
    SMB_2_0_2
}
```

## 3. Client

### 3.1 Initializing the Client

The `smb:Client` is initialized using a `smb:ClientConfiguration` record. The `share` field is the only required field. All other configuration fields are either optional or have default values.

The `host` and `port` identify the SMB server, while `share` specifies the share the client connects to. Authentication, dialect negotiation, signing, encryption, DFS, buffering, and connection timeout can be configured through the other fields.

```ballerina
public type ClientConfiguration record {|
    string host = "localhost";
    int port = 445;
    string share;
    AuthConfiguration auth?;
    Dialect[] dialects = [SMB_3_1_1, SMB_3_0_2, SMB_3_0, SMB_2_1, SMB_2_0_2];
    boolean signRequired = false;
    boolean encryptData = false;
    boolean enableDfs = false;
    int bufferSize = 65536;
    decimal connectTimeout = 30.0;
    boolean laxDataBinding = false;
    FailSafeOptions csvFailSafe?;
|};
```

`enableDfs` follows DFS referrals, so a path may cross namespaces. `connectTimeout` is in seconds.

The size of the transfer buffer is unspecified. `bufferSize` is tracked in [ballerina-library#9022](https://github.com/ballerina-platform/ballerina-library/issues/9022).

Creating the client opens the connection and connects to the share. An unreachable host, a rejected identity, or a missing share fails here, not on the first operation.

```ballerina
smb:Client smbClient = check new ({
    host: "smb.example.com",
    share: "reports",
    auth: {
        credentials: {username: "alice", password: "***", domain: "WORKGROUP"}
    }
});
```

`close` releases the connection.

```ballerina
check smbClient->close();
```

### 3.2 Writing Files

| Method | Content |
| --- | --- |
| `putBytes` | `byte[]` |
| `putText` | `string` |
| `putJson` | `json` or `record {\|json...;\|}` |
| `putXml` | `xml` or `record {\|json...;\|}` |
| `putCsv` | `string[][]` or `record {}[]` |
| `putBytesAsStream` | `stream<byte[], error?>` |
| `putCsvAsStream` | `stream<string[]\|record {}, error?>` |

Every `put` method takes an `smb:FileWriteOption`, which defaults to `OVERWRITE`.

```ballerina
public enum FileWriteOption {
    OVERWRITE,
    APPEND
}
```

A write creates the file when it is not there. **It does not create the directories above it.** Writing to a path whose parent directory is absent fails; call `mkdir` first.

`putCsv` writes a header row taken from the record fields when the content is a `record {}[]` and the option is not `APPEND`. Appending a `record {}[]` writes data rows only, so a file built entirely by appends has no header.

`patch` writes a `byte[]` at a byte offset and leaves the rest of the file alone. It takes no write option, and creates the file when it is not there.

### 3.3 Reading Files

| Method | Returns |
| --- | --- |
| `getBytes` | `byte[]` |
| `getText` | `string` |
| `getJson` | `json` or `record {\|json...;\|}` |
| `getXml` | `xml` or `record {\|json...;\|}` |
| `getCsv` | `string[][]` or `record {}[]` |
| `getBytesAsStream` | `stream<byte[], error?>` |
| `getCsvAsStream` | a stream of `string[]` or `record {}` |

A streaming read holds the file open until the stream is consumed or closed, so always close it.

### 3.4 Data Binding

`getJson`, `getXml`, `getCsv`, and `getCsvAsStream` bind the content to the type expected at the call site. There is no separate conversion step.

```ballerina
type SalesReport record {|
    string storeId;
    decimal total;
|};

SalesReport report = check smbClient->getJson("/sales/latest.json");
```

Content that does not match the target type gives an `smb:Error`. `laxDataBinding` relaxes that, and lets content with missing or extra fields bind.

`csvFailSafe` applies to `getCsv`, and to an `onFileCsv` handler that binds the whole file. A record that cannot be bound is then skipped and recorded, instead of failing the whole read. `contentType` decides what is recorded for each skipped record.

```ballerina
public type FailSafeOptions record {|
    ErrorLogContentType contentType = METADATA;
|};

public enum ErrorLogContentType {
    METADATA,
    RAW,
    RAW_AND_METADATA
}
```

Skipped records are appended to `<file-name>_error.log` in the working directory of the Ballerina program, not to the share. Under `RAW` and `RAW_AND_METADATA` that file holds the raw text of the skipped records, and so is as sensitive as the data being read.

Fail-safe handling of a CSV read as a stream is unspecified, and is tracked in [ballerina-library#9023](https://github.com/ballerina-platform/ballerina-library/issues/9023).

### 3.5 File Management

`list` returns an `smb:FileInfo` for every entry of a directory. The `.` and `..` entries are left out.

```ballerina
public type FileInfo record {|
    string name;
    string path;
    int size;
    time:Utc modifiedAt;
    time:Utc createdAt;
    time:Utc accessedAt;
    time:Utc writtenAt;
    boolean isDirectory;
    string extension;
    boolean isExecutable;
    boolean isHidden;
    boolean isWritable;
    string uri;
|};
```

`mkdir` and `rmdir` create and remove directories. `copy` duplicates a file, and `delete` removes one. `exists`, `size`, and `isDirectory` report on a path.

`rename` and `move` are one operation. Both write the content to the destination path and then remove the source, so either one can move a file to another directory. Neither is atomic, and neither creates the directories above the destination.

## 4. Listener

### 4.1 Initializing the Listener

The listener configuration is the client configuration plus polling and filtering.

```ballerina
public type ListenerConfiguration record {|
    string host = "localhost";
    int port = 445;
    string share = "";
    AuthConfiguration auth?;
    string fileNamePattern?;
    decimal pollingInterval = 60;
    Dialect[] dialects = [SMB_3_1_1, SMB_3_0_2, SMB_3_0, SMB_2_1, SMB_2_0_2];
    boolean signRequired = false;
    boolean encryptData = false;
    boolean enableDfs = false;
    int bufferSize = 65536;
    decimal connectTimeout = 30.0;
    boolean laxDataBinding = false;
    FailSafeOptions csvFailSafe?;
|};
```

`pollingInterval` is the number of seconds between polls. On each cycle the listener polls the watched directory of every attached service.

The polling connection negotiates the dialects in `dialects`. The rest of the transport settings are unspecified for the listener, and are tracked in [ballerina-library#9021](https://github.com/ballerina-platform/ballerina-library/issues/9021).

### 4.2 Service

A service attached to a listener watches one directory of the share. The `path` field of `@smb:ServiceConfig` names it. Without the annotation, the service name is used.

```ballerina
public type SmbServiceConfig record {|
    string path?;
|};
```

```ballerina
@smb:ServiceConfig {
    path: "/sales/new"
}
service "salesProcessor" on smbListener {
    // handlers
}
```

Several services may attach to one listener, each watching a different directory. The handler methods of a service, and its `smb:Caller`, are resolved when the service is attached, not once per file.

### 4.3 Content Handlers

A service declares one or more content handlers. The listener reads the file, binds the content, and passes it as the **first** parameter. A handler never reads the file itself.

| Handler | Content parameter |
| --- | --- |
| `onFileText` | `string` |
| `onFileJson` | `json` or `record {\|json...;\|}` |
| `onFileXml` | `xml` or `record {\|json...;\|}` |
| `onFileCsv` | `string[][]`, `record {}[]`, or a stream of either |
| `onFile` | `byte[]`, or a `stream<byte[], error?>` |

Declaring a stream as the content parameter of `onFileCsv` or `onFile` streams the file instead of holding it in memory.

After the content parameter, a handler may declare an `smb:FileInfo` parameter, an `smb:Caller` parameter, or both, in either order. Both are optional.

```ballerina
remote function onFileJson(SalesReport report, smb:FileInfo fileInfo, smb:Caller caller) returns error? {
}
```

`onFileDelete` gets the path of a file that has gone from the watched directory since the previous poll. It may declare an optional `smb:Caller` parameter.

A file with no handler for it is left alone.

### 4.4 Handler Selection

The file extension picks the handler.

| Extension | Handler |
| --- | --- |
| `txt`, `log`, `md` | `onFileText` |
| `json` | `onFileJson` |
| `xml` | `onFileXml` |
| `csv` | `onFileCsv` |
| any other | `onFile` |

When the handler for an extension is not declared, the file goes to `onFile`. A file reaches at most one handler.

### 4.5 File Filtering

`fileNamePattern` is a regular expression. Only files whose names match it are picked up. It is accepted at two levels:

- on the listener configuration, applying to every service attached to it, and
- on `@smb:FunctionConfig`, applying to one handler.

A pattern on a handler **replaces** the listener-level pattern for that handler. It does not narrow it further.

### 4.6 Post-Processing Actions

`@smb:FunctionConfig` says what becomes of the file once the handler has run.

```ballerina
public type FunctionConfiguration record {|
    string fileNamePattern?;
    MOVE|DELETE afterProcess?;
    MOVE|DELETE afterError?;
|};
```

`afterProcess` applies when the handler succeeds, and `afterError` when the handler fails. A file whose applicable action is not set stays where it is. At most one action applies to a file.

A file that cannot be read, or whose content cannot be bound to the handler's content parameter, never reaches the handler. It goes to `onError` and stays in the watched directory. `afterError` does not apply to it.

```ballerina
public const DELETE = "DELETE";

public type Move record {|
    string moveTo;
    boolean preserveSubDirs = true;
|};

public type MOVE Move;
```

`DELETE` is a constant, and removes the file. `MOVE` is an alias for the `Move` record, and relocates the file to `moveTo`, creating that directory when it is absent. `preserveSubDirs` recreates the file's subdirectory structure, relative to the watched directory, under the destination.

```ballerina
@smb:FunctionConfig {
    afterProcess: {moveTo: "/sales/processed"},
    afterError: {moveTo: "/sales/error"}
}
remote function onFileJson(SalesReport report, smb:FileInfo fileInfo) returns error? {
}
```

A handler that moves the file itself and also declares `afterProcess` leaves the listener acting on a path that is no longer there.

### 4.7 Error Handling

`onError` is called when a file cannot be read, when its content cannot be bound to the handler's content parameter, when the handler itself fails, and when a poll fails. It gets the error, and may declare an optional `smb:Caller` parameter.

```ballerina
remote function onError(error err) returns error? {
    log:printError("Failed to process the file", err);
}
```

`onError` and the post-processing actions are independent. Declaring `onError` does not suppress `afterProcess` or `afterError`. A service with no `onError` has its errors logged by the listener. `@smb:FunctionConfig` on `onError` does nothing.

## 5. Caller

An `smb:Caller` declared as a handler parameter lets a handler act on the share while processing a file.

The caller has its own connection, opened from the listener configuration. One is created per listener and shared by every service attached to it, so a listener that has a caller holds two connections: the one it polls with, and the one the caller uses.

The caller offers the write, read, and file management operations of the client: `putBytes`, `patch`, `putText`, `putJson`, `putXml`, `putCsv`, `putBytesAsStream`, `putCsvAsStream`, `getBytes`, `getText`, `getJson`, `getXml`, `getCsv`, `getBytesAsStream`, `getCsvAsStream`, `list`, `mkdir`, `rmdir`, `rename`, `move`, `copy`, `exists`, `size`, `isDirectory`, and `delete`.

Its read operations return the plain types rather than binding to the type expected at the call site, so `getJson` returns `json` and `getCsv` returns `string[][]`.

The caller belongs to the listener, which closes it when it stops. Closing an `smb:Caller` from a handler does not stop the listener or its polling connection. It closes the caller connection shared by the services on that listener, so later caller operations fail.

## 6. Errors

The library defines one distinct error type.

```ballerina
public type Error distinct error;
```

Every client and caller operation that can fail returns an `smb:Error`. The listener lifecycle methods `start`, `attach`, `detach`, `gracefulStop`, and `immediateStop` return a plain `error?`. They also propagate errors raised by the task scheduler the listener uses.

An `smb:Error` carries the reason in its message. A failure reported by the server keeps the SMB status in that message, so a rejected operation can be told apart from a transport failure.

```ballerina
string|smb:Error content = smbClient->getText("/reports/missing.txt");
if content is smb:Error {
    log:printError("Read failed", content);
}
```

## 7. Observability

The SMB module publishes metrics and traces following the unified observability specification for Ballerina file integration libraries. All metric names and tags are module-agnostic; the `module` tag value `smb` distinguishes this module from FTP, S3, and future file integrations. This enables a single dashboard to monitor every file integration through shared panels filtered by `module`.

Observability is opt-in. When the Ballerina runtime's observability subsystem is disabled, no metrics are recorded and no spans are created. Observability failures never break file operations; every recording method swallows exceptions internally.

### 7.1 Metrics

#### 7.1.1 Gauges

| Metric | Description |
| --- | --- |
| `file_databinding_duration_seconds` | Time in seconds to fetch and convert file content into the target type. Configured with p50, p75, p90, p95, p99 over a 5-minute sliding window. |

`file_databinding_duration_seconds` covers the full data binding pipeline: reading bytes from the share and converting to the handler's parameter type (e.g. `json`, `xml`, `record {}`). For streaming handlers, this measures stream creation time only; actual data transfer is lazy.

#### 7.1.2 Counters

| Metric | Type | Description |
| --- | --- | --- |
| `file_bytes_transferred_total` | Counter | Bytes read or written across operations. A sum of bytes, not a count of spans. |
| `file_events_total` | Counter | Total file lifecycle stage events. Tags: `file.stage`, `outcome`, `error.type`, `handler.name`. |

#### 7.1.3 Querying Metrics

These logical metrics are derived from `file_events_total` by filtering on tags.

| Logical metric | PromQL derivation |
| --- | --- |
| Poll cycles | `file_events_total{action_type="poll_cycle"}` |
| Files found | `file_events_total{file_stage="found"}` |
| Files dispatched | `file_events_total{file_stage="dispatched"}` |
| Files skipped | `file_events_total{file_stage="found", outcome="skipped"}` |
| Files handled | `file_events_total{file_stage="handled"}` |
| Files cleaned up | `file_events_total{file_stage="cleaned_up"}` |
| Client operations | `requests_total_value{action_type="client_operation"}` |

### 7.2 Tags

These tags appear on metrics and/or trace spans as indicated. When a tag is not applicable for a given stage, the sentinel value `none` is used rather than omitting the tag, so that every increment of a given metric carries the same set of label keys.

#### 7.2.1 Identity Tags

| Tag | Values | Metrics | Traces | Notes |
| --- | --- | --- | --- | --- |
| `module` | `smb` | Yes | Yes | Identifies the Ballerina module. Added on every observer context at construction time. |
| `protocol` | `smb` | Yes | Yes | The wire protocol. Added on every observer context at construction time. |
| `type` | `client`, `listener` | Yes | Yes | Whether this is a client or listener operation. |
| `remote.url` | `host:port` | Yes | Yes | The server endpoint. |
| `watched.path` | Monitored directory path | Yes | Yes | Present on listener file events. Set to `none` on poll cycles since a single cycle covers all registered paths. Distinguishes services monitoring different paths on the same server. |
| `host` | Local hostname | Yes | Yes | Hostname of the current instance. Set to `none` on metrics if hostname resolution fails; omitted from traces. |

#### 7.2.2 Action Tags

| Tag | Values | Metrics | Traces | Notes |
| --- | --- | --- | --- | --- |
| `action.type` | `poll_cycle`, `file_event`, `client_operation` | Yes | Yes | `poll_cycle` covers poll cycles, `file_event` covers listener file events, `client_operation` covers client operations. |
| `file.stage` | `found`, `dispatched`, `handled`, `cleaned_up` | Yes | Yes | Maps to the four-stage file lifecycle. Present on listener event spans and metrics. |
| `event.type` | `create`, `delete`, `error` | Yes | Yes | Type of listener event. `create` for content-based callbacks, `delete` for `onFileDelete`, `error` for content-binding failures routed to `onError`. |
| `operation.type` | `get`, `put`, `manage` | Yes | Yes | `get` for `getBytes`, `getText`, `getJson`, `getXml`, `getCsv`, `getBytesAsStream`, `getCsvAsStream`, and listener content reads. `put` for all `put*` methods. `manage` for `delete`, `rename`, `move`, `copy`, `mkdir`, `rmdir`, `isDirectory`, `list`, `exists`, `size`. |
| `handler.name` | Handler method name (e.g. `onFileJson`) | Yes | Yes | Identifies which handler processed the file. Present on `dispatched`, `handled`, and `cleaned_up` stages. Not present on `found` (handler not yet determined) or skipped files. |
| `cleanup.action` | `move`, `delete` | Yes | Yes | Present on `cleaned_up` events only. |

#### 7.2.3 Outcome Tags

| Tag | Values | Metrics | Traces | Notes |
| --- | --- | --- | --- | --- |
| `outcome` | `success`, `failure`, `skipped` | Yes | Yes | Result of an operation. `skipped` indicates a file found but not matched to any handler. |
| `error.type` | Error type name or predefined reason | Yes | Yes | Present when `outcome=failure` or `outcome=skipped`. Predefined reasons: `no_handler_matched` (with `outcome=skipped`), `binding_failed`, `move_failed`, `delete_failed`. For client and handler errors, set to the Ballerina error type name. |

#### 7.2.4 File-Scoped Tags

| Tag | Values | Metrics | Traces | Notes |
| --- | --- | --- | --- | --- |
| `file.path` | Full path of the file | No | Yes | Excluded from metrics to avoid cardinality explosion. Added as a span-only tag. |
| `destination.path` | Target path for move/rename/copy | No | Yes | Present on two-path client operations only. |
| `file.size` | Size in bytes | No | Yes | Added as a property on listener handler strand contexts. |
| `file.modified_time` | Last-modified timestamp | No | Yes | Added as a property on listener handler strand contexts. |

### 7.3 File Lifecycle

Every file processed by a listener passes through up to four stages. A parent span covers the entire lifecycle of a single file, and each stage that invokes a Ballerina method produces a child span parented to it. Each stage also publishes an independent `file_events_total` counter increment.

#### 7.3.1 Stage 1: Found

The listener's poll cycle discovers files in the monitored directory. It is published as an explicit counter increment. No framework span exists at this point; the file has been discovered but no Ballerina method has been invoked yet.

The counter entry carries `action.type=file_event`, `file.stage=found`, along with the standard identity tags (`module`, `type=listener`, `remote.url`, `watched.path`, `protocol`, `host`).

The routing logic then attempts to match the file to a content handler based on its extension. If no handler matches, the counter entry carries `outcome=skipped` and `error.type=no_handler_matched`. The file goes no further in the lifecycle and no parent span is created.

#### 7.3.2 Stage 2: Dispatched

The routing logic matches the file to a specific content handler method based on file extension or fallback to `onFile`. At this point the file is "handed over" to the handler but the handler has not yet been invoked.

The counter entry carries `action.type=file_event`, `file.stage=dispatched`, and `handler.name` set to the matched handler method name (e.g. `onFileText`), along with the standard identity tags.

#### 7.3.3 Stage 3: Handled

The file content is read from the server, converted to the expected Ballerina type, and the matched handler method is invoked. When the handler returns, the `handled` stage is recorded.

If the handler returns nil, the outcome is `success`. If it returns an error, the outcome is `failure`.

The handler invocation creates an auto-instrumented child span parented to the per-file lifecycle span. The child span carries `event.type=create`, along with trace-only tags: `file.path`, `file.size`, and `file.modified_time` (excluded from metrics to avoid cardinality explosion).

A duration metric is recorded at this stage:

* `file_databinding_duration_seconds` — time to fetch and convert the file content before handler invocation

#### 7.3.4 Stage 4: Cleaned Up

After the handler completes, a post-processing action is executed if configured via `@smb:FunctionConfig`. The action is either `delete` (remove the file from the server) or `move` (move the file to a destination directory). Which action runs depends on the handler outcome: `afterProcess` runs on success, `afterError` runs on failure. This stage only fires if post-processing is configured.

The counter entry carries `action.type=file_event`, `file.stage=cleaned_up`, `cleanup.action` (`delete` or `move`), `handler.name`, and `outcome`, along with the standard identity tags. On failure, `error.type` is set to `delete_failed` or `move_failed`.

### 7.4 Tracing

A per-file parent span covers the entire file lifecycle from discovery through cleanup. The span is named `smb/file-lifecycle` and carries the `file.path` as a span-only tag.

A child span is created automatically by the Ballerina runtime for the handler `callMethod` invocation. This child span is parented to the lifecycle span through strand properties. Cleanup operations (move/delete) are executed directly on the disk share and do not create child spans.

For client operations, the Ballerina runtime creates auto-instrumented spans for each native external method call. The SMB module enriches these spans with the standard tags (`module`, `action.type`, `type`, `remote.url`, `protocol`, `operation.type`, `host`) on the metric context, and adds `file.path` and `destination.path` as span-only tags on the span itself.

Poll cycle spans are tagged with `action.type=poll_cycle` and `outcome` (success or failure).
