```
import ballerina/test;

function getTestProducts() returns Product[] =>
    const natural {
        Generate a list of products with:
        - id: random ID that starts with "PROD". E.g., "PROD001"
        - price: random decimal between 10.0 and 1000.0
    };

@test:Config
function testFilterProducts() returns error? {
    Product[] testProducts = getTestProducts();
    Product[] filteredProducts = filterProductsAbovePrice(testProducts, 100);
    foreach Product product in testProducts {
        int? index = filteredProducts.indexOf(product);
        if product.price > 100d {
            test:assertTrue(index != ());
            continue;
        }

        test:assertTrue(index == ());
    }
}
```
