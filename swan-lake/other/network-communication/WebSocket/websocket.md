---
layout: ballerina-left-nav-pages-swanlake
title: WebSocket
description: WebSocket is a low-latency communication protocol used for efficient full-duplex communication between web browsers and servers over TCP. The topics below explain how to implement WebSocket-based services using Ballerina.  
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/websocket/
active: websocket
intro: WebSocket is a low-latency communication protocol used for efficient full-duplex communication between web browsers and servers over TCP. The topics below explain how to implement WebSocket-based services using Ballerina.  
redirect_from:
  - /learn/network-communication/websocket
  - /swan-lake/learn/network-communication/websocket/
  - /swan-lake/learn/network-communication/websocket
  - /learn/network-communication/websocket/
  - /learn/network-communication/websocket
  - /learn/user-guide/network-communication/websocket
redirect_to:
  - https://lib.ballerina.io/ballerina/websocket/latest/
---

## Upgrading the WebSocket 

The first step in WebSocket communication is the HTTP upgrade operation that is carried out in order to switch to WebSocket communication. 

In an HTTP Ballerina service, you switch to the WebSocket protocol using an HTTP upgrade operation. This is done by defining a specific HTTP service resource function at the HTTP upgrade path, which returns a WebSocket service implementation.

The example below demonstrates this operation. 

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/websocket;
 
service /ws on new websocket:Listener(8080) {
 
   resource function get .(http:Request req)
                           returns websocket:Service|
                                   websocket:Error {
       return new WsService();
   }
 
}
```

In the example above, `/ws` is the configured upgrade path, and the `WsService` instance should have functions defined in the [`websocket:Service`](/learn/api-docs/ballerina/#/ballerina/websocket/1.1.2/websocket/abstractObjects/Service) abstract object. These remote functions correspond to the events generated for the WebSocket communication. The sections below describe how these are implemented. 

## Using primary events

These individual events are notified to the user through their own remote functions in the WebSocket Ballerina service.

### Connection creation

The connection creation state is achieved when the WebSocket client establishes a connection after a successful handshake operation. At this moment, the remote function below is called if it is available in the service.

```ballerina
remote function onOpen(websocket:Caller caller);
```

This remote function provides an instance of a [`websocket:Caller`](/learn/api-docs/ballerina/#/ballerina/websocket/1.1.2/websocket/clients/Caller) object, which can be used to communicate back with the WebSocket client. This saves the caller object when the connection is created so whenever the application wants to send messages to the connected clients, it can use the stored caller objects to do so.

#### Connection creation example

The example below implements an HTTP service resource to broadcast a message to all the connected WebSocket clients.

1. Create a `ws_connection_creation.bal` file with the content below.

   >**Info:** In the code below, the first service is bound to an WebSocket listener. The provided request implementation at `/ws` signals to the system that it is executing an HTTP upgrade to the WebSocket protocol. After the protocol upgrade is done, the `WsService` service will assume the functionality of a WebSocket service. 

   ```ballerina
   import ballerina/http;
   import ballerina/websocket;
   
   service /ws on new websocket:Listener(8080) {
   
      resource function get .(http:Request req)
                              returns websocket:Service|
                                    websocket:Error {
         return new WsService();
      }
   
   }
   
   websocket:Caller[] callers = [];
   
   service class WsService {
   
      *websocket:Service;
   
      remote function onOpen(websocket:Caller caller) {
         callers.push(caller);
      }
   
   }
   
   service /broadcaster on new http:Listener(8081) {
      resource function post broadcast(@http:Payload {} string payload)
                                       returns string|error? {
         foreach var targetCaller in callers {
            check targetCaller->writeTextMessage(payload);
         }
         return "OK";
      }
   }
   ```

2. Execute the `bal run ws_connection_creation.bal` command to run the above service. You view the output below.

   ```bash
   Compiling source
         ws_connection_creation.bal
   Running executables

   [ballerina/http] started HTTP/WS listener 0.0.0.0:8080
   [ballerina/http] started HTTP/WS listener 0.0.0.0:8081
   ```

3. Open multiple web browser tabs and start the developer tools JavaScript console.

4. Enter the lines below to create a WebSocket client that connects to our server, registers a callback, and prints any message received from the server. 

   ```ballerina
   var ws = new WebSocket("ws://localhost:8080/ws");
   ws.onmessage = function(frame) {console.log(frame.data)};
   ```

5. Send an HTTP request to the `broadcaster` service you deployed to send messages to the WebSocket clients that were stored in your application.

   ```bash
   $ curl -d "Hello!" http://localhost:8081/broadcaster/broadcast
   ```

Now, you view the message above in all the browser tabs you opened with the WebSocket clients.

### Sub-protocol handling

When a WebSocket connection is created, you can provide a list of sub-protocols that the client can handle in an order of priority. This is done in the following manner when the WebSocket client is created.

```ballerina
var ws = new WebSocket("ws://localhost:8080/ws/subscribe", ["xml", "json"]);
```

Sub-protocols are given in the WebSocket constructor’s second parameter, which can be a single string value or an array of strings. In the statement above, you are requesting either `xml` or `json` to be used as the protocol.

The server-side will be configured to handle zero or multiple sub-protocols. The server will check the client’s sub-protocol list in the priority order to see if it is supported in the given service. If it finds a match, it will return this single first-matched protocol to the client.

The server-side configuration of sub-protocols is done using the [`websocket:ServiceConfig`](https://docs.central.ballerina.io/ballerina/websocket/latest/annotations#ServiceConfig) annotation using its `subProtocols` field.

#### Sub-protocol handling example

The example below shows the usage of this by updating the [`/ws` service](#connection-creation) created before to negotiate a sub-protocol and print the selected one in connection open. 

1. Create a `ws_sub_protocol_handling.bal` file with the content below.

   >**Info:** In the below code, the service is configured to support `json` and `mqtt` sub-protocols. 

   ```ballerina
   @websocket:ServiceConfig {
      subProtocols: ["mqtt", "json"],
      idleTimeoutInSeconds: 120
   }
   service /ws on new websocket:Listener(8080) {
   
      resource function get .(http:Request req)
                              returns websocket:Service|
                                    websocket:Error {
         return new WsService();
      }
   
   }
   
   service class WsService {
   
      *websocket:Service;
   
      remote function onOpen(websocket:Caller caller) {
         callers.push(caller);
         io:println("Negotiated sub-protocol: ",
                     caller.getNegotiatedSubProtocol());
   
      }
   
   }
   ```

2. Use the WebSocket client created in the above example with `xml` and `json` sub-protocols.

3. Execute the `ws_sub_protocol_handling.bal` command to run the above service. This will print the following in the standard output of the service execution location when a connection is created. 

   >**Info:** The service has negotiated to use the `json` protocol since the client’s highest priority, which is `xml` is not supported. 

   ```bash
   Compiling source
         ws_sub_protocol_handling.bal
   Running executables

   [ballerina/http] started HTTP/WS listener 0.0.0.0:8080
   [ballerina/http] started HTTP/WS listener 0.0.0.0:8081
   Negotiated sub-protocol: json
   ```

### Data message

A data message is received when a WebSocket client either sends a text or a binary message to a WebSocket service. If available, the remote functions below are called in the service to handle text and binary messages respectively. 

```ballerina
remote function onTextMessage(websocket:Caller caller, string text);
 
remote function onBinaryMessage(websocket:Caller caller, byte[] data);
```

#### Data message example

The example below demonstrates the data message functionality via a simple WebSocket service class, which echoes the message you send to it. 

1. Create a `ws_data_message.bal` file with the content below.

   ```ballerina
   service class WsService {
   
      *websocket:Service;
   
      remote function onOpen(websocket:Caller caller) {
         callers.push(caller);
         io:println("Negotiated sub-protocol: ",
                     caller.getNegotiatedSubProtocol());
   
      }
   
      remote function onTextMessage(websocket:Caller caller,
                                    string text) returns error? {
         check caller->writeTextMessage("Echo: " + text);
      }
   
      remote function onBinaryMessage(websocket:Caller caller,
                                    byte[] data) returns error? {
         check caller->writeBinaryMessage(data);
      }
   
   }
   ```

2. Execute the `bal run ws_data_message.bal` command to run the above service. You view the output below.

   ```bash
   Compiling source
         ws_data_message.bal
   Running executables

   [ballerina/http] started HTTP/WS listener 0.0.0.0:8080
   ```

   Now, the program is compiled and the service is up and running at port 8080.

3. Open up developer tools in a web browser such as Firefox or Chrome.

4. Type the statements below to create a WebSocket client, and send some data to the server.

   ```ballerina
   var ws = new WebSocket("ws://localhost:8080/ws/echo");
   ws.onmessage = function(frame) {console.log(frame.data)};
   ws.send("Hello!");
   ```

   The execution of this command results in the message below printed in the console. This is the response returned from the WebSocket service. 

   ```bash
   Echo: Hello!
   ```

### Control message

A WebSocket contains two control messages: `ping` and `pong`. A WebSocket server or a client can send a `ping` message, and the opposite side should respond with a corresponding `pong` message by returning the same payload sent with the `ping` message. These `ping/pong` sequences are used as a heartbeat mechanism to check if the connection is healthy.

You not need to explicitly control these messages as they are handled automatically by the services and clients. However, if required, you can override the default implementations of the `ping/pong` messages. This is done by providing implementations to the remote functions below in a WebSocket service. 

```ballerina
remote function onPing(websocket:Caller caller, byte[] data);
 
remote function onPong(websocket:Caller caller, byte[] data);
```

#### Control message example

An example implementation of the `ping/pong` functions is shown below.

```ballerina
remote function onPing(websocket:Caller caller,
                       byte[] data) returns error? {
    io:println(string `Ping received with data: ${data.toBase64()}`);
    check caller->pong(data);
}
 
remote function onPong(websocket:Caller caller,
                       byte[] data) {
    io:println(string `Pong received with data: ${data.toBase64()}`);
}
```

### Connection error

In the event of an error in the WebSocket connection, the connection will be closed automatically by generating the required connection close frame. The remote function below can be implemented in the service to receive the notification that this is going to happen and perform any possible cleanup or custom logging operations. 

```ballerina
remote function onError(websocket:Caller caller, error err);
```

### Connection close

If the connection is closed from the client-side, the service will be notified by calling the remote function below. 

```ballerina
remote function onClose(websocket:Caller caller, int statusCode,
                        string reason);
```

#### Connection close example

An example implementation of this remote function, which logs the information about the connection closure is shown below. 

```ballerina
remote function onClose(websocket:Caller caller, int statusCode,
                        string reason) {
    io:println(string `Client closed connection with ${statusCode} because of ${reason}`);
}
```

## Securing WebSocket communication

For information on this, see [Securing WebSocket Communication](/learn/network-communication/websocket/securing-websocket-communication/).
