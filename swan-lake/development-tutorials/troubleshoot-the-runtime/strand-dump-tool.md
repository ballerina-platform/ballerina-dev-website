---
title: Strand dump tool
description: Check out how you can dump and inspect the currently available strands of a Ballerina program.
keywords: ballerina runtime, troubleshoot, strand dump, thread dump
permalink: /learn/strand-dump-tool/
active: strand-dump-tool
---

The Ballerina runtime can have unexpected behaviors due to user code errors, bugs, or issues with the running environment. 
These will result in memory leaks, CPU spinning, runtime hangs, performance degradation or crashing with various errors. 
Ballerina provides a tool to dump the status of currently running strands.

## Strand dump

Ballerina strand dump provides information on the available strands and strand groups during the execution of 
a Ballerina program. This can be used to:

- troubleshoot runtime errors

- find data races, race conditions, livelocks, and deadlocks

- inspect strand and strand group status

>**Note:** Currently, this ability is only available in the operating systems in which the `SIGTRAP` POSIX signal is supported (`SIGTRAP` is not available on Windows).

### Get the strand dump

To get the strand dump when a Ballerina program is running, you need to know the process ID (PID) of the Ballerina 
program. For that, you can use the `jps` tool. Then, you need to send the `SIGTRAP` signal to the process. The strand 
dump will be produced to the standard output stream in the text format.

For example, consider the following Ballerina program.
```ballerina
import ballerina/lang.runtime;
import ballerina/io;

public function main() {
    future<int> addResult = start addnum(1, 2);
    int|error addition = wait addResult;
    io:println(addition);
}

function addnum(int num1, int num2) returns int {

    worker sender {
        runtime:sleep(1000);
        num1 -> receiver;
    }

    worker receiver returns int {
        int firstNum = <- sender;
        return num2 + firstNum;
    }

    int intResult = wait receiver;
    return intResult;
}
```

Run this Ballerina package using the `bal run` command.
```
$ bal run
Compiling source
	demo/strandDump:0.1.0

Running executable
```

Obtain its PID while the program is running.
```
$ jps
3408 Main
28851 Jps
28845 $_init
```

You get the PID for this program as 28845 because `$_init` is the main class of the Ballerina program.

>**Note:** If you run the tests in a Ballerina package or a file using the `bal test` command, you need to get the 
PID of the process denoted by the `BTestMain` classname.

To get the strand dump, send the `SIGTRAP` signal to that process. You can use the following CLI command.
```
$ kill -SIGTRAP 28845
```
or
```
$ kill -5 28845
```

Then, the dump of the runtime strands will be emitted to the standard output stream of the Ballerina program. 
For example, see the sample below.
```text
Ballerina Strand Dump [2022/10/12 12:08:02]
===========================================

Total strand group count        :       5
Total strand count              :       5
Active strand group count       :       2
Active strand count             :       4

group 4 [QUEUED]: [1]
        strand 2 "main" [demo.strandDump.0:main] [WAITING]:
                at      demo.strandDump.0.1.0:main(main.bal:6)

group 5 [QUEUED]: [3]
        strand 3 "addResult" [demo.strandDump.0:main][2] [WAITING]:
                at      demo.strandDump.0.1.0:addnum(main.bal:22)

        strand 4 "sender" [demo.strandDump.0:addnum][3] [BLOCKED]:
                at      ballerina.lang.runtime.0.0.0:sleep(runtime.bal:61)
                        demo.strandDump.0.1.0:$lambda$_0(main.bal:13)

        strand 5 "receiver" [demo.strandDump.0:addnum][3] [BLOCKED ON WORKER MESSAGE RECEIVE]:
                at      demo.strandDump.0.1.0:$lambda$_1(main.bal:18)

===========================================
```

### Output format and available details

The strand dump contains the following information.

- the date and the time when the strand dump was obtained

- the total number of strand groups and strands created in the program

- the active number of strand groups and strands in the program

The details on the active strand groups and strands are given in the following format.

![Strand dump output format](/learn/images/strand-dump-output-format.svg "Strand dump output format")

Label | Description
-- | --
Strand group ID | A unique ID given to a particular strand group. A strand group comprises a set of strands that run on the same thread.
Strand group state | Current state of the strand group. For the available states, see [Strand group states](/learn/strand-dump-tool/#strand-group-states).
The current number of strands in the strand group | A strand group consists of one or more strands. Only one of them runs on a thread at a time.
Strand ID | A unique ID given to a particular strand.
Strand name | Name of the strand associated with the strand ID. This is optional and will be omitted if not available.
Strand initiated module | Name of the module, which created the strand.
Strand initiated function | Name of the function, which created the strand.
Parent strand ID | ID of the parent strand. This will be omitted if there is no parent strand.
Strand state | Current state of the strand. For the available states, see [Strand states](/learn/strand-dump-tool/#strand-states).
Strand yielded location stack trace | The stack trace, which points to the location where the strand is blocked (yielded). This is omitted if the state is `RUNNABLE` or `DONE`. A line in the stack trace is given by the format: <br />`module name:function name(filename:line number)`

#### Strand group states

State | Description
-- | --
RUNNABLE | Strand group is ready to run or is currently running.
QUEUED | Strand group execution is blocked or completed or it comprises a new set of strands that are not yet scheduled to run.

#### Strand states

State | Description
-- | --
WAITING FOR LOCK | Strand is waiting to acquire a lock.
BLOCKED ON WORKER MESSAGE SEND | Strand is blocked due to the `sync send` action.
BLOCKED ON WORKER MESSAGE RECEIVE | Strand is blocked due to the `receive` action.
BLOCKED ON WORKER MESSAGE FLUSH | Strand is blocked due to the `flush` action.
WAITING | Strand is blocked due to the `wait` action.
BLOCKED | Strand is blocked due to any other reason than the above. E.g., sleep, external function call, etc.
RUNNABLE | Strand is ready to run or is currently running.
DONE | Strand execution is completed.
