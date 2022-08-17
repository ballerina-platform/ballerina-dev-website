# Specification: Ballerina Auth Library

_Owners_: @ldclakmal @shafreenAnfar  
_Reviewers_: @shafreenAnfar  
_Created_: 2021/10/01  
_Updated_: 2022/02/17  
_Edition_: Swan Lake  

## Introduction
This is the specification for the Auth standard library of [Ballerina language](https://ballerina.io/), which is used for authorization of listeners and clients (HTTP, gRPC, GraphQL, WebSocket, WebSub, etc.).

The Auth library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Basic Auth](#2-basic-auth)
3. [Listener Auth](#3-listener-auth)
    * 3.1. [Basic Auth Provider](#31-basic-auth-provider)
        * 3.1.1. [File User Store](#311-file-user-store)
        * 3.1.2. [LDAP User Store](#312-ldap-user-store)
    * 3.2. [Basic Auth Handler](#32-basic-auth-handler)
        * 3.2.1. [File User Store](#321-file-user-store)
        * 3.2.2. [LDAP User Store](#322-ldap-user-store)
    * 3.3. [Declarative Approach](#33-declarative-approach)
    * 3.4. [Imperative Approach](#34-imperative-approach)
4. [Client Auth](#4-client-auth)
    * 4.1. [Basic Auth Provider](#41-basic-auth-provider)
    * 4.2. [Basic Auth Handler](#42-basic-auth-handler)
    * 4.3. [Declarative Approach](#43-declarative-approach)
    * 4.4. [Imperative Approach](#44-imperative-approach)
5. [Samples](#5-samples)
    * 5.1. [Listener Auth](#51-listener-auth)
        * 5.1.1. [Declarative Approach (HTTP Listener)](#511-declarative-approach-http-listener)
            * 5.1.1.1. [File User Store](#5111-file-user-store)
            * 5.1.1.2. [LDAP User Store](#5112-ldap-user-store)
        * 5.1.2. [Imperative Approach (HTTP Listener)](#512-imperative-approach-http-listener)
            * 5.1.2.1. [File User Store](#5121-file-user-store)
            * 5.1.2.2. [LDAP User Store](#5122-ldap-user-store)
    * 5.2. [Client Auth](#52-client-auth)
        * 5.2.1. [Declarative Approach (HTTP Client)](#521-declarative-approach-http-client)
        * 5.2.2. [Imperative Approach (HTTP Client)](#522-imperative-approach-http-client)

## 1. Overview
This specification elaborates on Basic Auth authentication and authorization for all the Ballerina listeners and 
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

## 2. Basic Auth
Basic Auth protocol defines the credential as username and password are concatenated with a `:` and encoded using 
Base64 as defined in [RFC4648 Section 4](https://datatracker.ietf.org/doc/html/rfc4648#section-4) into a sequence of 
US-ASCII characters as defined in [RFC0020](https://datatracker.ietf.org/doc/html/rfc0020).

## 3. Listener Auth
This refers to the authentication and authorization of the listener as defined in 
[Ballerina 2021R1 Section 5.7.4](https://ballerina.io/spec/lang/2021R1/#section_5.7.4). The inbound requests/messages 
independent of the transport protocol are authenticated and authorized according to the configured authentication 
protocol and related configurations.

### 3.1. Basic Auth Provider

#### 3.1.1. File User Store
The user information is stored in a file in the [TOML language](https://toml.io/en/). The structure of the file would 
be as follows:

```toml
# 1* of the following block
[[ballerina.auth.users]]
username=<String>
password=<String>
scopes=<String Array>
```

The File User Store Basic Auth Provider has an API to authenticate the Basic Auth credential using the File User Store 
defined in [TOML language][TOML language](https://toml.io/en/) and return the `UserDetails` which consists of the 
username and scopes as an array if available.

```ballerina
public type FileUserStoreConfig record {|
|};

public type UserDetails record {|
    string username;
    string[]? scopes;
|};

public class ListenerFileUserStoreBasicAuthProvider {

    public function init(FileUserStoreConfig config) {
        // init basic auth provider for file user store
    }
    
    public function authenticate(string credential) returns UserDetails|error {
        // read the user store file, validate the credential and return user details
    }
}
```

#### 3.1.2. LDAP User Store
The user information is stored in a user store that connects with the LDAP protocol as defined in 
[RFC4511](https://datatracker.ietf.org/doc/html/rfc4511).

The LDAP User Store Basic Auth Provider has an API to authenticate the Basic Auth credential using the LDAP User Store. 
The `LdapUserStoreConfig` record is used to provide the configuration related to the LDAP protocol. This returns the 
`UserDetails` which consists of the username and scopes as an array if available.

```ballerina
public type LdapUserStoreConfig record {|
    string domainName;
    string connectionUrl;
    string connectionName;
    string connectionPassword;
    string userSearchBase;
    string userEntryObjectClass;
    string userNameAttribute;
    string userNameSearchFilter;
    string userNameListFilter;
    string[] groupSearchBase;
    string groupEntryObjectClass;
    string groupNameAttribute;
    string groupNameSearchFilter;
    string groupNameListFilter;
    string membershipAttribute;
    boolean userRolesCacheEnabled = false;
    boolean connectionPoolingEnabled = true;
    decimal connectionTimeout = 5;
    decimal readTimeout = 60;
    SecureSocket secureSocket?;
|};

public type UserDetails record {|
    string username;
    string[]? scopes;
|};

public class ListenerLdapUserStoreBasicAuthProvider {

    public function init(LdapUserStoreConfig config) {
        // init basic auth provider for LDAP
    }
    
    public function authenticate(string credential) returns UserDetails|Error {
        // connect to LDAP, validate the credential and return user details
    }
}
```

### 3.2. Basic Auth Handler

> **NOTE**: Since the auth handlers are tightly bound with the transport protocol, for the explanation of the concept, 
> all the samples are created for HTTP transport protocol hereinafter.

#### 3.2.1. File User Store
The user information is stored in a file in the [TOML language](https://toml.io/en/). The structure of the file would 
be as follows:

```
# 1* of the following block
[[ballerina.auth.users]]
username=<String>
password=<String>
scopes=<String Array>
```

The File User Store Basic Auth Handler has an API to authenticate the HTTP request, headers of the HTTP request, or the 
credential as defined in [RFC7617 Section 2](https://datatracker.ietf.org/doc/html/rfc7617#section-2) using the File 
User Store defined in [TOML language](https://toml.io/en/). This returns the `UserDetails` which consists of the 
username and scopes as an array if available or `Unauthorized` in case of authentication failure.

The File User Store Basic Auth Handler has an API to authorize the user against the expected scope or scopes. This 
returns `Forbidden` in case of authorization failure.

```ballerina
import ballerina/auth;

public type FileUserStoreConfig record {|
    *auth:FileUserStoreConfig;
|};

public class ListenerFileUserStoreBasicAuthHandler {

    private final auth:ListenerFileUserStoreBasicAuthProvider provider;
    
    public function init(FileUserStoreConfig config) {
        self.provider = new (config);
    }
    
    public function authenticate(Request|Headers|string data) returns auth:UserDetails|Unauthorized {
        // extract the credential from data
        auth:UserDetails|auth:Error details = self.provider.authenticate(credential);
        if (details is auth:Error) {
            // return `Unauthorized`
        }
        return <auth:UserDetails>details;
    }
    
    public function authorize(auth:UserDetails userDetails, string|string[] expectedScopes) returns Forbidden? {
        // match the scopes with the provided `expectedScopes`
        // if not matched return `Forbidden`
    }
}
```

#### 3.2.2. LDAP User Store
The LDAP User Store Basic Auth Handler has an API to authenticate the HTTP request, headers of the HTTP request, or the 
credential as defined in [RFC7617 Section 2](https://datatracker.ietf.org/doc/html/rfc7617#section-2) using the LDAP 
User Store. The `LdapUserStoreConfig` record is used to provide the configuration related to the LDAP protocol. This 
returns the `UserDetails` which consists of the username and scopes as an array if available or `Unauthorized` in case 
of authentication failure.

The LDAP User Store Basic Auth Handler has an API to authorize the user against the expected scope or scopes. This 
returns `Forbidden` in case of authorization failure.

```ballerina
import ballerina/auth;

public type LdapUserStoreConfig record {|
    *auth:LdapUserStoreConfig;
|};

public client class ListenerLdapUserStoreBasicAuthHandler {

    private final auth:ListenerLdapUserStoreBasicAuthProvider provider;
    
    public function init(LdapUserStoreConfig config) {
        self.provider = new (config);
    }
    
    remote function authenticate(Request|Headers|string data) returns auth:UserDetails|Unauthorized {
        // extract the credential from data
        auth:UserDetails|auth:Error details = self.provider.authenticate(credential);
        if (details is auth:Error) {
            // return `Unauthorized`
        }
        return <auth:UserDetails>details;
    }
    
    remote function authorize(auth:UserDetails details, string|string[] expectedScopes) returns Forbidden? {
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

### 4.1. Basic Auth Provider
The Basic Auth Provider has an API to generate the Basic Auth credential. The `CredentialsConfig` record is used to 
provide the configuration related to the token generation. This returns the generated token.

```ballerina
public type CredentialsConfig record {|
    string username;
    string password;
|};

public class ClientBasicAuthProvider {

    public function init(CredentialsConfig config) {
        // init basic auth provider
    }
    
    public function generateToken() returns string|Error {
        // generate the base64 encoded `username:password` value
    }
}
```

### 4.2. Basic Auth Handler

> **NOTE**: Since the auth handlers are tightly bound with the transport protocol, for the explanation of the concept, 
> all the samples are created for HTTP transport protocol hereinafter.

The Basic Auth Handler has an API to enrich the HTTP request as defined in 
[RFC7617 Section 2](https://datatracker.ietf.org/doc/html/rfc7617#section-2) using the File User Store defined in TOML 
language. This returns the enriched `Request` with headers or `Error` in case of failure.

```ballerina
import ballerina/auth;

public type CredentialsConfig record {|
    *auth:CredentialsConfig;
|};

public class ClientBasicAuthHandler {

    private final auth:ClientBasicAuthProvider provider;
    
    public function init(CredentialsConfig config) {
        self.provider = new (config);
    }
    
    public function enrich(Request req) returns Request|Error {
        string|auth:Error token = self.provider.generateToken();
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

##### 5.1.1.1. File User Store

```ballerina
import ballerina/http;

@http:ServiceConfig {
    auth: [
        {
            fileUserStoreConfig: {},
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

##### 5.1.1.2. LDAP User Store

```ballerina
import ballerina/http;

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
service /foo on new http:Listener(9090) {
    resource function get bar() returns string {
        return "Hello, World!";
    }
}
```

#### 5.1.2. Imperative Approach (HTTP Listener)

##### 5.1.2.1. File User Store

```ballerina
import ballerina/http;
import ballerina/auth;

http:FileUserStoreConfig config = {};
http:ListenerFileUserStoreBasicAuthHandler handler = new (config);

service /foo on new http:Listener(9090) {
    resource function post bar(@http:Header string Authorization) returns string|http:Unauthorized|http:Forbidden {
        auth:UserDetails|http:Unauthorized authn = handler.authenticate(Authorization);
        if (authn is http:Unauthorized) {
            return authn;
        }
        http:Forbidden? authz = handler.authorize(<auth:UserDetails>authn, "admin");
        if (authz is http:Forbidden) {
            return authz;
        }
        // business logic
    }
}
```

##### 5.1.2.2. LDAP User Store

```ballerina
import ballerina/http;
import ballerina/auth;

http:LdapUserStoreConfig config = {
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
};
http:ListenerLdapUserStoreBasicAuthHandler handler = new (config);

service /foo on new http:Listener(9090) {
    resource function post bar(@http:Header string Authorization) returns string|http:Unauthorized|http:Forbidden {
        auth:UserDetails|http:Unauthorized authn = handler->authenticate(Authorization);
        if (authn is http:Unauthorized) {
            return authn;
        }
        http:Forbidden? authz = handler->authorize(<auth:UserDetails>authn, "admin");
        if (authz is http:Forbidden) {
            return authz;
        }
        // business logic
}
}
```

### 5.2. Client Auth

#### 5.2.1. Declarative Approach (HTTP Client)

```ballerina
import ballerina/http;

http:Client c = check new ("https://localhost:9090",
    auth = {
        username: "tom",
        password: "123"
    }
);

public function main() returns error? {
    json response = check c->get("/foo/bar");
    // evaluate response
}
```

#### 5.2.2. Imperative Approach (HTTP Client)

```ballerina
import ballerina/http;

http:CredentialsConfig config = {
    username: "tom",
    password: "123"
};
http:ClientBasicAuthHandler handler = new (config);

http:Client c = check new ("https://localhost:9090");

public function main() returns error? {
    http:Request req = new;
    req = check handler.enrich(req);
    json response = check c->get("/foo/bar");
    // evaluate response
}
```
