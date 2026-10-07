# Specification: Ballerina Log Library

_Authors_: @daneshk @MadhukaHarith92 @TharmiganK  
_Reviewers_: @daneshk @ThisaruGuruge  
_Created_: 2021/11/15  
_Updated_: 2026/09/03
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
   * 3.1. [Configure root log level](#31-configure-root-log-level)
   * 3.2. [Configure log format](#32-configure-log-format)
   * 3.3. [Configure root log context](#33-configure-root-log-context)
   * 3.4. [Configure root log destinations](#34-configure-root-log-destinations)
   * 3.5. [Configure log rotation](#35-configure-log-rotation)
4. [Contextual logging](#4-contextual-logging)
   * 4.1. [Logger](#41-logger)
   * 4.2. [Root logger](#42-root-logger)
   * 4.3. [Child logger](#43-child-logger)
     * 4.3.1. [Loggers with additional context](#431-loggers-with-additional-context)
     * 4.3.2. [Loggers with unique logging configuration](#432-loggers-with-unique-logging-configuration)
5. [Runtime log level modification](#5-runtime-log-level-modification)
   * 5.1. [Logger level APIs](#51-logger-level-apis)
   * 5.2. [Logger identification](#52-logger-identification)
   * 5.3. [Logger registry](#53-logger-registry)
   * 5.4. [Module log levels](#54-module-log-levels)
   * 5.5. [Child logger level inheritance](#55-child-logger-level-inheritance)
6. [Sensitive data masking](#6-sensitive-data-masking)
   * 6.1. [Sensitive data annotation](#61-sensitive-data-annotation)
   * 6.2. [Masked string function](#62-masked-string-function)
   * 6.3. [Type-based masking](#63-type-based-masking)
7. [Static Code Rules](#7-static-code-rules)
   * 7.1. [Potentially-sensitive configurable variables are logged](#71-potentially-sensitive-configurable-variables-are-logged)
   * 7.2. [Avoid writing log files to world-writable directories](#72-avoid-writing-log-files-to-world-writable-directories)

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

> **Note:**
> The key-value pairs provided for logging must not use the reserved keys `message`, `time`, or `level`.
> These keys are reserved for the log record fields and will result in a compile-time error if specified.

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
    RotationConfig? rotation = ();
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

### 3.5. Configure log rotation

Log rotation helps manage log file sizes by automatically creating backup files when certain conditions are met. This prevents log files from growing indefinitely and consuming excessive disk space.

Log rotation is optional and can be configured for file destinations. If no rotation configuration is provided, logs are written without rotation. When configured, a rotation policy defines when files should be rotated. The following rotation policies are available:

```ballerina
public enum RotationPolicy {
    SIZE_BASED,  // Rotate based on file size only
    TIME_BASED,  // Rotate based on time interval only
    BOTH         // Rotate when either size or time threshold is met (whichever comes first)
};
```

The rotation configuration is defined as follows:

```ballerina
public type RotationConfig record {|
    RotationPolicy policy = BOTH;
    int maxFileSize = 10485760;  // Default: 10MB (in bytes)
    int maxAge = 86400;           // Default: 24 hours (in seconds)
    int maxBackupFiles = 10;      // Default: 10 backup files
|};
```

Configuration parameters:
- `policy`: The rotation policy to use (SIZE_BASED, TIME_BASED, or BOTH). Default is BOTH
- `maxFileSize`: Maximum file size in bytes before rotation occurs (applies to SIZE_BASED and BOTH policies)
- `maxAge`: Maximum age in seconds before rotation occurs (applies to TIME_BASED and BOTH policies)
- `maxBackupFiles`: Maximum number of backup files to retain (older backups are automatically deleted)

Example configuration for size-based rotation:

```toml
[[ballerina.log.destinations]]
path = "./logs/app.log"

[ballerina.log.destinations.rotation]
policy = "SIZE_BASED"
maxFileSize = 5242880    # 5MB
maxBackupFiles = 15
```

Time-based rotation example:

```toml
[[ballerina.log.destinations]]
path = "./logs/app.log"

[ballerina.log.destinations.rotation]
policy = "TIME_BASED"
maxAge = 1800            # 30 minutes (in seconds)
maxBackupFiles = 20
```

Rotation using both size and time (default policy):

```toml
[[ballerina.log.destinations]]
path = "./logs/app.log"

[ballerina.log.destinations.rotation]
policy = "BOTH"
maxFileSize = 10485760   # 10MB
maxAge = 3600            # 1 hour (in seconds)
maxBackupFiles = 10
```

When rotation occurs:
- The current log file is renamed with a timestamp suffix (e.g., `app-20251217120530.log`)
- A new log file is created with the original name
- If the number of backup files exceeds `maxBackupFiles`, the oldest backups are automatically deleted
- With `BOTH` policy, rotation happens when either the size limit OR time interval is reached (whichever comes first)

> **Note:**
>
> - Log rotation only applies to file destinations, not to stderr or stdout
> - Backup files are named using the pattern: `{basename}-{timestamp}.log` (e.g., `app-20251217-120530.log`)
> - The timestamp format is `yyyyMMdd-HHmmss` (uses system default timezone)
> - Rotation checks happen during log write operations, so timing may vary slightly based on application logging activity

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

   # Gets the effective log level of this logger.
   # For root and custom loggers, returns the explicitly set level.
   # For child loggers, returns the inherited level from the parent logger.
   #
   # + return - The effective log level
   public isolated function getLevel() returns Level;

   # Sets the log level of this logger at runtime.
   # Returns an error if the operation is not supported (e.g., on child loggers).
   #
   # + level - The new log level to set
   # + return - An error if the operation is not supported, nil on success
   public isolated function setLevel(Level level) returns error?;
};
```

> **Note:** The Ballerina log module provides a function to evaluate the `PrintableRawTemplate` to obtain the evaluated string. This can be used when implementing a logger from the above type.
>
> ```ballerina
> public isolated function evaluateTemplate(PrintableRawTemplate rawTemplate, boolean enableSensitiveDataMasking = false) returns string;
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
    # Optional unique identifier for this logger. If provided, this ID is module-prefixed
    # to produce a fully qualified ID: <org>/<module>:<user_id> (e.g., "myorg/payment:payment-service").
    # If not provided, a readable identifier is auto-generated using the pattern:
    # <module>:<function> for the first logger, <module>:<function>-<counter> for subsequent ones.
    string id?;
    # Log format to use. Default is the logger format configured in the module level
    LogFormat format = format;
    # Log level to use. Default is the logger level configured in the module level
    Level level = level;
    # List of destinations to log to. Default is the logger destinations configured in the module level
    readonly & OutputDestination[] destinations = destinations;
    # Additional key-value pairs to include in the log messages. Default is the key-values configured in the module level
    readonly & AnydataKeyValues keyValues = {...keyValues};
    # Enable sensitive data masking in the logs. Default is false
    boolean enableSensitiveDataMasking = false;
|};
```

Sample usage:

```ballerina
log:Config auditLogConfig = {
    level: log:INFO,
    format: "json",
    destinations: [{path: "./logs/audit.log"}]
};

log:Logger auditLogger = check log:fromConfig(auditLogConfig);
auditLogger.printInfo("Hello World from the audit logger!");
```

To create a logger with a unique identifier that allows runtime log level modification:

```ballerina
log:Logger auditLogger = check log:fromConfig(id = "audit-logger", level = log:INFO, format = log:JSON_FORMAT);
auditLogger.printInfo("Hello World from the audit logger!");
```

> **Note:** The `id` must be unique across all loggers in the application. If a logger with the same ID already exists, an error will be returned.

## 5. Runtime log level modification

The Ballerina log module supports runtime log level modification, enabling developers and the ICP (Integration Control Panel) to dynamically adjust log levels without restarting the application.

### 5.1. Logger level APIs

Two methods are available on the `Logger` interface for runtime level management:

- `getLevel()` returns the effective log level. For root and custom loggers, this is the explicitly set level. For child loggers, this is the inherited level from the parent.
- `setLevel()` updates the log level at runtime. Returns an error on child loggers (which always inherit from their parent).

```ballerina
log:Logger logger = check log:fromConfig(id = "payment-service", level = log:INFO);

// Get current level
log:Level currentLevel = logger.getLevel(); // INFO

// Change level at runtime
check logger.setLevel(log:DEBUG);
logger.getLevel(); // DEBUG
```

### 5.2. Logger identification

All loggers created via `fromConfig` are registered in the logger registry and are identifiable by a unique ID.

**User-provided IDs** are module-prefixed to produce a fully qualified ID of the form `<org>/<module>:<user_id>`:

```ballerina
// In module "myorg/payment":
log:Logger paymentLogger = check log:fromConfig(id = "payment-service", level = log:INFO);
// Registered as: "myorg/payment:payment-service"
```

**Auto-generated IDs** are created when no `id` is provided, using the module name and caller function name:

- `<module>:<functionName>` for the first logger in a function
- `<module>:<functionName>-<counter>` for subsequent loggers in the same function

```ballerina
// In function "processOrder" of module "myorg/payment":
log:Logger logger1 = check log:fromConfig(level = log:DEBUG);
// Registered as: "myorg/payment:processOrder"

log:Logger logger2 = check log:fromConfig(level = log:DEBUG);
// Registered as: "myorg/payment:processOrder-2"
```

Stack frame inspection is performed only once at logger creation time — there is no runtime performance impact on logging operations.

> **Note:** The `id` must be unique across all loggers in the application. If a logger with the same ID already exists, an error is returned.

### 5.3. Logger registry

The log module maintains an internal logger registry that tracks all registered loggers. Access to the registry is provided via the `LoggerRegistry` class, obtained by calling `getLoggerRegistry()`.

The registry tracks:
- The root logger (registered with the well-known ID `"root"`)
- All loggers created via `fromConfig` (with module-prefixed or auto-generated IDs)

Child loggers (created via `withContext`) are **not** registered in the registry.

```ballerina
# Provides access to the logger registry for discovering and managing registered loggers.
public isolated class LoggerRegistry {

    # Returns the IDs of all registered loggers.
    # + return - An array of logger IDs
    public isolated function getIds() returns string[];

    # Returns a logger by its registered ID.
    # + id - The logger ID to look up
    # + return - The Logger instance if found, nil otherwise
    public isolated function getById(string id) returns Logger?;
}

# Returns the logger registry for discovering and managing registered loggers.
# + return - The LoggerRegistry instance
public isolated function getLoggerRegistry() returns LoggerRegistry;
```

Usage example:

```ballerina
log:LoggerRegistry registry = log:getLoggerRegistry();

// List all registered logger IDs
string[] ids = registry.getIds();
// e.g., ["root", "myorg/payment:payment-service", "myorg/payment:init"]

// Look up a logger by ID and change its level
log:Logger? logger = registry.getById("myorg/payment:payment-service");
if logger is log:Logger {
    check logger.setLevel(log:DEBUG);
}
```

### 5.4. Module log levels

Per-module log levels configured in `Config.toml` are applied at the start of the program and filter log statements from each module statically. Module log levels are **not** registered in the logger registry and cannot be modified at runtime.

```toml
[ballerina.log]
level = "INFO"

[[ballerina.log.modules]]
name = "myorg/payment"
level = "DEBUG"
```

When code in `myorg/payment` logs a message, the root logger checks the configured module level (DEBUG) before deciding whether to emit the log, regardless of the root logger's own level (INFO). This check happens on the hot logging path using a lock-free lookup.

> **Note:** Module log levels are a static, configuration-time feature. To change a module's effective log level at runtime, use a logger created via `fromConfig` and control it through the `LoggerRegistry`.

### 5.5. Child logger level inheritance

Child loggers (created via `withContext`) always inherit their log level from the parent logger:

- `getLevel()` on a child logger always delegates to the parent's `getLevel()`. When the parent's level changes, the child's effective level changes automatically.
- `setLevel()` on a child logger returns an unsupported operation error. To change a child's effective level, change the parent's level instead.
- Child loggers are **not** registered in the logger registry.
- Grandchild loggers chain correctly — each delegates `getLevel()` up the chain to the nearest root/custom logger.

```ballerina
log:Logger parent = check log:fromConfig(id = "payment-service", level = log:INFO);
log:Logger child = check parent.withContext(component = "order-handler");

// Child inherits parent's level
child.getLevel(); // INFO

// Change parent level — child follows
check parent.setLevel(log:DEBUG);
child.getLevel(); // DEBUG

// setLevel() on child returns an error
error? result = child.setLevel(log:ERROR);
// result is error("Unsupported operation: cannot set log level on a child logger...")
```

## 6. Sensitive data masking

The Ballerina log module provides the capability to mask sensitive data in log messages. This is crucial for maintaining data privacy and security, especially when dealing with personally identifiable information (PII) or other sensitive data.

> **Note**: By default, sensitive data masking is disabled. Enable it in `Config.toml`:
>
> ```toml
> [ballerina.log]
> enableSensitiveDataMasking = true
> ```
>
> Or configure it per logger:
>
> ```ballerina
> log:Config secureConfig = {
>     enableSensitiveDataMasking: true
> };
> log:Logger secureLogger = log:fromConfig(secureConfig);
> ```

### 6.1. Sensitive data annotation

The `@log:Sensitive` annotation can be used to mark fields in a record as sensitive. When such fields are logged, their values will be excluded or masked to prevent exposure of sensitive information.

```ballerina
import ballerina/log;

type User record {
    string id;
    @log:Sensitive
    string password;
    string name;
};

public function main() {
    User user = {id: "U001", password: "mypassword", name: "John Doe"};
    log:printInfo("user details", user = user);
}
```

Output:

```log
time=2025-08-20T09:15:30.123+05:30 level=INFO module="" message="user details" user={"id":"U001","name":"John Doe"}
```

The `@log:Sensitive` annotation will exclude the sensitive field from the log output when sensitive data masking is enabled.

Additionally, the masking strategy can be configured using the `strategy` field of the annotation. The available strategies are:
1. `EXCLUDE`: Excludes the field from the log output (default behavior).
2. `Replacement`: Replaces the field value with a specified replacement string or a function that generates a masked version of the value.

Example:

```ballerina
import ballerina/log;

isolated function maskString(string input) returns string {
    if input.length() <= 2 {
        return "****";
    }
    return input.substring(0, 1) + "****" + input.substring(input.length() - 1);
}

type User record {
    string id;
    @log:Sensitive {
        strategy: {
            replacement: "****"
        }   
    }
    string password;
    @log:Sensitive {
        strategy: {
            replacement: maskString
        }
    }
    string ssn;
    string name;
};

public function main() {
    User user = {id: "U001", password: "mypassword", ssn: "123-45-6789", name: "John Doe"};
    log:printInfo("user details", user = user);
}
```

Output:

```log
time=2025-08-20T09:20:45.456+05:30 level=INFO module="" message="user details" user={"id":"U001","password":"****","ssn":"1****9","name":"John Doe"}
```

### 6.2. Masked string function

The `log:toMaskedString()` function can be used to obtain the masked version of a value. This is useful when developers want to implement custom loggers and need to mask sensitive data.

```ballerina
import ballerina/log;
import ballerina/io;

type User record {
    string id;
    @log:Sensitive
    string password;
    string name;
};

public function main() {
    User user = {id: "U001", password: "mypassword", name: "John Doe"};
    string maskedUser = log:toMaskedString(user);
    io:println(maskedUser);
}
```

Output:

```log
{"id":"U001","name":"John Doe"}
```

### 6.3. Type-based masking

The masking is based on the type of the value. Since, Ballerina is a structurally typed language, same value can be assigned to different typed variables. So the masking is based on the actual value type which is determined at the value creation time. The original type information can be extracted using the `typeof` operator.

Example:

```ballerina
type User record {
   string id;
   @log:Sensitive
   string password;
   string name;
};

type Student record {
   string id;
   string password; // Not marked as sensitive
   string name;
};

public function main() returns error? {
   User user = {id: "U001", password: "mypassword", name: "John Doe"};
   // password will be masked
   string maskedUser = log:toMaskedString(user);

   Student student = user; // Allowed since both have the same structure 
   // password will be masked since the type at value creation is User
   string maskedStudent = log:toMaskedString(student);

   student = {id: "S001", password: "studentpass", name: "Jane Doe"}; 
   user = student; // Allowed since both have the same structure
   // password will not be masked since the type at value creation is Student
   maskedStudent = log:toMaskedString(user);

   // Explicity creating a value with type
   user = check student.cloneWithType();
   // password will be masked since the type at value creation is User
   maskedUser = log:toMaskedString(user);
}    
```

## 7. Static Code Rules

The following static code rules are applied to the Log module.

| Id              | Kind          | Description                                                                                                 |
|-----------------|---------------|---------------------------------------------------------------------------------------------------------------|
| ballerina/log:1 | VULNERABILITY | [Potentially-sensitive configurable variables are logged](#71-potentially-sensitive-configurable-variables-are-logged) |
| ballerina/log:2 | VULNERABILITY | [Avoid writing log files to world-writable directories](#72-avoid-writing-log-files-to-world-writable-directories) |

### 7.1. Potentially-sensitive configurable variables are logged

A configurable variable passed to a log statement is written into the log store.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/log:1 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-532](https://cwe.mitre.org/data/definitions/532.html) |
| **OWASP Top 10:2025** | [A09 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/) |

#### 7.1.1. Why this is an issue?

Configurable variables carry the values supplied at deployment, which is where credentials, tokens and connection secrets live. A log statement moves the value out of the deployment configuration and into the log store, where it is retained and readable by a far wider set of people than can read the configuration itself.

The rule does not attempt to decide which configurables hold secrets. Every deployment-supplied value is treated as sensitive.

#### 7.1.2. What is the potential impact?

A credential written to a log is readable by anyone with access to logs, is retained for as long as the retention policy allows, and is copied into any downstream index or backup. Rotating it is the only remedy once it has been written.

#### 7.1.3. How can I fix this?

Log a value that identifies the configuration rather than the configuration itself. Where a record must be logged whole, mark its sensitive fields with the `log:Sensitive` annotation so they are masked.

**Non-compliant code:**

```ballerina
import ballerina/log;

configurable string apiKey = ?;

public function main() {
    log:printInfo(apiKey);
    log:printError(string `Failed with ${apiKey}`);
    log:printWarn("Connection failed", apiKey = apiKey);
}
```

**Compliant code:**

```ballerina
import ballerina/log;

configurable string apiKey = ?;

public function main() {
    log:printInfo(maskString(apiKey));
    log:printError(string `Failed with ${maskString(apiKey)}`);
    log:printWarn("Connection failed", apiKey = maskString(apiKey));
}

function maskString(string value) returns string {
    return value.length() == 0 ? "" : "****";
}
```

#### 7.1.4. Additional Resources

- [CWE-532: Insertion of Sensitive Information into Log File](https://cwe.mitre.org/data/definitions/532.html)
- [OWASP Top 10:2025 A09 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/)

### 7.2. Avoid writing log files to world-writable directories

A log file placed in a shared temporary directory can be read, and pre-created, by any local account.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/log:2 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-379](https://cwe.mitre.org/data/definitions/379.html), [CWE-532](https://cwe.mitre.org/data/definitions/532.html) |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

#### 7.2.1. Why this is an issue?

Logs routinely capture request details, identifiers and error context, so the log file itself is a sensitive artefact. A world-writable directory such as `/tmp` lets any local account create the file before the service does. The service then appends to a file it does not own, and the permissions on that file were chosen by whoever created it, so the log can be readable to others or replaced with a file of their choosing.

What follows from that depends on the rest of the environment. A sticky bit prevents one account deleting another's file but not pre-creating its own, and the permissions the logger opens an existing file with decide the rest. The directory choice is the part the code controls, which is what this rule reports.

The rule reads both ways of naming a log file: the deprecated `setOutputFile`, and the `path` of a file destination on a logger configuration. A path is reported only when it is anchored at a world-writable directory, including one reached through `os:getEnv("TMPDIR")` and its variants; a directory whose name merely begins like one, such as `/tmpfiles`, is a different directory and is not reported. POSIX paths and environment variable names are matched exactly, since both are case-sensitive there; only the Windows directories are matched case-insensitively.

The module-level `destinations` configurable is normally set outside the source, which no source analyzer can see. A deployment that configures its log destination there should confirm the same property separately.

#### 7.2.2. What is the potential impact?

Where the file is pre-created by another account, everything the service logs can be readable to it, and the file can be replaced or truncated, which also removes the record an investigation would depend on.

#### 7.2.3. How can I fix this?

Write logs under a directory the service owns, with permissions that exclude other accounts.

**Non-compliant code:**

```ballerina
public function configureLogging() returns error? {
    check log:setOutputFile("/tmp/application.log");

    log:Logger _ = check log:fromConfig({
        destinations: [{'type: log:FILE, path: "/var/tmp/service.log"}]
    });
}
```

**Compliant code:**

```ballerina
public function configureLogging() returns error? {
    log:Logger _ = check log:fromConfig({
        destinations: [{'type: log:FILE, path: "./logs/service.log"}]
    });
}
```

#### 7.2.4. Additional Resources

- [CWE-379: Creation of Temporary File in Directory with Insecure Permissions](https://cwe.mitre.org/data/definitions/379.html)
- [CWE-532: Insertion of Sensitive Information into Log File](https://cwe.mitre.org/data/definitions/532.html)
- [OWASP Top 10:2025 A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)
