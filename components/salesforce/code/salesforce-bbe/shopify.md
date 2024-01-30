---
title: 'Connect Salesforce with e-commerce platforms'
description: "E-commerce platforms like Shopify and WooCommerce are the main points of customer interactions. Ballerina can utilize packages in its <a href='https://central.ballerina.io/ballerina-library'>library</a> to listen for events like customer registrations, contact updates, or order placements from such platforms and propagate those changes to Salesforce.<br/><br/><i>Example: Update customer records in Salesforce, when customer data is updated in Shopify.</i>"
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/shopify-customer-to-salesforce-customer'
---
```
service /salesforce_bridge on new http:Listener(9090) {
    resource function post customers(ShopifyCustomer shopifyCustomer) returns error? {
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
        stream<Id, error?> customerStream = check salesforce->query(
            string `SELECT Id FROM HmartCustomer__c WHERE Email__c = '${salesforceCustomer.Email__c}'`);
        record {|Id value;|}? existingCustomer = check customerStream.next();
        check customerStream.close();
        if existingCustomer is () {
            _ = check salesforce->create("HmartCustomer__c", salesforceCustomer);
        } else {
            check salesforce->update("HmartCustomer__c",
                existingCustomer.value.Id, salesforceCustomer);
        }
    }
}
```
