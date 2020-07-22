---
layout: ballerina-left-nav-pages-swanlake
title: Quick Start
description: Learn how to use Ballerina's built-in test framework to write testable code. The test framework provides a set of building blocks to help write and run tests.
keywords: ballerina, programming language, testing
permalink: /swan-lake/learn/testing-ballerina-code/testing-quick-start/
active: testing-quick-start
redirect_from:
  - /swan-lake/learn/how-to-test-ballerina-code/
  - /swan-lake/learn/how-to-test-ballerina-code
  - /swan-lake/learn/testing-ballerina-code/testing-quick-start
---

# Quick Start

The Ballerina Language has a built-in robust test framework, which allows you to achieve multiple levels of the test pyramid including unit testing, integration testing, and end to end testing.  It provides features such as assertions, data providers, mocking, and code coverage, which enable the programmers to write comprehensive tests.

To get started, let's write a simple Ballerina function and test it.

1. First, let’s create a Ballerina project and add a new module. Use the `ballerina new` command to create the project. 
For more information on the command, see [Structuring Ballerina Code](/swan-lake/learn/structuring-ballerina-code/).

    The standard project will hold the structure below.

    ```bash
    project-name/
        Ballerina.toml         
        src/
            module1/           	
                main.bal   
                Module.md
                [resources/]
                tests/
                    main_test.bal
                    [resources]	   
    ```

2. Now, let’s write the function, which handles sending a get request in the ***main.bal*** file of the module you just
 created.
 
    ```ballerina
    // main.bal
    
    import ballerina/io;
    import ballerina/http;
    import ballerina/stringutils;
    
    http:Client clientEndpoint = new("https://api.chucknorris.io/jokes/");
    
    // This function performs a `get` request to the Chuck Norris API and returns a random joke 
    // with the name replaced with the provided name or an error if the API invocation fails.
    function getRandomJoke(string name) returns string|error {
        http:Response|error result = clientEndpoint->get("/random");
        http:Response response = <http:Response>result;
        if (response.statusCode == http:STATUS_OK) {
            json payload = <json>response.getJsonPayload();
            json joke = <json>payload.value;
            string replacedText = stringutils:replace(joke.toJsonString(), "Chuck Norris", name);
            return replacedText;
        } else {
            error err = error("error occurred while sending GET request");
            io:println(err.message(),
                ", status code: ", response.statusCode,
                ", reason: ", response.getJsonPayload());
            return err;
        }
    }
    
    ```

3. Now, let’s write a simple test case to verify the behavior of the `main` function in ***main_test.bal***

    ```ballerina
    // main_test.bal
    import ballerina/io;
    import ballerina/test;
    import ballerina/http;
    
    // This test function tests the behavior of the `getRandomJoke` when
    // the API returns a success response
    @test:Config {}
    function testGetRandomJoke() {
        // create a default mock HTTP Client and assign it to the `clientEndpoint`
        clientEndpoint = test:mock(http:Client);
        // stub the behavior of the `get` function to return the specified mock response
        test:prepare(clientEndpoint).when("get").thenReturn(getMockResponse());
        // invoke the function to test
        string result = checkpanic getRandomJoke("Sheldon");
        io:println(result);
        // verify the return value   
        test:assertEquals(result, "When Sheldon wants an egg, he cracks open a chicken.");
    }
    
    // Returns a mock HTTP response to be used for the jokes API invocation
    function getMockResponse() returns http:Response {
        http:Response mockResponse = new;
        json mockPayload = {"value":"When Chuck Norris wants an egg, he cracks open a chicken."};
        mockResponse.setPayload(mockPayload);
        return mockResponse;
    }
    ```

4. Finally, let’s execute the tests using the following command.

    `$ ballerina test --code-coverage --all`

    This will print an output similar to the following.

    ```
    Compiling source
        foo/joke:0.1.0
    
    Creating balos
        target/balo/joke-2020r2-any-0.1.0.balo
    
    Running Tests with Coverage
        foo/joke:0.1.0
    When Sheldon wants an egg, he cracks open a chicken.
    
        [pass] testGetRandomJoke
    
        1 passing
        0 failing
        0 skipped
    
    Generating Test Report
        target/test_results.json
    
        View the test report at: file:///home/foo/test/sample-project/target/report/index.html
    ```
 
 
## What's Next

Now, that you have an understanding of how a test case can be written and executed, you can dive deep into the available
 features in the [Writing Tests](/swan-lake/learn/testing-ballerina-code/writing-tests) section.
