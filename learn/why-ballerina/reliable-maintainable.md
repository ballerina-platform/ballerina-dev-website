---
layout: ballerina-why-ballerina-left-nav-pages-swanlake
title: Reliable, maintainable
description: The sections below explain how the explicit error handling, static types, and concurrency safety combined with a familiar, readable syntax make programs reliable and maintainable.
keywords: ballerina, ballerina platform, error handling, concurrency safety, reliability, maintainability
permalink: /why-ballerina/reliable-maintainable/
active: reliable-maintainable
intro: The sections below explain how the explicit error handling, static types, and concurrency safety combined with a familiar, readable syntax make programs reliable and maintainable. 
redirect_from:
  - /learn/user-guide/why-ballerina/reliable-and-maintainable/
  - /learn/user-guide/why-ballerina/reliable-maintainable
  - /learn/why-ballerina/reliable-maintainable
  - /learn/why-ballerina/reliable-maintainable/
  - /why-ballerina/reliable-maintainable
---

## Explicit error handling  

Error handling refers to the act of reacting to and recovering from errors. Error handling plays a critical role in producing reliable, maintainable applications. Ballerina is designed with a conscious decision to have explicit errors instead of exceptions. As a result, Ballerina has explicit error reporting and explicit error testing and handling. It is explained further using examples.

Errors are expected in network handling. In fact, “The network is reliable” is one of the [Fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing). Therefore, explicit error handling is a must when dealing with network services because it forces you to check for errors and handle or pass them to the caller. 

In Ballerina, errors are reported by functions returning values of the `error` type. The error values are part of their basic type. 

### Error reporting

This example defines a TCP client, which communicates with a remote TCP server. Both `read` and `write` methods interact with the network. Hence, errors can occur at any time. 

```ballerina
# The TCP client is used to connect to a remote TCP server. 
public client class TcpClient {
 
   # Initializes the TCP client.
   function init(string host, int port) returns error? {}
 
   # Reads bytes from the connected remote host.
   remote function read() returns byte[] | error {}
 
   # Writes bytes to the connected remote host.
   remote function write(byte[] bytes) returns error? {}
}
```

When the `read` method is completed successfully, it returns a `byte[]` value. In the case of a failure, it returns an error value. You can describe this behavior using union types in Ballerina. The union type `byte[] | error` means that the value could be either a `byte[]` or an `error`. The fact that this method can fail is explicit in the method signature.

```ballerina
# Reads bytes from the connected remote host.
remote function read() returns byte[] | error {}
```

The `write` method does not return anything if it completes successfully. However, it returns an error otherwise. Optional types in Ballerina can be used to describe this behavior. Options types are syntactic sugar for union types containing the nil type, which is written as `()`. The `error?` is sugar for `error | ()`. The examples below show how you can check whether a function returns the expected value or an error.

```ballerina
# Writes bytes to the connected remote host.
remote function write(byte[] bytes) returns error? {}
```

### Error checking 

Ballerina has language constructs for explicit error checking. Both explicit error reporting and checking improve code readability and maintainability simply because they are explicit. When you read Ballerina code, you can quickly notice the code, which reports errors, and you can check for errors.  

Usually, a function handles errors by passing them up to the caller. Even the main function, which is the program entry point can return an error resulting in an error printed in your terminal. 

The function below returns information about the provided domain name. It internally does a WHOIS database lookup via the provided TCP client. The code is correct and readable. However, it is verbose. Most of the time, you don’t need to handle every error. Instead, you pass errors to the caller. 

```ballerina
import ballerina/tcp;

function whois(string domain, tcp:Client whoisClient) returns string|error {
    error? err = whoisClient->writeBytes(domain.toBytes());
    // The `is` operator tests whether a value belongs to a type.
    if err is error {
        // The `is` operator causes the type to be narrowed.
        // The type of `err` variable is `error` in this block.
        return err;
    }

    byte[]|error bytes = whoisClient->readBytes();
    if bytes is error {
        return bytes;
    } else {
        return string:fromBytes(bytes);
    }
}
```

This `is` operator-based error checking pattern is very common and you would end up having too many of them in your code. 

```ballerina
   if result is error {
       // handle error
   }
```

Ballerina provides a much more lightweight, shorthand for this pattern. The behavior of the function below is the same as the previous version. However, it is much more elegant. The `check expr` check expression performs an explicit error check, and the control flow also remains explicit.

```ballerina
import ballerina/tcp;

function whois(string domain, tcp:Client whoisClient) returns string|error {
    // If `writeBytes` failed with an error, then `check` makes
    //  the function return that error immediately.
    check whoisClient->writeBytes(domain.toBytes());
    byte[] bytes = check whoisClient->readBytes();
    return string:fromBytes(bytes);
}
```

This function shows another pattern that handles errors in a single place. You can attach an `on fail` clause to some Ballerina statements such as `do`, `while`, `transactions`, `foreach`, etc.  In this example, check does not simply return on error. The enclosing block decides how to handle the error. If the enclosing block has an `on fail` clause, it catches the error. If the enclosing block does not have an `on fail` block, it passes the error up to its enclosing block. Finally, the function handles the error by returning the error. This behavior is different from exceptions in that control flow is explicit. 

```ballerina
import ballerina/tcp;

function whois(string domain, tcp:Client whoisClient) returns string|error {
    do {
        check whoisClient->writeBytes(domain.toBytes());
        byte[] bytes = check whoisClient->readBytes();
        return string:fromBytes(bytes);
    } on fail var err {
        return error("Failed to communicate with the given whois server", cause = err);
    }
}
```

### Ignore return values and error

Ballerina does not allow ignoring return values of expressions. 

```ballerina
// Error
string:toBytes("ballerina.io");
```

However, you can explicitly ignore a return value of an expression by assigning the result of the expressions to `_;`. This is like an implicitly declared variable of the `any` type that cannot be referenced.

```ballerina
// Ok
_ = string:toBytes("ballerina.io");
```

However, Ballerina does not allow ignoring the value of an expression if the type includes an error. You are forced to handle the error explicitly. 

```ballerina
// Error
_ =  whois("ballerina.io", whoisClient);
```

As explained earlier, `_` is like an implicitly declared variable of the `any` type; this is a union type that includes all the types in Ballerina except for the error type. Therefore, the type, which includes all values supported by Ballerina is `any|error`. As per the typing rules in Ballerina, the above statement causes a compilation error because `string|error` is not a subtype of the `any` type.

### Deal with abnormal errors

Ballerina has made a conscious decision to distinguish normal errors from abnormal errors. The sections above explained how to deal with normal errors. Out of memory, division by zero, programming bugs are examples of abnormal errors in Ballerina. Such errors typically result in immediate program termination. 

Abnormal errors can be reported using the `panic` statement. Some language constructs such as type casts generate panics. 

```ballerina
function toInt(any a) returns int {
    // This is a programming bug.
    // Raise a panic if the value of `a` is not an `int`.
    return <int>a;
}
```

A panic always has an associated error value as illustrated in the example below.

```ballerina
function divide(int m, int n) returns int {
    if n == 0 {
        panic error("division by 0");
    }
    return m / n;
}
```

Panics can be trapped with a `trap` expression. Ballerina raises a panic on an integer overflow. You can convert this panic to an error with a trap expression. 

```ballerina
int|error result = trap (m + n);
```

<style>
.nav > li.cVersionItem {
    display: none !important;
}
/* .cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
} */
</style>
