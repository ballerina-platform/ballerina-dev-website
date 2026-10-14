import ballerina/http;
import ballerina/log;
import ballerina/mcp;

type Stock record {|
    string productId;
    int available;
|};

final http:Client stockClient = check new ("http://localhost:9091");

listener mcp:StreamableHttpListener stockMcpListener = check new (9090);

@mcp:StreamableHttpServiceConfig {
    info: {name: "Product stock", version: "1.0.0"},
    sessionMode: mcp:STATELESS
}
service mcp:StreamableHttpService /mcp on stockMcpListener {

    # Look up the available stock quantity for a given product ID.
    #
    # + productId - The identifier of the product to look up
    # + return - The current stock information, or an error if the lookup fails
    isolated remote function getProductStock(string productId) returns Stock|error {
        Stock|error stock = stockClient->/stock/[productId];
        if stock is error {
            log:printError("Failed to fetch stock details", 'error = stock, productId = productId);
            return error(string `Unable to fetch stock for product ${productId}`, stock);
        }

        log:printInfo("Fetched stock details", productId = productId, available = stock.available);
        return stock;
    }
}
