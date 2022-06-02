---
layout: ballerina-left-nav-release-notes
title: 2201.0.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201-0-0/
active: 2201-0-0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201-0-0
    - /downloads/swan-lake-release-notes/2201.0.0/
    - /downloads/swan-lake-release-notes/2201-0-0-swan-lake/
    - /downloads/swan-lake-release-notes/2201-0-0-swan-lake
---

### Overview of Ballerina 2201.0.0 (Swan Lake)

<em>2201.0.0 (Swan Lake) is the first major release of 2022, and it includes a new set of features and significant improvements to the compiler, runtime, standard library, and developer tooling. It is based on the 2022R1 version of the Language Specification.</em> 

### Updating Ballerina

>**Info:** The version format has been revised. `2201.0.0 (Swan Lake)` represents the format of `$YYMM.$UPDATE.$PATCH ($CODE_NAME)`. For further information, see [Ballerina Swan Lake is on the Horizon](https://blog.ballerina.io/posts/ballerina-swan-lake-is-on-the-horizon/).

If you are already using Ballerina, use the [Ballerina update tool](/learn/cli-documentation/update-tool/#using-the-update-tool) to directly update to 2201.0.0 (Swan Lake). To do this: 

1. Run the command below to get the latest version of the update tool.

   `bal update`

2. Run the command below to update your Ballerina version to 2201.0.0 (Swan Lake).

   `bal dist update`

#### Troubleshooting 

If you already ran the `bal dist update` (or `bal dist pull 2201.0.0`) before the `bal update` command, follow the instructions below to recover your installation.

##### For macOS Users (`.pkg` installations)

1. Run the `rm ~/.ballerina/ballerina-version` command to delete the version configuration.
2. Run the `chmod 755 /Library/Ballerina/distributions/ballerina-2201.0.0/bin/bal` command to provide execute permissions for the `bal` command.
3. Run the `bal dist use 2201.0.0` command to switch to the 2201.0.0 version. 

##### For Ubuntu Users (`.deb` installations)

1. Run the `rm ~/.ballerina/ballerina-version` command to delete the version configuration.
2. Run the `chmod 755 /usr/lib/ballerina/distributions/ballerina-2201.0.0/bin/bal` command to provide execute permissions for the `bal` command.
3. Run the `bal dist use 2201.0.0` command to switch to the 2201.0.0 version.

##### For CentOS Users (`.rpm` installations)

1. Run the `rm ~/.ballerina/ballerina-version` command to delete the version configuration.
2. Run the `chmod 755 /usr/lib64/ballerina/distributions/ballerina-2201.0.0/bin/bal` command to provide execute permissions for the `bal` command.
3. Run the `bal dist use 2201.0.0` command to switch to the 2201.0.0 version.

##### For Windows Users (`.msi` installations)

1. Run the `del %userprofile%\.ballerina\ballerina-version` command to delete the version configuration.
2. Run the `bal dist use 2201.0.0` command to switch to the 2201.0.0 version.

### Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Migrating from Swan Lake Beta Releases
>**Info:** If you have been using Swan Lake Beta releases, delete the `Dependencies.toml` files in your Ballerina packages when migrating to Balelrina 2201.0.0 (Swan Lake). 

A few backward-incompatible changes have been introduced during the Swan Lake Beta program, and thereby, some of your existing packages may not compile with Ballerina 2201.0.0 (Swan Lake). Therefore, you need to delete the `Dependencies.toml` file to force the dependency resolver to use the latest versions of your dependencies. 

### Language Updates

#### New Features

##### Support to Refer to Parameters and Local Variables in Object Constructor Expressions

Object constructor expressions can now refer to parameters and local variables. This feature is also available when using an object constructor expression with the `service` qualifier to create a service object. These references can be in field initializers and object methods, including the `init` method.

```ballerina
type Person object {
    string name;
    string code;

    function getRegistrationId(string prefix) returns string;
};

function createPerson(string name, int id, string department) returns Person|error {
    string codeId = check getCode(id);

    Person person = object {
        string name;
        string code = codeId; // Refers to the `codeId` local variable.

        function init() {
            self.name = name; // Refers to the `name` parameter.
        }

        function getRegistrationId(string prefix) returns string {
            string regId = department + ":" + self.code; // Refers to the `department` parameter.

            if (prefix.length() > 0) {
                return prefix + "-" + regId;
            }

            return regId;
        }
    };

    return person;
}

function getCode(int id) returns string|error {
    if id < 0 {
        return error("Invalid ID");
    }
    return id.toString();
}
```

#### Bug Fixes

- Fixed a bug that caused constants to be resolved with incorrect types in certain scenarios. The type of constants is now the intersection of readonly and the singleton type containing just the shape of the value named by the constant.

  ```ballerina
  // Previously, the type of X was `int` and now it is singleton `2`.
  const int X = 1 + 1;
   
  public function main() {
     // Now results in an error.
     X y = 3;
  }
  ```

  ```ballerina
  // Previously, the type of X was `map<int>` and now it is the intersection of readonly
  // and the singleton type containing just the mapping value `{a: 1}`.
  const map<int> X = {a: 1};
   
  public function main() {
     // Now, this results in an error.
     X y = {a: 2};
  }
  ```

- Fixed a spec deviation in type narrowing. This may result in types that were previously narrowed no longer being narrowed.

   Consider the following records.

   ```ballerina
   type Employee record {
      int id;
      string name;
      string department;
   };
      
   type Student record {
      string id;
      string name;         
      int grade;
   };
   ```

   Previously, when a type test was used as follows, the type of `v` in the else block was narrowed to `Student`.

   ```ballerina
   function fn(Employee|Student v) {
      if v is Employee {
            // `v` is narrowed to `Employee` here.
            string dept = v.department;
      } else {
            // `v` was previously narrowed to `Student` here.
            // Will now result in a compilation error.
            int grade = v.grade;
      }
   }
   ```

   Even though jBallerina currently allows only values that belong to either `Employee` or `Student` to be passed as arguments for the parameter of type `Employee|Student`, the Ballerina specification defines subtyping to be semantic. This, along with mutability, would mean that a value that does not belong to `Employee` nor `Student` but belongs to `Employee|Student` can be passed as an argument here, which results in the possibility of the value not belonging to `Student` in the else block.

   For example, one would be able to call `fn` with the following.

   ```ballerina
   public function main() {
      record {|
            int|string id;
            string name;
            anydata grade;
            anydata department;
      |} rec = {
            id: "A1234",
            name: "Amy",
            department: ["physics", 1],
            grade: 12
      };
      fn(rec);
   }
   ```

   Although it is not possible to call this function in this manner at the moment since jBallerina does not support semantic subtyping, the changes to narrowing have been introduced in this release to minimize future incompatibility issues.

- Fixed a spec deviation that allowed non-required fields of records/maps and error detail records/maps to be bound using mapping and error binding patterns in variable declarations and destructuring assignment statements. Attempting to bind a non-required field will now result in a compilation error.

  ```ballerina
  type Employee record {
     string name;
     int age?;
  };
   
  function bindEmployee(Employee emp) {
     string empName;
     int empAge;
   
     // The 'age' field is optional in the `Employee` record type-descriptor.
     // Therefore, attempting to bind it will now result in compilation errors.  
     {name: empName, age: empAge} = emp; // error for `age: empAge`
     var {name: empNameOne, age: empAgeOne} = emp; // error for `age: empAgeOne`
   
     // Similarly, since there is no required `department` field in the `Employee`
     // record, the following will also result in an error.
     var {name, department} = emp; // error for `department`
  }
   
  type Error error<record {| int code?; string identifier; boolean...; |}>;
   
  function bindError(Error err) {
     // The 'code' field is optional in the detail record of `Error`.
     // Therefore, attempting to bind it will now result in a compilation error.
     Error error(message1, code = code1, identifier = identifier1) = err; // error for 'code = code1'
   
     // Similarly, attempting to bind an undefined (non-required) `fatal` field will
     // also result in a compilation error.
     var error(message, fatal = fatal) = err; // error for 'fatal = fatal'
  }
  ```

- Fixed a bug in the compiler that resulted in some illegal variable shadowing scenarios not being detected. Ballerina allows shadowing only variables that belong to the module scope.

  ```ballerina
  function fn(int y, int z) returns int {
     function (int, int, int) returns int f = (x, y, z) => x + y + z; // error: redeclared symbols 'y' and 'z'
   
     int x = 34; // This is not in an overlapping scope, so, it does not result in an error.
     return f(12, 32, 33);
  }
   
  function createService(int age) returns
         service object { public function getAgeInFiveYears(int age) returns int; } {
     return service object {
             public function getAgeInFiveYears(int age) returns int { // error: redeclared symbol 'age'
                 return 5 + age;
             }
         };
  }
  ```

- Fixed a bug that caused classes with all `final` fields of immutable types to be considered a `readonly class` (i.e., a subtype of `readonly`).

   Such a class can no longer be used in a context that expects a subtype of `readonly`.

   ```ballerina
   class Person {
      final string name;
      final string[] & readonly address;
      
      function init(string name, string[] address) {
            self.name = name;
            self.address = address.cloneReadOnly();
      }
      
      function getAddress() returns string => string:'join(", ", ...self.address);
   }
      
   public function main() {
      Person person = new ("May", ["Palm Grove", "Colombo 3"]);
      
      // This, which was allowed previously results in an error now.
      readonly readOnlyValue = person;
   }
   ```

- Fixed a bug that resulted in invalid table lookups due to not distinguishing between `int`, `float`, and `decimal` zero.

  ```ballerina
  import ballerina/io;
   
  type Employee record {|
     readonly int|float|decimal age;
     int code;
  |};
   
  public function main() {
     table<Employee> key(age) empTable = table [
         {age: 0, code: 100} // int `0` is the key
     ];
   
     Employee? v1 = empTable[0f]; // Lookup with float `0` as the key.
     io:println(v1 is Employee); // Previously `true`, now `false`.
   
     Employee? v2 = empTable[0d]; // Lookup with decimal `0` as the key.
     io:println(v2 is Employee); // Previously `true`, now `false`.
   
     Employee? v3 = empTable[0]; // Lookup with int `0` as the key.
     io:println(v3 is Employee); // Only this will continue to be `true`.
  }
  ```

To view bug fixes, see the [GitHub milestone for 2201.0.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FCompilerFE+milestone%3A%22Ballerina+2201.0.0%22).

### Runtime Updates

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for 2201.0.0 (Swan Lake)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+label%3ATeam%2FjBallerina+milestone%3A%22Ballerina+2201.0.0%22).

### Standard Library Updates

#### New Features

##### `graphql` Package
- Added the CORS configuration support

##### `http` Package

- Implemented typed `headers` for the HTTP response
- Added the `map<string>` data binding support for `application/www-x-form-urlencoded`
- Added support to provide an inline request/response body with `x-form-urlencoded` content
- Added compiler plugin validation for usage of the `@http:Payload` annotation

#### Improvements

##### `graphql` Package
- Removed the deprecated `add` method in the `graphql:Context` object

##### `grpc` Package
- Changed the `--proto_path` option of the gRPC command to `--proto-path`

##### `websub` Package
- Added support for `readonly` parameters in remote methods

#### `websubhub` Package
- Added support for `readonly` parameters in remote methods

##### `kafka` Package
- Made the `kafka:Caller` optional in the `onConsumerRecord` method of the `kafka:Service`
- Allowed the `readonly & kafka:ConsumerRecord[]` parameter type in the `onConsumerRecord` method

### Code to Cloud Updates

#### Improvements
- Removed `awslambda` and `azure_functions` module support for single `.bal` files

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for 2201.0.0 (Swan Lake)](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+2201.0.0%22+label%3AType%2FBug).


### Developer Tools Updates

#### New Features

##### Ballerina Shell

- Added the module auto-import feature to the Ballerina Shell. If the user code contains a module prefix for a module that has not been imported, the Ballerina Shell provides the option to import the module.


   For example, see below.
   ```ballerina
    =$ io:println("Hello World")
    |
    | Found following undefined module(s).
    | io
    |
    | Following undefined modules can be imported.
    | 1. io
    Do you want to import mentioned modules (yes/y) (no/n)? y
    |
    | Adding import: import ballerina/io
    | Import added: import ballerina/io
    
    Hello World
    ```

#### Improvements

##### Ballerina OpenAPI Tool

###### OpenAPI Contract Generation
- Added support for HTTP headers of types `int`, `int[]`, `boolean`, and `boolean[]`
- Added support for HTTP payloads of type `map<string>`
- Improved the OAS response header mapping for contexts in which the header details are defined within the return type

###### Ballerina Service Generation
- Added support for OAS query parameters with nested/optional/nullable types and default values
- Added support for OAS header parameters with optional/nullable types and default values

##### Ballerina update tool
- Improved the view for `bal dist list` with the `-a` flag
- Improved the `bal dist use` command to check for the distribution availability prior to the download suggestion

#### Bug Fixes

To view bug fixes, see the GitHub milestone for 2201.0.0 (Swan Lake) of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.0.0%22+is%3Aclosed+label%3ATeam%2FLanguageServer)
- [update tool](https://github.com/ballerina-platform/ballerina-update-tool/issues?q=is%3Aissue+milestone%3A%22Ballerina+2201.0.0%22+is%3Aclosed+label%3AType%2FBug)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Ballerina+2201.0.0%22+is%3Aclosed)

<!-- <style>.cGitButtonContainer, .cBallerinaTocContainer {display:none;}</style> -->
