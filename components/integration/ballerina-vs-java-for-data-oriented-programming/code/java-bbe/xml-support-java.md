---
title: 'Java'
description: null
---
```
import org.modelmapper.ModelMapper;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import java.io.ByteArrayInputStream;
import java.util.Iterator;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.*;

class Main {
    // Define a SOAP payload
    final static String soapPayload =
            """
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
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
            </soapenv:Envelope>""";

    public record Address(String city, String country) {
        public Address() {
            this(null, null);
        }
    }

    public static void main(String[] args) throws Exception {
        // Parse the SOAP payload
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new ByteArrayInputStream(soapPayload.getBytes()));

        // Create an XPath instance
        XPath xpath = XPathFactory.newInstance().newXPath();
        NamespaceContext nsContext = new NamespaceContext() {
            public String getNamespaceURI(String prefix) {
                if (prefix.equals("soapenv")) {
                    return "http://schemas.xmlsoap.org/soap/envelope/";
                }
                return null;
            }

            public String getPrefix(String namespaceURI) {
                return null;
            }

            public Iterator<String> getPrefixes(String namespaceURI) {
                return null;
            }
        };
        xpath.setNamespaceContext(nsContext);

        // Navigate to SOAP payload and extract the data using XPath
        String soapPayloadExpression = "/*/soapenv:Body";
        Node soapPayloadNode = (Node) xpath
                .evaluate(soapPayloadExpression, document, XPathConstants.NODE);

        String personPath = "./person";
        Node personNode = (Node) xpath.evaluate(personPath, soapPayloadNode,
                XPathConstants.NODE);

        String name = (String) xpath.evaluate("name", personNode,
                XPathConstants.STRING);
        String age = (String) xpath.evaluate("age", personNode,
                XPathConstants.STRING);
        String city = (String) xpath.evaluate("*/city", personNode,
                XPathConstants.STRING);

        // Extract the sub-xml and convert it to a record
        String addressPath = "./address";
        Node addressNode = (Node) xpath.evaluate(addressPath, personNode,
                XPathConstants.NODE);
        Address address = new ModelMapper().map(addressNode, Address.class);
        String country = address.country();

        System.out.println("Name: " + name + ", Age: " + age
                + ", City: " + city + ", Country: " + country);
    }
}
```