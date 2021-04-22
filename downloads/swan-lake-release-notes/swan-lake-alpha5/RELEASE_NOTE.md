---
layout: ballerina-blank-page
title: Release Note
---
### Overview of Ballerina Swan Lake Alpha5

<em>This is the <fifth> Alpha release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Alpha4 release.

- [Updating Ballerina](#updating-ballerina)
- [Installing Ballerina](#installing-ballerina)
- [Language Updates](#language-updates)
- [Runtime Updates](#runtime-updates)
- [Standard Library Updates](#standard-library-updates)
- [Code to Cloud Updates](#code-to-cloud-updates)
- [Developer Tools Updates](#developer-tools-updates)
- [Ballerina Packages Updates](ballerina-packages-updates)

### Updating Ballerina

If you are already using Ballerina, you can use the [Update Tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Alpha5 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **Update Tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Alpha5.

> `bal dist pull slalpha5`

### Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Language Updates

#### New Features

##### `lang.xml:data()` Lang Library Function

The `lang.xml:data()`  lang library function has been introduced to get the character data from an `xml` value. This function returns the character data of an `xml:Text` value as a string. For an `xml:Element` value this returns the concatenation of the result of invoking this function over the children of the element. Calling `lang.xml:data()` on comments, processing instructions, and empty sequences returns an empty string.

##### `lang.xml:getDescendants()` Lang Library Function

The `lang.xml:getDescendants()` lang library function has been introduced to retrieve a sequence of the descendant elements for a given element, in document order.

##### Bitwise Operations as Constant Expressions

Bitwise binary operations `<<`, `>>`, `>>>`, `^`, `&`, `|` are now allowed as constant expressions.

```ballerina
const BASE = 0x10;
const int SHIFTED = (BASE << 2) | 0xa;
```

#### Improvements

##### Improvements to the XML Literal

XML template literals now support the inclusion of multiple XML items of the same `xml` subtype as well as different `xml` subtypes.

```ballerina
xml x1 = xml `<ele>item</ele><!--comment-->text<?foo?>`;
xml<xml:Element> x2 = xml `<ele>item1</ele><ele>item2</ele>`;
xml<xml:Comment> x3 = xml `<!--comment1--><!--comment2-->`;
xml<xml:ProcessingInstruction> x4 = xml `<?foo?><?bar?>`;
string interpolation = "Interpolation";
xml<xml:Text> x5 = xml `text ${interpolation}`;
```

##### Normalization of XML Attribute Values
In XML template literals, character references within XML attribute values are now normalized to the referring character. For example, the value of the `e.attr` attribute in the following example is now `a&b`.

```ballerina
xml:Element e = xml `<elem attr="a&amp;b" />`;
```

#### Breaking Changes

- The `lang.array:lastIndexOf` and `lang.array:indexOf` lang library functions can only be used with arrays of which the element types are subtypes of the `anydata` type.
- A compilation error occurs if the field visibility qualifiers in the including type and the included type with object type inclusion are not the same.
- Remote method call action cannot be used to call non-remote methods.
- The `xml` and `readonly` type-descriptors can no longer be used as expressions. A reference to a type definition defined with such type-descriptors needs to be used instead.
- The argument passed to the second parameter of the `attach` method of the listener for service declarations has been fixed as follows. If there is no attach-point in the service, `()` (nil) is passed as the argument. If the attach-point is the root resource path ("/"), an empty array is passed.
- The `lang.xml:getContent()` function no longer accepts `xml:Text` as an argument. The new `lang.xml:data()` function can be used instead.
- `lang.value` functions cannot be called on expressions of type `object`. Function call syntax (`value:func(obj)`) can be used instead.
- The `lang.stream:reduce()` lang library function will only return the reduced value or an error (if the completion type includes a subtype of `error`). It no longer returns a nil `()` value. The return type of `lang.stream:reduce()` has been updated accordingly.
- An issue causing the complement of numeric literals to return incorrect values has been fixed.
- Negation has been disallowed with numeric literals.
- Subtyping rules have been fixed to consider the `never` type, which denotes an empty set of values as a subtype of any type `T`.
- Relational expressions with lists have been fixed to consider the relative order of lists with different sizes.
- Any non-error value will match the wildcard match pattern at runtime even when the matched expression's static type includes a subtype of `error`.
- An invalid attempt to transfer out a value via a return statement that uses `self` in an isolated object method results in a compilation error.
- In a `readonly` and `class` intersection, the method qualifiers are now preserved from the class.

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha5](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

### Runtime Updates

#### New Features


###### Support for Configurable Variables with Records Having Fields of Record Types

```ballerina
public type Person readonly & record {
     string name;
     int id;
     Address address;
};

public type Address  record {
    string city;
    County country;
};

public type County  record {
    string name;
};


configurable Person person = ?;

```

The  `Config.toml` would be as follows.

```toml
[person]
name = "waruna"
id = 10
address.city="Colombo"
address.country.name="Sri Lanka"

```

###### Support for Configurable Variables with Arrays Having Fields of Record Types

```ballerina
configurable Person[] & readonly personArray = ?;

```
The  `Config.toml` would be as follows.

```toml
[[personArray]]
name = "manu"
id = 11
address.city="New York"
address.country.name="USA"

[[personArray]]
name = "hinduja"
id = 12
address.city="London"
address.country.name="UK"
```

###### Support for Configurable Variables with Multidimentional Arrays

```ballerina
configurable int[][] & readonly int2DArr = ?;
```
The  `Config.toml` would be as follows.

```toml
int2DArr = [[1,2],[3,4]]
```

###### Support for Optional Module Name in TOML Syntax of Configurable Variables

When providing values for the configurable variables, the module information should be provided in the `Config.toml` file according to the following specifications.


* The org-name and module-name are optional for configurable variables defined in the root module of the program.
* The org-name is optional only for configurable variables defined in the root package of the program.
For example, consider a package with the organization name as `myOrg` and root module name as `main`. 

The  `main.bal` would be as follows.

```ballerina
import main.foo;
import importedOrg/mod;
configurable string mainVar = ?;
public function main() {
// use imported modules
}
```

The`foo.bal` file of the `main.foo` module will be as follows.


```ballerina
configurable string fooVar = ?;
```
In the `mod.bal`, which is from another package with the organization name `importedOrg` and module name `mod`, 

```ballerina
configurable string modVar = ?;
```

The values can be provided in `Config.toml` as follows.
```toml
mainVar = "variable from root module"
[main.foo]
fooVar = "variable from non-root module of the root package"
[importedOrg.mod]
modVar = "variable from non-root package"
```
#### Improvements
###### Improved Command-Line Argument Parsing

The command-line arguments are now parsed into:
- options
- option arguments
- operands

**Options**

Included record parameter as the last of the parameter specify options.

```ballerina
public type Person record {
	string name;
	float? score = 0;
};

public function main(*Person person) {
	// Process data here
}
```

```
bal run file.bal -- --name riyafa --score=99.9
```
In the above example, `name` and `score` are options. `riyafa` and `99.9` are arguments of the option.

**Operands**

Other parameters that are not included records specify operands; for these parameters, the position is significant and the name is not.

```ballerina
public type Person record {
	string name;
	float? score = 0;
};
public function main(int efficiency, string character, *Person person) {
	// Process data here
}
```

```
bal run file.bal -- --name riyafa  100 --score=99.9 Good
```

This example, which is the same as above includes `100`, which gets mapped to `efficiency`, and `Good`, which gets mapped to `character` as operands. 

Both operand and option parameters can be of types int, float, decimal, string, array of any of these types and union of any of these types with nil. 
Additionally, option parameters can be of types `boolean`, `boolean[]`, or `boolean?`.

**Operand Arrays**

>**Note:** If there is an operand parameter of type O[], then it cannot be followed by parameters of type O[], O?, and O x = d. Here O stands for a type that is a subtype of one of string, float, or decimal. An array value is specified by repeatedly specifying the `option` parameter.

If `scores` is an int array, then,

```ballerina
bal run file.bal -- --scores=10 --scores=20 --scores=30
```
This produces the following int array.
```
[10, 20, 30]
```

**Option Boolean Parameters**

When there’s an option of `boolean`, `boolean[]`, or `boolean?` type, it does not take an `option` argument. The presence of the option is considered to be `true` and the absence of it is considered to be false. 
In the following example, suppose `results` is a boolean array.
```
bal run file.bal -- --results --results --results
```
This produces the following boolean array.
```
[true, true, true]
```

#### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha5](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22+label%3AType%2FBug+label%3ATeam%2FjBallerina).

### Standard Library Updates

#### New Features

##### GraphQL Package
- Added named fragment support
- Added enum support
- Added map support
- Added compiler plugin validation for GraphQL services

##### Email Package
Added compiler plugin validation for Email listener services.

##### UDP Package
Added compiler plugin validation for UDP services.

##### HTTP Package
Added compiler plugin validations for HTTP services.

##### WebSocket Package
Added compiler plugin validation for WebSocket services.

##### Websub Package
Added compiler plugin validation for WebSub subscriber services.

##### WebsubHub Package
Added compiler plugin validation for WebSubHub services.

##### Kafka Package
Added compiler plugin validations for Kafka services.

##### RabbitMQ Package
Added compiler plugin validations for RabbitMQ services.

##### NATS Package
Added compiler plugin validations for NATS services.

##### STAN Package
Added compiler plugin validations for STAN services.

##### TCP Package
Added compiler plugin validation for TCP services.

#### Improvements
##### `jballerina.java` Package Updates
- Dependently-typed `java:cast` Function

The `java:cast` function is now a dependently-typed function. If the `typedesc` argument is not provided, it is inferred from the contextually-expected type.
```bal
FileInputStream|error obj1 = java:cast(inputStream, FileInputStream);
FileInputStream|error obj2 = java:cast(inputStream); // The second argument is inferred to be `FileInputStream`.
```

##### File Package Updates

- Changed the `path` field in the `ListenerConfig` from optional to mandatory.
- Improved the compiler plugin validation for the service.

##### Log Package Updates

- Changed the time format in the log output to RFC3339.
- Added validation to check log levels in the `Config.toml` file.

##### SQL Package Updates
If return types of the SQL time-related data types are expected as records, then the type of those records will be validated now and should be as follows.

- DATE -> time:Date
- TIME -> time:TimeOfDay
- TIME WITH TIME ZONE -> time:TimeOfDay
- TIMESTAMP -> time:Civil
- TIMESTAMP WITH TIME ZONE -> time:Civil

##### WebsubHub Package
Added the `websubhub:ServiceConfig` annotation.

#### Bug Fixes
##### Log Package Bug fixes

Invalid characters are now escaped properly in log messages (https://github.com/ballerina-platform/ballerina-standard-library/issues/1192).

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha5](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Alpha5%22+label%3AType%2FBug).

### Code to Cloud Updates

#### New Features

#### Improvements

#### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake Alpha5 of the repositories below.

- [C2C](https://github.com/ballerina-platform/module-ballerina-c2c/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22)
- [Docker](https://github.com/ballerina-platform/module-ballerina-docker/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22)
- [AWS Lambda](https://github.com/ballerina-platform/module-ballerinax-aws.lambda/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22)
- [Azure Functions](https://github.com/ballerina-platform/module-ballerinax-azure.functions/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22) 

### Developer Tools Updates

#### Language Server 

To view bug fixes, see the [GitHub milestone for Swan Lake Alpha5](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer).

#### New Features

#### Improvements

#### Bug Fixes

To view bug fixes, see the GitHub milestone for Swan Lake Alpha5 of the repositories below.

- [Language](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Alpha5%22+label%3AType%2FBug+label%3ATeam%2FDevTools)
- [Update Tool](https://github.com/ballerina-platform/ballerina-update-tool/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+project%3Aballerina-platform%2F32)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/issues?q=is%3Aissue+is%3Aclosed+label%3AType%2FBug+milestone%3A%22Ballerina+Swan+Lake+-+Alpha%22) 

#### Ballerina Packages Updates

### Breaking Changes
