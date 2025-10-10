---
layout: ballerina-left-nav-release-notes
title: 2201.13.0 (Swan Lake) 
permalink: /downloads/swan-lake-release-notes/2201.13.0/
active: 2201.13.0
redirect_from: 
    - /downloads/swan-lake-release-notes/2201.13.0
    - /downloads/swan-lake-release-notes/2201.13.0-swan-lake/
    - /downloads/swan-lake-release-notes/2201.13.0-swan-lake
    - /downloads/swan-lake-release-notes/
    - /downloads/swan-lake-release-notes
---

## Overview of Ballerina Swan Lake Update 13 (2201.13.0)

<em> Swan Lake Update 13 (2201.13.0) is the thirteenth update release of Ballerina Swan Lake, and it includes a new set of features and significant improvements to the compiler, runtime, Ballerina library, and developer tooling. It is based on the 2024R1 version of the Language Specification.</em>

## Update Ballerina

Update your current Ballerina installation directly to 2201.13.0 using the [Ballerina Update Tool](/learn/update-tool/) as follows.

1. Run `bal update` to get the latest version of the Update Tool.
2. Run `bal dist update` to update to this latest distribution.

## Install Ballerina

If you have not installed Ballerina, download the [installers](/downloads/#swanlake) to install.

## Language updates

### New features

#### Natural expressions

Natural expressions have been introduced as experimental first-class syntax for natural language integrations. Natural expressions are blocks of natural language instructions that are executed at runtime with the help of a generator capable of understanding/executing the instructions in natural language (e.g., a generative AI model such as a large language model (LLM)). They are dependently typed, allowing generators to identify the required result format and bind the response to the expected type. 

```ballerina
import ballerina/ai;
import ballerina/io;

// Use the default model provider (with configuration added via a Ballerina VS Code command).
// Alternatively, to use your own keys, use the relevant `ballerinax/ai.<provider>` (e.g., 
// `ballerinax/ai.openai`, `ballerinax/ai.anthropic`, etc.) model provider implementation.
final ai:ModelProvider model = check ai:getDefaultModelProvider();

// Define a type corresponding to the response you expect from the LLM.
type Joke record {|
    string setup;
    string punchline;
|};

function generateJoke(string subject) returns Joke|error {
    // Use a natural expression with instruction specified in natural language.
    // The expected type (`Joke`) is used to automatically generate the schema to
    // be included in the request to the model. The relevant parts of the response
    // are then extracted and parsed as a `Joke` value.
    // A natural expression may evaluate to an `error` if the request or parsing fails.
    Joke|error joke = 
        // The `natural` expression allows specifying natural language instructions directly.
        natural (model) {
            Tell me a joke about ${subject}!
            Make it suitable for all audiences.
        };
    return joke;
}

public function main() returns error? {
    Joke jokeResponse = check generateJoke("programming");
    io:println("Setup: ", jokeResponse.setup);
    io:println("Punchline: ", jokeResponse.punchline);
}
```

Natural expressions can be multimodal; the model provider implementations handle insertions of document types such as `ai:ImageDocument`, `ai:AudioDocument`, and `ai:FileDocument` to transform them into the multimodal request format expected by the LLM API.

```ballerina
import ballerina/ai;
import ballerina/io;

final ai:ModelProvider model = check ai:getDefaultModelProvider();

public function main() returns error? {
    // Define an `ai:ImageDocument` value with a URL to an image.
    ai:ImageDocument image = {
        content: "https://ballerina.io/img/branding/ballerina_logo_dgrey_png.png"
    };

    // Use the `generate` method with an image document as an insertion (`${...}`).
    // The model provider will detect the multimodal input and handle
    // constructing the request appropriately.
    string? description = check model->generate(`
        Describe this image.
        ${image}
        
        If it is not possible to describe the image, respond with null.`);

    io:println(description);
}
```

> Note: These examples use the default model provider. To generate the necessary configuration, open up the VS Code command palette (`Ctrl` + `Shift` + `P` or `command` + `shift` + `P`), and run the `Configure default WSO2 Model Provider` command to add your configuration to the `Config.toml` file. If not already logged in, log in to the Ballerina Copilot when prompted. Alternatively, to use your own keys, use the relevant `ballerinax/ai.<provider>` model provider implementation.

> Note: This is currently an experimental feature and requires the `--experimental` flag to be used with `bal` commands.

For more information, see [Natural Language is Code: A hybrid approach with Natural Programming](https://blog.ballerina.io/posts/2025-04-26-introducing-natural-programming/) and [Work with Large Language Models (LLMs) using natural expressions](https://ballerina.io/learn/work-with-llms-using-natural-expressions/).

#### Compile-time code generation

Experimental support for compile-time code generation has also been introduced as a part of [Natural Programming](https://blog.ballerina.io/posts/2025-04-26-introducing-natural-programming/). This allows users to describe what data (e.g., test data) should look like or what the implementation of a function should be in natural language in the source code, and have the data or implementation be generated at compile time with the help of a generative AI model. Inspired by literate programming, this allows for more expressive source code.

Compile-time code generation is of two variants.

- Data generation - `const natural` expressions

    A `const natural` expression can be used to generate data (i.e., values that belong to `anydata`).

    ```ballerina
    import ballerina/test;

    type Employee record {|
        int id;
        string name;
        string department;
        decimal salary;
    |};

    function filterEmployees(Employee[] employees, string department, decimal salary) 
        returns Employee[] => from Employee emp in employees
            where emp.department == department && emp.salary > salary
            select emp;

    @test:Config
    function testFilterEmployees() {
        // Use a const natural expression to generate a dataset of employees.
        Employee[] employees = const natural {
            Generate data sets of employees with varying departments and salaries to test a 
            function that filters employees belonging to a specific department and earning 
            above a certain salary threshold.
            
            Use legal, finance, and tech departments with salaries ranging from 50000 to 150000.
        };

        // Define the department and salary threshold for filtering, either as hardcoded values 
        // or using `const natural` expressions.
        string department = const natural { Select a department from legal, finance, and tech.};
        decimal salaryThreshold = const natural { Select a salary threshold between 50000 and 150000. };

        Employee[] filteredEmployees = filterEmployees(employees, department, salaryThreshold);

        int currIndex = 0;
        int filteredEmployeesLength = filteredEmployees.length();
        foreach Employee employee in filteredEmployees {
            if employee.department == department && employee.salary > salaryThreshold {
                test:assertTrue(currIndex < filteredEmployeesLength);
                test:assertExactEquals(filteredEmployees[currIndex], employee);
                currIndex += 1;
            }
        }
        test:assertEquals(currIndex, filteredEmployeesLength);
    }
    ```

- Function generation - `@natural:code external` functions

    An `external` function can be annotated with `@natural:code` with the `prompt` field describing the implementation of the function. Note that this is only allowed with projects (and not in single file mode) and the code generated for the function is persisted in the `generated` directory. Since there is no developer in the loop to review and approve the generated code during the build, some restrictions (such as limiting the organizations from which modules can be imported) have been introduced, compared to a Copilot.

    ```ballerina
    type Employee record {|
        int id;
        string name;
        string department;
        decimal salary;
    |};

    function filterEmployees(Employee[] employees, string department, decimal salary) returns Employee[] =
        @natural:code {
            prompt: string `Filter employees who belong to the specified department 
                                and have a salary greater than the given threshold.`
        } external;
    ```

    Note that this currently works with the Ballerina Copilot configuration. To generate the configuration, open up the VS Code command palette (`Ctrl` + `Shift` + `P` or `command` + `shift` + `P`), and run the `Configure default WSO2 Model Provider` command to add your configuration to the `Config.toml` file. If not already logged in, log in to the Ballerina Copilot when prompted. Use these values as the `BAL_CODEGEN_URL` and `BAL_CODEGEN_TOKEN` environment variables for compile-time code generation.

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 13 (2201.13.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FCompilerFE+milestone%3A2201.13.0+is%3Aclosed+label%3AType%2FBug).

## Runtime updates

### New features

### Improvements

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 13 (2201.13.0)](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+milestone%3A2201.13.0+label%3ATeam%2FjBallerina+label%3AType%2FBug+is%3Aclosed).

## Ballerina library updates

### New features

#### `time` package

- Added support for add/subtract specified durations to/from time values.

    ```ballerina
    import ballerina/io;
    import ballerina/time;

    public function main() {
        time:Civil civil = check time:civilFromString("2025-04-13T17:35:30.120Z");
        civil = check time:civilAddDuration(civil, {years: 1, months: 3, days: 5, hours: 6, minutes: 9, seconds: 1});
        io:println(check time:civilToString(civil)); // Prints "2026-07-18T23:44:31.120Z"

        time:TimeZone timeZone = check new("Asia/Colombo");
        civil = check time:civilFromString("2025-04-13T17:35:30.120-08:00[America/Los_Angeles]");
        civil = check timeZone.civilAddDuration(civil, {years: 1, months: 3, days: 5, hours: 6, minutes: 9, seconds: 1});
        io:println(check time:civilToString(civil)); // 2026-07-19T13:14:31.120+05:30[Asia/Colombo]
    }
    ```

### Improvements

#### `oauth2` package

- Added support for configuring the connection and request timeouts for the internal HTTP client.

    ```ballerina
    ClientCredentialsGrantConfig config = {
        // ... other configurations
        clientConfig: {
            connectTimeout: 30,
            reqTimeout: 60
        }
    };
    ```

### Bug fixes

To view bug fixes, see the [GitHub milestone for Swan Lake Update 13 (2201.13.0)](https://github.com/ballerina-platform/ballerina-standard-library/issues?q=is%3Aclosed+is%3Aissue+milestone%3A%222201.13.0%22+label%3AType%2FBug).

## Developer tools updates

### New features

#### Language Server

#### CLI

#### OpenAPI tool

### Improvements

#### Language Server

### Bug fixes

To view bug fixes, see the GitHub milestone for Swan Lake Update 13 (2201.13.0) of the repositories below.

- [Language server](https://github.com/ballerina-platform/ballerina-lang/issues?q=is%3Aissue+label%3ATeam%2FLanguageServer+milestone%3A2201.13.0+is%3Aclosed+label%3AType%2FBug+)
- [OpenAPI](https://github.com/ballerina-platform/openapi-tools/issues?q=is%3Aissue+label%3AType%2FBug+milestone%3A%22Swan+Lake+2201.13.0%22+is%3Aclosed)

## Ballerina packages updates

### New features

### Improvements

### Bug fixes

## Backward-incompatible changes
