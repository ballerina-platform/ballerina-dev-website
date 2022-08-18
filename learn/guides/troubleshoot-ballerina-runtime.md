---
layout: troubleshooting-ballerina-runtime-left-nav-pages-swanlake
title: Troubleshoot Ballerina runtime
description: Check out how you can troubleshoot and inspect Ballerina runtime.  
keywords: ballerina runtime, troubleshoot, strand dump, thread dump
permalink: /learn/troubleshoot-ballerina-runtime/
active: troubleshoot-ballerina-runtime
redirect_from:
  - /swan-lake/learn/troubleshoot-ballerina-runtime/
  - /swan-lake/learn/troubleshoot-ballerina-runtime
  - /learn/troubleshooting-ballerina-runtime/
  - /learn/troubleshooting-ballerina-runtime
  - /learn/ballerina-strand-dump/
  - /learn/ballerina-strand-dump
---

Ballerina runtime can have unexpected behaviors due to user code errors, bugs or issues with the running environment. 
These will result in memory leaks, CPU spinning, runtime hangs, performance degradation or crashes with various errors. 
Ballerina provides a tool to dump the status of currently running strands.

## Strand dump

Ballerina strand dump provides information on the available strands and strand groups during the execution of 
a Ballerina program. This can be used to:

- troubleshoot runtime errors,

- find data races, race conditions, livelocks and deadlocks,

- inspect strand and strand group status.

>**Note:** Currently, this ability is only available in the operating systems where the `SIGTRAP` POSIX signal is supported (`SIGTRAP` is not available on Windows).

### Getting strand dump

To get the strand dump when a Ballerina program is running, you need to know the process ID (PID) of the Ballerina 
program. For that you can use the `jps` tool. Then you need to send the `SIGTRAP` signal to the process. The strand 
dump will be produced to the standard output stream in the text format.

As an example, consider the following Ballerina program.

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

Run this Ballerina package using
```
$ bal run
Compiling source
	demo/strandDump:0.1.0

Running executable
```

While the program is running, obtain its PID.
```
$ jps
3408 Main
28851 Jps
28845 $_init
```
Here for this program we get the PID as 28845, because `$_init` is the main class of the Ballerina program. 
To get the strand dump, send the `SIGTRAP` signal to that process. You can use the following CLI command.
```
$ kill -SIGTRAP 28845
```
or
```
$ kill -5 28845
```

Then the dump of the runtime strands will be emitted to the standard output stream of the Ballerina program. 
You can see a sample below.
```text
Ballerina Strand Dump [2022/07/26 14:34:31]
===========================================
 
Current no. of strand groups    :       2
Current no. of strands          :       4
 
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

### Format and available details

The strand dump contains the information of the date and the time when the strand dump was obtained, and the current 
no. of strand groups and strands available. The details will be given in the following format.

![Strand dump output format](/learn/images/strand-dump-format.svg "Strand dump output format")

Label | Description
-- | --
Strand group ID | A unique ID given to a particular strand group. A strand group comprises a set of strands which run on the same thread.
Strand group state | Current state of the strand group. [See available states.](/learn/troubleshoot-ballerina-runtime/#strand-group-states)
Current no. of strands in the strand group | A strand group consists of one or more strands. Only one of them runs on a thread at a time.
Strand ID | A unique ID given to a particular strand.
Strand name | Name of the strand associated with the strand ID. This is optional and omitted if not available.
Strand initiated module | Name of the module which created the strand.
Strand initiated function | Name of the function which created the strand.
Parent strand ID | ID of the parent strand. Omitted if there is no parent strand.
Strand state | Current state of the strand. [See available states.](/learn/troubleshoot-ballerina-runtime/#strand-states)
Strand yielded location stack trace | The stack trace which points to the location where the strand is blocked (yielded). This is omitted if the state is RUNNABLE or DONE. A line in the stack trace is given by the format: `module name:function name(filename:line number)`

#### Strand group states

State | Description
-- | --
RUNNABLE | Strand group is ready to run or currently running.
QUEUED | Strand group execution is blocked or completed or it comprises a new set of strands which are not yet scheduled to run.

#### Strand states

State | Description
-- | --
WAITING FOR LOCK | Strand is waiting to acquire a lock.
BLOCKED ON WORKER MESSAGE SEND | Strand is blocked due to `sync send` action.
BLOCKED ON WORKER MESSAGE RECEIVE | Strand is blocked due to `receive` action.
BLOCKED ON WORKER MESSAGE FLUSH | Strand is blocked due to `flush` action.
WAITING | Strand is blocked due to `wait` action.
BLOCKED | Strand is blocked due to any other reason than the above. E.g. sleep, external function call, etc.
RUNNABLE | Strand is ready to run or currently running.
DONE | Strand execution is completed.
