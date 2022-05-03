---
layout: ballerina-left-nav-release-notes
title: Swan Lake Preview 1
permalink: /downloads/swan-lake-release-notes/swan-lake-preview1/
active: swan-lake-preview1
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-preview1
---
### Overview of Ballerina Swan Lake - Preview 1
Ballerina Swan Lake will be a major new version of Ballerina that we plan to release in January 2021. We will be doing major releases every 6 months from then on. We also plan to use popular ballet names as the codename for each release - so the 2021-07 release will be the Nutcracker release. We will announce details on maintenance of released versions and will also have an LTS release model similar to Ubuntu or Java.

This release is the first preview version of Ballerina Swan Lake. This release includes a new set of language features and significant improvements to the compiler, runtime, standard libraries, and developer tooling.

You can use the update tool to update to Ballerina Swan Lake Preview 1 as follows.

**For existing users:**

If you are already using jBallerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 1.

 > `ballerina dist pull slp1`                  

However, if you are using a jBallerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

**For new users:**

If you have not installed jBallerina, then download the [installers](https://ballerina.io/downloads/) to install.

### Highlights

- Immutability in the type system: Ballerina compiler guarantees that when you state a value as immutable,  it stays unchanged 
- `distinct` types bring native support for nominal typing into the structural type system in Ballerina 
- Improved the error type design eliminates pain-points in the previous version. The `distinct error` type allows programmers  to define more refined error types that support common error handling use cases
- Improved transaction support in the language: A set of language features that are designed to make it easier and more convenient to write robust applications in Ballerina
- Enhanced Query expressions that bring the power of SQL-like query capabilities directly into the language as comprehensions for data processing
- Introducing the `table` type: A new built-in collection type that works like a general-purpose hash table, where the keys are part of the values being stored
- Improved Ballerina SQL module API that leverages the latest languages features such as `stream` type, query expressions, and raw templates
- The new mocking API in Ballerina test framework helps you to mock an entire object or a function allowing you to test your code independent of external dependencies

### What's new in Ballerina Swan Lake - Preview 1

#### Language

The Language implementation is based on [Ballerina Language Specifications Draft 2020-06-18](https://ballerina.io/spec/lang/draft/v2020-06-18/). This Specification introduces a set of new features and improvements in the following main areas.   

- Type system enhancements
- Improved immutability support 
- New transactions support 
- Improved query support 

Some of these new language features are revamped versions of the existing language features. Therefore, the source code will not be backward compatible with the stable Ballerina 1.2 releases. 

In addition to the new Language features, this release introduces a new parser implementation aiming to improve the performance and usability of the compiler. Now, the compiler has more control over syntax errors and it can provide better diagnostics for syntax errors. Additionally, the new parser has tightened up the language parser rules with respect to the Ballerina language specification. However, it still does not cover the full set of the language features. This will be fixed in the upcoming preview versions.  

##### Type system enhancements
###### Enum

An Enum provides a convenient syntax for declaring a union of string constants.

```ballerina
public enum Color {
  RED,
  GREEN,
  BLUE
}
```
is exactly equivalent to:

```ballerina
public const RED = "RED";
public const GREEN = "GREEN";
public const BLUE = "BLUE";
public type Color RED|GREEN|BLUE;
```

###### New `readonly` type

A value belongs to the `readonly` type if its read-only flag is set. A value belonging to one of the following inherently-immutable basic types will always have it’s read-only bit set and will always belong to the `readonly` type.

- all simple basic types - nil, boolean, int, float, decimal
- string
- error
- function
- service 
- typedesc

A value belonging to one of the following selectively-immutable types will belong to `readonly` (i.e., will be immutable) only if its read-only bit is set.

- xml
- list
- mapping 
- table
- object

An immutable value is deeply immutable and thus an immutable structure is guaranteed to have only immutable values at any level. As with previous versions of Ballerina, an immutable value can be created by calling `.cloneReadOnly()` on the value. Additionally, it is now possible to create an immutable value by providing a read-only type as the contextually expected type.

```ballerina
readonly immutableValue = “hello world“;
```
###### Intersection type 

Intersection types have been introduced with this release. A value belongs to an intersection type `T1 & T2` if the value belongs to both `T1` and `T2`. The implementation currently supports intersection types only if one of the constituent types of the intersection is `readonly`.

Intersection types are especially useful when defining immutable values of selectively immutable types. Providing a `readonly` intersection type as the contextually expected type for a constructor expression results in the value being created as an immutable value. By definition, such a value belongs to the `readonly` type too.

```ballerina
map<int> & readonly immutableMap = {
    a: 1,
    b: 2,
    c: 3
};

readonly immutableValue = immutableMap;
```

Here, `immutableMap` belongs to both `map<int>` and `readonly`.

###### Introduction of `distinct` types

Distinct types provide functionalities similar to that provided by nominal types but they work within Ballerina's structural type system. Distinct types are similar to the branded types found in some other structurally typed languages, such as Modula-3. 

With`distinct` types, it is possible to define unique types that are structurally similar. Distinct types can be used only with the object or error basic types. This release adds `distinct error` support and `distinct object` support will be added later. 
###### Revamped `error` type

The error type has been revised to take advantage of distinct types. The previous error value had a reason string for categorizing errors and a detail record for additional data about the error such as message and cause. 

*Old Syntax*
```ballerina
type Error error<reasonType, detailType>;
```
Here the `reasonType` is a subtype of `string` and `detailType` is a subtype of `record {| string message?; error cause; (anydata|error)... |}`.

Now error value has a message string, an optional cause, and mapping value for additional details about the error value and distinct error types are used for categorizing. .

*New Syntax*
```ballerina
type Error error<typeParameter>;
```

Here the error `typeParameter` has to be a subtype of `map<anydata|readonly>`. The error type parameter is optional and if absent, it defaults to `map<anydata|readonly>`. If present, it must be a subtype of `map<anydata|readonly>`.

```ballerina
type Error0 error;
type Error1 error<map<string>>;
type Error2 error<record {| int code; |}>;
```
**Revised error constructor**

Error values of user-defined types are created using the error constructor of that type. The first mandatory positional augment of the error constructor is the error message and it must be a subtype of `string`. The second optional positional argument can be provided to pass an `error` cause. Error details are provided as named arguments in the error constructor.

```ballerina
type AppError error<record {| string buildNo; string userId; |};

AppError appError = AppError("Failed to delete the order line", buildNo=getBuildNo(), userId=userId);
```
**Inferring the type of the error**

A type of `error<*>` means that the type is a subtype of `error`, where the precise subtype is to be inferred from the context.

```ballerina
type TrxErrorData record {|
   string message = "";
   error cause?;
   string data = "";
|};

type TrxError error<TrxErrorData>;

TrxError e = TrxError("IAmAnInferredErr");
error<*> err = e;
```
###### The `distinct error` type

The `error` types can be defined as `distinct` types so that Ballerina programmers can have more fine-grained control over error handling. 

```ballerina
// Define a distinct error type `ApplicationError` to be a subtype of `error`.
type ApplicationError distinct error;

// `FileUploadError` is a subtype of `ApplicationError`.
type FileUploadError distinct ApplicationError;

// `UserPermissionError` is a subtype of `ApplicationError`.
type UserPermissionError distinct ApplicationError;
 
// Creating Error values
FileUploadError fileErr = FileUploadError("File upload failed");

ApplicationError err = fileErr;
UserPermissionError userErr = fileErr;  // Compile Time Error.
```

The type test expression can be used to identify values of each distinct error type at runtime.

###### The `never` type

The `never` type describes the type that does not contain any shapes. No value ever belongs to `never`.

This can be useful to describe the return type of a function, if the function never returns. It can also be useful as a type parameter. For example, `xml<never>` describes an `xml` type that has no constituents, i.e. the empty xml value.

```ballerina
function aNeverReturningFunction() returns never {
    panic error("Invalid function call");
}
```
###### Revamped `table` type

The table type has been redesigned to be more consistent with other structural types and no longer has preview status.

A `table` is a structural value whose members are mapping values that represent rows of the table. A table provides access to its members using a key, which comes from the read-only fields of the member. It keeps its members in order but does not provide random access to a member using its position in this order. The built-in functions enable inserting, accessing, deleting data, and applying functions on members of a table.

```ballerina
type Employee record {
    readonly int id;
    string name;
    float salary;
};

table<Employee> tbEmployee = table {
    {key id, name, salary},
    [
        {1, "Mary", 300.5},
        {2, "John", 200.5},
        {3, "Jim", 330.5}
    ]
};

type EmployeeTable table<Employee> key(id);

public function main() {
    EmployeeTable employeeTab = table [
        {id: 1, name: "John", salary: 300.50},
        {id: 2, name: "Bella", salary: 500.50},
        {id: 3, name: "Peter", salary: 750.0}
    ];
    
    Employee emp = {id: 5, name: "Gimantha", salary: 100.50};
    employeeTab.add(emp);
    Employee peekEmp = employeeTab.get(1);
}
```
###### Type inclusion

The type (including type) that includes another object (included type) can override fields and functions of the included type. The types of the fields and functions in the including type should be subtypes of the types of the corresponding fields and functions in the included type. Object type inclusion can now include non-abstract objects. 

```ballerina
type GridMessage object {
    int|string address = "";
    string body = "";

    public function init(string body, int|string address) {
        self.body = body;
        self.address = address;
    }

    function getAddress() returns int|string {
        return self.address;
    }
};

type EfficientGridMessage object {
    *GridMessage;

    int address = 0;

    public function init(string body, int address) {
        self.body = body;
        self.address = address;
    }

    function getAddress() returns int {
        return self.address;
    }
};
```

```ballerina
type GridPacket record {
    int|string address;
    string body = "";
    (int|byte|string)[] header?;
};

type EfficientGridPacket record {
    *GridPacket;

    int address = 0;
    byte[] header?;
};
```
###### Raw templates
Similar to string template literals, a raw template literal allows interpolating expressions into a string literal. However, for a raw template, the resulting value is an object whose type is a subtype of `lang.object:RawTemplate`.

```ballerina
import ballerina/io;
import ballerina/lang.'object;

public function main() {
    string name = "Ballerina";
    'object:RawTemplate greeting = `Hello ${name}!!!`;

    io:println(greeting.strings);
    io:println(greeting.insertions[0]);
}
```
###### Dependently-typed function signatures
A function's return type descriptor can now refer to a name of a parameter of the function if the type of the parameter is a subtype of `typedesc`. The actual return type of such a function then depends on the value the user specifies for the referenced `typedesc` parameter when calling the function.

Note that currently this is only supported for external functions.

```ballerina
import ballerina/java;

function query(typedesc<anydata> rowType) returns map<rowType> = @java:Method {
    class: "org.ballerinalang.test.DependentlyTypedFunctions",
    name: "query",
    paramTypes: ["org.ballerinalang.jvm.values.api.BTypedesc"]
} external;

public function main() {
    map<int> m1 = query(int);
    map<string> m2 = query(string);
}
```

##### Improved support for immutability

This release introduces improved support for immutability. With the introduction of the `readonly` type, values that are known to be immutable can now be defined at compile-time. 

An intersection type `T & readonly` where `T` is a selectively-immutable type results in a read-only type. When such a type is used as the contextually expected type for a constructor expression, the value created will be an immutable value.

```ballerina
import ballerina/io;
 
type Details record {|
   int id;
   string country;
|};
 
type Employee record {|
   Details details;
   string department;
|};
 
public function main() {
   Employee & readonly emp = {
       details: {
           id: 112233,
           country: "Sri Lanka"
       },
       department: "IT"
   };
 
   io:println(emp.isReadOnly());           // true
   io:println(emp.details.isReadOnly());   // true
}
```

Attempting to create an immutable value with incompatible mutable values as members will result in compilation errors.Read-only intersections for objects are only allowed with abstract objects. In order to represent a non-abstract object type as a read-only type, the object would have to be defined as a `readonly object`. For more information, see [Read-only objects](#read-only-objects).

###### Read-only fields
A record or an object can now have `readonly` fields. A `readonly` field cannot be updated once the record or the object value is created and the value provided for the particular field should be an immutable value. If the field is of type `T`, the contextually-expected type for a value provided for a field would be `T & readonly`.

Thus, a `readonly` field guarantees that the field will not change and also that the value set for the field itself will not be updated.

```ballerina
type Details record {|
   int id;
   string country;
|};
 
type Employee record {|
   readonly Details details;
   string department;
|};
 
public function main() {
   Details & readonly immutableDetails = {
       id: 112233,
       country: "Sri Lanka"
   };
 
   Employee emp = {
       details: immutableDetails,
       department: "IT"
   };
 
   emp.details = { // error - cannot update 'readonly' record field 'details' in 'Employee'
       id: 2222,
       country: "UK"
   };
}
```

If all the fields of a closed record or an object are `readonly`, the record or the object itself is considered immutable and a value of the particular type can be used where an immutable value is expected.

```ballerina
type Identifier record {|
   readonly int id;
   readonly string code;
|};
 
type Controller object {
   readonly int id;
  
   function init(int id) {
       self.id = id;
   }
 
   function getId() returns int {
       return self.id;
   }
};
 
public function main() {
   Identifier details = {
       id: 112233,
       code: "SLC"
   };
  
   Controller controller = new (1234);
 
   readonly[] arr = [details, controller];
}
```

###### Read-only objects
An object type can also be defined as a `readonly object` type and any value belonging to this type will be immutable. Similar to `readonly` fields, each value provided for a field of a `readonly object` is expected to be immutable and the field itself cannot be updated once set.

```ballerina
type Details record {
   int id;
   string country;
};
 
type Controller readonly object {
   Details details;
   boolean allow = true;
  
   function init(Details & readonly details) {
       self.details = details;
   }
 
   function getDetails() returns Details {
       return self.details;
   }
};
 
public function main() {
   Controller controller = new ({id: 1234, country: "SL"});
 
   controller.allow = false; // error - cannot update 'readonly' value of type 'Controller'
}
```
##### Transactions
Transaction support has been revisited based on a [new  proposal](https://github.com/ballerina-platform/ballerina-spec/blob/master/lang/proposals/transaction/transaction.md)

A Ballerina transaction is a series of data manipulation statements that must either fully complete or fully fail, thereby, leaving the system in a consistent state. A transaction is performed using a transaction statement. The semantics of the transaction statement guarantees that every `Begin()` operation will be paired with a corresponding `Rollback()` or `Commit()` operation. It is also possible to perform retry operations over the transactions as well. Other than that, the transaction module provides some util functions to set commit/rollback handlers, retrieve transaction information, etc. This release only supports local transactions.

```ballerina
public function main() returns error? {
    // JDBC Client for H2 database.
    jdbc:Client dbClient = check new (url = "jdbc:h2:file:./local-transactions/testdb",
                                        user = "test", password = "test");

    // Create the tables that are required for the transaction.
    var ret = dbClient->execute("CREATE TABLE IF NOT EXISTS CUSTOMER " +
                                "(ID INTEGER, NAME VARCHAR(30))");
    handleExecute(ret, "Create CUSTOMER table");

    ret = dbClient->execute("CREATE TABLE IF NOT EXISTS SALARY " +
                                "(ID INTEGER, MON_SALARY FLOAT)");
    handleExecute(ret, "Create SALARY table");

    transaction {
        var customerResult = dbClient->execute("INSERT INTO CUSTOMER(ID,NAME) " +
                                        "VALUES (1, 'Anne')");
        var salaryResult = dbClient->execute("INSERT INTO SALARY (ID, MON_SALARY) " +
                                        "VALUES (1, 2500)");

        transactions:Info transInfo = transactions:info();
        io:println(transInfo);

        var commitResult = commit;

        if (commitResult is ()) {
            io:println("Transaction committed");
            handleExecute(customerResult, "Insert data into CUSTOMER table");
            handleExecute(salaryResult, "Insert data into SALARY table");
        } else {
            io:println("Transaction failed");
        }
    }

    // Drop the tables.
    ret = dbClient->execute("DROP TABLE CUSTOMER");
    handleExecute(ret, "Drop table CUSTOMER");
    ret = dbClient->execute("DROP TABLE SALARY");
    handleExecute(ret, "Drop table SALARY");

    check dbClient.close();
}
```
##### Query improvements 

Ballerina query action/expression provides a language-integrated query feature using SQL-like syntax. A Ballerina query is a comprehension, which can be used with a value that is iterable with any error type. A query consists of a sequence of clauses (i.e., `from`, `join`, `let`, `on`, `where`, `select`, `do`, and `limit`). The first clause must be a `from` clause and must consist of either a `select` or a `do` clause as well. When a query is evaluated, its clauses are executed in a pipeline by making the sequence of frames emitted by one clause being the input to the next clause. Each clause in the pipeline is executed lazily pulling input from its preceding clause. The result of such a query can either be a list, stream, table, string, XML, or termination value of the iterator which is ().


```ballerina
import ballerina/io;

type Student record {
    string fName;
    string lName;
    int intakeYear;
    float score;
};

type Report record {
    string name;
    string degree;
    int expectedGradYear;
};

public function main() {

    Student s1 = {fName: "Alex", lName: "George", intakeYear: 2020, score: 1.5};
    Student s2 = {fName: "Ranjan", lName: "Fonseka", intakeYear: 2020, score: 0.9};
    Student s3 = {fName: "John", lName: "David", intakeYear: 2022, score: 1.2};
    Student s4 = {fName: "Gorge", lName: "Fernando", intakeYear: 2021, score: 1.1};
    Student[] studentList = [s1, s2, s3, s4];

    Report[] reportList = from var student in studentList
       where student.score >= 1
       let string degreeName = "Bachelor of Medicine",
       int graduationYear = student.intakeYear + 5
       select {
              name: student.fName,
              degree: degreeName,
              expectedGradYear: graduationYear
       }
       limit 2;

    foreach var report in reportList {
        io:println(report);
    }
}
```
##### Other backward-incompatible/significant improvements

- Parameter defaults are not added if a rest argument is provided when calling a function.
- The `__init` method of `object` and the `__init` function of modules have been renamed to `init`.
- Module variables can now be initialized in the module's `init` function.
- Hex literals have been disallowed as decimal values
- Record values compatible with `json` can now be assigned to `json` variables.
- Record values compatible with a `map` type can now be assigned to variables of that `map` type.
- Type descriptors cannot be used in expression contexts. Only type references are now allowed to be used in expression contexts. 
- List binding patterns can now be used with arrays.
- Error binding patterns and structured match patterns are not yet supported with the new parser.


#### Standard library

##### Introduced new `sql` module

The newly-introduced `sql` module provides a common interface and functionality to interact with a database. The corresponding database clients can be created by using specific database modules such as MySQL or using the Java Database Connectivity module JDBC. 

The revamped SQL implementation has the support for `sql:ParameterizedQuery` through which parameterized queries can be passed easily.

A sample connector for a MySQL database is as follows.
```ballerina
import ballerina/mysql;
import ballerina/sql;

public function main() returns sql:Error? {

    mysql:Client mysqlClient = check new ("localhost", "root", "root", "testdb");

    int id = 10;
    string name = "Alice";
    sql:ParameterizedQuery sqlQuery = `INSERT INTO Persons (id, name) values (${id}, ${name})`;

    sql:ExecutionResult result = check mysqlClient->execute(sqlQuery);
    
    check mysqlClient.close();   
}
```

##### Enhanced `logapi` module

Revamped log API to support `anydata` and improved performance.

```ballerina
import ballerina/log;

public function main() {
    log:printDebug("Debug log");
    log:printDebug(12345);
    log:printDebug(3.146);
    log:printDebug(true);

    Fruit apple = new ("Apple", 20);
    log:printDebug(function() returns int {
        return apple.getCount();
    });
}

public type Fruit object {
    string name;
    int count;
    public function init(string name, int count) {
        self.name = name;
        self.count = count;
    }
    function getCount() returns int {
        return self.count;
    }
};
```

##### Enhanced `grpc` module

The client/bidirectional streaming service implementation is revamped to support multiple service resources.

The previous gRPC client/bidirectional streaming had a shortcoming where a service can only contain a single streaming resource. In order to overcome this, the implementation of the client/bidi streaming has been changed to accept a stream type like below.

E.g.,

```ballerina

service HelloWorld on new grpc:Listener(9090) {
   resource function lotsOfGreetings(grpc:Caller caller, stream<string,error> clientStream) {

       //Read and process each message in the client stream
       error? e = clientStream.forEach(function(string name) {
       });
       //Once the client sends a notification to indicate the end of the stream, 'grpc:EOS' is returned by the stream
       if (e is grpc:EOS) {
           grpc:Error? err = caller->send("Ack");

       //If the client sends an error to the server, the stream closes and returns the error
       } else if (e is error) {

       }
   }
}

```

##### Enhanced `auth` module

The capability to validate the JWT signature with JWKs is extended now. With that, the JWT signature can be validated either from the TrustStore configuration or JWKs configuration.

```ballerina
jwt:JwtValidatorConfig validatorConfig = {
    issuer: "ballerina",
    audience: "vEwzbcasJVQm1jVYHUHCjhxZ4tYa",
    clockSkewInSeconds: 60,
    jwksConfig: {
        url: "https://example.com/oauth2/jwks",
        clientConfig: {
            secureSocket: {
                trustStore: trustStore
            }
        }
    }
};
```

##### Enhanced `email` module

The Email Connector clients are given the capability to add custom SMTP properties, custom POP properties, and custom IMAP properties via the configuration of each of the clients.

The SMTP client is made capable of sending custom email headers (SMTP header) via the SMTP client and retrieving all the email headers to the user via POP and IMAP clients.

A `listener` is introduced to asynchronously listen to email servers with polling and receive if any email is received. This listener supports both POP3 and IMAP4 protocols. A sample code is given below.

```ballerina

import ballerina/email;
import ballerina/io;

email:PopConfig popConfig = {
     port: 995,
     enableSsl: true
};

listener email:Listener emailListener = new ({
    host: "pop.email.com",
    username: "reader@email.com",
    password: "pass456",
    protocol: "POP",
    protocolConfig: popConfig,
    pollingInterval: 2000
});

service emailObserver on emailListener {

    resource function onMessage(email:Email emailMessage) {
    }

    resource function onError(email:Error emailError) {
    }

}
```


##### Adding the `socket` module to Ballerina Central

Previously, the Socket module was available only in the Ballerina distribution. From this release onwards, it is available in both the
 released Ballerina distribution and Ballerina Central. This will allow us to release the module independently.

#### Developer tools

##### Maven dependency management

Now, you can specify your native jar dependencies with maven artifact id in the Ballerina.toml. When you build the program build tool will fetch those dependencies from the Maven Central automatically. If you specify the maven artifact id and the jar path both the jar path will get precedence.

E.g.,

```ballerina
[[platform.libraries]]
modules = [ "module1", "module2"]
artifactId = "json"
groupId = "json.org"
version = "0.7.2"
```

##### Scoping support for native dependencies

Now you can specify the scope for platform libraries. Based on the scope, dependencies will be included to different phases. The values of this will be as follows

- default - will be available to compile, run tests, execute, and also distributed with the BALO.
- provided - will be available to compile, run tests, execute but not distributed with the BALO.
- testOnly - will be only available to run tests.

E.g., 

```ballerina
[platform]
target = "java8"

[[platform.libraries]]
modules = ["sap-client"]
path = "path/to/sap_client_1.2.3.jar"
scope = "provided" 
```

##### The Bindgen tool

- Java Subtyping support is added to the generated bindings.
- Maven dependency resolving is integrated into the tool and a new `-mvn|--maven` command option is introduced to facilitate this.
- Error mappings are improved by generating Ballerina error types for Java exceptions.
- Introduces a function in the `java` module of the Ballerina standard library to support Java Casting.
- Introduces the generation of API documentation comments in the generated bindings.
- Introduces a `--public` flag to change the visibility modifier (which is module private by default) to public.
- Moves the array util functions into the `java.arrays` module in the Ballerina standard library instead of generating it each time when the tool is executed.
- Bug fixes and improvements to usability and generated bindings.

The bindgen tool command after the newly-introduced options is as follows.

```ballerina
ballerina bindgen [(-cp|--classpath) <classpath>...]
                  [(-mvn|--maven) <groupId>:<artifactId>:<version>]
                  [(-o|--output) <output>]
                  [--public]
                  (<class-name>...)
```


##### API documentation

- The search capability is added into the API Documentation
- You can now combine documentation from multiple projects using the doc tool

##### Debugger

This provides variable evaluation support. This will allow you to evaluate a variable using the expression evaluation option to retrieve the value of the variable at a debug hit. 


#### Test framework

###### Introduction of the mocking API in the `test` module

The new mocking API simplifies function and object mocking in unit tests via the ***when-then*** convention. 

The mocking features can be used to control the behavior of functions and objects by defining return values or
 replacing the entire object or function with a user-defined equivalent. This feature will help you to test your Ballerina code independently 
from other modules and external endpoints. For the complete list of available mocking features, see 
[API Documentation of the test module](https://docs.central.ballerina.io/ballerina/test/latest/).

###### Function mocking

The `MockFunction` object is added to handle function mocking. The `MockFunction` objects are defined by attaching the `@test:MockFn` annotation to the `MockFunction` to specify the function to mock.

```ballerina
@test:MockFn {
    functionName : "<function_to_mock>"
}
test:MockFunction mockObj = new();
```

Function mocking is done by using the following functions:
- The `test:when(mockObj)` is used to initialize the mocking capability within a particular test case
- This allows you to use the associated mocking functions like `call()`, `thenReturn()` and `withArguments()`

###### Object mocking

Object mocking enables controlling the values of member variables and the behavior of the member functions of an object

- Introduced the ability to create a `test double`, which provides an equivalent mock in place of the real object
- Introduced the capability of stubbing the member function or member variable

Object mocking is done by using the following functions:
- The `test:mock()` and `test:prepare()` are used to initialize the mocking capability
- The `test:prepare()` function allows you to use the associated mocking functions like `thenReturn()`, `thenReturnSequence()`, `doNothing() `, and `withArguments()`

	
