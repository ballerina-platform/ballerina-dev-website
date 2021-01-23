---
layout: ballerina-left-nav-pages-swanlake
title: Writing Secure Ballerina Code
description: Check out the different security features and controls available within the Ballerina programming language and follow the guidelines on writing secure Ballerina programs.
keywords: ballerina, programming language, security, secure ballerina code
permalink: /swan-lake/learn/security/writing-secure-ballerina-code/
active: writing-secure-ballerina-code
intro: The sections below include information on the different security features and controls available within Ballerina. Also, they provide guidelines on writing secure Ballerina programs.
redirect_from:
  - /swan-lake/learn/how-to-write-secure-ballerina-code
  - /swan-lake/learn/how-to-write-secure-ballerina-code/
  - /swan-lake/learn/writing-secure-ballerina-code/
  - /swan-lake/learn/writing-secure-ballerina-code
  - /swan-lake/learn/security/writing-secure-ballerina-code
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

```ballerina
import ballerina/java.jdbc;
import ballerina/sql;

type ResultStudent record {
    string name;
};

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

For example, the `query` remote method of the `java.jdbc` client highlighted above returns a value of type `@tainted stream <record {}, sql:Error>`. This means that any value read from a database is considered as untrusted.

When the Ballerina compiler can determine that a function is returning tainted data without tainted data being passed in as parameters to that function, it is required to annotate the function's return type with the `@tainted` annotation. If not, the function author has to clean up the data before returning. For instance, if you want to read from the database and return a result, you either need to annotate that function's return type with `@tainted` or you have to clean up and make sure the returned data is not tainted.

### Using Tainted Data with Security-Sensitive Parameters

There can be certain situations where a tainted value must be passed into a security-sensitive parameter. In such situations, it is essential to do proper data validation or data sanitization to make sure the input does not result in a security threat. Once proper controls are in place, the `@untainted` annotation can be used with a type cast operator to denote that the value is trusted:

```ballerina
// Execute select query using the untrusted (tainted) student ID
boolean isValid = isNumeric(studentId);
if (isValid) {
   var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = " +
                           <@untainted> studentId, ResultStudent);
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

## Securing Passwords and Secrets

Ballerina provides an API to access configuration values from different sources. For more information, see [Config Ballerina by Example](/swan-lake/learn/by-example/config-api.html).

Configuration values containing passwords or secrets should be encrypted. The Ballerina Config API will decrypt such configuration values when being accessed.

Use the following command to encrypt a configuration value:

```cmd
$ bal encrypt
```

The `encrypt` command will prompt for the plain-text value to be encrypted and an encryption secret.

```cmd
$ bal encrypt
Enter value: 

Enter secret: 

Re-enter secret to verify: 

Add the following to the configuration file:
<key>="@encrypted:{hcBLnR+b4iaGS9PEtCMSQOUXJQTQo+zknNxCkpZ0t7w=}"

Or provide it as a command line argument:
--<key>=@encrypted:{hcBLnR+b4iaGS9PEtCMSQOUXJQTQo+zknNxCkpZ0t7w=}
```

Ballerina uses AES, CBC mode with PKCS#5 padding for encryption. The generated encrypted value should be used in place of the plain-text configuration value.

For example, contents of a configuration file that includes a secret value should look as follows:

```
api.secret="@encrypted:{hcBLnR+b4iaGS9PEtCMSQOUXJQTQo+zknNxCkpZ0t7w=}"
api.provider="not-a-security-sensitive-value"
```

When running a Ballerina program that uses encrypted configuration values, Ballerina will require the secret used during the encryption process to perform the decryption.

Ballerina will first look for a file named `secret.txt`. If such a file exists, Ballerina will read the decryption secret from the file and immediately remove the file to make sure secret cannot be accessed afterwards. If the secret file is not present, the Ballerina program will prompt for the decryption secret.

The file-based approach is useful in automated deployments. The file containing the decryption secret can be deployed along with the Ballerina program. The name and the path of the secret file can be configured using the `ballerina.config.secret` runtime parameter:

```
$ bal run --b7a.config.secret=path/to/secret/file securing_configuration_values.bal
```
