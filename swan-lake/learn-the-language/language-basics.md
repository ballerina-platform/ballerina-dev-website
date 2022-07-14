---
layout: ballerina-language-basics-left-nav-pages-swanlake
title: Language basics
description: This page provides an introduction to the Ballerina language to help you get started with the basics that are common to all C-Family programming languages. 
keywords: ballerina, programming language, ballerina packages,language-guide
permalink: /learn/language-basics/
active: language-basics
intro: This page provides an introduction to the Ballerina language to help you get started with the basics that are common to all C-Family programming languages. 
redirect_from:
- /learn/language-basics
- /learn/getting-started/language-basics/
- /learn/getting-started/language-basics
---

## Familiar subset of Ballerina

Ballerina is a modern programming language focused on building applications for the cloud era. It has a familiar syntax resembling the C-family of languages such as C/C++, C#, Java, and JavaScript. It brings in many powerful concepts from existing programming languages and some unconventional abstraction mechanisms to make application development for the cloud more intuitive and less strenuous.

This guide presents the subset of the Ballerina language that is common to most modern programming languages. It covers the baseline features such as data types, control flow, and error handling, which should be very familiar to most programmers. These features are the foundation for some of the more [distinctive features of Ballerina](/learn/distinctive-language-features/network-interaction/). 

## Programs and modules

Ballerina programs consist of modules and each module consists of one or more *`.bal`* files.
  
The most important thing that a module does is define named functions.

Here's what a simple Ballerina module looks like:

```ballerina
import ballerina/io; 

public function main() {
    io:println("Hello World!"); 
}
```

The ``import`` keyword is used to bind predefined library modules to the module prefix. Ballerina modules have two-part names represented by an organization name and a module name. In this case, the organization is **``ballerina``**  and the module is **``io``**. The bound identifier that refers to this library module is set to the module name **``io``**. To override the default identifier binding for the module, you can use the ``as`` keyword as follows: *``import ballerina/io as oi``*.

Module hierarchies follow the ``/`` and ``.`` notations. For example, *``org/x.y.z``* represents a hierarchical module name. The ``z:f`` notation points to a symbol ``f`` (e.g., a function) defined within the module ``x.y.z``.

The ``main`` function is the program entry point and the ``public`` keyword makes this function visible outside the module. This ``main`` function calls the ``println()`` function defined in the ``ballerina/io`` module. Every statement in Ballerina code must terminate with a semicolon.

## Variables and types

Modules and functions can declare variables.

Variables have types. Ballerina defines several built-in types such as integers, floating point numbers, strings, and booleans.

Here is a typical way of declaring variables:

```ballerina
import ballerina/io;

string greeting = "Hello";

public function main() {
    string name = "Ballerina";
    io:println(greeting, " ", name);
}
```

**``greeting``** is a module-level variable of type ``string`` initialized to a value of `"Hello"`. The **``name``** variable is a local variable of type ``string`` initialized to a value `"Ballerina"`.

In Ballerina, variable assignments are statements and not expressions.

## Functions

Like all high-level programming languages, Ballerina supports functions. 

A function definition in Ballerina has a familiar syntax that includes parameters and a return type.

```ballerina
function add(int x, int y) returns int {
    int sum = x + y;
    return sum;
}
```

In the above code example, you see the definition for the **``add``** function. It accepts two parameters of type ``int``, **``x``**, and **``y``**. It also returns a value of type `int`. The ``returns`` keyword specifies the type of return value.

The function performs a simple addition operation and stores the result in another variable **``sum``** of type ``int``. The value assigned to **``sum``** is returned using the ``return`` statement.

## Syntax

The general syntax of a Ballerina program is as follows:

```ballerina
// This is a comment.
int count = 0;

// You can have Unicode identifiers.
function พิมพ์ชื่อ(string ชื่อ) {
    // Use \u{H} to specify character using Unicode code point in hex.
   io:println(ชื่\u{E2D});
}

string 'string = "xyz";
```

The overall syntax is pretty-much C-like. Comments start with ``//`` and end at the end of the line. Module definitions/declarations and statements use braces or terminate with a semicolon.   

You can also use Unicode characters in identifiers. Unicode literals can be defined using the `\u{H}` syntax to represent Unicode code points in the hex format.

Keywords such as ``int``, ``function``, and ``string`` are reserved keywords in Ballerina. You can use them as identifiers by prefixing them with a single quote.

## Integers

Ballerina defines an integer data type of a 64-bit signed representation. The ``int`` keyword is used to declare an integer. Integer literals can be declared either in decimal or hexadecimal format.

```ballerina
int m = 1;

int n = 0xFFFF;
```

The integer data type supports all the basic arithmetic operators: ``+``, ``-``, ``*``, ``/``, and ``%``, the comparison operators: ``==``, ``!=``, ``<``, ``>``, ``<=``, and ``>=`` as well as the compound assignment operators: ``+=`` and ``-=``. It also supports the usual bitwise operators (i.e., ``&``, ``|``, ``^``, ``~``, ``<<``,  and  ``>>``). The operator precedence rules are exactly as per C.

However, there are a couple of notable deviations in Ballerina. Firstly, increment and decrement operators (i.e., ``++`` and ``--``) are not supported. Moreover, integer overflow results in a runtime error unlike in C where it rolls over.

## Floating point numbers

In Ballerina, floating point numbers have an IEEE 64-bit binary representation similar to `double` in Java. Variables of the `float` type are declared with the ``float`` keyword and they support all operations similar to integers except bitwise operators.

```ballerina
int n = 2;
float x = 1.0;

float y = x + <float>n;
```

However, they cannot be implicitly converted to or from integers. You can use the ``<T>`` notation for explicit conversion.

In Ballerina, ``NaN``, the IEEE defined terminology for Not a Number is equal to itself. Therefore, the ``==`` operator on two ``NaN``s will return `true`. For floating point types, the ``==`` and ``!=`` operators test for the same value and do not test for numerical equivalence as per the IEEE convention.

## Booleans and conditionals

The boolean type has only two values: ``true`` and ``false``.

```ballerina
boolean flag = true;
```

Ballerina supports the logical operators, ``!``, ``||``, and ``&&`` with boolean values. The ``||`` and ``&&`` operators support the same short-circuit behavior as in C. Implicit conversion between boolean and integer is not supported.

Booleans are also used in conditional expressions like:

```ballerina
int n = flag ? 1 : 2;
```

As usual, booleans can be used in if-else statements like:

```ballerina
function foo() {
    if flag {
        io:println(1);
    } else {
        io:println(2);
    }
}
```

Curly braces are required in if-else statements and all compound statements in Ballerina. However, the parenthesis before the curly braces are optional.

## Nil

Nil is another data type. It has a special significance in Ballerina as it denotes the equivalent of what is known as a null value in other C-family languages. If you want to declare a variable or a value of type nil, here is how it is done.

```ballerina
int? v = ();
```

The keyword ``int`` is followed by a ``?`` notation. It means that **``v``** can take an integer value or can be nil. It is initialized to nil, which is denoted by ``()``. Types do not allow their values to be set as nil implicitly. There is also no implicit conversion to boolean.

The ``==`` and ``!=`` comparison operators operate on a value to test whether the value is nil.

```ballerina
int n = v == () ? 0 : v;
```

Similarly, you can also use the Elvis operator like *``x ?: y``* that returns **``x``** if it is not nil or **``y``** otherwise.

```ballerina
int n = v ?: 0;
```

Leaving off the return type of a function is the same as defining nil as the return type. Moreover, falling off the end of a function or `return`
by itself is equivalent to `return ()`. Therefore, a function can be written as:

```ballerina
function foo() returns () {
    return ();
}
```

## Strings

Strings are immutable sequences of zero or more Unicode characters. To define a variable of type `string`, you use the ``string`` keyword in Ballerina.

```ballerina
string grin = "\u{1F600}";
```

String literals are enclosed in double quotes and support the usual C-style escape sequences as well as numeric escape characters for Unicode code points.

The `string` type supports the usual operators. The ``==``  operator checks for the same characters. The comparison operators (i.e., ``<``, ``<=``, ``=>``, and ``>``) work by comparing code points. The ``+`` operator is used for concatenation.

```ballerina
string greeting = "Hello" + grin;
```

The member access expression (e.g., ``s[i]``) on a string value points to the character at index `i` of the string. The index positions on values of the `string` type start with zero.

Ballerina does not support the notion of a separate character type like in C. Instead, a character is considered a string of length one.

## Langlib functions

Ballerina defines lang libraries to provide fundamental operations on built-in datatypes. 

For example, you can perform standard operations such as getting a substring or finding the length of the string on values of the ``string`` type.

```ballerina
string s = "abc".substring(1,2);

int n = s.length();
```

The ``substring()`` and ``length()`` functions are ``string`` lang library functions called using the convenient method call syntax. However, the functions are called on variables/values of the ``string`` type rather than objects.

Ballerina imports the lang library for **``ballerina/lang.T``** where **``T``** represents a built-in type. Therefore, in the case of the above code example, the length of the string value can also be found by importing the **``ballerina/lang.string``** module and calling the **``length()``** function using the function call syntax.

```ballerina
int n = string:length(s);
```

## Arrays

Arrays are sequential data structures consisting of values of the same type.  

You can declare an array of integers as:

```ballerina
int[] v = [1,2,3];  
```

You can index the individual elements of this array using the ``v[i]`` notation. Array indexing starts with zero. So the second element of **``v``** can be accessed as *``v[1]``*.

```ballerina
int n = v[1];
```

Arrays are mutable. Ordering is supported based on a lexicographical ordering of members. 

The ``==`` and ``!=`` comparison operators perform a deep comparison of two arrays based on the members and their order instead of the memory location.

Langlib functions for arrays are available to perform operations such as finding the length of an array.

```ballerina
int len = v.length();
```

## ``foreach`` statement

A ``foreach`` statement iterates over an array by binding a variable to each array member at every loop iteration.

```ballerina
function sum(float[] v) returns float {
    float r = 0.0;
    foreach float x in v {
        r += x;
    }
    return r;        
}
```

In this code example, the **``x``** variable of the ``float`` type is bound to each element of the **``v``**  array. Similarly, it also works with the ``string`` type by iterating over each character in the string.

The foreach statement can also be constructed using a range expression such as ``..<``.

```ballerina
function sum(float[ ] v) returns float {
    float r = 0.0;
    foreach int i in 0 ..< v.length() {
        r += v[i];
    }
    return r;
}
```

Here the **``i``** variable of the ``int`` type is set to a sequence of linearly incrementing numbers that ranges from zero to the length of the array **``v``**. Therefore, the ``foreach`` statement iterates over the length of the array and increments **``i``** during each iteration.

## ``while`` Statement

The `while` loop in Ballerina behaves exactly like in C.

```ballerina
type LinkedList record {
    string value;
    LinkedList? next;
};

function len(LinkedList ll) returns int {
    int n = 0;
    
    LinkedList? nextLL = ll.next;

    while nextLL != () {
        n += 1;
        nextLL = nextLL.next;
    }

    return n;
}
```

In this example, the ``while`` loop is checking for a boolean condition to check for the end of the linked list **``ll``**.

The ``while`` statement also supports the usual ``break`` and ``continue`` statements.

## Binary data

Binary data is represented by an array of bytes.

```ballerina
byte[] data = base64 `yPHaytRgJPg+QjjylUHakEwz1fWPx/wXCW41JSmqYW8=`; 
```

An array of bytes can also be represented in the source code using base-64 or base-16 literal formats.

The ``byte`` type represents a number between ``0`` and ``0xFF``. You can define a variable of the ``byte`` type with the ``byte`` keyword.

```ballerina
byte b = 0xFF;
```

In Ballerina, ``byte`` is a subtype of the integer type. Therefore, it supports all the bitwise operators available on integers. Some of these operators produce a value that belongs to the integer type, and some operators like the ``&`` operator produce a value that belongs to the ``byte`` type.

## Maps

A map is an associative structure of multiple string values as keys and their values.  If you want to create a map of integers, then you would define it as:

```ballerina
map<int> m = {
    "x": 1,
    "y": 2
};
```
 
The syntax to define a map is very similar to JSON. Maps are mutable, and *``m["x"]``* will return the integer value stored against *``x``* as the key, or nil if the key is not present.

```ballerina
m["x"] = 5;

int? v = m["x"];
```
  
When used in a ``foreach`` loop, it will iterate over all the values of the map. You can also use lang library functions such as *``get(k)``* to get the value mapped to the string key *``k``*, or *``keys( )``* to return an array containing all the key strings of the map.

The use of comparison operators ``==`` and ``!=`` on a map will perform a deep comparison. Two maps are equal if they have the same set of keys and the values for each key are equal.

## Type definitions

Ballerina allows you to define a name for a type. You can create user-defined type identifiers for the built-in types supported by the language.

For example, if you have an array of maps of the ``string`` type, *``map<string>[]``*, you can define a type definition for it as follows:

```ballerina
type MapArray map<string>[];

MapArray arr = [
    {"x": "foo"},
    {"y": "bar"}
];
```

This is similar to the typedef concept in C, where the identifier **``MapArray``** acts as an alias for the actual type.

## Records

A record is a collection of fields of a specific type. With record types, you have control over what your keys are.  

```ballerina
record { int x; int y; } r = {
    x: 1,
    y: 2
};
```

The above code defines a record **``r``** with two integer fields **``x``** and **``y``**, and initializes their values to 1 and 2, respectively.

You can also define it using the type definition as follows:

```ballerina
type Coord record {
    int x;
    int y;
};
```

Subsequently, you can use the **``Coord``** record to declare a variable and set or access its field values.

```ballerina
Coord c = {x: 1, y: 2};

int a = c.x;
```

Records are mutable. *``c.x``* is an ``lvalue``. Rules for record comparison are the same as those for maps.

## Structural typing

In Ballerina, the data types are defined in terms of a set of values. A type is a label for a set of values. These values can be part of a finite set or an infinite set.

For example, the ``int`` type has a finite set consisting of values within the range of 64-bit signed numbers. The ``string`` type is an infinite set that contains sequences of any number or order of characters. In this way, the universe of all values is partitioned into the basic types supported by Ballerina such as nil, boolean, integer, floating point, and string. Values of these basic types are immutable, and each value belongs to exactly one basic type.

There is also a concept of semantic subtyping, which means a subset of the values of the basic types. For example, the ``byte`` type is a subset of integer as it allows only a subset of values that are a part of the integer value set.

Additionally, Ballerina allows you to define your own types, such as arrays, maps, and records, which are mutable.

## Unions

Ballerina's type system allows you to define custom types based on the combination of two or more types. A union is, therefore, a superset of that combination.
 
You have already seen this with the ``T?`` notation where a variable of type ``T?`` can hold a value of type `T` or nil.   

Similarly, you can define a variable that holds an integer or a string.

```ballerina
type flexType string|int;

flexType a = 1;

flexType b = "Hello";
```

Using the ``|`` symbol in the type definition, you can create a union of multiple types. Therefore, in the above example, **``flexType``** can hold an integer value as well as a string value, and the Ballerina compiler won't complain.

You can also apply the concept of unions to structured data types like records. So it is possible to have a union of a record type containing fields of the ``string`` type and the basic ``string`` type.

```ballerina
type StructuredName record {
    string firstName;
    string lastName;
};

type Name StructuredName|string;
```
 
At runtime, you can define the business logic by checking the currently held value of the union-typed variable using the `is` operator.

```ballerina
function nameToString(Name nm) returns string {
   
    if nm is string {
        return nm;
    } else {
        return nm.firstName + " " + nm.lastName;
    }
}
```
 
In this way, the ``is`` operator in a condition causes the declared type to be narrowed.

## Error reporting

Ballerina does not support the notion of exceptions. Instead, errors are handled as part of the normal control flow. Errors are first-class citizens in Ballerina. There are a few mechanisms for handling errors, which are centered around an ``error`` type. The ``error`` type is a basic type in Ballerina, and error values can be passed around just like values of any other type.

Errors are reported by functions returning error values.

```ballerina
function parse(string s) returns int|error {
    
    int n = 0;
    int[] cps = s.toCodePointInts();
    
    foreach int cp in cps {
        int p = cp - 0x30;
        if p < 0 || p > 9 {
            return error("not a digit");
        }
        n = n * 10 + p;
    }
    return n;
}
```
 
In the above code example, the function **``parse()``** returns either an integer or an error. At the point of returning the error, the error constructor *``error("not a digit")``*  is called.

In case a function is expected to explicitly return only error values, a return type of ``error?`` is used. Ignoring an error also has to be done explicitly.

An error value includes a string message and the stack trace from the point where *``error(...)``* is called. An error value is immutable.

## Error handling

When an error is reported from a function, it is passed up to its caller. Ultimately it is handled at the ``main`` function, which can return it. Alternatively, you can use the ``is`` operator to check for the error type as part of the regular control flow to make a decision.

```ballerina
function intFromBytes(byte[] bytes) returns int|error {
    
    string|error ret = string:fromBytes(bytes);

    if ret is error {
        return ret;
    } else {
        return int:fromString(ret);
    }
}
```

In the above code example, the function defines a local variable **``ret``** to hold the value returned by the **``string:fromBytes()``** function. The **``ret``** variable is of a union type of the ``string`` and ``error`` types. Therefore to ascertain the actual type, ``is`` operator is used.

## ``check`` expression

Instead of using the ``is`` operator within the regular conditional flow to check for errors, Ballerina has a shorthand method available. Using the ``check`` keyword, error handling and return statements are much more concise.

So the **``intFromBytes()``** function defined in the previous section can now be written as: 

```ballerina
function intFromBytes(byte[] bytes) returns int|error {

    string str = check string:fromBytes(bytes);
    
    return int:fromString(str);
}
```
  
In this case, the expression following the ``check`` keyword is evaluated and the **``intFromBytes``** function returns immediately if the **``string:fromBytes()``** function returns an error.

## Error subtyping

Ballerina also allows fine-grained error detection based on error subtypes. Error subtypes can be defined using the distinct keyword.

```ballerina
type XErr distinct error;
type YErr distinct error;

type Err XErr|YErr;
```

Now, you can use the defined subtype in an error constructor to create error values of that type.

```ballerina
Err err = error XErr("Whoops!");
```

You can use the ``is`` operator to distinguish between the distinct subtypes.

```ballerina
function desc(Err err) returns string {
    return err is XErr ? "X" : "Y";
}
```

## Panics

In Ballerina, there is a distinction between normal and abnormal errors. Normal errors are the ones that you typically handle as part of the usual business logic and are under your control. But some errors are not under the control of the programmer. These are abnormal errors. Things such as bugs in library code or out of memory errors fall under this category.

Normal errors are handled by returning values of the ``error`` type. Abnormal errors are handled using the ``panic`` statement.

```ballerina
function divide(int m, int n) returns int {
    if n == 0 {
        panic error("division by 0");
    }
    return m/n;
}
```
 
A panic statement results in immediate program termination and has an associated error value.

## ``any`` type

Ballerina also has an ``any`` type, which means any value except an error value. A variable of type ``any`` can be cast to a specific type using the type cast expression (``<T>x``).

```ballerina
any x = 1;

int n = <int>x;
```

It can be converted to string.

```ballerina
string s = x.toString();
```

You can also use the ``is`` operator to test the type of the actual value held by the variable.

```ballerina
float f = x is int|float ? <float>x : 0.0;
```

## Ignore return values and errors

Ballerina does not allow silently ignoring return values of functions unless they return nil.

```ballerina
// Allowed only if return value is ()
doX();
```

To ignore the return value, you can assign it to ``_``, which acts as an implicitly declared variable of any type that cannot be referenced.

```ballerina
_ = getX();
```

When a function's return type includes an ``error`` type, it has to be handled explicitly. Otherwise, the ``checkpanic`` keyword can be used but it panics on error rather than returning.

```ballerina
checkpanic tryX();
```

## Covariance

Ballerina's type system follows a structured type system based on the set of values that belongs to a type. For example, the integer type allows a set of values. Similarly, the ``any`` type also allows a set of values, including the subset of values that belong to the integer type.

Therefore, you can have an array of the integer type that is assigned to an array of the ``any`` type.

```ballerina
int[] iv = [1, 2, 3];

any[] av = iv;
```
  
This is perfectly valid in Ballerina because the set of values allowed by an array of the integer type is a subset of the values allowed by an array of the ``any`` type. So this way, you can have some flexibility in allowing fixed inherent type substitution based on the set of values.

Ballerina's static type checking ensures that the result of a read operation on the array  **``av``** will be consistent with static type. However, writing may result in an error because the inherent type of the ``iv`` array is array of integers. As a result, the code below will lead to a runtime error since it is trying to mutate the array to a type other than the inherent type (``int[]``).

```ballerina
av[0] = "str"; // panics
```

This is covariance, which means that a write to a mutable structure may result in a runtime error. Apart from arrays, maps and records are the other data structures with an inherent type that constrains mutation.

## Object

Ballerina provides another basic type which is the object type. Object types bundle together code and data.

Objects are initialized based on a class defined within a module.

```ballerina
function demoMyClass( ) {
    m:MyClass x = new m:MyClass(1234);
    x.foo( );
    int n = x.n;
}
```

In the above code example, the function **``demoMyClass()``** uses the ``new`` expression to create an object **``x``** using the **``MyClass``** class that is defined in module `m`. You can use the ``.`` notation to call the object's methods or access its fields.

## Define classes

Ballerina supports the concept of a class which is a structured type containing data and behavior.

```ballerina
class MyClass {
    
    private int n;

    public function init(int n = 0) {
        self.n = n;
    }

    public function inc() {
        self.n += 1;
    }

    public function get() returns int {
        return self.n;
    }
}
```

The **``init``** method is the constructor for this class, and the keyword ``self`` is used to access the object. It also uses the standard access specifiers, ``private`` and ``public``, which translate to accessibility within the class definition and outside of it.

## ``init`` return type

The **``init()``** method of a class can have a return type. The return type must be a subtype of the union of ``error`` and ``nil``.

```ballerina
class File {

    string path;

    string contents;

    function init(string p) returns error? {
        self.path = p;
        self.contents = check io:fileReadString(p);
    }

}

File f = check new File("text.txt");
```
 
If the *``init()``* call returns normally, the newly constructed object is returned. Otherwise, the ``new`` expression returns the error value.

The return type of the **``init()``** method is nil if a return type is not explicitly specified. It also means that the ``init`` method will never return an error.

## Identity

In Ballerina, the identity of an object is determined by the memory location in which the object resides at runtime. To check the identity, you can use the ``===`` and ``!==`` equality expressions.

```ballerina
MyClass obj1 = new MyClass();
MyClass obj2 = new MyClass();

// true
boolean b1 = (obj1 === obj1);

// false
boolean b2 = (obj1 === obj2);
```

In the above code example, both **``obj1``** and **``obj2``** are **``MyClass``** objects. *``obj1 === obj1``* returns true as both operands of the operation refer to the same memory location. Similarly, *``obj1 === obj2``* returns false since they refer to different memory locations.
 
The ``==`` operator is used to check for contents of a structure type like arrays.

```ballerina
// true
boolean b3 = ([1,2,3] == [1,2,3]);

// false
boolean b4 = ([1,2,3] === [1,2,3]);
```

In the above code example, the first operation results in true as both the arrays have exactly the same content. However, the second operation is false because it is using the ``===`` operator to check for memory locations, and the two inline arrays point to different memory locations, even though their contents are the same.  

In the case of floating point numbers, IEEE defines -0.0 and +0.0 as the same. Therefore applying ``==`` to compare -0.0 and +0.0 would return ``true``, whereas *``-0.0 === +0.0``* would always be ``false`` as they are not identical.

## ``const`` and ``final``

Ballerina supports constants. Constants are defined using the ``const`` keyword and are immutable singleton types having a value known at compile time.

```ballerina
const MAX_VALUE = 1000;
```

Apart from ``const``, there is also support for ``final``. Variables defined with the ``final`` keyword cannot be reassigned to after being initialized.

```ballerina
final string msg = loadMessage();
```

This is also applicable for class fields.

## Enumerations

Ballerina supports the notion of enumerations which is a shorthand way for expressing unions of string constants.

```ballerina
enum Color {
    RED, GREEN, BLUE
}
```

Using the ``enum`` keyword, you can define this enumeration of three string values "RED", "GREEN", and "BLUE", which would otherwise be defined separately as a union of string constants:

```ballerina
const RED = "RED";
const GREEN = "GREEN";
const BLUE = "BLUE";

type Color RED|GREEN|BLUE;
```
 
You can also have an enumeration where members define associated string values explicitly.

```ballerina
enum Language {
    ENG = "English",
    TL = "Tamil",
    SI = "Sinhala"
}
```

## ``match`` statement

The ``match`` statement is like the switch case statement in C, but it is more flexible. You can use it to match values of different types.

```ballerina
const KEY = "xyzzy";

function mtest(any v) returns string {

    match v {
        17 => { return "number"; }
        true => { return " boolean"; }
        "str" => { return "string"; }
        KEY => { return "constant"; }
        0|1 => { return "or"; }
        _ => { return "any"; }
    }
}
```

The match statement defines multiple clause statement blocks with the ``=>`` operator. The left-hand side of the ``=>`` operator in each clause is the pattern for the value match. It can contain literals or identifiers referring to constants. It can also contain multiple patterns specified using ``|``. Additionally, ``_`` can be used to match any value that is not an error.  

In the above example, the match statement uses the value held by **``v``** and matches it against six match clauses having distinct patterns. During execution, the patterns will be evaluated in order, using the equality expression (``==``) to test the pattern match, and the matched clause's statement block will be executed.

## Type inference

Type inference allows the program to infer the actual data type of variables.

This feature is a convenient way to use a generic type for a local variable and helps avoid repeated type declarations.

```ballerina
var x = "str";
```

In this code example, the keyword ``var`` is used to declare the variable **``x``**. It means that the variable's actual type will be inferred from the type of the expression used to initialize it. In this case, it is the ``string`` type.

This is especially useful in a ``foreach`` loop to declare the local variable for iterating over a collection, like arrays.

```ballerina
function printLines(string[] sv) {
    
    foreach var s in sv {
        io:println(s);
    }

}
```

In this code example, the type of variable **``s``** is inferred to be of type ``string``, from the type of **``sv``**, which is an array of type ``string``.

Type inference also works with classes.

```ballerina
var x = new MyClass();
```

Here the variable **``x``** is declared with ``var`` and the type is inferred as **``MyClass``**. 

The opposite syntax is also valid, wherein the variable **``x``** is defined with the **``MyClass``** type and is initialized with ``new``.

```ballerina
MyClass x = new;
```

Type inference is applicable for variables in local scopes. Therefore ``var`` should be used sparingly for variables used within a very limited scope, like in a ``foreach`` loop. Overusing it makes the code harder to understand.

## Functional programming

Ballerina defines functions also as values, and they work as closures. Therefore ``function`` is also a type, which can be defined as a basic type as follows:

```ballerina
var isOdd = function(int n) returns boolean {
    return n % 2 != 0;
};

type IntFilter function (int n) returns boolean;

function isEven(int n) returns boolean {
    return n % 2 == 0;
}

IntFilter f = isEven;
```

In the above example, the variable **``isOdd``** defines an anonymous function. **``IntFilter``** is a function type that accepts a function with an ``int`` argument and returns a ``boolean`` value. And later on, the **``isEven``** function, with a matching signature, is assigned to a variable of this type.

These function values can be passed around as arguments. For example, the lang library for arrays defines a function **``filter(f)``** which accepts a function type **``f``** to perform specific filtering operations on arrays.

```ballerina
int[] nums = [1, 2, 3];

int[] evenNums = nums.filter(f);
```

The **``filter()``** function takes the function value as a parameter, which is **``isEven``**, assigned to **``f``**. Therefore, passing it as the argument results in ``filter()`` returning an array of even numbers.  

Instead of passing a function variable, you can also pass anonymous functions as an argument.

```ballerina
int[] oddNums = nums.filter(n => n % 2 != 0);
```

As shown for the array **``oddNums``**, the type of parameter **``n``** is inferred from the array with which the **``filter()``** function is used.

## Asynchronous function calls

Ballerina also supports asynchronous function calls. You can call a function asynchronously as follows:

```ballerina
future<int> f1 = start foo();

future<int> f2 = start foo();
```

The use of the ``start`` keyword before the function call makes it asynchronous. Each asynchronous call runs on a separate logical thread, also known as strand, that is cooperatively multitasked by default.

The result of this invocation is returned as a future. It is a separate basic type that has an attached type *``T``* as *``future<T>``*.

You can then wait for the result with the ``wait`` keyword.

```ballerina
int x1 = check wait f1;
int x2 = check wait f2; 
```

Waiting on a *``future<T>``* returns *``T|error``*. Waiting on the same future more than once returns an error value.

Instead of waiting for each future separately, you can also do the following.

```ballerina
record {| int|error f1; int|error f2; |} f = wait {f1, f2};

int x1 = check f.f1;
int x2 = check f.f2;
```
 
In case you want to terminate the ``future``, you can do *``f.cancel( )``*.

## Documentation

Ballerina supports a structured way to document code. Documentation lines start with ``#`` and contain structured documentation in Markdown format.

```ballerina
# Adds two integers.
# + x - an integer
# + y - another integer
# + return - the sum of `x` and `y`
public function add(int x, int y)
                     returns int {
    return x + y;
}
```

The above code example adds documentation to describe the parameters and the return type of the **``add()``** function. This is Ballerina-flavoured Markdown (BFM) which makes it convenient to generate pretty documentation using one of the platform tools.

## Annotations

Annotations are defined using the ``@`` notation followed by a tag. This is a way of attaching metadata to the code.

```ballerina
@display {
    iconPath: "transform.png"
}
public function transform(string s) returns string {
   return s.toUpperAscii();
}

future<int> fut = @strand { thread: "any" } start foo();
```

In the above code example, the *``@display``* annotation is attached to the function **``transform()``**, and the *``@strand``* annotation applies to the keyword ``start``, calling the function **``foo()``** asynchronously. These annotations use mapping constructor expressions, which is one of the ways to define them.

The annotations shown above use unprefixed tags and refer to standard platform-defined annotations. You can also have prefixed tags for user-defined annotations declared in modules.
 
