---
layout: ballerina-cli-documentation-left-nav-pages-swanlake
title: GraphQL
description: The sections below include information about the usages of the Ballerina GrapQL tool.
keywords: ballerina, programming language, ballerina packages, package structure, package layout, GraphQL
permalink: /learn/cli-documentation/graphql/
active: graphql
intro: The sections below include information about the usages of the Ballerina GraphQL tool.
redirect_from:
  - /learn/cli-documentation/graphql
---

## GraphQL to Ballerina 

The GraphQL to Ballerina command supports several usages in the Ballerina GraphQL tool as follows.

```
bal graphql [-i | --input] <graphql-configuration-file-path> [-o | --output] <output-location> 
```

The command-line arguments below can be used with the command for each particular purpose as described below.

| Argument       | Description                                                                                                                                                                                                                                                                                                                                                                   |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-i, --input`  | The `graphql-configuration-file-path` parameter specifies the path of the GraphQL config file (e.g., `graphql.config.yaml`) configured with GraphQL schemas (SDL) and GraphQL documents. This parameter is mandatory. You can point to the GraphQL config file by using the mandatory flag (`-i,   --input`).                                                                 |
| `-o, --output` | The `output-location` parameter specifies the path of the output location of the generated files. This parameter is optional. If this parameter is not specified, the Ballerina files are generated at the same location from which the GraphQL command is executed. Optionally, you can point to another directory location by using the optional flag (`-o, --output`). |
                                                                                                         
<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
 
