# Specification: Ballerina Constraint Library

_Owners_: @TharmiganK @shafreenAnfar @chamil321  
_Reviewers_: @shafreenAnfar @chamil321  
_Created_: 2022/08/09  
_Updated_: 2023/01/31   
_Edition_: Swan Lake

## Introduction
This is the specification for the Constraint standard library of [Ballerina language](https://ballerina.io/), which 
provides APIs to validate the values that have been assigned to Ballerina types.

The Constraint library specification has evolved and may continue to evolve in the future. The released versions of the 
specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) 
or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification 
and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the 
specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` 
in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the 
specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Constraint annotations](#2-constraint-annotations)
   * 2.1. [Constraint annotation on number types](#21-constraint-annotation-on-number-types)
   * 2.2. [Constraint annotation on `string` type](#22-constraints-annotation-on-string-type)
   * 2.3. [Constraint annotation on array types](#23-constraint-annotation-on-array-types)
3. [`validate` function](#3-validate-function)

## 1. Overview
Validating user input is a common requirement in most applications. This can prevent user entry errors before the app 
attempts to process the data. In Ballerina, such validations can be carried out by the Constraint library.

This specification elaborates on the functionalities provided by the Constraint library and how the library 
validates the constraints in Ballerina types.

## 2. Constraint annotations
The Constraint library provides different annotations for different basic types e.g. `@constraint:String` for strings, 
`@constraint:Array` for arrays etc. Each of these is defined as a separate associated record type.

```ballerina
// Annotation
public annotation StringConstraints String on type, record field;

// Associated Record Type
type StringConstraints record {|
   int length?;
   int minLength?;
   int maxLength?;
|};
```

These annotations are attached to `type` or `record field` attachment points.

```ballerina
// Constriant attached to a type
@constraint:Int {
    minValue: 18
}
type Age int;

type User record {|
    // Constraint attached to a record field
    @constraint:String {
        minLength: 1,
        maxLength: 10
    }
    string name;

    // Constraint attached to a type used as a record field
    Age age;
|};
```

The following table illustrates all the supported annotations with respect to the Ballerina types.

| Ballerina Type                    | Annotation           |
|-----------------------------------|----------------------|
| `int`                             | `@constraint:Int`    |
| `float`                           | `@constraint:float`  |
| `int`&#124;`float`&#124;`decimal` | `@constraint:Number` |
| `string`                          | `@constraint:String` |
| `any[]`                           | `@constraint:Array`  |

### 2.1. Constraint annotation on number types

The Constraint library offers the following three constraint annotations on number types such as `int`, `float` and 
`decimal`. 

```ballerina
// Integer constraints which applies only when the value is `int`.
// The constraint values are also type of `int`
public type IntConstraints record {|
    int minValue?;
    int maxValue?;
    int minValueExclusive?;
    int maxValueExclusive?;
|};

// Float constraints which applies only when the value is `float`.
// The constraint values are also type of `float`
public type FloatConstraints record {|
    float minValue?;
    float maxValue?;
    float minValueExclusive?;
    float maxValueExclusive?;
|};

// Number constraints which applies when the value is `int|float|decimal`.
// The constraint values are type of `decimal`
public type NumberConstraints record {|
    decimal minValue?;
    decimal maxValue?;
    decimal minValueExclusive?;
    decimal maxValueExclusive?;
|};
```

All the supported constraints on number types are illustrated in the following table.

| Constraint name   | Semantics (v is value being <br/>constrained, c is constraint value) |
|-------------------|:--------------------------------------------------------------------:|
| minValue          |                                v >= c                                |
| maxValue          |                                v <= c                                |
| minValueExclusive |                                v > c                                 |
| maxValueExclusive |                                v < c                                 |

When defining constraints on number types, either `minValue` or `minValueExclusive` can be present. Similarly, either 
`maxValue` or `maxValueExclusive` can be present.

Example :
```ballerina
// Integer constraint
@constraint:Int {
    minValue: 18
}
type Age int;

// Float constraint
@constraint:Float {
    minValue: 0.0
}
type Area float;

// Number constraint
@constraint:Number {
    minValue: 0,
    maxValue: 100
}
type Percentage int|decimal;
```

### 2.2. Constraints annotation on `string` type

The following is the associated record type definition for `@constraint:String` annotation.

```ballerina
// String constraints which applies only when the value is `string`.
public type StringConstraints record {|
    int length?;
    int minLength?;
    int maxLength?;
|};
```

All the supported constraints on `string` type are illustrated in the following table.

| Constraint name | Semantics (v is value being <br/>constrained, c is constraint value) |
|-----------------|:--------------------------------------------------------------------:|
| length          |                           v.length() == c                            |
| minLength       |                           v.length() >= c                            |
| maxLength       |                           v.length() <= c                            |

When defining constraints on `string` type, if the `length` constraint is present then `minLength` or `maxLength` are 
not allowed.

Example :
```ballerina
@constraint:String {
    minLength: 5,
    maxLength: 10
}
type Username string;
```

### 2.3. Constraint annotation on array types

The Constraint library offers the `@constraint:Array` annotation on Ballerina `anydata[]` types. The following is the 
associated record type definition.

```ballerina
public type ArrayConstraints record {|
    int length?;
    int minLength?;
    int maxLength?;
|};
```

All the supported constraints on array types are illustrated in the following table.

| Constraint name   | Semantics (v is value being <br/>constrained, c is constraint value) |
|-------------------|:--------------------------------------------------------------------:|
| length            |                           v.length() == c                            |
| minLength         |                           v.length() >= c                            |
| maxLength         |                           v.length() <= c                            |

When defining constraints on array types, if the `length` constraint is present then `minLength` or `maxLength` are
not allowed.

Example :
```ballerina
@constraint:Array {
    minLength: 1,
    maxLength: 10
}
type Names string[];
```

## 3. `validate` function

The Constraint library has a public function : `validate` which should be explicitly called by the developer to 
validate the constraints. If the validation is successful then this function returns the validated value, else
a `constraint:Error` is returned. Additionally, if the type of the value is different from the expected return
type then the value will be cloned with the contextually expected type before the validation.

The following is the definition of the `validate` function.
```ballerina
public isolated function validate(anydata value, typedesc<anydata> td = <>) returns td|Error {
    // ...
}
```

Example :
```ballerina
type Person record {|
    @constraint:String {
        minLength: 5,
        maxLength: 10
    }
    string name;
|};

public function func1() returns error? {
    Person p1 = {name: "Alice"};
    p1 = check constraint:validate(p1);
    
    // Error case
    Person p2 = {name: "Bob"};
    // This will return an error since the length is less than 5
    p2 = check constraint:validate(p2);
}
```

