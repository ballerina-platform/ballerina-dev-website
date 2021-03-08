---
layout: ballerina-left-nav-pages-swanlake
title: Writing Your First Ballerina Program
description: A quick tour of the Ballerina programming language, including writing, running, and invoking an HTTP service and using a client to interact with a service.
keywords: ballerina, quick tour, programming language, http service
permalink: /learn/user-guide/getting-started/writing-your-first-ballerina-program/
active: writing-your-first-ballerina-program
intro: Now, that you know a little bit of Ballerina, let's take it for a spin!
redirect_from:
  - /learn/quick-tour
  - /learn/quick-tour/
  - /swan-lake/learn/getting-started/quick-tour/
  - /swan-lake/learn/getting-started/quick-tour
  - /learn/getting-started/quick-tour/
  - /learn/getting-started/quick-tour
  - /learn/getting-started/
  - /learn/getting-started
  - /learn/user-guide/getting-started
  - /learn/user-guide/
  - /learn/user-guide
  - /learn/user-guide/getting-started/writing-your-first-ballerina-program
---

## Downloading Ballerina

[Download](/downloads) Ballerina based on the operating system you are using and install it. 

<link rel="stylesheet" href="/css/download-page.css">
<script src="/js/download-page.js"></script>
<div class="clearfix"></div>
<div class="row cDownloads">
   <div class="container">
      <div class=" ">
         <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 ">
            <h3 class="cWindows">Windows</h3>
            <a id="packWindows" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}" class="cGTMDownload cDownload cDownloadNew" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.windows-installer }}">
               <div class="cSize">Installer  msi <span id="packWindowsName">{{ site.data.swanlake-latest.metadata.windows-installer-size }}</span></div>
            </a>
            <ul class="cDiwnloadSubLinks">
               <li><a id="packWindowsMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}.md5">md5</a></li>
               <li><a id="packWindowsSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}.sha1">SHA-1</a></li>
               <li><a id="packWindowsAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}.asc">asc</a></li>
            </ul>
         </div>
         <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 ">
            <h3 class="cLinux">Linux </h3>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" style="padding: 0;">
               <a id="packLinux" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}" class="cGTMDownload cDownload cLinuxPKGs  cDownloadNew" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.linux-installer }}">
                  <div class="cSize">deb  <span id="packLinuxName">{{ site.data.swanlake-latest.metadata.linux-installer-size }}</span></div>
               </a>
               <ul class="cDiwnloadSubLinks">
                  <li><a id="packLinuxMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}.md5">md5</a></li>
                  <li><a id="packLinuxSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}.sha1">SHA-1</a></li>
                  <li><a id="packLinuxAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}.asc">asc</a></li>
               </ul>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" style="padding: 0;">
               <a id="packLinux" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}" class="cGTMDownload cDownload cLinuxPKGs cDownloadNew" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.rpm-installer }}">
                  <div class="cSize">rpm  <span id="packLinuxName">{{ site.data.swanlake-latest.metadata.rpm-installer-size }}</span></div>
               </a>
               <ul class="cDiwnloadSubLinks">
                  <li><a id="packLinuxMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}.md5">md5</a></li>
                  <li><a id="packLinuxSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}.sha1">SHA-1</a></li>
                  <li><a id="packLinuxAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}.asc">asc</a></li>
               </ul>
            </div>
         </div>
         <div class="clearfix"></div>
         <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 ">
            <h3 class="cMac">macOS</h3>
            <a id="packMac" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}" class="cGTMDownload cDownload cDownloadNew" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.macos-installer }}">
               <div class="cSize">Installer pkg <span id="packWindowsName">{{ site.data.swanlake-latest.metadata.windows-installer-size }}</span></div>
            </a>
            <ul class="cDiwnloadSubLinks">
               <li><a id="packMacMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}.md5">md5</a></li>
               <li><a id="packMacSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}.sha1">SHA-1</a></li>
               <li><a id="packMacAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}.asc">asc</a></li>
            </ul>
         </div>
         </div></div></div> 


For more download options, see [Downloads](/download).

## Installing Ballerina

Double-click on the package file you downloaded above to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution.

For more installation options, see [Installation Options](/learn/user-guide/installation-options/).

## Updating Ballerina

Once you install Ballerina, you can use the Update Tool to update it to the latest version. For this, execute the command below in a new CLI tab.

`bal dist pull slalpha2`

>**Info:** You might need to first update the Update Tool to its latest version. If you have an Update Tool version below 0.8.14, execute the `ballerina update` command or else execute the `bal update` command to do this.

For more information, see [Update Tool](/learn/tooling-guide/cli-tools/update-tool/).

## Installing the VSCode Extension

Ballerina provides an extension to try out its development capabilities in Visual Stusio Code. For instructions on setting it up, see [Installing the VS Code Extension](/learn/tooling-guide/vs-code-extension/installing-the-vs-code-extension/).


## Writing Your First Ballerina Program

Let's create a Ballerina HTTP service and also an HTTP client to invoke it.

## Writing a simple Service

Write a simple HTTP service as shown below in a file with the `.bal` extension.

***hello_service.bal***
```ballerina
import ballerina/http;

# A service representing a network-accessible API
# bound to port `9090`.
service /hello on new http:Listener(9090) {

    # A resource representing an invokable API method
    # accessible at `/hello/sayHello`.
    #
    # + return - A string payload which eventually becomes 
    #            the payload of the response
    resource function get sayHello() returns string {
        return "Hello Ballerina!";
    }
}
```

## Running the Service

In the CLI, navigate to the location in which you have the `hello_service.bal` file and run the service by executing the command below.

```bash
bal run hello_service.bal
```

You get the following output.

```bash
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
```

This means your service is up and running. 

> **Note:** You can test the service by invoking it using an already-available HTTP client. For example, execute the command below in a new CLI tab to use [cURL](https://curl.haxx.se/download.html) as the client.

```bash
curl http://localhost:9090/hello/sayHello
```

You get the following response.

```bash
Hello Ballerina!
```

Alternatively, you can create a Ballerina HTTP client and use that to invoke the service as follows.

## Creating an HTTP Client to Invoke the Service

A Ballerina client is a component, which interacts with a network-accessible service. It aggregates one or more actions that can be executed on the network-accessible service and accepts configuration parameters related to the network-accessible service.

Create a Ballerina client as a Ballerina program with a `main` function as follows to invoke the `hello` service.   

> **Note**: Returning `error?` from the `main` function allows you to use the `check` keyword to avoid handling errors explicitly. This is only done to keep the code simple. However, in real production code, you may have to handle those errors explicitly.

***hello_client.bal***
```ballerina
import ballerina/http;
import ballerina/io;

public function main() returns @tainted error? {
    // Add the relevant endpoint URL to perform the invocation.
    http:Client helloClient = check new("http://localhost:9090/hello");

    // Perform a `GET` request to the `hello` service. If successful, 
    // the remote call would return an `http:Response` or the payload 
    // (if the `targetType` defaultable parameter is configured).
    // Otherwise an `error` on failure.
    http:Response helloResp = <http:Response> check helloClient->get("/sayHello");

    // Retrieve the payload as a `string` and print it if the 
    // response of the remote call is successful.
    io:println(check helloResp.getTextPayload());
}
```

## Invoking the Service Using the Client 

In a new tab of the CLI, navigate to the location in which you have the `hello_client.bal` file and execute the command below to run the `hello_client.bal` file containing the `main` function (of the client), which invokes the `hello` service.

> **Tip:** Make sure the `hello` service is [up and running](#running-the-service).

```bash
bal run hello_client.bal
```

This would produce the following output.


```bash
Hello Ballerina!
```

## What's Next?

Now, that you have taken Ballerina around for a quick tour, you can explore Ballerina more.

* Go through the [Ballerina by Examples](/learn/by-example) to learn Ballerina incrementally with commented examples that cover every nuance of the syntax.
* Star the [Ballerina GitHub repo](https://github.com/ballerina-platform/ballerina-lang) and show appreciation to the Ballerina maintainers for their work. Also, watch the repo to keep track of Ballerina issues.
<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p><p data-button="iGitWatchText">"Watch"</p></div>

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
