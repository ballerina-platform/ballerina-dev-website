---
layout: ballerina-left-nav-pages-swanlake
title: HTTP client authentication
description: Ballerina HTTP clients can be configured to enforce authentication.
keywords: ballerina, programming language, security, secure ballerina code, authentication, iam
permalink: /learn/user-guide/security/http-client-authentication/
active: http-client-authentication
intro: Ballerina HTTP clients can be configured to enforce authentication.
redirect_from:
    - /learn/user-guide/security/http-client-authentication
redirect_to:
    - https://lib.ballerina.io/ballerina/http/latest/
---

The Ballerina HTTP client can be configured to send authentication information to the endpoint being invoked. Ballerina has built-in support for the following client authentication mechanisms.

- Basic Auth
- JWT Auth
- OAuth2

The following example represents how an HTTP client can be configured to call a secured endpoint.  The `auth` field of the client configurations (`http:ClientConfiguration`) should have either one of the `http:CredentialsConfig`, `http:BearerTokenConfig`, `http:JwtIssuerConfig`, `http:OAuth2ClientCredentialsGrantConfig`, `http:OAuth2PasswordGrantConfig`, and `http:OAuth2RefreshTokenGrantConfig` records.

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090",
    auth = {
        // ...
    },
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);
```

## Basic Auth

Ballerina supports Basic Authentication for clients. The `auth` field of the client configurations (`http:ClientConfiguration`) should have the `http:CredentialsConfig` record.

The `http:CredentialsConfig` configurations include:

* `username` - The username for Basic authentication
* `password` - The password for Basic authentication

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090",
    auth = {
        username: "alice",
        password: "123"
    },
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);

public function main() returns error? {
    json response = check securedEP->get("/foo/bar");
    log:printInfo(response.toJsonString());
}
```

## Self-signed JWT Auth

Ballerina supports self-signed JWT Authentication for clients. The `auth` field of the client configurations (`http:ClientConfiguration`) should have the `http:JwtIssuerConfig` record.

The `http:JwtIssuerConfig` configurations include:

* `username` - JWT username, which is mapped to the `sub`
* `issuer` - JWT issuer, which is mapped to the `iss`
* `audience` - JWT audience, which is mapped to the `aud`
* `jwtId` - JWT ID, which is mapped to the `jti`
* `keyId` - JWT key ID, which is mapped to the `kid`
* `customClaims` - Map of the custom claims
* `expTime` - Expiry time in seconds
* `signatureConfig` - JWT signature configurations
    * `algorithm` - Cryptographic signing algorithm for JWS
        * `jwt:RS256` - The RSA-SHA256 algorithm
        * `jwt:RS384` - The RSA-SHA384 algorithm
        * `jwt:RS512` - The RSA-SHA512 algorithm
        * `jwt:NONE` - Unsecured JWTs (no signing)
    * `config` - KeyStore configurations or private key configurations
        * `keyStore` - KeyStore to be used in JWT signing
        * `keyAlias` - Signing key alias
        * `keyPassword` - Signing key password
            * --- OR ---
        * `keyFile` - Private key to be used in JWT signing
        * `keyPassword` - Password of the private key (if encrypted)

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090",
    auth = {
        username: "ballerina",
        issuer: "wso2",
        audience: ["ballerina", "ballerina.org", "ballerina.io"],
        jwtId: "JlbmMiOiJBMTI4Q0JDLUhTMjU2In",
        keyId: "5a0b754-895f-4279-8843-b745e11a57e9",
        customClaims: { "scp": "admin" },
        expTime: 3600,
        signatureConfig: {
            algorithm: jwt:RS256,
            config: {
                keyFile: "/path/to/private.key",
            }
        }
    },
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);

public function main() returns error? {
    json response = check securedEP->get("/foo/bar");
    log:printInfo(response.toJsonString());
}
```

## Bearer Token Auth

Ballerina supports Bearer Token Authentication for clients. The `auth` field of the client configurations (`http:ClientConfiguration`) should have the `http:BearerTokenConfig` record.

The `http:BearerTokenConfig` configurations include:

* `token` - Bearer token for authentication

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090",
    auth = {
        token: "JlbmMiOiJBMTI4Q0JDLUhTMjU2In"
    },
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);

public function main() returns error? {
    json response = check securedEP->get("/foo/bar");
    log:printInfo(response.toJsonString());
}
```

## OAuth2

Ballerina supports OAuth2 authorization for clients. It supports the client credentials grant type, password grant type, and refresh token grant type, in which, the credentials can be provided manually, and after that, refreshing is handled internally. The `auth` field of the client configurations (`http:ClientConfiguration`) should have either one of the `http:OAuth2ClientCredentialsGrantConfig`, `http:OAuth2PasswordGrantConfig`, or `http:OAuth2RefreshTokenGrantConfig` records.

### Client credentials grant type

The `http:OAuth2ClientCredentialsGrantConfig` configurations include:

* `tokenUrl` - Token URL of the token endpoint
* `clientId` - Client ID of the client authentication
* `clientSecret` - Client secret of the client authentication
* `scopes` - Scope(s) of the access request
* `defaultTokenExpTime` - Expiration time (in seconds) of the tokens if the token endpoint response does not contain an `expires_in` field
* `clockSkew` - Clock skew (in seconds) that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` -  Map of the optional parameters used for the token endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the token endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the token endpoint
    * `httpVersion` - The HTTP version of the client
    * `customHeaders` - The list of custom HTTP headers
    * `customPayload` - The list of custom HTTP payload parameters
    * `auth` - The client auth configurations
        * `oauth2:ClientCredentialsGrantConfig`|`oauth2:PasswordGrantConfig`|`oauth2:RefreshTokenGrantConfig`
    * `secureSocket` - SSL/TLS-related configurations
        * `disable` - Disable SSL validation
        * `cert` - Configurations associated with the `crypto:TrustStore` or single certificate file that the client trusts
        * `key` - Configurations associated with the `crypto:KeyStore` or a combination of the certificate and private key of the client

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090",
    auth = {
        tokenUrl: "https://localhost:9445/oauth2/token",
        clientId: "FlfJYKBD2c925h4lkycqNZlC2l4a",
        clientSecret: "PJz0UhTJMrHOo68QQNpvnqAY_3Aa",
        scopes: ["admin"],
        clientConfig: {
            secureSocket: {
                cert: "/path/to/public.crt"
            }
        }
    },
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);

public function main() returns error? {
    json response = check securedEP->get("/foo/bar");
    log:printInfo(response.toJsonString());
}
```

### Password grant type

The `http:OAuth2PasswordGrantConfig` configurations include:

* `tokenUrl` - Token URL of the token endpoint
* `username` - Username for the password grant type
* `password` - Password for the password grant type
* `clientId` - Client ID of the client authentication
* `clientSecret` - Client secret of the client authentication
* `scopes` - Scope(s) of the access request
* `refreshConfig` - Configurations for refreshing the access token
    * `refreshUrl` - Refresh token URL for the refresh token server
    * `scopes` - Scope(s) of the access request
    * `optionalParams` - Map of the optional parameters to be used for the authorization endpoint
    * `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
        * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
        * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
    * `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint
* `defaultTokenExpTime` - Expiration time (in seconds) of the tokens if the token endpoint response does not contain an `expires_in` field
* `clockSkew` - Clock skew (in seconds) that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of the optional parameters used for the token endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the token endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the token endpoint
    * `httpVersion` - The HTTP version of the client
    * `customHeaders` - The list of custom HTTP headers
    * `customPayload` - The list of custom HTTP payload parameters
    * `auth` - The client auth configurations
        * `oauth2:ClientCredentialsGrantConfig`|`oauth2:PasswordGrantConfig`|`oauth2:RefreshTokenGrantConfig`
    * `secureSocket` - SSL/TLS-related configurations
        * `disable` - Disable SSL validation
        * `cert` - Configurations associated with the `crypto:TrustStore` or single certificate file that the client trusts
        * `key` - Configurations associated with the `crypto:KeyStore` or a combination of the certificate and private key of the client

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090",
    auth = {
        tokenUrl: "https://localhost:9445/oauth2/token",
        username: "admin",
        password: "123",
        clientId: "FlfJYKBD2c925h4lkycqNZlC2l4a",
        clientSecret: "PJz0UhTJMrHOo68QQNpvnqAY_3Aa",
        scopes: ["admin"],
        refreshConfig: {
            refreshUrl: "https://localhost:9445/oauth2/token",
            scopes: ["admin"],
            clientConfig: {
                secureSocket: {
                    cert: "/path/to/public.crt"
                }
            }
        },
        clientConfig: {
            secureSocket: {
                cert: "/path/to/public.crt"
            }
        }
    },
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);

public function main() returns error? {
    json response = check securedEP->get("/foo/bar");
    log:printInfo(response.toJsonString());
}
```

### Refresh token grant type

The `http:OAuth2RefreshTokenGrantConfig` configurations include:

* `refreshUrl` - Refresh token URL of the token endpoint
* `refreshToken` - Refresh token for the token endpoint
* `clientId` - Client ID of the client authentication
* `clientSecret` - Client secret of the client authentication
* `scopes` - Scope(s) of the access request
* `defaultTokenExpTime` - Expiration time (in seconds) of the tokens if the token endpoint response does not contain an `expires_in` field
* `clockSkew` - Clock skew (in seconds) that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of the optional parameters used for the token endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the token endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the token endpoint
    * `httpVersion` - The HTTP version of the client
    * `customHeaders` - The list of custom HTTP headers
    * `customPayload` - The list of custom HTTP payload parameters
    * `auth` - The client auth configurations
        * `oauth2:ClientCredentialsGrantConfig`|`oauth2:PasswordGrantConfig`|`oauth2:RefreshTokenGrantConfig`
    * `secureSocket` - SSL/TLS-related configurations
        * `disable` - Disable SSL validation
        * `cert` - Configurations associated with the `crypto:TrustStore` or single certificate file that the client trusts
        * `key` - Configurations associated with the `crypto:KeyStore` or a combination of certificate and private key of the client

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090",
    auth = {
        refreshUrl: "https://localhost:9445/oauth2/token",
        refreshToken: "24f19603-8565-4b5f-a036-88a945e1f272",
        clientId: "FlfJYKBD2c925h4lkycqNZlC2l4a",
        clientSecret: "PJz0UhTJMrHOo68QQNpvnqAY_3Aa",
        scopes: ["admin"],
        clientConfig: {
            secureSocket: {
                cert: "/path/to/public.crt"
            }
        }
    },
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);

public function main() returns error? {
    json response = check securedEP->get("/foo/bar");
    log:printInfo(response.toJsonString());
}
```
