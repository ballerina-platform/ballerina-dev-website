---
layout: ballerina-persist-documentation-left-nav-pages-swanlake
title: Data model
description: The sections gives details on the data model.
keywords: ballerina, programming language, ballerina packages, persist, data model, persist data model, persist entity type, persist simple type
permalink: /learn/ballerina-persist/persist-model/
active: persist_model
intro: The data model defines a mechanism to express the application's data using the Ballerina record type. Any record type that is a subtype of the `EntityType` will be an entity in the model.
redirect_from:
- /learn/ballerina-persist/persist-model/
---

Within a Ballerina project, the data model should be defined in a separate BAL file under the `persist` directory. This file is not considered as a part of the Ballerina project and is used only for the data model definition.

## The `EntityType` definition

An `EntityType` is defined using the `SimpleType` and `EntityType` fields. 

```ballerina
type SimpleType ()|boolean|int|float|decimal|string|byte[]|time:Date|time:TimeOfDay|time:Utc|time:Civil;
type EntityType record {|
   SimpleType|EntityType|EntityType[]...;
|};
```

### `Simple` type:  
   From the data source perspective, a field of `SimpleType` contains only one value (i.e., each `SimpleType` field maps to a field of data).
   > *Note*: This does not support the union type of `SimpleType`( i.e., `int|string` is not supported).

### `Entity` type  
   An entity can contain fields of the `SimpleType`, `EntityType`, or `EntityType[]`. This design uses fields of type `EntityType` or `EntityType[]` to define associations between two entities.

Below are some examples of subtypes of the entity type:

```ballerina
// Valid.
type Employee record {|
   int id; // SimpleType
   string fname; // SimpleType
   string lname; // SimpleType
   Department department; // EntityType
|};


// This is valid.
type Department record {|
   int id;
   string name;
   byte[] logo;
   Employee[] employees; // EntityType
|};


// Invalid
type Employee record {|
   int|string id; 
   string fname;
   string lname;
   Department department; // EntityType
|};
```
`Simple` types are mapped to native data source types. Depending on the data store, the mapping may vary. Refer to the [Supported data stores](/learn/supported-data-stores/) to learn more about the mapping.

## Entity attributes definition

Ballerina record fields are used to model the attributes of an entity. The type of the field should be a subtype of `SimpleType`.

### Identity field(s)

The entity must contain at least one identity field. This field's value is used to identify each record uniquely. The identity field(s) is indicated by the `readonly` flag.

Say type T is one of `int`, `string`, `float`, `boolean` or `decimal` types,

```ballerina
type EntityType record {|
    readonly T <fieldName>;
|} 
```
The identity field can be a single field or a combination of multiple fields as follows.

```ballerina
type EntityType record {|
    readonly T <fieldName1>;
    readonly T <fieldName2>;
|} 
```

### Nullable field(s)

Say type T is a subtype of `SimpleType`, and T does not contain (),

| Field definition  |                 Semantics                  |       Examples        |   
|:-----------------:|:------------------------------------------:|:---------------------:|
|      `T`     | Mapped to a non-nullable column in the DB  |        `int id;`        |  
|     T? field      |   Mapped to a nullable column in the DB    | string? description;  |  
|     T field?      |                Not allowed                 |           -           |  
|     T? field?     |                Not allowed                 |           -           |  

## Relationship definition

Ballerina record fields are used to model a connection between two entities. The type of the field should be a subtype of `EntityType|EntityType?|EntityType[]`.

This design supports the following cardinalities.
1. One-to-one (`1-1`)
2. One-to-many (`1-n`)

The relation field is mandatory in both entities.

### One-to-one (1-1)

A 1-1 relationship is defined by a field of the `EntityType` in one entity and `EntityType?` in the other. For example, consider the `Car` and `User` entities. Assume that a car can have only one owner and a user can own at most one car.

```ballerina
type Car record {|
   readonly int id;
   string name;
   User owner;
|};

type User record {|
   readonly int id;
   string name;
   Car? car;
|};
```

The above entities explain the following.
 - A `Car` must have a `User` as the owner.
 - A `User` may or may not own a `Car`.

The Ballerina record type generated from the above entities will be as follows.

```ballerina
type Car record {|
   readonly int id;
   string name;
   int ownerId;
|};

type User record {|
   readonly int id;
   string name;
|};
```

In the first record (`Car`), the `EntityType` field `owner` is taken as the owner in the 1-1 relationship and will include the foreign key of the second record (`User`).

The default foreign key field name will be `ownerId` in the `Car` table, which refers to the identity field of the `User` table by default.


### One-to-many (1-n)

A 1-n relationship is defined by a field of the `EntityType` in one entity and `EntityType[]` in the other. For example, consider the `Car` and `User` entities. Assume that a car can have only one owner and a user can own multiple cars.

```ballerina
type Car record {|
   readonly int id;
   string name;
   User owner;
|};

type User record {|
   readonly int id;
   string name;
   Car[] cars;
|};
```

The above entities explain the following.
- A `Car` must have a `User` as the owner.
- A `User` may own multiple `Car`s or do not own one (represented with an empty array `[]`).

The Ballerina record type generated from the above entities will be as follows.

```ballerina
type Car record {|
   readonly int id;
   string name;
   int ownerId;
|};

type User record {|
   readonly int id;
   string name;
|};
```

The entity that contains the field of the `EntityType` is taken as the owner in the `1-n` relationship and will include the foreign key.

The default foreign key field name will be `ownerId` in the `Car` table, which refers to the identity field of the `User` table by default.

### Many-to-many (`n-n`)

An `n-n` relationship is defined by two `1-n` relationships. The joining entity is used to map the two entities. The joining entity should contain two fields of the`EntityType` that refer to the two entities in the relationship. For example, consider `Car` and `User` entities. Assume that a car can have multiple owners and a user can own multiple cars.

```ballerina
type Car record {|
   readonly int id;
   string name;
   CarUser[] owners;
|};

type User record {|
   readonly int id;
   string name;
   CarUser[] cars;
|};

type CarUser record {|
   readonly int id; 
   Car car;
   User user;
|};

```

The above entities explain the following.

- A `Car` may have multiple `User`s as owners.
- A `User` may own multiple `Car`s.

The Ballerina record type generated from the above entities will be as follows.

```ballerina
type Car record {|
   readonly int id;
   string name;
|};

type User record {|
   readonly int id;
   string name;
|};

type CarUser record {|
   readonly int id; 
   int userId;
   int carId;
|};
```

The `CarUser` `join` entity contains two fields of the EntityType` that refer to the two entities in the relationship. 
 The foreign key field names will be `userId`, and `carId` in the `CarUser` table, which refer to the identity field of the `User` and `Car` tables.
