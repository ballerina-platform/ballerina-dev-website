---
title: Language security guarantees
description: Learn which classes of security weakness the Ballerina compiler prevents outright, and why the scan rule set targets what remains.
keywords: ballerina, static code analysis, security, compiler, cwe, owasp, scan
permalink: /learn/language-security-guarantees/
active: language-security-guarantees
---

A static analysis rule set measures what a scanner looks for. It is not, on its own, a measure of how much is covered.

Several weakness classes that dominate static analysis findings in other languages cannot be expressed in Ballerina at all. The compiler rejects them, so a scanner never reports them — there is nothing to report. This page shows what the language guarantees, demonstrates each guarantee with the compiler's own output, and states plainly where each one stops.

## Null dereference

Optional values have a distinct type in Ballerina, and the operations of the underlying type are not available on them.

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

The nil case must be handled before the value can be used:

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

## Data races

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

## SQL injection

`sql:ParameterizedQuery` is a template type, not a string. Values interpolated into it become bind parameters, and a query assembled by string concatenation has the wrong type.

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

`${name}` is sent to the database as a bind parameter. It is never spliced into the SQL text.

## Mishandling of exceptional conditions

The sections above cover most of the weaknesses grouped under this heading. Two more are worth showing.

### Every path must return

The following does not compile, even though all three values of the union are handled:

```ballerina
public type Status "active"|"inactive"|"pending";

public function label(Status s) returns string {
    match s {
        "active" => { return "Active"; }
        "inactive" => { return "Inactive"; }
        "pending" => { return "Pending"; }
    }
}
```

```
ERROR [match.bal:(9:1,9:2)] this function must return a result
```

A `match` statement requires a wildcard arm before the compiler treats the function as returning on every path. Type-narrowing `if`/`else` chains over a union, by contrast, are proven exhaustive and compile with no diagnostic:

```ballerina
public function describe(int|string v) returns string {
    if v is int {
        return "int";
    } else if v is string {
        return "string";
    }
}
```

### Patterns that can never match are reported

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

Ballerina also separates recoverable errors from panics. The scan rule [`ballerina:1`](/learn/scan-rules/#avoid-checkpanic) flags `checkpanic`, which turns a handled error into an abrupt termination.

## Where these guarantees stop

Each guarantee has a boundary, and knowing where it lies matters as much as the guarantee itself.

| Guarantee           | Where it stops                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Null dereference    | Optional types are enforced throughout the language. The boundary is Java interop: `handle` is not a nilable type, so the compiler requires no nil check on one. Holding a `handle` that refers to a Java null is itself safe, and `java:toString` maps such a handle to `()` in a `string?`, which callers can propagate and narrow or coalesce where a `string` is required. What fails, at run time and with no compile-time diagnostic, is passing such a `handle` to a Java method call. |
| Unchecked errors    | No exceptions. An error-typed value must be handled or propagated.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Data races          | Isolation is opt-in. Code that is not marked `isolated` is not proven concurrency-safe. `isolated` on an `external` function is also accepted as a declaration rather than proved, so interop code can mutate shared state from inside an `isolated` function. The scan rules `ballerina:3` to `ballerina:6` exist to push public functions, methods, classes, and objects toward `isolated`, so the rules and the language feature work together.                                            |
| SQL injection       | Covers values, not identifiers. Table and column names cannot be bind parameters, so a dynamic identifier must be built another way. `sql:queryConcat` keeps values parameterized, because it accepts only `sql:ParameterizedQuery` arguments. What falls outside the guarantee is a dynamic identifier, or a hand-built DDL or SQL fragment that embeds input into the query text directly.                                                                                                  |
| Exhaustive handling | A `match` statement needs a wildcard arm. Full coverage of a singleton union is not treated as exhaustive on its own.                                                                                                                                                                                                                                                                                                                                                                         |

## What this means for the scan rule set

Because these classes are closed at compile time, a Ballerina scanner has nothing to find in them. What remains for static analysis is the residue: configuration mistakes, and unsafe use of specific library APIs where a developer can still select the insecure option.

That is what the [scan rules](/learn/scan-rules/) target, and it is why the rule set is smaller than that of a comparable tool for a language which must detect all of the above at scan time.
