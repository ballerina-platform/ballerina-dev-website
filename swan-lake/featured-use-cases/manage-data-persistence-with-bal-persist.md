---
layout: ballerina-building-a-data-service-with-bal-persist-left-nav-pages-swanlake
title: Manage data persistence with bal persist
description: Describe how to model your application data and use the tool to generate client apis to access the data store.
keywords: ballerina, data service, data store, database, inmemory, google sheets, REST, API
permalink: /learn/manage_data_persistence-with-bal-persist/
active: manage_data_persistence-with-bal-persist
intro: This guide helps you understand the basics of the bal persist, which allows you to manage data persistence easily. This same data service is also written using the Ballerina SQL connectors which required you to write SQL queries to perform CRUD operations against the DB servers. With the Bal persist feature, you only need to write the `Data Model`. Based on the model, the client object and record types are generated to interact with the data store.

redirect_from:
- /learn/manage-data-persistence-with-bal-persist/
- /learn/manage-data-persistence-with-bal-persist
- /learn/manage-data-persistence-with-bal-persist
- /learn/getting-started/manage-data-persistence-with-bal-persist/
- /learn/getting-started/manage_data_persistence-with-bal-persist
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.6.0 (Swan Lake)](/learn/install-ballerina/set-up-ballerina/) or greater
2. A text editor
>**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the
<a href="https://wso2.com/ballerina/vscode/docs/get-started/install-the-extension/" target="_blank">Ballerina extension</a> installed.
3. A command terminal

## Understand the implementation

This tutorial describes how to interact with the data store and perform operations against it using Ballerina Persistence via a basic use case of creating, reading, updating, and deleting records on a data store in an organization. It also elaborates on how you can create an HTTP RESTful API using Ballerina that can be used to perform basic CRUD operations on the data store.

![Data Service Architecture](/learn/images/data-service-architecture.png "Data Service Architecture")

>**Info:** In this tutorial, we use an in-memory data store to make it simple. The outlined methodology can be used to work with MySQL and Google Sheets data stores as the Bal persist currently supports three data stores In-memory tables, MySQL database, and Google Sheets.

## Create a Ballerina package

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic in it. In the terminal, execute the command below to create the Ballerina package for the implementation.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new rainier
``` 

This creates a directory named `rainier` with the files below.

```
.
├── rainier
│   ├── Ballerina.toml
│   └── main.bal
```

## Initialize Bal persist in the project

The Ballerina Persistence initialization takes care of the basics needed to start the development. In the terminal, execute the command below to initialize persistence in the Ballerina package.

```
$ bal persist init --module store
```

Along with the `bal persist init` command, you can specify the `datastore` that you are going to use in the application and also the `module` that you need to add the generated code to. Both these parameters are optional. If you don’t provide them, the datastore will be set to `in-memory` and the module will be set to `default` module by default.

This changes the Ballerina package like below,

```
├── rainier
│   ├── persist
│   │		└── model.bal
│   ├── Ballerina.toml
│   └── main.bal

```
And adds the following configuration to the Ballerina.toml file.

```toml
[persist]
datastore = "inmemory"
module = "rainier.store"
```

These configurations are referred to when generating client objects for the data model. The recommendation is not to change these values. If you want to change it, remove these configurations from the Ballerina.toml file and reinitialize the persistence.

The next step is to define your data model in the schema file at `persist/model.bal`.

## Model your data

The data model can be defined in the schema file inside persist directory. You can use the empty file added by the `persist init` command for this.

For more information on defining a data model, refer to the [Data Model Definition]() documentation. In order to simplify this demonstration, only the `Employee` entity is added to the schema file. You can add as many as you want for your application and add relationships between entities.
Once defined, the schema file looks like this.





