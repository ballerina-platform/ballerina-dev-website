---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: AsyncAPI
description: The sections below include information about the usages of the Ballerina AsyncAPI tool.
keywords: ballerina, programming language, ballerina packages, package structure, package layout, AsyncAPI
permalink: /learn/cli-documentation/asyncapi/
active: asyncapi
intro: The sections below include information about the usages of the Ballerina AsyncAPI tool.
redirect_from:
  - /learn/cli-documentation/asyncapi
---

## AsyncAPI to Ballerina 

The AsyncAPI to Ballerina command supports several usages in the Ballerina AsyncAPI tool as follows.

```bash
bal openapi [-i | --input] <asyncapi-contract-file-path> [-o | --output] <output-location>
```

The command-line arguments below can be used with the command for each particular purpose as described below.

| Argument       | Description                                                                                                                                                                                                                                                                                                                                                                   |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i, --input`  | The `asyncapi-contract-path` parameter specifies the path of the AsyncAPI contract file (e.g., `my-api.yaml` or `my-api.json`) and is mandatory.                                                                 |
| `-o, --output` | The Ballerina files will be generated at the same location from which the AsyncAPI command is executed. Optionally, you can point to another directory location by using the optional flag `(-o\|--output`). |
                                                                                                 
<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
