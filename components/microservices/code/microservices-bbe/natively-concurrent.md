---
title: 'Native support for concurrency'
description: Ballerina combines the benefits of static typing and native support for concurrency. By catching errors early during development, the language ensures greater reliability and stability in microservices systems. Additionally, Ballerina's concurrency support enables developers to handle concurrent operations efficiently, improving the performance and responsiveness of their microservices.
---
```
import ballerina/http;

type Person record {|
    string name;
    boolean employed;
|};

type Summary record {|
    int count;
    int average;
|};

int[] tasks = [1, 4, 5, 2, 7, 4];

service on new http:Listener(8080) {
    resource function post person\-tasks(Person[] members) returns Summary {
        return process(members, tasks);
    }
}

function process(Person[] members, int[] tasks) returns Summary {
    worker w1 {
        Person[] employedMembers = from Person p in members where p.employed select p;
        int count = employedMembers.length();
        count -> w2;
        count -> function;
    }

    worker w2 {
        int total = int:sum(...tasks);
        int employedCount = <- w1;
        int avg = employedCount == 0 ? 0 : total / employedCount;
        avg -> function;
    }

    int count = <- w1;
    int average = <- w2;
    return {count, average};
}
```