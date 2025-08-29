# Specification: Ballerina Log Library

_Authors_: @daneshk @MadhukaHarith92 @TharmiganK  
_Reviewers_: @daneshk @ThisaruGuruge  
_Created_: 2021/11/15  
_Updated_: 2025/08/20  
_Edition_: Swan Lake  

## Introduction

This is the specification for the Log standard library of [Ballerina language](https://ballerina.io/), which provides APIs to log information when running applications.

The Log library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal or any proposals under discussion can be found with the [Ballerina specification repository under `beps/lib-log`](https://github.com/ballerina-platform/ballerina-spec/tree/master/beps/lib-log).

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Logging](#2-logging)
3. [Configure logging](#3-configure-logging)
   - [Configure root log level](#31-configure-root-log-level)
   - [Configure log format](#32-configure-log-format)
   - [Configure root log context](#33-configure-root-log-context)
   - [Configure root log destinations](#34-configure-root-log-destinations)
4. [Contextual logging](#4-contextual-logging)
   - [Logger](#41-logger)
   - [Root logger](#42-root-logger)
   - [Child logger](#43-child-logger)
     - [Loggers with additional context](#431-loggers-with-additional-context)
     - [Loggers with unique logging configuration](#432-loggers-with-unique-logging-configuration)

## 1. Overview

This specification elaborates on the functionalities available in the Log library. The Ballerina log module has four log levels with their priority in descending order as follows.

1. `ERROR`
2. `WARN`
3. `INFO`
4. `DEBUG`

## 2. Logging

The Ballerina log module has 4 functions to log at the 4 levels; `printDebug()`, `printError()`, `printInfo()`, and `printWarn()`.

```ballerina
log:printDebug("debug log");
log:printError("error log");
log:printInfo("info log");
log:printWarn("warn log");
```

Output:

```log
time=2025-08-20T08:49:05.482+05:30 level=DEBUG module="" message="debug log"
time=2025-08-20T08:49:05.483+05:30 level=ERROR module="" message="error log"
time=2025-08-20T08:49:05.484+05:30 level=INFO module="" message="info log"
time=2025-08-20T08:49:05.485+05:30 level=WARN module="" message="warn log"
```

Optionally, an error can be passed to the functions.

```ballerina
error err = error("something went wrong!", error("underlying issue"), id = "1234");
log:printError("error log with cause", err);
```

This will print the error message along with the cause, stack trace and any other details added to the error.

Output:

```log
time=2025-08-20T08:51:45.684+05:30 level=ERROR module="" message="error log with cause" error={"causes":[{"message":"underlying issue","detail":{},"stackTrace":[{"callableName":"main","moduleName":(),"fileName":"test.bal","lineNumber":4}]}],"message":"something went wrong!","detail":{"id":"1234"},"stackTrace":[{"callableName":"main","moduleName":(),"fileName":"test.bal","lineNumber":4}]}
```

Users can pass any number of key/value pairs, which need to be displayed in the log message. The value can be of `anydata` type, a function pointer or a `PrintableRawTemplate`.

```ballerina
log:printInfo("info log", id = 845315, name = "foo", successful = true);

log:printInfo("info log", current_time = isolated function() returns string { return time:utcToString(time:utcNow());});

int id = 845315;
string name = "foo";
log:printInfo(`info log for id: ${id}`, ctx = `{name: ${name}}`);
```

Output:

```log
time=2025-08-20T08:53:29.973+05:30 level=INFO module="" message="info log" id=845315 name="foo" successful=true
time=2025-08-20T08:53:29.987+05:30 level=INFO module="" message="info log" current_time="2025-08-20T03:23:29.989160Z"
time=2025-08-20T08:53:29.998+05:30 level=INFO module="" message="info log for id: 845315" ctx="{name: foo}"
```

## 3. Configure logging

### 3.1. Configure root log level

Only the `INFO` and higher level logs are logged by default. The log level can be configured via a Ballerina configuration file.

To set the root logger log level to a different level (eg: `DEBUG`), place the entry given below in the `Config.toml` file.

```toml
[ballerina.log]
level = "DEBUG"
```

Each module can also be assigned its own log level. To assign a log level to a module, provide the following entry in the `Config.toml` file.

```toml
[[ballerina.log.modules]]
name = "[ORG_NAME]/[MODULE_NAME]"
level = "[LOG_LEVEL]"
```

### 3.2. Configure log format

By default, log messages are logged to the console in the LogFmt format. To set the output format to JSON, place the entry given below in the `Config.toml` file.

```toml
[ballerina.log]
format = "json"
```

Currently, only `json` and `logfmt` are supported as the log formats.

### 3.3. Configure root log context

The root logger context can be configured in the `Config.toml` file. This context will be included in all log messages by default.

```toml
[ballerina.log]
keyValues = {env = "prod", nodeId = "delivery-svc-001"}
```

### 3.4. Configure root log destinations

The root logger destinations can be configured in the `Config.toml` file. This will determine where the log messages are sent.

Destinations can be specified as `stderr`(standard error stream) or `stdout`(standard output stream) or a file destination. The default destination is `stderr`.

The file destination is defined as follows:

```ballerina
public enum FileOutputMode {
    TRUNCATE,
    APPEND
};

public type FileOutputDestination record {
    readonly FILE 'type = FILE;
    string path;
    FileOutputMode mode = APPEND;
};
```

> **Note**:
>
> - The file destination only supports file paths with `.log` extension.
> - The file output mode can be configured to either `TRUNCATE` or `APPEND`. Both modes will create the file if it doesn't exist. But `TRUNCATE` will clear the file contents before writing, while `APPEND` will add to the existing contents.
> - The `log:setOutputFile()` function can set the destination at runtime. But this function usage is deprecated and the destination files should be provided using the above configuration at startup.

Example configuration:

```toml
[[ballerina.log.destinations]]
type = "stderr"

[[ballerina.log.destinations]]
path = "./logs/app.log"
```

## 4. Contextual logging

The Ballerina log module supports contextual logging, which allows developers to create new loggers, child loggers from a parent and loggers with additional context from the root logger.

### 4.1. Logger

Logger defines the front end of a log library that developers interact with. Developers can create new loggers by implementing this type.

```ballerina
public type Logger isolated object {
   # Prints debug logs.
   #
   # + msg - The message to be logged
   # + 'error - The error struct to be logged
   # + stackTrace - The error stack trace to be logged
   # + keyValues - The key-value pairs to be logged
   public isolated function printDebug(string|PrintableRawTemplate msg, error? 'error = (), error:StackFrame[]? stackTrace = (), *KeyValues keyValues);

   # Prints info logs.
   # 
   # + msg - The message to be logged
   # + 'error - The error struct to be logged
   # + stackTrace - The error stack trace to be logged
   # + keyValues - The key-value pairs to be logged
   public isolated function printInfo(string|PrintableRawTemplate msg, error? 'error = (), error:StackFrame[]? stackTrace = (), *KeyValues keyValues);

   # Prints warn logs.
   # 
   # + msg - The message to be logged
   # + 'error - The error struct to be logged
   # + stackTrace - The error stack trace to be logged
   # + keyValues - The key-value pairs to be logged
   public isolated function printWarn(string|PrintableRawTemplate msg, error? 'error = (), error:StackFrame[]? stackTrace = (), *KeyValues keyValues);

   # Prints error logs.
   # 
   # + msg - The message to be logged
   # + 'error - The error struct to be logged
   # + stackTrace - The error stack trace to be logged
   # + keyValues - The key-value pairs to be logged
   public isolated function printError(string|PrintableRawTemplate msg, error? 'error = (), error:StackFrame[]? stackTrace = (), *KeyValues keyValues);

   # Creates a new child/derived logger with the given key-values.
   #
   # + keyValues - The key-value pairs to be added to the logger context
   # + return - A new Logger instance with the given key-values added to its context
   public isolated function withContext(*KeyValues keyValues) returns Logger|error;
};
```

> **Note:** The Ballerina log module provides a function to process the PrintableRawTemplate to obtain the processed string. This can be used when implementing a logger from the above type.
>
> ```ballerina
> public isolated function processTemplate(PrintableRawTemplate) returns string;
> ```

### 4.2. Root logger

The root logger is the default logger used for logging the messages. It can be configured using the configurations described in the [Configure logging](#3-configure-logging) section.

At runtime, the root logger can be accessed using the `log:root()` function.

### 4.3. Child logger

There are two ways to create child loggers:

- Create a child logger with just additional context (key-value pairs)
- Create loggers with unique logging configuration

#### 4.3.1. Loggers with additional context

When creating a child logger with additional context, developers can add key-value pairs to enrich the logging information. This is particularly useful for including metadata such as user IDs, request IDs, or any other contextual information that can help in diagnosing issues.

```ballerina
log:Logger parentLogger = log:root();
log:Logger childLogger = parentLogger.withContext("userId": "12345", "requestId": "abcde");
```

In the example above, the `childLogger` will inherit all configurations from the `parentLogger` while adding the specified key-value pairs to its context. This allows for more granular logging without losing the original logger's settings.

```ballerina
childLogger.printInfo("User logged in");
```

The log message will now include the additional context, making it easier to trace the log entry back to the specific user and request.

#### 4.3.2. Loggers with unique logging configuration

Creating a logger from the root with different configurations provides flexibility for specific requirements. E.g., audit loggers and metrics loggers.

All these loggers inherit the initial context(key-value pairs) from the root logger, allowing them to maintain a consistent logging context while applying their unique configurations.

The following type defines the configuration options for a Ballerina logger:

```ballerina
# Configuration for the Ballerina logger
public type Config record {|
    # Log format to use. Default is the logger format configured in the module level
    LogFormat format = format;
    # Log level to use. Default is the logger level configured in the module level
    Level level = level;
    # List of destinations to log to. Default is the logger destinations configured in the module level
    readonly & OutputDestination[] destinations = destinations;
    # Additional key-value pairs to include in the log messages. Default is the key-values configured in the module level
    readonly & AnydataKeyValues keyValues = {...keyValues};
|};
```

Sample usage:

```ballerina
log:Config auditLogConfig = {
    level: log:INFO,
    format: "json",
    destinations: [{path: "./logs/audit.log"}]
};

log:Logger auditLogger = log:fromConfig(auditLogConfig);
auditLogger.printInfo("Hello World from the audit logger!");
```
