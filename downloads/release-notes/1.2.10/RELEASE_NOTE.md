---
layout: ballerina-blank-page
title: Release Note
---
### Overview of jBallerina 1.2.10

The jBallerina 1.2.10 patch release improves upon the 1.2.9 release by introducing the features listed below and addressing a number of [bugs](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.10%22+label%3AType%2FBug+is%3Aclosed) and [improvements](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.10%22+is%3Aclosed+label%3AType%2FImprovement).

You can use the [update tool](/learn/keeping-ballerina-up-to-date/) to update to jBallerina 1.2.10 as follows.

**For existing users:**

If you are already using jBallerina version 1.2.0, or above, you can directly update your distribution to jBallerina 1.2.10 by executing the following command:

> ballerina dist update

However, you need to use the following commands instead of the above if you have installed:

- jBallerina 1.2.0 but switched to a previous version: `ballerina dist pull 1.2.10`
- a jBallerina version below 1.1.0: install via the [installers](/downloads/)

**For new users:**

If you have not installed jBallerina, then download the [installers](/downloads/) to install.

#### Developer Tools

Capture and return the actual exit code during program execution.

##### Test Framework

- Fixed the bug of function mocking being incompatible with string arguments
- Improvements for error handling in object mocking




