---
layout: ballerina-left-nav-pages-swanlake
title: Kubernetes
description: See how the Ballerina deployment in Kubernetes works
keywords: ballerina, programming language, services, cloud, kubernetes
permalink: /swan-lake/learn/deployment/kubernetes/
active: kubernetes
redirect_from:
  - /swan-lake/learn/deployment/kubernetes
---

# Kubernetes

The Kubernetes builder extension offers native support for running Ballerina programs on Kubernetes with the use of annotations that you can include as part of your service code. Also, it will take care of the creation of the Docker images, so you don't need to explicitly create Docker images prior to deployment on Kubernetes.

- [Supported Configurations](#supported-configurations)
- [Using Kubernetes Annotations](#using-kubernetes-annotations)
- [Building the Deployed Service](#building-the-deployed-service)
- [Creating the Kubernetes Deployment](#creating-the-kubernetes-deployment)
    - [Accessing via Node Port](#accessing-via-node-port)
    - [Accessing via Ingress](#accessing-via-ingress)
    - [Accessing the Service](#accessing-the-service)
- [Supported Kubernetes Annotations](#supported-kubernetes-annotations)
- [Extending Ballerina Deployment and Annotations](#extending-ballerina-deployment-and-annotations)

## Supported Configurations

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

## Using Kubernetes Annotations

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

## Building the Deployed Service

Now, you can use the following command to build the Ballerina service that we developed above. This will also create the corresponding Docker image and the Kubernetes artifacts using the Kubernetes annotations that you have configured above.

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

## Creating the Kubernetes Deployment

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

### Accessing via Node Port
```bash
$ curl -k https://localhost:31417/users/john 
{"name":"John Doe", "email":"john@ballerina.com"}
```

### Accessing via Ingress

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

### Accessing the Service

```bash
$ curl -kv https://ballerina.guides.io/users/jane 
{"name":"Jane Doe", "email":"jane@ballerina.com"}
```   
    
## Supported Kubernetes Annotations

**@kubernetes:Deployment{}**
- Supported with Ballerina services, listeners, and functions.

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

  
## Extending Ballerina Deployment and Annotations
Ballerina can be augmented with your own annotations that represent your own unique deployment artifacts. You can also write builder extensions that generate these files during compilation. Refer to the example at https://github.com/ballerinax/hello.
