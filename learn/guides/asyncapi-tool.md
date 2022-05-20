---
layout: ballerina-asyncapi-support-left-nav-pages-swanlake
title: AsyncAPI tool
description: Check out how the Ballerina AsyncAPI tooling makes it easy for you to start developing a service documented in an AsyncAPI contract.
keywords: ballerina, programming language, asyncapi, contract
permalink: /learn/asyncapi-tool/
active: asyncapi-tool
intro: AsyncAPI is a specification, which is used to describe and document message-driven APIs in a machine-readable format for easy development, discovery, and integration. Ballerina Swan Lake supports the AsyncAPI Specification version 2.x.
redirect_from:
  - /learn/ballerina-asyncapi-support
  - /learn/ballerina-asyncapi-support/
  - /learn/asyncapi-tool
--- 

Ballerina AsyncAPI tooling will make it easy for you to start the development of an event API documented in an AsyncAPI contract in Ballerina by generating a Ballerina service and listener skeletons.

> **Prerequisite:** Install the latest [Ballerina Swan Lake distribution](https://ballerina.io/downloads/).

## Generate Ballerina services from AsyncAPI contracts

If you prefer the design-first approach, use an existing or your own AsyncAPI definition to generate Ballerina services using the AsyncAPI CLI command below.

```bash
bal asyncapi -i <asyncapi-contract>
```

The generated service can be used as a code template to start the service implementation. For example,

```bash
bal asyncapi -i hello.yaml
```

This will generate a Ballerina source (i.e.,  the four Ballerina files below) from the given AsyncAPI definition file. 

1. `data_types.bal` - contains all the Ballerina data types extracted from the AsyncAPI definition
2. `service_types.bal` - contains all the service types relevant to the event API described in the AsyncAPI definition
3. `listener.bal` - contains the HTTP listener, which listens to the relevant third-party service
4. `dispacther_service.bal` - contains the event dispatching logic

The generated Ballerina sources will be written into the same directory from which the command is run. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina project. If you want to generate Ballerina sources to a specific provided output location, you can modify the above command as below.

```bash
bal asyncapi -i hello.yaml -o ./output_path
```
  
