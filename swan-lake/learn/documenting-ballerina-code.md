---
layout: ballerina-left-nav-pages-swanlake
title: Documenting Ballerina Code
description: Learn how to write unstructured documents with a bit of structure to enable HTML content generation as API documentation.
keywords: ballerina, programming language, api documentation, api docs
permalink: /swan-lake/learn/documenting-ballerina-code/
active: documenting-ballerina-code
intro: Ballerina has a built-in Ballerina Flavored Markdown (BFM) documentation framework named Docerina. The documentation framework allows you to write unstructured documents with a bit of structure to enable generating HTML content as API documentation.
redirect_from:
  - /swan-lake/learn/how-to-document-ballerina-code
  - /swan-lake/learn/how-to-document-ballerina-code/
  - /swan-lake/learn/documenting-ballerina-code
---

## Generating Documentation for Modules

Developers can write the documentation inline with the Ballerina source code using the lightweight [markdown](https://daringfireball.net/projects/markdown/syntax) markup language. They can document special constructs such as parameters, return values, fields, etc. within the code using documentation attributes. Once the code is documented, developers can generate a basic HTML version of their Ballerina modules using the `ballerina doc` command. Developers are encouraged to have their custom themes and styles, to have a standard presentation of their Ballerina documentation.

Ballerina documentation design and usage is aligned with the package and module semantics of Ballerina. You can generate documentation for modules using the `ballerina doc` command.

* Ballerina programmers can place the documentation inline with the source code using the documentation syntax.
* Ballerina type definitions, global variables, annotations, listeners, etc. can be documented using the documentation syntax.
* Fields, parameters, return values, etc. can be marked using documentation attributes.
* HTML documents can be generated using the `ballerina doc` command for each Ballerina module and if you have custom handlebars templates, you can use them to generate the HTMLs.

## Writing Ballerina Documentation

Ballerina Flavored Markdown documentation is a first class syntax in the Ballerina language. The `#` at the beginning of a line denotes a line of documentation. If necessary, you can have multiple lines of documentation, which you can group together.

```ballerina
# <documentation line 1>
# <documentation line 2>
# ...
```

When you write documentation, you can use the markdown documentation syntax given above. For example,

```ballerina
# Provides the HTTP actions for interacting with an HTTP server. Apart from the standard 
# HTTP methods, `forward()` and `execute()` functions are provided.
# ...
```

The supported structure of documentation syntax is as follows:

```ballerina
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

>**Tip:** Always, add a full stop at the end of a function description. However, for the parameter and return type descriptions, omit the full stop if you have only one sentence. If there are multiple sentences, add the full stop at the end of each sentence. For example,

```ballerina
# Description for the function.
#
# + i - One sentence only
# + s - Sentence one. Sentence two.
# + return - Return description
public function foo(int i, string s) returns boolean {
    return true;
}
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
# + return - An `HttpFuture` that represents an asynchronous service invocation 
#            or an `error` if the submission fails
public function submit(@sensitive string httpVerb, string path, Request request) returns HttpFuture|error;
```

## Documenting a Module

A Ballerina module can have a `Module.md` file, which describes the module and its usage.

A typical package structure of a Ballerina package is like this:

```
/
  Ballerina.toml       # Configuration, which defines the package intent.
  main.bal
  Module.md            # Contains descriptive metadata of the default module to be displayed in
                       # Ballerina Central. This is optional.
  Package.md           # Contains descriptive metadata of the package to be displayed in
                       # Ballerina Central. This is optional.
    modules
      module1/             
        Module.md          # Contains descriptive metadata to be displayed in
                           # Ballerina Central. This is optional.
        *.bal
        [tests/]           # Module-specific unit and integration tests
        [resources/]       # Module-specific resources

      module2/
        Module.md
        *.bal
        [tests/]
        [resources/]

  [resources/]         # Resources included in every module in the package.

  target/              # Compiled executables and other artifacts end up here
```

The `ballerina doc` command will read the `Package.md` and `Module.md` files and prepend it to the generated HTML file.

Check [HTTP module documentation](/swan-lake/learn/api-docs/ballerina/http/index.html) for sample HTML that has `Module.md` content at the top, followed by the other module constructs.


## Generating Ballerina Documentation

Ballerina provides a `doc` command, which can be executed against a given Ballerina package. This command will result in generating the Ballerina documentation as HTML files for all the modules in the package.

First, let's create a new Ballerina package:

```bash
$ ballerina new math
Created new Ballerina package 'math' at math
```

Next, move into the package directory and execute `ballerina add <module-name>` to add a new Ballerina module.

```bash
$ cd math/
$ ballerina add world
Added new ballerina module at 'modules/world'.
$ tree
.
├── Ballerina.toml
├── main.bal
└── modules
    └── world
        └── world.bal

2 directories, 3 files
```
Now, let's add a function to the `math` module to be documented. Copy and paste the following code in to the `math/main.bal` file.

```ballerina
# Calculates the value of the 'a' raised to the power of 'b'.
# ```ballerina
# float aPowerB = math:pow(3.2, 2.4);
# ```
# 
# + a - Base value
# + b - Exponential value
# + return - Calculated exponential value
public isolated function pow(float a, float b) returns float {
    return 0;
}
```
Add the following class definition to the `world` module. Copy and paste the following code in to the `math/modules/world/world.bal` file.

```ballerina
# Represents a person object.
#
# + name - Name of the person
# + age - Age of the person in years
# + address - Address of the person
# + wealth - Account balance of the person
public class Person {
    public string name = "";
    public int age = 0;
    public string address = "";
    public float wealth = 0;

    # Gets invoked to initialize the `Person` object.
    #
    # + name - Name of the person for the constructor
    # + age - Age of the person for the constructor
    public function init(string name, int age) {
    }

    # Get the address of the person.
    #
    # + return - New address of the person
    public function getAddress() returns string {
        return self.address ;
    }

    # Add wealth of the person.
    #
    # + amt - Amount to be added
    # + rate - Interest rate
    public function addWealth(int[] amt, float rate=1.5) {
    }
}
```
Now, let's generate documentation of the package:
```bash
$ ballerina doc
```
Output:
```bash
Compiling source
	user/math:0.1.0
Generating API Documentation
Saved to: target/apidocs
```

`target/apidocs/math` folder would contain the following;
```bash
$ ls target/apidocs/
bundle.js  index.html  ...
```

* `index.html`  - the entry point for documentation

For other options, run `ballerina doc --help`.
