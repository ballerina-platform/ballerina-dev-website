# Specification: Ballerina Regex Library

_Owners_: @daneshk @kalaiyarasiganeshalingam  
_Reviewers_: @daneshk  
_Created_: 2021/12/07  
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction  
This is the specification for the Regex standard library of [Ballerina language](https://ballerina.io/), which provides functionalities such as matching, replacing and splitting strings based on regular expressions.

The Regex library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Operations](#2-operations)
   * 2.1. [Matches](#21-matches)
   * 2.2. [Replace](#22-replace)
   * 2.3. [Split](#23-split)
   * 2.4. [Search](#24-search)

## 1. Overview
This library is based on [regular expressions](https://en.wikipedia.org/wiki/Regular_expression), which are notations 
for describing sets of character strings that specify a search pattern. It supports the [regular expression patterns of Java](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html#sum).

## 2. Operations

### 2.1. Matches
This is used to check whether a string matches the provided regex.
```ballerina
public isolated function matches(string stringToMatch, string regex) returns boolean;
```

### 2.2. Replace

The replace APIs are used to replace the occurrence/s of substrings that matches the provided regex in the original
string with the provided replacement string or string returned by the provided function. The following function and 
type are used to provide the constant or dynamic replacement string. 

```ballerina
 # A function to be invoked to create the new substring to be used to replace the matches.
 type ReplacerFunction function(Match matched) returns string;
 ```

```ballerina
 # A function to be invoked to create the new substring or string value to be used to replace the matches.
 public type Replacement ReplacerFunction|string;
 ```

The following APIs are provided to replace the matches:

- To replace all occurrences of substrings that matches the provided regex in the original string with the provided
replacement string or string returned by the provided function.
```ballerina
public isolated function replaceAll(string originalString, string regex, Replacement replacement) returns string;
```

- To replace only the first occurrence of the substring from the start index that matches the provided regex in the original string with
the provided replacement string or string returned by the provided function.
```ballerina
public isolated function replace(string originalString, string regex, Replacement replacement, int startIndex = 0) returns string;
```

### 2.3. Split
This splits a string into an array of substrings, using the provided regex as the delimiter.
```ballerina
public isolated function split(string receiver, string delimiter) returns string[];
```

### 2.4. Search

The search APIs extract substring/s of the string that matches the provided regex. It provides details of the matches such as substring value, start index, end index, and matched regex groups

The following records are used to hold the results of a match against a regular expression.

```ballerina
# Holds the matched substring and its position in the input string.
#
# + matched - Matched substring
# + startIndex - The start index of the match
# + endIndex - The last index of the match
type PartMatch record {|
   string matched;
   int startIndex;
   int endIndex;
|};
```

```ballerina
# Holds the results of a match against a regular expression.
# It contains the match boundaries, groups and group boundaries.
#
# + groups - Information about matched regex groups
public type Match record {|
   // The match for the whole regex
   *PartMatch;
   Groups groups;
|};
```

This `Groups` object handles the matches with the group of regex.

```ballerina
# Holds information about matched regex groups
public type Groups readonly & object {
   int count;
   // Capture groups are indexed from 1
   // Group 0 means whole regex
   // Panics if i < 0 or > count
   isolated function get(int i) returns PartMatch?;
};
```

The following APIs are provided by the regex module to extract string/s.
- To get all substrings in string that match the regex.
```ballerina
public isolated function searchAll(string str, string regex) returns Match[];
```

- To get the first substring from the start index in the given string that matches the regex.
```ballerina
public isolated function search(string str, string regex, int startIndex = 0) returns Match?;
```
