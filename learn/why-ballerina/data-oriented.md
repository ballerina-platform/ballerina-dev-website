---
layout: ballerina-why-ballerina-left-nav-pages-swanlake
title: Data oriented
description: Language-integrated queries specify the logic in SQL-like syntax to process data and events. They are easy to write and understand due to the simplicity of the syntax. See how Ballerina provides first-class support for writing queries that process data.
keywords: ballerina, networking, microservices, programming language, distributed computing, services, data oriented, data transformation
permalink: /why-ballerina/data-oriented/
active: data-oriented
intro: Language-integrated queries specify the logic in SQL-like syntax to process data and events. They are easy to write and understand due to the simplicity of the syntax. See how Ballerina provides first-class support for writing queries that process data.
redirect_from:
    - /learn/user-guide/why-ballerina/data-oriented/
    - /learn/user-guide/why-ballerina/data-oriented
    - /learn/why-ballerina/data-oriented
    - /learn/why-ballerina/data-oriented/
    - /why-ballerina/data-oriented
---

As of now, language-integrated queries are supported for iterator implementations such as an array, map, stream, and table. There are two kinds of integrated queries that can be written in Ballerina:

- [**Query expression:**](#query-expressions) allows generating a list, table, string, or XML
- [**Query action:**](#query-actions) executes a set of statements for each element of the iterator

## Query expressions

Query expressions allow you to generate a list, stream, table, string, or XML. The sections below look at the clauses you can use in a query expression.

### Query clauses

Query expressions contain a set of clauses similar to SQL to process the data. They must start with the `from` clause and can perform various operations such as filter, join, sort, limit, and projection. There are various SQL-like clauses below to perform these operations. 

#### 'from' clause

The `from` clause is used to define the input iterator source that is considered for processing the data. Similar to the `for each` statement, you can specify any iterator as the expression. Similar to a list and stream, you can use all kinds of iterators as the input in the `from` clause.

#### 'where' clause

The `where` clause allows you to filter by condition. You can define any conditional expression, which returns a boolean. A `where` clause contains logical operators, equality, and range checks.

#### 'let' clause

The `let` clause allows you to define variables that can be used only within the query expression scope. These variables cannot be accessed out of the query expression. You can define one or more variables in the `let` clause and use them within query expressions. 

#### 'join' clause

A `join` clause performs an inner or left outer equijoin. In the `join` clause, there are two input iterators. During the joining process, each value of an iterator is matched against all the values in the other iterator based on the given condition, and the output values are generated for all the matching event pairs. Here, you can only perform equality checks as the joining condition.

#### 'order by' clause 

The `order by` clause allows ordering the result in the ascending and/or descending order based on the specified attributes. Ordering will be done in an ascending manner by default. You can use the `descending` keyword to order in a descending manner. Here, attributes that are considered for the `order by` operations are order-keys, which should be an ordered type. You can define more than one order key in the `order by` clause and it’s possible to have more than one `order by` clause. 

#### 'limit' clause

The `limit` clause limits the number of frames/values emitted by a query pipeline. You should define an integer value to specify the number of output values.

#### 'select' clause

The `select` clause is a mandatory clause in query expressions that is used for projection. You can use this clause to create the values required to generate iterators such as list, table, XML, string, and stream. 

#### 'on conflict' clause

An `on conflict` clause is only allowed for a query expression that constructs a table with a key sequence. The expression is evaluated when the `select` clause emits a value that conflicts with a previous value, in the sense, that both values have the same key value in the table. The `on conflict` clause gets executed when the `select` clause emits a row that has the same key as a row that it emitted earlier. It gives an `onConflictError` error if there is a key conflict.

## Query actions

Query actions are executed in the same way as the clauses in the query expression. However, it doesn't generate an output such as a list. Rather, it executes a set of statements defined by you. The block inside the `do` clause is executed in each iteration.

### Query action example

```ballerina
var x = from var person in personList
    from var dept in deptList
    let string hrDepartment = "Human Resource"
    do {
        if (dept.name == "HR") {
            Employee employee = {firstName: person.firstName, lastName: person.lastName, deptAccess: hrDepartment};
            employeeList[employeeList.length()] = employee;
        }
    };
```

## Write integrated queries

The example below provides in-depth knowledge on how to utilize the capabilities of the Ballerina query expressions. This example explains the use case of finding popular books in a store.

```ballerina
import ballerina/io;

type Author record {|
    readonly int id;
    string name;
|};

type Category record {|
    readonly int id;
    string name;
|};

type Book record {|
    readonly int id;
    string title;
    int year;
    float price;
    Author[] authors;
    Category[] categories;
|};

type Sale record {|
    int bookId;
    int qty;
|};

type AuthorTable table<Author> key(id);

type CategoryTable table<Category> key(id);

type BookTable table<Book> key(id);

error onConflictError = error("Key Conflict", message = "record with same key exists.");
```

In the above code, the necessary custom types and variables are created to perform the data manipulation.

```ballerina
function loadAuthors() returns AuthorTable|error {
    json[] authors = [
        {"id": 1, "name": "Giada De Laurentiis"},
        {"id": 2, "name": "J. K. Rowling"},
        {"id": 3, "name": "Henrique C. M. Andrade"},
        {"id": 4, "name": "Buğra Gedik"},
        {"id": 5, "name": "Deepak S. Turaga"}
    ];

    // Iterates through the `authors` JSON array, constructs the `Author` records, and collects them into a table.
    return table key(id) from var author in authors
        select check author.cloneWithType(Author)
        on conflict onConflictError;
}
```

Here, the author details are represented as JSON elements. In this method, the respective author JSON elements are converted into tabular data using Ballerina query expressions for further processing.

```ballerina
function loadCategories() returns CategoryTable|error {
    xml categories = xml `<categories>
                       <category>
                           <id>1</id>
                           <name>cooking</name>
                       </category>
                       <category>
                           <id>2</id>
                           <name>children</name>
                       </category>
                       <category>
                           <id>3</id>
                           <name>fantasy</name>
                       </category>
                       <category>
                           <id>4</id>
                           <name>education</name>
                       </category>
                   </categories>`;

    // Iterates through the `categories` XML array, constructs the `Category` records, and collects them into a table.
    return table key(id) from var category in categories/<category>
        select {
            id: check 'int:fromString((category/**/<id>/*).toString()),
            name: (category/**/<name>/*).toString()
        }
        on conflict onConflictError;
}
```

The above method iterates through a `categories` XML array and constructs a table with the category ID and name. Query expression clauses such as `from`, `select`, and `on conflict` are used in it.

```ballerina
function getCategories(CategoryTable categories, int[] ids) returns Category[] {
    // Queries the `categories` of each ID and collects the matching categories into an array.
    return from int id in ids
        join Category c in categories on id equals c.id
        select c;
}
```

The above method returns the book category names according to the given category IDs. As written in the query expression, a `join` clause iterates through the `categories` array to find the respective category name according to the ID. 

```ballerina
function getAuthors(AuthorTable authors, int[] ids) returns Author[] {
    // Queries the `authors` of each ID and collects the matching authors into an array.
    return from int id in ids
        join Author a in authors on id equals a.id
        select a;
}
```

Here, the author names are identified according to the author IDs. As similar to the previous method, query joins are utilized to create the `authors` array. 

```ballerina
function loadBooks() returns BookTable|error {
    map<anydata>[] books = [
        {"id": 1, "title": "Everyday Italian", "year": 2005, "price": 30.00, "authors": [1], "categories": [1]},
        {"id": 2, "title": "Harry Potter", "year": 1997, "price": 29.99, "authors": [2], "categories": [2, 3]},
        {"id": 3, "title": "Fundamentals of Stream Processing", "year": 2014, "price": 123.99, "authors": [3, 4, 5], "categories": [4]},
        {"id": 4, "title": "Fantastic Beasts", "year": 2001, "price": 29.99, "authors": [2], "categories": [2, 3]}
    ];

    // Iterates through the `books` map<anydata> array, constructs the `Book` records, and collects them into a table.
    return table key(id) from var book in books
        let AuthorTable authors = check loadAuthors()
        let CategoryTable categories = check loadCategories()
        select {
            id: <int>book["id"],
            title: <string>book["title"],
            year: <int>book["year"],
            price: <float>book["price"],
            authors: getAuthors(authors, check book["authors"].cloneWithType()),
            categories: getCategories(categories, check book["categories"].cloneWithType())
        }
        on conflict onConflictError;
}
```

Now, the author details and book category details exist as individual table values. The book details exist as an array. Further, this array has the necessary keys to identify the respective authors and book categories. Hence, there is a requirement to generate a table, which contains the relevant book details, author names, and category names. As shown in the above example, Ballerina query expressions can be utilized to create such table values.  

```ballerina
function getPopularBooks(stream<Sale> sales, int minSales, int 'limit) returns Book[]|error {
    // Join each sale value from the `sales` stream with the retrieved `BookTable`,
    // filter books with at least `minSales` number of sales,
    // order filtered books by sales quantity,
    // and collect the `limit` number of books into an array.
    return from Sale s in sales
        join Book b in check loadBooks() on s.bookId equals b.id
        where s.qty >= minSales
        order by s.qty descending
        limit 'limit
        select b;
}
```

Now, you have the book details as a table value and there is a requirement to identify the popular books based on the number of sales copies. As shown in the above example, you have to combine the `sales` array and the `books` table to identify the popular books. In this example, Ballerina query clauses such as `join`, `where`, `order by`, and `limit` are utilized to cater to the requirement. 

```ballerina
public function main() returns error? {
    Sale[] sales = [
        {bookId: 1, qty: 150},
        {bookId: 2, qty: 3500},
        {bookId: 3, qty: 1250},
        {bookId: 4, qty: 2100}
    ];

    // Retrieve the two most popular books with at least 1000 sales.
    Book[]|error mostPopular2Books = getPopularBooks(sales.toStream(), 1000, 2);
    io:println(mostPopular2Books);
}
```

The `main` method is responsible for identifying the popular books according to the number of copies sold. Hence, the respective `getPopularBooks` method gets called with the required parameters.

<style>
.nav > li.cVersionItem {
    display: none !important;
}
/**.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}**/
</style>
