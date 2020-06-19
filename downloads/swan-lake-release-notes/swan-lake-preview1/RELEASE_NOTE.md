---
layout: release-note
title: Swan Lake Preview 1 Release note
---
# Overview of Ballerina Swan Lake - Preview 1
This release is the first preview version of Ballerina Swan Lake. This release includes a new set of Language features and significant improvements to the compiler, runtime, standard libraries, and developer tooling.
 
# Highlights
- Highlight I
- Highlight II

# What's new in Ballerina Swan Lake - Preview 1
## Language
The Language implementation is based on [Ballerina Language Specifications Draft 2020-06-18](https://ballerina.io/spec/lang/draft/v2020-06-18/). This Specification introduces a set of new features and improvements in the following main areas.   
 
- Type system enhancements (e.g. New Error and Table Design) 
- Improved Immutability support 
- [New Transaction support] (https://github.com/ballerina-platform/ballerina-spec/blob/master/lang/proposals/transaction/transaction.md) 
- Improved Query support 
 
Some of these new language features are revamped of the existing language features and Therefore source code will not be backward compatible with the stable Ballerina 1.2 releases. 
 
In addition to the new Language features, this release introduces a new parser implementation aiming to improve the performance and usability of the compiler. Now compiler has more control over syntax errors, and it can provide a better diagnostic for syntax errors. Additionally, New parser has tightened up the language parser rules with respect to the Ballerina specification, and still, it doesn’t cover the full set of the language features. This will be fixed in upcoming preview versions.  

### Introduction of `distinct` types
Ballerina `distinct` types provide functionality similar to that provided by nominal types, but which works within Ballerina's structural type system. With`distinct` types it's possible to define unique types that are structurally similar. 
##### `distinct` `error` type
`error` types can be defined as `distinct` types so that Ballerina programmers can have more fine-grained control over error handling.
```ballerina
// Define distinct error type ApplicationError to be a subtype `error`
type ApplicationError distinct error;
// FileUploadError is a subtype of ApplicationError
type FileUploadError distinct ApplicationError;
// UserPermissionError is a subtype of ApplicationError
type UserPermissionError distinct ApplicationError;
 
 
function uploadFile(string filePath, string securityToken, UserId userId) returns ApplicationError? {
 if (!PermTokenValidator:validToken(securityToken)) {
   return UserPermissionError(userId.userName + " does not have permission to upload file");
 }
 
 error|int fileId = NetworkUtil:uploadFile(filePath, getContentServerUri(securityToken, userId));
 if (fileId is error) {
   return FileUploadError("File upload failed", fileId);
 }
 notifyFileUploadEvent(userId, <int> fileId);
}
```

Type-guards can be used to identify values of each distinct error at runtime.
```ballerina
 ApplicationError? status = uploadFile(path, token, userId);
 if (status is FileUploadError) {
     // handle FileUploadError
 } else if (status is UserPermissionError) {
     // handle UserPermissionError
 }
```

With the introduction of `distinct` error type, error reason is removed from the error type. Please see the `error type changes` section for more information.

### `error` type changes
Previous error type was `error<reasonType, detailType>`, where `reasonType` is a subtype of string and `detailType` is a subtype of `record {| string message?; error cause; (anydata|error)... |}`. With the error type change, the reason type parameter is removed and the detail type parameter is a subtype of `map<anydata|readonly>`.

```ballerina
type Error error<map<anydata|readonly>>;
```

The error detail type parameter is optional and if absent it defaults to `map<anydata|readonly>` and if present, it must be a subtype of `map<anydata|readonly>`.

```ballerina
type Error0 error;
type Error1 error<map<string>>;
type Error2 error<record {| int code; |}>;
```
#### Revised error constructor
Error-values of user-defined types is created using error constructor of that type.
Mandatory first positional augment to error constructor is the error message and must be a subtype of string. An optional second positional argument can be provided to pass in an `error` cause. Error details are provided as named arguments to error constructor.

```ballerina
type AppError error<record {| string buildNo; string userId; |};

AppError appError = AppError("Failed to delete order line", buildNo=getBuildNo(), userId=userId);
```
#### Error type infer 
A type of error<*> means that the type is a subtype of error, where the precise subtype is to be inferred from the context.

```Ballerina
type TrxErrorData record {|
   string message = "";
   error cause?;
   string data = "";
|};

type TrxError error<TrxErrorData>;

TrxError e = TrxError("IAmAInferedErr");
error<*> err = e;
```

### Introduction of the `readonly` type and improved support for immutability
This release introduces improved support for immutability. With the introduction of the `readonly` type, values that are known to be immutable can now be defined at compile-time. 
#### The `readonly` type
A value belongs to the `readonly` type if its read-only flag is set.
A value belonging to one of the following inherently immutable basic types will always have it’s read-only bit set, and will always belong to the `readonly` type.
- all simple basic types - nil, boolean, int, float, decimal
- string
- error
- function
- service 
- typedesc

A value belonging to one of the following selectively immutable types will belong to `readonly` (i.e., will be immutable) only if its read-only bit is set.
- xml
- list
- mapping 
- table
- object
An immutable value is deeply immutable and thus an immutable structure is guaranteed to have only immutable values at any level. 
As with previous versions of Ballerina, an immutable value can be created by calling `.cloneReadOnly()` on the value. Additionally, it is now possible to create an immutable value by providing a read-only type as the contextually expected type.
An intersection type `T & readonly` where `T` is a selectively immutable type results in a read-only type, which when used with a constructor expression creates an immutable value.
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
Attempting to create an immutable value with incompatible mutable values as members will result in compilation errors.
Read-only intersections for objects are only allowed with abstract objects. In order to represent a non-abstract object type as a read-only type, the object would have to be defined as a `readonly object`. See “Read-only objects”
#### Read-only fields
A record or an object can now have `readonly` fields. A `readonly` field cannot be updated once the record or the object value is created, and the value provided for the particular field should be an immutable value. If the field is of type `T`, the contextually expected type for a value provided for a field would be `T & readonly`.
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
#### Read-only objects
An object type can also be defined as a `readonly object` type, and any value belonging to this type will be immutable. Similar to `readonly` fields, each value provided for a field of a `readonly object` is expected to be immutable and the field itself cannot be updated once set.
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
### Never type
The `never` type represents the type of values that never occur. This can be useful to describe the return type of a function, if the function never returns. No value can ever belong to `never` type. Thus it can not be declared or assigned a value to it.
```ballerina
function somefunction(int age) returns never {
   if (age < 18) {
       error e = error("Invalid Age");
       panic e;
   }
}
```
Never types can be used to specify key-less tables. Here, the key constraint is type `never`
```ballerina
table<Person> key<never> personTable = table [
       { name: "John", age: 23 },
       { name: "Paul", age:25 }
   ];
```

### Object and Module Init Change
Module level variables can be initialized inside the module init function. Now this is same as initializing the fields inside an object.
### Type inclusion
Object type inclusion can now include non-abstract objects. Type reference expressions can also override fields and function declarations of the same name. Including type overrides fields of included type provided that overriding field type is a subtype of overridden field.

```Ballerina
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

```Ballerina
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
### Enum
The typical way of doing an enumeration in Ballerina previously was:

```ballerina
 public const NORTH = "NORTH";
 public const EAST = "EAST";
 public const SOUTH = "SOUTH";
 public const WEST = "WEST";
 public type Direction NORTH|EAST|SOUTH|WEST;

```
With the introduction of enums the above can be simplified to the following:

```ballerina
public enum Direction {
      NORTH,
      EAST,
      SOUTH,
      WEST
    }
```
The value of the const can be overridden in the enum declaration:


```ballerina
public enum Direction {
      NORTH = "N",
      EAST = "E",
      SOUTH = "S",
      WEST = "W"
    }
```
The expression following `=` must be a constant expression with a static type that is a subtype of string.
### Raw templates

### Typedesc function parameters referencing in return type

### Backward incompatible improvements and bug fixes
- Parameter defaults are not added if a rest argument is provided when calling a function.

### Transactions
A Ballerina transaction is a series of data manipulation statements that must either fully complete or fully fail, thereby, leaving the system in a consistent state. A transaction is performed using a transaction statement. The semantics of the transaction statement guarantees that every Begin() operation will be paired with a corresponding Rollback() or Commit() operation. It is also possible to perform retry operations over the transactions as well. Other than that, the transaction module provides some util functions to set commit/rollback handlers, retrieve transaction information and etc. This release provides support only for local transactions.

```Ballerina
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

        if(commitResult is ()){
            io:println("Transaction committed");
            handleExecute(customerResult, "Insert data into CUSTOMER table");
            handleExecute(salaryResult, "Insert data into SALARY table");
        } else {
            io:println("Transaction failed");
        }
    }

    //Drop the tables.
    ret = dbClient->execute("DROP TABLE CUSTOMER");
    handleExecute(ret, "Drop table CUSTOMER");
    ret = dbClient->execute("DROP TABLE SALARY");
    handleExecute(ret, "Drop table SALARY");

    check dbClient.close();
}

```



### Table
A `table` is a structural value whose members are mapping values that represent rows of the table. A table provides access to its members using a key that comes from the read-only fields of the member. It keeps its members in order but does not provide random access to a member using its position in this order. The built-in functions enable inserting, accessing, deleting data, and applying functions on members of a table.
```Ballerina
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
	  { id: 1, name: "John", salary: 300.50 },
	  { id: 2, name: "Bella", salary: 500.50 },
	  { id: 3, name: "Peter", salary: 750.0 }
	];

	Employee emp = { id: 5, name: "Gimantha", salary: 100.50 };
	employeeTab.add(emp);
	Employee peekEmp = employeeTab.get(1);
}
```

### Query Improvements 

Ballerina query action/expression provides a language-integrated query feature using SQL-like syntax. Ballerina query is a comprehension, which can be used with a value that is iterable with any error type. A query consists of a sequence of clauses (i.e `from`, `join`, `let`, `on`, `where`, `select`, `do` and `limit`). The first clause must be a `from` clause and must consist of either a `select` or a `do` clause as well. When a query is evaluated, its clauses are executed in a pipeline by making the sequence of frames emitted by one clause be the input to the next clause. Each clause in the pipeline is executed lazily, pulling input from its preceding clause. The result of such a query can either be a list, stream, table, string, XML, or termination value of the iterator which is ().


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
## Standard Library
### Introduced new JDBC module

### Enhanced log api module

### Enhanced gRPC module

Revamped client/bidirectional streaming service implementation to support multiple service resources

The previous gRPC client/bidirectional streaming had a shortcoming where a service can only contain a single streaming resource. In order to overcome this, the implementation of the client/bidi streaming has been changed to accept stream type like below,

E.g: 

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




### Enhanced auth module

### Enhanced email module

Email Connector clients are given the capability to add custom SMTP properties, custom POP properties and custom IMAP properties via the configuration of each of the clients.
SMTP client is made capable of sending custom email headers (SMTP header) via the SMTP client and retrieving all the email headers to the user via POP and IMAP clients.
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


### Added new connectors


## Build Tools-
### Native dependency manager
Maven dependency resolving support
Now you can specify maven dependencies by specifying Group ID, Artifact ID and version as below. 
```
[[platform.libraries]]
modules = [ "module1", "module2"]
artifactId = "json"
groupId = "json.org"
version = "0.7.2"
```
Maven resolver will fetch those dependencies from maven central

### Scoping support
Added an additional attribute called “scope” for platform libraries. Based on scope, dependencies will be included to different phases.
 - default - Will be available to compile, run tests, execute, and also distributed with the balo.
 - provided - Will be available to compile, run tests, execute but not distributed with the balo.
 - testOnly - Will be only available to run tests.


Ex : 
```
[platform]
target = "java8"

[[platform.libraries]]
modules = ["sap-client"]
path = "path/to/sap_client_1.2.3.jar"
scope = "provided" 
```
### Bindgen tool

- Providing support for Java Subtyping.
- Integrating Maven dependency resolving into the tool and introducing a new command option `-mvn|--maven` to facilitate it.
- Improve the error mappings by generating error types for Java exceptions.
- Introducing a function in the `java` module of the Ballerina standard library to support Java Casting.
- Introduce the generation API documentation comments in the generated bindings.
- Introduced a flag `--public` to change the visibility modifier (which is module private by default) to public.
- Moving the array util functions into the `java.arrays` module in the Ballerina standard library instead of generating it each time the tool is executed.
- Bug fixes and improvements to usability and generated bindings.
- The bindgen tool command after the newly introduced options is as follows.
```
ballerina bindgen [(-cp|--classpath) <classpath>...]
                  [(-mvn|--maven) <groupId>:<artifactId>:<version>]
                  [(-o|--output) <output>]
                  [--public]
                  (<class-name>...)
```


### Testerina
Introducing the Mocking API for object and function mocking

### API Documentation
Added search capability to API Documentation
Feature to combine documentation from multiple projects

### Debugger
Variable evaluation support : This will allow you to evaluate a variable using expression evaluation option to retrieve the value of the variable at a debug hit. 
	
