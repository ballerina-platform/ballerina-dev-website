---
layout: ballerina-left-nav-pages
title: How to Write Secure Ballerina Programs
description: Check out the different security features and controls available within the Ballerina programming language and follow the guidelines on writing secure Ballerina programs.
keywords: ballerina, programming language, security, secure ballerina code
permalink: /learn/how-to-write-secure-ballerina-code/
active: how-to-write-secure-ballerina-code
redirect_from:
  - /learn/how-to-write-secure-ballerina-code
  - /v1-2/learn/how-to-write-secure-ballerina-code
  - /v1-2/learn/how-to-write-secure-ballerina-code/
---

# How to Write Secure Ballerina Programs

This document demonstrates different security features and controls available within Ballerina, and serves the purpose of providing guidelines on writing secure Ballerina programs.


**Table of Contents**

<ul>
<li><a href="#secure-by-design">Secure by Design</a>
<ul>
<li><a href="#ensuring-security-of-ballerina-standard-libraries">Ensuring security of Ballerina standard libraries</a></li>
<li><a href="#securely-using-tainted-data-with-security-sensitive-parameters">Securely using tainted data with security-sensitive parameters</a></li>
</ul>
</li>
<li><a href="#securing-passwords-and-secrets">Securing Passwords and Secrets</a></li>
<li><a href="#authentication-and-authorization">Authentication and Authorization</a>
<ul>
<li><a href="#inbound-authentication--authorization">Inbound Authentication &amp; Authorization</a>
<ul>
<li><a href="#inbound-advanced-use-cases">Inbound Advanced Use Cases</a>
<ul>
<li><a href="#using-multiple-auth-handlers">Using Multiple Auth Handlers</a></li>
<li><a href="#using-multiple-scopes">Using Multiple Scopes</a></li>
<li><a href="#per-resource-and-per-service-customization">Per-Resource and Per-Service Customization</a></li>
<li><a href="#implementing-inbound-custom-authentication-mechanism">Implementing Inbound Custom Authentication Mechanism</a></li>
<li><a href="#disable-https-enforcement">Disable HTTPS Enforcement</a></li>
<li><a href="#modify-authn-or-authz-filter-index">Modify Authn or Authz Filter Index</a></li>
</ul>
</li>
<li><a href="#jwt-inbound-authentication-and-authorization">JWT Inbound Authentication and Authorization</a></li>
<li><a href="#oauth2-inbound-authentication-and-authorization">OAuth2 Inbound Authentication and Authorization</a></li>
<li><a href="#ldap-inbound-authentication-and-authorization">LDAP Inbound Authentication and Authorization</a></li>
<li><a href="#basic-auth-inbound-authentication-and-authorization">Basic Auth Inbound Authentication and Authorization</a></li>
</ul>
</li>
<li><a href="#outbound-authentication--authorization">Outbound Authentication &amp; Authorization</a>
<ul>
<li><a href="#outbound-advanced-use-cases">Outbound Advanced Use Cases</a>
<ul>
<li><a href="#implementing-outbound-custom-authentication-mechanism">Implementing Outbound Custom Authentication Mechanism</a></li>
</ul>
</li>
<li><a href="#jwt-outbound-authentication">JWT Outbound Authentication</a></li>
<li><a href="#oauth2-outbound-authentication">OAuth2 Outbound Authentication</a>
<ul>
<li><a href="#client-credentials-grant-type">Client Credentials Grant Type</a></li>
<li><a href="#password-grant-type">Password Grant Type</a></li>
<li><a href="#direct-token-mode">Direct Token Mode</a></li>
</ul>
</li>
<li><a href="#basic-auth-outbound-authentication">Basic Auth Outbound Authentication</a></li>
<li><a href="#token-propagation-for-outbound-authentication">Token Propagation for Outbound Authentication</a>
<ul>
<li><a href="#example---1">Example - 1</a></li>
<li><a href="#example---2">Example - 2</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>

## Secure by Design

This approach makes it unnecessary for developers to review best practice coding lists that itemize how to avoid security vulnerabilities. The Ballerina compiler ensures that Ballerina programs do not introduce security vulnerabilities.

A taint analysis mechanism is used to achieve this.

Parameters in function calls can be designated as security-sensitive. The compiler will generate an error if you pass untrusted data (tainted data) into a security-sensitive parameter:

```
tainted value passed to sensitive parameter 'sqlQuery'
```

We require developers to explicitly mark all values passed into security-sensitive parameters as 'trusted'. This explicit check forces developers and code reviewers to verify that the values being passed into the parameter are not vulnerable to a security violation.

Ballerina standard library makes sure untrusted data cannot be used with security sensitive parameters such as SQL queries, file paths, file name, permission flags, request URLs and configuration keys, preventing  vulnerabilities, including:

* SQL Injection
* Path Manipulation
* File Manipulation
* Unauthorized File Access
* Unvalidated Redirect (Open Redirect)

### Ensuring security of Ballerina standard libraries

Security-sensitive functions and remote methods of Ballerina standard libraries are annotated with the `@untainted` parameter annotation. This denotes that untrusted (tainted) data should not be passed to the parameter. 

For example, the `sqlQuery` parameter of the `ballerinax/java.jdbc` `select` remote method is annotated as `@untainted`.

```ballerina
public remote function select(@untainted string sqlQuery, 
                              typedesc<record{}>? recordType, 
                              Param... parameters) 
                        returns @tainted table<record {}>|Error
```

The following example constructs an SQL query with a tainted argument:

```ballerina
import ballerinax/java.jdbc;

type ResultStudent record {
    string name;
};

public function main(string... args) {

    jdbc:Client testDB = new({
        url: "jdbc:mysql://localhost:3306/testdb",
        username: "test",
        password: "test",
        poolOptions: { maximumPoolSize: 5 },
        dbOptions: { useSSL: false }
    });

   // Construct student ID based on user input.
   string studentId = "S_" + args[0];

   // Execute select query using the untrusted (tainted) student ID
   var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = " + studentId,
                           ResultStudent);
   testDB.stop();
}
```

The Ballerina compiler will generate an error:

```
tainted value passed to sensitive parameter 'sqlQuery'
```

In order to compile, the program is modified to use query parameters:

```ballerina
jdbc:Parameter paramId = {sqlType:jdbc:TYPE_VARCHAR, value:studentId};
var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = ?", ResultStudent,
                        paramId);
```

Command-line arguments passed to Ballerina programs and inputs received through service resources are considered as tainted. Additionally, return values of certain functions are marked with the `@tainted` annotation to denote that the resulting value should be considered as untrusted data.

For example, the `select` remote method of the `java:jdbc` client highlighted above returns a `@tainted table<record {}>|Error`. This means that any value read from a database is considered as untrusted.

When the Ballerina compiler can determine that a function is returning tainted data without tainted data being passed in as parameters to that function, it is required to annotate the function's return type as `@tainted`. If not, the function author has to clean up the data before returning. For instance, if you are to read from the database and return that result, you either need to annotate that function's return type as `@tainted` or you have to clean up and make sure the returned data is not tainted.

### Securely using tainted data with security-sensitive parameters

There can be certain situations where a tainted value must be passed into a security-sensitive parameter. In such situations, it is essential to do proper data validation or data sanitization to make sure the input does not result in a security threat. Once proper controls are in place, the `@untainted` annotation can be used with a type cast operator to denote that the value is trusted:

```ballerina
// Execute select query using the untrusted (tainted) student ID
boolean isValid = isNumeric(studentId);
if (isValid) {
   var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = " +
                           <@untainted> studentId, ResultStudent);
}
// ...
```

Additionally, return values can be annotated with`@untainted`. This denotes that the return value should be trusted (even if the return value is derived from tainted data):

```ballerina
// Execute the select query using the untrusted (tainted) student ID
function sanitizeSortColumn (string columnName) returns @untainted string {
   string sanitizedSortColumn = columnName;
   // Insert sanitization logic to ensure that the return value is safe.
   return sanitizedSortColumn;
}
// ...
```

## Securing Passwords and Secrets

Ballerina provides an API to access configuration values from different sources. For more information, see [Config Ballerina by Example](/learn/by-example/config-api.html).

Configuration values containing passwords or secrets should be encrypted. The Ballerina Config API will decrypt such configuration values when being accessed.

Use the following command to encrypt a configuration value:

```cmd
$ ballerina encrypt
```

The encrypt command will prompt for the plain-text value to be encrypted and an encryption secret.

```cmd
$ ballerina encrypt
Enter value: 

Enter secret: 

Re-enter secret to verify: 

Add the following to the configuration file:
<key>="@encrypted:{hcBLnR+b4iaGS9PEtCMSQOUXJQTQo+zknNxCkpZ0t7w=}"

Or provide it as a command line argument:
--<key>=@encrypted:{hcBLnR+b4iaGS9PEtCMSQOUXJQTQo+zknNxCkpZ0t7w=}
```

Ballerina uses AES, CBC mode with PKCS#5 padding for encryption. The generated encrypted value should be used in place of the plain-text configuration value.

For example, contents of a configuration file that includes a secret value should look as follows:

```
api.secret="@encrypted:{hcBLnR+b4iaGS9PEtCMSQOUXJQTQo+zknNxCkpZ0t7w=}"
api.provider="not-a-security-sensitive-value"
```

When running a Ballerina program that uses encrypted configuration values, Ballerina will require the secret used during the encryption process to perform the decryption.

Ballerina will first look for a file named `secret.txt`. If such file exists, Ballerina will read the decryption secret from the file and immediately remove the file to make sure secret cannot be accessed afterwards. If the secret file is not present, the Ballerina program will prompt for the decryption secret.

The file based approach is useful in automated deployments. The file containing the decryption secret can be deployed along with the Ballerina program. The name and the path of the secret file can be configured using the `ballerina.config.secret` runtime parameter:

```
$ ballerina run --b7a.config.secret=path/to/secret/file securing_configuration_values.bal
```

## Authentication and Authorization

### Inbound Authentication & Authorization

Ballerina HTTP services can be configured to enforce authentication and authorization. Ballerina has built-in support for the following inbound authentication mechanisms whereas it is possible to add custom mechanisms: 

- Basic authentication
- JWT authentication
- OAuth2 authentication
- LDAP authentication

Ballerina inbound authentication is abstracted out into 2 layers called `http:InboundAuthHandler` and `auth:InboundAuthProvider`.

The `auth:InboundAuthProvider` is a protocol-independent entity that only knows how to authenticate a user when the necessary information is provided. The `http:InboundAuthHandler` can be protocol dependent. Even-though the current focus is on HTTP, the `ballerina/auth` module can operate with other protocols as well.

The `http:InboundAuthHandler` is used to perform HTTP-level actions, which are extracting the required HTTP header or body, extracting the credentials out of it, passing them into the associated `auth:InboundAuthProvider`, and getting the credentials validated. The `auth:InboundAuthProvider` is used to validate the credentials passed by the `http:InboundAuthHandler`.

In a particular authentication scheme, the implemented instance of the `auth:InboundAuthProvider` is initialized with the required configurations and it is passed to the implemented instance of the `http:InboundAuthHandler`.

Next, the implemented instance of  the `http:InboundAuthHandler` is passed to the `http:Listener` configuration as follows and the listener is initialized with authentication.

The following example represents how a listener is secured with Basic Auth with the above-mentioned configurations.

```ballerina
import ballerina/auth;
import ballerina/http;
import ballerina/config;

auth:InboundBasicAuthProvider basicAuthProvider = new;
http:BasicAuthHandler basicAuthHandler = new(basicAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [basicAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
service helloWorld on secureHelloWorldEp {
// ....
}
```

> **Note:** It is a must to use HTTPS when enforcing authentication and authorization checks, to ensure the confidentiality of sensitive authentication data.

Optionally, the `scopes` attribute is configured for the authorization as follows. If it is not specified, that means the service is authorized for any authenticated user.

```ballerina
listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [authHandler],
        scopes: ["test-scope"]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
service helloWorld on secureHelloWorldEp {
// ....
}
```

#### Inbound Advanced Use Cases

##### Using Multiple Auth Handlers

The `authHandlers` can be configured for advanced use cases, which use multiple auth handlers as follows:

Case 1: Auth should be successful for `authHandler1` OR `authHandler1`.
`authHandlers: [authHandler1, authHandler2]`

Case 2: Auth should be successful for `authHandler1` AND `authHandler12`.
`authHandlers: [[authHandler1], [authHandler2]]`

Case 3: Auth should be successful for ((`authHandler1` OR `authHandler2`) AND (`authHandler3` OR `authHandler4`)).
`authHandlers: [[authHandler1, authHandler2], [authHandler3, authHandler4]]`

```ballerina
listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [authHandler1, authHandler2]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
service helloWorld on secureHelloWorldEp {
// ....
}
```

##### Using Multiple Scopes

The `scopes` can be configured for advanced use cases as follows:

Case 1: Auth should be successful for `scope-1` OR `scope-2`.
`scopes: ["scopes-1", "scopes-2"]`

Case 2: Auth should be successful for `scope-1` AND `scope-2`.
`scopes: [["scopes-1"], ["scopes-2"]]`

Case 3: Auth should be successful for ((`scope-1` OR `scope-2`) AND (`scope-3` OR `scope-4`)).
`scopes: [["scopes-1", "scopes-2"], ["scopes-3", "scopes-4"]]`

```ballerina
listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [authHandler],
        scopes: ["scopes-1", "scopes-2"]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
service helloWorld on secureHelloWorldEp {
// ....
}
```

##### Per-Resource and Per-Service Customization

The security enforcements can be customized by the `@http:ServiceConfig` annotation and the `@http:ResourceConfig` annotation.

For example, authentication and authorization can be modified for a particular service as follows by configuring the `auth` attribute of the `@http:ServiceConfig`.
* Authentication can be disabled only for a particular service by using the `enabled` attribute
* The authentication mechanism can be changed for a particular service by using the `authHandlers` attribute
* Authorization scopes can be changed for a particular service by using the `scopes` attribute

```ballerina
@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        enabled: false,
        authHandlers: [authHandlerA],
        scopes: ["scope-A"]
    }
}
service helloWorld on secureHelloWorldEp {
// ...
}
```

Further, authentication and authorization can be modified for a particular resource as follows by configuring the `auth` attribute of the `@http:ResourceConfig`:

```ballerina
@http:ResourceConfig {
    basePath: "/",
    auth: {
        enabled: false,
        authHandlers: [authHandlerA],
        scopes: ["scope-A"]
    }
}
resource function sayHello (http:Caller caller, http:Request req) {
// ...
}
```

The same configuration patterns used for the listener-level configurations are applied for `authHandlers` and the `scopes` attributes in service-level configurations and resource-level configurations.

##### Implementing Inbound Custom Authentication Mechanism

The user can implement a custom version of AuthHandler and AuthProvider with the use of the object-equivalency pattern as follows. With that, the `http:Listener` can be enforced with custom authentication and authorization mechanisms.

```ballerina
public type InboundCustomAuthHandler object {

    *http:InboundAuthHandler;

    public function canProcess(http:Request req) returns @tainted boolean {
        // Custom logic to check whether the request can be processed.
    }
    
    public function process(http:Request req) returns boolean|http:AuthenticationError {
        // Custom logic to process the request, extract the credentials, and get them validated from the AuthProvider.
    }
};
```

```ballerina
public type InboundCustomAuthProvider object {

    *auth:InboundAuthProvider;

    public function authenticate(string credential) returns boolean|auth:Error {
        // Custom logic to authenticate the given credentials.
    }
};
```

##### Disable HTTPS Enforcement

The enforcement of HTTPS can be disabled by configuring the value `mandateSecureSocket` into `false` as follows:

```ballerina
listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [authHandler],
        mandateSecureSocket: false
    }
});
service helloWorld on secureHelloWorldEp {
// ....
}
```

##### Modify Authn or Authz Filter Index

The authn/authz filters are engaged as the top most filters of the filter array, which is configured in the HTTP listener configuration. The uer can configure the index of the authn/authz filters if it is needed to engage a custom filter before the authn/authz filters.

The `position` attribute represents the authn/authz filter position of the filter array. The position values starts from 0 and it is set to 0 implicitly.

The following example engages the authn/authz filters in between the `customFilter1` and `customFilter2`. Then, the internally-updated filter chain would be `[customFilter1, authnFilter, authzFilter, customFilter2]`.

```ballerina
listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [authHandler],
        position: 1
    },
    filters: [customFilter1, customFilter2],
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
service helloWorld on secureHelloWorldEp {
// ....
}
```

#### JWT Inbound Authentication and Authorization

Ballerina supports JWT Authentication and Authorizations for services. The `http:BearerAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credential from the header value which is `Bearer <token>`. Then the extracted credential will be passed to the initialized AuthProvider and get validated. The `jwt:InboundJwtAuthProvider` is used to validate the credentials (JWT) passed by the AuthHandler against the `jwt:JwtValidatorConfig` provided by the user.

JWT validation requires several additional configurations for the `jwt:JwtValidatorConfig` including:

* `issuer` - The issuer of the JWT
* `audience` - The audience value for the current service
* `clockSkewInSeconds` - Clock skew in seconds that can be used to avoid token validation failures due to clock synchronization problems
* `trustStoreConfig` - JWT trust store configurations
  * `trustStore` - Trust store used for signature verification
  * `certificateAlias` - Token-signed public key certificate alias
* `jwtCache` - Cache used to store parsed JWT information as `CachedJwt`

The `jwt:JwtValidatorConfig` record should be provided into the `jwt:InboundJwtAuthProvider` when initializing. The initialized `jwt:InboundJwtAuthProvider` is passed to the `http:BearerAuthHandler.

> **Note:** For demonstration purposes, the `ballerinaTruststore.p12` included with Ballerina runtime is used. In a production deployment, the truststore should only contain the public key certificates of the trusted JWT issuers.

```ballerina
import ballerina/http;
import ballerina/jwt;
import ballerina/config;

jwt:InboundJwtAuthProvider jwtAuthProvider = new({
    issuer: "ballerina",
    audience: ["ballerina.io"],
    trustStoreConfig: {
        certificateAlias: "ballerina",
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
http:BearerAuthHandler jwtAuthHandler = new(jwtAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [jwtAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello"
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/",
        auth:{
            scopes:["hello"],
            enabled: true
        }
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< 
Authentication failure
```

Once a request is made with a valid, signed JWT, but without the expected "scope", an authorization failure will occur. An example of a JWT without "scope" attribute is as follows.

```
{
  "sub": "ballerina",
  "iss": "ballerina",
  "exp": 2818415019,
  "iat": 1524575019,
  "jti": "f5aded50585c46f2b8ca233d0c2a3c9d",
  "aud": [
    "ballerina",
    "Ballerina.org",
    "ballerina.io"
  ]
}
```

```
curl -k -v https://localhost:9091/hello -H "Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdfQ.X2mHWCr8A5UaJFvjSPUammACnTzFsTdre-P5yWQgrwLBmfcpr9JaUuq4sEwp6to3xSKN7u9QKqRLuWH1SlcphDQn6kdF1ZrCgXRQ0HQTilZQU1hllZ4c7yMNtMgMIaPgEBrStLX1Ufr6LpDkTA4VeaPCSqstHt9WbRzIoPQ1fCxjvHBP17ShiGPRza9p_Z4t897s40aQMKbKLqLQ8rEaYAcsoRBXYyUhb_PRS-YZtIdo7iVmkMVFjYjHvmYbpYhNo57Z1Y5dNa8h8-4ON4CXzcJ1RzuyuFVz1a3YL3gWTsiliVmno7vKyRo8utirDRIPi0dPJPuWi2uMtJkqdkpzJQ"

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJ
pbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwian
RpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiY
mFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdfQ.X2mHWCr8A5UaJFvjSPUammACnTzFsTdre-P5y
WQgrwLBmfcpr9JaUuq4sEwp6to3xSKN7u9QKqRLuWH1SlcphDQn6kdF1ZrCgXRQ0HQTilZQU1hllZ4c
7yMNtMgMIaPgEBrStLX1Ufr6LpDkTA4VeaPCSqstHt9WbRzIoPQ1fCxjvHBP17ShiGPRza9p_Z4t897
s40aQMKbKLqLQ8rEaYAcsoRBXYyUhb_PRS-YZtIdo7iVmkMVFjYjHvmYbpYhNo57Z1Y5dNa8h8-4ON4
CXzcJ1RzuyuFVz1a3YL3gWTsiliVmno7vKyRo8utirDRIPi0dPJPuWi2uMtJkqdkpzJQ
>

< HTTP/1.1 403 Forbidden
< content-type: text/plain
<
Authorization failure
```

A request with a correct "scope" attribute will result in a successful invocation. An example of a JWT that has the correct "scope" attribute is as follows.

```
{
  "sub": "ballerina",
  "iss": "ballerina",
  "exp": 2818415019,
  "iat": 1524575019,
  "jti": "f5aded50585c46f2b8ca233d0c2a3c9d",
  "aud": [
    "ballerina",
    "ballerina.org",
    "ballerina.io"
  ],
  "scope": "hello"
}
```

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bNoqz9_DzgeKSK6ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZwC3glAmRBrl4BYCbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOin1R3lJCPspJ2ey_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSwKw5ZoVJrCUiNG5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvcabuid80lnrs2-mAEcstgiHVw'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZX
JpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwia
nRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwi
YmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bNoqz9_DzgeKSK6
ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZwC3glAmRBrl4BY
CbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOin1R3lJCPspJ2e
y_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSwKw5ZoVJrCUiNG
5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvcabuid80lnrs2-
mAEcstgiHVw
>

< HTTP/1.1 200 OK
< content-type: text/plain
<
Hello, World!
```

#### OAuth2 Inbound Authentication and Authorization

Ballerina supports OAuth2 Authentication and Authorization for services. The `http:BearerAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credentials from the header value, which is the `Bearer <token>`. Then, the extracted credentials will be passed to the initialized AuthProvider to get them validated. The `oauth2:InboundOAuth2Provider` is used to validate the credentials passed by the AuthHandler against the introspection endpoint configured at `oauth2:IntrospectionServerConfig`, which is provided by the user.

OAuth2 token validation requires several additional configurations for the `oauth2:IntrospectionServerConfig` including:

* `url` - URL of the introspection server
* `tokenTypeHint` - A hint about the type of the token submitted for introspection
* `clientConfig` - HTTP client configurations, which calls the introspection server

The `oauth2:IntrospectionServerConfig` record should be provided into the `oauth2:InboundOAuth2Provider` when initializing and the initialized `oauth2:InboundOAuth2Provider` is passed to the `http:BearerAuthHandler`.

```ballerina
import ballerina/http;
import ballerina/oauth2;
import ballerina/config;

oauth2:InboundOAuth2Provider oauth2Provider = new({
    url: "https://localhost:9196/oauth2/token/introspect",
    tokenTypeHint: "access_token"
});
http:BearerAuthHandler oauth2Handler = new(oauth2Provider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [oauth2Handler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello"
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< 
Authentication failure
```

Once a request is made with a valid, authentication information, but if the introspection endpoint does not respond with the "scope" attribute of the response JSON payload or respond with the "scope" attribute, which are not the expected scopes, an authorization failure will occur.

```
curl -k -v https://localhost:9091/hello -H "Authorization:Bearer <token>"

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization:Bearer <token>
>

< HTTP/1.1 403 Forbidden
< content-type: text/plain
<
Authorization failure
```

A request, which gets a successful response from the introspection endpoint with a correct "scope" attribute will result in a successful invocation.

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Bearer <token>'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 200 OK
< content-type: text/plain
<
Hello, World!
```

#### LDAP Inbound Authentication and Authorization

Ballerina supports LDAP Authentication and Authorizations for services. The `http:BasicAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credentials from the header value, which is `Basic <token>`. Then, the extracted credentials will be passed to the initialized AuthProvider to get validated. The `ldap:InboundLdapAuthProvider` is used to validate the credentials passed by the AuthHandler against the LDAP server configured at `ldap:LdapConnectionConfig`, which is provided by the user.

LDAP token validation requires several additional configurations for the `ldap:LdapConnectionConfig` including:

* `domainName` - Unique name to identify the user store
* `connectionURL` - Connection URL to the LDAP server
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
* `retryAttempts` - Retry the authentication request if a timeout happened
* `secureClientSocket` - The SSL configurations for the LDAP client socket. This needs to be configured in order to communicate through LDAPs

The `ldap:LdapConnectionConfig` record should be provided into the `ldap:InboundLdapAuthProvider` when initializing and the initialized `ldap:InboundLdapAuthProvider` is passed to the `http:BasicAuthHandler`.

```ballerina
import ballerina/http;
import ballerina/ldap;
import ballerina/config;

ldap:LdapConnectionConfig ldapConfig = {
    domainName: "ballerina.io",
    connectionURL: "ldap://localhost:20100",
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
    readTimeoutInMillis: 60000,
    retryAttempts: 3
};
ldap:InboundLdapAuthProvider ldapAuthProvider = new(ldapConfig, "ldap01");
http:BasicAuthHandler ldapAuthHandler = new(ldapAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [ldapAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< 
Authentication failure
```

Once a request is made with a valid, authentication information, but if the LDAP server responds with an empty group list or unexpected scopes, an authorization failure will occur.

```
curl -k -v https://localhost:9091/hello -H "Authorization: Basic <token>"

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization:Bearer <token>
>

< HTTP/1.1 403 Forbidden
< content-type: text/plain
<
Authorization failure
```

A request, which gets a successful response from the LDAP server for the "scope" request will result in a successful invocation.

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Basic <token>'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 200 OK
< content-type: text/plain
<
Hello, World!
```

#### Basic Auth Inbound Authentication and Authorization

Ballerina supports Basic Authentication and Authorizations for services. The `http:BasicAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credential from the header value, which is the `Basic <token>`. Then, the extracted credentials will be passed to the initialized AuthProvider and gets validated. The `jwt:InboundBasicAuthProvider` is used to read the user information from the configuration file and authenticate the credentials passed by the AuthHandler.

```ballerina
import ballerina/auth;
import ballerina/http;
import ballerina/config;

auth:InboundBasicAuthProvider basicAuthProvider = new;
http:BasicAuthHandler basicAuthHandler = new(basicAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [basicAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

To enforce Basic Authentication, users and scopes should be configured through a configuration file. The following example file introduces two users. The `generalUser` has no scopes and the `admin` user has the `hello` scope.

**sample-users.toml**
```
[b7a.users]

[b7a.users.generalUser]
password="@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}"

[b7a.users.admin]
password="@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}"
scopes="hello"
```

Restart the service using the following command.

```
ballerina run --config sample-users.toml basic_auth_sample.bal
```

Since passwords are encrypted, the Config API will request for the decryption key. Use `ballerina` as the decryption key in this sample.

Also, the passwords can be hashed and provided with the configuration file. The following example file introduces three users along with the passwords hashed with `sha256`, `sha384`, and `sha512` hashing algorithms.

**sample-users.toml**
```
[b7a.users]

[b7a.users.userA]
password="@sha256:{cd2eb0837c9b4c962c22d2ff8b5441b7b45805887f051d39bf133b583baf6860}"

[b7a.users.userB]
password="@sha384:{1249e15f035ed34786a328d9fdb2689ab24f7c7b253d1b7f66ed92a679d663dd502d7beda59973e8c91a728b929fc8cd}"

[b7a.users.userC]
password="@sha512:{9057ff1aa9509b2a0af624d687461d2bbeb07e2f37d953b1ce4a9dc921a7f19c45dc35d7c5363b373792add57d0d7dc41596e1c585d6ef7844cdf8ae87af443f}"
```

Once the service is restarted with the first configuration file in place, the `generalUser` will not be able to invoke the service due to authorization failure:

```
curl -k -v -u generalUser:password https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*

< HTTP/1.1 403 Forbidden
< content-type: text/plain
<
Authorization failure
```

'Admin' users will be able to invoke the service:

```
curl -k -v -u admin:password https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*

< HTTP/1.1 200 OK
< content-type: text/plain
<
Hello, World!
```

---

### Outbound Authentication & Authorization

The Ballerina HTTP client can be configured to send authentication and authorization information to the endpoint being invoked. Ballerina has built-in support for the following outbound authentication mechanisms, whereas it is possible to add custom mechanisms:

- Basic authentication
- JWT authentication
- OAuth2 authentication

Ballerina outbound authentication is also abstracted out into 2 layers called `http:OutboundAuthHandler` and `auth:OutboundAuthProvider`.

The `auth:OutboundAuthProvider` is a protocol-independent entity, which only knows how to generate credentials with the necessary information provided by the user. The `http:OutboundAuthHandler` can be protocol dependent. Even-though the current focus is on HTTP, the `ballerina/auth` module can operate with other protocols as well.

The `auth:OutboundAuthProvider` is used to create the credentials according to the provided configurations. The `http:OutboundAuthHandler` is used to get the created credentials from the `auth:OutboundAuthProvider` and perform HTTP-level actions, which are adding the required HTTP headers or body using the received credentials.

In a particular authentication scheme, the implemented instance of the `auth:OutboundAuthProvider` is initialized with required configurations and it is passed to the implemented instance of the `http:OutboundAuthHandler`.

Next, the implemented instance of  the `http:OutboundAuthHandler` is passed to the `http:Client` configuration as follows and the client is initialized with authentication.

The following example represents how a client is secured with Basic Auth with the above-mentioned configurations.

```ballerina
import ballerina/auth;
import ballerina/http;
import ballerina/config;

auth:OutboundBasicProvider basicAuthProvider = new({
    username: "user",
    password: "ballerina"
});
http:BasicAuthHandler basicAuthHandler = new(basicAuthProvider);

http:Client secureHelloWorldClient = new("https://localhost:9092", {
    auth: {
        authHandler: basicAuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

> **Note:** It is better to use HTTPS when enforcing authentication and authorization checks to ensure the confidentiality of sensitive authentication data.

#### Outbound Advanced Use Cases

##### Implementing Outbound Custom Authentication Mechanism

The user can implement a custom version of the AuthHandler and AuthProvider with the use of the object equivalency pattern as follows. With that, the `http:Client` can be enforced with custom authentication and authorization mechanisms.

```ballerina
public type OutboundCustomAuthHandler object {

    *http:OutboundAuthHandler;

    public function prepare(http:Request req) returns http:Request|http:AuthenticationError {
        // Custom logic to prepare the request.
    }

    public function inspect(http:Request req, http:Response resp) returns http:Request|http:AuthenticationError? {
        // Custom logic to inspect the request after the initial outbound call.
    }
};
```

```ballerina
public type OutboundCustomAuthProvider object {

    *auth:OutboundAuthProvider;

    public function generateToken() returns string|auth:Error {
        // Custom logic to generate the token. 
    }

    public function inspect(map<anydata> data) returns string|auth:Error? {
        // Custom logic to inspect the data map received from the AuthHandler. 
    }
};
```

#### JWT Outbound Authentication

Ballerina supports JWT Authentication for clients. The `jwt:OutboundJwtAuthProvider` is used to issue a JWT against the `jwt:JwtIssuerConfig` provided by the user. The `http:BearerAuthHandler` is used to add the HTTP `Authorization` header with the value received from the AuthProvider as the `Bearer <token>`.

JWT issuing requires several additional configurations for the `jwt:JwtIssuerConfig` including:

* `username` - JWT token username
* `issuer` - JWT token issuer
* `audience` - JWT token audience
* `customClaims` - Map of custom claims
* `expTime` - JWT token expiry time
* `keyStoreConfig` - JWT key store configurations
  * `keyStore` - Keystore to be used in JWT signing
  * `keyAlias` - Signing key alias
  * `keyPassword` - Signing key password
* `signingAlg` - JWT signing algorithm
  * `jwt:RS256` - The RSA-SHA256 algorithm
  * `jwt:RS384` - The RSA-SHA384 algorithm
  * `jwt:RS512` - The RSA-SHA512 algorithm
  * `jwt:NONE` - Unsecured JWTs (no signing)

The`jwt:JwtIssuerConfig` record should be provided into the `jwt:OutboundJwtAuthProvider` when initializing and the initialized `jwt:OutboundJwtAuthProvider` is passed to the `http:BearerAuthHandler`.

```ballerina
import ballerina/http;
import ballerina/jwt;
import ballerina/config;

jwt:OutboundJwtAuthProvider jwtAuthProvider = new({
    username: "ballerinaUser",
    issuer: "ballerina",
    audience: ["ballerina.io"],
    keyStoreConfig: {
        keyAlias: "ballerina",
        keyPassword: "ballerina",
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
http:BearerAuthHandler jwtAuthHandler = new(jwtAuthProvider);

http:Client downstreamServiceEP = new("https://localhost:9091", {
    auth: {
        authHandler: jwtAuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

The `http:Client` defined in the program calls the the `http:Listener`, which is secured with JWT authentication (For more information, see the example added under JWT inbound authentication).

#### OAuth2 Outbound Authentication

Ballerina supports OAuth2 Authentication for clients. It supports the Client Credentials grant type, Password grant type, and Direct Token mode, in which, the credentials can be provided manually and after that refreshing is handled internally.

The `oauth2:OutboundOAuth2Provider` is used to create a token against the configuration provided by the user. It can be the `oauth2:ClientCredentialsGrantConfig`, `oauth2:PasswordGrantConfig`, or `oauth2:DirectTokenConfig` according to the grant type that is required by the user. The `http:BearerAuthHandler` is used to add the HTTP `Authorization` header with the value received from the AuthProvider as the `Bearer <token>`.

##### Client Credentials Grant Type

OAuth2 token issuing requires several additional configurations for the `oauth2:ClientCredentialsGrantConfig` including:

* `tokenUrl` - Token URL for the authorization endpoint
* `clientId` - Client ID for the client credentials grant authentication
* `clientSecret` - Client secret for the client credentials grant authentication
* `scopes` - Scope of the access request
* `clockSkewInSeconds` - Clock skew in seconds
* `retryRequest` - Retry the request if the initial request returns a 401 response
* `credentialBearer` - How authentication credentials are sent to the authorization endpoint
  * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
  * `http:POST_BODY_BEARER | NO_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations,which calls the authorization endpoint

The `oauth2:ClientCredentialsGrantConfig` record should be provided into the `oauth2:OutboundOAuth2Provider` when initializing and the initialized `oauth2:OutboundOAuth2Provider` is passed to the `http:BearerAuthHandler`.

```ballerina
import ballerina/http;
import ballerina/oauth2;
import ballerina/config;

oauth2:OutboundOAuth2Provider oauth2Provider = new({
    tokenUrl: "https://localhost:9196/oauth2/token/authorize",
    clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxStwNEW4cfStBEGRxRL68",
    clientSecret: "9205371918321623741",
    scopes: ["token-scope1", "token-scope2"]
});
http:BearerAuthHandler oauth2AuthHandler = new(oauth2Provider);

http:Client downstreamServiceEP = new("https://localhost:9091", {
    auth: {
        authHandler: oauth2AuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

##### Password Grant Type

OAuth2 token issuing requires several additional configurations for the `oauth2:PasswordGrantConfig` including:

* `tokenUrl` - Token URL for the authorization endpoint
* `username` - Username for password grant authentication
* `password` - Password for password grant authentication
* `clientId` - Client ID for password grant authentication
* `clientSecret` - Client secret for password grant authentication
* `scopes` - Scope of the access request
* `refreshConfig` - Configurations for refreshing the access token
  * `refreshUrl` - Refresh token URL for the refresh token server
  * `scopes` - Scope of the access request
  * `credentialBearer` - How authentication credentials are sent to the authorization endpoint
  * `clientConfig` - HTTP client configurations, which calls the authorization endpoint
* `clockSkewInSeconds` - Clock skew in seconds
* `retryRequest` - Retry the request if the initial request returns a 401 response
* `credentialBearer` - How authentication credentials are sent to the authorization endpoint
  * `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
  * `http:POST_BODY_BEARER|NO_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request
* `clientConfig` - HTTP client configurations, which calls the authorization endpoint

The `oauth2:PasswordGrantConfig` record should be provided into the `oauth2:OutboundOAuth2Provider` when initializing and the initialized `oauth2:OutboundOAuth2Provider` is passed to the `http:BearerAuthHandler`.

```ballerina
import ballerina/http;
import ballerina/oauth2;
import ballerina/config;

oauth2:OutboundOAuth2Provider oauth2Provider = new({
    tokenUrl: "https://localhost:9196/oauth2/token/authorize",
    username: "johndoe",
    password: "A3ddj3w",
    clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxStwNEW4cfStBEGRxRL68",
    clientSecret: "9205371918321623741",
    scopes: ["token-scope1", "token-scope2"],
    refreshConfig: {
        refreshUrl: "https://localhost:9196/oauth2/token/refresh",
        scopes: ["token-scope1", "token-scope2"]
    }
});
http:BearerAuthHandler oauth2AuthHandler = new(oauth2Provider);

http:Client downstreamServiceEP = new("https://localhost:9091", {
    auth: {
        authHandler: oauth2AuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

##### Direct Token Mode

OAuth2 token issuing requires several additional configurations for the `oauth2:DirectTokenConfig` including:

* `accessToken` - Access token for the authorization endpoint
* `refreshConfig` - Configurations for refreshing the access token
  * `refreshUrl` - Refresh token URL for the refresh token server
  * `refreshToken` - Refresh token for the refresh token server
  * `clientId` - Client ID for authentication with the authorization endpoint
  * `clientSecret` - Client secret for authentication with the authorization endpoint
  * `scopes` - Scope of the access request
  * `credentialBearer` - How authentication credentials are sent to the authorization endpoint
  * `clientConfig` - HTTP client configurations, which calls the authorization endpoint
* `clockSkewInSeconds` - Clock skew in seconds
* `retryRequest` - Retry the request if the initial request returns a 401 response
* `credentialBearer` - How authentication credentials are sent to the authorization endpoint
  - `http:AUTH_HEADER_BEARER` - Indicates that the authentication credentials should be sent via the Authentication Header
  - `http:POST_BODY_BEARER|NO_BEARER` - Indicates that the Authentication credentials should be sent via the body of the POST request

The `oauth2:DirectTokenConfig` record should be provided into the `oauth2:OutboundOAuth2Provider` when initializing and the initialized `oauth2:OutboundOAuth2Provider` is passed to the `http:BearerAuthHandler`.

```ballerina
import ballerina/http;
import ballerina/oauth2;

oauth2:OutboundOAuth2Provider oauth2Provider = new({
    accessToken: "34060588-dd4e-36a5-ad93-440cc77a1cfb",
    refreshConfig: {
        refreshToken: "15160398-ae07-71b1-aea1-411ece712e59",
        refreshUrl: "https://ballerina.io/sample/refresh",
        clientId: "rgfKVdnMQnJSSr_pKFTxj3apiwYa",
        clientSecret: "BRebJ0aqfclQB9v7yZwhj0JfW0ga"
    }
});
http:BearerAuthHandler oauth2AuthHandler = new(oauth2Provider);

http:Client downstreamServiceEP = new("https://localhost:9091", {
    auth: {
        authHandler: oauth2AuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

#### Basic Auth Outbound Authentication

Ballerina supports Basic Authentication for clients. The `auth:OutboundBasicAuthProvider` is used to create a token against the `auth:Credential` provided by the user. The `http:BasicAuthHandler` is used to add the HTTP `Authorization` header with the value received from the AuthProvider as the `Basic <token>`.

Token issuing requires several additional configurations for the `auth:Credential` config including:

* `username` - The username for Basic authentication
* `password` - The password for Basic authentication

The `auth:Credential` record should be provided into the `auth:OutboundBasicAuthProvider` when initializing and the initialized `auth:OutboundBasicAuthProvider` is passed to the `http:BasicAuthHandler`.

```ballerina
import ballerina/auth;
import ballerina/http;
import ballerina/config;

auth:OutboundBasicProvider basicAuthProvider = new({
    username: "user",
    password: "ballerina"
});
http:BasicAuthHandler basicAuthHandler = new(basicAuthProvider);

http:Client downstreamServiceEP = new("https://localhost:9091", {
    auth: {
        authHandler: basicAuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

#### Token Propagation for Outbound Authentication

Ballerina supports token propagation for outbound authentication. The token propagation happens if the user does not provide any configuration when initializing the `auth:OutboundAuthProvider`.

The `auth:OutboundAuthProvider` reads the token/username from the `runtime:InvocationContext` according to the outbound authentication scheme and uses that for the outbound request. The `runtime:InvocationContext` is initialized based on the authentication information from the inbound request.

##### Example - 1

The following program has an `http:Client` secured with Basic authentication and it is configured inside an `http:Listener` secured with Basic authentication.
The `auth:OutboundBasicAuthProvider` is initialized without providing any configurations. Therefore, the program gets the token from the `runtime:InvocationContext` and uses it for the outbound request.
If the downstream service is also secured with Basic authentication and as same as the upstream service, the user does not need to configure the client.

> **Note:** This scenario is the same for all the scenarios in which both the upstream and downstream services are secured using the same authentication scheme and clients are also configured using the same authentication scheme but without any configurations. The token propagation happens internally.

```ballerina
import ballerina/auth;
import ballerina/http;
import ballerina/config;

auth:InboundBasicAuthProvider inboundBasicAuthProvider = new;
http:BasicAuthHandler inboundBasicAuthHandler = new(inboundBasicAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [inboundBasicAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

auth:OutboundBasicAuthProvider outboundBasicAuthProvider = new;
http:BasicAuthHandler outboundBasicAuthHandler = new(outboundBasicAuthProvider);

http:Client downstreamClientEP = new("https://localhost:9092", {
    auth: {
        authHandler: outboundBasicAuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) returns error? {
        // http:Request req = new;
        http:Response response = check downstreamClientEP->get("/downstream");
        checkpanic caller->respond(response);
    }
}

// ----------------------------------------------
// Following code creates the downstream service
// ----------------------------------------------

listener http:Listener downstreamServiceEp = new(9092, {
    auth: {
        authHandlers: [inboundBasicAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/downstream"
}
service downStreamService on downstreamServiceEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function downStreamResource(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Downstream service received authenticated request with the token: " + req.getHeader("Authorization"));
        checkpanic caller->respond(resp);
    }
}
```

To enforce Basic Authentication, create a configuration file as follows:

**sample-users.toml**
```
[b7a.users]

[b7a.users.tom]
password="123"
scopes="hello"
```

Start the service using the following command after creating the `sample-users.toml` file.

```
ballerina run --config sample-users.toml example.bal
```

The `Tom` user will be able to invoke the `/hello` resource and invoke the Basic Auth protected downstream service.

```
curl -k -v -u tom:123 https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> Authorization: Basic dG9tOjEyMw==
> User-Agent: curl/7.60.0
> Accept: */*

< HTTP/1.1 200 OK
< content-type: text/plain
< content-length: 602
<
Downstream service received authenticated request with the token: Basic dG9tOjEyMw==
```

##### Example - 2

The following program has an `http:Client` secured with JWT authentication and it is configured inside an `http:Listener` secured with Basic Authentication.
The `jwt:OutboundJwtAuthProvider` is initialized using the provides configurations but without the username. Therefore, the program gets the username from the `runtime:InvocationContext`, which is set based on the inbound authentication information and uses it for the outbound request.
In this example, the downstream service is secured using JWT authentication and expects a JWT issued against the user authenticating by the upstream service (protected by Basic authentication). Ballerina can dynamically issue such JWT while propagating the user information internally.

```ballerina
import ballerina/auth;
import ballerina/http;
import ballerina/jwt;
import ballerina/config;

auth:InboundBasicAuthProvider inboundBasicAuthProvider = new;
http:BasicAuthHandler inboundBasicAuthHandler = new(inboundBasicAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [inboundBasicAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

jwt:OutboundJwtAuthProvider outboundJwtAuthProvider = new({
    issuer: "ballerina",
    audience: ["ballerina.io"],
    keyStoreConfig: {
        keyAlias: "ballerina",
        keyPassword: "ballerina",
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
http:BearerAuthHandler outboundJwtAuthHandler = new(outboundJwtAuthProvider);

http:Client downstreamClientEP = new("https://localhost:9092", {
    auth: {
        authHandler: outboundJwtAuthHandler
    },
    secureSocket: {
        trustStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) returns error? {
        // http:Request req = new;
        http:Response response = check downstreamClientEP->get("/downstream");
        checkpanic caller->respond(response);
    }
}

// ----------------------------------------------
// Following code creates the downstream service
// ----------------------------------------------

jwt:InboundJwtAuthProvider inboundJwtAuthProvider = new({
    issuer: "ballerina",
    audience: ["ballerina.io"],
    certificateAlias: "ballerina",
    trustStore: {
        path: config:getAsString("b7a.home") + "/bre/security/ballerinaTruststore.p12",
        password: "ballerina"
    }
});
http:BearerAuthHandler inboundJwtAuthHandler = new(inboundJwtAuthProvider);

listener http:Listener downstreamServiceEp = new(9092, {
    auth: {
        authHandlers: [inboundJwtAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: config:getAsString("b7a.home") + "/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/downstream"
}
service downStreamService on downstreamServiceEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function downStreamResource(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Downstream service received authenticated request with the token: " + req.getHeader("Authorization"));
        checkpanic caller->respond(resp);
    }
}
```

To enforce Basic Authentication, create a configuration file as follows:

**sample-users.toml**
```
[b7a.users]

[b7a.users.tom]
password="123"
scopes="hello"
```

Start the service using the following command after creating the `sample-users.toml` file.

```
ballerina run --config sample-users.toml example.bal
```

The 'Tom' user will be able to invoke the `/hello` resource and invoke the Basic Auth protected downstream service.

```
curl -k -v -u tom:123 https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> Authorization: Basic dG9tOjEyMw==
> User-Agent: curl/7.60.0
> Accept: */*

< HTTP/1.1 200 OK
< content-type: text/plain
< content-length: 602
<
Downstream service received authenticated request with the token: Bearer eyJhbGciOiJSUzI1NiIsICJ0eXAiOiJKV1QifQ==.eyJzdWIiOiJ0b20iLCAiaXNzIjoiYmFsbGVyaW5hIiwgImV4cCI6MTU2NTUwMzUzNywgImlhdCI6MTU2NTUwMzIzNywgImp0aSI6ImJhMjczNTM5LTcxZWItNDExOC04MzNiLTQyNDlhMjY0MmZmNCIsICJhdWQiOlsiYmFsbGVyaW5hLmlvIl19.OwMHPrQfjpIujHSAIq3ycKsP4SYTR2nW9lBHXBOgIZV6-FcM1Lxz8xtjY1AwcIAd_L4XmiODN_5HYUluZb3jDj1F6ZeI4FQeTKygiGgJs_nTww56bHFQXPe9_IW1zxRGM8G51cJBKxTH6YsOTXgNVhcGoe5f-kaESmGze-XLCnCXgj0GYnG2ECnejSHRh89gjWMyfyMFRDhioPi9IYZEQGIFBQzrModFWXNKQZh5vxaF5KW4KWXLTRgrBX8uY2IIS6S80nf83oaUlrrApieaGf88cwSqOjGjaPpxj3I810qGa996ZVE3P5DkzgxrJYHrJMwcVgBX7sgDFUUcD3RrEA==
```
