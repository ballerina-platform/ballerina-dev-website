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

| Ballerina Type     	| Ballerina Example                                                                                                               	| TOML Type            	| TOML Example                                                                                                                                	|
|--------------------	|---------------------------------------------------------------------------------------------------------------------------------	|----------------------	|---------------------------------------------------------------------------------------------------------------------------------------------	|
| int, byte          	| `configurable   byte  age = ?;`<br/>  `configurable   int  port = ?;`                                                           	| Integer              	| `age = 25` <br/>  `port = 9090`                                                                                                             	|
| string             	| `configurable   string  name = ?; `                                                                                             	| String               	| `name = “John”`                                                                                                                             	|
| float, decimal     	| `configurable   float  height = ?;`<br/>  `configurable   decimal  salary = ?; `                                                	| Float                	| `height = 5.6`<br/>  salary = 50500.65 `                                                                                                    	|
| boolean            	| `configurable   boolean  isAdmin = ?;`                                                                                          	| Boolean              	| `isAdmin = true`                                                                                                                            	|
| enum               	| `enum  Country {`<br/>   `LK =  "Sri Lanka" ,`<br/>  `US =  "United States"`<br/> `}`<br/> `configurable  Country country = ?;` 	| String               	| `country = “Sri Lanka”`                                                                                                                     	|
| int[] , byte[]     	| `configurable   int[]  ports = ?;`                                                                                              	| Array of integers    	| `ports = [9090, 9091]`                                                                                                                      	|
| string[]           	| `configurable   string[]  colors = ?;`                                                                                          	| Array of strings     	| `colors = [“Red”, “Green”, “Blue”]`                                                                                                         	|
| float[], decimal[] 	| `configurable   float[]  rates = ?;`                                                                                            	| Array of floats      	| `rates = [55.4, 76.3, 38.5]`                                                                                                                	|
| boolean[]          	| `configurable   boolean[]  switches = ?;`                                                                                       	| Array of booleans    	| `switches = [false, false, true]`                                                                                                           	|
| map                	| `configurable   map < string > person = ?;`                                                                                     	| TOML table           	| `[person]`<br/> `name = “Anna”`<br/> `city = “London”`                                                                                      	|
| map[]              	| `configurable   map < string >[] people = ?;`                                                                                   	| Array of TOML tables 	| `[[people]]`<br/> `name = “John”`<br/> `city = “Paris”`<br/> `[[people]]`<br/> `name = “Jack”`<br/> `city = “Colombo”`                      	|
| record             	| `type  Person  record  {`<br/>    `string  name;`<br/>    `int  age; };`<br/>  `configurable   Person  person = ?;`             	| TOML table           	| `[person]`<br/>  `name = “John”`</br> `age = 45`</br>                                                                                       	|
| record[]           	| `type  Person  record  {`<br/>    `string  name;`<br/>    `int  age; };`<br/>  `configurable   Person[]  people = ?;`           	| Array of TOML tables 	| `[[people]]`<br/>  `name = “John”`<br/> `age = 45`<br/> `[[people]]`<br/>  `name = “Jack”`<br/> `age = 32`                                  	|
| table              	| `configurable   table < map < string >>  users = ?;`                                                                            	| Array of TOML tables 	| `[[users]]`<br/> `name = "Tom"`<br/> `occupation = "Software Engineer"`<br/> `[[users]]`<br/> `name = "Harry"`<br/> `occupation = "Doctor"` 	|

## Supplying Through Command-Line Arguments

The values of the variables can be provided through the command-line parameters in the format below,

```bash
-Ckey=value
```

The key of a CLI parameter can be specified as shown below.

```bash
key:= [[org-name .] module-name .] variable
```

Similar to the [TOML syntax](#supplying-through-toml-syntax), the module information of the configurable variable can be provided with the command-line argument in the above format.

The configurable value provided through a command-line argument should be the `toString()` representation of the intended value. A command-line based configuration is only supported for configurable variables of types `int`, `float`, `boolean`, `string`, `decimal`, `enum` and `xml`. 

For an example on defining configurables in a Ballerina program, see [Trying it Out](/learn/user-guide/configurability/trying-it-out/).