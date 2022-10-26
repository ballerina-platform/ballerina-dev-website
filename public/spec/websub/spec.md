# Specification: Ballerina WebSub Library

_Owners_: @shafreenAnfar @chamil321 @ayeshLK    
_Reviewers_: @chamil321    
_Created_: 2022/01/31  
_Updated_: 2022/05/23  
_Edition_: Swan Lake  

## Introduction 

This is the specification for the WebSub standard library of [Ballerina language](https://ballerina.io/), which provides WebSub compliant `subscriber` related functionalities.

The WebSub library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag. 

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Content
1. [Overview](#1-overview)
2. [Subscriber](#2-subscriber)
    * 2.1. [Listener](#21-listener)
      * 2.1.1. [Configuration](#211-configuration)
      * 2.1.2. [Initialization](#212-initialization)
      * 2.1.3. [Methods](#213-methods)
    * 2.2 [Subscriber Service](#22-subscriber-service)
      * 2.2.1. [Methods](#221-methods)
        * 2.2.1.1. [onSubscriptionValidationDenied](#2211-onsubscriptionvalidationdenied)
        * 2.2.1.2. [onSubscriptionVerification](#2212-onsubscriptionverification)
        * 2.2.1.3. [onUnsubscriptionVerification](#2213-onunsubscriptionverification)
        * 2.2.1.4. [onEventNotification](#2214-oneventnotification)
      * 2.2.2. [Annotation](#222-annotation)
      * 2.2.3. [Callback URL Generation](#223-callback-url-generation)
        * 2.2.3.1 [Service Path Generation](#2231-service-path-generation)
      * 2.2.4. [Unsubscribing from the `hub`](#224-unsubscribing-from-the-hub)

## 1. Overview

[WebSub](https://www.w3.org/TR/websub/) is a real-time content delivery protocol over HTTP(S) and it is a specification
which evolved from [PubSubHubbub](https://github.com/pubsubhubbub/PubSubHubbub).

WebSub specification describes three main roles:
- Publisher: Advertises a `topic` and `hub` URL on one or more resource URLs.
- Subscriber: Discovers the `hub` and `topic` URL given a resource URL, subscribes to updates at the `hub`, and accepts
  content distribution requests from the `hub`.
- Hub: Handles subscription requests and distributes the content to subscribers when the corresponding topic URL has
  been updated.

`WebSub` is a library which is derived from the WebSub specification which could be used by developers to implement
WebSub compliant `subscriber` services.  

## 2. Subscriber

WebSub `subscriber` will subscribe to a `hub` to receive content updates for a `topic`.  

It has the following capabilities:
* Discover the `hub` and the `topic` given a resource URL
* Subscribe to content updates for a `topic` in a `hub`
* Accept content distribution requests from the `hub`

The `subscriber` is designed in the form of `listener` and `Subscriber Service`.
- `websub:Listener`: A listener end-point to which `websub:SubscriberService` could be attached.
- `websub:SubscriberService`: An API service, which receives events.

### 2.1. Listener

The `websub:Listener` opens the given port and attaches the provided `websub:SubscriberService` object to the given
service-path. `websub:Listener` can be initialized either by providing a port with listener configurations or by
providing an `http:Listener`.

#### 2.1.1. Configuration

When initializing a `websub:Listener`, following configurations could be provided.
```ballerina
# Provides a set of configurations for configure the underlying HTTP listener of the WebSub listener.
# 
# + gracefulShutdownPeriod - The time period in seconds to wait for unsubscription verification
public type ListenerConfiguration record {|
    *http:ListenerConfiguration;
    decimal gracefulShutdownPeriod = 20;
|};
```

For more details on the available configurations please refer [`http:ListenerConfiguration`](https://lib.ballerina.io/ballerina/http/latest/records/ListenerConfiguration).

#### 2.1.2. Initialization

The `websub:Listener` could be initialized by providing either a port with `websub:ListenerConfiguration` or by
providing an `http:Listener`.
```ballerina
# Initiliazes `websub:Listener` instance.
# ```
# listener websub:Listener websubListenerEp = check new (9090);
# ```
#
# + listenTo - Port number or a `http:Listener` instance
# + config - Custom `websub:ListenerConfiguration` to be provided to underlying HTTP Listener
# + return - The `websub:Listener` or an `websub:Error` if the initialization failed
public isolated function init(int|http:Listener listenTo, *ListenerConfiguration config) returns websub:Error? 
```

#### 2.1.3. Methods

Following APIs should be available in the `websub:Listener` to dynamically attach `websub:SubscriberService` objects to 
it.
```ballerina
# Attaches the provided `websub:SubscriberService` to the `websub:Listener`.
# ```
# check websubListenerEp.attach('service, "/subscriber");
# ```
# 
# + service - The `websub:SubscriberService` object to attach
# + name - The path of the Service to be hosted
# + return - An `websub:Error`, if an error occurred during the service attaching process or else `()`
public isolated function attach(websub:SubscriberService 'service, string[]|string? name = ()) returns websub:Error?
```

Following APIs should be available in the `websub:Listener` to dynamically attach `websub:SubscriberService` objects 
along with `websub:SubscriberServiceConfiguration`. This is useful when the `subscriber` is implemented using a service class.
```ballerina
# Attaches the provided Service to the `websub:Listener` with custom `websub:SubscriberServiceConfiguration`.
# ```
# check websubListenerEp.attachWithConfig('service, {
#    target: "http://0.0.0.0:9191/common/discovery",
#    leaseSeconds: 36000
# }, "/subscriber");
# ```
# 
# + service - The `websub:SubscriberService` object to attach
# + configuration - Custom `websub:SubscriberServiceConfiguration` which should be incorporated into the provided Service 
# + name - The path of the Service to be hosted
# + return - An `websub:Error`, if an error occurred during the service attaching process or else `()`
public isolated function attachWithConfig(websub:SubscriberService 'service, websub:SubscriberServiceConfiguration configuration, string[]|string? name = ()) returns websub:Error?
```

Following APIs should be available in the `websub:Listener` to dynamically detach `websub:SubscriberService` objects 
from it.
```ballerina
# Detaches the provided `websub:SubscriberService` from the `websub:Listener`.
# ```
# check websubListenerEp.detach('service);
# ```
# 
# + service - The `websub:SubscriberService` object to be detached
# + return - An `websub:Error`, if an error occurred during the service detaching process or else `()`
public isolated function detach(websub:SubscriberService 'service) returns websub:Error?
```

Following APIs should be available to dynamically start the `websub:Listener`.
```ballerina
# Starts the registered service programmatically..
# ```
# check websubListenerEp.'start();
# ```
# 
# + return - An `websub:Error`, if an error occurred during the listener starting process or else `()`
public isolated function 'start() returns websub:Error?
```

Following APIs should be available to dynamically stop the `websub:Listener`.
```ballerina
# Stops the service listener gracefully. Already-accepted requests will be served before connection closure.
# ```
# check websubListenerEp.gracefulStop();
# ```
# 
# + return - An `websub:Error`, if an error occurred during the listener stopping process or else `()`
public isolated function gracefulStop() returns websub:Error?

# Stops the service listener immediately.
# ```
# check websubListenerEp.immediateStop();
# ```
# 
# + return - An `websub:Error`, if an error occurred during the listener stopping process or else `()`
public isolated function immediateStop() returns websub:Error?
```

### 2.2. Subscriber Service

`websub:SubscriberService` is responsible for handling the received events. Underlying `http:Service` will receive the 
original request, and then it will trigger the WebSub dispatcher which will invoke the respective remote method with the 
event details.

Following is the type-definition for `websub:SubscriberService`.
```ballerina
public type SubscriberService distinct service object {
    // Sample GET request hub.mode=denied&hub.reason=unauthorized
    // Sample 200 OK response
    remote function onSubscriptionValidationDenied(websub:SubscriptionDeniedError msg)
        returns websub:Acknowledgement|error?;

    // Sample GET request hub.mode=subscribe&hub.topic=test&hub.challenge=1234
    // Sample 200 OK response with text payload containing received `hub.challenge` parameter or 404 NOT FOUND
    remote function onSubscriptionVerification(websub:SubscriptionVerification msg)
        returns websub:SubscriptionVerificationSuccess|websub:SubscriptionVerificationError|error;

    // Sample GET request hub.mode=unsubscribe&hub.topic=test&hub.challenge=1234
    // Sample 200 OK response with text payload containing received `hub.challenge` parameter or 404 NOT FOUND
    remote function onUnsubscriptionVerification(websub:UnsubscriptionVerification msg)
        returns websub:UnsubscriptionVerificationSuccess|websub:UnsubscriptionVerificationError|error;

    // Sample POST request with string/json/xml payload
    // Sample 202 ACCEPTED response or 410 GONE
    remote function onEventNotification(websub:ContentDistributionMessage event)
        returns websub:Acknowledgement|websub:SubscriptionDeletedError|error?;
};
```

#### 2.2.1. Methods

##### 2.2.1.1. onSubscriptionValidationDenied

This remote method is invoked when the `hub` sends a request to notify that the subscription request is denied.
```ballerina
# Notifies that the subscription request is denied by the `hub`.
# 
# + msg - Details related to the subscription denial
# + return - `error` if there is any error when processing the reuqest or else `websub:Acknowledgement` or `()`
remote function onSubscriptionValidationDenied(websub:SubscriptionDeniedError msg) returns websub:Acknowledgement|error?;
```

##### 2.2.1.2. onSubscriptionVerification

This remote method is invoked when the `hub` sends a subscription verification request to the `subscriber`.
```ballerina
# Verifies the subscription attempt.
# 
# + msg - Details related to the subscription verificaiton
# + return - `websub:SubscriptionVerificationSuccess` if the subscription is verified successfully, 
#           `websub:SubscriptionVerificationError` if the subscription verification is unsuccessful or else `error` if 
#           there is an exception while executing the method
remote function onSubscriptionVerification(websub:SubscriptionVerification msg) 
    returns websub:SubscriptionVerificationSuccess|websub:SubscriptionVerificationError|error;
```

##### 2.2.1.3. onUnsubscriptionVerification

This remote method is invoked when the `hub` sends a unsubscription verification request to the `subscriber`.
```ballerina
# Verifies the unsubscription attempt.
# 
# + msg - Details related to the unsubscription verificaiton
# + return - `websub:UnsubscriptionVerificationSuccess` if the unsubscription is verified successfully, 
#           `websub:UnsubscriptionVerificationError` if the unsubscription verification is unsuccessful or else `error` if 
#           there is an exception while executing the method
remote function onUnsubscriptionVerification(websub:UnsubscriptionVerification msg) 
    returns websub:UnsubscriptionVerificationSuccess|websub:UnsubscriptionVerificationError|error;
```

##### 2.2.1.4. onEventNotification

This remote method is invoked when the `hub` sends a content-distribution request to the `subscriber`.
```ballerina
# Notifies the content distribution.
# 
# + msg - Received content distribution message
# + return - `websub:Acknowledgement` if the content received successfully, `websub:SubscriptionDeletedError` if the 
#           subscriber does not need any content updates in the future, `error` if  there is an exception while 
#           executing the method or else `()`
remote function onEventNotification(websub:ContentDistributionMessage event) 
    returns websub:Acknowledgement|websub:SubscriptionDeletedError|error?;
```

#### 2.2.2. Annotation 

Apart from the listener level configurations a `subscriber` will require few additional configurations. Hence, there 
should be `websub:SubscriberServiceConfig` a service-level-annotation for `websub:SubscriberService` which contains
`websub:SubscriberServiceConfiguration` record.
```ballerina
# Configuration for a WebSubSubscriber service.
#
# + target - The `string` resource URL for which discovery will be initiated to identify the hub and topic,
#            or a tuple `[hub, topic]` representing a discovered hub and a topic
# + leaseSeconds - The period for which the subscription is expected to be active
# + callback - The callback URL for subscriber-service
# + secret - The secret to be used for authenticated content distribution
# + appendServicePath - This flag notifies whether or not to append service-path to callback-url
# + unsubscribeOnShutdown - This flag notifies whether or not to initiate unsubscription when the service is shutting down
# + httpConfig - The configuration for the hub client used to interact with the discovered/specified hub
# + discoveryConfig - HTTP client configurations for resource discovery
# + servicePath - The generated service-path if the service-path is not provided. This is auto-generated at the compile-time
public type SubscriberServiceConfiguration record {|
    string|[string, string] target?;
    int leaseSeconds?;
    string callback?;
    string secret?;
    boolean appendServicePath = false;
    boolean unsubscribeOnShutdown = false;
    http:ClientConfiguration httpConfig?;
    record {|
        string|string[] accept?;
        string|string[] acceptLanguage?;
        http:ClientConfiguration httpConfig?;
    |} discoveryConfig?;
    readonly byte[] servicePath = [];
|};
```

#### 2.2.3. Callback URL Generation 

As per the [WebSub specification](https://www.w3.org/TR/websub/#subscriber-sends-subscription-request) subscriber 
callback URL could be used as an identity of a `subscriber` at the `hub` level, and it should be unguessable and unique 
for a subscription.

Since the developer should have the control over the callback URL to be used when subscribing to a `hub`, `websub:SubscriberServiceConfig` annotation contains an optional configuration(`callback`) to be used to provide a callback URL. If the `callback` is not configured, `websub:SubscriberService` should be able to construct the callback URL using the provided `websub:ListenerConfiguration` and service path.  

##### 2.2.3.1. Service Path Generation

In ballerina service declaration, service path is an optional configuration. Hence, developers could declare 
`websub:SubscriberService` by omitting the service path. Since, service path is required for constructing the callback 
URL, `websub:SubscriberService` should be able to generate a unique, unguessable URL segment to be used as its service 
path.

Service path generation should be implemented with following guidelines:  
- Service path should be generated only if;
  - Service path and callback URL is not provided for the `websub:SubscriberService`.
  - callback URL is provided, `appendServicePath` configuration is enabled and service path is not provided.
- WebSub compiler plugin will generate unique service path for the `websub:SubscriberService` and populate `servicePath` field in `websub:SubscriberServiceConfig` annotation.
- If there is an error while generating the service path, then it should result in a compile-time error since this feature is required to generate a callback URL and without it subscriber service could not be used.
- If the callback URL is provided without the service path then the `websub:SubscriberService` will be attached to the default service path which is `/`.

#### 2.2.4. Unsubscribing from the `hub`

As per the WebSub Specification a `subscriber` should be able to subscribe to a particular `topic` in a specific `hub`. 
As the counterpart subscriber should be able to unsubscribe from a previously subscribed `topic` in a specific `hub`. 
Even though the specification does not clearly define when this unsubscription should happen, it is obvious that this 
should happen whenever `subscriber` is terminated.  

The key functionalities expected from the unsubscription flow as follows:  
- Developer should manually enable this feature by configuring `unsubscribeOnShutdown` in `websub:SubscriberServiceConfig` annotation.
- Developer should be able to configure unsubscription verification time-out using `gracefulShutdownPeriod` configuration in `websub:ListenerConfiguration`.
- Unsubscription flow should be initiated whenever the graceful stop is invoked in `websub:Listener`.
- If multiple `websub:SubscriberService` instances are attached to one `websub:Listener`, all the subscriber instances which have enabled `unsubscribeOnShutdown` should initiate unsubscription on listener shutdown.  
- Unsubscription flow should be initiated only if `graceful stop` is invoked, and will not be executed for `immediate stop` .  
