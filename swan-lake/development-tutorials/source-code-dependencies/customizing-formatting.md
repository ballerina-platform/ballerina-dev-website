---
title: Customization of formatting
description: The section on providing custom configurations to the formatter.
keywords: ballerina, programming language, formatting, custom configurations
permalink: /learn/customizing-formatting/
active: customizing-formatting
intro: This feature allows developers to customize the formatting of Ballerina projects. This is done with the use of a configuration file. This configuration file can be a local or a remote file, which allows for consistency in code style across projects and simplifies the process of enforcing formatting standards. This is introduced as an experimental feature in Ballerina 2201.9.0.
---

## Configuring

Users can provide custom formatting configurations with the use of a separate configuration file of the `toml` format. Users can provide an arbitrary name for the file.

The formatting configuration file can be specified in two ways:

* `Ballerina.toml`: Define the path to a configuration file within the Ballerina.toml itself. The path can be absolute, relative to the package root, or a URL (HTTP/HTTPS). This path is specified under the `format` section in `Ballerina.toml` with the use of the `configPath` attribute. 

    ```
    [format]
    configPath = "Format.toml"
    ```

* Format.bal: If no configuration path is specified in Ballerina.toml, the formatter will look for a file named `Format.toml` in the current package root directory.
* If the `configPath` argument is not provided in the `Ballerina.toml` or the `Format.toml` file does not exist in the project root, default formatting options will be applied.
* If the format config path is an HTTP/HTTPS URL, a cache of the configuration file will be maintained inside the target directory. If the remote configuration file is modified, then make sure to delete the cached `Format.toml` file inside the `target/format/` directory.


## Formatting Options

### Indent

#### indentSize

* Specifies the number of spaces for each level of indentation.
* Value: Integer (e.g., 2, 4)
* Default: 4

    ```ballerina
    function main() {
        if (condition) {
            io:println("Indented code");
        }
    }
    ```

#### continuationIndentSize

* Determines the indentation size for continuation lines.
* Value: Integer (e.g., 4, 8)
* Default: 8

    ```ballerina
    function longFunctionName(int param1, int param2, int param3,
            int param4, int param5) {
    }
    ```

### Wrapping

#### maxLineLength

* Maximum line length before code is wrapped.
* Value: Integer (e.g., 80, 120)
* Default: No line wrapping if maxLineLength not specified.

#### simpleBlocksInOneLine 

* Preserve single-line blocks in user code.
* Value: Boolean
* Default: false

    ```ballerina
    if x == 1 { return true; }
    while i < 5 { i += 1; }
    ```

#### simpleFunctionsInOneLine

* Preserve single-line methods on a single line.
* Value: Boolean
* Default: false

    ```ballerina
    function getName() returns string { return self.name; }
    ```

### Braces

#### classBraceStyle: 

* Placement of the opening brace of the class definition.
* Values: NewLine, EndOfLine
* Default: EndOfLine
    * NewLine
        ```ballerina
        class MyClass 
        {
            // class members
        }
        ```

    * EndOfLine
        ```ballerina
        class MyClass {
            // class members
        }
        ```

#### functionBraceStyle 

* Placement of the opening brace of the function definition.
* Values: NewLine, EndOfLine
* Default: EndOfLine
    * NewLine
        ```ballerina
        function foo()
        {
            // function members
        }
        ```

    * EndOfLine
        ```ballerina
        function foo(){
            // function members
        }
        ```

### Function Definition

#### parametersWrap

* Formatting of the function parameters when the maxLineLength is exceeded.
* Values: Wrap, NoWrap, ChopDown
* Default: Wrap if maxLineLength specified, else NoWrap
    * Wrap
        ```ballerina
        function foo(int argumentNumberOne, int argumentTwo, 
            int argumentThree, int argumentFour) {
        }
        ```

    * NoWrap
        ```ballerina
        function foo(int argumentOne, int argumentTwo, int argumentThree) {
        }
        ```

    * ChopDown
        ```ballerina
        function foo(int argumentNumberOne, 
            int argumentTwo, 
            int argumentThree,
            int argumentFour) {
        }
        ```

#### alignMultilineParameters

* Align multiline parameters with the open brace.
* Values: Boolean
* Default: false

    ```ballerina
    function foo(int argumentNumberOne, int argumentTwo,
                int argumentThree, int argumentFour) {
    }
    ```

#### newLineAfterLeftParen 

* Newline after the left parenthesis of the function declaration.
* Values: Boolean
* Default: false

    ```ballerina
    function foo(
                int argumentNumberOne, int argumentTwo, int argumentThree, 
                int argumentFour) {
    }
    ```

#### rightParenOnNewLine

* Right parenthesis of the function declaration on a newline.
* Values: Boolean
* Default: false

    ```ballerina
    function foo(int argumentNumberOne, int argumentTwo, 
            int argumentThree, int argumentFour
            ) {
    }
    ```

### Function Call

#### argumentsWrap

* Values: Wrap, NoWrap, ChopDown
* Default: Wrap if maxLineLength specified, else NoWrap
    * Wrap
        ```ballerina
        myMethod(param1, param2, param3, param4,
                param5, param6);
        ```

    * NoWrap
        ```ballerina
        myMethod(param1, param2, param3, param4, param5, param6);
        ```

    * ChopDown
        ```ballerina
        myMethod(param1, 
            param2,
            param3,
            param4,
            param5,
            param6);
        ```

#### alignMultilineArguments

* Align multiline arguments with the open brace.
* Values: Boolean
* Default: false

    ```ballerina
    myMethod(param1, param2, param3, param4
            param5, param6);
    ```

#### newLineAfterLeftParen

* Newline after the left parenthesis of the function declaration.
* Values: Boolean
* Default: false

    ```ballerina
    myMethod(
            param1, param2, param3, param4, param5, param6);
    ```

#### rightParenOnNewLine

* Right parenthesis of the function declaration on a newline.
* Values: Boolean
* Default: false

    ```ballerina
    myMethod(param1, param2, param3, 
            param4, param5, param6
    );
    ```

### If Statement

#### elseOnNewLine

* else and else if keyword on the newline which follows after the } of the previous if or else if statement.
* Values: Boolean
* Default: false

    ```ballerina
    if (condition) {
        // if block
    } 
    else {
        // else block
    }
    ```

### Spacing

#### afterTypeCast

* Space after type casting.
* Values: Boolean
* Default: true

    ```ballerina
    int x = <int> someValue;
    ```

#### aroundRecordBraces

* Space after the opening brace and before the closing brace of a mapping constructor.
* Values: Boolean
* Default: true

    ```ballerina
    Student x = { name: “Alex”, age: 15 };
    ```

#### alignConsecutiveDefinitions

* Align equals on consecutive definitions.
* Values: Boolean
* Default: false

    ```ballerina
    const A   = "a";
    const AB  = "ab";
    const ABC = "ab";
    ```

### Import

#### groupImport

* Group imports by, 
    * Imports from the same package.
    * Imports from the ballerina/ and ballerinax/ organizations.
    * Imports from third-party organizations.
* Values: Boolean
* defaultValue: true

#### sortImports

* Sort imports based on alphabetical order.
* Values: Boolean
* defaultValue: true

### Query

#### alignMultiLineQueries

* Align multiline queries with the equals on the first line.
* Values: Boolean
* Default: false

    * Default behavior
        ```ballerina
        int[] numsReversed = from int i in nums
                order by i descending
                select i;
        ```

    * When `alignMultiLineQueries = true`
        ```ballerina
        int[] numsReversed = from int i in nums
                order by i descending
                select i;
        ```

## Example Configuration

```toml
[indent]
indentSize = 4
continuationIndentSize = 8

[wrapping]
maxLineLength = 120
simpleBlocksInOneLine = true
simpleFunctionsInOneLine = true

[braces]
classBraceStyle = "NewLine"
functionBraceStyle = "NewLine"

[functionDefinition]
parametersWrap = "ChopDown"
alignMultilineParameters = true
newLineAfterLeftParen = false
rightParenOnNewLine = false

[functionCall]
argumentsWrap = "Wrap"
alignMultilineArguments = false
newLineAfterLeftParen = false
rightParenOnNewLine = false

[ifStatement]
elseOnNewLine = false

[spacing]
afterTypeCast = true
aroundRecordBraces = true

[import]
groupImports = true
sortImports = true

[query]
alignMultiLineQueries = false
```
