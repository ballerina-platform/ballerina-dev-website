---
title: 'Securely interact with internal and external services'
description: In today's IT environments where services are scattered across on-premises and cloud, no link is guaranteed to be secure. Therefore, strict security measures need to be enforced on all links. Ballerina-powered backends can securely call services - whether on-premise, in a private cloud, or SaaS - with the necessary security features such as client-side OAuth2, mutual TLS, and JWT-encapsulated user data.
url: 'https://github.com/SasinduDilshara/BFF-Samples/tree/dev/ballerina_microservices_jwt_asgardio'
---
```
import ballerina/http;
import ballerina/log;

import ballerina_microservices_jwt_asgardio.cargoWave as _;
import ballerina_microservices_jwt_asgardio.tradeLogix as _;
import ballerina_microservices_jwt_asgardio.shipEx as _;

configurable string issuer = ?;
configurable string audience = ?;
configurable string jwksUrl = ?;
configurable string clientSecret = ?;
configurable string cargoWaveUrl = ?;
configurable string shipExUrl = ?;
configurable string tradeLogixUrl = ?;

@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service /logistics on new http:Listener(9090) {
    resource function post cargos(Cargo cargo) returns http:InternalServerError|error|http:Ok {
        cargoTable.add(cargo);
        do {
            string url = cargo.'type == SHIPEX ? shipExUrl
                : cargo.'type == CARGO_WAVE ? cargoWaveUrl : tradeLogixUrl;
            log:printInfo("Shipment request response status code is " + url);
            http:Client serviceClient = check new (url, auth = {
                    tokenUrl: issuer,
                    clientId: audience,
                    clientSecret: clientSecret,
                    scopes: ["cargo_read"]
                }
            secureSocket = {
                key: {
                    certFile: "../resource/path/to/public.crt",
                    keyFile: "../resource/path/to/private.key"
                },
                cert: "./resources/public.cer"
            }
            );
            http:Response|http:ClientError serviceClientResponse = serviceClient->post("/shipments", cargo);
            if serviceClientResponse is http:Response && serviceClientResponse.statusCode == 202 {
                http:Ok res = {
                    body: "Successfully submitted the shipment request"
                };
                return res;
            }
            if serviceClientResponse is http:Response {
                log:printInfo(serviceClientResponse.statusCode.toString() + serviceClientResponse.reasonPhrase);
            }
            fail error(string `Shipment processing failed.`);
        } on fail error e {
            string errMsg = "Failed to submit the shipment request. " + e.message();
            log:printError(errMsg);
            http:InternalServerError res = {
                body: {message: errMsg}
            };
            return res;
        }
        return error("Internal server error occurred.");
    }

    resource function get cargos() returns Cargo[] {
        return cargoTable.toArray();
    };
}
```
