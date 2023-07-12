---
layout: debugging-ballerina-programs-left-nav-pages-swanlake
title: Debug Ballerina programs
description: Describes debugging functionalities provided by Ballerina in Visual Studio Code.  
keywords: ballerina debugging, ballerina debug, ballerina debugger, ballerina vs code
permalink: /learn/debug-ballerina-programs/
active: debug-ballerina-programs
---

The Ballerina compiler comes in handy to detect syntax and semantic issues that occur in your code when developing large-scale applications with complex logic. However, it is difficult for the compiler to detect runtime errors like logical errors because they occur during the program execution after a successful compilation. This is where the dedicated debugging tooling support of Ballerina becomes important.

## Debugging sessions

The Ballerina VS Code extension offers three types of debugging sessions (i.e., program debugging, test debugging, and remote debugging). Debugging sessions can be initiated using CodeLens or configurations in a `launch.json file`. It also provides a **Debug Console** to view the output and perform various debugging scenarios.

>**Info:** For more information on the debugging sessions and methods, go to <a href="https://wso2.com/ballerina/vscode/docs/debug-the-code/debug-sessions/" target="_blank">Debugging sessions</a>.

## Debugging features

The Ballerina VS Code extension provides a range of powerful debugging features. You can set breakpoints with conditions and logpoints, pause and continue program execution for precise inspection, evaluate expressions at runtime, and view call stacks and strands. These features enhance the debugging experience, enabling effective troubleshooting and analysis of Ballerina code.

>**Info:** For detailed information on the feature-rich debugging experience for troubleshooting Ballerina applications provided via the Ballerina VS Code extension, go to <a href="https://wso2.com/ballerina/vscode/docs/debug-the-code/debug-features/" target="_blank">Debugging features</a>.

## Debugging configurations

The Ballerina debugger allows you to create a `launch.json` file with default configurations for debugging Ballerina programs. You can generate the file by following a few steps and then, modify the configurations to suit your needs. These configurations have specific attributes that can be edited to customize the debugging process so that you can set program arguments, command options, environment variables, run in a separate terminal, etc. Additionally, you can configure remote debugging by specifying the host address and port number. These configurations provide flexibility and control when debugging Ballerina code in VS Code.

>**Info:** For more information on the debugging configurations, go to <a href="https://wso2.com/ballerina/vscode/docs/debug-the-code/debug-configurations/" target="_blank">Debugging configurations</a>.
