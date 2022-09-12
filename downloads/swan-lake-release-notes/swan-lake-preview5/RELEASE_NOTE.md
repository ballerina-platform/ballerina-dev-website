---
layout: ballerina-left-nav-release-notes
title: Swan Lake Preview 5
permalink: /downloads/swan-lake-release-notes/swan-lake-preview5/
active: swan-lake-preview5
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-preview5
---
### Overview of Ballerina Swan Lake Preview 5 

This release is the fifth preview version of Ballerina Swan Lake. This release includes a new set of language features along with improvements and bug fixes to the compiler, runtime, standard libraries, and developer tooling.

- [Updating Ballerina](#updating-ballerina)
    - [For existing users](#for-existing-users)
    - [For new users](#for-new-users)
- [Highlights](#highlights)
- [What is new in Ballerina Swan Lake Preview 5](#what-is-new-in-ballerina-swan-lake-preview-5)
    - [Language](#language)
        - [Isolated objects](#isolated-objects)
        - [Lang lib functions to replace XML functional constructors](#lang-lib-functions-to-replace-xml-functional-constructors)
        - [Unified object method scope and object field scope](#unified-object-method-scope-and-object-field-scope)
        - [Improved lang library functions](#improved-lang-library-functions)
    - [Runtime](#runtime)
    - [Standard Library](#standard-library)
        - [HTTP client remote method API improvement with data-binding support](#http-client-remote-method-api-improvement-with-data-binding-support)
        - [SQL procedure call API improvement](#sql-procedure-call-api-improvement)
        - [Misfire policy support for tasks](#misfire-policy-support-for-tasks)
    - [Developer Tools](#developer-tools)
        - [Code formatting](#code-formatting)
- [Known Issues](#known-issues)

### Updating Ballerina

You can use the update tool to update to Ballerina Swan Lake Preview 5 as follows.

#### For existing users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](http://ballerina.io/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 5.

 > `ballerina dist pull slp5`                 

However, if you are using a Ballerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

#### For new users

If you have not installed Ballerina, then download the [installers](https://ballerina.io/downloads/) to install.

### Highlights

- Migration from JDK 8 to JDK 11
- Introduction of isolated objects for class definitions or object-type descriptors
- Replacement of XML functional constructors by lang lib functions
- Unification of the object field scope and object method scope into a single scope
- Ability to assign a simple JSON value to a variable of the same type without casting
- Improvements to the lang library functions
- Improved HTTP client remote method API with data-binding support
- Improved SQL procedure call API 
- Misfire policy support for tasks
- Improved code formatting support for all the language features

### What is new in Ballerina Swan Lake Preview 5

#### Language

##### Isolated objects

A class definition or an object-type descriptor can now be marked as `isolated`. All fields of an `isolated` object that are not `final` or are not a subtype of `readonly` or `isolated object {}` have to be `private` fields.

The methods of an `isolated` object that access such fields can only refer to `self` within a `lock` statement, which ensures that there is no data race in accessing mutable state. If a method accesses such a field, additional rules apply to how values are transferred in and out in order to ensure that there are no references into the object’s mutable storage except via isolated objects. The initial value expressions of the fields also need to ensure the same.

```ballerina
type Coordinates record {|
    int latitude;
    int longitude;
|};

isolated class Hotels {

    private map<Coordinates> hotels = {};

    isolated function add(string name, Coordinates coordinates) {
        lock {
            self.hotels[name] = coordinates.clone();
        }
    }

    isolated function getCoordinates() returns map<Coordinates> {
        lock {
            return self.hotels.clone();
        }
    }
}
```

An `isolated` function can also access a `final` variable if the type of the variable is a subtype of `isolated object {}`.

```ballerina
final Hotels hotels = new;

isolated function getCoordinates() returns Coordinates[] => hotels.getCoordinates().toArray();
```

##### Lang lib functions to replace XML functional constructors

XML functional constructor syntax has been removed. In place of XML functional constructors, `'xml:createXXX` functions should be used. 

**Disallowed syntax**
```ballerina
'xml:Element element = 'xml:Element("elem");
'xml:Comment comment = 'xml:Comment("comment content");
'xml:ProcessingInstruction proceInstruc = 'xml:ProcessingInstruction("DONOT", "print this");
'xml:Text text = 'xml:Text("this is a character sequence");
```

**Valid syntax**
```ballerina
'xml:Element element = 'xml:createElement("elem");
'xml:Comment comment = 'xml:createComment("comment content");
'xml:ProcessingInstruction proceInstruc = 'xml:createProcessingInstruction("DONOT", "print this");
'xml:Text text = 'xml:createText("this is a character sequence");
```

##### Unified object method scope and object field scope 

Object field scope and object method scope have been unified into a single scope. This means that it is no longer possible to have fields and methods with the same name.

With this change, object methods can be accessed similar to object fields and the reference to `self` is captured in the resulting function pointer.

```ballerina
class Accumulator {
    int i;

    function init(int i) {
        self.i = i;
    }

    function accumulate(int acc) {
        self.i = self.i + acc;
    }

    function get() returns int {
        return self.i;
    }
}

public function main() {
    Accumulator accumulator = new(0);
    var acc = accumulator.accumulate; // access a method as a field
    var getVal = accumulator.get;
    acc(1); // similar to calling accumulator.accumulate(1);
    acc(2);
    int val = getVal();
}
```

###### Improvement in accessing simple values in a JSON

A non-structural value (i.e., simple value) in a JSON object can now be directly assigned to a variable of the same type without casting.

For this, the field access expression should be used with the `check` expression. The simple value should belong to one of the types: `()`, `int`, `float`, `decimal`, `string`, or  `boolean`.

```ballerina
public function main() returns error? {
    json j1 = {name: "Anne", age: 20, marks: {math: 90, language: 95}};
    string name = check j1.name;
    int age = check j1.age;
}
```

##### Improved lang library functions

Several changes and improvements have been introduced to the `ballerina/lang.value` lang library module.

###### New `ensureType` function

This method can be used to check if a value belongs to the given type similar to the type cast expression. However, instead of panicking, this method returns an error if the type test fails.

###### New `toBalString()` and `fromBalstring()` functions

Two new functions namely `toBalString()` and `fromBalstring()` have been introduced to roundtrip between `anydata` and Ballerina expression-like `string`. The `toBalString()` function converts a Ballerina value to a `string` that looks like a Ballerina expression (expression style). 

The `fromBalstring()` function parses and evaluates a `string` produced by `toBalString()` when applied to an `anydata` value. The details of the conversion performed in `toBalString()` are specified by the `ToString` abstract operation defined in the Ballerina Language Specification using the expression style.

###### More `isolated` lang library functions

These include lang library functions that accept an argument of a `function` type. With these functions, a parameter, which is of a `function` type may be annotated with the `@isolatedParam` annotation. 

```ballerina
public isolated function forEach(Type[] arr, @isolatedParam function(Type val) returns () func) returns () = external;
``` 

When such a function is called in a context where an `isolated` call is expected, the argument passed for a parameter that is annotated with `@isolatedParam` should also be an `isolated` function.

```ballerina
int total = 0;

function sum(int i) {
    total += i;
}

isolated function validate(int i) {
    if i > 100 {
        panic error(string `Invalid Value: ${i}`);
    }
}

function arraySum() {
    int[] x = [1, 2, 3];

    // Since `arraySum` is not `isolated`, non-isolated 
    // function `sum` can be passed as the argument.
    x.forEach(sum);
}

isolated function validateArray() {
    int[] x = [1, 2, 3];

    // Since `validateArray` is `isolated`, the argument 
    // should also be an `isolated` function.
    x.forEach(validate);
}
```

#### Runtime

The Ballerina runtime Java API package name has been changed from `org.ballerinalang.jvm` to `io.ballerina.runtime`. A new `io.ballerina.api.TypeCreator` API is introduced to create Ballerina types at runtime.

#### Standard library

##### HTTP client remote method API improvement with data-binding support

Response payload binding functionality is provided for an HTTP client by returning the payload according to the `targetType` defaultable parameter that is mentioned in the remote method.

**Previous syntax:**
```ballerina
http:Response|error res = clientEP->post("/path", req);
```

**New syntax:**
```ballerina
http:Response|http:Payload|error res = clientEP->post("/path", req, json);
// or
json payload = <json> check clientEP->post("/path", req, json);
```

##### SQL procedure call API improvement

The SQL data type of the `Out` Parameter can now be defined in the SQL procedure call API, thus, eliminating the use of metadata to configure `Out` Parameter types.

**Previous syntax:**
```ballerina
sql:OutParameter filterId = new;
```

**New syntax**
```ballerina
sql:IntegerOutParameter filterId = new;
```

##### Misfire policy support for tasks

The task module now supports the misfire policy. A new `misfirePolicy` field has been introduced in the `task:TimerConfiguration` and `task:AppointmentConfiguration` to specify the policy.

#### Developer tools

##### Code formatting

Improved formatting support for all the language features. The new formatter also supports:

- Range formatting
- Line wrapping

#### Known issues

- The [WebSub](https://docs.central.ballerina.io/ballerina/websub/latest/) standard library module (ballerina/websub) is not working with Swan Lake Preview 5.
- The [Socket](https://docs.central.ballerina.io/) standard library module (ballerina/socket) can only be built offline (i.e., with the `--offline` parameter) with Swan Lake Preview 5.
