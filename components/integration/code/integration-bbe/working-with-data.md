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

// Prints the top 10 countries having the highest case-fatality ratio.
public function main() returns error? {
    http:Client diseaseEp = check new ("https://disease.sh/v3");
    Country[] countries = check diseaseEp->/covid\-19/countries;

    json summary =
        from var {country, continent, population, cases, deaths} in countries
            where population >= 100000 && deaths >= 100
            let decimal caseFatalityRatio = <decimal>deaths / <decimal>cases * 100
            order by caseFatalityRatio descending
            limit 10
            select {country, continent, population, caseFatalityRatio};
    io:println(summary);
}
```