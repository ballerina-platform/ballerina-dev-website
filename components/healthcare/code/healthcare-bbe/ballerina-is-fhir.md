---
title: 'FHIR? Ballerina is FHIR'
description: With built-in support for FHIR (Fast Healthcare Interoperability Resources), Ballerina makes it easy to develop and deploy healthcare applications that can exchange and process FHIR resources. Ballerina's native FHIR capabilities enable healthcare developers to build scalable and flexible healthcare solutions that can adapt to changing healthcare needs and standards.
url: 'https://github.com/ballerina-guides/healthcare-samples/blob/main/working-with-fhir/working_with_fhir_parsing.bal'
---
```
public function main() returns error? {
    // The following example is a simple serialized Patient resource to parse
    json input = {
        "resourceType": "Patient",
        "name": [
            {
                "family": "Simpson"
            }
        ]
    };

    // Parse it - you can pass the input (as a string or a json) and the
    // type of the resource you want to parse.
    international401:Patient patient = check fhirParser:parse(input).ensureType();

    // Access the parsed data
    fhir:HumanName[]? names = patient.name;
    if names is () || names.length() == 0 {
        return error("Failed to parse the names");
    }
    io:println("Family Name: ", names[0]);
}
```