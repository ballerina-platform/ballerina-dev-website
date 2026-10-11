---
layout: ballerina-observe-and-secure-ai-integrations-left-nav-pages-swanlake
title: Observe and secure AI integrations
description: Trace model and tool calls, inspect latency and token usage, and configure identities, permissions, and sensitive-data handling.
keywords: ballerina, AI, agent, LLM, observability, tracing, OpenTelemetry, Jaeger, token usage, security, JWT, OAuth2, agent identity, MCP, sensitive data, PII
permalink: /learn/observe-and-secure-ai-integrations/
active: observe-and-secure-ai-integrations
intro: This guide shows how to run an AI agent in production with the same controls as any other integration. You trace each model call and tool call, read latency and token usage from the traces, authenticate callers, give each tool its own least-privilege credential, keep personal data out of prompts, traces, and logs, and secure MCP servers.
---

## The scenario

An insurance company wants a claims assistant that policyholders can chat with from the company's mobile app. The assistant answers questions about the status of a claim and books a callback from a claims adjuster. Claim data is personal, and the assistant calls a large language model (LLM) hosted by a third party, so the security and operations teams set the following requirements:

- Only authenticated users of the mobile app can call the assistant, and a user can see only their own claims.
- Each backend operation is called with a credential that allows only that operation. The credential that reads claims cannot book callbacks.
- Email addresses, card numbers, and phone numbers that users type into the chat are not sent to the model provider.
- Bank details and internal adjuster notes in a claim record are never given to the model.
- Operators can see each model call and tool call, how long it took, and how many tokens it used, without the logs containing personal data.
- Failures are reported with distinct status codes: an invalid token, a missing permission, an unreachable model, and an unavailable claims system.

## How it works

The assistant is an HTTP service in front of an `ai:Agent`. The service authenticates the caller, removes personal data from the message, and passes the caller's identity to the tools through an `ai:Context`. The tools call the claims API with their own credentials. Ballerina exports a trace of every request to an OpenTelemetry (OTLP) collector, such as Jaeger.

```
Mobile app ── POST /assistant/chat  (Authorization: Bearer <JWT with scope claims:assist>)
                    │
                    ▼
┌─────────────────────────────────────────┐                         ┌────────────────────┐
│ HTTP service (:8080)                    │  redacted prompt,       │   LLM (OpenAI)     │
│ 1. validate the JWT and the scope       │  tool schemas           └─────────▲──────────┘
│ 2. validate the request, redact PII     │                                   │
│ 3. log and tag metadata, not content    │ ──────────► ai:Agent ◄────────────┘
│ 4. run the agent with an ai:Context     │               │    │
│    that holds the policyholder ID       │               │    │
│ 5. map the outcome to HTTP              │      getClaimStatus  requestCallback
└─────────────────────────────────────────┘               │    │
                                       read-only token    │    │  callback-only token
                                                          ▼    ▼
                                             Claims API (:9090, mocked)
                    │
                    ▼  spans: HTTP, invoke_agent, chat, execute_tool (OTLP)
          Jaeger or another OpenTelemetry collector (:4317)
```

1. The service validates the bearer token and checks that it grants the `claims:assist` scope. The `sub` claim of the token identifies the policyholder.
2. The service validates the request and replaces email addresses, card numbers, and phone numbers in the message with placeholders.
3. The service logs metadata about the request, such as its length and the number of redacted values, and adds the count to the trace.
4. The agent calls the model and runs the tools that the model requests. The tools read the policyholder ID from the `ai:Context`, so the model cannot ask for another user's claims. Each tool calls the claims API with its own token, and returns only the fields that the model needs.
5. The service maps the result, or the failure that a tool recorded in the context, to an HTTP response.

The `ballerina/ai` module and the model provider create a span for the agent run, for each model call, and for each tool call. Together with the HTTP spans that Ballerina creates automatically, a single trace shows the whole request.

The claims API is mocked by a service in the same package, so the sample runs without external systems.

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.14.0 (Swan Lake Update 14) or later. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.14.0
    ```

    >**Note:** The agent identity features described in [Give the agent its own identity](#give-the-agent-its-own-identity) are available in the `ballerina/ai` package version 1.16.0 and later, which requires Ballerina 2201.14.0.

2. Access to an LLM that supports tool calling. This guide uses OpenAI and requires an OpenAI API key. To use a different provider, see [Use a different model provider](/learn/build-an-agent-that-uses-enterprise-systems/#use-a-different-model-provider).

3. A tracing backend that accepts OpenTelemetry data over OTLP/gRPC. This guide uses Jaeger. To start Jaeger locally, see [Set up Jaeger](/learn/supported-observability-tools-and-platforms/jaeger/#step-1---set-up-jaeger). The trace receiver listens on port `4317` and the web UI on port `16686`.

4. OpenSSL, to create a key pair and a signed token for local testing.

5. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.

6. A command terminal.

## Create the package

Ballerina uses packages to group code. In the terminal, execute the command below to create a package for the integration.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new claims_assistant
```

Remove the generated `main.bal` file. At the end of this guide, the package contains the files below.

```
claims_assistant
├── Ballerina.toml
├── Config.toml
├── agent.bal              # the model provider and the agent
├── claims_api_mock.bal    # a mock of the claims API
├── privacy.bal            # redaction and data minimization
├── service.bal            # the secured HTTP service
├── tools.bal              # the agent tools and their credentials
├── types.bal              # data types
└── tests
    ├── Config.toml
    ├── privacy_test.bal
    ├── resources
    │   ├── private.key    # test key pair, created with OpenSSL
    │   └── public.crt
    ├── service_test.bal
    └── tools_test.bal
```

## Observe the integration

### Enable tracing

Observability must be included in the executable when the package is built. Make sure that the `Ballerina.toml` file has the following build option. New packages created with `bal new` include it.

```toml
[build-options]
observabilityIncluded = true
```

Tracing is turned on at run time with the configuration below. The `otel` tracing provider exports spans over OTLP, so you can send them to Jaeger or to any other OpenTelemetry collector without changing the code. No import is needed.

```toml
[ballerina.observe]
tracingEnabled = true
tracingProvider = "otel"

[ballerina.otel]
tracesEndpoint = "http://localhost:4317"
```

When the service starts with tracing enabled, it prints the following line.

```
ballerina: started publishing traces to Otel on http://localhost:4317 [gRPC]
```

>**Tip:** Tracing every request is useful while you develop. In production, use the `tracesSampler` and `tracesSamplerArg` keys of the `[ballerina.otel]` table to sample a fraction of the requests. For the other observability settings, see [Overview of Ballerina observability](/learn/overview-of-ballerina-observability/).

>**Info: Requires tooling.** The Ballerina VS Code extension and WSO2 Integrator have a built-in trace viewer that shows agent runs without an external tracing backend. To use it, open the command palette (`Ctrl + Shift + P` or `command + shift + P`) and run `Ballerina: Enable Tracing`. To export traces to Jaeger or another collector instead, use the configuration shown above.

### Understand the spans of an agent run

The trace of one chat request that triggered one tool call contains the spans below. The `ballerina/ai` spans follow the <a href="https://opentelemetry.io/docs/specs/semconv/gen-ai/" target="_blank">OpenTelemetry semantic conventions for generative AI</a> and have the `span.type` attribute set to `ai`.

```
post /chat                                                    HTTP resource span
└── invoke_agent Claims Assistant                             the agent run
    ├── ballerinax/ai.openai/ModelProvider:chat
    │   └── chat gpt-4o                                       model call 1: the model requests a tool call
    │       └── ballerinax/openai.chat/Client:$post$chat$completions
    │           └── ballerina/http/Client:post ...            HTTP call to the model provider
    ├── execute_tool getClaimStatus                           the tool call
    │   └── ballerina/http/Client:Client.$get$^^ ...          HTTP call to the claims API
    │       └── get /policyholders/^/claims/^                 the claims API (server span)
    └── ballerinax/ai.openai/ModelProvider:chat
        └── chat gpt-4o                                       model call 2: the model writes the answer
            └── ...
```

The most useful attributes of each span are listed below.

| Span | Attributes |
|------|------------|
| `invoke_agent <role>` | `gen_ai.agent.name`, `gen_ai.agent.id`, `gen_ai.conversation.id` (the session ID), `gen_ai.system_instructions`, `gen_ai.input.messages` (the user message), `gen_ai.output.messages` (the answer) |
| `chat <model>` | `gen_ai.provider.name`, `gen_ai.request.model`, `gen_ai.response.id`, `gen_ai.response.finish_reasons`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.input.messages`, `gen_ai.input.tools`, `gen_ai.output.messages` |
| `execute_tool <tool>` | `gen_ai.tool.name`, `gen_ai.tool.description`, `gen_ai.tool.type` (`function`, or `extension` for MCP tools), `gen_ai.tool.call.id`, `gen_ai.tool.arguments`, `gen_ai.tool.output` |

The module also creates spans for embedding calls, knowledge base ingestion and retrieval, human approval, and the agent identity flow described later in this guide. A span whose operation failed has an error status and the error message, so you can see which model call or tool call caused a failed request.

### Read latency and token usage

Each span has a start time and a duration. Use them to find where the time of a request is spent:

- The duration of `invoke_agent` is the time of the whole agent run.
- The duration of each `chat` span is the latency of one model call. The number of `chat` spans is the number of model calls in the run, which is limited by the `maxIter` setting of the agent.
- The duration of each `execute_tool` span is the time of one tool call, and its child HTTP span shows the time spent in the backend.

The token usage reported by the model provider is recorded on each `chat` span in the `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens` attributes. To find the token usage of a request, add the values of all `chat` spans in its trace. The `ballerinax/ai.openai` provider records these attributes. Check the documentation of other providers for the attributes that they record.

>**Note:** The `ballerina/ai` module does not publish token usage as a metric. Token usage is available only in traces, so use your tracing backend to query and aggregate it.

### Add your own attributes

Add attributes that help operators without exposing content. The sample adds the number of redacted values to the span of the HTTP resource with the `ballerina/observe` module.

```ballerina
        if observe:isTracingEnabled() {
            error? tagged = observe:addTagToSpan("claims.redacted_values", redactedValues.toString());
            if tagged is error {
                log:printDebug("Could not add the tag to the span", tagged);
            }
        }
```

### Log metadata, not content

Logs are usually kept longer and shared more widely than traces. Do not log prompts, model responses, or tool results. Log the metadata that you need to operate the service instead. The sample logs a record with the session ID, the length of the message, and the number of redacted values. The `@log:Sensitive` annotation excludes the policyholder ID from the log output when sensitive-data masking is enabled.

```ballerina
# Information about a chat request that is written to the log.
# Fields marked `@log:Sensitive` are excluded from the log output when masking is enabled.
type ChatAuditEntry record {|
    string sessionId;
    @log:Sensitive
    string policyholderId;
    int messageLength;
    int redactedValues;
|};
```

Enable masking in the `Config.toml` file.

```toml
[ballerina.log]
enableSensitiveDataMasking = true
```

When tracing is enabled, each log line includes the trace ID and span ID of the request, so you can go from a log line to its trace.

```
time=2026-10-11T04:37:58.970+05:30 level=INFO module=ballerina_tutorials/claims_assistant message="Chat request received" audit={"sessionId":"s1","messageLength":61,"redactedValues":1} traceId="e0522522964b27437562a81991fa5e44" spanId="01f6a8e163914c67"
```

For other ways to mask values, see [Sensitive data logging](/learn/by-example/sensitive-data-logging/). For metrics such as request counts and response times of the HTTP service, see [Observe metrics using Prometheus](/learn/supported-observability-tools-and-platforms/prometheus/).

## Secure the integration

### Protect the model provider key

Declare the API key as a [configurable variable](/learn/configure-a-sample-ballerina-service/), and create the model provider once at the module level.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable int maxIterations = 5;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);
```

Provide the value in the `Config.toml` file while you develop.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
```

>**Note:** Do not commit `Config.toml` files that contain secrets. In deployed environments, provide the values through environment variables or a secret store. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/). Use a separate key for each environment, so that you can revoke one without affecting the others.

### Authenticate callers

An agent endpoint must be secured in the same way as any other API. The service validates the JWT that the mobile app sends with an `http:ListenerJwtAuthHandler`, and checks that the token grants the `claims:assist` scope. The issuer, the audience, and the certificate of the identity provider are configurable.

```ballerina
configurable int servicePort = 8080;
configurable string tokenIssuer = ?;
configurable string tokenAudience = ?;
configurable string issuerCertFile = ?;

const REQUIRED_SCOPE = "claims:assist";
const MAX_MESSAGE_LENGTH = 2000;

// Validates the bearer token sent by the client application.
final http:ListenerJwtAuthHandler jwtHandler = new ({
    issuer: tokenIssuer,
    audience: tokenAudience,
    signatureConfig: {certFile: issuerCertFile},
    scopeKey: "scope"
});
```

The `authenticate` function returns the `sub` claim of the token, which is the ID of the policyholder, or the response to send when the token is missing, invalid, or does not grant the scope.

```ballerina
# Validates the bearer token and checks that it grants the scope required to use the assistant.
#
# + headers - The request headers
# + return - The ID of the authenticated policyholder (the `sub` claim), or the response to send
isolated function authenticate(http:Headers headers) returns string|http:Unauthorized|http:Forbidden {
    jwt:Payload|http:Unauthorized result = jwtHandler.authenticate(headers);
    if result is http:Unauthorized {
        return result;
    }
    jwt:Payload payload = <jwt:Payload>result;
    http:Forbidden? forbidden = jwtHandler.authorize(payload, REQUIRED_SCOPE);
    if forbidden is http:Forbidden {
        return forbidden;
    }
    string? subject = payload.sub;
    if subject is () {
        return <http:Unauthorized>{body: "The token does not identify a user"};
    }
    return subject;
}
```

The resource calls it before it does anything else, so an unauthenticated request never reaches the model.

```ballerina
        // 1. Authenticate the caller and check the scope before doing any work.
        string|http:Unauthorized|http:Forbidden policyholderId = authenticate(headers);
        if policyholderId !is string {
            return policyholderId;
        }
```

>**Tip:** This sample validates tokens imperatively because it needs the `sub` claim. If you do not need the claims, declare the same configuration in the `auth` field of the `@http:ServiceConfig` annotation. See [HTTP service - JWT authentication](/learn/by-example/http-service-jwt-authentication/). To validate tokens with the public keys that your identity provider publishes, use `signatureConfig: {jwksConfig: {url: ...}}` instead of `certFile`.

>**Note:** This sample uses HTTP so that you can try it locally. In production, configure TLS on the listener with the `secureSocket` field, as shown in the same example.

### Bind the tools to the authenticated user

Do not let the model decide whose data a tool reads. The service stores the policyholder ID from the token in the `ai:Context` of the run, and the tools read it from there. The tools have no parameter for the policyholder ID, so the model cannot ask for another user's claims, even if a user tries to make it do so.

```ballerina
        // 4. Run the agent. Tools read the policyholder from the context.
        ai:Context ctx = new;
        ctx.set(POLICYHOLDER_ID, policyholderId);
        // Scope the conversation memory to the user, so that one user cannot continue another user's session.
        string sessionId = string `${policyholderId}:${request.sessionId}`;
        string|ai:Error answer = claimsAgent.run(message, sessionId, ctx);
```

The session ID is also prefixed with the policyholder ID, so that a user cannot continue another user's conversation by guessing its session ID.

### Give each tool its own credential

A tool should have only the permissions it needs. In the sample, each tool calls the claims API through its own `http:Client`, with its own token: `getClaimStatus` uses a token that can only read claims, and `requestCallback` uses a token that can only book callbacks. If the model is manipulated into calling a tool with unexpected arguments, the credential still limits what the call can do.

```ballerina
configurable string claimsApiUrl = "http://localhost:9090/api";
// Each tool calls the claims API with its own credential, which grants only what that tool needs.
configurable string claimsReadToken = ?;
configurable string callbackWriteToken = ?;

const POLICYHOLDER_ID = "policyholderId";
const BACKEND_UNAVAILABLE = "backendUnavailable";
const TOOL_ACCESS_DENIED = "toolAccessDenied";

final http:Client claimsReader = check new (claimsApiUrl, auth = {token: claimsReadToken}, timeout = 10);
final http:Client callbackWriter = check new (claimsApiUrl, auth = {token: callbackWriteToken}, timeout = 10);
```

The `getClaimStatus` tool validates its input, reads the policyholder ID from the context, and calls the claims API with the read-only client.

```ballerina
# Retrieves the status of one of the current user's insurance claims.
#
# + ctx - The agent context, which identifies the authenticated policyholder
# + claimId - The claim ID, in the format CLM-12345
# + return - A summary of the claim, or an error that describes why it could not be retrieved
@ai:AgentTool
isolated function getClaimStatus(ai:Context ctx, string claimId) returns ClaimSummary|error {
    check validateClaimId(claimId);
    // The policyholder comes from the validated token, never from the model.
    string policyholderId = check ctx.getWithType(POLICYHOLDER_ID);
    Claim|http:ClientError claim = claimsReader->/policyholders/[policyholderId]/claims/[claimId];
    if claim is http:ClientError {
        return toToolError(ctx, claim);
    }
    return toClaimSummary(claim);
}
```

In production, obtain the tokens from your identity provider instead of configuring them. For example, register an OAuth2 client for each tool and use the client credentials grant with only the scopes that the tool needs. The `http:Client` obtains and refreshes the token.

```ballerina
import ballerina/http;

configurable string tokenUrl = ?;
configurable string claimsReaderClientId = ?;
configurable string claimsReaderClientSecret = ?;

final http:Client claimsReader = check new (claimsApiUrl,
    auth = {
        tokenUrl,
        clientId: claimsReaderClientId,
        clientSecret: claimsReaderClientSecret,
        scopes: ["claims:read"]
    },
    timeout = 10
);
```

>**Note:** The client requests its first token when it is initialized. If the token endpoint cannot be reached or rejects the credentials, the integration does not start.

For the other grant types, see [HTTP client - OAuth2 client credentials grant type](/learn/by-example/http-client-oauth2-client-credentials-grant-type/).

### Give the agent its own identity

The `ballerina/ai` module can also authenticate the agent itself with an identity provider that supports agent identities, such as <a href="https://wso2.com/asgardeo/" target="_blank">Asgardeo</a>. In this model, the agent has an agent ID and a secret, and each tool declares the OAuth2 application and the scopes that it needs. Before the agent runs a tool, it obtains an access token for the tool as the agent, validates the token, checks that the token has the required scopes, and stores the token in the `ai:Context`. The tool reads the token with `ctx.getAccessToken` and sends it to the backend.

The following example shows the `getClaimStatus` tool and the agent configured for agent identity.

```ballerina
import ballerina/ai;
import ballerina/http;

// The agent's own identity (agent ID and secret), registered in the identity provider.
configurable ai:Credential agentCredential = ?;
// The OAuth application that the agent uses to obtain tokens for its tools.
configurable string authServerUrl = ?;
configurable string oauthClientId = ?;
configurable string oauthRedirectUri = ?;

final http:Client claimsApi = check new (claimsApiUrl, timeout = 10);

# Retrieves the status of one of the insurance claims of the current user.
#
# + ctx - The agent context, which identifies the authenticated policyholder
# + claimId - The claim ID, in the format CLM-12345
# + return - A summary of the claim, or an error that describes why it could not be retrieved
@ai:AgentTool {
    description: "Retrieves the status of one of the insurance claims of the current user.",
    auth: {
        baseAuthUrl: authServerUrl,
        clientId: oauthClientId,
        redirectUri: oauthRedirectUri,
        isPkceEnabled: true,
        scopes: ["claims:read"]
    }
}
isolated function getClaimStatus(ai:Context ctx, string claimId) returns ClaimSummary|error {
    check validateClaimId(claimId);
    string policyholderId = check ctx.getWithType(POLICYHOLDER_ID);
    // The agent obtains and validates the token before it runs the tool.
    string accessToken = check ctx.getAccessToken("getClaimStatus");
    Claim claim = check claimsApi->/policyholders/[policyholderId]/claims/[claimId]({
        "Authorization": string `Bearer ${accessToken}`
    });
    return toClaimSummary(claim);
}

final ai:Agent claimsAgent = check new (
    systemPrompt = {
        role: "Claims Assistant",
        instructions: "You help policyholders of an insurance company with questions about their claims."
    },
    model = model,
    tools = [getClaimStatus],
    credential = agentCredential
);
```

Provide the agent credential as a configurable record in the `Config.toml` file.

```toml
[agentCredential]
id = "<AGENT_ID>"
secret = "<AGENT_SECRET>"
```

The `auth` field of the `@ai:AgentTool` annotation takes an `ai:AgentIdAuthConfig` record with the following fields.

| Field | Description |
|-------|-------------|
| `baseAuthUrl` | The base URL of the OAuth2 endpoints of the authorization server, for example, `https://api.asgardeo.io/t/<organization>/oauth2` |
| `clientId` | The client ID of the OAuth2 application |
| `clientSecret` | The client secret, for a confidential client. Omit it for a public client that uses PKCE. |
| `redirectUri` | The redirect URI registered for the application |
| `isPkceEnabled` | Whether to use PKCE in the authorization code flow. The default is `false`. |
| `scopes` | The scopes that the tool requires |
| `secureSocket` | The TLS configuration for the authorization server |

If the agent cannot obtain a token (`ai:TokenAcquisitionError`), the token is not valid (`ai:TokenValidationError`), or the token does not have a required scope (`ai:InsufficientScopeError`), the tool does not run. The agent records an `ai:UnauthorizedError` for the tool call and ends the run with a fixed answer that says that the request could not be completed because of an authorization issue. The model is not called again. The trace contains spans for the `validate_token` and `validate_tool_authorization` operations. The `validate_tool_authorization` span records the required and the granted scopes in the `gen_ai.auth.required_scopes` and `gen_ai.auth.granted_scopes` attributes.

>**Note:** In this model, tools act as the agent, not as the end user. Keep the binding to the end user that is described in [Bind the tools to the authenticated user](#bind-the-tools-to-the-authenticated-user).

>**Info: Requires tooling.** In WSO2 Integrator, you can also enter these settings in the visual designer: the agent ID and secret in the advanced configuration of the agent node, and the authorization settings in the advanced configuration of each tool.

### Secure MCP servers and MCP tools

When tools are served by an MCP server, secure the server like any other API. The `httpConfig` field of the `@mcp:StreamableHttpServiceConfig` annotation takes the same `auth` configuration as an HTTP service.

```ballerina
import ballerina/mcp;

configurable string tokenIssuer = ?;
configurable string jwksUrl = ?;

@mcp:StreamableHttpServiceConfig {
    info: {name: "claims-tools", version: "1.0.0"},
    httpConfig: {
        auth: [
            {
                jwtValidatorConfig: {
                    issuer: tokenIssuer,
                    audience: "claims-mcp",
                    signatureConfig: {jwksConfig: {url: jwksUrl}}
                },
                scopes: ["claims:read"]
            }
        ]
    }
}
service mcp:StreamableHttpService /mcp on new mcp:StreamableHttpListener(9091) {

    # Retrieves the status of an insurance claim.
    #
    # + claimId - The claim ID, in the format CLM-12345
    # + return - A summary of the claim, or an error
    remote function getClaimStatus(string claimId) returns ClaimSummary|error {
        check validateClaimId(claimId);
        return lookUpClaim(claimId);
    }
}
```

In this example, `lookUpClaim` stands for your own code that reads the claim and maps it to a `ClaimSummary`.

On the agent side, pass the credentials to `ai:McpToolKit` with the `auth` parameter, and list only the tools that the agent needs, so that tools added to the server later are not exposed to the agent automatically.

```ballerina
import ballerina/ai;

configurable string mcpServerUrl = "http://localhost:9091/mcp";
configurable string mcpClientId = ?;
configurable string mcpClientSecret = ?;

isolated function createClaimsToolKit() returns ai:McpToolKit|ai:Error {
    return new (mcpServerUrl, ["getClaimStatus"],
        auth = {
            tokenUrl,
            clientId: mcpClientId,
            clientSecret: mcpClientSecret,
            scopes: ["claims:read"]
        }
    );
}
```

The `tokenUrl` variable is the configurable variable declared in the OAuth2 example in [Give each tool its own credential](#give-each-tool-its-own-credential).

For more on MCP, see [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/).

### Keep sensitive data out of prompts, traces, and logs

Everything that you send to the model can be stored by the model provider, and everything in a prompt is recorded in the trace, because the `chat` and `invoke_agent` spans contain the full messages and the `execute_tool` spans contain the tool arguments and results. Reduce the data at each point where it enters the agent.

**Redact the user's message.** Replace values that the model does not need with placeholders before the message is passed to the agent. Redaction with regular expressions is a best-effort control. It reduces exposure, but it does not detect every form of personal data.

```ballerina
// Patterns for values that must not be sent to the model provider.
// Card numbers are checked before phone numbers, because a card number also matches the phone pattern.
final readonly & [string:RegExp, string][] PII_PATTERNS = [
    [re `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`, "[EMAIL]"],
    [re `[0-9](?:[ -]?[0-9]){12,18}`, "[CARD_NUMBER]"],
    [re `\+?[0-9][0-9 ()-]{7,}[0-9]`, "[PHONE_NUMBER]"]
];

# Replaces email addresses, card numbers, and phone numbers in a message with placeholders.
#
# + message - The message received from the user
# + return - The redacted message and the number of values that were replaced
isolated function redactPii(string message) returns [string, int] {
    string redacted = message;
    int count = 0;
    foreach [string:RegExp, string] [pattern, placeholder] in PII_PATTERNS {
        count += pattern.findAll(redacted).length();
        redacted = pattern.replaceAll(redacted, placeholder);
    }
    return [redacted, count];
}
```

**Return only what the model needs from tools.** The claims API returns the policyholder's email address, bank account, and internal adjuster notes. The tool maps the claim to a `ClaimSummary` record that contains only the fields that are needed to answer questions. The model, the provider, and the trace never see the other fields.

```ballerina
# Maps a claim from the claims system to the fields that the assistant may use.
#
# + claim - The claim returned by the claims system
# + return - The claim summary
isolated function toClaimSummary(Claim claim) returns ClaimSummary => {
    claimId: claim.claimId,
    status: claim.status,
    amountClaimed: claim.amountClaimed,
    lastUpdated: claim.lastUpdated,
    nextStep: claim.nextStep
};
```

**Restrict access to traces.** Treat your tracing backend as a store of personal data. Restrict who can read it, set a retention period, and sample traces in production. Avoid putting personal data in the system prompt, because it is recorded in every `invoke_agent` span.

>**Note:** In this sample, the conversation ID that appears in the traces contains the policyholder ID. If your policy does not allow user IDs in traces, use an opaque session ID instead.

## Handle failures

The service returns a distinct response for each kind of failure.

| Failure | Detected by | Response |
|---------|-------------|----------|
| Missing, expired, or invalid token, or a token for another audience | `jwtHandler.authenticate` | `401 Unauthorized` |
| Token without the `claims:assist` scope | `jwtHandler.authorize` | `403 Forbidden` |
| Empty or too long message | `validateChatRequest` | `400 Bad Request` |
| Invalid claim ID, or a claim that does not belong to the user | The tool returns an error to the model | The model explains the problem in its answer |
| The claims API rejects a tool's credential | The tool records `TOOL_ACCESS_DENIED` in the context | `500 Internal Server Error` |
| The claims API is unreachable | The tool records `BACKEND_UNAVAILABLE` in the context | `503 Service Unavailable` |
| The model provider is unreachable | `isModelUnavailable` | `503 Service Unavailable` |
| Any other agent failure, such as reaching the iteration limit | `answer is ai:Error` | `500 Internal Server Error` |

Errors that the model can explain to the user, such as an unknown claim, are returned to the model as the tool result. Errors that mean the service cannot work correctly, such as a rejected credential, are recorded in the context so that the service fails the request instead of relying on the model's answer.

```ballerina
# Converts a claims API error into an error message for the model.
# A rejected credential (401 or 403) and an unavailable backend are recorded in the context,
# so that the service fails the request instead of relying on the model's answer.
#
# + ctx - The agent context
# + err - The error returned by the HTTP client
# + return - The error to return to the model
isolated function toToolError(ai:Context ctx, http:ClientError err) returns error {
    if err is http:ClientRequestError {
        int status = err.detail().statusCode;
        if status == http:STATUS_UNAUTHORIZED || status == http:STATUS_FORBIDDEN {
            log:printError("The claims API rejected the tool credential", statusCode = status);
            ctx.set(TOOL_ACCESS_DENIED, true);
            return error("The claims system denied access.");
        }
        ErrorBody|error body = err.detail().body.ensureType();
        return error(body is ErrorBody ? body.message : "The request was rejected by the claims system.");
    }
    log:printError("The claims API is unavailable", err);
    ctx.set(BACKEND_UNAVAILABLE, true);
    return error("The claims system is temporarily unavailable.");
}
```

When the model provider cannot be reached, the agent returns an `ai:Error` whose `steps` detail contains the `ai:LlmConnectionError`. The `isModelUnavailable` function checks for it.

```ballerina
# Checks whether an agent run failed because the model provider could not be reached.
# The agent reports a failed model call as an `ai:Error` that lists the failed steps.
#
# + err - The error returned by the agent
# + return - `true` if the model provider could not be reached
isolated function isModelUnavailable(ai:Error err) returns boolean {
    if err is ai:LlmConnectionError {
        return true;
    }
    var steps = err.detail()["steps"];
    if steps is (any|error)[] {
        foreach var step in steps {
            if step is ai:LlmConnectionError {
                return true;
            }
        }
    }
    return false;
}
```

## The complete sample code

### `Ballerina.toml`

In addition to the generated `[package]` table, the file must contain the following.

```toml
[build-options]
observabilityIncluded = true
```

### `Config.toml`

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"

# The identity provider that issues tokens to client applications.
tokenIssuer = "https://idp.example.com"
tokenAudience = "claims-assistant"
# The public certificate of the identity provider. This is the local test certificate.
issuerCertFile = "tests/resources/public.crt"

# Credentials of the tools. Each one grants only what its tool needs.
claimsReadToken = "<READ_ONLY_TOKEN>"
callbackWriteToken = "<CALLBACK_TOKEN>"

[ballerina.observe]
tracingEnabled = true
tracingProvider = "otel"

[ballerina.otel]
tracesEndpoint = "http://localhost:4317"

[ballerina.log]
enableSensitiveDataMasking = true
```

### `types.bal`

```ballerina
import ballerina/log;

# A claim as stored in the claims system. It contains data that the assistant does not need.
type Claim record {|
    string claimId;
    string policyholderId;
    string status;
    decimal amountClaimed;
    string lastUpdated;
    string nextStep;
    string email;
    string bankAccount;
    string adjusterNotes;
|};

# The subset of a claim that the assistant is allowed to see and send to the model.
type ClaimSummary record {|
    # The claim ID
    string claimId;
    # The current status of the claim
    string status;
    # The amount claimed, in USD
    decimal amountClaimed;
    # The date on which the claim was last updated, in the format YYYY-MM-DD
    string lastUpdated;
    # What happens next with the claim
    string nextStep;
|};

# A time window for a callback from a claims adjuster.
enum CallbackWindow {
    MORNING,
    AFTERNOON,
    EVENING
}

# A callback booked with a claims adjuster.
type Callback record {|
    # The callback reference
    string callbackId;
    # The claim the callback is about
    string claimId;
    # The booked time window
    CallbackWindow window;
|};

# An error returned by the claims API.
type ErrorBody record {
    string message;
};

# Information about a chat request that is written to the log.
# Fields marked `@log:Sensitive` are excluded from the log output when masking is enabled.
type ChatAuditEntry record {|
    string sessionId;
    @log:Sensitive
    string policyholderId;
    int messageLength;
    int redactedValues;
|};
```

### `privacy.bal`

```ballerina
// Patterns for values that must not be sent to the model provider.
// Card numbers are checked before phone numbers, because a card number also matches the phone pattern.
final readonly & [string:RegExp, string][] PII_PATTERNS = [
    [re `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}`, "[EMAIL]"],
    [re `[0-9](?:[ -]?[0-9]){12,18}`, "[CARD_NUMBER]"],
    [re `\+?[0-9][0-9 ()-]{7,}[0-9]`, "[PHONE_NUMBER]"]
];

# Replaces email addresses, card numbers, and phone numbers in a message with placeholders.
#
# + message - The message received from the user
# + return - The redacted message and the number of values that were replaced
isolated function redactPii(string message) returns [string, int] {
    string redacted = message;
    int count = 0;
    foreach [string:RegExp, string] [pattern, placeholder] in PII_PATTERNS {
        count += pattern.findAll(redacted).length();
        redacted = pattern.replaceAll(redacted, placeholder);
    }
    return [redacted, count];
}

# Maps a claim from the claims system to the fields that the assistant may use.
#
# + claim - The claim returned by the claims system
# + return - The claim summary
isolated function toClaimSummary(Claim claim) returns ClaimSummary => {
    claimId: claim.claimId,
    status: claim.status,
    amountClaimed: claim.amountClaimed,
    lastUpdated: claim.lastUpdated,
    nextStep: claim.nextStep
};
```

### `tools.bal`

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/log;

configurable string claimsApiUrl = "http://localhost:9090/api";
// Each tool calls the claims API with its own credential, which grants only what that tool needs.
configurable string claimsReadToken = ?;
configurable string callbackWriteToken = ?;

const POLICYHOLDER_ID = "policyholderId";
const BACKEND_UNAVAILABLE = "backendUnavailable";
const TOOL_ACCESS_DENIED = "toolAccessDenied";

final http:Client claimsReader = check new (claimsApiUrl, auth = {token: claimsReadToken}, timeout = 10);
final http:Client callbackWriter = check new (claimsApiUrl, auth = {token: callbackWriteToken}, timeout = 10);

# Retrieves the status of one of the current user's insurance claims.
#
# + ctx - The agent context, which identifies the authenticated policyholder
# + claimId - The claim ID, in the format CLM-12345
# + return - A summary of the claim, or an error that describes why it could not be retrieved
@ai:AgentTool
isolated function getClaimStatus(ai:Context ctx, string claimId) returns ClaimSummary|error {
    check validateClaimId(claimId);
    // The policyholder comes from the validated token, never from the model.
    string policyholderId = check ctx.getWithType(POLICYHOLDER_ID);
    Claim|http:ClientError claim = claimsReader->/policyholders/[policyholderId]/claims/[claimId];
    if claim is http:ClientError {
        return toToolError(ctx, claim);
    }
    return toClaimSummary(claim);
}

# Books a callback from a claims adjuster about one of the current user's claims.
# Call this only when the user asks to speak to an adjuster.
#
# + ctx - The agent context, which identifies the authenticated policyholder
# + claimId - The claim ID, in the format CLM-12345
# + window - The time window that the user prefers for the callback
# + return - The booked callback, or an error that describes why it could not be booked
@ai:AgentTool
isolated function requestCallback(ai:Context ctx, string claimId, CallbackWindow window) returns Callback|error {
    check validateClaimId(claimId);
    string policyholderId = check ctx.getWithType(POLICYHOLDER_ID);
    Callback|http:ClientError callback =
        callbackWriter->/policyholders/[policyholderId]/claims/[claimId]/callbacks.post({window});
    if callback is http:ClientError {
        return toToolError(ctx, callback);
    }
    return callback;
}

# Validates a claim ID before it is sent to the claims API.
#
# + claimId - The claim ID provided by the model
# + return - An error if the claim ID is not in the format CLM-12345
isolated function validateClaimId(string claimId) returns error? {
    if !re `CLM-[0-9]{5}`.isFullMatch(claimId) {
        return error(string `'${claimId}' is not a valid claim ID. Claim IDs have the format CLM-12345.`);
    }
}

# Converts a claims API error into an error message for the model.
# A rejected credential (401 or 403) and an unavailable backend are recorded in the context,
# so that the service fails the request instead of relying on the model's answer.
#
# + ctx - The agent context
# + err - The error returned by the HTTP client
# + return - The error to return to the model
isolated function toToolError(ai:Context ctx, http:ClientError err) returns error {
    if err is http:ClientRequestError {
        int status = err.detail().statusCode;
        if status == http:STATUS_UNAUTHORIZED || status == http:STATUS_FORBIDDEN {
            log:printError("The claims API rejected the tool credential", statusCode = status);
            ctx.set(TOOL_ACCESS_DENIED, true);
            return error("The claims system denied access.");
        }
        ErrorBody|error body = err.detail().body.ensureType();
        return error(body is ErrorBody ? body.message : "The request was rejected by the claims system.");
    }
    log:printError("The claims API is unavailable", err);
    ctx.set(BACKEND_UNAVAILABLE, true);
    return error("The claims system is temporarily unavailable.");
}
```

### `agent.bal`

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;
configurable int maxIterations = 5;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

final ai:Agent claimsAgent = check new (
    systemPrompt = {
        role: "Claims Assistant",
        instructions: string `You help policyholders of an insurance company with questions about their claims.

            Rules:
            - Use the tools to look up claims. Never guess a claim status, an amount, or a date.
            - If the user does not give a claim ID, ask for it.
            - Book a callback only when the user asks to speak to an adjuster.
            - Some values in the message are replaced with placeholders such as [EMAIL].
              Do not ask the user to repeat them.
            - Do not answer questions that are not about claims. Keep answers short.`
    },
    model = model,
    tools = [getClaimStatus, requestCallback],
    maxIter = maxIterations
);
```

### `service.bal`

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/jwt;
import ballerina/log;
import ballerina/observe;

configurable int servicePort = 8080;
configurable string tokenIssuer = ?;
configurable string tokenAudience = ?;
configurable string issuerCertFile = ?;

const REQUIRED_SCOPE = "claims:assist";
const MAX_MESSAGE_LENGTH = 2000;

// Validates the bearer token sent by the client application.
final http:ListenerJwtAuthHandler jwtHandler = new ({
    issuer: tokenIssuer,
    audience: tokenAudience,
    signatureConfig: {certFile: issuerCertFile},
    scopeKey: "scope"
});

service /assistant on new http:Listener(servicePort) {
    resource function post chat(http:Headers headers, ai:ChatReqMessage request)
            returns ai:ChatRespMessage|http:BadRequest|http:Unauthorized|http:Forbidden|
                http:ServiceUnavailable|http:InternalServerError {
        // 1. Authenticate the caller and check the scope before doing any work.
        string|http:Unauthorized|http:Forbidden policyholderId = authenticate(headers);
        if policyholderId !is string {
            return policyholderId;
        }

        // 2. Validate the request and remove personal data from the message.
        string? validationError = validateChatRequest(request);
        if validationError is string {
            return <http:BadRequest>{body: validationError};
        }
        [string, int] [message, redactedValues] = redactPii(request.message);

        // 3. Log and trace metadata about the request, not its content.
        ChatAuditEntry audit = {
            sessionId: request.sessionId,
            policyholderId,
            messageLength: request.message.length(),
            redactedValues
        };
        log:printInfo("Chat request received", audit = audit);
        if observe:isTracingEnabled() {
            error? tagged = observe:addTagToSpan("claims.redacted_values", redactedValues.toString());
            if tagged is error {
                log:printDebug("Could not add the tag to the span", tagged);
            }
        }

        // 4. Run the agent. Tools read the policyholder from the context.
        ai:Context ctx = new;
        ctx.set(POLICYHOLDER_ID, policyholderId);
        // Scope the conversation memory to the user, so that one user cannot continue another user's session.
        string sessionId = string `${policyholderId}:${request.sessionId}`;
        string|ai:Error answer = claimsAgent.run(message, sessionId, ctx);

        // 5. Map the outcome to an HTTP response.
        if ctx.hasKey(TOOL_ACCESS_DENIED) {
            return <http:InternalServerError>{body: "The assistant could not complete the request"};
        }
        if ctx.hasKey(BACKEND_UNAVAILABLE) {
            return <http:ServiceUnavailable>{body: "The claims system is temporarily unavailable"};
        }
        if answer is ai:Error && isModelUnavailable(answer) {
            log:printError("Model provider is unreachable", answer);
            return <http:ServiceUnavailable>{body: "The assistant is temporarily unavailable"};
        }
        if answer is ai:Error {
            log:printError("Agent run failed", answer, sessionId = request.sessionId);
            return <http:InternalServerError>{body: "The assistant could not complete the request"};
        }
        return {message: answer};
    }
}

# Validates the bearer token and checks that it grants the scope required to use the assistant.
#
# + headers - The request headers
# + return - The ID of the authenticated policyholder (the `sub` claim), or the response to send
isolated function authenticate(http:Headers headers) returns string|http:Unauthorized|http:Forbidden {
    jwt:Payload|http:Unauthorized result = jwtHandler.authenticate(headers);
    if result is http:Unauthorized {
        return result;
    }
    jwt:Payload payload = <jwt:Payload>result;
    http:Forbidden? forbidden = jwtHandler.authorize(payload, REQUIRED_SCOPE);
    if forbidden is http:Forbidden {
        return forbidden;
    }
    string? subject = payload.sub;
    if subject is () {
        return <http:Unauthorized>{body: "The token does not identify a user"};
    }
    return subject;
}

# Checks whether an agent run failed because the model provider could not be reached.
# The agent reports a failed model call as an `ai:Error` that lists the failed steps.
#
# + err - The error returned by the agent
# + return - `true` if the model provider could not be reached
isolated function isModelUnavailable(ai:Error err) returns boolean {
    if err is ai:LlmConnectionError {
        return true;
    }
    var steps = err.detail()["steps"];
    if steps is (any|error)[] {
        foreach var step in steps {
            if step is ai:LlmConnectionError {
                return true;
            }
        }
    }
    return false;
}

# Validates a chat request before it is passed to the agent.
#
# + request - The chat request
# + return - A description of the problem, or `()` if the request is valid
isolated function validateChatRequest(ai:ChatReqMessage request) returns string? {
    if request.sessionId.trim().length() == 0 {
        return "sessionId must not be empty";
    }
    string message = request.message.trim();
    if message.length() == 0 {
        return "message must not be empty";
    }
    if message.length() > MAX_MESSAGE_LENGTH {
        return string `message must not exceed ${MAX_MESSAGE_LENGTH} characters`;
    }
    return;
}
```

### `claims_api_mock.bal`

```ballerina
import ballerina/http;

// A mock of the claims API, so that the sample runs without external systems.
// It accepts only the token that grants each operation.
configurable int claimsApiPort = 9090;

isolated map<Claim> claims = {
    "CLM-10234": {
        claimId: "CLM-10234",
        policyholderId: "PH-001",
        status: "UNDER_REVIEW",
        amountClaimed: 1850.00,
        lastUpdated: "2026-10-02",
        nextStep: "An adjuster is reviewing the repair estimate.",
        email: "alex@example.com",
        bankAccount: "GB33BUKB20201555555555",
        adjusterNotes: "Customer reported a prior claim in 2024."
    },
    "CLM-20871": {
        claimId: "CLM-20871",
        policyholderId: "PH-002",
        status: "APPROVED",
        amountClaimed: 420.00,
        lastUpdated: "2026-09-28",
        nextStep: "Payment is scheduled within five business days.",
        email: "sam@example.com",
        bankAccount: "GB94BARC10201530093459",
        adjusterNotes: "No issues."
    }
};

service /api on new http:Listener(claimsApiPort) {
    resource function get policyholders/[string policyholderId]/claims/[string claimId](
            @http:Header string? authorization) returns Claim|http:Unauthorized|http:NotFound {
        if authorization != string `Bearer ${claimsReadToken}` {
            return <http:Unauthorized>{body: {message: "Invalid token for reading claims"}};
        }
        return findClaim(policyholderId, claimId) ?: <http:NotFound>{body: {message: string `Claim ${claimId} was not found.`}};
    }

    resource function post policyholders/[string policyholderId]/claims/[string claimId]/callbacks(
            @http:Header string? authorization, record {|CallbackWindow window;|} request)
            returns Callback|http:Unauthorized|http:NotFound {
        if authorization != string `Bearer ${callbackWriteToken}` {
            return <http:Unauthorized>{body: {message: "Invalid token for booking callbacks"}};
        }
        if findClaim(policyholderId, claimId) is () {
            return <http:NotFound>{body: {message: string `Claim ${claimId} was not found.`}};
        }
        return {callbackId: string `CB-${claimId.substring(4)}`, claimId, window: request.window};
    }
}

// Returns the claim only if it belongs to the policyholder.
isolated function findClaim(string policyholderId, string claimId) returns Claim? {
    lock {
        Claim? claim = claims[claimId];
        if claim is Claim && claim.policyholderId == policyholderId {
            return claim.clone();
        }
        return;
    }
}
```

## Test the integration

The security and privacy controls of the sample are deterministic, so they can be tested without calling the model. The tests start the service and the mock claims API on separate ports, and use a key pair to sign test tokens.

> **Info:** For more information, see [Test Ballerina code](/learn/test-ballerina-code/test-a-simple-function/).

Create the key pair in the `tests/resources` directory.

```
$ mkdir -p tests/resources
$ openssl req -x509 -newkey rsa:2048 -nodes -keyout tests/resources/private.key \
    -out tests/resources/public.crt -days 365 -subj "/CN=test-idp"
```

Create a `tests/Config.toml` file. The module-level model provider is initialized when the tests run, so a placeholder key is enough.

```toml
openAiApiKey = "test-key"

tokenIssuer = "https://idp.example.com"
tokenAudience = "claims-assistant"
issuerCertFile = "tests/resources/public.crt"

claimsReadToken = "test-read-token"
callbackWriteToken = "test-callback-token"

servicePort = 18480
claimsApiPort = 19490
claimsApiUrl = "http://localhost:19490/api"
```

Create a `tests/privacy_test.bal` file to test the redaction and the data minimization.

```ballerina
import ballerina/test;

@test:Config
function testEmailAndPhoneAreRedacted() {
    [string, int] [redacted, count] =
        redactPii("Reach me at alex@example.com or +44 20 7946 0958 about CLM-10234.");
    test:assertEquals(redacted, "Reach me at [EMAIL] or [PHONE_NUMBER] about CLM-10234.");
    test:assertEquals(count, 2);
}

@test:Config
function testCardNumberIsRedacted() {
    [string, int] [redacted, count] = redactPii("I paid with 4111 1111 1111 1111.");
    test:assertEquals(redacted, "I paid with [CARD_NUMBER].");
    test:assertEquals(count, 1);
}

@test:Config
function testMessageWithoutPiiIsUnchanged() {
    string message = "What is the status of CLM-10234?";
    test:assertEquals(redactPii(message), [message, 0]);
}

@test:Config
function testClaimSummaryExcludesSensitiveFields() {
    Claim claim = {
        claimId: "CLM-10234",
        policyholderId: "PH-001",
        status: "UNDER_REVIEW",
        amountClaimed: 1850.00,
        lastUpdated: "2026-10-02",
        nextStep: "An adjuster is reviewing the repair estimate.",
        email: "alex@example.com",
        bankAccount: "GB33BUKB20201555555555",
        adjusterNotes: "Internal note."
    };
    map<json> summary = <map<json>>toClaimSummary(claim).toJson();
    test:assertEquals(summary.keys(), ["claimId", "status", "amountClaimed", "lastUpdated", "nextStep"]);
}
```

Create a `tests/tools_test.bal` file to test the tools against the mock claims API. The last test checks that the read-only credential cannot book a callback.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/test;

function contextFor(string policyholderId) returns ai:Context {
    ai:Context ctx = new;
    ctx.set(POLICYHOLDER_ID, policyholderId);
    return ctx;
}

@test:Config
function testGetOwnClaim() returns error? {
    ClaimSummary summary = check getClaimStatus(contextFor("PH-001"), "CLM-10234");
    test:assertEquals(summary.status, "UNDER_REVIEW");
}

@test:Config
function testClaimOfAnotherPolicyholderIsNotReturned() {
    ClaimSummary|error result = getClaimStatus(contextFor("PH-001"), "CLM-20871");
    test:assertTrue(result is error);
    if result is error {
        test:assertEquals(result.message(), "Claim CLM-20871 was not found.");
    }
}

@test:Config
function testInvalidClaimIdIsRejected() {
    test:assertTrue(getClaimStatus(contextFor("PH-001"), "10234") is error);
}

@test:Config
function testRequestCallback() returns error? {
    Callback callback = check requestCallback(contextFor("PH-001"), "CLM-10234", MORNING);
    test:assertEquals(callback, {callbackId: "CB-10234", claimId: "CLM-10234", window: MORNING});
}

@test:Config
function testReadCredentialCannotBookCallbacks() returns error? {
    http:Response response =
        check claimsReader->/policyholders/["PH-001"]/claims/["CLM-10234"]/callbacks.post({window: MORNING});
    test:assertEquals(response.statusCode, http:STATUS_UNAUTHORIZED);
}
```

Create a `tests/service_test.bal` file to test the authentication, the scope check, the request validation, and the detection of model connection failures.

```ballerina
import ballerina/ai;
import ballerina/http;
import ballerina/jwt;
import ballerina/test;

final http:Client assistant = check new ("http://localhost:18480/assistant");

function issueToken(string scope, string audience = "claims-assistant") returns string|error {
    return jwt:issue({
        issuer: "https://idp.example.com",
        audience,
        username: "PH-001",
        customClaims: {scope},
        signatureConfig: {config: {keyFile: "tests/resources/private.key"}}
    });
}

@test:Config
function testRequestWithoutTokenIsRejected() returns error? {
    http:Response response = check assistant->/chat.post({sessionId: "s1", message: "Hi"});
    test:assertEquals(response.statusCode, http:STATUS_UNAUTHORIZED);
}

@test:Config
function testTokenForAnotherAudienceIsRejected() returns error? {
    string token = check issueToken("claims:assist", "another-api");
    http:Response response = check assistant->/chat.post({sessionId: "s1", message: "Hi"},
        {"Authorization": "Bearer " + token});
    test:assertEquals(response.statusCode, http:STATUS_UNAUTHORIZED);
}

@test:Config
function testTokenWithoutScopeIsForbidden() returns error? {
    string token = check issueToken("profile");
    http:Response response = check assistant->/chat.post({sessionId: "s1", message: "Hi"},
        {"Authorization": "Bearer " + token});
    test:assertEquals(response.statusCode, http:STATUS_FORBIDDEN);
}

@test:Config
function testAuthorizedInvalidRequestIsRejectedBeforeTheModelIsCalled() returns error? {
    string token = check issueToken("claims:assist");
    http:Response response = check assistant->/chat.post({sessionId: "s1", message: "   "},
        {"Authorization": "Bearer " + token});
    test:assertEquals(response.statusCode, http:STATUS_BAD_REQUEST);
}

@test:Config
function testModelConnectionFailureIsDetected() {
    ai:Error err = error ai:Error("Unable to obtain valid answer from the agent",
        steps = [error ai:LlmConnectionError("Error while connecting to the model")]);
    test:assertTrue(isModelUnavailable(err));
    test:assertFalse(isModelUnavailable(error ai:Error("Unable to obtain valid answer from the agent", steps = [])));
}
```

Run the tests.

```
$ bal test
```

```
Running Tests

	claims_assistant
		[pass] testAuthorizedInvalidRequestIsRejectedBeforeTheModelIsCalled
		[pass] testCardNumberIsRedacted
		[pass] testClaimOfAnotherPolicyholderIsNotReturned
		[pass] testClaimSummaryExcludesSensitiveFields
		[pass] testEmailAndPhoneAreRedacted
		[pass] testGetOwnClaim
		[pass] testInvalidClaimIdIsRejected
		[pass] testMessageWithoutPiiIsUnchanged
		[pass] testModelConnectionFailureIsDetected
		[pass] testReadCredentialCannotBookCallbacks
		[pass] testRequestCallback
		[pass] testRequestWithoutTokenIsRejected
		[pass] testTokenForAnotherAudienceIsRejected
		[pass] testTokenWithoutScopeIsForbidden

		14 passing
		0 failing
		0 skipped
```

## Run the integration

Start Jaeger as described in the [prerequisites](#set-up-the-prerequisites). Then, in the `Config.toml` file, set your OpenAI API key. The mock claims API accepts the tool tokens that you configure, so any values work for `claimsReadToken` and `callbackWriteToken`, as long as they are different.

Execute the command below to run the service.

```
$ bal run
```

You view the output below.

```
Compiling source
        ballerina_tutorials/claims_assistant:0.1.0

Running executable

ballerina: started publishing traces to Otel on http://localhost:4317 [gRPC]
warning: [ballerina/http] HTTPS is recommended but using HTTP
warning: [ballerina/http] HTTPS is recommended but using HTTP
```

The warnings are printed because the listeners use HTTP. Configure TLS before you deploy the service.

## Try the integration

### Create a token

In production, the mobile app gets the token from your identity provider. To try the service locally, sign a token with the test key pair. The commands below create a token for the policyholder `PH-001` with the `claims:assist` scope, valid for 10 minutes.

```
$ b64() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
$ HEADER=$(printf '{"alg":"RS256","typ":"JWT"}' | b64)
$ PAYLOAD=$(printf '{"iss":"https://idp.example.com","aud":"claims-assistant","sub":"PH-001","scope":"claims:assist","exp":%d}' $(( $(date +%s) + 600 )) | b64)
$ SIGNATURE=$(printf '%s.%s' "$HEADER" "$PAYLOAD" | openssl dgst -sha256 -sign tests/resources/private.key | b64)
$ TOKEN="$HEADER.$PAYLOAD.$SIGNATURE"
```

### Send requests

Ask about a claim. The message contains an email address, which is redacted before the message is sent to the model. Because the answer is generated by an LLM, your results will differ.

```
$ curl -i -X POST http://localhost:8080/assistant/chat \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"sessionId": "s1", "message": "What is the status of CLM-10234? My email is alex@example.com"}'
HTTP/1.1 201 Created
...
{"message":"Your claim CLM-10234 is under review. An adjuster is reviewing the repair estimate."}
```

Ask about a claim that belongs to another policyholder. The tool returns `Claim CLM-20871 was not found.` to the model, and the model explains this to the user.

```
$ curl -X POST http://localhost:8080/assistant/chat \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"sessionId": "s1", "message": "And what about CLM-20871?"}'
```

Send a request without a token. It is rejected before the model is called.

```
$ curl -i -X POST http://localhost:8080/assistant/chat \
    -H "Content-Type: application/json" -d '{"sessionId": "s1", "message": "Hi"}'
HTTP/1.1 401 Unauthorized
...
```

### View the traces

Open the Jaeger UI at <a href="http://localhost:16686" target="_blank">http://localhost:16686</a>, select the `/assistant` service, and find the traces. Open the trace of the first request and check the following:

- The `invoke_agent Claims Assistant` span has the redacted message in `gen_ai.input.messages`. It contains `[EMAIL]` instead of the email address.
- Each `chat gpt-4o` span has the `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens` attributes and its duration.
- The `execute_tool getClaimStatus` span has the tool arguments and the `ClaimSummary` result, without the bank account and the adjuster notes.
- The `post /chat` span has the `claims.redacted_values` attribute set to `1`.

To see how a failure appears in a trace, stop the service, set `openAiApiKey` to an invalid value, run the service, and send the first request again. The service returns `503 Service Unavailable`, and the `chat` and `invoke_agent` spans have an error status with the error message.

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Build an agent that uses enterprise systems](/learn/build-an-agent-that-uses-enterprise-systems/)
- [Connect integrations and agents through MCP](/learn/connect-integrations-and-agents-through-mcp/)
- [Add human approval and durable execution](/learn/add-human-approval-and-durable-execution/)
- [Evaluate agent behavior](/learn/evaluate-agent-behavior/)
- [Overview of Ballerina observability](/learn/overview-of-ballerina-observability/)
- [Observe tracing using Jaeger](/learn/supported-observability-tools-and-platforms/jaeger/)
- [Distributed tracing](/learn/by-example/tracing/) — Ballerina by Example
- [Sensitive data logging](/learn/by-example/sensitive-data-logging/) — Ballerina by Example
- [HTTP service - JWT authentication](/learn/by-example/http-service-jwt-authentication/) — Ballerina by Example
- [HTTP client - OAuth2 client credentials grant type](/learn/by-example/http-client-oauth2-client-credentials-grant-type/) — Ballerina by Example
- [Agent with local tools](/learn/by-example/ai-agent-local-tools/) — Ballerina by Example
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
