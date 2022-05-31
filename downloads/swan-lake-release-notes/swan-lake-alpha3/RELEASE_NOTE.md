---
layout: ballerina-left-nav-release-notes
title: Swan Lake Alpha3
permalink: /downloads/swan-lake-release-notes/swan-lake-alpha3/
active: swan-lake-alpha3
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-alpha3
---
### Overview of Ballerina Swan Lake Alpha3

The Ballerina Swan Lake Alpha3 release includes the language features planned for the Ballerina Swan Lake release. Moreover, this release includes improvements and bug fixes to the compiler, runtime, standard library, and developer tooling. This release note lists only the features and updates added after the Alpha2 release of Ballerina Swan Lake.

- [Updating Ballerina](#updating-ballerina)
    - [For Existing Users](#for-existing-users)
    - [For New Users](#for-new-users)
- [What is New in Ballerina Swan Lake Alpha3](#what-is-new-in-ballerina-swan-lake-alpha3)
    - [Language](#language)
    - [Runtime](#runtime)
    - [Standard Library](#standard-library)
    - [Code to Cloud](#code-to-cloud)
    - [Ballerina Packages](#ballerina-packages)
    - [Developer Tools](#developer-tools)
    - [Breaking Changes](#breaking-changes)

### Updating Ballerina

If you are already using Ballerina, you can directly update your distribution to Ballerina Swan Lake Alpha3 using the [Ballerina update tool](/learn/tooling-guide/cli-tools/update-tool/). To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **update tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Alpha3.

> `bal dist pull slalpha3`

### Installing Ballerina

If you are a new user, then download the [installers](/downloads/#swanlake) to install.

### What is new in Ballerina Swan Lake Alpha3

#### Language

##### Support for module-level variables with list, mapping, and error binding patterns

Variable declarations with list, mapping, or error binding patterns are now allowed at the module level. Unlike simple variables, these variables must be initialized in the declaration.

Also, these variable declarations cannot contain the `isolated` or `configurable` qualifier.

```ballerina
type Person record {|
    string name;
    boolean married;
|};

function getList() returns [int, float] => [1, 2.5];

function getPerson() returns Person => {name: "John", married: true};

function getError() returns error => error("error message", code = 1001, fatal = true);

// Module-level variable declaration with a list binding pattern. 
[int, float] [a, b] = getList();

// Module-level variable declaration with a mapping binding pattern.
Person {name: firstName, married: isMarried} = getPerson();

// Module-level variable declaration with an error binding pattern.
error error(message, code = errCode) = getError();
```

##### Support for module-level public variables

Module-level variables can now be declared as public using the `public` qualifier. Such variables will be visible outside the modules in which they are declared.

Isolated variables and variables declared with `var` cannot be declared as public variables.

```ballerina
public string name = "Ballerina";

public [int, float] [a, b] = [1, 2.5];
```

##### Improvement to annotation attachment with empty mapping constructor expression

If the type of the annotation is a mapping type for which an empty mapping constructor is valid, the mapping constructor expression is no longer mandatory in the annotation attachment.

The absence of the mapping constructor expression in such an annotation attachment is equivalent to specifying a mapping constructor expression with no fields.
```ballerina
type Annot record {|
    int[] i = [];
|};

public annotation Annot v1 on function;

@v1 // Same as `@v1 {}`
public function main() {
}
```

##### Introduction of the `function` function type descriptor to represent any function

A new `function` type descriptor has been introduced to represent all function values.

```ballerina
import ballerina/io;

function add(int v1, int v2) returns int => v1 + v2;

function compare(int v1, int v2) returns boolean => v1 < v2;

public function main() {
    // A variable of type `function` can hold any function value.
    function f = add;
    io:println("Process (add, 1, 2): ", process(f, 1, 2)); // Prints `Process (add, 1, 2): 3`
    io:println("Process (compare, 1, 2): ", process(compare, 1, 2)); // Prints `Process (compare, 1, 2): 0`
}

function process(function func, int v1, int v2) returns int {
    // A function of type `function` cannot be called directly.
    // A function value assigned to a `function`-typed variable
    // can only be called after the type is narrowed to the relevant type.
    if (func is function (int, int) returns int) {
        return func(v1, v2);
    }
    return 0;
}
```

##### New lang library functions

###### New `xml:text()` function

This function can be used to select all the items in a sequence that are of type `xml:Text`.

```ballerina
xml name = xml `<name>Dan<middleName>Gerhard</middleName><!-- This is a comment -->Brown</name>`;
xml:Text nameText = (name/*).text();
io:println(nameText); // "DanBrown"
```

##### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha3](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha3%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

#### Runtime

##### New runtime Java API to create errors

A new runtime Java API is introduced to create errors.
```java
BError createError(Module module, String errorTypeName, BString message, BError cause, Object details)
```
The `createDistinctError` API has been deprecated and should not be used to create distinct errors. The new `createError` API can be used instead.

##### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha3](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha3%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

#### Standard library

##### Log package updates

###### Introduced additional log levels and log functions

Introduced 2 additional log levels: `DEBUG` and `WARN`. The  `printDebug` and `printWarn` functions in the `ballerina/log` module can be used to publish logs at the respective log levels. The `print` function was renamed to `printInfo`.

To set the global log level, place the entry given below in the `Config.toml` file:
```toml
[log] 
level = "[LOG_LEVEL]"
```

Each module can also be assigned its own log level. To assign a log level to a module, provide the following entry in the `Config.toml` file:
```toml
[[log.modules]] 
name = "[ORG_NAME]/[MODULE_NAME]"
level = "[LOG_LEVEL]"
```

##### OS package updates

- Removed the `exec` function.

##### Task package updates

The module has been revamped by removing the `Scheduler` and `Listener` classes and introducing the following functions to schedule and manage the job either one-time or periodically.

- Configures the scheduler worker pool with the worker count and max waiting time.

```ballerina
import ballerina/task;

task:Error? output = task:configureWorkerPool(6, 7000);
```

- Schedules the job at a specified time.

```ballerina
import ballerina/task;
import ballerina/time;

class MyJob {
   *task:Job;

   public function execute() {
       // logic goes here
   }
}

time:ZoneOffset zoneOffset = {hours: 5, minutes: 30};
time:Civil time = {
    year: 2021,
    month: 4,
    day: 12,
    hour: 23,
    minute: 20,
    second: 50.52,
    timeAbbrev: "Asia/Colombo",
    utcOffset: zoneOffset
};
task:Error|task:JobId id = task:scheduleOneTimeJob(new MyJob(), time);
```

- Schedules the recurring job according to the given duration.

```ballerina
import ballerina/task;

class MyJob {
   *task:Job;

   public function execute() {
       // logic goes here
   }
}
task:Error|task:JobId id = task:scheduleJobRecurByFrequency(new MyJob(), 1);
```

- Unschedules the particular job.

```ballerina
import ballerina/task;

task:Error? result = task:unscheduleJob(id);
```

- Pauses all the jobs.

```ballerina
import ballerina/task;

task:Error? result = task:pauseAllJobs();
```

- Resumes all the jobs.

```ballerina
import ballerina/task;

task:Error? result = task:resumeAllJobs();
```

- Pauses the particular job.

```ballerina
import ballerina/task;

task:Error? result = task:pauseJob(id);
```

- Resumes the particular job.

```ballerina
import ballerina/task;

task:Error? result = task:resumeJob(id);
```

- Gets all the running jobs.

```ballerina
import ballerina/task;

task:JobId[] jobIds = task:getRunningJobs();
```

##### Time package updates

Revamped the entire time package as follows:

- Introduced the `time:Utc` record to represent the UTC timestamp.
- Introduced the `time:Civil` record to represent the localized time.
- Added necessary APIs to do time generation, manipulations, and conversions.

Steps for migration from the previous version to the current version are listed [in this issue](https://github.com/ballerina-platform/ballerina-standard-library/issues/1079).

##### Cache package updates

- Introduced the new `EvictionPolicy` configuration to set the eviction policy in the `CacheConfig` record.

The `EvictionPolicy` record has been introduced with the option `LRU` as the module only supports the LRU eviction policy to evict the cache data when the cache is full.

- Removed the `AbstractEvictionPolicy` object type.

This object type had the common APIs for the cache eviction functionalities to implement a custom eviction policy. It has been removed with the introduction of the above configuration.

##### New `xmldata` package

A new module is added to convert data in XML format to JSON format and vice-versa.

- Converts a JSON object to an XML representation.

```ballerina
import ballerina/xmldata;

json data = {
    name: "John",
    age: 30
};
xml|xmldata:Error x = xmldata:fromJson(data);
```

- Converts an XML value to its JSON representation.

```ballerina
import ballerina/xmldata;

json|xmldata:Error j = xmldata:toJson(xml `foo`);
```

##### Removed `jsonutils`, `xmlutils`, `runtime`, and `reflect` packages

The `jsonutils`, `xmlutils`, `runtime`, and `reflect` packages were removed from Standard Libraries.

The XML/JSON conversation APIs in `jsonutils` and `xmltutils` packages are now supported by the `xmldata` package.

##### HTTP package updates

- Changed the return types of the client methods to depend on the `targetType` argument. The default `targetType` is `http:Response`.

```ballerina 
http:Client myClient = check new ("http://localhost:9090”);
http:Response response = check myClient->post("/backend/getResponse", "want response");
json jsonPayload = check myClient->post("/backend/getJson", "want json", targetType = json);
xml xmlPayload = check myClient->post("/backend/getXml", "want xml", targetType = xml);
```

- Introduced a header map as an optional argument for non-entity-body client remote methods (GET, HEAD, OPTIONS). 

```ballerina
http:Client myClient = check new ("http://localhost:9090”);
map<string|string[]> accHeaders = { "Accept" : "application/json" };
var response = myclient->get("/some/endpoint", accHeaders);
```

- Introduced header map and media type as optional arguments for entity-body client remote methods (POST, PUT, PATCH, DELETE, EXECUTE).

```ballerina
http:Client myClient = check new ("http://localhost:9090”);
json payload = {}; 
map<string|string[]> accHeaders = { "Accept" : "application/json" };
var response = myclient->post("/some/endpoint", payload, headers = accHeaders);
```

- Improved the data types of outbound request/response payloads which can be set directly.  

```ballerina
type RequestMessage Request|string|xml|json[]|byte[]|int|float|decimal|boolean|map<json>|table<map<json>>|
                      table<map<json>>[]|mime:Entity[]|stream<byte[], io:Error>|();

type ResponseMessage Response|string|xml|json[]|byte[]|int|float|decimal|boolean|map<json>|table<map<json>>|
                      table<map<json>>[]|mime:Entity[]|stream<byte[], io:Error>|();
```

- Marked HTTP client remote methods as isolated.

- Introduced module error inheritance and remove error union types.

##### WebSocket package updates

- Introduced auth support for the WebSocket client.
The bearer token, Basic Auth, JWT, and OAuth2 support have been introduced with the WebSocket client declarative authentication.

- Introduced HTTP cookie support for the WebSocket client.

```ballerina
http:Cookie cookie = new ("username", "name");
http:Cookie[] httpCookies = [cookie];

websocket:ClientConfiguration clientConf = {
  cookies: httpCookies
};

websocket:Client wsClient = check new ("ws://localhost:21316/ws", config = clientConf);
```

- Made the `websocket:Caller` optional in WebSocket service remote functions.

- Introduced support to send text, binary, and pong messages by returning them from the remote methods. 
Text/binary data can now be sent to the peer by returning a `string` or a `byte[]` value from the `onTextMessage` and `onBinaryMessage` remote methods. Also, a pong frame can be sent to the peer by returning a `byte[]` value from the `onPing` remote method.

```ballerina
remote function onTextMessage(string text) returns string {
    return "Hello World!";
}
```

```ballerina
remote function onPing(byte[] pingData) returns byte[] {
    return pingData;
}
```

- Removed the support for the `websocket:AsyncClient`.

##### GraphQL package updates

- Added the support for hierarchical resource paths.
The Ballerina GraphQL resources now can have hierarchical resource paths. Each intermediate resource path then maps to a new type in the generated schema.

```ballerina
import ballerina/graphql;

service /graphql on new Listener(9104) {
   isolated resource function get profile/name/first() returns string {
       return "Sherlock";
   }

   isolated resource function get profile/name/last() returns string {
       return "Holmes";
   }

   isolated resource function get profile/age() returns int {
       return 40;
   }
}
```

- Supported resource functions to return optional types. 

The Ballerina GraphQL resources now can return optional types. 

```ballerina
resource function get profile/name/first(int id) returns string? {
    if id == 0 {
        return "sherlock";
    }
}
```

##### Email package updates

- Enabled read/listen for multiple emails in a single TCP connection.
    
    Each POP3 or IMAP client/listener creation initiates the connection. Then, the email sending, receiving, or listening operations can be performed many times. Finally, the client/listener has to be closed.

**POP3 client example**

```ballerina
email:PopClient popClient = check new ("pop.email.com", "reader@email.com","pass456");
email:Message? emailResponse = check popClient->receiveMessage();
check popClient->close();
```

A similar format is used in the IMAP client. 

**POP3 service example**

```ballerina
service object {} emailObserver = service object {
   remote function onMessage(Message emailMessage) {

   }

   remote function onError(Error emailError) {

   }

   remote function onClose(Error? closeError) {

   }

};
```

Note how the `close()` method calls the `onClose` method in the service.

- Made email body a mandatory field in `sendEmail` method API.

- Renamed email sending method names removing `Email` in each of them 
Renamed `sendEmail` as `send`, `sendEmailMessage` as `sendMessage`, `receiveEmailMessage` as `receiveMessage` and `onEmailMessage` as `onMessage`.

- Set the default `from` address of the `email:Message` record from the `SmtpClient` authentication field, `username`.
Earlier, the username for authentication was decoupled from the message data. Now, the `from` field is made optional and the default value will be set from the username.

- Made POP3 and IMAP clients as blocking clients by providing an optional `timeout` argument.
The time unit is in seconds and the data type is `decimal`. The default value is 0 in which the inbuilt polling interval is 100 milliseconds.
A sample client code is as follows.
```ballerina
email:Message|email:Error? email = popClient->receiveMessage(timeout = 2);
```
- In the `PopListener` and `ImapListener` configurations, the polling interval is not set with the  `decimal` type in seconds to the `pollingInterval` field, which was earlier named as `pollingIntervalInMillis`.

- Renamed the `email:SmtpConfig`, `email:PopConfig`, `email:ImapConfig`, `email:PopListenerConfig`, and `email:ImapListenerConfiguration` as `email:SmtpConfiguration`, `email:PopConfiguration`, `email:ImapConfiguration`, `email:PopListenerConfiguration`, and `email:ImapListenerConfiguration` respectively.

- Removed the `cronExpression` field from the `email:ImapListenerConfig` and `email:PopListenerConfig`.

- Made the `body` field of the `send` method mandatory in the `email:SmtpClient`. 

##### WebSub package updates

- Introduced a websub-listener configuration for the websub-listener.

```ballerina
import ballerina/websub;

websub:ListenerConfiguration configs = {
    		secureSocket: {
        		key: {
            		certFile: "../resource/path/to/public.crt", 
                    keyFile: "../resource/path/to/private.key"
        		}
    		}    
    // any additional configurations related to http-listener 
};

service /subscriber on new websub:Listener(9090, configs) {
   // resources
}
```

##### WebSubHub package updates

- Included HTTP Headers parameter into the WebSub Hub API.

```ballerina
import ballerina/websubhub;
import ballerina/http;

listener websubhub:Listener hubListener = new(9095);

service /websubhub on new websubhub:Listener(9090) {
    remote function onRegisterTopic(TopicRegistration message, http:Headers requestHeaders)
                                returns TopicRegistrationSuccess|TopicRegistrationError {
		return {};
    }
    // http:Headers parameter will be an optional parameter for all the API endpoints
}
```

- Introduced pre-initialized constant responses to be used in the `websubhub:Service` implementation.

```ballerina
import ballerina/websubhub;

service /websubhub on new websubhub:Listener(9090) {

    remote function onRegisterTopic(websubhub:TopicRegistration message)
                                returns websubhub:TopicRegistrationSuccess {
        log:print("Received topic-registration request ", message = message);
        return websubhub:TOPIC_REGISTRATION_SUCCESS;
    }

    // implement other service methods
}
```

- Initializing the `websubhub:HubClient` with the client configurations.

```ballerina
import ballerina/websubhub;

websubhub:ClientConfiguration config = {
    retryConfig: {
        interval: 3,
            count: 3,
            backOffFactor: 2.0,
            maxWaitInterval: 20,
            statusCodes: [500]
        },
        timeout: 2
    };

HubClient hubClientEP = check new(subscriptionMsg, config);

websubhub:ContentDistributionMessage msg = {content: "This is sample content delivery"};

var publishResponse = hubClientEP->notifyContentDistribution(msg);
```

- Introduced the `websubhub-listener` configuration to configure a websubhub listener.

```ballerina
import ballerina/websubhub;

websubhub:ListenerConfiguration configs = {
    		secureSocket: {
        			key: {
            			certFile: "../resource/path/to/public.crt", 
keyFile: "../resource/path/to/private.key"
        			}
    		}
    
    	// any additional configurations related to http-listener 
};

service /hub on new websubhub:Listener(9090, configs) {
    		// resources
}
```

##### Security updates

- Renamed the `ballerina/encoding` module as `ballerina/url` and updated the APIs.

```ballerina
import ballerina/url;

string|url:Error encoded = url:encode("http://localhost:9090", "UTF-8");
string|url:Error decoded = url:decode("http%3A%2F%2Flocalhost%3A9090", "UTF-8");
```

- The Ballerina HTTP listener can be configured to authenticate and authorize the inbound requests with a Basic Auth file user store.

- Improved client and listener `SecureSocket` APIs of HTTP, gRPC, WebSocket, GraphQL, WebSub, WebSubHub, TCP, Email, NATS, STAN, and RabbitMQ modules.

```ballerina
public type ListenerSecureSocket record {|
   crypto:KeyStore|CertKey key;
   record {|
       VerifyClient verifyClient = REQUIRE;
       crypto:TrustStore|string cert;
   |} mutualSsl?;
   record {|
       Protocol name;
       string[] versions = [];
   |} protocol?;
   record {|
       CertValidationType type = OCSP_STAPLING;
       int cacheSize;
       decimal cacheValidityPeriod;
   |} certValidation?;
   string[] ciphers = [];
   boolean shareSession = true;
   decimal handshakeTimeout?;
   decimal sessionTimeout?;
|};

public type ClientSecureSocket record {|
   boolean enable = true;
   crypto:TrustStore|string cert?;
   crypto:KeyStore|CertKey key?;
   record {|
       Protocol name;
       string[] versions = [];
   |} protocol?;
   record {|
       CertValidationType type = OCSP_STAPLING;
       int cacheSize;
       decimal cacheValidityPeriod;
   |} certValidation?;
   string[] ciphers?;
   boolean verifyHostName = true;
   boolean shareSession = true;
   decimal handshakeTimeout?;
   decimal sessionTimeout?;
|};

public type CertKey record {|
   string certFile;
   string keyFile;
   string keyPassword?;
|};
 
public enum VerifyClient {
   REQUIRE,
   OPTIONAL
}
 
public enum Protocol {
   SSL,
   TLS,
   DTLS
}
 
public enum CertValidationType {
   OCSP_CRL,
   OCSP_STAPLING
}
```

- Improved the `SecureSocket` configuration of the JDK11 client of the JWT and OAuth2 modules.

- Added support for OAuth2 client authentication of the JDK11 client, which is used to call an authorization endpoint.

##### TCP package updates

- Introduced SSL/TLS support for both the client and listener.

```ballerina
import ballerina/tcp;

public function main() returns error? {
    tcp:Client socketClient = check new ("localhost", 9002, secureSocket = {
        cert: "../resource/path/to/public.crt",
        protocol: {
            name: tcp:TLS,
            versions: ["TLSv1.2", "TLSv1.1"]
        },
        ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA"]
    });

    string msg = "Hello Ballerina Echo from secure client";
    byte[] msgByteArray = msg.toBytes();
    check socketClient->writeBytes(msgByteArray);

    readonly & byte[] receivedData = check socketClient->readBytes();

    check socketClient->close();
}
```

```ballerina
import ballerina/tcp;
import ballerina/io;

tcp:ListenerSecureSocket listenerSecureSocket = {
    key: {
        certFile: "../resource/path/to/public.crt",
        keyFile: "../resource/path/to/private.key"
    },
    protocol: {
        name: tcp:TLS,
        versions: ["TLSv1.2", "TLSv1.1"]
    },
    ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA"]
}

service on new tcp:Listener(9002, secureSocket = listenerSecureSocket) {

    isolated remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        io:println("Client connected to secureEchoServer: ", caller.remotePort);
        return new EchoService(caller);
    }
}

service class EchoService {
  
    remote function onBytes(readonly & byte[] data) returns (readonly & byte[])|tcp:Error? {
        io:println("Echo: ", 'string:fromBytes(data));
        return data;
    }
}
```

- Included a `tcp:Caller` as an optional parameter in the `onBytes()` method.

```ballerina
service class EchoService {
  
    remote function onBytes(tcp:Caller caller, readonly & byte[] data) returns (readonly & byte[])|tcp:Error? {
        io:println("Echo: ", 'string:fromBytes(data));
        check caller->writeBytes(data);
    }
}
```

- Renamed `tcp:ListenerConfig` and `tcp:ClientConfig` to `tcp:ListenerConfiguration` and `tcp:ClientConfiguration`

##### UDP package updates

- Renamed `udp:ListenerConfig` and `udp:ClientConfig` to `udp:ListenerConfiguration` and `udp:ClientConfiguration`

##### Kafka package updates

- Renamed the `sendProducerRecord` function in the client object `Producer` to `send`.

- Renamed the `flushRecords` function in the client object `Producer` to `’flush`.

- Replaced the `kafka:ConsumerError` and `kafka:ProducerError` with `kafka:Error`.

##### NATS package updates

- Renamed the `ConnectionConfig` record to `ConnectionConfiguration`. 

- Included `url` as a field in the `ConnectionConfiguration` record. 

- Changed the `ConnectionConfiguration` in the client and listener init functions to an included record parameter. This allows the record field values to be passed as named parameters. 

##### STAN package updates

- Renamed the `StreamingConfig` record to `StreamingConfiguration`. 

- Included the `url` as a field in the `StreamingConfiguration` record. 

- Changed the `StreamingConfiguration` in the client and listener init functions to an included record parameter. This allows the record field values to be passed as named parameters. 

##### RabbitMQ package updates

- Renamed the `ConnectionConfig` record to `ConnectionConfiguration`. 

##### Common standard library updates

- All the timeout configurations are converted to accept decimal values and the time unit is in seconds.

#### Code to Cloud

- Removed Docker annotation support.

##### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha3](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha3%22).

### Ballerina packages

#### Introduced local repository support

- Apart from the Ballerina Central remote repository, you can now push packages to the local repository which can be found at `<user-home>/.ballerina/repositories/local`. Refer to the section on changes to CLI commands for information regarding pushing to the local repository.
- To use a package from the local repository, the 'repository' has to be specified in the TOML table of the relevant dependency in the `Dependencies.toml` file.

E.g., to test a developed package before pushing it to Ballerina Central, build and push it to the local repository using the `push` command and add it to the `Dependencies.toml` file of the depending package as shown below.

```toml
[[dependency]]
org = "ballerinax"
name = "googleapis_sheets"
version = "1.0.0"
repository = "local"
```

### Developer tools

#### CLI

##### Changes to CLI commands

- Build and test commands
  - Support for providing `[(--key=value)...]` is removed from `bal build`. 

- Run command
  - Providing the project path to the run command is now optional. The default source root is the present working directory similar to how the build command works.
  - Program arguments should be followed by the end-of-options delimiter `--`.
- New and init commands
  - Introduced creation of the `Pacakge.md` file for a library template. Passing the `--template lib` flag will create the `Package.md` file in addition to the `Ballerina.toml` file and the source BAL files.
- Push command
  - Introduced pushing to the local repository. Passing `--repository=local` will push the Ballerina archive (.bala) to the local repository. For information about local repository support, see the [Ballerina Packages Changelist](#ballerina-packages).
- Run `bal help <command>` to get more information on the command changes.

- CLI Auto-Completion
  - Installing On Linux Bash
    - Set up auto-completion in the current bash shell.
  
    ```shell
    source <(bal completion bash)
    ```

    - Set up auto-completion permanently in the bash shell.

    ```shell
    echo "source <(bal completion bash)" >> ~/.bashrc
    ```

  - Installing On Mac Bash
    - Set up auto-completion permanently in the bash shell.

    ```shell
    echo "$(bal completion bash)" >> ~/.bash_profile
    ```

#### Test framework

- Moved the Project Test Suite execution to a single JVM. Changed from running each Test Suite in a JVM instance. This improves the user experience when debugging tests. It no longer prompts to debug each test suite of a project.
- Support for seamless integration of CICD tools by adding inbuilt path fixes to the JaCoCo XML generated for Ballerina packages.

#### Debugger

- Added conditional breakpoint support. (Conditional expressions can now be configured for Ballerina breakpoints in the Visual Studio Code Debug view).
- Added support to configure environment variables in the launch mode.
- Added expression evaluation support for type cast expressions.

#### OpenAPI

- Added JSON file generation support to the Ballerina to OpenAPI command.

```shell
bal openapi -i <ballerina file> --json
```

- Added improvements for handling the Ballerina resource method response type in the OpenAPI to Ballerina command.

#### Bindgen tool

- Improved the generated bindings with the use of distinct type classes.
- Improved the internal mechanism used to generate the bindings. Previous handlebars-based implementation is now changed to a syntax-tree-based implementation.

#### Documentation

- Moved the standard library API documentation out to [Ballerina Central Docs](https://docs.central.ballerina.io) from the Ballerina Website.

##### Language Server
- The Ballerina Language Server now supports telemetry-based crash reporting. This was enabled through the LSP protocol's [telemetry events](https://microsoft.github.io/language-server-protocol/specifications/specification-current/#telemetry_event). If you wish to disable Ballerina Telemetry, uncheck the **Ballerina: Enable Telemetry** setting from VSCode.

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha3](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha3%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer).

##### Ballerina Shell

- The Ballerina Shell now supports redefining module-level definitions and variable declarations. 

```ballerina
=$ int i = 3;
=$ string j = "Hi";
=$ string i = "Hello";  // Same variable can be redefined
```

- A new `/remove` command has been introduced to be used from within the Ballerina Shell to remove one or more declarations from the snippet memory.

```ballerina
=$ int i = 3;
=$ string j = "Hi";
=$ /remove i j
=$ i
| error: undefined symbol 'i'
|       i
|       ^
| Compilation aborted due to errors.
```

- Ballerina Shell can now load definitions and declarations from a file. The file to load from can be specified using the `-f` or `--file` command-line options when launching the Ballerina Shell. Alternatively, the `/file` command can also be used for this purpose from within the Shell. 

```bash
$ bal shell -f my_file.bal
```

The `--force-dumb` command-line option will now have only a long option and the short option `-f` is now used to load from a file.

- The Ballerina Shell now supports cyclic type definitions and list binding patterns.

- The Ballerina Shell now preserves qualifiers such as the `final` qualifier of a variable declaration.

##### Debugger

Now, the debugger supports conditional breakpoints. Conditional expressions can be configured for Ballerina breakpoints in the VSCode debug view.

#### Breaking changes
1. `==` and `!=` equality expressions can no longer be used with variables of type `readonly`.
2. Implicit conversion from `xml:Text` to `string` is no longer supported.
