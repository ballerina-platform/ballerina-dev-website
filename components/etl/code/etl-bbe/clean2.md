```
public type Customer record {|
    string name;
    string city;
    string phone;
|};

public function findDuplicates(Customer[] customers) returns [Customer[], Customer[]] {
    Customer[] duplicates = [];
    Customer[] uniqueCustomers = [];
    foreach Customer customer in customers {
        foreach Customer uniqueCustomer in uniqueCustomers {
            if getEditDistance(customer.name, uniqueCustomer.name) < 3 &&
                getEditDistance(customer.city, uniqueCustomer.city) < 2 &&
                getEditDistance(customer.phone, uniqueCustomer.phone) < 4 {
                duplicates.push(customer);
            } else {
                uniqueCustomers.push(customer);
            }
        }
    }
    return [uniqueCustomers, duplicates];
}
```
