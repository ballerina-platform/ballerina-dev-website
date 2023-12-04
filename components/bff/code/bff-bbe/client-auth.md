---
title: 'Securely interact with internal/external services'
description: Ballerina back-ends can securely call services with the necessary security features such as client-side OAuth2, mutual TLS, and JWT-encapsulated user data.
url: 'https://github.com/ballerina-guides/bff-samples/tree/main/securely_consume_services_from_backends'
---
```
service /logistics on new http:Listener(9090) {
    resource function post cargos(Cargo cargo) 
            returns http:Ok|http:InternalServerError {
        cargoTable.add(cargo);
        http:Client serviceClient = getServiceClient(cargo.cargoType);
        http:Response|error res = serviceClient->post("/shipments", cargo);
        if res is http:Response && res.statusCode == 202 {
            return <http:Ok>{body: "Successfully submitted the shipment"};
        }
        return <http:InternalServerError>{
            body: {message: "Error occurred while submitting the shipment"}
        };
    };

    resource function get cargos() returns Cargo[] {
        return cargoTable.toArray();
    };
}
```
