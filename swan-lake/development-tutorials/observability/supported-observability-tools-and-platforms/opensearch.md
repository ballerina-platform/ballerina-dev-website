---
title: Observe metrics, traces and logs using OpenSearch
description: See how Ballerina supports observability by exposing itself via metrics, traces and logs to OpenSearch.
keywords: ballerina, observability, metrics, traces, logs, opensearch
permalink: /learn/supported-observability-tools-and-platforms/opensearch/
active: opensearch
intro: Users can observe Ballerina programs with [OpenSearch](https://opensearch.org/), which is a community-driven, Apache 2.0-licensed open source search and analytics suite that makes it easy to ingest, search, visualize, and analyze data. It provides a highly scalable system for providing fast access and response to large volumes of data with an integrated visualization tool, OpenSearch Dashboards, that makes it easy for users to explore their data.
---

The sample [shop service](/learn/overview-of-ballerina-observability/#example-observe-a-ballerina-service) will be used in this guide.

Follow the steps given below to view Ballerina metrics, traces and logs in OpenSearch.

## Step 1 - Set up OpenSearch

This section focuses on configuring OpenSearch with Docker as a quick installation.

1. Download and unzip the [opensearch-observability-dashboard.zip](https://github.com/ballerina-platform/module-ballerina-observe/releases/download/v1.0.0-opensearch-dashboard/opensearch-observability-dashboard.zip) in your local machine.
   
   The `opensearch-observability-dashboard` directory structure should look like this:

   ```
   ├── config
   │   ├── ballerina
   │   │   └── Config.toml
   │   ├── dashboards
   │   │   └── opensearch_dashboards.yml
   │   ├── data-prepper
   │   │   └── pipelines.yaml
   │   ├── fluent-bit
   │   │   ├── fluent-bit.conf
   │   │   ├── parsers.conf
   │   │   └── scripts
   │   │       └── scripts.lua
   │   └── .env
   ├── logs
   │   └── ballerina
   ├── setup
   │   ├── opensearch-dashboards-template.ndjson
   │   └── index-template-request.json
   └── docker-compose.yml
   ```

2. Update `OPENSEARCH_INITIAL_ADMIN_PASSWORD` in the `path/to/opensearch-observability-dashboard/config/.env` file.
   ```env
   OPENSEARCH_INITIAL_ADMIN_PASSWORD=<PASSWORD> # Password for the OpenSearch admin user
   ```
    
   This password will be used to access the OpenSearch server.

3. Navigate to the `path/to/opensearch-observability-dashboard` directory and run `docker compose` to start the OpenSearch server.
   ``` 
   docker compose -f docker-compose.yml up -d
   ```

## Step 2 - Set up Ballerina application for observability

1. Open the `main.bal` file in the Ballerina package and add the following imports.

   ```ballerina
   import ballerinax/metrics.logs as _;
   import ballerinax/jaeger as _;
   ```
   
2. Create the `Config.toml` file in the package directory to set the runtime configurations as follows.

   ```toml
   [ballerina.observe]
   metricsLogsEnabled = true
   tracingEnabled = true
   tracingProvider = "jaeger"
    
   [ballerinax.jaeger]
   agentHostname = "localhost"
   agentPort = 4317
   samplerType = "const"
   samplerParam = 1.0
   reporterFlushInterval = 2000
   reporterBufferSize = 1000
    
   [ballerinax.metrics.logs]
   logFilePath = "<PATH>/<TO>/opensearch-observability-dashboard/logs/ballerina/<NAME_FOR_SERVICE>/app.log"
   ```
       
   Update the `logFilePath` with the path to openSearch observability dashboard logs directory, 
   which is `path/to/opensearch-observability-dashboard/logs/ballerina/<NAME_FOR_SERVICE>/app.log`.

   These configurations enable metrics logs and traces in the Ballerina application and configures the Jaeger exporter.

   The table below provides the descriptions of each configuration option and possible values that can be assigned.

   | Configuration key | Description | Default value | Possible values |
   |---|---|---|---|
   | ballerinax.jaeger. agentHostname | Hostname of the Jaeger agent | localhost | IP or hostname of the Jaeger agent. Can be localhost if running on same node as Ballerina. |
   | ballerinax.jaeger. agentPort | Port of the Jaeger agent | 4317 | The port on which the Jaeger agent is listening. |
   | ballerinax.jaeger. samplerType | Type of sampling methods used in Jaeger tracer | const | `const`, `probabilistic`, or `ratelimiting` |
   | ballerinax.jaeger. samplerParam | Floating value parameter for sampler | 1.0 | **const**: `0` (no sampling) or `1` (sample all)<br>**probabilistic**: `0.0` to `1.0`<br>**ratelimiting**: positive integer (rate/sec) |
   | ballerinax.jaeger. reporterFlushInterval | Interval for sending spans to agent | 2000 | Any positive integer value |
   | ballerinax.jaeger. reporterBufferSize | Queue size of Jaeger client | 1000 | Any positive integer value |
   | ballerinax.metrics.logs. logFilePath | Path to application log file | `none` | `PATH/TO/opensearch-observability-dashboard/logs/ballerina/<SERVICE_NAME>/app.log` |

## Step 3 - Run the Ballerina service

When Ballerina observability is enabled, the Ballerina runtime collects metrics logs and traces.

Run the following command to start the Ballerina service.

```
$ bal run

Compiling source

Running executable

ballerina: started publishing traces to Jaeger on localhost:4317
```

## Step 4 - Send requests
Send requests to <http://localhost:8090/shop>.

Example cURL commands:

```
$ curl -X GET http://localhost:8090/shop/products
```
```
$ curl -X POST http://localhost:8090/shop/product \
-H "Content-Type: application/json" \
-d '{
    "id": 4, 
    "name": "Laptop Charger", 
    "price": 50.00
}'
```
```
$ curl -X POST http://localhost:8090/shop/order \
-H "Content-Type: application/json" \
-d '{
    "productId": 1, 
    "quantity": 1
}'
```
```
$ curl -X GET http://localhost:8090/shop/order/0
```

## Step 5 - View distributed tracing on OpenSearch Dashboard

Open the OpenSearch Dashboard in your browser at <http://localhost:5601> and login using the admin credentials you set up in the `.env` file.
Use the username `admin` and the password you set for `OPENSEARCH_INITIAL_ADMIN_PASSWORD`.

Navigate to the "Traces" tab under "Observability" section.

The image below is the sample tracing information you can see in Opensearch.

![OpenSearch traces Dashboard](/learn/images/opensearch-traces-dashboard.png "OpenSearch traces Dashboard")

![Span details in OpenSearch](/learn/images/span-details-opensearch.png "Span details in OpenSearch") 

Service map shows the relationship between different services in the system.

![Service map in OpenSearch](/learn/images/service-map-opensearch.png "Service map in OpenSearch")

![Service details in OpenSearch](/learn/images/service-details-opensearch.png "Service details in OpenSearch")

## Step 6 - View metrics on OpenSearch dashboard

Open the OpenSearch Dashboard in your browser at <http://localhost:5601> and navigate to the "Dashboards" tab under "OpenSearch Dashboards" section.

Then click on the "Integration metrics dashboard" to view the metrics.

![OpenSearch metrics dashboard](/learn/images/opensearch-metrics-dashboard-overall.png "OpenSearch metrics dashboard")

![OpenSearch metrics summary](/learn/images/opensearch-metrics-dashboard-summary.png "OpenSearch metrics summary")

## Step 7 - View logs on OpenSearch Dashboard

Open the OpenSearch Dashboard in your browser at <http://localhost:5601> and navigate to the "Dashboards" tab under "OpenSearch Dashboards" section.

Then click on the "Integration logs dashboard" to view the integration logs.

![OpenSearch logs dashboard](/learn/images/opensearch-logs-dashboard-overall.png "OpenSearch logs dashboard")

![OpenSearch logs view](/learn/images/opensearch-logs-dashboard-logs-view.png "OpenSearch logs view")
