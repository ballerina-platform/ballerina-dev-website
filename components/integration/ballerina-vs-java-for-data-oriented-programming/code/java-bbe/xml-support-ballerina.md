---
title: 'Ballerina'
description: null
---
```
import ballerina/io;
import ballerina/xmldata;

// Define a SOAP payload
xml soapPayload =
    xml `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
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

type address record {|
    string city;
    string country;
|};

public function main() returns error? {
    // Extract the SOAP payload
    xml xmlPayload = soapPayload/**/<ns:Body>;
    io:println(xmlPayload);

    // Navigate to the subcontext and extract the data
    xml person = xmlPayload/<person>;

    string name = (person/<name>).data();
    string age = (person/<age>).data();
    string city = (person/**/<city>).data();

    // Extract the sub-xml and convert it to a record
    address address = check xmldata:fromXml(person/<address>);
    string country = address.country;

    io:println(string `Name: ${name}, Age: ${age}, City: ${city}, Country: ${country}`);
}
```