---
title: 'Java'
description: null
---
```
import org.json.JSONObject;
import org.json.XML;

public class Main {
    public static void main(String[] args) {
        String jsonString = "{\"Store\":{\"@id\":\"AST\",\"name\":\"Anne\",\"Address\":{\"street\":\"Main\",\"city\":\"94\"},\"codes\":[\"4\",\"8\"]}}";

        // Convert JSON string to JSON object
        JSONObject jsonObject = new JSONObject(jsonString);

        // Convert JSON object to XML string
        String xmlString = XML.toString(jsonObject);

        // Convert XML string to XML elements
        org.w3c.dom.Document document = XML.toJSONObject(xmlString).getOwnerDocument();
        org.w3c.dom.Element rootElement = document.getDocumentElement();

        // Get the values from the XML elements
        String id = rootElement.getAttribute("id");
        String name = rootElement.getElementsByTagName("name").item(0).getTextContent();
        String street = rootElement.getElementsByTagName("street").item(0).getTextContent();
        String city = rootElement.getElementsByTagName("city").item(0).getTextContent();

        // Print the values
        System.out.println(name + " lives in " + street + " street, " + city);
    }
}
```