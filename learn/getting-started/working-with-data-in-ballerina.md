---
layout: ballerina-working-with-data-in-ballerina-swanlake
title: Working with Data in Ballerina
permalink: /learn/working-with-data-in-ballerina/
keywords: query expressions, language integrated queries, programming language, getting started
description: Learn how to use Ballerina query expressions to filter, sort, and join different iterable collections.
active: working-with-data-in-ballerina
intro: This simple guide helps you understand how query expressions (a.k.a. language integrated queries) can be used on data to produce new data.
redirect_from:
  - /learn/working-with-data-in-ballerina
---

Ballerina supports first-class support for writing SQL-like queries to process data. Language-integrated queries can process any Ballerina iterable.

In this tutorial, you will be writing queries to filter, sort, and join with different data sets and produce new data sets.

## Setting up the Prerequisites

To complete this tutorial, you need:

1. A command terminal
2. A text editor
    >**Tip:** Preferably, [Visual Studio Code](https://code.visualstudio.com/) with the [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.ballerina).
3. A [Ballerina installation](https://ballerina.io/learn/installing-ballerina/setting-up-ballerina/)

## Creating a New Ballerina Project

To create a new Ballerina package, use the `bal new` command as shown below.

```bash
$ bal new query_expressions
```

This will create a new Ballerina package called `query_expressions`.

The `bal new` command generates the below files inside `query_expressions`.

```bash
cd query_expressions
tree .
.
├── Ballerina.toml
└── main.bal
    
0 directories, 2 files
```

## Defining the Dataset to be Processed

To keep the tutorial simple, you will be using an in-memory table to store the COVID-19 dataset. Each record of type `CovidEntry` in the table represents the COVID-19 data related to a particular country. The `iso_code` is used to uniquely identify a country and other fields are self-explanatory.
```ballerina
public type CovidEntry record {|
    readonly string iso_code;
    string country;
    decimal cases;
    decimal deaths;
    decimal recovered;
    decimal active;
|};

public final table<CovidEntry> key(iso_code) covidTable = table [
        {iso_code: "AFG", country: "Afghanistan", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
        {iso_code: "SL", country: "Sri Lanka", cases: 598536, deaths: 5243, recovered: 568637, active: 14656},
        {iso_code: "US", country: "USA", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097},
        {iso_code: "IND", country: "India", cases: 80808350, deaths: 980976, recovered: 33892279, active: 35035095}
    ];
```
Copy the above code snippet to `main.bal`. This will act as our COVID-19 Dataset.

## Filtering the Data

Let's define a function, which will filter out the records, which have values higher than 100,000 for the `cases` field.

```ballerina
public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}
```

The `filterCountriesByCases` function uses a query expression to iterate the records in the `dataTable` table and filter only the records, which have more than `noOfCases` cases. To filter, a `where` clause with a condition is used. All records, which satisfy the condition in the `where` clause will be _selected_. Copy the above code snippet and paste it on to `main.bal` just below the definition of the `covidTable`.

Let's call the `filterCountriesByCases` function from inside the `main` function.

```ballerina
public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);
}
```
In the `main` function, you have called the `filterCountriesByCases` function and have provided `covidTable` and `10000000` as parameters so that the function will filter the countries, which have more than 10000000 COVID-19 cases. In the next line, you have printed the result from the function. Copy the above code onto `main.bal` and execute `bal run` from within the `query_expression` project folder.

The result will print something similar to the below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
```
## Sorting Countries by COVID-19 Deaths

Let's define a new function to find the top three countries with the highest number of COVID-19 deaths. In this function, you will use another query to sort and retrieve a *limit*ed number of records from the table.

```ballerina
public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}
```
The `findCountriesByHighestNoOfDeaths` function uses query expression to find the top three countries with the highest COVID-19 deaths. The `order by` clause is used to sort the records in the table in `descending` order and the `limit` clause to limit the number of output records of the query to `n`. As the result, the query produces an array of tuples of type `[string, decimal]`. Each tuple contains the country name and the number of reported deaths. The produced array is in descending order by the number of deaths.

Let's call the `findCountriesByHighestNoOfDeaths` function from within the `main` function to find the top three countries by the number of deaths.

```ballerina
public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);

    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths:", countriesWithDeaths);
}
```

Copy the last two lines of the above code onto `main.bal` and execute `bal run` from within the `query_expression` project folder.

The output will look like the below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
```

## Joining with Another Datasource

Using query expressions, you can join two collections and produce a new collection. The `join` operation is similar to the SQL `join` operation. In this tutorial, you will be joining the `covidTable` with a string array, which contains three countries.

```ballerina
public function findRecoveredPatientsOfCountries(table<CovidEntry> dataTable, string[] countries) returns [string, decimal][] {
    [string, decimal][] countriesWithRecovered = from CovidEntry entry in dataTable
        join string country in countries on entry.country equals country
        select [entry.country, entry.recovered];
    return countriesWithRecovered;
}
```
The `findRecoveredPatientsOfCountries` function uses a query expression to join the `dataTable` table with an array of strings named `countries`. The join condition is provided after the `on` keyword. 

For every record in the `dataTable`, all the elements in the `countries` array will be joined. The output array of tuples will have the country and the number of recovered patients only if the condition after the `on` keyword is satisfied for that particular pair of table record and element of the array being joined.

Now, change the existing `main` function by calling the `findRecoveredPatientsOfCountries` function at the end to get the number of recovered patients. 
You will get the number of recovered patients in the USA, India, and Afghanistan. The updated `main` function should look like the one below.

```ballerina
public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);

    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths:", countriesWithDeaths);

    string[] c = ["USA", "India", "Afghanistan"];
    [string, decimal][] countriesWithRecovered = findRecoveredPatientsOfCountries(covidTable, c);
    io:println("Countries with number of Recovered patients:", countriesWithRecovered);
}
```

Now, if you execute `bal run` from inside the `query_expressions`, you will get an output similar to below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients:[["Afghanistan",146084],["USA",43892277],["India",33892279]]
```
## Finding Discrepancies in the Dataset

This example shows how you can use the `let` clause to maintain an intermediate state while iterating a collection using query expression and how to use that intermediate state for further processing. 
For example, in this dataset, the total number of reported cases should be equal to the sum of the number of deaths, recovered, and active. If they are not equal, an error should have occurred while the dataset is populated.

Let's define a function called `printErroneousData` to find any erroneous records in the dataset. If there is any record in which the number of reported `cases` is not equal to the sum of `recovered`, `active`, and `deaths`, this function will print it.

```ballerina
public function printErroneousData(table<CovidEntry> dataTable) {

    string[] countries = from CovidEntry entry in dataTable
        let decimal sum = entry.recovered + entry.deaths + entry.active
        where entry.cases != sum
        select entry.country;

    if countries.length() > 0 {
        io:println("Found erroneous entries for countries: ", countries);
    }
}
```
Here, you use the `sum` variable to hold the results of intermediate calculations in the query expression. 

>**Note:** Even though this particular example uses a separate variable to demonstrate the usage of the `let` clause, you can do the calculations inline from within the `where` clause also.

Now, let's call this function inside the `main` function. The final version of the `main` function looks like below.

```ballerina
public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);

    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths:", countriesWithDeaths);

    string[] c = ["USA", "India", "Afghanistan"];
    [string, decimal][] countriesWithRecovered = findRecoveredPatientsOfCountries(covidTable, c);
    io:println("Countries with number of Recovered patients:", countriesWithRecovered);

    printErroneousData(covidTable);
}
```

Now, execute `bal run` from within the `query_expression` folder, and you will see an output similar to below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients:[["Afghanistan",146084],["USA",43892277],["India",33892279]]
Found erroneous entries for countries: ["Sri Lanka","India"]
```
