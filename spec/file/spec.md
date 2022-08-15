# Specification: Ballerina File Library

_Owners_: @daneshk @kalaiyarasiganeshalingam  
_Reviewers_: @daneshk  
_Created_: 2021/12/10   
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction
This is the specification for the File standard library of [Ballerina language](https://ballerina.io/), which provides APIs to perform file, file path, and directory operations.

The File library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [File Metadata](#2-file-metadata)
3. [File & Directory Operations](#3-file-and-directory-operations)
   * 3.1. [Get Current Directory](#31-get-current-directory)
   * 3.2. [Create Directory](#32-create-directory)
   * 3.3. [Create File](#33-create-file)
   * 3.4. [Rename](#34-rename)
   * 3.5. [Copy](#35-copy)
   * 3.6. [Remove](#36-remove)
   * 3.7. [Get Metadata](#37-get-metadata)
   * 3.8. [Read Directory](#38-read-directory)
   * 3.9. [Create Temporary File](#39-create-temporary-file)
   * 3.10. [Create Temporary Directory](#310-create-temporary-directory)
   * 3.11. [Test](#311-test)
4. [Path Operations](#4-path-operations)
   * 4.1. [Path Constants](#41-path-constants)
   * 4.2. [Get Absolute Path](#42-get-absolute-path)
   * 4.3. [Is Absolute](#43-is-absolute)
   * 4.4. [Get Basename](#44-get-basename)
   * 4.5. [Get Parent Path](#45-get-parent-path)
   * 4.6. [Normalize Path](#46-normalize-path)
   * 4.7. [Split Path](#47-split-path)
   * 4.8. [Join](#48-join-path)
   * 4.9. [Get Relative Path](#49-get-relative-path)
5. [Directory Listener](#5-directory-listener)

## 1. Overview
Ballerina file standard library provides functionalities related to manipulating and working with files and directories.
All operations are supported on both Windows and Unix-based operating systems. 

## 2. File Metadata
Metadata information of files and directories will contain the following
* Absolute path
* Size in bytes
* Last modified time
* Whether it is a file or directory
* Read permission
* Write permission
```ballerina
public type MetaData record{|
    string absPath;
    int size;
    time:Utc modifiedTime;
    boolean dir;
    boolean readable;
    boolean writable;
|}; 
```

## 3. File and Directory Operations
The following operations are used to manipulate files and directories.

### 3.1. Get Current Directory
This is used to obtain the absolute path of the current working directory.
```ballerina
public isolated function getCurrentDir() returns string;
```

### 3.2. Create Directory
This is used to create a new directory. An option can be passed to configure whether non-existent parent directories
will be created or not during this process.
```ballerins
public isolated function createDir(string dir, DirOption option);
```

### 3.3. Create File
This is used to create a new file in the provided path.
```ballerina
public isolated function create(string path) returns Error?;
```

## 3.4. Rename
This is used to rename (move) a file or directory. If the newPath provided already exists and is not a directory, it
will be replaced. 
```ballerina
public isolated function rename(string oldPath, string newPath) returns Error?;
```

### 3.5. Copy
This is used to copy the file or directory in the provided path to a new location as specified in the new path. Options
can be passed to define how this operation is executed. 

Possible options
* Whether existing files/directories should be replaced
* Whether file attributes should be copied
* If the source is a symbolic link, whether the link should be copied, or the target file.
```ballerina
public isolated function copy(string sourcePath, string destinationPath, CopyOption... options) returns Error?;
```

### 3.6. Remove
This is used to remove a file or directory. If the provided path is a directory, an option can be passed to configure
whether all files and directories inside the given directory should be recursively removed.
```ballerina
public isolated function remove(string path, DirOption option) returns Error?'
```

### 3.7. Get Metadata
This is used to obtain the metadata information of the file specified in the provided path.
```ballerina
public isolated function getMetaData(string path) returns MetaData|Error;
```

### 3.8. Read Directory
This is used to obtain a list of files and directories in the provided path with the relevant metadata information.
```ballerina
public isolated function readDir(string path) returns MetaData[]|Error;
```

### 3.9. Create Temporary File
This is used to create a temporary file. An optional prefix and suffix may be defined. If the directory in which the
temporary file is to be created is not defined, the default temp directory of the OS will be used.
```ballerina
public isolated function createTemp(string? suffix = (), string? prefix = (), string? dir  = ()) returns string|Error;
```

### 3.10. Create Temporary Directory
This is used to create a temporary directory. An optional prefix and suffix may be defined. If the directory in which
the temporary directory is to be created is not defined, the default temp directory of the OS will be used.
```ballerina
public isolated function createTempDir(string? suffix = (), string? prefix = (), string? dir  = ()) returns string|Error;
```

### 3.11. Test
This is used test whether a file or directory meets a particular condition. Possible test conditions are,
* Whether the file or directory exists
* Whether the provided path is a directory
* Whether the provided path is a symbolic link
* Read permission
* Write permission
```ballerina
public isolated function test(string path, TestOption testOption) returns boolean|Error;
```

## 4 Path Operations
The following are used to create and manipulate paths. Compatibility with both Windows and Unix-based operating 
systems are ensured.

### 4.1. Path Constants
OS-specific path constants
-  `pathSeparator`: The character used to separate the parent directories that make up the path to a specific location. For windows, it’s ‘\’ and for UNIX it’s ‘/’
-  `pathListSeparator`: The character commonly used by the operating system to separate paths in the path list. For windows, it’s ‘;‘ and for UNIX it’s ‘:’

### 4.2. Get Absolute Path
This is used to retrieve the absolute path reference from the provided relative path.
```ballerina
public isolated function getAbsolutePath(string path) returns string|Error;
```

### 4.3. Is Absolute
This is used to determine whether the provided path is absolute or not.
```ballerina
public isolated function isAbsolutePath(string path) returns boolean|Error;
```

### 4.4. Get Basename
This is used to retrieve the base name of the file or directory at the provided path. 
```ballerina
public isolated function basename(string path) returns string|Error;
```

### 4.5. Get Parent Path
This is used to retrieve the parent directory of the provided file or directory.
```ballerina
public isolated function parentPath(string path) returns string|Error;
```

### 4.6. Normalize Path
This is used to normalize the provided path value. Options can be provided to indicate how the normalization should
be performed.
* Get the shortest name equivalent
* Evaluate symbolic links
* Normalize case
```ballerina
public isolated function normalizePath(string path, NormOption option) returns string|Error;
```

### 4.7. Split Path
This is used to split the provided path into an array of path components.
```ballerina
public isolated function splitPath(string path) returns string[]|Error;
```

### 4.8. Join Path
This is used to combine multiple path components to create a single path.
```ballerina
public isolated function joinPath(string... parts) returns string|Error;
```

### 4.9. Get Relative Path
This is used to generate a logically equivalent relative path to the provided target path from the provided base path. 
```ballerina
public isolated function relativePath(string base, string target) returns string|Error;
```

## 5. Directory Listener
The directory listener can be used to monitor a specified directory for changes. This listener will emit an event once
a change is detected within the directory and can be configured to check within subdirectories for changes as well. The
supported events are
* On file create
* On file delete
* On file modification
