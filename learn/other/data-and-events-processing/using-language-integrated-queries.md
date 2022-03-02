---
layout: ballerina-left-nav-pages-swanlake
title: Using language-integrated queries
description: Language integrated queries specify the logic in SQL-like syntax to process data and events. They are easy to write and understand due to the simplicity of the syntax. The sections below will explore Ballerina’s first-class support for writing queries that process data with examples.
keywords: ballerina, programming language, queries, query expression, query action
permalink: /learn/user-guide/data-and-events-processing/using-language-integrated-queries/
active: using-language-integrated-queries
intro: Language integrated queries specify the logic in SQL-like syntax to process data and events. They are easy to write and understand due to the simplicity of the syntax. The sections below will explore Ballerina’s first-class support for writing queries that process data with examples.
redirect_from:
  - /learn/data-and-events-processing/using-language-integrated-queries
  - /learn/data-and-events-processing/
  - /learn/data-and-events-processing
  - /swan-lake/learn/data-and-events-processing/using-language-integrated-queries/
  - /swan-lake/learn/data-and-events-processing/using-language-integrated-queries
  - /learn/data-and-events-processing/using-language-integrated-queries/
  - /learn/data-and-events-processing/using-language-integrated-queries
  - /learn/user-guide/data-and-events-processing/using-language-integrated-queries
  - /learn/user-guide/data-and-events-processing/
  - /learn/user-guide/data-and-events-processing
redirect_to:
  - /learn/by-example/
---

## Using language-integrated queries

As of now, language-integrated queries are supported for iterator implementations such as an array, map, stream, and table. The two kinds of integrated queries below can be written in Ballerina.

- [Query Expressions](#query-expressions)
- [Query Actions](#query-actions)

## Query expressions

Query expressions allow you to generate a list, table, string, or XML. The sections below include the clauses you can use in a query expression.

### Query clauses

Query expressions contain a set of clauses similar to SQL to process the data. They must start with the `from` clause and can perform various operations such as filter, join, sort, limit, and projection. There are various SQL-like clauses to perform these operations.

#### 'From' clause

The `from` clause is used to define the input iterator source that is considered for processing the data. Similar to the `for each` statement, you can specify any iterator as the expression. 

**List as the input**

In the example below, the `studentList` variable is a list iterator. 

```ballerina
Student s1 = { firstName: "Michelle", lastName: "Sadler", intakeYear: 1990,
              gpa: 3.5 };
Student s2 = { firstName: "Ranjan", lastName: "Fonseka", intakeYear: 2001,
              gpa: 1.9 };
 
Student[] studentList = [s1, s2];
string[] studentNames = from Student student in studentList
                    select student.firstName + " " + student.lastName;
```

**Stream as the input**

In the example below, the `numberStream` variable is a stream iterator.

```ballerina
NumberGenerator numGen = new;
var numberStream = new stream<int, error>(numGen);
 
var oddNumberList = from var num in numberStream
                where (num % 2 == 1)
                select num;
```

It is also possible to have more than one `from` clause as shown below. In the example below, each `person` value in the `personList` joins with each `department` value in the `deptList` similar to a nested query for each statement. 

```ballerina
Person[] personList = [p1, p2, p3];
Department[] deptList = [d1, d2];
 
Person[] outputPersonList =
        from var person in personList
        from var dept in deptList
        where person.firstName == "Alex"
        where person.deptAccess == "XYZ"
        select {
              firstName: person.firstName,
              lastName: person.lastName,
              deptAccess: dept.name
        };
```

>**Info:** Similar to list and stream, you can use all kinds of iterators as the input in the `from` clause.

#### 'Where' clause

The `where` clause allows you to filter by a condition. You can define any conditional expression, which returns a boolean.

**Filtering with a simple equal check**

The example below has a simple filter condition that performs an equality check.

```ballerina
Person[] outputPersonList =
    from var { firstName: fName, lastName: lName, deptAccess: dept } in personList
    where dept == "Human Resource"
    select {
            firstName: fName,
            lastName: lName,
            deptAccess: "HR"
    };
```

**Filtering with multiple conditions**

The example below has a `where` clause with complex conditional expressions that contain logical operators, equality, and range checks.

```ballerina
Student[] outputStudentList =
    from var student in studentList
    where student.firstName == "Ranjan" || student.firstName == "Alex" && student.score >= 82.5
    select {
            firstName: student.firstName,
            lastName: student.lastName,
            score: student.score
 
    };
```

**Filtering with multiple `Where` clauses**

The example below has multiple `where` clauses defined in the query expression. This is similar to the filtering conditions with a logical `&&` operator.

```ballerina
Person[] outputPersonList =
          from var person in personList
          from var dept in deptList
          where person.firstName == "Alex"
          where person.deptAccess == "XYZ"
          select {
                firstName: person.firstName,
                lastName: person.lastName,
                deptAccess: dept.name
          };
```
#### 'Let' clause

The `let` clause allows you to define variables that can be used only within the query expression scope. These variables cannot be accessed out of the query expression.

**Defining multiple variables**

The example below defines one or more variables in the `let` clause and uses them within query expressions.

```ballerina
Person[] outputPersonList =
           from var person in personList
           let string depName = "WSO2", string replaceName = "Alexander"
           select {
                  firstName: replaceName,
                  lastName: person.lastName,
                  deptAccess: depName
           };
```

Also, the example below uses multiple `let` clauses to define multiple variables.

```ballerina

Person[] outputPersonList =
        from var person in personList
        let string depName = "WSO2"
        let string replaceName = "Alexander"
        where person.deptAccess == "XYZ" && person.firstName == "Alex"
        select {
              firstName: replaceName,
              lastName: person.lastName,
              deptAccess: depName
        };
```

#### 'Join' clause

A `join` clause performs an `inner` or `left outer` equijoin. In the `join` clause, there are two input iterators. During the joining process, each value of an iterator is matched against all the values in the other iterator based on the given condition, and the output values are generated for all the matching event pairs. Therefore, you can only perform equality checks as the joining condition.

**Inner `Join` clause**

The example below joins two lists based on a `join` condition, which is an equality check. This is an `inner join` and if there are no matching values, then, there won’t be any output generated from the `join` operation.

```ballerina

PersonInfo[] personInfoList =
    from var person in personList
    join Department dept in deptList
    on person.id equals dept.id
    select {
        fname : person.fname,
        lname : person.lname,
        dept : dept.name
    };
```

**Left `Outer Join` clause**

The example below performs a `left outer join` between the two input iterator lists. The key difference of the `outer join` compared to the `inner join` is even there are no matching values in the other list as per the joining condition, unavailable values are marked as nil.

```ballerina
PersonInfo[] personInfoList =
        from var person in personList
        outer join Department dept in deptList
        on person.id equals dept.id
      select {
            fname : person.fname,
            lname : person.lname,
            dept : dept.name
        };
```

#### 'Order by` clause 

The `order by` clause allows ordering the results in an ascending and/or descending order based on the specified attributes. Ordering will be done in an ascending manner by default. 

You can use the `descending` keyword to order in a descending manner. The attributes that are considered for `order by` operations are order-keys, which should be ordered types. 

In the example below, the `studentList` input iterator list is ordered according to the first name in descending order. You can define more than one order key in the `order by` clause and it is possible to have more than one `order` clause.   

```ballerina
Student[] orderedStudentList = from var student in studentList
                        order by student.fname descending
                        select student; 
```

#### 'Limit` clause 

The `limit` clause limits the number of frames/values emitted by a query pipeline. You should define an integer value to specify the number of output values.

The `outputPersonList` in the example below contains four values because the query expression limits the output values to four.

```ballerina
Person[] outputPersonList =
        from var person in personList
        limit 4
        select {
              firstName: person.firstName,
              lastName: person.lastName,
              age: person.age
        };
```

#### 'Select` clause 

The `select` clause is mandatory in query expressions that are used for projection. You can use this clause to create values required to generate iterators such as list, table, XML, string, and stream. 

**List as an output**

The `select` clause of the example below creates a record that allows generating a list as an output.

```ballerina
Report[] reportList = from var student in studentList
  where student.gpa >= 2.0
  select {
          name: student.firstName + " " + student.lastName,
          degree: student.degreeName,
          graduationYear: student.graduationYear
  };
```

**XML as an output**

The `select` clause in the example below is evaluated for each iteration. The emitted values are concatenated to form the XML result.

```ballerina
xml students = from var studentName in school/<student>/<firstName>
    limit 2
    select <xml> studentName; 
```

**Stream as an output**

The result of the query expression is a stream (`reportStream`), of which the members are the result of the `select` clause. 

The example below defines the `stream` keyword in the query to generate the output as a stream.

```ballerina
stream<Report> reportStream = stream from var student in studentList
  where student.gpa >= 2.0
  select {
          name: student.firstName + " " + student.lastName,
          degree: student.degreeName,
          graduationYear: student.graduationYear
  }; 
```

**String as an output**

The values emitted from the `select` clause are concatenated to get the string result of the query statement. 

In the example below, the `students` variable is the concatenated string of the query expression results.

```ballerina
string students = from var student in studentList
            where student.gpa >= 2.0
            select student.firstName + " " + student.lastName + "\n";
```

**Table as an output**

In the example below, the query expression starts with a `table` keyword. The `key(id)` key specifier specifies the key sequence of the constructed table. The result of the query expression is a table. During the construction of a table, each value emitted from the `select` clause is added as a new member.

```ballerina
ReportTable|error reportTable =
              table key(id) from var student in studentList
              where student.gpa >= 2.0
              let string degreeName = "Bachelor of Medicine",
              int graduationYear = calGraduationYear(student.intakeYear)
              select {
                  id: student.id,
                  name: student.firstName + " " + student.lastName,
                  degree: degreeName,
                  graduationYear: graduationYear
              };
```

#### 'On Conflict' clause

An `on conflict` clause is only allowed for a query expression, which constructs a table with a key sequence. The expression is evaluated when the `select` clause emits a value that conflicts with a previous value, in the sense that both values have the same key value in the table.

The `on conflict` clause of the example below gets executed when `select` emits a row that has the same key as a row that it emitted earlier. It gives an `onConflictError` error if there is a key conflict.

```ballerina
ReportTable|error result =
    table key(id) from var student in duplicateStdList
    select {
        id: student.id,
        name: student.firstName + " " + student.lastName,
        degree: "Bachelor of Medicine",
        graduationYear: calGraduationYear(student.intakeYear)
    }
    on conflict onConflictError;
```

## Query actions

Query actions are executed in the same way as the clauses in a query expression. However, it does not generate an output such as a list. Rather, it executes a set of defined statements. The block inside the `do` clause is executed in each iteration.

Below is an example of a query action.

```ballerina
var x = from var person in personList
        from var dept in deptList
        let string hrDepartment = "Human Resource"
        do {
            if(dept.name == "HR") {
                Employee employee = {firstName: person.firstName, lastName: person.lastName, deptAccess: hrDepartment};
                employeeList[employeeList.length()] = employee;
            }
        };
```

## Writing an integrated query

Follow the steps below to write an integrated query related to an online product order use case. The code snippets in each step denote how some operations are performed.

1. Create the HTTP service below from which you can request the product details. 

>**Info:** The payload is a JSON array that represents the product details.

```ballerina
import ballerina/http;
 
service /emart on new http:Listener(9090) {
 
   resource function post orderProduct(@http:Payload {} Product[] products) {
    …
   }
 
}
```

2. Manipulate the product details array (iterator) using query expressions to find the price of each product in the iterator. As per the query, you only consider the grocery products. In this process, there is a `join` with the table, which contains the product prices.

```ballerina
ProductAmount[] output = from var product in products
                              where product.Category == "Grocery"
                              join var priceInfo in priceInfoTable
                                  on product.Id equals priceInfo.Id 
                              order by product.Name ascending       
                              select {
                                  ShoppingCardId: product.ShoppingCardId,
                                  Name: product.Name,
                                  TotalAmount: <float>product.Quantity * priceInfo.Price
                              };
```

3. Use the integrated query below to calculate the total bill amount.

```ballerina
 error? result = from var productAmount in output
                    do {
                        totalBillAmount = totalBillAmount + productAmount.TotalAmount;                    
                    }; 
```

4. Send the total bill amount as a response to the HTTP request made.

```ballerina
http:Response res = new;
res.setPayload("Order is accepted, Total grocery bill amount is " + 
var result = caller->respond(res);
```

Below is the complete Ballerina code for writing the integrated query for the online product order use case above.

```ballerina
import ballerina/http;
import ballerina/io;
 
type Product record {
   string Name;
   int Id;
   int Quantity;
   string ShoppingCardId;
   string Category;
};
 
type PriceInfo record {
   int Id;
   float Price;
};
 
type ProductAmount record {
   string ShoppingCardId;
   string Name;
   float TotalAmount;
};
 
table<PriceInfo> priceInfoTable = loadPriceInfo();
 
service /emart on new http:Listener(9090) {
 
   resource function post orderProduct(@http:Payload {} Product[] products) returns string {
       ProductAmount[] output = from var product in products
                               where product.Category == "Grocery"
                               join var priceInfo in priceInfoTable
                                   on product.Id equals priceInfo.Id
                               order by product.Name ascending      
                               select {
                                   ShoppingCardId: product.ShoppingCardId,
                                   Name: product.Name,
                                   TotalAmount: <float>product.Quantity * priceInfo.Price
                               };
       float totalBillAmount = 0;
       error? result = from var productAmount in output
                   do {
                       totalBillAmount = totalBillAmount + productAmount.TotalAmount;                   
                   };
       io:println(output);
 
       return string `Order is accepted; total grocery bill amount is + ${totalBillAmount}`;
   }
}
 
function loadPriceInfo() returns table<PriceInfo> {
   table<PriceInfo> productDetails = table [{Id: 2345, Price: 120.00},
                                           {Id: 3256, Price: 23.00}];
   return productDetails;
}
```

## Trying it out

Follow the steps below to try out the above language integrated query example.

1. [Download and install](/learn/installing-ballerina/#installing-ballerina-via-installers) Ballerina.

2. Copy the Ballerina code above and create an `order_service.bal` file.

3. Execute the command below to start the HTTP service, which accepts product order requests.

```bash
bal run order_service.bal
```

4. Execute the command below to invoke the HTTP service by sending the product order details in the payload. 

```bash
curl -v http://localhost:9090/emart/orderProduct -d '[{ "Name": "Flour", "Id": 2345, "Quantity": 2, "ShoppingCardId": "AXYN34523", "Category": "Grocery"}, { "Name": "Carrot", "Id": 3234, "Quantity": 1, "ShoppingCardId": "AXYN34523", "Category": "Vegetable"}]' -H "Content-Type:application/json"
```

You will receive a response like below that gives the total grocery bill amount.

```bash
Order is accepted; total grocery bill amount is + 240.0
```












