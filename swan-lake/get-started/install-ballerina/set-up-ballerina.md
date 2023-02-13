---
layout: ballerina-installing-ballerina-left-nav-pages-swanlake
title: Set up Ballerina
description: Let's get started.
keywords: ballerina, quick tour, programming language, http service
permalink: /learn/install-ballerina/set-up-ballerina/
active: set-up-ballerina
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
  - /learn/installing-ballerina/setting-up-ballerina/
  - /learn/installing-ballerina/
  - /learn/installing-ballerina
  - /learn/install-ballerina/set-up-ballerina
  - /learn/install-ballerina/
  - /learn/install-ballerina
  - /learn/get-started/install-ballerina/set-up-ballerina/
  - /learn/get-started/install-ballerina/set-up-ballerina
---

## Download Ballerina

[Download](/downloads) Ballerina based on the operating system you are using and install it.

<link rel="stylesheet" href="/css/download-page.css">
<script src="/js/download-page.js"></script>
<div class="clearfix"></div>
<div class="row cDownloads">
      <!-- <div class=""> -->
         <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 ">
					<p class="cWindows">Windows</p>
					<a id="packWindows" href="{{ dist_server }}/downloads/{{ version }}/{{ windows-installer }}" class="cGTMDownload cDownload cDownloadNew" data-download="downloads" data-pack="{{ windows-installer }}">
						<div class="cSize">msi <span id="packWindowsName">{{ windows-installer-size }}</span></div>
					</a>
				</div>
				<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 ">
					<p class="cLinux">Linux </p>
          <div class="row" style='justify-content:space-around'>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 cMarginSmall">
              <a id="packLinux" href="{{ dist_server }}/downloads/{{ version }}/{{ linux-installer }}" class="cGTMDownload cDownload cLinuxPKGs  cDownloadNew" data-download="downloads" data-pack="{{ linux-installer }}">
                <div class="cSize">deb <span id="packLinuxName">{{ linux-installer-size }}</span></div>
              </a>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 cMarginSmall">
              <a id="packLinux" href="{{ dist_server }}/downloads/{{ version }}/{{ rpm-installer }}" class="cGTMDownload cDownload cLinuxPKGs cDownloadNew" data-download="downloads" data-pack="{{ rpm-installer }}">
                <div class="cSize">rpm <span id="packLinuxName">{{ rpm-installer-size }}</span></div>
              </a>
            </div>
          </div>
				</div>
				<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 ">
					<p class="cMac">macOS</p>
					<a id="packMac" href="{{ dist_server }}/downloads/{{ version }}/{{ macos-installer }}" class="cGTMDownload cDownload cDownloadNew" data-download="downloads" data-pack="{{ macos-installer }}">
						<div class="cSize">pkg <span id="packWindowsName">{{ macos-installer-size }}</span></div>
					</a>
				</div>
      <!-- </div> -->
   </div>

For more download options, see [Downloads](/downloads).

## Install Ballerina

Double-click on the package file you downloaded above to launch the installer. The installer guides you through the installation process and installs the Ballerina distribution.

For more installation options, see [Installation options](/learn/install-ballerina/installation-options/).

## Install the VS Code extension

Ballerina provides an extension to try out its development capabilities in Visual Studio Code. For instructions on setting it up, see <a href="https://wso2.com/ballerina/vscode/docs/get-started/install-the-extension/" target="_blank">Install the extension</a>.

## Learn more

Now, that you downloaded and installed Ballerina successfully, next, see [Get started with Ballerina](/learn/get-started-with-ballerina/) to start writing Ballerina programs.

<style>

a.cDownload .cSize {
  font-family: monaco, Consolas, "Lucida Console", monospace;
  font-size: 12px;
  color: #d9dadb;
  margin-top: -4px;
  padding-left: 10px;
}

a.cDownload {
  padding: 20px 10px 20px 40px;
  background-position: left 10px top 20px;
  margin: 0 ;
}


ul.cDiwnloadSubLinks {
  padding: 10px 10px;
}
ul.cDiwnloadSubLinks li {
  list-style: none;
  font-size: 13px !important;
}
/* Extra large devices (large laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1200px) {
      .cMarginSmall{
         padding: 0;
         width: 48%;
         /* margin-right: 2px */
      }
    }
</style>
