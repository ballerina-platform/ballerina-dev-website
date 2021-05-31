---
layout: ballerina-left-nav-pages-swanlake
title: Securing WebSocket Communication
description: Whenever possible, you should use WebSocket with TLS. This makes sure that your data communication is secure through the network. 
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/user-guide/network-communication/websocket/securing-websocket-communication/
active: securing-websocket-communication
intro: Whenever possible, you should use WebSocket with TLS. This makes sure that your data communication is secure through the network. 
redirect_from:
  - /learn/network-communication/websocket/using-primary-events
  - /swan-lake/learn/network-communication/websocket/securing-websocket-communication/
  - /swan-lake/learn/network-communication/websocket/securing-websocket-communication
  - /learn/network-communication/websocket/securing-websocket-communication/
  - /learn/network-communication/websocket/securing-websocket-communication
  - /learn/user-guide/network-communication/websocket/securing-websocket-communication
---

## Configuring a Secure Socket 

For your WebSocket service to be compatible with this approach, you can configure a secure socket for your WebSocket listener. This WebSocket listener is the one used in the [WebSocket upgrade](/learn/network-communication/websocket/), so it will be upgrading a TCP connection with TLS.

Afterward, in your WebSocket client, you can use the `wss` protocol scheme to connect to a secure WebSocket server. An example of a secure WebSocket client initialization is shown below.

```ballerina
var ws = new WebSocket("wss://localhost:8443/ws");
```

## Securing WebSocket Communication Example

1. Create a `wss_service.bal` file with the content below.

   >**Info:** This updates your initial WebSocket echo service to enable TLS on the communication channel. 

   ```ballerina
   import ballerina/http;
   import ballerina/websocket;
   import ballerina/os;
   
   websocket:ListenerConfiguration wsConf = {
         secureSocket: {
             key: {
                 certFile: "resource/path/to/public.crt",
                 keyFile: "/resource/path/to/private.key"
             }
         }
   };
   
   service /ws on new websocket:Listener(8443, config = wsConf) {
   
      resource function get .(http:Request req)
                              returns websocket:Service|
                                    websocket:UpgradeError {
         return new WsService();
      }
   
   }
   
   service class WsService {
   
      *websocket:Service;
   
      remote function onTextMessage(websocket:Caller caller,
                                    string text) returns error? {
         check caller->writeTextMessage("Echo: " + text);
      }   
   }
   ```

2. Execute the commands below to run the above service. 

   ```bash
   $ ballerina run wss_service.bal
   ```
You view the output below.

   ```bash
   Compiling source
         wss_service.bal
   Running executables
   
   [ballerina/websocket] started WSS listener 0.0.0.0:8443
   ```

   In the code above, you simply created a WebSocket listener by providing the [`ListenerConfiguration`](/learn/api-docs/ballerina/#/ballerina/websocket/1.1.2/websocket/records/ListenerConfiguration), which contains the secure socket parameters. 

3. Write a Ballerina WebSocket client (`wss_client.bal`) below to make a connection and send requests to the service above.

   >**Info:** As you are using a self-signed certificate in this example, web browsers will generally reject secure WebSocket connections.  

   ```ballerina
   import ballerina/io;
   import ballerina/websocket;   
   
   public function main() returns error? {
      websocket:Client wsClient = check new ("wss://localhost:8443/ws"{
              secureSocket: {
                  cert: "../resource/path/to/public.crt"
              }
      });
      check wsClient->writeTextMessage("Hello!");
      string resp = check wsClient->readTextMessage();
      io:println("Response: ", resp);
   }
   ```

4. Execute the commands below to run the above client. 

   ```bash
   $ bal run wss_client.bal
   ```

   You view the output below.

   ```bash
   Compiling source
         wss_client.bal

   Running executable

   Response: Echo: Hello!
   ```

In the code above, you created a [`websocket:Client`](https://docs.central.ballerina.io/ballerina/websocket/latest/clients/Client) by providing the [`websocket:ClientConfiguration`](https://docs.central.ballerina.io/ballerina/websocket/latest/records/ClientConfiguration) value containing the secure socket parameters. From here onwards, any communication done from the client to the WebSocket server will be done with TLS.

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
