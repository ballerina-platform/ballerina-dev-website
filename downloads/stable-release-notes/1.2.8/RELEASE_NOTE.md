---
layout: ballerina-blank-page
title: Release Note
---
### Overview of jBallerina 1.2.8

The jBallerina 1.2.8 patch release improves upon the 1.2.7 release by introducing the features listed below and addressing a number of [bugs](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.8%22+label%3AType%2FBug+is%3Aclosed) and [improvements](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.8%22+is%3Aclosed+label%3AType%2FImprovement).

You can use the [update tool](/learn/keeping-ballerina-up-to-date/) to update to jBallerina 1.2.8 as follows.

**For existing users:**

If you are already using jBallerina version 1.2.0, or above, you can directly update your distribution to jBallerina 1.2.8 by executing the following command:

> ballerina dist update

However, you need to use the following commands instead of the above if you have installed:

- jBallerina 1.2.0 but switched to a previous version: `ballerina dist pull jballerina-1.2.8`
- a jBallerina version below 1.1.0: install via the [installers](/downloads/)

**For new users:**

If you have not installed jBallerina, then download the [installers](/downloads/) to install.

#### Code to Cloud

##### Azure Functions

The fix for [Pure HTTP Functions Not Working](https://github.com/ballerina-platform/module-ballerinax-azure.functions/issues/33). For more information, see [Azure Functions](/learn/deployment/azure-functions/).

##### AWS Lambda

Added the support for domain-specific event types. For more information, see [AWS Lambda](/learn/deployment/aws-lambda/).