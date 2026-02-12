# Specification: Ballerina FTP Library

_Owners_: @shafreenAnfar @dilanSachi @Bhashinee    
_Reviewers_: @shafreenAnfar @Bhashinee  
_Created_: 2020/10/28   
_Updated_: 2026/02/05  
_Edition_: Swan Lake    

## Introduction
This is the specification for the FTP standard library of [Ballerina language](https://ballerina.io/), which provides FTP client/listener functionalities to send and receive files by connecting to FTP/SFTP server.

The FTP library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub](https://github.com/ballerina-platform/ballerina-standard-library/issues) issue or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
- [Specification: Ballerina FTP Library](#specification-ballerina-ftp-library)
  - [Introduction](#introduction)
  - [Contents](#contents)
  - [1. Overview](#1-overview)
  - [2. Configurations](#2-configurations)
    - [2.1. Security Configurations](#21-security-configurations)
    - [2.2. FileInfo](#22-fileinfo)
    - [2.3. Error Types](#23-error-types)
    - [2.4. Retry Configuration](#24-retry-configuration)
  - [3. Client](#3-client)
    - [3.1. Configurations](#31-configurations)
    - [3.2. Initialization](#32-initialization)
      - [3.2.1. Insecure Client](#321-insecure-client)
      - [3.2.2. Secure Client](#322-secure-client)
      - [3.2.3. Client with Retry Configuration](#323-client-with-retry-configuration)
    - [3.3. Functions](#33-functions)
    - [3.4. Circuit Breaker](#34-circuit-breaker)
      - [State Machine](#state-machine)
      - [Configuration](#configuration)
      - [Usage Example](#usage-example)
  - [4. Listener](#4-listener)
    - [4.1. Configurations](#41-configurations)
    - [4.2. Service Configuration Annotation](#42-service-configuration-annotation)
    - [4.3. Initialization](#43-initialization)
      - [4.3.1. Insecure Listener](#431-insecure-listener)
      - [4.3.2. Secure Listener](#432-secure-listener)
    - [4.4. Usage](#44-usage)
      - [4.4.1. Service-Level Monitoring Configuration](#441-service-level-monitoring-configuration)
      - [4.4.2. Format-Specific Listener Callbacks](#442-format-specific-listener-callbacks)
      - [4.4.3. Post-Processing Actions](#443-post-processing-actions)
    - [4.5. Distributed Coordination](#45-distributed-coordination)
      - [4.5.1. Coordination Configuration](#451-coordination-configuration)
      - [4.5.2. Coordination Mechanism](#452-coordination-mechanism)
  - [5. Caller](#5-caller)
    - [5.1. Initialization](#51-initialization)
    - [5.2. Functions](#52-functions)
  - [6. Samples](#6-samples)
    - [6.1. Sending Files](#61-sending-files)
    - [6.2. Listening to file changes](#62-listening-to-file-changes)

## 1. Overview
FTP is a file transfer protocol. It’s a basic way of using the Internet to share files.
SFTP (or Secure File Transfer Protocol) is an alternative to FTP that also allows transferring files,
but adds a layer of security to the process. SFTP uses SSH (or secure shell) encryption to protect data as
it’s being transferred. This means data is not exposed to outside entities on the Internet when it is sent
to another party. This library provides support for both protocols.

Ballerina FTP library contains two core apis:
* Client - The `ftp:Client` is used to connect to FTP server and perform various operations on the files.
* Listener - The `ftp:Listener` is used to listen to a remote FTP location and notify if files are added or removed 
  from the FTP location.

## 2. Configurations
### 2.1. Security Configurations
* PrivateKey record represents the configuration related to a private key.
```ballerina
public type PrivateKey record {|
    # Path to the private key file
    string path;
    # Private key password
    string password?;
|};
```
* Credentials record represents the username and password configurations.
```ballerina
public type Credentials record {|
    # Username of the user
    string username;
    # Password of the user
    string password?;
|};
```
* AuthConfiguration record represents the configurations needed for facilitating secure communication with a remote FTP server.
```ballerina
public type AuthConfiguration record {|
    # Username and password to be used
    Credentials credentials?;
    # Private key to be used
    PrivateKey privateKey?;
    # Preferred authentication methods and their order of preference
    PreferredMethod[] preferredMethods?;
|};
```
* PreferredMethod enum specifies the supported authentication methods.
```ballerina
public enum PreferredMethod {
    # Security key file authentication
    PUBLICKEY,
    # Username and password authentication
    PASSWORD,
    # Interactive authentication (question and answer)
    KEYBOARD_INTERACTIVE,
    # Enterprise authentication system
    GSSAPI_WITH_MIC
}
```
### 2.2. FileInfo
* `FileInfo` record contains the metadata of the files.
```ballerina
public type FileInfo record {|
    # Relative file path for a newly-added file
    string path;
    # Size of the file
    int size;
    # Last-modified timestamp of the file in UNIX Epoch time
    int lastModifiedTimestamp;
    # File name
    string name;
    # `true` if the file is a folder
    boolean isFolder;
    # `true` if the file is a file
    boolean isFile;
    # Normalized absolute path of this file within its file system
    string pathDecoded;
    # Extension of the file name
    string extension;
    # Receiver as a URI String for public display
    string publicURIString;
    # Type of the file
    string fileType;
    # `true` if the `fileObject` is attached
    boolean isAttached;
    # `true` if someone reads/writes from/to this file
    boolean isContentOpen;
    # `true` if this file is executable
    boolean isExecutable;
    # `true` if this file is hidden
    boolean isHidden;
    # `true` if this file can be read
    boolean isReadable;
    # `true` if this file can be written
    boolean isWritable;
    # Depth of the file name within its file system
    int depth;
    # URI scheme of the file
    string scheme;
    # Absolute URI of the file
    string uri;
    # Root URI of the file system in which the file exists
    string rootURI;
    # A "friendly path" is a path, which can be accessed without a password
    string friendlyURI;
|};
```
### 2.3. Error Types
The FTP module provides a hierarchy of error types for better error handling and more precise error identification.

* `Error` - The base error type for all FTP-related errors.
```ballerina
public type Error distinct error;
```

* `ConnectionError` - Represents errors that occur when connecting to the FTP/SFTP server. This includes network failures, host unreachable, connection refused, etc.
```ballerina
public type ConnectionError distinct Error;
```

* `FileNotFoundError` - Represents errors that occur when a requested file or directory is not found on the remote server.
```ballerina
public type FileNotFoundError distinct Error;
```

* `FileAlreadyExistsError` - Represents errors that occur when attempting to create a file or directory that already exists.
```ballerina
public type FileAlreadyExistsError distinct Error;
```

* `InvalidConfigError` - Represents errors that occur when FTP/SFTP configuration is invalid (e.g., invalid port numbers, invalid regex patterns, invalid timeout values).
```ballerina
public type InvalidConfigError distinct Error;
```

* `ServiceUnavailableError` - Represents errors that occur when the FTP/SFTP service is temporarily unavailable. This is a transient error indicating the operation may succeed on retry. Common causes include server overload (FTP code 421), connection issues (425, 426), temporary file locks (450), or server-side processing errors (451).
```ballerina
public type ServiceUnavailableError distinct Error;
```

* `ContentBindingError` - Represents errors that occur when file content cannot be converted to the expected type. This includes JSON/XML parsing errors, CSV format errors, and record type binding failures. This error type is applicable to both Client operations and Listener callbacks. When used with the Listener, if an `onError` remote function is defined in the service, it will be invoked with this error type.
```ballerina
public type ContentBindingError distinct Error<ContentBindingErrorDetail>;
```

The `ContentBindingError` includes a detail record providing additional context:
```ballerina
public type ContentBindingErrorDetail record {|
    string filePath?;   // The file path that caused the error
    byte[] content?;    // The raw file content as bytes that failed to bind
|};
```

* `AllRetryAttemptsFailedError` - Represents an error that occurs when all retry attempts have been exhausted. This error wraps the last failure encountered during retry attempts.
```ballerina
public type AllRetryAttemptsFailedError distinct Error;
```

* `CircuitBreakerOpenError` - Error returned when the circuit breaker is in OPEN state. This indicates the FTP server is unavailable and requests are being blocked to prevent cascade failures. This is a distinct subtype of `ServiceUnavailableError`.
```ballerina
public type CircuitBreakerOpenError distinct ServiceUnavailableError;
```

All specific error types are subtypes of the base `Error` type, allowing for both specific and general error handling:
```ballerina
// Handle specific error types
ftp:Client|ftp:Error result = new(config);
if result is ftp:ConnectionError {
    // Handle connection failures specifically
} else if result is ftp:CircuitBreakerOpenError {
    // Circuit breaker is open - implement fallback logic
} else if result is ftp:AllRetryAttemptsFailedError {
    // All retries exhausted - consider alerting
} else if result is ftp:ServiceUnavailableError {
    // Transient error - retry the operation
} else if result is ftp:Error {
    // Handle any other FTP error
}
```
### 2.4. Retry Configuration
* `RetryConfig` record represents the configuration for automatic retries of operations.
```ballerina
# Retry configuration for FTP operations
#
# + count - Maximum number of retry attempts 
# + interval - Initial retry interval in seconds 
# + backOffFactor - Multiplier for exponential backoff 
# + maxWaitInterval - Maximum wait interval between retries in seconds
public type RetryConfig record {|
    int count = 3;
    decimal interval = 1.0;
    decimal backOffFactor = 2.0;
    decimal maxWaitInterval = 30.0;
|};
```
The retry mechanism uses exponential backoff to progressively increase wait times between retry attempts.

## 3. Client
The `ftp:Client` connects to FTP server and performs various operations on the files. It supports reading files in multiple formats (bytes, text, JSON, XML, CSV) with streaming support for large files, writing files in multiple formats, and file management operations including create, delete, rename, move, copy, and list.
### 3.1. Configurations
* When initializing the `ftp:Client`, `ftp:ClientConfiguration` configuration can be provided.
```ballerina
public type ClientConfiguration record {|
    # Supported FTP protocols
    Protocol protocol = FTP;
    # Target service URL
    string host = "127.0.0.1";
    # Port number of the remote service
    int port = 21;
    # Authentication options
    AuthConfiguration auth?;
    # If set to `true`, treats the login home directory as the root (`/`) and
    # prevents the underlying VFS from attempting to change to the actual server root.
    # If `false`, treats the actual server root as `/`, which may cause a `CWD /` command
    # that can fail on servers restricting root access (e.g., chrooted environments).
    boolean userDirIsRoot = false;
    # If set to `true`, allows missing or null values when reading files in structured formats
    boolean laxDataBinding = false;
    # Retry configuration for read operations
    RetryConfig retryConfig?;
    # Circuit breaker configuration to prevent cascade failures
    CircuitBreakerConfig circuitBreaker?;
|};
```
* InputContent record represents the configurations for the input given for `put` and `append` operations.
```ballerina
public type InputContent record{|
    # Path of the file to be created or appended
    string filePath;
    # `true` if the input type is a file
    boolean isFile = false;
    # The content read from the input file, if the input is a file
    stream<byte[] & readonly, io:Error?> fileContent?;
    # The input content, for other input types
    string textContent?;
    # If true, input will be compressed before uploading
    boolean compressInput = false;
|};
```
* Following Compression options can be used when adding a file to the FTP server.
```ballerina
public enum Compression {
    # Zip compression
    ZIP,
    # No compression used
    NONE
}
```
* FileWriteOption enum specifies how a file should be written to the server.
```ballerina
public enum FileWriteOption {
    # Replace the entire file with new content
    OVERWRITE,
    # Add new content to the end of the file
    APPEND
}
```
### 3.2. Initialization
#### 3.2.1. Insecure Client
A simple insecure client can be initialized by providing `ftp:FTP` as the protocol and the host and optionally, the port 
to the `ftp:ClientConfiguration`.
```ballerina
# Gets invoked during object initialization.
#
# + clientConfig - Configurations for FTP client
# + return - `ftp:Error` in case of errors or `()` otherwise
public isolated function init(ClientConfiguration clientConfig) returns Error?;
```
#### 3.2.2. Secure Client
A secure client can be initialized by providing `ftp:SFTP` as the protocol and by providing `ftp:Credentials`
and `ftp:PrivateKey` to `ftp:AuthConfiguration`.
```ballerina
ftp:ClientConfiguration ftpConfig = {
    protocol: ftp:SFTP,
    host: "<The FTP host>",
    port: <The FTP port>,
    auth: {
        credentials: {
            username: "<The FTP username>",
            password: "<The FTP passowrd>"
        }
    },
    userDirIsRoot: true
};
```
#### 3.2.3. Client with Retry Configuration
A client can be initialized with retry configuration to automatically retry failed read operations:
```ballerina
ftp:ClientConfiguration ftpConfig = {
    protocol: ftp:FTP,
    host: "<The FTP host>",
    port: <The FTP port>,
    retryConfig: {
        count: 5,              // Retry up to 5 times
        interval: 2.0,         // Start with 2 second wait
        backOffFactor: 1.5,    // Increase wait by 1.5x each time
        maxWaitInterval: 20.0  // Cap wait time at 20 seconds
    }
};

ftp:Client ftpClient = check new(ftpConfig);

// Non-streaming read operations (getBytes, getText, getJson, getXml, getCsv) will automatically retry on failure
byte[] bytes = check ftpClient->getBytes("/path/to/file.txt");
```
### 3.3. Functions
* FTP Client API can be used to put files on the FTP server. For this, the `put()` method can be used.
```ballerina
# Adds a file to FTP server.
# ```ballerina
# ftp:Error? response = client->put(path, channel);
# ```
#
# + path - The resource path
# + content - Content to be written to the file in server
# + compressionType - Type of the compression to be used, if
#                     the file should be compressed before
#                     uploading
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function put(string path, stream<byte[] & readonly, io:Error?>|string|xml|json content, Compression compressionType=NONE) returns Error?;
```
* `append()` can be used to append the content to an existing file in FTP server.
```ballerina
# Appends the content to an existing file in FTP server.
# ```ballerina
# ftp:Error? response = client->append(path, content);
# ```
#
# + path - The resource path
# + content - Content to be written to the file in server
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function append(string path, stream<byte[] & readonly, io:Error?>|string|xml|json content) returns Error?;
```
* `putBytes()` can be used to write bytes to a file.
```ballerina
# Write bytes to a file.
# ```ballerina
# ftp:Error? response = client->putBytes(path, content, option);
# ```
#
# + path - File location on the server
# + content - Binary data to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putBytes(string path, byte[] content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putText()` can be used to write text to a file.
```ballerina
# Write text to a file.
# ```ballerina
# ftp:Error? response = client->putText(path, content, option);
# ```
#
# + path - File location on the server
# + content - Text to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putText(string path, string content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putJson()` can be used to write JSON data to a file.
```ballerina
# Write JSON data to a file.
# ```ballerina
# ftp:Error? response = client->putJson(path, content, option);
# ```
#
# + path - File location on the server
# + content - JSON data to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putJson(string path, json|record {} content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putXml()` can be used to write XML data to a file.
```ballerina
# Write XML data to a file.
# ```ballerina
# ftp:Error? response = client->putXml(path, content, option);
# ```
#
# + path - File location on the server
# + content - XML data to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putXml(string path, xml|record {} content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putCsv()` can be used to write CSV data to a file.
```ballerina
# Write CSV data to a file.
# ```ballerina
# ftp:Error? response = client->putCsv(path, content, option);
# ```
#
# + path - File location on the server
# + content - CSV data (table or records) to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putCsv(string path, string[][]|record {}[] content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putBytesAsStream()` can be used to write bytes from a stream to a file.
```ballerina
# Write bytes from a stream to a file.
# Useful for processing and uploading large files without loading everything into memory.
# ```ballerina
# ftp:Error? response = client->putBytesAsStream(path, content, option);
# ```
#
# + path - File location on the server
# + content - Stream of byte chunks to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putBytesAsStream(string path, stream<byte[], error?> content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putCsvAsStream()` can be used to write CSV data from a stream to a file.
```ballerina
# Write CSV data from a stream to a file.
# Useful for processing and uploading large CSV files without loading everything into memory.
# ```ballerina
# ftp:Error? response = client->putCsvAsStream(path, content, option);
# ```
#
# + path - File location on the server
# + content - Stream of CSV rows to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putCsvAsStream(string path, stream<string[]|record {}, error?> content, FileWriteOption option = OVERWRITE) returns Error?;
```
* To retrieve file content from FTP server, `get()` can be used.
```ballerina
# Retrieves the file content from a remote resource.
# ```ballerina
# stream<byte[] & readonly, io:Error?>|ftp:Error channel = client->get(path);
# ```
#
# + path - The resource path
# + return - A byte stream from which the file can be read or `ftp:Error` in case of errors
remote isolated function get(string path) returns stream<byte[] & readonly, io:Error?>|Error;
```
* `getBytes()` can be used to read file content as bytes.
```ballerina
# Read file content as bytes (raw binary data).
# ```ballerina
# byte[] content = check client->getBytes(path);
# ```
#
# + path - File or folder location on the server
# + return - File content as bytes, or an error if the operation fails
remote isolated function getBytes(string path) returns byte[]|Error;
```
* `getText()` can be used to read file content as text.
```ballerina
# Read file content as text.
# ```ballerina
# string content = check client->getText(path);
# ```
#
# + path - File or folder location on the server
# + return - File content as text, or an error if the operation fails
remote isolated function getText(string path) returns string|Error;
```
* `getJson()` can be used to read a file as JSON data. Returns `ContentBindingError` if the file content cannot be parsed as JSON or bound to the target type.
```ballerina
# Read a file as JSON data.
# ```ballerina
# json content = check client->getJson(path);
# ```
#
# + path - Location of the file on the server
# + targetType - What format should the data have? (JSON, structured data, or a custom format)
# + return - The file content as JSON, or `ContentBindingError` if parsing/binding fails, or other `Error` for connection issues
remote isolated function getJson(string path, typedesc<json|record {}> targetType = <>) returns targetType|Error;
```
* `getXml()` can be used to read a file as XML data. Returns `ContentBindingError` if the file content cannot be parsed as XML or bound to the target type.
```ballerina
# Read a file as XML data.
# ```ballerina
# xml content = check client->getXml(path);
# ```
#
# + path - Location of the file on the server
# + targetType - What format should the data have? (XML, structured data, or a custom format)
# + return - The file content as XML, or `ContentBindingError` if parsing/binding fails, or other `Error` for connection issues
remote isolated function getXml(string path, typedesc<xml|record {}> targetType = <>) returns targetType|Error;
```
* `getCsv()` can be used to read a CSV file from the server. Returns `ContentBindingError` if the file content cannot be parsed or bound to the target type.
```ballerina
# Read a CSV (comma-separated) file from the server.
# The first row of the CSV file should contain column names (headers).
# ```ballerina
# string[][] content = check client->getCsv(path);
# ```
#
# + path - Location of the CSV file on the server
# + targetType - What format should the data have? (Table or structured records)
# + return - The CSV file content as a table or records, or `ContentBindingError` if parsing/binding fails, or other `Error` for connection issues
remote isolated function getCsv(string path, typedesc<string[][]|record {}[]> targetType = <>) returns targetType|Error;
```
* `getBytesAsStream()` can be used to read file content as a stream of byte chunks.
```ballerina
# Read file content as a stream of byte chunks.
# Useful for processing large files without loading the entire file into memory.
# ```ballerina
# stream<byte[], error?> response = check client->getBytesAsStream(path);
# ```
#
# + path - File or folder location on the server
# + return - A continuous stream of byte chunks, or an error if the operation fails
remote isolated function getBytesAsStream(string path) returns stream<byte[], error?>|Error;
```
* `getCsvAsStream()` can be used to read a CSV file as a continuous stream of rows.
```ballerina
# Read a CSV file as a continuous stream of rows.
# Useful for processing very large files one row at a time.
# The first row of the CSV file should contain column names (headers).
# ```ballerina
# stream<string[], error?> response = check client->getCsvAsStream(path);
# ```
#
# + path - Location of the CSV file on the server
# + targetType - What format should each row have? (Row values or structured record)
# + return - A stream of rows from the CSV file, or an error if the operation fails
remote isolated function getCsvAsStream(string path, typedesc<string[]|record {}> targetType = <>) returns stream<targetType, error?>|Error;
```
* `mkdir()` can be used to create a new directory in FTP server.
```ballerina
# Creates a new directory in FTP server.
# ```ballerina
# ftp:Error? response = client->mkdir(path);
# ```
#
# + path - The directory path
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function mkdir(string path) returns Error?;
```
* `rmdir()` can be used to remove an empty directory in the server.
```ballerina
# Deletes an empty directory in FTP server.
# ```ballerina
# ftp:Error? response = client->rmdir(path);
# ```
#
# + path - The directory path
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function rmdir(string path) returns Error?;
```
* To delete a file, `delete()` can be used.
```ballerina
# Deletes a file from FTP server.
# ```ballerina
# ftp:Error? response = client->delete(path);
# ```
#
# + path - The resource path
# + return -  `()` or else an `ftp:Error` if failed to establish
#             the communication with the FTP server
remote isolated function delete(string path) returns Error?;
```
* To rename a file or move it to another directory, `rename()` can be used.
```ballerina
# Renames a file or moves it to a new location within the same FTP server.
# ```ballerina
# ftp:Error? response = client->rename(origin, destination);
# ```
#
# + origin - The source file location
# + destination - The destination file location
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function rename(string origin, string destination) returns Error?;
```
* `move()` can be used to move a file to a different location on the file server.
```ballerina
# Move a file to a different location on the file server.
# ```ballerina
# ftp:Error? response = client->move(sourcePath, destinationPath);
# ```
#
# + sourcePath - The current file location
# + destinationPath - The new file location
# + return - An error if the operation fails
remote isolated function move(string sourcePath, string destinationPath) returns Error?;
```
* `copy()` can be used to copy a file to a different location on the file server.
```ballerina
# Copy a file to a different location on the file server.
# ```ballerina
# ftp:Error? response = client->copy(sourcePath, destinationPath);
# ```
#
# + sourcePath - The file to copy
# + destinationPath - Where to create the copy
# + return - An error if the operation fails
remote isolated function copy(string sourcePath, string destinationPath) returns Error?;
```
* `exists()` can be used to check if a file or folder exists on the file server.
```ballerina
# Check if a file or folder exists on the file server.
# ```ballerina
# boolean|ftp:Error response = client->exists(path);
# ```
#
# + path - File or folder location to check
# + return - True if it exists, false if it doesn't, or an error if the check fails
remote isolated function exists(string path) returns boolean|Error;
```
* `size()` function can be used to get the size of a file.
```ballerina
# Gets the size of a file resource.
# ```ballerina
# int|ftp:Error response = client->size(path);
# ```
#
# + path - The resource path
# + return - The file size in bytes or an `ftp:Error` if
#            failed to establish the communication with the FTP server
remote isolated function size(string path) returns int|Error;
```
* To get the file list in a directory, `list()` can be used.
```ballerina
# Gets the file name list in a given folder.
# ```ballerina
# ftp:FileInfo[]|ftp:Error response = client->list(path);
# ```
#
# + path - The direcotry path
# + return - An array of file names or an `ftp:Error` if failed to
#            establish the communication with the FTP server
remote isolated function list(string path) returns FileInfo[]|Error;
```
* To check if a resource is a directory, `isDirectory()` can be used.
```ballerina
# Checks if a given resource is a directory.
# ```ballerina
# boolean|ftp:Error response = client->isDirectory(path);
# ```
#
# + path - The resource path
# + return - `true` if given resource is a directory or an `ftp:Error` if
#            an error occurred while checking the path
remote isolated function isDirectory(string path) returns boolean|Error;
```

### 3.4. Circuit Breaker
The circuit breaker pattern prevents cascade failures by temporarily blocking requests to an FTP server experiencing issues. When failures reach a threshold, the circuit "opens" and subsequent requests fail fast with `CircuitBreakerOpenError` without attempting the actual operation.

#### State Machine
The circuit breaker operates in three states:
- **CLOSED**: Normal operation. Requests are allowed and failures are tracked.
- **OPEN**: Circuit is tripped. All requests are rejected immediately with `CircuitBreakerOpenError`.
- **HALF_OPEN**: After the reset time elapses, one trial request is allowed. Success returns to CLOSED; failure returns to OPEN.

#### Configuration
* CircuitBreakerConfig record contains the circuit breaker settings.
```ballerina
public type CircuitBreakerConfig record {|
    # Rolling window configuration for failure tracking
    RollingWindow rollingWindow = {};
    # Failure ratio threshold (0.0 to 1.0) that trips the circuit
    float failureThreshold = 0.5;
    # Time in seconds to wait before transitioning from OPEN to HALF_OPEN
    decimal resetTime = 30;
    # Categories of failures that count towards tripping the circuit
    FailureCategory[] failureCategories = [CONNECTION_ERROR, TRANSIENT_ERROR];
|};
```
* RollingWindow record configures the sliding window for tracking failures.
```ballerina
public type RollingWindow record {|
    # Minimum number of requests in the window before the circuit can trip
    int requestVolumeThreshold = 10;
    # Time window in seconds for tracking failures
    decimal timeWindow = 60;
    # Size of each time bucket in seconds (timeWindow / bucketSize = number of buckets)
    decimal bucketSize = 10;
|};
```
* FailureCategory enum specifies which types of failures count towards tripping the circuit.
```ballerina
public enum FailureCategory {
    # Connection failures (network issues, timeouts)
    CONNECTION_ERROR,
    # Authentication failures (invalid credentials)
    AUTHENTICATION_ERROR,
    # Server disconnection during operation
    TRANSIENT_ERROR,
    # All errors count as failures
    ALL_ERRORS
}
```
#### Usage Example
```ballerina
ftp:ClientConfiguration ftpConfig = {
    protocol: ftp:FTP,
    host: "ftp.example.com",
    port: 21,
    auth: {
        credentials: {username: "user", password: "pass"}
    },
    circuitBreaker: {
        failureThreshold: 0.5,
        resetTime: 30,
        rollingWindow: {
            requestVolumeThreshold: 5,
            timeWindow: 60,
            bucketSize: 10
        },
        failureCategories: [ftp:CONNECTION_ERROR, ftp:TRANSIENT_ERROR]
    }
};

ftp:Client ftpClient = check new(ftpConfig);

// Operations will fail fast with CircuitBreakerOpenError when circuit is open
byte[]|ftp:Error content = ftpClient->getBytes("/file.txt");
if content is ftp:CircuitBreakerOpenError {
    // Handle circuit breaker open state - server is unavailable
}
```

## 4. Listener
The `ftp:Listener` is used to listen to a remote FTP location and trigger a `WatchEvent` type of event when new
files are added to or deleted from the directory. The `onFileChange` function is invoked when a new file is added
and/or deleted.
### 4.1. Configurations
* When initializing the `ftp:Listener`, following configurations can be provided.

> **Note:** The monitoring-related fields (`path`, `fileNamePattern`, `fileAgeFilter`, `fileDependencyConditions`) are deprecated at the listener level. Use the `@ftp:ServiceConfig` annotation on services instead. See [Section 4.2](#42-service-configuration-annotation) for details.

```ballerina
public type ListenerConfiguration record {|
    # Supported FTP protocols
    Protocol protocol = FTP;
    # Target service url
    string host = "127.0.0.1";
    # Port number of the remote service
    int port = 21;
    # Authentication options
    AuthConfiguration auth?;
    # @deprecated Use @ftp:ServiceConfig annotation on service instead.
    # Remote FTP directory location
    string path = "/";
    # @deprecated Use @ftp:ServiceConfig annotation on service instead.
    # File name pattern that event need to trigger
    string fileNamePattern?;
    # Periodic time interval to check new update
    decimal pollingInterval = 60;
    # If set to `true`, treats the login home directory as the root (`/`) and
    # prevents the underlying VFS from attempting to change to the actual server root.
    # If `false`, treats the actual server root as `/`, which may cause a `CWD /` command
    # that can fail on servers restricting root access (e.g., chrooted environments).
    boolean userDirIsRoot = false;
    # @deprecated Use @ftp:ServiceConfig annotation on service instead.
    # Configuration for filtering files based on age
    FileAgeFilter fileAgeFilter?;
    # @deprecated Use @ftp:ServiceConfig annotation on service instead.
    # Array of dependency conditions for conditional file processing
    FileDependencyCondition[] fileDependencyConditions = [];
    # If set to `true`, allows missing or null values when reading files in structured formats
    boolean laxDataBinding = false;
    # Configuration for distributed task coordination using warm backup approach.
    # When configured, only one member in the group will actively poll while others act as standby.
    CoordinationConfig coordination?;
|};
```

**Deprecated Fields Migration:**

| Deprecated Field | Migration |
|-----------------|-----------|
| `path` | Move to `@ftp:ServiceConfig { path: "..." }` on service |
| `fileNamePattern` | Move to `@ftp:ServiceConfig { fileNamePattern: "..." }` on service |
| `fileAgeFilter` | Move to `@ftp:ServiceConfig { fileAgeFilter: {...} }` on service |
| `fileDependencyConditions` | Move to `@ftp:ServiceConfig { fileDependencyConditions: [...] }` on service |

* `WatchEvent` record represents the latest status change of the server from the last status change.
```ballerina
public type WatchEvent record {|
    # Array of `ftp:FileInfo` that represents newly added files
    FileInfo[] addedFiles;
    # Array of strings that contains deleted file names
    string[] deletedFiles;
|};
```
### 4.2. Service Configuration Annotation

The `@ftp:ServiceConfig` annotation allows configuring monitoring paths and file patterns at the service level rather than the listener level. This enables multiple services attached to a single listener to monitor different directories independently.

```ballerina
# Configuration for FTP service monitoring.
# Use this to specify the directory path and file patterns this service should monitor.
#
# + path - Directory path on the FTP server to monitor for file changes
# + fileNamePattern - File name pattern (regex) to filter which files trigger events
# + fileAgeFilter - Configuration for filtering files based on age (optional)
# + fileDependencyConditions - Array of dependency conditions for conditional file processing
public type ServiceConfiguration record {|
    string path;
    string fileNamePattern?;
    FileAgeFilter fileAgeFilter?;
    FileDependencyCondition[] fileDependencyConditions = [];
|};

# Annotation to configure FTP service monitoring path and file patterns.
public annotation ServiceConfiguration ServiceConfig on service;
```

**Usage Rules:**

1. **Consistency Requirement**: If any service attached to a listener uses `@ftp:ServiceConfig`, then ALL services attached to that listener must use it.

2. **Mutual Exclusion**: When `@ftp:ServiceConfig` is used:
   - The deprecated listener-level fields (`path`, `fileNamePattern`, `fileAgeFilter`, `fileDependencyConditions`) are completely ignored
   - A deprecation warning is logged if these fields were set in listener configuration

3. **Required Field**: The `path` field is mandatory in `@ftp:ServiceConfig`

**Validation Error Messages:**

| Scenario | Error Type | Message |
|----------|-----------|---------|
| Mixed usage (some services with annotation, some without) | InvalidConfigError | "All services attached to a listener must use @ftp:ServiceConfig annotation when any service uses it. Service '{serviceName}' is missing the annotation." |
| Invalid path pattern | InvalidConfigError | "Invalid path '{path}' in @ftp:ServiceConfig. Path must be an absolute path starting with '/'." |
| Invalid fileNamePattern regex | InvalidConfigError | "Invalid regex pattern '{pattern}' in @ftp:ServiceConfig.fileNamePattern: {error}" |

**Example: Multiple Services Monitoring Different Directories**

```ballerina
listener ftp:Listener ftpListener = check new({
    protocol: ftp:SFTP,
    host: "ftp.example.com",
    port: 22,
    auth: {
        credentials: {username: "user", password: "pass"}
    },
    pollingInterval: 30
});

@ftp:ServiceConfig {
    path: "/incoming/csv",
    fileNamePattern: ".*\\.csv"
}
service on ftpListener {
    remote function onFileCsv(record {}[] content, ftp:FileInfo fileInfo) returns error? {
        // Processes CSV files from /incoming/csv
    }
}

@ftp:ServiceConfig {
    path: "/incoming/json",
    fileNamePattern: ".*\\.json"
}
service on ftpListener {
    remote function onFileJson(json content, ftp:FileInfo fileInfo) returns error? {
        // Processes JSON files from /incoming/json
    }
}
```

### 4.3. Initialization
#### 4.3.1. Insecure Listener
An insecure FTP listener can be initialized by providing the mandatory `protocol`, `host`, and  `path` parameters to the 
`ftp:ListenerConfiguration`.
```ballerina
# Gets invoked during object initialization.
#
# + listenerConfig - Configurations for FTP listener
# + return - `()` or else an `ftp:Error` upon failure to initialize the listener
public isolated function init(*ListenerConfiguration listenerConfig) returns Error?;
```
#### 4.3.2. Secure Listener
A secure listener can be initialized by providing `ftp:SFTP` as the protocol and by providing `ftp:Credentials`
and `ftp:PrivateKey` to `ftp:AuthConfiguration`.

**Using deprecated listener-level configuration (for backward compatibility):**
```ballerina
ftp:ListenerConfiguration ftpConfig = {
    protocol: ftp:SFTP,
    host: "<The SFTP host>",
    port: <The SFTP port>,
    path: "<The remote SFTP directory location>",        // Deprecated - use @ftp:ServiceConfig instead
    pollingInterval: <Polling interval>,
    fileNamePattern: "<File name pattern>",              // Deprecated - use @ftp:ServiceConfig instead
    auth: {
        credentials: {username: "<The SFTP username>", password: "<The SFTP password>"},
        privateKey: {
            path: "<The private key file path>",
            password: "<The private key file password>"
        }
    },
    userDirIsRoot: true
};
```

**Recommended approach using @ftp:ServiceConfig:**
```ballerina
ftp:ListenerConfiguration ftpConfig = {
    protocol: ftp:SFTP,
    host: "<The SFTP host>",
    port: <The SFTP port>,
    pollingInterval: <Polling interval>,
    auth: {
        credentials: {username: "<The SFTP username>", password: "<The SFTP password>"},
        privateKey: {
            path: "<The private key file path>",
            password: "<The private key file password>"
        }
    },
    userDirIsRoot: true
};

listener ftp:Listener ftpListener = check new(ftpConfig);

@ftp:ServiceConfig {
    path: "<The remote SFTP directory location>",
    fileNamePattern: "<File name pattern>"
}
service on ftpListener {
    // Service implementation
}
```

### 4.4. Usage
After initializing the listener, a service must be attached to the listener. There are two ways for this.
1. Attach the service to the listener directly.
```ballerina
service ftp:Service on ftpListener {
    remote function onFileChange(ftp:WatchEvent & readonly event, ftp:Caller caller) {
        // process event
    }
}
```
2. Attach the service dynamically.
```ballerina
// Create a service object
ftp:Service ftpListener = service object {
    remote function onFileChange(ftp:WatchEvent & readonly event, ftp:Caller caller) {
        // process event
    }
};
```
The remote method `onFileChange()` is invoked when the listener notices a file change in the FTP server. This function supports
having both `ftp:WatchEvent` and `ftp:Caller` parameters or having only `ftp:WatchEvent` parameter.

#### 4.4.1. Service-Level Monitoring Configuration

When using the `@ftp:ServiceConfig` annotation, each service can specify its own monitoring path and file patterns:

```ballerina
listener ftp:Listener ftpListener = check new({
    host: "ftp.example.com",
    pollingInterval: 30
});

// Service monitoring /incoming/orders for CSV files
@ftp:ServiceConfig {
    path: "/incoming/orders",
    fileNamePattern: "order_.*\\.csv",
    fileDependencyConditions: [
        {
            targetPattern: "order_(\\d+)\\.csv",
            requiredFiles: ["order_$1.marker"],
            matchingMode: ALL
        }
    ]
}
service on ftpListener {
    remote function onFileCsv(record {}[] content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
        // Process order CSV files only when marker file exists
        check caller->move(fileInfo.path, "/processed/orders/" + fileInfo.name);
    }
}

// Service monitoring /incoming/configs for JSON files
@ftp:ServiceConfig {
    path: "/incoming/configs",
    fileNamePattern: ".*\\.json"
}
service on ftpListener {
    remote function onFileJson(json content, ftp:FileInfo fileInfo) returns error? {
        // Process configuration JSON files
    }
}
```

Each service operates independently, receiving events only for files in its configured path that match its pattern.

#### 4.4.2. Format-Specific Listener Callbacks

In addition to the generic `onFileChange()` callback, the listener supports specialized format-specific callbacks that automatically parse files into structured data formats. These callbacks simplify handling files of specific types.

**File extension routing:** Files are automatically routed to handlers based on their extensions. `.txt` → `onFileText()`, `.json` → `onFileJson()`, `.xml` → `onFileXml()`, `.csv` → `onFileCsv()`. Other extensions use `onFile()`. Routing can be customized using the `@ftp:FunctionConfig` annotation.

* `onFileJson()` - Triggered when a JSON file (`.json`) is added. Supports two overloads for different content types:
```ballerina
# JSON content overload
remote function onFileJson(json content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process parsed JSON content directly
    // fileInfo contains metadata about the file
    // caller allows you to perform FTP operations
}

# Data-bound record overload
remote function onFileJson(record {} content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process JSON automatically data-bound to your record type
}
```

* `onFileXml()` - Triggered when an XML file (`.xml`) is added. Supports two overloads:
```ballerina
# XML content overload
remote function onFileXml(xml content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process parsed XML content directly
}

# Data-bound record overload
remote function onFileXml(record {} content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process XML automatically data-bound to your record type
}
```

* `onFileCsv()` - Triggered when a CSV file (`.csv`) is added with RFC4180 defaults. Supports four overloads for different processing modes:
```ballerina
# String array overload (in-memory, all rows)
remote function onFileCsv(string[][] content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // content contains all rows as arrays of strings
    // First row contains column headers
}

# Record array overload (in-memory, type-safe)
remote function onFileCsv(record {} [] content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // content automatically data-bound to record array
    // Headers automatically mapped to record fields
}

# Stream of string arrays (streaming, large files)
remote function onFileCsv(stream<string[], error> content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process rows one at a time from stream
    // Memory-efficient for large files
}

# Stream of records (streaming, type-safe)
remote function onFileCsv(stream<record {}, error> content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process rows as records from stream
    // Data-bound and memory-efficient
}
```

* `onFileText()` - Triggered when a text file (`.txt`) is added:
```ballerina
remote function onFileText(string content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process entire file content as UTF-8 text
}
```

* `onFile()` - Triggered when any other file type is added (generic binary handling). Supports two overloads:
```ballerina
# In-memory byte array overload
remote function onFile(byte[] content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // content contains entire file as bytes
}

# Streaming overload for large files
remote function onFile(stream<byte[], error> content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
    // Process file chunks from stream
    // Memory-efficient for large files
}
```

* `onFileDelete()` - Triggered when files are deleted from the monitored directory:
```ballerina
remote function onFileDelete(string deletedFile, ftp:Caller caller) returns error? {
    // Handle file deletion
    // deletedFile contains the deleted file path
}
```

* `onError()` - Triggered when a content binding error occurs during file processing. This allows centralized error handling for data binding failures:
```ballerina
remote function onError(ftp:Error err, ftp:Caller caller) returns error? {
    // Check if it's a content binding error to access details
    if err is ftp:ContentBindingError {
        string? filePath = err.detail().filePath;
        byte[]? content = err.detail().content;

        log:printError("Failed to process file: " + (filePath ?: "unknown"), err);
        if filePath is string {
            check caller->move(filePath, "/error/failed_file");
        }
    }
}
```

The `onError` handler receives:
- `err`: The base `ftp:Error` type. For content binding failures, this will be a `ContentBindingError`. Users should type-check with `if err is ftp:ContentBindingError` to access the detail record containing `filePath` and `content`.
- `caller` (optional): FTP caller for performing recovery operations

**Supported parameter signatures:**
- `onError(error err)` - Using Ballerina's error type descriptor
- `onError(ftp:Error err)` - Using the FTP module's Error type
- `onError(ftp:Error err, ftp:Caller caller)` - With caller for recovery operations

If `onError` is not defined, binding errors are logged and the file is skipped.

**Optional parameters:** The `caller` parameter can be omitted if not needed in your implementation.

All format-specific callbacks receive `fileInfo` (metadata about the file) and optionally `caller`
(to perform additional FTP operations). The data is automatically parsed based on the callback type.

#### 4.4.3. Post-Processing Actions

The `@ftp:FunctionConfig` annotation supports automatic file actions after processing completes. This enables common patterns like moving processed files to an archive directory or deleting files after successful processing.

**Configuration Types:**

* `DELETE` - Delete the file after processing
```ballerina
public const DELETE = "DELETE";
```

* `Move` - Move the file to a specified directory
```ballerina
# Type alias for Move record, used in union types for post-processing actions.
public type MOVE Move;

# Configuration for moving a file after processing.
#
# + moveTo - Destination directory path where the file will be moved
# + preserveSubDirs - If true, preserves the subdirectory structure relative to the
#                     listener's root path. Defaults to true.
public type Move record {|
    string moveTo;
    boolean preserveSubDirs = true;
|};
```

**Updated FtpFunctionConfig:**
```ballerina
public type FtpFunctionConfig record {|
    string fileNamePattern?;
    MOVE|DELETE afterProcess?;
    MOVE|DELETE afterError?;
|};
```

**Action Fields:**
- `afterProcess` - Action to perform after successful processing. If not specified, no action is taken.
- `afterError` - Action to perform after the handler returns an error or panics. If not specified, no action is taken.

**Prerequisites:**
- When using `MOVE` action with `preserveSubDirs: true`, the destination directory structure must be pre-created on the FTP server. The move operation will fail if the destination parent directories do not exist.

**Behavior:**
1. **After Successful Processing:** If the handler returns successfully (no error), the `afterProcess` action is executed.
2. **After Error:** If the handler returns an error, the `afterError` action is executed.
3. **Subdirectory Preservation:** When using `MOVE` with `preserveSubDirs: true` (default), the subdirectory structure relative to the listener's monitored path is preserved. For example, if listening to `/input/` and processing `/input/orders/2024/file.csv` with `moveTo: "/archive/"`, the file is moved to `/archive/orders/2024/file.csv`.

**Examples:**

Delete after successful processing:
```ballerina
service on ftpListener {
    @ftp:FunctionConfig {
        fileNamePattern: ".*\\.json",
        afterProcess: ftp:DELETE
    }
    remote function onFileJson(json content, ftp:FileInfo fileInfo) returns error? {
        // Process JSON - file is automatically deleted after successful return
        processJson(content);
    }
}
```

Move to archive after processing:
```ballerina
service on ftpListener {
    @ftp:FunctionConfig {
        fileNamePattern: ".*\\.csv",
        afterProcess: {
            moveTo: "/archive/processed/"
        }
    }
    remote function onFileCsv(Employee[] content, ftp:FileInfo fileInfo) returns error? {
        // Process CSV - file is moved to archive after success
        saveEmployees(content);
    }
}
```

Different actions for success and error:
```ballerina
service on ftpListener {
    @ftp:FunctionConfig {
        fileNamePattern: ".*\\.xml",
        afterProcess: {
            moveTo: "/archive/success/"
        },
        afterError: {
            moveTo: "/archive/failed/"
        }
    }
    remote function onFileXml(xml content, ftp:FileInfo fileInfo) returns error? {
        // On success: moved to /archive/success/
        // On error: moved to /archive/failed/
        check processXml(content);
    }
}
```

Move without preserving subdirectories:
```ballerina
service on ftpListener {
    @ftp:FunctionConfig {
        afterProcess: {
            moveTo: "/archive/flat/",
            preserveSubDirs: false
        }
    }
    remote function onFile(byte[] content, ftp:FileInfo fileInfo) returns error? {
        // All files moved directly to /archive/flat/ regardless of source subdirectory
    }
}
```

The Listener has following functions to manage a service.
* `attach()` - can be used to bind a service to the `ftp:Listener`.
```ballerina
# Binds a service to the `ftp:Listener`.
# ```ballerina
# error? response = listener.attach(service1);
# ```
#
# + ftpService - Service to be detached from the listener
# + name - Name of the service to be detached from the listener
# + return - `()` or else an `error` upon failure to register the listener
public isolated function attach(Service ftpService, string[]|string? name = ()) returns error?;
```
* `detach()` - can be used to detach a service from the `ftp:Listener`.
```ballerina
# Stops consuming messages and detaches the service from the `ftp:Listener`.
# ```ballerina
# error? response = listener.detach(service1);
# ```
#
# + ftpService - Service to be detached from the listener
# + return - `()` or else an `error` upon failure to detach the service
public isolated function detach(Service ftpService) returns error?;
```
* `start()` - needs to be called to start the listener.
```ballerina
# Starts the `ftp:Listener`.
# ```ballerina
# error? response = listener.'start();
# ```
#
# + return - `()` or else an `error` upon failure to start the listener
public isolated function 'start() returns error?;
```
* `gracefulStop()` - can be used to gracefully stop the listener.
```ballerina
# Stops the `ftp:Listener` gracefully.
# ```ballerina
# error? response = listener.gracefulStop();
# ```
#
# + return - `()` or else an `error` upon failure to stop the listener
public isolated function gracefulStop() returns error?;
```
* `immediateStop()` - can be used to forcefully stop the listener.
```ballerina
# Stops the `ftp:Listener` forcefully.
# ```ballerina
# error? response = listener.immediateStop();
# ```
#
# + return - `()` or else an `error` upon failure to stop the listener
public isolated function immediateStop() returns error?;
```
* `poll()` - can be used to poll new files from the FTP server.
```ballerina
# Poll new files from a FTP server.
# ```ballerina
# error? response = listener.poll();
# ```
#
# + return - An `error` if failed to establish communication with the FTP
#            server
public isolated function poll() returns error?
```
* `register()` can be used to register an FTP service in an `ftp:listener`.
```ballerina
# Register a FTP service in an FTP listener server.
# ```ballerina
# error? response = listener.register(ftpService, name);
# ```
#
# + ftpService - The FTP service
# + name - Name of the FTP service
# + return - An `error` if failed to establish communication with the FTP
#            server
public isolated function register(Service ftpService, string? name) returns error?
```

### 4.5. Distributed Coordination

The FTP listener supports distributed coordination for high availability deployments. When multiple listener instances are deployed across different nodes, coordination ensures that only one instance actively polls the FTP server while others act as warm standby nodes. This prevents duplicate file processing and provides automatic failover.

#### 4.5.1. Coordination Configuration
* `CoordinationConfig` record represents the configuration for distributed task coordination.
```ballerina
public type CoordinationConfig record {|
    # The database configuration for task coordination
    task:DatabaseConfig databaseConfig;
    # The interval (in seconds) to check the liveness of the active node. Default is 30 seconds.
    int livenessCheckInterval = 30;
    # Unique identifier for the current member. Must be distinct for each node in the distributed system.
    string memberId;
    # The name of the coordination group of FTP listeners that coordinate together.
    # It is recommended to use a unique name for each group.
    string coordinationGroup;
    # The interval (in seconds) for the node to update its heartbeat status. Default is 1 second.
    int heartbeatFrequency = 1;
|};
```

* The `databaseConfig` field accepts either `task:MysqlConfig` or `task:PostgresqlConfig`:
```ballerina
# MySQL configuration
public type MysqlConfig record {
    string host = "localhost";
    string? user = ();
    string? password = ();
    int port = 3306;
    string? database = ();
};

# PostgreSQL configuration
public type PostgresqlConfig record {
    string host = "localhost";
    string? user = ();
    string? password = ();
    int port = 5432;
    string? database = ();
};
```

#### 4.5.2. Coordination Mechanism
1. **Leader election**: Members in the same `coordinationGroup` coordinate via the database to elect an active member
2. **Heartbeat**: The active member updates its heartbeat at `heartbeatFrequency` intervals
3. **Liveness monitoring**: Standby members check the active member's heartbeat every `livenessCheckInterval` seconds
4. **Failover**: If the active member's heartbeat becomes stale, a standby member takes over as the new active member
5. **Polling**: Only the active member's `poll()` function executes; standby members skip polling

## 5. Caller
`ftp:Caller` is like a wrapper on the `ftp:Client`. It has an `ftp:Client` defined inside and contains all the APIs of `ftp:Client` like `get()`, `put()`, `append()` etc. However, `ftp:Caller` can only be created internally to be passed to the `onFileChange` method.
`ftp:Caller` is created in the runtime when the `ftp:Listener` gets attached to a `ftp:Service` by checking whether the user has added `ftp:Caller` as a parameter in the `onFileChange` method.
### 5.1. Initialization
`ftp:Caller` can be both secure and insecure and this depends on the type of `ftp:Listener`. If the `ftp:Listener` is a secure type, `ftp:Caller` will also be secure since the wrapping `ftp:Client` is created using a subset of the `ftp:ListenerConfiguration`.
```ballerina
# Gets invoked during object initialization.
#
# + 'client - The `ftp:Client` which is used to interact with the Ftp server
# + return - `ftp:Error` in case of errors or `()` otherwise
isolated function init(Client 'client) {
    self.'client = 'client;
}
```
### 5.2. Functions
* `put()` method can be used to put files on the server.
```ballerina
# Adds a file to FTP server.
# ```ballerina
# ftp:Error? response = caller->put(path, channel);
# ```
#
# + path - The resource path
# + content - Content to be written to the file in server
# + compressionType - Type of the compression to be used, if
#                     the file should be compressed before
#                     uploading
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function put(string path, stream<byte[] & readonly, io:Error?>|string|xml|json content, Compression compressionType=NONE) returns Error?;
```
* `append()` can be used to append the content to an existing file in FTP server.
```ballerina
# Appends the content to an existing file in FTP server.
# ```ballerina
# ftp:Error? response = caller->append(path, content);
# ```
#
# + path - The resource path
# + content - Content to be written to the file in server
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function append(string path, stream<byte[] & readonly, io:Error?>|string|xml|json content) returns Error?;
```
* `putBytes()` can be used to write bytes to a file.
```ballerina
# Write bytes to a file.
# ```ballerina
# ftp:Error? response = caller->putBytes(path, content, option);
# ```
#
# + path - File location on the server
# + content - Binary data to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putBytes(string path, byte[] content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putText()` can be used to write text to a file.
```ballerina
# Write text to a file.
# ```ballerina
# ftp:Error? response = caller->putText(path, content, option);
# ```
#
# + path - File location on the server
# + content - Text to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putText(string path, string content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putJson()` can be used to write JSON data to a file.
```ballerina
# Write JSON data to a file.
# ```ballerina
# ftp:Error? response = caller->putJson(path, content, option);
# ```
#
# + path - File location on the server
# + content - JSON data to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putJson(string path, json|record {} content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putXml()` can be used to write XML data to a file.
```ballerina
# Write XML data to a file.
# ```ballerina
# ftp:Error? response = caller->putXml(path, content, option);
# ```
#
# + path - File location on the server
# + content - XML data to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putXml(string path, xml|record {} content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putCsv()` can be used to write CSV data to a file.
```ballerina
# Write CSV data to a file.
# ```ballerina
# ftp:Error? response = caller->putCsv(path, content, option);
# ```
#
# + path - File location on the server
# + content - CSV data (table or records) to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putCsv(string path, string[][]|record {}[] content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putBytesAsStream()` can be used to write bytes from a stream to a file.
```ballerina
# Write bytes from a stream to a file.
# Useful for processing and uploading large files without loading everything into memory.
# ```ballerina
# ftp:Error? response = caller->putBytesAsStream(path, content, option);
# ```
#
# + path - File location on the server
# + content - Stream of byte chunks to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putBytesAsStream(string path, stream<byte[], error?> content, FileWriteOption option = OVERWRITE) returns Error?;
```
* `putCsvAsStream()` can be used to write CSV data from a stream to a file.
```ballerina
# Write CSV data from a stream to a file.
# Useful for processing and uploading large CSV files without loading everything into memory.
# ```ballerina
# ftp:Error? response = caller->putCsvAsStream(path, content, option);
# ```
#
# + path - File location on the server
# + content - Stream of CSV rows to write
# + option - Replace or add to the file?
# + return - An error if the operation fails
remote isolated function putCsvAsStream(string path, stream<string[]|record {}, error?> content, FileWriteOption option = OVERWRITE) returns Error?;
```
* To retrieve file content from FTP server, `get()` can be used.
```ballerina
# Retrieves the file content from a remote resource.
# ```ballerina
# stream<byte[] & readonly, io:Error?>|ftp:Error channel = caller->get(path);
# ```
#
# + path - The resource path
# + return - A byte stream from which the file can be read or `ftp:Error` in case of errors
remote isolated function get(string path) returns stream<byte[] & readonly, io:Error?>|Error;
```
* `getBytes()` can be used to read file content as bytes.
```ballerina
# Read file content as bytes (raw binary data).
# ```ballerina
# byte[] content = check caller->getBytes(path);
# ```
#
# + path - File or folder location on the server
# + return - File content as bytes, or an error if the operation fails
remote isolated function getBytes(string path) returns byte[]|Error;
```
* `getText()` can be used to read file content as text.
```ballerina
# Read file content as text.
# ```ballerina
# string content = check caller->getText(path);
# ```
#
# + path - File or folder location on the server
# + return - File content as text, or an error if the operation fails
remote isolated function getText(string path) returns string|Error;
```
* `getJson()` can be used to read a file as JSON data.
```ballerina
# Read a file as JSON data.
# ```ballerina
# json content = check caller->getJson(path);
# ```
#
# + path - Location of the file on the server
# + targetType - What format should the data have? (JSON, structured data, or a custom format)
# + return - The file content as JSON or an error if the operation fails
remote isolated function getJson(string path, typedesc<json|record {}> targetType = <>) returns targetType|Error;
```
* `getXml()` can be used to read a file as XML data.
```ballerina
# Read a file as XML data.
# ```ballerina
# xml content = check caller->getXml(path);
# ```
#
# + path - Location of the file on the server
# + targetType - What format should the data have? (XML, structured data, or a custom format)
# + return - The file content as XML or an error if the operation fails
remote isolated function getXml(string path, typedesc<xml|record {}> targetType = <>) returns targetType|Error;
```
* `getCsv()` can be used to read a CSV file from the server.
```ballerina
# Read a CSV (comma-separated) file from the server.
# The first row of the CSV file should contain column names (headers).
# ```ballerina
# string[][] content = check caller->getCsv(path);
# ```
#
# + path - Location of the CSV file on the server
# + targetType - What format should the data have? (Table or structured records)
# + return - The CSV file content as a table or records, or an error if the operation fails
remote isolated function getCsv(string path, typedesc<string[][]|record {}[]> targetType = <>) returns targetType|Error;
```
* `getBytesAsStream()` can be used to read file content as a stream of byte chunks.
```ballerina
# Read file content as a stream of byte chunks.
# Useful for processing large files without loading the entire file into memory.
# ```ballerina
# stream<byte[], error?> response = check caller->getBytesAsStream(path);
# ```
#
# + path - File or folder location on the server
# + return - A continuous stream of byte chunks, or an error if the operation fails
remote isolated function getBytesAsStream(string path) returns stream<byte[], error?>|Error;
```
* `getCsvAsStream()` can be used to read a CSV file as a continuous stream of rows.
```ballerina
# Read a CSV file as a continuous stream of rows.
# Useful for processing very large files one row at a time.
# The first row of the CSV file should contain column names (headers).
# ```ballerina
# stream<string[], error?> response = check caller->getCsvAsStream(path);
# ```
#
# + path - Location of the CSV file on the server
# + targetType - What format should each row have? (Row values or structured record)
# + return - A stream of rows from the CSV file, or an error if the operation fails
remote isolated function getCsvAsStream(string path, typedesc<string[]|record {}> targetType = <>) returns stream<targetType, error?>|Error;
```
* `mkdir()` can be used to create a new directory in FTP server.
```ballerina
# Creates a new directory in FTP server.
# ```ballerina
# ftp:Error? response = caller->mkdir(path);
# ```
#
# + path - The directory path
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function mkdir(string path) returns Error?;
```
* `rmdir()` can be used to remove an empty directory in the server.
```ballerina
# Deletes an empty directory in FTP server.
# ```ballerina
# ftp:Error? response = caller->rmdir(path);
# ```
#
# + path - The directory path
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function rmdir(string path) returns Error?;
```
* To delete a file, `delete()` can be used.
```ballerina
# Deletes a file from FTP server.
# ```ballerina
# ftp:Error? response = caller->delete(path);
# ```
#
# + path - The resource path
# + return -  `()` or else an `ftp:Error` if failed to establish
#             the communication with the FTP server
remote isolated function delete(string path) returns Error?;
```
* To rename a file or move it to another directory, `rename()` can be used.
```ballerina
# Renames a file or moves it to a new location within the same FTP server.
# ```ballerina
# ftp:Error? response = caller->rename(origin, destination);
# ```
#
# + origin - The source file location
# + destination - The destination file location
# + return - `()` or else an `ftp:Error` if failed to establish
#            the communication with the FTP server
remote isolated function rename(string origin, string destination) returns Error?;
```
* `move()` can be used to move a file to a different location on the file server.
```ballerina
# Move a file to a different location on the file server.
# ```ballerina
# ftp:Error? response = caller->move(sourcePath, destinationPath);
# ```
#
# + sourcePath - The current file location
# + destinationPath - The new file location
# + return - An error if the operation fails
remote isolated function move(string sourcePath, string destinationPath) returns Error?;
```
* `copy()` can be used to copy a file to a different location on the file server.
```ballerina
# Copy a file to a different location on the file server.
# ```ballerina
# ftp:Error? response = caller->copy(sourcePath, destinationPath);
# ```
#
# + sourcePath - The file to copy
# + destinationPath - Where to create the copy
# + return - An error if the operation fails
remote isolated function copy(string sourcePath, string destinationPath) returns Error?;
```
* `exists()` can be used to check if a file or folder exists on the file server.
```ballerina
# Check if a file or folder exists on the file server.
# ```ballerina
# boolean|ftp:Error response = caller->exists(path);
# ```
#
# + path - File or folder location to check
# + return - True if it exists, false if it doesn't, or an error if the check fails
remote isolated function exists(string path) returns boolean|Error;
```
* `size()` function can be used to get the size of a file.
```ballerina
# Gets the size of a file resource.
# ```ballerina
# int|ftp:Error response = caller->size(path);
# ```
#
# + path - The resource path
# + return - The file size in bytes or an `ftp:Error` if
#            failed to establish the communication with the FTP server
remote isolated function size(string path) returns int|Error;
```
* To get the file list in a directory, `list()` can be used.
```ballerina
# Gets the file name list in a given folder.
# ```ballerina
# ftp:FileInfo[]|ftp:Error response = caller->list(path);
# ```
#
# + path - The direcotry path
# + return - An array of file names or an `ftp:Error` if failed to
#            establish the communication with the FTP server
remote isolated function list(string path) returns FileInfo[]|Error;
```
* To check if a resource is a directory, `isDirectory()` can be used.
```ballerina
# Checks if a given resource is a directory.
# ```ballerina
# boolean|ftp:Error response = caller->isDirectory(path);
# ```
#
# + path - The resource path
# + return - `true` if given resource is a directory or an `ftp:Error` if
#            an error occurred while checking the path
remote isolated function isDirectory(string path) returns boolean|Error;
```
## 6. Samples
### 6.1. Sending Files
```ballerina
import ballerina/ftp;
import ballerina/io;
import ballerina/lang.'string as strings;

ftp:AuthConfiguration authConfig = {
    credentials: {username: "wso2", password: "wso2123"},
    privateKey: {
        path: "resources/keys/sftp.private.key",
        password: "password"
    }
};

ftp:ClientConfiguration sftpClientConfig = {
    protocol: ftp:SFTP,
    host: "ftp.example.com",
    port: 21,
    auth: authConfig,
    userDirIsRoot: true
};

public function main() returns error? {
    ftp:Client clientEp = check new(sftpClientConfig);
    stream<byte[] & readonly, io:Error?> fileStream = check clientEp->get("/server/book.txt");
    check fileStream.forEach(isolated function(byte[] & readonly fileContent) {
        io:println("File content received: " + checkpanic strings:fromBytes(fileContent));
    });
    stream<io:Block, io:Error?> bStream = check io:fileReadBlocksAsStream("/local/logFile.txt", 1024);
    check clientEp->put("/server", bStream);
    check fileStream.close();
}
```
### 6.2. Listening to file changes

**Recommended approach using @ftp:ServiceConfig:**
```ballerina
import ballerina/ftp;
import ballerina/io;

listener ftp:Listener remoteServer = check new({
    protocol: ftp:SFTP,
    host: "ftp.example.com",
    auth: {
        credentials: {
            username: "wso2",
            password: "wso2123"
        },
        privateKey: {
            path: "resources/keys/sftp.private.key",
            password: "password"
        }
    },
    port: 21,
    pollingInterval: 2,
    userDirIsRoot: true
});

@ftp:ServiceConfig {
    path: "/home/in",
    fileNamePattern: "(.*).txt"
}
service on remoteServer {

    remote function onFileText(string content, ftp:FileInfo fileInfo, ftp:Caller caller) returns error? {
        io:println("Processing file: " + fileInfo.path);
        io:println("Content: " + content);
        check caller->delete(fileInfo.path);
    }

    remote function onFileDelete(string deletedFile) {
        io:println("Deleted file path: " + deletedFile);
    }
}
```

**Legacy approach (deprecated):**
```ballerina
import ballerina/ftp;
import ballerina/io;

listener ftp:Listener remoteServer = check new({
    protocol: ftp:SFTP,
    host: "ftp.example.com",
    auth: {
        credentials: {
            username: "wso2",
            password: "wso2123"
        },
        privateKey: {
            path: "resources/keys/sftp.private.key",
            password: "password"
        }
    },
    port: 21,
    path: "/home/in",                    // Deprecated
    pollingInterval: 2,
    fileNamePattern: "(.*).txt",         // Deprecated
    userDirIsRoot: true
});

service on remoteServer {

    remote function onFileChange(ftp:Caller caller, ftp:WatchEvent & readonly event) {
        foreach ftp:FileInfo addedFile in event.addedFiles {
            io:println("Added file path: " + addedFile.path);
            check caller->delete(addedFile.path);
        }

        foreach string deletedFile in event.deletedFiles {
            io:println("Deleted file path: " + deletedFile);
        }
    }
}
```
