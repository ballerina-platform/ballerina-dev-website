---
title: 'See every call. Understand every step.'
id: 'trace-ai-integrations'
description: "Trace model calls, retrieval, tool execution, and downstream requests. Inspect latency, token usage, and failures to understand how an AI integration behaves."
details: "When an answer is slow, costly, or wrong, the trace shows which model call, retrieval, tool, or backend request was responsible. Tracing needs no code changes: include observability at build time and enable the `otel` provider at run time to export OpenTelemetry spans to Jaeger or any OTLP collector. This configuration is for Ballerina 2201.14.0; earlier updates use the Jaeger provider shown in the tracing BBE. Spans record the messages sent and received, tool arguments and outputs, timings, token counts, and errors. They do not show the model's internal reasoning, and they can contain customer data, so restrict access to them and sample in production."
guide: { label: 'Observe and secure AI integrations', url: '/learn/observe-and-secure-ai-integrations/' }
samples:
  - { label: 'Complete claims assistant sample (in the guide)', url: '/learn/observe-and-secure-ai-integrations/#the-complete-sample-code' }
  - { label: 'View traces in Jaeger', url: '/learn/supported-observability-tools-and-platforms/jaeger/' }
tabs:
  - { key: 'code', title: 'Code' }
---
