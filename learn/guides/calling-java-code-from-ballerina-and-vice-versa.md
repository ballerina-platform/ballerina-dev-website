---
layout: ballerina-calling-java-code-left-nav-pages-swanlake
title: Calling Java Code from Ballerina
description: See how Ballerina offers a straightforward way to call existing Java code from Ballerina.
keywords: ballerina, programming language, java api, interoperability
permalink: /learn/calling-java-code-from-ballerina/
active: calling-java-code-from-ballerina
intro: Ballerina offers a straightforward way to call the existing Java code from Ballerina. Although Ballerina is not designed to be a JVM language, the current implementation, which targets the JVM, aka jBallerina, provides Java interoperability by adhering to the Ballerina language semantics.
redirect_from:
  - /learn/how-to-use-java-interoperability
  - /learn/how-to-use-java-interoperability/
  - /learn/how-to-call-java-code-from-ballerina/
  - /learn/how-to-call-java-code-from-ballerina
  - /learn/calling-java-code-from-ballerina
  - /learn/calling-java-code-from-ballerina/
  - /swan-lake/learn/calling-java-code-from-ballerina/
  - /swan-lake/learn/calling-java-code-from-ballerina
  - /learn/user-guide/calling-java-code-from-ballerina
  - /learn/user-guide/calling-java-code-from-ballerina/
  - /learn/user-guide/interoperability/calling-java-code-from-ballerina
  - /learn/user-guide/interoperability/calling-java-code-from-ballerina/
  - /learn/user-guide/interoperability/
  - /learn/user-guide/interoperability
  - /learn/calling-java-code-from-ballerina-and-vice-versa
  - /learn/tooling-guide/cli-tools/bindgen-tool/
  - /learn/tooling-guide/cli-tools/bindgen-tool
  - /learn/cli-documentation/bindgen-tool/
  - /learn/cli-documentation/bindgen-tool
---

## Ballerina Bindings to Java Code
You can write Ballerina code (Ballerina bindings) that let you call the corresponding Java API as illustrated in the below diagram. 

<img src="/learn/images/interoperability-diagram-new.png" alt="Ballerina bindings to Java code" width="300" height="450">

The sections below explain how to generate those bindings automatically, while eliminating the need for understanding the Ballerina FFI layer.

## The Need to Call Java from Ballerina 

First, let's look at why you want to call Java from Ballerina. 

- Ballerina is a relatively new language. Therefore, you may experience a shortage of libraries in [Ballerina Central](https://central.ballerina.io/). In such situations, as a workaround, you can use an existing Java library.
- You are already familiar with a stable Java API that you would like to use in your Ballerina package.
- You want to take advantage of the strengths of Ballerina but you don’t want to reinvest in the libraries that you or your company have written already. 

There may be other reasons but these are great motivations to use Ballerina bindings. 

## Writing Ballerina Bindings
Writing Ballerina bindings manually is a tedious task. Therefore, we have introduced a CLI tool called `bindgen` to ease the process by generating Ballerina bindings for given Java APIs. The [first section](#using-the-snakeyaml-java-library-in-ballerina) of this guide shows you how to use it. The [second section](#the-bindgen-tool) is a reference guide to the tool.

The [third section](#packaging-java-libraries-with-ballerina-programs) explains how to package Java libraries (JAR files) with Ballerina programs. When you generate bindings for a Java library using the bindgen tool, this part is already handled. However, you could gain an in-depth understanding of how Java libraries and their transitive dependencies are packaged with Ballerina programs to produce self-contained executable programs.

## Using the SnakeYAML Java Library in Ballerina
SnakeYAML is a YAML parser for Java. In this section, we'll learn how to use this library to parse a YAML document using Ballerina. 

We'll develop a Ballerina program that parses the given YAML file and writes the content to the standard out.

Let's get started.

### Step 1 - Writing the Java Code
It is recommended to always start by writing the Java code. It gives you an idea of the set of Java classes required to implement your logic. Then, we can use the `bindgen` tool to generate Ballerina bindings for those classes. 

The Java code below uses the SnakeYAML API to parse the given YAML file. Note that this is not the most idiomatic way of writing the Java code for this scenario. 

```java
import org.yaml.snakeyaml.Yaml;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Map;

public class SnakeYamlSample {

    public static void main(String... a) {
	    String filename = a[0];
        try (InputStream inputStream = new FileInputStream(filename)) {
            Yaml yaml = new Yaml();
            Map<String, Object> obj = yaml.load(inputStream);
            System.out.println(obj);
        } catch (Exception e) {
            System.err.println("The file '" + filename + "' cannot be loaded. Reason: " + e.getMessage());;
        }
    }
}
```

Here, we've used four Java classes. 
- `org.yaml.snakeyaml.Yaml`
- `java.io.FileInputStream`
- `java.io.InputStream`
- `java.util.Map`

You can see them in the imported class list. We encourage you to generate Ballerina bindings for these four classes as a start.  

Now, we'll create an environment for our Ballerina program. 

### Step 2 - Setting Up the Ballerina Package

This section assumes that you have already read the [Package Layout](/learn/user-guide/ballerina-packages/) guide.

#### Creating a Ballerina Package
```sh
> bal new yaml_package
Created new Ballerina package 'yaml_package' at yaml_package.
```

#### Verifying the Package
```sh
> cd yaml_package
> bal build
Compiling source
	sameera/yaml_package:0.1.0

Generating executable
	target/bin/yaml_package.jar
```
```sh
> bal run target/bin/yaml_package.jar
Hello World!
```
Great! You are all set for the next step.

#### Adding a Sample YAML File 
Copy the below content to a file named `invoice.yml` in the package root directory.
```yaml
invoice: 34843
date   : 2001-01-23
bill-to: &id001
   given  : Chris
   family : Dumars
   address:
       lines: |
           458 Walkman Dr.
           Suite #292
       city    : Royal Oak
       state   : MI
       postal  : 48046
ship-to: *id001
product:
   - sku         : BL394D
     quantity    : 4
     description : Basketball
     price       : 450.00
   - sku         : BL4438H
     quantity    :
     description : Super Hoop
     price       : 2392.00
tax  : 251.42
total: 4443.52
comments: >
   Late afternoon is best.
   Backup contact is Nancy
   Billsmer @ 338-4338.\
```

### Step 3 - Generating the Ballerina Bindings 
In this step, we'll use the `bindgen` tool to generate Ballerina bindings for those four classes that we talked about in Step 1. If you want more information about the tool, you can refer [The `bindgen` tool](#the-bindgen-tool) section.

```sh
> bal bindgen -mvn org.yaml:snakeyaml:1.25 org.yaml.snakeyaml.Yaml java.io.FileInputStream java.io.InputStream java.util.Map

Ballerina package detected at: /Users/sameera/yaml_package

Resolving maven dependencies...
snakeyaml-1.25.jar 100% [===============================================] 297/297 KB (0:00:01 / 0:00:00)

Updated the `Ballerina.toml` file with the new platform libraries.

The following JARs were added to the classpath:
	snakeyaml-1.25.jar

Generating bindings for:
	java.util.Map
	java.io.FileInputStream
	org.yaml.snakeyaml.Yaml
	java.io.InputStream

Generating dependency bindings for:
	org.yaml.snakeyaml.introspector.BeanAccess
	java.util.function.BiFunction
	org.yaml.snakeyaml.DumperOptions$FlowStyle
	...
	...
```

- The `-mvn` option specifies the Maven dependency of the Java library required to generate bindings.
- The argument list specifies the Java class names. 

The `bindgen` tool generates bindings for:
- The specified Java classes.
- The Java classes exposed in the public APIs of all the specified classes.


Before we move onto the next step, let’s verify the generated code. 
```sh
> bal build
... 
...

Generating executable
	target/bin/yaml_package.jar

> bal run target/bin/yaml_package.jar
Hello World!
```

### Step 4 - Writing the Ballerina Code
Now, we’ll use the generated bindings and write the Ballerina code, which uses the SnakeYAML library. Here is the Java code. Let’s develop the corresponding Ballerina code step by step. 
```java
public class SnakeYamlSample {

    public static void main(String... a) {
        String filename = a[0];
        try (InputStream inputStream = new FileInputStream(filename)) {
            Yaml yaml = new Yaml();
            Map<String, Object> obj = yaml.load(inputStream);
            System.out.println(obj);
        } catch (Exception e) {
            System.err.println("The file '" + filename + "' cannot be loaded. Reason: " + e.getMessage());;
        }
    }
}
```

#### Creating the `FileInputStream`
Our goal here is to create a new `java.io.FileInputStream` instance from the filename. In Step 3, we generated bindings for the required Java classes. The following is the code snippet that does the job.

```ballerina
javaio:FileInputStream | javaio:FileNotFoundException fileInputStream = javaio:newFileInputStream3(filename);
```

Here, `FileInputStream` is the Ballerina class generated for the `java.io.FileInputStream` class.
- Ballerina bindings for each Java package are mapped onto a separate Ballerina module by default. Therefore, you need to import them when using them inside other modules. Here the `java.io` Ballerina module (mapping the corresponding Java package) is imported as `javaio`. However, if you wish to generate all the bindings inside a single directory you can do so by using the `[(-o|--output) <output-path>]` command option.
- You can find functions that start with `newFileInputStream` in the generated code. Each such function creates a new `java.io.FileInputStream` instance. Ballerina does not support function overloading. Therefore, the bindgen tool generates a separate Ballerina function for each overloaded method or constructor. We will improve the function names of the generated bindings in a future release. 
- All the public instance methods in the `java.io.FileInputStream` class are mapped to methods in the generated Ballerina class. You can refer [the `bindgen` tool](#the-bindgen-tool) section for more details on how other Java class members are mapped into Ballerina bindings.

Next, we’ll handle the error using a type guard.
```ballerina
if fileInputStream is javaio:FileNotFoundException {
	// The type of fileInputStream is FileNotFoundException within this block
    io:println("The file '" + filename + "' cannot be loaded. Reason: " + fileInputStream.message());
} else {
	// The type of fileInputStream is FileInputStream within this block
}
```
#### Creating the SnakeYAML Entry Point
The `org.yaml.snakeyaml.Yaml` class is the entry point to the SnakeYAML API. The generated corresponding Ballerina class is `Yaml`. The `newYaml1()` function is mapped to the default constructor of the Java class. Let's import the `org.yaml.snakeyaml` Ballerina module as `snakeyaml`.
```ballerina
snakeyaml:Yaml yaml = snakeyaml:newYaml1();
```
####  Loading the YAML Document
We'll be using the `org.yaml.snakeyaml.Yaml.load(InputStream is)` method to get a Java Map instance from the given `InputStream`. Since, the `Object` Ballerina class (the mapping of `java.lang.Object` class) resides inside the `java.lang` module, let's import it as `javalang`.

Notice how even though we didn't explicitly generate the `java.lang.Object` class, it has been generated automatically since it is exposed through the public APIs of generated classes.

```ballerina
javalang:Object mapObj = yaml.load(fileInputStream);
```

The `org.yaml.snakeyaml.Yaml.load(InputStream is)` is a generic method. The bindgen tool does not support Java generics at the moment. That is why the corresponding Ballerina method returns an Object.  

####  Printing the Returned Map Instance
You can print the content of the Map instance in the standard out as follows. 
```ballerina
io:println(mapObj);
```
#### Completing the Code 
Here, is the complete code. You can replace the contents in `main.bal` with the following code.
```ballerina
import ballerina/io;
import yaml_package.java.io as javaio;
import yaml_package.java.lang as javalang;
import yaml_package.org.yaml.snakeyaml as snakeyaml;
 
public function main(string... args) returns error? {
   string filename = args[0];
   javaio:FileInputStream | javaio:FileNotFoundException fileInputStream = javaio:newFileInputStream3(filename);
   if fileInputStream is javaio:FileNotFoundException {
       io:println("The file '" + filename + "' cannot be loaded. Reason: " + fileInputStream.message());
   } else {
       snakeyaml:Yaml yaml = snakeyaml:newYaml1();
       javalang:Object mapObj = yaml.load(fileInputStream);
       io:println(mapObj);
   }
}
```

Let's build and run this code. 
```sh
> bal build
Compiling source
	sameera/yaml_package:0.1.0

Generating executable
	target/bin/yaml_package.jar
```

Now, we need to pass the YAML file name as the first argument. 
```sh
> bal run target/bin/yaml_package.jar invoice.yml
{invoice=34843, date=Mon Jan 22 16:00:00 PST 2001, bill-to={given=Chris, family=Dumars, address={lines=458 Walkman Dr.
Suite #292
, city=Royal Oak, state=MI, postal=48046}}, ship-to={given=Chris, family=Dumars, address={lines=458 Walkman Dr.
Suite #292
, city=Royal Oak, state=MI, postal=48046}}, product=[{sku=BL394D, quantity=4, description=Basketball, price=450.0}, {sku=BL4438H, quantity=null, description=Super Hoop, price=2392.0}], tax=251.42, total=4443.52, comments=Late afternoon is best. Backup contact is Nancy Billsmer @ 338-4338.\}
```
In this section, we explained how to use the `bindgen` tool to generate Ballerina bindings for Java classes and how to use those generated ones. 

The next sections provide more details on various aspects related to Java interoperability in Ballerina. 

## The `bindgen` Tool

The following subsections explain how the `bindgen` tool works.

- [The `bindgen` Command](#the-bindgen-command)
- [Generated Bridge Code](#generated-bridge-code)
- [Java to Ballerina Mapping](#java-to-ballerina-mapping)
    - [Java Classes](#java-classes)
    - [Constructors](#constructors)
    - [Methods](#methods)
    - [Fields](#fields)
    - [Java Exceptions](#java-exceptions)
    - [Dependent Classes](#dependent-classes)
    - [Type Mappings](#type-mappings)
- [Support for Java Subtyping](#support-for-java-subtyping)
- [Support for Java Casting](#support-for-java-casting)

The `bindgen` is a CLI tool, which generates Ballerina bindings for Java classes.

### The `bindgen` Command

```sh
ballerina bindgen [(-cp|--classpath) <classpath>...]
                  [(-mvn|--maven) <groupId>:<artifactId>:<version>]
                  [(-o|--output) <output-path>]
                  [--public]
                  (<class-name>...)
```

`(-cp|--classpath) <classpath>...`
This optional parameter could be used to specify one or more comma-delimited classpaths for retrieving the required Java libraries needed by the bindgen tool execution. The classpath could be provided as comma-separated paths of JAR files or as comma-separated paths of directories containing all the relevant Java libraries. If the Ballerina bindings are to be generated from a standard Java library, from a library available inside the Ballerina SDK, or from a platform library specified in the `Ballerina.toml`, then you need not specify the classpath explicitly.

`(-mvn|--maven) <groupId>:<artifactId>:<version>`
This optional parameter could be used to specify a Maven dependency required for the generation of the Ballerina bindings. Here, the specified library and its transitive dependencies will be resolved into the `target/platform-libs` directory of the package. If the tool is not executed inside a package or if the output path does not point to a package, the `target/platform-libs` directory structure will be created in the output path to store the Maven dependencies. The tool will also update the `Ballerina.toml` file with the platform libraries if the command is executed inside a Ballerina package.

`(-o|--output) <output>`
This optional parameter could be used to generate all the bindings inside a single directory instead of generating module level mappings. This option could be used in instances where all the mappings are required inside a single module. The specified directory doesn't always have to be inside a Ballerina package.

`--public`
Set the visibility modifier of the generated binding classes to public. This flag will be applicable only if the bindings are generated inside a single directory.

`<class-name>...`
One or more space-separated fully-qualified Java class names for which the Ballerina bridge code is to be generated. Please note that these class names should be provided at the end of the command.

### Generated Bridge Code

When the tool is run, a `.bal` file will be created to represent each Java class. This would contain the respective Ballerina binding class along with the required Java interoperability mappings. These `.bal` files will be generated inside separate modules representing the Java package structure by default. If the `[(-o|--output) <output-path>]` option is used, they will be generated inside a single directory.

Apart from creating bindings for the specified Java classes, the command will also generate empty Ballerina binding classes for the dependent Java classes. A Java class would be considered dependent if it is used inside one of the generated Ballerina binding classes.

A set of additional `.bal` files will be generated to store the error types used within the Ballerina binding classes.

The generated bindings will be inside the specified output directory as follows.

	<module-dir>
	    ├── <class-name>.bal // generated classes
        ├── ...
	    ├── <class-name>.bal // generated dependent classes
	    ├── ...
	    ├── <class-name>.bal // generated error types
	    └── ...

### Java to Ballerina Mapping

#### Java Classes
A Java class will be mapped to a Ballerina class. This Ballerina class will have the same name as the Java class.

E.g., The generated Ballerina class of the `java.util.ArrayDeque` class will be as follows.
```ballerina
@java:Binding {
    'class: "java.util.ArrayDeque"
}
distinct class ArrayDeque {

    *java:JObject;

    public handle jObj;

    function init(handle obj) {
        self.jObj = obj;
    }

    ...
};
```
If there are multiple classes with the same simple name, they need to be generated using a single execution. The tool will then apply a numerical identifier at the end of duplicated class names. This could be manually changed into something meaningful if required.

The format for specifying inner classes using the command is `<package-name>.ClassName$InnerClassName`. The dollar sign might have to be escaped using the backslash key.

E.g., The command to generate bindings for `java.lang.Character.Subset` class will be as follows.
```sh
> bal bindgen java.lang.Character\$Subset
```

When referring a Java code to figure out the imported classes, you should be cautious about the Java classes from the `java.lang` package since these will not be visible as imports in the Java code. However, you need not generate bindings for the `java.lang.String` class since it is mapped into the Ballerina `string` type from within the Ballerina bindings generated.

#### Constructors
Constructors of Java classes will be mapped to functions outside the Ballerina class. These function names are comprised of the constructor name prefixed with the `new` keyword. If there are multiple constructors, they will be suffixed with an auto-incremented number.

E.g., Generated constructors of the `java.util.ArrayDeque` class will be as follows.
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

#### Methods
All public methods will be exposed through Ballerina bindings. Instance methods will reside inside the Ballerina class and these would take the name of the Java method. However, if there are overloaded methods, a numeric suffix will be appended at the end of the name.

E.g., Some of the generated instance methods of the `java.util.ArrayDeque` class will be as follows.
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
 
E.g., A generated static method `randomUUID()` of the `java.util.UUID` class will be as follows. Here, the Ballerina equivalent of calling `UUID.randomUUID()` in Java will be `UUID_randomUUID()`.
```ballerina
function UUID_randomUUID() returns UUID {
   ...
}
```

#### Fields
All public fields of a Java class will be exposed through Ballerina bindings in the form of getters and setters. Instance fields will have the respective getter and setter methods inside the Ballerina class, whereas the static fields will have getter and setter functions outside the Ballerina class.

The getter and setter functions of an instance field will take the name of the field prefixed with a `get` or `set` at the beginning.

E.g., `get<FIELD_NAME>()` and `set<FIELD_NAME>(<type> arg)`

For a static field, the getter and setter (if the field is not final) functions will take the name of the field with a `get` or `set` prefix along with the Java simple class name appended at the beginning.

E.g., `<Class_Name>_get<FIELD_NAME>()` and `<Class_Name>_set<FIELD_NAME>(<type> arg)`

#### Java Exceptions
When generating Ballerina bindings, Java exceptions will be mapped onto Ballerina errors. They will have identical names as that of the corresponding Java exceptions. Instead of returning a generic error from the Java side, the bindings will return a more meaningful error representing the exact Java exception.

E.g., The following `IOException` will be returned from the `read()` function in the `java.io.FileInputStream` Ballerina binding class.

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

>**Note:** If a Java exception class is explicitly generated as a Ballerina binding class, it would follow the naming convention `JException` or `JError`. For instance, the binding class's name for `java.io.FileNotFoundException` would be as `JFileNotFoundException`.

#### Dependent Classes
When there are dependent Java classes present inside generated Ballerina bindings (as parameters or return types), the bindgen tool generates an empty Ballerina binding class to represent each one of these classes. This will represent a Java class mapping without the constructors, methods, or field bindings. If one of these classes is required later, the bindgen tool could be re-run to generate the complete implementation of the Ballerina bindings.

E.g., The generated dependent class representing `java.util.List` will be as follows.
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

#### Type Mappings
Generated Ballerina bindings will support the following type mappings between Java and Ballerina.
- Ballerina primitive - Java primitive
- Ballerina string type - Java String class
- Ballerina binding class - Java class

The Ballerina binding classes will store a handle reference of the Java object using its `jObj` field.

The following table summarizes how Java primitive types are mapped to corresponding Ballerina primitive types. This is applicable when mapping a return type of a Java method to a Ballerina type.

Java Type | Ballerina Type
---------- | --------------
boolean | boolean
byte | byte
int, short, char, long | int
float, double | float

### Support for Java Subtyping
Ballerina bindings provide support for Java subtyping with the aid of type inclusions in the language.

E.g., A Ballerina binding class mapping the `java.io.FileInputStream` Java class could be assigned to a Ballerina binding class mapping the `java.io.InputStream` as follows.
```ballerina
InputStream inputStream = check newFileInputStream3("sample.txt");
```

### Support for Java Casting
The `ballerina/jballerina.java` module of the Ballerina standard library provides the `cast` function to support Java casting. This could be used to cast Ballerina binding classes into their subtypes based on assignability.

E.g., A Ballerina binding class instance mapping the `java.io.InputStream` Java class `inputStream` could be casted onto a Ballerina binding class mapping the `java.io.FileInputStream` Java class as follows.
```ballerina
FileInputStream fileInputStream = check java:cast(inputStream);
```

## Packaging Java Libraries with Ballerina Programs
>**Note:** This section is required only if you need an in-depth understanding of how Java libraries are packaged with Ballerina programs. By default, the bindgen tool handles this part on its own.

This section assumes that you have already read the [Package Layout](/learn/organizing-ballerina-code/package-layout/) guide.
 
When you compile a Ballerina package with `bal build`, the compiler creates an executable JAR file. However, if the package does not contain an entry point, it will produce a non-executable JAR file (a library package), which can be used in another package/program. In both cases, the Ballerina compiler produces self-contained archives. There are situations in which you need to package JAR files with these archives. The most common example would be packing the corresponding JDBC driver.

How you package JAR files with compiled archives is the same in both Ballerina executable packages and Ballerina library packages. Therefore, a sample Ballerina package, which produces an executable is used here.

Here, is a Ballerina package layout of a microservice called "order management". The default module contains a RESTFul service, which exposes resource functions to create, retrieve, update, and cancel orders. The `dbutils` module offers utility functions, which use a MySQL database to store orders.

```
ordermgt_service/
├── Ballerina.toml
├── main.bal
└── javalibs/
    └── mysql-connector-java-<version>.jar
└── modules/
    └── dbutils/
```    
    
The Java MySQL connector is placed inside the `javalibs` directory. You are free to store the JAR files anywhere in your file system. This example places those JAR files inside the package directory. As a best practice, maintain Java libraries inside the package.
The `Ballerina.toml` file, which marks a directory as a Ballerina package lives at the root of the package. It is also a manifest file that contains package information, and platform-specific library information. Java libraries are considered as platform-specific libraries.
Here, is how you can specify a JAR file dependency in the `Ballerina.toml` file.

```toml
[[platform.java11.dependency]] 
# Absolute or relative path to the JAR file
path = "<path-to-jar-file-1>" 
# An optional comma-separated list of Ballerina module names (to restrict the usage of this JAR)
modules = ["<ballerina-module-1>"]

[[platform.java11.dependency]] 
path = "<path-to-jar-file-2>" 
modules = ["<ballerina-module-1>","<ballerina-module-2>"]
```

Alternatively, you can also specify Maven dependencies as platform-specific libraries. These dependencies specified would then get resolved into the `target/platform-libs` directory when building the package. You can specify a Maven dependency in the `Ballerina.toml` file as shown below.

```toml
[[platform.java11.dependency]]
# An optional comma-separated list of Ballerina module names (to restrict the usage of this JAR)
modules = ["<ballerina-module-1>"]
# Group ID of the Maven dependency
groupId = "<group-id>"
# Artifact ID of the Maven dependency
artifactId = "<artifact-id>"
# Version of the Maven dependency
version = "<version>"

[[platform.java11.dependency]]
modules = ["<ballerina-module-1>","<ballerina-module-2>"]
groupId = "<group-id>"
artifactId = "<artifact-id>"
version = "<version>"
```

If you wish to use a custom Maven repository, you can specify it in the `Ballerina.toml` file as shown below.
```toml
[[platform.java11.repository]]
id = "<maven-repository-id>"
url = "<maven-repository-url>"
username = "<maven-repository-username>"
password = "<maven-repository-password>"
```

Now, let’s look at the contents of the `Ballerina.toml` file in this package.
```toml
[[platform.java11.dependency]] 
path = "./javalibs/mysql-connector-java-<version>.jar"
```

Or, if you are adding it as a Maven dependency, it would take the following form.
```toml
[[platform.java11.dependency]]
groupId = "mysql"
artifactId = "mysql-connector-java"
version = "<version>"
```

If your package has only the default root module, then you can attach all the JAR file dependencies to your default root module as the best practice.

If your package is a Ballerina library package, then you should specify the JAR file dependencies in each Ballerina module if that module depends on the JAR file.

Now, use `ballerina build` to build an executable JAR. This command packages all JARs specified in your `Ballerina.toml` with the executable JAR file.
