---
title: 'Streamline web data handling in backends'
description: Web and mobile apps often transmit users' input as JSON payloads, requiring backends to handle JSON data extensively. It is also common to exchange large binary payloads between front ends and back ends. <br><br>With Ballerina's native JSON capabilities, JSON data can be mapped to Ballerina records, enabling simple and flexible data manipulation with features like constraint validations, transformations, and enrichments. In addition, Ballerina has built-in support for intutuively and efficiently handle web-based data with multi-part payloads, compressions, caching and content type enforcements. 

url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/edi-in-business-apps/main.bal'
---
```
type CustomerRegistrationData record {|
    @constraint:String { pattern: re `[A-Za-z]+` }
    string firstName;

    @constraint:String { pattern: re `[A-Za-z]+` }
    string lastName;

    @constraint:String { pattern: re `\d{3},0\s*,[a-zA-Z]{12},0\s*,[a-zA-Z]{12},,0\s*,[a-zA-Z]{8}` }
    string address;

    @constraint:Int { minValue: 0, maxValue: 10 }
    int dependents;
|};

@http:ServiceConfig {
    chunking: "ALWAYS",
    compression: {
        enable: http:COMPRESSION_ALWAYS,
        contentTypes: ["application/json", "text/plain"]
    },
    cors: {
        allowOrigins: ["*"]
    }
}
service /crm on new http:Listener(9090) {

    @http:ResourceConfig {
        consumes: ["multipart/form-data"],
        produces: ["application/json"]
    }

    resource function post customers(http:Request request) returns 
            http:BadRequest|http:InternalServerError|http:Created {
        mime:Entity[]|error bodyParts = request.getBodyParts();
        if bodyParts is error {
            return <http:BadRequest>{body: {message: "Error while parsing the request body"}};
        }
        CustomerRegistrationData|error registrationData = bodyParts[0].getJson().ensureType();
        byte[]|error agreemntForm = bodyParts[1].getByteArray();
        byte[]|error image = bodyParts[2].getByteArray();
        if registrationData is error || agreemntForm is error || image is error {
            return <http:BadRequest>{body: {message: "Error while parsing the request body"}};
        }
        string|error customerId = registerCustomer(
            registrationData, agreemntForm, image);
        if customerId is error {
            return <http:InternalServerError>{body: {message: "Error while registering the customer"}};
        }
        return <http:Created>{body: {status: "Customer registered successfully.", customerId: customerId}};
    }
    
    @http:ResourceConfig {
        produces: ["application/pdf"]
    }
    resource function get customers/[string customerId]/agreement() returns @http:Cache {maxAge: 15} byte[]|http:NotFound {
        byte[]|error agreementForm = getAgreementForm(customerId);
        if agreementForm is error {
            return <http:NotFound>{body: {message: "Agreement form not found for the customer ID: " + customerId}};
        }
        return agreementForm;   
    }
}
```