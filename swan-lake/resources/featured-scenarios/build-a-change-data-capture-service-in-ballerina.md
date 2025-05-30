---
layout: build-a-change-data-capture-service-left-nav-pages-swanlake
title: Build a Change Data Capture (CDC) service in Ballerina 
description: Capture and process database changes in real-time using Ballerina CDC connectors.
keywords: ballerina, cdc, change data capture, database, streaming, API
permalink: /learn/build-a-change-data-capture-service-in-ballerina/
active: build-a-change-data-capture-service
intro: In this guide, you’ll learn how to build a Change Data Capture (CDC) service using Ballerina to implement real-time fraud detection. The service monitors changes to a MySQL database and flags high-value transactions that exceed a defined threshold.
---

## Prerequisites

To follow along with this tutorial, ensure you have:

* [Ballerina 2201.12.0 (Swan Lake)](https://ballerina.io/downloads/) or later
* A text editor  

  > **Tip:** Preferably [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina)
* A terminal or command-line interface
* MySQL 8.0 or later

## Set up a MySQL server instance

You can use one of the following methods to set up MySQL:

1. **Install MySQL locally** from the [official MySQL site](https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing)
2. **Use a server stack** like [XAMPP](https://www.apachefriends.org/) or [WampServer](https://wampserver.aviatechno.net/)
3. **Run MySQL in Docker** using [these official instructions](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/docker-mysql-getting-started.html)
4. **Use a cloud-hosted instance** from [Google Cloud SQL](https://cloud.google.com/sql), [Amazon RDS](https://aws.amazon.com/rds/mysql/), or [Azure Database for MySQL](https://azure.microsoft.com/en-us/services/mysql/)

> **Tip:** Keep your MySQL connection details (host, port, username, and password) handy.

## Set up the MySQL database

### Enable CDC in MySQL

CDC relies on [MySQL’s binary logging](https://dev.mysql.com/doc/refman/8.4/en/binary-log.html) feature, which is enabled by default in MySQL 8.0+ unless explicitly disabled.

#### Verify binary logging

Run the following SQL to confirm:

```sql
SHOW VARIABLES LIKE 'log_bin';
```

If `log_bin` is `ON`, you're good to go.

#### Ensure proper CDC settings

Also, verify the following:

```sql
SHOW VARIABLES LIKE 'binlog_format';
SHOW VARIABLES LIKE 'binlog_row_image';
```

If needed, update your `my.cnf` or `my.ini` file:

```ini
[mysqld]
server-id=223344
log-bin=mysql-bin
binlog-format=ROW
binlog-row-image=FULL
```

Then restart MySQL to apply the changes.

### Create necessary tables

Log in to your MySQL server and execute:

```sql
CREATE DATABASE IF NOT EXISTS finance_db;
USE finance_db;

CREATE TABLE transactions (
    tx_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at DATETIME
);

INSERT INTO transactions (user_id, amount, status, created_at) VALUES
(10, 9000.00, 'COMPLETED', '2025-04-01 08:00:00'),
(11, 12000.00, 'COMPLETED', '2025-04-01 08:10:00'), -- this triggers fraud logic
(12, 4500.00, 'PENDING', '2025-04-01 08:30:00');
```

## Create a Ballerina service package

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](https://ballerina.io/learn/organize-ballerina-code/).

In the terminal, run the following to create a new Ballerina package:

```
$ bal new fraud_detection
```

This creates:

```
fraud_detection/
├── Ballerina.toml
└── main.bal
```

> **Tip:** Delete the auto-generated `main.bal` — we’ll create our own.

## Define the `Transaction` record

In Ballerina, records represent structured data. Define one that matches the `transactions` table:

```ballerina
type Transactions record {|
    int tx_id;
    int user_id;
    float amount;
    string status;
    int created_at;
|};
```

## Import required modules

Add the following imports to your Ballerina program:

- `ballerinax/cdc`: Core module that provides APIs to capture and process database change events.
- `ballerinax/mysql`: Provides MySQL-specific listener and types for CDC.
- `ballerinax/mysql.cdc.driver as _`: Debezium-based driver for MySQL CDC.

```ballerina
import ballerinax/cdc;
import ballerinax/mysql;
import ballerinax/mysql.cdc.driver as _;
```

## Add CDC listener and base service

Set up the CDC listener using the [`mysql:CdcListener`](https://central.ballerina.io/ballerinax/mysql/latest#CdcListener) and [`cdc:Service`](https://central.ballerina.io/ballerinax/cdc/latest#Service):

```ballerina
import ballerinax/cdc;
import ballerinax/mysql;
import ballerinax/mysql.cdc.driver as _;

configurable string username = ?;
configurable string password = ?;

listener mysql:CdcListener financeDBListener = new (
    database = {
        username,
        password,
        includedDatabases: "finance_db",
        includedTables: "finance_db.transactions"
    },
    options = {
        snapshotMode: cdc:NO_DATA,
        skippedOperations: [cdc:TRUNCATE, cdc:UPDATE, cdc:DELETE]
    }
);
```

> **Tip:** Use [Ballerina configurable variables](https://ballerina.io/learn/configure-a-sample-ballerina-service/) to manage credentials securely.

*Define the CDC Service*

```ballerina
service cdc:Service on financeDBListener {
    isolated remote function onCreate(Transactions trx) returns error? {
        log:printInfo(`Transaction with id: ${trx.tx_id}`);
        if trx.amount > 10000.0 {
            log:printWarn(
                `⚠️ Fraud alert: High-value transaction detected: 
                Id: ${trx.tx_id}, 
                User Id: ${trx.user_id}, 
                Amount: $${trx.amount}`
            );
        }
    }

    isolated remote function onError(cdc:Error e) {
        log:printError("CDC error occurred", e);
    }
}
```

> **Note:** We're only handling `onCreate` here, but the service can also support `onRead`, `onUpdate`, and `onDelete`.

## The complete code

Here’s the complete `main.bal`:

```ballerina
import ballerina/log;
import ballerinax/cdc;
import ballerinax/mysql;
import ballerinax/mysql.cdc.driver as _;

configurable string username = ?;
configurable string password = ?;

type Transactions record {|
    int tx_id;
    int user_id;
    float amount;
    string status;
    int created_at;
|};

listener mysql:CdcListener financeDBListener = new (
    database = {
        username,
        password,
        includedDatabases: "finance_db",
        includedTables: "finance_db.transactions"
    },
    options = {
        snapshotMode: cdc:NO_DATA,
        skippedOperations: [cdc:TRUNCATE, cdc:UPDATE, cdc:DELETE]
    }
);

service cdc:Service on financeDBListener {
    isolated remote function onCreate(Transactions trx) returns error? {
        log:printInfo(`Transaction with id: ${trx.tx_id}`);
        if trx.amount > 10000.0 {
            log:printWarn(
                `⚠️ Fraud alert: High-value transaction detected: 
                Id: ${trx.tx_id}, 
                User Id: ${trx.user_id}, 
                Amount: $${trx.amount}`
            );
        }
    }

    isolated remote function onError(cdc:Error e) {
        log:printError("CDC error occurred", e);
    }
}
```

## Run the service

### Add the credentials

In the package directory, create a new file named `Config.toml` and specify the configurations below to connect to the MySQL database.

```toml
username="root"
password="rootPassword"
```

### Execute the `bal run` command

```
$ bal run
```

You should see the listener start up and await changes.
```
Compiling source
        foo/fraud_detection:0.1.0

Running executable
```

## Try it out

Run the following SQL to simulate transactions:

```sql
USE finance_db;

INSERT INTO transactions (user_id, amount, status, created_at) VALUES
(11, 2000.00, 'COMPLETED', '2025-04-01 08:10:00');

INSERT INTO transactions (user_id, amount, status, created_at) VALUES
(11, 12000.00, 'COMPLETED', '2025-04-01 08:10:00');
```

Expected output:

```
time=2025-05-28T22:49:59.231+05:30 level=INFO module=wso2/fraud_detection message="Transaction with id: 5"
time=2025-05-28T22:49:59.245+05:30 level=WARN module=wso2/fraud_detection message="⚠️ Fraud alert: High-value transaction detected: Id: 5, User Id: 11, Amount: $12000.0"
```

## Learn more

To learn more about CDC service in Ballerina, see the following.

* [CDC module docs](https://central.ballerina.io/ballerinax/cdc/latest)
* [MySQL CDC Listener](https://central.ballerina.io/ballerinax/mysql/latest#CdcListener)
* [CDC Examples](https://ballerina.io/learn/by-example/#change-data-capture)
