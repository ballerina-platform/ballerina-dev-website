---
layout: ballerina-why-ballerina-left-nav-pages-swanlake
title: Concurrent
description: Concurrency in Ballerina is enabled by strands, which are lightweight threads. 
keywords: ballerina, ballerina platform, concurrency, workers, strands, threads, lightweight threads
permalink: /why-ballerina/concurrent/
active: concurrent
intro: Concurrency in Ballerina is enabled by strands, which are lightweight threads.
---

Ballerina's concurrency model supports both threads and coroutines and has been designed to have a close correspondence with sequence diagrams.

A Ballerina program is executed on one or more threads. A thread can consist of one or more strands, which are language-managed, logical threads of control. Only one strand of a particular thread can run at a time. The strands belonging to a single thread are cooperatively multitasked. Therefore, strands of a single thread behave as coroutines relative to each other.

Strands enable cooperative multitasking by "yielding". The runtime scheduler may switch the execution of a strand only when it yields via a `wait` action, a worker receive action, a library function resulting in a blocking call, etc.

A strand is created due to the execution of either a named worker declaration or `start` action.

Concurrent operations in a function can be defined by multiple named workers. A function has a default worker and may additionally contain named workers. A worker executes concurrently with the other workers (function worker and named workers) in the function.

```ballerina
import ballerina/io;

type Person record {|
    string name;
    boolean employed;
|};

function process(Person[] members, int[] quantities) {
    worker w1 {
        Person[] employedMembers = from Person p in members
            where p.employed
            select p;
        int count = employedMembers.length();
        count -> w2;
        string `Employed Members: ${count}` -> function;
    }

    worker w2 {
        int total = int:sum(...quantities);

        int employedCount = <- w1;

        int avg = employedCount == 0 ? 0 : total / employedCount;
        string `Average: ${avg}` -> function;
    }

    string x = <- w1;
    io:println(x);

    string y = <- w2;
    io:println(y);
}
```

Worker message passing (via Ballerina’s `send (->)` and `receive (<-)` actions) is used for communication between workers. The compiler also explicitly verifies that the `send` and `receive` actions are in a consistent state to avoid any deadlock scenarios at runtime.

A strand in Ballerina runs on a separate thread if it is safe. The isolated feature is used to identify such cases. 
A call to an isolated function is concurrency-safe if it is called with arguments that are safe at least until the 
call returns. The strand created in a `start` action for an isolated function may run on a separate thread. The strand 
of a named worker may run on a separate thread from the default worker if the function is isolated.

```ballerina
import ballerina/io;

type Person record {|
    string name;
    boolean employed;
|};

isolated function process(Person[] & readonly members, int[] & readonly quantities) {
    worker w1 {
        Person[] employedMembers = from Person p in members
            where p.employed
            select p;
        int count = employedMembers.length();
        count -> function;
    }

    int totalMemberCount = members.length();

    int memberCount = <- w1;
    io:println(string `Employed Members: ${memberCount}`);

    future<int> avgFuture = start get_average(quantities, memberCount);

    int unemployedCount = totalMemberCount - memberCount;
    io:println(string `Unemployed Members: ${unemployedCount}`);

    int avg = checkpanic wait avgFuture;
    io:println(string `Average: ${avg}`);
}

isolated function get_average(int[] & readonly quantities, int employedCount) returns int {
    int total = int:sum(...quantities);
    int avg = employedCount == 0 ? 0 : total / employedCount;
    return avg;
}
```

Concurrency in Ballerina works well with sequence diagrams. A function can be viewed as a sequence diagram. Each worker is represented by a separate lifeline (vertical line).

Immutability in the type system can be leveraged to write reliable concurrent programs. Immutability in Ballerina is deep guaranteeing that an immutable structure will always have only immutable values. Therefore, an immutable value can be safely accessed concurrently without using a lock statement.

```ballerina
type Details record {|
    int id;
    string location?;
|};

function process(map<Details> & readonly entities) {
    string[] detailsWithLocation = [];
    string[] detailsWithoutLocation = [];

    foreach var [name, details] in entities.entries() {
        if details.hasKey("location") {
            detailsWithLocation.push(name);
        } else {
            detailsWithoutLocation.push(name);
        }
    }

    // The casts within the workers are safe because the lists were created
    // based on an immutable map and is therefore guaranteed to have the 
    // exact same entries with the exact same fields.
    worker w1 {
        foreach var name in detailsWithoutLocation {
            persistId(<record {|int id;|} & readonly>entities.get(name));
        }
    }

    worker w2 {
        foreach var name in detailsWithLocation {
            persistIdWithLocation(
                <record {|int id; string location;|} & readonly>entities.get(name));
        }
    }
}

function persistId(record {|int id;|} rec) {

}

function persistIdWithLocation(record {|int id; string location;|} rec) {

}
```

<style>
.cBallerinaTocContainer {
    display: none !important;
}
/*.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}*/
</style>
