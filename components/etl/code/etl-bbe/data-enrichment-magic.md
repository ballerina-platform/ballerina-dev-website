---
title: 'Data Enrichment Magic'
description: "Watch your data come to life as Ballerina's enchanting data enrichment capabilities add depth and context to your insights.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/DataEnrich/main.bal'
phase: 'Transformations'
---
```
final http:Client geocodingClient = check new ("https://maps.googleapis.com");

service /api/v1 on new http:Listener(8080) {
    resource function get customerWithGeoCode(Customer customer) returns GeoTaggedCustomer|error {
        GeocodeResponse response = check geocodingClient->
            /maps/api/geocode/'json.get(address=customer.address, key=geocodingAPIKey);
        if response.status == "OK" {
            return {
                ...customer,
                lattitude: response.results[0].geometry.location.lat,
                longitude: response.results[0].geometry.location.lng
            };
        }
        return error("Error while getting the location information.");
    }
}
```