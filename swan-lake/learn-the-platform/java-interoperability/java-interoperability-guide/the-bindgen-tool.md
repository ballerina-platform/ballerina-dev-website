---
layout: ballerina-java-interoperability-left-nav-pages-swanlake
title: The Bindgen Tool
description: The bindgen tool is a CLI tool, which generates Ballerina bindings for Java classes.
keywords: ballerina, programming language, java, interoperability, bindgen
permalink: /learn/java-interoperability/the-bindgen-tool/
active: the-bindgen-tool
intro: The bindgen tool is a CLI tool, which generates Ballerina bindings for Java classes.
redirect_from:
  - /learn/tooling-guide/cli-tools/bindgen-tool/
  - /learn/tooling-guide/cli-tools/bindgen-tool
  - /learn/cli-documentation/bindgen-tool/
  - /learn/cli-documentation/bindgen-tool
  - /learn/cli-documentation/the-bindgen-tool/
  - /learn/cli-documentation/the-bindgen-tool
---

The following sections explain how the `bindgen` tool works.

## The `bindgen` command

```sh
ballerina bindgen [(-cp|--classpath) <classpath>...]
                  [(-mvn|--maven) <groupId>:<artifactId>:<version>]
                  [(-o|--output) <output-path>]
                  [--public]
                  (<class-name>...)
```

`(-cp|--classpath) <classpath>...`
This optional parameter could be used to specify one or more comma-delimited classpaths for retrieving the Java libraries required for the generation of the Ballerina bindings. The classpath could be provided as comma-separated paths of JAR files or as comma-separated paths of directories containing all the relevant Java libraries. If the Ballerina bindings are to be generated from a standard Java library, from a library available inside the Ballerina SDK, or a platform library specified in the `Ballerina.toml`, then you need not specify the classpath explicitly.

`(-mvn|--maven) <groupId>:<artifactId>:<version>`
This optional parameter could be used to specify a Maven dependency required for the generation of the Ballerina bindings. Here, the specified library and its transitive dependencies will be resolved into the `target/platform-libs` directory of the Ballerina package. If the tool is not executed inside a package or if the output path does not point to a package, the `target/platform-libs` directory structure will be created in the output path to store the Maven dependencies. The tool will also update the `Ballerina.toml` file with the platform libraries if the command is executed inside a Ballerina package.

`(-o|--output) <output>`
This optional parameter could be used to generate all the bindings inside a single directory instead of generating module-level mappings. This option could be used in instances where all the mappings are required inside a single module. The specified directory doesn't always have to be inside a Ballerina package.

`--public`
Set the visibility modifier of the generated binding classes to public. This flag will be applicable only if the bindings are generated inside a single directory.

`<class-name>...`
One or more space-separated fully-qualified Java class names for which the Ballerina bridge code is to be generated. These class names should be provided at the end of the command.

## Generated bridge code

When the tool is run, a `.bal` file will be created to represent each Java class. This would contain the respective Ballerina binding class along with the required Java interoperability mappings. By default, these `.bal` files will be generated inside separate modules representing each Java package. If the `[(-o|--output) <output-path>]` option is used, they will be generated inside a single directory.

Apart from creating bindings for the specified Java classes, the command will also generate empty Ballerina binding classes for dependent Java classes. A Java class would be considered dependent if it is used inside one of the generated Ballerina binding classes.

A set of additional `.bal` files will be generated to store the error types used within the Ballerina binding classes.

The generated bindings will be inside the specified output directory as follows.
```sh
<module-dir>
    ├── <class-name>.bal // generated classes
    ├── ...
    ├── <class-name>.bal // generated dependent classes
    ├── ...
    ├── <class-name>.bal // generated error types
    └── ...
```

## Java to Ballerina mapping

### Java classes
A Java class will be mapped to a Ballerina class. This Ballerina class will have the same name as the Java class.

E.g., the generated Ballerina class of the `java.util.ArrayDeque` class will be as follows.
```ballerina
@java:Binding {
    'class: "java.util.ArrayDeque"
}
distinct class ArrayDeque {

    *java:JObject;
    *AbstractCollection;

    public handle jObj;

    function init(handle obj) {
        self.jObj = obj;
    }

    ...
};
```
If there are multiple classes with the same simple name, they need to be generated using a single execution. The tool will then apply a numerical identifier at the end of duplicated class names. This could be manually changed into something meaningful if required.

The format for specifying inner classes using the command is `<package-name>.ClassName$InnerClassName`. The dollar sign might have to be escaped using the backslash key.

E.g., the command to generate bindings for `java.lang.Character.Subset` class will be as follows.
```sh
> bal bindgen java.lang.Character\$Subset
```

When referring to a Java code to figure out the imported classes, you should be cautious about the Java classes from the `java.lang` package since these will not be visible as imports in the Java code. However, you need not generate bindings for the `java.lang.String` class since it is mapped into the Ballerina `string` type from within the generated Ballerina bindings.

### Constructors
Constructors of Java classes will be mapped to functions outside the Ballerina class. These function names are comprised of the constructor name prefixed with the `new` keyword. If there are multiple constructors, they will be suffixed with an auto-incremented number.

E.g., generated constructors of the `java.util.ArrayDeque` class will be as follows.
```ballerina
function newArrayDeque1() returns ArrayDeque {
   ...
}

function newArrayDeque2(int arg0) returns ArrayDeque {
   ...
}

function newArrayDeque3(Collection arg0) returns ArrayDeque {
   ...
}
```

### Methods
All public methods will be exposed through Ballerina bindings. Instance methods will reside inside the Ballerina class and these would take the name of the Java method. However, if there are overloaded methods, a numeric suffix will be appended at the end of the name.

E.g., some of the generated instance methods of the `java.util.ArrayDeque` class will be as follows.
```ballerina
class ArrayDeque {
   ...

   function add(Object arg0) returns boolean {
       ...
   }

   function isEmpty() returns boolean {
       ...
   }
};
```
Static methods would reside outside the Ballerina class as functions, which take the name of the Java method with the Java simple class name appended at the beginning as a prefix.

E.g., a generated static method `randomUUID()` of the `java.util.UUID` class will be as follows. Here, the Ballerina equivalent of calling `UUID.randomUUID()` in Java will be `UUID_randomUUID()`.
```ballerina
function UUID_randomUUID() returns UUID {
   ...
}
```

### Fields
All public fields of a Java class will be exposed through Ballerina bindings in the form of getters and setters. Instance fields will have the respective getter and setter methods inside the Ballerina class, whereas, the static fields will have getter and setter functions outside the Ballerina class.

The getter and setter functions of an instance field will take the name of the field prefixed with a `get` or `set` at the beginning.

E.g., `get<FIELD_NAME>()` and `set<FIELD_NAME>(<type> arg)`

For a static field, the getter and setter (if the field is not final) functions will take the name of the field with a `get` or `set` prefix along with the Java simple class name appended at the beginning.

E.g., `<Class_Name>_get<FIELD_NAME>()` and `<Class_Name>_set<FIELD_NAME>(<type> arg)`

### Java exceptions
When generating Ballerina bindings, Java exceptions will be mapped onto Ballerina errors. They will have identical names as that of the corresponding Java exceptions. Instead of returning a generic error from the Java side, the bindings will return a more meaningful error representing the exact Java exception.

E.g., the following `IOException` will be returned from the `read()` function in the `java.io.FileInputStream` Ballerina binding class.

```ballerina
function read() returns int|IOException {
    int|error externalObj = java_io_FileInputStream_read(self.jObj);
    if (externalObj is error) {
        IOException e = error IOException(IOEXCEPTION, externalObj, message = externalObj.message());
        return e;
    } else {
        return externalObj;
    }
}
```

>**Note:** If a Java exception class is explicitly generated as a Ballerina binding class, it would follow the naming convention `JException` or `JError`. For instance, the binding class's name for `java.io.FileNotFoundException` would be `JFileNotFoundException`.

### Dependent classes
When there are dependent Java classes present inside generated Ballerina bindings (as parameters or return types), the `bindgen` tool generates an empty Ballerina binding class to represent each one of these classes. This will represent a Java class mapping without the constructors, methods, or field bindings. If one of these classes is required later, the `bindgen` tool could be re-run to generate the complete implementation of the Ballerina bindings.

E.g., the generated dependent class representing `java.util.List` will be as follows.
```ballerina
distinct class List {

   *java:JObject;

   public handle jObj;

   function init(handle obj) {
       self.jObj = obj;
   }

   function toString() returns string {
       return java:toString(self.jObj) ?: "null";
   }
};
```

### Type mappings
Generated Ballerina bindings will support the following type mappings between Java and Ballerina.
- Ballerina primitive - Java primitive
- Ballerina string type - Java String class
- Ballerina binding class - Java class

The Ballerina binding classes will store a handle reference of the Java object using its `jObj` field.

The following table summarizes how Java primitive types are mapped to the corresponding Ballerina primitive types. This is applicable when mapping a return type of a Java method to a Ballerina type.

Java type | Ballerina type
---------- | --------------
boolean | boolean
byte | byte
int, short, char, long | int
float, double | float

## Support for Java subtyping
Ballerina bindings provide support for Java subtyping with the aid of type inclusions in the language.

E.g., a Ballerina binding class mapping the `java.io.FileInputStream` Java class could be assigned to a Ballerina binding class mapping the `java.io.InputStream` as follows.
```ballerina
InputStream inputStream = check newFileInputStream3("sample.txt");
```

## Support for Java casting
The `ballerina/jballerina.java` module of the Ballerina standard library provides the `cast` function to support Java casting. This could be used to cast Ballerina binding classes into their subtypes based on assignability.

E.g., a Ballerina binding class instance mapping the `java.io.InputStream` Java class `inputStream` could be cast onto a Ballerina binding class mapping the `java.io.FileInputStream` Java class as follows.
```ballerina
FileInputStream fileInputStream = check java:cast(inputStream);
```
