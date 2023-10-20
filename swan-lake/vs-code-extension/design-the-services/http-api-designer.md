# HTTP API Designer

The new HTTP API Designer enables you to design HTTP services interactively. This feature allows you to design services rapidly without the need to have extensive knowledge of the HTTP service syntax of Ballerina. 

## Open the service 

To open the HTTP API Designer, add an HTTP service using the code or the **Add** button in the visual editor and then click the **Visualize** CodeLens, which is placed above the HTTP service.

<img src="https://wso2.com/ballerina/vscode/docs/img/release-notes/v-4.0.0/service-design.gif" class="cInlineImage-full"/>

## Visualize the service

The HTTP API Designer provides an overview of the design of the service resources. This gives a broad idea of the behavior of the service. It will visualize the service similar to the OpenAPI viewer. You can see the parameters and response details. Also, you can interact with record types and modify type definitions from the [Statement Editor](https://wso2.com/ballerina/vscode/docs/references/statement-editor/).

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/http-api-designer/visualize.gif" class="cInlineImage-full"/>

## Add resources to the service

The HTTP API Designer lets you implement a service in Ballerina from scratch with less knowledge of coding syntax or by using an existing API. Therefore, the HTTP API Designer will help you to get started with the developments of a service by providing you with the basic standard templates.

Follow the steps below to add resources to the service.

1. Click the **+ Resource** button placed at the top of the **Service View**.

2. Enter the required parameters below in the resource form to add a new resource.

    !!! Tip 
        To add a parameter, click on the **+** button placed next to the parameter. Error messages will be displayed if there are any.

    - Path parameters
    - Query/Header parameters
    - Payload body
    - Request/Caller parameters

3. Click the **Add resource** button to add a new return response type and select the specific status codes that need to be returned from the resource.

    !!! Tip 
        Enter the desired name for the record type, and then click the **Create Record** button to create new type records.

4. Define name records for the response type, which will apply the coding best practices to implement the resource.

    <img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/http-api-designer/edit-api.gif" class="cInlineImage-full"/>

## Implement the resources of the service

Either navigate to the low-code editing mode, or press **Ctrl + click** on a resource method to navigate to the source code  start implementing the content of the resource.

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/http-api-designer/navigation.gif" class="cInlineImage-full"/>
