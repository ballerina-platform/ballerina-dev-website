---
layout: ballerina-platform-specifications-left-nav-pages-swanlake
title: Platform specifications
intro: Read the Ballerina language spec and other specifications that cover the standard library, built-in language extensions, testing, documentation, and more.
keywords: ballerina, language specification, spec 
permalink: /learn/platform-specifications/
redirect_from:
  - /learn/language-specification
  - /learn/language-specification/
  - /learn/language-specifications
  - /learn/language-specifications/
  - /spec
  - /spec/
  - /learn/platform-specifications
  
---

## Ballerina language specifications and proposals

### Released specifications

The below are the most stable versions of the lanuguage specification, which are in sync with the Ballerina releases.

> **Note:** The Changes since previous releases section of the specification identifies the changes that have occurred in each version of the specification.

| Version | Release Date | Description |
| ------- | ------------ | ----------- | 
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

### Specification versioning convention

From the start of 2019, Ballerina  specifications are versioned chronologically using the convention `20XYRn`, where `XY` is the 2-digit year (e.g., 19), `R` stands for "Release", and `n` is the release number for that year. Prior to 2019, a semver versioning scheme was used. However, that approach was abandoned when the language specification reached 0.980.

### Proposals for improvements/enhancements

For the proposals for improving Ballerina, see the <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/lang/proposals/README.md">work in progress proposals</a>.

## Ballerina platform specifications

| Specification | Latest released version | Current snapshot |
| ---- | --------------- | ---------------- |
| Code to Cloud | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/c2c/code-to-cloud-spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/c2c/code-to-cloud-spec.md">Snapshot</a> |
| Configurable | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/configurable/spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/configurable/spec.md">Snapshot</a> |
| Language Extensions - Deprecation | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/langext/deprecation/spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/langext/deprecation/spec.md">Snapshot</a> |
| Package | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/packages/package-spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/packages/package-spec.md">Snapshot</a> |
| Test Framework | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/v2022R1/test/test-framework-spec.md">2022R1</a> | <a target="_blank" href="https://github.com/ballerina-platform/ballerina-spec/blob/master/test/test-framework-spec.md">Snapshot</a> |

## About Ballerina specifications

As a platform designed to have multiple implementations, Ballerina semantics are defined by a series of specifications and not by the implementation. Currently, we have only one implementation (i.e., jBallerina, which compiles Ballerina to Java bytecodes). Others will follow, including a compiler which generates native binaries using LLVM.

The Ballerina platform is specified by a collection of specifications starting with the Ballerina Language Specification. Other specifications (which are yet to be moved to the specification repository or, in some cases, yet to be written) will cover the standard library, built-in language extensions such as security, immutability & deprecation, module and project management, testing, documentation, compiler extensions for cloud, and Ballerina Central.

All Ballerina specifications are maintained in the [ballerina-spec](https://github.com/ballerina-platform/ballerina-spec/) GitHub repository. Designing is also done via clearly-identified issues in this repository. Contributors are encouraged to participate via existing issues or by creating new issues.

<style> 
table {
    width:100%;
}
td {
    padding: 20px; 
}
li.cVersionItem  {display: none !important;}
</style>
