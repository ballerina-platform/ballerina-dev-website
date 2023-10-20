# Define a configurable variable

As you develop your construct, you may identify a parameter for which the value needs to be configurable and for which you have not already defined the required configurable. Then, you can access the configurable variable template while defining/editing the current statement. 

Follow the steps below to add a variable and make its value configurable.

!!! Info 
    In this example, you create a variable `host` of type **string** and decide that the value of this variable should be configurable.

1. Click on the **`<add-expression>`** template and click the **Add-configurable** button in the toolbar.

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/add-configurable-button-click.gif" class="cInlineImage-half"/>

    !!! Info 
        This opens up a new pane with the configurable variable statement template.

 2. Update the variable name and value as required. 
 
 3. Click the **Add** button. 

    !!! Info 
        This adds the configurable variable to the source code and updates the current statement as shown below. 
 
    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/add-conifgurable.gif" class="cInlineImage-half"/>

A new configurable variable gets generated in the source code as shown below.

 ```ballerina
 configurable string dbHost = "localhost";
 ```
