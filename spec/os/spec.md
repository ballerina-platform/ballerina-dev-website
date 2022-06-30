---
layout: ballerina-stdlib-specs
permalink: /spec/os/
---

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
