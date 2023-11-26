---
title: 'Connect Salesforce with e-commerce platforms'
description: "E-commerce platforms like Shopify and WooCommerce are the main points of customer interactions. Ballerina can listen for events from such platforms like customer registrations, contact updates, or order placements, and propagate those changes to Salesforce.<br/><br/><i>Example: Update customer records in Salesforce, when customer data is updated in Shopify.</i>"
url: 'https://github.com/chathurace/integration-samples/blob/main/shopify-customer-to-salesforce-customer/main.bal'
---
```
sf:Client salesforce = check new (salesforceConfig);

service /salesforce_bridge on new http:Listener(9090) {
    resource function post customers(@http:Payload ShopifyCustomer shopifyCustomer) returns error? {
        string firstName = shopifyCustomer.first_name ?: regex:split(shopifyCustomer.email, "@")[0];
        string lastName = shopifyCustomer.last_name ?: "";
        Address? shopifyAddress = shopifyCustomer.default_address;
        string address = (shopifyAddress !is ()) ? string `${shopifyAddress.address1}, 
        ${shopifyAddress.address2}, ${shopifyAddress.city}, ${shopifyAddress.country}` : "";
        SalesforceCustomer salesforceCustomer = {
            Name: string `${firstName} ${lastName}`,
            Email__c: shopifyCustomer.email,
            Address__c: address
        };
        stream<Id, error?> customerQuery = check salesforce->query(
            string `SELECT Id FROM HmartCustomer__c WHERE Email__c = '${salesforceCustomer.Email__c}'`);
        record {|Id value;|}? existingCustomer = check customerQuery.next();
        check customerQuery.close();
        if existingCustomer is () {
            _ = check salesforce->create("HmartCustomer__c", salesforceCustomer);
        } else {
            check salesforce->update("HmartCustomer__c", existingCustomer.value.Id, salesforceCustomer);
        }

    }
}
```
