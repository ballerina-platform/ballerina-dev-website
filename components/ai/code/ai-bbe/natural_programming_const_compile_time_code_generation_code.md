```
final http:Client shopClient = check new ("http://localhost:8080/shop");
final OrderRequest[] testOrderRequests = getTestOrderRequests();

function getTestOrderRequests() returns OrderRequest[] =>
    const natural {
        Generate list of order requests with:
        - productId: Random id starts with PROD and INVALID, example: PROD001, PROD002, INVALID001
        - quantity: Random integer between 0 and 10
    };

@test:Config
function testProcessOrderRequests() returns error? {
    foreach OrderRequest request in testOrderRequests {
        check testProcessOrderFlow(request);
    }
}
```
