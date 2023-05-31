---
layout: ballerina-platform-specifications-left-nav-pages-swanlake
title: Ballerina specifications
intro: Read the Ballerina language specification and other specifications that cover the standard library, built-in language extensions, testing, documentation, and more.
description: Read the Ballerina language specification and other specifications that cover the standard library, built-in language extensions, testing, documentation, and more.
keywords: ballerina, specifications, spec, language specifications, platform specifications, standard library specifications
permalink: /learn/platform-specifications/
redirect_from:
  - /learn/language-specification
  - /learn/language-specification/
  - /learn/language-specifications
  - /learn/language-specifications/
  - /spec
  - /spec/
  - /learn/platform-specifications
  - /learn/platform-specifications/
  
---

As a language, which is designed to have multiple implementations, Ballerina semantics are defined by a series of specifications and not by the implementation. Currently, there is only one implementation (i.e., jBallerina that compiles Ballerina to Java bytecodes). Others will follow including a compiler, which generates native binaries using LLVM.

Ballerina has a collection of specifications starting with the Ballerina Language Specification. Other specifications (which are yet to be moved to the specification repository or, in some cases, yet to be written) will cover the standard library, built-in language extensions such as security, immutability & deprecation, module and project management, testing, documentation, compiler extensions for cloud, and Ballerina Central.

## Language specifications 

From the start of 2019, Ballerina  specifications are versioned chronologically using the convention `20XYRn`, where `XY` is the 2-digit year (e.g., 19), `R` stands for "Release" and `n` is the release number for that year. Prior to 2019, a semver versioning scheme was used. However, that approach was abandoned when the language specification reached 0.980.

### Released specifications

The below are the most stable versions of the lanuguage specification, which are in sync with the Ballerina releases.

> **Note:** The changes since previous releases section of the specification identifies the changes that have occurred in each version of the specification.

| Version | Release Date | Description |
| ------- | ------------ | ----------- |
| <a target="_blank" href="/spec/lang/2022R4/">2022R4</a> | 2022-12-09 | Fourth release of 2022. This is the basis for Ballerina 2201.3.0 (Swan Lake Update 3). | 
| <a target="_blank" href="/spec/lang/2022R3/">2022R3</a> | 2022-08-12 | Third release of 2022. This is the basis for Ballerina 2201.2.0 (Swan Lake Update 2). | 
| <a target="_blank" href="/spec/lang/2022R2/">2022R2</a> | 2022-06-02 | Second release of 2022. This is the basis for Ballerina 2201.1.0 (Swan Lake Update 1). |
| <a target="_blank" href="/spec/lang/2022R1/">2022R1</a> | 2022-01-31 | First release of 2022. This is the basis for Ballerina 2201.0.0 (Swan Lake). |
| <a target="_blank" href="/spec/lang/2021R1/">2021R1</a> | 2021-06-02 | First release of 2021. This is the basis for Ballerina Swan Lake Beta1. |
| <a target="_blank" href="/spec/lang/2020R1/">2020R1</a> | 2020-03-20 | First release of 2020. This is the basis for jBallerina 1.2.0. |
| <a target="_blank" href="/spec/lang/2019R3/">2019R3</a> | 2019-09-07 | Stable release used as the basis for jBallerina 1.0.0 implementation. Mostly a cleanup from 2019R2 |
| <a target="_blank" href="/spec/lang/2019R2/">2019R2</a> | 2019-07-01 | Major revised edition of the language |
| <a target="_blank" href="/spec/lang/2019R1/">2019R1</a> | 2019-05-01 | First release with new versioning scheme with significant revisions |

### Current snapshot

For a snapshot of the current language specification including all changes, see the <a target="_blank" href="https://ballerina.io/spec/lang/master/">main language specification</a>.

### Previous drafts 

For previous draft language specifications of a Ballerina release, see the <a target="_blank" href="https://ballerina.io/spec/lang/draft/">draft language specification</a>.

## Standard library specifications

| Package | Edition | Current snapshot | Description |
| ------- | ------- | ---------------- | ----------- |
| `auth` | Swan Lake | <a target="_blank" href="/spec/auth/">Snapshot</a> | Auth package of Ballerina language, which is used for authorization of listeners and clients (HTTP, gRPC, GraphQL, WebSocket, WebSub, etc.). |
| `cache` | Swan Lake | <a target="_blank" href="/spec/cache/">Snapshot</a> | Cache package of Ballerina language, which provides a mechanism to manage frequently accessed data in-memory by using a semi-persistent mapping from key to value. |
| `constraint` | Swan Lake | <a target="_blank" href="/spec/constraint/">Snapshot</a> | Constraint package of Ballerina language, which provides APIs to validate the values that have been assigned to Ballerina types. |
| `crypto` | Swan Lake | <a target="_blank" href="/spec/crypto/">Snapshot</a> | Crypto package of Ballerina language, which provides Crypto functionalities. |
| `email` | Swan Lake | <a target="_blank" href="/spec/email/">Snapshot</a> | Email package of Ballerina language, which provides functionalities related to sending/receiving emails via SMTP, POP3, and IMAP protocols. |
| `file` | Swan Lake | <a target="_blank" href="/spec/file/">Snapshot</a> | File package of Ballerina language, which provides APIs to perform file, file path, and directory operations. |
| `ftp` | Swan Lake | <a target="_blank" href="/spec/ftp/">Snapshot</a> | FTP package of Ballerina language, which provides FTP client/listener functionalities to send and receive files by connecting to FTP/SFTP server. |
| `graphql` | Swan Lake | <a target="_blank" href="/spec/graphql/">Snapshot</a> | GraphQL package of Ballerina language, which provides GraphQL server functionalities to produce GraphQL APIs. |
| `grpc` | Swan Lake | <a target="_blank" href="/spec/grpc/">Snapshot</a> | gRPC package of Ballerina language, which provides APIs for gRPC client and server implementation. |
| `io` | Swan Lake | <a target="_blank" href="/spec/io/">Snapshot</a> | I/O package of Ballerina language, which provides file related I/O operations. |
| `http` | Swan Lake | <a target="_blank" href="/spec/http/">Snapshot</a> | HTTP package of Ballerina language, which provides HTTP client-server functionalities to produce and consume HTTP APIs. |
| `jwt` | Swan Lake | <a target="_blank" href="/spec/jwt/">Snapshot</a> | JWT package of Ballerina language, which is used for authorization of listeners and clients (HTTP, gRPC, GraphQL, WebSocket, WebSub, etc.). |
| `log` | Swan Lake | <a target="_blank" href="/spec/log/">Snapshot</a> | Log package of Ballerina language, which provides APIs to log information when running applications. |
| `mime` | Swan Lake | <a target="_blank" href="/spec/mime/">Snapshot</a> | MIME package of Ballerina language, which provides a set of APIs to work with messages, which follow the Multipurpose Internet Mail Extensions (MIME) specification as specified in the RFC 2045 standard. |
| `oauth2` | Swan Lake | <a target="_blank" href="/spec/oauth2/">Snapshot</a> | OAuth2 package of Ballerina language, which is used for authorization of listeners and clients (HTTP, gRPC, GraphQL, WebSocket, WebSub, etc.). |
| `os` | Swan Lake | <a target="_blank" href="/spec/os/">Snapshot</a> | OS package of Ballerina language, which provides APIs to retrieve information about the operating system and its current users. |
| `protobuf` | Swan Lake | <a target="_blank" href="/spec/protobuf/">Snapshot</a> | Protobuf package of Ballerina language, which provides APIs to represent a set of pre-defined protobuf types. |
| `random` | Swan Lake | <a target="_blank" href="/spec/random/">Snapshot</a> | Random package of Ballerina language, which provides APIs to generate pseudo-random numbers. |
| `regex` | Swan Lake | <a target="_blank" href="/spec/regex/">Snapshot</a> | Regex package of Ballerina language, which provides functionalities such as matching, replacing and splitting strings based on regular expressions. |
| `serdes` | Swan Lake | <a target="_blank" href="/spec/serdes/">Snapshot</a> | Serdes package of Ballerina language, which provides functinalities for serializing and deserializing subtypes of Ballerina anydata type. |
| `sql` | Swan Lake | <a target="_blank" href="/spec/sql/">Snapshot</a> | SQL package of Ballerina language, which provides the generic interface and functionality to interact with a SQL database. |
| `task` | Swan Lake | <a target="_blank" href="/spec/task/">Snapshot</a> | Task package of Ballerina language, which provides APIs to schedule a Ballerina job either once or periodically and manage the execution of those jobs. |
| `tcp` | Swan Lake | <a target="_blank" href="/spec/tcp/">Snapshot</a> | TCP package of Ballerina language, which provides TCP client-server functionalities. |
| `time` | Swan Lake | <a target="_blank" href="/spec/time/">Snapshot</a> | Time package of Ballerina language, which provides time generation and conversion APIs. |
| `toml` | Swan Lake | <a target="_blank" href="/spec/toml/">Snapshot</a> | TOML package of Ballerina language, which provides APIs to convert a TOML configuration file to `map<json>`, and vice-versa. |
| `udp` | Swan Lake | <a target="_blank" href="/spec/udp/">Snapshot</a> | UDP package of Ballerina language, which provides UDP client-server functionalities. |
| `uuid` | Swan Lake | <a target="_blank" href="/spec/uuid/">Snapshot</a> | UUID package of Ballerina language, which provides APIs to generate UUIDs based on the RFC 4122. |
| `websocket` | Swan Lake | <a target="_blank" href="/spec/websocket/">Snapshot</a> | WebSocket package of Ballerina language, which provides WebSocket client-server functionalities. |
| `websub` | Swan Lake | <a target="_blank" href="/spec/websub/">Snapshot</a> | WebSub package of Ballerina language, which provides WebSub compliant subscriber related functionalities. |
| `webusuhub` | Swan Lake | <a target="_blank" href="/spec/websubhub/">Snapshot</a> | WebSubHub package of Ballerina language, which provides WebSub compliant hub and publisher related functionalities. |
| `xmldata` | Swan Lake | <a target="_blank" href="/spec/xmldata/">Snapshot</a> | Xmldata package of Ballerina language, which provides APIs to perform conversions between XML and JSON/Ballerina records. |
| `yaml` | Swan Lake | <a target="_blank" href="/spec/yaml/">Snapshot</a> | YAML package of Ballerina language, which provides APIs to convert a YAML configuration file to JSON, and vice-versa. |

## Platform specifications

| Specification | Latest released version | Current snapshot |
| ---- | --------------- | ---------------- |
| Code to Cloud | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/c2c/code-to-cloud-spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/c2c/code-to-cloud-spec.md">Snapshot</a> |
| Configurable | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/configurable/spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/configurable/spec.md">Snapshot</a> |
| Language Extensions - Deprecation | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/langext/deprecation/spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/langext/deprecation/spec.md">Snapshot</a> |
| Package | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/packages/package-spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/packages/package-spec.md">Snapshot</a> |
| Test Framework | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/test/test-framework-spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/test/test-framework-spec.md">Snapshot</a> |

## Proposals for improvements/enhancements

For the proposals for improving Ballerina, see the <a target="_blank" href="/community/active-proposals/">work in progress proposals</a>.

<style> 
table {
    width:100%;
}
td {
    padding: 20px; 
}
li.cVersionItem  {display: none !important;}
</style>
