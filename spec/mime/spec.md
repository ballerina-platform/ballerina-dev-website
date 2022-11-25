# Specification: Ballerina MIME Library

_Owners_: @shafreenAnfar @TharmiganK @chamil321  
_Reviewers_: 
_Created_: 2022/06/07  
_Updated_: 2022/06/17   
_Edition_: Swan Lake

## Introduction
This is the specification for the MIME standard library of [Ballerina language](https://ballerina.io/), which provides 
a set of APIs to work with messages, which follow the Multipurpose Internet Mail Extensions (MIME) specification as 
specified in the [RFC 2045](https://datatracker.ietf.org/doc/html/rfc2045) standard.  

```
Entity refers to the header fields and the content of a message or a part of the body in a multipart entity. 
```

The released versions of the specification can be found under the relevant GitHub tag. 

If you have any feedback or suggestions about the library, start a discussion via a 
[GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the 
[Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and 
implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the 
specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label 
`type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation 
from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Components](#2-components)
    * 2.1. [Entity](#21-entity)
    * 2.2. [MediaType](#22-mediatype)
    * 2.3. [ContentDisposition](#23-contentdisposition)
3. [Supported media types](#3-supported-multipart-types)
4. [Modify and retrieve the data in an entity](#4-modify-and-retrieve-the-data-in-an-entity)
5. [Handle large files](#5-handle-large-files)
6. [base64 Encode/Decode functions](#6-base64-encodedecode-functions)
7. [Error handling ](#7-error-handling)

## 1. Overview
Ballerina language provides support for writing network-oriented programs. The standard libraries such as
HTTP, Email uses the messages or entities to transfer data between endpoints. MIME is the standard way to organize the
message according to the universal specifications.

The MIME standard library is designed to work independently as a support package to handle the entity. It includes 
high-level abstractions such as `mime:Entity`, `mime:ContentDisposition`, and `mime:MediaType` which allow users 
to handle the exchanging message.

## 2. Components
### 2.1. Entity
The MIME Entity represents the headers and body of a message as defined in 
[RFC 2045](https://datatracker.ietf.org/doc/html/rfc2045#section-2.4). This can be used to represent both the entity 
of a top level message, and an entity(body part) inside of a multipart entity.
```ballerina
mime:Entity entity = new;
```

#### 2.1.1 Usage in HTTP package
Both http:Request and http:Response has setEntity and getEntity methods to work with mime:Entity.
```ballerina
    http:Request request = new;
    mime:Entity|ClientError value = request.getEntity();
    
    mime:Entity entity = new;
    request.setEntity(entity);
```

 - In the current implementation, the entity body is set through, setJsonPayload(json jsonContent), 
setXmlPayload(xml xmlContent) etc. methods where the input is always read from the memory.
 - If a user call getEntity() on a newly created request or a response that will result in an empty entity.

#### 2.1.1 Usage in Email package
When sending emails with SMTP, one of the options to specify the email attachments in the email:Message is an 
array of the mime:Entity type 

```ballerina
mime:Entity imageAttachment = new;
mime:ContentDisposition disposition = new;
disposition.fileName = "profilePic.jpg";
disposition.disposition = "attachment";
disposition.name = "profilePic";
imageAttachment.setContentDisposition(disposition);
imageAttachment.setContentId("ImageAttachment");
imageAttachment.setFileAsEntityBody("path/to/profilePic.jpg", mime:IMAGE_JPEG);

email:Message email = {
    // Other fields
    attachments: imageAttachment
};
```

### 2.2. MediaType
The Media type describes the nature of the data in the body of a MIME entity as defined in 
[RFC 2046](https://www.ietf.org/rfc/rfc2046.txt).

As per the Requirement in spec :  [[RFC 2616](https://datatracker.ietf.org/doc/html/rfc2616#section-14.17), 
[RFC 2045](https://datatracker.ietf.org/doc/html/rfc2045#section-5)]
 - RFC 2616  media-type     = type "/" subtype *( ";" parameter )
 - RFC 2045  content := "Content-Type" ":" type "/" subtype 
   *(";" parameter)
   ; Matching of media type and subtype 
   ; is ALWAYS case-insensitive.]
   
```ballerina
mime:MediaType mediaType = new;
```

### 2.3. ContentDisposition

The ContentDisposition represents values in Content-Disposition header as defined in 
[RFC 2183](https://datatracker.ietf.org/doc/html/rfc2183).
```ballerina
mime:ContentDisposition disposition = new;
```

## 3. Supported multipart types
The module supports multipart/form-data, multipart/mixed, multipart/alternative, multipart/related, and 
multipart/parallel as multipart content types.

```ballerina
resource function get encode_out_response(http:Caller caller, http:Request request) returns error? {

    //Create a body part with json content.
    mime:Entity bodyPart1 = new;
    bodyPart1.setJson({"bodyPart":"jsonPart"});

    //Create another body part with a xml file.
    mime:Entity bodyPart2 = new;
    bodyPart2.setFileAsEntityBody("tests/datafiles/file.xml", mime:TEXT_XML);

    //Create a text body part.
    mime:Entity bodyPart3 = new;
    bodyPart3.setText("Ballerina text body part");

    //Create another body part with a text file.
    mime:Entity bodyPart4 = new;
    bodyPart4.setFileAsEntityBody("tests/datafiles/test.tmp");

    //Create an array to hold all the body parts.
    mime:Entity[] bodyParts = [bodyPart1, bodyPart2, bodyPart3, bodyPart4];

    //Set the body parts to outbound response.
    http:Response outResponse = new;
    string contentType = mime:MULTIPART_MIXED + "; boundary=e3a0b9ad7b4e7cdb";
    outResponse.setBodyParts(bodyParts, contentType);

    check caller->respond(outResponse);
}
```

## 4. Modify and retrieve the data in an entity
This module provides functions to set and get an entity body from different kinds of message types such as 
XML, text, JSON, byte[], and body parts. 

```ballerina
mime:Entity entity = new;

// handling Json
entity.setJson({ "Hello": "World" });
json|mime:ParserError result = entity.getJson();

// handling bodypart
entity.setBodyParts(bodyParts, contentType); 
```

Headers can be modified through functions such as addHeader(), 
setHeader(), removeHeader(), etc.

```ballerina
string[]|mime:HeaderNotFoundError headerNames = entity.getHeaders(mime:CONTENT_TYPE);
entity.setHeader("custom-header", "header-value");
```

## 5. Handle large files
The entity object method setFileAsEntityBody() can be used to set large files as the entity body and is able to 
read it as a stream using the getByteStream() function.

```ballerina
mime:Entity entity = new;
entity.setFileAsEntityBody("<file path>");
```
 - Sets the entity body with a given file. This method overrides any existing content-type headers with the default 
content-type, which is application/octet-stream. This default value can be overridden by passing the content type 
as an optional parameter.

```ballerina
stream<byte[], io:Error?>|mime:ParserError str = entity.getByteStream();
```
 - Gets the entity body as a stream of byte[] from a given entity.

## 6. base64 Encode/Decode functions
Decodes a given input with MIME specific Base64 encoding scheme.

```ballerina
string content = "ballerina";
byte[] bytes = content.toBytes();
// Decodes a given input with MIME specific Base64 encoding scheme.
byte[] decodedBytes = base64Decode(bytes);

// Decodes a given byte[] using the Base64 encoding scheme.
byte[] res = base64DecodeBlob(bytes);

// Encodes a given input with MIME specific Base64 encoding scheme.
byte[] res = base64Encode(bytes);

// Encodes a given byte[] using the Base64 encoding scheme.
byte[] res = base64EncodeBlob(bytes);
```

## 7. Error handling 
The errors mainly focuses on the Entity body and the Entity header

- Error - Defines the common error type for the module.
- GenericMimeError - Represents a GenericMimeError with the message and the cause.
- HeaderNotFoundError - Represents a HeaderNotFoundError error with the message and the cause.
- HeaderUnavailableError - Represents a HeaderUnavailableError with the message and the cause.
- IdleTimeoutTriggeredError - Represents an IdleTimeoutTriggeredError with the message and the cause.
- InvalidContentLengthError - Represents a InvalidContentLengthError error with the message and the cause.
- InvalidContentTypeError - Represents an InvalidContentTypeError with the message and the cause.
- InvalidHeaderOperationError - Represents a InvalidHeaderOperationError error with the message and the cause.
- InvalidHeaderParamError - Represents a InvalidHeaderParamError error with the message and the cause.
- InvalidHeaderValueError - Represents a InvalidHeaderValueError error with the message and the cause.
- NoContentError - Represents a NoContentError with the message and the cause.
- ParserError - Represents a ParserError with the message and the cause.
- SerializationError - Represents a SerializationError error with the message and the cause.
- SetHeaderError - Represents a SetHeaderError with the message and the cause.
- DecodeError - Represents a DecodeError with the message and the cause.
- EncodeError - Represents an EncodeError with the message and the cause.
