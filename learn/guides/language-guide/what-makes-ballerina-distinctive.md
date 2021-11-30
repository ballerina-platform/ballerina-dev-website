---
layout: ballerina-language-guide-left-nav-pages-swanlake
title: What Makes Ballerina Distinctive
description: In this part, you will learn about the features of the Ballerina programming language that are distinctive. These features revolve around key design considerations that make Ballerina suitable for cloud application programming using small and medium-sized programs.
keywords: ballerina, programming language, ballerina packages,language-guide
permalink: /learn/language-guide/what-makes-ballerina-distinctive/
active: what-makes-ballerina-distinctive
intro: In this part, you will learn about the features of the Ballerina programming language that are distinctive. These features revolve around key design considerations that make Ballerina suitable for cloud application programming using small and medium-sized programs.
redirect_from:
- /learn/language-guide/what-makes-ballerina-distinctive
---

Ballerina aims to be as pragmatic as possible by taking cues from existing patterns used in programming. It models cloud-era applications that make heavy use of network interaction, network data, and concurrency. In addition, Ballerina focuses on providing integration that acts like glue for orchestrating other programs and ensures reliability and maintainability while also assuring moderate cognitive load on programmers.

Ballerina’s genesis is based on the evolving trends in programming on the cloud. In the pre-cloud era, programming was more about reading/writing files, invoking system calls, and library functions. It also did not have much to do in terms of concurrency, as most programs were standalone desktop applications. However, now in the cloud era, files are replaced by network services and system calls/libraries are replaced by web APIs. Additionally, concurrency is pervasive with expectations to scale and elasticity. Ballerina’s feature set takes into account these evolutionary trends such that these are incorporated in the core of the language.

Individually these features may not stand out. However, it is the combination of them in specific programming scenarios that make them distinctive.

This and the subsequent two parts will talk about these features. Let’s start with network interaction. The two fundamental operations in any network interaction are consuming services and providing services.<br><br>

## Consuming Services: Client Objects

Client applications consume network services. Therefore, Ballerina provides client objects to allow a program to interact with remote network services using remote methods.

Here's a small example of a Ballerina function that acts as an email client and sends an email message.

```
import ballerina/email;

function mailDemo() returns error? {
     
    email:SmtpClient sc = check new("smtp.example.com",
                                    "user123@example.com",
                                    "Passwd123"
                                   );
    check sc->sendEmailMessage({
                                to: "jjc@jclark.com",
                                subject: "Ballerina"
                                body: "I love Ballerina!"
                               });
}
```

In the above code example, the client object **``sc``** represents a client class *SmtpClient*. In this case, the client object is an email service whose connection parameters are passed to ``new`` while creating the object.

The client object **``sc``** calls a remote method **``sendEmailMessage()``** with the `‘->’` call syntax. This notation signifies that it is a remote call to a network service. It augurs well with the sequence diagram view of the application and provides a syntactically distinguished view for better readability.

Remote method calls have some restrictions. For example, they are not allowed in deeply nested expressions. Additionally, there is a separate symbol space for these methods, and they are implicitly public.

Applications typically do not need to write client classes. Instead, these classes are either provided by the library modules or generated from some flavor of interface definition language.<br><br>

## Providing Services

Providing services is a more complex interaction with three main things involved.

The first is a service object. These objects are defined by applications and contain remote methods that are remotely accessible. It is called by a remote system. Similarly, remote methods of a client object call the remote system.

The second is a Listener object. It receives a network input and makes calls to remote methods of attached service objects. Service objects are attached to Listeners, which are registered with a module that is the third key entity in providing network services.

Modules have a lifecycle and are initialized on program startup. Post initializations, the registered listeners start up, and when the program shuts down, the registered listeners also shut down.<br><br>

## Listener Declaration

A listener declaration looks very much like a variable declaration.

```
import ballerina/http;

listener http:Listener h = new(8080);
```

This also registers the Listener with the enclosing module. If the ``new`` returns an error, the module initialization fails and exits with an error at runtime.<br><br>

## Module Lifecycle

As mentioned earlier, all modules have a life cycle, so let's understand a few aspects of the life cycle.

During initialization, all module listeners are registered. The initialization sequence is ordered such that if module A imports module B, then module A is initialized after module B. The initialization phase ends by calling the main function.

If there are registered listeners in a module, the module initialization phase is followed by the listening phase. The listening phase begins by calling the start method on each registered listener. It ends when the program is terminated with a signal (for example, SIGINT or SIGTERM). This is followed by a call to either *gracefulStop* or *immediateStop* on each registered listener, depending on what kind of signal was used to terminate the program.

These life cycle related activities are built into Ballerina, and as a programmer, you do not have to handle it when writing small programs which do not deal with network services.<br><br>

## Module ``init`` Function

Modules have an *init* function, just like objects. It gets called after all other variables are initialized within the module.

```
import myService as _;

function init() {
    io:println("Hello world");
}
```

The return type of this **``init()``** function must be a subtype of error?. If the module has a main function, you can assume that the **``init()``** is called automatically before it, if defined.

Ballerina treats it as an error if a module is imported without using it. If you want to import a module because of what its initialization does, then use *``as _``* in import.

## Constructing Objects Without Classes

Ballerina allows you to construct objects even without classes. This is useful for initializing service objects.

```
var obj = object {

    function greet() returns string {
        return "Hello world";
    }
};

string greeting = obj.greet();
```

In the above code example, the ``object`` keyword is used in the expression that returns the object **``obj``**. This is called an object constructor. It has one method **``greet()``** that returns a string “Hello World”. So there is no class involved in this case.

## Service Declaration

The above pattern for creating an object directly without the involvement of classes is helpful for service declaration.

A service declaration can create a listener object directly without using the class.

```
import ballerina/udp;

service on  new udp:Listener(8080){

    remote function onDatagram(udp:Datagram dg){
   
        io.println("bytes received: ", dg.bytes.length());
    }
};
```
 
In the above code example, the listener object is created directly from **``udp:Listener``** object constructor. Subsequently, the service object is  attached with it. The body of the service object encloses the remote function onDatagram.

The type of remote object is determined by the type of Listener. So as per this example, the **``udp:Listener``** expects to get a **``onDatagram``** remote method with the **``udp:Datagram``** object.  

The above code can also be written in a desugared way by having the service created with object declaration, and explicitly attaching it with the listener.

```
listener udp:Listener u = new(8080);

var obj = service object {
    remote function onDatagram(Datagram dg){. . .}
}

function init(){
    u.attach(obj);
}
```

## Representing Responses

Traditionally, all network protocols use a standard request-response pattern. In Ballerina  when a client remote method makes a request, the return value of the method provides a response. Similarly, when the service remote method is invoked, the return value of the method provides the response.

However, there are two limitations to this approach. Firstly, the application has no control over the error handling while sending a response. Moreover, this approach supports only one response.

A more flexible approach is to include a client object as a parameter in the service's remote method, representing the caller. In this way, the service object's remote method responds by making remote calls on the client object via this parameter.<br><br>

## Resource Concept

Similar to remote methods, service objects have another concept called resources.

Resources expose services in a RESTful way, whereas remote methods expose services in a procedural manner. In addition, resources represent entities that are referred to with nouns, whereas methods are more like verbs or actions.

Resources enable a data-oriented approach to exposing the service interface. They are motivated by HTTP but generic enough to work with newer formats like GraphQL.<br><br>

## Resources

In Ballerina, you can define a resource method to a service object.

```
service / on new http:Listener(8080) {

    resource function get hello(string name) returns string {
        return "Hello, " + name;
    }
}
```

This is an example of a resource method. Instead of ``remote``, it uses the ``resource`` keyword, and the definition has two parts, **``get``** and **``hello``**. **``get``** is the accessor for the resource, which represents the HTTP method in this case. **``name``** is the resource name. This is similar to the getter and setter methods in object oriented programming, but generalized for network-oriented programming.

So this service object defines a resource *“/hello”* with a query parameter **``name``**.<br><br>

## Hierarchical Resources

Resources are hierarchical. They have a path, which consists of a base path and multiple segments.

```
service /demo on new http:Listener(8080) {
  
  resource function get greeting/hello(string name) returns string 
  {        
    return "Hello, " + name;
  }

}
```

In the above code example, the service object is attached to the HTTP listener with the base resource path *“/demo”* , and defines a resource method *“greeting/hello”*. Thus, the actual resource path exposed by this service to the external world is a combination of the base path and resource path, which is *“/demo/greeting/hello”*.

A single listener can have multiple services attached to it, each with different base paths.<br><br>

## Resource Path Parameters

The resource paths can also be parameterized such that instead of having fixed, static paths, they can be dynamically assigned during the service invocation.  

```
// GET /demo/greeting/James would return "Hello, James"
service /demo on new http:Listener(8080) {

    resource function get greeting/[string name]() returns string {

        return "Hello, " + name;

    }

}
```

In this case, the fixed resource path is *"/demo/greeting"* followed by a parameterized segment defined within `'[ ]'` in the resource method. This arrangement is similar to how HTTP resources are defined with parameterized path segments for RESTful services.<br><br>

## Hierarchical Services

Like hierarchical resources, you can also have hierarchical service objects.

The path of the resource method becomes the base path of the service object. This is somewhat like the mount path in a UNIX filesystem mount point.

Root service is a special case that dispatches the sub services that are returned by the resource methods. This way, you achieve hierarchical services starting from the root service.

This hierarchical arrangement of services aligns well with the concept of GraphQL, wherein you have a graph of objects, and a service object represents each GraphQL object, and the field within the objects becomes the resources in Ballerina.<br><br>

## Plain Data

Let’s now take a look at the network data. This is the data that is independent of any specific code operating on the data. This data is typically exchanged through network interfaces between programs. In Ballerina, this is known as plain data.

This concept is the opposite of objects, which combine data and code as one entity. But when you are writing network interfaces, you want to work with plain data. It supports a bunch of operations such as deep copy and deep equality checks. You can also serialize and deserialize it without worrying about coupling between the data and its associated code, like objects.

As a programming language designed for network programming over the cloud, Ballerina makes it easy to work with plain data, and it defines a different type for it.<br><br>

## Ballerina Basic Types

If you categorize all the types of data supported by Ballerina, it is easier for you to know whether they are plain data.

Broadly, all Ballerina values belong to exactly one basic type which are of four kinds. These are, simple types, sequences, structures, and behavioral.

Simple types are nil, boolean, integers, floating points, and decimal. These are always plain data.

Sequence types are string and xml. These are also plain data always.

Structural types are array, map, record, tuple, and table. These are plain data only if their members are plain data.

And finally, the behavioral types include function, object, error, stream, typedesc, handle. These are not plain data.<br><br>

## ``decimal`` Type

Ballerina supports one more numeric data type like integers and floating points, which is called decimal. However, it does not support implicit conversion.  

You can use the ``decimal`` keyword to declare a decimal variable.

```
function floatSurprise() {

    float f = 100.10 - 0.01;
    // will print 100.08999999999999
    io:println(f);

}

decimal nanos = 1d/1000000000d;
```

A decimal number represents a decimal fraction exactly. That means that the precisions are preserved, unlike in floating point numbers. For example, a decimal value of 2.1 kg is not the same as 2.10 kg. You can use a literal character `‘d’` to indicate a decimal number, and similarly `‘f’` for float.

Decimal numbers are not the same as binary floating point numbers defined as per IEEE standard. They are not built into the ALU logic on the processor. Therefore their computation is slower yet more accurate and precise.

In Ballerina, decimal numbers do not offer infinite precision. It is limited to 34 digits only, which is more than enough for representing large physical measurements, such as the universe's age, which takes 27 digits. Additionally, decimal numbers do not support infinity, NaN, or negative zero.<br><br>

## Plain Data Basic Types To Come

Ballerina supports two more plain data types that we have not covered yet.

The first one is the table.  It is designed to work with arrays and maps. It contains an array of records. It provides random access based on a key, which is a concept similar to relational databases. The keys are stored in fields of records, and these fields are immutable.

The second one is the XML type. It is a sequence type built on a sequence of XML items like elements, text, processing instructions, comments. It is a similar concept to strings and XQuery. XML attributes are represented by *map\<string>* and it supports writing XML literals using XML syntax.<br><br>

## Immutability

One of the crucial features of plain data is that it can be made immutable. You cannot do that for objects. Plain data consisting of simple and string values are inherently immutable.

Structural values can be constructed either as mutable or immutable. The value includes a flag that indicates whether it's immutable or not and it is fixed at the time of construction of the value. Attempting to mutate an immutable structure causes a panic at runtime.

Ballerina's notion of immutability is deep. This means that if you have an immutable structure, all its members have to be immutable. This also makes it safer to pass immutable values to other threads for concurrent access.<br><br>

## ``anydata`` Type

You can use ``anydata`` keyword to define plain data.

```
anydata x1 = [1, "string", true];
```

It is a subtype of any. `‘==’` and `‘!=’`  operators on anydata test for deep equality.

You can clone anydata using the **``clone( )``** function.

```
anydata x2 = x1.clone();
```

This returns a new anydata **``x2``**, with the same mutability as **``x1``**. There is another function **``cloneReadOnly( )``** that returns an immutable deep copy. Both the functions do not copy the immutable part of the anydata variable. This ensures that the clone operations are safe for concurrency.  

anydata also allows boolean comparison and ``const``.

```
boolean eq = (x1 == x2);

const RED = {R: 0xFF, G: 0, B: 0};
```

The equality operation also takes care of cycles within anydata structure values.<br><br>

## Configurable Variables

Ballerina also has a concept of a configurable variable. A module level variable can be declared as configurable. This is useful when some of the application code is defined just to configure things. You can use the ``configurable`` keyword in this case.

```
configurable int port = 8080;
```

The initializer of a configurable variable can be overridden in runtime. A variable where configuration is required can use an initializer `‘?’`.

```
configurable string password = ?;
```

A configurable variable must be a subtype of anydata.<br><br>

## Optional Fields

Ballerina’s type system is unique from other programming languages because it describes data both in program memory as well as in the wire. This is especially relevant for the cloud era, where more applications use APIs which provide network interfaces to a different system to send and receive data on the wire.  

Therefore, Ballerina's type system design is based on defining a data type interface that works consistently across the memory buffers of the process in which the data is processed and in the network.

To facilitate this requirement, the typing system needs to do a few things differently than the regular type system. It must be flexible, like a schema language. And one of the ways it is done in Ballerina is by using optional fields.

You can define a record with an optional field.

```
type Headers record {
   string 'from;
   string to;

   // Records can have optional fields
   string subject?;

};
```

In the above type declaration, the record Headers has three fields. The field subject is suffixed with `‘?’` , which tells the compiler that it is an optional field. Thus, you can define a variable of type Headers with or without the optional field.

```
Headers h = {

    from: “John”,
    to: “Jill”

};

string? Subject = h?.subject;  
```

You can use `‘?.’` to access the optional field. It will return Nil if the field is not present.
This feature is handy for describing the type of data payloads transferred across network interfaces that typically contain mandatory and optional fields.<br><br>

## Open Records

Open records is another concept that is important for dealing with network interfaces. By default, a record type declared in Ballerina is open. This means that you can add more fields to it than those specified.

```
type Person record {
    string name;
};

type Employee record {
    string name;
    int id;
};

Employee e = {
    name: "James", id: 10
};

Person p = e;

Person p2 = {
    name: "John", "country": "UK"
};
```

In the above code example, the record type **``Person``** and **``Employee``** are declared initially.  **``Person``** has a string field **``name``**, yet, **``p2``** is initialized with another field, “country”. This field is of type anydata since it was not specified initially. It is important to put the unspecified fields within quotes.

Similarly, the **``Person p``** also accepts the variable **``e``**, which is of **``Employee``** type. In this case, the field **``id``** is treated as anydata within **``p``**.  In this way, Ballerina allows a record to be open such that additional unspecified fields can be added in runtime.

An open record is equivalent to *map\<anydata>* where the key is anydata that is referring to any field within the record.<br><br>

## Controlling Openness

If you do not want to allow the open behavior in records, Ballerina has a special syntax.

```
type Coord record {|
    float x;
    float y;
|};

Coord x = { x: 1.0, y: 2.0 };

map<float> m1 = x;
```

In the above code example, using a `‘{|’` and `‘|}’` delimiter indicates that the record is closed. The record type **``Coord``** has two closed fields **``x``** and **``y``** of float type. So you can also treat it as a map of float.  

You can also use a `‘...’` notation to allow other fields of the same type T within a record.

```
type Headers record {|
    string 'from;
    string to;
    string...;
|};

Headers h = {
    'from: "Jane", to: "John"
};


map<string> m2 = h;
```

If you have an open record, then additional fields of anydata can be added. But otherwise, use *T…* to allow other fields of type T. Therefore *``map<T>``* is same as *``record {| T. . . ; |}``*.

## ``json`` Type

Ballerina defines another type ``json``.

```
json j = { "x": 1, "y": 2 };
```

``json`` type is a union of ``( ) | boolean | int | float | decimal | string | json[ ] | map<json>`` .  

A ``json`` value can be converted to and from JSON format in a straightforward way, except for the numeric types in Ballerina, which are not natively available in JSON specification.

```
string s = j.toJsonString();

json j2 = check value:fromJsonString(s);

json j3 = null;
```

Ballerina also allows the use of ``null`` keyword instead of `‘( )’` for the sake of JSON compatibility. The LangLib provides a few functions like **``toJson()``** and **``fromJson()``** to recursively convert between ``anydata`` and ``json``.  In that case, the table values are converted to arrays, and XML values are converted to strings.

``json`` is basically ``anydata`` but without ``table`` and ``xml``. ``json`` and ``xml`` types are not parallel.<br><br>

## Working with JSON: Two Approaches

Ballerina allows two approaches to work with JSON data.

The first approach enables you to work with ``json`` value directly.  This is easy since valid JSON data is also a legitimate Ballerina syntax.

Additionally, it is also possible to convert from JSON to application specific type as a second approach. For example, you can convert from JSON to a user-defined subtype of anydata, process that data in an application specific subtype, and convert it back to JSON.

The second approach is something where Ballerina really shines compared to other languages because it is very hard to translate between JSON and the native types in other languages.<br><br>

## Working with JSON Directly

Working directly with JSON data is easy with the use of json type.

```
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

You can define any ``json`` structure like **``j``** and access its fields using  **``j.x``** or **``j?.x``** to check for nil.  The json field values are implicitly converted to unstructured types.  

Ballerina supports runtime checking of the ``json`` structure to raise runtime errors using the ``check`` expression. This gives a feel of working with a dynamic language where the JSON structure is unknown at compile time. Additionally, LangLib functions are also provided to check for types explicitly.

```
string s = check value:ensureType(v, string);
```

## ``match`` Statements with Maps

``json`` values can be used in a ``match`` statement to provide flexible pattern matching based on the fields in the ``json`` structure.

```
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

In the above code example, the ``match`` expression uses the json value **``j``**. The interesting thing is that the match pattern also binds to a variable **``x``** used within the code for additional processing. In this way, you can directly use ``json`` structure within the control flow of your program.

``match`` schematics are open, and you do not have to specify all the fields of the ``json`` value in the pattern for matching.<br><br>

## Converting from User-defined Types to JSON

A user-defined type can be easily converted to JSON. In this case, there are two possibilities.

For types that are closed, the conversion is implicit.

```
type ClosedCoord record {|
    float x;
    float y;
|};

Coord coord = { x: 1.0, y: 2.0 };

json j = coord;
```

In the case of open types, things are a bit complicated. For that purpose, LangLib provides functions to make your work easier.

```
type Coord record {
    float x;
    float y;
};

json j = coord.toJson();
```

In the above code example, **``Coord``** is an open record.  Therefore any number of ``anydata`` fields can be added to it, including tables and xml. The **``toJson( )``** function converts ``anydata`` to ``json``, such that all the sub-types, including tables and xml are handled appropriately.<br><br>

## Converting from JSON to User-defined Type

There are a few nuances involved in converting from JSON to user-defined type.

One obvious mechanism is typecasting.

```
type Coord record {
    float x;
    float y;
};

json j = { x: 1.0 , y; 2.0 };

//Runtime error
Coord c = <Coord>j
```

However, this does not work because the json fields can be later assigned to something other than float, and therefore the typecasting operation would not be type safe.  This goes back to the concept of covariance you learned earlier that limits mutation on type structures with inherent types. Therefore you can only create a read-only copy, and use it in the type cast expression.

```
Coord c = <Coord>j.cloneReadOnly( );
```

## Converting to User-defined Type: cloneWithType

There is another way of converting from JSON to a user-defined type.

```
type Coord record {
    float x;
    float y;
};

json j = {x: 1.0, y: 2.0};

Coord c = check j.cloneWithType(Coord);
```

In the above example, the function **``cloneWithType( )``** uses the typedesc argument **``Coord``** as inherent type, and works recursively to clone every part of the valve, including immutable structural values.

This is a LangLib function. You can also use the function without the argument from lang.value.

```
Coord c = check j.cloneWithType();
```

In this case, the argument is implicitly obtained from the context.<br><br>

## Resource Method Typing

The features of JSON to user-defined type conversion and vice versa are advantageous when you write the service object in Ballerina.

Here is a code that defines a service for a calculator API with the add endpoint.

```

import ballerina/http;

type Args {|
    decimal x;
    decimal y;
|};

listener h = new http:Listener(9090);

service /calc on h {
    resource function post add(@http:Payload Args args) returns decimal {
            return args.x + argos.y;
    }
}
```

In the above code example, **``Args``** is a closed record. It is passed as an argument to the resource function for performing the HTTP POST operation whenever the API */calc/add* is triggered.

Thanks to the implicit data binding and conversion feature of Ballerina, the JSON payload coming in the wire as part of the HTTP request is converted to the **``Args``** record, using **``cloneWithType( )``**. Therefore its fields **``x``** and **``y``** are readily accessible. The return value of the resource function is a decimal type which is a subtype of anydata and is mapped to the protocol format in the wire, which in most cases is JSON.  This is how Ballerina types can be used to describe data on the wire, or on network interfaces.

Annotations added to this code also helps in refining the mapping between Ballerina-declared type and wire format. Further, the service declaration can also be used to generate OpenAPI spec.<br><br>

## JSON Numbers

There is one complication in dealing with JSON in Ballerina. This is because Ballerina allows the json type to have a union of integer, floating point number, and decimal. Whereas the JSON specification only has one numeric type. It does not distinguish between integers and floating point numbers.

While converting from Ballerina’s numeric types to JSON, using the **``toJsonString( )``** converts the Ballerina’s integer, floating point and decimal types to the JSON numeric syntax. This is straightforward.

But converting from JSON to Ballerina’s numeric types requires additional interpretation. The **``fromJsonString( )``** converts JSON numeric syntax into integer type, if possible, and decimal otherwise, to preserve the number precision of the numeric data in JSON. This is the case in which you do not have any type information. Subsequently, you can use **``cloneWithType( )``** or **``ensureType( )``** to convert from integer or decimal to the user’s chosen numeric type.  

The net result is the same, and you can convert between JSON and Ballerina’s numeric types across the full range of all values. But based on how far you go in the conversion process within the program, the types will be dependent based on that. The one exception to this conversion is -0. It is an edge case and represented as float type.