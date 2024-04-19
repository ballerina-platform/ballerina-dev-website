# Specification: Ballerina `java.jms` Library

_Owners_: @shafreenAnfar @ayeshLK \
_Reviewers_: @shafreenAnfar \
_Created_: 2023/08/15 \
_Updated_: 2024/02/02 \
_Edition_: Swan Lake 

## Introduction  

This is the specification for the `java.jms` standard library of [Ballerina language](https://ballerina.io/), which provides the 
functionality to send and receive messages by connecting to a JMS provider. 

The `java.jms` library specification has evolved and may continue to evolve in the future. The released versions of the 
specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a GitHub issue or in the Discord 
server. Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback 
is always welcome. Any accepted proposal which affects the specification is stored under `/docs/proposals`. Proposals 
under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released to Ballerina Central. Any deviation from the 
specification is considered a bug.

## Content  
1. [Overview](#1-overview)
2. [Connection](#2-connection)
    * 2.1. [Configuration](#21-configuration)
    * 2.2. [Initialization](#22-initialization)
    * 2.3. [Functions](#23-functions)
3. [Session](#3-session)
    * 3.1. [Configuration](#31-configuration)
    * 3.2. [Functions](#32-functions)
4. [Message](#4-message)
5. [Message producer](#5-message-producer)
   * 5.1. [Functions](#51-functions)
6. [Message consumer](#6-message-consumer)
   * 6.1. [Functions](#61-functions)
7. [Message listener](#7-message-listener)
   * 7.1. [Configuration](#71-configuration)
   * 7.2. [Initialization](#72-initialization)
   * 7.3. [Functions](#73-functions)
   * 7.4. [Caller](#74-caller)
     * 7.4.1. [Functions](#741-functions)
   * 7.5. [Usage](#75-usage)

## 1. Overview  

Java Message Service (JMS) is a Java-based API that provides a standardized way for applications to create, send, 
receive, and consume messages in a loosely coupled, reliable, and asynchronous manner. JMS is part of the Java EE 
(Enterprise Edition) specification and is commonly used for building distributed, decoupled, and scalable applications 
that need to exchange information or events between different components. This specification elaborates on the usage of 
JMS connection, session, message producer, and message consumer. These clients allow the writing of distributed applications 
and microservices that read, write, and process messages using a JMS provider. 

Ballerina `java.jms` provides several core apis:
- `jms:Connection` - represents a communication link between JMS client and JMS provider.
- `jms:Session` - represents a single-threaded context for producing and consuming messages.
- `jms:MessageProducer` - used to send messages to a specific destination (queue or a topic) within the JMS session.
- `jms:MessageConsumer` - used to receive messages from a specific destination (queue or a topic) within the JMS session.
- `jms:Listener` - used to receive messages from a specific destination (queue or a topic) in an asynchronous manner.

## 2. Connection

A JMS connection represents a communication link between a JMS client and a JMS provider (typically a messaging broker). 
It's established using a JMS connection factory. The connection manages underlying resources, such as network 
connections, and provides a context for creating JMS sessions.

### 2.1. Configuration

When initializing a `jms:Connection`, the following configurations can be provided.
```ballerina
# Configurations related to a JMS connection.
#
# + initialContextFactory - JMS provider-specific inital context factory
# + providerUrl - JMS provider specific provider URL used to configure a connection
# + connectionFactoryName - JMS connection factory to be used in creating JMS connections
# + username - Username for the JMS connection
# + password - Password for the JMS connection
# + properties - Additional properties use in initializing the initial context
public type ConnectionConfiguration record {|
    string initialContextFactory;
    string providerUrl;
    string connectionFactoryName = "ConnectionFactory";
    string username?;
    string password?;
    map<string> properties = {};
|};
```

### 2.2. Initialization

The `jms:Connection` can be initialized by providing the `jms:ConnectionConfiguration`.
```ballerina
# Initialize and starts a JMS connection.
# ```
# jms:Connection connection = check new (
#   initialContextFactory = "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
#   providerUrl = "tcp://localhost:61616"
# );
# ```
#
# + connectionConfig - The configurations to be used when initializing the JMS connection
# + return - The `jms:Connection` or an `jms:Error` if the initialization failed
public isolated function init(*jms:ConnectionConfiguration connectionConfig) returns jms:Error?;
```

### 2.3. Functions

To start (or restart) a connection's delivery of incoming messages for a connection, the `'start` function can be used.
```ballerina
# Starts (or restarts) a connection's delivery of incoming messages.
# A call to start on a connection that has already been started is ignored.
# ```
# check connection->'start()
# ```
#
# + return - A `jms:Error` if there is an error while starting the connection
isolated remote function 'start() returns jms:Error?;
```

To temporarily stop the connection's delivery of incoming messages for a connection, the `stop` function can be used.
```ballerina
# Temporarily stops a connection's delivery of incoming messages.
# Delivery can be restarted using the connection's start method.
# ```
# check connection->stop();
# ```
#
# + return - A `jms:Error` if there is an error while stopping the connection
isolated remote function stop() returns jms:Error?;
```

To close the JMS connection, the `close` function can be used.
```ballerina
# Closes the connection.
# ```
# check connection->close();
# ```
#
# + return - A `jms:Error` if threre is an error while closing the connection
isolated remote function close() returns jms:Error?;
```

To initialize a new `jms:Session`, the `createSession` function can be used.
```ballerina
# Defines the JMS session acknowledgement modes.
public enum AcknowledgementMode {
    # Indicates that the session will use a local transaction which may subsequently 
    # be committed or rolled back by calling the session's `commit` or `rollback` methods. 
    SESSION_TRANSACTED = "SESSION_TRANSACTED",
    # Indicates that the session automatically acknowledges a client's receipt of a message 
    # either when the session has successfully returned from a call to `receive` or when 
    # the message listener the session has called to process the message successfully returns.
    AUTO_ACKNOWLEDGE = "AUTO_ACKNOWLEDGE",
    # Indicates that the client acknowledges a consumed message by calling the 
    # MessageConsumer's or Caller's `acknowledge` method. Acknowledging a consumed message 
    # acknowledges all messages that the session has consumed.
    CLIENT_ACKNOWLEDGE = "CLIENT_ACKNOWLEDGE",
    # Indicates that the session lazily acknowledges the delivery of messages. 
    # This is likely to result in the delivery of some duplicate messages if the JMS provider fails, 
    # so it should only be used by consumers that can tolerate duplicate messages. 
    # Use of this mode can reduce session overhead by minimizing the work the session does to prevent duplicates.
    DUPS_OK_ACKNOWLEDGE = "DUPS_OK_ACKNOWLEDGE"
}

# Create a Session object, specifying transacted and acknowledgeMode.
# ```
# jms:Session session = check connection->createSession();
# ```
#
# + ackMode - Configuration indicating how messages received by the session will be acknowledged
# + return - Returns the Session or an error if it fails.
isolated remote function createSession(AcknowledgementMode ackMode = AUTO_ACKNOWLEDGE) returns jms:Session|jms:Error;
```

## 3. Session

A JMS session is a single-threaded context for producing and consuming messages. It's created from a JMS connection and 
provides the environment in which messages are sent and received. Sessions can be transactional or non-transactional. 
In a transactional session, multiple messages can be sent or received as part of a single transaction, and the 
transaction is committed or rolled back at the end. Non-transactional sessions handle messages one at a time without 
involving transactions.

### 3.1. Configuration

`jms:Destination` record corresponds to a JMS destination.
```ballerina
# Represent the JMS destination.
#
# + 'type - JMS destination types  
# + name - Name of the destination
public type Destination readonly & record {|
    DestinationType 'type;
    string name?;
|};

# Defines the supported JMS destination types.
public enum DestinationType {
    # Represents JMS Queue
    QUEUE = "QUEUE", 
    # Represents JMS Temporary Queue
    TEMPORARY_QUEUE = "TEMPORARY_QUEUE", 
    # Represents JMS Topic
    TOPIC = "TOPIC", 
    # Represents JMS Temporary Topic
    TEMPORARY_TOPIC = "TEMPORARY_TOPIC"
}
```

`jms:ConsumerOptions` record corresponds to the configurations related to a JMS message consumer.
```ballerina
# Defines the supported JMS message consumer types.
public enum ConsumerType {
    # Represents JMS durable subscriber
    DURABLE = "DURABLE", 
    # Represents JMS shared consumer
    SHARED = "SHARED", 
    # Represents JMS shared durable subscriber
    SHARED_DURABLE = "SHARED_DURABLE", 
    # Represents JMS default consumer
    DEFAULT = "DEFAULT"
}

# Message consumer listener configurations.
#
# + type - Message consumer type
# + destination - Name of the JMS destination
# + messageSelector - only messages with properties matching the message selector expression are added to the durable subscription. 
#                     An empty string indicates that there is no message selector for the durable subscription.
# + noLocal - if true then any messages published to the topic using this session's connection, or any other connection 
#             with the same client identifier, will not be added to the durable subscription.
# + subscriberName - the name used to identify the subscription 
public type ConsumerOptions record {|
    jms:ConsumerType 'type = DEFAULT;
    jms:Destination destination;
    string messageSelector = "";
    boolean noLocal = false;
    string subscriberName?;
|};
```

### 3.2. Functions

To unsubscribe a durable subscription that has been created by the JMS session, `unsubscribe` function can be used.
```ballerina
# Unsubscribe a durable subscription that has been created by this session.
# It is erroneous for a client to delete a durable subscription while there is an active (not closed) consumer
# for the subscription, or while a consumed message is part of a pending transaction or has not been
# acknowledged in the session.
# ```
# check session->unsubscribe("subscription-1");
# ```
#
# + subscriptionId - The name, which is used to identify the subscription
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function unsubscribe(string subscriptionId) returns jms:Error?;
```

To create a new `jms:MessageProducer` using the JMS session, `createProducer` function can be used.
```ballerina
# Creates a MessageProducer to send messages to the specified destination.
# ```
# jms:MessageProducer producer = check session.createProducer({
#   'type: jms:QUEUE,
#   name: "test-queue"
# });
# ```
#
# + destination - The Destination to send to, or nil if this is a producer which does not have a specified destination
# + return - Returns `jms:MessageProducer` or `jms:Error` if there is an error
public isolated function createProducer(jms:Destination? destination = ()) returns jms:MessageProducer|jms:Error;
```

To create a new `jms:MessageConsumer` using the JMS session, `createConsumer` function can be used.
```ballerina
# Creates a MessageConsumer for the specified destination.
# ```
# jms:MessageConsumer consumer = check session.createConsumer(destination = {
#   'type: jms:QUEUE,
#   name: "test-queue"
# });
# ```
#
# + consumerOptions - The relevant consumer configurations
# + return - Returns a `jms:MessageConsumer` or else `jms:Error` if there is an error
public isolated function createConsumer(*jms:ConsumerOptions consumerOptions) returns jms:MessageConsumer|jms:Error;
```

To commit all the messages sent/received in this transaction and release any locks currently held, `'commit` function 
can be used.
```ballerina
# Commits all messages sent/received in this transaction and releases any locks currently held.
# ```
# check session->'commit();
# ```
# 
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function 'commit() returns jms:Error?;
```

To rollback all the messages sent/received in this transaction and release any locks currently held, `'rollback` 
function can be used.
```ballerina
# Rolls back any messages sent/received in this transaction and releases any locks currently held.
# ```
# check session->'rollback();
# ```
# 
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function 'rollback() returns jms:Error?;
```

To close the current JMS session, `close` function can be used.
```ballerina
# Closes the current JMS session.
# ```ballerina
# check session->close();
# ```
# 
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function close() returns jms:Error?;
```

## 4. Message

A JMS message is a unit of data representing information that is exchanged between components using the Java Message 
Service (JMS) API. Messages can contain various types of data, such as text, binary data, maps, and objects. 
Ballerina `java.jms` library supports messages of type text, binary data, and maps.
```ballerina
# Represent the JMS Message used to send and receive content from the a JMS provider.
#
# + messageId - Unique identifier for a JMS message  
# + timestamp - Time a message was handed off to a provider to be sent 
# + correlationId - Id which can be used to correlate multiple messages 
# + replyTo - JMS destination to which a reply to this message should be sent
# + destination - JMS destination of this message 
# + deliveryMode - Delivery mode of this message  
# + redelivered - Indication of whether this message is being redelivered
# + jmsType - Message type identifier supplied by the client when the message was sent  
# + expiration - Message expiration time  
# + deliveredTime - The earliest time when a JMS provider may deliver the message to a consumer  
# + priority - Message priority level  
# + properties - Additional message properties
public type Message record {
    string messageId?;
    int timestamp?;
    string correlationId?;
    jms:Destination replyTo?;
    jms:Destination destination?;
    int deliveryMode?;
    boolean redelivered?;
    string jmsType?;
    int expiration?;
    int deliveredTime?;
    int priority?;
    map<anydata> properties?;
};

# Represent the JMS Text Message.
# 
# + content - Message content  
public type TextMessage record {|
    *jms:Message;
    string content;
|};

# Represent the JMS Map Message.
# 
# + content - Message content 
public type MapMessage record {|
    *jms:Message;
    map<anydata> content;
|};

# Represent the JMS Bytes Message.
# 
# + content - Message content 
public type BytesMessage record {|
    *jms:Message;
    byte[] content;
|};
```

## 5. Message producer

A JMS message producer is responsible for sending messages to a specific destination (queue or topic) within a JMS 
session.

### 5.1. Functions

To send a message to the pre-configured default destination of the JMS message producer, `send` function can be used.
```ballerina
# Sends a message to the JMS provider.
# ```
# check producer->send(message);
# ```
#
# + message - Message to be sent to the JMS provider
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function send(jms:Message message) returns jms:Error?;
```

To send a message to a given destination, `sendTo` function can be used.
```ballerina
# Sends a message to a given destination of the JMS provider.
# ```
# check producer->sendTo({ 'type: QUEUE, name: "test-queue" }, message);
# ```
#
# + destination - Destination used for the message sender
# + message - Message to be sent to the JMS provider
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function sendTo(jms:Destination destination, jms:Message message) returns jms:Error?;
```

To close the message producer, `close` function can be used.
```ballerina
# Closes the message producer.
# ``` 
# check producer->close();
# ```
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function close() returns jms:Error?;
```

## 6. Message consumer

A JMS message consumer is used to receive messages from a specific destination (queue or topic) within a JMS session. 
It's created from a JMS session and provides methods to receive messages synchronously.

### 6.1. Functions

To receive the next message arriving within the specified timeout interval, `receive` function can be used.
```ballerina
# Receives the next message that arrives within the specified timeout interval.
# ```
# jms:Message message = check consumer->receive(10000);
# ```
#
# + timeoutMillis - Message receive timeout
# + return - A `jms:JmsMessage` if there is a new message, `()` if there is no new message, 
# or else a `jsm:Error` if there is an error in the execution
isolated remote function receive(int timeoutMillis = 10000) returns jms:Message|jms:Error?;
```

To receive the next message if one is immediately available, `receiveNoWait` function can be used.
```ballerina
# Receives the next message if one is immediately available.
# ```
# jms:Message? message = check consumer->receiveNoWait();
# ```
# 
# + return - A `jms:JmsMessage` if there is a new message, `()` if there is no any new message, 
# or else a `jsm:Error` if there is an error in the execution
isolated remote function receiveNoWait() returns jms:Message|jms:Error?;
```

To mark a JMS message as received, the `acknowledge` function can be used.
```ballerina
# Mark a JMS message as received.
# ```
# check consumer->acknowledge(message);
# ```
#
# + message - JMS message record
# + return - A `jms:Error` if there is an error in the execution or else `()`
isolated remote function acknowledge(jms:Message message) returns jms:Error?;
```

To close the JMS consumer, `close` function can be used.
```ballerina
# Closes the message consumer.
# ```
# check consumer->close();
# ```
#
# + return - A `jms:Error` if there is an error or else `()`
isolated remote function close() returns jms:Error?;
```

## 7. Message listener

A JMS message listener is a mechanism for asynchronously receiving messages using event-driven programming. Instead of 
actively polling for messages, you can register a message listener. Upon the arrival of a message at the subscribed 
destination of the message listener, the callback method of the registered listener is triggered.

### 7.1. Configuration

When initializing a `jms:Listener`, the following configurations can be provided.
```ballerina
# Message listener configurations.
#
# + connectionConfig - Configurations related to the broker connection  
# + acknowledgementMode - Configuration indicating how messages received by the session will be acknowledged
# + consumerOptions - Underlying JMS message consumer configurations
public type MessageListenerConfigurations record {|
    ConnectionConfiguration connectionConfig;
    AcknowledgementMode acknowledgementMode = AUTO_ACKNOWLEDGE;
    ConsumerOptions consumerOptions;
|};
```

### 7.2. Initialization

The `jms:Listener` can be initialized by providing the `jms:MessageListenerConfigurations`.
```ballerina
# Creates a new `jms:Listener`.
# ```ballerina
# listener jms:Listener messageListener = check new(
#   connectionConfig = {
#       initialContextFactory: "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
#       providerUrl: "tcp://localhost:61616"
#   },
#   consumerOptions = {
#       destination: {
#           'type: jms:QUEUE,
#           name: "test-queue"
#       }
#   }
# );
# ```
# 
# + consumerConfig - Underlying JMS consumer configurations
# + return - The relevant JMS consumer or a `jms:Error` if there is any error
public isolated function init(*jms:MessageListenerConfigurations listenerConfig) returns jms:Error?;
```

### 7.3. Functions

To attach a service to the listener, `attach` function can be used.
```ballerina
# Attaches a message consumer service to a listener.
# ```
# check messageListener.attach(jmsService);
# ```
# 
# + 'service - The service instance
# + name - Name of the service
# + return - A `jms:Error` if there is an error or else `()`
public isolated function attach(jms:Service 'service, string[]|string? name = ()) returns jms:Error?;
```

To detach a service from the listener, `detach` function can be used.
```ballerina
# Detaches a message consumer service from the the listener.
# ```
# check messageListener.detach(jmsService);
# ```
#
# + 'service - The service to be detached
# + return - A `jms:Error` if there is an error or else `()`
public isolated function detach(jms:Service 'service) returns jms:Error?;
```

To start the listener, `'start` function can be used.
```ballerina
# Starts the endpoint.
# ```
# check messageListener.'start();
# ```
#
# + return - A `jms:Error` if there is an error or else `()`
public isolated function 'start() returns jms:Error?;
```

To stop the listener gracefully, `gracefulStop` function can be used.
```ballerina
# Stops the JMS listener gracefully.
# ```
# check messageListener.gracefulStop();
# ```
#
# + return - A `jms:Error` if there is an error or else `()`
public isolated function gracefulStop() returns jms:Error?;
```

To stop the listener immediately, `immediateStop` function can be used.
```ballerina
# Stops the JMS listener immediately.
# ```
# check messageListener.immediateStop();
# ```
#
# + return - A `jms:Error` if there is an error or else `()`
public isolated function immediateStop() returns jms:Error?;
```

### 7.4. Caller

A `jms:Caller` can be used to mark JMS message as received. The caller is used in association with the `jms:Listener`.

#### 7.4.1. Functions

To mark a JMS message as received, `acknowledge` function can be used.
```ballerina
# Mark a JMS message as received.
# ```
# check caller->acknowledge(message);
# ```
#
# + message - JMS message record
# + return - A `jms:Error` if there is an error in the execution or else `()`
isolated remote function acknowledge(jms:Message message) returns jms:Error?;
```

### 7.5. Usage

After initializing the `jms:Listener` a `jms:Service` must be attached to it.
```ballerina
service jms:Service "consumer-service" on messageListener {
    remote function onMessage(jms:Caller caller, jms:Message message) returns error? {
        // process results
    }
}
```
