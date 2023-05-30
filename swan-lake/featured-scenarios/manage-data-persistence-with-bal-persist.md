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

```ballerina
import ballerina/persist as _;
import ballerina/time;

public type Employee record {|
   readonly string employee_id;
   string first_name;
   string last_name;
   string email;
   string phone;
   time:Date hire_date;
   string? manager_id;
   string job_title;
|};
```

This model is used to set up the underline datastore (e.g.: set up the tables in the underlying database), and also as the base for the generated client APIs
The next step is to generate the Ballerina Client Object, Types, and Scripts. You can then start querying your database.

## Generate the client object, types, and scripts

Now you can generate the client objects, types, and SQL scripts for your model by running the command in your terminal,

```
$ bal persist generate
```

This changes the Ballerina package like below,

```
├── rainier
│   ├── generated
│   │		└── db
│   │		│	├── persist_client.bal
│   │		│	└── persist_types.bal
│   ├── persist
│   │		└── model.bal
│   ├── Ballerina.toml
│   └── main.bal
    
```

The `persist generate` will parse the `persist/model.bal` definition file and generate the following

|         File          |                                         Description                                         |
|:---------------------:|:-------------------------------------------------------------------------------------------:|
| `persist_client.bal`  |               This is the client that is used to persist and retrieve data..                |
|  `persist_types.bal`  |       This contains the record types that will be used to persist and retrieve data.        |



> Note: All of the above auto-generated bal files should not be modified.

> Note: If you use other data stores like MySQL or Google Sheets, additional files is created to handle runtime configurations and script to setup the database/worksheet. Since we are using `in-memory`, we don’t need any configuration and pre-setting up to run the application.

## Query your database with Persist Client

You first need to instantiate the generated client object inside the `rainier.store` module like below,

```ballerina
import rainier.store;

store:Client sClient = check new();
```

Now you can use this `sClient` as the client to query your database. The client provides five resource methods to query. Let’s explore each of these clients’ methods separately. You can use the `main.bal` file created inside your project to explore the functionalities.

### Create a new `Employee` record

Let’s start with a small query to create a new `Employee` record in the database and log the results to the console. Update the following in your `main.bal` file.

```ballerina
import ballerina/io;
import ballerina/uuid;
import rainier.store;


final store:Client sClient = check new();


public function main() returns error? {
   store:EmployeeInsert employee1 = {
       employee_id: uuid:createType4AsString(),
       first_name: "John",
       last_name: "Doe",
       email: "johnd@xyz.com",
       phone: "1234567890",
       hire_date: {
           year: 2020,
           month: 10,
           day: 10
       },
       manager_id: "123e4567-e89b-12d3-a456-426614174000",
       job_title: "Software Engineer"
   };


   string[] employeeIds = check sClient->/employees.post([employee1]);
   io:println("Inserted employee id: " + employeeIds[0]);
}
```

You can run your Ballerina project with the following command:

```
$ bal run
Compiling source
        foo/rainier:0.1.0


Running executable

Inserted employee id: 16c6553a-373c-4b29-b1c8-c282f444248c
```

Congratulations!! You created your first database record with the Persist Client. In the next sections, you will learn how to read data from the database.

### Retrieve all `Employee` records

Let’s try to fetch all the records we inserted in the database. Persist client offers get resource method which returns a stream of the return type. The return type can be either a complete `Employee` record or a custom record with a subset of fields.

Replace the previous code and add the new get call instead,

```ballerina
import ballerina/io;
import rainier.store;
import ballerina/persist;


final store:Client sClient = check new ();


public function main() returns error? {
   // Get complete Employee record
   stream<store:Employee, persist:Error?> employees = sClient->/employees;
   check from var employee in employees
       do {
           io:println(employee);
       };


   // Get only the employee_id, first_name and last_name fields
   stream<EmployeeName, persist:Error?> empNames = sClient->/employees;
   check from var name in empNames
       do {
           io:println(name);
       };
}


type EmployeeName record {|
   string employee_id;
   string first_name;
   string last_name;
|};
```

Run the Ballerina project again,

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

{"employee_id":"16c6553a-373c-4b29-b1c8-c282f444248c","first_name":"John","last_name":"Doe","email":"johnd@xyz.com","phone":"1234567890","hire_date":{"year":2020,"month":10,"day":10},"manager_id":"123e4567-e89b-12d3-a456-426614174000","job_title":"Software Engineer"}

{"employee_id":"16c6553a-373c-4b29-b1c8-c282f444248c","first_name":"John","last_name":"Doe"}
```

You may notice that even there is a single `Employee` record, resource method returns a Ballerina stream object and we need to iterate through the stream to access the records.
The client also provides the `get by key` method which returns only one record. Let’s explore that method.

### Retrieve the `Employee` record by key

If you know the key of the record you need to fetch from the database, you can pass the key as a path param to the `get` method.

Replace the previous code and add the new `get by key` call instead,

```ballerina
import ballerina/io;
import rainier.store;


final store:Client sClient = check new ();


public function main() returns error? {
   string empId = "16c6553a-373c-4b29-b1c8-c282f444248c";
   // Get complete Employee record
   store:Employee employee = check sClient->/employees/[empId];
   io:println(employee);


   // Get only the employee_id, first_name, and last_name fields
   EmployeeName employeeName = check sClient->/employees/[empId];
   io:println(employeeName);
}


type EmployeeName record {|
   string employee_id;
   string first_name;
   string last_name;
|};
```

Run the Ballerina project again,

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

{"employee_id":"16c6553a-373c-4b29-b1c8-c282f444248c","first_name":"John","last_name":"Doe","email":"johnd@xyz.com","phone":"1234567890","hire_date":{"year":2020,"month":10,"day":10},"manager_id":"123e4567-e89b-12d3-a456-426614174000","job_title":"Software Engineer"}

{"employee_id":"16c6553a-373c-4b29-b1c8-c282f444248c","first_name":"John","last_name":"Doe"}
```

You will get the same results as you have only one record. Let’s explore the update function.

### Update the `Employee` record

With the Persist Client, we can easily update the record with the given id. You only need to pass the fields that need to be updated with the new values. In this case, The Job title of the given employee is updated from `Software Engineer` to `Senior Software Engineer`.

Replace the previous code and add the new update call instead,

```ballerina
import ballerina/io;
import rainier.store;


final store:Client sClient = check new ();


public function main() returns error? {
   string empId = "16c6553a-373c-4b29-b1c8-c282f444248c";


   // Update the job title of the employee with the given id
   store:Employee employee = check sClient->/employees/[empId].put({
       job_title: "Senior Software Engineer"
   });
   io:println(employee);
}
```

Run the Ballerina project again,

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

{"employee_id":"16c6553a-373c-4b29-b1c8-c282f444248c","first_name":"John","last_name":"Doe","email":"johnd@xyz.com","phone":"1234567890","hire_date":{"year":2020,"month":10,"day":10},"manager_id":"123e4567-e89b-12d3-a456-426614174000","job_title":"Senior Software Engineer"}
```

Now you have successfully execute CREATE, READ and UPDATE queries against your database. Let’s explore the final DELETE query in the next section.

### Delete the `Employee` record

Similar to the client update call, you can use the `delete` action to delete the record with the given id.

Replace the previous code and add the new delete call instead,

```ballerina
import ballerina/io;
import ballerina/persist;
import rainier.store;


final store:Client sClient = check new ();


public function main() returns error? {
   string empId = "16c6553a-373c-4b29-b1c8-c282f444248c";


   // Delete employee with the given id
   _ = check sClient->/employees/[empId].delete();


   // check if the employee is deleted
   store:Employee|persist:Error result = sClient->/employees/[empId].get();
   if result is persist:NotFoundError {
       io:println("Employee not found");
   } else {
       io:println("Employee found");
   }
}
```

Run the Ballerina project again,

```
$ bal run

Compiling source
        foo/rainier:0.1.0


Running executable

Employee not found
```

Great Job, you just run all the queries against your database successfully. Your next task is to expose the database queries via an HTTP RESTful API to build a data service.

## Expose the database via an HTTP RESTful API

After you have defined the methods necessary to manipulate the database, expose these selectively via an HTTP RESTful API.

For this, you need to create an HTTP service, and within the service, you can define resource methods to provide access to the database. The complete code of the service will be as follows,

Replace the previous code and add the service code instead,

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

> Info: This creates an /employees endpoint on port 8080, which can be accessed via a browser by visiting http://locahost:8080/employees.

### Try the service

Invoke the defined resource method by sending the POST request below to http://localhost:8080/employees with the required data as a JSON payload.

```
$ curl -X POST http://localhost:8080/employees/
    -H 'Content-Type: application/json'
    -d '{
        "employee_id": "6",
        "first_name": "test",
        "last_name": "test",
        "email": "test@test.com",
        "phone": "882 771 110",
        "hire_date": {
            "year": 2021,
            "month": 12,
            "day": 16
        },
        "manager_id": "1",
        "job_title": "Sales Manager"
    }'
```

## References

- [Ballerina Persistence Overview](Ballerina Persistence - Overview)
- [Data Model](Data Model Definition)
- [Persist Client API](Persist Client)
- [Persist CLI Tool](Persist CLI Tool)
- [Supported Data Stores](Supported Datastores)













