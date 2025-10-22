---
title: Scan rules
description: Learn about the scan rules used in Ballerina static code analysis.
keywords: ballerina runtime, static code analysis, scan rules, code smells, bugs, vulnerabilities
permalink: /learn/scan-rules/
active: scan-rules
---

The Ballerina scan tool uses a set of predefined rules to analyze Ballerina code and identify potential issues such as
code smells, bugs, and vulnerabilities.
These rules are designed to help developers maintain high-quality code and
adhere to best practices.

## Language rules

### Avoid checkpanic

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:1 |
| **Rule Kind** | Code Smell  |

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

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:2 |
| **Rule Kind** | Code Smell  |

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

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:7 |
| **Rule Kind** | Code Smell  |

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

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:8 |
| **Rule Kind** | Code Smell  |

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

| Property      | Description |
|---------------|-------------|
| **Rule ID**   | ballerina:9 |
| **Rule Kind** | Code Smell  |

Conditions which always evaluate to the same value don't do any meaningful computation. They increase code complexity,
reduce the code readability, and potentially hide logical errors.

#### Noncompliant Code Example

```ballerina
public function main() {
   int a = x % 1; // always evaluates to zero
}
```

### This variable is assigned to itself

| Property      | Description  |
|---------------|--------------|
| **Rule ID**   | ballerina:10 |
| **Rule Kind** | Code Smell   |

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

| Property      | Description  |
|---------------|--------------|
| **Rule ID**   | ballerina:11 |
| **Rule Kind** | Code Smell   |

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

| Property      | Description  |
|---------------|--------------|
| **Rule ID**   | ballerina:12 |
| **Rule Kind** | Code Smell   |

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

## Library rules

### Avoid using insecure cipher modes or padding schemes

| Property      | Description        |
|---------------|--------------------|
| **Rule ID**   | ballerina/crypto:1 |
| **Rule Kind** | Vulnerability      |

Encryption algorithms are essential for protecting sensitive information and ensuring secure communications. When implementing encryption, it's critical to select not only strong algorithms but also secure modes of operation and padding schemes. Using weak or outdated encryption modes can compromise the security of otherwise strong algorithms.

#### AES Encryption Code Example

##### Noncompliant Code Example

```ballerina
byte[] cipherText = check crypto:encryptAesEcb(data, key);
```

For AES, the weakest mode is ECB (Electronic Codebook). Repeated blocks of data are encrypted to the same value, making them easy to identify and reducing the difficulty of recovering the original cleartext.

```ballerina
byte[] cipherText = check crypto:encryptAesCbc(data, key, initialVector);
```

Unauthenticated modes such as CBC (Cipher Block Chaining) may be used but are prone to attacks that manipulate the ciphertext (like padding oracle attacks). They must be used with caution and additional integrity checks.

##### Compliant Code Example

```ballerina
byte[] cipherText = check crypto:encryptAesGcm(data, key, initialVector);
```

AES-GCM (Galois/Counter Mode) provides authenticated encryption, ensuring both confidentiality and integrity of the encrypted data.

#### RSA Encryption Example

##### Noncompliant Code Example

```ballerina
// Default padding is PKCS1
byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey);

cipherText = check crypto:encryptRsaEcb(data, publicKey, crypto:PKCS1);
```

For `RSA`, avoid using `PKCS1v1.5` padding as it is vulnerable to various attacks. Instead, use `OAEP` (Optimal Asymmetric Encryption Padding) which provides better security.

##### Compliant Code Example

```ballerina
byte[] cipherText = check crypto:encryptRsaEcb(data, publicKey, crypto:OAEPwithMD5andMGF1);
```

The `OAEP` paddings such as `OAEPwithMD5andMGF1`, `OAEPWithSHA1AndMGF1`, `OAEPWithSHA256AndMGF1`, `OAEPwithSHA384andMGF1`, and `OAEPwithSHA512andMGF1` should be used for RSA encryption to enhance security.

### Avoid using fast hashing algorithms

| Property      | Description        |
|---------------|--------------------|
| **Rule ID**   | ballerina/crypto:2 |
| **Rule Kind** | Vulnerability      |

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
public function hashPassword() returns error? {
    string password = "mySecurePassword123";
    // Using recommended parameters: sufficient memory, iterations, and parallelism
    string hashedPassword = check crypto:hashArgon2(password, iterations = 3, memory = 65536, parallelism = 4);
    io:println("Hashed Password: ", hashedPassword);
}
```

### Avoid reusing counter mode initialization vectors

| Property      | Description        |
|---------------|--------------------|
| **Rule ID**   | ballerina/crypto:3 |
| **Rule Kind** | Vulnerability      |

When using encryption algorithms in counter mode (such as `AES-GCM`, `AES-CCM`, or `AES-CTR`), initialization vectors (IVs) or nonces should never be reused with the same encryption key. Reusing IVs with the same key can completely compromise the security of the encryption.

#### AES-GCM Encryption Code Example

##### Noncompliant Code Example

```ballerina
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

| Property      | Description      |
|---------------|------------------|
| **Rule ID**   | ballerina/file:1 |
| **Rule Kind** | Vulnerability    |

Operating systems often have global directories with write access granted to any user. These directories serve as
temporary storage locations like /tmp in Linux-based systems. However, when an application manipulates files within
these directories, it becomes vulnerable to race conditions on filenames. A malicious user may attempt to create a file
with a predictable name before the application does. If successful, such an attack could lead to unauthorized access,
modification, corruption, or deletion of other files. This risk escalates further if the application operates with
elevated permissions.

#### Noncompliant Code Example

```ballerina
string tempFolderPath = os:getEnv("TMP");
check file:create(tempFolderPath + "/" + "myfile.txt");
check file:getAbsolutePath(tempFolderPath + "/" + "myfile.txt");
check file:createTemp("suffix", "prefix");
check file:createTempDir((), "prefix");
```

#### Compliant Code Example

Use dedicated sub-folders.

```ballerina
check file:create("./myDirectory/myfile.txt");
check file:getAbsolutePath("./myDirectory/myfile.txt");
```

### File function calls should not be vulnerable to path injection attacks

| Property      | Description      |
|---------------|------------------|
| **Rule ID**   | ballerina/file:2 |
| **Rule Kind** | Vulnerability    |

Path injections occur when an application constructs a file path using untrusted data without first validating the path.

A malicious user can inject specially crafted values, like "../", to alter the intended path. This manipulation may lead
the path to resolve to a location within the filesystem where the user typically wouldn't have access.

#### Noncompliant Code Example

```ballerina
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

| Property      | Description      |
|---------------|------------------|
| **Rule ID**   | ballerina/http:1 |
| **Rule Kind** | Vulnerability    |

An HTTP resource is safe when used for read-only operations like GET, HEAD, or OPTIONS. An unsafe HTTP resource is used
to alter the state of an application, such as modifying the user’s profile on a web application.

Unsafe HTTP resources include POST, PUT, and DELETE.

Enabling both safe and insecure HTTP resources to execute a particular operation on a web application may compromise its
security; for instance, CSRF protections are typically designed to safeguard operations executed by insecure HTTP
resources.

#### Noncompliant Code Example

```ballerina
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
service / on endpoint {
    resource function delete deleteRequest(http:Request clientRequest, string username) returns string {
        // state of the application will be changed here
    }
}
```

### Avoid permissive Cross-Origin Resource Sharing

| Property      | Description      |
|---------------|------------------|
| **Rule ID**   | ballerina/http:2 |
| **Rule Kind** | Vulnerability    |

Browsers enforce the same-origin policy by default, as a security measure, preventing JavaScript frontends from making
cross-origin HTTP requests to resources with different origins (domains, protocols, or ports). However, the target
resource can include additional HTTP headers in its response, known as CORS headers, which serve as directives for the
browser and modify the access control policy, effectively relaxing the same-origin policy.

#### Noncompliant Code Example

```ballerina
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

| Property      | Description      |
|---------------|------------------|
| **Rule ID**   | ballerina/http:3 |
| **Rule Kind** | Vulnerability    |

Server-Side Request Forgery (SSRF) is a vulnerability that allows attackers to induce the server-side application to make requests to an unintended location. When applications accept user input that influences server-side HTTP requests without proper validation or sanitization, attackers can manipulate these requests.

#### Noncompliant Code Example

```ballerina
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

| Property      | Description      |
|---------------|------------------|
| **Rule ID**   | ballerina/http:4 |
| **Rule Kind** | Vulnerability    |

Open redirects occur when an application accepts user-controlled input that specifies a URL to which the user will be redirected. When these redirects are implemented without proper validation, attackers can craft redirection URLs to malicious sites.

#### Noncompliant Code Example

```ballerina
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

| Property      | Description    |
|---------------|----------------|
| **Rule ID**   | ballerina/io:1 |
| **Rule Kind** | Vulnerability  |

Path injections occur when an application constructs a file path using untrusted data without first validating the path.

A malicious user can inject specially crafted values, like "../", to alter the intended path. This manipulation may lead
the path to resolve to a location within the filesystem where the user typically wouldn't have access.

#### Noncompliant Code Example

```ballerina
import ballerina/io;
import ballerina/http;

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
import ballerina/io;
import ballerina/http;
import ballerina/file;

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

### Potentially-sensitive configurable variables are logged

| Property      | Description     |
|---------------|-----------------|
| **Rule ID**   | ballerina/log:1 |
| **Rule Kind** | Vulnerability   |

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

### Avoid constructing system command arguments from user input without proper sanitization

| Property      | Description    |
|---------------|----------------|
| **Rule ID**   | ballerina/os:1 |
| **Rule Kind** | Vulnerability  |

Arguments of system commands are processed by the executed program. The arguments are usually used to configure and
influence the behavior of the programs. Control over a single argument might be enough for an attacker to trigger
dangerous features like executing arbitrary commands or writing files into specific directories.

Arguments like -delete or -exec for the find command can alter the expected behavior and result in vulnerabilities.

#### Noncompliant Code Example

```ballerina
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

| Property      | Description    |
|---------------|----------------|
| **Rule ID**   | ballerina/os:2 |
| **Rule Kind** | Vulnerability  |

Environment variables are often used to store sensitive configuration data, credentials, and application settings. When
applications allow untrusted input to define or modify environment variables without proper validation, they can
introduce significant security risks.

Using untrusted input to set environment variables can lead to various security concerns because environment variables
are often globally accessible within a process and can affect child processes.

#### Noncompliant Code Example

```ballerina
service / on new http:Listener(8080) {
    resource function get configPath(http:Request req) {
        string configPath = req.getQueryParamValue("path") ?: "";
        
        os:Error? err = os:setEnv("CONFIG_PATH", configPath);
    }
}
```

#### Compliant Code Example

Implement proper input validation by ensuring that only alphanumeric characters are allowed in the environment variable
value.

```ballerina
service / on new http:Listener(8080) {
    resource function get configPath(http:Request req) returns string|error {
        string configPath = req.getQueryParamValue("path") ?: "";
        
        if regex:matches(configPath, "^[a-zA-Z0-9]*$") {
            os:Error? err = os:setEnv("CONFIG_PATH", configPath);
            
            if err is os:Error {
                return error("Failed to set environment variable");
            }
            return "Environment variable set successfully";
        } else {
            return error("Invalid input: Only alphanumeric characters are allowed");
        }
    }
}
```

### Avoid using weak cipher algorithms when signing and verifying JWTs

| Property      | Description     |
|---------------|-----------------|
| **Rule ID**   | ballerina/jwt:1 |
| **Rule Kind** | Vulnerability   |

JSON Web Tokens (JWTs) are a compact, URL-safe means of representing claims between two parties. They're commonly used
for authentication and authorization in web applications. The security of JWT-based authentication depends critically on
the signature mechanism used to verify token authenticity.

When JWTs are issued without a signature or with weak algorithms, attackers can forge tokens to impersonate legitimate
users, modify token claims, bypass authentication entirely, and gain unauthorized access to protected resources.

#### Noncompliant Code Example

```ballerina
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

### Avoid unverified server hostnames during SSL/TLS connections

| Property      | Description       |
|---------------|-------------------|
| **Rule ID**   | ballerina/email:1 |
| **Rule Kind** | Vulnerability     |

Using outdated or weak SSL/TLS protocols puts application communications at serious risk. These obsolete protocols
contain known vulnerabilities that attackers can exploit to intercept, decrypt, or manipulate data transmitted between
clients and servers.

#### Noncompliant Code Example

```ballerina

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
            verifyHostName: true
        }
    });
}
```
