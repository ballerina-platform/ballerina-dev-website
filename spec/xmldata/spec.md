# Specification: Ballerina XmlData Library

_Owners_: @daneshk @kalaiyarasiganeshalingam @MadhukaHarith92                                       
_Reviewers_: @daneshk  
_Created_: 2021/12/10  
_Updated_: 2023/01/31  
_Edition_: Swan Lake

## Introduction
This is the specification for the Xmldata standard library of [Ballerina language](https://ballerina.io/), which provides APIs to perform conversions between XML and JSON/Ballerina records.

The Xmldata library specification has evolved and may continue to evolve in the future. The released versions of the specification can be found under the relevant Github tag.

If you have any feedback or suggestions about the library, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-standard-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community feedback is always welcome. Any accepted proposal, which affects the specification is stored under `/docs/proposals`. Proposals under discussion can be found with the label `type/proposal` in Github.

The conforming implementation of the specification is released and included in the distribution. Any deviation from the specification is considered a bug.

## Contents
1. [Overview](#1-overview)
2. [Data structure](#2-data-structure)
    * 2.1. [JSON](#21-json)
    * 2.2. [XML](#22-xml)
    * 2.3. [Map](#23-map)
    * 2.4. [Record](#24-record)
3. [Rules](#3-rules)
    * 3.1. [Rules for XML to JSON Conversion](#31-rules-for-xml-to-json-conversion)
    * 3.2. [Rules for XML to Record Conversion](#32-rules-for-xml-to-record-conversion)
    * 3.3. [Rules for JSON to XML Conversion](#33-rules-for-json-to-xml-conversion)
    * 3.4. [Rules between the Map and XML Conversions](#34-rules-between-the-map-and-xml-conversions)
    * 3.5. [Rules between the Ballerina record and XML Conversions](#35-rules-between-the-ballerina-record-and-xml-conversions)
4. [Operations](#4-operations)
    * 4.1. [XML to JSON Conversion](#41-xml-to-json-conversion)
        * 4.1.1. [Sample](#411-sample)
    * 4.2. [XML to Record Conversion](#42-xml-to-record-conversion)
        * 4.2.1. [Sample](#421-sample)
    * 4.3. [JSON to XML Conversion](#43-json-to-xml-conversion)
        * 4.3.1. [Sample1](#431-sample1)
        * 4.3.2. [Sample2](#432-sample2)
    * 4.4. [Ballerina record/Map to XML Conversion](#44-ballerina-recordmap-to-xml-conversion)
        * 4.4.1. [Sample1](#441-sample1)
        * 4.4.2. [Sample2](#442-sample2)
    * 4.5. [XML to Ballerina record/Map Conversion](#45-xml-to-ballerina-recordmap-conversion)
        * 4.5.1. [Sample1](#451-sample1)
        * 4.5.2. [Sample2](#452-sample2)

## 1. Overview
This specification elaborates on the functionalities available in the Xmldata library.

This package considers JSON, XML, Ballerina record and Map data structure and creates the mapping for conversion by preserving their information and structure, and provides the following conversion between XML and JSON/Ballerina records/Map.
- XML to JSON Conversion
- XML to Ballerina record Conversion
- JSON to XML Conversion
- To XML Conversion
- From XML Conversion

## 2. Data Structure

### 2.1. JSON

JSON is a textual format for representing a single or collection of following values: 
 - a simple value (string, number, boolean, null) 
 - an array of values
 - an object

### 2.2. XML

An XML value is a sequence representing the parsed content of an XML element. Values are sequences of zero or more items, where an item is one of the following:
 - element
 - text item consisting of characters
 - processing instruction
 - comment

### 2.3. Map

A map is an unordered collection of key-value pair elements. A map element is a key and value pair that maps one thing to another.
The key must in a string. The value can be of a primitive or complex data type.

### 2.4. Record

A record is just a collection of fields. Record equality works the same as map equality. 
A record type descriptor describes a type of mapping value by specifying a type separately for the value of each field.

The record can be defined as an open or a closed record according to the requirement. If a closed record is defined, 
the returned data should have those defined fields with defined types. Otherwise, this is an open record.
Hence, the returned data include both defined fields in the record and additional fields by conversion which are not defined in the record.

## 3. Rules

We have followed some set of rules for every conversion to preserve the information and structure of both input and output.

### 3.1. Rules for XML to JSON Conversion

The following rules are used during the conversion process:

- The namespaces will be omitted or added by configuring `preserveNamespaces`.
- Attributes and namespaces will be treated as regular JSON properties, and these keys have a prefix with a string to differentiate them from regular JSON properties.
- Sequences of two or more similar elements will be converted to a JSON array.
- Text nodes will be converted into a JSON property with the key as `#content`.
- PI and comments in the XML will be omitted.

The following table shows a mapping between the different forms of XML, to a corresponding matching JSON representation by considering the above rules.

|XML Type  | XML Sample | JSON Representation Type | JSON Representation of XML |
|---|---|---|---|
|Empty element | `<e/>`<br> | JSON key-Value pair <br> and value is "" | `{"e":""}` | 
|Text item  | `value`<br> |String  | `value` |
|Comment  | `<!-- value -->`<br> |Empty JSON <br> because it is not considered <br>in this mapping  | `{}` |
|PI  | `<?doc document="book.doc"?>`<br> |Empty JSON <br> because it is not considered <br>in this mapping  | `{}` |
|Empty sequence  | `` <br>|Empty  | `` |
|XML sequence, <br> with ‘element’s having <br> distinct keys  | `<key>`<br>&emsp;&emsp;`<key1>value1</key1>`<br>&emsp;&emsp;`<key2>value2</key2>`<br>`</key>`<br>| JSON object  | `{`<br>&emsp;&emsp;`"key":{`<br>&emsp;&emsp;&emsp;&emsp;`"key1":"value1",`<br>&emsp;&emsp;&emsp;&emsp;`"key2":"value2"`<br>&emsp;&emsp;`}`<br>`}` |
|XML sequence, <br> with ‘element’s having <br> identical keys  | `<keys>` <br>&emsp;&emsp;`<key>value1</key>`<br>&emsp;&emsp;`<key>value2</key>`<br>&emsp;&emsp;`<key>value3</key>`<br> `</keys>` <br>| JSON object <br> which contains JSON array  | `{`<br>&emsp;&emsp;`"keys":{`<br>&emsp;&emsp;&emsp;&emsp;`"key":["value1","value2","value3"]`<br>&emsp;&emsp;`}`<br>`}` |
|XML sequence, <br> containing items of type <br> Element and Text  | `<key>`<br>&emsp;&emsp;`value1 Value2 `<br>&emsp;&emsp;`<key1>value3</key1>`<br>&emsp;&emsp;`<key2>value4</key2>`<br>`</key>`<br>| JSON object <br> with text value and <br> that key is ’#content’  | `{`<br>&emsp;&emsp;`"key":{`<br>&emsp;&emsp;&emsp;&emsp;`"#content":"value1 Value2",`<br>&emsp;&emsp;&emsp;&emsp;`"key1":"value3",`<br>&emsp;&emsp;&emsp;&emsp;`"key2":"value4"`<br>&emsp;&emsp;`}`<br>} |
|XML with attribute  | `<foo key="value">5</foo>`<br>| JSON object. <br> Here, attribute has ‘@’ prefix  | `{`<br>&emsp;&emsp;`"foo": {`<br>&emsp;&emsp;&emsp;&emsp;`"@key": "value",`<br>&emsp;&emsp;&emsp;&emsp;`"#content": "5"`<br>&emsp;&emsp;`}`<br>`}` <br>|
|XML with attribute and namespace  | `<foo key="value"` <br>` xmlns:ns0="http://sample.com">5</foo>`<br> | JSON object. <br> Here, attribute and namespace <br> have ‘@’ prefix | `{`<br>&emsp;&emsp;`"foo":{`<br>&emsp;&emsp;&emsp;&emsp;`"@key":"value",`<br>&emsp;&emsp;&emsp;&emsp;`"@xmlns:ns0":"<http://sample.com>",`<br>&emsp;&emsp;&emsp;&emsp;`"#content":"5"`<br>&emsp;&emsp;`}`<br>`}` |

### 3.2. Rules for XML to Record Conversion

This conversion also follows all the rules which will be applied during the XML to the JSON conversion process except the attributes and namespaces rule. Here, attributes and namespaces key will be converted with a prefix as `_` in the record.

The table shows a mapping of XML with attribute and namespace to JSON.

|XML Type  | XML Sample | Record Representation Type | Record Representation of XML |
|---|---|---|---|
|XML with attribute | `<foo key="value">5</foo>`<br> | JSON object. <br> Here, attribute has ‘_’ prefix. | `{`<br>&emsp;&emsp;`"foo": {`<br>&emsp;&emsp;&emsp;&emsp;`"_key": "value",`<br>&emsp;&emsp;&emsp;&emsp;`"#content": "5"`<br>&emsp;&emsp;`}`<br>| 
|XML with attribute and namespace  | `<foo key="value"`<br>` xmlns:ns0="http://sample.com">5</foo>`<br> |JSON object. <br> Here, attribute and namespace <br> have ‘_’ prefix.  | `{`<br>&emsp;&emsp;`"foo":{`<br>&emsp;&emsp;&emsp;&emsp;&emsp;`"_key":"value",`<br>&emsp;&emsp;&emsp;&emsp;&emsp;`"_xmlns:ns0":"<http://sample.com>",`<br>&emsp;&emsp;&emsp;&emsp;&emsp;`"#content":"5"`<br>&emsp;&emsp;`}`<br>`}` |

### 3.3. Rules for JSON to XML Conversion

The following rules are used during the conversion process:

- A default root element will be created while the following scenarios:
    - When JSON is a JSON array
      ```ballerina
       json data = [
          {
             "@writer": "Christopher",
             lname: "Nolan",
             age: 30,
             address: ["Uduvil"]
          },
          1
       ];
      ```
    - When JSON data contains multiple key-value pairs
       ```ballerina
        json data = {
                       fname: "John",
                       lname: "Stallone"
              };
       ```
- JSON array entries will be converted to individual XML elements.
- For a JSON primitive value, convert the value as the text node of the XML element.
- If JSON properties' keys have the prefix and that value is the same with `attributePrefix` value which is defined in the `JsonOptions`, those will be handled as attributes and namespaces in the XML.

The following table shows a mapping between the different forms of XML, to a corresponding matching JSON representation by considering the above rules.

|JSON Type  | JSON Sample | XML Representation Type | XML Representation of XML |
|---|---|---|---|
|JSON object has single <br> key-value and value is "" | `{"e":""}` | Empty element | `<root><e/></root>`<br> | 
|Empty JSON  | `` | Empty Sequence  | `` <br>|
|Single value<br>(string, number, boolean) | value | XML text | `value` <br>|
|Null | `null` | Empty sequence  | `` <br>|
|JSON object with <br> single key-value | `{`<br>&emsp;&emsp;`"Store": {`<br>&emsp;&emsp;&emsp;&emsp;`"name": "Anne",`<br>&emsp;&emsp;&emsp;&emsp;`"address": {`<br>&emsp;&emsp;&emsp;&emsp;&emsp;`"street": "Main",`<br>&emsp;&emsp;&emsp;&emsp;&emsp;`"city": "94"`<br>&emsp;&emsp;&emsp;&emsp;`}`<br>&emsp;&emsp;`}`<br>} |XML sequence | `<root>`<br>&emsp;&emsp;`<Store>`<br>&emsp;&emsp;&emsp;&emsp;`<name>Anne</name>`<br>&emsp;&emsp;&emsp;&emsp;`<address>`<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`<street>Main</street>`<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`<city>94</city>`<br>&emsp;&emsp;&emsp;&emsp;`</address>`<br>&emsp;&emsp;`</Store>`<br>`</root>` <br>|
|JSON object with <br> distinct keys | `{`<br> &emsp; &emsp;`"key1":"value1",`<br> &emsp; &emsp;`"key2":"value2"`<br>`}` |XML sequence with `root` tag  | `<root>`<br>&emsp;&emsp;`<key1>value1</key1>`<br>&emsp;&emsp;`<key2>value2</key2>`<br>`</root>` |
|JSON array | `[`<br> &emsp; &emsp;`{`<br>&emsp;&emsp;&emsp;&emsp; `"key": "value1"`<br>&emsp;&emsp;`},`<br>&emsp;&emsp;`value2`<br>`]` |XML sequence with `root` tag  | `<root>`<br>&emsp;&emsp;`<item>`<br>&emsp;&emsp;&emsp;&emsp;`<key>value1</key>`<br>&emsp;&emsp;`</item>`<br>&emsp;&emsp;`<item>value2</item>`<br>`</root>`<br>|
|JSON object with key <br> as "#content" | `{"#content":"value1"}` | XML text | `value1` |
|JSON object with key <br> prefix as ‘@’ | `{`<br>&emsp;&emsp;`"foo": {`<br>&emsp;&emsp;&emsp;&emsp;`"@key": "value",`<br>&emsp;&emsp;&emsp;&emsp;`"@xmlns:ns0":"<http://sample.com>"`<br>&emsp;&emsp;`}`<br>} | XML element with attribute and namespace | `<root>`<br>&emsp;&emsp;`<foo key="value"` <br> `xmlns:ns0="<http://sample.com>"/>`<br>`</root>`<br> |

### 3.4. Rules between the Map and XML Conversions

The following table shows mapping the XML to the different forms of map representation.

|XML Type  | XML Sample | Map Type | Output |
|---|---|---|---|
|XML Element | `<key>value</key>` | `map<BALLERINA_PRIMITIVE_TYPE>` | `{key: "VALUE_IN_DEFINED_TYPE"}` |
|XML Element | `<key>value</key>` | `map<BALLERINA_PRIMITIVE_TYPE_ARRAY>` | `{key: "VALUE_IN_DEFINED_ARRAY_TYPE"}` |
|XML Element | `<key>value</key>` | `map<xml>` | `{#content: <key>value</key>}` |
|XML Element | `<key>value</key>` | `map<json>` | `{key: "value"}` |
|XML Sequence | `<keys><key>value</key></keys>` | `map<BALLERINA_PRIMITIVE_TYPE>` | ERROR |
|XML Sequence | `<keys><key>value</key></keys>` | `map<BALLERINA_PRIMITIVE_TYPE_ARRAY>` | ERROR |
|XML Sequence | `<keys><key>value</key></keys>` | `map<json>` | `{keys: {key: "value"}` |
|XML Sequence | `<keys><key>value</key></keys>` | `map<xml>` | `{#content: <keys><key>value</key></keys>}` |
|XML Sequence | `<keys><key>value</key></keys>` | `map<table<map<string>>>` | `{keys: table [key: "value"]}` |

The following table shows mapping the map data to a corresponding matching XML representation.

|Map Type  | Map Sample | XML |
|---|---|---|
|`map<BALLERINA_PRIMITIVE_TYPE>` | `{key1: value1, key2: value2}` | `<root>`<br> &emsp;&emsp;`<key1>value1</key1>`<br> &emsp;&emsp;`<key2>value2</key2>`<br>`</root>` |
|`map<BALLERINA_PRIMITIVE_ARRAY_TYPE>`| `{key1: [v1,v2], key2: [v3,v4]}` | `<root>`<br> &emsp;&emsp;`<key1>value1</key1>`<br> &emsp;&emsp;`<key1>value2</key1>`<br> &emsp;&emsp;`<key2>value3</key2>`<br> &emsp;&emsp;`<key2>value4</key2>`<br>`</root>` |
| `map<json>`| `{keys: {key1: value1, key2: value2}}` | `<root>`<br> &emsp;&emsp;`<keys>`<br> &emsp;&emsp;&emsp;&emsp;`<key1>value1</key1>`<br> &emsp;&emsp;&emsp;&emsp;`<key2>value2</key2>`<br> &emsp;&emsp;`</keys>`<br>`</root>` |
|`map<xml>` | `{keys: xml <key>value</key>}` | `<root>`<br> &emsp;&emsp;`<keys>`<br> &emsp;&emsp;&emsp;&emsp;`<key>value</key>`<br> &emsp;&emsp;&emsp;&emsp;`</keys>`<br>`</root>` |
|`map<table<map<string>>>`|`{keys: table [{key: "value"}]}`|`<root>`<br> &emsp; &emsp;`<keys>`<br> &emsp; &emsp; &emsp; &emsp;`<key>value</key>`<br> &emsp; &emsp;`</keys>`<br>`</root>`|
|`map<json[]>`| `{keys: [{key1: value1},{key2: value2}]}` |`<root>`<br> &emsp;&emsp;`<keys>`<br> &emsp;&emsp;&emsp;&emsp;`<key1>value1</key1>`<br> &emsp;&emsp;&emsp;&emsp;`<key2>value2</key2>`<br> &emsp;&emsp;`</keys>`<br>`</root>`|
|`map<xml[]>` | `{keys: [xml <key1>value1</key1>, xml <key2>value2</key2>]}` | `<root>`<br> &emsp;&emsp;`<keys>`<br> &emsp;&emsp;&emsp;`<key1>value1</key1>`<br> &emsp;&emsp;&emsp;`<key2>value2</key2>`<br> &emsp;&emsp;`</keys>`<br>`</root>`|

### 3.5. Rules between the Ballerina record and XML Conversions

**Basic Conversion**

The following ballerina record definitions are consistent with the OpenAPI definition to map records to XML without any additional configurations.

|Ballerina Record Definition  | OpenAPI Definition | XML format |
|---|---|---|
|**Record with single field** <br><br> type Root record { <br> &emsp;string key?; <br>}| components:<br>&emsp;schemas:<br>&emsp;&emsp;Root:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;key:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string| `<Root>`<br>&emsp;`<key>string</key>`<br>`</Root>`<br> |
|**Record with multiple key** <br><br>type Root record {  <br> &emsp;string key1?; <br> &emsp;string key2?; <br>}|components:<br>&emsp;schemas:<br>&emsp;&emsp;Root:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;key1:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string <br>&emsp;&emsp;&emsp;&emsp;key2:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string|`<Root>`<br>&emsp;`<key1>string</key1>`<br>&emsp;`<key2>string</key2>`<br>`</Root>`<br>|
|**Nested Record**<br><br>type Root record {  <br> &emsp;Store store?;  <br>}<br><br>type Store record { <br>&emsp;string name?;<br> &emsp;Address address?;<br>}<br><br>type Address record {  <br> &emsp;string street?;<br> &emsp;int city?;<br>}|components:<br>&emsp;schemas:<br>&emsp;&emsp;Root:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;store<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;name<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;address:<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;properties<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;street:<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;city<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; type: integer|`<Root>`<br>&emsp;`<store>`<br>&emsp;&emsp;`<name>string</name>`<br>&emsp;&emsp;`<address>`<br>&emsp;&emsp;&emsp;`<street>string</street>`<br>&emsp;&emsp;&emsp;`<city>0</city>`<br>&emsp;&emsp;`/address>`<br>&emsp;`</store>`<br>`</Root>`|
|**Array**<br><br>type Root record {<br> &emsp; string[] key?; <br>}|Root:<br>&emsp;type: object<br>&emsp;properties<br>&emsp;&emsp;key:<br>&emsp;&emsp;&emsp;type: array<br>&emsp;&emsp;items<br>&emsp;&emsp;&emsp;type: string|`<Root>`<br>&emsp;`<key>string</key>`<br>&emsp;`<key>string</key>`<br>`</Root>`<br>|
|**Record field type as XML** <br><br>type Root record {  <br>&emsp;xml key?; <br>}|components:<br>&emsp;schemas<br>&emsp;&emsp;Root:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties<br>&emsp;&emsp;&emsp;&emsp;key:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: object|`<Root>`<br>&emsp;&emsp;&emsp;`<key>`<br>&emsp;&emsp;&emsp;&emsp;`xml object`<br>&emsp;&emsp;&emsp;`</key>`<br>`</Root>`<br>|
|**Record field type as table** <br><br>table<map<string>> t = table [{key:"value"}]; <br><br> type Root record { <br>&emsp;table key?; <br>}|components:<br>&emsp;schemas:<br>&emsp;&emsp;Root:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;key:<br>&emsp;&emsp;&emsp;&emsp;type: array<br>&emsp;&emsp;&emsp;items<br>&emsp;&emsp;&emsp;&emsp;type: object|`<Root>`<br>&emsp;`<key>xml object</key>`<br>&emsp;`<key>xml object</key>`<br>`</Root>`|
|**Required Field**<br><br>type Root record {  <br>&emsp;int id; <br>&emsp;string uname; <br>&emsp;string name?; <br>}|components:<br>&emsp;schemas:<br>&emsp;&emsp;root:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;id<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: integer<br>&emsp;&emsp;&emsp;&emsp;uname:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;name:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;required:<br>&emsp;&emsp;&emsp;&emsp;&emsp;- id<br>&emsp;&emsp;&emsp;&emsp;&emsp;- uname|`<Root>`<br>&emsp;`<id>0</id>`<br>&emsp;`<uname>string</uname>`<br>&emsp;`<name>string</name>`<br>`</Root>`|
|**Close record**<br><br> type Person record {&#124;<br>&emsp;string name;<br>&#124;};|components:<br>&emsp;schemas<br>&emsp;&emsp; Person:<br>&emsp; &emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;&emsp;properties<br>&emsp;&emsp;&emsp; name:<br>&emsp;&emsp;&emsp;&emsp; type: string<br>&emsp;&emsp;&emsp;required<br>&emsp;&emsp;&emsp;&emsp; - name<br>&emsp;&emsp;&emsp;additionalProperties: false|`<Preson>`<br>&emsp;`<name>string</name>`<br>`</Person>`|
|**open record** <br><br>type Person record {<br>&emsp;string name;<br>};|components:<br>&emsp;schemas<br>&emsp;&emsp; Person:<br>&emsp; &emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;&emsp;properties<br>&emsp;&emsp;&emsp; name:<br>&emsp;&emsp;&emsp;&emsp; type: string<br>&emsp;&emsp;&emsp;required<br>&emsp;&emsp;&emsp;&emsp; - name<br>&emsp;&emsp;&emsp;additionalProperties: true|`<Preson>`<br>&emsp;`<name>string</name>`<br>&emsp;`<id>string</id>`<br>`</Person>`|
|**Union Type Field**<br><br>type Location record { <br>&emsp; string\|Address address?; <br>}<br><br>type Address record { <br>&emsp;int id;<br>&emsp;string uname;<br>&emsp;string name?; <br>}|components:<br>&emsp;schemas<br>&emsp;&emsp;Location:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;key<br>&emsp;&emsp;&emsp;&emsp;&emsp;oneOf<br>&emsp;&emsp;&emsp;&emsp;&emsp; - $ref: '#/components/schemas/Address'<br>&emsp;&emsp;&emsp;&emsp;&emsp;- type: string     <br>&emsp;&emsp;Address:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp; id:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: integer<br>&emsp;&emsp;&emsp;&emsp;username:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;name:<br>&emsp;&emsp;&emsp;&emsp;&emsp; type: string<br>&emsp;&emsp;&emsp;&emsp;required:<br>&emsp;&emsp;&emsp;&emsp;&emsp; - id<br>&emsp;&emsp;&emsp;&emsp;&emsp;- uname|`<Location>`<br>&emsp;`<address>`<br>&emsp;&emsp;`<id>0</id>`<br>&emsp;&emsp;`<uname>string</uname>`<br>&emsp;&emsp;`<name>string</name>`<br>&emsp;`</address>`<br>`</Location>` <br><br>OR<br><br>`<Location>`<br>&emsp;`<address>string</address>`<br>`</Location>`|

**Conversion with Attributes and Namespaces**

The OpenAPI definition has metadata objects that allow for more fine-tuned XML model definitions. You can find those here.  https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#fixed-fields-22

So, In Ballerina, we are going to introduce some annotations to support this metadata.

|OpenAPI metadata | OpenAPI Definition | Ballerina Record Definition <br> with annotation | XML format|
|---|---|---|---|
|XML Name <br> Replacement|components:<br>&emsp; schemas:<br>&emsp;&emsp; animals:<br>&emsp;&emsp; &emsp;  type: object<br>&emsp;&emsp; &emsp; properties:<br>&emsp;&emsp; &emsp; &emsp;  id:<br>&emsp;&emsp; &emsp; &emsp; &emsp;  type: integer<br>&emsp; &emsp;&emsp; &emsp;  **xml:**<br>&emsp;&emsp;&emsp; &emsp;&emsp;  **name: ID**<br>&emsp; &emsp; &emsp; **xml:**<br>&emsp;&emsp;&emsp;  &emsp;**name: animal**|**@xmldata:name {**<br>&emsp;**value: animal**<br>**}** <br>type animals record {<br>&emsp;**@xmldata:name{**<br>&emsp;&emsp;**value: ID**<br>&emsp;**}**<br>&emsp; string id?;<br>};|`<animal>`<br>&emsp;`<ID>0</ID>`<br>`</animal>`|
|XML Attribute|components:<br>&emsp;schemas:<br>&emsp;&emsp;Pline:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;discount:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;&emsp;**xml:**<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**attribute: true**|type Pline record {<br>&emsp;**@xmldata:attribute**<br>&emsp;int discount?;<br>};| `<Pline discount= "string">`<br>`</Pline>`|
|XML Namespace|components:<br>&emsp;schemas:<br>&emsp;&emsp;Root<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp; **xml:** <br>&emsp;&emsp;&emsp; **prefix: ns0** <br>&emsp;&emsp;&emsp; **namespace: 'http://www.w3.org/'** |**@xmldata:namespace {** <br>&emsp; **prefix:"nso",** <br> &emsp; **uri = "http://www.w3.org/"** <br> **}** <br>type Root record {};|`<ns0:Root xmlns:ns0 = "http://www.w3.org/">`<br>`</ns0:Root>`|
|XML Namespace <br> and Prefix|components:<br>&emsp;schemas:<br>&emsp;&emsp;Pline:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;**xml:**<br>&emsp;&emsp;&emsp;&emsp;**prefix: 'nso'**<br>&emsp;&emsp;&emsp;&emsp; **namespace: 'http://www.w3.org/'** <br>&emsp;&emsp;&emsp;properties<br>&emsp;&emsp;&emsp;&emsp;foo:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;&emsp; **xml:** <br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **prefix: 'nso'** | **@xmldata:namespace {** <br>&emsp; **prefix: "nso",** <br>&emsp;**uri = "http://www.w3.org/" **<br>**}** <br>type Pline record {<br>&emsp; **@xmldata:namespae{** <br>&emsp;&emsp; **prefix: "nso"** <br>&emsp; **}** <br>&emsp;string foo;<br>};|`<nso:Pline xmlns:ns0="http://www.w3.org/">`<br>&emsp;`<nso:foo></nso:foo>`<br>`</nso:Pline>`|
|XML Prefix with Namespaces <br><br> **Noted:** OpenAPI <br> Specification <br>[does not support](https://github.com/OAI/OpenAPI-Specification/issues/1456) <br> multiple XML <br> namespaces <br> within a single element. <br>As a workaround, <br>we can define additional <br>namespaces as <br>regular attributes <br>(that is, schema <br>properties with xml.attribute=true)|components:<br>&emsp;schemas:<br>&emsp;&emsp;Root<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties<br>&emsp;&emsp;&emsp;&emsp;key:<br>&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;&emsp;&emsp; **xmlns:asd** <br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **enum<br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;- 'http://www.w3.org/'** <br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **xml** <br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **attribute: true** <br>&emsp;&emsp;&emsp;&emsp;&emsp; **xml:** <br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **prefix: 'ns0'** <br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **namespace: 'http://www.w3.org/'** | **@xmldata:namespace {**<br>&emsp; **prefix:"nso"**, <br>&emsp; **uri = "http://www.w3.org/"** <br> **}** <br>type Root record {<br>&emsp;string key?;<br>&emsp; **@xmldata:attribute** <br>&emsp; **string xmlns\:asd = "http://www.w3.org/"** ;<br>};|`<ns0:root xmlns:ns0="http://www.w3.org/" xmlns:asd="http://www.w3.org/">`<br>&emsp;`<key>string</key>`<br>`</ns0:root>`|
|Signifies whether <br>the array is wrapped or not.|One of the below open <br> API definitions can be used to <br>define the ballerina record array field definition. <br>So, we don’t need to introduce <br>new annotations for wrapped metadata.<br><br>1. Unwrap array definition<br>components:<br>&emsp;schemas:<br>&emsp;&emsp;root:<br>&emsp;&emsp;&emsp;type: object<br>&emsp;&emsp;&emsp;properties:<br>&emsp;&emsp;&emsp;&emsp;root<br>&emsp;&emsp;&emsp;&emsp;&emsp;type:array<br>&emsp; &emsp;&emsp;&emsp;&emsp;&emsp;items: <br>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;type: string<br><br>2. Wrap array definition.<br>components:<br>&emsp;schemas:<br>&emsp;&emsp;root:<br>&emsp;&emsp;&emsp;type: array<br>&emsp; &emsp;&emsp;&emsp;items:<br>&emsp; &emsp;&emsp;&emsp;&emsp;type: string<br>&emsp;&emsp;&emsp;xml:<br>&emsp;&emsp;&emsp;wrapped: true|type root record {  <br>&emsp;string[] root?; <br>}|`<root>`<br>&emsp;`<root>string</root>`<br>`</root>`|

**Convert XML element with attributes(Unsupported in OpenAPI)**

OpenAPI does not support XML which has elements with attributes.
For more info, please see this issue: [https://github.com/OAI/OpenAPI-Specification/issues/630](https://github.com/OAI/OpenAPI-Specification/issues/630)

But this use-case is commonly used in XML. Therefore, In Ballerina, we support through special field name `#content` like below.

|Ballerina Record Definition | XML Sample | 
|---|---|
|type PLine record {<br>&emsp; ItemCode itemCode?;<br>}<br><br>type ItemCode record { <br>&emsp; string discount?;<br>&emsp;&emsp;int \#content?;// If the value doesn't have a key, <br> can initialize that value with the default ey name`#content`<br>}|`<PLine>`<br>&emsp;`<itemCode discount=22%>`<br>&emsp;&emsp;`200777`<br>&emsp;`</itemCode>`<br>`</PLine>`|

## 4. Operations

### 4.1. XML to JSON Conversion

XML to JSON conversion is a mapping between the different forms of XML to a corresponding matching JSON representation.
The following API returns the JSON data to the given XML structure by configuring the `XmlOptions`.
```ballerina
public isolated function toJson(xml xmlValue, XmlOptions options = {}) returns json|Error
```

The `XmlOptions` is used to configure the attribute and namespace prefix and add or eliminate the namespace in the JSON data.
```ballerina
public type XmlOptions record {
    string attributePrefix = "@";
    boolean preserveNamespaces = true;
};
```

#### 4.1.1. Sample

```ballerina
xml input = xml `<ns0:bookStore status="online" xmlns:ns0="http://sample.com/test">
                    <ns0:storeName>foo</ns0:storeName>
                    <ns0:postalCode>94</ns0:postalCode>
                    <ns0:isOpen>true</ns0:isOpen>
                    <ns0:address>
                        <ns0:street>foo</ns0:street>
                        <ns0:city>94</ns0:city>
                        <ns0:country>true</ns0:country>
                    </ns0:address>
                    <ns0:codes>
                        <ns0:code>4</ns0:code>
                        <ns0:code>8</ns0:code>
                        <ns0:code>9</ns0:code>
                    </ns0:codes>
                </ns0:bookStore>
                <!-- some comment -->
                <?doc document="book.doc"?>`;
```

The JSON representation of the above XML with the default configuration of the above API.

```ballerina
{
    "ns0:bookStore": {
        "ns0:storeName": "foo",
        "ns0:postalCode": "94",
        "ns0:isOpen": "true",
        "ns0:address": {
            "ns0:street": "No 20, Palm Grove",
            "ns0:city": "Colombo 03",
            "ns0:country": "Sri Lanka"
        },
        "ns0:codes": {
            "ns0:code":["4","8","9"]
        },
        "@xmlns:ns0":"http://sample.com/test",
        "@status":"online"
    }
}
```

When `attributePrefix` is `&` and `preserveNamespaces` is `false`, the JSON representation of the above XML
```ballerina
{
    "bookStore":{
        "storeName":"foo",
        "postalCode":"94",
        "isOpen":"true",
        "address":{
            "street":"foo",
            "city":"94",
            "country":"true"
        },
        "codes":{
            "code":["4","8","9"]
        }
    }
}
```
### 4.2. XML to Record Conversion
This conversion is a mapping between the different forms of XML to a corresponding matching Ballerina record representation.
The following API returns the record to the given XML structure by configuring the `preserveNamespaces` and `returnType`.
```ballerina
public isolated function toRecord(xml xmlValue, boolean preserveNamespaces = true, typedesc<record {}> returnType = <>) returns returnType|Error
```

#### 4.2.1. Sample

```ballerina
xml input = xml `<ns0:bookStore status="online" xmlns:ns0="http://sample.com/test">
                    <ns0:storeName>foo</ns0:storeName>
                    <ns0:postalCode>94</ns0:postalCode>
                    <ns0:isOpen>true</ns0:isOpen>
                    <ns0:address>
                        <ns0:street>foo</ns0:street>
                        <ns0:city>94</ns0:city>
                        <ns0:country>true</ns0:country>
                    </ns0:address>
                    <ns0:codes>
                        <ns0:code>4</ns0:code>
                        <ns0:code>8</ns0:code>
                        <ns0:code>9</ns0:code>
                    </ns0:codes>
                </ns0:bookStore>
                <!-- some comment -->
                <?doc document="book.doc"?>`;
```

The record representation of the above XML with the default configuration of this API.

```ballerina
{
    "ns0:bookStore": {
        "ns0:storeName": "foo",
        "ns0:postalCode": "94",
        "ns0:isOpen": "true",
        "ns0:address": {
            "ns0:street": "No 20, Palm Grove",
            "ns0:city": "Colombo 03",
            "ns0:country": "Sri Lanka"
        },
        "ns0:codes": {
            "ns0:code":["4","8","9"]
        },
        "_xmlns:ns0":"http://sample.com/test",
        "_status":"online"
    }
}
```

If `returnType` is configured for the above output, it must be specified in the following format with the open/closed record type.

```ballerina
type BookStores record {|
    BookStore ns0\:bookStore;
|};

type BookStore record {|
    string ns0\:storeName;
    string ns0\:postalCode;
    string ns0\:isOpen;
    Address ns0\:address;
    Codes ns0\:codes;
    string _status;
    string _xmlns\:ns0;
|};

type Address record {|
    string ns0\:street;
    string ns0\:city;
    string ns0\:country;
|};

type Codes record {|
    string[] ns0\:code;
|};
```

When `preserveNamespaces` is `false`(without namespaces), the output of the above XML.

```ballerina
{
   "bookStore":{
      "storeName":"foo",
      "postalCode":"94",
      "isOpen":"true",
      "address":{
         "street":"foo",
         "city":"94",
         "country":"true"
      },
      "codes":{
         "code":["4","8","9"]
      },
      "_status":"online"
   }
}
```

If `returnType` is configured for the above output(without namespaces), it must be specified in the following format with the open/closed record type.

```ballerina
type BookStores record {|
    BookStore bookStore;
|};

type BookStore record {|
    string storeName;
    string postalCode;
    string isOpen;
    Address address;
    Codes codes;
    string _status;
|};

type Address record {|
    string street;
    string city;
    string country;
|};

type Codes record {|
    string[] code;
|};
```

### 4.3. JSON to XML Conversion

This conversion provides a mapping between the different forms of JSON, to a corresponding matching XML representation.
The following API returns the JSON data to the given XML structure by configuring the `JsonOptions`.
```ballerina
public isolated function fromJson(json jsonValue, JsonOptions options = {}) returns xml?|Error
```

The `JsonOptions` is used to configure the attribute prefix for the JSON and root and array entry tags for XML. 
Array entry tag is used to create a tag when JSON array is in without keys.
```ballerina
public type JsonOptions record {
    string attributePrefix = "@";
    string arrayEntryTag = "item";
    string rootTag = "root";
};
```

#### 4.3.1. Sample1

```ballerina
json input = {
    "ns0:bookStore": {
        "ns0:storeName": "foo",
        "ns0:postalCode": "94",
        "ns0:isOpen": "true",
        "ns0:address": {
            "ns0:street": "No 20, Palm Grove",
            "ns0:city": "Colombo 03",
            "ns0:country": "Sri Lanka"
        },
        "ns0:codes": {
            "ns0:code":["4","8","9"]
        },
        "@xmlns:ns0":"http://sample.com/test",
        "@status":"online",
    }
};
```
The XML representation of the above JSON with the default configuration of this API.

```ballerina
<ns0:bookStore xmlns:ns0="http://sample.com/test" status="online">
    <storeName>foo</storeName>
    <postalCode>94</postalCode>
    <isOpen>true</isOpen>
    <address>
        <street>No 20, Palm Grove</street>
        <city>Colombo 03</city>
        <country>Sri Lanka</country>
    </address>
    <codes>
        <code>4</code>
        <code>8</code>
        <code>9</code>
    </codes>
</ns0:bookStore>
```

#### 4.3.2. Sample2

```ballerina
json input = {
    "books": [
        [
            {
                "&xmlns:ns0": "http://sample.com/test",
                "&writer": "Christopher",
                "bookName": "book1",
                "bookId": 101
            }
        ],
        [
            {
                "@writer": "John",
                "bookName": "book2",
                "bookId": 102
            }
        ]
    ]
};
```

When `attributePrefix` is `&` and `arrayEntryTag` is `list`, the XML representation of the above JSON.

```ballerina
<root>
    <books>
        <list xmlns:ns0="http://sample.com/test" writer="Christopher">
            <bookName>book1</bookName>
            <bookId>101</bookId>
        </list>
    </books>
    <books>
        <list writer="John">
            <bookName>book2</bookName>
            <bookId>102</bookId>
        </list>
    </books>
</root>
```

### 4.4. Ballerina record/Map to XML Conversion
This conversion provides a mapping between the different forms of Ballerina record/Map, to a corresponding matching XML representation.
The following API returns the XML data to the given Ballerina record/Map. 
The record has annotations to configure namespaces and attributes, 
but other types(map<BALLERINA_PRIMITIVE_TYPE>|map<BALLERINA_PRIMITIVE_TYPE[]>|map<json>|map<xml>|map<json[]>|map<xml[]>|map<table<map<string>>>) don't have these.
```ballerina
public isolated function toXml(map<anydata> mapValue) returns xml|Error
```

The following annotations are used to configure the name, namespace, and attribute.
```ballerina
# Defines the new name of the name.
#
# + value - The value of the new name
public type NameConfig record {|
    string value;
|};

# The annotation is used to specify the new name of the existing record name or field name according to the XML format.
public annotation NameConfig Name on type, record field;
```

```ballerina
# Defines the namespace of the XML element
#
# + prefix - The value of the prefix of the namespace
# + uri - The value of the URI of the namespace
public type NamespaceConfig record {|
    string prefix;
    string uri?;
|};

# The annotation is used to specify the namespace's prefix and URI of the XML element.
public annotation NamespaceConfig Namespace on type, record field;
```

```ballerina
# The annotation is used to denote the field that is considered an attribute.
public annotation Attribute on record field;
```
#### 4.4.1. Sample1
```ballerina
@xmldata:Name {
    value: "Customers"
}
@xmldata:Namespace {
    prefix: "ns",
    uri: "http://sdf.com"
}
type Customer record {

    @xmldata:Name {
        value: "employeeName"
    }
    @xmldata:Attribute
    string ns\:name;

    int age;
};

Customer input = { name: "Asha", age: 10 };
```
The XML representation of the above Record:

```ballerina
<ns:Customers xmlns:ns="http://sdf.com" ns:employeeName="Asha">
    <age>10</age>
</ns:Customers>
```

#### 4.4.2. Sample2

```ballerina
map<string> input = {
    "series": "Dark",
    genre: "Sci-Fi"
};
```
The XML representation of the above map:

```ballerina
<root>
    <series>Dark</series>
    <genre>Sci-Fi</genre>
</root>;
```

### 4.5. XML to Ballerina record/Map Conversion
his conversion is a mapping between the different forms of XML to a corresponding matching Ballerina record/Map representation.
The following API returns the record/map to the given XML structure. The namespaces and attributes will not be considered a special case.
```ballerina
public isolated function fromXml(xml xmlValue, typedesc<(map<anydata>)> returnType = <>) returns returnType|Error
```

#### 4.5.1. Sample1
```ballerina
type Commercial record {
    BookStore bookstore;
};

type BookStore record {
    xml storeName;
    int postalCode;
    boolean isOpen;
    xml address;
    xml codes;
    @Attribute
    string status;
    @Attribute
    string 'xmlns\:ns0;
};

type Address record {
    string street;
    string city;
    string country;
};

type Codes record {
    int[] item;
};

xml input = xml `<bookstore status="online" xmlns:ns0="http://sample.com/test">
                            <storeName>foo</storeName>
                            <postalCode>94</postalCode>
                            <isOpen>true</isOpen>
                            <address>
                                <street>Galle Road</street>
                                <city>Colombo</city>
                                <country>Sri Lanka</country>
                            </address>
                            <codes>
                                <item>4</item>
                                <item>8</item>
                                <item>9</item>
                            </codes>
                        </bookstore>
                        <!-- some comment -->
                        <?doc document="book.doc"?>`;
```
The record representation of the above XML with the returned record type as `Commercial`.
```ballerina
Commercial output = {
    bookstore: {
        storeName: xml `foo`,
        postalCode: 94,
        isOpen: true,
        address: xml `<street>Galle Road</street><city>Colombo</city><country>Sri Lanka</country>`,
        codes: xml `<item>4</item><item>8</item><item>9</item>`,
        'xmlns\:ns0: "http://sample.com/test",
        status: "online"
    }
};
```
#### 4.5.2. Sample2

```ballerina
xml xmlData = xml `<Invoice xmlns="example.com" attr="attr-val" xmlns:ns="ns.com" ns:attr="ns-attr-val">
                        <PurchesedItems>
                            <PLine><ItemCode>223345</ItemCode><Count>10</Count></PLine>
                            <PLine><ItemCode>223300</ItemCode><Count>7</Count></PLine>
                            <PLine><ItemCode discount="22%">200777</ItemCode><Count>7</Count></PLine>
                        </PurchesedItems>
                        <Address xmlns="">
                            <StreetAddress>20, Palm grove, Colombo 3</StreetAddress>
                            <City>Colombo</City>
                            <Zip>00300</Zip>
                            <Country>LK</Country>
                        </Address>
                    </Invoice>`;
```
The map<json> representation of the above XML.

```ballerina
map<json> output = {
        Invoice: {
            PurchesedItems: {
                PLine: [
                    {ItemCode: "223345", Count: "10"},
                    {ItemCode: "223300", Count: "7"},
                    {
                        ItemCode: {"discount": "22%", "#content": "200777"},
                        Count: "7"
                    }
                ]
            },
            Address: {
                StreetAddress: "20, Palm grove, Colombo 3",
                City: "Colombo",
                Zip: "00300",
                Country: "LK",
                "xmlns": ""
            },
            "xmlns:ns": "ns.com",
            "xmlns": "example.com",
            "attr": "attr-val",
            "ns:attr": "ns-attr-val"
        }
    };
```