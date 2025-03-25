---
title: Overview of Ballerina Observability
description: See how Ballerina supports observability by exposing itself via metrics, tracing, and logs to external systems.
keywords: ballerina, observability, metrics, tracing, logs, opentelemetry
permalink: /learn/overview-of-ballerina-observability/
active: overview-of-ballerina-observability
intro: Observability is a measure of how well the internal states of a system can be inferred from the knowledge of its external outputs.
---

Ballerina Observability is a built-in feature designed to facilitate monitoring and debugging Ballerina applications by collecting, processing, and analyzing performance and operational data. It integrates seamlessly with observability tools and supports three primary pillars of observability.

1. **Metrics** - Provide quantitative insights into the performance of an application, such as request counts, latencies, and error counts.
2. **Tracing** - Used to track requests/transactions as they flow through different services in a distributed system from the point of entry to exit.
3. **Logging** - Text records of activities that occurred with relevant information along with the timestamp with various log levels for further analysis.

Observability is understanding a system's state based on the data it generates, such as logs, metrics, and traces. Observability tools and platforms enable developers to monitor, troubleshoot, and optimize their applications effectively.

Ballerina services and any client connectors are observable by default. HTTP/HTTPS and SQL client connectors use semantic tags to make tracing and metrics monitoring more informative.

## Provide observability in Ballerina

This guide demonstrates how to enable Ballerina observability to observe Ballerina services using different tools and platforms. We will use the example given below.

### Example: A simple Ballerina service to observe
Create a new Ballerina project using the `bal new` command.
```
$ bal new observability_demo

Created new package 'observability_demo' at observability_demo.
```

Delete everything inside the `main.bal` file which is located inside the newly created `observability_demo` directory, and replace it with the following code to create a Ballerina service.

```ballerina
import ballerina/http;
import ballerina/log;

// Define data structures.
type Product record {|
    int id;
    string name;
    float price;
|};

type OrderRequest record {|
    int productId;
    int quantity;
|};

type Order record {|
    int orderId;
    int productId;
    int quantity;
    float totalPrice;
|};

// Sample data
map<Product> products = {
    "1": {id: 1, name: "Laptop", price: 1200.00},
    "2": {id: 2, name: "Smartphone", price: 800.00},
    "3": {id: 3, name: "Headphones", price: 150.00}
};

map<Order> orders = {};
int orderCount = 0;

@display {
    label: "Shopping Service"
}
service /shop on new http:Listener(8090) {

    // List available products.
    resource function get products() returns Product[] {
        log:printInfo("Fetching product list");
        return products.toArray();
    }

    // Add a new product.
    resource function post product(@http:Payload Product product) returns http:Created|http:Conflict|error? {
        log:printInfo("Adding a new product");

        if (products.hasKey(product.id.toString())) {
            log:printError("Product already exists with product ID:" + product.id.toString());
            http:Conflict errorResponse = {
                body:  "Product already exists"
            };
            return errorResponse;
        }

        products[product.id.toString()] = product;
        log:printInfo("Product added successfully. " + product.toString());
        http:Created response = {
            body:  "Product added successfully"
        };
        return response;   
    }

    // Place a new order.
    resource function post 'order(@http:Payload OrderRequest orderRequest) returns http:Accepted|http:NotFound|error? {
        log:printInfo("Received order request");

        if !products.hasKey(orderRequest.productId.toString()) {
            log:printError("Product not found with product ID: " + orderRequest.productId.toString());
            http:NotFound errorResponse = {
                body:  "Product not found with product ID: " + orderRequest.productId.toString()
            };
            return errorResponse;
        }
        Product product = products.get(orderRequest.productId.toString());
        Order newOrder = {orderId: orderCount, productId: orderRequest.productId, quantity: orderRequest.quantity, totalPrice: product.price * orderRequest.quantity};
        orders[orderCount.toString()] = newOrder;
        orderCount += 1;

        log:printInfo("Order placed successfully. " + newOrder.toString());
        http:Accepted response = {
            body:  newOrder.toJson()
        };
        return response;
    }

    // Get order details by ID.
    resource function get 'order/[int orderId]() returns http:Ok|http:NotFound|error? {
        log:printInfo("Fetching order details");

        if (!orders.hasKey(orderId.toString())) {
            log:printError("Order not found with order ID: " + orderId.toString());
            http:NotFound errorResponse = {
                body:  "Order not found with order ID: " + orderId.toString()
            };
            return errorResponse;
        }

        Order 'order =  <Order> orders[orderId.toString()];
        log:printInfo("Order details fetched successfully. " + 'order.toString());
        http:Ok response = {
            body:  'order.toJson()
        };
        return response;
    }
}
```

### Enable observability for a Ballerina project
Observability can be enabled in a Ballerina project by adding the following section to the `Ballerina.toml` file. 
```toml
[build-options]
observabilityIncluded=true
```

>**Note:** The above configuration is included by default in the `Ballerina.toml` file generated when initiating a new 
package using the `bal new` command.

Alternatively, we can pass the `--observability-included` flag with the `bal run` command to start a Ballerina program with observability enabled.

### Setting up Ballerina runtime configurations
To enable observability (both metrics and tracing) in the Ballerina runtime, use the following configurations:
```toml
[ballerina.observe]
enabled = true
provider = <PROVIDER>
```

Metrics and tracing can be enabled separately as well by using the following configurations. Add additional configurations specific to the tool or platform you are using.
```toml
[ballerina.observe]
metricsEnabled=true
metricsReporter=<METRICS_REPORTER>
tracingEnabled=true
tracingProvider=<TRACING_PROVIDER>
```

Configuration key | Description | Default value | Possible values 
--- | --- | --- | --- 
ballerina.observe. metricsEnabled | Whether metrics monitoring is enabled (true) or disabled (false) | false | `true` or `false`
ballerina.observe. metricsReporter | Reporter name that reports the collected Metrics to the remote metrics server. This is only required to be modified if a custom reporter is implemented and needs to be used. | `None` | `prometheus`, `newrelic` or if any custom implementation, the name of the reporter.
ballerina.observe.tracingEnabled | Whether tracing is enabled (true) or disabled (false) | false | `true` or `false`
ballerina.observe.tracingProvider | The tracer name, which implements the tracer interface. | `None` | `jaeger`, `zipkin`, `newrelic` or the name of the tracer of any custom implementation.

## Observability tools and platforms supported by Ballerina

This outlines how to enable and configure observability in Ballerina for various tools and platforms. It provides a step-by-step guide for setting up monitoring, tracing, and logging using widely used observability solutions.

Observability tools and platforms help monitor and analyze application performance, identify issues, and ensure reliability. Following are the main observability tools and platforms supported by Ballerina:

- **[Prometheus](https://prometheus.io/):** A monitoring system and time-series database for metrics collection and alerting.

- **[Jaeger](https://www.jaegertracing.io/):** A distributed tracing platform for monitoring and debugging microservices.

- **[Zipkin](https://zipkin.io/):** A distributed tracing system to collect and look up trace data.

- **[New Relic](https://newrelic.com/):** A full-stack observability platform for application performance monitoring (APM) and telemetry.

- **[DataDog](https://www.datadoghq.com/):** A cloud-based observability service offering monitoring, metrics, traces, and logging.

- **[Elastic Stack](https://www.elastic.co/elastic-stack):** A collection of tools (Elasticsearch, Logstash, Kibana) for centralized logging and analytics.

Following contains the guide to set up and observe Ballerina programs in each of the observability tool or platform mentioned above.

- [Observe Ballerina programs with Prometheus](/learn/supported-observability-tools-and-platforms/prometheus)
- [Observe Ballerina programs with Jaeger](/learn/supported-observability-tools-and-platforms/jaeger)
- [Observe Ballerina programs with Zipkin](/learn/supported-observability-tools-and-platforms/zipkin)
- [Observe Ballerina programs with New Relic](/learn/supported-observability-tools-and-platforms/new-relic)
- [Observe Ballerina programs with DataDog](/learn/supported-observability-tools-and-platforms/datadog)
- [Observe Ballerina programs with Elastic Stack](/learn/supported-observability-tools-and-platforms/elastic-stack)
