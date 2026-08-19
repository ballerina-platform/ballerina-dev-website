# Specification: Ballerina SMB Library

_Owners_: @Nuvindu @niveathika \
_Reviewers_: @Nuvindu \
_Created_: 2026/08/10 \
_Updated_: 2026/08/19 \
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
