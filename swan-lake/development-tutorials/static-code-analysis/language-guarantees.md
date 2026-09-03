---
title: Language guarantees
description: Learn what the Ballerina compiler guarantees about every program it accepts, and why the scan rule set targets only what remains.
keywords: ballerina, static code analysis, language guarantees, compiler, scan
permalink: /learn/language-guarantees/
active: language-guarantees
---

Ballerina settles a large amount of program correctness at compile time, before any analysis tool runs. What follows is enforced by the compiler on every build, so it holds for every program that compiles rather than depending on a convention a team has to adopt or a lint rule someone has to enable.

- It is **strongly and statically typed**, so the type of every expression is known at compile time and the compiler rejects a program whose types do not line up. There is no implicit conversion and no notion of truthiness: a condition has to be a `boolean`, and even a widening such as `int` to `float` has to be written out.
- **Variables cannot be read before they are assigned.** Definite assignment is a compile-time check, so there is no uninitialized read to reason about.
- **Immutability is enforced, not advisory.** A `readonly` value cannot be updated after it is constructed, and a `final` variable cannot be reassigned. Immutable data is safe to share, which is what lets concurrent code pass values around without locking them.
- It is **structurally typed and knows about network data**, with `json`, `xml`, and `table` as language types rather than library add-ons. Operations on values whose shape is known statically are checked by the compiler, which removes a class of transformation and integration mistakes. Data arriving from outside the program is a different matter: converting a `json` payload to a declared record type is validated when the conversion runs, and it returns an error the caller has to handle.
- Its **language library covers the built-in operations**, including parsing and conversion, so common data handling does not reach for a third-party dependency.
- Its **standard library and connectors are maintained with the platform**, which keeps behaviour consistent across modules and keeps the dependency surface small.

The effect on static analysis is direct. Several weakness classes that dominate scanner findings in other languages cannot be expressed in Ballerina at all, because the compiler rejects them. A scanner never reports them, since there is nothing to report. So a Ballerina analysis tool has less to look for, and the [scan rules](/learn/scan-rules/) are correspondingly few.

The sections below demonstrate the main guarantees with the compiler's own output.

## Nil and optional values

Nil is its own value in Ballerina, written `()`, and it has its own type, `()`. Optionality is therefore not a property bolted onto every type: it is a union with the nil type, and `string?` is shorthand for `string|()`. Because the union is a distinct type from its members, the operations of the underlying type are not available on it.

The following does not compile:

```ballerina
public function getName(map<string> data) returns string {
    string? name = data["name"];
    return name.trim();
}
```

```
ERROR [null.bal:(3:17,3:21)] undefined function 'trim' in type 'string?'
```

The map access yields `string?` — either a `string` or `()`. Calling a `string` method on it is not a warning to be triaged later; the program does not build.

The nil case must be accounted for before the value can be used as a `string`:

```ballerina
public function getName(map<string> data) returns string {
    string? name = data["name"];
    return name ?: "unknown";
}
```

## Unchecked error conditions

Errors are ordinary typed values, not exceptions thrown past the type system. A function that can fail returns a union that includes the error, and that union is not assignable to the success type.

The following does not compile:

```ballerina
import ballerina/io;

public function readConfig(string path) returns string {
    string content = io:fileReadString(path);
    return content;
}
```

```
ERROR [error.bal:(4:22,4:45)] incompatible types: expected 'string', found '(string|ballerina/io:1.8.1:Error)'
```

Ignoring the failure path is not possible, so there is no silently dropped error for a scanner to find. Use `check` to propagate the error to the caller:

```ballerina
import ballerina/io;

public function readConfig(string path) returns string|io:Error {
    string content = check io:fileReadString(path);
    return content;
}
```

Handling it locally with `if content is io:Error { ... }` is equally valid. What is not valid is ignoring it.

## Panics and recoverable errors

Ballerina separates a recoverable error, which is a value, from a panic, which unwinds the call stack. `checkpanic` converts the first into the second, and both forms compile, so this is a choice the language leaves open to the developer rather than one it decides.

Both of the following compile:

```ballerina
import ballerina/io;

public function readConfig(string path) returns string {
    return checkpanic io:fileReadString(path);
}
```

```ballerina
import ballerina/io;

public function readConfig(string path) returns string|io:Error {
    return check io:fileReadString(path);
}
```

The first terminates the program on a missing file; the second hands the error to the caller. Because the compiler accepts both, this is one of the gaps a rule has to cover: the scan rule [`ballerina:1`](/learn/scan-rules/#avoid-checkpanic) flags `checkpanic` for exactly this reason.

## Immutability

`readonly` is a type, not a convention. A value of a `readonly` type is deeply immutable, so the compiler rejects an attempt to update it instead of leaving it to fail at run time.

The following does not compile:

```ballerina
public function main() {
    readonly & int[] nums = [1, 2, 3];
    nums.push(4);
}
```

```
ERROR [readonly.bal:(3:5,3:17)] cannot update 'readonly' value of type '(int[] & readonly)'
```

`final` is a separate and weaker guarantee. It stops the variable from being reassigned but says nothing about the value it refers to, so a `final` variable can still hold something mutable. The next section shows where that difference has consequences.

## Concurrency safety

The `isolated` qualifier is a compiler-checked assertion about how a function may reach mutable state: only through its own arguments, or through `isolated` module-level variables, and every access to such a variable must sit inside a `lock`. The compiler proves this rather than leaving it to review.

The following does not compile:

```ballerina
int counter = 0;

public isolated function increment() {
    counter += 1;
}
```

```
ERROR [isolated.bal:(4:5,4:12)] invalid access of mutable storage in an 'isolated' function
```

Marking the variable `isolated` requires every access to sit inside a `lock`, and the compiler enforces the pairing:

```ballerina
isolated int counter = 0;

public isolated function increment() {
    lock {
        counter += 1;
    }
}
```

A `lock` is only needed for mutable state. Immutable data has nothing to race on, so an `isolated` function can read a `final` variable of a `readonly` type directly, with no lock and no `isolated` qualifier on the variable:

```ballerina
type Limits readonly & record {|
    int maxRetries;
    int timeoutSeconds;
|};

final Limits limits = {maxRetries: 3, timeoutSeconds: 30};

public isolated function retryBudget() returns int {
    return limits.maxRetries;
}
```

This is where the distinction in [Immutability](#immutability) earns its keep. `final` on its own does not buy lock-free sharing, because a `final` variable holding a mutable array is still shared mutable state, and the compiler treats it as exactly that:

```ballerina
final int[] counts = [1, 2, 3];

public isolated function total() returns int {
    int sum = 0;
    foreach int n in counts {
        sum += n;
    }
    return sum;
}
```

```
ERROR [shared.bal:(5:22,5:28)] invalid access of mutable storage in an 'isolated' function
```

Isolation is not merely advisory. A listener will not make concurrent calls to a service method it cannot prove safe, so a method that is not `isolated` is serialized rather than run in parallel. The compiler says so on every build:

```ballerina
import ballerina/http;

int counter = 0;

service /api on new http:Listener(8080) {
    resource function get count() returns int {
        counter += 1;
        return counter;
    }
}
```

```
HINT [service.bal:(6:5,6:5)] concurrent calls will not be made to this method since the method is not an 'isolated' method
```

The absence of isolation therefore costs throughput, not safety. Making the method `isolated` and guarding the shared variable clears the hint and allows the listener to dispatch calls concurrently:

```ballerina
import ballerina/http;

isolated int counter = 0;

service /api on new http:Listener(8080) {
    isolated resource function get count() returns int {
        lock {
            counter += 1;
            return counter;
        }
    }
}
```

The scan rules `ballerina:3` to `ballerina:6` exist to push public functions, methods, classes, and objects toward `isolated`, so the rules and the language feature work together.

## SQL injection

The SQL modules take queries as parameterized queries, which map onto prepared statements on the database side. Values interpolated into such a query travel as bind parameters and are never part of the SQL text, so the ordinary way to write a query is already the injection-safe way.

`sql:ParameterizedQuery` is a template type, not a string, so a query assembled by string concatenation has the wrong type.

The following does not compile:

```ballerina
import ballerina/sql;

public function buildQuery(string name) returns sql:ParameterizedQuery {
    string raw = "SELECT * FROM users WHERE name = '" + name + "'";
    return raw;
}
```

```
ERROR [sql.bal:(5:12,5:15)] incompatible types: expected 'ballerina/sql:1.19.0:ParameterizedQuery', found 'string'
```

The safe form is also the shorter and more natural one:

```ballerina
import ballerina/sql;

public function buildQuery(string name) returns sql:ParameterizedQuery {
    return `SELECT * FROM users WHERE name = ${name}`;
}
```

`${name}` is sent to the database as a bind parameter. It is never spliced into the SQL text. `sql:queryConcat` composes such queries while keeping that property, because it accepts only `sql:ParameterizedQuery` arguments. What the guarantee does not cover is a dynamic table or column name, since an identifier cannot be a bind parameter, and any SQL or DDL text a program assembles itself.

## Every path must return

A function whose declared return type excludes nil must return on every path. Falling off the end is not silently treated as returning nil.

This applies only to those functions. Omitting the return type is the same as declaring `returns ()`, and for any return type that includes nil, reaching the end of the function is equivalent to `return ();` — though for an optional type other than `error?` the compiler notes that the function should return a value explicitly.

The following does not compile:

```ballerina
public function classify(int n) returns string {
    if n > 0 {
        return "positive";
    }
}
```

```
ERROR [return.bal:(5:1,5:2)] this function must return a result
```

## Patterns that can never match are reported

```ballerina
public type Status "active"|"inactive";

public function label(Status s) returns string {
    match s {
        "active" => { return "Active"; }
        "inactive" => { return "Inactive"; }
        "archived" => { return "Archived"; }
        _ => { return "?"; }
    }
}
```

```
WARNING [match.bal:(7:9,7:19)] pattern will not be matched
```

A branch that can never execute — often a stale or misspelled case — is diagnosed.

## What this means for the scan rule set

Because these classes are closed at compile time, a Ballerina scanner has nothing to find in them. What remains for static analysis is the residue: configuration mistakes, choices the language deliberately leaves open such as `checkpanic`, and unsafe use of specific library APIs where a developer can still select the insecure option.

That is what the [scan rules](/learn/scan-rules/) target, and it is why the rule set is smaller than that of a comparable tool for a language which must detect all of the above at scan time.
