# Specification: Ballerina Avro Library

_Authors_: @Nuvindu \
_Reviewers_: @ThisaruGuruge \
_Created_: 2024/04/04 \
_Updated_: 2024/04/04 \
_Edition_: Swan Lake

## Introduction

The Ballerina Avro module is designed to provide an easy way to convert data to bytes according to an Avro schema and to convert serialized bytes to a specific Ballerina type.

The Avro library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Initialize the Avro instance](#2-initialize-the-avro-instance)
    * 2.1 [The `init` method](#21-the-init-method)
3. [Serialize data into bytes](#3-serialize-data-into-bytes)
    * 3.1 [The `toAvro` API](#31-the-toavro-api)
        * 3.1.1 [API Parameters](#311-api-parameters)
            * 3.1.1.1 [The `data` Parameter](#3111-the-data-parameter)
                * 3.1.1.1.1 [Accepted Ballerina types](#31111-accepted-ballerina-types)
        * 3.1.2 [Return type](#312-return-type)
4. [Deserialize bytes to a specific Ballerina type](#4-deserialize-bytes-to-a-specific-ballerina-type)
    * 4.1 [The `fromAvro` API](#41-the-fromavro-api)
        * 4.1.1 [API parameters](#411-api-parameters)
            * 4.1.1.1 [The `data` parameter](#4111-the-data-parameter)
            * 4.1.1.2 [The `targetType` parameter](#4112-the-targettype-parameter)
        * 4.1.2 [Return type](#412-return-type)
5. [The `avro:Error` type](#5-the-avroerror-type)

## 1. Overview

This specification elaborates on serializing data to `byte[]`, as well as deserializing a `byte[]` to a specific Ballerina type.

The Avro module provides the following functionalities.

1. Serialize data into bytes
2. Deserialize bytes to a specific Ballerina type

## 2. Initialize the Avro instance

The `avro:Schema` instance needs to be initialized before performing the functionalities.

### 2.1 The `init` method

The `init` method can be used to initialize the `avro:Schema` instance. This method has a parameter named `schema` which accepts Avro schemas in the `string` format. The method will return an `avro:Error` in case of failure.

```ballerina
avro:Schema schema = check new ("avro-schema-string");
```

## 3. Serialize data into bytes

This section describes the details of serializing Ballerina data into `byte` arrays.

### 3.1 The `toAvro` API

The `toAvro` API can be used to serialize data into `byte[]`.

```ballerina
byte[] serializedData = check schema.toAvro("avro-data");
```

#### 3.1.1 API parameters

##### 3.1.1.1 The `data` parameter

The `data` parameter accepts the following Ballerina data types that is needed to be serialized into `byte` array.

###### 3.1.1.1.1 Accepted Ballerina types

* `json`
* `enum`
* `record`

#### 3.1.2 Return type

The function returns a `byte[]` or a `avro:Error` based on the conversion.

## 4. Deserialize bytes to a specific Ballerina type

The Avro module provides an API to deserialize a given `byte[]` to a given Ballerina type.

### 4.1 The `fromAvro` API

The `fromAvro` API facilitates the deserialization of Avro `byte[]` into a given Ballerina type.

```ballerina
string deserializedData = check schema.fromAvro(data);
```

#### 4.1.1 API parameters

##### 4.1.1.1 The `data` parameter

The `data` parameter is an Avro `byte[]` that needs to be converted to a Ballerina type.

##### 4.1.1.2 The `targetType` parameter

The `targetType` parameter accepts the type descriptor of the target Ballerina type.

#### 4.1.2 Return type

The return type will be inferred from the user specified type on success, or a `avro:Error` in case of conversion errors.

## 5. The `avro:Error` type

The `avro:Error` type represents all the errors related to the Avro module. This is a subtype of the Ballerina `error` type.
