---
layout: ballerina-left-nav-pages-swanlake
title: HTTP Client Authentication
description: Ballerina HTTP clients can be configured to enforce authentication.
keywords: ballerina, programming language, security, secure ballerina code, authentication, iam
permalink: /learn/user-guide/security/http-client-authentication/
active: http-client-authentication
intro: Ballerina HTTP clients can be configured to enforce authentication.
redirect_from:
- /learn/user-guide/security/http-client-authentication
---

The Ballerina HTTP client can be configured to send authentication information to the endpoint being invoked. Ballerina has built-in support for the following client authentication mechanisms.

- Basic authentication
- JWT authentication
- OAuth2 authentication

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

public function main() {
    // Send a `GET` request to the specified endpoint.
    http:Response|http:ClientError response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else {
        log:printError("Failed to call the endpoint.", 'error = response);
    }
}
```

## Self-Signed JWT Auth

Ballerina supports self-signed JWT Authentication for clients. The `auth` field of the client configurations (`http:ClientConfiguration`) should have the `http:JwtIssuerConfig` record.

The `http:JwtIssuerConfig` configurations include:

* `username` - JWT username, which is mapped to the `sub`
* `issuer` - JWT issuer, which is mapped to the `iss`
* `audience` - JWT audience, which is mapped to the `aud`
* `jwtId` - JWT ID, which is mapped to the `jti`
* `keyId` - JWT key ID, which is mapped to the `kid`
* `customClaims` - Map of custom claims
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
        customClaims: { "scp": "hello" },
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

public function main() {
    // Send a `GET` request to the specified endpoint.
    http:Response|http:ClientError response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else {
        log:printError("Failed to call the endpoint.", 'error = response);
    }
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

public function main() {
    // Send a `GET` request to the specified endpoint.
    http:Response|http:ClientError response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else {
        log:printError("Failed to call the endpoint.", 'error = response);
    }
}
```

## OAuth2

Ballerina supports Basic Authentication for clients. It supports the client credentials grant type, password grant type, and refresh token grant type, in which, the credentials can be provided manually, and after that refreshing is handled internally. The `auth` field of the client configurations (`http:ClientConfiguration`) should have either one of the `http:OAuth2ClientCredentialsGrantConfig`, `http:OAuth2PasswordGrantConfig`, or `http:OAuth2RefreshTokenGrantConfig` records.

### Client Credentials Grant Type

The `http:OAuth2ClientCredentialsGrantConfig` configurations include:

* `tokenUrl` - Token URL for the authorization endpoint
* `clientId` - Client ID for the client credentials grant authentication
* `clientSecret` - Client secret for the client credentials grant authentication
* `scopes` - Scope(s) of the access request
* `defaultTokenExpTime` - Expiration time (in seconds) of the tokens if the authorization server response does not contain an `expires_in` field
* `clockSkew` - Clock skew (in seconds) that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of optional parameters to be used for the authorization endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint
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
        tokenUrl: "https://localhost:9090/oauth2/token",
        clientId: "s6BhdRkqt3",
        clientSecret: "7Fjfp0ZBr1KtDRbnfVdmIw",
        scopes: ["hello"],
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

public function main() {
    // Send a `GET` request to the specified endpoint.
    http:Response|http:ClientError response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else {
        log:printError("Failed to call the endpoint.", 'error = response);
    }
}
```

### Password Grant Type

The `http:OAuth2PasswordGrantConfig` configurations include:

* `tokenUrl` - Token URL for the authorization endpoint
* `username` - Username for the password grant authentication
* `password` - Password for the password grant authentication
* `clientId` - Client ID for the password grant authentication
* `clientSecret` - Client secret for the password grant authentication
* `scopes` - Scope(s) of the access request
* `refreshConfig` - Configurations for refreshing the access token
    * `refreshUrl` - Refresh token URL for the refresh token server
    * `scopes` - Scope(s) of the access request
    * `optionalParams` - Map of optional parameters to be used for the authorization endpoint
    * `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
        * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
        * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
    * `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint
* `defaultTokenExpTime` - Expiration time (in seconds) of the tokens if the authorization server response does not contain an `expires_in` field
* `clockSkew` - Clock skew (in seconds) that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of optional parameters to be used for the authorization endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint
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
        tokenUrl: "https://localhost:9090/oauth2/token",
        username: "admin",
        password: "123",
        clientId: "s6BhdRkqt3",
        clientSecret: "7Fjfp0ZBr1KtDRbnfVdmIw",
        scopes: ["hello"],
        refreshConfig: {
            refreshUrl: "https://localhost:9090/oauth2/token/refresh",
            scopes: ["hello"],
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

public function main() {
    // Send a `GET` request to the specified endpoint.
    http:Response|http:ClientError response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else {
        log:printError("Failed to call the endpoint.", 'error = response);
    }
}
```

### Refresh Token Grant Type

The `http:OAuth2RefreshTokenGrantConfig` configurations include:

* `refreshUrl` - Refresh token URL for the refresh token server
* `refreshToken` - Refresh token for the refresh token server
* `clientId` - Client ID for authentication against the authorization endpoint
* `clientSecret` - Client secret for authentication against the authorization endpoint
* `scopes` - Scope(s) of the access request
* `defaultTokenExpTime` - Expiration time (in seconds) of the tokens if the authorization server response does not contain an `expires_in` field
* `clockSkew` - Clock skew (in seconds) that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of optional parameters to be used for the authorization endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint
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
        refreshUrl: "https://localhost:9090/oauth2/token/refresh",
        refreshToken: "tGzv3JOkF0XG5Qx2TlKWIA",
        clientId: "s6BhdRkqt3",
        clientSecret: "7Fjfp0ZBr1KtDRbnfVdmIw",
        scopes: ["hello"],
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

public function main() {
    // Send a `GET` request to the specified endpoint.
    http:Response|http:ClientError response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else {
        log:printError("Failed to call the endpoint.", 'error = response);
    }
}
```
