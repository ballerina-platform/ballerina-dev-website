---
layout: ballerina-left-nav-pages
title: How to Extend Ballerina
description: Learn how to extend Ballerina using annotations, which can be used to provide structured metadata about a particular construct.
keywords: ballerina, programming language, annotations, metadata, extend ballerina
permalink: /learn/how-to-extend-ballerina/
active: how-to-extend-ballerina
redirect_from:
  - /learn/how-to-extend-ballerina
  - /v1-2/learn/how-to-extend-ballerina
  - /v1-2/learn/how-to-extend-ballerina/
---

# How to Extend Ballerina

Annotations can be used to provide structured metadata about a particular construct. Annotations are not executable. However, they can be used to alter the behavior of constructs they are attached to.

Annotations can be attached to:
- services and resources
- type definitions
- function definitions
- function parameters
- function return
- module-level variables and constants
- annotations
- listeners
- workers
- type cast expressions

The Ballerina compiler can be extended using compiler extensions (if required) for additional verification or processing (e.g. modifications, artifact generation etc.). Such custom extensions provided will be executed at the end of the compilation phase before generating the Ballerina Intermediate Representation (BIR). A compiler extension can make use of the metadata provided via annotations to introduce additional behavior to the compilation process. 

The `ballerina/docker` and `ballerina/kubernetes` modules make use of custom annotations. They introduce new annotations such as `@docker:Config` and `@kubernetes:Deployment` that can be attached to certain constructs in a Ballerina source file. The respective compiler extensions then run a post-compilation process that reads these annotations and generates the Docker and Kubernetes deployment artifacts.

> **Note:** Currently, there are two caveats when writing compiler extensions:
> 1. The Ballerina Compiler is written in Java 8. Therefore, you will need JDK 1.8.
> 2. End users will have to install the extension manually.

## Hello World: The Annotation Way

In this guide, we will take a look at how to create a custom annotation and how to write a compiler extension to read and act upon our custom annotation. The custom annotation (i.e. `@hello:Greeting`) is attachable to functions. It has an attribute called `salutation`, which will be read by the compiler extension and written to a file when building the program. The annotation can be shared with others by publishing it to [Ballerina Central](https://central.ballerina.io/). Currently, there isn’t a mechanism for sharing compiler extensions. The compiler extension has to be copied to the `<BALLERINA_HOME>/bre/lib` directory.

The end user would be able to write a program such as the following:

```ballerina
import foo/hello;

@hello:Greeting {
    salutation: "Guten Tag!"
}
function add(int x, int y) returns int {
    return x + y;
}

public function main() {
    var sum = add(10, 20);
}
```

At the end of the build, the user should be able to see a `<module_name>.txt` file in the `target/greetings/` directory.

## Defining a Custom Annotation

### Creating the Annotation
Create a new Ballerina project and add a module named `hello`. For this instance, add a single source file named `annotation.bal` and remove other boilerplate code and files. Your project structure should look similar to the following:
```
.
├── Ballerina.toml
└── src
    └── hello
        └── annotation.bal
```

Add the following code to define the `@hello:Greeting` annotation in the `annotation.bal` file.

```ballerina
# This record defines the fields of the @hello:Greeting annotation. 
#
# + salutation - The greeting message
public type HelloConfiguration record {|
    string salutation = "Hello!";
|};

# Define an annotation named `Greeting`. Its type is `HelloConfiguration` and it can be
# attached to functions. 
public annotation HelloConfiguration Greeting on function;
```

Now, build this annotation. The `-c` flag is used since this module will only be used as a library.
```
$ ballerina build -c hello
```

If all went well, a `/target` directory should be created with the built artifacts.
```
target/
├── balo
│   └── hello-2019r3-any-0.1.0.balo
├── caches
│   ├── bir_cache
│   │   └── foo
│   │       └── hello
│   │           └── 0.1.0
│   │               └── hello.bir
│   └── jar_cache
│       └── foo
│           └── hello
│               └── 0.1.0
│                   └── foo-hello-0.1.0.jar
└── tmp
    └── foo-hello-0.1.0.jar
```

### Verifying the Annotation

At this stage, you can use the annotation in a program to verify the correctness of what was done so far. To do so, create a demo project, add our `hello` module as a dependency, and attach it to a function. Your program should compile without any errors.

The demo project structure looks like the following:
```
.
├── Ballerina.toml
└── src
    └── greet
        └── greeting.bal
```

Add the `foo/hello` module as a path dependency in the `Ballerina.toml` file.

```toml
[project]
org-name = "bar"
version = "0.1.0"

[dependencies]
"foo/hello" = { path = "<path_to_annotation_project_dir>/hello-annot/target/balo/hello-2019r3-any-0.1.0.balo" }
```

Add a function to the `greeting.bal` file. Note that the function is annotated using the `@hello:Greeting` annotation. 

```ballerina
import foo/hello;

@hello:Greeting {
    salutation: "Guten Tag!"
}
function add(int x, int y) returns int {
    return x + y;
}

public function main() {
    var sum = add(10, 20);
}
```

Building the `greet` module should produce an executable named `greet.jar` in the `target/bin` directory.
 
## Writing the Compiler Extension

The Ballerina compiler can be extended through compiler extensions if there are additional verifications or tasks you would like to perform. Such custom extensions will be executed towards the end of the compilation phase. A compiler extension can be created by implementing the `CompilerPlugin` interface provided by the `org.ballerinalang.compiler.plugins` package. It defines the following methods, which the user can implement to add additional verifications. 
- `void process(PackageNode packageNode)`
- `void process(BLangTestablePackage testablePackageNode)`
- `void process(ServiceNode serviceNode, List<AnnotationAttachmentNode> annotations)`
- `void process(TypeDefinition typeDefinition, List<AnnotationAttachmentNode> annotations)`
- `void process(FunctionNode functionNode, List<AnnotationAttachmentNode> annotations)`
- `void process(SimpleVariableNode variableNode, List<AnnotationAttachmentNode> annotations)`
- `void process(AnnotationNode annotationNode, List<AnnotationAttachmentNode> annotations)`
- `void codeGenerated(PackageID packageID, Path binaryPath)`

Each of the `process()` methods correspond to annotable constructs of the language. The `codegenerated()` method gets invoked once the code generation phase is completed. The `org.ballerinalang.compiler.plugins` package also provides a convenience class named `AbstractCompilerPlugin` with empty implementations for the above methods.

The extension will read the salutation field of the `@hello:Greeting` annotation and write its value to a file in the `/target` directory. 

### Setting up the Project

Start by creating a Java project for the extension. It needs two classes: `HelloPlugin` and `HelloModel`. Also, create a resource file named `org.ballerinalang.compiler.plugins.CompilerPlugin` in the `resources/META-INF/services` directory. This file should contain the fully-qualified class name of the extension class (which in this case, is `xyz.foo.hello.HelloPlugin`).
```
src/
└── main
    ├── java
    │   └── xyz
    │       └── foo
    │           └── hello
    │               ├── HelloModel.java
    │               └── HelloPlugin.java
    └── resources
        └── META-INF
            └── services
                └── org.ballerinalang.compiler.plugins.CompilerPlugin
```

The only dependency you will need for this extension is the `ballerina-lang` project. Add the following Maven repository 
to your project to get the `ballerina-lang` dependency.
> http://maven.wso2.org/nexus/content/repositories/releases/

Given below is a sample `build.gradle` file for the project.

```gradle
plugins {
    id 'java'
}

group 'xyz.foo'
version '1.0-SNAPSHOT'

sourceCompatibility = 1.8

repositories {
    maven {
        url "http://maven.wso2.org/nexus/content/repositories/releases/"
    }
}

dependencies {
    implementation group: 'org.ballerinalang', name: 'ballerina-lang', version: '1.0.0'
}
```

### Adding the Code for the Extension

Add the following code to the `HelloPlugin.java` file.

```java
import org.ballerinalang.compiler.plugins.AbstractCompilerPlugin;
import org.ballerinalang.compiler.plugins.SupportedAnnotationPackages;
import org.ballerinalang.model.elements.PackageID;
import org.ballerinalang.model.tree.AnnotationAttachmentNode;
import org.ballerinalang.model.tree.FunctionNode;
import org.ballerinalang.util.diagnostic.Diagnostic;
import org.ballerinalang.util.diagnostic.DiagnosticLog;
import org.wso2.ballerinalang.compiler.tree.BLangAnnotationAttachment;
import org.wso2.ballerinalang.compiler.tree.expressions.BLangLiteral;
import org.wso2.ballerinalang.compiler.tree.expressions.BLangRecordLiteral;
import org.wso2.ballerinalang.compiler.tree.expressions.BLangRecordLiteral.BLangRecordKeyValue;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

/**
 * Compiler extension to generate greetings.
 */
// This annotation specifies that this compiler extension should only be enabled when the mentioned module is used.
@SupportedAnnotationPackages(
        value = "foo/hello:0.1.0"
)
public class HelloPlugin extends AbstractCompilerPlugin {

    private DiagnosticLog dlog;

    @Override
    public void init(DiagnosticLog diagnosticLog) {
        this.dlog = diagnosticLog;
    }

    // The annotation is attached to functions. Therefore, the process() method is overridden for functions.
    @Override
    public void process(FunctionNode functionNode, List<AnnotationAttachmentNode> annotations) {
        // Iterate through the annotations attached to the service.
        for (AnnotationAttachmentNode annotation : annotations) {
            // The `annotations` list contains all the annotations attached to the service.
            // Since only the `@hello:Greeting` annotation is considered, skip the other annotations.
            if (!"Greeting".equals(annotation.getAnnotationName().getValue())) {
                continue;
            }

            // Retrieve the fields of the annotation value.
            List<BLangRecordKeyValue> annotFields =
                    ((BLangRecordLiteral) ((BLangAnnotationAttachment) annotation).expr).getKeyValuePairs();

            // In this particular case, there is no need to iterate through the list since the `@hello:Greeting` annotation only has
            // one field. Therefore, take the first element of the fields list.
            BLangRecordKeyValue salutationField = annotFields.get(0);
            String annotFieldValue = ((BLangLiteral) salutationField.getValue()).getValue().toString();
            String greeting = String.format("%s from %s()\n", annotFieldValue, functionNode.getName().getValue());
            HelloModel.getInstance().setGreeting(greeting);
        }
    }

    // The `codeGenerated()` method gets invoked once the executable is built. The greeting is written to a text file
    // with the same name as the executable and in the same directory as the executable.
    @Override
    public void codeGenerated(PackageID packageID, Path binaryPath) {
        String fileName = binaryPath.getFileName().toString().replace(".jar", ".txt");
        Path greetingsPath = Paths.get("target", "greetings", fileName);
        String greeting = HelloModel.getInstance().getGreetings();
        try {
            System.out.println("\nGenerating greetings");
            System.out.println("\t" + greetingsPath.toString());
            writeToFile(greeting, greetingsPath);
        } catch (IOException e) {
            dlog.logDiagnostic(Diagnostic.Kind.ERROR, null, e.getMessage());
        }
    }

    private void writeToFile(String greetings, Path targetFilePath) throws IOException {
        File newFile = targetFilePath.toFile();

        if (newFile.exists()) {
            Files.write(targetFilePath, greetings.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
            return;
        }

        if (newFile.getParentFile().mkdirs()) {
            Files.write(targetFilePath, greetings.getBytes(StandardCharsets.UTF_8));
            return;
        }
        Files.write(targetFilePath, greetings.getBytes(StandardCharsets.UTF_8));
    }
}
```

Add the following code to the `HelloModel.java` file. 

```java
class HelloModel {

    private static HelloModel instance = new HelloModel();
    private String greeting;

    private HelloModel() {
    }

    static HelloModel getInstance() {
        return instance;
    }

    String getGreetings() {
        return greeting;
    }

    void setGreeting(String greeting) {
        this.greeting = greeting;
    }
}
```

Finally, build the extension and place the resulting JAR file inside the `<BALLERINA_HOME>/distributions/jballerina-<BALLERINA_VERSION>/bre/lib/` directory. 

## Putting It All Together

Now, build your hello world project again. You should see an additional step logged in the console for generating the greeting.

```
$ ballerina build greet
Compiling source
	bar/greet:0.1.0

Creating balos
	target/balo/greet-2019r3-any-0.1.0.balo

Running tests
	bar/greet:0.1.0
	No tests found

Generating executables
	target/bin/greet.jar

Generating greetings
	target/greetings/greet.txt
```

The `target/greetings/greet.txt` file should contain the following text: `Guten Tag! from add()`

## Learning More About Writing Compiler Extensions

The example considered in this how-to guide is a basic compiler extension. If you are looking for something which goes beyond this, take a look at the compiler extensions written for generating Docker and Kubernetes artifacts.
