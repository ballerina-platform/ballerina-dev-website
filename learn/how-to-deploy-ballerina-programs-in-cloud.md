---
layout: ballerina-left-nav-pages
title: How to Deploy Ballerina Programs and Services in the Cloud
description: See how the Ballerina compiler generates the necessary artifacts to deploy to cloud platforms like Kubernetes, Docker, Moby or Cloud Foundry.
keywords: ballerina, programming language, services, cloud
permalink: /learn/how-to-deploy-ballerina-programs-in-cloud/
active: how-to-deploy-ballerina-programs-in-cloud
redirect_from:
  - /learn/how-to-deploy-and-run-ballerina-programs/
  - /learn/how-to-deploy-and-run-ballerina-programs
  - /v1-2/learn/how-to-deploy-and-run-ballerina-programs/
  - /v1-2/learn/how-to-deploy-and-run-ballerina-programs

---

# How to Deploy Ballerina Programs and Services in the Cloud

Deploying a Ballerina program or service is the process of creating assets that ready the program and services(s) for activation in another runtime, such as Docker Engine, Moby, Kubernetes, or Cloud Foundry. The Ballerina compiler is able to generate the necessary artifacts for different deployment annotations based upon annotations that decorate the source code, which provide compiler instructions for artifact generation.

### How Deployment Works
Ballerina has builder extensions that run after the compilation phase. These extensions analyze code to generate deployment artifacts and utilities to make deployment of your apps and services easier.

When you start building a project, the system starts parsing. This is followed by dependency analysis, compilation, and a phase at which deployment artifact generation can take place.

These deployment artifacts can be a form of simple files or complex types, like container images, virtual images, etc. The Ballerina builder extension supports the following list of deployment artifacts.

-   [Dockerfiles](https://docs.docker.com/engine/reference/builder/)
-   [Docker images](https://docs.docker.com/engine/reference/commandline/images/)
-   [Kubernetes artifacts](http://kubernetes.io) 

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
- Supported by Ballerina services, listeners, or functions.


|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Docker image|File name of the generated .jar file|
|registry|Docker registry URL|None|
|tag|Docker image tag|latest|
|env|Environment variables of the Docker image|None|
|username|Username for the Docker registry|None|
|password|Password for the Docker registry|None|
|baseImage|Base image to create the Docker image|ballerina/jre8:v1|
|buildImage|Enable building the Docker image|true|
|push|Enable pushing the Docker image to the registry|false|
|enableDebug|Enable debugging for Ballerina|false|
|debugPort|Remote debug port|5005|
|dockerAPIVersion|Docker API Version|None|
|dockerHost|Docker host IP and Docker PORT. ( e.g., Minikube IP and Docker PORT)|DOCKER_HOST environment variable. If `DOCKER_HOST` is unavailable, use "unix:///var/run/docker.sock" for Unix or use "tcp://localhost:2375" for Windows|
|dockerCertPath|Docker certificate path|"DOCKER_CERT_PATH" environment variable|

**@docker:CopyFiles{}**
- Supported by Ballerina services, listeners, or functions.


|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|sourceFile|Source path of the file (in your machine)|None|
|target|Target path (inside container)|None|
|isBallerinaConf|Flag whether the file is a Ballerina config file or not|false|


**@docker:Expose{}**
- Supported by Ballerina listeners.


For more information, see the [Docker build extension GitHub repo](https://github.com/ballerinax/docker).

#### Kubernetes-Based Deployment

The Kubernetes builder extension offers native support for running Ballerina programs on Kubernetes with the use of annotations that you can include as part of your service code. Also, it will take care of the creation of the Docker images, so you don't need to explicitly create Docker images prior to deployment on Kubernetes.

The following Kubernetes configurations are supported:
- Kubernetes deployment support
- Kubernetes service support
- Kubernetes liveness probe support
- Kubernetes readiness probe support
- Kubernetes ingress support
- Kubernetes horizontal pod autoscaler support
- Docker image generation
- Docker push support with remote Docker registry
- Kubernetes secret support
- Kubernetes config map support
- Kubernetes persistent volume claim support
- Kubernetes resource quotas
- Istio gateways support
- Istio virtual services support
- OpenShift build config and image stream support
- OpenShift route support


The following Ballerina code section explains how you can use some of these Kubernetes capabilities by using Kubernetes annotation support in Ballerina.

```ballerina
import ballerina/config;
import ballerina/http;
import ballerina/kubernetes;
import ballerina/log;

@kubernetes:Ingress {
    hostname: "ballerina.guides.io",
    name: "ballerina-guides-user-retrieval-ingress"
}
@kubernetes:Service {
    serviceType: "NodePort",
    name: "ballerina-guides-user-retrieval-service"
}
listener http:Listener userRetrievalEP = new (9090, config = {
    secureSocket: {
        keyStore: {
            path: "./security/ballerinaKeystore.p12",
            password: config:getAsString("keystore-password")
        }
    }
});

@kubernetes:ConfigMap {
    conf: "service-config.toml"
}
@kubernetes:Deployment {
    image: "ballerina.guides.io/user_retrieval_service:v1.0",
    name: "ballerina-guides-user-retrieval-service"
}
@http:ServiceConfig {
    basePath: "/users"
}
service userRetrievalService on userRetrievalEP {
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/{userId}"
    }
    resource function getUserInfo(http:Caller caller, http:Request request, string userId) {
        string name = config:getAsString(string `${<@untainted>userId}.name`);
        string email = config:getAsString(string `${<@untainted>userId}.email`);

        // check if user exists
        json payload = { message: "user not found" };
        if (name != "" && email != "") {
            payload = { 
                name: name, 
                email: email
            };
        }

        var responseResult = caller->respond(payload);
        if (responseResult is error) {
            log:printError("error responding back to client.", responseResult);
        }
    }
}
```

Sample content of `service-config.toml`:

```toml
keystore-password="ballerina"

[john]
name="John Doe"
email="john@ballerina.com"

[jane]
name="Jane Doe"
email="jane@ballerina.com"
```

Here, `@kubernetes:Deployment` is used to specify the Docker image name, which will be created as part of building this service.


The `@kubernetes:Service {}` annotation will create a Kubernetes service that will expose the Ballerina service running on a Pod.

In addition, you can use `@kubernetes:Ingress`, which is the external interface to access your service (with path / and host name `ballerina.guides.io`).

Minikube users please see the [Kubernetes Extension samples](https://github.com/ballerinax/kubernetes/tree/master/samples) for additional configurations required for Minikube.

Create a folder called `security` and copy the [ballerinaKeystore.p12](https://github.com/ballerina-platform/ballerina-lang/raw/v1.2.0/examples/resources/ballerinaKeystore.p12). This is to secure the endpoint of the service.

Now you can use the following command to build the Ballerina service that we developed above. This will also create the corresponding Docker image and the Kubernetes artifacts using the Kubernetes annotations that you have configured above.

```bash
$ ballerina build user_retrieval_service.bal
Compiling source
        user_retrieval_service.bal

Generating executables
        user_retrieval_service.jar

Generating artifacts...

        @kubernetes:Service                      - complete 1/1
        @kubernetes:Ingress                      - complete 1/1
        @kubernetes:Secret                       - complete 1/1
        @kubernetes:ConfigMap                    - complete 1/1
        @kubernetes:Deployment                   - complete 1/1
        @kubernetes:Docker                       - complete 2/2 
        @kubernetes:Helm                         - complete 1/1

        Run the following command to deploy the Kubernetes artifacts: 
        kubectl apply -f ./kubernetes

        Run the following command to install the application using Helm: 
        helm install --name ballerina-guides-user-retrieval-service ./kubernetes/ballerina-guides-user-retrieval-service


```
You can use the `docker images` command to verify that the Docker image specified in the `@kubernetes:Deployment` was created. The Kubernetes artifacts related to your service will be generated in addition to the `.jar` file.


```bash
$ tree
├── service-config.toml
├── user_retrieval_service.bal
├── user_retrieval_service.jar
├── security
│   └── ballerinaKeystore.p12
├── docker
│   └── Dockerfile
├── kubernetes
│   ├── ballerina-guides-user-retrieval-service
│   │   ├── Chart.yaml
│   │   └── templates
│   │       └── user_retrieval_service.yaml
│   └── user_retrieval_service.yaml

```

Now, you can create the Kubernetes deployment using:


```bash
$ kubectl apply -f ./kubernetes 
service/ballerina-guides-user-retrieval-service created
ingress.extensions/ballerina-guides-user-retrieval-ingress created
secret/userretrievalep-keystore created
configmap/userretrievalservice-ballerina-conf-config-map created
deployment.apps/ballerina-guides-user-retrieval-service created
```
You can verify Kubernetes deployment, service, and ingress are running properly by using the following Kubernetes commands.

```bash
$ kubectl get pods
NAME                                                       READY   STATUS    RESTARTS   AGE
ballerina-guides-user-retrieval-service-7cfd8b6874-nkdw9   1/1     Running   0          4s
```
This is the container based on the deployment annotation. This container has the `.jar` file, secrets, config-maps, and dependencies wrapped within. 

```bash
$ kubectl get svc
NAME                                      TYPE           CLUSTER-IP       EXTERNAL-IP                                            PORT(S)                             AGE
ballerina-guides-user-retrieval-service   NodePort       10.96.96.140     <none>                                                 9090:31417/TCP
```
This is the Kubernetes service that exposes the listener endpoint.

```bash
$ kubectl get ingress
NAME                                      HOSTS                 ADDRESS     PORTS     AGE
ballerina-guides-user-retrieval-ingress   ballerina.guides.io   localhost   80, 443   38s
```
This is the Kubernetes nginx rule that exposes the hostname to the outside world.

```bash
$ kubectl get secrets
NAME                       TYPE                                  DATA   AGE
userretrievalep-keystore   Opaque                                1      3m45s
```
The secrets are generated automatically for endpoint keystores.

```bash
$ kubectl get configmap
NAME                                             DATA   AGE
userretrievalservice-ballerina-conf-config-map   1      4m38s
```
This is the config-map created for the `service-config.toml` file, as the `conf: "service-config.toml"` attribute is used. At run time, it is equivalent to:
```bash
$ ballerina run user_retrieval_service.jar --b7a.config.file=service-config.toml 
```
The Kubernetes extension automatically passes the config file to the Ballerina program.

If everything is successfully deployed, you can invoke the service either via Node port or ingress.

**Access via Node Port:**
```bash
$ curl -k https://localhost:31417/users/john 
{"name":"John Doe", "email":"john@ballerina.com"}
```

**Access via Ingress:**

Add an `/etc/hosts` entry to match hostname.

```bash
127.0.0.1 ballerina.guides.io
```

Setup the NGINX Ingress Controller.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.27.0/deploy/static/mandatory.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.27.0/deploy/static/provider/cloud-generic.yaml
kubectl patch deployments -n ingress-nginx nginx-ingress-controller -p '{"spec":{"template":{"spec":{"containers":[{"name":"nginx-ingress-controller","args":["\/nginx-ingress-controller","--configmap=$(POD_NAMESPACE)\/nginx-configuration","--tcp-services-configmap=$(POD_NAMESPACE)\/tcp-services","--udp-services-configmap=$(POD_NAMESPACE)\/udp-services","--publish-service=$(POD_NAMESPACE)\/ingress-nginx","--annotations-prefix=nginx.ingress.kubernetes.io","--annotations-prefix=nginx.ingress.kubernetes.io","--enable-ssl-passthrough"]}]}}}}'
```

Access the service:

```bash
$ curl -kv https://ballerina.guides.io/users/jane 
{"name":"Jane Doe", "email":"jane@ballerina.com"}
```   
    
##### Supported Kubernetes Annotations

**@kubernetes:Deployment{}**
- Supported with Ballerina services, listeners and functions.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the deployment|<BALLERINA_FILE_NAME>-deployment or <BALLERINA_MODULE_NAME>-deployment|
|labels|Labels for deployment|{ app: <OUTPUT_FILE_NAME> }|
|annotations|Annotations for deployment|{}|
|dockerHost|Docker host IP and Docker PORT.(e.g "tcp://192.168.99.100:2376")|DOCKER_HOST environment variable. If `DOCKER_HOST` is unavailable, use "unix:///var/run/docker.sock" for Unix or use "npipe:////./pipe/docker_engine" for Windows 10 or uses "localhost:2375"|
|dockerCertPath|Docker cert path|DOCKER_CERT_PATH environment variable|
|registry|Docker registry URL|null|
|username|Username for the Docker registry|null|
|password|Password for the Docker registry|null|
|baseImage|Base image to create the Docker image|ballerina/jre8:v1|
|image|Docker image with tag|<OUTPUT_FILE_NAME>:latest. If field `registry` is set ,then it will be prepended to the Docker image name as <registry>/<OUTPUT_FILE_NAME>:latest|
|buildImage|Building the Docker image|true|
|push|Push the Docker image to registry. This will be effective if the `buildImage` field of the image is true|false|
|copyFiles|Copy external files of the Docker image|null|
|singleYAML|Generate a single YAML file for all K8s resources|true|
|namespace|Namespace of the deployment|null|
|replicas|Number of replicas|1|
|livenessProbe|Enable or disable liveness probe|false|
|readinessProbe|Enable or disable readiness probe|false|
|imagePullPolicy|Docker image pull policy|IfNotPresent|
|env|List of environment variables|null|
|podAnnotations|Pod annotations|{}|
|podTolerations|Pod tolerations|{}|
|buildExtension|Extension for building Docker images and artifacts|null|
|dependsOn|Listeners on which this deployment depends|null|
|imagePullSecrets|Image pull secret's value|null|
|strategy|Update strategy|null|

**@kubernetes:Service{}**
- Supported by Ballerina services and listeners.


|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Service|<BALLERINA_SERVICE_NAME>-service|
|labels|Labels for the service|{ app: <OUTPUT_FILE_NAME> }|
|portName|Name for the port|The protocol of the listener|
|port|Service port|Port of the Ballerina service|
|targetPort|Target pod(s) port|Port of the Ballerina service|
|nodePort|NodePort to expose the service|None|
|sessionAffinity|Pod session affinity|None|
|serviceType|Service type of the service|ClusterIP|

**@kubernetes:Ingress{}**
- Supported by Ballerina services and listeners.


|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the ingress|<BALLERINA_SERVICE_NAME>-ingress|
|labels|Labels for the service|{ app: <OUTPUT_FILE_NAME> }|
|annotations|Map of additional annotations|null|
|hostname|Host name of the ingress|<BALLERINA_SERVICE_NAME>.com or <BALLERINA_SERVICE_LISTENER_NAME>.com|
|path|Resource path.|/|
|targetPath|This will use for rewriting the URL.|null|
|ingressClass|Ingress class|nginx|
|enableTLS|Enable ingress TLS|false|

**@kubernetes:HPA{}**
- Supported by Ballerina services and functions.


|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Horizontal Pod Autoscaler|<BALLERINA_SERVICE_NAME>-hpa|
|labels|Labels for the service|{ app: <OUTPUT_FILE_NAME> }|
|annotations|Map of annotations|null|
|minReplicas|Minimum number of replicas|Number of replicas in the deployment|
|maxReplicas|Maximum number of replicas|minReplicas + 1|
|cpuPrecentage|CPU percentage to start scaling|50|

**@kubernetes:Secret{}**
- Supported by Ballerina services and functions.


|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the secret mount|<BALLERINA_SERVICE_NAME>-secret|
|labels|Labels for the service|{ app: <OUTPUT_FILE_NAME> }|
|annotations|Map of annotations|null|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|data|Paths to data files|null|

**@kubernetes:ConfigMap{}**
- Supported by Ballerina services and functions.


|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the configmap volume mount|\<service_name\>-config-map|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|ballerinaConf|Ballerina conf file location|null|
|data|Paths to data files|null|

**@kubernetes:PersistentVolumeClaim{}**
- Supported by Ballerina services and functions.


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
|name|Name of the job|<BALLERINA_FILE_NAME>-job or <BALLERINA_MODULE_NAME>-job|
|labels|Labels for the job|{ app: <OUTPUT_FILE_NAME> }|
|annotations|Metadata Annotations map|{}|
|dockerHost|Docker host IP and Docker PORT.(e.g "tcp://192.168.99.100:2376")|DOCKER_HOST environment variable. If `DOCKER_HOST` is unavailable, use "unix:///var/run/docker.sock" for Unix or use "npipe:////./pipe/docker_engine" for Windows 10 or uses "localhost:2375"|
|dockerCertPath|Docker cert path|DOCKER_CERT_PATH environment variable|
|registry|Docker registry URL|null|
|username|Username for the Docker registry|null|
|password|Password for the Docker registry|null|
|baseImage|Base image to create the Docker image|ballerina/jre8:v1|
|image|Docker image with tag|<OUTPUT_FILE_NAME>:latest. If field `registry` is set, then it will be prepended to the Docker image name as <registry>/<OUTPUT_FILE_NAME>:latest|
|buildImage|Building the Docker image|true|
|push|Push the Docker image to registry. This will be effective if the `buildImage` field of the image is true|false|
|copyFiles|Copy external files for the Docker image|null|
|singleYAML|Generate a single YAML file for all K8s resources|true|
|namespace|Namespace for the Job|default|
|imagePullPolicy|Docker image pull policy|IfNotPresent|
|env|List of the environment variables|null|
|restartPolicy|Restart policy|Never|
|backoffLimit|Backoff limit|3|
|activeDeadlineSeconds|Active deadline seconds|20|
|schedule|Schedule for CRON jobs|none|
|imagePullSecrets|Image pull secret's value|null|

  
### Extend Ballerina Deployment and Annotations
Ballerina can be augmented with your own annotations that represent your own unique deployment artifacts. You can also write builder extensions that generate these files during compilation. Refer to the example at https://github.com/ballerinax/hello.
