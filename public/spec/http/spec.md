# Specification: Ballerina HTTP Library

_Owners_: @shafreenAnfar @TharmiganK @ayeshLK @chamil321  
_Reviewers_: @shafreenAnfar @bhashinee @TharmiganK @ldclakmal  
_Created_: 2021/12/23  
_Updated_: 2024/06/13   
_Edition_: Swan Lake


## Introduction
This is the specification for the HTTP standard library of [Ballerina language](https://ballerina.io/), which provides HTTP client-server functionalities to produce and consume HTTP APIs.  

The HTTP library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag. 

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Components](#2-components)
    * 2.1. [Listener](#21-listener)
        * 2.1.1. [Automatically starting the service](#211-automatically-starting-the-service)
        * 2.1.2. [Programmatically starting the service](#212-programmatically-starting-the-service)
    * 2.2. [Service](#22-service)
        * 2.2.1. [Service type](#221-service-type)
        * 2.2.2. [Service-base-path](#222-service-base-path)
        * 2.2.3. [Service declaration](#223-service-declaration)
        * 2.2.4. [Service class declaration](#224-service-class-declaration)
        * 2.2.5. [Service constructor expression](#225-service-constructor-expression)
        * 2.2.6. [Service contract type](#226-service-contract-type)
    * 2.3. [Resource](#23-resource)
        * 2.3.1. [Accessor](#231-accessor)
        * 2.3.2. [Resource-name](#232-resource-name)
        * 2.3.3. [Path parameter](#233-path-parameter)
        * 2.3.4. [Signature parameters](#234-signature-parameters)
            * 2.3.4.1. [Caller](#2341-httpcaller)
            * 2.3.4.2. [Request](#2342-httprequest)
            * 2.3.4.3. [Query param](#2343-query-parameter)
            * 2.3.4.4. [Payload param](#2344-payload-parameter)
            * 2.3.4.5. [Header param](#2345-header-parameter)
        * 2.3.5. [Return types](#235-return-types)
            * 2.3.5.1. [Status Code Response](#2351-status-code-response)
            * 2.3.5.2. [Return nil](#2352-return-nil)
            * 2.3.5.3. [Return SSE stream](#2353-return-sse-stream)
            * 2.3.5.4. [Default response status codes](#2354-default-response-status-codes)
        * 2.3.6. [OpenAPI specification resources](#236-openapi-specification-resources)
            * 2.3.6.1. [Introspection resource](#2361-introspection-resource)
            * 2.3.6.2. [SwaggerUI resource](#2362-swaggerui-resource)
    * 2.4. [Client](#24-client)
        * 2.4.1. [Client types](#241-client-types)
            * 2.4.1.1. [Security](#2411-security)
            * 2.4.1.2. [Caching](#2412-caching)
            * 2.4.1.3. [Redirect](#2413-redirect)
            * 2.4.1.4. [Retry](#2414-retry)
            * 2.4.1.5. [Circuit breaker](#2415-circuit-breaker)
            * 2.4.1.6. [Cookie](#2416-cookie)
            * 2.4.1.7. [Load balance](#2417-load-balance)
            * 2.4.1.8. [Failover](#2418-failover)
            * 2.4.1.9. [Status code binding client](#2419-status-code-binding-client)
        * 2.4.2. [Client actions](#242-client-action)
            * 2.4.2.1. [Entity body methods](#2421-entity-body-methods)
            * 2.4.2.2. [Non entity body methods](#2422-non-entity-body-methods)
            * 2.4.2.3. [Resource methods](#2423-resource-methods)
            * 2.4.2.4. [Forward/execute methods](#2424-forwardexecute-methods)
            * 2.4.2.5. [HTTP2 additional methods](#2425-http2-additional-methods)
        * 2.4.3. [Client actions return types](#243-client-action-return-types)
3. [Request-routing](#3-request-routing)
    * 3.1. [Uri and http method match](#31-uri-and-http-method-match)
    * 3.2. [Most specific path match](#32-most-specific-path-match)
    * 3.3. [Wild card path match](#33-wild-card-path-match)
    * 3.4. [Path parameter template match](#34-path-parameter-template-match)
4. [Annotations](#4-annotations)
    * 4.1. [Service configuration](#41-service-configuration)
    * 4.2. [Resource configuration](#42-resource-configuration)
    * 4.3. [Payload annotation](#43-payload-annotation)
        * 4.3.1. [Payload binding parameter](#431-payload-binding-parameter)
        * 4.3.2. [Anydata return value info](#432-anydata-return-value-info)
    * 4.4. [CallerInfo annotation](#44-callerinfo-annotation)
    * 4.5. [Header annotation](#45-header-annotation)
    * 4.6. [Cache annotation](#46-cache-annotation)
5. [url-parameters](#5-url-parameters)
    * 5.1. [Path](#51-path)
    * 5.2. [Query](#52-query)
    * 5.3. [Matrix](#53-matrix)
6. [Request and Response](#6-request-and-response)
7. [Header and Payload](#7-header-and-payload)
    * 7.1. [Parse header functions](#71-parse-header-functions)
    * 7.2. [Links support](#72-links-support)
      * 7.2.1 [LinkedTo record](#721-linkedto-record)
      * 7.2.2 [Links in the response](#722-links-in-the-response)
8. [Interceptor and error handling](#8-interceptor-and-error-handling)
    * 8.1. [Interceptor](#81-interceptor)
        * 8.1.1. [Request interceptor](#811-request-interceptor)
            * 8.1.1.1. [Request context](#8111-request-context)
            * 8.1.1.2. [Next method](#8112-next-method)
            * 8.1.1.3. [Return to respond](#8113-return-to-respond)
            * 8.1.1.4 [Get JWT information](#8114-get-jwt-information)
        * 8.1.2. [Response interceptor](#812-response-interceptor)
            * 8.1.2.1. [Return to respond](#8121-return-to-respond)
        * 8.1.3. [Request error interceptor and response error interceptor](#813-request-error-interceptor-and-response-error-interceptor)
        * 8.1.4. [Engaging interceptors](#814-engaging-interceptors)
            * 8.1.4.1. [Service level](#8141-service-level)
            * 8.1.4.2. [Execution order of interceptors](#8142-execution-order-of-interceptors)
        * 8.1.5. [Data binding](#815-data-binding)
    * 8.2. [Error handling](#82-error-handling)
      * 8.2.1. [Error interceptors](#821-error-interceptors)
      * 8.2.2. [Error types](#822-error-types)
      * 8.2.3. [Trace log](#823-trace-log)
      * 8.2.4. [Access log](#824-access-log)
      * 8.2.5. [Panic inside resource](#825-panic-inside-resource)
9. [Security](#9-security)
    * 9.1. [Authentication and Authorization](#91-authentication-and-authorization)
        * 9.1.1. [Declarative Approach](#911-declarative-approach)
            * 9.1.1.1. [Listener - Basic Auth - File User Store](#9111-listener---basic-auth---file-user-store)
            * 9.1.1.2. [Listener - Basic Auth - LDAP User Store](#9112-listener---basic-auth---ldap-user-store)
            * 9.1.1.3. [Listener - JWT Auth](#9113-listener---jwt-auth)
            * 9.1.1.4. [Listener - OAuth2](#9114-listener---oauth2)
            * 9.1.1.5. [Client - Basic Auth](#9115-client---basic-auth)
            * 9.1.1.6. [Client - Bearer Token Auth](#9116-client---bearer-token-auth)
            * 9.1.1.7. [Client - Self Signed JWT Auth](#9117-client---self-signed-jwt)
            * 9.1.1.8. [Client - Bearer Token OAuth2](#9118-client---bearer-token-oauth2)
            * 9.1.1.9. [Client - Grant Types OAuth2](#9119-client---grant-types-oauth2)
        * 9.1.2 [Imperative Approach](#912-imperative-approach)
            * 9.1.2.1. [Listener - Basic Auth - File User Store](#9121-listener---basic-auth---file-user-store)
            * 9.1.2.2. [Listener - Basic Auth - LDAP User Store](#9122-listener---basic-auth---ldap-user-store)
            * 9.1.2.3. [Listener - JWT Auth](#9123-listener---jwt-auth)
            * 9.1.2.4. [Listener - OAuth2](#9124-listener---oauth2)
            * 9.1.2.5. [Client - Basic Auth](#9125-client---basic-auth)
            * 9.1.2.6. [Client - Bearer Token Auth](#9126-client---bearer-token-auth)
            * 9.1.2.7. [Client - Self Signed JWT Auth](#9127-client---self-signed-jwt)
            * 9.1.2.8. [Client - Bearer Token OAuth2](#9128-client---bearer-token-oauth2)
            * 9.1.2.9. [Client - Grant Types OAuth2](#9129-client---grant-types-oauth2)
   * 9.2. [SSL/TLS and Mutual SSL](#92-ssltls-and-mutual-ssl)
        * 9.2.1. [Listener - SSL/TLS](#921-listener---ssltls)
        * 9.2.2. [Listener - Mutual SSL](#922-listener---mutual-ssl)
        * 9.2.3. [Client - SSL/TLS](#923-client---ssltls)
        * 9.2.4. [Client - Mutual SSL](#924-client---mutual-ssl)
10. [Protocol-upgrade](#10-protocol-upgrade)
    * 10.1. [HTTP2](#101-http2)
        * 10.1.1. [Push promise and promise response](#1011-push-promise-and-promise-response)

## 1. Overview
Ballerina language provides first-class support for writing network-oriented programs. The HTTP standard library uses these language constructs and creates the programming model to produce and consume HTTP APIs.

The HTTP standard library is designed to work with HTTP protocol. It includes high-level abstractions such as `http:Request`, `http:Response`, `http:Service`, and `http:Client` which allow users to produce and consume HTTP API. Further, developers can use this library to build other libraries. The standard libraries such as GraphQL, Websub, and WebSubHub use this library internally.

In addition to functional requirements, this library deals with nonfunctional requirements such as security, observability, and resiliency. Each requirement is discussed in detail in the coming sections.

## 2. Components
### 2.1. Listener
The HTTP listener object receives network data from a remote process according to the HTTP transport protocol and 
translates the received data into invocations on the resources functions of services that have been 
attached to the listener object. The listener provides the interface between network and services. When initiating
the listener, the port is a compulsory parameter whereas the second parameter is the listenerConfiguration which
changes the behaviour of the listener based on the requirement. By default, HTTP listener supports
HTTP2 version.

```ballerina
public type ListenerConfiguration record {|
    string host = "0.0.0.0";
    ListenerHttp1Settings http1Settings = {};
    ListenerSecureSocket? secureSocket = ();
    HttpVersion httpVersion = HTTP_2_0;
    decimal timeout = DEFAULT_LISTENER_TIMEOUT;
    string? server = ();
    RequestLimitConfigs requestLimits = {};
    int http2InitialWindowSize = 65535;
    decimal minIdleTimeInStaleState = 300;
    decimal timeBetweenStaleEviction = 30;
|};
```

As defined in [Ballerina 2021R1 Section 5.7.4](https://ballerina.io/spec/lang/2021R1/#section_5.7.4) the Listener has 
the object constructor and life cycle methods such as attach(), detach(), 'start(), gracefulStop(), and immediateStop().

#### 2.1.1. Automatically starting the service
If a service is attached to the listener, then the listener starts listening on the given port after executing 
attach() and start() methods. HTTP listener can be declared as follows honoring to the generic 
[listener declaration](https://ballerina.io/spec/lang/2021R1/#section_8.3.1)

```ballerina
// Listener object constructor
listener http:Listener serviceListener = new(9090);

// Service attaches to the Listener
service /foo/bar on serviceListener {
    resource function get greeting() returns string {}
}
```

#### 2.1.2. Programmatically starting the service

Users can programmatically start the listener by calling each lifecycle method as follows.

```ballerina
// Listener object constructor
listener http:Listener serviceListener = new(9090);

public function main() {
    error? err1 = serviceListener.attach(s, "/foo/bar");
    error? err2 = serviceListener.start();
    //...
    error? err3 = serviceListener.gracefulStop();
}

http:Service s = service object {
    resource function get greeting() returns string {}
};
```

### 2.2. Service
Service is a collection of resources functions, which are the network entry points of a ballerina program. 
In addition to that a service can contain public and private functions which can be accessed by calling with `self`.

#### 2.2.1. Service type
```ballerina
public type Service distinct service object {

};
```
Above distinct type is provided by HTTP module and user can include the type as `*http:Service` to refer it.
The comprehensive typing support is yet to be added to the language. Until that, the compiler plugin is used to 
validate the services.

#### 2.2.2. Service base path

The base path is considered during the request dispatching to discover the service. Identifiers and string literals
are allowed to be stated as base path, and it should be started with `/`. The base path is optional, and it will be 
defaulted to `/` when not defined. If the base path contains any special characters, those should be escaped or defined
as string literals

```ballerina
service /hello\-world on new http:Listener(9090) {
   resource function get foo() {
   }
}

service "hello-world" on new http:Listener(9090) {
   resource function get foo() {
   }
}
```

A service can be declared in three ways upon the requirement.

#### 2.2.3. Service declaration
The [Service declaration](https://ballerina.io/spec/lang/2021R1/#section_8.3.2) is a syntactic sugar for creating a
service and, it is the mostly used approach for creating a service. The declaration gets desugared into creating a 
listener object, creating a service object, attaching the service object to the listener object.

```ballerina
service /foo/bar on new http:Listener(9090) {
  resource function get greeting() returns string {
      return "hello world";
  }
}
```

#### 2.2.4. Service class declaration

The service value can be instantiated using the service class. This way, user has the completed control of attaching
the service to the listener. The life cycle methods to used to proceed.

```ballerina
service isolated class SClass {
   *http:Service;
   resource function get greeting() returns string {
       return "hello world";
   }
}

listener http:Listener serviceListener = check new (9090);

public function main() {
   http:Service httpService = new SClass();
   error? err1 = serviceListener.attach(httpService, ["foo", "bar"]);
   error? err2 = serviceListener.'start();
}
```

#### 2.2.5. Service constructor expression

```ballerina
listener http:Listener serviceListener = new (9090);

http:Service httpService = @http:ServiceConfig {} service object {
   resource function get greeting() returns string {
       return "hello world";
   }
};

public function main() {
   error? err1 = serviceListener.attach(httpService, "/foo/bar");
   error? err2 = serviceListener.start();
}
```

### 2.2.6. Service contract type

The service contract type is a distinct type which is used to represent the service contract. This service contract
type can be used along with the service declaration to implement a service which ensures that the service is compliant
with the contract. Additionally, all the metadata related to the service can be defined within the service contract 
type which makes the service declaration clean and readable.

Following is an example of a service contract type:

```ballerina
@http:ServiceConfig {basePath: "/v1"}
public type AlbumService service object {
    *http:ServiceContract;

    @openapi:ResourceInfo {
        summary: "Get all albums"
    }
    resource function get albums() returns Album[];

    @openapi:ResourceInfo {
        summary: "Add a new album"
    }
    resource function post albums(@openapi:Example {
                value: {
                    title: "Blue Train",
                    artist: "John Coltrane"
                }
            } Album album) returns Album|ErrorPayloadBadRequest;
};
```

The service contract type can have the annotations which are supported on the service declaration. Additionally, a 
`basePath` can be defined in the `ServiceConfig` annotation to define the base path of the service. This field is 
optional and if not defined, the base path will be defaulted to `/`.

Following is an example of a service implemented with the above service contract type:

```ballerina
service AlbumService on new http:Listener(9090) {

    resource function get albums() returns Album[] {
        return albums.toArray();
    }

    resource function post albums(Album album) returns Album|ErrorPayloadBadRequest {
        albums.add(album);
        return album;
    }
}
```

The service implemented via the service contract type has the following restrictions:
- None of the service level, resource level and parameter level HTTP annotation are allowed.
- The base path is not allowed in the service declaration, and it is inferred from the service contract type.
- The service declaration cannot have additional resource functions which are not defined in the service contract type.

### 2.3. Resource

A method of a service can be declared as a [resource method](https://ballerina.io/spec/lang/2021R1/#resources) 
which is associated with configuration data that is invoked by a network message by a Listener. Users write the 
business logic inside a resource and expose it over the network.

#### 2.3.1. Accessor
The accessor-name of the resource represents the HTTP method, and it can be get, post, put, delete, head, patch, options 
and default. If the accessor is unmatched, 405 Method Not Allowed response is returned. When the accessor name is 
stated as default, any HTTP method can be matched to it in the absence of an exact match. Users can define custom 
methods such as copy, move based on their requirement. A resource which can handle any method would look like as 
follows. This is useful when handling unmatched verbs.

```ballerina
resource function 'default NAME_TEMPLATE () {
    
}
```
#### 2.3.2. Resource name
The resource-name represents the path of the resource which is considered during the request dispatching. The name can 
be hierarchical(foo/bar/baz). Each path identifier should be separated by `/` and first path identifier should not 
contain a prefixing `/`. If the paths are unmatched, 404 NOT FOUND response is returned.
```ballerina
resource function post hello() {
    
}
```
Only the identifiers can be used as resource path not string literals. Dot identifier is 
used to denote the `/` only if the path contains a single identifier. 
```ballerina
resource function post .() {
    
}
```
Any special characters can be used in the path by escaping.
```ballerina
resource function post hello\-world() {
    
}
```

#### 2.3.3. Path parameter
The path parameter segment is also a part of the resource name which is declared within brackets along with the type. 
As per the following resource name, baz is the path param segment, and it’s type is string. Like wise users can define 
string, int, boolean, float, and decimal typed path parameters. If the paths are unmatched, 404 NOT FOUND response 
is returned. If the segment failed to parse into the expected type, 500 Internal Server Error response is returned.

```ballerina
resource function post foo/bar/[string baz]/qux() {
    // baz is the path param
}

resource function get data/[int age]/[string name]/[boolean status]/[float weight]() returns json {
   int balAge = age + 1;
   float balWeight = weight + 2.95;
   string balName = name + " lang";
   if status {
       balName = name;
   }
   json responseJson = { Name:name, Age:balAge, Weight:balWeight, Status:status, Lang: balName};
   return responseJson;
}
```

If multiple path segments needs to be matched after the last identifier, Rest param should be used at the end of the 
resource name as the last identifier. string, int, boolean, float, and decimal types are supported as rest parameters.
```ballerina
resource function get foo/[string... bar]() returns json {
   json responseJson = {"echo": bar[0]};
   return responseJson;
}
```

Using both `'default` accessor and the rest parameters, a default resource can be defined to a service. This 
default resource can act as a common destination where the unmatched requests (either HTTP method or resource path) may 
get dispatched.

```ballerina
resource function 'default [string... s]() {

}
```

#### 2.3.4. Signature parameters
The resource method can have the following parameters in the signature. There are not any mandatory params or any 
particular order. But it’s a good practice to keep the optional param at the end.

```ballerina
resource function XXX NAME_TEMPLATE ([http:Caller hc], [http:Request req], (anydata queryParam)?, 
    (@http:Payload anydata payload)?, (@http:Header string header)?, (http:Header headers)? ) {
        
}
```

However, the first choice should be to use signature params and use returns. Avoid caller unless you have specific 
requirement. Also use data binding, header params and resource returns to write smaller code with more readability.

##### 2.3.4.1. http:Caller

The caller client object represents the endpoint which initiates the request. Once the request is processed, the 
corresponding response is sent back using the remote methods which are associated with the caller object. 
In addition to that, the caller has certain meta information related to remote and local host such as IP address,
protocol. This parameter is not compulsory and not ordered.


The CallerInfo annotation associated with the `Caller` is to denote the response type.
It will ensure that the resource method responds with the right type and provides static type information about 
the response type that can be used to generate OpenAPI.

The default type is the `http:Response`. Other than that, caller remote methods will accept following types as the 
outbound response payload. Internally an `http:Response` is created including the given payload value

```ballerina
string|xml|json|byte[]|int|float|decimal|boolean|map<json>|table<map<json>>|(map<json>|table<map<json>>)[]|
mime:Entity[]|stream<byte[], io:Error?>|()
```

Based on the payload types respective header value is added as the `Content-type` of the `http:Response`.

| Type                                                                  | Content Type             |
|-----------------------------------------------------------------------|--------------------------|
| ()                                                                    | -                        |
| string                                                                | text/plain               |
| xml                                                                   | application/xml          |
| byte[], stream<byte[], io:Error?>                                     | application/octet-stream |
| int, float, decimal, boolean                                          | application/json         |
| map\<json\>, table<map\<json\>>, map\<json\>[], table<map\<json\>>)[] | application/json         |

In addition to the above types, caller `respond()` method can accept `StatusCodeResponse` or `error` type. In case of 
`error`, an error response is returned to the client with the error message.

The HTTP compiler extension checks the argument of the `respond()` method if the matching payload type is passed as
denoted in the CallerInfo annotation. At the moment, in terms of responding error, CallerInfo annotation can only support 
`http:Error` type.

```ballerina
resource function post foo(@http:CallerInfo {respondType:Person}  http:Caller hc) {
    Person p = {};
    error? result = hc->respond(p);
}
```

When the caller `respond()` method is invoked from HTTP post resource by providing `anydata` payload, the status 
code of the outbound response will be set to HTTP Created (201) by default.

##### 2.3.4.2. http:Request

The `http:Request` represents the request which is sent and received over the network which includes headers and 
the entity body. Listener passes it to the resource method as an argument to be accessed by the user based on 
their requirement. This parameter is not compulsory and not ordered.

```ballerina
resource function get person(http:Request req) {
    
}
```

See section [Request and Response](#6-request-and-response) to find out more. 

##### 2.3.4.3. Query parameter

The query param is a URL parameter which is available as a resource method parameter, and it's not associated 
with any annotation or additional detail unless any default payload param is defined. This parameter is not compulsory 
and not ordered. The type of query param are as follows

```ballerina
type BasicType boolean|int|float|decimal|string|map<anydata>|enum;
public type QueryParamType ()|BasicType|BasicType[];
```

The same query param can have multiple values. In the presence of multiple such values,  If the user has specified 
the param as an array type, then all values will return. If not the first param values will be returned. As per the 
following resource method, the request may contain at least two query params with the key of bar and id.
Eg : “/hello?bar=hi&id=56”

```ballerina
resource function get hello(string bar, int id) { 
    
}
```

With the introduction of the default payload param support, the structured data types such as map<json> can be
identified as payload param. To solve that ambiguity between the default payload and query param, the
@http:Query annotation should be defined in front of the query param.

```ballerina
resource function post queryParamCheck(@http:Query map<json> q) returns map<json> {
    return q; // q is payload param
}
```

If the query parameter is not defined in the function signature, then the query param binding does not happen. If a 
query param of the request URL has no corresponding parameter in the resource method, then that param is ignored. 
If the parameter is defined in the function, but there is no such query param in the URL, that request will lead 
to a 400 BAD REQUEST error response unless the type is nilable (string?)

If the query parameter is defined with a defaultable value in the resource signature, in the absence of particular
query parameter, the default value will be assigned to the variable.

```ballerina
resource function get price(int id = 10) { 
    
}
```

The query param consists of query name and values. Sometimes user may send query without value(`foo:`). In such
situations, when the query param type is nilable, the values returns nil and same happened when the complete query is
not present in the request. In order to avoid the missing detail, a service level configuration has introduced naming
`treatNilableAsOptional`

```ballerina
@http:ServiceConfig {
    treatNilableAsOptional : false
}
service /queryparamservice on new http:Listener(9090) {

    resource function get queryvalues(string foo, int bar) returns json {
        json responseJson = { value1: foo, value2: bar};
        return responseJson;
    }
}
```

<table>
<tr>
<th> Case </th>
<th>  Resource argument </th>
<th>  Query </th>
<th>  Current Mapping (treatNilableAsOptional=true - Default) </th>
<th>  Ideal Mapping (treatNilableAsOptional=false) </th>
</tr>
<tr>
<td rowspan=4> 1 </td>
<td rowspan=4> string foo </td>
<td> foo=bar </td>
<td> bar </td>
<td> bar </td>
</tr>
<tr>
<td> foo=</td>
<td> "" </td>
<td> "" </td>
</tr>
<tr>
<td> foo</td>
<td> Error : no query param value found for 'foo' </td>
<td> Error : no query param value found for 'foo' </td>
</tr>
<tr>
<td> No query</td>
<td> Error : no query param value found for 'foo' </td>
<td> Error : no query param value found for 'foo' </td>
</tr>
<tr>
<td rowspan=4> 2 </td>
<td rowspan=4> string? foo </td>
<td> foo=bar </td>
<td> bar </td>
<td> bar </td>
</tr>
<tr>
<td> foo=</td>
<td> "" </td>
<td> "" </td>
</tr>
<tr>
<td> foo</td>
<td> nil </td>
<td> nil </td>
</tr>
<tr>
<td> No query</td>
<td> nil </td>
<td> Error : no query param value found for 'foo' </td>
</tr>
<tr>
<td rowspan=4> 3 </td>
<td rowspan=4> string foo = "baz"<br/> string? foo = "baz" </td>
<td> foo=bar </td>
<td> bar </td>
<td> bar </td>
</tr>
<tr>
<td> foo=</td>
<td> "" </td>
<td> "" </td>
</tr>
<tr>
<td> foo</td>
<td> baz </td>
<td> baz </td>
</tr>
<tr>
<td> No query</td>
<td> baz </td>
<td> baz </td>
</tr>
</table>

See section [Query](#52-query) to understand accessing query param via the request object.

##### 2.3.4.4. Payload parameter

The payload parameter is used to access the request payload during the resource invocation. When the payload param is 
defined with @http:Payload annotation, the listener deserialize the inbound request payload based on the media type 
which retrieved by the `Content-type` header of the request. The data binding happens thereafter considering the 
parameter type. The type of payload parameter can be one of the `anydata`. If the header is not present or not a 
standard header, the binding type is inferred by the parameter type.

When the following conditions are met, the listener identifies the default payload parameter, which is defined 
without the @http:Payload annotation:
- The default payload parameter rules are only applicable to POST, PUT, PATCH, DELETE, and DEFAULT accessors.
- Parameters must contain only one structured(map/record/table/tuple/array) type or `xml`. However, the array types of 
  basic types are considered as query parameters. But `byte[]` is an exception, and it is considered as a payload param.
    - `resource function post path(Student p) {}` -> `Student` is payload param type
    - `resource function post path(Student[] p) {}` -> `Student[]` is payload param type
    - `resource function post path(map<json> p) {}` -> `map<json>` is payload param type
    - `resource function post path(int[] p) {}` -> `int[]` is query param type
    - `resource function post path(byte[] p) {}` -> `byte[]` is payload param type
    - `resource function post path(int p) {}` -> `int` is query param type
- If there's more than one structured type, the ambiguity must be resolved using either @http:Payload or @http:Query
  annotation.
    - `resource function post path(Student p, map<json> q) {}` -> ambiguous types for payload
    - `resource function post path(@http:Payload Student p, map<json> q) {}` -> `p` is payload, `q` is query parameter
    - `resource function post path(Student p, @http:Query map<json> q) {}` -> `p` is payload, `q` is query parameter
- If there are no structured types, all parameters are considered query parameters.
    - `resource function post path(string p, string q) {}` -> `p` and `q` are query params
    - `resource function post path(@http:Payload string p, string q) {}` -> `p` is payload, `q` is query parameter
- If the query parameter is structured, then the @http:Query annotation is required.
    - `resource function post path(Student p) {}` -> `p` is payload param type
    - `resource function post path(@http:Query Student p) {}` -> `p` is query param type
- The only types allowed in the union for a parameter are structured types, `xml`, and `nil`.
    - `resource function post path(Student|xml p) {}` -> `Student|xml` is payload param type
    - `resource function post path(map<json>|xml p) {}` -> `map<json>|xml` is payload param type
    - `resource function post path(Student? p) {}` -> `Student?` is payload param type
    - `resource function post path(Student|string p) {}` -> invalid union type for default payload param

Following table explains the compatible `anydata` types with each common media type. In the absence of a standard media 
type, the binding type is inferred by the payload parameter type itself. If the type is not compatible with the media 
type, error is returned.

| Ballerina Type | Structure               | "text" | "xml" | "json" | "x-www-form-urlencoded" | "octet-stream" |
|----------------|-------------------------|:------:|:-----:|:------:|:-----------------------:|:--------------:|
| boolean        |                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | boolean[]               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<boolean\>          |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<map\<boolean\>\> |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| int            |                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | int[]                   |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<int\>              |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<map\<int\>\>     |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| float          |                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | float[]                 |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<float\>            |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<map\<float\>\>   |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| decimal        |                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | decimal[]               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<decimal\>          |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<map\<decimal\>\> |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| byte[]         |                         |   ✅    |   ❌   |   ✅    |            ❌            |       ✅        |
|                | byte[][]                |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<byte[]\>           |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<map\<byte[]\>\>  |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| string         |                         |   ✅    |   ❌   |   ✅    |            ✅            |       ❌        |
|                | string[]                |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<string\>           |   ❌    |   ❌   |   ✅    |            ✅            |       ❌        |
|                | table\<map\<string\>\>  |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| xml            |                         |   ❌    |   ✅   |   ❌    |            ❌            |       ❌        |
| json           |                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | json[]                  |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<json\>             |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<map\<json\>\>    |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| map            |                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map[]                   |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<map\>              |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<map\<map\>\>     |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
| record         |                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | record[]                |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | map\<record\>           |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |
|                | table\<record\>         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |

The payload binding process begins soon after finding the correct resource for the given URL and before the 
resource execution. 
The error which may occur during the process will be returned to the caller with the response 
status code of 400 BAD REQUEST. The successful binding will proceed the resource execution with the built payload.

```ballerina
resource function post hello(json payload) { 
    
}
```

Additionally, the payload parameter type can be a union of `anydata`. Based on the media type, the potential binding
type is decided. For example, if the union is defined as `json|xml` and the media type is related to `json`,
the deserialization and the binding will proceed according to the type `json`. But if the media type is related to `xml`
the process will happen according to the type `xml`.
If the given types of the union are not compatible with the media type, an error is returned.

```ballerina
resource function post album(json|xml payload) { 
    
}

```
If any of the type is union with `()`(i.e `string?`), then in the absence of the payload, `()` will be assigned as 
the value without being responded by a `BAD REQUEST` response.

Internally the complete payload is built, therefore the application should have sufficient memory to support the 
process. Payload binding is not recommended if the service behaves as a proxy/pass-through where request payload is 
not accessed.

User may specify the expected content type in the annotation to shape the resource as described in section [Payload 
binding parameter](#431-payload-binding-parameter)

##### 2.3.4.5. Header parameter

The header parameter is to access the inbound request headers The header param is defined with `@http:Header` annotation
The type of header param can be defined as follows;

```ballerina
type BasicType string|int|float|decimal|boolean;
public type HeaderParamType ()|BasicType|BasicType[]|record {| BasicType...; |};
```

When multiple header values are present for the given header, the first header value is returned when the param 
type is `string` or any of the basic types. To retrieve all the values, use `string[]` type or any array of the
basic types. This parameter is not compulsory and not ordered. 

The header param name is considered as the header name during the value retrieval. However, the header annotation name 
field can be used to define the header name whenever user needs some different variable name for the header. 

User cannot denote the type as a union of pure type, array type, or record type together, that way the resource 
cannot infer a single type to proceed. Hence, returns a compiler error.

In the absence of a header when the param is defined in the resource signature, listener returns 400 BAD REQUEST unless
the type is nilable. 

```ballerina
//Single header value extraction
resource function post album(@http:Header string referer) {
    
}

//Multiple header value extraction
resource function post product(@http:Header {name: "Accept"} string[] accept) {
    
}

public type RateLimitHeaders record {|
    string x\-rate\-limit\-id;
    int x\-rate\-limit\-remaining;
    string[] x\-rate\-limit\-types;
|};

//Populate selected headers to a record
resource function get price(@http:Header RateLimitHeaders rateLimitHeaders) {
}
```

If the requirement is to access all the header of the inbound request, it can be achieved through the `http:Headers` 
typed param in the signature. It does not need the annotation and not ordered.

```ballerina
resource function get price(http:Headers headers) {
    string|http:HeaderNotFoundError referer = headers.getHeader("Referer");
    string[]|http:HeaderNotFoundError accept = headers.getHeaders("Accept");
    string[] keys = headers.getHeaderNames();
}
```

The header consists of header name and values. Sometimes user may send header without value(`foo:`). In such 
situations, when the header param type is nilable, the values returns nil and same happened when the complete header is 
not present in the request. In order to avoid the missing detail, a service level configuration has introduced naming 
`treatNilableAsOptional`

```ballerina
@http:ServiceConfig {
    treatNilableAsOptional : false
}
service /headerparamservice on HeaderBindingIdealEP {

    resource function get headers(@http:Header string? foo) returns json {
        
    }
}
```

<table>
<tr>
<th>  Case </th>
<th>  Resource argument </th>
<th>  Header </th>
<th>  Current Mapping (treatNilableAsOptional=true - Default) </th>
<th>  Ideal Mapping (treatNilableAsOptional=false) </th>
</tr>
<tr>
<td rowspan=3> 1 </td>
<td rowspan=3> string foo </td>
<td> foo:bar </td>
<td> bar </td>
<td> bar </td>
</tr>
<tr>
<td> foo:</td>
<td> Error : no header value found for 'foo' </td>
<td> Error : no header value found for 'foo' </td>
</tr>
<tr>
<td> No header</td>
<td> Error : no header value found for 'foo' </td>
<td> Error : no header value found for 'foo' </td>
</tr>
<tr>
<td rowspan=3> 2 </td>
<td rowspan=3> string? foo </td>
<td> foo:bar </td>
<td> bar </td>
<td> bar </td>
</tr>
<tr>
<td> foo:</td>
<td> nil </td>
<td> nil </td>
</tr>
<tr>
<td> No header</td>
<td> nil </td>
<td> Error : no header value found for 'foo' </td>
</tr>
</table>


#### 2.3.5. Return types
The resource method supports `anydata`, `error?`, `http:Response`, `http:StatusCodeResponse` and `stream<http:SseEvent, error?>` as return types. 
Whenever user returns a particular output, that will result in an HTTP response to the caller who initiated the 
call. Therefore, user does not necessarily depend on the `http:Caller` and its remote methods to proceed with the 
response. 

```ballerina
resource function XXX NAME_TEMPLATE () returns @http:Payload anydata|http:Response|http:StatusCodeResponse|stream<http:SseEvent, error?>|http:Error? {
}
```

In addition to that the `@http:Payload` annotation can be specified along with anydata return type
mentioning the content type of the outbound payload.

```ballerina
resource function get greeting() returns @http:Payload {mediaType:"text/id+plain"} string {
    return "hello world";
}
```

Based on the return types respective header value is added as the `Content-type` of the `http:Response`. 

| Type                                                                  | Content Type                |
|-----------------------------------------------------------------------|-----------------------------|
| ()                                                                    | -                           |
| string                                                                | text/plain                  |
| xml                                                                   | application/xml             |
| byte[]                                                                | application/octet-stream    |
| int, float, decimal, boolean                                          | application/json            |
| map\<json\>, table<map\<json\>>, map\<json\>[], table<map\<json\>>)[] | application/json            |
| http:StatusCodeResponse                                               | derived from the body field |
| stream<http:SseEvent, error?>                                         | text/event-stream           |

##### 2.3.5.1. Status Code Response

The status code response records are defined in the HTTP module for every HTTP status code. It improves readability & 
helps OpenAPI spec generation. By default, the content type of the response message is derived from the `body` field.
This default content type can be overwritten by the `mediaType` field as shown below.

```ballerina
type PersonCreated record {|
    *http:Created;
    record {|
        string name;
    |} body;
|};

resource function post name(string name) returns PersonCreated {
   Person person = {name:name};
   return {
       mediaType: "application/person+json",
       headers: {
           "X-Server": "myServer"
       },
       body: person
   };
}
```

Following is the `http:Ok` definition. Likewise, all the status codes are provided.

```ballerina
public type Ok record {
   string mediaType;
   map<string|string[]> headers?;
   anydata body?;
};

resource function get greeting() returns http:Ok|http:InternalServerError {
   http:Ok ok = { body: "hello world", headers: { xtest: "foo"} };
   return ok;
}
```

##### 2.3.5.2. Return nil

Return nil from the resource has few meanings. 

1. If the resource wants to return nothing, the listener will return 202 ACCEPTED response.
    ```ballerina
    resource function post person(@http:Payload Person p) {
        int age = p.age;
        io:println(string `Age is: ${age}`);
    }
    ```   
2. If the resource is dealt with the response via http:Caller, then returning () does not lead to subsequent response. 
   Listener aware that the request is already being served.
    ```ballerina
    resource function get fruit(string? colour, http:Caller caller) {
        if colour == "red" {
            error? result = caller->respond("Sending apple");
            return; // ending the flow, so not 202 response
        }
        error? result = caller->respond("Sending orange");
    }
    ```   
3. If the resource is dealt with the success response via http:Caller and return () in the else case, then the 
   response is 500 INTERNAL SERVER ERROR.
    ```ballerina
    resource function get fruit(string? colour, http:Caller caller) {
        if colour == "red" {
            error? result = caller->respond("Sending apple");
            return; // ending the flow
        }
        return; // 500 internal Server Error
    }
    ```

##### 2.3.5.3. Return SSE stream

When an `http:SseEvent` stream is returned from the service, it's considered a server-sent event. By default, the service will add the following headers: 

- For HTTP 2.0: 
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`

- For HTTP 1.1, in addition to the previously mentioned headers, the following headers will also be included in the response: 
  - `Transfer-Encoding: chunked`
  - `Connection: keep-alive`

##### 2.3.5.4. Default response status codes

To improve the developer experience for RESTful API development, following default status codes will be used in outbound 
response when returning `anydata` directly from a resource method.

| Resource Accessor | Semantics                                                     | Status Code             |
|-------------------|---------------------------------------------------------------|-------------------------|
| GET               | Retrieve the resource                                         | 200 OK                  |
| POST              | Create a new resource                                         | 201 Created             |
| PUT               | Create a new resource or update an existing resource          | 200 OK                  |
| PATCH             | Partially update an existing resource                         | 200 OK                  |
| DELETE            | Delete an existing resource                                   | 200 OK                  |
| HEAD              | Retrieve headers                                              | 200 OK                  |
| OPTIONS           | Retrieve permitted communication options                      | 200 OK                  |

#### 2.3.6. OpenAPI specification resources

OAS resources are internally generated for each service and host the generated OpenAPI specification for the service in
different formats. In order to access these resources user can send an OPTIONS request either to one of the resources or
the service base-path. The link header in the 204 response specifies the location for the OAS resources.

Sample service
```ballerina
import ballerina/http;
import ballerina/openapi;

@openapi:ServiceInfo {
    embed: true
}
service /hello on new http:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello world";
    }
}
```

Output of OPTIONS call to service base path
```ballerina
curl -v localhost:9090/hello -X OPTIONS 
*   Trying 127.0.0.1:9090...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 9090 (#0)
> OPTIONS /hello HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.68.0
> Accept: */*
>
< HTTP/1.1 204 No Content
< allow: GET, OPTIONS
< link: </hello/openapi-doc-dygixywsw>;rel="service-desc", </hello/swagger-ui-dygixywsw>;rel="swagger-ui"
< server: ballerina
< date: Thu, 13 Jun 2024 20:04:11 +0530
< 
* Connection #0 to host localhost left intact
* Closing connection 0
```

##### 2.3.6.1. Introspection resource

The introspection resource is one of the generated OAS resources, and it hosts the OpenAPI specification for the service 
in JSON format. The user can send a GET request to the resource path specified in the link header with the relation 
attribute set to `service-desc`.

Output of GET call to introspection resource
```ballerina
curl -v localhost:9090/hello/openapi-doc-dygixywsw
*   Trying 127.0.0.1:9090...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 9090 (#0)
> GET /hello/openapi-doc-dygixywsw HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.68.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< content-type: application/json
< content-length: 675
< server: ballerina
< date: Thu, 13 Jun 2024 20:05:03 +0530
< 
{
  "openapi" : "3.0.1",
  "info" : {
    "title" : "Hello",
    "version" : "0.1.0"
  },
  "servers" : [ {
    "url" : "{server}:{port}/hello",
    "variables" : {
      "server" : {
        "default" : "http://localhost"
      },
      "port" : {
        "default" : "9090"
      }
    }
  } ],
  "paths" : {
    "/greeting" : {
      "get" : {
        "operationId" : "getGreeting",
        "responses" : {
          "200" : {
            "description" : "Ok",
            "content" : {
              "text/plain" : {
                "schema" : {
                  "type" : "string"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

##### 2.3.6.2. SwaggerUI resource

The swagger-ui resource is one of the generated OAS resources, and it hosts the OpenAPI specification for the service in 
HTML format. The user can view it in a web browser by accessing the URL specified in the HTTP link header, which has 
relation attribute set to `swagger-ui`.

### 2.4. Client
A client allows the program to send network messages to a remote process according to the HTTP protocol. The fixed 
remote methods of the client object correspond to distinct network operations defined by the HTTP protocol.

The client init function requires a valid URL and optional configuration to initialize the client. 
```ballerina
http:Client clientEP = check new ("http://localhost:9090", { httpVersion: "2.0" });
```

#### 2.4.1 Client types
The client configuration can be used to enhance the client behaviour. By default, HTTP client supports HTTP2 version.

```ballerina
public type ClientConfiguration record {|
    string httpVersion = HTTP_2_0;
    ClientHttp1Settings http1Settings = {};
    ClientHttp2Settings http2Settings = {};
    decimal timeout = 60;
    string forwarded = "disable";
    FollowRedirects? followRedirects = ();
    PoolConfiguration? poolConfig = ();
    CacheConfig cache = {};
    Compression compression = COMPRESSION_AUTO;
    ClientAuthConfig? auth = ();
    CircuitBreakerConfig? circuitBreaker = ();
    RetryConfig? retryConfig = ();
    CookieConfig? cookieConfig = ();
    ResponseLimitConfigs responseLimits = {};
    ClientSecureSocket? secureSocket = ();
    ProxyConfig? proxy = ();
    boolean validation = true;
|};

public type ClientHttp1Settings record {|
    KeepAlive keepAlive = KEEPALIVE_AUTO;
    Chunking chunking = CHUNKING_AUTO;
    ProxyConfig? proxy = ();
|};

public type ClientHttp2Settings record {|
    boolean http2PriorKnowledge = false;
    int http2InitialWindowSize = 65535;
|};

```

Based on the config, the client object will be accompanied by following client behaviours. Following clients cannot be
instantiated calling `new`, instead user have to enable the config in the `ClientConfiguration`.

##### 2.4.1.1 Security
Provides secure HTTP remote methods for interacting with HTTP endpoints. This will make use of the authentication
schemes configured in the HTTP client endpoint to secure the HTTP requests.
```ballerina
http:Client clientEP = check new ("https://localhost:9090",
    auth = {
        username: username,
        password: password
    },
    secureSocket = {
        cert: {
            path: TRUSTSTORE_PATH,
            password: "ballerina"
        }
    }
);
```

##### 2.4.1.2 Caching
An HTTP caching client uses the HTTP caching layer once `cache` config is enabled.
```ballerina
http:Client clientEP = check new ("http://localhost:9090",
    cache = {
        enabled: true, 
        isShared: true 
    }
);
```

##### 2.4.1.3 Redirect
Provide the redirection support for outbound requests internally considering the location header when `followRedirects`
configs are defined.
```ballerina
http:Client clientEP = check new ("http://localhost:9090", 
    followRedirects = { 
        enabled: true, 
        maxCount: 3 
    }
);
```

##### 2.4.1.4 Retry
Provides the retrying over HTTP requests when `retryConfig` is defined.
```ballerina
http:Client clientEP = check new ("http://localhost:9090",
    retryConfig = {
        interval: 3,
        count: 3,
        backOffFactor: 0.5
    }
);
```

##### 2.4.1.5 Circuit breaker
A Circuit Breaker implementation which can be used to gracefully handle network failures.
```ballerina
http:Client clientEP = check new ("http://localhost:9090", 
    circuitBreaker = {
        rollingWindow: {
            timeWindow: 60,
            bucketSize: 20,
            requestVolumeThreshold: 0
        },
        failureThreshold: 0.3,
        resetTime: 2,
        statusCodes: [500, 501, 502, 503]
    }
);
```

##### 2.4.1.6 Cookie
Provides the cookie functionality across HTTP client actions. The support functions defined in the request can be 
used to manipulate cookies.
```ballerina
http:Client clientEP = check new ("http://localhost:9090", 
    cookieConfig = { 
        enabled: true, 
        persistentCookieHandler: myPersistentStore 
    }
);
```

Following clients can be created separately as it requires different configurations.

##### 2.4.1.7 Load balance
LoadBalanceClient endpoint provides load balancing functionality over multiple HTTP clients. It uses the
LoadBalanceClientConfiguration. 
```ballerina
public type LoadBalanceClientConfiguration record {|
    *CommonClientConfiguration;
    TargetService[] targets = [];
    LoadBalancerRule? lbRule = ();
    boolean failover = true;
|};

http:LoadBalanceClient clientEP = check new (
    targets = [
        { url: "http://localhost:8093/LBMock1" },
        { url: "http://localhost:8093/LBMock2" },
        { url: "http://localhost:8093/LBMock3" }
    ],
    timeout = 5
);
```

##### 2.4.1.8 Failover
An HTTP client endpoint which provides failover support over multiple HTTP clients. It uses the
FailoverClientConfiguration.
```ballerina
public type FailoverClientConfiguration record {|
    *CommonClientConfiguration;
    TargetService[] targets = [];
    int[] failoverCodes = [501, 502, 503, 504];
    decimal interval = 0;
|};

http:FailoverClient foBackendEP00 = check new (
    timeout = 5,
    failoverCodes = [501, 502, 503],
    interval = 5,
    targets = [
        { url: "http://localhost:3467/inavalidEP" },
        { url: "http://localhost:8080/echo00" },
        { url: "http://localhost:8080/mockResource" },
        { url: "http://localhost:8080/mockResource" }
    ]
)
```

##### 2.4.1.9 Status code binding client

An HTTP status code binding client can be used to bind the response to the status code response records.

```ballerina
final http:StatusCodeClient albumClient = check new ("localhost:9090");

public type AlbumsOk record {|
    *http:Ok;
    Album[] body;
|};

public function main() {
    // Status code response binding with generic type 
    http:Ok|error response1 = albumClient->/v1/albums;
    
    // Status code response binding with specific body type
    AlbumsOk|error response2 = albumClient->/v1/albums;
}
```

##### 2.4.2. Client action

The HTTP client contains separate remote method representing each HTTP method such as `get`, `put`, `post`,
`delete`,`patch`,`head`,`options` and some custom remote methods.

###### 2.4.2.1 Entity body methods
 
POST, PUT, DELETE, PATCH methods are considered as entity body methods. These remote methods contains RequestMessage
as the second parameter to send out the Request or Payload. 

```ballerina
public type RequestMessage Request|string|xml|json|byte[]|int|float|decimal|boolean|map<json>|table<map<json>>|
                           (map<json>|table<map<json>>)[]|mime:Entity[]|stream<byte[], io:Error?>|();
```

Based on the payload types respective header value is added as the `Content-type` of the `http:Request`.

| Type                                                                  | Content Type             |
|-----------------------------------------------------------------------|--------------------------|
| ()                                                                    | -                        |
| string                                                                | text/plain               |
| xml                                                                   | application/xml          |
| byte[], stream<byte[], io:Error?>                                     | application/octet-stream |
| int, float, decimal, boolean                                          | application/json         |
| map\<json\>, table<map\<json\>>, map\<json\>[], table<map\<json\>>)[] | application/json         |

The header map and the mediaType param are optional for entity body remote methods.

```ballerina
# The post() function can be used to send HTTP POST requests to HTTP endpoints.
remote isolated function post(string path, RequestMessage message, map<string|string[]>? headers = (),
        string? mediaType = (), TargetType targetType = <>)
        returns targetType|ClientError;

# The put() function can be used to send HTTP PUT requests to HTTP endpoints.
remote isolated function put(string path, RequestMessage message, map<string|string[]>? headers = (),
        string? mediaType = (), TargetType targetType = <>)
        returns targetType|ClientError;

# The patch() function can be used to send HTTP PATCH requests to HTTP endpoints.
remote isolated function patch(string path, RequestMessage message, map<string|string[]>? headers = (),
        string? mediaType = (), TargetType targetType = <>)
        returns targetType|ClientError;

# The delete() function can be used to send HTTP DELETE requests to HTTP endpoints.
remote isolated function delete(string path, RequestMessage message = (), map<string|string[]>? headers = (),
        string? mediaType = (), TargetType targetType = <>)
        returns targetType|ClientError;
```

```ballerina
http:Client httpClient = check new ("https://www.example.com");
string response = check httpClient->post("/some/endpoint",
   {
       name: "foo",
       age: 25,
       address: "area 51"
   },
   headers = {
       "my-header": "my-header-value"
   }
   mediaType = "application/json",
);
```

###### 2.4.2.2 Non Entity body methods

GET, HEAD, OPTIONS methods are considered as non entity body methods. These remote methods do not contain 
RequestMessage, but the header map an optional param.

```ballerina
# The head() function can be used to send HTTP HEAD requests to HTTP endpoints.
remote isolated function head(string path, map<string|string[]>? headers = ()) returns Response|ClientError;

# The get() function can be used to send HTTP GET requests to HTTP endpoints.
remote isolated function get( string path, map<string|string[]>? headers = (), TargetType targetType = <>)
        returns  targetType|ClientError;

# The options() function can be used to send HTTP OPTIONS requests to HTTP endpoints.
remote isolated function options( string path, map<string|string[]>? headers = (), TargetType targetType = <>)
        returns  targetType|ClientError;
```

````ballerina
http:Client httpClient = check new ("https://www.example.com");
map<string|string[]> headers = {
   "my-header": "my-header-value",
   "header-2": ["foo", "bar"]
};
string resp = check httpClient->get("/data", headers);
````

###### 2.4.2.3 Resource methods

In addition to the above remote method actions, HTTP client supports executing standard HTTP methods through resource 
methods. The following are the definitions of those resource methods :

```ballerina
# Defines the path parameter types.
public type PathParamType boolean|int|float|decimal|string;

# The post resource method can be used to send HTTP POST requests to HTTP endpoints.
resource function post [PathParamType ...path](RequestMessage message, map<string|string[]>? headers = (), string? mediaType = (),
            TargetType targetType = <>, *QueryParams params) returns targetType|ClientError;

# The put resource method can be used to send HTTP PUT requests to HTTP endpoints.            
resource function put [PathParamType ...path](RequestMessage message, map<string|string[]>? headers = (), string? mediaType = (),
            TargetType targetType = <>, *QueryParams params) returns targetType|ClientError;

# The patch resource method can be used to send HTTP PATCH requests to HTTP endpoints.              
resource function patch [PathParamType ...path](RequestMessage message, map<string|string[]>? headers = (), string? mediaType = (),
            TargetType targetType = <>, *QueryParams params) returns targetType|ClientError;

# The delete resource method can be used to send HTTP DELETE requests to HTTP endpoints.              
resource function delete [PathParamType ...path](RequestMessage message = (), map<string|string[]>? headers = (), string? mediaType = (),
            TargetType targetType = <>, *QueryParams params) returns targetType|ClientError;

# The head resource method can be used to send HTTP HEAD requests to HTTP endpoints.              
resource function head [PathParamType ...path](map<string|string[]>? headers = (), *QueryParams params)
            returns Response|ClientError; 

# The get resource method can be used to send HTTP GET requests to HTTP endpoints.              
resource function get [PathParamType ...path](map<string|string[]>? headers = (), TargetType targetType = <>,
            *QueryParams params) returns targetType|ClientError;

# The options resource method can be used to send HTTP OPTIONS requests to HTTP endpoints.              
resource function options [PathParamType ...path](map<string|string[]>? headers = (), TargetType targetType = <>,
            *QueryParams params) returns targetType|ClientError;                                               
```

* Path parameter

Path parameters can be specified in the resource invocation along with the type.
The supported types are `string`, `int`, `float`, `boolean`, and `decimal`.

```ballerina
// Making a GET request
string 'from = "2022-10-31";
string to = "2023-10-29";
http:Client httpClient = check new ("https://www.example.com");
string resp = check httpClient->/date/['from]/[to];
// Same as the following :
// string response = check httpClient->get("/date/2022-10-31/2023-10-29");
```

```ballerina
// Making a POST request
string profession = "chemist";
json payload = {
   name: "Jesse Pinkman",
   age: 25
};
string response = check httpClient->/addPerson/[profession].post(payload);
// Same as the following :
// string response = check httpClient->post("/addPerson/chemist", payload);
```

* Query parameter

A query parameter is passed as a key-value pair in the resource method call.
The supported types are `string`, `int`, `float`, `boolean`, `decimal`, and the `array` types of the aforementioned types.
The query param type can be nil as well.
```ballerina
// Making a GET request
string resp = check httpClient->/date(id = 123);
// Same as the following :
// string response = check httpClient->get("/date?id=123");
```
```ballerina
// Making a POST request
json payload = {
   name: "Jesse Pinkman",
   age: 25
};
string response = check httpClient->/addPerson.post(payload, profession = "chemist", id = 123);
// Same as the following :
// string response = check httpClient->post("/addPerson?profession=chemist&id=123", payload);
```

* Header parameter

The headers to a resource method can be provided as `map<string|string[]>`.

```ballerina
// Making a GET request
map<string|string[]> headers = {
   "my-header": "my-header-value",
   "header-2": ["foo", "bar"]
};
string resp = check httpClient->/date(headers);
// Same as the following :
// string response = check httpClient->get("/date", headers);
```

```ballerina
// Making a POST request
json payload = {
   name: "Jesse Pinkman",
   age: 25
};
map<string> headers = { "my-header": "my-header-value" };
string response = check httpClient->/addPerson.post(payload, headers, "application/json");
// Same as the following :
// string response = check httpClient->post("/addPerson", payload, headers, "application/json");
```

###### 2.4.2.4 Forward/Execute methods

In addition to the standard HTTP methods, `forward` function can be used to proxy an inbound request using the incoming 
HTTP request method. Also `execute` remote method is useful to send request with custom HTTP verbs such as `move`, 
`copy` and etc.


```ballerina
# Invokes an HTTP call with the specified HTTP verb.
remote isolated function execute(string httpVerb,  string path, RequestMessage message, 
        map<string|string[]>? headers = (), string? mediaType = (), TargetType targetType = <>)
        returns targetType|ClientError;

# The forward() function can be used to invoke an HTTP call with inbound request's HTTP verb
remote isolated function forward(string path, Request request, TargetType targetType = <>)
        returns  targetType|ClientError;
```

###### 2.4.2.5 HTTP2 additional methods
Following are the HTTP2 client related additional remote methods to deal with promises and responses.

```ballerina

# Submits an HTTP request to a service with the specified HTTP verb.
# The submit() function does not give out a http:Response as the result.
# Rather it returns an http:HttpFuture which can be used to do further interactions with the endpoint.
remote isolated function submit(string httpVerb, string path, RequestMessage message)
    returns HttpFuture|ClientError;

# Passes the request to actual network call.
remote isolated function getResponse(HttpFuture httpFuture) returns Response|ClientError;

# Passes the request to actual network call.
remote isolated function hasPromise(HttpFuture httpFuture) returns boolean;

# Passes the request to actual network call.
remote isolated function getNextPromise(HttpFuture httpFuture) returns PushPromise|ClientError;

# Passes the request to an actual network call.
remote isolated function getPromisedResponse(PushPromise promise) returns Response|ClientError;

# Passes the request to actual network call.
remote isolated function rejectPromise(PushPromise promise);
```

##### 2.4.3. Client action return types

The HTTP client remote method supports the contextually expected return types. The client operation is able to 
infer the expected payload type from the LHS variable type. This is called as client payload binding support where the 
inbound response payload is accessed and parse to the expected type in the method signature. It is easy to access the
payload directly rather manipulation `http:Response` using its support methods such as `getTextPayload()`, 
`getJsonPayload()` and etc.

Client data binding supports `anydata` and `stream<http:SseEvent>` where the payload is deserialized based on the media type before binding it 
to the required type. Similar to the service data binding following table explains the compatible `anydata` types with 
each common media type. In the absence of a standard media type, the binding type is inferred by the payload parameter 
type itself. If the type is not compatible with the media type, error is returned.

| Ballerina Type | Structure                     | "text" | "xml" | "json" | "x-www-form-urlencoded" | "octet-stream" | "event-stream" |
|----------------|-------------------------------|:------:|:-----:|:------:|:-----------------------:|:--------------:|:--------------:|
| boolean        |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | boolean[]                     |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<boolean\>                |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<map\<boolean\>\>       |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| int            |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | int[]                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<int\>                    |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<map\<int\>\>           |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| float          |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | float[]                       |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<float\>                  |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<map\<float\>\>         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| decimal        |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | decimal[]                     |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<decimal\>                |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<map\<decimal\>\>       |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| byte[]         |                               |   ✅    |   ❌   |   ✅    |            ❌            |       ✅        |       ❌        |
|                | byte[][]                      |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<byte[]\>                 |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<map\<byte[]\>\>        |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| string         |                               |   ✅    |   ❌   |   ✅    |            ✅            |       ❌        |       ❌        |
|                | string[]                      |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<string\>                 |   ❌    |   ❌   |   ✅    |            ✅            |       ❌        |       ❌        |
|                | table\<map\<string\>\>        |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| xml            |                               |   ❌    |   ✅   |   ❌    |            ❌            |       ❌        |       ❌        |
| json           |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | json[]                        |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<json\>                   |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<map\<json\>\>          |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| map            |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map[]                         |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<map\>                    |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<map\<map\>\>           |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| record         |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | record[]                      |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | map\<record\>                 |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | table\<record\>               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
| stream         |                               |   ❌    |   ❌   |   ✅    |            ❌            |       ❌        |       ❌        |
|                | stream<http:SseEvent, error?> |   ❌    |   ❌   |   ❌    |            ❌            |       ❌        |       ✅        |

```ballerina
http:Client httpClient = check new ("https://person.free.beeceptor.com");
json payload = check httpClient->get("/data");
```
In case of using var as return type, user can pass the typedesc to the targetType argument.

```ballerina
http:Client httpClient = check new ("https://person.free.beeceptor.com");
var payload = check httpClient->get("/data", targetType = json);
```

If any of the type is union with `()`(i.e `string?`), then in the absence of the payload, `()` will be assigned as
the value without being responded by a `BAD REQUEST` response.

```ballerina
string? payload = check httpClient->get("/data");
```

When the user expects client data binding to happen, the HTTP error responses (4XX, 5XX) will be categorized as an 
error (http:ClientRequestError, http:RemoteServerError) of the client remote operation. These error types contain 
payload, headers and status code inside the error detail.

```ballerina
public type Detail record {
    int statusCode;
    map<string[]> headers;
    anydata body;
};
```
The error detail is useful when user wants to dig deeper to understand the backend failure. Here the error message 
is the response phrase.

```ballerina
json|error result = httpClient->post("/backend/5XX", "payload");
if result is http:RemoteServerError {
    int statusCode = result.detail().statusCode;
    anydata payload = result.detail().body;
    map<string[]> headers = result.detail().headers;
}
```

Additionally, the client action return type can be a union of `anydata`. Based on the media type, the potential binding
type is decided. For example, if the union is defined as `json|xml` and the media type is related to `json`,
the deserialization and the binding will proceed according to the type `json`. But if the media type is related to `xml`
the process will happen according to the type `xml`.
If the given types of the union are not compatible with the media type, an error is returned.

```ballerina
json|xml payload = check httpClient->get("/data");
```

If the type is union with `()`(i.e `string?`), then in the absence of the payload, `()` will be assigned as
the value without being responded by a `BAD REQUEST` response.

## 3. Request routing
Ballerina dispatching logic is implemented to uniquely identify a resource based on the request URI and Method.

### 3.1. URI and HTTP method match

The ballerina dispatcher considers the absolute-resource-path of the service as the base path and the resource
method name as the path of the resource method for the URI path match.
Ballerina dispatching logic depends on the HTTP method of the request in addition to the URI. Therefore, matching only 
the request path will not be sufficient. Once the dispatcher finds a resource, it checks for the method compatibility 
as well. The accessor name of the resource describes the HTTP method where the name of the remote method implicitly 
describes its respective method

### 3.2. Most specific path match
When discovering the resource, the complete path will be considered when figuring out the best match. Perhaps a 
part of the request URI can be matched, yet they won’t be picked unless the longest is matched.

### 3.3. Wild card path match
The resource path can contain a template within the bracket along with the type which represents the wild card. 
i.e `[string… s]`.That is some special way to say that if nothing matched, then the wildcard should be invoked. 
When the best resource match does not exist, a resource with a wild card path can be stated in the API design to 
get requests dispatched without any failure.  

### 3.4. Path parameter template match
PathParam is a parameter which allows you to map variable URI path segments into your resource call. Only the 
resource methods allow this functionality where the resource name can have path templates as a path segment with 
variable type and the identifier within curly braces.
```ballerina
resource function /foo/[string bar]() {
    
}
```
The value of the variable is extracted from the URI and assigned to the resource name parameter during the run-time 
execution.

## 4. Annotations
   
### 4.1. Service configuration
The configurations stated in the http:ServiceConfig  changes the behavior of particular services and applies it to 
all the resources mentioned in the particular services. Some configurations such as Auth, CORS can be overridden by 
resource level configurations. Yet, the service config is useful to cover service level configs.

```ballerina
# ServiceConfig definition
public type HttpServiceConfig record {|
    string host = "b7a.default";
    CompressionConfig compression = {};
    Chunking chunking = CHUNKING_AUTO;
    CorsConfig cors = {};
    ListenerAuthConfig[] auth?;
    string mediaTypeSubtypePrefix?;
    boolean treatNilableAsOptional = true;
    Interceptor|Interceptor[] interceptors?;
    byte[] openApiDefinition = [];
|};

@http:ServiceConfig {
    chunking: http:CHUNKING_ALWAYS
}
service on testListener {
    
}
```

The `openApiDefinition` field in http:ServiceConfig annotation serves a unique purpose. It will be automatically 
populated at compile-time with OpenAPI definition of the particular http:Service if the OpenAPI definition auto 
generation is available.

### 4.2. Resource configuration
The resource configuration responsible for shaping the resource method. Most of the behaviours are provided from 
the language itself such as path, HTTP verb as a part of resource method. Some other configs such as CORS, 
compression, auth are defined in the resource config.

```ballerina
# ResourceConfig definition
public type HttpResourceConfig record {|
    string name?;
    string[] consumes = [];
    string[] produces = [];
    CorsConfig cors = {};
    boolean transactionInfectable = true;
    ListenerAuthConfig[]|Scopes auth?;
    LinkedTo[] linkedTo?;
|};

@http:ResourceConfig {
    produces: ["application/json"]
}
resource function post person() {

}
```

### 4.3. Payload annotation
The payload annotation has two usages. It is used to decorate the resource method payload parameter and to decorate 
the resource return type. 

```ballerina
public type Payload record {|
    string|string[] mediaType?;
|}
```

#### 4.3.1. Payload binding parameter

The request payload binding is supported in resource methods where users can access it through a resource method 
parameter. The @http:Payload annotation is specially introduced to distinguish the request payload with other 
resource method parameters. The annotation can be used to specify values such as mediaType...etc. Users can 
define the potential request payload content type as the mediaType to perform some pre-validations as same as 
Consumes resource config field.

```ballerina
resource function post person(@http:Payload {mediaType:["application/json", "application/ld+json"]} json payload)  {
    
}
```

During the runtime, the request content-type header is matched against the mediaType field value to validate. If the 
validation fails, the listener returns an error response with the status code of 415 Unsupported Media Type. 
Otherwise, the dispatching moves forward. 

#### 4.3.2. Anydata return value info

The same annotation can be used to specify the MIME type return value when a particular resource method returns 
one of the anydata typed values. In this way users can override the default MIME type which the service type has 
defined based on the requirement. Users can define the potential response payload content type as the mediaType 
to perform some pre-runtime validations in addition to the compile-time validations as same as produces resource 
config field.

```ballerina
resource function post person() returns @http:Payload{mediaType:"application/xml"} xml? {
    
}
```

During the runtime, the request accept header is matched against the mediaType field value to validate. If the 
validation fails, the listener returns an error response with the status code of 406 Not Acceptable. Otherwise, the 
dispatching moves forward.

The annotation is not mandatory, so if the media type info is not defined, the following table describes the default 
MIME types assigned to each anydata type.

| Declared return type                                                            | MIME type                |
|---------------------------------------------------------------------------------|--------------------------|
| ()                                                                              | (no body)                |
| xml                                                                             | application/xml          |
| string                                                                          | text/plain               |
| byte[]                                                                          | application/octet-stream |
| map\<json\>, table\<map\<json\>\>, (map\<json\> &#124; table\<map\<json\>\>)[]) | application/json         |
| int, float, decimal, boolean                                                    | application/json         |

If anything comes other than above return types will be default to `application/json`.

### 4.4. CallerInfo annotation

The CallerInfo annotation associated with the `Caller` is to denote the response type.
It will ensure that the resource method responds with the right type and provides static type information about
the response type that can be used to generate OpenAPI.

```ballerina
resource function get person(@http:CallerInfo { respondType: http:Accepted } http:Caller hc) returns error?{
    Person p = {};
    hc->respond(Person p);
}
```

### 4.5. Header annotation

```ballerina

resource function get person(@http:Header {name:"Referer"} string referer) {

}
```
### 4.6. Cache annotation

This annotation can be used to enable response caching from the resource signature. This allows to set the 
`cache-control`, `etag` and `last-modified` headers in the response.

The default behavior (`@http:Cache`) is to have `must-revalidate,public,max-age=3600` directives in 
`cache-control` header. In addition to that `etag` and `last-modified` headers will be added.

```ballerina
@http:Cache {                 // Default Configuration
    mustRevalidate : true,    // Sets the must-revalidate directive
    noCache : false,          // Sets the no-cache directive
    noStore : false,          // Sets the no-store directive 
    noTransform : false,      // Sets the no-transform directive
    isPrivate : false,        // Sets the private and public directive
    proxyRevalidate : false,  // Sets the proxy-revalidate directive
    maxAge : 3600,             // Sets the max-age directive. Default value is 3600 seconds
    sMaxAge : -1,             // Sets the s-maxage directive
    noCacheFields : [],       // Optional fields for no-cache directive
    privateFields : [],       // Optional fields for private directive
    setETag : true,           // Sets the etag header
    setLastModified : true    // Sets the last-modified header
}
```
This annotation can **only** support return types of `anydata` and `SuccessStatusCodeResponse`. (For other return 
values cache configuration will not be added through this annotation)

```ballerina
// Sets the cache-control header as "public,must-revalidate,max-age=5". Also sets the etag header.
// last-modified header will not be set
resource function get greeting() returns @http:Cache{maxAge : 5, setLastModified : false} string {
    return "Hello, World!!"
}
```

## 5. URL parameters
### 5.1. Path
Path params are specified in the resource name itself. Path params can be specified in the types of string, int, 
boolean, decimal and float. During the request runtime the respective path segment is matched and cast into param 
type. Users can access it within the resource method, and it is very useful when designing APIs with dynamically 
changing path segments.

### 5.2. Query
Query params can be accessed via the resource signature without an annotation or accessed via request functions.

```ballerina
# Gets the query parameters of the request as a map consisting of a string array.
public isolated function getQueryParams() returns map<string[]> {
    
}

# Gets the query param value associated with the given key.
public isolated function getQueryParamValue(string key) returns string? {

}

# Gets all the query param values associated with the given key.
public isolated function getQueryParamValues(string key) returns string[]? {

}
```
### 5.3. Matrix
The matrix params are one of the URL param which is supported access in ballerina using a function which bound to 
the request

```ballerina
# Gets the matrix parameters of the request.
public isolated function getMatrixParams(string path) returns map<any> {
    
}
```

## 6. Request and Response
The request and the response represent the message/data which travel over the network using HTTP. The request object 
models the inbound/outbound message with request oriented properties, headers and payload. Followings are the properties 
associated with the `http:Request` which get populated for each request during the runtime.

```ballerina
public class Request {
   public string rawPath = "";
   public string method = "";
   public string httpVersion = "";
   public string userAgent = "";
   public string extraPathInfo = "";
   public RequestCacheControl? cacheControl = ();
   public MutualSslHandshake? mutualSslHandshake = ();
}
```

The header and the payload manipulation can be done using the functions associated to the request.

Same as request, the response object also models the inbound/outbound message with the response oriented properties 
and headers. Followings are the properties associated with the `http:Response` which get populated for each response 
during the runtime.

```ballerina
public class Response {
    public int statusCode = 200;
    public string reasonPhrase = "";
    public string server = "";
    public string resolvedRequestedURI = "";
    public ResponseCacheControl? cacheControl = ();
}
```

The header and the payload manipulation can be done using the functions associated to the response.

## 7. Header and Payload
The header and payload are the main components of the request and response. In the world of MIME, that is called 
Entity header and Entity body. Ballerina supports multiple payload types and allows convenient functions to access 
headers along with other properties.

### 7.1. Parse header functions

```ballerina
# Parses the header value which contains multiple values or parameters.
parseHeader(string headerValue) returns HeaderValue[]|ClientError  {

}
```

### 7.2 Links support
Hypermedia As the Engine Of Application State (HATEOAS) is one of the key principles in REST, which brings the 
connectedness to a set of scattered resources. It also brings direction as to what might user could do next. Similar 
to Web pages REST APIs becomes self-descriptive and dynamic along with this principle.

As an initial support to HATEOAS, HTTP package has the ability to statically record the connectedness of resources 
through `Links` object. `Links` is a map of `Link` objects which represent the connectedness between resources. The 
`Link` record is defined as follows :
```ballerina
public type Link record {
    # Names the relationship of the linked target to the current representation
    string rel?;
    # Target URL
    string href;
    # Expected resource representation media types
    string[] types?;
    # Allowed resource methods
    Method[] methods?;
};
```

This `Links` is generated from the `linkedTo` field in the `ResourceConfig` annotation and added either to the 
payload or as a `Link` header depending on the payload type. This `Links` will not be added when an `http:Response` is 
returned.

#### 7.2.1 LinkedTo record
The `LinkedTo` record is defined as follows :
```ballerina
public type LinkedTo record {|
    string name;
    string relation = "self";
    string method?;
|};
```

This record represents a connectedness between two resources. All the fields in the `LinkedTo` record is 
**case-insensitive**. The `relation` field is defaulted to the IANA link relation `self`, and for a specific resource, 
the linked resources should have a **unique** relation.  

The linked resource is resolved using the resource link name specified in the `name` field. To 
find the linked resource, the linked resource should be configured with the same name through `ResourceConfig` 
annotation. Following is a simple example of creating links :
```ballerina
service on new http:Listener(port) {

    @http:ResourceConfig {
        // Create a link between this resource and "Payment" resource
        linkedTo: [{ name: "Payment", rel: "payment" }]
    }
    resource function post 'order(@http:Payload Order 'order) returns 
            http:Accepted|http:InternalServerError {
        // some logic
    }
    
    @http:ResourceConfig {
        name: "Payment"
    }
    resource function put payment/[string id](@http:Payload Payment payment) returns 
            http:Ok|http:InternalServerError {
        // some logic
    }
}
```

Resource link name can be duplicated only when the resources have the same path. In this case, the `method` of the 
linked resource should be specified in the `LinkedTo` record to resolve conflicts. Following is an example when we have two 
resources with the same resource link name :
```ballerina
service on new http:Listener(port) {

    @http:ResourceConfig {
        name: "Orders",
        linkedTo: [
            { name: "Orders", rel: "edit",  method: "PUT" },
            { name: "Orders", rel: "remove",  method: "DELETE" }
        ]
    }
    resource function put orders/[string id](@http:Payload Order 'order) returns 
            http:Ok|http:InternalServerError {
        // some logic
    }
    
    @http:ResourceConfig {
        name : "Orders"
    }
    resource function delete orders/[string id]() returns http:Ok|http:InternalServerError {
        // some logic
    }
}
```

#### 7.2.2 Links in the response
The static `Links` generated from the `linkedTo` field will be injected into the JSON payload when it is not 
a closed record and not `readonly`. Suppose the user returns the below record type, the runtime will inject the `Links` 
record as in the latter. Therefore, the response should be considered as a record with the `Links` field.

```ballerina
public type 'Order record {
    string item_name;
    string id;
    string quantity;
};
```

```ballerina
public type 'Order record {
    *http:Links;
    string item_name;
    string id;
    string quantity;
};
```

Following is an example of `Links` in payload :
```ballerina
service on new http:Listener(port) {

    @http:ResourceConfig {
        linkedTo: [{ name: "Payment", rel: "payment" }]
    }
    resource function get orders/[string id]() returns Order|http:NotFound {
        // some logic
    }
    
    @http:ResourceConfig {
        name: "Payment"
    }
    resource function put payment/[string id](@http:Payload Payment payment) returns 
            http:Ok|http:InternalServerError {
        // some logic
    }
}
```
The response payload to the GET resource will look like this :
```json
{
   "item_name": "latte",
   "quantity": 2,
   "_links":{
      "payment":{
         "href": "/payment/{id}", 
         "types": ["application/json"],
         "methods":["PUT"]
      }
   }
}
```
The fields of the `Link` are automatically populated from the resource specified in the `LinkedTo` configuration.

When there is no payload or when `Links` not supported in the payload, the `Links` will be added as a `Link` header. 
Following is an example of `Links` in `Link` header:
```ballerina
service on new http:Listener(port) {

    @http:ResourceConfig {
        linkedTo: [{ name: "Payment", rel: "payment" }]
    }
    resource function post order(@http:Payload Order 'order) returns 
            http:Accepted|http:InternalServerError {
        // some logic
        // return http:Accepted without body
    }
    
    @http:ResourceConfig {
        name: "Payment"
    }
    resource function put payment/[string id](@http:Payload Payment payment) returns 
            http:Ok|http:InternalServerError {
        // some logic
    }
}
```
The response will have the following header :
```
link: "</payment/{id}>; rel=\"payment\"; methods=\"\"PUT\"\""
```

The `Links` will not overwrite the payload or the header if the user has already added the links.

## 8. Interceptor and error handling
### 8.1 Interceptor
Interceptor enhances the HTTP package with interceptors. Interceptors typically do small units of work such as logging, header 
manipulation, state publishing, etc., before resources are invoked. The ability to execute some common logic for all 
the inbound requests and outbound responses has proven to be highly useful. It typically includes some small unit of 
work such as the below.
 - Logging
 - Header manipulation
 - Observability
 - Throttling
 - Validating
 - Securing

Interceptors are designed for both request and response flows. There are just service objects which will be executed in
a configured order to intercept request and response. These interceptor services can only have either a resource method 
or a remote method depends on the interceptor type. Moreover, they do not support `ServiceConfig`, `ResourceConfig`
and `Cache` annotations.

#### 8.1.1 Request interceptor
Following is an example of `RequestInterceptor` written in Ballerina swan-lake. `RequestInterceptor` can only have one 
resource method.

```ballerina
service class RequestInterceptor {
   *http:RequestInterceptor;
 
   resource function 'default [string… path](http:RequestContext ctx, http:Request req) returns http:NextService|error? {
       req.setHeader("X-requestHeader", "RequestInterceptor");
       return ctx.next();
   }
}
```

Since interceptors work with network activities, it must be either a remote or resource method. In this case resource 
functions are used for `RequestInterceptor` as it gives more flexibility. With resource methods interceptors can be engaged 
based on HTTP method and path.

For instance consider a scenario where there are two resources: one on path `foo` whereas the other on path `bar`. If the 
user writes an interceptor as follows, it would only get hit when the request is directed to `foo` resource.

```ballerina
service class RequestInterceptor {
   *http:RequestInterceptor;
 
   resource function 'default foo(http:RequestContext ctx, http:Request req) returns http:NextService|error? {
       req.setHeader("X-requestHeader", "RequestInterceptor");
       return ctx.next();
   }
}
```

##### 8.1.1.1 Request context
Following is the rough definition of the interceptor context. Request context can store non-error values, and these values 
can be retrieved at the next services in the pipeline.  
```ballerina
// This is same as the `value:Cloneable`, except that it does not include `error` type.
# Represents a non-error type that can be cloned.
public type Cloneable (any & readonly)|xml|Cloneable[]|map<Cloneable>|table<map<Cloneable>>;
 
# Request context member type.
public type ReqCtxMember Cloneable|isolated object {};

# Request context member type descriptor.
public type ReqCtxMemberType typedesc<ReqCtxMember>;

# Represents an HTTP Context that allows user to pass data between interceptors.
public isolated class RequestContext {
    private final map<ReqCtxMember> members = {};

    # Sets an member to the request context object.
    #
    # + key - Represents the member key
    # + value - Represents the member value
    public isolated function set(string key, ReqCtxMember value) {}

    # Gets an member value from the request context object.
    #
    # + key - Represents the member key
    # + return - Member value
    public isolated function get(string key) returns ReqCtxMember {}

    # Checks whether the request context object has an member corresponds to the key.
    #
    # + key - Represents the member key
    # + return - true if the member exists, else false
    public isolated function hasKey(string key) returns boolean {}

    # Returns the member keys of the request context object.
    #
    # + return - Array of member keys
    public isolated function keys() returns string[] {}

    # Gets an attribute value with type from the request context object.
    #
    # + key - Represents the member key
    # + targetType - Represents the expected type of the member value
    # + return - Attribute value or an error if the member value is not of the expected type
    public isolated function getWithType(string key, ReqCtxMemberType targetType = <>) returns targetType|ListenerError = external;

    # Removes a member from the request context object. It panics if there is no such member.
    #
    # + key - Represents the member key
    public isolated function remove(string key) {}

    # Calls the next service in the interceptor pipeline.
    #
    # + return - The next service object in the pipeline. An error is returned, if the call fails
    public isolated function next() returns NextService|error? = external;
}
```

##### 8.1.1.2 next() method
However, there is an addition when it comes to `RequestContext`. A new method namely, `next()` is introduced to control 
the execution flow. Users must invoke `next()` method in order to trigger the next interceptor in the pipeline. Then 
the reference of the retrieved interceptor must be returned from the resource method. Pipeline use this reference to
execute the next interceptor. 

Previously, this was controlled by returning a boolean value which is quite cryptic and confusing.

##### 8.1.1.3 Return to respond
There is a key difference between interceptors and the final service. Resources in the final service allow returning 
values which in turn results in HTTP responses. The same can be done inside the `RequestInterceptors`. However, as 
mentioned above `RequestInterceptor` additionally could return the `NextService|error?` to continue the pipeline which
does not translate into HTTP response. 

When a `RequestInterceptor` responded with a response, the response interceptor pipeline will get executed immediately.
In case of an error, interceptor pipeline execution jumps to the nearest `RequestErrorInterceptor` or 
`ResponseErrorInterceptor` in the pipeline. These error interceptors are special kinds of interceptor which could be 
used to handle errors, and they are not necessarily the last interceptor in the pipeline, they can be anywhere in the 
chain. However, in the case of there is no error interceptors in the pipeline, pipeline returns the internal error 
response to the client similar to any HTTP service resource.

##### 8.1.1.4 Get JWT information
If the JWT information of the request is required, it can be retrieved by using the `getWithType()` api.
```ballerina
[jwt:Header, jwt:Payload] jwtInformation = check ctx.getWithType(http:JWT_INFORMATION);
```

#### 8.1.2 Response interceptor

Following is an example of `ResponseInterceptor` written in Ballerina swan-lake. `ResponseInterceptor` can only have one
remote method : `interceptResponse()`.

```ballerina
service class ResponseInterceptor {
   *http:ResponseInterceptor;
 
   remote function interceptResponse(http:RequestContext ctx, http:Response res) returns http:NextService|error? {
       res.setHeader("X-responseHeader", "ResponseInterceptor");
       return ctx.next();
   }
}
```

`ResponseInterceptor` is different from `RequestInterceptor`. Since it has nothing to do with HTTP methods and paths, 
remote method is used instead of resource method. The `ResponseInterceptor` can access the request as a function parameter.

##### 8.1.2.1 Return to respond
The remote method : `interceptResposne()` allows returning values other than `NextService|error?`. Anyway this will
continue the response interceptor pipeline with the returned response object and calling `RequestContext.next()` is
redundant in this case.

In case of an error, interceptor pipeline execution jumps to the nearest `ResponseErrorInterceptor` in the 
pipeline. . However, in the case of there is no `ResponseInterceptor` in the pipeline, pipeline returns the internal 
error response to the client.

#### 8.1.3 Request error interceptor and response error interceptor
As mentioned above, these are special kinds of interceptor designed to handle errors. These interceptors can  
be placed anywhere in the request or response interceptor chain. The framework automatically adds default 
`RequestErrorInterceptor` and `ResponseErrorInterceptor` which basically prints the error message to the console.

Users can override these interceptors by defining their own ones as follows. Users don’t have to specifically engage 
these interceptors as they only have fixed positions, and they are always executed. The only additional and mandatory 
argument in this case is error `err`. Moreover, the `RequestErrorInterceptor` resource method can only have
the `default` method and default path.

```ballerina
service class RequestErrorInterceptor {
   *http:RequestErrorInterceptor;
 
   remote function 'default [string… path](http:RequestContext ctx, http:Caller caller,
                       http:Request req, error err) returns http:NextService|error? {
       // deal with the error
   }
}
```

The same works for `ResponseErrorInterceptor`, the difference is it has a remote method : `interceptResponseError()`
and deals with response object. In addition, the `ResponseErrorInterceptor` can access the request as a function parameter.

```ballerina
service class ResponseErrorInterceptor {
   *http:ResponseErrorInterceptor;
 
   remote function interceptResponseError(http:RequestContext ctx, http:Response res, error err) 
                       returns http:NextService|error? {
       // deal with the error
   }
}
```

In the case of an error returned within an error interceptor, again execution jumps to the nearest error interceptor. 
However, if there is no error interceptor to jump to, the internal error response is returned just like in a normal 
interceptors.

#### 8.1.4 Engaging interceptors
##### 8.1.4.1 Service level
Interceptors could get engaged at service level. One reason for this is that users may want to engage two different 
interceptor chains for each service even though it is attached to the same Listener. At the service level resource 
function paths are relative to the service base path.

In order to engage interceptors at service level, the service should be marked as `http:InterceptableService`. Then, the 
interceptor pipeline can be defined by implementing the `createInterceptors` function.
```ballerina
public function createInterceptors() returns Interceptor|Interceptor[];
```
Internally, this function is used to create the interceptor pipeline when the service gets initialised. An example 
implementation is shown below,
```ballerina
service http:InterceptableService / on new http:Listener(9099) {

    public function createInterceptors() returns [RequestInterceptor, ResponseInterceptor] {
        return [new RequestInterceptor(), new ResponseInterceptor()];
    }

    resource function get hello() returns string {
        return "Hello, World!";
    }
}
```

When handling `http:ServiceNotFound` scenarios,
1. If there is a service in `/`, the error will be handled by the interceptors in that service.
2. If there is only a single service, the error will be handled by the interceptors in that service.
3. If there are multiple services including a service in `/`, the error will be handled by the interceptors in `/`.
   Otherwise, it will be handled by the `http:DefaultErrorInterceptor`.

##### 8.1.4.2 Execution order of interceptors

![img.png](_resources/img.png)
In the above example blue dashed box represents the `RequestErrorInterceptor` and blue boxes simply represent the 
`RequestInterceptors`, whereas green dashed box represents the `ResponseErrorInterceptor` and green boxes simply represent the 
`ResponseInterceptors`. 

`ResponseInterceptors` are executed in the opposite direction of `RequestInterceptors` i.e. `RequestInterceptors`
are executed head to tail whereas `ResponseInterceptors` are executed tail to head. The new execution order is as follows, 
assuming that there are no error occurred in the pipeline :
```
RequestInterceptor  : 1, 2, 4
ResponseInterceptor : 5, 3
```

However, if the user decides to respond at 4 and terminate the cycle, only the `ResponseInterceptor` at 3 gets executed.
Also, when the `RequestInterceptor` at 2 returns an error, the execution jumps from 2 to 6 as the nearest Error Interceptor
is at 6. The same goes to the response path.

Execution of interceptors does not depend on the existence of the end service i.e. the interceptors are executed in the
relevant order even though the end service does not exist.

#### 8.1.5 Data binding
`RequestInterceptor` methods support data binding. Which means users can directly access the payload, headers and query
parameters. In order to get hold of the headers and the payload, users must use @http:Payload and @http:Headers.

### 8.2 Error handling

#### 8.2.1 Error interceptors

Error handling is an integral part of any network program. Errors can be returned by many components such as interceptors,
dispatcher, data-binder, security handlers, etc. These errors are often handled by a default handler and sent back as 
`500 Internal Server Error` with an entity-body. However, this often causes problems because when designing any API 
consistency matters. Therefore, all the responses must have a consistent format. 

As a result, almost all the real API requires overriding the default error handler and replacing it with their own
error handlers. This can be done by error interceptors discussed in [Request error interceptor and response error 
interceptor](#813-request-error-interceptor-and-response-error-interceptor). These error handlers can be placed 
anywhere in the pipeline. The only mandatory argument in error interceptors is `error`. Just like a main service, it 
is possible to return values from error handlers which will send back as HTTP responses. This overrides the current response
and results in triggering the next response interceptor. Following is such an example :
```ballerina
service class ResponseErrorInterceptor {
   *http:ResponseErrorInterceptor;
 
   remote function interceptResponseError(error err) returns http:NotFound {
       http:NotFound nf = { body: { msg: err.message()} };
       return nf;
   }
}
```

The HTTP module also have a `DefaultErrorInterceptor` which is a `ResponseErrorInterceptor`. This will be added by 
the listener and will be executed at last when there is an error. Hence, any error which is not handled by other 
error interceptors will be finally handled by this default error handler. In essence, the internal default error interceptor
will look like this :
```ballerina
service class DefaultErrorInterceptor {
    *http:ResponseErrorInterceptor;

    remote function interceptResponseError(error err) returns http:Response {
        http:Response res = new;
        res.setTextPayload(err.message());
        // By default, the error response is set to 500 - Internal Server Error
        // However, if the error is an internal error which has a different error
        // status code (4XX or 5XX) then this 500 status code will be overwritten 
        // by the original status code.
        res.statusCode = 500;
        return res;
    }
}
```

In order to overwrite this default error handling behavior, a custom `ResponseErrorInterceptor` can be placed as the 
first interceptor in the listener level configuration which will be executed at last just before the  `DefaultErrorHandler`.

#### 8.2.2 Error types

In addition to error interceptors, HTTP module provides distinct error types in order to intercept errors and handle 
them differently. These error types have a hierarchical structure starting from the basic `HttpError`. The following 
table summarizes the error types which can be intercepted by the error interceptors:

<table>
<thead>
  <tr>
    <th></th>
    <th>Error</th>
    <th>Error Type</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td rowspan="5">Executing Interceptors - Interceptor Level</td>
    <td>500 - no next service to be returned</td>
    <td rowspan="4">InterceptorReturnError</td>
  </tr>
  <tr>
    <td>500 - request context object does not contain the configured interceptors</td>
  </tr>
  <tr>
    <td>500 - next interceptor service did not match with the configuration</td>
  </tr>
  <tr>
    <td>500 - target service did not match with the configuration</td>
  </tr>
  <tr>
    <td>Other errors occurred during the resource/remote method execution</td>
    <td><i>Same as the returned error type</i></td>
  </tr>
  <tr>
    <td rowspan="3">Finding Service - Listener Level</td>
    <td>404 - no service has registered for listener</td>
    <td rowspan="3">ServiceDispatchingError</td>
  </tr>
  <tr>
    <td>404 - no matching service found for path</td>
  </tr>
  <tr>
    <td>400 - Found non-matrix parameter in path</td>
  </tr>
  <tr>
    <td rowspan="2">Finding Resource - Service Level</td>
    <td>404 - no matching resource found for path</td>
     <td rowspan="4">ResourceDispatchingError</td>
  </tr>
  <tr>
    <td>405 - Method not allowed</td>
  </tr>
  <tr>
    <td rowspan="2">Consumes & Produces - Service Level</td>
    <td>406 - Not Acceptable</td>
  </tr>
  <tr>
    <td>415 - Unsupported Media Type</td>
  </tr>
  <tr>
    <td rowspan="6">Databinding - Service Level</td>
    <td>400 - Error in casting path param</td>
    <td>PathParameterBindingError</td>
  </tr>
  <tr>
    <td>400 - no query param value found</td>
    <td rowspan="2">QueryParameterBindingError</td>
  </tr>
  <tr>
    <td>400 - Error in casting query param </td>
  </tr>
  <tr>
    <td>400 - no header value found</td>
    <td rowspan="2">HeaderBindingError</td>
  </tr>
  <tr>
    <td>400 - header binding failed </td>
  </tr>
  <tr>
    <td>400 - data binding failed</td>
    <td>PayloadBindingError</td>
  </tr>
  <tr>
    <td rowspan="2">Security - Resource Level</td>
    <td>401 - Unauthorized errors</td>
    <td>ListenerAuthnError</td>
  </tr>
  <tr>
    <td>403 - Forbidden errors</td>
    <td>ListenerAuthzError</td>
  </tr>
  <tr>
    <td>Resource execution -  Resource Level</td>
    <td>500 - Returned errors</td>
    <td><i>Same as the returned error type</i></td>
  </tr>
</tbody>
</table>

#### 8.2.3 Trace log
The HTTP trace logs can be used to monitor the HTTP traffic that goes in and out of Ballerina.
The HTTP trace logs are **disabled as default**.
To enable trace logs, the log level has to be set to TRACE using the runtime argument:
`-Cballerina.http.traceLogConsole=true.`

The HTTP access logs and trace logs are **disabled as default**. To enable, the configurations can be set by the 
following `config.toml` file:

The configurations can be set in the `config.toml` file for advanced use cases such as specifying the file path to 
save the trace logs and specifying the hostname and port of a socket service to publish the trace logs.

```toml
[ballerina.http.traceLogAdvancedConfig]
# Enable printing trace logs in console
console = true              # Default is false
# Specify the file path to save the trace logs  
path = "testTraceLog.txt"   # Optional
# Specify the hostname and port of a socket service to publish the trace logs
host = "localhost"          # Optional
port = 8080                 # Optional
```

#### 8.2.4 Access log
Ballerina supports HTTP access logs for HTTP services, providing insights into web traffic and request handling.
The access log feature is **disabled by default** to allow users to opt-in as per their requirements.

To enable access logs, configuration settings are provided under `ballerina.http.accessLogConfig` in the
`Config.toml` file. Users can specify whether logs should be output to the console, a file, or both, 
and can select the format and specific attributes to log.

```toml
[ballerina.http.accessLogConfig]
# Enable printing access logs in console
console = true              # Default is false
# Specify the file path to save the access logs
path = "testAccessLog.txt"  # Optional, omit to disable file logging
# Select the format of the access logs
format = "json"             # Options: "flat", "json"; Default is "flat". Omit to stick to the default.
# Specify which attributes to log. Omit to stick to the default set.
attributes = ["ip", "date_time", "request", "status", "response_body_size", "http_referrer", "http_user_agent"]
# Default attributes: ip, date_time, request, status, response_body_size, http_referrer, http_user_agent
```

##### Configurable Attributes
Users can customize which parts of the access data are logged by specifying attributes in the configuration.
This allows for tailored logging that can focus on particular details relevant to the users' needs.

|       Attribute        |                                                    Description                                                     |
|:----------------------:|:------------------------------------------------------------------------------------------------------------------:|
|           ip           |                                                Client's IP address                                                 |
|       date_time        |                                             HTTP request received time                                             |
|        request         |                                   Full HTTP request line (method, URI, protocol)                                   |
|     request_method     |                                             HTTP method of the request                                             |
|      request_uri       |                                      URI of the request, including parameters                                      |
|         scheme         |                                       Scheme of the request and HTTP version                                       |
|         status         |                                      HTTP status code returned to the client                                       |
|   request_body_size    |                                         Size of the request body in bytes                                          |
|   response_body_size   |                                      Size of the HTTP response body in bytes                                       |
|      request_time      |                                      Total time taken to process the request                                       |
|     http_referrer      |                                 HTTP Referer header, indicating the previous page                                  |
|    http_user_agent     |                                 User-Agent header, identifying the client software                                 |
|  http_x_forwarded_for  |                                      Originating IP address if using a proxy                                       |
| http_(X-Custom-Header) | Header fields. Referring to them with `http` followed by the header name. (`x-request-id` ->; `http_x-request-id`) |

#### 8.2.5 Panic inside resource

Ballerina consider panic as a catastrophic error and non-recoverable. Hence, immediate application termination is 
performed to fail fast after responding to the request. This behaviour will be more useful in cloud environments as 
well.

## 9. Security

### 9.1 Authentication and Authorization

There are two ways to enable authentication and authorization in HTTP.

1. Declarative approach
2. Imperative approach

#### 9.1.1 Declarative Approach

This is also known as the configuration-driven approach, which is used for simple use cases, where users have to 
provide a set of configurations and do not need to be worried more about how authentication and authorization works. 
The user does not have full control over the configuration-driven approach.

The service configurations are used to define the authentication and authorization configurations. Users can 
configure the configurations needed for different authentication schemes and configurations needed for 
authorizations of each authentication scheme. Also, the configurations can be provided at the service level. 
The priority will be given from bottom to top. Then, the auth handler creation and request 
authentication/authorization is handled internally without user intervention. The requests that succeeded both 
authentication and/or authorization phases according to the configurations will be passed to the business logic layer.

##### 9.1.1.1 Listener - Basic Auth - File User Store

```ballerina
@http:ServiceConfig {
    auth: [
        {
            fileUserStoreConfig: {},
            scopes: ["admin"]
        }
    ]
}
service / on new http:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

```ballerina
# Config.toml

[[ballerina.auth.users]]
username="alice"
password="alice@123"
scopes=["developer"]

[[ballerina.auth.users]]
username="ldclakmal"
password="ldclakmal@123"
scopes=["developer", "admin"]

[[ballerina.auth.users]]
username="eve"
password="eve@123"
```

##### 9.1.1.2. Listener - Basic Auth - LDAP User Store

```ballerina
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
service / on new http:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

##### 9.1.1.3 Listener - JWT Auth

```ballerina
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
service / on new http:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

##### 9.1.1.4 Listener - OAuth2

```ballerina
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
service / on new http:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

##### 9.1.1.5 Client - Basic Auth

```ballerina
http:Client c = check new ("https://localhost:9090",
    auth = {
        username: "tom",
        password: "123"
    }
);

public function main() returns error? {
    http:Request req = new;
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.1.6 Client - Bearer Token Auth

```ballerina
http:Client c = check new ("https://localhost:9090",
    auth = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiw" +
               "ibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2Q" +
               "T4fwpMeJf36POk6yJV_adQssw5c"
    }
);

public function main() returns error? {
    http:Request req = new;
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.1.7 Client - Self-Signed JWT

```ballerina
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
    http:Request req = new;
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.1.8 Client - Bearer Token OAuth2

```ballerina
http:Client c = check new ("https://localhost:9090",
    auth = {
        token: "56ede317-4511-44b4-8579-a08f094ee8c5"
    }
);

public function main() returns error? {
    http:Request req = new;
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.1.9 Client - Grant Types OAuth2

```ballerina
http:OAuth2ClientCredentialsGrantConfig config = {
    tokenUrl: "https://localhost:8080/oauth2/token/authorize",
    clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxS",
    clientSecret: "9205371918321623741"
};

http:Client c = check new ("https://localhost:9090", auth = config);

public function main() returns error? {
    http:Request req = new;
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

#### 9.1.2 Imperative Approach

This is also known as the code-driven approach, which is used for advanced use cases, where users need to be 
worried more about how authentication and authorization work and need to have further customizations. The user has 
full control of the code-driven approach. The handler creation and authentication/authorization calls are made by 
the user at the business logic layer.

##### 9.1.2.1 Listener - Basic Auth - File User Store

```ballerina
http:FileUserStoreConfig config = {};
http:ListenerFileUserStoreBasicAuthHandler handler = new (config);

service /foo on new http:Listener(9090) {
    resource function post bar(@http:Header string Authorization) returns string|http:Unauthorized|http:Forbidden {
        auth:UserDetails|http:Unauthorized authn = handler.authenticate(Authorization);
        if authn is http:Unauthorized {
            return authn;
        }
        http:Forbidden? authz = handler.authorize(<auth:UserDetails>authn, "admin");
        if authz is http:Forbidden {
            return authz;
        }
        // business logic
    }
}
```

```ballerina
# Config.toml
[ballerina.observe]
enabled=true
provider="noop"

[[auth.users]]
username="admin"
password="123"
scopes=["write", "update"]
```

##### 9.1.2.2 Listener - Basic Auth - LDAP User Store

```ballerina
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
        if authn is http:Unauthorized {
            return authn;
        }
        http:Forbidden? authz = handler->authorize(<auth:UserDetails>authn, "admin");
        if authz is http:Forbidden {
            return authz;
        }
        // business logic
    }
}
```

##### 9.1.2.3 Listener - JWT Auth

```ballerina
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
        if authn is http:Unauthorized {
            return authn;
        }
        http:Forbidden? authz = handler.authorize(<jwt:Payload>authn, "admin");
        if authz is http:Forbidden {
            return authz;
        }
        // business logic
    }
}
```

##### 9.1.2.4 Listener - OAuth2

```ballerina
http:OAuth2IntrospectionConfig config = {
    url: "https://localhost:8080/oauth2/introspect",
    tokenTypeHint: "access_token"
};
http:ListenerOAuth2Handler handler = new (config);

service /foo on new http:Listener(9090) {
    resource function post bar(@http:Header string authorization) returns string|http:Unauthorized|http:Forbidden {
        oauth2:IntrospectionResponse|http:Unauthorized|http:Forbidden auth = handler->authorize(authorization, "admin");
        if auth is http:Unauthorized || auth is http:Forbidden {
            return auth;
        }
        // business logic
    }
}
```

##### 9.1.2.5 Client - Basic Auth

```ballerina
http:CredentialsConfig config = {
    username: "tom",
    password: "123"
};
http:ClientBasicAuthHandler handler = new (config);

http:Client c = check new ("https://localhost:9090");

public function main() returns error? {
    http:Request req = new;
    req = check handler.enrich(req);
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.2.6 Client - Bearer Token Auth

```ballerina
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
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.2.7. Client - Self-Signed JWT

```ballerina
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
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.2.8. Client - Bearer Token OAuth2

```ballerina
http:BearerTokenConfig config = {
    token: "JhbGciOiJIIiwiaWF0IjUzI1NiIsInR5cCI6IkpXVCJ9WIiOiIxMjM0NTY3ODkwI"
};
http:ClientBearerTokenAuthHandler handler = new (config);

http:Client c = check new ("https://localhost:9090");

public function main() returns error? {
    http:Request req = new;
    req = check handler.enrich(req);
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

##### 9.1.2.9. Client - Grant Types OAuth2

```ballerina
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
    json response = check c->post("/foo/bar", req);
    // evaluate response
}
```

### 9.2 SSL/TLS and Mutual SSL

The HTTPS listener could connect to or interact with an HTTPS client. The `http:ListenerSecureSocket` configuration
of the listener exposes the HTTPS connection related configs.

#### 9.2.1 Listener - SSL/TLS

```ballerina
listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

service / on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

#### 9.2.2 Listener - Mutual SSL

The mutual SSL support which is a certificate-based authentication process in which two parties 
(the client and server) authenticate each other by verifying the digital certificates. It ensures that both 
parties are assured of each other’s identity.

```ballerina
listener http:Listener securedEP = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        },

        mutualSsl: {
            verifyClient: http:REQUIRE,
            cert: "/path/to/public.crt"
        },

        protocol: {
            name: http:TLS,
            versions: ["TLSv1.2", "TLSv1.1"]
        },

        ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA"]

    }
);
service / on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

#### 9.2.3 Client - SSL/TLS

```ballerina
http:Client securedEP = check new("https://localhost:9090",
    secureSocket = {
        cert: "/path/to/public.crt"
    }
);

public function main() returns error? {
    http:Request req = new;
    string response = check securedEP->post("/foo/bar", req);
    io:println(response);
}
```

#### 9.2.4 Client - Mutual SSL

```ballerina
http:Client securedEP = check new("https://localhost:9090",
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        },
        cert: "/path/to/public.crt",
        protocol: {
            name: http:TLS
        },
        ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA"]

    }
);
public function main() returns error? {
    http:Request req = new;
    string response = check securedEP->post("/foo/bar", req);
    io:println(response);
}
```

## 10. Protocol upgrade
### 10.1. HTTP/2
The version 2 of HTTP protocol is supported in both Listener and Client space which could be configured through the 
respective configuration.

```ballerina
// Listener declaration
listener http:Listener http2ServiceEP = new (7090, config = {httpVersion: "2.0"});

// Client declaration
http:Client clientEP = check new ("http://localhost:7090", {httpVersion: "2.0"});
```

There are few API level additions when it comes to the HTTP/2 design such as Push promise and promise response.
#### 10.1.1. Push Promise and Promise Response
Push Promise and Promise response are the only application level new semantics which are introduced by HTTP2.

Other protocol changes such as streams, messages, frames, request prioritization, flow control, header compression, 
etc. are all lower level changes that can be handled by the HTTP listener seamlessly from the user.
