# Specification: Ballerina Random Library

_Owners_: @daneshk @MadhukaHarith92  
_Reviewers_: @daneshk  
_Created_: 2021/11/09  
_Updated_: 2022/02/08  
_Edition_: Swan Lake  

## Introduction
This is the specification for the Random standard library of [Ballerina language](https://ballerina.io/), which provides APIs to generate pseudo-random numbers.

The Random library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [Github issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Random Number Generation](#2-random-number-generation)

## 1. Overview
This specification elaborates on the random number generation functions available in the Random library.

## 2. Linear Congruential Generator
The [Linear Congruential Generator](https://en.wikipedia.org/wiki/Linear_congruential_generator) algorithm is used to generate random numbers in range. The generator is defined by,
```
x1 = (a * x0 + c) % m
```

where `x0` is the seed, `a` is the multiplier, `c` is the increment and `m` is the modulus. The following values are used in the formula.
- a = 25214903917
- c = 11
- m = 2^48

For x0 (seed), the current time in milliseconds is used.

## 3. Random number generation
A random decimal number between 0.0 and 1.0 can be generated using the `random:createDecimal()` function.
```ballerina
float randomValue = random:createDecimal();
```

A random integer between the given start(inclusive) and end(exclusive) values can be generated using the `random:createIntInRange()` function.
```ballerina
int randomInteger = check random:createIntInRange(1, 100);
```

