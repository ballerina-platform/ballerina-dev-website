# IntelliSense

The sections below describe the IntelliSense features that can be used to edit Ballerina code via the VS Code extension.

## Code completion and snippets
The extension provides suggestions on variables, keywords, and code snippets of language constructs (such as functions, type definitions, services, iterable constructs, etc.).

![Code completion](../img/edit-the-code/intellisense/code-completion.gif){.cInlineImage-full}

Following are some key features of the code completion support provided by the extension.

### Context-aware completion items
The completion items list is sorted based on the context of the current cursor position.

![Context aware completion](../img/edit-the-code/intellisense/context-aware-completions.gif){.cInlineImage-full}

### Suggestions for service templates
Service templates corresponding to each available listener are provided in the list of completion items.

![Service template completion](../img/edit-the-code/intellisense/service-template-completion.gif){.cInlineImage-full}

### Completion support for iterables
The `foreach` and `foreach i` completion items are provided for iterable variables.

![Foreach completion](../img/edit-the-code/intellisense/foreach-completion.gif){.cInlineImage-full}

### Completion support for type guarding a variable
The `typeguard` completion item is provided for union-typed variables.

![Type guard completion](../img/edit-the-code/intellisense/type-guard-completion.gif){.cInlineImage-full}

### Filling required fields of a record
The `Fill Record required fields` completion item is provided for filling the remaining fields of a `Record`-typed value.

![Fiill required record fields](../img/edit-the-code/intellisense/fill-req-fileds-completion.gif){.cInlineImage-full}

## Help via hover
When hovering over a symbol name, you will be provided with quick information about the particular symbol. For example, when hovering over a function name, you will be prompted with the associated documentation.

![Help via hover](../img/edit-the-code/intellisense/symbol-information-on-hover.gif){.cInlineImage-full}

## Signature help
When typing a function/method call expression, the signature help will show information such as the function/method call’s description and parameter information. Signature help will be triggered when typing the open parenthesis and comma.

![Signature help](../img/edit-the-code/intellisense/signature-help.gif){.cInlineImage-full}
