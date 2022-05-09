---
layout: ballerina-left-nav-release-notes
title: Swan Lake Preview 2
permalink: /downloads/swan-lake-release-notes/swan-lake-preview2/
active: swan-lake-preview2
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-preview2
---
### Overview of Ballerina Swan Lake Preview 2
This release is the second preview version of Ballerina Swan Lake. This release includes a new set of language features along with improvements and bug fixes to the compiler, runtime, standard libraries, and developer tooling.

You can use the update tool to update to Ballerina Swan Lake Preview 2 as follows.

**For existing users:**

If you are already using jBallerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 2.

 > `ballerina dist pull slp2`                  

However, if you are using a jBallerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

**For new users:**

If you have not installed jBallerina, then download the [installers](https://ballerina.io/downloads/) to install.
 
### Highlights
- Support for resilient parsing
- Improved support for immutability
- Improved support to convert compatible values to and from JSON 
- Improved log API to support changing module log levels at runtime
- Improved mocking API in the test framework
- Improved Docker images using thin JAR

### What's new in Ballerina Swan Lake Preview 2

#### Language
The language implementation is based on the [Ballerina Language Specifications Draft 2020-06-18](https://ballerina.io/spec/lang/draft/v2020-06-18/).   
 
##### Resilient parsing support
Resilient parsing support has been added to the compiler. It is now capable of performing semantic validation for source code even when there are syntax errors.

##### Improvements related to immutability

###### `readonly` fields in the mapping constructor expression

A specific field (key-value pair or variable name) in a mapping constructor expression can now be marked as `readonly`. Such a field expects an immutable value and the field cannot be updated once the mapping value is constructed.

```ballerina
type Employee record {|
   Details details;
   string department;
   float salary;
|};
 
type Details record {|
   string name;
   int id;
|};
 
public function main() {
   string department = "legal";
 
   Employee employee = {
       readonly details: {
           name: "Amy",
           id: 112244
       },
       readonly department,
       salary: 100.0
   };
}
```

Attempting to update a field that was specified as a `readonly` field will result in an error.

```ballerina
employee.department = "finance"; // panics
```

If a constructor expression is used as a value with a `readonly` field, the constructed value will be an immutable value. The following evaluates to true.

```ballerina
employee.details.isReadOnly()
```

###### `readonly` as the contextually expected type for mapping and list constructor expressions

The `readonly` type can now be used as the contextually-expected type for mapping and list constructor expressions. This results in the creation of a record or an array value, which is immutable.

```ballerina
import ballerina/io;

type Details record {|
   string name;
   string author;
|};
 
public function main() {
   Details & readonly greatExpectations = {
       name: "Great Expectations",
       author: "Charles Dickens"
   };
 
   readonly item = {
       details: greatExpectations,
       categories: ["Charles Dickens", "novel"]
   };
 
   // Prints true.   
   io:println(item is readonly & record {|
                                     Details details;
                                     [string, string] categories;     
                                 |});  
}
``` 

###### `<readonly>` casts to construct immutable values

A value can now be constructed with its read-only bit set (i.e., as an immutable value) by using a cast to `<readonly>` with the constructor expression. By definition, all the values used within the constructor expression should be immutable.

```ballerina
type Details record {|
   string name;
   string author;
|};
 
public function main() {
   Details details = <readonly> {
       name: "Great Expectations",
       author: "Charles Dickens"
   };
}
```

Since `details` is created as an immutable value, the following check evaluates to `true`.

```ballerina
details.isReadOnly()
```
##### Passing arguments for required/defaultable parameters via the rest argument

Previously, the rest argument in a function/method call expression could only provide arguments for the rest parameter. A rest argument can now be used to provide arguments for required and/or defaultable parameters too.

```ballerina
public function main() {
   // Arguments for `name`, `department`, and `id` parameters.
   [string, string, int] details = ["Amy", "legal", 212124];
   Employee e1 = createEmployee(...details);
 
   // Arguments for `department`, `id`, and `access` parameters.
   [string, int, string, string] detailsAndAccess = ["HR", 112233, "L2", "L3"];
   Employee e2 = createEmployee("Jo", ...detailsAndAccess);
}
 
function createEmployee(string name, string department, int id = 1000,
                       string... access) returns Employee => {
   name, id, department, access
};
 
type Employee record {|
   string name;
   string department;
   int id;
   string[] access;
|};
```

##### Improvements related to JSON compatibility

Three new methods have been introduced to the `ballerina/lang.value` module to facilitate converting to and from JSON. Additionally, the `toJsonString` method can now be called on `anydata` values.

###### The `toJson` method
`toJson` converts a value of type `anydata` to `json`. This does a deep copy of the value and converts values that do not belong to `json` into values that do. 

```ballerina
public function main() {
   string[] arrString = ["hello", "world"];
   json|error arrStringJson = arrString.toJson();
}
```

###### The `toJsonString` method

`toJsonString` converts a value of type `anydata` to a string that represents the value in the JSON format. It first converts the value to a JSON using `toJson` and then converts it to a `string`.

```ballerina
public function main() {
   map<string> address = {
       line1: "Line1",
       line2: "Line2"
   };
   string adrString = address.toJsonString();
}
```

###### The `fromJsonWithType` method

`fromJsonWithType` converts a value of type `json` to a user-specified type. The implementation is similar to `cloneWithType` except that it also does the inverse of the conversions done by `toJson`.

```ballerina
type Student record {
   int id;
   string name;
};
 
public function main() {
   json studentJson = {"id": 3, "name": "Pubudu"};
   Student|error student = studentJson.fromJsonWithType(Student);
}
```

###### The `fromJsonStringWithType` method

`fromJsonStringWithType` converts a string in JSON format to a user-specified type. This method can be described as a combination of `fromJsonString` followed by `fromJsonWithType`.

```ballerina
type StringMap map<string>;
 
public function main() {
   string str = "{\"first_name\":\"Fname\", \"last_name\":\"Lname\"}";
   map<string>|error m = str.fromJsonStringWithType(StringMap);
}
```

#### Standard library

##### HTTP

The redirect client has been improved to support temporary and permanent redirects with the original request’s HTTP method. A new `allowAuthHeaders` field was introduced in the redirect configuration to get user consent before repeating sensitive data on subsequent requests.

##### Log

The new `log:setModuleLogLevel` function allows users to set the module log level through the Log API.

##### Config

The `config:getAsArray` and `config:getAsMap` functions now return immutable values. This way, the user can simply cast the returned value to the desired list type or mapping type without having to use `cloneWithType()`.

##### Security

- JWT signature validation with JWK has been improved by introducing a cache. This cache preloads the JWKs, and thereby, reduces the runtime latency added due to the HTTP call to the JWK endpoint when validating the signature.
- An `auth:InvocationContext` record, which can be used as a data holder has been introduced. It can hold auth-related information such as authentication scheme, auth token, and authenticated user's ID, claims, and scopes preserved for a single request-response flow.

##### WebSocket

The WebSocket client now supports cookies. A new field `cookies` has been introduced in the `http:WebSocketClientConfiguration` and `http:WebSocketFailoverClientConfiguration` records to specify the cookies.

##### Runtime API

- The `runtime:timeout` function has been removed. The `runtime:sleep` function can be used as the alternative.

E.g., consider the following example, which uses the `runtime:timeout` function.

```ballerina
future<()> f1 = runtime:timeout(50);
```

This can now be done as follows:

```ballerina
future<()> f1 = start runtime:sleep(50);
```

- The `runtime:getProperty` function has been removed. Java interoperability can be used as the alternative to access Java system properties.
- The auth-related configurations have been moved out from the `runtime:InvocationContext` to the newly-introduced `auth:InvocationContext`.

##### Module organization

The following standard libraries were moved to Ballerina Central. Previously, these modules were packed in the Ballerina distribution. With this change, these libraries can now be released independently.
- ballerina/encoding
- ballerina/jwt
- ballerina/websub
- ballerinax/rabbitmq

#### Developer tools

##### Test framework

###### Improved mocking API

**Object mocking**

The syntax for initializing a mock object was improved to remove the cast.

Previous syntax: 

```ballerina
http:Client mockHttpClient = <http:Client>test:mock(http:Client);
```

New syntax: 

```ballerina
http:Client mockHttpClient = test:mock(http:Client);
```

**Function mocking**

The mocking API now supports scoping and stubbing of mock functions that are declared for functions in imported modules.
With the above support, the `@MockFn {}` and `@Mock {}` annotations have been unified and now all function mocks can be declared with the `@Mock {}` annotation.

With the improved mocking API, a function can be mocked as follows:

```ballerina
import ballerina/math;
import ballerina/test;

@test:Mock {
    moduleName : "ballerina/math",
    functionName : "absInt"
}
test:MockFunction mock_absInt = new();

@test:Config {}
public function testFunction() {
    test:when(mock_absInt).thenReturn(100);
    test:assertEquals(math:absInt(-5), 100);
}
```

##### Deployment

By default, Docker images are now created using the thin JAR. Using the thin JAR improves the push and pull times significantly. Since layers are reused, disk space required to store thin JAR based images is less. 

This can be changed to use the uber JAR by setting the `uberJar` field in the Docker or Kubernetes annotation to `true`. 

Kubernetes annotations:
```ballerina
@kubernetes:Deployment {
   uberJar: true
}
```

Docker annotations:
```ballerina
@docker:Config {
   uberJar: true
}
```
