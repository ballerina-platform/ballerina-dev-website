---
title: 'Connect to EMRs, EHRs, data sources and more'
description: Ballerina has 100s of connectors to well known Health Systems such as Epic, Cerner, Athena, non health systems such as Salesforce, and can connect to any backend that has a FHIR, HL7 or Open API interface. Go below the hood and connect directly to a database as well if that’s the only way to fetch data.
url: 'https://github.com/ballerina-guides/healthcare-samples/blob/main/working_with_fhir_connector/working_with_fhir_connector.bal'
---
```
// Create a FHIR client configuration by providing the connection parameters
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

// Create a FHIR client using the configuration
final fhirClient:FHIRConnector fhirConnectorObj = check new (cernerConfig);

public function main() returns error? {
   // Get a patient resource by id using the initialized FHIR client
   fhirClient:FHIRResponse fhirResponse = check fhirConnectorObj->getById("Patient", "12724067");
   // Print the response
   io:println("Cerner EMR response: ", fhirResponse.'resource);
}
```