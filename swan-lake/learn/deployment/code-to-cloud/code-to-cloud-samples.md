---
layout: ballerina-left-nav-pages-swanlake
title: Samples
description: Sample use cases of Ballerina code to cloud. 
keywords: ballerina, programming language, services, cloud, kubernetes, docker
permalink: /swan-lake/learn/deployment/code-to-cloud/samples/
active: samples
intro: The below are a few sample use cases of Ballerina code to cloud.
redirect_from:
  - /swan-lake/learn/deployment/code-to-cloud/samples
---

## Hello World Sample

### Creating the Ballerina project 

In the current version of Ballerina, you need the c2c import statement to enable the code to cloud functionality. 

>**Note:** All the other code is not related to Docker or Kubernetes and those are completely focused on the business logic. 

#### hello/main.bal

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/c2c as _;

listener http:Listener helloEP = new(9090);

@http:ServiceConfig {
    basePath: "/helloWorld"
}
service helloWorld on helloEP {
    resource function sayHello(http:Caller caller, http:Request request) {
        http:Response response = new;
        response.setTextPayload("Hello, World from service helloWorld ! ");
        var responseResult = caller->respond(response);
        if (responseResult is error) {
            log:printError("error responding back to client.", err = responseResult);
        }
    }
}
```

#### Ballerina.cloud

```bash
[container.image]
repository="wso2inc"
name="hello"
tag="v0.1.0"
```

### Generating the Artifacts

1. Execute the `ballerina build -a` command to build the Ballerina project and you view the output below.

```bash
Compiling source
        wso2/hello:0.1.0

Creating balos
        target/balo/hello-2020r2-any-0.1.0.balo

Running Tests

        wso2/hello:0.1.0
        No tests found


Generating executables
        target/bin/hello.jar

Generating artifacts...

        @kubernetes:Service                      - complete 1/1
        @kubernetes:Deployment                   - complete 1/1
        @kubernetes:HPA                          - complete 1/1
        @kubernetes:Docker                       - complete 2/2 

```

>**Note:** Before deploying the application, let’s observe the artifacts that are generated. Note the values such as port number, base images, container image name. All these values are derived from the code.

#### target/docker/hello/Dockerfile

```
# Auto Generated Dockerfile
FROM ballerina/jre11:v1

LABEL maintainer="dev@ballerina.io"

WORKDIR /home/ballerina
COPY ballerina-crypto-1.0.1.jar /home/ballerina/jars/ 
COPY ballerina-rt-2.0.0-Preview5.jar /home/ballerina/jars/ 
COPY io-native-0.5.1.jar /home/ballerina/jars/ 
COPY wso2-hello-0.1.0.jar /home/ballerina/jars/ 
…

RUN addgroup troupe \
    && adduser -S -s /bin/bash -g 'ballerina' -G troupe -D ballerina \
    && apk add --update --no-cache bash \
    && chown -R ballerina:troupe /usr/bin/java \
    && rm -rf /var/cache/apk/*

COPY wso2-hello-0.1.0.jar /home/ballerina

EXPOSE  9090
USER ballerina

CMD java -Xdiag -cp "wso2-hello-0.1.0.jar:jars/*" 'wso2/hello/0_1_0/$_init'
```

#### target/kubernetes/hello/wso2-hello-0.1.0.yaml

```
---
apiVersion: "v1"
kind: "Service"
metadata:
  labels:
    app: "wso2-hello-0.1.0"
  name: "helloep-svc"
spec:
  ports:
  - name: "http-helloep-sv"
    port: 9090
    protocol: "TCP"
    targetPort: 9090
  selector:
    app: "wso2-hello-0.1.0"
  type: "ClusterIP"
---
apiVersion: "apps/v1"
kind: "Deployment"
metadata:
  labels:
    app: "wso2-hello-0.1.0"
  name: "wso2-hello-0--deployment"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: "wso2-hello-0.1.0"
  template:
    metadata:
      labels:
        app: "wso2-hello-0.1.0"
    spec:
      containers:
      - image: "wso2inc/hello:v0.1.0"
        imagePullPolicy: "IfNotPresent"
        lifecycle:
          preStop:
            exec:
              command:
              - "sleep"
              - "15"
        name: "wso2-hello-0--deployment"
        ports:
        - containerPort: 9090
          name: "http-helloep-sv"
          protocol: "TCP"
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
          requests:
            memory: "100Mi"
            cpu: "200m"
      nodeSelector: {}
---
apiVersion: "autoscaling/v2beta2"
kind: "HorizontalPodAutoscaler"
metadata:
  labels:
    app: "wso2-hello-0.1.0"
  name: "wso2-hello-0--hpa"
spec:
  maxReplicas: 2
  metrics:
  - resource:
      name: "cpu"
      target:
        averageUtilization: 50
        type: "Utilization"
    type: "Resource"
  minReplicas: 1
  scaleTargetRef:
    apiVersion: "apps/v1"
    kind: "Deployment"
    name: "wso2-hello-0--deployment"
```

2. Execute the command below to deploy the generated Kubernetes artifacts.
  `kubectl apply -f /home/wso2/test/c2c-slp5/target/kubernetes/hello`

3. Execute the command below to access the service via NodePort.
  `kubectl expose deployment wso2-hello-0--deployment --type=NodePort --name=wso2-hello-0--svc-local`

### Executing the Docker Image

Follow the steps below to execute the docker image separately first.

1. Execute the `docker images` command to verify if the Docker image is generated.

```bash
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
wso2inc/hello                       v0.1.0              60d95f0928b2        About a minute ago   228MB
```

2. Execute the `docker run -d -p 9090:9090 wso2inc/hello:v0.1.0` command to run the generated Docker image.

```bash
c04194eb0b4d0d78cbc8ca55e0527d381d8ab4a1a68f8ea5dd3770a0845d5fbb
```

3. Execute the `curl http://localhost:9090/helloWorld/sayHello` command to access the service.

```bash
Hello, World from service helloWorld!
```

### Executing the Kubernetes Service

Follow the steps below to execute the Kubernetes service.

1. Execute the `kubectl apply -f /home/wso2/test/c2c-slp5/target/kubernetes/hello` command to execute the service.

```bash
service/helloep-svc created
deployment.apps/wso2-hello-0--deployment created
horizontalpodautoscaler.autoscaling/wso2-hello-0--hpa created
```

2. Execute the `kubectl get pods` command to verify the Kuberentes pods.

```bash
NAME                                          READY   STATUS    RESTARTS   AGE
wso2-hello-0--deployment-7d4d56457b-7jlzx   1/1     Running   0          57s
```

3. Execute the `kubectl expose deployment wso2-hello-0--deployment --type=NodePort --name=wso2-hello-0--svc-local` command to expose the service via NodePort to test in the developer environment.

```bash
service/wso2-hello-0--svc-local exposed
```

4. Execute the `kubectl get svc` command to get the IP address and port of the Kubernetes service.

```bash
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
wso2-hello-0--svc-local   NodePort    10.111.61.112    <none>        9090:32437/TCP   4m17s
```
>**Tip:** If you are using Minikube, execute the `minikube ip` command to change the IP address.

```bash
192.168.49.2
```

5. Execute the `curl http://192.168.49.2:32437/helloWorld/sayHello` command to access the deployed service via cURL.

```bash
Hello, World from service helloWorld!
```

## Resource limits and Auto Scaling

