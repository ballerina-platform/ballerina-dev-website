---
layout: ballerina-left-nav-release-notes
title: 2201.9.0 (Swan Lake)
permalink: /downloads/swan-lake-release-notes/2201.9.0/
active: 2201.9.0
redirect_from:
    - /downloads/swan-lake-release-notes/2201.9.0
    - /downloads/swan-lake-release-notes/2201.9.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.9.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 9 (2201.9.0)

<em> Swan Lake Update 9 (2201.9.0) is the ninth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em>

## Update Ballerina

Update your current Ballerina installation directly to 2201.9.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

#### Introduction of the alternate receive action

The alternate receive action can be used to receive one of multiple values corresponding to multiple send actions. It operates by waiting until it encounters a non-error message, a panic termination status on a closed channel, or the closure of all channels. Alternate receive action sets the first non-error value it encounters as the result.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;

public function main() {
    worker w1 {
        2 -> function;
    }

    worker w2 {
        runtime:sleep(2);
        3 -> function;
    }

    worker w3 returns error? {
        int value = 10;
        if value == 10 {
            return error("Error in worker 3");
        }
        value -> function;
    }

    worker w4 {
        runtime:sleep(2);
        3 -> function;
    }

    // The value of the variable `result` is set as soon as the value from either
    // worker `w1` or `w2` is received.
    int result1 = <- w1 | w2;
    io:println(result1); // 2

    // Alternate receive action waits until a message that is not an error is received.
    // Since `w3` returns an error, it waits further and sets the value that is received from `w4`.
    int|error? result2 = <- w3 | w4;
    io:println(result2); // 3
}
```

#### Introduction of the multiple receive action

The multiple receive action can be used to receive values corresponding to multiple send actions. It operates by waiting for the receipt of values from all the send actions, subsequently constructing a mapping value containing those values.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;

public function main() {
    worker w1 {
        2 -> function;
    }

    worker w2 {
        runtime:sleep(2);
        3 -> function;
    }

    // The worker waits until both values are received.
    Result result = <- {a: w1, b: w2};
    io:println(result); // {"a":2,"b":3}
}

type Result record {
    int a;
    int b;
};
```

#### Support for conditional worker send action

The send action in workers can be used in a conditional context, allowing for more flexible and dynamic inter-worker communication based on specific conditions. The receiver side in a conditional send might not always receive a message. Thus, to handle such scenarios, the static type of the receive action includes the `error:NoMessage` type.

```ballerina
import ballerina/io;

public function main() {
    boolean isDataReady = true;

    worker w1 {
        // A send action can be used in a conditional context.
        if isDataReady {
            10 -> function;
        }
    }

    worker w2 {
        if isDataReady {
            1 -> function;
        } else {
            0 -> function;
        }
    }

    // The send action corresponding to this receive action is conditionally executed.
    // Thus, there is a possibility that the send action may not get executed.
    // Therefore, the static type of the receive includes the `error:NoMessage` type
    // indicating the absence of a message in such cases.
    int|error:NoMessage w1Message = <- w1;
    io:println(w1Message); // 10

    // Two different conditional send actions exist within the worker `w3`.
    // Therefore, an alternate receive action can be used to receive them.
    int|error:NoMessage w2Message = <- w2 | w2;
    io:println(w2Message); // 1
}
```

#### Introduction of the `on fail` clause for named workers

The `on fail` clause can be used with a named worker, to handle any errors that occur within the worker's body.

```ballerina
import ballerina/io;

public function main() {
    int[] values = [2, 3, 4, 5];
    int value = 0;

    worker w1 {
        int index = check getIndex(values, value);
        index -> function;
    } on fail {
        // Handle the error thrown in the worker body.
        -1 -> function;
    }

    int|error:NoMessage result = <- w1 | w1;
    io:println(result); // -1
}

function getIndex(int[] values, int value) returns int|error =>
    let int? index = values.indexOf(value) in index ?: error("value not found");
```

### Improvements

#### Support to construct immutable record values with record type-descriptors that have mutable default values

It is now possible to use record type-descriptors with mutable default values when constructing immutable record values, as long as the default value belongs to `lang.value:Cloneable`. When used in a context that requires an immutable value, the default value will be wrapped in a `value:cloneReadOnly` call to produce an immutable value.

```ballerina
import ballerina/io;

type Student record {|
    int id;
    string name;
    // The inherent type of the default value expression is `int[]`.
    int[] moduleCodes = [1001, 2001, 3010];
    // The inherent type of the default value expression is `any[]`.
    any[] config = getStudentConfig();
|};

function createEmployee(int id, string name, readonly & string[] config) {
    // No longer panics at runtime, since an immutable value is set
    // for the `moduleCodes` field.
    Student & readonly s1 = {id, name, config};
    io:println(s1.moduleCodes is readonly & int[]); // true
}

isolated function getStudentConfig() returns any[] {
    return [];
}
```

If the default value does not belong to `value:Cloneable`, and therefore, an immutable value cannot be created by calling `value:cloneReadOnly`, the compiler requires specifying a value for such a field (i.e., the default value will not be used).

```ballerina
function createEmployee(int id, string name) {
    // Results in a compile-time error now since there is no default
    // value that can be used for `config`.
    Student & readonly s1 = {id, name};
}
```

#### Improvements to the usage of default values of record fields

Now, the default value of a record is evaluated only if a value is not provided for the specific field in the mapping constructor.

```ballerina
import ballerina/io;

isolated int id = 1;

type Data record {
    int id = getId();
};

public function main() {
    Data data = {"id": 10};
    lock {
        io:println(id); // Prints 1 since it is `getId()` is not evaluated.
    }
}

isolated function getId() returns int {
    lock {
        id = id + 1;
        return id;
    }
}
```

With these improvements, with record type inclusion, the default value from an included record will not be used if the including record overrides the field.

#### Remove dependence on syntactic location for module-level XMLNS declarations

It is now possible for expressions to refer to module-level XML namespaces declarations that are declared later in the code.

```ballerina
public function main() {
    string exdoc = ex:doc;
}

xmlns "http://example.com" as ex;
```
#### Allow declaration of XML namespaces with the same prefix in multiple Ballerina files

It is now possible to declare XML namespaces with the same prefix in multiple Ballerina files (source parts) of the same package. This is because the prefix symbol space applies to the source part, and not the module.

main.bal
```ballerina
xmlns "https://ballerina.io/" as ns;
```

utils.bal
 ```ballerina
// Previously resulted in a `redeclared symbol` compile-time error, now works as expected.
xmlns "https://example.com/" as ns;
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### Support to provide values for configurable variables via environment variables

Configurable values can now be provided through environment variables using the following syntax.

```
BAL_CONFIG_VAR_key=value
```

The key conforms to the structure `ORG_MODULE_VARIABLE`, where each part in the unique identifier is converted to uppercase, and dots are converted to underscores.

For example, if the configurable variable is defined in the following way,

```ballerina
configurable int port = ?;
```

The values can be provided through environment variables as follows.

- If the configurable variable is defined in the default module or if a single Ballerina file is being used, the expected environment variable will be `BAL_CONFIG_VAR_PORT`.

- If the configurable variable is defined in a different module with the name `foo.bar` from the same organization, the expected environment variable will be `BAL_CONFIG_VAR_FOO_BAR_PORT`.

- If the configurable variable is defined in a module with the name `foo.bar` from a different organization called `testOrg`, the expected environment variable will be `BAL_CONFIG_VAR_TESTORG_FOO_BAR_PORT`.

The environment variables can be defined according to the operating system as follows.

For Windows:

```
$ set <env-var-name>=9090
```

For Linux/macOS:

```
$ export <env-var-name>=9090
```

The environment variable-based configuration is supported for configurable variables of `boolean`, `int`, `float`, `decimal`, `string`, and `xml` types.

If values are specified for the same configurable variable in multiple ways, the precedence, in decreasing order, will be as follows.
1. Environment variables
2. Command-line arguments
3. Configuration TOML files

#### New Runtime Java APIs

##### Java APIs to parse a JSON string to a target type

A new optimized API is introduced in `ValueUtils` to parse a given input stream and create a value using a subtype of `json` given by the target type. The user needs to close the provided input stream.

```java
public static Object parse(InputStream in, Type targetType) throws BError {
};
```

##### Java APIs to provide information about runtime artifacts

New runtime Java APIs are added to provide information about the active runtime artifacts.

```java
public List<Artifact> getArtifacts();
```

This returns a list of artifact instances that represent the services at runtime. An artifact instance contains a name (service name), type (only `service` is supported now), and a map of details. The map of details includes the following information.

- `listeners` - a list of listener objects that the service is attached to
- `attachPoint` - the attach point specified in the service declaration (for example, base path in HTTP)
- `service` - the service object

```java
public Node getNode();
```

This returns a node instance that represents the Ballerina runtime node. A node instance contains a node ID (`nodeId` - a unique generated ID) and a map of details. The map of details includes the following information.

- `balVersion` - The Ballerina version
- `balHome` - The path of Ballerina home
- `osName` - Name of the operating system
- `osVersion` - Version of the operating system

The above APIs can be called via a Ballerina environment instance as follows.

```java
import io.ballerina.runtime.api.Artifact;
import io.ballerina.runtime.api.Environment;
import io.ballerina.runtime.api.Node;

Repository repository = env.getRepository();
List<Artifact> artifacts = repository.getArtifacts();
Node node = repository.getNode();
```

##### Java APIs to start a new runtime and invoke a Ballerina function

Java APIs are introduced to start a new Ballerina runtime instance for a given module and perform function invocations within the module by calling the module initialization and module start methods sequentially before any other function calls. It is recommended to call the module stop method to gracefully shut down the Ballerina runtime at the end of the program.

```java
import io.ballerina.runtime.api.Runtime;

Runtime balRuntime = Runtime.from(module);
balRuntime.init();
balRuntime.start();
balRuntime.invokeMethodAsync(functionName, callback, args);
balRuntime.stop();
```

### Improvements

#### Support mapping of resource and remote method parameters to `BArray` parameters of generic native methods

A new way has been introduced to support the binding of any resource or remote method to a generic native method, regardless of the function parameters. The generic native method should be defined with a `BArray` parameter, which represents all the parameters excluding path parameters (handling path parameters in a similar manner is supported from 2201.5.0). To avoid errors due to overloaded methods, it is recommended to define parameter type constraints as well.

For example, the following Ballerina resource method,
```ballerina
isolated resource function get abc/[int p1]/[string p2]/[string p3]/[int ...p4] (string s, int i, typedesc<anydata> targetType = <>) = @java:Method {
    'class: "javalibs.app.App",
    name: "getResource",
    paramTypes: ["io.ballerina.runtime.api.values.BObject", "io.ballerina.runtime.api.values.BArray", "io.ballerina.runtime.api.values.BString"]
} external;
```

can be bound to the following Java method.
```java
public static void getResource(BObject client, BArray path, BArray args) {
}
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `avro` package

- Introduced Avro serialization/deserialization support.

#### `crypto` package

- Introduced new APIs for the following NIST finalist post-quantum algorithms, incorporating specifications aligned with FIPS drafts.
  - ML-KEM-768 (Kyber768) key encapsulation mechanism.
  - ML-DSA65 (Dilithium3) digital signature algorithm.

- Introduced new APIs for the following C + Q key encapsulation algorithms, and C + Q hybrid public key encryption (HPKE) algorithms.
  - RSA-KEM-ML-KEM-768 key encapsulation mechanism.
  - ML-KEM-768 hybrid public-key encryption (HPKE).
  - RSA-KEM-ML-KEM-768 hybrid public-key encryption (HPKE).

#### `data.jsondata` package

The [`data.jsondata`](https://lib.ballerina.io/ballerina/data.jsondata/latest/) package has been introduced to support JSON data conversions, data projection, navigation, and prettification.

- JSON data projection: JSON data can be converted to a Ballerina record by specifying only the required fields from the JSON data. This is helpful when the requirement is to extract a specific subset of fields from JSON data with a large number of fields.

    ```ballerina
    import ballerina/data.jsondata;
    import ballerina/io;

    // Define a closed record type to capture the required fields from the JSON content.
    type Book record {|
        string name;
        string author;
    |};

    public function main() returns error? {
        json jsonContent = {
            name: "Clean Code",
            author: "Robert C. Martin",
            year: 2008,
            publisher: "Prentice Hall"
        };
        // Based on the expected type, it includes only the `name` and `author` fields in the converted value.
        Book book = check jsondata:parseAsType(jsonContent);
        io:println(book);

        string jsonStr = string `
        {
            "name": "The Pragmatic Programmer",
            "author": "Andrew Hunt, David Thomas",
            "year": 1999,
            "publisher": "Addison-Wesley"
        }`;
        Book book2 = check jsondata:parseString(jsonStr);
        io:println(book2);
    }
    ```

- JSON navigation: JSONPath expressions can now be used to navigate and extract JSON data.

    ```ballerina
    import ballerina/data.jsondata;
    import ballerina/io;

    public function main() returns error? {
        json books = [
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                price: 100,
                year: 1925
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                price: 72.5,
                year: 1960
            },
            {
                title: "1984",
                author: "George Orwell",
                price: 90,
                year: 1949
            }
        ];

        // Use a JSONPath expression to extract the list of titles in the books array.
        json titles = check jsondata:read(books, `$..title`);
        io:println(titles);

        // Use a JSONPath expression to extract the list of published years for the
        // books that have a price value of more than 80.
        json years = check jsondata:read(books, `$..[?(@.price > 80)].year`);
        io:println(years);

        // Use a JSONPath expression to extract the total sum of the prices of the books.
        json sum = check jsondata:read(books, `$..price.sum()`);
        io:println(sum);
    }
    ```

- Prettify JSON: JSON data can be prettified to improve readability.

    ```ballerina
    import ballerina/data.jsondata;
    import ballerina/io;

    public function main() returns error? {
        json books = [
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                price: 100,
                year: 1925
            },
            {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                price: 72.5,
                year: 1960
            },
            {
                title: "1984",
                author: "George Orwell",
                price: 90,
                year: 1949
            }
        ];

        // Prettify JSON data using the `prettify` function with default indentation level.
        string booksPrettified1 = check jsondata:prettify(books);
        io:println(booksPrettified1);

        // Prettify JSON data with a custom indentation level.
        string booksPrettified2 = check jsondata:prettify(books, 2);
    }
    ```

#### `data.xmldata` package

The [`data.xmldata`](https://lib.ballerina.io/ballerina/data.xmldata/latest/) package has been introduced to support XML data conversions and data projection.

```ballerina
import ballerina/data.xmldata;
import ballerina/io;

// Define a closed record type to capture the required elements and attributes from the XML data.
type Book record {|
    string name;
    string author;
|};

public function main() returns error? {
    xml xmlData = xml `
    <book>
        <name>Clean Code</name>
        <author>Robert C. Martin</author>
        <year>2008</year>
        <publisher>Prentice Hall</publisher>
    </book>`;
    // Based on the expected type, it includes only the `name` and `author` fields in the converted value.
    Book book = check xmldata:parseAsType(xmlData);
    io:println(book);

    string xmlStr = string `
    <book>
        <name>Clean Code</name>
        <author>Robert C. Martin</author>
        <year>2008</year>
        <publisher>Prentice Hall</publisher>
    </book>`;
    Book book2 = check xmldata:parseString(xmlStr);
    io:println(book2);
}
```

#### `edi` package

- Added support for field length constraints (min/max) to enhance schema validation capabilities.
- Introduced support for escape characters in EDI, allowing more flexibility in data formatting and transmission.

#### `graphql` package

- Introduced GraphQL server-side caching support.

#### `persist` package

- Introduced support for the PostgreSQL data store, mirroring the functionality provided for other supported SQL data stores like MySQL and MSSQL.
- Implemented support for the Redis data store, including the following features:
  - Support for optional fields to be defined in the data model, providing flexibility in structuring data.
  - Support for connection configuration to be defined as separate parameters or as a URI
  - Support for Redis data store to be used as a cache or persistent store.

  >**Info:** The Redis database support is an experimental feature. APIs might change in future releases.

- Added support for the following annotations within the `persist.sql` package to facilitate entity mapping alongside additional SQL database features.
  - `@sql:Name` - Map an entity name to a specific table name and a field name to a specific column name.
  - `@sql:Varchar` - Give a specific VARCHAR length.
  - `@sql:Char` - Give a specific CHAR length.
  - `@sql:Decimal` - Give specific DECIMAL precision and scale.
  - `@sql:Index` - Declare an index field.
  - `@sql:UniqueIndex` - Declare a unique index field.
  - `@sql:Relation` - Declare a relation field. This is used to define a foreign key relationship between two entities.
  - `@sql:Generated` - Declare a generated field. This is used to define a field that is generated by the database.

#### `soap` package

- Introduced new APIs to connect with SOAP 1.1 and 1.2 endpoints.
- Added support for web service security policies.

#### `uuid` package

- Implemented support for generating random UUIDs in an intuitive manner via the `uuid:createRandomUuid` function.

### Improvements

#### `http` package

- Introduced support for the X25519Kyber768Draft00 post-quantum key agreement for TLS 1.3.

#### `cloud` package

- Directories can now be mounted as ConfigMaps and Secrets.

#### `graphql` package

- Improved the GraphQL error responses to use aliases instead of field names in the `path` field.
- Added support to report GraphQL specific diagnostics in the VS Code extension.

#### `mysql` package

- Specified SSL as the preferred option when users provide options without SSL configuration. Additionally, introduced support for explicitly disabling SSL.

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 9 (2201.9.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.9.0%22+label%3AType%2FBug).

### Revamped connectors

New versions of the following connectors have been released with major updates, as part of the Ballerina connector revamp initiative.
All listed connectors have been released under new major versions, featuring significant API and functionality changes, along with improved documentation and examples.

#### `asana` package

- Enhanced connector APIs by incorporating resource method syntax.

#### `aws.dynamodb` package

- Introduced new APIs to work with database backups with DynamoDB REST APIs.

#### `aws.dynamodbstreams` package

- Introduced a new connector to work with DynamoDB streams.

#### `aws.redshift` package

- Introduced seamless connectivity to Amazon Redshift databases.

#### `aws.sns` package

- Enhanced the connector APIs to support all the APIs provided by the AWS SNS REST API.

#### `candid` package

- Introduced support for connecting to Candid's Charity Check, Essentials, and Premier REST APIs.

#### `confluent.cavroserdes` package

- Introduced support for serializing and deserializing data using Avro schemas stored in the Confluent Schmema Registry.

#### `confluent.cregistry` package

- Introduced new APIs to connect with the Confluent Schema Registry.

#### `docusign.dsadmin` package

- Enhanced the connector APIs by incorporating resource methods.
- The package name has been changed to `docusign.dsadmin` from `docusign.admin`.

#### `docusign.dsclick` package

- Enhanced the connector APIs by incorporating resource methods.
- The package name has been changed to `docusign.dsclick` from `docusign.click`.

#### `docusign.dsesign` package

- Introduced new APIs to connect with DocuSign eSignature REST APIs.

#### `github` package

- Introduced support for connecting to GitHub REST API version 2022-11-28, replacing the GitHub GraphQL API-based connector.

#### `googleapis.gcalendar` package

- Enhanced the connector APIs by incorporating resource methods.
- The package name has been changed to `googleapis.gcalendar` from `googleapis.calendar`, which is still available for users.

#### `googleapis.gmail` package

- Enhanced connector APIs by incorporating resource function syntax, along with improved documentation and examples.

#### `guidewire.insnow` package

- Introduced support for connecting to Guidewire InsuranceNow REST API.

#### `ibm.ibmmq` package

- Introduced support for connecting to IBM MQ server versions up to 9.3.

#### `java.jms` package

- Revamped the connector according to Swan Lake standards.
- Incorporated observability support.
- Added support for GraalVM native image build.
- Improved the documentation along with new examples.
- Introduced Ballerina ActiveMQ driver to support integrations with Apache ActiveMQ broker.

#### `mongodb` package

- Introduced `mongodb:Client`, `mongodb:Database`, and `mongodb:Collection` objects to provide a more intuitive and user-friendly API for MongoDB operations.
- Introduced new APIs to be consistent with MongoDB's native APIs.
- Added support for MongoDB aggregation operations.
- Added support for MongoDB projections through type inference and manual projection.
- Added support for connecting to MongoDB Atlas databases and clusters.
- Added support for SSL connections to MongoDB servers.
- Improved the `find` API with support for filtering, sorting, and pagination.
- Improved the `update` API by providing `matchedCount` and `modifiedCount` in the response.

#### `nats` package

- Removed the previously deprecated `nats:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `nats:AnydataMessage` for continued functionality.

#### `rabbitmq` package

- Removed the previously deprecated `rabbitmq:Message` record. Consequently, corresponding APIs no longer accommodate this record. Users are advised to transition to utilizing subtypes of `rabbitmq:AnydataMessage` for continued functionality.

#### `redis` package

- Added support to connect and work with Redis clusters.
- Introduced support for secure connections (SSL/TLS) to Redis servers.
- Added support for Redis connection strings (i.e., Redis URIs).
- Extended connector compatibility to include the latest Redis server versions (up to 7.2.x).

#### `salesforce` package

- Introduced client credentials flow and username-password flow options to the Salesforce connector.
- Expanded support to include Bulk v2 API, APEX REST API, and additional REST API functionalities.
- Updated compatibility with the latest Salesforce REST API version (v59).
- Improved documentation and examples.

#### `snowflake` package

- Removed the `requestGeneratedKeys` option from the Client configuration. Given that Snowflake databases do not return generated keys, the `requestGeneratedKeys` option is now defaulted to `NONE`.

#### `twilio` package

- Enhanced integration with Twilio services (messaging, voice calls, media services, etc.) offered via the Twilio Basic REST API version 2010-04-01.

#### `zendesk` package

- Introduced support to connect to Zendesk REST API V2, combining the functionalities of the `zendesk.support` and `zendesk.voice` packages.

## Developer tools updates

### New features

#### AI Assisted Data Mapper

- Introduced a new experimental feature in the VS Code plugin for the data mapper to generate simple mappings automatically.
 
#### Formatter

- Support to customize formatting

    It is now possible to provide custom formatting configurations to the Ballerina formatter via a local or remote configuration file. This allows for consistency in code style across projects in an organization and simplifies the process of enforcing formatting standards. This is introduced as an experimental feature in Ballerina 2201.9.0.

#### Language Server

- Introduced the `Extract to transform function` code action to extract the value expression of a field in a mapping constructor into an expression-bodied function that returns expected record.
- Introduced the `Surround with lock` code action to wrap an isolated variable access with a `lock` statement.
- Introduced the `Add private qualifier` code action to set the visibility qualifier of a field in an isolated class to `private`.
- Introduced the `Make variable immutable` code action to add `final` and/or `readonly` as needed to make the field immutable.

#### Ballerina Shell

- Added support for invoking actions directly from the shell prompt, as shown in the following examples.

    ```ballerina
    $= string value = myClient->invoke("input");
    $= string value = myClient->/root/name("input");
    $= future<int> result = start name();
    ```

#### Test Framework

- The test framework now supports the parallel execution of tests as an experimental feature. To enable parallel test execution, simply use the `--parallel` flag with the `bal test` command.

    ```bash
    $ bal test --parallel
    ```

- APIs for mocking client resource methods is introduced. With these, a client resource can be stubbed to behave in a certain way. Previously, test doubles had to be used to mock client resource methods.

    ```ballerina
    // Sample HTTP Client call

    http:Client jokes = check new ("https://api.chucknorris.io/jokes/");
    json joke = check jokes->/random;
    ```

    ```ballerina
    // Stub to return a specific value
    jokes = test:mock(http:Client);
    test:prepare(jokes)
        .whenResource("::path")
        .withPathParameters({path: ["random"]})
        .thenReturn(<json>{});
    ```

#### EDI tool

- Added support for EDIFACT to Ballerina schema conversion.

  Users can now directly convert the EDIFACT schema to the Ballerina schema by specifying the EDIFACT version, message type, and output directory using the new tooling support.

  For example,

  ```bash
  bal edi convertEdifactSchema -v <EDIFACT version> -t <EDIFACT message type> -o <output folder>
  ```

- Introduced support for field length constraints (min/max).

  This update introduces minimum and maximum length constraints for EDI data fields, enhancing validation capabilities and ensuring data compliance.

  Overview of length constraints:

    - Fixed-length: Fields must match the specified length `N`. If not, Ballerina will either pad the field with spaces or produce an error if the field exceeds `N`.
    - Range limits:
      - Minimum length: If a field is shorter than specified, an error is triggered.
      - Maximum length: Fields longer than allowed will also trigger an error.

    For example,

    ```json
    "fields": [
        {"tag": "DocumentNameCode", "length": 10},
        {"tag": "DocumentNumber", "length": {"min": 1}},
        {"tag": "MessageFunction", "length": {"max": 3}},
        {"tag": "ResponseType", "length": {"min": 1, "max": 3}}
    ]
    ```

#### OpenAPI tool

- Integrated OpenAPI client generation to the `bal build` command.

  The user can provide the OpenAPI tool configuration in the `Ballerina.toml` file and generate the client during a build as follows:

  ```toml
  [[tool.openapi]]
  id = "dbclient"
  filePath = "openapi.yaml"
  targetModule = "delivery"
  ```

- Introduced the `add` sub-command to the OpenAPI tool to update the `Ballerina.toml` file with the OpenAPI tool configuration details.

  For example,

  `bal openapi add -i <yaml file> --mode client --id <tool config id>`

- Added support for OpenAPI mapping for Ballerina constraints in OpenAPI specification generation.
- Added support for OpenAPI link field mapping for Ballerina HATEOAS feature in OpenAPI specification generation.
- Added support for OpenAPI mapping for Ballerina HTTP interceptor services in OpenAPI specification generation.
- Added support for OpenAPI response mapping for Ballerina HTTP status code errors in OpenAPI specification generation.
- Added support for Ballerina client generation with status code response binding. This can be enabled by providing the `--status-code-binding` option to the OpenAPI client generation command.

  For example,

  `bal openapi -i <yaml file> --mode client --with-status-code-binding`

#### Persist tool

- Modified the `persist init` command to solely create a `persist` directory within the Ballerina project and generate a new definition file (`model.bal`) within the `persist` directory if it doesn't already exist. It no longer updates the `Ballerina.toml` file with the persist configuration as it did previously.
- Modified the `persist generate` command to function as a one-time source code generation tool. Additionally, introduced the following new options to the `persist generate` command:
    - `--datastore` - This is used to indicate the preferred data store.
    - `--module` - This is used to indicate the module in which the files are generated.

    For example,
    ```
    $ bal persist generate --datastore mysql --module db
    ```

- Changed the `persist generate` command to generate all the Ballerina types, client, `db_config` files, and the script file in the specified module directory, allowing the user to commit the generated source code along with the project source code.
- Introduced the new `persist add` command to initialize the `bal persist` feature in the Ballerina project and integrate the source code generation with the `bal build` command. This command will update the `Ballerina.toml` file with the `tool.persist` configuration and generate the `model.bal` file in the `persist` directory, if the file does not exist. This command supports the following options:
    - `--datastore` - This is used to indicate the preferred data store.
    - `--module` - This is used to indicate the module in which the files are generated.

    For example,
    ```
    $ bal persist add --datastore mysql --module db
    ```

- Implemented introspection support for existing databases to facilitate the generation of the persist data model. This functionality is accessible through the new `bal persist pull` command. The command is equipped with the following options:
    - `--datastore` - This is used to indicate the preferred data store.
    - `--host` - This is used to indicate the host of the database.
    - `--port` - This is used to indicate the port of the database.
    - `--user` - This is used to indicate the username of the database.
    - `--database` - This is used to indicate the database name.

    For example,
    ```
    $ bal persist pull --datastore mysql --host localhost --port 3306 --user root --database test
    ```
    >**Info:** The database introspection support is an experimental feature and currently only supports MySQL databases. The commands associated with the feature might change in future releases.

- Revised the persist migrate command to extract the datastore configuration from the provided argument instead of the `Ballerina.toml` file. The command now accepts the following option:
    - `--datastore` - This is used to indicate the preferred data store. The default value is `mysql`.

    For example,
    ```
    $ bal persist migrate --datastore mysql
    ```
    >**Info:** The migration support is an experimental feature and currently only supports MySQL databases. The commands associated with the feature might change in future releases.

### Improvements

#### OpenAPI Tool

- Added support for the Ballerina record rest field mapping in OpenAPI specification generation.
- Improved the OpenAPI client generation with parameterized path segments in the OpenAPI specification by generating `remote` methods in the Ballerina client.

#### Formatter

- Improvement to multiline function call formatting.

    When a multiline function call is present in the code, the subsequent lines used to have the same indentation as the first line. This behavior is modified to have an indentation of 8 spaces in the subsequent lines.

    Before formatting

    ```ballerina
    addNumbers(numberOne,  numberTwo, numberThree,
    numberFour, numberFive, numberSix);
    ```

    After formatting

    ```ballerina
    addNumbers(numberOne, numberTwo, numberThree,
            numberFour, numberFive, numberSix);
    ```

    When a multiline object is present as an argument, the indentation of the subsequent lines is set such that those lines have the same indentation as the object declaration.

    ```ballerina
    public function updateValues(int t1, int t2) {
        update(t1, object {
                       int i = 1;
                       int y = 2;
                   },
                   t2);
    }
    ```

#### Language Server

- Improved the snippet completion items provided for dependently-typed functions.
- Improved the completion items provided for resource parameters with singleton types.
- Improved the order of completions provided for resource access actions.
- Introduced an error notification to indicate when the project contains cyclic dependencies.
- Introduced an error notification to indicate high memory usage.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 9 (2201.9.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.9.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-library/issues?q=is%3Aissue+milestone%3A2201.9.0+label%3Amodule%2Fopenapi-tools+label%3AType%2FBug+is%3Aclosed)
- [Test Framework](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AType%2FBug+is%3Aclosed+label%3AArea%2FTestFramework+milestone%3A2201.9.0)
- [Bindgen tool](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AArea%2FBindgen+milestone%3A2201.9.0+is%3Aclosed)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AArea%2FDebugger+milestone%3A2201.9.0+is%3Aclosed)

## Ballerina packages updates

### New features

- Build tools can now be seamlessly integrated into the package build. This enhancement allows authors of tools managed by the `bal tool` command to expand the tool functionality, supporting direct integration into the package build. With Update 9, platform-provided tools such as the OpenAPI and Persist tools include automation capabilities for generating clients during the package build itself by specifying these tools in the `Ballerina.toml` file.

    ```toml
    [[tool.openapi]]
    id = "generate-delivery-client"
    filePath = "delivery.yml"
    options.mode = "client"
    ```

### Improvements

- The `provided` scope has been introduced for platform dependencies to prevent a certain platform library from being included in the BALA file. This scope is particularly useful when the license of the provider restricts the redistribution of the platform library.

    ```toml
    [[platform.java11.dependency]]
    # Group ID of the Maven dependency.
    groupId = "<group-id>"
    # Artifact ID of the Maven dependency.
    artifactId = "<artifact-id>"
    # Version of the Maven dependency.
    version = "<version>"
    # Scope of the dependency.
    scope = "provided"
    ```

- With Update 9, diagnostics issued by the dependency packages are hidden by default. These diagnostics can be printed to the console by passing the `--show-dependency-diagnostics` build option to the CLI command.

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 9 (2201.9.0) of the repository below.

- [Project API](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AArea%2FProjectAPI+label%3AType%2FBug+is%3Aclosed+milestone%3A2201.9.0)

## Backward-incompatible changes

### Language changes

- A bug that allowed using `self` of an isolated object to access a mutable field without a lock statement within an anonymous function has been fixed.

    ```ballerina
    import ballerina/log;

    isolated class Data {
        private int id;
        private string name;

        isolated function init(int id, string name) {
            self.id = id;
            self.name = name;
        }

        isolated function update(int? id = (), string? name = ()) {
            lock {
                if id is int {
                    self.id = id;
                }

                if name is string {
                    self.name = name;
                }
            }

            var logger = isolated function () returns string {
                // Now results in compile-time errors,
                // need to use a lock statement.
                return string `ID: '${self.id}', Name: '${self.name}'`;
            };
            log:printDebug("Data updated", details = logger);
        }
    }
    ```

- A bug which resulted in the rest parameter of a function not being considered final has been fixed.

    ```ballerina
    function sum(int i, int... j) {
        j = [1, 2, 3]; // Compile-time error now.
    }
    ```

- A bug which resulted in the addition of a default namespace to an XML navigation name pattern, even when the default namespace is defined after it, has been fixed.

    ```ballerina
    public function main() {
        xml x = xml `<item><name>Box</name></item>`;

        // Previously evaluated to an empty XML sequence, now evaluates to
        // `<item><name>Box</name></item>`
        xml x1 = x.<item>;

        xmlns "http://example.com/";
    }
    ```

- A bug which resulted in XML navigation failing to return elements with namespaces different from the default one when using `<*>` to access XML element children has been fixed.

    ```ballerina
    public function main() {
        xmlns "http://example.com/";
        xmlns "https://ballerina.io/" as ns0;

        xml x1 = xml `
        <item>
            <ns0:name>ball</ns0:name>
            <type>t</type>
        </item>`;

        // Previously evaluated to `
        // <type xmlns="http://example.com/">t</type>`,
        // now evaluates to,
        // `<ns0:name xmlns="http://example.com/" xmlns:ns0="https://ballerina.io">ball</ns0:name>
        // <type xmlns="http://example.com/">t</type>`
        xml x2 = x1/<*>;
    }
    ```

- A bug which resulted in the XML namespace URI being empty when a constant is used in the XML namespace declaration has been fixed.

    ```ballerina
    const URI = "http://ballerina.com/";
    xmlns URI as ns0;

    public function main() {
        // Previously evaluated to "{}attr", now evaluates to {http://ballerina.com/}attr
        string s = ns0:attr;
    }
    ```

- A bug which resulted in a compiler crash or a nil value for a variable of a binding pattern which is used as a captured variable has been fixed.

    ```ballerina
    type Doctor record {
        string name;
        string category;
    };

    function updateDoctorCategories(Doctor doctor, string[] categories) returns error? {
        var {category} = doctor;
        string cat = category;
         // Previously evaluated to `true` since category is used in a closure, now returns `false`.
        boolean b = <any> category is ();
        if !categories.some(existingCategory => existingCategory == category) {
            categories.push(category);
        }
    }
    ```

- A bug which resulted in XML navigation evaluating to empty XML sequence when the navigation name pattern contains escape characters has been fixed.

    ```ballerina
    public function main() {
        xml d = xml `
        <person>
            <name>John</name>
            <home-address>some address</home-address>
        </person>`;

        xml x1 = d/<home\-address>; // Previously evaluated to an empty XML sequence, now evaluates to `<home-address>some address</home-address>`
    }
    ```

-  A bug which resulted in no compilation errors being logged for missing required fields in the `select` clause has been fixed.

    ```ballerina
    type Student record {|
        int id;
        string name;
        Enrollment[] enrollments;
    |};

    type Course record {|
        int id;
        string name;
    |};

    type Enrollment record {|
        int id;
        string name;
        int year;
        int grade;
    |};

    function getStudentCourses(Student student) returns int|Course[] {
        int|Course[] courses = from var enrollment in student.enrollments
                            select {
                                // Compile-time error now, since the `name` field is not specified
                                id: enrollment.id
                            };
        return courses;
    }
    ```

- A bug which resulted in the top-most comments above imports being moved when formatting imports has been fixed. This fix also preserves new lines within comment blocks above imports.

    Before formatting

    ```ballerina
    // Copyright (c) 2024 WSO2 LLC. (http://www.wso2.com).
    //
    // WSO2 LLC. licenses this file to you under the Apache License,
    // Version 2.0 (the "License"); you may not use this file except
    // in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing,
    // software distributed under the License is distributed on an
    // "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    // KIND, either express or implied.  See the License for the
    // specific language governing permissions and limitations
    // under the License.


    // this file contains implementaion of the agent code.
    // It includes functions for managing the ai client.



    import ballerinax/oracledb;

    import ballerina/io;

    // module imports
    import agent;
    import utils;

    // endpoint related functions
    import ai/endpoints;

    // config related functions
    import ai/config;

    function attachAgent() {

    }
    ```

    After formatting

    ```ballerina
    // Copyright (c) 2024 WSO2 LLC. (http://www.wso2.com).
    //
    // WSO2 LLC. licenses this file to you under the Apache License,
    // Version 2.0 (the "License"); you may not use this file except
    // in compliance with the License.
    // You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing,
    // software distributed under the License is distributed on an
    // "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    // KIND, either express or implied.  See the License for the
    // specific language governing permissions and limitations
    // under the License.

    // this file contains implementaion of the agent code.
    // It includes functions for managing the ai client.

    // module imports
    import agent;
    import utils;

    import ballerina/io;
    import ballerinax/oracledb;

    // config related functions
    import ai/config;

    // endpoint related functions
    import ai/endpoints;

    function attachAgent() {

    }
    ```

### Runtime changes

- To avoid clashes with Java identifiers, the character used for encoding and decoding identifiers has been changed from `$` to `&`.

### Ballerina library changes

#### `cloud` package

- SSL configurations are no longer automatically retrieved from the code. You need to explicitly mark them as secrets in `Cloud.toml`.
    ```toml
    [[cloud.secret.files]]
    file="resource."
    mount_dir="./resource"
    ```

- The `mount_path` of `[[cloud.secret.files]]` and  `[[cloud.config.maps]]` is renamed as `mount_dir` in the `Cloud.toml` file, and now it always expects the destination directory.

- Entrypoints are used instead of CMD to run the ballerina application in the Dockerfile.
    ```
    CMD ["java","..."] //Old
    ```

    ```
    ENTRYPOINT ["java","..."] //New
    ```

- Suffix is added to generated ConfigMaps and Secrets in Kubernetes to avoid Conflicts.
- Subpaths are used in Kubernetes to better support multiple files in the same directory.

### Developer tool changes

#### OpenAPI tool

- The generated client methods will no longer have the header and query parameters as separate function parameters. The parameters will be grouped as `headers` and `queries` which is align with the HTTP client methods. If there are no header parameter specified then the client methods will have a default headers parameter of type `map<string|string[]>`. This change is applicable for both `remote` and `resource` methods.

  - Old client method:
    ```ballerina
    // version and user-id are header parameters and genre is a query parameter
    resource isolated function get albums(Version version, string user\-id, string genre = "Hard Rock") returns Album[]|error {
       ...
    }
    ```
  - New client method:
    ```ballerina
    // version and user-id are header parameters and genre is a query parameter
    resource isolated function get albums(GetAlbumsHeaders headers, *GetAlbumsQueries) returns Album[]|error {
       ...
    }
    ```
    Header and Query parameter types:
    ```ballerina
    public type GetAlbumsHeaders record {
        string user\-id;
        Version version;
    };
    
    public type GetAlbumsQueries record {
        string genre = "Hard Rock";
    };
    ```
  - Client call change:
    ```ballerina
    Album[] albums = check oldClient->/albums("V1", "U102", "Progressive Rock"); //Old client

    Album[] albums = check newClient->/albums({ version: "V1", user\-id: "U102" }, genre = "Progressive Rock"); //New client
    ```  
