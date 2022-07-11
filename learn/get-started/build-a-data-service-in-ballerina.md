---
layout: ballerina-building-a-data-service-left-nav-pages-swanlake
title: Build a data service in Ballerina 
description: Connect to a MySQL database and executing queries using an HTTP RESTful API using Ballerina.
keywords: ballerina, data service, mysql, database, REST, API
permalink: /learn/build-a-data-service-in-ballerina/
active: build-a-data-service
intro: This guide helps you understand the basics of Ballerina constructs, which allow you to work with data services.

redirect_from:
 - /learn/building-a-data-service-in-ballerina
 - /learn/building-a-data-service-in-ballerina/
 - /learn/build-a-data-service-in-ballerina
 - /learn/getting-started/building-a-data-service-in-ballerina/
 - /learn/getting-started/building-a-data-service-in-ballerina
---

## Set up the prerequisites

To complete this tutorial, you need:

1. [Ballerina 2202.0.0 (Swan Lake)](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/) or greater
2. A text editor
  >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina) installed.
3. A command terminal

## Understand the implementation

This tutorial describes how to connect to a MySQL database and perform queries against it using Ballerina via a basic use case of creating, maintaining, and interacting with a database of employees in an organization. It also elaborates on how you can create an HTTP RESTful API using Ballerina that can be used to perform basic CRUD operations on the database.

![Data Service Architecture](/learn/images/data-service-architecture.png "Data Service Architecture")

>**Info:** The outlined methodology can be used to work with PostgreSQL, SQL Server, OracleDB, or any other relational database as well using the [`PostgreSQL`](https://lib.ballerina.io/ballerinax/postgresql/latest),[`MSSQL`](https://lib.ballerina.io/ballerinax/mssql/latest), [`OracleDB`](https://lib.ballerina.io/ballerinax/oracledb/latest), and [`JDBC`](https://lib.ballerina.io/ballerinax/java.jdbc/latest) connectors for Ballerina respectively.

## Set up a MySQL server instance

Select one out of the methods below to set up a MySQL server.

>**Tip:** Keep the connection and authentication details for connecting to the MySQL server including the hostname, port, username and password noted down.

1. Install a MySQL server on your machine locally by downloading and installing [MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing) for different platforms.
2. Use a cross-platform web-server solution such as [XAMPP](https://www.apachefriends.org/index.html) or [WampServer](https://www.wampserver.com/en/).
3. Use [Docker](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/docker-mysql-getting-started.html) to create a MySQL server deployment.
4. Use a cloud-based MySQL solution such as Google’s [CloudSQL](https://cloud.google.com/sql), Amazon’s [RDS for MySQL](https://aws.amazon.com/rds/sqlserver/), or Microsoft’s [Azure database for MySQL](https://azure.microsoft.com/en-us/services/mysql/).

## Create a database and table

Connect to the MySQL server using the terminal (or any other preferred method), and execute the commands below to 
create a database and table.

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

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic in it. In the terminal, execute the command below to create the Ballerina package for the implementation.

> **Info:** For more information on Ballerina packages, see [Organizing Ballerina code](/learn/organizing-ballerina-code/).

```shell
bal new data_service
``` 

This creates a directory named `data_service` with the files below.

```bash
.
├── data_service
│   ├── Ballerina.toml
│   └── main.bal
```

>**Tip:** Remove the automatically-created `main.bal` file as you are not going to use it in this guide.

## Create the service

### Create a record to represent an employee

In Ballerina, records are a data type that maps keys to values. Define a closed record to represent a single row in the `Employees` table in the `main.bal` file. 

>**Info:** This record type is the basis for interacting with the database.

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

### Add the MySQL driver

The MySQL driver JAR is necessary to connect to and interact with a MySQL server. Select one out of the methods below to add it.

1. Import the `ballerinax/mysql.driver` package in your `main.bal` file. This package bundles the latest MySQL driver so that the MySQL connector can be used in Ballerina packages easily.

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
   
### Define MySQL configurations

In the package directory, create a new file named `Config.toml` and specify the configurations below to connect to the MySQL database.

```toml
USER="root"
PASSWORD="rootPassword"
HOST="localhost"
PORT=3306
DATABASE="Company"
```

To redefine the above variables and access them from within your Ballerina program, add the code below in the `main.bal` file.

```ballerina
configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string HOST = ?;
configurable int PORT = ?;
configurable string DATABASE = ?;
```

>**Note:** For more information on defining configurable variables in Ballerina, see [Provide values to configurable variables](/learn/configure-ballerina-programs/provide-values-to-configurable-variables/).

### Connect to the database

You can connect to the MySQL database by creating a client.

#### Import the required packages

To import the [`mysql`](https://lib.ballerina.io/ballerinax/mysql/latest) 
and [`sql`](https://lib.ballerina.io/ballerina/sql/latest) packages for creating the client, add the code below in the `main.bal` file.

```ballerina
import ballerinax/mysql;
import ballerina/sql;
```

#### Create the MySQL client

To use the `mysql:Client` to the database, add the code below in the `main.bal` file.

```ballerina
final mysql:Client dbClient = check new(
    host=HOST, user=USER, password=PASSWORD, port=PORT, database="Company"
);
```

#### Run the MySQL client

Execute the command below to run the client.

```bash
bal run
```

If the program runs without throwing an error, that indicates that the connection has been established successfully. This client can be defined globally and be used across all parts of the program.

>**Info:** The MySQL package provides additional connection options and the ability to configure connection pool 
>properties when connecting to the database which, are not covered in this tutorial. To learn more about this, 
>see [`mysql:Client`](https://lib.ballerina.io/ballerinax/mysql/latest/clients/Client).

### Execute the queries

The `mysql:Client` provides two primary remote methods for performing queries.

1. `query()` - Executes an SQL query and returns the results (rows) from the query. 
   The `queryRow()` method is a variation of this method, which returns at most a single row from the result.

2. `execute()` - Executes an SQL query and returns only the metadata of the execution.

To use the `query()`, `queryRow()`, and `execute()` methods, which can perform basic CRUD operations against the MySQL database, add the code below to the `main.bal` file. 

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

## The  `main.bal` file complete code

```ballerina
import ballerina/time;
import ballerinax/mysql;
import ballerina/sql;

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

configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string HOST = ?;
configurable int PORT = ?;
configurable string DATABASE = ?;

final mysql:Client dbClient = check new(
    host=HOST, user=USER, password=PASSWORD, port=PORT, database="Company"
);

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

## Expose the database via an HTTP RESTful API

After you have defined the methods necessary to manipulate the database, expose these selectively via an HTTP
RESTful API. 

### Import the required packages
For this, create a file named `service.bal` inside the Ballerina package directory (`ata_service`), and add the code below to import the Ballerina [`HTTP` module](https://lib.ballerina.io/ballerina/http/latest).

```ballerina
import ballerina/http;
```

### Create a service
To create the service, add the code below to the `service.bal` file. 

```ballerina
service /employees on new http:Listener(8080) {
}
```

### Create the resource functions

Within this service, you can define resource functions to provide access to the database. The code snippet below 
demonstrates a resource function that can be used to create a new employee via a `POST` request.

```ballerina
service /employees on new http:Listener(8080) {

    	isolated resource function post .(@http:Payload Employee emp) returns int|error? {
            return addEmployee(emp);
        }

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
        
}
```

## The `service.bal` file complete code 

The complete code in the `service.bal` will be as follows.

```ballerina
import ballerina/http;

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

## Run the service 

Execute the command below to run the service.

```bash
bal run
```

You view the output below.

>**Info:** This creates an `/employees` endpoint on port `8080`, which can 
be accessed via a browser by visiting `http://locahost:8080/employees`.

## Try the service

Invoke the defined resource function by sending the `POST` request below to `http://localhost:8080/employees` with the required data as a JSON payload.

```bash
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

## Learn more

To learn more about MySQL and HTTP support in Ballerina, see the following:
- [`mysql` module documentation](https://lib.ballerina.io/ballerinax/mysql/latest)
- [`http` module documentation](https://lib.ballerina.io/ballerina/http/latest)
- [MySQL examples](/learn/by-example/mysql-query-operation.html)
