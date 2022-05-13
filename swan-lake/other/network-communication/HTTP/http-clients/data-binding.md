---
layout: ballerina-left-nav-pages-swanlake
title: Data binding
description: The sections below explain the how to perform data binding with HTTP clients.
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/http/http-clients/data-binding/
active: data-binding
intro: The sections below explain the how to perform data binding with HTTP clients.  
redirect_from:
  - /learn/network-communication/http/http-clients/data-binding
  - /swan-lake/learn/network-communication/http/http-clients/data-binding/
  - /swan-lake/learn/network-communication/http/http-clients/data-binding
  - /learn/network-communication/http/http-clients/data-binding/
  - /learn/network-communication/http/http-clients/data-binding
  - /learn/user-guide/network-communication/http/http-clients/data-binding
  - /learn/network-communication/http/data-binding/
  - /learn/network-communication/http/data-binding
redirect_to:
  - https://lib.ballerina.io/ballerina/http/latest/
---

[`http:Client`](https://docs.central.ballerina.io/ballerina/http/latest/clients/HttpClient) data binding happens automatically based on the left hand side type. The left hand side type could be any type such as `string`, `json`, `xml`, `map<json>`, `byte[]`, custom record, and record array types. 

In the data binding, any HTTP response that returns the 4xx or 5xx status codes are considered as error situations. Therefore, the [`get`](https://docs.central.ballerina.io/ballerina/http/latest/clients/Client#get) remote method will return the error value of the [`http:ClientError`](https://docs.central.ballerina.io/ballerina/http/latest/errors#ClientError) type. 

## Using JSON and XML in data binding

The `data_binding_example_one.bal` below illustrates an example of using JSON and XML in data binding.

**data_binding_example_one.bal**

```ballerina
import ballerina/http;
import ballerina/io;
 
public function main() returns @tainted error? {
   http:Client clientEp = check new("https://freegeoip.app");

   json jp = check clientEp->get("/json/");
   io:println("JSON Payload:\n", jp, "\n");

   xml xp = check clientEp->get("/xml/");
   io:println("XML Payload:\n", xp);
}
```

Execute the `bal run data_binding_example_one.bal` command and the output will be as follows.

```bash
JSON Payload:
{"ip":"45.30.94.9","country_code":"US","country_name":"United States","region_code":"CA","region_name":"California","city":"San Jose","zip_code":"95134","time_zone":"America/Los_Angeles","latitude":37.4073,"longitude":-121.939,"metro_code":807}

XML Payload:
<Response>
    	<IP>45.30.94.9</IP>
    	<CountryCode>US</CountryCode>
    	<CountryName>United States</CountryName>
    	<RegionCode>CA</RegionCode>
    	<RegionName>California</RegionName>
    	<City>San Jose</City>
    	<ZipCode>95134</ZipCode>
    	<TimeZone>America/Los_Angeles</TimeZone>
    	<Latitude>37.4073</Latitude>
    	<Longitude>-121.939</Longitude>
    	<MetroCode>807</MetroCode>
</Response>
```

## Using a custom record type in data binding

Similarly, the `data_binding_example_two.bal` demonstrates the usage of a custom record type in data binding.

>**Info:** In the record data binding scenario, the field names must match the fields in the returning JSON payload. 

**data_binding_example_two.bal**

```ballerina
import ballerina/http;
import ballerina/io;
 
type Location record {
   string ip;
   string country_code;
   string country_name;
   string region_code;
   string region_name;
   string city;
   string zip_code;
   string time_zone;
   float latitude;
   float longitude;
   int metro_code;
};
 
public function main() returns @tainted error? {
   http:Client clientEp = check new("https://freegeoip.app");
   Location loc = check clientEp->get("/json/");
   io:println("City/State/Country: ", string `${loc.city}, ${loc.region_code}, ${loc.country_name}`);
}
```

Execute the `bal run data_binding_example_two.bal` command and the output will be as follows.

```bash
Compiling source
    	data_binding_example_two.bal

Running executable

City/State/Country: San Jose, CA, United States
```

## What's next?

For other use cases of HTTP clients, see the topics below.
- [Multipart Message Handling](/learn/network-communication/http/multipart-message-handling)
- [Data Streaming](/learn/network-communication/http/data-streaming)
- [Communication Resiliency](/learn/network-communication/http/communication-resiliency)
- [Secure Communication](/learn/network-communication/http/secure-communication)

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
