---
title: 'Built-in transactions'
description: Data integration Eventually consistency is nice and all, but if you really need to make sure your distributed data integrations run transactionally, then Ballerina makes that effortless and mistake-free for developers with compile-time support.
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/mysql-client-with-transactions/main.bal#L22'
---
```
type Order record {|
    string id;
    string orderDate;
    string productId;
    int quantity;
|};

final mysql:Client db = check new (host, user, password, database, port);

function createOrder(Order salesOrder) returns error? {
    // Start a transaction.
    transaction {
        // Insert into `sales_order` table.
        _ = check db->execute(`INSERT INTO sales_orders VALUES (${salesOrder.id}, ${salesOrder.orderDate}, ${salesOrder.productId}, ${salesOrder.quantity})`);

        // Update product quantity as per the order.
        sql:ExecutionResult inventoryUpdate = check db->execute(`UPDATE inventory SET quantity = quantity - ${salesOrder.quantity} WHERE id = ${salesOrder.productId}`);

        // If the product is not found, rollback or else commit transaction.
        if inventoryUpdate.affectedRowCount == 0 {
            rollback;
            return error(string `Product ${salesOrder.productId} not found.`);
        } else {
            check commit;
        }
    } on fail error e {
        // In case of error, the transaction block is rolled back automatically.
        return error(string `Error occurred while processing the order: ${salesOrder.id}.`, e);
    }
}
```