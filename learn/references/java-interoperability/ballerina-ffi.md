---
layout: ballerina-java-interoperability-left-nav-pages-swanlake
title: Ballerina FFI
description: The reference guide on the list of language features that enable Ballerina developers to call foreign code written in other programming languages.
keywords: ballerina, programming language, ffi, foreign function invocation
permalink: /learn/java-interoperability/ballerina-ffi/
active: ballerina-ffi
intro: The reference guide on the list of language features that enable Ballerina developers to call foreign code written in other programming languages.
redirect_from:
  - /learn/tooling-guide/cli-tools/ballerina-ffi/
  - /learn/tooling-guide/cli-tools/ballerina-ffi
  - /learn/cli-documentation/ballerina-ffi/
  - /learn/cli-documentation/ballerina-ffi
  - /learn/cli-documentation/ballerina-ffi/
  - /learn/cli-documentation/ballerina-ffi
---

Let's look at the list of language features that enable Ballerina developers to call foreign code written in other programming languages. E.g., while the jBallerina compiler allows you to call any `Java` code, the nBallerina compiler will allow you to call any `C` Code.

## The external function body
Usually, the body or the implementation of a function is specified in the same source file. The part, which is enclosed by curly braces is called the function body.

```ballerina
function doSomething(int i) returns string {
	...
}
```

Ballerina also allows you to define a function without a function body and mark it with the `external` keyword to express that the implementation is not provided by the Ballerina source file.

```ballerina
function doSomething(int i) returns string = external;
```

Now, let’s see how you can link this function with a foreign function.

```ballerina
import ballerina/jballerina.java;

function doSomething(int i) returns string = @java:Method {
	name: "doSomethingInJava"
	'class: "a.b.c.Foo"
} external;
```

The `@java:Method` annotation instructs the jBallerina compiler to link to the `doSomethingInJava` static method in the `a.b.c.Foo` Java class. There are a set of annotations and other utilities available in the `ballerina/jballerina.java` module to make Java interoperability work that is covered in this guide.

## The handle type
The handle type describes a reference to externally-managed storage. These values can only be created by a Ballerina function with an external function body. Within the context of jBallerina, a `handle` type variable can refer to any Java reference type value: a Java object, an array, or the null value.

Consider the `randomUUID` method in the Java UUID class, which gives you a UUID object. This is the Java method signature.

```java
static UUID randomUUID()
```

Below is the corresponding Ballerina function that returns a value of the handle type.

```ballerina
import ballerina/jballerina.java;

function randomUUID() returns handle = @java:Method {
    name: "randomUUID",
    'class: "java.util.UUID"
} external;
```

In Java, you can assign the `null` value to any variable of a reference type. Therefore, a `handle` type variable may also refer to the Java `null`.

The following sections describe various aspects of Java interoperability in Ballerina. You can copy and paste the following examples into a `.bal` file and run it using the `bal run <file_name.bal>` command.

## Instantiate Java classes
Let's look at how you can create Java objects in a Ballerina program. The `@java:Constructor` annotation instructs the compiler to link a Ballerina function with a Java constructor.

The `ArrayDeque` class in the `java.util` package has a default constructor. The following Ballerina code creates a new `ArrayDeque` object. As you can see, the `newArrayDeque` function is linked with the default constructor. This function returns a handle value and refers to the constructed `ArrayDeque` instance.

```ballerina
import ballerina/jballerina.java;

public function main() {
    handle arrayDeque = newArrayDeque();
}

function newArrayDeque() returns handle = @java:Constructor {
    'class: "java.util.ArrayDeque"
} external;
```

You can also create a wrapper Ballerina class for Java classes as follows.

```ballerina
import ballerina/jballerina.java;

public function main() {
    ArrayDeque ad = new;
}

class ArrayDeque {
    private handle jObj;

    function __init(){
        self.jObj = newArrayDeque();
    }
}

function newArrayDeque() returns handle = @java:Constructor {
    'class: "java.util.ArrayDeque"
} external;
```

>**Note:** These `@java:*` annotations cannot be attached to Ballerina class methods at the moment.

### Deal with overloaded constructors
When there are two constructors with the same number of arguments available, you need to specify the exact constructor that you want to link with the Ballerina function. The `ArrayDeque` class contains three constructors and the last two are overloaded ones.

```ballerina
public ArrayDeque();
public ArrayDeque(int numElements);
public ArrayDeque(Collection<? extends E> c);
```

Below is the updated Ballerina code.

```ballerina
import ballerina/jballerina.java;

function newArrayDeque() returns handle = @java:Constructor {
    'class: "java.util.ArrayDeque"
} external;

function newArrayDequeWithSize(int numElements) returns handle = @java:Constructor {
    'class: "java.util.ArrayDeque",
    paramTypes: ["int"]
} external;

function newArrayDequeWithCollection(handle c) returns handle = @java:Constructor {
    'class: "java.util.ArrayDeque",
    paramTypes: ["java.util.Collection"]
} external;
```

#### The `paramTypes` field
You can use the `paramTypes` field to resolve the exact overloaded method. This field is defined as follows.

```ballerina
# The `Class` type represents a fully-qualified Java class name.
public type Class string;

# The `ArrayType` represents a Java array type. It is used to specify parameter
# types in the `Constructor` and `Method` annotations.
#
# + class - Element class of the array type
# + dimensions - Dimensions of the array type
public type ArrayType record {|
    Class 'class;
    byte dimensions;
|};

# Describes a Java constructor. If the `paramTypes` field is not specified,
# then the parameter types are inferred from the corresponding Ballerina function.
#
# + class - The class in which the constructor exists
# + paramTypes - An optional field, which describes the parameter types of the constructor
public type ConstructorData record {|
    Class 'class;
    (Class | ArrayType)[] paramTypes?;
|};
```

As per the above definition, `paramTypes` field takes an array of Java classes or array types. The following table contains more details.


Java type | Description | Example
--------- | ----------- | -------
Primitive | The Java class name of a primitive type is the same as the name of the primitive type.  | The `boolean.class.getName()` expression evaluates to `boolean`. Similarly, the `int.class.getName()` expression evaluates to `int`.
Class | Fully-qualified class name. | `java.lang.String`
Array | Use the `ArrayType` record defined above to specify Java array types in overloaded methods. |  The value of the `paramField` for the method signature `void append(boolean[] states, long l, String[][] args)` evaluates to `[{'class:"boolean", dimensions: 1}, "long", {'class:"java.lang.String", dimensions: 2}]`

For more details, look at the following example.

```java
public Builder(Person[][] list, int index);
public Builder(Student[][] list, int index);
```

Below is the corresponding Ballerina code.

```ballerina
import ballerina/jballerina.java;

function builderWithPersonList(handle list, int index) returns handle = @java:Constructor {
    'class: "a.b.c.Builder",
    paramTypes: [{'class: "a.b.c.Person", dimensions:2}, "int"]
} external;

function builderWithStudentList(handle list, int index) returns handle = @java:Constructor {
    'class: "a.b.c.Builder",
    paramTypes: [{'class: "a.b.c.Student", dimensions:2}, "int"]
} external;
```

## Call Java methods
You can use the `java:@Method` annotation to link Ballerina functions with Java static and instance methods. There is a minor but important difference in calling Java static methods vs calling instance methods.

### Call static methods
First look at how to call a static method. The `java.util.UUID` class  has a static method with the `static UUID randomString()` signature.

```ballerina
import ballerina/jballerina.java;
import ballerina/io;

function randomUUID() returns handle = @java:Method {
   name: "randomUUID",
   'class: "java.util.UUID"
} external;

public function main() {
   handle uuid = randomUUID();
   io:println(uuid);
}
```

The `name` field is optional here. If the Ballerina function name is the same as the Java method name, you don’t have to specify the `name` field.

```ballerina
function randomUUID() returns handle = @java:Method {
   'class: "java.util.UUID"
} external;
```

### Call instance methods
Now, look at how to call Java instance methods using the same `ArrayDeque` class in the `java.util` package. It can be used as a stack with its `pop` and `push` instance methods with the following method signatures.

```java
E pop();
void push(E e);
```

Below are the corresponding Ballerina functions that are linked to these methods.

```ballerina
function pop(handle arrayDequeObj) returns handle = @java:Method {
   'class: "java.util.ArrayDeque"
} external;

function push(handle arrayDequeObj, handle e) = @java:Method {
   'class: "java.util.ArrayDeque"
} external;
```

If you compare these functions with the Java method signatures, you would notice the additional `handle arrayDequeObj` parameter in Ballerina functions. Let’s look at a sample usage to understand the reason.

```ballerina
public function main() {
   // Create a new instance of `ArrayDeque`.
   handle arrayDequeObj = newArrayDeque();

   // Convert a Ballerina string to a Java string.
   string str = "Ballerina";
   handle handleStr = java:fromString(str);

   push(arrayDequeObj, handleStr);
   handle e = pop(arrayDequeObj);
}
```

As you can see, you need to first construct an instance of the `ArrayDeque` class. The `arrayDequeObj` variable refers to an `ArrayDeque` object. Then, you need to pass this variable to both the `pop` and `push` functions because the corresponding Java methods are instance methods of the `ArrayDeque` class. Therefore, you need an instance of the `ArrayDeque` class to invoke its instance methods. You can think of the `arrayDequeObj` variable as the method receiver.


### Call methods asynchronously

Ballerina internally uses a fixed number of threads. Therefore, when calling a Java method, it should return in a reasonable time frame to avoid starvation in the Ballerina code execution.

If the given Java method executes a time-consuming task (i.e., blocking) such as an IO operation, better to do that in a separate thread while yielding the original thread to continue the Ballerina code execution.
In this case, the Ballerina Scheduler needs to be informed that the work is being completed asynchronously by invoking the `markAsync` method in the `BalEnv` object. When the work is completed, the `complete` method has to be called with the return value.

>**Note:** The original return value is ignored.
```java
public static long getFileCountRecursively(BalEnv env, BString path) {
     BalFuture balFuture = env.markAsync();
     new Thread(() -> {
         long result = // slow operation ;
         balFuture.complete(result);
     }).start(); // in a production system this can be a thread pool/nio pool
     return -38263; // this value is ignored
 }
```

```ballerina
public function getFileCountRecursively(string path) returns int = @java:Method {
    'class:"my/test/DirOperations"
} external;
```

### Map Java classes into Ballerina classes
The following pattern is useful if you want to present a clearer Ballerina API, which calls the underneath Java code. This pattern creates wrapper Ballerina classes for each Java class that you want to expose via your API.

Imagine that you want to design an API to manipulate a stack of string values by using the Java `ArrayDeque` utility. You can create a Ballerina class as follows.

```ballerina
public class StringStack {
   private handle jObj;

   public function init() {
       self.jObj = newArrayDeque();
   }

   public function push(string element) {
       push(self.jObj, java:fromString(element));
   }

   public function pop() returns string {
       handle handleEle = pop(self.jObj);
       // Error handling and null safety are discussed later in this guide
       // This example uses an empty string for now.
       return java:toString(handleEle) ?: "";

   }
}

function newArrayDeque() returns handle = @java:Constructor {
   'class: "java.util.ArrayDeque"
} external;

function pop(handle receiver) returns handle = @java:Method {
   'class: "java.util.ArrayDeque"
} external;

function push(handle receiver, handle element) = @java:Method {
   'class: "java.util.ArrayDeque"
} external;
```

This class presents a much clearer API compared to the previous API. Below is a sample usage of this class.

```ballerina
public function main() {
   StringStack stack = new();
   stack.push("Ballerina");
   string element = stack.pop();
}
```

### Call overloaded Java methods

The [Instantiate Java Classes](/learn/java-interoperability/ballerina-ffi/#instantiate-java-classes) section presents how to deal with overloaded constructors. You need to use the same approach to deal with overloaded Java methods. Try to call the overloaded `append` methods in the `java.lang.StringBuffer` class. Below is a subset of those methods.

```java
StringBuffer append(boolean b);
StringBuffer append(int i);
StringBuffer append(String str);
StringBuffer append(StringBuffer sb);
StringBuffer append(char[] str);
```

Below is the set of Ballerina functions that are linked with the above Java methods. Notice the usage of the `paramTypes` annotation field. You can find more details of this field in the [Instantiate Java classes](/learn/java-interoperability/ballerina-ffi/#instantiate-java-classes) section.

```ballerina
function appendBool(handle sbObj, boolean b) returns handle = @java:Method {
   name: "append",
   paramTypes: ["boolean"],
   'class: "java.lang.StringBuffer"
} external;

function appendInt(handle sbObj, int i) returns handle = @java:Method {
   name: "append",
   paramTypes: ["int"],
   'class: "java.lang.StringBuffer"
} external;

function appendCharArray(handle sbObj, handle str) returns handle = @java:Method {
   name: "append",
   paramTypes: [{'class: "char", dimensions: 1}],
   'class: "java.lang.StringBuffer"
} external;

function appendString(handle sbObj, handle str) returns handle = @java:Method {
   name: "append",
   paramTypes: ["java.lang.String"],
   'class: "java.lang.StringBuffer"
} external;

function appendStringBuffer(handle sbObj, handle sb) returns handle = @java:Method {
   name: "append",
   paramTypes: ["java.lang.StringBuffer"],
   'class: "java.lang.StringBuffer"
} external;
```

## Java exceptions as Ballerina errors
A function call in Ballerina may complete abruptly by returning an error or by raising a panic. Panics are rare in Ballerina. The best practice is to handle errors in your normal control flow. Raising a panic is similar to throwing a Java exception. The `trap` action will stop a panic and give you the control back in Ballerina and the `try-catch` statement does the same in Java.

Errors in Ballerina belong to the built-in type `error`. The error type can be considered as a distinct type from all other types. The `error` type does not belong to the `any` type, which is the supertype of all other Ballerina types. Therefore, errors are explicit in Ballerina programs and it is almost impossible to ignore them. For more details, see [Ballerina By Example](https://ballerina.io/learn/by-example/).

A Java function call may complete abruptly by throwing either a checked exception or an unchecked exception. Unchecked exceptions are usually not a part of the Java method signature, unlike the checked exceptions.

Java interoperability layer in Ballerina handles checked exceptions differently from unchecked exceptions as explained below.

### Java unchecked exceptions
If the linked Java method throws an unchecked exception, then the corresponding Ballerina function will complete abruptly by raising a panic.

The following example tries to pop an element out of an empty queue. The `pop` method in the `ArrayDeque` class throws an unchecked  `java.util.NoSuchElementException` exception in such cases. This exception will cause the Ballerina `pop` function to raise a panic.

```ballerina
import ballerina/jballerina.java;

function newArrayDeque() returns handle = @java:Constructor {
   'class: "java.util.ArrayDeque"
} external;

function pop(handle receiver) returns handle = @java:Method {
   'class: "java.util.ArrayDeque"
} external;

public function main() {
   handle arrayDeque = newArrayDeque();
   handle element = pop(arrayDeque);
}
```

Below is the output:

```
error: java.util.NoSuchElementException
	at array_deque:pop(array_deque.bal:65535)
	   array_deque:main(array_deque.bal:13)
```

You can use the `trap` action to stop the propagation of the panic and to get an `error` value.

```ballerina
public function main() {
   handle arrayDeque = newArrayDeque();
   handle | error element = trap pop(arrayDeque);
   if element is error {
       io:println(element.message());
       io:println(element.detail());
       io:println(element.stackTrace().callStack);
   } else {
       // .....
   }
}
```
### Java checked exceptions
Below, you can see how to call a Java method that throws a checked exception. As illustrated in the following example, the corresponding Ballerina function should have the `error` type as part of its return type.

The `java.util.zip.ZipFile` class is used to read entries in a ZIP file. There are many constructors in this class. Here, the constructor that takes the file name as an argument is used.

```java
public ZipFile(String name) throws IOException
```

Since this Java constructor throws a checked exception,  the `newZipfile` Ballerina function returns `ZipFile` instances or an error.

```ballerina
import ballerina/jballerina.java;

function newZipFile(handle filename) returns handle | error = @java:Constructor {
   'class: "java.util.zip.ZipFile",
   paramTypes: ["java.lang.String"]
} external;

public function main() {
   handle|error zipFile = newZipFile(java:fromString("some_file.zip"));
}
```

### Map a Java exception to a Ballerina error value
Now, look at how a Java exception is converted to a Ballerina error value at runtime. A Ballerina error value contains three components: a message, a detail, and a stack trace.

The `message`:
- This is a string identifier for the error category.
- In this case, the message value is set to the fully-qualified Java class name of the exception.
    - **Unchecked:** Class name of of the thrown unchecked exception
    - **Checked:** Class name of the exception that is declared in the method signature

The `detail`:
- The `message` field is set to `e.getMessage()`.
- The `cause` field is set to the Ballerina error that represents this Java exception’s cause.

The `stack trace`:
- An object representing the stack trace of the error value.
- The first member of the array represents the top of the call stack.

## Null safety
Ballerina provides strict null safety compared to Java with optional types. The Java null reference can be assigned to any reference type. However, in Ballerina, you cannot assign the nil value to a variable unless the variable’s type is optional.

As explained above, Ballerina handle values cannot be created in the Ballerina code. They are created and returned by foreign functions and a variable of the handle type refers to a Java reference value. Since, Java null is also a valid reference value, this variable can refer to a Java null value.

An example Ballerina code is given below that deals with Java null. It uses the `peek` method in the `ArrayDeque` class. `Peek` retrieves but does not remove the head of the queue or returns null if the queue is empty.

```ballerina
import ballerina/jballerina.java;

function newArrayDeque() returns handle = @java:Constructor {
   'class: "java.util.ArrayDeque"
} external;

function peek(handle receiver) returns handle = @java:Method {
   'class: "java.util.ArrayDeque"
} external;

// Linked with the `java.lang.Object.toString()` method in Java.
function toString(handle objInstance) returns handle = @java:Method {
   'class: "java.lang.Object"
} external;

public function main() {
   handle arrayDeque = newArrayDeque();
   handle element = peek(arrayDeque);
   handle str = toString(element);
}
```

Since the queue is empty in this case, `peek` should return null i.e., `element` should refer to Java null.  The output of this program will be as follows.

```ballerina
 error: java.lang.NoSuchFieldError {"message":"JAVA_NULL_REFERENCE_ERROR"}
	at array_deque:toString(array_deque.bal:19)
	   array_deque:main(array_deque.bal:27)
```

This is equivalent to a Java NPE. In such situations, you should check for null using the `java:isNull()` function. Below is the modified example.

```ballerina
public function main() {
   handle arrayDeque = newArrayDeque();
   handle element = peek(arrayDeque);

   if java:isNull(element) {
       // handle this case
   } else {
       handle str = toString(element);
   }
}
```

There are situations in which you need to pass a Java null to a method or store it in a data structure. In such situations, you can create a handle value that refers to a Java null as follows.

```ballerina
handle nullValue = java:createNull();
```

## Map Java types to Ballerina types and vice versa
### Map Java types to Ballerina types
The following table summarizes how Java types are mapped to corresponding Ballerina types. This is applicable when mapping a return type of a Java method to a Ballerina type.

Java type | Ballerina type | Notes
--------- | -------------- | -----
Any reference type including “null type” | handle |
boolean | boolean |
byte | byte, int, float | widening conversion when byte -> int and byte -> float
short | int, float | widening conversion
char  | int, float | widening conversion
int | int, float | widening conversion
long | int, float | widening conversion when long -> float
float | float | widening conversion
double | float |

### Map Ballerina types to Java types
The following table summarizes how Ballerina types are mapped to corresponding Java types. These rules are applicable when mapping a Ballerina function argument to a Java method/constructor parameter.

Ballerina type | Java type | Notes
-------------- | --------- | -----
handle | Any reference type | As specified by the Java method/constructor signature
boolean | boolean |
byte | byte, short, char, int, long, float, double | Widening conversion from byte -> short, char, int, long, float, double
int | byte, char, short, int, long | Narrowing conversion when int -> byte, char, short, and int
float | byte, char, short, int, long, float, double | Narrowing conversion when float -> byte, char, short, int, long, float
string | io.ballerina.runtime.api.values.BString |
xml | io.ballerina.runtime.api.values.BXml |
array | io.ballerina.runtime.api.values.BArray |
tuple | io.ballerina.runtime.api.values.BArray |
map | io.ballerina.runtime.api.values.BMap |
table | io.ballerina.runtime.api.values.BTable |
stream | io.ballerina.runtime.api.values.BStream |
object | io.ballerina.runtime.api.values.BObject |
future | io.ballerina.runtime.api.values.BFuture |
function | io.ballerina.runtime.api.values.BFunctionPointer |
typedesc | io.ballerina.runtime.api.values.BTypedesc |
error | io.ballerina.runtime.api.values.BError |

### Use Ballerina arrays and maps in Java
There is no direct mapping between Ballerina arrays and maps to primitive Java arrays and maps. To facilitate the use of Ballerina arrays and maps in Java, the `ballerina-runtime` libraries have to be added as a dependency to the Java project and the relevant classes need to be imported from the `ballerina-runtime` library. For more information on all the released versions, go to [`ballerina-runtime`](https://maven.wso2.org/nexus/content/repositories/releases/org/ballerinalang/ballerina-runtime/). The latest version of the dependency can be added to Gradle using the following:
```groovy
repositories {
   // Use WSO2's Nexus repository manager for resolving dependencies.
   maven {
       url = 'https://maven.wso2.org/nexus/content/repositories/releases/'
   }
}

dependencies {
   // Add ballerina-runtime as dependency.
   implementation 'org.ballerinalang:ballerina-runtime:+'
}
```

#### Use Ballerina arrays in Java
To use Ballerina arrays in Java, the `BArray` interface has to be used. The example below illustrates how to write Java interop code that uses Ballerina arrays.
```java
import io.ballerina.runtime.api.values.BArray;

public class ArrayReverse {
   public static BArray arrayReverse(BArray arr) {
       long len = arr.size();
       for(long i = len - 1, j = 0; j < len/2; i--, j++) {
           Object temp = arr.get(j);
           arr.add(j, arr.get(i));
           arr.add(i, temp);
       }
       return arr;
   }
}
```
Associated Ballerina code:
```ballerina
import ballerina/io;
import ballerina/jballerina.java;

public function main() {
   int[] a = [1,2,3,4,5];
   int[] b = arrayReverse(a);
   io:println(b);
}

function arrayReverse(int[] arr) returns int[] = @java:Method {
   'class: "javalibs.app.ArrayReverse"
} external;
```

#### Use Ballerina maps in Java
To use Ballerina maps in Java, the `BMap` interface has to be used. The example below illustrates how to write Java interop code that uses Ballerina maps.
```java
import io.ballerina.runtime.api.values.BMap;
import io.ballerina.runtime.api.values.BString;

import java.util.Map;

public class ModifyValues {
   public static BMap<Object, Object> modifyMapValues(BMap<Object, Object> map) {
       for(Map.Entry mapElement : map.entrySet()) {
           BString key = (BString) mapElement.getKey();
           long value = (long) mapElement.getValue();
           long modifiedValue = value + 10;
           map.put(key, modifiedValue);
       }
       return map;
   }
}
```
Associated Ballerina code:
```ballerina
import ballerina/io;
import ballerina/jballerina.java;

public function main() {
   map<int> marks = {sam: 50, jon: 60};
   map<int> modifiedMarks = modifyMapValues(marks);
   io:println(modifiedMarks);
}

function modifyMapValues(map<int> marks) returns map<int> = @java:Method {
   'class: "javalibs.app.ModifyValues"
} external;
```


## Access or mutate Java fields
The `@java:FieldGet` and `@java:FieldSet` annotations allow you to read and update the value of a Java static or instance field respectively. The most common use case is to read a value of a Java static constant.

```ballerina
import ballerina/jballerina.java;

public function pi() returns float = @java:FieldGet {
   name:"PI",
   'class:"java/lang/Math"
} external;

public function main() {
   float r = 4;
   float l = 2 * pi() * r;
}
```

In this example, the `pi()` function returns the value of the `java.lang.Math.PI` static field. This uses the `name` annotation field to specify the name of the field. Likewise, if you want to access an instance field, you need to pass the relevant object instance as discussed in the instance methods section.

The `@java:FieldSet` annotation has the same structure as the above.
