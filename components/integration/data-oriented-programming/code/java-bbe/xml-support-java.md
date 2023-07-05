---
title: 'Java'
description: null
---
```
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
    static String soapPayload = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">\n" +
            "    <soapenv:Body>\n" +
            "        <person>\n" +
            "            <name>John Doe</name>\n" +
            "            <age>30</age>\n" +
            "            <address>\n" +
            "                <city>New York</city>\n" +
            "                <country>USA</country>\n" +
            "            </address>\n" +
            "        </person>\n" +
            "    </soapenv:Body>\n" +
            "</soapenv:Envelope>";

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

        // // Navigate to SOAP payload and extract the data using XPath
        String soapPayloadExpression = "/*/soapenv:Body";
        Node soapPayloadNode = (Node) xpath.evaluate(soapPayloadExpression, document, XPathConstants.NODE);

        String expression = "./person";
        Node personNode = (Node) xpath.evaluate(expression, soapPayloadNode, XPathConstants.NODE);

        String name = (String) xpath.evaluate("name", personNode, XPathConstants.STRING);
        String age = (String) xpath.evaluate("age", personNode, XPathConstants.STRING);
        String city = (String) xpath.evaluate("*/city", personNode, XPathConstants.STRING);
        String country = (String) xpath.evaluate("address/country", personNode, XPathConstants.STRING);

        System.out.println("Name: " + name + ", Age: " + age + ", City: " + city + ", Country: " + country);
    }
}
```