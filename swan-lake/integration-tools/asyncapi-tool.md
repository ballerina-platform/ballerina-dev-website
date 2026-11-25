---
layout: ballerina-asyncapi-support-left-nav-pages-swanlake
title: AsyncAPI tool
description: Check out how the Ballerina AsyncAPI tool generates webhook listeners and WebSocket clients from AsyncAPI definitions, and AsyncAPI definitions from Ballerina WebSocket services.
keywords: ballerina, programming language, asyncapi, contract, webhook, websocket
permalink: /learn/asyncapi-tool/
active: asyncapi-tool
intro: AsyncAPI is a specification that describes event-driven APIs, their channels and the messages on each, in a machine-readable format. The Ballerina AsyncAPI tool generates webhook listeners and WebSocket clients from AsyncAPI 2.x and 3.x definitions, and AsyncAPI definitions from Ballerina WebSocket services.
---

## Install the tool

The tool requires Ballerina Swan Lake Update 13 (2201.13.0) or later. Execute the command below to pull it from Ballerina Central.

```
$ bal tool pull asyncapi
```

To update an installed tool to the latest version, execute `bal tool update asyncapi`. For more information on tool commands, run `bal tool --help`.

## Usage

```
$ bal asyncapi [OPTIONS] <input>
```

The input decides what the tool generates:

| Input | Output |
|-------|--------|
| A webhook AsyncAPI definition, with `x-ballerina-event-identifier` | A webhook listener that verifies each request and calls a remote function for each event |
| A WebSocket AsyncAPI definition, with a `ws` or `wss` server | A WebSocket client for each channel |
| A Ballerina package directory or a standalone `.bal` file | An AsyncAPI definition of its WebSocket services |

Generated Ballerina code is written into a Ballerina package, so create one with `bal new` first, or pass one with `-o`.

## Generate a webhook listener

### Prepare the AsyncAPI definition

The following definition describes an online store that sends `order_created` and `order_cancelled` events to a webhook. The store signs each request body with HMAC-SHA256, using a secret it shares with you, and sends the signature in the `X-Signature` header.

```yaml
asyncapi: 3.0.0
info:
  title: Order Events
  version: 1.0.0
x-ballerina-event-identifier:
  type: body
  path: type
x-ballerina-auth:
  header: X-Signature
  signature:
    algorithm: sha256
    encoding: hex
    headerFormat: "sha256=${signature}"
    input: "$body"
channels:
  orders:
    address: orders
    messages:
      orderCreated:
        x-ballerina-event-type: order_created
        summary: A customer placed an order.
        payload:
          $ref: "#/components/schemas/OrderEvent"
      orderCancelled:
        x-ballerina-event-type: order_cancelled
        summary: A customer cancelled an order.
        payload:
          $ref: "#/components/schemas/OrderEvent"
operations:
  orders:
    action: receive
    channel:
      $ref: "#/channels/orders"
    messages:
      - $ref: "#/channels/orders/messages/orderCreated"
      - $ref: "#/channels/orders/messages/orderCancelled"
components:
  schemas:
    OrderEvent:
      type: object
      required:
        - type
        - orderId
      properties:
        type:
          type: string
        orderId:
          type: string
        customerId:
          type: string
        total:
          type: number
```

The extensions starting with `x-ballerina` tell the tool how the listener handles each request. Add them to the definition before using the tool.

1\. `x-ballerina-event-identifier` - Where each request carries its event type. This has two parts, `type` and `path`.

- `type` - `body` when the event type is a field of the request body, or `header` when it is an HTTP header.
- `path` - The JSON path of the field if the type is `body`, or the name of the header if the type is `header`.

2\. `x-ballerina-event-type` - This should be there in every message. It is the value the event type has for that message.

3\. `x-ballerina-auth` (optional) - How the listener checks that a request comes from the event source. The listener rejects every request that fails the check with `401`. For every scheme it supports, see the <a href="https://github.com/ballerina-platform/asyncapi-tools/blob/main/docs/webhook-dsl-reference.md" target="_blank">webhook signature reference</a>.

4\. `x-ballerina-event-label` (optional) - The name of the remote function, when the event type isn't a readable name. For example, `AccountMerged` names the function `onAccountMerged`.

### Generate the listener

```
$ bal new order_listener
$ cd order_listener
$ bal asyncapi ../order-events.yaml
```

This generates the following files.

1. `types.bal` - contains the Ballerina data types of the event payloads and the listener configuration
2. `service_types.bal` - contains a service type for each channel, with a remote function for each event
3. `listener.bal` - contains the HTTP listener that receives the events
4. `dispatcher_service.bal` - contains the logic that verifies each request and calls the remote function of its event
5. `lib/asyncapi-trigger-compiler-plugin.jar` and `CompilerPlugin.toml` - a compiler plugin that lists the listener's endpoints when the package is built with `bal build --export-endpoints`

If a file already exists with different content, the tool asks before replacing it. Add `--force` to replace files without asking, or `--dry-run` to list what it would write.

### Use the listener

1\. Replace the content of `main.bal` with the code below.

```ballerina
import ballerina/log;

configurable string webhookSecret = ?;

listener Listener orderListener = new ({webhookSecret}, 8090);

service OrdersService on orderListener {
    remote function onOrderCreated(OrderEvent event) returns error? {
        log:printInfo("Order created", orderId = event.orderId, total = event.total);
    }

    remote function onOrderCancelled(OrderEvent event) returns error? {
        log:printInfo("Order cancelled", orderId = event.orderId);
    }
}
```

2\. Create a `Config.toml` file with the shared secret.

```toml
webhookSecret = "my-shared-secret"
```

3\. Execute the `bal run` command.

4\. Send a signed test event.

```
$ BODY='{"type": "order_created", "orderId": "A-1001", "total": 59.90}'
$ SIGNATURE=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "my-shared-secret" | sed 's/^.* //')
$ curl -X POST http://localhost:8090 -H "Content-Type: application/json" -H "X-Signature: sha256=$SIGNATURE" -d "$BODY"
```

The listener calls `onOrderCreated`, which logs the order. A request with a wrong signature, or none, gets `401`.

To generate tests that send a signed sample of each event to the listener, add `--with-tests`. Each test reads its payload from `tests/resources/trigger_payloads/<event type>.json`.

Below are some triggers generated using the tool.

| Trigger | AsyncAPI definition | Published package |
|---------|---------------------|-------------------|
| **GitHub** | <a href="https://github.com/ballerina-platform/module-ballerinax-github.trigger/blob/main/docs/spec/asyncapi.yml" target="_blank">`asyncapi.yml`</a> | <a href="https://central.ballerina.io/ballerinax/github.trigger" target="_blank">`ballerinax/github.trigger`</a> |
| **Slack** | <a href="https://github.com/ballerina-platform/module-ballerinax-slack.trigger/blob/main/docs/spec/asyncapi.yaml" target="_blank">`asyncapi.yaml`</a> | <a href="https://central.ballerina.io/ballerinax/slack.trigger" target="_blank">`ballerinax/slack.trigger`</a> |
| **Twilio** | <a href="https://github.com/ballerina-platform/module-ballerinax-twilio.trigger/blob/main/docs/spec/asyncapi.yaml" target="_blank">`asyncapi.yaml`</a> | <a href="https://central.ballerina.io/ballerinax/twilio.trigger" target="_blank">`ballerinax/twilio.trigger`</a> |

## Generate a WebSocket client

### Prepare the AsyncAPI definition

The following definition describes an order service. The client sends `PlaceOrder` and gets `OrderAccepted` or `OrderRejected` back, and the server also sends `PriceUpdate` messages.

```yaml
asyncapi: 3.0.0
info:
  title: Orders
  version: 1.0.0
servers:
  production:
    host: orders.example.com
    protocol: wss
x-dispatcherKey: type
channels:
  orders:
    address: /orders
    messages:
      PlaceOrder:
        $ref: "#/components/messages/PlaceOrder"
      OrderAccepted:
        $ref: "#/components/messages/OrderAccepted"
      OrderRejected:
        $ref: "#/components/messages/OrderRejected"
      PriceUpdate:
        $ref: "#/components/messages/PriceUpdate"
operations:
  placeOrder:
    action: send
    channel:
      $ref: "#/channels/orders"
    messages:
      - $ref: "#/channels/orders/messages/PlaceOrder"
    reply:
      channel:
        $ref: "#/channels/orders"
      messages:
        - $ref: "#/channels/orders/messages/OrderAccepted"
        - $ref: "#/channels/orders/messages/OrderRejected"
  onPriceUpdate:
    action: receive
    channel:
      $ref: "#/channels/orders"
    messages:
      - $ref: "#/channels/orders/messages/PriceUpdate"
components:
  messages:
    PlaceOrder:
      payload:
        type: object
        required: [type, item]
        properties:
          type: {type: string, const: place_order}
          item: {type: string}
    OrderAccepted:
      payload:
        type: object
        required: [type, orderId]
        properties:
          type: {type: string, const: order_accepted}
          orderId: {type: string}
    OrderRejected:
      payload:
        type: object
        required: [type, reason]
        properties:
          type: {type: string, const: order_rejected}
          reason: {type: string}
    PriceUpdate:
      payload:
        type: object
        required: [type, price]
        properties:
          type: {type: string, const: price_update}
          price: {type: number}
```

All messages share one connection, so the client tells the ones it receives apart by a field with a different fixed value in each, named by `x-dispatcherKey`. Without `x-dispatcherKey`, the tool works the field out when it can, and says so in a warning.

### Generate the client

```
$ bal new orders_app
$ cd orders_app
$ bal asyncapi ../orders.yaml
```

This generates the following files.

1. `client.bal` - contains a client for each channel, named after the definition's title and the channel, such as `OrdersOrdersClient`
2. `types.bal` - contains the Ballerina data types of the messages
3. `utils.bal` - contains the helpers the client uses to route the messages it receives

A message the client sends gets a function that sends it, and returns the reply when the operation has one. A message the client receives outside a reply gets a function that waits for the next one. The last argument of each function is the time, in seconds, to wait.

### Use the client

```ballerina
import ballerina/io;

public function main() returns error? {
    OrdersOrdersClient orders = check new;

    OrderAccepted|OrderRejected result = check orders->doPlaceOrder({'type: "place_order", item: "apple"}, 5);
    if result is OrderAccepted {
        io:println("Order placed: ", result.orderId);
    } else if result is OrderRejected {
        io:println("Order rejected: ", result.reason);
    }

    PriceUpdate update = check orders->doPriceUpdate(30);
    io:println("Price: ", update.price);
    check orders->connectionClose();
}
```

To connect to another server, such as one running locally, pass its URL, for example `check new (serviceUrl = "ws://localhost:9090")`.

### Supported definitions

The tool generates a client for JSON messages told apart by a field, a connection that receives one kind of message, requests with replies, several channels and their parameters, and the common security schemes. It leaves out a message without a JSON Schema payload, with its payload in another file, or with binary content, with a warning. It stops when the messages a connection receives can't be told apart, or when the server uses another protocol, such as MQTT or Socket.IO.

Every warning and error names the place in the definition and the change that fixes it. For each case, with an example of the fix, see <a href="https://github.com/ballerina-platform/asyncapi-tools/blob/main/docs/websocket-spec-support.md" target="_blank">Which WebSocket specs the tool generates a client for</a>.

## Generate an AsyncAPI definition from a WebSocket service

The tool generates an AsyncAPI 3.0 definition of the WebSocket services in a package or a `.bal` file. Each service needs a `dispatcherKey` in its `@websocket:ServiceConfig` annotation.

```
$ bal asyncapi service.bal
```

This writes the definition to a file named after the base path of the service, such as `chat_asyncapi.yaml`. To export one service, add `--service /chat`. To write JSON, add `--spec-format json`.

## Command options

| Command option | Description |
|----------------|-------------|
| `-o, --output <dir>` | The directory to write the files to. Defaults to the current directory. |
| `--protocol <http\|ws>` | The protocol to generate for. Defaults to the one the definition shows. |
| `--force` | Replaces existing files without asking. |
| `-n, --dry-run` | Lists the files the tool would write, without writing anything. |
| `--module <name>` | Generates code into, or reads services from, this module of the package. |
| `--license <file>` | Adds the license header in this file to the generated `.bal` files. |
| `--with-tests` | Generates tests along with the code. |
| `--spec-side <client\|service>` | Reads a WebSocket definition as written from the client's or the server's side. Defaults to `client`. |
| `--service <path>` | Generates the definition of this service only. |
| `--spec-format <yaml\|json>` | The format of the generated definition. Defaults to `yaml`. |
| `--output-format <text\|json>` | Prints the results, warnings and errors as text or as JSON lines. |
| `-V, --version` | Prints the tool's version. |

For every option and example, see the <a href="https://central.ballerina.io/ballerina/tool.asyncapi" target="_blank">tool's page on Ballerina Central</a>.
