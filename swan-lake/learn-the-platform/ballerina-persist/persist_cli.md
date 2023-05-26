---
layout: ballerina-persist-documentation-left-nav-pages-swanlake
title: Persist CLI Tool
description: The sections gives details on the Persist CLI Tool.
keywords: ballerina, programming language, ballerina packages, persist, persist cli tool, persist init, persist generate, persist migrate
permalink: /learn/ballerina-persist/persist-cli/
active: persist_overview
intro: One of the main components of the `persist` module is the CLI tool. This tool is used to initialize the project with the persistence layer and generate the required files.
redirect_from:
- /learn/ballerina-persist/persist-cli/
---

## Initialize the Project with Persistence.

The Ballerina project should be initialized with the persistence layer before generating the persistence derived types, clients, and script files. This can be done using the `init` command. You can specify the preferred data store and the module which you need to generate files. If you do not specify the data store and the module, the default values will be used.

```bash
$ bal persist init --datastore="mysql" --module="store"
```

| Command Parameter  |                                                     Description                                                      | Mandatory  |       Default Value        |
|:------------------:|:--------------------------------------------------------------------------------------------------------------------:|:----------:|:--------------------------:|
|     datastore      | used to indicate the preferred data store. Currently, three data stores are supported: inmemory, mysql, googlesheets |     No     |          immemory          |
|       module       |                    used to indicate the persist enabled module in which the files are generated.                     |     No     |       <root_module>        |


The command initializes bal persist feature in the project. This command will do the following,

1. Create persist directory in the project root directory.
   This directory contains the data model definition file(model.bal) of the project.
   
2. Create a model definition file in persist directory
   This file is used to model the data which need to be persisted in the project. You can have only one data model definition file in the project and file name can be anything with the `.bal` extension. The default file name is `model.bal`. Entities defined in this file should be based on the [`persist model` specification](persist_model.md).

3. Update the `Ballerina.toml` file with persist module configurations.
   It will update the Ballerina.toml file with persist configurations, as follows,
    ```ballerina
    [persist]
    datastore = "mysql"
    module = "rainier.store"
   ```

The directory structure will be,
```
rainier
   ├── persist
            └── model.bal
   ├── Ballerina.toml
   └── main.bal
```

Behaviour of the `init` command,
- User should invoke the command within a Ballerina project
- User can use the optional arguments to indicate the preferred module name and data store, otherwise default values will be used.
- User cannot execute the command multiple times within the same project. User needs to remove the Ballerina.toml configurations, if the user wants to reinitialize the project.

## 3. Generating Persistence Derived Types, Client, and Script Files

This command is used to generate the derived types, clients, and script files based on the data model definition file. This command is executed in the project root directory, as follows,

```bash
$ bal persist generate
```

It will add generated files under the `generated` directory. The directory structure will be as follows,

If the module name is provided, it will generate the files under a new subdirectory with the module name like below. Otherwise, it will generate the files under the `generated` directory.

```
rainier
   ├── generated
        └── store
              ├── persist_client.bal
              ├── persist_db_config.bal
              ├── persist_types.bal
              └── script.sql
   ├── persist
        └── model.bal
   ├── Ballerina.toml
   ├── Config.toml
   └── main.bal
```

* The `persist_types.bal` file will contain the derived types based on the entities defined in the model definition file. 

* The `persist_client.bal` file will contain the client which is used to access the data store.

* The `persist_*_config.bal` file will contain the configurable variables required for the data store access. The configurable variables are changed based on the data store specified in the `Ballerina.toml` file. For example, if the data store is `mysql`, the configurable variables will be as follows.

```ballerina
configurable string host = ?;
configurable int port = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;
```

* The script file(script.sql) will contain the scripts to create the tables in the data store. This script file will be generated based on the data store specified in the `Ballerina.toml` file.

Additionally, this command will create/update `Config.toml` file with configurables used to connect the client with the data store. Generated configurables will be based on the data store specified in the `Ballerina.toml` file.

Behaviour of the `generate` command,
- User should invoke the command within a Ballerina project
- The user should have initiated the bal persist feature in the project and update the model definition file.
- The model definition file should contain the `persist` module import (`import ballerina/persist as _;`)
- The Model definition file should contain at least one entity
- If the user invokes the command twice, it will not fail. It will regenerate the files again.

## Generating Migration scripts for the Model Definition Changes[Experimental]

>**Info:** The support for migrations is currently an experimental feature, and its behavior may be subject to change in future releases. Also, the support for migrations is currently limited to MySQL data store.

This command is used to generate the migration scripts for the model definition changes. This command is executed in the project root directory. This command will generate the migration scripts based on the changes in the model definition file. The generated migration scripts will be added to the `migrations` directory inside the `persist` directory.

```bash
$ bal persist migrate add_employee
```

The file structure of the project after executing the command will be as follows,

```
rainier
   ├── generated
         └── store
               ├── persist_client.bal
               ├── persist_db_config.bal
               ├── persist_types.bal
               └── script.sql
   ├── persist
         └── model.bal
         └── migrations
               └── 20200820120000_add_employee
                  ├── model.bal
                  └── script.sql     
   ├── Ballerina.toml
   ├── Config.toml
   └── main.bal
```

This command will create a new directory for the migration with the timestamp and the label provided by the user. The directory will contain the model definition file and the script file. The script file will contain the SQL script to update the database schema. The model definition file will be the snapshot of the model definition file at the time of executing the command. The next time the user executes the command, it will compare the model definition file with the latest snapshot file and generate the SQL script to update the database schema. So the user should not modify the snapshot file.

Behaviour of the `migrate` command,
- User should invoke the command within a Ballerina project
- User should provide a valid label for the migration.
- The user should have initiated the persistence layer in the project and update the model definition file.
- The user can execute the command multiple times. It will generate the migration scripts based on the changes in the model definition file.
- Once the migration is generated, the user cannot change the data store type in the `Ballerina.toml` file. If the user wants to change the data store type, the user needs to remove the migration directory and reinitialize the project.
