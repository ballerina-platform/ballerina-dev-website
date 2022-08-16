---
layout: ballerina-distinctive-language-features-left-nav-pages-swanlake
title: Concurrency 
description: Let’s now look at how concurrency and transactions are handled in Ballerina. 
keywords: ballerina, programming language, ballerina packages,language-guide
permalink: /learn/distinctive-language-features/concurrency/
active: concurrency
intro: Let’s now look at how concurrency and transactions are handled in Ballerina. 
redirect_from:
- /learn/distinctive-language-features/concurrency
---

## Sequence diagram-based concurrency

### Named workers

One of the key aspects of the Ballerina language is to support concurrency. With more and more applications needing to support network interaction, concurrency becomes important for handling scale. But at the same time, it introduces complexities in data handling.

One of the main ideas in Ballerina is to have a graphical view of the program. This concept is all about providing deeper insights into what the program is doing rather than spewing out the static syntax tree. Consider the three most important aspects of the Ballerina language, namely data handling, network interaction, and concurrency. Of these three features, network interaction and concurrency add a fair bit of complexity to an application. Based on common wisdom, a sequence diagram provides the most incisive view of a program involving network interaction and concurrency.

In Ballerina, concurrency-related features are built into the language as first-class citizens, and they map directly onto sequence diagrams. For example, you can define a concurrent flow of control using a named worker.

```ballerina
import ballerina/io;

public function main() {

    io:println("Initializing");

    worker A {
        io:println("In worker A");
    }

    worker B {
        io:println("In worker B");
    }

    io:println("In function worker");
}
```

The keyword ``worker`` is used to define a named worker. In the above code example, the function **``main()``** has a default worker. Normally, a function's code belongs to the function's default worker, which has a single logical thread of control. However, a function can also declare named workers, which run concurrently with the function's default worker and other named workers. The function **``main()``** has two named workers **``A``** and **``B``**. These two workers execute concurrently with the code in the default worker of the function.

The named workers do not start executing until their declaration point. This means that the code before the named workers is always executed before the workers start. However, the variables declared before all the named workers and the function parameters are accessible within the named workers.

### Sequence diagram

A function can be viewed as a sequence diagram. To translate a Ballerina function into a sequence diagram-based depiction, you can consider each worker (default and named) as a lifeline, depicted by a vertical line. Therefore, the previous code example can be regarded as a sequence diagram consisting of three lifelines, two for the named workers and one for the default worker of the function.

Additionally, if the function also has a client object to interact with a remote system, then that client object also has a lifeline. If a worker makes a remote method call on a client object, that is represented as a horizontal line between the lifelines of the worker making the call and the remote object.


### Wait for workers

Named workers can continue to execute even after the function's default worker terminates and the function returns. So if you want to wait for the worker to terminate before returning from the function, you have to wait for it explicitly.

```ballerina
import ballerina/io;

public function main() {
    io:println("Initializing");

    worker A {
        io:println("In worker A");
    }

    io:println("In default worker");
    wait A;
    io:println("After wait A");
}
```

In the above code example, the ``wait`` keyword is used to wait for the named worker **``A``** before returning from the **``main()``** function.

### Strands

Ballerina's way of worker-based concurrency follows a unique concept known as strands. A strand is a logical thread of control assigned to every worker, which is multitasked cooperatively instead of preemptively.

The execution of a strand switches only at specific yield points, such as doing a wait or calling a blocking system call. This approach avoids the need for locking variables accessed across multiple workers to manage tricky issues related to race conditions and deadlocks.

While a strand has a separate logical thread of control, the actual execution still happens on a common physical thread at the CPU level. However, you can use an annotation to make the strand run on a separate thread.

### Named worker return values

Named workers can have a return type just like in a function, which is nil by default. You can also use ``check`` to handle errors.

```ballerina
function demo(string s) returns int|error {
 
    worker A returns int|error {
        int x = check int:fromString(s);
        return x + 1;
    }

    int y = check wait A;
    return y + 1;
}
```

In the above code example, the worker **``A``** returns either an integer or an error. Under normal circumstances, the worker will return an integer value, and the function **``demo()``** waits for **``A``**, assigns the returned integer value to **``y``**, and returns the result of incrementing that value by one.  

In case the ``int:fromString(s)`` call within the worker returns an error, the check will fail, causing the worker **``A``** to return the error. Subsequently, the check expression within **``demo()``** will also return the error. The ``return`` statement in a named worker terminates the worker and not the enclosing function.

### Alternate wait

Instead of waiting on one worker, you can also wait for one of several workers.

```ballerina
function fetch(string url) returns string|error {
    ….
}

function altFetch(string urlA, string urlB) returns string|error {

    worker A returns string|error {
        return fetch(urlA);
    }

    worker B returns string|error {
        return fetch(urlB);
    }

    return wait A | B;

}
```

In the above code example, the function **``altFetch()``** declares two workers **``A``** and **``B``**. Both call a function **``fetch()``** passing in the parameters from **``altFetch()``**. In the end, the **``altFetch()``** function does **``return wait A | B``**. This means that it will return as soon as either **``A``** or **``B``** returns.  

The return value of both the functions and workers is a union of string and error. In case an error is returned by the workers or the **``fetch()``** function, it is returned from the function **``altFetch()``** also.

### Multiple wait

In case you want to wait for all the workers, Ballerina allows that too.

```ballerina
type Result record {
    string|error a;
    string|error b;
};

function multiFetch(string urlA, string urlB) returns Result {
    worker WA returns string|error {
        return fetch(urlA);
    }
    worker WB returns string|error {
        return fetch(urlB);
    }

    return wait {a: WA, b: WB};

}

Result res =  multiFetch("https://…..",
                             "https://…..");
```

In the above code example, the function **``multiFetch()``** declares two workers similar to the example in the previous section. The only difference is in the ``wait``. In this case, it waits for both the workers **``WA``** and **``WB``** and packages their returned value in a record of type **``Result``** with the fields **``a``** and **``b``**.  

Instead of explicitly constructing the record in the ``wait`` expression, you can also use the shorthand ``wait {X , Y}`` which equates to ``wait {X: X, Y: Y}``. This works with the concept of futures also, as explained in the next section.

### Named workers and futures

Workers and futures are the same. A named worker referred to as a variable becomes a future. The return type of the worker becomes the type of future.

```ballerina
function demo() returns future<int> {
    worker A returns int {
        return 42;
    }
    
    return A;
}
```

In the above code example, the function **``demo()``** returns a future, which is the worker **``A``**. The type of the future is the return type of the worker, which is ``int`` in this case.

Alternatively, you can use the ``start`` keyword. It is a sugar for calling a function within a named worker and returning a reference to the worker as a future.

```ballerina
type FuncInt function () returns int;

function startInt(FuncInt f) returns future<int> {
    return start f();
}

future<int> c = startInt(() => 100);
int d = check wait c;
```

In the above code example, the function **``startInt()``** expects an argument of the **``FuncInt``** function type. When called, it starts the execution of the function on a separate strand and returns a future for it.

### Inter-worker message passing

You can pass messages between workers using the ``->`` and ``<-`` notation.

```ballerina
public function main() {

    worker A {
        1 -> B;
        2 -> C;

    }

    worker B {
        int x1 = <- A;
        x1 -> function;
    }

    worker C {
        int x2 = <- A;
        x2 -> function;
    }

    int y1 = <- B;
    int y2 = <- C;
    int z = y1 + y2;
}
```

In the above code example, worker **``A``** sends the integer value ``1`` to worker **``B``** and the integer value ``2`` to worker **``C``**, using the ``->`` notation. Both **``B``** and **``C``** receive the values and store them in variables **``x1``** and **``x2``**, respectively, using the ``<-`` notation. And then, they send them to the ``main`` function’s default worker, which receives them via another set of ``<-`` and computes the addition of the two integers.

Message passing with the **``main()``** function uses the ``function`` keyword to refer to the default worker. All messages are copied using the **``clone()``** function, which also implies that immutable values are passed without copying.

The pairing of message send and receive expressions (with  ``->`` and ``<-`` notation) is done at the compile time. Thus, each pair turns into a horizontal line in the sequence diagram, thereby representing an interaction between two workers.  

This way of message passing is easy to use as it avoids complex deadlocks but has limited expressiveness.

### Inter-worker failure propagation

In the ideal case, pairing the sends and receives guarantees that every message sent will be received, and vice versa. But what if the sender worker has an error before passing the message to the receiver worker?

```ballerina
function demo() returns int|error {
    
    worker A returns error? {
        check foo();
        42 -> function;
    }

    int x = check <- A;
    return x;
}
```

In the above code example, the worker **``A``** is sending an integer value to the default worker. However, before sending, it has to call another function **``foo()``** which may return an error. In that case, the send will never happen, and the error will propagate to the default worker. Consequently, either an integer value or error is received. That's why the ``check`` expression is used in the default worker along with the ``<-`` notation at the receiver side to handle the error. Panics are also propagated similarly.

## Transactions

Transactions are an important aspect of Ballerina's concurrency feature. The Ballerina runtime has built-in support for interacting with a transaction manager. The Ballerina runtime includes a transaction manager, and the language provides syntax for delimiting transactions.

The current transaction is part of the execution context of a strand.

Further, the transaction concept can also be combined with network interaction features to support distributed transactions.

This concept is not the same as transactional memory, where the memory space is committed or rolled back to a previous value.

### ``transaction`` statement

You can define a transaction using a ``transaction`` block as follows.

```ballerina
transaction {
    doStage1();
    doStage2();

    check commit;
}
```

In the above code example, a ``transaction`` block is used to perform two function calls that must be part of the transaction. The ``transaction`` statement starts the new transaction and the ``commit`` statement must be included explicitly to commit the transaction.

It is normal for commits to fail. You can use the ``check`` expression to handle errors.

### ``check`` semantics

The ``check`` expression is not merely for returning errors. When ``check`` gets an error, it fails and the enclosing block decides what to do with the error. Most blocks pass the failure up to the enclosing block and function definitions handle failure by returning the error. Alternatively, to handle the errors returned from transactions, you can use the ``on fail`` clause as part of the ``check`` semantics.

```ballerina
public function main() returns error? {
    do {
        check foo();
        check bar();

        if !isOK() {
            fail error("not OK");
        }
    } on fail var e {
        io:println(e);
        return e;
    }
}
```

In the above code example, there are two ``check`` expressions inside the ``do`` block. When there is an error, the check fails. However, instead of propagating the error, you can catch it using the ``on fail`` block. If one of the ``check`` statements fails in the do block, the control shifts to the ``on fail`` block, and then the error value is assigned to the variable **``e``** . The ``fail`` statement is like ``check``, but it always fails.  

You can say that this is very similar to exception handling, where exceptions are raised in the code and caught in a catch block. However, in Ballerina, the control flow is explicitly defined for how the error is handled.

### Rollback

In the case of transactions, a failure or panic when executing the block results in a rollback.

```ballerina
function transfer(Update[] updates) returns error? {

    transaction {
        foreach var u in updates {
            check doUpdate(u);
        }

        check commit;
    }
}

function doUpdate(Update u) returns error? {
    ….
}
```
 
In the above code example, the **``transfer()``** function defines a transaction that runs a ``foreach`` loop that calls another function **``doUpdate()``**. If the **``doUpdate( )``** function returns an error, the ``check`` expression returns it. This is treated as a failure within the transaction block and results in a rollback of the transaction.  

There are four ways in which a transaction block can exit in Ballerina. Under normal cases, passing through an explicit ``commit`` or a ``rollback`` statement results in the transaction being terminated. The other two scenarios are failures, resulting from a failed exit (e.g., from ``check``) and panic exit.

The rollback operation does not automatically restore Ballerina variables to values before the transaction. Instead, it only tells the transaction manager to roll back the execution point.

### ``retry`` transaction statement

Transactional errors are often transient and may go away when retried. As a result, you can retry the transaction if it fails due to an error within the transaction block.

```ballerina
import ballerina/io;

public function main() returns error? {
    retry transaction {
        check doStage1();
        check doStage2();
        check commit;
    }
}

function doStage1() returns error? {
    io:println("Stage1 completed");
}

function doStage2() returns error? {
    return error 'error:Retriable("Stage2 failed");
}
```

In the above code example, the ``retry`` keyword is used in front of the transaction statement. Using the ``retry`` keyword implicitly creates a ``DefaultRetryManager`` object, as ``retry<DefaultRetryManager>(3)``, that retries the transaction three times.

You can specify an optional type parameter, which belongs to the ``RetryManager`` object with the ``retry`` keyword when defining the transaction. If the transaction block fails with an error, the ``shouldRetry()`` method of the ``RetryManager`` object is called with the error value ``e``. Based on this, the ``RetryManager`` decides whether to retry the transaction. The ``DefaultRetryManager`` is used in case a ``RetryManager`` object is not specified explicitly. It is part of the ``lang.error`` lang library.

The ``DefaultRetryManager`` has a predefined set of errors that are retriable. So the retry happens only if one of those error types is what caused the transaction to fail. This is in addition to the check for retry counts not exceeding the retry limit set in the ``RetryManager`` object.

This retry mechanism can be used even without transactions. So any block of code in Ballerina can be enclosed with retry.

### The `transactional` qualifier

At compile time, Ballerina can identify the regions of the code that execute within a transactional context. Within a transaction statement, the body of the statement is a transaction context. Therefore, when executing code within the transaction context, you are guaranteed at compile-time to have a current transaction for that transaction context.

By using the ``transactional`` qualifier in a function, it is restricted to be called only in a transactional context. Moreover, the body of such a function will itself be a transactional context.

```ballerina
transactional function doUpdate(Update u) returns error? {
    foo(u);
    bar(u);

}

function foo(Update u) {
    if transactional {
        bar(u);
    }
}

transactional function bar(Update u) {
    io:println("Calling from a transactional context");
}
```

In the above code example, the functions **``doUpdate()``** and **``bar()``** have the ``transactional`` qualifier. Calling **``doUpdate()``** establishes a transactional context within which, calls to  **``foo()``** and **``bar()``** are made. The transactional function **``bar( )``** can be called within **``doUpdate()``** since it is also a transactional function, which results in its body being a transactional context.

The ``transactional`` expression is also used as a boolean test to check whether a current transaction is active at runtime. Using a ``transactional`` expression in a condition results in a transactional context. Inside the function **``foo()``** the ``if`` statement is used to check for a current transaction before calling the transactional function **``bar( )``**. In this way, you can check for the transactional context even inside a non-transactional function to perform transaction dependent operations.

### Distributed transactions

Ballerina is designed so that transactions work together with network interactions. Therefore, the resource and remote methods of service objects and remote methods of client objects can be declared transactional. But the actual working of transactional behavior is implementation-dependent which is kept under the covers to avoid complications.

Transactions follow a branching pattern starting from a global transaction and then multiple transactions branch out from it. Therefore, the current transaction is always a branch of the global transaction. When a new transaction is created as a global transaction, the current transaction becomes the root branch.

You can also have client objects and listener objects that are transaction-aware. To communicate with remote systems in a transaction-aware way, they need to associate the network messages with a global transaction and allow the transaction manager of the Ballerina program to communicate with other transaction managers. For that, you need a protocol to communicate between the distributed programs. And this is not limited to two Ballerina programs. They can work in programs written in different languages or from Ballerina to a database, so long as both sides understand the same protocol, including industry-standard protocols such as XA. Ballerina has a micro-transaction protocol to support this interaction, and you can implement it in other programming languages.

A transaction-aware client object or Listener needs a network protocol to associate a network message with a global transaction and to allow the transaction manager of the Ballerina program to communicate with other transaction managers. There is a separate API for interfacing with the Ballerina transaction manager to enable clients and listeners.  

When a transaction-aware listener determines that the request is part of a global transaction, it starts a new transaction branch for executing the service object’s resource/remote method. So that service object will have a current transaction which is a branch of the global transaction.

### ``transactional`` named workers

The ``transactional`` qualifier can be applied to a named worker in a ``transactional`` function also.

```ballerina
transactional function exec(Update u) returns error? {
    transactional worker A {
        bar();
    }

}

transactional function bar() {
    io:println("bar() invoked");
}
```

In the above code example, the named worker **``A``** has the ``transactional`` qualifier. Therefore, the strand for execution of the code within **``A``** will have a new transaction that is branched from the calling transactional context within the function **``exec()``**.

### Commit/rollback handlers

Often, there is a need to execute additional code depending upon whether the transaction was committed or not. In Ballerina, you can check for the status of a transaction and execute additional code to handle the specific outcome of the transaction, either for commit or rollback.

One way is to do this inline within the transaction statement. However, this approach is inconvenient when handling undo changes in rollback, from a modularity perspective. Moreover, this approach also does not suit the distributed transaction interaction with another program. Therefore, commit and rollback handlers are provided as functions that run based on a transaction's respective outcome.

```ballerina
transactional function update() returns error? {
    check updateDatabase();
 
    transaction:onCommit(sendEmail);
}
```

In the above code example, the function **``update()``** has a transactional context. Based on the outcome of calling the **``updateDatabase()``** function, it can either commit or rollback the transaction. The last line of the code adds the commit handler. This means that if the transaction commits successfully, the function **``sendEmail()``** is called.  

This is particularly useful when the **``update()``** function is called from a remote or resource transactional method, in a service object, and is invoked by another remote Ballerina program as a result of a service invocation. The transaction manager of the Ballerina program that initiated the transaction, will send a message to the Ballerina program in which this function is running. The two transaction managers follow a two-phase commit, such that when the remote Ballerina program knows that commit is successful, it will then arrange for the transaction manager of the Ballerina program running the **``update()``** function to call the commit handler.

## Concurrency safety

### ``lock`` statement

The ``lock`` statement allows the access of mutable state from multiple strands running on separate threads, with well-defined results.

```ballerina
int n = 0;

function inc() {
    lock {
        n += 1;
    }
}
```

In the above code example, the ``lock`` block allows the safe mutation of the variable **``n``** from multiple strands running on separate threads.  

The semantics of the ``lock`` block is like an atomic section, and the execution of the outer ``lock`` blocks is not interleaved. From an implementation point of view, developers can think of this as a single global lock. The Ballerina compiler will optimize this by inferring a more fine-grain set of locks to have the same semantic with better performance characteristics.

### Service concurrency

Ballerina's main goal for service concurrency is to achieve decent performance and a decent level of safety.  

Decent performance means that the Listener can have multiple threads serving incoming requests concurrently. Similarly, a decent level of safety boils down to the expectation that there are no undetected data races that lead to wrong results. However, certain errors that cannot be detected at compile-time may be detected at runtime. It is difficult to do it entirely at compile time since it would entail a more complex and restrictive system.

You can expect Ballerina to figure out the code and tell whether the program is safe for strands to be executed on separate threads or not. In case it is safe, it is guaranteed that there will not be any undetected data races.

The ``lock`` statement is not enough to achieve this safety since it is left to the developer to use it. Therefore, there are additional provisions in Ballerina that provide the level of protection that is in line with the expected safety, as stated above.

### ``isolated`` functions

To achieve the intended goals of safety, Ballerina offers the concept of ``isolated`` functions. An ``isolated`` function is a function that is concurrency safe if its arguments are safe. So it is not unconditionally safe, but if called with the right arguments, it is safe.

An ``isolated`` function is allowed to access a mutable state only through its parameters. Further, it can only call a function that is ``isolated``.

```ballerina
type R record {
    int v;
};

isolated function set(R r) returns R {
   r.v = 1;
   return r;
}
```

In the above code example, the **``set()``** function is an ``isolated`` function. Given the right input parameter, it will be concurrency safe.

The constraints for ``isolated`` functions are applied at compile time. This concept of ``isolated`` functions is a weaker version of the pure function concept found in the D programming language.

### ``readonly`` type

In  Ballerina, you have a ``readonly`` type that represents immutable values. This is represented as a type to which values belong only if they are immutable.

```ballerina
// The type of `s` is an immutable `string`` array.
// The value is also constructed as an immutable value.
readonly & string[] s = ["foo", "bar"];
 
type Row record {
    // Both the field and its value are immutable.
    readonly string[] k;

    int v;
};

table<Row> key(k) t = table [
    // Can safely use `s` as a key.
    {k: s, v: 17}
];
```

In the above code example, the string array **``s``** is declared as read-only using the type intersection operator ``&``. The type of **``s``** is both an array of strings and ``readonly,`` which means that it is an immutable array. This is enforced at compile-time to ensure that the values of the array **``s``** are immutable. Therefore, it is safe to pass it as an argument to an ``isolated`` function.

This concept is different from the const keyword in C. So a *const char s* in C is not the same as *readonly & string[] s* in Ballerina, because here you are making the values of the type immutable whereas, in the case of C the const identifier refers to a variable whose value can be assigned to another variable with the const qualifier.

If the ``readonly`` keyword is used within a structured type, it makes both the field and the value immutable. In the above code example, the field **``k``** of the ``Row`` record type has the ``readonly`` qualifier. This means that the field **``k``** cannot be assigned a new value, and the values of the field cannot be mutated by changing the array **``s``**.

### ``readonly`` and ``isolated``

``readonly`` ensures safety in accessing data, and isolation provides a safe execution environment for a function. These two concepts can be combined to build a robust concurrency safety mechanism within a Ballerina program. Isolated functions can access final variables of the ``readonly`` type without locking.

```ballerina
type Entry map<json>;
type RoMap readonly & map<Entry>;

final RoMap m = loadMap();

function loadMap() returns RoMap {
    ... 
}

isolated function lookup(string s) returns readonly & Entry? {
    return m[s];
}
```

In the above code example, there are two map types declared at the top, **``Entry``** and **``RoMap``**. **``RoMap``** is also a subtype of ``readonly``. The **``loadMap( )``** function loads a map from a file and assigns it to **``m``** which is of type **``RoMap``**.

This variable **``m``** is ``final``, which means that it cannot be set again. It is also ``readonly``, which means that its value is deeply immutable. Because of that, it is completely safe to access **``m``** from multiple threads. Therefore, when it is accessed in the ``isolated`` function **``lookup()``** without a ``lock`` statement. It returns a value of the **``Entry``** type which is also readonly type, thereby ensuring complete concurrency safety.

In this way, the ``readonly`` type complements ``isolated`` functions. If such a function is part of a method for service listeners where it has to read or write data and execute some code, the ``isolated`` specifier provides information about the function’s execution context, and ``readonly`` specifier provides information about immutability of the data.

### Combine isolated function with lock

To keep things from getting overly complex, you can combine isolated functions with lock statements to access mutable module-level state.

A module-level mutable variable follows the concept of an isolated root. It is an isolated island that guards access to the variable. For example, a value ``r`` is an isolated root if the mutable state reachable from ``r`` cannot be reached from outside except through ``r``.

Similarly, an expression is an isolated expression if it follows rules that guarantee that its value will be an isolated root. As an example, an expression of a type that is a subtype of ``readonly`` is always isolated. Similarly, an expression ``[E1, E2]`` is isolated if ``E1`` and ``E2`` are isolated. Also, an expression ``f(E1, E2)`` is isolated if ``E1`` and ``E2`` are isolated, and the type of ``f`` is an ``isolated`` function.

### Isolated variables

You can extend the concept of ``isolated`` functions to module-level variables. When a module-level variable is declared as ``isolated``, the compiler guarantees that it is an isolated root and is accessed only within a lock statement.

```ballerina
isolated int[] stack = [];

isolated function push(int n) {
    lock {
        stack.push(n);
    }
}

isolated function pop() returns int {
    lock {
        return stack.pop();
    }
}
```

In the above code example, **``stack``** is an isolated variable. Therefore, it can only be accessed within ``lock`` statements, as shown in the functions **``push()``** and **``pop( )``**. Both functions are ``isolated`` functions.

There are certain constraints with respect to defining ``isolated`` variables. They can be declared only at the module level and have to be initialized with isolated expressions. Isolated variables cannot be public.

Additionally, more constraints apply to the usage of ``isolated`` variables. A ``lock`` statement can access only one ``isolated`` variable. Within a ``lock`` statement that accesses an ``isolated`` variable, only ``isolated`` functions can be called. Moreover, isolated expressions have to be used to transfer values in and out of the ``lock`` statement. Isolated functions are allowed to access ``isolated`` module-level variables as long as they adhere to the above constraints.

### Isolated methods

The concept of isolation can also be applied to object methods. An ``isolated`` object method is the same as an ``isolated`` function. It has an implicit reference to ``self``, which is treated as a parameter.  

An ``isolated`` method is concurrency-safe if both the object and the arguments are safe. But this is not quite enough for service concurrency. When a listener makes a call to a remote or resource method, it controls the parameters that are passed to the methods. Therefore, it can ensure the safety of the remote methods and ensure that the arguments to the method are safe. However, it cannot ensure the safety of the service object as the object may contain mutable fields.

Therefore, just having ``isolated`` methods alone does not guarantee complete concurrency safety.

### Isolated objects

To bridge this concurrency gap in ``isolated`` methods, you can also define ``isolated`` objects. An ``isolated`` object is just like a module with ``isolated`` module-level variables.

```ballerina
isolated class Counter {

    private int n = 0;

    isolated function get() returns int {
        lock {
            return self.n;
        }
    }

    isolated function inc() {
        lock {
            self.n += 1;
        }
    }
}
```
  
In the above code example, **``Counter``** is an ``isolated`` object. Mutable fields of an ``isolated`` object must be private. In addition, fields must be initialized with an isolated expression and can be accessed only within a ``lock`` statement. The ``lock`` statement follows the same rules for ``self`` as for an ``isolated`` module-level variable. An object field is mutable unless it is ``final`` and has a type that is a subtype of ``readonly``.

This approach makes the service objects fully concurrency safe when accessed from within a Listener to call remote methods. The isolated root concept treats the ``isolated`` objects as opaque. Additionally, ``isolated`` functions can access a ``final`` variable whose type is an ``isolated`` object.

### Inferring ``isolated``

The whole concept around isolation is quite confusing for an application developer to understand. It is a complex feature, but you do not have to worry about it because the compiler can figure it out for you most of the time.

A typical Ballerina application consists of a single module that imports multiple library modules. With a single module, the compiler can infer ``isolated`` qualifiers. For example, if there is a service object without mutable fields, then it is inherently ``isolated``.

The application programmer must use the ``lock`` statement responsibly wherever it is needed to safeguard the mutability of the data. This is applicable to both accessing ``self`` in a service object with mutable state and accessing mutable module-level variables. Additionally, the Ballerina compiler can warn the developer where missing locks are preventing a service object or method from being ``isolated``.
    