---
title: 'JSON? Ballerina is JSON'
description: Javascript is JSON, and so is Ballerina. Plain data in Ballerina bear a natural resemblance to JSON values, simplifying the manipulation of JSON data. You can use the in-built `json` type if that’s your thing! Otherwise, convert to domain types for type-safe handling.
url: 'https://github.com/ballerina-guides/integration-samples/tree/main/working_with_json/main.bal'
---
```
type InvoiceItem record {
    string id;
    decimal price;
    boolean taxable;
};

type Customer record {
    string id;
    string name;
};

type Invoice record {
    string id;
    Customer customer;
    InvoiceItem[] items;
};

public function main() returns error?{
    json invoiceData = check io:fileReadJson("./invoice.json");

    // Enjoy lax static typing here!
    // Fails at runtime if the key is not present or the value is not a string.
    string id = check invoiceData.id;

    // Fails at runtime if the key is not present.
    json items = check invoiceData.items;

    // Converts to the domain type.
    // Fails at runtime if the json value does not match the type.
    Invoice invoice = check invoiceData.fromJsonWithType();

    // Enjoy type-safe handling of json values.
    id = invoice.id;
    InvoiceItem[] invoiceItems = invoice.items;
}
```