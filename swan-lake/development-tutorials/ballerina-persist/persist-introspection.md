---
layout: ballerina-persist-documentation-left-nav-pages-swanlake
title: Persist introspection (experimental)
description: The section gives details on database introspection.
keywords: ballerina, programming language, ballerina packages, persist, introspection
permalink: /learn/ballerina-persist/persist-instrospection/
active: persist_introspection
intro: Bal persist can work with existing databases by providing the facility to introspect an existing database to 
 generate the persist data model.
redirect_from:
- /learn/ballerina-persist/persist-introspection
---

Introspection lets you use `bal persist` with existing databases without having to write a
data model. Currently, introspection is only supported for MySQL databases and new data stores will be supported
in the future. [Advanced SQL annotations](/learn/persist-model/#advanced-sql-annotations) are used to annotate names, special types, declare generated fields, custom foreign
keys, and indexes etc.

During introspection, all table and column names which does not conform to Ballerina naming conventions will be converted to conforming names and their original names will be mapped with the [`@sql:Name`](/learn/persist-model/#name-mapping-with-name-annotation) annotation.

## Type Mapping

The below table shows how SQL types are mapped into Ballerina types. Development efforts are underway to support more SQL types.

The types that are partially supported will be fully supported later along with new annotations to better represent their specific SQL types. However, they can still be used in queries. The unsupported types will also be supported in the future.


| SQL Type         | Ballerina Type   |                         Annotation                         | Supported |
|------------------|------------------|:----------------------------------------------------------:|:---------:|
| `BOOLEAN`        | `boolean`        |                             -                              |    Yes    |
| `TINYINT(1) `    | `boolean`        |                             -                              |    Yes    |
| `INT`            | `int`            |                             -                              |    Yes    |
| `INTEGER`        | `int`            |                             -                              |    Yes    |
| `DECIMAL(65,30)` | `decimal`        |                             -                              |    Yes    |
| `DECIMAL(X,Y)`   | `decimal`        | [`@sql:Decimal`](/learn/persist-model/#decimal-annotation) |    Yes    |
| `DOUBLE`         | `float`          |                             -                              |    Yes    |
| `FLOAT`          | `float`          |                             -                              |    Yes    |
| `TIME`           | `time:TimeOfDay` |                             -                              |    Yes    |
| `TIMESTAMP`      | `time:Utc`       |                             -                              |    Yes    |
| `DATE`           | `time:Date`      |                             -                              |    Yes    |
| `DATETIME`       | `time:Civil`     |                             -                              |    Yes    |
| `VARCHAR(191)`   | `string`         |                             -                              |    Yes    |
| `VARCHAR(X)`     | `string`         | [`@sql:Varchar`](/learn/persist-model/#varchar-annotation) |    Yes    |
| `CHAR(X)`        | `string`         |    [`@sql:Char`](/learn/persist-model/#char-annotation)    |    Yes    |
| `BLOB`           | `byte[]`         |                             -                              |    Yes    |
| `ENUM`           | `enum`           |                             -                              |    Yes    |
| `TINYINT(X)`     | `int`            |                             -                              |  Partial  |
| `SMALLINT`       | `int`            |                             -                              |  Partial  |
| `MEDIUMINT`      | `int`            |                             -                              |  Partial  |
| `BIGINT`         | `int`            |                             -                              |  Partial  |
| `TEXT`           | `string`         |                             -                              |  Partial  |
| `TINYTEXT`       | `string`         |                             -                              |  Partial  |
| `MEDIUMTEXT`     | `string`         |                             -                              |  Partial  |
| `LONGTEXT`       | `string`         |                             -                              |  Partial  |
| `TINYBLOB`       | `byte[]`         |                             -                              |  Partial  |
| `MEDIUMBLOB`     | `byte[]`         |                             -                              |  Partial  |
| `LONGBLOB`       | `byte[]`         |                             -                              |  Partial  |
| `VARBINARY`      | `byte[]`         |                             -                              |  Partial  |
| `BINARY`         | `byte[]`         |                             -                              |  Partial  |
| `JSON`           | -                |                             -                              |    No     |
| `GEOMETRY`       | -                |                             -                              |    No     |
| `SET`            | -                |                             -                              |    No     |


## Limitations

- Introspection currently supports only for MySQL data stores
- Cross-referring relations, where foreign keys are found in both sides of a couple of associated entities are not supported
- Foreign keys occurring from unique keys are not supported
- Some data types are unsupported, in which case the client API for those entities are not generated. However, you can still perform join queries that include those relations, without unsupported fields.
- Bal Persist only supports `auto-increment` generation strategy with the [`@sql:Generated`](/learn/persist-model/#declare-generated-fields-with-generated-annotation) annotation
- Introspection ignores the order of columns in composite indexes and annotates index fields with [`@sql:Index`](/learn/persist-model/#index-annotation) or [`@sql:UniqueIndex`](/learn/persist-model/#uniqueindex-annotation) annotation without considering the column order
