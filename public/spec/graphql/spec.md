# Specification: Ballerina GraphQL Library

_Owners_: @shafreenAnfar @DimuthuMadushan @ThisaruGuruge  
_Reviewers_: @shafreenAnfar @DimuthuMadushan @ldclakmal  
_Created_: 2022/01/06  
_Updated_: 2022/07/18  
_Edition_: Swan Lake  

## Introduction

This is the specification for the GraphQL standard library of [Ballerina language](https://ballerina.io), which provides GraphQL server functionalities to produce GraphQL APIs.

The GraphQL library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Slack channel](https://ballerina.io/community/). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` on GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Components](#2-components)
    * 2.1 [Listener](#21-listener)
        * 2.1.1 [Initializing the Listener Using Port Number](#211-initializing-the-listener-using-port-number)
        * 2.1.2 [Initializing the Listener using an HTTP Listener](#212-initializing-the-listener-using-an-http-listener)
    * 2.2 [Service](#22-service)
        * 2.2.1 [Service Type](#221-service-type)
        * 2.2.2 [Service Base Path](#222-service-base-path)
        * 2.2.3 [Service Declaration](#223-service-declaration)
        * 2.2.4 [Service Class Declaration](#224-service-class-declaration)
        * 2.2.5 [Service Constructor Expression](#225-service-constructor-expression)
    * 2.3 [Parser](#23-parser)
    * 2.4 [Engine](#24-engine)
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
    * 4.2 [Objects](#42-objects)
        * 4.2.1 [Record Type as Object](#421-record-type-as-object)
        * 4.2.2 [Service Type as Object](#422-service-type-as-object)
    * 4.3 [Unions](#43-unions)
    * 4.4 [Enums](#44-enums)
    * 4.5 [Input Objects](#45-input-objects)
    * 4.6 [Interfaces](#46-interfaces)
5. [Directives](#5-directives)
   * 5.1 [@skip](#51-skip)
   * 5.2 [@include](#52-include)
   * 5.3 [@deprecated](#53-deprecated)
6. [File Upload](#6-file-upload)
    * 6.1 [File Upload Endpoint](#61-file-upload-endpoint)
        * 6.1.1 [`graphql:Upload` Type](#611-graphqlupload-type)
            * 6.1.1.1 [`fileName` Field](#6111-filename-field)
            * 6.1.1.2 [`mimeType` Field](#6112-mimetype-field)
            * 6.1.1.3 [`encoding` Field](#6113-encoding-field)
            * 6.1.1.4 [`byteStream` Field](#6114-bytestream-field)
        * 6.1.2 [Writing a File Upload Resolver](#612-writing-a-file-upload-resolver)
7. [Errors](#7-errors)
    * 7.1 [Error Fields](#71-error-fields)
        * 7.1.1 [Message](#711-message)
        * 7.1.2 [Locations](#712-locations)
        * 7.1.3 [Path](#713-path)
8. [Context](#8-context)
    * 8.1 [Set Attribute in Context](#81-set-attribute-in-context)
    * 8.2 [Get Context Attribute](#82-get-context-attribute)
    * 8.3 [Remove Attribute from Context](#83-remove-attribute-from-context)
    * 8.4 [Accessing the Context](#84-accessing-the-context)
    * 8.5 [Invoking Next Interceptor](#85-invoking-next-interceptor)
9. [Annotations](#9-annotations)
    * 9.1 [Service Configuration](#91-service-configuration)
        * 9.1.1 [Max Query Depth](#911-max-query-depth)
        * 9.1.2 [Auth Configurations](#912-auth-configurations)
        * 9.1.3 [Context Initializer Function](#913-context-initializer-function)
        * 9.1.4 [CORS Configurations](#914-cors-configurations)
        * 9.1.5 [GraphiQL Configurations](#915-graphiql-configurations)
        * 9.1.6 [Service Level Interceptors](#916-service-level-interceptors)
10. [Interceptors](#10-interceptors)
    * 10.1 [Interceptor Service Object](#101-interceptor-service-object)
    * 10.2 [GraphQL Field Object](#102-graphql-field-object)
    * 10.3 [Writing an Interceptor](#103-writing-an-interceptor)
    * 10.4 [Execution](#104-execution)
        * 10.4.1 [Service Level Interceptors](#1041-service-level-intercptors)
11. [Security](#11-security)
    * 11.1 [Authentication and Authorization](#111-authentication-and-authorization)
        * 11.1.1 [Declarative Approach](#1111-declarative-approach)
            * 11.1.1.1 [Basic Auth - File User Store](#11111-basic-auth---file-user-store)
            * 11.1.1.2 [Basic Auth - LDAP User Store](#11112-basic-auth---ldap-user-store)
            * 11.1.1.3 [JWT Auth](#11113-jwt-auth)
            * 11.1.1.4 [OAuth2](#11114-oauth2)
        * 11.1.2 [Imperative Approach](#1112-imperative-approach)
            * 11.1.2.1 [Basic Auth - File User Store](#11121-basic-auth---file-user-store)
            * 11.1.2.2 [Basic Auth - LDAP User Store](#11122-basic-auth---ldap-user-store)
            * 11.1.2.3 [JWT Auth](#11123-jwt-auth)
            * 11.1.2.4 [OAuth2](#11124-oauth2)
    * 11.2 [SSL/TLS and Mutual SSL](#112-ssltls-and-mutual-ssl)
        * 11.2.1 [SSL/TLS](#1121-ssltls)
        * 11.2.2 [Mutual SSL](#1122-mutual-ssl)
12. [Tools](#11-tools)
    * 12.1 [GraphiQL Client](#121-graphiql-client)

## 1. Overview

The Ballerina language provides first-class support for writing network-oriented programs. The GraphQL standard library uses these language constructs and creates the programming model to produce GraphQL APIs.

The GraphQL standard library is designed to work with [GraphQL specification](https://spec.graphql.org). There are two main approaches when writing GraphQL APIs. The schema-first approach and the code-first approach. The Ballerina GraphQL standard library uses the code-first first approach to write GraphQL APIs. This means no GraphQL schema is required to create a GraphQL service.

In addition to functional requirements, this library deals with none functional requirements such as security and resiliency. Each requirement is discussed in detail in the coming sections.

## 2. Components

This section describes the components of the Ballerina GraphQL package. To use the Ballerina GraphQL package, a user must import the Ballerina GraphQL package first.

###### Example: Importing the GraphQL Package

```ballerina
import ballerina/graphql;
```

### 2.1 Listener

Since the GraphQL spec does not mandate an underlying client-server protocol, a GraphQL implementation can use any protocol underneath. The Ballerina GraphQL package, like most of the other implementations, uses HTTP as the protocol. The Ballerina GraphQL listener is using an HTTP listener to listen to incoming requests through HTTP.

A Ballerina GraphQL listener can be declared as described below, honoring the Ballerina generic [listener declaration](https://ballerina.io/spec/lang/2021R1/#section_9.2.1).

#### 2.1.1 Initializing the Listener Using Port Number
If a GraphQL listener requires to be listening to a port number, that port number must be provided as the first parameter of the listener constructor.

###### Example: Initializing the Listener Using Port Number
```ballerina
listener graphql:Listener graphqlListener = new (4000);
```

#### 2.1.2 Initializing the Listener using an HTTP Listener
If a GraphQL listener requires to listen to the same port as an existing [`http:Listener`](https://github.com/ballerina-platform/module-ballerina-http/blob/master/docs/spec/spec.md/#21-listener) object, that `http:Listener` object must be provided as the first parameter of the listener constructor.

###### Example: Initializing the Listener using an HTTP Listener
```ballerina
listener http:Listener httpListener = new (4000);
listener graphql:Listener graphqlListener = new (httpListener);
```

### 2.2 Service

The `service` represents the GraphQL schema in the Ballerina GraphQL package. When a service is attached to a GraphQL listener, it is considered a GraphQL service. When a service is identified as a GraphQL service, it will be used to [Generate the Schema](#3-schema-generation). Attaching the same service to multiple listeners is not allowed, and will cause a compilation error.

###### Example: Service

```ballerina
service /graphql on new graphql:Listener(4000) {

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
service hello\-graphql on new graphql:Listener(4000) {

}
```

#### 2.2.3 Service Declaration

The [service declaration](https://ballerina.io/spec/lang/2021R1/#section_9.2.2) is syntactic sugar for creating a service. This is the mostly-used approach for creating a service.

###### Example: Service Declaration

```ballerina
service graphql:Service /graphql on new graphql:Listener(4000) {

}
```

#### 2.2.4 Service Class Declaration

A service value can be instantiated using the service class. This approach provides full control of the service life cycle to the user. The listener life cycle methods can be used to handle this.

###### Example: Service Class Declaration

```ballerina
service class GraphqlService {
    *graphql:Service;

    resource function get greeting() returns string {
        return "Hello, world!";
    }
}

public function main() returns error? {
    graphql:Listener graphqlListener = check new (4000);
    graphql:Service graphqlService = new;

    error? attachResult = graphqlListener.attach(graphqlService, ["graphql"]);
    error? startResult = graphqlListener.'start();
    runtime:registerListener(graphqlListener);
}
```

#### 2.2.5 Service Constructor Expression

This is similar to the [service class declaration](#224-service-class-declaration), but instead of defining a type, the service constructor can be used to declare the service.

###### Example: Service Constructor Expression

```ballerina
listener graphql:Listener graphqlListener = new (4000);

graphql:Service graphqlService = @graphql:ServiceConfig {} service object {
    resource function get greeting() returns string {
        return "Hello, world!";
    }
}
```

### 2.3 Parser
The Ballerina GraphQL parser is responsible for parsing the incoming GraphQL documents. This will parse each document and then report any errors. If the document is valid, it will return a syntax tree.

> **Note:** The Ballerina GraphQL parser is implemented as a separate module and is not exposed outside the Ballerina GraphQL package.

### 2.4 Engine

The GraphQL engine acts as the main processing unit in the Ballerina GraphQL package. It connects all the other components in the Ballerina GraphQL package together.

When a request is received to the GraphQL Listener, it dispatches the request to the GraphQL engine, where it extracts the document from the request, then passes it to the parser. Then the parser will parse the document and return an error (if there is any) or the syntax tree to the engine. Then the engine will validate the document against the generated schema, and then if the document is valid, the engine will execute the document.

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
service on new graphql:Listener(4000) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

> **Note:** Since the `Query` type must be defined in a GraphQL schema, a Ballerina GraphQL service must have at least one resource method with the `get` accessor. Otherwise, the service will cause a compilation error.

#### 3.1.2 The `Mutation` Type

The `Mutation` type in a GraphQL schema is used to mutate the data. In Ballerina, each `remote` method inside the GraphQL service is mapped to a field in the root `Mutation` type. If no `remote` method is defined in the service, the generated schema will not have a `Mutation` type.

###### Example: Adding a Field to the `Mutation` Type

```ballerina
service on new graphql:Listener(4000) {
    remote function setName(string name) returns string {
        //...
    }
}
```

As per the [GraphQL specification](https://spec.graphql.org/June2018/#sec-Mutation), the `Mutation` type is expected to perform side-effects on the underlying data system. Therefore, the mutation operations should be executed serially. This is ensured in the Ballerina GraphQL package. Each remote method invocation in a request is done serially, unlike the resource method invocations, which are executed parallelly.

#### 3.1.3 The `Subscription` Type

The `Subscription` type in a GraphQL schema is used to continuously fetch data from a GraphQL service. In Ballerina, the service itself is the schema, and each `resource` method with the `subscribe` accessor inside a GraphQL service is mapped to a field in the root `Subscription` type.

###### Example: Adding a Field to the `Subscription` Type

```ballerina
service on new graphql:Listener(4000) {
    resource function subscribe greeting() returns stream<stream> {
        return ["Walter", "Skyler", "Walter Jr.", "Holly"].toStream();
    }
}
```

> **Note:**: A resource method with `subscribe` accessor must return a Ballerina `stream` type.

### 3.2 Wrapping Types

Wrapping types are used to wrap the named types in GraphQL. A wrapping type has an underlying named type. There are two wrapping types defined in the GraphQL schema.

#### 3.2.1 `NON_NULL` Type

`NON_NULL` type is a wrapper type to denote that the resulting value will never be `null`. Ballerina types do not implicitly allow `nil`. Therefore, each type is inherently a `NON_NULL` type until specified explicitly otherwise. If a type is meant to be a nullable value, it should be unionized with `nil`.

> **Note:** `nil` (represented by `()`) is the Ballerina's version of `null`.

In the following example, the type of the `name` field is `String!`, which means a `NON_NULL`, `String` type.

###### Example: NON_NULL Type
```ballerina
service on new graphql:Listener(4000) {
    resource function get name returns string {
        return "Walter White";
    }
}
```

To make it a nullable type, it should be unionized with `?`. The following example shows the field `name` of the type `String`.

###### Example: Nullable Type
```ballerina
service on new graphql:Listener(4000) {
    resource function get name returns string? {
        return "Walter White";
    }
}
```

> **Note:** `?` is syntactic sugar for `|()`.

#### 3.2.2 `LIST` Type

The list type represents a list of values of another type. Therefore, `LIST` is considered a wrapping type. In Ballerina, a `LIST` type is defined using an array. The following represents a field called `names` of the type of `LIST` of `String!` type.

###### Example: LIST Type
```ballerina
service on new graphql:Listener(4000) {
    resource function get names() returns string[] {
        return ["Walter White", "Jesse Pinkman"];
    }
}
```

### 3.3 Resource Methods

Resource methods are a special kind of method in Ballerina. In the Ballerina GraphQL package, `resource` methods are used to define GraphQL object fields. The `resource` methods in a GraphQL service are validated at the compile-time.

#### 3.3.1 Resource Accessor

The only allowed accessors in Ballerina GraphQL resource are `get` and `subscribe`. Any other accessor usage will result in a compilation error.

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
service graphql:Service on new graphql:Listener(4000) {
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

The above example shows how to use hierarchical resource paths to create a hierarchical data model. When the schema is generated using this service, the root `Query` operation has a single field, `profile`, as it is the only path segment at the top level. The type of this field is also `profile`, which is an `Object` type. This object type has three fields: `address`, `name`, and `age`. The type of the `address` field is also `Object` as it is an intermediate path segment (i.e. has child path segments). The name of this object type is `address`. It has three fields: the `number` (type `Int!`), the `street` (type `String!`), and the `city` (type `String!`). The `name` field is of type `String!`, and the `age` field is of type `Int!`. Check [Types Section](#4-types) for more information on types and fields.

### 3.4 Remote Methods

The `remote` methods are used to define the fields of the `Mutation` type in a GraphQL schema. Remote methods are validated at the compile-time.

> **Note:** The `resource` and `remote` methods are called __*resolver functions*__ in GraphQL terminology. Therefore, in this spec, sometimes the term __*resolver function*__ is used to refer `resource` and `remote` methods.

#### 3.4.1 Remote Method Name

The name of the `remote` method is the name of the corresponding GraphQL field in the `Mutation` type.

### 3.5 Documentation

A GraphQL schema can have documentation for the types, fields, enums, schema, etc.

In Ballerina, the Ballerina doc comments can be used to add documentation for the generated schema. Each comment belong to a field, argument, or an enum will be applied to the particular GraphQL schema member.

###### Example: Documentation

```ballerina
# Service to query people database.
service on new graphql:Listener(9090) {

    # Returns a person with the given ID.
    #
    # + id - The ID of the person
    # + return - The person with the given ID
    resource function get person(int id) returns Person {
        // ...
    }

    # Represents a person.
    #
    # + id - The ID of the person
    # + name - The name of the person
    # + age - The age of the person
    public type Person record {
        int id;
        string name;
        int age;
    };
}
```

This will generate the documentation for all the fields of the `Query` type including the field descriptions of the `Person` type.

**Note:** When a field or an argument name contains unicode characters or any other escape characters, they are unescaped when generating the schema.   

###### Example: Escaping Characters
```ballerina
service on new graphql:Listener(4000) {
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

> **Note:** When used as an input value type, both integer and float values are accepted as valid inputs.

#### 4.1.3 String
The `String` type is represented using the `string` type in Ballerina. It can represent Unicode values.

#### 4.1.4 Boolean
The `Boolean` type is represented using the `boolean` type in Ballerina.

Apart from the above types, the `decimal` type can also be used inside a GraphQL service, which will create the `Decimal` scalar type in the corresponding GraphQL schema.

### 4.2 Objects

Objects represent the intermediate levels of the type hierarchy. Objects can have a list of named fields, each of which has a specific type.

In Ballerina, a GraphQL object type can be represented using either a service type or a record type.

#### 4.2.1 Record Type as Object

A Ballerina record type can be used as an Object type in GraphQL. Each record field is mapped to a field in the GraphQL object and the type of the record field will be mapped to the type of the corresponding GraphQL field.

###### Example: Record Type as Object
```ballerina
service on new graphql:Listener(4000) {
    resource function get profile() returns Person {
        return {name: "Walter White", age: 52};
    }
}

type Person record {
    string name;
    int age;
};
```

**Note:** Even though anonymous record types are supported in Ballerina, they cannot be used as types in a GraphQL schema. This is because a type in a GraphQL schema must have a name. Therefore, if an anonymous record is used in a GraphQL service, it will result in a compilation error.

#### 4.2.2 Service Type as Object

A Ballerina service type can be used as an `Object` type in GraphQL. Similar to the `Query` type, each resource method inside a service type represents a field of the object.

Since GraphQL only allows mutations at the top level and the `remote` methods are used to represent the `Mutation` type, any service type used to represent a GraphQL `Object` cannot have `remote` methods inside them.

> **Note:** As per the GraphQL spec, only the root type can have `Mutation`s. Therefore, defining `remote` methods inside subsequent object types does not make any sense.

The `resource` methods in these service types can have input parameters. These input parameters are mapped to arguments in the corresponding field.

> **Note:** The service types representing an `Object` can be either `distinct` or non-distinct type. But if a service type is used as a member of a `Union` type, they must be `distinct` service classes.

###### Example: Service Type as Object

```ballerina
service on new graphql:Listener(4000) {
    resource function get profile() returns Person {
        return new ("Walter White", 52);
    }
}

service class Person {
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
> **Note:** Although both the record and service type can be used to represent the `Object` type, using record type as `Object` has limitations. For example, a field represented as a record field can not have an input argument, as opposed to a field represented using a `resource` method in a service class.

### 4.3 Unions

GraphQL `Union` type represent an object that could be one of a list of GraphQL `Object` types but provides no guarantee for common fields in the member types. Ballerina has first-class support for union types. The Ballerina GraphQL package uses this feature to define `Union` types in a schema.

> **Note:** Only `distinct` service types are supported as members of a union type in the Ballerina GraphQL package. If one or more members in a union type do not follow this rule, a compilation error will be thrown.

###### Example: Union Types
In the following example, two `distinct` service types are defined first, `Teacher` and `Student`. Then a `Union` type is defined using Ballerina syntax for defining union types. The resource function in the GraphQL service is returning the union type.

```ballerina
service on new graphql:Listener(4000) {
    resource function get profile() returns Person {
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

type Person Teacher|Student; // Defining the union type
```

### 4.4 Enums

In GraphQL, the `Enum` type represents leaf values in the GraphQL schema, similar to the `Scalar` types. But the `Enum` types describe the set of possible values. In Ballerina, the `enum` type is used to define the `Enum` type in GraphQL.

###### Example: Enums

```ballerina
service on new graphql:Listener(4000) {
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

### 4.5 Input Objects

In GraphQL, a field can have zero or more input arguments. These arguments can be either `Scalar` type, `Enum` type, or `Object` type. Although `Scalar` and `enum` types can be used as input and output types without a limitation, an object type can not be used as an input type and an output type. Therefore, separate kinds of objects are used to define input objects.

In Ballerina, a `record` type can be used as an input object. When a `record` type is used as the type of the input argument of a `resource` or `remote` method in a GraphQL service (or in a `resource` function in a `service` type returned from the GraphQL service), it is mapped to an `INPUT_OBJECT` type in GraphQL.

> **Note:** Since GraphQL schema can not use the same type as an input and an output type when a record type is used as an input and an output, a compilation error will be thrown.

###### Example: Input Objects

```ballerina
service on new graphql:Listener(4000) {
    resource function get author(Book book) returns string {
        return book.author;
    }
}

type Book record {
    string title;
    string author;
};
```

### 4.6 Interfaces

In GraphQL, an interface can be used to define a set of common fields for objects. Then the `Object` types can implement the interface with the common fields and optionally, additional fields.

In Ballerina, `distinct` `service` classes can be used to define GraphQL interfaces. Then other `distinct` `service` classes can be used to implement the interface. All the service classes that are implementing the interface must contain the same resource methods, and they can define additional resource methods.

###### Example: Interfaces
```ballerina
public isolated distinct service class Person {
    final string name;

    isolated function init(string name) {
        self.name = name;
    }

    isolated resource function get name() returns string {
        return self.name;
    }
}

# Represents a Student as a class.
public isolated distinct service class Student {
    *Person;
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
    *Person;
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

In the above example, the `Human` class is an interface. The `Student` and `Teacher` classes are `Object` types that implement the `Human` interface.

## 5. Directives

Ballerina GraphQL services support three default directives.

### 5.1 @skip

The `@skip` directive is used to skip a field execution depending on a given condition. It can be used on a field, fragment spread, or on an inline fragment. The directive expects exactly one argument `if`, which is of type `Boolean!`.

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

The `@include` directive is used to include a field execution depending on a given condition. It can be used on a field, fragment spread, or on an inline fragment. The directive expects exactly one argument `if`, which is of type `Boolean!`.

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

> **Note:** Neither the `@skip` nor the `@include` has precedence over the other. In the case that both the `@skip` and `@include` directives are provided on the same field or fragment, it will be queried only if the `@skip` condition is `false` and the `@include` condition is `true`. Stated conversely, the field or fragment will not be queried if either the `@skip` condition is `true` or the `@include` condition is `false`.

### 5.3 Deprecated

The `@deprecated` directive is used to indicate a deprecated field on a type or a deprecated enum value. Deprecation can use a deprecation reason as a string, which is formatted using Markdown syntax.

The `@deprecated` directive has one argument, `reason`, which is of type `String`.

The Ballerina GraphQL package uses the Ballerina's in-built `@deprecated` annotation to deprecate a field (resource/remote functions) or an enum value. The deprecation reason can be provided as a part of the doc comment of the particular schema member.

###### Example: @deprecated

The following code shows how to mark a field and an enum value as deprecated with the deprecation reason.

```ballerina
import ballerina/graphql;

service on new graphql:Listener(4000) {

    # Greets back with a customized greeting with the provided name.
    # + name - The name of the person to greet
    # + return - The customized greeting message
    # # Deprecated
    # The `hello` field is deprecated. Use the `greeting` field instead of this.
    @deprecated
    resource function get hello(string name) returns string {
        return "Hello, " + name;
    }

    # Greets back with a customized greeting with the provided name.
    # + name - The name of the person to greet
    # + return - The customized greeting message
    resource function get greeting(string name = "Stranger") returns string {
        return "Hello, " + name;
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
```

In the above service, the generated schema will indicate that the `hello` field of the `Query` type and the `PRIVATE_PARTY` value of the `Status` enum type are deprecated, with the reasons provided in the doc comments. (The reason will be the line after the `# # Deprecated` line.)

## 6. File Upload

A Ballerina GraphQL service can be used to upload files. This section describes how the file uploading in Ballerina GraphQL works.

### 6.1 File Upload Endpoint

A Ballerina GraphQL service can have a field inside the `Mutation` type to handle file uploads. To upload a file, the `graphql:Upload` type can be used as an input.

#### 6.1.1 `graphql:Upload` Type

The `graphql:Upload` type is a record type that consists of the following fields.

##### 6.1.1.1 `fileName` Field

This field contains the name of the file that is being uploaded. The type of the field is `string`.

##### 6.1.1.2 `mimeType` Field

This field contains the mime type of the file being uploaded. The type of the field is `string`.

##### 6.1.1.3 `encoding` Field

This field contains the encoding used to serialize the file. The type of the field is `string`.

##### 6.1.1.4 `byteStream` Field

This field contains the serialized byte stream for the uploaded file. The type of the field is `stream<byte[], io:Error?>`.

##### 6.1.2 Writing a File Upload Resolver

Uploading a file is considered a mutation operation. Therefore, `remote` methods are used to implement file upload.

###### Example: File Upload Resolver

```ballerina
service on new graphql:Listener(4000) {
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
service on new graphql:Listener(4000) {
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


### 6.2 Sending a File Upload Request

To upload a file, the GraphQL endpoint requires a multipart request. The multipart request follows the [GraphQL Multipart Form Request Specification](https://github.com/jaydenseric/graphql-multipart-request-spec).

Following are the required, ordered fields that must be present in a multipart request to upload a file to a Ballerina GraphQL API.

#### 6.2.1 `Operations` Field

This field contains the `JSON-encoded` body of standard GraphQL POST requests where all the variable values storing files must be `null`.

#### 6.2.2 `Map` Field

This field contains the `JSON-encoded` map of the path(s) of where the file(s) occurred in the operations.

#### 6.2.3 File Fields

Each file extracted from the `operations` object with a unique name must be added as a field.

###### Example: Single File Upload Request

```shell
curl http://sample.com \
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

## 7. Errors

A Ballerina `resource` or `remote` method representing an object field can return an error. When an error is returned, it will be added to the `errors` field in the GraphQL response according to the [GraphQL spec](https://spec.graphql.org/June2018/#sec-Errors).

> **Note:** Even if a `resource` or `remote` method signature does not have `error` or any subtype of the `error` type, if the execution results in an `error`, the resulting response will have an error.

###### Example: Returning Errors
```ballerina
service on new graphql:Listener(4000) {
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

### 7.1 Error Fields

As per the GraphQL specification, an error will contain the following fields.

#### 7.1.1 Message

The `message` field contains the error message from the Ballerina error, which can be accessed using the `.message()` method in Ballerina.

#### 7.1.2 Locations

The `locations` field contains the locations of the GraphQL document associated with the error. There can be cases where more than one location can cause the error, therefore, this field is an array of locations. There are also cases where a location can not be associated with an error, therefore, this field is optional.

#### 7.1.3 Path

The `path` field is an array of `Int` and `String`, that points to a particular path of the document tree associated with the error. This field will have a value only when a particular error has occurred at the execution phase. Therefore, this field is optional.


## 8. Context

The `graphql:Context` object is used to pass meta-information among the graphql resolver functions. It will be created per each request.

Attributes can be stored in the `graphql:Context` object using key-value pairs.

### 8.1 Set Attribute in Context

To set an attribute in the `graphql:Context` object, the `set()` method can be used. It requires two parameters.

- `key`: The key of the attribute. This key can be used to retrieve the attribute back when needed. The `key` must be a `string`.
- `value`: The value of the attribute. The type of this parameter is `value:Cloneable|isolated object {}`. This means the values can be any immutable type, `readonly` value, or an isolated object.

###### Example: Set Attribute in Context

```ballerina
graphql:Context context = new;

context.set("key", "value");
```

> **Note:** If the provided key already exists in the context, the value will be replaced.

### 8.2 Get Context Attribute

To get an attribute from the `graphql:Context` object, the `get()` method can be used. It requires one parameter.

- `key`: This is the key of the attribute that needs to be retrieved.

If the key does not exist in the context, the `get` method will return a `graphql:Error`.

###### Example: Get Context Attribute

```ballerina
value:Cloneable|isolated object {}|graphql:Error attribute = context.get("key");
```

### 8.3 Remove Attribute from Context

To remove an attribute from the `graphql:Context` object, the `remove` method can be used. It requires one parameter.

- `key`: This is the key of the attribute that needs to be removed.

If the key does not exist in the context, the `remove` method will return a `graphql:Error`.

###### Example: Remove Context Attribute

```ballerina
graphql:Error? result = context.remove("key");
```

> **Note:** Even though the functionalities are provided to update/remove attributes in the context, it is discouraged to do such operations. The reason is that destructive modifications may cause issues in parallel executions of the Query operations.

### 8.4 Accessing the Context

The `graphql:Context` can be accessed inside any resolver function. When needed, the `graphql:Context` must be the _first parameter_ of the method.

###### Example: Accessing the Context

```ballerina
service on new graphql:Listener(4000) {
    resource function get profile(graphql:Context context) returns Person|error {
        value:Cloneable|isolated object {} attribute = check context.get("key");
        // ...
    }
}

type Person record {
    string name;
    int age;
};
```

> **Note:** The parameter `graphql:Context` should be used only when it is required to use the context.

###### Example: Accessing the Context from an Object

The following example shows how to access the context from an Object. When a Ballerina service type is used as an `Object` type in GraphQL, the resource functions in the service can also access the context when needed.

```ballerina
service on new graphql:Listener(4000) {
    resource function get profile() returns Person {
    }
}

service class Person {
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

### 8.5 Resolving Field Value

To resolve the value of a field, the `resolve()` method can be used. This requires the `graphql:Field` object which is related to the particular field that is going to be resolved. If the resolver has interceptors attached, the interceptors will be executed until there are no more interceptors left.

```ballerina
public isolated function resolve(graphql:Field ‘field) returns anydata;
```

## 9. Annotations

### 9.1 Service Configuration

The configurations stated in the `graphql:ServiceConfig`, are used to change the behavior of a particular GraphQL service. These configurations are applied to the service.

This annotation consists of four fields.

#### 9.1.1 Max Query Depth

The `maxQueryDepth` field is used to provide a limit on the depth of an incoming request. When this is set, every incoming request is validated by checking the depth of the query. This includes the depths of the spread fragments. If a particular GraphQL document exceeds the maximum query depth, the request is invalidated and the server will respond with an error.

###### Example: Setting Max Query Depth

```ballerina
@graphql:ServiceConfig {
    maxQueryDepth: 3
}
service on new graphql:Listener(4000) {

}
```

In the above example, when a document has a depth of more than 3, the request will be failed.


###### Example: Invalid Document with Exceeding Max Query Depth

```graphql
{
    profile {
        friend {
            friend {
                name // Depth is 4
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

#### 9.1.2 Auth Configurations

The `auth` field is used to provide configurations related to authentication and authorization for the GraphQL API. The [Security](#8-security) section will explain this configuration in detail.


#### 9.1.3 Context Initializer Function

The `contextInit` field is used to provide a method to initialize the [`graphql:Context` object](#7-context). It is called per each request to create a `graphql:Context` object.

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
service on new graphql:Listener(4000) {
    // ...
}
```

> **Note:** The init function has `http:RequestContext` and `http:Request` objects as inputs. These objects are passed into the function when a request is received. The HTTP headers and the request context can be used to perform additional validations to a request before proceeding to the GraphQL validations. This can be useful to validate the HTTP request before performing the GraphQL operations. The [Imperative Approach in Security](#912-imperative-approach) section will discuss this in detail.

#### 9.1.4 CORS Configurations

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
service on new graphql:Listener(4000) {
    // ...
}
```

#### 9.1.5 GraphiQL Configurations

The `graphiql` field is used to provide the GraphiQL client configuration to enable the GraphiQL client for a given GraphQL service.

###### Example: GraphiQL Configurations

```ballerina
@graphql:ServiceConfig {
    graphiql: {
        enable: true,
        path: "/ballerina/graphiql"
    }
}
service on new graphql:Listener(4000) {
    // ...
}
```
> **Note:** The field enable accepts a `boolean` that denotes whether the client is enabled or not. By default, it has been set to `false`. The optional field `path` accepts a valid `string` for the GraphiQL service. If the path is not given in the configuration, `/graphiql` is set as the default path.

#### 9.1.6 Service Level Interceptors

The `interceptors` field is used to provide the service level interceptors.

###### Example: Service Level Interceptors

```ballerina
@graphql:ServiceConfig {
    interceptors: [new Interceptor1(), new Interceptor2()]
}
service on new graphql:Listener(4000) {
    // ...
}
```

## 10. Interceptors
The GraphQL interceptors can be used to execute a custom code before and after the resolver function gets invoked.

### 10.1 Interceptor Service Object

The interceptor service object is defined in the Ballerina GraphQL package. It includes a single remote function named execute that accepts `Context` and `Field` as the parameters. The function's return type is a union of `anydata` and `error`.

```ballerina
public type Interceptor distinct service object {
    isolated remote function execute(Context context, Field 'field) returns anydata|error;
};
```

### 10.2 GraphQL Field Object

Interceptor `execute` function accepts the `Field` object as an input parameter that consists of APIs to access the execution field information. Following is the implementation of the Field object.

```ballerina
public class Field {
    public isolated function getName() returns string;

    public isolated function getAlias() returns string;
}
```

* The `getName()` function can be used to get the current execution field name.
* The `getAlias()` function returns an alias if the current execution filed has an alias. If not, it returns the field name.

### 10.3 Writing an Interceptor
Interceptors can be defined as a readonly service class that infers the Interceptor object provided by the GraphQL package. User-specific name can be used as the service class name.

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

The Interceptor service class should have the implementation of the `execute()` remote function that infers from the interceptor service object. Code needed to be included in the interceptor should be kept inside the `execute()` function. Interceptors can not have any other `resource/remote` methods inside the interceptor. However, the users are able to define the usual functions inside the interceptors.

### 10.4 Execution

When it comes to interceptor execution, it follows the `onion principle`. Basically, each interceptor function adds a layer before and after the actual resolver invocation. Therefore, the order of the interceptor array in the configuration will be important. In an Interceptor `execute()` function, all the code lines placed before the `context.resolve()` will be executed before the resolver function execution, and the code lines placed after the `context.resolve()` will be executed after the resolver function execution. The [`context.resolve()`](#85-invoking-next-interceptor) function invoke the next interceptor.

> NOTE: The inserting order of the interceptor function into the array, will be the execution order of Interceptors.

###### Example: GraphQL Interceptor

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

**Output:**
```shell
1. Service Interceptor execution!
3. Resolver: name
5. Connection closed!
```

#### 10.4.1 Service Level Interceptors
The service level interceptors are applied to all the resolver functions in the GraphQL service. The GraphQL module accept an array of service level interceptors, and it should be inserted as mentioned in the [Service Level Interceptor](#916-service-level-interceptors) section.

## 11. Security

### 11.1 Authentication and Authorization

There are two ways to enable authentication and authorization in Ballerina GraphQL.

1. Declarative approach
2. Imperative approach

#### 11.1.1 Declarative Approach

This is also known as the configuration-driven approach, which is used for simple use cases, where users have to provide a set of configurations and do not need to be worried more about how authentication and authorization works. The user does not have full control over the configuration-driven approach.

The service configurations are used to define the authentication and authorization configurations. Users can configure the configurations needed for different authentication schemes and configurations needed for authorizations of each authentication scheme. The configurations can be provided at the service level. The auth handler creation and request authentication/authorization is handled internally without user intervention. The requests that succeeded both authentication and/or authorization phases according to the configurations will be passed to the business logic layer.

##### 11.1.1.1 Basic Auth - File User Store

A GraphQL service can be secured using [Basic Auth with File User Store](https://github.com/ballerina-platform/module-ballerina-auth/blob/master/docs/spec/spec.md#311-file-user-store) and optionally by enforcing authorization.

When configured, it validates the `Authorization` header in the HTTP request that contains the GraphQL document. This reads the data from a `TOML` file, that stores the usernames and passwords for authentication and the scopes for authorization.

###### Example: Declarative Basic Auth with File User Store

```ballerina
@graphql:ServiceConfig {
    auth: [
        {
            fileUserStoreConfig: {},
            scopes: ["admin"]
        }
    ]
}
service on new graphql:Listener(4000) {
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

##### 11.1.1.2 Basic Auth - LDAP User Store

A GraphQL service can be secured using [Basic Auth with LDAP User Store](https://github.com/ballerina-platform/module-ballerina-auth/blob/master/docs/spec/spec.md#312-ldap-user-store) and optionally by enforcing authorization.

When configured, it validates the `Authorization` header in the HTTP request that contains the GraphQL document. This reads the data from the configured LDAP, which stores the usernames and passwords for authentication and the scopes for authorization.

###### Example: Declarative Basic Auth with LDAP User Store

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
            scopes: ["admin"]
        }
    ]
}
service /graphql on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

##### 11.1.1.3 JWT Auth

A GraphQL service can be secured using [JWT Auth](https://github.com/ballerina-platform/module-ballerina-jwt/blob/master/docs/spec/spec.md) and by enforcing authorization optionally.

When configured, it validates the JWT sent in the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Declarative JWT Auth

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
            scopes: ["admin"]
        }
    ]
}
service /graphql on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

##### 11.1.1.4 OAuth2

A GraphQL service can be secured using [OAuth2](https://github.com/ballerina-platform/module-ballerina-oauth2/blob/master/docs/spec/spec.md) and by enforcing authorization optionally.

When configured, it validates the OAuth2 token sent in the `Authorization` header in the HTTP request that contains the GraphQL document. This calls the configured OAuth2 introspection endpoint to validate.

###### Example: Declarative OAuth2

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
            scopes: ["admin"]
        }
    ]
}
service /graphql on securedEP {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
```

#### 11.1.2 Imperative Approach

This is also known as the code-driven approach, which is used for advanced use cases, where users need to be worried more about how authentication and authorization work and need to have further customizations. The user has full control of the code-driven approach. The handler creation and authentication/authorization calls are made by the user at the business logic layer.

The [`graphql:Context`](#7-context) object and the [`contextInit`](#813-context-initializer-function) method can be used to achieve this.

##### 11.1.2.1 Basic Auth - File User Store

A file user store can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative Basic Auth with File User Store

```ballerina
graphql:FileUserStoreConfig config = {};
http:ListenerFileUserStoreBasicAuthHandler handler = new (config);

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

@graphql:ServiceConfig {
    contextInit: contextInit
}
service on new graphql:Listener(4000) {
    resource function get greeting(graphql:Context context) returns string|error {
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
        // ...
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

##### 11.1.2.2 Basic Auth - LDAP User Store

An LDAP user store can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative Basic Auth with LDAP User Store

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
http:ListenerLdapUserStoreBasicAuthHandler handler = new (config);

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

@graphql:ServiceConfig {
    contextInit: contextInit
}
service on new graphql:Listener(4000) {
    resource function get greeting(graphql:Context context) returns string|error {
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
        // ...
    }
}
```

##### 11.1.2.3 JWT Auth

A JWT configuration can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative JWT Auth

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
http:ListenerJwtAuthHandler handler = new (config);

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

@graphql:ServiceConfig {
    contextInit: contextInit
}
service on new graphql:Listener(4000) {
    resource function get greeting(graphql:Context context) returns string|error {
        value:Cloneable|isolated object {} authorization = check context.get("Authorization");
        if authorization !is string {
            return error("Failed to authorize");
        }
        jwt:Payload|http:Unauthorized authn = handler.authenticate(authorization);
        if authn is http:Unauthorized {
            return error("Unauthorized");
        }
        http:Forbidden? authz = handler.authorize(authn, "admin");
        if authz is http:Forbidden {
            return error("Forbidden");
        }
        // ...
    }
}
```

##### 11.1.2.4 OAuth2

An OAuth2 introspection endpoint can be used to validate the `Authorization` header in the HTTP request that contains the GraphQL document.

###### Example: Imperative OAuth2

```ballerina
graphql:OAuth2IntrospectionConfig config = {
    url: "https://localhost:8080/oauth2/introspect",
    tokenTypeHint: "access_token"
};
http:ListenerOAuth2Handler handler = new (config);

isolated function contextInit(http:RequestContext reqCtx, http:Request request) returns graphql:Context|error {
    string authorization = check request.getHeader("Authorization");
    graphql:Context context = new;
    context.set("Authorization", authorization);
    return context;
}

@graphql:ServiceConfig {
    contextInit: contextInit
}
service on new graphql:Listener(4000) {
    resource function get greeting(graphql:Context context) returns string|error {
        value:Cloneable|isolated object {} authorization = check context.get("Authorization");
        if authorization !is string {
            return error("Failed to authorize");
        }
        oauth2:IntrospectionResponse|http:Unauthorized|http:Forbidden auth = handler->authorize(authorization, "admin");
        if auth is http:Unauthorized {
            return error("Unauthorized");
        } else if auth is http:Forbidden {
            return error("Forbidden");
        }
        // ...
    }
}
```

### 11.2 SSL/TLS and Mutual SSL

The GraphQL listener can connect or interact with a secured client. The `graphql:ListenerSecureSocket` configuration of the listener exposes the secure connection-related configurations.

#### 11.2.1 SSL/TLS

The GraphQL listener can connect or interact with an HTTPS client using SSL/TLS. The `graphql:ListenerSecureSocket` can be used to configure the listener to expose an HTTPS connection.

Alternatively, an HTTP listener configured to connect with an HTTPS client can also be used to create the GraphQL listener to expose an HTTPS connection.

###### Example: SSL/TLS Configuration of the GraphQL Listener

```ballerina
listener graphql:Listener securedGraphqlListener = new(4000,
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
listener http:Listener securedHttpListener = new(4000,
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

#### 11.2.2 Mutual SSL

The GraphQL listener supports mutual SSL, which is a certificate-based authentication process in which two parties (the client and the server) authenticate each other by verifying the digital certificates.

The `graphql:ListenerSecureSocket` configuration can be used to configure mutual SSL for a GraphQL listener.

Alternatively, an HTTP listener configured to connect with a client with mutual SSL can also be used to create the GraphQL listener to expose an HTTPS connection.

###### Example: Mutual SSL Configuration of the GraphQL Listener

```ballerina
listener graphql:Listener securedGraphqlListener = new(4000,
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
listener http:Listener securedHttpListener = new(4000,
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

## 12. Tools

### 12.1 GraphiQL client

The Ballerina GraphQL package provides an integrated GraphiQL client tool which is provided by the GraphQL Foundation. The client is implemented using CDN assets and it provides a Graphical User Interface to execute the GraphQL queries. To enable the GraphiQL client, configuration should be provided as mentioned in the [GraphiQL configuration](#815-graphiql-configurations) section.

If the configurations are provided correctly, the GraphiQL client tool will be served at the given path when the service starts. The client can be accessed via a web browser.

###### Example: Enable GraphiQL Client

```ballerina
@graphql:ServiceConfig {
    graphiql: {
        enable: true,
        path: "/ballerina/graphiql"
    }
}
service on new graphql:Listener(4000) {
    resource function get greeting() returns string {
        return "Hello, World!";
    }
}
````
> **Note:** The GraphiQL client is used as a tool to help developers when writing a GraphQL service, and It is recommended not to enable it in production environments.
