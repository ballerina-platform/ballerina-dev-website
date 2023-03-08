---
title: 'GraphQL? Ballerina is GraphQL'
description: 'When you go beyond just toy GraphQL applications where you simply map GraphQL queries to database queries, Ballerina gives you first-class concepts to write any code that executes as part of the GraphQL query. <br/><br/> No GraphQL service is out of reach with Ballerina. It can create a custom-tailored, typed GraphQL client for your unique queries with ease.'
url: 'https://github.com/ballerina-guides/integration-samples/tree/main/graphql_bookstore_service/main.bal'
---
```
import ballerina/io;


public function main() returns error? {
   GraphqlClient profileClient = check new ("http://localhost:9090/graphql");
   ProfilesQueryResponse profilesQueryResponse = check profileClient->ProfilesQuery();


   MeResponse meResponse = check profileClient->Me();


   foreach var profile in profilesQueryResponse.profiles {
       if profile.address.city == meResponse.me.address.city {
           io:println("Close Profile: ", profile.name);
       }
   }
}
```