listener http:Listener mcpHttp = new (9090);
listener mcp:StreamableHttpListener mcpListener = check new (mcpHttp);

@mcp:StreamableHttpServiceConfig {
    info: {name: "Product stock", version: "1.0.0"},
    sessionMode: mcp:STATELESS
}
service mcp:StreamableHttpService /mcp on mcpListener {
    @mcp:Tool {description: "Look up available stock for a product ID"}
    remote function getProductStock(string productId) returns Stock|error {
        http:Client stock = check new ("http://localhost:9091");
        return stock->/stock/[productId];
    }
}
