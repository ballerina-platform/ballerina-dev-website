---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta4
permalink: /downloads/swan-lake-release-notes/swan-lake-beta4/
active: swan-lake-beta4
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta4
---
## Overview of Ballerina Swan Lake Beta4

<em>This is the fourth Beta release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Beta3 release.

## Updating Ballerina

If you are already using Ballerina, you can use the [update tool](/learn/cli-documentation/update-tool/) to directly update to Ballerina Swan Lake Beta4 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **update tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Beta4.

> `bal dist pull slbeta4`

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

#### Support for numeric operations with operands of optional numeric types

Updated unary expressions (`+`, `-`, and `~`), multiplicative expressions, additive expressions, shift expressions, and binary bitwise expressions to be used with operands of optional numeric types. If the static type of an operand is an optional numeric type, the static type of the result will also be an optional numeric type.

The examples below are allowed now.

```ballerina
import ballerina/io;

public function main() {
    int? a = 10;
    int? b = 5;
    int? c = ();

    int? d = a + b;
    io:println(d is ()); // Prints `false`.
    io:println(d); // Prints `15`.

    int? e = a - c;
    io:println(e is ()); // Prints `true`.

    // Also allowed.
    int? f = a * b;
    int? g = a << c;
    int? h = a & b;
    int? i = -a;
    int? j = +c; // The result is `()`.
}
```

#### Support for accessing optional fields of a record using field access

Updated optional fields of records, which are of types that do not include nil to be accessed using field access expressions.

```ballerina
type Employee record {
    string name;
    int id?;
    string? department?;
};

public function main() {
    Employee employee = {
        name: "John",
        department: "finance"
    };
    int? id = employee.id;
}
```

However, the below is still not allowed since the field's type includes nil.

```ballerina
string? department = employee.department; // Error.
```

If the static type of the expression on which the access is done is a non-lax union type, field access is allowed only if it is a union of record types and
- each member of the union has a required field with the specific field name or
- each member of the union has either a required field or an optional field with the specific field name, and the type of the field in each record type does not include nil

```ballerina
type Employee record {|
    string name;
    string? dob;
    float salary?;
|};

type Person record {|
    string name?;
    string dob?;
|};

public function main() {
    Employee|Person val = <Person> {
        name: "Jo",
        dob: "1990-01-10"
    };

    // This is allowed now since `name` is an optional field in `Person`
    // and a required field in `Employee`, and the type of the field is `string` 
    // in both records and does not include nil.
    string? _ = val.name;

    // This is not allowed even though `dob` is an optional field in `Person`
    // and a required field in `Employee`, since the type of `dob` in `Employee`, `string?`,
    // includes nil.
    string? _ = val.dob;

    // This is not allowed since `salary` is neither a required field nor an optional 
    // field in `Person`.
    float? _ = val.salary;
}
```

### Improvements

#### Restrictions when calling a function or a method in a match guard

Introduced restrictions for when a function or a method is called in a match guard to ensure that the match guard does not mutate the value being matched.

A function or method call is allowed now in a match guard only if it meets one of the conditions below.
- the type of the expression following `match` is a subtype of `readonly` or
- the function/method is `isolated` and the types of any and all arguments are subtypes of `readonly`

The below will now result in compilation errors.

```ballerina
type Data record {
    string name;
    boolean valid;
    int id?;
    decimal price?;
};

public function main() {
    Data data = {name: "Jo", valid: false};
    [int, decimal] currentValues = [1234, 20.5];

    match data {
        var {id, price} => {
        }
        // Now, this results in compilation errors for the match guard since neither the type of the 
        // matched expression nor the types of the arguments are subtypes of `readonly`.
        var {name} if stillValid(data, currentValues) => {
        }
    }
}

isolated function stillValid(Data data, [int, decimal] values) returns boolean {
    // ...
    data.id = values[0];
    data.price = values[1];
    return false;
}
```

#### Improved support for unreachability

Improved the unreachability analysis of `if-else` statements and `while` statements. Constant conditions that are known to be either true or false at compile-time are now considered in the unreachability analysis.

The conditions below are taken into consideration in the analysis of unreachability.

1. If a statement block is unreachable, then every statement in it is unreachable.
2. The `if` statements with constant conditions are not errors except `insofar` as they lead to statements being unreachable.
3. An `is` expression is constantly `true` if the static type of the expression is a subtype of the type against which the check is done. 
4. Calling a function with a return type of `never` cannot complete normally making subsequent code unreachable.

```ballerina
import ballerina/io;

function fn1() {
    if false {
        io:println("unreachable"); // This will now result in a compilation error: unreachable code.
    }

    while false {
        io:println("unreachable"); // This will now result in a compilation error: unreachable code.
    }
}

function fn2() {
    if true {
        io:println("reachable");
    } else {
        io:println("unreachable"); // This will now result in a compilation error: unreachable code.
    }
}

function fn3() {
    if true {
        return;
    }
    io:println("unreachable"); // This will now result in a compilation error: unreachable code.
}

function fn4() {
    while true {
        return;
    }
    io:println("unreachable"); // This will now result in a compilation error: unreachable code.
}
```

The below is another example.

```ballerina
enum E {
    X,
    Y,
    Z
}

function fn1(E e) {
    if e is X {
        doX();
    } else if e is Y {
        doY();
    } else if e is Z {
        doZ();
    } else {
        // Any statement in this block will now be unreachable.
    }
}

function fn2(E e) {
    if e is X {
        doX();
    } else if e is Y {
        doY();
    } else if e is Z {
        doZ();
    } else if e is Y {
        // Any statement in this block will now be unreachable.
    }
}

function fn3(E e) returns int {
    if e is X {
        return 1;
    }
    if e is Y {
        return 2;
    }
    if e is Z {
        return 3;
    }
    // Any statement here will now be unreachable.
}
```

#### Type narrowing following an `if` statement without an `else` block if the `if` statement block cannot complete normally

Narrowed the types following an `if` statement without an `else` block, if the `if` statement block cannot complete normally by building on the improvements introduced to the unreachabillity analysis.

```ballerina
function populate(int[] arr, string str) returns error? {
    int|error res = int:fromString(str);

    if res is error {
        return error("Invalid Value", res);
    }

    // The type of `res` is now narrowed to `int` here.
    // The variable `res` can be used as an `int` and can therefore be used in an `array:push` call with an `int[]`.
    arr.push(res);
}
```

This narrowing may lead to other compilation errors since the static type of the variable will now be a narrowed type.

```ballerina
function populate(int[] arr, string str) returns error? {
    int|error res = int:fromString(str);

    if res is error {
        return error("Invalid Value", res);
    }

    // This was previously allowed but now a compilation error since `res`'s type is now `int` and doesn't include `error`.
    int intRes = check res;

    arr.push(intRes);
}
```

#### Restrictions on assignments to narrowed variables within loops

Stopped the possibility to assign a value to a variable that was narrowed outside the statement within a `while` statement or a `foreach` statement. Unless the loop terminates after the assignment (i.e., at the end of the loop body and at every `continue` statement), there must be no possibility that a narrowed variable to be assigned.

The example below which previously resulted in a runtime panic will now result in a compilation error.

```ballerina
function validate(int?[] arr) returns boolean {
    int? value = let int length = arr.length()
        in length > 0 ? length : ();

    if value is int {
        foreach int? item in arr {
            int currentValue = value;

            if item is () {
                value = (); // Error: invalid attempt to assign a value to a variable narrowed outside the loop.
                continue;
            }

            return item < value;
        }
    }

    return false;
}

public function main() {
    boolean validationRes = validate([(), 2, 1]);
}
```

#### Change in expected return statements in a function with an optional type as the return type

Updated a function having an optional type that is not a subtype of `error?` as the return type to explicitly return a value. A warning is emitted when such a function does not explicitly return a value and falls off at the end of the function body. 

```ballerina
function parse(string str) returns int? { // Now, results in a warning. 
    int|error a = int:fromString(str);
    if a is int {
        return a;
    }
}
```

### Bug fixes and breaking changes

- Disallowed the trailing dot format of the floating-point literal to avoid lexical ambiguity.

    ```ballerina
    // The below are now disallowed.
    decimal d1 = 2.;
    decimal d2 = 2.d;
    decimal d3 = 2.D;
    decimal d4 = 2.e12;
    float f1 = 2.f;
    float f2 = 2.F;
    float f3 = 0x1A.;
    float f4 = 0x1A.p4;

    // The below can be used instead.
    decimal d11 = 2.0;
    decimal d12 = 2.0d;
    decimal d13 = 2.0D;
    decimal d14 = 2.0e12;
    float f11 = 2.0f;
    float f12 = 2.0F;
    float f13 = 0x1A.0;
    float f14 = 0x1A.0p4;
    ```

- Disallowed intervening white spaces in the qualified identifier to avoid a parsing ambiguity between the ternary conditional expression and qualified identifier.
  
    ```ballerina
    import ballerina/io;

    public function main() {
        io:print("Ballerina"); // Valid.
        io : print("Ballerina"); // Compilation error: intervening whitespaces are not allowed in a qualified identifier.
    }
    ```

    With this, `x ? a : b:c` will now be parsed as `x ? a : (b:c)` since the colon with spaces is interpreted only as part of a conditional expression.

- Fixed a bug that resulted in hash collisions not being handled correctly in `table` values.

    ```ballerina
    import ballerina/io;
    
    public function main() {
        table<record {readonly int? k;}> key(k) t = table [];
        t.add({k: 0});
        io:println(t.hasKey(()));
    }
    ```

    The above code snippet, which previously printed `true` will now print `false`.

- Disallowed object type inclusions with an object that has private fields or members.

    ```ballerina
    class Person {
        string firstName;
        string lastName;
        private string dob;

        function init(string firstName, string lastName, string dob) {
            self.firstName = firstName;
            self.lastName = lastName;
            self.dob = dob;
        }

        private function getName() returns string => self.firstName + self.lastName;
    }
    
    class Employee {
        *Person; // Will now result in an error.
        int id;

        function init(string firstName, string lastName, string dob, int id) {
            self.firstName = firstName;
            self.lastName = lastName;
            self.dob = dob;       
            self.id = id;
        }

        private function getName() returns string => self.firstName;	
    }
    ```

- Fixed a bug that resulted in compilation errors not being emitted for invalid `xml` template expressions.

    ```ballerina
    xml x = xml `</>`; // Will now result in an error.
    ```

- Fixed a bug that resulted in compilation errors not being emitted for duplicate fields written with escape sequences in the mapping constructor.

    ```ballerina
    map<any> x = {a\\: 454, "a\\": false}; // Will now result in an error.
    ```

- Updated the `xml:createElement` to accept the attribute map as the second argument.

    ```ballerina
    xml:Element jo = xml:createElement("name", {id: "1234"}, xml `Jo`);
    ```

- Updated the `xml:get` function’s return type to return the exact type `T` when the `xml` sequence is of type `xml<T>`.

    ```ballerina
    xml<xml:Element> employees = xml `<e1><name>Jo</name></e1><e2><name>Mary</name></e2>`;
    xml:Element employee1 = employees.get(0);// Allowed now.
    ```

- Updated the `table:map` function’s function argument `func` and the return type to work with subtypes of mapping types instead of any type.

    ```ballerina
    table<record {int id; string name;}> tb = table [
            {id: 1234, name: "Jo"},
            {id: 2345, name: "May"}
        ];

    var idTable = tb.map(function(record {int id; string name;} r) returns int { // No longer allowed.
        return r.id;
    });
    ```

- Corrected a few deviations in the `lang.error` module according to the language specification. The `CallStack` class and `CallStackElement` records have been removed. Now, a stack frame is represented by an `error:StackFrame` object.
	
    Prior to Swan Lake Beta4, the `error:stackTrace()` function returned an `error:CallStack` object which had the structure below which was a deviation from the specification.

    ```ballerina
    public class CallStack {
        public CallStackElement[] callStack = [];
    }
    ```

    This has now been fixed, and it is no longer possible to retrieve an `error:CallStack` object or directly access the `callStack` array as shown below.

    ```ballerina
    error:CallStack callStack = err.stackTrace(); // `CallStack` is undefined.
    error:CallStackElement[] elements = err.stackTrace().callStack; // Not allowed, `CallStackElement` is undefined, no `callStack` field.
    ```

    The `error:stackTrace` function now returns an array of `StackFrame` objects.

    ```ballerina
    public type StackFrame readonly & object {
        public function toString() returns string;
    };
    ```

    ```ballerina
    error:StackFrame[] stackTrace = e.stackTrace(); // Now, returns `error:StackFrame[]`.
    ```

- Made the return type of the `error:detail` function in the `lang.error` module a subtype of `readonly`. It is the intersection of `readonly` and the detail type of the error.

    ```ballerina
    type Detail record {|
        int code;
    |};

    type Error error<Detail>;

    function fn(Error e) {
        Detail & readonly detail = e.detail(); // Allowed now.
    }
    ```

- Fixed a deviation in the `stream:next` function’s stream argument name. The name has been changed from `strm` to `stm`.

- Fixed a bug in `array:sort`, which was sorting the original list. The function now returns a new sorted array. The original array remains unchanged.

- Changed the name of the argument to `transaction:setData()` from `e` to `data`. Moreover, changed the static type of the argument to `transaction:setData()` and the return type of `lang.transaction:getData()` to `readonly`. They were previously of type `(any|error) & readonly` and even this change would accept/return the same set of values.

- Updated the `float:min()` and `float:max()` functions to return `float:NaN` if an argument is `float:NaN`. 

    ```ballerina
    import ballerina/io;

    public function main() {
        float result = float:min(1, float:NaN);
        io:println(result === float:NaN); // Prints `true`.

        result = float:max(5, float:NaN);
        io:println(result === float:NaN); // Prints `true`.
    }
    ```

- Fixed a bug in the `decimal:fromString()` function, which allowed parsing a string that matched the `HexFloatingPointLiteral`. It now returns an error.

    ```ballerina
    import ballerina/io;

    public function main() {
        decimal|error result = decimal:fromString("0xab12"); // Now, returns an error.
        io:println(result is error); // Prints `true`.
    }
    ```

- Fixed a bug in the `float:fromString()` function allowed parsing a string that had matched a `DecimalFloatingPointNumber` with `FloatingPointTypeSuffix`. This will now return an error.

    ```ballerina
    import ballerina/io;

    public function main() {
        float|error result = float:fromString("12.24f"); // Now, returns an error.
        io:println(result is error); // Prints `true`.
    }
    ```

- Updated the `float:fromHexString()` function to return an error if the provided string argument does not match a `HexFloatingPointLiteral`. 

    ```ballerina
    import ballerina/io;

    public function main() {
        float|error result = float:fromHexString("12.3");
        io:println(result is error); // Prints `true`, error message - invalid hex string: ‘12.3’.
    }
    ```

- Fixed a spec deviation in the `int:toHexString`, which was causing it to convert negative values to a positive number before converting to a hexadecimal string.

- Fixed a deviation in the `lang.error` `RetryManager` and `DefaultRetryManager` objects' `shouldRetry` method argument type. The type has been changed from `error?` to `error`.
	
    ```ballerina
    public class CustomRetryManager {
        private int count;
        public function init(int count = 3) {
            self.count = count;
        }
        public function shouldRetry(error e) returns boolean {
            if e is CustomError && self.count > 0 {
                self.count -= 1;
                return true;
            } else {
                return false;
            }
        }
    }
    ```

- Updated the attempting to use an out of range float value where the applicable contextually-expected type is `float` to result in a compile-time error.

    ```ballerina
    public function main() {
        float x = 945e99876; // Will now result in an error.
    }
    ```

- Fixed the spec deviations related to identifying the types of numeric literals. 

    If the numeric literal does not include the float type suffix or the decimal type suffix and if it is not a hex floating-point literal, the type of the numeric literal will be based on the rules below.

    1. If the literal is a floating-point literal, then the possible basic types in order of preference are `[float, decimal]`. Otherwise, they are `[int, float, decimal]`.
    2. If there is a contextually-expected type `C` and there is an intersection between `C` and the possible numeric basic types identified above, use the most preferred such type.
    3. Otherwise, use the most preferred possible basic type.

    ```ballerina
    import ballerina/io;

    type Foo 1f|1d|2d;

    public function main() {
        int|float|decimal l = 10;
        io:println(l is int); // Prints `true`.

        decimal|float m = 5.5;
        io:println(m is float); // Prints `true`.

        int|decimal n = 5.5;
        io:println(n is decimal); // Prints `true`.

        Foo y = 1;
        io:println(y is float); // Prints `true`.
        io:println(y is decimal); // Prints `false`.

        var q = 10;
        io:println(q is int); // Prints `true`.

        var r = 5.5;
        io:println(r is float); // Prints `true`.
    }
    ```

    The example below now results in a compile-time error since the type of the literal is considered to be `float` and `Foo` does not contain `float` `2`.

    ```ballerina
    Foo z = 2; // Now, results in a compile-time error.
    ```


To view bug fixes, see the [GitHub milestone for Swan Lake Beta4](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta4%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

## Runtime updates

### Improvements

#### Improved error messages on a type conversion failure

Updated the detailed error messages to be given on a type conversion failure narrowing down the specific location of errors in the structural types. A maximum number of 20 errors are shown at a time.

For example, the code below 

```ballerina
type Journey record {|
    map<int> destinations;
    boolean[] enjoyable;
    [string, decimal] rating;
|};

type tupleType [Journey, [Journey, map<Journey>], ()[], int...];

public function main() {
    json j = [
        {"destinations": {"Bali": "2", "Hawaii": 3}, "enjoyable": true},
        [
            12,
            {
                "first": {
                    "destinations": {"Bali": true, "Hawaii": "3"},
                    "enjoyable": [1],
                    "rating": [10, 8.5]
                }
            }
        ],
        [null, 0],
        "12345678901234567890123"
    ];
    tupleType val = checkpanic j.cloneWithType();
}
``` 
now gives the error below.

```bash
error: {ballerina/lang.value}ConversionError {"message":"'json[]' value cannot be converted to '[Journey,[Journey,map<Journey>],()[],int...]': 
                missing required field '[0].rating' of type '[string,decimal]' in record 'Journey'
                map field '[0].destinations.Bali' should be of type 'int', found '"2"'
                field '[0].enjoyable' in record 'Journey' should be of type 'boolean[]', found 'true'
                tuple element '[1][0]' should be of type 'Journey', found '12'
                map field '[1][1].first.destinations.Bali' should be of type 'int', found 'true'
                map field '[1][1].first.destinations.Hawaii' should be of type 'int', found '"3"'
                array element '[1][1].first.enjoyable[0]' should be of type 'boolean', found '1'
                tuple element '[1][1].first.rating[0]' should be of type 'string', found '10'
                array element '[2][1]' should be of type '()', found '0'
                tuple element '[3]' should be of type 'int', found '"1234567890123456789...'"}
        at ballerina.lang.value.0:cloneWithType(value.bal:86)
           errmsg:main(errmsg.bal:18)
```

#### Improvement in the runtime error creator API 

Improved the runtime Java error creator API to get a `BMap` as the `details` parameter. 

```Java
BError createError(Module module, String errorTypeName, BString message, BError cause, BMap<BString, Object> details)
```

#### New runtime Java APIs

##### API to access information of type inclusions at the runtime

Introduced a new API to retrieve the type IDs of the given `io.ballerina.runtime.api.types.ObjectType`.

```Java
TypeIdSet getTypeIdSet();
``` 

##### API to retrieve the constituent types of an intersection type

Introduced a new API to provide the list of constituent types of a given `io.ballerina.runtime.api.types.IntersectionType`.

```Java
List<Type> getConstituentTypes();
``` 

### Bug fixes

#### Removed supporting the single-quote to mark the boundary of a JSON string value 

Stopped the JSON parser supporting single quotes to mark the boundaries of a string to comply with the JSON [specification](https://www.json.org/). Only double quotes are supported now.

```ballerina
public function main() {
    string s = "{ 'foo': 'bar' }";
    json j = checkpanic s.fromJsonString();
    // This will now result in a runtime error.
}
```

#### Throw unused configurable value warnings as errors

When there is a configuration value provided in the `Config.toml` file or a command-line argument that does not match with the existing configurable variables, it will fail at runtime with an error instead of a warning.

For example, if you have the below in the `main.bal` file,

```ballerina
configurable int a = ?;
```

and the below in the `Config.toml` file,

```toml
a = 2
b = "invalid"

[c]
d = 45
```

then, it will fail with the errors below.

```bash
error: [Config.toml:(2:1,2:14)] unused configuration value 'b'
error: [Config.toml:(4:1,5:7)] unused configuration value 'c'
error: [Config.toml:(5:1,5:7)] unused configuration value 'c.d'
```

To view bug fixes, see the [GitHub milestone for Swan Lake Beta4](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta4%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

## Standard library updates

### New features

#### `mysql` package
- Introduced failover and retry support
- Added `noAccessToProcedureBodies` options

#### `log` package
- Introduced the `setOutputFile` function to write the log output to a file

#### `http` package
- Introduced request and request error interceptors

#### `grpc` package
- Introduced Protobuf `Any` type support

### Improvements

#### `sql` package
- Improved the `queryRow()` function to support union return types
- Improved the parameterized query to support the escaped backtick as insertions

#### `log` package
- Added `error:StackFrame[]` as a key-value pair type
    
#### `http` package
- Relaxed the data-binding restriction for status codes without content
- Changed the `Listener.getConfig()` API to return an `InferredListenerConfiguration`

#### `websub` package
- Updated to not change the generated unique-service-path after compilation

### Changes
- Marked all the standard library services as `distinct`
- Removed all the `info` logs printed from the listeners

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta4](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Beta4%22+label%3AType%2FBug).

## Developer tools updates

### New features
	
### Language server 
- Added `document symbol` support
- Added the `pull module` code action to pull locally unavailable Ballerina packages from Ballerina Central
- Added a new code action to add an explicit return statement where required
- Added a new code action to create a readonly clone
- Added the `ignore unused variables` code action
- Added  the `remove unreachable statement` code action
- Added dynamic capability registration support for extended services

To view bug fixes, see the [GitHub milestone for Swan Lake Beta4](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta4%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer).

#### Debugger
- Added support to debug pause instructions. With this support, any running Ballerina programs can be suspended immediately at the current execution line of the program.
- [Preview Feature] Introduced Ballerina code completion support in the Visual Studio Code debug console. Now, a context-aware completion list will be suggested automatically for Ballerina expressions in the VSCode evaluation window.
- Added string template support for debug logpoints. Now, you can interpolate expressions within debug logpoint messages by using the `${}` syntax so that the debug logpoints can be used to log state variable information without suspending the program. 

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta4 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta4%22+label%3AType%2FBug+label%3ATeam%2FDevTools)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Beta4%22) 
