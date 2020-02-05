---
layout: ballerina-inner-page
title: Language intelligence
permalink: /v0-991/learn/vscode-plugin/language-intelligence
redirect_from:
  - /v0-991/learn/tools-ides/vscode-plugin/language-intelligence
  - /v0-991/learn/tools-ides/vscode-plugin/language-intelligence/
---

# Language intelligence

The VS Code Ballerina extension brings in language intelligence to enhance the development experience and increase its efficiency.

Language intelligence is built in to the extension via a Language Server implementation, which consists of the below language intelligence options.

- [Semantic and syntactic diagnostics](#semantic-and-syntactic-diagnostics)
- [Suggestions and auto completion](#suggestions-and-auto-completion)
- [Go to definition](#go-to-definition)
- [Find all references](#find-all-references)
- [Code actions](#code-actions)
- [Refactoring options](#refactoring-options)
- [Hover support](#hover-support)
- [Signature help support](#signature-help-support)
- [Document symbols](#document-symbols)
- [Workspace symbols](#workspace-symbols)

## Semantic and syntactic diagnostics

When there are syntax or semantic errors in your code, you will be notified with appropriate diagnostics during the development time. 

> **Tip**: The detailed description that appears when you hover over the lines underlined in red will be consistent with the error message that you get during compile-time.

![Semantic and syntactic diagnostics](/v0-991/learn/images/semantic-and-syntactic.gif)

## Suggestions and auto completion

The extension provides you with suggestions on keywords, variables, and code snippets of language constructs (such as functions, services, and iterable constructs etc.).

![Suggestions and auto completion](/v0-991/learn/images/suggestions.gif)

> **Tip**: You can use these suggestions to access the contents of the modules available in your Ballerina home repo as well as in the Ballerina distribution.

## Go to definition

This option allows you to view the definition of a selected variable, function, an object etc. within the same file, in a separate file, in the same module, or in a file of a different module, of the same project.

![Go to definition](/v0-991/learn/images/go-to-definition.gif)

## Find all references

This option allows you to find all the references of a selected variable, function, an object etc. within the same file, in a separate file, in the same module, or in a file of a different module, of the same project.

![Find all references](/v0-991/learn/images/find-all-references.gif)

## Code actions

These allow you to perform the below tasks easily based on the diagnostics and the current scope where the cursor resides. 

- Add documentation for an entity such as a function, service, resource, object, record etc.
- Add documentation for all the available entities in the current file
- Add missing imports 
- Create variable definitions
- Create an undefined function

For example, you can add documentation for a function as shown below.

 ![Code actions](/v0-991/learn/images/code-actions.gif)

## Refactoring options

 The current Language Server implementation supports the below refactoring options.

 - Rename a variable, function name, and other entities
 - Add missing imports automatically when you select a completion item 
 - Using code actions such as adding the missing imports, adding documentation, and creating undefined functions and variables.

 For example, you can refactor your code to add missing imports corresponding to a service via a code action as shown below.

 ![Refactoring options](/v0-991/learn/images/refactoring-options.gif)

## Hover support

 Hover support provides you quick access to information about a certain entity. 
 
 For an example, if you hover over a function name, you can view its description, information about its parameters, and the description of its return type as shown below.

  ![Hover support](/v0-991/learn/images/hover-support.gif)
 
 > **Tip**: Likewise, if you hover over an entity name of an object or a record, you can view the description of the object/record as well as descriptions of its fields.

## Signature help support

  This provides the descriptions of the parameters of the function while you are typing your code. Signature help will automatically trigger you typing the open parenthesis (i.e., “(“) as well as the comma.
 
 ![Signature help support](/v0-991/learn/images/signature-help-support.gif)

## Document symbols

 Document symbols provide the list of all the visible symbols in a certain file including symbols of functions, services, endpoints etc. 

> **Tip**: You can access the document symbols palette by pressing the **Control + Shift + O** keys.

![Document symbols](/v0-991/learn/images/document-symbols.gif)

## Workspace symbols

Workspace symbols provide you all the symbols of the current project. These symbols include symbols of services, functions, objects etc. in different the modules of the same project.

> **Tip**: You can access the workspace symbols palette by pressing the **Control + T** keys.

![Workspace symbols](/v0-991/learn/images/workspace-symbols.gif)

Above are the lanugage intelligence features that are currently available in the Ballerina VS Code Extension. 

## What's next?

 - For information on the next capability of the VS Code Ballerina extension, see [Run and Debug](/v0-991/learn/vscode-plugin/run-and-debug).
 - For information on the VS Code Ballerina extension, see [The Visual Studio Code Ballerina Extension](/v0-991/learn/vscode-plugin).
