---
layout: ballerina-building-a-data-service-left-nav-pages-swanlake
title: Build a data service in Ballerina 
description: Connect to a MySQL database and execute queries using an HTTP RESTful API using Ballerina.
keywords: ballerina, data service, mysql, database, REST, API
permalink: /learn/build-a-data-service-in-ballerina/
active: build-a-data-service
intro: This guide helps you understand the basics of Ballerina constructs, which allow you to work with data services.
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina Swan Lake](/downloads/) or greater
2. <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed

## Understand the implementation

This tutorial describes how to connect to a MySQL database and perform queries against it using Ballerina via a basic use case of creating, maintaining, and interacting with a database of employees in an organization. It also elaborates on how you can create an HTTP RESTful API using Ballerina that can be used to perform basic CRUD operations on the database.

![Data Service Architecture](/learn/images/data-service-architecture.png "Data Service Architecture")

>**Info:** The outlined methodology can be used to work with PostgreSQL, SQL Server, OracleDB, or any other relational database as well using the [`PostgreSQL`](https://lib.ballerina.io/ballerinax/postgresql/latest),[`MSSQL`](https://lib.ballerina.io/ballerinax/mssql/latest), [`OracleDB`](https://lib.ballerina.io/ballerinax/oracledb/latest), and [`JDBC`](https://lib.ballerina.io/ballerinax/java.jdbc/latest) connectors for Ballerina respectively.

## Set up a MySQL server instance

Select one of the methods below to set up a MySQL server.

>**Tip:** Keep the connection and authentication details for connecting to the MySQL server, including the hostname, port, username, and password, noted down.

1. Install a MySQL server on your machine locally by downloading and installing [MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing) for different platforms.
2. Use a cross-platform web-server solution such as [XAMPP](https://www.apachefriends.org/index.html) or [WampServer](https://www.wampserver.com/en/).
3. Use [Docker](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/docker-mysql-getting-started.html) to create a MySQL server deployment.
4. Use a cloud-based MySQL solution such as Google’s [CloudSQL](https://cloud.google.com/sql), Amazon’s [RDS for MySQL](https://aws.amazon.com/rds/sqlserver/), or Microsoft’s [Azure database for MySQL](https://azure.microsoft.com/en-us/services/mysql/).

## Create a database and table

Connect to the MySQL server using the Terminal (or any other preferred method) and execute the commands below to create a database and table.

```sql
CREATE DATABASE IF NOT EXISTS Company;

CREATE TABLE Company.Employees (
	employee_id INTEGER AUTO_INCREMENT PRIMARY KEY,
	first_name  VARCHAR(255) NOT NULL,
	last_name   VARCHAR(255) NOT NULL,
	email       VARCHAR(255) NOT NULL,
	phone       VARCHAR(50) NOT NULL ,
	hire_date   DATE NOT NULL,
	manager_id  INTEGER REFERENCES Employees(employee_id),
	job_title   VARCHAR(255) NOT NULL
);
```

## Create the service package

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic in it. 

1. In the Terminal, execute the command below to create the Ballerina package for the implementation.

    > **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

    ```
    $ bal new build-a-data-service
    ``` 
    You should see the output similar to the following.

    ```
    package name is derived as 'build_a_data_service'. Edit the Ballerina.toml to change it.

    Created new package 'build_a_data_service' at /Users/build-a-data-service.
    ```

    This creates a directory named `build-a-data-service` with the files below.

    ```
    .
    │   ├── Ballerina.toml
    │   └── main.bal
    ```

2. Open the created package in VS Code.

3. Remove the generated content in the `main.bal` file and open the diagram view in VS Code.

    ![Open diagram view](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/open-diagram-view.gif)

## Create the data service

The sections below demonstrate how to create the service.

### Create a record to represent an employee

In Ballerina, records are a data type that maps keys to values. Follow the steps below to define a closed record representing a single row in the `Employees` table in the `main.bal` file. 

>**Info:** This record type is the basis for interacting with the database.

Generate the record types corresponding to the payload from the service by providing the record name as `Employee` and the sample JSON object below.

>**Tip:** You need to complete the generated record by adding the pipe signs to mark the record as a closed one, adding the `employee_id`, `manager_id`, and `hire_date` types, and importing the `ballerina/time` module, which cannot be represented in the JSON format.

```json
{    
    "first_name": "test",
    "last_name": "test",
    "email": "test@test.com",
    "phone": "882 771 110",
    "job_title": "Sales Manager"
}
```

![Create data record](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/create-data-record.gif)

The completed record will be as follows.

```ballerina
import ballerina/time;

type Employee record {|
    string first_name;
    string last_name;
    string email;
    string phone;
    string job_title;
    int employee_id?;
    int? manager_id;
    time:Date hire_date;
|};
```

### Define MySQL configurations

Follow the steps below to define the MySQL configurations.

1. In the package directory, create a new file named `Config.toml` and specify the configurations below to connect to the MySQL database.

    ```toml
    USER="root"
    PASSWORD="rootPassword"
    HOST="localhost"
    PORT=3306
    DATABASE="Company"
    ```

2. Define configurable variables to redefine the above variables and access them from within your Ballerina program.

    >**Info:** For more information on defining configurable variables in Ballerina, see [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

    ![Create configurable variable](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/create-configurable-variable.gif)

    The generated configurable variables will be as follows.

    ```ballerina
    configurable string USER = "root";
    configurable string PASSWORD = "rootPassword";
    configurable string HOST = "localhost";
    configurable int PORT = 3306;
    configurable string DATABASE = "Company";
    ```

### Connect to the database

You can connect to the MySQL database by creating a client.

#### Create the MySQL client

Create a `mysql:Client` to connect to the database, as shown below.

>**Tip:** Select the `final` descriptor, enter `dbClient` as the MySQL client name, and configure the `host`, `user`, `password`, `database`, and `port` parameters with the `HOST`, `USER`, `PASSWORD`, `C"Company"`, and `PORT` values respectively.

![Create the client](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/create-the-client.gif)

The generated MySQL client will be as follows.

```ballerina
final mysql:Client dbClient = check new (host = HOST, user = USER, password = PASSWORD, database = "Company", port = PORT);
```
#### Run the MySQL client

Use the [**Run**](/learn/vs-code-extension/run-a-program/) option of the VS Code extension to build and run the client, as shown below.

![Run the client](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/run-the-client.gif)

If the program runs without throwing an error with the output below, that indicates that the connection has been established successfully. This client can be defined globally and used across all the parts of the program.

```
Compiling source
        featured_scenarios/build_a_data_service:0.1.0

Running executable
```

>**Info:** The MySQL package provides additional connection options and the ability to configure connection pool properties when connecting to the database, which are not covered in this tutorial. To learn more about this, see [`mysql:Client`](https://lib.ballerina.io/ballerinax/mysql/latest#Client).

### Execute the queries

The `mysql:Client` provides two primary remote methods for performing queries.

1. `query()` - Executes an SQL query and returns the results (rows) from the query. 
   The `queryRow()` method is a variation of this method, which returns, at most, a single row from the result.

2. `execute()` - Executes an SQL query and returns only the execution metadata.

#### Create the functions

Follow the steps below to create functions to use the `query()`, `queryRow()`, and `execute()` methods, which can perform basic CRUD operations against the MySQL database. 

1. Add the code below to import the [`sql`](https://lib.ballerina.io/ballerina/sql/latest) package, which is used in the logic of the functions.

    ```ballerina
    import ballerina/sql;
    ```
    
2. Implement the other functions in the `main.bal` file by adding the code below.

    ```ballerina
    function getEmployee(int id) returns Employee|error {
        Employee employee = check dbClient->queryRow(
            `SELECT * FROM Employees WHERE employee_id = ${id}`
        );
        return employee;
    }

    function getAllEmployees() returns Employee[]|error {
        Employee[] employees = [];
        stream<Employee, error?> resultStream = dbClient->query(
            `SELECT * FROM Employees`
        );
        check from Employee employee in resultStream
            do {
                employees.push(employee);
            };
        check resultStream.close();
        return employees;
    }

    function updateEmployee(Employee emp) returns int|error {
        sql:ExecutionResult result = check dbClient->execute(`
            UPDATE Employees SET
                first_name = ${emp.first_name}, 
                last_name = ${emp.last_name},
                email = ${emp.email},
                phone = ${emp.phone},
                hire_date = ${emp.hire_date}, 
                manager_id = ${emp.manager_id},
                job_title = ${emp.job_title}
            WHERE employee_id = ${emp.employee_id}  
        `);
        int|string? lastInsertId = result.lastInsertId;
        if lastInsertId is int {
            return lastInsertId;
        } else {
            return error("Unable to obtain last insert ID");
        }
    }

    function removeEmployee(int id) returns int|error {
        sql:ExecutionResult result = check dbClient->execute(`
            DELETE FROM Employees WHERE employee_id = ${id}
        `);
        int? affectedRowCount = result.affectedRowCount;
        if affectedRowCount is int {
            return affectedRowCount;
        } else {
            return error("Unable to obtain the affected row count");
        }
    }
    ```


## The  `main.bal` file complete code

```ballerina
import ballerina/sql;
import ballerina/time;
import ballerinax/mysql;
import ballerinax/mysql.driver as _; // This bundles the driver to the project so that you don't need to bundle it via the `Ballerina.toml` file.

type Employee record {|
    int employee_id?;
    string first_name;
    string last_name;
    string email;
    string phone;
    time:Date hire_date;
    int? manager_id;
    string job_title;
|};

configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string HOST = ?;
configurable int PORT = ?;
configurable string DATABASE = ?;

final mysql:Client dbClient = check new(
    host=HOST, user=USER, password=PASSWORD, port=PORT, database="Company"
);

function addEmployee(Employee emp) returns int|error {
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO Employees (employee_id, first_name, last_name, email, phone,
                               hire_date, manager_id, job_title)
        VALUES (${emp.employee_id}, ${emp.first_name}, ${emp.last_name},  
                ${emp.email}, ${emp.phone}, ${emp.hire_date}, ${emp.manager_id},
                ${emp.job_title})
    `);
    int|string? lastInsertId = result.lastInsertId;
    if lastInsertId is int {
        return lastInsertId;
    } else {
        return error("Unable to obtain last insert ID");
    }
}

function getEmployee(int id) returns Employee|error {
    Employee employee = check dbClient->queryRow(
        `SELECT * FROM Employees WHERE employee_id = ${id}`
    );
    return employee;
}

function getAllEmployees() returns Employee[]|error {
    Employee[] employees = [];
    stream<Employee, error?> resultStream = dbClient->query(
        `SELECT * FROM Employees`
    );
    check from Employee employee in resultStream
        do {
            employees.push(employee);
        };
    check resultStream.close();
    return employees;
}

function updateEmployee(Employee emp) returns int|error {
    sql:ExecutionResult result = check dbClient->execute(`
        UPDATE Employees SET
            first_name = ${emp.first_name}, 
            last_name = ${emp.last_name},
            email = ${emp.email},
            phone = ${emp.phone},
            hire_date = ${emp.hire_date}, 
            manager_id = ${emp.manager_id},
            job_title = ${emp.job_title}
        WHERE employee_id = ${emp.employee_id}  
    `);
    int|string? lastInsertId = result.lastInsertId;
    if lastInsertId is int {
        return lastInsertId;
    } else {
        return error("Unable to obtain last insert ID");
    }
}

function removeEmployee(int id) returns int|error {
    sql:ExecutionResult result = check dbClient->execute(`
        DELETE FROM Employees WHERE employee_id = ${id}
    `);
    int? affectedRowCount = result.affectedRowCount;
    if affectedRowCount is int {
        return affectedRowCount;
    } else {
        return error("Unable to obtain the affected row count");
    }
}
```

## Expose the database via an HTTP RESTful API

After you have defined the functions necessary to manipulate the database, expose these selectively via an HTTP RESTful API. 

### Create the REST  service

Follow the steps below to create the service.

1. Create a `service.bal` file inside the Ballerina package directory (`build_a_data_service`).

2. Create the service using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) of the VS Code extension, as shown below.

    >**Tip:** Use `/employees` as the service path (or the context) of the service, which is attached to the listener listening on port 8080.

    ![Create the service](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/create-the-service.gif)

    The generated REST service will be as follows.

    ```ballerina
    service /employees on new http:Listener(8080) {
        resource function get .() returns error? {
        }
    }
    ```

### Create the resources

Follow the steps below to define resource functions within this service to provide access to the database.

1. Create the first resource using the [Ballerina HTTP API Designer](/learn/vs-code-extension/design-the-services/http-api-designer/) of the VS Code extension, as shown below.

    >**Tip:** Define an HTTP resource that allows the POST operation on the resource path `.` and accepts an `Employee` type payload named `emp`. Use `int|error` as the response type. Complete the generated record by adding the pipe signs to mark the record as a closed one.

    ![Create resource function](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/create-resource-function.gif)

    The generated resource function will be as follows.

    ```ballerina
    service /employees on new http:Listener(8080) {

        resource function post .(Employee emp) returns int|error? {
            return addEmployee(emp);
        }   
    }
    ```

2. Similarly, create the other resources as per the code below.

    ```ballerina
        resource function get [int id]() returns Employee|error? {
            return getEmployee(id);
        }

        resource function get .() returns Employee[]|error? {
            return getAllEmployees();
        }

        resource function put .(Employee emp) returns int|error? {
            return updateEmployee(emp);
        }

        resource function delete [int id]() returns int|error? {
            return removeEmployee(id);       
        }
    ```

## The `service.bal` file complete code 

The complete code in the `service.bal` will be as follows.

```ballerina
import ballerina/http;

service /employees on new http:Listener(8080) {

    resource function post .(Employee emp) returns int|error? {
        return addEmployee(emp);
    }
    
    resource function get [int id]() returns Employee|error? {
        return getEmployee(id);
    }
    
    resource function get .() returns Employee[]|error? {
        return getAllEmployees();
    }
    
    resource function put .(Employee emp) returns int|error? {
        return updateEmployee(emp);
    }
    
    resource function delete [int id]() returns int|error? {
        return removeEmployee(id);       
    }

}
```

## Run the service

Use the [**Run**](/learn/vs-code-extension/run-a-program/) CodeLens of the VS Code extension to build and run the service, as shown below.

![Run the service](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/run-the-service.gif)

>**Info:** Alternatively, you can run this service by navigating to the project root (i.e., `data_service` directory) and executing the `bal run` command. 

You should see the output similar to the following.

```
Compiling source
        featured_scenarios/build_a_data_service:0.1.0

Running executable
```

>**Info:** This creates an `/employees` endpoint on port `8080`, which can be accessed via a browser by visiting `http://locahost:8080/employees`.

## Try the service

Use the [**Try it**](/learn/vs-code-extension/try-the-services/try-http-services/) CodeLens of the VS Code extension to invoke the defined resource method by sending a `POST` request to `http://localhost:8080/employees` with the required data as shown in the JSON payload below.

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "job_title": "string",
  "employee_id": 0,
  "manager_id": 0,
  "hire_date": {
    "year": 2024,
    "month": 2,
    "day": 12
  }
}
```

![Try the service](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/try-the-service.gif)

Also, a row will be added to the **Employees** table, as shown below.

![Data service output](/learn/images/featured-scenarios/build-a-data-service-in-ballerina/data-service-output.png)

## Learn more

To learn more about MySQL and HTTP support in Ballerina, see the following:
- [`mysql` module documentation](https://lib.ballerina.io/ballerinax/mysql/latest)
- [`http` module documentation](https://lib.ballerina.io/ballerina/http/latest)
- [MySQL examples](/learn/by-example/mysql-query-operation)
