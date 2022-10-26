---
layout: ballerina-distinctive-language-features-left-nav-pages-swanlake
title: Data
description: In this part, you will learn about some of the plain data supported by Ballerina that we have not covered in the last part, specifically, tables and XML types.
keywords: ballerina, programming language, ballerina packages,language-guide
permalink: /learn/distinctive-language-features/data/
active: data
intro: In this part, you will learn about some of the plain data supported by Ballerina that we have not covered in the last part, specifically, tables and XML types.
redirect_from:
- /learn/distinctive-language-features/data
---

## Plain data

Let's now take a look at network data. This is the data that is independent of any specific code operating on the data. This data is typically exchanged through network interfaces between programs. In Ballerina, this is known as plain data.

This concept is the opposite of objects, which combine data and code as one entity. However, when you are writing network interfaces, you want to work with plain data. It supports a bunch of operations such as deep copy and deep equality checks. You can also serialize and deserialize it without worrying about coupling between the data and its associated code, like objects.

As a programming language designed for network programming over the cloud, Ballerina makes it easy to work with plain data, and it defines a different type for it.

## Ballerina basic types

If you categorize all the types of data supported by Ballerina, it is easier for you to know whether they are plain data.

Broadly, all Ballerina values belong to exactly one kind of basic type. These are simple types, sequences, structures, and behavioral types.

Simple types are nil, boolean, integers, floating points, and decimal. These are always plain data.

Sequence types are string and XML. These are also always plain data.

Structural types are array, map, record, tuple, and table. These are plain data only if their members are plain data.

And finally, the behavioral types include the `function`, `object`, `error`, `stream`, `typedesc`, and `handle` types. 
These are not plain data.

## ``decimal`` type

Ballerina supports one more numeric data type like integers and floating points, which is the ``decimal`` type. The ``decimal`` type also does not support implicit conversion.  

You can use the ``decimal`` keyword to declare a variable of the ``decimal`` type.

```ballerina
function floatSurprise() {
    float f = 100.10 - 0.01;
    // Will print 100.08999999999999
    io:println(f);
}

decimal nanos = 1d/1000000000d;
```

A decimal number represents a decimal fraction exactly. That means that the precisions are preserved, unlike ``float`` values. For example, a ``decimal`` value of 2.1 kg is not the same as 2.10 kg. 

You can use a literal character ``d`` to indicate a ``decimal`` value, and similarly ``f`` for a ``float`` value.

Decimal numbers are not the same as binary floating point numbers defined as per IEEE standard. They are not built into the ALU logic on the processor. Therefore, their computation is slower yet more accurate and precise.

In Ballerina, decimal numbers do not offer infinite precision. It is limited to 34 digits only, which is more than enough for representing large physical measurements, such as the universe's age, which takes 27 digits. Additionally, decimal numbers do not support infinity, NaN, or negative zero.

## Plain data basic types to come

Ballerina supports two more plain data types that have not been covered yet.

The first one is the ``table`` type. It is designed to work with arrays and maps. It contains an array of records. It provides random access based on a key, which is a concept similar to relational databases. The keys are stored in fields of records, and these fields are immutable.

The second one is the ``xml`` type. It is a sequence type built on a sequence of XML items like elements, text, processing instructions, and comments. It is a concept similar to strings and XQuery. XML attributes are represented by *``map<string>``*. XML literals can be written using the XML syntax.

## Immutability

One of the crucial features of plain data is that it can be made immutable. You cannot do that for objects. Plain data consisting of simple and string values are inherently immutable.

Structural values can be constructed either as mutable or immutable. The value includes a flag that indicates whether it's immutable or not, and it is fixed at the time of construction of the value. Attempting to mutate an immutable structure causes a panic at runtime.

Ballerina's notion of immutability is deep. This means that if you have an immutable structure, all its members have to be immutable. This also makes it safer to pass immutable values to other threads for concurrent access.

## ``anydata`` type

You can use the ``anydata`` keyword to define plain data.

```ballerina
anydata x1 = [1, "string", true];
```

The ``anydata`` type is a subtype of the ``any`` type. The ``==`` and ``!=``  operators available on ``anydata`` test for deep equality.

You can clone an ``anydata`` value using the **``clone()``** function.

```ballerina
anydata x2 = x1.clone();
```

This returns a new ``anydata`` value, with the same mutability as **``x1``**. There is another function **``cloneReadOnly()``** that returns an immutable deep copy. Both the functions do not copy the immutable parts of the ``anydata`` value. This ensures that the clone operations are safe for concurrency.  

``anydata`` also allows boolean comparison and can be used to define constants.

```ballerina
boolean eq = (x1 == x2);

const map<int> RED = {R: 0xFF, G: 0, B: 0};
```

The equality operation also takes care of cycles within ``anydata`` structure values.

## Configurable variables

Ballerina also has a concept of a configurable variable. A module-level variable can be declared as a configurable variable. This is useful when some application code is defined just to configure things. You can use the ``configurable`` keyword in this case.

```ballerina
configurable int port = 8080;
```

The initializer of a configurable variable can be overridden at runtime. A variable where runtime configuration is required can use ``?`` as the initializer.

```ballerina
configurable string password = ?;
```

A configurable variable must be a subtype of ``anydata``.

## Optional fields

Ballerina's type system is unique from other programming languages because it describes data both in program memory and on the wire. This is especially relevant for the cloud era, where more applications use APIs which provide network interfaces to a different system to send and receive data on the wire.  

Therefore, Ballerina's type system design is based on defining a data type interface that works consistently across the memory buffers of the process in which the data is processed and in the network.

To facilitate this requirement, the type system needs to do a few things differently than a regular type system. It must be flexible, like a schema language. And one of the ways it is done in Ballerina is by using optional fields.

You can define a record with an optional field.

```ballerina
type Headers record {
   string 'from;
   string to;

   // Records can have optional fields
   string subject?;
};
```

In the above type declaration, the **``Headers``** record type has three fields. The **``subject``** field is suffixed with ``?``, which tells the compiler that it is an optional field. Thus, you can define a variable of type **``Headers``** with or without the optional field.

```ballerina
Headers h = {
    'from: "John",
    to: "Jill"
};

string? subject = h?.subject;  
```

You can use ``?.`` to access the optional field. It will return nil if the field is not present.

This feature is handy for describing the type of data payloads transferred across network interfaces that typically contain mandatory and optional fields.

## Open records

Open records is another concept that is important for dealing with network interfaces. By default, a record type declared in Ballerina is open. This means that you can add more fields to it than those specified.

```ballerina
type Person record {
    string name;
};

type Employee record {
    string name;
    int id;
};

Employee e = {
    name: "James",
    id: 10
};

Person p = e;

Person p2 = {
    name: "John",
    "country": "UK"
};
```

In the above code example, the record types **``Person``** and **``Employee``** are declared. The **``Person``** type has a ``string`` field **``name``**, yet, **``p2``** is initialized with another field, **``country``**. This field can be of type ``anydata`` since it was not specified initially. It is required to specify the keys of the unspecified fields within quotes.

Similarly, the variable **``p``** of type **``Person``** also accepts the variable **``e``**, which is of the **``Employee``** type. In this case, the field **``id``** is treated as ``anydata`` within **``p``**.  In this way, Ballerina allows a record to be open such that additional unspecified fields can be added at runtime.

An open record is equivalent to a *``map<anydata>``*.

## Control openness

If you do not want to allow the open behavior in records, Ballerina has a special syntax.

```ballerina
type Coord record {|
    float x;
    float y;
|};

Coord x = {
    x: 1.0,
    y: 2.0
};

map<float> m1 = x;
```

In the above code example, using the ``{|`` and ``|}`` delimiters indicate that the record is closed. The record type **``Coord``** has only the two fields **``x``** and **``y``** of the ``float`` type. So you can also treat it as a map of float.  

You can also use a ``T...`` notation to allow other fields of a type ``T`` within a record.

```ballerina
type Headers record {|
    string 'from;
    string to;
    string...;
|};

Headers h = {
    'from: "Jane",
    to: "John",
    "cc": "James"
};

map<string> m2 = h;
```

If you have an open record, then additional fields of the ``anydata`` type can be added. But otherwise, use *``T…;``* to allow other fields of type ``T``. Therefore, *``map<T>``* is the same as *``record {| T...; |}``*.

## ``json`` type

Ballerina defines another type ``json``.

```ballerina
json j = {
    "x": 1,
    "y": 2
};
```

The ``json`` type is the union of ``( ) | boolean | int | float | decimal | string | json[ ] | map<json>`` .  

A ``json`` value can be converted to and from JSON format in a straightforward way, except for the numeric types in Ballerina, which are not natively available in the JSON specification.

```ballerina
string s = j.toJsonString();

json j2 = check value:fromJsonString(s);

json j3 = null;
```

Ballerina also allows the use of the ``null`` keyword instead of ``()`` for JSON compatibility. The lang libraries provide several functions such as **``toJson()``** and **``fromJson()``** to convert between ``anydata`` and ``json``.  Table values are converted to arrays, and XML values are converted to strings.

The ``json`` type is basically ``anydata`` but without ``table`` and ``xml``. ``json`` and ``xml`` types are not parallel.

## Work with JSON - two approaches

Ballerina allows two approaches to work with JSON data.

The first approach enables you to work with ``json`` values directly.  This is easy since valid JSON data is also legitimate Ballerina syntax.

Additionally, it is also possible to convert from JSON to application specific types as a second approach. For example, you can convert from JSON to a user-defined subtype of ``anydata``, process that data in an application specific subtype, and convert it back to JSON.

The second approach is something where Ballerina really shines compared to other languages because it is very hard to translate between JSON and the native types in other languages.

## Work with JSON directly

Working directly with JSON data is easy with the use of the ``json`` type.

```ballerina
json j = {
    x: {
        y: {
            z: "ballerina"
        }
    }
};

json v = check j.x.y.z;

string s = check v;
```

You can define any ``json`` structure like **``j``** and access its fields using  **``j.x``** or **``j?.x``**. The JSON field values are implicitly converted to unstructured types.  

Ballerina supports runtime type checking of the ``json`` structure to raise runtime errors using the ``check`` expression. This gives a feel of working with a dynamic language where the JSON structure is unknown at compile time. Additionally, lang library functions are also provided to check for types explicitly.

```ballerina
string s = check value:ensureType(v);
```

## ``match`` statements with maps

``json`` values can be used in a ``match`` statement to provide flexible pattern matching based on the fields in the ``json`` structure.

```ballerina
function foo(json j) returns error? {
    match j {
        {command: "add", amount: var x} => {
            decimal n = check x.ensureType(decimal);
            add(n);
        }
        _ => {
            return error("invalid command");
        }
    }
}
```

In the above code example, the ``match`` expression matches the json value **``j``**. The interesting thing is that the match pattern also binds to a variable **``x``** that is used within the code for additional processing. In this way, you can directly use ``json`` structures within the control flow of your program.

``match`` schematics are open, and you do not have to specify all the fields of the ``json`` value in the pattern for matching.

## Convert from user-defined types to JSON

A user-defined type can be easily converted to JSON. In this case, there are two possibilities.

For types that are closed, the conversion is implicit.

```ballerina
type ClosedCoord record {|
    float x;
    float y;
|};

ClosedCoord coord = {
    x: 1.0,
    y: 2.0
};

json j = coord;
```

In the case of open types, things are a bit complicated. For that purpose, lang libraries provide functions to make your work easier.

```ballerina
type Coord record {
    float x;
    float y;
};

Coord coord = {
    x: 1.0,
    y: 2.0
};

json j = coord.toJson();
```

In the above code example, **``Coord``** is an open record. Therefore, any number of ``anydata`` fields can be added to it, including tables and XML. The **``toJson()``** function converts ``anydata`` to ``json``, such that all the subtypes, including tables and XML, are handled appropriately.

## Convert from JSON to user-defined types

There are a few nuances involved in converting from JSON to a user-defined type.

An obvious mechanism is typecasting.

```ballerina
type Coord record {
    float x;
    float y;
};

json j = {
    x: 1.0,
    y: 2.0
};

// Runtime error.
Coord c = <Coord>j;
```

However, this does not work because the ``json`` fields can later be assigned to something other than ``float``. Therefore, the typecasting operation would not be type-safe. This goes back to the concept of covariance that limits mutation on type structures with inherent types. Therefore, you can only create a read-only copy, and use it in the type cast expression.

```ballerina
json rj = j.cloneReadOnly();
Coord c = <Coord>rj;
```

## Convert to a user-defined type - `cloneWithType`

There is another way of converting from JSON to a user-defined type.

```ballerina
type Coord record {
    float x;
    float y;
};

json j = {x: 1.0, y: 2.0};

Coord c = check j.cloneWithType(Coord);
```

In the above example, the **``cloneWithType()``** function uses the ``typedesc`` argument **``Coord``** as inherent type, and works recursively to clone every part of the value, including immutable structural values.

This is a ``lang.value`` lang library function. You can also use the function without the argument, in which case the argument will be inferred from the contextually-expected type.

```ballerina
Coord c = check j.cloneWithType();
```

## Resource method typing

The features of JSON to user-defined type conversion and vice versa are advantageous when you write service objects in Ballerina.

Here is code that defines a service for a calculator API with the ``add`` endpoint.

```ballerina
import ballerina/http;

type Args record {|
    decimal x;
    decimal y;
|};

listener http:Listener h = new (9090);

service /calc on h {
    resource function post add(@http:Payload Args args) returns decimal {
        return args.x + args.y;
    }
}
```

In the above code example, the **``Args``** record is a closed record. It is used as a parameter of the resource method corresponding to the HTTP POST operation whenever the API **``/calc/add``** is triggered.

Thanks to the implicit data binding and conversion feature of Ballerina, the JSON payload coming in the wire as part of the HTTP request is converted to the **``Args``** record, using the **``cloneWithType()``** function. Therefore, its fields **``x``** and **``y``** are readily accessible. The return type of the resource method is the ``decimal`` type which is a subtype of ``anydata`` and is mapped to the protocol format on the wire, which in most cases is JSON.  This is how Ballerina types can be used to describe data on the wire, or on network interfaces.

Annotations added to this code also help in refining the mapping between Ballerina-declared types and the wire format. Further, the service declaration can also be used to generate an OpenAPI specification.

## JSON numbers

There is one complication in dealing with JSON in Ballerina. This is because Ballerina allows the ``json`` type to have a union of ``int``, ``float``, and ``decimal``. Whereas the JSON specification has only one numeric type, it does not distinguish between integers and floating-point numbers.

While converting from Ballerina's numeric types to JSON, using the **``toJsonString()``** function converts Ballerina's ``int``, ``float``, and ``decimal`` values to the JSON numeric syntax. This is straightforward.

But converting from JSON to Ballerina's numeric types requires additional interpretation. The **``fromJsonString()``** function converts JSON numeric syntax into the ``int`` type, if possible, and ``decimal`` otherwise, to preserve the number precision of the numeric data in JSON. This is the case in which you do not have any information about types. Subsequently, you can use **``cloneWithType()``** or **``ensureType()``** to convert from integer or decimal to the user's chosen numeric type.  

The net result is the same, and you can convert between JSON and Ballerina's numeric types across the full range of all values. But the types will depend on how far you go in the conversion process within the program. The one exception to this conversion is ``-0``. It is an edge case and is represented as ``float``.

## Query expressions

### SQL-like syntax for list comprehensions

Ballerina supports SQL-like query syntax to perform list comprehensions. This is similar to C# and Python's way of list comprehension. In this case, the list is defined as an array.

The basic concept of list comprehension is based on the concept of mathematical "set builder" notation.

```ballerina
int[] nums = [1, 2, 3, 4];

int[] numsTimes10 = from var i in nums
    select i * 10;

int[] evenNums = from var i in nums
    where i % 2 == 0
    select i;
```

In the above code example, **``nums``** is an integer array containing a list of numbers.

The array **``numTimes10``** is constructed by iterating over **``nums``** using the ``from`` clause,  where **``i``** is the iteration value, and then using the ``select`` clause to evaluate the expression **``i \* 10``** to include the result in the array. Therefore, the result is a new list **``[10,20,30,40]``**.

Similarly, you can also apply SQL-like filters to the iteration value using the ``where`` clause. The array **``evenNums``** is built in that way by introducing the ``where`` clause that filters the values for which the expression evaluates to ``true``. The resultant list is **``[2,4]``**.

### Destructure records

The list comprehension concept can also be applied to structured types, such as records.

```ballerina
type Person record {
    string first;
    string last;
    int yearOfBirth;
};

Person[] persons = [];

var names = from var {first: f, last: l} in persons
    select {first: f, last: l};
```

In the above code example, **``persons``** is an array of records. The variable **``names``** is constructed from a binding pattern **``{first: f, last: l}``** that allows you to destructure records using a pattern. This results in variable **``f``** being bound to the ``first`` field of the record and **``l``** being bound to the ``last`` field.  

As usual, the query expression iterates over the **``persons``** list using the ``from`` clause. At each iteration, the fields of the record are bound to the **``f``** and **``l``** variables, and then the ``select`` clause is used to construct a new array of records containing only the fields **``first``** and **``last``**.

The binding pattern **``{first: f, last: l}``** can also be simplified as **``{first, last}``**.

```ballerina
var names = from var {first, last} in persons
    select {first, last};
```

In this way, a binding pattern **``{x}``** can be substituted for **``{x : x}``**.

### Let clause

You can also have any number of ``let`` clauses within the query expression, between ``from`` and ``select``.

```ballerina
string[] names = from var {first, last} in persons
    let int len1 = first.length()
    where len1 > 0
    let int len2 = last.length()
    where len2 > 0
    let string name = first + " " + last
    select name;
```

In the above code example, multiple ``let`` and ``where`` clauses are used to construct an array of strings **``names``** containing names of all persons, by concatenating their first and last names. The record entries whose first or last names have a length of zero are filtered out by using the first and second combination of ``let`` and ``where`` clauses. The overall query expression follows semantics like XQUERY FLWOR (for, let, where, order by, and return).

You can think of the overall semantics like a pipeline, which starts off by generating a list of bindings in the first stage, and the subsequent stages take the bindings from the previous stage of the pipeline and output another set of variable bindings.

### Ordering

You can also have an ordering of the query results using the ``order by`` clause.

```ballerina
type Employee record {
    string firstName;
    string lastName;
    decimal salary;
};

Employee[] employees = [
    // ...
];

Employee[] sorted = from var e in employees
    order by e.lastName ascending, e.firstName ascending
    select e;
```

In the above code example, an ``order by`` clause is added to the query, along with the keys that you want to sort by, and the order of sorting. In this case, the keys are the ``lastName`` and ``firstName`` fields of the **``Employee``** record, and the order is set to ``ascending``. So this query takes a list of variable bindings, sorts them, and generates a new array of records in the specified sorted order.

The ordering works consistently with the ``<``, ``<=``, ``>``, and ``>=`` operators. The ``order by`` clause also allows other expressions apart from field access. In case the ordering needs to be done for Unicode strings, a library module can be used to specify the sort key such that ordering can be achieved in a locale-specific way.

There are some complex cases where ordering cannot be achieved. This happens when the type of the ``order by`` expression does not support ordering. For Ballerina, any comparison with nil or floating point ``NaN`` are unordered. So if these unordered types are encountered in the query, they will be returned at the end.

A real-world example of an unordered scenario is the price of items on a shopping website. You see some items that have a price, and some items do not have a price due to some reason, or it indicates that the site will send a notification when the price is available. Now, if you want to list all the items based on an order starting from least expensive, then you want to see the items with the price first, instead of the items without the price. That's why applying the query on item's price with ascending order will return the unordered items, with a price value of nil, at the end. The same is applicable for ordering items in descending order when you want to see the most expensive items first.

### ``limit`` clause

Ballerina also supports the ``limit`` clause within query expressions.

```ballerina
Employee[] top100 = from var e in employees
    order by e.salary descending
    limit 100
    select e;
```

In the above code example, the query pipeline has a ``limit`` clause which evaluates to an integer value of 100. The pipeline generates a list of **``Employee``** record entries in descending order, based on the ``salary`` field and the ``limit`` clause limits the generated result to the first 100 entries.

## Table concept  

Ballerina supports yet another structured data type, table.

Ballerina's philosophy is to use tables as containers for building centralized data structures that are operated on by multiple functions. This concept augurs well with the various scripting languages, like Lisp, Python, or JavaScript, which are primarily used for integration purposes to glue two disparate systems together. This is the opposite of the philosophy followed in languages like Java, where programmers create separate classes and objects to separate the concerns within the code and write different containers for data structures. Ballerina encourages the use of its built-in data structures rather than everybody designing their own custom data structures.

Tables are a built-in data structure. They are just like the arrays and maps that you have seen so far. Therefore, they have some array-like and some map-like features.

A table is an array of records, and each record represents a row in the table. The rows are identified by keys, which is similar to maps. Thus, you can either iterate over the table, item by item, like arrays, or directly point to the item using the associated key. But unlike in maps where the keys are of ``string`` type and are different from the fields, a table stores the keys as fields in the rows. This approach is similar to the concept of primary keys in a SQL-based database table where one of the columns is designated as a primary key, which is used to uniquely identify the database record.

Therefore, a table maintains an invariant that each row is uniquely identified by a key that is not limited to the ``string`` type and is immutable. Additionally, tables also preserve the order of the rows.

### Table syntax

The table syntax in Ballerina looks like this.

```ballerina
type Employee record {
    readonly string name;
    int salary;
};

table<Employee> key(name) t = table [
    {name: "John", salary: 100},
    {name: "Jane", salary: 200}
];
```

In the above code example, **``Employee``** is a record type that contains the two fields **``name``** and **``salary``**. The **``name``** field is marked as ``readonly``, which prevents updates to the field after record creation.
  
Table **``t``** is defined with the ``table`` keyword. The definition also takes the type for the row, which is **``Employee``**, and the key field, which is **``name``**. It is declared with the ``key`` keyword.

The table constructor adds two records. The table constructor is exactly like an array constructor, except that it uses the ``table`` keyword in front.

Once the table is constructed, you can look up the records using the key, just like you would do with a map.

```ballerina
Employee? e = t["Fred"];
```
 
You can use the ``foreach`` loop to iterate over all the rows in the table.

```ballerina
function increaseSalary(int n) {
    // Iterates over the rows of `t` in the specified order.
    foreach Employee e in t {
        e.salary += n;
    }
}
```

There is a direct and simple mapping from a table to JSON. Table to JSON conversion will result in an array of JSON objects where each member of the array corresponds to a member of the table.

### Multiple key fields

You can have a table with a multipart key spread over several fields.

```ballerina
type Employee record {
    readonly string firstName;
    readonly string lastName;
    int salary;
};

table<Employee> key(firstName, lastName) t = table [
    {firstName: "John", lastName: "Smith", salary: 100},
    {firstName: "Fred", lastName: "Bloggs", salary: 200}
];
```

In the above code example, the **``Employee``** record has three fields: **``firstName``**, **``lastName``**, and **``salary``**. The table **``t``** is defined with both the **``firstName``** and **``lastName``** fields as keys.

Subsequently, you can also look up the table using both keys.

```ballerina
Employee? e = t["Fred", "Bloggs"];
```

### Structured keys

The keys are not restricted to the ``string`` type. You can also have keys belonging to any subtype of plain data, which also includes structured types.

```ballerina
type Employee record {
    readonly record {
        string first;
        string last;
    } name;
    int salary;
};

table<Employee> key(name) t = table [
    {name: {first: "John", last: "Smith"}, salary: 100},
    {name: {first: "Fred", last: "Bloggs"}, salary: 200}
];
```

In the above code example, the **``Employee``** record has a **``name``** field, which is also a record type having two fields, **``first``** and **``last``**. The table **``t``** uses the **``name``** field as the key.

Accessing the rows in this table works in the same way.

```ballerina
Employee? e = t[{first: "Fred", last: "Bloggs"}];
```

With structured types, you can define rich keys with different types such as arrays of bytes, which makes it a binary key. This is a very powerful way of programming with tables, where you can directly work with the keys, instead of being constrained by faked up string representations of your keys.

### Query tables

Apart from looking up rows in a table, you can also combine them with queries.

```ballerina
type Employee record {|
    readonly int id;
    string firstName;
    string lastName;
    int salary;
|};

table<Employee> key(id) employees = table [
    {id: 1, firstName: "John", lastName: "Smith", salary: 100},
    {id: 2, firstName: "Fred", lastName: "Bloggs", salary: 200}
];

int[] salaries = from var {salary} in employees
                    select salary;
```
  
In the above code example, **``salaries``** is an array constructed from a query that selects the salary of each **``Employee``** record within the table **``employees``**. The query returns the list of all salary figures, which are of the integer type.

The actual type of the query output is determined by the context, for example, integer array in this case, or the input type.

### Create tables with query

You can also use a query expression to create tables.

```ballerina
var highPaidEmployees = 
   table key(id) 
   from var e in employees
   where e.salary >= 1000
   select e;
```

In the above code example, a new table is produced from the query expression, which selects all the rows whose **``salary``** field is greater than or equal to 1000. A table is created as a result of the query expression explicitly specifying what to create by starting with the ``table`` keyword. The key of the created table can also be specified explicitly.

### Join clause

Ballerina queries can also leverage the join clause on table keys.

```ballerina
type User record {|
    readonly int id;
    string name;
|};

type Login record {|
    int userId;
    string time;
|};

table<User> key(id) users = table [
    {id: 1234, name: "Keith"},
    {id: 6789, name: "Anne"}
];

Login[] logins = [
    {userId: 6789, time: "20:10:23"},
    {userId: 1234, time: "10:30:02"},
    {userId: 3987, time: "12:05:00"}
];

string[] loginLog = from var login in logins
                        join var user in users
                        on login.userId equals user.id
                        select user.name + ":" + login.time;
```

In the above code example, there is a table **``users``** of **``User``** records and an array **``logins``** of **``Login``** records.

The query uses the ``join`` clause to combine the list of **``logins``** and the **``users``** table to create a list of user-friendly login information. It uses the ``on`` condition to match the values of the fields **``userId``** and **``id``**, from the **``Login``** and **``User``** records respectively. Finally, it builds out a string containing the fields **``name``** and **``time``** from these two records, separated by a colon symbol.

The ``join`` clause uses an internal hashtable, thereby improving the query efficiency compared to O(n2) time complexity observed in nested ``from`` clauses.  The type to join on must be ``anydata``.

## Stream type

Ballerina supports the concept of a stream. A stream is a sequence of values that are generated as needed. This concept is the opposite of a list that is pre-populated with values before you perform any operations on it.

The ``stream`` type is a separate basic type but acts as an object. A stream is defined with the ``stream`` keyword, as **``stream<T, E>``**, where members of the stream sequence are of type ``T`` and the termination value is of type ``E``. A shorter definition of **``stream<T>``** can be used to mean **``stream<T,()>``**, where the termination value is nil.

Generating the values for a stream can result in an error, in which case the stream is terminated with an error value.

### Query with streams

You can use query expressions with streams.

```ballerina
type LS stream<string, error?>;

// Strip blank lines.
function strip(LS lines) returns LS {
    return stream from var line in lines
        where line.trim().length() > 0
        select line;
}
```

In the above code example, **``LS``** is a ``stream`` type that represents a line stream. This stream contains a sequence of ``string`` values and terminates with an ``error`` value or nil. The function **``strip()``** executes a query on a stream of type **``LS``** and returns the same type. The query expression operates over the stream, and for each member of the stream, the ``where`` clause filters out the strings whose length is zero after stripping out the whitespaces.

The important thing to note here is that the query works the stream lazily. It does not read the whole stream and evaluate it at once when the strip function is called.

Using the stream keyword in front of ``from`` makes this query expression return a new ``stream`` value of the same type. An error is returned if the iteration results in an error. However, if there is an error as a result of evaluation, then it will result in the returned stream being terminated with that error value. You can capture that error only while reading the returned stream.

You can also iterate over streams, like a loop operation, to perform some computation. However, you cannot use ``foreach`` with a stream that may terminate with an error since the ``foreach`` statement cannot produce a value because it is a statement, and error values cannot be ignored in Ballerina. You can achieve that with the ``do`` clause, in conjunction with the ``from`` clause.

```ballerina
function count(LS lines) returns int|error {
    int nLines = 0;
    check from var line in lines
        do {
            nLines += 1;
        };
    return nLines;
}
```

In the above code example, the function **``count()``** works on the stream of type **``LS``**. The query iterates over the stream and the ``do`` clause performs an operation to increment the **``nLines``** variable to record the number of lines.

The use of the ``check`` keyword before the query handles the scenario where the stream’s termination value can be an error by capturing the error locally within the function call and returning it.

## Backtick templates

Ballerina supports the concepts of backtick templates. A backtick template is composed of a tag followed by a backtick string, enclosed within the `` ` `` notation, where you can have expressions that are enclosed in **``${...}``**.

```ballerina
string name = "James";
string s = string `Hello, ${name}`;
```
  
In the above code example, the value of **``s``** is evaluated as ``"Hello, James"`` from the backtick template. It has a ``string`` tag, and the expression **``${name}``** evaluates to the value held by the variable **``name``**, which is interpolated within the backtick string to return a string value.

The backtick template is evaluated in two phases. The first phase accumulates the contents of the template in a list of strings and a list of expressions. In the second phase, depending on the tag, the expression is evaluated and turned into the type of tag. In this case, it converts the result of the expression into a string, since the tag is ``string``.  

In case you want to add the backtick itself, within a backtick template, you can use the same **``${...}``** syntax.

```ballerina
string s = string `Backtick:${"`"}`;
```

In the above code example, the string **``s``** will be assigned a value of ``"Backtick:`"``.

## Raw templates

Raw templates are backtick templates without the tag, in which case phase two of the template evaluation only performs expression evaluation. A raw template returns an object containing an array of strings separated by insertions and an array of the results of expression evaluation.

One of the important use cases of raw templates is parameterized SQL queries.

```ballerina
db->query(`SELECT * FROM  order WHERE customer_id = ${customerId}`);
```

In the above example, assume that **``db``** is a client object making a remote call to a SQL database. The raw template passed to the query method translates to an array of two strings ``"SELECT * FROM order WHERE customer_id ="`` and ``""``. The second string is empty as it comes after the expression. Along with that, it also passes an array of evaluated expressions which is the value of the **``customerId``** variable here. Thus, the SQL syntax is turned into the right syntax with the required substitution for the underlying SQL implementation.

## XML overview

In Ballerina, XML is a separate basic type. It is based on the concept of sequence and is derived from the concept of XQuery as well as XPath2. The model of XML used in Ballerina is based on XML Infoset, which follows the basic concept of XML elements and attributes, rather than the XML schema, as in the case of PSVI (Post-Schema Validation Infoset).

Ballerina uses the template concept to construct ``xml`` values. It is designed to work with the underlying concepts of elements and attributes, which also forms the basis for HTML. Therefore, Ballerina treats HTML as XML.

As part of XML handling, Ballerina provides an XPath-like navigation syntax. The ``xml`` type also works well with query expressions to provide XQuery FLWOR-like functionality.

Overall the XML design in Ballerina is opinionated, and it works more like the regular containers such as lists and tables. Also, Ballerina's XML representation doesn't support an up pointer. Therefore, the XML elements do not have references to parents and siblings since they do not know where they are in the overall XML structure.

### Sequences

A sequence is another categorization of types within Ballerina that we briefly mentioned earlier. It is a basic type. The ``string`` and ``xml`` types are the two sequence types in Ballerina.

A sequence is formed by having a value of basic type ``T`` and concatenating it with another sequence of values of type ``T``. An empty sequence of basic type ``T`` or a singleton of basic type ``T`` is also considered a sequence.

Sequences are different from arrays in the sense that they are not nested. In the same way, you do not have a string of strings, but just a linear sequence of characters. Also, there is no difference between a singleton ``x`` and a sequence consisting of just ``x``. The basic type of a sequence determines the basic type of its members.

Similarly, the way an XML element is represented is by a sequence of that XML element.

The mutability of a sequence is similar to strings. Members of a sequence are also immutable, just like strings. For example, you cannot mutate a sequence of one item into a sequence of two items.

A sequence has no storage identity. Two sequences will match for the ``===`` operator if their members match for the same operation.

### XML data model

In Ballerina, an ``xml`` value is a sequence representing the parsed content of an XML item.

An ``xml`` value has four kinds of items. It can have an element, processing instruction, or a comment item, all of which correspond 1:1 with the XML infoset items. The fourth item is the text item that corresponds to a chunk of XML infoset defined character information items. An XML document is represented by an XML sequence with only one element and no text.

An element item consists of three things, name of type ``string``, attributes of type ``map<string>``, and children of type ``xml``. A text item has no identity, therefore the ``==`` operator has the same meaning as ``===``. Consecutive text items never occur in an ``xml`` value. Instead, they are always merged.

An element item is mutable whereas text items are immutable.

### XML templates

XML templates are used to create ``xml`` values.

```ballerina
string url = "https://ballerina.io";

xml content = xml`<a href="${url}">Ballerina</a> is an <em>exciting</em> new language!`;

xml p = xml `<p>${content}</p>`;
```

The above code example defines two variables **``content``** and **``p``** of the ``xml`` type using backtick templates containing the ``xml`` tag. In this case, phase two of the template processing does a parsing using the XML 1.0 recommendation's grammar for content (what XML allows between a start-tag and end-tag). You can place the interpolated expressions of the template within XML content, or in attribute values as ``string`` values.

### XML operations

You can also perform different operations on values of the ``xml`` type.

You can use the ``+`` operator to concatenate two ``xml`` values.

```ballerina
xml x1 = xml `<name>Sherlock Holmes</name>`;
xml x2 = xml `<details>
                <author>Sir Arthur Conan Doyle</author>
                <language>English</language>
              </details>`;

xml x3 = x1 + x2;
```

The ``==`` operator does a deep equals comparison.

You can loop through the ``xml`` elements in a ``foreach`` statement.

```ballerina
xml x4 = xml `<name>Sherlock Holmes</name><details>
                    <author>Sir Arthur Conan Doyle</author>
                    <language>English</language>
                </details>`;

foreach var item in x4 {
    io:println(item);
}
```

In the above code example, the code iterates through the ``xml`` value in **``x4``** to print the *\<name>* and *\<details>* elements.

You can also access the ``i``th element using the ``x[i]`` notation, and index into them.

```ballerina
io:println(x4[0]);
```

Similarly, you can use the ``.`` notation to access attributes.

```ballerina
xml x5 = xml `<para id="greeting">Hello</para>`;
string id = check x5.id;
```

If you want to check for optional attributes, use the ``?`` notation before ``.`` to get ``()`` in case the attribute is not present.

```ballerina
string? name = check x5?.name;
```

The **``lang.xml``** lang library provides operations on ``xml`` values. For example, you can also mutate an element using the **``setChildren( )``** function as follows:

```ballerina
x2.setChildren(xml `<language>French</language>`);
```

### XML subtyping

Ballerina also supports built-in subtypes of the ``xml`` type. This is beneficial for performing operations on some ``xml`` values that represent an element rather than the entire XML sequence. Similarly, it does not make sense to set children on an XML text item since it does not have any children. So such checks can be taken care of by the type system by defining subtypes.

You can define an XML element value that belongs to the **``xml:Element``** subtype of ``xml``.  

```ballerina
xml:Element p = xml`<p>Hello</p>`;
```

In this case, ``xml:Element`` is a subtype of ``xml`` and **``p``** comprises sequences of length one containing one element. Similarly, ``xml:Comment`` and ``xml:ProcessingInstruction`` subtypes are also available.

An ``xml`` value belongs to the ``xml:Text`` type if it consists of a text item or is empty. You can create a value of the  ``xml:Text`` type from a ``string`` value, and if the string is empty, then the ``xml:Text`` value is also empty.

```ballerina
function stringToXml(string s) returns xml:Text  {
    return xml:createText(s);
}
```

The **``createText()``** function is part of the **``lang.xml``** lang library and all functions defined in it work in a typesafe way across the subtypes of ``xml``, without you having to cast all the time.

An ``xml`` value belongs to the type **``xml<T>``** if each of its members belongs to **``T``**. Iterating over an **``xml<T>``** value gives you access to the items of type **``T``**.

```ballerina
function rename(xml x, string oldName, string newName) {
    foreach xml:Element e in x.elements() {
        if e.getName() == oldName {
            e.setName(newName);
        }
        rename(e.getChildren(), oldName, newName);
    }
}
```

In the above code example, the **``rename()``** function sets a new name for some XML elements. It takes an argument **``x``** of the ``xml`` type, and two strings **``oldName``** and **``newName``**.

In the function, the ``foreach`` loop iterates through the list of elements of **``x``**  which is returned by the **``elements()``** lang library function and belongs to type **``xml<xml:Element>``**. Therefore, you can call the **``getName()``** function for each ``xml:Element`` value and check for the old name. And if the name matches, the **``setName()``** function is called to change the name. The function executes recursively for children of an ``xml:Element``.

### XML navigation syntactic sugar

Ballerina supports the use of navigational syntax to access items within an ``xml`` value. This is similar to the functionality of XPath.

To explain this navigational syntax, you can assume to have an ``xml`` value **``x``** which contains one or more elements **``e``**. Now there are several possibilities to navigate through ``x``.  

To access every element in ``x`` named ``para`` you can use **``x.<para>``**. Use of the angle brackets ``<`` and ``>`` selects an element.

To access the children of ``e``, for every element ``e`` in ``x``, you can use **``x/*``**. Use of ``/`` takes the navigation down one level in ``x``.

To access every element named ``para`` in the children of ``e``, for every element ``e`` in ``x``, use **``x/<para>``**.

To access every element named ``th`` or ``td`` in the children of ``e``, for every element ``e`` in ``x``, use **``x/<th|td>``**.

To access every element in the children of ``e``, for every element ``e`` in ``x``, use **``x/<*>``**.

To access every text item in the children of ``e``, for every element ``e`` in ``x``, use **`x/*.text()`**.

To access every element named ``para`` in the descendants of ``e``, for every element ``e`` in ``x``, use **``x/**/<para>``**. Here the use of ``**`` signifies any number of levels within an XML element.

To access the first element named ``para`` in the children of ``e``, for every element ``e`` in ``x``, use  **``x/<para>[0]``**. You can point to the nth element using the ``[]`` syntax.

### Query with XML

You can also use query expressions to query XML.

```ballerina
function paraByLang(xml x, string lang) returns xml {
    return from var para in x.<para>
            where para?.lang == lang
            select para;
}
```

In the above code example, you can use the query expression to iterate over all elements ``<para>`` in ``x``, and the variable ``para`` is bound to each ``<para>`` element at every step in the iteration. It uses the ``where`` clause to check the ``lang`` attribute of the element to match it with the ``string`` parameter **``lang``**. Finally, it selects all the ``<para>`` elements that satisfy the ``where`` clause.

This query returns a new ``xml`` value containing a sequence of ``<para>`` elements.

### Combine XML templates and queries

You can combine the concept of templates with queries to build nested templates. With this feature, you can build powerful templates having query expressions, with inner templates.

```ballerina
type Person record {|
    string name;
    string country;
|};

function personsToXml(Person[] persons) returns xml {
    return xml `<data>${from var {name, country} in persons
           select xml`<person country="${country}">${name}</person>`}</data>`;
}
```

In the above code example, the **``Person``** type is a record type containing the **``name``** and **``country``** fields. The **``personsToXml()``** function takes an array of **``Person``** records as the **``persons``** parameter, and returns an ``xml`` sequence containing all the array elements.

To achieve this conversion, it builds a ``xml`` template having ``<data>`` as the parent element. To populate the list of **``persons``**, the template includes a ``${...}`` interpolation containing a query expression.

The query expression binds to each **``name``** and **``country``** field of the **``Person``** value and returns another ``xml`` template containing the ``<person>`` XML element. This inner template adds the country value as an attribute of ``<person>`` and **``name``** as the text item, using interpolations.

At the end, an ``xml`` value containing a sequence of the ``<data>`` element with zero or more ``<person>`` child elements is returned.

This is a very powerful feature unique to Ballerina. In this way, you can also build library functions that build HTML snippets as ``xml`` values for your application.

### XML namespaces

Ballerina supports XML namespaces without adding another level of complexity to the existing ``xml`` type system. But this is optional, and you can use XML without using namespaces also.

When you see an XML element ``x`` prefixed with a namespace as **``ns:x``**, under the covers, Ballerina expands the prefix and the colon into a **``{url}x``** notation where ``url`` is the namespace name bound to ``ns``.

```ballerina
xml:Element e = xml`<p:e xmlns:p="http://example.com/"/>`;
string name = e.getName();
```

In the above code example, an expanded name of **``e``**, which is ``{http://example.com}e ``is set to the variable **``name``**.

### XMLNS declarations

Overall, to make the XML work in Ballerina, you need XML namespace declarations in code. XML namespace declarations look like import declarations.

```ballerina
xmlns "http://example.com" as eg;
xml x = xml`<eg:doc>Hello</eg:doc>`;
```

In the above code example, the **``eg``** is bound as a prefix to a namespace URL. You can use that prefix in the ``xml`` template, and it will get expanded to the correct representation with the namespace.

The comparison and assignment of ``xml`` elements will implicitly check for and expand the namespace declarations in the correct way.

```ballerina
xmlns "http://example.com" as ex;

// Will be true.
boolean b = (x === x.<ex:doc>);

// Will be "{http://example.com}doc".
string exdoc = ex:doc;
```

In the above code example, **``ex``** declares the same namespace declaration as **``eg``** previously. Therefore, the boolean **``b``** will be true since the **``x``** variable containing ``<eg:doc>`` will be the same as ``<ex:doc>``. Similarly, the ``exdoc`` string variable will be assigned a value of ``{http://example.com}doc``, which includes the namespace declaration at the top. These declarations are also allowed at the block level.
