---
layout: ballerina-left-nav-release-notes
title: Swan Lake Preview 7
permalink: /downloads/swan-lake-release-notes/swan-lake-preview7/
active: swan-lake-preview7
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-preview7
---

### Overview of Ballerina Swan Lake Preview 7 

This release is the seventh preview version of Ballerina Swan Lake. It is the successor of the fifth preview version (SLP5) and SLP6 is an internal-only release. 

This release includes a new set of language features along with improvements and bug fixes to the compiler, runtime, standard library, and developer tooling.

- [Updating Ballerina](#updating-ballerina)
    - [For Existing Users](#for-existing-users)
    - [For New Users](#for-new-users)
- [Highlights](#highlights)
- [What is new in Ballerina Swan Lake Preview 7](#what-is-new-in-ballerina-swan-lake-preview-7)
    - [Language](#language)
        - [Support for Configurability](#support-for-configurability)
        - [Isolated Variables](#isolated-variables)
        - [Isolated Object Constructor Expressions](#isolated-object-constructor-expressions)
        - [Support for Distinct Objects](#support-for-distinct-objects)
    - [Runtime](#runtime)
        - [Support for DynamicListener](#support-for-dynamiclistener)
        - [New Runtime APIs](#new-runtime-apis)
    - [Standard Library](#standard-library)
        - [Revamp File and Filepath Modules](#revamp-file-and-filepath-modules)
        - [Improved IO Module](#improved-io-module)
    - [Language Server](#language-server)
    - [Code to Cloud](#code-to-cloud)
    - [Breaking Changes](#breaking-changes)

#### Updating Ballerina

You can use the update tool to update to Ballerina Swan Lake Preview 7 as follows.

##### For existing users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](http://ballerina.io/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 7.

 > `ballerina dist pull slp7`                 

However, if you are using a Ballerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

##### For new users

If you have not installed Ballerina, then download the [installers](https://ballerina.io/downloads/) to install.

#### Highlights

- Introducing Ballerina Packages
- Support for configuring module-level, basic variables at the program execution
- Ability to mark module-variable declarations with an initial value expression as `isolated`
- Ability to use the `isolated` qualifier  with an object-constructor expression to construct an `isolated` object
- Support to mark an object-type definition as a `distinct` object type 
- Allow using the object constructor to create distinct objects
- Support to register and deregister a dynamic listener at the runtime
- Introduction of the new runtime APIs
- Revamp of the `File/Filepath` modules
- Introduction of new high-level APIs to provide I/O operations
- Introduction of a new code-action `Add Type Cast`
- Revamp of the code-action extension APIs 
- Introduction of code to cloud (`c2c`) to simplify deploying Ballerina code in the cloud

### What is new in Ballerina Swan Lake Preview 7

#### Ballerina packages 

With this release we will be introducing Ballerina Packages. Ballerina Package is a bundle that consist of one or more Ballerina modules. Going forward, the Ballerina Package will be used to share Ballerina libraries. 


With the introduction of Ballerina packages Ballerina project structure and build tools has also been changed. Please refer to the [Organizing Ballerina Code](/learn/organizing-ballerina-code/) for more details. 


For Swan Lake releases Ballerina Central will support users to push and pull Ballerina Packages. Going forward It will not be possible to push individual modules with swan lake releases. With the preview releases you have the ability to push and pull Ballerina Packages to/from Central. However the Packages pushed using preview releases will be cleared when we release the swan lake GA release.You can use the existing Ballerina Central key to push Packages.


#### Language

##### Support for configurability

Now, Ballerina supports configuring module-level, basic variables at the program execution. The value provided in the program will be overridden by the value specified in the configuration file. These variables can be initialized using the `configurable` keyword in the following ways. 

A `configurable` variable that is defined with `?` as the initializer expression requires a value to be specified for such a variable in the configuration file.

```ballerina
configurable string hostName = ?;
```

A `configurable` variable that is defined with any other initializer expression can be overridden by a value specified in the configuration file. If a value is not provided in the configuration file, the initializer expression is used.

```ballerina
configurable string hostName = “0.0.0.0”;
```

Currently, configuration is supported via a TOML (v0.4.0) file named `configuration.toml`. This file should be located in the current directory. The format of the `configuration.toml` file is as follows.

```toml
[orgName.pkgName.submoduleName]
# The above toml table specification is not needed for single file execution
intVar = 24
floatVar = 4.8
stringVar = "hello world"
booleanVar = false
```

Currently, Ballerina supports configurable variables of the types `int`, `float`, `boolean`, and `string`. Future versions will add support for configurable variables of any type that is a subtype of `readonly&anydata`.

##### Isolated variables

Module variable declarations with an initial value expression can now be marked as `isolated`. An `isolated` variable can be accessed only within a `lock` statement.

Similar to `isolated` objects, `isolated` variables are also considered as isolated roots, which guarantee that their mutable state is only reachable via the isolated root. As with `isolated` objects, when an `isolated` variable is accessed within a `lock` statement, additional rules apply to how values are transferred in and out of the `lock` statement.

An `isolated` variable can also be accessed in an `isolated` function.

```ballerina
type Coordinates record {|
    decimal latitude;
    decimal longitude;
|};

isolated map<Coordinates> cities = {};

isolated function getLocation(string city) returns Coordinates? {
    lock {
        return cities[city].clone();
    }
}

isolated function resetCities() {
    lock {
        cities = {};
    }
}
```

##### Isolated object constructor expressions

Several changes have been introduced to how an object constructor expression can construct an `isolated` object. Now, the `isolated` qualifier can be used with an object constructor expression to construct an `isolated` object.

```ballerina
class Identifier {
    int id = 1;
}

public function main() {
    Identifier nonIsolatedIdentifier = new;

    Identifier isolatedIdentifier = isolated object {
        final int id = 1;
        private string name = "default";

        function updateName(string name) {
            lock {
                self.name = name;
            }
        }
    };

    boolean b1 = <any> nonIsolatedIdentifier is isolated object {}; // false
    boolean b2 = <any> isolatedIdentifier is isolated object {}; // true
}
```

An object-constructor expression also constructs an `isolated` object if all of the fields of the object constructor expression are `final` and the types of the fields are subtypes of `readonly` or `isolated object {}`.

```ballerina
isolated class Identifier {
    final int i;
    private int j;

    isolated function init(int i, int j) {
        self.i = i;
        self.j = j;
    }
}

public function main() {
    var ob = object { // Constructs an `isolated` object.
        final int a = 1000;
        final Identifier b = new (1, 2);
    };

    isolated object {} isolatedOb = ob; // Now valid.
}
```

##### Support for distinct objects

###### Distinct object type

An object type definition can now define a `distinct` object type.

```ballerina
type Circle distinct object {
    int x;
    int y;
    int r;
};

type Color [int, int, int];

class ColoredCircle {
    *Circle;
    Color color;

    function init(int x, int y, int r, Color color) {
        self.x = x;
        self.y = y;
        self.r = r;
        self.color = color;
    }
}

class ColoredCircleLookAlike {
    int x;
    int y;
    int r;
    Color color;

    function init(int x, int y, int r, Color color) {
        self.x = x;
        self.y = y;
        self.r = r;
        self.color = color;
    }
}

Circle c = new ColoredCircle(0, 0, 0, [123, 100, 100]);
Circle d = new ColoredCircleLookAlike(0, 0, 0, [123, 100, 100]); // Not allowed.
```

The `ColoredCircle` type is a distinct type that is a subtype of the `Circle` distinct object type even though `ColoredCircle` is not marked as a distinct class.

Although `ColoredCircleLookAlike` is structurally a subtype of the `Circle` type, since `Circle` is a distinct type and `ColoredCircleLookAlike` does not include it via object type inclusion,`ColoredCircleLookAlike` is not a subtype of `Circle`.

###### Distinct object constructor

If no type reference is provided in the object constructor, the contextually-expected type must be definite and the type-ids of the constructed object will be the type-ids of the contextually-expected type. This allows using the object constructor to create distinct objects.

#### Runtime

##### Support for `DynamicListener`

 A dynamic listener can be registered and deregistered at runtime as follows.

```ballerina
ModListener listenerVar = new(); // Where ModListener is a DynamicListener 
runtime:registerListener(listenerVar);
runtime:deregisterListener(listenerVar);
```

These methods and the definition of `DynamicListener` have been added to the new `lang.runtime` module.

```ballerina
public type DynamicListener object {
    public function __start() returns error?;
    public function __gracefulStop() returns error?;
    public function __immediateStop() returns error?;
};
```

##### New runtime APIs

The `io.ballerina.runtime.api.` package will only be exposed to the outside. The runtime API package and its sub packages will contain the required APIs to handle the runtime constructs as follows.

| Package                                                             | Description                                                                                                                                                                                                                                                               |
|---------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| io.ballerina.runtime.api.creators                                   | Provides APIs to create runtime types, values, and errors.                                                                                                                                                                                                                  |
| io.ballerina.runtime.api.utils                                      | Provides APIs to manage XML, JSON, string, and type-related operations.                                                                                                                                                                                                      |
| io.ballerina.runtime.api.types and  io.ballerina.runtime.api.values | Holds the Ballerina runtime API types and values.                                                                                                                                                                                                                             |
| io.ballerina.runtime.api.Environment                                | Interop functions can have an `Environment` parameter as the first parameter.  This provides APIs to get the current module, strand ID, strand name, and strand metadata.  Also, with the `Environment` instance, you can set and get the strand local properties. |

| io.ballerina.runtime.api.Runtime                                    | The `Environment` also provides an instance of the current runtime class, which will contain APIs to invoke Ballerina object functions.                                                                                                                                              |
| io.ballerina.runtime.api.*                                          | Contains `Future`, `Module`, `PredefinedTypes`, and `TypeTags` classes to handle the other runtime constructs.                                                               


None of the Ballerina runtime internal exceptions will be exposed. The `BError` class should be used to handle Ballerina runtime errors. The `io.ballerina.runtime.api.creators.ErrorCreator` class provides the required APIs to create runtime errors.                                                                         

#### Standard library

##### Revamp `file` and `filepath` modules

The `file` and `filepath` APIs have been revamped in this release. A summarized list of the changes done is as follows.

1. The `file` and `filepath` modules have been merged together. There will be no `filepath` module anymore.

2. Some APIs have been removed.

    - From `filepath` - `extension`, `getPathSeparator`, `getPathListSeparator`, `isReserved`, and `matches`
    - From `file` - `exists`, `tempDir`

3. The implementation of some APIs has been modified.

    - From `filepath` - `normalize`
    - From `file` - `createDir`, `remove`, `copy`, `readDir`, `getMetaData` (earlier `getFileInfo`)

4. Some new APIs have been introduced.

    - `createTemp` - to create a temporary file in either the default `temp` directory of the OS or in a specific directory.
    - `createTempDir` - to create a temporary directory as above.
    - `test` - checks if a file/directory exists, readable, writable, etc.

##### Improved `io` module

The new high-level APIs below were introduced to provide I/O operations.

1. Added a new set of APIs to read from files supporting different data types.
    
    E.g., `io:fileReadBytes`, `io:fileReadJson`, `io:fileReadCsv`, and `io:fileReadXml`

2. Added a new set of APIs to read files as streams.
    
    E.g., `io:fileReadBlocksAsStream`, `io:fileReadLinesAsStream`, and `io:fileReadCsvAsStream`

#### Language server

1. Introduced a new code-action `Add Type Cast` to add a typecast when variable assignment fails due to incompatible types.

    **Before execution:**
    ```ballerina
    int myInt = 1.1;
    int myInt = getFloat();
    ```

    **After execution:**
    ```ballerina
    int myInt = <int>1.1;
    int myInt = <int>getFloat();
    ```

2. The code-action extension APIs have been revamped in this release. A summarized list of changes is as follows.

    - The `MatchedNode`, `matchedSymbol`, and `matchedExprType` for the cursor position are available now through the `PositionDetails` construct in the `CodeActionContext`.
    - Listing the priorities can be set for the code-actions now (lower the number, greater the priority).

#### Code to Cloud

1. Introduced code to cloud (c2c) to simplify the experience of developing and deploying Ballerina code in the cloud. Code to cloud builds the containers and required artifacts by deriving the required values from the code without using any annotations.

    ```ballerina
    import ballerina/http;
    import ballerina/c2c as _;

    service hello on new http:Listener(9090) {
        resource function sayHello(http:Caller caller, http:Request req) returns error? {
            check caller->respond("Hello, World!");
        }
    }
    ```

2. Removed the Kubernetes module and replaced it by the `c2c` module.

#### Breaking changes

1. It is no longer possible to specify the version in an import declaration. A specific version can be imported by specifying the package dependency along with the version in the `Ballerina.toml` file.

    ```toml
    [[dependency]]
    org = "ballerina"
    name = "stringutils"
    version = "0.5.2"
    ```

2. As the initial step of upcoming changes for the error detail, the detail type descriptor of an error type descriptor can no longer be a closed record.

3. The Kubernetes module is removed and replaced by the `c2c` module.
