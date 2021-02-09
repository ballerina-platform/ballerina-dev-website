---
layout: ballerina-left-nav-pages-swanlake
title: Observing Ballerina Code
description: See how Ballerina supports observability by exposing itself via metrics, tracing, and logs to external systems.
keywords: ballerina, observability, metrics, tracing, logs
permalink: /learn/observing-ballerina-code/
active: observing-ballerina-code
intro: Observability is a measure of how well internal states of a system can be inferred from knowledge of its external outputs.
redirect_from:
  - /learn/how-to-observe-ballerina-code
  - /learn/how-to-observe-ballerina-code/
  - /learn/how-to-observe-ballerina-services/
  - /learn/how-to-observe-ballerina-services
  - /learn/observing-ballerina-code
---

## Providing Observability in Ballerina

Monitoring, logging, and distributed tracing are key methods that reveal the internal state of the system to provide observability. Ballerina becomes fully observable by exposing itself via these three methods to various external systems allowing to monitor metrics such as request count and response time statistics, analyze logs, and
perform distributed tracing. 

HTTP/HTTPS based Ballerina services and any client connectors are observable by default. HTTP/HTTPS and SQL client
connectors use semantic tags to make tracing and metrics monitoring more informative.

This guide focuses on enabling Ballerina service observability with some of its default supported systems.
[Prometheus] and [Grafana] are used for metrics monitoring, and [Jaeger] is used for distributed tracing. 
Ballerina logs can be fed to any external log monitoring system like [Elastic Stack] to perform log monitoring and analysis.

## Observing a Ballerina Service

Follow the steps below to observe a sample Ballerina service.

### Step 1 - Setting up the Prerequisites

Make sure you have already installed [Docker](https://www.docker.com/) to set up external products such as Jaeger,
Prometheus, etc. You can follow [Docker documentation](https://docs.docker.com/install/) to install Docker.

### Step 2 - Installing and Configuring the External Systems

* Set up Prometheus for collecting metrics information by following the section on [Setting up Prometheus](#setting-up-prometheus)
* Set up Grafana to visualize metrics by following the section on [Setting up Grafana](#setting-up-grafana)
* Set up Jaeger analyze tracing as mentioned in the section [Setting up Jaeger](#setting-up-the-jaeger-server)
* Set up Elastic Stack only if you are interested in analysing logs by following the section on [Setting up Elastic Stack](#setting-up-elastic-stack)

### Step 3 - Creating a 'Hello World' Ballerina Service
 
Create a Service as shown below and save it as `hello_world_service.bal`.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/prometheus as _;
import ballerinax/jaeger as _;

service /hello on new http:Listener(9090) {
    
    resource function get sayHello(http:Caller caller, http:Request req) returns error? {
        log:print("This is a test Info log");
        log:printError("This is a test Error log");
        http:Response res = new;
        res.setPayload("Hello, World!");
        check caller->respond(res);
    }
    
}
```

### Step 4 - Observing the 'Hello World' Ballerina Service

By default, observability is not included in the executable created by Ballerina. It can be added
by using the --observability-included build flag or by adding the following section to the `Ballerina.toml` file.

```toml
[build-options]
observabilityIncluded=true
```

To include the Prometheus and Jaeger extensions into the executable, the
`ballerinax/prometheus` and `ballerinax/jaeger` modules need to be imported in your Ballerina code.

```ballerina
import ballerinax/prometheus as _;
import ballerinax/jaeger as _;
```

Observability is disabled by default at runtime as well and it can be enabled by adding
the following runtime configurations to the `Config.toml` file.

```toml
[ballerina.observe]
enabled=true
```

Alternatively, you can enable metrics and tracing selectively using the following configurations as well.

```toml
[ballerina.observe]
metricsEnabled=true
tracingEnabled=true
```

The created configuration file can be passed to the Ballerina program with the `BALCONFIGFILE` environment variable along with
the path of the configuration file.

```bash
$ BALCONFIGFILE=<path-to-conf>/Config.toml bal run --observability-included hello_world_service.bal

[ballerina/http] started HTTP/WS listener 0.0.0.0:9797
ballerina: started Prometheus HTTP listener 0.0.0.0:9797
ballerina: started publishing traces to Jaeger on localhost:6831
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
```

By default, when Ballerina observability is enabled, the Ballerina runtime exposes internal metrics via an HTTP endpoint for
metrics monitoring and traces will be published to Jaeger. Prometheus should be configured to scrape metrics from
the metrics HTTP endpoint in Ballerina.

Ballerina logs are logged on the console. Therefore, the logs need to be redirected to a file, which can then be
pushed to [Elastic Stack](#distributed-logging) to perform the log analysis.

Therefore, redirect the standard output to a file if you want to monitor logs.

```bash
$ BALCONFIGFILE=<path-to-conf>/Config.toml nohup bal run --observability-included hello_world_service.bal > ballerina.log &
```

### Step 5 - Sending Few Requests
 
Send few requests to <http://localhost:9090/hello/sayHello>

Example cURL command:

```bash
$ curl http://localhost:9090/hello/sayHello
```

### Step 6 - Viewing Tracing and Metrics in the Dashboard

View the tracing information on Jaeger via <http://localhost:16686/> and view metrics information from the Grafana
dashboard on <http://localhost:3000/>.

Sample view of Jaeger dashboard for hello_world_service.bal is shown below. 
![Jaeger Sample Dashboard](../images/jaeger-sample-dashboard.png "Jaeger Sample Dashboard")

Sample view of Grafana dashboard for hello_world_service.bal is shown below. 
![Grafana Sample Dashboard](../images/grafana-sample-hello-world-service-stats.png "Grafana HelloWorld Service Sample Dashboard")

### Step 7 - Visualizing the Logs
 
If you have configured log analytics, view the logs in Kibana via <http://localhost:5601>

![Kibana Sample Dashboard](../images/kibana-sample-dashboard.png "Kibana Sample Dashboard")

## Monitoring Metrics
Metrics help to monitor the runtime behavior of a service. Therefore, metrics are a vital part of monitoring
Ballerina services. However, metrics are not the same as analytics. For example, you should not use metrics to do
something like per-request billing. Metrics are used to measure what Ballerina service does at runtime to make
better decisions using the numbers. The code generates business value when it continuously runs in production.
Therefore, it is imperative to continuously measure the code in production.

Metrics, by default, supports Prometheus. In order to support Prometheus, an HTTP endpoint starts with the context
of `/metrics` in default port 9797 when starting the Ballerina service.

### Configuring Advanced Metrics for Ballerina
This section focuses on the Ballerina configurations that are available for metrics monitoring with Prometheus,
and the sample configuration is provided below.

```toml
[ballerina.observe]
metricsEnabled=true
metricsReporter="prometheus"

[ballerinax.prometheus]
port=9797
host="0.0.0.0"
```

The descriptions of each configuration above are provided below with possible alternate options.

Configuration Key | Description | Default Value | Possible Values 
--- | --- | --- | --- 
ballerina.observe. metricsEnabled | Whether metrics monitoring is enabled (true) or disabled (false) | false | true or false
ballerina.observe. metricsReporter | Reporter name that reports the collected Metrics to the remote metrics server. This is only required to be modified if a custom reporter is implemented and needs to be used. | prometheus | prometheus or if any custom implementation, the name of the reporter.
ballerinax.prometheus. port | The value of the port in which the service '/metrics' will bind to. This service will be used by Prometheus to scrape the information of the Ballerina service. | 9797 | Any suitable value for port 0 - 0 - 65535. However, within that range, ports 0 - 1023 are generally reserved for specific purposes, therefore it is advisable to select a port without that range. 
ballerinax.prometheus. host | The name of the host in which the service '/metrics' will bind to. This service will be used by Prometheus to scrape the information of the Ballerina service. | 0.0.0.0 | IP or Hostname or 0.0.0.0 of the node in which the Ballerina service is running.

### Setting Up the External Systems for Metrics
There are mainly two systems involved in collecting and visualizing the metrics. [Prometheus] is used to collect the
metrics from the Ballerina service and [Grafana] can connect to Prometheus and visualize the metrics in the dashboard.

#### Setting Up Prometheus
[Prometheus] is used as the monitoring system, which pulls out the metrics collected from the Ballerina service
'/metrics'. This section focuses on the quick installation of Prometheus with Docker and configures it to collect metrics from the Ballerina service with default configurations. Follow the steps below to configure 
Prometheus. 

>**Tip:** There are many other ways to install the Prometheus and you can find possible options from
[installation guide](https://prometheus.io/docs/prometheus/latest/installation/).

1. Create a `prometheus.yml` file in the `/tmp/` directory.

2. Add the following content to `/tmp/prometheus.yml`.

```yaml
global:
  scrape_interval:     15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['a.b.c.d:9797']
```

Here the targets `'a.b.c.d:9797'` should contain the host and port of the `/metrics` service that's exposed from 
Ballerina for metrics collection. Add the IP of the host in which the Ballerina service is running as `a.b.c.d` and its
port (default `9797`).
If you need more information, go to the [Prometheus Documentation](https://prometheus.io/docs/introduction/first_steps/).

If your Ballerina service is running on localhost and Prometheus in a Docker container,
add the target as `host.docker.internal:9797` to access the localhost from Docker.

3.  Start the Prometheus server in a Docker container with the command below.

```bash
$ docker run -p 19090:9090 -v /tmp/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```
    
4.  Go to <http://localhost:19090/> and check whether you can see the Prometheus graph.
Ballerina metrics should appear in Prometheus graph's metrics list when Ballerina service is started.

#### Setting Up Grafana
Let’s use [Grafana] to visualize metrics in a dashboard. For this, we need to install Grafana, and configure
Prometheus as a data source. Follow the steps below to configure Grafana.

1. Start Grafana as a Docker container with the command below.

```bash
$ docker run -d --name=grafana -p 3000:3000 grafana/grafana
```
For more information, go to [Grafana in Docker Hub](https://hub.docker.com/r/grafana/grafana/).

2. Go to <http://localhost:3000/> to access the Grafana dashboard running on Docker.

3. Log in to the dashboard with the default user, username: `admin` and password: `admin`

4. Add Prometheus as a data source with `Browser` access configuration as provided below.

![Grafana Prometheus Datasource](../images/grafana-prometheus-datasource.png "Grafana Prometheus Datasource")

5. Import the Grafana dashboard designed to visualize Ballerina metrics from [https://grafana.com/dashboards/5841](https://grafana.com/dashboards/5841).
This dashboard consists of service and client invocation level metrics in near real-time view. 

Ballerina HTTP Service Metrics Dashboard Panel will be as below.
![Ballerina Service Metrics](../images/grafana-ballerina-metrics-1.png "Ballerina Sample Service Metrics Dashboard")

Ballerina HTTP Client Metrics Dashboard Panel will be as below.
![Ballerina Client Metrics](../images/grafana-ballerina-metrics-3.png "Ballerina Sample Client Metrics Dashboard")

Ballerina SQL Client Metrics Dashboard Panel will be as below.
![Ballerina SQL Client Metrics](../images/grafana-ballerina-metrics-2.png "Ballerina Sample SQL Client Metrics Dashboard")

## Distributed Tracing

Tracing provides information regarding the roundtrip of a service invocation based on the concept of spans, which are
structured in a hierarchy based on the cause and effect concept. A trace can spread across several services that can be
deployed in several nodes, depicting a high-level view of interconnections among services as well, hence coining the
term distributed tracing.

A span is a logical unit of work, which encapsulates a start and end time as well as metadata to give more meaning to
the unit of work being completed. For example, a span representing a client call to an HTTP endpoint would give the
user the latency of the client call and metadata like the HTTP URL being called and HTTP method used. If the span
represents an SQL client call, the metadata would include the query being executed.

Tracing gives the user a high-level view of how a single service invocation is processed across several distributed
microservices.

* Identify service bottlenecks - The user can monitor the latencies and identify when a service invocation slows down,
pinpoint where the slowing down happens (by looking at the span latencies) and take action to improve the latency.
* Error identification - If an error occurs during the service invocation, it will show up in the list of traces.
The user can easily identify where the error occurred and information of the error will be attached to the relevant
span as metadata.

Ballerina supports [OpenTracing](http://opentracing.io/) standards by default. This means that Ballerina services
can be traced using OpenTracing implementations like [Jaeger](http://www.jaegertracing.io/). Jaeger is the default
tracer of Ballerina.

Semantic tags used by Ballerina also follow the [semantic conventions defined in OpenTracing
specification.](https://github.com/opentracing/specification/blob/master/semantic_conventions.md)

### Configuring Advanced Tracing for Ballerina

Tracing can be enabled in Ballerina with the few configurations as mentioned in the
[Observing a Ballerina Service](#observing-a-ballerina-service).
This section mainly focuses on the configuration options with the description and possible values.

The sample configuration that enables tracing and uses Jaeger as the tracer as provided below.

```toml
[ballerina.observe]
tracingEnabled=true
tracingProvider="jaeger"
```

The table below provides the descriptions of each configuration option and possible values that can be assigned.

Configuration Key | Description | Default Value | Possible Values
--- | --- | --- | --- 
ballerina.observe.tracingEnabled | Whether tracing is enabled (true) or disabled (false) | false | true or false
ballerina.observe.tracingProvider | The tracer name, which implements the tracer interface. | jaeger | jaeger or the name of the tracer of any custom implementation.

#### Using the Jaeger Client
Jaeger is the default tracer supported by Ballerina. Below is the sample configuration options that are available in
the Jaeger.

```toml
[ballerina.observe]
tracingEnabled=true
tracingProvider="jaeger"

[ballerinax.jaeger]
agentHostname="localhost"
agentPort=6831
samplerType="const"
samplerParam=1.0
reporterFlushInterval=2000
reporterBufferSize=1000
```

The table below provides the descriptions of each configuration option and possible values that can be assigned.

Configuration Key | Description | Default Value | Possible Values 
--- | --- | --- | --- 
ballerina.observe. agentHostname | Hostname of the Jaeger agent | localhost | IP or hostname of the Jaeger agent. If it is running on the same node as Ballerina, it can be localhost. 
ballerina.observe. agentPort | Port of the Jaeger agent | 6831 | The port on which the Jaeger agent is listening.
ballerina.observe. samplerType | Type of the sampling methods used in the Jaeger tracer. | const | `const`, `probabilistic`, or `ratelimiting`.
ballerina.observe. samplerParam | It is a floating value. Based on the sampler type, the effect of the sampler param varies | 1.0 | For `const` `0` (no sampling) or `1` (sample all spans), for `probabilistic` `0.0` to `1.0`, for `ratelimiting` any positive integer (rate per second).
ballerina.observe. reporterFlushInterval | The Jaeger client will be sending the spans to the agent at this interval. | 2000 | Any positive integer value.
ballerina.observe. reporterBufferSize | Queue size of the Jaeger client. | 2000 | Any positive integer value.

### Setting Up the External Systems for Tracing
By default, Ballerina supports Jaeger for distributed tracing. This section focuses on configuring the
Jaeger with Docker as a quick installation.

#### Setting Up the Jaeger Server
Jaeger is the default distributed tracing system that is supported. There are many possible ways to deploy Jaeger and you can find more information on this [link](https://www.jaegertracing.io/docs/deployment/). Here we focus on all in one deployment with Docker.

1. Install Jaeger via Docker and start the Docker container by executing command below.

```bash
$ docker run -d -p5775:5775/udp -p6831:6831/udp -p6832:6832/udp -p5778:5778 -p16686:16686 -p14268:14268 jaegertracing/all-in-one:latest
```

2. Go to <http://localhost:16686> and load the web UI of the Jaeger to make sure it is functioning properly.

The image below is the sample tracing information you can see from Jaeger.

![Jaeger Tracing Dashboard](../images/jaeger-tracing-dashboard.png "Jaeger Tracing Dashboard")

## Distributed Logging
Ballerina distributed logging and analysis is supported by Elastic Stack. Ballerina has a log module for logging in to the console. In order to monitor the logs, the Ballerina standard output needs to be redirected to a file.

This can be done by running the Ballerina service as below.

```bash
$ nohup bal run hello_world_service.bal > ballerina.log &
```

You can view the logs with the command below.

```bash
$ tail -f ~/wso2-ballerina/workspace/ballerina.log
```

### Setting Up the External Systems for Log Analytics

#### Setting Up Elastic Stack
The elastic stack comprises of the following components.

1. Beats - Multiple agents that ship data to Logstash or Elasticsearch. In our context, Filebeat will ship the Ballerina logs to Logstash. Filebeat should be a container running on the same host as the Ballerina service. This is so that the log file (ballerina.log) can be mounted to the Filebeat container.
2. Logstash - Used to process and structure the log files received from Filebeat and send them to Elasticsearch.
3. Elasticsearch - Storage and indexing of the logs received by Logstash.
4. Kibana - Visualizes the data stored in Elasticsearch

Elasticsearch and Kibana are provided as [Cloud Services](https://www.elastic.co/cloud)
Alternatively, Docker containers can be used to set up Elasticsearch and Kibana as well.

1. Download the Docker images using the following commands.

```bash
# Elasticsearch Image
$ docker pull docker.elastic.co/elasticsearch/elasticsearch:6.5.1
# Kibana Image
$ docker pull docker.elastic.co/kibana/kibana:6.5.1
# Filebeat Image
$ docker pull docker.elastic.co/beats/filebeat:6.5.1
# Logstash Image
$ docker pull docker.elastic.co/logstash/logstash:6.5.1
```

2. Start Elasticsearch and Kibana containers by executing the following commands.

```bash
$ docker run -p 9200:9200 -p 9300:9300 -it -h elasticsearch --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:6.5.1
$ docker run -p 5601:5601 -h kibana --name kibana --link elasticsearch:elasticsearch docker.elastic.co/kibana/kibana:6.5.1
```

If you run on Linux you may have to increase the `vm.max_map_count` for the Elasticsearch container to start. 
Execute the following command to do that.

```bash
$ sudo sysctl -w vm.max_map_count=262144
```

3. Create a `logstash.conf` file in the `/tmp/pipeline/` directory and include the following content in the file.

```
input {
  beats {
    port => 5044
    }
}
filter {
  grok  {
    match => { "message" => "%{TIMESTAMP_ISO8601:date}%{SPACE}%{WORD:logLevel}%{SPACE}\[%{GREEDYDATA:module}\]%{SPACE}\-%{SPACE}%{GREEDYDATA:logMessage}"}
  }
}
output {
    elasticsearch {
        hosts => "elasticsearch:9200"
        index => "ballerina"
      document_type => "ballerina_logs"
    }
}
```

Here the 3 stages are specified in the pipeline. Input is specified as beats and listens to port 5044. 
A grok filter is used to structure the Ballerina logs and the output is specified to push to Elasticsearch on
`elasticsearch:9200`.

4. Start the Logstash container by the following command.

```bash
$ docker run -h logstash --name logstash --link elasticsearch:elasticsearch -it --rm -v /tmp/pipeline:/usr/share/logstash/pipeline/ -p 5044:5044 docker.elastic.co/logstash/logstash:6.5.1
```

5. Configure Filebeat to ship the Ballerina logs. Create a `filebeat.yml` file in the `/tmp/` directory and include the following content in the file.

```
filebeat.prospectors:
- type: log
  paths:
    - /usr/share/filebeat/ballerina.log
output.logstash:
  hosts: ["logstash:5044"]
```

6. Start the Filebeat container with the following command.

The `-v` flag is used for bind mounting, where the container will read the file from the host machine. Provide the path to the ballerina.log file, to be bind-mounted to the filebeat container.

```bash
$ docker run -v /tmp/filebeat.yml:/usr/share/filebeat/filebeat.yml -v /<path-to-ballerina.log>/ballerina.log:/usr/share/filebeat/ballerina.log --link logstash:logstash docker.elastic.co/beats/filebeat:6.5.1
```

7. Access Kibana to visualize the logs at <http://localhost:5601>. Add an index named `ballerina` and click on `Discover` to visualize the logs.

[Prometheus]: https://prometheus.io/
[Grafana]: https://grafana.com/
[Jaeger]: https://www.jaegertracing.io/
[Elastic Stack]: https://www.elastic.co/
