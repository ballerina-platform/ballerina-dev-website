---
layout: ballerina-style-guide-left-nav-pages-swanlake
title: Annotations, documentation and comments
description: The Ballerina Style Guide aims at maintaining a standard coding style among the Ballerina community. The Ballerina code formatting tools are based on this guide.
keywords: ballerina, programming language, ballerina style guide, annotations, comments
permalink: /learn/style-guide/annotations-documentation-and-comments/
active: annotations-documentation-and-comments
intro: The sections below include the coding conventions with respect to annotations, documentation, and comments.
redirect_from:
  - /learn/style-guide/annotations_documentation_and_comments
  - /learn/coding-conventions/annotations_documentation_and_comments
  - /swan-lake/learn/coding-conventions/annotations_documentation_and_comments/
  - /swan-lake/learn/coding-conventions/annotations_documentation_and_comments
  - /learn/coding-conventions/annotations_documentation_and_comments/
  - /learn/coding-conventions/annotations_documentation_and_comments
  - /learn/user-guide/coding-conventions/annotations_documentation_and_comments
  - /learn/user-guide/coding-conventions/annotations_documentation_and_comments/
  - /learn/user-guide/code-organization/coding-conventions/annotations_documentation_and_comments/
  - /learn/user-guide/code-organization/coding-conventions/annotations_documentation_and_comments
  - /learn/user-guide/style-guide/coding-conventions/annotations-documentation-and-comments
  - /learn/user-guide/style-guide/coding-conventions/annotations-documentation-and-comments/
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
@test:Config {}
```

* If you are annotating a parameter or a return type, the annotation should be added inline to the parameter or the return type.
  
**Example,**
  
```ballerina
// Parameter annotation.
public function secureFunction1(@untainted string secureInName, @untainted int secureInId, string insecureIn) {
    ...
}
  
public function secureFunction2(@untainted string secureInName,
    @untainted int secureInId, string insecureIn) {
    ...
}
  
// Return type annotation.
public function taintedReturn1() returns @tainted string {
    ...
}
    
public function taintedReturn2() returns 
    @tainted string {
    ...
}
  
```

## Comments
* Use `//` for both single-line and multi-line comments.
  
**Example,**

```ballerina
// This is a single-line comment.
```

  and 
  
```ballerina
// Copyright (c) 2019 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
//
// WSO2 Inc. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
```
  
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
    if (true) {
        if (true) {
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
