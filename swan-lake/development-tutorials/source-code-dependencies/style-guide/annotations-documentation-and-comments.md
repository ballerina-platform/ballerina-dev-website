---
layout: ballerina-style-guide-left-nav-pages-swanlake
title: Annotations, documentation and comments
description: The Ballerina Style Guide aims at maintaining a standard coding style among the Ballerina community. The Ballerina code formatting tools are based on this guide.
keywords: ballerina, programming language, ballerina style guide, annotations, comments
permalink: /learn/style-guide/annotations-documentation-and-comments/
active: annotations-documentation-and-comments
intro: The sections below include the coding conventions with respect to annotations, documentation, and comments.
---

## Annotations
* Do not have spaces around the `@` symbol.
* Indent annotations to align them with the starting position of the owner (statement or definition).
* Each annotation attribute (i.e., key-value pairs) can be expanded and block indented on its own line or kept as inline fields.

    **Example,**

    ```ballerina
    // Function annotations are aligned with the starting position of the function.
    @test:Config {
        before: beforeFunc,
        after: afterFunc
    }
    function testFunction() {
        io:println("I'm in test function!");
        test:assertTrue(true, msg = "Failed!");
    }
    ```

* If an annotation is empty, place it in a single line and 
  do not have spaces between both braces.
  
    **Example,**

    ```ballerina
    @test:Config
    ```

* If you are annotating a parameter or a return type, the annotation should be added inline to the parameter or the return type.
  
    **Example,**
    
    ```ballerina
    annotation validated on parameter, return;

    // Parameter annotation.
    public function secureFunction1(@validated string secureInName, int secureInId, string insecureIn) {
        ...
    }

    public function secureFunction2(string secureInName,
        @validated int secureInId, string insecureIn) {
        ...
    }

    // Return type annotation.
    public function taintedReturn1() returns @validated string {
        ...
    }

    public function taintedReturn2() returns
        @validated string {
        ...
    }
    ```

## Comments
  
* Add a single space between the `//` and the content.
* If the comment is in its own line, then indent it considering its context (i.e., top-level or in a block).
  
    **Example,**

    ```ballerina
    // This is a top-level comment.

    function func1() {
        // This is a block-level comment. 
        int x = 10;
    }

    function func2() {
        if valid {
            if active {
                // This is a nested if block-level comment.
                string a = "hello";
            }
        }
    }
    ```

* If the comment is in line with the code, add a space before it.

    **Example,**

    ```ballerina
    type People record {}; // Inline comment

    function func1() {
        int a = 0; // Inline comment
    }
    ```

## Documentation
* Always, indent them to align with the starting position of the owner.
* Add a space after the `#` symbol.
* Add an empty line after the description.

    **Example,**

    ```ballerina
    # Description.
    #
    # + value - value input parameter 
    # + return - return a integer value
    function getValue(int value) returns int {
        return value;
    }
    ```

* Add only one space after the parameter marker (`+`), divider (`-`), and `return`.
* Begin the param identifier and description with a single space.

    **Example,**
  
    ```ballerina
    # Description.
    #
    # + value - Parameter description
    # + return - Return value description
    function getValue(int value) returns int {
        ...
    }

    # Description.
    service / on new http:Listener(8080) {
        # Description.
        #
        # + caller - Parameter description.
        # + request - Parameter description.
        resource function get greeting(http:Caller caller, http:Request request) {
            ...
        }
    }
    ```

<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p><p data-button="iGitWatchText">"Watch"</p></div>


<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;display: none;} </style>
