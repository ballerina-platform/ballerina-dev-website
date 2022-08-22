---
layout: ballerina-left-nav-release-notes
title: Swan Lake Preview 3
permalink: /downloads/swan-lake-release-notes/swan-lake-preview3/
active: swan-lake-preview3
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-preview3
---
### Overview of Ballerina Swan Lake Preview 3

This release is the third preview version of Ballerina Swan Lake. This release includes a new set of language features along with improvements and bug fixes to the compiler, runtime, standard libraries, and developer tooling.

You can use the update tool to update to Ballerina Swan Lake Preview 3 as follows.

**For existing users:**

If you are already using jBallerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](http://ballerina.io/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 3.

 > `ballerina dist pull slp3`                  

However, if you are using a jBallerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

**For new users:**

If you have not installed jBallerina, then download the [installers](https://ballerina.io/downloads/) to install.

### Highlights

- Support for defining external object method bodies
- Order by clause for sorting
- Inner/Nested query expressions 
- Support for executing stored procedures in the SQL connector
- Azure Functions support

### What's new in Ballerina Swan Lake Preview 3

#### Language

The language implementation is based on [Ballerina Language Specifications Draft 2020-06-18](https://ballerina.io/spec/lang/draft/v2020-06-18/).

##### External object method bodies

This release introduces support for defining object methods with external function bodies.

```ballerina
type Person object {
    string fname;
    string lname;

    function init(string fname, string lname) {
        self.lname = lname;
        self.fname = fname;
    }

    function getFullName() returns string = @java:Method {
        class: "abc.Hello"
    } external;
};
```

The Java method to which the `getFullName()` method is bound:

```java
public static BString getFullName(ObjectValue objectValue) {
        return objectValue.getStringValue(new BmpStringValue("fname")).concat(new BmpStringValue(" ")).concat(
                    objectValue.getStringValue(new BmpStringValue("lname")));
}
```

##### `Order by` clause for sorting 

This release introduces the `order by` clause support for sorting in query expression/action. An order-by clause is executed by constructing a list of entries.

```ballerina
Student s1 = {id: 1, fname: "John", fee: 2000.56, age: 20};
Student s2 = {id: 2, fname: "John", fee: 2000.56, age: 22};
Student s3 = {id: 3, fname: "Roger", fee: 4000.56, age: 21};
Student s4 = {id: 4, fname: "Kate", fee: 2000.56, age: 24};

Student[] studentList = [s1, s2, s3, s4];

Student[] sortedList =  from var student in studentList
                        order by student.age ascending, student.fname
                        select student;
```

##### Inner/Nested query expressions

This release introduces the support to write inner/nested query expression/action.

```ballerina
Person[] personList = [
    {id: 1, fname: "Alex", lname: "George"},
    {id: 2, fname: "Ranjan", lname: "Fonseka"},
    {id: 3, fname: "Idris", lname: "Elba"},
    {id: 4, fname: "Dermot", lname: "Crowley"}
];

Department[] deptList = [
    {id: 1, name:"HR"},
    {id: 2, name:"Operations"},
    {id: 3, name:"Engineering"}
];

Employee[] empList = [
    {personId: 1, deptId: 2},
    {personId: 2, deptId: 1},
    {personId: 3, deptId: 3},
    {personId: 4, deptId: 3}
];


DeptPerson[] deptPersonList =
        from var emp in (from var e in empList select e)
        join Person psn in (from var p in personList select p)
            on emp.personId equals psn.id
        join Department dept in (from var d in deptList select d)
            on emp.deptId equals dept.id
        select {
            fname : psn.fname,
            lname : psn.lname,
            dept : dept.name
        };
```

#### Standard library

##### SQL connectors

Stored procedures can now be executed through SQL connectors (JDBC & MySQL). 

```ballerina
int uid = 10;
sql:OutParameter insertId = new;

var ret = dbClient->call(`call InsertPerson(${uid}, ${insertId})`);
if (ret is error) {
    io:println("Error occurred:", err.message());
} else {
    io:println("Out Parameter insert id: ", insertId.get(int));
    stream<record{}, sql:Error>? resultStr = ret.queryResult;
    if (!(resultStr is ())) {
        sql:Error? e = resultStr.forEach(function(record{} result) {
        io:println("Full Customer details: ", result);
      });
    } else {
        io:println("Stored  procedure does not return anything.");
    }
}

```
##### Module organization

The `ballerina/nats` library was moved to Ballerina Central. Previously, this module was packed in the Ballerina distribution. With this change, this library can now be released independently.

#### Developer tools

##### Language server

###### Introducing AI-based `Data Mapping` code action

Two record types can now be mapped automatically using the `Data Mapping` code action. Once a possible record mapping instance is identified, it suggests a mapping based on an AI algorithm. A mapping function will be generated automatically and added to the workspace to perform the record mapping.

The following is a sample in which the code action to generate a mapping function will appear when attempting to assign a mapping value to a variable of a type that is not directly assignable. 

```ballerina
type Grade record {|
   int maths;
   int physics;
   int chemistry;
|};
 
type NameAndGrade record {|
   string name;
   string surname;
   int maths;
   int physics;
   int chemistry;
|};
 
public function main() {
   NameAndGrade student = {
	name: "Kamal",
	surname: “Perera”,
	maths: 90,
physics: 99,
chemistry: 95
   };
   Grade grades = student;
}
```
By choosing the `Generate mapping function`code action, the following function will be added to the workspace.

```ballerina
function mapNameAndGradeToGrade(NameAndGrade nameAndGrade) returns Grade {
// Some record fields might be missing in the AI-based mapping.
   Grade grade = {
maths: nameAndGrade.maths, 
physics: nameAndGrade.physics, 
chemistry: nameAndGrade.chemistry};
   return grade;
}
```

Furthermore, the line with the error would be replaced with a function call as shown below.

```ballerina
Grade grades = mapNameAndGradeToGrade(student);
```

For more information, see [Code Actions](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina).

##### Test framework

###### Support single test execution

A single test function or a set of functions can now be executed using the `--tests` flag as follows.

```cmd
$ ballerina test --tests <test_function> --all
```

###### API change in `assertEquals` and `assertNotEquals` functions

Deep value equality is supported only for `anydata`-typed values according to the language specification. The `assertEquals` function has been changed to accept only  `anydata`-typed values to reflect this behavior.

###### Introduction of the `assertExactEquals` and `assertNotExactEquals` functions

The `assertExactEquals` function compares two values to assert whether they refer to the same entity (i.e., they are exactly equal). 

```ballerina
import ballerina/test;

type Person object {
    public string name = "";
    public int age = 0;
    public Person? parent = ();
    private string email = "default@abc.com";
    string address = "No 20, Palm grove";
};

@test:Config {}
function testAssertObjectEquals() {
   Person p1 = new;
   Person p2 = p1;
   test:assertExactEquals(p1, p2);
}

@test:Config {}
function testAssertObjectNotEquals() {
    Person p1 = new;
    Person p2 = new ();
    test:assertNotExactEquals(p1, p2);
}

```

###### Introduction of the `@test:BeforeGroups` and `@test:AfterGroups` functions

These two new annotations can now be used when writing tests with the Ballerina test framework.


```ballerina
import ballerina/io;
import ballerina/test;

@test:BeforeGroups { value : ["group1"] }
function beforeGroupsFunc() {
	io:println(“I’m a before groups function!”)
}

@test:Config {}
function testFunction() {
	io:println(“I’m a test function!”)

}

@test:AfterGroups { value : ["group1"] }
function afterGroupsFunc() {
	io:println(“I’m a after groups function!”)

}
```

###### Introduction of the `alwaysRun` field to the `@test:AfterSuite` annotation

You can now specify `alwaysRun : true|false` in the `@AfterSuite` annotation, which enables running the `@AfterSuite` even if the `@BeforeSuite` function fails during the test execution. The default value is `false`.

```ballerina
import ballerina/io;
import ballerina/test;


@test:BeforeSuite
function beforeSuiteFunc() {
	io:println("I’m the before suite function");
	int a = 2/0;
}

@test:AfterSuite {}
function afterSuiteFunc1() {
	io:println("I will be run only if before suite function executes successfully.");
}

@test:AfterSuite { alwaysRun:true }
function afterSuiteFunc2() {
	io:println("I will be run even if the before suite function fails.");
}
```

#### Code to Cloud

##### Azure Functions support

Ballerina now supports writing serverless functions using the Azure Functions framework. 

```ballerina
import ballerina/http;
import ballerinax/azure.functions as af;

@af:Function
public function fromHttpToQueue(af:Context ctx,
        	@af:HTTPTrigger {} af:HTTPRequest req,
        	@af:QueueOutput { queueName: "queue1" } af:StringOutputBinding msg)
        	returns @af:HTTPOutput af:HTTPBinding {
	msg.value = req.body;
	return { statusCode: 200, payload: "Request: " + req.toString() };
}
```

For more information, see [Azure Functions](https://ballerina.io/swan-lake/learn/deployment/azure-functions/).
