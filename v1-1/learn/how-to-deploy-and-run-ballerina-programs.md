---
layout: ballerina-inner-page
title: How to Run and Deploy Ballerina Programs
permalink: /v1-1/learn/how-to-deploy-and-run-ballerina-programs/

---

# How to Run and Deploy Ballerina Programs

## Running Ballerina Programs and Services
A Ballerina application can have:

1. A [`main()`](/v1-1/learn/by-example/the-main-function.html) function that runs as a terminating process.

2. A [`service`](/v1-1/learn/by-example/hello-world-service.html), which is a hosted non-terminating process.

Both of these are considered as entry points for program execution. 

These applications can be structured into a single program file or a Ballerina module. A collection of modules can be managed together with versioning and dependency management as part of a Ballerina project. 

Source files and modules can contain zero or more entrypoints, and the runtime engine has precedence and sequence rules for choosing which entrypoint to execute.

### Running Standalone Source Code
A single Ballerina source code file can be placed into any folder. 

If the source file contains at least one entry point, it can be executed using the `run` command.
    
```bash
$ ballerina run foo.bal
```

You can compile a source file with an entry point into an executable jar.
    
```bash
$ ballerina build [-o outputfilename.jar] foo.bal
```  

And you can run `.jar` files directly:
```bash
$ ballerina run filename.jar
```

### Running a Project
A project is a folder that manages modules as part of a common versioning, dependency management, build, and execution. You can build and run items collectively or individually as modules. See [How To Structure Ballerina Code](/v1-1/learn/how-to-structure-ballerina-code) for in-depth structuring of projects.

Build all modules of a project:
```bash    
$ ballerina build
```

Build a single module in a project:
```bash
$ ballerina build <module-name>
```

Options for running programs with entrypoints in a project:  
```bash
$ ballerina run main.bal
$ ballerina run main.jar
```

## Configuring Your Ballerina Runtimes

### Ballerina Runtime Configuration Files

A Ballerina runtime can be configured using configuration parameters, which are arbitrary key/value pairs with structure. The `ballerina/config` module provides an API for sourcing configuration parameters and using them within your source code. See [Config API Documentation](/v1-1/learn/api-docs/ballerina/config/index.html) for details.

The configuration APIs accept a key and an optional default value. If a mapping does not exist for the specified key, the default value is returned as the configuration value. The default values of these optional configurations are the default values of the return types of the functions.

### Sourcing Parameters Into Ballerina Programs
Configuration parameters for your programs and apps can be defined on the CLI, as an environment variable, or from a configuration file, with loading and override precedence in the same order.

#### Sourcing CLI Parameters
Consider the following example, which reads a Ballerina config value and prints it.

```ballerina
import ballerina/io;
import ballerina/config;

public function main() {
  string name = config:getAsString("hello.user.name");
  io:println("Hello, " + name + " !");
}
```

The config key is `hello.user.name`. To pass a value to this config from the CLI, we can use `--key=value` format as the following command.
```bash
$ ballerina run  main.bal --hello.user.name=Ballerina
Hello, Ballerina !
```

#### Sourcing Configuration Values

The value can be passed as a config file as well. A configuration file should conform to the [TOML](https://github.com/toml-lang/toml) format. Ballerina only supports the following features of TOML: value types (string, int, float, and boolean), tables, and nested tables. Given below is a sample `ballerina.conf`:

```toml
[hello.user]
name="Ballerina"
```

When running a program with config API lookups, Ballerina looks for a `ballerina.conf` file in the directory where the source files are located.

If `ballerina.conf` resides in the same directory as `main.bal`, `balllerina run` can be used without any argument.
```bash
$ ballerina run main.bal
Hello, Ballerina !
```
To explicitly specify a configuration file, use the `--b7a.config.file` property. The path to the configuration file can be either an absolute or a relative path. 
```bash
$ ballerina run main.bal --b7a.config.file=path/to/conf/file/custom-config-file-name.conf
Hello, Ballerina !
```


#### Configure Secrets as Configuration Items
Ballerina provides support for encrypting sensitive data such as passwords and allows access to them securely through the configuration API in the code.

##### Creating a Secured Value
The `ballerina encrypt` command will encrypt parameters that can be securely sourced from your code files. For example, let's create a secure parameter named `Ballerina` with the value `12345` as the secret.

```ballerina
$ ballerina encrypt
Enter value:
Enter secret:
Re-enter secret to verify:
Add the following to the runtime config:
<key>="@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}"

Or add to the runtime command line:
--<key>=@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}
```

##### Using the Secured Value at Runtime
The secured value can be placed in a config file as a value or passed on the command line. 

```
[hello.user]
name="@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}"
```

or (Enter secret `12345` when prompted.):

```bash
$ ballerina run main.bal --hello.user.name=@encrypted:{Z1CfAJwCEzmv2JNXIPnR/9AXHqOJqnDaaAQ7HsggGLQ=}
ballerina: enter secret for config value decryption:

Hello, Ballerina !
```

##### Decrypting the Value
If a configuration contains an encrypted value, Ballerina looks for a `secret.txt` file in the directory where the source files are located. The `secret.txt` should contain the secret used to encrypt the value. The `secret.txt` file will be deleted after it is read.
```bash
$ echo 12345 > secret.txt
$ ballerina run main.bal --b7a.config.file=ballerina.conf
Hello, Ballerina !
```


If the `secret.txt` file is not present, then CLI prompts the user for the secret. Enter secret `12345` when prompted.
```bash
$ ballerina run main.bal --b7a.config.file=ballerina.conf
ballerina: enter secret for config value decryption:

Hello, Ballerina !
```

## Deploying Ballerina Programs and Services
Deploying a Ballerina program or service is the process of creating assets that ready the program and services(s) for activation in another runtime, such as Docker Engine, Moby, Kubernetes, or Cloud Foundry. The Ballerina compiler is able to generate the necessary artifacts for different deployment annotations based upon annotations that decorate the source code, which provide compiler instructions for artifact generation.

### How Deployment Works
Ballerina has builder extensions that run after the compilation phase. These extensions analyze code to generate deployment artifacts and utilities to make deployment of your apps and services easier.

When you start building a project, the system starts parsing. This is followed by dependency analysis, compilation, and a phase at which deployment artifact generation can take place.

These deployment artifacts can be a form of simple files or complex types, like container images, virtual images, etc. The Ballerina builder extension supports the following list of deployment artifacts.

-   [Dockerfiles](https://docs.docker.com/engine/reference/builder/)
-   [Docker images](https://docs.docker.com/engine/reference/commandline/images/)
-   [Kubernetes](http://kubernetes.io) artifacts

It is possible for third parties and the ecosystem to create their own annotations and builder extensions that generate different kinds of deployment artifacts. You can publish these extensions within Ballerina Central for others to use.


### How to Enable Deployment
A developer enables deployment artifact generation by adding annotations to their Ballerina code: 

1.  Import the relevant extension module in the code.
2.  Add relevant annotations within the code. 
3.  Build the Ballerina project.

#### Docker-Based Deployment

See the following example on how a developer can add Docker support in the code.

Add the following code to the `hello_world_docker.bal` file.

```ballerina
import ballerina/docker;
import ballerina/http;
import ballerina/log;

@http:ServiceConfig {
    basePath: "/helloWorld"
}
@docker:Config {
    registry: "docker.abc.com",
    name: "helloworld",
    tag: "v1.0"
}
service helloWorld on new http:Listener(9090) {
    resource function sayHello(http:Caller caller, http:Request request) {
        http:Response response = new;
        response.setTextPayload("Hello, World! \n");
        var result = caller->respond(response);
        if (result is error) {
            log:printError("error sending response", result);
        }
    }
}
```

Now your code is ready to generate deployment artifacts. In this case it is a Docker image.
  
```bash
$ ballerina build hello_world_docker.bal  
Compiling source
        hello_world_docker.bal
Generating executables
        hello_world_docker.jar

Generating docker artifacts...
        @docker                  - complete 2/2 

        Run the following command to start a Docker container:
        docker run -d -p 9090:9090 docker.abc.com/helloworld:v1.0
```
  
```bash
$ tree  
.
├── docker
│   └── Dockerfile
├── hello_world_docker.bal
└── hello_world_docker.jar

1 directory, 3 files
```
```bash
$ docker images  
REPOSITORY                  TAG                 IMAGE ID            CREATED              SIZE
docker.abc.com/helloworld   v1.0                154053b4e4cd        About a minute ago   108MB
```
  
You can run a Docker container by copying and pasting the Docker `run` command that displays as output of the Ballerina `build` command.
```bash
$ docker run -d -p 9090:9090 docker.abc.com/helloworld:v1.0
938761fa222fde551c5092b7f5fda2a72c3cd43178c7fd86f43f678ec5227d35
```

```bash
$ docker ps  
CONTAINER ID        IMAGE                            COMMAND                  CREATED             STATUS              PORTS                    NAMES
938761fa222f        docker.abc.com/helloworld:v1.0   "/bin/sh -c 'java -j…"   18 seconds ago      Up 17 seconds       0.0.0.0:9090->9090/tcp   brave_hamilton
```
Invoke the hello world service with a cURL command:
```bash 
$ curl http://localhost:9090/helloWorld/sayHello  
Hello, World!
```

The following features are supported by the Docker builder extension.

-   Dockerfile generation
-   Docker image generation
-   Docker push support with Docker registry
-   Docker-based Ballerina debug support
-   Copy file support
    
##### Supported Docker Annotations

**@docker:Config{}**
- Supported with Ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Docker image|output `.jar` file name|
|registry|Docker registry|None|
|tag|Docker image tag|latest|
|buildImage|Whether to build Docker image|true|
|dockerHost|Docker host IP and Docker PORT (e.g., minikube IP and Docker PORT)|unix:///var/run/docker.sock|
|dockerCertPath|Docker cert path|null|
|baseImage|Base image to create the Docker image|ballerina/ballerina:latest|
|enableDebug|Enable debug for Ballerina|false|
|debugPort|Remote debug port|5005|
|push|Push to remote registry|false|
|username|Username for Docker registry|None|
|password|Password for Docker registry|None|

**@docker:CopyFiles{}**
- Supported with Ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|sourceFile|Source path of the file (on your machine)|None|
|target|Target path (inside container)|None|
|isBallerinaConf|Whether the file is a Ballerina config file|false|

**@docker:Expose{}**
- Supported with Ballerina endpoints.

For more information, see the [Docker build extension GitHub repo](https://github.com/ballerinax/docker).

#### Kubernetes-Based Deployment

The Kubernetes builder extension offers native support for running Ballerina programs on Kubernetes with the use of annotations that you can include as part of your service code. Also, it will take care of the creation of the Docker images, so you don't need to explicitly create Docker images prior to deployment on Kubernetes.

The following Kubernetes configurations are supported:
- Kubernetes deployment support
- Kubernetes service support
- Kubernetes liveness probe support
- Kubernetes ingress support
- Kubernetes horizontal pod autoscaler support
- Docker image generation
- Docker push support with remote Docker registry
- Kubernetes secret support
- Kubernetes config map support
- Kubernetes persistent volume claim support

The following Ballerina code section explains how you can use some of these Kubernetes capabilities by using Kubernetes annotation support in Ballerina.

```ballerina
import ballerina/config;
import ballerina/http; 
import ballerina/jdbc; 
import ballerina/kubernetes;

// Create SQL endpoint to MySQL database
jdbc:Client employeeDB = new ({
    url:config:getAsString("db-url"),
    username:config:getAsString("db-username"),
    password:config:getAsString("db-password")
});

@kubernetes:Ingress {
    hostname:"ballerina.guides.io",
    name:"ballerina-guides-employee-database-service",
    path:"/"
}
@kubernetes:Service {
    serviceType:"NodePort",
    name:"ballerina-guides-employee-database-service"
}
listener http:Listener ep = new (9090, config = {
    secureSocket:{
        keyStore:{
            path:"${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password:config:getAsString("key-store-password")
        },
        trustStore:{
            path:"${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password:config:getAsString("trust-store-password")
        }
    }
});

@kubernetes:ConfigMap {
    ballerinaConf:"conf/data-service.conf"
}
@kubernetes:Deployment {
    image:"ballerina.guides.io/employee_database_service:v1.0",
    name:"ballerina-guides-employee-database-service",
    copyFiles:[{target:"/ballerina/runtime/bre/lib",
                sourceFile:"conf/mysql-connector-java-8.0.11.jar"}]
}
@http:ServiceConfig {
    basePath:"/records"
}
service employee_data_service on ep {
```

Sample content of `data-service.conf`:

```toml
# Ballerina database config file
db-url = "jdbc:mysql://mysql-server:3306/EMPLOYEE_RECORDS"
db-username = "root"
db-password = "root"
key-store-password = "abc123"
trust-store-password = "xyz123"
```

Here we have used `@kubernetes:Deployment` to specify the Docker image name that will be created as part of building this service. The `CopyFiles` field is used to copy the MySQL JAR file into the Ballerina `bre/lib` folder.

The `@kubernetes:Service {}` annotation will create a Kubernetes service that will expose the Ballerina service running on a Pod.

In addition, you can use `@kubernetes:Ingress`, which is the external interface to access your service (with path / and host name `ballerina.guides.io`).

Minikube users please see the [Kubernetes Extension samples](https://github.com/ballerinax/kubernetes/tree/master/samples) for additional configurations required for Minikube.

Now you can use the following command to build the Ballerina service that we developed above. This will also create the corresponding Docker image and the Kubernetes artifacts using the Kubernetes annotations that you have configured above.

```bash
$ ballerina build data_backed_service.bal
Compiling source
 	data_backed_service.bal

Generating executables
 	data_backed_service.jar

Generating artifacts...

@kubernetes:Service                     - complete 1/1
@kubernetes:Ingress                     - complete 1/1
@kubernetes:Secret                      - complete 1/1
@kubernetes:ConfigMap                	- complete 1/1
@kubernetes:Docker                      - complete 3/3 
@kubernetes:Deployment                  - complete 1/1

Run the following command to deploy the Kubernetes artifacts: 
kubectl apply -f ./kubernetes/

```
You can use the `docker images` command to verify that the Docker image that we specified in `@kubernetes:Deployment` was created. The Kubernetes artifacts related to your service will be generated in addition to the `.balx` file.

```bash
$ tree
├── conf
│   ├── ballerina.conf
│   └── mysql-connector-java-8.0.11.jar
├── data_backed_service.bal
├── data_backed_service.jar
└── kubernetes
    ├── data_backed_service_config_map.yaml
    ├── data_backed_service_deployment.yaml
    ├── data_backed_service_ingress.yaml
    ├── data_backed_service_secret.yaml
    ├── data_backed_service_svc.yaml
    └── docker
        ├── Dockerfile
        └── mysql-connector-java-8.0.11.jar

```

Now you can create the Kubernetes deployment using:

```bash
$ kubectl apply -f ./kubernetes 

configmap "employee-data-service-ballerina-conf-config-map" created
deployment "ballerina-guides-employee-database-service" created
ingress "ballerina-guides-employee-database-service" created
secret "listener-secure-socket" created
service "ballerina-guides-employee-database-service" created
```
You can verify Kubernetes deployment, service, and ingress are running properly by using the following Kubernetes commands.

```bash
$ kubectl get pods
NAME                                                          READY     STATUS    RESTARTS   AGE
ballerina-guides-employee-database-service-57479b7c67-l5v9k   1/1       Running     0          26s
```
This is the container based on the deployment annotation. This container has the `.jar` file, secrets, config-maps, and dependencies wrapped within. 

```bash
$ kubectl get svc
NAME                                         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)          AGE
ballerina-guides-employee-database-service   NodePort    10.96.24.77   <none>        9090:30281/TCP   51s
```
This is the Kubernetes service that exposes the listener endpoint.

```bash
$ kubectl get ingress
NAME                                         HOSTS                 ADDRESS   PORTS     AGE
ballerina-guides-employee-database-service   ballerina.guides.io             80, 443   1m
```
This is the Kubernetes nginx rule that exposes the hostname to the outside world.

```bash
$ kubectl get secrets
NAME                     TYPE                                  DATA      AGE
listener-secure-socket   Opaque                                2         1m
```
The secrets are generated automatically for endpoint keystores and truststores. This secret is mounted to `${ballerina_home}` of the container.

```bash
$ kubectl get configmap
NAME                                              DATA      AGE
employee-data-service-ballerina-conf-config-map   1         2m
```
This is the config-map created for the `ballerina.conf` file, as the `ballerinaConf:"./conf/data-service.conf"` attribute is used. At run time, it is equivalent to:
```bash
$ ballerina run <source>.jar --b7a.config.file=./conf/data-service.conf 
```
The Kubernetes extension automatically passes the config file to the Ballerina program.

If everything is successfully deployed, you can invoke the service either via Node port or ingress.

**Access via Node Port:**
```bash
$ curl -v -X POST -d '{"name":"Alice", "age":20,"ssn":123456789,"employeeId":1}' \
"http://localhost:<Node_Port>/records/employee" -H "Content-Type:application/json" 
```

**Access via Ingress:**

Add an `/etc/hosts` entry to match hostname.

```bash
127.0.0.1 ballerina.guides.io
```
Access the service:

```bash
$ curl -v -X POST -d '{"name":"Alice", "age":20,"ssn":123456789,"employeeId":1}' \
"http://ballerina.guides.io/records/employee" -H "Content-Type:application/json"
```   
    
##### Supported Kubernetes Annotations

**@kubernetes:Deployment{}**
- Supported with Ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the deployment|\<outputfilename\>-deployment|
|labels|Labels for deployment|"app: \<outputfilename\>"|
|replicas|Number of replicas|1|
|enableLiveness|Enable or disable liveness probe|disable|
|initialDelaySeconds|Initial delay in seconds before performing the first probe|10s|
|periodSeconds|Liveness probe interval|5s|
|livenessPort|Port that the liveness probe checks|\<ServicePort\>|
|imagePullPolicy|Docker image pull policy|IfNotPresent|
|image|Docker image with tag|<output file name>:latest|
|env|List of environment variables|null|
|buildImage|Building Docker image|true|
|copyFiles|Copy external files for Docker image|null|
|dockerHost|Docker host IP and Docker PORT (e.g., "tcp://192.168.99.100:2376")|null|
|dockerCertPath|Docker cert path|null|
|push|Push Docker image to registry. This can only be true if image build is true.|false|
|username|Username for the Docker registry|null|
|password|Password for the Docker registry|null|
|baseImage|Base image to create the Docker image|ballerina/ballerina:latest|
|singleYAML|Generate a single yaml file for all k8s resources|false|

**@kubernetes:Service{}**
- Supported with Ballerina endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the service|\<ballerina service name\>-service|
|labels|Labels for the service|"app: \<outputfilename\>"|
|serviceType|Service type of the service|ClusterIP|
|port|Service port|Port of the Ballerina service|

**@kubernetes:Ingress{}**
- Supported with Ballerina endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of Ingress|\<ballerina service name\>-ingress
|labels|Labels for service|"app: \<outputfilename\>"
|hostname|Host name of Ingress|\<ballerina service name\>.com
|path|Resource path.|/
|targetPath|This is used for URL rewrite.|null
|ingressClass|Ingress class|nginx
|enableTLS|Enable ingress TLS|false

**@kubernetes:HPA{}**
- Supported with Ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Horizontal Pod Autoscaler|\<ballerina service name\>-hpa|
|labels|Labels for service|"app: \<outputfilename\>"|
|minReplicas|Minimum number of replicas|No of replicas in deployment|
|maxReplicas|Maximum number of replicas|minReplicas+1|
|cpuPrecentage|CPU percentage to start scaling|50|

**@kubernetes:Secret{}**
- Supported with Ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the secret volume mount|\<service_name\>-secret|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|data|Paths to data files|null|

**@kubernetes:ConfigMap{}**
- Supported with Ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the configmap volume mount|\<service_name\>-config-map|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|ballerinaConf|Ballerina conf file location|null|
|data|Paths to data files|null|

**@kubernetes:PersistentVolumeClaim{}**
- Supported with Ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the volume mount|null|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|false|
|accessMode|Access mode|ReadWriteOnce|
|volumeClaimSize|Size of the volume claim|null|

**@kubernetes:Job{}**
- Supported with the Ballerina `main()` function.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name| Name of the job|\<output file name\>-job|
|labels| Labels for job|"app: \<outputfilename\>"|
|restartPolicy| Restart policy|Never|
|backoffLimit| Restart tries before termination|3|
|activeDeadlineSeconds| Active deadline seconds|20|
|schedule| Schedule for cron jobs|none|
|imagePullPolicy|Docker image pull policy|IfNotPresent|
|image|Docker image with tag|\<output file name\>:latest|
|env|List of environment variables|null|
|buildImage|Building Docker image|true|
|dockerHost|Docker host IP and Docker PORT (e.g., "tcp://192.168.99.100:2376")|null|
|dockerCertPath|Docker cert path|null|
|push|Push Docker image to registry. This can only be true if image build is true.|false|
|username|Username for the Docker registry|null|
|password|Password for the Docker registry|null|
|baseImage|Base image to create the Docker image|ballerina/ballerina:latest|
  
### Extend Ballerina Deployment and Annotations
Ballerina can be augmented with your own annotations that represent your own unique deployment artifacts. You can also write builder extensions that generate these files during compilation.
