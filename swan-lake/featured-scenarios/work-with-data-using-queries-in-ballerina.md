---
layout: ballerina-working-with-data-in-ballerina-swanlake
title: Work with data using queries in Ballerina
permalink: /learn/work-with-data-using-queries-in-ballerina/
keywords: query expressions, language integrated queries, programming language, getting started
description: Learn how to use Ballerina query expressions to filter, sort, and join different iterable collections.
active: work-with-data-using-queries-in-ballerina
intro: This guide walks you through using query expressions (a.k.a. language integrated queries) on data to filter, sort, and join with different data sets to produce new data.
---

Ballerina has first-class support for writing SQL-like queries to process data. Language-integrated queries can process any Ballerina iterable.

## Set up the prerequisites

To run this guide, you need the following prerequisites:

1. [Ballerina 2201.0.0 (Swan Lake)](/downloads/) or greater
2. A text editor
    >**Tip:** Preferably, <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> with the <a href="https://wso2.com/ballerina/vscode/docs/" target="_blank">Ballerina extension</a> installed.
3. A command terminal

## Create the Ballerina package

Ballerina uses packages to group code. You need to create a Ballerina package and write the business logic in it. In the terminal, execute the command below to create the Ballerina package for the implementation.

> **Info:** For more information on Ballerina packages, see [Organize Ballerina code](/learn/organize-ballerina-code/).

```bash
$ bal new query_expressions
```
You view the output below.

```bash
Created new package 'query_expressions' at query_expressions.
```

This creates a directory named `query_expressions` with the default module along with a sample code for the service as shown below. 

```bash
.
├── Ballerina.toml
└── main.bal
    
0 directories, 2 files
```

## Create the dataset 

To keep things simple, an in-memory table is used to store the COVID-19 dataset. To create the dataset, replace the `main.bal` file with the code below.

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
In this code:
- Each record of type `CovidEntry` in the table represents the COVID-19 data related to a particular country.
- The `iso_code` is used to uniquely identify a country and other fields are self-explanatory.

## Filter the data

### Create the `filterCountriesByCases` function

To define a function, which will filter out the records, which have values higher than 100,000 for the `cases` field, add the code below to the `main.bal` file.

```ballerina
public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}
```

In this code:
- The `filterCountriesByCases` function uses a query expression to iterate the records in the `dataTable` table and filter only the records, which have more than `noOfCases` cases. A `where` clause with a condition is used to filter. 
- All records, which satisfy the condition in the `where` clause will be _selected_. 

### Create the `main` function

To call the `filterCountriesByCases` function from inside the `main` function, add the code below to the `main.bal` file.

```ballerina
public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);
}
```

In this code,

- The `filterCountriesByCases` function is called and `covidTable` and `10000000` are provided as parameters so that the function will filter the countries, which have more than 10000000 COVID-19 cases. 
- The next line prints the result of the function. 

### The complete code of the filtering function

Below is the complete code after adding the filtering function.

```ballerina
public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}

public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);
}
```
### Run the package for filtering

In the terminal, navigate to the `query_expressions` directory, and execute the command below to run the service package.

```bash
$ bal run
```

> **Info**: The console should have warning logs related to the isolatedness of resources. It is a built-in service concurrency safety feature of Ballerina.

You view the output below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
```

## Sort countries by COVID-19 deaths

### Create the `findCountriesByHighestNoOfDeaths` function

To define a new function to find the top three countries with the highest number of COVID-19 deaths, add the code below to the `main.bal` file. 

```ballerina
public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}
```

In this code,
- You use another query to sort and retrieve a *limit*ed number of records from the table.
- The `findCountriesByHighestNoOfDeaths` function uses a query expression to find the top three countries with the highest COVID-19 deaths. 
- The `order by` clause is used to sort the records in the table in `descending` order and the `limit` clause to limit the number of output records of the query to `n`. 
- The query produces an array of tuples of type `[string, decimal]` as the result. Each tuple contains the country name and the number of reported deaths. 
- The produced array is in descending order by the number of deaths.

### Update the `main` function for sorting

To call the `findCountriesByHighestNoOfDeaths` function from within the `main` function to find the top three countries by the number of deaths, add the code below to the `main` function of the `main.bal` file.

```ballerina
    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths:", countriesWithDeaths);
```

### The complete code with the sorting function 

Below is the complete code after adding the sorting function.

```ballerina
public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}

public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}

public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);
    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths:", countriesWithDeaths);
}
```

### Run the package for sorting

In the terminal, navigate to the `query_expressions` directory, and execute the command below to run the service package.

```bash
$ bal run
```

You view the output below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
```

## Join with another data source

### Create the `findRecoveredPatientsOfCountries` function

Using query expressions, you can join two collections and produce a new collection. The `join` operation is similar to the SQL `join` operation. To join the `covidTable` with a string array, which contains three countries, add the code below to the `main.bal` file. 

```ballerina
public function findRecoveredPatientsOfCountries(table<CovidEntry> dataTable, string[] countries) returns [string, decimal][] {
    [string, decimal][] countriesWithRecovered = from CovidEntry entry in dataTable
        join string country in countries on entry.country equals country
        select [entry.country, entry.recovered];
    return countriesWithRecovered;
}
```

In this code:
- The `findRecoveredPatientsOfCountries` function uses a query expression to join the `dataTable` table with an array of strings named `countries`. The join condition is provided after the `on` keyword. 
- For every record in the `dataTable`, all the elements in the `countries` array will be joined. 
- The output array of tuples will have the country and the number of recovered patients only if the condition after the `on` keyword is satisfied for that particular pair of table records and element of the array being joined.

### Update the `main` function for joining

To call the `findRecoveredPatientsOfCountries` function at the end to get the number of recovered patients, add the code below to the `main` function of the `main.bal` file. 

>**Info:** You will get the number of recovered patients in the USA, India, and Afghanistan. 

```ballerina
    string[] c = ["USA", "India", "Afghanistan"];
    [string, decimal][] countriesWithRecovered = findRecoveredPatientsOfCountries(covidTable, c);
    io:println("Countries with number of Recovered patients:", countriesWithRecovered);
```

### The complete code with the joining function

Below is the complete code after adding the joining function.

```ballerina
public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}

public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}

public function findRecoveredPatientsOfCountries(table<CovidEntry> dataTable, string[] countries) returns [string, decimal][] {
    [string, decimal][] countriesWithRecovered = from CovidEntry entry in dataTable
        join string country in countries on entry.country equals country
        select [entry.country, entry.recovered];
    return countriesWithRecovered;
}

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

### Run the package for joining

In the terminal, navigate to the `query_expressions` directory, and execute the command below to run the service package.

```bash
$ bal run
```

You view the output below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients:[["Afghanistan",146084],["USA",43892277],["India",33892279]]
```

## Find discrepancies in the dataset

### Create the `printErroneousData` function

This example shows how you can use the `let` clause to maintain an intermediate state while iterating a collection using query expression and how to use that intermediate state for further processing. For example, in this dataset, the total number of reported cases should be equal to the sum of the number of deaths, recovered, and active. If they are not equal, an error should have occurred while the dataset is populated.

To define a function called `printErroneousData` to find any erroneous records in the dataset, add the code below to the `main.bal` file.  

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

In this code:
- If there is any record in which the number of reported `cases` is not equal to the sum of `recovered`, `active`, and `deaths`, this function will print it.
- Here, you use the `sum` variable to hold the results of intermediate calculations in the query expression. 

>**Note:** Even though this particular example uses a separate variable to demonstrate the usage of the `let` clause, you can do the calculations inline from within the `where` clause also.

### Call the `printErroneousData` function

To call the `findRecoveredPatientsOfCountries` function at the end to get the number of recovered patients, add the code below to the `main` function of the `main.bal` file. 

```ballerina
printErroneousData(covidTable);
```

### The complete code 

Below is the complete code after adding the finding function.

```ballerina
public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}

public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}

public function findRecoveredPatientsOfCountries(table<CovidEntry> dataTable, string[] countries) returns [string, decimal][] {
    [string, decimal][] countriesWithRecovered = from CovidEntry entry in dataTable
        join string country in countries on entry.country equals country
        select [entry.country, entry.recovered];
    return countriesWithRecovered;
}

public function printErroneousData(table<CovidEntry> dataTable) {

    string[] countries = from CovidEntry entry in dataTable
        let decimal sum = entry.recovered + entry.deaths + entry.active
        where entry.cases != sum
        select entry.country;

    if countries.length() > 0 {
        io:println("Found erroneous entries for countries: ", countries);
    }
}

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

### Run the package

In the terminal, navigate to the `query_expressions` directory, and execute the command below to run the service package.

```bash
$ bal run
```

You view the output below.

```bash
Compiling source
        .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths:[["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients:[["Afghanistan",146084],["USA",43892277],["India",33892279]]
Found erroneous entries for countries: ["Sri Lanka","India"]
```

## Calculate the total number of deaths

### Create the `getTotalNumberOfDeaths` function

You can use the `collect` clause to aggregate the input records of the query. If you use the collect clause, all the variables in the query expression become aggregated variables.

The aggregated variables can only be used in the following ways:
1. An aggregated variable can be a rest argument to a langlib function call. It is not necessary to use the module prefix in the langlib function call. For example, you can write `sum(deaths)` instead of `int:sum(deaths)`. Essential aggregating functions such as `min`, `max`, `avg`, `sum`, `first`, `last`, and `count` are available.
2. An aggregated variable can be an element in a single element list constructor.

In the following example, the `deaths` variable becomes an aggregated variable. The `sum` function is used to calculate the total number of deaths.

Add the code below to the `main.bal` file to define a function to get the total number of deaths.

```ballerina
public function getTotalNumberOfDeaths(table<CovidEntry> dataTable) returns decimal {
    return from var {deaths} in dataTable
            collect sum(deaths);
}
```

In this code,
- The `collect` clause aggregates the input values into one group.
- Since `deaths` becomes a sequence value, you can call the `sum` function in order to get the total number of deaths.

### Update the main function for aggregation

Add the code below to the main function of the `main.bal` file to call the `getTotalNumberOfDeaths` function within the main function for finding the total number of deaths.

### The complete code with the aggregating function

```ballerina
import ballerina/io;

public type CovidEntry record {|
    readonly string iso_code;
    string country;
    string continent;
    decimal cases;
    decimal deaths;
    decimal recovered;
    decimal active;
|};

public final table<CovidEntry> key(iso_code) covidTable = table [
    {iso_code: "AFG", country: "Afghanistan", continent: "Asia", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {iso_code: "SL", country: "Sri Lanka", continent: "Asia", cases: 598536, deaths: 5243, recovered: 568637, active: 14656},
    {iso_code: "US", country: "USA", continent: "North America", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097},
    {iso_code: "IND", country: "India", continent: "Asia", cases: 80808350, deaths: 980976, recovered: 33892279, active: 35035095}
];

public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}

public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}

public function findRecoveredPatientsOfCountries(table<CovidEntry> dataTable, string[] countries) returns [string, decimal][] {
    [string, decimal][] countriesWithRecovered = from CovidEntry entry in dataTable
        join string country in countries on entry.country equals country
        select [entry.country, entry.recovered];
    return countriesWithRecovered;
}

public function printErroneousData(table<CovidEntry> dataTable) {

    string[] countries = from CovidEntry entry in dataTable
        let decimal sum = entry.recovered + entry.deaths + entry.active
        where entry.cases != sum
        select entry.country;

    if countries.length() > 0 {
        io:println("Found erroneous entries for countries: ", countries);
    }
}

public function getTotalNumberOfDeaths(table<CovidEntry> dataTable) returns decimal {
    return from var {deaths} in dataTable
            collect sum(deaths);
}

public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);

    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths: ", countriesWithDeaths);

    string[] c = ["USA", "India", "Afghanistan"];
    [string, decimal][] countriesWithRecovered = findRecoveredPatientsOfCountries(covidTable, c);
    io:println("Countries with number of Recovered patients: ", countriesWithRecovered);

    printErroneousData(covidTable);

    decimal totalDeaths = getTotalNumberOfDeaths(covidTable);
    io:println("Total number of deaths: ", totalDeaths);
}
```

### Run the package for aggregation

In the terminal, navigate to the `query_expressions` directory, and execute the command below to run the service package.

```bash
$ bal run
```

You view the output below.

```bash
Compiling source
	    .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths: [["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients: [["Afghanistan",146084],["USA",43892277],["India",33892279]]
Found erroneous entries for countries: ["Sri Lanka","India"]
Total number of deaths: 1874581
```

## Group the deaths by the continent

### Create the `groupDeathsByContinent` function

The `group by` clause is used to group the input based on one or more `grouping-key`s. The set of variables that do not belong to `grouping-key`s become aggregated variables after the `group by` clause. 

The aggregated variables can only be used in the following ways:
1. An aggregated variable can be a rest argument to a langlib function call. It is not necessary to use the module prefix in the langlib function call. For example, you can write `sum(deaths)` instead of `int:sum(deaths)`. Essential aggregating functions such as `min`, `max`, `avg`, `sum`, `first`, `last`, and `count` are available.
2. An aggregated variable can be an element in a single element list constructor.

Add the following code to the `main.bal` file to define a function that groups the data by continent and retrieves the total number of deaths per continent.

```ballerina
public function groupDeathsByContinent(table<CovidEntry> dataTable) returns record {|string continent; decimal[] cases; decimal deaths;|}[] {
    return from var {continent, cases, deaths} in dataTable
        group by continent
        select {continent, cases: [cases], deaths: sum(deaths)};
}
```

In this code,
- The `group by` clause is used to group the input and the `grouping-key` comes after the `group by` clause. In this example, the `continent` is the `grouping-key`. This is unique for each group and is used to group the input.
- Since the `grouping-key` is `continent`, the input table is grouped by the `continent` in the `groupDeathsByContinent` function.
- After creating groups based on the `continent`, the `deaths` and `cases` become sequence values for each `continent`.
- You can call the `sum` function to get the total number of deaths per `continent`.
- You can represent the `cases` as a list using `[cases]`.

### Update the main function for grouping

Add the code below to the main function of the `main.bal` file to call the `groupDeathsByContinent` function within the main function and find the number of total deaths per `continent`.

### The complete code with the grouping function

```ballerina
import ballerina/io;

public type CovidEntry record {|
    readonly string iso_code;
    string country;
    string continent;
    decimal cases;
    decimal deaths;
    decimal recovered;
    decimal active;
|};

public final table<CovidEntry> key(iso_code) covidTable = table [
    {iso_code: "AFG", country: "Afghanistan", continent: "Asia", cases: 159303, deaths: 7386, recovered: 146084, active: 5833},
    {iso_code: "SL", country: "Sri Lanka", continent: "Asia", cases: 598536, deaths: 5243, recovered: 568637, active: 14656},
    {iso_code: "US", country: "USA", continent: "North America", cases: 69808350, deaths: 880976, recovered: 43892277, active: 25035097},
    {iso_code: "IND", country: "India", continent: "Asia", cases: 80808350, deaths: 980976, recovered: 33892279, active: 35035095}
];

public function filterCountriesByCases(table<CovidEntry> dataTable, decimal noOfCases) returns string[] {
    string[] filteredCountries = from CovidEntry entry in dataTable
        where entry.cases > noOfCases
        select entry.country;
    return filteredCountries;
}

public function findCountriesByHighestNoOfDeaths(table<CovidEntry> dataTable, int n) returns [string, decimal][] {
    [string, decimal][] countriesWithDeaths = from CovidEntry entry in dataTable
        order by entry.deaths descending
        limit n
        select [entry.country, entry.deaths];
    return countriesWithDeaths;
}

public function findRecoveredPatientsOfCountries(table<CovidEntry> dataTable, string[] countries) returns [string, decimal][] {
    [string, decimal][] countriesWithRecovered = from CovidEntry entry in dataTable
        join string country in countries on entry.country equals country
        select [entry.country, entry.recovered];
    return countriesWithRecovered;
}

public function printErroneousData(table<CovidEntry> dataTable) {
    string[] countries = from CovidEntry entry in dataTable
        let decimal sum = entry.recovered + entry.deaths + entry.active
        where entry.cases != sum
        select entry.country;

    if countries.length() > 0 {
        io:println("Found erroneous entries for countries: ", countries);
    }
}

public function getTotalNumberOfDeaths(table<CovidEntry> dataTable) returns decimal {
    return from var {deaths} in dataTable
            collect sum(deaths);
}

public function groupDeathsByContinent(table<CovidEntry> dataTable) returns record {|string continent; decimal[] cases; decimal deaths;|}[] {
    return from var {continent, cases, deaths} in dataTable
        group by continent
        select {continent, cases: [cases], deaths: sum(deaths)};
}

public function main() {
    string[] countries = filterCountriesByCases(covidTable, 10000000);
    io:println("Countries with more than 10 million cases: ", countries);

    [string, decimal][] countriesWithDeaths = findCountriesByHighestNoOfDeaths(covidTable, 3);
    io:println("Countries with highest deaths: ", countriesWithDeaths);

    string[] c = ["USA", "India", "Afghanistan"];
    [string, decimal][] countriesWithRecovered = findRecoveredPatientsOfCountries(covidTable, c);
    io:println("Countries with number of Recovered patients: ", countriesWithRecovered);

    printErroneousData(covidTable);

    decimal totalDeaths = getTotalNumberOfDeaths(covidTable);
    io:println("Total number of deaths: ", totalDeaths);

    record {|string continent; decimal[] cases; decimal deaths;|}[] deathsByContinent = groupDeathsByContinent(covidTable);
    io:println("Cases and total number of deaths by continent: ", deathsByContinent);
}
```

### Run the package for grouping

In the terminal, navigate to the `query_expressions` directory, and execute the command below to run the service package.

```bash
$ bal run
```

You view the output below.

```bash
Compiling source
	    .../query_expressions:0.1.0

Running executable

Countries with more than 10 million cases: ["USA","India"]
Countries with highest deaths: [["India",980976],["USA",880976],["Afghanistan",7386]]
Countries with number of Recovered patients: [["Afghanistan",146084],["USA",43892277],["India",33892279]]
Found erroneous entries for countries: ["Sri Lanka","India"]
Total number of deaths: 1874581
Cases and total number of deaths by continent: [{"continent":"Asia","cases":[159303,598536,80808350],"deaths":993605},{"continent":"North America","cases":[69808350],"deaths":880976}]
```
