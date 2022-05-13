---
layout: ballerina-left-nav-pages-swanlake
title: GraphQL
description: GraphQL has become a prominent technology for implementing data APIs because it provides a convenient and intuitive approach for querying data. It solves potential problems such as data over-fetching and high-latency that you may notice in traditional data services. This guide illustrates a sample GraphQL use case using Ballerina. 
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/graphql/
active: graphql
intro:  GraphQL has become a prominent technology for implementing data APIs because it provides a convenient and intuitive approach for querying data. It solves potential problems such as data over-fetching and high-latency that you may notice in traditional data services. This guide illustrates a sample GraphQL use case using Ballerina. 
redirect_from:
  - /learn/network-communication/graphql
  - /swan-lake/learn/network-communication/graphql/
  - /swan-lake/learn/network-communication/graphql
  - /learn/network-communication/graphql/
  - /learn/network-communication/graphql
  - /learn/user-guide/network-communication/graphql
redirect_to:
  - https://lib.ballerina.io/ballerina/graphql/latest/
---

## Introducing the use case

The use case is a typical e-commerce scenario of processing orders in an online store. The entity-relationship diagram below shows a simplified representation of a real-life implementation that can be used in a relational database.

<img src="/learn/images/orders-erd-new.png" alt="Simply Easy Learning" width="550" height="450">

## Defining the object graph

In GraphQL, you can define an object graph in your service in which a client can query the specific fields of an object into any nested level. Optionally, you can pass in parameters for these fields as well. A definition of these objects for this use case is shown below.

```ballerina
type Query {
   order(id: Int): Order
}
 
type Order {
   id: Int
   notes: String
   customer: Customer
   shipper: Shipper
}
 
type Customer {
   name: String
   address: Address
}
 
type Shipper {
   name: String
   phone: String
}
```

The code above is written in the GraphQL schema format used to define object types. GraphQL `Query` is a special object type, which must exist for the schema. This is basically the root-level object that will be used to query. Therefore, in GraphQL queries, you provide the fields inside the `Query` object to look up the required data. 

## Writing the queries

Once you have the GraphQL service with the schema above, send the query below to get order details from your database.

```ballerina
{
   order(id: 1) {
       notes,
       date
   }
}
```

In the above code, you instruct the service to look up the `order` field from the root query object and pass in ‘1’ as the value for parameter `id`. This field returns an object type, and thereby, you need to list all the fields required from the object, which are `notes` and `date` above. If you need to only look up the date field, the GraphQL query would be as follows.

```ballerina
{
   order(id: 1) {
       date
   }
}
```

You can drill into more fields and get their values as well. The query below looks up the full order information including the customer and shipper information. 

```ballerina
{
   orders(id: 2) {
       notes,
       date,
       customer {
           name,
           address
       },
       shipper {
           name,
           phone
       }
   }
}
```

## Writing a simple GraphQL service

The code below (e.g., `demo.bal`) shows a simple GraphQL service written in Ballerina.

```ballerina
import ballerina/graphql;
 
service graphql:Service /query on new graphql:Listener(8080) {
 
   resource function get name() returns string {
       return "Jack";
   }
 
}
```

The code above exposes a GraphQL service at the endpoint “http://localhost:8080/query”. Its GraphQL schema is similar to the following.

```ballerina
type Query {
   name: String
}
```

You can send the GraphQL query below to look up the exposed `name` field in the root query object. 
 
```ballerina
{
   name
}
```
## Executing the simple GraphQL service

Execute the command below to run the Ballerina GraphQL service above.

```bash
bal run demo.bal
```

You view the output below.

```
Compiling source
    demo.bal

Running executable

[ballerina/http] started HTTP/WS listener 0.0.0.0:8080
```

A GraphQL request can be executed by sending an HTTP request similar to the following.

```bash
curl -X POST -H "Content-type: application/json" -d '{"query":"{name}"}' http://localhost:8080/query
{"data":{"name":"Jack"}}
```

The resource functions here can be provided with parameters to correlate with the GraphQL field parameters as well. Also, in the case of returning objects in fields, the resource method can return a service object to represent this. 


Now, that you know the basics of how GraphQL works, for an actual implementation using Ballerina, which has GraphQL as part of its built-in language-level services support, see [Implementing GraphQL Services](/learn/user-guide/network-communication/graphql/implementing-graphql-services/).

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
