---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

// Define a SOAP payload
xml soapPayload = xml `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
        <person>
            <name>John Doe</name>
            <age>30</age>
            <address>
                <city>New York</city>
                <country>USA</country>
            </address>
        </person>
    </soapenv:Body>
</soapenv:Envelope>`;

xmlns "http://schemas.xmlsoap.org/soap/envelope/" as ns;

public function main() returns error? {
    // Extract the SOAP payload
    xml xmlPayload = soapPayload/**/<ns:Body>;
    io:println(xmlPayload);

    // Navigate to the subcontext and extract the data
    xml person =  xmlPayload/<person>;

    string name = (person/<name>).data();
    string age = (person/<age>).data();
    string city = (person/**/<city>).data();
    string country = (person/<address>/<country>).data();

    io:println(string `Name: ${name}, Age: ${age}, City: ${city}, Country: ${country}`);
}
```