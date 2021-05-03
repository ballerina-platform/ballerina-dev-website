---
layout: ballerina-left-nav-pages-swanlake
title: GraphQL
description: GraphQL has become a prominent technology for implementing data APIs because it provides a convenient and intuitive approach for querying data. It solves potential problems such as data over-fetching and high-latency that you may notice in traditional data services. This guide illustrates a sample GraphQL usecase using Ballerina. 
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/user-guide/network-communication/graphql/
active: graphql
intro:  GraphQL has become a prominent technology for implementing data APIs because it provides a convenient and intuitive approach for querying data. It solves potential problems such as data over-fetching and high-latency that you may notice in traditional data services. This guide illustrates a sample GraphQL usecase using Ballerina. 
redirect_from:
  - /learn/network-communication/graphql
  - /swan-lake/learn/network-communication/graphql/
  - /swan-lake/learn/network-communication/graphql
  - /learn/network-communication/graphql/
  - /learn/network-communication/graphql
  - /learn/user-guide/network-communication/graphql
---

## Introducing the Usecase

The usecase is a typical e-commerce scenario of processing orders in an online store. The entity-relationship diagram below shows a simplified representation of a real-life implementation that can be used in a relational database.

<img src="/learn/images/orders-erd.png" alt="Simply Easy Learning" width="550" height="400">

## Defining the Object Graph

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

Once you have the GraphQL service with the schema above, send the query below to get order details from your database.

```ballerina
{
   order(id: 1) {
       notes,
       date
   }
}
```

Here, we instruct our service to lookup the `order` field from the root query object and pass in ‘1’ as the value for parameter `id`. This field returns an object type, so we need to list all the fields we require from the object, which are `notes` and `date` above. If we need to only look up the date field, our GraphQL query would be as follows.