---
title: 'Synchronize Salesforce with real-time data'
description: In enterprises, business data like inventory levels, order statuses, or product prices change constantly. Ballerina, with its large set of connectors and streaming capabilities, can keep Salesforce in sync with such real-time data sources.
url: 'https://github.com/chathurace/integration-samples/blob/main/salesforce_api/kafka_salesforce_integration/kafka-salesforce-pricebook_update/main.bal'
---
```
import ballerinax/kafka;
import ballerinax/salesforce;

configurable string salesforceAccessToken = ?;
configurable string salesforceBaseUrl = ?;
configurable string salesforcePriceBookId = ?;

public type ProductPrice readonly & record {|
    string name;
    float unitPrice;
|};

public type ProductPriceUpdate readonly & record {|
    float UnitPrice;
|};

listener kafka:Listener orderListener = new (kafka:DEFAULT_URL, {
    groupId: "order-group-id",
    topics: "product_price_updates"
});

final salesforce:Client salesforce = check new ({
    baseUrl: salesforceBaseUrl,
    auth: {
        token: salesforceAccessToken
    }
});

service on orderListener {
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
