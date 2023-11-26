---
title: Convert JSON to records
description: The Ballerina language provides several options to convert JSON files into record definitions.
keywords: ballerina, vs code extension, json, statement editor, records, conversion
intro: The Ballerina language provides several options to convert JSON files into record definitions.
--- 

## Via the Record Editor

Follow the steps below to convert a JSON to a record via the Record Editor.

1.  Create a file with the data below in JSON format.

    >**Info:**   The example below converts a `person` and a list of `courses` to a `Student` record. 
    
    ```json
    {
        "person": {
            "id": 1001,
            "firstName": "Vinnie",
            "lastName": "Hickman",
            "age": 15
        },
        "course": [
            {
                "id": "CS6002",
                "name": "Computation Structures",
                "credits": 4
            },
            {
                "id": "CS6003",
                "name": "Circuits and Electronics",
                "credits": 3
            },
            {
                "id": "CS6004",
                "name": "Signals and Systems",
                "credits": 3
            }
        ]
    }
    ```

2. In the Record Editor, select **Import A JSON**.

3. Provide a name for the record.

4. Provide the sample JSON by either typing/pasting on the text area or by choosing the JSON file from the file selector.

5. Select **Make Separate Record Definitions** to create separate Ballerina record definitions.

    <img src="/learn/images/vs-code-extension/record-editor/import-JSON.gif" class="cInlineImage-full"/>

6. Use the preview of the created record to edit the created records further, and click **Finish** once editing is complete.

    <img src="/learn/images/vs-code-extension/record-editor/preview.png" class="cInlineImage-half"/>

## Via the Command Palette

Follow the steps below to convert a JSON to a record via the Command Palette.

1.  Copy the JSON code block to the Clipboard (`Ctrl + C`).

    >**Info:** The example below converts a `person` and a list of `courses` to a `Student` record. 
    
    ```
    {
        "person": {
            "id": 1001,
            "firstName": "Vinnie",
            "lastName": "Hickman",
            "age": 15
        },
        "course": [
            {
                "id": "CS6002",
                "name": "Computation Structures",
                "credits": 4
            },
            {
                "id": "CS6003",
                "name": "Circuits and Electronics",
                "credits": 3
            },
            {
                "id": "CS6004",
                "name": "Signals and Systems",
                "credits": 3
            }
        ]
    }
    ```

2. Open the Command Palette in the VS Code editor (shortcut: `Ctrl + Shift + P`).

3. Select the **Paste JSON as Record** option.

    >**Info:**   The command will generate separate record definitions accordingly.

    <img src="/learn/images/vs-code-extension/record-editor/paste-JSON.gif" class="cInlineImage-full"/>
