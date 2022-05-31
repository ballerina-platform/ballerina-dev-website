---
layout: ballerina-left-nav-release-notes
title: Swan Lake Alpha2
permalink: /downloads/swan-lake-release-notes/swan-lake-alpha2/
active: swan-lake-alpha2
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-alpha2
---
### Overview of Ballerina Swan Lake Alpha2

This Alpha2 release includes the language features planned for the Ballerina Swan Lake release. Moreover, this release includes improvements and bug fixes to the compiler, runtime, standard library, and developer tooling. This release note lists only the features and updates added after the Alpha1 release of Ballerina Swan Lake.

- [Updating Ballerina](#updating-ballerina)
    - [For existing users](#for-existing-users)
    - [For new users](#for-new-users)
- [Highlights](#highlights)
- [What is new in Ballerina Swan Lake Alpha2](#what-is-new-in-ballerina-swan-lake-alpha2)
    - [Language](#language)
        -  [Support for mapping and error binding patterns in the match statement](#support-for-mapping-and-error-binding-patterns-in-the-match-statement)
    - [Runtime](#runtime)
        - [Support for configurable variables of record and table types](#support-for-configurable-variables-of-record-and-table-types)
        - [Support for decrypting string values using the new config lang library](#support-for-decrypting-string-values-using-the-new-config-lang-library)
    - [Standard library](#standard-library)
        - [HTTP module improvements](#http-module-improvements)
        - [MIME module improvements](#mime-module-improvements)
        - [WebSocket module improvements](#websocket-module-improvements)
        - [GraphQL module improvements](#graphql-module-improvements)
        - [WebSub module improvements](#websub-module-improvements)
        - [WebSubHub module improvements](#websubhub-module-improvements)
        - [IO module improvements](#io-module-improvements)
        - [Email module improvements](#email-module-improvements)
        - [UDP module improvements](#udp-module-improvements)
        - [Crypto module improvements](#crypto-module-improvements)
        - [JWT module improvements](#jwt-module-improvements)
    - [Code to Cloud](#code-to-cloud)
    - [Developer tools](#developer-tools)
        - [Language Server](#language-server)
        - [Debugger](#debugger)
        - [Ballerina Shell REPL - EXPERIMENTAL](#ballerina-shell-repl-experimental)
    - [Breaking changes](#breaking-changes)

### Updating Ballerina

You can use the [update tool](/learn/keeping-ballerina-up-to-date/) to update to Ballerina Swan Lake Alpha2 as follows.

#### For existing users

If you are already using Ballerina, you can directly update your distribution to the Swan Lake channel using the [Ballerina update tool](/learn/keeping-ballerina-up-to-date/). To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **update tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Alpha2.

> `bal dist pull slalpha2`

#### For new users

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Highlights

- Support for mapping and error binding patterns in the `match` statement
- Support for configurable variables of `record` and `table` types
- Support for decrypting string values using the new `lang.config` lang library
- Improvements to the HTTP, MIME, WebSocket, GraphQL, WebSub, WebSubHub, IO, email, UDP, crypto, and JWT standard library modules
- The extension of the Ballerina package distribution file has been changed from `.balo` to `.bala`
- Improvements to developer tools such as the Language Server and debugger

### What is new in Ballerina Swan Lake Alpha2

#### Language

##### Support for mapping and error binding patterns in the match statement

**Mapping binding pattern**

The `match` statement now supports mapping and error binding patterns with `var`.

```ballerina
match v {
    var  {a, b} => {
        // Matches mappings that contain at least the fields `a` and `b`.
        // The values of these fields can be accessed via the variables 
        // `a` and `b` within this block.
        io:println(a);
    }

    var {c: {x: a1, y: a2}, ...rest} => {
        // Matches mappings that have a field `c` where its value is 
        // another mapping that contains at least the fields `x` and `y`.
        // All of the remaining fields (if any) can be accessed via
        // the new variable `rest`.
        int length = rest.length();
    }
}
```

**Error binding pattern**

```ballerina
match v {
    var error(message, error(causeMessage)) => {
        // Matches errors that have a cause. 
        // The messages of the matched error and the cause error
        // can be accessed via the variables `message` and 
        // `causeMessage` within this block.
        io:println(causeMessage);
    }

    var error(a, code = matchedCode) => {
        // Matches errors that have a detail entry with the key `code`.
        // The `code` can be accessed using the `matchedCode` variable 
        // within this block.
        io:println(matchedCode);
    }
}
```

#### Runtime

##### Support for configurable variables of record and table types

**Record type**

Record fields with simple types like `int`, `string`, `boolean`, `float`, `decimal`, and arrays of the respective types are now supported. 

For example, if the `Config.toml` file contains the following TOML table,

```toml
[Pkg.testUserOne]
username = "john"
password = "abcd"
scopes = ["write"]

[Pkg.testUserTwo]
username = "mary"
password = "test123"
```

it can be loaded as configurable variables of a record type as follows.

```ballerina
type AuthInfo record {
    readonly string username;
    string password;
    string[] scopes?;
};

configurable AuthInfo & readonly testUserOne = ?;
configurable AuthInfo & readonly testUserTwo = ?;
```

**Table type**

Ballerina now supports configurable variables of type `table` through TOML arrays of tables.

For example, if the `Config.toml` file contains the following TOML table array,

```toml
[[Pkg.users]]
username = "alice"
password = "password1"
scopes = ["scope1"]

[[Pkg.users]]
username = "bob"
password = "password2"
scopes = ["scope1", "scope2"]

[[Pkg.users]]
username = "jack"
password = "password3"
```

it can be loaded as a configurable variable of a `table` type as follows.

```ballerina
configurable table<AuthInfo> key(username) & readonly users = ?;
```

##### Support for decrypting string values using the new config lang library

The `bal encrypt` command can be used to encrypt plain text values and specify those in the `Config.toml` file. Then, the `config:decryptString()` function can be used to decrypt the configurable value. 

For example, if the `Config.toml` file contains the following encrypted string value,

```toml
password = "@encrypted:{ODYUoKSw0xW31eoxa/s2ESdBNgk1gX77txBIgpLC6NQ=}"
```

it can be decrypted in the Ballerina code as follows.

```ballerina
import ballerina/lang.config;

configurable string password = ?;

public function main() {
    string decryptedPassword = config:decryptString(password);
}
```

#### Standard library

##### HTTP module improvements

###### Introduced byte stream manipulation functions to the request and response 

This introduction enables manipulating the payload as a stream of `byte[]`. The `setByteStream()` and `getByteStream()` methods use the Ballerina stream feature.

```ballerina
http:Request request = new;
io:ReadableByteChannel byteChannel = check io:openReadableFile("path/to/file.tmp");
stream<io:Block, io:Error> byteStream = check byteChannel.blockStream(8196);
request.setByteStream(byteStream);

http:Response response = new;
stream<byte[], io:Error>|error str = response.getByteStream();
```

###### Introduced the `http:Header` annotation to bind headers in an inbound request

With the introduction of the `@http:Header` annotation, inbound request headers can be retrieved by binding them to a resource method parameter. Individual headers can be accessed as `string` or `string[]` types while a parameter of type `http:Headers` can be used to access all headers. 

```ballerina
service on helloEP {
    resource function get hello(@http:Header {name: "Accept"} string? acceptHeader, http:Headers allHeaders) {
    //...
    }
}
```

##### MIME module improvements

###### Introduced byte stream manipulation methods to the `mime:Entity` class

This introduction enables manipulating the entity body as a stream of `byte[]`.

```ballerina
function setByteStream(stream<byte[], io:Error> byteStream, string contentType = "application/octet-stream")

function getByteStream(int arraySize = 8196) returns stream<byte[], io:Error>|mime:ParserError

function getBodyPartsAsStream(int arraySize = 8196) returns stream<byte[], io:Error>|mime:ParserError

```

#### WebSocket module improvements

Introduced the Sync client. This is the primary client of the WebSocket module. This client is capable of reading and writing messages synchronously.

**Reading and writing text messages**

```ballerina
websocket:Client wsClient = check new ("ws://echo.websocket.org");
var err = wsClient->writeTextMessage("Text message");
string textResp = check wsClient->readTextMessage();
```

**Reading and writing binary messages**

```ballerina
websocket:Client wsClient = check new ("ws://echo.websocket.org");
var err = wsClient->writeBinaryMessage("Binary message".toBytes());
byte[] byteResp = check wsClient->readBinaryMessage();
```

##### GraphQL module improvements

Ballerina GraphQL listeners can now be configured using the same configurations as the listener configurations in `http:Listener`. Additionally, a GraphQL service can be secured by defining a `maxQueryDepth` as an annotation to restrict the depth of a query before execution.

```ballerina
import ballerina/graphql;

graphql:ListenerConfiguration configs = {
    // http listener configurations
};
listener graphql:Listener graphqlListener = new (9090, configs);

@graphql:ServiceConfiguration {maxQueryDepth: 3}
service /graphql on graphqlListener {
    // Service definition
}
```

##### WebSub module improvements

Included functionality to the `websub:SubscriberService` to respond with user-defined custom payloads/header parameters in error scenarios.

```ballerina
import ballerina/websub;

listener websub:Listener subscriberListener = new (9001);

service /subscriber on subscriberListener {
    remote function onSubscriptionValidationDenied(websub:SubscriptionDeniedError msg) returns websub:Acknowledgement? {
        websub:Acknowledgement ack = {
            headers: {
                "Content-Encoding": "gzip"
            },
            body: {
                "message": "Successfully processed request"
            }
        };
        return ack;
    }

    remote function onSubscriptionVerification(websub:SubscriptionVerification msg) returns 
            websub:SubscriptionVerificationSuccess|websub:SubscriptionVerificationError {
        if (msg.hubTopic == "https://www.sample.topic") {
            return error websub:SubscriptionVerificationError("Hub topic not supported", 
                                                              headers = {"Content-Encoding": "gzip"}, 
                                                              body = {"message": "Hub topic not supported"});
        } else {
            return {};
        }
    }

    remote function onEventNotification(websub:ContentDistributionMessage event) returns websub:Acknowledgement|
            websub:SubscriptionDeletedError? {
        return error websub:SubscriptionDeletedError("Subscriber wants to unsubscribe", 
                                                     headers = {"Content-Encoding": "gzip"}, 
                                                     body = {"message": "Unsubscribing from the topic"});
    }
}
```

##### WebSubHub module improvements

Included functionality to the `websubhub:Service` to respond with user-defined custom payloads/header parameters in error scenarios.

```ballerina
import ballerina/websubhub;

service /websubhub on new websubhub:Listener(9091) {
    remote function onRegisterTopic(websubhub:TopicRegistration message) 
            returns websubhub:TopicRegistrationSuccess|websubhub:TopicRegistrationError {
        if (message.topic == "https://sub.topic.com") {
            websubhub:TopicRegistrationSuccess successResult = {body: <map<string>>{isSuccess: "true"}};
            return successResult;
        } else {
            return error websubhub:TopicRegistrationError("Topic registration failed!", 
                        headers = {"Content-Encoding": "gzip"}, 
                        body = {"hub.additional.details": "Feature is not supported in the hub"});
        }
    }

    // Other remote methods...
}
```

##### IO module improvements

Introduce a parameter of type `XmlWriteOptions` to specify the entity type and the document type declaration.

```ballerina
public function fileWriteXml(@untainted string path, xml content, *XmlWriteOptions xmlOptions, FileWriteOption fileWriteOption = 
                             OVERWRITE) returns Error? {
}
```
**Example**

```ballerina
import ballerina/io;

public function main() returns error? {
    xml content = xml `<note>
        <to>Tove</to>
        <from>Jani</from>
        <heading>Reminder</heading>
        <body>Don't forget me this weekend!</body>
        </note>`;
    string publicId = "-//W3C//DTD HTML 4.01 Transitional//EN";
    string systemId = "http://www.w3.org/TR/html4/loose.dtd";
    var writeResult = io:fileWriteXml("./xmlFileWithDoc.xml", content, doctype = {
        system: systemId,
        'public: publicId
    });
}
```

**Output**
```xml
<!DOCTYPE note PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<note>
    <to>Tove</to>
    <from>Jani</from>
    <heading>Reminder</heading>
    <body>Don't forget me this weekend!</body>
</note>
```
##### Email module improvements

- Make the `body` field of the `email:Message` record optional. This enables sending an email with only the `htmlBody` field set without a text-typed `body` field.

- Add `mime:Entity` type to the union type of the `attachments` field in the `email:Message` record. That enables attaching a single MIME Entity as an attachment. This `email:Message` record change would appear as follows.

```ballerina
public type Message record {|
    // ... other fields
    mime:Entity|Attachment|(mime:Entity|Attachment)[] attachments?;
|};
```

- The above-mentioned changes related to the `body` and `attachments` fields are updated in the `email:Options` record as given below in order to facilitate the same in the `sendEmail` method in the `email:SmtpClient`.

```ballerina
public type Options record {|
    // ... other fields
    string body?;
    mime:Entity|Attachment|(mime:Entity|Attachment)[] attachments?;
|};
```

- Remove the `properties` field representing custom properties from all Email module related configuration records: `email:SmtpConfig`, `email:PopConfig`, `email:ImapConfig`, `email:PopListenerConfig`, and `email:ImapListenerConfig`.

- The `mail.smtp.ssl.checkserveridentity` custom property was passed as an entry in the `properties` to enable/disable the server certificate’s hostname verification. As the `properties` field is removed from the API, from this release onwards, the `verifyHostName` boolean field is introduced to the `secureSocket` record for all the configurations related to the Email module. 

This `email:SecureSocket` record change would appear as follows.

```ballerina
public type SecureSocket record {|
    // ... other fields
    boolean verifyHostname = true;
|};
```

##### UDP module improvements

- The `sendDatagram` method will now send multiple datagrams if the size of the `byte[]` value provided as the `data` field of the datagram exceeds 8KB.

- Returning `Datagram` from the `onDatagram` or `onBytes` remote methods also sends multiple datagrams if the size of the `byte[]` value provided (as the `data` field of the datagram) exceeds 8KB.

##### Crypto module improvements

Added support to decode private keys from `.key` files and public keys from `.cert` files and updated the APIs for decoding private/public keys. This enables reading private/public keys from PEM files.

##### JWT module improvements

Extended the private key support for JWT signature generation and public cert support for JWT signature validation.

##### Log module improvements

Introduced a configuration in the log module to set the output format to JSON. You need to add the entry below in the `Config.toml` file to set the output format to JSON.

```toml
[log]
format = "json"
```

#### Code to Cloud

- The `Kubernetes.toml` file is renamed to `Cloud.toml`. 
- The `--cloud=docker` build option is implemented. This will build the Dockerfile and Docker image without generating the Kubernetes artifacts.


#### Developer tools

##### Language Server

Implemented renaming support in the Language Server. Now, VSCode users are able to select a symbol and rename all occurrences within the same module as well as across modules.

##### Debugger

Added variable paging support. With this feature, the Ballerina variables, which contain a large number of child variables will be shown in a paged view in the debug variable presentation.

##### Ballerina Shell REPL [EXPERIMENTAL]

- Fixed the REPL expression output to output the `toBalString()` result.
- Improved the REPL parser to support some partial snippets such as the example cases below.
	-  Template strings will allow continuing on new lines.
	- The CLI will wait for more input if the last character was an operator.
	- The CLI will not wait for unclosed double quotes.
- Enabled REPL to exit on `Ctrl+D`.

#### Breaking changes

- Member access on a value of type `table` now returns `()` if the `table` does not contain a member with the specified key. Otherwise, the result is the member in the `table` value with the given key.

```ballerina
import ballerina/io;

type Employee record {
    readonly string name;
    int id;
};

public function main() {
    table<Employee> key(name) employeeTable = table [
        {name: "Mike", id: 1234},
        {name: "John", id: 4567}
    ];
    Employee? emp1 = employeeTable["John"];
    io:println(emp1); // {"name":"John","id":4567}
    Employee? emp2 = employeeTable["Kate"];
    io:println(emp2 is ()); // true
}
```

- Iterating over `xml` in a `from` clause in query expressions now returns `xml` and iterating over `xml<T>` returns `T`.

```ballerina
import ballerina/io;

public function main() {
    xml authorList = xml `<authorList>
                            <author>
                                <name>Sir Arthur Conan Doyle</name>
                                <country>UK</country>
                            </author>
                            <author>
                                <name>Dan Brown</name>
                                <country>US</country>
                            </author>
                        </authorList>`;
    xml authors = from xml y in authorList/<author>/<name>
                  select y;
    io:println(authors); //<name>Sir Arthur Conan Doyle</name><name>Dan Brown</name>
}
```

- Variables of types `readonly` and `value:Cloneable` cannot be assigned to `any` since they may contain values of type `error`.
