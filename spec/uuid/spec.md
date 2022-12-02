# Specification: Ballerina UUID Library

_Owners_: @daneshk @MadhukaHarith92  
_Reviewers_: @daneshk  
_Created_: 2021/11/16  
_Updated_: 2022/02/08  
_Edition_: Swan Lake   

## Introduction
This is the specification for the UUID standard library of [Ballerina language](https://ballerina.io/), which provides APIs to generate UUIDs based on the [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.html).

The UUID library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [Github issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Generating UUIDs](#2-generating-uuids)
    * 2.1. [Version 1](#21-version-1)
    * 2.2. [Version 3](#22-version-3)
    * 2.3. [Version 4](#23-version-4)
    * 2.4. [Version 5](#24-version-5)
    * 2.5. [Nil UUID](#25-nil-uuid)
3. [Checking the Version of UUIDs](#3-checking-the-version-of-uuids)
4. [Validating UUIDs](#4-validating-uuids)
5. [UUID Operations](#5-uuid-operations)

## 1. Overview
This specification elaborates on the functions available in the UUID library.

## 2. Generating UUIDs
UUID module supports generating 4 versions of UUIDs. They are generated as UUID strings or UUID records. The following is the UUID record definition.
```ballerina
# Represents a UUID.
#
# + timeLow - The low field of the timestamp
# + timeMid - The middle field of the timestamp
# + timeHiAndVersion - The high field of the timestamp multiplexed with the version number
# + clockSeqHiAndReserved - The high field of the clock sequence multiplexed with the variant
# + clockSeqLo - The low field of the clock sequence
# + node - The spatially unique node identifier
public type Uuid readonly & record {
    ints:Unsigned32 timeLow;
    ints:Unsigned16 timeMid;
    ints:Unsigned16 timeHiAndVersion;
    ints:Unsigned8 clockSeqHiAndReserved;
    ints:Unsigned8 clockSeqLo;
    int node;
};
```

### 2.1. Version 1
This is generated using the MAC address of the computer and the time of generation. 

The `uuid:createType1AsString()` function returns a UUID as a string.
```ballerina
string uuid1 = uuid:createType1AsString();
```

The `uuid:createType1AsRecord()` function returns a UUID as a `Uuid` record.
```ballerina
uuid:Uuid|uuid:Error uuid1 = uuid:createType1AsRecord();
```

### 2.2. Version 3
This is generated using cryptographic hashing and application-provided text strings. MD5 hashing is used.

UUID library has a set of pre-defined UUIDs strings of well known namespace IDs.
```
NAME_SPACE_DNS - Namespace is a fully-qualified domain name
NAME_SPACE_URL - Namespace is a URL
NAME_SPACE_OID - Namespace is an ISO OID
NAME_SPACE_X500 - Namespace is an X.500 DN (in DER or a text output format)
NAME_SPACE_NIL - Empty UUID
```

The `uuid:createType3AsString()` function returns a UUID as a string or else a `uuid:Error`.
```ballerina
string|uuid:Error uuid3 = uuid:createType3AsString(uuid:NAME_SPACE_DNS, “ballerina.io”);
```

The `uuid:createType3AsRecord()` function returns a UUID as a `Uuid` record or else a `uuid:Error`.
```ballerina
uuid:Uuid|uuid:Error uuid3 = uuid:createType3AsRecord(uuid:NAME_SPACE_DNS, “ballerina.io”);
```

### 2.3. Version 4

This is generated using a pseudo-random number generator. Every bit of the string is randomly generated.

The `uuid:createType4AsString()` function returns a UUID as a string.
```ballerina
string uuid4 = uuid:createType4AsString();
```

The `uuid:createType4AsRecord()` function returns a UUID as a `Uuid` record or else a `uuid:Error`.
```ballerina
uuid:Uuid|uuid:Error uuid4 = uuid:createType4AsRecord();
```

### 2.4. Version 5
This is generated using cryptographic hashing and application-provided text strings. SHA-1 hashing is used.

The `uuid:createType5AsString()` function returns a UUID as a string or else a `uuid:Error`.
```ballerina
string|uuid:Error uuid5 = uuid:createType5AsString(uuid:NAME_SPACE_DNS, “ballerina.io”);
```

The `uuid:createType5AsRecord()` function returns a UUID as a `Uuid` record or else a `uuid:Error`.
```ballerina
uuid:Uuid|uuid:Error uuid5 = uuid:createType5AsRecord(uuid:NAME_SPACE_DNS, “ballerina.io”);
```

### 2.5. Nil UUID

The `nilAsString()` function returns a nil UUID as a string.
```ballerina
string nilUUID = uuid:nilAsString();
```

The `nilAsRecord()` function returns a nil UUID as a UUID record.
```ballerina
uuid:Uuid nilUUID = uuid:nilAsRecord();
```

## 3. Checking the Version of UUIDs
The `uuid:getVersion()` function detects the [RFC]((https://www.rfc-editor.org/rfc/rfc4122.html)) version of a UUID. This returns an error if the UUID is invalid.
```ballerina
uuid:Version|uuid:Error v = uuid:getVersion("4397465e-35f9-11eb-adc1-0242ac120002");
```

## 4. Validating UUIDs
The `uuid:validate()` function validates a UUID.
```ballerina
boolean valid = uuid:validate("4397465e-35f9-11eb-adc1-0242ac120002");
```

## 5. UUID operations
UUID module supports the conversion of a UUID between 3 data types; `string`, `byte[]`, and `Uuid` record.

The `toBytes()` function converts a UUID `string` or a `Uuid` record to a `byte[]`. This returns an error if the UUID is invalid.
```ballerina
byte[]|uuid:Error b = uuid:toBytes(“6ec0bd7f-11c0-43da-975e-2aesass0b”);
```

The `toString()` function converts a `Uuid` record or a `byte[]` to a UUID `string`. This returns an error if the UUID is invalid.
```ballerina
string|uuid:Error s = uuid:toString([5, 12, 16, 35]);
```

The `toRecord()` function converts a UUID `string` or a `byte[]` to a `Uuid` record. This returns an error if the UUID is invalid.
```ballerina
uuid:Uuid|uuid:Error r1 = uuid:toRecord("4397465e-35f9-11eb-adc1-0242ac120002");
uuid:Uuid|uuid:Error r2 = uuid:toRecord([10, 20, 30]);
```
