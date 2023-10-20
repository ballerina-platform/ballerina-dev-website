# Try HTTP services

While you develop an HTTP service, you need to try it and debug it to check how it works. The Ballerina VS Code extension provides the Swagger Try it view, which gives the ability to try HTTP services within VS Code instead of using any third-party software.

## Write the HTTP service

Add the code below to the `main.bal` file of your Ballerina project.

```ballerina
import ballerina/http;

service / on new http:Listener(9090) {

    // This function responds with the `string` value `Hello, World!` to HTTP GET requests.
    resource function get greeting(string name) returns string {
        return "Hello, World!";
    }
}   
```

## Try the HTTP service

Once you add the above function, the VS Code extension will display a CodeLens called **Try it** on top of the service.

1. Click the **Run** CodeLens to run the program. 
    
    !!! Info
        This opens the terminal and starts running the service.

    <img src="https://wso2.com/ballerina/vscode/docs/img/build-and-try/try-http-services/http-try-it-run.png" class="cInlineImage-full"/>

2. Click the **Try it** CodeLens to open the Swagger Try it view.

    !!! Note
        The service must be in the running state to use Try it view.

    <img src="https://wso2.com/ballerina/vscode/docs/img/build-and-try/try-http-services/http-try-it.png" class="cInlineImage-full"/>

3. Once the Swagger view is opened, click **Try it out**.

    !!! Tip 
        You can find all the available APIs from the opened side menu.

    <img src="https://wso2.com/ballerina/vscode/docs/img/build-and-try/try-http-services/http-try-it-out.png" class="cInlineImage-full"/>

    !!! Info 
        If the HTTP service requires any data/parameters, they will be shown in the **Parameters** section. If you have the [Choreo VS Code extension](https://marketplace.visualstudio.com/items?itemName=WSO2.choreo) installed and signed in, you will get test data that are generated automatically (e.g., the value of the `name` parameter will be generated as shown below.)

    <img src="https://wso2.com/ballerina/vscode/docs/img/build-and-try/try-http-services/http-try-it-parameters.png" class="cInlineImage-full"/>

4. Click **Execute** to see the response.

    <img src="https://wso2.com/ballerina/vscode/docs/img/build-and-try/try-http-services/http-try-it-execute.png" class="cInlineImage-full"/>

You view the reponse as shown below.

<img src="https://wso2.com/ballerina/vscode/docs/img/build-and-try/try-http-services/http-try-it-response.png" class="cInlineImage-full"/>
