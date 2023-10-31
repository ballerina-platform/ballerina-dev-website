---
title: 'Streamline Backend Data Handling'
description: Ballerina has built-in support for multi-part payloads, constraint validations, transformations, and, enrichments for working with complex payloads.

url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_rest_payload_validation'
---
```
type Customer record {|
    string id;
    @constraint:String {
        pattern: { value: re `[A-Za-z]+`, message: "Invalid first name" }
    }
    string name;
|};

service /crm on new http:Listener(9090) {
    resource function post customers/[string customerId]
            /agreement(http:Request request) returns http:Created|error {
        mime:Entity[] bodyParts = check request.getBodyParts();
        byte[] agreemntForm = check bodyParts[0].getByteArray();
        check submitAgreementForm(customerId, agreemntForm);
        return <http:Created>{body: {message: string `Customer ID: ${customerId}`}};
    }
    
    resource function post customers(Customer customer) returns Customer {
        customerTable.add(customer);
        return customer;
    }
}
```