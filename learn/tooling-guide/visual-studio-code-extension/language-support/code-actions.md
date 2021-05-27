---
layout: ballerina-tooling-guide-left-nav-pages-swanlake
title: Code Actions
permalink: /learn/tooling-guide/visual-studio-code-extension/language-support/code-actions/
active: code-actions
intro: The sections below demonstrates all code actions that belong to the two types based on the node at a given cursor position and based on the diagnostic at a given cursor position.
description: The sections below demonstrates all code actions that belong to the two types based on the node at a given cursor position and based on the diagnostic at a given cursor position.
redirect_from:
  - /learn/tooling-guide/visual-studio-code-extension/language-support/code-actions
---

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

















