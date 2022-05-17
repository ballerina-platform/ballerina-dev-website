## Description

This document is a guide to writing the body content of a BBE using markdown syntax.

## BBE Writing Guide

### 1. Creating the markdown file

- In the BBE resource folder (`./examples/<bbe-url>`), if a markdown file doesn’t exist, create a new markdown file with the name of the BBE.

> Ex: hello_world.md

### 2. Writing the BBE body content

- The content written in the markdown file will be rendered in the body of the BBE page. The page content will be created in the order the content is written in the markdown file.

- The content can include any markdown syntax. In the converting process, they will be converted into corresponding HTML tags.

- Apart from the basic markdown syntax, there are **2** special syntax for `ballerina code snippets` and `ballerina outputs` of a BBE.

<table>
    <tr>
        <th>Component</th>
        <th>Syntax</th>
    </tr>
    <tr>
        <td>Ballerina Code</td>
        <td><i>::: code &lt;resource_file_name&gt; :::</i></td>
    </tr>
    <tr>
        <td>Output</td>
        <td><i>::: out &lt;resource_file_name&gt; :::</i></td>
    </tr>
</table>

> Ex:
>
> 1.  **_::: code hello_world.bal :::_**
> 2.  **_::: out hello_world.out :::_**

### 3. Sample markdown file content

![BBE_md_sample](./images/BBE_md_sample.png)

### 4. Directory structure of a BBE

Below is the directory structure of examples directory in a `tree format`.

> /examples
>
> |--- bbe-url
>
> |&nbsp;&nbsp;&nbsp;&nbsp;|--- bal_file(s)
>
> |&nbsp;&nbsp;&nbsp;&nbsp;|--- out_file(s)
>
> |&nbsp;&nbsp;&nbsp;&nbsp;|--- metatags_file
>
> |&nbsp;&nbsp;&nbsp;&nbsp;|--- **md_file**

## Generating the HTML BBE pages from the markdown files

The `markdownConverter.js` script located at `./.github/scripts/bbe` is used to generate the HTML BBE pages using the markdown files.

For more details about the markdown converter script, check out this [document](../../.github/scripts/bbe/README.md).
