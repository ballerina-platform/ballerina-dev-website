---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta6
permalink: /downloads/swan-lake-release-notes/swan-lake-beta6/
active: swan-lake-beta6
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta6
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Beta6

<em>This is the sixth Beta release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

It introduces the new language features planned for the Swan Lake GA release and includes improvements and bug fixes done to the compiler, runtime, standard library, and developer tooling after the Swan Lake Beta5 release.

## Updating Ballerina

If you are already using Ballerina, you can use the [Update Tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta6 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **Update Tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Beta5.

> `bal dist pull slbeta6`

## Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

## Language Updates

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

### Bug Fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Beta6](https://github.com/ballerina-platform/ballerina-lang/milestone/119).

## Standard Library Updates

### New Features

#### `graphql` Package
Added support for the GraphQL list type inputs.

#### `http` Package
Introduced request and request error interceptors at the service level.

#### `time` Package
Added time zone handling support.

### Improvements

#### `http` Package
Allowed listener-level interceptors to have only the default path.

### Breaking Changes

#### `http` Package
- Changed the `RequestContext:add` function to `RequestContext:set`.
- Improved the `parseHeader()` function to support multiple header values.

## Developer Tools Updates

### Improvements

#### OpenAPI Tool 

- Added the `--with-tests` option for the OpenAPI client generation command, which will generate a test file template for all the relevant remote functions of the client. For example,

  > `bal openapi -i <openapi contract> --mode client --with-tests`

- Added the `--export-openapi` option for the `build` command, which will generate OpenAPI contract files for all the services in the current package. For example,

  > `bal build --export-openapi`

### Breaking Changes

#### Test Framework 

Improved the `assertFail` function to eliminate the fake return/panic that had to be added after the statement. The signature of the function is changed as follows.

**Old signature:** `public isolated function assertFail(string msg = "Test Failed!");`
**New signature:** `public isolated function assertFail(string msg = "Test Failed!") returns never;`

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
 