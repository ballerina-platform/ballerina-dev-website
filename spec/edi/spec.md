# Specification: Ballerina EDI Library

_Owners_: @chathurace @RDPerera  
_Reviewers_: @niveathika @chathurace  
_Created_: 2024/01/19  
_Updated_: 2026/08/20  
_Edition_: Swan Lake

## Introduction

This is the specification for the EDI library of the [Ballerina language](https://ballerina.io/). The library converts EDI text into JSON or typed Ballerina records and back, against a schema written in JSON. It reads EDI at four depths: envelope headers without a schema, envelope headers with a schema, a full interchange, and a single transaction body.

This specification may change in future versions. Released versions can be found under the matching GitHub tag.

If you have feedback or suggestions, start a discussion with a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). The specification and the implementation can then be updated together. Any accepted proposal that affects this specification is stored under `/docs/proposals`; proposals under discussion carry the `type/proposal` label.

The implementation that matches this specification is released with the library. Anything the library does differently from this document is a bug.

## Contents

1. [Overview](#1-overview)
2. [Concepts](#2-concepts)
    * 2.1. [The EDI hierarchy](#21-the-edi-hierarchy)
    * 2.2. [Schema](#22-schema)
    * 2.3. [Envelope](#23-envelope)
3. [Errors](#3-errors)
4. [Reading EDI](#4-reading-edi)
    * 4.1. [Envelope headers without a schema](#41-envelope-headers-without-a-schema)
    * 4.2. [Envelope headers with a schema](#42-envelope-headers-with-a-schema)
    * 4.3. [A full interchange](#43-a-full-interchange)
    * 4.4. [A transaction body](#44-a-transaction-body)
5. [Writing EDI](#5-writing-edi)
    * 5.1. [A transaction body](#51-a-transaction-body)
    * 5.2. [A full interchange](#52-a-full-interchange)
6. [Envelope processing](#6-envelope-processing)
    * 6.1. [Counts and control references](#61-counts-and-control-references)
    * 6.2. [One interchange per call](#62-one-interchange-per-call)
    * 6.3. [UNA service string advice](#63-una-service-string-advice)
    * 6.4. [Trailer location](#64-trailer-location)
    * 6.5. [Fixed-length schemas](#65-fixed-length-schemas)
    * 6.6. [Byte order marks](#66-byte-order-marks)
7. [Schema definition](#7-schema-definition)
    * 7.1. [Name and root tag](#71-name-and-root-tag)
    * 7.2. [Delimiters](#72-delimiters)
    * 7.3. [Segments](#73-segments)
    * 7.4. [Fields](#74-fields)
    * 7.5. [Components and sub-components](#75-components-and-sub-components)
    * 7.6. [Envelope](#76-envelope)
    * 7.7. [Additional configuration](#77-additional-configuration)

## 1. Overview

An EDI document is text, structured by delimiters and described by a schema. This library reads and writes that text at the depth the caller asks for. The four read depths differ in whether they need a schema, how much of the document they touch, and how they behave on malformed input.

| Function | Schema | Reads | On malformed input |
| --- | --- | --- | --- |
| `x12HeadersFromEdiString`, `x12HeadersFromEdiFile` | Not needed | X12 ISA, and GS when present | Fails |
| `edifactHeadersFromEdiString`, `edifactHeadersFromEdiFile` | Not needed | EDIFACT UNB, and UNH when present | Fails |
| `headersFromEdiString`, `headersFromEdiFile` | With `envelope` | The envelope header segments | Fails |
| `interchangeFromEdiString` | With `envelope` | The whole interchange | Fails on the envelope, captures the error per transaction body |
| `fromEdiString` | Any | One transaction body | Fails |

Two functions write EDI text: `toEdiString` writes a transaction body, and `interchangeToEdiString` writes a whole interchange. `getSchema` turns a JSON schema into an `EdiSchema`.

The four schema-free functions know the X12 and EDIFACT envelope structures; every other function reads the structure from the schema it is given.

## 2. Concepts

### 2.1. The EDI hierarchy

An EDI file is a nested structure:

```text
EDI file
└── Interchange envelope (ISA / IEA, UNB / UNZ)
    └── Functional group (X12 only — GS / GE)
        └── Transaction (ST / SE, UNH / UNT)
            └── Segment (header, items, summary…)
                └── Field
                    └── Component
                        └── Sub-component
```

A segment is one line of related data elements, identified by a `code`. A field holds one data element. A field may hold components, and a component may hold sub-components.

The interchange, group, and transaction levels are the **envelope**. The segments inside a transaction are the **body**. A schema describes the body in `segments` and the envelope in `envelope`.

Functional groups exist in X12 and in EDIFACT documents that use UNG / UNE. An EDIFACT document without them has interchange and transaction levels only.

### 2.2. Schema

A schema is JSON, defined in [Section 7](#7-schema-definition). `getSchema` accepts it as a string or as `json` and returns an `EdiSchema`, or an error when the schema is not valid. Segment references are resolved at this point, so the parser never sees an unresolved `ref`.

An `EdiSchema` is the first argument every schema-driven function takes.

### 2.3. Envelope

A schema either declares an `envelope` or it does not.

With `envelope`, the envelope-aware functions — `headersFromEdiString`, `headersFromEdiFile`, `interchangeFromEdiString`, and `interchangeToEdiString` — are available, and `fromEdiString` skips the envelope segments and reads only the body.

Without `envelope`, `fromEdiString` reads every segment in `segments`, and the envelope-aware functions return a `SchemaCompatibilityError`. Schemas generated before `envelope` existed fall into this case; regenerating them with edi-tools 2.2.0 or later adds it.

Envelope header and trailer segments are always mandatory to the envelope-aware functions, whatever `minOccurances` the schema declares for them.

## 3. Errors

Every function in this library returns either `edi:Error` or one of the types below it.

```ballerina
public type Error distinct error;

public type InvalidEnvelopeError distinct Error;
public type SchemaCompatibilityError distinct Error;
public type SerializationError distinct Error;
```

| Error | When you get it |
| --- | --- |
| `InvalidEnvelopeError` | The EDI text does not match the expected envelope structure |
| `SchemaCompatibilityError` | The schema cannot support the operation asked of it |
| `SerializationError` | `interchangeToEdiString` refuses to write the interchange it was given |

`InvalidEnvelopeError` covers: a mandatory envelope segment missing or not matching; content left after the interchange trailer, or a second interchange header inside the body ([Section 6.2](#62-one-interchange-per-call)); an X12 ISA that is malformed, truncated, or not the standard fixed width; a UNA whose delimiters conflict with the schema ([Section 6.3](#63-una-service-string-advice)); a multi-transaction interchange passed to `fromEdiString`; and envelope headers that do not fit the read window of `headersFromEdiFile`.

`SchemaCompatibilityError` covers: a schema without `envelope` passed to an envelope-aware function; a fixed-length schema used with an envelope-aware function ([Section 6.5](#65-fixed-length-schemas)); and a segment reference that reaches the runtime unresolved inside an envelope section.

`SerializationError` covers: a transaction whose `body` holds an error; a body or envelope section that is not a JSON object; and a missing `groups` or `transactions` field, whichever the schema's envelope shape requires.

Body parsing for schemas without an `envelope` returns the generic `edi:Error`.

## 4. Reading EDI

### 4.1. Envelope headers without a schema

`x12HeadersFromEdiString` and `edifactHeadersFromEdiString` read the interchange header, and the group or message header that follows it, from EDI text. They take no schema. `x12HeadersFromEdiFile` and `edifactHeadersFromEdiFile` do the same for a file, reading only its first 512 characters, which holds any conforming header pair.

```ballerina
public type X12Headers record {|
    X12ISA isa;
    X12GS gs?;
|};

public type EdifactHeaders record {|
    EdifactUNB unb;
    EdifactUNH unh?;
|};
```

`isa` and `unb` are always present. `gs` is present when a GS segment follows the ISA, and `unh` when a UNH follows the UNB.

The X12 ISA is fixed-width, 106 characters. It is validated against the standard element widths ISA01 to ISA16, and an ISA that does not conform — an unpadded one, for instance — is rejected with `InvalidEnvelopeError` rather than partly parsed.

The EDIFACT functions honour a UNA service string advice in full, taking all six service characters from it ([Section 6.3](#63-una-service-string-advice)). Splitting is release-character aware: a delimiter escaped by the release character is data, and release sequences are un-escaped in the returned values, so `?+` becomes `+`, `?:` becomes `:`, `?'` becomes `'`, and `??` becomes `?`.

The record fields are:

```ballerina
public type X12ISA record {|
    string authInfoQualifier; string authInfo;
    string securityQualifier; string securityInfo;
    string senderQualifier; string senderId;
    string receiverQualifier; string receiverId;
    string date; string time;
    string version; string controlNumber; string usageIndicator;
|};

public type X12GS record {|
    string functionalIdentifier;
    string senderId; string receiverId;
    string date; string time;
    string controlNumber; string version;
|};
```

EDIFACT composites inside UNB and UNH are separate records.

```ballerina
public type EdifactSyntaxIdentifier record {|
    string syntaxId;
    string syntaxVersion;
|};

public type EdifactInterchangeParty record {|
    string id;
    string qualifier;
|};

public type EdifactDateTime record {|
    string date;
    string time;
|};

public type EdifactUNB record {|
    EdifactSyntaxIdentifier syntaxIdentifier;
    EdifactInterchangeParty sender;
    EdifactInterchangeParty recipient;
    EdifactDateTime dateAndTime;
    string controlRef;
|};

public type EdifactMessageIdentifier record {|
    string messageType;
    string version;
    string release;
    string controlAgency;
|};

public type EdifactUNH record {|
    string messageRef;
    EdifactMessageIdentifier messageIdentifier;
|};
```

### 4.2. Envelope headers with a schema

`headersFromEdiString` reads the envelope header segments a schema declares — interchange, group when the schema has one, and transaction — and stops there. The rest of the document is never read. The result is a JSON map with an `interchange` entry, a `group` entry when the schema declares a group level, and a `transaction` entry.

Input that does not match the declared headers fails with `InvalidEnvelopeError`; the function never returns empty header sections.

`headersFromEdiFile` does the same for a file, reading its first 4096 characters. When the headers cannot be read and that whole window was consumed, the returned `InvalidEnvelopeError` names the window size, since the header section may be longer than the window.

### 4.3. A full interchange

`interchangeFromEdiString` reads a whole interchange into an `EdiInterchange`.

```ballerina
public type EdiInterchange record {|
    json interchangeHeader;
    EdiFunctionalGroup[] groups?;
    EdiTransaction[] transactions?;
    json interchangeTrailer;
|};

public type EdiFunctionalGroup record {|
    json groupHeader;
    EdiTransaction[] transactions;
    json groupTrailer;
|};

public type EdiTransaction record {|
    json transactionHeader;
    json|error body;
    json transactionTrailer;
|};
```

`groups` is set when the schema declares `envelope.group`, and `transactions` is set when it does not.

Envelope segments fail the call: a malformed or missing interchange, group, or transaction header or trailer returns `InvalidEnvelopeError`.

Transaction bodies do not. When a body cannot be read against `schema.segments`, that transaction's `body` field holds the parse error and the rest of the interchange is still returned. `body` is `json|error` for this reason, and the error carries the message describing what failed.

Trailer counts and control references are captured as they appear in the input. They are not checked against the content ([Section 6.1](#61-counts-and-control-references)).

### 4.4. A transaction body

`fromEdiString` reads one transaction body and returns it as `json`.

For a schema declaring an `envelope`, envelope segments are skipped by position: header segments at the start of the input, trailer segments at the end. An envelope-coded segment anywhere else is not removed and is reported as a body parse error. The input must hold at most one transaction; more than one transaction header segment returns `InvalidEnvelopeError` naming `interchangeFromEdiString` as the function to use instead.

For a schema without an `envelope`, every segment is read against `segments`.

## 5. Writing EDI

### 5.1. A transaction body

`toEdiString` writes `json` as EDI text against `schema.segments`. It writes the body only, and does so even when the schema declares an `envelope` — no envelope segments are emitted.

### 5.2. A full interchange

`interchangeToEdiString` writes an `EdiInterchange` as EDI text, and is the inverse of `interchangeFromEdiString`. Interchange, group, and transaction headers and trailers come from the matching `EdiInterchange` fields; each transaction body is written against `schema.segments`, the same fragment `fromEdiString` reads. A read followed by a write is therefore structurally symmetric.

Two values are adjusted on write, rather than taken from the record: the X12 ISA is re-padded to its standard element widths, and trailer counts and control references are recomputed ([Section 6.1](#61-counts-and-control-references)).

The call returns `SerializationError` when a transaction `body` holds an error, when a body or envelope section is not a JSON object, or when the `groups` field is unset for a schema with a group level, or `transactions` unset for one without.

## 6. Envelope processing

### 6.1. Counts and control references

Trailer counts (SE01, GE01, IEA01, UNT01, UNZ01) and trailer control references (SE02, GE02, IEA02, UNT02, UNZ02) are not validated on read. `interchangeFromEdiString` captures whatever the input holds.

`interchangeToEdiString` recomputes them from the content it is writing, so values captured at read time — stale after the caller edits the transaction list — are ignored:

- transaction trailer count (SE01, UNT01) is the number of segments in the transaction, counting the transaction header and trailer;
- group trailer count (GE01) is the number of transaction sets in the group;
- interchange trailer count (IEA01, UNZ01) is the number of functional groups, or the number of messages when the schema has no group level;
- trailer control references are mirrored from the matching header: IEA02 from ISA13, GE02 from GS06, SE02 from ST02, UNT02 from UNH 0062, UNZ02 from UNB 0020.

These elements are identified by position, per the standard segment layouts: the count is the first element after the segment code, and the control reference is the element after the count. When the schema declares a trailer with fewer fields, only what fits is written.

The X12 ISA is re-padded on write to the standard element widths — ISA01 to ISA16 are 2, 10, 2, 10, 2, 15, 2, 15, 6, 4, 1, 5, 9, 1, 1, and 1 character — producing the mandatory 106-character segment. Reading trims this padding; receivers read the ISA by position. A fixed field length declared in the schema takes precedence over the standard width.

### 6.2. One interchange per call

`interchangeFromEdiString` reads exactly one interchange. Content after the interchange trailer, or a second interchange header segment inside the body, returns `InvalidEnvelopeError`. Batched input must be split into single interchanges first.

`fromEdiString` with an envelope schema reads exactly one transaction body, per [Section 4.4](#44-a-transaction-body).

### 6.3. UNA service string advice

The schema-free EDIFACT functions honour a UNA in full. All six service characters — component separator, field separator, decimal notation, release character, reserved character, and segment terminator — are taken from it, including custom sets.

The schema-driven functions validate a leading UNA against the schema delimiters: component separator, field separator, decimal separator when the schema declares one, and segment terminator. A matching UNA is skipped. A conflicting one returns `InvalidEnvelopeError`, since a schema-driven parse cannot use delimiters other than the schema's.

### 6.4. Trailer location

`interchangeFromEdiString` finds the interchange trailer by scanning backward from the end of the input, and finds group and transaction trailers by scanning backward from the next header at the same level.

A trailer-coded segment inside a corrupted transaction body therefore stays in that body, where it is captured as that transaction's error, and cannot be mistaken for the envelope trailer.

### 6.5. Fixed-length schemas

The envelope-aware functions extract segment codes by delimiter and do not support fixed-length schemas — those declaring `"field": "FL"`. They return `SchemaCompatibilityError`, and so does `fromEdiString` when a fixed-length schema declares an `envelope`.

`fromEdiString` and `toEdiString` with a fixed-length schema that has no `envelope` are unaffected.

### 6.6. Byte order marks

A single leading U+FEFF is stripped by the string and file entry points of the envelope-aware functions before the envelope is detected.

## 7. Schema definition

A schema is a JSON object. It names the format, states its delimiters, and describes the transaction body in `segments` and, optionally, the envelope in `envelope`.

This schema describes a custom order format with one mandatory header segment and a repeating item segment:

```json
{
    "name": "SimpleOrder",
    "delimiters": {"segment": "~", "field": "*", "component": ":", "repetition": "^"},
    "segments": [
        {
            "code": "HDR",
            "tag": "header",
            "minOccurances": 1,
            "fields": [
                {"tag": "code"},
                {"tag": "orderId"},
                {"tag": "organization"},
                {"tag": "date"}
            ]
        },
        {
            "code": "ITM",
            "tag": "items",
            "maxOccurances": -1,
            "fields": [
                {"tag": "code"},
                {"tag": "item"},
                {"tag": "quantity", "dataType": "int"}
            ]
        }
    ]
}
```

It reads this EDI text:

```text
HDR*ORDER_1201*ABC_Store*2008-01-01~
ITM*A-250*12~
ITM*A-45*100~
```

into this JSON:

```json
{
    "header": {"code": "HDR", "orderId": "ORDER_1201", "organization": "ABC_Store", "date": "2008-01-01"},
    "items": [
        {"code": "ITM", "item": "A-250", "quantity": 12},
        {"code": "ITM", "item": "A-45", "quantity": 100}
    ]
}
```

### 7.1. Name and root tag

| Field | Default | Meaning |
| --- | --- | --- |
| `name` | — | Name of the schema. Code generation names the top-level record after it |
| `tag` | `"Root_mapping"` | Tag of the schema's root segment group. `fromEdiString` returns the segment map directly, so this does not appear in the parsed output |

### 7.2. Delimiters

`delimiters` states the characters that separate each level of the EDI text.

| Field | Default | Meaning |
| --- | --- | --- |
| `segment` | — | Separates segments, such as `~`, `'`, or a newline |
| `field` | — | Separates fields within a segment, such as `*` or `+`. `"FL"` marks a fixed-length format, where fields are located by `startIndex` and `length` instead |
| `component` | — | Separates components within a field, such as `:` |
| `subcomponent` | `"NOT_USED"` | Separates sub-components. `"NOT_USED"` means the format has none |
| `repetition` | `"NOT_USED"` | Separates repetitions of a field. `"NOT_USED"` means the format has none |
| `decimalSeparator` | `.` | Decimal separator in numeric fields. EDIFACT uses `.`; some regional X12 flavours use `,` |

```json
"delimiters": {
    "segment": "~",
    "field": "*",
    "component": ":",
    "subcomponent": "NOT_USED",
    "repetition": "^",
    "decimalSeparator": "."
}
```

### 7.3. Segments

`segments` is an array describing the transaction body. Each entry is a segment, a segment group, or a reference. Envelope segments belong in [`envelope`](#76-envelope), not here.

#### 7.3.1. Segment

| Field | Default | Meaning |
| --- | --- | --- |
| `code` | — | Segment code as it appears in the EDI text, such as `HDR` or `BGM` |
| `tag` | — | Tag for the segment. Becomes the JSON or record field name |
| `minOccurances` | `0` | Minimum occurrences |
| `maxOccurances` | `1` | Maximum occurrences. `-1` means unlimited |
| `truncatable` | `true` | Whether trailing fields may be absent from the input, provided every required field before them is present |
| `fields` | — | Field definitions within the segment |

```json
{
    "code": "HDR",
    "tag": "header",
    "minOccurances": 1,
    "maxOccurances": 1,
    "truncatable": true,
    "fields": [
        {"tag": "code", "required": true},
        {"tag": "orderId", "required": true},
        {"tag": "organization"},
        {"tag": "date"}
    ]
}
```

#### 7.3.2. Segment group

A segment group holds segments that appear together, as X12 loops and EDIFACT message branches do. An entry is a group when it has `segments` instead of `fields`.

| Field | Default | Meaning |
| --- | --- | --- |
| `tag` | — | Tag for the group in the parsed output |
| `minOccurances` | `0` | Minimum occurrences |
| `maxOccurances` | `1` | Maximum occurrences. `-1` means unlimited |
| `segments` | — | Nested segments, groups, or references. The first child must be a segment, which triggers the group |

```json
{
    "tag": "Loop_2000A",
    "minOccurances": 1,
    "maxOccurances": -1,
    "segments": [
        {"code": "HL", "tag": "hierarchicalLevel", "fields": []},
        {"code": "PRV", "tag": "providerCharacteristics", "minOccurances": 0, "fields": []}
    ]
}
```

#### 7.3.3. Segment reference

A segment definition used at several points in a schema is declared once in [`segmentDefinitions`](#77-additional-configuration) and referenced by name from `segments` or from any `envelope` level.

| Field | Meaning |
| --- | --- |
| `ref` | Key into `segmentDefinitions` |
| `tag` | Optional. Overrides the tag of the referenced segment at this site |
| `minOccurances`, `maxOccurances` | Optional. Override the cardinality at this site |

```json
"segmentDefinitions": {
    "DTM": {
        "code": "DTM",
        "tag": "dateTimeReference",
        "fields": [{"tag": "code"}, {"tag": "dateTime"}]
    }
},
"segments": [
    {"ref": "DTM", "minOccurances": 1, "maxOccurances": 5}
]
```

References are resolved by `getSchema` before parsing.

### 7.4. Fields

| Field | Default | Meaning |
| --- | --- | --- |
| `tag` | — | Tag for the field |
| `repeat` | `false` | Whether the field may repeat, using `delimiters.repetition` |
| `required` | `false` | Whether the field is required |
| `truncatable` | `true` | Whether trailing components within the field may be absent |
| `dataType` | `"string"` | `string`, `int`, `float`, or `composite` |
| `startIndex` | `-1` | Start index of the field within the segment. Fixed-length formats only |
| `length` | `-1` | Fixed length, or a `{"min": N, "max": M}` range |
| `components` | — | Component definitions, when `dataType` is `composite` |

#### 7.4.1. Data types

`string` is textual data. `int` is integer data. `float` is floating-point data and honours `delimiters.decimalSeparator`. `composite` is a group of components within the field, and each component may hold sub-components.

```json
"fields": [
    {"tag": "CustomerName", "dataType": "string", "length": 50},
    {"tag": "Quantity", "dataType": "int", "length": {"min": 1}},
    {"tag": "Price", "dataType": "float", "length": {"max": 10}},
    {"tag": "Address", "dataType": "composite", "components": [
        {"tag": "No"},
        {"tag": "Street"},
        {"tag": "City"}
    ]}
]
```

#### 7.4.2. Length constraints

When `length` is an integer, a value of that length is kept as is, a shorter value is padded with spaces, and a longer value is an error.

When `length` is a `{"min": …, "max": …}` object, a value below `min` or above `max` is an error.

```json
"fields": [
    {"tag": "DocumentNameCode", "length": 10},
    {"tag": "DocumentNumber", "length": {"min": 1}},
    {"tag": "MessageFunction", "length": {"max": 3}},
    {"tag": "ResponseType", "length": {"min": 1, "max": 3}}
]
```

### 7.5. Components and sub-components

A component takes `tag`, `required` (default `false`), `truncatable` (default `true`), `dataType` (default `"string"`), and `subcomponents`. A sub-component takes `tag`, `required` (default `false`), and `dataType` (default `"string"`).

```json
{
    "code": "ORG",
    "tag": "organization",
    "fields": [
        {"tag": "code"}, {"tag": "partnerCode"}, {"tag": "name"},
        {
            "tag": "contact",
            "components": [
                {"tag": "mobile", "required": true},
                {"tag": "fixedLine"},
                {
                    "tag": "address",
                    "subcomponents": [
                        {"tag": "streetAddress"},
                        {"tag": "city"},
                        {"tag": "country"}
                    ]
                }
            ]
        }
    ]
}
```

### 7.6. Envelope

`envelope` describes the interchange, group, and transaction levels, separately from the body `segments`. [Section 2.3](#23-envelope) states what declaring it changes.

| Level | Presence | Segments |
| --- | --- | --- |
| `interchange` | Required | ISA / IEA for X12, UNB / UNZ for EDIFACT |
| `group` | Optional. Present for X12, absent for EDIFACT without UNG | GS / GE |
| `transaction` | Required | ST / SE for X12, UNH / UNT for EDIFACT |

Each level has a `header` and a `trailer` array, holding the same kinds of entries as `segments`: segments, groups, and references.

X12, with all three levels:

```json
"envelope": {
    "interchange": {
        "header": [{"code": "ISA", "tag": "InterchangeControlHeader", "fields": []}],
        "trailer": [{"code": "IEA", "tag": "InterchangeControlTrailer", "fields": []}]
    },
    "group": {
        "header": [{"code": "GS", "tag": "FunctionalGroupHeader", "fields": []}],
        "trailer": [{"code": "GE", "tag": "FunctionalGroupTrailer", "fields": []}]
    },
    "transaction": {
        "header": [{"code": "ST", "tag": "TransactionSetHeader", "fields": []}],
        "trailer": [{"code": "SE", "tag": "TransactionSetTrailer", "fields": []}]
    }
}
```

EDIFACT without groups, with two levels:

```json
"envelope": {
    "interchange": {
        "header": [{"code": "UNB", "tag": "InterchangeHeader", "fields": []}],
        "trailer": [{"code": "UNZ", "tag": "InterchangeTrailer", "fields": []}]
    },
    "transaction": {
        "header": [{"code": "UNH", "tag": "MessageHeader", "fields": []}],
        "trailer": [{"code": "UNT", "tag": "MessageTrailer", "fields": []}]
    }
}
```

### 7.7. Additional configuration

| Field | Default | Meaning |
| --- | --- | --- |
| `ignoreSegments` | `[]` | Segment codes to skip while reading the body. Schemas written before `envelope` existed used it to suppress envelope segments |
| `preserveEmptyFields` | `true` | Whether empty optional fields appear in the output as empty strings, nulls, and empty arrays. When `false`, they are left out |
| `includeSegmentCode` | `true` | Whether the segment code appears in the output as a `code` field |
| `segmentDefinitions` | — | Reusable segment definitions, keyed by name and referenced by `{"ref": "…"}` from `segments` or any `envelope` level |

A schema using a body, an envelope, and reusable definitions together:

```json
{
    "name": "OrdersD03A",
    "tag": "Orders",
    "delimiters": {
        "segment": "'",
        "field": "+",
        "component": ":",
        "subcomponent": "NOT_USED",
        "repetition": "*",
        "decimalSeparator": "."
    },
    "ignoreSegments": [],
    "preserveEmptyFields": true,
    "includeSegmentCode": true,
    "envelope": {
        "interchange": {
            "header": [{"ref": "UNB"}],
            "trailer": [{"ref": "UNZ"}]
        },
        "transaction": {
            "header": [{"ref": "UNH"}],
            "trailer": [{"ref": "UNT"}]
        }
    },
    "segments": [
        {"code": "BGM", "tag": "BeginningOfMessage", "minOccurances": 1, "fields": []},
        {"code": "DTM", "tag": "DateTime", "maxOccurances": 5, "fields": []}
    ],
    "segmentDefinitions": {
        "UNB": {"code": "UNB", "tag": "InterchangeHeader", "fields": []},
        "UNZ": {"code": "UNZ", "tag": "InterchangeTrailer", "fields": []},
        "UNH": {"code": "UNH", "tag": "MessageHeader", "fields": []},
        "UNT": {"code": "UNT", "tag": "MessageTrailer", "fields": []}
    }
}
```
