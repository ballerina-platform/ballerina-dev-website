# Specification: Ballerina JWT Library

_Owners_: @ldclakmal @shafreenAnfar  
_Reviewers_: @shafreenAnfar  
_Created_: 2021/10/01  
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction
This is the specification for the JWT standard library of [Ballerina language](https://ballerina.io/), which is used for authorization of listeners and clients (HTTP, gRPC, GraphQL, WebSocket, WebSub, etc.).

The JWT library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [JWT Auth](#2-jwt-auth)
3. [Listener Auth](#3-listener-auth)
    * 3.1. [JWT Auth Provider](#31-jwt-auth-provider)
    * 3.2. [JWT Auth Handler](#32-jwt-auth-handler)
    * 3.3. [Declarative Approach](#33-declarative-approach)
    * 3.4. [Imperative Approach](#34-imperative-approach)
4. [Client Auth](#4-client-auth)
    * 4.1. [JWT Auth Provider](#41-jwt-auth-provider)
    * 4.2. [JWT Auth Handler](#42-jwt-auth-handler)
        * 4.2.1. [Bearer Token](#421-bearer-token)
        * 4.2.2. [Self-Signed JWT](#422-self-signed-jwt)
    * 4.3. [Declarative Approach](#43-declarative-approach)
    * 4.4. [Imperative Approach](#44-imperative-approach)
5. [Samples](#5-samples)
    * 5.1. [Listener Auth](#51-listener-auth)
        * 5.1.1. [Declarative Approach (HTTP Listener)](#511-declarative-approach-http-listener)
        * 5.1.2. [Imperative Approach (HTTP Listener)](#512-imperative-approach-http-listener)
    * 5.2. [Client Auth](#52-client-auth)
        * 5.2.1. [Declarative Approach (HTTP Client)](#521-declarative-approach-http-client)
            * 5.2.1.1. [Bearer Token](#5211-bearer-token)
            * 5.2.1.2. [Self-Signed JWT](#5212-self-signed-jwt)
        * 5.2.2. [Imperative Approach (HTTP Client)](#522-imperative-approach-http-client)
            * 5.2.2.1. [Bearer Token](#5221-bearer-token)
            * 5.2.2.2. [Self-Signed JWT](#5222-self-signed-jwt)

## 1. Overview
This specification elaborates on JWT Auth authentication and authorization for all the Ballerina listeners and
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

## 2. JWT Auth
JWT Auth protocol defines the credential as a JWT as defined in [RFC7519](https://datatracker.ietf.org/doc/html/rfc7519).

## 3. Listener Auth
This refers to the authentication and authorization of the listener as defined in
[Ballerina 2021R1 Section 5.7.4](https://ballerina.io/spec/lang/2021R1/#section_5.7.4). The inbound requests/messages
independent of the transport protocol are authenticated and authorized according to the configured authentication
protocol and related configurations.

### 3.1. JWT Auth Provider
The JWT Auth Provider has an API to authenticate the JWT Auth credential. The `ValidatorConfig` record is used to 
provide the configuration related to the JWT validation. This returns the `Payload` which consists of all the available 
claims of the JWT.

```ballerina
import ballerina/cache;
import ballerina/crypto;

public type ValidatorConfig record {
    string issuer?;
    string username?;
    string|string[] audience?;
    string jwtId?;
    string keyId?;
    map<json> customClaims?;
    decimal clockSkew = 0;
    ValidatorSignatureConfig signatureConfig?;
    cache:CacheConfig cacheConfig?;
};

public type ValidatorSignatureConfig record {|
    record {|
        string url;
        cache:CacheConfig cacheConfig?;
        ClientConfiguration clientConfig = {};
    |} jwksConfig?;
    string certFile?;
    record {|
        crypto:TrustStore trustStore;
        string certAlias;
    |} trustStoreConfig?;
    string secret?;
|};

public class ListenerJwtAuthProvider {

    public function init(ValidatorConfig config) {
        // init JWT auth provider
    }

    public function authenticate(string credential) returns Payload|Error {
        // validate the credential against the configurations
    }
}

```

### 3.2. JWT Auth Handler

> **NOTE**: Since the auth handlers are tightly bound with the transport protocol, for the explanation of the concept,
> all the samples are created for HTTP transport protocol hereinafter.

The JWT Auth Handler has an API to authenticate the HTTP request, headers of the HTTP request, or the credential as 
defined in [RFC6750 Section 2.1](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1). The `JwtValidatorConfig` 
record is used to provide the configuration related to the JWT validation along with the `scopeKey` which defines the 
claim used for scopes. This returns the `Payload` which consists of all the available claims of the JWT or 
`Unauthorized` in case of authentication failure.

The JWT Auth Handler has an API to authorize the user against the expected scope or scopes. This returns `Forbidden` 
in case of authorization failure.

```ballerina
import ballerina/jwt;

public type JwtValidatorConfig record {|
    *jwt:ValidatorConfig;
    string scopeKey = "scope";
|};

public class ListenerJwtAuthHandler {

    private final jwt:ListenerJwtAuthProvider provider;

    public function init(JwtValidatorConfig config) {
        self.provider = new (config);
    }

    public function authenticate(Request|Headers|string data) returns jwt:Payload|Unauthorized {
        // extract the credential from data
        jwt:Payload|jwt:Error payload = self.provider.authenticate(credential);
        if (payload is jwt:Error) {
            // return `Unauthorized`
        }
        return <jwt:Payload>payload;
    }

    public function authorize(jwt:Payload jwtPayload, string|string[] expectedScopes) returns Forbidden? {
        // match the scopes with the provided `expectedScopes`
        // if not matched return `Forbidden`
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

### 4.1. JWT Auth Provider
The JWT Auth Provider has an API to generate the JWT Auth credential. The `IssuerConfig` record is used to provide the 
configuration related to the self-signed JWT generation. This returns the generated JWT.

```ballerina
import ballerina/crypto;

public type IssuerConfig record {|
    string issuer?;
    string username?;
    string|string[] audience?;
    string jwtId?;
    string keyId?;
    map<json> customClaims?;
    decimal expTime = 300;
    IssuerSignatureConfig signatureConfig?;
|};

public type IssuerSignatureConfig record {|
    SigningAlgorithm algorithm = RS256;
    record {|
        crypto:KeyStore keyStore;
        string keyAlias;
        string keyPassword;
    |}|record {|
        string keyFile;
        string keyPassword?;
    |}|string config?;
|};

public class ClientSelfSignedJwtAuthProvider {

    public function init(IssuerConfig config) {
        // init JWT auth provider
    }

    public function generateToken() returns string|Error {
        // generate a JWT against the configurations
    }
}
```

### 4.2. JWT Auth Handler

> **NOTE**: Since the auth handlers are tightly bound with the transport protocol, for the explanation of the concept,
> all the samples are created for HTTP transport protocol hereinafter.

#### 4.2.1. Bearer Token
The Bearer Token Auth Handler has an API to enrich the HTTP request as defined in 
[RFC6750 Section 2.1](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1). The `BearerTokenConfig` record is 
used to provide the configuration related to the JWT. This returns the enriched `Request` with headers or `Error` in 
case of failure.

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

#### 4.2.2. Self-Signed JWT
The Self Signed JWT Auth Handler has an API to enrich the HTTP request as defined in 
[RFC6750 Section 2.1](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1). The `JwtIssuerConfig` record is used 
to provide the configuration related to the self-signed JWT issuing. This returns the enriched `Request` with headers 
or `Error` in case of failure.

```ballerina
import ballerina/jwt;

public type JwtIssuerConfig record {|
    *jwt:IssuerConfig;
|};

public class ClientSelfSignedJwtAuthHandler {

    private final jwt:ClientSelfSignedJwtAuthProvider provider;

    public function init(JwtIssuerConfig config) {
        self.provider = new (config);
    }

    public function enrich(Request req) returns Request|Error {
        string|jwt:Error token = self.provider.generateToken();
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
            jwtValidatorConfig: {
                issuer: "wso2",
                audience: "ballerina",
                signatureConfig: {
                    certFile: "/path/to/public.crt"
                },
                scopeKey: "scp"
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
import ballerina/jwt;

http:JwtValidatorConfig config = {
    issuer: "ballerina",
    audience: ["wso2"],
    signatureConfig: {
        jwksConfig: {
            url: "https://localhost:8080/jwks"
        }
    }
};
http:ListenerJwtAuthHandler handler = new (config);

service /foo on new http:Listener(9090) {
    resource function post bar(@http:Header string Authorization) returns string|http:Unauthorized|http:Forbidden {
        jwt:Payload|http:Unauthorized authn = handler.authenticate(Authorization);
        if (authn is http:Unauthorized) {
            return authn;
        }
        http:Forbidden? authz = handler.authorize(<jwt:Payload>authn, "admin");
        if (authz is http:Forbidden) {
            return authz;
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
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiw" +
               "ibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2Q" +
               "T4fwpMeJf36POk6yJV_adQssw5c"
    }
);

public function main() returns error? {
    json response = check c->get("/foo/bar");
    // evaluate response
}
```

##### 5.2.1.2. Self-Signed JWT

```ballerina
import ballerina/http;

http:Client c = check new ("https://localhost:9090",
    auth = {
        username: "ballerina",
        issuer: "wso2",
        audience: ["ballerina", "ballerina.org", "ballerina.io"],
        keyId: "5a0b754-895f-4279-8843-b745e11a57e9",
        jwtId: "JlbmMiOiJBMTI4Q0JDLUhTMjU2In",
        customClaims: {"scp": "admin"},
        expTime: 3600,
        signatureConfig: {
            config: {
                keyFile: "/path/to/private.key"
            }
        }
    }
);

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
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFt" +
           "ZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf3" +
           "6POk6yJV_adQssw5c"
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

##### 5.2.2.2. Self-Signed JWT

```ballerina
import ballerina/http;

http:JwtIssuerConfig config = {
    username: "admin",
    issuer: "ballerina",
    audience: ["wso2"],
    signatureConfig: {
        config: {
            keyFile: "/path/to/private.key",
            keyPassword: "password"
        }
    }
};
http:ClientSelfSignedJwtAuthHandler handler = new (config);

http:Client c = check new ("https://localhost:9090");

public function main() returns error? {
    http:Request req = new;
    req = check handler.enrich(req);
    json response = check c->get("/foo/bar");
    // evaluate response
}
```
