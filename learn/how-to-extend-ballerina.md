---
layout: ballerina-inner-page
title: How to Extend Ballerina
---

# How to Extend Ballerina

Developers and third parties can extend the behavior of Ballerina and collate the customizations for use by others. There are three ways to customize the behavior of Ballerina:

1. Collate and distribute new client connectors to third party endpoints, such as databases, infrastructure and APIs.

2. Add new annotations to Ballerina source files so that the compiler can act to alter binaries and generate artifacts.

3. Collate and distribute new webhook callback services, that programmatically subscribe to accept content-delivery requests on the occurrence of particular events.

## Create Client Connectors

A client connector is instantiated by developers when they create an `endpoint` object within their code. You can create your own connectors that are part of Ballerina modules that you push into a Ballerina registry, such as what is available at Ballerina Central.

To create a client connector, you:

1. Create a Ballerina module in a Ballerina project.

2. Create a `client` object representing the connector.

3. Implement `public` `remote` functions to represent actions performed on remote endpoints.

4. Build the module and push it into a registry for others to use it.

### The Twilio Connector

You can see the source code for this example at:

1. [Single file](https://github.com/wso2-ballerina/package-twilio/blob/master/guide/twilio_sample.bal) version (easier for reading).

2. [Multiple files](https://github.com/wso2-ballerina/package-twilio/tree/master/twilio) version (split across files following good project structure).

WSO2 has created a connector for Twilio and pushed it into Ballerina Central as `wso2/twilio`. You can find this connector on the command line:

```bash
ballerina search twilio
```

The Twilio connector reuses the HTTP client connector and adds some additional properties in order to create a programmable connection with a Twilio endpoint. A simple Ballerina program that would use this connector might be the following:

```ballerina
import ballerina/http;
import wso2/twilio;

public function main(string... args) {
    twilio:Client twilioClient = new({
        accountSId: "",
        authToken: ""
    });

    twilio:Account account = check twilioClient->getAccountDetails();
    io:println(account);
}
```

In this example, a `TwilioClient` object is instantiated. Instantiating the client requires a `TwilioConfiguration` record to provide the authentication details.

The Twilio connector defines a remote function `getAccountDetails()`, which is called by the end user to interact with the endpoint. 

You need to implement the `TwilioClient.__init()` method, which will be called when the endpoint is instantiated. This method establishes the connection to Twilio.

### The Twilio:Client Object

The connector is a data structure that is represented by a `client` object.

```ballerina
public type Client client object {

    public string accountSId;
    public string xAuthyKey;
    public http:Client basicClient;
    public http:Client authyClient;

    public function __init(TwilioConfiguration twilioConfig) {
        self.init(twilioConfig);
        self.basicClient = new(TWILIO_API_BASE_URL, config = twilioConfig.basicClientConfig);
        self.authyClient = new(AUTHY_API_BASE_URL, config = twilioConfig.authyClientConfig);
        self.accountSId = twilioConfig.accountSId;
        self.xAuthyKey = twilioConfig.xAuthyKey;
    }
    
    ...
```

A `client` object is similar to an ordinary object. However, unlike in ordinary objects in `client` objects, the actions are performed on a remote network endpoint. Hence, the 'remote' keyword should be used in the method signature.

Similar to other objects, `client` objects take their configurations parameters such as API keys as the values of the `constructor` parameter.

```ballerina

// Constant
final string BASE_URL = "https://api.twilio.com/2010-04-01";

public type Client client object {

    public string accountSId;
    public string xAuthyKey;
    public http:Client basicClient;
    public http:Client authyClient;

    public function __init(TwilioConfiguration twilioConfig) {
        self.init(twilioConfig);
        self.basicClient = new(TWILIO_API_BASE_URL, config = twilioConfig.basicClientConfig);
        self.authyClient = new(AUTHY_API_BASE_URL, config = twilioConfig.authyClientConfig);
        self.accountSId = twilioConfig.accountSId;
        self.xAuthyKey = twilioConfig.xAuthyKey;
    }

    # Initialize the Twilio endpoint.
    # + twilioConfig - The Twilio configuration

    public function init(TwilioConfiguration twilioConfig);

    ..
}

public function Client.init(TwilioConfiguration twilioConfig) {
    http:AuthConfig authConfig = {
        scheme: http:BASIC_AUTH,
        username: twilioConfig.accountSId,
        password: twilioConfig.authToken
    };
    twilioConfig.basicClientConfig.auth = authConfig;
}

```

### Implement Remote Functions For Endpoint Interaction

When you want to expose custom actions for your end users to use against the connector, define them in the `Twilio:Client` object as remote functions.

In our example, we added a `getAccountDetails()` function that can be invoked as part of the endpoint by the end user:

```ballerina
// Account is a custom object that represents Twilio data return values.
// The -> represents making a non-blocking worker call over the network
// twilioClient is the end user's endpoint that uses the Twilio:Client connector
// getAccountDetails() is our custom function
Twilio:Account account = check twilioClient->getAccountDetails();
```

And within the module that includes your custom connector, we have these additional items that define the custom function:

```ballerina
// Constants
final string TWILIO_ACCOUNTS_API = "/Accounts";

public remote function Client.getAccountDetails() returns Account|error {
    string requestPath = TWILIO_ACCOUNTS_API + FORWARD_SLASH + self.accountSId + ACCOUNT_DETAILS;
    var response = self.basicClient->get(requestPath);
    json jsonResponse = check parseResponseToJson(response);
    return mapJsonToAccount(jsonResponse);
}
```

The `Account` record is defined in the `twilio_types.bal` file:

```ballerina
public type Account record {
    string sid;
    string name;
    string status;
    string ^"type";    // type is a keyword and therefore escaped
    string createdDate;
    string updatedDate;
};
```

### Publish Your Connector

You can publish your custom connector for others to use into a Ballerina registry, such as Ballerina Central. You will need to have your connector as part of a module, and built using Ballerina's project and build management tooling.

Once you have built the module, you can `ballerina push <org-name>/<module-name>` and your module will be available at Ballerina Central for others to use. The `<org-name>` is defined in the `Ballerina.toml` that resides with the project and must match the organization name that is attached to your account at Ballerina Central. The `<module-name>` is defined by the folder that you placed the source code within the Ballerina project.

You will need to have an account at Ballerina Central and your CLI token from central placed into your Ballerina settings. The `ballerina deploy` command will initiate an OAuth flow that automates this for you, even if you do not already have an existing account on Ballerina Central.

For more information on how to structure the code you write, see [How to Structure Ballerina Code](/learn/how-to-structure-ballerina-code).

### Learn More

You can create connectors for a range of protocols and interfaces, including those endpoints, which are backed by proxies, firewalls, or special security parameters. You can also reuse existing connectors as part of your own endpoint implementation. The best way to learn about how to implement different kinds of connectors is to see the source for the connectors that ship as part of the standard library and with some of the modules built by the community:

1. ballerina/http Client [source code](https://github.com/ballerina-platform/ballerina-lang/blob/master/stdlib/http/src/main/ballerina/http/client_endpoint.bal).

2. Source code for a [Salesforce client connector](https://github.com/wso2-ballerina/package-salesforce).

3. Source code for a [GitHub client connector](https://github.com/wso2-ballerina/package-github).

4. Source code for a [Jira client connector](https://github.com/wso2-ballerina/package-jira).

5. Source code for a [Sonarqube client connector](https://github.com/wso2-ballerina/package-sonarqube).

6. Source code for a [SCIM2 client connector](https://github.com/wso2-ballerina/package-scim2).

7. Source code for a [Gmail client connector](https://github.com/wso2-ballerina/package-gmail).

8. Source code for a [Google Spreadsheet client connector](https://github.com/wso2-ballerina/package-googlespreadsheet).

9. Source code for a [Twitter client connector](https://github.com/wso2-ballerina/package-twitter).

10. Source code for a [gRPC client connector](https://github.com/ballerina-platform/ballerina-lang/blob/master/stdlib/grpc/src/main/ballerina/grpc/client_endpoint.bal).

11. Source code for a [MySQL client connector](https://github.com/ballerina-platform/ballerina-lang/blob/master/stdlib/database/mysql/src/main/ballerina/mysql/endpoint.bal).

## Create Custom Annotations & Builder Extensions

Annotations decorate objects in Ballerina code. The Ballerina compiler parses annotations into an AST that can be read and acted upon. You can introduce custom annotations for use by others with Ballerina and module builder extensions that can act on those annotations. The builder can generate additional artifacts as part of the build process.

Custom annotations are how the `ballerinax/docker` and `ballerinax/kubernetes` modules work. They introduce new annotations such as `@docker` and `@kubernetes` that can be attached to different parts of Ballerina code. The builder detects these annotations and then runs a post-compile process that generates deployment artifacts for direct deployment to those environments.

### Special Notes

There are two caveats to building custom annotations:

1. Currently, the Ballerina Compiler is implemented in Java and you will need JDK 1.8 and Apache Maven.

2. End users will need to manually install the extension into Ballerina. We will have a release mid-year that enables collating these extensions as part of a Ballerina project, so that it's included in any modules pushed to central.

### Custom Annotation HelloWorld

We will create a custom annotation `@hello:Greeting{}` with an attribute `salutation` that can be attached to a Ballerina service. The builder extension will read the annotation that is attached to a source file containing the text value and save it in another file. We'll ship this customization as a module that is pushed to Ballerina Central and available to end users by adding `import ballerinax/hello` to their source files.

The end user might write some code that would look like:

```ballerina
import ballerina/http;
import ballerinax/hello;

@hello:Greeting{
  salutation: "Guten Tag!"
}
service helloWorld on new http:Listener(9091) {
   resource function sayHello(http:Caller outboundEP, http:Request request) returns error? {
       http:Response response = new;
       response.setTextPayload("Hello, World from service helloWorld ! \n");
       check outboundEP->respond(response);
   }
}
```

If the end user saved this file as `hello_world.bal` then after building the file (with our custom build extension) will produce:

``` bash
$ tree
├── hello_world.bal
├── hello_world.balx
└── hello_world.txt
$ cat hello_world.txt
Guten Tag!
```

### Custom Annotation Getting Started

The source code and results for this example are on [GitHub](https://github.com/ballerinax/hello).

An annotation is a Ballerina code snippet that can be attached to some Ballerina code, and will hold some metadata related to that attached code. Annotations are not executable, but can be used to alter the behavior of some executable code.

Annotations can be attached to:

* Services
* Type definition
* Function definition
* Variable declaration
* Annotations

Ballerina has built-in a set of annotations such as @http:ServiceConfig, @http:ResourceConfig. These annotations are part of the standard library and shipped with each distribution of Ballerina. You can view the definitions of these annotations by browsing the module's API reference.

A Ballerina "builder extension" is Java code that the build process will load and execute after the compilation phase. Builder extensions can act on any annotation information, whether those in the system library or custom annotations provided by you. Builder extensions that you write can register callbacks that act on annotations attached to different objects:

*  `public void process(PackageNode packageNode)`
*  `public void process(BLangTestablePackage packageNode)`
*  `public void process(ServiceNode serviceNode, List<AnnotationAttachmentNode> annotations)`
*  `public void process(TypeDefinition typeDefinition, List<AnnotationAttachmentNode> annotations)`
*  `public void process(FunctionNode functionNode, List<AnnotationAttachmentNode> annotations)`
*  `public void process(SimpleVariableNode variableNode, List<AnnotationAttachmentNode> annotations)`
*  `public void process(AnnotationNode annotationNode, List<AnnotationAttachmentNode> annotations)`
*  `public void codeGenerated(PackageID packageID, Path binaryPath)`


### Create a Maven Project

We have a Maven arctetype that will create a sample template that can be used for writing the Ballerina builder extension.

```
mvn archetype:generate -DgroupId=ballerinax.hello
                       -DartifactId=hello-extension
		       -DarchetypeArtifactId=maven-archetype-quickstart
		       -DinteractiveMode=false
```

This will create an Apache Maven project in following structure.

```bash	
├── pom.xml
├── src
│   ├── main
│   │   └── java
│   │       └── ballerinax
│   │           └── hello
│   │               └── App.java
│   └── test
│       └── java
│           └── ballerinax
│               └── hello
│                   └── AppTest.java
└── target
```

In the `pom.xml`, add Ballerina IO as the parent.

```xml
    <parent>
        <groupId>io.ballerina</groupId>
        <artifactId>ballerina</artifactId>
        <version>0.970.0-beta5</version>
    </parent>
```

In the `pom.xml` add Ballerina's Apache Maven dependencies.

```xml
    <dependencies>
        <dependency>
            <groupId>org.ballerinalang</groupId>
            <artifactId>ballerina-lang</artifactId>
            <version>0.982.0</version>
        </dependency>
         <dependency>
                <groupId>org.ballerinalang</groupId>
                <version>0.982.0</version>
                <artifactId>lib-creator</artifactId>
         </dependency>
         <dependency>
            <groupId>org.ballerinalang</groupId>
            <artifactId>ballerina-builtin</artifactId>
            <version>0.982.0</version>
            <type>zip</type>
            <classifier>ballerina-binary-repo</classifier>
        </dependency>
    </dependencies>
```

In the `pom.xml`, add Ballerina's repository information.

```xml
<repositories>
   <repository>
       <id>wso2.releases</id>
       <name>WSO2 Releases Repository</name>
       <url>http://maven.wso2.org/nexus/content/repositories/releases/</url>
       <releases>
           <enabled>true</enabled>
           <updatePolicy>daily</updatePolicy>
           <checksumPolicy>ignore</checksumPolicy>
       </releases>
   </repository>
   <repository>
       <id>wso2.snapshots</id>
       <name>WSO2 Snapshot Repository</name>
       <url>http://maven.wso2.org/nexus/content/repositories/snapshots/</url>
       <snapshots>
           <enabled>true</enabled>
           <updatePolicy>daily</updatePolicy>
       </snapshots>
       <releases>
           <enabled>false</enabled>
       </releases>
   </repository>
</repositories>
```

##### Remove Some Unnecessary Files

Remove the archetype generated by the `App.java` and `AppTest.java` files as they are not needed.
Then, add an XML file named `spotbugs-exclude.xml` together with the `pom.xml` and add the following.
Make sure you are able to build the project.

```xml
<FindBugsFilter>

</FindBugsFilter>
```

Then build it.
```bash
mvn clean install
```

### Create Custom Annotation Definition

In the maven project, create a hello-extension/src/main/ballerina/ballerinax/hello/annotation.bal file.

```bash
├── pom.xml
├── src
│   ├── main
│   │   ├── ballerina
│   │   │   └── ballerinax
│   │   │       └── hello
│   │   │           └── annotation.bal
│   │   └── java
│   │       └── ballerinax
│   │           └── hello
│   │               └── App.java
│   └── test
│       └── java
│           └── ballerinax
│               └── hello
│                   └── AppTest.java
└── target
```

The annotation is defined using Ballerina syntax in the `annotation.bal`:

```ballerina
# Hello annotation configuration
#
# + salutation - Greeting
public type HelloConfiguration record {
    string salutation;
};

# @hello:Greeting annotation configuration
public annotation <service> Greeting HelloConfiguration;

// You can replace the <> value with different objects this annotation may attach to
```

##### Define an Extension Provider

Create `HelloExtensionProvider.java` class in `hello/src/main/java/org/ballerinax/hello` module. This class will implement `SystemPackageRepositoryProvider`.

```java
package ballerinax.hello;

import org.ballerinalang.annotation.JavaSPIService;
import org.ballerinalang.spi.SystemPackageRepositoryProvider;
import org.wso2.ballerinalang.compiler.packaging.repo.JarRepo;
import org.wso2.ballerinalang.compiler.packaging.repo.Repo;

/**
* This represents the Ballerina Hello extension package repository provider.
*/
@JavaSPIService("org.ballerinalang.spi.SystemPackageRepositoryProvider")
public class HelloExtensionProvider implements SystemPackageRepositoryProvider {

   @Override
   public Repo loadRepository() {
       return new JarRepo(SystemPackageRepositoryProvider.getClassUri(this));
   }
}

```

##### Update the pom.xml

Configure bsc plugin in the `pom.xml`:

```xml
<build>
    <!-- For ballerina annotation processing -->
    <resources>
       <resource>
           <directory>src/main/resources</directory>
           <excludes>
               <exclude>ballerina/**</exclude>
           </excludes>
       </resource>

       <!-- copy ballerina annotation sources to the jar -->
       <resource>
           <directory>${project.build.directory}/../src/main/ballerina</directory>
           <targetPath>META-INF/</targetPath>
       </resource>
    </resources>
    <plugins>
        <plugin>
           <groupId>org.bsc.maven</groupId>
           <artifactId>maven-processor-plugin</artifactId>
           <version>2.2.4</version>
           <configuration>
               <processors>
                   <processor>org.ballerinalang.codegen.BallerinaAnnotationProcessor</processor>
               </processors>
               <options>
                   <nativeEntityProviderPackage>org.ballerinalang.net.generated.providers</nativeEntityProviderPackage>
                   <nativeEntityProviderClass>StandardNativeElementProvider</nativeEntityProviderClass>
               </options>
           </configuration>
           <executions>
               <execution>
                   <id>process</id>
                   <goals>
                       <goal>process</goal>
                   </goals>
                   <phase>generate-sources</phase>
               </execution>
           </executions>
        </plugin>
    </plugins>
</build>
```

Configure the Apache Maven shade plugin. This plugin manages the packaging of dependency .jar files. The Ballerina Tools distribution contains all the dependency .jar files we have used in the plugin. Since we are copying the final .jar file to Ballerina tools, we are excluding the Ballerina dependencies from the final .jar file.

```xml
<plugin>
   <artifactId>maven-shade-plugin</artifactId>
   <version>2.4.3</version>
   <executions>
       <execution>
           <phase>package</phase>
           <goals>
               <goal>shade</goal>
           </goals>
           <configuration>
               <createDependencyReducedPom>true</createDependencyReducedPom>
               <minimizeJar>true</minimizeJar>
               <artifactSet>
                   <excludes>
                       <exclude>org.slf4j:slf4j-api</exclude>
                       <exclude>org.slf4j:slf4j-jdk14</exclude>
                       <exclude>com.fasterxml.jackson.dataformat:jackson-dataformat-yaml</exclude>
                       <exclude>com.fasterxml.jackson.core:jackson-databind</exclude>
                       <exclude>com.fasterxml.jackson.core:jackson-annotations</exclude>
                       <exclude>com.fasterxml.jackson.core:jackson-core</exclude>
                       <exclude>commons-lang:commons-lang</exclude>
                       <exclude>org.yaml:snakeyaml</exclude>
                       <exclude>org.ballerinalang:ballerina-lang</exclude>
                       <exclude>org.ballerinalang:ballerina-launcher</exclude>
                       <exclude>org.ballerinalang:ballerina-builtin</exclude>
                       <exclude>org.ballerinalang:ballerina-core</exclude>
                       <exclude>org.ballerinalang:ballerina-mime</exclude>
                       <exclude>org.ballerinalang:ballerina-logging</exclude>
                       <exclude>org.ballerinalang:ballerina-http</exclude>
                       <exclude>junit:junit</exclude>
                       <exclude>org.bsc.maven:maven-processor-plugin</exclude>
                   </excludes>
               </artifactSet>
               <filters>
                   <filter>
                       <artifact>*:*</artifact>
                       <excludes>
                           <exclude>META-INF/*.SF</exclude>
                           <exclude>META-INF/*.DSA</exclude>
                           <exclude>META-INF/*.RSA</exclude>
                       </excludes>
                   </filter>
               </filters>
           </configuration>
       </execution>
   </executions>
</plugin>
```

Configure Apache Maven compiler plugin. Ballerina requires Java 8 for the builder extensions.

```xml
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-compiler-plugin</artifactId>
   <version>3.7.0</version>
   <configuration>
       <source>1.8</source>
       <target>1.8</target>
   </configuration>
</plugin>
```

Configure Apache Maven plugins to generate .balo files.

```xml
         <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.6.0</version>
                <executions>
                    <execution>
                        <id>gen-balo</id>
                        <goals>
                            <goal>java</goal>
                        </goals>
                        <phase>compile</phase>
                        <configuration>
                            <systemProperties>
                                <systemProperty>
                                    <key>BALLERINA_DEV_MODE_COMPILE</key>
                                    <value>true</value>
                                </systemProperty>
                            </systemProperties>
                            <arguments>
                                <!--is built in pkg loaded from source-->
                                <argument>false</argument>
                                <!--source project dir-->
                                <argument>${basedir}/src/main/ballerina/ballerinax</argument>
                                <!--balo destination-->
                                <argument>${project.build.directory}/generated-balo/repo/ballerinax</argument>
                                <!--ballerina home-->
                                <argument>${project.build.directory}</argument>
                                <!--not used-->
                                <argument>${project.version}</argument>
                            </arguments>
                        </configuration>
                    </execution>
                </executions>
                <configuration>
                    <mainClass>org.ballerinalang.stdlib.utils.GenerateBalo</mainClass>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <executions>
                    <execution>
                        <id>unpack-dependencies</id>
                        <phase>generate-resources</phase>
                        <goals>
                            <goal>unpack-dependencies</goal>
                        </goals>
                        <configuration>
                            <includeClassifiers>ballerina-binary-repo</includeClassifiers>
                            <outputDirectory>${project.build.directory}/lib</outputDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>2.5.2</version>
                <executions>
                    <execution>
                        <id>distribution</id>
                        <phase>package</phase>
                        <goals>
                            <goal>attached</goal>
                        </goals>
                        <configuration>
                            <descriptorSourceDirectory>assembly</descriptorSourceDirectory>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

```

Create a folder named `assembly` in  `hello-extension/` folder and add the following files.
1. balo.xml
```xml
<assembly>
    <includeBaseDirectory>true</includeBaseDirectory>
    <baseDirectory>/</baseDirectory>
    <id>ballerina-binary-repo</id>
    <formats>
        <format>zip</format>
    </formats>

    <fileSets>
        <fileSet>
            <directory>${project.build.directory}/generated-balo</directory>
            <outputDirectory>/</outputDirectory>
            <includes>
                <include>**</include>
            </includes>
        </fileSet>
    </fileSets>
</assembly>
```
2. source.xml
```xml
<assembly>
    <includeBaseDirectory>true</includeBaseDirectory>
    <baseDirectory>ballerina</baseDirectory>
    <id>ballerina-sources</id>
    <formats>
        <format>zip</format>
    </formats>

    <fileSets>
        <fileSet>
            <directory>src/main/ballerina</directory>
            <outputDirectory>/</outputDirectory>
            <includes>
                <include>**</include>
            </includes>
        </fileSet>
    </fileSets>
</assembly>
```

Create a file named `Ballerina.toml` in `hello-extension/src/main/ballerina/ballerinax` folder and add the following content.

```toml
[project]
org-name = "ballerinax"
version = "0.0.0"
```

Final folder structure will look like below.

```bash
.
├── assembly
│   ├── balo.xml
│   └── source.xml
├── pom.xml
├── spotbugs-exclude.xml
└── src
    └── main
        ├── ballerina
        │   └── ballerinax
        │       ├── Ballerina.toml
        │       └── hello
        │           └── annotation.bal
        └── java
            └── ballerinax
                    └── hello
                        ├── HelloExtensionProvider.java
                        ├── HelloModel.java
                        └── HelloPlugin.java

```

##### Verify the Annotation

Build the project and verify that the JAR file is built. The JAR file will contain your annotation definitions.

```bash
mvn clean install
```

The resulting `target/hello-extension-0.990.x.jar` will have the annotation definitions.

Place the .jar file at `<ballerina_lang_home>/bre/lib` of your Ballerina distribution.

Extract `target/hello-extension-0.990.x-ballerina-binary-repo.zip` file and copy the `repo/ballerinax` folder to `<ballerina_lang_home>/lib/repo/` folder.
The final `<ballerina_lang_home>/lib/repo/` folder will  have two folders `ballerina` and `ballerinax`.

You can now verify that the annotation is present even though we cannot react to it yet. Create a sample Ballerina file with your  annotation and make sure that Ballerina can compile the file without errors.

```ballerina
import ballerina/http;
import ballerinax/hello;

@hello:Greeting{salutation : "Guten Tag!"}
service helloWorld on new http:Listener(9091) {
   resource function sayHello(http:Caller outboundEP, http:Request request) returns error? {
       http:Response response = new;
       response.setTextPayload("Hello, World from service helloWorld ! \n");
       check outboundEP->respond(response);
   }
}
```

### Write the Build Extension Processor

Create `HelloPlugin.java` in the `hello/src/main/java/org/ballerinax/hello` module. We will then implement the annotation methods that we want to act upon.

```java
package org.ballerinax.hello;

import org.ballerinalang.compiler.plugins.AbstractCompilerPlugin;
import org.ballerinalang.compiler.plugins.SupportedAnnotationPackages;
import org.ballerinalang.model.elements.PackageID;
import org.ballerinalang.model.tree.AnnotationAttachmentNode;
import org.ballerinalang.model.tree.ServiceNode;
import org.ballerinalang.util.diagnostic.Diagnostic;
import org.ballerinalang.util.diagnostic.DiagnosticLog;
import org.wso2.ballerinalang.compiler.tree.BLangAnnotationAttachment;
import org.wso2.ballerinalang.compiler.tree.expressions.BLangRecordLiteral;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

/**
 * Compiler plugin to generate greetings.
 */
@SupportedAnnotationPackages(
        // Tell compiler we are only interested in ballerinax.hello annotations.
        value = "ballerinax.hello"
)
public class HelloPlugin extends AbstractCompilerPlugin {
    private DiagnosticLog dlog;


    @Override
    public void init(DiagnosticLog diagnosticLog) {
        // Initialize the logger.
        this.dlog = diagnosticLog;
    }

    // Our annotation is attached to service<> objects
    @Override
    public void process(ServiceNode serviceNode, List<AnnotationAttachmentNode> annotations) {
        //Iterate through the annotation Attachment Nodes
        for (AnnotationAttachmentNode attachmentNode : annotations) {
            List<BLangRecordLiteral.BLangRecordKeyValue> keyValues =
                    ((BLangRecordLiteral) ((BLangAnnotationAttachment) attachmentNode).expr).getKeyValuePairs();
            //Iterate through the annotations
            for (BLangRecordLiteral.BLangRecordKeyValue keyValue : keyValues) {
                String annotationValue = keyValue.getValue().toString();
                //Match annotation key and assign the value
                String s = keyValue.getKey().toString();
                if ("salutation".equals(s)) {
                    HelloModel.getInstance().setGreeting(annotationValue);
                }
            }
        }
    }

    @Override
    public void codeGenerated(PackageID packageID, Path binaryPath) {
        //extract file name.
        String filePath = binaryPath.toAbsolutePath().toString().replace(".balx", ".txt");
        String greeting = HelloModel.getInstance().getGreeting();
        try {
            writeToFile(greeting, filePath);
        } catch (IOException e) {
            dlog.logDiagnostic(Diagnostic.Kind.ERROR, null, e.getMessage());
        }
    }

    /**
     * Write content to a File. Create the required directories if they don't not exists.
     *
     * @param context        context of the file
     * @param targetFilePath target file path
     * @throws IOException If an error occurs when writing to a file
     */
    public void writeToFile(String context, String targetFilePath) throws IOException {
        File newFile = new File(targetFilePath);
        // append if file exists
        if (newFile.exists()) {
            Files.write(Paths.get(targetFilePath), context.getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.APPEND);
            return;
        }
        //create required directories
        if (newFile.getParentFile().mkdirs()) {
            Files.write(Paths.get(targetFilePath), context.getBytes(StandardCharsets.UTF_8));
            return;
        }
        Files.write(Paths.get(targetFilePath), context.getBytes(StandardCharsets.UTF_8));
    }
}

```

The annotation value is read and cached in a singleton model class. Upon receiving the code generated event, we are extracting the output file name and write the value from the model class to a file.

Create `HelloModel.java` in `hello/src/main/java/org/ballerinax/hello` module.

```java
package org.ballerinax.hello;

/**
 * Model class to store greeting value.
 */
public class HelloModel {
    private static HelloModel instance;
    private String greeting;

    private HelloModel() {
        // Initialize with the default greeting.
        greeting = "Hello!";
    }

    public static HelloModel getInstance() {
        synchronized (HelloModel.class) {
            if (instance == null) {
                instance = new HelloModel();
            }
        }
        return instance;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }
}
```

Create an file named `org.ballerinalang.compiler.plugins.CompilerPlugin` in `hello/src/main/resources/META-INF/services` directory. This file is read by the compiler and registers our `HelloPlugin.java` class as an extension. The events will be received by the registered classes. The file should contain the fully qualified Java class name of the builder extension.

```
org.ballerinax.hello.HelloPlugin
```

Rebuild the maven project and replace the jar file in `<ballerina_tools_home>/bre/lib` with the latest. You should now be able to compile the sample Ballerina file we created earlier. There should be a text file created with annotation value.

### Learn More About Java Libraries for Builder Extensions

First, the Ballerina developers will be eager and excited to help you if you run into any issues with writing Java extensions that parse the AST. AST parsing is a bit of a different world and it does take some work to learn all of the libraries. You can post questions on the ballerina-dev Google group, chat in our Slack channel, or post onto StackOverflow with the #ballerina label.

Second, the fastest way to learn about advanced annotation processing is to review the processors for Docker and Kubernetes.

Docker:

1. The [Ballerina file defining the annotation](https://github.com/ballerinax/docker/blob/master/docker-extension/src/main/ballerina/ballerinax/docker/annotation.bal).

2. The [Java code with the builder extension](https://github.com/ballerinax/docker/tree/master/docker-extension/src/main/java/org/ballerinax/docker).

Kubernetes

1. The [Ballerina file defining the annotation](https://github.com/ballerinax/kubernetes/blob/master/kubernetes-extension/src/main/ballerina/ballerinax/kubernetes/annotation.bal).

2. The [Java code with the builder extension](https://github.com/ballerinax/kubernetes/tree/master/kubernetes-extension/src/main/java/org/ballerinax/kubernetes).

## Create Webhook Callback Services

A webhook callback service type is introduced by implementing a new `listener` type wrapping the generic 
`websub:Listener`. The implementation should define a mapping between an indicator (in the content delivery requests) and the resources (to which the requests need to be dispatched based on the value of the indicator).
 
This indicator could be one of the following:
- A request header 
- The payload - the value for a particular key in the JSON payload
- A request header and the payload (combination of the above)
 
The [ballerina/websub Module.md](https://ballerina.io/learn/api-docs/ballerina/websub.html) explains the extension points in detail.
 
You can create and share your own webhook callback service types as Ballerina modules, which you push into a Ballerina registry (such as Ballerina Central).

Follow the steps below to create a webhook callback service type.

1. Create a Ballerina module in a Ballerina project.

2. Create a new `listener` wrapping the generic `websub:Listener`.

3. Implement the `__init()` function specifying the mapping between possible notifications and resources as `extensionConfig`.

4. Implement the `__attach()`, `__start()` and `__stop()` functions calling the same functions on the generic `websub:Listener`.

5. Build the module and push it into a registry for others to use it.

### The GitHub Webhook

A [GitHub webhook implementation](https://github.com/wso2-ballerina/module-github/tree/master/githubwebhook3) is made available by WSO2 as the `wso2/githubwebhook3` module.

This webhook can be used by anyone by importing it.

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/websub;
import wso2/githubwebhook3;

// Initiate a new listener of type `githubwebhook3:WebhookListener`.
listener githubwebhook3:WebhookListener githubListener = new(8080);

// Attach a service accepting "ping", "issue opened" and "repository starred" notifications.
@websub:SubscriberServiceConfig {
    path: "/webhook",
    subscribeOnStartUp: true,
    hub: githubwebhook3:HUB,
    topic: "https://github.com/<GH_USERNAME>/<GH_REPO_NAME>/events/*.json", // subscribe to notifications for all events
    secret: "<SECRET>",
    callback: "<CALLBACK_URL>", // only needs to be specified if not http(s)://<HOST>:<PORT>/<path>
    subscriptionClientConfig: {
        auth: {
            scheme: http:OAUTH2,
            config: {
                grantType: http:DIRECT_TOKEN,
                config: {
                    accessToken: "<GH_ACCESS_TOKEN>"
                }
            }
        }
    }
}
service githubWebhook on githubListener {

    resource function onPing(websub:Notification notification, githubwebhook3:PingEvent event) {
        io:println("[onPing] Webhook Registered: ", event);
    }

    resource function onIssuesOpened(websub:Notification notification, githubwebhook3:IssuesEvent event) {
        io:println("[onIssuesOpened] Issue ID: ", event.issue.number);
    }

    resource function onWatch(websub:Notification notification, githubwebhook3:WatchEvent event) {
        io:println("[onWatch] Repository starred by: ", event.sender);
    }
}
```

### The `WebhookListener` Object

The `WebhookListener` object that is implemented as a `listener` for the GitHub webhook callback service.

```ballerina
public type WebhookListener object {

    *AbstractListener;

    public WebhookListenerConfiguration? webhookListenerConfig = ();

    private websub:Listener websubListener;

    public function __init(int port, WebhookListenerConfiguration? config = ());

    public function __attach(service s, map<any> data) returns error?;

    public function __start() returns error?;
    
    public function __stop() returns error?;
};
```

### Implement the `__init()` function

For the GitHub webhook, the mapping between events and resources could be based either only on a header or on both a header and the payload.

e.g.,
- When the repository is starred, the content-delivery request received will have the header `X-GitHub-Event` with 
the value set to "watch".
- When an issue is opened, the content-delivery request received will have the header `X-GitHub-Event` with the 
value set to "issues", and the `json` payload will contain the value "opened" for the key "action".

The implementation of the `__init()` function initializes the `websub:Listener` specifying the mapping to the resources as the `extensionConfig`.
```ballerina
const string TOPIC_HEADER = "X-GitHub-Event";

final map<(string, typedesc)> GITHUB_TOPIC_HEADER_RESOURCE_MAP = {
    "ping": ("onPing", PingEvent),
    ...
    "watch": ("onWatch", WatchEvent)
};

final map<map<map<(string, typedesc)>>> GITHUB_TOPIC_HEADER_AND_PAYLOAD_KEY_RESOURCE_MAP = {
    "create": {
        "ref_type": {
            "repository": ("onCreateRepository", CreateEvent)
            ...
        }
    },
    "issues": {
        "action": {
            "opened": ("onIssuesOpened", IssuesEvent),
            ...
            "closed": ("onIssuesClosed", IssuesEvent),
        }
    }
    ...
};

public type WebhookListenerConfiguration record {
    string host?;
    http:ServiceSecureSocket httpServiceSecureSocket?;
};

function WebhookListener.__init(int port, WebhookListenerConfiguration? config = ()) {
    self.webhookListenerConfig = config;
    websub:ExtensionConfig extensionConfig = {
        topicIdentifier: websub:TOPIC_ID_HEADER_AND_PAYLOAD,
        topicHeader: TOPIC_HEADER,
        headerResourceMap: GITHUB_TOPIC_HEADER_RESOURCE_MAP,
        headerAndPayloadKeyResourceMap: GITHUB_TOPIC_HEADER_AND_PAYLOAD_KEY_RESOURCE_MAP
    };
    websub:SubscriberServiceEndpointConfiguration sseConfig = {
        extensionConfig: extensionConfig
    };
    if (config is WebhookListenerConfiguration) {
        string? specHost = config["host"];
        if (specHost is string) {
            sseConfig.host = specHost;
        }
        sseConfig.httpServiceSecureSocket = config["httpServiceSecureSocket"];
    }
    self.websubListener = new(port, config = sseConfig);
}
```

### Implement the `__attach()`, `__start()` and `__stop()` functions

The implementations of these functions only need to call the corresponding functions of the wrapped `websub:Listener`.

```ballerina
function WebhookListener.__attach(service s, map<any> data) returns error? {
    return self.websubListener.__attach(s, data);
}

function WebhookListener.__start() returns error? {
    return self.websubListener.__start();
}

function WebhookListener.__stop() returns error? {
    return self.websubListener.__stop();
}
```
