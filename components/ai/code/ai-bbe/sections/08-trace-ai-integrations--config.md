---
lang: toml
---
```
# Ballerina.toml (bal new adds this by default)
[build-options]
observabilityIncluded = true

# Config.toml: turn tracing on at run time, no import needed
[ballerina.observe]
tracingEnabled = true
tracingProvider = "otel"

[ballerina.otel]
tracesEndpoint = "http://localhost:4317"   # OTLP over gRPC: Jaeger or any OpenTelemetry collector
# In production, sample a fraction of requests with tracesSampler and tracesSamplerArg.

# On startup:
# ballerina: started publishing traces to Otel on http://localhost:4317 [gRPC]
```
