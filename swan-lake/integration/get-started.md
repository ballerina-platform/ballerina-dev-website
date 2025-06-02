---
layout: ballerina-getting-started-left-nav-pages-swanlake
title: Get started 
description: Let’s set up a Ballerina development environment and write a simple Ballerina program.
keywords: ballerina, programming language, ballerina packages, getting started
permalink: /learn/get-started/
active: get-started
intro: Let’s set up a Ballerina development environment and write a simple Ballerina program.
---

## Install Ballerina

[Download](/downloads/) and install Ballerina based on your operating system.

>**Tip:** For more information, see [Installation options](/downloads/installation-options/).

## Set up the editor

Set up a text editor to write Ballerina code.

>**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the Ballerina VS Code extension installed. For more information about the features of this extension, check <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina VS Code extension documentation</a>.

Let's create a Ballerina program that prints `Hello, World!`.

## Create a new package

Use the `bal new` command to create a new Ballerina package, which is the primary unit for organizing and managing Ballerina code. 

>**Info:** For more information about packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```
$ bal new simple-country-service
```

This command creates a new directory named `simple-country-service` with the following content:

```
simple-country-service/
├── Ballerina.toml
└── main.bal
```

- The `Ballerina.toml` file contains metadata that describes your package. The `bal` tool also uses the `Ballerina.toml` file to identify the root of a package.
- The `main.bal` file is a source file and it contains the Ballerina code that prints `Hello, World!` to the console. You can add any number of source files in the `simple-country-service` directory.

## Say `Hello, World!`

Open the package directory in your text editor. If you are using VS Code, you could navigate to the `simple-country-service` directory and run `code .` to open the directory in VS Code. 

Then, open the `main.bal` file to see the generated source.

```ballerina
import ballerina/io;

public function main() {
    io:println("Hello, World!");
}
```

>**Info:** To learn more about the basics of the language, see [Language basics](/learn/language-basics/). 

## Run the package

Run `bal run` in your terminal to run this package.

```
$ bal run
Compiling source
	example/simple_country_service:0.1.0

Running executable

Hello, World!
```

Alternatively, you can generate an executable file with `bal build`,

```
$ bal build
Compiling source
	example/simple_country_service:0.1.0

Generating executable
	target/bin/simple_country_service.jar
```

and run it using `bal run`.

```
$ bal run target/bin/simple_country_service.jar
Hello, World!
```

## Write a simple REST API

Now, let's change the `simple_country_service` application into a REST API. Ballerina has first-class abstractions for services, resources, etc., and they make network service development easier and more fun. 

Replace the contents of the `main.bal` file with the following code:

```ballerina
import ballerina/http;

public type Country record {
    string name;
    string continent;
    int population;
    decimal gdp;
    float area;
};

service / on new http:Listener(8080) {
    resource function get countries() returns Country[]|http:InternalServerError {
        do {
            // Creating an HTTP client to connect to the server.
            http:Client countriesClient = check new ("https://dev-tools.wso2.com/gs/helpers/v1.0/");

            // Sending a GET request to the "/countries" endpoint and retrieving an array of `Country` records.
            Country[] countries = check countriesClient->/countries;

            // Using a query expression to process the list of countries and generate a summary.
            json topCountries =
                from var {name, continent, population, area, gdp} in countries
            where population >= 100000000 // Filtering countries with a population >= 100M.
            select {name, continent, gdpPerCapita}; // Selecting the country name, continent, and GDP per capita.
            return topCountries;
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to retrieve countries from the backend service",
                    "message": err.message()
                }
            };
        }
    }
}
```

>**Info:** To learn more about services, see [Network interaction](/learn/network-interaction/). 

## Run the simple REST API

Let's run this package in your terminal:

```
$ bal run
Compiling source
	example/simple_country_service:0.1.0

Running executable
```

Now, open another terminal window and run the following command to invoke the REST API.

```
$ curl localhost:8080/countries
[{"name":"United States", "continent":"North America", "gdpPerCapita":82657.95}, {"name":"Russia", "continent":"Europe/Asia", "gdpPerCapita":15047.85}, {"name":"Mexico", "continent":"North America", "gdpPerCapita":13883.21}, {"name":"China", "continent":"Asia", "gdpPerCapita":12318.28}, {"name":"Brazil", "continent":"South America", "gdpPerCapita":9147.56}, {"name":"Indonesia", "continent":"Asia", "gdpPerCapita":4091.05}, {"name":"Egypt", "continent":"Africa", "gdpPerCapita":3547.19}, {"name":"India", "continent":"Asia", "gdpPerCapita":2318.83}]
```

Alternatively, you can use the built-in `Try it` feature by clicking on the `Try it` CodeLens above the service declaration on VS Code.

You can implement advanced filtering by updating the service as demonstrated in the following example.

```ballerina
import ballerina/http;

public type Country record {
    string name;
    string continent;
    int population;
    decimal gdp;
    float area;
};

public type CountryResponse record {
    string name;
    string continent;
    decimal gdpPerCapita;
};

service / on new http:Listener(8080) {
    resource function get countries() returns CountryResponse[]|http:InternalServerError {
        do {
            // Creating an HTTP client to connect to the server.
            http:Client countriesClient = check new ("https://dev-tools.wso2.com/gs/helpers/v1.0/");

            // Sending a GET request to the "/countries" endpoint and retrieving an array of `Country` records.
            Country[] countries = check countriesClient->/countries;

            // Using a query expression to process the list of countries and generate a summary.
            CountryResponse[] topCountries =
                from var {name, continent, population, area, gdp} in countries
            where population >= 100000000 && area >= 1000000.0 // Filtering countries with a population >= 100M and area >= 1M sq km.
            let decimal gdpPerCapita = (gdp / population).round(2) // Calculating and rounding GDP per capita to 2 decimal places.
            order by gdpPerCapita descending // Sorting the results by GDP per capita in descending order.
            limit 10 // Limiting the results to the top 10 countries.
            select {name, continent, gdpPerCapita}; // Selecting the country name, continent, and GDP per capita.
            return topCountries;
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to retrieve countries from the backend service",
                    "message": err.message()
                }
            };
        }
    }
}
```

Run following command to invoke above.

```
$ curl http://localhost:8080/countries
[{"name":"United States", "continent":"North America", "gdpPerCapita":82657.95}, {"name":"Russia", "continent":"Europe/Asia", "gdpPerCapita":15047.85}, {"name":"Mexico", "continent":"North America", "gdpPerCapita":13883.21}, {"name":"China", "continent":"Asia", "gdpPerCapita":12318.28}, {"name":"Brazil", "continent":"South America", "gdpPerCapita":9147.56}, {"name":"Indonesia", "continent":"Asia", "gdpPerCapita":4091.05}, {"name":"Egypt", "continent":"Africa", "gdpPerCapita":3547.19}, {"name":"India", "continent":"Asia", "gdpPerCapita":2318.83}]
```

## Learn more

In this guide, you set up your development environment and wrote two Ballerina programs. For more learning resources, see [Learn](/learn/).
