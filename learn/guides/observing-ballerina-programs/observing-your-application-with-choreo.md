---
layout: ballerina-observing-programs-left-nav-pages-swanlake
title: Observing Your Application with Choreo
description: Choreo is a digital innovation platform that allows you to develop, deploy, and manage cloud-native applications at scale.
keywords: ballerina, observability, metrics, tracing, logs, choreo
permalink: /learn/observing-ballerina-programs/observing-your-application-with-choreo/
active: observing-your-application-with-choreo
intro: Choreo is a digital innovation platform that allows you to develop, deploy, and manage cloud-native applications at scale.
redirect_from:
  - /learn/user-guide/observability/observing-ballerina-services-through-choreo
  - /learn/user-guide/observability/observing-ballerina-services-through-choreo/
  - /learn/observing-ballerina-programs/observing-your-application-with-choreo
---


>**Info:** If you already have login access to [Choreo](https://wso2.com/choreo/), see [Observability Overview](https://wso2.com/choreo/docs/observability/observability-overview/) to observe your Ballerina program in Choreo.

Follow the steps below to observe a Ballerina service without logging in to Choreo.



## Step 1 - Creating a Hello World Ballerina Service

Create a `hello world` service as given below and save it as `hello_world.bal`.

>**Info:** Import the `ballerinax/choreo` module as demonstrated in the sample below to add the Choreo extension to the executable.

```ballerina
import ballerina/http;
import ballerinax/choreo as _;
 
service /hello on new http:Listener(9090) {
  
   resource function get sayHello(http:Caller caller, http:Request req) returns error? {
      check caller->respond("Hello, World!");
   }
   
}
```


## Step 2 - Configuring Choreo to Observe a Ballerina Service

Follow the steps below to enable observability in the executable created by Ballerina as it is not enabled by default.

>**Info:** For more information on setting up the configurations, see the [Choreo observability extension](https://central.ballerina.io/ballerinax/choreo).

1. Use the `–-observability-included` build flag or add the config below to the `Ballerina.toml` file.
  ```toml
  [build-options]
  observabilityIncluded = true
  ```

2. Add the configuration below to the `Config.toml` file.
  ```toml
  [ballerina.observe]
  enabled=true
  provider="choreo"
  ```


## Step 3 - Observing the Ballerina Service

1. Once the configuration file has been created, execute the command below to pass it to the Ballerina program with the `BAL_CONFIG_FILES` environment variable.
   >**Tip:** This is not necessary if the `Config.toml` file is present in the current working directory.

    ```bash 
    $ BAL_CONFIG_FILES=<path-to-conf>/Config.toml bal run --observability-included hello_world.bal
    ```

    >You view the output below.

    ```bash
    Compiling source
    hello_world.bal

    Running executable

    ballerina: initializing connection with observability backend periscope.choreo.dev:443
    ballerina: visit http://console.choreo.dev/observe/app/918e4591-b7a3-11eb-8af4-bb5c98e5b4d6/918e502d-b7a3-11eb-8af4-bb5c98e5b4d6 to access observability data
    ballerina: started publishing metrics to Choreo
    [ballerina/http] started HTTP/WS listener 0.0.0.0:9090
    ```

2. Click on the URL provided.
   This directs you to the Choreo portal in which you can view the metrics and traces exposed via the throughput and latency graphs.
   >**Note:** If you haven't sent any requests to the Ballerina service, you may see a banner with the message `No request received during the selected time period`.


## Step 4 - Sending Requests

Execute the cURL command below to send requests to the `http://localhost:9090/hello/sayHello` service.

```bash
$ curl http://localhost:9090/hello/sayHello
```

After sending a few requests, you view the graphs rendered with data. The sample **Choreo Observability** view for the `hello_world.bal` file is shown below.

![Choreo Observability View](/learn/images/choreo-observability-view.png "Choreo Observability View")

>**Info:** Currently monitoring logs is not supported by default. To enable log monitoring for your service, see [Setting up Elastic Stack](/learn/user-guide/observability/observing-ballerina-code/#setting-up-the-external-systems-for-log-analytics) to configure [Elastic Stack](https://www.elastic.co/).

<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
