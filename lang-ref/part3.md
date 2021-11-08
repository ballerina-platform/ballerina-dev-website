# Part 2b: Query, Tables, and XML

In this part, you will learn about some of the plain data supported by Ballerina that we have not covered in the last part, specifically, tables and XML types.<br><br>

## Query expressions

### SQL-like syntax for list comprehensions

Ballerina supports SQL-like query syntax for performing list comprehensions. This is similar to C# and Python’s way of list comprehension. In this case, the list is defined as an array.

The basic concept of list comprehension is based on the concept of mathematical “set builder” notation.

```
int[] nums = [1, 2, 3, 4];

int[] numsTimes10 = from var i in nums
                    select i * 10;

int[] evenNums = from var i in nums
                    where i % 2 == 0
                    select i;
```

In the above code example, **``nums``** is an integer array containing a list of numbers.

The array **``numTimes10``** is constructed by iterating over nums using the ``from`` clause,  where **``i``** is the iteration value, and then using the ``select`` clause to evaluate the expression *i \* 10* to  include the result in the array. Therefore the end result is a new list *[10,20,30,40]*.

Similarly, you can also apply SQL-like filters to the iterating expression using the ``where`` clause. The array **``evenNums``** is built in that way by introducing the ``where`` clause that filters the values for which the expression evaluates to true. The resultant list is *[2,4]*.<br><br>

### Destructuring records

The list comprehension concept can also be applied to structured types, such as records.

```
type Person record {
 string first;
 string last;
 int yearOfBirth;
};

Person[] persons = [ ]

var names = from var {first: f, last: l} in persons
                select {first: f, last: l};
```

In the above code example, **``persons``** is an array of records. The variable **``names``** is constructed from a binding pattern *{first: f, last: l}* that allows you to destructure records using a pattern. This results in variable **``f``** being bound to the first field of the record and **``l``** is bound to the last field.  

As usual, it iterates over the list of persons records using the ``from`` clause. At each iteration, the fields of the record are bound to the **``f``** and **``l``** variables, and then the ``select`` clause is used to construct a new array of records containing the fields **``first``** and **``last``**.

The binding pattern *{first: f, last: l}* can also be simplified as *{first, last}*.

```
var names = from var {first, last} in persons
                select {first, last};
```

In this way, a binding pattern *{ x }* can be substituted for *{ x : x }*.<br><br>

### Let clause

You can also have any number of ``let`` clauses within the query expression, between ``from`` and ``select``.

```
string[] names = from var {first, last} in persons
                 let int len1 = first.length()
                 where len1 > 0
                 let int len2 = last.length()
                 where len2 > 0
                 let string name = first + " " + last
                 select name;
```

In the above code example, multiple ``let`` and ``where`` clauses are used to construct an array of strings names containing names of all persons, by concatenating their first and last names. The record entries whose first or last names have a length of zero are selected out by using the first and second combination of ``let`` and ``where`` clauses. The overall query expression follows the semantics like XQUERY FLWOR (for, let, where, order by, and return).

You can think of the overall semantics like a pipeline, which starts off by generating a list of bindings in the first stage, and the subsequent stages take the bindings from the previous stage of the pipeline and outputs another set of variable bindings.<br><br>

### Ordering

You can also have an ordering of the query results using the ``order by`` clause.

```
type Employee record {
    string firstName;
    string lastName;
    decimal salary;
};

Employee[] employees = [
    // ...
];

 Employee[] sorted = 
    from var e in employees
    order by e.lastName ascending, e.firstName ascending
    select e;
```

In the above code example, an ``order by`` clause is added to the query, along with the keys that you want to sort by, and the order of sorting. In this case, the keys are the *lastName* and *firstName* fields of the **``Employee``** record, and the order is set to ascending. So this query takes a list of variable bindings, sorts them and generates a new array of records in the specified sorted order.

The ordering works consistently with the existing `<, <=, >, >=` operators that Ballerina already has. The ``order by`` clause also allows other expressions apart from field access. In case the ordering needs to be done for unicode strings, a library module can be used to specify the sort key such that ordering can be achieved in a locale specific way.

There are some complex cases where ordering cannot be achieved. This happens when the type of the order by expression does not support ordering. For Ballerina, any comparison with nil, floating point NaN are unordered. So if these unordered types are encountered in the query, they will be returned at the end.

A real-world example of an unordered scenario is the price of items on a shopping website. You see some items that have a price, and some items do not have a price due to some reason, or it indicates that the site will send a notification when the price is available. Now, if you want to list all the items based on an order starting from least expensive, then you want to see the items with the price first, instead of the items without the price. That's why applying the query on item's price with ascending order will return the unordered items, with a price value of nil, at the end. The same is applicable for ordering items in descending order when you want to see the most expensive items first.<br><br>

### ``limit`` clause

Ballerina also supports the ``limit`` clause within the query expression.

```
Employee[] top100 = 
    from var e in employees
    order by e.salary descending
    limit 100
    select e
```

In the above code example, the query pipeline has a ``limit`` clause which evaluates to an integer with value 100. The pipeline generates a list of **``Employee``** record entries in descending order, based on the *salary* field and the ``limit`` clause limits the generated result to the first 100 entries.<br><br>

## Table concept  

Ballerina supports yet another structured data type, table.

Ballerina's philosophy is to use tables as containers for building centralized data structures that are operated on by multiple functions. This concept augurs well with the various scripting languages, like Lisp, Python, or JavaScript, which are primarily used for integration purposes to glue two disparate systems together. This is the opposite of the philosophy followed in languages like Java, where programmers create separate classes and objects to separate the concerns within the code and write different containers for data structures. Ballerina encourages the use of its built-in data structures rather than everybody designing their own custom data structures.

Tables are a built-in data structure. They are just like the arrays and maps that you have seen so far. Therefore, they have some array-like and some map-like features.

A table is an array of records, and each record represents a row in the table. The rows are identified by keys, which is similar to maps. Thus, you can either iterate over the table, item by item, like arrays, or directly point to the item using the associated key. But unlike in maps where the keys are of string type and are different from the fields, a table stores the keys as fields in the rows. This approach is similar to the concept of primary keys in a SQL based database table where one of the columns is designated as a primary key, which is uniquely used to identify the database record.

Therefore, a table maintains an invariant that each row is uniquely identified by a key that is not limited to string type and is immutable. Additionally, tables also preserve the order of the rows.<br><br>

### Table syntax

The table syntax in Ballerina looks like this.

```
type Employee record {
    readonly string name;
    int salary;
};

table<Employee> key(name) t = table [
    { name: "John", salary: 100 },
    { name: "Jane", salary: 200 }
];
```

In the above code example, **``Employee``** is a record type that contains the two fields **``name``** and **``salary``**. **``name``** is marked as readonly, which prevents updates to the field after record creation.
  
Table **``t``** is defined with the ``table`` keyword. The definition also takes the type for the row, which is **``Employee``**, and the key field, which is **``name``**. It is declared with the ``key`` keyword.

The table constructor adds the two records. The table constructor is exactly like an array constructor, except that it uses the ``table`` keyword in front.

Once the table is constructed, you can look up the records using the key, just like you would do in a map.

```
Employee? e = t["Fred"];
```
 
You can use the ``foreach`` loop to iterate over all the rows in the table.

```
function increaseSalary(int n) {
    // Iterates over the rows of `t` in the specified order.
    foreach Employee e in t {
        e.salary += n;
    }
}
```

There is a direct and simple mapping from a table to JSON. Table to JSON conversion will result in an array of JSON objects where each member of the array corresponds to a member of the table.<br><br>

### Multiple key fields

You can have a table that has a multiple part key spread over several fields.

```
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

In the above code example, the **``Employee``** record has three fields: **``firstName``**, **``lastName``** and **``salary``**. The table **``t``** is defined with both the **``firstName``** and **``lastName``** as keys.

Subsequently, you can also look up the table using both keys.

```
Employee? e = t["Fred", "Bloggs"];
```

### Structured keys

The keys are not restricted to string type. You can also have keys belonging to any subtype of plain data, which also includes structured types.

```
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

In the above code example, the **``Employee``** record has a field **``name``**, which is also a record type having two fields, **``first``** and **``last``**. The table **``t``** uses name field as the key.

Accessing the rows in this table works in the same way.

```
Employee? e = t[{first: "Fred", last: "Bloggs"}];
```

With structured types, you have the ability to define rich keys, with different types, such as arrays of bytes, which makes it a binary key. This is a very powerful way of programming with tables, where you can directly work with the keys, instead of being constrained by faked up string representations of your keys.<br><br>

### Querying tables

Apart from looking up rows in a table, you can also combine them with queries.

```
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
  
In the above code example, **``salaries``** is an array constructed from a query that selects the salary of each **``Employee``** record within the table **``employees``**. The query returns the list of all salary figures, which are of integer types.

The actual type of the query output is determined by the context, for example integer array in this case, or the input type.<br><br>

### Creating tables with query

You can also use a query expression to create tables.

```
var highPaidEmployees = 
   table key(id) 
   from var e in employees
   where e.salary >= 1000
   select e;
```

In the above code example, a new table is produced from the query expression, which selects all the rows whose **``salary``** field is greater than or equal to 1000. A table is created as a result of the query expression explicitly specifying what to create by starting with the table keyword. The key of the created table can also be specified explicitly.<br><br>

### Join clause

Ballerina queries can also leverage the join clause on table keys.

```
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

The query uses the ``join`` clause to combine the list of **``logins``** and the **``users``** table to create a list of user-friendly login information. It uses the ``on`` condition to match the values of the fields **``userId``** and **``id``**, from **``Login``** and **``User``** records respectively. Finally, it builds out a string containing the fields **``name``** and **``time``** from these two records, separated by a colon symbol.

The ``join`` clause uses an internal hashtable, thereby improving the query  efficiency compared to O(n2) time complexity observed in nested ``from`` clauses.  The type to join on must be anydata.<br><br>

## Stream type

Ballerina supports the concept of stream. A stream is a sequence of values that are generated as needed. This concept is the opposite of a list that is pre-populated with values before you perform any operations on it.

A stream type is a separate basic type but acts as an object. A stream is defined with the stream keyword, as stream *<T,E>*, where members of the stream sequence are of type T and termination value is of type E. A shorter definition of *stream\<T>* can be used to mean *stream<T,( )>*, where the termination value is nil.

Generating the values for a stream can result in an error, in which case the stream is terminated with an error value.<br><br>

### Querying with streams

You can use the same query expressions with streams.

```
type LS stream<string, Error?>;

// strip blank lines.
function strip(LS lines) returns LS {
    return stream from var line in lines
             where line.trim().length() > 0
             select line;
 }
```

In the above code example, **``LS``** is a stream type that represents a line stream. This stream contains a sequence of string values and terminates with error or nil. The function **``strip()``** executes a query on a stream of type **``LS``** and returns the same type. The query operates over the stream, and for each member of the stream, the ``where`` clause filters out the strings whose length is zero, after stripping out the whitespaces.

The important thing to note here is that the query works the stream lazily. It does not read the whole stream and evaluate it at once when the strip function is called.

Using the stream keyword in front of ``from`` makes this query expression return a new stream with the same type. An error is returned if the iteration results in an error. However, if there is an error as a result of evaluation, then it will result in the returned stream being terminated with that error value. You can capture that error only while reading the returned stream.

You can also iterate over streams, like a loop operation, to perform some computation. However, you cannot use ``foreach`` with a stream that may terminate with an error since foreach cannot produce a value because it is a statement and error values cannot be ignored in Ballerina. You can achieve that with the do clause, in conjunction with the ``from`` clause.

```
function count(LS lines) returns int|Error {
    int nLines = 0;
    check from var line in lines
             do {
                  nLines += 1;
              };
    return nLines;
}
```

In the above code example, the function **``count()``** works on the stream of type **``LS``**. The query iterates over the stream, and the ``do`` clause performs an operation to increment the **``nLines``** to record the number of lines.

The use of the ``check`` keyword before the query handles the scenario where the stream’s termination value can be an error by capturing the error  locally within the function call and returning it.<br><br>

## Backtick templates

Ballerina supports the concepts of backticks. A backtick template is composed of a tag followed by a backtick string, enclosed within the ``‘ ` ’`` notation, where you can have expressions that are enclosed in *${ . . . }*.

```
string name = "James";
string s = string `Hello, ${name}`;
```
  
In the above code example, the value of **``s``** is evaluated as *“Hello, James”* from the backtick template. It has a string tag, and the expression *${name}* evaluates to the value of variable **``name``**, which is interpolated within the backtick string to return a string value.

The backtick template is evaluated in two phases. The first phase accumulates the contents of the template in a list of strings and a list of expressions. In the second phase, depending on the tag, the expression is evaluated and turned into the type of tag. In this case, it converts the result of the expression into a string, since the tag is a string.  

In case you want to add the backtick itself, within a backtick template, you can use the same *${ . . . }* syntax.

```
string s = string `Backtick:${"`"}`;
```

In the above code example, the string **``s``** will be assigned a value of *“Backtick:`’*.<br><br>

## Raw templates

Raw templates are backtick templates without the tag, in which case the phase two of the template evaluation only performs expression evaluation. A raw template returns an object containing an array of strings separated by insertions and an array of the results of expression evaluation.

One of the important use cases of raw templates is the preparation of the database query to pass parameters along with SQL statements.

```
db->query(`SELECT * FROM  order WHERE customer_id = ${customerId}’);
```

In the above example, assume that **``db``** is a client object making a remote call to a SQL database. The raw template passed to the query method translates to an array of two strings *“SELECT * FROM order WHERE customer_id =”* and “”. The second string is empty as it comes after the expression. Along with that, it also passes an array of expression evaluation which is the value of variable **``customerId``**. Thus, the SQL syntax is turned into the right syntax with the required substitution for the underlying SQL implementation.<br><br>

## XML overview

In Ballerina, XML is a separate basic type. It is based on the concept of sequence, and is derived from the concept of XQuery as well as XPath2. The model of XML used in Ballerina is based on XML Infoset, which follows the basic concept of XML elements and attributes, rather than the XML schema, as in the case of PSVI (Post-Schema Validation Infoset).

Ballerina uses the template concept to construct xml values. It is designed to work with the underlying concepts of elements and attributes, which also forms the basis for HTML also. Therefore Ballerina treats HTML as XML.

As part of XML handling, Ballerina provides a navigation syntax with an XPath-like syntax. The xml type also works well with query expressions to provide XQuery FLWOR like functionality.

Overall the XML design in Ballerina is opinionated, and it works more like the regular containers such as lists and tables. Also, Ballerina’s XML representation doesn't support an up pointer. Therefore, the XML elements do not have references to parents and siblings since they do not know where they are in the overall XML structure.<br><br>

### Sequences

A sequence is another categorization of types within Ballerina that we briefly mentioned earlier. It is a basic type. string and xml are the two sequence types in Ballerina.

A sequence is formed by having a value of basic type T and concatenating it with another sequence of values of type T. An empty sequence of basic type T or a singleton of basic type T is also considered a sequence.

Sequences are different from arrays in the sense that they are not nested, unlike arrays. In the same way, you do not have a string of strings, but just a linear sequence of characters. Also, there is no difference between a singleton x and a sequence consisting of just x. The basic type of sequence determines the basic type of members.

Similarly, the way an XML element is represented is by a sequence of that XML element.

The mutability of a sequence is similar to strings. Members of a sequence are also immutable, just like strings. For example, you cannot mutate a sequence of one item into a sequence of two items.

A sequence has no storage identity. Two sequences will match for === operator if their members match for the same operation.<br><br>

### XML data model

In Ballerina, an xml value is a sequence representing the parsed content of an XML item.

An xml value has four kinds of items. It can have an element, processing instruction or a comment item, all of which correspond 1:1 to XML infoset items. The fourth item is the text item that corresponds to a chunk of XML infoset defined character information items. An XML document is represented by an xml sequence with only one element, that includes one XML element, processing instructions, and comments, but no text.

An element item consists of three things, name of string type, attributes of type *map\<string>*, and children of type ``xml``. A text item has no identity, therefore the operator ``==`` has the same meaning as ``===``. Consecutive text items never occur in an xml value. Instead, they are always merged.

An element item is mutable whereas text items are immutable.<br><br>

### XML templates

XML templates are used to create xml values.

```
string url = "https://ballerina.io";

xml content = xml`<a href="${url}">Ballerina</a> is an <em>exciting</em> new language!`;

xml p = xml `<p>${content}</p>`;
```

The above code example defines two variables **``content``** and **``p``** of xml type using the backtick template containing the xml tag. In this case the phase two of the template processing does a parsing using the XML 1.0 recommendation’s grammar for content (what XML allows between a start-tag and end-tag). You can place the interpolated expressions of the template within XML content, or in attribute values, as string values.<br><br>

### XML operations

You can also perform different operations on values of xml type.

You can use the + operator to concatenate two xml values.

```
xml x1 = xml `<name>Sherlock Holmes</name>`;
Xml x2 = xml `<details>
                <author>Sir Arthur Conan Doyle</author>
                <language>English</language>
              </details>`;

xml x3 = x1 + x2;
```

The ``==`` operator does a deep equals comparison.

You can loop through the xml elements with foreach.

```
xml x4 = xml `<name>Sherlock Holmes</name><details>
                        <author>Sir Arthur Conan Doyle</author>
                        <language>English</language>
                  </details>`;

foreach var item in x4 {
    io:println(item);
}
```

In the above code example, the code iterates through the xml value in **``x4``** to  print the *\<name>* and *\<details>* elements.

You can also access the ith element using the `‘[ ]’` notation, and index into them.

```
print(x4[0]);
```

Similarly, you can use the `‘.’` notation to access the attribute.

```
xml x5 = xml `<para id="greeting">Hello</para>`;
string id = check x5.id;
```

If you want to check for optional attributes, use the `‘?’` notation before `‘.’` to return ( ) in case the attribute is not present.

```
string? name = check x5?.name;
```

Ballerina LangLib provides a *lang.xml* library module for performing operations on xml. For example, you can also mutate an element using **``setChildren( )``** as follows:

```
x2.setChildren(xml `<language>French</language>`);
```

### XML subtyping

Ballerina also supports inbuilt subtypes of the xml type. This is beneficial for performing operations on some xml values that represent an element rather than the entire xml sequence. Similarly, it does not make sense to set children for an XML text item since it does not have any children. So such checks can be taken care of with the type system by defining subtypes.

You can define a xml element value that belongs to a subtype *xml:Element* of ``xml``.  

```
xml:Element p = xml`<p>Hello</p>`;
```

In this case, *Element* is a subtype of ``xml`` and **``p``** comprises sequences of length one containing one element. Similarly, *xml:Comment* and *xml:ProcessingInstruction* subtypes are also available.

An xml value belongs to *xml:Text* type if it consists of a text item or is empty. You can create an xml:Text type from string, and if the string is empty then the xml:Text value is also empty.

```
function stringToXml(string s) returns xml:Text  {
        return xml:createText(s);
}
```

**``createText( )``** is part of the *lang.xml* and all functions defined in *lang.xml* work in a typesafe way across the subtypes of xml, without you having to cast all the time.

An xml value belongs to the type *xml<T>* if each of its members belong to *T*. Iterating over the *xml<T>*, gives you access to the items of type *T*.

```
function rename(xml x, string oldName, string newName) {
    foreach xml:Element e in x.elements() {
        if e.getName() == oldName {
            e.setName(newName);
        }
        rename(e.getChildren(), oldName, newName);
    }
}
```

In the above code example, the function **``rename( )``** performs the operation of setting a new name for some XML elements. It takes an argument **``x``** as xml type, and two strings **``oldName``** and **``newName``**.

In the function, the ``foreach`` loop iterates through the list of elements of **``x``**  which is returned by **``elements( )``** and belongs to type *xml<xml:Element>*. Therefore, you can call **``getName( )``** for each *xml:Element* and check for the old name. And if the name matches, **``setName( )``** is called to change the name. The function executes recursively for children of an *xml:Element*.<br><br>

### XML navigation syntactic sugar

Ballerina supports the use of navigational syntax to access items within the xml value. This is similar to the functionality of XPath.

To explain this navigational syntax, you can assume to have a xml value *x* which contains one or more elements *e*. Now there are several possibilities to navigate through *x*.  

To access every element in *x\** named *para* you can use *x.\<para>*. Use of the angle brackets *\<* and *\>* selects an element.

To access the children of *e*, for all the elements e in *x*, you can use *x/\**. Use of / take the navigation down one level in *x*.

To access every element para in the children of *e* in *x*, use *x/\<para>*.

For accessing any element th of *td* which is a children of *e* in *x*, use *x/\<th|td>*.

For accessing every element in the children of *e* in *x*, use *x/\<*>*.

For accessing every text item in the children of *e* in *x*, use *x/\*.text()*

For accessing every element named *para* in the descendants of *x*, use *x/\*\*/\<para>*. Here the use of * * signifies any number of levels within an xml element.

For accessing the first element named *para* in the children of *e* in *x*, use  *x/\<para>[0]*.Using the *[ ]* syntax you can point to the nth element.<br><br>

### Querying with XML

You can also use the regular query expression in Ballerina to query XML.

```
function paraByLang(xml x, string lang) returns xml {
     return from var para in x.<para>
            where para?.lang == lang
            select para;
}
```

In the above code example, you can use the query expression to iterate over the xml **``x``**, for all elements *\<para>*, and the variable para is bound to each *\<para>* element at every step in the iteration. It uses the ``where`` clause to check the lang attribute of the element to match it with the string argument **``lang``**. Finally, it selects all the *\<para>* elements that satisfies the ``where`` clause.

This query returns a new xml containing a sequence of *\<para>* elements.<br><br>

### Combining XML templates and queries

You can combine the concept of template with queries to build nested templates. With this feature, you build powerful templates having query expressions, with inner templates.

```
type Person record {|
    string name;
    string country;
|};

function personsToXml(Person[] persons) returns xml {
    return xml`<data>${from var {name, country} in persons
           select xml`<person                                        country="${country}">${name}</person>`}</data>`;
}
```

In the above code example, **``Person``** is a record containing the **``name``** and **``country``** fields. The function **``personsToXml()``** takes an argument **``persons``** as an array of **``Person``** records, and returns an xml sequence containing all the array elements.

To achieve this conversion, it builds a xml template having *\<data>* as the parent element. To populate the list of **``persons``**, the template is appended with the *${ }* placeholder containing a query expression.

The query expression binds to each **``name``** and **``country``** fields of **``Person``**, and returns another xml template containing the *\<person>* XML element. This inner template adds the country value as an attribute of *\<person>* and **``name``** as the text item, using the *${ }* notation.

At the end, an xml value containing a sequence of *\<data>* element with zero or more *\<person>* child elements is returned.

This is a very powerful feature unique to Ballerina. In this way, you can also build library functions that build HTML snippets as xml values for your application.<br><br>

### XML namespaces

Ballerina supports XML namespaces without adding another level of complexity in the existing xml type system. But this is optional and you can use XML without using the namespaces also.

When you see a XML element *x* prefixed with the namespace as *ns:x* , under the covers, Ballerina expands the prefix and the colon into a *{url}x* notation where *url* is the namespace name bound to *ns*.

```
xml:Element e = xml`<p:e xmlns:p="http://example.com/"/>`;
string name = e.getName();
```

In the above code example, the variable **``name``** is set to an expanded name if **``e``**, which is *{http://example.com}e*.<br><br>

### XMLNS seclarations

Overall, to make the XML work in Ballerina, you need XML namespace declarations in code. XML namespace declarations look like import declarations.

```
xmlns "http://example.com" as eg;
xml x = xml`<eg:doc>Hello</eg:doc>`;
```

In the above code example, the **``eg``** is bound as a prefix to the *namespace* url. You can use that prefix in the xml template and it will get expanded to the correct representation with the namespace.

The comparison and assignment of xml elements will implicitly check for and expand the namespace declarations in the correct way.

```
xmlns "http://example.com" as ex;

boolean b = (x === x.<ex:doc>);

string exdoc = ex:doc;
```

In the above code example, **``ex``** declares the same namespace declaration as **``eg``** previously. Therefore the boolean **``b``** will be true since the xml type **``x``** containing *\<eg:doc>* will be the same as *\<ex:doc>*. Similarly the string *exdoc* will be assigned a value of *{http://example.com}doc*, which includes the namespace declaration at the top. These declarations are also allowed at the block level.
