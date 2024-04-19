---
title: 'Loading data to a data warehouse'
description: "Ballerina's integration and security capabilities simplify the loading of transformed data securely into on-prem or SaaS data warehouses."
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
