---
title: 'Prompts at build time. Plain Ballerina at run time.'
id: 'natural-programming-complie-time-code-generation'
description: "Generate code from a prompt while the project compiles. Annotate an external function with `@natural:code` to have the compiler generate its body, or use a `const natural` expression to generate typed constant data, such as realistic test fixtures."
details: "Compile-time code generation is an **experimental** language feature, introduced in Ballerina 2201.13.0 and still available in 2201.14.0 through the `ballerina/ai.np` compiler extension. Builds need the `--experimental` flag and a code-generation service configured through the `BAL_CODEGEN_URL` and `BAL_CODEGEN_TOKEN` environment variables, which the VS Code command **Ballerina: Configure default WSO2 model provider** sets up (platform-specific). The model runs during the build, not when the program runs. Review and test the generated code as you would any other code. This is different from [runtime natural expressions](/use-cases/ai/#natural-expressions), which call a model each time the program runs."
links:
  - { label: 'Release notes: compile-time code generation (2201.13.0)', url: '/downloads/swan-lake-release-notes/swan-lake-2201.13.0/#compile-time-code-generation', action: 'Read the release notes' }
  - { label: 'ballerina/ai.np API documentation', url: 'https://lib.ballerina.io/ballerina/ai.np/latest/', action: 'View the API docs' }
  - { label: 'Filter products using compile-time code generation', url: 'https://github.com/ballerina-guides/ai-samples/tree/main/filter-products-using-compile-time-code-generation' }
tabs:
  - { key: 'function', title: 'Generated function body' }
  - { key: 'const', title: 'Compile-time data generation' }
---
