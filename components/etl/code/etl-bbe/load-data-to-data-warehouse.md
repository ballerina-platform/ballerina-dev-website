---
title: 'Loading Data to a Data Warehouse with Ballerina'
description: "Unlock the power of Ballerina for smooth and efficient data loading 
from CSV to a data warehouse, making your data analysis journey a breeze.
"
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/load-data-to-bigquery/main.bal'
phase: 'Loadings'
---
```
final bigquery:Client bigQueryClient = check new ({auth: {token: bigQueryAccessToken}});

public function main() returns error? {
    SocialMediaInteraction[] interactions = check io:fileReadCsv("./resources/interactions.csv");
    bigquery:TabledatainsertallrequestRows[] rows = from var interaction in interactions
        select {insertId: uuid:createType1AsString(), 'json: interaction};
    bigquery:TableDataInsertAllRequest payload = {rows};
    _ = check bigQueryClient->insertAllTableData(projectId, datasetId, tableId, payload);
}
```
