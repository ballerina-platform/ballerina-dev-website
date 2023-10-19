# Version 4.0.0

We are delighted to announce the v4.0.0 release of the Ballerina VS Code extension with new features and enhancements. The key highlights of this release include the following.

!!! Compatibility
    If you are new to Ballerina, you can download the [installers](https://ballerina.io/downloads/) to install it. You can install the Ballerina VS Code extension from the [VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina). To ensure all features work correctly, **install the latest patch release of Update 4 or later**.

- [New unified visual and code editing experience](#new-unified-visual-and-code-editing-experience)
- [HTTP API Designer](#http-api-designer)
- [GraphQL API Designer](#graphql-api-designer)
- [Architecture View](#architecture-view)
- [Type Diagram](#type-diagram)
- [Data Mapper improvements](#data-mapper-improvements)
- [Language Server updates](#language-server-updates)
- [Choreo extension integration](#choreo-extension-integration)

## New unified visual and code editing experience

In response to the valuable feedback received from developers, this release introduces a new unified development experience that seamlessly integrates code and visual development. This allows you to easily switch between code and visual development and leverage the benefits of both modes.

With the new release, you can now find a **Visualize** CodeLens above each construct to visualize it. Clicking it will open the visualization of the construct. Currently, the visualization of all types of functions in Ballerina sequence diagrams and HTTP and GraphQL service types is supported. You can navigate back to the code using the menu or by pressing **Ctrl + Click** on the corresponding elements.

<img src="https://wso2.com/ballerina/vscode/docs/img/release-notes/v-4.0.0/visualise.gif" class="cInlineImage-full"/>

## HTTP API Designer

The extension now offers an HTTP Service Designer, which enables you to design HTTP services interactively. This feature allows you to design services rapidly even if you lack extensive knowledge of Ballerina's HTTP service syntax. To open the service designer, add an HTTP service using code or the **Add** button in the visual editor, and then click the **Visualize** CodeLens above the HTTP service.

<img src="https://wso2.com/ballerina/vscode/docs/img/release-notes/v-4.0.0/service-design.gif" class="cInlineImage-full"/>

## GraphQL Designer

The GraphQL Designer is introduced to streamline the visual creation of GraphQL APIs in Ballerina. This powerful tool simplifies understanding and navigating complex GraphQL services by letting you browse through them effortlessly without examining code directly. To open the GraphQL designer, add a GraphQL service from code using the service template and then, click the **Visualize** CodeLens above the service.

<img src="https://wso2.com/ballerina/vscode/docs/img/release-notes/v-4.0.0/graphql.gif" class="cInlineImage-full"/>

## Architecture View

The extension now includes a feature to visualize interactions and dependencies of multi-package Ballerina projects. Load all the packages into the VS Code workspace and execute the **Architecture View** command to access it. The architecture diagram lets you view all the services in the packages and their interactions.

<img src="https://wso2.com/ballerina/vscode/docs/img/release-notes/v-4.0.0/architecture.gif" class="cInlineImage-full"/>

## Type Diagram

Similar to entity diagrams, type diagrams enable you to view relationships and compositions of Ballerina record types. You can access the type diagram via the **Architecture View**.

<img src="https://wso2.com/ballerina/vscode/docs/img/release-notes/v-4.0.0/type.gif" class="cInlineImage-full"/>

## Data Mapper improvements

The search functionality is now available for filtering input and output fields. Additionally, now, you can easily navigate through transformation functions used within the transformation and perform mappings on-the-spot.

## Language Server updates

The language client version has been updated to 8.0.2. This adds support for the Language Server Protocol (LSP) version 3.17. The update also introduces support for selecting target expressions when applying the **Extract** code actions inside nested expressions.

## Choreo extension integration

The combination of the Ballerina extension together with the [Choreo extension](https://marketplace.visualstudio.com/items?itemName=WSO2.choreo) offers additional features to help you develop and deploy cloud-native applications. You can try out the features below that are provided by the integration by installing the Choreo extension.

- Scaffold and deploy cloud-native applications quickly using the architecture diagram.
- Clone and open Choreo projects locally and monitor component statuses.
- Visualize the deployment of a Choreo project via the **Cell view**.
- View performance information in diagrams. 
    
!!! Note
    With this integration, now, you do not need to log into Choreo from the Ballerina extension. You must have the Choreo extension installed to view performance data.













    





