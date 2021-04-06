---
layout: ballerina-left-nav-pages-swanlake
title: Writing Secure Ballerina Code
description: Check out the different security features and controls available within the Ballerina programming language and follow the guidelines on writing secure Ballerina programs.
keywords: ballerina, programming language, security, secure ballerina code
permalink: /learn/user-guide/security/writing-secure-ballerina-code/
active: writing-secure-ballerina-code
intro: The sections below include information on the different security features and controls available within Ballerina. Also, they provide guidelines on writing secure Ballerina programs.
redirect_from:
  - /learn/how-to-write-secure-ballerina-code
  - /learn/how-to-write-secure-ballerina-code/
  - /learn/writing-secure-ballerina-code/
  - /learn/writing-secure-ballerina-code
  - /learn/security/writing-secure-ballerina-code
  - /learn/security/
  - /learn/security
  - /swan-lake/learn/security/writing-secure-ballerina-code/
  - /swan-lake/learn/security/writing-secure-ballerina-code
  - /learn/security/writing-secure-ballerina-code/
  - /learn/security/writing-secure-ballerina-code
  - /learn/user-guide/security/writing-secure-ballerina-code
  - /learn/user-guide/security/
  - /learn/user-guide/security
---

## Securing by Design

This approach makes it unnecessary for developers to review best practice coding lists that itemize how to avoid security vulnerabilities. The Ballerina compiler ensures that Ballerina programs do not introduce security vulnerabilities.

A taint analysis mechanism is used to achieve this.

Parameters in function calls can be designated as security-sensitive. The compiler will generate an error if you pass untrusted data (tainted data) into a security-sensitive parameter:

```
tainted value passed to sensitive parameter 'sqlQuery'
```

We require developers to explicitly mark all values passed into security-sensitive parameters as 'trusted'. This explicit check forces developers and code reviewers to verify that the values being passed into the parameter are not vulnerable to a security violation.

Ballerina standard library makes sure untrusted data cannot be used with security sensitive parameters such as SQL queries, file paths, file name, permission flags, request URLs and configuration keys, preventing  vulnerabilities, including:

* SQL Injection
* Path Manipulation
* File Manipulation
* Unauthorized File Access
* Unvalidated Redirect (Open Redirect)

### Securing Ballerina Standard Libraries

Security-sensitive functions and remote methods of Ballerina standard libraries are annotated with the `@untainted` parameter annotation. This denotes that untrusted (tainted) data should not be passed to the parameter. 

For example, the `sqlQuery` parameter of the `ballerinax/java.jdbc` `select` remote method is annotated as `@untainted`.

```ballerina
public remote function query(@untainted string|sql:ParameterizedQuery sqlQuery, typedesc<record {}>? rowType = ())
    returns @tainted stream <record {}, sql:Error>
```

The following example constructs an SQL query with a tainted argument:

Note: Taint analyzer does not emit errors by default. This can be enabled by adding the `--taint-check` flag to the `build` or `run` command
 or by adding `taintCheck = true` in the `Ballerina.toml` file.

```ballerina
import ballerinax/java.jdbc
import ballerina/sql;

public function main(string... args) {

    jdbc:Client|sql:Error jdbcClient = new("jdbc:mysql://localhost:3306/testdb", "test", "test");
    if (jdbcClient is jdbc:Client) {
        // Construct student ID based on user input.
        string studentId = "S_" + args[0];

        // Execute select query using the untrusted (tainted) student ID
        stream<record{}, error> resultStream = jdbcClient->query("SELECT NAME FROM STUDENT WHERE ID = " + studentId);
        error? status = jdbcClient.close();
    }
}
```

The Ballerina compiler will generate an error:

```
tainted value passed to untainted parameter 'sqlQuery'
```

In order to compile, the program is modified to use query parameters:

```ballerina
stream<record{}, error> resultStream = jdbcClient->query(`SELECT NAME FROM STUDENT WHERE ID = ${<@untainted> studentId}`);
```

Command-line arguments passed to Ballerina programs and inputs received through service resources are considered as tainted. Additionally, return values of certain functions are marked with the `@tainted` annotation to denote that the resulting value should be considered as untrusted data.

For example, the `query` remote method of the `java.jdbc` client highlighted above returns a value of type `@tainted
 stream <record {}, sql:Error>`. This means that any value read from a database is considered as untrusted.

When the Ballerina compiler can determine that a function is returning tainted data without tainted data being passed in as parameters to that function, it is required to annotate the function's return type with the `@tainted` annotation. If not, the function author has to clean up the data before returning. For instance, if you want to read from the database and return a result, you either need to annotate that function's return type with `@tainted` or you have to clean up and make sure the returned data is not tainted.

### Using Tainted Data with Security-Sensitive Parameters

There can be certain situations where a tainted value must be passed into a security-sensitive parameter. In such situations, it is essential to do proper data validation or data sanitization to make sure the input does not result in a security threat. Once proper controls are in place, the `@untainted` annotation can be used with a type cast operator to denote that the value is trusted:

```ballerina
// Execute select query using the untrusted (tainted) student ID
boolean isValid = isNumeric(studentId);
if (isValid) {
    var resultStream = jdbcClient->query("SELECT NAME FROM STUDENT WHERE ID = " + <@untainted>studentId);
}
// ...
```

Additionally, return values can be annotated with`@untainted`. This denotes that the return value should be trusted (even if the return value is derived from tainted data):

```ballerina
// Execute the select query using the untrusted (tainted) student ID
function sanitizeSortColumn (string columnName) returns @untainted string {
   string sanitizedSortColumn = columnName;
   // Insert sanitization logic to ensure that the return value is safe.
   return sanitizedSortColumn;
}
// ...
```

## Securing Sensitive Data using Configurable Variables

A Ballerina runtime can be configured using configurable variables.
For more details, see [Configurable BBE](/learn/by-example/configurable.html).

Configuration values containing passwords or secrets should not be passed with the normal configuration.

Such sensitive data can be passed to runtime using a different TOML file, and you can prioritize it higher than the
normal configuration by prefixing the file path in the `BAL_CONFIG_FILES` environment variable.

The configuration of sensitive data can be handled at the deployment of the Ballerina program.

Consider a Kubernetes environment as an example.

A Kubernetes secret can be used with a pod as files in a volume mounted on one or more of its containers or as 
container environment variables. The TOML file that contains the sensitive data can be stored as a secret resource in 
Kubernetes and can be placed in a volume mount when running a pod. The file path can be specified via an environment 
variable as above.
