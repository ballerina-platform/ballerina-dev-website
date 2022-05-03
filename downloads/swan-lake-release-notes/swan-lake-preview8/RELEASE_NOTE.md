---
layout: ballerina-left-nav-release-notes
title: Swan Lake Preview 8
permalink: /downloads/swan-lake-release-notes/swan-lake-preview8/
active: swan-lake-preview8
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-preview8
---

### Overview of Ballerina Swan Lake Preview 8 

This release is the eighth preview version of Ballerina Swan Lake. It includes a new set of language features along with improvements and bug fixes to the compiler, runtime, standard library, and developer tooling.

- [Updating Ballerina](#updating-ballerina)
    - [For Existing Users](#for-existing-users)
    - [For New Users](#for-new-users)
- [Highlights](#highlights)
- [What is new in Ballerina Swan Lake Preview 8](#what-is-new-in-ballerina-swan-lake-preview-8)
    - [Language](#language)
        - [Support Identifier Escapes Without an Initial Quote](#support-identifier-escapes-without-an-initial-quote)
        - [Included Record Parameters](#included-record-parameters)
        - [Service Typing Changes](#service-typing-changes)
        - [Listener Object](#listener-object)
        - [Transactional Services](#transactional-services)
    - [Standard Library](#standard-library)
        - [HTTP Module Changes](#http-module-changes)
        - [Log Module Changes](#log-module-changes)
        - [Email Module Changes](#email-module-changes)
        - [WebSub Module Changes](#websub-module-changes)
        - [Introduced New Modules](#introduced-new-modules)

#### Updating Ballerina

You can use the update tool to update to Ballerina Swan Lake Preview 8 as follows.

##### For existing users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](http://ballerina.io/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 8.

 > `ballerina dist pull slp8`                 

However, if you are using a Ballerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

##### For new users

If you have not installed Ballerina, then download the [installers](https://ballerina.io/downloads/) to install.

#### Highlights

- Ability to use `\` to escape the special characters in an identifier without specifying the initial quote
- Introduction of included record parameters
- Introduction of service typing changes basing services on objects
- Extension of Ballerina transaction capabilities to define transactional resource functions and transactional remote functions
- Improvements to the HTTP, Log, Email, and WebSub Standard Library modules
- Introduction of the new GraphQL, NATS Streaming (STAN), UUID, and WebSocket Standard Library modules

### What is new in Ballerina Swan Lake Preview 8

#### Language

##### Support identifier escapes without an initial quote

Now, `\` can simply be used to escape the special characters in an identifier without specifying the initial quote. For example, both the formats below are supported now.

```ballerina
int a\-b;
int 'a\-b;
```

##### Included record parameters

Included record parameters can be specified as `*T P` in which `T` denotes a record type descriptor and `P` denotes the name of the parameter.

An included record parameter is similar to a required parameter, but it also allows the caller of the function to specify the value for a field of the record type as a named argument using the field's name, as if it had been declared as a parameter.

The names of the fields in the record type of an included record parameter must be distinct from each other and also from the names of the other parameters, unless it is an optional field of type `never`.

A named argument in a function call can correspond to the fields of an included record parameter in two different ways.

1. Being relevant to a field of the included recorded parameter, which is not of the `never` type.

   ```ballerina 
   import ballerina/io;
 
   type Student record {
       string firstName;
       string lastName?;
   };
 
   function printStudentDetails(int admissionNo, *Student student) {
       string name = student.firstName;
 
       string? lastName = student?.lastName;
       if lastName is string {
           name += string ` ${lastName}`;
       }
 
       io:println("Admission No: ", admissionNo, ", Student Name: ", name);
   }  
 
   public function main() {
       printStudentDetails(1001, firstName = "Peter");
       printStudentDetails(1002, firstName = "Anne", lastName = "Doe");
   } 

   ```

2. Being relevant to a record rest descriptor of an included record parameter that is of an open record type. The following conditions should be satisfied for this.

    - In the parameter list, there should be only one included record parameter that is of an open record type.
    - The open record type must disallow fields of the same names as the other parameters and individual field descriptors of the other included record parameters, by including optional individual field descriptors of the type `never`.  In addition to these optional individual field descriptors, there should not be any other field descriptors in this record type.

   ```ballerina
   import ballerina/io;
 
   type Grades record {|
       never math?;
       never physics?;
       int...;
   |};
 
   function printAverage(int math, int physics, *Grades grades) {
       int totalMarks = math + physics;
       int count = grades.length() + 2;
 
       foreach int grade in grades {
           totalMarks += grade;
       }
 
       io:println("Average: ", totalMarks/count);
   }
 
   public function main() {
       printAverage(90, 85);
       printAverage(85, 85, chemistry = 75);
       printAverage(75, 85, chemistry = 90, zoology = 80);
   }
   ```

##### Service typing changes

Services are now based on objects. The service declaration syntax below is mere syntactic sugar for creating a new instance of a service class and then attaching it to a listener. With this change, the path that the service should serve on can be provided in the service-declaration syntax. This was previously provided using an annotation.

**Previous syntax**

```ballerina
import ballerina/http;

service hello on new http:Listener(9090) {

    resource function sayHello() returns error? {

    }
}
```

**New syntax**

```ballerina
import ballerina/http;

service [/optional_base_path] on new http:Listener(9090) {

    resource function get sayHello() returns string {

    }
}
```

>**Note:** There is no longer a service variable name as `hello` in the first example. 
Since services are objects, they can contain fields and regular methods. In addition to that, services can contain remote methods and resource methods.

Resource methods are defined as follows:

 `resource function` `resource-method-name` `resource-path` `() { }`

- Resource methods do not have a method name similar to a regular method.
- The `resource-method-name` informs the listener of the operations this resource allows. For example, in the HTTP listener, the `resource-method-name` maps to the HTTP methods such as `GET` or `PUT`.
- The `resource-path` is the path in which this resource resides within the service. You can use `.` as the `resource-path` to indicate the path `/`.

A service declared using the service-declaration syntax cannot be referred to using an identifier anymore. Instead, you need to use an object constructor prepended by the `service` keyword to declare a service object or create a new instance of a service class.

```ballerina
service object { } hello = service object {
    string message = "Hello";

    resource function get sayHello() returns string {

    }
}

listener http:Listener l = new (7000);
string[] basePath = ["/"]; // service base path: /
l.attach(hello, basePath);
```

```ballerina
service class HelloService {
    string message;
    resource function get sayHello() returns string {

    }

    function init(string message) {
        self.message = message;
    }
}

var hello = new HelloService("Hello");
listener http:Listener l = new(7000);
string[] basePath = ["hello", "path"]; // service on "/hello/path"
l.attach(hello, basePath);
```

##### Listener object 

Listener is no longer defined in `ballerina/lang.object` lang-library, now it is a compiler known internal type.
A type is a listener object type if it is a subtype of the object type Listener<T,A>, for some type `T` that is a subtype of `service object {}` and some type `A` that is a subtype of `string[]|string|()`.

The `object type Listener<T,A>`, is described by the following object type descriptor:

```ballerina
object {
   public function attach(T svc, A attachPoint) returns error?;
   public function detach(T svc) returns error?;
   public function start() returns error?;
   public function gracefulStop() returns error?;
   public function immediateStop() returns error?;
}
```

##### Transactional services

Ballerina transaction capabilities have been extended to services. Now, you can define transactional resource methods and transactional remote methods. These methods will be participants of global distributed transactions. Infection and agreement protocols are implemented based on the Ballerina distributed transaction protocol. 

By defining services as participants, all services work as a single unit of work. If any of the services fail, the whole transaction will be reverted and if all the services are successfully called, the transaction will be completed and committed successfully. 

###### Defining transactional resource methods in a service

```ballerina
transactional resource function get message(http:Caller caller, http:Request req) {
    http:Response res = new;
    callSomeService(res);        
    callAnotherService(res);
    checkpanic caller->respond(res);
}
```

###### Defining transactional remote methods in a client object


```ballerina
transactional remote function callMyFirstService() returns @tainted any|error {
    return self.httpClient1->get("/echo/message");
}

transactional remote function callMySecondService() returns @tainted any|error {
    return self.httpClient2->get("/user/history");
}
```

###### Calling the service

```ballerina
transaction {
    var res1 = client->callMyFirstService();
    var res2 = client ->callMySecondService();
    
    var x = commit;
    if (x is error) {
        // error code
    } else {
        // success code
    }
}
```                                                             

#### Standard library

##### `http` module changes

###### Service declaration

- Basepath field has been removed from the `ServiceConfig` annotation. Use the `absolute resource path` that begins with `/` as the basePath which is optional and defaults to `/` when not specified.
- The service type can be added as `http:Service`, which is optional after the `service` keyword.

**Previous syntax**

```ballerina
@http:ServiceConfig {
    basePath: “hello”
}
service myService on new http:Listener(9090) {

}
```

**New syntax**

```ballerina
service http:Service /hello on new http:Listener(9090) {

}
```

###### Resource method declaration

- Use the resource method name to specify the HTTP method to support instead of the `methods` field of the `ResourceConfig` annotation (e.g., `get`).
- Use `default` as the resource method name when the resource has to support all methods including standard HTTP methods and custom methods (e.g., the passthrough/proxy use case).
- The resource path segment represents the `path` as the `path` field of the `ResourceConfig` has been removed.
- Use `.` to specify the resource path segment if the path needs to be set as `/`.
- Path params are specified in the resource path segment within square brackets along with the type. The supported types are string, int, float, boolean (e.g., `path/[string foo]`).
- Resource signature parameters are optional. Even the `Caller` and `Request` are optional and not ordered.
- Query param binding support is added. The supported types are string, int, float, boolean, decimal, and the array types of the aforementioned types. The `Query` param type can be nilable (e.g., `(string? bar)`).
- Rest param support is added. It can be used as a wildcard path segment to accept requests to multiple different paths. Earlier it was used as `/*` and now it can be specified as `[string… s]` in which `s` is accessible within the resource. 
- Use the `@http:Payload {}` annotation to denote the data binding param in the resource signature as the `body` field of the `ResourceConfig` has been removed.

```ballerina
service http:Service /mytest on new http:Listener(9090) {
    resource function post  foo/[int id]/bar/[string... extra](string? bar, http:Caller caller, @http:Payload {} json p) {
        // [int id] is a path param
        // [string... extra] is a rest param
        // string? bar is a query param
        // json p is the request payload
    }
}
```


##### `log` module changes

- Log levels are reduced to `INFO` and `ERROR`. There will be no user configuration to control the log level. All the logs will be printed to the standard error stream.
- There are only two APIs to log messages as follows.

    1. Log `INFO` messages

    ```ballerina
    log:print("something went wrong", id = 845315);

    Output:
    time = 2019-08-09 11:47:07,342 module = "myorg/hello" message = "something went wrong" id = 845315
    ```

    2. Log `ERROR` messages

    ```ballerina
    log:printError("something went wrong", err = e, id = 845315);

    Output:
    time = 2019-08-09 11:47:07,342 module = "myorg/hello" message = "something went wrong" error = "invaild operation" id = 845315
    ```

- The API supports passing any number of key/value pairs along with the message.
- Log messages are printed following the `LogFMT` standards.

##### `email` module changes

The methods related to sending and receiving emails were renamed. The Listener API was divided into the POP and IMAP protocols. 

###### Client changes

 - The `email:Email` definition is changed to `email:Message`.
 - The `read` method of the `email:ImapClient`, `email:PopClient`, and `email:Listener` (i.e., the new `email:PopListener` and `email:ImapListener`) are changed to `receiveEmailMessage`.

###### Service declaration

- The `email:Listener` is split into the `email:PopListener` and `email:ImapListener`. Therefore, the `protocol` field is removed from the new protocol-specific listeners. The `email:PopConfig` or `email:ImapConfig` that was used as a field for the `email:Listener` is not required for new the API implementation. The protocol configuration-related fields are made parts of the new listeners.
- The resource methods are changed to remote methods in the new listener APIs.
- The service name is given as a string with the new Ballerina language changes.
- The `onMessage` method of the `email:Listener` (i.e., the new `email:PopListener` and `email:ImapListener`) is changed to `onEmailMessage`.
- The `pollingInterval` field of the `email:Listener` is changed to `pollingIntervalInMillis` in new listener APIs. That makes it consistent with other Ballerina modules, which have time durations configured in milliseconds.

A sample POP3 listener is given below.

**Previous syntax**

```ballerina
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

**New syntax**

```ballerina
listener email:PopListener emailListener = new ({
    host: "pop.email.com",
    username: "reader@email.com",
    password: "pass456",
    pollingIntervalInMillis: 2000,
    port: 995,
    enableSsl: true
});

service "emailObserver" on emailListener {

    remote function onEmailMessage(email:Message emailMessage) {

    }

    remote function onError(email:Error emailError) {

    }

}
```

##### `websub` module changes

- The base path is removed from the `SubscriberServiceConfig` annotation.
- The `onNotification` and `onIntentVerification` resources are converted to remote methods.

**Previous syntax**

```ballerina
@websub:SubscriberServiceConfig {
  path: "/websub",
  target: ["http://localhost:9191/websub/hub", "http://websubpubtopic.com"]
}
service websubSubscriber on new websub:Listener(8181) {
  resource function onIntentVerification(websub:Caller caller,  websub:IntentVerificationRequest request) {}
  resource function onNotification(websub:Notification notification) {}
}
```

**New syntax**

```ballerina
@websub:SubscriberServiceConfig {
   target: ["http://localhost:23191/websub/hub", "http://one.websub.topic.com"]
}
service websub:SubscriberService /websub on new websub:Listener(8181) {
   remote function onIntentVerification(websub:Caller caller, websub:IntentVerificationRequest request) {}
   remote function onNotification (websub:Notification notification) {}
}
```

##### Introduced new modules

###### GraphQL

The Ballerina GraphQL module is introduced with this release. This module provides the support to define GraphQL services and handle simple GraphQL queries. Currently, this supports GraphQL service endpoints with the resource methods, which return `graphql:Scalar` values (`int`, `string`, `boolean`, and `float`) and record types only.

###### NATS Streaming (STAN)

With this release, a new module is introduced for NATS Streaming. Previously, the Ballerina NATS module included the support for streaming as well. Now, NATS and NATS Streaming are separated into Ballerina NATS and Ballerina STAN modules.

###### UUID

The Ballerina UUID module is introduced with this release. This module provides functions related to UUID (Universally Unique Identifier) such as generating different types of UUIDs and validating and checking the versions of UUID strings.

###### WebSocket

- The WebSocket module has been moved out of the HTTP module. Therefore, you will have to change the import from `ballerina/http` to `ballerina/websocket`.
- Introduced a new listener for the WebSocket module.

**Previous syntax**

```ballerina
listener http:Listener wsListener = new (9090);
```

**New syntax**

```ballerina
listener websocket:Listener wsListener = new (9090);
```

- The base path is removed from the `WebSocketServiceConfig`.
- Has 2 types of services. In order to work with WebSockets, the two services below are mandatory.

    1. `websocket:UpgradeService` - This is to handle the WebSocket upgrade. This takes the `http:Request` and `http:Caller` parameters in. This service has a predefined `onUpgrade` remote method that returns a `websocket:Service` or an error. Earlier, this was handled by an HTTP upgrade resource. 
    2. `websocket:Service` - This is to handle events after the WebSocket upgrade. This service is still similar to the earlier WebSocket service, which had predefined resources like `onText`, `onBinary`, `onError`, `onPing`, and `onPong`. With the new syntax, all those resources are converted into remote methods.

**Previous syntax**

```ballerina
import ballerina/http;

listener http:Listener socketListener = new (9000);
 
@http:WebSocketServiceConfig {
   path: "/basic"
}
service echo on socketListener {
   resource function onText(http:WebSocketCaller caller, json text) {}
   resource function onBinary(http:WebSocketCaller caller, byte[] b) {}
}
```

**New syntax**

```ballerina
import ballerina/http;
import ballerina/websocket;

service websocket:UpgradeService / basic on new websocket:Listener(9000) {

    remote isolated function onUpgrade(http:Caller caller, http:Request req) 
            returns websocket:Service|websocket:WebSocketError {
        return new WsService();
    }
}

service class WsService {
    *websocket:Service;

    remote isolated function onText(websocket:Caller caller, string data) {
    }

    remote isolated function onBinary(websocket:Caller caller, byte[] data) {
    }
}
```
