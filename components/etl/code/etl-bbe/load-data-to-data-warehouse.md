---
title: 'Loading Data to a Data Warehouse with Ballerina'
description: "Unlock the power of Ballerina for smooth and efficient data loading 
from CSV to a data warehouse, making your data analysis journey a breeze.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/reviewSummary/main.bal'
phase: 'Loadings'
---
```
configurable string bigQueryAccessToken = ?;
configurable string projectId = ?;
configurable string datasetId = ?;
configurable string tableId = ?;

bigquery:Client bigQueryClient = check new ({auth : {token: bigQueryAccessToken}});

public function main() returns error? {
    LeadAnalyticsData[] leadsData = check io:fileReadCsv("./resources/leads_data.csv");
    bigquery:TabledatainsertallrequestRows[] rows = from var lead in leadsData 
                                                        select {insertId: uuid:createType1AsString(), 'json: lead};
    bigquery:TableDataInsertAllRequest payload = {rows};
    _ = check bigQueryClient->insertAllTableData(projectId, datasetId, tableId, payload);
}
```
