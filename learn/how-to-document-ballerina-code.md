---
layout: ballerina-left-nav-pages
title: How to Document Ballerina Code
description: Learn how to write unstructured documents with a bit of structure to enable HTML content generation as API documentation.
keywords: ballerina, programming language, api documentation, api docs
permalink: /learn/how-to-document-ballerina-code/
active: how-to-document-ballerina-code
redirect_from:
  - /learn/how-to-document-ballerina-code
  - /v1-2/learn/how-to-document-ballerina-code
  - /v1-2/learn/how-to-document-ballerina-code/
---

# How to Document Ballerina Code

Ballerina has a built-in Ballerina Flavored Markdown (BFM) documentation framework named Docerina. The documentation framework allows you to write unstructured documents with a bit of structure to enable generating HTML content as API documentation.

Developers can write the documentation inline with the Ballerina source code using the lightweight [markdown](https://daringfireball.net/projects/markdown/syntax) markup language. They can document special constructs such as parameters, return values, fields, etc. within the code using documentation attributes. Once the code is documented, developers can generate a basic HTML version of their Ballerina modules using the `ballerina doc` command. Developers are encouraged to have their custom themes and styles, to have a standard presentation of their Ballerina documentation.

Ballerina documentation design and usage is aligned with project and module semantics of Ballerina. You can generate documentation for modules using the `ballerina doc` command.


## Overview

* Ballerina programmers can place the documentation inline with the source code using the documentation syntax.
* Ballerina type definitions, global variables, annotations, listeners, etc. can be documented using the documentation syntax.
* Fields, parameters, return values, etc. can be marked using documentation attributes.
* HTML documents can be generated using the `ballerina doc` command for each Ballerina module and if you have custom handlebars templates, you can use them to generate the HTMLs.

## Writing Ballerina Documentation

Ballerina Flavored Markdown documentation is a first class syntax in the Ballerina language. The `#` at the beginning of a line denotes a line of documentation. If necessary, you can have multiple lines of documentation, which you can group together.

```
# <documentation line 1>
# <documentation line 2>
# ...
```

When you write documentation, you can use the markdown documentation syntax given above. For example:

```
# Provides the HTTP actions for interacting with an HTTP server. Apart from the standard 
# HTTP methods, `forward()` and `execute()` functions are provided.
# ...
```

The supported structure of documentation syntax is as follows:

```
# <description_line_1>
# <description_line_2>
# ...
# + <parameter_name/field_name> - <description_line_1>
#                                 <description_line_2>
# ...
# + <parameter_name/field_name> - <description_line_1>
#                                 <description_line_2>
# ...
# + return - <return_parameter_description_line_1>
#            <return_parameter_description_line_2>
```

### Sample Usage

```ballerina
# Submits an HTTP request to a service with the specified HTTP verb.
# The `submit()` function does not give out a `Response` as the result,
# rather it returns an `HttpFuture`, which can be used to do further 
# interactions with the endpoint.
#
# Example:
# ```ballerina
# HttpFuture future = myMsg.submit("GET", "/test", req);
# ```
#
# + httpVerb - The HTTP verb value
# + path - The resource path
# + request - An HTTP outbound request message
# + return - An `HttpFuture` that represents an asynchronous service invocation, 
#            or an `error` if the submission fails
public function submit(@sensitive string httpVerb, string path, Request request) returns HttpFuture|error;
```

## Documenting A Module

A Ballerina module can have a `Module.md` file which describes the module and its usage.

A typical project structure of a Ballerina project is like this:

```
/
  Ballerina.toml       # Configuration that defines project intent
    src
      module1/             # The source in this directory will be named “<org-name>/module1”
        Module.md          # Optional, contains descriptive metadata for display at
                           # Ballerina Central
        *.bal
        [tests/]           # Module-specific unit and integration tests
        [resources/]       # Module-specific resources

      modules.can.include.dots.in.dir.name/
        Module.md
        *.bal
        [tests/]
        [resources/]

  [resources/]         # Resources included with every module in the project

  target/              # Compiled executables and other artifacts end up here
```

`ballerina doc` command will read the `Module.md` and prepend it to the generated HTML file.

Check [HTTP module documentation](/learn/api-docs/ballerina/http/index.html) for sample HTML that has `Module.md` content at the top, followed by the other module constructs.


## Generating Ballerina Documentation

Ballerina provides a `doc` command which can be executed against a given Ballerina project. This command will result in generating the Ballerina documentation as HTML files, for all the modules in the project.

First, let's create a new Ballerina project:
```
$ ballerina new myproject
Created new Ballerina project at myproject

Next:
    Move into the project directory and use `ballerina add <module-name>` to
    add a new Ballerina module.
$ cd myproject/
$ ballerina add math -t service
Added new ballerina module at 'src/math'
$ ballerina add time -t service
Added new ballerina module at 'src/time'

```
Now, let's generate documentation of the project:
```
$ ballerina doc -a
```
Output:
```
Compiling source
        foo/time:0.1.0
        foo/math:0.1.0

Generating API Documentation
        target/apidocs
```

`target/apidocs/` folder would contain following;
```bash
$ ls target/apidocs/
index.html  math  time  ...
```

* `index.html`  - contains an index page of all the modules in the Ballerina project 
* `math` - contains the documentation of the module named `math`
* `time` - contains the documentation of the module named `time`

If you want to generate documentation for a selected Ballerina module, then you can execute the following command from the Ballerina project root directory:

```bash
$ ballerina doc <module_name>
```

For other options, run `ballerina doc --help`.
