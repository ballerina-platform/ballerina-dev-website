import ballerina/graphql;

type Inventory record {|
    string id;
    string name;
    int productsCount;
|};

service on new graphql:Listener(8080) {
    resource function get products(string productType) returns Inventory[] {
        return [
            {
                id: "gid://shopify/Collection/841564295",
                name: "IPod",
                productsCount: 15
            },
            {
                id: "gid://shopify/Collection/841564295",
                name: "Iphone",
                productsCount: 4
            },
            {
                id: "gid://shopify/Collection/841564295",
                name: "Galaxy S22",
                productsCount: 30
            }
        ];
    }
}
