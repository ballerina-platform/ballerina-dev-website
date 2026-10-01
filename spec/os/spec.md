# Specification: Ballerina OS Library

_Owners_: @daneshk @MadhukaHarith92  
_Reviewers_: @daneshk  
_Created_: 2021/11/10  
_Updated_: 2026/09/03  
_Edition_: Swan Lake  

## Introduction
This is the specification for the OS standard library of [Ballerina language](https://ballerina.io/), which provides APIs to retrieve information about the operating system and its current users.

The OS library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Environment Variable Values](#2-environment-variable-values)
3. [Operating System Users Information](#3-operating-system-users-information)
4. [Operating System Command execution](#4-operating-system-command-execution)
5. [Static Code Rules](#5-static-code-rules)

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
os:Process|os:Error result = os:exec({value: "bal", arguments: ["run", filepath]}, BAL_CONFIG_FILES = "/abc/Config.toml");
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

## 5. Static Code Rules

The following static code rules are applied to the OS module.

| Id             | Kind          | Description                                                                                                                                                       |
|----------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ballerina/os:1 | VULNERABILITY | [Avoid constructing system command arguments from user input without proper sanitization](#51-avoid-constructing-system-command-arguments-from-user-input-without-proper-sanitization) |
| ballerina/os:2 | VULNERABILITY | [Avoid constructing environment variables from user input without proper sanitization](#52-avoid-constructing-environment-variables-from-user-input-without-proper-sanitization) |
| ballerina/os:3 | VULNERABILITY | [Avoid executing commands through a shell interpreter](#53-avoid-executing-commands-through-a-shell-interpreter)                                                   |
| ballerina/os:4 | VULNERABILITY | [Avoid executing commands resolved through the PATH environment variable](#54-avoid-executing-commands-resolved-through-the-path-environment-variable)             |

### 5.1. Avoid constructing system command arguments from user input without proper sanitization

An argument the caller controls changes what an executed command does.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/os:1 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-78](https://cwe.mitre.org/data/definitions/78.html), [CWE-88](https://cwe.mitre.org/data/definitions/88.html) |
| **OWASP Top 10:2025** | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/) |

#### 5.1.1. Why this is an issue?

`os:exec` runs a program with the arguments given to it. When one of those arguments comes from outside the program, the caller decides part of what the command does. Depending on the program being run, that can mean reading a different file, writing to a different destination, or enabling behaviour the code never intended to offer.

#### 5.1.2. What is the potential impact?

At minimum the command operates on data the caller chose. Where the executed program interprets its arguments further, such as a shell, the caller can run a command of their own instead.

#### 5.1.3. How can I fix this?

Do not pass a value that arrives from outside the program straight into a command. Validate it against the set of values the command is expected to accept.

**Non-compliant code:**

```ballerina
public function listDirectory(string userInput) returns os:Process|error {
    return check os:exec({value: "/bin/ls", arguments: [userInput]});
}
```

**Compliant code:**

```ballerina
public function listDirectory(string userInput) returns os:Process|error {
    if !["reports", "archive"].some(directory => directory == userInput) {
        return error("unknown directory");
    }
    return check os:exec({value: "/bin/ls", arguments: [userInput]});
}
```

#### 5.1.4. Additional Resources

- [CWE-78: Improper Neutralization of Special Elements used in an OS Command](https://cwe.mitre.org/data/definitions/78.html)
- [CWE-88: Improper Neutralization of Argument Delimiters in a Command](https://cwe.mitre.org/data/definitions/88.html)
- [OWASP Top 10:2025 A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)

### 5.2. Avoid constructing environment variables from user input without proper sanitization

An environment variable set from untrusted input changes the behaviour of every process started afterwards.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/os:2 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-454](https://cwe.mitre.org/data/definitions/454.html), [CWE-15](https://cwe.mitre.org/data/definitions/15.html) |
| **OWASP Top 10:2025** | [A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/), [A06 Insecure Design](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/) |

#### 5.2.1. Why this is an issue?

Environment variables are inherited by every child process. Setting one from a value that arrives from outside the program therefore reaches well beyond the code that set it, and several variables change how a program resolves libraries or executables rather than merely what data it works on.

#### 5.2.2. What is the potential impact?

A caller who controls an environment variable can influence programs the service starts later, including which executable or library they load.

#### 5.2.3. How can I fix this?

Set environment variables from values the program controls. Where a caller must influence one, validate the value against the set the program expects.

**Non-compliant code:**

```ballerina
public function configure(string userInput) returns os:Error? {
    check os:setEnv("APP_MODE", userInput);
}
```

**Compliant code:**

```ballerina
public function configure(string userInput) returns os:Error? {
    if !["production", "staging"].some(mode => mode == userInput) {
        return error("unknown mode");
    }
    check os:setEnv("APP_MODE", userInput);
}
```

#### 5.2.4. Additional Resources

- [CWE-454: External Initialization of Trusted Variables](https://cwe.mitre.org/data/definitions/454.html)
- [CWE-15: External Control of System or Configuration Setting](https://cwe.mitre.org/data/definitions/15.html)
- [OWASP Top 10:2025 A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/)
- [OWASP Top 10:2025 A06 Insecure Design](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/)

### 5.3. Avoid executing commands through a shell interpreter

Running `sh -c` gives up the separation between a command and its arguments.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/os:3 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-78](https://cwe.mitre.org/data/definitions/78.html) |
| **OWASP Top 10:2025** | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/) |

#### 5.3.1. Why this is an issue?

`os:exec` takes the executable and its arguments separately, and that separation is what keeps an argument from being read as syntax. Invoking a shell with a command string throws it away: the argument becomes a script, and every metacharacter in it, such as `;`, `|` or `$()`, is interpreted again. A value that was safe as an argument becomes a command of its own.

The rule reports a shell only when it is handed a command string, through `-c`, `/c` or the PowerShell equivalents. A shell invoked to run a script *by path* is not reported, since no argument is re-parsed as syntax. That is not a statement that such a call is safe: the shell still reads and executes the script, so the script path and its contents have to be as trusted as the program itself.

#### 5.3.2. What is the potential impact?

Any value reaching the command string can run arbitrary commands with the privileges of the service, which is the full impact of command injection rather than a modification of one command's behaviour.

#### 5.3.3. How can I fix this?

Run the executable directly and pass its arguments as separate list elements.

**Non-compliant code:**

```ballerina
public function countFiles() returns os:Process|error {
    return check os:exec({value: "/bin/sh", arguments: ["-c", "ls /var/data | wc -l"]});
}
```

**Compliant code:**

```ballerina
public function countFiles() returns os:Process|error {
    return check os:exec({value: "/bin/ls", arguments: ["/var/data"]});
}
```

#### 5.3.4. Additional Resources

- [CWE-78: Improper Neutralization of Special Elements used in an OS Command](https://cwe.mitre.org/data/definitions/78.html)
- [OWASP Top 10:2025 A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)

### 5.4. Avoid executing commands resolved through the PATH environment variable

An executable named without a path is chosen by the environment rather than by the code.

| Property              | Description |
|-----------------------|-------------|
| **Rule ID**           | ballerina/os:4 |
| **Rule Kind**         | Vulnerability |
| **CWE**               | [CWE-426](https://cwe.mitre.org/data/definitions/426.html) |
| **OWASP Top 10:2025** | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/) |

#### 5.4.1. Why this is an issue?

A bare executable name is resolved through `PATH` at run time, so which program actually runs depends on the environment the service happens to start in. Anyone able to place a file earlier in `PATH`, or to set `PATH` itself, chooses the program that executes. `os:setEnv` allows exactly that from within the same program.

A Windows drive-relative form such as `C:tool.exe` is resolved against that drive's current directory rather than through `PATH`, so it is a relative path and is not reported.

#### 5.4.2. What is the potential impact?

The service can be made to run an attacker's program in place of the intended one, with the service's own privileges, without any change to the source.

#### 5.4.3. How can I fix this?

Name the executable by an absolute path, or by a path relative to a directory the service controls.

**Non-compliant code:**

```ballerina
public function status() returns os:Process|error {
    return check os:exec({value: "git", arguments: ["status"]});
}
```

**Compliant code:**

```ballerina
public function status() returns os:Process|error {
    return check os:exec({value: "/usr/bin/git", arguments: ["status"]});
}
```

#### 5.4.4. Additional Resources

- [CWE-426: Untrusted Search Path](https://cwe.mitre.org/data/definitions/426.html)
- [OWASP Top 10:2025 A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)
