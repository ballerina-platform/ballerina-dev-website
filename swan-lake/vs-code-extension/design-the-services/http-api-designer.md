---
title: HTTP API Designer
description: The new HTTP API Designer enables you to design HTTP services interactively. This feature allows you to design services rapidly without the need to have extensive knowledge of the HTTP service syntax of Ballerina. 
keywords: ballerina, vs code extension, http, service, api, design
intro: The new HTTP API Designer enables you to design HTTP services interactively. This feature allows you to design services rapidly without the need to have extensive knowledge of the HTTP service syntax of Ballerina. 
---

## Open the service 

Use the source code below to create a HTTP service using the code editor and click on the **Visualize** codeLens, which is placed above the service.

```ballerina
import ballerina/http;

type Album readonly & record {|
    string id;
    string title;
    string artist;
|};

table<Album> key(id) albums = table [
    {id: "1", title: "Blue Train", artist: "John Coltrane"},
    {id: "2", title: "Jeru", artist: "Gerry Mulligan"},
    {id: "3", title: "Sarah Vaughan and Clifford Brown", artist: "Sarah Vaughan"}
];

service / on new http:Listener(9090) {

    resource function get albums() returns Album[] {
        return albums.toArray();
    }

    resource function get albums/[string id]() returns Album|http:NotFound {
        Album? album = albums[id];
        if album is () {
            return http:NOT_FOUND;
        }
        return album;
    }

    resource function post albums(Album album) returns Album {
        albums.add(album);
        return album;
    }
}
```

<img src="/learn/images/vs-code-extension/release-notes/v-4.0.0/service-design.gif" class="cInlineImage-full"/>

## Visualize the service

The HTTP API Designer provides an overview of the design of the service resources. This gives a broad idea of the behavior of the service. It will visualize the service similar to the OpenAPI viewer. You can see the parameters and response details. Also, you can interact with record types and modify type definitions from the [Statement Editor](/learn/vs-code-extension/references/statement-editor/call-a-ballerina-package-function/).

<img src="/learn/images/vs-code-extension/visual-programming/http-api-designer/visualize.gif" class="cInlineImage-full"/>

## Add resources to the service

The HTTP API Designer lets you implement a service in Ballerina from scratch with less knowledge of coding syntax or by using an existing API. Therefore, the HTTP API Designer will help you to get started with the developments of a service by providing you with the basic standard templates.

Follow the steps below to add resources to the service.

1. Click the **+ Resource** button placed at the top of the **Service View**.

2. Enter the required parameters below in the resource form to add a new resource.

    >**Tip:** To add a parameter, click on the **+** button placed next to the parameter. Error messages will be displayed if there are any.

    - Path parameters
    - Query/Header parameters
    - Payload body
    - Request/Caller parameters

3. Click the **Add resource** button to add a new return response type and select the specific status codes that need to be returned from the resource.

    >**Tip:** Enter the desired name for the record type, and then click the **Create Record** button to create new type records.

4. Define name records for the response type, which will apply the coding best practices to implement the resource.

    <img src="/learn/images/vs-code-extension/visual-programming/http-api-designer/edit-api.gif" class="cInlineImage-full"/>

## Implement the resources of the service

Either navigate to the low-code editing mode, or press **Ctrl + click** on a resource method to navigate to the source code  start implementing the content of the resource.

<img src="/learn/images/vs-code-extension/visual-programming/http-api-designer/navigation.gif" class="cInlineImage-full"/>
