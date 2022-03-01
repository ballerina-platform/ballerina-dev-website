---
layout: ballerina-left-nav-pages-swanlake
title: HTTP listener authentication and authorization
description: Ballerina HTTP services/resources can be configured to enforce authentication and authorization.
keywords: ballerina, programming language, security, secure ballerina code, authorization, authentication, iam
permalink: /learn/user-guide/security/http-listener-authentication-and-authorization/
active: http-listener-authentication-and-authorization
intro: Ballerina HTTP services/resources can be configured to enforce authentication and authorization.
redirect_from:
- /learn/authentication-and-authorization
- /learn/authentication-and-authorization/
- /swan-lake/learn/security/authentication-and-authorization/
- /swan-lake/learn/security/authentication-and-authorization
- /learn/security/authentication-and-authorization/
- /learn/security/authentication-and-authorization
- /learn/user-guide/security/authentication-and-authorization
- /learn/user-guide/authentication-and-authorization/
- /learn/user-guide/authentication-and-authorization
- /learn/how-to-write-secure-ballerina-code
- /learn/how-to-write-secure-ballerina-code/
- /learn/writing-secure-ballerina-code/
- /learn/writing-secure-ballerina-code
- /learn/security/
- /learn/security
- /swan-lake/learn/security/writing-secure-ballerina-code/
- /swan-lake/learn/security/writing-secure-ballerina-code
- /learn/security/writing-secure-ballerina-code/
- /learn/security/writing-secure-ballerina-code
- /learn/user-guide/security/writing-secure-ballerina-code
- /learn/user-guide/security/writing-secure-ballerina-code/
- /learn/user-guide/security/
- /learn/user-guide/security
- /learn/user-guide/security/authentication-and-authorization/
- /learn/user-guide/security/authentication-and-authorization
redirect_to:
    - https://lib.ballerina.io/ballerina/http/latest/
---

The Ballerina HTTP services/resources can be configured to authenticate and authorize the inbound requests. Ballerina has built-in support for the following listener authentication mechanisms.

- Basic Auth
- JWT Auth
- OAuth2

The example below represents how a service can be secured. The `http:ServiceConfig` annotation should have an `auth` field, which is an array of elements consisting of   `http:FileUserStoreConfigWithScopes`, `http:LdapUserStoreConfigWithScopes`, `http:JwtValidatorConfigWithScopes`, or `http:OAuth2IntrospectionConfigWithScopes` records. Each of these records consists of a record specific configuration (`http:FileUserStoreConfig`, `http:LdapUserStoreConfig`, `http:JwtValidatorConfig`, `http:OAuth2IntrospectionConfig` in this order) and an optional field, which consists of a `string` or `string[]`. The record-specific configuration is used for authentication and the optional field can be used for authorization.

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

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

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

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

## Basic Auth

### File user store

Ballerina supports the file user store basic authentication and authorization for services/resources. The `auth` field of a service/resource annotation should have an `http:FileUserStoreConfigWithScopes` record as an element. If the `fileUserStoreConfig` field is assigned with the `http:FileUserStoreConfig` implementation, the authentication will be evaluated. Optionally, you can have the `string|string[]` value for the `scopes` field also. Then, the authorization will be evaluated.

The `http:FileUserStoreConfig` configurations are kept blank for future improvements and backward compatibility.

The file user store is defined in the `Config.toml` as follows:
```toml
[[ballerina.auth.users]]
username="alice"
password="password1"
scopes=["scope1"]

[[ballerina.auth.users]]
username="bob"
password="password2"
scopes=["scope2", "scope3"]

[[ballerina.auth.users]]
username="eve"
password="password3"
```

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

@http:ServiceConfig {
    auth: [
        {
            fileUserStoreConfig: {},
            scopes: ["admin"]
        }
    ]
}
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur.

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

#### Imperative method

There is an imperative method to handle authentication and authorization as follows:

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

http:ListenerFileUserStoreBasicAuthHandler handler = new;

service /foo on securedEP {
    resource function get bar(@http:Header { name: "Authorization" } string header) returns string|http:Unauthorized|http:Forbidden {
        auth:UserDetails|http:Unauthorized authn = handler.authenticate(header);
        if (authn is http:Unauthorized) {
            return authn;
        }
        http:Forbidden? authz = handler.authorize(<auth:UserDetails> authn, ["write", "update"]);
        if (authz is http:Forbidden) {
            return authz;
        }
        return "Hello, World!";
    }
}
```

### LDAP user store

Ballerina supports LDAP user store basic authentication and authorization for services/resources. The `auth` field of a service/resource annotation should have a `http:LdapUserStoreConfigWithScopes` record as an element. If the `ldapUserStoreConfig` field is assigned with the `http:LdapUserStoreConfig` implementation, the authentication will be evaluated. Optionally, you can have the `string|string[]` value for the `scopes` field also. Then, the authorization will be evaluated.

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
* `connectionTimeout` - Connection timeout (in seconds) when making the initial LDAP connection
* `readTimeout` - Reading timeout (in seconds) for LDAP operations
* `secureSocket` - The SSL configurations for the LDAP client socket. This needs to be configured in order to communicate through LDAPs
    * `cert` - Configurations associated with the `crypto:TrustStore` or single certificate file that the client trusts

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

@http:ServiceConfig {
    auth: [
        {
            ldapUserStoreConfig: {
                domainName: "avix.lk",
                connectionUrl: "ldap://localhost:389",
                connectionName: "cn=admin,dc=avix,dc=lk",
                connectionPassword: "avix123",
                userSearchBase: "ou=Users,dc=avix,dc=lk",
                userEntryObjectClass: "inetOrgPerson",
                userNameAttribute: "uid",
                userNameSearchFilter: "(&(objectClass=inetOrgPerson)(uid=?))",
                userNameListFilter: "(objectClass=inetOrgPerson)",
                groupSearchBase: ["ou=Groups,dc=avix,dc=lk"],
                groupEntryObjectClass: "groupOfNames",
                groupNameAttribute: "cn",
                groupNameSearchFilter: "(&(objectClass=groupOfNames)(cn=?))",
                groupNameListFilter: "(objectClass=groupOfNames)",
                membershipAttribute: "member",
                userRolesCacheEnabled: true,
                connectionPoolingEnabled: false,
                connectionTimeout: 5,
                readTimeout: 60
            },
            scopes: ["admin"]
        }
    ]
}
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur.

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

#### Imperative method

There is an imperative method to handle authentication and authorization as follows:

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

http:ListenerLdapUserStoreBasicAuthHandler handler = new({
    domainName: "avix.lk",
    connectionUrl: "ldap://localhost:389",
    connectionName: "cn=admin,dc=avix,dc=lk",
    connectionPassword: "avix123",
    userSearchBase: "ou=Users,dc=avix,dc=lk",
    userEntryObjectClass: "inetOrgPerson",
    userNameAttribute: "uid",
    userNameSearchFilter: "(&(objectClass=inetOrgPerson)(uid=?))",
    userNameListFilter: "(objectClass=inetOrgPerson)",
    groupSearchBase: ["ou=Groups,dc=avix,dc=lk"],
    groupEntryObjectClass: "groupOfNames",
    groupNameAttribute: "cn",
    groupNameSearchFilter: "(&(objectClass=groupOfNames)(cn=?))",
    groupNameListFilter: "(objectClass=groupOfNames)",
    membershipAttribute: "member",
    userRolesCacheEnabled: true,
    connectionPoolingEnabled: false,
    connectionTimeout: 5,
    readTimeout: 60
});

service /foo on securedEP {
    resource function get bar(@http:Header { name: "Authorization" } string header) returns string|http:Unauthorized|http:Forbidden {
        auth:UserDetails|http:Unauthorized authn = handler.authenticate(header);
        if (authn is http:Unauthorized) {
            return authn;
        }
        http:Forbidden? authz = handler.authorize(<auth:UserDetails> authn, ["write", "update"]);
        if (authz is http:Forbidden) {
            return authz;
        }
        return "Hello, World!";
    }
}
```

## JWT Auth

Ballerina supports JWT authentication and authorization for services/resources. The `auth` field of a service/resource annotation should have a `http:JwtValidatorConfigWithScopes` record as an element. If the `jwtValidatorConfig` field is assigned with the `http:JwtValidatorConfig` implementation, the authentication will be evaluated. Optionally, you can have the `string|string[]` value for the `scopes` field also. Then, the authorization will be evaluated.

The `http:JwtValidatorConfig` configurations include:

* `issuer` - Expected issuer, which is mapped to the `iss`
* `audience` - Expected audience, which is mapped to the `aud`
* `clockSkew` - Clock skew (in seconds) that can be used to avoid token validation failures due to clock synchronization problems
* `signatureConfig` - JWT signature configurations
    * `jwksConfig` - JWKS configurations
        * `url` - URL of the JWKS endpoint
        * `cacheConfig` - Configurations related to the cache, which are used to store preloaded JWKs information
        * `clientConfig` - HTTP client configurations, which call the JWKs endpoint
    * `certFile` - Public certificate file
    * `trustStoreConfig` - JWT TrustStore configurations
        * `trustStore` - TrustStore used for signature verification
        * `certAlias` - Token-signed public key certificate alias
* `cacheConfig` - Configurations related to the cache, which are used to store parsed JWT information

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

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
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur.

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

### Imperative method

There is an imperative method to handle authentication and authorization as follows:

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

http:ListenerJwtAuthHandler handler = new({
    issuer: "wso2",
    audience: "ballerina",
    signatureConfig: {
        certFile: "/path/to/public.crt"
    },
    scopeKey: "scp"
});

service /foo on securedEP {
    resource function get bar(@http:Header { name: "Authorization" } string header) returns string|http:Unauthorized|http:Forbidden {
        jwt:Payload|http:Unauthorized authn = handler.authenticate(header);
        if (authn is http:Unauthorized) {
            return authn;
        }
        http:Forbidden? authz = handler.authorize(<jwt:Payload> authn, ["write", "update"]);
        if (authz is http:Forbidden) {
            return authz;
        }
        return "Hello, World!";
    }
}
```

## OAuth2

Ballerina supports OAuth2 authorization for services/resources. The `auth` field of a service/resource annotation should have an `http:OAuth2IntrospectionConfigWithScopes` record as an element. If the `oauth2IntrospectionConfig` field is assigned with the `http:OAuth2IntrospectionConfig` implementation, the authentication will be evaluated. Optionally, you can have the `string|string[]` value for the `scopes` field also. Then, the authorization will be evaluated.

The `http:OAuth2IntrospectionConfig` configurations include:

* `url` - URL of the introspection server
* `tokenTypeHint` - A hint about the type of the token submitted for introspection
* `optionalParams` - Map of the optional parameters used for the introspection endpoint
* `cacheConfig` - Configurations for the cache used to store the OAuth2 token and other related information
* `defaultTokenExpTime` - Expiration time (in seconds) of the tokens if the introspection response does not contain an `exp` field
* `clientConfig` - HTTP client configurations, which call the introspection server
    * `httpVersion` - The HTTP version of the client
    * `customHeaders` - The list of custom HTTP headers
    * `customPayload` - The list of custom HTTP payload parameters
    * `auth` - The client auth configurations
    * `secureSocket` - SSL/TLS-related configurations
        * `enable` - Enable the SSL validation
        * `cert` - Configurations associated with the `crypto:TrustStore` or single certificate file that the client trusts
        * `key` - Configurations associated with the `crypto:KeyStore` or a combination of the certificate and private key of the client

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

@http:ServiceConfig {
    auth: [
        {
            oauth2IntrospectionConfig: {
                url: "https://localhost:9445/oauth2/introspect",
                tokenTypeHint: "access_token",
                scopeKey: "scp",
                clientConfig: {
                    secureSocket: {
                        cert: "/path/to/public.crt"
                    }
                }
            },
            scopes: ["admin"]
        }
    ]
}
service /foo on securedEP {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur.

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

### Imperative method

There is an imperative method to handle authorization as follows:

```ballerina
import ballerina/http;

listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

http:ListenerOAuth2Handler handler = new({
    url: "https://localhost:9445/oauth2/introspect",
    tokenTypeHint: "access_token",
    scopeKey: "scp",
    clientConfig: {
        secureSocket: {
            cert: "/path/to/public.crt"
        }
    }
});

service /foo on securedEP {
    resource function get bar(@http:Header { name: "Authorization" } string header) returns string|http:Unauthorized|http:Forbidden {
        oauth2:IntrospectionResponse|http:Unauthorized|http:Forbidden auth = handler->authorize(header, ["write", "update"]);
        if (auth is http:Unauthorized || auth is http:Forbidden) {
            return auth;
        }
        return "Hello, World!";
    }
}
```
