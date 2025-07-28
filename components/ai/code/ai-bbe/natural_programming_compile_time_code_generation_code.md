```
public type Product record {|
    string id;
    decimal price;
    int stock;
|};

public type OrderRequest record {|
    string productId;
    int quantity;
|};

public type OrderResponse record {|
    string orderId;
    decimal total;
    string status;
|};

final Product[] products = [
    {id: "PROD001", price: 999.99, stock: 25},
    {id: "PROD002", price: 699.99, stock: 50},
    {id: "PROD003", price: 29.99, stock: 100},
    {id: "PROD004", price: 19.99, stock: 200},
    {id: "PROD005", price: 49.99, stock: 75}
];

function calculateTotalPrice(Product[] products, OrderRequest orderRequest) returns decimal = @natural:code {
    prompt: string `Calculate the total price for the order request using the products list.`
} external;

service /shop on new http:Listener(8080) {
    resource function get products() returns Product[] {
        return products;
    }

    resource function post orders(@http:Payload OrderRequest orderReq) returns OrderResponse|http:BadRequest {

        error? validationError = validateOrder(orderReq);
        if validationError is error {
            return <http:BadRequest>{
                body: validationError.message()
            };
        }

        decimal|error total = calculateTotalPrice(products, orderReq);
        if total is error {
            return {
                body: total.message()
            };
        }

        updateStock(orderReq.productId, orderReq.quantity);

        return {
            orderId: "ORD-" + uuid:createType1AsString().substring(0, 8),
            total: total,
            status: "confirmed"
        };
    }
}
```
