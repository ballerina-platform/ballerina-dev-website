# Sequence Diagram View

The visual representation provided by the Ballerina VS Code extension has its roots in sequence diagrams. They can capture how the logic of your program flows, how the concurrent execution flow works, which remote endpoints are involved, and how those endpoints interact with the different workers in the program.

## Switch to graphical mode

There are two methods for switching to the graphical mode using the VS Code extension.

1.  Click the `Visualize` CodeLens that appears in the editor.
    
    <img src="../../img/visual-programming/sequence-diagram-view/visualize-code-block.png" class="cInlineImage-full"/>

-   Click `Show Diagram` in the editor group.
    
    <img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/sequence-diagram-view/editor-group-button.png" class="cInlineImage-full"/>

Shown below is the code editor and graphical editor in the split view. The graphical mode is focused on the main function.

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/sequence-diagram-view/graphical-view.png" class="cInlineImage-full"/>

## Graphical representation of code

Ballerina code can be represented graphically in the following ways.

### Functions

Graphical representations of functions are based on sequence diagrams. Each function has a lifeline with a start and end, and this lifeline represents the flow of the function logic. 

**Source code**

```ballerina
import ballerina/io;
import ballerina/random;

public function main() {
    io:println("Hello, World!");

    if random:createIntInRange(1, 100) == 22 {
        io:println("the number is 22");
    } else {
        io:println("the number is not 22");
    }

    io:println("Program exit");
}
```

**Graphical view**
    
<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/sequence-diagram-view/function-sequence-diagram.png" class="cInlineImage-full"/>

### Concurrent execution

Concurrent executions are supported in Ballerina through workers. Each worker has a lifeline that runs parallel to the lifeline of the main function body. The diagram also captures asynchronous messaging between workers.

The following example shows how asynchronous messaging is represented in the diagram.

**Source code**

```ballerina
public function FunctionWithWorker() {
    worker A {
        int num = 10;

        // Sends the `10` integer value to the `B` worker asynchronously.
        num -> B;

        // Receives the `Hello` string from the `B` worker.
        string msg = <- B;
        io:println(string `Received string "${msg}" from worker B`);
    }

    worker B {
        int num;

        // Receives the `10` integer value from the `A` worker.
        num = <- A;
        io:println(string `Received integer "${num}" from worker A`);

        // Sends the `Hello` string to the `A` worker asynchronously.
        string msg = "Hello";
        msg -> A;
    }

    wait A;
    io:println("Woker A execution finished");
}
```

**Graphical view**

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/sequence-diagram-view/worker_sample.png" class="cInlineImage-full"/>

### Remote endpoints and clients

Ballerina specifies interactions with remote endpoints through its syntax. These interactions are presented graphically in the diagram view by giving each endpoint a lifeline. This endpoint lifeline represents the messages that the endpoint can receive.

The following code shows an HTTP client that is used for the `GET` and `POST` requests sent to a remote endpoint.

**Source code**

```ballerina
import ballerina/http;

configurable string lookupUrl = ?;
configurable string reportUrl = ?;

function execute() returns error? {
    http:Client lookupService = check new (lookupUrl);
    http:Client reportService = check new (reportUrl);
    json result = check lookupService->get("/query");
    http:Response response = check reportService->post("/report", result);
}
```

**Graphical view**

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/sequence-diagram-view/client-code-representations.png" class="cInlineImage-full"/>

## Develop programs in graphical mode

You can interact with the diagram using the `plus` icons placed in the lifeline. Click **Add** to add a statement at the function execution.

<img src="https://wso2.com/ballerina/vscode/docs/img/visual-programming/sequence-diagram-view/diagram-interaction.gif" class="cInlineImage-full"/>
