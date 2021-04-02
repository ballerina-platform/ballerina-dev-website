---
layout: ballerina-blank-page
title: Release Note
---
### Overview of Ballerina Swan Lake Alpha4

<em>This is the fourth Alpha release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Alpha 3 release.

- [Updating Ballerina](#updating-ballerina)
- [Installing Ballerina](#installing-ballerina)
- [Highlights](#highlights)
- [Language Updates](#language-updates)
- [Runtime Updates](#runtime-updates)
- [Standard Library Updates](#standard-library-updates)
- [Code to Cloud Updates](#code-to-cloud-updates)
- [Developer Tools Updates](#developer-tools-updates)
- [Ballerina Packages Updates](ballerina-packages-updates)
- [Breaking Changes](#breaking-changes)

### Updating Ballerina

If you are already using Ballerina, you can use the [Update Tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Alpha4 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **Update Tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Alpha4.

> `bal dist pull slalpha3`

### Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Highlights

### Language Updates

#### New Features

##### Relational Expressions With All Ordered Types

Relational expressions (`<`, `>`, `<=`, and `>=`) are supported with all [ordered types](https://ballerina.io/spec/lang/draft/v2020-12-17/#ordering). The static type of both operands must belong to the same ordered type.

##### Inferring the Argument of a Dependently-Typed Function from the Contextually-Expected Type

When the default value of a `typedesc` parameter of a dependently-typed function is `<>` and an argument is not provided for the parameter when calling the function, the argument will be inferred from the contextually-expected type of the function call.
```ballerina
function func(typedesc<anydata> td = <>) returns td = external;

public function main() {
    // The argument for `td` is inferred to be `int`.
    int value = func();
}
```

#### Improvements

##### Improvements to Dependently-Typed Lang Library Functions to Infer the Argument from the Contextually-Expected Type

The `lang:value:ensureType` lang library function is now dependently-typed.

The `typedesc` argument of the `lang.value:cloneWithType`, `lang.value:fromJsonWithType`, `lang.value:fromJsonStringWithType`, and `lang.value:ensureType` dependently-typed lang library functions will be inferred from the contextually-expected type if it is not passed as an argument.

```ballerina
import ballerina/io;

type Person record {|
    string name;
    int age;
|};

public function main() {
    map<anydata> anydataMap = {name: "Amy", age: 30};

    // The `typedesc` argument is inferred to be `Person`
    // based on the contextually expected type.
    Person|error result = anydataMap.cloneWithType();
    io:println(result is Person); // Prints `true`.
}
```

##### Improvements to the Return Type of `lang.value:cloneReadOnly`

The return type of the `lang.value:cloneReadOnly` lang library function has been changed from the type of the value (`T`) to the intersection of the type and `readonly` (`T & readonly`).

```ballerina
type Person record {|
    string name;
    int age;
|};

public function main() {
    Person mutablePerson = {name: "Amy", age: 30};

    // The result of `cloneReadOnly()` can be directly assigned
    // to a variable of type `Person & readonly`.
    Person & readonly immutablePerson = mutablePerson.cloneReadOnly();
}
```

##### Changes to the Return Types of `lang.value:fromJsonFloatString` and `lang.value:fromJsonDecimalString`

The return types of the `lang.value:fromJsonFloatString` and `lang.value:fromJsonDecimalString` lang library functions have been changed from `json` to `lang.value:JsonFloat` and `lang.value:JsonDecimal` respectively.

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake <VERSION>](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

### Runtime Updates

#### New Features

##### Support for providing values for configurable variables with Command Line arguments

Configurable values can be provided with the built-in command-line option `-C`.

```
-Ckey=value
```

Key syntax:

```
key:= [[org-name .] module-name .] variable
```

Command-line arguments are supported for configurable variables with boolean, int, float, decimal, string, and XML types.

Example usages:

```ballerina
configurable int port = ?;
```

If the configurable variable is defined in the default module or if we are using a single Ballerina file.

```
bal run -- -Cport=9090
bal run program.bal -- -Cport=9090
java -jar executable.jar -Cport=9090 
```

If the configurable variable is defined in a different module of the same organization.

```
bal run -- -Cmodule-name.port=9090
java -jar executable.jar -Cmodule-name.port=9090 
```

If the configurable variable is defined in a module of a different organization.

```
bal run -- -Corg-name.module-name.port=9090 
java -jar executable.jar -Corg-name.module-name.port=9090 
```

##### Support for locating multiple toml files

Configurable values can be provided in multiple TOML files using the `BAL_CONFIG_FILES` environment variable.

The file locations can be specified in the environment variable using an OS-specific separator. The precedence order
 will be determined by the order in which the files are specified in the environment variable. If such an environment variable is not specified, the file located in the current directory with the file name `Config.toml` will be used.

##### Support for Providing TOML Content Through the Environment Variable

The configurable values can be provided using the `BAL_CONFIG_DATA` environment variable in which the content is
 expected to be in the TOML (v0.4) format.

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake <VERSION>](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

### Standard Library Updates

#### New Features

##### Time Package

- Introduced the following APIs to support email-typed string conversions:
    - Converts a given UTC to an email string.
        ```ballerina
        import ballerina/time; 
             
        string emailFormattedString = time:utcToEmailString(time:utcNow());
        ```
    - Converts a given Civil to an email string.
        ```ballerina
        import ballerina/time; 
       
        time:Civil civil = check time:civilFromString("2021-04-12T23:20:50.520+05:30[Asia/Colombo]");
        string|time:Error emailDateTime = time:civilToEmailString(civil, "GMT");
        ```
    - Converts a given email string to Civil.
        ```ballerina
        import ballerina/time; 
       
        time:Civil|time:Error emailDateTime = time:civilFromEmailString("Wed, 10 Mar 2021 19:51:55 -0820");
        ```
      
#### Improvements

##### I/O Package

- Improved the print APIs to support string templates.
```ballerina
import ballerina/io;
string val = "John";
io:println(`Hello ${val}!!!`);
io:print(`Hello ${val}!!!`);
```
- Changed streaming APIs to be completed from `nil` return. 

##### MySQL Package

- Changed the previous SSLConfig Record to SecureSocket Record.
```ballerina
public type SecureSocket record {|
    SSLMode mode = SSL_PREFERRED;
    crypto:KeyStore key?;
    crypto:TrustStore cert?;
|};
```

- Changed the SSLMode value from `SSL_VERIFY_CERT` to `SSL_VERIFY_CA`.

##### Xmldata Package

- API to convert a JSON to an XML has been supported by the `nil` return value.
```ballerina
import ballerina/xmldata;
json data = {
    name: "John"
};
xml?|Error x = xmldata:fromJson(data);
```

#### Renamed the `java.arrays` Package

The `java.arrays` package’s org and package names were renamed as `ballerina` and `jballerina.java.arrays`. 
```ballerina
import ballerina/jballerina.java.arrays;
handle secondWord = arrays:get(input, 1);
```

##### WebSub Package Updates

 - Add pre-built constants for WebSub common-responses.
```ballerina
   @websub:SubscriberServiceConfig {
        target: ["https://sample.hub", "https://sample.topic.one"], 
        leaseSeconds: 36000,
        secret: "secretKey"
    } 
    service /subscriber on new websub:Listener(9090) {
        remote function onSubscriptionValidationDenied(websub:SubscriptionDeniedError msg) 
                       returns websub:Acknowledgement? {
            // implement subscription validation denied logic here
            return websub:ACKNOWLEDGEMENT;
        }

        remote function onSubscriptionVerification(websub:SubscriptionVerification msg)
                        returns websub:SubscriptionVerificationSuccess|websub:SubscriptionVerificationError {
            // implement subscription intent verification logic here
            return websub:SUBSCRIPTION_VERIFICATION_SUCCESS;
        }

        remote function onEventNotification(websub:ContentDistributionMessage event) 
                        returns websub:Acknowledgement|websub:SubscriptionDeletedError? {
            // implement on event notification logic here
            return websub:ACKNOWLEDGEMENT;
        }
    }

```
##### Kafka Package Updates
 - SecureSocket record is updated.
 - kafka:Producer, kafka:Consumer and kafka:Listener init updated.
```ballerina
kafka:Producer kafkaProducer = check new(kafka:DEFAULT_URL, config);
kafka:Producer kafkaProducer = check new (bootstrapServers=”localhost:9092”);
kafka:Producer kafkaProducer = check new(”localhost:9092”);
// Same for listener and consumer initialization
```
##### NATS Package Updates
 - Client and listener init updated.
```ballerina
nats:Client client = check new(url=”http://google.com:9090”, ssl=config);
nats:Client client = check new(nats:DEFAULT_URL);
nats:Client client = check new(”http://google.com:9090”);
// Same for listener initialization
```
##### STAN Package Updates
 - Client and listener init updated.
```ballerina
stan:Client client = check new(url=”http://localhost:9090”);
nats:Client client = check new(nats:DEFAULT_URL);
// Same for listener initialization
```
##### RabbitMQ Package Updates
 - Client and listener init updated.
```ballerina
rabbitmq:Client client = check new(host=”localhost”, port=9090);
rabbitmq:Client client = check new(rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);
rabbitmq:Client client = check new(”localhost”, 9090);
// Same for listener initialization
```

##### Security Updates
 - Removed encrypted passwords and hashed passwords support for Basic Auth file user store authentication.

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake <VERSION>](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Alpha4%22+label%3AType%2FBug).

### Code to Cloud Updates

#### New Features

#### Improvements

#### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake <VERSION> of the repositories below.

- [C2C](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22)
- [Docker](https://github.com/ballerina-platform/module-ballerina-docker/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22)
- [AWS Lambda](https://github.com/ballerina-platform/module-ballerinax-aws.lambda/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22)
- [Azure Functions](https://github.com/ballerina-platform/module-ballerinax-azure.functions/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22) 

### Developer Tools Updates

#### Language Server 

To view bug fixes, see the [GitHub milestone for Swan Lake <VERSION>](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer).

#### New Features

#### Improvements

#### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake <VERSION> of the repositories below.

- [Language](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FDevTools)
- [Update Tool](https://github.com/ballerina-platform/ballerina-update-tool/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+project%3Aballerina-platform%2F32)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha%22) 

#### Ballerina Packages Updates

### Breaking Changes

- A compilation error occurs if the inferred type of an unused variable that is declared with `var` includes a subtype of the `error` type.
- The `error<*>` syntax has been removed.
- Relational expressions are no longer supported with numeric values when the static types of the operands belong to different ordered types.
- The `lang.array:indexOf` and `lang.array:lastIndexOf` lang library functions cannot be used with values that do not belong to `anydata`.
- An object used as the iterable value in a `foreach` statement, `from` clause, or `join` clause  must be a subtype of `object:Iterable`.
- The `RawTemplate` type is now a distinct type.
- The filler value of the `decimal` type is now `+0d`.
- Completion type `C` in `stream<T, C>` has been changed from `error|never` to `error?`. `stream<T>` is equivalent to `stream<T, ()>`. `stream<T>` and `stream<T, error>` are assignable to `stream<T, error?>`.
- Annotations with the `service` attach point cannot be used with service classes.
- Checking keywords (`check` and `checkpanic`) are allowed in a statement only if the statement is a call statement (i.e., when the expression is a function or method call).
- The precedence of the `trap` expression has been lowered.
