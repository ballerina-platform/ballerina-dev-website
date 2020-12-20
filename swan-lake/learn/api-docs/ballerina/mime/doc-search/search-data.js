var searchData = {
  "modules": [
    {
      "id": "mime",
      "description": "\u003cp\u003eThis module provides functions to encapsulate multiple body parts such as attachments into a single message.\u003c/p\u003e",
      "orgName": "ballerina",
      "version": "1.0.4"
    }
  ],
  "classes": [
    {
      "id": "ContentDisposition",
      "description": "\u003cp\u003eRepresents values in \u003ccode\u003eContent-Disposition\u003c/code\u003e header.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "MediaType",
      "description": "\u003cp\u003eDescribes the nature of the data in the body of a MIME entity.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "Entity",
      "description": "\u003cp\u003eRepresents the headers and body of a message.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "functions": [
    {
      "id": "base64Encode",
      "description": "\u003cp\u003e\u003cstrong\u003eDeprecated API\u003c/strong\u003e.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "base64Decode",
      "description": "\u003cp\u003e\u003cstrong\u003eDeprecated API\u003c/strong\u003e.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "base64EncodeBlob",
      "description": "\u003cp\u003e\u003cstrong\u003eDeprecated API\u003c/strong\u003e.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "base64DecodeBlob",
      "description": "\u003cp\u003e\u003cstrong\u003eDeprecated API\u003c/strong\u003e.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "getMediaType",
      "description": "\u003cp\u003eGets the \u003ccode\u003eMediaType\u003c/code\u003e object populated with it when the \u003ccode\u003eContent-Type\u003c/code\u003e is in string.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "getContentDispositionObject",
      "description": "\u003cp\u003eGiven the Content-Disposition as a string, gets the ContentDisposition object with it.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "prepareEncodingErrorWithDetail",
      "description": "\u003cp\u003eConstructs an \u003ccode\u003eEncodeError\u003c/code\u003e with the given details.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "prepareDecodingErrorWithDetail",
      "description": "\u003cp\u003eConstructs a \u003ccode\u003eDecodeError\u003c/code\u003e with the given details.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "records": [],
  "constants": [
    {
      "id": "BOUNDARY",
      "description": "\u003cp\u003eKey name for \u003ccode\u003eboundary\u003c/code\u003e parameter in MediaType.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "START",
      "description": "\u003cp\u003eKey name for \u003ccode\u003estart\u003c/code\u003e parameter in MediaType.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "TYPE",
      "description": "\u003cp\u003eKey name for \u003ccode\u003etype\u003c/code\u003e parameter in MediaType.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "CHARSET",
      "description": "\u003cp\u003eKey name for \u003ccode\u003echarset\u003c/code\u003e parameter in MediaType.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "DEFAULT_CHARSET",
      "description": "\u003cp\u003eDefault charset to be used with MIME encoding and decoding.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "CONTENT_ID",
      "description": "\u003cp\u003eRepresents \u003ccode\u003econtent-id\u003c/code\u003e header name.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "CONTENT_LENGTH",
      "description": "\u003cp\u003eRepresents \u003ccode\u003econtent-length\u003c/code\u003e header name.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "CONTENT_TYPE",
      "description": "\u003cp\u003eRepresents \u003ccode\u003econtent-type\u003c/code\u003e header name.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "CONTENT_DISPOSITION",
      "description": "\u003cp\u003eRepresents \u003ccode\u003econtent-disposition\u003c/code\u003e header name.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_OCTET_STREAM",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/octet-stream\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_JSON",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/json\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_XML",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/xml\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_SVG_XML",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/svg+xml\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_XHTML_XML",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/xhtml+xml\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_SOAP_XML",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/soap+xml\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_FORM_URLENCODED",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/x-www-form-urlencoded\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "APPLICATION_PDF",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eapplication/pdf\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "IMAGE_JPEG",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eimage/jpeg\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "IMAGE_GIF",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eimage/gif\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "IMAGE_PNG",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003eimage/png\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "MULTIPART_FORM_DATA",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003emultipart/form-data\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "MULTIPART_MIXED",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003emultipart/mixed\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "MULTIPART_ALTERNATIVE",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003emultipart/alternative\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "MULTIPART_RELATED",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003emultipart/related\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "MULTIPART_PARALLEL",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003emultipart/parallel\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "TEXT_PLAIN",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003etext/plain\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "TEXT_HTML",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003etext/html\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "TEXT_XML",
      "description": "\u003cp\u003eRepresents the \u003ccode\u003etext/xml\u003c/code\u003e media type.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "errors": [
    {
      "id": "EncodeError",
      "description": "\u003cp\u003eRepresents an \u003ccode\u003eEncodeError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "DecodeError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eDecodeError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "GenericMimeError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eGenericMimeError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "SetHeaderError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eSetHeaderError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "InvalidHeaderValueError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eInvalidHeaderValueError\u003c/code\u003e error with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "InvalidHeaderParamError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eInvalidHeaderParamError\u003c/code\u003e error with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "InvalidContentLengthError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eInvalidContentLengthError\u003c/code\u003e error with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "HeaderNotFoundError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eHeaderNotFoundError\u003c/code\u003e error with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "InvalidHeaderOperationError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eInvalidHeaderOperationError\u003c/code\u003e error with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "SerializationError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eSerializationError\u003c/code\u003e error with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "ParserError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eParserError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "InvalidContentTypeError",
      "description": "\u003cp\u003eRepresents an \u003ccode\u003eInvalidContentTypeError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "HeaderUnavailableError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eHeaderUnavailableError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "IdleTimeoutTriggeredError",
      "description": "\u003cp\u003eRepresents an \u003ccode\u003eIdleTimeoutTriggeredError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    },
    {
      "id": "NoContentError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eNoContentError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "types": [
    {
      "id": "Error",
      "description": "\u003cp\u003eRepresents MIME related errors.\u003c/p\u003e",
      "moduleId": "mime",
      "moduleOrgName": "ballerina",
      "moduleVersion": "1.0.4"
    }
  ],
  "clients": [],
  "listeners": [],
  "annotations": [],
  "abstractObjects": []
};