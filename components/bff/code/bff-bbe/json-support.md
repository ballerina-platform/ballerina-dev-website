---
title: 'Streamline back-end data handling'
description: Ballerina has built-in support for multi-part payloads, constraint validations, transformations, and, enrichments for working with complex payloads.
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/handle-mulipart-form-data'
---
```
service /crm on new http:Listener(9090) {
    
    resource function get customers/[string customerId]/agreement() 
            returns byte[]|http:InternalServerError {
        byte[]|error agreementForm = getAgreementForm(customerId);
        if agreementForm is error {
            return http:INTERNAL_SERVER_ERROR;
        }
        return agreementForm;
    }

    resource function post customers(http:Request request) 
                returns http:Created|http:InternalServerError {
        do {
            mime:Entity[] bodyParts = check request.getBodyParts();
            string formData = check bodyParts[0].getText();
            CustomerData data = check formData.fromJsonStringWithType();
            byte[] image = check bodyParts[1].getByteArray();
            byte[] agreemntForm = check bodyParts[2].getByteArray();
            check registerCustomer(data, agreemntForm, image);
            return http:CREATED;
        } on fail {
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```