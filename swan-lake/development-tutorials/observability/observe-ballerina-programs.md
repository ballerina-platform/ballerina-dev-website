---
title: Observe Ballerina programs
description: See how Ballerina supports observability by exposing itself via metrics, tracing, and logs to external systems.
keywords: ballerina, observability, metrics, tracing, logs, prometheus, grafana, jaeger, elastic
permalink: /learn/observe-ballerina-programs/
active: observe-ballerina-programs
intro: Observability is a measure of how well the internal states of a system can be inferred from the knowledge of its external outputs.
---

It consists of the three major pillars below.

- **Metrics:** numeric values that are collected and aggregated over a period of time.
- **Tracing:** the activities that occur when a request/transaction occurs in the system from the point of entry to exit.
- **Logging:** text records of activities that occurred with relevant information along with the timestamp.

## Provide observability in Ballerina

Metrics, distributed tracing, and logging are key methods that reveal the internal state of the system to provide observability. Ballerina becomes fully observable by exposing itself via these three methods to various external systems allowing metrics such as request count and response time statistics to be monitored, perform distributed tracing, and analyze logs.

Ballerina services and any client connectors are observable by default. HTTP/HTTPS and SQL client
connectors use semantic tags to make tracing and metrics monitoring more informative.

This guide focuses on enabling Ballerina service observability with some of its supported systems.

<a href="https://prometheus.io/" target="_blank">Prometheus</a> and <a href="https://grafana.com/" target="_blank">Grafana</a> are used for metrics monitoring, and <a href="https://www.jaegertracing.io/" target="_blank">Jaeger</a> is used for distributed tracing. 

Ballerina logs can be fed to any external log monitoring system like the 
<a href="https://www.elastic.co/" target="_blank">Elastic Stack</a> to perform log monitoring and analysis.

## Observe a Ballerina service

Follow the steps below to observe a sample Ballerina service.

### Step 1 - create a `Hello World` Ballerina service
 
Create a service as shown below and save it as `hello_world_service.bal`.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/prometheus as _;
import ballerinax/jaeger as _;

service /hello on new http:Listener(9090) {
    
    resource function get sayHello(http:Caller caller, http:Request req) returns error? {
        log:printInfo("This is a test Info log");
        log:printError("This is a test Error log");
        http:Response res = new;
        res.setPayload("Hello, World!");
        check caller->respond(res);
    }
    
}
```

### Step 2 - observe the `Hello World` Ballerina service

By default, observability is not included in the executable created by Ballerina. It can be added
by using the `--observability-included` build flag or by adding the following section to the `Ballerina.toml` file.

```toml
[build-options]
observabilityIncluded=true
```

>**Note:** the above configuration is included by default in the `Ballerina.toml` file generated when initiating a new 
package using the `bal new` command.

To include the Prometheus and Jaeger extensions into the executable, the
`ballerinax/prometheus` and `ballerinax/jaeger` modules need to be imported into your Ballerina code.

```ballerina
import ballerinax/prometheus as _;
import ballerinax/jaeger as _;
```

Observability is disabled by default at runtime as well and it can be enabled selectively for metrics and tracing by adding
the following runtime configurations to the `Config.toml` file.

```toml
[ballerina.observe]
metricsEnabled=true
metricsReporter="prometheus"
tracingEnabled=true
tracingProvider="jaeger"
```

The created configuration file can be passed to the Ballerina program with the `BAL_CONFIG_FILES` environment variable along with
the path of the configuration file. This is not necessary if the `Config.toml` file is present in the current working directory.

```
$ BAL_CONFIG_FILES=<path-to-conf>/Config.toml bal run --observability-included hello_world_service.bal

ballerina: started Prometheus HTTP listener 0.0.0.0:9797
ballerina: started publishing traces to Jaeger on localhost:55680
```

When Ballerina observability is enabled, the Ballerina runtime exposes internal metrics via an HTTP endpoint (/metrics) for
metrics monitoring and traces will be published to Jaeger. Prometheus should be configured to scrape metrics from
the metrics HTTP endpoint in Ballerina.

Ballerina logs are logged on the console. Therefore, the logs need to be redirected to a file, which can then be
pushed to [Elastic Stack](#distributed-logging) to perform the log analysis.

Therefore, redirect the standard output to a file if you want to monitor logs.

```
$ BAL_CONFIG_FILES=<path-to-conf>/Config.toml nohup bal run --observability-included hello_world_service.bal > ballerina.log &
```

### Step 3 - send requests
 
Send requests to <http://localhost:9090/hello/sayHello>.

Example cURL command:

```
$ curl http://localhost:9090/hello/sayHello
```

### Step 4 - observe metrics, traces & logs

A ballerina service can be observed as follows. 

1. [Observe metrics using Prometheus](/learn/observe-metrics)

2. [Observe tracing using Jaeger](/learn/observe-tracing)

3. [Observe logs with Elastic Stack](/learn/observe-logs)
