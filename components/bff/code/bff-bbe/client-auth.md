---
title: 'Securely interact with internal and external services'
description: In today's IT environments where services are scattered across on-premises and cloud, no link is guaranteed to be secure. Therefore, strict security measures need to be enforced on all links. Ballerina-powered backends can securely call services - whether on-premise, in a private cloud, or SaaS - with the necessary security features such as client-side OAuth2, mutual TLS, and JWT-encapsulated user data.
---
```
import ballerina/log;
import ballerina/http;

configurable string cargoWaveUrl = ?;
configurable string issuer = ?;
configurable string audience = ?;
configurable string jwksUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

service /logistics on new http:Listener(9090) {
    
    resource function post cargo(Cargo cargo) returns http:Ok|http:InternalServerError? {
        cargoTable.push(cargo);
        do {
            http:Client cargoWave = check new (cargoWaveUrl, auth = {
                tokenUrl: issuer,
                clientId: clientId,
                clientSecret: clientSecret
            }, secureSocket = {
                key: {
                    certFile: "../resource/path/to/public.crt",
                    keyFile: "../resource/path/to/private.key"
                },
                cert: "./resources/public.cer"
            });
            http:Response cargoWaveResponse = check cargoWave->post("/shipments", cargo);
            if cargoWaveResponse is http:Response && cargoWaveResponse.statusCode == 202 {
                http:Ok res = {
                    body: "Successfully submitted the shipment request"
                };
                return res;    
            } else {
                fail error ("Shipment processing failed.");   
            }
        } on fail error e {
            string errMsg = "Failed to submit the shipment request. " + e.message();
            log:printError(errMsg);
            http:InternalServerError res = {
                body: {message: errMsg}
            };
            return res;    
        }
    }
}
```
