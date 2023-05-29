---
layout: ballerina-persist-documentation-left-nav-pages-swanlake
title: Bal Persist Overview
description: The sections gives an overview of the bal persist feature.
keywords: ballerina, programming language, ballerina packages, persist, persist model, persist cli, persist client api
permalink: /learn/ballerina-persist/overview/
active: persist_overview
intro: "The bal persist feature allows you to store data in different data stores and retrieve them when needed. A data store can be a database, a in-memory cache, or a file system. Ballerina supports the following data stores: In-memory table, MySQL, Google Sheets. The important point is you can use the same syntax to access data in all these data stores. So you don't need to learn different syntaxes to access data in different data stores."
redirect_from:
  - /learn/ballerina-persist/overview
---
This feature has three main sections: Persist Model, Persist CLI and Persist Client API. The Persist Model is used to define the data model. The Persist CLI is used to generate the client API for the data model. The Persist Client API is used to access the data in the data store.

## Persist Model

The Persist Model is used to define the data model. The data model is defined in a Ballerina source file inside the persist directory in the project root directory. The data model is defined using the Ballerina record type. The following example shows how to define a data model for a table named `Employee` with the fields `id`, `name`, `age` and `salary`.

```ballerina
type Employee record {
    readonly int id;
    string name;
    int age;
    float salary;
}
```

The `readonly` keyword is used to define a field as a primary key. You need to have at least one primary key field in the Entity record. The primary key field is used to uniquely identify a record in the table. The primary key field is used to generate the `get`, `update` and `delete` operations in the client API. You can define multiple primary key fields in the Entity record.

Learn about how to define relationships between entity records and more about the persist model in the [Persist Model](persist-model.md) section.

> Note: The Ballerina VSCode plugin provides validation and code actions for the persist model. So you can easily create the persist model using the Ballerina VSCode plugin.

## Persist CLI

The Persist CLI is used to generate the client API for the data model. Based on the data store, additional configurable file and setup scripts are generated. For example, if you are using MySQL as the data store, the `persist_db_config.bal` file and the `script.sql` script are generated. The `persist_db_config.bal` file is used to configure the MySQL database connection. The `script.sql` file is used to create the table in the MySQL database. The client API is generated in the `generated` directory in the project root directory.

Persist has two main built-in CLI commmads: `persist init` and `persist generate`. The `persist init` command is used to initialize the persistence in the Ballerina project. The `persist generate` command is used to generate the client API for the data model. Additionally, there is an experimental `persist migrate` command to generate the sql scripts for changing the table structure in the database when the data model is changed.

Learn more about the Persist CLI in the [Persist CLI](persist-cli.md) section.

## Persist Client API

The Persist Client API is used to access the data in the data store. The client API is generated using the Persist CLI and it is located in the `generated` directory in the project root directory. The client API cosists of a Ballerina client object with resource for each entity record modeled in the Ballerina project. For each client resource, there are resource methods to perform CRUD operations on the data store.

For example if you have a `Employee` entity record in the Ballerina project, you can perform CRUD operations on the `Employee` table in the data store using the client object, like this:

```ballerina
// Create a new employee record
EmployeeInsert employee = {id: 1, name: "John", age: 30, salary: 3000.0};
int[]|error employeeId = sClient->/employees.post([employee]);

// Get the employee record with id 1
Employee|error employee = sClient->/employees/1;

// Update the employee record with id 1
Employee|error updated = sClient->/employees/1.put({salary: 4000.0});

// Delete the employee record with id 1
Employee|error deleted = sClient->/employees/1.delete();

// Get all the employee records
stream<Employee, error?> employees = sClient->/employees;
```

Learn more about the Persist Client API in the [Persist Client API](persist-client-api.md) section.

If you want to get started with a practical introduction and learn about the bal persist, head over to the [Quick Start Guide](quick-tour.md) section.