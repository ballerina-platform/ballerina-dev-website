---
layout: ballerina-asyncapi-support-left-nav-pages-swanlake
title: AsyncAPI tool
description: Check out how the Ballerina AsyncAPI tool makes it easy for you to start developing a service documented in an AsyncAPI contract.
keywords: ballerina, programming language, asyncapi, contract
permalink: /learn/asyncapi-tool/
active: asyncapi-tool
intro: AsyncAPI is a specification, which is used to describe and document message-driven APIs in a machine-readable format for easy development, discovery, and integration. Ballerina Swan Lake supports the AsyncAPI Specification version 2.x.
---

The Ballerina AsyncAPI tool makes it easy for you to start the development of an event API documented in an AsyncAPI contract in Ballerina by generating a Ballerina service and listener skeletons.

## Prepare the AsyncAPI contract

Before using the tool, there are some modifications that should be made by adding some custom tags to the contract.

This guide uses only a part of the <a href="https://github.com/ballerina-platform/asyncapi-triggers/blob/main/asyncapi/slack/asyncapi.yml" target="_blank">AsyncAPI specification of Slack</a> for the purpose of simplicity.

```yaml
asyncapi: 2.1.0
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

1\. `x-ballerina-event-identifier` - When the listener receives an event from the event source (Slack is the event source in this scenario), there should be a way to identify the event type. This includes two parts, `type`, and `path`.

- `type` - Type can be either header or body. In other words, the type of event can be included in the payload either as an HTTP header or as an attribute in the body.

  > **Note:** Currently, this tool supports only the body property. Hence, the path is equal to the JSON path of the attribute.

- `path` - Path is equal to the header-name if the type is `header`, or the JSON path of the attribute if the type is `body`.

  > **Note:** Currently, this tool supports only HTTP-based event APIs.

2\. `x-ballerina-event-type` - This should be there in every event inside the channel. This is the name of the event or the value of the attribute mentioned above for a specific event.

## Usage

After modifying the AsyncAPI contract, the Ballerina sources can be generated using the commands below.

```
$ bal asyncapi [-i | --input] <asyncapi-contract-file-path> [-o | --output] <output-location>
```

The generated service can be used as a code template to start the service implementation.
For example,

```
$ bal asyncapi -i hello.yaml
```

## Command options

The below command-line arguments can be used with the command.

| Command option      | Description                                                                                                                                                                                                                                                                                                                                                                     | Mandatory/Optional |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| `-i, --input`  | The `asyncapi-contract-path` command option specifies the path of the AsyncAPI contract file (e.g., `my-api.yaml` or `my-api.json`).                                                                                                                                                                                                                                                                                                                               | Mandatory           |
| `-o, --output`     | The Ballerina files get generated at the same location from which the `bal asyncapi` command is executed. Optionally, you can point to another directory location by using this flag.                                                                                                                                           | Optional           |

This command generates Ballerina service and listener skeletons (i.e., the four Ballerina files below) from the given AsyncAPI definition file.

1. `data_types.bal` - contains all the Ballerina data types extracted from the AsyncAPI definition
2. `service_types.bal` - contains all the service types relevant to the event API described in the AsyncAPI definition
3. `listener.bal` - contains the HTTP listener, which listens to the relevant third-party service
4. `dispacther_service.bal` - contains the event dispatching logic

The generated Ballerina sources are written into the same directory from which the command is run. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina package. 

The above AsyncAPI to Ballerina command supports several usages in the Ballerina AsyncAPI tool as follows.

## Generate to a specified location

If you want to generate Ballerina sources to a specific provided output location, you can modify the above command as below.

```
$ bal asyncapi -i hello.yaml -o ./output_path
```

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

2\. Execute the `bal init` command.

> **Info:** This generates a `Ballerina.toml` file.

3\. Create a new Ballerina file inside the directory (e.g., `slack_service.bal` ) and copy the code below to it.

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
