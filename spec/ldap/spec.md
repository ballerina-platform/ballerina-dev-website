# Specification: Ballerina LDAP Library

_Authors_: @Nuvindu \
_Reviewers_: @NipunaRanasinghe @ayeshLK @DimuthuMadushan \
_Created_: 2024/08/11 \
_Updated_: 2024/08/11 \
_Edition_: Swan Lake

## Introduction

This is the specification for the LDAP library of Ballerina language, which provides the capability to connect, authenticate, and interact with directory servers. It allows users to perform operations such as searching for entries, and modifying entries in an LDAP directory, providing support for directory-based operations.

The LDAP library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [LDAP client](#2-ldap-client)
    * 2.1 [Configurations](#21-configurations)
    * 2.2 [Initialization](#22-initialization)
    * 2.3 [Connection handling](#23-connection-handling)
        * 2.3.1 [Close operation](#231-close-operation)
        * 2.3.2 [Connection availability operation](#232-connection-availability-operation)
    * 2.4 [DNs and RDNs](#24-dns-and-rdns)
    * 2.5 [LDAP data types](#25-ldap-data-types)
        * 2.5.1 [The `ldap:Entry` type](#251-the-ldapentry-type)
        * 2.5.2 [The `ldap:LdapResponse` type](#252-the-ldapldapresponse-type)
        * 2.5.3 [The `ldap:Error` type](#253-the-ldaperror-type)
3. [Operation types](#3-operation-types)
    * 3.1 [Add operation](#31-add-operation)
    * 3.2 [Modify operation](#32-modify-operation)
    * 3.3 [ModifyDN operation](#33-modifydn-operation)
    * 3.4 [Compare operation](#34-compare-operation)
    * 3.5 [Search operation](#35-search-operation)
    * 3.6 [Search with type operation](#36-search-with-type-operation)
    * 3.7 [Delete operation](#37-delete-operation)

## 1. Overview

The Ballerina LDAP module provides support for interacting with directory servers which support LDAP protocol. This module provided various directory operations by establishing a connection to an LDAP server, allowing for tasks such as adding, modifying, deleting, and searching directory entries. It focus on ease of use and integration, making it straightforward for developers to perform directory-based operations within their Ballerina applications.

## 2. LDAP client

The `ldap:Client` instance needs to be initialized before performing the functionalities. Once initialized, it can perform various operations on directories. Currently, it supports the generic LDAP operations; `add`, `modify`, `modifyDN`, `compare`, `search`, `searchWithType`, `delete`, and `close`.

### 2.1 Configurations

When initializing the `ldap:Client`, `ldap:ConnectionConfig` configuration can be provided.

```ballerina
# Provides a set of configurations to connect with a directory server.
#
# + hostName - The host name of the active directory server
# + port -  The port of the active directory server
# + domainName -  The domain name of the active directory
# + password - The password of the active directory
public type ConnectionConfig record {|
    string hostName;
    int port;
    string domainName;
    string password;
|};
```

### 2.2 Initialization

The `init` method initializes the `ldap:Client` instance using the parameters `hostName`, `port`, `domainName`, and `password`. The `hostName` and `port` parameters are used to bind the request and authenticate clients with the directory server, while the `domainName` and `password` parameters establish the connection to the server for performing LDAP operations. In case of failure, the method returns an `ldap:Error`."

```ballerina
# Gets invoked to initialize the LDAP client.
#
# + config - The configurations to be used when initializing the client
# + return - A `ldap:Error` if client initialization failed
public isolated function init(*ConnectionConfig config) returns Error?;
```

### 2.3 Connection handling

This section covers the operations related to managing the connection between the LDAP client and the directory server.

#### 2.3.1 Close operation

Unbinds from the server and closes the LDAP connection.

```ballerina
# Unbinds from the server and closes the LDAP connection.
remote isolated function close();
```

#### 2.3.2 Connection availability operation

Determines whether the client is connected to the server.

```ballerina
# Determines whether the client is connected to the server.
#
# + return - A boolean value indicating the connection status
remote isolated function isConnected() returns boolean;
```

### 2.4 DNs and RDNs

The distinguished name (`DN`) of an entry is used to uniquely identify the entry and its location within the directory information tree (`DIT`) hierarchy. It's similar to how a file path specifies the location of a file in a filesystem.

A `DN` consists of one or more comma-separated components known as relative distinguished names (`RDN`s). Typically, the leftmost component in the `DN` is considered the `RDN` for that entry. [Learn more](https://ldap.com/ldap-dns-and-rdns/).

### 2.5 LDAP data types

This section introduces the various data types used in the Ballerina LDAP module. These types are used for interacting with the LDAP directory and performing operations.

## 2.5.1 The `ldap:Entry` type

An `ldap:Entry` is a record that holds information about an object or entity within the DIT. It includes a distinguished name, a set of object classes, and a set of attributes.

```ballerina
# LDAP entry type.
public type Entry record{|AttributeType...;|};

# Attribute type of an LDAP entry.
public type AttributeType boolean|int|float|decimal|string|string[];
```

## 2.5.2 The `ldap:LdapResponse` type

The `ldap:LdapResponse` type defines a data structure used to encapsulate common elements found in most LDAP responses.

**Result Code**: An integer indicating the status of the operation.

**Diagnostic Message**: This can provide extra details about the operation, such as reasons for any failure. This field is often missing in successful operations and may or may not be present in failed ones.

**Matched DN**: An optional DN that denotes the entry most closely matching the DN of a non-existent entry. For example, if an operation fails due to a missing entry, this field may specify the DN of the closest existing ancestor.

**Operation Type**: Indicates the type of the LDAP operation

**Referral URLs**: An optional collection of LDAP URLs that direct to other directories or locations within the DIT where the operation might be carried out. All provided URLs should be treated as equally valid for performing the operation.

## 2.5.3 The `ldap:Error` type

The `ldap:Error` type represents all the errors related to the LDAP module. This is a subtype of the Ballerina `error` type.

## 3. Operation types

The currently supported operation types in LDAP are listed here.

### 3.1 Add operation

Creates an entry in a directory server.

```ballerina
# Creates an entry in a directory server.
# 
# + dN - The distinguished name of the entry
# + entry - The information to add
# + return - A `ldap:Error` if the operation fails or `ldap:LdapResponse` if successfully created
remote isolated function add(string dN, Entry entry) returns LdapResponse|Error;
```

### 3.2 Modify operation

Updates information of an entry in a directory server.

```ballerina
# Updates information of an entry.
#
# + dN - The distinguished name of the entry
# + entry - The information to update
# + return - A `ldap:Error` if the operation fails or `LdapResponse` if successfully updated
remote isolated function modify(string dN, Entry entry) returns LdapResponse|Error;
```

### 3.3 ModifyDn operation

Renames an entry in a directory server.

```ballerina
# Renames an entry in a directory server.
#
# + currentDn - The current distinguished name of the entry
# + newRdn - The new relative distinguished name
# + deleteOldRdn - A boolean value to determine whether to delete the old RDN
# + return - A `ldap:Error` if the operation fails or `ldap:LdapResponse` if successfully renamed
remote isolated function modifyDn(string currentDn, string newRdn, boolean deleteOldRdn = false) returns LdapResponse|Error;
```

### 3.4 Compare operation

Determines whether a given entry has a specified attribute value.

```ballerina
# Determines whether a given entry has a specified attribute value.
# 
# + dN - The distinguished name of the entry
# + attributeName - The name of the target attribute for which the comparison is to be performed
# + assertionValue - The assertion value to verify within the entry
# + return - A `boolean` value indicating whether the values match, or an `ldap:Error` if the operation fails
remote isolated function compare(string dN, string attributeName, string assertionValue) returns boolean|Error;
```

### 3.5 Search operation

Returns a record containing search result entries and references that match the given search parameters.

```ballerina
# Returns a record containing search result entries and references that match the given search parameters.
#
# + baseDn - The base distinguished name of the entry
# + filter - The filter to be used in the search
# + scope - The scope of the search
# + return - An `ldap:SearchResult` if successful, or else `ldap:Error`
remote isolated function search(string baseDn, string filter, SearchScope scope) returns SearchResult|Error;
```

### 3.6 Search with type operation

Returns a list of entries that match the given search parameters.

```ballerina
# Returns a list of entries that match the given search parameters.
#
# + baseDn - The base distinguished name of the entry
# + filter - The filter to be used in the search
# + scope - The scope of the search
# + targetType - Default parameter use to infer the user specified type
# + return - An array of entries with the given type or else `ldap:Error`
remote isolated function searchWithType(string baseDn, string filter, SearchScope scope, typedesc<record{}[]> targetType = <>) returns targetType|Error;
```

### 3.6.1 Search scope

The `ldap:SearchScope` defines the part of the target subtree that should be included in the search.

**BASE** : Indicates that only the entry specified by the base DN should be considered

**ONE** : Indicates that only entries that are immediate subordinates of the entry specified by the base DN (but not the base entry itself) should be considered

**SUB** : Indicates that the base entry itself and any subordinate entries (to any depth) should be considered

**SUBORDINATE_SUBTREE** : Indicates that any subordinate entries (to any depth) below the entry specified by the base DN should be considered, but the base entry itself should not be considered, as described in [draft-sermersheim-ldap-subordinate-scope](https://docs.ldap.com/specs/draft-sermersheim-ldap-subordinate-scope-02.txt).

```ballerina
# Scope of the search operation.
public enum SearchScope {
    BASE,
    ONE,
    SUB,
    SUBORDINATE_SUBTREE
};
```

### 3.6.2 Search filter

Filters are essential for specifying the criteria used to locate entries in search requests. [Learn more](https://ldap.com/ldap-filters/).

### 3.7 Delete operation

Removes an entry from a directory server.

```ballerina
# Removes an entry in a directory server.
#
# + dN - The distinguished name of the entry to remove
# + return - A `ldap:Error` if the operation fails or `ldap:LdapResponse` if successfully removed
remote isolated function delete(string dN) returns LdapResponse|Error;
```
