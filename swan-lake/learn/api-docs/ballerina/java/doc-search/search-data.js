var searchData = {
  "modules": [
    {
      "id": "java",
      "description": "\u003cp\u003eThis module provides the API for Java interoperability in Ballerina.\u003c/p\u003e",
      "orgName": "ballerina",
      "version": "0.9.0"
    }
  ],
  "classes": [],
  "functions": [
    {
      "id": "fromString",
      "description": "\u003cp\u003eReturns a \u003ccode\u003ehandle\u003c/code\u003e, which refers to the Java string representation of the Ballerina \u003ccode\u003estring\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "toString",
      "description": "\u003cp\u003eReturns a Ballerina \u003ccode\u003estring\u003c/code\u003e representation of the Java object referred by the \u003ccode\u003ehandle\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "isNull",
      "description": "\u003cp\u003eReturns \u003ccode\u003etrue\u003c/code\u003e if this handle refers to Java null.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "createNull",
      "description": "\u003cp\u003eReturns a \u003ccode\u003ehandle\u003c/code\u003e, which refers to Java null.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "getClass",
      "description": "\u003cp\u003eReturns a \u003ccode\u003ehandle\u003c/code\u003e, which refers to the Java Class object associated with the class or interface with the given\nstring name.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "cast",
      "description": "\u003cp\u003eReturns an \u003ccode\u003eJObject|error\u003c/code\u003e, which is obtained after casting the provided \u003ccode\u003eJObject\u003c/code\u003e instance\nto the given \u003ccode\u003eJObject\u003c/code\u003e type depending on assignability.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "jObjToString",
      "description": "\u003cp\u003eReturns the string representation of a Java object stored in a handle reference.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    }
  ],
  "records": [
    {
      "id": "ArrayType",
      "description": "\u003cp\u003eRepresents a Java array type.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "ConstructorData",
      "description": "\u003cp\u003eDescribes a Java constructor.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "MethodData",
      "description": "\u003cp\u003eDescribes a Java method.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "FieldData",
      "description": "\u003cp\u003eDescribes a Java field.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "ObjectData",
      "description": "\u003cp\u003eDescribes a Java class that corresponds to a Ballerina object.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    }
  ],
  "constants": [],
  "errors": [
    {
      "id": "JavaClassNotFoundError",
      "description": "\u003cp\u003eRepresents a \u003ccode\u003eJavaError\u003c/code\u003e with the message and the cause.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    }
  ],
  "types": [],
  "clients": [],
  "listeners": [],
  "annotations": [
    {
      "id": "Constructor",
      "description": "\u003cp\u003eDescribes a Java constructor, which provides an implementation of a Ballerina function of which the body is marked as\n\u003ccode\u003eexternal\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "Method",
      "description": "\u003cp\u003eDescribes a Java method, which provides an implementation of a Ballerina function of which the body is marked as\n\u003ccode\u003eexternal\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "FieldGet",
      "description": "\u003cp\u003eDescribes a Java Field access, which provides an implementation of a Ballerina function of which the body is marked as\n\u003ccode\u003eexternal\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "FieldSet",
      "description": "\u003cp\u003eDescribes a Java Field mutate, which provides an implementation of a Ballerina function of which the body is marked as\n\u003ccode\u003eexternal\u003c/code\u003e.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    },
    {
      "id": "Binding",
      "description": "\u003cp\u003eDescribes the Java class representing a Ballerina binding.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    }
  ],
  "abstractObjects": [
    {
      "id": "JObject",
      "description": "\u003cp\u003eThe Ballerina abstract object which is to be extended by Ballerina\nobjects representing Ballerina bindings for Java classes.\u003c/p\u003e",
      "moduleId": "java",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.9.0"
    }
  ]
};