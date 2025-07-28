```
import ballerina/http;
import ballerina/test;

function getTestProducts() returns Product[] =>
    const natural {
        Generate list of products with:
        - id: random id starts with "PROD", example:-  "PROD001"
        - price: random decimal between 10.0 and 1000.0
    };

@test:Config
function testFilterProducts() returns error? {
    Product[] filteredProducts = filterProductsAbovePrice(getTestProducts(), 100);
    foreach Product product in filteredProducts {
        test:assertTrue(product.price > 100d);
    }
}
```
