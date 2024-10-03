---
layout: ballerina-configurable-left-nav-pages-swanlake
title: Provide values to configurable variables
description: You can provide values for configurable variables through multiple methods, as described below.
keywords: ballerina, programming language, configurable, variables, values, toml
permalink: /learn/provide-values-to-configurable-variables/
active: provide-values-to-configurable-variables
intro: You can provide values for configurable variables through multiple methods, as described below.
---

>**Note:** If the configuration values are given in multiple ways, they will be overridden in the following order when retrieving them.

1. **Environment variables:** Configure the values through separate environment variables for each 
   configurable variable.

2. **Command-line arguments:** Configure the values through command-line arguments executed when running the Ballerina 
program. 

3. **Configuration using TOML content:**
   - Define the values using the [TOML syntax](#toml-syntax) and configure them through 
     configuration files.
   - Define the values using the [TOML syntax](#toml-syntax) and configure them through
     environment variables.

## Provide via environment variables

Use the syntax below to provide values for the variables through environment variables.

```
BAL_CONFIG_VAR_key=value
```

>**Note** The configurable value provided through an environment variable is expected to be in the `toString()` representation of the intended value. Currently, the environment-variable-based configuration supports only the configurable variables of types `int`, `byte`, `float`, `boolean`, `string`, `decimal`, `enum`, and `xml`.

The following examples explain how to provide environment variables to configure variables of specific Ballerina types.

| Ballerina type | Ballerina example                                                                                                                                                                                             | Setting environment variable for Windows                                          | Setting environment variable for Linux/macOS                                            |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| boolean        | <code>configurable boolean isAdmin = ?; </code>                                                                                                                                                               | `$ set BAL_CONFIG_VAR_ISADMIN=true` <br> or <br> `$ set BAL_CONFIG_VAR_ISADMIN=1` | `$ export BAL_CONFIG_VAR_ISADMIN=true` <br> or <br> `$ export BAL_CONFIG_VAR_ISADMIN=1` |
| byte           | <code>configurable byte age = ?; </code>                                                                                                                                                                      | `$ set BAL_CONFIG_VAR_AGE=25`                                                     | `$ export BAL_CONFIG_VAR_AGE=25`                                                        |
| int            | <code>configurable int port = ?; </code>                                                                                                                                                                      | `$ set BAL_CONFIG_VAR_PORT=9090`                                                  | `$ export BAL_CONFIG_VAR_PORT=9090`                                                     |
| float          | <code>configurable float height = ?; </code>                                                                                                                                                                  | `$ set BAL_CONFIG_VAR_HEIGHT=5.11`                                                | `$ export BAL_CONFIG_VAR_HEIGHT=5.11`                                                   |
| decimal        | <code>configurable decimal salary = ?; </code>                                                                                                                                                                | `$ set BAL_CONFIG_VAR_SALARY=50500.65`                                            | `$ export BAL_CONFIG_VAR_SALARY=50500.65`                                               |
| string         | <code>configurable string name = ?; </code>                                                                                                                                                                   | `$ set BAL_CONFIG_VAR_NAME=John`                                                  | `$ export BAL_CONFIG_VAR_NAME=John`                                                     |
| xml            | <code>configurable xml book = ?; </code>                                                                                                                                                                      | `$ set BAL_CONFIG_VAR_BOOK="<book>The Lost World</book>"`                         | `$ export BAL_CONFIG_VAR_BOOK="<book>The Lost World</book>"`                            |
| enum           | <code>enum Country { </code><br>    &nbsp;&nbsp;<code>LK = "Sri Lanka", </code><br>    &nbsp;&nbsp;<code>US = "United States" </code><br> <code>} </code><br> <code>configurable Country country = ?; </code> | `$ set BAL_CONFIG_VAR_COUNTRY="Sri Lanka"`                                        | `$ export BAL_CONFIG_VAR_COUNTRY="Sri Lanka"`                                           |
| union          | <code>configurable float&#124;int&#124;string measurement = ?; </code>                                                                                                                                        | `$ set BAL_CONFIG_VAR_MEASUREMENT="5 feet"`                                       | `$ export BAL_CONFIG_VAR_MEASUREMENT="5 feet"`                                          |

## Provide via command-line arguments

Use the syntax below to provide values for the variables through command-line arguments.

```
-Ckey=value
```

>**Note** The configurable value provided through a command-line argument is expected to be in the `toString()` representation of the intended value. Currently, the command-line-based configuration supports only the configurable variables of types `int`, `byte`, `float`, `boolean`, `string`, `decimal`, `enum`, and `xml`.

The following examples explain how to provide command-line arguments to configure variables of specific Ballerina types.

| Ballerina type | Ballerina example                                                                                                                                                                                             | Command-line argument                                                 |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| boolean        | <code>configurable boolean isAdmin = ?; </code>                                                                                                                                                               | `$ bal run -- -CisAdmin=true` <br> or <br> `$ bal run -- -CisAdmin=1` |
| int, byte      | <code>configurable byte age = ?; </code><br> <code>configurable int port = ?;</code>                                                                                                                          | `$ bal run -- -Cage=25 -Cport=9090`                                   |
| float, decimal | <code>configurable float height = ?; </code><br> <code>configurable decimal salary = ?;</code>                                                                                                                | `$ bal run -- -Cheight=5.6 -Csalary=50500.65`                         |
| string         | <code>configurable string name = ?; </code>                                                                                                                                                                   | `$ bal run -- -Cname=John`                                            |
| xml            | <code>configurable xml book = ?; </code>                                                                                                                                                                      | `$ bal run -- -CxmlVar="<book>The Lost World</book>"`                 |
| enum           | <code>enum Country { </code><br>    &nbsp;&nbsp;<code>LK = "Sri Lanka", </code><br>    &nbsp;&nbsp;<code>US = "United States" </code><br> <code>} </code><br> <code>configurable Country country = ?; </code> | `$ bal run -- -Ccountry="Sri Lanka"`                                  |
| union          | <code>configurable float&#124;int&#124;string measurement = ?; </code>                                                                                                                                        | `$ bal run -- -Cmeasurement="5 feet"`                                 |

## Provide using TOML content

### Provide via configuration files

You can provide configuration values via one or more configuration files in which the content is expected to comply with the [TOML syntax](#toml-syntax). 

1. Specify the path of the configuration file via the `BAL_CONFIG_FILES` environment variable. 

2. Ballerina also supports specifying multiple configuration files using the `BAL_CONFIG_FILES` environment variable with the OS-specific separator. The file precedence order will be as specified in the environment variable.

3. If an environment variable is not specified, a file named `Config.toml` will be sought in the current working directory, and this will be used by default when a Ballerina program is executed using the `bal run` command. 

4. Configuration values for testing can be provided in a file named `Config.toml` located in the `tests` directory. For more details, see [Define test-specific configurations](/learn/test-ballerina-code/configure-tests/#define-test-specific-configurations).

>**Note:**  Once the environment variable is specified, the `Config.toml` will not be considered for the configuration values by default. Therefore, if you are required to use the `Config.toml` file along with others, you need to specify all of them via `BAL_CONFIG_FILES` in the order in which they should be executed.

For example, consider a scenario in which the configurable variables are defined in the following way,

```ballerina
configurable int port = 9090;
configurable float maxPayload = ?;
configurable string username = ?;
configurable boolean verbose = true
```

and the values are provided in two files, an `info.toml`file, which is a user-defined configuration file and `Config.toml` file as follows.

**info.toml**

```toml
maxPayload = 1.0
verbose = true
```

**Config.toml**

```toml
port = 9000
username = "admin-user"
```

Accordingly, execute the commands below to provide the values via the `BAL_CONFIG_FILES` environment variable based on your operating system.

**For Windows:**

```
$ set BAL_CONFIG_FILES=<path-to-info.toml>;<path-to-Config.toml>
```

**For Linux/macOS:**

```
$ export BAL_CONFIG_FILES=<path-to-info.toml>:<path-to-Config.toml>
```

### Provide via environment variables

You can also provide configuration values through an environment variable named `BAL_CONFIG_DATA` in which the content is expected to comply with the [TOML syntax](#toml-syntax). 

For example, consider a scenario in which the configurable variables are defined in the following way,

```ballerina
configurable int port = 9000;
configurable float maxPayload = ?;
configurable string username = ?;
configurable boolean verbose = ?;
```

Accordingly, execute the commands below to configure the values via an environment variable based on your operating system.

**For Windows:**

```
$ set BAL_CONFIG_DATA=maxPayload=1.0\nusername="user1"\nverbose=true

```

**For Linux/macOS:**

```
$ export BAL_CONFIG_DATA='maxPayload=1.0\nusername="user1"\nverbose = true'
```

## TOML syntax

Ballerina defines a specific TOML syntax based on the <a href="https://toml.io/en/v0.4.0" target="_blank">TOML(v0.4) format</a> to be used when configuring the variables through the configuration files and environment variables. 

>**Info:** The way of providing values in the TOML content differs depending on the type of the configurable variable. Currently, the TOML-based configuration supports configurable variables of types `int`, `float`, `boolean`, `string`, `xml`,  `decimal`, `enum`, the arrays of the respective types, `map`, `record`, `table`, and the union of the respective types.

The examples below explain the mapping of Ballerina types to TOML types.

| Ballerina type           | Ballerina example                                                                                                                                                                                                                                                                                                                                    | TOML type                                                                                                                    | TOML example                                                                                                                                |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| nil                      | <code>configurable string? city = "London";</code><br/><code>type Address record {</code><br/>&nbsp;&nbsp;<code>string? city = &nbsp;"Paris";</code><br/><code>};</code><br/><code>configurable Address address = {};</code>                                                                                                                         | No TOML type is specified for the `()` value. A default value is expected when a configurable variable contains a nil type.  | N/A                                                                                                                                         |
| boolean                  | <code>configurable   boolean  isAdmin = ?;</code>                                                                                                                                                                                                                                                                                                    | Boolean                                                                                                                      | `isAdmin = true`                                                                                                                            |
| int, byte                | <code>configurable   byte  age = ?;</code><br/>  <code>configurable   int  port = ?;</code>                                                                                                                                                                                                                                                          | Integer                                                                                                                      | `age = 25` <br/>  `port = 9090`                                                                                                             |
| float, decimal           | <code>configurable   float  height = ?;</code><br/>  <code>configurable   decimal  salary = ?;</code>                                                                                                                                                                                                                                                | Float                                                                                                                        | `height = 5.6`<br/>  `salary = 50500.65 `                                                                                                   |
| string                   | <code>configurable   string  name = ?; </code>                                                                                                                                                                                                                                                                                                       | String                                                                                                                       | `name = "John"`                                                                                                                             |
| xml                      | <code>configurable xml book = ?;</code>                                                                                                                                                                                                                                                                                                              | String                                                                                                                       | `book = "<book>The Lost World</book>"`                                                                                                      |
| boolean[]                | <code>configurable   boolean[]  switches = ?;</code>                                                                                                                                                                                                                                                                                                 | Array of booleans                                                                                                            | `switches = [false, false, true]`                                                                                                           |
| int[] , byte[]           | <code>configurable   int[]  ports = ?;</code>                                                                                                                                                                                                                                                                                                        | Array of integers                                                                                                            | `ports = [9090, 9091]`                                                                                                                      |
| float[], decimal[]       | <code>configurable   float[]  rates = ?;</code>                                                                                                                                                                                                                                                                                                      | Array of floats                                                                                                              | `rates = [55.4, 76.3, 38.5]`                                                                                                                |
| string[]                 | <code>configurable   string[]  colors = ?;</code>                                                                                                                                                                                                                                                                                                    | Array of strings                                                                                                             | `colors = ["Red", "Green", "Blue"]`                                                                                                         |
| tuple                    | <code>configurable [string, int, string[], map<anydata>, int... ] student = ?;</code>                                                                                                                                                                                                                                                                | Array of respective types                                                                                                    | `student = ["Jane", 1101, ["Maths", "English"], {level = 4, class = "B"}, 98, 76, 88]`                                                      |
| map                      | <code>configurable   map &lt;string&gt; person = ?; </code>                                                                                                                                                                                                                                                                                          | TOML table                                                                                                                   | `[person]`<br/> `name = "Anna"`<br/> `city = "London"`                                                                                      |
| map[]                    | <code>configurable   map &lt;string&gt;[] people = ?; </code>                                                                                                                                                                                                                                                                                        | Array of TOML tables                                                                                                         | `[[people]]`<br/> `name = "John"`<br/> `city = "Paris"`<br/> `[[people]]`<br/> `name = "Jack"`<br/> `city = "Colombo"`                      |
| record                   | <code>type  Person  record {</code><br/>    &nbsp;&nbsp;<code>string  name;</code><br/>    &nbsp;&nbsp;<code>int  age;</code><br/><code>};</code><br/>  <code>configurable   Person  person = ?;</code>                                                                                                                                              | TOML table                                                                                                                   | `[person]`<br/>  `name = "John"`<br/> `age = 45`<br/>                                                                                       |
| record with record field | <code>type  Food  record {</code><br/>    &nbsp;&nbsp;<code>string  name;</code><br/>    &nbsp;&nbsp;<code>int  cal;</code><br/><code>};</code><br/><code>type  Diet  record {</code><br/>    &nbsp;&nbsp;<code>Food  food;</code><br/>    &nbsp;&nbsp;<code>int  age;</code><br/><code>};</code><br/>  <code>configurable   Diet  input = ?;</code> | TOML table - nested                                                                                                          | `[input]`<br/>  `age = 20`<br/> `food.name = "carrot"`<br/> `food.cal = 41`<br/>                                                            |
| record[]                 | <code>type  Person  record {</code><br/>    &nbsp;&nbsp;<code>string  name;</code><br/>    &nbsp;&nbsp;<code>int  age;</code><br/><code>};</code><br/>  <code>configurable   Person[]  people = ?;</code>                                                                                                                                            | Array of TOML tables                                                                                                         | `[[people]]`<br/>  `name = "John"`<br/> `age = 45`<br/> `[[people]]`<br/>  `name = "Jack"`<br/> `age = 32`                                  |
| table                    | <code>configurable   table &lt;map&lt;string&gt;&gt; users = ?; </code>                                                                                                                                                                                                                                                                              | Array of TOML tables                                                                                                         | `[[users]]`<br/> `name = "Tom"`<br/> `occupation = "Software Engineer"`<br/> `[[users]]`<br/> `name = "Harry"`<br/> `occupation = "Doctor"` |
| table[]                  | <code>configurable   table &lt;map&lt;string&gt;&gt;[] userTeams = ?; </code>                                                                                                                                                                                                                                                                        | 2D Array of inline-TOML tables                                                                                               | `userTeams = [[{name = "Tom", team = "Dev"}, {name = "Harry", team = "Dev"}], [{name = "Anna", team = "Finance"}]]`                         |
| enum                     | <code>enum  Country {</code><br/>   &nbsp;&nbsp;<code>LK =  "Sri Lanka" ,</code><br/>  &nbsp;&nbsp;<code>US =  "United States"</code><br/> <code>}</code><br/> <code>configurable  Country country = ?;</code>                                                                                                                                       | String                                                                                                                       | `country = "Sri Lanka"`                                                                                                                     |
| union, anydata, json     | <code>configurable int&#124;string code = ?;</code><br/><code>configurable anydata data = ?;</code><br/><code>configurable json payload = ?;</code>                                                                                                                                                                                                  | Relevant TOML type for the value                                                                                             | `code = "10001A"`<br/>`data = 123` <br/>`payload = {name = "Jane"}`                                                                         |

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
