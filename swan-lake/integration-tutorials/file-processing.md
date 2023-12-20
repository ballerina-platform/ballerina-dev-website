---
layout: ballerina-file-processing-left-nav-pages-swanlake
title: File processing 
permalink: /learn/file-processing/
description: Integration tutorial for file processing.
keywords: ballerina, programming language, file processing, csv, database, sql, integration
active: file-processing
intro: This tutorial helps you understand how a Ballerina file listener can be used to process new CSV files and persist the data in a database.
---

## Overview

In this tutorial, you will develop an application that uses a directory listener to pick from a directory new files added with a specific extension (e.g., `.csv`), process the file content, insert records to a database based on the file content, and then move the file to another directory. 

To implement this use case, you will develop a file service with a single remote method using Visual Studio Code with the Ballerina Swan Lake extension. The remote method will be called whenever a new file is added to the particular directory.

The flow is as follows.

1. When a new file is added to the directory, pick it for further processing if it is a CSV file (if the extension is `.csv`).

2. If it is a CSV file, read the file content which is expected to be in the following form.

    ```csv
    First Name, Last Name, Phone
    Amy, Roy, 0112222222
    Joy, Williams, 0111111111
    ```

3. Insert the read records to a database. Insert them to a table named `persons` of which the column names are expected to be `firstName`, `lastName`, and `phone`.

4. If successful, move the file to a directory containing successfully-processed files. If processing failed in step 2 or 3, move the file to a directory containing files for which processing failed.

### Concepts covered

- File listener
- File operations
- SQL/MySQL clients
- CSV files

## Develop the application

### Step 1: Set up the workspace

Install [Ballerina Swan Lake](https://ballerina.io/downloads/) and the [Ballerina Swan Lake VS Code extension](https://marketplace.visualstudio.com/items?itemName=wso2.ballerina) on VS Code.

### Step 2: Develop the service

Follow the instructions given in this section to develop the service.

1. Create a new Ballerina project using the `bal` command and open it in VS Code.

    ```bash
    $ bal new file-processing
    ```

2. Introduce the source code in files with the `.bal` extension (e.g., the `main.bal` file). Introduce a constant to represent the `.csv` extension and [configurable variables](https://ballerina.io/learn/by-example/#configurability) to denote the paths to the three directories: directory to listen on and directories to move files to once processing is completed. Also introduce configurable variables for database configuration.

    ```ballerina
    const CSV_EXT = ".csv";

    configurable string inPath = "./in";
    configurable string mvOnSuccessPath = "./out";
    configurable string mvOnFailurePath = "./failed";
    configurable string host = ?;
    configurable string user = ?;
    configurable string password = ?;
    configurable string database = ?;
    configurable int port = ?;
    ```

3. Define a record corresponding to the data to be read from the CSV file. Note how the field names are the same as the headers. This record type will be used to directly bind the data to the record type when reading the CSV data.

    ```ballerina
    type Person record {|
        string First\ Name;
        string Last\ Name;
        string Phone;
    |};
    ```

    [Identifier escapes](https://ballerina.io/learn/by-example/identifiers/) are used to escape the non-identifier whitespace character.

4. Define a function to create a directory if it does not exist. This will be used with all three directories. Import the `ballerina/file` module and use the [`file:test`](https://central.ballerina.io/ballerina/file/latest#test) function to check if the directory exists and the [`file:createDir`](https://central.ballerina.io/ballerina/file/latest#createDir) function to create the directory if it does not already exist.

    ```ballerina
    function createDirIfNotExists(string dir) returns error? {
        if !(check file:test(dir, file:EXISTS)) {
            check file:createDir(dir);
        }
    }
    ```

5. Now define a function to move a file from one directory to another. The [`file:copy`](https://central.ballerina.io/ballerina/file/latest#copy) function is used to copy the file from one directory to another and the [`file:remove`](https://central.ballerina.io/ballerina/file/latest#remove) function is used to remove the file from the source directory.

    ```ballerina
    function move(string inFilePath, string outFolder) {
        do {
            string file = inFilePath.substring(inPath.length(), inFilePath.length());
            check file:copy(inFilePath, string `${outFolder}${file}`);
            check file:remove(inFilePath);
        } on fail file:Error err {
            log:printError("Error moving file", err, filename = inFilePath);
        }
    }
    ```

    [`check`](https://ballerina.io/learn/by-example/check-expression/) expressions are used to handle errors while moving the file and move control to the [`on fail`](https://ballerina.io/learn/by-example/check-semantics/) block, in which information about the failure is logged at `ERROR` level.

6. Define a [`file:Listener`](https://central.ballerina.io/ballerina/file/latest#Listener) directory listener to listen to changes in the `inPath` directory. Extract the initialization logic to a separate function which will first create the directory at the `inPath` path if it does not exist and then initialize the listener.

    ```ballerina
    listener file:Listener fileListener = createFileListener();

    function createFileListener() returns file:Listener|error {
        check createDirIfNotExists(inPath);
        return new (({path: inPath}));
    }
    ```

7. Define a [`mysql:Client`](https://central.ballerina.io/ballerinax/mysql/latest#Client) object to interact with the database. Import the `ballerinax/mysql` module to use the `mysql` client. Also import the [ballerinax/mysql.driver](https://central.ballerina.io/ballerinax/mysql.driver/latest) driver module as `import ballerinax/mysql.driver as _;` to use the latest MySQL driver required to connect to and interact with the MySQL server. Using `as _` tells the compiler that the specific module won't be used explicilty in the source.

    ```ballerina
    final mysql:Client db = 
        check new mysql:Client(host, user, password, database, port);
    ```

8. Introduce the [module `init` function](https://ballerina.io/learn/by-example/init-function/) and create the output directories if they do not exist. Also use the `db` client to create the `persons` table if it does not exist already.

    ```ballerina
    function init() returns error? {
        check createDirIfNotExists(mvOnSuccessPath);
        check createDirIfNotExists(mvOnFailurePath);

        _ = check db->execute(`CREATE TABLE IF NOT EXISTS persons (
                                            firstName VARCHAR(50) NOT NULL,
                                            lastName VARCHAR(50) NOT NULL,
                                            phone VARCHAR(10) NOT NULL
                                        );`);
    }
    ```

    The module [`init`](https://ballerina.io/learn/by-example/init-function/) function is called as the last step of the module initialization phase. If the `init` function returns an error module initialization will fail.

9. Now define the service that processes the files. Define a service on the `fileListener` listener and implement the `onCreate` remote method which will get called whenever a file is created in the directory the `fileListener` is listening to.

    ```ballerina
    service on fileListener {
        remote function onCreate(file:FileEvent event) {
            string file = event.name;

            if !file.endsWith(CSV_EXT) {
                return;
            }

            do {
                Person[] persons = check io:fileReadCsv(file);
                sql:ParameterizedQuery[] insertQueries = from Person person in persons
                    select `INSERT INTO persons (firstName, lastName, phone)
                            VALUES (${person.First\ Name}, ${person.Last\ Name}, ${person.Phone})`;
                _ = check db->batchExecute(insertQueries);
                move(file, mvOnSuccessPath);
            } on fail io:Error|sql:Error err {
                if err is io:Error {
                    log:printError("Error occured while reading file", err, filename = file);
                } else {
                    log:printError("Error occured while persisting data", err, filename = file);
                }
                move(file, mvOnFailurePath);
            }
        }
    }
    ```

    - Extract the name of the file from the `file:FileEvent` record to proceed with further processing only if the file has the `.csv` extension. 

    - Next, introduce the logic to read data from a CSV file, add entries to the database, and move the file to the relevant folder depending on whether processing was successful. The core logic is wrapped in a `do` block with an `on fail` block attached, to handle all failures in one place and move the file to the directory at `mvOnFailurePath` on failure.

    - Within the `do` block, the [`io:fileReadCsv`](https://central.ballerina.io/ballerina/io/latest#fileReadCsv) function is used with `Person[]` to read the CSV data and try and bind each row to a `Person` record.

    - If the CSV data is successfully read as an array of `Person` records, construct an [SQL insert query](https://ballerina.io/learn/by-example/mysql-execute-operation/) for each entry and use the `db` client to do a [batch execution](https://ballerina.io/learn/by-example/mysql-batch-execute-operation/) of the queries.

    - If the database update is successful, move the file to the directory at `mvOnSuccessPath`.

    - If an error occurred during any of the processing steps, and control was transferred to the `on fail` block with the usage of `check`, log an appropriate message depending on whether the error is an `io:Error` (indicating an error occurred while reading the file) or an `sql:Error` error (indicating an error occurred while persisting data). Then move the file to the directory at `mvOnFailurePath`.

You have successfully developed the required service.

#### Complete source

```ballerina
import ballerina/file;
import ballerina/io;
import ballerina/log;
import ballerina/sql;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

const CSV_EXT = ".csv";

configurable string inPath = "./in";
configurable string mvOnSuccessPath = "./out";
configurable string mvOnFailurePath = "./failed";
configurable string host = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;
configurable int port = ?;

type Person record {|
    string First\ Name;
    string Last\ Name;
    string Phone;
|};

function createDirIfNotExists(string dir) returns error? {
    if !(check file:test(dir, file:EXISTS)) {
        check file:createDir(dir);
    }
}

function move(string inFilePath, string outFolder) {
    do {
        string file = inFilePath.substring(inPath.length(), inFilePath.length());
        check file:copy(inFilePath, string `${outFolder}${file}`);
        check file:remove(inFilePath);
    } on fail file:Error err {
        log:printError("Error moving file", err, filename = inFilePath);
    }
}

listener file:Listener fileListener = createFileListener();

function createFileListener() returns file:Listener|error {
    check createDirIfNotExists(inPath);
    return new (({path: inPath}));
}

final mysql:Client db = 
    check new mysql:Client(host, user, password, database, port);

function init() returns error? {
    check createDirIfNotExists(mvOnSuccessPath);
    check createDirIfNotExists(mvOnFailurePath);

    _ = check db->execute(`CREATE TABLE IF NOT EXISTS persons (
                                        firstName VARCHAR(50) NOT NULL,
                                        lastName VARCHAR(50) NOT NULL,
                                        phone VARCHAR(10) NOT NULL
                                    );`);
}

service on fileListener {
    remote function onCreate(file:FileEvent event) {
        string file = event.name;

        if !file.endsWith(CSV_EXT) {
            return;
        }

        do {
            Person[] persons = check io:fileReadCsv(file);
            sql:ParameterizedQuery[] insertQueries = from Person person in persons
                select `INSERT INTO persons (firstName, lastName, phone)
                        VALUES (${person.First\ Name}, ${person.Last\ Name}, ${person.Phone})`;
            _ = check db->batchExecute(insertQueries);
            move(file, mvOnSuccessPath);
        } on fail io:Error|sql:Error err {
            if err is io:Error {
                log:printError("Error occured while reading file", err, filename = file);
            } else {
                log:printError("Error occured while persisting data", err, filename = file);
            }
            move(file, mvOnFailurePath);
        }
    }
}
```

### Step 3: Build and run the service

You can run this service by navigating to the project root and using the `bal run` command.

```bash
file-processing$ bal run
Compiling source
        integration_tutorials/file_processing:0.1.0

Running executable
```

### Step 4: Try out the use case

Let's test the use case by creating a CSV file with the following content in the input (`inPath`) directory.

```ballerina
First Name, Last Name, Phone
Amy, Roy, 0112222222
Joy, Williams, 0111111111
```

Since this is a valid file, successfully processing of the file will result in entries being added to the database and the file being moved to the directory containing the files for which processing was successful (`mvOnSuccessPath`). Similiarly, you can test the behaviour with invalid and/or incompatible files.

You have now developed and run a simple service that serves as a directory listener and acts upon new CSV files added to the directory, to process the data, insert the data to a database, and move the file to a separate directory.

## Complete implementation

Check out the [complete implementation](https://github.com/ballerina-guides/integration-tutorials/tree/main/file-processing) on GitHub.

## References

- [`ballerina/http` API docs](https://lib.ballerina.io/ballerina/http/latest)
- [`ballerina/file` API docs](https://lib.ballerina.io/ballerina/file/latest)
- [`ballerina/log` API docs](https://lib.ballerina.io/ballerina/log/latest)
- [`ballerina/sql` API docs](https://lib.ballerina.io/ballerina/sql/latest)
- [`ballerinax/mysql` API docs](https://lib.ballerina.io/ballerinax/mysql/latest)
- [`ballerinax/mysql.driver` API docs](https://lib.ballerina.io/ballerinax/mysql.driver/latest)
