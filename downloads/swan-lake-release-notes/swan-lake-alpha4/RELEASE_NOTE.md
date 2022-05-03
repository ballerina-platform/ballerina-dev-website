---
layout: ballerina-left-nav-release-notes
title: Swan Lake Alpha4 
permalink: /downloads/swan-lake-release-notes/swan-lake-alpha4/
active: swan-lake-alpha4
redirect_from:
    - /downloads/release-notes/swan-lake-alpha4
---
### Overview of Ballerina Swan Lake Alpha4

<em>This is the fourth Alpha release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Alpha3 release.

- [Updating Ballerina](#updating-ballerina)
- [Installing Ballerina](#installing-ballerina)
- [Language Updates](#language-updates)
- [Runtime Updates](#runtime-updates)
- [Standard Library Updates](#standard-library-updates)
- [Developer Tools Updates](#developer-tools-updates)
- [Observability Updates](#observability-updates)

### Updating Ballerina

If you are already using Ballerina, you can use the [update tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Alpha4 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **update tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Alpha4.

> `bal dist pull slalpha4`

### Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Language updates

#### New features

##### Relational expressions with all ordered types

Relational expressions (`<`, `>`, `<=`, and `>=`) are supported with all [ordered types](https://ballerina.io/spec/lang/draft/v2020-12-17/#ordering). The static type of both operands must belong to the same ordered type.

##### Inferring the argument of a dependently-typed function from the contextually-expected type

When the default value of a `typedesc` parameter of a dependently-typed function is `<>` and an argument is not provided for the parameter when calling the function, the argument will be inferred from the contextually-expected type of the function call.

```ballerina
function func(typedesc<anydata> td = <>) returns td = external;

public function main() {
    // The argument for `td` is inferred to be `int`.
    int value = func();
}
```

#### Improvements

##### Improvements to dependently-typed lang library functions to infer the argument from the contextually-expected type

- The `lang:value:ensureType` lang library function is now dependently-typed.

- The `typedesc` argument of the `lang.value:cloneWithType`, `lang.value:fromJsonWithType`, `lang.value:fromJsonStringWithType`, and `lang.value:ensureType` dependently-typed lang library functions will be inferred from the contextually-expected type if it is not passed as an argument.

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

##### Improvements to the return type of `lang.value:cloneReadOnly`

Changed the return type of the `lang.value:cloneReadOnly` lang library function from the type of the value (`T`) to the intersection of the type and `readonly` (`T & readonly`).

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

##### Changes to the return types of `lang.value:fromJsonFloatString` and `lang.value:fromJsonDecimalString`

Changed the return types of the `lang.value:fromJsonFloatString` and `lang.value:fromJsonDecimalString` lang library functions from `json` to `lang.value:JsonFloat` and `lang.value:JsonDecimal` respectively.

#### Breaking changes

- A compilation error occurs if the inferred type of an unused variable that is declared with `var` includes a subtype of the `error` type.
- Removed the `error<*>` syntax.
- Removed support for relational expressions with numeric values when the static types of the operands belong to different ordered types.
- The `lang.array:indexOf` and `lang.array:lastIndexOf` lang library functions cannot be used with values that do not belong to `anydata`.
- An object used as the iterable value in a `foreach` statement, `from` clause, or `join` clause must be a subtype of `object:Iterable`.
- The `RawTemplate` type is distinct now.
- The filler value of the `decimal` type is now `+0d`.
- Changed the completion type `C` in `stream<T, C>` from `error|never` to `error?`. `stream<T>` is equivalent to `stream<T, ()>`. `stream<T>` and `stream<T, error>` are assignable to `stream<T, error?>`.
- Annotations with the `service` attach point cannot be used with service classes.
- Checking keywords (`check` and `checkpanic`) are allowed in a statement only if the statement is a call statement (i.e., when the expression is a function or method call).
- Lowered the precedence of the `trap` expression.

#### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha4](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

### Runtime updates

#### New features

##### Providing values for configurable variables via command-line arguments

Configurable values can be provided with the built-in command-line option `-C`.

```bash
-Ckey=value
```

**Key syntax:**

```bash
key:= [[org-name .] module-name .] variable
```

Command-line arguments are supported for configurable variables with `boolean`, `int`, `float`, `decimal`, `string`, and `xml` types.

```ballerina
configurable int port = ?;
```

**Example usages:**

- If the configurable variable is defined in the default module or if a single Ballerina file is being used:

    ```bash
    bal run -- -Cport=9090
    bal run program.bal -- -Cport=9090
    java -jar executable.jar -Cport=9090 
    ```

- If the configurable variable is defined in a different module of the same organization:

    ```bash
    bal run -- -Cmodule-name.port=9090
    java -jar executable.jar -Cmodule-name.port=9090 
    ```

- If the configurable variable is defined in a module of a different organization.

    ```bash
    bal run -- -Corg-name.module-name.port=9090 
    java -jar executable.jar -Corg-name.module-name.port=9090 
    ```

##### Locating multiple TOML files

Configurable values can be provided in multiple TOML files using the `BAL_CONFIG_FILES` environment variable.

The file locations can be specified in the environment variable using an OS-specific separator. The precedence order will be determined by the order in which the files are specified in the environment variable. If such an environment variable is not specified, the file located in the current directory with the file name `Config.toml` will be used.

##### Providing TOML content via environment variables

The configurable values can be provided using the `BAL_CONFIG_DATA` environment variable in which the content is expected to be in the TOML (v0.4) format.

#### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha4](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

### Standard library updates
      
#### Improvements

##### `time` package 

Introduced the following APIs to support email-typed string conversions:

- Converts a given UTC to an email string.

```ballerina
import ballerina/time; 
             
string emailFormattedString = time:utcToEmailString(time:utcNow());
```

- Converts a given `time:Civil` to an email string.

```ballerina
import ballerina/time; 
       
time:Civil civil = check time:civilFromString("2021-04-12T23:20:50.520+05:30[Asia/Colombo]");
string|time:Error emailDateTime = time:civilToEmailString(civil, "GMT");
```

- Converts a given email string to `time:Civil`.

```ballerina
import ballerina/time; 
       
time:Civil|time:Error emailDateTime = time:civilFromEmailString("Wed, 10 Mar 2021 19:51:55 -0820");
```

##### `io` package 

- Improved the print APIs to support string templates.

```ballerina
import ballerina/io;
string val = "John";
io:println(`Hello ${val}!!!`);
io:print(`Hello ${val}!!!`);
```

- Changed streaming APIs to be completed from `nil` return. 

##### `mysql` package

- Changed the previous `SSLConfig` Record to `SecureSocket` Record.

```ballerina
public type SecureSocket record {|
    SSLMode mode = SSL_PREFERRED;
    crypto:KeyStore key?;
    crypto:TrustStore cert?;
|};
```

- Changed the SSLMode value from `SSL_VERIFY_CERT` to `SSL_VERIFY_CA`.

##### `xmldata` package 

Updated the API to convert a JSON to an XML to be supported by the `nil` return value.

```ballerina
import ballerina/xmldata;
json data = {
    name: "John"
};
xml?|Error x = xmldata:fromJson(data);
```

##### `java.arrays` package 

Renamed the `java.arrays` package’s org and package names as `ballerina` and `jballerina.java.arrays`. 

```ballerina
import ballerina/jballerina.java.arrays;
handle secondWord = arrays:get(input, 1);
```

##### `websub` package 

Added pre-built constants for WebSub common-responses.

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

##### `kafka` package 

- Updated the `SecureSocket` record.

- Updated the `init` methods of the `kafka:Producer`, `kafka:Consumer`, and `kafka:Listener` classes.

```ballerina
kafka:Producer kafkaProducer = check new(kafka:DEFAULT_URL, config);
kafka:Producer kafkaProducer = check new (bootstrapServers=”localhost:9092”);
kafka:Producer kafkaProducer = check new(”localhost:9092”);
// Same for listener and consumer initialization
```

##### `nats` package 

Updated the `init` methods of the client and listener.

```ballerina
nats:Client client = check new(url=”http://google.com:9090”, ssl=config);
nats:Client client = check new(nats:DEFAULT_URL);
nats:Client client = check new(”http://google.com:9090”);
// Same for listener initialization
```

##### `stan` package 

Updated the `init` methods of the client and listener.

```ballerina
stan:Client client = check new(url=”http://localhost:9090”);
nats:Client client = check new(nats:DEFAULT_URL);
// Same for listener initialization
```

##### `rabbitmq` package 

Updated the  `init` methods of the client and listener.

```ballerina
rabbitmq:Client client = check new(host=”localhost”, port=9090);
rabbitmq:Client client = check new(rabbitmq:DEFAULT_HOST, rabbitmq:DEFAULT_PORT);
rabbitmq:Client client = check new(”localhost”, 9090);
// Same for listener initialization
```

#### Security updates

Removed encrypted passwords and hashed passwords support for Basic Auth file user store authentication.

#### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha4](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Alpha4%22+label%3AType%2FBug).

### Developer tools updates

#### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Alpha4 of the repositories below.

- [Language](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FDevTools)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22) 

#### Language server 

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha4](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha4%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer).

### Observability updates

- Introduced the open-telemetry standard for Ballerina tracing instead of open-tracing
- Updated the Jaeger extension to support open-telemetry



