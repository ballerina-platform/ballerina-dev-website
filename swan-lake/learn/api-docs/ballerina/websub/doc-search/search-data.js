var searchData = {
  "modules": [
    {
      "id": "websub",
      "description": "This module contains an implementation of the W3C \"WebSub\" (https://www.",
      "orgName": "ballerina",
      "version": "1.1.0"
    }
  ],
  "classes": [
    {
      "id": "IntentVerificationRequest",
      "description": " representing an intent verification request received.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "Notification",
      "description": "Represents the WebSub Content Delivery Request received.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "functions": [
    {
      "id": "extractTopicAndHubUrls",
      "description": "Retrieves hub and topic URLs from the `http:response` from a publisher to a discovery request.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "records": [
    {
      "id": "ExtensionConfig",
      "description": "The extension configuration to introduce custom subscriber services.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SubscriberListenerConfiguration",
      "description": "Represents the configuration for the WebSub Subscriber Service Listener.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SubscriberServiceConfiguration",
      "description": "Configuration for a WebSubSubscriber service.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SubscriptionChangeRequest",
      "description": "Record representing a WebSub subscription change request.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SubscriptionChangeResponse",
      "description": "Record representing subscription/unsubscription details if a subscription/unsubscription request is successful.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "constants": [
    {
      "id": "PUBLISH_MODE_DIRECT",
      "description": "`RemotePublishMode` indicating direct update content notification (fat-ping).",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "PUBLISH_MODE_FETCH",
      "description": "`RemotePublishMode` indicating that once the publisher notifies the hub that an update is available, the hub\nneeds to fetch the topic URL to identify the update content.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SHA1",
      "description": "The constant used to represent SHA-1 cryptographic hash algorithm\n",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SHA256",
      "description": "The constant used to represent SHA-256 cryptographic hash algorithm\n",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "TOPIC_ID_HEADER",
      "description": "`TopicIdentifier` indicating dispatching based solely on a header of the request.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "TOPIC_ID_HEADER_AND_PAYLOAD",
      "description": "`TopicIdentifier` indicating dispatching based on a combination of header and values specified for a key/key(s) in\nthe JSON payload of the request.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "TOPIC_ID_PAYLOAD_KEY",
      "description": "`TopicIdentifier` indicating dispatching based solely on a value for a key in the JSON payload of the request.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "errors": [
    {
      "id": "ListenerStartupError",
      "description": "Represents a listener startup error.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "WebSubError",
      "description": "Represents a webSub distinct error.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "types": [
    {
      "id": "RemotePublishMode",
      "description": "The identifier to be used to identify the mode in which update content should be identified.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SignatureMethod",
      "description": "The identifier to be used to identify the cryptographic hash algorithm.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "TopicIdentifier",
      "description": "The identifier to be used to identify the topic for dispatching with custom subscriber services.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "clients": [
    {
      "id": "Caller",
      "description": "The caller remote functions to respond to client requests.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SubscriptionClient",
      "description": "The HTTP based client for WebSub subscription and unsubscription.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "listeners": [
    {
      "id": "Listener",
      "description": "Represents the WebSubSubscriber Service Listener.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "annotations": [
    {
      "id": "SpecificSubscriber",
      "description": "Annotation to declare that the service represents a specific webhook.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    },
    {
      "id": "SubscriberServiceConfig",
      "description": "WebSub Subscriber Configuration for the service, indicating subscription related parameters.",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "abstractObjects": [
    {
      "id": "SubscriberService",
      "description": "The WebSub service type\n",
      "moduleId": "websub",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.1.0"
    }
  ],
  "enums": []
};