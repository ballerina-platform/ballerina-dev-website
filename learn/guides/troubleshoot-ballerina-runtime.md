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
These will result in memory leaks, cpu spinning, runtime hangs, performance degradation or crashes with 
various exceptions. These will be critical when they happen in a production environment. The Ballerina compiler 
provides support in detecting syntax and semantic issues. However, it is very difficult for a compiler 
to detect runtime errors like logical errors because they occur during the program execution after a 
successful compilation. This is where the dedicated runtime troubleshooting support becomes important to find out 
the root causes for fixing or avoiding those unexpected behaviors in the future.

Currently, we provide the ability to get the status of strands during the execution of a Ballerina program 
via a strand dump.

## Strand dump

Ballerina strand dump provides information on the available strands and strand groups during the execution of 
a Ballerina program. This can be used to:
- troubleshoot runtime errors,
- find data races, race conditions, livelocks and deadlocks,
- inspect strand and strand group status.

Currently, this ability is only available in the operating systems where the TRAP POSIX signal is supported.

### Getting strand dump

To get the strand dump when a Ballerina program is running, you need to know the PID of the Ballerina program. 
For that you can use the jps tool. Then you need to send the SIGTRAP signal to that process. The strand dump will 
be outputted to the standard out stream in the text format.

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
```bash
$ bal run
Compiling source
	demo/strandDump:0.1.0

Running executable
```

While the program is running, obtain its PID.
```bash
$ jps
3408 Main
28851 Jps
28845 $_init
```
Here for this program we get the PID as 28845. To get the strand dump, send the SIGTRAP signal to that process. 
You can use the CLI command
```bash
$ kill -SIGTRAP 28845
```
or
```bash
$ kill -5 28845
```

Then the strand dump at that moment will be emitted to the standard output stream of the Ballerina program. 
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

The strand dump would contain the date and time the strand dump was obtained, and the current no. of strand groups 
and strands available. The details will be given in the following format.

![Strand dump output format](/learn/images/strand-dump-format.png "Strand dump output format")

- strand group ID - a unique ID given to a particular strand group. A strand group comprises a set of strands which run on the same thread.
- strand group state - current state of the strand group. Available states are,
    1. [RUNNABLE] - strand group is ready to run or currently running
    2. [QUEUED] - new set of strands which are not yet scheduled to run, or the strand group execution is blocked or completed
- current no. of strands in the strand group
- strand id - a unique ID given to a particular strand.
- strand name - name of the strand associated with the strand ID. This is optional and omitted if not available.
- strand initiated module - name of the module which created the strand
- strand initiated function - name of the function which created the strand
- parent strand ID - ID of the parent strand. Omitted if there is no parent strand.
- strand state - current state of the strand. Available states are,
    1.   [WAITING FOR LOCK] - strand is waiting to acquire lock
    2.   [BLOCKED ON WORKER MESSAGE SEND] - strand is blocked due to sync send action
    3.   [BLOCKED ON WORKER MESSAGE RECEIVE] - strand is blocked due to receive action
    4.   [BLOCKED ON WORKER MESSAGE FLUSH] - strand is blocked due to flush action
    5.   [WAITING] - strand is blocked due to wait action
    6.   [BLOCKED] - strand is blocked due to any other reason than the above. eg: function call
    7.   [RUNNABLE] - strand is ready to run or currently running
    8.   [DONE] - strand execution is completed
- strand yielded location stacktrace - this is omitted if the state is RUNNABLE/DONE. If the strand is blocked (yielded), this gives the stack trace which points to the location where it was blocked. A line in the stacktrace is given by the format: module name:function name(filename:line number)
 
