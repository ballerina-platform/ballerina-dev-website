---
layout: ballerina-expose-and-consume-mcp-servers-left-nav-pages-swanlake
title: Expose and consume MCP servers
description: Learn how to build Model Context Protocol (MCP) servers in Ballerina, manage sessions, bind HTTP request information, secure them, and consume MCP tools from clients and agents.
keywords: ballerina, AI, MCP, Model Context Protocol, MCP server, MCP client, agent tools
permalink: /learn/expose-and-consume-mcp-servers/
active: expose-and-consume-mcp-servers
intro: This guide explains how to expose Ballerina integrations as MCP servers and how to consume tools from MCP servers in clients and agents.
---

## Understand MCP

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is a standard for connecting AI applications to external data sources, tools, and workflows. An MCP server exposes tools that AI assistants (e.g., Claude Desktop, GitHub Copilot) and agents can discover and call; an MCP client connects to servers to use their tools.

The [`ballerina/mcp`](https://central.ballerina.io/ballerina/mcp/latest) module provides both sides over the Streamable HTTP transport, and the [`ballerina/ai`](https://central.ballerina.io/ballerina/ai/latest) module's `ai:McpToolKit` lets agents use MCP tools.

## Expose tools as an MCP server

Attach a service to an `mcp:StreamableHttpListener`. With the `mcp:StreamableHttpService` type, every `remote` method becomes an MCP tool: the tool description and input schema are generated from the method signature and its documentation comment, and the listener handles the `tools/list` and `tools/call` requests.

```ballerina
import ballerina/mcp;

type Weather record {|
    string location;
    decimal temperature;
    string condition;
|};

type ForecastItem record {|
    string date;
    int high;
    int low;
    string condition;
|};

listener mcp:StreamableHttpListener mcpListener = new (9090);

service mcp:StreamableHttpService /mcp on mcpListener {

    # Get current weather for a city.
    #
    # + city - City name (e.g., "New York", "Tokyo")
    # + return - Current weather data for the specified city
    remote function getCurrentWeather(string city) returns Weather|error {
        return {location: city, temperature: 27.0, condition: "Sunny"};
    }

    # Get the weather forecast for the upcoming days.
    #
    # + city - City name (e.g., "London", "Tokyo")
    # + days - Number of days to forecast (1 - 7)
    # + return - One forecast entry per day
    remote function getWeatherForecast(string city, int days) returns ForecastItem[]|error {
        return from int i in 1 ... days
            select {date: string `2026-10-0${i}`, high: 30, low: 22, condition: "Cloudy"};
    }

    # Get the air quality index for a city.
    #
    # + city - City name
    # + return - The air quality index (0 - 500)
    remote function getAirQualityIndex(string city) returns int|error {
        return 42;
    }
}
```

Each remote method becomes one MCP tool: `getCurrentWeather`, `getWeatherForecast`, and `getAirQualityIndex`. The parameter names, types, and the documentation comments become the tool's input schema and description, so document the parameters carefully; that text is what the AI client uses to decide when and how to call the tool.

> **Note:** `mcp:Listener` is deprecated in favor of `mcp:StreamableHttpListener`, which makes the transport explicit.

For full control over tool listing and invocation, declare the service with the `mcp:StreamableHttpAdvancedService` type and implement the `onListTools` and `onCallTool` remote methods. `onListTools` returns the tool definitions with their input schemas, and `onCallTool` receives the tool name and arguments and dispatches the call yourself. This is useful when the tools are defined dynamically or when the input schema must be hand-written.

```ballerina
service mcp:StreamableHttpAdvancedService /mcp on mcpListener {

    isolated remote function onListTools() returns mcp:ListToolsResult|mcp:ServerError => {
        tools: [
            {
                name: "getCurrentWeather",
                description: "Get current weather conditions for a location",
                inputSchema: {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "City name"}
                    },
                    "required": ["city"]
                }
            }
        ]
    };

    isolated remote function onCallTool(mcp:CallToolParams params, mcp:Session? session)
            returns mcp:CallToolResult|mcp:ServerError {
        if params.name == "getCurrentWeather" {
            record {|string city;|}|error arguments = params.arguments.cloneWithType();
            if arguments is error {
                return error("Invalid arguments", arguments);
            }
            Weather weather = {location: arguments.city, temperature: 27.0, condition: "Sunny"};
            return {content: [{'type: "text", text: weather.toJsonString()}]};
        }
        return error("Unknown tool: " + params.name);
    }
}
```

See the [MCP service](/learn/by-example/mcp-service/) and [MCP advanced service](/learn/by-example/mcp-service-advanced/) examples.

## Bind HTTP request information in tools

Declaring the service with the `mcp:StreamableHttpService` type allows tool methods to bind information from the underlying HTTP request in addition to the tool arguments: an `http:Headers` parameter, an `http:Request` parameter, or `@http:Header` annotated parameters. These parameters are excluded from the tool's input schema, so they are populated from the request rather than provided by the AI client. This is useful for tenant identifiers, correlation IDs, and authorization headers set by a gateway.

```ballerina
import ballerina/http;

service mcp:StreamableHttpService /mcp on new mcp:StreamableHttpListener(9092) {

    # Get the orders of the tenant making the request.
    #
    # + headers - The HTTP headers of the incoming request
    # + status - The order status to filter by
    # + return - The matching orders
    remote function getOrders(http:Headers headers, string? status = ()) returns Order[]|error {
        string tenantId = check headers.getHeader("x-tenant-id");
        // ...
    }

    # Get an order by ID for the tenant making the request.
    #
    # + orderId - The order ID
    # + tenantId - The tenant ID, bound from the `x-tenant-id` HTTP header
    # + return - The order details
    remote function getOrder(string orderId, @http:Header {name: "x-tenant-id"} string tenantId)
            returns Order|error {
        // ...
    }
}
```

See the [MCP tools with HTTP request binding](/learn/by-example/mcp-service-http-request-binding/) example.

## Read request metadata in tools

An MCP request can carry a `_meta` field alongside the tool arguments, for values that the caller determines and the LLM must not choose, such as the tenant of the request. A tool of an `mcp:StreamableHttpService` reads it by declaring an `mcp:Meta?` parameter, which the runtime injects and excludes from the tool input schema. The parameter must be nilable, since it is nil when the request carries no metadata. `mcp:Meta` is an open record, so the fields that the client sent are read through member access. In the snippet below, `mcpListener` is an `mcp:StreamableHttpListener`, and `tickets` is a list of `Ticket` records.

```ballerina
service mcp:StreamableHttpService /mcp on mcpListener {

    # Gets the open support tickets of the calling tenant.
    #
    # + meta - The request metadata attached by the client
    # + return - The open tickets of the tenant, or an error if the tenant is not specified
    remote function getOpenTickets(mcp:Meta? meta) returns Ticket[]|error {
        anydata tenantId = meta is mcp:Meta ? meta["tenantId"] : ();
        if tenantId !is string {
            return error("The 'tenantId' metadata is missing from the request");
        }
        return from Ticket ticket in tickets
            where ticket.tenantId == tenantId
            select ticket;
    }
}
```

A client sends the metadata in the `_meta` field of `mcp:CallToolParams`. The `onCallTool` method of an `mcp:StreamableHttpAdvancedService` does not accept an `mcp:Meta?` parameter, and reads the metadata from the `_meta` field of the `mcp:CallToolParams` value instead. See the [MCP service with request metadata](/learn/by-example/mcp-service-with-request-metadata/) and [MCP client with request metadata](/learn/by-example/mcp-client-with-request-metadata/) examples.

## Secure the MCP server

Since the Streamable HTTP transport is built on HTTP, an MCP service is secured like an `http:Service`. Configure TLS on the listener with `secureSocket`, and configure authentication and authorization via the `auth` field of `httpConfig` in the `@mcp:StreamableHttpServiceConfig` annotation. JWT, OAuth2 introspection, and basic authentication with a file or LDAP user store are supported.

```ballerina
listener mcp:StreamableHttpListener securedListener = new (9093,
    secureSocket = {
        key: {
            certFile: "../resource/path/to/public.crt",
            keyFile: "../resource/path/to/private.key"
        }
    }
);

@mcp:StreamableHttpServiceConfig {
    info: {name: "Payroll MCP Server", version: "1.0.0"},
    httpConfig: {
        auth: [
            {
                jwtValidatorConfig: {
                    issuer: "wso2",
                    audience: "ballerina",
                    signatureConfig: {
                        certFile: "../resource/path/to/public.crt"
                    },
                    scopeKey: "scp"
                },
                scopes: ["admin"]
            }
        ]
    }
}
service mcp:StreamableHttpService /mcp on securedListener {
    // ...
}
```

See the [MCP service security](/learn/by-example/mcp-service-security/) example.

## Consume MCP tools from a client

The `mcp:StreamableHttpClient` client connects to an MCP server, discovers its tools, and calls them.

```ballerina
mcp:StreamableHttpClient mcpClient = check new ("http://localhost:9090/mcp");
check mcpClient->initialize({name: "Weather MCP Client", version: "1.0.0"});

mcp:ListToolsResult toolsResult = check mcpClient->listTools();
mcp:CallToolResult result = check mcpClient->callTool({
    name: "getCurrentWeather",
    arguments: {"city": "Colombo"}
});
check mcpClient->close();
```

Pass `auth` (e.g., `auth = {token: "<jwt>"}` for a bearer token) and other `http:ClientConfiguration` fields to the client constructor for secured servers, and pass headers to `callTool` when tools bind HTTP headers. See the [MCP client](/learn/by-example/mcp-client/) example.

## Consume MCP tools from an agent

Add an `ai:McpToolKit` to the tools of an agent. The tool kit connects to the MCP server, discovers its tools, and makes them available to the agent like any other tool.

To use all the tools exposed by the server, pass only the server URL.

```ballerina
import ballerina/ai;

final ai:McpToolKit weatherTools = check new ("http://localhost:9090/mcp");

final ai:Agent weatherAgent = check new ({
    systemPrompt: {
        role: "Weather-aware AI Assistant",
        instructions: "You assist users based on accurate and timely weather information."
    },
    tools: [weatherTools],
    model: check ai:getDefaultModelProvider()
});
```

To restrict the agent to specific tools of the server, pass the names of the permitted tools as the second argument. The agent then sees only those tools.

```ballerina
final ai:McpToolKit currentWeatherOnly = check new ("http://localhost:9090/mcp",
        ["getCurrentWeather", "getAirQualityIndex"]);

final ai:Agent currentWeatherAgent = check new ({
    systemPrompt: {
        role: "Weather-aware AI Assistant",
        instructions: "You answer questions about the current weather and air quality."
    },
    tools: [currentWeatherOnly],
    model: check ai:getDefaultModelProvider()
});
```

See the [Agent with MCP integration](/learn/by-example/ai-agent-mcp-integration/) example.

## Define a custom MCP tool kit

The `ai:McpToolKit` tool kit forwards each call to the server as it is. For more control over how the agent uses the server, define a custom MCP tool kit: a class that includes the `ai:McpBaseToolKit` type and holds an `mcp:StreamableHttpClient` client. In the `init` method, `ai:getPermittedMcpToolConfigs` initializes the MCP session, lists the tools of the server, and creates the tool configurations of the permitted tools, each mapped to a method of the class that dispatches the call. A dispatch method receives the tool name and the arguments chosen by the LLM as an `mcp:CallToolParams` value, and can also declare an `ai:Context` parameter as its first parameter.

```ballerina
isolated class WeatherToolKit {
    *ai:McpBaseToolKit;
    private final mcp:StreamableHttpClient mcpClient;
    private final readonly & ai:ToolConfig[] tools;

    public isolated function init(string serverUrl,
            mcp:Implementation info = {name: "Weather Assistant", version: "1.0.0"},
            *mcp:StreamableHttpClientTransportConfig config) returns ai:Error? {
        final map<ai:FunctionTool> permittedTools = {
            "getCurrentWeather": self.getCurrentWeather
        };
        do {
            self.mcpClient = check new (serverUrl, config);
            self.tools = check ai:getPermittedMcpToolConfigs(self.mcpClient, info, permittedTools)
                .cloneReadOnly();
        } on fail error e {
            return error("Failed to initialize the MCP toolkit", e);
        }
    }

    public isolated function getTools() returns ai:ToolConfig[] => self.tools;

    @ai:AgentTool
    public isolated function getCurrentWeather(mcp:CallToolParams params)
            returns mcp:CallToolResult|error {
        return self.mcpClient->callTool(params);
    }
}
```

See the [Agent with advanced MCP integration](/learn/by-example/ai-agent-mcp-integration-advanced/) example, which changes the arguments of a call before forwarding it, and the [Passing context to MCP tools](/learn/by-example/ai-agent-mcp-context/) example, which forwards a value from the `ai:Context` to the server as request metadata.

## Learn more

- [Build an AI agent](/learn/build-an-ai-agent/)
- The MCP examples in [Ballerina by Example](/learn/by-example/)
- [`ballerina/mcp` module](https://central.ballerina.io/ballerina/mcp/latest)
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification)
