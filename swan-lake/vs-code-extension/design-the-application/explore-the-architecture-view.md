# Explore the Architecture View

Explore the features of the Architecture View using the [Online Boutique microservices demo](https://github.com/ballerina-guides/gcp-microservices-demo) Ballerina project.

## Related concepts

Before getting started with the Architecture View, the following are a few concepts that are essential to be aware of.

### Ballerina project

 Ballerina project is a collection of one or more [Ballerina packages](https://ballerina.io/learn/package-references/).

### Project workspace

A Ballerina project is contained in a [VS Code workspace](https://code.visualstudio.com/docs/editor/workspaces). To use the Architecture View, you need to have all the required Ballerina packages added to the VS Code editor as a workspace.

!!! Tip
    You can save your VS Code workspace as a file and use this file to access the workspace thereafter.

### Service identifiers

Since multiple services can have the same path, this tool depends on an annotation to uniquely identify the services within the project. The current approach to do so is via the `display` annotation, which is a general-purpose annotation that can be used in the Ballerina source.

By providing a unique value to the `id` field of the display annotation, you can assign an identifier to each service. For reference, the `CurrencyService` in the following code snippet has been annotated with an ID of the `currency` value and this identifier will be used to differentiate the service throughout the project.

```ballerina
@display {
   label: "CurrencyService",
   id: "currency"
}
@grpc:ServiceDescriptor {descriptor: ROOT_DESCRIPTOR, descMap: getDescriptorMapDemo()}
service "CurrencyService" on ep {
   final map<decimal> & readonly currencyMap;
   function init() returns error? {
       json currencyJson = check io:fileReadJson(currencyJsonPath);
       self.currencyMap = check parseCurrencyJson(currencyJson).cloneReadOnly();
   }
   remote function GetSupportedCurrencies(Empty value) returns 
   GetSupportedCurrenciesResponse|error {
       return {currency_codes: self.currencyMap.keys()};
   }
}
```

If other services in your project interact with this `Currency Service`, this same identifier has to be provided upon creating the client endpoint. By doing so, it makes it possible to uniquely identify and link the service interactions between one another. 

For example, the code snippet below invokes the `Currency Service` from a different component.

```ballerina
isolated function getSupportedCurrencies() returns string[]|error {
   @display {
       label: "CurrencyService",
       id: "currency"
   }
   final CurrencyServiceClient currencyClient = check new ("http://localhost:9093");
   GetSupportedCurrenciesResponse|grpc:Error supportedCurrencies = 
       currencyClient->GetSupportedCurrencies({});
   if supportedCurrencies is grpc:Error {
       log:printError("failed to call getSupportedCurrencies from currency service");
       return supportedCurrencies;
   }
   return supportedCurrencies.currency_codes;
}
```

!!! Tip
    The label attribute of the display annotation can be used to label the services in the diagram.

### Service resources

For the diagram to be able to detect interactions, the resource invocations between services need to be done using [client access actions](https://ballerina.io/downloads/swan-lake-release-notes/swan-lake-2201.2.0#support-for-resource-methods-in-client-objects).

## Access the Architecture View

This guide uses the [Online Boutique microservices demo](https://github.com/ballerina-guides/gcp-microservices-demo) to demonstrate the different capabilities of the Architecture View. This sample has 10 services (9 GRPC and one HTTP) in 10 separate Ballerina packages. The `ui` folder is not a Ballerina package, hence would not make an impact. 

1. Click the **VS Code workspace file** option in the top menu of the VS Code editor to import the [workspace file of the Online Boutique microservices demo](https://github.com/ballerina-guides/gcp-microservices-demo/blob/main/project.code-workspace).

    !!! Info 
        This will add all the required packages to the current workspace. When the workspace is set up, you will see the following folder structure in the **Explorer**. The workspace name may be different if you set up the workspace from scratch.

    <img src="../../img/visual-programming/architecture-view/architecture-diagram/project-workspace.png" class="cInlineImage-small"/>

2. Click the `Ballerina: Architecture View` command in the Command palette to open the Architecture View.

## Explore the diagram types

Once you open the Architecture View, you will see the following types of diagrams.

<img src="../../img/visual-programming/architecture-view/architecture-diagram/diagram-types.gif" class="cInlineImage-full"/>

### Service Diagram Level 1

This diagram displays all the services available within the workspace with links representing any interactions between them. The basic Service Diagram Level 1 generated for the 10 Ballerina packages in the Online Boutique microservices demo project is shown below.

<img src="../../img/visual-programming/architecture-view/architecture-diagram/service-level-one-copy.png" class="cInlineImage-full"/>

!!! Info
    The link between the `Checkout` service and the `Email` service indicates that a resource of the `Checkout` service invokes the `Email` service. In addition to this, the `Email` service also invokes an `external` service via a connector.

### Service Diagram Level 2

The detailed Service Diagram Level 2 (resources) dives deeper into the compositions of the services and the interactions between them. Below is the detailed representation of the demo project, which depicts the individual resource/remote functions of the services and their invocations.

<img src="../../img/visual-programming/architecture-view/architecture-diagram/service-level-two-copy.png" class="cInlineImage-full"/>

The data types of the request and response bodies of the interactions can be viewed by hovering over a particular invocation.

<img src="../../img/visual-programming/architecture-view/architecture-diagram/level-two-invocation-data-types.gif" class="cInlineImage-full"/>

If these data types are Ballerina records, click on them to access the composition of the particular record.

<img src="../../img/visual-programming/architecture-view/architecture-diagram/level-two-to-type-composition.gif" class="cInlineImage-full"/>

### Type diagram

The type diagram provides a comprehensive view of all the Ballerina record types defined in the project workspace and their associations. This can be accessed via the **Architecture View** command, as shown below.

<img src="../../img/visual-programming/architecture-view/type-diagram/type-diagram.gif" class="cInlineImage-full"/>

The following is a snippet of the type diagram generated for the [Online Boutique Microservices demo](https://github.com/ballerina-guides/gcp-microservices-demo). 

<img src="../../img/visual-programming/architecture-view/type-diagram/gcp-type-diagram.png" class="cInlineImage-full"/>

!!! Tip 
    The multiplicities of the associations are represented on either side of the connector while the type inclusions are differentiated using a directed link (represents inheritance).

### Composition diagram

You can also view the composition of an individual record type. Use either of the methods below to access these composition diagrams.

1. Click the record types that are included in the request/response bodies of the service invocations shown in the [Service Diagram Level 2](#service-diagram-level-2).

2. Click the head of the records displayed in the type diagram.

Below is the composition diagram generated for the `ContextSearchProductsResponse` record type shown in the type diagram above.

<img src="../../img/visual-programming/architecture-view/type-diagram/gcp-type-composition.png" class="cInlineImage-full"/>

## Other capabilities of the Architecture View

In addition to the above, the Architecture View includes the following features.

- Filter the services and types based on the packages
- Navigate to the source code from the diagram components
- Rearrange the diagram
- Export the diagrams in JPEG format
