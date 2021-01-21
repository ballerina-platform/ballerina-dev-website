var searchData = {
  "modules": [
    {
      "id": "websocket",
      "description": "This module provides an implementation for connecting and interacting with WebSocket endpoints.",
      "orgName": "ballerina",
      "version": "1.1.1"
    }
  ],
  "classes": [],
  "functions": [],
  "records": [
    {
      "id": "CommonWebSocketClientConfiguration",
      "description": "Common client configurations for WebSocket clients.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "ListenerConfiguration",
      "description": "Provides a set of configurations for HTTP service endpoints.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "ListenerHttp1Settings",
      "description": "Provides settings related to HTTP/1.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "ListenerSecureSocket",
      "description": "Configures the SSL/TLS options to be used for HTTP service.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "Local",
      "description": "Presents a read-only view of the local address.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "Remote",
      "description": "Presents a read-only view of the remote address.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "RequestLimitConfigs",
      "description": "Provides inbound request URI, total header and entity body size threshold configurations.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WebSocketClientConfiguration",
      "description": "Configurations for the WebSocket client.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WebSocketFailoverClientConfiguration",
      "description": "Configurations for the WebSocket client endpoint.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WebSocketRetryConfig",
      "description": "Retry configurations for WebSocket.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WSServiceConfig",
      "description": "Configurations for a WebSocket service.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "constants": [
    {
      "id": "AUTH_HEADER",
      "description": "Represents the Authorization header name.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "KEEPALIVE_ALWAYS",
      "description": "Keeps the connection alive irrespective of the `connection` header value }\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "KEEPALIVE_AUTO",
      "description": "Decides to keep the connection alive or not based on the `connection` header of the client request }\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "KEEPALIVE_NEVER",
      "description": "Closes the connection irrespective of the `connection` header value }\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "REQUEST_METHOD",
      "description": "Constant for the request method reference.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "RESOURCE_NAME",
      "description": "Constant for the resource name reference.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "SERVICE_NAME",
      "description": "Constant for the service name reference.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "errors": [
    {
      "id": "Error",
      "description": "The union of all the WebSocket related errors\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "ReadingInboundBinaryError",
      "description": "Raised when the reading the binary messages have failed\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "ReadingInboundTextError",
      "description": "Raised when the reading the text messages have failed\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "UpgradeError",
      "description": "Raised when the websocket upgrade is not accepted\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WsConnectionClosureError",
      "description": "Raised during failures in connection closure\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WsConnectionError",
      "description": "Raised during connection failures\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WsGenericError",
      "description": "Raised for errors not captured by the specific errors\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WsInvalidContinuationFrameError",
      "description": "Raised when an out of order/invalid continuation frame is received\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WsInvalidHandshakeError",
      "description": "Raised during the handshake when the WebSocket upgrade fails\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WsPayloadTooBigError",
      "description": "Raised when receiving a frame with a payload exceeding the maximum size\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WsProtocolError",
      "description": "Raised when the other side breaks the protocol\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "types": [
    {
      "id": "KeepAlive",
      "description": "Defines the possible values for the keep-alive configuration in service and client endpoints.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "clients": [
    {
      "id": "AsyncClient",
      "description": "Represents a WebSocket client endpoint.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "Caller",
      "description": "Represents a WebSocket caller.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "SyncClient",
      "description": "Represents a WebSocket synchronous client endpoint.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "WebSocketFailoverClient",
      "description": "A WebSocket client endpoint, which provides failover support for multiple WebSocket targets.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "listeners": [
    {
      "id": "Listener",
      "description": "This is used for creating Websocket server endpoints.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "annotations": [
    {
      "id": "ServiceConfig",
      "description": "The annotation which is used to configure a WebSocket service.",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "abstractObjects": [
    {
      "id": "Service",
      "description": "The Websocket service type\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    },
    {
      "id": "UpgradeService",
      "description": "The Websocket upgrade service type\n",
      "moduleId": "websocket",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.1"
    }
  ],
  "enums": []
};