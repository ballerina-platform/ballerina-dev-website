---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta6
permalink: /downloads/swan-lake-release-notes/swan-lake-beta6/
active: swan-lake-beta5
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta6
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

### Overview of Ballerina Swan Lake Beta6

<em>This is the sixth Beta release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

The Ballerina Swan Lake Beta6 release improves upon the Beta5 release by addressing a few [Language issues](https://github.com/ballerina-platform/ballerina-lang/milestone/119).

### Updating Ballerina

If you are already using Ballerina, you can use the [Update Tool](/learn/tooling-guide/cli-tools/update-tool/) to directly update to Ballerina Swan Lake Beta6 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **Update Tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Beta5.

> `bal dist pull slbeta6`

### Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.

### Language Updates

#### Improvements

- The static type of the unary plus expression has been updated to be the same as the static type of the operand.

The following assignments are now allowed.

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
### Standard Library Updates

#### New Features

##### GraphQL Package
- added support for GraphQL list type inputs

##### HTTP Package
- Introduced request and request error interceptors at service level

#### Improvements

##### HTTP Package
- Changed `RequestContext:add` function to `RequestContext:set`
- Allowed listener level interceptors to have only the default path
- Improved `parseHeader()` function to support multiple header values

<style>.cGitButtonContainer, .cBallerinaTocContainer {display:none;}</style>

#### Improvements
##### Ballerina OpenAPI Tools
###### Ballerina OpenAPI client generation improvements for the OpenAPI to Ballerina command
- Add the flag `--with-tests` for openAPI client generation command to generate test boiler plates file to relevant
  remote functions.
  > `bal openapi -i <openapi contract> --mode client --with-test`

###### The Ballerina to OpenAPI command improvements
- Add support to generate openAPI contract files for all the services in the current package by introducing 
  new flag `--export-openapi` to `bal build` command.
  > `bal build --export-openapi`
