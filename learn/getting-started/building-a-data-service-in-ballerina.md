---
layout: ballerina-building-a-data-service-left-nav-pages-swanlake
title: Building a Data Service in Ballerina 
description: This tutorial covers how you can connect to a MySQL database and perform queries against it using Ballerina.
keywords: ballerina, data service, mysql, database, REST, API
permalink: /learn/building-a-data-service-in-ballerina/
active: building-a-data-service
intro: Connecting to a MySQL database and executing queries using an HTTP RESTful API using Ballerina.
redirect_from:
 - /learn/building-a-data-service-in-ballerina
---

In addition, this tutorial also elaborates on how you can create an HTTP RESTful API using Ballerina that can be used to perform basic CRUD operations on the database.

![Data Service Architecture](/learn/images/data-service-architecture.png "Data Service Architecture")

The methodology outlined in this tutorial can be used to work with PostgreSQL, SQL Server, OracleDB or any other relational database as well using the [`PostgreSQL`](https://lib.ballerina.io/ballerinax/postgresql/latest),[`MSSQL`](https://lib.ballerina.io/ballerinax/mssql/latest), [`OracleDB`](https://lib.ballerina.io/ballerinax/oracledb/latest),
and [`JDBC`](https://lib.ballerina.io/ballerinax/java.jdbc/latest) connectors for Ballerina respectively.

## Setting up the Prerequisites

To complete this tutorial, you need:

1. A command terminal
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed as it has good support for Ballerina.
3. A [Ballerina installation](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/)

### Setting up a MySQL Server Instance

There are several methods you can use to set up a MySQL server.
1. Install a MySQL server on your machine locally by downloading and installing [MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing) for different platforms.
2. Use a cross-platform web-server solution such as [XAMPP](https://www.apachefriends.org/index.html) or [WampServer](https://www.wampserver.com/en/).
3. Use [Docker](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/docker-mysql-getting-started.html) to create a MySQL server deployment.
4. Use a cloud-based MySQL solution such as Google’s [CloudSQL](https://cloud.google.com/sql), Amazon’s [RDS for MySQL](https://aws.amazon.com/rds/sqlserver/), or Microsoft’s [Azure Database for MySQL](https://azure.microsoft.com/en-us/services/mysql/).

>**Tip:** Keep the connection and authentication details for connecting to the MySQL server including the hostname, port, username and password noted down.

### Creating a Database and Table

Connect to the MySQL server using the terminal (or any other preferred method) and execute the following commands to 
create a database and table. This tutorial demonstrates the basic use-case of creating, maintaining, and
interacting with a database of employees in an organization.

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

### Creating a Ballerina Project

A new Ballerina project can be created by executing the following command in the directory in which you want to create the project.

```shell
bal new data_service
``` 

>**Info:** For more information on creating Ballerina packages, see [Getting Started with Ballerina](/learn/getting-started-with-ballerina).

### Creating a Record to Represent an Employee

In Ballerina, records are a data type that maps keys to values. You can define a closed record to represent a single row
in the `Employees` table in the `main.bal` file.

```ballerina
import ballerina/time;

public type Employee record {|
    int employee_id?;
    string first_name;
    string last_name;
    string email;
    string phone;
    time:Date hire_date;
    int? manager_id;
    string job_title;
|};
```

This record type is the basis for interacting with the database.

## Connecting to and Interacting with the Database

### Adding the MySQL Driver

The MySQL driver JAR is necessary to connect to and interact with a MySQL server. There are several methods of doing this.

1. Import the `ballerinax/mysql.driver` package in your `main.bal` file. This Package bundles the latest MySQL driver so that the MySQL connector can be used in ballerina projects easily.
   ```ballerina
   import ballerinax/mysql.driver as _;
   ```
   
2. Update the `Ballerina.toml` file with the Maven dependency params for the MySQL driver.
   ```toml
   [[platform.java11.dependency]]
   groupId = "mysql"
   artifactId = "mysql-connector-java"
   version = "8.0.26"
   ```
   
3. Download the driver JAR manually and update the path in the `Ballerina.toml` file
   ```toml
   [[platform.java11.dependency]]
   path = "/path/to/mysql/driver.jar”
   ```
   
### Defining Configurations

In the project directory, create a new file named `Config.toml` and specify the configurations necessary to connect to the MySQL database.

```toml
USER="root"
PASSWORD="rootPassword"
HOST="localhost"
PORT=3306
DATABASE="Company"
```

These variables can be accessed within your Ballerina program by redefining them within your `main.bal` file.

```ballerina
configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string HOST = ?;
configurable int PORT = ?;
configurable string DATABASE = ?;
```

>**Note:** For more information on defining configurable variables in Ballerina, see [Defining Configurable Variables](/learn/configuring-ballerina-programs/providing-values-to-configurable-variables/).

### Connecting to the Database

Firstly, the [`MySQL`](https://lib.ballerina.io/ballerinax/mysql/latest) 
and [`SQL`](https://lib.ballerina.io/ballerina/sql/latest) packages must be imported into your `main.bal` file.

```ballerina
import ballerinax/mysql;
import ballerina/sql;
```

The `mysql:Client` can be used to connect to the database. Include the following code in your `main.bal` file and
execute the program using `bal run`. If the program runs without throwing an error, 
that indicates that the connection has been established successfully. This client can be defined globally and be
used across all parts of the program.

```ballerina
final mysql:Client dbClient = check new(
    host=HOST, user=USER, password=PASSWORD, port=PORT, database="Company"
);
```

>**Info:** The MySQL package provides additional connection options and the ability to configure connection pool 
>properties when connecting to the database which, are not covered in this tutorial. To learn more about this, 
>see [`mysql:Client`](https://lib.ballerina.io/ballerinax/mysql/latest/clients/Client).

### Executing the Queries

The `mysql:Client` provides two primary remote methods for performing queries.

1. `query()` - Executes an SQL query and returns the results (rows) from the query. 
   The `queryRow()` method is a variation of this method, which returns at most a single row from the result.

2. `execute()` - Executes an SQL query and returns only the metadata of the execution.

Use `query()`, `queryRow()` and `execute()` methods to define methods that can perform basic CRUD operations against the MySQL database.

```ballerina
isolated function addEmployee(Employee emp) returns int|error {
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

isolated function getEmployee(int id) returns Employee|error {
    Employee employee = check dbClient->queryRow(
        `SELECT * FROM Employees WHERE employee_id = ${id}`
    );
    return employee;
}

isolated function getAllEmployees() returns Employee[]|error {
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

isolated function updateEmployee(Employee emp) returns int|error {
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

isolated function removeEmployee(int id) returns int|error {
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

## Exposing the Database via an HTTP RESTful API

After you have defined the methods necessary to manipulate the database, expose these selectively via an HTTP
RESTful API. For this, you first need to import the Ballerina [`HTTP` module](https://lib.ballerina.io/ballerina/http/latest).

```ballerina
import ballerina/http;
```

### Creating a Service
Now, you can create a service as shown below. This creates an `/employees` endpoint on port `8080` which can 
be accessed via a browser by visiting `http://locahost:8080/employees` after executing the command `bal run`.

```ballerina
service /employees on new http:Listener(8080) {
}
```

### Creating Resource Functions

Within this service, you can define resource functions to provide access to the database. The code snippet below 
demonstrates a resource function that can be used to create a new employee via a `POST` request.

```ballerina
service /employees on new http:Listener(8080) {

    	isolated resource function post .(@http:Payload Employee emp) returns int|error? {
            return addEmployee(emp);
        }
        
}
```

Invoke the defined resource function by sending a `POST` request to `http://localhost:8080/employees` with the 
required data as a JSON payload.

```shell
curl --location --request POST 'http://localhost:8080/employees/' \
    --header 'Content-Type: text/plain' \
    --data-raw '{
        "employee_id": 6,
        "first_name": "test",
        "last_name": "test",
        "email": "test@test.com",
        "phone": "882 771 110",
        "hire_date": {
            "year": 2021,
            "month": 12,
            "day": 16
        },
        "manager_id": 1,
        "job_title": "Sales Manager"
    }'
```


Similarly, you can define resource functions within the service for each of the use cases as demonstrated below.

```ballerina
service /employees on new http:Listener(8080) {

    isolated resource function post .(@http:Payload Employee emp) returns int|error? {
        return addEmployee(emp);
    }
    
    isolated resource function get [int id]() returns Employee|error? {
        return getEmployee(id);
    }
    
    isolated resource function get .() returns Employee[]|error? {
        return getAllEmployees();
    }
    
    isolated resource function put .(@http:Payload Employee emp) returns int|error? {
        return updateEmployee(emp);
    }
    
    isolated resource function delete [int id]() returns int|error? {
        return removeEmployee(id);       
    }

}
```

To learn more about MySQL and HTTP support in Ballerina, see the following:
- [MySQL module documentation](https://lib.ballerina.io/ballerinax/mysql/latest)
- [HTTP module documentation](https://lib.ballerina.io/ballerina/http/latest)
- [MySQL examples](/learn/by-example/mysql-query-operation.html)
