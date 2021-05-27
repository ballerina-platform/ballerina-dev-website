---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Language Support
permalink: /learn/tooling-guide/visual-studio-code-extension/language-support/
active: intellisense
intro: The Visual Studio Code Ballerina extension brings in language support to enhance the development experience and increase its efficiency. This is built into the extension via a Language Server implementation, which consists of the below features.
description: The Visual Studio Code Ballerina extension brings in language support to enhance the development experience and increase its efficiency. This is built into the extension via a Language Server implementation, which consists of the below features.
redirect_from:
  - /learn/tools-ides/vscode-plugin/language-intelligence
  - /learn/tools-ides/vscode-plugin/language-intelligence/
  - /learn/vscode-plugin/language-intelligence/
  - /learn/vscode-plugin/language-intelligence
  - /learn/tools-ides/setting-up-visual-studio-code/language-intelligence
  - /learn/tools-ides/setting-up-visual-studio-code/language-intelligence/
  - /learn/setting-up-visual-studio-code/language-intelligence
  - /learn/setting-up-visual-studio-code/language-intelligence/
  - /learn/language-intelligence
  - /learn/language-intelligence/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code/language-intelligence/
  - /swan-lake/learn/getting-started/setting-up-visual-studio-code/language-intelligence
  - /learn/tooling-guide/vs-code-extension/language-support/language-intelligence
  - /learn/tooling-guide/vs-code-extension/language-support/language-intelligence/
  - /learn/tooling-guide/visual-studio-code-extension/language-support/language-intelligence
  - /learn/tooling-guide/visual-studio-code-extension/language-support/language-intelligence/
  - /learn/tooling-guide/visual-studio-code-extension/language-support
---

## IntelliSense

### Code Completion

The extension provides you with suggestions on variables, keywords, and code snippets of language constructs (such as functions, type definitions, services, iterable constructs, etc.)

![Code Completion](/learn/images/code-completion.gif)

#### Symbol Information on Hover

When hovering over a symbol name, you will be provided with quick information about the particular symbol. For example, when hovering over a function name, you will be prompted with the associated documentation.

![Symbol Information on Hover](/learn/images/symbol-information-on-hover.gif)

#### Signature Help

When typing a function/method call expression, the signature help will show information such as the function/method call’s description and parameter information. Signature help will be triggered when typing the open parenthesis and comma.

![Signature Help](/learn/images/signature-help.gif)

## Code Navigation

### Go to Definition 

For a symbol, this feature will navigate you to the definition of the particular symbol. For example, when invoking the go to definition from a function call expression, you will be navigated to the definition of the function. Apart from jumping to the definition, the peek definition will also be supported. The behaviour will be the same not only for the constructs within the sources in the current package but also for external modules and standard libraries as well.

![Go to Definition](/learn/images/go-to-definition.gif)

### Find all References

Invoking the references on a symbol will prompt you with all the symbol references in the current package.

![Find all References](/learn/images/find-all-references.gif)

## Diagnostics

The diagnostics show you the syntax and semantic errors in the source code. Varieties of diagnostics such as errors and warnings will be shown. For a selected set of diagnostics, you can see the quick fixes. For example, the `variable assignment is required` diagnostic will have two associated quick fixes to create a new variable and ignore the return value.

![Diagnostics](/learn/images/diagnostics.gif)

## Refactoring and Code Fixes

### Code Formatting

Code formatting has the two options below. 

  - Formatting a document 

  ![Formatting a Document](/learn/images/format-document.gif)

  - Formatting a selected range in the document

  ![Formatting a Document Range](/learn/images/format-document-range.gif)

### Rename Symbols

This feature allows you to rename symbols by renaming all the references of the particular symbol.

![Rename Symbols](/learn/images/rename-symbols.gif)

### Code Lenses

#### Documentation Code Lens

The `Document This` code lens is shown for the public functions without documentation. 

![Documentation Code Lens](/learn/images/documentation-code-lens.gif)

#### Run and Debug Code Lenses

Run and debug code lenses are shown for the entry points of the Ballerina project and for its test cases. The entry points include the main function and the services within the default module of the project.

![Run and Debug Code Lenses](/learn/images/run-and-debug-code-lenses.gif)

### Code Actions

There are two types of code actions suggested based on the node at a given cursor position and based on the diagnostic at a given cursor position.

## Create Variables

The sections below demonstrates the types of code actions available for creating a variable.

### Create Variable

Create a variable for an expression where the `Variable Assignment Required` diagnostic is present.

![Create Variable](/learn/images/create-variable.gif)

### Create Variable and Type Guard

Create a type guard to handle the error gracefully when the `Variable assignment Required` diagnostic is present.

![Create Variable and Type Guard](/learn/images/create-variable-and-type-guard.gif)

### Create Variable and Check Error

Add a check expression when the `Variable assignment Required` diagnostic is present.

![Create Variable and Check Error](/learn/images/create-variable-and-check-error.gif)

### Ignore Return Value

Ignore the return value with the `_` where the `Variable Assignment Required` diagnostic is present.

![Ignore Return Value](/learn/images/ignore-return-value.gif)

## Union Type Variables

The sections below demonstrates the code actions available for union type variables.

### Type Guard variable

Type guard a variable, if the variable is of the union type.

![Type Guard variable](/learn/images/type-guard-variable.gif)

### Add Check Error

When there is an error union, add a check statement.

![Add Check Error](/learn/images/add-check-error.gif)

## Imports

The sections below demonstrates the code actions available for imports.

### Import a Module

Add the import statement for a module, which has a reference without an import statement. This supports only the langlibs and the standard libraries.

![Import a Module](/learn/images/import-module.gif)

### Optimize Imports

Optimize the import statements to remove unused imports and arrange the imports on the alphabetical order.

![Optimize Imports](/learn/images/optimize-imports.gif)

## Documentation

The sections below demonstrates the code actions available for documentation.

### Document This

Add the documentation to the top-level constructs, resources, and methods.

![Document This](/learn/images/document-this.gif)

### Document All

Document all the top-level constructs.

![Document All](/learn/images/document-all.gif)

### Update Documentation

Update the existing documentation when parameters are missing or not documented. This depends on the warning diagnostic sent by the compiler.

![Update Documentation](/learn/images/update-documentation.gif)


## Incompatible Types

The sections below demonstrates the code actions available for incompatible types.

### Change Variable Type

Changes the type of a variable.

![Change Variable Type](/learn/images/change-variable-type.gif)

### Add Type Cast

Add a type cast for the incompatible types.

![Add Type Cast](/learn/images/add-type-cast.gif)

### Fix Return Type

Changes the incompatible return type.

![Fix Return Type](/learn/images/fix-return-type.gif)

### Change Parameter Type

Changes the type of a function/ method parameter.

![Change Parameter Type](/learn/images/change-parameter-type.gif)

## Create Functions

The sections below demonstrates the code actions available for creating functions.

### Create a Function

Creates a function using the selected variables/parameters.

![Create a Function](/learn/images/create-function.gif)

### Implement a Method

Implements the selected method.

![Implement a Method](/learn/images/implement-method.gif)










