---
layout: ballerina-left-nav-pages-swanlake
title: Implementing GraphQL Services
description: In Ballerina, the GraphQL object structure is modeled using services. A Ballerina GraphQL service contains resource methods that map to the fields of the GraphQL objects and work as resolver functions to provide its data. The GraphQL schema is automatically derived from this service structure and its resources. 
keywords: ballerina, cli, command line interface, programming language
permalink: /learn/user-guide/network-communication/graphql/implementing-graphql-services/
active: implementing-graphql-services
intro:  In Ballerina, the GraphQL object structure is modeled using services. A Ballerina GraphQL service contains resource methods that map to the fields of the GraphQL objects and work as resolver functions to provide its data. The GraphQL schema is automatically derived from this service structure and its resources. 
redirect_from:
  - /learn/user-guide/network-communication/graphql/implementing-graphql-services
---

The topics below demonstrates how to implement an [order information query scenario](/learn/user-guide/network-communication/graphql#introducing-the-usecase) using a Ballerina service. 

## Writing the GraphQL Service

Start with the Ballerina GraphQL service implementation below, which represents the GraphQL root `Query` object fields. 


```ballerina
import ballerina/graphql;
 
service graphql:Service /query on new graphql:Listener(8080) {
 
   resource function get 'order(int id) 
                          returns Order|error => loadOrder(id);
 
}






