# Specification: Ballerina AuthZEN Library

_Owners_: @RDPerera \
_Reviewers_: @daneshk \
_Created_: 2026/10/28 \
_Updated_: 2026/10/28 \
_Edition_: Swan Lake

## Introduction

This is the specification for the AuthZEN library of the [Ballerina language](https://ballerina.io/), which provides a `Client` that acts as a Policy Enforcement Point (PEP) against any Policy Decision Point (PDP) that implements the [OpenID AuthZEN Authorization API 1.0](https://openid.net/specs/authorization-api-1_0.html) (Final, 11 January 2026).

The AuthZEN library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Client](#2-client)
    * 2.1 [Initializing the client](#21-initializing-the-client)
    * 2.2 [Authentication](#22-authentication)
    * 2.3 [Endpoint discovery](#23-endpoint-discovery)
3. [Information model](#3-information-model)
4. [Operations](#4-operations)
    * 4.1 [evaluate](#41-evaluate)
    * 4.2 [evaluateBatch](#42-evaluatebatch)
    * 4.3 [searchSubjects, searchResources and searchActions](#43-searchsubjects-searchresources-and-searchactions)
    * 4.4 [getMetadata](#44-getmetadata)
    * 4.5 [Request identification](#45-request-identification)
5. [Error handling](#5-error-handling)
6. [Conformance and known limitations](#6-conformance-and-known-limitations)

## 1. Overview

AuthZEN separates the PEP, which enforces access decisions, from the PDP, which makes them. The PEP describes an access request with four entities: the `subject` (who), the `action` (what), the `resource` (on what) and an optional `context` (the environment). The PDP answers with a decision.

The library implements the HTTPS JSON binding of AuthZEN (section 10.1). Every API is an HTTP `POST` of a JSON object to an endpoint of the PDP, except the PDP metadata, which is an HTTP `GET`. The default endpoint paths are:

| API | Default path | Operation |
|---|---|---|
| Access Evaluation | `/access/v1/evaluation` | `evaluate` |
| Access Evaluations | `/access/v1/evaluations` | `evaluateBatch` |
| Subject Search | `/access/v1/search/subject` | `searchSubjects` |
| Resource Search | `/access/v1/search/resource` | `searchResources` |
| Action Search | `/access/v1/search/action` | `searchActions` |
| PDP metadata | `/.well-known/authzen-configuration` (inserted after the host) | `getMetadata` |

The client is built from an OpenAPI description of the API (`docs/spec/openapi.yaml`, see `docs/spec/sanitations.md`) and a hand-written wrapper that implements the discovery, validation and authentication rules of AuthZEN.

## 2. Client

### 2.1 Initializing the client

```ballerina
public isolated function init(string serviceUrl, *ConnectionConfig config) returns error?
```

`serviceUrl` is the PDP URL, which is its `policy_decision_point` identifier, for example `https://pdp.example.com` or `https://pdp.example.com/tenant1`. A trailing slash is removed and the scheme is lower-cased. Initialization fails when the URL is not an `http` or `https` URL, or when it has a query or a fragment (section 9.1.1).

`ConnectionConfig` holds the authentication configuration (`auth`), the endpoint discovery flag (`discoverEndpoints`) and the standard HTTP client settings (HTTP version, timeout, retries, circuit breaker, pooling, redirects, cookies, compression, caching, proxy, response limits, socket settings and `secureSocket`).

```ballerina
authzen:Client pdp = check new ("https://pdp.example.com", auth = {token: accessToken}, timeout = 10);
```

### 2.2 Authentication

AuthZEN leaves the authentication of the PEP out of scope, recommends OAuth 2.0, and names mutual TLS, OAuth and API keys as options (section 11.2). `auth` is optional and is one of:

* `http:ClientAuthConfig`: a Bearer token, HTTP Basic auth, a self-signed JWT, or an OAuth 2.0 grant (client credentials, password, refresh token or JWT bearer). OAuth 2.0 tokens are fetched and refreshed by the HTTP client.
* `ApiKeyConfig`: an API key sent as the full value of a header, `Authorization` by default or the header named in `headerName`. Initialization fails when `headerName` is empty.

Mutual TLS is configured with `secureSocket`. Without `auth`, requests are sent without credentials, for a PDP that doesn't authenticate its callers.

### 2.3 Endpoint discovery

By default, each operation calls the default path of its API under the PDP URL.

When `discoverEndpoints` is `true`, the client reads the PDP metadata during initialization (see [4.4](#44-getmetadata)) and sends each operation to the endpoint the PDP advertises for it (section 10.1). Initialization fails when the metadata can't be read or names another PDP. An operation whose endpoint the metadata doesn't advertise returns an error without calling the PDP, as AuthZEN states that the PDP doesn't support that API (section 9.1.1).

Initialization also fails when an advertised endpoint is not an absolute `http` or `https` URL, or when the PDP URL is `https` and an advertised endpoint is plain `http`: the client sends its credentials to every endpoint, so it doesn't follow a downgrade to cleartext. The error names the metadata parameter.

## 3. Information model

The records follow the AuthZEN information model (section 5). JSON members are snake_case on the wire and camelCase in Ballerina (for example `next_token` and `nextToken`).

| Record | Fields |
|---|---|
| `Subject` | `'type`, `id`, `properties?` |
| `Resource` | `'type`, `id`, `properties?` |
| `Action` | `name`, `properties?` |
| `Context` | an open record of environment attributes |
| `Decision` | `decision`, `context?` |
| `SubjectFilter`, `ResourceFilter` | `'type`, `id?`, `properties?` (the entity to search for) |
| `BatchEvaluationOptions` | `evaluationsSemantic?` (see [4.2](#42-evaluatebatch)), and any other option the PDP defines |
| `PageRequest` | `token?`, `'limit?` (non-negative), `properties?` |
| `PageResponse` | `nextToken`, `count?`, `total?`, `properties?` |

All records are open, so implementation-specific members can be sent, and members the PDP returns that AuthZEN doesn't define are kept rather than rejected (section 10.1.1).

## 4. Operations

### 4.1 evaluate

```ballerina
remote isolated function evaluate(EvaluationRequest request, RequestHeaders headers = {}) returns Decision|error
```

Asks whether the `subject` may perform the `action` on the `resource`, in the given `context` (section 6). A denied access returns a `Decision` whose `decision` is `false`, not an error.

### 4.2 evaluateBatch

```ballerina
remote isolated function evaluateBatch(BatchEvaluationRequest request, RequestHeaders headers = {})
        returns BatchEvaluationResponse|error
```

Evaluates several access requests in one call (section 7). The top-level `subject`, `action`, `resource` and `context` are defaults that each entry of `evaluations` may override.

`options` is a `BatchEvaluationOptions` record, sent as the `options` member. Its `evaluationsSemantic` field (the `evaluations_semantic` member, section 7.1.2.1) selects how the PDP runs the entries:

| `evaluationsSemantic` | Behaviour |
|---|---|
| `"execute_all"` (the default when the field is absent) | The PDP evaluates every entry and returns a decision for each, in request order. A failed entry is a decision of `false`, which may carry the reason in its `context`. |
| `"deny_on_first_deny"` | The PDP evaluates the entries in order and stops at the first deny or failure, like `&&`. The response ends with that decision. |
| `"permit_on_first_permit"` | The PDP evaluates the entries in order and stops at the first permit, like `\|\|`. The response ends with that decision. |

The field is typed as a union of the three strings, so other values are rejected at compile time. Other members of `options` are sent as given, for options a PDP defines.

```ballerina
authzen:BatchEvaluationResponse response = check pdp->evaluateBatch({
    subject: {'type: "user", id: "alice@example.com"},
    action: {name: "can_read"},
    evaluations: [
        {'resource: {'type: "document", id: "1"}},
        {'resource: {'type: "document", id: "2"}}
    ],
    options: {evaluationsSemantic: "deny_on_first_deny"}
});
``` The response holds one decision per evaluated entry, in request order; with `deny_on_first_deny` and `permit_on_first_permit` the PDP stops early and returns fewer decisions than entries. A request without entries (or with an empty `evaluations` array) is a single evaluation, answered with a top-level `decision`.

### 4.3 searchSubjects, searchResources and searchActions

```ballerina
remote isolated function searchSubjects(SubjectSearchRequest request, RequestHeaders headers = {})
        returns SubjectSearchResponse|error
remote isolated function searchResources(ResourceSearchRequest request, RequestHeaders headers = {})
        returns ResourceSearchResponse|error
remote isolated function searchActions(ActionSearchRequest request, RequestHeaders headers = {})
        returns ActionSearchResponse|error
```

Find the subjects of a type that may perform an action on a resource, the resources of a type a subject may perform an action on, and the actions a subject may perform on a resource (section 8). The searched entity carries its type only. When a response holds a `page` with a non-empty `nextToken`, more results are available: the next page is requested by sending the token as `page.token`, with every other member of the request unchanged (section 8.2). An empty or absent `nextToken` means there are no more results; AuthZEN requires the member, but its own example response (Figure 19) omits it.

### 4.4 getMetadata

```ballerina
remote isolated function getMetadata() returns Metadata|error
```

Reads the PDP metadata (section 9). The URL is formed by inserting `/.well-known/authzen-configuration` between the host and the path of the PDP URL (section 9.2), so the metadata of `https://pdp.example.com/tenant1` is read from `https://pdp.example.com/.well-known/authzen-configuration/tenant1`. The operation returns an error when the `policy_decision_point` of the metadata is not the PDP URL of the client (section 9.2.3), ignoring a trailing slash on either side, which prevents PDP mix-up attacks. The request carries the configured credentials, as some PDPs protect their metadata.

### 4.5 Request identification

`RequestHeaders.requestId` is sent as the `X-Request-ID` header (section 10.1.3), which the PDP returns in its response.

## 5. Error handling

Operations return an error when the PDP can't evaluate the request or can't be reached:

* An HTTP `4xx` response returns an `http:ClientRequestError`, and a `5xx` response an `http:RemoteServerError`. The error detail holds the status code, the headers and the body, which AuthZEN defines as an error message string (section 10.1.2).
* A connection failure or timeout returns the corresponding `http:ClientError`.
* A response that can't be bound to the expected record, for example a negative `count`, returns a data binding or constraint validation error.
* The library errors described in sections 2 and 4 (an invalid PDP URL, an empty API key header name, metadata of another PDP, and an API the PDP doesn't advertise) return an `error` with a message that names the problem.

## 6. Conformance and known limitations

* `signed_metadata` is returned in `Metadata.signedMetadata` but not verified, which AuthZEN allows a PEP to do (section 9.1.3). Its values must not be trusted over the plain values without verifying it.
* The `policy_decision_point` comparison (section 9.2.3) ignores a trailing slash and the case of the scheme on either side, where AuthZEN requires the values to be identical.
* Plain `http` PDP URLs are accepted, for development PDPs, although AuthZEN identifiers use `https` (section 9.1.1). Over `http`, the metadata and the requests can be read and changed in transit.
* The library doesn't check that the PDP returns the `X-Request-ID` it was sent.
* Request records are not validated before they are sent; the PDP returns `400` for a malformed request (section 10.1.1).
* Only the HTTPS JSON binding is implemented. Other transport bindings, such as gRPC, are not.
