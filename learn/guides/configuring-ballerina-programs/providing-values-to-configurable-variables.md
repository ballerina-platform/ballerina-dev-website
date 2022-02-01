---
layout: ballerina-configurable-left-nav-pages-swanlake
title: Providing Values to Configurable Variables
description: You can supply values to configurable variables using the methods below.
keywords: ballerina, programming language, configurable, variables, values, toml
permalink: /learn/configuring-ballerina-programs/providing-values-to-configurable-variables/
active: providing-values-to-configurable-variables
redirect_from:
- /learn/user-guide/configurability/providing-values-to-configurable-variables
- /learn/user-guide/configurability/providing-values-to-configurable-variables/
- /learn/making-ballerina-programs-configurable/providing-values-to-configurable-variables
- /learn/making-ballerina-programs-configurable/providing-values-to-configurable-variables/
- /learn/configuring-ballerina-programs/providing-values-to-configurable-variables

---

The values for configurable variables can be provided through configuration files, command-line arguments, and
environment variables. The configuration values will be overridden in the following precedence order if the values are
given through multiple ways when retrieving configurable values:

- **Command-line Arguments:** The values can be configured through the command-line arguments when executing the Ballerina program. The configurable
    value provided through a command-line argument is expected to be the `toString()` representation of the intended 
    value.

- **Configuration Files:** The values can be configured through the configuration files in the [TOML(v0.4) format](https://toml.io/en/v0.4.0). 
    The file location can be specified through an environment variable with the name `BAL_CONFIG_FILES`. Ballerina supports
    specifying multiple configuration files using this environment variable with the OS-specific separator. The file
    precedence order will be as specified in the environment variable. If an environment variable is not specified, the file
    will be located in the current working directory with the file name `Config.toml` by default.

- **Environment Variables:** Users can provide the configuration values through an environment variable with the name `BAL_CONFIG_DATA` in which the
content is expected to be in the [TOML(v0.4.0) format](https://toml.io/en/v0.4.0).
>**Note:** Providing multiple configuration values through separate environment variables is not supported.

### Providing Configuration Values Through Command Line Arguments

The following syntax can be used to provide values for the variables through the command line parameters:

```
-Ckey=value
```

Currently, the command-line based configuration is only supported for configurable variables of types `int`, `byte`,
`float`, `boolean`, `string`, `decimal`, `enum` and `xml`.

The following examples explain the way of providing command-line arguments to configure variables of specific Ballerina
types.

| Ballerina type | Ballerina example                                                                                                                                                                     | Command-line argument                                             |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| int, byte      | <code>configurable byte age = ?; </code><br> <code>configurable int port = ?;</code>                                                                                                  | `bal run -- -Cage=25 -Cport=9090`                                 |
| string         | <code>configurable string name = ?; </code>                                                                                                                                           | `bal run -- -Cname=John`                                          |
| float, decimal | <code>configurable float height = ?; </code><br> <code>configurable decimal salary = ?;</code>                                                                                        | `bal run -- -Cheight=5.6 -Csalary=50500.65`                       |
| boolean        | <code>configurable boolean isAdmin = ?; </code>                                                                                                                                       | `bal run -- -CisAdmin=true` <br> or <br> `bal run -- -CisAdmin=1` |
| xml            | <code>configurable xml book = ?; </code>                                                                                                                                              | `bal run -- -CxmlVar="<book>The Lost World</book>"`               |
| enum           | <code>enum Country { </code><br>    <code>LK = "Sri Lanka", </code><br>    <code>US = "United States" </code><br> <code>} </code><br> <code>configurable Country country = ?; </code> | `bal run -- -Ccountry="Sri Lanka"`                                |

### Providing Configuration Values Through TOML Syntax

Ballerina defines a specific TOML syntax to be used when configuring the variables through the configuration files and
environment variables. Depending on the type of the configurable variable, the way of providing values in the TOML
content differs. Currently, TOML-based configuration is supported for configurable variables of `int`, `float`,
`boolean`, `string`, `xml`,  `decimal`, `enum`, the arrays of the respective types, map, record, table and the union of
the respective types.

The mapping of Ballerina types to TOML types can be explained through the following examples:

| Ballerina Type     | Ballerina Example                                                                                                                                                                       | TOML Type                        | TOML Example                                                                                                                                |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| int, byte          | <code>configurable   byte  age = ?;</code><br/>  <code>configurable   int  port = ?;</code>                                                                                             | Integer                          | `age = 25` <br/>  `port = 9090`                                                                                                             |
| string             | <code>configurable   string  name = ?; </code>                                                                                                                                          | String                           | `name = "John"`                                                                                                                             |
| float, decimal     | <code>configurable   float  height = ?;</code><br/>  <code>configurable   decimal  salary = ?;</code>                                                                                   | Float                            | `height = 5.6`<br/>  `salary = 50500.65 `                                                                                                   |
| boolean            | <code>configurable   boolean  isAdmin = ?;</code>                                                                                                                                       | Boolean                          | `isAdmin = true`                                                                                                                            |
| xml                | <code>configurable xml book = ?;</code>                                                                                                                                                 | String                           | `book = "<book>The Lost World</book>"`                                                                                                      |
| enum               | <code>enum  Country {</code><br/>   <code>LK =  "Sri Lanka" ,</code><br/>  <code>US =  "United States"</code><br/> <code>}</code><br/> <code>configurable  Country country = ?;</code>  | String                           | `country = "Sri Lanka"`                                                                                                                     |
| union              | <code>configurable int&#124;string code = ?;</code>                                                                                                                                     | Relevant TOML type for the value | `code = "10001A"`                                                                                                                           |
| int[] , byte[]     | <code>configurable   int[]  ports = ?;</code>                                                                                                                                           | Array of integers                | `ports = [9090, 9091]`                                                                                                                      |
| string[]           | <code>configurable   string[]  colors = ?;</code>                                                                                                                                       | Array of strings                 | `colors = ["Red", "Green", "Blue"]`                                                                                                         |
| float[], decimal[] | <code>configurable   float[]  rates = ?;</code>                                                                                                                                         | Array of floats                  | `rates = [55.4, 76.3, 38.5]`                                                                                                                |
| boolean[]          | <code>configurable   boolean[]  switches = ?;</code>                                                                                                                                    | Array of booleans                | `switches = [false, false, true]`                                                                                                           |
| map                | <code>configurable   map &lt;string&gt; person = ?; </code>                                                                                                                             | TOML table                       | `[person]`<br/> `name = "Anna"`<br/> `city = "London"`                                                                                      |
| map[]              | <code>configurable   map &lt;string&gt;[] people = ?; </code>                                                                                                                           | Array of TOML tables             | `[[people]]`<br/> `name = "John"`<br/> `city = "Paris"`<br/> `[[people]]`<br/> `name = "Jack"`<br/> `city = "Colombo"`                      |
| record             | <code>type  Person  record {</code><br/>    <code>string  name;</code><br/>    <code>int  age;</code><br/><code>};</code><br/>  <code>configurable   Person  person  ?;</code>          | TOML table                       | `[person]`<br/>  `name = "John"`<br/> `age = 45`<br/>                                                                                       |
| record[]           | <code>type  Person  record {</code><br/>    <code>string  name;</code><br/>    <code>int  age;</code><br/><code>};</code><br/>  <code>configurable   Person[]  peope = ?;</code>        | Array of TOML tables             | `[[people]]`<br/>  `name = "John"`<br/> `age = 45`<br/> `[[people]]`<br/>  `name = "Jack"`<br/> `age = 32`                                  |
| table              | <code>configurable   table &lt;map&lt;string&gt;&gt; users = ?; </code>                                                                                                                 | Array of TOML tables             | `[[users]]`<br/> `name = "Tom"`<br/> `occupation = "Software Engineer"`<br/> `[[users]]`<br/> `name = "Harry"`<br/> `occupation = "Doctor"` |

### Providing Module Information of the Configurable Variable

The configurable variables can be defined in different modules. Therefore, it is necessary to provide the information of
the module in which the variable is defined.

The module information requirement can be explained in the following table according to the variable definition.
<br/>
<table width="100%">
<thead>
<tr>
<th style="text-align:center" colspan="2"><strong>Place where the variable is defined</strong></th>
<th style="text-align:center" colspan="2"><strong>Module Information</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center"><strong>Package</strong></td>
<td style="text-align:center"><strong>Module</strong></td>
<td style="text-align:center"><strong>Organization name</strong></td>
<td style="text-align:center"><strong>Module Name</strong></td>
</tr>
<tr>
<td style="text-align:center">Root package</td>
<td style="text-align:center">Root module</td>
<td style="text-align:center">optional</td>
<td style="text-align:center">optional</td>
</tr>
<tr>
<td style="text-align:center">Root package</td>
<td style="text-align:center">Non-root module</td>
<td style="text-align:center">optional</td>
<td style="text-align:center">mandatory</td>
</tr>
<tr>
<td style="text-align:center">Non-root package</td>
<td style="text-align:center">Root/ Non-root module</td>
<td style="text-align:center">mandatory</td>
<td style="text-align:center">mandatory</td>
</tr>
</tbody>
</table>
<br/>

>**Note:** The module information is not needed for configuring single `bal` file execution.

The format of providing module information in each configuration syntax is described below.

#### Command Line Argument Syntax

The key of a CLI parameter can be specified as,

```
-Ckey=value
```

The key can contain module information as follows.

```
key:= [[org-name .] module-name .] variable
```

#### TOML Syntax

The following format is used to provide the module information of a variable in the TOML based configuration.

```toml
[org-name.module-name]
variable-name = "value"
```

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
