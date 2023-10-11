---
title: 'Streamline web data handling in backends'
description: Web and mobile apps often transmit users' input as JSON payloads, requiring backends to handle JSON data extensively. It is also common to exchange large binary payloads between front ends and back ends. <br><br>With Ballerina's native JSON capabilities, JSON data can be mapped to Ballerina records, enabling simple and flexible data manipulation with features like constraint validations, transformations, and enrichments. In addition, Ballerina has built-in support for intutuively and efficiently handle web-based data with multi-part payloads, compressions, caching and content type enforcements. 

url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_rest_payload_validation'
---
```
import ballerina/constraint;
import ballerina/http;
import ballerina/io;
import ballerina/mime;

public type CustomerRegistrationData record {|
    @constraint:String {
        pattern: {
            value: re `[A-Za-z]+`,
            message: "Invalid first name"
        }
    }
    string firstName;

    @constraint:String {
        pattern: {
            value: re `[A-Za-z]+`,
            message: "Invalid last name"
        }
    }
    string lastName;

    @constraint:String {
        pattern: {
            value: re `\d{1,3},\s*[a-zA-Z]{1,12},\s*[a-zA-Z]{1,12},\s*[a-zA-Z]{1,8}`,
            message: "Invalid Address"
        }
    }
    string address;

    @constraint:Int {
        minValue: {
            value: 0,
            message: "Dependent count should be greater than 0"
        }, 
        maxValue: {
            value: 10,
            message: "Dependent count should be less than 10"
        }
    }
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
            return <http:BadRequest>{body: {message: "Error while parsing the request body parts"}};
        }
        string|error registrationDataString = bodyParts[0].getText();
        if registrationDataString is error {
            return <http:InternalServerError>{body: {message: "Error while registering the customer"}};
        }
        json|error registrationDataJson = registrationDataString.fromJsonString();
        if registrationDataJson is error {
            return <http:InternalServerError>{body: {message: "Error while registering the customer"}};
        }
        CustomerRegistrationData|error registrationDataRec = registrationDataJson.cloneWithType();
        if registrationDataRec is error {
            return <http:InternalServerError>{body: {message: "Error while registering the customer"}};
        }
        CustomerRegistrationData|error registrationData = constraint:validate(registrationDataRec);
        byte[]|error agreemntForm = bodyParts[1].getByteArray();
        byte[]|error image = bodyParts[2].getByteArray();
        if registrationData is error || agreemntForm is error || image is error {
            return handleErrorRequests(registrationData, agreemntForm, image);
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

    resource function get customers() returns  CustomerRegistrationData[] {
        return customerTable.toArray();
    }
}

function getAgreementForm(string s) returns byte[]|error {
    string filePath = getAgreementFormPath(s);
    return check io:fileReadBytes(filePath);
}

function registerCustomer(CustomerRegistrationData registrationData, byte[] agreemntForm, byte[] logoImage) returns string|error =>
     registerAndGetId(registrationData, agreemntForm, logoImage);
```