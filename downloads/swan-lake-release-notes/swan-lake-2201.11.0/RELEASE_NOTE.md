---
layout: ballerina-left-nav-release-notes
title: 2201.11.0 (Swan Lake)
permalink: /downloads/swan-lake-release-notes/2201.11.0/
active: 2201.11.0
redirect_from:
    - /downloads/swan-lake-release-notes/2201.11.0
    - /downloads/swan-lake-release-notes/2201.11.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.11.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 11 (2201.11.0)

<em> Swan Lake Update 11 (2201.11.0) is the eleventh update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em>

## Update Ballerina

Update your current Ballerina installation directly to 2201.11.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### Improvements

#### Support for XML step extensions in XML step expressions

The XML step expression now supports step extensions, including method invocation, member access, filtering, and combinations of these.

```ballerina
public function main() {
    xml x = xml
    `<item><!--comment--><name>T-shirt</name><price>19.99</price><brand><name>nike</name></brand></item>
      <item><?data?><name>Backpack</name><price>34.99</price><brand><name>adidas</name></brand></item>`;

    // Evaluates to `<name>nike</name><name>adidas</name>`
    xml x1 = x/**/<name>[1];

    // Evaluates to `<name>nike</name><name>adidas</name>`
    xml x2 = x/<brand>.children();

    // Evaluates to `<price>19.99</price><price>34.99</price>`
    xml x3 = x/*.<price>;

    // Evaluates to `<!--comment--><?data?>`
    xml x4 = x/*[0].filter(y => y is xml:Comment || y is xml:ProcessingInstruction);
}
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 11 (2201.11.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.11.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### Improvements

##### Java 21 support

The jBallerina runtime is now upgraded to support Java 21 LTS, leveraging its latest features, including virtual threads introduced with Project Loom. This enhancement addresses key performance issues in the current runtime, particularly with loops and asynchronous strand execution, and simplifies runtime APIs for native code developers.

Note: If you are using Java 17 to run Ballerina programs, you must switch to Java 21.

The upgraded concurrency model integrates Java 21's virtual threads with significant changes to asynchronous execution. However, the implementation of Ballerina interoperability will have an impact on Java 21 support due to any incompatible changes.

For more details, refer to the [Java 21 release notes](https://www.oracle.com/java/technologies/javase/21-relnote-issues.html).

##### Improvements to runtime Java APIs

- The following API classes have been moved to a different package.

| Old package                              | New package                                    |
|------------------------------------------|------------------------------------------------|
| io.ballerina.runtime.api.Node            | io.ballerina.runtime.api.repository.Node       |
| io.ballerina.runtime.api.Artifact        | io.ballerina.runtime.api.repository.Artifact   |
| io.ballerina.runtime.api.Repository      | io.ballerina.runtime.api.repository.Repository |
| io.ballerina.runtime.api.PredefinedTypes | io.ballerina.runtime.api.types.PredefinedTypes |
| io.ballerina.runtime.api.TypeTags        | io.ballerina.runtime.api.types.TypeTags        |

- The following API from the `io.ballerina.runtime.api.Environment` class has been modified to return a `String` instance.
  The previous API definition:
```java
public Optional<String> getStrandName();
```
This is modified as follows.
```java
public String getStrandName();
```
- The following APIs from the `io.ballerina.runtime.api.Runtime` class have been modified to return an `Object` instance.
  Previous API definitions are as follows.
```java
public void init();
public void start();
```
These have been modified as follows.
```java
public Object init();
public Object start();
```
- The `io.ballerina.runtime.api.async.StrandMetadata` class has been converted to a record with the following definition and moved to the `io.ballerina.runtime.api.concurrent` package.
```java
public record StrandMetadata(boolean isConcurrentSafe, Map<String, Object> properties) {
}
```
Therefore, the following APIs from `io.ballerina.runtime.api.async.StrandMetadata` have been removed.
```java
public String getModuleOrg();
public String getModuleName();
public String getModuleVersion();
public String getTypeName();
public String getParentFunctionName();
```
- The `isRemoteEnabled` API from the `io.ballerina.runtime.api.Repository` class has been renamed to the following.
```java
 boolean isRemoteManagementEnabled();
```
- The `call()` API from `io.ballerina.runtime.api.values.BFunctionPointer` class has been modified.
  The previous API definition is as follows.
```java
 R call(T t);
```
This is modified as follows.
```java
Object call(Runtime runtime, Object... t);
```
- The following APIs from `io.ballerina.runtime.api.values.BFuture` have been modified.
  The previous API definition is as follows.
```java
 Object getResult();
```
This is modified as follows.
```java
 Object get();
```

##### Strand Dump tool

The strand dump tool has been updated to support virtual threads. The report now includes the total number of strands, with separate sections for isolated and non-isolated strands, each displaying their respective stack traces. Under the new concurrency model, each strand is directly mapped to a Java virtual thread, and the tool uses the virtual thread dump to extract strand related information. However, since the thread dump does not provide information about the state of virtual threads, the current version of the strand dump report does not include the state of the strands.

#### New Runtime Java APIs

1. A new runtime Java API is added to yield the current execution and to run an operation while allowing other non-isolated functions to run asynchronously.
```java
public abstract <T> T yieldAndRun(Supplier<T> supplier);
```
The above API can be called via a Ballerina environment instance as follows.
```java
import io.ballerina.runtime.api.Environment;

env.yieldAndRun(() -> {
            try {
                Thread.sleep(1000);
                return null;
            } catch (InterruptedException e) {
                throw ErrorCreator.createError(e);
            }
        });
```
2. A new runtime Java API is added to call a Ballerina function.
```java
public abstract Object callFunction(Module module, String functionName, StrandMetadata metadata, Object... args);
```
This API can be called via a Ballerina environment instance as follows.
```java
import io.ballerina.runtime.api.Runtime;
import io.ballerina.runtime.api.Environment;

Runtime balRuntime = env.getRuntime();
Object result = balRuntime.callFunction(module, "add", null, 5L, 7L);
```
This method call invokes a Ballerina function with the following definition.
```ballerina
public function add(int a, int b) returns int {
    return a + b;
}
```
3. A new runtime Java API is added to call a Ballerina object method.
```java
public abstract Object callMethod(BObject object, String methodName, StrandMetadata metadata,Object... args);
```
The above API can be called via a Ballerina environment instance as follows.
```java
import io.ballerina.runtime.api.Runtime;
import io.ballerina.runtime.api.Environment;

Runtime balRuntime = env.getRuntime();
Object result = balRuntime.callMethod(person, "getNameWithTitle", null);
```
This method call invokes a Ballerina object method using the BObject `person`. The object has the following definition.
```ballerina
public class Person {
    private string name;

    public function init(string name) {
        self.name = name;
    }

    public function getNameWithTitle() returns string {
        return “Miss/Mrs.” + self.name;
    }
}
```
4. A new runtime Java API is added to the `io.ballerina.runtime.api.values.BFuture` to check whether the future is completed with panic or not.
```java
boolean isPanic();
```
5. A new `io.ballerina.runtime.api.values.BNever` class is introduced to represent a singleton never value in Ballerina runtime.
   This non-instantiable class extends the `io.ballerina.runtime.api.values.BValue`.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 11 (2201.11.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed+milestone%3A2201.11.0 )

## Ballerina library updates

### New features

#### `crypto` package

- Added support for PGP encryption and decryption with streams

  ```ballerina
  stream<byte[], error?> inputStream = check io:fileReadBlocksAsStream("input.txt");
  stream<byte[], crypto:Error?>|crypto:Error encryptedStream = crypto:encryptStreamAsPgp(inputStream, "publicKey.asc");
  ```

  ```ballerina
  byte[] passphrase = check io:fileReadBytes("passphrase.txt");
  stream<byte[], error?> inputStream = check io:fileReadBlocksAsStream("pgp_encrypted.txt");
  stream<byte[], crypto:Error?>|crypto:Error decryptedStream = crypto:decryptStreamFromPgp(inputStream, "privateKey.asc", passphrase);
  ```

- Added support for Bcrypt hashing and verification

  ```ballerina
  string password = "mySecurePassword123";
  string|crypto:Error hash = crypto:hashBcrypt(password);
  ```

  ```ballerina
  string password = "mySecurePassword123";
  string hashedPassword = "$2a$12$LQV3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpwBAM7RHF.H9m";
  boolean|crypto:Error matches = crypto:verifyBcrypt(password, hashedPassword);
  ```

- Added support for Argon2 hashing and verification

  ```ballerina
  string password = "mySecurePassword123";
  string|crypto:Error hash = crypto:hashArgon2(password);
  ```

  ```ballerina
  string password = "mySecurePassword123";
  string hashedPassword = "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$hash";
  boolean|crypto:Error matches = crypto:verifyArgon2(password, hashedPassword);
  ```

- Added support for Keccak-256 hashing

  ```ballerina
  byte[] data = "Hello Ballerina".toBytes();
  byte[] hash = crypto:hashKeccak256(data);
  ```

#### `data.csv` package

- Introduced constraint validation support, allowing validation of the output against constraints specified in the target type.
- Introduced support for parsing CSV with union types as expected types.

```ballerina
  import ballerina/data.csv;
  import ballerina/io;

  type Book record {
      string name;
      string author;
      decimal price;
      string publishedDate;
  };

  type BookMinimal record {|
      string name;
      string author;
  |};

  public function main() {
      string csvString = string `name,author,price,publishedDate
                                Effective Java,Joshua Bloch,45.99,2018-01-01
                                Clean Code,Robert C. Martin,37.50,2008-08-01`;

      // Parse CSV string to a array of records.
      Book[]|csv:Error bookRecords = csv:parseString(csvString);
      io:println(bookRecords);

      // Parse CSV string to a array of records with data projection.
      // Here only the fields specified in the target record type (`name` and `author` fields)  
      // are included in the constructed value. 
      BookMinimal[]|csv:Error briefBookRecords = csv:parseString(csvString);
      io:println(briefBookRecords);
  }
```

#### `http` package

- Added relaxed binding support for service and client data binding. This provides the flexibility to bind nil values to optional fields and absent values to nilable fields.

  ```ballerina
  // Enable relaxed data binding on the client side.
  http:Client httpClient = check new("http://localhost:9090", laxDataBinding = true);

  // Enable relaxed data binding on the server side.
  @http:ServiceConfig {laxDataBinding: true}
  service /api on new http:Listener(9090) {
  }
  ```

#### `ldap` package

- Added support for secure LDAP (LDAPS) connections with SSL/TLS. This allows applications to securely authenticate and interact with LDAP directories using encrypted connections.

  ```ballerina
  Client ldap =  check new ({
        port: 636,
        hostName,
        password,
        domainName,
        clientSecureSocket: {
          cert: "tests/resources/server/certs/server.crt",
          enable: true
        }
    }
  );
  ```

#### `data.xmldata` package

- Introduced XML schema definition (XSD) Sequence and Choice support for the `data.xmldata` package.

```ballerina
type Transaction record {|
    @xmldata:Sequence
    TransactionType Transaction;
|};

type TransactionType record {|
    @xmldata:SequenceOrder {
        value: 1
    }
    string TransactionID;

    @xmldata:SequenceOrder {
        value: 4
    }
    decimal Amount;
|};
```

- Introduced union type support for `xml` operations in the `data.xmldata` package.
- Introduced singleton, union of singletons, and enum support for `xml` operations in the `data.xmldata` package.

### Improvements

#### `http` package

- Added `anydata` support for `setPayload` methods in the request and response objects.
- Improved the `@http:Query` annotation to overwrite query parameter names in clients.
- Improved the `@http:Query` annotation to overwrite query parameter names in services.
- Added header name mapping support in record fields.
- Migrated client and service data binding to use the `toJson` and `parserAsType` functions from the  `ballerina/data.jsondata` module instead of the `fromJsonWithType` function from the `ballerina.lang.value` module. This change improves how JSON data is converted to Ballerina records and vice versa, by allowing field names to be overridden using the `jsondata:Name` annotation.
- Added support to configure the server name to be used in the SSL SNI extension.

### Deprecations

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 11 (2201.11.0)](https://github.com/ballerina-platform/ballerina-library/issues?q=milestone%3A2201.11.0+is%3Aclosed+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### CLI

#### OpenAPI tool
- Introduced the `flatten` sub-command, which flattens the OpenAPI contract file by moving all the inline schemas to the components section. The output is a modified OpenAPI contract.

  ```
  $ bal openapi flatten <openapi.yaml>
  ```
- Introduced the `align` sub-command, which aligns the OpenAPI contract file with Ballerina's naming conventions. Ballerina name extensions are added to the schemas which can not be modified directly. The output is a modified OpenAPI contract.

  ```
  $ bal openpai align <openapi.yaml>
  ```
- Added code generation support for Ballerina name extensions. These extensions are mapped as annotations in the generated types, parameters, and record fields.

  For example,
  ```yaml
  ...
  paths:
    /albums:
      get:
        tags:
          - albums
        operationId: getAlbums
        parameters:
          - name: _artists_
            in: query
            schema:
              type: array
              items:
                type: string
              default: []
            x-ballerina-name: artists  --->// Ballerina name extension
        responses:
          "200":
            description: Ok
            content:
              application/json:
                schema:
                  type: array
                  items:
                    $ref: "#/components/schemas/Album"
  ```
  Generated Ballerina service type code,
  ```ballerina
  ...
  resource function get albums(@http:Query {name: "_artists_"} string[] artists = []) returns Album[];
  ...
  ```
  This code generation support is available for client, service implementation, and service type code generation.


- Added support for relaxed data binding on the client side payload. This enables nil values to be treated as optional, and absent fields to be handled as nilable types.

#### WSDL tool

- Introduced a new tool to generate Ballerina clients and record types from a given WSDL file.
- This simplifies the integration with SOAP-based web services by automatically generating necessary types and client functions.

```
  $ bal wsdl <wsdl-file-path> [--operations <operation-uris>] [--module <output-module-name>] [--port <port-name>]
```

| Option | Description | Mandatory/Optional |
|--------|-------------|--------------------|
| `<wsdl-file-path>` | The path of the WSDL file. | Mandatory |
| `--operations <operation-uris>` | A comma-separated list of operation URIs for which client methods should be generated. If not provided, methods for all operations in the WSDL file will be generated. | Optional |
| `-m, --module <output-module-name>` | The name of the module where the generated client and record types will be placed. If not provided, output files will be saved to the project default package. | Optional |
| `-p, --port <port-name>` | The name of the port that defines the service endpoint. If specified, a client will be generated only for this port. Otherwise, clients for all available ports will be generated. | Optional |

#### XSD tool

- Introduced a new tool to generate Ballerina record types from an XSD file.
- Simplifies integration with XML-based operations in Ballerina.

```
  $ bal xsd <xsd-file-path> --module <output-module-name>
```

| Option | Description | Mandatory/Optional |
|--------|-------------|--------------------|
| `<xsd-file-path>` | The path of the XSD file | Mandatory |
| `-m`, `--module`   | The name of the module in which the Ballerina record types are generated. If not provided, the output file will be saved to the project default package | Optional |

### Improvements

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 11 (2201.11.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.11.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-library/issues?q=milestone%3A2201.11.0+is%3Aclosed+label%3Amodule%2Fopenapi-tools+label%3AType%2FBug)

## Ballerina packages updates

### New features

### Improvements

- Replaced `Package.md`, and `Module.md` with `README.md` as the primary documentation for packages, ensuring a unified documentation format across Ballerina Central and version control platforms.

  If you create a new package with the library template, a `README.md` file is created.

  ```
  $ bal build -t lib winery

  .
  ├── winery.bal
  ├── Ballerina.toml
  ├── README.md
  └── tests/
        └── lib_test.bal
  ```

- Introduced the capability to override the default `README.md` by specifying a preferred file using the `readme` field in the `[package]` table of the `Ballerina.toml` file.

  ``` toml
  [package]
  org = "samjs"
  name = "winery"
  version = "0.1.0"
  readme = "docs/Reference.md"
  ```

- Introduced configuration support to specify metadata, including enabling export and defining a custom readme file name for a specific module.

  The following example demonstrates configuring the foo module in `Ballerina.toml`.

  ``` toml
  [[package.modules]]
  name = "winery.foo"
  export = true
  readme = "README.md"
   ```

### Bug fixes

## Backward-incompatible changes

### Runtime changes

The switch to Java 21 may have an impact on Ballerina interoperability usage if there are incompatible changes. For example, Java 21 has some restrictions on custom thread management that may require adjustments to adopt the Java 21 threading model effectively. For more information, see Java 21 support.

#### Removal of Runtime Java APIs

- The following deprecated API from the `io.ballerina.runtime.api.Module` class has been removed.
```java
 public String getVersion();
```

- The following API from the same class can be used alternatively.
```java
  public String getMajorVersion();
```
- The following APIs from the `io.ballerina.runtime.api.Environment` class have been removed.
```java
public Future markAsync();
public StrandMetadata getStrandMetadata();
```
- The following APIs from the `io.ballerina.runtime.api.Runtime` class have been removed.
```java
 public static Runtime getCurrentRuntime();

 public BFuture invokeMethodAsyncSequentially(BObject object, String methodName, String strandName, StrandMetadata metadata, Callback callback, Map<String, Object> properties, Type returnType, Object... args);

 public BFuture invokeMethodAsyncConcurrently(BObject object, String methodName, String strandName, StrandMetadata metadata, Callback callback, Map<String, Object> properties, Type returnType, Object... args);

 public BFuture invokeMethodAsync(BObject object, String methodName, String strandName, StrandMetadata metadata, Callback callback,  Map<String, Object> properties, Type returnType, Object... args);

 public Object invokeMethodAsync(BObject object, String methodName, String strandName, StrandMetadata metadata, Callback callback, Object... args);

public void invokeMethodAsync(String functionName, Callback callback, Object... args);
```
- The API class `io.ballerina.runtime.api.async.Callback` has been removed.
- The API class `io.ballerina.runtime.api.launch.LaunchListener` has been removed.
- The following deprecated API from the `io.ballerina.runtime.ap.types.FunctionType` class has been removed.
```java
 Type[] getParameterTypes();
```
- The following APIs from `io.ballerina.runtime.api.values.BFunctionPointer` class have been removed.
```java
   BFuture asyncCall(Object[] args, StrandMetadata metaData);
   BFuture asyncCall(Object[] args, Function<Object, Object> resultHandleFunction, StrandMetadata metaData);
   Function<T, R> getFunction();
```
- The following APIs from `io.ballerina.runtime.api.values.BFuture` have been removed.
```java
 Strand getStrand();
 Throwable getPanic();
 Callback getCallback();
```

## First-time contributors

We would like to extend our heartfelt thanks to the following first-time contributors for their valuable contributions to the Ballerina Swan Lake Update 11 release.

* [Ansak Mahir](https://github.com/AnsarMahir)
* [Areeb Niyas](https://github.com/areebniyas)
* [Atharva Kulkarni](https://github.com/Atharva1723)
* [Bmen](https://github.com/hongdongni)
* [DAA](https://github.com/DaAlbrecht)
* [Ovindu Atukorala ](https://github.com/ovindu-a)
* [Jaagrav Seal](https://github.com/Jaagrav)
* [Mohamed Ishad](https://github.com/Ishad-M-I-M)
* [Rahul Jain](https://github.com/rahul1995)
* [Randil Tharusha](https://github.com/randilt)
* [Thilan Dissanayaka](https://github.com/thil4n)
