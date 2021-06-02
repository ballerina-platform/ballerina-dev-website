---
layout: ballerina-left-nav-pages-swanlake
title: Setting up Ballerina
description: A quick tour of the Ballerina programming language, including writing, running, and invoking an HTTP service and using a client to interact with a service.
keywords: ballerina, quick tour, programming language, http service
permalink: /learn/user-guide/getting-started/setting-up-ballerina/
active: setting-up-ballerina
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
  - /learn/user-guide/getting-started/
  - /learn/user-guide/getting-started/setting-up-ballerina
---

## Trying Ballerina in the Playground

You can use the Ballerina Playground to write Ballerina programs without installing anything.

<link href="https://fonts.googleapis.com/css?family=Special+Elite&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/css/home-page.css"/>
<style>a.cMobileLogo img {display: block;}</style>
<div class="row cBallerinaIntroSection">
   <div class="container">
      <div class="col-sm-12 col-md-12 cTopLayer">
         <div class="col-sm-12 col-md-4 cMainCTAContainer">
            <a class="cBallerina-io-Home-main-download-button cPlayButton" target="_blank" href="https://play.ballerina.io">
               Try Ballerina
               <p>Try without installing <br>in the playground</p>
            </a>
         </div>
   </div></div></div>
<div class="clearfix"></div>

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

For more installation options, see [Installation Options](/learn/user-guide/getting-started/installation-options/).

## Updating Ballerina

Once you have Ballerina installed, you can use the Update Tool to update it to the latest version. For this, execute the command below in a new CLI tab.

`bal dist pull slbeta1`

>**Info:** You might need to first update the Update Tool to its latest version. If you have an Update Tool version below 0.8.14, execute the `ballerina update` command or else execute the `bal update` command to do this.

For more information, see [Update Tool](/learn/tooling-guide/cli-tools/update-tool/).

## Installing the VSCode Extension

Ballerina provides an extension to try out its development capabilities in Visual Stusio Code. For instructions on setting it up, see [Installing the VS Code Extension](/learn/tooling-guide/vs-code-extension/installing-the-vs-code-extension/).

## What's Next?

Now, that your environment for Ballerina is all set up and running, let's [write your first Ballerina program](/learn/user-guide/getting-started/writing-your-first-ballerina-program/). 

