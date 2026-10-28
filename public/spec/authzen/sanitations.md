_Author_:  Dilan Perera \
_Created_: 2026/10/28 \
_Updated_: 2026/10/28 \
_Edition_: Swan Lake

# Sanitation for OpenAPI specification

This document records the sanitation done on top of the AuthZEN OpenAPI specification.
The OpenID Foundation publishes the [Authorization API 1.0](https://openid.net/specs/authorization-api-1_0.html) (Final,
11 January 2026) as a document, not as a machine-readable specification. The source specification
(`authzen-openapi.yaml`) was written from that document for the WSO2 Micro Integrator connector generator. It was
checked against every section of the AuthZEN document: the endpoints, the required members of each entity, the
paging members, the metadata parameters and the error status codes all match.
These changes are done in order to improve the overall usability, and as workarounds for some known language limitations.

1. Send the request bodies as plain objects
- **Original**: Each request body was a single-entry `oneOf` (for example `oneOf: [$ref: EvaluationRequest]`).
- **Updated**: Each request body is a plain `$ref` to its schema.
- **Reason**: The `oneOf` worked around the Micro Integrator generator, which turns the properties of a plain object
  body into string parameters. `bal openapi` generates a typed record for a plain `$ref`.

2. Authenticate with Bearer tokens and OAuth 2.0
- **Original**: A single `apiKey` scheme on the `Authorization` header, holding the full header value.
- **Updated**: An HTTP `bearer` scheme and an `oauth2` scheme (client credentials flow).
- **Reason**: The `apiKey` scheme worked around Micro Integrator generator limitations with `http basic`, `http bearer`
  and `oauth2`. AuthZEN leaves PEP authentication open and recommends OAuth 2.0. The hand-written client (step 7)
  accepts any Ballerina HTTP client auth configuration and an API key in any header, so it is not limited to these
  two schemes.

3. Add the `X-Request-ID` request header
- **Original**: `X-Request-ID` was documented as a response header only.
- **Updated**: Added an optional `X-Request-ID` header parameter (`x-ballerina-name: requestId`) to the five `POST`
  operations.
- **Reason**: AuthZEN (section 10.1.3) has the PEP send the request identifier and the PDP echo it. The original spec
  left it out because the Micro Integrator generator sends header parameters as literal text.

4. Use camelCase field names
- **Original**: The AuthZEN members `next_token`, `evaluations_semantic`, `policy_decision_point`,
  `access_evaluation_endpoint`, `access_evaluations_endpoint`, `search_subject_endpoint`, `search_resource_endpoint`,
  `search_action_endpoint` and `signed_metadata` had no Ballerina names.
- **Updated**: Added `x-ballerina-name` with the camelCase name of each (`nextToken`, `evaluationsSemantic`,
  `policyDecisionPoint` and so on).
- **Reason**: Generates idiomatic field names. The JSON member names on the wire are unchanged
  (`@jsondata:Name`).

5. Rename operations and schemas
- **Original**: The operationIds `evaluation`, `evaluations`, `searchSubject`, `searchResource` and `searchAction`,
  and the schemas `EvaluationResponse`, `EvaluationsRequest`, `EvaluationsResponse`, `EvaluationItem` and
  `EvaluationsOptions`.
- **Updated**: The operationIds `evaluate`, `evaluateBatch`, `searchSubjects`, `searchResources` and `searchActions`,
  and the schemas `Decision`, `BatchEvaluationRequest`, `BatchEvaluationResponse`, `BatchEvaluationItem` and
  `BatchEvaluationOptions`.
- **Reason**: `evaluation` and `evaluations` differ by one letter, which is easy to misread in code. Verb names say
  what each operation does, and the search operations return lists. `Decision` is the name AuthZEN gives the
  response entity (section 5.5).

6. Rewrite descriptions and simplify error responses
- **Original**: `info.description` held usage notes for Micro Integrator (payload mediators, how to set the header).
  Several fields had no description. Error responses offered both a `text/plain` and an `application/json` body.
- **Updated**: Replaced `info.description` with a summary of the API, added user-facing descriptions to all fields,
  and kept the `text/plain` error body that AuthZEN defines (section 10.1.2).
- **Reason**: The descriptions become the doc comments of the generated types and functions.

7. Accept a search page without `next_token`
- **Original**: `PageResponse` required `next_token`.
- **Updated**: `next_token` is optional, and an absent `next_token` means there are no more results.
- **Reason**: AuthZEN section 8.2.2 requires `next_token` in a `page` object, but its own example search response
  (Figure 19, section 8.3) has a `page` without it, and PDPs follow the example. With the member required, the
  results of such a response are lost to a data binding error.

## OpenAPI cli command

The following command generates the raw OpenAPI-derived client. The command should be executed from the repository root directory.

```bash
bal openapi -i docs/spec/openapi.yaml -o <temporary-directory> --mode client --license docs/license.txt --client-methods remote
```

Note: The license year is hardcoded to 2026, change if necessary.

Generate into a temporary directory, not into `ballerina`: the generated `client.bal` would overwrite the hand-written
client.

### Post-generation steps

1. Copy the generated `types.bal` to `ballerina/types.bal`, and remove the generated `ConnectionConfig` and
   `OAuth2ClientCredentialsGrantConfig` records from it. The hand-written client defines its own `ConnectionConfig`.
2. Copy the generated `client.bal` to `ballerina/oas_client.bal`, and in it:
   - `# <API description>` + `public isolated client class Client {` → `isolated client class GeneratedClient {`
   - Replace the generated `init` with one that takes the HTTP client configuration directly:

     ```ballerina
     isolated function init(http:ClientConfiguration config, string serviceUrl) returns error? {
         self.clientEp = check new (serviceUrl, config);
     }
     ```
3. Don't copy the generated `utils.bal`. It holds only `getEncodedUri`, which is unused because the API has no path
   or query parameters.

`ballerina/client.bal` is a hand-written wrapper around `GeneratedClient` (see step 7 below) and defines the public
`Client`, `ConnectionConfig`, `ApiKeyConfig` and `RequestHeaders`. It is intentionally **not** regenerated.

8. Follow AuthZEN discovery and authentication rules in a hand-written client
- **Change**: `ballerina/client.bal` is a hand-written wrapper (not generated) around the OpenAPI-generated
  `GeneratedClient`.
- **Metadata URL**: AuthZEN publishes the metadata at a URL formed by inserting `/.well-known/authzen-configuration`
  between the host and the path of the PDP identifier (section 9.2), so the metadata of
  `https://pdp.example.com/tenant1` is at `https://pdp.example.com/.well-known/authzen-configuration/tenant1`. The
  generated `getMetadata` appends the path to the base URL instead, which is only right for a PDP at a bare host. The
  wrapper builds the URL as AuthZEN defines it.
- **Metadata validation**: AuthZEN requires the PEP to discard metadata whose `policy_decision_point` is not the PDP
  identifier it was read from (section 9.2.3), which prevents PDP mix-up attacks. `getMetadata` returns an error in
  that case. A trailing slash is ignored on both sides. The metadata request carries the configured credentials, as
  some PDPs protect their metadata, although the specification marks the endpoint as not requiring authentication.
- **Endpoint discovery**: AuthZEN requires the request URL to be the endpoint the PDP advertises in its metadata, when
  the PEP uses the metadata (section 10.1). With `discoverEndpoints` set, the client reads the metadata at
  initialization and sends each operation to the advertised endpoint: through `GeneratedClient` when the endpoint is
  the default path under the PDP URL, and through an HTTP client on the endpoint URL otherwise. An operation whose
  endpoint the PDP doesn't advertise fails without a call, as AuthZEN says the PDP doesn't support that API. An
  advertised endpoint must be an absolute `http` or `https` URL, and an `https` PDP must not advertise a plain `http`
  endpoint, as the client sends its credentials to every endpoint. Initialization fails otherwise, naming the
  metadata parameter. The
  client doesn't verify `signed_metadata`, which AuthZEN allows a PEP to ignore (section 9.1.3).
- **Authentication**: The PDP may not authenticate its callers, or authenticate them in any way (section 11.2 names
  mutual TLS, OAuth and API keys). `auth` is optional and takes any `http:ClientAuthConfig` (Bearer token, Basic auth,
  self-signed JWT and the OAuth 2.0 grants) or an `ApiKeyConfig`, which sends a key in the `Authorization` header or a
  custom header. Mutual TLS is set with `secureSocket`.
- **PDP URL**: `serviceUrl` is required, as it is the PDP identifier. A trailing slash is removed, the scheme is
  lower-cased, and a URL that is not `http` or `https`, or that has a query or fragment, is rejected (section 9.1.1).
  Plain `http` is accepted for development PDPs, although AuthZEN identifiers use `https`.
- **One header type**: The generator creates a separate but identical header record for each operation. The wrapper
  takes a single `RequestHeaders` record in all of them. The generated per-operation header records are still public
  in `types.bal`, as the generated client's remote methods use them.
