```
import ballerina/http;

public type Product record {|
    string id;
    decimal price;
|};

final Product[] productCatalog = [
    {id: "PROD001", price: 999.99},
    {id: "PROD002", price: 699.99},
    {id: "PROD003", price: 29.99},
    {id: "PROD004", price: 19.99},
    {id: "PROD005", price: 49.99}
];

function filterProductsAbovePrice(Product[] products, decimal priceThreshold) returns Product[] = @natural:code {
    prompt: string `Filter products that have a price greater than the given price threshold.`
} external;

service /shop on new http:Listener(8080) {
    resource function get products/filter(decimal minPrice) returns Product[]|http:BadRequest {
        return filterProductsAbovePrice(productCatalog, minPrice);
    }
}
```
