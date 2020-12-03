---
layout: ballerina-blank-page
title: Release Note
---
### Overview of jBallerina 1.2.11

The jBallerina 1.2.11 patch release improves upon the 1.2.10 release by addressing a number of [issues](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A%22Ballerina+1.2.11%22+is%3Aclosed).

You can use the [update tool](/learn/keeping-ballerina-up-to-date/) to update to jBallerina 1.2.11 as follows.

**For existing users:**

If you are already using jBallerina version 1.2.0, or above, you can directly update your distribution to jBallerina 1.2.11 by executing the following command:

> ballerina dist update

However, you need to use the following commands instead of the above if you have installed:

- jBallerina 1.2.0 but switched to a previous version: `ballerina dist pull 1.2.11`
- a jBallerina version below 1.1.0: install via the [installers](/downloads/)

**For new users:**

If you have not installed jBallerina, then download the [installers](/downloads/) to install.

#### Standard Library

##### HTTP

Introduce inbound response validation for HTTP/1.1 client. 

- `maxStatusLineLength` - The maximum length allowed for the response status line. Exceeding this limit will result in an error.
- `maxHeaderSize` - The maximum size allowed for headers. Exceeding this limit will result in an error.
- `maxEntityBodySize` - The maximum size allowed for the entity body. By default, it is set to -1, which means there is no restriction on the`maxEntityBodySize`. Exceeding this limit will result in an error.

##### Cache

Improve the concurrent behavior of the cache.
