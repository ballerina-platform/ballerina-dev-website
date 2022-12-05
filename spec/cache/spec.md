# Specification: Ballerina Cache Library

_Owners_: @daneshk @kalaiyarasiganeshalingam  
_Reviewers_: @daneshk  
_Created_: 2021/12/01  
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction
This is the specification for the Cache standard library of [Ballerina language](https://ballerina.io/), which provides a mechanism to manage frequently accessed data in-memory by using a semi-persistent mapping from key to value.

The Cache library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Eviction](#2-eviction)
3. [Operations](#3-operations)
    * 3.1. [Put](#31-put)
    * 3.2. [Get](#32-get)
    * 3.3. [invalidate](#33-invalidate)
    * 3.4. [invalidateAll](#34-invalidateall)
    * 3.5. [hasKey](#35-haskey)
    * 3.6. [keys](#36-keys)
    * 3.7. [size](#37-size)
    * 3.8. [capacity](#38-capacity)

## 1. Overview
This specification elaborates functionalities available in the Cache library.

This library is based on the [Least Recently Used (LRU)](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) algorithm and can be initialized by configuring the following properties:

- capacity - Maximum number of entries allowed in the cache.
- evictionFactor - The factor by which the entries will be evicted once the cache is full.
- evictionPolicy - The policy which is used to evict entries once the cache is full.
- defaultMaxAge - The max-age (in second) which all the cache entries are valid. '-1' means, the entries are valid forever.
- cleanupInterval - The interval (in seconds) of the recurrence task, which will clean up the cache.

## 2. Eviction
The cache eviction is a process to eliminate entry/entries from the cache by following the mechanism. The entries will be evicted in case of the following scenarios:

- When getting the entry, if the returning cache entry has expired, it gets removed.
- When putting the entry, if the cache size has reached its capacity, the number of entries gets removed. Entries are eliminated in terms of LRU policy, and the number of entries is also calculated by the capacity of the cache and the eviction factor.
- If `cleanupInterval` (optional property of the `cacheConfig`) is configured, the recurrence task will remove the expired cache entries based on the configured interval. 

## 3. Operations
The cache defines the most basic operations on a collection of cache entries, which entails basic reading, writing, and deleting individual cache items. This is thread-safe. Hence, data can be safely accessed by multiple concurrent threads.

### 3.1. Put
This adds the given key-value pair to the cache with an entry expiration time. The value can be in any of the ballerina types, but it is not allowed 
to insert `()` as the value of the cache since it doesn't make sense to have nil value. If the cache previously contained a value associated with the provided key, the old value will be replaced by the newly-provided value.
```ballerina
check cache.put("key", "value");
```

### 3.2. Get
This is used to fetch the cached value associated with the provided key.

```ballerina
any value = check cache.get("key");
```

### 3.3. Invalidate
This is used to discard a cached entry from the cache by its unique key.

```ballerina
check cache.invalidate("key");
```

### 3.4. InvalidateAll
This is used to discard all the cached values from the cache.

```ballerina
check cache.invalidateAll();
```

### 3.5. HasKey
This is used to check whether the given key has an associated cached value.

```ballerina
boolean result = cache.hasKey("key");
```

### 3.6. Keys
This is used to get a list of all the keys in the cache.

```ballerina
string[] keys = cache.keys();
```

### 3.7. Size
This is used to get the size of the cache.
```ballerina
int result = cache.size();
```

### 3.8. Capacity
This is used to get the capacity of the cache.
```ballerina
int result = cache.capacity();
```
