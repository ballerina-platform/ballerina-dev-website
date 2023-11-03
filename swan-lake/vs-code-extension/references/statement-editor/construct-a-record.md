---
title: Construct a record
description: Follow the steps below to construct a record using the Statement Editor.
keywords: ballerina, vs code extension, record construction, statement editor
intro: Follow the steps below to construct a record using the Statement Editor.
---

1. Navigate to the Record Editor and select **Create New**.

    <img src="/learn/images/vs-code-extension/statement-editor/create-new-record.gif" class="cInlineImage-half"/>

2. Double-click the default record name to change it.

    <img src="/learn/images/vs-code-extension/statement-editor/update-record-name.gif" class="cInlineImage-half"/>

3. To add another field to the record, click the **plus** button, which appears when you hover over the current field.

    <img src="/learn/images/vs-code-extension/statement-editor/add-record-fields.gif" class="cInlineImage-half"/>

4. To convert the record field to a default-valued field, click the **semicolon(;)**. 

    >**Info:** This selects the complete record field and selects the **Expressions** tab.

5. Click the **Es=Ex** template.

    <img src="/learn/images/vs-code-extension/statement-editor/add-default-record-field.gif" class="cInlineImage-half"/>

    >**Info:** The selected field gets updated with the **`<add-expression>`** template. You can double-click and update it.

6. Follow either of the two approaches below to mark a record field as **Optional**. First, select the variable name of the field that is needed to mark as optional, and then,
    1. select the **?** from the toolbar
    2. select the **Es?** template from the **Expressions** tab

    <img src="/learn/images/vs-code-extension/statement-editor/make-record-optional.gif" class="cInlineImage-half"/>

7. To convert the record to an open/closed record, select the complete record by clicking on the record keyword.

    >**Info:** This selects the **Expressions** tab, which gives the option to make a record a closed record.

    <img src="/learn/images/vs-code-extension/statement-editor/closed-record.gif" class="cInlineImage-half"/>

8. Once the record field configuration is done, click **Save**.
