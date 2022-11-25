# Specification: Ballerina I/O Library

_Owners_: @daneshk @BuddhiWathsala  
_Reviewers_: @daneshk  
_Created_: 2021/12/04   
_Updated_: 2022/02/17  
_Edition_: Swan Lake 

## Introduction
This is the specification for the I/O standard library of [Ballerina language](https://ballerina.io/), which provides file related I/O operations.  

The I/O library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag. 

If you have any feedback or suggestions about the library, start a discussion via a GitHub issue or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Console I/O](#2-console-io)
3. [Bytes I/O](#3-bytes-io)
4. [Strings I/O](#4-strings-io)
5. [CSV I/O](#5-csv-io)
6. [JSON I/O](#6-json-io)
7. [XML I/O](#7-xml-io)


## 1. Overview
Ballerina I/O standard library has six aspects of I/O operations.
1. Console I/O
2. Bytes I/O
3. Strings I/O
4. CSV I/O
5. JSON I/O
6. XML I/O

## 2. Console I/O
Console I/O contains APIs to read from the console, write to the console, and write to given output streams.

The following API reads content from standard input and return it as a string to the user.

```ballerina
# Retrieves the input read from the STDIN.
# ```ballerina
# string choice = io:readln("Enter choice 1 - 5: ");
# string choice = io:readln();
# ```
#
# + a - Any value to be printed
# + return - Input read from the STDIN
public function readln(any? a = ()) returns string;
```

The following two APIs write a given input to the standard output.

```ballerina
# Prints `any`, `error`, or string templates(such as `The respective int value is ${val}`) value(s) to the STDOUT.
# ```ballerina
# io:print("Start processing the CSV file from ", srcFileName);
# ```
#
# + values - The value(s) to be printed
public isolated function print(Printable... values);

# Prints `any`, `error` or string templates(such as `The respective int value is ${val}`) value(s) to the STDOUT
# followed by a new line.
# ```ballerina
# io:println("Start processing the CSV file from ", srcFileName);
# ```
#
# + values - The value(s) to be printed
public isolated function println(Printable... values);
```

Here, the `print` API prints the given `values` as it is and the `println` API prints the input followed by a new line.
In addition, both these print APIs support string templates as inputs like the following example.

```ballerina
import ballerina/io;
 
public function main() {
   string name = "Harry";
   int age = 20;
   io:println(`My name is ${name} and I am ${age} years old.`);
}
```

The following two APIs allow users to write a given set of inputs to a specific output stream (STDOUT or STDERR).

```ballerina
# Prints `any`, `error`, or string templates(such as `The respective int value is ${val}`) value(s) to
# a given stream(STDOUT or STDERR).
# ```ballerina
# io:fprint(io:stderr, "Unexpected error occurred");
# ```
# + fileOutputStream - The output stream (`io:stdout` or `io:stderr`) content needs to be printed
# + values - The value(s) to be printed
public isolated function fprint(FileOutputStream fileOutputStream, Printable... values);

# Prints `any`, `error`, or string templates(such as `The respective int value is ${val}`) value(s) to
# a given stream(STDOUT or STDERR) followed by a new line.
# ```ballerina
# io:fprintln(io:stderr, "Unexpected error occurred");
# ```
# + fileOutputStream - The output stream (`io:stdout` or `io:stderr`) content needs to be printed
# + values - The value(s) to be printed
public isolated function fprintln(FileOutputStream fileOutputStream, Printable... values);
```

As the `print` APIs, the `fprint` APIs also support string templates.

## 3. Bytes I/O

The bytes I/O APIs can be further categorized based on their streaming capabilities as streaming and non-streaming APIs.

**Non-Streaming APIs**

The following API reads the content of a given input file as a read-only bytes array and return it.

```ballerina
# Read the entire file content as a byte array.
# ```ballerina
# byte[]|io:Error content = io:fileReadBytes("./resources/myfile.txt");
# ```
# + path - The path of the file
# + return - A read-only byte array or an `io:Error`
public isolated function fileReadBytes(string path) returns readonly & byte[]|Error;
```

The following API writes given bytes content to a given file.

```ballerina
# Write a set of bytes to a file.
# ```ballerina
# byte[] content = [60, 78, 39, 28];
# io:Error? result = io:fileWriteBytes("./resources/myfile.txt", content);
# ```
# + path - The path of the file
# + content - Byte content to write
# + option - To indicate whether to overwrite or append the given content
# + return - An `io:Error` or else `()`
public isolated function fileWriteBytes(string path, byte[] content, FileWriteOption option = OVERWRITE) returns
Error?;
```

In write APIs, users can specify the option, either overwriting the existing file or appending it to the given file.

**Streaming APIs**

The following API reads the content of a given input file as a stream of blocks. Here, a block defines as a read-only bytes array.

```ballerina
# Read the entire file content as a stream of blocks.
# ```ballerina
# stream<io:Block, io:Error?>|io:Error content = io:fileReadBlocksAsStream("./resources/myfile.txt", 1000);
# ```
# + path - The path of the file
# + blockSize - An optional size of the byte block. The default size is 4KB
# + return - A byte block stream or  an`io:Error`
public isolated function fileReadBlocksAsStream(string path, int blockSize = 4096) returns stream<Block, Error?>|
Error;
```

The following API writes a given byte stream to a given file.

```ballerina
# Write a byte stream to a file.
# ```ballerina
# byte[] content = [[60, 78, 39, 28]];
# stream<byte[], io:Error?> byteStream = content.toStream();
# io:Error? result = io:fileWriteBlocksFromStream("./resources/myfile.txt", byteStream);
# ```
# + path - The path of the file
# + byteStream - Byte stream to write
# + option - To indicate whether to overwrite or append the given content
# + return - An `io:Error` or else `()`
public isolated function fileWriteBlocksFromStream(string path, stream<byte[], Error?> byteStream,
                                                    FileWriteOption option = OVERWRITE) returns Error?;
```

## 4. Strings I/O

**Non-Streaming APIs**

The following API reads the content of a given input file as a string.

```ballerina
# Reads the entire file content as a `string`.
# The resulting string output does not contain the terminal carriage (e.g., `\r` or `\n`).
# ```ballerina
# string|io:Error content = io:fileReadString("./resources/myfile.txt");
# ```
# + path - The path of the file
# + return - The entire file content as a string or an `io:Error`
public isolated function fileReadString(string path) returns string|Error;
```

The following API writes given string content to a given file.

```ballerina
# Write a string content to a file.
# ```ballerina
# string content = "Hello Universe..!!";
# io:Error? result = io:fileWriteString("./resources/myfile.txt", content);
# ```
# + path - The path of the file
# + content - String content to write
# + option - To indicate whether to overwrite or append the given content
# + return - `()` when the writing was successful or an `io:Error`
public isolated function fileWriteString(string path, string content, FileWriteOption option = OVERWRITE) returns
Error?;
```

The following API reads the content of a given input file line by line and return a string array, and the string array contains each line as a string.

```ballerina
# Reads the entire file content as a list of lines.
# The resulting string array does not contain the terminal carriage (e.g., `\r` or `\n`).
# ```ballerina
# string[]|io:Error content = io:fileReadLines("./resources/myfile.txt");
# ```
# + path - The path of the file
# + return - The file as list of lines or an `io:Error`
public isolated function fileReadLines(string path) returns string[]|Error;
```

The following API writes a given array of lines to a given file.

```ballerina
# Write an array of lines to a file.
# During the writing operation, a newline character `\n` will be added after each line.
# ```ballerina
# string[] content = ["Hello Universe..!!", "How are you?"];
# io:Error? result = io:fileWriteLines("./resources/myfile.txt", content);
# ```
# + path - The path of the file
# + content - An array of string lines to write
# + option - To indicate whether to overwrite or append the given content
# + return - `()` when the writing was successful or an `io:Error`
public isolated function fileWriteLines(string path, string[] content, FileWriteOption option = OVERWRITE) returns
Error?;
```

**Streaming APIs**

The following API reads the content of a given input file as a stream of lines.

```ballerina
# Reads file content as a stream of lines.
# The resulting stream does not contain the terminal carriage (e.g., `\r` or `\n`).
# ```ballerina
# stream<string, io:Error?>|io:Error content = io:fileReadLinesAsStream("./resources/myfile.txt");
# ```
# + path - The path of the file
# + return - The file content as a stream of strings or an `io:Error`
public isolated function fileReadLinesAsStream(string path) returns stream<string, Error?>|Error;
```

The following API writes a given line stream to a given file.

```ballerina
# Write stream of lines to a file.
# During the writing operation, a newline character `\n` will be added after each line.
# ```ballerina
# string content = ["Hello Universe..!!", "How are you?"];
# stream<string, io:Error?> lineStream = content.toStream();
# io:Error? result = io:fileWriteLinesFromStream("./resources/myfile.txt", lineStream);
# ```
# + path - The path of the file
# + lineStream - A stream of lines to write
# + option - To indicate whether to overwrite or append the given content
# + return - `()` when the writing was successful or an `io:Error`
public isolated function fileWriteLinesFromStream(string path, stream<string, Error?> lineStream,
                                                FileWriteOption option = OVERWRITE) returns Error?;
```


## 5. CSV I/O

**Non-Streaming APIs**

The following API reads the content of a given CSV file as a string array of arrays. Here, each CSV record represents as a string array.

```ballerina
# Read file content as a CSV.
# ```ballerina
# string[][]|io:Error content = io:fileReadCsv("./resources/myfile.csv");
# map<anydata>[]|io:Error content = io:fileReadCsv("./resources/myfile.csv");
# ```
# + path - The CSV file path
# + skipHeaders - Number of headers, which should be skipped prior to reading records
# + return - The entire CSV content in the channel as an array of string arrays or an `io:Error`
public isolated function fileReadCsv(string path, int skipHeaders = 0) returns string[][]|Error;
```

The following API writes given CSV content to a given file.

```ballerina
# Write CSV content to a file.
# ```ballerina
# type Coord record {int x;int y;};
# Coord[] contentRecord = [{x: 1,y: 2},{x: 1,y: 2}]
# string[][] content = [["Anne", "Johnson", "SE"], ["John", "Cameron", "QA"]];
# io:Error? result = io:fileWriteCsv("./resources/myfile.csv", content);
# io:Error? resultRecord = io:fileWriteCsv("./resources/myfileRecord.csv", contentRecord);
# ```
# + path - The CSV file path
# + content - CSV content as an array of string arrays
# + option - To indicate whether to overwrite or append the given content
# + return - An `io:Error` or `()` when the writing was successful
public isolated function fileWriteCsv(string path, string[][] content, FileWriteOption option = OVERWRITE) returns
Error?;
```

The following API reads the content of a given CSV file as a stream of string arrays. Here, each CSV record represents as a string array.

```ballerina
# Read file content as a CSV.
# ```ballerina
# stream<string[], io:Error?>|io:Error content = io:fileReadCsvAsStream("./resources/myfile.csv");
# stream<map<anydata>, io:Error?>|io:Error content = io:fileReadCsvAsStream("./resources/myfile.csv");
# ```
# + path - The CSV file path
# + return - The entire CSV content in the channel a stream of string arrays or an `io:Error`
public isolated function fileReadCsvAsStream(string path) returns stream<string[], Error?>|Error;
```

The following API writes a given CSV stream to a given file.

```ballerina
# Write CSV record stream to a file.
# ```ballerina
# type Coord record {int x;int y;};
# Coord[] contentRecord = [{x: 1,y: 2},{x: 1,y: 2}]
# string[][] content = [["Anne", "Johnson", "SE"], ["John", "Cameron", "QA"]];
# stream<string[], io:Error?> stringStream = content.toStream();
# stream<Coord, io:Error?> recordStream = contentRecord.toStream();
# io:Error? result = io:fileWriteCsvFromStream("./resources/myfile.csv", stringStream);
# io:Error? resultRecord = io:fileWriteCsvFromStream("./resources/myfileRecord.csv", recordStream);
# ```
# + path - The CSV file path
# + content - A CSV record stream to be written
# + option - To indicate whether to overwrite or append the given content
# + return - An `io:Error` or `()` when the writing was successful
public isolated function fileWriteCsvFromStream(string path, stream<string[], Error?> content,
                                                FileWriteOption option = OVERWRITE) returns Error?;
```

## 6. JSON I/O

The following API reads the content of a given JSON file and returns a Ballerina JSON object.

```ballerina
# Reads file content as a JSON.
# ```ballerina
# json|io:Error content = io:fileReadJson("./resources/myfile.json");
# ```
# + path - The path of the JSON file
# + return - The file content as a JSON object or an `io:Error`
public isolated function fileReadJson(string path) returns json|Error;
```

The following API writes given JSON to a given file.

```ballerina
# Write a JSON to a file.
# ```ballerina
# json content = {"name": "Anne", "age": 30};
# io:Error? result = io:fileWriteJson("./resources/myfile.json", content);
# ```
# + path - The path of the JSON file
# + content - JSON content to write
# + return - `()` when the writing was successful or an `io:Error`
public isolated function fileWriteJson(string path, json content) returns Error?;
```
## 7. XML I/O

The following API reads the content of a given XML file and returns a Ballerina XML object.

```ballerina
# Reads file content as an XML.
# ```ballerina
# xml|io:Error content = io:fileReadXml("./resources/myfile.xml");
# ```
# + path - The path of the XML file
# + return - The file content as an XML or an `io:Error`
public isolated function fileReadXml(string path) returns xml|Error;
```

The following API writes given XML to a given file.
```ballerina
# Write XML content to a file.
# ```ballerina
# xml content = xml `<book>The Lost World</book>`;
# io:Error? result = io:fileWriteXml("./resources/myfile.xml", content);
# ```
# + path - The path of the XML file
# + content - XML content to write
# + xmlOptions - XML writing options(XML entity type and DOCTYPE)
# + fileWriteOption - file write option(`OVERWRITE` and `APPEND` are the possible values, and the default value is `OVERWRITE`)
# + return - `()` value when the writing was successful or an `io:Error`
public isolated function fileWriteXml(string path, xml content, FileWriteOption fileWriteOption = OVERWRITE,
                                    *XmlWriteOptions xmlOptions)  returns Error?;
```

The XML entity type details can pass to the `fileWriteXml` using the `XmlWriteOptions`.

```ballerina
# Represents the XML entity type that needs to be written.
#
# + DOCUMENT_ENTITY - An XML document with a single root node
# + EXTERNAL_PARSED_ENTITY - Externally parsed well-formed XML entity
public enum XmlEntityType {
    DOCUMENT_ENTITY,
    EXTERNAL_PARSED_ENTITY
}

# Represents the XML DOCTYPE entity.
#
# + system - the system identifier
# + public - the public identifier
# + internalSubset - internal DTD schema
public type XmlDoctype record {|
    string? system = ();
    string? 'public = ();
    string? internalSubset = ();
|};

# The writing options of an XML.
#
# + xmlEntityType - the entity type of the XML input (the default value is `DOCUMENT_ENTITY`)
# + doctype - XML DOCTYPE value (the default value is `()`)
public type XmlWriteOptions record {|
    XmlEntityType xmlEntityType = DOCUMENT_ENTITY;
    XmlDoctype? doctype = ();
|};
```

