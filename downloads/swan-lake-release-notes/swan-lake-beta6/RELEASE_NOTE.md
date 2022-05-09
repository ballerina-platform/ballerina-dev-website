---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta6
permalink: /downloads/swan-lake-release-notes/swan-lake-beta6/
active: swan-lake-beta6
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta6
---

## Overview of Ballerina Swan Lake Beta6

<em>This is the sixth Beta release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Beta5 release.

## Updating Ballerina

If you are already using Ballerina, you can use the [update tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta6 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **update tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Beta5.

> `bal dist pull slbeta6`

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language updates

### Improvements

Updated the static type of the unary plus expression to be the same as the static type of the operand. The assignments below are allowed now.

```ballerina
public function main() {
    int:Unsigned8 a = 32;
    int:Unsigned8 b = +a;

    int:Unsigned16 c = 43;
    int:Unsigned16 d = +c;

    int:Unsigned32 e = 54;
    int:Unsigned32 f = +e;

    byte g = 127;
    byte h = +g;

    int:Signed8 i = -32;
    int:Signed8 j = +i;

    int:Signed16 k = -65;
    int:Signed16 l = +k;

    int:Signed32 m = -64;
    int:Signed32 n = +m;
}
```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta6](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta6%22+label%3AType%2FBug+label%3ATeam%2FCompilerFE).

## Standard library updates

### New features

#### `graphql` package
Added support for the GraphQL list type inputs.

#### `http` package
Introduced request and request error interceptors at the service level.

#### `xmldata` package
Added support to convert an XML to a record.

#### `time` package
Added time zone handling support.

### Improvements

#### `http` package
Allowed listener-level interceptors to have only the default path.

### Breaking changes

#### `graphql` package
Deprecated the `add` function in the `graphql:Context` object and introduced the `set` function.

**Old method:**
```ballerina
graphql:Context context = new;
graphql:Error? result = context.add("key", "<value>"); // Can return an error
```

**New method:**
```ballerina
graphql:Context context = new;
context.set("key", "<value>"); // Does not return anything
```

#### `http` package
- Changed the `RequestContext:add` function to `RequestContext:set`.

  ```ballerina
  service class DefaultRequestInterceptor {
      *http:RequestInterceptor;

      resource function 'default [string... path](http:RequestContext ctx) returns http:NextService|error? {
          ctx.set("last-interceptor", "default-interceptor");
          return ctx.next();
      }
  }
  ```
- Changed the `parseHeader()` function to support multiple header values.

  ```ballerina
  http:HeaderValue[] values = check http:parseHeader("text/plain;level=1;q=0.6, application/xml;level=2");
  ```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta6](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%22Swan+Lake+Beta6%22+label%3AType%2FBug).

## Developer tools updates

### Improvements

#### OpenAPI tool 

- Added the `--with-tests` option for the OpenAPI client generation command, which will generate a test file template for all the relevant remote functions of the client. For example,

  > `bal openapi -i <openapi contract> --mode client --with-tests`

- Added the `--export-openapi` option for the `build` command, which will generate OpenAPI contract files for all the services in the current package. For example,

  > `bal build --export-openapi`

#### CLI

- Introduced the `--target-dir` flag to the `run`, `test`, `doc`, and `clean` commands. With this, you can pass a custom directory to the aforementioned commands.
- Added support for creating packages using template packages in Ballerina Central. For example, `bal new -t wso2/choreo_sample`.

### Breaking changes

#### Test framework 

Improved the `assertFail` function to eliminate the fake return/panic that had to be added after the statement. The signature of the function is changed as follows.

**Old signature:** 

```ballerina
public isolated function assertFail(string msg = "Test Failed!");
```

**New signature:** 
```ballerina
public isolated function assertFail(string msg = "Test Failed!") returns never;
```

For example, the function below, which compiled without an issue in Beta5 will throw an `unreachable code` compilation error after this signature change.

```ballerina
 function testFunc(int|string val) returns int? {
   if (val is int) {
       return val;
   } else {
       test:assertFail();
   }
   return; //Remove this fake return statement to compile with Swan lake Beta6.
}
```

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Beta3 of the repositories below.

- [Language Server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta6%22+label%3AType%2FBug+label%3ATeam%2FLanguageServer)
- [OpenAPI](https://github.com/ballerina-platform/ballerina-openapi/issues?q=is%3Aissue+is%3Aclosed+milestone%3A%22Ballerina+Swan+Lake+-+Beta6%22+label%3AType%2FBug)
- [Debugger](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3AType%2FBug+label%3AArea%2FDebugger+milestone%3A%22Ballerina+Swan+Lake+-+Beta6%22+is%3Aclosed)

## Ballerina packages updates

### New features

Added support to add an `icon` field under the `[package]` table. For example,
```toml
[package]
org = "ballerinax"
name = "googleapis.gmail"
version = "0.1.0”
icon = “images/icon.png”
```

>**Info:** The specified icon file will be packaged into the `docs/` directory of the Ballerina archive (`.bala`). Only the `.png` format is supported for the icon.
 
