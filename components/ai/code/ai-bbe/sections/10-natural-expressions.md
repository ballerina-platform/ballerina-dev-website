---
title: 'Code where code is clearer. Words where words are clearer.'
id: 'natural-expressions'
description: "Use runtime natural expressions to describe bounded tasks in plain language and receive results shaped by an expected Ballerina type. Combine these expressions with ordinary code for validation, error handling, and downstream integration."
details: "A model reads a free-form return request. Ordinary code then checks the input, validates constraints, looks up the order in the system of record, and returns a distinct HTTP status for each failure. A natural expression is a language construct that calls a model at run time through an `ai:ModelProvider`. It is an experimental feature that requires Ballerina 2201.13.0 or later and the `--experimental` flag on `bal build`, `bal run`, and `bal test`. The result conforms to the expected type or the expression returns an error, but conformance does not make the values true, so treat them like any other external input. Compile-time code generation (`@natural:code`, `const natural`) is a separate, development-time feature. See [AI-assisted development](/use-cases/ai/ai-assisted-development/)."
guide: { label: 'Use natural expressions in an integration', url: '/learn/work-with-llms-using-natural-expressions/' }
samples:
  - { label: 'Rate blog posts using natural expressions (GitHub)', url: 'https://github.com/ballerina-guides/ai-samples/tree/main/rate-blog-posts-using-natural-expressions' }
tabs:
  - { key: 'code', title: 'Code' }
---
