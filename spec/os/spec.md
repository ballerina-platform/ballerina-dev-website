# Specification: Ballerina OS Library

_Owners_: @daneshk @MadhukaHarith92  
_Reviewers_: @daneshk  
_Created_: 2021/11/10  
_Updated_: 2022/02/08  
_Edition_: Swan Lake  

## Introduction
This is the specification for the OS standard library of [Ballerina language](https://ballerina.io/), which provides APIs to retrieve information about the operating system and its current users.

The OS library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Environment Variable Values](#2-environment-variable-values)
3. [Operating System Users Information](#3-operating-system-users-information)
4. [Operating System Command execution](#4-operating-system-command-execution)

## 1. Overview
This specification elaborates on the operating-system-related functions available in the OS library.

## 2. Environment Variable Values
The environment variable value associated with a provided name can be retrieved using the `os:getEnv()` function.
```ballerina
string port = os:getEnv("HTTP_PORT");
```

An environment variable can be set using the `setEnv` function.
```ballerina
os:Error? err = os:setEnv("BALCONFIGFILE", "/path/to/Config.toml");
```

An environment variable can be removed from the system using the `unsetEnv` function.
```ballerina
os:Error? err = os:unsetEnv("BALCONFIGFILE");
```

The existing environment variables of the system can be listed using the `listEnv` function.
```ballerina
map<string> envs = os:listEnv();
```

## 3. Operating System Users Information
The current user's name can be retrieved using the `os:getUsername()` function.
```ballerina
string username = os:getUsername();
```

The current user's home directory path can be retrieved using the `os:getUserHome()` function.
```ballerina
string userHome = os:getUserHome();
```

## 4. Operating System Command execution
The users can execute OS commands using the `os:exec()` function by passing an `os:Command` record.
```ballerina
os:Process|os:Error result = os:exec({value: "bal", arguments: ["run", filepath]}, BAL_CONFIG_FILE = "/abc/Config.toml");
```

The following is the record type definitions of `os:Command`.
```ballerina
public type Command record {|
    string value;
    string[] arguments = [];
|};
```

Additionally, users can pass any number of environment properties as key-value pairs.
```ballerina
public type EnvProperties record {|
    never command?;
    anydata...;
|};
```

This will return an `os:Process` object. To wait for the process to finish its work and exit, `process.waitForExit()` function can be used.
```ballerina
int|os:Error exitCode = process.waitForExit();
```

To retrieve the output of the process, `process.output()` function can be used. This will return the standard output as default. 
There is an option provided to return standard error by providing file descriptor.
```ballerina
byte[]|os:Error err = process.output(io:stderr);
```

To terminate a process, `process.exit()` function can be used.
```ballerina
process.exit();
```

The following is the definition of the `os:Process` object.
```ballerina
# This object contains information on a process being created from Ballerina.
# This is returned from the `exec` function in the `os` module.
public class Process {

    # Waits for the process to finish its work and exit. 
    # This will return 0 if successful, or a different value during failure depending on the operating system.
    # ```ballerina
    # int|os:Error exitCode = process.waitForExit();
    # ```
    #
    # + return - Returns the exit code for the process, or else an `Error` if a failure occurs
    public isolated function waitForExit() returns int|Error {
        return nativeWaitForExit(self);
    }

    # Returns the standard output as default. Option provided to return standard error by providing file descriptor.
    # If the process was not finished and exited explicitly by running process.waitForExit(), then process.output() will finish the work and exit and return the output. 
    # ```ballerina
    # byte[]|os:Error err = process.output(io:stderr);
    # ```
    #
    # + fileOutputStream - The output stream (`io:stdout` or `io:stderr`) content needs to be returned
    # + return - The `byte[]`, which represents the process's 'standard error', or the 'standard out', or an Error
    public isolated function output(io:FileOutputStream fileOutputStream = io:stdout) returns byte[]|Error {
        return nativeOutput(self, fileOutputStream);
    }

    # Terminates the process.
    # ```ballerina
    # process.exit();
    # ```
    #
    public isolated function exit() {
        return nativeExit(self);
    }
}
```
