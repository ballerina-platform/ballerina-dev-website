---
title: "OpenAPI; from spec to code and backwards"
description: "Ballerina OpenAPI tool supports generating client/service code using OpenAPI specification. It also can generate an OpenAPI specification for a given REST service."
url: "https://ballerina.io/learn/openapi-tool"
---

```
// Generate service code using Ballerina OpenAPI tool
bal openapi -i social_media_service.yaml --mode service

// Generate client code using Ballerina OpenAPI tool
bal openapi -i social_media_service.yaml --mode client

// Generate OpenAPI specificatoin using service code
bal openapi -i social_media_service.bal -o social_media_service.yaml

```
