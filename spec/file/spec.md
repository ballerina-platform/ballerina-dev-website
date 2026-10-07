# Specification: Ballerina File Library

_Owners_: @daneshk @kalaiyarasiganeshalingam  
_Reviewers_: @daneshk  
_Created_: 2021/12/10   
_Updated_: 2026/09/17  
_Edition_: Swan Lake  

## Introduction
This is the specification for the File standard library of [Ballerina language](https://ballerina.io/), which provides APIs to perform file, file path, and directory operations.

The File library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [File Metadata](#2-file-metadata)
3. [File & Directory Operations](#3-file-and-directory-operations)
   * 3.1. [Get Current Directory](#31-get-current-directory)
   * 3.2. [Create Directory](#32-create-directory)
   * 3.3. [Create File](#33-create-file)
   * 3.4. [Rename](#34-rename)
   * 3.5. [Copy](#35-copy)
   * 3.6. [Remove](#36-remove)
   * 3.7. [Get Metadata](#37-get-metadata)
   * 3.8. [Read Directory](#38-read-directory)
   * 3.9. [Create Temporary File](#39-create-temporary-file)
   * 3.10. [Create Temporary Directory](#310-create-temporary-directory)
   * 3.11. [Test](#311-test)
4. [Path Operations](#4-path-operations)
   * 4.1. [Path Constants](#41-path-constants)
   * 4.2. [Get Absolute Path](#42-get-absolute-path)
   * 4.3. [Is Absolute](#43-is-absolute)
   * 4.4. [Get Basename](#44-get-basename)
   * 4.5. [Get Parent Path](#45-get-parent-path)
   * 4.6. [Normalize Path](#46-normalize-path)
   * 4.7. [Split Path](#47-split-path)
   * 4.8. [Join](#48-join-path)
   * 4.9. [Get Relative Path](#49-get-relative-path)
5. [Directory Listener](#5-directory-listener)
   * 5.1. [Service](#51-service)
   * 5.2. [Post-Processing Actions](#52-post-processing-actions)
6. [Static Code Rules](#6-static-code-rules)
   * 6.1. [Avoid using publicly writable directories for file operations without proper access controls](#61-avoid-using-publicly-writable-directories-for-file-operations-without-proper-access-controls)
   * 6.2. [File function calls should not be vulnerable to path injection attacks](#62-file-function-calls-should-not-be-vulnerable-to-path-injection-attacks)
7. [Observability](#7-observability)
   * 7.1. [Metrics](#71-metrics)
   * 7.2. [Tags](#72-tags)
      * 7.2.1. [Identity Tags](#721-identity-tags)
      * 7.2.2. [Action Tags](#722-action-tags)
      * 7.2.3. [Outcome Tags](#723-outcome-tags)
      * 7.2.4. [File-Scoped Tags](#724-file-scoped-tags)
   * 7.3. [File Lifecycle](#73-file-lifecycle)
      * 7.3.1. [Stage 1: Found](#731-stage-1-found)
      * 7.3.2. [Stage 2: Dispatched](#732-stage-2-dispatched)
      * 7.3.3. [Stage 3: Handled](#733-stage-3-handled)
   * 7.4. [Tracing](#74-tracing)

## 1. Overview
Ballerina file standard library provides functionalities related to manipulating and working with files and directories.
All operations are supported on both Windows and Unix-based operating systems. 

## 2. File Metadata
Metadata information of files and directories will contain the following
* Absolute path
* Size in bytes
* Last modified time
* Whether it is a file or directory
* Read permission
* Write permission
```ballerina
public type MetaData record{|
    string absPath;
    int size;
    time:Utc modifiedTime;
    boolean dir;
    boolean readable;
    boolean writable;
|}; 
```

## 3. File and Directory Operations
The following operations are used to manipulate files and directories.

### 3.1. Get Current Directory
This is used to obtain the absolute path of the current working directory.
```ballerina
public isolated function getCurrentDir() returns string;
```

### 3.2. Create Directory
This is used to create a new directory. An option can be passed to configure whether non-existent parent directories
will be created or not during this process.
```ballerina
public isolated function createDir(string dir, DirOption option);
```

### 3.3. Create File
This is used to create a new file in the provided path.
```ballerina
public isolated function create(string path) returns Error?;
```

## 3.4. Rename
This is used to rename (move) a file or directory. If the newPath provided already exists and is not a directory, it
will be replaced. 
```ballerina
public isolated function rename(string oldPath, string newPath) returns Error?;
```

### 3.5. Copy
This is used to copy the file or directory in the provided path to a new location as specified in the new path. Options
can be passed to define how this operation is executed. 

Possible options
* Whether existing files/directories should be replaced
* Whether file attributes should be copied
* If the source is a symbolic link, whether the link should be copied, or the target file.
```ballerina
public isolated function copy(string sourcePath, string destinationPath, CopyOption... options) returns Error?;
```

### 3.6. Remove
This is used to remove a file or directory. If the provided path is a directory, an option can be passed to configure
whether all files and directories inside the given directory should be recursively removed.
```ballerina
public isolated function remove(string path, DirOption option) returns Error?'
```

### 3.7. Get Metadata
This is used to obtain the metadata information of the file specified in the provided path.
```ballerina
public isolated function getMetaData(string path) returns MetaData|Error;
```

### 3.8. Read Directory
This is used to obtain a list of files and directories in the provided path with the relevant metadata information.
```ballerina
public isolated function readDir(string path) returns MetaData[]|Error;
```

### 3.9. Create Temporary File
This is used to create a temporary file. An optional prefix and suffix may be defined. If the directory in which the
temporary file is to be created is not defined, the default temp directory of the OS will be used.
```ballerina
public isolated function createTemp(string? suffix = (), string? prefix = (), string? dir  = ()) returns string|Error;
```

### 3.10. Create Temporary Directory
This is used to create a temporary directory. An optional prefix and suffix may be defined. If the directory in which
the temporary directory is to be created is not defined, the default temp directory of the OS will be used.
```ballerina
public isolated function createTempDir(string? suffix = (), string? prefix = (), string? dir  = ()) returns string|Error;
```

### 3.11. Test
This is used test whether a file or directory meets a particular condition. Possible test conditions are,
* Whether the file or directory exists
* Whether the provided path is a directory
* Whether the provided path is a symbolic link
* Read permission
* Write permission
```ballerina
public isolated function test(string path, TestOption testOption) returns boolean|Error;
```

## 4 Path Operations
The following are used to create and manipulate paths. Compatibility with both Windows and Unix-based operating 
systems are ensured.

### 4.1. Path Constants
OS-specific path constants
-  `pathSeparator`: The character used to separate the parent directories that make up the path to a specific location. For windows, it’s ‘\’ and for UNIX it’s ‘/’
-  `pathListSeparator`: The character commonly used by the operating system to separate paths in the path list. For windows, it’s ‘;‘ and for UNIX it’s ‘:’

### 4.2. Get Absolute Path
This is used to retrieve the absolute path reference from the provided relative path.
```ballerina
public isolated function getAbsolutePath(string path) returns string|Error;
```

### 4.3. Is Absolute
This is used to determine whether the provided path is absolute or not.
```ballerina
public isolated function isAbsolutePath(string path) returns boolean|Error;
```

### 4.4. Get Basename
This is used to retrieve the base name of the file or directory at the provided path. 
```ballerina
public isolated function basename(string path) returns string|Error;
```

### 4.5. Get Parent Path
This is used to retrieve the parent directory of the provided file or directory.
```ballerina
public isolated function parentPath(string path) returns string|Error;
```

### 4.6. Normalize Path
This is used to normalize the provided path value. Options can be provided to indicate how the normalization should
be performed.
* Get the shortest name equivalent
* Evaluate symbolic links
* Normalize case
```ballerina
public isolated function normalizePath(string path, NormOption option) returns string|Error;
```

### 4.7. Split Path
This is used to split the provided path into an array of path components.
```ballerina
public isolated function splitPath(string path) returns string[]|Error;
```

### 4.8. Join Path
This is used to combine multiple path components to create a single path.
```ballerina
public isolated function joinPath(string... parts) returns string|Error;
```

### 4.9. Get Relative Path
This is used to generate a logically equivalent relative path to the provided target path from the provided base path. 
```ballerina
public isolated function relativePath(string base, string target) returns string|Error;
```

## 5. Directory Listener
The directory listener can be used to monitor a specified directory for changes. This listener will emit an event once
a change is detected within the directory and can be configured to check within subdirectories for changes as well. The
supported events are
* On file create
* On file delete
* On file modification

### 5.1. Service
Each remote function accepts a `file:FileEvent` parameter and may optionally return `error?`. If no return type is
specified, the function is treated as returning `()`.

```ballerina
remote function onCreate(file:FileEvent m) returns error? {
}
```

When a remote function returns an error, the error stack trace is printed. The listener continues processing
subsequent events without terminating.

### 5.2. Post-Processing Actions
The `@file:FunctionConfig` annotation configures what happens to a file after the `onCreate` or `onModify` remote
function that handled it completes. It is not permitted on `onDelete`; the compiler reports an error. On one listener,
only one service may configure an action for a given remote function; a second one is a compile-time error. Both
rules are also checked when a service is attached at runtime.

The annotation has two fields. `afterProcess` runs when the remote function returns successfully. `afterError` runs
when the remote function returns an error or panics; the error is still printed. If the relevant field is not set,
the file stays in place. The action runs after the remote function returns. When several services are attached to the
listener, it runs after every service has handled the event.

Each field accepts one of the following actions.

- `file:DELETE` removes the file.
- A `file:Move` record moves the file into the directory given by `moveTo`. With `preserveSubDirs` set to `true`, the
  default, the file keeps its path relative to the listener's `path` under `moveTo`. With `false`, the file is placed
  directly in `moveTo`. Missing directories are created. If an entry with the destination name already exists, the
  move fails and the source file stays in place.

For example, when the listener watches `/data/in` recursively and `/data/in/orders/2026/a.csv` is handled with
`moveTo: "/data/archive"`, the file is moved to `/data/archive/orders/2026/a.csv`, or to `/data/archive/a.csv` when
`preserveSubDirs` is `false`.

Paths are resolved to absolute paths against the working directory; `moveTo` is not relative to the watched directory.
Attaching a service fails when `moveTo` is empty, is the watched directory, is inside a recursively watched
directory, or exists and is not a directory.
A move whose computed destination is inside a recursively watched directory fails. With `recursive: false`, a
subdirectory such as `/data/in/processed` is a valid destination.

Only regular files are acted on; directories and symbolic links are skipped. A failure of the action is logged and is
not reported to the service; the file stays in place. If the file is no longer present when the action runs, the
action is skipped. The action acts on whatever regular file is at the path when it runs. Removing the file produces a
delete event like any other removal, and `onDelete` runs in every attached service that declares it.

###### Example: Delete after processing

```ballerina
service on fileListener {
    @file:FunctionConfig {
        afterProcess: file:DELETE
    }
    remote function onCreate(file:FileEvent event) returns error? {
        check process(event.name);
    }
}
```

###### Example: Archive on success, quarantine on error

```ballerina
service on fileListener {
    @file:FunctionConfig {
        afterProcess: {moveTo: "/data/archive"},
        afterError: {moveTo: "/data/failed"}
    }
    remote function onCreate(file:FileEvent event) returns error? {
        check process(event.name);
    }
}
```

###### Example: Flatten into one directory

```ballerina
listener file:Listener fileListener = new (path = "/data/in", recursive = true);

service on fileListener {
    @file:FunctionConfig {
        afterProcess: {moveTo: "/data/archive", preserveSubDirs: false}
    }
    remote function onCreate(file:FileEvent event) returns error? {
        check process(event.name);
    }
}
```

## 6. Static Code Rules

The following static code rules are applied to the File module.

| Id               | Kind          | Description                                                                                                                                                                                     |
|------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ballerina/file:1 | VULNERABILITY | [Avoid using publicly writable directories for file operations without proper access controls](#61-avoid-using-publicly-writable-directories-for-file-operations-without-proper-access-controls) |
| ballerina/file:2 | VULNERABILITY | [File function calls should not be vulnerable to path injection attacks](#62-file-function-calls-should-not-be-vulnerable-to-path-injection-attacks)                                             |

### 6.1. Avoid using publicly writable directories for file operations without proper access controls

A file operation that targets a publicly writable directory, such as the system temporary directory, exposes the file to every local account.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/file:1 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-377](https://cwe.mitre.org/data/definitions/377.html), [CWE-379](https://cwe.mitre.org/data/definitions/379.html) |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

#### 6.1.1. Why this is an issue?

Directories such as `/tmp`, or the path returned by `os:getEnv("TMP")`/`os:getEnv("TEMP")`, grant read, write and delete permission to every local account by design. A path built under one of these directories carries none of the isolation the calling code assumes: another process on the same host can read the file, replace it before it is opened, or remove it, regardless of what the calling service intended. The rule reports a file operation whose path is built from a known publicly writable directory.

#### 6.1.2. What is the potential impact?

Any local account can read the file's contents, which discloses whatever it holds; can pre-create or replace it ahead of the service, which is a symlink or race-condition attack; or can delete it, which denies the service the file it expected to find.

#### 6.1.3. How can I fix this?

When a file only needs to exist for the duration of the operation, create it with `file:createTemp` or `file:createTempDir`, which allocate a uniquely named entry rather than a fixed, guessable path. When the file must persist, place it under a directory the service owns with permissions that exclude other accounts, instead of a shared temporary path.

**Non-compliant code:**

```ballerina
import ballerina/file;
import ballerina/os;

public function writeReport() returns file:Error? {
    string tempFolderPath = os:getEnv("TMP");
    return file:create(tempFolderPath + "/report.txt");
}
```

**Compliant code:**

```ballerina
import ballerina/file;

public function writeReport() returns string|file:Error {
    return file:createTemp(suffix = ".txt", prefix = "report-");
}
```

#### 6.1.4. Additional Resources

- [CWE-377: Insecure Temporary File](https://cwe.mitre.org/data/definitions/377.html)
- [CWE-379: Creation of Temporary File in Directory with Insecure Permissions](https://cwe.mitre.org/data/definitions/379.html)
- [OWASP Top 10:2025 A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)

### 6.2. File function calls should not be vulnerable to path injection attacks

A file path built by concatenating untrusted input lets the caller reach files outside the intended directory.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/file:2 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-22](https://cwe.mitre.org/data/definitions/22.html) |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

#### 6.2.1. Why this is an issue?

Functions such as `file:remove`, `file:create`, `file:copy`, `file:rename` and `file:getMetaData` take a plain string path and act on whatever the filesystem resolves it to. When a segment of that path comes from outside the program and is concatenated in without validation, a value such as `../../etc/passwd` is resolved by the filesystem the same as any other path, letting the caller step outside the directory the code intends to confine itself to.

#### 6.2.2. What is the potential impact?

An attacker who controls part of the path can read, overwrite, or delete files outside the intended directory, including files the service never meant to expose.

#### 6.2.3. How can I fix this?

Validate the untrusted segment against an allow-list of known names, or resolve the resulting path and confirm it still falls within the intended base directory before performing the operation.

**Non-compliant code:**

```ballerina
import ballerina/file;

public function removeUploadedFile(string fileName) returns file:Error? {
    string unsafeFilePath = "./target/" + fileName;
    return file:remove(unsafeFilePath);
}
```

**Compliant code:**

```ballerina
import ballerina/file;

public function removeUploadedFile(string fileName) returns file:Error? {
    string baseDir = check file:getAbsolutePath("./target");
    string candidatePath = check file:getAbsolutePath(baseDir + "/" + fileName);
    if !candidatePath.startsWith(baseDir + "/") {
        return error("invalid file name");
    }
    return file:remove(candidatePath);
}
```

#### 6.2.4. Additional Resources

- [CWE-22: Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')](https://cwe.mitre.org/data/definitions/22.html)
- [OWASP Top 10:2025 A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)

## 7. Observability

The file module implements the unified observability specification for Ballerina file integration libraries. It publishes
metrics and traces that conform to the module-agnostic standard, enabling consistent monitoring across all file-based
integrations (FTP, SMB, S3, local file, etc.) through shared dashboards filtered by the `module` tag.

All observability methods are exception-safe. Failures in metric recording or span creation are caught and logged at
DEBUG level without affecting file operations.

### 7.1. Metrics

The following metrics are published by the directory listener.

#### 7.1.1. `file_events_total` (Counter)

Total file lifecycle stage events. Each increment carries the full set of standard tags to ensure consistent label sets
across all stages. When a tag is not applicable for a given stage, the sentinel value `none` is used rather than
omitting the tag.

The following logical metrics can be derived by filtering on tags:

| Logical Metric     | Description                                       | Derivation                                                          |
|--------------------|---------------------------------------------------|---------------------------------------------------------------------|
| Files found        | File events discovered by the directory watcher    | `file_events_total{file.stage="found"}`                             |
| Files dispatched   | Files matched to a handler and handed over         | `file_events_total{file.stage="dispatched"}`                        |
| Files skipped      | Files found but matched no handler                 | `file_events_total{file.stage="found", outcome="skipped"}`          |
| Files handled      | Handler invocations completed                      | `file_events_total{file.stage="handled"}`                           |

#### 7.1.2. `file_resource_execution_duration_seconds` (Gauge)

Time taken to execute the resource/handler method. Configured with percentile statistics:
* Percentiles: p50, p75, p90, p95, p99
* Expiry: 5-minute sliding window
* Buckets: 10

### 7.2. Tags

These tags apply across all file integration modules that share the observability vocabulary. They appear on metrics
and/or trace spans as indicated. Every increment of a given metric carries the same set of label keys. When a tag is
not applicable for a given stage, the sentinel value `none` is used rather than omitting the tag.

#### 7.2.1. Identity Tags

These tags track the origin and environment of the integration.

| Tag            | Values         | Metrics | Traces | Notes                                                                                      |
|----------------|----------------|---------|--------|--------------------------------------------------------------------------------------------|
| `module`       | `file`         | Yes     | Yes    | Identifies the Ballerina module. Added on every observer context at construction time.      |
| `protocol`     | `local`        | Yes     | Yes    | The wire protocol. Set to `local` for the local filesystem module.                          |
| `type`         | `listener`     | Yes     | Yes    | Whether this is a client or listener operation. Set to `listener` for directory listener events. |
| `remote.url`   | `localhost`    | Yes     | Yes    | The server endpoint. Set to `localhost` for local filesystem operations.                    |
| `watched.path` | Directory path | Yes     | Yes    | The monitored directory path. Distinguishes services monitoring different directories.       |
| `host`         | Local hostname | Yes     | Yes    | Hostname of the current instance. Omitted if hostname resolution fails.                     |

#### 7.2.2. Action Tags

These tags capture the sequence of events during a file's journey through the listener lifecycle.

| Tag             | Values                            | Metrics | Traces | Notes                                                                                      |
|-----------------|-----------------------------------|---------|--------|--------------------------------------------------------------------------------------------|
| `action.type`   | `file_event`                      | Yes     | Yes    | Covers all listener file lifecycle events (found, dispatched, handled).                     |
| `file.stage`    | `found`, `dispatched`, `handled`  | Yes     | No     | Maps to the three-stage file lifecycle for the local file module. Present on metric counters only; no span is created for the found or dispatched stages, and the handled stage's span is auto-instrumented before the stage is known. |
| `event.type`    | `create`, `delete`, `modify`      | No      | Yes    | Type of listener event. `create` for file creation, `delete` for deletion, `modify` for modification. Present on trace spans only. |
| `handler.name`  | Handler method name               | Yes     | Yes    | Identifies which handler processed the file (e.g. `onCreate`, `onDelete`, `onModify`). Set to `none` on `file.stage=found` or skipped files. |

#### 7.2.3. Outcome Tags

These tags classify the final status of operations.

| Tag          | Values                         | Metrics | Traces | Notes                                                                                      |
|--------------|--------------------------------|---------|--------|--------------------------------------------------------------------------------------------|
| `outcome`    | `success`, `failure`, `skipped`| Yes     | No     | Result of an operation. `skipped` indicates a file event that matched no handler. Present on metric counters only; the outcome is determined after the auto-instrumented span completes. |
| `error.type` | Ballerina error type name, `no_handler_matched` | Yes | No | Only meaningful when `outcome=failure` or `outcome=skipped`. Set to `none` when not applicable. Present on metric counters only. |

#### 7.2.4. File-Scoped Tags

These tags contain specific details about individual file objects. They are excluded from metrics to avoid cardinality
explosion and appear only on trace spans.

| Tag                  | Values                    | Metrics | Traces | Notes                                                                     |
|----------------------|---------------------------|---------|--------|---------------------------------------------------------------------------|
| `file.path`          | Full path of the file     | No      | Yes    | Added as a span-only property on the lifecycle parent span and handler strand context. |
| `file.size`          | Size in bytes             | No      | Yes    | Added as a tag on the lifecycle parent span when the file exists. Written directly to the `BSpan` to remain trace-only. |
| `file.modified_time` | Last-modified timestamp   | No      | Yes    | Added as a tag on the lifecycle parent span when the file exists. Written directly to the `BSpan` to remain trace-only. |

### 7.3. File Lifecycle

Every file event processed by the directory listener passes through up to three stages. A parent span covers the entire
lifecycle of a single file event, and each handler invocation produces a child span parented to it. Each stage also
publishes an independent `file_events_total` counter increment.

#### 7.3.1. Stage 1: Found

The directory watcher detects a filesystem event (create, delete, or modify) in the monitored directory.

The counter entry carries `action.type=file_event`, `file.stage=found`, along with the standard identity tags
(`module`, `type=listener`, `remote.url=localhost`, `watched.path`, `protocol=local`, `host`). The `handler.name`,
`outcome`, and `error.type` tags are set to `none` because the handler has not yet been determined.

After the found event is recorded, the routing logic attempts to match the event to a handler based on the event type.
If no registered service has a matching handler method (e.g., no `onCreate` for a create event), a second counter entry
is published with `outcome=skipped` and `error.type=no_handler_matched`. The event goes no further in the lifecycle.

#### 7.3.2. Stage 2: Dispatched

The routing logic matches the file event to a specific handler method (`onCreate`, `onDelete`, or `onModify`) in a
registered service. At this point the event is "handed over" to the handler but the handler has not yet been invoked.

The counter entry carries `action.type=file_event`, `file.stage=dispatched`, and `handler.name` set to the matched
handler method name, along with the standard identity tags.

#### 7.3.3. Stage 3: Handled

The matched handler method is invoked with the file event. The handler executes the user's business logic. When the
handler returns, the handled stage is recorded.

If the handler returns nil, the outcome is `success`. If it returns an error, the outcome is `failure` and `error.type`
is set to the Ballerina error type name.

The handler invocation creates an auto-instrumented child span under the per-file lifecycle parent span. The child span
carries `event.type` and `handler.name` as tags. The `file.size` and `file.modified_time` tags are written directly
to the lifecycle parent span's `BSpan` so they remain trace-only without appearing in framework-level metrics.

The `file_resource_execution_duration_seconds` metric is also recorded at this stage, measuring the elapsed time of the
handler method invocation.

### 7.4. Tracing

With the observability implementation, the complete lifecycle of a file event can be observed through a single trace.
The trace structure is:

```
Per-File Lifecycle Span (parent)
  |-- file.path = /watched/dir/example.txt
  |-- file.size = 1024
  |-- file.modified_time = 1695384000000
  |
  +-- Handler Execution Span (child)
        |-- event.type = create
        |-- handler.name = onCreate
```

The parent span is created when the file event is discovered and finished after all handler invocations complete. Each
handler invocation (there may be multiple if several services are registered) produces a child span automatically via
the Ballerina runtime's auto-instrumentation when `callMethod` is invoked with the embedded observer context in the
strand metadata.

Span-only tags (`file.path`, `file.size`, `file.modified_time`) are written directly to the lifecycle parent's `BSpan`
rather than through `ObserverContext` tags. This keeps them trace-only: `ObserverContext.addTag` would propagate to
framework-level metrics causing cardinality explosion, while `ObserverContext.addProperty` is not copied onto the span
by the runtime's `TracingUtils.stopObservation`.
