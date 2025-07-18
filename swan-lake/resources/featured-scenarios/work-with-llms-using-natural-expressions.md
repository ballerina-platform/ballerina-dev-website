---
layout: ballerina-working-with-llms-using-natural-expressions-left-nav-pages-swanlake
title: Work with Large Language Models (LLMs) using natural expressions
description: Bring AI-powered capabilities into your integrations using natural expressions to call LLMs with automatic binding of the response to user-defined types.
keywords: ballerina, AI, LLM, large language model, natural programming
permalink: /learn/work-with-llms-using-natural-expressions/
active: work-with-llms-using-natural-expressions
intro: This guide helps you understand the basics of using natural expressions in Ballerina to work with LLMs.
---

## Set up the prerequisites

To complete this tutorial, you need:

1. Ballerina 2201.13.0-m1 (Swan Lake) or greater. Install [Ballerina](/downloads/) and use the `bal dist pull` command to pull the milestone version.

    ```
    $ bal dist pull 2201.13.0-m1
    ```

2. A text editor
  >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the 
  <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed. Enable [experimental features](/learn/vs-code-extension/configure-the-extension/) for Ballerina.

3. A command terminal

## Understand the implementation

This tutorial describes how to use Ballerina's natural expressions to integrate working with large language models (LLMs). In this sample you will develop a REST API with a single GET resource that accepts the name of a country, the interests of the user, and a count and uses a natural expression to call an LLM to identify the specified number of attractions in the specified country that may be of interest to the user. The expected structure of the response is indicated by the expected type and natural expressions automatically bind the response to the expected type.

## Create the service package

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic in it. In the terminal, execute the command below to create the Ballerina package for the implementation.

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

## Create the service

### Create a record to represent an attraction

In Ballerina, records are a data type that maps keys to values. Define a [closed record](/learn/by-example/controlling-openness/) to represent an attraction in the `service.bal` file. 

>**Info:** This record type is also used to generate a JSON schema to be used in the LLM call to specify a format for the expected response.

```ballerina
# Represents a tourist attraction.
type Attraction record {|
    # The name of the attraction
    string name;
    # The city where the attraction is located
    string city;
    # A notable feature or highlight of the attraction
    string highlight;
|};
```

### Introduce an HTTP RESTful API

Introduce an HTTP service to expose a RESTful API with the GET resource that allows retrieving the required details of relevant attractions. 

### Create a service

In the `service.bal` file, add an import for the Ballerina [`HTTP` module](https://lib.ballerina.io/ballerina/http/latest).

```ballerina
import ballerina/http;
```

Then add the following service snippet. 

```ballerina
service on new http:Listener(8080) {
}
```

### Create the resource method

Within this service, you can define the GET resource method to retrieve and return attractions in the expected format. Specify the input as parameters. Use `Attraction[]` in the return type to indicate that an array of `Attraction`s will be returned from the resource and `http:InternalServerError` to represent LLM call and/or data binding failures.

```ballerina
service on new http:Listener(8080) {
    resource function get attractions(string country, string interest, int count = 5) 
            returns Attraction[]|http:InternalServerError {

    }    
}
```

### Introduce a model provider corresponding to the LLM

Introduce an `ai:ModelProvider` value corresponding to the LLM you want to use. You can get started with the default model (without having to specify your own LLM keys) by calling the `ai:getDefaultModelProvider()` function.

```ballerina
import ballerina/ai;

final ai:ModelProvider model = check ai:getDefaultModelProvider();
```

Alternatively you can use a model provider from the relevant `ballerinax/ai.<provider>` package (e.g., `ballerinax/ai.openai`, `ballerinax/ai.azure`, etc.) with your own keys.

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string apiKey = ?;

final ai:ModelProvider openAiModel = check new openai:ModelProvider(apiKey, openai:GPT_4O);
```

### Introduce the natural expression to call the LLM and bind the response

Within the resource, introduce a natural expression with the requirement specified in natural language. Specify the model provider value to set the LLM to use. Use interpolations to refer to in-scope variables/parameters; at runtime, these get replaced with the values passed to the parameters.

```ballerina
Attraction[]|error attractions = natural (model) {
    Tell me the top ${count} places to visit in ${country} which are 
    good for a tourist who has an interest in ${interest} to visit.  
    Include a highlight one-liner about that place.
};
```

If the LLM call was successful and the response was returned in the expected format, return the result from the resource. If it failed, return an `Internal Server Error` response from the resource.

```ballerina
service on new http:Listener(8080) {
    resource function get attractions(string country, string interest, int count = 5) 
            returns Attraction[]|http:InternalServerError {

        Attraction[]|error attractions = natural (model) {
            Tell me the top ${count} places to visit in ${country} which are 
            good for a tourist who has an interest in ${interest} to visit.  
            Include a highlight one-liner about that place.
        };

        if attractions is Attraction[] {
            return attractions;
        }
        return {body: "Failed to fetch attractions: " + attractions.message()};
    }
}
```

## The `service.bal` file complete code 

The complete code in the `service.bal` will be as follows.

```ballerina
import ballerina/ai;
import ballerina/http;

final ai:ModelProvider model = check ai:getDefaultModelProvider();

# Represents a tourist attraction.
type Attraction record {|
    # The name of the attraction
    string name;
    # The city where the attraction is located
    string city;
    # A notable feature or highlight of the attraction
    string highlight;
|};

service on new http:Listener(8080) {
    resource function get attractions(string country, string interest, int count = 5) 
            returns Attraction[]|http:InternalServerError {
        Attraction[]|error attractions = natural (model) {
            Tell me the top ${count} places to visit in ${country} which are 
            good for a tourist who has an interest in ${interest} to visit.  
            Include a highlight one-liner about that place.
        };

        if attractions is Attraction[] {
            return attractions;
        }
        return {body: "Failed to fetch attractions: " + attractions.message()};
    }    
}
```

## Configure the default model

If you are using the default model made available via WSO2 Copilot (i.e., using the `ai:getDefaultModelProvider()` function), log in to WSO2 Copilot, open up the VS Code command palette (`Ctrl + Shift + P` or `command + shift + P`), and run `Configure Default Model`. This will add configuration for the default model into the Config.toml file. Please note that this will require VS Code being open in the relevant directory.

![Configure the default model](/learn/images/ai_natural_expr_configure_default_model.png)

## Run the service 

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

## Try the service

Invoke the defined resource method by making the following `GET` request.

```
$ curl "http://localhost:8080/attractions?country=Sri%20Lanka&interest=Surfing&count=3"
[{"name":"Arugam Bay", "city":"Pottuvil", "highlight":"Regarded as Sri Lanka's premier surf spot, Arugam Bay offers consistent waves and a vibrant surf culture."}, {"name":"Hikkaduwa", "city":"Hikkaduwa", "highlight":"Famous for its stunning reefs, Hikkaduwa is ideal for both surfing and snorkeling in a picturesque setting."}, {"name":"Unawatuna", "city":"Galle", "highlight":"With its beautiful beaches and laid-back atmosphere, Unawatuna is a perfect spot for beginner surfers and relaxation."}]
```

## Learn more

See [Introducing natural programming](https://blog.ballerina.io/posts/2025-04-26-introducing-natural-programming).
