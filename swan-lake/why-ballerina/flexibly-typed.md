---
layout: ballerina-why-ballerina-left-nav-pages-swanlake
title: Flexibly typed
description: See how the Ballerina programming language's flexible type system helps developers work with networked resources in their code.
keywords: ballerina, programming lanaguage, type system, data binding
permalink: /why-ballerina/flexibly-typed/
active: flexibly-typed
intro: See how the Ballerina programming language's flexible type system helps developers work with networked resources in their code.
redirect_from:
- /why/the-network-in-the-language/
- /why/the-network-in-the-language
- /learn/user-guide/why-ballerina/network-aware-type-system
- /learn/user-guide/why-ballerina/network-aware-type-system/
- /learn/user-guide/why-ballerina/flexibly-typed
- /learn/user-guide/why-ballerina/flexibly-typed/
- /learn/why-ballerina/flexibly-typed
- /learn/why-ballerina/flexibly-typed/
- /why-ballerina/flexibly-typed
- /why-ballerina/network-aware-type-system/
- /why-ballerina/network-aware-type-system
---

In a programming language, the type system is the foundation for representing data and implementing logic. It provides the means of creating abstractions to the solutions that you provide. While some languages provide basic functionality, others strive to give in-built functionality for specialized domains.

With more services being available in the cloud, the network-distributed programming domain has grown. As the developer is given the added responsibility of working with networked resources in their code, the programming language itself must aid in this operation. That’s why Ballerina’s network-friendly type system is specialized for this domain.

## Statically typed and structural

Ballerina is a statically-typed language, which means type compatibility between the constructs is checked at compile-time. Statically-typed languages are generally more robust to changes and refactorings, easier to debug, and aid in creating better language tooling.

 The type system of the Ballerina language is primarily structural with added support for nominal typing. This means that the type compatibility is identified by considering the structure of the value rather than just relying on the name of the type. This is different from languages like Java, C++, and C# that have nominal type systems in which it is bound by the name of the actual type.

### Shapes in Ballerina

Types in Ballerina deal with an abstraction of values that don't consider storage identity. This abstraction is called a shape. For simple types like `int` and `boolean`, there is no difference between a shape and a value because they don't have a storage identity. To understand the concept of a shape, let’s look at the [`record` type](/learn/by-example/records.html) in Ballerina. Because records have storage identity, a reference to the value is stored in the variable rather than storing the actual value. This is comparable to references in Java or pointers in C++.

Here’s an example of a record that stores the state of a door:

```ballerina
type DoorState record {|
    boolean open;
    boolean locked;
|};
```

Now, let’s create some values of the `DoorState` record type:

```ballerina
DoorState v1 = {open: false, locked: true};
DoorState v2 = {open: false, locked: true};
DoorState v3 = {open: false, locked: true};
```

The three variables above all represent a single state of the door being closed and locked. Nonetheless, we have created three different values where each variable is stored in a distinct memory reference. If we ignore the storage identity of these variables, we are left with the representation of the data it has, which is `{open: false, locked: true}`. This is a single shape of the type `DoorState`.

In this way, there are four possible shapes for `DoorState` as shown in the variables below:

```ballerina
DoorState ds1 = {open: true, locked: true};
DoorState ds2 = {open: true, locked: false};
DoorState ds3 = {open: false, locked: true};
DoorState ds4 = {open: false, locked: false};
```

A type in Ballerina represents a set of possible shapes it can have. So any value that belongs to either of the above four shapes will be considered to be of the type `DoorState`.

<img src="/learn/images/why-diagram-01-new.png"/>
<p class="cCaption">Figure 1: Set of shapes of the type <code>DoorState</code></p>

### Subtypes in Ballerina

Subtyping in Ballerina is semantic. It is defined through shapes where `S` is a subtype of `T` if the set of shapes denoted by `S` is a subset of the shapes denoted by `T`. The examples below demonstrate this behavior.

The type `boolean` is a simple basic type in Ballerina without storage identity so its values become equivalent to its shapes. Therefore, the `boolean` type is defined as having two shapes, `true` and `false`.

The `boolean` type's shapes can be defined in set notation as `Sboolean = { true, false }`. This can be visualized as seen in Figure 2 below.

<img src="/learn/images/why-diagram-02-new.png"/>
<p class="cCaption">Figure 2: Set of shapes of the type <code>boolean</code></p>

Now, according to our subtyping rules, we can derive new types based on the `boolean` type by creating subsets of its shapes. For example, a new type we can create is `boolean_false`, where its only supported shape/value would be `false`. The new type is shown in Figure 3 below.

<img src="/learn/images/why-diagram-03-new.png"/>
<p class="cCaption">Figure 3: Shapes sets of types <code>boolean</code> and <code>boolean_false</code></p>

The new type `boolean_false` can be defined in Ballerina code in the following manner:

```ballerina
type boolean_false false;
```

This example uses the value `false` to define the new `boolean_false` type. In a more practical scenario, you can provide multiple values as a union when defining new types using the `T1|T2` syntax. A type that denotes only a single shape is called a singleton type. This new type can be used in the code in the following way.

```ballerina
boolean_false bv1 = false;
boolean bv2 = true;
bv2 = bv1;
```

As you can see, `bv1` of type `boolean_false` can be assigned to `bv2` of type `boolean` because `bv1`'s type is a subtype of `bv2`'s type. In simple terms, all the values that can be held by the variable `bv1` can be held by the variable `bv2`, and thereby, the assignment is possible.

We have now seen how Ballerina's subtyping works in relation to simple types. Let's take a look at creating subtypes of records by revisiting our `DoorState` scenario. Here, we will create a new type `EmergencyDoorState`, where the `locked` field has to always have the value `false`. The resultant types and their shapes can be seen below in Figure 4.

<img src="/learn/images/why-diagram-04-new.png"/>
<p class="cCaption">Figure 4: Shapes sets of types <code>DoorState</code> and <code>EmergencyDoorState</code></p>

The type definition of `EmergencyDoorState` type is shown below:

```ballerina
type EmergencyDoorState record {|
    boolean open;
    boolean_false locked = false;
|};
```

In the above type, we have modified the field `locked` to be of type `boolean_false`, which allows its only value to be `false`. In this type definition, default values in Ballerina records have been used, wherein the absence of an explicit value provided by the user, the default value mentioned here will be used.

In this manner, the type `EmergencyDoorState` can only have the shapes `{open: true, locked: false}` and `{open: false, locked: false}`. These two elements make it a subset of the `DoorState` shapes set, thus `EmergencyDoorState` is a subtype of `DoorState`.

The following code snippet shows a sample usage of the `EmergencyDoorState` type:

```ballerina
EmergencyDoorState eds1 = {open: true};
DoorState eds2 = eds1;
io:println("Door - Open: ", eds2.open, ", Locked: ", eds2.locked);
```

### Benefits of a structural type system
A structural type system proves beneficial when you have multiple systems interacting with each other since data exchange and type compatibilities can be resolved easier. Let's dive into a Ballerina <a href="/learn/by-example/query-expressions">integrated query</a> example, which shows this behavior.

```ballerina
type Result record {|
    string name;
    string college;
    int grade;
|};

type Person record {|
    string name;
    int age;
|};

function filterResults(Person[] persons, map<int> grades) returns Result[] {
    Result[] results = from var person in persons
                        let int lgrade = (grades[person.name] ?: 0), string targetCollege = "Stanford"
                        where lgrade > 75
                        select {
                            name: person.name,
                            college: targetCollege,
                            grade: lgrade
                        };
    return results;
}
```

In the example above, you filter records from a list and create a new value of type `Result` using the `select` clause. These values are assigned to an array of `Result` records, which is possible because the generated values are of the `Result` record type.

In situations such as above, a separate system from our core application may be generating values to be consumed by us. In these cases, instead of worrying about sharing the code for the data type definitions, you can simply concentrate on the compatibility of the data in order to ensure interoperability.

## Open-by-default

Ballerina's open-by-default concept is tied around the <a href="https://en.wikipedia.org/wiki/Robustness_principle">robustness principle</a>. This means that you should design network-aware programs to accept all the data that is sent to you and make the best effort to understand it. Also, when sending data, you should make the best effort to conform to the standard protocols that were agreed upon beforehand. This strategy makes sure you have the best chance of interacting with different systems reliably.

The main facilitator of this in the type system is the open record concept in Ballerina. The sections above demonstrated closed records and the sections below demonstrate open records with a record type that represents the details of a person.

### Get started

The code snippet below shows a simple HTTP GET request to an endpoint:

```ballerina
enum CreditScore {
    POOR,
    FAIR,
    GOOD,
    EXCELLENT
}

type Person record {|
    string name;
    int birthYear;
    boolean married = false;
    CreditScore creditScore?;
    json...;
|};
```

Here, the type `Person` is an open record type and the notation `json...;` denotes that this record type can contain additional fields that are not explicitly mentioned in the record type descriptor as long as these additional fields belong to type `json`.

The earlier `DoorState` record type was defined explicitly as a closed record type. Therefore, you were able to list out all the possible shapes in the `DoorState` type. If this type was defined as an open record, you would have an infinite number of shapes since `DoorState` values can have any arbitrary set of fields in the code.

The `Person` record type above has an <a href="/learn/by-example/optional-fields">optional field</a> `creditScore` (denoted by the suffix `"?"`). This means the `creditScore` field may not be set (i.e., not mandatory) when creating a value of type `Person`. Later on, this field can be accessed using field access (`"."`) or optional field access (`"?."`). The static type of this access would be `CreditScore?`, which is equivalent to the union type `CreditScore|()`. At runtime, accessing the optional field will return the value (belonging to the type of the field `CreditScore`) if the field is present, else, if the field is not present it will return nil. In Ballerina, the nil value and the type are represented by `()`. Field access can be used to access optional fields only when the type of the field does not contain nil (such as `creditScore` in this example).

Let’s create a new type `Student`, which will be a subtype of the `Person` type.

```ballerina
type Student record {|
    string name;
    int birthYear;
    boolean married;
    CreditScore creditScore?;
    string college;
|};
```

The `Student` type defined above has an extra field `college` of type `string` compared to the `Person` type. All the possible shapes belonging to the `Student` type are included in the set of shapes belonging to `Person` as well. This is possible because the `Person` type is an open record. If we make the `Person` type a closed record, `Student` will no longer be a subtype of `Person`.

Sample usage of the above types is shown below:

```ballerina
public function main() {
    Student s1 = {
        name: "Tom",
        birthYear: 1990,
        married: false,
        college: "Yale"
    };
    
    Student s2 = {
        name: "Anne",
        birthYear: 1988,
        married: true,
        creditScore: GOOD,
        college: "Harvard"
    };
    
    Person p1 = s1;
    CreditScore? cScore = p1?.creditScore;

    if cScore != () {
        io:println("P1's credit score: ", cScore);
    } else {
        io:println("P1's credit score: N/A");
    }

    Person p2 = s2;
    cScore = p2?.creditScore;

    if cScore != () {
        io:println("P2's credit score: ", cScore);
    } else {
        io:println("P2's credit score: N/A");
    }

    io:println(p2);
}
```

```bash
$ bal run sample.bal 
P1's credit score: N/A
P2's credit score: GOOD
{"name":"Anne","birthYear":1988,"married":true,"creditScore":"GOOD","college":"Harvard"}
```

## Network communication with data binding

The type system features for records in Ballerina can be used when implementing <a href="/learn/by-example/http-data-binding.html">data binding</a> operations with structural validation, data types handling, and payload passthrough operations. The functionality will be demonstrated using an HTTP service in Ballerina:

```ballerina
final http:Client highCreditStoreCustomersDb = check new ("http://example.com/");

service / on new http:Listener(8080) {

    resource function post 'record(@http:Payload {} Person entry) returns string|error {
        if entry?.creditScore == GOOD || entry?.creditScore == EXCELLENT {
            io:println("High credit score ", entry);
            http:Response _ = check highCreditStoreCustomersDb->post("/store", entry);
        } else {
            io:println("Low credit score ", entry);
        }
        return string `Record processed for: ${entry.name}`;
    }
}
```

```bash
$ bal run sample.bal
```

### Test scenarios

<table class="table cCodeTable cCodeTableFixedLayout" >
                                 <tr>
                                    <th class="cDescription">Description</th>
                                    <th class="cCodeCol">Request</th>
                                    <th class="cCodeCol">Output</th>
                                 </tr>
                                <tr>
                                    <td>
                                        <span>
                                       A request is sent without setting the <code>married</code> field. Since this field has a default value in the <code>Person</code> type, the value is automatically populated to that. The <code>creditScore</code> field is not set since it is marked as optional.
                                       </span>
                                    </td>
                                    <td>
                                       <span class="cTableCode"><code>curl -d '{ "name": "John Little",  "birthYear": 1855 }' http://localhost:8080/record</code></span>
                                    </td>
                                    <td>
                                        <span class="cTableCode"><code>Low credit score {"name":"John Little","birthYear":1855,"married":false}</code></span>
                                    </td>
                                 </tr> 
                                 <tr>
                                    <td>A request is sent with a string value given for the integer field <code>birthYear</code>. The service validates the value for the field and the request fails.</td>
                                   <td>
                                       <span class="cTableCode"><code>curl -d '{ "name": "John Little",  "birthYear": "1855" }' http://localhost:8080/record</code></span>
                                    </td>
                                    <td>
                                        <span class="cTableCode"><code>data binding failed: error("{ballerina/lang.value}ConversionError",message="'map&lt;json&gt;' value cannot be converted to 'Person': 
                field 'birthYear' in record 'Person' should be of type 'int', found '"1855"'")</code></span>
                                    </td>
                                 </tr> 
                              <tr>
                                    <td>A request is sent with the optional <code>creditScore</code> field also set. </td>
                                    <td>
                                       <span class="cTableCode"><code>curl -d '{ "name": "Sunil Perera",  "birthYear": 1950, "married": true, "creditScore": "GOOD" }' http://localhost:8080/record</code></span>
                                    </td>
                                    <td>
                                       <span class="cTableCode"><code>High credit score {"name":"Sunil Perera","birthYear":1950,"married":true,"creditScore":"GOOD"}</code>
</span>
                                    </td>
                                 </tr>
                                   <tr>
                                    <td>A request is sent with a non-existing value of the <code>CreditScore</code> enum. This is validated by the service and the request fails.</td>
                                    <td>
                                       <span class="cTableCode"><code>curl -d '{ "name": "Tim Kern",  "birthYear": 1995, "creditScore": "HIGH", "country": "Japan", "zipcode": "98101" }' http://localhost:8080/record</code></span>
                                    </td>
                                    <td>
                                       <span class="cTableCode"><code>data binding failed: error("{ballerina/lang.value}ConversionError",message="'map&lt;json&gt;' value cannot be converted to 'Person': 
                field 'creditScore' in record 'Person' should be of type 'CreditScore', found '"HIGH"'")</code></span>
</td>
                                 </tr>
                                  <tr>
                                    <td>A request is sent with additional fields not explicitly mentioned in the <code>Person</code> type. Since <code>Person</code> is an open record type, the service accepts and makes these extra fields available to be passed through to other systems, e.g. a forwarding service.</td>
                                    <td>
                                       <span class="cTableCode"><code>curl -d '{ "name": "Tim Kern",  "birthYear": 1995, "creditScore": "EXCELLENT", "country": "Japan", "zipcode": "98101" }' http://localhost:8080/record</code></span>
                                    </td>
                                    <td>
                                       <span class="cTableCode"><code>High credit score {"name":"Tim Kern","birthYear":1995,"married":false,"creditScore":"EXCELLENT","country":"Japan","zipcode":"98101"}</code></span>
                                    </td>
                                 </tr> 
</table>

<style>
.nav > li.cVersionItem {
    display: none !important;
}
/**.cBalleinaBreadcrumbs li:nth-child(3) , .cBalleinaBreadcrumbs li:nth-child(2) {
   display:none !important;
}**/
</style>
