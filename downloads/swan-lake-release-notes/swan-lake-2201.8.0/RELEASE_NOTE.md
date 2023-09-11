---
layout: ballerina-left-nav-release-notes
title: 2201.8.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.8.0/
active: 2201.7.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.8.0
    - /downloads/swan-lake-release-notes/2201.8.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.8.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake 2201.8.0

<em>2201.8.0 (Swan Lake Update 8) is the eighth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2023R1 version of the Language Specification.</em> 

## Update Ballerina

Update your current Ballerina installation directly to 2201.8.0 using the [Ballerina Update Tool](/learn/cli-documentation/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

>**Info:** From this release onwards, you can verify Ballerina artifacts using the Cosign CLI and Rekor APIs. For more information, see [Verify Ballerina artifacts](/downloads/verify-ballerina-artifacts).

## Backward-incompatible changes

- A type-checking bug that resulted in incorrect subtype relationships between records with optional fields and open records has been fixed.

    ```ballerina
    import ballerina/io;

    type Person record {
        string name;
    };

    type Employee record {
        string name;
        int id?;
    };

    public function main() {
        Person person = {name: "May"};
        Employee employee = person; // Compilation error now.

        io:println(person is Employee); // Prints `false` now.
    }
    ```

- Analysis in the `init` method of an `isolated` object has been updated to disallow invalid transferring in/out of values that violated the isolated root invariant.

    ```ballerina
    type Node record {|
        readonly string path;
        map<string[]>? app = ();
    |};

    isolated class Class {
        private Node node;
        private Node[] arr = [];

        function init(Node node) {
            self.node = node.clone();

            self.arr.push(node); // Compilation error now.
            self.arr[0] = node; // Compilation error now.
        }
    }
    ```

- Mutable objects have been disallowed in annotations.

    ```ballerina
    type Validator object {
        function validate(anydata data) returns error?;
    };

    type AnnotationData record {|
        string name;
        Validator validator;
    |};

    annotation AnnotationData config on type; // Compilation error now.
    ```
    
- Fixed a bug that allowed using field access with a map of `xml`. 

    ```ballerina
    map<xml> m = {a: xml `foo`};
    xml x = check m.a; // Compilation error now.
    ```

- Ballerina interoperability implementation may have an impact with the Java 17 support due to any incompatible changes. For example, Java 17 has some restrictions on using Java reflections with internal Java packages. For more information, see the Java 17 release notes.

- A bug that permitted uninitialized variables to evade detection when utilizing the `on fail` clause has been fixed.

  ```ballerina
  public function main() {
    int resultInt;
    transaction {
        resultInt = check calculateDefaultValue(true);
        check commit;
    } on fail {
        io:println("Failed to initialize resultInt");
    }
    resultInt += 1; // Compilation error now.
  }
  ```

- A bug that resulted incorrect type inference within query expressions when there is no expected type has been addressed. Previously, when iterating over a map without explicitly specifying an expected type, the resulting type of the query expression was erroneously inferred as an array. This misinterpretation has now been rectified and is properly restricted.
  
- ```ballerina
  function filterEmployeesByDepartment(map<Employee> employees, string department) {
    var result = from var e in employees // Compilation error now.
        where e.department == department
        select e.name;
  }
  ```

- A bug that allowed ignoring possible completion with an error when using the `collect` clause in a query expression has been fixed.
 
- ```ballerina
  function calculateTotalSalary(stream<Employee, error?> strm, string dept) {
    int total = from var {department, salary} in strm // Compilation error now.
        where department == dept
        collect sum(salary);
  }
  ```

- A bug related to deciding the types of numeric literals has been fixed.

    ```ballerina
    2f|1 a = 2; // Compilation error now, `2` is considered to be `int`.
    3d|6 b = 3; // Compilation error now, `3` is considered to be `int`.
    3d|4f|6 b = 4; // Compilation error now, `4` is considered to be `int`.
    ```

- A bug that allowed an `anydata` value to be used in contexts expecting an `anydata & readonly` value has been fixed.

    ```ballerina
    public function main() {
        anydata a = [];
        anydata & readonly b = a; // Compilation error now.
    }
    ```
  
- A bug that allowed using object type inclusion with a `readonly` `service` object in a `readonly` non-`service` class has been fixed.

    ```ballerina
    public type A readonly & service object {
        isolated remote function execute() returns int;
    };
  
    readonly client class B {
        *A; // Compilation error now.
  
        isolated remote function execute() returns int {
            return 2;
        }
    }
    ```

- A bug which caused the runtime error messages to include the flattened representation of a union type instead of the name used in the type definition has been fixed.
  
    ```ballerina
    type AC map<int>|string;
    
    public function main() returns error? {
        map<anydata> x = {a: "Ballerina"};
        AC|boolean _ = check x.cloneWithType();
    }
    ```

    This now fails with `"'map<anydata>' value cannot be converted to '(AC|boolean)'"` instead of `"'map<anydata>' value cannot be converted to '(map<int>|string|boolean)'"`.

- Modified the behavior of the [runtime Java APIs to support the intersection type](/downloads/swan-lake-release-notes/swan-lake-2201.8.0#intersection-type-support-in-runtime-java-apis).

- Modified the behavior of the Semantic API `typeDescriptor()` methods to return the intersection type symbol instead of the effective type symbol (i.e., the symbol of the corresponding non-intersection type that is computed to represent the same value space).
    ```ballerina
    // `TypeSymbol` of `A` will now be an `IntersectionTypeSymbol` instead of `ArrayTypeSymbol`.
    type A int[] & readonly;
    ```

- Support for the `AES/GCM/PKCS5Padding` encryption algorithm has been removed from the `crypto` package.

## Platform updates

### New features

#### Introduction of list constants

The language now supports list constants. You can declare a constant variable using a list constructor as shown below.

```ballerina
const int[] ERROR_CODES = [404, 500, 503];
const ERROR_MESSAGES = ["Not Found", "Internal Server Error", "Service Unavailable"];
```

Also, you can declare a list constant using a byte array literal.

```ballerina
const byte[] data16 = base16 `55 EE 66`;
const data64 = base64 `ABCD pqrs`;
```

### Improvements

#### Make `async-send` an action

- Reclassified `async-send` from a statement to an action in alignment with the Ballerina specification.

The following case is now supported.

```ballerina
public function main() {
    worker w1 {
        _ = 5 -> w2;
    }
}
```

### Bug fixes

## Language updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.8.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

#### New Runtime Java APIs

- Introduced the `Type getImpliedType(Type)` API in the `io.ballerina.runtime.api.utils.TypeUtils` class to recursively resolve type reference types (to get referred types) and/or intersection types (to get effective types).

    ```ballerina
    // `getImpliedType` on type A returns a `BArrayType`. This is achieved by first retrieving the referred type of the type reference type, which will be an intersection type, and then retrieving the effective type of the intersection type.
    type A int[] & readonly;
    ```

#### Ballerina Profiler (experimental)

Introduced the `profile` CLI command, which runs a Ballerina package and does a CPU profile of it during runtime.

```
$ bal profile
```

- For example, if we run the above command in the root directory of a Ballerina package, it generates a flame graph that shows the time taken to execute each function.

- The output is given by the `ProfilerOutput.html` file, which can be opened using a web browser.

>**Note:** This is an experimental feature, which supports only a limited set of functionality.

### Improvements

#### Java 17 support

Ballerina now supports code compilation and execution with Java 17.

#### Support large list and mapping constructors

The number of members supported in a list constructor expression and the number of fields supported in a mapping constructor expression have been increased to create new array, tuple, map, and record values that are larger in size.

For example, the following array constructor is now supported.

```ballerina
// Array with 10000 elements. Middle elements are not shown and replaced with `...`.
int[] array = [1, 2, 3, ..., 9998, 9999, 10000];
```

#### Intersection type support in runtime Java APIs

The following runtime APIs are now modified to return an intersection type rather than returning the effective type of the intersection.

| **Runtime API**                                                           | **Java class**                                     |
|---------------------------------------------------------------------------|----------------------------------------------------|
| `getElementType`                                                          | `io.ballerina.runtime.api.types.ArrayType`         |
| `getDetailType`                                                           | `io.ballerina.runtime.api.types.ErrorType`         |
| `getFieldType`                                                            | `io.ballerina.runtime.api.types.Field`             |
| `getParameterTypes`                                                       | `io.ballerina.runtime.api.types.FunctionType`      |
| `getReturnType`                                                           | `io.ballerina.runtime.api.types.FunctionType`      |
| `getReturnParameterType`                                                  | `io.ballerina.runtime.api.types.FunctionType`      |
| `getRestType`                                                             | `io.ballerina.runtime.api.types.FunctionType`      |
| `getParameters` (The `Parameter.type` field can be an intersection type.) | `io.ballerina.runtime.api.types.FunctionType`      |
| `getConstituentTypes`                                                     | `io.ballerina.runtime.api.types.IntersectionType`  |
| `getConstrainedType`                                                      | `io.ballerina.runtime.api.types.MapType`           |
| `getParamValueType`                                                       | `io.ballerina.runtime.api.types.ParameterizedType` |
| `getRestFieldType`                                                        | `io.ballerina.runtime.api.types.RecordType`        |
| `getReferredType`                                                         | `io.ballerina.runtime.api.types.ReferenceType`     |
| `getConstrainedType`                                                      | `io.ballerina.runtime.api.types.StreamType`        |
| `getCompletionType`                                                       | `io.ballerina.runtime.api.types.StreamType`        |
| `getConstrainedType`                                                      | `io.ballerina.runtime.api.types.TableType`         |
| `getTupleTypes`                                                           | `io.ballerina.runtime.api.types.TupleType`         |
| `getRestType`                                                             | `io.ballerina.runtime.api.types.TupleType`         |
| `getConstraint`                                                           | `io.ballerina.runtime.api.types.TypedescType`      |
| `getMemberTypes`                                                          | `io.ballerina.runtime.api.types.UnionType`         |
| `getOriginalMemberTypes`                                                  | `io.ballerina.runtime.api.types.UnionType`         |
| `getElementType`                                                          | `io.ballerina.runtime.api.values.BArray`           |
| `getConstraintType`                                                       | `io.ballerina.runtime.api.values.BStream`          |
| `getCompletionType`                                                       | `io.ballerina.runtime.api.values.BStream`          |
| `getKeyType`                                                              | `io.ballerina.runtime.api.values.BTable`           |
| `getDescribingType`                                                       | `io.ballerina.runtime.api.values.BTypedesc`        |
| `getType`                                                                 | `io.ballerina.runtime.api.values.BValue`           |
| `getType`                                                                 | `io.ballerina.runtime.api.utils.TypeUtils`         |

For example, if an intersection type is defined in the following way,

```ballerina
type ReadonlyIntArray readonly & int[];

ReadonlyIntArray array = [1, 2, 3, 4];
```

the results of the runtime API calls will be as follows.

| **Runtime API call**                                   | **Result**                                                     |
|--------------------------------------------------------|----------------------------------------------------------------|
| `array.getType()`                                      | This will return an `IntersectionType` instead of `ArrayType`. |
| `getDescribingType()` on `ReadonlyIntArray` type       | This will return an `IntersectionType` instead of `ArrayType`. |
| `getImpliedType()` on received `IntersectionType` type | This will return an `ArrayType`.                               |      

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.8.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Standard library updates

### New features

#### `mqtt` package
- Introduced the `mqtt` standard library package, which provides an implementation to interact with message brokers using the MQTT protocol.

#### `java.jms` package
- Introduced the `java.jms` standard library package, which provides an implementation to interact with message brokers using the JMS protocol.

#### `graphql` package

- Introduced the `DataLoader` functionality.

### Deprecations

#### `graphql` package

- Deprecated the `executeWithType()` method of the `graphql:Client`.

### Improvements

#### `graphql` package

- Added support for the `@deprecated` directive to output objects defined using record types.
- Added support for printing the GraphiQL URL to `stdout`.
- Added support for generating a subgraph SDL schema at compile time.

### Bug fixes

To view bug fixes, see the [GitHub milestone for 2201.8.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.8.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

- Add custom completions for HTTP services.

#### CLI

- Added a new `bal tool` command to manage tools that extend the functionality of the CLI. Tools can be pulled from the Ballerina Central and are managed using the `bal tool` command. For more information, see [Tool commands](https://ballerina.io/learn/cli-documentation/cli-commands/#tool-commands).

#### OpenAPI tool
- Added support to generate Ballerina client and service declarations from OpenAPI v3.1.x definitions.

### Improvements

#### Language Server

- Suggest Ballerina Central packages when they are partially typed.
- Improve sorting in the record type descriptor node context.
- Introduce a code action to add local module dependencies to the `Ballerina.toml` file.
- Introduce a code action to change the variable type of a `let` expression.
- Introduce a code action to create a function for the expression of a `select` clause.
- Improve completions in the service declaration node context.
- Improved the LS simulator.

### Bug fixes

To view bug fixes, see the GitHub milestone for 2201.8.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/orgs/ballerina-platform/projects/356/views/55?filterQuery=task-approved%3AYes+release%3A%22Swan+Lake+-+U8%22+subteam%3ALS+label%3A%22Type%2FBug%22+status%3ADone)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.8.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

Added support for custom package repositories for dependency resolution. This feature enables configuring commonly used package repositories to publish Ballerina libraries and to use them in Ballerina projects. 
