```
public type SalesOrder record {|
    string itemId;
    string customerId;
    string itemName;
    int quantity;
    int date;
|};

public function removeDuplicates(SalesOrder[] orders) returns SalesOrder[] {
    // group the orders with the same itemId, customerId and itemName
    // and select only one of those duplicate values
    return from var {itemId, customerId, itemName, quantity, date} in orders
            group by itemId, customerId, itemName
            select {itemId, 
                    customerId, 
                    itemName, 
                    quantity: [quantity][0], 
                    date: [date][0]
                };
}
```
