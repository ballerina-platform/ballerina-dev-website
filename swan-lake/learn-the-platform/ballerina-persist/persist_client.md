---
layout: ballerina-persist-documentation-left-nav-pages-swanlake
title: Persist Client API
description: The sections gives details on the generated Persist Client API.
keywords: ballerina, programming language, ballerina packages, persist, persist client, persist client api
permalink: /learn/ballerina-persist/persist-client-api/
active: persist_overview
intro: Persist client is used to perform CRUD operations on the data source. Each entity type will have five resource methods for each operation. The resource methods are get, get(get by identity), post, put, and delete. Persist CLI tool will generate the derived Entity Types and the clients from the model definition.
redirect_from:
- /learn/ballerina-persist/persist-client-api
---

## Derived Entity Types

Ballerina record types used in the generated clients are derived from the entity types defined in the data model.

Example of a defined entity,
```ballerina
type Workspace record {|
    readonly string id;
    string workspaceType;
    Building location; // 1-n relation (parent)
    Employee? employees; // 1-1 relation (child)
|};
```

There are six types of derived entity types:
1. Entity Types  
    These are the types defined in the data model. These are used to indicate the data structure in the data source. The entity who is the association parent will include the foreign key field(s).
    ```ballerina
    public type Workspace record {|
        readonly string id;
        string workspaceType;
        string locationCode;
    |};
    ```
    
2. Insert Types
    These are the records used to insert data in the data source. This is same as the Entity Type.
    ```ballerina
    public type WorkspaceInsert Workspace;
    ```

3. Update Types
    These are the records used to update data in the data source. These are entity types without the identity fields. All fields will be optional. Only the fields for which values are provided will be updated.
    ```ballerina
    public type WorkspaceUpdate record {|
        string workspaceType?;
        string locationCode?;
    |};
    ```
   
4. Optionalized Types
    These are the same as the Entity Types, but all the fields are made optional. This type is not directly used in any operations.
    ```ballerina
    public type WorkspaceOptionalized record {|
        readonly string id?;
        string workspaceType?;
        string locationCode?;
    |};
    ```
   
5. With Relations Types
    This types inherits all fields from the corresponding `Optionalized` type, and adds the relation fields as optional. This type is not directly used in any operations.
    ```ballerina
    public type WorkspaceWithRelations record {|
        *WorkspaceOptionalized;
        BuildingOptionalized location?;
        EmployeeOptionalized employees?;
    |};
    ```

6. Target Types
    This type is used to retrieve data from the data source. If the entity contains a relation field, the target type 
    will be a type description of the corresponding `WithRelations` type. Otherwise, the target type will be a 
    type description of the corresponding `Optionalized` type.
    ```ballerina
    public type WorkspaceTargetType typedesc<WorkspaceWithRelations>;
    ```
    
### Persist Clients

Persist Clients are derived for each data model definition file. The client is used to perform CRUD operations on the data source. Each entity type will have five resource methods for each operation. The resource methods are get, get(get by identity), post, put, and delete.

The skeleton of the Persist client is as follows,
```ballerina
public client class Client {
    *persist:AbstractPersistClient;

    public function init() returns persist:Error? {
    }

    isolated resource function get workspaces(WorkspaceTargetType targetType = <>) returns stream<targetType, Error?> {
    };

    isolated resource function get workspaces/[string id](WorkspaceTargetType targetType = <>) returns targetType|Error {
    };

    isolated resource function post workspaces(WorkspaceInsert[] data) returns string[]|persist:Error {
    };

    isolated resource function put workspaces/[string id](WorkspaceUpdate data) returns Workspace|persist:Error {
    };

    isolated resource function delete workspaces/[string id]() returns Workspace|persist:Error {
    };

    public function close() returns persist:Error? {
    }
}
```

The conventions used in deriving the Persist client are as follows:
1. Since there can be only one generated client in a Ballerina package, the Client name is always `Client`.
2. The client should be of the `persist:AbstractPersistClient` type.
3. It should contain `init()` and `close()` functions.
4. It should contain five resource methods for each entity type defined in the data model. Resource methods are get, get(get by identity), post, put, and delete.
5. Resource names are plural form of lowercase entity names.
6. The resource method should return the derived entity types.
7. Resource method with path parameters will support composite identity field by having multiple path parameters.

### Persist Client Usage

#### Client Initialization

The `init()` function is used to initialize the client. The client will be initialized with the data source configuration provided in the `Config.toml` file. The `init()` function will return an error if the client initialization fails.

You can initialize the client like this:
```ballerina
Client sClient = check new();
```

#### CRUD Operations

you can perform CRUD operations on the `Workspace` table in the data store using the client object, like this:
```ballerina
// Create a new workspace record
WorkspaceInsert workspace = {id: "WK001", workspaceType: "Host Desk", locationCode: "B001"};
string[] workspaceId = sClient->/workspaces.post([workspace]);

// Get the workspace record with id WK001
Workspace|error workspace = sClient->/workspaces/WK001;

// Update the workspace record with id WK001
Workspace|error updated = sClient->/workspaces/WK001.put({workspaceType: "Cubical"});

// Delete the workspace record with id WK001
Workspace|error deleted = sClient->/workspaces/WK001.delete();

// Get all the workspace records
stream<Workspace, error?> workspaces = sClient->/workspaces;
```

#### Relation Operations

You can perform relation operations on the `Workspace` table in the data store using the client object, like this:

Let's extend the `Workspace` entity type with a relation field `employees` as follows,
```ballerina
type Workspace record {|
    readonly string id;
    string workspaceType;
    Building location; // 1-n relation (parent)
    Employee? employees; // 1-1 relation (child)
|};

type Employee record {|
    readonly string id;
    string firstName;
    string lastName;
    string email;
    float salary;
    Workspace workspace; // 1-1 relation (parent)
|};

type Building record {|
    readonly string code;
    string name;
    string address;
    Workspace[] workspaces; // 1-n relation (child)
|};
```

You can retrieve Workspace record with the related Employee record by using a custom target type as follows, This is equivalent to a SQL join operation between the `Workspace` and `Employee` tables.

```ballerina
// Get the workspace record with id WK001 with the related employee record
WorkspaceWithEmployee|error workspace = sClient->/workspaces/WK001.get();

// WorkspaceWithEmployee is a record with the following fields
type WorkspaceWithEmployee record {|
    readonly string id;
    string workspaceType;
    string locationCode
    Employee employees; // 1-1 relation (child)
|};
```

This same as write write the following SQL query to retrieve data from MySQL database,
```sql
SELECT * 
FROM workspace w
INNER JOIN employee e ON w.id = e.workspaceId
WHERE w.workspaceId = 'WK001';
```

The persisted client will automatically perform the join operation and return the result.

#### Projection Operations

You can retrieve Workspace record with the related Employee record and the related Building record by using a custom target type. When specifying the target type, you can specify the target type with subset of fields of the entity types as follows, 

This is equivalent to a SQL join operation between the `Workspace`, `Employee` and `Building` tables and also a SQL projection operation.

```ballerina
// Get the workspace record with id WK001 with the related employee record and the related building record

WorkspaceWithRelations|error workspace = sClient->/workspaces/WK001.get();

// WorkspaceWithRelations is a record with the following fields
type WorkspaceWithRelations record {|
    string workspaceType;
    record {|
        string firstName;
        string lastName;
    |} employees; // 1-1 relation (child)
    record {|
        string name;
        string address;
    |} location; // 1-n relation (parent)
|};
```

This same as write write the following SQL query to retrieve data from MySQL database,
```sql
SELECT w.workspaceType, e.firstName, e.lastName, b.name, b.address
FROM workspace w
INNER JOIN employee e ON w.id = e.workspaceId
INNER JOIN building b ON w.locationCode = b.code
WHERE w.workspaceId = 'WK001';
```

The persist client will automatically perform the join and projection operations on the data source and return the result.

You can also refer to bal persist examples for learn about client API usage.
