---
layout: ballerina-distinctive-language-features-left-nav-pages-swanlake
title: Network Interaction
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

Ballerina’s genesis is based on the evolving trends in programming on the cloud. In the pre-cloud era, programming was more about reading/writing files, invoking system calls, and library functions. It also did not have much to do in terms of concurrency, as most programs were standalone desktop applications. However, now in the cloud era, files are replaced by network services and system calls/libraries are replaced by web APIs. Additionally, concurrency is pervasive with expectations to scale and elasticity. Ballerina’s feature set takes into account these evolutionary trends such that these are incorporated in the core of the language.

Individually these features may not stand out. However, it is the combination of them in specific programming scenarios that make them distinctive.

This and the subsequent two parts will talk about these features. Let’s start with network interaction. The two fundamental operations in any network interaction are consuming services and providing services.

## Consuming Services - Client Objects

Client applications consume network services. Therefore, Ballerina provides client objects to allow a program to interact with remote network services using remote methods.

Here's a small example of a Ballerina function that acts as an email client and sends an email message.

```ballerina
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

Applications typically do not need to write client classes. Instead, these classes are either provided by the library modules or generated from some flavor of interface definition language.

## Providing Services

Providing services is a more complex interaction with three main things involved.

The first is a service object. These objects are defined by applications and contain remote methods that are remotely accessible. It is called by a remote system. Similarly, remote methods of a client object call the remote system.

The second is a Listener object. It receives a network input and makes calls to remote methods of attached service objects. Service objects are attached to Listeners, which are registered with a module that is the third key entity in providing network services.

Modules have a lifecycle and are initialized on program startup. Post initializations, the registered listeners start up, and when the program shuts down, the registered listeners also shut down.

## Listener Declaration

A listener declaration looks very much like a variable declaration.

```ballerina
import ballerina/http;

listener http:Listener h = new(8080);
```

This also registers the Listener with the enclosing module. If the ``new`` returns an error, the module initialization fails and exits with an error at runtime.

## Module Lifecycle

As mentioned earlier, all modules have a life cycle, so let's understand a few aspects of the life cycle.

During initialization, all module listeners are registered. The initialization sequence is ordered such that if module A imports module B, then module A is initialized after module B. The initialization phase ends by calling the main function.

If there are registered listeners in a module, the module initialization phase is followed by the listening phase. The listening phase begins by calling the start method on each registered listener. It ends when the program is terminated with a signal (for example, SIGINT or SIGTERM). This is followed by a call to either *gracefulStop* or *immediateStop* on each registered listener, depending on what kind of signal was used to terminate the program.

These life cycle related activities are built into Ballerina, and as a programmer, you do not have to handle it when writing small programs which do not deal with network services.

## Module ``init`` Function

Modules have an *init* function, just like objects. It gets called after all other variables are initialized within the module.

```ballerina
import myService as _;

function init() {
    io:println("Hello world");
}
```

The return type of this **``init()``** function must be a subtype of error?. If the module has a main function, you can assume that the **``init()``** is called automatically before it, if defined.

Ballerina treats it as an error if a module is imported without using it. If you want to import a module because of what its initialization does, then use *``as _``* in import.

## Constructing Objects Without Classes

Ballerina allows you to construct objects even without classes. This is useful for initializing service objects.

```ballerina
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

```ballerina
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

```ballerina
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

A more flexible approach is to include a client object as a parameter in the service's remote method, representing the caller. In this way, the service object's remote method responds by making remote calls on the client object via this parameter

## Resource Concept

Similar to remote methods, service objects have another concept called resources.

Resources expose services in a RESTful way, whereas remote methods expose services in a procedural manner. In addition, resources represent entities that are referred to with nouns, whereas methods are more like verbs or actions.

Resources enable a data-oriented approach to exposing the service interface. They are motivated by HTTP but generic enough to work with newer formats like GraphQL.

## Resources

In Ballerina, you can define a resource method to a service object.

```ballerina
service / on new http:Listener(8080) {

    resource function get hello(string name) returns string {
        return "Hello, " + name;
    }
}
```

This is an example of a resource method. Instead of ``remote``, it uses the ``resource`` keyword, and the definition has two parts, **``get``** and **``hello``**. **``get``** is the accessor for the resource, which represents the HTTP method in this case. **``name``** is the resource name. This is similar to the getter and setter methods in object oriented programming, but generalized for network-oriented programming.

So this service object defines a resource *“/hello”* with a query parameter **``name``**.

## Hierarchical Resources

Resources are hierarchical. They have a path, which consists of a base path and multiple segments.

```ballerina
service /demo on new http:Listener(8080) {
  
  resource function get greeting/hello(string name) returns string 
  {        
    return "Hello, " + name;
  }

}
```

In the above code example, the service object is attached to the HTTP listener with the base resource path *“/demo”* , and defines a resource method *“greeting/hello”*. Thus, the actual resource path exposed by this service to the external world is a combination of the base path and resource path, which is *“/demo/greeting/hello”*.

A single listener can have multiple services attached to it, each with different base paths.

## Resource Path Parameters

The resource paths can also be parameterized such that instead of having fixed, static paths, they can be dynamically assigned during the service invocation.  

```ballerina
// GET /demo/greeting/James would return "Hello, James"
service /demo on new http:Listener(8080) {

    resource function get greeting/[string name]() returns string {

        return "Hello, " + name;

    }

}
```

In this case, the fixed resource path is *"/demo/greeting"* followed by a parameterized segment defined within `'[ ]'` in the resource method. This arrangement is similar to how HTTP resources are defined with parameterized path segments for RESTful services.

## Hierarchical Services

Like hierarchical resources, you can also have hierarchical service objects.

The path of the resource method becomes the base path of the service object. This is somewhat like the mount path in a UNIX filesystem mount point.

Root service is a special case that dispatches the sub services that are returned by the resource methods. This way, you achieve hierarchical services starting from the root service.

This hierarchical arrangement of services aligns well with the concept of GraphQL, wherein you have a graph of objects, and a service object represents each GraphQL object, and the field within the objects becomes the resources in Ballerina.
 