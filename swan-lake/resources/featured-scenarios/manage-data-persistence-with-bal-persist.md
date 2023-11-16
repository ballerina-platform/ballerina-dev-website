---
layout: ballerina-building-a-data-service-with-bal-persist-left-nav-pages-swanlake
title: Manage data persistence with bal persist
description: This guide describes how to model your application data and use a tool to generate client APIs to access the data store in Ballerina.
keywords: Ballerina, data service, data store, database, in-memory, Google Sheets, REST, API
permalink: /learn/manage_data_persistence-with-bal-persist/
active: manage_data_persistence-with-bal-persist
intro: This guide helps you understand the basics of the `bal persist` feature, which allows you to manage data persistence easily. This same data service can also be written using the Ballerina SQL connectors, which require you to write SQL queries to perform CRUD operations against the DB servers. With the `bal persist` feature, you only need to write the `data model`. Based on the model, the client object and record types are generated to interact with the data store.
redirect_from:
- /learn/manage-data-persistence-with-bal-persist/
- /learn/manage-data-persistence-with-bal-persist
- /learn/manage-data-persistence-with-bal-persist
- /learn/getting-started/manage-data-persistence-with-bal-persist/
- /learn/getting-started/manage_data_persistence-with-bal-persist
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2201.6.0 (Swan Lake)](/learn/get-started/) or greater
2. A text editor
>**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the
<a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. A command terminal

## Understand the implementation

This guide describes how to interact with the data store and perform operations against it using `bal persist`. This will cover the basic use case of creating, reading, updating, and deleting records on a data store in an organization. It also elaborates on how you can create an HTTP RESTful API using Ballerina that can be used to perform basic CRUD operations on the data store.

![Data Service Architecture](/learn/images/bal-persist-scenario-diagram.png "Data Service Architecture")

>**Info:** This guide uses an in-memory data store for simplicity. However, the described methodology can also be applied to work with MySQL, MSSQL, and Google Sheets, as the `bal persist` currently offers support for these three data stores: in-memory tables, MySQL and MSSQL databases, and Google Sheets.

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

## Initialize `bal persist` in the project

The `bal persist` initialization takes care of the basics needed to start the development. In the terminal, execute the command below to initialize `bal persist` in the Ballerina package.

```
$ bal persist init --module store
```

Along with the `bal persist init` command, you can specify the `datastore` that you are going to use in the application and also the `module` that you need to add the generated code to. Both these parameters are optional. If you don’t provide them, the datastore will be set to `inmemory`, and the module will be set to `root` module by default.

This changes the Ballerina package as follows.

```
├── rainier
│   ├── persist
│   │		└── model.bal
│   ├── Ballerina.toml
│   └── main.bal

```
it also adds the following configuration to the `Ballerina.toml` file.

```toml
[persist]
datastore = "inmemory"
module = "rainier.store"
```


These configurations are referred to when generating client objects for the data model. The recommendation is not to change these values. If you want to change them, remove them from the `Ballerina.toml` file and reinitialize `bal persist`.

The next step is to define your data model in the schema file in the`persist/model.bal` file.

## Model your data

The data model can be defined in the schema file inside the `persist` directory. You can use the empty file added by the `persist init` command for this.

For more information on defining a data model, see the [Data Model Definition](/learn/persist-model/) documentation. In order to simplify this demonstration, only the `Employee` entity is added to the schema file. You can add as many as you want for your application and add relationships between entities.
Once defined, the schema file will be as follows.

```ballerina
import ballerina/persist as _;
import ballerina/time;

public type Employee record {|
   readonly string id;
   string firstName;
   string lastName;
   string email;
   string phone;
   time:Date hireDate;
   string? managerId;
   string jobTitle;
|};
```

This model is used to set up the underlying datastore (e.g., set up the tables in the underlying database) and also as the base for the generated client APIs.

## Generate the client object, types, and scripts

Now, you can generate the client objects, types, and SQL scripts for your model by running the command in your terminal.

```
$ bal persist generate
```

This changes the Ballerina package as follows.

```
├── rainier
│   ├── generated
│   │		└── store
│   │		│	├── persist_client.bal
│   │		│	└── persist_types.bal
│   ├── persist
│   │		└── model.bal
│   ├── Ballerina.toml
│   └── main.bal
    
```

The `persist generate` will parse the `persist/model.bal` definition file and generate the following.

|         File          |                                         Description                                         |
|:---------------------:|:-------------------------------------------------------------------------------------------:|
| `persist_client.bal`  |                This is the client that is used to persist and retrieve data.                |
|  `persist_types.bal`  |       This contains the record types that will be used to persist and retrieve data.        |



> Note: All of the above auto-generated BAL files should not be modified.

> Note: If you use other data stores like MySQL, MSSQL, or Google Sheets, additional files will get created to handle runtime configurations and scripts to set up the database/worksheet. Since `in-memory` is used, you don’t need to do any configuration or setting-up before running the application.

## Query your database with client API

First, you need to instantiate the generated client object inside the `rainier.store` module like below.

```ballerina
import rainier.store;

store:Client sClient = check new();
```

You can use this `sClient` as the client to query your database. It provides five resource methods to query. Let’s explore each of the methods of the client separately. You can use the `main.bal` file created inside your project to explore the functionalities.

### Create a new `Employee` record

Let’s start with a query to create a new `Employee` record in the database and log the results to the console. Update the following in your `main.bal` file.

```ballerina
import ballerina/io;
import rainier.store;


final store:Client sClient = check new();


public function main() returns error? {
   store:EmployeeInsert employee1 = {
       id: "emp_01",
       firstName: "John",
       lastName: "Doe",
       email: "johnd@xyz.com",
       phone: "1234567890",
       hireDate: {
           year: 2020,
           month: 10,
           day: 10
       },
       managerId: "mng_01",
       jobTitle: "Software Engineer"
   };


   string[] employeeIds = check sClient->/employees.post([employee1]);
   io:println("Inserted employee id: " + employeeIds[0]);
}
```

You can run your Ballerina project with the following command.

```
$ bal run
Compiling source
        foo/rainier:0.1.0


Running executable

Inserted employee id: emp_01
```

This creates the first database record with the client API. The next sections describe how to read data from the database.

### Retrieve all `Employee` records

Let’s try to fetch all the records inserted into the database. The client API offers the `get` resource method, which returns a stream of the return type. The return type can be either a complete `Employee` record or a custom record with a subset of fields.

Replace the previous code and add the new `get` call instead.

```ballerina
import ballerina/io;
import rainier.store;
import ballerina/persist;


final store:Client sClient = check new ();


public function main() returns error? {
   // Get the complete `Employee` record.
   stream<store:Employee, persist:Error?> employees = sClient->/employees;
   check from var employee in employees
       do {
           io:println(employee);
       };


   // Get only the `id`, `firstName`, and `lastName` fields.
   stream<EmployeeName, persist:Error?> empNames = sClient->/employees;
   check from var name in empNames
       do {
           io:println(name);
       };
}


type EmployeeName record {|
   string id;
   string firstName;
   string lastName;
|};
```

Run the Ballerina project again.

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

{"id":"emp_01","firstName":"John","lastName":"Doe","email":"johnd@xyz.com","phone":"1234567890","hireDate":{"year":2020,"month":10,"day":10},"manager_id":"mng_01","job_title":"Software Engineer"}

{"employee_id":"emp_01","first_name":"John","last_name":"Doe"}
```

>**Note:** Even if there is a single `Employee` record, the resource method returns a Ballerina stream object and you need to iterate through the stream to access the records.
The client also provides the `get by key` method, which returns only one record. Let’s explore that method.

### Retrieve the `Employee` record by key

If you know the key of the record you need to fetch from the database, you can pass the key as a path param to the `get` method.

Replace the previous code and add the new `get by key` call instead,

```ballerina
import ballerina/io;
import rainier.store;


final store:Client sClient = check new ();


public function main() returns error? {
   string empId = "emp_01";
   // Get the complete `Employee` record.
   store:Employee employee = check sClient->/employees/[empId];
   io:println(employee);


   // Get only the `employee_id`, `first_name`, and `last_name` fields.
   EmployeeName employeeName = check sClient->/employees/[empId];
   io:println(employeeName);
}


type EmployeeName record {|
   string id;
   string firstName;
   string lastName;
|};
```

Run the Ballerina project again.

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

{"id":"emp_01","firstName":"John","lastName":"Doe","email":"johnd@xyz.com","phone":"1234567890","hireDate":{"year":2020,"month":10,"day":10},"managerId":"mng_01","jobTitle":"Software Engineer"}

{"id":"emp_01","firstName":"John","lastName":"Doe"}
```

You will get the same results as you have only one record. Let’s explore the `update` function.

### Update the `Employee` record

With the client API, you can easily update the record with the given ID. You only need to pass the fields that need to be updated with the new values. In this case, The job title of the given employee is updated from `Software Engineer` to `Senior Software Engineer`.

Replace the previous code and add the new `update` call instead.

```ballerina
import ballerina/io;
import rainier.store;


final store:Client sClient = check new ();


public function main() returns error? {
   string empId = "emp_01";


   // Update the job title of the employee with the given ID.
   store:Employee employee = check sClient->/employees/[empId].put({
       jobTitle: "Senior Software Engineer"
   });
   io:println(employee);
}
```

Run the Ballerina project again.

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

{"id":"emp_01","firstName":"John","lastName":"Doe","email":"johnd@xyz.com","phone":"1234567890","hireDate":{"year":2020,"month":10,"day":10},"managerId":"mng_01","jobTitle":"Senior Software Engineer"}
```

Now, you have successfully executed the `CREATE`, `READ`, and `UPDATE` queries against your database. Let’s explore the final `DELETE` query in the next section.

### Delete the `Employee` record

Similar to the client `update` call, you can use the `delete` action to delete the record with the given ID.

Replace the previous code and add the new `delete` call instead.

```ballerina
import ballerina/io;
import ballerina/persist;
import rainier.store;


final store:Client sClient = check new ();


public function main() returns error? {
   string empId = "emp_01";


   // Delete the employee with the given ID.
   _ = check sClient->/employees/[empId].delete();


   // Check if the employee is deleted.
   store:Employee|persist:Error result = sClient->/employees/[empId].get();
   if result is persist:NotFoundError {
       io:println("Employee not found");
   } else {
       io:println("Employee found");
   }
}
```

Run the Ballerina project again.

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

Employee not found
```

You just run all the queries against your database successfully. Your next task is to expose the database queries via an HTTP RESTful API to build a data service.

## Expose the database via an HTTP RESTful API

After you have defined the methods necessary to manipulate the database, expose these selectively via an HTTP RESTful API.

For this, you need to create an HTTP service, and within the service, you can define resource methods to provide access to the database. The complete code of the service will be as follows.

Replace the previous code and add the service code instead.

```ballerina
import ballerina/http;
import ballerina/persist;
import rainier.store;


final store:Client sClient = check new();


service /employees on new http:Listener(8080) {


   isolated resource function post .(store:EmployeeInsert emp) returns string|error? {
       string[] employeeIds = check sClient->/employees.post([emp]);
       return employeeIds[0];
   }
  
   isolated resource function get [string id]() returns store:Employee|error {
       return check sClient->/employees/[id];
   }
  
   resource function get .() returns store:Employee[]|error? {
       stream<store:Employee, persist:Error?> resultStream = sClient->/employees;
       return check from store:Employee employee in resultStream
           select employee;
   }


   isolated resource function put [string id](store:EmployeeUpdate emp) returns store:Employee|error? {
       return check sClient->/employees/[id].put(emp);
   }
  
   isolated resource function delete [string id]() returns store:Employee|error? {
       return check sClient->/employees/[id].delete();      
   }
}
```

Run the Ballerina project again,

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable
```

> **Info:** This creates an `/employees` endpoint on port 8080, which can be accessed via a browser at http://locahost:8080/employees.

### Try the service

Invoke the defined resource method by sending the POST request below to http://localhost:8080/employees with the required data as a JSON payload.

```
$ curl -X POST http://localhost:8080/employees/ -H "Content-Type: application/json" -d "{ \"id\": \"6\", \"firstName\": \"test\", \"lastName\": \"test\", \"email\": \"test@test.com\", \"phone\": \"882 771 110\", \"hireDate\": { \"year\": 2021, \"month\": 12, \"day\": 16 }, \"managerId\": \"1\", \"jobTitle\": \"Sales Manager\" }"
```
 
The entered employee ID `6` will be returned as the response.
