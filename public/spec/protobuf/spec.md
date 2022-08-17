# Specification: Ballerina Protobuf Library

_Owners_: @daneshk @MadhukaHarith92  
_Reviewers_: @daneshk  
_Created_: 2021/11/17  
_Updated_: 2022/02/08  
_Edition_: Swan Lake

## Introduction
This is the specification for the Protobuf standard library of [Ballerina language](https://ballerina.io/), which provides APIs to represent a set of pre-defined protobuf types.

The Protobuf library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Wrappers](#2-wrappers)
    * 2.1. [String](#21-string)
    * 2.2. [Int](#22-int)
    * 2.3. [Float](#23-float)
    * 2.4. [boolean](#24-boolean)
    * 2.5. [bytes](#25-bytes)
3. [Duration](#3-duration)
4. [Struct](#4-struct)
5. [Timestamp](#5-timestamp)
6. [Empty](#6-empty)
7. [Any](#7-any)

## 1. Overview
This specification elaborates on the pre-defined record types and functions available in the Protobuf library.

## 2. Wrappers 
This provides APIs to represent `google/protobuf/wrappers.proto`. The protobuf module supports 5 wrapper types; `string`, `int`, `float`, `boolean`, and `bytes`.

### 2.1. String type
The `ContextStringStream` is a context representation record of a string stream.
```ballerina
public type ContextStringStream record {|
    stream<string, error?> content;
    map<string|string[]> headers;
|};
```

The `ContextString` is a context representation record of a string value.
```ballerina
public type ContextString record {|
    string content;
    map<string|string[]> headers;
|};
```

### 2.2. Integer type
The `ContextIntStream` is a context representation record of an integer stream.
```ballerina
public type ContextIntStream record {|
    stream<int, error?> content;
    map<string|string[]> headers;
|};
```

The `ContextInt` is a context representation record of an integer value.
```ballerina
public type ContextInt record {|
    int content;
    map<string|string[]> headers;
|};
```

### 2.3. Float type
The `ContextFloatStream` is a context representation record of a float stream.
```ballerina
public type ContextFloatStream record {|
    stream<float, error?> content;
    map<string|string[]> headers;
|};
```

The `ContextFloat` is a context representation record of a float value.
```ballerina
public type ContextFloat record {|
    float content;
    map<string|string[]> headers;
|};
```

### 2.4. Boolean type
The `ContextBooleanStream` is a context representation record of a boolean stream.
```ballerina
public type ContextBooleanStream record {|
    stream<boolean, error?> content;
    map<string|string[]> headers;
|};
```

The `ContextBoolean` is a context representation record of a boolean value.
```ballerina
public type ContextBoolean record {|
    boolean content;
    map<string|string[]> headers;
|};
```

### 2.5. Bytes type
The `ContextBytesStream` is a context representation record of a byte array stream.
```ballerina
public type ContextBytesStream record {|
    stream<byte[], error?> content;
    map<string|string[]> headers;
|};
```

The `ContextBytes` is a context representation record of a byte array.
```ballerina
public type ContextBytes record {|
    byte[] content;
    map<string|string[]> headers;
|};
```

## 3. Duration 
This provides APIs to represent `google/protobuf/duration.proto`.

The `ContextDurationStream` is a context representation record of a duration stream.
```ballerina
public type ContextDurationStream record {|
    stream<time:Seconds, error?> content;
    map<string|string[]> headers;
|};
```

The `ContextDuration` is a context representation record of a duration. The content is a time duration represented using `time:Seconds`. The `time:Seconds` is a subtype of Ballerina `decimal` type.
```ballerina
public type ContextDuration record {|
    time:Seconds content;
    map<string|string[]> headers;
|};
```

## 4. Struct
This provides APIs to represent `google/protobuf/struct.proto`.

The `ContextStructStream` is a context representation record of a struct stream.
```ballerina
public type ContextStructStream record {|
    stream<map<anydata>, error?> content;
    map<string|string[]> headers;
|};
```

The `ContextStruct` is a representation record of a struct.
```ballerina
public type ContextStruct record {|
    map<anydata> content;
    map<string|string[]> headers;
|};
```

## 5. Timestamp
This provides APIs to represent `google/protobuf/timestamp.proto`.

The `ContextTimestampStream` is a context representation record of a timestamp stream.
```ballerina
public type ContextTimestampStream record {|
    stream<time:Utc, error?> content;
    map<string|string[]> headers;
|};
```

The `ContextTimestamp` is a representation record of a timestamp.
```ballerina
public type ContextTimestamp record {|
    time:Utc content;
    map<string|string[]> headers;
|};
```

## 6. Empty
This provides APIs to represent `google/protobuf/empty.proto`.

The `ContextNil` is a representation record of a gRPC Empty message.
```ballerina
public type ContextNil record {|
    map<string|string[]> headers;
|};
```

`Empty` represents an empty record.
```ballerina
public type Empty record {|
|};
```

## 7. Any

This provides APIs to represent `google/protobuf/any.proto`.

The `Any` record is the Ballerina representation of the protobuf `Any` type. The `typeUrl` is the unique identifier of the serialized message, and the value contains the serialized message content. The type of the `value` entry defines as `ValueType`, which represent all the Ballerina types that support as subtypes of `Any`.

```ballerina
public type Any record {|
    string typeUrl;
    ValueType value;
|};
```

There are two APIs to serialize and deserialize the `Any` type values as follows.

```ballerina
# Generate and return the generic `'any:Any` record that used to represent protobuf `Any` type.
#
# + message - The record or the scalar value to be packed as Any type
# + return - Any value representation of the given message  
public isolated function pack(ValueType message) returns Any;

# Unpack and return the specified Ballerina value
#
# + anyValue - Any value to be unpacked
# + targetTypeOfAny - Type descriptor of the return value
# + return - Return a value of the given type  
public isolated function unpack(Any anyValue, ValueTypeDesc targetTypeOfAny = <>) returns targetTypeOfAny|'any:Error;
```

The `ContextAny` is a context representation record of `Any` Ballerina record.
```ballerina
public type ContextAny record {|
    Any content;
    map<string|string[]> headers;
|};
```

The `ContextAnyStream` is the stream representation that contains a stream of `Any` records as the content.
```ballerina
public type ContextAnyStream record {|
    stream<Any, error?> content;
    map<string|string[]> headers;
|};
```

