# Specification: Ballerina WebSocket Library

_Owners_: @shafreenAnfar @bhashinee  
_Reviewers_: @shafreenAnfar  
_Created_: 2021/12/09  
_Updated_: 2022/05/05  
_Edition_: Swan Lake  

## Introduction

This is the specification for the WebSocket standard library of [Ballerina language](https://ballerina.io/), which provides WebSocket client-server functionalities.

The WebSocket library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Listener](#2-listener)
    * 2.1. [Listener Configurations](#21-listener-configurations)
    * 2.2. [Initialization](#22-initialization)
3. [Service Types](#3-service-types)
    * 3.1. [UpgradeService](#31-upgradeservice)
        * 3.1.1. [UpgradeService Configurations](#311-upgradeservice-configurations)
    * 3.2. [WebSocket Service](#32-websocket-service)
        * 3.2.1. [Remote methods associated with WebSocket Service](#321-remote-methods-associated-with-websocket-service)
            * [onOpen](#onopen)
            * [onTextMessage](#ontextmessage)
            * [onBinaryMessage](#onbinarymessage)
            * [onMessage](#onmessage)
            * [onPing and onPong](#onping-and-onpong)
            * [onIdleTimeout](#onidletimeout)
            * [onClose](#onclose)
            * [onError](#onerror)
4. [Client](#4-client)
    * 4.1. [Client Configurations](#41-client-configurations)
    * 4.2. [Initialization](#42-initialization)
    * 4.3. [Send and receive messages using the Client](#43-send-and-receive-messages-using-the-client)
        * [writeTextMessage](#writetextmessage)
        * [writeBinaryMessage](#writebinarymessage)
        * [readTextMessage](#readtextmessage)
        * [readBinaryMessage](#readbinarymessage)
        * [readMessage](#readmessage)
        * [close](#close)
        * [ping](#ping)
        * [pong](#pong)
        * [onPing and onPong remote methods](#onping-and-onpong-remote-methods)
5. [Securing the WebSocket Connections](#5-securing-the-websocket-connections)
    * 5.1. [SSL/TLS](#51-ssl-tls)
    * 5.2. [Authentication and Authorization](#52-authentication-and-authorization)
6. [Samples](#6-samples)

## 1. [Overview](#1-overview)

WebSocket is a protocol that allows a long held full-duplex connection between a server and client. This specification elaborates on how Ballerina language provides a tested WebSocket client and server implementation that is compliant with the [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455.html).

## 2. [Listener](#2-listener)

The WebSocket listener can be constructed with a port or an http:Listener. When initiating the listener it opens up the port and attaches the upgrade service at the given service path. It is also worth noting that upgrade service is quite similar to an HTTP service.

### 2.1. [Listener Configurations](#21-listener-configurations)

When initializing the listener, following configurations can be provided,
```ballerina
# Provides a set of configurations for HTTP service endpoints.
#
# + host - The host name/IP of the endpoint
# + http1Settings - Configurations related to HTTP/1.x protocol
# + secureSocket - The SSL configurations for the service endpoint. This needs to be configured in order to
#                  communicate through WSS.
# + timeout - Period of time in seconds that a connection waits for a read/write operation in the
#                     initial upgrade request. Use value 0 to disable timeout
# + server - The server name which should appear as a response header
# + webSocketCompressionEnabled - Enable support for compression in WebSocket
# + requestLimits - Configurations associated with inbound request size limits
public type ListenerConfiguration record {|
    string host = "0.0.0.0";
    ListenerHttp1Settings http1Settings = {};
    ListenerSecureSocket secureSocket?;
    decimal timeout = 120;
    string? server = ();
    boolean webSocketCompressionEnabled = true;
    RequestLimitConfigs requestLimits = {};
|};
```

`ListenerHttp1Settings` record contains the settings related to HTTP/1.x protocol. This is an included record from the HTTP package, and this will only be applicable to the initial WebSocket upgrade request.
```ballerina
# Provides settings related to HTTP/1.x protocol.
public type ListenerHttp1Settings record {|
    *http:ListenerHttp1Settings;
|};
```

The actual `ListenerHttp1Settings` record in the HTTP package contains the following fields.

```ballerina
# Provides settings related to HTTP/1.x protocol.
#
# + keepAlive - Can be set to either `KEEPALIVE_AUTO`, which respects the `connection` header, or `KEEPALIVE_ALWAYS`,
#               which always keeps the connection alive, or `KEEPALIVE_NEVER`, which always closes the connection
# + maxPipelinedRequests - Defines the maximum number of requests that can be processed at a given time on a single
#                          connection. By default 10 requests can be pipelined on a single connection and user can
#                          change this limit appropriately.
public type ListenerHttp1Settings record {|
    KeepAlive keepAlive = KEEPALIVE_AUTO;
    int maxPipelinedRequests = MAX_PIPELINED_REQUESTS;
|};
```

`ListenerSecureSocket` record contains configurations related to enabling SSL/TLS on the listener side, and it is an included record from the HTTP package. More details and examples of how to configure them can be found in a following section on `Securing the WebSocket Connections`.
```ballerina
# Configures the SSL/TLS options to be used for WebSocket service.
public type ListenerSecureSocket record {|
    *http:ListenerSecureSocket;
|};
```

The actual `ListenerSecureSocket` record in the HTTP package contains the following fields.
```ballerina
# Configures the SSL/TLS options to be used for HTTP service.
#
# + key - Configurations associated with `crypto:KeyStore` or combination of certificate and (PKCS8) private key of the server
# + mutualSsl - Configures associated with mutual SSL operations
# + protocol - SSL/TLS protocol related options
# + certValidation - Certificate validation against OCSP_CRL, OCSP_STAPLING related options
# + ciphers - List of ciphers to be used
#             eg: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
# + shareSession - Enable/Disable new SSL session creation
# + handshakeTimeout - SSL handshake time out
# + sessionTimeout - SSL session time out
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
        CertValidationType 'type = OCSP_STAPLING;
        int cacheSize;
        int cacheValidityPeriod;
    |} certValidation?;
    string[] ciphers = ["TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256", "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256",
                        "TLS_DHE_RSA_WITH_AES_128_CBC_SHA256", "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA",
                        "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA", "TLS_DHE_RSA_WITH_AES_128_CBC_SHA",
                        "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
                        "TLS_DHE_RSA_WITH_AES_128_GCM_SHA256"];
    boolean shareSession = true;
    decimal handshakeTimeout?;
    decimal sessionTimeout?;
|};
```

`RequestLimitConfigs` record represents configurations related to maximum sizes of URI, headers and entity body which is also an included record from the hTTP package as this will only be applicable to the initial WebSocket upgrade request.
```ballerina
# Provides inbound request URI, total header and entity body size threshold configurations.
public type RequestLimitConfigs record {|
    *http:RequestLimitConfigs;
|};
```

The actual `RequestLimitConfigs` record in the HTTP package contains the following fields.
```ballerina
# Provides inbound request URI, total header and entity body size threshold configurations.
#
# + maxUriLength - Maximum allowed length for a URI. Exceeding this limit will result in a `414 - URI Too Long`
#                  response
# + maxHeaderSize - Maximum allowed size for headers. Exceeding this limit will result in a
#                   `431 - Request Header Fields Too Large` response
# + maxEntityBodySize - Maximum allowed size for the entity body. By default it is set to -1 which means there
#                       is no restriction `maxEntityBodySize`, On the Exceeding this limit will result in a
#                       `413 - Payload Too Large` response
public type RequestLimitConfigs record {|
    int maxUriLength = 4096;
    int maxHeaderSize = 8192;
    int maxEntityBodySize = -1;
|};
```
### 2.2. [Initialization](#22-initialization)

The WebSocket listener can be initialized by providing the `port` or a `http:Listener` and optionally a `ListenerConfiguration`.
```ballerina
# Gets invoked during the module initialization to initialize the listener.
# ```ballerina
# listener websocket:Listener securedEP = new(9090,
#   secureSocket = {
#       key: {
#           certFile: "../resource/path/to/public.crt",
#           keyFile: "../resource/path/to/private.key"
#       }
#   }
# );
# ```
#
# + port - Listening port of the WebSocket service listener
# + config - Configurations for the WebSocket service listener
public isolated function init(int|http:Listener 'listener, *ListenerConfiguration config) returns Error? {
```

## 3. [Service Types](#3-service-types)

### 3.1. [UpgradeService](#31-upgrade-service)

Upgrade service is pretty much similar to an HTTP service. It has a single `get` resource, which takes in an `http:Request` optionally. The `get` resource returns a `websocket:Service` to which incoming messages get dispatched after a successful WebSocket connection upgrade. This resource can be used to intercept the initial HTTP upgrade with custom headers or to cancel the WebSocket upgrade by returning an error.

#### 3.1.1. [UpgradeService Configurations](#311-upgradeservice-configurations)

When writing the service, following configurations can be provided,
```ballerina
# Configurations for a WebSocket service.
#
# + subProtocols - Negotiable sub protocol by the service
# + idleTimeout - Idle timeout for the client connection. Upon timeout, `onIdleTimeout` resource (if defined)
#                          in the server service will be triggered. Note that this overrides the `timeout` config
#                          in the `websocket:Listener` which is applicable only for the initial HTTP upgrade request.
# + maxFrameSize - The maximum payload size of a WebSocket frame in bytes.
#                  If this is not set or is negative or zero, the default frame size which is 65536 will be used.
# + auth - Listener authenticaton configurations
public type WSServiceConfig record {|
    string[] subProtocols = [];
    decimal idleTimeout = 0;
    int maxFrameSize = 65536;
    ListenerAuthConfig[] auth?;
|};
```

### 3.2. [WebSocket Service](#32-websocket-service)

Once the WebSocket upgrade is accepted by the UpgradeService, it returns a `websocket:Service`. This service has a fixed set of remote functions that do not have any configs. Receiving messages will get dispatched to the relevant remote function. Each remote function is explained below.

```ballerina
service /ws on new websocket:Listener(21003) {
    resource function get .(http:Request req) returns websocket:Service|websocket:UpgradeError {
        return new WsService();
    }    
}
        
service class WsService {
    *websocket:Service;
    remote isolated function onTextMessage(websocket:Caller caller, string data) returns websocket:Error? {
        check caller->writeTextMessage(data);
    }
}              
```

#### 3.2.1. [Remote methods associated with WebSocket Service](#remote-methods-associated-with-websocket-service)

##### [onOpen](#onopen)

As soon as the WebSocket handshake is completed and the connection is established, the `onOpen` remote method is dispatched.

```ballerina
remote function onOpen(websocket:Caller caller) returns error? {
    io:println("Opened a WebSocket connection"`);
}
```

##### [onTextMessage](#ontextmessage)

The received text messages are dispatched to this remote method.

```ballerina
remote isolated function onTextMessage(websocket:Caller caller, string text) returns websocket:Error? {
     io:println("Text message: " + text);
}
```

##### [onBinaryMessage](#onbinarymessage)

The received binary messages are dispatched to this remote method.

```ballerina
remote isolated function onBinaryMessage(websocket:Caller caller, byte[] data) returns websocket:Error? {
    io:println(data);
}
```

##### [onMessage](#onmessage)

The received messages are dispatched to this remote method. Data binding support is provided to accept the messages as `anydata`.

```ballerina
remote isolated function onMessage(websocket:Caller caller, json data) returns websocket:Error? {
    io:println(data);
}
```

##### [onPing and onPong](#onping-and-onpong)

The received ping and pong messages are dispatched to these remote methods respectively. You do not need to explicitly control these messages as they are handled automatically by the services and clients.

```ballerina
remote function onPing(websocket:Caller caller, byte[] data) returns error? {
    io:println(string `Ping received with data: ${data.toBase64()}`);
    check caller->pong(data);
}
 
remote function onPong(websocket:Caller caller, byte[] data) {
    io:println(string `Pong received with data: ${data.toBase64()}`);
}
```

##### [onIdleTimeout](#onidletimeout)

This remote method is dispatched when the idle timeout is reached. The idleTimeout has to be configured either in the WebSocket service or the client configuration.

```ballerina
remote function onIdleTimeout(websocket:Client caller) {
    io:println("Connection timed out");
}
```

##### [onClose](#onclose)

This remote method is dispatched when a close frame with a statusCode and a reason is received.

```ballerina
remote function onClose(websocket:Caller caller, int statusCode, string reason) {
    io:println(string `Client closed connection with ${statusCode} because of ${reason}`);
}
```

##### [onError](#onerror)

This remote method is dispatched when an error occurs in the WebSocket connection. This will always be preceded by a connection closure with an appropriate close frame.

```ballerina
remote function onError(websocket:Caller caller, error err) {
    io:println(err.message());
}
```

## 4. [Client](#4-client)

`websocket:Client` can be used to send and receive data synchronously over WebSocket connection. The underlying implementation is non-blocking.

### 4.1. [Client Configurations](#41-client-configurations)

When initializing the client, following configurations can be provided,
```ballerina
# Client configurations for WebSocket clients.
#
# + subProtocols - Negotiable sub protocols of the client
# + customHeaders - Custom headers, which should be sent to the server
# + readTimeout - Read timeout (in seconds) of the client
# + secureSocket - SSL/TLS-related options
# + maxFrameSize - The maximum payload size of a WebSocket frame in bytes.
#                  If this is not set, is negative, or is zero, the default frame size of 65536 will be used
# + webSocketCompressionEnabled - Enable support for compression in the WebSocket
# + handShakeTimeout - Time (in seconds) that a connection waits to get the response of
#                               the WebSocket handshake. If the timeout exceeds, then the connection is terminated with
#                               an error. If the value < 0, then the value sets to the default value(300)
# + cookies - An Array of `http:Cookie`
# + auth - Configurations related to client authentication
# + pingPongHandler - A service to handle the ping/pong frames.
#                     Resources in this service gets called on the receipt of ping/pong frames from the server
public type ClientConfiguration record {|
    string[] subProtocols = [];
    map<string> customHeaders = {};
    decimal readTimeout = -1;
    ClientSecureSocket? secureSocket = ();
    int maxFrameSize = 65536;
    boolean webSocketCompressionEnabled = true;
    decimal handShakeTimeout = 300;
    http:Cookie[] cookies?;
    ClientAuthConfig auth?;
    PingPongService pingPongHandler?;
|};
```
### 4.2. [Initialization](#42-initialization)

A client can be initialized by providing the WebSocket server url and optionally the `ClientConfiguration`.
```ballerina
# Initializes the synchronous client when called.
# ```ballerina
# websocket:Client wsClient = check new("ws://localhost:9090/foo", { retryConfig: { maxCount: 20 } });
# ```
#
# + url - URL of the target service
# + config - The configurations to be used when initializing the client
public isolated function init(string url, *ClientConfiguration config) returns Error? {
```

### 4.3. [Send and receive messages using the Client](#43-send-and-receive-messages-using-the-client)

#### [writeTextMessage](#writetextmessage)

`writeTextMessage` API can be used to send a text message. It takes in the message to be sent as a `string` and returns an error if an error occurs while sending the text message to the connection.

```ballerina
# Writes text messages to the connection. If an error occurs while sending the text message to the connection, that message
# will be lost.
# ```ballerina
# check wsClient->writeTextMessage("Text message");
# ```
#
# + data - Data to be sent.
# + return  - A `websocket:Error` if an error occurs when sending
remote isolated function writeTextMessage(string data) returns Error? {}
```

#### [writeBinaryMessage](#writebinarymessage)

`writeBinaryMessage` API can be used to send a binary message. It takes in the message to be sent as a `byte[]` and returns an error if an error occurs while sending the binary message to the connection.

```ballerina
# Writes binary data to the connection. If an error occurs while sending the binary message to the connection,
# that message will be lost.
# ```ballerina
# check wsClient->writeBinaryMessage("Text message".toBytes());
# ```
#
# + data - Binary data to be sent
# + return  - A `websocket:Error` if an error occurs when sending
remote isolated function writeBinaryMessage(byte[] data) returns Error? {}
```

#### [writeMessage](#writemessage)

`writeMessage` API can be used to send messages. It takes in the message to be sent as subtypes of `anydata` and returns an error if an error occurs while sending the message to the connection.
The input data is internally converted to relevant frame type as follows,

* subtypes of string, xml, json - write out using text frames
* byte[] - write out using binary frames

```ballerina
# Writes messages to the connection. If an error occurs while sending the message to the connection, that message
# will be lost.
# ```ballerina
# check wsClient->writeMessage({x: 1, y: 2});
# ```
#
# + data - Data to be sent
# + return  - A `websocket:Error` if an error occurs when sending
remote isolated function writeBinaryMessage(byte[] data) returns Error? {}
remote isolated function writeMessage(anydata data) returns Error? {
```

#### [readTextMessage](#readtextmessage)

`readTextMessage` API can be used to receive a text message. It returns the complete text message as a `string` or else an error if an error occurs while reading the messages.

```ballerina
# Reads text messages in a synchronous manner
# ```ballerina
# string textResp = check wsClient->readTextMessage();
# ```
#
# + return  - The text data sent by the server or a `websocket:Error` if an error occurs when receiving
remote isolated function readTextMessage() returns string|Error {}
```

#### [readBinaryMessage](#readbinarymessage)

`readBinaryMessage` API can be used to receive a binary message. It returns the complete binary message as a `byte[]` or else an error if an error occurs while reading the messages.

```ballerina
# Reads binary data in a synchronous manner
# ```ballerina
# byte[] textResp = check wsClient->readBinaryMessage();
# ```
#
# + return  - The binary data sent by the server or an `websocket:Error` if an error occurs when receiving
remote isolated function readBinaryMessage() returns byte[]|Error {}
```

#### [readMessage](#readmessage)

`readMessage` API can be used to receive a message without prior knowledge of message type. `anydata` type is supported by this API.
The contextually-expected data type is inferred from the LHS variable type. If there is an error when converting the expected data type or else any other error occurs while reading the messages, the respective error will be returned from the API 

```ballerina
# Reads data from the WebSocket connection
# ```ballerina
# byte[]|string|websocket:Error data = wsClient->readMessage();
# if (data is string) {
#     io:println(data);
# } else if (data is byte[]) {
#     io:println(data);
# } else {
#     io:println("Error occurred", data.message());
# }
#```
#
# + targetType - The payload type (sybtype of `anydata`), which is expected to be returned after data binding
# + return - The data sent by the server or a `websocket:Error` if an error occurs when receiving
remote isolated function readMessage(typedesc<anydata> targetType = <>) returns targetType|Error
```

#### [close](#close)

`close` API can be used to close the connection. It takes in the optional parameters `statusCode` for closing the connection, `reason` for closing the connection if there is any and the `timeout` to wait until a close frame is received from the remote endpoint.

```ballerina
# Closes the connection.
# ```ballerina
# check wsClient->close();
# ```
#
# + statusCode - Status code for closing the connection
# + reason - Reason for closing the connection
# + timeout - Time to wait (in seconds) for the close frame to be received from the remote endpoint before closing the
#                   connection. If the timeout exceeds, then the connection is terminated even though a close frame
#                   is not received from the remote endpoint. If the value is < 0 (e.g., -1), then the connection
#                   waits until a close frame is received. If the WebSocket frame is received from the remote
#                   endpoint within the waiting period, the connection is terminated immediately.
# + return - A `websocket:Error` if an error occurs while closing the WebSocket connection
remote isolated function close(int? statusCode = 1000, string? reason = (), decimal timeout = 60) returns Error? {}
```

#### [ping](#ping)

`ping` API can be used to send ping messages. It takes in the message to be sent as a `byte[]` and returns an error if an error occurs while sending the ping message to the connection.

```ballerina
# Pings the connection. If an error occurs while sending the ping frame to the server, that frame will be lost.
# ```ballerina
# check wsClient->ping([5, 24, 56, 243]);
# ```
#
# + data - Binary data to be sent
# + return  - A `websocket:Error` if an error occurs when sending
remote isolated function ping(byte[] data) returns Error? {}
```

#### [pong](#pong)

`pong` API can be used to send pong messages. It takes in the message to be sent as a `byte[]` and returns an error if an error occurs while sending the pong message to the connection.

```ballerina
# Sends a pong message to the connection. If an error occurs while sending the pong frame to the connection, that
# the frame will be lost.
# ```ballerina
# check wsClient->pong([5, 24, 56, 243]);
# ```
#
# + data - Binary data to be sent
# + return  - A `websocket:Error` if an error occurs when sending
remote isolated function pong(byte[] data) returns Error? {}
```

#### [onPing and onPong remote methods](#onping-and-onpong-remote-methods)

To receive ping/pong messages, users have to register a `websocket:PingPongService` when creating the client. If the service is registered, receiving ping/pong messages will get dispatched to the `onPing` and `onPong` remote functions respectively.
```ballerina
service class PingPongService {
   *websocket:PingPongService;
   remote function onPong(websocket:Caller wsEp, byte[] data) {
       io:println("Pong received", data);
   }
   
   remote isolated function onPing(websocket:Caller caller, byte[] localData) returns byte[] {
       return localData;
   }    
}

websocket:Client wsClient = check new ("ws://localhost:21020", {pingPongHandler : new PingPongService()});
```
If the user has implemented `onPing` on their service, it's user's responsibility to send the `pong` frame. It can be done simply by returning the data from the remote function, or else can be done using the `pong` API of websocket:Caller. If the user hasn't implemented the `onPing` remote function, `pong` will be sent automatically.

## 5. [Securing the WebSocket Connections](#5-securing-the-websocket-connections)

Ballerina provides inbuilt support for SSL/TLS and configurations to enforce authentication and authorization such as Basic Auth, JWT auth, and OAuth2.

### 5.1. [SSL/TLS](#51-ssl-tls)
You can configure a secure socket for your WebSocket listener and client to upgrade to a TCP connection with TLS.

The TLS-enabled Listener

```ballerina
listener websocket:Listener wsListener = new(9090,
    secureSocket = {
        key: {
             certFile: "/path/to/public.crt",
             keyFile: "/path/to/private.key"
        }
    }
);
```

The TLS-enabled Client

```ballerina
websocket:Client wsClient = check new (string `wss://localhost:9090/taxi/${username}`,
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);
```

### 5.2. [Authentication and Authorization](#52-authentication-and-authorization)

#### Listener

The Ballerina WebSocket library provides built-in support for the following listener authentication mechanisms that are validated in the initial upgrade request.
1. Basic authentication
2. JWT authentication
3. OAuth2 authentication

To enable one of the above, you should configure the `auth` field in `websocket:ServiceConfig` annotation which consists of the following records:
1. FileUserStoreConfigWithScopes
2. LdapUserStoreConfigWithScopes
3. JwtValidatorConfigWithScopes
4. OAuth2IntrospectionConfigWithScopes

Each of the above records consists of configurations specific to each type as `FileUserStoreConfig` , `LdapUserStoreConfig` ,`JwtValidatorConfig` and `OAuth2IntrospectionConfig` respectively. You just have to configure them and there will be no need for any extensions or handlers. Ballerina will perform the required validation for you.

```ballerina

listener websocket:Listener wsListener = new(9090,
    secureSocket = {
        key: {
            certFile: "../resource/path/to/public.crt",
            keyFile: "../resource/path/to/private.key"
        }
    }
);

@websocket:ServiceConfig {
     auth: [
        {
            oauth2IntrospectionConfig: {
                url: "https://localhost:9445/oauth2/introspect",
                tokenTypeHint: "access_token",
                scopeKey: "scp",
                clientConfig: {
                    secureSocket: {
                        cert: "../resource/path/to/introspect/service/public.crt"
                    }
                }
            },
            scopes: ["write", "update"]
        }
    ]
}
service /ws on wsListener {
    resource function get .() returns websocket:Service|websocket:UpgradeError {
        // ....
    }
}
```

#### Client

The Ballerina WebSocket client can be configured to send authentication information to the endpoint being invoked. The Ballerina WebSocket library also has built-in support for the following client authentication mechanisms.
1. Basic authentication
2. JWT authentication
3. OAuth2 authentication

The following code snippet shows how a WebSocket client can be configured to call a secured endpoint. The `auth` field of the client configurations (websocket:ClientConfiguration) should have either one of the `CredentialsConfig`, `BearerTokenConfig`, `JwtIssuerConfig`, `OAuth2ClientCredentialsGrantConfig`, `OAuth2PasswordGrantConfig`, and `OAuth2RefreshTokenGrantConfig` records. Once this is configured, Ballerina will take care of the rest of the validation process.

```ballerina
websocket:Client wsClient = check new (string `wss://localhost:9090/taxi/${username}`,
     auth = {
         tokenUrl: "https://localhost:9445/oauth2/token",
         username: "johndoe",
         password: "A3ddj3w",
         clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxStwNEW4cfStBEGRxRL68",
         clientSecret: "9205371918321623741",
         scopes: ["write", "update"],
         clientConfig: {
             secureSocket: {
                 cert: "../resource/path/to/introspect/service/public.crt"
             }
         }
     },
     secureSocket = {
         cert: "../resource/path/to/public.crt"
     }
);
```

## 6. [Samples](#6-samples)

Listener

```ballerina
import ballerina/io;
import ballerina/websocket;

service /basic/ws on new websocket:Listener(9090) {
   resource isolated function get .() returns websocket:Service|websocket:Error {
       return new WsService();
   }
}

service class WsService {
    *websocket:Service;
    remote isolated function onTextMessage(websocket:Caller caller, string text) returns websocket:Error? {
        io:println("Text message: " + text);
        check caller->writeTextMessage(text);
    }
    
    remote isolated function onBinaryMessage(websocket:Caller caller, byte[] data) returns websocket:Error? {
        io:println(data);
        check caller->writeBinaryMessage(data);
    }
}
```

Client

```ballerina
import ballerina/io;
import ballerina/websocket;

public function main() returns error? {
   websocket:Client wsClient = check new("ws://localhost:9090/basic/ws");

   check wsClient->writeTextMessage("Text message");

   string textResp = check wsClient->readTextMessage();
   io:println(textResp);
   
   check wsClient->writeBinaryMessage("Binary message".toBytes());

   byte[] byteResp = check wsClient->readBinaryMessage();
   string stringResp = check 'string:fromBytes(byteResp);
   io:println(stringResp);
}
```