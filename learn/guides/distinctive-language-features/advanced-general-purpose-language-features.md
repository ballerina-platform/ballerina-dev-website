---
layout: ballerina-distinctive-language-features-left-nav-pages-swanlake
title: Advanced, General-Purpose Language Features
description: Let’s now look at the other features of the Ballerina language. These are a mixed bag of additional options to the language, making everything fit together to build a Ballerina application.
keywords: ballerina, programming language, ballerina packages,language-guide
permalink: /learn/distinctive-language-features/advanced-general-purpose-language-features/
active: advanced-general-purpose-language-features
intro: Let’s now look at the other features of the Ballerina language. These are a mixed bag of additional options to the language, making everything fit together to build a Ballerina application.
redirect_from:
- /learn/distinctive-language-features/advanced-general-purpose-language-features
---

## Default Values for Function Parameters

Ballerina allows the setting of default values for function parameters. You can use literal values or even expressions as default values to parameters. Additionally, the default value expressions can use the values of preceding parameters.

```ballerina
function substring(
    string str, 
    int start = 0,
    int end = str.length()
) returns int | ( ) {
  //….
}
```

The way it works is, the type descriptor contains closures for every defaultable parameter, which has the values for previous parameters as parameters for those closures. Using those closures, the compiler generates code to fill missing values at the call site for this function. This is not part of the function type and is not applicable when functions are passed around as a first class value.

## Providing Function Arguments by Name

In addition to default values for parameters, it is also useful to call functions with argument names. Ballerina allows you to call functions where arguments can be supplied by name.

If you define a function as *foo(int x, int y, int z) { . .  }* , then you can call it using any of the following syntax:

- `*foo(1,2,3)*`
- `*foo(x = 1, y = 2, z = 3)*`
- `*foo(z = 3, y = 2, x = 1)*`
- `*foo(1, z = 3, y = 2)*`

The first option calls the function in the usual way without using the names for arguments. The second and third options use named arguments that transformed into positional arguments by the Ballerina compiler. Arguments list of the function are described by a tuple type, and names are not part of that type. You can also combine the named arguments with unnamed ones, as shown in the fourth option.

You have to pay special attention to argument names of remote methods and resource methods, since these names are exposed as public interfaces for API endpoints. This is also applicable for public function in a module. Changing the argument names of such functions makes the module incompatible when it is imported into other modules.

## Type Inclusion for Records

There are times when it is beneficial to create a record by combining fields of other records. For example, suppose you have a **``Date``** record, which has a year, month, day fields, and you also have a **``TimeOfDay``** record having hour, minute, and seconds fields. 

You can create a **``Time``** record that has all the fields of Date and TimeOfDay, using the ``‘*’`` notation.

```ballerina
type Date record {
    int year;
    int month;
    int day;
};

type TimeOfDay record {
    int hour;
    int minute;
    decimal seconds;
};

type Time record {
    *Date;
    *TimeOfDay;
};
```
   
By using the *\*T* notation, you can include the record type *T* in the record type descriptor of another record. This effect is similar to copying the fields of the included records, **``Date``** & **``TimeOfDay``**, into including record, **``Time``**.

## Included Record Parameters

While designing API interfaces in Ballerina, you invoke the function with named arguments. Alternatively, you can also pass all the arguments within a record value. In this case, the mapping constructor is used as part of function invocation.

Ballerina allows you to define functions with included record parameters. In this case, the function defines records for named parameters. But the caller can pass parameters by name, which are the same as the record field names.  The `‘*”` can be used for this purpose.

```ballerina
type Options record { |
    boolean verbose = false;
    string? outputFile = ( );
| };

function foo(string inputFile, 
                       *Options options){ 
}   

function main( ){
    foo(“file.txt” , verbose = true);
}
```

The function **``foo( )``** accepts a string **``inputFile``**, and also includes the parameters of the **``Options``** record. So apart from calling this function by directly passing a value of **``Options``** record, you can also pass named arguments having the same name as the fields in **``Options``** records.

This way of including record fields as named arguments in a function provides a consistent experience to the caller.

## Default Values for Record Fields

Ballerina also allows default values for record fields as part of the record’s type descriptor. A default value is an expression, which can also be a closure that is computed in the context of the enclosing module scope.

```ballerina
type X record {
    string str = "";
};

X x = { };
```
  
In the above code example, the record **``X``** has field **``str``** which is defaulted to empty string. The variable **``x``** is of type **``X``** and contains the default empty string.

Default value does not affect static typing. It only affects the use of type descriptors to construct records. Calling *cloneWithType(T)* on a record *T* will make use of defaults in *T*. Similarly, using *\*T* also copies the default values.

## Object Types

Ballerina also allows you to define object types that define just the type without the implementation. Unlike classes, which give you the type as well as the implementation that you can instantiate through ``new``, an Object type is a definition without any implementation. It is similar to the concept of an Interface, as defined in the Java programming language.

```ballerina
type Hashable object {
    function hash( ) returns int;
};

function h( ) returns Hashable {
    var obj = object {
        function hash( ) returns int {
            return 42;
         }
    };
    return obj;
};
```

In the above code example, **``Hashable``** is an object type, and its value has a function called **``hash( )``**  that returns an integer. The function **``h( )``** returns the object type **``Hashable``**. Inside **``h( )``**, an object of type **``Hashabe``** is created by defining the function **``hash( )``** and assigned to **``obj``**, which is finally returned.

Object typing is structural, and object type looks like a pattern that the object must match. In this case the match is done to check that the returned Object matches the pattern of **``Hashable``** object type which contains a function **``hash( )``** returning an integer.

## Object Type Inclusion

You can also include the object types using the *\*T* syntax. You have two options for that. First, you can include an object type in another object type, such that one interface extends another interface. Secondly, you can also have a class that includes a type, like the class implementing the interface.

```ballerina
type Cloneable object {
    function clone( ) returns Cloneable;
};

type Shape object {
    *Cloneable;
    function draw( );
}

class Circle {
    *Shape;
    function clone( ) returns Circle {
        return new;
    }
    function draw( ) {   }
}
```

In the above code example, **``Cloneable``** is an object type. It is included as part of the interface for the **``Shape``** object type. Therefore **``Shape``** defines an interface containing the function **``draw( )``** which is part of its own type as well as the function **``clone( )``** included from **``Cloneable``**. The class **``Circle``** includes the **``Shape``** object type. Therefore it has to implement both the **``clone( )``** and **``draw( )``** functions. The function **``clone( )``** returns a **``Circle``** and is considered valid since the **``Circle``** becomes a subtype of **``Cloneable``** once it includes the **``Cloneable``** object type.  

The implementation of object type within the class that includes the type is checked at the compile time. This provides interface inheritance. Ballerina does not support implementation inheritance.

## Distinct Object Types

Ballerina also supports the concept of distinct object types. This allows you to define a type with a name that is significant, similar to nominal typing within a structured type system. It is done by using the ``distinct`` keyword in the type definition.

```ballerina
type Person distinct object {
    public string name;
};

distinct class Employee {
    *Person;
    function init(string name) {
        self.name = name;
    }
};

distinct class Manager {
    *Person;
    function init(string name) {
        self.name = name;
    }
};
```

In the above code example, the type **``Person``** is defined as distinct. This means that the compiler will give this type a unique name, with which the object value will be tagged and is unique across all the distinct types defined in the program. The **``Employee``** type includes the **``Person``** type, so it belongs to the distinct **``Person``** type as well as distinct **``Employee``** type. Similarly, the class **``Manager``** also inherits the **``Person``** type.

Conceptually, a distinct type including another distinct type results in multiple interface inheritance. So a type check on the value of the **``Employee``** object will return true both for the **``Employee``** as well as the **``Person``**. The same applies to **``Manager``** type.

One scenario where you would want to use a distinct object type is when you are inter-operating with another program in a different programming language, where you want to have distinct types corresponding to the type structures in the other language. For example, if you are interoperating with Java, you want each of the Ballerina classes to correspond to the Java class to capture the Java semantics correctly. Similarly, while interacting with the external world through API interfaces like GraphQL, you may want to leverage nominal typing via this distinct typing feature of Ballerina.


## Readonly Objects and Classes

You can also define readonly objects and classes. An object is ``readonly`` if all its fields are final and have readonly type. You can use *readonly & T* to declare an object *T* as ``readonly``.

```ballerina
type TimeZone readonly & object {
    function getOffset(decimal utc)
                 returns decimal;
};
```

You can also have a class that belongs to readonly type, by prefixing the ``readonly`` keyword in the class declaration.

```
readonly class FixedTimeZone {
    *TimeZone;
    final decimal offset;
    function init(decimal offset) {
        self.offset = offset;
    }

    function getOffset(decimal utc)
                                  returns decimal {
        return self.offset;
    }
}
```

In the above code example, the class **``FixedTimeZone``** is of readonly type. It includes the **``Timezone``** which is also a readonly type, and it has a final decimal field named **``offset``**. If this class defines any object type *T* within its body, that will also become *readonly & T*.

## Error Detail

In Ballerina, you can associate additional payloads to an error type that contains more specific details about the context of the error.

```ballerina
error err =
    error("Whoops", httpCode = 27);

type HttpDetail record {
    int httpCode;
};

error<HttpDetail> err =
    error("Whoops", httpCode = 27);

HttpDetail d = err.detail();
```

In the above code example, **``err``** is an error type constructed from named arguments to add some details to the error value. You can also describe the error details as a type *T* by using the *error<T>* syntax. **``HttpDetail``** is a record type that defines the field **``httpCode``**. When included in the declaration of the **``err``** Error type, it adds the error detail record as per **``HttpDetail``** record. When you want to get the detail out of the error, you can use the LangLib function *error:detail( )* to get back the **``HttpDetail``** record.

## Error Cause

You can also have a cause in the error type. You can add it as an optional positional argument.

```ballerina
function foo(string s)
                   returns error|int {
    var res = int:fromString(s);
    if res is error {
        return error("not an integer",
          res);
    }
    else {
        return res;
    }
}
```

In the above code example, the error constructor is called with the additional argument **``res``**, which is the error type returned in the case of **``fromString( )``** returning an error.

You can also call the LangLib function *error:cause( )* on the error type to extract the cause value.

## Type Intersection for Error Types

If you want to have an error type that is both distinct and has a constraint, you can use Ballerina’s type intersection to define such an error type.

```ballerina
type IoError distinct error;

type FileErrorDetail record {
    string filename;
};

type FileIoError
    IoError & error<FileErrorDetail>;
```
 
In the above code example, the error type **``FileIoError``** is declared through a type intersection of distinct error type **``IoError``** and the error detail record **``FileErrorDetail``**, using the `‘&’` notation.

## Type Intersection

Type intersection is a generic feature that can be used for other types also. For example, you can use it to combine two objects.

```ballerina
type Foo object {
    function foo();
};

type Bar object {
    function bar();
};

type FooBar Foo & Bar;

// same as
type FooBar object {
    *Foo;
    *Bar;
};
```

In the above code example, **``Foo``** and **``Bar``** are two separate object types. The type **``FooBar``** is defined through the type intersection of **``Foo``** and **``Bar``** using `‘&’` notation. This has the same result as including the types using the `*` notation. It provides a neat alternative to type inclusion, but is less flexible.

## Expression-oriented Style

Ballerina’s general philosophy is to make the programming syntax familiar to those familiar with the C-family of languages. It has a distinction between statements and expressions, just like in C. This is the imperative style of programming which is considered less intuitive. That’s why there is a shift towards a functional style of programming which is more expression oriented..  

Ballerina tries to provide a few options to make it possible to do more things with expressions. You have already seen a few examples of expressions, such as query expressions, constructor expressions for structured types, and nil expressions for functions returning nil values.

Here, are a few more things that you can do using expressions in Ballerina.

```ballerina
function inc(int x) returns int => x + 1;

// same as
function inc(int x) returns int {
    return x + 1;
}
```

You can use expressions to return the body of a function using the `‘=>’` notation instead of using curly braces to define the function block.

```ballerina
var obj = object {
    private int x = 1;
    function getX() returns int => self.x;
};
```

This works even within objects where methods are implemented.

```ballerina
// let expressions
function hypot(float x) =>
    let float x2 = x * x in
        float:sqrt(x2 + x2);
```

And it also works with query statements where you can have expressions following the let clause using the ``in`` clause.

## Computed Field Key

Ballerina allows you to have computed values for the names of keys in a map. So, rather than defining it in the compile time, you can compute and assign it in runtime.

```ballerina
const X = "x";
const Y = "y";

map<int> m = {
    [X]: 1,
    [Y]: 2
};
```

In the above code example, **``m``** is a map whose constructor defines two keys, substituted from the constants **``X``** and **``Y``** using the square brackets. Similarly, you can use any expression within the square brackets to compute the field name.

This is useful when you have a complex or a long key name, like an URL, which you can assign to a constant and then use that as the key name.

## Tuples

Tuple is another structured type supported by Ballerina, which creates a list of values just like arrays. The main difference between arrays and tuples is that an array has only one type applicable to every member of its list, whereas in a tuple type you can individually specify the types for each member.

```ballerina
// Fixed length array
type FloatPair float[2];


FloatPair p = [1.0, 2.0];
```
  
In the above code example, **``FloatPair``** is initially declared as an array of floats with a fixed length of two.

```ballerina
// Tuple
type FloatPair [float, float];
```

You can create the same list type of two floats as a tuple type, by specifying the float type twice within the square brackets of tuple declaration, as declared in the  **``FloatPair``** type above.

```ballerina
// Can mix types
type Id [string, int, int];
```

But tuples are most suitable for describing lists with multiple types. In the above code example,  **``Id``** is a tuple type that contains a list, whose first member is a string type and second and third members are integer types.

```ballerina
byte[*] a = base16`DEADBEEF`;
```

You can also infer the length of an array from the initializer expression. In the above code example, the array **``a``** is initialized with a fixed length, but the declaration uses a `‘*’` notation instead of specifying the length. This means that the compiler will allocate the array length based on the values used as the initializer expression.


## Destructuring Tuples

Tuples can be accessed normally, like arrays, by specifying the index. However, there is a more intuitive way to use tuples by destructuring them.

```ballerina
type Time [int, decimal];

function toSeconds(Time ip)
    returns decimal {
        var [day, seconds] = ip;
        decimal s = 86400d*<decimal>day;
        s += seconds;
        return s;
}
```

In the above code example, **``Time``** is a tuple type. It represents a time in days and seconds as an integer and a decimal value respectively. The function **``toSeconds( )``** accepts a variable of type Time and converts it to seconds. Within the conversion logic, the tuple value is destructured into two variables: **``day``** and **``seconds``** using a binding pattern with values initialized from the tuple. This way, you can break down the list of values into individual variables to be used for computation.

With this approach, you can read tuple values in a more idiomatic way within the code, instead of using index-based access.

## Binding Patterns in Assignment

The destructuring syntax of tuples can also be used to bind to variables in assignments.

```ballerina
int x = 0;
int y = 1;

type IntPair [int, int];

function assign(IntPair ip) {
    [x, y] = ip;
}

function swapXY() {
    [x, y] = [y, x];
}
```

In the above code example, **``IntPair``** is a tuple type of two members of type int. Within the function **``assign( )``**, the variable **``ip``** of type  **``IntPair``** is destructured and assigned to the two module-level variables **``x``** and **``y``**.  This makes it very efficient to perform some operations, such as swapping two variables. In the function **``swapXY()``** you can see that the swapping is done between **``x``** and **``y``** just by doing tuple destructuring without using a temporary variable.

## Rest Type in Tuples

Similar to how maps can be described as record types, arrays can also be defined as tuple types using `'...'`.

```ballerina
// int followed by
// zero or more strings

type Id [int, string...];
```

In the above code example, the tuple type **``Id``** has the first member of the list as integer, followed by any number of members of type string. This is known as rest type in Ballerina.

Therefore, any array of type *T*,  as in *T[ ]*, can be described as *[T . . .]* , which is a tuple  containing zero or more *T* type members in the list. Tuples are not open by default.

## Array/Map Symmetry

| Basic<br>type | Index type | JSON   | Constructor                       | Type with<br>uniform<br>member<br>type | Type with<br>per-index member<br>type       | Open type                            |
|---------------|------------|--------|-----------------------------------|----------------------------------------|---------------------------------------------|--------------------------------------|
| list          | int        | array  | [<br> "foo",<br> "bar"<br>]       | array<br><br>T[]                       | tuple<br><br>[T0,T1]                        | <br>[T0,Tr...]                       |
| mapping       | string     | object | {<br> x: "foo",<br> y: "bar"<br>} | map<br><br>map&lt;T&gt;                     | record<br><br>record {<br> Tx x; Ty y;<br>} | record {\|<br> Tx x;<br> Tr...;<br>\|} |

Overall, Ballerina provides quite a nice symmetry between lists and mappings.  

If you consider the two types of values, lists and mappings, lists are indexed by integers and mappings are indexed by strings. In terms of the JSON format, lists are represented by arrays and mappings are represented by objects. Constructor for lists uses square brackets and mappings use curly brackets. 

Both the list and mappings types can be described in two ways, using uniform member types, and per-index member types. A list with uniform member type *T* is an array, declared as *T[ ]*. A mapping with uniform type member *T*  is a map, declared as *map \<T>*.  Similarly, a list with per-index member types *T0* and *T1* is a tuple, declared as *[T0, T1]*. And a mapping with per-indexed members is a record, declared as *record { Tx x; Ty  y; }*.

Using the `‘ . . .’` notation you can have an open type. In case of lists, an open type is declared as a tuple type as  *[T0, Tr. . .]*. In case of mapping, it is a record type declared as *record {| Tx x; Tr . . .; |}*.

## Rest Parameters

Ballerina also supports rest parameters.

```ballerina
function foo(int n, string... s) {
}

function bar() {
    // Param s will be ["x", "y", "z"]
    foo(1, "x", "y", "z");
}
```

In the above code example, the function **``foo()``** has an integer parameter followed by *string . . .* which is the rest parameter. Therefore when this function is called, it takes one integer value, followed by any number of string values. All of the string parameters get bound into a list which will be the value of **``s``**. In this example, when function **``foo( )``** is called within function **``bar( )``** with three string parameters, all of them will get bound up in a list of three strings and be passed to the function **``foo( )``** as parameter **``s``**.

This feature is also useful in service resource methods whose parameters are mapped to API paths.

```ballerina
service on hl {
    // With URL file/x/y/z
    // path will be ["x", "y", "z"]
    resource function
        get file/[string... path]()
            returns string|error {
}
```

In the above code example, service **``h1``** has a resource method which is *file/*. It accepts the string parameter as a rest type. As a result, you can append any number of levels to the base path *‘file/’* to represent a URL denoting a complete file path.

## Spread Operator . . .x

The spread operator `‘. . .’`  allows you to spread out the members of a structured type. If you declare *. . .T*, where *T* is a list or mapping, this is equivalent to specifying each member of *T* separated by a comma. In case of lists, it is specified by positions, and in the case of mapping, it is specified by name.

```ballerina
type Date record {|
    int year; int month; int day;
|};

type TimeOfDay record {|
    int hour; int minute; int second;
|};

type DateTime record {|
    *Date; *TimeOfDay;
|};

function merge(Date d, TimeOfDay t)
                      returns DateTime {
    return { ...d, ...t };
}
```

In the above code example, **``Date``** and **``TimeofDay``** are closed records that are included in the **``DateTime``** record. The function **``merge( )``** returns a value of type **``DateTime``** which is constructed using the spread operator with the arguments of type **``Date``** and **``TimeofDay``**, which is equivalent to specifying each individual field from the two arguments explicitly.

Spreading also works in the case of function calls, by calling *f(. . .x)* which expands the **``x``** into function arguments. If **``x``** is a list the arguments are arranged positionally, else in case of map, they are arranged as named arguments. You can use spreading in a list constructor, as *[ . . .x ]* or a mapping constructor, as *{ . . .x }*. You can also use it in an error constructor, *error( msg, . . .x)*, in which case **``x``** must be a map.

The basic rule to allow the spread operator is that the static type of the expression guarantees  type safety with each value. For example, if the **``Date``** and **``TimeofDay``** are open records, containing the same name for a member, then at the time of spreading to construct the record **``DateTime``**, this will lead to a duplication of fields. Therefore, this will not be allowed at compile-time.

## Spread in Binding Patterns

You can use the spread operator in binding patterns.

```ballerina
type Id [int, string...];

function process(Id id) {
    var [n, ...path] = id;
    foreach string s in path {
        io:println(s);
    }
}
```

In the above code example, **``Id``** is a type with string as rest type. Inside the function **``process( )``**, it is destructured using a binding pattern that uses the spread operator, such that the variable **``path``** will contain all the string values passed within the tuple type. This can be leveraged with records too.

## Binding Patterns in ``match`` Statement

You can also use the spread operator in a binding pattern in a match statement. For example, it can be used with an open record in a ``match`` statement.

```ballerina
type Pair record {
    int x;
    int y;
};

function foo(Pair pair) {
    match pair {
        var {x, y, ...rest} => {
            io:println(x, ", ", y, ", ",
                        rest);
        }
    }
}
```

In the above code example, the ``match`` statement has a binding pattern that matches the variables **``x``** and **``y``** to the  *x* and *y* fields of the record pair. The binding pattern also has a rest binding pattern to capture the additional fields that may be defined in **``pair``**, since it is an open record. The record value pair will be matched to this since it has the fields *x* and *y*, and the variable **``rest``** will be bound to everything else in pair.

The type for rest can be interpreted as a map of anydata. But when it is included in the binding pattern that includes the fields **``x``** and **``y``** from **``Pair``**, we know that the type of rest should be defined in such a way that it must not contain the field *x* and *y* itself. This is achieved through another kind of type called the never type, which is covered in the next section.

## ``never`` Type

Ballerina also supports a ``never`` type which means that no value belongs to such a type. This is useful on quite a few occasions. One simple way to leverage never type is to use it as a return type for a function that never returns normally.

```ballerina
function whoops() returns never {
    panic error("whoops");
}
```

In the above code example, the function **``whoops( )``** always panics. It never returns normally. Therefore, it is perfectly fine to describe the return type of this function as never.

A variable cannot have the never type. But you can use it with streams and xml. *stream\<int.never>* means that it is an infinite stream. *xml\<never>* means that it is an empty sequence, and can be used to define the type for an empty XML sequence.

One of the interesting ways of leveraging the never type in records is to use it for setting constraints on the fields it may contain.

```ballerina
type Pair record {
    int x;
    int y;
};

Pair p = {
    x: 1, y: 2, "color": "blue"
};

var {x: _, y: _, ...rest } = p;

// Type of `rest` is
type PairRest
    record { never x?; never y?; };
```

In the above code example, **``Pair``** is an open record. Therefore **``p``** is constructed with the fields **``x``**, **``y``** and an additional field **``color``**.  You can use a binding pattern to define a variable **``rest``**, which contains the variables other than **``x``** and **``y``**. That makes the **``rest``** a type of map with key “color” and a value “ blue”. The type for **``rest``** is defined as **``PairRest``**, which is a record with two optional fields **``x``** and **``y``**, of ``never`` type. But since you cannot have variables with never type, the net result is that you cannot have these fields. Thus *record { never x? ; never y?; }* means that it can have any field of type anydata, except fields with keys *“x”* and *“y”*.

So this means that **``rest``** can have any field except the fields with keys `x` and `y` since they are already bound. The never type can be leveraged with optional fields to indicate that that record will never have the particular field.

## Interfacing to External Code

Sometimes you want to interface with an external code. Instead of implementing the function body the keyword ``external`` can be used. The implementation figures out how to map to the external implementation.

```ballerina
public function open(string path)
               returns handle|error
    = external;
```

In the above code example, the function **``open( )``** has an external implementation since its body is defined as *= external*. The ``external`` keyword can be annotated to add additional information that specifies where the implementation comes from.

As part of interfacing with external implementation, Ballerina supports another basic type called ``handle``. A handle value is a reference to storage managed externally and it may be passed a reference to an external function, like in JVM where you may have a JAVA object reference pointing to the implementation.

Handle type is basically an opaque handle that can be passed to external functions. There is no typing for handle and can be added as a private member of a Ballerina class for better type safety. Alternatively, you can also have an entire module that is implemented in something other than Ballerina.

## Built-in Integer Subtypes

Another feature that is particularly useful when interacting with external code is the concept of built-in subtypes. Ballerina only has one integer type which is a 64 bit, signed type. But the external code may use different variants of integers, and you need to support those types. LangLib provides these variants as subtypes.

```ballerina
function srand(int:Unsigned32 seed)
   = external;

function demo1(int n) {
    // OK: 72 is an int:Unsigned32
    srand(72);
    // use lo bits
    srand(n & 0xFFFFFFFF);
    // panic if out of range
    srand(<int:Unsigned32>n);
}
```

In the above code example, the function **``srand( )``** takes a parameter **``seed``** which is of type *integer:Unsigned32*.  You can then call this function by passing a valid unsigned, 32 bit number. Bitwise operations on this subtype have to have special typing based on logic operators. You can also cast to it from another variable, but the code will panic if the integer value contained in that variable is out of range.

Similarly, LangLib provides subtypes *int:Signed32*, *int:Signed16* and *int:Signed8*, as well as *int:Unsigned16* and *int:Unsigned8* (same as byte).

One important thing to remember about these subtypes is that these are not separate basic types. Operations on these subtypes work exactly like integers. These subtypes allow better optimization of storage, particularly for arrays.

## Built-in String Subtype

Similar to integer subtypes, Langlib also supports a Char type which is a subtype of string. In Ballerina a single character is defined as a string of length one, but you can still use the subtype *string:Char*.

```ballerina
string:Char ch = "x";
int cp = ch.toCodePointInt();
```

In the above code example, **``ch``** is a *string:Char* type. You can also extract the code point of the char type by calling the **``toCodePointInt( )``** to get the numeric code point of the character. This subtype *Char* is analogous to the XML subtypes like XML elements or text.

## ``typedesc`` Type

Typedesc is a built-in type representing a type descriptor and is immutable. It has a type parameter that describes the types that are described by the type descriptors that belong to that type descriptor. A ``typedesc`` value belongs to type *typedesc<T>* if the type descriptor describes a type that is a subtype of *T*.

```ballerina
type R record {
    int x;
    int y;
};

typedesc<record {}> t = R;

// Will return true
function demo() returns boolean {
    R r = { x: 1, y: 2 };
    any v = r;
    return typeof v === t;
}
```

In the above code example, the type **``R``** is a record. **``t``** is a typedesc representing a record type and **``R``** is assigned to it. Inside the function **``demo( )``** , an instance for **``R``** is constructed as **``r``**, and assigned to **``v``** of any type. Finally, the ``typeof`` operator is used to retrieve the typedesc value of **``v``** which is compared with the typedesc of **``t``**.
.
The ``typeof`` operator gets the dynamic type of a value. Dynamic types for mutable structure are inherent types.

## **``ensureType``** Function

**``ensureType()``** is a LangLib function that is similar to a cast. It takes a typedesc as an argument. With the usual cast operation, you get a panic if the cast is not possible, and this is something that you may not want when dealing with situations such as handling user inputs. With ensureType an error is returned.

```ballerina
function demo(anydata v)
             returns float|error {
    return v.ensureType(float);
}
```

In the above code example, **``v``** is cast to float type by calling **``ensureType()``**. Therefore the calling function **``demo( )``** can return float or error. **``ensureType()``** also performs numeric conversion just like casting operations.

## Dependent Types

Assigning the result of ensureType above to float works without having to use the casting operator < >, because Ballerina supports a concept called dependent types that makes the return type of a function dependent on the value of a parameter. Unlike the normal convention where the return type is defined independently, here the return type depends on a parameter which is a type descriptor.

The **``ensureType()``** function also implements this feature.

```ballerina
// Declaration in lang.value
public isolated function ensureType(
    any|error v,
    typedesc<any> t = <>
    ) returns t|error
= external;
```

In this case, the function accepts the type descriptor **``t``** as a parameter and the return type is either of type **``t``** or an error. The implementation of this code is currently external, since there is limited support within the language for handling this feature within the code.

This function also works through implicit type identification based on the context.

```ballerina
function demo(json j) returns error? {
    float f = check j.ensureType();
}
```

In the above code example, the **``ensureType()``** function is called on **``j``** , and it returns a float value which is assigned to **``f``** , which is of a float type. This happens because the function parameter **``t``** of **``ensureType()``** has a default value of `< >` which causes the compiler to infer the argument for **``t``** from the function call context.

## Annotation Declaration and Access

You can declare your own annotations and use them across modules.

```ballerina
// Module m
public type IntConstraints {
    int minInclusive?;
    int maxInclusive?;
};

public
annotation IntConstraints
    ConstrainedInt on type;
```

In the above code example, the annotation declaration declares an annotation tag **``ConstrainedInt``** with the type **``IntConstraints``** as the type of the value associated with the annotation. The syntactic construct type which follows on declares that this annotation can be applied on types.

This can be used in another module, as follows.

```ballerina
// In another module
@m:ConstrainedInt { minInclusive: 1 }
type PositiveInt int;

m:IntConstraints? c
    = PositiveInt.@m:ConstrainedInt;
```

In the above code example, the **``ConstrainedInt``** annotation is defined with just the **``minInclusive``** field. It is applied to a type **``PositiveInt``**.  At runtime, a typedesc value can be used to access the annotations. You can use a reference to **``PositiveInt``** to get the typedesc value and then use the `‘.@’` notation on it followed by the annotation tag to retrieve the particular annotation. If the annotation is present, annotation access will return a value of the associated type **``IntConstraints``**. Since the annotation may or may not be specified, annotation access may also return nil. Therefore, the result of annotation access will be the union of **``IntConstraints``** and nil.

## Trapping Panics

Ballerina provides an option to trap panics. By trapping panics using the ``trap`` keyword, you can stop a panic and get access to the associated error value.

```ballerina
function safeAdd(int n1, int n2)
                     returns int|error {
    // On overflow, get an error
    // rather than a panic  
   return trap (n1 + n2);
}
```

In the above code example, the expression *(n1 + n2)* is evaluated. Under normal circumstances, the expression will return an integer. However, if there is an overflow, there will be a panic, but the trap captures it and provides access to it as an error.