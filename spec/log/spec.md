# Specification: Ballerina Log Library

_Owners_: @daneshk @MadhukaHarith92  
_Reviewers_: @daneshk  
_Created_: 2021/11/15  
_Updated_: 2022/02/08  
_Edition_: Swan Lake  

## Introduction
This is the specification for the Log standard library of [Ballerina language](https://ballerina.io/), which provides APIs to log information when running applications.

The Log library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Logging](#2-logging)
3. [Configure Logging](#3-configure-logging)
4. [Writing Logs to a File](#4-writing-logs-to-a-file)

## 1. Overview
This specification elaborates on the functionalities available in the Log library. The Ballerina log module has four log levels with their priority in descending order as follows.
```
1. ERROR
2. WARN
3. INFO
4. DEBUG
```

## 2. Logging
The Ballerina log module has 4 functions to log at the 4 levels; `printDebug()`, `printError()`, `printInfo()`, and `printWarn()`.
```ballerina
log:printDebug("debug log");
log:printError("error log");
log:printInfo("info log");
log:printWarn("warn log");
```

Optionally, an error can be passed to the functions.
```ballerina
error e = error("something went wrong!");
log:printError("error log with cause", 'error = e);
```

This will print the error message. In order to print the complete error stack traces, users need to pass the error stack trace as a key-value pair which will be discussed in the next section.

Users can pass any number of key/value pairs, which need to be displayed in the log message. The value can be of `anydata` type, a function pointer or an error stack trace.
```ballerina
log:printInfo("info log", id = 845315, name = "foo", successful = true);
```

```ballerina
log:printInfo("info log", current_time = isolated function() returns string { return time:utcToString(time:utcNow());});
```

```ballerina
error e = error("bad sad");
log:printError("error log", stackTrace = e.stackTrace());
```

## 3. Configure Logging
Only the `INFO` and higher level logs are logged by default. The log level can be configured via a Ballerina configuration file.
To set the global log level to a different level (eg: `DEBUG`), place the entry given below in the `Config.toml` file.
```
[ballerina.log]
level = "DEBUG"
```

Each module can also be assigned its own log level. To assign a log level to a module, provide the following entry in the `Config.toml` file.
```
[[ballerina.log.modules]]
name = "[ORG_NAME]/[MODULE_NAME]"
level = "[LOG_LEVEL]"
```

By default, log messages are logged to the console in the LogFmt format. To set the output format to JSON, place the entry given below in the `Config.toml` file.
```
[ballerina.log]
format = "json"
```

## 4. Writing Logs to a File
By default, logs are printed to the console. Users can set the output to a log file by providing an output file (with `.log` extension) to `log:setOutputFile()` function.
Note that all the subsequent logs of the entire application will be written to this file.
```ballerina
var result = log:setOutputFile("./resources/myfile.log");
```

There are 2 options when writing to a file.
```
OVERWRITE - Truncate the existing content
APPEND - Append to the existing content
```

The following overwrites an existing log file.
```ballerina
var result = log:setOutputFile("./resources/myfile.log", log:OVERWRITE);
```
