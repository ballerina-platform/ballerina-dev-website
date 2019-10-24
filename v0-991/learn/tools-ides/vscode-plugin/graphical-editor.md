# Graphical Editor

A rich set of Visualization tools will immensely enhance your development experience especially in the integration space. 

The Graphical Editor of the VS Code Ballerina extension allows you to design your integration scenario graphically. Thus, by using it, you can visualize your code in a sequence diagram, which presents the endpoint interactions and parallel invocations that happen in the code. 

The bellow sections discuss how to use the Graphical Editor and explore its capabilities.

- [Launching the Graphical Editor](#launching-the-graphical-editor)
- [Exploring the features of the Graphical Editor](#exploring-the-features-of-the-graphical-editor)

## Launching the Graphical Editor

Follow the steps below to launch the Graphical Editor.

1. Click **View** in the top menu and click **Command Palette**. 

2. In the search box, type "Show" and click **Ballerina: Show Diagram**.

![Show Diagram option](../images/show-diagram.gif)

> **Tip**: For a quick launch, click the **Show Diagram** icon in the top right corner.

![Quick launch of the Graphical Editor](../images/graphical-editor-quick-launch.gif)

## Exploring the features of the Graphical Editor

Click on the below links to explore the features of the Graphical Editor.

- [Designing the control flow](#designing-the-control-flow)
- [Adding definitions](#adding-definitions)
- [Adding control flow constructs](#adding-control-flow-constructs)
- [Adding workers and endpoints](#adding-workers-and-endpoints)
- [Viewing the source](#viewing-the-source)
- [Expanding the Diagram View](#expanding-the-diagram-view)

### Designing the control flow

You can design your control flow graphically by switching to the Edit mode of the Graphival Editor. Click **Edit** in the design view to do this.

![Designing the control flow](../images/edit-mode.gif)

### Adding definitions

In the edit mode, click **Definitions** to add main top-level constructs which are Functions and Services. When you add a construct, you can find the respective text source of it also added to the source view.

This feature of the Graphical Editor represents the text to visual syntax parity of Ballerina.

![Adding definitions](../images/add-definitions.gif)

### Adding control flow constructs

To add statments to the constructs in your design, click the green color plus sign appearing in the scope of each construct.

![Adding control flow constructs](../images/add-constructs.png)

### Adding workers and endpoints

You can add endpoints and workers for constructs such as resource definitions and function definitions.

- When defining your control flow with parallel execution, add workers as shown below.

    ![Adding workers](../images/add-workers.png)

- When defining external endpoint interactions, add endpoint constructs. 

    ![Adding endpoints](../images/add-endpoints.png)

### Viewing the source

From the design view you can jump to the respective source segment as shown below.

![Viewing the source](../images/jump-to-source-view.gif)

### Expanding the Diagram View

You can expand the Diagram View to show not only the control flow but also to show more fine-grained statements of the constructs.

![Expanding the Diagram View](../images/expand-diagram-view.gif)

## What's next?

 - For information on the next capability of the VS Code Ballerina extension, see [Documentation Viewer](vscode-plugin/documentation-viewer).
 - For information on the VS Code Ballerina extension, see [The Visual Studio Code Extension](/learn/tools-ides/vscode-plugin).
 - For information on the tools and IDEs that are supported by the VS Code Ballerina extension, see [Tools and IDEs](../tools-ides).