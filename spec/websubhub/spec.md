# Specification: Ballerina WebSubHub Library

_Owners_: @shafreenAnfar @chamil321 @ayeshLK    
_Reviewers_: @shafreenAnfar    
_Created_: 2021/11/23  
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction

This is the specification for the WebSubHub standard library of [Ballerina language](https://ballerina.io/), which provides WebSub compliant `hub` and `publisher` related functionalities.

The WebSubHub library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag. 

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents  
1. [Overview](#1-overview)  
2. [Hub](#2-hub)
   * 2.1. [Listener](#21-listener)
     * 2.1.1 [Configuration](#211-configuration)
     * 2.1.2 [Initialization](#212-initialization)
     * 2.1.3 [Methods](#213-methods)
   * 2.2. [Service](#22-service)
     * 2.2.1. [Methods](#221-methods)
       * 2.2.1.1. [onRegisterTopic](#2211-onregistertopic)
       * 2.2.1.2. [onDeregisterTopic](#2212-onderegistertopic)
       * 2.2.1.3. [onEventMessage](#2213-oneventmessage)
       * 2.2.1.4. [onSubscription](#2214-onsubscription)
       * 2.2.1.5. [onSubscriptionValidation](#2215-onsubscriptionvalidation)
       * 2.2.1.6. [onSubscriptionIntentVerified](#2216-onsubscriptionintentverified)
       * 2.2.1.7. [onUnsubscritpion](#2217-onunsubscritpion)
       * 2.2.1.8. [onUnsubscriptionValidation](#2218-onunsubscriptionvalidation)
       * 2.2.1.9. [onUnsubscriptionIntenVerified](#2219-onunsubscriptionintenverified)
     * 2.2.1. [Annotation](#222-annotation)
   * 2.3. [Hub Client](#23-hub-client)
     * 2.3.1. [Initialization](#231-initialization)
     * 2.3.2. [Distribute Content](#232-distribute-content)
3. [Publisher Client](#3-publisher-client)
4. [Common Client Configuration](#4-common-client-configuration)

## 1. Overview

[WebSub](https://www.w3.org/TR/websub/) is a real-time content delivery protocol over HTTP(S) and it is a specification 
which evolved from [PubSubHubbub](https://github.com/pubsubhubbub/PubSubHubbub).

WebSub specification describes three main roles: 
- Publisher: Advertises a `topic` and `hub` URL on one or more resource URLs.
- Subscriber: Discovers the `hub` and topic URL given a resource URL, subscribes to updates at the `hub`, and accepts 
content distribution requests from the `hub`.
- Hub: Handles subscription requests and distributes the content to subscribers when the corresponding topic URL has 
been updated.

`WebSubHub` is a library which is derived from the WebSub specification which could be used by developers to implement 
WebSub compliant `hub` services and `publisher` clients. Since WebSub specification has limited details on the 
relationship between `publisher` and `hub`, the Ballerina standard library team has made minor improvements to the 
original protocol to provide a seamless developer experience.

## 2. Hub

WebSub `hub` is the exchange point for `publisher` and `subscriber`. 

It has the following responsibilities:
* Handles/manages WebSub topics.
* Handles/manages WebSub subscriptions.
* Handles WebSub content distribution.

The `hub` is designed in the form of `listener` and `service`.
- `websubhub:Listener`: A listener end-point to which `websubhub:Service` could be attached. 
- `websubhub:Service`: An API service, which receives WebSub events.

In addition to `websubhub:Listener` and `websubhub:Service`, `websubhub:HubClient` is available which could be used to 
notify content updates to the subscribers.

### 2.1. Listener

The `websubhub:Listener` opens the given port and attaches the provided `websubhub:Service` object to the given 
service-path. `websubhub:Listener` can be initialized either by providing a port with listener configurations or by 
providing an `http:Listener`.

#### 2.1.1. Configuration 

When initializing a `websubhub:Listener`, following configurations could be provided.   
```ballerina
# Provides a set of configurations for configure the underlying HTTP listener of the WebSubHub listener.
public type ListenerConfiguration record {|
    *http:ListenerConfiguration;
|};
```

For more details on the available configurations please refer [`http:ListenerConfiguration`](https://lib.ballerina.io/ballerina/http/latest/records/ListenerConfiguration).

#### 2.1.2. Initialization

The `websubhub:Listener` could be initialized by providing either a port with `websubhub:ListenerConfiguration` or by 
providing an `http:Listener`.  
```ballerina
# Initiliazes the `websubhub:Listener` instance.
# ```ballerina
# listener websubhub:Listener hubListenerEp = check new (9090);
# ```
#
# + listenTo - Port number or an `http:Listener` instance
# + config - Custom `websubhub:ListenerConfiguration` to be provided to the underlying HTTP listener
# + return - The `websubhub:Listener` or an `websubhub:Error` if the initialization failed
public isolated function init(int|http:Listener listenTo, *ListenerConfiguration config) returns websubhub:Error? {
```

#### 2.1.3. Methods 

Following APIs should be available in the `websubhub:Listener` to dynamically attach `websubhub:Service` objects to it.  
```ballerina
# Attaches the provided `websubhub:Service` to the `websubhub:Listener`.
# ```ballerina
# check hubListenerEp.attach('service, "/hub");
# ```
# 
# + 'service - The `websubhub:Service` object to attach
# + name - The path of the service to be hosted
# + return - An `websubhub:Error` if an error occurred during the service attaching process or else `()`
public isolated function attach(websubhub:Service 'service, string[]|string? name = ()) returns websubhub:Error?
```

Following APIs should be available in the `websubhub:Listener` to dynamically detach `websubhub:Service` objects from it.
```ballerina
# Detaches the provided `websubhub:Service` from the `websubhub:Listener`.
# ```ballerina
# check hubListenerEp.detach('service);
# ```
# 
# + s - The `websubhub:Service` object to be detached
# + return - An `websubhub:Error` if an error occurred during the service detaching process or else `()`
public isolated function detach(websubhub:Service s) returns websubhub:Error?
```

Following APIs should be available to dynamically start the `websubhub:Listener`.
```ballerina
# Starts the registered service programmatically.
# ```ballerina
# check hubListenerEp.'start();
# ```
# 
# + return - An `websubhub:Error` if an error occurred during the listener-starting process or else `()`
public isolated function 'start() returns websubhub:Error?
```

Following APIs should be available to dynamically stop the `websubhub:Listener`.
```ballerina
# Gracefully stops the hub listener. Already-accepted requests will be served before the connection closure.
# ```ballerina
# check hubListenerEp.gracefulStop();
# ```
# 
# + return - An `websubhub:Error` if an error occurred during the listener-stopping process
public isolated function gracefulStop() returns websubhub:Error?

# Stops the service listener immediately.
# ```ballerina
# check hubListenerEp.immediateStop();
# ```
# 
# + return - An `websubhub:Error` if an error occurred during the listener-stopping process or else `()`
public isolated function immediateStop() returns websubhub:Error?
```

### 2.2. Service

`websubhub:Service` is responsible for handling the received events. Underlying `http:Service` will receive the original 
request, and then it will trigger the WebSubHub dispatcher which will invoke the respective remote method with the event 
details.

Following is the type-definition for `websubhub:Service`.
```ballerina
public type Service distinct service object {
    // Sample POST request hub.mode=register&hub.topic=http://foo.com/bar
    // Sample 200 OK response hub.mode=accepted or 200 OK hub.mode=denied&hub.reason=unauthorized
    remote function onRegisterTopic(websubhub:TopicRegistration msg)
        returns websubhub:TopicRegistrationSuccess|websubhub:TopicRegistrationError|error;

    // Sample POST request hub.mode=unregister&hub.topic=http://foo.com/bar
    // Sample 200 OK response hub.mode=accepted or 200 OK hub.mode=denied&hub.reason=unauthorized 
    remote function onDeregisterTopic(websubhub:TopicDeregistration msg)
        returns websubhub:TopicDeregistrationSuccess|websubhub:TopicDeregistrationError|error;

    // Sample POST request with content type x-www-form-urlencoded hub.mode=publish&hub.topic=http://foo.com/bar
    // for other content types such as xml, json and octect-stream hub.mode=publish should be in query string.
    // Sample 200 OK response hub.mode=accepted or 200 OK hub.mode=denied&hub.reason=unauthorized 
    remote function onUpdateMessage(websubhub:UpdateMessage msg)
        returns websubhub:Acknowledgement|websubhub:UpdateMessageError|error;

    // Sample POST request hub.mode=subscribe&hub.topic=http://foo.com/bar 
    remote function onSubscription(websubhub:Subscription msg)
        returns websubhub:SubscriptionAccepted|websubhub:SubscriptionPermanentRedirect|
        websubhub:SubscriptionTemporaryRedirect|websubhub:BadSubscriptionError|
        websubhub:InternalSubscriptionError|error;
        
    remote function onSubscriptionValidation(websubhub:Subscription msg)
        returns websubhub:SubscriptionDeniedError|error?;

    remote function onSubscriptionIntentVerified(websubhub:VerifiedSubscription msg) returns error?;

    // Sample POST request hub.mode=unsubscribe&hub.topic=http://foo.com/bar
    remote function onUnsubscription(websubhub:Unsubscription msg)
        returns websubhub:UnsubscriptionAccepted|websubhub:BadUnsubscriptionError|
        websubhub:InternalUnsubscriptionError|error;

    remote function onUnsubscriptionValidation(websubhub:Unsubscription msg)
        returns websubhub:UnsubscriptionDeniedError|error?;

    remote function onUnsubscriptionIntentVerified(websubhub:VerifiedUnsubscription msg) returns error?;
};
```

#### 2.2.1. Methods

##### 2.2.1.1. onRegisterTopic

This remote method is invoked when the `publisher` sends a request to register a `topic` to the `hub`.
```ballerina
# Registers a `topic` in the hub.
# 
# + msg - Details related to the topic-registration
# + return - `websubhub:TopicRegistrationSuccess` if topic registration is successful, `websubhub:TopicRegistrationError`
#            if topic registration failed or `error` if there is any unexpected error
remote function onRegisterTopic(websubhub:TopicRegistration msg)
    returns websubhub:TopicRegistrationSuccess|websubhub:TopicRegistrationError|error;
```

##### 2.2.1.2. onDeregisterTopic

This remote method is invoked when the `publisher` sends a request to remove a `topic` from the `hub`.
```ballerina
# Deregisters a `topic` in the hub.
# 
# + msg - Details related to the topic-deregistration
# + return - `websubhub:TopicDeregistrationSuccess` if topic deregistration is successful, `websubhub:TopicDeregistrationError`
#            if topic deregistration failed or `error` if there is any unexpected error
remote function onDeregisterTopic(websubhub:TopicDeregistration msg)
    returns websubhub:TopicDeregistrationSuccess|websubhub:TopicDeregistrationError|error;
```

##### 2.2.1.3. onEventMessage

This remote method is invoked when the `publisher` sends a request to notify the `hub` about content update for a 
`topic`.
```ballerina
# Publishes content to the hub.
# 
# + msg - Details of the published content
# + return - `websubhub:Acknowledgement` if publish content is successful, `websubhub:UpdateMessageError`
#            if publish content failed or `error` if there is any unexpected error
remote function onUpdateMessage(websubhub:UpdateMessage msg)
    returns websubhub:Acknowledgement|websubhub:UpdateMessageError|error;
```

##### 2.2.1.4. onSubscription

This remote method is invoked when the `subscriber` sends a request to subscribe for a `topic` in the `hub`. (This is an
optional remote method.)
```ballerina
# Subscribes a `subscriber` to the hub.
# 
# + msg - Details of the subscription
# + return - `websubhub:SubscriptionAccepted` if subscription is accepted from the hub, `websubhub:BadSubscriptionError`
#            if subscription is denied from the hub, `websubhub:SubscriptionPermanentRedirect` or a `websubhub:SubscriptionTemporaryRedirect`
#            if the subscription request is redirected from the `hub`, `websubhub:InternalSubscriptionError` if there is an internal error 
#            while processing the subscription request or `error` if there is any unexpected error
remote function onSubscription(websubhub:Subscription msg)
    returns websubhub:SubscriptionAccepted|websubhub:SubscriptionPermanentRedirect|
        websubhub:SubscriptionTemporaryRedirect|websubhub:BadSubscriptionError|
        websubhub:InternalSubscriptionError|error;
```

##### 2.2.1.5. onSubscriptionValidation

This remote method is invoked when subscription request from the `subscriber` is accepted from the `hub`. `hub` could 
enforce additional validation for the subscription request when this method is invoked. If the validations are failed 
the `hub` could deny the subscription request by responding with `websubhub:SubscriptionDeniedError`. (This is an 
optional remote method.)
```ballerina
# Validates a incomming subscription request.
# 
# + msg - Details of the subscription
# + return - `websubhub:SubscriptionDeniedError` if the subscription is denied by the hub, `error` if there is any unexpected error or else `()`
remote function onSubscriptionValidation(websubhub:Subscription msg) 
    returns websubhub:SubscriptionDeniedError|error?;
```

##### 2.2.1.6. onSubscriptionIntentVerified

This remote method is invoked after the `hub` verifies the subscription request.
```ballerina
# Processes a verified subscription request.
# 
# + msg - Details of the subscription
# + return - `error` if there is any unexpected error or else `()`
remote function onSubscriptionIntentVerified(websubhub:VerifiedSubscription msg) returns error?;
```

##### 2.2.1.7. onUnsubscritpion

This remote method is invoked when the `subscriber` sends a request to unsubscribe from a `topic` in the `hub`. (This is 
an optional remote method.)
```ballerina
# Unsubscribes a `subscriber` from the hub.
# 
# + msg - Details of the unsubscription
# + return - `websubhub:UnsubscriptionAccepted` if unsubscription is accepted from the hub, `websubhub:BadUnsubscriptionError`
#            if unsubscription is denied from the hub, `websubhub:InternalUnsubscriptionError` if there is any internal error while processing the 
#             unsubscription request or `error` if there is any unexpected error
remote function onUnsubscription(websubhub:Unsubscription msg)
    returns websubhub:UnsubscriptionAccepted|websubhub:BadUnsubscriptionError|
        websubhub:InternalUnsubscriptionError|error;
```

##### 2.2.1.8. onUnsubscriptionValidation

This remote method is invoked when unsubscription request from the `subscriber` is accepted from the `hub`. `hub` could
enforce additional validation for the unsubscription request when this method is invoked. If the validations are failed
the `hub` could deny the unsubscription request by responding with `websubhub:UnsubscriptionDeniedError`. (This is an
optional remote method.)
```ballerina
# Validates a incomming unsubscription request.
# 
# + msg - Details of the unsubscription
# + return - `websubhub:UnsubscriptionDeniedError` if the unsubscription is denied by the hub or else `()`
remote function onUnsubscriptionValidation(websubhub:Unsubscription msg) 
    returns websubhub:UnsubscriptionDeniedError|error?;
```

##### 2.2.1.9. onUnsubscriptionIntenVerified

This remote method is invoked after the `hub` verifies the unsubscription request.
```ballerina
# Processes a verified unsubscription request.
# 
# + msg - Details of the unsubscription
remote function onUnsubscriptionIntentVerified(websubhub:VerifiedUnsubscription msg) returns error?;
```

While the below remote methods are strictly WebSub compliant,
- onSubscription 
- onSubscriptionValidation
- onSubscriptionIntentVerified 
- onUnsubscritpion 
- onUnsubscriptionValidation
- onUnsubscriptionIntenVerified

The below remote functions are not, 
- onEventMessage
- onRegisterTopic
- onUnregisterTopic

This is due to the limited information in the WebSub specification on the relationship between the `publisher` and the 
`hub`.

In the event of a bad request from the `publisher` or the `subscriber`, the WebSubHub dispatcher will automatically send 
back the appropriate response to the client.

#### 2.2.2. Annotation 

Apart from the listener level configurations a `hub` will require few additional configurations. Hence, there should be 
`websubhub:ServiceConfig` a service-level-annotation for `websubhub:Service` which contains
`websubhub:ServiceConfiguration` record.
```ballerina
# Configuration for a WebSub Hub service.
#
# + leaseSeconds - The period for which the subscription is expected to be active in the `hub`
# + webHookConfig - HTTP client configurations for subscription/unsubscription intent verification
public type ServiceConfiguration record {|
    int leaseSeconds?;
    ClientConfiguration webHookConfig?;
|};
```

### 2.3. Hub Client

In accordance with the [WebSub specification](https://www.w3.org/TR/websub/#content-distribution), `WebSubHub` package 
has provided support for `websubhub:HubClient` which could be used to distribute content-updates to `subscribers`.

#### 2.3.1. Initialization

Since the relationship of the `subscriber` and the `topic` is unique in the `hub`, `websubhub:HubClient` is designed to 
be initialized per `subscription` basis. Hence, `websubhub:HubClient` could be initialized by providing 
`websubhub:Subscription` and optional `websubhub:ClientConfiguration`. 
```ballerina
# Record to represent the subscription request body.
# 
# + hub - URL of the `hub` to which the subscriber has subscribed
# + hubMode - Current `hub` action
# + hubCallback - Callback URL for subscriber to receive distributed content
# + hubTopic - Topic to which subscriber has subscribed
# + hubLeaseSeconds - Amount of time in seconds during when the subscription is valid
# + hubSecret - Secret Key to sign the distributed content
public type Subscription record {
    string hub;
    string hubMode;
    string hubCallback;
    string hubTopic;
    string? hubLeaseSeconds = ();
    string? hubSecret = ();
};

public isolated function init(websubhub:Subscription subscription, *websubhub:ClientConfiguration config) returns websubhub:Error?
```

#### 2.3.2. Distribute Content

`websubhub:HubClient` should provide following API to be used to deliver content to the `subscriber`.
```ballerina
# Record to represent a WebSub content delivery.
#
# + headers - Additional Request headers to include when distributing content
# + contentType - The content-type of the payload
# + content - The payload to be sent
public type ContentDistributionMessage record {|
    map<string|string[]>? headers = ();
    string? contentType = ();
    json|xml|string|byte[]? content;
|};

type HubClient client object {
    # Distributes the published content to the subscribers.
    # ```ballerina
    # ContentDistributionSuccess publishUpdate = check websubHubClientEP->notifyContentDistribution({ content: "This is sample content" });
    # ```
    #
    # + msg - Content to be distributed to the topic subscriber 
    # + return - An `websubhub:Error` if an exception occurred, a `websubhub:SubscriptionDeletedError` if the subscriber responded with `HTTP 410`,
    #            or else a `websubhub:ContentDistributionSuccess` for successful content delivery
    remote function notifyContentDistribution(websubhub:ContentDistributionMessage msg) 
            returns websubhub:ContentDistributionSuccess|websubhub:SubscriptionDeletedError|websubhub:Error;
};
```

## 3. Publisher Client  

WebSub `publisher`, has two main responsibilities:  
- Advertise `topics` in a `hub`  
- Publish/Update content for the `topics` registered in a `hub`

### 3.1. Initialization

`websubhub:PublisherClient` can be initialized by providing the hub URL and optional `websubhub:ClientConfiguration`. 
```ballerina
# Initializes the `websub:PublisherClient`.
# ```ballerina
# websub:PublisherClient publisherClient = check new("http://localhost:9191/websub/publish");
# ```
#
# + hubUrl    - The URL to publish/notify updates
# + config - The `websubhub:ClientConfiguration` for the underlying client or else `()`
# + return - The `websubhub:PublisherClient` or an `websubhub:Error` if the initialization failed
public isolated function init(string hubUrl, *websubhub:ClientConfiguration config) returns websubhub:Error?
```

### 3.2. Register/Deregister Topics

`websubhub:PublisherClient` could be used to register/deregister topics in a `hub`.

**registerTopic**

This remote method is invoked when the `publisher` tries to register a `topic` in a particular `hub`.
```ballerina
# Registers a topic in a Ballerina WebSub Hub to which the subscribers can subscribe and the publisher will publish updates.
# ```ballerina
# websubhub:TopicRegistrationSuccess response = check publisherClient->registerTopic("http://websubpubtopic.com");
# ```
#
# + topic - The topic to register
# + return - A `websubhub:TopicRegistrationError` if an error occurred registering the topic or else `websubhub:TopicRegistrationSuccess`
remote function registerTopic(string topic) returns websubhub:TopicRegistrationSuccess|websubhub:TopicRegistrationError
```

**deregisterTopic**

This remote method is invoked when the `publisher` tries to deregister a `topic` from a particular `hub`.
```ballerina
# Deregisters a topic in a Ballerina WebSub Hub.
# ```ballerina
# websubhub:TopicDeregistrationSuccess response = check publisherClient->deregisterTopic("http://websubpubtopic.com");
# ```
#
# + topic - The topic to deregister
# + return - A `websubhub:TopicDeregistrationError` if an error occurred un registering the topic or else `websubhub:TopicDeregistrationSuccess`
remote function deregisterTopic(string topic) returns websubhub:TopicDeregistrationSuccess|websubhub:TopicDeregistrationError
```

### 3.2. Update Content

`websubhub:PublisherClient` has the capability to notify the content-update for a `topic` to the `hub`.

**publishUpdate**

This remote method is used to directly send the content-update for a `topic` to the `hub`.
```ballerina
# Publishes an update to a remote Ballerina WebSub Hub.
# ```ballerina
# websubhub:Acknowledgement response = check publisherClient->publishUpdate("http://websubpubtopic.com",{"action": "publish",
# "mode": "remote-hub"});
# ```
#
# + topic - The topic for which the update occurred
# + payload - The update payload
# + contentType - The type of the update content to set as the `ContentType` header
# + return - A `websubhub:UpdateMessageError`if an error occurred with the update or else `websubhub:Acknowledgement`
remote function publishUpdate(string topic, map<string>|string|xml|json|byte[] payload, string? contentType = ()) 
    returns websubhub:Acknowledgement|websubhub:UpdateMessageError
```

**notifyUpdate**

This remote method is used to notify the `hub`, that the `topic` has been updated.
```ballerina
# Notifies a remote WebSubHub from which an update is available to fetch for hubs that require publishing.
# ```ballerina
#  websubhub:Acknowledgement|websubhub:UpdateMessageError response = check publisherClient->notifyUpdate("http://websubpubtopic.com");
# ```
#
# + topic - The topic for which the update occurred
# + return - A `websubhub:UpdateMessageError` if an error occurred with the notification or else `websubhub:Acknowledgement`
remote function notifyUpdate(string topic) returns websubhub:Acknowledgement|websubhub:UpdateMessageError
```

### 4. Common Client Configuration

WebSubHub library provides following client configurations to be used when initializing `websubhub:HubClient`/`websubhub:PublisherClient`.
```ballerina
# Record to represent client configuration for HubClient / PublisherClient
# 
# + httpVersion - The HTTP version understood by the client
# + http1Settings - Configurations related to HTTP/1.x protocol
# + http2Settings - Configurations related to HTTP/2 protocol
# + timeout - The maximum time to wait (in seconds) for a response before closing the connection
# + poolConfig - Configurations associated with request pooling
# + auth - Configurations related to client authentication
# + retryConfig - Configurations associated with retrying
# + responseLimits - Configurations associated with inbound response size limits
# + secureSocket - SSL/TLS related options
# + circuitBreaker - Configurations associated with the behaviour of the Circuit Breaker
public type ClientConfiguration record {|
    string httpVersion = HTTP_1_1;
    http:ClientHttp1Settings http1Settings = {};
    http:ClientHttp2Settings http2Settings = {};
    decimal timeout = 60;
    http:PoolConfiguration poolConfig?;
    http:ClientAuthConfig auth?;
    http:RetryConfig retryConfig?;
    http:ResponseLimitConfigs responseLimits = {};
    http:ClientSecureSocket secureSocket?;
    http:CircuitBreakerConfig circuitBreaker?;
|};
```
