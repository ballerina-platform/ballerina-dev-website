---
title: 'Java'
description: null
---
```
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

record InvoiceItem(String id, double price, boolean taxable) {}

record Customer(String id, String name) {}

record Invoice(String id, Customer customer, List<InvoiceItem> items) {}

class Main {
    public static void main(String[] args) throws IOException {
            String invoiceData = Files.readString(Paths.get("./invoice.json"));

            // Parse the JSON string
            Gson gson = new Gson();
            JsonObject jsonObj = gson.fromJson(invoiceData, JsonObject.class);

            // Fails at runtime if the key is not present or the value is not a string.
            String id = jsonObj.get("id").getAsString();
            System.out.println("Invoice id: " + id);

            // Fails at runtime if the key is not present.
            JsonArray items = jsonObj.getAsJsonArray("items");
            System.out.println("Invoice items: " + items);

            // Results in a null value if the accessed field is not present.
            JsonObject secondItem = items.get(1).getAsJsonObject();
            if (secondItem.has("discount")) {
                double discount = secondItem.get("discount").getAsDouble();
                System.out.println("Discount: " + discount);
            }

            // Converts to the domain type.
            // Fails at runtime if the json value does not match the type.
            Invoice invoice = gson.fromJson(invoiceData, Invoice.class);

            // Access the fields of the domain type.
            id = invoice.id();
            List<InvoiceItem> invoiceItems = invoice.items();
            System.out.println("Invoice items: " + invoiceItems);
    }
}
```