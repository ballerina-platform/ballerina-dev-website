# Specification: Ballerina FTP Library

_Owners_: @shafreenAnfar @dilanSachi @Bhashinee \
_Reviewers_: @shafreenAnfar @Bhashinee \
_Created_: 2020/10/28 \
_Updated_: 2026/09/01 \
_Edition_: Swan Lake

## Introduction

This is the specification for the FTP standard library of the [Ballerina language](https://ballerina.io/), which provides FTP client and listener functionalities to send and receive files by connecting to FTP/SFTP servers.

The FTP library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` on GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Security](#2-security)
   * 2.1 [Authentication](#21-authentication)
   * 2.2 [Authentication Methods](#22-authentication-methods)
3. [Client](#3-client)
   * 3.1 [Initializing the Client](#31-initializing-the-client)
      * 3.1.1 [Insecure Client](#311-insecure-client)
      * 3.1.2 [Secure Client](#312-secure-client)
      * 3.1.3 [Secure FTPS Client](#313-secure-ftps-client)
   * 3.2 [Writing Files](#32-writing-files)
      * 3.2.1 [Write Operations](#321-write-operations)
      * 3.2.2 [Streaming Writes](#322-streaming-writes)
   * 3.3 [Reading Files](#33-reading-files)
      * 3.3.1 [Read Operations](#331-read-operations)
      * 3.3.2 [Streaming Reads](#332-streaming-reads)
      * 3.3.3 [Data Binding](#333-data-binding)
   * 3.4 [File Management](#34-file-management)
   * 3.5 [Retry Configuration](#35-retry-configuration)
   * 3.6 [Circuit Breaker](#36-circuit-breaker)
      * 3.6.1 [State Machine](#361-state-machine)
      * 3.6.2 [Configuration](#362-configuration)
      * 3.6.3 [Failure Categories](#363-failure-categories)
4. [Listener](#4-listener)
   * 4.1 [Initializing the Listener](#41-initializing-the-listener)
      * 4.1.1 [Insecure Listener](#411-insecure-listener)
      * 4.1.2 [Secure Listener](#412-secure-listener)
   * 4.2 [Service](#42-service)
      * 4.2.1 [Service Declaration](#421-service-declaration)
      * 4.2.2 [Service Configuration Annotation](#422-service-configuration-annotation)
   * 4.3 [File Change Callbacks](#43-file-change-callbacks)
      * 4.3.1 [Format-Specific Callbacks](#431-format-specific-callbacks)
      * 4.3.2 [File Delete Callback](#432-file-delete-callback)
      * 4.3.3 [Error Callback](#433-error-callback)
      * 4.3.4 [Generic File Change Callback (Deprecated)](#434-generic-file-change-callback-deprecated)
   * 4.4 [Post-Processing Actions](#44-post-processing-actions)
   * 4.5 [File Filtering](#45-file-filtering)
      * 4.5.1 [File Name Pattern](#451-file-name-pattern)
      * 4.5.2 [File Age Filter](#452-file-age-filter)
      * 4.5.3 [File Dependency Conditions](#453-file-dependency-conditions)
   * 4.6 [Distributed Coordination](#46-distributed-coordination)
5. [Caller](#5-caller)
6. [Errors](#6-errors)
   * 6.1 [Error Hierarchy](#61-error-hierarchy)
   * 6.2 [Error Handling](#62-error-handling)
7. [Observability](#7-observability)
   * 7.1 [Metrics](#71-metrics)
      * 7.1.1 [Gauges](#711-gauges)
      * 7.1.2 [Explicit Counters](#712-explicit-counters)
      * 7.1.3 [Duration Gauges](#713-duration-gauges)
      * 7.1.4 [Querying Metrics](#714-querying-metrics)
   * 7.2 [Tags](#72-tags)
      * 7.2.1 [Identity Tags](#721-identity-tags)
      * 7.2.2 [Action Tags](#722-action-tags)
      * 7.2.3 [Outcome Tags](#723-outcome-tags)
      * 7.2.4 [Tag Consistency Rule](#724-tag-consistency-rule)
      * 7.2.5 [File-Scoped Tags (Trace-Only)](#725-file-scoped-tags-trace-only)
      * 7.2.6 [Client Operation Tag Mapping](#726-client-operation-tag-mapping)
      * 7.2.7 [Listener Event Tag Mapping](#727-listener-event-tag-mapping)
      * 7.2.8 [File Lifecycle Stages](#728-file-lifecycle-stages)
   * 7.3 [Observability Outputs per File](#73-observability-outputs-per-file)
   * 7.4 [Sample PromQL Queries](#74-sample-promql-queries)
   * 7.5 [Enabling Observability](#75-enabling-observability)
   * 7.6 [Observability Safety Rules](#76-observability-safety-rules)

## 1. Overview

FTP (File Transfer Protocol) is a standard network protocol for transferring files between a client and a server. SFTP (SSH File Transfer Protocol) adds a layer of security by encrypting the connection using SSH, protecting data in transit. The Ballerina FTP library supports both protocols.

The library exposes two core components:

- **Client** — The `ftp:Client` connects to an FTP/SFTP server and performs file operations such as reading, writing, moving, copying, and listing files.
- **Listener** — The `ftp:Listener` monitors a remote FTP/SFTP directory and invokes service callbacks when files are added or removed.

## 2. Security

### 2.1 Authentication

Both the `ftp:Client` and `ftp:Listener` support authenticated connections via the `auth` configuration field. Authentication is configured using credentials (username and password), a private key, or both. When both are provided, the preferred authentication method can be specified explicitly using an ordered list. If no preference is given, the server and client negotiate the method.

The `userDirIsRoot` configuration controls how the server root is interpreted. When set to `true`, the login home directory is treated as `/`, which is the correct setting for chrooted server environments. When `false`, the actual server root is used, which may cause failures on servers that restrict root access.

### 2.2 Authentication Methods

The following authentication methods are supported for SFTP connections:

- **PUBLICKEY** — Authenticates using a private key file, optionally protected by a passphrase.
- **PASSWORD** — Authenticates using a username and password.
- **KEYBOARD_INTERACTIVE** — An interactive challenge-response authentication mechanism.
- **GSSAPI_WITH_MIC** — Enterprise authentication using a GSS-API mechanism (e.g., Kerberos).

When a private key is configured, it is used for public key authentication. When credentials are configured, they are used for password or keyboard-interactive authentication. The `preferredMethods` field controls the order in which authentication methods are tried.

## 3. Client

The `ftp:Client` connects to an FTP or SFTP server and provides operations for reading, writing, and managing files. All client operations are isolated and can be called concurrently.

### 3.1 Initializing the Client

The `ftp:Client` is initialized with a `ClientConfiguration` record that specifies the target server. If initialization fails (for example, due to a connection error), an `ftp:Error` is returned.

#### 3.1.1 Insecure Client

An insecure FTP client is initialized by specifying the `FTP` protocol, along with the host and port of the target server.

###### Example: Insecure FTP Client

```ballerina
ftp:Client ftpClient = check new ({
    protocol: ftp:FTP,
    host: "ftp.example.com",
    port: 21
});
```

#### 3.1.2 Secure Client

A secure SFTP client is initialized by specifying the `SFTP` protocol and providing authentication details. Both credentials and a private key may be provided simultaneously.

###### Example: SFTP Client with Credentials

```ballerina
ftp:Client sftpClient = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {
        credentials: {
            username: "user",
            password: "pass"
        }
    },
    userDirIsRoot: true
});
```

###### Example: SFTP Client with Private Key

```ballerina
ftp:Client sftpClient = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {
        credentials: {username: "user"},
        privateKey: {
            path: "/path/to/private.key",
            password: "keypassphrase"
        },
        preferredMethods: [ftp:PUBLICKEY]
    },
    userDirIsRoot: true
});
```

#### 3.1.3 Secure FTPS Client

A secure FTPS client is initialized by specifying the `FTPS` protocol. Authentication details are optional — when `secureSocket` is omitted the client uses the JDK's default system truststore (`cacerts`) for chain validation and verifies the server hostname against the certificate. The optional `secureSocket` record controls SSL/TLS behaviour:

- `key` — Keystore for client-side (mTLS) authentication.
- `cert` — Truststore for validating the server certificate chain. When omitted, the JDK's default system truststore is used.
- `mode` — `EXPLICIT` (default; start plain, upgrade via `AUTH TLS`) or `IMPLICIT` (TLS from connect).
- `dataChannelProtection` — `PRIVATE` (default), `SAFE`, `CONFIDENTIAL`, or `CLEAR`.
- `verifyHostName` — Whether to verify that the server certificate's CN/SAN matches the host being connected to. Defaults to `true`. Set to `false` only for development or testing when a trusted certificate's identity does not match the host. Self-signed or private-CA certificates must still be trusted via `secureSocket.cert` or the default truststore.

Connection attempts fail at the TLS handshake with an `ftp:Error` when the server certificate is not trusted by the configured truststore (or the JDK default), or when `verifyHostName` is `true` and the certificate identity does not match the connect host.

###### Example: FTPS Client

```ballerina
ftp:Client ftpsClient = check new ({
    protocol: ftp:FTPS,
    host: "ftps.example.com",
    port: 21,
    auth: {
        credentials: {username: "user", password: "pass"},
        secureSocket: {
            cert: {path: "/path/to/truststore.p12", password: "changeit"},
            mode: ftp:EXPLICIT
        }
    }
});
```

### 3.2 Writing Files

#### 3.2.1 Write Operations

The client provides typed write methods for writing content in different formats to the server. All write methods accept a `FileWriteOption` parameter that controls whether the operation overwrites an existing file (`OVERWRITE`) or appends to it (`APPEND`). The default is `OVERWRITE`.

- `putBytes(path, content)` — Writes raw binary content to the specified path.
- `putText(path, content)` — Writes a UTF-8 encoded string to the specified path.
- `putJson(path, content)` — Serializes and writes a JSON value or a Ballerina record to the specified path.
- `putXml(path, content)` — Serializes and writes an XML value or a Ballerina record to the specified path.
- `putCsv(path, content)` — Serializes and writes tabular data (as a 2D string array or a record array) in CSV format to the specified path.

###### Example: Writing a Text File

```ballerina
check ftpClient->putText("/uploads/hello.txt", "Hello, World!");
```

###### Example: Appending to an Existing File

```ballerina
check ftpClient->putText("/logs/app.log", "New log entry\n", ftp:APPEND);
```

#### 3.2.2 Streaming Writes

For large files, the client supports streaming write methods that process data in chunks without loading the entire content into memory.

- `putBytesAsStream(path, content)` — Writes a stream of byte chunks to the specified path.
- `putCsvAsStream(path, content)` — Writes a stream of CSV rows (each row as a string array or record) to the specified path.

###### Example: Streaming a Large File

```ballerina
stream<io:Block, io:Error?> fileStream = check io:fileReadBlocksAsStream("/local/data.bin", 4096);
check ftpClient->putBytesAsStream("/uploads/data.bin", fileStream);
```

### 3.3 Reading Files

#### 3.3.1 Read Operations

The client provides typed read methods for reading files in different formats. These methods retrieve the entire file content into memory and support automatic retry when a retry configuration is provided (see [Section 3.5](#35-retry-configuration)).

- `getBytes(path)` — Reads the file at the specified path as a raw byte array.
- `getText(path)` — Reads the file at the specified path as a UTF-8 encoded string.
- `getJson(path)` — Reads and parses the file as JSON, with optional data binding to a target type.
- `getXml(path)` — Reads and parses the file as XML, with optional data binding to a target type.
- `getCsv(path)` — Reads and parses a CSV file, with optional data binding to a target type. The first row of the file is treated as the header row.

If the file content cannot be parsed or bound to the expected type, a `ContentBindingError` is returned.

###### Example: Reading a JSON File

```ballerina
type Order record {|
    int id;
    string item;
|};

Order order = check ftpClient->getJson("/data/order.json");
```

#### 3.3.2 Streaming Reads

For large files, the client supports streaming read methods that return data as a stream, allowing processing of individual chunks without loading the full file into memory.

- `get(path)` — Returns a raw byte stream from the remote file. The caller is responsible for closing the stream after use.
- `getBytesAsStream(path)` — Returns a stream of byte chunks from the remote file.
- `getCsvAsStream(path)` — Returns a stream of CSV rows, with optional data binding to a target row type.

###### Example: Streaming a Large CSV File

```ballerina
stream<Employee, error?> rows = check ftpClient->getCsvAsStream("/reports/employees.csv");
check rows.forEach(function(Employee emp) {
    io:println(emp.name);
});
```

#### 3.3.3 Data Binding

The typed read methods (`getJson`, `getXml`, `getCsv`, `getCsvAsStream`) support data binding via the `targetType` parameter. When a target type is provided, the parsed content is automatically bound to the specified Ballerina type. If parsing or binding fails, a `ContentBindingError` is returned.

The `laxDataBinding` configuration on the client controls whether missing or null fields are permitted when binding structured data. When `true`, missing fields are ignored and null values are accepted. When `false` (the default), strict binding is enforced.

### 3.4 File Management

The client provides the following file and directory management operations. All operations return an `ftp:Error` on failure.

- `mkdir(path)` — Creates a new directory at the specified path on the server.
- `rmdir(path)` — Deletes an empty directory at the specified path on the server. The operation fails if the directory is not empty.
- `delete(path)` — Deletes the file at the specified path on the server.
- `rename(origin, destination)` — Renames a file or moves it to a new location within the same server. The destination path must not already exist.
- `move(sourcePath, destinationPath)` — Moves a file from one location to another on the server.
- `copy(sourcePath, destinationPath)` — Creates a copy of a file at a new location on the server.
- `exists(path)` — Returns `true` if the file or directory at the specified path exists, or `false` otherwise.
- `size(path)` — Returns the size of the file at the specified path in bytes.
- `list(path)` — Returns an array of `ftp:FileInfo` records representing the contents of the specified directory.
- `isDirectory(path)` — Returns `true` if the resource at the specified path is a directory.

###### Example: Listing Files in a Directory

```ballerina
ftp:FileInfo[] files = check ftpClient->list("/incoming");
foreach ftp:FileInfo file in files {
    io:println(file.name + " (" + file.size.toString() + " bytes)");
}
```

### 3.5 Retry Configuration

The client can be configured to automatically retry failed read operations using exponential backoff. When a retry configuration is provided, the non-streaming read operations (`getBytes`, `getText`, `getJson`, `getXml`, `getCsv`) are automatically retried on transient failures.

The retry behavior is controlled by the following parameters:
- **count** — The maximum number of retry attempts. Defaults to `3`.
- **interval** — The initial wait interval in seconds before the first retry. Defaults to `1.0`.
- **backOffFactor** — The multiplier applied to the wait interval after each failed attempt. Defaults to `2.0`.
- **maxWaitInterval** — The maximum wait interval in seconds between retries, regardless of the backoff calculation. Defaults to `30.0`.

When all retry attempts are exhausted without success, an `AllRetryAttemptsFailedError` is returned.

###### Example: Client with Retry Configuration

```ballerina
ftp:Client ftpClient = check new ({
    protocol: ftp:FTP,
    host: "ftp.example.com",
    retryConfig: {
        count: 5,
        interval: 2.0,
        backOffFactor: 1.5,
        maxWaitInterval: 20.0
    }
});
```

### 3.6 Circuit Breaker

The circuit breaker pattern prevents cascading failures when the FTP server becomes unavailable. When the ratio of failed operations within a rolling time window exceeds a configured threshold, the circuit trips to the OPEN state and subsequent requests fail immediately with a `CircuitBreakerOpenError`, without attempting to connect to the server.

#### 3.6.1 State Machine

The circuit breaker operates in three states:

- **CLOSED** — Normal operating state. All requests proceed normally, and failures are tracked within the rolling window.
- **OPEN** — The failure threshold has been exceeded. All requests are rejected immediately with a `CircuitBreakerOpenError`. No connections to the server are attempted.
- **HALF_OPEN** — After the configured reset time elapses, the circuit transitions to HALF_OPEN. A single trial request is allowed. If it succeeds, the circuit returns to CLOSED. If it fails, the circuit returns to OPEN.

#### 3.6.2 Configuration

The circuit breaker is configured using a rolling window that tracks failures over a sliding time period. The following parameters control the behavior:

- **failureThreshold** — The ratio of failures to total requests (between `0.0` and `1.0`) that trips the circuit. Defaults to `0.5`.
- **resetTime** — The number of seconds to wait in the OPEN state before transitioning to HALF_OPEN. Defaults to `30`.
- **rollingWindow.requestVolumeThreshold** — The minimum number of requests that must occur within the time window before the circuit can trip. Defaults to `10`.
- **rollingWindow.timeWindow** — The duration of the rolling window in seconds for tracking failures. Defaults to `60`.
- **rollingWindow.bucketSize** — The size of each time bucket within the rolling window in seconds. Defaults to `10`.
- **failureCategories** — The categories of errors that count as failures towards tripping the circuit. Defaults to `[CONNECTION_ERROR, TRANSIENT_ERROR]`.

###### Example: Client with Circuit Breaker

```ballerina
ftp:Client ftpClient = check new ({
    protocol: ftp:FTP,
    host: "ftp.example.com",
    circuitBreaker: {
        failureThreshold: 0.5,
        resetTime: 30,
        rollingWindow: {
            requestVolumeThreshold: 5,
            timeWindow: 60,
            bucketSize: 10
        },
        failureCategories: [ftp:CONNECTION_ERROR, ftp:TRANSIENT_ERROR]
    }
});
```

#### 3.6.3 Failure Categories

The `failureCategories` field specifies which error types count as failures when evaluating the circuit breaker threshold:

- **CONNECTION_ERROR** — Network failures, connection timeouts, and unreachable hosts.
- **AUTHENTICATION_ERROR** — Invalid credentials or authorization failures.
- **TRANSIENT_ERROR** — Server disconnection or temporary unavailability during an operation.
- **ALL_ERRORS** — Every error type counts as a failure.

## 4. Listener

The `ftp:Listener` polls a remote FTP or SFTP directory at a configured interval and detects file changes. When files are added or removed, the listener dispatches events to the attached services by invoking their callback methods.

### 4.1 Initializing the Listener

The `ftp:Listener` is initialized with a `ListenerConfiguration` record that specifies the target server and polling behavior. The `pollingInterval` field controls how frequently (in seconds) the server is checked for changes. The default polling interval is 60 seconds.

#### 4.1.1 Insecure Listener

An insecure FTP listener is initialized by specifying the host and port. The monitored directory path is configured via the `@ftp:ServiceConfig` annotation on the attached service.

###### Example: Insecure FTP Listener

```ballerina
listener ftp:Listener ftpListener = check new ({
    protocol: ftp:FTP,
    host: "ftp.example.com",
    port: 21,
    pollingInterval: 30
});
```

#### 4.1.2 Secure Listener

A secure SFTP listener is initialized in the same way as a secure client, by specifying the `SFTP` protocol and providing authentication details.

###### Example: SFTP Listener

```ballerina
listener ftp:Listener ftpListener = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {
        credentials: {
            username: "user",
            password: "pass"
        },
        privateKey: {
            path: "/path/to/private.key",
            password: "keypassphrase"
        }
    },
    pollingInterval: 60,
    userDirIsRoot: true
});
```

### 4.2 Service

#### 4.2.1 Service Declaration

A service is attached to an `ftp:Listener` to receive file change notifications. Services may be declared statically at module level or attached dynamically using the listener's `attach()` method.

###### Example: Static Service Declaration

```ballerina
service ftp:Service on ftpListener {
    remote function onFileChange(ftp:WatchEvent & readonly event, ftp:Caller caller) returns error? {
        foreach ftp:FileInfo addedFile in event.addedFiles {
            io:println("File added: " + addedFile.path);
        }
    }
}
```

#### 4.2.2 Service Configuration Annotation

The `@ftp:ServiceConfig` annotation configures the monitoring path and file filtering options at the service level. This allows multiple services attached to a single listener to monitor different directories independently.

The `path` field is mandatory and must be an absolute path starting with `/`. The `fileNamePattern` field accepts a regular expression to filter which files trigger events.

If any service attached to a listener uses `@ftp:ServiceConfig`, then all services attached to that listener must use it. Mixing annotated and unannotated services on the same listener results in an `InvalidConfigError`.

When `@ftp:ServiceConfig` is used, any monitoring-related fields set at the listener level (`path`, `fileNamePattern`, `fileAgeFilter`, `fileDependencyConditions`) are ignored and a deprecation warning is logged.

###### Example: Multiple Services on One Listener

```ballerina
listener ftp:Listener ftpListener = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {credentials: {username: "user", password: "pass"}},
    pollingInterval: 30
});

@ftp:ServiceConfig {
    path: "/incoming/orders",
    fileNamePattern: ".*\\.csv"
}
service on ftpListener {
    remote function onFileCsv(record {}[] content, ftp:FileInfo fileInfo) returns error? {
        // Processes CSV files from /incoming/orders
    }
}

@ftp:ServiceConfig {
    path: "/incoming/configs",
    fileNamePattern: ".*\\.json"
}
service on ftpListener {
    remote function onFileJson(json content, ftp:FileInfo fileInfo) returns error? {
        // Processes JSON files from /incoming/configs
    }
}
```

### 4.3 File Change Callbacks

When the listener detects a file change, it invokes the appropriate callback method on the attached service. The `ftp:Caller` parameter is optional in all callbacks; it may be omitted if FTP operations are not required during processing.

The `ftp:FileInfo` record provides metadata about the file, including its path, name, size, last modified timestamp, and whether it is a file or directory.

#### 4.3.1 Format-Specific Callbacks

In addition to the generic `onFileChange` callback, the listener supports format-specific callbacks that automatically parse file content and pass it to the handler as a typed value. Files are routed to handlers based on their extension: `.txt` → `onFileText`, `.json` → `onFileJson`, `.xml` → `onFileXml`, `.csv` → `onFileCsv`. Files with any other extension are routed to `onFile`. Extension-based routing can be customized per callback using the `@ftp:FunctionConfig` annotation.

**`onFileText`** — Invoked when a `.txt` file is added. The file content is passed as a UTF-8 string.

###### Example: Text File Handler

```ballerina
remote function onFileText(string content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    io:println("Processing: " + fileInfo.name);
    io:println(content);
}
```

**`onFileJson`** — Invoked when a `.json` file is added. The content is parsed as JSON and passed as either a `json` value or a data-bound record, depending on the declared parameter type.

###### Example: JSON File Handler with Data Binding

```ballerina
type Config record {|
    string env;
    int maxRetries;
|};

remote function onFileJson(Config content, ftp:FileInfo fileInfo) returns error? {
    io:println("Environment: " + content.env);
}
```

**`onFileXml`** — Invoked when a `.xml` file is added. The content is parsed as XML and passed as either an `xml` value or a data-bound record.

**`onFileCsv`** — Invoked when a `.csv` file is added. The first row of the CSV file is treated as the header row. The following parameter types are supported:
- `string[][]` — All rows loaded into memory as arrays of strings.
- `record {}[]` — All rows loaded into memory and data-bound to the record type.
- `stream<string[], error>` — Rows processed one at a time as string arrays (memory-efficient for large files).
- `stream<record {}, error>` — Rows processed one at a time and data-bound to the record type.

###### Example: CSV File Handler with Streaming

```ballerina
type Employee record {|
    string name;
    string department;
|};

remote function onFileCsv(stream<Employee, error> content, ftp:FileInfo fileInfo) returns error? {
    check content.forEach(function(Employee emp) {
        io:println(emp.name);
    });
}
```

**`onFile`** — Invoked when a file with an unrecognized extension is added. The content is passed as either a `byte[]` (entire file in memory) or a `stream<byte[], error>` (for large files).

#### 4.3.2 File Delete Callback

The `onFileDelete` callback is invoked when a file is removed from the monitored directory. The deleted file's path is passed as a string.

###### Example: File Delete Handler

```ballerina
remote function onFileDelete(string deletedFile, ftp:Caller caller) returns error? {
    io:println("Deleted: " + deletedFile);
}
```

#### 4.3.3 Error Callback

The `onError` callback is invoked when a content binding error occurs while parsing a file. This provides a centralized location for handling files that cannot be parsed into the expected format.

The callback receives an `ftp:Error` value. When the error is a `ContentBindingError`, its detail record contains the `filePath` of the file that failed and the raw `content` as a byte array.

If `onError` is not defined, binding errors are logged and the affected file is skipped.

###### Example: Error Handler

```ballerina
remote function onError(ftp:Error err, ftp:Caller caller) returns error? {
    if err is ftp:ContentBindingError {
        string? filePath = err.detail().filePath;
        log:printError("Binding failed for file: " + (filePath ?: "unknown"), err);
        if filePath is string {
            check caller->move(filePath, "/error/" + filePath);
        }
    }
}
```

#### 4.3.4 Generic File Change Callback (Deprecated)

The `onFileChange` callback is the general-purpose handler for file system events. It receives a `ftp:WatchEvent` record containing two fields:
- `addedFiles` — An array of `ftp:FileInfo` records for newly detected files.
- `deletedFiles` — An array of strings containing the paths of deleted files.

###### Example: Generic File Change Handler

```ballerina
remote function onFileChange(ftp:WatchEvent & readonly event, ftp:Caller caller) returns error? {
    foreach ftp:FileInfo file in event.addedFiles {
        io:println("New file: " + file.path);
    }
    foreach string path in event.deletedFiles {
        io:println("Deleted: " + path);
    }
}
```

### 4.4 Post-Processing Actions

The `@ftp:FunctionConfig` annotation supports automatic file actions after a callback completes. This eliminates the need for boilerplate file management at the end of each handler.

The annotation supports the following actions via the `afterProcess` and `afterError` fields:

- **`DELETE`** — The file is deleted after the handler returns.
- **`MOVE`** — The file is moved to a specified destination directory after the handler returns. The `moveTo` field specifies the destination path. The `preserveSubDirs` flag (default `true`) controls whether the subdirectory structure relative to the monitored path is preserved in the destination.

`afterProcess` is executed when the handler returns successfully. `afterError` is executed when the handler returns an error or panics. If neither is specified, no post-processing action is taken.

When using `MOVE` with `preserveSubDirs: true`, the destination directory structure must already exist on the server. For example, if monitoring `/input/` and a file at `/input/orders/2024/file.csv` is processed with `moveTo: "/archive/"`, the file is moved to `/archive/orders/2024/file.csv`.

###### Example: Delete After Processing

```ballerina
service on ftpListener {
    @ftp:FunctionConfig {
        afterProcess: ftp:DELETE
    }
    remote function onFileJson(json content, ftp:FileInfo fileInfo) returns error? {
        processJson(content);
    }
}
```

###### Example: Move to Archive on Success, Move to Error Directory on Failure

```ballerina
service on ftpListener {
    @ftp:FunctionConfig {
        afterProcess: {moveTo: "/archive/success/"},
        afterError: {moveTo: "/archive/failed/"}
    }
    remote function onFileXml(xml content, ftp:FileInfo fileInfo) returns error? {
        check processXml(content);
    }
}
```

###### Example: Routing by File Pattern

The `fileNamePattern` field on `@ftp:FunctionConfig` overrides the extension-based routing for that specific callback, allowing fine-grained control over which files trigger which handler.

```ballerina
service on ftpListener {
    @ftp:FunctionConfig {
        fileNamePattern: "order_.*\\.csv",
        afterProcess: {moveTo: "/processed/"}
    }
    remote function onFileCsv(Employee[] content, ftp:FileInfo fileInfo) returns error? {
        saveEmployees(content);
    }
}
```

### 4.5 File Filtering

#### 4.5.1 File Name Pattern

The `fileNamePattern` field in `@ftp:ServiceConfig` accepts a Java regular expression. Only files whose names match the pattern trigger events. If no pattern is specified, all files in the monitored directory trigger events.

#### 4.5.2 File Age Filter

The `fileAgeFilter` in `@ftp:ServiceConfig` filters files based on their age. `minAge` (in seconds) skips files younger than the threshold — useful for ignoring files still being written by an upstream process. `maxAge` (in seconds) skips files older than the threshold. Either bound may be set independently; both are optional.

Both values are validated when the listener starts. The listener fails with an `InvalidConfigError` if `minAge` or `maxAge` is negative, or if `minAge` exceeds `maxAge`.

#### 4.5.3 File Dependency Conditions

The `fileDependencyConditions` field in `@ftp:ServiceConfig` allows conditional file processing based on the presence of related files. A dependency condition specifies a target file pattern and a list of required companion files that must also be present before the target file triggers an event.

The `matchingMode` field controls whether `ALL` required files or `ANY` of them must be present. Capture groups in the target pattern can be referenced in the required file patterns using `$1`, `$2`, etc.

###### Example: Process a CSV Only When a Marker File Exists

```ballerina
@ftp:ServiceConfig {
    path: "/incoming/orders",
    fileNamePattern: "order_.*\\.csv",
    fileDependencyConditions: [
        {
            targetPattern: "order_(\\d+)\\.csv",
            requiredFiles: ["order_$1.marker"],
            matchingMode: ftp:ALL
        }
    ]
}
service on ftpListener {
    remote function onFileCsv(record {}[] content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
        check caller->move(fileInfo.path, "/processed/" + fileInfo.name);
    }
}
```

### 4.6 Distributed Coordination

The FTP listener supports distributed coordination for high-availability deployments. When multiple listener instances are deployed across nodes, coordination ensures that only one instance actively polls the FTP server at any time, while the others act as warm standby nodes. This prevents duplicate file processing and provides automatic failover.

Coordination is enabled by providing a `CoordinationConfig` in the `ListenerConfiguration`. All instances in a coordination group must be configured with the same `coordinationGroup` name and a unique `memberId` per node. Coordination state is managed through a shared database (MySQL or PostgreSQL).

The coordination mechanism works as follows:

1. Members in the same `coordinationGroup` elect an active member through the shared database.
2. The active member updates a heartbeat record at the configured `heartbeatFrequency` interval (default: 1 second).
3. Standby members monitor the active member's heartbeat every `livenessCheckInterval` seconds (default: 30 seconds).
4. If the heartbeat becomes stale, a standby member elects itself as the new active member and begins polling.
5. Only the active member's polling cycle executes; standby members skip polling silently.

###### Example: Listener with Distributed Coordination

```ballerina
listener ftp:Listener ftpListener = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {credentials: {username: "user", password: "pass"}},
    coordination: {
        memberId: "node-1",
        coordinationGroup: "ftp-processors",
        livenessCheckInterval: 30,
        heartbeatFrequency: 1,
        databaseConfig: <task:MysqlConfig>{
            host: "db.example.com",
            user: "dbuser",
            password: "dbpass",
            database: "coordination_db"
        }
    }
});
```

## 5. Caller

The `ftp:Caller` is a facade over an `ftp:Client` that is created internally by the runtime when a service callback declares it as a parameter. It exposes the same operations as `ftp:Client`, allowing service callbacks to perform FTP operations (reading, writing, moving, deleting files) on the same server that the listener is monitoring.

The `ftp:Caller` inherits its connection type (secure or insecure) from the listener configuration. It cannot be created directly by user code.

The `caller` parameter is optional in all service callbacks. If FTP operations are not required within a callback, the parameter may be omitted.

###### Example: Using the Caller to Move a Processed File

```ballerina
service on ftpListener {
    remote function onFileText(string content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
        processContent(content);
        check caller->move(fileInfo.path, "/processed/" + fileInfo.name);
    }
}
```

## 6. Errors

### 6.1 Error Hierarchy

The FTP library defines a hierarchy of error types rooted at `ftp:Error`. All FTP-specific errors are distinct subtypes of this base type, enabling both specific and general error handling.

- **`Error`** — The base error type for all FTP-related errors. All other error types are subtypes of this.
- **`ConnectionError`** — Represents failures when connecting to the server, including network failures, unreachable hosts, and connection refusals.
- **`FileNotFoundError`** — Represents failures when a requested file or directory does not exist on the server.
- **`FileAlreadyExistsError`** — Represents failures when attempting to create a file or directory that already exists.
- **`InvalidConfigError`** — Represents failures due to invalid configuration values, such as an invalid port number, regex pattern, or timeout value.
- **`ServiceUnavailableError`** — Represents transient server-side failures. Common causes include server overload, connection issues, or temporary file locks. Operations that return this error may succeed on retry.
- **`ContentBindingError`** — Represents failures when file content cannot be parsed or bound to the expected Ballerina type. This includes JSON/XML parse errors, CSV format errors, and record type binding failures. The error's detail record includes the `filePath` and the raw `content` as bytes.
- **`AllRetryAttemptsFailedError`** — Represents the failure returned when all retry attempts are exhausted. It wraps the last encountered error.
- **`CircuitBreakerOpenError`** — A subtype of `ServiceUnavailableError` returned when the circuit breaker is in the OPEN state. It indicates that requests are being blocked to prevent cascading failures.

### 6.2 Error Handling

Because all error types are subtypes of `ftp:Error`, callers can handle errors at any level of specificity. More specific error types should be checked before more general ones.

###### Example: Handling Specific Error Types

```ballerina
byte[]|ftp:Error result = ftpClient->getBytes("/data/file.txt");
if result is ftp:CircuitBreakerOpenError {
    // Circuit is open — server is currently unavailable
    applyFallback();
} else if result is ftp:FileNotFoundError {
    // File does not exist
    log:printWarn("File not found");
} else if result is ftp:ConnectionError {
    // Network-level failure
    log:printError("Connection failed", result);
} else if result is ftp:Error {
    // Any other FTP error
    log:printError("FTP operation failed", result);
} else {
    processBytes(result);
}
```

## 7. Observability

The FTP library provides built-in observability support through metrics and distributed tracing, following the unified observability specification for Ballerina file integration libraries. When observability is enabled in the Ballerina runtime, the FTP client and listener automatically report telemetry data without any additional configuration.

The observability model is module-agnostic: the FTP module publishes the same metric names and tag keys as other file integration modules (SMB, S3, etc.). Module-specific values appear only in tag values (e.g. `module=ftp`), never in metric names.

### 7.1 Metrics

#### 7.1.1 Gauges

| Metric Name | Type | Description |
|---|---|---|
| `ftp_active_connections` | Gauge | Number of active FTP/FTPS/SFTP client and listener objects. Incremented on init, decremented on close. Retained for backward compatibility. |

#### 7.1.2 Explicit Counters

| Metric Name | Type | Description |
|---|---|---|
| `file_bytes_transferred_total` | Counter | Total bytes read or written across operations. A sum of bytes, not a count of spans. |
| `file_events_total` | Counter | Total file lifecycle and poll events. Distinguishable by `action.type` tag: `poll_cycle` for poll cycles, `file_event` for file lifecycle stages. |

`file_bytes_transferred_total` is incremented for all non-streaming client read operations (`getBytes`, `getText`, `getJson`, `getXml`, `getCsv`), all client write operations (`putBytes`, `putText`, `putJson`, `putXml`, `putCsv`), and listener content reads during file processing. Every increment carries an `operation.type` tag (`get` or `put`) so that total bytes read across both client and listener can be queried uniformly via `file_bytes_transferred_total{operation_type="get"}`.

`file_events_total` is a single counter that tracks both poll cycles (`action.type=poll_cycle`) and all four file lifecycle stages (`action.type=file_event`, `file.stage=found|dispatched|handled|cleaned_up`). Each event produces an independent `+1` to the counter with its respective tags. Poll cycles are derived via `file_events_total{action_type="poll_cycle"}`; file stages via `file_events_total{file_stage="..."}`. This ensures everything is queryable from a single metric name.

For stages that go through `callMethod` (handled, cleaned_up), the framework additionally creates auto-instrumented spans that appear in distributed traces (Jaeger). However, `requests_total_value` is the **runtime's** metric — it counts one increment per span, not per file. A single poll that finds 50 files still produces only one span. Therefore, per-file counts must always come from `file_events_total`, not from `requests_total_value`. The only valid use of `requests_total_value` is for **client operations**, where one method call (e.g. `getBytes()`) equals one span equals one increment.

#### 7.1.3 Duration Gauges

| Metric Name | Type | Description |
|---|---|---|
| `file_databinding_duration_seconds` | Gauge (distribution) | Time in seconds to fetch and convert file content into the target type (JSON, XML, CSV, text, bytes, stream). Each invocation records a separate observation into a sliding-window distribution. |
| `file_resource_execution_duration_seconds` | Gauge (distribution) | Time in seconds to execute the user's resource/handler method. Each invocation records a separate observation into the same sliding-window distribution. |

Both duration gauges are configured with a `StatisticConfig` that tracks p50, p75, p90, p95, and p99 percentiles over a 5-minute sliding window. They carry `handler.name`, `outcome`, `protocol`, and `remote.url` tags.

- **`file_databinding_duration_seconds`** covers the full data binding pipeline: resolving the remote file, reading bytes over the network, and converting to the handler's parameter type (e.g. `json`, `xml`, `csv` record). For streaming handlers, this measures stream creation time only — actual data transfer is lazy.
- **`file_resource_execution_duration_seconds`** covers the actual elapsed time of the handler method invocation. This includes everything inside the user's handler — FTP operations, HTTP calls, database queries, custom logic, etc.

#### 7.1.4 Querying Metrics

The following table shows the recommended PromQL source for each logical metric:

| Logical Metric | Description | PromQL Source |
|---|---|---|
| Poll cycles | Poll cycles completed by a listener | `file_events_total{action_type="poll_cycle"}` |
| Files found | Files discovered during a poll | `file_events_total{file_stage="found"}` |
| Files dispatched | Files matched to a handler and handed over | `file_events_total{file_stage="dispatched"}` |
| Files skipped | Files found but matched no handler | `file_events_total{file_stage="found", outcome="skipped"}` |
| Files handled | Handler invocations completed | `file_events_total{file_stage="handled"}` |
| Files cleaned up | Post-processing actions completed (move/delete) | `file_events_total{file_stage="cleaned_up"}` |
| Handler errors | Errors from any code inside handler (FTP, HTTP, DB, etc.) | `file_events_total{file_stage="handled", outcome="failure"}` |
| Data binding duration | Time to fetch and convert file content | `file_databinding_duration_seconds` |
| Resource execution duration | Time to execute the handler method | `file_resource_execution_duration_seconds` |
| Bytes read (client + listener) | Total bytes read across all get operations | `file_bytes_transferred_total{operation_type="get"}` |
| Bytes written (client) | Total bytes written across all put operations | `file_bytes_transferred_total{operation_type="put"}` |
| Client operations | Client-initiated file operations (get, put, manage) | `requests_total_value{action_type="client_operation"}` |

### 7.2 Tags

All metrics and trace spans carry tags that identify the connection, operation, and lifecycle stage.

> **Note:** Prometheus normalizes `.` to `_` in label names (e.g. `action.type` → `action_type`, `file.stage` → `file_stage`). Jaeger and other trace backends preserve the original dotted names. The PromQL examples in this section use the Prometheus-normalized form.

#### 7.2.1 Identity Tags

| Tag | Values | Metrics | Traces | Notes |
|---|---|---|---|---|
| `module` | `ftp` | Yes | Yes | Identifies the Ballerina module. Always `ftp` regardless of wire protocol (FTP, FTPS, SFTP). |
| `protocol` | `ftp`, `ftps`, `sftp` | Yes | Yes | The wire protocol. |
| `type` | `client`, `listener` | Yes | Yes | Whether this is a client or listener operation. |
| `remote.url` | `host:port` | Yes | Yes | The server endpoint. Added on every observer context at construction time, from the connection configuration. Does not include the protocol prefix since `protocol` is a separate tag. |
| `watched.path` | Monitored directory path (e.g. `/uploads`) | Yes | Yes | Present on listener events and poll cycles. Distinguishes services monitoring different paths on the same server. |
| `host` | Local hostname | Yes | Yes | Hostname of the current instance. |

#### 7.2.2 Action Tags

These tags capture the sequence of events during a file's journey. They help map out the lifecycle stages, showing exactly how a file moves through the system.

| Tag | Values | Metrics | Traces | Notes |
|---|---|---|---|---|
| `action.type` | `poll_cycle`, `file_event`, `client_operation` | Yes | Yes | `poll_cycle` — Added on each poll cycle completion (`file_events_total` counter). One entry per poll, regardless of how many files are found. Only applicable to poll-based modules. `file_event` — Added on listener file lifecycle events (found, dispatched, handled, cleaned_up, skipped). `client_operation` — Added on client API calls. |
| `file.stage` | `found`, `dispatched`, `handled`, `cleaned_up` | Yes | Yes | Maps to the four-stage file lifecycle. Present on listener event spans and metrics. `found` — Added when a file is first discovered during a poll cycle. Every discovered file gets this, including files that will be skipped as no relevant handler found for that. `dispatched` — Added when the file is matched to a content handler and handed over for processing. `handled` — Added when the handler invocation completes. `cleaned_up` — Added when a post-processing action completes. Only present when `afterProcess` or `afterError` is configured. |
| `event.type` | `create`, `delete`, `error` | Yes | Yes | Type of listener event. `create` — File was added or modified. Added on handler invocation spans for content-based callbacks. `delete` — File was deleted. Added on `onFileDelete` handler spans. `error` — Content-binding failure. Added on `onError` handler spans. |
| `operation.type` | `get`, `put`, `manage` | Yes | Yes | Present on client operation spans (`action.type=client_operation`) and on `file_bytes_transferred_total` for both client and listener. `get` — Added on `getBytes()`, `getText()`, `getJson()`, `getXml()`, `getCsv()`, `getBytesAsStream()`, `getCsvAsStream()`. `put` — Added on `putBytes()`, `putText()`, `putJson()`, `putXml()`, `putCsv()`, `putBytesAsStream()`, `putCsvAsStream()`. `manage` — Added on `delete()`, `rename()`, `move()`, `copy()`, `mkdir()`, `rmdir()`, `isDirectory()`, `list()`, `exists()`, `size()`. |
| `handler.name` | Handler method name (e.g. `onFileJson`, `onFileCsv`) | Yes | Yes | Identifies which handler processed the file. Added on: `file.stage=dispatched` — when the handler is selected. `file.stage=handled` — when the handler completes. `file.stage=cleaned_up` — to link cleanup back to the handler that triggered it. Not present on `file.stage=found` (handler not yet determined) or skipped files. |
| `cleanup.action` | `move`, `delete` | Yes | Yes | `move` — When the file was moved to a destination directory. `delete` — When the file was deleted. Added on `file.stage=cleaned_up` events only. |

#### 7.2.3 Outcome Tags

| Tag | Values | Metrics | Traces | Notes |
|---|---|---|---|---|
| `outcome` | `success`, `failure`, `skipped` | Yes | Yes | Result of an operation. `skipped` indicates a file found but not matched to any handler. |
| `error.type` | `ConnectionError`, `AuthenticationError`, `FileNotFoundError`, `ContentBindingError`, `CloseError`, `no_handler_matched`, `binding_failed`, `move_failed`, `delete_failed`, etc. | Yes | Yes | Present when `outcome=failure` or `outcome=skipped`. Set to the Ballerina error type name for handler and client errors (which can be **any** error type — not just FTP errors, e.g. `ClientError` from HTTP, `ApplicationError` from DB). For lifecycle failures, predefined values are used: `no_handler_matched`, `binding_failed`, `move_failed`, `delete_failed`. Set to `none` when not applicable. |

#### 7.2.4 Tag Consistency Rule

Every increment of a given metric must carry the **same set of label keys**. Prometheus treats a series with labels `{a, b}` and a series with labels `{a, b, c}` as two different time series, even under the same metric name. If tags are conditionally absent, queries like `sum by (file_stage)` silently drop or double-count rows.

When a tag is not applicable for a given stage, the sentinel value `"none"` is used instead of omitting the tag. For example, `file_events_total` always carries `outcome`, `error.type`, `handler.name`, and `watched.path` on every increment — set to `"none"` when not applicable:

```
file_events_total{file_stage="found",   outcome="none",    error_type="none",            handler_name="none"}
file_events_total{file_stage="handled", outcome="success", error_type="none",            handler_name="onFileJson"}
file_events_total{file_stage="handled", outcome="failure", error_type="ConnectionError", handler_name="onFileJson"}
```

This rule applies to all explicit counters and gauges published by the library. All modules sharing the observability vocabulary must use the same sentinel value.

#### 7.2.5 File-Scoped Tags (Trace-Only)

| Tag | Values | Metrics | Traces | Notes |
|---|---|---|---|---|
| `file.path` | Full path of the file | No | Yes | Excluded from metrics to avoid cardinality explosion. |
| `destination.path` | Target path for move/rename/copy | No | Yes | Excluded from metrics. |
| `file.size` | Size in bytes | No | Yes | Exact file size on the trace span. |
| `file.modified_time` | Last-modified timestamp | No | Yes | Needed for stable file identity. |

#### 7.2.6 Client Operation Tag Mapping

Client operation spans use `type=client` and `action.type=client_operation`. The `operation.type` tag maps to the client method invoked:

| `operation.type` | Triggered by |
|---|---|
| `get` | `getBytes()`, `getText()`, `getJson()`, `getXml()`, `getCsv()`, `getBytesAsStream()`, `getCsvAsStream()` |
| `put` | `putBytes()`, `putText()`, `putJson()`, `putXml()`, `putCsv()`, `putBytesAsStream()`, `putCsvAsStream()` |
| `manage` | `delete()`, `rename()`, `move()`, `copy()`, `mkdir()`, `rmdir()`, `isDirectory()`, `list()`, `exists()`, `size()` |

Listener content reads also carry `operation.type=get` on the `file_bytes_transferred_total` counter, since the listener fetches file content from the remote server in the same way as client get operations.

#### 7.2.7 Listener Event Tag Mapping

Listener event spans use `type=listener` and `action.type=file_event`. The `event.type` tag identifies the event:

| `event.type` | Triggered by |
|---|---|
| `create` | File added or modified; dispatched to format-specific callbacks or `onFileChange` |
| `delete` | File deleted; dispatched to `onFileDelete` |
| `error` | Content-binding or deserialization failure; dispatched to `onError` |

#### 7.2.8 File Lifecycle Stages

The listener tracks files through a four-stage lifecycle. Each stage publishes an independent `file_events_total` counter increment with its respective tags.

1. **Found** (`file.stage=found`) — A file is discovered during a poll cycle. Each discovered file produces exactly one `found` increment. If the file matches a handler, `outcome=none`. If no handler matches, `outcome=skipped` and `error.type=no_handler_matched` — the file goes no further in the lifecycle.
2. **Dispatched** (`file.stage=dispatched`) — The file is matched to a content handler and handed over for processing. The `handler.name` tag identifies the target handler.
3. **Handled** (`file.stage=handled`) — The handler invocation has completed. Tagged with `outcome=success` or `outcome=failure`. On failure, `error.type` is set to the Ballerina error type name returned by the handler. This captures errors from **any** code inside the handler — not just FTP operations, but also HTTP calls, database queries, custom logic, etc. Any error that causes the handler to return an error (via `check` or explicit `return error(...)`) is captured.
4. **Cleaned up** (`file.stage=cleaned_up`) — Post-processing (move or delete) has completed. Tagged with `cleanup.action` (move/delete) and `outcome` (success/failure). If the cleanup fails, `error.type` is set to `move_failed` or `delete_failed`.

### 7.3 Observability Outputs per File

For each file processed by the listener, the library produces three types of observability output:

1. **Explicit counters** (`file_events_total`) — All four lifecycle stages publish here. These are direct `MetricRegistry.counter().increment()` calls. No span is involved. Every stage is queryable from this single metric name.

2. **Per-file parent span** — A library-created span (`BSpan.start("ftp", "file-lifecycle", false)`) that covers the entire file lifecycle from discovery to cleanup. The `file.path` tag on this span enables searching for a specific file in Jaeger. The `handled` and `cleaned_up` child spans are automatically parented to it via the `ObserverContext.setParent()` mechanism.

3. **Framework child spans** (Jaeger traces) — The `handled` and `cleaned_up` stages invoke Ballerina methods via `callMethod`, which creates auto-instrumented spans. Because the strand properties contain an `ObserverContext` whose parent has the per-file span set on it, these auto-instrumented spans become **children** of the parent span. This connects the entire file lifecycle into a single trace. Note: these spans also increment the runtime's `requests_total_value`, but that metric counts spans, not files — it must not be used for per-file counting.

The per-file flow:

```
processContentCallbacks() — for each file:
  │
  │  [ftp / file-lifecycle] ─────────────────────────────── parent span (file.path tag)
  │    │
  │    ├─ file_events_total{file_stage="found"}            ← counter +1
  │    │
  │    ├─ file_events_total{file_stage="dispatched"}        ← counter +1
  │    │
  │    ├─ convertFileContent(onFileText) ───────────────────← timed
  │    │   │
  │    │   └─ file_databinding_duration_seconds                     ← gauge (seconds, with handler_name + outcome)
  │    │
  │    ├─ [onFileText] ────────────────────────────────────── child span (handled)
  │    │   │
  │    │   ├─ file_events_total{file_stage="handled"}       ← counter +1 (with outcome + error_type)
  │    │   └─ file_resource_execution_duration_seconds              ← gauge (seconds, with handler_name + outcome)
  │    │
  │    ├─ [delete|move] ───────────────────────────────────── child span (cleaned_up)
  │    │   │
  │    │   └─ file_events_total{file_stage="cleaned_up"}    ← counter +1 (with outcome + error_type)
  │    │
  │    └─ finishSpan() ──────────────────────────────────── parent span closed
```

For a skipped file (no handler matched), no parent span is created:

```
  └─ file_events_total{file_stage="found", outcome="skipped"}     ← counter +1 (no further stages)
```

- **Poll cycles** are reported via `file_events_total{action_type="poll_cycle"}` because `poll()` is not auto-instrumented.
- **Client operations** produce auto-instrumented spans with `action.type=client_operation`, visible in both `requests_total_value` and Jaeger. This is the only case where `requests_total_value` gives correct per-operation counts (one call = one span = one increment).

### 7.4 Sample PromQL Queries

All lifecycle stages can be queried uniformly from `file_events_total`:

```promql
# ── Poll health ──
rate(file_events_total{action_type="poll_cycle", outcome="success"}[5m])
rate(file_events_total{action_type="poll_cycle", outcome="failure"}[5m])

# ── File lifecycle stages (all from file_events_total) ──
rate(file_events_total{file_stage="found"}[5m])
rate(file_events_total{file_stage="dispatched"}[5m])
rate(file_events_total{file_stage="found", outcome="skipped"}[5m])
rate(file_events_total{file_stage="handled"}[5m])
rate(file_events_total{file_stage="cleaned_up"}[5m])

# ── Handler outcomes (four-box grid) ──
rate(file_events_total{file_stage="handled", outcome="success"}[5m])
rate(file_events_total{file_stage="handled", outcome="failure"}[5m])
rate(file_events_total{file_stage="cleaned_up", outcome="success"}[5m])
rate(file_events_total{file_stage="cleaned_up", outcome="failure"}[5m])

# ── Per-handler breakdown ──
sum by (handler_name) (rate(file_events_total{file_stage="handled"}[5m]))

# ── Handler errors by error type (captures errors from any code — FTP, HTTP, DB, etc.) ──
sum by (error_type) (rate(file_events_total{file_stage="handled", outcome="failure"}[5m]))

# ── Cleanup errors by type ──
sum by (error_type) (rate(file_events_total{file_stage="cleaned_up", outcome="failure"}[5m]))

# ── Data binding duration (p99 by handler) ──
file_databinding_duration_seconds{quantile="0.99"}
avg by (handler_name) (file_databinding_duration_seconds_mean)
file_databinding_duration_seconds{handler_name="onFileJson", outcome="success", quantile="0.5"}

# ── Resource execution duration (p99 by handler) ──
file_resource_execution_duration_seconds{quantile="0.99"}
avg by (handler_name) (file_resource_execution_duration_seconds_mean)
file_resource_execution_duration_seconds{handler_name="onFileJson", outcome="success", quantile="0.5"}

# ── Client operations (framework auto-instrumented spans) ──
rate(requests_total_value{action_type="client_operation", operation_type="get"}[5m])
rate(requests_total_value{action_type="client_operation", operation_type="put"}[5m])
rate(requests_total_value{action_type="client_operation", operation_type="manage"}[5m])

# ── Bytes transferred ──
rate(file_bytes_transferred_total{operation_type="get"}[5m])   # total bytes read (client + listener)
rate(file_bytes_transferred_total{operation_type="put"}[5m])   # total bytes written (client only)
rate(file_bytes_transferred_total{type="client"}[5m])          # all client bytes (get + put)
rate(file_bytes_transferred_total{type="listener"}[5m])        # all listener bytes (get)
```

### 7.5 Enabling Observability

Observability must be enabled in the Ballerina runtime configuration. Add the following to `Config.toml`:

```toml
[ballerina.observe]
metricsEnabled=true
metricsReporter="prometheus"
tracingEnabled=true
tracingProvider="jaeger"
```

Refer to the [Ballerina Observability documentation](https://ballerina.io/learn/observe-ballerina-programs/) for details on configuring reporters and exporters.

### 7.6 Observability Safety Rules

Observability must never break file operations. All metric and tracing calls are guarded by the following rules:

1. **Exception isolation.** Every public method in the metrics and tracing utilities wraps its body in `try/catch(Throwable)` and swallows the exception with a debug-level log. A registry error, NPE, or any other observability failure must never propagate to callers. This follows the same pattern as `module-ballerina-sql`.

2. **Early guard.** All metric methods check `ObserveUtils.isMetricsEnabled()` and return immediately when metrics are disabled. Tracing factory methods check `ObserveUtils.isObservabilityEnabled()` and return `null`. This ensures zero overhead when observability is off.

3. **Null-safe returns.** Tracing methods that return strand property maps return `null` on failure — the same value returned when observability is disabled. Callers already handle `null` (the `StrandMetadata` constructor accepts it), so no caller changes are required.
