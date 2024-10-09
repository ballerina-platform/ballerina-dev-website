---
title: 'Connect to EMRs, EHRs, data sources and more'
description: Ballerina has 100s of connectors for well-known Health Systems such as Epic, Cerner, athenahealth, and non-healthcare systems such as Salesforce, and can connect to any backend that has a FHIR, HL7, or Open API interface. Additionally, Ballerina allows you to go below the hood and connect directly to a database if that is the only way to fetch data.
url: 'https://github.com/ballerina-guides/healthcare-samples/blob/main/working-with-fhir-connector/working_with_fhir_connector.bal'
---
```
// Create a FHIR client configuration
fhirClient:FHIRConnectorConfig cernerConfig = {
    baseURL: base,
    mimeType: fhirClient:FHIR_JSON,
    authConfig: {
        tokenUrl: tokenUrl,
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: scopes
    }
};

// Create a FHIR client
final fhirClient:FHIRConnector fhirConnectorObj = check new (cernerConfig);

public function main() returns error? {
    // Get a patient resource by id
    fhirClient:FHIRResponse fhirResponse = check fhirConnectorObj->getById("Patient", "12724067");
    io:println("Cerner EMR response: ", fhirResponse.'resource);

    // Search for patients who has the given name "John" and birthdate greater than 2000-01-01
    fhirClient:FHIRResponse searchResponse = check fhirConnectorObj->search("Patient", {
        "given": "John",
        "birthdate": "gt2000-01-01"
    });
    io:println("Cerner EMR search response: ", searchResponse.'resource);
}
```