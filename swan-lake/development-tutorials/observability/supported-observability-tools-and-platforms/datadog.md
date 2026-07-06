---
title: Observe metrics, tracing, and logs using Datadog
description: See how Ballerina supports observability by exposing itself via metrics, tracing, and logs to Datadog.
keywords: ballerina, observability, metrics, tracing, logs, datadog
permalink: /learn/supported-observability-tools-and-platforms/datadog/
active: datadog
intro: Users can observe Ballerina programs with [Datadog](https://www.datadoghq.com/), which is a comprehensive observability and monitoring platform for cloud-scale applications. It provides developers, IT operations teams, and business users with tools to monitor, troubleshoot, and optimize performance across their entire technology stack, including applications, servers, databases, and services. Metrics, tracing, and logs in Ballerina can all be viewed with Datadog.
---

The sample [shop service](/learn/overview-of-ballerina-observability/#example-observe-a-ballerina-service) will be used in this guide. Follow the steps given below to observe Ballerina metrics, tracing, and logs in Datadog.

## Step 1 - Create a Datadog account and an API key

1. Create a Datadog account

   Create a new account in Datadog. Select a billing plan according to your needs (a free plan is also available).

2. Create an API key

   You need to create an API key for the Datadog Agent. To create an API key,

   > **Click Profile → Organization Settings → API keys**

   ![Creating an API key in Datadog](/learn/images/datadog-creating-api-key.png "Creating an API key in Datadog")

## Step 2 - Set up the Datadog Agent using Docker

The recommended way to run the Datadog Agent locally is using Docker. The Agent collects metrics by scraping the Prometheus endpoint exposed by the Ballerina service, receives traces via OTLP/gRPC, and tails log files written by Ballerina.

1. Add configuration for metrics

   Create the file `datadog/conf.d/openmetrics.d/conf.yaml`. The Agent will scrape the Ballerina Prometheus endpoint on a 15-second interval and forward the metrics to Datadog.

   > **Note:** The Agent runs inside Docker, so `host.docker.internal` is used to reach the Ballerina service running on the host machine. Using `localhost` here would refer to the container itself, not the host.

   ```yaml
   init_config:

   instances:
     - openmetrics_endpoint: http://host.docker.internal:9797/metrics
       namespace: ballerina
       metrics:
         - response_time_seconds_value
         - response_time_seconds_max
         - response_time_seconds_min
         - response_time_seconds_mean
         - response_time_seconds_stdDev
         - response_time_seconds
         - response_time_nanoseconds_total_value
         - requests_total_value
         - response_errors_total_value
         - inprogress_requests_value
       headers:
         Accept: "text/plain; version=0.0.4"
   ```

2. Add configuration for log collection

   Create the file `datadog/conf.d/ballerina.d/conf.yaml`. The Agent will tail all `.log` files written to the mounted `logs/` directory.

   ```yaml
   logs:
     - type: file
       path: path/to/logs/*.log
       service: shop_service
       source: ballerina
   ```

   The `source: ballerina` tag enables automatic log parsing in Datadog. The `service` value should match your APM service name so that logs and traces are automatically correlated in the UI.

3. Start the Datadog Agent

   Install the Datadog Agent via Docker and start the container by executing the command below. Replace `<your-api-key>` with the API key created in Step 1 and `<your-dd-site>` with your Datadog site (e.g., `datadoghq.com`, `ap2.datadoghq.com`).

   > **Note:** Find your Datadog site from your account URL — for example, `app.datadoghq.com` → `datadoghq.com`, `app.ap2.datadoghq.com` → `ap2.datadoghq.com`.

   ```
   $ docker run -d \
       --name datadog-agent \
       -e DD_API_KEY=<your-api-key> \
       -e DD_SITE=<your-dd-site> \
       -e DD_HOSTNAME=ballerina-dev \
       -e DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_GRPC_ENDPOINT=0.0.0.0:4317 \
       -e DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_HTTP_ENDPOINT=0.0.0.0:4318 \
       -e DD_LOGS_ENABLED=true \
       -e DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=false \
       -e DD_ENV=dev \
       -e DD_SERVICE=shop_service \
       -e DD_VERSION=0.1.0 \
       -p 4317:4317 \
       -p 4318:4318 \
       -v "$(pwd)/datadog/conf.d:/etc/datadog-agent/conf.d:ro" \
       -v "$(pwd)/logs:/logs:ro" \
       gcr.io/datadoghq/agent:latest
   ```

   The key environment variables are described below.

   | Environment variable | Description |
   | --- | --- |
   | `DD_API_KEY` | Your Datadog API key. |
   | `DD_SITE` | Your Datadog site (e.g., `datadoghq.com`, `ap2.datadoghq.com`). |
   | `DD_HOSTNAME` | A fixed hostname for the Agent. Required when running in a container on macOS because the Agent cannot auto-detect the hostname. |
   | `DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_GRPC_ENDPOINT` | Enables the OTLP gRPC receiver. The Ballerina Jaeger extension pushes traces to this endpoint. |
   | `DD_LOGS_ENABLED` | Enables log collection in the Agent. |
   | `DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL` | Disables automatic collection of all container logs (only configured sources are tailed). |

## Step 3 - Import Ballerina Prometheus and Jaeger extensions

To include the Prometheus and Jaeger extensions into the executable, the `ballerinax/prometheus` and `ballerinax/jaeger` modules need to be imported into your Ballerina project `main.bal` file.

```ballerina
import ballerinax/prometheus as _;
import ballerinax/jaeger as _;
```

To support Prometheus as the metrics reporter, an HTTP endpoint starts with the context of `/metrics` on the default port 9797 when starting the Ballerina service.

The Jaeger extension has an OpenTelemetry gRPC span exporter which pushes tracing data as batches to the configured endpoint (default `localhost:4317`) in OpenTelemetry format.

## Step 4 - Configure Ballerina runtime configurations

Tracing, metrics, and logging can be enabled in your Ballerina project using the following configurations in your `Config.toml` file.

```toml
[ballerina.observe]
tracingEnabled=true
tracingProvider="jaeger"
metricsEnabled=true
metricsReporter="prometheus"

[ballerinax.prometheus]
port=9797
host="0.0.0.0"

[ballerinax.jaeger]
agentHostname="localhost"
agentPort=4317
samplerType="const"
samplerParam=1.0
reporterFlushInterval=2000
reporterBufferSize=1000

[ballerina.log]
format="json"
keyValues={service="shop_service", env="dev"}       # Optional: fixed key-value pairs attached to every log entry.

[[ballerina.log.destinations]]
path="path/to/logs/shop_service.log"
```

The `[ballerina.log]` section configures structured log output. Setting `format="json"` produces one JSON object per log line that Datadog parses automatically into individual searchable fields. The `keyValues` map attaches fixed labels to every log entry. The `[[ballerina.log.destinations]]` entry write logs to a file; the Datadog Agent tails the file through the volume mount configured in Step 2.

The table below provides the descriptions of each configuration option and possible values that can be assigned.

| Configuration key | Description | Default value | Possible values |
| --- | --- | --- | --- |
| `ballerinax.prometheus.port` | Port to which the `/metrics` endpoint will bind. | `9797` | Any port in the range 0–65535 (avoid 0–1023, which are reserved). |
| `ballerinax.prometheus.host` | Host to which the `/metrics` endpoint will bind. | `0.0.0.0` | IP or hostname of the node running the Ballerina service. |
| `ballerinax.jaeger.agentHostname` | Hostname of the OTLP agent. | `localhost` | IP or hostname of the agent. Use `localhost` when the Datadog Agent port is forwarded to the host (as in the Docker setup above). |
| `ballerinax.jaeger.agentPort` | Port of the OTLP agent. | `4317` | The port on which the agent is listening for OTLP gRPC. |
| `ballerinax.jaeger.samplerType` | Sampling method used in the Jaeger tracer. | `const` | `const`, `probabilistic`, or `ratelimiting`. |
| `ballerinax.jaeger.samplerParam` | Sampler parameter. Effect depends on the sampler type. | `1.0` | For `const`: `0` (no sampling) or `1` (sample all spans). For `probabilistic`: `0.0` to `1.0`. For `ratelimiting`: any positive integer (rate per second). |
| `ballerinax.jaeger.reporterFlushInterval` | Interval (ms) at which spans are flushed to the agent. | `2000` | Any positive integer. |
| `ballerinax.jaeger.reporterBufferSize` | Queue size of the Jaeger client. | `1000` | Any positive integer. |
| `ballerina.log.format` | Log output format. | `logfmt` | `logfmt` or `json`. |
| `ballerina.log.keyValues` | Fixed key-value pairs attached to every log entry. | — | An inline TOML table, e.g., `{service="shop_service", env="dev"}`. |

## Step 5 - Run the Ballerina service

When Ballerina observability is enabled, the runtime collects tracing and metrics data and publishes them to Datadog. Logs are written to the file path configured under `[[ballerina.log.destinations]]` and are tailed by the Datadog Agent.

Run the following command to start the Ballerina service.

```
$ bal run

Compiling source

Running executable

ballerina: started Prometheus HTTP listener 0.0.0.0:9797
ballerina: started publishing traces to Jaeger on localhost:4317
```

## Step 6 - Send requests

Send requests to <http://localhost:8090/shop/products>.

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

## Step 7 - View metrics on Datadog

You can observe the metrics in the Datadog platform under the **Metrics** tab in the left navigation.

![Metrics Explorer in Datadog](/learn/images/datadog-metrics-explorer.png "Metrics Explorer in Datadog")

You can add filters and use functions in Datadog to visualize what you want with the metrics provided by Ballerina. Metrics will appear under the `ballerina.*` namespace as configured by the `namespace: ballerina` field in the openmetrics config.

Ballerina provides a [dashboard](https://raw.githubusercontent.com/ballerina-platform/module-ballerinax-prometheus/refs/heads/main/metrics-dashboards/datadog/ballerina_metrics_dashboard.json) in Datadog to observe metrics in Ballerina applications.

You can add a new dashboard in Datadog under the **Dashboards** tab in the left navigation. After creating the new dashboard, go to the **Configure** tab in the dashboard. Import the `ballerina_metrics_dashboard.json` file provided above.

![Importing a dashboard json](/learn/images/datadog-importing-dashboard.png "Importing a dashboard json")

The Ballerina Dashboard in Datadog will be displayed as below.

![Ballerina Dashboard in Datadog](/learn/images/datadog-metrics-dashboard-1.png "Ballerina Dashboard in Datadog")
![Ballerina Dashboard in Datadog](/learn/images/datadog-metrics-dashboard-2.png "Ballerina Dashboard in Datadog")

## Step 8 - View tracing on Datadog

To view traces of the Ballerina application, go to **APM → Traces** in Datadog.

![Trace Explorer in Datadog](/learn/images/datadog-trace-explorer.png "Trace Explorer in Datadog")

You can filter the traces with the service name, resource, operation name, span kind, etc.

![Filter traces in Datadog](/learn/images/datadog-filter-traces.png "Filter traces in Datadog")

Once you select a trace, you can get more information with the tags attached to the span.

![Span tags for a given span](/learn/images/datadog-span-tags.png "Span tags for a given span")

## Step 9 - View logs on Datadog

Ballerina log entries written in JSON format are automatically parsed by Datadog into structured fields, making them fully searchable and filterable. Because each log entry includes the `traceId` and `spanId` fields, Datadog can correlate logs directly with the corresponding APM trace.

To view logs, go to **Logs → Explorer** in Datadog and filter by `service:shop_service` or `source:ballerina`.

![Log Explorer in Datadog](/learn/images/datadog-log-explorer.png "Log Explorer in Datadog")

You can filter logs by level, service, module, or any other field present in the JSON output.

When `format="json"` is configured, each log entry contains the following fields.

| Field | Description |
| --- | --- |
| `time` | Timestamp of the log entry. |
| `level` | Log level (`DEBUG`, `INFO`, `WARN`, `ERROR`). |
| `module` | The Ballerina module that produced the log entry. |
| `message` | The log message. |
| `traceId` | OpenTelemetry trace ID — links the log entry to an APM trace. |
| `spanId` | OpenTelemetry span ID. |

![Log details in Datadog](/learn/images/datadog-log-details.png "Log details in Datadog")
