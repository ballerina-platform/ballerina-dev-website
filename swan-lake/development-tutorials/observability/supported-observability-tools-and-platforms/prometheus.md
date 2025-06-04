---
title: Observe Ballerina programs with Prometheus
description: See how Ballerina supports observability by exposing itself via metrics to Prometheus.
keywords: ballerina, observability, metrics, prometheus
permalink: /learn/supported-observability-tools-and-platforms/prometheus/
active: prometheus
intro: Ballerina provides metrics compatible with <a href="https://prometheus.io/">Prometheus</a> which is widely used worldwide to monitor open-source systems.
---

The sample [shop service](/learn/overview-of-ballerina-observability/#example-observe-a-ballerina-service) will be used in this guide. Follow the steps given below to observe Ballerina metrics in Prometheus.

## Step 1 - Set up Prometheus
Prometheus is used as the monitoring system, which pulls out the metrics collected from the Ballerina `/metrics` service. This section focuses on the quick installation of Prometheus with Docker and the configuration required to collect metrics from the Ballerina service with the default configurations. Follow the steps below to configure Prometheus. 

>**Tip:** There are many other ways to install Prometheus and you can find possible options from the <a href="https://prometheus.io/docs/prometheus/latest/installation/" target="_blank">installation guide</a>.
> The easiest option is to use precompiled binaries listed in <a href="https://prometheus.io/download/" target="_blank">Downloads</a>.

1. Create a `prometheus.yml` file in a directory.

2. Add the following content to the `prometheus.yml` file.

    ```yaml
    global:
      scrape_interval:     15s
      evaluation_interval: 15s
    
    scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['a.b.c.d:9797']
    ```

    Here, the `'a.b.c.d:9797'` targets should contain the host and port of the `/metrics` service that is exposed from 
    Ballerina for metrics collection. Add the IP of the host in which the Ballerina service is running as `a.b.c.d` and its
    port (default `9797`).
    If you need more information, go to the <a href="https://prometheus.io/docs/introduction/first_steps/" target="_blank">Prometheus documentation</a>.
    
    If your Ballerina service is running on localhost and Prometheus in a Docker container,
    add the target as `host.docker.internal:9797` to access the localhost from Docker.

3.  Start the Prometheus server in a Docker container with the command below.

    ```
    $ docker run -p 19090:9090 -v <path_to_prometheus.yml>:/etc/prometheus/ prom/prometheus
    ```

## Step 2 - Import Ballerina Prometheus extension

To include the Prometheus extension into the executable, the `ballerinax/prometheus` module needs to be imported into your Ballerina project `main.bal` file.

```ballerina
import ballerinax/prometheus as _;
```

To support Prometheus as the metrics reporter, an HTTP endpoint starts with the context of `/metrics` in default port `9797` when starting the Ballerina service.

## Step 3 - Configure Ballerina runtime configurations
You can set up prometheus for your Ballerina project using configurations similar to the following in your `Config.toml` file.

```toml
[ballerina.observe]
metricsEnabled=true
metricsReporter="prometheus"

[ballerinax.prometheus]
port=9797
host="0.0.0.0"
```

Configuration key | Description | Default value | Possible values 
--- | --- | --- | --- 
`ballerinax.prometheus.port` | The value of the port to which the '/metrics' service will bind. This service will be used by Prometheus to scrape the information of the Ballerina service. | `9797` | Any suitable value for port 0 - 0 - 65535. However, within that range, ports `0` - `1023` are generally reserved for specific purposes. Therefore, it is advisable to select a port outside that range. 
`ballerinax.prometheus.host` | The name of the host to which the '/metrics' service will bind. This service will be used by Prometheus to scrape the information of the Ballerina service. | `0.0.0.0` | IP or Hostname or `0.0.0.0` of the node in which the Ballerina service is running.

## Step 4 - Run the Ballerina service

When Ballerina observability is enabled, the Ballerina runtime exposes internal metrics via an HTTP endpoint (`/metrics`) for metrics monitoring, and the metrics will be published to Prometheus. Prometheus should be configured to scrape metrics from the metrics HTTP endpoint in Ballerina.

Run the following command to start the Ballerina service.

```
$ bal run

Compiling source

Running executable

ballerina: started Prometheus HTTP listener 0.0.0.0:9797
```

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

## Step 6 - View metrics on the Prometheus server

Go to <http://localhost:19090/> and check whether you can see the Prometheus graph.
Ballerina metrics should appear in the Prometheus graph's metrics list when the Ballerina service is started.

![Ballerina metrics listed in Prometheus](/learn/images/ballerina-metrics-listed-in-prometheus.png "Ballerina metrics listed in Prometheus")

![Ballerina metric in graph format](/learn/images/ballerina-metrics-in-graph.png "Ballerina metric in graph format")

You can also use the following command to get the metrics.

```
$ curl http://localhost:9797/metrics
```

## Set up Grafana

[Grafana](https://grafana.com/) can be used to visualize Ballerina metrics provided for Prometheus. First, users need to set up the Ballerina project to observe metrics in Prometheus and follow the steps mentioned above.

Let’s use Grafana to visualize metrics in a dashboard. For this, we need to install Grafana and configure Prometheus as a data source. Follow the steps below to configure Grafana.

1. Start Grafana as a Docker container with the command below.

    ```
    $ docker run -d --name=grafana -p 3000:3000 grafana/grafana
    ```
    For more information, go to <a href="https://hub.docker.com/r/grafana/grafana/" target="_blank">Grafana in Docker Hub</a>.

2. Go to <http://localhost:3000/> to access the Grafana dashboard running on Docker.

3. Login to the dashboard with the default user, username: `admin` and password: `admin`

4. Add Prometheus as a data source with the `Browser` access configuration as provided below.

    ![Grafana Prometheus data source](/learn/images/grafana-prometheus-datasource.png "Grafana Prometheus data source")

5. Import the Grafana dashboard designed to visualize Ballerina metrics from <a href="https://grafana.com/dashboards/5841" target="_blank">https://grafana.com/dashboards/5841</a> as shown below.
    ![Import dashboard for Ballerina](/learn/images/grafana-import-dashboard.png "Import dashboard For Ballerina")

This dashboard consists of service and client invocation level metrics in near real-time view. 

The Ballerina HTTP service metrics dashboard panel will be as shown below.

![Ballerina metrics dashboard](/learn/images/grafana-ballerina-metrics-dashboard.png "Ballerina metrics dashboard")
