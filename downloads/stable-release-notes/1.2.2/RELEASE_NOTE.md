---
layout: ballerina-blank-page
title: Release Note
---
### Overview of jBallerina 1.2.2
The jBallerina 1.2.2 patch release improves upon the 1.2.1 release by introducing the features listed below and addressing a number of [bugs](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.2%22+label%3AType%2FBug+is%3Aclosed) and [improvements](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.2%22+is%3Aclosed+label%3AType%2FImprovement).

You can use the update tool to update to jBallerina 1.2.2 as follows.
**For existing users:**

If you are already using jBallerina version 1.2.0, or above, you can directly update your distribution to jBallerina 1.2.2 by executing the following command:

> $ ballerina dist update

However, you need to use the following commands instead of the above if you have installed:

- jBallerina 1.2.0 but switched to a previous version: `$ ballerina dist pull jballerina-1.2.2`
- a jBallerina version below 1.1.0: install via the [installers](https://ballerina.io/downloads/)
**For new users:**

If you have not installed jBallerina, then download the [installers](https://ballerina.io/downloads/) to install.

#### Standard Library
- Attachment/MIME Support to Email Connector: Introduce email attachments with MIME entities where attachment(s) can be attached to an email with an array of MIME Entities and read attachment(s) by reading - an array of MIME Entities
- Improved API documentation
- Introduce a few status code specific error remote functions to `http:Caller`. 

#### Dev Tools
- Improvements to API Doc tool
- Fix remote debugging support for Ballerina test command
- Fix debug point issue for ballerina module source files inside nested directories
- Improvements to BindGen tool

