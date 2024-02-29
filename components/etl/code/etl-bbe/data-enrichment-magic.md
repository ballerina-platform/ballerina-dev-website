---
title: 'Data enrichment magic'
description: "Ballerina streamlines data enrichment, simplifying the journey from data extraction from databases or APIs to adding depth and context to your insights."
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/enrich-data/main.bal'
phase: 'Transformations'
---
```
final http:Client geocodingClient = check new ("https://maps.googleapis.com");

isolated service /api/v1 on new http:Listener(8080) {
    resource function post customerWithGeoCode(Customer customer) returns GeoTaggedCustomer|error {
        GeocodeResponse response = check geocodingClient->
            /maps/api/geocode/'json(address = customer.address, key = geocodingAPIKey);
        if response.status == "OK" {
            return {
                ...customer,
                latitude: response.results[0].geometry.location.lat,
                longitude: response.results[0].geometry.location.lng
            };
        }
        return error("Error while getting the location information.");
    }
}
```
