# Specification: Ballerina GraphQL Library

_Owners_: @shafreenAnfar @DimuthuMadushan @ThisaruGuruge @MohamedSabthar \
_Reviewers_: @shafreenAnfar @ThisaruGuruge @DimuthuMadushan @ldclakmal \
_Created_: 2022/01/06 \
_Updated_: 2023/07/12 \
_Edition_: Swan Lake \
_GraphQL Specification_: [October 2021](https://spec.graphql.org/October2021/)  

## Introduction

This is the specification for the GraphQL standard library of the [Ballerina language](https://ballerina.io), which provides GraphQL server functionalities to produce GraphQL APIs and GraphQL client functionalities to communicate with GraphQL APIs.

The GraphQL library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` on GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Components](#2-components)
    * 2.1 [Listener](#21-listener)
        * 2.1.1 [HTTP Listener](#211-http-listener)
        * 2.1.2 [WebSocket Listener](#212-websocket-listener)
        * 2.1.3 [Initializing the Listener Using Port Number](#213-initializing-the-listener-using-port-number)
        * 2.1.4 [Initializing the Listener using an HTTP Listener](#214-initializing-the-listener-using-an-http-listener)
        * 2.1.5 [Listener Configuration](#215-listener-configuration)
    * 2.2 [Service](#22-service)
        * 2.2.1 [Service Type](#221-service-type)
        * 2.2.2 [Service Base Path](#222-service-base-path)
        * 2.2.3 [Service Declaration](#223-service-declaration)
        * 2.2.4 [Service Object Declaration](#224-service-object-declaration)
        * 2.2.5 [Service Configuration](#225-service-configuration)
    * 2.3 [Parser](#23-parser)
    * 2.4 [Engine](#24-engine)
    * 2.5 [Client](#25-client)
        * 2.5.1 [Initializing the Client](#251-initializing-the-client)
        * 2.5.2 [Executing Operations](#252-executing-operations)
        * 2.5.3 [Client Data Binding](#253-client-data-binding)
        * 2.5.4 [Client Configuration](#254-client-configuration)
3. [Schema Generation](#3-schema-generation)
    * 3.1 [Root Types](#31-root-types)
        * 3.1.1 [The `Query` Type](#311-the-query-type)
        * 3.1.2 [The `Mutation` Type](#312-the-mutation-type)
        * 3.1.3 [The `Subscription` Type](#313-the-subscription-type)
    * 3.2 [Wrapping Types](#32-wrapping-types)
        * 3.2.1 [`NON_NULL` Type](#321-non_null-type)
        * 3.2.2 [`LIST` Type](#322-list-type)
    * 3.3 [Resource Methods](#33-resource-methods)
        * 3.3.1 [Resource Accessor](#331-resource-accessor)
        * 3.3.2 [Resource Name](#332-resource-name)
        * 3.3.3 [Hierarchical Resource Path](#333-hierarchical-resource-path)
    * 3.4 [Remote Methods](#34-remote-methods)
        * 3.4.1 [Remote Method Name](#341-remote-method-name)
    * 3.5 [Documentation](#35-documentation)
4. [Types](#4-types)
    * 4.1 [Scalars](#41-scalars)
        * 4.1.1 [Int](#411-int)
        * 4.1.2 [Float](#412-float)
        * 4.1.3 [String](#413-string)
        * 4.1.4 [Boolean](#414-boolean)
        * 4.1.5 [ID](#415-id)
    * 4.2 [Objects](#42-objects)
        * 4.2.1 [Record Type as Object](#421-record-type-as-object)
        * 4.2.2 [Service Type as Object](#422-service-type-as-object)
    * 4.3 [Unions](#43-unions)
    * 4.4 [Enums](#44-enums)
    * 4.5 [Input Types](#45-input-types)
        * 4.5.1 [Input Union Types](#451-input-union-types)
        * 4.5.2 [Input Objects](#452-input-objects)
        * 4.5.3 [Default Values](#453-default-values)
    * 4.6 [Interfaces](#46-interfaces)
        * 4.6.1 [Interfaces Implementing Interfaces](#461-interfaces-implementing-interfaces)
5. [Directives](#5-directives)
   * 5.1 [@skip](#51-skip)
   * 5.2 [@include](#52-include)
   * 5.3 [@deprecated](#53-deprecated)
6. [Errors](#6-errors)
    * 6.1 [Error Detail Record](#61-error-detail-record)
        * 6.1.1 [Message](#611-message)
        * 6.1.2 [Locations](#612-locations)
        * 6.1.3 [Path](#613-path)
    * 6.2 [Service Error Handling](#62-service-error-handling)
        * 6.2.1 [Returning Errors](#621-returning-errors)
        * 6.2.2 [Returning Errors and Nil Values](#622-returning-errors-and-nil-values)
        * 6.2.3 [The `graphql:__addError` Function](#623-the-graphql__adderror-function)
    * 6.3 [Client Error Handling](#63-client-error-handling)
        * 6.3.1 [Request Error](#631-request-error)
            * 6.3.1.1 [HTTP Error](#6311-http-error)
            * 6.3.1.2 [Invalid Document Error](#6312-invalid-document-error)
        * 6.3.2 [Payload Binding Error](#632-payload-binding-error)
7. [Annotations](#7-annotations)
    * 7.1 [Service Configuration](#71-service-configuration)
        * 7.1.1 [Max Query Depth](#711-max-query-depth)
        * 7.1.2 [Auth Configurations](#712-auth-configurations)
        * 7.1.3 [Context Initializer Function](#713-context-initializer-function)
        * 7.1.4 [CORS Configurations](#714-cors-configurations)
        * 7.1.5 [GraphiQL Configurations](#715-graphiql-configurations)
            * 7.1.5.1 [The `enabled` Field](#7151-the-enabled-field)
            * 7.1.5.2 [The `path` Field](#7152-the-path-field)
            * 7.1.5.3 [The `printUrl` Field](#7153-the-printurl-field)
        * 7.1.6 [Service Interceptors](#716-service-interceptors)
        * 7.1.7 [Introspection Configurations](#717-introspection-configurations)
        * 7.1.8 [Constraint Configurations](#718-constraint-configurations)
    * 7.2 [Resource Configuration](#72-resource-configuration)
        * 7.2.1 [Field Interceptors](#721-field-interceptors)
    * 7.3 [Interceptor Configuration](#73-interceptor-configuration)
        * 7.3.1 [Scope Configuration](#731-scope-configuration)
8. [Security](#8-security)
    * 8.1 [Service Authentication and Authorization](#81-service-authentication-and-authorization)
        * 8.1.1 [Declarative Approach](#811-declarative-approach)
            * 8.1.1.1 [Basic Authentication - File User Store](#8111-basic-authentication---file-user-store)
            * 8.1.1.2 [Basic Authentication - LDAP User Store](#8112-basic-authentication---ldap-user-store)
            * 8.1.1.3 [JWT Authentication](#8113-jwt-authentication)
            * 8.1.1.4 [OAuth2](#8114-oauth2)
        * 8.1.2 [Imperative Approach](#812-imperative-approach)
            * 8.1.2.1 [Basic Authentication - File User Store](#8121-basic-authentication---file-user-store)
            * 8.1.2.2 [Basic Authentication - LDAP User Store](#8122-basic-authentication---ldap-user-store)
            * 8.1.2.3 [JWT Authentication](#8123-jwt-authentication)
            * 8.1.2.4 [OAuth2](#8124-oauth2)
    * 8.2 [Client Authentication and Authorization](#82-client-authentication-and-authorization)
        * 8.2.1. [Basic Authentication](#821-basic-authentication)
        * 8.2.2. [Bearer Token Authentication](#822-bearer-token-authentication)
        * 8.2.3. [Self-Signed JWT Authentication](#823-self-signed-jwt-authentication)
        * 8.2.4. [OAuth2](#824-oauth2)
            * 8.2.4.1 [Client Credentials Grant Type](#8241-client-credentials-grant-type)
            * 8.2.4.2 [Password Grant Type](#8242-password-grant-type)
            * 8.2.4.3 [Refresh Token Grant Type](#8243-refresh-token-grant-type)
            * 8.2.4.4 [JWT Bearer Grant Type](#8244-jwt-bearer-grant-type)
    * 8.3 [SSL/TLS and Mutual SSL](#83-ssltls-and-mutual-ssl)
        * 8.3.1 [Listener](#831-listener)
            * 8.3.1.1 [SSL/TLS](#8311-ssltls)
            * 8.3.1.2 [Mutual SSL](#8312-mutual-ssl)
        * 8.3.2 [Client](#832-client)
            * 8.3.2.1 [SSL/TLS](#8321-ssltls)
            * 8.3.2.2 [Mutual SSL](#8322-mutual-ssl)
9. [Tools](#9-tools)
    * 9.1 [GraphiQL Client](#91-graphiql-client)
10. [Advanced Features](#10-advanced-features)
    * 10.1 [Context Object](#101-context-object)
        * 10.1.1 [Context Methods](#1011-context-methods)
            * 10.1.1.1 [Set Attribute in Context](#10111-set-attribute-in-context)
            * 10.1.1.2 [Get Context Attribute](#10112-get-attribute-from-context)
            * 10.1.1.3 [Remove Attribute from Context](#10113-remove-attribute-from-context)
        * 10.1.2 [Accessing the Context](#1012-accessing-the-context-object)
        * 10.1.3 [Resolving Field Value](#1013-resolving-field-value)
    * 10.2 [Field Object](#102-field-object)
        * 10.2.1 [Field Object Methods](#1021-field-object-methods)
            * 10.2.1.1 [Get Field Name](#10211-get-field-name)
            * 10.2.1.2 [Get Field Alias](#10212-get-field-alias)
            * 10.2.1.3 [Get Field Path](#10213-get-field-path)
            * 10.2.1.4 [Get Subfield Names](#10214-get-subfield-names)
            * 10.2.1.5 [Get Field Type](#10215-get-field-type)
            * 10.2.1.6 [Get Subfields](#10216-get-subfields)
            * 10.2.1.7 [Get Field Location](#10217-get-field-location)
        * 10.2.2 [Accessing the Field Object](#1022-accessing-the-field-object)
    * 10.3 [Interceptors](#103-interceptors)
        * 10.3.1 [Interceptor Service Object](#1031-interceptor-service-object)
        * 10.3.2 [Writing an Interceptor](#1032-writing-an-interceptor)
        * 10.3.3 [Execution](#1033-execution)
            * 10.3.3.1 [Service Interceptors](#10331-service-interceptors)
            * 10.3.3.2 [Field Interceptors](#10332-field-interceptors)
    * 10.4 [File Upload](#104-file-upload)
        * 10.4.1 [File Upload Protocol](#1041-file-upload-protocol)
        * 10.4.2 [`graphql:Upload` Type](#1042-the-graphqlupload-type)
            * 10.4.2.1 [`fileName` Field](#10421-the-filename-field)
            * 10.4.2.2 [`mimeType` Field](#10422-the-mimetype-field)
            * 10.4.2.3 [`encoding` Field](#10423-the-encoding-field)
            * 10.4.2.4 [`byteStream` Field](#10424-the-bytestream-field)
        * 10.4.3 [File Upload Service](#1043-file-upload-service)
            * 10.4.3.1 [File Upload Resolver](#10431-file-upload-resolver)
    * 10.5 [Federation](#105-federation)
        * 10.5.1 [Federated Subgraph](#1051-federated-subgraph)
            * 10.5.1.1 [The `@subgraph:Subgraph` Annotation](#10511-the-subgraphsubgraph-annotation)
            * 10.5.1.2 [The `@subgraph:Entity` Annotation](#10512-the-subgraphentity-annotation)
            * 10.5.1.3 [The `subgraph:ReferenceResolver` Function Type](#10513-the-subgraphreferenceresolver-function-type)

## 1. Overview

The Ballerina language provides first-class support for writing network-oriented programs. The GraphQL standard library uses these language constructs and creates the programming model to produce/consume GraphQL APIs.

The GraphQL standard library is designed to work with [GraphQL specification](https://spec.graphql.org). There are two main approaches when writing GraphQL APIs. The schema-first approach and the code-first approach. The Ballerina GraphQL standard library uses the code-first first approach to write GraphQL APIs. This means no GraphQL schema is required to create a GraphQL service.

In addition to functional requirements, this library deals with none functional requirements such as security. Each requirement is discussed in detail in the coming sections.

## 2. Components

This section describes the components of the Ballerina GraphQL package. To use the Ballerina GraphQL package, a user must import the Ballerina GraphQL package first.

###### Example: Importing the GraphQL Package

```ballerina
import ballerina/graphql;
```

### 2.1 Listener

#### 2.1.1 HTTP Listener
Since the GraphQL spec does not mandate an underlying client-server protocol, a GraphQL implementation can use any protocol underneath. The Ballerina GraphQL package, like most of the other implementations, uses HTTP as the protocol. The Ballerina GraphQL listener is using an HTTP listener to listen to incoming GraphQL requests through HTTP.

#### 2.1.2 WebSocket Listener
If the schema contains the `Subscription` type (as described in [Subscription Type](#313-the-subscription-type)), The GraphQL listener will establish a new WebSocket listener to listen to incoming subscription requests.

In Ballerina, WebSocket is used as the communication protocol for GraphQL subscriptions as it is capable of dispatching data continuously while maintaining a persistent connection. Ballerina GraphQL utilizes the `graphql-transport-ws` (graphql-ws) WebSocket sub-protocol in subscriptions. If a WebSocket connection is established with the `graphql-transport-ws` sub-protocol, all subscription responses will be formatted according to the standard message structure outlined in the [specification](https://github.com/enisdenjo/graphql-ws/blob/master/PROTOCOL.md).

A standard response includes JSON fields for `type`, `id`, and `payload`. The `type` field specifies the message type of the response. The `id` field is used to uniquely identify the client. The `payload` field includes the GraphQL response returned from the GraphQL engine. If a subscription request is sent without the `graphql-transport-ws` sub-protocol then the WebSocket handshake fails with an error.

>**Note:** The Ballerina GraphQL subscription includes a default implementation for sending `ping` messages over a graphql-ws connection, and periodically checking for `pong` messages in response. By default, these messages are sent and checked every 15 seconds. If a `pong` message is not received within this time frame, the service will close the WebSocket connection.

A Ballerina GraphQL listener can be declared as described below, honoring the Ballerina generic [listener declaration](https://ballerina.io/spec/lang/2021R1/#section_9.2.1).

#### 2.1.3 Initializing the Listener Using Port Number
If a GraphQL listener requires to be listening to a port number, that port number must be provided as the first parameter of the listener constructor.

###### Example: Initializing the Listener Using Port Number
```ballerina
listener graphql:Listener graphqlListener = new (9090);
```

#### 2.1.4 Initializing the Listener using an HTTP Listener
If a GraphQL listener requires to listen to the same port as an existing [`http:Listener`](https://github.com/ballerina-platform/module-ballerina-http/blob/master/docs/spec/spec.md/#21-listener) object, that `http:Listener` object must be provided as the first parameter of the listener constructor.

###### Example: Initializing the Listener using an HTTP Listener
```ballerina
listener http:Listener httpListener = new (9090);
listener graphql:Listener graphqlListener = new (httpListener);
```

>**Note:**  The client does not need to explicitly create a `websocket:Listener` for subscriptions. If there is a subscription resolver in a service, the `graphql:Listener` will initiate a `websocket:Listener` over the same port used in the `http:Listener`.

#### 2.1.5 Listener Configuration

Since the GraphQL listener uses the `http:Listener` and the `websocket:Listener` as the underlying listeners, some additional configurations can be passed to these listeners, when creating a `graphql:Listener`. These configurations are defined in the `graphql:ListenerConfiguration` record.

###### Example: Listener Configuration

```ballerina
listener graphql:Listener graphqlListener = = new (9090, timeout = 10);
```

>**Note:** If the GraphQL service includes subscription operations, the `httpVersion` of the `graphql:ListenerConfiguration` must be either `"1.0"` or `"1.1"`. Otherwise, this will cause a runtime error when attaching the service to the listener.

### 2.2 Service

The `service` represents the GraphQL schema in the Ballerina GraphQL package. When a service is attached to a GraphQL listener, it is considered a GraphQL service. When a service is identified as a GraphQL service, it will be used to [Generate the Schema](#3-schema-generation). Attaching the same service to multiple listeners is not allowed, and will cause a compilation error.

###### Example: Service

```ballerina
service /graphql on new graphql:Listener(9090) {

}
```

In the above [example](#example-service), a GraphQL service is attached to a GraphQL listener. This is syntactic sugar to declare a service and attach it to a GraphQL listener.

#### 2.2.1 Service Type

The following distinct service type provided by the Ballerina GraphQL package can be used by the users. It can be referred to as `graphql:Service`. Since the language support is yet to be implemented for the service typing, service validation is done using the Ballerina GraphQL compiler plugin.

```ballerina
public type Service distinct service object {

};
```

#### 2.2.2 Service Base Path

The base path is used to discover the GraphQL service to dispatch the requests. identifiers and string literals can be used as the base path, and it should be started with `/`. The base path is optional and if not provided, will be defaulted to `/`. If the base path contains any special characters, they should be escaped or defined as string literals.

###### Example: Base Path

```ballerina
service hello\-graphql on new graphql:Listener(9090) {

}
```

#### 2.2.3 Service Declaration

The [service declaration](https://ballerina.io/spec/lang/2021R1/#section_10.2.2) is syntactic sugar for creating a service. This is the mostly-used approach for creating a service.

###### Example: Service Declaration

```ballerina
service graphql:Service /graphql on new graphql:Listener(9090) {

}
```

#### 2.2.4 Service Object Declaration

A service can be instantiated using the service object. This approach provides full control of the service life cycle to the user. The listener life cycle methods can be used to handle this.

###### Example: Service Object Declaration

```ballerina
graphql:Service graphqlService = service object {
    resource function get greeting() returns string {
        return "Hello, world!";
    }
}

public function main() returns error? {
    graphql:Listener graphqlListener = check new (9090);
    check graphqlListener.attach(graphqlService, "graphql");
    check graphqlListener.'start();
    runtime:registerListener(graphqlListener);
}
```

>**Note:** The service object declaration is only supported when the service object is defined in global scope. If the service object is defined anywhere else, the schema generation will fail. This is due to a known current limitation in the Ballerina language.

#### 2.2.5 Service Configuration

The `graphql:ServiceConfiguration` annotation can be used to provide additional configurations to the GraphQL service. These configurations are described in the [Service Configuration](#71-service-configuration) section.

### 2.3 Parser
The Ballerina GraphQL parser is responsible for parsing the incoming GraphQL documents. This will parse each document and then report any errors. If the document is valid, it will return a syntax tree.

>**Note:** The Ballerina GraphQL parser is implemented as a separate module and is not exposed outside the Ballerina GraphQL package.

### 2.4 Engine

The GraphQL engine acts as the main processing unit in the Ballerina GraphQL package. It connects all the other components in the Ballerina GraphQL service together.

When a request is received by the GraphQL Listener, it dispatches the request to the GraphQL engine, where it extracts the document from the request, then passes it to the parser. Then the parser will parse the document and return an error (if there is any) or the syntax tree to the engine. Then the engine will validate the document against the generated schema, and then if the document is valid, the engine will execute the document.

### 2.5 Client

The GraphQL client can be used to connect to a GraphQL service and retrieve data. This client currently supports the `Query` and `Mutation` operations. The Ballerina GraphQL client uses HTTP as the underlying protocol to communicate with the GraphQL service.

#### 2.5.1 Initializing the Client

The `graphql:Client` init method requires a valid URL and optional configuration to initialize the client.

```ballerina
graphql:Client graphqlClient = check new (“http://localhost:9090/graphql”, {timeout: 10});
```
#### 2.5.2 Executing Operations

The graphql client provides `execute` API to execute graphql query and mutation operations. The `execute` method of `graphql:Client` takes a GraphQL document as the required argument and sends a request to the specified backend URL seeking a response. Further, the execute method could take the following optional arguments.

- `variables` - A map containing the GraphQL variables. All the variables that may be required by the graphql document can be set via this `variables` argument.
- `operationName` - The GraphQL operation name. If the document has more than one operation, then each operation must have a name. A single GraphQL request can only execute one operation; the operation name must be set if the document has more than one operation. Otherwise, the GraphQL server responds with an error.
- `headers` - A map containing headers that may be required by the graphql server to execute each operation.

The method definition of the `execute` API is given below.

```ballerina
remote isolated function execute(string document, map<anydata>? variables = (), string? operationName = (),
    map<string|string[]>? headers = (), typedesc<GenericResponseWithErrors|record {}|json> targetType = <>)
    returns targetType|ClientError ;
```

#### 2.5.3 Client Data Binding

When sending a GraphQL request to a GraphQL server using the Ballerina GraphQL client, the response can be data-bound. That means the user can define the expected shape of the GraphQL response by defining a type. The data type defined by the user should be a subtype of `graphql:GenericResponseWithErrors|record{}|json`. Otherwise, the data binding fails with an error.

>**Note:** It is recommended to use the `graphql:GenericResponseWithErrors` or any subtype of it when retrieving a response using the `graphql:Client` using the `execute` method.

When defining the expected type, nullable fields should be defined as a union of the field type and nil (`()`). A [Payload Binding Error](#632-payload-binding-error) can occur otherwise.

###### Example: Handle Response with Data Binding

This example shows how to data-bind the response to a pre-defined type. Note how the `age` field is defined as a nullable field.

```ballerina
type ProfileResponseWithErrors record {|
    *graphql:GenericResponseWithErrors;
    record {|Profile profile;|} data;
|};

type Profile record {|
    string name;
    int? age;
|};

public function main() returns error? {
    graphql:Client graphqlClient = check new ("localhost:9090/graphql");
    string document = "{ profile(id: 100) {name age} }";
    ProfileResponseWithErrors response = check graphqlClient->execute(document);
    string name = response.data.profile.name;
    io:println(name);
}
```

The `execute` method can return errors when retrieving a response from a GraphQL API. For information about handling errors, check the section [Client Error Handling](#63-client-error-handling)

#### 2.5.4 Client Configuration

The `graphql:Client` uses `http:Client` as its underlying implementation; this `http:Client` can be configured by providing the `graphql:ClientConfiguration` as an optional parameter via the `graphql:Client` init method.

## 3. Schema Generation

The GraphQL schema is generated by analyzing the Ballerina service attached to the GraphQL listener. The Ballerina GraphQL package will walk through the service and the types related to the service to generate the complete GraphQL schema.

When an incompatible type is used inside a GraphQL service, a compilation error will be thrown.

### 3.1 Root Types
Root types are a special set of types in a GraphQL schema. These types are associated with an operation, which can be done on the GraphQL scheme. There are three root types.

- `Query`
- `Mutation`
- `Subscription`

#### 3.1.1 The `Query` Type

The `Query` type is the main root type in a GraphQL schema. It is used to query the schema. The `Query` must be defined for a GraphQL schema to be valid. In Ballerina, the service itself is the schema, and each `resource` method with the `get` accessor inside a GraphQL service is mapped to a field in the root `Query` type.

###### Example: Adding a Field to the `Query` Type

```ballerina
service on new graphql:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

>**Note:** Since the `Query` type must be defined in a GraphQL schema, a Ballerina GraphQL service must have at least one resource method with the `get` accessor. Otherwise, the service will cause a compilation error.

#### 3.1.2 The `Mutation` Type

The `Mutation` type in a GraphQL schema is used to mutate the data. In Ballerina, each `remote` method inside the GraphQL service is mapped to a field in the root `Mutation` type. If no `remote` method is defined in the service, the generated schema will not have a `Mutation` type.

###### Example: Adding a Field to the `Mutation` Type

```ballerina
service on new graphql:Listener(9090) {
    remote function setName(string name) returns string {
        //...
    }
}
```

As per the [GraphQL specification](https://spec.graphql.org/June2018/#sec-Mutation), the `Mutation` type is expected to perform side effects on the underlying data system. Therefore, the mutation operations should be executed serially. This is ensured in the Ballerina GraphQL package. Each remote method invocation in a request is done serially, unlike the resource method invocations, which are executed in parallel.

#### 3.1.3 The `Subscription` Type

The `Subscription` type in a GraphQL schema is used to continuously fetch data from a GraphQL service. In Ballerina, each `resource` method with the `subscribe` accessor inside a GraphQL service is mapped to a field in the root `Subscription` type. If the `resource` method has the `subscribe` accessor, it must return a `stream`. Otherwise, the compilation error will occur.

###### Example: Adding a Field to the `Subscription` Type

```ballerina
service on new graphql:Listener(9090) {
    resource function subscribe greetings() returns stream<stream> {
        return ["Hello", "Hi", "Hello World!"].toStream();
    }
}
```

### 3.2 Wrapping Types

Wrapping types are used to wrap the named types in GraphQL. A wrapping type has an underlying named type. There are two wrapping types defined in the GraphQL schema.

#### 3.2.1 `NON_NULL` Type

`NON_NULL` type is a wrapper type to denote that the resulting value will never be `null`. Ballerina types do not implicitly allow `nil`. Therefore, each type is inherently a `NON_NULL` type until specified explicitly otherwise. If a type is meant to be a nullable value, it should be unionized with `nil`.

>**Note:** `nil` (represented by `()`) is the Ballerina's version of `null`.

In the following example, the type of the `name` field is `String!`. This means the `String` type is wrapped by the `NON_NULL` type.

###### Example: NON_NULL Type
```ballerina
service on new graphql:Listener(9090) {
    resource function get name returns string {
        return "Walter White";
    }
}
```

To make it a nullable type, it should be unionized with `?`. The following example shows the field `name` of the type `String`. This means the `name` field can have a `null` value.

###### Example: Nullable Type
```ballerina
service on new graphql:Listener(9090) {
    resource function get name returns string? {
        return "Walter White";
    }
}
```

>**Note:** `?` is syntactic sugar for `|()`.

#### 3.2.2 `LIST` Type

The list type represents a list of values of another type. Therefore, `LIST` is considered a wrapping type. In Ballerina, a `LIST` type is defined using an array. The following represents a field called `names` of the type of `LIST` of `String!` type.

###### Example: LIST Type
```ballerina
service on new graphql:Listener(9090) {
    resource function get names() returns string[] {
        return ["Walter White", "Jesse Pinkman"];
    }
}
```

### 3.3 Resource Methods

Resource methods are a special kind of method in Ballerina. In the Ballerina GraphQL package, `resource` methods are used to define GraphQL object fields. The `resource` methods in a GraphQL service are validated at the compile-time.

#### 3.3.1 Resource Accessor

The only allowed accessors in Ballerina GraphQL resource are, `get` and `subscribe`. Any other accessor usage will result in a compilation error.

###### Example: Resource Accessor

```ballerina
resource function get greeting() returns string {
    // ...
}
```

###### Counter Example: Resource Accessor

```ballerina
resource function post greeting() returns string {
    // ...
}
```

#### 3.3.2 Resource Name

As the `resource` methods are mapped to a field of a GraphQL `Object` type, the resource name represents the name of the corresponding field.

###### Example: Resource Name

```ballerina
resource function get greeting() returns string {
    // ...
}
```

In the above example, the resource represents a field named `greeting` of type `String!`. Check [Types Section](#4-types) for more information on types and fields.

#### 3.3.3 Hierarchical Resource Path

GraphQL represents the data as a hierarchical structure. Ballerina resources provide different ways to define this structure. Hierarchical resource paths are one approach, which is also the simplest way.

The path of a resource can be defined hierarchically so that the schema generation can generate the types using the hierarchical path. When a service has resources with hierarchical resource paths, the first path segment and each intermediate path segment of a resource represent an `Object` type field. The GraphQL type represented by the return type of the `resource` method is assigned to the field represented by the leaf-level (final) path segment. Each intermediate type has the same name as the path segment. Therefore, the field name and the type name are the same for the intermediate path segments.

###### Example: Hierarchical Resource Path

```ballerina
service graphql:Service on new graphql:Listener(9090) {
    resource function get profile/address/number() returns int {
        return 308;
    }

    resource function get profile/address/street() returns string {
        return "Negra Arroyo Lane";
    }

    resource function get profile/address/city() returns string {
        return "Albuquerque";
    }

    resource function get profile/name() returns string {
        return "Walter White";
    }

    resource function get profile/age() returns int {
        return 52;
    }
}
```

In the above example shows how to use hierarchical resource paths to create a hierarchical data model. When the schema is generated using this service, the root `Query` operation has a single field, `profile`, as it is the only path segment at the top level. The type of this field is also `profile`, which is an `Object` type. This object type has three fields: `address`, `name`, and `age`. The type of the `address` field is also `Object` as it is an intermediate path segment (i.e. has child path segments). The name of this object type is `address`. It has three fields: the `number` (type `Int!`), the `street` (type `String!`), and the `city` (type `String!`). The `name` field is of type `String!`, and the `age` field is of type `Int!`. Check [Types Section](#4-types) for more information on types and fields.

### 3.4 Remote Methods

The `remote` methods are used to define the fields of the `Mutation` type in a GraphQL schema. Remote methods are validated at the compile-time.

>**Note:** The `resource` and `remote` methods are called __*resolvers*__ in GraphQL terminology. Therefore, in this spec, sometimes the term __*resolver*__ is used to refer `resource` and `remote` methods.

#### 3.4.1 Remote Method Name

The name of the `remote` method is the name of the corresponding GraphQL field in the `Mutation` type.

### 3.5 Documentation

A GraphQL schema can have documentation for the types, fields, enums, schema, etc.

In Ballerina, the Ballerina doc comments can be used to add documentation for the generated schema. Each comment belonging to a field, argument, or enum will be applied to the particular GraphQL schema member.

###### Example: Documentation

```ballerina
# Service to query people database.
service on new graphql:Listener(9090) {

    # Returns a profile with the given ID.
    #
    # + id - The ID of the profile
    # + return - The profile with the given ID
    resource function get profile(int id) returns Profile {
        // ...
    }
}

# Represents a profile.
#
# + id - The ID of the profile
# + name - The name of the profile
# + age - The age of the profile
public type Profile record {|
    int id;
    string name;
    int age;
|};
```

This will generate the documentation for all the fields of the `Query` type including the field descriptions of the `Profile` type.

>**Note:** When a field or an argument name contains Unicode characters or any other escape characters, they are unescaped when generating the schema.

###### Example: Escaping Characters
```ballerina
service on new graphql:Listener(9090) {
    resource function get 'type(string 'version) returns string {
        return "";
    }

    resource function get name(string \u{0076}ersion) returns string {
        return "";
    }
}
```

The above code will generate the following schema:

```graphql
type Query {
    type(version: String!): String!
    name(version: String!): String!
}
```

## 4. Types

GraphQL type system is represented using a hierarchical structure. Type is the fundamental unit of any GraphQL schema.

### 4.1 Scalars

Scalar types represent primitive leaf values in the GraphQL type system. The following built-in types are supported in the Ballerina GraphQL package. Scalar values are represented by the primitive types in Ballerina.

#### 4.1.1 Int
The `Int` type is represented using the `int` type in Ballerina.

#### 4.1.2 Float
The `Float` type is represented using the `float` type in Ballerina.

>**Note:** When used as an input value type, both integer and float values are accepted as valid inputs.

#### 4.1.3 String
The `String` type is represented using the `string` type in Ballerina. It can represent Unicode values.

#### 4.1.4 Boolean
The `Boolean` type is represented using the `boolean` type in Ballerina.

#### 4.1.5 ID

The `ID` scalar type represents a unique identifier, often used to re-fetch an object or as the key for a cache. The `ID` type is serialized in the same way as a `String`; however, it is not intended to be human-readable.

In Ballerina, the `ID` type is represented using the [`@graphql:ID` annotation](#74-id-annotation). The following Ballerina types are supported as `ID` types.

* `int`
* `string`
* `float`
* `decimal`
* `uuid:Uuid` (From the `ballerina/uuid` module)

When the `@graphql:ID` annotation is used, the generated schema will show the field type as `ID`, regardless of the actual type of the field.

>**Note:** If the `@graphql:ID` annotation is used for a field, the values of those fields will always be serialized as strings.

###### Example: Scalar type ID
```ballerina
service on new graphql:Listener(9090) {

    resource function get profileById(@graphql:ID int id) returns Profile {
        // ...
    }

    resource function get studentByStringId(@graphql:ID string id) returns Student {
        // ...
    }

    resource function get studentByUuidId(@graphql:ID uuid:Uuid id) returns Student {
        // ...
    }
}

public type Profile record {|
    @graphql:ID int id;
    string name;
    int age;
|};

public distinct service class Student {
    final string id;
    final string name;

    function init(@graphql:ID string id, string name) {
        self.id = id;
        self.name = name;
    }

    resource function get id() returns @graphql:ID string {
        return self.id;
    }

    resource function get name() returns string {
        return self.name;
    }
}
```

Apart from the above types, the `decimal` type can also be used inside a GraphQL service, which will create the `Decimal` scalar type in the corresponding GraphQL schema.

### 4.2 Objects

Objects represent the intermediate levels of the type hierarchy. Objects can have a list of named fields, each of which has a specific type.

In Ballerina, a GraphQL object type can be represented using either a service type or a record type.

#### 4.2.1 Record Type as Object

A Ballerina record type can be used as an Object type in GraphQL. Each record field is mapped to a field in the GraphQL object and the type of the record field will be mapped to the type of the corresponding GraphQL field.

###### Example: Record Type as Object
```ballerina
service on new graphql:Listener(9090) {
    resource function get profile() returns Profile {
        return {name: "Walter White", age: 52};
    }
}

type Profile record {|
    string name;
    int age;
|};
```

>**Note:** Even though anonymous record types are supported in Ballerina, they cannot be used as types in a GraphQL schema. This is because a type in a GraphQL schema must have a name. Therefore, if an anonymous record is used in a GraphQL service, it will result in a compilation error.

>**Note:** When a record field is defined as an optional field, the Ballerina GraphQL engine identifies it as a nullable field. Even though it is supported, it is recommended to use Ballerina nilable types instead of optional fields to define nullable fields in GraphQL.

>**Note:** Alias types of record types are not allowed to be used as object types in a GraphQL schema. If there is a need to utilize fields from an existing type repeatedly, ballerina type inclusion can be used.

>**Hint:** Open records are supported in GraphQL services, but they do not make sense in the context of GraphQL since a GraphQL type cannot have dynamic fields. Therefore, it is recommended to use closed records in GraphQL services unless it is absolutely needed.

#### 4.2.2 Service Type as Object

A Ballerina service type can be used as an `Object` type in GraphQL. Similar to the `Query` type, each resource method inside a service type represents a field of the object.

Since GraphQL only allows mutations at the top level and the `remote` methods are used to represent the `Mutation` type, any service type used to represent a GraphQL `Object` cannot have `remote` methods inside them.

>**Note:** As per the GraphQL spec, only the root type can have `Mutation`s. Therefore, defining `remote` methods inside subsequent object types does not make any sense.

The `resource` methods in these service types can have input parameters. These input parameters are mapped to arguments in the corresponding field.

>**Note:** The service types representing an `Object` can be either `distinct` or non-distinct type. But if a service type is used as a member of a `Union` type, they must be `distinct` service classes.

###### Example: Service Type as Object

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile() returns Profile {
        return new ("Walter White", 52);
    }
}

service class Profile {
    private final string name;
    private final int age;

    function init(string name, int age) {
        self.name = name;
        self.age = age;
    }

    resource function get name() returns string {
        return self.name;
    }

    resource function get age() returns int {
        return self.age;
    }
}
```
>**Note:** Although both the record and service type can be used to represent the `Object` type, using record type as `Object` has limitations. For example, a field represented as a record field can not have an input argument, as opposed to a field represented using a `resource` method in a service class.

### 4.3 Unions

GraphQL `Union` type represents an object that could be one of a list of possible GraphQL `Object` types but provides no guarantee for common fields in the member types. Ballerina has first-class support for union types. The Ballerina GraphQL package uses this feature to define `Union` types in a schema.

In Ballerina, only `distinct` `service` classes are supported as union-type members. The reason behind this is the difference between GraphQL and the Ballerina type systems. The Ballerina is a structurally-typed language whereas GraphQL is a nominally-typed language. The `distinct` types of Ballerina have similar behavior to nominal types. If one or more member type in a union type is not `distinct` `service` class, a compilation error will occur.

###### Example: Union Types
In the following example, two `distinct` service types are defined first, `Teacher` and `Student`. Then a `Union` type is defined using Ballerina syntax for defining union types. The resource method in the GraphQL service is returning the union type.

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile() returns Profile {
        return new Teacher("Walter White", "Chemistry");
    }
}

distinct service class Teacher {
    private final string name;
    private final string subject;

    function init(string name, string subject) {
        self.name = name;
        self.subject = subject;
    }

    resource function get name() returns string {
        return self.name;
    }

    resource function get subject() returns string {
        return self.subject;
    }
}

distinct service class Student {
    private final string name;
    private final float gpa;

    function init(string name, int gpa) {
        self.name = name;
        self.gpa = gpa;
    }

    resource function get name() returns string {
        return self.name;
    }

    resource function get gpa() returns float {
        return self.gpa;
    }
}

type Profile Teacher|Student; // Defining the union type
```

### 4.4 Enums

In GraphQL, the `Enum` type represents leaf values in the GraphQL schema, similar to the `Scalar` types. But the `Enum` types describe the set of possible values. In Ballerina, the `enum` type is used to define the `Enum` type in GraphQL.

###### Example: Enums

```ballerina
service on new graphql:Listener(9090) {
    resource function get direction() returns Direction {
        return NORTH;
    }
}

enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST
}
```

### 4.5 Input Types

In GraphQL, a field can have zero or more input arguments. These arguments can be either a [`Scalar` type](#41-scalars), an [`Enum` type](#44-enums), or an [`INPUT_OBJECT` type](#452-input-objects).

#### 4.5.1 Input Union Types

An input type can be a Ballerina union type, if and only if the union consists of one of the supported types and the other member type is `nil`. A union with nil means the input type is nullable. Any other union type will be resulting in a compilation error.

###### Example: Input Union Types

```ballerina
service on new graphql:Listener(9090) {
    resource function get greet(string? name) returns string {
        if name is string {
            return string `Hello, ${name}`;
        }
        return "Hello, world!";
    }
}
```

###### Counter Example: Invalid Input Union Types

```ballerina
service on new graphql:Listener(9090) {
    resource function get greeting(string|error name) returns string { // Results in a compilation error
        return "Hello, World!"
    }
}
```

#### 4.5.2 Input Objects

Although `Scalar` and `enum` types can be used as input and output types without a limitation, an object type can not be used as an input type and an output type at the same time. Therefore, separate kinds of objects are used to define input objects.

In Ballerina, a `record` type can be used as an input object. When a `record` type is used as the type of the input argument of a `resource` or `remote` method in a GraphQL service (or in a `resource` method in a `service` type returned from the GraphQL service), it is mapped to an `INPUT_OBJECT` type in GraphQL.

>**Note:** Since GraphQL schema can not use the same type as an input and an output type when a record type is used as an input and an output, a compilation error will be thrown.

>**Note:** Alias types of record types are not allowed to be used as input object types in a GraphQL schema. If there is a need to utilize fields from an existing type repeatedly, ballerina type inclusion can be used.

###### Example: Input Objects

```ballerina
service on new graphql:Listener(9090) {
    resource function get author(Book book) returns string {
        return book.author;
    }
}

type Book record {|
    string title;
    string author;
|};
```

#### 4.5.3 Default Values

The input arguments of a GraphQL field can have default values. In Ballerina, this is allowed by providing default values to input parameters of a `resource` or `remote` method that represents a GraphQL field. When a `resource` or `remote` method input parameter has a default value, it will be added to the generated GraphQL schema. Then, the input parameter can be omitted in the GraphQL document, even if the input type is `NON_NULL`.

>**Note:** Currently, the generated schema does not include the default value of an input parameter due to a Ballerina language limitation. It shows an empty string instead of the default value. This only affects when accessing the generated schema via introspection or file generation. It does not affect the functionality of the default values.

###### Example: Default Values

```ballerina
resource function get greeting(string name = "Stranger") returns string {
    return "Hello, " + name;
}
```

### 4.6 Interfaces

In GraphQL, an interface can be used to define a set of common fields for objects. Then the `Object` types can implement the interface with the common fields and optionally, additional fields.

In Ballerina, `distinct` `service` objects can be used to define GraphQL interfaces. The other `distinct` `service` classes can be used to implement the interface. All the service classes that are implementing the interface must provide the implementation for all resource methods declared in the interface, and they can define additional resource methods.

Non-distinct `service` objects and `service` classes can not be used to define or implement GraphQL interfaces.

###### Example: Interfaces
```ballerina
public type Profile distinct service object {
    isolated resource function get name() returns string;
};

# Represents a Student as a class.
public isolated distinct service class Student {
    *Profile;
    final string name;
    final int id;

    isolated function init(string name, int id) {
        self.name = name;
        self.id = id;
    }

    isolated resource function get name() returns string {
        return self.name;
    }

    isolated resource function get id() returns int {
        return self.id;
    }
}

# Represents a Teacher as a class.
public isolated distinct service class Teacher {
    *Profile;
    final string name;
    final string subject;

    isolated function init(string name, string subject) {
        self.name = name;
        self.subject = subject;
    }

    isolated resource function get name() returns string {
        return self.name;
    }

    isolated resource function get subject() returns string {
        return self.subject;
    }
}
```

In the above example, the `Profile` object is an interface. The `Student` and `Teacher` classes are `Object` types that implement the `Profile` interface.

###### Counter Example: Invalid Interfaces

```ballerina
public type Profile service object {
    resource function get name() returns string;
};

public isolated service class Student {
    *Profile;
    final string name;
    final int id;

    isolated function init(string name, int id) {
        self.name = name;
        self.id = id;
    }

    isolated resource function get name() returns string {
        return self.name;
    }

    isolated resource function get id() returns int {
        return self.id;
    }
}
```

The above example results in a compilation error because the `Profile` object is not a `distinct` object, and the `Student` class is not a `distinct` class.

#### 4.6.1 Interfaces Implementing Interfaces

In GraphQL, an interface can implement another interface. The implementing interface must define each field that is specified by the implemented interface. Interface definitions must not contain cyclic references nor implement themselves.

In Ballerina, `distinct` `service` objects can be included in other `distinct` `service` objects to achieve interface-implementing interface functionality. Including these interface objects, to itself or cyclically within other interface objects results in a compilation error.

An `Object` type that implements an interface must implement all the fields from that interface and its parent interfaces.

###### Example: Interfaces Implementing Interfaces
```ballerina
service on new graphql:Listener(9000) {
    resource function get node() returns Node {
        return new Image("001", "https://ballerina.io/images/ballerina-logo-white.svg", "logo");
    }
}

public type Node distinct service object {
    resource function get id() returns string;
};

public type Resource distinct service object {
    *Node;
    resource function get url() returns string;
};

public isolated distinct service class Image {
    *Resource;

    final string id;
    final string url;
    final string thumbnail;

    isolated function init(string id, string url, string thumbnail) {
        self.id = id;
        self.url = url;
        self.thumbnail = thumbnail;
    }

    isolated resource function get id() returns string {
        return self.id;
    }

    isolated resource function get url() returns string {
        return self.url;
    }

    isolated resource function get thumbnail() returns string {
        return self.thumbnail;
    }
}
```

In the above example, the `Node` and `Resource` objects are interfaces. The `Resource` interface implements the `Node` interface. The `Image` class is an `Object` type that implements the `Resource` interface. Since the `Image` object implements the `Resource` interface and the `Resource` interface implements the `Node` interface, the `Image` object must implement the fields from both interfaces.

## 5. Directives

Ballerina GraphQL services support three default directives.

### 5.1 @skip

The `@skip` directive is used to skip a field execution depending on a given condition. It can be used on a field, fragment spread, or inline fragment. The directive expects exactly one argument `if`, which is of type `Boolean!`.

The field is skipped if the value of the `if` argument is `true`.

###### Example: @skip

In the following query, the `name` field will not be queried if the variable `skipName` is `true`.

```graphql
query getProfile ($skipName: Boolean!) {
    profile(id: 1) {
        name @skip(if: $skipName)
        age
    }
}
```

### 5.2 @include

The `@include` directive is used to include a field execution depending on a given condition. It can be used on a field, fragment spread, or inline fragment. The directive expects exactly one argument `if`, which is of type `Boolean!`.

The field is included if the value of the `if` argument is `true`.

###### Example: @include

In the following query, the `name` field will be queried only if the variable `includeName` is `true`.

```graphql
query getProfile ($includeName: Boolean!) {
    profile(id: 1) {
        name @include(if: $includeName)
        age
    }
}
```

>**Note:** Neither the `@skip` nor the `@include` has precedence over the other. In the case that both the `@skip` and `@include` directives are provided on the same field or fragment, it will be queried only if the `@skip` condition is `false` and the `@include` condition is `true`. Stated conversely, the field or fragment will not be queried if either the `@skip` condition is `true` or the `@include` condition is `false`.

### 5.3 Deprecated

The `@deprecated` directive is used to indicate a deprecated field on a type or a deprecated enum value. Deprecation can use a deprecation reason as a string, which is formatted using Markdown syntax.

The `@deprecated` directive has one argument, `reason`, which is of type `String`.

The Ballerina GraphQL package uses the Ballerina's in-built `@deprecated` annotation to deprecate a field (`resource`/`remote` methods or `record` fields) or an `enum` value. The deprecation reason can be provided as a part of the doc comment of the particular schema member.

###### Example: Using the `@deprecated` Annotation

The following code shows how to mark a field and an enum value as deprecated with the deprecation reason.

```ballerina
import ballerina/graphql;

service on new graphql:Listener(9090) {

    # Greets back with a customized greeting with the provided name.
    # + name - The name of the person to greet
    # + return - The customized greeting message
    # # Deprecated
    # The `hello` field is deprecated. Use the `greeting` field instead of this.
    @deprecated
    resource function get hello(string name) returns string {
        return "Hello, " + name;
    }

    # Return the name of the member
    # + return - The full name of the member
    resource function get name() returns Name {
        return {first: "John", last: ""};
    }

    # Returns the current admission status of the pub.
    # + return - The current admission status of the pub
    resource function get status() returns Status {
        return OPEN;
    }
}

# Represents the different admission statuses of the pub.
public enum Status {
    # Open for everyone
    OPEN,
    # Pub is closed
    CLOSED,
    # Only the members are allowed
    MEMBERS_ONLY,
    # Only the VIPs are allowed
    VIP,
    # A private party is being held, only invitees are allowed
    # # Deprecated
    # Private parties are no longer supported
    @deprecated
    PRIVATE_PARTY
}

# Represents the name of the member.
type Name record {|
    # The first name
    string first;
    # The last name
    # # Deprecated
    # This field is deprecated
    @deprecated
    string last;
|};
```

In the above service, the generated schema will indicate that the `hello` field of the `Query` type, the `PRIVATE_PARTY` value of the `Status` enum type and the `last` field of the `Name` type are deprecated, with the reasons provided in the doc comments. (The reason will be the line after the `# # Deprecated` line.)



## 6. Errors

### 6.1 Error Detail Record

The `graphql:ErrorDetail` is used to describe an error (according to the [GraphQL specification](https://spec.graphql.org/October2021/#sec-Errors)) occurred in a GraphQL response. It contains the following fields.

#### 6.1.1 Message

The `message` contains the error message from the particular error.

#### 6.1.2 Locations

The `locations` field contains the locations of the GraphQL document associated with the error. There can be cases where more than one location can cause the error, therefore, this field is an array of locations. There are also cases where a location can not be associated with an error, therefore, this field is optional.

##### 6.1.3 Path

The `path` field is an array of `Int` and `String`, that points to a particular path of the document tree associated with the error. This field will have a value only when a particular error has occurred at the execution phase. Therefore, this field is optional.

##### 6.1.4 Extensions

The `extensions` field is an optional field containing a map with `string` keys. This can be used to send additional metadata related to the error.

### 6.2 Service Error Handling

A GraphQL service can return errors so that the client can handle them. The Ballerina errors types are used to return errors to the GraphQL client. The Ballerina GraphQL service will convert the Ballerina errors to GraphQL errors and send them to the client.

#### 6.2.1 Returning Errors

A Ballerina `resource` or `remote` method representing a GraphQL object field can return an error. When an error is returned, it will be added to the `errors` field in the GraphQL response. The shape of the error object is described in the [Error Detail Record](#61-error-detail-record) section.

When an error is returned from a GraphQL resolver, the error message is added as the message of the error, and the location of the document that caused the error will be added to the `locations` field. The path of the error (from the root of the document) will be added as the path in the error response. Currently, the Ballerina GraphQL service __will not add__ any metadata in the `extensions` field.

If a resolver execution results in an error, the stacktrace of the error will be logged to the `stderr` of the server.

###### Example: Returning Errors
```ballerina
service on new graphql:Listener(9090) {
    resource function get greeting(string name) returns string|error {
        if name == "" {
            return error("Invalid name provided");
        }
        return string`Hello ${name}`;
    }
}
```

The above example shows how to return an error from a Ballerina GraphQL resource method.

The following document can be used to query the above GraphQL service.

```graphql
{
    greeting(name: "")
}
```

The result of the above document is the following.

```json
{
    "errors": [
        {
            "message": "Invalid name provided",
            "locations": [
                {
                    "line": 2,
                    "column": 4
                }
            ],
            "path": [
                "greeting"
            ]
        }
    ],
    "data": null
}
```

#### 6.2.2 Returning Errors and Nil Values

If a `resource` or `remote` method representing a field of a GraphQL object returns an `error`, the corresponding field value under the `data` field will be `null` in the response, in addition to adding an entry in the `errors` field. In this case, if the [field type is `NON_NULL`](#321-nonnull-type), the `null` value will be propagated to the upper levels until the `null` value is allowed. This might cause the whole `data` field to become `null`.

To avoid this, a method can optionally include `nil` type (denoted by `()` in Ballerina). When the method return type includes `nil`, the response is allowed to add `null` as the field value, thus it stops propagating the `null` value to upper levels.

>**Note:** Making a field nullable should be a conscious decision made by the developer. This usually comes to the point on what is considered an error. In some use cases, partial data is considered valid. For example, when retrieving profile, the receiving the `name` field and not receiving the `age` field can be considered valid based on the use case. Similarly, receiving the `age` field, but not receiving the `name` field can be considered an `error`. In that case, the `age` field can be nullable, while the `name` field can be `NON_NULL` type.

###### Example: Returning Errors with Nil Values

```ballerina
service on new graphql:Listener(9090) {

    resource function get profile(int id) returns Profile {
        return new ("Walter White", 50);
    }
}

service class Profile {
    resource function get name() returns string|error {
        // Implementation
    }

    resource function get age() returns int|error? {
        // Implementation
    }
}
```

Above example shows how the `name` field of the `Profile` object can return an `error`. But the return type does not include the `nil` type. Therefore, if this field returns an `error`, first, the `name` field will become `null`. Since the `name` field is `NON_NULL`, the value is propagated to the upper level, making the `profile` field `null` in the `data` field of the response. But the `profile` field is also wrapped with the `NON_NULL` type as the `profile` resource method does not include `nil` as the return type. Hence, the `null` value will be propagated further, making the whole `data` field `null`.

Similarly, the `age` field of the `Profile` object can return an `error` too. But it has `nil` as one of the possible return types (denoted by `?`: a syntactic sugar for `|()`). In this case, if an `error` is returned from the method, the `age` field of the `Profile` object will become `null`. Since it does allow `null` values (i.e. the type is not wrapped by `NON_NULL` type), the `null` value will not be propagated further. In such cases, the response can contain the `error` as well as the part of the `data` field.

###### Example: Sample Response for Error Returned from a NON_NULL field

```json
{
    "errors": [
        {
            "message":"Error occurred while retrieving name",
            "locations": [
                {
                    "line": 1,
                    "column": 20
                }
            ],
            "path": ["profile", "name"]
        }
    ],
    "data":null
}
```

###### Example: Sample Response for Error Returned from a Nullable field

```json
{
    "errors": [
        {
            "message":"Error occurred while retrieving age",
            "locations": [
                {
                    "line":1,
                    "column":25
                }
            ],
            "path": ["profile", "age"]
        }
    ],
    "data": {
        "profile": {
            "name":"Walter White",
            "age":null
        }
    }
}
```

#### 6.2.3 The `graphql:__addError` Function

The `graphql:__addError` function can be used to add a custom error to the response. This function accepts two parameters.

1. [`graphql:Context`](#101-context-object) - The context of the GraphQL request.
2. [`graphql:ErrorDetail`](#61-error-detail-record) - The details of the error.

>**Note:** Using the `graphql:__addError` function is not recommended until it is absolutely necessary. It is recommended to return an error from the `resource`/`remote` method instead.

###### Example: Using the `graphql:__addError` Function

```ballerina
service on new graphql:Listener(9090) {
    resource function get greeting(graphql:Context context, graphql:Field 'field, string name) returns string? {
        if name == "" {
            graphql:ErrorDetail errorDetail = {
                message: "Invalid name provided",
                locations: ['field.getLocation()],
                path: 'field.getPath(),
                extensions: {
                    code: "INVALID_NAME"
                }
            };
            graphql:__addError(context, errorDetail);
            return;
        }
        return string `Hello, ${name}!`;
    }
}
```

### 6.3 Client Error Handling

The response returned from the `execute` method of the GraphQL client can include errors. This section describes how to handle those errors on the Ballerina client side. All the errors that occurred during a GraphQL client operation are categorized as `graphql:ClientError` error type. All the other errors are subtypes of this error type.

###### Example: Handle Client Error
```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql");
string document = "{ profile { name } }";
ProfileResponse|graphql:ClientError response = graphqlClient->execute(document);

if response is graphql:ClientError {
    // Handle error
}
```

The above example shows how to capture the `graphql:ClientError`. This way all the errors that are returned are treated the same.

#### 6.3.1 Request Error

There can be errors occurred during sending and validating a GraphQL request. These errors are categorized under the `graphql:RequestError` error type, which is a subtype of the `graphql:ClientError`.

###### Example: Handle Request Error
Above example shows how the `graphql:RequestError`s are handled separately.

##### 6.3.1.1 HTTP Error

When a network error is occurred while sending a request to the GraphQL API, those errors are captured by `graphql:HttpError` error type. These errors can be related to any HTTP level error including invalid URL, network-level failures, timeouts, etc. When the HTTP response has a body, it can be accessed by the `body` field of the details of the error.

###### Example: Handle HTTP Error
```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql");
string document = "{ profile { name } }";
ProfileResponse|graphql:ClientError response = graphqlClient->execute(document);

if response is graphql:HttpError {
    // Get response body
    anydata body = response.detail().body;
    // Handle error
}
```

The above example shows how the `graphql:HttpError`s are handled separately.

##### 6.3.1.2 Invalid Document Error

When the document sent to the GraphQL API is invalid, a validation error will be returned. These errors are captured by `graphql:InvalidDocumentError` error type. The `ErrorDetail` records are added to the `errors` field of the error detail so the details of the error can be retrieved.

###### Example: Handle Invalid Document Error
```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql");
string document = "{ profile { name } }";
ProfileResponse|graphql:ClientError response = graphqlClient->execute(document);

if response is graphql:InvalidDocumentError {
    // Get error details
    graphql:ErrorDetail[]? errors = response.detail().errors;
    // Handle error
}
```

The above example shows how the `graphql:InvalidDocumentError`s are handled separately.

##### 6.3.2 Payload Binding Error

As described in the section [Client Data Binding](#253-client-data-binding), the response can be data-bound. When the data binding fails, a `graphql:PayloadBindingError` will be returned. This error can occur due to a mismatch between the shape of the expected type and the actual response from the GraphQL API. The `ErrorDetail` records are added to the `errors` field of the error detail so the details of the error can be retrieved.

###### Example: Handle Payload Binding Error

```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql");
string document = "{ profile { name } }";
ProfileResponse|graphql:ClientError response = graphqlClient->execute(document);

if response is graphql:PayloadBindingError {
    // Get error details
    graphql:ErrorDetail[]? errors = response.detail().errors;
    // Handle error
}
```

The above example shows how the `graphql:PayloadBindingError`s are handled separately.

###### Example: GraphQL Client Error Handling

The following example demonstrates `graphql:Client` error handling and shows how to obtain GraphQL-specific errors returned by the graphql server.

```ballerina
type ProfileResponse record {|
    *graphql:GenericResponseWithErrors;
    record {|Profile profile;|} data;
|};

type Profile record {|
    string name;
    int age;
|};

public function main() returns error? {
    do {
        graphql:Client graphqlClient = check new ("localhost:9090/graphql");
        string document = "{ profile { name } }";
        ProfileResponse response = check graphqlClient->execute(document);
        io:println(response);
    } on fail graphql:ClientError err {
        handleErrors(err);
    }
}

function handleErrors(graphql:ClientError clientError) {
    if clientError is graphql:PayloadBindingError {
        // Get error details
        graphql:ErrorDetail[]? errors = clientError.detail().errors;
        // Handle Payload Binding Error
    } else if clientError is graphql:InvalidDocumentError {
        // Get error details
        graphql:ErrorDetail[]? errors = clientError.detail().errors;
        // Handle error
    } else if clientError is graphql:HttpError {
        // Get response body
        anydata body = response.detail().body;
        // Handle error
    }
}
```

## 7. Annotations

### 7.1 Service Configuration

The configurations stated in the `graphql:ServiceConfig`, are used to change the behavior of a particular GraphQL service. These configurations are applied to the service.

This annotation consists of the following fields.

#### 7.1.1 Max Query Depth

The `maxQueryDepth` field is used to provide a limit on the depth of an incoming request. When this is set, every incoming request is validated by checking the depth of the query. This includes the depths of the spread fragments. If a particular GraphQL document exceeds the maximum query depth, the request is invalidated and the server will respond with an error.

###### Example: Setting Max Query Depth

```ballerina
@graphql:ServiceConfig {
    maxQueryDepth: 3
}
service on new graphql:Listener(9090) {

}
```

In the above example, when a document has a depth of more than 3, the request will be failed.


###### Example: Invalid Document with Exceeding Max Query Depth

```graphql
{
    profile {
        friend {
            friend {
                name # Depth is 4
            }
        }
    }
}
```

This will result in the following response.

```json
{
  "error": {
    "errors": [
      {
        "message": "Query has depth of 4, which exceeds max depth of 3",
        "locations": [
          {
            "line": 1,
            "column": 1
          }
        ]
      }
    ]
  }
}
```

#### 7.1.2 Auth Configurations

The `auth` field is used to provide configurations related to authentication and authorization for the GraphQL API. The [Security](#8-security) section will explain this configuration in detail.


#### 7.1.3 Context Initializer Function

The `contextInit` field is used to provide a method to initialize the [`graphql:Context` object](#101-context-object). It is called per each request to create a `graphql:Context` object.

The context initializer function can return an error if the validation is failed. In such cases, the request will not proceed, and an error will be returned immediately.

Following is the function template for the `contextInit` function.

```ballerina
isolated function (http:RequestContext requestContext, http:Request request) returns graphql:Context|error {}
```

When `contextInit` is not provided, a default function will be set as the value of the field. The default function definition is below.

```ballerina
isolated function initDefaultContext(http:RequestContext requestContext, http:Request request) returns Context|error {
    return new;
}
```

The `contextInit` function can be provided inline, or as a function pointer.

###### Example: Provide Context Initializer Function Inline

```ballerina
@graphql:ServiceConfig {
    contextInit: isolated function(http:RequestContext requestContext, http:Request request) returns graphql:Context|error {
        // ...
    }
}
```

###### Example: Provide Context Initializer Function as a Function Pointer

```ballerina
isolated function initContext(http:RequestContext requestContext, http:Request request) returns graphql:Context|error {
    // ...
}

@graphql:ServiceConfig {
    contextInit: initContext
}
service on new graphql:Listener(9090) {
    // ...
}
```

>**Note:** The init function has `http:RequestContext` and `http:Request` objects as inputs. These objects are passed into the function when a request is received. The HTTP headers and the request context can be used to perform additional validations to a request before proceeding to the GraphQL validations. This can be useful to validate the HTTP request before performing the GraphQL operations. The [Imperative Approach in Security](#812-imperative-approach) section will discuss this in detail.

#### 7.1.4 CORS Configurations

The `cors` field is used to configure CORS configurations for the GraphQL service.

###### Example: CORS Configurations

```ballerina
@graphql:ServiceConfig {
    cors: {
        allowOrigins: ["http://www.wso2.com", "http://www.ballerina.io"],
        allowCredentials: false,
        allowHeaders: ["CORELATION_ID"],
        exposeHeaders: ["X-CUSTOM-HEADER"],
        maxAge: 84900
    }
}
service on new graphql:Listener(9090) {
    // ...
}
```

#### 7.1.5 GraphiQL Configurations

The `graphiql` field is used to provide the GraphiQL client configuration to enable the GraphiQL client for a given GraphQL service.

###### Example: GraphiQL Configurations

```ballerina
@graphql:ServiceConfig {
    graphiql: {
        enabled: true,
        path: "/ballerina/graphiql",
        printUrl: false
    }
}
service on new graphql:Listener(9090) {
    // ...
}
```
##### 7.1.5.1 The `enabled` Field
The field `enabled` accepts a `boolean` that denotes whether the client is enabled or not. By default, it has been set to `false`.

##### 7.1.5.2 The `path` Field
The optional field `path` accepts a valid `string` for the GraphiQL service. If the path is not given in the configuration, `/graphiql` is set as the default path.

##### 7.1.5.3 The `printUrl` Field
The optional field `printUrl` accepts a boolean that denotes whether the GraphiQL url is printed to stdout or not. By default, it has been set to `true`.

#### 7.1.6 Service Interceptors

The `interceptors` field is used to provide the service interceptors.

###### Example: Single Service Interceptor

```ballerina
@graphql:ServiceConfig {
    interceptors: new Interceptor1()
}
service on new graphql:Listener(9090) {
    // ...
}
```

###### Example: Array of Service Interceptors

```ballerina
@graphql:ServiceConfig {
    interceptors: [new Interceptor1(), new Interceptor2()]
}
service on new graphql:Listener(9090) {
    // ...
}
```

#### 7.1.7 Introspection Configurations

The `introspection` field is used to enable or disable the GraphQL introspection query support. If the introspection query support is disabled, the GraphQL service won't allow the execution of the `__schema` and the `__type` introspection queries. However, the `__typename` introspection will work even if the introspection query support is disabled. By default, introspection is enabled for Ballerina GraphQL services.

###### Example: Disable Introspection Query Support

```ballerina
@graphql:ServiceConfig {
    introspection: false
}
service on new graphql:Listener(9090) {
    // ...
}
```
>**Note:** It is recommended to disable introspection in production environments until it is required.

#### 7.1.8 Constraint Configurations

The `validation` field is used to enable or disable the validation of constraints defined on GraphQL input types. If constraint validation support is enabled, the GraphQL service verifies all constraints set on the GraphQL inputs when executing the resolver. By default, constraint validation is enabled for Ballerina GraphQL services.

###### Example: Disable Constraint Validation Support

```ballerina
@graphql:ServiceConfig {
    validation: false
}
service on new graphql:Listener(9090) {
    // ...
}
```

### 7.2 Resource Configuration

The configurations stated in the `graphql:ResourceConfig`, are used to change the behavior of a particular GraphQL resolver. These configurations are applied to the resolver functions.

This annotation consists of the following field.

#### 7.2.1 Field Interceptors

The `interceptors` field is used to provide the field interceptors.

###### Example: Single Field Interceptor

```ballerina
service on new graphql:Listener(9090) {

    @graphql:ResourceConfig {
        interceptors: new Interceptor1()
    }
    resource function get name(int id) returns string {
      // ...
   }
}
```

###### Example: Array of Field Interceptors

```ballerina
service on new graphql:Listener(9090) {

    @graphql:ResourceConfig {
        interceptors: [new Interceptor1(), new Interceptor2()]
    }
    resource function get name(int id) returns string {
      // ...
   }
}
```

### 7.3 Interceptor Configuration

The configurations stated in the `graphql:InterceptorConfig`, are used to change the behavior of a particular GraphQL interceptor.

#### 7.3.1 Scope Configuration

The field `global` is used to configure the scope of the interceptor. If the `global` field is set as `true`, the interceptor will be applied to each field and subfield of the service. If the flag is set as `false`, the interceptor will be applied top level fields of the Query, Mutation and Subscription types, but not to the subfields of them. By default, the `global` flag is set as `true`.

>**Note:** The scope configuration is applied only to the GraphQL [service interceptors](#10331-service-interceptors).

###### Example: Scope Configuration

```ballerina
@graphql:InterceptorConfig {
    global:false
}
readonly service class LogInterceptor {
   *graphql:Interceptor;

    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
        // ...
    }
}
```

### 7.4 ID Annotation

The `graphql:ID` annotation is used to define the [GraphQL `ID` scalar type](#415-id). This annotation can be used to annotate a field of a GraphQL object type or a GraphQL input type.

## 8. Security

### 8.1 Service Authentication and Authorization

There are two ways to enable authentication and authorization in Ballerina GraphQL service.

1. Declarative approach
2. Imperative approach

#### 8.1.1 Declarative Approach

This is also known as the configuration-driven approach, which is used for simple use cases, where users have to provide a set of configurations and do not need to be worried more about how authentication and authorization work. The user does not have full control over the configuration-driven approach.

The service configurations are used to define the authentication and authorization configurations. Users can configure the configurations needed for different authentication schemes and configurations needed for authorizations of each authentication scheme. The configurations can be provided at the service level. The auth handler creation and request authentication/authorization is handled internally without user intervention. The requests that succeeded in authentication and/or authorization phases according to the configurations will be passed to the business logic layer.

##### 8.1.1.1 Basic Authentication - File User Store

A GraphQL service can be secured using [Basic Authentication with File User Store](https://github.com/ballerina-platform/module-ballerina-auth/blob/master/docs/spec/spec.md#311-file-user-store) and optionally by enforcing authorization.

When configured, it validates the `Authorization` header in the HTTP request that contains the GraphQL document. This reads the data from a `TOML` file, that stores the usernames and passwords for authentication and the scopes for authorization.

###### Example: Declarative Basic Authentication with File User Store

```ballerina
@graphql:ServiceConfig {
    auth: [
        {
            fileUserStoreConfig: {},
            scopes: "admin"
        }
    ]
}
service on new graphql:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

The `Config.toml` file below will be used to define the users.

```toml
[[ballerina.auth.users]]
username="alice"
password="alice@123"
scopes=["developer"]


[[ballerina.auth.users]]
username="bob"
password="bob@123"
scopes=["developer", "admin"]
```

##### 8.1.1.2 Basic Authentication - LDAP User Store

A GraphQL service can be secured using [Basic Authentication with LDAP User Store](https://github.com/ballerina-platform/module-ballerina-auth/blob/master/docs/spec/spec.md#312-ldap-user-store) and optionally by enforcing authorization.

When configured, it validates the `Authorization` header in the HTTP request that contains the GraphQL document. This reads the data from the configured LDAP, which stores the usernames and passwords for authentication and the scopes for authorization.

###### Example: Declarative Basic Authentication with LDAP User Store

```ballerina
@graphql:ServiceConfig {
    auth: [
        {
            ldapUserStoreConfig: {
                domainName: "bcssl.lk",
                connectionUrl: "ldap://localhost:389",
                connectionName: "cn=admin,dc=bcssl,dc=lk",
                connectionPassword: "bcssl123",
                userSearchBase: "ou=Users,dc=bcssl,dc=lk",
                userEntryObjectClass: "inetOrgPerson",
                userNameAttribute: "uid",
                userNameSearchFilter: "(&(objectClass=inetOrgPerson)(uid=?))",
                userNameListFilter: "(objectClass=inetOrgPerson)",
                groupSearchBase: ["ou=Groups,dc=bcssl,dc=lk"],
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
            scopes: "admin"
        }
    ]
}
service /graphql on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

##### 8.1.1.3 JWT Authentication

A GraphQL service can be secured using [JWT Authentication](https://github.com/ballerina-platform/module-ballerina-jwt/blob/master/docs/spec/spec.md) and by enforcing authorization optionally.

When configured, it validates the JWT sent in the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Declarative JWT Authentication

```ballerina
@graphql:ServiceConfig {
    auth: [
        {
            jwtValidatorConfig: {
                issuer: "wso2",
                audience: "ballerina",
                signatureConfig: {
                    certFile: "path/to/public.crt"
                },
                scopeKey: "scp"
            },
            scopes: "admin"
        }
    ]
}
service /graphql on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

##### 8.1.1.4 OAuth2

A GraphQL service can be secured using [OAuth2](https://github.com/ballerina-platform/module-ballerina-oauth2/blob/master/docs/spec/spec.md) and by enforcing authorization optionally.

When configured, it validates the OAuth2 token sent in the `Authorization` header in the HTTP request that contains the GraphQL document. This calls the configured OAuth2 introspection endpoint to validate.

###### Example: Declarative Approach to Secure Service Using OAuth2

```ballerina
@graphql:ServiceConfig {
    auth: [
        {
            oauth2IntrospectionConfig: {
                url: "https://localhost:9445/oauth2/introspect",
                tokenTypeHint: "access_token",
                scopeKey: "scp",
                clientConfig: {
                    customHeaders: {"Authorization": "Basic YWRtaW46YWRtaW4="},
                    secureSocket: {
                        cert: "path/to/public.crt"
                    }
                }
            },
            scopes: "admin"
        }
    ]
}
service /graphql on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

#### 8.1.2 Imperative Approach

This is also known as the code-driven approach, which is used for advanced use cases, where users need to be worried more about how authentication and authorization work and need to have further customizations. The user has full control of the code-driven approach. The handler creation and authentication/authorization calls are made by the user at the business logic layer.

The [`graphql:Context`](#101-context-object) object and the [`contextInit`](#713-context-initializer-function) method can be used to achieve this.

##### 8.1.2.1 Basic Authentication - File User Store

A file user store can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative Basic Authentication with File User Store

```ballerina
final http:ListenerFileUserStoreBasicAuthHandler handler = new;

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

readonly service class AuthInterceptor {
    *graphql:Interceptor;

    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
        value:Cloneable|isolated object {} authorization = check context.get("Authorization");
        if authorization !is string {
            return error("Failed to authorize");
        }
        auth:UserDetails|http:Unauthorized authn = handler.authenticate(authorization);
        if authn is http:Unauthorized {
            return error("Unauthorized");
        }
        http:Forbidden? authz = handler.authorize(authn, "admin");
        if authz is http:Forbidden {
            return error("Forbidden");
        }
        return context.resolve('field);
    }
}

@graphql:ServiceConfig {
    contextInit: contextInit,
    interceptors: new AuthInterceptor()
}
service on new graphql:Listener(9090) {

    resource function get greeting(graphql:Context context) returns string {
        return "welcome";
    }
}
```

The `Config.toml` file below will be used to define the users.

```toml
[[ballerina.auth.users]]
username="alice"
password="alice@123"
scopes=["developer"]


[[ballerina.auth.users]]
username="bob"
password="bob@123"
scopes=["developer", "admin"]
```

##### 8.1.2.2 Basic Authentication - LDAP User Store

An LDAP user store can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative Basic Authentication with LDAP User Store

```ballerina
graphql:LdapUserStoreConfig config = {
    domainName: "bcssl.lk",
    connectionUrl: "ldap://localhost:389",
    connectionName: "cn=admin,dc=bcssl,dc=lk",
    connectionPassword: "bcssl123",
    userSearchBase: "ou=Users,dc=bcssl,dc=lk",
    userEntryObjectClass: "inetOrgPerson",
    userNameAttribute: "uid",
    userNameSearchFilter: "(&(objectClass=inetOrgPerson)(uid=?))",
    userNameListFilter: "(objectClass=inetOrgPerson)",
    groupSearchBase: ["ou=Groups,dc=bcssl,dc=lk"],
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
final http:ListenerLdapUserStoreBasicAuthHandler handler = new (config);

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

readonly service class AuthInterceptor {
    *graphql:Interceptor;

    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
        value:Cloneable|isolated object {} authorization = check context.get("Authorization");
        if authorization !is string {
            return error("Failed to authorize");
        }
        auth:UserDetails|http:Unauthorized authn = handler->authenticate(authorization);
        if authn is http:Unauthorized {
            return error("Unauthorized");
        }
        http:Forbidden? authz = handler->authorize(authn, "admin");
        if authz is http:Forbidden {
            return error("Forbidden");
        }
        return context.resolve('field);
    }
}

@graphql:ServiceConfig {
    contextInit: contextInit,
    interceptors: new AuthInterceptor()
}
service on new graphql:Listener(9090) {

    resource function get greeting(graphql:Context context) returns string {
        return "welcome";
    }
}
```

##### 8.1.2.3 JWT Authentication

A JWT configuration can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative JWT Authentication

```ballerina
graphql:JwtValidatorConfig config = {
    issuer: "ballerina",
    audience: ["wso2"],
    signatureConfig: {
        jwksConfig: {
            url: "https://localhost:8080/jwks"
        }
    }
};
final http:ListenerJwtAuthHandler handler = new (config);

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

readonly service class AuthInterceptor {
    *graphql:Interceptor;

    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
        value:Cloneable|isolated object {} authorization = check context.get("Authorization");
        if authorization !is string {
            return error("Failed to authorize");
        }
        jwt:Payload|http:Unauthorized authn = handler.authenticate(authorization);
        if authn is http:Unauthorized {
            return error("Unauthorized");
        }
        if authn is jwt:Payload {
            http:Forbidden? authz = handler.authorize(authn, "admin");
            if authz is http:Forbidden {
                return error("Forbidden");
            }
        }
        return context.resolve('field);
    }
}

@graphql:ServiceConfig {
    contextInit: contextInit,
    interceptors: new AuthInterceptor()
}
service on new graphql:Listener(9090) {

    resource function get greeting(graphql:Context context) returns string {
        return "welcome";
    }
}
```

##### 8.1.2.4 OAuth2

An OAuth2 introspection endpoint can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative Approach to Secure Service Using OAuth2

```ballerina
graphql:OAuth2IntrospectionConfig config = {
    url: "https://localhost:8080/oauth2/introspect",
    tokenTypeHint: "access_token"
};
final http:ListenerOAuth2Handler handler = new (config);

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

readonly service class AuthInterceptor {
    *graphql:Interceptor;

    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
         value:Cloneable|isolated object {} authorization = check context.get("Authorization");
        if authorization !is string {
            return error("Failed to authorize");
        }
        oauth2:IntrospectionResponse|http:Unauthorized|http:Forbidden auth = handler->authorize(authorization, "admin");
        if auth is http:Unauthorized {
            return error("Unauthorized");
        }
        if auth is http:Forbidden {
            return error("Forbidden");
        }
        return context.resolve('field);
    }
}

@graphql:ServiceConfig {
    contextInit: contextInit,
    interceptors: new AuthInterceptor()
}
service on new graphql:Listener(9090) {

    resource function get greeting(graphql:Context context) returns string {
        return "welcome";
    }
}
```

### 8.2 Client Authentication and Authorization

Authentication and authorization in Ballerina GraphQL clients can be enabled using the declarative approach.

##### 8.2.1 Basic Authentication

Ballerina GraphQL clients enable basic authentication with credentials by setting the `graphql:CredentialsConfig` configurations in the client. The requests from the client are automatically enriched with the `Authorization: Basic <token>` header when passing the `graphql:CredentialsConfig` for the `auth` configuration of the client.

###### Example: Client Using Declarative Basic Authentication

```ballerina
public function main() returns error? {
    graphql:Client graphqlClient = check new ("localhost:9090/graphql",
        auth = {
            username: "bob",
            password: "bob@123"
        }
    );
    string document = "{ one: profile(id: 100) {name} }";
    ProfileResponseWithErrors response = check graphqlClient->execute(document);
    // ...
}
```

##### 8.2.2 Bearer Token Authentication

Ballerina GraphQL clients enable authentication using bearer tokens by setting the `graphql:BearerTokenConfig` configurations in the client. The requests from the client are automatically enriched with the `Authorization: Bearer <token>` header when passing the `graphql:BearerTokenConfig` for the `auth` configuration of the client.

###### Example: Client Using Declarative Bearer Token Authentication

```ballerina
public function main() returns error? {
    graphql:Client graphqlClient = check new ("localhost:9090/graphql",
        auth = {
            token: "56ede317-4511-44b4-8579-a08f094ee8c5"
        }
    );
    string document = "{ one: profile(id: 100) {name} }";
    ProfileResponseWithErrors response = check graphqlClient->execute(document);
    // ...
}
```

##### 8.2.3 Self-Signed JWT Authentication

Ballerina GraphQL clients enable authentication using JWTs by setting the `graphql:JwtIssuerConfig` configurations in the client.  The requests from the client are automatically enriched with the `Authorization: Bearer <token>` header when passing the `graphql:JwtIssuerConfig` for the `auth` configuration of the client.

###### Example: Client Using Declarative Self Signed JWT Authentication

```ballerina
public function main() returns error? {
    graphql:Client graphqlClient = check new ("localhost:9090/graphql",
        auth = {
            username: "ballerina",
            issuer: "wso2",
            audience: ["ballerina", "ballerina.org", "ballerina.io"],
            keyId: "5a0b754-895f-4279-8843-b745e11a57e9",
            jwtId: "JlbmMiOiJBMTI4Q0JDLUhTMjU2In",
            customClaims: {scp: "admin"},
            expTime: 3600,
            signatureConfig: {
                config: {
                    keyFile: "path/to/private.key"
                }
            }
        }
    );
    string document = "{ one: profile(id: 100) {name} }";
    ProfileResponseWithErrors response = check graphqlClient->execute(document);
    // ...
}
```

##### 8.2.4 OAuth2

Ballerina GraphQL clients enable authentication using OAuth2 by setting the `graphql:OAuth2GrantConfig` configurations in the client. The requests from the client are automatically enriched with the `Authorization: Bearer <token>` header when passing the `graphql:OAuth2GrantConfig` for the `auth` configuration of the client. OAuth2 can configure in following 4 ways

###### 8.2.4.1 Client Credentials Grant Type

```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql",
    auth = {
        tokenUrl: "localhost:9445/oauth2/token",
        clientId: "FlfJYKBD2c925h4lkycqNZlC2l4a",
        clientSecret: "PJz0UhTJMrHOo68QQNpvnqAY_3Aa",
        scopes: "admin",
        clientConfig: {
            secureSocket: {
                cert: "path/to/public.crt"
            }
        }
    }
);
```

###### 8.2.4.2 Password Grant Type

```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql",
    auth = {
        tokenUrl: "https://localhost:9445/oauth2/token",
        username: "admin",
        password: "admin",
        clientId: "FlfJYKBD2c925h4lkycqNZlC2l4a",
        clientSecret: "PJz0UhTJMrHOo68QQNpvnqAY_3Aa",
        scopes: "admin",
        refreshConfig: {
            refreshUrl: "https://localhost:9445/oauth2/token",
            scopes: "hello",
            clientConfig: {
                secureSocket: {
                    cert: "path/to/public.crt"
                }
            }
        },
        clientConfig: {
            secureSocket: {
                cert: "path/to/public.crt"
            }
        }
    }
);
```
###### 8.2.4.3 Refresh Token Grant Type

```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql",
    auth = {
        refreshUrl: "https://localhost:9445/oauth2/token",
        refreshToken: "24f19603-8565-4b5f-a036-88a945e1f272",
        clientId: "FlfJYKBD2c925h4lkycqNZlC2l4a",
        clientSecret: "PJz0UhTJMrHOo68QQNpvnqAY_3Aa",
        scopes: "admin",
        clientConfig: {
            secureSocket: {
                cert: "path/to/public.crt"
            }
        }
    }
);
```

###### 8.2.4.4 JWT Bearer Grant Type

```ballerina
graphql:Client graphqlClient = check new ("localhost:9090/graphql",
    auth = {
        tokenUrl: "https://localhost:9445/oauth2/token",
        assertion: "eyJhbGciOiJFUzI1NiIsImtpZCI6Ij[...omitted for brevity...]",
        clientId: "FlfJYKBD2c925h4lkycqNZlC2l4a",
        clientSecret: "PJz0UhTJMrHOo68QQNpvnqAY_3Aa",
        scopes: "admin",
        clientConfig: {
            secureSocket: {
                cert: "path/to/public.crt"
            }
        }
    }
);
```

### 8.3 SSL/TLS and Mutual SSL

The Ballerina GraphQL listeners/clients can be used to communicate via a secured connection. This section defines the specifications for creating Ballerina GraphQL listeners and clients to communicate via a secured connection.

### 8.3.1 Listener

#### 8.3.1.1 SSL/TLS

The GraphQL listener can be secured to communicate via HTTPS using SSL/TLS. The `graphql:ListenerSecureSocket` can be used to configure the listener to expose an HTTPS connection.

Alternatively, an HTTP listener configured to connect with an HTTPS client can also be used to create the GraphQL listener to expose an HTTPS connection.

###### Example: SSL/TLS Configuration of the GraphQL Listener

```ballerina
listener graphql:Listener securedGraphqlListener = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);

service on securedGraphqlListener {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

###### Example: GraphQL Listener Using an SSL/TLS Configured HTTP Listener

```ballerina
listener http:Listener securedHttpListener = new(9090,
    secureSocket = {
        key: {
            certFile: "/path/to/public.crt",
            keyFile: "/path/to/private.key"
        }
    }
);
listener graphql:Listener securedGraphqlListener = new (securedHttpListener);

service on securedGraphqlListener {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

#### 8.3.1.2 Mutual SSL

The GraphQL listener supports mutual SSL, which is a certificate-based authentication process in which two parties (the client and the server) authenticate each other by verifying the digital certificates.

The `graphql:ListenerSecureSocket` configuration can be used to configure mutual SSL for a GraphQL listener.

Alternatively, an HTTP listener configured to connect with a client with mutual SSL can also be used to create the GraphQL listener to expose an HTTPS connection.

###### Example: Mutual SSL Configuration of the GraphQL Listener

```ballerina
listener graphql:Listener securedGraphqlListener = new(9090,
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

service on securedGraphqlListener {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

###### Example: GraphQL Listener Using a Mutual SSL Configured HTTP Listener

```ballerina
listener http:Listener securedHttpListener = new(9090,
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
listener graphql:Listener securedGraphqlListener = new (securedHttpListener);

service on securedGraphqlListener {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

### 8.3.2 Client

#### 8.3.2.1 SSL/TLS

A GraphQL client can communicate with a secured GraphQL service via SSL/TLS. The `graphql:ClientSecureSocket` configuration can be used to provide configurations related to SSL/TLS.

###### Example: GraphQL Client Using SSL/TLS

```ballerina
public function main() returns error? {
    graphql:Client graphqlClient = check new ("localhost:9090/graphql",
       secureSocket = {
            cert: "path/to/public.crt"
        }
    );
    string document = "{ one: profile(id: 100) {name} }";
    ProfileResponseWithErrors response = check graphqlClient->execute(document);
    // ...
}
```

#### 8.3.2.2 Mutual SSL

A GraphQL client can communicate with a secured GraphQL service using mutual SSL. Mutual SSL can be enabled by providing the `graphql:ClientSecureSocket` value for the `auth` configuration of the client along with providing the client certificate and key files via the `key` configuration of the `graphql:ClientSecureSocket`.

###### Example: GraphQL Client Using Mutual SSL

```ballerina
public function main() returns error? {
    graphql:Client graphqlClient = check new ("localhost:9090/graphql",
       secureSocket = {
            key: {
                certFile: "path/to/public.crt",
                keyFile: "path/to/private.key"
            },
            cert: "path/to/public.crt",
            protocol: {
                name: http:TLS
            },
            ciphers: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA"]
        }
    );
    string document = "{ one: profile(id: 100) {name} }";
    ProfileResponseWithErrors response = check graphqlClient->execute(document);
    // ...
}
```

## 9. Tools

### 9.1 GraphiQL client

The Ballerina GraphQL package provides an integrated GraphiQL client tool which is provided by the GraphQL Foundation. The client is implemented using CDN assets, and it provides a Graphical User Interface to execute the GraphQL queries. To enable the GraphiQL client, configuration should be provided as mentioned in the [GraphiQL configuration](#715-graphiql-configurations) section.

If the configurations are provided correctly, the GraphiQL client tool will be served at the given path when the service starts. The client can be accessed via a web browser.

###### Example: Enable GraphiQL Client

```ballerina
@graphql:ServiceConfig {
    graphiql: {
        enabled: true,
        path: "/ballerina/graphiql"
    }
}
service on new graphql:Listener(9090) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
````
>**Note:** The GraphiQL client is used as a tool to help developers when writing a GraphQL service, and It is recommended not to enable it in production environments.

## 10. Advanced Features

### 10.1 Context Object

The `graphql:Context` object is used to pass meta-information of a request among the graphql resolvers. It will be created per each request.

Attributes can be stored in the `graphql:Context` object using key-value pairs and can be retrieved back when needed.

#### 10.1.1 Context Methods

The `graphql:Context` object provides a set of methods for handling attributes.

##### 10.1.1.1 Set Attribute in Context

To set an attribute in the `graphql:Context` object, the `set()` method can be used. It requires two parameters.

- `key`: The key of the attribute. This key can be used to retrieve the attribute back when needed. The `key` must be a `string`.
- `value`: The value of the attribute. The type of this parameter is `value:Cloneable|isolated object {}`. This means the values can be any immutable type, `readonly` value, or an isolated object.

###### Example: Set Attribute in Context

```ballerina
graphql:Context context = new;

context.set("key", "value");
```

>**Note:** If the provided key already exists in the context, the value will be replaced.

##### 10.1.1.2 Get Attribute from Context

To get an attribute from the `graphql:Context` object, the `get()` method can be used. It requires one parameter.

- `key`: This is the key of the attribute that needs to be retrieved.

If the key does not exist in the context, the `get` method will return a `graphql:Error`.

###### Example: Get Context Attribute

```ballerina
value:Cloneable|isolated object {}|graphql:Error attribute = context.get("key");
```

##### 10.1.1.3 Remove Attribute from Context

To remove an attribute from the `graphql:Context` object, the `remove` method can be used. It requires one parameter.

- `key`: This is the key of the attribute that needs to be removed.

If the key does not exist in the context, the `remove` method will return a `graphql:Error`.

###### Example: Remove Context Attribute

```ballerina
graphql:Error? result = context.remove("key");
```

>**Note:** Even though the functionalities are provided to update/remove attributes in the context, it is discouraged to do such operations. The reason is that destructive modifications may cause issues in parallel executions of the Query operations.

#### 10.1.2 Accessing the Context Object

The `graphql:Context` can be accessed inside any resolver. When needed, the `graphql:Context` should be added as a parameter of the `resource` or `remote` method representing a GraphQL field.

>**Note:** It is recommended to add the `graphql:Context` as the first parameter as a convention, to increase the readability of the code.

###### Example: Accessing the Context

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Context context) returns Profile|error {
        value:Cloneable|isolated object {} attribute = check context.get("key");
        // ...
    }
}

type Profile record {|
    string name;
    int age;
|};
```

>**Note:** The parameter `graphql:Context` should be used only when it is required to use the context.

###### Example: Accessing the Context from an Object

The following example shows how to access the context from an Object. When a Ballerina service type is used as an `Object` type in GraphQL, the resource methods in the service can also access the context when needed.

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile() returns Profile {
    }
}

service class Profile {
    private final string name;
    private final int age;

    function init(string name, int age) {
        self.name = name;
        self.age = age;
    }

    resource function get name() returns string {
        return self.name;
    }

    // Access the context inside a GraphQL object
    resource function get age(graphql:Context context) returns int {
        value:Cloneable|isolated object {} attribute = check context.get("key");
        // ...
        return self.age;
    }
}
```

#### 10.1.3 Resolving Field Value

To resolve the value of a field, the `resolve()` method can be used. This requires the `graphql:Field` object which is related to the particular field that is going to be resolved. If the resolver has interceptors attached, the interceptors will be executed until there are no more interceptors left. If there are no interceptors left, the actual resolver will be executed.

```ballerina
public isolated function resolve(graphql:Field ‘field) returns anydata;
```

### 10.2 Field Object

The `graphql:Field` object is used to access meta-information of a field in a GraphQL document. This object can be used to retrieve information about a particular field of a GraphQL document, from a Ballerina GraphQL `resource` or `remote` method.

#### 10.2.1 Field Object Methods

##### 10.2.1.1 Get Field Name

This method returns the name of the currently executing field. It returns a `string`.

###### Example: Get Field Name

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile {
        string name = 'field.getName();
    }
}
```

##### 10.2.1.2 Get Field Alias

This method returns the alias of the currently executing field as a `string`. If the field does not have an alias, it returns the field name.

###### Example: Get Field Alias

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile {
        srting alias = 'field.getAlias();
    }
}
```

##### 10.2.1.3 Get Field Path

This method returns the path of the currently executing field as an array of `int` and `string`. The path is an array of indices and keys that can be used to traverse the response JSON to reach the current field.

###### Example: Get Field Path

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile {
        (int|string)[] path = 'field.getPath();
    }
}
```

##### 10.2.1.4 Get Subfield Names

This method returns the names of the subfields of the currently executing field as an array of `string`. If the field does not have any subfields, it returns an empty array.

###### Example: Get Subfield Names

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile {
        string[] subfieldNames = 'field.getSubfieldNames();
    }
}
```

##### 10.2.1.5 Get Field Type

This method returns the type of the currently executing field as a `graphql:__Type` record. The `graphql:__Type` record can be used to retrieve information about the type of the currently executing field.

###### Example: Get Field Type

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile {
        graphql:__Type type = 'field.getType();
        // ...
    }
}
```

##### 10.2.1.6 Get Subfields

This method returns the subfields of the currently executing field as an array of `graphql:Field` objects. It will return `nil` if the field is not an `INTERFACE` or an `OBJECT`, i.e. if it does not have subfields.

#### Example: Get Subfields

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile {
        graphql:Field[] subfields = 'field.getSubfields();
    }
}
```

##### 10.2.1.7 Get Field Location

This method returns the location of the field in the GraphQL document as a `graphql:Location` record. It includes the line and the column number of the field in the GraphQL document.

###### Example: Get Field Location

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile {
        graphql:Location location = 'field.getLocation();
    }
}
```

#### 10.2.2 Accessing the Field Object

The `graphql:Field` can be accessed inside any resolver. When needed, the `graphql:Field` should be added as a parameter of the `resource` or `remote` method representing a GraphQL field.

>**Note:** It is recommended to add the `graphql:Field` as the first parameter, or the second parameter (if the `graphql:Context` is present as the first parameter) as a convention, to increase the readability of the code.

###### Example: Accessing the Field

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Field 'field) returns Profile|error {
        string fieldName = 'field.getName();
        // ...
    }
}

type Profile record {|
    string name;
    int age;
|};
```

###### Example: Accessing the Field when Context is Present

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile(graphql:Context context, graphql:Field 'field) returns Profile|error {
        string fieldName = 'field.getName();
        // ...
    }
}

type Profile record {|
    string name;
    int age;
|};
```

###### Example: Accessing the Field from an Object

```ballerina
service on new graphql:Listener(9090) {
    resource function get profile() returns Profile {
        return new ("Walter White", 50);
    }
}

service class Profile {
    private final string name;
    private final int age;

    function init(string name, int age) {
        self.name = name;
        self.age = age;
    }

    resource function get name() returns string {
        return self.name;
    }

    // Access the field inside a GraphQL object
    resource function get age(graphql:Field 'field) returns int {
        string fieldName = 'field.getName();
        // ...
        return self.age;
    }
}
```

### 10.3 Interceptors

The GraphQL interceptors can be used to execute a custom code before and after a resolver gets invoked.

#### 10.3.1 Interceptor Service Object

The interceptor service object is defined in the Ballerina GraphQL package. It includes a single remote method named execute that accepts [`Context`](#101-context-object) and [`Field`](#102-field-object) as the parameters. The return type of the method is a union of `anydata` and `error`.

```ballerina
public type Interceptor distinct service object {
    isolated remote function execute(Context context, Field 'field) returns anydata|error;
};
```

#### 10.3.2 Writing an Interceptor

Interceptors can be defined as a readonly service class that infers the Interceptor object provided by the GraphQL package. A user-specific name can be used as the service class name.

```ballerina
readonly service class InterceptorName {
   *graphql:Interceptor;

    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
        // Do some work
        var output = context.resolve('field);
        // Do some work
    }
}
```

The Interceptor service class should have the implementation of the `execute()` remote method that infers from the interceptor service object. The code needed to be included in the interceptor should be kept inside the `execute()` method. Interceptors can not have any other `resource/remote` methods inside the interceptor. However, the users can define the general methods inside the interceptors.

#### 10.3.3 Execution

When it comes to interceptor execution, it follows the `onion principle`. Each interceptor adds a layer before and after the actual resolver invocation. Therefore, the order of the interceptor array in the configuration will be important. In an Interceptor `execute()` method, all the code lines that are placed before the `context.resolve()` will be executed before the resolver execution, and the code lines placed after the `context.resolve()` will be executed after the resolver execution. The [`context.resolve()`](#1013-resolving-field-value) method invokes the next interceptor.

>**Note:** The inserting order of the interceptors into the array, will be the execution order of Interceptors. The interceptors are applied to each event in response stream of subscription resolvers.

##### 10.3.3.1 Service Interceptors
The service interceptors are applied to all the resolvers in the GraphQL service. A GraphQL service accepts a single service interceptor or an array of service interceptors, and it should be inserted as mentioned in the [Service Interceptor](#716-service-interceptors) section. The scope of the interceptor can be configured as defined in the [scope configuration](#731-scope-configuration) section.

###### Example: GraphQL Service Interceptor

```ballerina
import ballerina/graphql;
import ballerina/log;

readonly service class ServiceInterceptor {
    *graphql:Interceptor;
    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
        log:printInfo(string `Service Interceptor execution!`);
        var output = context.resolve('field);
        log:printInfo("Connection closed!");
        return output;
    }
}

@graphql:ServiceConfig {
    interceptors: [new ServiceInterceptor()]
}
service /graphql on new graphql:Listener(9000) {
    resource function get name(int id) returns string {
        log:printInfo("Resolver: name");
        return "Ballerina";
    }
}
```

Following is the output of the server when a request is processed:
```shell
1. Service Interceptor execution!
3. Resolver: name
5. Connection closed!
```

##### 10.3.3.2 Field Interceptors
The field interceptors are applied to a specific resolver in the GraphQL service. A GraphQL resolver accepts a single field interceptor or an array of field interceptors, and it should be inserted as mentioned in the [Field Interceptor](#721-field-interceptors) section.

###### Example: GraphQL Field Interceptor

```ballerina
import ballerina/graphql;
import ballerina/log;

readonly service class FieldInterceptor {
    *graphql:Interceptor;
    isolated remote function execute(graphql:Context context, graphql:Field 'field) returns anydata|error {
        log:printInfo(string `Field Interceptor execution!`);
        var output = context.resolve('field);
        log:printInfo("Connection closed!");
        return output;
    }
}

service /graphql on new graphql:Listener(9000) {
    @graphql:ResourceConfig {
        interceptors: new FieldInterceptor()
    }
    resource function get name(int id) returns string {
        log:printInfo("Resolver: name");
        return "Ballerina";
    }
}
```

Following is the output of the server when a request is processed:
```shell
1. Field Interceptor execution!
3. Resolver: name
5. Connection closed!
```

### 10.4 File Upload

This section describes how file uploading in Ballerina GraphQL works.

#### 10.4.1 File Upload Protocol

The Ballerina GraphQL package uses the [GraphQL Multipart Request Specification](https://github.com/jaydenseric/graphql-multipart-request-spec) for file uploads.

Following are the required, ordered fields that must be present in a multipart request to upload a file to a Ballerina GraphQL API that supports file uploads.

##### 10.4.1.1 The `operations` Field

This field contains the `JSON-encoded` body of standard GraphQL POST requests where all the variable values storing files must be `null`.

##### 10.4.1.2 The `map` Field

This field contains the `JSON-encoded` map of the path(s) of where the file(s) occurred in the GraphQL document provided in the `operations` field. Each variable must be mapped to a unique key.

##### 10.4.1.3 File Fields

The path for each file that needs to be uploaded should be provided separately. The file path should be mapped to the corresponding key in the `map` field.

###### Example: Single File Upload Request

```shell
curl localhost:9090/graphql \
    -F operations='{ "query": "mutation($file: Upload!) { fileUpload(file: $file) { link } }", "variables": { "file": null } }' \
    -F map='{ "0": ["variables.file"] }' \
    -F 0=@file1.png
```

###### Example: Multiple File Upload Request

```shell
curl localhost:9090/graphql \
    -F operations='{ "query": "mutation($file: [Upload!]) { filesUpload(file: $file) { link } }", "variables": { "file": [null, null] } }' \
    -F map='{ "0": ["variables.file.0"], "1": ["variables.file.1"]}' \
    -F 0=@file1.png
    -F 1=@file2.png
```

##### 10.4.2 The `graphql:Upload` Type

The `graphql:Upload` type is used to provide information on uploaded file. The `graphql:Upload` type is a record type with the following fields.

###### 10.4.2.1 The `fileName` Field

This field contains the name of the file that is being uploaded. The type of field is `string``.

###### 10.4.2.2 The `mimeType` Field

This field contains the mime type of the file being uploaded. The type of field is `string`.

###### 10.4.2.3 The `encoding` Field

This field contains the encoding used to serialize the file. The type of field is `string`.

###### 10.4.2.4 The `byteStream` Field

This field contains the serialized byte stream for the uploaded file. The type of the field is `stream<byte[], io:Error?>`.

#### 10.4.3 File Upload Service

A Ballerina GraphQL service can have `remote` methods that lets clients upload files. To upload a file, the [`graphql:Upload`](#1042-the-graphqlupload-type) type can be used as an input of the `remote` method.

##### 10.4.3.1 File Upload Resolver

Uploading a file is considered a `Mutation` operation in GraphQL. Therefore, only `remote` methods can be used for uploading files.

###### Example: File Upload Resolver

```ballerina
service on new graphql:Listener(9090) {
    remote function fileUpload(graphql:Upload fileUpload) returns boolean {
        string fileName = fileUpload.fileName;
        string mimeType = fileUpload.mimeType;
        string encoding = fileUpload.encoding;
        stream<byte[], io:Error?> byteStream = fileUpload.byteStream;

        // ...
    }
}
```

###### Example: Multiple File Upload Resolver

```ballerina
service on new graphql:Listener(9090) {
    remote function fileUpload(graphql:Upload[] fileUploads) returns boolean {
        foreach graphql:Upload fileUpload in fileUploads {
            string fileName = fileUpload.fileName;
            string mimeType = fileUpload.mimeType;
            string encoding = fileUpload.encoding;
            stream<byte[], io:Error?> byteStream = fileUpload.byteStream;

            // ...
        }
    }
}
```

### 10.5. Federation

#### 10.5.1 Federated Subgraph

The Ballerina GraphQL module provides the capability to expose a `graphql:Service` as a [federation2 subgraph](https://www.apollographql.com/docs/federation/subgraph-spec). To convert a Ballerina GraphQL service into a federation2 subgraph, the `graphql.subgraph` submodule must be imported.

```ballerina
import ballerina/graphql.subgraph;
```

>**Note:** The current implementation of the subgraph only supports dynamic schema composition through introspection.

##### 10.5.1.1 The `@subgraph:Subgraph` Annotation

To make a Ballerina GraphQL service a federation2 subgraph, it should be annotated with `@subgraph:Subgraph`. This annotation adds all the subgraph schema additions to the GraphQL schema as described in the [subgraph specification](https://www.apollographql.com/docs/federation/subgraph-spec/#subgraph-schema-additions). Moreover, this annotation automatically adds resolvers for the `_entities` and `_service` root Query fields.

###### Example: Federated Subgraph

```ballerina
@subgraph:Subgraph
service on new graphql:Listener(9090) {
    // ...
}
```

##### 10.5.1.2 The `@subgraph:Entity` Annotation

In a federated graph, an entity is an object type that can resolve its fields across multiple subgraphs. Each subgraph can contribute different fields to the entity and is responsible for resolving only the fields that it contributes. The `@subgraph:Entity` designates an object type as an entity in Ballerina. The following type definition describes the shape of the `@subgraph:Entity` annotation.

```ballerina
# Describes the shape of the `subgraph:Entity` annotation
# + key - GraphQL fields and subfields that contribute to the entity's primary key/keys
# + resolveReference - Function pointer to resolve the entity
public type FederatedEntity record {|
    string|string[] key;
    ReferenceResolver? resolveReference;
|};

# The annotation to designate a GraphQL object type as a federated entity.
public annotation FederatedEntity Entity on class, type;
```

To fully define an entity within a Ballerina GraphQL subgraph, you must:

1. Assign the `@subgraph:Entity` annotation to an object type.
2. Define the `key` field of the annotation to be the fields and subfields that contribute to the entity's primary key/keys.
3. Define the `resolveReference` field of the annotation to be a function pointer to resolve the entity. If this field is set to `nil`, it indicates to the graph router that this subgraph does not define a reference resolver for this entity. For more details, see [ReferenceResolver](#10513-the-subgraphreferenceresolver-function-type).

###### Example: Federated Entity Definition and Corresponding GraphQL Schema

<table>
  <tr>
    <th>Example</th>
        <th>Ballerina definition</th>
        <th>GraphQL schema</th>
  </tr>
  <tr>
    <td>Simple key</td>
    <td>
    <pre lang='ballerina'>

```ballerina
@subgraph:Entity {
    key: "id",
    resolveReference: resolveProduct
}
type Product record {
    string id;
    string name;
    int price;
};
```
</pre>
    </td>
    <td>
<pre lang='graphql'>

```graphql
type Product @key(fields: "id") {
    id: String!
    name: String!
    price: Int!
}
```
</pre>
    </td>
  </tr>
  <tr>
    <td>Multiple keys</td>
    <td>
    <pre lang='ballerina'>

```ballerina
@subgraph:Entity {
    key: ["id", "sku"],
    resolveReference: resolveProduct
}
type Product record {
    string id;
    string sku;
    string name;
    int price;
};
```
</pre>
    </td>
    <td>
    <pre lang='graphql'>

```graphql
type Product @key(fields: "id") @key(fields: "sku") {
    id: String!
    sku: String!
    name: String!
    price: Int!
}
```
</pre>
    </td>
  </tr>
  <tr>
    <td>Compound key</td>
    <td>
    <pre lang='ballerina'>

```ballerina
@subgraph:Entity {
    key: "id organization { id }",
    resolveReference: resolveUser
}
type User record {
    string id;
    Organization organization;
}
```
</pre>
    </td>
    <td>
    <pre lang='graphql'>

```graphql
type User @key(fields: "id organization { id }") {
    id: String!
    organization: Organization!
}
```
</pre>
    </td>
  </tr>
  <tr>
    <td>Non resolvable</td>
    <td>
    <pre lang='ballerina'>

```ballerina
@subgraph:Entity {
    key: "id"
    resolveReference: ()
}
type Product record {
  id: String!
}
```
</pre>
    </td>
    <td>
    <pre lang='graphql'>

```graphql
type Product @key(fields: "id", resolvable: false) {
    id: ID!
}
```
</pre>
    </td>
  </tr>
</table>

##### 10.5.1.3 The `subgraph:ReferenceResolver` Function Type

Reference resolver is a function that resolves an entity of a specific type using its primary key. When the router requires a particular entity to be resolved, it invokes the corresponding entity's reference resolver. Following is the type definition of a reference resolver defined in `graphql.subgraph` module.

```ballerina
public type ReferenceResolver function (subgraph:Representation representation) returns record {}|service object {}|error?;
```
Here, `subgraph:Representation` is a type definition of the entity representation outlined in the federation specification, which includes the GraphQL `__typename` field of the entity being resolved and its primary key.

###### Example: A Product Entity Defined with Its Resolver

```ballerina
function resolveProduct(subgraph:Representation representation) returns Product|error? {
    string id = check representation["id"].ensureType(); // obtain the primary key of the entity
    return findProduct(id);
}

@subgraph:Entity {
    key: "id", // primary key of the entity
    resolveReference: resolveProduct
}
type Product record {
    string id;
    string name;
    int price;
};
```

>**Note:** If the reference resolver returns an entity of a different type than the entity being resolved, a runtime error will be returned to the router. For example, if the resolver returns a `User` for a `Product` entity, a runtime error will occur.
