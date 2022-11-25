 # Specification: Ballerina SQL Library

_Owners_: @daneshk @niveathika  
_Reviewers_: @daneshk  
_Created_: 2022/01/13   
_Updated_: 2022/07/07  
_Edition_: Swan Lake  

## Introduction

This is the specification for the SQL standard library of [Ballerina language](https://ballerina.io/), which provides the generic interface and functionality to interact with a SQL database.  

The SQL library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag. 

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)  
2. [Client](#2-client)  
   2.1. [Handle connection pools](#21-handle-connection-pools)  
   2.2. [Closing the Client](#22-close-the-client)
3. [Queries and Values](#3-queries-and-values)  
   3.1. [ParameterizedQuery and Values](#31-parameterizedquery-and-values)  
   3.2. [ParameterizedCallQuery and Parameters](#32-parameterizedcallquery-and-parameters)  
   3.3. [Query concatenation](#33-query-concatenation)  
4. [Database operations](#4-database-operations)  
   4.1. [Query](#41-query)  
   4.2. [Query row](#42-query-row)  
   4.3. [Execute](#43-execute)  
   4.4. [Batch execute](#44-batch-execute)  
   4.5. [Call](#45-call)  
5. [Metadata operations](#5-metadata-operations)  
   5.1. [Schema client](#51-schema-client)  
   5.2. [Metadata types](#52-metadata-types)  
   5.3. [Metadata methods](#53-metadata-methods)  
6. [Errors](#6-errors)

# 1. Overview

This specification elaborates on the generic `Client` interface used in ballerina SQL connectors
to interface with a relational database such as MySQL, MSSQL, Postgresql and OracleDB. 

`Client` supports five database operations as follows,
1. Executes the query, which may return multiple results.
2. Executes the query, which is expected to return at most one row of the result.
3. Executes the SQL query. Only the metadata of the execution is returned.
4. Executes the SQL query with multiple sets of parameters in a batch. Only the metadata of the execution is returned.
5. Executes a SQL query, which calls a stored procedure. This can either return results or nil.

All the above operations make use of `ParameterizedQuery` object, backtick surrounded string template to pass 
SQL statements to the database. `ParameterizedQuery` supports passing of Ballerina basic types or Typed SQL Values such 
as `CharValue`, `BigIntValue`, etc. to indicate parameter types in SQL statements. 

# 2. Client

Each client represents a pool of connections to the database. The pool of connections is maintained throughout the 
lifetime of the client.

## 2.1. Handle connection pools

**Configuration available for tweaking the connection pool properties:**

   ```ballerina
   # The properties, which are used to configure a DB connection pool.
   # Default values of the fields can be set through the configuration API.
   #
   # + maxOpenConnections - The maximum number of open connections that the pool is allowed to have.
   #                        Includes both idle and in-use connections. The default value is 15. This can be changed through
   #                        the configuration API with the `ballerina.sql.maxOpenConnections` key
   # + maxConnectionLifeTime - The maximum lifetime (in seconds) of a connection in the pool. The default value is 1800
   #                           seconds (30 minutes). This can be changed through the configuration API with the
   #                           `ballerina.sql.maxConnectionLifeTime` key. A value of 0 indicates an unlimited maximum
   #                           lifetime (infinite lifetime)
   # + minIdleConnections - The minimum number of idle connections that the pool tries to maintain. The default
   #                        value is the same as `maxOpenConnections` and it can be changed through the configuration
   #                        API with the `ballerina.sql.minIdleConnections` key
   public type ConnectionPool record {|
       int maxOpenConnections = maxOpenConnections;
       decimal maxConnectionLifeTime = maxConnectionLifeTime;
       int minIdleConnections = minIdleConnections;
   |};
   ```

There are three possible scenarios for connection pool handling,
1. Global, shareable, default connection pool

   If the `poolOptions` field is **NOT** provided when creating the database client, a globally-shareable pool will be
   created for the database connection unless a connection pool matching with the properties provided already exists.
   The JDBC module sample below shows how the global connection pool is used.

    ```ballerina
    jdbc:Client|sql:Error dbClient = new ("jdbc:mysql://localhost:3306/testdb", "root", "root");
    ```

2. Client-owned, un-sharable connection pool

   If the `connectionPool` field is defined inline when creating the database client with the `sql:ConnectionPool` type,
   an un-sharable connection pool will be created. The JDBC module sample below shows how the global
   connection pool is used.

    ```ballerina
    jdbc:Client|sql:Error dbClient =  new (url = "jdbc:mysql://localhost:3306/testdb",
                                                connectionPool = { maxOpenConnections: 5 });
    ```

3. Local, shareable connection pool

   If a record of the `sql:ConnectionPool` type is created and reused in the configuration of multiple clients,
   for each set of clients that connects to the same database instance with the same set of properties, a shared
   connection pool will be created. The JDBC module sample below shows how the global connection pool is used.

    ```ballerina
    sql:ConnectionPool connPool = { maxOpenConnections: 5 };
    
    jdbc:Client|sql:Error dbClient1 = new (url = "jdbc:mysql://localhost:3306/testdb", connectionPool = connPool);
    jdbc:Client|sql:Error dbClient2 = new (url = "jdbc:mysql://localhost:3306/testdb", connectionPool = connPool);
    jdbc:Client|sql:Error dbClient3 = new (url = "jdbc:mysql://localhost:3306/testdb", connectionPool = connPool);
    ```

## 2.2. Close the client

Once all the database operations are performed, the client can be closed by invoking the `close()`
operation. This will close the corresponding connection pool if it is not shared by any other database clients.

   ```ballerina
    # Closes the SQL client and shuts down the connection pool.
    #
    # + return - Possible error when closing the client
    public isolated function close() returns Error?;
   ```

# 3. Queries and values

## 3.1. `ParameterizedQuery` and values

The `sql:ParameterizedQuery` is used to construct the SQL query to be executed by the client. It is backtick string 
template which allows dynamic values for query parameters.

*Query with constant values*

```ballerina
sql:ParameterizedQuery query = `SELECT * FROM students WHERE id < 10 AND age > 12`;
```

*Query with dynamic values*

```ballerina
int[] ids = [10, 50];
int age = 12;
sql:ParameterizedQuery query = `SELECT * FROM students WHERE id < ${ids[0]} AND age > ${age}`;
```

All primitive Ballerina types are supported for parameter values in `sql:ParameterizedQuery`. Following mapping is used to map ballerina types to SQL types,

| Ballerina type | SQL type |
|:--------------:|:--------:|
|     String     | VARCHAR  |
|      int       | INTEGER  |
|    boolean     | BOOLEAN  |
|     float      |   REAL   |
|    decimal     | DECIMAL  |
|     byte[]     |  BINARY  |
|      xml       |  SQLXML  |
|   record {}    |  STRUCT  |
|     Array      |  ARRAY   |

In addition to the above `time` module constructs are used to represent SQL Time data types.

| `time` constructs | SQL type  |
|:-----------------:|:---------:|
|     time:Date     |   DATE    |
|  time:TimeOfDay   |   TIME    |
|    time:Civil     | DATETIME  |
|     time:Utc      | TIMESTAMP |

Furthermore, typed values are used to map values to a specific SQL data type such as `BIGINT`,
   ```ballerina
      BigIntValue value = new(1000000000000);
      sql:ParameterizedQuery query = `SELECT * FROM students WHERE id < ${value}`;
   ```

List of typed values:

1. VarcharValue
2. NVarcharValue
3. CharValue
4. NCharValue
5. TextValue 
6. ClobValue
7. NClobValue
8. SmallIntValue
9. IntegerValue
10. BigIntValue
11. NumericValue 
12. DecimalValue
13. RealValue
14. FloatValue
15. DoubleValue 
16. BitValue
17. BooleanValue
18. BinaryValue
19. VarBinaryValue
20. BlobValue
21. DateValue
22. TimeValue
23. DateTimeValue
24. TimestampValue 
25. RefValue 
26. StructValue 
27. RowValue

## 3.2. `ParameterizedCallQuery` and parameters

The `sql:ParameterizedCallQuery` is used to construct the SQL CALL Statement to be executed by the client. It is backtick string
template which allows dynamic values for query parameters. In addition to Values supported by `sql:ParameterizedQuery`, 
`sql:ParameterizedCallQuery` supports following SQL Parameters,

1. InOutParameter
2. Typed OutParameters

These types can be used to retrieve values from SQL stored procedures using the `get()` method.

   ```ballerina
   # Parses returned Char SQL value to a ballerina value.
   #
   # + typeDesc - The `typedesc` of the type to which the result needs to be returned
   # + return - The result in the `typeDesc` type, or an `sql:Error`
   public isolated function get(typedesc<anydata> typeDesc = <>) returns typeDesc|Error;
   ```

   ```ballerina
   InOutParameter parameter = new ("varchar value");
   
   // Execute the DB call method
   
   string procedureParam = parameter.get();
   ```
   Type of the returned value is inferred from LHS of the expression.

## 3.3. Query concatenation

`sql:ParameterizedQuery` can be concatenated using util methods such as `sql:queryConcat()` and 
`sql:arrayFlattenQuery()` which makes it easier to create a dynamic/constant complex query.

The `sql:queryConcat()` is used to create a parameterized query by concatenating a set of parameterized queries.

```ballerina
int id = 10;
int age = 12;
sql:ParameterizedQuery query = `SELECT * FROM students`;
sql:ParameterizedQuery query1 = ` WHERE id < ${id} AND age > ${age}`;
sql:ParameterizedQuery sqlQuery = sql:queryConcat(query, query1);
```

The query with the `IN` operator can be created using the `sql:ParameterizedQuery()`. Here the values in the array are
flattened with a comma separator to add it in the query.

```ballerina
int[] ids = [1, 2, 3];
sql:ParameterizedQuery query = `SELECT count(*) as total FROM DataTable 
                                WHERE row_id in (${ids[0]}, ${ids[1]}, ${ids[2]})`;
```

The util function `sql:arrayFlattenQuery()` can be used to make the array flatten easier. It makes the inclusion of 
varying array elements into the query easier by flattening the array to return a parameterized query.

```ballerina
int[] ids = [1, 2];
sql:ParameterizedQuery sqlQuery = sql:queryConcat(`SELECT * FROM DataTable WHERE id IN (`, 
                                          sql:arrayFlattenQuery(ids), `)`);
```

# 4. Database operations

The client supports five remote methods, each for one Database operation

## 4.1. Query

`query()` remote method execute the SQL query and returns multiple results.

```ballerina
# Executes the query, which may return multiple results.
#
# + sqlQuery - The SQL query
# + rowType - The `typedesc` of the record to which the result needs to be returned
# + return - Stream of records in the `rowType` type
remote isolated function query(ParameterizedQuery sqlQuery, typedesc<record {}> rowType = <>) 
                        returns stream <rowType, Error?>;
```

Here the returned stream can consist of following types of records,
1. Open record  
   The property name in the open record type will be the same as how the column is defined in the database.
   ```ballerina
   sql:ParameterizedQuery query = `SELECT * FROM students WHERE id < ${id} AND age > ${age}`;
   stream<record {}, sql:Error?> resultStream = dbClient->query(query);
   ```
   
2. Typed record  
   A ballerina record type is created to represent the returned result set. the `SELECT` query is executed
   via the `query` remote function of the client. Once the query is executed, each data record can be retrieved by looping
   the result set. The `stream` returned by the select operation holds a pointer to the actual data in the database, and it
   loads data from the table only when it is accessed. This stream can be iterated only once.

   This record can be defined as an open or a closed record according to the requirement. If an open record is defined, 
   the returned stream type will include both defined fields in the record and additional database columns fetched by 
   the SQL query that are not defined in the record. Additional column names added to the returned record as in the 
   SQL query. If the record is defined as a close record, only defined fields in the record are returned or gives 
   an error when additional columns present in the SQL query.

   Note the mapping of the database column to the returned record's property is case-insensitive if it is defined in the
   record(i.e., the `ID` column in the result can be mapped to the `id` property in the record).
   
   ```ballerina
   type Student record {
       int id;
       int age;
       string name;
   };
   
   int id = 10;
   int age = 12;
   sql:ParameterizedQuery query = `SELECT * FROM students WHERE id < ${id} AND age > ${age}`;
   stream<Student, sql:Error?> resultStream = dbClient->query(query);
   ```
   
   `sql:Column` annotation can be used to map database columns to record fields of different name. This annotation should be attached to record fields.
   ```ballerina
   type Student record {
       int id;
       @sql:Column { name: "first_name" }
       string firstName;
       @sql:Column { name: "last_name" }
       string lastName
   };
   ```
   The above annotation will map the database column `first_name` to the Ballerina record field `firstName`. If the `query()` function does not return `first_name` column, the field will not be populated.

   Multiple table columns can be matched to a single Ballerina record within a returned record. For instance if the query returns data from multiple tables as follows,
   ![schema](../proposals/resources/schema1.png)
   Both `TEACHERS.id` and `TEACHERS.name` can be grouped to another Typed record such as `Teacher` type.

   ```ballerina
   public type Students record {|
       int id;
       string name;
       string? age;
       float? gpa;
       Teachers teachers;
   |}
   type Teachers record {|
       int id;
       string name;
   |}
   ```
   In the above scenario also, `sql:Column` annotation can be used to rename field name such as,
   ```ballerina
   public type Students record {|
       int id;
       string name;
       string? age;
       float? gpa;
       @sql:Column { name: "teachers" }
       Teacher teacher;
   |}
   ```

The returned stream needs to be closed properly to release resources. The stream is automatically closed if either it
is iterated fully or consists of an error. If result is accessed one by one using `next()` method, it should be closed 
after the required results are accessed.
```ballerina
# Releases the associated resources such as the database connection, results, etc.
#
# + return - An `sql:Error` if any error occurred while cleanup
public isolated function close() returns Error?;
```

Usage:
```ballerina
check resultStream.close();
```

## 4.2. Query row

`queryRow()` remote method executes the SQL query return at most one row of the result.
```ballerina
# Executes the query, which is expected to return at most one row of the result.
# If the query does not return any results, `sql:NoRowsError` is returned.
#
# + sqlQuery - The SQL query
# + returnType - The `typedesc` of the record to which the result needs to be returned.
#                It can be a basic type if the query result contains only one column
# + return - Result in the `returnType` type or an `sql:Error`
remote isolated function queryRow(ParameterizedQuery sqlQuery, typedesc<anydata> returnType = <>)
                                            returns returnType|Error;
```

The provided return type(inferred from LHS) can be of 2 types,
1. Ballerina record
   Returns only the first row retrieved by the query as a record.
   
   ```ballerina
   int id = 10;
   sql:ParameterizedQuery query = `SELECT * FROM students WHERE id = ${id}`;
   Student retrievedStudent = check dbClient->queryRow(query);
   ```
2. Ballerina primitive type
   Return the value of the first column of the first row retrieved by the query.
   
   ```ballerina
   int age = 12;
   sql:ParameterizedQuery query = `SELECT COUNT(*) FROM students WHERE age < ${age}`;
   int youngStudents = check dbClient->queryRow(query);
   ```

`sql:NoRowsError` is returned if the query does not return at most of one result.

## 4.3. Execute

`execute()` remote method executes the SQL query return metadata of the execution.
```ballerina
# Executes the SQL query. Only the metadata of the execution is returned (not the results from the query).
#
# + sqlQuery - The SQL query
# + return - Metadata of the query execution as an `sql:ExecutionResult` or an `sql:Error`
remote isolated function execute(ParameterizedQuery sqlQuery) returns ExecutionResult|Error;
```

The metadata is returned as `sql:ExecutionResult` record,
```ballerina
# Metadata of the query execution.
#
# + affectedRowCount - Number of rows affected by the execution of the query. It may be one of the following,  
#                      (1) A number greater than or equal to zero, the count of affected rows after the successful 
#                          execution of the query  
#                      (2) A value of the `SUCCESS_NO_INFO`, the count of affected rows is unknown after the successful 
#                          execution of the query  
#                      (3) A value of the `EXECUTION_FAILED`, the query execution failed
# + lastInsertId - The ID generated by the database in response to a query execution. This can be `()` in case 
#                  the database does not support this feature
public type ExecutionResult record {
    int? affectedRowCount;
    string|int? lastInsertId;
};
```

This sample demonstrates modifying data by executing an `UPDATE` statement via the `execute` remote function of
the client.

```ballerina
int age = 23;
sql:ParameterizedQuery query = `UPDATE students SET name = 'John' WHERE age = ${age}`;
sql:ExecutionResult result = check dbClient->execute(query);
```


## 4.4. Batch execute

`batchExecute()` remote method executes the SQL query with multiple sets of parameters in a batch.
```ballerina
# Executes the SQL query with multiple sets of parameters in a batch. Only the metadata of the execution is returned
# (not the results from the query).
# If one of the commands in the batch fails, an `sql:BatchExecuteError` will be returned. However, the driver may
# or may not continue to process the remaining commands in the batch after a failure.
#
# + sqlQueries - The SQL query with multiple sets of parameters
# + return - Metadata of the query execution as an `sql:ExecutionResult[]` or an `sql:Error`
remote isolated function batchExecute(ParameterizedQuery[] sqlQueries) returns ExecutionResult[]|Error;
```

This sample demonstrates how to insert multiple records with a single `INSERT` statement that is executed via the
`batchExecute` remote function of the client. This is done by creating a `table` with multiple records and
parameterized SQL query as same as the above `execute` operations.

```ballerina
var data = [
  { name: "John", age: 25  },
  { name: "Peter", age: 24 },
  { name: "jane", age: 22 }
];

sql:ParameterizedQuery[] batch = from var row in data
                                 select `INSERT INTO students ('name', 'age')
                                           VALUES (${row.name}, ${row.age})`;
sql:ExecutionResult[] result = check dbClient->batchExecute(batch);
```

## 4.5. Call

`call()` remote method executes a SQL query, which calls a stored procedure. This can either return results or nil.
```ballerina
# Executes an SQL query, which calls a stored procedure. This may or may not return results.
#
# + sqlQuery - The SQL query
# + rowTypes - `typedesc` array of the records to which the results need to be returned
# + return - Summary of the execution and results are returned in an `sql:ProcedureCallResult`, or an `sql:Error`
remote isolated function call(ParameterizedCallQuery sqlQuery, typedesc<record {}>[] rowTypes = [])
returns ProcedureCallResult|Error;
```

The returned results are returned as of type `sql:ProcedureCallResult`,
```ballerina
# Represents the results from the `call` method holding the returned results or metadata of the query execution.
#
# + executionResult - Summary of the query execution
# + queryResult - Results from the SQL query
# + customResultIterator - Any custom result iterator to be used to override the default behaviour
public class ProcedureCallResult {
    public ExecutionResult? executionResult = ();
    public stream<record {}, Error?>? queryResult = ();
    public CustomResultIterator? customResultIterator;

    public isolated function init(CustomResultIterator? customResultIterator = ());

    # Updates `executionResult` or `queryResult` field with the succeeding result in the result list. 
    # This will also close the current result when called.
    #
    # + return - True if the next result is `queryResult`
    public isolated function getNextQueryResult() returns boolean|Error;

    # Releases the associated resources such as the database connection, results, etc.
    #
    # + return - An `sql:Error` if any error occurred while cleanup
    public isolated function close();
}
```

Here `getNextQueryResult()` can be used to update the pointer to iterate through the returned result sets.

This sample demonstrates how to execute a stored procedure with a single `INSERT` statement that is executed via the
`call` remote function of the client.

```ballerina
int uid = 10;
sql:IntegerOutParameter insertId = new;

sql:ProcedureCallResult result = 
                         check dbClient->call(`call InsertPerson(${uid}, ${insertId})`);
stream<record{}, sql:Error?>? resultStr = result.queryResult;
if resultStr is stream<record{}, sql:Error?> {
    check from record{} value in resultStr
        do {
          // Can perform operations using the record 'result'.
        };
}
check result.close();
```
The close operation needs to be explicitly invoked on the `sql:ProcedureCallResult` to release the connection resources 
and avoid a connection leak as shown above.

# 5. Metadata operations

## 5.1. Schema client
The `SchemaClient` is used to query the database to retrieve the relevant metadata. On initialization,
the user would have to provide credentials to access the relevant metadata tables. It is also required to provide the name
of the database regarding which the metadata should be retrieved.

```ballerina
isolated client class MockSchemaClient {
    *SchemaClient;

    public function init(string host, int port, string user, string password, string database) returns Error? {
        self.database = database;
        self.dbClient = check new(url, user, password);
    }
}
```

This client will be extended by each SQL connector to customize the implementation as necessary.

## 5.2. Metadata types
New record-types would be introduced to represent the metadata which may be retrieved.
- `TableDefinition`
- `ColumnDefinition`
- `CheckConstraintDefinition`
- `ReferentialConstraintDefinition`
- `RoutineDefinition`
- `ParameterDefinition`

These record types contain only fields which are common to relational databases. However, they may be inherited and then
extended by each SQL connector to provide support for additional database-specific fields.

### Table definition
```ballerina
# Represents a table in the database.
#
# + name - The name of the table
# + 'type - Whether the table is a base table or a view
# + columns - The columns included in the table
public type TableDefinition record {
    string name;
    TableType 'type;
    ColumnDefinition[] columns?;
};
```

The `columns` field is optional as there are use cases where the user would not want to retrieve information regarding
the columns of a table.

The `TableType` type is an enum, which can take one of two values:
- `BASE_TABLE`
- `VIEW`

### Column definition
```ballerina
# Represents a column in a table.
#
# + name - The name of the column  
# + 'type - The SQL data-type associated with the column
# + defaultValue - The default value of the column  
# + nullable - Whether the column is nullable  
# + referentialConstraints - Referential constraints (foreign key relationships) associated with the column
# + checkConstraints - Check constraints associated with the column
public type ColumnDefinition record {
    string name;
    string 'type;
    anydata? defaultValue;
    boolean nullable;
    ReferentialConstraint[] referentialConstraints?;
    CheckConstraint[] checkConstraints?;
};
```

The `referentialConstraints` and `checkConstraints` fields are optional as there may be use cases where the user does not
want to retrieve this information.

### Referential constraint
```ballerina
# Represents a referential constraint (foriegn key constraint).
# 
# + name - The name of the constraint
# + tableName - The name of the table which contains the referenced column
# + columnName - The name of the referenced column
# + updateRule - The action taken when an update statement violates the constraint
# + deleteRule - The action taken when a delete statement violates the constraint
public type ReferentialConstraint record {
    string name;
    string tableName;
    string columnName;
    ReferentialRule updateRule;
    ReferentialRule deleteRule; 
};
```

The `ReferentialRule` type is an enum with four possible values:
- `NO_ACTION`
- `RESTRICT`
- `CASCADE`
- `SET_NULL`
- `SET_DEFAULT`

### Check constraint
```ballerina
# Represents a check constraint.
# 
# + name - The name of the constraint
# + clause - The actual text of the SQL definition statement
public type CheckConstraint record {
    string name;
    string clause;
};
```

### Routine definition
```ballerina
# Represents a routine.
# 
# + name - The name of the routine
# + 'type - The type of the routine (procedure or function)
# + returnType - If the routine returns a value, the return data-type. Else ()
# + parameters - The parameters associated with the routine
public type RoutineDefinition record {
    string name;
    RoutineType 'type;
    string? returnType;
    ParameterDefinition[] parameters;
};
```

The `RoutineType` type is an enum which can take one of two values
- `PROCEDURE`
- `FUNCTION`

### Parameter definition
```ballerina
# Represents a routine parameter.
# 
# + mode - The mode of the parameter (IN, OUT, INOUT)
# + name - The name of the parameter
# + type - The data-type of the parameter
public type ParameterDefinition record {
    ParameterMode mode;
    string name;
    string type;
};
```

The `ParameterMode` type is an enum which can take one of three values
- `IN`
- `OUT`
- `INOUT`

## 5.3. Metadata methods
The `SchemaClient` contains six methods which may be used to retrieve metadata.
- `listTables()`
- `getTableInfo()`
- `listRoutines()`
- `getRoutineInfo()`

All of these methods will be implemented by each SQL connector.

### Retrieve all tables
```ballerina
remote isolated function listTables() returns string[]|Error;
```
This would fetch the names of all the tables in the database.

### Retrieve a single table
```ballerina
remote isolated function getTableInfo(string tableName, ColumnRetrievalOptions include = COLUMNS_ONLY) returns TableDefinition|Error;

public enum ColumnRetrievalOptions {
    NO_COLUMNS,
    COLUMNS_ONLY,
    COLUMNS_WITH_CONSTRAINTS
}
```
This would fetch all relevant information from a given table from the database. Based on the option provided for the `include` parameter, relevant column information would also be retrieved.

### Retrieve all routines
```ballerina
remote isolated function listRoutines() returns string[]|Error;
```
This would fetch the names of all the routines created in the database.

### Retrieve a single routine
```ballerina
remote isolated function getRoutineInfo(string name) returns RoutineDefinition|Error;
```
This would fetch all relevant information regarding the provided routine (including the parameter data).

# 6. Errors

`sql` package consists of following Errors,
```bash
.
└── Error                            # Generic error type for the `sql` module. 
    ├── DatabaseError                # Error caused by an issue related to database accessibility, erroneous queries, etc
    ├── BatchExecuteError            # Error that occurs during the execution of batch queries.
    ├── NoRowsError                  # Error when a query retrieves does not retrieve any rows when at least one row is expected.
    └── ApplicationError             # Error originating from application-level configurations.
        └── DataError                # Error during the processing of the parameters or returned results.
            ├── TypeMismatchError    # Error when a query retrieves a result that differs from the supported result type.
            ├── ConversionError      # Error when result is corrupted and cannot be casted to expected result type.
            ├── FieldMismatchError   # Error when a query retrieves a result that cannot be mapped to the expected record type.
            └── UnsupportedTypeError # Error that occurs when an unsupported parameter type is added to the query.
```

All errors include detailed error message.

Include error details along with this `sql:DatabaseError` as follows.
```ballerina
# Represents the properties belonging to an `sql:DatabaseError`.
#
# + errorCode - SQL error code
# + sqlState - SQL state
public type DatabaseErrorDetail record {
    int errorCode;
    string? sqlState;
};
```

`sql:BatchExecuteError` includes detail of the metadata of the executed queries before the error occurred.
```ballerina
# Represents the properties belonging to an `sql:BatchExecuteError`.
#
# + errorCode - SQL error code
# + sqlState - SQL state
# + executionResults - Metadata of the query executions
public type BatchExecuteErrorDetail record {
    int errorCode;
    string? sqlState;
    ExecutionResult[] executionResults;
};
```
