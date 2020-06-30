---
layout: ballerina-left-nav-pages
title: Docker
description: See how the Ballerina deployment in Docker works
keywords: ballerina, programming language, services, cloud, docker
permalink: /learn/deployment/docker/
active: docker
redirect_from:
  - /learn/deployment/docker
  - /learn/deploying-ballerina-programs-in-the-cloud
  - /learn/deploying-ballerina-programs-in-the-cloud/
---

# Docker

Docker helps to package applications and their dependencies in a binary image, which can run in various locations whether on-premise, in a public cloud, or in a private cloud. To create a Docker image, you have to create a Dockerfile by choosing a suitable base image, bundling all dependencies, copying the application binary, and setting the execution command with proper permissions. To create optimized images, youhave to follow a set of [best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/). Otherwise, the image that is built will be large in size, less secure, and have many other shortcomings. 

The Ballerina compiler is capable of creating optimized Docker images out of the application source code. This guide includes step-by-step instructions on different use cases and executing the corresponding sample source code. 

- [Enabling Docker support](#enabling-docker-support)
- [Use cases](#use-cases)
  - [Running a Ballerina service in a Docker container](#running-a-ballerina-service-in-a-docker-container)
  - [Creating a custom Ballerina Docker image and pushing it automatically to the Docker registry](#creating-a-custom-ballerina-docker-image-and-pushing-it-automatically-to-the-Docker-registry)
  - [Running a Ballerina HTTPS service in a Docker container](#running-a-ballerina-https-service-in-a-docker-container)
  - [Copying additional files to the Ballerina Docker image](#copying-additional-files-to-the-ballerina-docker-image)
  - [Using a custom base image to build Ballerina Docker images](#using-a-custom-base-image-to-build-ballerina-docker-images)
  - [Overriding the CMD of the generated Ballerina Dockerfile](#overriding-the-cmd-of-the-generated-ballerina-dockerfile)
  - [Creating multiple Docker images corresponding to modules of a Ballerina project](#creating-multiple-docker-images-corresponding-to-modules-of-a-ballerina-project)
- [Troubleshooting](#troubleshooting)

## Enabling Docker support

Docker support is inbuilt and comes by default in any Ballerina distribution. You can enable Docker artifact generation by adding annotations to your Ballerina code. Follow the steps below to enable Docker support.

1. Import the Docker extension module in your Ballerina code (e.g., `import ballerina/docker;`).

2. Add the relevant annotations within the code (e.g., `@docker:Config {}`).

3. Build the Ballerina source file/project (e.g., `ballerina build source.bal`).

## Use cases

### Running a Ballerina service in a Docker container

This use case shows how to run a Ballerina service in a Docker container. The sample below demonstrates running a simple Ballerina hello world service in a Docker container. 

#### Prerequisites

You need a machine with [Docker](https://docs.docker.com/get-docker/) installed.

#### Sample source code 

`hello_world_docker.bal`
```ballerina 

import ballerina/http;
import ballerina/docker;
 
@docker:Config {}
service hello on new http:Listener(9090){
 
  resource function sayHello(http:Caller caller,http:Request request) returns error? {
      check caller->respond("Hello World!");
  }
}

```

#### Steps to run

1. Compile the `hello_world_docker.bal` file.

    ```
    > ballerina build hello_world_docker.bal 
    Compiling source
      hello_world_docker.bal

    Generating executables
      hello_world_docker.jar

    Generating docker artifacts...
      @docker 		 - complete 2/2 

      Run the following command to start a Docker container:
      docker run -d -p 9090:9090 hello_world_docker:latest
    ```

    The artifacts files below will be generated with the build process.

    ```
    > tree
    .
    ├── docker
    │   └── Dockerfile
    ├── hello_world_docker.bal
    └── hello_world_docker.jar

    1 directory, 3 files

    ```

    The build process automatically generates a Dockerfile with the following content:

    ```
    # Auto Generated Dockerfile
    FROM ballerina/jre8:v1

    LABEL maintainer="dev@ballerina.io"

    RUN addgroup troupe \
        && adduser -S -s /bin/bash -g 'ballerina' -G troupe -D ballerina \
        && apk add --update --no-cache bash \
        && chown -R ballerina:troupe /usr/bin/java \
        && rm -rf /var/cache/apk/*

    WORKDIR /home/ballerina

    COPY hello_world_docker.jar /home/ballerina

    USER ballerina

    CMD java -jar hello_world_docker.jar

    ```


2. Verify that the Docker image is created.

    ```
    > docker images
    REPOSITORY          TAG         IMAGE ID            CREATED             SIZE
    hello_world_docker  latest      e48123737a65        7 minutes ago       134MB

    ```

    > Since the annotation is not configured to have a custom Docker image name and tag, the build process will create a Docker image with the default values: the file name of the generated .jar file with the `latest` tag (e.g., `hello_world_docker:latest`).

3. Run the Docker image as a container (use the below command printed in step 1).

    ```
    > docker run -d -p 9090:9090 hello_world_docker:latest
    32461676d3c22848088390483a414e5b1d11a7a73c2296eccb18e6c9f27c41c0
    ```


4. Verify that the Docker container is running.

    ```
    > docker ps
    CONTAINER ID  IMAGE    		 COMMAND    	      CREATED              STATUS            PORTS     NAMES
    32461676d3c2  hello_world_docker:latest  "/bin/sh -c 'java -j…"   About a minute ago   Up About a minute 0.0.0.0:9090->9090/tcp    lucid_turing
    ```


5. Access the hello world service with the cURL command.

    ```
    > curl http://localhost:9090/hello/sayHello           
    Hello World!
    ```


6. Clean up the used artifacts.

    ```
    Stop / kill running docker container
    > docker kill 32461676d3c2
    32461676d3c2

    Remove docker container files
    > docker em 32461676d3c2

    Remove docker image
    > docker rmi e48123737a65
  ```

### Creating a custom Ballerina Docker image and pushing it automatically to the Docker registry

This use case shows how to run a simple Ballerina hello world service in a Docker container with annotation configurations, which can be used to create a Docker image with a custom image-name and tag, and then automatically push the created image to the Docker registry.

#### Prerequisites

- A machine with [Docker](https://docs.docker.com/get-docker/) installed
- A [Docker Hub](https://hub.docker.com/) account

#### Sample source code

`custom_docker_name.bal`

```ballerina
import ballerina/http;
import ballerina/docker;
 
@docker:Config {
   push: true,
   registry: "index.docker.io/$env{DOCKER_USERNAME}",
   name: "helloworld",
   tag: "v1.0.0",
   username: "$env{DOCKER_USERNAME}",
   password: "$env{DOCKER_PASSWORD}"
}
service hello on new http:Listener(9090){
 
  resource function sayHello(http:Caller caller,http:Request request) returns error? {
      check caller->respond("Hello World!");
  }
}
```

In this sample, the following properties are set in the `@docker:Config` annotation.

- `push`		  : enable pushing the Docker image to the registry 
- `registry`	: Docker registry URL
- `name`		  : name of the Docker image
- `tag`		    : Docker image tag (version) 
- `username`	: username of the Docker registry
- `password`	: password of the Docker registry

> The `$env` variable is used to read the environment variable values from the system.

#### Steps to run

1. Export the username and password of Docker (registry).

    ```
    export DOCKER_USERNAME=<username>
    export DOCKER_PASSWORD=<password>
    ```

2. Compile the `custom_docker_name.bal` file.

    ```ballerina

    > ballerina build custom_docker_name.bal
    Compiling source
      custom_docker_name.bal

    Generating executables
      custom_docker_name.jar

    Generating docker artifacts...
      @docker 		 - complete 3/3 

      Run the following command to start a Docker container:
      docker run -d -p 9090:9090 index.docker.io/lakwarus/helloworld:v1.0.0

    ```

3. Verify that the Docker image is created.

    ```
    REPOSITORY          TAG      IMAGE ID            CREATED             SIZE
    lakwarus/helloworld v1.0.0   7e76efdd33e4        20 minutes ago      134MB
    ```

4. Log into [Docker Hub](https://hub.docker.com/) and verify that the image is pushed.

    ![Docker Hub](/learn/images/docker-hub.png)

### Running a Ballerina HTTPS service in a Docker container

An HTTP endpoint can be configured to communicate through HTTPS as well. To secure an endpoint using HTTPS, it needs to be configured with a keystore, a certificate, and a private key for the endpoint. When running this HTTPS service as a Docker container, it is required to copy the keystore with the custom certificate that is used to configure the HTTPS endpoint. 

#### Prerequisites

You need a machine with [Docker](https://docs.docker.com/get-docker/) installed.

#### Sample source code

The sample below uses a separate listener endpoint and it is configured with a custom keystore. In addition to the `@docker:Config` annotation, the `@docker:Expose` annotation is used with the listener endpoint object, which helps to expose the correct service ports when creating the Docker container. 

`https_service_in_docker.bal`

```ballerina

import ballerina/http;
import ballerina/docker;
 
@docker:Expose {}
listener http:Listener helloWorldEP = new(9095, {
   secureSocket: {
       keyStore: {
           path: "./ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
});
 
@docker:Config {
   name: "https-helloworld"
}
service hello on helloWorldEP {
 
  resource function sayHello(http:Caller caller,http:Request request) returns error? {
      check caller->respond("Hello World!");
  }
}
```

#### Steps to run

1. Compile the `https_service_in_docker.bal` file.

    ```
    > ballerina build https_service_in_docker.bal 
    Compiling source
      https_service_in_docker.bal

    Generating executables
      https_service_in_docker.jar

    Generating docker artifacts...
      @docker 		 - complete 2/2 

      Run the following command to start a Docker container:
      docker run -d -p 9095:9095 https-helloworld:latest

    ```
    The artifact files below will be generated with the build process.

    ```
    > tree
    .
    ├── ballerinaKeystore.p12
    ├── docker
    │   ├── Dockerfile
    │   └── ballerinaKeystore.p12
    ├── https_service_in_docker.bal
    └── https_service_in_docker.jar

    1 directory, 5 files

    ```

    > **Note:** It has copied the correct keystore used in the source code into the Docker folder and generated the Dockerfile with the content below.

    ```
    # Auto Generated Dockerfile
    FROM ballerina/jre8:v1

    LABEL maintainer="dev@ballerina.io"

    RUN addgroup troupe \
        && adduser -S -s /bin/bash -g 'ballerina' -G troupe -D ballerina \
        && apk add --update --no-cache bash \
        && chown -R ballerina:troupe /usr/bin/java \
        && rm -rf /var/cache/apk/*

    WORKDIR /home/ballerina

    COPY https_service_in_docker.jar /home/ballerina
    COPY ballerinaKeystore.p12 ./ballerinaKeystore.p12

    EXPOSE  9095
    USER ballerina

    CMD java -jar https_service_in_docker.jar

    ```

    > The Ballerina compiler automatically adds a line to the Dockerfile to copy the required keystore into the Docker image.

2. Verify that the Docker image is created.

    ```
    > docker images
    REPOSITORY          TAG        IMAGE ID            CREATED             SIZE
    https-helloworld    latest     ed9bff9fabd7        15 minutes ago      134MB
    ```

3. Run the Docker image as a container (use the command below printed in step 1).

    ```
    > docker run -d -p 9095:9095 https-helloworld:latest
    25dfb84f1c9f3459baf7a4791f9de3cae260d9963e580802253621919d0bd2fb
    ```

4. Verify that the Docker container is running.

    ```
    > docker ps
    CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS                    NAMES
    25dfb84f1c9f        https-helloworld:latest   "/bin/sh -c 'java -j…"   45 seconds ago      Up 45 seconds       0.0.0.0:9095->9095/tcp   charming_visvesvaraya
    ```

5. Access the hello world service with the cURL command.

    ```
    curl -k https://localhost:9095/hello/sayHello
    Hello World!
    ```
    > **Note:** The cURL command is used with the -k option because self signed certificates are used in the keystore.

6. Clean up the used artifacts.

    ```
    > docker kill 25dfb84f1c9f
    25dfb84f1c9f

    > docker rm 25dfb84f1c9f
    25dfb84f1c9f

    > docker rmi ed9bff9fabd7
    Untagged: https-helloworld:latest
    ```

### Copying additional files to the Ballerina Docker image

In some use cases, you need to process files in your applications. When these applications are run in a Docker container, you might need to copy these additional files into the image or mount them as external volume. This use case shows how to copy additional files into the Docker image while compiling the Ballerina source code.

#### Prerequisites

You need a machine with [Docker](https://docs.docker.com/get-docker/) installed.

#### Sample source code

`copy_file.bal`

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/docker;
 
@docker:Expose {}
listener http:Listener helloEP = new(9090);
 
@docker:Config {}
@docker:CopyFiles {
   files: [
       { sourceFile: "./name.txt", target: "/home/ballerina/name.txt" }
   ]
}
service hello on helloEP {
 
   resource function greet(http:Caller caller, http:Request request) returns error? {
       http:Response response = new;
       string payload = readFile("./name.txt");
       response.setTextPayload("Hello " + <@untainted> payload + "\n");
       check caller->respond(response);
   }
}
 
function readFile(string filePath) returns  string {
   io:ReadableByteChannel bchannel = checkpanic io:openReadableFile(filePath);
   io:ReadableCharacterChannel cChannel = new io:ReadableCharacterChannel(bchannel, "UTF-8");
 
   var readOutput = cChannel.read(50);
   if (readOutput is string) {
       return <@untainted> readOutput;
   } else {
       return "Error: Unable to read file";
   }
}
```

This sample sends a greeting to the caller by getting the name from a text file. When this is run in a container, you need to copy the `name.txt` file into the Docker image. The `@docker:CopyFiles` annotation is used for this and you can give multiple files by following the syntax below.

```
@docker:CopyFiles {
   files: [
       { sourceFile: "./name.txt", target: "/home/ballerina/name.txt" },
	{ sourceFile: "./abc.txt", target: "/home/ballerina/abc.txt" }
   ]
}
```

#### Steps to run

1. Create a `name.txt` file in the same directory in which the `copy_file.bal` file resides.

    ```
    > echo Ballerina > ./name.txt
    ```

2. Compile the `copy_file.bal` file.

    ```
    > ballerina build copy_file.bal 
    Compiling source
      copy_file.bal

    Generating executables
      copy_file.jar

    Generating docker artifacts...
      @docker 		 - complete 2/2 

      Run the following command to start a Docker container:
      docker run -d -p 9090:9090 copy_file:latest
    ```

    The artifacts files below will be generated with the build process.

    ```
    > tree
    .
    ├── copy_file.bal
    ├── copy_file.jar
    ├── docker
    │   ├── Dockerfile
    │   └── name.txt
    └── name.txt

    1 directory, 5 files
    ```

    > **Note:** The generated Dockerfile includes the COPY command to copy files that are defined by the `@docker:CopyFiles` annotation.

    ```
    # Auto Generated Dockerfile
    FROM ballerina/jre8:v1

    LABEL maintainer="dev@ballerina.io"

    RUN addgroup troupe \
        && adduser -S -s /bin/bash -g 'ballerina' -G troupe -D ballerina \
        && apk add --update --no-cache bash \
        && chown -R ballerina:troupe /usr/bin/java \
        && rm -rf /var/cache/apk/*

    WORKDIR /home/ballerina

    COPY copy_file.jar /home/ballerina
    COPY name.txt /home/ballerina/name.txt

    EXPOSE  9090
    USER ballerina

    CMD java -jar copy_file.jar
    ```

3. Verify that the Docker image is created.

    ```
    > docker images
    REPOSITORY          TAG        IMAGE ID            CREATED             SIZE
    copy_file           latest     cc198c0af86e        6 minutes ago       134MB
    ```

4. Run the Docker image as a container (use the command below printed in step 1).

    ```
    > docker run -d -p 9090:9090 copy_file:latest
    d9f72d8ef6b2f27df099cc3e57676aeb3110c330004b5539e557ec49cf50878a
    ```

5. Verify that the Docker container is running.

    ```
    > docker ps 
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
    d9f72d8ef6b2        copy_file:latest    "/bin/sh -c 'java -j…"   15 seconds ago      Up 15 seconds       0.0.0.0:9090->9090/tcp   inspiring_joliot
    ```

6. Access the hello world service with the cURL command below.

    ```
    > curl http://localhost:9090/hello/greet
    Hello Ballerina
    ```

7. Clean up the used artifacts.

    ```
    > docker kill d9f72d8ef6b2
    d9f72d8ef6b2

    > docker rm d9f72d8ef6b2
    d9f72d8ef6b2

    > docker rmi cc198c0af86e
    ```

### Using a custom base image to build Ballerina Docker images

Ballerina ships a base image (e.g., `ballerina/jre8:v1`) with some security hardening. It is used to build Docker images with the user's application code. However, sometimes, you might need to use your own Docker base image depending on your company policies or any additional requirements. This use case shows how to use a custom Docker base image to build Ballerina Docker images with the application code. 

#### Prerequisites

You need a machine with [Docker](https://docs.docker.com/get-docker/) installed.

#### Sample source code

`base_image.bal`

```ballerina
import ballerina/http;
import ballerina/docker;
 
@docker:Config {
   name: "helloworld_custom_baseimage",
   baseImage: "openjdk:8-jre-alpine"
}
service hello on new http:Listener(9090){
 
  resource function sayHello(http:Caller caller,http:Request request) returns error? {
      check caller->respond("Hello World!");
  }
}
```

> **Note:** This sample uses `openjdk:8-jre-alpine` as the custom Docker image by using the `baseImage` property in the `@docker:Config` annotation.

#### Steps to run

1.  Compile the `base_image.bal` file.

    ```
    > ballerina build base_image.bal 
    Compiling source
      base_image.bal

    Generating executables
      base_image.jar

    Generating docker artifacts...
      @docker 		 - complete 2/2 

      Run the following command to start a Docker container:
      docker run -d -p 9090:9090 helloworld_custom_baseimage:latest
    ```

    The artifact files below will be generated with the build process.

    ```
    tree
    .
    ├── base_image.bal
    ├── base_image.jar
    └── docker
        └── Dockerfile

    1 directory, 3 files
    ```

    The Dockerfile will be generated as follows.

    > **Note:**  The FROM section of the Dockerfile has the base image, which is defined by the `@docker:Config` annotation.

    ```
    # Auto Generated Dockerfile
    FROM openjdk:8-jre-alpine

    LABEL maintainer="dev@ballerina.io"

    WORKDIR /home/ballerina

    COPY base_image.jar /home/ballerina

    EXPOSE  9090
    CMD java -jar base_image.jar
    ```

2. Verify that the Docker image is created.

    ```
    > docker images
    REPOSITORY     			TAG  		IMAGE ID            CREATED             SIZE
    helloworld_custom_baseimage      latest    	4468889e4ed0        11 minutes ago      109MB
    ```

3. Run the Docker image as a container (use the command below printed in step 1).

    ```
    > docker run -d -p 9090:9090 helloworld_custom_baseimage:latest
    0c31cfaf483493988ee9ace73f6bcf9188a80d33ac3640052265c316058ec55a

    ```

4. Verify that the Docker container is running.

    ```
    > docker ps
    CONTAINER ID        IMAGE                                COMMAND                  CREATED             STATUS              PORTS                    NAMES
    0c31cfaf4834        helloworld_custom_baseimage:latest   "/bin/sh -c 'java -j…"   17 seconds ago      Up 16 seconds       0.0.0.0:9090->9090/tcp   charming_hypatia

    ```

5. Access the hello world service with the cURL command below.

    ```
    > curl http://localhost:9090/hello/sayHello
    Hello World!
    ```

6. Clean up the used artifacts.

    ```
    > docker kill 0c31cfaf4834
    0c31cfaf4834

    > docker rm 0c31cfaf4834
    0c31cfaf4834

    > docker rmi 4468889e4ed0
    Untagged: helloworld_custom_baseimage:latest
    ```

### Overriding the CMD of the generated Ballerina Dockerfile

The Ballerina Docker image builder uses the generic CMD command to execute the created JAR file. However, sometimes, you might need to override the default CMD command. This use case shows how to override the default CMD command.

### Prerequisites

You need a machine with [Docker](https://docs.docker.com/get-docker/) installed.

#### Sample source code

`docker_cmd.bal`

```ballerina

import ballerina/http;
import ballerina/docker;
 
@docker:Config {
   name: "custome_cmd",
   cmd: "CMD java -jar ${APP} --b7a.http.accesslog.console=true"
}
service hello on new http:Listener(9090){
 
  resource function sayHello(http:Caller caller,http:Request request) returns error? {
      check caller->respond("Hello World!");
  }
}
```

This sample enables HTTP trace logs by overriding the CMD value of the generated Dockerfile. The cmd field will be as `CMD java -jar ${APP} --b7a.http.accesslog.console=true` in the `@docker:Config{}` annotation.

### Steps to run

1. Compile the `base_image.bal` file.

    ```
    > ballerina build docker_cmd.bal
    Compiling source
      docker_cmd.bal

    Generating executables
      docker_cmd.jar

    Generating docker artifacts...
      @docker 		 - complete 2/2 

      Run the following command to start a Docker container:
      docker run -d -p 9090:9090 custome_cmd:latest
    ```

    The artifact files below will be generated with the build process.

    > **Note:** The CMD line will be updated with the custom command defined in the annotation.

    ```
    > tree
    .
    ├── docker
    │   └── Dockerfile
    ├── docker_cmd.bal
    └── docker_cmd.jar

    1 directory, 3 files
    ```

    The Dockerfile will be generated as follows.

    ```
    # Auto Generated Dockerfile
    FROM ballerina/jre8:v1

    LABEL maintainer="dev@ballerina.io"

    RUN addgroup troupe \
        && adduser -S -s /bin/bash -g 'ballerina' -G troupe -D ballerina \
        && apk add --update --no-cache bash \
        && chown -R ballerina:troupe /usr/bin/java \
        && rm -rf /var/cache/apk/*

    WORKDIR /home/ballerina

    COPY docker_cmd.jar /home/ballerina

    EXPOSE  9090
    USER ballerina

    CMD java -jar docker_cmd.jar --b7a.http.accesslog.console=true
    ```

2. Verify that the Docker image is created.

    ```
    > docker images
    REPOSITORY          TAG        IMAGE ID            CREATED             SIZE
    custome_cmd         latest     08611185ed10        10 minutes ago      134MB
    ```

3. Run the Docker image as a container (use the command below printed in step 1).

    ```
    > docker run -d -p 9090:9090 custome_cmd:latest
    0f66739200dc07d667229f49b66beaf8135e0f9bb000feea23aaa5f9a7cc1d18
    ```

4.  Verify that the Docker container is running.

    ```
    > docker ps
    CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES
    0f66739200dc        custome_cmd:latest   "/bin/sh -c 'java -j…"   55 seconds ago      Up 55 seconds       0.0.0.0:9090->9090/tcp   pensive_jackson
    ```

5. Access the hello world service with the cURL command below.

    ```
    > curl http://localhost:9090/hello/sayHello
    Hello World!
    ```

6. View the HTTP access logs.

    ```
    > docker logs 0f66739200dc
    ballerina: HTTP access log enabled
    [ballerina/http] started HTTP/WS listener 0.0.0.0:9090
    172.17.0.1 - - [14/Jun/2020:04:38:22 +0000] "GET /hello/sayHello HTTP/1.1" 200 12 "-" "curl/7.64.1" 
    172.17.0.1 - - [14/Jun/2020:04:38:23 +0000] "GET /hello/sayHello HTTP/1.1" 200 12 "-" "curl/7.64.1"
    ```

7. Clean up the created artifacts.

    ```
    > docker kill 0f66739200dc
    0f66739200dc

    > docker rm 0f66739200dc
    0f66739200dc

    > docker rmi 08611185ed10
    Untagged: custome_cmd:latest
    ```

### Creating multiple Docker images corresponding to modules of a Ballerina project

This use case shows how to add the Docker annotation to a Ballerina project to create the corresponding Docker images.

### Prerequisites

You need a machine with [Docker](https://docs.docker.com/get-docker/) installed.

#### Sample source code

1. Ballerina project to call the restaurant:

    ```ballerina
    > ballerina new restaurant
    Created new Ballerina project at restaurant

    Next:
        Move into the project directory and use `ballerina add <module-name>` to
        add a new Ballerina module.
    ```

2. The two modules to call and order pizzas and burgers:

    ```ballerina
    > ballerina add pizza
    Added new ballerina module at 'src/pizza'

    > ballerina add burger 
    Added new ballerina module at 'src/burger'
    ```

3. Source code of `src/pizza` for the order:

    `pizza_menu.bal`

    ```ballerina
    import ballerina/http;
    import ballerina/docker;
    
    @docker:Config {
      name: "pizza"
    }
    service pizza on new http:Listener(9090){
    
      resource function menu(http:Caller caller,http:Request request) returns error? {
          check result = caller->respond("Pizza Menu");
      }
    }
    ```

4. Source code of `src/burger` for the order:

    `burger_menu.bal`

    ```ballerina
    import ballerina/http;
    import ballerina/docker;
    
    @docker:Config {
      name: "burger"
    }
    service burger on new http:Listener(8080){
    
      resource function menu(http:Caller caller,http:Request request) returns error? {
          check result = caller->respond("Burger Menu");
      }
    }
    ```

#### Steps to run

1. Compile the Ballerina project.

    ```
    > ballerina build -a
    Compiling source
      lakmal/burger:0.1.0
      lakmal/pizza:0.1.0

    Creating balos
      target/balo/burger-2020r1-any-0.1.0.balo
      target/balo/pizza-2020r1-any-0.1.0.balo

    Running Tests
      lakmal/burger:0.1.0
    [ballerina/http] started HTTP/WS listener 0.0.0.0:8080
    I'm the before suite function!
    I'm the before function!
    I'm in test function!
    I'm the after function!
    I'm the after suite function!
    [ballerina/http] stopped HTTP/WS listener 0.0.0.0:8080

      [pass] testFunction

      1 passing
      0 failing
      0 skipped

      lakmal/pizza:0.1.0
    [ballerina/http] started HTTP/WS listener 0.0.0.0:9090
    I'm the before suite function!
    I'm the before function!
    I'm in test function!
    I'm the after function!
    I'm the after suite function!
    [ballerina/http] stopped HTTP/WS listener 0.0.0.0:9090

      [pass] testFunction

      1 passing
      0 failing
      0 skipped


    Generating executables
      target/bin/burger.jar
      target/bin/pizza.jar

    Generating docker artifacts...
      @docker 		 - complete 2/2 

      Run the following command to start a Docker container:
      docker run -d -p 8080:8080 burger:latest


    Generating docker artifacts...
      @docker 		 - complete 2/2 

      Run the following command to start a Docker container:
      docker run -d -p 9090:9090 pizza:latest
    ```

    The artifact files below will be generated with the build process.

    ```
    > tree
    .
    ├── Ballerina.lock
    ├── Ballerina.toml
    ├── src
    │   ├── burger
    │   │   ├── Module.md
    │   │   ├── burger_menu.bal
    │   │   ├── main.bal
    │   │   ├── resources
    │   │   └── tests
    │   │       ├── main_test.bal
    │   │       └── resources
    │   └── pizza
    │       ├── Module.md
    │       ├── main.bal
    │       ├── pizza_menu.bal
    │       ├── resources
    │       └── tests
    │           ├── main_test.bal
    │           └── resources
    └── target
        ├── balo
        │   ├── burger-2020r1-any-0.1.0.balo
        │   └── pizza-2020r1-any-0.1.0.balo
        ├── bin
        │   ├── burger.jar
        │   └── pizza.jar
        ├── caches
        │   ├── bir_cache
        │   │   └── lakmal
        │   │       ├── burger
        │   │       │   └── 0.1.0
        │   │       │       └── burger.bir
        │   │       └── pizza
        │   │           └── 0.1.0
        │   │               └── pizza.bir
        │   ├── jar_cache
        │   │   └── lakmal
        │   │       ├── burger
        │   │       │   └── 0.1.0
        │   │       │       ├── lakmal-burger-0.1.0-testable.jar
        │   │       │       └── lakmal-burger-0.1.0.jar
        │   │       └── pizza
        │   │           └── 0.1.0
        │   │               ├── lakmal-pizza-0.1.0-testable.jar
        │   │               └── lakmal-pizza-0.1.0.jar
        │   └── json_cache
        │       └── lakmal
        │           ├── burger
        │           │   └── 0.1.0
        │           │       └── test_suit.json
        │           └── pizza
        │               └── 0.1.0
        │                   └── test_suit.json
        └── docker
            ├── burger
            │   └── Dockerfile
            └── pizza
                └── Dockerfile

    34 directories, 24 files
    ```

2. Verify that the Docker image is created.

    ```
    > docker images
    REPOSITORY       TAG           IMAGE ID            CREATED             SIZE
    pizza            latest        72d12aa57bc1        2 minutes ago       134MB
    burger           latest        d3facfd62996        2 minutes ago       134MB
    ```

3. Run the Docker image as a container (use the command below printed in step 1).

    ```
    > docker run -d -p 8080:8080 burger:latest
    1d3b98286a45c2feeae607719c1a58d1c6b9daa57889cff37894cb42490d15de

    > docker run -d -p 9090:9090 pizza:latest
    c6bfd238515265fb2909d74c3d862830712019c0681f75e7400e7a90833ce84a
    ```

4. Verify that the Docker container is running.

    ```
    > docker ps
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
    c6bfd2385152        pizza:latest        "/bin/sh -c 'java -j…"   15 seconds ago      Up 14 seconds       0.0.0.0:9090->9090/tcp   romantic_lovelace
    1d3b98286a45        burger:latest       "/bin/sh -c 'java -j…"   47 seconds ago      Up 46 seconds       0.0.0.0:8080->8080/tcp   priceless_rhodes
    ```

5. Access the pizza service and burger service with the cURL command below.

    ```
    > curl http://localhost:9090/pizza/menu
    Pizza Menu

    > curl http://localhost:8080/burger/menu
    Burger Menu
    ```

6. Clean up the created artifacts.

    ```
    > docker kill c6bfd2385152
    C6bfd2385152
    > docker kill 1d3b98286a45
    1d3b98286a45

    > docker rm c6bfd2385152
    C6bfd2385152
    > docker rm 1d3b98286a45
    1d3b98286a45


    > docker rmi 72d12aa57bc1
    Untagged: pizza:latest
    > docker rmi d3facfd62996
    Untagged: burger:latest
    ```

## Troubleshooting

Mini-kube users should configure the annotations below in every sample with valid values.

```
@docker:Config {
   		dockerHost: "tcp://192.168.99.100:2376",
   		dockerCertPath: "/Users/lakwarus/.minikube/certs"
}
```