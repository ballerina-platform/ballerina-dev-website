# Specification: Ballerina `ibm.ibmmq` Library

_Authors_: @ayeshLK @ThisaruGuruge \
_Reviewers_: @NipunaRanasinghe @dilanSachi \
_Created_: 2024/01/28 \
_Updated_: 2024/02/14 \
_Edition_: Swan Lake

## Introduction

This is the specification for the `ibm.ibmmq` library of [Ballerina language](https://ballerina.io/), which provides the
functionality to send and receive messages by connecting to an IBM MQ server.

The `ibm.ibmmq` library specification has evolved and may continue to evolve in the future. The released versions of the
specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a GitHub issue or in the Discord
server. Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback
is always welcome. Any accepted proposal which affects the specification is stored under `/docs/proposals`. Proposals
under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released to Ballerina Central. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Queue Manager](#2-queue-manager)
    * 2.1. [Configurations](#21-configurations)
    * 2.2. [Initialization](#22-initialization)
    * 2.3. [Functions](#23-functions)
3. [Message](#3-message)
4. [Client Options](#4-client-options)
5. [Queue](#5-queue)
    * 5.1. [Functions](#51-functions)
6. [Topic](#6-topic)
    * 6.1. [Functions](#61-functions)
7. [Message listener](#7-message-listener)
   * 7.1. [Initialization](#71-initialization)
   * 7.2. [Functions](#72-functions)
   * 7.3. [Service](#73-service)
     * 7.3.1. [Configuration](#731-configuration)
     * 7.3.2. [Functions](#732-functions)
   * 7.4. [Caller](#74-caller)
     * 7.4.1. [Functions](#741-functions)
   * 7.5. [Usage](#75-usage)

## 1. Overview

IBM MQ is a robust messaging middleware that facilitates the secure and reliable exchange of messages between applications.
This specification elaborates on the usage of IBM MQ queue manager, queue, and topic. These clients allow the writing of
distributed applications and microservices that read, write, and process messages in parallel, at scale, and in a fault-tolerant
manner even in the case of network problems or machine failures.

Ballerina `ibm.ibmmq` provides several core APIs:

- `ibmmq:QueueManager` - represents an IBM MQ queue manager.
- `ibmmq:Queue` - represents an IBM MQ Queue client.
- `ibmmq:Topic` - represents an IBM MQ Topic client.

## 2. Queue Manager

An IBM MQ Queue Manager represents a vital abstraction for managing communication between an application and an IBM MQ server.
It serves as a key interface for establishing, managing, and controlling the connection between a client application
and the IBM MQ messaging infrastructure.

### 2.1 Configurations

- CertKey record represents the combination of certificate, private key and private key password if it is encrypted.

```ballerina
public type CertKey record {|
    # A file containing the certificate
    string certFile;
    # A file containing the private key in PKCS8 format
    string keyFile;
    # Password of the private key if it is encrypted
    string keyPassword?;
|};
```

- SecureSocket record represents the configurations needed for secure communication with the IBM MQ server.

```ballerina
public type SecureSocket record {|
    # Configurations associated with `crypto:TrustStore` or single certificate file that the client trusts
    crypto:TrustStore|string cert;
    # Configurations associated with `crypto:KeyStore` or combination of certificate and private key of the client
    crypto:KeyStore|CertKey key?;
    # Name of the security provider used for SSL connections. The default value is the default security provider of the JVM
    string provider?;
|};
```

- SslCipherSuite type represents the SSL Cipher Suite to be used for secure communication with the IBM MQ server.

```ballerina
public type SslCipherSuite SSL_ECDHE_ECDSA_WITH_3DES_EDE_CBC_SHA|SSL_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
    |SSL_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256|SSL_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384|SSL_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    |SSL_ECDHE_ECDSA_WITH_NULL_SHA|SSL_ECDHE_ECDSA_WITH_RC4_128_SHA|SSL_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA|SSL_ECDHE_RSA_WITH_AES_128_CBC_SHA256
    |SSL_ECDHE_RSA_WITH_AES_128_GCM_SHA256|SSL_ECDHE_RSA_WITH_AES_256_CBC_SHA384|SSL_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    |SSL_ECDHE_RSA_WITH_NULL_SHA|SSL_ECDHE_RSA_WITH_RC4_128_SHA|SSL_RSA_WITH_3DES_EDE_CBC_SHA|SSL_RSA_WITH_AES_128_CBC_SHA
    |SSL_RSA_WITH_AES_128_CBC_SHA256|SSL_RSA_WITH_AES_128_GCM_SHA256|SSL_RSA_WITH_AES_256_CBC_SHA|SSL_RSA_WITH_AES_256_CBC_SHA256
    |SSL_RSA_WITH_AES_256_GCM_SHA384|SSL_RSA_WITH_DES_CBC_SHA|SSL_RSA_WITH_NULL_SHA256|SSL_RSA_WITH_RC4_128_SHA
    |TLS12|TLS_AES_128_GCM_SHA256|TLS_AES_256_GCM_SHA384|TLS_CHACHA20_POLY1305_SHA256|TLS_AES_128_CCM_SHA256
    |TLS_AES_128_CCM_8_SHA256|ANY|TLS13|TLS12ORHIGHER|TLS13ORHIGHER;
```

- QueueManagerConfiguration record represents the IBM MQ queue manager configurations.

```ballerina
public type QueueManagerConfiguration record {|
    # Name of the queue manager
    string name;
    # IBM MQ server host
    string host;
    # IBM MQ server port
    int port = 1414;
    # IBM MQ channel
    string channel;
    # IBM MQ userId
    string userID?;
    # IBM MQ user password
    string password?;
    # Configurations related to SSL/TLS encryption
    SecureSocket secureSocket?;
    # Defines the combination of key exchange, encryption,
    # and integrity algorithms used for establishing a secure SSL/TLS connection
    SslCipherSuite sslCipherSuite?;
|};
```

### 2.2. Initialization

- The `ibmmq:QueueManager` can be initialized by providing the `ibmmq:QueueManagerConfiguration`.

```ballerina
# Initialize an IBM MQ queue manager.
# ```
# ibmmq:QueueManager queueManager = check new(name = "QM1", host = "localhost", channel = "DEV.APP.SVRCONN");
# ```
#
# + configurations - The configurations to be used when initializing the IBM MQ queue manager
# + return - The `ibmmq:QueueManager` or an `ibmmq:Error` if the initialization failed
public isolated function init(*ibmmq:QueueManagerConfiguration configurations) returns ibmmq:Error?;
```

### 2.3. Functions

- To initialize a new `ibmmq:Queue` client, the `accessQueue` function can be used.

```ballerina
# Establishes access to an IBM MQ queue on this queue manager.
# ```
# ibmmq:Queue queue = check queueManager.accessQueue("queue1", ibmmq:MQOO_OUTPUT);
# ```
#
# + queueName - Name of the queue
# + options - The options which control the opening of the queue
# + return - The `ibmmq:Queue` object or an `ibmmq:Error` if the operation failed
public isolated function accessQueue(string queueName, int options) returns ibmmq:Queue|ibmmq:Error;
```

- To initialize a new `ibmmq:Topic` client, the `accessTopic` function can be used.

```ballerina
# Establishes access to an IBM MQ topic on this queue manager.
# ```
# ibmmq:Topic topic = check queueManager.accessTopic("topic1", ibmmq:MQOO_OUTPUT);
# ```
#
# + topicName - Name of the queue
# + options - The options which control the opening of the topic
# + return - The `ibmmq:Queue` object or an `ibmmq:Error` if the operation failed
public isolated function accessTopic(string topicName, int options) returns ibmmq:Topic|ibmmq:Error;
```

- To end the connection to the IBM MQ queue manager, `disconnect` function can be used.

```ballerina
# Ends the connection to the IBM MQ queue manager.
# ```
# check queueManager.disconnect();
# ```
#
# + return - An `ibmmq:Error` if the operation failed
public isolated function disconnect() returns ibmmq:Error?;
```

## 3. Message

An IBM MQ message is a fundamental unit of data that facilitates communication between applications within the IBM MQ messaging infrastructure. It encompasses not only the actual data payload but also includes metadata in the form of headers and customizable properties. This comprehensive structure enables reliable, secure, and flexible data transfer in distributed and enterprise environments.

- Property record represents an IBM MQ message property.

```ballerina
public type Property record {|
    # Property descriptor
    map<int> descriptor?;
    # Property value
    boolean|byte|byte[]|float|int|string value;
|};
```

- MQRFH record represents the MQRFH header structure.

```ballerina
public type MQRFH record {|
    # Flag of the header
    int flags = 0;
    # Numeric encoding of data that follows NameValueString
    int encoding = 0;
    # Structure identifier
    string strucId = "RFH ";
    # Length of the structure
    int strucLength = 32;
    # Structure version number
    int version = 1;
    # Character set identifier of data that follows NameValueString
    int codedCharSetId = 0;
    # Format name of data that follows NameValueString
    string format = DEFAULT_BLANK_VALUE;
    # Related name-value pairs
    map<string> nameValuePairs = {};
|};
```

- MQRFH2Field record represents a field in the MQRFH2 structure.

```ballerina
public type MQRFH2Field record {|
    # The name of the folder containing the field
    readonly string folder;
    # The field name
    readonly string 'field;
    # The field value
    boolean|byte|byte[]|float|int|string value;
|};
```

- MQRFH2 record represents the MQRFH2 header structure.

```ballerina
public type MQRFH2 record {|
    # Flag of the header
    int flags = 0;
    # Numeric encoding of data that follows NameValueData
    int encoding = 273;
    # Character set identifier of data that follows NameValueData
    int codedCharSetId = -2;
    # Contents of the variable part of the structure
    string[] folderStrings = [];
    # Coded character set for the NameValue data
    int nameValueCCSID = 1208;
    # NameValueData variable-length field
    byte[] nameValueData = [];
    # Length of NameValueData
    int nameValueLength = 0;
    # Format name of data that follows NameValueData.The name should be padded with
    # blanks to the length of the field.
    string format = DEFAULT_BLANK_VALUE;
    # Structure identifier
    string strucId = "RFH ";
    # Length of the structure
    int strucLength = 36;
    # Structure version number
    int version = 2;
    # Table containing all occurrences of field values matching
    table<MQRFH2Field> key(folder, 'field) fieldValues = table [];
|};
```

- MQCIH record represents the MQCIH header structure.

```ballerina
public type MQCIH record {|
    # Flag of the header
    int flags = 0;
    # Numeric encoding of data that follows NameValueData
    int encoding = 0;
    # Character set identifier of data that follows NameValueString
    int codedCharSetId = 0;
    # MQ format name of data that follows MQCIH
    string format = DEFAULT_BLANK_VALUE;
    # Structure identifier
    string strucId = "CIH ";
    # Length of the structure
    int strucLength = 180;
    # Structure version number
    int version = 2;
    # Return code from bridge
    int returnCode = 0;
    # MQ completion code or CICS EIBRESP
    int compCode = 0;
    # MQ reason or feedback code, or CICS EIBRESP2
    int reason = 0;
    # Unit-of-work control
    int UOWControl = 273;
    # Wait interval for MQGET call issued by bridge task
    int waitInterval = -2;
    # Link type
    int linkType = 1;
    # Bridge facility release time
    int facilityKeepTime = 0;
    # Send/receive ADS descriptor
    int ADSDescriptor = 0;
    # Whether task can be conversational
    int conversationalTask = 0;
    # Status at end of task
    int taskEndStatus = 0;
    # Bridge facility token
    byte[] facility = [];
    # MQ call name or CICS EIBFN function
    string 'function = "";
    # Abend code
    string abendCode = "";
    # Password or passticket
    string authenticator = "";
    # MQ format name of reply message
    string replyToFormat = "";
    # Remote CICS system Id to use
    string remoteSysId = "";
    # CICS RTRANSID to use
    string remoteTransId = "";
    # Transaction to attach
    string transactionId = "";
    # Terminal emulated attributes
    string facilityLike = "";
    # AID key
    string attentionId = "";
    # Transaction start code
    string startCode = "";
    # Abend transaction code
    string cancelCode = "";
    # Next transaction to attach
    string nextTransactionId = "";
    # Reserved
    int inputItem = 0;
|};
```

- MQIIH record represents the MQIIH header structure.

```ballerina
public type MQIIH record {|
    # Flag of the header
    int flags = 0;
    # Numeric encoding of data that follows NameValueString
    int encoding = 0;
    # Structure identifier
    string strucId = "IIH ";
    # Length of the structure
    int strucLength = 84;
    # Structure version number
    int version = 1;
    # Character set identifier of data that follows NameValueString
    int codedCharSetId = 0;
    # Format name of data that follows NameValueString
    string format = DEFAULT_BLANK_VALUE;
    # The logical terminal override, placed in the IO PCB field
    string lTermOverride = DEFAULT_BLANK_VALUE;
    # The message format services map name, placed in the IO PCB field
    string mfsMapName = DEFAULT_BLANK_VALUE;
    # This is the MQ format name of the reply message that is sent
    # in response to the current message
    string replyToFormat = DEFAULT_BLANK_VALUE;
    # The RACF password or PassTicket
    string authenticator = DEFAULT_BLANK_VALUE;
    # This is the transaction instance identifier
    byte[] tranInstanceId = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    # This indicates the IMS conversation state
    string:Char tranState = " ";
    # IMS commit mode
    string:Char commitMode = "0";
    # This indicates the IMS security processing required
    string:Char securityScope = "C";
|};
```

- Header type represents a union of header structures supported by the IBM MQ connector.

```ballerina
public type Header MQRFH2|MQRFH|MQCIH|MQIIH;
```

- MessageCharset type represents coded character set used in application message data.

```ballerina
public type MessageCharset MQCCSI_APPL|MQCCSI_ASCII|MQCCSI_ASCII_ISO|MQCCSI_AS_PUBLISHED|MQCCSI_DEFAULT|
    MQCCSI_EBCDIC|MQCCSI_EMBEDDED|MQCCSI_INHERIT|MQCCSI_Q_MGR|MQCCSI_UNDEFINED|MQCCSI_UNICODE|MQCCSI_UTF8;
```

- Message record represents an IBM MQ message.

```ballerina
public type Message record {|
    # Message properties
    map<Property> properties?;
    # Format associated with the header
    string format?;
    # Message identifier
    byte[] messageId?;
    # Correlation identifier
    byte[] correlationId?;
    # Message lifetime
    int expiry?;
    # Message priority
    int priority?;
    # Message persistence
    int persistence?;
    # Message type
    int messageType?;
    # Type of application that put the message
    int putApplicationType?;
    # Name of reply queue
    string replyToQueueName?;
    # Name of reply queue manager
    string replyToQueueManagerName?;
    # Specifies the representation used for numeric values in the application message data.
    # This can be represented using as a combination of `ibmmq:MQENC_*` options
    int encoding = ENC_INTEGER_NORMAL|ENC_DECIMAL_NORMAL|ENC_FLOAT_IEEE_NORMAL;
    # The coded character set identifier of character data in the application message data
    MESSAGE_CHARSET characterSet = CCSI_Q_MGR;
    # The accounting token, which is part of the message's identity and allows the work performed as a result of
    # the message to be properly charged
    byte[] accountingToken?;
    # Id of the user who originated the message
    string userId?;
    # Headers to be sent in the message
    Header[] headers?;
    # Message payload
    byte[] payload;
|};
```

## 4. Client Options

- `GetMessageOptions` record represents client options which can be used when retrieving messages from an IBM MQ destination.

```ballerina
public type GetMessageOptions record {|
    # Get message option
    int options = MQGMO_NO_WAIT;
    # The maximum time (in seconds) that a `get` call waits for a suitable message to arrive. It is used in conjunction with `ibmmq.MQGMO_WAIT`.
    int waitInterval = 10;
    # Message selection criteria
    MatchOptions matchOptions?;
|};
```

- `MatchOptions` record represents the selection criteria that determine which message is retrieved.

```ballerina
public type MatchOptions record {|
    # The message identifier of the message which needs to be retrieved
    byte[] messageId?;
    # The Correlation identifier of the message which needs to be retrieved
    byte[] correlationId?;
|};
```

## 5. Queue

An IBM MQ Queue enables applications to interact with an IBM MQ queue to exchange messages.

### 5.1. Functions

- To send a message `put` function can be used.

```ballerina
# Puts a message to an IBM MQ queue.
# ```
# check queue->put({payload: "Hello World".toBytes()});
# ```
#
# + message - IBM MQ message
# + options - Options controlling the action of the put operation. Can be a combination of
              one or more `ibmmq:MQPMO_*` options and values can combined using either '+' or '|'
# + return - An `ibmmq:Error` if the operation fails or else `()`
isolated remote function put(ibmmq:Message message, int options = ibmmq:MQPMO_NO_SYNCPOINT) returns ibmmq:Error?;
```

- To receive a message `get` function can be used.

```ballerina
# Retrieves a message from an IBM MQ queue.
# ```
# ibmmq:Message? message = check queue->get();
# ```
#
# + getMessageOptions - Options to control message retrieval
# + return - An `ibmmq:Message` if there is a message in the queue, `()` if there
#           is no message or else `ibmmq:Error` if the operation fails
isolated remote function get(*ibmmq:GetMessageOptions getMessageOptions) returns ibmmq:Message|ibmmq:Error?;
```

- To close the Queue client, the `close` function can be used.

```ballerina
# Closes the IBM MQ queue object. No further operations on this object are permitted after it is closed.
# ```
# check check queue->close();
# ```
#
# + return - An `ibmmq:Error` if the operation fails or else `()`
isolated remote function close() returns ibmmq:Error?
```

## 6. Topic

An IBM MQ Topic enables applications to interact with an IBM MQ Topic to exchange messages.

### 6.1. Functions

- To send a message `put` function can be used.

```ballerina
# Puts a message to an IBM MQ topic.
#```
# check topic->put({payload: "Hello World".toBytes()});
#```
#
# + message - IBM MQ message
# + options - Options controlling the action of the put operation. Can be a combination of
              one or more `ibmmq:MQPMO_*` options and values can combined using either '+' or '|'
# + return - An `ibmmq:Error` if the operation fails or else `()`
isolated remote function put(ibmmq:Message message, int options = ibmmq:MQPMO_NO_SYNCPOINT) returns ibmmq:Error?;
```

- To receive a message `get` function can be used.

```ballerina
# Retrieves a message from an IBM MQ topic.
# ```
# ibmmq:Message? message = check topic->get();
# ```
#
# + getMessageOptions - Options to control message retrieval
# + return - An `ibmmq:Message` if there is a message in the queue, `()` if there
#           is no message or else `ibmmq:Error` if the operation fails
isolated remote function get(*ibmmq:GetMessageOptions getMessageOptions) returns ibmmq:Message|ibmmq:Error?;
```

- To receive a message using JMS-compliant APIs, the `send` function can be used.

```
 # Sends a message to an IBM MQ topic.
 #
 # This method supports JMS-compliant message delivery, including compatibility with
 # durable subscriptions and asynchronous message listeners.
 #
 # Unlike the `put` method (which uses IBM MQ's native APIs), this method uses the JMS APIs and
 # is recommended for interoperability with JMS-based consumers.
 #
 # ```ballerina
 # check topic->send({payload: "Hello World".toBytes()});
 # ```
 #
 # + message - The message to be sent to the topic.
 # + return - An `ibmmq:Error` if the operation fails; otherwise, `()`
 isolated remote function send(Message message) returns Error?
 ```

## 7. Message listener

The IBM MQ listener in Ballerina enables applications to receive messages **asynchronously** from IBM MQ.

### 7.1. Initialization

The IBM MQ listener enables applications to interact with an IBM MQ listener to receive messages. The Ballerina IBM MQ listener is mapped to an IBM MQ Queue manager. Therefore, the listener can be initialized with the relevant configurations defined in the `ibmmq:QueueManagerConfiguration` record.

```ballerina
# Initializes the IBMMQ listener.
#
# + configurations - The configurations to be used when initializing the IBMMQ listener
# + return - An error if the initialization failed, nil otherwise
public isolated function init(*ibmmq:QueueManagerConfiguration configurations) returns ibmmq:Error?;
```

### 7.2. Functions

To attach a service to the listener, `attach` function can be used.
```ballerina
# Attaches an IBMMQ service to the IBMMQ listener.
#
# + s - The IBMMQ Service to attach
# + name - The name of the queue/topic to attach to
# + return - An error if the attaching failed, nil otherwise
public isolated function attach(ibmmq:Service s, string[]|string? name = ()) returns ibmmq:Error?;
```

To detach a service from the listener, `detach` function can be used.
```ballerina
# Detaches an IBMMQ service from the IBMMQ listener.
#
# + s - The IBMMQ Service to detach
# + return - An error if the detaching failed, nil otherwise
public isolated function detach(ibmmq:Service s) returns Error?;
```

To start the listener, `'start` function can be used.
```ballerina
# Starts the IBMMQ listener.
#
# + return - An error if the starting failed, nil otherwise
public isolated function 'start() returns ibmmq:Error?;
```

To stop the listener gracefully, `gracefulStop` function can be used.
```ballerina
# Gracefully stops the IBMMQ listener.
#
# + return - An error if the stopping failed, nil otherwise
public isolated function gracefulStop() returns ibmmq:Error?;
```

To stop the listener immediately, `immediateStop` function can be used.
```ballerina
# Immediately stops the IBMMQ listener.
#
# + return - An error if the stopping failed, nil otherwise
public isolated function immediateStop() returns ibmmq:Error?;
```
### 7.3. Service

An IBM MQ service in Ballerina is used to receive messages from IBM MQ. It is attached to an `ibmmq:Listener` and bound to a specific queue or a topic.

#### 7.3.1. Configuration

To subscribe a service to a IBM MQ queue or a topic, the subscription configurations should be provided using the `ibmmq:ServiceConfig` annotation.

```ballerina
# Defines the supported JMS message consumer types for IBM MQ.
public enum ConsumerType {
    # Represents JMS durable subscriber
    DURABLE,
    # Represents JMS shared consumer
    SHARED,
    # Represents JMS shared durable subscriber
    SHARED_DURABLE,
    # Represents JMS default consumer
    DEFAULT
}

# Defines the JMS session acknowledgement modes for IBM MQ.
public enum AcknowledgementMode {
    # Indicates that the session will use a local transaction which may subsequently 
    # be committed or rolled back by calling the session's `commit` or `rollback` methods. 
    SESSION_TRANSACTED,
    # Indicates that the session automatically acknowledges a client's receipt of a message 
    # either when the session has successfully returned from a call to `receive` or when 
    # the message listener the session has called to process the message successfully returns.
    AUTO_ACKNOWLEDGE,
    # Indicates that the client acknowledges a consumed message by calling the 
    # MessageConsumer's or Caller's `acknowledge` method. Acknowledging a consumed message 
    # acknowledges all messages that the session has consumed.
    CLIENT_ACKNOWLEDGE,
    # Indicates that the session to lazily acknowledge the delivery of messages. 
    # This is likely to result in the delivery of some duplicate messages if the JMS provider fails, 
    # so it should only be used by consumers that can tolerate duplicate messages. 
    # Use of this mode can reduce session overhead by minimizing the work the session does to prevent duplicates.
    DUPS_OK_ACKNOWLEDGE
}

# Configuration for an IBM MQ queue.
#
# + sessionAckMode - Configuration indicating how messages received by the session will be acknowledged
# + queueName - The name of the queue to consume messages from
# + messageSelector - Only messages with properties matching the message selector expression are delivered. 
#                     If this value is not set that indicates that there is no message selector for the message consumer
#                     For example, to only receive messages with a property `priority` set to `'high'`, use:
#                     `"priority = 'high'"`. If this value is not set, all messages in the queue will be delivered.
# + pollingInterval - The polling interval in seconds
# + receiveTimeout - The timeout to wait till a `receive` action finishes when there are no messages
public type QueueConfig record {|
  AcknowledgementMode sessionAckMode = AUTO_ACKNOWLEDGE;
  string queueName;
  string messageSelector?;
  decimal pollingInterval = 10;
  decimal receiveTimeout = 5;
|};

# Configuration for an IBM MQ topic subscription.
#
# + sessionAckMode - Configuration indicating how messages received by the session will be acknowledged
# + topicName - The name of the topic to subscribe to
# + messageSelector - Only messages with properties matching the message selector expression are delivered. 
#                     If this value is not set that indicates that there is no message selector for the message consumer
#                     For example, to only receive messages with a property `priority` set to `'high'`, use:
#                     `"priority = 'high'"`. If this value is not set, all messages in the queue will be delivered.
# + noLocal - If true then any messages published to the topic using this session's connection, or any other connection 
#             with the same client identifier, will not be added to the durable subscription.
# + consumerType - The message consumer type
# + subscriberName - the name used to identify the subscription
# + pollingInterval - The polling interval in seconds
# + receiveTimeout - The timeout to wait till a `receive` action finishes when there are no messages
public type TopicConfig record {|
  AcknowledgementMode sessionAckMode = AUTO_ACKNOWLEDGE;
  string topicName;
  string messageSelector?;
  boolean noLocal = false;
  ConsumerType consumerType = DEFAULT;
  string subscriberName?;
  decimal pollingInterval = 10;
  decimal receiveTimeout = 5;
|};

# The service configuration type for the `ibmmq:Service`.
public type ServiceConfiguration QueueConfig|TopicConfig;

# Annotation to configure the `ibmmq:Service`.
public annotation ServiceConfiguration ServiceConfig on service;
```

#### 7.3.2. Functions

To receive messages from an IBM MQ queue or a topic, the `onMessage` function can be used.
```ballerina
# Invoked when a message is received at a subscribed IBM MQ queue or a topic.
#
# + message - Received IBM MQ message
# + caller - Optional `ibmmq:Caller` to control transactions and message acknowledgement
# + return - A `error` if there is an error during message processing or else `()`
remote function onMessage(ibmmq:Message message, ibmmq:Caller caller) returns error?;
```

To handle runtime errors that occur during message reception or while dispatching a message to the `onMessage` function, the `onError` function can be used.
```ballerina
# Invoked when a runtime error occurs during message reception or while dispatching a message to the `onMessage` method.
#
# + err - The `ibmmq:Error` containing details of the error encountered
# + return - A `error` if an error occurs while handling the error, or else `()`
remote function onError(ibmmq:Error err) returns error?;
```


### 7.4. Caller

The `ibmmq:Caller` object is used in conjunction with a `ibmmq:Service` to manage message acknowledgments and transactions.

* It allows explicitly acknowledging messages to mark them as received.
* When using the `ibmmq:SESSION_TRANSACTED` session mode, it also enables transaction control through `commit` and `rollback` operations.

#### 7.4.1. Functions

To mark an IBM MQ message as received, `acknowledge` function can be used.
```ballerina
# Mark a IBM MQ message as received.
# ```
# check caller->acknowledge(message);
# ```
#
# + message - IBM MQ message record
# + return - A `ibmmq:Error` if there is an error in the execution or else `()`
isolated remote function acknowledge(ibmmq:Message message) returns ibmmq:Error?;
```

To commit all the messages received in this transaction and release any locks currently held, `'commit` function can be used.
```ballerina
# Commits all messages received in this transaction and releases any locks currently held.
# ```
# check caller->'commit();
# ```
# 
# + return - A `ibmmq:Error` if there is an error or else `()`
isolated remote function 'commit() returns ibmmq:Error?;
```

To rollback all the messages received in this transaction and release any locks currently held, `'rollback` function can be used.
```ballerina
# Rolls back any messages received in this transaction and releases any locks currently held.
# ```
# check caller->'rollback();
# ```
# 
# + return - A `ibmmq:Error` if there is an error or else `()`
isolated remote function 'rollback() returns ibmmq:Error?;
```

### 7.5. Usage

After initializing the `ibmmq:Listener` a `ibmmq:Service` must be attached to it.
```ballerina
@ibmmq:ServiceConfig {
   queueName: "MyQueue"
}
service ibmmq:Service "consumer-service" on messageListener {
    remote function onMessage(ibmmq:Caller caller, ibmmq:Message message) returns error? {
        // process results
    }
}
``
