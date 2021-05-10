---
layout: ballerina-blank-page
title: Release Note
---

### Overview of jBallerina 1.2.1

The jBallerina 1.2.1 patch release improves upon the 1.2.0 release by introducing the features listed below and addressing a number of [bugs](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.1%22+label%3AType%2FBug+is%3Aclosed) and [improvements](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.1%22+is%3Aclosed+label%3AType%2FImprovement).

You can use the update tool to update to jBallerina 1.2.1 as follows.

**For existing users:**

If you are already using jBallerina version 1.2.0, you can directly update your distribution to jBallerina 1.2.1 by executing the following command:

> $ ballerina dist update

However, you need to use the following commands instead of the above if you have installed:

- jBallerina 1.2.0 but switched to a previous version: `$ ballerina dist pull jballerina-1.2.1`
- a jBallerina version below 1.1.0: install via the [installers](https://ballerina.io/downloads/)

**For new users:**

If you have not installed jBallerina, then download the [installers](https://ballerina.io/downloads/) to install.

#### Language
- Deprecation support for annotations, function parameters, and object fields
- Runtime validations added to the XML attributes map.
- Support for map to record assignment

#### Standard Library
- Support for Avro key serialization/deserialization in the `ballerina/kafka` module
- Automatic failover support for the WebSocket client
- Provide the base64-encoded end user certificate along with the mutual SSL status
	
#### Dev tools
- Support for mocking object methods in Testerina
- Support for subtypes in Java for the bindgen tool
- Support for formatting of streams
- Code coverage report

#### Deployment
- Default permissions mode support for Kubernetes configmap and secret annotations
- Node selector support for Kubernetes deployments and job annotations

