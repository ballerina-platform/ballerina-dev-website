---
title: Observe metrics and tracing using OpenTelemetry
description: See how Ballerina supports observability by exporting traces and metrics over OTLP to any OpenTelemetry-compatible backend.
keywords: ballerina, observability, opentelemetry, otel, otlp, tracing, metrics, opentelemetry collector
permalink: /learn/supported-observability-tools-and-platforms/opentelemetry/
active: opentelemetry
intro: Users can configure Ballerina to export traces and metrics using the [OpenTelemetry](https://opentelemetry.io/) Protocol (OTLP). Any OTLP-compatible backend can receive them, including the OpenTelemetry Collector, Jaeger, Prometheus, Grafana Tempo, and most commercial observability platforms.
---

Use OpenTelemetry when you want one exporter for both traces and metrics, or when you want to route telemetry through an OpenTelemetry Collector rather than tie your program to a single backend.

>**Note:** From Ballerina 2201.14.0 (Swan Lake Update 14) onwards, version 1.0.0 of the OpenTelemetry extension (`ballerina/otel`) is bundled with the distribution. You do not need to import it or add a dependency. Enable it in the `Ballerina.toml` and `Config.toml` files as shown below.

The sample [shop service](/learn/overview-of-ballerina-observability/#example-observe-a-ballerina-service) will be used in this guide. Follow the steps given below to observe Ballerina traces and metrics using OpenTelemetry.

## Step 1 - Set up an OpenTelemetry Collector

For local testing, run an <a href="https://opentelemetry.io/docs/collector/" target="_blank">OpenTelemetry Collector</a> that prints the telemetry it receives.

1. Create an `otel-collector-config.yaml` file with the following content.

    ```yaml
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318

    exporters:
      debug:
        verbosity: detailed

    service:
      pipelines:
        traces:
          receivers: [otlp]
          exporters: [debug]
        metrics:
          receivers: [otlp]
          exporters: [debug]
    ```

2. Start the Collector in a Docker container with the command below.

    ```
    $ docker run --rm --name otel-collector \
      -p 4317:4317 \
      -p 4318:4318 \
      -v "$(pwd)/otel-collector-config.yaml:/etc/otelcol-contrib/config.yaml:ro" \
      otel/opentelemetry-collector-contrib:latest
    ```

## Step 2 - Enable observability in the build

Add the following to the `Ballerina.toml` file of your project.

```toml
[build-options]
observabilityIncluded = true
```

This packs the observability runtime, including the OpenTelemetry extension, into the executable.

## Step 3 - Configure Ballerina runtime configurations

Select `otel` as the tracing provider, the metrics reporter, or both, in the `Config.toml` file.

```toml
[ballerina.observe]
tracingEnabled = true
tracingProvider = "otel"
metricsEnabled = true
metricsReporter = "otel"

[ballerina.otel]
tracesEndpoint = "http://localhost:4317"
metricsEndpoint = "http://localhost:4317"
metricsServiceName = "shop-service"

[ballerina.otel.tracesResourceAttributes]
"deployment.environment" = "production"
```

With these settings, the program exports traces and metrics over OTLP/gRPC to the OTLP receiver on `localhost:4317`, such as the Collector started in Step 1. To send them somewhere else, see [Send to other backends](#send-to-other-backends). Every setting under `[ballerina.otel]` is optional. If you leave one out, the default value given in the tables below applies.

>**Tip:** Each signal is controlled by its own setting. To export only traces, set `tracingProvider = "otel"` and leave `metricsEnabled` off, or set `metricsReporter` to a different reporter such as `"prometheus"`.

### Use OTLP over HTTP

Both signals use OTLP/gRPC by default. To use OTLP/HTTP with protobuf encoding, set the protocol and give the **full signal URL**, including the `/v1/traces` or `/v1/metrics` path.

```toml
[ballerina.otel]
tracesProtocol = "http/protobuf"
tracesEndpoint = "http://localhost:4318/v1/traces"
metricsProtocol = "http/protobuf"
metricsEndpoint = "http://localhost:4318/v1/metrics"
```

### Trace configurations

Configuration key | Description | Default value | Possible values
--- | --- | --- | ---
`ballerina.otel.tracesEndpoint` | The OTLP endpoint for traces. For `http/protobuf`, use the full URL ending with `/v1/traces`. | `http://localhost:4317` | A URL starting with `http://` or `https://`
`ballerina.otel.tracesProtocol` | The export protocol. | `grpc` | `grpc` or `http/protobuf`
`ballerina.otel.tracesSampler` | The sampling strategy. See [Sampling](#sampling). | `parentbased_always_on` | `always_on`, `always_off`, `traceidratio`, `parentbased_always_on`, `parentbased_always_off`, `parentbased_traceidratio`, or `ratelimiting`
`ballerina.otel.tracesSamplerArg` | The sampler argument. Samplers other than the ratio and rate-limiting samplers ignore it. | `1` | A probability from `0.0` to `1.0` for the ratio samplers, or traces per second for `ratelimiting`
`ballerina.otel.tracesExporterTimeoutMillis` | The maximum time to wait for each export, in milliseconds. | `10000` | Any positive integer
`ballerina.otel.tracesMaxExportBatchSize` | The maximum number of spans sent in one export. | `512` | Any positive integer
`ballerina.otel.tracesExporterHeaders` | Headers sent with each export. See [Authenticate with headers](#authenticate-with-headers). | `""` | Comma-separated `key=value` pairs
`ballerina.otel.tracesLogConsole` | Whether export activity is logged to the console. See [Troubleshoot exports](#troubleshoot-exports). | `false` | `true` or `false`
`ballerina.otel.tracesLogFile` | The path of a file to log export activity to. | `""` | Any file path
`ballerina.otel.tracesLogLevel` | The export log level. | `info` | `debug`, `info`, `warn`, or `error`

Set resource attributes for traces in the `[ballerina.otel.tracesResourceAttributes]` table.

### Metrics configurations

Configuration key | Description | Default value | Possible values
--- | --- | --- | ---
`ballerina.otel.metricsEndpoint` | The OTLP endpoint for metrics. For `http/protobuf`, use the full URL ending with `/v1/metrics`. | `http://localhost:4317` | A URL starting with `http://` or `https://`
`ballerina.otel.metricsProtocol` | The export protocol. | `grpc` | `grpc` or `http/protobuf`
`ballerina.otel.metricsServiceName` | The value of the `service.name` resource attribute for metrics. | `""` | Any string
`ballerina.otel.metricsExportIntervalMillis` | How often metrics are exported, in milliseconds. | `60000` | Any integer greater than `0`
`ballerina.otel.metricsExporterTimeoutMillis` | The maximum time to wait for each export, in milliseconds. | `10000` | Any positive integer
`ballerina.otel.metricsPrefix` | A prefix added to every metric name, joined with `_`. For example, `myapp` turns `requests_total` into `myapp_requests_total`. | `""` | Any string
`ballerina.otel.metricsExporterHeaders` | Headers sent with each export. See [Authenticate with headers](#authenticate-with-headers). | `""` | Comma-separated `key=value` pairs

Set resource attributes for metrics in the `[ballerina.otel.metricsResourceAttributes]` table.

### Resource attributes and service name

Resource attributes describe the source of the telemetry, such as the service name, version, or environment. Traces and metrics have separate tables, so set both if you want the same attributes on both signals. Quote the keys, since attribute names contain dots.

```toml
[ballerina.otel.tracesResourceAttributes]
"service.name" = "shop-service"
"service.version" = "1.2.0"
"deployment.environment" = "production"

[ballerina.otel.metricsResourceAttributes]
"service.name" = "shop-service"
"service.version" = "1.2.0"
"deployment.environment" = "production"
```

The `service.name` attribute works differently for each signal.

- **Traces:** Each Ballerina service reports its own name as `service.name` by default. Set `service.name` in `tracesResourceAttributes` to replace it with a single name for every service.
- **Metrics:** `service.name` is taken from `metricsServiceName` and is empty by default. Set `metricsServiceName`, or set `service.name` in `metricsResourceAttributes`. The resource attribute takes precedence if you set both.

## Step 4 - Run the Ballerina service

Run the following command to start the Ballerina service.

```
$ bal run
```

At startup, the program prints the endpoint and protocol to which each signal is exported.

## Step 5 - Send requests

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

## Step 6 - View traces and metrics

The received spans and metrics appear in the console output of the Collector. Spans are exported shortly after each request, while metrics are exported once per `metricsExportIntervalMillis` (60 seconds by default).

## Sampling

Sampling controls which requests produce traces. Set the strategy with `tracesSampler` and its argument with `tracesSamplerArg`.

Sampler | `tracesSamplerArg` | Description
--- | --- | ---
`always_on` | Ignored | Sample every trace.
`always_off` | Ignored | Sample nothing.
`traceidratio` | `0.0` to `1.0` | Sample this fraction of traces, based on the trace ID.
`parentbased_always_on` | Ignored | Follow the sampling decision of the caller. Sample root spans. This is the default.
`parentbased_always_off` | Ignored | Follow the sampling decision of the caller. Do not sample root spans.
`parentbased_traceidratio` | `0.0` to `1.0` | Follow the sampling decision of the caller. Sample this fraction of root spans.
`ratelimiting` | Traces per second | Sample at most this many traces per second.

The `parentbased_*` samplers respect the decision of an upstream service, which keeps traces complete across service boundaries. In production, use `parentbased_traceidratio` or `ratelimiting` to reduce overhead. For example, use the following configuration to sample 10% of new traces.

```toml
[ballerina.otel]
tracesSampler = "parentbased_traceidratio"
tracesSamplerArg = 0.1
```

## Authenticate with headers

Most hosted backends require an API key or token in a request header. Set `tracesExporterHeaders` and `metricsExporterHeaders` as comma-separated `key=value` pairs. This is the same format as the standard `OTEL_EXPORTER_OTLP_TRACES_HEADERS` and `OTEL_EXPORTER_OTLP_METRICS_HEADERS` environment variables.

```toml
[ballerina.otel]
tracesEndpoint = "https://otlp.example.com:4317"
tracesExporterHeaders = "api-key=<your-api-key>,x-tenant=orders"
metricsEndpoint = "https://otlp.example.com:4317"
metricsExporterHeaders = "api-key=<your-api-key>,x-tenant=orders"
```

Values can be percent-encoded. For example, write a space as `%20` and a comma as `%2C`. A `+` stays a literal plus, so Base64 values work as they are. Use an `https://` endpoint to send headers over TLS.

>**Note:** Do not commit API keys in the `Config.toml` file. Supply them at deployment time, for example, from a Kubernetes secret mounted as the `Config.toml` file, or via the `BAL_CONFIG_DATA` environment variable.

## Send to other backends

Point the extension at a backend directly, or keep it pointed at a Collector and change only the exporters of the Collector.

### Jaeger

Jaeger accepts OTLP natively. If the Collector from Step 1 is still running, stop it first to free ports `4317` and `4318`.

```
$ docker stop otel-collector
```

Then, start Jaeger with OTLP enabled.

```
$ docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 16686:16686 \
  jaegertracing/all-in-one:latest
```

Keep the default `tracesEndpoint = "http://localhost:4317"`. Go to <http://localhost:16686> and select your service to view traces. Jaeger stores traces only, so send metrics elsewhere.

### Prometheus

Prometheus 3.0 and later can receive OTLP metrics directly when started with the `--web.enable-otlp-receiver` flag. The receiver accepts OTLP/HTTP only.

```
$ docker run -d --name prometheus \
  -p 9090:9090 \
  prom/prometheus:latest \
  --config.file=/etc/prometheus/prometheus.yml \
  --web.enable-otlp-receiver
```

```toml
[ballerina.otel]
metricsProtocol = "http/protobuf"
metricsEndpoint = "http://localhost:9090/api/v1/otlp/v1/metrics"
metricsServiceName = "shop-service"
```

To have Prometheus scrape a `/metrics` endpoint exposed by the program instead of pushing metrics, see [Observe metrics using Prometheus](/learn/supported-observability-tools-and-platforms/prometheus/).

### Multiple backends through the Collector

To fan out to several backends, send telemetry to an OpenTelemetry Collector and configure an exporter for each backend. The following Collector configuration receives OTLP on the default ports, and sends traces to Jaeger and metrics to Prometheus.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  otlp/jaeger:
    endpoint: jaeger:4317
    tls:
      insecure: true
  otlphttp/prometheus:
    endpoint: http://prometheus:9090/api/v1/otlp

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/jaeger]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/prometheus]
```

Point `tracesEndpoint` and `metricsEndpoint` to the Collector. To add or change backends later, change only the exporters of the Collector. The configuration of the Ballerina program stays the same.

## Troubleshoot exports

If nothing reaches your backend, enable export logging to check whether exports succeed.

```toml
[ballerina.otel]
tracesLogConsole = true
tracesLogFile = "/var/log/ballerina/otel-export.log"
tracesLogLevel = "info"
```

At the `info` level, each export logs the number of spans and the result. At the `debug` level, it also logs the full span payload.

>**Note:** Span payloads can contain sensitive data. Use the `debug` level only while troubleshooting, and remove it afterwards.

The following are some common issues.

Symptom | Likely cause
--- | ---
The program fails to start with an `invalid Otel configuration` error. | A value is not one of the allowed options, such as a misspelled sampler or protocol, or an endpoint without `http://` or `https://`. The error names the setting.
Traces are exported over HTTP but nothing arrives. | `tracesEndpoint` is missing the `/v1/traces` path. The same applies to `/v1/metrics` for metrics.
Metrics appear without a service name. | `metricsServiceName` or `service.name` in `metricsResourceAttributes` is not set.
Metrics arrive late. | Metrics are exported once per `metricsExportIntervalMillis` (60 seconds by default). Lower it for development.
Telemetry goes to another local agent. | Another agent, such as a Datadog Agent, is already listening on port `4317` or `4318`. Stop it, or map the Collector to different host ports.
