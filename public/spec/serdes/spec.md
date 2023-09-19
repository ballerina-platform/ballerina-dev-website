# Specification: Ballerina SerDes Library

_Owners_: @MohamedSabthar @shafreenAnfar @ThisaruGuruge  
_Reviewers_: @shafreenAnfar @ThisaruGuruge  
_Created_: 2022/08/01  
_Updated_: 2022/08/01  
_Edition_: Swan Lake  

## Introduction
This is the specification for the SerDes standard library of [Ballerina language](https://ballerina.io/), which is used for serializing and deserializing subtypes of Ballerina anydata type.

The SerDes library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant GitHub tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in GitHub.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents

1. [Overview](#1-overview)
2. [Schema](#2-schema)
	* 2.1 [`serialize` function](#21-serialize-function)
	* 2.2 [`deserialize` function](#22-deserialize-function)
3. [Proto3Schema](#3-proto3schema)
	* 3.1 [`init` function](#31-init-function)
	* 3.2 [`serialize` function](#32-serialize-function)
	* 3.3 [`deserialize` function](#33-deserialize-function)
4. [Ballerina anydata to proto3 mapping](#4-ballerina-anydata-to-proto3-mapping)
	* 4.1 [Ballerina primitives](#41-ballerina-primitives)
	* 4.2 [Array](#42-array)
	* 4.3 [Union](#43-union)
	* 4.4 [Record](#44-record)
	* 4.5 [Map](#45-map)
	* 4.6 [Table](#46-table)
	* 4.7 [Tuple](#47-tuple)
	* 4.8 [Enum](#48-enum)

## 1. Overview
This specification elaborates on functionalities provided by the SerDes library and how the SerDes library maps the Ballerina anydata to a protocol buffer type.

## 2. Schema
`Schema` object defines the API to perform serialization and deserialization of Ballerina anydata. You can include this `Schema` object in a class and implement your serialization and deserialization logic. The `Schema` object definition is as follows. 

```ballerina
public type Schema object {

  public isolated function serialize(anydata data) returns byte[]|Error;

  public isolated function deserialize(byte[] encodedMessage, typedesc<anydata> T = <>) returns T|Error;
}
```

### 2.1 `serialize` function
Serializes the value passed as the argument and returns `byte[]` on successful serialization or an `Error` on failure.

### 2.2 `deserialize` function
Deserializes the provided `byte[]` argument and returns the ballerina value or an `Error` on failure.

## 3. Proto3Schema
`Proto3Schema` class includes `Schema` object and provides the implementation to
 perform serialization and deserialization of Ballerina anydata using protocol buffers (proto3). The class definition of `Proto3Schema` is as follows.

```ballerina
public class Proto3Schema {
  *Schema;

  public isolated function init(typedesc<anydata> ballerinaDataType) returns Error? {
        check generateSchema(self, ballerinaDataType);
  }

  // Implementation of serialize(), deserialize() functions goes here
}
```

### 3.1 `init` function
Generates a proto3 message definition for the given `typedesc<anydata>` when instantiating a `Proto3Schema` object. 

### 3.2 `serialize` function
Serializes the value passed as the argument and returns `byte[]` on successful serialization or an `Error` on failure. The underlying implementation uses the previously generated proto3 message definition to serialize the provided value. Passing a value that doesn't match the type provided during the instantiation of the `Proto3Schema` object may results in a serialization failure. The following code shows an example of performing serialization.


```ballerina
import ballerina/serdes;

// Define a type which is a subtype of anydata.
type Student record {
    int id;
    string name;
    decimal fees;
};

public function main() returns error? {

    // Assign the value to the variable
    Student student = {
        id: 7894,
        name: "Liam",
        fees: 24999.99
    };

    // Create a serialization object by passing the typedesc.
    // This creates an underlying protocol buffer schema for the typedesc.
    serdes:Proto3Schema serdes = check new (Student);

    // Serialize the record value to bytes.
    byte[] bytes = check serdes.serialize(student);
}
```

### 3.3 `deserialize` function
Deserializes the provided `byte[]` argument and returns the ballerina value with the type represented by the typedesc value provided during the `Proto3Schema` object instantiation. The underlying implementation uses the generated proto3 message definition to serialize the provided value. Passing a `byte[]` that is not a serialized value of the specified type may result in a deserialization failure or a garbage value. The following code shows an example of performing deserialization.

```ballerina
import ballerina/io;
import ballerina/serdes;

// Define a type which is a subtype of anydata.
type Student record {
    int id;
    string name;
    decimal fees;
};

public function main() returns error? {

    byte[] bytes = readSerializedDataToByteArray();

    // Deserialize the record value from bytes. 
    Student student = check serdes.deserialize(bytes);

    // Print deserialized data.
    io:println(student);
}
```

## 4. Ballerina anydata to proto3 mapping
As specified before, the `Proto3Schema` dynamically generates proto3 message definition for given subtypes of Ballerina anydata. The following sections define the mapping for each subtype.

### 4.1 Ballerina primitives

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
int age = 24;
```

</pre>
</td>
<td>
<pre lang='proto'>
message IntValue {
  sint64 atomicField = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
float mass = 24.5;
```

</pre>
</td>
<td>
<pre lang='proto'>
message FloatValue {
  double atomicField = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
boolean isOpen = true;
```

</pre>
</td>
<td>
<pre lang='proto'>
message BooleanValue {
  bool atomicField = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
byte count = 3;
```

</pre>
</td>
<td>
<pre lang='proto'>
message ByteValue {
  bytes atomicField = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
string package = "serdes";
```

</pre>
</td>
<td>
<pre lang='proto'>
message StringValue {
    string atomicField = 1;
}
</pre>
</td>
</tr>


<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
decimal salary = 2e5;
```

</pre>
</td>
<td>
<pre lang='proto'>
message DecimalValue {
    uint32 scale = 1;
    uint32 precision = 2;
    bytes value = 3;
}
</pre>
</td>
</tr>
<table>

### 4.2 Array

1. Simple arrays
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type IntArray int[];
```

</pre>
</td>
<td>
<pre lang='proto'>
message ArrayBuilder {
    repeated sint64 arrayField = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type FloatArray float[];
```

</pre>
</td>
<td>
<pre lang='proto'>
message ArrayBuilder {
    repeated double arrayField = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type DecimalArray decimal[];
```

</pre>
</td>
<td>
<pre lang='proto'>
message ArrayBuilder {
  message DecimalValue {
     uint32 scale  = 1;
     uint32 precision  = 2;
     bytes value  = 3;
  }
  repeated DecimalValue arrayField  = 1;
}
</pre>
</td>
</tr>
<table>

2. Multidimensional arrays

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type String2DArray string[][];
```

</pre>
</td>
<td>
<pre lang='proto'>
message ArrayBuilder {
  message ArrayBuilder {
     repeated string arrayField  = 1;
  }
  repeated ArrayBuilder arrayField  = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Decimal3DArray decimal[][][];
```

</pre>
</td>
<td>
<pre lang='proto'>
message ArrayBuilder {
  message ArrayBuilder {
    message ArrayBuilder {
      message DecimalValue {
         uint32 scale  = 1;
         uint32 precision  = 2;
         bytes value  = 3;
      }
      repeated DecimalValue arrayField  = 1;
    }
    repeated ArrayBuilder arrayField  = 1;
  }
  repeated ArrayBuilder arrayField  = 1;
}
</pre>
</td>
</tr>
<table>

### 4.3 Union

1. Union with primitive types

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type PrimitiveUnion  int|byte|float|decimal|string?;
```

</pre>
</td>
<td>
<pre lang='proto'>
message UnionBuilder {
  message DecimalValue {
     uint32 scale  = 1;
     uint32 precision  = 2;
     bytes value  = 3;
  }
  sint64 int___unionField  = 1;
  bytes byte___unionField  = 2;
  double float___unionField  = 3;
  DecimalValue decimal___unionField  = 4;
  string string___unionField  = 5;
  bool nullField  = 6;
}

</pre>
</td>
</tr>
<tr><td colspan="2">`&lttype>___` prefix added to avoid name collision in protobuf schema generation</td></tr>
<table>

2. Union of multidimensional arrays

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type UnionWithArray int[][]|float[]|string[][][];
```

</pre>
</td>
<td>
<pre lang='proto'>
message UnionBuilder {
  message int___ArrayBuilder_1 {
     repeated sint64 arrayField  = 1;
  }
  message string___ArrayBuilder_2 {
    message ArrayBuilder {
       repeated string arrayField  = 1;
    }
    repeated ArrayBuilder arrayField  = 1;
  }
  repeated int___ArrayBuilder_1 int___arrayField_2___unionField  = 1;
  repeated double float___arrayField_1___unionField  = 2;
  repeated string___ArrayBuilder_2 string___arrayField_3___unionField  = 3;
}
</pre>
</td>
</tr>
<tr><td colspan="2">
A (union) member array has the following name format for message field name and nested message name:
<ul>
<li>Field name format: `&lttype>___arrayField_&ltdimension>_unionField`</li>
<li>Nested message name format: `&lttype>_ArrayBuilder_&ltdimension>`</li>
</ul>
Here `&lttype>`, `&ltdimension>` used to avoid name collision in protobuf schema generation.
</td></tr>
<table>

3. Union of union-arrays

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type IntOrString int|string;

type FloatOrNill float?;

type UnionArray IntOrString[]|FloatOrNill[];
```

</pre>
</td>
<td>
<pre lang='proto'>
message UnionBuilder {
  message IntOrString___UnionBuilder {
     sint64 int___unionField  = 1;
     string string___unionField  = 2;
  }
  message FloatOrNill___UnionBuilder {
     double float___unionField  = 1;
     bool nullField  = 2;
  }
  repeated IntOrString___UnionBuilder IntOrString___arrayField_1___unionField  = 1;
  repeated FloatOrNill___UnionBuilder FloatOrNill___arrayField_1___unionField  = 2;
}
</pre>
</td>
</tr>
<table>

### 4.4 Record

1. Simple record with primitive types
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Employee record {
    string name;
    byte age;
    int weight;
    float height;
    boolean isMarried;
    decimal salary;
};
```

</pre>
</td>
<td>
<pre lang='proto'>
message Employee {
  message DecimalValue {
     uint32 scale  = 1;
     uint32 precision  = 2;
     bytes value  = 3;
  }
  string name  = 1;
  bytes age  = 2;
  sint64 weight  = 3;
  double height  = 4;
  bool isMarried  = 5;
  DecimalValue salary  = 6;
}
</pre>
</td>
</tr>
<tr><td colspan="2">Proto message name and field names are the same as the ballerina record type name and field names.</td></tr>
<table>

2. Record with arrays fields

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type RecordWithSimpleArrays record {
    string[] stringArray;
    int[] intArray;
    float[] floatArray;
    boolean[] boolArray;
    byte[] byteArray;
};
```

</pre>
</td>
<td>
<pre lang='proto'>
message RecordWithSimpleArrays {
   repeated string stringArray  = 1;
   repeated sint64 intArray  = 2;
   repeated double floatArray  = 3;
   repeated bool boolArray  = 4;
   bytes byteArray  = 5;
}
</pre>
</td>
</tr>
<tr></tr>
<tr>
<td>
<pre lang='ballerina'>

```ballerina
type RecordWithMultidimentionalArrays record {
    string[][][] string3DArray;
    decimal[][] decimal2DArray;
};
```

</pre>
</td>
<td>
<pre lang='proto'>
message RecordWithMultidimentionalArrays {
  message decimal2DArray___ArrayBuilder {
    message DecimalValue {
       uint32 scale  = 1;
       uint32 precision  = 2;
       bytes value  = 3;
    }
    repeated DecimalValue arrayField  = 1;
  }
  message string___ArrayBuilder_3 {
    message ArrayBuilder {
       repeated string arrayField  = 1;
    }
    repeated ArrayBuilder arrayField  = 1;
  }
  repeated string3DArray___ArrayBuilder string3DArray  = 1;
  repeated decimal2DArray___ArrayBuilder decimal2DArray  = 2;
}

</pre>
</td>
</tr>
<table>

3. Record with union fields

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type RecordWithUnion record {
    int|string? data;
};
```

</pre>
</td>
<td>
<pre lang='proto'>
message RecordWithUnion {
  message data___UnionBuilder {
     bool nullField  = 1;
     sint64 int___unionField  = 2;
     string string___unionField  = 3;
  }
  data___UnionBuilder data  = 1;
}
</pre>
</td>
</tr>
<tr><td colspan="2">Nested message names of union messages are prefixed with ballerina record field name to avoid name collision, generally the union message name follows the form of `&ltrecordFieldName>__UnionBuilder`
</td></tr>
<table>

4. Record with cyclic references

<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Node1 record {
    string name;
    Nested2? nested;
};

type Node2 record {
    string name;
    Nested3? nested;
};

type Node3 record {
    string name;
    Nested1? nested;
};
```

</pre>
</td>
<td>
<pre lang='proto'>
message Node1 {
  message nested___UnionBuilder {
    message Node2 {
      message nested___UnionBuilder {
        message Node3 {
          message nested___UnionBuilder {
             Nested1 Nested1___unionField  = 1;
             bool nullField  = 2;
          }
          string name  = 1;
          nested___UnionBuilder nested  = 2;
        }
        Nested3 Nested3___unionField  = 1;
        bool nullField  = 2;
      }
      string name  = 1;
      nested___UnionBuilder nested  = 2;
    }
    Nested2 Nested2___unionField  = 1;
    bool nullField  = 2;
  }
  string name  = 1;
  nested___UnionBuilder nested  = 2;
}
</pre>
</td>
</tr>
<table>

### 4.5 Map

1. Map with primitive types
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type MapInt map<int>;
```

</pre>
</td>
<td>
<pre lang='proto'>
message MapBuilder {
  message MapFieldEntry {
     string key  = 1;
     sint64 value  = 2;
  }
  repeated MapFieldEntry mapField  = 1;
}
</pre>
</td>
</tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type MapDecimal map<decimal>;
```

</pre>
</td>
<td>
<pre lang='proto'>
message MapBuilder {
  message MapFieldEntry {
    message DecimalValue {
       uint32 scale  = 1;
       uint32 precision  = 2;
       bytes value  = 3;
    }
    string key  = 1;
    DecimalValue value  = 2;
  }
  repeated MapFieldEntry mapField  = 1;
}
</pre>
</td>
</tr>
<table>

2. Map with records
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Status record {
    int code;
    string message?;
};

type MapRecord map<Status>;
```

</pre>
</td>
<td>
<pre lang='proto'>
message MapBuilder {
  message MapFieldEntry {
    message Status {
       sint64 code  = 1;
       string message  = 2;
    }
    string key  = 1;
    Status value  = 2;
  }
  repeated MapFieldEntry mapField  = 1;
}
</pre>
</td>
</tr>
<table>

3. Map with arrays
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type IntMatrix int[][];

type MapArray <IntMatrix>;
```

</pre>
</td>
<td>
<pre lang='proto'>
message MapBuilder {
  message MapFieldEntry {
    message ArrayBuilder {
       repeated sint64 arrayField  = 1;
    }
    string key  = 1;
    repeated ArrayBuilder value  = 2;
  }
  repeated MapFieldEntry mapField  = 1;
}
</pre>
</td>
</tr>
<table>

4. Map with unions
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Status record {
    int code;
    string message?;
};

type IntMatrix int[][];

type MapUnion map<Status|IntMatrix>;
```

</td>
<td>
<pre lang='proto'>
message MapBuilder {
  message MapFieldEntry {
    message value___UnionBuilder {
      message Status {
         sint64 code  = 1;
         string message  = 2;
      }
     message int___ArrayBuilder_1 {
        repeated sint64 arrayField  = 1;
      }
      Status Status___unionField  = 1;
      repeated int___ArrayBuilder_1 int___arrayField_2___unionField  = 2;
    }
    string key  = 1;
    value___UnionBuilder value  = 2;
  }
  repeated MapFieldEntry mapField  = 1;
}
</pre>
</td>
</tr>
<table>

5. Map with maps
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Status record {
    int code;
    string message?;
};

type IntMatrix int[][];

type MapUnion map<Status|IntMatrix>;

type MapOfMaps map<MapUnion>;
```

</pre>
</td>
<td>
<pre lang='proto'>
message MapBuilder {
  message MapFieldEntry {
    message MapBuilder {
      message MapFieldEntry {
        message value___UnionBuilder {
          message Status {
             sint64 code  = 1;
             string message  = 2;
          }
         message int___ArrayBuilder_1 {
            repeated sint64 arrayField  = 1;
          }
          Status Status___unionField  = 1;
          repeated int___ArrayBuilder_1 int___arrayField_2___unionField  = 2;
        }
        string key  = 1;
        value___UnionBuilder value  = 2;
      }
      repeated MapFieldEntry mapField  = 1;
    }
    string key  = 1;
    MapBuilder value  = 2;
  }
  repeated MapFieldEntry mapField  = 1;
}

</pre>
</td>
</tr>
<table>

### 4.6 Table

1. Table with Map constraint
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Score map<int>;

type ScoreTable table<Score>;
```

</pre>
</td>
<td>
<pre lang='proto'>
message TableBuilder {
  message MapBuilder {
    message MapFieldEntry {
       string key  = 1;
       sint64 value  = 2;
    }
    repeated MapFieldEntry mapField  = 1;
  }
  repeated MapBuilder tableEntry  = 1;
}
</pre>
</td>
</tr>
<table>


2. Table with record constraint

<table>
  <tr>
  <th> Ballerina </th>
  <th> Proto message </th>
  </tr>

  <tr></tr>

  <tr>
  <td>
<pre lang='ballerina'>

```ballerina
type Row record {
    int id;
    string name;
};

type RecordTable table<Row>;
```

</pre>
</td>
<td>
<pre lang='proto'>
message TableBuilder {
  message Row {
     sint64 id  = 1;
     string name  = 2;
  }
  repeated Row tableEntry  = 1;
}
</pre>
</td>
</tr>
<table>

### 4.7 Tuple
1. Tuple with primitive type elements
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type PrimitiveTuple [byte, int, float, boolean, string ,decimal];
```

</pre>
</td>
<td>
<pre lang='proto'>
message TupleBuilder {
  message DecimalValue {
     uint32 scale  = 1;
     uint32 precision  = 2;
     bytes value  = 3;
  }
  bytes element_1  = 1;
  sint64 element_2  = 2;
  double element_3  = 3;
  bool element_4  = 4;
  string element_5  = 5;
  DecimalValue element_6  = 6;
}
</pre>
</td>
</tr>
<table>

 2. Tuple with Union elements 
<table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type TupleWithUnion [byte|string, decimal|boolean];
```

</pre>
</td>
<td>
<pre lang='proto'>
message TupleBuilder {
  message element_1___UnionBuilder {
     bytes byte___unionField  = 1;
     string string___unionField  = 2;
  }
  message element_2___UnionBuilder {
   message DecimalValue {
      uint32 scale  = 1;
      uint32 precision  = 2;
      bytes value  = 3;
    }
    bool boolean___unionField  = 1;
    DecimalValue decimal___unionField  = 2;
  }
  element_1___UnionBuilder element_1  = 1;
  element_2___UnionBuilder element_2  = 2;
}
</pre>
</td>
</tr>
<table>

 3. Tuple with array elements
 <table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type UnionTupleElement byte|string;
```

</pre>
<pre lang='ballerina'>

```ballerina
type TupleWithArray [string[], boolean[][], int[][][], UnionTupleElement[]];
```

</pre>
</td>
<td>
<pre lang='proto'>
message TupleBuilder {
  message int___ArrayBuilder_2 {
    message ArrayBuilder {
       repeated sint64 arrayField  = 1;
    }
    repeated ArrayBuilder arrayField  = 1;
  }
 message UnionTupleElement___UnionBuilder {
    bytes byte___unionField  = 1;
    string string___unionField  = 2;
  }
 message boolean___ArrayBuilder_1 {
    repeated bool arrayField  = 1;
  }
  repeated string element_1  = 1;
  repeated boolean___ArrayBuilder_1 element_2  = 2;
  repeated int___ArrayBuilder_2 element_3  = 3;
  repeated UnionTupleElement___UnionBuilder element_4  = 4;
}

</pre>
</td>
</tr>
<table>

 4. Tuple with record elements
   <table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type Student record {
    string name;
    int courseId;
    decimal fees;
};

type Teacher record {
    string name;
    int courseId;
    decimal salary;
};

type TupleWithRecord [Student, Teacher];
```

</pre>
</td>
<td>
<pre lang='proto'>
message TupleBuilder {
  message Teacher {
    message DecimalValue {
       uint32 scale  = 1;
       uint32 precision  = 2;
       bytes value  = 3;
    }
    sint64 courseId  = 1;
    string name  = 2;
    DecimalValue salary  = 3;
  }
  message Student {
    message DecimalValue {
      uint32 scale  = 1;
      uint32 precision  = 2;
      bytes value  = 3;
    }
    sint64 courseId  = 1;
    DecimalValue fees  = 2;
    string name  = 3;
  }
  Student element_1  = 1;
  Teacher element_2  = 2;
}
</pre>
</td>
</tr>
<table>

 5. Tuple with tuple elements
    <table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
type PrimitiveTuple [byte, int, float, boolean, string ,decimal];

type TupleWithUnion [byte|string, decimal|boolean];

type TupleOfTuples [PrimitiveTuple, TupleWithUnion];
```

</pre>
</td>
<td>
<pre lang='proto'>
message TupleBuilder {
  message element_2___TupleBuilder {
    message element_1___UnionBuilder {
       bytes byte___unionField  = 1;
       string string___unionField  = 2;
    }
    message element_2___UnionBuilder {
     message DecimalValue {
        uint32 scale  = 1;
        uint32 precision  = 2;
        bytes value  = 3;
      }
      bool boolean___unionField  = 1;
      DecimalValue decimal___unionField  = 2;
    }
    element_1___UnionBuilder element_1  = 1;
    element_2___UnionBuilder element_2  = 2;
  }
  message element_1___TupleBuilder {
    message DecimalValue {
       uint32 scale  = 1;
       uint32 precision  = 2;
       bytes value  = 3;
    }
    bytes element_1  = 1;
    sint64 element_2  = 2;
    double element_3  = 3;
    bool element_4  = 4;
    string element_5  = 5;
    DecimalValue element_6  = 6;
  }
  element_1___TupleBuilder element_1  = 1;
  element_2___TupleBuilder element_2  = 2;
}
</pre>
</td>
</tr>
<table>

### 4.8 Enum
Ballerina enum is a syntactic sugar of union of constant strings thus enum is handled as union in protobuf level
     <table >
<tr>
<th> Ballerina </th>
<th> Proto message </th>
 </tr>

<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
enum Color {
    RED=”red”,
    GREEN,
    BLUE
}
```

</pre>
</td>
<td>
<pre lang='proto'>
message UnionBuilder {
   string string___unionField  = 1;
}
</pre>
</td>
</tr>
<tr></tr>

<tr>
<td>
<pre lang='ballerina'>

```ballerina
const OPEN = "open";
const CLOSE = "close";
type STATE OPEN|CLOSE;
```

</pre>
</td>
<td>
<pre lang='proto'>
message UnionBuilder {
   string string___unionField  = 1;
}
</pre>
</td>
</tr>
<table>
