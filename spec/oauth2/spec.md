# Specification: Ballerina OAuth2 Library

_Owners_: @ldclakmal @shafreenAnfar  
_Reviewers_: @shafreenAnfar  
_Created_: 2021/10/01  
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction
This is the specification for the OAuth2 standard library of [Ballerina language](https://ballerina.io/), which is used for authorization of listeners and clients (HTTP, gRPC, GraphQL, WebSocket, WebSub, etc.).

The OAuth2 library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [OAuth2](#2-oauth2)
3. [Listener Auth](#3-listener-auth)
    * 3.1. [OAuth2 Provider](#31-oauth2-provider)
    * 3.2. [OAuth2 Handler](#32-oauth2-handler)
    * 3.3. [Declarative Approach](#33-declarative-approach)
    * 3.4. [Imperative Approach](#34-imperative-approach)
4. [Client Auth](#4-client-auth)
    * 4.1. [OAuth2 Provider](#41-oauth2-provider)
    * 4.2. [OAuth2 Handler](#42-oauth2-handler)
        * 4.2.1. [Bearer Token](#421-bearer-token)
        * 4.2.2. [Grant Types](#422-grant-types)
    * 4.3. [Declarative Approach](#43-declarative-approach)
    * 4.4. [Imperative Approach](#44-imperative-approach)
5. [Samples](#5-samples)
    * 5.1. [Listener Auth](#51-listener-auth)
        * 5.1.1. [Declarative Approach (HTTP Listener)](#511-declarative-approach-http-listener)
        * 5.1.2. [Imperative Approach (HTTP Listener)](#512-imperative-approach-http-listener)
    * 5.2. [Client Auth](#52-client-auth)
        * 5.2.1. [Declarative Approach (HTTP Client)](#521-declarative-approach-http-client)
            * 5.2.1.1. [Bearer Token](#5211-bearer-token)
            * 5.2.1.2. [Grant TypesT](#5212-grant-types)
        * 5.2.2. [Imperative Approach (HTTP Client)](#522-imperative-approach-http-client)
            * 5.2.2.1. [Bearer Token](#5221-bearer-token)
            * 5.2.2.2. [Grant Types](#5222-grant-types)

## 1. Overview
This specification elaborates on OAuth2 authorization for all the Ballerina listeners and
clients. The HTTP, gRPC, GraphQL, WebSocket, WebSub protocol-based listeners and clients are secured according to this
specification.

This has a number of design principles:
- **Listener auth**: This refers to the authentication and authorization of the listener as defined in
  [Ballerina 2021R1 Section 5.7.4](https://ballerina.io/spec/lang/2021R1/#section_5.7.4). The inbound requests/messages
  independent of the transport protocol are authenticated and authorized according to the configured authentication
  protocol and related configurations.
- **Client auth**: This refers to the authentication of the client as defined in
  [Ballerina 2021R1 Section 7.9](https://ballerina.io/spec/lang/2021R1/#section_7.9). The outbound requests/messages
  independent of the transport protocol are enriched according to the configured authentication protocol and related
  configurations.
- **Auth provider**: This is the entity that is responsible for providing all the auth protocol-related implementations.
- **Auth handler**: This is the entity that is responsible for handling the security of the API based on the transport
  protocol and with the use of provider APIs. This API gets the credentials and required configurations as user inputs
  and returns the authentication protocol-related information. Internally, these APIs call the provider APIs of the
  relevant authentication protocol.
- **Declarative approach**: This is also known as the configuration-driven approach, which is used for simple use cases,
  where users have to provide a set of configurations and do not need to be worried more about how authentication and
  authorization works.
- **Imperative approach**: This is also known as the code-driven approach, which is used for advanced use cases, where
  users need to be worried more about how authentication and authorization work and need to have further customizations.

## 2. OAuth2
OAuth2 protocol defines the credential as an access token which is defined in 
[RFC6749 Section 1.4](https://datatracker.ietf.org/doc/html/rfc6749#section-1.4).

## 3. Listener Auth
This refers to the authentication and authorization of the listener as defined in
[Ballerina 2021R1 Section 5.7.4](https://ballerina.io/spec/lang/2021R1/#section_5.7.4). The inbound requests/messages
independent of the transport protocol are authenticated and authorized according to the configured authentication
protocol and related configurations.

### 3.1. OAuth2 Provider
The OAuth2 Provider has an API to authorize the OAuth2 credential. The `IntrospectionConfig` record is used to provide 
the configuration related to the introspection server which is being called at the time of credential validation. This 
returns the `IntrospectionResponse` which consists of all the available information of the introspection server response.

```ballerina
import ballerina/cache;

public type IntrospectionConfig record {
    string url;
    string tokenTypeHint?;
    map<string> optionalParams?;
    cache:CacheConfig cacheConfig?;
    decimal defaultTokenExpTime = 3600;
    ClientConfiguration clientConfig = {};
};

public type IntrospectionResponse record {
    boolean active;
    string scope?;
    string clientId?;
    string username?;
    string tokenType?;
    int exp?;
    int iat?;
    int nbf?;
    string sub?;
    string aud?;
    string iss?;
    string jti?;
};

public class ListenerOAuth2Provider {

    public function init(IntrospectionConfig config) {
        // init OAuth2 provider
    }

    public function authorize(string credential, map<string>? optionalParams = ()) returns IntrospectionResponse|Error {
        // validate the credential against introspection endpoint
    }
}
```

### 3.2. OAuth2 Handler

> **NOTE**: Since the auth handlers are tightly bound with the transport protocol, for the explanation of the concept,
> all the samples are created for HTTP transport protocol hereinafter.

The OAuth2 Handler has an API to authorize the HTTP request, headers of the HTTP request, or the credential as defined 
in [RFC6750 Section 2.1](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1). This API is also used to authorize 
the user against the expected scope or scopes. The `OAuth2IntrospectionConfig` record is used to provide the 
configuration related to the introspection server which is being called at the time of credential validation along with 
the `scopeKey` which defines the claim used for scopes. This returns the `IntrospectionResponse` which consists of all 
the available information of the introspection server response or `Unauthorized` in case of authentication failure or 
`Forbidden` in case of authorization failure.

```ballerina
import ballerina/oauth2;

public type OAuth2IntrospectionConfig record {|
    *oauth2:IntrospectionConfig;
    string scopeKey = "scope";
|};

public client class ListenerOAuth2Handler {

    private final oauth2:ListenerOAuth2Provider provider;

    public function init(OAuth2IntrospectionConfig config) {
        self.provider = new (config);
    }

    remote function authorize(Request|Headers|string data, string|string[]? expectedScopes = (), 
                  map<string>? optionalParams = ()) returns oauth2:IntrospectionResponse|Unauthorized|Forbidden {
        // extract the credential from data
        oauth2:IntrospectionResponse|oauth2:Error response = self.provider.authorize(credential, optionalParams);
        if (response is oauth2:Error) {
            // return `Unauthorized`
        }
        // match the scopes with the provided `expectedScopes`
        // if not matched return `Forbidden`
        return <oauth2:IntrospectionResponse>response;
    }
}
```

### 3.3. Declarative Approach
This is also known as the configuration-driven approach, which is used for simple use cases, where users have to
provide a set of configurations and do not need to be worried more about how authentication and authorization works.
The user does not have full control over the configuration-driven approach.

The service and/or resource configurations are used to define the authentication and authorization configurations.
Users can configure the configurations needed for different authentication schemes and configurations needed for
authorizations of each authentication scheme. Also, the configurations can be provided at both the service and resource
levels. The priority will be given from bottom to top. Then, the auth handler creation and request
authentication/authorization is handled internally without user intervention. The requests that succeeded both
authentication and/or authorization phases according to the configurations will be passed to the business logic layer.

### 3.4. Imperative Approach
This is also known as the code-driven approach, which is used for advanced use cases, where users need to be worried
more about how authentication and authorization work and need to have further customizations. The user has full control
of the code-driven approach. The handler creation and authentication/authorization calls are made by the user at the
business logic layer.

## 4. Client Auth
This refers to the authentication of the client as defined in
[Ballerina 2021R1 Section 7.9](https://ballerina.io/spec/lang/2021R1/#section_7.9). The outbound requests/messages
independent of the transport protocol are enriched according to the configured authentication protocol and related
configurations.

### 4.1. OAuth2 Provider
The OAuth2 Provider has an API to generate the OAuth2 credential. The `ClientCredentialsGrantConfig`, 
`PasswordGrantConfig`, `RefreshTokenGrantConfig`, or `JwtBearerGrantConfig` records are used to provide the 
configuration related to the OAuth2 grant type used for access token generation. This returns the generated access token.

```ballerina
public type ClientCredentialsGrantConfig record {|
    string tokenUrl;
    string clientId;
    string clientSecret;
    string[] scopes?;
    decimal defaultTokenExpTime = 3600;
    decimal clockSkew = 0;
    map<string> optionalParams?;
    CredentialBearer credentialBearer = AUTH_HEADER_BEARER;
    ClientConfiguration clientConfig = {};
|};

public type PasswordGrantConfig record {|
    string tokenUrl;
    string username;
    string password;
    string clientId?;
    string clientSecret?;
    string[] scopes?;
    record {|
        string refreshUrl;
        string[] scopes?;
        map<string> optionalParams?;
        CredentialBearer credentialBearer = AUTH_HEADER_BEARER;
        ClientConfiguration clientConfig = {};
    |} refreshConfig?;
    decimal defaultTokenExpTime = 3600;
    decimal clockSkew = 0;
    map<string> optionalParams?;
    CredentialBearer credentialBearer = AUTH_HEADER_BEARER;
    ClientConfiguration clientConfig = {};
|};

public type RefreshTokenGrantConfig record {|
    string refreshUrl;
    string refreshToken;
    string clientId;
    string clientSecret;
    string[] scopes?;
    decimal defaultTokenExpTime = 3600;
    decimal clockSkew = 0;
    map<string> optionalParams?;
    CredentialBearer credentialBearer = AUTH_HEADER_BEARER;
    ClientConfiguration clientConfig = {};
|};

public type JwtBearerGrantConfig record {|
    string tokenUrl;
    string assertion;
    string clientId?;
    string clientSecret?;
    string[] scopes?;
    decimal defaultTokenExpTime = 3600;
    decimal clockSkew = 0;
    map<string> optionalParams?;
    CredentialBearer credentialBearer = AUTH_HEADER_BEARER;
    ClientConfiguration clientConfig = {};
|};

public type GrantConfig ClientCredentialsGrantConfig|PasswordGrantConfig|RefreshTokenGrantConfig|JwtBearerGrantConfig;

public class ClientOAuth2Provider {

    public function init(GrantConfig config) {
        // init OAuth2 provider
    }

    public function generateToken() returns string|Error {
        // get the OAuth2 token by calling to IDP with given configurations
    }
}
```

### 4.2. OAuth2 Handler

> **NOTE**: Since the auth handlers are tightly bound with the transport protocol, for the explanation of the concept,
> all the samples are created for HTTP transport protocol hereinafter.

#### 4.2.1. Bearer Token
The Bearer Token Auth Handler has an API to enrich the HTTP request as defined in 
[RFC6750 Section 2.1](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1). The `BearerTokenConfig` record is 
used to provide the configuration related to the access token. This returns the enriched `Request` with headers or 
`Error` in case of failure.

```ballerina
public type BearerTokenConfig record {|
    string token;
|};

public class ClientBearerTokenAuthHandler {

    private final BearerTokenConfig & readonly config;

    public function init(BearerTokenConfig config) {
        self.config = config.cloneReadOnly();
    }

    public function enrich(Request req) returns Request|Error {
        // set the token as the `Authorization: Bearer <token>` header
    }
}
```

#### 4.2.2. Grant Types
The OAuth2 Handler has an API to enrich the HTTP request as defined in 
[RFC6750 Section 2.1](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1). The 
`OAuth2ClientCredentialsGrantConfig`, `OAuth2PasswordGrantConfig`, `OAuth2RefreshTokenGrantConfig`, or 
`OAuth2JwtBearerGrantConfig` records are used to provide the configuration related to the OAuth2 grant type used for 
access token generation. This returns the enriched `Request` with headers or `Error` in case of failure.

```ballerina
import ballerina/oauth2;

public type OAuth2GrantConfig OAuth2ClientCredentialsGrantConfig|OAuth2PasswordGrantConfig|
                              OAuth2RefreshTokenGrantConfig|OAuth2JwtBearerGrantConfig;

public type OAuth2ClientCredentialsGrantConfig record {|
    *oauth2:ClientCredentialsGrantConfig;
|};

public type OAuth2PasswordGrantConfig record {|
    *oauth2:PasswordGrantConfig;
|};

public type OAuth2RefreshTokenGrantConfig record {|
    *oauth2:RefreshTokenGrantConfig;
|};

public type OAuth2JwtBearerGrantConfig record {|
    *oauth2:JwtBearerGrantConfig;
|};

public client class ClientOAuth2Handler {

    private final oauth2:ClientOAuth2Provider provider;

    public function init(OAuth2GrantConfig config) {
        self.provider = new (config);
    }

    remote function enrich(Request req) returns Request|Error {
        string|oauth2:Error token = self.provider.generateToken();
        // set the token as the `Authorization: Bearer <token>` header
    }
}
```

### 4.3. Declarative Approach
This is also known as a configuration-driven approach, which is used for simple use cases, where users have to provide
a set of configurations and do not need to be worried more about how authentication works. The user does not have full
control over the configuration-driven approach.

The client configurations are used to define the authentication configurations. Users can configure the configurations
needed for different authentication schemes. Then, the auth handler creation and request enrichment is handled
internally without user intervention.

### 4.4. Imperative Approach
This is also known as the code-driven approach, which is used for advanced use cases, where users need to be worried
more about how authentication works and need to have further customizations. The user has full control of the
code-driven approach. The handler creation and request enrichment calls are made by the user at the business logic layer.

## 5. Samples

### 5.1. Listener Auth

#### 5.1.1. Declarative Approach (HTTP Listener)

```ballerina
import ballerina/http;

@http:ServiceConfig {
    auth: [
        {
            oauth2IntrospectionConfig: {
                url: "https://localhost:9445/oauth2/introspect",
                tokenTypeHint: "access_token",
                scopeKey: "scp",
                clientConfig: {
                    customHeaders: {"Authorization": "Basic YWRtaW46YWRtaW4="},
                    secureSocket: {
                        cert: "/path/to/public.crt"
                    }
                }
            },
            scopes: ["admin"]
        }
    ]
}
service /foo on new http:Listener(9090) {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

#### 5.1.2. Imperative Approach (HTTP Listener)

```ballerina
import ballerina/http;
import ballerina/oauth2;

http:OAuth2IntrospectionConfig config = {
    url: "https://localhost:8080/oauth2/introspect",
    tokenTypeHint: "access_token"
};
http:ListenerOAuth2Handler handler = new (config);

service /foo on new http:Listener(9090) {
    resource function post bar(@http:Header string authorization) returns string|http:Unauthorized|http:Forbidden {
        oauth2:IntrospectionResponse|http:Unauthorized|http:Forbidden auth = handler->authorize(authorization, "admin");
        if (auth is http:Unauthorized || auth is http:Forbidden) {
            return auth;
        }
        // business logic
    }
}
```

### 5.2. Client Auth

#### 5.2.1. Declarative Approach (HTTP Client)

##### 5.2.1.1. Bearer Token

```ballerina
import ballerina/http;

http:Client c = check new ("https://localhost:9090",
    auth = {
        token: "56ede317-4511-44b4-8579-a08f094ee8c5"
    }
);

public function main() returns error? {
    json response = check c->get("/foo/bar");
    // evaluate response
}

```

##### 5.2.1.2. Grant Types

```ballerina
import ballerina/http;

http:OAuth2ClientCredentialsGrantConfig config = {
    tokenUrl: "https://localhost:8080/oauth2/token/authorize",
    clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxS",
    clientSecret: "9205371918321623741"
};

http:Client c = check new ("https://localhost:9090", auth = config);

public function main() returns error? {
    json response = check c->get("/foo/bar");
    // evaluate response
}
```

#### 5.2.2. Imperative Approach (HTTP Client)

##### 5.2.2.1. Bearer Token

```ballerina
import ballerina/http;

http:BearerTokenConfig config = {
    token: "JhbGciOiJIIiwiaWF0IjUzI1NiIsInR5cCI6IkpXVCJ9WIiOiIxMjM0NTY3ODkwI"
};
http:ClientBearerTokenAuthHandler handler = new (config);

http:Client c = check new ("https://localhost:9090");

public function main() returns error? {
    http:Request req = new;
    req = check handler.enrich(req);
    json response = check c->get("/foo/bar");
    // evaluate response
}
```

##### 5.2.2.2. Grant Types

```ballerina
import ballerina/http;

http:OAuth2ClientCredentialsGrantConfig config = {
    tokenUrl: "https://localhost:8080/oauth2/token/authorize",
    clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxS",
    clientSecret: "9205371918321623741"
};
http:ClientOAuth2Handler handler = new (config);

http:Client c = check new ("https://localhost:9090");

public function main() returns error? {
    http:Request req = new;
    req = check handler->enrich(req);
    json response = check c->get("/foo/bar");
    // evaluate response
}
```
