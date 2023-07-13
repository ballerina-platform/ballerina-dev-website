---
title: 'Declarative data processing'
description: Ballerina's query language is a powerful feature that enhances data-oriented programming by providing a concise and expressive way to transform and manipulate data. It allows developers to perform complex data operations such as filtering, mapping, aggregating, and sorting with ease. The query language in Ballerina is specifically designed to work seamlessly with structured data types like records, making it well-suited for data-oriented programming tasks.
url: https://github.com/ballerina-guides/integration-samples/blob/main/data-oriented-programming/declarative-data-processing/main.bal
---
```
import ballerina/http;
import ballerina/io;

type Country record {
    string country;
    int population;
    string continent;
    int cases;
    int deaths;
};

// Prints the top 10 countries having the highest case-fatality ratio grouped by continent.
public function main() returns error? {
    http:Client diseaseEp = check new ("https://disease.sh/v3");
    Country[] countries = check diseaseEp->/covid\-19/countries;

    json summary =
        from var {country, continent, population, cases, deaths} in countries
            where population >= 100000 && deaths >= 100
            let decimal caseFatalityRatio = (<decimal>deaths / <decimal>cases * 100).round(4)
            let json countryInfo = {country, population, caseFatalityRatio}
            order by caseFatalityRatio descending
            limit 10
            group by continent
            order by avg(caseFatalityRatio)
            select {continent, countries: [countryInfo]};
    io:println(summary);
}
```