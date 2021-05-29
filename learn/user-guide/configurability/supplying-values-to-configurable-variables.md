---
layout: ballerina-left-nav-pages-swanlake
title: Supplying Values to Configurable Variables
description: You can supply values to configurable variables using the methods below.
keywords: ballerina, programming language, configurable, variables, 
permalink: /learn/user-guide/configurability/supplying-values-to-configurable-variables/
active: supplying-values-to-configurable-variables
intro: You can supply values to configurable variables using the methods below.
redirect_from:
- /learn/user-guide/configurability/supplying-values-to-configurable-variables
---

## Supplying Through TOML Syntax

The configurable variables can be defined in different modules. Therefore, it is necessary to provide the information of the module in which the variable is defined. 

Currently, TOML-based configuration is supported for configurable variables of `int`, `float`, `boolean`, `string`, `decimal`, `enum`,  the arrays of the respective types, `map`, `record`, and `table` types.

The format below is used to provide the module information of a variable in the TOML-based configuration.

```toml
[org-name.module-name]
variable-name  = “value”
```

If the configurable variable is defined in the root module of the program, the `org-name` and `module-name` are optional. If the configurable variable is defined in the root package of the program, the `org-name` is considered optional.

The module name headers are not needed for single `bal` file execution.

For example, if a configurable variable `foo` is defined in a single `bal` file, it should be provided in the `Config.toml` as follows. 

```toml
foo = “value”
```

## Mapping of the Types

The mapping of Ballerina types to TOML types is given below.

| Ballerina Type 	| Ballerina Example                                                                	| TOML Type 	| TOML Example                             	|
|----------------	|----------------------------------------------------------------------------------	|-----------	|------------------------------------------	|
| int, byte      	| `configurable   byte  age = ?;`<br/>  `configurable   int  port = ?;`            	| Integer   	| `age = 25` <br/>  `port = 9090`          	|
| string         	| `configurable   string  name = ?; `                                              	| String    	| `name = “John”`                          	|
| float, decimal 	| `configurable   float  height = ?;`<br/>  `configurable   decimal  salary = ?; ` 	| Float     	| `height = 5.6`<br/>  salary = 50500.65 ` 	|


## Supplying Through Command-Line Arguments
