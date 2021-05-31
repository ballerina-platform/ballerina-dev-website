---
layout: ballerina-left-nav-pages-swanlake
title: Sharing a Library package
description: The below is all about working with a library package. It explains how a library package is created and published to Ballerina Central.
keywords: ballerina, programming language, ballerina packages, libraries, publishing packages
permalink: /learn/user-guide/ballerina-packages/sharing-a-library-package/
active: sharing-a-library-package
intro: The below is all about working with a library package. It explains how a library package is created and published to Ballerina Central.
redirect_from:
- /learn/user-guide/ballerina-packages/sharing-a-library-package
---

## Sharing a Library package

To create a new library package, we use `bal new -t lib`:

```bash
$ bal new hello --template lib
```

This will create a new Ballerina package with a hello function. Let’s check what the `bal new` command generated for a library package:

```bash
$ cd hello
$ tree .
hello
    ├── Ballerina.toml 
    ├── hello.bal
    └── Package.md

0 directories, 3 files
```

Similar to our first package the `Ballerina.toml` is created. Apart from it, the hello.bal source file and the [Package.md](/learn/user-guide/ballerina-packages/package-layout#packagemd) files are created.

Let’s check the content of the `Ballerina.toml` file.

```toml
[package]
org = "user"
name = "hello"
version = "0.1.0"

[build-options]
observabilityIncluded = true
```

Let’s execute `bal build -c` to build the Ballerina archive of the package.

```bash
$ bal build -c
Compiling source
	user/hello:0.1.0

Creating bala
	target/bala/user-hello-any-0.1.0.bala
```

### Publishing a Library Package to Ballerina Central

Now that you have a package to share with others, it can be published to the [Ballerina Central](https://central.ballerina.io/). 
Ensure the package works as intended, because a publish is **permanent**. Once published to Ballerina Central, the version can never be overwritten, 
and the package cannot be removed. However, the number of versions of a package that can be pushed to Ballerina Central is not restricted.

As a precaution, you may use the [local repository](/learn/user-guide/ballerina-packages/dependencies#overriding-dependencies) first to test out the functionality of the library functions before publishing it to the Ballerina Central repository.


#### Setting up before the first publish

First, you need to create an account on Ballerina Central. To register, [visit the home page](https://central.ballerina.io) and log in via a Google or GitHub account.

Second, you need to [go to the dashboard page](https://central.ballerina.io/dashboard) and acquire an access token. Now copy the access token into the `Settings.toml` file in your home repository (`<USER_HOME>/.ballerina/`).

If you are connected to the internet via an HTTP proxy, add the following section to `Settings.toml` and change accordingly.

```toml
[proxy]
host = "localhost"
port = "3128"
username = ""
password = ""
```

#### Organizations

When you push a package to Ballerina Central, the organizations for the user is validated against the org defined in the [Ballerina.toml](/learn/user-guide/ballerina-packages/package-layout#ballerinatoml) file. Therefore, when you have more than one organization in Ballerina Central, be sure to pick the organization name that you intend to push the package into and set that as the org in the Ballerina.toml file inside the package directory and rebuild the package.

Also, organization names starting with `ballerina` (e.g. ballerina, ballerinax, ballerinai, etc) are reserved for system use and so we cannot publish any packages starting with the prefix ballerina to the Ballerina Central repository. So if you have used a name pattern matching this, update the `Ballerina.toml` and rebuild the package.

#### Publish the package

Now that you are ready to publish, use the `bal push` command to publish the package to Ballerina Central:

```bash
$ bal push
```

That’s how you publish your first package!

Now you can create your second package and use the package you just published in it.

#### Using Packages in Ballerina Central

Any package published in Ballerina Central is public and they can be used in packages as explained in the [Dependencies](/learn/user-guide/ballerina-packages/dependencies#dependencies) section. 


