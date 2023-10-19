# GraphQL API Designer

The GraphQL API Designer streamlines the visual creation of GraphQL APIs in Ballerina. This powerful tool simplifies understanding and navigating of complex GraphQL services and lets you browse through them effortlessly without examining the code directly.

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

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/graphql-designer/visualize.gif" class="cInlineImage-full"/>

## Explore the GraphQL API Designer 

The GraphQL API Designer provides the following features.

- Add GraphQL queries, mutations, and subscription operations
- Create and edit constructs such as records and service classes
- Navigate to the specific source code

## Use the GraphQL API Designer functionalities

You can perform the above functionalities using the GraphQL API Designer as follows.

### Add a GraphQL query

Add a query to the GraphQL service with a `Profile` record as the output object.

!!! Info
    Hover over each field to view the provided **Edit**, **Delete**, and **Design** GraphQL operations.

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/graphql-designer/query-creation.gif" class="cInlineImage-full"/> 

### Access the query source

Navigate to the source code of the newly created `profile` query and update the resource body. Use **Ctrl + Click** shortcut on the specific field to navigate to the respective source code. 

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/graphql-designer/navigate.gif" class="cInlineImage-full"/>

### Create a record construct

Create a record within the GraphQL API Designer itself.

!!! Info
    You can use this same approach to create service classes as well.

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/graphql-designer/add-new-construct.gif" class="cInlineImage-full"/>
