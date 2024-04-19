---
layout: ballerina-platform-specifications-left-nav-pages-swanlake
title: Ballerina specifications
intro: Read the Ballerina language specification and other specifications that cover the Ballerina library, built-in language extensions, testing, documentation, and more.
description: Read the Ballerina language specification and other specifications that cover the Ballerina library, built-in language extensions, testing, documentation, and more.
keywords: ballerina, specifications, spec, language specifications, platform specifications, Ballerina library specifications
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

Ballerina has a collection of specifications starting with the Ballerina Language Specification. Other specifications (which are yet to be moved to the specification repository or, in some cases, yet to be written) will cover the Ballerina library, built-in language extensions such as security, immutability & deprecation, module and project management, testing, documentation, compiler extensions for cloud, and Ballerina Central.

## Language specifications 

From the start of 2019, Ballerina  specifications are versioned chronologically using the convention `20XYRn`, where `XY` is the 2-digit year (e.g., 19), `R` stands for "Release" and `n` is the release number for that year. Prior to 2019, a semver versioning scheme was used. However, that approach was abandoned when the language specification reached 0.980.

### Released specifications

Below are the most stable versions of the language specification, which are in sync with the Ballerina releases.

> **Note:** The changes since previous releases section of the specification identifies the changes that have occurred in each version of the specification.

| Version | Release Date | Description |
| ------- | ------------ | ----------- |
| <a target="_blank" href="/spec/lang/2023R1/">2023R1</a> | 2023-07-07 | First release of 2023. This is the basis for Ballerina Swan Lake Update 7. |
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

## Ballerina library specifications

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
