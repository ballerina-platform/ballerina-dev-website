---
layout: ballerina-left-nav-pages-swanlake
title: Securing WebSocket communication
description: Whenever possible, you should use WebSocket with TLS. This makes sure that your data communication is secure through the network. 
keywords: ballerina, cli, command-line interface, programming language
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
redirect_to:
  - https://lib.ballerina.io/ballerina/websocket/latest/
---

## Configuring a secure socket 

For your WebSocket service to be compatible with this approach, you can configure a secure socket for your WebSocket listener. This WebSocket listener is the one used in the [WebSocket upgrade](/learn/network-communication/websocket/), so it will be upgrading a TCP connection with TLS.

Afterward, in your WebSocket client, you can use the `wss` protocol scheme to connect to a secure WebSocket server. An example of a secure WebSocket client initialization is shown below.

```ballerina
var ws = new WebSocket("wss://localhost:8443/ws");
```

## Securing WebSocket communication example

1. Create a `wss_service.bal` file with the content below.

    >**Info:** This updates your initial WebSocket echo service to enable TLS on the communication channel. 

    ```ballerina
    listener websocket:Listener securedEP = new(9090,
       secureSocket = {
           key: {
                certFile: "/path/to/public.crt"
                keyFile: "/path/to/private.key",
           }
       }
    );
    
    service /ws on securedEP {
        resource function get .(http:Request req) returns websocket:Service|websocket:UpgradeError {
            return new WsService();
        }
    }
       
    service class WsService {
        *websocket:Service;
        remote function onTextMessage(websocket:Caller caller, string text) returns websocket:Error? {
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
    
    [ballerina/websocket] started WSS listener 0.0.0.0:9090
    ```

    In the code above, you simply created a WebSocket listener by providing the [`websocket:ListenerConfiguration`](https://docs.central.ballerina.io/ballerina/http/latest/records/ListenerConfiguration), which contains the secure socket parameters. 


3. Write a Ballerina WebSocket client (`wss_client.bal`) below to make a connection and send requests to the service above.

    >**Info:** As you are using a self-signed certificate in this example, web browsers will generally reject secure WebSocket connections.  

    ```ballerina
    import ballerina/io;
    import ballerina/websocket;   
    
    public function main() returns error? {
        websocket:Client wsClient = check new ("wss://localhost:8443/ws",
            secureSocket = {
                cert: "/path/to/public.crt"
            }
        );
        _ = check wsClient->writeTextMessage("Hello, World!");
        string response = check wsClient->readTextMessage();
        io:println(response);
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
    
    Response: Echo: Hello, World!
    ```

    In the code above, you created a [`websocket:Client`](https://docs.central.ballerina.io/ballerina/websocket/latest/clients/Client) by providing the [`websocket:ClientConfiguration`](https://docs.central.ballerina.io/ballerina/websocket/latest/clients/Client) value containing the secure socket parameters. From here onwards, any communication done from the client to the WebSocket server will be done with TLS.

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
