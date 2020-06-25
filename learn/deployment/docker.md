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

The Ballerina compiler is capable of creating optimized Docker images out of the application source code. This guide includes step-by-step instructions on different use cases and executing sample source code with respect to them. 

## Enabling Docker support

Docker support is inbuilt and comes by default in any Ballerina distribution. You can enable Docker artifact generation by adding annotations to your Ballerina code. Follow the steps below to enable Docker support.

1. Import the Docker extension module in your Ballerina code (e.g., `import ballerina/docker;`).

2. Add the relevant annotations within the code (e.g., `@docker:Config {}`).

3. Build the Ballerina source file/project (e.g., `ballerina build source.bal`).

## Usecases

### Run a Ballerina service in a Docker container

This usecase shows how to run a Ballerina service in a Docker container. The sample below demonstrates running a simple Ballerina hello world service in a Docker container. 

#### Prerequisites

You need a machine with [Docker](https://docs.docker.com/get-docker/) installed.

#### Sample source code

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
*code-listing 1:hello_world_docker.bal*

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

2. The artifacts files below will be generated with the build process.

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

3. Verify that the Docker image is created.

```
> docker images
REPOSITORY          TAG         IMAGE ID            CREATED             SIZE
hello_world_docker  latest      e48123737a65        7 minutes ago       134MB

```
Since the annotation is not configured to have a custom Docker image name and tag, the build process will create a Docker image with the default values: the file name of the generated .jar file with the latest tag (e.g., `hello_world_docker:latest`).

4. Run the Docker image as a container (use the below command printed in step 1).

```
> docker run -d -p 9090:9090 hello_world_docker:latest
32461676d3c22848088390483a414e5b1d11a7a73c2296eccb18e6c9f27c41c0
```

5. Verify that the Docker container is running.

```
> docker ps
CONTAINER ID  IMAGE    		 COMMAND    	      CREATED              STATUS            PORTS     NAMES
32461676d3c2  hello_world_docker:latest  "/bin/sh -c 'java -j…"   About a minute ago   Up About a minute 0.0.0.0:9090->9090/tcp    lucid_turing
```

6. Access the hello world service with the cURL command.

```
> curl http://localhost:9090/hello/sayHello           
Hello World!
```

7. Clean up the used artifacts.

```
Stop / kill running docker container
> docker kill 32461676d3c2
32461676d3c2

Remove docker container files
> docker em 32461676d3c2

Remove docker image
> docker rmi e48123737a65
```

### Creating a Ballerina Docker image with custom image-name and tag, and then push it autimatically to a Docker registry

This usecase shows how to run a simple Ballerina hello world service in a Docker container with annotation configurations to create a Docker image with the custom image-name, tag, and then automatically push the created image to the Docker registry.

#### Prerequisites

- A machine with [Docker](https://docs.docker.com/get-docker/) installed.
- A [Docker Hub](https://hub.docker.com/) account

#### Sample source code

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

*code-listing 2:custom_docker_name.bal*

In this sample, the following properties are set in the `@docker:Config` annotation.

- push		  : Enable pushing Docker image to the registry 
- registry	: Docker registry URL
- name		  : Name of the Docker image
- tag		    : Docker image tag (version) 
- username	: Username for the Docker registry
- password	: Password for the Docker registry

`$env` is used to read the environment variables values from the system.

#### Steps to run



