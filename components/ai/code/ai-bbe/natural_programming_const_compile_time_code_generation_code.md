```
import ballerina/http;
import ballerina/test;

final http:Client shopClient = check new ("http://localhost:8080/shop");

function getTestProducts() returns Product[] =>
    const natural {
        Generate list of products with:
        - id: random id starts with "PROD", example:-  "PROD001"
        - price: random decimal between 10.0 and 1000.0
    };

@test:Config
function testFilterProducts() returns error? {
    Product[] filteredProducts = filterProductsAbovePrice(getTestProducts(), 100);
    filteredProducts.forEach(function(Product product) {
        test:assertTrue(product.price > 100d);
    });
}
```
