---
title: 'Bridge Salesforce with disparate data sources'
description: "Data about products, customers, and sales transactions are often scattered across various systems, databases, and business units. Ballerina, with its rich set of connectors and data handling capabilities, can link Salesforce with all relevant data sources.<br/><br/><i>Example: Load product data from a MySQL database to Salesforce.</i>"
url: 'https://github.com/chathurace/integration-samples/blob/main/salesforce_api/mysql-record-to-sfdc-new-product/main.bal'
---
```
salesforce:Client salesforce = check new ({
    baseUrl: salesforceBaseUrl,
    auth: {
        token: salesforceAccessToken
    }
});

public function main() returns error? {
    mysql:Client mysql = check new (host, user, password, database, port);
    stream<ProductRecieved, error?> streamOutput = mysql->query(
        `SELECT name, unitType, currencyISO, productId FROM products WHERE processed = false`);
    ProductRecieved[] productsRecieved = check from ProductRecieved items in streamOutput
        select items;
    foreach ProductRecieved prductRecieved in productsRecieved {
        Product product = {
            Name: prductRecieved.name,
            Product_Unit__c: prductRecieved.unitType,
            CurrencyIsoCode: prductRecieved.currencyISO
        };
        _ = check salesforce->create("Product2", product);
        _ = check mysql->execute(
            `UPDATE products SET processed = true WHERE productId = ${prductRecieved.productId}`);
    }
}
```
