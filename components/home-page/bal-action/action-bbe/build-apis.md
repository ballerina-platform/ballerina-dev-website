service /catalog on new http:Listener(8080) {
    resource function get [string id]() returns json|error {
        http:Client products = check new ("http://localhost:9091");
        http:Client stock = check new ("http://localhost:9092");
        Product product = check products->/products/[id];
        Stock availability = check stock->/stock/[id];
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            available: availability.available
        };
    }
}
