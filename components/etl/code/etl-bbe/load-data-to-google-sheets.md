---
title: 'Seamless Data Loading to Google Sheets with Ballerina'
description: "Experience the simplicity of loading data values into Google Sheets using Ballerina, 
turning your spreadsheets into dynamic, data-driven tools.
"
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/load-data-to-gsheet/main.bal'
phase: 'Loadings'
---
```
function loadToGoogleSheet(string sheetName, string workSheetName, SalesSummary[] salesSummary) returns error? {
    sheets:Spreadsheet spreadsheet = check spreadsheetClient->createSpreadsheet(sheetName);
    string spreadSheetId = spreadsheet.spreadsheetId;

    check spreadsheetClient->renameSheet(spreadSheetId, "Sheet1", workSheetName);

    _ = check spreadsheetClient->appendValue(spreadSheetId, ["Product", "Sales"], {sheetName: workSheetName});
    foreach var {product, sales} in salesSummary {
        _ = check spreadsheetClient->appendValue(spreadSheetId, [product, sales], {sheetName: workSheetName});
    }
}}
}
```
