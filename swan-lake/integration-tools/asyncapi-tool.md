---
layout: ballerina-asyncapi-support-left-nav-pages-swanlake
title: AsyncAPI tool
description: Check out how the Ballerina AsyncAPI tool makes it easy for you to start developing a service documented in an AsyncAPI contract.
keywords: ballerina, programming language, asyncapi, contract
permalink: /learn/asyncapi-tool/
active: asyncapi-tool
intro: AsyncAPI is a specification, which is used to describe and document message-driven APIs in a machine-readable format for easy development, discovery, and integration. Ballerina Swan Lake supports AsyncAPI Specification versions 2.0.0–2.6.0 and 3.0.0, and works across two protocols, HTTP webhooks and WebSockets.
---

The Ballerina AsyncAPI tool makes it easy for you to start the development of an event API documented in an AsyncAPI contract in Ballerina by generating a Ballerina service and listener skeletons.

## Overview

The tool is accessed via `bal asyncapi` and requires one of two subcommands:

| Subcommand | Protocol | Directions supported |
|---|---|---|
| `bal asyncapi http` | HTTP / Webhooks | Spec → Ballerina only |
| `bal asyncapi ws` | WebSockets | Spec → Ballerina and Ballerina → Spec |

- Use `bal asyncapi <http|ws> --help` to view usage information.

---

## HTTP Generation

### Prepare the AsyncAPI contract

Before using the tool, there are some modifications that should be made by adding some custom tags to the contract.

This guide uses only a part of the <a href="https://github.com/ballerina-platform/asyncapi-triggers/blob/main/asyncapi/slack/asyncapi.yml" target="_blank">AsyncAPI specification of Slack</a> for the purpose of simplicity.

```yaml
asyncapi: 2.1.0
info:
  title: Events API
  version: 1.0.0
x-ballerina-event-identifier:
  type: "body"
  path: "event.type"
components:
  schemas:
    GenericEventWrapper:
      additionalProperties: true
      description: Adapted from auto-generated content
      properties:
        event:
          additionalProperties: true
          properties:
            event_ts:
              title: When the event was dispatched
              type: string
            type:
              title: The specific name of the event
              type: string
            text:
              title: The message content
              type: string
          required:
            - type
            - event_ts
          title: "The actual event, an object, which happened"
          type: object
      required:
        - event
      title: Standard event wrapper for the Events API
      type: object
channels:
  app:
    subscribe:
      message:
        oneOf:
          - x-ballerina-event-type: "app_mention"
            externalDocs:
              description: Event documentation for `app_mention`
            payload:
              $ref: "#/components/schemas/GenericEventWrapper"
            summary: Subscribe to only the message events that mention your app or bot
            tags:
              - name: allows_user_tokens
              - name: app_event
            x-scopes-required: []
            x-tokens-allowed:
              - user
          - x-ballerina-event-type: "app_rate_limited"
            externalDocs:
              description: Event documentation for `app_rate_limited`
            payload:
              $ref: "#/components/schemas/GenericEventWrapper"
            summary: Indicates that your app's event subscriptions are being rate limited
            tags:
              - name: allows_user_tokens
              - name: app_event
              - name: allows_workspace_tokens
            x-scopes-required: []
            x-tokens-allowed:
              - user
              - workspace
```

There are custom tags in this YAML starting with `x-ballerina`. It is very important that these tags must be added to the AsyncAPI contract before using the tool. The usage of those tags are as follows.

1\. `x-ballerina-event-identifier` - When the listener receives an event from the event source (Slack is the event source in this scenario), there should be a way to identify the event type. This includes two parts, `type`, and either `name` or `path` depending on the type.

- `type` - Type can be `"header"`, `"body"`, or `"composite"`. In other words, the event type can be identified from an HTTP header, an attribute in the request body, or both.

- `name` - Required when `type` is `"header"` or `"composite"`. This is the HTTP header name that carries the event type value.

- `path` - Required when `type` is `"body"` or `"composite"`. This is the dot-notation JSON path of the attribute in the request body (e.g., `"event.type"`).


  **Example — event type in the request body:**
```yaml
  x-ballerina-event-identifier:
    type: "body"
    path: "event.type"
```

  **Example — event type in a request header:**
```yaml
  x-ballerina-event-identifier:
    type: "header"
    name: "X-Event-Type"
```

  **Example — composite (type in both header and body):**
```yaml
  x-ballerina-event-identifier:
    type: "composite"
    name: "X-Event-Type"
    path: "event.type"
```

2\. `x-ballerina-event-type` - This should be there in every event inside the channel. This is the name of the event or the value of the attribute mentioned above for a specific event.

3\. `x-ballerina-auth` - When present, this document-level tag enables webhook signature verification. 

- `header` - The HTTP header name that carries the webhook signature.

  **Example:**
```yaml
  x-ballerina-auth:
    header: "X-Webhook-Signature"
```

  > **Note:** This tag is optional. When absent, no auth code is generated.

## Usage

After modifying the AsyncAPI contract, the Ballerina sources can be generated using the commands below.

```
$ bal asyncapi http [-i | --input] <asyncapi-contract-file-path> [-o | --output] <output-location>
```

The generated service can be used as a code template to start the service implementation.
For example,

```
$ bal asyncapi http -i hello.yaml
```

## Command options

The below command-line arguments can be used with the command.

| Command option | Description | Mandatory/Optional |
|---|---|---|
| `-i, --input` | The `asyncapi-contract-path` command option specifies the path of the AsyncAPI contract file (e.g., `my-api.yaml` or `my-api.json`). | Mandatory |
| `-o, --output` | The Ballerina files get generated at the same location from which the `bal asyncapi http` command is executed. Optionally, you can point to another directory location by using this flag. Must be inside a Ballerina package. | Optional |
| `--module` | Specifies the target module name. The generated files are written to `modules/<name>/` inside the package. Only alphanumeric characters and underscores are allowed, with a maximum of 256 characters. | Optional |
| `--license` | Specifies the path to a license header file. The content is prepended to every generated `.bal` file. If the file is unreadable, a warning is printed and generation continues without it. | Optional |
| `-h, --help` | Prints the help text for the command and exits. | Optional |

This command generates Ballerina service and listener skeletons (i.e., the four Ballerina files below) from the given AsyncAPI definition file.

1. `types.bal` - contains all the Ballerina data types extracted from the AsyncAPI definition
2. `service_types.bal` - contains all the service types relevant to the event API described in the AsyncAPI definition
3. `listener.bal` - contains the HTTP listener, which listens to the relevant third-party service
4. `dispacther_service.bal` - contains the event dispatching logic

The generated Ballerina sources are written into the same directory from which the command is run. The above command can be run from anywhere on the execution path. It is mandatory to run it from within a Ballerina package. 

Then, the generated files can be modified according to the custom requirements. When modifying the generated code segments, it is easier to consider the below facts.

- All the incoming requests are received by the resource method in the `dispatcher_service.bal` file. Hence, if there is a necessity to add an authentication logic for the incoming calls, that logic can be included there before processing the incoming HTTP request.
- If more information is needed when initializing the listener such as secrets, endpoint URLs, tokens, refresh tokens, etc., update the `init` function in the `listener.bal` file.

Below are some example libraries generated using the tool.

| Module     | AsyncAPI specification                                                                                                                | Generated and modified code                                                                                                | Published module                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Slack**  | <a href="https://github.com/ballerina-platform/asyncapi-triggers/blob/main/asyncapi/slack/asyncapi.yml" target="_blank">`asyncapi.yml` of Slack</a>   | <a href="https://github.com/ballerina-platform/asyncapi-triggers/tree/main/asyncapi/slack" target="_blank">`asyncapi-triggers/slack`</a>   | <a href="https://central.ballerina.io/ballerinax/trigger.slack" target="_blank">`ballerinax/trigger.slack`</a>   |
| **Twilio** | <a href="https://github.com/ballerina-platform/asyncapi-triggers/blob/main/asyncapi/twilio/asyncapi.yml" target="_blank">`asyncapi.yml` of Twilio</a> | <a href="https://github.com/ballerina-platform/asyncapi-triggers/tree/main/asyncapi/twilio" target="_blank">`asyncapi-triggers/twilio`</a> | <a href="https://central.ballerina.io/ballerinax/trigger.twilio" target="_blank">`ballerinax/trigger.twilio`</a> |

## Example

Follow the steps below to execute the generated Ballerina sources.

1\. Navigate to the directory in which the generated files exist.

2\. Create a new Ballerina file inside the directory (e.g., `slack_service.bal` ) and copy the code below to it.

```ballerina
listener Listener webhookListener = new (8090);

service AppService on webhookListener {
    remote function onAppMention(GenericEventWrapper event) returns error? {
        //Implement the logic to use the received `event` here.
    }

    remote function onAppRateLimited(GenericEventWrapper event) returns error? {
        //Implement the logic to use the received `event` here.
    }
}
```

4\. Execute the `bal run` command to execute this.

## WS Generation

### Prepare the AsyncAPI contract

Before using the tool, there are some modifications that should be made by adding some custom tags to the contract.

This guide uses a simple chat service contract for the purpose of simplicity.

```yaml
asyncapi: 3.0.0

info:
  title: Chat Service
  version: 1.0.0

x-dispatcherKey: "type"
x-dispatcherStreamId: "requestId"

servers:
  development:
    host: localhost:8080
    protocol: ws

channels:
  root:
    address: /
    messages:
      ChatMessage:
        $ref: "#/components/messages/ChatMessage"

components:
  messages:
    ChatMessage:
      payload:
        type: object
        properties:
          type:
            type: string
          requestId:
            type: string
          text:
            type: string
```

There are custom tags in this YAML starting with `x-`. It is very important that these tags must be added to the AsyncAPI contract before using the tool. The usage of those tags are as follows.

1\. `x-dispatcherKey` - This document-level tag is mandatory. It names the field in every incoming message payload that identifies which remote function should handle the message.

  **Example:**
```yaml
  x-dispatcherKey: "type"
```

2\. `x-dispatcherStreamId` - This document-level tag is optional. It names the field used as a stream or request ID for bidirectional streaming. When present, the tool generates the `MessageWithId` type and includes the stream ID in relevant function signatures.

  **Example:**
```yaml
  x-dispatcherStreamId: "requestId"
```

3\. `x-response` - This message-level tag defines the response message(s) for a request. Only `$ref`-based items are supported. Inline payload definitions are not supported.

  **Example — single response:**
```yaml
  x-response:
    $ref: "#/components/messages/ChatResponse"
```

  **Example — multiple response types:**
```yaml
  x-response:
    oneOf:
      - $ref: "#/components/messages/ChatResponse"
      - $ref: "#/components/messages/ErrorResponse"
```

4\. `x-response-type` - This message-level tag is required when `x-response` uses `oneOf`. It defines the RPC pattern for the response.

- `"simple-rpc"` - one response per request.
- `"server-streaming"` - a stream of responses.

  **Example:**
```yaml
  x-response-type: "simple-rpc"
```

5\. `x-close-frame` - This schema-level tag marks a schema as a WebSocket close-frame schema. Schemas with this tag are excluded from `types.bal` type generation entirely.

  **Example:**
```yaml
  components:
    schemas:
      CloseFrame:
        x-close-frame: true
        type: object
        properties:
          code:
            type: integer
```

> **Note:** The spec must define exactly one channel.

## Usage

After modifying the AsyncAPI contract, the Ballerina sources can be generated using the commands below.

```
$ bal asyncapi ws [-i | --input] <asyncapi-contract-file-path> [-o | --output] <output-location>
```

The generated client can be used as a code template to start the client implementation.
For example,

```
$ bal asyncapi ws -i chat_service.yaml
```

## Command options

The below command-line arguments can be used with the command.

| Command option | Description | Mandatory/Optional |
|---|---|---|
| `-i, --input` | The `asyncapi-contract-path` command option specifies the path of the AsyncAPI contract file (e.g., `my-api.yaml` or `my-api.json`). For Ballerina-to-spec direction, a `.bal` file path can be provided instead. | Mandatory |
| `-o, --output` | The Ballerina files get generated at the same location from which the `bal asyncapi ws` command is executed. Optionally, you can point to another directory location by using this flag. Must be inside a Ballerina package for spec-to-code direction. | Optional |
| `--module` | Specifies the target module name. The generated files are written to `modules/<name>/` inside the package. Only alphanumeric characters and underscores are allowed, with a maximum of 256 characters. | Optional |
| `--license` | Specifies the path to a license header file. The content is prepended to every generated `.bal` file. If the file is unreadable, a warning is printed and generation continues without it. | Optional |
| `--with-tests` | Generates `tests/test.bal` and `tests/Config.toml` alongside the client as a test skeleton. | Optional |
| `--json` | Applicable in Ballerina-to-spec direction only. Emits the generated AsyncAPI output as JSON instead of YAML. | Optional |
| `--service` | Applicable in Ballerina-to-spec direction only. Generates a spec for only the named service when the input file contains multiple services. | Optional |
| `-h, --help` | Prints the help text for the command and exits. | Optional |

This command generates a Ballerina WebSocket client (i.e., the files below) from the given AsyncAPI definition file.

1. `client.bal` - contains the WebSocket client class named after `info.title` and the channel name from the spec
2. `types.bal` - contains all the Ballerina data types extracted from the AsyncAPI definition. Always includes the `Message` type, and the `MessageWithId` type when `x-dispatcherStreamId` is set
3. `utils.bal` - contains utility functions for streaming operations (generated only when at least one server-streaming operation exists)
4. `tests/test.bal` - contains a test skeleton for the generated client (generated only when `--with-tests` is set)

The generated Ballerina sources are written into the same directory from which the command is run. It is mandatory to run it from within a Ballerina package.

Then, the generated files can be modified according to the custom requirements. When modifying the generated code segments, it is easier to consider the below facts.

- The `client.bal` file is the main entry point. Add any custom connection handling, retry logic, or pre-processing of messages here.

