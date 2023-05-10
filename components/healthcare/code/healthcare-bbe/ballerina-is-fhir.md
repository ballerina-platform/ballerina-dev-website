---
title: 'FHIR ? Ballerina is FHIR'
description: With built-in support for FHIR (Fast Healthcare Interoperability Resources), Ballerina makes it easy to develop and deploy healthcare applications that can exchange and process FHIR resources. Ballerina's native FHIR capabilities enables healthcare developers to build scalable and flexible healthcare solutions that can adapt to changing healthcare needs and standards.
url: 'https://github.com/ballerina-guides/healthcare-samples/blob/main/working_with_fhir/working_with_fhir_parsing.bal'
---
```
public function main() returns error? {

    // The following example is a simple serialized Patient resource to parse
    string input = "{" +
    "\"resourceType\" : \"Patient\"," +
    "  \"name\" : [{" +
    "    \"family\": \"Simpson\"" +
    "  }]" +
    "}";

    // Parse it - you can pass the input string or a json as input and the 
    // type of the resource you want to parse.
    fhir:Patient patient = check fhirParser:parse(input, fhir:Patient).ensureType();

    // Access the parsed data
    fhir:HumanName[] names = patient.name ?: [];
    io:println("Family Name: ", names[0].family);
}
```