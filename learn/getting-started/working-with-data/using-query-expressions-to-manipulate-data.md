---
layout: using-query-expressions-to-manipulate-data
title: Using Query Expressions to Manipulate Data
permalink: /learn/using-query-expressions-to-manipulate-data
description: This simple guide helps you understand how query expressions can be used on data to produce new data 
active: using-query-expressions-to-manipulate-data
intro: This simple guide helps you understand how query expressions can be used on data to produce new data 
redirect_from:
  - /learn/using-query-expressions-to-manipulate-data
---

This simple guide helps you understand how query expressions (a.k.a language integrated queries) can be used on data to produce new data.

Ballerina supports first-class support for writing SQL-like queries to process data.

Language integrated queries can process any ballerina iterable collection.

In this tutorial, you will be writing queries to filter, sort and join with other data sets and produce new data sets.

This tutorial includes the following steps.

1. Create a new Ballerina project
2. Define the Covid dataset to be processed
3. Find all countries which have more than 10,000,000 Covid cases
4. Find the top three countries by the number of reported Covid cases
5. Join the table with an array to find the number of recovered patients of three random countries
6. Find any discrepancies in reported Covid dataset while maintaining intermediate states

## Prerequisite

Following two prerequisites are needed for this tutorial. 

1. Install [Ballerina Swan Lake](https://ballerina.io/downloads/)
2. Install [VSCode](https://code.visualstudio.com/download) with [Ballerina extension](https://marketplace.visualstudio.com/items?itemName=WSO2.Ballerina)


## Create a new Ballerina project

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

## Define the Covid dataset to be processed

For the sake of keeping the tutorial simple, we will be using an in-memory table to store Covid dataset. Each record of type `CovidEntry` in the table, represents the Covid data related to a particular country. The `iso_code` is used to uniquely identify a country and other fields are self-explanatory
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
Copy the above code snippet to `main.bal`. This will act as our Covid Dataset.

## Find all countries which have more than 10,000,000 Covid cases

Let's define a function which will filter out the records which have values higher than 100,000 for `cases` field.

```ballerina
public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] countries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return countries;
}
```

`filterCountriesByCases` uses a query expression to iterate the records in the table `dataTable` and filter only records which has more than `noOfCases` cases. To filter, `where` clause with a condition, is used. All records which satisfy the condition in the `where` clause, will be _selected_. Copy above code snippet and paste on to `main.bal`, just below the definition of `covidTable`.

Let's call `filterCountriesByCases` function inside the `main` function.

```ballerina
public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);
}
```
In `main` function, we have called `filterCountriesByCases` function and have provided `covidTable` and `10000000` as parameters, so that the function will filter the countries which have more than 10000000 covid cases. In the next line we have printed the result from the function. Copy the above code onto `main.bal` and execute `bal run` from within the `query_expression` project folder.

The result will print something similar to below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
```
## Find the top three countries by the number of reported Covid deaths

Let's define a new function to find the top three countries with highest number of covid deaths. In this function, we will use queries to sort a table and retrieve a *limit*ed number of sorted records from the table.

```ballerina
public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}
```
`findCountriesByHighestNoOfDeaths` function uses queries to find the top three countries with highest Covid deaths. `order by` clause is used to sort the records in the table in `descending` order and limit the number of output records of the query to `n`. Here, as the result, query produces an array of tuples of type `[string, decimal]`. A tuple contain the country and the number of reported deaths. The produced array is in descending order by the number of deaths.

Let's call `findCountriesByHighestNoOfDeaths` function in `main` function to find the top three countries by the number of deaths.

```ballerina
public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);

    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths:", countriesWithDeaths);
}
```

The last two lines were added to print the Top three countries by number of deaths. Copy  the last two lines of the above code onto `main.bal` and execute `bal run` from within the `query_expression` project folder.

The output will look like below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
```

## Join the table with an array to find the number of recovered patients of three countries

Using query expressions, we can join two collections and produce new collection. The `join` operation is similar to SQL join. In this tutorial, we will be joining the `covidTable` with a string array which contains three countries.

```ballerina
public function findRecoveredPatientsOfCountries(table<CovidEntry> dataTable, string[] countries) returns [string, decimal][] {
    [string, decimal][] countriesWithRecovered = from CovidEntry entry in dataTable
        join string country in countries on entry.country equals country
        select [entry.country, entry.recovered];
    return countriesWithRecovered;
}
```
`findRecoveredPatientsOfCountries` function uses a query expression to join the `dataTable` table with an array of strings `countries`. When the table is joined with the array, a condition is provided after `on` keyword. For every record in `dataTable`, all the elements in `countries` array, will be joined and the new array of tuples will have the country and number of recovered patients only if the condition after `on` keyword is satisfied for that particular pair of table record and element of array being joined.

Now change the existing `main` function by calling the `findRecoveredPatientsOfCountries` function at the end to get number of the recovered patients. In this tutorial we will retrieve the number of recovered patients of USA, India, and Afghanistan. The updated `main` function looks like below.

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

Now, if you execute `bal run` inside `query_expressions`, you will get an output similar to below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients:[["Afghanistan",146084],["USA",43892277],["India",33892279]]
```
## Find any discrepancies in reported Covid dataset using intermediate states

This examples merely shows how we can use `let` clause to maintain an intermediate state while iterating a collection using query expression and use that intermediate state for further processing. For example, in this dataset, The total number of reported cases should be equal to the sum of number of deaths, recovered and active. If they are not equal, something has gone wrong while the dataset is populated.

Let's define a function called `printErroneousData` to find any erroneous records in the dataset. If there is any record where the number of reported `cases` are not equal to the sum of `recovered`, `active` and `deaths`, This function will print them.

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
Here, we use `sum` variable to hold the results of intermediate calculations in the query expression. Note that in this particular example, we could have done the calculations inline within the `where` clause too. But for the sake of demonstration of usage of `let` clause, a separate variable is used.

Now let's call this function in `main` function. The final version of `main` function looks like below.

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

Now run execute `bal run` from within `query_expression` folder and you will see an output similar to below

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients:[["Afghanistan",146084],["USA",43892277],["India",33892279]]
Found erroneous entries for countries: ["Sri Lanka","India"]
```