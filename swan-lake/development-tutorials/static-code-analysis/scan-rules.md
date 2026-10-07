---
title: Scan rules
description: Learn about the scan rules used in Ballerina static code analysis.
keywords: ballerina runtime, static code analysis, scan rules, code smells, bugs, vulnerabilities
permalink: /learn/scan-rules/
active: scan-rules
rule_anchors: true
---

The Ballerina scan tool uses a set of predefined rules to analyze Ballerina code and identify potential issues such as
code smells, bugs, and vulnerabilities.
These rules are designed to help developers maintain high-quality code and
adhere to best practices.

## Security standards mapping

Several weakness classes are prevented by the language itself rather than by a rule, so they do not appear in the table below. See [Language guarantees](/learn/language-guarantees/) for what the compiler enforces.

The table below maps each rule to its [CWE](https://cwe.mitre.org/) identifiers, and to the [OWASP Top 10:2025](https://owasp.org/Top10/) category that lists those identifiers. A dash (—) marks a rule that has no mapping to that standard.

| Rule ID            | Rule                                                                                                              | CWE                                                                                                                    | OWASP Top 10:2025                                                                                                                                                                |
|--------------------|-------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ballerina:1        | [Avoid checkpanic](#ballerina-1)                                                                                  | [CWE-248](https://cwe.mitre.org/data/definitions/248.html), [CWE-636](https://cwe.mitre.org/data/definitions/636.html) | [A10 Mishandling of Exceptional Conditions](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/)                                                        |
| ballerina:2        | [Unused function parameter](#ballerina-2)                                                                         | [CWE-561](https://cwe.mitre.org/data/definitions/561.html)                                                             | —                                                                                                                                                                                |
| ballerina:3        | [Non isolated public function](#ballerina-3)                                                                      | —                                                                                                                      | —                                                                                                                                                                                |
| ballerina:4        | [Non isolated public method](#ballerina-4)                                                                        | —                                                                                                                      | —                                                                                                                                                                                |
| ballerina:5        | [Non isolated public class](#ballerina-5)                                                                         | —                                                                                                                      | —                                                                                                                                                                                |
| ballerina:6        | [Non isolated public object](#ballerina-6)                                                                        | —                                                                                                                      | —                                                                                                                                                                                |
| ballerina:7        | [This operation always evaluates to true](#ballerina-7)                                                           | [CWE-571](https://cwe.mitre.org/data/definitions/571.html)                                                             | —                                                                                                                                                                                |
| ballerina:8        | [This operation always evaluates to false](#ballerina-8)                                                          | [CWE-570](https://cwe.mitre.org/data/definitions/570.html)                                                             | —                                                                                                                                                                                |
| ballerina:9        | [This operation always evaluates to the same value](#ballerina-9)                                                 | [CWE-1164](https://cwe.mitre.org/data/definitions/1164.html)                                                           | —                                                                                                                                                                                |
| ballerina:10       | [This variable is assigned to itself](#ballerina-10)                                                              | [CWE-1164](https://cwe.mitre.org/data/definitions/1164.html)                                                           | —                                                                                                                                                                                |
| ballerina:11       | [Unused class private fields](#ballerina-11)                                                                      | [CWE-561](https://cwe.mitre.org/data/definitions/561.html)                                                             | —                                                                                                                                                                                |
| ballerina:12       | [Invalid range expression](#ballerina-12)                                                                         | [CWE-561](https://cwe.mitre.org/data/definitions/561.html)                                                             | —                                                                                                                                                                                |
| ballerina:13       | [Hard-coded secrets are security-sensitive](#ballerina-13)                                                        | [CWE-798](https://cwe.mitre.org/data/definitions/798.html), [CWE-259](https://cwe.mitre.org/data/definitions/259.html) | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina:14       | [Non configurable secrets are security-sensitive](#ballerina-14)                                                  | [CWE-798](https://cwe.mitre.org/data/definitions/798.html)                                                             | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina/crypto:1 | [Avoid using insecure cipher modes or padding schemes](#ballerina-crypto-1)                                       | [CWE-327](https://cwe.mitre.org/data/definitions/327.html), [CWE-780](https://cwe.mitre.org/data/definitions/780.html) | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |
| ballerina/crypto:2 | [Avoid using fast hashing algorithms](#ballerina-crypto-2)                                                        | [CWE-916](https://cwe.mitre.org/data/definitions/916.html), [CWE-327](https://cwe.mitre.org/data/definitions/327.html) | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |
| ballerina/crypto:3 | [Avoid reusing counter mode initialization vectors](#ballerina-crypto-3)                                          | [CWE-323](https://cwe.mitre.org/data/definitions/323.html)                                                             | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |
| ballerina/file:1   | [Avoid using publicly writable directories for file operations without proper access controls](#ballerina-file-1) | [CWE-377](https://cwe.mitre.org/data/definitions/377.html), [CWE-379](https://cwe.mitre.org/data/definitions/379.html) | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                                                                                        |
| ballerina/file:2   | [File function calls should not be vulnerable to path injection attacks](#ballerina-file-2)                       | [CWE-22](https://cwe.mitre.org/data/definitions/22.html)                                                               | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                                                                                        |
| ballerina/http:1   | [Avoid allowing default resource accessor](#ballerina-http-1)                                                     | [CWE-352](https://cwe.mitre.org/data/definitions/352.html)                                                             | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                                                                                        |
| ballerina/http:2   | [Avoid permissive Cross-Origin Resource Sharing](#ballerina-http-2)                                               | [CWE-942](https://cwe.mitre.org/data/definitions/942.html)                                                             | [A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/)                                                                                |
| ballerina/http:3   | [Server-side requests should not be vulnerable to traversing attacks](#ballerina-http-3)                          | [CWE-918](https://cwe.mitre.org/data/definitions/918.html)                                                             | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                                                                                        |
| ballerina/http:4   | [HTTP request redirections should not be open to forging attacks](#ballerina-http-4)                              | [CWE-601](https://cwe.mitre.org/data/definitions/601.html)                                                             | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                                                                                        |
| ballerina/io:1     | [I/O function calls should not be vulnerable to path injection attacks](#ballerina-io-1)                          | [CWE-22](https://cwe.mitre.org/data/definitions/22.html)                                                               | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                                                                                        |
| ballerina/io:2     | [Configurable variables should not be printed to the console](#ballerina-io-2)                                    | [CWE-532](https://cwe.mitre.org/data/definitions/532.html), [CWE-200](https://cwe.mitre.org/data/definitions/200.html) | [A09 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/)                                                      |
| ballerina/log:1    | [Potentially-sensitive configurable variables are logged](#ballerina-log-1)                                       | [CWE-532](https://cwe.mitre.org/data/definitions/532.html)                                                             | [A09 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/)                                                      |
| ballerina/log:2    | [Avoid writing log files to world-writable directories](#ballerina-log-2)                                         | [CWE-379](https://cwe.mitre.org/data/definitions/379.html)                                                             | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                                                                                        |
| ballerina/os:1     | [Avoid constructing system command arguments from user input without proper sanitization](#ballerina-os-1)        | [CWE-78](https://cwe.mitre.org/data/definitions/78.html), [CWE-88](https://cwe.mitre.org/data/definitions/88.html)     | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)                                                                                                                |
| ballerina/os:2     | [Avoid constructing environment variables from user input without proper sanitization](#ballerina-os-2)           | [CWE-454](https://cwe.mitre.org/data/definitions/454.html), [CWE-15](https://cwe.mitre.org/data/definitions/15.html)   | [A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/), [A06 Insecure Design](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/) |
| ballerina/os:3     | [Avoid executing commands through a shell interpreter](#ballerina-os-3)                                           | [CWE-78](https://cwe.mitre.org/data/definitions/78.html)                                                               | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)                                                                                                                |
| ballerina/os:4     | [Avoid executing commands resolved through the PATH environment variable](#ballerina-os-4)                        | [CWE-426](https://cwe.mitre.org/data/definitions/426.html)                                                             | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)                                                                                                                |
| ballerina/jwt:1    | [Avoid using weak cipher algorithms when signing and verifying JWTs](#ballerina-jwt-1)                            | [CWE-327](https://cwe.mitre.org/data/definitions/327.html), [CWE-347](https://cwe.mitre.org/data/definitions/347.html) | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |
| ballerina/jwt:2    | [Avoid validating JSON Web Tokens without a signature configuration](#ballerina-jwt-2)                            | [CWE-347](https://cwe.mitre.org/data/definitions/347.html)                                                             | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina/jwt:3    | [Avoid validating JSON Web Tokens without checking the issuer and the audience](#ballerina-jwt-3)                 | [CWE-287](https://cwe.mitre.org/data/definitions/287.html)                                                             | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina/jwt:4    | [Avoid issuing JSON Web Tokens with a long expiry time](#ballerina-jwt-4)                                         | [CWE-613](https://cwe.mitre.org/data/definitions/613.html)                                                             | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina/jwt:5    | [Avoid validating JSON Web Tokens with a large clock skew](#ballerina-jwt-5)                                      | [CWE-613](https://cwe.mitre.org/data/definitions/613.html)                                                             | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina/jwt:6    | [Avoid disabling TLS validation on the JWKS endpoint client](#ballerina-jwt-6)                                    | [CWE-295](https://cwe.mitre.org/data/definitions/295.html), [CWE-296](https://cwe.mitre.org/data/definitions/296.html) | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |
| ballerina/jwt:7    | [Avoid decoding JSON Web Tokens without verifying them](#ballerina-jwt-7)                                         | [CWE-347](https://cwe.mitre.org/data/definitions/347.html), [CWE-345](https://cwe.mitre.org/data/definitions/345.html) | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina/email:1  | [Avoid unverified server hostnames during SSL/TLS connections](#ballerina-email-1)                                | [CWE-297](https://cwe.mitre.org/data/definitions/297.html), [CWE-295](https://cwe.mitre.org/data/definitions/295.html) | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                                                                                    |
| ballerina/email:2  | [Avoid connecting to mail servers without TLS](#ballerina-email-2)                                                | [CWE-319](https://cwe.mitre.org/data/definitions/319.html)                                                             | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |
| ballerina/email:3  | [Avoid falling back to cleartext when TLS is unavailable](#ballerina-email-3)                                     | [CWE-757](https://cwe.mitre.org/data/definitions/757.html), [CWE-319](https://cwe.mitre.org/data/definitions/319.html) | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |
| ballerina/email:4  | [Avoid using weak TLS protocol versions](#ballerina-email-4)                                                      | [CWE-327](https://cwe.mitre.org/data/definitions/327.html), [CWE-326](https://cwe.mitre.org/data/definitions/326.html) | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                                                                                      |

## Language rules

### Avoid checkpanic

| Property              | Description                                                                                                               |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina:1                                                                                                               |
| **Rule Kind**         | Code Smell                                                                                                                |
| **Severity**          | Low                                                                                                                       |
| **CWE**               | [CWE-248](https://cwe.mitre.org/data/definitions/248.html), [CWE-636](https://cwe.mitre.org/data/definitions/636.html)    |
| **OWASP Top 10:2025** | [A10 Mishandling of Exceptional Conditions](https://owasp.org/Top10/2025/A10_2025-Mishandling_of_Exceptional_Conditions/) |

When `checkpanic` is used, the program terminates abruptly with a `panic` unless it’s handled explicitly along the call
stack.

#### Noncompliant Code Example

```ballerina
public function checkResult() {
    json result = checkpanic getResult();
    
    // ...
}

public function getResult() returns json|error {
    // ...
}
```

#### Compliant Code Example

Check and handle the error explicitly.

```ballerina
public function checkResult() {
    json|error result = getResult();

    if result is error {
        // handle error
    }

    // ...
}

public function getResult() returns json|error {
    // ...
}
```

Make use of the `check` keyword, which immediately returns the error or transfers control to an `on-fail` block, in
contrast to `checkpanic` and panicking if an expression or action evaluates to an error.

```ballerina
public function checkResult() returns error? {
    json result = check getResult();
}

public function getResult() returns json|error {
    // ...
}
```

### Unused function parameter

| Property      | Description                                                |
|---------------|------------------------------------------------------------|
| **Rule ID**   | ballerina:2                                                |
| **Rule Kind** | Code Smell                                                 |
| **Severity**  | Low                                                        |
| **CWE**       | [CWE-561](https://cwe.mitre.org/data/definitions/561.html) |

Unused function parameters cause unnecessary code complexity and can lead to confusion for developers maintaining the
code. They may also indicate potential errors in function design or changes in requirements that were not properly
implemented.

#### Noncompliant Code Example

```ballerina
import ballerina/io;

function name(int a, int b) {
   io:println(a);
}

public function main() {
   name(1, 2);
}
```

#### Compliant Code Example

Remove unused function parameters to improve code clarity and maintainability. If the parameter is intended for future
use or completeness, consider documenting it or refactoring the function to use it.

```ballerina
import ballerina/io;

function name(int a) {
   io:println(a);
}

public function main() {
   name(1);
}
```

### Non isolated public function

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:3 |
| **Rule Kind** | Code Smell  |
| **Severity**  | Low         |

A non-isolated function will not be called concurrently. Only isolated functions are called concurrently given that they
are guaranteed to be safe if the arguments are also safe. To allow being called concurrently, a public function should
be marked as isolated.

#### Noncompliant Code Example

```ballerina
public function helperFunction() {
   // isolated code
}
```

#### Compliant Code Example

Mark public functions as isolated to ensure the function can be called concurrently.

```ballerina
public isolated function helperFunction() {
   // isolated code
}
```

### Non isolated public method

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:4 |
| **Rule Kind** | Code Smell  |
| **Severity**  | Low         |

Class methods can be isolated. An isolated method is the same as an isolated function with self treated as a parameter.
A non-isolated method will not be called concurrently. Only isolated methods are called concurrently given that they are
guaranteed to be safe if the arguments are also safe. To allow being called concurrently, a public method should be
marked as isolated.

#### Noncompliant Code Example

```ballerina
class EvenNumber {
    int i = 1;

    public function generate() returns int {
        return self.i * 2;
    }
}
```

#### Compliant Code Example

Mark public methods as isolated to ensure the method can be called concurrently.

```ballerina
class EvenNumber {
    int i = 1;

    public isolated function generate() returns int {
        lock {
            return self.i * 2;
        }
    }
}
```

### Non isolated public class

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:5 |
| **Rule Kind** | Code Smell  |
| **Severity**  | Low         |

A class defined as isolated is similar to a module with isolated module-level variables. A non-isolated class will not
be accessed concurrently. Only isolated classes are accessed concurrently. To allow being accessed concurrently, a
public class should be marked as isolated.

#### Noncompliant Code Example

```ballerina
public class EvenNumber {
    int i = 1;

    public isolated function generate() returns int {
        lock {
            return self.i * 2;
        }
    }
}
```

#### Compliant Code Example

Mark public classes as isolated to ensure the class can be used in a concurrent environment.

```ballerina
public isolated class EvenNumber {
    int i = 1;

    public isolated function generate() returns int {
        lock {
            return self.i * 2;
        }
    }
}
```

### Non isolated public object

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:6 |
| **Rule Kind** | Code Smell  |
| **Severity**  | Low         |

A non-isolated object will not be accessed concurrently. Only isolated objects are accessed concurrently. To allow being
accessed concurrently, a public object should be marked as isolated.

#### Noncompliant Code Example

```ballerina
public type Hashable object {
    function hash() returns int;
};
```

#### Compliant Code Example

Mark public objects as isolated to ensure the object can be used in a concurrent environment.

```ballerina
public type Hashable isolated object {
    function hash() returns int;
};
```

### This operation always evaluates to true

| Property      | Description                                                |
|---------------|------------------------------------------------------------|
| **Rule ID**   | ballerina:7                                                |
| **Rule Kind** | Code Smell                                                 |
| **Severity**  | Low                                                        |
| **CWE**       | [CWE-571](https://cwe.mitre.org/data/definitions/571.html) |

Conditions that are always true don't do any meaningful computation. They increase code complexity, reduce the code
readability and potentially hide logical errors.

#### Noncompliant Code Example

```ballerina
public function main() {
   int a = 1;
   boolean b = a <= int:MAX_VALUE;
}
```

### This operation always evaluates to false

| Property      | Description                                                |
|---------------|------------------------------------------------------------|
| **Rule ID**   | ballerina:8                                                |
| **Rule Kind** | Code Smell                                                 |
| **Severity**  | Low                                                        |
| **CWE**       | [CWE-570](https://cwe.mitre.org/data/definitions/570.html) |

Conditions that are always false indicate unreachable code or logic that will never execute. This can clutter the
codebase, make it harder to understand, and potentially hide bugs or unintentional logic errors.

#### Noncompliant Code Example

```ballerina
public function main() {
   int a = 1;
   boolean b = a <= int:MIN_VALUE;
}
```

### This operation always evaluates to the same value

| Property      | Description                                                  |
|---------------|--------------------------------------------------------------|
| **Rule ID**   | ballerina:9                                                  |
| **Rule Kind** | Code Smell                                                   |
| **Severity**  | Low                                                          |
| **CWE**       | [CWE-1164](https://cwe.mitre.org/data/definitions/1164.html) |

Conditions which always evaluate to the same value don't do any meaningful computation. They increase code complexity,
reduce the code readability, and potentially hide logical errors.

#### Noncompliant Code Example

```ballerina
public function main() {
   int a = x % 1; // always evaluates to zero
}
```

### This variable is assigned to itself

| Property      | Description                                                  |
|---------------|--------------------------------------------------------------|
| **Rule ID**   | ballerina:10                                                 |
| **Rule Kind** | Code Smell                                                   |
| **Severity**  | Low                                                          |
| **CWE**       | [CWE-1164](https://cwe.mitre.org/data/definitions/1164.html) |

Self-assignments, where a variable is assigned to itself (x = x), are redundant and do not alter the state of the
variable. They can indicate incomplete or erroneous logic and make the code harder to read and maintain.

#### Noncompliant Code Example

```ballerina
public function main() {
   int x = 5;
   x = x;
}
```

### Unused class private fields

| Property      | Description                                                |
|---------------|------------------------------------------------------------|
| **Rule ID**   | ballerina:11                                               |
| **Rule Kind** | Code Smell                                                 |
| **Severity**  | Low                                                        |
| **CWE**       | [CWE-561](https://cwe.mitre.org/data/definitions/561.html) |

Unused or unread private fields/methods in a class can indicate incomplete or erroneous logic, lead to unnecessary
memory usage, and make the code harder to maintain and understand.

#### Noncompliant Code Example

```ballerina
class A {
  private int[] a = [];
  private int[] b = [];

  function foo() {
    self.a = [2];
  }
}

public function main() {
  A a = new A();
}
```

#### Compliant Code Example

Remove the unused private fields/methods. If the field/method is intended for future use or completeness, consider
documenting, refactoring the class to use it, or introducing it when ready to implement the rest.

```ballerina
class A {
  private int[] a = [];

  function foo() {
      self.a = [2];
  }
}

public function main() {
  A a = new A();
}
```

### Invalid range expression

| Property      | Description                                                |
|---------------|------------------------------------------------------------|
| **Rule ID**   | ballerina:12                                               |
| **Rule Kind** | Code Smell                                                 |
| **Severity**  | Low                                                        |
| **CWE**       | [CWE-561](https://cwe.mitre.org/data/definitions/561.html) |

The update clause of a range expression should ensure the counter moves in the correct direction. Incorrect range
expression directions can lead to unexpected behavior, making the code harder to understand and debug.

#### Noncompliant Code Example

```ballerina
import ballerina/io;

public function main() {
   foreach int i in 9...0 {
       io:println(i);
   }
}
```

#### Compliant Code Example

Ensure the range expression counter moves in the correct direction according to the desired iteration. Use the correct
range or adjust the range expression logic to achieve the intended behavior.

```ballerina
import ballerina/io;

public function main() {
   foreach int i in 0...9 {
       io:println(i);
   }
}
```

### Hard-coded secrets are security-sensitive

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina:13                                                                                                           |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | High                                                                                                                   |
| **CWE**               | [CWE-798](https://cwe.mitre.org/data/definitions/798.html), [CWE-259](https://cwe.mitre.org/data/definitions/259.html) |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                          |

Embedding secrets such as passwords, API keys, or tokens directly as literal values in source code exposes them to
anyone with access to the codebase or its version history. Rotating a compromised secret then requires a code change
and a redeploy.

The rule looks for string literals and constants assigned to names that suggest a secret, such as `password`, `passwd`,
`pwd`, `passphrase`, `secret`, `auth`, `apiKey`, and `token` (including their snake-case and kebab-case forms). It checks
variables, constants, default parameter values, record and object fields, map fields, and named arguments. It also
reports URLs that embed credentials, such as `http://user:password@example.com`.

#### Noncompliant Code Example

```ballerina
const string API_KEY = "a1b2c3d4";

public function main() {
    string password = "mySecurePassword123";
    string serviceUrl = "https://admin:admin123@api.example.com";
}
```

#### Compliant Code Example

Read secrets from configurable variables so their values are supplied at deployment rather than stored in the source.

```ballerina
configurable string password = ?;
configurable string serviceUrl = ?;

public function main() {
    connect(serviceUrl, password);
}
```

### Non configurable secrets are security-sensitive

| Property              | Description                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina:14                                                                                  |
| **Rule Kind**         | Vulnerability                                                                                 |
| **Severity**          | Medium                                                                                        |
| **CWE**               | [CWE-798](https://cwe.mitre.org/data/definitions/798.html)                                    |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/) |

A secret that is assigned a fixed value rather than being exposed as a configurable value forces the same secret to be
reused across environments. It also prevents the secret from being rotated or overridden without modifying and
redeploying the code.

The rule reports a secret-named variable, field, or argument whose value comes from a non-configurable variable or from
a computed expression, rather than from a configurable variable.

#### Noncompliant Code Example

```ballerina
string defaultValue = "password";

public type Credential record {
    string username;
    string password;
};

public function main() {
    string password = defaultValue;
    Credential credential = {username: "admin", password: defaultValue};
}
```

#### Compliant Code Example

Declare the secret as a configurable variable and reference it wherever the secret is needed.

```ballerina
configurable string password = ?;

public type Credential record {
    string username;
    string password;
};

public function main() {
    Credential credential = {username: "admin", password};
}
```

## Library rules

### Avoid using insecure cipher modes or padding schemes

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/crypto:1                                                                                                     |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | High                                                                                                                   |
| **CWE**               | [CWE-327](https://cwe.mitre.org/data/definitions/327.html), [CWE-780](https://cwe.mitre.org/data/definitions/780.html) |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                            |

Encryption algorithms are essential for protecting sensitive information and ensuring secure communications. When implementing encryption, it's critical to select not only strong algorithms but also secure modes of operation and padding schemes. Using weak or outdated encryption modes can compromise the security of otherwise strong algorithms.

#### AES Encryption Code Example

##### Noncompliant Code Example

```ballerina
import ballerina/crypto;

byte[] cipherText = check crypto:encryptAesEcb(data, key);
```

For AES, the weakest mode is ECB (Electronic Codebook). Repeated blocks of data are encrypted to the same value, making them easy to identify and reducing the difficulty of recovering the original cleartext.

```ballerina
import ballerina/crypto;

byte[] cipherText = check crypto:encryptAesCbc(data, key, initialVector);
```

Unauthenticated modes such as CBC (Cipher Block Chaining) may be used but are prone to attacks that manipulate the ciphertext (like padding oracle attacks). They must be used with caution and additional integrity checks.

##### Compliant Code Example

```ballerina
import ballerina/crypto;

byte[] cipherText = check crypto:encryptAesGcm(data, key, initialVector);
```

AES-GCM (Galois/Counter Mode) provides authenticated encryption, ensuring both confidentiality and integrity of the encrypted data.

#### RSA Encryption Example

##### Noncompliant Code Example

```ballerina
import ballerina/crypto;

// Default padding is PKCS1
byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey);

cipherText = check crypto:encryptRsaEcb(data, publicKey, crypto:PKCS1);
```

For `RSA`, avoid using `PKCS1v1.5` padding as it is vulnerable to various attacks. Instead, use `OAEP` (Optimal Asymmetric Encryption Padding) which provides better security.

##### Compliant Code Example

```ballerina
import ballerina/crypto;

byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey, crypto:OAEPwithMD5andMGF1);
```

The `OAEP` paddings such as `OAEPwithMD5andMGF1`, `OAEPWithSHA1AndMGF1`, `OAEPWithSHA256AndMGF1`, `OAEPwithSHA384andMGF1`, and `OAEPwithSHA512andMGF1` should be used for RSA encryption to enhance security.

### Avoid using fast hashing algorithms

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/crypto:2                                                                                                     |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | High                                                                                                                   |
| **CWE**               | [CWE-916](https://cwe.mitre.org/data/definitions/916.html), [CWE-327](https://cwe.mitre.org/data/definitions/327.html) |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                            |

Storing passwords in plaintext or using fast hashing algorithms creates significant security vulnerabilities. If an attacker gains access to your database, plaintext passwords are immediately compromised. Similarly, passwords hashed with fast algorithms (like `MD5`, `SHA-1`, or `SHA-256` without sufficient iterations) can be rapidly cracked using modern hardware.

Following are the OWASP (Open Web Application Security Project) recommended parameters:

For `BCrypt`:

- Use a work factor of 10 or more
- Only use `BCrypt` for password storage in legacy systems where `Argon2` and `scrypt` are not available
- Be aware of `BCrypt`'s 72-byte password length limit

For `Argon2`:

- Use the `Argon2id` variant (which Ballerina implements)
- Minimum configuration of 19 MiB (19,456 KB) of memory
- An iteration count of at least 2
- At least 1 degree of parallelism (this is enforced by Ballerina)

#### BCrypt Hashing Code Example

##### Noncompliant Code Example

```ballerina
import ballerina/crypto;
import ballerina/io;

public function main() returns error? {
    string password = "mySecurePassword123";
    // Using insufficient work factor
    string hashedPassword = check crypto:hashBcrypt(password, 4);
    io:println("Hashed Password: ", hashedPassword);
}
```

Using `BCrypt` with a work factor below 10 is insufficient and vulnerable to brute-force attacks.

##### Compliant Code Example

```ballerina
import ballerina/crypto;
import ballerina/io;

public function hashPassword() returns error? {
    string password = "mySecurePassword123";
    // Using sufficient work factor (14 or higher for better security)
    string hashedPassword = check crypto:hashBcrypt(password, 14);
    io:println("Hashed Password: ", hashedPassword);
}
```

#### Argon2 Hashing Code Example

##### Noncompliant Code Example

```ballerina
import ballerina/crypto;
import ballerina/io;

public function main() returns error? {
    string password = "mySecurePassword123";
    // Using insufficient memory configuration
    string hashedPassword = check crypto:hashArgon2(password, memory = 4096);
    io:println("Hashed Password: ", hashedPassword);
}
```

Using `Argon2` with insufficient memory (less than 19,456 KB) makes it vulnerable to attacks.

##### Compliant Code Example

```ballerina
import ballerina/crypto;
import ballerina/io;

public function hashPassword() returns error? {
    string password = "mySecurePassword123";
    // Using recommended parameters: sufficient memory, iterations, and parallelism
    string hashedPassword = check crypto:hashArgon2(password, iterations = 3, memory = 65536, parallelism = 4);
    io:println("Hashed Password: ", hashedPassword);
}
```

### Avoid reusing counter mode initialization vectors

| Property              | Description                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/crypto:3                                                                          |
| **Rule Kind**         | Vulnerability                                                                               |
| **Severity**          | High                                                                                        |
| **CWE**               | [CWE-323](https://cwe.mitre.org/data/definitions/323.html)                                  |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/) |

When using encryption algorithms in counter mode (such as `AES-GCM`, `AES-CCM`, or `AES-CTR`), initialization vectors (IVs) or nonces should never be reused with the same encryption key. Reusing IVs with the same key can completely compromise the security of the encryption.

#### AES-GCM Encryption Code Example

##### Noncompliant Code Example

```ballerina
import ballerina/crypto;

public function encryptData(string data) returns byte[]|error {
    byte[16] initialVector = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    byte[16] key = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    byte[] dataBytes = data.toBytes();
    return crypto:encryptAesGcm(dataBytes, key, initialVector);
}
```

In this non-compliant example, the initialization vector is hardcoded, meaning every encryption operation uses the same IV. This completely undermines the security of AES-GCM encryption, regardless of key strength.

##### Compliant Code Example

```ballerina
import ballerina/crypto;
import ballerina/random;

public function encryptData(string data) returns [byte[], byte[16]]|error {
    byte[16] initialVector = [];
    foreach int i in 0...15 {
        initialVector[i] = <byte>(check random:createIntInRange(0, 255));
    }
    byte[16] key = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    byte[] dataBytes = data.toBytes();
    byte[] encryptedData = check crypto:encryptAesGcm(dataBytes, key, initialVector);
    return [encryptedData, initialVector];
}
```

This compliant approach generates a cryptographically secure random initialization vector for each encryption operation and returns it along with the encrypted data. The IV must be stored alongside the encrypted data (but doesn't need to be kept secret) to allow for decryption later.

#### AES-CBC Encryption Code Example

##### Noncompliant Code Example

```ballerina
import ballerina/crypto;

public function encryptMessage(string message) returns byte[]|error {
    // Static nonce - this is vulnerable!
    byte[12] nonce = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    byte[16] key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    byte[] messageBytes = message.toBytes();
    return crypto:encryptAesCbc(messageBytes, key, nonce);
}
```

##### Compliant Code Example

```ballerina
import ballerina/crypto;
import ballerina/random;

public function encryptMessage(string message) returns [byte[], byte[12]]|error {
    // Generate unique nonce for each encryption
    byte[12] nonce = [];
    foreach int i in 0...11 {
        nonce[i] = <byte>(check random:createIntInRange(0, 255));
    }
    byte[16] key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    byte[] messageBytes = message.toBytes();
    byte[] encryptedData = check crypto:encryptAesCbc(messageBytes, key, nonce);
    return [encryptedData, nonce];
}
```

### Avoid using publicly writable directories for file operations without proper access controls

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/file:1                                                                                                       |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | Medium                                                                                                                 |
| **CWE**               | [CWE-377](https://cwe.mitre.org/data/definitions/377.html), [CWE-379](https://cwe.mitre.org/data/definitions/379.html) |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/)                              |

Operating systems often have global directories with write access granted to any user. These directories serve as
temporary storage locations like /tmp in Linux-based systems. However, when an application manipulates files within
these directories, it becomes vulnerable to race conditions on filenames. A malicious user may attempt to create a file
with a predictable name before the application does. If successful, such an attack could lead to unauthorized access,
modification, corruption, or deletion of other files. This risk escalates further if the application operates with
elevated permissions.

#### Noncompliant Code Example

```ballerina
import ballerina/file;
import ballerina/os;

string tempFolderPath = os:getEnv("TMP");
check file:create(tempFolderPath + "/" + "myfile.txt");
check file:getAbsolutePath(tempFolderPath + "/" + "myfile.txt");
check file:createTemp("suffix", "prefix");
check file:createTempDir((), "prefix");
```

#### Compliant Code Example

Use dedicated sub-folders.

```ballerina
import ballerina/file;

check file:create("./myDirectory/myfile.txt");
check file:getAbsolutePath("./myDirectory/myfile.txt");
```

### File function calls should not be vulnerable to path injection attacks

| Property              | Description                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/file:2                                                                          |
| **Rule Kind**         | Vulnerability                                                                             |
| **Severity**          | High                                                                                      |
| **CWE**               | [CWE-22](https://cwe.mitre.org/data/definitions/22.html)                                  |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

Path injections occur when an application constructs a file path using untrusted data without first validating the path.

A malicious user can inject specially crafted values, like "../", to alter the intended path. This manipulation may lead
the path to resolve to a location within the filesystem where the user typically wouldn't have access.

#### Noncompliant Code Example

```ballerina
import ballerina/file;
import ballerina/http;

listener http:Listener endpoint = new (8080);
string targetDirectory = "./path/to/target/directory/";

service / on endpoint {
    resource function get deleteFile(string fileName) returns string|error {
        check file:remove(targetDirectory + fileName);
        // ...
    }
}
```

#### Compliant Code Example

Conduct validation of canonical paths.

```ballerina
import ballerina/file;
import ballerina/http;

listener http:Listener endpoint = new (8080);
string targetDirectory = "./path/to/target/directory/";

service / on endpoint {
    resource function get deleteFile(string fileName) returns string|error {
        // Retrieve the normalized absolute path of the user provided file
        string absoluteUserFilePath = check file:getAbsolutePath(
            targetDirectory +
            fileName);
        string normalizedAbsoluteUserFilePath = check file:normalizePath(
            absoluteUserFilePath,
            file:CLEAN);

        // Check whether the user provided file exists
        boolean fileExists = check file:test(
            normalizedAbsoluteUserFilePath,
            file:EXISTS);
        if !fileExists {
            return "File does not exist!";
        }

        // Retrieve the normalized absolute path of parent directory of the user provided file
        string canonicalDestinationPath = check file:parentPath(
            normalizedAbsoluteUserFilePath);
        string normalizedCanonicalDestinationPath = check file:normalizePath(
            canonicalDestinationPath,
            file:CLEAN);

        // Retrieve the normalized absolute path of the target directory
        string absoluteTargetFilePath = check file:getAbsolutePath(
            targetDirectory);
        string normalizedTargetDirectoryPath = check file:normalizePath(
            absoluteTargetFilePath,
            file:CLEAN);

        // Perform comparison of user provided file path and target directory path
        boolean dirMatch = normalizedTargetDirectoryPath.equalsIgnoreCaseAscii(
            normalizedCanonicalDestinationPath);
        if !dirMatch {
            return "Entry is not in the target directory!";
        }

        check file:remove(normalizedAbsoluteUserFilePath);
    }
}
```

### Avoid allowing default resource accessor

| Property              | Description                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/http:1                                                                          |
| **Rule Kind**         | Vulnerability                                                                             |
| **Severity**          | Medium                                                                                    |
| **CWE**               | [CWE-352](https://cwe.mitre.org/data/definitions/352.html)                                |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

An HTTP resource is safe when used for read-only operations like GET, HEAD, or OPTIONS. An unsafe HTTP resource is used
to alter the state of an application, such as modifying the user’s profile on a web application.

Unsafe HTTP resources include POST, PUT, and DELETE.

Enabling both safe and insecure HTTP resources to execute a particular operation on a web application may compromise its
security; for instance, CSRF protections are typically designed to safeguard operations executed by insecure HTTP
resources.

#### Noncompliant Code Example

```ballerina
import ballerina/http;

listener http:Listener endpoint = new (8080);

service / on endpoint {
    // Sensitive: by default all HTTP methods are allowed
    resource function default deleteRequest(http:Request clientRequest, string username) returns string {
        // state of the application will be changed here
    }
}
```

#### Compliant Code Example

For every resource in an application, it’s crucial to explicitly define the type of the HTTP resource, ensuring that
safe resources are exclusively used for read-only operations.

```ballerina
import ballerina/http;

service / on endpoint {
    resource function delete deleteRequest(http:Request clientRequest, string username) returns string {
        // state of the application will be changed here
    }
}
```

### Avoid permissive Cross-Origin Resource Sharing

| Property              | Description                                                                                       |
|-----------------------|---------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/http:2                                                                                  |
| **Rule Kind**         | Vulnerability                                                                                     |
| **Severity**          | Medium                                                                                            |
| **CWE**               | [CWE-942](https://cwe.mitre.org/data/definitions/942.html)                                        |
| **OWASP Top 10:2025** | [A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/) |

Browsers enforce the same-origin policy by default, as a security measure, preventing JavaScript frontends from making
cross-origin HTTP requests to resources with different origins (domains, protocols, or ports). However, the target
resource can include additional HTTP headers in its response, known as CORS headers, which serve as directives for the
browser and modify the access control policy, effectively relaxing the same-origin policy.

#### Noncompliant Code Example

```ballerina
import ballerina/http;

listener http:Listener endpoint = new (8080);

service / on endpoint {
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["*"] // Sensitive
        }
    }

    resource function get example() returns http:Response|error? {
        // Return response
    }
}
```

#### Compliant Code Example

The resource configuration should be configured exclusively for trusted origins and specific resources.

```ballerina
import ballerina/http;

listener http:Listener endpoint = new (8080);

service / on endpoint {
    @http:ResourceConfig {
        cors: {
            allowOrigins: ["trustedwebsite.com"] // Compliant
        }
    }

    resource function get example() returns http:Response|error? {
        // Return response
    }
}
```

### Server-side requests should not be vulnerable to traversing attacks

| Property              | Description                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/http:3                                                                          |
| **Rule Kind**         | Vulnerability                                                                             |
| **Severity**          | High                                                                                      |
| **CWE**               | [CWE-918](https://cwe.mitre.org/data/definitions/918.html)                                |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

Server-Side Request Forgery (SSRF) is a vulnerability that allows attackers to induce the server-side application to make requests to an unintended location. When applications accept user input that influences server-side HTTP requests without proper validation or sanitization, attackers can manipulate these requests.

#### Noncompliant Code Example

```ballerina
import ballerina/http;

service /api/v1 on new http:Listener(8080) {
    resource function get users(string id) returns http:Response|error {
        http:Client userClient = check new ("http://example.com");
        // User input is used directly in the URL
        return userClient->/users/[id];
    }
}
```

#### Compliant Code Example

```ballerina
import ballerina/http;

service /api/v1 on new http:Listener(8080) {
    resource function get users(string id) returns http:Response|error {
        // Validate the user input
        string validatedId = check getValidatedId(id);
        http:Client userClient = check new ("http://example.com");
        return userClient->/users/[validatedId];
    }
}
```

### HTTP request redirections should not be open to forging attacks

| Property              | Description                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/http:4                                                                          |
| **Rule Kind**         | Vulnerability                                                                             |
| **Severity**          | Medium                                                                                    |
| **CWE**               | [CWE-601](https://cwe.mitre.org/data/definitions/601.html)                                |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

Open redirects occur when an application accepts user-controlled input that specifies a URL to which the user will be redirected. When these redirects are implemented without proper validation, attackers can craft redirection URLs to malicious sites.

#### Noncompliant Code Example

```ballerina
import ballerina/http;

service /api/v1 on new http:Listener(8080) {
    resource function get redirect(string location) returns http:TemporaryRedirect {
        return {
            headers: {
                // User input is used directly in the Location header
                "Location": location
            }
        };
    }
}
```

#### Compliant Code Example

```ballerina
import ballerina/http;

service /api/v1 on new http:Listener(8080) {
    resource function get redirect(string location) returns http:TemporaryRedirect|error {
        // Validate the user input
        string validatedLocation = check getValidatedLocation(location);
        return {
            headers: {
                "Location": validatedLocation
            }
        };
    }
}
```

### I/O function calls should not be vulnerable to path injection attacks

| Property              | Description                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/io:1                                                                            |
| **Rule Kind**         | Vulnerability                                                                             |
| **Severity**          | High                                                                                      |
| **CWE**               | [CWE-22](https://cwe.mitre.org/data/definitions/22.html)                                  |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

Path injections occur when an application constructs a file path using untrusted data without first validating the path.

A malicious user can inject specially crafted values, like "../", to alter the intended path. This manipulation may lead
the path to resolve to a location within the filesystem where the user typically wouldn't have access.

#### Noncompliant Code Example

```ballerina
import ballerina/http;
import ballerina/io;

service /fileService on new http:Listener(8080) {
   resource function get file(string fileName) returns string|error {
       // Noncompliant: User input is directly concatenated into the file path
       string filePath = "./resources/" + fileName;

       // Reading file without validating the path
       string content = check io:fileReadString(filePath);
       return content;
   }
}
```

#### Compliant Code Example

Validate and normalize the path to ensure the accessed file remains within the intended target directory.

```ballerina
import ballerina/file;
import ballerina/http;
import ballerina/io;

service /fileService on new http:Listener(8080) {
    resource function get file(string fileName) returns string|error {
        string targetDirectory = "./resources/";

        // Retrieve the normalized absolute path of the user-provided file
        string absoluteUserFilePath = check file:getAbsolutePath(targetDirectory + fileName);
        string normalizedAbsoluteUserFilePath = check file:normalizePath(absoluteUserFilePath, file:CLEAN);

        // Retrieve the normalized absolute path of the target directory
        string absoluteTargetFilePath = check file:getAbsolutePath(targetDirectory);
        string normalizedTargetDirectoryPath = check file:normalizePath(absoluteTargetFilePath, file:CLEAN);

        // Perform comparison of user provided file path and target directory path
        boolean dirMatch = normalizedTargetDirectoryPath.equalsIgnoreCaseAscii(
        check file:parentPath(normalizedAbsoluteUserFilePath));
        if !dirMatch {
            return "Access to files outside the target directory is not allowed!";
        }

        string content = check io:fileReadString(normalizedAbsoluteUserFilePath);
        return content;
    }
}
```

### Configurable variables should not be printed to the console

| Property              | Description                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/io:2                                                                                                              |
| **Rule Kind**         | Vulnerability                                                                                                               |
| **Severity**          | High                                                                                                                        |
| **CWE**               | [CWE-532](https://cwe.mitre.org/data/definitions/532.html), [CWE-200](https://cwe.mitre.org/data/definitions/200.html)      |
| **OWASP Top 10:2025** | [A09 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/) |

Configurable variables carry the values supplied at deployment, which is where credentials, tokens, and connection
secrets live. Standard output is collected by the container runtime and forwarded to whatever log aggregator the
platform uses, so printing one moves the value out of the deployment configuration and into a durable store that a far
wider set of people can read.

The rule does not attempt to decide which configurables hold secrets. Every deployment-supplied value is treated as
sensitive, which is the same position `ballerina/log:1` takes for log statements.

#### Noncompliant Code Example

```ballerina
import ballerina/io;

configurable string dbPassword = ?;

public function connect() {
    io:println(dbPassword);
    io:println(string `Connecting with ${dbPassword}`);
}
```

#### Compliant Code Example

Print a value that identifies the configuration rather than the configuration itself, or omit the statement.

```ballerina
import ballerina/io;

configurable string dbPassword = ?;

public function connect() {
    io:println("Connecting to the configured database");
}
```

Every configurable is treated as sensitive, including one that holds no secret, so a compliant message names none of
them.

### Potentially-sensitive configurable variables are logged

| Property              | Description                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/log:1                                                                                                             |
| **Rule Kind**         | Vulnerability                                                                                                               |
| **Severity**          | Medium                                                                                                                      |
| **CWE**               | [CWE-532](https://cwe.mitre.org/data/definitions/532.html)                                                                  |
| **OWASP Top 10:2025** | [A09 Security Logging and Alerting Failures](https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/) |

In Ballerina, configurable variables typically contain sensitive data that should not be exposed externally and are
usually kept secret. This includes credentials to access external systems, such as databases. To protect users' privacy,
information is forbidden or strongly discouraged from being logged, such as user passwords or credit card numbers, which
should obviously not be stored or at least not in clear text.

#### Noncompliant Code Example

```ballerina
import ballerina/log;

configurable string password = ?;
configurable string user = ?;

public function main() {
   log:printInfo(password);
   log:printError(string `Error: ${password}`);
   log:printWarn(`Error: ${password}`);
   log:printError("Error " + password);
   log:printWarn("Warning", password = password);
   log:printError("Error", password = password, user = user);
}
```

#### Compliant Code Example

Avoid using configurable variables inside the logging statement.

```ballerina
import ballerina/log;

int id = 12345;

public function main() {
   log:printInfo(“task executed successfully.”, id = id);
}
```

### Avoid writing log files to world-writable directories

| Property              | Description                                                                               |
|-----------------------|-------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/log:2                                                                           |
| **Rule Kind**         | Vulnerability                                                                             |
| **Severity**          | Medium                                                                                    |
| **CWE**               | [CWE-379](https://cwe.mitre.org/data/definitions/379.html)                                |
| **OWASP Top 10:2025** | [A01 Broken Access Control](https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/) |

Logs routinely capture request details, identifiers, and error context, so the log file itself is a sensitive artefact.
A world-writable directory such as `/tmp` lets any local account create the file before the service does. The service
then appends to a file it does not own, and the permissions on that file were chosen by whoever created it, so the log
can be readable to others or replaced with a file of their choosing.

The rule reads both ways of naming a log file: the deprecated `setOutputFile`, and the `path` of a file destination on a
logger configuration. A path is reported only when it is anchored at a world-writable directory, including one reached
through `os:getEnv("TMPDIR")` and its variants.

#### Noncompliant Code Example

```ballerina
import ballerina/log;

public function configureLogging() returns error? {
    check log:setOutputFile("/tmp/application.log");

    log:Logger _ = check log:fromConfig({
        destinations: [{'type: log:FILE, path: "/var/tmp/service.log"}]
    });
}
```

#### Compliant Code Example

Write logs under a directory the service owns, with permissions that exclude other accounts.

```ballerina
import ballerina/log;

public function configureLogging() returns error? {
    log:Logger _ = check log:fromConfig({
        destinations: [{'type: log:FILE, path: "./logs/service.log"}]
    });
}
```

### Avoid constructing system command arguments from user input without proper sanitization

| Property              | Description                                                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/os:1                                                                                                     |
| **Rule Kind**         | Vulnerability                                                                                                      |
| **Severity**          | Blocker                                                                                                            |
| **CWE**               | [CWE-78](https://cwe.mitre.org/data/definitions/78.html), [CWE-88](https://cwe.mitre.org/data/definitions/88.html) |
| **OWASP Top 10:2025** | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/)                                                  |

Arguments of system commands are processed by the executed program. The arguments are usually used to configure and
influence the behavior of the programs. Control over a single argument might be enough for an attacker to trigger
dangerous features like executing arbitrary commands or writing files into specific directories.

Arguments like -delete or -exec for the find command can alter the expected behavior and result in vulnerabilities.

#### Noncompliant Code Example

```ballerina
import ballerina/os;

string terminalPath = ...;
string input = request.getQueryParamValue("input").toString();
string[] cmd = [..., input];

// Sensitive
os:Process result = check os:exec({
    value: terminalPath,
    arguments: cmd
});
```

#### Compliant Code Example

Use an allow-list to restrict the arguments to trusted values.

```ballerina
import ballerina/os;

string terminalPath = ...;
string input = request.getQueryParamValue("input").toString();
string[] cmd = [..., input];
string[] allowed = ["main", "main.bal", "bal"];

if allowed.some(keyword => keyword.equalsIgnoreCaseAscii(input)) {
    os:Process result = check os:exec({
        value: terminalPath,
        arguments: cmd
    });
}
```

### Avoid constructing environment variables from user input without proper sanitization

| Property              | Description                                                                                                                                                                      |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/os:2                                                                                                                                                                   |
| **Rule Kind**         | Vulnerability                                                                                                                                                                    |
| **Severity**          | Medium                                                                                                                                                                           |
| **CWE**               | [CWE-454](https://cwe.mitre.org/data/definitions/454.html), [CWE-15](https://cwe.mitre.org/data/definitions/15.html)                                                             |
| **OWASP Top 10:2025** | [A02 Security Misconfiguration](https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/), [A06 Insecure Design](https://owasp.org/Top10/2025/A06_2025-Insecure_Design/) |

Environment variables are inherited by every child process. Setting one from a value that arrives from outside the
program therefore reaches well beyond the code that set it, and several variables change how a program resolves
libraries or executables rather than merely what data it works on. A caller who controls an environment variable can
influence programs the service starts later, including which executable or library they load.

#### Noncompliant Code Example

```ballerina
import ballerina/os;

public function configure(string userInput) returns os:Error? {
    check os:setEnv("APP_MODE", userInput);
}
```

#### Compliant Code Example

Set environment variables from values the program controls. Where a caller must influence one, validate the value
against the set the program expects.

```ballerina
import ballerina/os;

public function configure(string userInput) returns os:Error? {
    if !["production", "staging"].some(mode => mode == userInput) {
        return error("unknown mode");
    }
    check os:setEnv("APP_MODE", userInput);
}
```

### Avoid executing commands through a shell interpreter

| Property              | Description                                                       |
|-----------------------|-------------------------------------------------------------------|
| **Rule ID**           | ballerina/os:3                                                    |
| **Rule Kind**         | Vulnerability                                                     |
| **Severity**          | High                                                              |
| **CWE**               | [CWE-78](https://cwe.mitre.org/data/definitions/78.html)          |
| **OWASP Top 10:2025** | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/) |

`os:exec` takes the executable and its arguments separately, and that separation is what keeps an argument from being
read as syntax. Invoking a shell with a command string throws it away: the argument becomes a script, and every
metacharacter in it, such as `;`, `|`, or `$()`, is interpreted again. Any value reaching the command string can run
arbitrary commands with the privileges of the service.

The rule reports a shell only when it is handed a command string, through `-c`, `/c`, or the PowerShell equivalents. A
shell invoked to run a script by path is not reported, but the script path and its contents still have to be as trusted
as the program itself.

#### Noncompliant Code Example

```ballerina
import ballerina/os;

public function countFiles() returns os:Process|error {
    return check os:exec({value: "/bin/sh", arguments: ["-c", "ls /var/data | wc -l"]});
}
```

#### Compliant Code Example

Run the executable directly and pass its arguments as separate list elements.

```ballerina
import ballerina/os;

public function countFiles() returns os:Process|error {
    return check os:exec({value: "/bin/ls", arguments: ["/var/data"]});
}
```

### Avoid executing commands resolved through the PATH environment variable

| Property              | Description                                                       |
|-----------------------|-------------------------------------------------------------------|
| **Rule ID**           | ballerina/os:4                                                    |
| **Rule Kind**         | Vulnerability                                                     |
| **Severity**          | High                                                              |
| **CWE**               | [CWE-426](https://cwe.mitre.org/data/definitions/426.html)        |
| **OWASP Top 10:2025** | [A05 Injection](https://owasp.org/Top10/2025/A05_2025-Injection/) |

A bare executable name is resolved through `PATH` at run time, so which program actually runs depends on the environment
the service happens to start in. Anyone able to place a file earlier in `PATH`, or to set `PATH` itself, chooses the
program that executes, with the service's own privileges. `os:setEnv` allows exactly that from within the same program.

#### Noncompliant Code Example

```ballerina
import ballerina/os;

public function status() returns os:Process|error {
    return check os:exec({value: "git", arguments: ["status"]});
}
```

#### Compliant Code Example

Name the executable by an absolute path, or by a path relative to a directory the service controls.

```ballerina
import ballerina/os;

public function status() returns os:Process|error {
    return check os:exec({value: "/usr/bin/git", arguments: ["status"]});
}
```

### Avoid using weak cipher algorithms when signing and verifying JWTs

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/jwt:1                                                                                                        |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | High                                                                                                                   |
| **CWE**               | [CWE-327](https://cwe.mitre.org/data/definitions/327.html), [CWE-347](https://cwe.mitre.org/data/definitions/347.html) |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                            |

JSON Web Tokens (JWTs) are a compact, URL-safe means of representing claims between two parties. They're commonly used
for authentication and authorization in web applications. The security of JWT-based authentication depends critically on
the signature mechanism used to verify token authenticity.

When JWTs are issued without a signature or with weak algorithms, attackers can forge tokens to impersonate legitimate
users, modify token claims, bypass authentication entirely, and gain unauthorized access to protected resources.

#### Noncompliant Code Example

```ballerina
import ballerina/jwt;

jwt:IssuerConfig issuerConfig = {
    issuer: "ballerina",
    expTime: 3600,
    signatureConfig: {
        algorithm: jwt:NONE
    }
};

string token = check jwt:issue(issuerConfig);
```

#### Compliant Code Example

Use a strong signing algorithm like RS256, which uses RSA encryption with an SHA-256 hash function.

```ballerina
import ballerina/jwt;

jwt:IssuerConfig issuerConfig = {
    issuer: "ballerina",
    expTime: 3600,
    signatureConfig: {
        algorithm: jwt:RS256,
        config: {
            keyFile: "private.key"
        }
    }
};

string token = check jwt:issue(issuerConfig);
```

### Avoid validating JSON Web Tokens without a signature configuration

| Property              | Description                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/jwt:2                                                                               |
| **Rule Kind**         | Vulnerability                                                                                 |
| **Severity**          | High                                                                                          |
| **CWE**               | [CWE-347](https://cwe.mitre.org/data/definitions/347.html)                                    |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/) |

`signatureConfig` is optional, and leaving it out removes the signature check rather than defaulting to one.
`jwt:validate` still parses the token and returns its claims, so the calling code reads them as though they had been
verified. A token anyone assembled and self-signed is then accepted on the same terms as one the identity provider
issued.

#### Noncompliant Code Example

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina"
});
```

#### Compliant Code Example

Configure the signature check with the trusted certificate, a JWKS endpoint, or a trust store.

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina",
    signatureConfig: {
        certFile: "/path/to/public.crt"
    }
});
```

### Avoid validating JSON Web Tokens without checking the issuer and the audience

| Property              | Description                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/jwt:3                                                                               |
| **Rule Kind**         | Vulnerability                                                                                 |
| **Severity**          | Medium                                                                                        |
| **CWE**               | [CWE-287](https://cwe.mitre.org/data/definitions/287.html)                                    |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/) |

A signature proves only that the token was minted by a key the service trusts. Without `issuer` and `audience`, a token
that the same key issued for a different service, or for a different tenant, satisfies the validator as well. A token
obtained legitimately for a low-value service can then be replayed against a high-value one.

#### Noncompliant Code Example

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    signatureConfig: {
        certFile: "/path/to/public.crt"
    }
});
```

#### Compliant Code Example

Pin both the expected issuer and the audience the service is registered as.

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina",
    signatureConfig: {
        certFile: "/path/to/public.crt"
    }
});
```

### Avoid issuing JSON Web Tokens with a long expiry time

| Property              | Description                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/jwt:4                                                                               |
| **Rule Kind**         | Vulnerability                                                                                 |
| **Severity**          | Medium                                                                                        |
| **CWE**               | [CWE-613](https://cwe.mitre.org/data/definitions/613.html)                                    |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/) |

A JWT is accepted on its own contents; there is no revocation step in the validation path. Where no revocation list or
signing-key rotation is in place, the expiry is the only thing that ends a stolen token's usefulness. `expTime` defaults
to 300 seconds, and the rule reports a lifetime beyond one day.

#### Noncompliant Code Example

```ballerina
import ballerina/jwt;

string token = check jwt:issue({
    issuer: "wso2",
    audience: "ballerina",
    expTime: 604800,
    signatureConfig: {
        algorithm: jwt:RS256,
        config: {keyFile: "/path/to/private.key"}
    }
});
```

#### Compliant Code Example

Issue short-lived tokens and let clients obtain a new one when it expires.

```ballerina
import ballerina/jwt;

string token = check jwt:issue({
    issuer: "wso2",
    audience: "ballerina",
    expTime: 300,
    signatureConfig: {
        algorithm: jwt:RS256,
        config: {keyFile: "/path/to/private.key"}
    }
});
```

### Avoid validating JSON Web Tokens with a large clock skew

| Property              | Description                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/jwt:5                                                                               |
| **Rule Kind**         | Vulnerability                                                                                 |
| **Severity**          | Medium                                                                                        |
| **CWE**               | [CWE-613](https://cwe.mitre.org/data/definitions/613.html)                                    |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/) |

`clockSkew` is allowed on both ends of every expiry check, so it silently lengthens the validity window of every token,
including ones that have already expired. It defaults to zero, and a few minutes covers any realistic clock drift
between hosts. The rule reports a skew beyond five minutes.

#### Noncompliant Code Example

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina",
    clockSkew: 3600,
    signatureConfig: {certFile: "/path/to/public.crt"}
});
```

#### Compliant Code Example

Keep the skew to what clock drift actually requires, and synchronise clocks rather than widening the window.

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina",
    clockSkew: 60,
    signatureConfig: {certFile: "/path/to/public.crt"}
});
```

### Avoid disabling TLS validation on the JWKS endpoint client

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/jwt:6                                                                                                        |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | High                                                                                                                   |
| **CWE**               | [CWE-295](https://cwe.mitre.org/data/definitions/295.html), [CWE-296](https://cwe.mitre.org/data/definitions/296.html) |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                            |

A JWKS configuration carries its own client for reaching the keys endpoint, separate from any other client the service
uses. Setting `disable` to `true` on its secure socket means keys are accepted from any host able to answer for the JWKS
URL. An attacker who can answer for that URL supplies their own signing key, and every signature check downstream then
passes against it.

#### Noncompliant Code Example

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina",
    signatureConfig: {
        jwksConfig: {
            url: "https://idp.example.com/jwks",
            clientConfig: {
                secureSocket: {disable: true}
            }
        }
    }
});
```

#### Compliant Code Example

Leave TLS validation enabled and supply the certificate the keys endpoint presents.

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina",
    signatureConfig: {
        jwksConfig: {
            url: "https://idp.example.com/jwks",
            clientConfig: {
                secureSocket: {cert: "/path/to/public.crt"}
            }
        }
    }
});
```

### Avoid decoding JSON Web Tokens without verifying them

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/jwt:7                                                                                                        |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | Low                                                                                                                    |
| **CWE**               | [CWE-347](https://cwe.mitre.org/data/definitions/347.html), [CWE-345](https://cwe.mitre.org/data/definitions/345.html) |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                          |

`jwt:decode` splits a token and returns its header and payload. It checks no signature, no issuer, no audience, and no
expiry. The claims it returns are whatever the sender wrote, so a decision made from them is a decision made on
attacker-supplied data. `jwt:validate` is the function that establishes trust.

Reading the header before validating, to select a key by `kid`, is a legitimate use. The rule reports the call for
review rather than asserting a defect, so a deliberate decode is expected to be reviewed and suppressed.

#### Noncompliant Code Example

```ballerina
import ballerina/jwt;

[jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(token);
```

#### Compliant Code Example

Validate the token and read the claims from the validated payload.

```ballerina
import ballerina/jwt;

jwt:Payload payload = check jwt:validate(token, {
    issuer: "wso2",
    audience: "ballerina",
    signatureConfig: {certFile: "/path/to/public.crt"}
});
```

### Avoid unverified server hostnames during SSL/TLS connections

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/email:1                                                                                                      |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | High                                                                                                                   |
| **CWE**               | [CWE-297](https://cwe.mitre.org/data/definitions/297.html), [CWE-295](https://cwe.mitre.org/data/definitions/295.html) |
| **OWASP Top 10:2025** | [A07 Authentication Failures](https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/)                          |

Using outdated or weak SSL/TLS protocols puts application communications at serious risk. These obsolete protocols
contain known vulnerabilities that attackers can exploit to intercept, decrypt, or manipulate data transmitted between
clients and servers.

#### Noncompliant Code Example

```ballerina
import ballerina/email;

public function main() returns error? {
    email:PopClient _ = check new ("smtp.email.com", "sender@email.com", "pass123", clientConfig = {
        port: 465,
        secureSocket: {
            cert: "path/to/certfile.crt",
            protocol: {
                name: email:TLS,
                versions: ["TLSv1.2", "TLSv1.1"]
            },
            ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA"],
            verifyHostName: false
        }
    });
}
```

#### Compliant Code Example

Enable hostname verification to ensure the server's certificate matches the hostname.

```ballerina
import ballerina/email;

public function main() returns error? {
    email:PopClient _ = check new ("smtp.email.com", "sender@email.com", "pass123", clientConfig = {
        port: 465,
        secureSocket: {
            cert: "path/to/certfile.crt",
            protocol: {
                name: email:TLS,
                versions: ["TLSv1.2"]
            },
            ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA"],
            verifyHostName: true
        }
    });
}
```

### Avoid connecting to mail servers without TLS

| Property              | Description                                                                                 |
|-----------------------|---------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/email:2                                                                           |
| **Rule Kind**         | Vulnerability                                                                               |
| **Severity**          | High                                                                                        |
| **CWE**               | [CWE-319](https://cwe.mitre.org/data/definitions/319.html)                                  |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/) |

The `security` field decides whether the connection is protected at all. `START_TLS_NEVER` disables the upgrade
entirely, so the session, including the mailbox credentials sent during authentication, crosses the network in the
clear. Anyone on the network path can read the credentials and every message the client sends or retrieves, and can
modify them in transit.

#### Noncompliant Code Example

```ballerina
import ballerina/email;

email:SmtpClient smtpClient = check new ("smtp.example.com", "sender@example.com", "password", clientConfig = {
    port: 25,
    security: email:START_TLS_NEVER
});
```

#### Compliant Code Example

Use `SSL` for an implicitly encrypted connection, or `START_TLS_ALWAYS` where the protocol requires the upgrade form.

```ballerina
import ballerina/email;

email:SmtpClient smtpClient = check new ("smtp.example.com", "sender@example.com", "password", clientConfig = {
    port: 587,
    security: email:START_TLS_ALWAYS
});
```

### Avoid falling back to cleartext when TLS is unavailable

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/email:3                                                                                                      |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | Medium                                                                                                                 |
| **CWE**               | [CWE-757](https://cwe.mitre.org/data/definitions/757.html), [CWE-319](https://cwe.mitre.org/data/definitions/319.html) |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                            |

`START_TLS_AUTO` upgrades the connection when the server advertises STARTTLS and continues in plaintext when it does
not. Whether the credentials are encrypted is therefore decided by the server's greeting, which an attacker positioned
on the network path can rewrite. Stripping the advertisement is enough to have the client send everything in the clear,
and nothing in the client indicates that anything went wrong.

#### Noncompliant Code Example

```ballerina
import ballerina/email;

email:ImapClient imapClient = check new ("imap.example.com", "reader@example.com", "password", clientConfig = {
    port: 143,
    security: email:START_TLS_AUTO
});
```

#### Compliant Code Example

Use `START_TLS_ALWAYS`, which fails the connection instead of downgrading it, or `SSL` for an implicitly encrypted
connection.

```ballerina
import ballerina/email;

email:ImapClient imapClient = check new ("imap.example.com", "reader@example.com", "password", clientConfig = {
    port: 143,
    security: email:START_TLS_ALWAYS
});
```

### Avoid using weak TLS protocol versions

| Property              | Description                                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| **Rule ID**           | ballerina/email:4                                                                                                      |
| **Rule Kind**         | Vulnerability                                                                                                          |
| **Severity**          | Medium                                                                                                                 |
| **CWE**               | [CWE-327](https://cwe.mitre.org/data/definitions/327.html), [CWE-326](https://cwe.mitre.org/data/definitions/326.html) |
| **OWASP Top 10:2025** | [A04 Cryptographic Failures](https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/)                            |

TLS 1.0 and TLS 1.1 depend on MD5 and SHA-1 in the handshake and support no AEAD cipher suites, and RFC 8996 deprecates
both for those reasons. The SSL family is broken outright. Naming any of them in `protocol.versions` pins the connection
to a version a current server should refuse, and lets an attacker able to influence the negotiation attack the
encryption itself.

#### Noncompliant Code Example

```ballerina
import ballerina/email;

email:SmtpClient smtpClient = check new ("smtp.example.com", "sender@example.com", "password", clientConfig = {
    secureSocket: {
        cert: "/path/to/public.crt",
        protocol: {
            name: email:TLS,
            versions: ["TLSv1.2", "TLSv1.1"]
        }
    }
});
```

#### Compliant Code Example

Name only TLS 1.2 and TLS 1.3, or leave `protocol` unset and take the runtime's defaults.

```ballerina
import ballerina/email;

email:SmtpClient smtpClient = check new ("smtp.example.com", "sender@example.com", "password", clientConfig = {
    secureSocket: {
        cert: "/path/to/public.crt",
        protocol: {
            name: email:TLS,
            versions: ["TLSv1.2", "TLSv1.3"]
        }
    }
});
```
