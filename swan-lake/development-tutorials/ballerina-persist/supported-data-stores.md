---
layout: ballerina-persist-documentation-left-nav-pages-swanlake
title: Supported data stores
description: The sections give details on the Supported Data Stores.
keywords: ballerina, programming language, ballerina packages, persist, data store, in-memory, mysql, mssql, postgresql, google sheets
permalink: /learn/ballerina-persist/supported-datastores/
active: persist_supported_datastores
intro: In the realm of the `bal persist` feature, selecting the right data store is crucial for ensuring reliable data storage and retrieval. Various data stores exist, each with its strengths and weaknesses. The `bal persist` currently supports four data stores. The configurations and supported types will vary depending on the data store you selected for your application.
redirect_from:
   - /learn/ballerina-persist/supported-datastores/
---

Following are the supported data stores.

* In-memory
* Relational databases (MySQL, MSSQL, PostgreSQL)
* Google Sheets [Experimental]
* Redis [Experimental]

There are two ways to use `bal persist`.
### Integrate to `bal build`

1. Initialize `bal persist` and integrate to `bal build` using the following command,

    ```shell
    $ bal persist add --datastore <data_store> --module <module_name>
    ```
   
   > *Note*: If you do not specify the data store, the in-memory data store is used by default.

2. After defining the entities, build the application using the following command,

    ```shell
    $ bal build
    ```

### One time generation

1. Initialize `bal persist` using the following command,

    ```shell
    $ bal persist init
    ```

2. Generate the persist client using the following command,

    ```shell
    $ bal persist generate --datastore <data_store> --module <module_name>
    ```
   > *Note*: Specifying the data store is mandatory and not implicitly configured.

It is recorded in the `Ballerina.toml` file in your project as follows.

```toml
[[tool.persist]]
options.datastore = mysql
...
```
The following sections describe the configurations and supported types for each data store.

## In-memory

The `in-memory` data store is a simple data store that stores data in memory. This data store is useful for testing purposes.

Below are the ways you can provide the data store for each client generation option.

1. Integrate the client API generation with the package build.
The default data store used in the package build is the in-memory data store. Therefore, you do not need to specify the data store explicitly when using it with `bal build`.

   ```shell
   $ bal persist add [--datastore inmemory]
   ```

2. One-time generation of the client API against the data model.

   ```shell
   $ bal persist generate --datastore inmemory
   ```

### Supported Ballerina types

The `in-memory` data store supports the following Ballerina types.

* [`any`](https://ballerina.io/learn/language-basics/#any-type)
* `error`

### Configuration

The In-Memory data store does not require any configuration.

## Relational Databases (MySQL, MSSQL, PostgreSQL)

The data store is a relational database management system that stores data in tables. It is useful for storing data in a relational format. It is not the default data store for `bal persist`. Therefore, you need to specify the data store explicitly when generating the bal persist client APIs for MySQL, MSSQL, and PostgreSQL.

Below are the ways you can provide the data store for each client generation option.

1. Integrate the client API generation with the package build.

   ```shell
   $ bal persist add --datastore [mysql/mssql/postgresql]
   ```

2. One-time generation of the client API against the data model.

   ```shell
   $ bal persist generate --datastore [mysql/mssql/postgresql]
   ```

### Supported Ballerina types

The supported types for the relational data store are different from one database to another. The following table lists the Ballerina types supported by the data store and the corresponding SQL types that are used to store the data in the database.

#### MySQL

|  Ballerina type  |    SQL type     |
|:----------------:|:---------------:|
|       int        |       INT       |
|      float       |     DOUBLE      |
|     decimal      | DECIMAL(65,30)  |
|      string      |  VARCHAR(191)   |
|     boolean      |     BOOLEAN     |
|      byte[]      |    LONGBLOB     |
|        ()        |      NULL       |
|    time:Date     |      DATE       |
|  time:TimeOfDay  |      TIME       |
|     time:Utc     |    TIMESTAMP    |
|    time:Civil    |    DATETIME     |
|       enum       |      ENUM       |

#### MSSQL

|  Ballerina type  |            SQL type            |
|:----------------:|:------------------------------:|
|       int        |              INT               |
|      float       |             FLOAT              |
|     decimal      |        DECIMAL(38, 30)         |
|      string      |          VARCHAR(191)          |
|     boolean      |              BIT               |
|      byte[]      |         VARBINARY(MAX)         |
|        ()        |              NULL              |
|    time:Date     |              DATE              |
|  time:TimeOfDay  |              TIME              |
|     time:Utc     |           DATETIME2            |
|    time:Civil    |           DATETIME2            |
|       enum       |      VARCHAR with checks.      |

#### PostgreSQL

|  Ballerina type  |       SQL type       |
|:----------------:|:--------------------:|
|       int        |         INT          |
|      float       |        FLOAT         |
|     decimal      |    DECIMAL(65,30)    |
|      string      |     VARCHAR(191)     |
|     boolean      |       BOOLEAN        |
|      byte[]      |        BYTEA         |
|        ()        |         NULL         |
|    time:Date     |         DATE         |
|  time:TimeOfDay  |         TIME         |
|     time:Utc     |      TIMESTAMP       |
|    time:Civil    |      TIMESTAMP       |
|       enum       | VARCHAR with checks. |

The default length for some SQL types can be changed using the [Advanced SQL type annotations](/learn/persist-model/#mapping-types). If you want even more control over the SQL types, you can change the SQL types in the `script.sql` file generated by the `persist generate` command before executing the script. It may not work for all the types.

### Configuration

You need to set values for the following basic configuration parameters in the `Config.toml` file in your project to use the relational data store.

|  Parameter  |              Description              |
|:-----------:|:-------------------------------------:|
|    host     |    The hostname of the DB server.     |
|    port     |      The port of the DB server.       |
|  username   |    The username of the DB server.     |
|  password   |    The password of the DB server.     |
|  database   | The name of the database to be used.  |

The following is a sample `Config.toml` file generated for each relational data store.

#### MySQL

```toml
[<packageName>.<moduleName>]
host = "localhost"
port = 3306
user = "root"
password = ""
database = ""
```

Additionally, you can set values for the following advanced configuration parameters in the `Config.toml` file in your project to use the MySQL data store. For more information on these parameters, see the [MySQL Connector documentation](https://lib.ballerina.io/ballerinax/mysql/latest#Options).

#### MSSQL

```toml
[<packageName>.<moduleName>]
host = "localhost"
port = 1433
user = "sa"
password = ""
database = ""
```

Additionally, you can set values for the following advanced configuration parameters in the `Config.toml` file in your project to use the MSSQL data store. For more information on these parameters, see the [MSSQL Connector documentation](https://lib.ballerina.io/ballerinax/mssql/latest#Options).

#### PostgreSQL

```toml
[<packageName>.<moduleName>]
host = "localhost"
port = 5432
user = "postgres"
password = ""
database = ""
```

Additionally, you can set values for the following advanced configuration parameters in the `Config.toml` file in your project to use the PostgreSQL data store. For more information on these parameters, see the [PosgreSQL Connector documentation](https://central.ballerina.io/ballerinax/postgresql/latest#Options).

### How to set up

#### Set up a DB server instance

Select one of the methods below to set up a DB server.

>**Note:** Keep the connection and authentication details for connecting to the DB server including the hostname, port, username, and password saved to be used later.

* Install a DB server on your machine locally by downloading and installing it based on your development platform.
* Use Docker to create a DB server deployment.
* Use a cloud-based DB solution such as Google’s CloudSQL, Amazon’s RDS, or Microsoft’s Azure database.

#### Run the script to create the database and tables

The `persist generate` command generates a `script.sql` file in the generated directory of your project. This file contains the SQL script to create the tables required for your application. You need to create a database and run this script to create tables in the DB server using a DB client.


## Google Sheets [Experimental]

The Google Sheets data store is a cloud-based spreadsheet application that stores data in tables. It is useful for storing data in a spreadsheet format. It is not the default data store for `bal persist`. Therefore, you need to specify the data store explicitly when generating the bal persist client APIs for Google Sheets.

Below are the ways you can provide the data store for each client generation option.

1. Integrate the client API generation with the package build.

   ```shell
   $ bal persist add --datastore googlesheets
   ```

2. One-time generation of the client API against the data model.

   ```shell
   $ bal persist generate --datastore googlesheets
   ```

### Supported Ballerina types

The following table lists the Ballerina types supported by the Google Sheets data store and the corresponding Google Sheets types used to store the data in the spreadsheet.

|  Ballerina Type  | Google Sheets Type  |
|:----------------:|:-------------------:|
|       int        |       NUMBER        |
|      float       |       NUMBER        |
|     decimal      |       NUMBER        |
|      string      |       STRING        |
|     boolean      |       BOOLEAN       |
|    time:Date     |       STRING        |
|  time:TimeOfDay  |       STRING        |
|     time:Utc     |       STRING        |
|    time:Civil    |       STRING        |


### Configuration

You need to set values for the following basic configuration parameters in the `Config.toml` file in your project to use the Google Sheets data store.

|   Parameter    |                 Description                  |
|:--------------:|:--------------------------------------------:|
|    clientId    |   The client ID of the Google Sheets API.    |
|  clientSecret  | The client secret of the Google Sheets API.  |
|  refreshToken  | The refresh token of the Google Sheets API.  |
| spreadsheetId  |    The ID of the spreadsheet to be used.     |

The following is a sample `Config.toml` file with the Google Sheets data store configuration. This is generated by the `persist generate` command.

```toml
[<packageName>.<moduleName>]
spreadsheetId = ""
clientId = ""
clientSecret = ""
refreshToken = ""
```

Please refer to the [Google API documentation](https://developers.google.com/identity/protocols/oauth2) for more information on how to obtain the client ID, client secret, and refresh token.

### How to set up

#### How to run `script.gs` in the worksheet

The `script.gs` file generated from the `persist generate` command can initiate the Google Sheets client. Follow the steps below to execute this file in the Google Apps Script console.
1. Go to the respective spreadsheet.
2. Open the AppScript console from the menu item `Extensions - > Apps Script`.
3. Copy the content of the `script.gs` file into the console.
4. Click **Deploy** to deploy the project as a web application.
5. Click **Run** to execute the selected function.

#### How to obtain Google API tokens

Follow the steps below to obtain API tokens for Google Sheets.
1. Get the `clientID` and `ClientSecret` by following the [guidelines](https://developers.google.com/identity/protocols/oauth2).
2. Follow the steps below to add https://developers.google.com/oauthplayground if you want to use OAuth 2.0 playground to receive the authorization code, access token, and refresh token.

    1. Go to the OAuth 2.0 playground and click **Settings** on the top right-hand side. 
    2. Select **Use your own OAuth credentials** and provide the client ID and client secret obtained. 
    3. For step 1 under the  `Select & authorize APIs` section, select the required scopes for the API you are going to use. 
    4. Proceed with the necessary Google account validation steps. 
    5. Click **Exchange authorization code for tokens** to obtain the refresh and access tokens.

## Redis [Experimental]

The Redis data store is a key-value-based in-memory datastore useful for quickly storing and retrieving unstructured data. It is not the default data store for `bal persist`. Therefore, you need to specify the data store explicitly when generating the bal persist client APIs for Redis DB.

Below are the ways you can provide the data store for each client generation option.

1. Integrate the client API generation with the package build.

   ```shell
   $ bal persist add --datastore redis
   ```

2. One-time generation of the client API against the data model.

   ```shell
   $ bal persist generate --datastore redis
   ```

### Supported Ballerina types

The Redis data store supports the following Ballerina types. As we have utilized `hash` and `set` as Redis data types to store objects, the following data types will be converted to `string`.

- int
- float
- decimal
- string
- boolean
- time:Date
- time:TimeOfDay
- time:Utc
- time:Civil
- enum

### Configuration

You need to define the `connection` parameter in the `Config.toml` file to use the Redis data store. This parameter should contain the connection URI pointing to your Redis server. The following is a sample `Config.toml` file with the Redis data store configuration. This is generated by the `persist generate` command.

```toml
[<packageName>.<moduleName>.connectionConfig]
connection = "redis://localhost:6379"

[<packageName>.<moduleName>.cacheConfig]
maxAge = -1
```

Alternatively, you can provide connection parameters instead of the `URI` as follows.

```toml
[<packageName>.<moduleName>.connectionConfig.connection]
host = "localhost"
port = 6379
```

Currently, the Redis data store only supports global cache configuration at the client level. The `maxAge` parameter in the cache configuration specifies the maximum age in `seconds` for cached objects. A value of `-1` indicates that objects within the cache have no expiry time, persisting indefinitely until manually removed.

Additionally, you can set values for the advanced configuration parameters in the `Config.toml` file in your project to use the Redis data store. For more information on these parameters, see the [Redis Connector documentation](https://central.ballerina.io/ballerinax/redis/latest#ConnectionConfig).

### How to set up

#### Setup a Redis server instance

Select one of the methods below to set up a Redis server.

- Install a Redis server on your machine locally by downloading and installing it based on your development platform. See the [official Redis documentation](https://redis.io/download/).
- Use Docker to create a DB server deployment.
   1. Install Docker on your machine if you haven't already.
   2. Pull the Redis Docker image from Docker Hub using the following command.

      ```shell
      $ docker pull redis
      ```
   
   3. Run the Redis container as follows.
   
      ```shell
      $ docker run -d -p 6379:6379 --name <container-name> redis
      ```
   
- Use a cloud-based DB solution such as Google’s Cloud, Amazon’s Web Services, or Microsoft’s Azure database.
   1. Visit the [Redis cloud console](https://app.redislabs.com).
   2. Log in using email and password or using one of the single sign-on options.
   3. Choose either Amazon Web Services, Google Cloud, or Microsoft Azure as the database provider.
   4. Select a region and create the database.
   5. Find your `username`, `password` and the `public endpoint`.
   6. Replace the `connection` parameter in the `Config.toml` file as below.

      ```toml
      connection = "redis://<username>:<password>@<public_endpoint>"
      ```
