---
layout: ballerina-inner-page
permalink: /v0-991/learn/tools-ides/

---

# Tools and IDEs

Ballerina provides language servers, editors, IDEs, and graphical visualization tools to help you write, document, and test your code. The sections below introduce you to them. 

- [Editor and IDE support](#editor-and-ide-support)
- [OpenAPI to Ballerina code generator](#openapi-to-ballerina-code-generator)
- [API documentation generator](#api-documentation-generator)
- [Test framework](#test-framework)

## Editor and IDE support

You can use plugins to write Ballerina code in your favorite editor or IDE. Click on the below icons to learn about the plugins that are currently available. 

![VS Code](/learn/images/vscode-logo.jpg)&nbsp;&nbsp;[Visual Studio Code](/learn/tools-ides/vscode-plugin) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![IntelliJ](/learn/images/idea-logo.jpg)&nbsp;&nbsp;[IntelliJ IDEA](/learn/tools-ides/intellij-plugin)

## OpenAPI to Ballerina code generator

You can use the existing OpenAPI/Swagger files to generate connectors and services in Ballerina code. For details, see the [OpenAPI to Ballerina Code Generator](https://ballerina.io/learn/by-guide/open-api-based-service/).

## API documentation generator

As you develop new connectors, remote functions in connectors and other functions that you want to share with others, it's important to add API documentation that describes each entity and how it's used. Ballerina provides a framework called **Docerina** that generates API documentation from the annotations in your Ballerina files. You can check it out [here](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/docerina). 

You can generate docs for a Ballerina file or module using the following command:

```
./ballerina doc [<ballerina-file>|<module-name>]
```

## Test framework

Ballerina provides a testing framework called **Testerina** that you can use to test your programs. You can check it out [here](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/testerina).

You can test a Ballerina file or module using the following command:

```
./ballerina test [<ballerina-file>|<module-name>]
```

## Compatibility

Ballerina Language Specification supports a set of experimental features such as *_transactions_* syntax. In order to be compatible with the experimental features and for supporting language intelligence in VSCode Plugin, enable the `Allow Experimental` option in user settings.
