---
layout: ballerina-asyncapi-support-left-nav-pages-swanlake
title: AsyncAPI tool
description: Check out how the Ballerina AsyncAPI tool makes it easy for you to start developing a service documented in an AsyncAPI contract.
keywords: ballerina, programming language, asyncapi, contract
permalink: /learn/asyncapi-tool/
active: asyncapi-tool
intro: AsyncAPI is a specification, which is used to describe and document message-driven APIs in a machine-readable format for easy development, discovery, and integration. Ballerina Swan Lake supports the AsyncAPI Specification version 2.x.
redirect_from:
  - /learn/ballerina-asyncapi-support
  - /learn/ballerina-asyncapi-support/
  - /learn/asyncapi-tool
---

The Ballerina AsyncAPI tool will make it easy for you to start the development of an event API documented in an AsyncAPI contract in Ballerina by generating a Ballerina service and listener skeletons.

> **Prerequisite:** Install the latest [Ballerina Swan Lake distribution](https://ballerina.io/downloads/).

## Generate Ballerina sources from AsyncAPI contracts

If you prefer the design-first approach, use an AsyncAPI definition to generate Ballerina sources using the AsyncAPI CLI command below.

```bash
bal asyncapi -i <asyncapi-contract>
```

The generated sources can be used as code templates to start the service implementation. For example,

```bash
bal asyncapi -i hello.yaml
```

This generates a Ballerina source (i.e., the four Ballerina files below) from the given AsyncAPI definition file.

1. `data_types.bal` - contains all the Ballerina data types extracted from the AsyncAPI definition
2. `service_types.bal` - contains all the service types relevant to the event API described in the AsyncAPI definition
3. `listener.bal` - contains the HTTP listener, which listens to the relevant third-party service
4. `dispacther_service.bal` - contains the event dispatching logic

The generated Ballerina sources will be written into the same directory from which the command is run. The above command can be run from anywhere on the execution path. It is not mandatory to run it from within a Ballerina package. If you want to generate Ballerina sources to a specific provided output location, you can modify the above command as below.

```bash
bal asyncapi -i hello.yaml -o ./output_path
```

## Example of the usage of the tool

Below is an example of the usage of the AsyncAPI tool based on the [AsyncAPI specification for Slack](https://github.com/ballerina-platform/asyncapi-triggers/blob/main/asyncapi/slack/asyncapi.yml).

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
          title: "The actual event, an object, that happened"
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
              description: Event documentation for app_mention
            payload:
              $ref: "#/components/schemas/GenericEventWrapper"
            summary: Subscribe to only the message events that mention your app or bot
            tags:
              - name: allows_user_tokens
              - name: app_event
            x-scopes-required: []
            x-tokens-allowed:
              - user
```

There are custom tags in this YAML starting with `x-ballerina`. Those tags are being used for the purposes below.

- `x-ballerina-event-identifier` - when the listener receives an event from the event source (Slack is the event source in this scenario), there should be a way to identify the event type. This includes two parts, `type` and `path`. Type can be either `header` or `body`. In other words, the type of the event can be included in the payload either as a header or as an attribute in the body.

  > **Note:** Currently, this tool supports only HTTP-based event APIs. The path is equal to the header name if the type is `header`, or to the JSON path of the attribute if the type is `body`.

- `x-ballerina-event-type` - this should be there in every event inside the channel. This is the name of the event or the value of the above-mentioned attribute for a specific event.

### Generate Ballerina sources

Execute the command below on the above file. This will generate four files as mentioned above.

```bash
bal asyncapi -i slack.yaml
```

### Modify the generated sources

The generated files can be modified according to the custom requirements. When modifying the generated code segments, it will be easier to consider the facts below.

- All the incoming requests will be coming to the resource function in the `dispatcher_service.bal` file. Hence, if there is a necessity to add an authentication logic for the incoming calls, that logic can be included there before processing the incoming HTTP request.
- If more information is needed when initializing the listener like secrets, endpoint URLs, tokens, refresh tokens, etc., update the `init` function in the `listener.bal` file.

### Execute the generated sources

Follow the steps below to use the generated Ballerina sources.

1\. Create an empty folder and copy all the generated files to it.

2\. Execute the command below from the root of the folder. This generates a `Ballerina.toml` file in the root of the folder.

```bash
bal init
```

3\. Create a new Ballerina file inside the folder (e.g., `slack_service.bal`) and paste the code below to it.

```ballerina
listener Listener webhookListener = new(8090);

service AppService on webhookListener {
  remote function onAppMention(GenericEventWrapper event) returns error? {
      //Implement the logic to use the received `event` here.
  }
}
```

4\. Execute the command below from the root of the folder to execute this service.

```bash
bal run
```

Below are some example libraries generated using the tool.

| Module     | AsyncAPI specification                                                                                                                | Generated and modified code                                                                                              | Published module                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Slack**  | <a href="https://github.com/ballerina-platform/asyncapi-triggers/blob/main/asyncapi/slack/asyncapi.yml">`asyncapi.yml` of Slack</a>   | <a href="https://github.com/ballerina-platform/asyncapi-triggers/tree/main/asyncapi/slack">asyncapi-triggers/slack</a>   | <a href="https://central.ballerina.io/ballerinax/trigger.slack">ballerinax/trigger.slack</a>   |
| **GitHub** | <a href="https://github.com/ballerina-platform/asyncapi-triggers/blob/main/asyncapi/github/asyncapi.yml">`asyncapi.yml` of GitHub</a> | <a href="https://github.com/ballerina-platform/asyncapi-triggers/tree/main/asyncapi/github">asyncapi-triggers/github</a> | <a href="https://central.ballerina.io/ballerinax/trigger.github">ballerinax/trigger.github</a> |
