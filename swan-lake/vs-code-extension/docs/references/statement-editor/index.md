# Statement Editor

The Statement Editor allows you to construct Ballerina statements depending on the use case you want to build. It is an intuitive visual editor that is easy to use without an in-depth knowledge of the Ballerina language.

It provides the following:

- Context-based suggestions

- Ballerina libraries (standard libraries and language libraries)

- Pre-defined expression templates

- Documentation for functions and methods to configure parameters easily 

## Construct statements

This guide walks you through the steps to build the following statement using the editing capabilities of the Statement Editor. Later, you will explore different use cases.

```ballerina
final string userIdMsg = "UserID : " + id.toString();
```

Let's add the above statement to the main method of the given sample code below.

```ballerina
int id = 1234;
 
public function main() returns error? {
   // Statement will be added here
}
```

Follow the steps below to build the statement.

1. On the low-code diagram, click **+** within the main method, and click **Variable** in the **Add Constructs** pane that opens.

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/add-variable-statement.gif" class="cInlineImage-half"/>

    The Statement Editor opens displaying the syntax of a variable statement with the **`<add-expression>`** selected by default.

2.  Click the **var** type descriptor on the statement and click **string** on the **Suggestions** tab.

    !!! Info
        The **Suggestions** tab provides contextual suggestions based on the selected item. It lists type suggestions in this example because you selected the type descriptor. Here, you are specifying that the variable value is a string.   

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/change-type-descriptor.gif" class="cInlineImage-half"/>

3. To edit the variable name, double-click **`variable`** and type `userIdMsg` in the text box.

    !!! Info 
        Another way to make a part of a statement editable is to click on the required statement component and press **Enter**/**Return**. If you want to make changes to the content you have added to the statement, you can undo and redo your actions via the relevant icons on the top left of the toolbar. You can also remove content via the icon for deleting.

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/edit-variable-name.gif" class="cInlineImage-half"/>

4. Double click **`<add-expression>`** and type `"UserID : "` in the text box.

    !!! Info
        To navigate from one item on the statement to another, you can also press **Tab** or **Shift** + **Tab**. In this example, you are entering static text as a part of the variable value.

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/edit-variable-expression.gif" class="cInlineImage-half"/>

5.  Follow either of the two approaches below to concatenate another expression to the String that you added right now.

    1. Click the **Plus (+)** operator in the toolbar.
    2. Click the **Expressions** tab and under the **Arithmetic** section, click the **Es + Ex** expression.

    Both of these methods will append another expression template to the existing expression. 

    !!! Info 
        The **Expressions** tab lists all the pre-defined templates that you can use to define complex expressions. In the `Es + Ex` expression template, `Es` refers to the existing expression you clicked and selected. `+ Ex` combines another expression with `Es`.

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/select-expression-template.gif" class="cInlineImage-half"/>

6. Click the **Suggestions** tab and click on the **id** suggestion.

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/select-id-from-suggestions.gif" class="cInlineImage-half"/>

     You view some diagnostics generated for the suggestion you selected. Move on to the next step to resolve them. 

7. Follow the two approaches below to solve the diagnostics.

    1. Select the **code-actions** provided by the Statement Editor based on your preference. To view the options, click on the bulb icon next to the diagnostic.
    2. Click the **Suggestions** tab and click **toString()** in the suggestions list to convert the value to a string format.
    
    The **Suggestions** tab will also provide other supported functions that can be called for the given expression.

    !!! Info
        When you select a function or a method call, the **Parameters** tab opens by default. This tab displays information about the selected function or method call, including details about parameters, descriptions, and return type descriptions. You can add parameters to the expression On this tab by selecting the checkboxes of the relevant parameters.

    <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/convert-to-string.gif" class="cInlineImage-half"/>

    !!! Note
        The Statement Editor clears all the diagnostic messages indicating that the statement is valid.

     Now, follow the steps below to make the variable a final. 

8. Click on the globe icon in the toolbar and select the **final** keyword. 

    !!! Info
        The dropdown shows the possible modifiers for the statement that is currently being edited.

     <img src="https://wso2.com/ballerina/vscode/docs/img/statement-editor/add-stmt-qualifier.gif" class="cInlineImage-half"/>

     You view the variable statement as follows.

     ```ballerina
     final string userIdMsg = "UserID : " + id.toString();
     ```
    
    Now, you constructed a valid statement via the Statement Editor.

9. Click **Save** to add the variable statement to the low-code diagram.

## Featured use cases

To explore more on the Statement Editor functionalities, see the use cases below.

- [Call a Ballerina library function](call-a-ballerina-library-function.md)
- [Construct a record](construct-a-record.md)
- [Define a configurable variable](define-a-configurable-variable.md)
