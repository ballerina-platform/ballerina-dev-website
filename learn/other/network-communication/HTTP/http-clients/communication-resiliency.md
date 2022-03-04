---
layout: ballerina-left-nav-pages-swanlake
title: Communication resiliency
description: The HTTP client supports multiple communication resiliency options out of the box.
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-clients/communication-resiliency/
active: communication-resiliency
intro: The HTTP client supports multiple communication resiliency options out of the box.  
redirect_from:
  - /learn/network-communication/http/http-clients/communication-resiliency
  - /swan-lake/learn/network-communication/http/http-clients/communication-resiliency/
  - /swan-lake/learn/network-communication/http/http-clients/xscommunication-resiliency
  - /learn/network-communication/http/http-clients/communication-resiliency/
  - /learn/network-communication/http/http-clients/communication-resiliency
  - /learn/user-guide/network-communication/http/http-clients/communication-resiliency
  - /learn/network-communication/http/communication-resiliency/
  - /learn/network-communication/http/communication-resiliency
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

These features allow you to handle and recover from unexpected communication scenarios gracefully. 

## Retry

The HTTP client can be configured with a retry configuration using the [`retryConfig`](https://docs.central.ballerina.io/ballerina/http/latest/records/RetryConfig) property in the [HTTP client configuration](https://docs.central.ballerina.io/ballerina/http/latest/records/ClientConfiguration) to retry sending the same request to the endpoint in the case of a failure. This follows an exponential backoff algorithm to execute the retry requests. 

The `retry_demo.bal` below shows an HTTP client configured with a retry configuration. 

>**Info:** In the below code, the client is configured to have three retries in the case of a request failure with an initial 3,000 milliseconds retry interval. This interval is multiplied by two with each retry so that the second and third retries will have 6,000 and 12,000-millisecond intervals respectively. Also, it provides 20,000 milliseconds as the maximum value to which the retry interval will increase. Therefore, in this scenario, the fourth and fifth retry intervals will be restricted to 20,000 milliseconds. 

**retry_demo.bal**
```ballerina
import ballerina/io;
import ballerina/http;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new ("http://httpbin.org", {
       retryConfig: {
           interval: 3,
           count: 5,
           backOffFactor: 2.0,
           maxWaitInterval: 20
       }});
   http:Response resp = check clientEp->get("/get");
   io:println(resp.getTextPayload());
}
```
 
## Circuit breaker

The [Circuit Breaker](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) pattern is used to handle temporary faults when communicating across the network. If a remote endpoint is not available due to a high service load or a network failure, your application may be repeatedly trying to communicate with this service, waiting till it returns a successful result. 

If the requests keep failing continuously and adding more stress to the backend system, it is not a desirable state for your system. Then, you should rather fail-fast and handle the error from the application. This makes sure the caller is not wasting too many resources by waiting for request timeouts etc. Thus, holding back a chain of network calls, which in-turn may hold up resources such as execution threads and network connections. 

### Circuit breaker 'Closed' state

As a solution for this, you can have an intermediary between the service client and the backend service that acts as a circuit breaker. In this manner, when the backend service is healthy, the requests originated from the client go through the circuit breaker and the backend service will successfully return the response to the client through the circuit breaker. This is called the `closed` state in the circuit breaker, which is depicted by the diagram below. 

![Circuit Breaker Closed State](/learn/images/circuit-breaker-closed-state.png)

### Circuit breaker 'Open' state

If the circuit breaker detects that the backend service is repeatedly failing, it can stop forwarding the client requests to the backend service and fail the requests immediately by returning with a specific error message to the client. In this situation, the circuit breaker is in the `open` state, which is depicted by the diagram below. 

![Circuit Breaker Open State](/learn/images/circuit-breaker-open-state.png)

### Circuit breaker 'Half-Open' state

While the circuit breaker is in the `open` state and after a specific timeout since it was in this state, the circuit breaker will allow some requests from the client to be passed to the backend service. This is called the `half-open` state, which is depicted by the diagram below. 

![Circuit Breaker Half-Open State](/learn/images/circuit-breaker-half-open-state.png)

If the requests sent to the backend service are successful in this state, it will go back to the `closed` state, and all the requests will flow again to the backend service. If the requests sent to the backend in the `half-open` state fails, the circuit breaker will again go back to the `open` state.

### Circuit breaker client configuration

The circuit breaker pattern can be used in Ballerina HTTP clients by using its [client configuration](https://docs.central.ballerina.io/ballerina/http/latest/records/CircuitBreakerConfig). This contains the configuration properties below. 

- `rollingWindow`: A rolling window is used to calculate the statistics for backend service errors. 
- `timeWindow`: The size of the rolling time window (in seconds).
- `bucketSize`: The time increment of each rolling window slide. New stats are collected in a bucket of this time duration. This information is added to the current time window at the completion of the bucket time period and the oldest bucket is removed from the window.
- `requestVolumeThreshold`: The minimum number of requests that should be in the rolling window to trip the circuit. 
- `failureThreshold`: The threshold for request failures. If this threshold exceeds, the circuit is tripped. This is calculated as the ratio between the failures and the total requests in the current rolling window of requests. 
- `resetTime`: The time period (in seconds) to wait in the open state before trying again to contact the backend service. 
- `statusCodes`: The HTTP status codes that are considered as request failures. 

The `circuit_breaker_demo.bal` example below shows an HTTP client configured with a circuit breaker. 

**circuit_breaker_demo.bal**

```ballerina
import ballerina/http;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new ("http://httpbin.org", {
           circuitBreaker: {
               rollingWindow: {
                   timeWindow: 10,
                   bucketSize: 2,
                   requestVolumeThreshold: 5
               },
               failureThreshold: 0.2,
               resetTime: 10,
               statusCodes: [400, 404, 500]
           }
       }
   );
   http:Response resp = check clientEp->get("/get");
   io:println(resp.getTextPayload());
}
```

In the above code, the HTTP client is configured with a circuit breaker configuration, which tracks a 10-second rolling window of request statistics and updates its information within 2-second intervals. By including a request volume threshold of 5, any fewer number of requests in the rolling window will not trigger the logic to trip the circuit. 

Otherwise, in the case of 20% requests failure in the rolling window, the circuit will trip and go into the `open` state. Now, the client will immediately return errors until 10 seconds. Then, it will go into a `half-open` state and check again if the backend service is responding with successful responses. If the backend request succeeds, the circuit will go back to the `closed` state and all clients’ requests will be forwarded to the backend service. Or else, it will go back to an `open` state. 

## Load balancing and failover

In the event of load balancing requests to multiple remote endpoints, Ballerina has the [`http:LoadBalanceClient`](https://docs.central.ballerina.io/ballerina/http/latest/clients/LoadBalanceClient) to provide a list of endpoints, and optionally an implementation of the algorithm to select the endpoint to distribute the traffic. The default load balancer rule is to use a round-robin strategy to distribute the load. 

### HTTP client-side load balancing

The `load-balancer_demo.bal` example below shows a scenario of HTTP client-side load balancing. 

**load-balancer_demo.bal**

```ballerina
import ballerina/http;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:LoadBalanceClient clientEp = check new ({
       targets: [{url: "http://httpbin.org"},
                 {url: "http://httpbin.com"},
                 {url: "http://httpbin.io"}]
   });
   http:Response resp = check clientEp->get("/get");
   io:println(resp.getTextPayload());
}
```

In the above code, the three hosts configured using the `targets` property provide the list of base URLs used for the load balancing requests. 

For more detailed configuration options, see the [`http:LoadBalanceClientConfiguration`](https://docs.central.ballerina.io/ballerina/http/latest/clients/LoadBalanceClient).

## Handling failover scenarios

Similarly, Ballerina supports fail-over scenarios using the [`http:FailoverClient`](https://docs.central.ballerina.io/ballerina/http/latest/clients/FailoverClient). In this, a list of target URLs can be provided to attempt requests in a sequence, in which, in the case of failure, it will move on to the next available URL in the list for retrying the request. 

The `fail_over_load-balancer_demo.bal` example below shows this in action. 

**fail_over_load-balancer_demo.bal**

```ballerina
import ballerina/io;
import ballerina/http;
 
public function main() returns @tainted error? {
  http:FailoverClient clientEp = check new ({
      targets: [{url: "http://localhost:8080"},
                {url: "http://httpbin.org"},
                {url: "http://httpbin.com"}]
  });
  http:Response resp = check clientEp->get("/get");
  io:println(resp.getTextPayload());
}
```

For more detailed configuration options of the failover client, see the [`http:FailoverClientConfiguration`](https://docs.central.ballerina.io/ballerina/http/latest/clients/FailoverClient). 

## What's next?

For other use cases of HTTP clients, see the topics below.
- [Multipart Message Handling](/learn/network-communication/http/multipart-message-handling)
- [Data Binding](/learn/network-communication/http/data-binding)
- [Data Streaming](/learn/network-communication/http/data-streaming)
- [Secure Communication](/learn/network-communication/http/secure-communication)
