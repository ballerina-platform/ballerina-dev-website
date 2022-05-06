---
layout: ballerina-left-nav-release-notes
title: Swan Lake Preview 4
permalink: /downloads/swan-lake-release-notes/swan-lake-preview4/
active: swan-lake-preview4
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-preview4
---
### Overview of Ballerina Swan Lake Preview 4 

This release is the fourth preview version of Ballerina Swan Lake. This release includes a new set of language features along with improvements and bug fixes to the compiler, runtime, standard libraries, and developer tooling.

- [Updating Ballerina](#updating-ballerina)
    - [For existing users](#for-existing-users)
    - [For new users](#for-new-users)
- [Highlights](#highlights)
- [What is new in Ballerina Swan Lake Preview 4](#what-is-new-in-ballerina-swan-lake-preview-4)
    - [Language](#language)
        - [Class definitions](#class-definitions)
        - [Object-constructor expressions](#object-constructor-expressions)
        - [Distinct objects](#distinct-objects)
        - [Final fields in objects](#final-fields-in-objects)
        - [Isolated functions](#isolated-functions)
        - [Improved support for quoted identifiers](#improved-support-for-quoted-identifiers)
        -  [Subsequent initialization support for local final variables](#subsequent-initialization-support-for-local-final-variables)
        - [Handle errors at a single point](#handle-errors-at-a-single-point)
        - [The `fail` statement](#the-fail-statement)
        - [Predeclared module prefixes](#predeclared-module-prefixes)
        - [Improved lang library functions](#improved-lang-library-functions)
    - [Runtime](#runtime)
        - [jBallerina runtime APIs](#jballerina-runtime-apis)
        - [Asynchronous Java interoperability](#asynchronous-java-interoperability)
    - [Standard library](#standard-library)
    - [Developer tools](#developer-tools)
        - [The OpenAPI tool](#the-openapi-tool)
        - [Improvements related to code actions](#improvements-related-to-code-actions)
        - [Code formatting](#code-formatting)

### Updating Ballerina

You can use the update tool to update to Ballerina Swan Lake Preview 4 as follows.

#### For existing users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](http://ballerina.io/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 4.

 > `ballerina dist pull slp4`                  

However, if you are using a Ballerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

#### For new users

If you have not installed Ballerina, then download the [installers](https://ballerina.io/downloads/) to install.

### Highlights

- Revised Ballerina object syntax, which differentiates the object type from the `class`, from which you can create object values. 
- Introducing `isolated` functions to achieve concurrency safety together with `readonly` values.  
- Introducing `distinct` object types offering the functionality similar to what is  provided in nominal type systems.
- Improvements to quoted identifiers to support arbitrary, non-empty strings as Ballerina identifiers.

### What is new in Ballerina Swan Lake Preview 4

#### Language

The language implementation is based on the [Ballerina Language Specifications Draft 2020-09-22](https://ballerina.io/spec/lang/draft/v2020-09-22/) and the new [Transactions proposal](https://github.com/ballerina-platform/ballerina-spec/blob/master/lang/proposals/transaction/transaction.md).

##### Class definitions

###### Module-class definitions

With the introduction of module-class definitions, the type of the object and the implementation of the behavior of the object are separated. Module-class definitions describe both the type of the object and the behavior of that object whereas object-type definitions describe only the type of the object. 

The `abstract` objects are now plain object-type definitions and the previous object-type definitions with implementations are now module-class definitions.

To migrate existing code easily, you can abstract this change by simply replacing `type Obj object {...};` with `class Obj {...}`.

**Previous syntax:**

```ballerina
public type Obj object {
    int i;
    function init(int i) {
        self.i = i;
    }
};
```

**New syntax:**

```ballerina
public class Obj {
    int i;
    function init(int i) {
        self.i = i;
    }
}
```

###### Object-type descriptor

Object-type descriptors can be used to describe an object type. 

>**Note:** They cannot be used to create object values. 

Similar to the previous `abstract object`, object-type definitions no longer support specifying the default values for fields.

To migrate existing abstract object-type definitions, you can simply remove the `abstract` keyword from the type definition.

**Previous syntax:**

```ballerina
type Obj abstract object {
    function foo(int i);
};
```

**New syntax:**

```ballerina
type Obj object {
    function foo(int i);
};
```

##### Object-constructor expressions

Object-constructor expressions can be used to define an object inline as opposed to referring to a pre-defined class with a `new` expression. The parameter list of an `init` method within an object constructor expression must be empty.

```Ballerina
public function main() {
    var ob = object { 
        function foo() { 
            // do something 
        }
    };
}
```

Object-constructor expressions also support a type reference in which the referenced type is included in the object type in the same way as in an object-type inclusion.

```ballerina
class RefClass {
    int x;
    function init(int y) {
        self.x = y;
    }
}

var objectValue = object RefClass { 
    function init() {
        self.x = 4;
    }
};
```

##### Distinct objects

This release adds support for defining `distinct` object types. This provides a way to achieve an effect similar to nominal typing for objects within the Ballerina structural type system.

```ballerina
distinct class Student {
    function getKind() returns string {
        return "Student";
    }
}

distinct class Employee {
    function getKind() returns string {
        return "Employee";
    }
}

Student p = new ();
Employee q = p; // error: incompatible types: expected 'Employee', found 'Student'
// Sub-typing relationship is indicated by type inclusion of `Employee`.
distinct class Manager {
    *Employee;
    function getKind() returns string {
        return "Manager";
    }
}

Manager r = new ();
Employee s = r; // This is allowed since ‘Manager’ is a distinct subtype of ‘Employee’

```

##### Final fields in objects

Classes and object-constructor expressions can define fields as `final` fields. A value can only be assigned to such a field during the object construction (i.e., via an initializer expression or in the `init` method). A `final` field of an object cannot be assigned a new value once the object is created.

```ballerina
class Controller {
    final string id = "default";
    final map<decimal> config;
    int priority;

    function init(map<decimal> config, int priority) {
        self.config = config;
        self.priority = priority;
    }
}
```

>**Note:** Objects no longer allow `read-only` fields. 

##### Isolated functions

A function that accesses mutable values only via its parameters can now be marked as an `isolated` function. Concurrency safety can be guaranteed when `isolated` functions are used with immutable values or by controlling the arguments passed to the `isolated` function.

```ballerina
isolated function addSum(int[] arr, int i, int j) {
    arr.push(i + j);
}
```

A function can be marked as `isolated` if it
- accesses the global state only if it is immutable (i.e., variables that are implicitly or explicitly `final` and the type is a subtype of `readonly` (immutable values)) 
- calls a function or a method only if that function or method is `isolated`
- does not start new workers

##### Improved support for quoted identifiers

The quoted identifier feature has been improved by adding the support for extending the types of the characters that are allowed. This adds the possibility of using arbitrary, non-empty strings as identifiers. The quoted identifiers can be used with a `’` prefix and the following supported character sets.

- Alphanumeric characters
- Underscore
- ASCII special characters with a preceding `\` escape character
- The JVM-reserved character set is now supported by Ballerina through an encoding scheme
- Unicode characters 
- Characters specified with hexadecimal Unicode code points (e.g., ` \u{1234}`)

```ballerina
// Quoted identifiers in type names and field names.
type 'Person_\{name\&ĀǤȆ\} record {|
    string 'first\ name;
    int 'ĀǤȆ;
|};

// Quoted identifiers in function names.
function 'get_ɱȅșșȧǧȅ_with\#(int value) returns string {
    return value.toString() + " is numeric value";
}

public function main() {
    'Person_\{name\&ĀǤȆ\} person = {'first\ name: "John",  'ĀǤȆ: 25};

    string message = 'get_ɱȅșșȧǧȅ_with\#(5);

    // Quoted identifiers with hexadecimal code points.
    string 'unicode_\u{2324} = "John Doe";
}
```

##### Subsequent initialization support for local final variables

Local final variables can now be defined without an initializer expression as long as they are initialized before they are referenced, similar to ordinary local variables. However, a value cannot be assigned to a `final` variable more than once.

```ballerina
map<int> lengths = {};

function addLength(string key, string|string[] value) {
    final int length;

    if value is string {
        length = value.length();
    } else if value.length() == 0 {
        length = 0;
    } else {
        length = value[0].length();
    }

    lengths[key] = length;
}
```

##### Handle errors at a single point
Ballerina supports handling errors at a single place using the `on fail` clause. The `on fail` clause can be used optionally with statements such as `while`, `foreach`, `do`, `transaction`, `retry`, `lock`, and `match`. 

```ballerina
    do {
        int parsedNum = check parse("12");

        // Parsing a random string will return an error. 
        // Thereafter, the control is transferred to the `on fail` clause.
        int parsedStr = check parse("invalid");

        var res = commit;
    } on fail error e {
        io:println("Error occurred during parsing: ", e.message());
    }

```

##### The `fail` statement

Executing a `fail` Statement will cause the control flow to transfer to the `on fail` clause of the nearest lexically-enclosing statement that has an `on fail` clause. If there is no `on fail` clause, then it breaks the current execution and returns an error.

```ballerina
    do {
        if (accountID < 0) {
            InvalidAccountIDError invalidAccountIdError = 
                InvalidAccountIDError(INVALID_ACCOUNT_ID, accountID = accountID);
            fail invalidAccountIdError;
        } else if (accountID > 100) {             
            AccountNotFoundError accountNotFoundError = 
                AccountNotFoundError(ACCOUNT_NOT_FOUND, accountID = accountID);
            fail accountNotFoundError;
        }
    // The type of `e` should be the union of the error types that could
    // result in transferring control from the `do` statement.
    } on fail InvalidAccountIDError|AccountNotFoundError e {
        io:println("Error occurred: ", e.message(),", Account ID: ", e.detail()["accountID"]);
    }
```

##### Predeclared module prefixes

The module prefix `t` (which could be `boolean`, `decimal`, `error`, `float`, `future`, `int`, `map`, `object`, `stream`, `string`, `table`, `typedesc`, or `xml`) has been predeclared as referring to the `lang.t` lang library module now.

Such modules can now be used without explicitly importing them.

```ballerina
public function main() {
    int max = 'int:max(311, 22, 41234);
}
```

##### Improved lang library functions

Several changes and improvements have been introduced to the `ballerina/lang.value` and `ballerina/lang.array` lang library modules. 

###### Improved lang library support for JSON

Two new functions (i.e., `fromJsonDecimalString()` and `fromJsonFloatString()`) have been introduced to support different numeric types when converting (parsing) a `string` as `json`. The `fromJsonDecimalString()` function converts numeric values to `decimal` whereas the `fromJsonFloatString()` function converts them to `float`.

The `fromJsonString()` function now converts numeric values as follows. 

If the numeric value starts with the negative sign (`-`) and is numerically equal to zero (0), it is converted to `float`  `-0.0`. If the numeric value is syntactically an integer, it is converted to an `int` value. All other numeric values are converted to `decimal` values.

###### Changes to `toString()`

The `toString()` function now performs a direct conversion of the value to a string rather than producing a string that describes the value. The details of the conversion are specified by the `ToString` abstract operation defined in the Ballerina Language Specification using the direct style.

If a `student` is a record value defined as follows,

```ballerina
Student student = {
   name : "Anne",
   address : (),
   age : 23,
   grades : ["A", "A+", "B"]
};
```

evaluating `student.toString()` results in a different output as follows.

**Previous result:**

```bash
name=Anne address= age=23 grades=A A+ B
```

**New result:**

```bash
{"name":"Anne","address":null,"age":23,"grades":["A","A+","B"]}
```

###### Improved `lang.array:sort()` function

This release supports an improved `ballerina/lang.array:sort()` function. Now, you can specify the `direction` in which the sorting should be done and a `key` function, which returns a value that is used to order the members when sorting. 

The `sort()` function returns an array consisting of the members of the original array in the sorted order. If the member type of the array is not ordered, then the key function must be specified. 

```ballerina
string[] cars = ["Ford", "Toyota", "Mitsubishi", "BMW", "Tesla"];
string[] sortedCars = cars.sort(array:DESCENDING, car => car.length());
```

#### Runtime

##### jBallerina runtime APIs

The jBallerina runtime APIs were moved to the `org.ballerinalang.jvm.api` package and new APIs were introduced. The following APIs can be used to manage various runtime constructs.

| Class         | Usage |
|---------------|--------------------|
| BValueCreator | Create ballerina value instances.|
| BErrorCreator | Create ballerina error instances.|
| BExecutor | The entry point from the server connector side to the Ballerina side.  After finding the resource, server connector implementations can use this API to invoke the Ballerina engine.|
| BRuntime     | The external API to be used by the interop users to control the Ballerina runtime behavior.|
| BStringUtils  | Common utility methods used for string manipulation.|

##### Asynchronous Java interoperability 

Calling async Java methods from Ballerina has been formalized using a new API. Previously, this was achieved by setting internal values to the Ballerina `Strand` object. With this change, any Java extern method accepting `BalEnv` as the first parameter, will be given an instance of the execution context. 

The `BalEnv` execution context instance provides a `markAsync` method, which will mark the current Java method as asynchronous making the Ballerina runtime wait on it in a non-blocking way.

##### Ballerina Intermediate Representation (BIR) optimizations and improvements

The BIR has been optimized to reuse temporary variables inside Ballerina functions. This reduces the number of instructions in the byte-code representation contributing to reductions in method sizes and slightly-better runtime performance.

Also, The BIR binary format is now represented in a structured form using the [Kaitai Struct Language](https://doc.kaitai.io/user_guide.html). Kaitai Struct Language is a commonly-used approach to define binary formats. With the structured format, the BIR now can be easily understood and validated, which will help any user who wants to understand and work on generating different target executable code (e.g., generating LLVM-based executable code by reading the BIR). 

The BIR binary structure is represented as the [Kaitai Structure](https://github.com/ballerina-platform/ballerina-lang/blob/master/docs/bir-spec/src/main/resources/kaitai/bir.ksy).

The BIR is now improved by including local variable scope information. With this support, the debugging view of local variables within functions has been improved to show correct-scoped variables during the debugging sessions. 

Along with the scoping, BIR now contains a new variable kind named `SYNTHETIC`, which identifies the variables generated at the de-sugar phase. These are skipped when adding meta-data so that generated variables do not appear in the scope with a debug hit.

#### Standard library

Re-align organization names of the connectors. 

|Modules|Old Organisation|New Organisation|
|:---:|:---:|:---:|
|mysql| ballerina/mysql| ballerinax/mysql|
|kafka| ballerina/kafka| ballerinax/kafka|
|rabbitmq| ballerina/rabbitmq| ballerinax/rabbitmq|
|nats| ballerina/nats| ballerinax/nats|

#### Developer tools

##### The OpenAPI tool

###### OpenAPI CLI

The behavior of the OpenAPI CLI command was changed to make it easier to use. Now, you can generate Ballerina code from an OpenAPI contract and vice versa.

###### OpenAPI to Ballerina

```bash
$  ballerina openapi -i <contract>  -o <output path>
```

- You can give the contract file in the YAML or JSON format.
- The above command generates both the service and client stubs.
- The command will give an output of three files containing the service, client and schema.

**Command output example:**

``` bash
$ ballerina openapi -i petstore.yaml  
The service generation process is complete. The following files were created.
-- petstore-service.bal
-- petstore-client.bal
-- schema.bal
```

- If you are interested in creating only a service, you can use the `mode` option to give the required mode. The `mode` can be a service or a client.

```bash
$  ballerina openapi -i <contract> --mode (service | client ) -o <output Path>
```

- You can specify the output path with the `-o` option.

```bash
$  ballerina openapi -i <contract> --service-name <service name> -o <output Path>
```

- If you are interested in creating a service with resources having a specific tag or an `operationId`, you can do the following.

```bash
$  ballerina openapi -i <contract> --tags <tags> -o <output Path>
$  ballerina openapi -i <contract> --operations <operationIds> -o <output Path>
```

###### Ballerina to OpenAPI

```bash
$  ballerina openapi -i <ballerina service file>   -o <output path> 
```

The service name is not mandatory and you can give the service name if you want to document a specific service. Otherwise, it will generate all the services that are included in the Ballerina source file.


```bash
$  ballerina openapi -i <ballerina service file>  --service <service Name> -o <output path>
```

##### Improvements related to code actions

###### Azure Functions

Fix for [Pure HTTP Functions Not Working](https://github.com/ballerina-platform/module-ballerinax-azure.functions/issues/33).

###### AWS Lambda

Added domain-specific event types support.

##### Code formatting

A new formatter is introduced with a limited support for language features.
