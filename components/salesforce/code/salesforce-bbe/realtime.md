---
title: 'Synchronize Salesforce with real-time data'
description: 'Information such as inventory levels, order statuses, or product prices change constantly. Ballerina, with its large set of connectors and streaming capabilities, can keep Salesforce in sync with such real-time data sources.<br/><br/><i>Example: Update Salesforce price books by listening to price details published to a Kafka topic.</i>'
url: 'https://github.com/chathurace/integration-samples/blob/main/salesforce_api/kafka_salesforce_integration/kafka-salesforce-pricebook_update/main.bal'
---
```
listener kafka:Listener priceListener = new (kafka:DEFAULT_URL, {
    groupId: "order-group-id",
    topics: "product-price-updates"
});

final salesforce:Client salesforce = check new ({
    baseUrl: salesforceBaseUrl,
    auth: {
        token: salesforceAccessToken
    }
});

service on priceListener {
    isolated remote function onConsumerRecord(ProductPrice[] prices) returns error? {
        foreach ProductPrice {name, unitPrice} in prices {
            stream<record {}, error?> retrievedStream = check salesforce->query(
                string `SELECT Id FROM PricebookEntry 
                    WHERE Pricebook2Id = '${salesforcePriceBookId}' AND 
                    Name = '${name}'`);
            record {}[] retrieved = check from record {} entry in retrievedStream
                select entry;
            anydata pricebookEntryId = retrieved[0]["Id"];
            if pricebookEntryId is string {
                ProductPriceUpdate updatedPrice = {UnitPrice: unitPrice};
                check salesforce->update("PricebookEntry", pricebookEntryId, updatedPrice);
            }
        }
    }
}
```
