---
layout: ballerina-installing-ballerina-left-nav-pages-swanlake
title: Setting up Ballerina
description: Let's get started.
keywords: ballerina, quick tour, programming language, http service
permalink: /learn/installing-ballerina/setting-up-ballerina/
active: setting-up-ballerina
intro: Let's get started.
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
  - /learn/user-guide/
  - /learn/user-guide
  - /learn/user-guide/getting-started/setting-up-ballerina
  - /learn/user-guide/getting-started/setting-up-ballerina/
  - /learn/getting-started/installing-ballerina/setting-up-ballerina
  - /learn/getting-started/installing-ballerina/setting-up-ballerina/
  - /learn/installing-ballerina/setting-up-ballerina
  - /learn/installing-ballerina/
  - /learn/installing-ballerina
---

## Trying Ballerina in the Playground

You can use the Ballerina Playground to write Ballerina programs without installing anything.

<link href="https://fonts.googleapis.com/css?family=Special+Elite&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/css/home-page.css"/>
<style>a.cMobileLogo img {display: block;}
       .nav > li.cVersionItem {display: block !important};
</style>
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
            <p class="cWindows"><b>Windows</b></p>
            <a id="packWindows" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}" class="cGTMDownload cDownload cDownloadNew smallMargin" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.windows-installer }}">
               <div class="cSize">Installer  msi <span id="packWindowsName">{{ site.data.swanlake-latest.metadata.windows-installer-size }}</span></div>
            </a>
            <ul class="cDiwnloadSubLinks">
               <li style="font-size:13px;"><a id="packWindowsMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}.md5">md5</a></li>
               <li style="font-size:13px;"><a id="packWindowsSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}.sha1">SHA-1</a></li>
               <li style="font-size:13px;"><a id="packWindowsAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.windows-installer }}.asc">asc</a></li>
            </ul>
         </div>
         <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 ">
            <p class="cLinux"><b>Linux</b></p>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" style="padding: 0;">
               <a id="packLinux" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}" class="cGTMDownload cDownload cLinuxPKGs  cDownloadNew smallMargin" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.linux-installer }}">
                  <div class="cSize">deb  <span id="packLinuxName">{{ site.data.swanlake-latest.metadata.linux-installer-size }}</span></div>
               </a>
               <ul class="cDiwnloadSubLinks">
                  <li style="font-size:13px;"><a id="packLinuxMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}.md5">md5</a></li>
                  <li style="font-size:13px;"><a id="packLinuxSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}.sha1">SHA-1</a></li>
                  <li style="font-size:13px;"><a id="packLinuxAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.linux-installer }}.asc">asc</a></li>
               </ul>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" style="padding: 0;">
               <a id="packLinux" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}" class="cGTMDownload cDownload cLinuxPKGs cDownloadNew smallMargin" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.rpm-installer }}">
                  <div class="cSize">rpm  <span id="packLinuxName">{{ site.data.swanlake-latest.metadata.rpm-installer-size }}</span></div>
               </a>
               <ul class="cDiwnloadSubLinks">
                  <li style="font-size:13px;"><a id="packLinuxMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}.md5">md5</a></li>
                  <li style="font-size:13px;"><a id="packLinuxSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}.sha1">SHA-1</a></li>
                  <li style="font-size:13px;"><a id="packLinuxAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.rpm-installer }}.asc">asc</a></li>
               </ul>
            </div>
         </div>
         <div class="clearfix"></div>
         <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 ">
            <p class="cMac"><b>macOS</b></p>
            <a id="packMac" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}" class="cGTMDownload cDownload cDownloadNew smallMargin" data-download="downloads" data-pack="{{ site.data.swanlake-latest.metadata.macos-installer }}">
               <div class="cSize">Installer pkg <span id="packWindowsName">{{ site.data.swanlake-latest.metadata.windows-installer-size }}</span></div>
            </a>
            <ul class="cDiwnloadSubLinks">
               <li style="font-size:13px;"><a id="packMacMd5" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}.md5">md5</a></li>
               <li style="font-size:13px;"><a id="packMacSha1" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}.sha1">SHA-1</a></li>
               <li style="font-size:13px;"><a id="packMacAsc" href="{{ site.dist_server }}/downloads/{{ site.data.swanlake-latest.metadata.version }}/{{ site.data.swanlake-latest.metadata.macos-installer }}.asc">asc</a></li>
            </ul>
         </div>
         </div></div></div>

For more download options, see [Downloads](/download).

## Installing Ballerina

Double-click on the package file you downloaded above to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution.

For more installation options, see [Installation Options](/learn/user-guide/getting-started/installation-options/).

## Updating Ballerina

Once you have Ballerina installed, you can use the Update Tool to update it to the latest version. To do this, execute the command below in a new CLI tab.

`bal dist update`

>**Info:** If you want to pull a specific Ballerina version, execute the `bal dist pull <VERSION>` command (e.g., `bal dist pull slbeta3`).

For more information, see [Update Tool](/learn/tooling-guide/cli-tools/update-tool/).

## Installing the VSCode Extension

Ballerina provides an extension to try out its development capabilities in Visual Studio Code. For instructions on setting it up, see [Quick Start](/learn/visual-studio-code-extension/quick-start/).
