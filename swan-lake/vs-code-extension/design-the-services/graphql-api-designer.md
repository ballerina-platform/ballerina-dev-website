---
title: GraphQL API Designer
description: The GraphQL API Designer streamlines the visual creation of GraphQL APIs in Ballerina. This powerful tool simplifies understanding and navigating of complex GraphQL services and lets you browse through them effortlessly without examining the code directly.
keywords: ballerina, vs code extension, graphql, service, api, design
intro: The GraphQL API Designer streamlines the visual creation of GraphQL APIs in Ballerina. This powerful tool simplifies understanding and navigating of complex GraphQL services and lets you browse through them effortlessly without examining the code directly.
---

## Open the GraphQL API Designer 

Use the source code below to create a GraphQL service using the code editor and click on the **Visualize** codeLens, which is placed above the service. 

```ballerina
import ballerina/graphql;

public type Profile record {|
    string name;
    int age;
    Address address;
|};

public type Address record {|
    string number;
    string street;
    string city;
|};

service /graphql on new graphql:Listener(9090) {

    // A resource method with the `get` accessor inside a `graphql:Service` represents a field in the
    // root `Query` type.
    resource function get greeting() returns string {
        return "Hello, World";
    }

}
```

<img src="/learn/images/vs-code-extension/visual-programming/graphql-designer/graphql-visualizer.gif" class="cInlineImage-full"/>

## Explore the GraphQL API Designer 

The GraphQL API Designer provides the following features.

- Add GraphQL queries, mutations, and subscription operations
- Create and edit constructs such as records and service classes
- Navigate to the specific source code

### Example : Add a GraphQL query and add the source

Add a query to the GraphQL service with a `Profile` record as the output object. Then Navigate to the source code of the newly created `profile` query and update the resource body. Use **Ctrl + Click** shortcut on the specific field to navigate to the respective source code. 

<img src="/learn/images/vs-code-extension/visual-programming/graphql-designer/graphql-add-query-and-source.gif" class="cInlineImage-full"/> 




