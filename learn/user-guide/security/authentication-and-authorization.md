---
layout: ballerina-left-nav-pages-swanlake
title: Authentication and Authorization
description: Ballerina HTTP services/clients can be configured to enforce authentication and authorization.
keywords: ballerina, programming language, security, secure ballerina code, authorization, authentication
permalink: /learn/security/authentication-and-authorization/
active: authentication-and-authorization
intro: Ballerina HTTP services/clients can be configured to enforce authentication and authorization.
redirect_from:
- /learn/authentication-and-authorization
- /learn/authentication-and-authorization/
- /learn/security/authentication-and-authorization
- /swan-lake/learn/security/authentication-and-authorization/
- /swan-lake/learn/security/authentication-and-authorization
---

### HTTP Listener Authentication and Authorization

The Ballerina HTTP listener can be configured to authenticate and authorize the inbound requests. Ballerina has built-in support for the following listener authentication mechanisms.

- Basic authentication
- JWT authentication
- OAuth2 authentication

The following example represents how a service can be secured. The `http:ServiceConfig` annotation should have an `auth` field, which is an array of elements consisting  `http:LdapUserStoreConfigWithScopes`, `http:JwtValidatorConfigWithScopes`, or `http:OAuth2IntrospectionConfigWithScopes` records. Each of these records consists of a record specific configuration (`http:LdapUserStoreConfig`, `http:JwtValidatorConfig`, `http:OAuth2IntrospectionConfig` in this order) and an optional field, which consists of a `string` or `string[]`. The record-specific configuration is used for authentication and the optional field can be used for authorization.

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090, config = {
    secureSocket: {
        keyStore: {
            path: "/path/to/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    auth: [
        // ...
    ]
}
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

The `auth` array field may have one or more elements. If any of the elements get succeeded with authentication and authorization, the request will get the chance to invoke the API. The aforementioned optional field (`scopes`), which is there inside each and every element of the `auth` field may also have one or more elements.

These concepts are applied to the `http:ResourceConfig` annotation as well. The example below represents how a resource can be secured.

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090, config = {
    secureSocket: {
        keyStore: {
            path: "/path/to/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

service /foo on securedEP {

    @http:ResourceConfig {
        auth: [
            // ...
        ]
    }
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

Also, the security enforcement that is done for the service using the `http:ServiceConfig` can be overridden by the `http:ResourceConfig` annotation for a specific API(s).

> **Note:** It is required to use HTTPS when enforcing authentication and authorization checks to ensure the confidentiality of sensitive authentication data.

#### Basic Auth

##### LDAP User Store

Ballerina supports LDAP user store Basic Authentication and Authorization for services/resources. The `auth` field of a service/resource annotation should have a `http:LdapUserStoreConfigWithScopes` record as an element. If the `ldapUserStoreConfig` field is assigned with the `http:LdapUserStoreConfig` implementation, the authentication will be evaluated. Optionally, you can have the `string|string[]` value for the `scopes` field also. Then, the authorization will be evaluated.

The `http:LdapUserStoreConfig` configurations include:

* `domainName` - Unique name to identify the user store
* `connectionUrl` - Connection URL to the LDAP server
* `connectionName` - The username to connect to the LDAP server
* `connectionPassword` - Password for the ConnectionName user
* `userSearchBase` - DN of the context or object under which the user entries are stored in the LDAP server
* `userEntryObjectClass` - Object class used to construct user entries
* `userNameAttribute` - The attribute used for uniquely identifying a user entry
* `userNameSearchFilter` - Filtering criteria used to search for a particular user entry
* `userNameListFilter` - Filtering criteria for searching user entries in the LDAP server
* `groupSearchBase` - DN of the context or object under which the group entries are stored in the LDAP server
* `groupEntryObjectClass` - Object class used to construct group entries
* `groupNameAttribute` - The attribute used for uniquely identifying a group entry
* `groupNameSearchFilter` - Filtering criteria used to search for a particular group entry
* `groupNameListFilter` - Filtering criteria for searching group entries in the LDAP server
* `membershipAttribute` - Define the attribute that contains the distinguished names (DN) of user objects that are in a group
* `userRolesCacheEnabled` -  To indicate whether to cache the role list of a user
* `connectionPoolingEnabled` - Define whether LDAP connection pooling is enabled
* `connectionTimeoutInMillis` - Timeout in making the initial LDAP connection
* `readTimeoutInMillis` -  Read timeout in milliseconds for LDAP operations
* `secureClientSocket` - The SSL configurations for the LDAP client socket. This needs to be configured in order to communicate through LDAPs

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090, config = {
    secureSocket: {
        keyStore: {
            path: "/path/to/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    auth: [
        {
            ldapUserStoreConfig: {
                domainName: "ballerina.io",
                connectionUrl: "ldap://localhost:20000",
                connectionName: "uid=admin,ou=system",
                connectionPassword: "secret",
                userSearchBase: "ou=Users,dc=ballerina,dc=io",
                userEntryObjectClass: "identityPerson",
                userNameAttribute: "uid",
                userNameSearchFilter: "(&(objectClass=person)(uid=?))",
                userNameListFilter: "(objectClass=person)",
                groupSearchBase: ["ou=Groups,dc=ballerina,dc=io"],
                groupEntryObjectClass: "groupOfNames",
                groupNameAttribute: "cn",
                groupNameSearchFilter: "(&(objectClass=groupOfNames)(cn=?))",
                groupNameListFilter: "(objectClass=groupOfNames)",
                membershipAttribute: "member",
                userRolesCacheEnabled: true,
                connectionPoolingEnabled: false,
                connectionTimeoutInMillis: 5000,
                readTimeoutInMillis: 60000
            },
            scopes: ["hello"]
        }
    ]
}
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9090/foo/bar

> GET /foo/bar HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-length: 0
< server: ballerina
< content-type: text/plain
< 
```

When a request is made with valid authentication information, if the authenticated user does not have the required permission, an authorization failure will occur.

```
curl -k -v https://localhost:9090/foo/bar -H "Authorization: Basic <token>"

> GET /foo/bar HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Basic <token>
>

< HTTP/1.1 403 Forbidden
< content-length: 0
< server: ballerina
< content-type: text/plain
<
```

When a request is made with valid authentication information, if the authenticated user has the required permission, this will result in a successful invocation.

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Basic <token>'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Basic <token>
>

< HTTP/1.1 200 OK
< content-length: 13
< server: ballerina
< content-type: text/plain
<
Hello, World!
```

#### JWT Auth

Ballerina supports JWT Authentication and Authorization for services/resources. The `auth` field of a service/resource annotation should have a `http:JwtValidatorConfigWithScopes` record as an element. If the `jwtValidatorConfig` field is assigned with the `http:JwtValidatorConfig` implementation, the authentication will be evaluated. Optionally, you can have the `string|string[]` value for the `scopes` field also. Then, the authorization will be evaluated.

The `http:JwtValidatorConfig` configurations include:

* `issuer` - Expected issuer, which is mapped to `iss`
* `audience` - Expected audience, which is mapped to `aud`
* `clockSkewInSeconds` - Clock skew in seconds that can be used to avoid token validation failures due to clock synchronization problems
* `trustStoreConfig` - JWT trust store configurations
    * `trustStore` - Trust store used for signature verification
    * `certificateAlias` - Token-signed public key certificate alias
* `jwksConfig` - JWKs configurations
    * `url` - URL of the JWKs endpoint
    * `cacheConfig` - Configurations related to the cache, which are used to store preloaded JWKs information
    * `clientConfig` - HTTP client configurations, which call the JWKs endpoint
* `cacheConfig` - Configurations related to the cache, which are used to store the parsed JWT information

> **Note:** For demonstration purposes, the `ballerinaTruststore.p12` included with the Ballerina runtime is used. In a production deployment, the truststore should only contain the public key certificates of the trusted JWT issuers.

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090, config = {
    secureSocket: {
        keyStore: {
            path: "/path/to/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    auth: [
        {
            jwtValidatorConfig: {
                issuer: "wso2",
                audience: "ballerina",
                trustStoreConfig: {
                    trustStore: {
                        path: "/path/to/ballerinaTruststore.p12",
                        password: "ballerina"
                    },
                    certificateAlias: "ballerina"
                },
                scopeKey: "scp"
            },
            scopes: ["hello"]
        }
    ]
}
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9090/foo/bar

> GET /foo/bar HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-length: 0
< server: ballerina
< content-type: text/plain
< 
```

When a request is made with valid authentication information, if the authenticated user does not have the required permission, an authorization failure will occur.

```
curl -k -v https://localhost:9090/foo/bar -H "Authorization: Bearer <token>"

> GET /foo/bar HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 403 Forbidden
< content-length: 0
< server: ballerina
< content-type: text/plain
<
```

When a request is made with valid authentication information, if the authenticated user has the required permission, this will result in a successful invocation.

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Bearer <token>'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 200 OK
< content-length: 13
< server: ballerina
< content-type: text/plain
<
Hello, World!
```

#### OAuth2

Ballerina supports OAuth2 Authentication and Authorization for services/resources. The `auth` field of a service/resource annotation should have an `http:OAuth2IntrospectionConfigWithScopes` record as an element. If the `oauth2IntrospectionConfig` field is assigned with the `http:OAuth2IntrospectionConfig` implementation, the authentication will be evaluated. Optionally, the user can have the `string|string[]` value for the `scopes` field also. Then, the authorization will be evaluated.

The `http:OAuth2IntrospectionConfig` configurations include:

* `url` - URL of the introspection server
* `tokenTypeHint` - A hint about the type of the token submitted for introspection
* `optionalParams` - Map of optional parameters used for the introspection endpoint
* `cacheConfig` - Configurations for the cache used to store the OAuth2 token and other related information
* `defaultTokenExpTimeInSeconds` - Expiration time of the tokens if introspection response does not contain an `exp` field
* `clientConfig` - HTTP client configurations, which call the introspection server

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090, config = {
    secureSocket: {
        keyStore: {
            path: "/path/to/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    auth: [
        {
            oauth2IntrospectionConfig: {
                url: "https://localhost:9999/oauth2/token/introspect",
                tokenTypeHint: "access_token",
                scopeKey: "scp",
                clientConfig: {
                    secureSocket: {
                        trustStore: {
                            path: "/path/to/ballerinaTruststore.p12",
                            password: "ballerina"
                        }
                    }
                }
            },
            scopes: ["hello"]
        }
    ]
}
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9090/foo/bar

> GET /foo/bar HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.47.0
> Accept: */*
> 

< HTTP/1.1 401 Unauthorized
< content-length: 0
< server: ballerina
< content-type: text/plain
< 
```

When a request is made with valid authentication information, if the authenticated user does not have the required permission, an authorization failure will occur.

```
curl -k -v https://localhost:9090/foo/bar -H "Authorization: Bearer <token>"

> GET /foo/bar HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 403 Forbidden
< content-length: 0
< server: ballerina
< content-type: text/plain
<
```

When a request is made with valid authentication information, if the authenticated user has the required permission, this will result in a successful invocation.

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Bearer <token>'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 200 OK
< content-length: 13
< server: ballerina
< content-type: text/plain
<
Hello, World!
```

---

### HTTP Client Authentication

The Ballerina HTTP client can be configured to send authentication information to the endpoint being invoked. Ballerina has built-in support for the following client authentication mechanisms.

- Basic authentication
- JWT authentication
- OAuth2 authentication

The following example represents how an HTTP client can be configured to call a secured endpoint.  The `auth` field of the client configurations (`http:ClientConfiguration`) should have either one of the `http:CredentialsConfig`, `http:BearerTokenConfig`, `http:JwtIssuerConfig`, `http:OAuth2ClientCredentialsGrantConfig`, `http:OAuth2PasswordGrantConfig`, and `http:OAuth2DirectTokenConfig` records.

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090", {
    auth: {
        // ...
    },
    secureSocket: {
        trustStore: {
            path: "/path/to/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

#### Basic Auth

Ballerina supports Basic Authentication for clients. The `auth` field of the client configurations (`http:ClientConfiguration`) should have the `http:CredentialsConfig` record.

The `http:CredentialsConfig` configurations include:

* `username` - The username for Basic authentication
* `password` - The password for Basic authentication

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090", {
    auth: {
        username: "alice",
        password: "123"
    },
    secureSocket: {
        trustStore: {
            path: "/path/to/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

public function main() {
    // Send a `GET` request to the specified endpoint.
    var response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else if (response is http:ClientError) {
        log:printError("Failed to call the endpoint.", err = response);
    }
}
```

#### Self-Signed JWT Auth

Ballerina supports self-signed JWT Authentication for clients. The `auth` field of the client configurations (`http:ClientConfiguration`) should have the `http:JwtIssuerConfig` record.

The `http:JwtIssuerConfig` configurations include:

* `username` - JWT username, which is mapped to `sub`
* `issuer` - JWT issuer, which is mapped to `iss`
* `audience` - JWT audience, which is mapped to `aud`
* `keyId` - JWT key ID, which is mapped to `kid`
* `customClaims` - Map of custom claims
* `expTimeInSeconds` - Expiry time in seconds
* `signingAlgorithm` - Cryptographic signing algorithm for JWS
    * `jwt:RS256` - The RSA-SHA256 algorithm
    * `jwt:RS384` - The RSA-SHA384 algorithm
    * `jwt:RS512` - The RSA-SHA512 algorithm
    * `jwt:NONE` - Unsecured JWTs (no signing)
* `keyStoreConfig` - JWT key store configurations
    * `keyStore` - Keystore to be used in JWT signing
    * `keyAlias` - Signing key alias
    * `keyPassword` - Signing key password

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090", {
    auth: {
        username: "wso2",
        issuer: "ballerina",
        audience: ["ballerina", "ballerina.org", "ballerina.io"],
        keyId: "5a0b754-895f-4279-8843-b745e11a57e9",
        customClaims: { "scp": "hello" },
        expTimeInSeconds: 3600,
        keyStoreConfig: {
            keyAlias: "ballerina",
            keyPassword: "ballerina",
            keyStore: {
                path: "/path/to/ballerinaKeystore.p12",
                password: "ballerina"
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "/path/to/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

public function main() {
    // Send a `GET` request to the specified endpoint.
    var response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else if (response is http:ClientError) {
        log:printError("Failed to call the endpoint.", err = response);
    }
}
```


#### Bearer Token Auth

Ballerina supports Bearer Token Authentication for clients. The `auth` field of the client configurations (`http:ClientConfiguration`) should have the `http:BearerTokenConfig` record.

The `http:BearerTokenConfig` configurations include:

* `token` - Bearer token for authentication

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090", {
    auth: {
        token: "JlbmMiOiJBMTI4Q0JDLUhTMjU2In"
    },
    secureSocket: {
        trustStore: {
            path: "/path/to/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

public function main() {
    // Send a `GET` request to the specified endpoint.
    var response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else if (response is http:ClientError) {
        log:printError("Failed to call the endpoint.", err = response);
    }
}
```

#### OAuth2

Ballerina supports Basic Authentication for clients. It supports the Client Credentials grant type, Password grant type, and Direct Token type, in which, the credentials can be provided manually and after that refreshing is handled internally. The `auth` field of the client configurations (`http:ClientConfiguration`) should have either one of the `http:OAuth2ClientCredentialsGrantConfig`, `http:OAuth2PasswordGrantConfig`, or `http:OAuth2DirectTokenConfig` records.

##### Client Credentials Grant Type

The `http:OAuth2ClientCredentialsGrantConfig` configurations include:

* `tokenUrl` - Token URL for the authorization endpoint
* `clientId` - Client ID for the client credentials grant authentication
* `clientSecret` - Client secret for the client credentials grant authentication
* `scopes` - Scope(s) of the access request
* `defaultTokenExpInSeconds` - Expiration time of the tokens if the authorization server response does not contain an `expires_in` field
* `clockSkewInSeconds` - Clock skew in seconds that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of optional parameters to be used for the authorization endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090", {
    auth: {
        tokenUrl: "https://localhost:9090/oauth2/token",
        clientId: "s6BhdRkqt3",
        clientSecret: "7Fjfp0ZBr1KtDRbnfVdmIw",
        scopes: ["hello"],
        clientConfig: {
            secureSocket: {
                trustStore: {
                    path: "/path/to/ballerinaTruststore.p12",
                    password: "ballerina"
                }
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "/path/to/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

public function main() {
    // Send a `GET` request to the specified endpoint.
    var response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else if (response is http:ClientError) {
        log:printError("Failed to call the endpoint.", err = response);
    }
}
```

##### Password Grant Type

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
* `defaultTokenExpInSeconds` - Expiration time of the tokens if the authorization server response does not contain an `expires_in` field
* `clockSkewInSeconds` - Clock skew in seconds that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of optional parameters to be used for the authorization endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090", {
    auth: {
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
                    trustStore: {
                        path: "/path/to/ballerinaTruststore.p12",
                        password: "ballerina"
                    }
                }
            }
        },
        clientConfig: {
            secureSocket: {
                trustStore: {
                    path: "/path/to/ballerinaTruststore.p12",
                    password: "ballerina"
                }
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "/path/to/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

public function main() {
    // Send a `GET` request to the specified endpoint.
    var response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else if (response is http:ClientError) {
        log:printError("Failed to call the endpoint.", err = response);
    }
}
```

##### Direct Token Type

The `http:OAuth2DirectTokenConfig` configurations include:

* `refreshUrl` - Refresh token URL for the refresh token server
* `refreshToken` - Refresh token for the refresh token server
* `clientId` - Client ID for authentication against the authorization endpoint
* `clientSecret` - Client secret for authentication against the authorization endpoint
* `scopes` - Scope(s) of the access request
* `defaultTokenExpInSeconds` - Expiration time of the tokens if authorization server response does not contain an `expires_in` field
* `clockSkewInSeconds` - Clock skew in seconds that can be used to avoid token validation failures due to clock synchronization problems
* `optionalParams` - Map of optional parameters to be used for the authorization endpoint
* `credentialBearer` - Bearer of the authentication credentials, which is sent to the authorization endpoint
    * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
    * `http:POST_BODY_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which are used to call the authorization endpoint

```ballerina
import ballerina/http;
import ballerina/log;

http:Client securedEP = check new("https://localhost:9090", {
    auth: {
        refreshUrl: "https://localhost:9090/oauth2/token/refresh",
        refreshToken: "tGzv3JOkF0XG5Qx2TlKWIA",
        clientId: "s6BhdRkqt3",
        clientSecret: "7Fjfp0ZBr1KtDRbnfVdmIw",
        scopes: ["hello"],
        clientConfig: {
            secureSocket: {
                trustStore: {
                    path: "/path/to/ballerinaTruststore.p12",
                    password: "ballerina"
                }
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "/path/to/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

public function main() {
    // Send a `GET` request to the specified endpoint.
    var response = securedEP->get("/foo/bar");
    if (response is http:Response) {
        log:print(response.statusCode.toString());
    } else if (response is http:ClientError) {
        log:printError("Failed to call the endpoint.", err = response);
    }
}
```
