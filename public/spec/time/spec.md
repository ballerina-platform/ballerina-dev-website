# Specification: Ballerina Time Library

_Owners_: @daneshk @BuddhiWathsala  
_Reviewers_: @daneshk  
_Created_: 2021/12/04   
_Updated_: 2022/02/17  
_Edition_: Swan Lake 

## Introduction
This is the specification for the Time standard library of [Ballerina language](https://ballerina.io/), which provides time generation and conversion APIs.

The Time library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a GitHub issue or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Time Representations](#2-time-epresentations)
    * 2.1. [UTC](#21-utc)
    * 2.2. [Civil](#22-civil)
3. [Time Generation](#3-time-generation)
4. [Time Related Operations](#4-time-related-operations)
5. [Time Conversions](#5-time-conversions)
6. [Time Zone Handling](#time-zone-handling)

## 1. Overview
Ballerina time standard library has five primary aspects in handling time values.
1. Time representations
2. Time generation
3. Time-related operations
4. Time conversions
5. Time zone handling

## 2. Time representations

### 2.1. UTC
Coordinated Universal Time (UTC) is the time standard that defines time unambiguously. Ballerina represents UTC using a tuple of length 2.

```ballerina
public type Utc readonly & [int, decimal];
```
The tuple is an ordered type, so the values can be compared using the Ballerina <, <=, >, >= operators. The first member of the tuple is int representing an integral number of seconds from the epoch. Epoch is the traditional UNIX epoch of 1970-01-01T00:00:00Z. The second member of the tuple is a decimal giving the fraction of a second. For times before the epoch, n is negative, and f is non-negative. In other words, the UTC represented is on or after the second specified by n. Leap seconds handles as follows. The first member of the tuple ignores leap seconds: it assumes that every day has 86400 seconds. The second member of the tuple is >= 0 and is < 1 except during positive leaps seconds in which it is >= 1 and < 2. So given a tuple [n,f] after the epoch, n / 86400 gives the day number, and (n % 86400) + f gives the time in seconds since midnight UTC (for which the limit is 86401 on a day with a positive leap second).

### 2.2. Civil

Ballerina represents a date using mandatory year, month, and day fields. Additionally, the `Date` record can have optional time-related fields (such as hour, minute, and second) and a time zone offset. Similarly, the Ballerina time record has mandatory hour and minute fields with an optional second field, date fields, and a zone offset. The time zone offset has hours, minutes, and optional seconds fields.

The `Civil` record represents time within some region relative to a time scale stipulated by civilian authorities. Civil contains the following time-related information.
1. Specific date
2. Specific time
3. Time zone offset (UTC offset)
4. Day of week (e.g. Sunday, Monday)
5. Time zone abbreviation
6. Flag to indicate daylight savings time

## 3. Time generation

The time library contains two APIs to get the systematic time values.

The following API returns the current instant of the system clock in seconds from the epoch of `1970-01-01T00:00:00` with a given precision. The precision specifies the number of zeros after the decimal point (e.g. 3) would give the millisecond precision, and nil means native precision (nanosecond precision 9) of the clock).

```ballerina
public isolated function utcNow(int? precision = ()) returns Utc;
```

The following API can be used to return number of seconds from an unspecified epoch.

```ballerina
public isolated function monotonicNow() returns decimal;
```

## 4. Time related operations

Time standard library supports time-related operations such as addition, subtraction, and date validations.

Use the following API to add a given number of seconds to a UTC value.

```ballerina
public isolated function utcAddSeconds(Utc utc, Seconds seconds) returns Utc;
```

The following API returns the difference between two given UTC values.

```ballerina
public isolated function utcDiffSeconds(Utc utc1, Utc utc2) returns Seconds;
```

The following API validate a given date is adhere to the Gregorian calendar or not.

```ballerina
public isolated function dateValidate(Date date) returns Error?;
```

The following API returns the day of week value (e.g. Sunday, Monday etc.) of a given date.

```ballerina
public isolated function dayOfWeek(Date date) returns DayOfWeek;
```

## 5. Time conversions

The time library contains several conversion APIs to convert UTC to civil. The time library also has APIs to generate several string representations using UTC and Civil.

1. UTC to Civil
    ```ballerina
    public isolated function utcToCivil(Utc utc) returns Civil
    ```
2. UTC from Civil
    ```ballerina
    public isolated function utcFromCivil(Civil civilTime) returns Utc|Error;
    ```
3. RFC 3339 timestamp (e.g. `2007-12-03T10:15:30.00Z`) to Civil.
    ```ballerina
    public isolated function civilFromString(string dateTimeString) returns Civil|Error;
    ```
4. Civil to an RFC timestamp string
    ```ballerina
    public isolated function civilToString(Civil civil) returns string|Error;
    ```
5. Civil to email string (e.g `Wed, 10 Mar 2021 19:51:55 -0800 (PST)`)
    ```ballerina
    public isolated function civilToEmailString(Civil civil, HeaderZoneHandling zoneHandling) returns string|Error;
    ```
6. Civil from an email string (e.g `Wed, 10 Mar 2021 19:51:55 -0800 (PST)`)
    ```ballerina
    public isolated function civilFromEmailString(string dateTimeString) returns Civil|Error;
    ```

## 6. Time zone handling

The `Zone` object in the time library handles the time zone functionalities.

Currently, the `Zone` object can be obtained using two APIs as follows.

1. Load the `Zone` object related to the system time zone.
    ```ballerina
    public isolated function loadSystemZone() returns Zone|Error;
    ```
2. Get the `Zone` object related to a given zone ID.
    ```ballerina
    public isolated function getZone(string id) returns Zone?;
    ```

The following API in the `Zone` object checks the related time zone value is a fixed offset from UTC or not.

```ballerina
public isolated function fixedOffset() returns ZoneOffset?;
```

Then, there are two APIs in the Zone object to convert UTC values to Civil values concerning a time zone value.

The following API in the Zone object converts a given `Civil` value to a `Utc` timestamp based on the time zone value.

```ballerina
public isolated function utcFromCivil(Civil civil) returns Utc|Error;
```

On the other hand, the following API in the Zone object converts a given `Utc` timestamp to a `Civil` value based on the time zone value.

```ballerina
public isolated function utcToCivil(Utc utc) returns Civil;
```
