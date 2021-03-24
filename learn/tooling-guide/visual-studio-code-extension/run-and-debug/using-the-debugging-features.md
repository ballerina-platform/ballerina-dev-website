---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Using the Debugging Features
permalink: /learn/tooling-guide/visual-studio-code-extension/run-and-debug/using-the-debugging-features/
active: using-the-debugging-features
intro: Visual Studio Code allows you to debug Ballerina programs through the Ballerina extension. The debugging features below are supported by Ballerina. 
redirect_from:
  - /learn/tooling-guide/visual-studio-code-extension/run-and-debug/using-the-debugging-features
---

>**Info** The Ballerina debugger is an open-source project and contributors are mostly welcome to get engaged with it via the [ballerina-lang](https://github.com/ballerina-platform/ballerina-lang) GitHub repository. If you encounter any difficulties when using this feature, feel free to create an issue in it.

## Launch/Attach

## Breakpoints

## Pause & Continue

## Step In/Out/Over

## Variables

## Call Stacks

## Strands

## Expression Evaluation

Ballerina expression evaluator allows evaluating Ballerina variables and expressions at runtime allowing them to be viewed when the IDE is in the break mode.

The Ballerina VSCode debugger lets you evaluate expressions in the ways below.

### Using the Debug Console

### Using the Watch Window

### Existing Limitations

- Anonymous function, query, and let expressions are currently not supported.
- Qualified identifiers are not supported (hence, cannot evaluate imported module entities).
- Function invocations with rest arguments are work-in-progress.
- Constructor expressions (list, map, table) are work-in-progress.

For more informmation on the Ballerina expression types, see the [Ballerina Language Specification](/spec/).
