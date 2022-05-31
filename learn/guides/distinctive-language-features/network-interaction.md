---
layout: ballerina-distinctive-language-features-left-nav-pages-swanlake
title: Network interaction
description: In this part, you will learn about the features of the Ballerina programming language that are distinctive. These features revolve around key design considerations that make Ballerina suitable for cloud application programming using small and medium-sized programs.
keywords: ballerina, programming language, ballerina packages,language-guide
permalink: /learn/distinctive-language-features/network-interaction/
active: network-interaction
intro: In this part, you will learn about the features of the Ballerina programming language that are distinctive. These features revolve around key design considerations that make Ballerina suitable for cloud application programming using small and medium-sized programs.
redirect_from:
- /learn/distinctive-language-features/what-makes-ballerina-distinctive
- /learn/distinctive-language-features/what-makes-ballerina-distinctive/
- /learn/distinctive-language-features/
- /learn/distinctive-language-features
- /learn/distinctive-language-features/network-interaction
---

Ballerina aims to be as pragmatic as possible by taking cues from existing patterns used in programming. It models cloud-era applications that make heavy use of network interaction, network data, and concurrency. In addition, Ballerina focuses on providing integration that acts like glue for orchestrating other programs and ensures reliability and maintainability while also assuring moderate cognitive load on programmers.

Ballerina’s genesis is based on the evolving trends in programming on the cloud. In the pre-cloud era, programming was more about reading/writing files, invoking system calls, and library functions. It also did not have much to do in terms of concurrency, as most programs were standalone desktop applications. However, now in the cloud era, files are replaced by network services, and system calls/libraries are replaced by web APIs. Additionally, concurrency is pervasive with expectations to scale and elasticity. Ballerina’s feature set takes into account these evolutionary trends such that these are incorporated in the core of the language.

Individually these features may not stand out. However, it is the combination of them in specific programming scenarios that make them distinctive.

This and the subsequent two parts will talk about these features. Let’s start with network interaction. The two fundamental operations in any network interaction are consuming services and providing services.

## Consume services - client objects

Client applications consume network services. Therefore, Ballerina supports defining client objects to allow a program to interact with remote network services using remote methods.

Here is a small example of a Ballerina function that uses as an email client and sends an email message.

```ballerina
import ballerina/email;

function mailDemo() returns error? {

    email:SmtpClient sc = check new ("smtp.example.com",
                                    "user123@example.com",
                                    "Passwd123");
    check sc->sendMessage({
        to: "contact@ballerina.io",
        subject: "Ballerina",
        body: "I love Ballerina!"
    });
}
```

In the above code example, the client object **``sc``** belongs to a client class **``SmtpClient``**. The connection parameters are passed to ``new`` when creating the object.

The **``sendMessage()``** remote method is called on the client object **``sc``** with the ``->`` call syntax. This notation signifies that it is a remote call to a network service. It augurs well with the sequence diagram view of the application and provides a syntactically distinguished view for better readability.

Remote method calls have some restrictions. For example, they are not allowed in deeply nested expressions. Additionally, there is a separate symbol space for these methods, and they are implicitly public.

Applications typically do not need to write client classes. Instead, these classes are either provided by the library modules or generated from some flavor of interface definition language.

## Provide services

Providing services is a more complex interaction with three main things involved.

The first is a service object. These objects are defined by applications and contain remote methods that are remotely accessible. It is called by a remote system. Similarly, remote methods of a client object call the remote system.

The second is a Listener object. It receives network input and makes calls to remote methods of attached service objects. Service objects are attached to Listeners, which are registered with a module that is the third key entity in providing network services.

Modules have a lifecycle and are initialized on program startup. Post initializations, the registered listeners are started up, and when the program shuts down, the registered listeners are also shut down.

## Listener declaration

A listener declaration looks very much like a variable declaration.

```ballerina
import ballerina/http;

listener http:Listener h = new (8080);
```

This also registers the Listener with the enclosing module. If the ``new`` expression returns an error, the module initialization fails and exits with an error at runtime.

## Module lifecycle

As mentioned earlier, all modules have a lifecycle, so let's understand a few aspects of the lifecycle.

During initialization, all module listeners are registered. The initialization sequence is ordered such that if module ``A`` imports module ``B``, then module ``A`` is initialized after module ``B``. The initialization phase ends by calling the ``main`` function if present.

If there are registered listeners in a module, the module initialization phase is followed by the listening phase. The listening phase begins by calling the start method on each registered listener. It ends when the program is terminated with a signal (for example, SIGINT or SIGTERM). This is followed by a call to either *gracefulStop* or *immediateStop* on each registered listener, depending on what kind of signal was used to terminate the program.

These lifecycle-related activities are built into Ballerina, and as a programmer, you do not have to handle them when writing small programs which do not deal with network services.

## Module ``init`` function

Modules have an *init* function, just like objects. It gets called after all the other variables within the module are initialized.

```ballerina
import ballerina/io;
import myService as _;

function init() {
    io:println("Hello world");
}
```

The return type of this **``init()``** function must be a subtype of ``error?``. If the module has a ``main`` function, you can assume that the **``init()``** is called automatically before it, if defined.

Ballerina considers it an error to import a module and not use it. If you want to import a module because of what its initialization does, then use *``as _``* in the import declaration.

## Construct objects without classes

Ballerina allows you to construct objects even without classes. This is useful for initializing service objects.

```ballerina
var obj = object {

    function greet() returns string {
        return "Hello world";
    }
};

string greeting = obj.greet();
```

In the above code example, the ``object`` keyword is used in the expression that initializes the **``obj``** variable. This is called an object constructor. It has one method **``greet()``** that returns a string ``"Hello World"``. So there is no class involved in this case.

## Service declaration

The above pattern for creating an object directly without the involvement of classes is helpful for service declarations.

A service declaration can create a service object directly without using the class.

```ballerina
import ballerina/io;
import ballerina/udp;

service on new udp:Listener(8080) {

    remote function onDatagram(udp:Datagram & readonly dg) {
        io:println("bytes received: ", dg.data.length());
    }
}
```
 
In the above code example, a service object is created and attached to a ``udp:Listener`` initialized in-line. The body of the service declaration, which is an object constructor block, defines the ``onDatagram`` remote method.

The type of service object is determined by the type of the listener. So as per this example, the **``udp:Listener``** expects a ``udp:Service`` service object with an **``onDatagram``** remote method that accepts a parameter of type **``udp:Datagram & readonly``**.  

The above code can also be written in a desugared way by having the service object created using an object constructor, and explicitly attaching it to the listener.

```ballerina
import ballerina/io;
import ballerina/udp;

listener udp:Listener u = new (8080);

udp:Service obj = service object {
    remote function onDatagram(udp:Datagram & readonly dg) {
        io:println("bytes received: ", dg.data.length());
    }
};

function init() returns error? {
    check u.attach(obj);
}
```

## Represent responses

Traditionally, all network protocols use a standard request-response pattern. In Ballerina when a client remote method makes a request, the return value of the method provides a response. Similarly, when the service remote method is invoked, the return value of the method provides the response.

However, there are two limitations to this approach. Firstly, the application has no control over the error handling while sending a response. Moreover, this approach supports only one response.

A more flexible approach is to include a client object as a parameter in the service's remote method, representing the caller. This way, the service object's remote method responds by making remote calls on the client object via this parameter.

## Resource concept

Similar to remote methods, service objects have another concept called resources.

Resources expose services in a RESTful way, whereas remote methods expose services in a procedural manner. In addition, resources represent entities that are referred to with nouns, whereas remote methods are more like verbs or actions.

Resources enable a data-oriented approach to expose the service interface. They are motivated by HTTP but generic enough to work with newer formats like GraphQL.

## Resources

In Ballerina, you can define a resource method in a service object.

```ballerina
import ballerina/http;

service on new http:Listener(8080) {

    resource function get hello(string name) returns string {
        return "Hello, " + name;
    }
}
```

This is an example of a resource method. Instead of ``remote``, it uses the ``resource`` keyword, and the definition has two parts, **``get``** and **``hello``**. **``get``** is the accessor for the resource, which represents the HTTP method in this case. **``hello``** is the resource name. This is similar to the getter and setter methods in object-oriented programming but generalized for network-oriented programming.

So this service object defines a resource **``/hello``** with a query parameter **``name``**.

## Hierarchical resources

Resources are hierarchical. They have a path, which consists of a base path and multiple segments.

```ballerina
service /demo on new http:Listener(8080) {

    resource function get greeting/hello(string name) returns string {
        return "Hello, " + name;
    }
}
```

In the above code example, the service object is attached to the HTTP listener with the base resource path **``/demo``** and defines a resource method **``greeting/hello``**. Thus, the actual resource path exposed by this service to the external world is a combination of the base path and resource path, which is **``/demo/greeting/hello``**.

A single listener can have multiple services attached to it, each with different base paths.

## Resource path parameters

The resource paths can also be parameterized such that instead of having fixed, static paths, they can be dynamically assigned during the service invocation.  

```ballerina
// GET /demo/greeting/James would return "Hello, James"
service /demo on new http:Listener(8080) {

    resource function get greeting/[string name]() returns string {
        return "Hello, " + name;
    }
}
```

In this case, the fixed resource path is **``/demo/greeting``** followed by a parameterized segment defined within `'[ ]'` in the resource method. This arrangement is similar to how HTTP resources are defined with parameterized path segments for RESTful services.

## Hierarchical services

Like hierarchical resources, you can also have hierarchical service objects.

The path of the resource method becomes the base path of the service object. This is somewhat like the mount path in a UNIX filesystem mount point.

The root service is a special case that dispatches to the sub services that are returned by the resource methods. This way, you achieve hierarchical services starting from the root service.

This hierarchical arrangement of services aligns well with the concept of GraphQL, wherein you have a graph of objects, and a service object represents each GraphQL object, and the fields within the objects become the resources in Ballerina.
 
