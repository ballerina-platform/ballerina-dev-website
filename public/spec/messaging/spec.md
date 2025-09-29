# Specification: Ballerina Messaging Library

_Owners_: @TharmiganK @shafreenAnfar @daneshk @ThisaruGuruge
_Reviewers_: @daneshk @ThisaruGuruge @shafreenAnfar  
_Created_: 2025/07/16  
_Updated_: 2025/07/16
_Edition_: Swan Lake

## Introduction

This is the specification for the Messaging standard library of [Ballerina language](https://ballerina.io/), which 
provides a unified, extensible API for message persistence and consumption in Ballerina applications. It abstracts the 
underlying message store technology, enabling developers to interact with various message brokers or databases through 
a consistent interface. This approach simplifies integration, fosters code consistency, and supports advanced messaging 
patterns such as retries and dead-letter queues (DLQs).

The Messaging library specification has evolved and may continue to evolve in the future. The released versions of the 
specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a 
[GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the 
[Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and 
implementation can be updated. Community feedback is always welcome. Any proposal, which affects the 
specification can be found in the [Ballerina Specification repository](https://github.com/ballerina-platform/ballerina-spec/tree/master/stdlib/proposals) 
under `stdlibs/proposals/messaging`.

The conforming implementation of the specification is released to Ballerina central. Any deviation from the 
specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Message Store Interface](#2-message-store-interface)
3. [Store Listener](#3-store-listener)
4. [Message Store Service](#4-message-store-service)
5. [In-Memory Message Store](#5-in-memory-message-store)
6. [Example Usage](#6-example-usage)
7. [Extensibility](#7-extensibility)

## 1. Overview

This module defines a set of interfaces and implementations for message storage and consumption. The key components are:

- **Message Store Interface**: Defines the contract for storing, retrieving, and acknowledging messages.
- **Store Listener**: Polls a message store at configurable intervals and dispatches messages to an attached service, 
with support for retries and DLQs.
- **Message Store Service**: A service object that processes messages delivered by the listener.
- **In-Memory Message Store**: A default implementation for testing and lightweight use cases.

## 2. Message Store Interface

The `Store` interface is the core abstraction for message persistence. It defines the following operations:

- `store(anydata message)`: Persists a message.
- `retrieve()`: Retrieves the next available message for processing.
- `acknowledge(string id, boolean success = true)`: Acknowledges the outcome of message processing.

**Message Structure:**

```ballerina
type Message record {|
    readonly string id;
    anydata payload;
|};
```

**Store Interface:**

```ballerina
type Store isolated client object {
    isolated remote function store(anydata message) returns error?;
    isolated remote function retrieve() returns Message|error?;
    isolated remote function acknowledge(string id, boolean success = true) returns error?;
};
```

## 3. Store Listener

The `StoreListener` class orchestrates message consumption from a `Store` implementation. It polls the store at a 
configurable interval, dispatches messages to an attached service, and manages retries and DLQ handling.

**Configuration:**

```ballerina
type StoreListenerConfiguration record {|
    decimal pollingInterval = 1;
    int maxRetries = 3;
    decimal retryInterval = 1;
    boolean ackWithFailureAfterMaxRetries = true;
    Store deadLetterStore?;
|};
```

**Key Features:**

- Configurable polling, retry, and DLQ behavior
- Attachable service for message processing
- Graceful and immediate stop operations

## 4. Message Store Service

A `StoreService` is a service object that processes messages delivered by the listener. It must implement the following 
method:

```ballerina
type StoreService distinct isolated service object {
    isolated remote function onMessage(anydata message) returns error?;
};
```

If `onMessage` returns an error, the listener will retry processing according to the configuration. After exhausting 
retries, the message can be dropped or moved to a DLQ.

## 5. In-Memory Message Store

The `InMemoryMessageStore` is a built-in implementation of the `Store` interface. It is suitable for testing and 
lightweight scenarios where persistence is not required.

## 6. Example Usage

```ballerina
import ballerina/messaging;

messaging:Store msgStore = new messaging:InMemoryMessageStore();
listener messaging:StoreListener msgStoreListener = new(msgStore, {
    pollingInterval: 10,
    maxRetries: 2,
    retryInterval: 2
});

service on msgStoreListener {
    isolated remote function onMessage(anydata payload) returns error? {
        // Process the message
    }
}
```

## 7. Extensibility

Developers can implement the `Store` interface to integrate with custom message brokers or databases. The listener and 
service patterns remain unchanged, ensuring consistent application logic regardless of the underlying store technology.

```ballerina
public isolated client class CustomStore {
    *messaging:Store;
    
    isolated remote function store(anydata message) returns error? {
        // Custom implementation to store the message
    }

    isolated remote function retrieve() returns Message|error? {
        // Custom implementation to retrieve a message
    }

    isolated remote function acknowledge(string id, boolean success = true) returns error? {
        // Custom implementation to acknowledge a message
    }
}
```
