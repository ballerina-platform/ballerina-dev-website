---
title: 'Bridge Salesforce with disparate data sources'
description: "Data about products, customers, and sales transactions are often scattered across various systems, databases, and business units. With its rich set of connectors and data handling capabilities, Ballerina can link Salesforce with all relevant data sources.<br/><br/><i>Example: Load product data from a MySQL database to Salesforce.</i>"
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/mysql-record-to-salesforce-new-product'
---
```
public function main() returns error? {
    stream<ProductRecieved, error?> streamOutput = mysql->query(
        `SELECT name, unitType, currencyISO, productId FROM products WHERE processed = false`);
    record {|ProductRecieved value;|}|error? productRecieved = streamOutput.next();
    while productRecieved !is error|() {
        Product product = {
            Name: productRecieved.value.name,
            Product_Unit__c: productRecieved.value.unitType,
            CurrencyIsoCode: productRecieved.value.currencyISO
        };
        _ = check salesforce->create("Product2", product);
        _ = check mysql->execute(
            `UPDATE products SET processed = true WHERE productId = ${productRecieved.value.productId}`);
        productRecieved = streamOutput.next();
    }
}
```
