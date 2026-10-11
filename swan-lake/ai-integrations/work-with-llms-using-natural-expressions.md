---
layout: ballerina-working-with-llms-using-natural-expressions-left-nav-pages-swanlake
title: Use natural expressions in an integration
description: Combine natural language with Ballerina code, bind model responses to expected types, and validate the results before using them in an integration.
keywords: ballerina, AI, LLM, large language model, natural programming, natural expressions, integration
permalink: /learn/work-with-llms-using-natural-expressions/
active: work-with-llms-using-natural-expressions
intro: This guide shows how to use a natural expression as one step of an integration. You build an HTTP service that calls a large language model (LLM), binds the response to a Ballerina type, validates it, and handles failures before returning it to the caller.
---

## The scenario

A travel-booking platform wants to suggest attractions to customers based on the country they are visiting and their interests. The platform already exposes its features through REST APIs, so the suggestions must be returned from an HTTP endpoint as structured JSON that other services can consume without any further parsing.

The requirements are:

- Return a list of attractions, each with a name, a city, and a one-sentence highlight.
- Never return malformed or empty data to the caller, even if the model response is wrong.
- Distinguish between invalid requests, an unreachable model, and an unusable model response, so that callers and operators can react correctly.

## How it works

A natural expression is a Ballerina expression whose body is written in natural language. It runs against a model provider, and its result is bound to the *expected type* — the type of the variable that the expression is assigned to.

```
GET /attractions?country=..&interest=..&count=..
        │
        ▼
┌──────────────────────────┐   prompt + JSON schema of Attraction[]   ┌───────────┐
│  HTTP resource           │ ───────────────────────────────────────► │    LLM    │
│  1. validate input       │ ◄─────────────────────────────────────── │ (provider)│
│  2. natural expression   │           JSON response                  └───────────┘
│  3. validate the result  │
│  4. map errors to HTTP   │
└──────────────────────────┘
        │
        ▼
  Attraction[]  |  400 Bad Request  |  502 Bad Gateway
```

1. The resource checks the request parameters before spending a model call.
2. The natural expression sends the prompt, together with a JSON schema that is generated from the expected type (`Attraction[]`), to the model. The response is parsed and bound to `Attraction[]`. If the call fails or the response cannot be bound to the type, the expression evaluates to an `error`.
3. The bound value is checked against constraints that a type alone cannot express, such as non-empty strings and a maximum length.
4. Errors are mapped to HTTP status codes.

Natural expressions are best suited for steps where the input is free-form and the output has a well-defined shape. If you want to construct the prompt yourself or reuse it across calls, call the model provider's `generate` method directly instead. See [Direct LLM calls](/learn/by-example/direct-llm-calls/).

## Set up the prerequisites

To complete this guide, you need:

1. Ballerina 2201.13.0 (Swan Lake Update 13) or later. Install [Ballerina](/downloads/), or use the `bal dist pull` command to update an existing installation.

    ```
    $ bal dist pull 2201.13.0
    ```

2. Access to an LLM. This guide uses OpenAI and requires an OpenAI API key. To use a different provider, see [Use a different model provider](#use-a-different-model-provider).

3. A text editor.

    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed. Enable [experimental features](/learn/vs-code-extension/configure-the-extension/) for Ballerina.

4. A command terminal.

>**Note:** Natural expressions are an experimental feature. Pass the `--experimental` flag to `bal build`, `bal run`, and `bal test`.

## Create the package

Ballerina uses packages to group code. In the terminal, execute the command below to create a package for the integration.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new attraction_finder_service
```

This creates a directory named `attraction_finder_service` with the files below.

```
.
├── attraction_finder_service
│   ├── Ballerina.toml
│   └── main.bal
```

>**Tip:** Rename the automatically-created `main.bal` file to `service.bal` and remove the generated content.

## Configure the model provider

A natural expression needs an `ai:ModelProvider` value. Model providers for different LLM services are available as `ballerinax/ai.<provider>` packages, such as [`ballerinax/ai.openai`](https://central.ballerina.io/ballerinax/ai.openai/latest), [`ballerinax/ai.anthropic`](https://central.ballerina.io/ballerinax/ai.anthropic/latest), and [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest).

Declare the API key as a [configurable variable](/learn/configure-a-sample-ballerina-service/) so that it is never hard-coded, and create the model provider at the module level so that it is initialized once and shared by all requests.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);
```

Create a `Config.toml` file in the package root and add the key.

```toml
openAiApiKey = "<YOUR_OPENAI_API_KEY>"
```

>**Note:** Do not commit `Config.toml` files that contain secrets. In deployed environments, provide the value through an environment variable or a secret store instead. See [Provide values to configurable variables](/learn/provide-values-to-configurable-variables/).

### Use a different model provider

Because the rest of the integration depends only on the `ai:ModelProvider` type, you can switch providers by changing only the import and the initialization.

The `ballerina/ai` module also provides a default model provider, which lets you try out the integration without your own LLM keys.

```ballerina
final ai:ModelProvider model = check ai:getDefaultModelProvider();
```

>**Info: Requires tooling.** The configuration for the default model provider is generated by a command in the Ballerina VS Code extension (also available in WSO2 Integrator). Log in to WSO2 Copilot, open the VS Code command palette (`Ctrl + Shift + P` or `command + shift + P`) with the project open, and run `Configure default WSO2 Model Provider`. This adds the required configuration to the `Config.toml` file. The default model provider is subject to rate limits and other usage constraints, so use your own provider for production workloads.

![Configure the default model](/learn/images/ai_natural_expr_configure_default_model.png)

## Implement the integration

### Define the expected type

Define a [closed record](/learn/by-example/controlling-openness/) to represent an attraction. The record is used to generate the JSON schema that is sent to the model, and the documentation of each field is included in that schema. Describe what each field must contain in the documentation, instead of repeating the format in the prompt.

Use [constraint annotations](/learn/by-example/constraint-validations/) to record rules that the type alone cannot express. They are checked after the response is bound.

```ballerina
import ballerina/constraint;

# Represents a tourist attraction.
type Attraction record {|
    # The name of the attraction
    @constraint:String {minLength: 1}
    string name;
    # The city where the attraction is located
    @constraint:String {minLength: 1}
    string city;
    # A notable feature or highlight of the attraction, in one sentence
    @constraint:String {minLength: 1, maxLength: 250}
    string highlight;
|};
```

>**Tip:** Prefer closed records, flat structures, and union types of string literals (for a fixed set of values) for expected types. Deeply nested types are harder for smaller models to follow.

### Expose an HTTP resource

Add an HTTP service with a `GET` resource that accepts the country, the user's interest, and the number of attractions. The return type lists every possible outcome: the attractions on success, and a distinct status code for each kind of failure.

```ballerina
import ballerina/http;

const MAX_ATTRACTIONS = 10;

service on new http:Listener(8080) {
    resource function get attractions(string country, string interest, int count = 5)
            returns Attraction[]|http:BadRequest|http:BadGateway {
        if count < 1 || count > MAX_ATTRACTIONS {
            return <http:BadRequest>{body: string `count must be between 1 and ${MAX_ATTRACTIONS}`};
        }
        // ...
    }
}
```

Validating the input first rejects bad requests without calling the model, which limits cost and the amount of data sent to the provider.

### Call the model with a natural expression

Write the requirement in natural language inside `natural (model) { ... }`. Use interpolations (`${...}`) to insert in-scope values, such as the resource parameters, into the prompt. Assign the result to a variable of type `Attraction[]|error`, so that the expected type is `Attraction[]` and failures are returned as values instead of panicking.

```ballerina
Attraction[]|error attractions = natural (model) {
    Tell me the top ${count} places to visit in ${country} which are
    good for a tourist who has an interest in ${interest} to visit.
    Include a highlight one-liner about that place.
};
```

>**Note:** Interpolated values become part of the prompt. Do not interpolate data that must not be sent to the model provider, and treat user input in the prompt as untrusted.

### Handle failures

The natural expression evaluates to an error when the model call fails or when the response cannot be bound to the expected type. The error type for a particular failure depends on the model provider implementation. The OpenAI model provider reports HTTP errors and connection failures as an `ai:Error` with the message `LLM call failed: ...`, not as an `ai:LlmConnectionError`, so the service cannot reliably tell an unreachable provider apart from other failures. Here, every failure is reported as `502 Bad Gateway`. The details are logged for operators but not returned to the caller. See [Handle failures](/learn/add-an-llm-step-to-an-integration/#handle-failures) in the LLM step guide.

```ballerina
import ballerina/log;

if attractions is error {
    log:printError("Failed to generate attractions", attractions);
    return <http:BadGateway>{body: "Could not generate attractions"};
}
```

### Validate the result

A response that matches the expected type can still be unusable; for example, a field can be empty, or the model can return more items than requested. Validate the result in a separate function so that the rules can be tested without calling the model.

```ballerina
# Validates attractions returned by the model before they are used.
#
# + attractions - The attractions bound from the model response
# + count - The number of attractions requested
# + return - The validated attractions, or an error if validation fails
isolated function validateAttractions(Attraction[] attractions, int count) returns Attraction[]|error {
    Attraction[] validated = check constraint:validate(attractions);
    if validated.length() == 0 {
        return error("model returned no attractions");
    }
    if validated.length() > count {
        return validated.slice(0, count);
    }
    return validated;
}
```

Call it from the resource and return the validated value.

```ballerina
Attraction[]|error validated = validateAttractions(attractions, count);
if validated is error {
    log:printWarn("Model response failed validation", 'error = validated);
    return <http:BadGateway>{body: "Could not generate valid attractions"};
}
return validated;
```

## The complete `service.bal` file

```ballerina
import ballerina/ai;
import ballerina/constraint;
import ballerina/http;
import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider model = check new openai:ModelProvider(openAiApiKey, openai:GPT_4O);

const MAX_ATTRACTIONS = 10;

# Represents a tourist attraction.
type Attraction record {|
    # The name of the attraction
    @constraint:String {minLength: 1}
    string name;
    # The city where the attraction is located
    @constraint:String {minLength: 1}
    string city;
    # A notable feature or highlight of the attraction, in one sentence
    @constraint:String {minLength: 1, maxLength: 250}
    string highlight;
|};

service on new http:Listener(8080) {
    resource function get attractions(string country, string interest, int count = 5)
            returns Attraction[]|http:BadRequest|http:BadGateway {
        if count < 1 || count > MAX_ATTRACTIONS {
            return <http:BadRequest>{body: string `count must be between 1 and ${MAX_ATTRACTIONS}`};
        }

        Attraction[]|error attractions = natural (model) {
            Tell me the top ${count} places to visit in ${country} which are
            good for a tourist who has an interest in ${interest} to visit.
            Include a highlight one-liner about that place.
        };

        if attractions is error {
            log:printError("Failed to generate attractions", attractions);
            return <http:BadGateway>{body: "Could not generate attractions"};
        }

        Attraction[]|error validated = validateAttractions(attractions, count);
        if validated is error {
            log:printWarn("Model response failed validation", 'error = validated);
            return <http:BadGateway>{body: "Could not generate valid attractions"};
        }
        return validated;
    }
}

# Validates attractions returned by the model before they are used.
#
# + attractions - The attractions bound from the model response
# + count - The number of attractions requested
# + return - The validated attractions, or an error if validation fails
isolated function validateAttractions(Attraction[] attractions, int count) returns Attraction[]|error {
    Attraction[] validated = check constraint:validate(attractions);
    if validated.length() == 0 {
        return error("model returned no attractions");
    }
    if validated.length() > count {
        return validated.slice(0, count);
    }
    return validated;
}
```

## Test the validation logic

Model responses vary between calls, so test the deterministic parts of the integration — here, the validation rules — with fixed inputs. Create a `tests/validation_test.bal` file.

> **Info:** For more information, see [Test Ballerina code](/learn/test-ballerina-code/test-a-simple-function/).

```ballerina
import ballerina/test;

@test:Config
function testValidAttractionsPass() returns error? {
    Attraction[] attractions = [
        {name: "Arugam Bay", city: "Pottuvil", highlight: "Sri Lanka's best-known surf point."}
    ];
    test:assertEquals(check validateAttractions(attractions, 3), attractions);
}

@test:Config
function testEmptyFieldIsRejected() {
    Attraction[] attractions = [{name: "", city: "Galle", highlight: "Historic fort."}];
    test:assertTrue(validateAttractions(attractions, 3) is error);
}

@test:Config
function testEmptyResponseIsRejected() {
    test:assertTrue(validateAttractions([], 3) is error);
}

@test:Config
function testExtraAttractionsAreTrimmed() returns error? {
    Attraction[] attractions = [
        {name: "A", city: "X", highlight: "One."},
        {name: "B", city: "Y", highlight: "Two."}
    ];
    test:assertEquals((check validateAttractions(attractions, 1)).length(), 1);
}
```

The module-level model provider is initialized when the tests run, so add a `tests/Config.toml` file with a placeholder key. The tests do not call the model.

```toml
openAiApiKey = "test-key"
```

Run the tests.

```
$ bal test --experimental
```

```
Running Tests

	attraction_finder_service
		[pass] testEmptyFieldIsRejected
		[pass] testEmptyResponseIsRejected
		[pass] testExtraAttractionsAreTrimmed
		[pass] testValidAttractionsPass

		4 passing
		0 failing
		0 skipped
```

## Run the integration

Execute the command below to run the service.

```
$ bal run --experimental
```

You view the output below.

```
Compiling source
        ballerina_tutorials/attraction_finder_service:0.1.0

Running executable
```

## Try the integration

Invoke the resource by making the following `GET` request. Because the content is generated by an LLM, your results will differ.

```
$ curl "http://localhost:8080/attractions?country=Sri%20Lanka&interest=Surfing&count=3"
[{"name":"Arugam Bay", "city":"Pottuvil", "highlight":"Regarded as Sri Lanka's premier surf spot, Arugam Bay offers consistent waves and a vibrant surf culture."}, {"name":"Hikkaduwa", "city":"Hikkaduwa", "highlight":"Famous for its stunning reefs, Hikkaduwa is ideal for both surfing and snorkeling in a picturesque setting."}, {"name":"Unawatuna", "city":"Galle", "highlight":"With its beautiful beaches and laid-back atmosphere, Unawatuna is a perfect spot for beginner surfers and relaxation."}]
```

Verify the failure handling by sending an out-of-range `count`. The request is rejected without calling the model.

```
$ curl -i "http://localhost:8080/attractions?country=Sri%20Lanka&interest=Surfing&count=50"
HTTP/1.1 400 Bad Request
...
count must be between 1 and 10
```

## Learn more

- [AI integrations overview](/learn/ai-integrations-overview/)
- [Add an LLM step to an integration](/learn/add-an-llm-step-to-an-integration/)
- [Ground responses with enterprise data](/learn/ground-responses-with-enterprise-data/)
- [Observe and secure AI integrations](/learn/observe-and-secure-ai-integrations/)
- [Natural expressions](/learn/by-example/natural-expressions/) — Ballerina by Example
- [Direct LLM calls](/learn/by-example/direct-llm-calls/) — Ballerina by Example
- [Constraint validations](/learn/by-example/constraint-validations/) — Ballerina by Example
- [`ballerina/ai` module](https://lib.ballerina.io/ballerina/ai/latest/) — API documentation
- [Introducing natural programming](https://blog.ballerina.io/posts/2025-04-26-introducing-natural-programming)
