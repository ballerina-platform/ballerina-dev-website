---
title: 'Seamless Data Loading to Google Sheets with Ballerina'
description: "Experience the simplicity of loading data values into Google Sheets using Ballerina, 
turning your spreadsheets into dynamic, data-driven tools.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/reviewSummary/main.bal'
phase: 'Loadings'
---
```
public function aggregateSalesData(ItemData[] salesData) returns SalesSummary[] {
    return from var {productId, unitPrice, quantity} in salesData
        let float productSales = unitPrice * quantity
        group by productId
        select {productId, sales: sum(productSales)};
}

public function loadToGoogleSheet(string sheetName, SalesSummary[] salesSummary) returns error? {
    sheets:Spreadsheet spreadsheet = check spreadsheetClient->createSpreadsheet(sheetName);
    string spreadSheetId = spreadsheet.spreadsheetId;

    _ = check spreadsheetClient
            ->appendValue(spreadSheetId, ["Product", "Sales"], {sheetName: sheetName});
    foreach var {productId, sales} in salesSummary {
        _ = check spreadsheetClient->appendValue(
            spreadSheetId, [productId, sales], {sheetName});
    }
}
```
