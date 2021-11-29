---
layout: ballerina-learn-landing-page
title: Learn
description: Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below.
keywords: ballerina, learn, documentation, docs, programming language
permalink: /learn/
intro: Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Let's start learning Ballerina.
redirect_from:
 - /learn-beta2-column
 - /learn-beta2-column/
 - /learn
---


<style>
	:not(pre) > code[class*="language-"], pre[class*="language-"]{
		    background: #e0dede !important;
	}
.cBallerina-io-Gray-row.cLandingPageintro{ 
	padding-bottom:0;
}

.cBallerina-io-Home-Middle-col{
	padding-left:15px !important;
} 
.column-gray-box{ 
    padding: 40px 25px 15px 25px;
    background-color:#fff;
	height:	100%;
}
.row h2{ 
  display:block;
  margin-top:10px;
}
.card h3{ 
  font-size:20px;
  margin:0px !important;
}

.card p{
    margin-top:15px !important;
    margin-bottom:0px !important;
}

.card{
    border: none;
    margin: 10px 40px 15px 0px;
    padding: 0px 0px;
    /* max-width: 530px; */
    
}

.card:hover{
    color:#464646 !important;
    /* background-color:#F8F8F8; */
}

.column-gray-box-row{
	display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
    margin-top: -15px;
}
.column-gray-box-grid{
    -webkit-box-flex: 0;
    -ms-flex: 0 0 100;
    flex: 0 0 100;
    max-width: 100;
	padding-left:15px;
	padding-right:15px;
	padding-top:15px;

}
/* Add para height to keep consistency Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
    .card{
    max-width: 700px !important;
}
}
/* Add para height to keep consistency in Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    .card p{
    height:54px !important;
}
.card{
    max-width: 450px !important;
}
}

/* Add para height to keep consistency in Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    .card p{
    height:54px !important;
}
.card{
    max-width: 550px !important;
}
}
</style>


<div class="row" style=" margin-bottom:30px">
<h2 id="getting-started">Getting Started</h2>
<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card" >
  <a href="/learn/installing-ballerina/setting-up-ballerina/">
    <h3 id="installing-ballerina">Installing Ballerina</h3> </a>
    <p >Setting up the Ballerina development environment.  </p>
</div>

<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important;">
 <a href="/learn/getting-started/hello-world/writing-your-first-ballerina-program/">
    <h3 id="hello-world">Hello World</h3></a>
   <p >Writing your first Ballerina program and creating your first Ballerina package. </p>
</div>
</div>
<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card">
<a href="/learn/by-example/introduction/">
    <h3 id="learn-by-example">Learn by Examples</h3></a>
    <p >A series of guided examples to learn the language. </p>
</div>

<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important;">
  <a href="/learn/language-walkthrough/">
   	<h3 id="language-walkthrough-video">Language Walkthrough</h3></a>
  <p >A video series, which explains the language and its reference slide deck. </p>
</div>
</div>

<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card">
<h3 id="language-walkthrough-video"><a href="/learn/ballerina-shell/">Ballerina Shell</a></h3>
<p>Details of the Read-Evaluate-Print Loop (REPL) for Ballerina.</p>
</div>
<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important;">
 <a href="/learn/visual-studio-code-extension/quick-start/">
    <h3 id="installing-ballerina">Visual Studio Code Extension</h3></a>
    <p >Details of all the features of the Ballerina Visual Studio Code extension. </p>
</div>
</div>
</div>

<div class="row" style="margin-bottom:30px;">
<h2 id="concepts">Guides</h2>

<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card" >
  <a href="/learn/why-ballerina/cloud-native/">
   <h3 id="why-ballerina">Why Ballerina</h3></a>
    <p >Why you should use Ballerina.  </p>
</div>
<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important">
  <a href="/learn/language-guide/how-ballerina-does-what-all-programming-languages-do/">
   <h3 id="language-guide">Language Guide</h3></a>
    <p >Guide to learn the Ballerina language.  </p>
</div>
</div>

<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card">
 <a href="/learn/organizing-ballerina-code/package-layout/">
  <h3 id="organizing-ballerina-code">Organizing Ballerina Code</h3></a>
 	<p>Basics of projects, packages, and modules.  </p>
</div>
<div class="col-lg-6 col-md-6 col-sm-12 card"  style="margin-right:0px !important">
  <a href="/learn/testing-ballerina-code/testing-quick-start/">
   <h3 id="testing-ballerina-code">Testing Ballerina Code</h3> </a>
    <p >Details of writing automated tests using the built-in test framework.  </p>
</div>

</div>

<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card">
  <a href="/learn/generating-code-documentation/">
  <h3 id="generatinging-code-documentation">Generating Code Documentation
</h3></a>
  	<p>The usage of the <code class="highlighter-rouge language-plaintext">bal doc</code> CLI command.   </p>
</div>
<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important">
 <a href="/learn/making-ballerina-programs-configurable/defining-configurable-variables/">
  	<h3 id="making-ballerina-programs-configurable">Making Ballerina Programs Configurable</h3></a>
 	<p>The language support for configurability.   </p>

</div>
</div>

<div class="row">

<div class="col-lg-6 col-md-6 col-sm-12 card">
  <a href="/learn/observing-ballerina-programs/observing-your-application-with-prometheus-grafana-and-jaeger/">
 	<h3 id="observing-ballerina-programs">Observing Ballerina Programs
</h3></a>
  		<p>Basics of the observability functionalities that are provided for Ballerina programs. </p>
</div>
<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important">
 <a href="/learn/running-ballerina-programs-in-the-cloud/code-to-cloud/">
  		<h3 id="running-ballerina-programs-in-the-cloud">Running Ballerina Programs in the Cloud
</h3></a>
 	<p>The cloud offerings for running Ballerina programs.  </p>

</div>
</div>

<div class="row">

<div class="col-lg-6 col-md-6 col-sm-12 card">
  <a href="/learn/managing-dependencies/">
 	<h3 id="managing-dependencies">Managing Dependencies </h3></a>
  			<p>Details of declaring and managing dependencies and using the local repository.</p>
</div>
<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important">
<a href="/learn/publishing-packages-to-ballerina-central/">
  		<h3 id="publishing-packages-to-ballerina-central">Publishing Packages to Ballerina Central</h3></a>
		<p>Details of publishing your library package to Ballerina Central.  </p>
</div>
</div>		
<div class="row">

<div class="col-lg-6 col-md-6 col-sm-12 card" >
<a href="/learn/calling-java-code-from-ballerina-and-vice-versa/">
 <h3 id="calling-java-code-from-ballerina-and-vice-versa">Calling Java Code from Ballerina and Vice Versa</h3></a>
		<p>Instructions on the supported interoperability features. </p>
</div>

</div>				
</div>



<div class="row" style="margin-bottom:30px">
	<h2 id="references">References</h2>

<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card" >
<a href="/learn/by-example/">
 <h3 id="reference-guide-by-examples">Reference by Examples</h3></a>
		<p>A series of examples that serve as a reference guide for language constructs, concepts, and standard library modules. </p>
</div>

<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important;">
 <a href="https://lib.ballerina.io/">
  	<h3 id="library-documentation">Library Documentation</h3></a>
		<p>Ballerina library API documentation. </p>
</div>
</div>	

<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card" >
  <a href="/learn/cli-documentation/cli-commands/">
 	<h3 id="the-bal-tool">CLI Documentation</h3></a>
		<p>Details of all the CLI commands of the <code class="highlighter-rouge language-plaintext">bal</code> tool.  </p>
</div>

<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important;">
 <a href="/learn/platform-specifications/">
  <h3 id="specifications">Platform Specifications</h3></a>
		<p>Details of the Ballerina language specifications and proposals.  </p>
</div>
</div>
<div class="row">
<div class="col-lg-6 col-md-6 col-sm-12 card" >
  <a href="/learn/style-guide/coding-conventions/">
 	 <h3 id="style-guide">Style Guide</h3></a>
		<p>Best practices to follow when formatting Ballerina code.   </p>
</div>

<div class="col-lg-6 col-md-6 col-sm-12 card" style="margin-right:0px !important;">
 <a href="/learn/language-introduction/">
  	<h3 id="language-introduction-slides">Language Introduction</h3></a>
		<p>Presentation slides on the Ballerina language that you can use to talk about the language.</p>
</div>
</div>
</div>

