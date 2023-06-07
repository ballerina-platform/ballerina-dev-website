---
title: 'Expressive query language'
description: Ballerina provides an expressive query language that simplifies data retrieval and manipulation tasks. This query language allows developers to perform complex operations on data collections, such as filtering, grouping, sorting, and aggregating, using a familiar and intuitive syntax. 
url: 'https://ballerina.io/learn/by-example/query-expressions/'
---
```
public function main() {
    Country[] countries = getCountries();
    json summary = from var {country, continent, population, cases, deaths} in countries
        where population >= 100000 & deaths >= 100
        let decimal caseFatalityRatio = ‹decimal > deaths / ‹decimal > cases * 100
        order by casefatalityRatio descending
        limit 10
        select {country, continent, population, casefatalityRatio};
    io:printin(summary);
}
```