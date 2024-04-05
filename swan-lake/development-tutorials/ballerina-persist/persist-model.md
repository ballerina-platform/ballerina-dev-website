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

| Field definition |                 Semantics                 | Supported data sources |        Examples        |   
|:----------------:|:-----------------------------------------:|:----------------------:|:----------------------:|
|       `T`        | Mapped to a non-nullable column in the DB |          All           |       `int id;`        |  
|    `T? field`    |   Mapped to a nullable column in the DB   |    All except Redis    | `string? description;` |  
|    `T field?`    |  The field can be ignored when inserting  |         Redis          | `string description?;` |  
|   `T? field?`    |              Invalid syntax               |           -            |           -            |  

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

The default foreign key field name will be `ownerId` in the `Car` table, which refers to the identity field of the `User` table by default. You can change this foreign key name and have more control with the `@sql:Relation` annotation.


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

The default foreign key field name will be `ownerId` in the `Car` table, which refers to the identity field of the `User` table by default. You can change this foreign key name and have more control with the `@sql:Relation` annotation.

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

## Advanced SQL annotations

To have a custom name and type mappings in the database implementation and to declare indexes, generated fields, and custom foreign keys, the below annotations can be used in the data model definition. Note that these annotations can only be used with SQL data stores.

In order to use them, you must first import the `persist.sql` package to your data model definition file as follows.

```ballerina
import ballerinax/persist.sql;
```

### Name mapping with `Name` annotation

- Map entity name to table name

```ballerina
@sql:Name {value: "people"}
type Person record {|
    readonly int id;
    string name;
    string address;
|};
```

The `Person` entity will be mapped to the `people` table in the database.

- Map field name to column name

```ballerina
type Person record {|
    @sql:Name {value: "person_id"}
    readonly int id;
    @sql:Name {value: "full_name"}
    string name;
    string address;
|};
```

The `id` field will be mapped to the `person_id` column in the database, and the `name` field will be mapped to the `full_name` column in the database.

### Type mapping

#### `Varchar` annotation

```ballerina
type Person record {|
    readonly int id;
    @sql:Varchar {length: 100}
    string name;
    string address;
|};
```

The `name` field will have a `VARCHAR(100)` column in the database. The `@sql:Varchar` annotation can only be used on `string` fields.

#### `Char` annotation

```ballerina
type Person record {|
    @sql:Char {length: 12}
    readonly string nic;
    string name;
    string address;
|};
```

The `nic` field will have a `CHAR(12)` column in the database. The `@sql:Char` annotation can only be used on `string` fields.

#### `Decimal` annotation

```ballerina
type Person record {|
    readonly int id;
    @sql:Decimal {precision: [10,2]}
    decimal salary;
    string address;
|};
```

The `salary` field will have a `DECIMAL(10,2)` column in the database. The `@sql:Decimal` annotation can only be used on `decimal` fields.

### Declare indexes

#### `Index` annotation

This annotation lets you define an index on a specific field. Optionally, you can provide an index name as a `string` or a set of index names as a `string[]` in situations where a single field takes part in multiple indexes. A composite index can be created by repeating the same index name in multiple fields. In this case, the order of index columns will be the order in which the respective fields are declared in the record type.

```ballerina
type Person record {|
    @sql:Index {name: "idx_name"}
    readonly int id;
    @sql:Index {name: ["idx_name", "idx_another"]}
    string name;
    @sql:Index
    string address;
|};
```

The index `idx_name` is a composite index consisting of `id` and `name` fields. `idx_another` is just another index on the `name` field. The `address` field also has the `@sql:Index` annotation without the `name` property. Here, the index name will be generated by `persist` in `idx_[FIELD_NAME]` format, in which case the index name for the `address` field will become `idx_address`.

#### `UniqueIndex` annotation

This annotation lets you define a unique index on a specific field, and the usage is similar to the `@sql:Index` annotation.

```ballerina
type Person record {|
    readonly int id;
    @sql:UniqueIndex {name: "idx_person"}
    string nic;
    @sql:UniqueIndex {name: ["idx_person", "idx_another"]}
    string name;
    @sql:UniqueIndex
    string address;
|};
```

The unique index `idx_person` is a composite unique index consisting of `nic` and `name` fields. `idx_another` is just another unique index on the `name` field. The `address` field also has the `@sql:UniqueIndex` annotation without the `name` property. Here, the index name will be generated by `persist` in the `unique_idx_[FIELD_NAME]` format, in which case the index name for the `address` field becomes `unique_idx_address`.

### Declare generated fields with `Generated` annotation

The `@sql:Generated` annotation is used to declare a field as a generated field. This annotation can only be used on `readonly int` fields. Currently, only the `AUTO_INCREMENT` or an equivalent generation strategy is supported.

```ballerina
type Person record {|
    @sql:Generated
    readonly int id;
    string name;
    string address;
|};
```

The `id` field will be auto-generated and the [`PersonInsert`](/learn/persist-client-api/#insert-types) type will not have the `id` field as it should be auto-generated by the database. Refer the below table to understand how the generation strategy is implemented in different data stores.

|  Data store  |  Implementation  |
|:------------:|:----------------:|
|   `MySQL`    | `AUTO_INCREMENT` |
|   `MSSQL`    | `IDENTITY(1,1)`  |
| `PostgreSQL` |     `SERIAL`     |

### Declare custom foreign keys with `Relation` annotation

The `@sql:Relation` annotation can be used to declare your own custom foreign key field. You must put the foreign key on the correct side of the relationship (owner) and the key field must exist on the record type, and must be of the same type as the primary key of the referred entity. This is particularly useful when a foreign key is also a part of the composite primary key.

```ballerina
type Car record {|
   readonly int id;
   string name;
   int userId;
   @sql:Relation {keys: ["userId"]}
   User owner;
|};

type User record {|
   readonly int id;
   string name;
   Car[] cars;
|};
```

The `keys` field accepts an array of foreign keys and the length of it must be the same as the number of primary keys the referring entity has. Here, the field `userId` is used as the foreign key for the relation `owner` and it has been declared so through the `@sql:Relation` annotation. When the `@sql:Relation` annotation is used in a relation field, the foreign key will not be generated by default.
