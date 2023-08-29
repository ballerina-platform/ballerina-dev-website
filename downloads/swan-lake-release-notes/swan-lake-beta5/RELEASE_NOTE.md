---
layout: ballerina-left-nav-release-notes
title: Swan Lake Beta5
permalink: /downloads/swan-lake-release-notes/swan-lake-beta5/
active: swan-lake-beta5
redirect_from: 
    - /downloads/swan-lake-release-notes/swan-lake-beta5
---

### Overview of Ballerina Swan Lake Beta5

<em>This is the fifth Beta release in a series of planned Alpha and Beta releases leading up to the Ballerina Swan Lake GA release.</em> 

The Ballerina Swan Lake Beta5 release improves upon the Beta4 release by addressing the two issues below.

- [Conflict warning printed for usage of the same JAR](https://github.com/ballerina-platform/ballerina-distribution/issues/2367)
- [`bal test` should not delete the previously-generated executable JAR](https://github.com/ballerina-platform/ballerina-lang/issues/33526)

### Updating Ballerina

If you are already using Ballerina, you can use the [update tool](/learn/cli-documentation/update-tool/) to directly update to Ballerina Swan Lake Beta5 as follows. 

To do this, first, execute the command below to get the update tool updated to its latest version. 

> `bal update`

If you are using an **update tool version below 0.8.14**, execute the `ballerina update` command to update it. Next, execute the command below to update to Swan Lake Beta5.

> `bal dist pull slbeta5`

### Installing Ballerina

If you have not installed Ballerina, then download the [installers](/downloads/#swanlake) to install.
