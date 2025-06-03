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
$ bal new country-service
```

This command creates a new directory named `country-service` with the following content:

```
country-service/
├── Ballerina.toml
└── main.bal
```

- The `Ballerina.toml` file contains metadata that describes your package. The `bal` tool also uses the `Ballerina.toml` file to identify the root of a package.
- The `main.bal` file is a source file and it contains the Ballerina code that prints `Hello, World!` to the console. You can add any number of source files in the `country-service` directory.

## Say `Hello, World!`

Open the package directory in your text editor. If you are using VS Code, you could navigate to the `country-service` directory and run `code .` to open the directory in VS Code. 

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
	example/country_service:0.1.0

Running executable

Hello, World!
```

Alternatively, you can generate an executable file with `bal build`,

```
$ bal build
Compiling source
	example/country_service:0.1.0

Generating executable
	target/bin/country_service.jar
```

and run it using `bal run`.

```
$ bal run target/bin/country_service.jar
Hello, World!
```

## Write a simple REST API

Now, let's change the `country_service` application into a REST API. Ballerina has first-class abstractions for services, resources, etc., and they make network service development easier and more fun. 

Replace the contents of the `main.bal` file with the following code:

```ballerina
import ballerina/http;

public type Country record {
    string name;
    string continent;
    int population;
    decimal gdp;
    decimal area;
};

final http:Client countriesClient = check new ("https://dev-tools.wso2.com/gs/helpers/v1.0/");

service / on new http:Listener(8080) {

    resource function get countries() returns Country[]|error {
        // Sending a GET request to the "/countries" endpoint and retrieving an array of `Country` records.
        Country[] countries = check countriesClient->/countries;
        return countries;
    }
}
```

>**Info:** To learn more about services, see [Network interaction](/learn/network-interaction/). 

## Run the simple REST API

Let's run this package in your terminal:

```
$ bal run
Compiling source
	example/country_service:0.1.0

Running executable
```

Now, open another terminal window and run the following command to invoke the REST API.

```
$ curl localhost:8080/countries
[{"name":"United States", "continent":"North America", "population":331002651, "gdp":2.736E+13, "area":9833517.0, "capital":"Washington, D.C.", "languages":"English", "currency":"USD"}, {"name":"Canada", "continent":"North America", "population":37742154, "gdp":2.14E+12, "area":9984670.0, "capital":"Ottawa", "languages":"English, French", "currency":"CAD"}, {"name":"Brazil", "continent":"South America", "population":212559417, "gdp":1.9444E+12, "area":8515767.0, "capital":"Brasília", "languages":"Portuguese", "currency":"BRL"}, {"name":"United Kingdom", "continent":"Europe", "population":67886011, "gdp":2.56E+12, "area":243610.0, "capital":"London", "languages":"English", "currency":"GBP"}, {"name":"Germany", "continent":"Europe", "population":83783942, "gdp":4.5E+12, "area":357022.0, "capital":"Berlin", "languages":"German", "currency":"EUR"}, {"name":"France", "continent":"Europe", "population":65273511, "gdp":2.93E+12, "area":551695.0, "capital":"Paris", "languages":"French", "currency":"EUR"}, {"name":"India", "continent":"Asia", "population":1380004385, "gdp":3.2E+12, "area":3287263.0, "capital":"New Delhi", "languages":"Hindi, English", "currency":"INR"}, {"name":"China", "continent":"Asia", "population":1439323776, "gdp":1.773E+13, "area":9596961.0, "capital":"Beijing", "languages":"Mandarin", "currency":"CNY"}, {"name":"Japan", "continent":"Asia", "population":126476461, "gdp":4.2E+12, "area":377975.0, "capital":"Tokyo", "languages":"Japanese", "currency":"JPY"}, {"name":"Australia", "continent":"Oceania", "population":25499884, "gdp":1.78E+12, "area":7692024.0, "capital":"Canberra", "languages":"English", "currency":"AUD"}, {"name":"South Africa", "continent":"Africa", "population":59308690, "gdp":1.275E+12, "area":1219090.0, "capital":"Pretoria", "languages":"11 official languages", "currency":"ZAR"}, {"name":"Russia", "continent":"Europe/Asia", "population":145934462, "gdp":2.196E+12, "area":1.7098242E7, "capital":"Moscow", "languages":"Russian", "currency":"RUB"}, {"name":"Mexico", "continent":"North America", "population":128932753, "gdp":1.79E+12, "area":1964375.0, "capital":"Mexico City", "languages":"Spanish", "currency":"MXN"}, {"name":"Italy", "continent":"Europe", "population":60461826, "gdp":2.0E+12, "area":301340.0, "capital":"Rome", "languages":"Italian", "currency":"EUR"}, {"name":"Argentina", "continent":"South America", "population":45195774, "gdp":4.07E+11, "area":2780400.0, "capital":"Buenos Aires", "languages":"Spanish", "currency":"ARS"}, {"name":"Spain", "continent":"Europe", "population":46754778, "gdp":1.4E+12, "area":505990.0, "capital":"Madrid", "languages":"Spanish", "currency":"EUR"}, {"name":"Indonesia", "continent":"Asia", "population":273523615, "gdp":1.119E+12, "area":1904569.0, "capital":"Jakarta", "languages":"Indonesian", "currency":"IDR"}, {"name":"Saudi Arabia", "continent":"Asia", "population":34813871, "gdp":7.93E+11, "area":2149690.0, "capital":"Riyadh", "languages":"Arabic", "currency":"SAR"}, {"name":"South Korea", "continent":"Asia", "population":51269185, "gdp":1.647E+12, "area":100210.0, "capital":"Seoul", "languages":"Korean", "currency":"KRW"}, {"name":"Turkey", "continent":"Europe/Asia", "population":84339067, "gdp":7.2E+11, "area":783562.0, "capital":"Ankara", "languages":"Turkish", "currency":"TRY"}, {"name":"Egypt", "continent":"Africa", "population":102334404, "gdp":3.63E+11, "area":1002450.0, "capital":"Cairo", "languages":"Arabic", "currency":"EGP"}, {"name":"Thailand", "continent":"Asia", "population":69799978, "gdp":5.43E+11, "area":513120.0, "capital":"Bangkok", "languages":"Thai", "currency":"THB"}, {"name":"Pakistan", "continent":"Asia", "population":220892340, "gdp":2.78E+11, "area":881913.0, "capital":"Islamabad", "languages":"Urdu, English", "currency":"PKR"}, {"name":"Nigeria", "continent":"Africa", "population":206139589, "gdp":4.32E+11, "area":923768.0, "capital":"Abuja", "languages":"English", "currency":"NGN"}, {"name":"Vietnam", "continent":"Asia", "population":97338579, "gdp":3.4E+11, "area":331212.0, "capital":"Hanoi", "languages":"Vietnamese", "currency":"VND"}, {"name":"Philippines", "continent":"Asia", "population":109581078, "gdp":4.02E+11, "area":300000.0, "capital":"Manila", "languages":"Filipino, English", "currency":"PHP"}, {"name":"Colombia", "continent":"South America", "population":50882891, "gdp":3.24E+11, "area":1141748.0, "capital":"Bogotá", "languages":"Spanish", "currency":"COP"}, {"name":"Sri Lanka", "continent":"Asia", "population":21803000, "gdp":8.41E+10, "area":65610.0, "capital":"Sri Jayawardenepura Kotte", "languages":"Sinhala, Tamil", "currency":"LKR"}]
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
    decimal area;
};

public type CountryResponse record {
    string name;
    string continent;
    decimal gdpPerCapita;
};

final http:Client countriesClient = check new ("https://dev-tools.wso2.com/gs/helpers/v1.0/");

service / on new http:Listener(8080) {

    resource function get countries() returns CountryResponse[]|http:InternalServerError {
        do {
            // Sending a GET request to the "/countries" endpoint and retrieving an array of `Country` records.
            Country[] countries = check countriesClient->/countries;

            // Using a query expression to process the list of countries and generate a summary.
            CountryResponse[] topCountries =
                from var {name, continent, population, area, gdp} in countries
            where population >= 100000000 && area >= 1000000d // Filtering countries with a population >= 100M and area >= 1M sq km.
            let decimal gdpPerCapita = (gdp / population).round(2) // Calculating and rounding GDP per capita to 2 decimal places.
            order by gdpPerCapita descending // Sorting the results by GDP per capita in descending order.
            limit 10 // Limiting the results to the top 10 countries.
            select {name, continent, gdpPerCapita}; // Selecting the country name, continent, and GDP per capita.
            return topCountries;
        } on fail var err {
            return <http:InternalServerError>{
                body: {
                    "error": "Failed to retrieve countries",
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
