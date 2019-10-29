---
layout: ballerina-inner-page
title: CLI Commands
permalink: /learn/cli-commands/
---

# CLI Commands

## Ballerina init

Creates a scaffolding project if run from an empty directory. If run from an existing source directory, converts it to a project directory by creating .ballerina directory.
 
**Flags used**
```
--interactive or -i : Interactive mode
```

## Ballerina push <package-name>
Pushes a package to Ballerina Central or the home repository. If no flags are provided it will push the package to central. 

The org-name and version of the package will be extracted from Ballerina.toml, which resides in the package path.

**Flags used**
```
--repository <repoName> : Pushes the package to a given repository
```

**Example**
```
ballerina push twitter : Pushes the package to central
ballerina push twitter --repository home : Pushes the package to the home repository		
```

## Ballerina pull <org-name>/<package-name>: <version>

Downloads a given package to home repository. Providing the version is optional. If a version is not specified, the latest version of the package available in central will be downloaded. 

**Example**
```
ballerina pull wso2/twitter
```

## Ballerina search <text>

Searches for information about packages located in Ballerina Central and shows the search results. 

**Example**
```
ballerina search wso2 : Lists all packages which contains the keyword “wso2”	    
```

## Ballerina list 

Identifies and lists packages and local transitive dependencies of a project. 

**Example**
```
ballerina list twitter : Lists dependencies of the Twitter package.
```

## Ballerina run [flags] <balfile | packagename | balxfile> [args...]

Compiles and executes a Ballerina program or package. By default, 'ballerina run' executes the main function. If the main function is not there, it executes services. If the `-s` flag is given, `ballerina run` executes services instead of the main function.

**Flags used**
```
--service or -s : run services instead of main
--sourceroot : path to the directory containing source files and packages
--offline : packages will not be pulled from central while building
--config or -c : path to the Ballerina configuration file
--observe : enable observability with default configs
```

## Ballerina build

Builds all packages as part of a single project, without including transitive dependencies. `ballerina build <balfile | package-name> [-o output]` builds a single package into a project

**Flags used**
```
--offline : packages will not be pulled from central while building
-c : build a compiled package
-o: write output to the given file
```

## Ballerina install 

Installs packages to the home repository. This command is the same as `ballerina push <package-name> --repository home`. 
