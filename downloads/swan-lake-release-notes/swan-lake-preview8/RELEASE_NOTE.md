---
layout: ballerina-blank-page
title: Release Note
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
        - [Transactional Services](#transactional-services)
    - [Standard Library](#standard-library)
        - [HTTP Module Changes](#http-module-changes)
        - [Log Module Changes](#log-module-changes)
        - [Email Module Changes](#email-module-changes)
        - [WebSub Module Changes](#websub-module-changes)
        - [UUID Module Changes](#uuid-module-changes)
        - [Introduced New Modules](#introduced-new-modules)

#### Updating Ballerina

You can use the update tool to update to Ballerina Swan Lake Preview 8 as follows.

##### For Existing Users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina Update Tool](http://ballerina.io/swan-lake/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 
                        
> `ballerina update`

 Next, execute the command below to update to Swan Lake Preview 8.

 > `ballerina dist pull slp8`                 

However, if you are using a Ballerina version below 1.1.0, install via the [installers](https://ballerina.io/downloads/).

##### For New Users

If you have not installed Ballerina, then download the [installers](https://ballerina.io/downloads/) to install.

#### Highlights

- Ability to use `\` to escape the special characters in an identifier without mentioning the initial quote
- Ability to specify included record parameters
- Introduction of service typing changes basing services on objects
- Extension of Ballerina transaction capabilities to define transactional resource functions and transactional remote functions
- Improvements to the HTTP, Log, Email, WebSub, and UUID Standard Library modules
- Introduction of the new GraphQL, NATS Streaming (STAN), and WebSocket Standard Library modules

### What is new in Ballerina Swan Lake Preview 8

#### Language

##### Support Identifier Escapes Without an Initial Quote

Now, `\` can simply be used to escape the special characters in an identifier without mentioning the initial quote. For example, both the formats below are supported now.

```ballerina
int a\-b;
int 'a\-b;
```

##### Included Record Parameters

Included record parameters can be specified as `*T P` in which `T` denotes the record type descriptor and `P` denotes the name of the parameter. When this is compared with the required parameter, the difference is that the values, which are used for the fields of the included record parameter behave as named arguments for the function call, if it had been declared as parameters of the function.

The field names of all included record parameters, which are not of the `never` type, must be distinct from each other and also from the names of the parameters.

```ballerina
type Student record {
	string firstName;
	string secondName;
	int age;
	Address address?;
	never gender?;
};

type Address record {|
	string city;
	string country;
|};

type Grades record {|
	never maths?;
	never physics?;
	never chemistry?;

	int...;
|};

function studentDetails(int addmissionNo, string addmissionDate, *Student student) {
	string fullName = <string>student.firstName  + <string>student.secondName;
	int age = student.age;
	if (student["address"] is Address) {
    	Address address = <Address>student["address"];
	}
}   

function studentTotalMarks(int maths, int physics, int chemistry, *Grades grades) {
	int totalMarks = maths + physics + chemistry;
	foreach [string, int?] [subject, marks] in grades.entries() {
    	totalMarks = totalMarks + <int>marks;
	}
}
```

A named argument in a function call can correspond to an included record parameter in two different ways.

1. Being relevant to a field of the included recorded parameter, which is not of the `never` type.

    ```ballerina 
    public function main() {
        studentDetails(1001, "2020-Nov-20", firstName = "Peter", secondName = "So", age = 18);
        studentDetails(1002, "2020-Nov-22", firstName = "Anne", secondName = "Doe", age = 20, address = {city: "Colombo", country: "Sri Lanka"});
    }
    ```

2. Being relevant to a record rest descriptor of an included record parameter. Here, the field is described by a record rest descriptor either as explicitly part of an exclusive record type descriptor or as implicitly as part of an inclusive record type descriptor. The two conditions below should be satisfied for this.

    - In the parameter list, there should be only one included record parameter with a record rest descriptor.
    - The included record parameter with the record rest descriptor must include optional individual field descriptors of the type `never`, which correspond to each parameter name and the names of each individual field descriptor of the other included record parameters. In addition to these optional individual field descriptors, there should not be any other field descriptors with this included record parameter.

    ```ballerina
    public function main() {
        studentTotalMarks(90, 85, 75);
        studentTotalMarks(85, 85, 75, english = 75);
        studentTotalMarks(75, 85, 90, english = 80, generalTest = 70);
    }
    ```

##### Service Typing Changes

Services are now based on objects. The service declaration syntax below is mere syntactic sugar for creating a new instance of a service class and then attaching it to a listener. With this change, the path that the service should serve on can be provided in the service-declaration syntax. This was previously provided using an annotation.

Therefore, the example below;

```ballerina
import ballerina/http;
service hello on new http:Listener(9090) {

    resource function sayHello() returns error? {

    }
}
```

will turn into the code below.

```ballerina
import ballerina/http;
service [/optional_base_path] on new http:Listener(9090) {

    resource function get sayHello() returns string {

    }
}
```

>**Note:** There is no longer a service variable name as `hello` in the first example. 
Since services are objects, they can contain fields and regular methods. In addition to that, services can contain remote methods and resource methods.

Resource functions are defined as follows:

 `resource function` `resource-method-name` `resource-path``() { }`

- Resource functions do not have a method name similar to a regular method.
- The `resource-method-name` instructs the listener on which operations this resource allows. For example, in the HTTP listener, the `resource-method-name` maps to the HTTP methods such as `GET` or `PUT`.
- The `resource-path` is the path in which this resource resides within the service. You can use `.` as the `resource-path` to indicate the path `/`.

A service declared using the service-declaration syntax cannot be referred to using an identifier anymore. Instead, you need to use an object constructor prepended by the `service` keyword to declare a service object or create a new instance of a service class.

```ballerina
service object { } hello = service object {
    string message = "Hello";
    resource function get sayHello() returns string {

    }

}
listener http:Listener l = new(7000);
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
var helo = new HelloService();
listener http:Listener l = new(7000);
string[] basePath = ["hello", "path"]; // service on "/hello/path"
l.attach(hello, basePath);
```

##### Transactional Services

Ballerina transaction capabilities are extended to services. Now, you can define transactional resource functions and transactional remote functions. These functions will be participants of global distributed transactions. Infection and agreement protocols are implemented based on the Ballerina distributed transaction protocol. 

By defining services as participants, all services work as a single unit of work. If any of the services fails, the whole transaction will be reverted and if all the services are successfully called, the transaction will be completed and committed successfully. 

**Defining a Transactional Resource Function of a Service**

```ballerina
transactional resource function get message(http:Caller caller, http:Request req) {
    http:Response res = new;
    callSomeService(res);        
    callAnotherService(res);
    checkpanic caller->respond(res);
}
```

**Defining  the Transactional Remote Functions of a Client Object**


```ballerina
transactional remote function callMyFirstService() returns @tainted any|error {
    return self.httpClient->get("/echo/message");
}

transactional remote function callMySecondService() returns @tainted any|error {
    return self.httpClient->get("/echo/message");
}
```

**Calling the Service**

```ballerina
transaction {
    var res1 = client->callMyFirstService();
   var  res2 = client ->callMySecondService();
   var x = commit;
    if (x is error) {
        // error code
    } else {
        // success code
    }
}
```                                                             

#### Standard Library

##### HTTP Module Changes

###### Service Declaration

- Basepath is removed from the `ServiceConfig`. Use the absolute resource path, which begins with `/` as the basePath. The `absolute-resource-path` is optional, which defaults to `/` when not specified.
- The service type can be added after the `service` keyword as `http:Service`, which is also optional.

**Old Syntax**

```ballerina
@http:ServiceConfig {
    basePath: “hello”
}
service myService on new http:Listener(9090 {

}
```

**New Syntax**

```ballerina
service http:Service /hello on new http:Listener(9090 {

}
```

###### Resource Function Declaration

- Use the accessor name to specify the HTTP method instead of the `methods` field of the `ResourceConfig` (e.g., `get`).
- Use `default` the as accessor name when all standard HTTP methods need to be supported (e.g., the passthrough/proxy use case).
- The resource path segement represents the `path`. The `path` field of the `ResourceConfig` is removed.
- Use `.` to specify the resource path segement if the path needs to be set as `/`.
- Path params are specified in the resource path segement within square brackets along with the type. The supported types are string, int, float, boolean, decimal (e.g., `path/[string foo]`).
- Resource signature params are optional. Even the `Caller` and `Request` are optional and not ordered.
- Query param binding support is added. The supported types are string, int, float, boolean, decimal, and the array type of them. The `Query` param type can be nialble (e.g., `(string? bar)`).
- Rest param support is added. It can be used as a wildcard path segment to get the multiple path requests dispatched. Earlier it was used as `/*` and now it can be specified as `[string… s]` in which `s` is accessible within the resource. 
- Data binding and resource function return support is not added yet.

```ballerina
service http:Service /mytest on helloEP {
    resource function get  [string... extra](string? bar, http:Caller caller) {
        // [int id] is a path param
        // [string... extra] is a rest param
        // string? bar is a query param
    }
}
```

###### Service Values Declaration

```ballerina
http:Service listenerMock = service object {
    resource function get .(http:Caller caller, http:Request req) {
        //...
    }
};

err? e =  listenerEP.attach(listenerMock, "mock1"); // mock1 is the absolute-resource-path
```

##### Log Module Changes

- Log levels are reduced to `INFO` and `ERROR`. There will be no user configuration to control the log level. All the logs are printed as standard errors.
- There are only two APIs to log messages as follows.

1. Log `INFO` messages

    ```ballerina
    log:print(“something went wrong”, id = 845315);

    Output:
    time = 2019-08-09 11:47:07,342 module = “myorg/hello” message = “something went wrong” id = 845315
    ```

2. Log `ERROR` messages

    ```ballerina
    log:printError(“something went wrong”, err = e, id = 845315);

    Output:
    time = 2019-08-09 11:47:07,342 module = “myorg/hello” message = “something went wrong” error = “invaild operation” id = 845315
    ```

- The API supports passing any number of key/value pairs along with the message.
- Log messages are printed following the `LogFMT` standards.

##### Email Module Changes

The methods related to sending and receiving emails were renamed. The Listener API was divided into the POP and IMAP protocols. 

**Client Changes**

 - The `email:Email` definition is changed to `email:Message`.
 - The `read` method of the `email:ImapClient`, `email:PopClient`, and `email:Listener` (i.e., the new `email:PopListener` and `email:ImapListener`) are changed to `receiveEmailMessage`.

**Service Declaration**

- The `email:Listener` is splitted into the `email:PopListener` and `email:ImapListener`. Therefore, the `protocol` field is removed from the new protocol-specific listeners. The `email:PopConfig` or `email:ImapConfig` that were used as a field for the `email:Listener` are not required for new the API implementation. The protocol configuration related fields are made parts of the new listeners.
- The resource functions are changed to remote functions in the new listener APIs.
- The service name is given as a string with the new Ballerina language changes.
- The `onMessage` method of the `email:Listener` (i.e., the new `email:PopListener` and `email:ImapListener`) are changed to `onEmailMessage`.
- The `pollingInterval` field of the `email:Listener` is changed to `pollingIntervalInMillis` in new listener APIs. That makes it consistent across the other Ballerina modules, which are time durations configured in milliseconds.

A sample POP3 listener is given below.

**Old Syntax**

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

**New Syntax**

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

##### WebSub Module Changes

- The base path is removed from the `SubscriberServiceConfig`.
- The `onNotification` and `onIntentVerification` resources are converted to remote functions.

**Old Syntax**

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

**New Syntax**

```ballerina
@websub:SubscriberServiceConfig {
   target: ["http://localhost:23191/websub/hub", "http://one.websub.topic.com"]
}
service websub:SubscriberService /websub on new websub:Listener(8181) {
   remote function onIntentVerification(websub:Caller caller, websub:IntentVerificationRequest request) {}
   remote function onNotification (websub:Notification notification) {}
}
```

##### UUID Module Changes

The Ballerina UUID module is introduced with this release. This module provides functions related to UUID(Universally Unique Identifier) such as generating different types of UUIDs and validating and checking the versions of UUID strings.

##### Introduced New Modules

**GraphQL**

The Ballerina GraphQL module is introduced with this release. This module provides the support to define GraphQL services and handle simple GraphQL queries. Currently, this supports GraphQL service endpoints with the resource functions, which return `graphql:Scalar` values (`int`, `string`, `boolean`, and `float`) and record types only.

**NATS Streaming (STAN)**

With this release, a new module is introduced for NATS Streaming. Previously, the Ballerina NATS module included the support for streaming as well. Now, NATS and NATS Streaming are separated into Ballerina NATS and Ballerina STAN modules.

**WebSocket**

- The WebSocket module has been moved out of the HTTP module. Therefore, you will have to change the import from `ballerina/http` to `ballerina/websocket`.
- Introduced a new listener for the WebSocket module.

**Old Syntax**

```ballerina
listener http:Listener wsListener = new(9090);
```

**New Syntax**

```ballerina
listener websocket:Listener wsListener = new(9090);
```

- The base path is removed from the `WebSocketServiceConfig`.
- Has 2 types of services. In order to work with WebSockets, the two services below are mandatory.

    1. `websocket:UpgradeService` - This is to handle the WebSocket upgrade. This takes the `http:Request` and `http:Caller` parameters in. This service has a predefined `onUpgrade` remote function  and returns a `websocket:Service` or an error. Earlier, this was handled by an HTTP upgrade resource. 
    2. `websocket:Service` - This is to handle events after the WebSocket upgrade. This service is still similar to the earlier WebSocket service, which had predefined resources like `onText`, `onBinary`, `onError`, `onPing`, and `onPong`. With the new syntax, all those resources are converted into remote functions.

**Old Syntax**

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

**New Syntax**

```ballerina
import ballerina/http;
import ballerina/websocket;

service websocket:UpgradeService / basicon new websocket:Listener(9000) {
remote isolated function onUpgrade(http:Caller caller, http:Request req) returns websocket:Service|websocket:WebSocketError {
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
