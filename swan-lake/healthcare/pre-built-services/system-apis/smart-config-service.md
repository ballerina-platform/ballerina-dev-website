---
title: FHIR R4 smart configuration service
description: This service provides the API implementation of the SMART configuration API of an FHIR server.
keywords: healthcare, pre-built service, smart configuration
permalink: /learn/smart-config-service/
active: smart-config-service
intro: This service provides the API implementation of the SMART configuration API of an FHIR server.
---

<a target="_blank" href="https://www.hl7.org/fhir/smart-app-launch/#discovery-of-server-capabilities-and-configuration">SMART</a> defines a discovery document available at the `.well-known/smart-configuration` relative to an FHIR server base URL, allowing clients to learn the authorization endpoint URLs and features a server supports. This information helps clients to direct authorization requests to the right endpoint and construct an authorization request that the server can support.

> **Note:** This supports the FHIR version 4.0.1.

## Run the pre-built service

Follow the steps below to run an EHR connectivity pre-built service.

1. Clone the [`open-healthcare-prebuilt-services`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main) GitHub repository.

2. Navigate to the `metadata-fhirr4-service` directory, which has the pre-built service.

3. Configure the `Config.toml` file with the required [configurations](#define-configurations).

4. Run the project.

    ```
    $ bal run
    ```

5. Invoke the API by sending the sample request below to get the FHIR Capability Statement.

    ```
    $ curl 'http://<host>:<port>/.well-known/smart-configuration'
    ```

## Deploy in WSO2 Choreo

<a target="_blank" href="https://www.hl7.org/fhir/http.html#capabilities">WSO2 Choreo</a> is an internal developer platform that redefines how you create digital experiences. You can deploy this FHIR R4 metadata pre-built service in Choreo as follows. 

### Set up the prerequisites

If you are signing in to the Choreo Console for the first time, create an organization as follows.

1. Sign in to the <a target="_blank" href="https://console.choreo.dev/">Choreo Console</a> using your preferred method.

2. Enter a unique organization name (e.g., Stark Industries).

3. Read and accept the privacy policy and terms of use.

4. Click **Create**. 

This creates the organization and opens the home page of the default project created for you.

### Create the service component

Follow the steps below to create the service component in Choreo.

1. Fork the <a target="_blank" href="https://github.com/wso2/open-healthcare-prebuilt-services">pre-built Ballerina services repository</a> to your GitHub organization.

2. Create and configure a service component pointing to the `smart-config-fhirr4-service`. 

    > **Info:** For instructions, see <a target="_blank" href="https://wso2.com/choreo/docs/develop-components/develop-services/develop-a-ballerina-rest-api/#step-1-create-a-service-component">Create a service component</a>

3. Click **Create**. 

Once the component creation is complete, you will see the component overview page.

### Define configurations

Configure the deployment configurables in **Configurations/Configs** using the Choreo configurable editor as described below.

| Configuration                       | Description                                                                                                                                                                                                                                     | Example                                                                                                                                                                                                                     |
|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `DiscoveryEndpoint`                 | It is recommended to have a URL to a server’s OpenID configuration.                                                                                                                                                                             | https://api.asgardeo.io/t/<organization_name>/oauth2/token/.well-known/openid-configuration                                                                                                                                 |
| `issuer`                            | String conveying this system’s OpenID Connect Issuer URL. Required if the server’s capabilities include sso-openid-connect; otherwise, omitted. Adding this is conditional.                                                                     | https://api.asgardeo.io/t/<organization_name>/oauth2/token                                                                                                                                                                  |
| `jwksUri`                           | String conveying this system’s JSON Web Key Set URL. Required if the server’s capabilities include sso-openid-connect; otherwise, optional. Adding this is conditional.                                                                         | https://api.asgardeo.io/t/<organization_name>/oauth2/jwks                                                                                                                                                                   |
| `authorizationEndpoint`             | URL to the OAuth2 authorization endpoint. This is required.                                                                                                                                                                                     | https://api.asgardeo.io/t/<organization_name>/oauth2/authorize                                                                                                                                                              |
| `grantTypesSupported`               | Array of grant types supported at the token endpoint. The options are `authorization_code` (when SMART App Launch is supported) and `client_credentials` (when SMART Backend Services is supported). This is required.                          | `authorization_code`, `client_credential`                                                                                                                                                                                   |
| `tokenEndpoint`                     | URL to the OAuth2 token endpoint. This is required.                                                                                                                                                                                             | https://api.asgardeo.io/t//oauth2/token                                                                                                                                                                                     |
| `tokenEndpointAuthMethodsSupported` | Array of client authentication methods supported by the token endpoint. The options are `client_secret_post`, `client_secret_basic`, and `private_key_jwt`.                                                                                     | `client_secret_basic`, `private_key_jw`                                                                                                                                                                                     |
| `registrationEndpoint`              | If available, URL to the OAuth2 dynamic registration endpoint for this FHIR server. This is optional.                                                                                                                                           | https://api.asgardeo.io/t/<organization_name>/oauth2/register                                                                                                                                                               |
| `scopesSupported`                   | It is recommended to have an array of scopes a client may request. See scopes and launch context. The server SHALL support all scopes listed here; additional scopes MAY be supported (so clients should not consider this an exhaustive list). | `openid`, `profile`, `launch`, `launch/patient`, `patient/*.rs`, `user/*.rs`, `offline_access`                                                                                                                              |
| `responseTypesSupported`            | It is recommended to have an array of OAuth2 `response_type` values that are supported. Implementers can refer to the `response_types` defined in OAuth 2.0 (RFC 6749) and in OIDC Core.                                                        | `code`                                                                                                                                                                                                                      |
| `managementEndpoint`                | It is recommended to have a URL in which an end-user can view which applications currently have access to data and can make adjustments to these access rights.                                                                                 | https://api.asgardeo.io/t/<organization_name>/oauth2/manage                                                                                                                                                                 |
| `introspectionEndpoint`             | It is recommended to have a URL to a server’s introspection endpoint that can be used to validate a token.                                                                                                                                      | https://api.asgardeo.io/t/<organization_name>/oauth2/introspect                                                                                                                                                             |
| `revocationEndpoint`                | It is recommended to have a URL to a server’s revoke endpoint that can be used to revoke a token.                                                                                                                                               | https://api.asgardeo.io/t/<organization_name>/oauth2/revoke                                                                                                                                                                 |
| `capabilities`                      | Array of strings representing SMART capabilities (e.g., `sso-openid-connect` or `launch-standalone`) that the server supports. This is required.                                                                                                | `launch-ehr`, `permission-patient`, `permission-v2`, `client-public`, `client-confidential-symmetric`, `context-ehr-patient`, `sso-openid-connect`, `launch-standalone`, `context-standalone-patient`, `permission-offline` |
| `codeChallengeMethodsSupported`     | Array of PKCE code challenge methods supported. The S256 method SHALL be included in this list, and the plain method SHALL NOT be included in this list. This is required.                                                                      | `S256`                                                                                                                                                                                                                      |

Below is a sample `Config.toml` file consisting of the above configurations.

```toml
    [configs]
    discoveryEndpoint = "https://api.asgardeo.io/t/bifrost/oauth2/token/.well-known/openid-configuration"

    [configs.smartConfiguration]
    tokenEndpoint = "<TOKEN_ENDPOINT>"
    introspectionEndpoint = "<INTROSPECTION_ENDPOINT>"
    codeChallengeMethodsSupported = ["S256"]
    grantTypesSupported = ["authorization_code"]
    revocationEndpoint = "<REVOCATION_ENDPOINT>"
    tokenEndpointAuthMethodsSupported = ["private_key_jwt", "client_secret_basic"]
    tokenEndpointAuthSigningAlgValuesSupported = ["RS384","ES384"]
    scopesSupported = [
        "openid",
        "fhirUser",
        "launch",
        "launch/patient",
        "patient/*.cruds",
        "user/*.cruds",
        "offline_access",
    ]
    responseTypesSupported = [
        "code",
        "id_token",
        "token",
        "device",
        "id_token token"
    ]
    capabilities = [
        "launch-ehr",
        "launch-standalone",
        "client-public",
        "client-confidential-symmetric",
        "client-confidential-asymmetric",
        "context-passthrough-banner",
        "context-passthrough-style",
        "context-ehr-patient",
        "context-ehr-encounter",
        "context-standalone-patient",
        "context-standalone-encounter",
        "permission-offline",
        "permission-patient",
        "permission-user",
        "permission-v2",
        "authorize-post"
    ]
```
