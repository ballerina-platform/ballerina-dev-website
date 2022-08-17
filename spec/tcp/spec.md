# Specification: Ballerina TCP Library

_Owners_: @shafreenAnfar @bhashinee  
_Reviewers_: @shafreenAnfar  
_Created_: 2021/12/20  
_Updated_: 2022/02/18  
_Edition_: Swan Lake  

## Introduction

This is the specification for the TCP standard library of [Ballerina language](https://ballerina.io/), which provides TCP client-server functionalities.

The TCP library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Listener](#2-listener)
    * 2.1. [Configurations](#21-configurations)
    * 2.2. [Initialization](#22-initialization)
3. [Service Types](#3-service-types)
    * 3.1. [Service](#31-service)
    * 3.2. [Connection Service](#32-connection-service)
        * 3.2.1. [Remote methods associated with the Connection Service](#321-remote-methods-associated-with-the-connection-service)
            * [onBytes](#onbytes)
            * [onError](#onerror)
            * [onClose](#onclose)
4. [Client](#4-client)
    * 4.1. [Configurations](#41-configurations)
    * 4.2. [Initialization](#42-initialization)
    * 4.3. [Send and receive data](#43-send-and-receive-data)
        * [writeBytes](#writebytes)
        * [readBytes](#readbytes)
        * [close](#close)
5. [Securing the TCP Connections](#5-securing-the-tcp-connections)
    * 5.1 [Using the TLS protocol](#51-using-the-tls-protocol)
6. [Samples](#6-samples)

## 1. [Overview](#1-overview)

TCP is a protocol that enables applications to exchange messages over a network. It is designed to ensure the successful delivery of data over the network. This specification elaborates on how Ballerina language provides a tested TCP client and server implementation that is compliant with the [RFC 793](https://datatracker.ietf.org/doc/html/rfc793).

## 2. [Listener](#2-listener)

The `tcp:Listener` is used to listen to the incoming socket request. It can be constructed with a port number and optionally providing other configurations. When initiating the listener it opens up the port and attaches the `tcp:Service`. 

### 2.1. [Configurations](#21-configurations)

When initializing the listener, following configurations can be provided,

```ballerina
# Provides a set of configurations for tcp listener.
#
# + localHost - The hostname
# + secureSocket - The SSL configurations for the listener
public type ListenerConfiguration record {|
   string localHost?;
   ListenerSecureSocket secureSocket?; 
|};
```

`ListenerSecureSocket` record contains configurations related to enabling SSL/TLS on the listener side. More details and examples of how to configure them can be found in a following section on `Securing the TCP Connections`.

```ballerina
# Secure Socket configuration for TCP Listener.
#
# + key - Configurations associated with `crypto:KeyStore` or combination of certificate and (PKCS8) private key of the server
# + protocol - SSL/TLS protocol related options
# + ciphers - List of ciphers to be used
#             eg: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
# + handshakeTimeout - SSL handshake time out
# + sessionTimeout - SSL session time out
public type ListenerSecureSocket record {|
    crypto:KeyStore|CertKey key;
    record {|
        Protocol name;
        string[] versions = [];
    |} protocol?;
    string[] ciphers = [];
    decimal handshakeTimeout?;
    decimal sessionTimeout?;
|};
```

### 2.2. [Initialization](#22-initialization)
The TCP listener can be initialized by providing the `port` and optionally a `ListenerConfiguration`.

```ballerina
# Initializes the TCP listener based on the provided configurations.
# ```ballerina
#  listener Listener|error? server1 = new (8080);
# ```
# + localPort - The port number of the remote service
# + config - Configurations related to the `tcp:Listener`
public isolated function init(int localPort, *ListenerConfiguration config) returns Error? {}
```

## 3. [Service Types](#3-service-types)

### 3.1. [Service](#31-service)

This service has a single `onConnect` remote function which gets invoked when a new client is connected. The new client is represented using the `tcp:Caller`. The `onConnect(tcp:Caller)` method may return `tcp:ConnectionService|tcp:Error`.

### 3.2. [Connection Service](#32-connection-service)

Once the TCP connection is established, it returns a `tcp:ConnectionService`. This service has a fixed set of remote functions that do not have any configs. Receiving messages will get dispatched to the relevant remote function. Each remote function is explained below.

```ballerina
import ballerina/tcp;

service on new tcp:Listener(3000) {
    remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        return new EchoService();
    }
}

service class EchoService {

    *tcp:ConnectionService;
    
    remote function onBytes(readonly & byte[] data) returns byte[]|tcp:Error? {
        // echo back the data to the client
        return data;
    }
}
```

#### 3.2.1. [Remote methods associated with the Connection Service](#remote-methods-associated-with-the-connection-service)

##### [onBytes](#onbytes)

This remote method is invoked once the data is received from the client.

```ballerina
remote function onBytes(tcp:Caller caller, readonly & byte[] data) returns tcp:Error? {
    io:println("Received: ", string:fromBytes(data));
}
```

##### [onError](#onerror)

This remote method is invoked in an error situation.

```ballerina
remote function onError(tcp:Error err) {
    io:println("An error occurred" + err.message());
}
```

##### [onClose](#onclose)

This remote method is invoked when the connection gets closed.

```ballerina
remote function onClose() {
    io:println("Client left");
}
```

## 4. [Client](#4-client)

The `tcp:Client` is used to connect to a socket server and interact with it. It can send the data to the server and retrieve the data from the server.

### 4.1. [Configurations](#41-configurations)

When initializing the client, following configurations can be provided,

```ballerina
# Configurations for the connection-oriented TCP client.
# 
# + localHost - Local binding of the interface
# + timeout - The socket reading timeout value to be used in seconds. If this is not set, the default value
#             of 300 seconds(5 minutes) will be used
# + writeTimeout - The socket write timeout value to be used in seconds. If this is not set, the default value
#             of 300 seconds(5 minutes) will be used
# + secureSocket - The `secureSocket` configuration
public type ClientConfiguration record {|
    string localHost?;
    decimal timeout = 300;
    decimal writeTimeout = 300;
    ClientSecureSocket secureSocket?;
|};
```

### 4.2. [Initialization](#42-initialization)

A client can be initialized by providing the `remoteHost` and the `remotePort` and optionally the `ClientConfiguration`.

```ballerina
# Initializes the TCP client based on the provided configurations.
# ```ballerina
# tcp:Client|tcp:Error? socketClient = new("www.remote.com", 80,
#                              localHost = "localHost");
# ```
# + remoteHost - The hostname or the IP address of the remote host
# + remotePort - The port number of the remote host
# + config - Connection-oriented client-related configurations
public isolated function init(string remoteHost, int remotePort, *ClientConfiguration config) returns Error? {}
```

### 4.3. [Send and receive data](#43-send-and-receive-data)

#### [writeBytes](#writebytes)

`writeBytes` API can be used to send data to the remote host.

```ballerina
# Sends the given data to the connected remote host.
# ```ballerina
# tcp:Error? result = socketClient->writeBytes("msg".toBytes());
# ```
#
# + data - The data that need to be sent to the connected remote host
# + return - `()` or else a `tcp:Error` if the given data cannot be sent
remote function writeBytes(byte[] data) returns Error? = @java:Method {}
```

#### [readBytes](#readbytes)

`readBytes` API can be used to read data receiving from the remote host.

```ballerina
# Reads data only from the connected remote host. 
# ```ballerina
# (readonly & byte[])|tcp:Error result = socketClient->readBytes();
# ```
#
# + return - The `readonly & byte[]` or else a `tcp:Error` if the data
#            cannot be read from the remote host
remote function readBytes() returns (readonly & byte[])|Error = @java:Method {}
```

#### [close](#close)

`close` API can be used to close the connection established with the remote host.

```ballerina
# Frees up the occupied socket.
# ```ballerina
# tcp:Error? closeResult = socketClient->close();
# ```
#
# + return - A `tcp:Error` if it cannot close the connection or else `()`
isolated remote function close() returns Error? = @java:Method {}
```

## 5. [Securing the TCP Connections](#5-securing-the-tcp-connections)

Ballerina provides inbuilt support for securing TCP connections with SSL/TLS protocol.

### 5.1 [Using the TLS protocol](#51-using-the-tls-protocol)

This expects a secure socket to be set in the connection configuration as shown below.

#### 5.1.1 [Configuring TLS in server side](#511-configuring-tls-in-server-side)

```ballerina
tcp:ListenerSecureSocket listenerSecureSocket = {
    key: {
        certFile: "../resource/path/to/public.crt",
        keyFile: "../resource/path/to/private.key"
    }
};

service on new tcp:Listener(9002, secureSocket = listenerSecureSocket) {
    isolated remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        return new EchoService();
    }
}
```

#### 5.1.2 [Configuring TLS in client side](#512-configuring-tls-in-client-side)

```ballerina
tcp:Client socketClient = check new ("localhost", 9002, secureSocket = {
    cert: "../resource/path/to/public.crt",
});
```

## 6. [Samples](#6-samples)

Listener

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/tcp;

service on new tcp:Listener(3000) {
    remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        io:println("Client connected to echo server: ", caller.remotePort);
        return new EchoService();
    }
}

service class EchoService {

    *tcp:ConnectionService;
    
    remote function onBytes(tcp:Caller caller, readonly & byte[] data) returns tcp:Error? {
        io:println("Echo: ", string:fromBytes(data));
        return caller->writeBytes(data);
    }

    remote function onError(tcp:Error err) {
        log:printError("An error occurred", 'error = err);
    }

    remote function onClose() {
        io:println("Client left");
    }
}
```

Client

```ballerina
import ballerina/io;
import ballerina/tcp;

public function main() returns error? {
    tcp:Client socketClient = check new ("localhost", 3000);

    string msg = "Hello Ballerina Echo from client";
    byte[] msgByteArray = msg.toBytes();
    check socketClient->writeBytes(msgByteArray);

    readonly & byte[] receivedData = check socketClient->readBytes();
    io:println("Received: ", string:fromBytes(receivedData));

    return socketClient->close();
}
```
