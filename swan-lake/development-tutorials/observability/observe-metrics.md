---
title: Observe metrics 
description: See how Ballerina supports observing metrics of Ballerina programs.
keywords: ballerina, observability, metrics, prometheus, grafana
permalink: /learn/observe-metrics/
active: observe-metrics
intro: Metrics help to monitor the runtime behavior of a service. Therefore, metrics are a vital part of monitoring Ballerina services.
---

However, metrics are not the same as analytics. For example, it should not be used to perform
per-request billing or similar use cases. Metrics are used to measure what a Ballerina service does at runtime to make
better decisions using the numbers. The code generates business value when it continuously runs in production.
Therefore, it is imperative to continuously measure the code in production.

To support Prometheus as the metrics reporter, an HTTP endpoint starts with the context
of `/metrics` in default port 9797 when starting the Ballerina service.

### Configure advanced metrics 
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

The descriptions of each configuration option are provided below with possible values.

Configuration key | Description | Default value | Possible values 
--- | --- | --- | --- 
ballerina.observe. metricsEnabled | Whether metrics monitoring is enabled (true) or disabled (false) | false | true or false
ballerina.observe. metricsReporter | Reporter name that reports the collected Metrics to the remote metrics server. This is only required to be modified if a custom reporter is implemented and needs to be used. | choreo | prometheus or if any custom implementation, the name of the reporter.
ballerinax.prometheus. port | The value of the port to which the '/metrics' service will bind to. This service will be used by Prometheus to scrape the information of the Ballerina service. | 9797 | Any suitable value for port 0 - 0 - 65535. However, within that range, ports 0 - 1023 are generally reserved for specific purposes, therefore it is advisable to select a port without that range. 
ballerinax.prometheus. host | The name of the host to which the '/metrics' service will bind to. This service will be used by Prometheus to scrape the information of the Ballerina service. | 0.0.0.0 | IP or Hostname or 0.0.0.0 of the node in which the Ballerina service is running.

### Set up the external systems for metrics
There are mainly two systems involved in collecting and visualizing the metrics. Prometheus is used to collect the
metrics from the Ballerina service while Grafana can be used to connect to Prometheus and visualize the metrics on the dashboard.

#### Set up Prometheus
Prometheus is used as the monitoring system, which pulls out the metrics collected from the Ballerina `/metrics` service. This section focuses on the quick installation of Prometheus with Docker and the configuration required to 
collect metrics from the Ballerina service with the default configurations. Follow the steps below to configure 
Prometheus. 

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
    $ docker run -p 19090:9090 -v <path_to_prometheus.yml>:/etc/prometheus/prometheus.yml prom/prometheus
    ```
    
4.  Go to <http://localhost:19090/> and check whether you can see the Prometheus graph.
Ballerina metrics should appear in Prometheus graph's metrics list when the Ballerina service is started. You can also use the following command to get the metrics.

    ```
    $ curl http://localhost:9797/metrics
    ```

#### Set up Grafana
Let’s use Grafana to visualize metrics in a dashboard. For this, we need to install Grafana and configure
Prometheus as a data source. Follow the steps below to configure Grafana.

1. Start Grafana as a Docker container with the command below.

    ```
    $ docker run -d --name=grafana -p 3000:3000 grafana/grafana
    ```
    For more information, go to <a href="https://hub.docker.com/r/grafana/grafana/" target="_blank">Grafana in Docker Hub</a>.

2. Go to <http://localhost:3000/> to access the Grafana dashboard running on Docker.

3. Login to the dashboard with the default user, username: `admin` and password: `admin`

4. Add Prometheus as a data source with `Browser` access configuration as provided below.

    ![Grafana Prometheus datasource](/learn/images/grafana-prometheus-datasource.png "Grafana Prometheus Datasource")

5. Import the Grafana dashboard designed to visualize Ballerina metrics from <a href="https://grafana.com/dashboards/5841" target="_blank">https://grafana.com/dashboards/5841</a> as shown below.
    ![Import dashboard for Ballerina](/learn/images/grafana-import-dashboard.png "Import Dashboard For Ballerina")

This dashboard consists of service and client invocation level metrics in near real-time view. 

The Ballerina HTTP Service Metrics Dashboard Panel will be as shown below.

![Ballerina Service Metrics](/learn/images/grafana-ballerina-metrics-1.png "Ballerina Sample Service Metrics Dashboard")
