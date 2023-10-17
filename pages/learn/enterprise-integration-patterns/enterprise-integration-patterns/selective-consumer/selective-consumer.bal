import ballerina/graphql;
import ballerina/io;

type InventoryResponse record {|
    record {|Inventory[] products;|} data;
|};

type Inventory record {|
    string name;
    int productsCount;
|};

type CsvRecord record {|
    string name;
    RequestType requestType;
|};

enum RequestType {
    REQUIRED,
    URGENT
};

final graphql:Client shopify = check new ("http://blackwellsbooks.myshopify.com.balmock.io");

public function main(string category) returns error? {
    string csvFilePath = "./resources/orderRequests.csv";
    string document = string `{ products(productType: "${category}") { name, productsCount } } `;
    InventoryResponse inventories = check shopify->execute(document);
    CsvRecord[] csvContent = [];
    foreach var {name, productsCount} in inventories.data.products {
        if productsCount < 10 {
            csvContent.push({name: name, requestType: URGENT});
        } else if productsCount < 25 {
            csvContent.push({name: name, requestType: REQUIRED});
        }
    }
    check io:fileWriteCsv(csvFilePath, csvContent);
}
